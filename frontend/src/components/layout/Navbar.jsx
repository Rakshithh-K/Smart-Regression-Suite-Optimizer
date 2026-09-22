import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  const userName = user?.name || "QA Engineer";
  const userEmail = user?.email || "engineer@team.internal";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[60px] w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">
      {/* Left: Mobile Toggle & Product Identity */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden transition"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[20px] font-bold tracking-tight text-slate-900 font-mono">
            SRSO
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[15px] font-medium text-slate-500 tracking-wide">
            Regression Suite Optimizer
          </span>
        </div>
      </div>

      {/* Right: Authenticated User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-xs">
            {userInitial}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[14px] font-medium text-slate-900 block leading-tight">
              {userName}
            </span>
            <span className="text-[13px] text-slate-500 block leading-tight font-mono mt-0.5">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;