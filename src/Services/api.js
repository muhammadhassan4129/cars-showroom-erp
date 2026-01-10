import axios from 'axios';

// Base URL
const API_BASE_URL = 'https://d9045ab15ede.ngrok-free.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420'
  },
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const tokenType = localStorage.getItem('token_type') || 'Bearer';
  
  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs
// ============================================
export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'), // Get current user info
};

// ============================================
// BARGAIN APIs
// ============================================
export const bargainAPI = {
  getAll: () => api.get('/bargains'),
  getById: (id) => api.get(`/bargains/${id}`),
  create: (data) => api.post('/bargains', data),
  update: (id, data) => api.put(`/bargains/${id}`, data),
  delete: (id) => api.delete(`/bargains/${id}`),
  toggleStatus: (id) => api.patch(`/bargains/${id}/toggle-status`),
};

// ============================================
// CUSTOMER APIs
// ============================================
export const customerAPI = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// ============================================
// VEHICLE APIs
// ============================================
export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

// ============================================
// PURCHASE APIs
// ============================================
export const purchaseAPI = {
  getAll: () => api.get('/purchases'),
  create: (data) => api.post('/purchases', data),
};

// ============================================
// SALE APIs
// ============================================
export const saleAPI = {
  getAll: () => api.get('/sales'),
  create: (data) => api.post('/sales', data),
};

// ============================================
// INSTALLMENT APIs
// ============================================
export const installmentAPI = {
  getAll: () => api.get('/installments'),
  pay: (id, data) => api.post(`/installments/${id}/pay`, data),
};

export default api;