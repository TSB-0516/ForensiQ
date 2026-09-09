import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminDashboard from '@/pages/AdminDashboard';
import InvestigatorDashboard from '@/pages/InvestigatorDashboard';
import EvidenceUploadPage from '@/pages/EvidenceUploadPage';
import EvidenceRegistrationPage from '@/pages/EvidenceRegistrationPage';
import EvidenceVaultPage from '@/pages/EvidenceVaultPage';
import ProfilePage from '@/pages/ProfilePage';
import CaseListPage from '@/pages/CaseListPage';
import CreateCasePage from '@/pages/CreateCasePage';
import CaseDetailsPage from '@/pages/CaseDetailsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/investigator/dashboard"
            element={
              <ProtectedRoute allowedRoles={['INVESTIGATOR']}>
                <InvestigatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <CaseListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases/new"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'INVESTIGATOR']}>
                <CreateCasePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases/:id"
            element={
              <ProtectedRoute>
                <CaseDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/evidence/vault"
            element={
              <ProtectedRoute>
                <EvidenceVaultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evidence/upload"
            element={
              <ProtectedRoute>
                <EvidenceUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evidence/register"
            element={
              <ProtectedRoute>
                <EvidenceRegistrationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: '#2A3038',
            border: '1px solid #3A4149',
            color: '#E8EAED',
          },
        }}
      />
    </AuthProvider>
  );
}
