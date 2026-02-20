import { useState, useEffect } from 'react';
import { Copy, ExternalLink, MoreVertical, Check } from 'lucide-react';
import type { PasswordItem as PasswordItemType } from '../store/useStore';

interface Props {
    item: PasswordItemType;
}

const strengthColors = {
    'Very Strong': 'bg-emerald-500',
    'Strong': 'bg-green-500',
    'Medium': 'bg-yellow-500',
    'Weak': 'bg-red-500',
};

const strengthTextColors = {
    'Very Strong': 'text-emerald-500',
    'Strong': 'text-green-500',
    'Medium': 'text-yellow-500',
    'Weak': 'text-red-500',
};

const strengthWidths = {
    'Very Strong': 'w-[100%]',
    'Strong': 'w-[80%]',
    'Medium': 'w-[50%]',
    'Weak': 'w-[20%]',
};

export function PasswordItem({ item }: Props) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const t = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(t);
        }
    }, [copied]);

    const handleCopy = () => {
        // In a real app we would copy to clipboard here
        setCopied(true);
    };

    return (
        <div className="group flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/50 transition-all duration-200">
            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2.5 shadow-sm shrink-0">
                    <img src={item.iconUrl} alt={item.title} className="w-full h-full object-contain" />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-slate-100 text-base">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-1.5">{item.username}</p>

                    <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden flex">
                            <div className={`h-full rounded-full ${strengthWidths[item.strength]} ${strengthColors[item.strength]}`} />
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${strengthTextColors[item.strength]}`}>
                            {item.strength}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${copied
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 ring-1 ring-emerald-500/50'
                            : 'bg-slate-700/50 text-slate-300 border-slate-600/50 hover:bg-slate-700 hover:text-white'
                        }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>

                <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-700/30 hover:bg-slate-700/80 rounded-lg border border-slate-600/30 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                </button>

                <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
