import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import RoleBadge from "./RoleBadge";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 sticky top-0 z-10 flex items-center justify-between px-6 bg-surface/95 backdrop-blur border-b border-outline-variant">
      <h1 className="text-headline-sm">{title}</h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded hover:bg-surface-container transition"
        >
          <span className="h-7 w-7 rounded-full bg-action/15 text-action text-label-sm font-semibold flex items-center justify-center">
            {initials}
          </span>
          <div className="text-left hidden sm:block">
            <p className="text-body-sm leading-none text-on-surface">{user?.fullName}</p>
          </div>
          <ChevronDown size={14} className="text-on-surface-variant" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-surface-high border border-outline-variant rounded-md shadow-xl py-1.5 overflow-hidden">
            <div className="px-3 py-2 border-b border-outline-variant">
              <p className="text-body-sm text-on-surface">{user?.fullName}</p>
              <p className="text-label-sm text-on-surface-variant mb-1.5 truncate">{user?.email}</p>
              <RoleBadge role={user?.role} />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-danger hover:bg-danger/10 transition"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}