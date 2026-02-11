import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Admin - Thresholds
export const getThresholds = () => API.get('/admin/thresholds');
export const createThreshold = (data) => API.post('/admin/thresholds', data);
export const updateThreshold = (id, data) => API.put(`/admin/thresholds/${id}`, data);
export const deleteThreshold = (id) => API.delete(`/admin/thresholds/${id}`);

// Admin - Alerts
export const getAllAlerts = () => API.get('/admin/alerts');

// Operator - Values
export const submitValue = (data) => API.post('/operator/values', data);
export const getMyValues = () => API.get('/operator/values');

// Operator - Alerts
export const getMyAlerts = () => API.get('/operator/alerts');

export default API;
