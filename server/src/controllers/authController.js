import { MyPool } from '../db/pool';
import passport from 'passport';

export const authSignupGet = (req, res) => res.render('auth/sign-up-form');

export const authSignupPost = async (req, res, next) => {
  try {
    await MyPool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [req.body.username, req.body.password],
    );
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
};

export const authLoginGet = (req, res) =>
  res.render('index', { user: req.user });

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
