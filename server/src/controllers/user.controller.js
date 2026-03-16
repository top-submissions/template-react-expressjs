import * as userQueries from '../db/queries/user/user.queries.js';
import { InternalServerError } from '../errors/ServerError.js';
import { AuthenticationError, NotFoundError } from '../errors/AppError.js';

/**
 * Returns the current authenticated user's session data.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Next middleware.
 */
export const getCurrentUser = (req, res, next) => {
  if (!req.user) return next(new AuthenticationError('User session not found'));

  // Include createdAt in session sync
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      createdAt: req.user.createdAt,
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
  if (!req.user) return next(new AuthenticationError('User session not found'));

  // Include createdAt for current user profile
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      createdAt: req.user.createdAt,
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
    const targetId = parseInt(id, 10);

    if (isNaN(targetId))
      return next(new NotFoundError('Invalid User ID format'));

    const user = await userQueries.getUserById(targetId);
    if (!user) return next(new NotFoundError(`User with ID ${id} not found`));

    // Map fields from Prisma result to standardized response
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(new InternalServerError(err.message));
  }
};
