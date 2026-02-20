import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { UnlockScreen } from './pages/UnlockScreen';
import { SecurityDashboard } from './pages/SecurityDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnlockScreen />} />

        <Route path="/vault" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/vault/dashboard" replace />} />
          <Route path="dashboard" element={<SecurityDashboard />} />
          <Route path="items" element={<Dashboard />} />
          {/* placeholder routes for others */}
          <Route path="generator" element={<div className="text-white p-8">Password Generator</div>} />
          <Route path="audit" element={<div className="text-white p-8">Audit Logs</div>} />
          <Route path="settings" element={<div className="text-white p-8">Settings</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
