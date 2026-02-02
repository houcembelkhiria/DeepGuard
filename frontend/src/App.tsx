import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { UserManagementPage } from './pages/UserManagementPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<Dashboard />} />
              <Route path="/history" element={<PredictionHistoryPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route element={<AppLayout />}>
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
