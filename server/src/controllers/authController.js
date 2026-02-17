import pool from '../db/pool.js';
import passport from 'passport';
import bcrypt from 'bcryptjs';

export const authIndexGet = (req, res) => res.render('index');

export const authSignupGet = (req, res) => res.render('auth/sign-up-form');

export const authSignupPost = async (req, res, next) => {
  try {
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

export const authLoginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});

export const authLogoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
