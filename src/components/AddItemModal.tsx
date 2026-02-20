import { useState } from 'react';
import { X, Globe, User, KeyRound, AlignLeft, ShieldAlert } from 'lucide-react';
import { useVaultStore } from '../store/useStore';

export function AddItemModal() {
    const { isAddModalOpen, setAddModalOpen, addItem } = useVaultStore();

    const [title, setTitle] = useState('');
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notes, setNotes] = useState('');

    if (!isAddModalOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !username) return;

        // Simulate basic strength calculation
        let strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Weak';
        if (password.length > 12) strength = 'Very Strong';
        else if (password.length > 8) strength = 'Strong';
        else if (password.length > 5) strength = 'Medium';

        let iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Square_Lock_Icon.svg/1024px-Square_Lock_Icon.svg.png';
        if (website) {
            try {
                const url = new URL(website.startsWith('http') ? website : `https://${website}`);
                iconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
            } catch (e) {
                // fallback to default if URL is invalid
            }
        }

        addItem({
            title,
            username,
            strength,
            iconUrl
        });

        // Reset fields
        setTitle(''); setWebsite(''); setUsername(''); setPassword(''); setNotes('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl bg-[#1e293b] border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 shrink-0">
                    <div className="flex items-center gap-3 text-slate-200">
                        <h2 className="text-xl font-bold tracking-tight">Add New Item</h2>
                    </div>
                    <button
                        onClick={() => setAddModalOpen(false)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form id="add-item-form" onSubmit={handleSubmit} className="p-6 space-y-6">

                        {/* Item Information Section */}
                        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-5">
                            <div className="flex items-center gap-2 mb-5 text-blue-400">
                                <AlignLeft className="w-5 h-5" />
                                <h3 className="font-semibold text-slate-200">Item Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5 pl-1">Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={title} onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Twitter Login"
                                        className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg py-2.5 px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5 pl-1">Website Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Globe className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <input
                                            type="url"
                                            value={website} onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1.5 pl-1">Username / Email</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <User className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <input
                                                required
                                                type="text"
                                                value={username} onChange={(e) => setUsername(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5 pl-1">
                                            <label className="block text-sm font-medium text-slate-400">Password</label>
                                            {password && <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Evaluating</span>}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <KeyRound className="w-4 h-4 text-slate-500" />
                                            </div>
                                            <input
                                                required
                                                type="password"
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••••••"
                                                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secure Notes Section */}
                        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-5">
                            <div className="flex items-center gap-2 mb-4 text-slate-300">
                                <AlignLeft className="w-5 h-5" />
                                <h3 className="font-semibold">Secure Notes</h3>
                            </div>
                            <textarea
                                value={notes} onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Add any secure notes, recovery codes, or answers to security questions here..."
                                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg py-3 px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all custom-scrollbar resize-none"
                            />
                        </div>

                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-800/60 bg-slate-900/40 shrink-0">
                    <div className="flex items-center gap-2 text-slate-500 group">
                        <ShieldAlert className="w-4 h-4 group-hover:text-yellow-500 transition-colors" />
                        <span className="text-xs">End-to-end encrypted locally.</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setAddModalOpen(false)}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            form="add-item-form"
                            type="submit"
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] ring-1 ring-blue-500/50"
                        >
                            Save Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
