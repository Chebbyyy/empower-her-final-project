import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { requestPasswordReset } from '../utils/api.js';
import FormMessage from '../components/FormMessage.jsx';

function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetPath, setResetPath] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetPath('');

    try {
      const data = await requestPasswordReset(email.trim());
      setMessage(data.message || 'If an account exists for that email, reset instructions are ready.');
      if (data.resetPath) setResetPath(data.resetPath);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not start password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="section-wrap max-w-md mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">Account</p>
        <h1 className="font-display text-3xl text-forest tracking-tight md:text-4xl">
          Forgot password
        </h1>
        <p className="mt-3 text-ink-muted">
          Enter the email on your account and we’ll help you set a new password.
        </p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && <FormMessage type="error">{error}</FormMessage>}
          {message && !error && <FormMessage type="success">{message}</FormMessage>}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending…' : 'Continue'}
          </button>
        </form>

        {resetPath && (
          <div className="mt-6 border border-line bg-paper-dark/40 p-4">
            <p className="text-sm text-ink-muted mb-3">
              No email service is configured for this project, so use this secure link to reset your
              password:
            </p>
            <Link to={resetPath} className="btn-outline w-full text-sm">
              Set a new password
            </Link>
          </div>
        )}

        <p className="mt-6 text-sm text-ink-muted">
          Remembered it?{' '}
          <Link to="/login" className="link-brass font-medium">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
