import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import FormMessage from '../components/FormMessage.jsx';

const CURATED_PHOTOS = [
  {
    id: 'michelle',
    url: '/images/Michelle Obama.jpg',
    caption: 'Michelle Obama — leading with confidence',
  },
  {
    id: 'malala',
    url: '/images/Malala.jpg',
    caption: 'Malala Yousafzai — breaking barriers for girls’ education',
  },
  {
    id: 'graca',
    url: '/images/Graca.jpg',
    caption: 'Graça Machel — strength in leadership',
  },
  {
    id: 'purity',
    url: '/images/purity.jpg',
    caption: 'Purity Kagwiria — mentoring young women',
  },
];

function resolvePhotoUrl(url) {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url;
}

function Gallery() {
  const { isAuthenticated } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [hasUploads, setHasUploads] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  const fetchPhotos = async () => {
    try {
      const response = await api.get('/photos');
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const uploads = data.map((photo) => ({
          ...photo,
          url: resolvePhotoUrl(photo.url),
        }));
        setPhotos([...uploads, ...CURATED_PHOTOS]);
        setHasUploads(true);
      } else {
        setPhotos(CURATED_PHOTOS);
        setHasUploads(false);
      }
    } catch {
      setPhotos(CURATED_PHOTOS);
      setHasUploads(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', caption.trim() || 'Community photo');

    try {
      await api.post('/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCaption('');
      setSuccess('Photo uploaded. It will appear in the gallery after an admin approves it.');
      await fetchPhotos();
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : err?.response?.data?.message || 'Upload failed. Please try again.'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="section-wrap text-center text-ink-muted">Loading gallery…</div>
      </div>
    );
  }

  return (
    <div>
      <section className="page-section border-b border-line">
        <div className="section-wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
              Gallery
            </p>
            <h1 className="font-display text-4xl text-forest md:text-5xl tracking-tight">
              Inspiration gallery
            </h1>
            <p className="mt-4 text-lg text-ink-muted leading-relaxed">
              Photographs celebrating the work, presence, and achievements of women worldwide.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-3">
            {isAuthenticated ? (
              <>
                <label htmlFor="caption" className="block text-sm font-medium text-ink">
                  Caption (optional)
                </label>
                <input
                  id="caption"
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="field"
                  placeholder="Describe your photo"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="btn-primary w-full"
                >
                  {isUploading ? 'Uploading…' : 'Add a photo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            ) : (
              <Link to="/login" state={{ from: '/gallery' }} className="btn-primary inline-flex w-full">
                Log in to upload
              </Link>
            )}
            {error && <FormMessage type="error">{error}</FormMessage>}
            {success && !error && <FormMessage type="success">{success}</FormMessage>}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap">
          {hasUploads && (
            <p className="mb-8 border border-line bg-paper-dark/40 px-4 py-3 text-sm text-ink-muted">
              Community uploads appear first, followed by our curated inspiration gallery.
            </p>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.id || photo._id}
                type="button"
                className="group text-left"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={encodeURI(photo.url || photo.src)}
                  alt={photo.caption || photo.alt || 'Gallery photo'}
                  className="aspect-[4/3] w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                />
                <p className="mt-3 text-sm font-medium text-ink">{photo.caption}</p>
                {photo.uploadedBy && (
                  <p className="text-xs text-ink-muted">by {photo.uploadedBy}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-10 right-0 text-sm text-paper/80 hover:text-paper"
            >
              Close (Esc)
            </button>
            <img
              src={encodeURI(selectedPhoto.url || selectedPhoto.src)}
              alt={selectedPhoto.caption || 'Selected photo'}
              className="max-h-[80vh] max-w-full object-contain"
            />
            <p className="mt-3 text-paper">{selectedPhoto.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
