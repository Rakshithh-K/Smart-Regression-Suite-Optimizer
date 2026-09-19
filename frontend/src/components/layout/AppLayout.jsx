import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#FAFAFA] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;