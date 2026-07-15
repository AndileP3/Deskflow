import React, { createContext, useContext, useState, useCallback } from 'react';
import { login as loginRequest } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('deskflow_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const data = await loginRequest(email, password);
      localStorage.setItem('deskflow_token', data.token);
      localStorage.setItem('deskflow_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('deskflow_token');
    localStorage.removeItem('deskflow_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, authError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
