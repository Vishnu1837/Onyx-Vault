import { create } from 'zustand';

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface PasswordItem {
    id: string;
    title: string;
    username: string;
    password?: string;
    lastModified?: string;
    iconUrl: string;
    strength: 'Strong' | 'Medium' | 'Weak' | 'Very Strong';
    categoryId?: string;
}

interface VaultState {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    items: PasswordItem[];
    isAddModalOpen: boolean;
    addModalMode: 'website' | 'game';
    setAddModalOpen: (isOpen: boolean, mode?: 'website' | 'game') => void;
    addItem: (item: Omit<PasswordItem, 'id'>) => void;
    updateItem: (id: string, updates: Partial<PasswordItem>) => void;
    removeItem: (id: string) => void;
    itemToDelete: PasswordItem | null;
    setItemToDelete: (item: PasswordItem | null) => void;
    selectedItemId: string | null;
    setSelectedItemId: (id: string | null) => void;
    isSyncConnected: boolean;
    setSyncConnected: (isConnected: boolean) => void;
    masterKey: string | null;
    setMasterKey: (key: string | null) => void;
    setItems: (items: PasswordItem[]) => void;
    syncToVault: () => Promise<void>;
    categories: Category[];
    addCategory: (cat: Omit<Category, 'id'>) => void;
    removeCategory: (id: string) => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    items: [],
    setItems: (items) => set({ items }),
    isAddModalOpen: false,
    addModalMode: 'website',
    setAddModalOpen: (isOpen, mode = 'website') => set({ isAddModalOpen: isOpen, addModalMode: mode }),
    addItem: (item) => {
        set((state) => ({
            items: [{ ...item, id: Math.random().toString(36).substr(2, 9) }, ...state.items],
            isAddModalOpen: false
        }));
        get().syncToVault();
    },
    updateItem: (id, updates) => {
        set((state) => ({
            items: state.items.map(item => item.id === id ? { ...item, ...updates } : item)
        }));
        get().syncToVault();
    },
    removeItem: (id) => {
        set((state) => ({
            items: state.items.filter(item => item.id !== id),
            itemToDelete: null,
            selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
        }));
        get().syncToVault();
    },
    itemToDelete: null,
    setItemToDelete: (item) => set({ itemToDelete: item }),
    selectedItemId: null,
    setSelectedItemId: (id) => set({ selectedItemId: id }),
    isSyncConnected: false,
    setSyncConnected: (isConnected) => set({ isSyncConnected: isConnected }),
    masterKey: null,
    setMasterKey: (key) => set({ masterKey: key }),
    categories: [
        { id: '1', name: 'Important', color: '#a855f7' },
        { id: '2', name: 'Social Media', color: '#f97316' },
        { id: '3', name: 'Streaming', color: '#22c55e' },
        { id: '4', name: 'Work Tools', color: '#eab308' },
    ],
    addCategory: (cat) => set((state) => ({
        categories: [...state.categories, { ...cat, id: Date.now().toString() }]
    })),
    removeCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
    })),
    syncToVault: async () => {
        const state = get();
        if (!state.masterKey) return;

        try {
            const { invoke } = await import('@tauri-apps/api/core');
            const plaintext = JSON.stringify(state.items);
            const salt = await invoke<string | null>('get_vault_salt');
            if (salt) {
                await invoke('save_vault_data', { keyB64: state.masterKey, salt, plaintext });
                console.log("Vault successfully encrypted and locked safely!");
            }
        } catch (e) {
            console.error("Critical failure during encryption:", e);
        }
    }
}));
