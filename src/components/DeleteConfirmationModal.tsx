import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useVaultStore } from '../store/useStore';

export function DeleteConfirmationModal() {
    const { itemToDelete, setItemToDelete, removeItem } = useVaultStore();
    const [confirmationText, setConfirmationText] = useState('');

    if (!itemToDelete) return null;

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmationText === 'DELETE') {
            removeItem(itemToDelete.id);
            setConfirmationText('');
        }
    };

    const handleClose = () => {
        setItemToDelete(null);
        setConfirmationText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-[#1e293b] border border-red-500/30 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 shrink-0 rounded-t-2xl">
                    <div className="flex items-center gap-3 text-slate-200">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">Delete Item</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleDelete} className="p-6">
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        You are about to delete <span className="font-semibold text-white">{itemToDelete.title}</span>. This action cannot be undone and the item will be permanently removed from your vault.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-1.5 pl-1">
                            Type <span className="font-bold text-red-400">DELETE</span> to confirm
                        </label>
                        <input
                            required
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="DELETE"
                            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg py-2.5 px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all font-mono"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={confirmationText !== 'DELETE'}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 disabled:hover:bg-red-600 ring-1 ring-red-500/50"
                        >
                            Confirm Deletion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
