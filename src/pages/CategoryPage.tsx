import { useParams } from 'react-router-dom';
import { useVaultStore } from '../store/useStore';
import { Plus, Tag } from 'lucide-react';
import { PasswordDetails } from '../components/PasswordDetails';

export function CategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const { categories, items, selectedItemId, setSelectedItemId, setAddModalOpen } = useVaultStore();

    const category = categories.find(c => c.id === categoryId);
    const categoryItems = items.filter(item => item.categoryId === categoryId);

    if (!category) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                Category not found.
            </div>
        );
    }

    return (
        <div className="flex h-full gap-6 animate-in fade-in duration-300">
            {/* Left: Item List */}
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                        <h1 className="text-xl font-bold text-white tracking-tight">{category.name}</h1>
                        <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                            {categoryItems.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pb-4">
                    {categoryItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-slate-700"
                                style={{ backgroundColor: category.color + '15' }}>
                                <Tag className="w-6 h-6" style={{ color: category.color }} />
                            </div>
                            <p className="text-sm font-semibold text-slate-400 mb-1">No passwords here yet</p>
                            <p className="text-xs text-slate-600 max-w-[200px]">
                                Add a password and assign it to <span className="font-bold" style={{ color: category.color }}>{category.name}</span> to see it here.
                            </p>
                            <button
                                onClick={() => setAddModalOpen(true)}
                                className="mt-5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors"
                            >
                                + Add Password
                            </button>
                        </div>
                    ) : (
                        categoryItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all w-full border ${selectedItemId === item.id
                                    ? 'bg-[#1b2230] border-blue-500/30'
                                    : 'bg-[#161b22] border-[#1e2330] hover:bg-[#1b2230]/60'
                                    }`}
                            >
                                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5 shrink-0 overflow-hidden">
                                    <img
                                        src={item.iconUrl}
                                        alt={item.title}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.title) + '&background=random&size=64'; }}
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{item.username}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Right: Detail Panel */}
            <div className="flex-1 min-w-0">
                {selectedItemId && categoryItems.find(i => i.id === selectedItemId) ? (
                    <PasswordDetails />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-700"
                                style={{ backgroundColor: category.color + '15' }}>
                                <Tag className="w-7 h-7" style={{ color: category.color }} />
                            </div>
                            <p className="text-sm font-semibold text-slate-400">Select a password to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
