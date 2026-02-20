import { Search, Plus } from 'lucide-react';
import { useVaultStore } from '../store/useStore';

export function Header() {
    const { searchQuery, setSearchQuery, setAddModalOpen } = useVaultStore();

    return (
        <header className="h-[72px] flex items-center justify-between px-8 border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex-1 max-w-2xl relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vault..."
                    className="w-full bg-slate-900/50 border border-slate-800/80 rounded-lg py-2 pl-10 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">⌘K</span>
                </div>
            </div>

            <div className="flex items-center space-x-4 pl-4 ml-auto">
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/50"
                >
                    <Plus className="h-4 w-4" />
                    Add New
                </button>
            </div>
        </header>
    );
}
