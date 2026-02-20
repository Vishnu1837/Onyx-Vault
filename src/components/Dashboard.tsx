import { Lock } from 'lucide-react';
import { PasswordList } from './PasswordList';

export function Dashboard() {
    const tabs = ['All Items', 'Logins', 'Secure Notes', 'Credit Cards'];

    return (
        <div className="flex flex-col h-full w-full pt-2 pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Vault Unlocked</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">My Vault</h1>
                <p className="text-slate-400 text-sm">Manage your passwords and secure notes.</p>
            </div>

            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${idx === 0
                                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <PasswordList />
        </div>
    );
}
