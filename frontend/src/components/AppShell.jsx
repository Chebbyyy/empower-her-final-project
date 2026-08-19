import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1 pt-20" tabIndex={-1}>
        <div className="section-wrap page-section">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export default AppShell;
