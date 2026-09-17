import {
  Menu,
  Moon,
  Sun,
  UserCircle,
} from "lucide-react";

function Navbar({ onMenuClick, darkMode, onThemeToggle }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Left */}
        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open menu"
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


        {/* Right */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onThemeToggle}
            className="rounded-lg p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>


          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-800"
          >
            <UserCircle size={24} />

            <span className="hidden text-sm font-medium sm:block">
              Profile
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;