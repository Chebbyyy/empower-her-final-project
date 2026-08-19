import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchResources, addResource } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import SaveButton from '../components/SaveButton.jsx';

const Resources = () => {
  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', link: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await fetchResources();
        setResources(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        setResources([]);
        setError(typeof err === 'string' ? err : 'Could not load resources');
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newResource.title || !newResource.link) return;

    setSubmitting(true);
    setError('');
    try {
      const addedResource = await addResource(newResource);
      setResources([...resources, addedResource]);
      setNewResource({ title: '', link: '' });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not add resource. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-section border-b border-line">
        <div className="section-wrap max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
            Resources
          </p>
          <h1 className="font-display text-4xl text-forest md:text-5xl tracking-tight">
            Empowerment resources
          </h1>
          <p className="mt-6 text-lg text-ink-muted leading-relaxed">
            A growing list of links for skill-building, health, leadership, and community.
          </p>
        </div>
      </section>

      <section className="page-section border-b border-line">
        <div className="section-wrap max-w-3xl">
          {loading ? (
            <p className="text-ink-muted">Loading resources…</p>
          ) : error && resources.length === 0 ? (
            <FormMessage type="error">{error}</FormMessage>
          ) : resources.length === 0 ? (
            <div className="space-y-3">
              <p className="text-ink-muted">No resources yet.</p>
              {isAuthenticated ? (
                <p className="text-sm text-ink-muted">Add one below to help others get started.</p>
              ) : (
                <p className="text-sm text-ink-muted">
                  <Link to="/login" state={{ from: '/resources' }} className="link-brass">
                    Log in
                  </Link>{' '}
                  to contribute a resource.
                </p>
              )}
            </div>
          ) : (
            <ul className="space-y-0">
              {resources.map((res, idx) => (
                <li
                  key={res._id || idx}
                  className="border-l-2 border-forest pl-5 py-5 border-b border-line last:border-b-0"
                >
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium text-ink hover:text-forest transition-colors"
                  >
                    {res.title}
                  </a>
                  <p className="mt-1 truncate text-sm text-ink-muted">{res.link}</p>
                  {res._id && (
                    <div className="mt-2">
                      <SaveButton itemType="resource" itemId={res._id} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {isAuthenticated && (
        <section className="page-section">
          <div className="section-wrap max-w-md">
            <h2 className="font-display text-2xl text-forest tracking-tight mb-6">
              Add a resource
            </h2>
            {error && <FormMessage type="error">{error}</FormMessage>}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-ink">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="field"
                  required
                />
              </div>
              <div>
                <label htmlFor="link" className="mb-2 block text-sm font-medium text-ink">
                  Link
                </label>
                <input
                  id="link"
                  type="url"
                  placeholder="https://"
                  value={newResource.link}
                  onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                  className="field"
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Adding…' : 'Add resource'}
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default Resources;
