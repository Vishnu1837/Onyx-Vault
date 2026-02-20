import {
    ShieldCheck,
    Key,
    CreditCard,
    FileText,
    Star,
    ChevronDown,
    Plus
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useVaultStore } from '../store/useStore';

export function Sidebar() {
    const { setAddModalOpen } = useVaultStore();

    return (
        <aside className="w-[280px] bg-[#0c1017] border-r border-[#1e2330] flex flex-col h-full shrink-0">
            {/* Top Brand Logo */}
            <div className="h-[88px] flex items-center px-8 shrink-0">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
                    <span className="text-2xl font-bold tracking-tight text-white">Vault</span>
                </div>
            </div>

            <div className="flex-1 py-4 px-4 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                {/* Main Nav Links */}
                <nav className="flex flex-col gap-1.5 px-2">
                    <NavLink
                        to="/vault/logins"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Key className="w-[18px] h-[18px]" />
                        Logins
                    </NavLink>
                    <NavLink
                        to="/vault/cards"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <CreditCard className="w-[18px] h-[18px]" />
                        Credit cards
                    </NavLink>
                    <NavLink
                        to="/vault/notes"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <FileText className="w-[18px] h-[18px]" />
                        Notes
                    </NavLink>
                    <NavLink
                        to="/vault/favorites"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Star className="w-[18px] h-[18px]" />
                        Favourites
                    </NavLink>
                </nav>

                {/* Categories */}
                <div className="px-2">
                    <div className="flex items-center justify-between px-3 mb-3">
                        <div className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
                            <ChevronDown className="w-4 h-4" />
                            <h4 className="text-[13px] font-semibold">Categories</h4>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
                            Important
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            Social media
                        </div>
                        {/* Active category mockup */}
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white bg-[#1b2230] cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Streaming
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            Work tools
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Form Action */}
            <div className="p-6 shrink-0 border-t border-transparent">
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                    New item <Plus className="w-[18px] h-[18px]" />
                </button>
            </div>
        </aside>
    );
}
