import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../utils/api.js';
import FormMessage from '../components/FormMessage.jsx';
import PasswordField from '../components/PasswordField.jsx';

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('This reset link is missing or invalid. Request a new one.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, formData.password);
      setMessage(data.message || 'Password updated. You can log in now.');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="page-section">
        <div className="section-wrap max-w-md mx-auto">
          <h1 className="font-display text-3xl text-forest tracking-tight">Invalid reset link</h1>
          <p className="mt-3 text-ink-muted">
            This password reset link is missing or incomplete.
          </p>
          <Link to="/forgot-password" className="btn-primary mt-8 inline-flex">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="section-wrap max-w-md mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">Account</p>
        <h1 className="font-display text-3xl text-forest tracking-tight md:text-4xl">
          Set a new password
        </h1>
        <p className="mt-3 text-ink-muted">Choose a new password for your EmpowerHer account.</p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && <FormMessage type="error">{error}</FormMessage>}
          {message && !error && <FormMessage type="success">{message}</FormMessage>}

          <PasswordField
            id="password"
            name="password"
            label="New password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            hint="At least 6 characters."
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          <Link to="/login" className="link-brass font-medium">
            Back to log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
