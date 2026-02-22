import { vi, describe, it, expect, beforeEach } from 'vitest';
import passport from 'passport';
import * as authMiddleware from './auth.middleware.js';

// Mock passport to control authentication outcomes
vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(),
  },
}));

describe('authMiddleware module', () => {
  let req, res, next;

  // Initialize fresh mocks for every test case
  beforeEach(() => {
    vi.clearAllMocks();
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe('isAuthenticated()', () => {
    it('should attach user to req and call next if authenticated', () => {
      // --- Arrange ---
      // Define a valid user and simulate successful passport verification
      const mockUser = { id: 1, username: 'test' };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, mockUser);
        },
      );

      // --- Act ---
      authMiddleware.isAuthenticated(req, res, next);

      // --- Assert ---
      // Verify user injection and middleware progression
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no user is found', () => {
      // --- Arrange ---
      // Simulate passport failing to resolve a user
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, false);
        },
      );

      // --- Act ---
      authMiddleware.isAuthenticated(req, res, next);

      // --- Assert ---
      // Ensure the request is blocked with unauthorized status
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please log in first' });
    });
  });

  describe('isAdmin()', () => {
    it('should allow access if user is admin', () => {
      // --- Arrange ---
      // Define a user with the admin flag set to true
      const adminUser = { id: 1, admin: true };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, adminUser);
        },
      );

      // --- Act ---
      authMiddleware.isAdmin(req, res, next);

      // --- Assert ---
      // Confirm the request proceeds for admins
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      // --- Arrange ---
      // Define a standard user lacking admin privileges
      const regularUser = { id: 2, admin: false };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, regularUser);
        },
      );

      // --- Act ---
      authMiddleware.isAdmin(req, res, next);

      // --- Assert ---
      // Ensure access is forbidden for non-admins
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('isNotAuthenticated()', () => {
    it('should return 400 if user is already logged in', () => {
      // --- Arrange ---
      // Simulate an active session during a guest-only route request
      const existingUser = { id: 1 };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, existingUser);
        },
      );

      // --- Act ---
      authMiddleware.isNotAuthenticated(req, res, next);

      // --- Assert ---
      // Block the request to prevent duplicate sessions
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
