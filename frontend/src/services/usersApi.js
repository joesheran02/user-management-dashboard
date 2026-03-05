import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3030';

/**
 * Axios instance pre-configured for the FeathersJS API
 */
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ─── Request Interceptor ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Normalize Errors ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── Users API ───────────────────────────────────────────────────

/**
 * Fetch all non-deleted users with optional gender filter
 * @param {Object} params - Query params (e.g. { gender: 'Male' })
 */
export const fetchUsers = async (params = {}) => {
  const query = {
    deleted: false,
    $limit: 100,
    $sort: { created_at: -1 },
    ...params,
  };
  const response = await api.get('/users', { params: query });
  // FeathersJS paginated response returns { data, total, limit, skip }
  return response.data?.data || response.data || [];
};

/**
 * Create a new user
 * @param {Object} userData - User fields
 */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * Update a user by ID
 * @param {number} id
 * @param {Object} userData
 */
export const updateUser = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData);
  return response.data;
};

/**
 * Soft delete a user by setting deleted: true
 * @param {number} id
 */
export const softDeleteUser = async (id) => {
  const response = await api.patch(`/users/${id}`, {
    deleted: true,
    deleted_at: new Date().toISOString(),
  });
  return response.data;
};

export default api;
