/**
 * Authentication Controller
 * @module controllers/authController
 */

import passport from 'passport';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/authQueries.js';

/**
 * Handles the landing page request.
 * If the user is already authenticated, they are redirected to their respective dashboard
 * based on their role. Otherwise, the public landing page is rendered.
 */
export const landingGet = (req, res) => {
  if (req.isAuthenticated()) {
    return req.user.admin
      ? res.redirect('/admin/dashboard')
      : res.redirect('/dashboard');
  }
  res.render('landing');
};

/**
 * Renders the sign-up form.
 */
export const signupGet = (req, res) => res.render('auth/sign-up-form');

/**
 * Renders the log-in form.
 */
export const loginGet = (req, res) => res.render('auth/log-in-form');

/**
 * Handles user registration.
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

    // Using authQueries instead of direct Prisma or pool calls
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
 * Handles login via Passport.
 */
export const loginPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/log-in-form', {
      errors: errors.array(),
      formData: req.body,
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/log-in');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      if (user.admin === true) {
        return res.redirect('/admin/dashboard');
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
};

/**
 * Handles user logout.
 * Destroys the session and redirects to the landing page.
 */
export const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
