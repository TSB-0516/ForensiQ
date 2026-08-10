import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

// Longest/most specific paths first so nested routes (e.g. /evidence/upload)
// don't get matched by a shorter prefix (e.g. /evidence) by mistake.
const TITLE_MAP = [
  { prefix: "/admin/dashboard", title: "Admin Dashboard" },
  { prefix: "/dashboard", title: "Dashboard" },
  { prefix: "/evidence/upload", title: "Upload Evidence" },
  { prefix: "/evidence/register", title: "Register Evidence" },
  { prefix: "/evidence", title: "Evidence Vault" },
  { prefix: "/users", title: "User Management" },
  { prefix: "/profile", title: "Profile" },
];

function resolveTitle(pathname) {
  const match = TITLE_MAP.find((entry) => pathname.startsWith(entry.prefix));
  return match?.title || "UEIIP";
}

export default function DashboardLayout() {
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}