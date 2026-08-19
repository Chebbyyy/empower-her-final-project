import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUnreadNotificationCount } from '../utils/api.js';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/library', label: 'Library' },
  { to: '/events', label: 'Events' },
  { to: '/mentorship', label: 'Mentorship' },
  { to: '/community', label: 'Community' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/resources', label: 'Resources' },
];

function SiteHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUnread(0);
      return undefined;
    }
    fetchUnreadNotificationCount().then(setUnread);
    const id = setInterval(() => {
      fetchUnreadNotificationCount().then(setUnread);
    }, 60000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    `relative shrink-0 py-1 font-support text-sm font-medium tracking-wide transition-colors duration-200 ${
      isActive
        ? 'text-forest after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-brass'
        : 'text-ink-muted hover:text-ink'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `py-2 font-support text-base ${isActive ? 'text-forest font-semibold' : 'text-ink-muted'}`;

  const firstName = user?.name?.split(' ')[0] || 'Account';

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="section-wrap grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-6">
        <Link
          to="/"
          className="font-wordmark shrink-0 text-[1.7rem] text-forest sm:text-3xl"
          onClick={() => setOpen(false)}
        >
          Empower Her
        </Link>

        <nav
          className="hidden min-w-0 items-center justify-center gap-5 xl:gap-7 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/search"
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              Search
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="relative text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Alerts
                  {unread > 0 && (
                    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1.5 text-[10px] font-bold text-paper">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
                <Link
                  to="/saved"
                  className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Saved
                </Link>
                <span className="h-4 w-px bg-line" aria-hidden />
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-ink hover:text-forest transition-colors"
                >
                  {firstName}
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                >
                  Log in
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                  Join
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden shrink-0 p-2 -mr-2 text-ink"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-ink/20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 border-t border-line bg-paper lg:hidden">
            <nav className="section-wrap flex flex-col gap-1 py-4" aria-label="Mobile">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={mobileLinkClass}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/search" onClick={() => setOpen(false)} className={mobileLinkClass}>
                Search
              </NavLink>
              <NavLink to="/about" onClick={() => setOpen(false)} className={mobileLinkClass}>
                About
              </NavLink>
              {isAuthenticated && (
                <div className="mt-3 border-t border-line pt-3">
                  <p className="px-1 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Account
                  </p>
                  <NavLink to="/dashboard" onClick={() => setOpen(false)} className={mobileLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/notifications" onClick={() => setOpen(false)} className={mobileLinkClass}>
                    Alerts{unread > 0 ? ` (${unread})` : ''}
                  </NavLink>
                  <NavLink to="/saved" onClick={() => setOpen(false)} className={mobileLinkClass}>
                    Saved
                  </NavLink>
                  <NavLink to="/profile" onClick={() => setOpen(false)} className={mobileLinkClass}>
                    Profile
                  </NavLink>
                </div>
              )}
              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
                {isAuthenticated ? (
                  <button type="button" onClick={handleLogout} className="btn-outline w-full">
                    Log out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="btn-outline w-full">
                      Log in
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                      Join
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

export default SiteHeader;
