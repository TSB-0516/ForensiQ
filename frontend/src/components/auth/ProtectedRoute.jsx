import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole, isInvestigatorRole } from '@/utils/helpers';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((allowed) => {
      if (allowed === 'ADMIN') return isAdminRole(role);
      if (allowed === 'INVESTIGATOR') return isInvestigatorRole(role);
      return role?.toUpperCase() === allowed.toUpperCase();
    });

    if (!hasAccess) {
      const fallback = isAdminRole(role) ? '/admin/dashboard' : '/investigator/dashboard';
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    const dashboard = isAdminRole(role) ? '/admin/dashboard' : '/investigator/dashboard';
    return <Navigate to={dashboard} replace />;
  }

  return children;
}
