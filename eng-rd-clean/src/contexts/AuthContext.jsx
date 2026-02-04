// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, verifyToken, logoutAdmin } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('adminToken');
      console.log('Checking auth on app load, token:', savedToken ? 'Present' : 'Not found');
      
      if (savedToken) {
        try {
          const response = await verifyToken(savedToken);
          
          console.log('Token verification response:', response);
          
          if (response.success) {
            setToken(savedToken);
            setUser(response.user);
            setIsAuthenticated(true);
            console.log('Authentication successful');
          } else {
            // Token is invalid, remove it
            console.log('Token verification failed, removing token');
            localStorage.removeItem('adminToken');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('adminToken');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('No token found in localStorage');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login with:', { username, password: '***' });
      const response = await loginAdmin(username, password);

      console.log('Login response:', response);

      if (response.success) {
        const { token: newToken, user: userData } = response;
        
        console.log('Login successful, saving token:', newToken ? 'Token received' : 'No token');
        
        // Save token to localStorage
        localStorage.setItem('adminToken', newToken);
        
        // Update state
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('Auth state updated successfully');
        
        return { success: true, message: response.message };
      } else {
        console.log('Login failed:', response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Erreur de connexion';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint (optional, mainly for logging purposes)
      await logoutAdmin();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('adminToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};