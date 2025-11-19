import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/resources', label: 'Resources' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-white/90 backdrop-blur-md p-4 shadow-lg mb-8 border-b border-primary-100"
    >
      <div className="max-w-6xl mx-auto flex justify-center space-x-8">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <Link
              to={item.to}
              className={`relative font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.to
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-primary-600 hover:text-empower-purple hover:bg-secondary-50'
              }`}
            >
              {item.label}
              {location.pathname === item.to && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;