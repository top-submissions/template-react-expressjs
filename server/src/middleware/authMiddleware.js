/**
 * Authentication & Authorization Middleware
 *
 * Provides middleware functions to protect routes based on authentication status
 * and user roles (admin/non-admin). These middleware functions should be used
 * before route handlers to control access to different parts of the application.
 *
 * @module middleware/authMiddleware
 */

/**
 * Middleware to restrict access to authenticated users only.
 *
 * If user is authenticated, proceeds to the next middleware/route handler.
 * If not authenticated, returns 401 Unauthorized response.
 * Use for routes that require login (e.g., dashboard, profile).
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

/**
 * Middleware to restrict access to administrators only.
 *
 * Checks both authentication status AND admin role.
 * If user is authenticated and has admin privileges, proceeds to next middleware.
 * Otherwise returns 403 Forbidden response.
 * Use for admin-only routes (e.g., admin panel, user management).
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const isAdmin = (req, res, next) => {
  // Check if user is logged in AND has admin privileges
  if (req.isAuthenticated() && req.user && req.user.admin === true) {
    return next();
  }
  // Return 403 Forbidden - user doesn't have required permissions
  res
    .status(403)
    .json({ message: 'Access denied: Administrator privileges required' });
};

/**
 * Middleware to restrict access to non-administrator users only.
 *
 * Allows access to users who are either not logged in OR logged in as regular users.
 * Redirects administrators away (useful for hiding regular user features from admins).
 * Use for routes that should be inaccessible to admins (e.g., upgrade prompts, user-only features).
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const isNotAdmin = (req, res, next) => {
  // Allow access if: not logged in OR logged in as regular user
  if (!req.isAuthenticated() || (req.user && req.user.admin !== true)) {
    return next();
  }
  // Redirect admins to admin dashboard
  res.redirect('/admin/dashboard');
};
