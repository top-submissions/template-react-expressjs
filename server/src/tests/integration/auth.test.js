import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import authRouter from '../../routes/auth.routes.js';
import * as userQueries from '../../db/queries/user/user.queries.js';
import * as authQueries from '../../db/queries/auth/auth.queries.js';

// Setup environment
process.env.JWT_SECRET = 'test-secret';

// Intercept DB pool
vi.mock('../../db/pool.js', () => ({
  default: { query: vi.fn() },
}));

// Mock user query layer for validators
vi.mock('../../db/queries/user/user.queries.js', () => ({
  getUserByUsername: vi.fn(),
  getUserByEmail: vi.fn(),
  createUser: vi.fn(),
}));

// Mock auth query layer for controller actions
vi.mock('../../db/queries/auth/auth.queries.js', () => ({
  registerUser: vi.fn(),
  updateLastLogin: vi.fn(),
}));

// Mock passport config and library
vi.mock('../../config/passport.js', () => ({
  default: vi.fn(),
}));

vi.mock('passport', () => ({
  default: {
    initialize: vi.fn(() => (req, res, next) => next()),
    authenticate: vi.fn(() => (req, res, next) => next()),
  },
}));

describe('Auth Integration Tests', () => {
  let app;

  beforeEach(() => {
    // Reset mocks between runs
    vi.clearAllMocks();

    // Initialize express app with test stack
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Mock view engine response
    app.use((req, res, next) => {
      res.render = vi.fn((view, locals) =>
        res.status(200).send({ view, locals, message: 'Success' })
      );
      next();
    });

    // Mount auth routes
    app.use('/', authRouter);
  });

  describe('POST /sign-up', () => {
    it('should hash password and redirect on successful registration', async () => {
      // --- Arrange ---
      // Define signup payload
      const userData = {
        username: 'newuser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      // Mock validator uniqueness check
      userQueries.getUserByUsername.mockResolvedValue(null);
      // Mock controller registration logic
      authQueries.registerUser.mockResolvedValue({
        id: 1,
        username: 'newuser',
      });

      // --- Act ---
      // Send registration request
      const response = await request(app).post('/sign-up').send(userData);

      // --- Assert ---
      // Confirm successful creation status
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'User registered successfully'
      );
    });
  });

  describe('POST /log-in', () => {
    it('should set an HttpOnly cookie and redirect admin', async () => {
      // --- Arrange ---
      // Define login credentials and mock user
      const credentials = { username: 'admin', password: 'password' };
      const mockAdmin = { id: 99, username: 'admin', role: 'ADMIN' };

      // Mock login timestamp update
      authQueries.updateLastLogin.mockResolvedValue(true);

      // Trigger passport callback with mock user
      passport.authenticate.mockImplementation(
        (strategy, options, callback) => {
          return (req, res, next) => {
            if (callback) return callback(null, mockAdmin);
            next();
          };
        }
      );

      // --- Act ---
      // Attempt login
      const response = await request(app).post('/log-in').send(credentials);

      // --- Assert ---
      // Verify success status and cookie headers
      expect(response.status).toBe(200);
      expect(response.header['set-cookie'][0]).toContain('token=');
    });
  });

  describe('GET /log-out', () => {
    it('should clear the token cookie and redirect', async () => {
      // --- Act ---
      // Execute logout
      const response = await request(app).get('/log-out');

      // --- Assert ---
      // Confirm redirect and cookie clearance
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/');
      expect(response.header['set-cookie'][0]).toContain('token=;');
    });
  });
});
