import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the JWT to every outgoing request, if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('deskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses so components can rely on a consistent shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const getTickets = (status) =>
  api
    .get('/tickets', { params: status ? { status } : {} })
    .then((res) => res.data);

export const createTicket = (payload) =>
  api.post('/tickets', payload).then((res) => res.data);

export const updateTicketStatus = (id, status) =>
  api.put(`/tickets/${id}`, { status }).then((res) => res.data);

export default api;
