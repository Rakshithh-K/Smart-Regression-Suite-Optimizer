import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleThemeToggle = () => {
    setDarkMode((current) => !current);
  };

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-slate-950 text-white"
          : "min-h-screen bg-slate-100 text-slate-900"
      }
    >

      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        darkMode={darkMode}
        onThemeToggle={handleThemeToggle}
      />


      <div className="flex">

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />


        <main className="min-w-0 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;