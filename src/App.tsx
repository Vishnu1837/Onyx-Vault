import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { SecurityDashboard } from './pages/SecurityDashboard';
import { UnlockScreen } from './pages/UnlockScreen';
import { PasswordEditor } from './pages/PasswordEditor';
import { Settings } from './pages/Settings';

function App() {
  return (
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
