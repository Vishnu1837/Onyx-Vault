import {
    Box,
    LayoutGrid,
    Star,
    Trash2,
    FolderLock,
    ShieldCheck
} from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-64 bg-[#1e293b]/50 border-r border-slate-800/60 flex flex-col h-full shrink-0">
            {/* Brand Logo */}
            <div className="h-[72px] flex items-center px-6 border-b border-transparent shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                        <Box className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">SecureVault</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6 custom-scrollbar">
                {/* Profile */}
                <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {/* Avatar placeholder */}
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="text-sm font-semibold text-slate-200 truncate">Alex Doe</h3>
                        <p className="text-xs text-slate-400 truncate">alex@example.com</p>
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="space-y-1">
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-slate-800 rounded-lg text-slate-200 font-medium transition-colors shadow-sm ring-1 ring-slate-700/50">
                        <LayoutGrid className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">All Items</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">Favorites</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 font-medium hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Trash</span>
                    </a>
                </nav>

                {/* Folders */}
                <div>
                    <h4 className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Folders</h4>
                    <div className="space-y-0.5">
                        {['Work', 'Personal', 'Finance'].map((folder) => (
                            <a key={folder} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors">
                                <FolderLock className="w-4 h-4" />
                                <span className="text-sm">{folder}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h4 className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2 px-3">
                        {['social', 'shopping', 'streaming'].map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs font-medium text-slate-300 hover:bg-slate-700/50 cursor-pointer transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Go Premium */}
            <div className="p-4 shrink-0">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500/50 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-yellow-400" />
                            <span className="font-semibold text-white text-sm">Go Premium</span>
                        </div>
                        <p className="text-xs text-blue-100 mb-4 leading-relaxed">Unlock unlimited devices and secure file storage.</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm border border-white/10">
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
