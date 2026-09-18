import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  X,
  Layers,
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
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out
        lg:static lg:z-auto lg:h-full lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 lg:hidden">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-indigo-600" />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Navigation</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Platform Menu
          </div>
          <nav className="space-y-1.5">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
              badge="Active"
              onClick={onClose}
            />
            <SidebarLink
              to="/history"
              icon={<History size={19} />}
              label="History"
              onClick={onClose}
            />
            <SidebarLink
              to="/settings"
              icon={<Settings size={19} />}
              label="Settings"
              onClick={onClose}
            />
          </nav>
        </div>

        {/* Sign out footer */}
        <div className="border-t border-slate-200/90 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 active:scale-[0.99]"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label, badge, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-lg px-3.5 py-3 text-[15px] font-medium transition-colors ${
          isActive
            ? "bg-indigo-50/80 text-indigo-700 font-semibold border-l-3 border-indigo-600"
            : "text-slate-700 hover:bg-slate-100/70 hover:text-slate-900"
        }`
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="rounded bg-indigo-100/70 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-700">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default Sidebar;