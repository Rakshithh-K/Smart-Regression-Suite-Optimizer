import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50/50 text-slate-900 antialiased">
      {/* Fixed top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Body with Fixed Sidebar + Scrollable Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50/60 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;