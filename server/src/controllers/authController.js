/**
 * Authentication Controller
 * @module controllers/authController
 */

import passport from 'passport';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import * as authQueries from '../db/queries/authQueries.js';

export const landingGet = (req, res) => res.render('landing');
export const signupGet = (req, res) => res.render('auth/sign-up-form');
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

  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/log-in',
  })(req, res, next);
};

export const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
