import { Menu, Moon, Sun, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick, darkMode, onThemeToggle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
              S
            </div>

            <span className="text-lg font-semibold">
              SRSO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onThemeToggle}
            className="rounded-lg p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-2">
            <UserCircle size={26} className="text-slate-400" />

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;