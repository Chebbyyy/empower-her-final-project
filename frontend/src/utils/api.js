import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Auth API functions
export const register = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Resources API functions
export const fetchResources = async () => {
  try {
    const response = await axios.get('/resources');
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
};

export const addResource = async (resourceData) => {
  try {
    const response = await axios.post('/resources', resourceData);
    return response.data;
  } catch (error) {
    console.error('Error adding resource:', error);
    throw error;
  }
};

// Export axios instance as default
export default axios;
