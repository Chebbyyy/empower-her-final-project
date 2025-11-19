import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public Pages
import Header from './components/Header.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/Home.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Gallery from './pages/Gallery.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Protected Pages
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Resources from './pages/Resources.jsx';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
            >
              <Header />
              <Navbar />
              <main className="max-w-6xl mx-auto bg-white p-8 my-8 rounded-lg shadow-lg min-h-[400px] border border-gray-200">
                <HomePage />
              </main>
            </motion.div>
          )
        }
      />

      <Route
        path="/resources"
        element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          >
            <Header />
            <Navbar />
            <main className="max-w-6xl mx-auto p-8 my-8 min-h-[400px]">
              <Resources />
            </main>
          </motion.div>
        }
      />

      <Route
        path="/about"
        element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          >
            <Header />
            <Navbar />
            <main className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm p-8 my-8 rounded-lg shadow-xl min-h-[400px] border border-white/20">
              <About />
            </main>
          </motion.div>
        }
      />

      <Route
        path="/contact"
        element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
          >
            <Header />
            <Navbar />
            <main className="max-w-6xl mx-auto p-8 my-8 min-h-[400px]">
              <Contact />
            </main>
          </motion.div>
        }
      />

      <Route
        path="/gallery"
        element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
          >
            <Header />
            <Navbar />
            <main className="max-w-7xl mx-auto p-8 my-8 min-h-[400px]">
              <Gallery />
            </main>
          </motion.div>
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
            >
              <Header />
              <Navbar />
              <main className="max-w-6xl mx-auto bg-white p-8 my-8 rounded-lg shadow-lg min-h-[400px]">
                <Dashboard />
              </main>
            </motion.div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
            >
              <Header />
              <Navbar />
              <main className="max-w-6xl mx-auto bg-white p-8 my-8 rounded-lg shadow-lg min-h-[400px]">
                <Profile />
              </main>
            </motion.div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50"
            >
              <Header />
              <Navbar />
              <main className="max-w-6xl mx-auto bg-white p-8 my-8 rounded-lg shadow-lg min-h-[400px]">
                <Resources />
              </main>
            </motion.div>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AnimatePresence>
  );
}

export default App;
