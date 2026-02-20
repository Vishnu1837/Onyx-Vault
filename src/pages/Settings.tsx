import { useState } from 'react';
import { Shield, Clipboard, RefreshCw, History, Cloud } from 'lucide-react';

export function Settings() {
    const [autoLock, setAutoLock] = useState('5 Minutes');
    const [clipboardTimeout, setClipboardTimeout] = useState(30);

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
                                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            Connected
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-medium text-slate-400 mt-1 mb-1.5">Your vault is encrypted and synced securely.</p>
                                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                                        <History className="w-3 h-3" /> Last synced: 2 minutes ago
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm">
                                <RefreshCw className="w-[18px] h-[18px]" /> Sync Now
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
