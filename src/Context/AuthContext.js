import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'https://7938d54a7b90.ngrok-free.app/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function with API
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      const { user, token, token_type } = response.data;

      // Extract role from roles array
      const userRole = user.roles && user.roles.length > 0 
        ? user.roles[0].name 
        : null;

      // Prepare user data
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole, // 'super_admin' or 'bargain_manager'
        bargain_id: user.bargain_id,
        bargain_name: user.bargain?.name || null,
        is_active: user.is_active,
      };

      // Save to state
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('token_type', token_type);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Call logout API (optional)
      if (token) {
        await axios.post(
          `${API_BASE_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear everything
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  // Helper functions
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isManager = () => user?.role === 'bargain_manager';
  const getBargainId = () => user?.bargain_id;
  const getToken = () => localStorage.getItem('auth_token');

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      loading,
      isSuperAdmin,
      isManager,
      getBargainId,
      getToken,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};