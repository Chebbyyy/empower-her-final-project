import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../utils/api.js';
import FormMessage from '../components/FormMessage.jsx';
import PageHeader from '../components/PageHeader.jsx';

const TYPE_LINKS = {
  book: '/library',
  resource: '/resources',
  event: '/events',
};

function Saved() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFavorites(filter === 'all' ? {} : { itemType: filter });
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      setFavorites([]);
      setError(typeof err === 'string' ? err : 'Could not load saved items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleRemove = async (fav) => {
    try {
      await removeFavorite(fav.itemType, fav.itemId);
      setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not remove');
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Saved"
        title="Your favorites"
        description="Books, resources, and events you’ve saved for later."
      />

      {error && (
        <div className="mb-6">
          <FormMessage type="error">{error}</FormMessage>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {['all', 'book', 'resource', 'event'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`filter-pill capitalize ${filter === t ? 'filter-pill-active' : ''}`}
          >
            {t === 'all' ? 'All' : `${t}s`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading saved items…</p>
      ) : favorites.length === 0 ? (
        <div>
          <p className="text-ink-muted">Nothing saved yet.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/library" className="btn-outline text-sm !py-2 !px-4">
              Browse library
            </Link>
            <Link to="/events" className="btn-outline text-sm !py-2 !px-4">
              Browse events
            </Link>
            <Link to="/resources" className="btn-outline text-sm !py-2 !px-4">
              Browse resources
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {favorites.map((fav) => (
            <li key={fav._id} className="py-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                  {fav.itemType}
                </p>
                <Link
                  to={TYPE_LINKS[fav.itemType] || '/'}
                  className="font-medium text-forest hover:underline"
                >
                  {fav.title || 'Untitled'}
                </Link>
                {fav.meta && <p className="text-sm text-ink-muted mt-1">{fav.meta}</p>}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(fav)}
                className="btn-outline text-sm !py-2 !px-3 self-start"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Saved;
