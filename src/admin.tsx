import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BackgroundTexture } from './components/common/BackgroundTexture';

const AdminApp = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-slate-900 text-slate-100 relative">
            <BackgroundTexture />
            <div className="relative z-10">
              <AdminDashboard onBackToSite={() => { window.location.href = '/'; }} />
            </div>
          </div>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const rootEl = document.getElementById('admin-root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>
  );
}
