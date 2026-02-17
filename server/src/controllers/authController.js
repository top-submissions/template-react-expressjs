/**
 * Authentication Controller
 *
 * Handles all authentication-related HTTP requests including user registration,
 * login, logout, page rendering, and admin-specific functionality.
 *
 * @module controllers/authController
 */

import pool from '../db/pool.js';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

/**
 * Renders the landing page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authLandingGet = (req, res) => res.render('landing');

/**
 * Renders the user dashboard.
 * Requires authentication - should be protected by isAuthenticated middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authDashboardGet = (req, res) => res.render('dashboard');

/**
 * Renders the admin dashboard.
 * Requires admin privileges - should be protected by isAdmin middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authAdminDashboardGet = (req, res) => {
  res.render('admin/dashboard', { user: req.user });
};

/**
 * Renders the user management page for admins.
 * Requires admin privileges - should be protected by isAdmin middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express request object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authAdminUsersGet = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, admin, created_at FROM users ORDER BY id',
    );
    res.render('admin/users', { users: rows });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Promotes a regular user to administrator.
 * Requires admin privileges - should be protected by isAdmin middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authAdminPromotePost = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await pool.query('UPDATE users SET admin = true WHERE id = $1', [userId]);
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Renders the upgrade account page for regular users.
 * Should be protected by isNotAdmin middleware to hide from admins.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authUpgradeGet = (req, res) => {
  res.render('upgrade-account');
};

/**
 * Renders the user settings page.
 * Requires authentication and should be hidden from admins (isNotAdmin).
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authSettingsGet = (req, res) => {
  res.render('settings', { user: req.user });
};

/**
 * Renders the sign-up form.
 * Should be protected by isNotAuthenticated middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authSignupGet = (req, res) => res.render('auth/sign-up-form');

/**
 * Handles user registration form submission.
 *
 * Validates input, hashes password with bcrypt, creates new user in database.
 * By default, new users are created as regular users (admin = false).
 * On success redirects to landing page, on failure re-renders form with errors.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authSignupPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/sign-up-form', {
        errors: errors.array(),
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // New users are created as regular users (admin = false by default)
    await pool.query(
      'INSERT INTO users (username, password, admin) VALUES ($1, $2, $3)',
      [req.body.username, hashedPassword, false],
    );

    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Renders the login form.
 * Should be protected by isNotAuthenticated middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */
export const authLoginGet = (req, res) => res.render('auth/log-in-form');

/**
 * Handles login form submission.
 *
 * Validates input, then uses Passport local strategy for authentication.
 * On success redirects to dashboard, on failure redirects back to login.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authLoginPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/log-in-form', {
      errors: errors.array(),
      formData: req.body,
    });
  }

  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/log-in',
    failureFlash: true,
  })(req, res, next);
};

/**
 * Handles user logout.
 *
 * Destroys user session and redirects to landing page.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const authLogoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
