import axios from 'axios';

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const userAPI = {
  me: () => api.get('/users/me'),
  listAll: () => api.get('/users'),
  delete: (id) => api.delete(`/users/${id}`),
};

export const categoryAPI = {
  list: () => api.get('/categories'),
  create: (name) => api.post('/categories', { name }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const productAPI = {
  list: (categoryId, q) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (q) params.append('q', q);
    return api.get(`/products?${params}`);
  },
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  myOrders: () => api.get('/orders/my'),
  sellerOrders: () => api.get('/orders/seller'),
  allOrders: () => api.get('/orders'),
  get: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const paymentAPI = {
  create: (data) => api.post('/payments', data),
  getByOrder: (orderId) => api.get(`/payments/order/${orderId}`),
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
