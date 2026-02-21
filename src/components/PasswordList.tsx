import { useVaultStore } from '../store/useStore';
import { PasswordItem } from './PasswordItem';

export function PasswordList() {
    const { items, searchQuery } = useVaultStore();

    const filteredItems = items.filter(
        (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar pb-20 pr-2">
            {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                    <PasswordItem key={item.id} item={item} />
                ))
            ) : (
                <div className="py-12 text-center text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                    <p>No items found matching "{searchQuery}"</p>
                </div>
            )}
        </div>
    );
}
