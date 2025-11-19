import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchResources, addResource } from '../utils/api.js';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', description: '', link: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      const data = await fetchResources();
      setResources(data);
      setLoading(false);
    };
    loadResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newResource.title && newResource.link) {
      setIsAdding(true);
      try {
        const addedResource = await addResource(newResource);
        setResources([...resources, addedResource]);
        setNewResource({ title: '', description: '', link: '', category: '' });
      } catch (error) {
        alert('Error adding resource');
      } finally {
        setIsAdding(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-600">Loading resources...</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Empowerment Resources
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover curated resources for women's empowerment, education, and career development.
        </p>
      </motion.div>

      {/* Resources Grid */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length > 0 ? resources.map((res, idx) => (
            <motion.div
              key={res._id || idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-sm">RES</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{res.title}</h3>
              {res.description && <p className="text-gray-600 mb-4">{res.description}</p>}
              <motion.a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Visit Resource →
              </motion.a>
            </motion.div>
          )) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">BOOK</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Resources Yet</h3>
              <p className="text-gray-500">Be the first to add an empowerment resource!</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Add Resource Form */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Resource
          </h3>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Enter resource title"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                placeholder="Brief description of the resource"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource Link</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="url"
                placeholder="https://example.com"
                value={newResource.link}
                onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isAdding}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Adding...
                  </>
                ) : (
                  '+ Add Resource'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Resources;
