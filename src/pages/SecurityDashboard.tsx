import { Shield, RefreshCw, Unlock, History, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SecurityDashboard() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full custom-scrollbar overflow-y-auto pb-12 pr-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight">Security Dashboard</h1>
                    <p className="text-[15px] font-medium text-slate-400 mt-1.5 flex items-center gap-1.5">
                        Your vault is <span className="text-emerald-400 font-bold">85% secure</span>. You are doing well, but 3 accounts need attention.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-sm transition-colors">
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
                        <span className="text-4xl font-bold text-white tracking-tight">85</span>
                        <span className="text-slate-500 font-medium">/100</span>
                        <span className="text-emerald-400 text-sm font-bold flex items-center ml-2">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +5%
                        </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden relative z-10">
                        <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>

                {/* Reused Passwords */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                            <RefreshCw className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="bg-orange-500/10 text-orange-500 text-[11px] px-2 py-0.5 rounded-full font-bold">-2 Score</span>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs font-semibold mb-1">Reused Passwords</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">5</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 w-full truncate">Across 3 categories</p>
                    </div>
                </div>

                {/* Weak Passwords */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                            <Unlock className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="bg-slate-800 text-slate-400 text-[11px] px-2 py-0.5 rounded-full font-bold">No change</span>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs font-semibold mb-1">Weak Passwords</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">2</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-1 w-full truncate">Critical risk detected</p>
                    </div>
                </div>

                {/* Old Passwords */}
                <div className="bg-[#161b22] border border-[#1e2330] rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[150px]">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <History className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[11px] px-2 py-0.5 rounded-full font-bold">+3 Fixed</span>
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs font-semibold mb-1">Old Passwords</div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white tracking-tight">12</span>
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
                        <button className="text-[13px] font-semibold text-blue-500 hover:text-blue-400 transition-colors">Fix All (7)</button>
                    </div>

                    <div className="overflow-x-auto">
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
                                {/* Netflix */}
                                <tr className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5 shrink-0">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-bold text-slate-200 text-sm">Netflix</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-400">user@example.com</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-[11px] font-bold border border-red-500/20">
                                            <AlertTriangle className="w-3 h-3" /> Weak
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/vault/logins')}>Update</button>
                                    </td>
                                </tr>

                                {/* Twitter */}
                                <tr className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#1DA1F2] rounded-lg flex items-center justify-center shadow-sm p-2 shrink-0">
                                                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57c-.885.392-1.83.656-2.825.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                            </div>
                                            <span className="font-bold text-slate-200 text-sm">Twitter</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-400">alex_tweets</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 text-[11px] font-bold border border-orange-500/20">
                                            <RefreshCw className="w-3 h-3" /> Reused
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/vault/logins')}>Update</button>
                                    </td>
                                </tr>

                                {/* LinkedIn */}
                                <tr className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm p-1 shrink-0">
                                                <svg className="w-full h-full text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                            </div>
                                            <span className="font-bold text-slate-200 text-sm">LinkedIn</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-400">alex.prof</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[11px] font-bold border border-blue-500/20">
                                            <History className="w-3 h-3" /> Old (2y)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => navigate('/vault/logins')}>Update</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
