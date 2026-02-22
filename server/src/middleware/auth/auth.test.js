import { vi, describe, it, expect, beforeEach } from 'vitest';
import passport from 'passport';
import * as authMiddleware from './auth.js';

// Setup Vitest to mock passport authentication behavior
vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(),
  },
}));

describe('authMiddleware module', () => {
  let req, res, next;

  // Initialize fresh express mock objects before each test
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
      const mockUser = { id: 1, username: 'test' };

      // Setup: Mock passport to successfully return a user
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, mockUser);
        },
      );

      authMiddleware.isAuthenticated(req, res, next);

      // Verify: User is attached and request continues
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no user is found', () => {
      // Setup: Mock passport to return no user
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, false);
        },
      );

      authMiddleware.isAuthenticated(req, res, next);

      // Verify: Request blocked with unauthorized status
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please log in first' });
    });
  });

  describe('isAdmin()', () => {
    it('should allow access if user is admin', () => {
      const adminUser = { id: 1, admin: true };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, adminUser);
        },
      );

      authMiddleware.isAdmin(req, res, next);

      // Verify: Admin check passes
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      const regularUser = { id: 2, admin: false };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, regularUser);
        },
      );

      authMiddleware.isAdmin(req, res, next);

      // Verify: Access forbidden
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('isNotAuthenticated()', () => {
    it('should return 400 if user is already logged in', () => {
      const existingUser = { id: 1 };
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res) => callback(null, existingUser);
        },
      );

      authMiddleware.isNotAuthenticated(req, res, next);

      // Verify: Prevent duplicate login/signup sessions
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
