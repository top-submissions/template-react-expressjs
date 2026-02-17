import { body } from 'express-validator';
import pool from '../db/pool.js';

const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';
const passwordLengthErr = 'must be at least 6 characters long.';
const emailErr = 'must be a valid email address.';

// Signup validation
export const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.')
    .custom(async (username) => {
      const { rows } = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [username],
      );
      if (rows.length > 0) {
        throw new Error('Username already taken.');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage(`Password ${passwordLengthErr}`)
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password.');
    }
    return true;
  }),
];

// Login validation
export const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required.'),

  body('password').notEmpty().withMessage('Password is required.'),
];

// Optional: If you want to add email field later
export const validateSignupWithEmail = [
  ...validateSignup,
  body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .custom(async (email) => {
      const { rows } = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email],
      );
      if (rows.length > 0) {
        throw new Error('Email already registered.');
      }
      return true;
    }),
];
