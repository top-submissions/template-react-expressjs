import { InternalServerError } from '../errors/ServerError.js';
import { AuthenticationError } from '../errors/AppError.js';

/**
 * Provides account details for the current user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 * @returns {void}
 */
export const profileGet = (req, res, next) => {
  // Ensure user exists in request from auth middleware
  if (!req.user) {
    return next(new AuthenticationError('User session not found'));
  }

  // Return user details as JSON
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
};
