import { useState } from 'react';

function BookCover({ book, className = '' }) {
  const [imgError, setImgError] = useState(false);
  const hasCover = book.coverImage && !imgError;
  const initials = book.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden bg-forest ${className}`}
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
          <p className="text-paper">{initials}</p>
        </div>
      )}
    </div>
  );
}

export default BookCover;
