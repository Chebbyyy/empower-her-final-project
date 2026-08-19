import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchEvents, rsvpEvent, cancelRsvp, addEvent } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import SaveButton from '../components/SaveButton.jsx';

const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'webinar', label: 'Webinars' },
  { id: 'meetup', label: 'Meetups' },
  { id: 'panel', label: 'Panels' },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All topics' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'education', label: 'Education' },
  { id: 'health', label: 'Health' },
  { id: 'career', label: 'Career' },
  { id: 'community', label: 'Community' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function isUserAttending(event, userId) {
  if (!userId || !event?.attendees) return false;
  return event.attendees.some((a) => (a._id || a).toString() === userId.toString());
}

function Events() {
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'workshop',
    category: 'community',
    startAt: '',
    location: 'Online',
    isOnline: true,
    capacity: 40,
    hostName: '',
  });

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchEvents({ upcoming: 'true' });
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setEvents([]);
      setError(typeof err === 'string' ? err : 'Could not load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const eventId = searchParams.get('event');
    if (!eventId || !events.length) return;
    const match = events.find((e) => e._id === eventId);
    if (match) setSelected(match);
  }, [events, searchParams]);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      if (typeFilter !== 'all' && event.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && event.category !== categoryFilter) return false;
      return true;
    });
  }, [events, typeFilter, categoryFilter]);

  const handleRsvp = async (event) => {
    if (!isAuthenticated) {
      setError('Please log in to RSVP.');
      return;
    }
    setBusyId(event._id);
    setError('');
    setMessage('');
    try {
      const attending = isUserAttending(event, user?._id);
      const updated = attending
        ? await cancelRsvp(event._id)
        : await rsvpEvent(event._id);
      setEvents((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      if (selected?._id === updated._id) setSelected(updated);
      setMessage(attending ? 'RSVP cancelled.' : 'You’re registered — see you there!');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not update RSVP');
    } finally {
      setBusyId(null);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const created = await addEvent({
        ...newEvent,
        hostName: newEvent.hostName || user?.name || 'EmpowerHer',
        capacity: Number(newEvent.capacity) || 40,
      });
      setEvents((prev) => [...prev, created].sort((a, b) => new Date(a.startAt) - new Date(b.startAt)));
      setShowAddForm(false);
      setNewEvent({
        title: '',
        description: '',
        type: 'workshop',
        category: 'community',
        startAt: '',
        location: 'Online',
        isOnline: true,
        capacity: 40,
        hostName: '',
      });
      setMessage('Event created.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-section border-b border-line bg-forest text-paper campaign-hero">
        <div className="section-wrap">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brass mb-4">
            Events &amp; workshops
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight max-w-2xl">
            Learn, connect, and grow together
          </h1>
          <p className="mt-5 max-w-xl text-paper/80 leading-relaxed text-lg">
            Upcoming workshops, webinars, panels, and meetups — RSVP to save your spot.
          </p>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="btn-brass mt-8"
            >
              {showAddForm ? 'Cancel' : '+ Host an event'}
            </button>
          )}
        </div>
      </section>

      {(error || message) && (
        <div className="section-wrap pt-6">
          {error && <FormMessage type="error">{error}</FormMessage>}
          {message && !error && <FormMessage type="success">{message}</FormMessage>}
        </div>
      )}

      {showAddForm && (
        <section className="border-b border-line bg-paper-dark/40">
          <form onSubmit={handleAddEvent} className="section-wrap py-10 max-w-2xl space-y-5">
            <h2 className="font-display text-2xl text-forest">Host an event</h2>
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                className="field"
                required
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                className="field resize-y"
                rows={4}
                required
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <select
                  className="field"
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                  <option value="meetup">Meetup</option>
                  <option value="panel">Panel</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Topic</label>
                <select
                  className="field"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                >
                  <option value="leadership">Leadership</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="career">Career</option>
                  <option value="community">Community</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Starts</label>
                <input
                  type="datetime-local"
                  className="field"
                  required
                  value={newEvent.startAt}
                  onChange={(e) => setNewEvent({ ...newEvent, startAt: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="field"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Location</label>
              <input
                className="field"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create event'}
            </button>
          </form>
        </section>
      )}

      <section className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="section-wrap py-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={`filter-pill ${typeFilter === f.id ? 'filter-pill-active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategoryFilter(f.id)}
                className={`filter-pill text-xs !py-2 !px-3 ${
                  categoryFilter === f.id ? 'filter-pill-active' : ''
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap">
          {loading ? (
            <p className="text-ink-muted">Loading events…</p>
          ) : filtered.length === 0 ? (
            <div className="max-w-lg">
              <h2 className="font-display text-2xl text-forest">
                {events.length === 0 ? 'No upcoming events yet' : 'No events match these filters'}
              </h2>
              <p className="mt-3 text-ink-muted">
                {events.length === 0
                  ? 'Check back soon — new workshops are added regularly.'
                  : 'Try another filter, or clear filters to see all upcoming events.'}
              </p>
              {isAuthenticated && events.length === 0 && (
                <button
                  type="button"
                  className="btn-primary mt-6"
                  onClick={() => setShowAddForm(true)}
                >
                  Host an event
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event) => {
                const attending = isUserAttending(event, user?._id);
                const spotsLeft = Math.max(0, event.capacity - (event.attendees?.length || 0));
                return (
                  <article
                    key={event._id}
                    className="border border-line bg-surface flex flex-col overflow-hidden"
                  >
                    {event.image && (
                      <button
                        type="button"
                        className="block w-full text-left"
                        onClick={() => setSelected(event)}
                      >
                        <img
                          src={encodeURI(event.image)}
                          alt=""
                          className="aspect-[16/10] w-full object-cover"
                        />
                      </button>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-brass">
                        <span>{event.type}</span>
                        <span className="text-line">·</span>
                        <span>{event.category}</span>
                      </div>
                      <h2 className="font-display text-xl text-forest mt-2 tracking-tight">
                        <button
                          type="button"
                          className="text-left hover:underline"
                          onClick={() => setSelected(event)}
                        >
                          {event.title}
                        </button>
                      </h2>
                      <p className="mt-2 text-sm text-ink-muted">
                        {formatDate(event.startAt)} · {formatTime(event.startAt)}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">{event.location}</p>
                      <p className="mt-3 text-sm text-ink line-clamp-3 leading-relaxed flex-1">
                        {event.description}
                      </p>
                      <p className="mt-4 text-xs text-ink-muted">
                        {event.attendees?.length || 0} attending · {spotsLeft} spots left
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {isAuthenticated ? (
                          <button
                            type="button"
                            disabled={busyId === event._id || (!attending && spotsLeft === 0)}
                            onClick={() => handleRsvp(event)}
                            className={attending ? 'btn-outline text-sm !py-2 !px-4' : 'btn-primary text-sm !py-2 !px-4'}
                          >
                            {busyId === event._id
                              ? 'Updating…'
                              : attending
                                ? 'Cancel RSVP'
                                : spotsLeft === 0
                                  ? 'Full'
                                  : 'RSVP'}
                          </button>
                        ) : (
                          <Link to="/login" state={{ from: '/events' }} className="btn-primary text-sm !py-2 !px-4">
                            Log in to RSVP
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelected(event)}
                          className="btn-outline text-sm !py-2 !px-4"
                        >
                          Details
                        </button>
                        <SaveButton itemType="event" itemId={event._id} className="!text-sm self-center" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-paper p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-sm text-ink-muted hover:text-ink mb-4"
            >
              ← Close
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass">
              {selected.type} · {selected.category}
            </p>
            <h2 className="font-display text-3xl text-forest mt-2 tracking-tight">
              {selected.title}
            </h2>
            <p className="mt-3 text-ink-muted">
              {formatDate(selected.startAt)} · {formatTime(selected.startAt)}
            </p>
            <p className="mt-1 text-ink-muted">{selected.location}</p>
            <p className="mt-2 text-sm text-ink-muted">Hosted by {selected.hostName}</p>
            <p className="mt-6 text-ink leading-relaxed">{selected.description}</p>
            <p className="mt-4 text-sm text-ink-muted">
              {selected.attendees?.length || 0} / {selected.capacity} registered
            </p>
            {isAuthenticated ? (
              <button
                type="button"
                className="btn-primary mt-6"
                disabled={busyId === selected._id}
                onClick={() => handleRsvp(selected)}
              >
                {isUserAttending(selected, user?._id) ? 'Cancel RSVP' : 'RSVP to this event'}
              </button>
            ) : (
              <Link to="/login" state={{ from: '/events' }} className="btn-primary inline-flex mt-6">
                Log in to RSVP
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
