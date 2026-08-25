import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

import { API_BASE_URL } from '../api/client';

const API = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fr_token'));
  const [loading, setLoading] = useState(true);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`);
      if (data.success) setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    if (data.success) {
      localStorage.setItem('fr_token', data.token);
      setToken(data.token);
      setUser(data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    return data;
  };

  const register = async (name, email, password, phone, role = 'user') => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password, phone, role });
    if (data.success) {
      localStorage.setItem('fr_token', data.token);
      setToken(data.token);
      setUser(data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    return data;
  };

  const googleLogin = async (googleData) => {
    const { data } = await axios.post(`${API}/auth/google`, googleData);
    if (data.success) {
      localStorage.setItem('fr_token', data.token);
      setToken(data.token);
      setUser(data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fr_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (updates) => {
    const { data } = await axios.put(`${API}/auth/profile`, updates);
    if (data.success) setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, updateProfile, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
