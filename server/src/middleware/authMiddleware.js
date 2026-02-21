/**
 * Authentication & Authorization Middleware
 *
 * Route guards using JWT via Passport's JWT strategy.
 * No session is used — each request is authenticated independently
 * via the Authorization: Bearer <token> header.
 *
 * @module middleware/authMiddleware
 */

import passport from 'passport';

/**
 * Resolves the current user from the JWT, if present.
 * Calls callback(err, user) — user will be false/null if not authenticated.
 * Not a middleware itself; used internally by the guard functions below.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} callback - (err, user) => void
 */
export const resolveJwtUser = (req, res, callback) => {
  passport.authenticate('jwt', { session: false }, callback)(req, res);
};

/**
 * Allows only authenticated users.
 * Verifies the JWT from the Authorization header.
 * Attaches the user object to req.user on success.
 */
export const isAuthenticated = (req, res, next) => {
  resolveJwtUser(req, res, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Please log in first' });
    req.user = user;
    return next();
  });
};

/**
 * Allows only unauthenticated users (e.g., login/signup pages).
 * If a valid JWT is present, the request is rejected.
 */
export const isNotAuthenticated = (req, res, next) => {
  resolveJwtUser(req, res, (err, user) => {
    if (user) return res.status(400).json({ message: 'Already authenticated' });
    return next();
  });
};

/**
 * Allows only authenticated admins.
 * Checks both JWT validity and the admin flag on the user record.
 */
export const isAdmin = (req, res, next) => {
  resolveJwtUser(req, res, (err, user) => {
    if (err) return next(err);
    if (!user || user.admin !== true) {
      return res
        .status(403)
        .json({ message: 'Access denied: Administrator privileges required' });
    }
    req.user = user;
    return next();
  });
};

/**
 * Blocks admins from accessing regular-user-only routes.
 * Non-authenticated users are allowed through (they'll be caught by isAuthenticated elsewhere).
 */
export const isNotAdmin = (req, res, next) => {
  resolveJwtUser(req, res, (err, user) => {
    if (user?.admin === true) return res.redirect('/admin/dashboard');
    return next();
  });
};
