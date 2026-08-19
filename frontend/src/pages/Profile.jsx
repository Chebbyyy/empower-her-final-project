import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FormMessage from '../components/FormMessage.jsx';
import InterestCheckboxes from '../components/InterestCheckboxes.jsx';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    interests: user?.interests || [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
    setMessage(null);

    try {
      await updateUser(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: typeof err === 'string' ? err : 'Could not update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : '—';

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Profile"
        title={user?.name || 'Your profile'}
        description={`${user?.email} · Member since ${memberSince}`}
      />

      <section className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="h-24 w-24 shrink-0 overflow-hidden border border-line bg-forest text-paper flex items-center justify-center font-display text-2xl">
          {formData.avatar ? (
            <img src={formData.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="font-display text-xl text-forest">{user?.name}</p>
          <p className="text-sm text-ink-muted mt-1">{user?.bio || 'Add a short bio below.'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(user?.interests || []).map((i) => (
              <span key={i} className="text-xs border border-line px-2 py-1 capitalize text-ink-muted">
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10 flex flex-wrap gap-3">
        <Link to="/mentorship" className="btn-outline text-sm !py-2 !px-4">
          Mentorship profile
        </Link>
        <Link to="/saved" className="btn-outline text-sm !py-2 !px-4">
          Saved items
        </Link>
        <Link to="/notifications" className="btn-outline text-sm !py-2 !px-4">
          Notifications
        </Link>
        <Link to="/community" className="btn-outline text-sm !py-2 !px-4">
          Community
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-forest tracking-tight mb-6">Edit profile</h2>

        {message && (
          <div className="mb-4">
            <FormMessage type={message.type}>{message.text}</FormMessage>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="field"
              required
            />
          </div>

          <div>
            <label htmlFor="avatar" className="mb-2 block text-sm font-medium text-ink">
              Photo URL
            </label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://…"
              className="field"
            />
            <p className="mt-1 text-xs text-ink-muted">Optional — paste a link to a profile photo.</p>
          </div>

          <div>
            <label htmlFor="bio" className="mb-2 block text-sm font-medium text-ink">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="A short introduction…"
              className="field resize-y"
              maxLength={500}
            />
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-ink">Interests</legend>
            <InterestCheckboxes selected={formData.interests} onChange={handleInterestChange} />
          </fieldset>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating…' : 'Update profile'}
          </button>
        </form>
      </section>

      <section className="border-t border-line pt-8">
        <h2 className="font-display text-2xl text-forest tracking-tight mb-6">
          Account information
        </h2>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-muted">Email</dt>
            <dd className="mt-1 font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Role</dt>
            <dd className="mt-1 font-medium capitalize">{user?.role || 'user'}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Member since</dt>
            <dd className="mt-1 font-medium">{memberSince}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Status</dt>
            <dd className="mt-1 font-medium">
              {user?.isActive === false ? 'Inactive' : 'Active'}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default Profile;
