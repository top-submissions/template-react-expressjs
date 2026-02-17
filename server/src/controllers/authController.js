import pool from '../db/pool.js';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

export const authIndexGet = (req, res) => res.render('index');

export const authSignupGet = (req, res) => res.render('auth/sign-up-form');

export const authSignupPost = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/sign-up-form', {
        errors: errors.array(),
        formData: req.body,
      });
    }

    // Hash password and create user
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

export const authLoginGet = (req, res) => res.render('auth/log-in-form');

export const authLoginPost = (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/log-in-form', {
      errors: errors.array(),
      formData: req.body,
    });
  }

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
  })(req, res, next);
};

export const authLogoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
