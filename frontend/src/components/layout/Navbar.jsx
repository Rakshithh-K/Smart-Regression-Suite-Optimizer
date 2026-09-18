import { Menu, UserCircle, Cpu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200/90 bg-white px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
            <Cpu size={20} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">
                SRSO
              </span>
               
            </div>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              Smart Regression Suite Optimizer
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
         

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <UserCircle size={24} />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.name || "QA Engineer"}
            </p>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">
              {user?.email || "engineer@team.internal"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;