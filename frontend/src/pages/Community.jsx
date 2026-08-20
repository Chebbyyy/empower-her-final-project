import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPosts, createPost, addComment } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';

const TOPICS = ['all', 'general', 'education', 'health', 'career', 'leadership', 'community'];

function Community() {
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [form, setForm] = useState({ title: '', body: '', topic: 'general' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPosts(topic === 'all' ? {} : { topic });
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setPosts([]);
      setError(typeof err === 'string' ? err : 'Could not load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    const postId = searchParams.get('post');
    if (!postId || !posts.length) return;
    if (posts.some((p) => p._id === postId)) setExpanded(postId);
  }, [posts, searchParams]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const post = await createPost(form);
      setPosts((prev) => [post, ...prev]);
      setForm({ title: '', body: '', topic: 'general' });
      setShowForm(false);
      setMessage('Post published.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not publish');
    }
  };

  const handleComment = async (postId) => {
    const body = commentText[postId]?.trim();
    if (!body) return;
    setError('');
    try {
      const updated = await addComment(postId, body);
      setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not comment');
    }
  };

  return (
    <div>
      <section className="page-section border-b border-line bg-forest text-paper campaign-hero">
        <div className="section-wrap">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brass mb-4">
            Community
          </p>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight max-w-2xl">
            Share stories and ask questions
          </h1>
          <p className="mt-5 max-w-xl text-paper/80 leading-relaxed text-lg">
            A space for members to discuss growth, challenges, and wins — with respect and solidarity.
          </p>
          {isAuthenticated ? (
            <button type="button" className="btn-brass mt-8" onClick={() => setShowForm((v) => !v)}>
              {showForm ? 'Cancel' : '+ New post'}
            </button>
          ) : (
            <Link to="/login" state={{ from: '/community' }} className="btn-brass inline-flex mt-8">
              Log in to post
            </Link>
          )}
        </div>
      </section>

      {(error || message) && (
        <div className="section-wrap pt-6">
          {error && <FormMessage type="error">{error}</FormMessage>}
          {message && !error && <FormMessage type="success">{message}</FormMessage>}
        </div>
      )}

      {showForm && (
        <section className="border-b border-line bg-paper-dark/40">
          <form onSubmit={handleCreate} className="section-wrap py-10 max-w-2xl space-y-5">
            <h2 className="font-display text-2xl text-forest">New discussion</h2>
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                className="field"
                required
                maxLength={140}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Topic</label>
              <select
                className="field"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                {TOPICS.filter((t) => t !== 'all').map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Post</label>
              <textarea
                className="field resize-y"
                rows={5}
                required
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary">
              Publish
            </button>
          </form>
        </section>
      )}

      <section className="sticky top-16 z-30 border-b border-line bg-paper">
        <div className="section-wrap py-4 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`filter-pill capitalize ${topic === t ? 'filter-pill-active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap max-w-3xl space-y-6">
          {loading ? (
            <p className="text-ink-muted">Loading discussions…</p>
          ) : posts.length === 0 ? (
            <p className="text-ink-muted">No posts yet. Start the first conversation.</p>
          ) : (
            posts.map((post) => (
              <article key={post._id} className="border border-line bg-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                  {post.topic} · {post.author?.name || 'Member'}
                </p>
                <h2 className="font-display text-2xl text-forest mt-2 tracking-tight">{post.title}</h2>
                <p className="mt-3 font-inter text-ink leading-relaxed whitespace-pre-wrap">{post.body}</p>
                <p className="mt-3 text-xs text-ink-muted">
                  {new Date(post.createdAt).toLocaleDateString()} · {post.comments?.length || 0}{' '}
                  comments
                </p>
                <button
                  type="button"
                  className="link-brass text-sm mt-3"
                  onClick={() => setExpanded(expanded === post._id ? null : post._id)}
                >
                  {expanded === post._id ? 'Hide comments' : 'View comments'}
                </button>

                {expanded === post._id && (
                  <div className="mt-5 border-t border-line pt-5 space-y-4">
                    {(post.comments || []).length === 0 && (
                      <p className="text-sm text-ink-muted">No comments yet.</p>
                    )}
                    {(post.comments || []).map((c) => (
                      <div key={c._id}>
                        <p className="text-sm font-medium text-ink">{c.author?.name || 'Member'}</p>
                        <p className="text-sm text-ink-muted mt-1">{c.body}</p>
                      </div>
                    ))}
                    {isAuthenticated ? (
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          className="field flex-1"
                          placeholder={`Reply as ${user?.name?.split(' ')[0] || 'you'}…`}
                          value={commentText[post._id] || ''}
                          onChange={(e) =>
                            setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          className="btn-primary text-sm !py-2 !px-4"
                          onClick={() => handleComment(post._id)}
                        >
                          Comment
                        </button>
                      </div>
                    ) : (
                      <Link to="/login" state={{ from: '/community' }} className="link-brass text-sm">
                        Log in to comment
                      </Link>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Community;
