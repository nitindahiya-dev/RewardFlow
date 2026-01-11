// Get API base URL from environment variable, with fallback to localhost
// Remove trailing slash if present to avoid double slashes
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, ''); // Remove trailing slashes

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    MFA_SETUP: `${API_BASE_URL}/api/auth/mfa/setup`,
    MFA_VERIFY: `${API_BASE_URL}/api/auth/mfa/verify`,
    MFA_DISABLE: `${API_BASE_URL}/api/auth/mfa/disable`,
    WEB3_NONCE: `${API_BASE_URL}/api/auth/web3-nonce`,
    WEB3_VERIFY: `${API_BASE_URL}/api/auth/web3-verify`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/api/tasks`,
    PUBLIC: `${API_BASE_URL}/api/tasks/public`,
    SEARCH: `${API_BASE_URL}/api/tasks/search`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/tasks/${id}`,
    CLAIM: (id: string) => `${API_BASE_URL}/api/tasks/${id}/claim`,
    COMPLETE: (id: string) => `${API_BASE_URL}/api/tasks/${id}/complete`,
  },
  COMMENTS: {
    BY_TASK: (taskId: string) => `${API_BASE_URL}/api/tasks/${taskId}/comments`,
  },
  USERS: {
    PROFILE: (userId: string) => `${API_BASE_URL}/api/users/${userId}/profile`,
  },
};

export { API_BASE_URL };

