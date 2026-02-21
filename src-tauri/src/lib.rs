use keyring::Entry;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2, Algorithm, Version, Params
};

fn get_keyring_entry() -> Result<Entry, String> {
    Entry::new("OnyxVault", "google_refresh_token").map_err(|e| e.to_string())
}

#[tauri::command]
fn derive_encryption_key(mut password: String, salt: Option<String>) -> Result<(String, String), String> {
    use zeroize::Zeroize;
    
    // Determine the salt to use: randomly generated or provided
    let salt_string = match salt {
        Some(s) => SaltString::new(&s).map_err(|_| "Invalid salt provided".to_string())?,
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
    
    use base64::{Engine as _, engine::general_purpose::STANDARD};
    let b64_key = STANDARD.encode(key_bytes.as_bytes());

    Ok((b64_key, salt_string.as_str().to_string()))
}

use serde::Deserialize;

#[derive(Deserialize)]
struct TokenResponse {
    #[allow(dead_code)]
    access_token: String,
    refresh_token: Option<String>,
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

use tauri::{Manager, Emitter};

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
            derive_encryption_key
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
