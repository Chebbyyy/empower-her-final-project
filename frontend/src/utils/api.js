import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthBootstrap =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/me');
      if (!isAuthBootstrap && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error.response?.data?.message || error.response?.data?.error || error.message || fallback;

const throwFetchError = (error, fallback) => {
  throw getErrorMessage(error, fallback);
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Registration failed');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Login failed');
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not start password reset');
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not reset password');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load user');
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update profile');
  }
};

export const fetchResources = async () => {
  try {
    const response = await api.get('/resources');
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load resources');
  }
};

export const addResource = async (resourceData) => {
  try {
    const response = await api.post('/resources', resourceData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not add resource');
  }
};

export const fetchBooks = async (params = {}) => {
  try {
    const response = await api.get('/books', { params });
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load books');
  }
};

export const addBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not add book');
  }
};

export const fetchEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load events');
  }
};

export const addEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not create event');
  }
};

export const rsvpEvent = async (id) => {
  try {
    const response = await api.post(`/events/${id}/rsvp`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not RSVP');
  }
};

export const cancelRsvp = async (id) => {
  try {
    const response = await api.delete(`/events/${id}/rsvp`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not cancel RSVP');
  }
};

export const fetchMentorshipProfiles = async (params = {}) => {
  try {
    const response = await api.get('/mentorship/profiles', { params });
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load mentorship profiles');
  }
};

export const fetchMyMentorshipProfile = async () => {
  try {
    const response = await api.get('/mentorship/me');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load mentorship profile');
  }
};

export const saveMentorshipProfile = async (data) => {
  try {
    const response = await api.put('/mentorship/me', data);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not save mentorship profile');
  }
};

export const fetchMentorshipRequests = async () => {
  try {
    const response = await api.get('/mentorship/requests');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load requests');
  }
};

export const sendMentorshipRequest = async (data) => {
  try {
    const response = await api.post('/mentorship/requests', data);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not send request');
  }
};

export const respondMentorshipRequest = async (id, status) => {
  try {
    const response = await api.patch(`/mentorship/requests/${id}`, { status });
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update request');
  }
};

export const fetchFavorites = async (params = {}) => {
  try {
    const response = await api.get('/favorites', { params });
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load saved items');
  }
};

export const addFavorite = async (data) => {
  try {
    const response = await api.post('/favorites', data);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not save item');
  }
};

export const removeFavorite = async (itemType, itemId) => {
  try {
    const response = await api.delete(`/favorites/${itemType}/${itemId}`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not remove favorite');
  }
};

export const checkFavorite = async (itemType, itemId) => {
  try {
    const response = await api.get(`/favorites/${itemType}/${itemId}`);
    return response.data?.saved;
  } catch {
    return false;
  }
};

export const fetchPosts = async (params = {}) => {
  try {
    const response = await api.get('/posts', { params });
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load posts');
  }
};

export const createPost = async (data) => {
  try {
    const response = await api.post('/posts', data);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not create post');
  }
};

export const addComment = async (postId, body) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { body });
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not add comment');
  }
};

export const fetchAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load admin stats');
  }
};

export const fetchAdminUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load users');
  }
};

export const fetchAdminMessages = async () => {
  try {
    const response = await api.get('/admin/messages');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load messages');
  }
};

export const markAdminMessageRead = async (id) => {
  try {
    const response = await api.patch(`/admin/messages/${id}/read`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update message');
  }
};

export const fetchAdminPhotos = async () => {
  try {
    const response = await api.get('/admin/photos');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not load photos');
  }
};

export const setAdminPhotoApproval = async (id, isApproved) => {
  try {
    const response = await api.patch(`/admin/photos/${id}/approval`, { isApproved });
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update photo');
  }
};

export const setAdminUserRole = async (id, role) => {
  try {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update role');
  }
};

export const searchSite = async (q) => {
  try {
    const response = await api.get('/search', { params: { q } });
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Search failed');
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    throwFetchError(error, 'Could not load notifications');
  }
};

export const fetchUnreadNotificationCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data?.count || 0;
  } catch {
    return 0;
  }
};

export const markNotificationRead = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update notification');
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not update notifications');
  }
};

export const submitContact = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, 'Could not send message');
  }
};

export default api;
