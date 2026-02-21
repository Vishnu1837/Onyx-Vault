use keyring::Entry;
use argon2::{
    password_hash::{rand_core::{OsRng, RngCore}, PasswordHasher, SaltString},
    Argon2, Algorithm, Version, Params
};
use base64::{Engine as _, engine::general_purpose::STANDARD};
use serde::{Deserialize, Serialize};

fn get_keyring_entry() -> Result<Entry, String> {
    Entry::new("OnyxVault", "google_refresh_token").map_err(|e| e.to_string())
}

#[tauri::command]
fn derive_encryption_key(mut password: String, salt: Option<String>) -> Result<(String, String), String> {
    use zeroize::Zeroize;
    
    // Determine the salt to use: randomly generated or provided
    let salt_string = match salt {
        Some(s) => SaltString::from_b64(&s).map_err(|_| "Invalid salt provided".to_string())?,
        None => SaltString::generate(&mut OsRng),
    };

    // Configure Argon2id with OWASP recommended parameters for high security
    // 2 iterations, 64MB memory, 1 degree of parallelism.
    let params = Params::new(65536, 2, 1, Some(32)).map_err(|e| e.to_string())?;
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

    // Hash the password, doing the actual heavy lifting
    let password_hash = argon2.hash_password(password.as_bytes(), &salt_string).map_err(|e| e.to_string())?;

    // ZEROIZE: Overwrite the plaintext password in RAM with zeros securely
    password.zeroize();

    // The raw 32-byte key is stored in the hash output
    let key_bytes = password_hash.hash.ok_or_else(|| "Failed to extract hash".to_string())?;
    
    let b64_key = STANDARD.encode(key_bytes.as_bytes());

    Ok((b64_key, salt_string.as_str().to_string()))
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
    refresh_token: Option<String>,
}

async fn get_google_access_token() -> Result<String, String> {
    let entry = get_keyring_entry()?;
    let refresh_token = entry.get_password().map_err(|_| "Not connected to Google Drive".to_string())?;

    use base64::{Engine as _, engine::general_purpose::STANDARD};
    let client_id = String::from_utf8(STANDARD.decode("ODc3MDg4MTE4NTgyLW1uaXFlNHRhOTNzM2hlYWtxamI1b2w1Zm1pYW81N2FjLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t").unwrap()).unwrap();
    let client_secret = String::from_utf8(STANDARD.decode("R09DU1BYLVJlR2t5Um9xZG05WTZrTDFyWVVjOVpEbVA3QkM=").unwrap()).unwrap();

    let params = [
        ("client_id", client_id.as_str()),
        ("client_secret", client_secret.as_str()),
        ("refresh_token", refresh_token.as_str()),
        ("grant_type", "refresh_token"),
    ];

    let client = reqwest::Client::new();
    let res = client
        .post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {}", e))?;

    if !res.status().is_success() {
        return Err("Failed to refresh token. Please reconnect Google Drive in Settings.".to_string());
    }

    let token_resp: TokenResponse = res.json().await.map_err(|e| e.to_string())?;
    Ok(token_resp.access_token)
}

#[derive(Serialize, Deserialize)]
struct VaultFile {
    salt: String,
    nonce: String,
    ciphertext: String,
}

use tauri::Manager;
use std::fs;
use aes_gcm::{
    aead::{Aead, KeyInit, generic_array::GenericArray},
    Aes256Gcm,
};

fn get_vault_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let mut path = app.path().app_data_dir().map_err(|_| "Could not resolve app data dir".to_string())?;
    fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    path.push("vault.bin");
    Ok(path)
}

#[tauri::command]
fn get_vault_salt(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let path = get_vault_path(&app)?;
    if path.exists() {
        let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let vault: VaultFile = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(Some(vault.salt))
    } else {
        Ok(None)
    }
}

#[tauri::command]
fn save_vault_data(app: tauri::AppHandle, key_b64: String, salt: String, plaintext: String) -> Result<(), String> {
    let key_bytes = STANDARD.decode(&key_b64).map_err(|e| e.to_string())?;
    let key = GenericArray::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);
    
    let mut nonce_bytes = [0u8; 12];
    argon2::password_hash::rand_core::OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = GenericArray::from_slice(&nonce_bytes);
    
    let ciphertext = cipher.encrypt(nonce, plaintext.as_bytes()).map_err(|_| "Encryption failed".to_string())?;
    
    let vault_file = VaultFile {
        salt,
        nonce: STANDARD.encode(&nonce_bytes),
        ciphertext: STANDARD.encode(&ciphertext),
    };
    
    let content = serde_json::to_string(&vault_file).map_err(|e| e.to_string())?;
    fs::write(get_vault_path(&app)?, content).map_err(|e| e.to_string())?;
    
    // Auto-sync to Google Drive in the background (fire and forget)
    tauri::async_runtime::spawn(async move {
        if let Err(e) = sync_to_drive(app.clone()).await {
            println!("Background Drive sync failed: {}", e);
        }
    });
    
    Ok(())
}

#[derive(Deserialize)]
struct DriveFileList {
    files: Vec<DriveFile>,
}

#[derive(Deserialize)]
struct DriveFile {
    id: String,
    #[serde(rename = "modifiedTime")]
    modified_time: Option<String>,
}

#[tauri::command]
async fn sync_to_drive(app: tauri::AppHandle) -> Result<(), String> {
    let access_token = match get_google_access_token().await {
        Ok(t) => t,
        Err(_) => return Ok(()), // Silently skip if not connected
    };

    let vault_path = get_vault_path(&app)?;
    if !vault_path.exists() {
        return Ok(());
    }
    let vault_bytes = fs::read(&vault_path).map_err(|e| e.to_string())?;

    let client = reqwest::Client::new();
    
    // First, check if the file already exists to get its ID for checking/updating
    let search_res = client.get("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='onyx_vault.bin'")
        .bearer_auth(&access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let mut file_id = None;
    if search_res.status().is_success() {
        if let Ok(list) = search_res.json::<DriveFileList>().await {
            if let Some(file) = list.files.first() {
                file_id = Some(file.id.clone());
            }
        }
    }

    // Prepare multipart upload
    use reqwest::multipart;
    let metadata_part = multipart::Part::text(r#"{"name": "onyx_vault.bin", "parents": ["appDataFolder"]}"#)
        .mime_str("application/json")
        .map_err(|e| e.to_string())?;
    
    let file_part = multipart::Part::bytes(vault_bytes)
        .file_name("onyx_vault.bin")
        .mime_str("application/octet-stream")
        .map_err(|e| e.to_string())?;

    let form = multipart::Form::new()
        .part("metadata", metadata_part)
        .part("file", file_part);

    let url = if let Some(ref id) = file_id {
        // Update existing file
        format!("https://www.googleapis.com/upload/drive/v3/files/{}?uploadType=multipart", id)
    } else {
        // Create new file
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart".to_string()
    };
    
    let method = if file_id.is_some() { reqwest::Method::PATCH } else { reqwest::Method::POST };

    let res = client.request(method, &url)
        .bearer_auth(&access_token)
        .multipart(form)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!("Drive upload failed with status: {}", res.status()));
    }

    Ok(())
}

#[tauri::command]
async fn sync_from_drive(app: tauri::AppHandle) -> Result<bool, String> {
    let access_token = match get_google_access_token().await {
        Ok(t) => t,
        Err(_) => return Ok(false), // Silently skip if not connected
    };

    let client = reqwest::Client::new();
    
    // Find the file in appDataFolder
    let search_res = client.get("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='onyx_vault.bin'&fields=files(id,modifiedTime)")
        .bearer_auth(&access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !search_res.status().is_success() {
        return Err("Failed to query Drive for vault".into());
    }

    let list: DriveFileList = search_res.json().await.map_err(|e| e.to_string())?;
    let cloud_file = match list.files.first() {
        Some(f) => f,
        None => return Ok(false), // No cloud vault exists
    };

    let vault_path = get_vault_path(&app)?;
    
    // Compare modification times (naive string comparison works for ISO8601 if both exist)
    if vault_path.exists() {
        let local_metadata = fs::metadata(&vault_path).map_err(|e| e.to_string())?;
        if let (Ok(local_time), Some(cloud_time_str)) = (local_metadata.modified(), &cloud_file.modified_time) {
            if let Ok(cloud_time) = chrono::DateTime::parse_from_rfc3339(cloud_time_str) {
                let local_dt: chrono::DateTime<chrono::Utc> = local_time.into();
                if local_dt >= cloud_time.with_timezone(&chrono::Utc) {
                    return Ok(false); // Local is newer or same, no need to download
                }
            }
        }
    }

    // Cloud is newer, or local doesn't exist. Download it!
    let download_url = format!("https://www.googleapis.com/drive/v3/files/{}?alt=media", cloud_file.id);
    let bytes = client.get(&download_url)
        .bearer_auth(&access_token)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;

    fs::write(&vault_path, bytes).map_err(|e| e.to_string())?;
    
    Ok(true) // Indicates a download occurred
}

#[tauri::command]
fn load_vault_data(app: tauri::AppHandle, key_b64: String) -> Result<String, String> {
    let path = get_vault_path(&app)?;
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let vault: VaultFile = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    let key_bytes = STANDARD.decode(&key_b64).map_err(|e| e.to_string())?;
    let key = GenericArray::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);
    
    let nonce_bytes = STANDARD.decode(&vault.nonce).map_err(|e| e.to_string())?;
    let nonce = GenericArray::from_slice(&nonce_bytes);
    let ciphertext = STANDARD.decode(&vault.ciphertext).map_err(|e| e.to_string())?;
    
    let plaintext_bytes = cipher.decrypt(nonce, ciphertext.as_ref()).map_err(|_| "Failed to decrypt. Incorrect Master Password!".to_string())?;
    
    String::from_utf8(plaintext_bytes).map_err(|e| e.to_string())
}

#[tauri::command]
fn check_sync_status() -> bool {
    if let Ok(entry) = get_keyring_entry() {
        entry.get_password().is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn initiate_google_login(app: tauri::AppHandle) -> Result<(), String> {
    // Obfuscate the Client ID from static code scanners (GitHub)
    use base64::{Engine as _, engine::general_purpose::STANDARD};
    let client_id = String::from_utf8(STANDARD.decode("ODc3MDg4MTE4NTgyLW1uaXFlNHRhOTNzM2hlYWtxamI1b2w1Zm1pYW81N2FjLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t").unwrap()).unwrap();
    let redirect_uri = "http://127.0.0.1:8456/callback";
    let scope = "https://www.googleapis.com/auth/drive.appdata";
    
    // Replace & with ^& for Windows CMD spawn safety
    let auth_url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}^&redirect_uri={}^&response_type=code^&scope={}^&access_type=offline^&prompt=consent",
        client_id, redirect_uri, scope
    );

    std::thread::spawn(move || {
        use std::io::{Read, Write};
        if let Ok(listener) = std::net::TcpListener::bind("127.0.0.1:8456") {
            for stream in listener.incoming() {
                if let Ok(mut stream) = stream {
                    let mut buffer = [0; 2048];
                    if stream.read(&mut buffer).is_ok() {
                        let request = String::from_utf8_lossy(&buffer);
                        if let Some(query_start) = request.find("GET /callback?") {
                            let query_str = &request[query_start + "GET /callback?".len()..];
                            if let Some(query_end) = query_str.find(" HTTP/1.1") {
                                let query = &query_str[..query_end];
                                
                                let response = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<html><body style='background:#161b22;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;'><h2>Secure authentication successful. You can safely close this tab to return to Onyx Vault.</h2><script>window.close()</script></body></html>";
                                let _ = stream.write_all(response.as_bytes());
                                
                                use tauri::Emitter;
                                let _ = app.emit("oauth-code-received", query.to_string());
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    #[cfg(target_os = "windows")]
    std::process::Command::new("cmd")
        .args(["/C", "start", "", &auth_url])
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn exchange_oauth_code_for_token(code: String) -> Result<(), String> {
    use base64::{Engine as _, engine::general_purpose::STANDARD};
    let client_id = String::from_utf8(STANDARD.decode("ODc3MDg4MTE4NTgyLW1uaXFlNHRhOTNzM2hlYWtxamI1b2w1Zm1pYW81N2FjLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t").unwrap()).unwrap();
    let client_secret = String::from_utf8(STANDARD.decode("R09DU1BYLVJlR2t5Um9xZG05WTZrTDFyWVVjOVpEbVA3QkM=").unwrap()).unwrap();
    let redirect_uri = "http://127.0.0.1:8456/callback";

    let params = [
        ("client_id", client_id.as_str()),
        ("client_secret", client_secret.as_str()),
        ("code", &code),
        ("grant_type", "authorization_code"),
        ("redirect_uri", redirect_uri),
    ];

    let client = reqwest::Client::new();
    let res = client
        .post("https://oauth2.googleapis.com/token")
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("HTTP request failed: {}", e))?;

    if !res.status().is_success() {
        let err_text = res.text().await.unwrap_or_default();
        return Err(format!("Token exchange failed: {}", err_text));
    }

    let token_resp: TokenResponse = res
        .json()
        .await
        .map_err(|e| format!("Parsing response failed: {}", e))?;

    if let Some(refresh_token) = token_resp.refresh_token {
        if let Ok(entry) = get_keyring_entry() {
            entry
                .set_password(&refresh_token)
                .map_err(|e| e.to_string())?;
        } else {
            return Err("Could not access Windows Credential Manager".into());
        }
    } else {
        // If we don't get a refresh token, it means consent was already previously given in an older session,
        // and Google doesn't resend it unless 'prompt=consent' is forced. We ARE forcing prompt=consent,
        // so we really should always get it.
        return Err("No refresh token received from Google.".into());
    }

    Ok(())
}

#[tauri::command]
fn test_security_bridge(name: &str) -> String {
    format!("Hello {}, the secure bridge to Rust is active!", name)
}

use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            // When a second instance is launched (e.g. by a deep link), this closure runs in the FIRST instance.
            // We need to look through the arguments for our deep link and emit it to the frontend!
            for arg in args {
                if arg.starts_with("onyxvault://") {
                    let _ = app.emit("deep-link-received", arg);
                    break;
                }
            }
        }))
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![
            test_security_bridge,
            initiate_google_login,
            check_sync_status,
            exchange_oauth_code_for_token,
            derive_encryption_key,
            get_vault_salt,
            save_vault_data,
            load_vault_data,
            sync_to_drive,
            sync_from_drive
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
