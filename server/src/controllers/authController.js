/**
 * Authentication Controller
 * * Manages user lifecycle events including registration, login via Local Strategy,
 * JWT issuance, and cookie-based logout.
 * * @module controllers/authController
 */

import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/authQueries.js';
import { resolveJwtUser } from '../middleware/authMiddleware.js';

/**
 * Handles the landing page request.
 * Uses the JWT resolution middleware to check for an existing token.
 * If a valid token is found in cookies or headers, redirects to the appropriate dashboard.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const landingGet = (req, res) => {
  resolveJwtUser(req, res, (err, user) => {
    if (user) {
      return user.admin
        ? res.redirect('/admin/dashboard')
        : res.redirect('/dashboard');
    }
    res.render('landing');
  });
};

/**
 * Renders the user registration (sign-up) form.
 */
export const signupGet = (req, res) => res.render('auth/sign-up-form');

/**
 * Renders the login form.
 */
export const loginGet = (req, res) => res.render('auth/log-in-form');

/**
 * Handles user registration.
 * Validates input, hashes the password using bcrypt, and persists the
 * new user to the database via authQueries.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const signupPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/sign-up-form', {
        errors: errors.array(),
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

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
 * Uses Passport's 'local' strategy to verify credentials. Upon success,
 * generates a signed JWT and stores it in an HttpOnly cookie for stateless
 * browser authentication.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const loginPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/log-in-form', {
      errors: errors.array(),
      formData: req.body,
    });
  }

  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect('/log-in');

      await authQueries.updateLastLogin(user.id);

      const payload = {
        id: user.id,
        username: user.username,
        admin: user.admin,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      /**
       * Set the JWT in an HttpOnly cookie.
       * This protects against XSS attacks and allows EJS templates to
       * remain authenticated without client-side script intervention.
       */
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return user.admin
        ? res.redirect('/admin/dashboard')
        : res.redirect('/dashboard');
    },
  )(req, res, next);
};

/**
 * Handles user logout.
 * In a JWT architecture, logout is performed by clearing the cookie on the client.
 * The server does not maintain a session to destroy.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logoutGet = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};
