import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("dtx_token");

  const logout = () => {
    localStorage.removeItem("dtx_token");
    localStorage.removeItem("dtx_user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="brand">
        Data TwinX
      </Link>

      {/* Center Navigation */}
      <div className="nav-pill">
        <a href="#features">Features</a>
        <a href="#workflow">How It Works</a>
        <a href="#insights">Insights</a>
      </div>

      {/* Right Side */}
      <div className="nav-actions">
        {token ? (
          <>
            <Link to="/dashboard" className="dashboard-btn">
              Dashboard
            </Link>

            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="dashboard-btn">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}