import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchMentorshipProfiles,
  fetchMyMentorshipProfile,
  saveMentorshipProfile,
  fetchMentorshipRequests,
  sendMentorshipRequest,
  respondMentorshipRequest,
} from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import { INTERESTS } from '../components/InterestCheckboxes.jsx';

const ROLE_FILTERS = [
  { id: 'all', label: 'Everyone' },
  { id: 'mentor', label: 'Mentors' },
  { id: 'mentee', label: 'Mentees' },
];

function Mentorship() {
  const { isAuthenticated, user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [roleFilter, setRoleFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [connectTo, setConnectTo] = useState(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [form, setForm] = useState({
    role: 'mentor',
    headline: '',
    about: '',
    topics: [],
    availability: 'open',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchMentorshipProfiles(
        roleFilter === 'all' ? {} : { role: roleFilter }
      );
      setProfiles(Array.isArray(list) ? list : []);

      if (isAuthenticated) {
        try {
          const mine = await fetchMyMentorshipProfile();
          setMyProfile(mine);
          if (mine) {
            setForm({
              role: mine.role,
              headline: mine.headline,
              about: mine.about,
              topics: mine.topics || [],
              availability: mine.availability,
            });
          }
          const reqs = await fetchMentorshipRequests();
          setRequests(reqs || { incoming: [], outgoing: [] });
        } catch {
          /* profile optional */
        }
      }
    } catch (err) {
      setProfiles([]);
      setError(typeof err === 'string' ? err : 'Could not load mentorship profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, roleFilter]);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (topicFilter !== 'all' && !(p.topics || []).includes(topicFilter)) return false;
      if (user && p.user?._id === user._id) return false;
      return true;
    });
  }, [profiles, topicFilter, user]);

  const toggleTopic = (topic) => {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const saved = await saveMentorshipProfile(form);
      setMyProfile(saved);
      setShowForm(false);
      setMessage('Mentorship profile saved.');
      load();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not save profile');
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!connectTo) return;
    setError('');
    setMessage('');
    try {
      await sendMentorshipRequest({
        to: connectTo.user._id,
        message: connectMessage,
      });
      setConnectTo(null);
      setConnectMessage('');
      setMessage('Request sent.');
      const reqs = await fetchMentorshipRequests();
      setRequests(reqs || { incoming: [], outgoing: [] });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not send request');
    }
  };

  const handleRespond = async (id, status) => {
    setError('');
    try {
      await respondMentorshipRequest(id, status);
      setMessage(status === 'accepted' ? 'Request accepted.' : 'Request declined.');
      const reqs = await fetchMentorshipRequests();
      setRequests(reqs || { incoming: [], outgoing: [] });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not update request');
    }
  };

  return (
    <div>
      <section className="page-section border-b border-line bg-forest text-paper campaign-hero">
        <div className="section-wrap">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brass mb-4">
            Mentorship
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight max-w-2xl">
            Find a mentor — or become one
          </h1>
          <p className="mt-5 max-w-xl text-paper/80 leading-relaxed text-lg">
            Connect with women who share your interests in career, leadership, education, and more.
          </p>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="btn-brass mt-8"
            >
              {showForm ? 'Cancel' : myProfile ? 'Edit my profile' : 'Create mentorship profile'}
            </button>
          ) : (
            <Link to="/login" state={{ from: '/mentorship' }} className="btn-brass inline-flex mt-8">
              Log in to join
            </Link>
          )}
        </div>
      </section>

      {(error || message) && (
        <div className="section-wrap pt-6 space-y-3">
          {error && <FormMessage type="error">{error}</FormMessage>}
          {message && !error && <FormMessage type="success">{message}</FormMessage>}
        </div>
      )}

      {showForm && isAuthenticated && (
        <section className="border-b border-line bg-paper-dark/40">
          <form onSubmit={handleSaveProfile} className="section-wrap py-10 max-w-2xl space-y-5">
            <h2 className="font-display text-2xl text-forest">Your mentorship profile</h2>
            <div>
              <label className="mb-2 block text-sm font-medium">I want to</label>
              <select
                className="field"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="mentor">Offer mentorship</option>
                <option value="mentee">Find a mentor</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Headline</label>
              <input
                className="field"
                required
                maxLength={120}
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Career coach for early-career women"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">About</label>
              <textarea
                className="field resize-y"
                rows={4}
                required
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Topics</p>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map((topic) => (
                  <label
                    key={topic}
                    className="flex items-center gap-2 border border-line px-3 py-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.topics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                      className="accent-forest"
                    />
                    <span className="capitalize">{topic}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Availability</label>
              <select
                className="field"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
              >
                <option value="open">Open to new connections</option>
                <option value="limited">Limited capacity</option>
                <option value="closed">Not accepting right now</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">
              Save profile
            </button>
          </form>
        </section>
      )}

      {isAuthenticated && (requests.incoming?.length > 0 || requests.outgoing?.length > 0) && (
        <section className="border-b border-line">
          <div className="section-wrap py-10">
            <h2 className="font-display text-2xl text-forest mb-6">Your requests</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-3">
                  Incoming
                </h3>
                {requests.incoming?.length === 0 ? (
                  <p className="text-sm text-ink-muted">No incoming requests.</p>
                ) : (
                  <ul className="space-y-4">
                    {requests.incoming.map((r) => (
                      <li key={r._id} className="border border-line p-4 bg-surface">
                        <p className="font-medium text-ink">{r.from?.name}</p>
                        <p className="mt-2 text-sm text-ink-muted">{r.message}</p>
                        <p className="mt-2 text-xs uppercase tracking-wider text-brass">{r.status}</p>
                        {r.status === 'pending' && (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              className="btn-primary text-sm !py-2 !px-3"
                              onClick={() => handleRespond(r._id, 'accepted')}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn-outline text-sm !py-2 !px-3"
                              onClick={() => handleRespond(r._id, 'declined')}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-3">
                  Sent
                </h3>
                {requests.outgoing?.length === 0 ? (
                  <p className="text-sm text-ink-muted">No sent requests.</p>
                ) : (
                  <ul className="space-y-4">
                    {requests.outgoing.map((r) => (
                      <li key={r._id} className="border border-line p-4 bg-surface">
                        <p className="font-medium text-ink">To {r.to?.name}</p>
                        <p className="mt-2 text-sm text-ink-muted">{r.message}</p>
                        <p className="mt-2 text-xs uppercase tracking-wider text-brass">{r.status}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="sticky top-16 z-30 border-b border-line bg-paper">
        <div className="section-wrap py-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {ROLE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setRoleFilter(f.id)}
                className={`filter-pill ${roleFilter === f.id ? 'filter-pill-active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTopicFilter('all')}
              className={`filter-pill text-xs !py-2 !px-3 ${
                topicFilter === 'all' ? 'filter-pill-active' : ''
              }`}
            >
              All topics
            </button>
            {INTERESTS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setTopicFilter(topic)}
                className={`filter-pill text-xs !py-2 !px-3 capitalize ${
                  topicFilter === topic ? 'filter-pill-active' : ''
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap">
          {loading ? (
            <p className="text-ink-muted">Loading profiles…</p>
          ) : filtered.length === 0 ? (
            <div className="max-w-lg">
              <h2 className="font-display text-2xl text-forest">No profiles yet</h2>
              <p className="mt-3 text-ink-muted">
                Be the first to create a mentorship profile, or try another filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((profile) => (
                <article key={profile._id} className="border border-line bg-surface p-5 flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                    {profile.role === 'both' ? 'Mentor & mentee' : profile.role}
                    {' · '}
                    {profile.availability}
                  </p>
                  <h2 className="font-display text-xl text-forest mt-2 tracking-tight">
                    {profile.user?.name}
                  </h2>
                  <p className="mt-1 font-medium text-ink text-sm">{profile.headline}</p>
                  <p className="mt-3 text-sm text-ink-muted line-clamp-4 leading-relaxed flex-1">
                    {profile.about}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(profile.topics || []).map((t) => (
                      <span
                        key={t}
                        className="text-xs border border-line px-2 py-1 capitalize text-ink-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      className="btn-primary mt-5 text-sm !py-2"
                      onClick={() => {
                        setConnectTo(profile);
                        setConnectMessage('');
                      }}
                    >
                      Connect
                    </button>
                  ) : (
                    <Link to="/login" state={{ from: '/mentorship' }} className="btn-outline mt-5 text-sm !py-2 text-center">
                      Log in to connect
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {connectTo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          onClick={() => setConnectTo(null)}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSendRequest}
            className="w-full max-w-md bg-paper p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-forest">
              Connect with {connectTo.user?.name}
            </h2>
            <p className="text-sm text-ink-muted">{connectTo.headline}</p>
            <div>
              <label className="mb-2 block text-sm font-medium">Your message</label>
              <textarea
                className="field resize-y"
                rows={4}
                required
                maxLength={500}
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                placeholder="Introduce yourself and what you’re looking for…"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                Send request
              </button>
              <button type="button" className="btn-outline" onClick={() => setConnectTo(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Mentorship;
