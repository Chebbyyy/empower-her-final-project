import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FormMessage from '../components/FormMessage.jsx';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminMessages,
  markAdminMessageRead,
  fetchAdminPhotos,
  setAdminPhotoApproval,
  setAdminUserRole,
} from '../utils/api.js';

function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [s, u, m, p] = await Promise.all([
          fetchAdminStats(),
          fetchAdminUsers(),
          fetchAdminMessages(),
          fetchAdminPhotos(),
        ]);
        setStats(s);
        setUsers(u);
        setMessages(m);
        setPhotos(p);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Could not load admin data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl">
        <PageHeader
          eyebrow="Admin"
          title="Access restricted"
          description="This area is for administrators only. Ask an existing admin to grant you access."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="Manage users, contact messages, and gallery photos."
      />

      {error && (
        <div className="mb-6">
          <FormMessage type="error">{error}</FormMessage>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {['overview', 'users', 'messages', 'photos'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`filter-pill capitalize ${tab === t ? 'filter-pill-active' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading…</p>
      ) : (
        <>
          {tab === 'overview' && stats && (
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 border-y border-line py-8">
              {[
                ['Users', stats.users],
                ['Books', stats.books],
                ['Events', stats.events],
                ['Resources', stats.resources],
                ['Posts', stats.posts],
                ['Photos', stats.photos],
                ['Messages', stats.messages],
                ['Unread', stats.unreadMessages],
                ['Mentorship', stats.mentorshipProfiles],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-ink-muted">{label}</dt>
                  <dd className="mt-1 font-statement text-3xl text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === 'users' && (
            <ul className="divide-y divide-line border-y border-line">
              {users.map((u) => (
                <li key={u._id} className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-ink">{u.name}</p>
                    <p className="text-sm text-ink-muted">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-brass">{u.role}</span>
                    {u._id !== user._id && (
                      <button
                        type="button"
                        className="btn-outline text-xs !py-1.5 !px-3"
                        onClick={async () => {
                          const next = u.role === 'admin' ? 'user' : 'admin';
                          const updated = await setAdminUserRole(u._id, next);
                          setUsers((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
                        }}
                      >
                        Make {u.role === 'admin' ? 'user' : 'admin'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {tab === 'messages' && (
            <ul className="space-y-4">
              {messages.length === 0 && <p className="text-ink-muted">No contact messages yet.</p>}
              {messages.map((m) => (
                <li
                  key={m._id}
                  className={`border border-line p-4 ${m.isRead ? 'bg-surface' : 'bg-paper-dark/40'}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink">{m.name}</p>
                      <p className="text-sm text-ink-muted">{m.email}</p>
                    </div>
                    {!m.isRead && (
                      <button
                        type="button"
                        className="btn-outline text-xs !py-1.5 !px-3"
                        onClick={async () => {
                          const updated = await markAdminMessageRead(m._id);
                          setMessages((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
                        }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  {m.subject && <p className="mt-2 text-sm font-medium">{m.subject}</p>}
                  <p className="mt-2 text-sm text-ink-muted whitespace-pre-wrap">{m.message}</p>
                </li>
              ))}
            </ul>
          )}

          {tab === 'photos' && (
            <ul className="grid gap-4 sm:grid-cols-2">
              {photos.map((p) => (
                <li key={p._id} className="border border-line bg-surface overflow-hidden">
                  <img
                    src={`/uploads/photos/${p.filename}`}
                    alt={p.caption || ''}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm text-ink">{p.caption || 'No caption'}</p>
                    <p className="text-xs text-ink-muted mt-1">
                      by {p.uploadedBy?.name || 'Unknown'} · {p.isApproved ? 'Approved' : 'Hidden'}
                    </p>
                    <button
                      type="button"
                      className="btn-outline text-xs !py-1.5 !px-3 mt-3"
                      onClick={async () => {
                        const updated = await setAdminPhotoApproval(p._id, !p.isApproved);
                        setPhotos((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
                      }}
                    >
                      {p.isApproved ? 'Hide' : 'Approve'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
