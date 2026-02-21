use keyring::Entry;

fn get_keyring_entry() -> Result<Entry, String> {
    Entry::new("OnyxVault", "google_refresh_token").map_err(|e| e.to_string())
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
fn initiate_google_login() -> Result<(), String> {
    // Construct OAuth URL (Using a placeholder client ID for the architecture implementation)
    let client_id = "USER_GOOGLE_CLIENT_ID_PLACEHOLDER";
    let redirect_uri = "onyxvault://callback";
    let scope = "https://www.googleapis.com/auth/drive.appdata";
    // Replace & with ^& for Windows CMD
    let auth_url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?client_id={}^&redirect_uri={}^&response_type=code^&scope={}^&access_type=offline^&prompt=consent",
        client_id, redirect_uri, scope
    );

    #[cfg(target_os = "windows")]
    std::process::Command::new("cmd")
        .args(["/C", "start", "", &auth_url])
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn exchange_oauth_code_for_token(code: String) -> Result<(), String> {
    // In a production application:
    // 1. reqwest::Client::new().post("https://oauth2.googleapis.com/token")...
    // 2. Exchange 'code' + client_id + client_secret for the auth payload
    // 3. Extract the 'refresh_token'
    
    // For this architectural implementation, we simulate the exchange and test the absolute security of writing to the Windows Credential Manager.
    let simulated_refresh_token = format!("mock_refresh_token_for_code:{}", code);
    
    if let Ok(entry) = get_keyring_entry() {
        entry.set_password(&simulated_refresh_token).map_err(|e| e.to_string())?;
    } else {
        return Err("Could not access Windows Credential Manager".into());
    }
    
    Ok(())
}

#[tauri::command]
fn test_security_bridge(name: &str) -> String {
    format!("Hello {}, the secure bridge to Rust is active!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_deep_link::init())
    .invoke_handler(tauri::generate_handler![
        test_security_bridge,
        initiate_google_login,
        check_sync_status,
        exchange_oauth_code_for_token
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
