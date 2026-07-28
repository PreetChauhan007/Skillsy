import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

const api = axios.create({
  baseURL:"https://skillsy-696t.onrender.com/api",
  withCredentials: true,
});

// Attach token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (email, password) => api.post('/users/login', { email, password }),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateProfilePhoto: (formData) => api.put('/users/profile/photo', formData),
};

// Users API
export const usersAPI = {
  searchUsers: (query, skill) => api.get('/users/search', { params: { query, skill } }),
  getUserById: (id) => api.get(`/users/${id}`),
  getUserFeedback: (id) => api.get(`/users/${id}/feedback`),
};

// Swaps API
export const swapsAPI = {
  createSwapRequest: (data) => api.post('/swaps/create', data),
  getMySwapRequests: () => api.get('/swaps/my'),
  getReceivedSwapRequests: () => api.get('/swaps/received'),
  updateSwapStatus: (id, status) => api.patch(`/swaps/${id}/status`, { status }),
  getAllSwaps: () => api.get('/swaps/all'),
};

// Skills API
export const skillsAPI = {
  getAllSkills: () => api.get('/skills'),
  getSkillById: (id) => api.get(`/skills/${id}`),
  addSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: (data) => api.post('/feedback', data),
  getUserFeedback: (userId) => api.get(`/feedback/user/${userId}`),
  getSwapFeedback: (swapId) => api.get(`/feedback/swap/${swapId}`),
  getAllFeedback: () => api.get('/feedback'),
};

// Admin API
export const adminAPI = {
  banUser: (userId, reason = 'Banned by admin') => api.patch(`/admin/ban-user/${userId}`, { reason }),
  unbanUser: (userId) => api.patch(`/admin/unban-user/${userId}`),
  rejectSkill: (skillId) => api.delete(`/admin/reject-skill/${skillId}`),
  sendPlatformMessage: (data) => api.post('/admin/platform-message', data),
  getAdminActions: () => api.get('/admin/actions'),
};

export default api;