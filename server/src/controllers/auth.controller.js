import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/auth/auth.queries.js';
import { resolveJwtUser } from '../middleware/auth/auth.middleware.js';

/**
 * Renders the user registration (sign-up) form.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const signupGet = (req, res) => res.render('auth/sign-up-form');

/**
 * Renders the login form.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const loginGet = (req, res) => res.render('auth/log-in-form');

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
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
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
 * * Updates the user's last login timestamp in the database.
 * * Generates a signed JWT valid for 30 days.
 * * Sets an HttpOnly cookie containing the token for stateless auth.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const loginPost = (req, res, next) => {
  // Validate login input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/log-in-form', {
      errors: errors.array(),
      formData: req.body,
    });
  }

  // Verify credentials via Local Strategy
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect('/log-in');

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

      // Send user to appropriate dashboard
      const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
      return isAdmin
        ? res.redirect('/admin/dashboard')
        : res.redirect('/dashboard');
    },
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
