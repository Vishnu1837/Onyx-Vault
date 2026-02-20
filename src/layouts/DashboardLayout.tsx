import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AddItemModal } from '../components/AddItemModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export function DashboardLayout() {
    return (
        <div className="flex h-screen w-full bg-[#0c1017] text-slate-50 font-sans overflow-hidden selection:bg-blue-500/30 relative">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-[#0c1017] via-[#0f121a] to-[#0c1017] isolate py-6 px-8 rounded-tl-3xl shadow-[-10px_0_20px_-5px_rgba(0,0,0,0.5)]">
                <Header />

                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-2">
                    <Outlet />
                </main>
            </div>

            <AddItemModal />
            <DeleteConfirmationModal />
        </div>
    );
}
