import {
    ShieldCheck,
    Key,
    LayoutDashboard,
    Settings,
    Plus
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

export function Sidebar() {
    const navigate = useNavigate();

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
                        to="/vault/dashboard"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <LayoutDashboard className="w-[18px] h-[18px]" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/vault/logins"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Key className="w-[18px] h-[18px]" />
                        Logins
                    </NavLink>
                    <NavLink
                        to="/vault/settings"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Settings className="w-[18px] h-[18px]" />
                        Settings
                    </NavLink>
                </nav>
            </div>

            {/* Bottom Form Action */}
            <div className="p-6 shrink-0 border-t border-transparent">
                <button
                    onClick={() => navigate('/vault/new')}
                    className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                    New password <Plus className="w-[18px] h-[18px]" />
                </button>
            </div>
        </aside>
    );
}
