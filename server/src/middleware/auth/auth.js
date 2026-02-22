import passport from 'passport';

/**
 * Resolves the current user from the JWT, if present.
 * * Invokes the Passport JWT strategy in stateless mode.
 * * Executes a callback with the authenticated user or error.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} callback - Execution hook receiving (err, user).
 * @returns {void}
 */
export const resolveJwtUser = (req, res, callback) => {
  // Trigger passport authentication without session support
  passport.authenticate('jwt', { session: false }, callback)(req, res);
};

/**
 * Route guard that allows only authenticated users.
 * * Verifies presence and validity of the JWT.
 * * Terminates request with 401 if authentication fails.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const isAuthenticated = (req, res, next) => {
  // Check for valid user identity
  resolveJwtUser(req, res, (err, user) => {
    if (err) return next(err);

    // Block unauthorized access
    if (!user) return res.status(401).json({ message: 'Please log in first' });

    // Attach identity to request
    req.user = user;
    return next();
  });
};

/**
 * Route guard that allows only guest (unauthenticated) users.
 * * Prevents logged-in users from accessing login or signup pages.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const isNotAuthenticated = (req, res, next) => {
  // Ensure no user is currently logged in
  resolveJwtUser(req, res, (err, user) => {
    if (user) return res.status(400).json({ message: 'Already authenticated' });
    return next();
  });
};

/**
 * Route guard that allows only authenticated administrators.
 * * Validates JWT and verifies the administrative flag in the database record.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const isAdmin = (req, res, next) => {
  // Verify user and admin status
  resolveJwtUser(req, res, (err, user) => {
    if (err) return next(err);

    // Verify admin privileges
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
 * Prevents administrators from accessing standard user-only routes.
 * * Redirects logged-in admins to the admin dashboard.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const isNotAdmin = (req, res, next) => {
  // Check if current user has admin role
  resolveJwtUser(req, res, (err, user) => {
    // Redirect if admin is in the wrong area
    if (user?.admin === true) return res.redirect('/admin/dashboard');
    return next();
  });
};
