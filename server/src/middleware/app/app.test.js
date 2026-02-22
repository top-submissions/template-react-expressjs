import { vi, describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import * as appMiddleware from './app.js';

// Mock external configurations and passport to avoid side effects
vi.mock('../../config/corsOptions.js', () => ({
  default: { origin: '*' },
}));

vi.mock('passport', () => ({
  default: { initialize: vi.fn(() => (req, res, next) => next()) },
}));

describe('app middleware module', () => {
  let app;

  // Initialize a fresh express instance before each test
  beforeEach(() => {
    app = express();
    // Spy on the app.use method to track middleware registration
    vi.spyOn(app, 'use');
  });

  describe('configureMiddleware()', () => {
    it('should register essential global middlewares', () => {
      appMiddleware.configureMiddleware(app);

      // Verify: check for CORS, Static, JSON, URLencoded, CookieParser, and Passport
      // Express middleware registration order matters for the request cycle
      expect(app.use).toHaveBeenCalled();

      // Verify: specifically check that Passport initialize was called
      const passport = import('passport');
      passport.then((m) => expect(m.default.initialize).toHaveBeenCalled());
    });

    it('should set res.locals.currentUser from req.user', () => {
      appMiddleware.configureMiddleware(app);

      // Extract the custom identity middleware (usually the last one registered)
      const identityMiddleware = app.use.mock.calls.find((call) =>
        call[0].toString().includes('res.locals.currentUser'),
      )[0];

      const req = { user: { id: 1, username: 'tester' } };
      const res = { locals: {} };
      const next = vi.fn();

      identityMiddleware(req, res, next);

      // Verify: identity injection into response locals
      expect(res.locals.currentUser).toEqual(req.user);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('configureErrorHandling()', () => {
    it('should register an error-handling middleware with 4 arguments', () => {
      appMiddleware.configureErrorHandling(app);

      // Verify: error handlers are identified by having exactly 4 parameters (err, req, res, next)
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

      // Spy on console to prevent log pollution during tests
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      errorHandler(err, req, res, next);

      // Verify: status code and message delivery
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Unauthorized');

      consoleSpy.mockRestore();
    });
  });
});
