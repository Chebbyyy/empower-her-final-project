import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import InterestCheckboxes from '../components/InterestCheckboxes.jsx';
import PasswordField from '../components/PasswordField.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <div className="section-wrap max-w-md mx-auto">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">Account</p>
        <h1 className="font-display text-3xl text-forest tracking-tight md:text-4xl">Join EmpowerHer</h1>
        <p className="mt-3 text-ink-muted">
          Create an account to add resources, upload photos, and manage your profile.
        </p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          {error && <FormMessage type="error">{error}</FormMessage>}

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="field"
            />
          </div>

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

          <PasswordField
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={6}
            hint="At least 6 characters."
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-ink">Interests (optional)</legend>
            <InterestCheckboxes selected={formData.interests} onChange={handleInterestChange} />
          </fieldset>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Join'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="link-brass font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
