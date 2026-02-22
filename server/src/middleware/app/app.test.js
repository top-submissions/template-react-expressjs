import { vi, describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import * as appMiddleware from './app.js';

// Isolate app setup by mocking external dependencies
vi.mock('../../config/corsOptions.js', () => ({
  default: { origin: '*' },
}));

vi.mock('passport', () => ({
  default: { initialize: vi.fn(() => (req, res, next) => next()) },
}));

describe('app middleware module', () => {
  let app;

  beforeEach(() => {
    // --- Arrange ---
    // Create a fresh express instance and track its middleware registration
    app = express();
    vi.spyOn(app, 'use');
  });

  describe('configureMiddleware()', () => {
    it('should register essential global middlewares', () => {
      // --- Act ---
      appMiddleware.configureMiddleware(app);

      // --- Assert ---
      // Check that multiple middlewares were attached to the express stack
      expect(app.use).toHaveBeenCalled();

      // Verify Passport initialization specifically
      const passport = import('passport');
      passport.then((m) => expect(m.default.initialize).toHaveBeenCalled());
    });

    it('should set res.locals.currentUser from req.user', () => {
      // --- Arrange ---
      appMiddleware.configureMiddleware(app);

      // Retrieve the specific identity injection middleware from the app stack
      const identityMiddleware = app.use.mock.calls.find((call) =>
        call[0].toString().includes('res.locals.currentUser'),
      )[0];

      const req = { user: { id: 1, username: 'tester' } };
      const res = { locals: {} };
      const next = vi.fn();

      // --- Act ---
      identityMiddleware(req, res, next);

      // --- Assert ---
      // Verify that the user from req is correctly exposed to view locals
      expect(res.locals.currentUser).toEqual(req.user);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('configureErrorHandling()', () => {
    it('should register an error-handling middleware with 4 arguments', () => {
      // --- Arrange ---
      appMiddleware.configureErrorHandling(app);

      // Find the middleware that matches the (err, req, res, next) signature
      const errorHandler = app.use.mock.calls.find(
        (call) => call[0].length === 4,
      )[0];

      const err = { statusCode: 401, message: 'Unauthorized' };
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      // Prevent log pollution by mocking console.error
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // --- Act ---
      errorHandler(err, req, res, next);

      // --- Assert ---
      // Verify status code propagation and error response body
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Unauthorized');

      consoleSpy.mockRestore();
    });
  });
});
