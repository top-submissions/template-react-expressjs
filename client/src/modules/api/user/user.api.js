const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Service for user-related API calls.
 * - Handles identity verification and profile retrieval.
 */
export const userApi = {
  /**
   * Retrieves the currently logged-in user session.
   * Crucial for AuthProvider initialization.
   * @returns {Promise<Response>}
   */
  getMe: async () => {
    // Identity check via HttpOnly cookie
    return fetch(`${BASE_URL}/api/user/me`, {
      method: 'GET',
      credentials: 'include',
    });
  },

  /**
   * Fetches profile details for the authenticated user.
   * @returns {Promise<Response>}
   */
  getProfile: async () => {
    // Returns basic profile data
    return fetch(`${BASE_URL}/api/user/profile`, {
      method: 'GET',
      credentials: 'include',
    });
  },

  /**
   * Fetches a specific user record by its ID.
   * Primarily used for admin management views.
   * @param {number|string} userId
   * @returns {Promise<Response>}
   */
  getById: async (userId) => {
    // Path parameter lookup
    return fetch(`${BASE_URL}/api/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
  },
};
