import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Guards a route behind authentication, and optionally behind a set of
 * allowed roles. Usage:
 *   <ProtectedRoute><Page /></ProtectedRoute>
 *   <ProtectedRoute allowedRoles={["ADMIN"]}><Page /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // avoid a login-page flash while rehydrating

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}