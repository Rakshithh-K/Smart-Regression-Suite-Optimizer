import {
  LayoutDashboard,
  History,
  GitBranch,
  FileSpreadsheet,
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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-150 ease-in-out
        lg:static lg:z-auto lg:h-full lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile Header */}
        <div className="flex h-[60px] items-center justify-between border-b border-slate-200 px-5 lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-700"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1.5">
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
              onClick={onClose}
            />
            <SidebarLink
              to="/git-auto"
              icon={<GitBranch size={19} />}
              label="Git Auto"
              onClick={onClose}
            />
            <SidebarLink
              to="/history"
              icon={<History size={19} />}
              label="History"
              onClick={onClose}
            />
            <SidebarLink
              to="/input-format"
              icon={<FileSpreadsheet size={19} />}
              label="Input Format"
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
        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-[44px] w-full items-center gap-3 rounded-lg px-3.5 text-[15px] font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={19} />
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
        `flex h-[44px] items-center gap-3 rounded-lg px-3.5 text-[15px] transition ${
          isActive
            ? "bg-indigo-50 text-indigo-700 font-semibold border-l-[3px] border-indigo-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default Sidebar;