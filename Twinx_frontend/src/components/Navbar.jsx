import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ showAuthButtons = true }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('dtx_token');

  const logout = () => {
    localStorage.removeItem('dtx_token');
    localStorage.removeItem('dtx_user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Data TwinX
      </Link>

      <div className="nav-links">
        <a href="#features">Key Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>

      {showAuthButtons && (
        <div className="nav-actions">
          {!token ? (
            <>
              <Link className="btn btn-light" to="/auth">
                Login
              </Link>
              <Link className="btn btn-primary" to="/auth?mode=signup">
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-light" to="/dashboard">
                Dashboard
              </Link>
              <button className="btn btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

