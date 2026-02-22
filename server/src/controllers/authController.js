import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/auth/auth.js';
import { resolveJwtUser } from '../middleware/auth/auth.js';

/**
 * Handles the landing page request.
 * * Uses JWT resolution to check for an existing token.
 * * Redirects authenticated users to their specific dashboard based on role.
 * * Renders the public landing page for unauthenticated visitors.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const landingGet = (req, res) => {
  // Identify user status from token
  resolveJwtUser(req, res, (err, user) => {
    if (user) {
      // Redirect to specific dashboard based on role
      return user.admin
        ? res.redirect('/admin/dashboard')
        : res.redirect('/dashboard');
    }
    res.render('landing');
  });
};

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
 * Handles user registration.
 * * Validates form input and returns errors if necessary.
 * * Hashes the user password using bcrypt (10 salt rounds).
 * * Persists the new user record to the database via authQueries.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const signupPost = async (req, res, next) => {
  try {
    // Validate form inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/sign-up-form', {
        errors: errors.array(),
        formData: req.body,
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Save user to DB
    await authQueries.registerUser({
      username: req.body.username,
      password: hashedPassword,
    });

    res.redirect('/log-in');
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
        admin: user.admin,
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
      return user.admin
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
