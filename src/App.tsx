import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { SecurityDashboard } from './pages/SecurityDashboard';
import { UnlockScreen } from './pages/UnlockScreen';
import { PasswordEditor } from './pages/PasswordEditor';
import { Settings } from './pages/Settings';
import { TitleBar } from './components/TitleBar';
import { Loader2, CloudDownload } from 'lucide-react';
import { useVaultStore } from './store/useStore';
import { CategoryPage } from './pages/CategoryPage';

function App() {
  const [isSyncingInitial, setIsSyncingInitial] = useState(true);
  const { setSyncConnected } = useVaultStore();

  useEffect(() => {
    async function performInitialSync() {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        // Check if google token is in Credential Manager, update store globally
        const isConnected = await invoke<boolean>('check_sync_status');
        setSyncConnected(isConnected);
        // This will check Google Drive, download if newer, and overwrite vault.bin natively
        const downloaded = await invoke<boolean>('sync_from_drive');
        if (downloaded) {
          console.log("Cloud Vault successfully downloaded from Google Drive!");
        }
      } catch (e) {
        console.error("Initial Drive sync failed:", e);
      } finally {
        setIsSyncingInitial(false);
      }
    }
    performInitialSync();
  }, [setSyncConnected]);

  if (isSyncingInitial) {
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center">
        <TitleBar />
        <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6">
          <CloudDownload className="w-7 h-7 text-blue-500 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Syncing Vault...</h2>
        <p className="text-slate-400 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Fetching from Google Drive
        </p>
      </div>
    );
  }

  return (
    <>
      <TitleBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UnlockScreen />} />

          <Route path="/vault" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/vault/dashboard" replace />} />
            <Route path="dashboard" element={<SecurityDashboard />} />
            <Route path="logins" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="new" element={<PasswordEditor />} />
            <Route path="item/:id" element={<PasswordEditor />} />
            <Route path="category/:categoryId" element={<CategoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
