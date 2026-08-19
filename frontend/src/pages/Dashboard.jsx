import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchResources } from '../utils/api.js';
import PageHeader from '../components/PageHeader.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({ totalResources: 0, userInterests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const resourcesData = await fetchResources();
        const list = Array.isArray(resourcesData) ? resourcesData : [];
        setResources(list);
        setStats({
          totalResources: list.length,
          userInterests: user?.interests?.length || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const recentResources = resources.slice(0, 3);

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`}
        description="Pick up where you left off — resources, profile, and community are a click away."
      />

      <dl className="grid grid-cols-1 gap-8 border-y border-line py-8 sm:grid-cols-2 mb-12">
        <div>
          <dt className="text-sm text-ink-muted">Resources available</dt>
          <dd className="mt-1 font-statement text-4xl text-ink">
            {loading ? '—' : stats.totalResources}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">Your interests</dt>
          <dd className="mt-1 font-statement text-4xl text-ink">
            {loading ? '—' : stats.userInterests}
          </dd>
        </div>
      </dl>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-forest tracking-tight mb-5">Quick links</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/library" className="btn-outline">
            Explore library
          </Link>
          <Link to="/events" className="btn-outline">
            Upcoming events
          </Link>
          <Link to="/mentorship" className="btn-outline">
            Mentorship
          </Link>
          <Link to="/saved" className="btn-outline">
            Saved items
          </Link>
          <Link to="/community" className="btn-outline">
            Community
          </Link>
          <Link to="/notifications" className="btn-outline">
            Notifications
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn-outline">
              Admin
            </Link>
          )}
          <Link to="/resources" className="btn-primary">
            Explore resources
          </Link>
          <Link to="/profile" className="btn-outline">
            Update profile
          </Link>
          <Link to="/gallery" className="btn-outline">
            View gallery
          </Link>
          <Link to="/contact" className="btn-outline">
            Contact us
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl text-forest tracking-tight">Recent resources</h2>
          <Link to="/resources" className="link-brass text-sm">
            View all
          </Link>
        </div>
        {recentResources.length > 0 ? (
          <ul className="space-y-0">
            {recentResources.map((resource, index) => (
              <li
                key={resource._id || index}
                className="border-l-2 border-forest pl-4 py-4 border-b border-line last:border-b-0"
              >
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-ink hover:text-forest transition-colors"
                >
                  {resource.title}
                </a>
                <p className="mt-1 truncate text-sm text-ink-muted">{resource.link}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted">
            {loading
              ? 'Loading…'
              : 'No resources yet. Add one on the Resources page to help others get started.'}
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
