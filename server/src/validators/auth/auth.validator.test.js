import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as authValidator from './auth.validator.js';
import pool from '../../db/pool.js';

// Intercept DB pool to bypass real network calls
vi.mock('../../db/pool.js', () => ({
  default: {
    query: vi.fn(),
  },
}));

/**
 * Executes express-validator chains against mock data.
 * - Wraps request body in a mock object.
 * - Runs all validation chains in parallel.
 * - Collects results via validationResult.
 * @param {Array} validations - The array of ValidationChains to test.
 * @param {Object} data - Mock request body (req.body).
 * @returns {Promise<Array>} Array of error objects (msg, path, etc.).
 */
const runValidation = async (validations, data) => {
  const req = { body: data };

  // Trigger internal execution of each validator chain
  await Promise.all(validations.map((validation) => validation.run(req)));

  const { validationResult } = await import('express-validator');
  return validationResult(req).array();
};

describe('authValidator module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateSignup', () => {
    it('should fail if username contains invalid characters', async () => {
      // --- Arrange ---
      // Define payload with illegal special characters
      const data = {
        username: 'user@123',
        password: 'Password1',
        confirmPassword: 'Password1',
      };

      // --- Act ---
      const errors = await runValidation(authValidator.validateSignup, data);

      // --- Assert ---
      // Confirm the regex pattern identified the invalid format
      expect(
        errors.some((e) => e.msg.includes('letters, numbers, and underscores')),
      ).toBe(true);
    });

    it('should fail if username is already taken in the database', async () => {
      // --- Arrange ---
      const data = {
        username: 'existingUser',
        password: 'Password1',
        confirmPassword: 'Password1',
      };
      // Simulate database finding a matching record
      pool.query.mockResolvedValue({ rows: [{ id: 1 }] });

      // --- Act ---
      const errors = await runValidation(authValidator.validateSignup, data);

      // --- Assert ---
      // Verify custom async validator caught the conflict
      expect(errors.some((e) => e.msg === 'Username already taken.')).toBe(
        true,
      );
    });

    it('should fail if passwords do not match', async () => {
      // --- Arrange ---
      // Define mismatching password and confirmation
      const data = {
        username: 'validUser',
        password: 'Password1',
        confirmPassword: 'Mismatch1',
      };
      pool.query.mockResolvedValue({ rows: [] });

      // --- Act ---
      const errors = await runValidation(authValidator.validateSignup, data);

      // --- Assert ---
      // Verify cross-field equality check failed
      expect(
        errors.some((e) => e.msg.includes('confirmation does not match')),
      ).toBe(true);
    });
  });

  describe('validateLogin', () => {
    it('should fail if required fields are missing', async () => {
      // --- Arrange ---
      // Define empty strings to trigger .notEmpty() checks
      const data = { username: '', password: '' };

      // --- Act ---
      const errors = await runValidation(authValidator.validateLogin, data);

      // --- Assert ---
      expect(errors.length).toBe(2);
      // Map messages to ignore race-condition array order
      const messages = errors.map((e) => e.msg);
      expect(messages).toContain('Username is required.');
      expect(messages).toContain('Password is required.');
    });
  });

  describe('validateSignupWithEmail', () => {
    it('should fail if email format is invalid', async () => {
      // --- Arrange ---
      // Define a syntactically incorrect email address
      const data = {
        username: 'validUser',
        password: 'Password1',
        confirmPassword: 'Password1',
        email: 'not-an-email',
      };
      pool.query.mockResolvedValue({ rows: [] });

      // --- Act ---
      const errors = await runValidation(
        authValidator.validateSignupWithEmail,
        data,
      );

      // --- Assert ---
      // Verify the isEmail() validator caught the format error
      expect(
        errors.some((e) => e.msg.includes('must be a valid email address')),
      ).toBe(true);
    });
  });
});
