import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const adminService = {
  // Users
  getUsers: () => axios.get(`${API_URL}/admin/users`),
  addUser: (userData) => axios.post(`${API_URL}/admin/users`, userData),
  updateUser: (id, userData) => axios.put(`${API_URL}/admin/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`${API_URL}/admin/users/${id}`),

  // Products
  getProducts: () => axios.get(`${API_URL}/admin/products`),
  addProduct: (productData) => axios.post(`${API_URL}/admin/products`, productData),
  updateProduct: (id, productData) => axios.put(`${API_URL}/admin/products/${id}`, productData),
  deleteProduct: (id) => axios.delete(`${API_URL}/admin/products/${id}`),

  // Orders
  getOrders: () => axios.get(`${API_URL}/admin/orders`),
  updateOrderStatus: (id, status) => axios.patch(`${API_URL}/admin/orders/${id}`, { status }),
  getOrderDetails: (id) => axios.get(`${API_URL}/admin/orders/${id}`),

  // Dashboard
  getStats: () => axios.get(`${API_URL}/admin/stats`),
};

export default adminService;
// import axios from 'axios';

// // ✅ Bddel l port mn 3000 l 8000 (nafs l'API li khdama fiha l front)
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// const adminService = {
//   // Users
//   getUsers: () => axios.get(`${API_URL}/admin/users`),
//   addUser: (userData) => axios.post(`${API_URL}/admin/users`, userData),
//   updateUser: (id, userData) => axios.put(`${API_URL}/admin/users/${id}`, userData),
//   deleteUser: (id) => axios.delete(`${API_URL}/admin/users/${id}`),

//   // Products
//   getProducts: () => axios.get(`${API_URL}/admin/products`),
//   addProduct: (productData) => axios.post(`${API_URL}/admin/products`, productData),
//   updateProduct: (id, productData) => axios.put(`${API_URL}/admin/products/${id}`, productData),
//   deleteProduct: (id) => axios.delete(`${API_URL}/admin/products/${id}`),

//   // Orders
//   getOrders: () => axios.get(`${API_URL}/admin/orders`),
//   updateOrderStatus: (id, status) => axios.patch(`${API_URL}/admin/orders/${id}`, { status }),
//   getOrderDetails: (id) => axios.get(`${API_URL}/admin/orders/${id}`),

//   // Dashboard
//   getStats: () => axios.get(`${API_URL}/admin/stats`),
// };

// export default adminService;
// services/adminService.js
import api from './api'; // ✅ Use same API instance with interceptors

