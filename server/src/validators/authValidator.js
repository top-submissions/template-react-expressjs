/**
 * Authentication Validators
 *
 * Express-validator rules for user authentication forms.
 * Provides validation chains for signup, login, and extended registration.
 * Includes database checks for uniqueness where applicable.
 *
 * @module validators/authValidator
 */

import { body } from 'express-validator';
import pool from '../db/pool.js';

/**
 * Error message constants
 * Centralized error messages for consistent user feedback
 */
const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';
const passwordLengthErr = 'must be at least 6 characters long.';
const emailErr = 'must be a valid email address.';

/**
 * Signup Validation Chain
 *
 * Validates:
 * - Username: length, character set, uniqueness
 * - Password: length, complexity requirements
 * - Confirm Password: matches password
 *
 * @type {Array} Express-validator middleware chain
 */
export const validateSignup = [
  // Username validation
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.')
    // Database uniqueness check
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

  // Password validation
  body('password')
    .isLength({ min: 6 })
    .withMessage(`Password ${passwordLengthErr}`)
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.'),

  // Confirm password validation
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password.');
    }
    return true;
  }),
];

/**
 * Login Validation Chain
 *
 * Basic validation for login form:
 * - Username: required
 * - Password: required
 *
 * @type {Array} Express-validator middleware chain
 */
export const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

/**
 * Extended Signup Validation with Email
 *
 * Includes all signup validations plus email validation:
 * - Email format validation
 * - Email uniqueness check
 *
 * @type {Array} Express-validator middleware chain
 */
export const validateSignupWithEmail = [
  ...validateSignup,
  body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    // Email uniqueness database check
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
