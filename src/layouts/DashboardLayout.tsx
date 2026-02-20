import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AddItemModal } from '../components/AddItemModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

export function DashboardLayout() {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-50 font-sans overflow-hidden selection:bg-blue-500/30 relative">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0f172a] isolate">
                <Header />

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                    <div className="max-w-[1000px] mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <AddItemModal />
            <DeleteConfirmationModal />
        </div>
    );
}
