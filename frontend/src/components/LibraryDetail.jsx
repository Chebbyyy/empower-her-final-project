import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import BookCover from './BookCover.jsx';
import SaveButton from './SaveButton.jsx';

function LibraryDetail({ selected, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const tlRef = useRef(null);
  const closingRef = useRef(false);

  useLayoutEffect(() => {
    closingRef.current = false;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const items = contentRef.current ? Array.from(contentRef.current.children) : [];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline();
    tlRef.current = tl;

    if (reduce) {
      gsap.set(overlay, { opacity: 1 });
      gsap.set(panel, { xPercent: 0 });
      gsap.set(items, { opacity: 1, y: 0 });
      return () => tl.kill();
    }

    gsap.set(items, { opacity: 0, y: 12 });
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
      .fromTo(
        panel,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.45, ease: 'power3.out' },
        0
      )
      .to(
        items,
        { opacity: 1, y: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out' },
        '-=0.18'
      );

    return () => tl.kill();
  }, [selected._id]);

  const handleClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !overlay || !panel) {
      onClose();
      return;
    }

    tlRef.current?.kill();
    gsap
      .timeline({ onComplete: onClose })
      .to(panel, { xPercent: 100, duration: 0.32, ease: 'power2.in' }, 0)
      .to(overlay, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-end bg-ink/60"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-detail-title"
    >
      <div
        ref={panelRef}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-line bg-paper"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={contentRef} className="p-8 md:p-10">
          <button type="button" onClick={handleClose} className="mb-8 text-ink-muted">
            Back to library
          </button>
          <BookCover book={selected} className="mb-8 w-36" />
          <p className="text-brass">
            {selected.category} · {selected.type}
          </p>
          <h2 id="library-detail-title" className="mt-2 text-forest">
            {selected.title}
          </h2>
          <p className="mt-2 text-ink-muted">
            {selected.author}
            {selected.year ? ` · ${selected.year}` : ''}
          </p>

          {selected.excerpt && (
            <blockquote className="mt-8 border-l border-brass pl-5 text-forest">
              “{selected.excerpt}”
            </blockquote>
          )}

          <div className="mt-8">
            <p className="text-brass mb-3">Summary</p>
            <p className="text-ink">{selected.summary}</p>
          </div>

          <div className="mt-10 flex flex-col items-start gap-5">
            {selected.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Find this book
              </a>
            )}
            <SaveButton itemType="book" itemId={selected._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryDetail;
