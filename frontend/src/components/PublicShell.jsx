import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';
import FadeInPage from './FadeInPage.jsx';

function PublicShell() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className={`flex-1 ${isHome ? '' : 'pt-20'}`} tabIndex={-1}>
        <FadeInPage>
          <Outlet />
        </FadeInPage>
      </main>
      <SiteFooter />
    </div>
  );
}

export default PublicShell;
