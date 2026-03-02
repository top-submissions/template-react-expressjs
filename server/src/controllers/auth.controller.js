import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/auth/auth.queries.js';
import { resolveJwtUser } from '../middleware/auth/auth.middleware.js';
import { AuthenticationError, ValidationError } from '../errors/AppError.js';

/**
 * Handles user registration via JSON API.
 * * Validates form input and returns JSON error arrays if necessary.
 * * Hashes password and persists user to DB.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware.
 */
export const signupPost = async (req, res, next) => {
  try {
    // Validate inputs using server-side rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationError('Registration failed', errors.array()));
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Save user to DB
    await authQueries.registerUser({
      username: req.body.username,
      password: hashedPassword,
    });

    // Return success status for React to handle navigation
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles login and JWT issuance.
 * * Authenticates credentials via Passport local strategy.
 * * Updates the user's last login timestamp.
 * * Issues a 30-day HttpOnly cookie token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const loginPost = (req, res, next) => {
  // Validate login input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return validation errors as JSON
    return next(new ValidationError('Login validation failed', errors.array()));
  }

  // Verify credentials via Local Strategy
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      // Handle server or database errors
      if (err) return next(err);

      // Handle invalid credentials
      if (!user) {
        return next(
          new AuthenticationError(
            info?.message || 'Invalid username or password'
          )
        );
      }

      // Refresh last login timestamp
      await authQueries.updateLastLogin(user.id);

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      // Issue 30-day token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      // Save token in secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // Return success and user data for frontend state
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
 * Handles user logout.
 * * Clears the 'token' cookie from the client's browser.
 * * Redirects the user to the public landing page.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const logoutGet = (req, res) => {
  // Delete authentication token
  res.clearCookie('token');
  res.redirect('/');
};
