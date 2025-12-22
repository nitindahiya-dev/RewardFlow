// src/config/api.ts
// Centralized API configuration

// Get API base URL from environment variable
// Vite requires VITE_ prefix for environment variables to be accessible in the browser
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Export API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    MFA_SETUP: `${API_BASE_URL}/api/auth/mfa/setup`,
    MFA_VERIFY: `${API_BASE_URL}/api/auth/mfa/verify`,
    MFA_DISABLE: `${API_BASE_URL}/api/auth/mfa/disable`,
    WEB3_NONCE: `${API_BASE_URL}/api/auth/web3-nonce`,
    WEB3_VERIFY: `${API_BASE_URL}/api/auth/web3-verify`,
  },
  // Task endpoints
  TASKS: {
    BASE: `${API_BASE_URL}/api/tasks`,
    PUBLIC: `${API_BASE_URL}/api/tasks/public`,
    SEARCH: `${API_BASE_URL}/api/tasks/search`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    CLAIM: (id: string) => `${API_BASE_URL}/api/tasks/${id}/claim`,
    COMPLETE: (id: string) => `${API_BASE_URL}/api/tasks/${id}/complete`,
  },
  // Comment endpoints
  COMMENTS: {
    BY_TASK: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/comments`,
  },
  // User endpoints
  USERS: {
    PROFILE: (userId: string) => `${API_BASE_URL}/api/users/${userId}/profile`,
  },
};

// Export base URL for direct use if needed
export { API_BASE_URL };

