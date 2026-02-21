import { useState, useEffect } from 'react';
import {
    ChevronRight,
    Trash2,
    Save,
    FileText,
    Globe,
    ExternalLink,
    Copy,
    User,
    Key,
    EyeOff,
    Eye,
    RefreshCw,
    Shield
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVaultStore } from '../store/useStore';

export function PasswordEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;
    const { items, addItem, updateItem, setItemToDelete } = useVaultStore();

    // Form state
    const [title, setTitle] = useState('');
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notes, setNotes] = useState('');

    // UI state
    const [showPassword, setShowPassword] = useState(false);

    // Generator state
    const [genLength, setGenLength] = useState(12);
    const [genUpper, setGenUpper] = useState(true);
    const [genNumbers, setGenNumbers] = useState(true);
    const [genSymbols, setGenSymbols] = useState(true);
    const [generatedPassword, setGeneratedPassword] = useState('');

    useEffect(() => {
        if (!isNew && id) {
            const existingItem = items.find(i => i.id === id);
            if (existingItem) {
                setTitle(existingItem.title);
                setUsername(existingItem.username);
                // Mock setting other fields
                setWebsite(`https://${existingItem.title.toLowerCase().replace(' ', '')}.com/login`);
                setPassword('correct-horse-battery-staple'); // Mock
            } else {
                navigate('/vault/logins');
            }
        }
    }, [isNew, id, items, navigate]);

    useEffect(() => {
        generateNewPassword();
    }, []);

    const generateNewPassword = () => {
        let charset = "abcdefghijklmnopqrstuvwxyz";
        if (genUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (genNumbers) charset += "0123456789";
        if (genSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let retVal = "";
        for (let i = 0, n = charset.length; i < genLength; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setGeneratedPassword(retVal);
    };

    const strengthInfo = (() => {
        if (!password) return { label: 'None', score: 0, color: 'text-slate-500', bg: 'bg-slate-500/10' };
        let score = 0;

        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        switch (score) {
            case 1: return { label: 'Weak', score: 1, color: 'text-red-500', bg: 'bg-red-500/10' };
            case 2: return { label: 'Medium', score: 2, color: 'text-orange-500', bg: 'bg-orange-500/10' };
            case 3: return { label: 'Strong', score: 3, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
            case 4: return { label: 'Very Strong', score: 4, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
            default: return { label: 'Weak', score: 1, color: 'text-red-500', bg: 'bg-red-500/10' };
        }
    })();

    const handleSave = () => {
        if (isNew) {
            addItem({
                title: title || 'New Item',
                username: username,
                password: password,
                iconUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'New')}&background=random`,
                strength: (strengthInfo.label === 'None' ? 'Weak' : strengthInfo.label) as any
            });
        } else if (id) {
            updateItem(id, {
                title: title || 'Unnamed Item',
                username: username,
                password: password,
                strength: (strengthInfo.label === 'None' ? 'Weak' : strengthInfo.label) as any
            });
        }
        navigate('/vault/logins');
    };

    return (
        <div className="flex flex-col h-full w-full custom-scrollbar overflow-y-auto pb-12 pr-4 animate-in fade-in duration-300">
            {/* Top Navigation & Info */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                        <span className="hover:text-slate-200 cursor-pointer transition-colors" onClick={() => navigate('/vault/logins')}>Vault</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="hover:text-slate-200 cursor-pointer transition-colors">Social</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-slate-200">{title || 'New Item'}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#161b22] border border-[#1e2330] rounded-xl flex items-center justify-center shadow-sm">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">{title || 'New Item'}</h1>
                            <p className="text-xs text-slate-500 mt-1 font-medium">Last modified: Today at 10:42 AM</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    {!isNew && (
                        <button
                            onClick={() => {
                                const existingItem = items.find(i => i.id === id);
                                if (existingItem) {
                                    setItemToDelete(existingItem);
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column: Information */}
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                    {/* Item Information Card */}
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-[24px] p-7 shadow-xl">
                        <div className="flex items-center gap-2.5 mb-6 text-white font-bold text-lg">
                            <FileText className="w-5 h-5 text-blue-500" /> Item Information
                        </div>

                        <div className="flex flex-col gap-5">
                            {/* Title Segment */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Twitter Login"
                                    className="w-full bg-[#111622] rounded-xl py-3 px-4 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-transparent focus:border-blue-500/30 transition-all"
                                />
                            </div>

                            {/* Website Segment */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-400 mb-2">Website Address</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-slate-500">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="https://"
                                        className="w-full bg-[#111622] rounded-xl py-3 pl-11 pr-12 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-transparent focus:border-blue-500/30 transition-all"
                                    />
                                    <div className="absolute right-4 text-slate-500 hover:text-slate-300 cursor-pointer">
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* User & Pass Row */}
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-400 mb-2">Username / Email</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="username@domain.com"
                                            className="w-full bg-[#111622] rounded-xl py-3 pl-11 pr-10 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-transparent focus:border-blue-500/30 transition-all"
                                        />
                                        <div className="absolute right-4 text-slate-500 hover:text-slate-300 cursor-pointer">
                                            <Copy className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[13px] font-semibold text-slate-400">Password</label>
                                        {strengthInfo.score > 0 && (
                                            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wider ${strengthInfo.color} ${strengthInfo.bg}`}>
                                                {strengthInfo.label}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                            <Key className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full bg-[#111622] rounded-xl py-3 pl-11 pr-20 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-transparent focus:border-blue-500/30 transition-all tracking-[0.2em]"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2.5 text-slate-500">
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-slate-300 transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button type="button" className="hover:text-slate-300 transition-colors">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Strength Indicator Bar */}
                                    <div className="flex gap-1 mt-2">
                                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthInfo.score >= 1 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthInfo.score >= 2 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthInfo.score >= 3 ? 'bg-yellow-400' : 'bg-slate-700'}`}></div>
                                        <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strengthInfo.score >= 4 ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secure Notes Card */}
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-[24px] p-7 shadow-xl">
                        <div className="flex items-center gap-2.5 mb-6 text-white font-bold text-lg">
                            <FileText className="w-5 h-5 text-slate-300" /> Secure Notes
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any secure notes, recovery codes, or answers to security questions here..."
                            className="w-full h-32 bg-[#111622] rounded-xl p-4 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-transparent focus:border-blue-500/30 transition-all resize-none custom-scrollbar"
                        ></textarea>
                    </div>
                </div>

                {/* Right Column: Generator & Tips */}
                <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                    {/* Generator Card */}
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-[24px] p-7 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2.5 text-white font-bold text-lg">
                                <RefreshCw className="w-5 h-5 text-blue-500" /> Generator
                            </div>
                            <button className="text-[13px] font-semibold text-blue-500 hover:text-blue-400 transition-colors">Reset</button>
                        </div>

                        <div className="bg-[#111622] rounded-xl p-4 mb-6 border border-[#1e2330] flex items-center justify-center">
                            <span className="font-mono text-lg tracking-widest text-slate-200">{generatedPassword}</span>
                        </div>

                        <div className="flex flex-col gap-6 mb-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[13px] font-semibold text-slate-400">Length</span>
                                    <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md">{genLength}</span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="64"
                                    value={genLength}
                                    onChange={(e) => {
                                        setGenLength(parseInt(e.target.value));
                                        generateNewPassword();
                                    }}
                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-600">
                                    <span>8</span>
                                    <span>64</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 bg-[#111622] rounded-lg flex items-center justify-center border border-[#1e2330] text-[10px] font-bold text-slate-400">ABC</div>
                                        <span className="text-[13px] font-medium text-slate-300">Uppercase (A-Z)</span>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full p-1 transition-colors ${genUpper ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => { setGenUpper(!genUpper); generateNewPassword(); }}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${genUpper ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 bg-[#111622] rounded-lg flex items-center justify-center border border-[#1e2330] text-[10px] font-bold text-slate-400">123</div>
                                        <span className="text-[13px] font-medium text-slate-300">Numbers (0-9)</span>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full p-1 transition-colors ${genNumbers ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => { setGenNumbers(!genNumbers); generateNewPassword(); }}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${genNumbers ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>

                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 bg-[#111622] rounded-lg flex items-center justify-center border border-[#1e2330] text-[10px] font-bold text-slate-400">@</div>
                                        <span className="text-[13px] font-medium text-slate-300">Symbols (!@#)</span>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full p-1 transition-colors ${genSymbols ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => { setGenSymbols(!genSymbols); generateNewPassword(); }}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${genSymbols ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={generateNewPassword}
                                className="w-full py-3 rounded-xl border border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 text-[13px] font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Regenerate Password
                            </button>
                            <button
                                onClick={() => setPassword(generatedPassword)}
                                className="w-full py-3 rounded-xl bg-[#111622] hover:bg-[#1a2133] border border-[#1e2330] text-slate-300 text-[13px] font-bold transition-colors"
                            >
                                Use this Password
                            </button>
                        </div>
                    </div>

                    {/* Security Tip Card */}
                    <div className="bg-[#161b22] border border-[#1e2330] rounded-[24px] p-6 shadow-xl flex gap-4 items-start relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5">
                            <Shield className="w-32 h-32" />
                        </div>
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center shrink-0 border border-yellow-500/20">
                            <Shield className="w-5 h-5 text-yellow-500" fill="currentColor" fillOpacity={0.2} />
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-white mb-1.5">Security Tip</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                This password was last changed 180 days ago. We recommend rotating your credentials every 90 days for optimal security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
