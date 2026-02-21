$AppPath = 'C:\Users\gamin\OneDrive\Documents\GitHub\Onyx-Vault\src-tauri\target\debug\app.exe'
$CommandValue = "`"$AppPath`" `"%1`""
Set-ItemProperty -Path 'HKCU:\Software\Classes\onyxvault\shell\open\command' -Name '(default)' -Value $CommandValue
