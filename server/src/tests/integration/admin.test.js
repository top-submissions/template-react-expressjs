import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import adminRouter from '../../routes/admin.routes.js';
import * as adminQueries from '../../db/queries/admin/admin.queries.js';

// Mock the query layer to avoid actual DB side effects
vi.mock('../../db/queries/admin/admin.queries.js', () => ({
  getAllUsersForManagement: vi.fn(),
  promoteUserToAdmin: vi.fn(),
}));

// Mock auth middleware to simulate an admin session
vi.mock('../../middleware/auth/auth.middleware.js', () => ({
  isAdmin: vi.fn((req, res, next) => {
    req.user = { id: 1, username: 'admin', admin: true };
    next();
  }),
}));

/**
 * Integration Tests for Admin Routes.
 * - Validates the flow from Router to Controller to Query Mock.
 * - Ensures correct view rendering and redirection logic.
 * - Tests HTTP status codes and parameter handling.
 */
describe('Admin Integration Tests', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();

    // Initialize express app with router under test
    app = express();
    app.set('view engine', 'ejs'); // Mock view engine setup
    app.use('/admin', adminRouter);
  });

  describe('GET /admin/users', () => {
    it('should fetch users and render the management view', async () => {
      // --- Arrange ---
      const mockUsers = [
        { id: 1, username: 'test1', admin: false },
        { id: 2, username: 'test2', admin: true },
      ];
      adminQueries.getAllUsersForManagement.mockResolvedValue(mockUsers);

      // --- Act ---
      const response = await request(app).get('/admin/users');

      // --- Assert ---
      expect(response.status).toBe(200);
      expect(adminQueries.getAllUsersForManagement).toHaveBeenCalled();
    });
  });

  describe('POST /admin/users/:id/promote', () => {
    it('should promote user and redirect to users list', async () => {
      // --- Arrange ---
      const targetUserId = 5;
      adminQueries.promoteUserToAdmin.mockResolvedValue({
        id: targetUserId,
        admin: true,
      });

      // --- Act ---
      const response = await request(app).post(
        `/admin/users/${targetUserId}/promote`,
      );

      // --- Assert ---
      // Check for 302 redirect status
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/admin/users');

      // Ensure the query received the parsed integer ID
      expect(adminQueries.promoteUserToAdmin).toHaveBeenCalledWith(
        targetUserId,
      );
    });

    it('should propagate errors to the next middleware', async () => {
      // --- Arrange ---
      adminQueries.promoteUserToAdmin.mockRejectedValue(new Error('DB Error'));

      // Add a dummy error handler to catch the next(error) call
      app.use((err, req, res, next) => res.status(500).send(err.message));

      // --- Act ---
      const response = await request(app).post('/admin/users/1/promote');

      // --- Assert ---
      expect(response.status).toBe(500);
      expect(response.text).toBe('DB Error');
    });
  });
});
