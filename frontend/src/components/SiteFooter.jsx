import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function SiteFooter() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-line bg-forest text-paper">
      <div className="section-wrap py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-3 text-paper">
            <img src="/logo.svg" alt="" className="h-10 w-10" />
            <p className="font-wordmark">Empower Her</p>
          </Link>
          <p className="mt-2 max-w-sm text-sm text-paper/70 leading-relaxed">
            Resources, community, and opportunity for women advancing gender equality.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-3">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-paper/80">
            <Link to="/library" className="hover:text-paper transition-colors">Library</Link>
            <Link to="/events" className="hover:text-paper transition-colors">Events</Link>
            <Link to="/gallery" className="hover:text-paper transition-colors">Gallery</Link>
            <Link to="/resources" className="hover:text-paper transition-colors">Resources</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-3">Connect</p>
          <div className="flex flex-col gap-2 text-sm text-paper/80">
            <Link to="/mentorship" className="hover:text-paper transition-colors">Mentorship</Link>
            <Link to="/community" className="hover:text-paper transition-colors">Community</Link>
            <Link to="/search" className="hover:text-paper transition-colors">Search</Link>
            <Link to="/contact" className="hover:text-paper transition-colors">Contact</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-paper/50 mb-3">About</p>
          <div className="flex flex-col gap-2 text-sm text-paper/80">
            <Link to="/about" className="hover:text-paper transition-colors">About</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-paper transition-colors">Dashboard</Link>
                <Link to="/profile" className="hover:text-paper transition-colors">Profile</Link>
                <Link to="/saved" className="hover:text-paper transition-colors">Saved</Link>
                <Link to="/notifications" className="hover:text-paper transition-colors">Alerts</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-paper transition-colors">Log in</Link>
                <Link to="/register" className="hover:text-paper transition-colors">Join</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="section-wrap py-4 text-xs text-paper/50">
          Aligned with UN Sustainable Development Goal 5 — Gender Equality.
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
