import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { addFavorite, removeFavorite, checkFavorite } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function SaveButton({ itemType, itemId, className = '' }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !itemId) return;
    checkFavorite(itemType, itemId).then(setSaved);
  }, [isAuthenticated, itemType, itemId]);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        state={{ from: location.pathname }}
        className={`text-xs font-semibold text-brass hover:text-forest ${className}`}
      >
        Save
      </Link>
    );
  }

  const toggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    setError('');
    try {
      if (saved) {
        await removeFavorite(itemType, itemId);
        setSaved(false);
      } else {
        await addFavorite({ itemType, itemId });
        setSaved(true);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Could not update save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      <button
        type="button"
        disabled={busy}
        onClick={toggle}
        className={`text-xs font-semibold transition-colors ${
          saved ? 'text-forest' : 'text-brass hover:text-forest'
        } ${className}`}
        aria-pressed={saved}
        title={error || undefined}
      >
        {busy ? '…' : saved ? 'Saved ✓' : 'Save'}
      </button>
      {error && <span className="text-[10px] text-red-700">{error}</span>}
    </span>
  );
}

export default SaveButton;
