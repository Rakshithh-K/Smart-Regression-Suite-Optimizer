import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  const userName = user?.name || "QA Engineer";
  const userEmail = user?.email || "engineer@team.internal";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      {/* Left: Mobile Toggle & Product Identity */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden transition"
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-black tracking-tight text-slate-900 font-mono">
            SRSO
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-xs font-semibold text-slate-500 tracking-wide">
            Regression Suite Optimizer
          </span>
        </div>
      </div>

      {/* Right: Authenticated User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-xs">
            {userInitial}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {userName}
            </span>
            <span className="text-[11px] text-slate-500 block leading-tight font-mono">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;