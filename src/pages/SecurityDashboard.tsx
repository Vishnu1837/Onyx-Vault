import {
    Shield,
    Repeat,
    Unlock,
    History,
    AlertTriangle,
    Key,
    Activity,
    Scan
} from 'lucide-react';

export function SecurityDashboard() {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Security Dashboard</h1>
                    <p className="text-slate-400 text-sm">
                        Your vault is <span className="text-emerald-400 font-semibold">85% secure</span>. You are doing well, but 3 accounts need attention.
                    </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] ring-1 ring-blue-500/50">
                    <Scan className="w-5 h-5" />
                    Scan Vault
                </button>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-4 gap-4">
                {/* Overall Health Score */}
                <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-4 -top-4 opacity-5">
                        <Shield className="w-32 h-32" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-2">Overall Health Score</h3>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-white leading-none">85</span>
                            <span className="text-slate-500 font-semibold mb-1">/100</span>
                            <span className="text-emerald-400 text-sm font-semibold mb-1 ml-2 flex items-center">
                                <Activity className="w-3 h-3 mr-1" />
                                +5%
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[85%] bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"></div>
                    </div>
                </div>

                {/* Reused Passwords */}
                <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Repeat className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] font-semibold text-orange-400">-2 Score</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">Reused Passwords</h3>
                        <div className="text-3xl font-bold text-white mb-1">5</div>
                        <p className="text-xs text-slate-500">Across 3 categories</p>
                    </div>
                </div>

                {/* Weak Passwords */}
                <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <Unlock className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="px-2 py-1 bg-slate-800 rounded-md text-[10px] font-semibold text-slate-400">No change</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">Weak Passwords</h3>
                        <div className="text-3xl font-bold text-white mb-1">2</div>
                        <p className="text-xs text-slate-500">Critical risk detected</p>
                    </div>
                </div>

                {/* Old Passwords */}
                <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <History className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-semibold text-emerald-400">+3 Fixed</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-1">Old Passwords</h3>
                        <div className="text-3xl font-bold text-white mb-1">12</div>
                        <p className="text-xs text-slate-500">&gt; 1 year old</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-12 gap-6">

                {/* Left Column: At Risk Accounts */}
                <div className="col-span-8 bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                        <h2 className="text-base font-bold text-white">At Risk Accounts</h2>
                        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Fix All (7)</button>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900/40">
                                    <th className="px-6 py-3 font-semibold">Account</th>
                                    <th className="px-6 py-3 font-semibold">Username</th>
                                    <th className="px-6 py-3 font-semibold">Risk Type</th>
                                    <th className="px-6 py-3 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {/* Netflix */}
                                <tr className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-semibold text-slate-200">Netflix</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">user@example.com</td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            Weak
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-slate-300 hover:text-white group-hover:underline">Update</button>
                                    </td>
                                </tr>

                                {/* Twitter */}
                                <tr className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#1DA1F2] rounded-lg flex items-center justify-center p-1.5 shrink-0">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" style={{ filter: 'invert(1)' }} alt="Twitter" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-semibold text-slate-200">Twitter</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">alex_tweets</td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
                                            <Repeat className="w-3.5 h-3.5" />
                                            Reused
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-slate-300 hover:text-white group-hover:underline">Update</button>
                                    </td>
                                </tr>

                                {/* LinkedIn */}
                                <tr className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shrink-0">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-semibold text-slate-200">LinkedIn</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">alex.prof</td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                                            <History className="w-3.5 h-3.5" />
                                            Old (2y)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-slate-300 hover:text-white group-hover:underline">Update</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Chart and 2FA */}
                <div className="col-span-4 flex flex-col gap-6">
                    {/* Health Trend Chart */}
                    <div className="bg-[#1e293b]/50 border border-slate-700/50 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xs font-medium text-slate-400 mb-1">Health Trend</h3>
                                <div className="text-xl font-bold text-white">Last 30 Days</div>
                            </div>
                            <span className="px-2 py-1 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400 rounded-md">+12%</span>
                        </div>

                        {/* CSS-based visual representation of a chart to match the design accurately */}
                        <div className="relative h-32 w-full mt-4 flex flex-col justify-end">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                                <div className="border-t border-slate-700/50 w-full border-dashed" />
                                <div className="border-t border-slate-700/50 w-full border-dashed" />
                                <div className="border-t border-slate-700/50 w-full border-dashed" />
                            </div>

                            {/* SVG Chart area */}
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                {/* Gradient Fill */}
                                <defs>
                                    <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,80 L15,65 L25,70 L35,60 L45,65 L60,40 L70,50 L85,30 L95,40 L100,15 L100,100 L0,100 Z"
                                    fill="url(#chart-fill)"
                                />
                                {/* Line */}
                                <path
                                    d="M0,80 L15,65 L25,70 L35,60 L45,65 L60,40 L70,50 L85,30 L95,40 L100,15"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    vectorEffect="non-scaling-stroke"
                                />
                                {/* Points */}
                                <circle cx="60" cy="40" r="3" fill="white" />
                                <circle cx="85" cy="30" r="3" fill="white" />
                                <circle cx="100" cy="15" r="3" fill="white" />
                            </svg>
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-medium">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>

                    {/* Enable 2FA Call to Action */}
                    <div className="bg-gradient-to-br from-[#1e293b] to-slate-800/80 border border-slate-700/60 rounded-2xl p-5 relative overflow-hidden flex-1 flex flex-col justify-center">
                        {/* subtle background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />

                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(37,99,235,0.3)] shrink-0 z-10 relative">
                            <Key className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2 z-10 relative">Enable 2FA</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed z-10 relative">
                            Secure your most critical accounts by enabling 2-Factor Authentication.
                        </p>
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2.5 rounded-lg border border-slate-600/50 transition-colors z-10 relative">
                            View Recommendations
                        </button>
                    </div>
                </div>

            </div>

            <div className="text-center text-[10px] font-medium text-slate-500 mt-2">
                Last scanned: Today, 10:42 AM • <a href="#" className="hover:text-blue-400 text-blue-500 transition-colors">Settings</a>
            </div>
        </div>
    );
}
