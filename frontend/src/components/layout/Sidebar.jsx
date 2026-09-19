import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-150 ease-in-out
        lg:static lg:z-auto lg:h-full lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-700"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              onClick={onClose}
            />
            <SidebarLink
              to="/history"
              icon={<History size={16} />}
              label="History"
              onClick={onClose}
            />
            <SidebarLink
              to="/settings"
              icon={<Settings size={16} />}
              label="Settings"
              onClick={onClose}
            />
          </nav>
        </div>

        {/* Sign out footer */}
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition ${
          isActive
            ? "bg-indigo-50 text-indigo-700 font-bold border-l-2 border-indigo-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default Sidebar;