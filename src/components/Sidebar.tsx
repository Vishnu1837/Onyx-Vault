import {
    ShieldCheck,
    Key,
    LayoutDashboard,
    Settings,
    Plus,
    ChevronDown,
    Tag,
    Gamepad2,
    Globe,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useVaultStore } from '../store/useStore';

const PALETTE = ['#3b82f6', '#a855f7', '#f97316', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#ec4899'];

export function Sidebar() {
    const navigate = useNavigate();
    const { categories, addCategory } = useVaultStore();
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newCatName.trim()) {
            const color = PALETTE[categories.length % PALETTE.length];
            addCategory({ name: newCatName.trim(), color });
            setNewCatName('');
            setIsAdding(false);
        }
        if (e.key === 'Escape') {
            setNewCatName('');
            setIsAdding(false);
        }
    };

    return (
        <aside className="w-[280px] bg-[#0c1017] border-r border-[#1e2330] flex flex-col h-full shrink-0">
            {/* Top Brand Logo */}
            <div className="h-[88px] flex items-center px-8 shrink-0">
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" strokeWidth={2.5} />
                    <span className="text-2xl font-bold tracking-tight text-white">Vault</span>
                </div>
            </div>

            <div className="flex-1 py-4 px-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                {/* Main Nav Links */}
                <nav className="flex flex-col gap-1.5 px-2">
                    <NavLink
                        to="/vault/dashboard"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <LayoutDashboard className="w-[18px] h-[18px]" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/vault/logins"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Key className="w-[18px] h-[18px]" />
                        Logins
                    </NavLink>
                    <NavLink
                        to="/vault/settings"
                        className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Settings className="w-[18px] h-[18px]" />
                        Settings
                    </NavLink>
                </nav>

                {/* Divider */}
                <div className="h-px bg-[#1e2330] mx-2" />

                {/* Categories Section */}
                <div className="px-2">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => setCategoriesOpen(o => !o)}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                        >
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? '' : '-rotate-90'}`}
                            />
                            <span className="text-sm font-semibold">Categories</span>
                        </button>
                        <button
                            onClick={() => { setCategoriesOpen(true); setIsAdding(true); setTimeout(() => document.getElementById('new-cat-input')?.focus(), 50); }}
                            className="w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-[#1b2230] transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Category List */}
                    {categoriesOpen && (
                        <div className="flex flex-col gap-0.5">
                            {categories.map(cat => (
                                <NavLink
                                    key={cat.id}
                                    to={`/vault/category/${cat.id}`}
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium w-full text-left transition-colors ${isActive ? 'bg-[#1b2230] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b2230]/50'}`}
                                >
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </NavLink>
                            ))}

                            {/* Inline New Category Input */}
                            {isAdding && (
                                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#1b2230]">
                                    <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <input
                                        id="new-cat-input"
                                        type="text"
                                        value={newCatName}
                                        onChange={e => setNewCatName(e.target.value)}
                                        onKeyDown={handleAddCategory}
                                        onBlur={() => { setIsAdding(false); setNewCatName(''); }}
                                        placeholder="Category name..."
                                        className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="p-4 shrink-0 flex flex-col gap-2.5">
                {/* Add Game button */}
                <button
                    onClick={() => navigate('/vault/new', { state: { mode: 'game' } })}
                    className="w-full py-3 bg-[#1b2230] hover:bg-[#222d3d] border border-[#2a3448] text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                    <Gamepad2 className="w-[16px] h-[16px] text-violet-400" />
                    Add a New Game
                </button>
                {/* Add Website button */}
                <button
                    onClick={() => navigate('/vault/new', { state: { mode: 'website' } })}
                    className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                    <Globe className="w-[16px] h-[16px]" />
                    Add Website
                </button>
            </div>
        </aside>
    );
}
