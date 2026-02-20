import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useVaultStore } from '../store/useStore';
import type { PasswordItem as PasswordItemType } from '../store/useStore';

interface Props {
    item: PasswordItemType;
}

export function PasswordItem({ item }: Props) {
    const { selectedItemId, setSelectedItemId } = useVaultStore();

    const isSelected = selectedItemId === item.id;

    return (
        <div
            onClick={() => setSelectedItemId(item.id)}
            className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors ${isSelected ? 'bg-blue-600' : 'hover:bg-[#1b2230]'
                }`}
        >
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0 transition-colors ${isSelected ? 'bg-white' : 'bg-white'
                    }`}>
                    <img src={item.iconUrl} alt={item.title} className="w-full h-full object-contain" />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                    <h3 className={`font-bold text-sm leading-tight transition-colors ${isSelected ? 'text-white' : 'text-slate-200'
                        }`}>
                        {item.title}
                    </h3>
                    <p className={`text-[12px] mt-0.5 transition-colors ${isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                        {item.username}
                    </p>
                </div>
            </div>

            {/* Right side indicator */}
            <div className="flex items-center pr-2">
                {item.strength === 'Weak' ? (
                    <ShieldAlert className={`w-4 h-4 ${isSelected ? 'text-orange-300' : 'text-orange-500'}`} />
                ) : (
                    isSelected ? (
                        <ShieldCheck className="w-4 h-4 text-white" />
                    ) : null
                )}
            </div>
        </div>
    );
}
