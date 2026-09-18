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
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64
        border-r border-slate-800 bg-slate-950 transition-transform duration-200
        lg:static lg:z-auto lg:block lg:h-[calc(100vh-4rem)]
        ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex justify-end p-3 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-2">
          <SidebarItem
            to="/dashboard"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            onClick={onClose}
          />

          <SidebarItem
            to="/history"
            icon={<History size={19} />}
            label="History"
            onClick={onClose}
          />

          <SidebarItem
            to="/settings"
            icon={<Settings size={19} />}
            label="Settings"
            onClick={onClose}
          />
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-red-950/30 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
          isActive
            ? "bg-blue-600/10 text-blue-400"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default Sidebar;