import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useVaultStore } from '../store/useStore';

export function UnlockScreen() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const navigate = useNavigate();
    const { setMasterKey, setItems } = useVaultStore();

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password && !isUnlocking) {
            setIsUnlocking(true);
            try {
                const { invoke } = await import('@tauri-apps/api/core');

                // 1. Check if a vault already exists by grabbing its salt
                const existingSalt = await invoke<string | null>('get_vault_salt');

                // 2. Burn ~0.5s doing Argon2id to yield a base64 encryption key + salt
                const [b64Key, newOrExistingSalt] = await invoke<[string, string]>('derive_encryption_key', {
                    password: password,
                    salt: existingSalt
                });

                if (existingSalt) {
                    try {
                        // 3a. If vault exists, attempt decryption. AES-256-GCM will forcefully reject a bad password.
                        const decryptedStr = await invoke<string>('load_vault_data', { keyB64: b64Key });
                        const parsedItems = JSON.parse(decryptedStr);
                        setItems(parsedItems);
                        console.log("Vault loaded and decrypted successfully!");
                    } catch (e) {
                        alert("Incorrect Master Password!");
                        throw new Error("Invalid password");
                    }
                } else {
                    // 3b. First time setup! Save an empty vault to lock in this password permanently
                    const emptyVaultData = JSON.stringify([]);
                    await invoke('save_vault_data', {
                        keyB64: b64Key,
                        salt: newOrExistingSalt,
                        plaintext: emptyVaultData
                    });
                    console.log("New encrypted vault created successfully!");
                }

                // Set the derived key in zustand memory
                setMasterKey(b64Key);

                // Absolutely critical: wipe the plaintext master password from React state memory instantly
                setPassword('');

                // Proceed into the vault
                navigate('/vault');
            } catch (err) {
                console.error("Failed to unlock:", err);
            } finally {
                setIsUnlocking(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Top Left Brand */}
            <div className="absolute top-12 left-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    <Box className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">VaultSecure</span>
            </div>

            {/* Top Right Help */}
            <button className="absolute top-12 right-8 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">?</div>
                Help Center
            </button>

            {/* Main Content */}
            <div className="w-full max-w-[440px] z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                    <Lock className="w-7 h-7 text-blue-500" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome back</h1>
                <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed max-w-[320px]">
                    Your vault is encrypted. Enter your Master Password to access your data.
                </p>

                <form onSubmit={handleUnlock} className="w-full bg-[#1e293b]/50 border border-slate-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-4 h-4 text-slate-500" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Master Password"
                            className="w-full bg-[#0f172a]/80 border border-slate-700/50 rounded-xl py-3.5 pl-11 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isUnlocking}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] ring-1 ring-blue-500/50 mb-6 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUnlocking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Vault"}
                    </button>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-400">i</span>
                        </div>
                        <p className="text-[13px] text-slate-400 leading-relaxed">
                            <span className="text-slate-200 font-semibold">Zero-Knowledge Security: </span>
                            We do not store your master password. If you lose it, your vault cannot be recovered.
                        </p>
                    </div>
                </form>

                <button className="mt-8 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
                    Not you? Switch account
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>

            <p className="absolute bottom-8 text-xs text-slate-500">
                © 2024 VaultSecure Inc. All rights reserved. Encrypted locally.
            </p>
        </div>
    );
}
