import React, { useState, useEffect } from 'react';
import { fetchResources, addResource } from '../utils/api.js';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', link: '' });
  const [loading, setLoading] = useState(true);

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
      try {
        const addedResource = await addResource(newResource);
        setResources([...resources, addedResource]);
        setNewResource({ title: '', link: '' });
      } catch (error) {
        alert('Error adding resource');
      }
    }
  };

  if (loading) return <div className="text-center text-lg text-gray-600">Loading resources...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Empowerment Resources</h2>
      <ul className="space-y-3 mb-8">
        {resources.map((res, idx) => (
          <li key={res._id || idx} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
            <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 font-semibold hover:text-purple-800">{res.title}</a>
          </li>
        ))}
      </ul>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Resource</h3>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Resource Title"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="url"
            placeholder="Resource Link"
            value={newResource.link}
            onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">Add Resource</button>
      </form>
    </div>
  );
};

export default Resources;