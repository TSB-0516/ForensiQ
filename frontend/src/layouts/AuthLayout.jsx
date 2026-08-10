import { Outlet, Navigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Navigate to={user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-surface-lowest overflow-hidden px-6">
      {/* Atmospheric backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-lowest/50 to-surface-lowest" />
      </div>

      <main className="relative z-10 w-full max-w-md">
        {/* Tactical header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={32} className="text-action" strokeWidth={2} fill="currentColor" fillOpacity={0.15} />
            <h1 className="text-headline-lg tracking-tighter">UEIIP</h1>
          </div>
          <p className="text-label-md text-action-soft tracking-widest uppercase text-center">
            Secure Investigator Access
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-lg shadow-2xl relative overflow-hidden">
          <div className="scan-line" />
          <Outlet />
        </div>
      </main>

      {/* System status footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 px-3 py-1 bg-surface-high rounded border border-outline-variant">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-label-sm uppercase tracking-tight text-on-surface">
              System Status: Operational
            </span>
          </div>
          <div className="max-w-md text-center md:text-right">
            <p className="text-label-sm text-on-surface-variant leading-tight">
              Authorized personnel only. All activity is logged and monitored.
            </p>
            <p className="text-mono-data text-outline-variant mt-1">UEIIP v0.1.0-DEV</p>
          </div>
        </div>
      </footer>
    </div>
  );
}