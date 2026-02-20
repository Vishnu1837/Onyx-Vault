import { Search, ShieldAlert, HelpCircle } from 'lucide-react';
import { useVaultStore } from '../store/useStore';

export function Header() {
    const { searchQuery, setSearchQuery } = useVaultStore();

    return (
        <header className="flex items-center justify-between shrink-0 h-12 mb-6">
            {/* Search Input matching left column width roughly */}
            <div className="w-[360px] relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-[18px] w-[18px] text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-[#111622] rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm border-none"
                />
            </div>

            {/* Top Right Icons & Profile */}
            <div className="flex items-center space-x-6 text-slate-400">
                <button className="hover:text-white transition-colors">
                    <ShieldAlert className="w-5 h-5" />
                </button>
                <button className="hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-700 cursor-pointer">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}
