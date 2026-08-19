import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../utils/api.js';

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Notifications"
        title="Your updates"
        description="Mentorship replies, RSVP confirmations, and more."
      >
        {items.some((n) => !n.isRead) && (
          <button
            type="button"
            className="btn-outline text-sm !py-2 !px-4"
            onClick={async () => {
              await markAllNotificationsRead();
              load();
            }}
          >
            Mark all read
          </button>
        )}
      </PageHeader>

      {loading ? (
        <p className="text-ink-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="space-y-4">
          <p className="text-ink-muted">No notifications yet.</p>
          <p className="text-sm text-ink-muted">
            You’ll see updates here when someone replies to a mentorship request or you RSVP to an event.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="btn-outline text-sm !py-2 !px-4">
              Browse events
            </Link>
            <Link to="/mentorship" className="btn-outline text-sm !py-2 !px-4">
              Mentorship
            </Link>
            <Link to="/community" className="btn-outline text-sm !py-2 !px-4">
              Community
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {items.map((n) => (
            <li
              key={n._id}
              className={`py-4 ${n.isRead ? '' : 'bg-paper-dark/30 -mx-3 px-3 sm:mx-0 sm:px-0'}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium text-ink">{n.title}</p>
                  {n.body && <p className="mt-1 text-sm text-ink-muted">{n.body}</p>}
                  <p className="mt-2 text-xs text-ink-muted">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {n.link && (
                    <Link to={n.link} className="link-brass text-sm mt-2 inline-block">
                      Open →
                    </Link>
                  )}
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    className="btn-outline text-xs !py-1.5 !px-3 self-start"
                    onClick={async () => {
                      await markNotificationRead(n._id);
                      setItems((prev) =>
                        prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
                      );
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
