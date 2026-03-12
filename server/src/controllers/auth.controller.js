import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/auth/auth.queries.js';
import { AuthenticationError, ValidationError } from '../errors/AppError.js';
import { InternalServerError } from '../errors/ServerError.js';

/**
 * Registers a new user.
 * - Validates inputs.
 * - Hashes password.
 * - Persists record via auth queries.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Error handler.
 */
export const signupPost = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError('Registration failed', errors.array()));
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Save user to database
    try {
      await authQueries.registerUser({
        username: req.body.username,
        password: hashedPassword,
      });
    } catch (dbError) {
      return next(
        new InternalServerError(
          'Failed to persist user to database during signup'
        )
      );
    }

    // Return success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticates user and issues JWT.
 * - Executes Passport local strategy.
 * - Updates login timestamp.
 * - Sets HttpOnly cookie.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Error handler.
 */
export const loginPost = (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError('Login validation failed', errors.array()));
  }

  // Invoke passport local strategy
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      // Handle server errors
      if (err) {
        return next(
          new InternalServerError(
            'Authentication service encountered a database error'
          )
        );
      }

      // Handle failed credentials
      if (!user) {
        return next(
          new AuthenticationError(
            info?.message || 'Invalid username or password'
          )
        );
      }

      // Track last login time
      await authQueries.updateLastLogin(user.id);

      // Prepare JWT data
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      // Sign 30-day token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      // Attach secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Final success response
      return res.status(200).json({
        message: 'Login successful',
        user: {
          username: user.username,
          role: user.role,
        },
      });
    }
  )(req, res, next);
};

/**
 * Terminates user session.
 * - Clears authentication cookie.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 */
export const logoutGet = (req, res) => {
  // Clear the token cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  // Return JSON
  res.status(200).json({ message: 'Logged out successfully' });
};
