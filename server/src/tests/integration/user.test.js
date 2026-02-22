import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/user.routes.js';

vi.mock('../../middleware/auth/auth.middleware.js', () => ({
  isAuthenticated: vi.fn((req, res, next) => {
    req.user = { id: 10, username: 'standard_user', admin: false };
    next();
  }),
  isNotAdmin: vi.fn((req, res, next) => {
    if (req.user && !req.user.admin) return next();
    res.redirect('/admin/dashboard');
  }),
}));

describe('User Integration Tests', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();

    // Middleware: Intercept res.render to prevent 500 "View not found" errors
    app.use((req, res, next) => {
      res.render = vi.fn((view, locals) =>
        res.status(200).send({ view, locals }),
      );
      next();
    });

    app.use('/user', userRouter);
  });

  describe('GET /user/dashboard', () => {
    it('should render the dashboard with the current user context', async () => {
      // --- Arrange ---
      // Identity handled by isAuthenticated mock

      // --- Act ---
      const response = await request(app).get('/user/dashboard');

      // --- Assert ---
      expect(response.status).toBe(200);
      // Verify: Controller passed the correct view name and data
      expect(response.body.view).toBe('dashboard');
      expect(response.body.locals.currentUser.username).toBe('standard_user');
    });
  });

  describe('GET /user/upgrade-account', () => {
    it('should allow access to standard users', async () => {
      // --- Arrange ---
      // Standard setup applies

      // --- Act ---
      const response = await request(app).get('/user/upgrade-account');

      // --- Assert ---
      expect(response.status).toBe(200);
      expect(response.body.view).toBe('upgrade-account');
    });

    it('should redirect if the user is an admin', async () => {
      // --- Arrange ---
      const { isNotAdmin } =
        await import('../../middleware/auth/auth.middleware.js');
      isNotAdmin.mockImplementationOnce((req, res, next) => {
        res.redirect('/admin/dashboard');
      });

      // --- Act ---
      const response = await request(app).get('/user/upgrade-account');

      // --- Assert ---
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/admin/dashboard');
    });
  });

  describe('GET /user/settings', () => {
    it('should render settings with user data', async () => {
      // --- Arrange ---
      // Standard setup applies

      // --- Act ---
      const response = await request(app).get('/user/settings');

      // --- Assert ---
      expect(response.status).toBe(200);
      expect(response.body.view).toBe('settings');
      expect(response.body.locals.user.id).toBe(10);
    });
  });
});
