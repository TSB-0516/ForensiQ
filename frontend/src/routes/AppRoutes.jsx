import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import InvestigatorDashboard from "../pages/dashboard/InvestigatorDashboard";
import EvidenceVault from "../pages/evidence/EvidenceVault";
import EvidenceUpload from "../pages/evidence/EvidenceUpload";
import EvidenceRegistration from "../pages/evidence/EvidenceRegistration";
import EvidenceDetails from "../pages/evidence/EvidenceDetails";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/NotFound";

function RoleHomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/" element={<RoleHomeRedirect />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["INVESTIGATOR", "FORENSIC_ANALYST", "PROSECUTOR"]}>
              <InvestigatorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/evidence" element={<EvidenceVault />} />
        <Route
          path="/evidence/upload"
          element={
            <ProtectedRoute allowedRoles={["INVESTIGATOR", "ADMIN"]}>
              <EvidenceUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evidence/register/:id"
          element={
            <ProtectedRoute allowedRoles={["INVESTIGATOR", "ADMIN"]}>
              <EvidenceRegistration />
            </ProtectedRoute>
          }
        />
        <Route path="/evidence/:id" element={<EvidenceDetails />} />

        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}