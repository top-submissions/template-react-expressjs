// client\src\modules\validators\auth.validator.test.js
import { describe, it, expect } from 'vitest';
import { signupSchema } from './auth.validator';

/**
 * Unit tests for client-side auth validation schemas.
 * * Validates that Zod correctly identifies malformed input.
 */
describe('Auth Client Validators', () => {
  it('should invalidate a username with special characters', () => {
    // --- Arrange ---
    const invalidData = {
      username: 'user@name',
      password: 'Password1',
      confirmPassword: 'Password1',
    };

    // --- Act ---
    const result = signupSchema.safeParse(invalidData);

    // --- Assert ---
    expect(result.success).toBe(false);
    // Check if the specific regex error message is returned
    expect(result.error.issues[0].message).toContain(
      'Only letters, numbers, and underscores',
    );
  });

  it('should invalidate mismatching passwords', () => {
    // --- Arrange ---
    const mismatchData = {
      username: 'validUser',
      password: 'Password1',
      confirmPassword: 'WrongPassword1',
    };

    // --- Act ---
    const result = signupSchema.safeParse(mismatchData);

    // --- Assert ---
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("Passwords don't match");
  });
});
