/**
 * Authentication Middleware
 *
 * Provides middleware functions to protect routes based on authentication status.
 * These middleware functions should be used before route handlers to control access.
 *
 * @module middleware/authMiddleware
 */

/**
 * Middleware to restrict access to authenticated users only.
 *
 * If user is authenticated, proceeds to the next middleware/route handler.
 * If not authenticated, returns 401 Unauthorized response.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Please log in first' });
};

/**
 * Middleware to restrict access to non-authenticated users only.
 *
 * If user is not authenticated, proceeds to the next middleware/route handler.
 * If authenticated, redirects to dashboard.
 * Use for login/registration pages to prevent authenticated users from accessing them.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};
