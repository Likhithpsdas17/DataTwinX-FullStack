import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-shell">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="main-content">

        {/* Mobile Header */}
        <header className="mobile-header">

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <h2 className="mobile-title">
            Data TwinX
          </h2>

          <div style={{ width: 42 }} />

        </header>

        <div className="page-container">

          {children}

        </div>

      </main>

    </div>
  );
}