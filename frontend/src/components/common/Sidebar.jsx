import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderLock,
  UploadCloud,
  Users,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = {
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/evidence", label: "Evidence Vault", icon: FolderLock },
    { to: "/evidence/upload", label: "Upload Evidence", icon: UploadCloud },
    { to: "/users", label: "User Management", icon: Users },
  ],
  INVESTIGATOR: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/evidence", label: "Evidence Vault", icon: FolderLock },
    { to: "/evidence/upload", label: "Upload Evidence", icon: UploadCloud },
  ],
  FORENSIC_ANALYST: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/evidence", label: "Evidence Vault", icon: FolderLock },
  ],
  PROSECUTOR: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/evidence", label: "Evidence Vault", icon: FolderLock },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const items = NAV_ITEMS[user?.role] || NAV_ITEMS.PROSECUTOR;

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-surface-low border-r border-outline-variant transition-[width] duration-200 ${
        collapsed ? "w-sidebar-collapsed" : "w-sidebar"
      }`}
    >
      {/* Brand */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-outline-variant shrink-0">
        <ShieldCheck size={20} className="text-action shrink-0" strokeWidth={2} />
        {!collapsed && (
          <span className="text-headline-sm tracking-tight whitespace-nowrap overflow-hidden">
            UEIIP
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-1 overflow-y-auto scrollbar-none">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard" || to === "/admin/dashboard"}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded text-body-sm transition ${
                isActive
                  ? "bg-action/10 text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-action" />
                )}
                <Icon size={17} className="shrink-0" strokeWidth={1.75} />
                {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile link + collapse toggle */}
      <div className="border-t border-outline-variant p-2 flex flex-col gap-1 shrink-0">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded text-body-sm transition ${
              isActive
                ? "bg-action/10 text-on-surface"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`
          }
        >
          <UserCircle size={17} className="shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>Profile</span>}
        </NavLink>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 px-3 py-2.5 rounded text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition"
        >
          {collapsed ? (
            <ChevronsRight size={17} strokeWidth={1.75} />
          ) : (
            <>
              <ChevronsLeft size={17} strokeWidth={1.75} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}