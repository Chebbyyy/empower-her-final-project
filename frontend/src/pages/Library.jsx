import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchBooks, addBook } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import SaveButton from '../components/SaveButton.jsx';

const CATEGORIES = [
  { id: 'all', label: 'All topics' },
  { id: 'memoir', label: 'Memoir' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'education', label: 'Education' },
  { id: 'activism', label: 'Activism' },
  { id: 'health', label: 'Health' },
  { id: 'business', label: 'Business' },
  { id: 'history', label: 'History' },
];

const TYPE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'book', label: 'Books' },
  { id: 'journal', label: 'Journals' },
];

function BookCover({ book, variant = 'card' }) {
  const [imgError, setImgError] = useState(false);
  const hasCover = book.coverImage && !imgError;

  const initials = book.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const shell =
    variant === 'featured'
      ? 'aspect-[2/3] w-full max-w-[11rem] md:max-w-[13rem] mx-auto shadow-lg'
      : variant === 'panel'
        ? 'aspect-[2/3] w-36 mx-auto mt-8 mb-2 shadow-md'
        : 'aspect-[2/3] w-full max-h-52';

  return (
    <div
      className={`relative overflow-hidden bg-forest ${shell}`}
      style={!hasCover ? { backgroundColor: book.coverAccent || '#1b3a2f' } : undefined}
    >
      {hasCover ? (
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-3xl font-bold text-paper/35">{initials}</p>
        </div>
      )}
      <div className="absolute top-2 right-2 rounded-full bg-ink/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-paper backdrop-blur-sm">
        {book.type}
      </div>
    </div>
  );
}

function Library() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    type: 'book',
    summary: '',
    excerpt: '',
    year: '',
    category: 'memoir',
    link: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    const bookId = searchParams.get('book');
    if (!bookId || !books.length) return;
    const match = books.find((b) => b._id === bookId);
    if (match) setSelected(match);
  }, [books, searchParams]);

  useEffect(() => {
    if (books.length <= 1) return undefined;
    const timer = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % Math.min(books.length, 5));
    }, 6000);
    return () => clearInterval(timer);
  }, [books.length]);

  useEffect(() => {
    if (!selected) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setSelected(null);
        if (searchParams.get('book')) {
          searchParams.delete('book');
          setSearchParams(searchParams, { replace: true });
        }
      }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [selected, searchParams, setSearchParams]);

  const loadBooks = async () => {
    try {
      const data = await fetchBooks();
      setBooks(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setBooks([]);
      setError(typeof err === 'string' ? err : 'Could not load books');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesType = typeFilter === 'all' || book.type === typeFilter;
      const matchesCategory =
        categoryFilter === 'all' || book.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.summary.toLowerCase().includes(q);
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [books, typeFilter, categoryFilter, search]);

  const spotlightBooks = books.slice(0, 5);
  const spotlight = spotlightBooks[spotlightIndex] || books[0];

  const handleAddBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...newBook,
        year: newBook.year ? Number(newBook.year) : undefined,
      };
      const added = await addBook(payload);
      setBooks([added, ...books]);
      setNewBook({
        title: '',
        author: '',
        type: 'book',
        summary: '',
        excerpt: '',
        year: '',
        category: 'memoir',
        link: '',
      });
      setShowAddForm(false);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not add book.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="section-wrap text-center text-ink-muted">Opening the library…</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero + spotlight */}
      <section className="library-spotlight campaign-hero text-paper overflow-hidden">
        <div className="section-wrap py-12 md:py-16">
          <div className="max-w-2xl mb-10 animate-slide-up">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-paper/70 mb-4">
              Women&apos;s Library
            </p>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-tight">
              Books &amp; journals that changed the conversation
            </h1>
            <p className="mt-5 text-lg text-paper/80 leading-relaxed">
              Memoirs, journals, and essays from women who wrote their truth — with summaries
              to help you find your next read.
            </p>
          </div>

          {spotlight && (
            <div
              key={spotlight._id}
              className="grid items-center gap-6 bg-paper/10 backdrop-blur-sm border border-paper/20 p-5 md:grid-cols-[auto_1fr] md:gap-10 md:p-8 animate-slide-up cursor-pointer"
              onClick={() => setSelected(spotlight)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected(spotlight)}
            >
              <BookCover book={spotlight} variant="featured" />
              <div className="flex min-w-0 flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
                  Featured · {spotlight.type}
                </p>
                <h2 className="font-display text-2xl md:text-3xl tracking-tight">
                  {spotlight.title}
                </h2>
                <p className="mt-2 text-paper/80">
                  {spotlight.author}
                  {spotlight.year ? ` · ${spotlight.year}` : ''}
                </p>
                {spotlight.excerpt && (
                  <blockquote className="mt-5 border-l-2 border-brass pl-4 font-editorial italic text-paper/90">
                    &ldquo;{spotlight.excerpt}&rdquo;
                  </blockquote>
                )}
                <p className="mt-5 text-paper/75 line-clamp-3 leading-relaxed">
                  {spotlight.summary}
                </p>
                <span className="mt-6 text-sm font-semibold text-brass">
                  Read full summary →
                </span>
              </div>
            </div>
          )}

          {spotlightBooks.length > 1 && (
            <div className="flex gap-2 mt-6">
              {spotlightBooks.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show featured book ${i + 1}`}
                  onClick={() => setSpotlightIndex(i)}
                  className={`h-1.5 flex-1 transition-colors ${
                    i === spotlightIndex ? 'bg-brass' : 'bg-paper/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="section-wrap py-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <input
              type="search"
              placeholder="Search by title, author, or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field max-w-md"
            />
            <div className="flex gap-2">
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
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`filter-pill text-xs !py-2 !px-3 ${
                  categoryFilter === cat.id ? 'filter-pill-active' : ''
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="page-section">
        <div className="section-wrap">
          <div className="flex items-end justify-between mb-8 gap-4">
            <p className="text-ink-muted">
              {filtered.length} {filtered.length === 1 ? 'work' : 'works'}
              {search && ` matching “${search}”`}
            </p>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowAddForm((v) => !v)}
                className="btn-outline text-sm"
              >
                {showAddForm ? 'Cancel' : '+ Recommend a book'}
              </button>
            )}
          </div>

          {error && !showAddForm && (
            <div className="mb-6">
              <FormMessage type="error">{error}</FormMessage>
            </div>
          )}

          {showAddForm && isAuthenticated && (
            <div className="mb-10 border border-line bg-surface p-6 md:p-8 animate-slide-up">
              <h2 className="font-display text-2xl text-forest mb-6">Add a book or journal</h2>
              {error && <FormMessage type="error">{error}</FormMessage>}
              <form onSubmit={handleAddBook} className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Title</label>
                  <input
                    className="field"
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Author</label>
                  <input
                    className="field"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Type</label>
                  <select
                    className="field"
                    value={newBook.type}
                    onChange={(e) => setNewBook({ ...newBook, type: e.target.value })}
                  >
                    <option value="book">Book</option>
                    <option value="journal">Journal</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Category</label>
                  <select
                    className="field"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Year (optional)</label>
                  <input
                    type="number"
                    className="field"
                    value={newBook.year}
                    onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Link (optional)</label>
                  <input
                    type="url"
                    className="field"
                    placeholder="https://"
                    value={newBook.link}
                    onChange={(e) => setNewBook({ ...newBook, link: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Quote (optional)</label>
                  <input
                    className="field"
                    placeholder="A memorable line from the work…"
                    value={newBook.excerpt}
                    onChange={(e) => setNewBook({ ...newBook, excerpt: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Summary</label>
                  <textarea
                    className="field resize-y"
                    rows="4"
                    required
                    value={newBook.summary}
                    onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" disabled={submitting} className="btn-primary">
                    {submitting ? 'Adding…' : 'Add to library'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-ink-muted py-12 text-center">
              {books.length === 0 && error
                ? 'Could not load the library right now.'
                : 'No works match your filters.'}{' '}
              {!error &&
                (isAuthenticated ? (
                  'Try adjusting filters or add a recommendation.'
                ) : (
                  <>
                    <Link to="/login" state={{ from: '/library' }} className="link-brass">
                      Log in
                    </Link>{' '}
                    to recommend a book.
                  </>
                ))}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((book, index) => (
                <article
                  key={book._id}
                  className="library-card bg-surface border border-line overflow-hidden cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.04}s` }}
                  onClick={() => setSelected(book)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelected(book)}
                >
                  <div className="bg-paper-dark/50 p-4 pb-0 flex justify-center">
                    <div className="w-28 sm:w-32">
                      <BookCover book={book} variant="card" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brass">
                      {book.category} · {book.type}
                    </p>
                    <h3 className="font-display text-lg text-forest mt-2 leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-ink-muted mt-1 truncate">
                      {book.author}
                      {book.year ? ` · ${book.year}` : ''}
                    </p>
                    <p className="mt-2 text-sm text-ink-muted line-clamp-2 leading-relaxed">
                      {book.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-forest">Summary →</span>
                      <span onClick={(e) => e.stopPropagation()}>
                        <SaveButton itemType="book" itemId={book._id} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail panel */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/60"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-paper h-full overflow-y-auto animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-paper-dark/40 pb-2">
              <BookCover book={selected} variant="panel" />
            </div>
            <div className="p-8 pt-4">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm text-ink-muted hover:text-ink mb-6"
              >
                ← Back to library
              </button>
              <p className="text-xs font-semibold uppercase tracking-widest text-brass">
                {selected.category} · {selected.type}
              </p>
              <h2 className="font-display text-3xl text-forest mt-2 tracking-tight">
                {selected.title}
              </h2>
              <p className="mt-2 text-lg text-ink-muted">
                {selected.author}
                {selected.year ? ` · ${selected.year}` : ''}
              </p>

              {selected.excerpt && (
                <blockquote className="mt-8 border-l-4 border-brass pl-5 py-2">
                  <p className="font-editorial text-xl text-forest italic leading-snug">
                    &ldquo;{selected.excerpt}&rdquo;
                  </p>
                </blockquote>
              )}

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-3">
                  Summary
                </h3>
                <p className="font-inter text-ink leading-relaxed">{selected.summary}</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Find this book
                  </a>
                )}
                <SaveButton itemType="book" itemId={selected._id} className="!text-sm" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Library;
