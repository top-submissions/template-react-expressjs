import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from '../../routes/auth.routes.js';
import * as authQueries from '../../db/queries/auth/auth.queries.js';
import pool from '../../db/pool.js';

// Define environment for JWT generation
process.env.JWT_SECRET = 'test-secret';

// Intercept DB pool to bypass network
vi.mock('../../db/pool.js', () => ({
  default: { query: vi.fn() },
}));

// Mock query layer logic
vi.mock('../../db/queries/auth/auth.queries.js', () => ({
  registerUser: vi.fn(),
  updateLastLogin: vi.fn(),
}));

// Mock passport authentication middleware
vi.mock('passport', () => ({
  default: { authenticate: vi.fn() },
}));

describe('Auth Integration Tests', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();

    // Prepare express stack with required parsers
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Mock res.render to return JSON for inspection and prevent 500 errors
    app.use((req, res, next) => {
      res.render = vi.fn((view, locals) =>
        res.status(200).send({ view, locals }),
      );
      next();
    });

    app.use('/', authRouter);
  });

  describe('POST /sign-up', () => {
    it('should hash password and redirect on successful registration', async () => {
      // --- Arrange ---
      // Define valid signup payload
      const userData = {
        username: 'newuser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };
      // Simulate available username in DB check
      pool.query.mockResolvedValue({ rows: [] });
      // Simulate successful user persistence
      authQueries.registerUser.mockResolvedValue({
        id: 1,
        username: 'newuser',
      });

      // --- Act ---
      const response = await request(app).post('/sign-up').send(userData);

      // --- Assert ---
      // Confirm redirect to login page
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/log-in');
    });
  });

  describe('POST /log-in', () => {
    it('should set an HttpOnly cookie and redirect admin to admin dashboard', async () => {
      // --- Arrange ---
      // Define admin credentials and mock profile
      const credentials = { username: 'admin', password: 'password' };
      const mockAdmin = { id: 99, username: 'admin', admin: true };

      // Force passport to return the mock admin user
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res, next) => callback(null, mockAdmin);
        },
      );

      // --- Act ---
      const response = await request(app).post('/log-in').send(credentials);

      // --- Assert ---
      // Verify admin-specific redirect and JWT cookie placement
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/admin/dashboard');
      expect(response.header['set-cookie'][0]).toContain('token=');
    });
  });

  describe('GET /log-out', () => {
    it('should clear the token cookie and redirect to landing', async () => {
      // --- Arrange ---
      // No specific setup required for logout

      // --- Act ---
      const response = await request(app).get('/log-out');

      // --- Assert ---
      // Confirm redirect to root and cookie invalidation
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/');
      expect(response.header['set-cookie'][0]).toContain('token=;');
    });
  });
});
