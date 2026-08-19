import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUnreadNotificationCount } from '../utils/api.js';
import CardNav from './CardNav.jsx';

function SiteHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

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

  const items = useMemo(() => {
    const accountLinks = isAuthenticated
      ? [
          { label: 'Dashboard', href: '/dashboard', ariaLabel: 'Open dashboard' },
          {
            label: unread > 0 ? `Alerts (${unread > 9 ? '9+' : unread})` : 'Alerts',
            href: '/notifications',
            ariaLabel: 'View notifications',
          },
          { label: 'Saved', href: '/saved', ariaLabel: 'Saved items' },
          { label: 'Profile', href: '/profile', ariaLabel: 'Your profile' },
          ...(user?.role === 'admin'
            ? [{ label: 'Admin', href: '/admin', ariaLabel: 'Admin panel' }]
            : []),
          { label: 'Log out', ariaLabel: 'Log out', onClick: handleLogout },
        ]
      : [
          { label: 'Search', href: '/search', ariaLabel: 'Search Empower Her' },
          { label: 'Log in', href: '/login', ariaLabel: 'Log in' },
          { label: 'Join', href: '/register', ariaLabel: 'Create an account' },
          { label: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
        ];

    return [
      {
        label: 'Explore',
        bgColor: '#1b3a2f',
        textColor: '#f7f4ef',
        links: [
          { label: 'Home', href: '/', ariaLabel: 'Home' },
          { label: 'Library', href: '/library', ariaLabel: 'Women’s library' },
          { label: 'Gallery', href: '/gallery', ariaLabel: 'Photo gallery' },
          { label: 'Resources', href: '/resources', ariaLabel: 'Resources' },
        ],
      },
      {
        label: 'Connect',
        bgColor: '#2d5a48',
        textColor: '#f7f4ef',
        links: [
          { label: 'Events', href: '/events', ariaLabel: 'Events and workshops' },
          { label: 'Mentorship', href: '/mentorship', ariaLabel: 'Mentorship' },
          { label: 'Community', href: '/community', ariaLabel: 'Community' },
          { label: 'About', href: '/about', ariaLabel: 'About Empower Her' },
        ],
      },
      {
        label: isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : 'Account',
        bgColor: '#8b6540',
        textColor: '#f7f4ef',
        links: isAuthenticated
          ? [{ label: 'Search', href: '/search', ariaLabel: 'Search Empower Her' }, ...accountLinks]
          : accountLinks,
      },
    ];
  }, [handleLogout, isAuthenticated, unread, user]);

  return (
    <header className="site-header">
      <CardNav
        logoAlt="Empower Her"
        items={items}
        baseColor="transparent"
        menuColor="#1b3a2f"
        buttonBgColor="#1b3a2f"
        buttonTextColor="#f7f4ef"
        buttonLabel={isAuthenticated ? 'Dashboard' : 'Join'}
        buttonTo={isAuthenticated ? '/dashboard' : '/register'}
        ease="power3.out"
      />
    </header>
  );
}

export default SiteHeader;
