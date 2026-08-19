import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  updateProfile as apiUpdateProfile,
} from '../utils/api.js';

const AuthContext = createContext();

const stripToken = (data) => {
  if (!data || typeof data !== 'object') return data;
  const { token, ...user } = data;
  return user;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(stripToken(userData));
        } catch {
          apiLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (userData) => {
    const data = await apiRegister(userData);
    const user = stripToken(data);
    setUser(user);
    return user;
  };

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    const user = stripToken(data);
    setUser(user);
    return user;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const updateUser = async (userData) => {
    const updated = await apiUpdateProfile(userData);
    setUser(stripToken(updated));
    return updated;
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
