import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Data-Twinx-logo.jpeg";

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
      <div className="navbar-logo">
        <img
          src={logo}
          alt="Data TwinX"
          className="brand-logo"
        />

        <div className="logo-text">
          <h2>
            Data <span className="brand-highlight">TwinX</span>
          </h2>

          <p>Trust • Track • Protect</p>
        </div>
      </div>

      {/* Center Navigation */}
      <div className="nav-pill">
        <a href="#features">Features</a>

        <a href="#how-it-works">
          How It Works
        </a>

        <a href="#insights">
          Learn More
        </a>
      </div>

      {/* Right Side */}
      <div className="nav-actions">
        {token ? (
          <>
            <Link to="/dashboard" className="dashboard-btn">
              Dashboard →
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