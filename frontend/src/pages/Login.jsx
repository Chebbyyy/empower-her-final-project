import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import PasswordField from '../components/PasswordField.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Could not log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="section-wrap max-w-md mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">Account</p>
        <h1 className="font-display text-3xl text-forest tracking-tight md:text-4xl">Log in</h1>
        <p className="mt-3 text-ink-muted">
          {from !== '/dashboard'
            ? 'Log in to continue where you left off.'
            : 'Welcome back. Continue to your dashboard.'}
        </p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && <FormMessage type="error">{error}</FormMessage>}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="field"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <Link
                to="/forgot-password"
                state={{ email: formData.email }}
                className="text-sm font-medium text-brass hover:text-forest transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordField
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          No account yet?{' '}
          <Link to="/register" className="link-brass font-medium">
            Join EmpowerHer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
