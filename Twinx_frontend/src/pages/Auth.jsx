import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultMode = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get('mode') === 'signup' ? 'signup' : 'login';
  }, [location.search]);

  const [mode, setMode] = useState(defaultMode);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        await registerUser(form);
      }

      const loginResponse = await loginUser({
        email: form.email,
        password: form.password
      });
      console.log("LOGIN RESPONSE", loginResponse);

      localStorage.setItem(
        'dtx_token',
        loginResponse.data.token
      );
      
      localStorage.setItem(
        'dtx_user',
        loginResponse.data.user.name
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
        <p>Access the Data TwinX platform and monitor your document trust lifecycle.</p>

        <div className="mode-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Login
          </button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <label>
              Full Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="btn btn-primary full" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <Link className="back-home" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

