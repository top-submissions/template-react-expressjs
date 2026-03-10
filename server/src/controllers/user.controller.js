import * as userQueries from '../db/queries/user/user.queries.js';
import { InternalServerError } from '../errors/ServerError.js';
import { AuthenticationError, NotFoundError } from '../errors/AppError.js';

/**
 * Returns the current authenticated user's session data.
 * - Used by the frontend AuthProvider to sync state on refresh.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Next middleware.
 */
export const getCurrentUser = (req, res, next) => {
  // session check via passport/middleware
  if (!req.user) {
    return next(new AuthenticationError('User session not found'));
  }

  // respond with formatted user object
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
};

/**
 * Provides account details for the current user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
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

/**
 * Fetches a specific user by ID for administrative views.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Next middleware.
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // query database using integer ID
    const user = await userQueries.getUserById(Number(id));

    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    // Strip sensitive data before returning
    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};
