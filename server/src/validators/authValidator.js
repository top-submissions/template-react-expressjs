import { body } from 'express-validator';
import pool from '../db/pool.js';

// Centralized error message fragments
const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';
const passwordLengthErr = 'must be at least 6 characters long.';
const emailErr = 'must be a valid email address.';

/**
 * Signup Validation Chain.
 * * Validates username length, format, and database uniqueness.
 * * Enforces password complexity (length, casing, and digits).
 * * Verifies that the confirmation password matches the primary password.
 * @type {Array<import('express-validator').ValidationChain>}
 */
export const validateSignup = [
  // Setup username requirements
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.')
    // Verify username is not already in use
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

  // Setup password complexity
  body('password')
    .isLength({ min: 6 })
    .withMessage(`Password ${passwordLengthErr}`)
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),

  // Ensure password confirmation matches
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password.');
    }
    return true;
  }),
];

/**
 * Login Validation Chain.
 * * Ensures both username and password fields are populated.
 * @type {Array<import('express-validator').ValidationChain>}
 */
export const validateLogin = [
  // Require identity fields
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

/**
 * Extended Signup Validation with Email.
 * * Inherits all standard signup validation rules.
 * * Adds email format validation and database uniqueness checks.
 * @type {Array<import('express-validator').ValidationChain>}
 */
export const validateSignupWithEmail = [
  // Spread existing rules
  ...validateSignup,

  // Setup email requirements
  body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    // Verify email is not already registered
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
