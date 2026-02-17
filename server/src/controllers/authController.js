/**
 * Authentication Controller
 *
 * Handles all authentication-related HTTP requests including user registration,
 * login, logout, and page rendering for authentication views.
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
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
      req.body.username,
      hashedPassword,
    ]);

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
 * On success redirects to landing page, on failure redirects back to login.
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
