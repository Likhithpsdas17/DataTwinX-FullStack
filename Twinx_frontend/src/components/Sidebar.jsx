import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icons } from "./Icons";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("dtx_token");
    localStorage.removeItem("dtx_user");
    navigate("/auth");
  };

  return (
    <aside
      className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
    >
      <Link to="/" className="sidebar-brand">
        Data <span>TwinX</span>
      </Link>

      <nav className="sidebar-nav">

        <Link
          to="/dashboard"
          className={`nav-item ${location.pathname === "/dashboard"
              ? "active"
              : ""
            }`}
          onClick={() => setMobileOpen(false)}
        >
          <Icons.Dashboard />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/documents"
          className={`nav-item ${location.pathname === "/documents"
              ? "active"
              : ""
            }`}
          onClick={() => setMobileOpen(false)}
        >
          <Icons.Documents />
          <span>Documents</span>
        </Link>

        <Link
          to="/sharing"
          className={`nav-item ${location.pathname === "/sharing"
              ? "active"
              : ""
            }`}
          onClick={() => setMobileOpen(false)}
        >
          <Icons.Sharing />
          <span>Sharing</span>
        </Link>

        <Link
          to="/analytics"
          className={`nav-item ${location.pathname === "/analytics"
              ? "active"
              : ""
            }`}
          onClick={() => setMobileOpen(false)}
        >
          <Icons.Analytics />
          <span>Analytics</span>
        </Link>

        <Link
          to="/settings"
          className={`nav-item ${location.pathname === "/settings"
              ? "active"
              : ""
            }`}
          onClick={() => setMobileOpen(false)}
        >
          <Icons.Settings />
          <span>Settings</span>
        </Link>

        <button
          className="nav-item nav-item-logout"
          onClick={logout}
        >
          <Icons.Logout />
          <span>Logout</span>
        </button>

      </nav>
    </aside>
  );
}