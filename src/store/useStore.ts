import { create } from 'zustand';

export interface PasswordItem {
    id: string;
    title: string;
    username: string;
    password?: string;
    lastModified?: string;
    iconUrl: string;
    strength: 'Strong' | 'Medium' | 'Weak' | 'Very Strong';
}

interface VaultState {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    items: PasswordItem[];
    isAddModalOpen: boolean;
    setAddModalOpen: (isOpen: boolean) => void;
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
}

// Mock Data
const MOCK_ITEMS: PasswordItem[] = [
    { id: '1', title: 'Google Account', username: 'alex.doe@gmail.com', password: 'SharedPassword123!', lastModified: new Date().toISOString(), iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', strength: 'Strong' },
    { id: '2', title: 'Netflix', username: 'movie.watcher@email.com', password: 'weak1', lastModified: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(), iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', strength: 'Medium' },
    { id: '3', title: 'GitHub', username: 'dev_master', password: 'SharedPassword123!', lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', strength: 'Strong' },
    { id: '4', title: 'Amazon Web Services', username: 'root_admin', password: 'superSecret_AWS_4455!', lastModified: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(), iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', strength: 'Very Strong' },
    { id: '5', title: 'Twitter / X', username: 'social_ninja', password: 'SharedPassword123!', lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg', strength: 'Weak' },
    { id: '6', title: 'LinkedIn', username: 'alex.prof', password: 'linkedin_2020', lastModified: new Date(Date.now() - 800 * 24 * 60 * 60 * 1000).toISOString(), iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png', strength: 'Medium' },
];

export const useVaultStore = create<VaultState>((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    items: MOCK_ITEMS,
    isAddModalOpen: false,
    setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
    addItem: (item) => set((state) => ({
        items: [{ ...item, id: Math.random().toString(36).substr(2, 9) }, ...state.items],
        isAddModalOpen: false
    })),
    updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, ...updates } : item)
    })),
    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
        itemToDelete: null,
        selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
    })),
    itemToDelete: null,
    setItemToDelete: (item) => set({ itemToDelete: item }),
    selectedItemId: null,
    setSelectedItemId: (id) => set({ selectedItemId: id }),
    isSyncConnected: false,
    setSyncConnected: (isConnected) => set({ isSyncConnected: isConnected }),
    masterKey: null,
    setMasterKey: (key) => set({ masterKey: key }),
}));
