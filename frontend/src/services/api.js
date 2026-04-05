import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, log out user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  getDoctorProfile: () => api.get('/auth/doctor-profile'),
  updateDoctorProfile: (profileData) => api.put('/auth/doctor-profile', profileData),
};

// Doctors API calls
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  getBySpecialty: (specialty) => api.get(`/doctors/specialty/${specialty}`),
  create: (doctorData) => api.post('/doctors', doctorData),
  update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Appointments API calls
export const appointmentAPI = {
  create: (appointmentData) => api.post('/appointments', appointmentData),
  getByPatient: (patientId, params) => api.get(`/appointments/patient/${patientId}`, { params }),
  getByDoctor: (doctorId, params) => api.get(`/appointments/doctor/${doctorId}`, { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  getSlots: (doctorId, params) => api.get(`/appointments/doctor/${doctorId}/slots`, { params }),
  update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAll: (params) => api.get('/appointments', { params }),
};

// Specialties API calls
export const specialtyAPI = {
  getAll: (params) => api.get('/specialties', { params }),
  getById: (id) => api.get(`/specialties/${id}`),
};

// Admin API calls
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Doctors
  getAllDoctors: (params) => api.get('/admin/doctors', { params }),
  createDoctor: (doctorData) => api.post('/admin/doctors', doctorData),
  updateDoctor: (id, doctorData) => api.put(`/admin/doctors/${id}`, doctorData),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  toggleDoctorStatus: (id) => api.put(`/admin/doctors/${id}/toggle-status`),

  // Appointments
  getAllAppointments: (params) => api.get('/admin/appointments', { params }),
  updateAppointmentStatus: (id, status) => api.put(`/admin/appointments/${id}/status`, { status }),
  deleteAppointment: (id) => api.delete(`/admin/appointments/${id}`),
};

// Payment API calls
export const paymentAPI = {
  createOrder: (appointmentId) => api.post('/payments/create-order', { appointmentId }),
  verifyPayment: (paymentData) => api.post('/payments/verify-payment', paymentData),
};

export default api;