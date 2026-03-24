import axios from 'axios';

/**
 * Centralized Axios instance for all API calls.
 * - Pre-configured with the backend base URL.
 * - Auth token is injected per-request via the `setAuthInterceptor` helper.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Attach a Clerk `getToken` function so every request automatically
 * includes the Authorization header when a token is available.
 *
 * Call this once from AppContext after Clerk initializes:
 *   setAuthInterceptor(getToken);
 *
 * @param {() => Promise<string|null>} getTokenFn
 */
export const setAuthInterceptor = (getTokenFn) => {
  api.interceptors.request.use(async (config) => {
    try {
      // Skip auth for public endpoints
      const publicPaths = ['/api/course/all', '/api/course/'];
      const isPublic = publicPaths.some((p) => config.url?.startsWith(p));
      if (isPublic && !config.headers.Authorization) return config;

      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // If token fetch fails, continue without auth
    }
    return config;
  });
};

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;
