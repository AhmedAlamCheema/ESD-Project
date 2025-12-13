import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token')) loadUser();
    else setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const res = await userAPI.me();
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('token', res.data.token);
    await loadUser();
  };

  const register = async (data) => {
    await authAPI.register(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasRole = (role) => user?.roles?.includes(role);
  const isAdmin = () => hasRole('ADMIN');
  const isFarmer = () => hasRole('FARMER');
  const isBuyer = () => hasRole('BUYER');

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isFarmer, isBuyer, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
