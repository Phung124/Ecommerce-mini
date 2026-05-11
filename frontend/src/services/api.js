import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({ baseURL: 'https://ecommerce-q7ge.onrender.com/api' });

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.status, err.response?.data);
    if (err.response?.status === 401 && localStorage.getItem('user')) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    return Promise.reject(err);
  }
);

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 0, size = 10) => api.get(`/admin/users?page=${page}&size=${size}`),
  toggleUserRole: (id) => api.put(`/admin/users/${id}/role`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Products
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Categories
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Orders
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status?status=${status}`),
};

export default api;
