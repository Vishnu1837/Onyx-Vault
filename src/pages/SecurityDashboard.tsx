import { Shield, RefreshCw, Unlock, History, Key, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVaultStore } from '../store/useStore';
import { useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function SecurityDashboard() {
    const navigate = useNavigate();
    const { items, categories } = useVaultStore();

    // Returns a relative time string like "3 min ago"
    const timeAgo = (iso?: string) => {
        if (!iso) return 'Just now';
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
        return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
    };

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

    // Last 5 items added (newest first = beginning of array since addItem prepends)
    const recentItems = items.slice(0, 5);

    const strengthConfig = (s: string) => {
        switch (s) {
            case 'Very Strong': return { label: 'Very Strong', bars: 4, color: 'bg-emerald-500' };
            case 'Strong': return { label: 'Strong', bars: 3, color: 'bg-green-400' };
            case 'Medium': return { label: 'Medium', bars: 2, color: 'bg-orange-400' };
            default: return { label: 'Weak', bars: 1, color: 'bg-red-500' };
        }
    };

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
                {/* Recently Added */}
                <div className="xl:col-span-2 bg-[#161b22] border border-[#1e2330] rounded-2xl flex flex-col shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-[#1e2330] flex justify-between items-center bg-slate-800/20">
                        <h2 className="text-lg font-bold text-white">Recently Added</h2>
                        <button
                            onClick={() => navigate('/vault/new', { state: { mode: 'website' } })}
                            className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {recentItems.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
                            <Key className="w-12 h-12 text-slate-600 mb-4" />
                            <h3 className="text-base font-bold text-white mb-1">No passwords yet</h3>
                            <p className="text-sm font-medium text-slate-400">Add your first password to see it here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#1e2330]">
                            {recentItems.map((item) => {
                                const cat = categories.find(c => c.id === item.categoryId);
                                const str = strengthConfig(item.strength);
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                        onClick={() => navigate(`/vault/item/${item.id}`)}
                                    >
                                        {/* Icon */}
                                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm p-1.5 shrink-0 overflow-hidden">
                                            <img
                                                src={item.iconUrl}
                                                alt={item.title}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=random&size=64`; }}
                                            />
                                        </div>

                                        {/* Title + username + time */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                {item.username}
                                                <span className="mx-1.5 opacity-40">•</span>
                                                {timeAgo(item.lastModified)}
                                            </p>
                                        </div>

                                        {/* Category tag */}
                                        {cat ? (
                                            <span
                                                className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 hidden sm:inline-block"
                                                style={{ backgroundColor: cat.color + '22', color: cat.color }}
                                            >
                                                {cat.name}
                                            </span>
                                        ) : (
                                            <span className="w-[72px] shrink-0 hidden sm:block" />
                                        )}

                                        {/* Strength */}
                                        <div className="w-24 shrink-0 hidden md:block">
                                            <p className={`text-xs font-bold mb-1 ${str.bars === 4 ? 'text-emerald-400' :
                                                str.bars === 3 ? 'text-green-400' :
                                                    str.bars === 2 ? 'text-orange-400' : 'text-red-400'
                                                }`}>{str.label}</p>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 flex-1 rounded-full ${i <= str.bars ? str.color : 'bg-slate-700'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Overflow menu */}
                                        <button
                                            className="p-1.5 text-slate-600 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-700/50 shrink-0"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/vault/item/${item.id}`); }}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Chart & CTA */}
                <div className="flex flex-col gap-6">
                    {/* Total Passwords Counter */}
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Passwords</h3>
                                <div className="text-lg font-bold text-white tracking-tight">Vault Overview</div>
                            </div>
                            <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                                <Key className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>

                        {/* Big Number */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-6xl font-black text-white tracking-tight">{items.length}</span>
                            <span className="text-slate-500 font-semibold text-base">passwords stored</span>
                        </div>

                        {/* Breakdown bar */}
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3 flex">
                            {items.length > 0 && (
                                <>
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-700"
                                        style={{ width: `${((items.length - atRiskAccounts.length) / items.length) * 100}%` }}
                                    />
                                    <div
                                        className="h-full bg-red-500 transition-all duration-700"
                                        style={{ width: `${(atRiskAccounts.length / items.length) * 100}%` }}
                                    />
                                </>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                {items.length - atRiskAccounts.length} Secure
                            </span>
                            <span className="flex items-center gap-1.5 text-red-400">
                                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                                {atRiskAccounts.length} At Risk
                            </span>
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
