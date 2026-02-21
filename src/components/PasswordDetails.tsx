import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVaultStore } from '../store/useStore';
import {
    Star,
    Edit3,
    MoreHorizontal,
    Eye,
    EyeOff,
    Copy,
    ExternalLink,
    ChevronLeft
} from 'lucide-react';

export function PasswordDetails() {
    const { items, selectedItemId, setItemToDelete, setSelectedItemId } = useVaultStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!selectedItemId) {
        return (
            <div className="flex-1 bg-[#161b22] rounded-3xl flex flex-col items-center justify-center border border-[#1e2330] p-8 text-center text-slate-500">
                <ShieldIcon className="w-16 h-16 mb-4 opacity-20" />
                <p>Select an item to view its details</p>
            </div>
        );
    }

    const item = items.find((i) => i.id === selectedItemId);
    if (!item) return null;

    // Simulate generic category badge based on title
    let categoryText = "Login";
    let categoryColor = "bg-blue-500/20 text-blue-400";
    if (item.title.toLowerCase().includes('netflix') || item.title.toLowerCase().includes('hulu')) {
        categoryText = "Streaming";
        categoryColor = "bg-emerald-500/20 text-emerald-400";
    }

    return (
        <div className="flex-1 bg-[#161b22] rounded-[32px] flex flex-col border border-[#1e2330] p-8 overflow-y-auto custom-scrollbar shadow-xl relative isolate">
            {/* Soft inner glow behind header */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedItemId(null)}
                        className="lg:hidden p-2 -ml-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-sm">
                        <img src={item.iconUrl} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{item.title}</h2>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${categoryColor}`}>
                            {categoryText}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 relative">
                    <button className="p-2 hover:bg-slate-800 rounded-full transition-colors hover:text-white">
                        <Star className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate(`/vault/item/${item.id}`)}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors hover:text-white"
                        title="Edit Item"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>

                    <div ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 hover:bg-slate-800 rounded-full transition-colors hover:text-white"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1b2230] border border-[#2d3748] rounded-xl shadow-lg overflow-hidden z-20">
                                <ul className="py-1">
                                    <li>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setItemToDelete(item);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                        >
                                            Delete Item
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Warning Banner */}
            {item.strength === 'Weak' && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-4 flex justify-between items-center mb-8 shadow-lg shadow-orange-500/10">
                    <span className="text-sm font-semibold text-white">It's time to update your password.</span>
                    <button className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity">
                        Update now <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Details Fields */}
            <div className="flex flex-col gap-6 flex-1">
                {/* Website */}
                <div>
                    <span className="text-xs font-semibold text-slate-500 mb-1.5 block">Website</span>
                    <a href="#" className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors">
                        www.{(item.title.toLowerCase().replace(' ', ''))}.com
                    </a>
                </div>

                {/* Username */}
                <div>
                    <span className="text-xs font-semibold text-slate-500 mb-1.5 block">Username</span>
                    <div className="text-sm font-medium text-slate-200">
                        {item.username}
                    </div>
                </div>

                {/* Password Line */}
                <div>
                    <span className="text-xs font-semibold text-slate-500 mb-1.5 block">Password</span>
                    <div className="flex justify-between items-center group">
                        <div className={`text-base font-medium text-slate-200 ${!showPassword ? 'tracking-[0.3em] font-mono' : ''}`}>
                            {showPassword ? "correct-horse-battery-staple" : "••••••••••••"}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button className="p-2 rounded-xl bg-[#242b3b] text-slate-300 hover:bg-blue-600 hover:text-white transition-all">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>



            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#1e2330] text-[11px] font-semibold text-slate-500/80 tracking-wide uppercase">
                Last modified: 08/02/2022
            </div>
        </div>
    );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
