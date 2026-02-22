import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from '../../routes/authRouter.js';
import * as authQueries from '../../db/queries/auth/auth.js';
import pool from '../../db/pool.js';

// Setup environment variables for JWT logic
process.env.JWT_SECRET = 'test-secret';

// Mock the DB pool
vi.mock('../../db/pool.js', () => ({
  default: {
    query: vi.fn(),
  },
}));

// Mock DB queries
vi.mock('../../db/queries/auth/auth.js', () => ({
  registerUser: vi.fn(),
  updateLastLogin: vi.fn(),
}));

// Mock Passport strategies
vi.mock('passport', () => ({
  default: {
    authenticate: vi.fn(),
  },
}));

/**
 * Integration Tests for Authentication Flow.
 * - Tests the journey from registration to login/logout.
 * - Validates cookie setting and JWT redirection logic.
 * - Ensures form validation blocks invalid submissions.
 */
describe('Auth Integration Tests', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();

    // Initialize express app with necessary parsing and routing
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use('/', authRouter);
  });

  describe('POST /sign-up', () => {
    it('should hash password and redirect on successful registration', async () => {
      // --- Arrange ---
      const userData = {
        username: 'newuser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      // Ensure validator's DB check returns 0 rows (username available)
      pool.query.mockResolvedValue({ rows: [] });

      // Ensure controller's DB save succeeds
      authQueries.registerUser.mockResolvedValue({
        id: 1,
        username: 'newuser',
      });

      // --- Act ---
      const response = await request(app).post('/sign-up').send(userData);

      // --- Assert ---
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/log-in');
      expect(authQueries.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringMatching('Password123'),
        }),
      );
    });
  });

  describe('POST /log-in', () => {
    it('should set an HttpOnly cookie and redirect admin to admin dashboard', async () => {
      // --- Arrange ---
      const credentials = { username: 'admin', password: 'password' };
      const mockAdmin = { id: 99, username: 'admin', admin: true };

      // Mock passport to trigger the successful callback
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res, next) => callback(null, mockAdmin);
        },
      );

      // --- Act ---
      const response = await request(app).post('/log-in').send(credentials);

      // --- Assert ---
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/admin/dashboard');
      // Verify cookie existence
      expect(response.header['set-cookie'][0]).toContain('token=');
      expect(response.header['set-cookie'][0]).toContain('HttpOnly');
    });
  });

  describe('GET /log-out', () => {
    it('should clear the token cookie and redirect to landing', async () => {
      // --- Arrange ---
      // No specific setup needed for simple redirect

      // --- Act ---
      const response = await request(app).get('/log-out');

      // --- Assert ---
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/');
      // Verify cookie clearing instruction
      expect(response.header['set-cookie'][0]).toContain('token=;');
    });
  });
});
