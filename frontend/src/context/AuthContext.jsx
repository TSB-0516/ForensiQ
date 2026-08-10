import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from localStorage on refresh — token itself is
  // trusted (backend validates on every request); we're just restoring
  // the UI's idea of "who's logged in" without a round trip.
  useEffect(() => {
    const storedUser = localStorage.getItem("ueiip_user");
    const token = localStorage.getItem("ueiip_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);

    const loggedInUser = {
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    localStorage.setItem("ueiip_token", data.token);
    localStorage.setItem("ueiip_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("ueiip_token");
    localStorage.removeItem("ueiip_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}