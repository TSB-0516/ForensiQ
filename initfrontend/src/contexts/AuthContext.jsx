import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AUTH_STORAGE_KEY } from '@/utils/constants';
import { getDashboardPath } from '@/utils/helpers';
import * as authService from '@/services/authService';

const AuthContext = createContext(null);

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadStoredAuth());
  const [loading, setLoading] = useState(false);

  const persistAuth = useCallback((data) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setAuth(data);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const authData = {
        token: response.token,
        email: response.email,
        role: response.role,
      };
      persistAuth(authData);
      return authData;
    } finally {
      setLoading(false);
    }
  }, [persistAuth]);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const user = await authService.register(data);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(() => ({
    user: auth,
    token: auth?.token ?? null,
    email: auth?.email ?? null,
    role: auth?.role ?? null,
    isAuthenticated: Boolean(auth?.token),
    loading,
    login,
    register,
    logout,
    getDashboardPath: () => getDashboardPath(auth?.role),
  }), [auth, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
