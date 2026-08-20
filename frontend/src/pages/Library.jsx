import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { fetchBooks, addBook } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';
import SaveButton from '../components/SaveButton.jsx';
import BookCover from '../components/BookCover.jsx';
import LibraryDetail from '../components/LibraryDetail.jsx';
import { fadeUp, stagger, viewportOnce } from '../motion/variants.js';

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

function filterClass(active) {
  return active ? 'text-forest border-b border-forest' : 'text-ink-muted border-b border-transparent';
}

function Library() {
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();
  const [gridRef] = useAutoAnimate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
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
    if (!selected) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, searchParams]);

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

  const closeDetail = () => {
    setSelected(null);
    if (searchParams.get('book')) {
      searchParams.delete('book');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesType = typeFilter === 'all' || book.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.summary.toLowerCase().includes(q);
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [books, typeFilter, categoryFilter, search]);

  const featured = books.find((book) => book.excerpt) || books[0];

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

  const inView = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'show',
        viewport: viewportOnce,
        variants: fadeUp,
      };

  const sequence = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'show',
        variants: stagger,
      };

  if (loading) {
    return (
      <div className="page-section">
        <div className="section-wrap text-ink-muted">Opening the library…</div>
      </div>
    );
  }

  return (
    <div>
      <section className="page-section-tight border-b border-line">
        <motion.div className="section-wrap max-w-3xl" {...sequence}>
          <motion.p className="text-brass mb-2" variants={fadeUp}>
            Women&apos;s Library
          </motion.p>
          <motion.h1 className="text-forest" variants={fadeUp}>
            Books and journals that changed the conversation
          </motion.h1>
          <motion.p className="mt-5 max-w-xl text-ink-muted" variants={fadeUp}>
            Memoirs, journals, and essays from women who wrote their truth — with summaries to
            help you find your next read.
          </motion.p>
        </motion.div>
      </section>

      {featured && (
        <motion.section className="page-section border-b border-line" {...inView}>
          <div className="section-wrap grid items-start gap-8 md:grid-cols-[11rem_1fr] md:gap-14">
            <button
              type="button"
              className="w-44 max-w-full text-left md:w-full"
              onClick={() => setSelected(featured)}
            >
              <BookCover book={featured} />
            </button>
            <div className="max-w-xl">
              <p className="text-brass mb-3">Featured</p>
              <h2 className="text-forest">{featured.title}</h2>
              <p className="mt-2 text-ink-muted">
                {featured.author}
                {featured.year ? ` · ${featured.year}` : ''}
              </p>
              {featured.excerpt && (
                <blockquote className="mt-6 border-l border-brass pl-5 text-forest">
                  “{featured.excerpt}”
                </blockquote>
              )}
              {featured.summary && (
                <p className="mt-6 text-ink-muted line-clamp-3">{featured.summary}</p>
              )}
              <div className="mt-8">
                <button type="button" className="link-brass" onClick={() => setSelected(featured)}>
                  Read the summary
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section className="page-section-tight bg-paper-dark" {...inView}>
        <div className="section-wrap flex flex-col gap-7">
          <input
            type="search"
            placeholder="Search by title, author, or topic"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field max-w-md"
          />
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={filterClass(typeFilter === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={filterClass(categoryFilter === cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section className="page-section" {...inView}>
        <div className="section-wrap">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <p className="text-ink-muted">
              {filtered.length} {filtered.length === 1 ? 'work' : 'works'}
              {search && ` matching “${search}”`}
            </p>
            {isAuthenticated && (
              <button type="button" onClick={() => setShowAddForm((v) => !v)} className="btn-outline">
                {showAddForm ? 'Cancel' : 'Recommend a book'}
              </button>
            )}
          </div>

          {error && !showAddForm && (
            <div className="mb-8">
              <FormMessage type="error">{error}</FormMessage>
            </div>
          )}

          {showAddForm && isAuthenticated && (
            <div className="mb-14 border border-line p-6 md:p-10">
              <h2 className="text-forest mb-8">Add a book or journal</h2>
              {error && <FormMessage type="error">{error}</FormMessage>}
              <form onSubmit={handleAddBook} className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block">Title</label>
                  <input
                    className="field"
                    required
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block">Author</label>
                  <input
                    className="field"
                    required
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block">Type</label>
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
                  <label className="mb-2 block">Category</label>
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
                  <label className="mb-2 block">Year (optional)</label>
                  <input
                    type="number"
                    className="field"
                    value={newBook.year}
                    onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block">Link (optional)</label>
                  <input
                    type="url"
                    className="field"
                    placeholder="https://"
                    value={newBook.link}
                    onChange={(e) => setNewBook({ ...newBook, link: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block">Quote (optional)</label>
                  <input
                    className="field"
                    value={newBook.excerpt}
                    onChange={(e) => setNewBook({ ...newBook, excerpt: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block">Summary</label>
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
            <p className="max-w-xl text-ink-muted">
              {books.length === 0 && error
                ? 'Could not load the library right now.'
                : 'No works match your filters.'}{' '}
              {!error &&
                (isAuthenticated ? (
                  'Try another topic, or recommend a book.'
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
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-10 md:gap-y-14"
            >
              {filtered.map((book) => (
                <article key={book._id}>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setSelected(book)}
                  >
                    <BookCover book={book} />
                    <span className="mt-3 block">
                      <span className="block text-brass">{book.category}</span>
                      <span className="mt-1 block font-medium text-ink">{book.title}</span>
                      <span className="mt-1 block text-ink-muted">
                        {book.author}
                        {book.year ? ` · ${book.year}` : ''}
                      </span>
                    </span>
                  </button>
                  <div className="mt-2">
                    <SaveButton itemType="book" itemId={book._id} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {selected && <LibraryDetail selected={selected} onClose={closeDetail} />}
    </div>
  );
}

export default Library;
