import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchSite } from '../utils/api.js';
import FormMessage from '../components/FormMessage.jsx';

function Search() {
  const [params, setParams] = useSearchParams();
  const initial = params.get('q') || '';
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = params.get('q') || '';
    setQuery(q);
    if (q.trim().length < 2) {
      setResults(null);
      setError('');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    searchSite(q)
      .then((data) => {
        setResults(data);
      })
      .catch((err) => {
        setResults(null);
        setError(typeof err === 'string' ? err : 'Search failed');
      })
      .finally(() => setLoading(false));
  }, [params]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    setParams(q ? { q } : {});
  };

  const total =
    (results?.books?.length || 0) +
    (results?.resources?.length || 0) +
    (results?.events?.length || 0) +
    (results?.posts?.length || 0);

  const activeQuery = (params.get('q') || '').trim();

  return (
    <div>
      <section className="page-section border-b border-line">
        <div className="section-wrap max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">Search</p>
          <h1 className="font-display text-4xl text-forest md:text-5xl tracking-tight">
            Find books, events, and more
          </h1>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              className="field flex-1"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search EmpowerHer…"
              aria-label="Search"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap max-w-3xl space-y-10">
          {error && <FormMessage type="error">{error}</FormMessage>}
          {loading && <p className="text-ink-muted">Searching…</p>}
          {!loading && !error && activeQuery.length < 2 && (
            <div className="space-y-3">
              <p className="text-ink-muted">
                Enter at least 2 characters to search books, events, resources, and community posts.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/library" className="btn-outline text-sm !py-2 !px-4">
                  Library
                </Link>
                <Link to="/events" className="btn-outline text-sm !py-2 !px-4">
                  Events
                </Link>
                <Link to="/community" className="btn-outline text-sm !py-2 !px-4">
                  Community
                </Link>
              </div>
            </div>
          )}
          {!loading && results && total === 0 && (
            <p className="text-ink-muted">No results for “{params.get('q')}”.</p>
          )}
          {!loading && results && total > 0 && (
            <>
              {results.books?.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-forest mb-4">Books</h2>
                  <ul className="space-y-3">
                    {results.books.map((b) => (
                      <li key={b._id}>
                        <Link
                          to={`/library?book=${b._id}`}
                          className="font-medium text-ink hover:text-forest"
                        >
                          {b.title}
                        </Link>
                        <p className="text-sm text-ink-muted">
                          {b.author} · {b.category}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.events?.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-forest mb-4">Events</h2>
                  <ul className="space-y-3">
                    {results.events.map((e) => (
                      <li key={e._id}>
                        <Link
                          to={`/events?event=${e._id}`}
                          className="font-medium text-ink hover:text-forest"
                        >
                          {e.title}
                        </Link>
                        <p className="text-sm text-ink-muted capitalize">
                          {e.type} · {e.category}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.resources?.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-forest mb-4">Resources</h2>
                  <ul className="space-y-3">
                    {results.resources.map((r) => (
                      <li key={r._id}>
                        <Link to="/resources" className="font-medium text-ink hover:text-forest">
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {results.posts?.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl text-forest mb-4">Community</h2>
                  <ul className="space-y-3">
                    {results.posts.map((p) => (
                      <li key={p._id}>
                        <Link
                          to={`/community?post=${p._id}`}
                          className="font-medium text-ink hover:text-forest"
                        >
                          {p.title}
                        </Link>
                        <p className="text-sm text-ink-muted capitalize">{p.topic}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;
