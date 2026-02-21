import { useState, useEffect } from 'react';
import { Shield, Clipboard, RefreshCw, History, Cloud } from 'lucide-react';
import { useVaultStore } from '../store/useStore';
import { invoke } from '@tauri-apps/api/core';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';

export function Settings() {
    const [autoLock, setAutoLock] = useState('5 Minutes');
    const [clipboardTimeout, setClipboardTimeout] = useState(30);
    const { isSyncConnected, setSyncConnected } = useVaultStore();

    useEffect(() => {
        // Deep link listeners for OAuth callback
        let unlistenFn: (() => void) | null = null;

        const setupDeepLink = async () => {
            try {
                // Listen to standard deep links
                unlistenFn = await onOpenUrl(async (urls) => {
                    const callbackUrl = urls.find(u => u.includes('onyxvault://callback'));
                    if (callbackUrl) {
                        try {
                            // Extract code from something like onyxvault://callback?code=4/0Aea...
                            const urlParams = new URLSearchParams(callbackUrl.split('?')[1]);
                            const code = urlParams.get('code');
                            if (code) {
                                // Hand the code directly to Rust over IPC to exchange and secure. Frontend never holds the long-term token.
                                await invoke('exchange_oauth_code_for_token', { code });
                                setSyncConnected(true);
                            }
                        } catch (e) {
                            console.error('Failed to securely process token exchange:', e);
                        }
                    }
                });

                // Also listen for deep links forwarded from a second instance
                const { listen } = await import('@tauri-apps/api/event');
                const unlistenForwarded = await listen<string>('deep-link-received', async (event) => {
                    const callbackUrl = event.payload;
                    if (callbackUrl && callbackUrl.includes('onyxvault://callback')) {
                        try {
                            const urlParams = new URLSearchParams(callbackUrl.split('?')[1]);
                            const code = urlParams.get('code');
                            if (code) {
                                await invoke('exchange_oauth_code_for_token', { code });
                                setSyncConnected(true);
                            }
                        } catch (e) {
                            console.error('Failed to securely process forwarded token exchange:', e);
                        }
                    }
                });

                const unlistenOAuth = await listen<string>('oauth-code-received', async (event) => {
                    const query = event.payload;
                    try {
                        const urlParams = new URLSearchParams(query);
                        const code = urlParams.get('code');
                        if (code) {
                            await invoke('exchange_oauth_code_for_token', { code });
                            setSyncConnected(true);
                        }
                    } catch (e) {
                        console.error('Failed to process oauth code:', e);
                    }
                });

                // Overwrite unlistenFn so that both listeners are cleaned up
                const origUnlistenFn = unlistenFn;
                unlistenFn = () => {
                    if (origUnlistenFn) origUnlistenFn();
                    unlistenForwarded();
                    unlistenOAuth();
                };
            } catch (e) {
                console.error("Deep link listener failed to start:", e);
            }
        };

        setupDeepLink();

        return () => {
            if (unlistenFn) unlistenFn();
        };
    }, [setSyncConnected]);

    const handleConnectClick = async () => {
        try {
            if (!isSyncConnected) {
                await invoke('initiate_google_login');
            } else {
                // Simulate manual sync trigger
                console.log("Triggering manual sync...");
            }
        } catch (e) {
            console.error('Failed to initiate login flow:', e);
        }
    };

    return (
        <div className="flex flex-col h-full w-full custom-scrollbar overflow-y-auto pb-12 pr-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[28px] font-bold text-white tracking-tight">Settings & Preferences</h1>
                <p className="text-[15px] font-medium text-slate-400 mt-1.5">Manage your vault security, clipboard behavior, and sync options.</p>
            </div>

            <div className="h-px w-full bg-[#1e2330] mb-8"></div>

            <div className="flex flex-col gap-10 max-w-[840px]">
                {/* Security Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-white">Security</h2>
                    </div>
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-[#1e2330] flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Auto-lock Vault</h3>
                                <p className="text-[13px] font-medium text-slate-400 mt-1">Automatically lock the vault after a period of inactivity.</p>
                            </div>
                            <div className="relative">
                                <select
                                    value={autoLock}
                                    onChange={(e) => setAutoLock(e.target.value)}
                                    className="bg-[#111622] border border-[#1e2330] text-[13px] font-semibold text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 appearance-none min-w-[150px] pr-8 cursor-pointer transition-colors hover:bg-[#1a2133]"
                                >
                                    <option>1 Minute</option>
                                    <option>5 Minutes</option>
                                    <option>15 Minutes</option>
                                    <option>1 Hour</option>
                                    <option>Never</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Master Password</h3>
                                <p className="text-[13px] font-medium text-slate-400 mt-1">Change your master password regularly to keep your vault secure.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-[#2d3748] rounded-xl text-[13px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                                <RefreshCw className="w-4 h-4" /> Change Password
                            </button>
                        </div>
                    </div>
                </section>

                {/* Clipboard Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Clipboard className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-white">Clipboard</h2>
                    </div>
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl shadow-xl p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Clear Clipboard Timeout</h3>
                                <p className="text-[13px] font-medium text-slate-400 mt-1 max-w-md">Automatically clear copied passwords from your clipboard to prevent accidental pasting.</p>
                            </div>
                            <div className="bg-blue-600/10 text-blue-500 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-500/20">
                                {clipboardTimeout} seconds
                            </div>
                        </div>

                        <div className="mt-4">
                            <input
                                type="range"
                                min="10"
                                max="120"
                                step="10"
                                value={clipboardTimeout}
                                onChange={(e) => setClipboardTimeout(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between mt-3 text-[11px] font-semibold text-slate-500">
                                <span>10s</span>
                                <span>60s</span>
                                <span>120s</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sync Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <RefreshCw className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-bold text-white">Sync</h2>
                    </div>
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl overflow-hidden shadow-xl p-6 relative">
                        <div className="absolute -bottom-8 -right-4 opacity-[0.03] text-white">
                            <Cloud className="w-48 h-48" />
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md shrink-0">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.424 5.76025L10.37 14.5065L6.96001 8.52026C6.75806 8.16913 6.37893 7.95156 5.97501 7.95156H0.400024L5.45203 16.6975H14.188L20.472 5.76025H15.424Z" fill="#00832D" />
                                        <path d="M23.596 16.7119C23.799 16.3608 23.805 15.9288 23.606 15.572L18.57 6.84302H8.46191L13.498 15.572C13.697 15.9288 14.072 16.149 14.47 16.149H23.596V16.7119Z" fill="#FFC107" />
                                        <path d="M12.015 11.234H22.091L17.062 2.508C16.862 2.15283 16.486 1.9353 16.086 1.9353H6.01196L11.039 10.661C11.109 10.7839 11.202 10.893 11.314 10.982C11.517 11.144 11.761 11.234 12.015 11.234Z" fill="#0066DA" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-bold text-white">Google Drive Backup</h3>
                                        {isSyncConnected ? (
                                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                Connected
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[11px] font-bold border border-slate-500/20">
                                                Disconnected
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[13px] font-medium text-slate-400 mt-1 mb-1.5">
                                        {isSyncConnected ? "Your vault is encrypted and synced securely." : "Connect your Google Drive to enable encrypted backups."}
                                    </p>
                                    {isSyncConnected && (
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                                            <History className="w-3 h-3" /> Last synced: 2 minutes ago
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleConnectClick}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-colors ${isSyncConnected ? 'bg-[#1e2330] hover:bg-[#2d3748] border border-slate-700' : 'bg-blue-600 hover:bg-blue-500'}`}
                            >
                                {isSyncConnected ? (
                                    <>
                                        <RefreshCw className="w-[18px] h-[18px]" /> Sync Now
                                    </>
                                ) : (
                                    "Connect Google Drive"
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
