import { Shield, RefreshCw, Unlock, History, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVaultStore } from '../store/useStore';
import { useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function SecurityDashboard() {
    const navigate = useNavigate();
    const { items } = useVaultStore();

    const handleTestBridge = async () => {
        try {
            const response = await invoke('test_security_bridge', { name: 'Frontend' });
            console.log("Rust says: ", response);
            alert(response as string);
        } catch (error) {
            console.error("IPC Error: ", error);
        }
    };

    const {
        reusedCount,
        weakCount,
        oldCount,
        atRiskAccounts,
        healthScore
    } = useMemo(() => {
        let weak = 0;
        let old = 0;
        const passwordCounts: Record<string, number> = {};

        const now = Date.now();
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;

        // Weak criteria: < 8 chars, or missing lowercase, uppercase, number, or special char.
        const isWeak = (pw: string) => {
            if (pw.length < 8) return true;
            if (!/[A-Z]/.test(pw)) return true;
            if (!/[a-z]/.test(pw)) return true;
            if (!/[0-9]/.test(pw)) return true;
            if (!/[^A-Za-z0-9]/.test(pw)) return true;
            return false;
        };

        items.forEach(item => {
            if (item.password) {
                passwordCounts[item.password] = (passwordCounts[item.password] || 0) + 1;
            }
        });

        const reusedSet = new Set<string>();
        Object.keys(passwordCounts).forEach(pw => {
            if (passwordCounts[pw] > 1) {
                reusedSet.add(pw);
            }
        });

        const riskAccounts: any[] = [];

        items.forEach(item => {
            let hasRisk = false;
            let riskType = '';
            let riskLabel = '';

            // Check reused
            const isReused = item.password && reusedSet.has(item.password);

            // Check weak
            const itemIsWeak = !item.password || isWeak(item.password) || item.strength === 'Weak';
            if (itemIsWeak) weak++;

            // Check old
            let itemIsOld = false;
            let ageYears = 0;
            if (item.lastModified) {
                const ageMs = now - new Date(item.lastModified).getTime();
                if (ageMs > oneYearMs) {
                    itemIsOld = true;
                    ageYears = Math.floor(ageMs / oneYearMs);
                    old++;
                }
            }

            if (itemIsWeak) {
                hasRisk = true;
                riskType = 'weak';
                riskLabel = 'Weak';
            } else if (isReused) {
                hasRisk = true;
                riskType = 'reused';
                riskLabel = 'Reused';
            } else if (itemIsOld) {
                hasRisk = true;
                riskType = 'old';
                riskLabel = `Old (${ageYears}y)`;
            }

            if (hasRisk) {
                riskAccounts.push({
                    item,
                    riskType,
                    riskLabel
                });
            }
        });

        let reusedTotalAccounts = 0;
        Object.values(passwordCounts).forEach(count => {
            if (count > 1) reusedTotalAccounts += count;
        });

        // Health score calculation
        const penalty = (weak * 10) + (reusedTotalAccounts * 5) + (old * 2);
        const score = Math.max(0, 100 - penalty);

        return {
            reusedCount: reusedTotalAccounts,
            weakCount: weak,
            oldCount: old,
            atRiskAccounts: riskAccounts,
            healthScore: Math.round(score)
        };

    }, [items]);

    return (
        <div className="flex flex-col h-full w-full custom-scrollbar overflow-y-auto pb-12 pr-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight">Security Dashboard</h1>
                    <p className="text-[15px] font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
                        Your vault is <span className="text-emerald-400 font-bold">{healthScore}% secure</span>. {atRiskAccounts.length > 0 ? `You are doing well, but ${atRiskAccounts.length} accounts need attention.` : 'All your accounts look secure!'}
                    </p>
                </div>
                <button
                    onClick={handleTestBridge}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                    <Shield className="w-4 h-4" /> Scan Vault
                </button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {/* Overall Health Card */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="absolute right-0 top-0 w-32 h-32 opacity-[0.03] text-emerald-500 flex items-center justify-center -translate-y-4 translate-x-4 pointer-events-none">
                        <Shield className="w-full h-full" />
                    </div>
                    <div className="flex justify-between items-start relative z-10 text-slate-400 text-sm font-semibold">
                        Overall Health Score
                    </div>
                    <div className="relative z-10 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white tracking-tight">{healthScore}</span>
                        <span className="text-slate-500 font-medium">/100</span>
                        <span className="text-emerald-400 text-sm font-bold flex items-center ml-2">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +5%
                        </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden relative z-10">
                        <div className={`h-2 rounded-full ${healthScore < 50 ? 'bg-red-500' : healthScore < 80 ? 'bg-orange-500' : 'bg-gradient-to-r from-blue-500 to-emerald-400'}`} style={{ width: `${healthScore}%` }}></div>
                    </div>
                </div>

                {/* Reused Passwords */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${reusedCount > 0 ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                            <RefreshCw className="w-4 h-4" />
                        </div>
                        {reusedCount > 0 && <span className="bg-orange-500/10 text-orange-500 text-[11px] px-2 py-0.5 rounded-full font-bold">Needs Action</span>}
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs font-semibold mb-1">Reused Passwords</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">{reusedCount}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 w-full truncate">{reusedCount > 0 ? 'Accounts sharing passwords' : 'No reused passwords'}</p>
                    </div>
                </div>

                {/* Weak Passwords */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${weakCount > 0 ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                            <Unlock className="w-4 h-4" />
                        </div>
                        {weakCount > 0 && <span className="bg-red-500/10 text-red-500 text-[11px] px-2 py-0.5 rounded-full font-bold">Critical Risk</span>}
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs font-semibold mb-1">Weak Passwords</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">{weakCount}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 w-full truncate">{weakCount > 0 ? 'Update immediately' : 'All passwords are strong'}</p>
                    </div>
                </div>

                {/* Old Passwords */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${oldCount > 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                            <History className="w-4 h-4" />
                        </div>
                        {oldCount > 0 && <span className="bg-blue-500/10 text-blue-500 text-[11px] px-2 py-0.5 rounded-full font-bold">Action Suggested</span>}
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs font-semibold mb-1">Old Passwords</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">{oldCount}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 w-full truncate">&gt; 1 year old</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* At Risk Accounts Table */}
                <div className="xl:col-span-2 bg-[#161b22] border border-[#1e2330] rounded-2xl flex flex-col shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-[#1e2330] flex justify-between items-center bg-slate-800/20">
                        <h2 className="text-lg font-bold text-white">At Risk Accounts</h2>
                        {atRiskAccounts.length > 0 && <button className="text-[13px] font-semibold text-blue-500 hover:text-blue-400 transition-colors">Fix All ({atRiskAccounts.length})</button>}
                    </div>

                    <div className="overflow-x-auto">
                        {atRiskAccounts.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <Shield className="w-12 h-12 text-emerald-500 mb-4 opacity-50" />
                                <h3 className="text-lg font-bold text-white mb-1">All Clear!</h3>
                                <p className="text-sm font-medium text-slate-400">No accounts are currently considered at risk.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#1e2330]">
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider w-[30%]">Account</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Username</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Risk Type</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2330]">
                                    {atRiskAccounts.map((account, index) => (
                                        <tr key={index} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5 shrink-0 overflow-hidden">
                                                        <img src={account.item.iconUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.item.title)}&background=random`} alt={account.item.title} className="w-full h-full object-contain" />
                                                    </div>
                                                    <span className="font-bold text-slate-200 text-sm">{account.item.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-400">{account.item.username}</td>
                                            <td className="px-6 py-4">
                                                {account.riskType === 'weak' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[11px] font-bold border border-red-500/20">
                                                        <AlertTriangle className="w-3 h-3" /> {account.riskLabel}
                                                    </span>
                                                )}
                                                {account.riskType === 'reused' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 text-[11px] font-bold border border-orange-500/20">
                                                        <RefreshCw className="w-3 h-3" /> {account.riskLabel}
                                                    </span>
                                                )}
                                                {account.riskType === 'old' && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-bold border border-blue-500/20">
                                                        <History className="w-3 h-3" /> {account.riskLabel}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => navigate(`/vault/item/${account.item.id}`)}>Update</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Column: Chart & CTA */}
                <div className="flex flex-col gap-6">
                    {/* Health Trend Chart Dummy */}
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Health Trend</h3>
                                <div className="text-lg font-bold text-white tracking-tight">Last 30 Days</div>
                            </div>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[11px] px-2 py-0.5 rounded-full font-bold">+12%</span>
                        </div>

                        {/* CSS-only chart representation */}
                        <div className="flex-1 min-h-[140px] relative mt-2">
                            {/* Grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-full h-px border-b border-dashed border-slate-800"></div>
                                ))}
                            </div>

                            {/* SVG Chart Line */}
                            <div className="absolute inset-0 pt-4 pb-2">
                                <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 0 80 C 15 80, 20 60, 30 70 C 40 80, 45 40, 60 50 C 75 60, 85 20, 100 10" fill="url(#chartGradient)" />
                                    <path d="M 0 80 C 15 80, 20 60, 30 70 C 40 80, 45 40, 60 50 C 75 60, 85 20, 100 10" fill="none" stroke="#3b82f6" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                                    {/* Dots */}
                                    <circle cx="30" cy="70" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    <circle cx="60" cy="50" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    <circle cx="85" cy="30" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    <circle cx="100" cy="10" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>

                    {/* Enable 2FA CTA */}
                    <div className="bg-gradient-to-br from-[#1a2c5a] to-[#12182b] border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
                                <Key className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Enable 2FA</h3>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed mb-5">
                                Secure your most critical accounts by enabling 2-Factor Authentication.
                            </p>
                            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors text-center">
                                View Recommendations
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
                <span className="text-[11px] font-medium text-slate-500">Last scanned: Today, 10:42 AM • <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/vault/settings'); }}>Settings</a></span>
            </div>

        </div>
    );
}
