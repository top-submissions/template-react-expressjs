import { describe, it, expect, vi, beforeEach } from 'vitest';
import { globalErrorHandler } from './error.middleware.js';
import { clearAuthCookie } from '../../utils/auth/cookie/cookie.js';

// Mock cookie utility to verify clearing behavior
vi.mock('../../utils/auth/cookie/cookie.js', () => ({
  clearAuthCookie: vi.fn(),
}));

/**
 * Unit tests for the Global Error Handling Middleware.
 * - Validates status code defaulting.
 * - Ensures JSON structure consistency.
 * - Verifies field-specific error propagation.
 */
describe('Global Error Handler Middleware', () => {
  let mockReq;
  let mockRes;
  let next;

  beforeEach(() => {
    // Initialize mock objects for Express request, response, and next function
    vi.clearAllMocks();
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it('should format a generic Error into a 500 JSON response', () => {
    // --- Arrange ---
    const genericError = new Error('Something went wrong');

    // --- Act ---
    globalErrorHandler(genericError, mockReq, mockRes, next);

    // --- Assert ---
    // Verify status defaults to 500 when no statusCode is present
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Something went wrong',
      errors: [],
    });
  });

  it('should use status and statusCode provided by AppError subclasses', () => {
    // --- Arrange ---
    const customError = {
      message: 'Resource not found',
      statusCode: 404,
      status: 'fail',
    };

    // --- Act ---
    globalErrorHandler(customError, mockReq, mockRes, next);

    // --- Assert ---
    // Verify the middleware respects custom status codes
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fail',
        message: 'Resource not found',
      })
    );
  });

  it('should clear auth cookie when a 401 error occurs', () => {
    // --- Arrange ---
    const authError = {
      message: 'Unauthorized access',
      statusCode: 401,
    };

    // --- Act ---
    globalErrorHandler(authError, mockReq, mockRes, next);

    // --- Assert ---
    // Ensure safety net clears cookie on auth failure
    expect(clearAuthCookie).toHaveBeenCalledWith(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it('should include validation error arrays in the response', () => {
    // --- Arrange ---
    const validationError = {
      message: 'Validation failed',
      statusCode: 400,
      errors: [{ msg: 'Invalid email' }, { msg: 'Password too short' }],
    };

    // --- Act ---
    globalErrorHandler(validationError, mockReq, mockRes, next);

    // --- Assert ---
    // Ensure the errors array is passed through for frontend consumption
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation failed',
      errors: [{ msg: 'Invalid email' }, { msg: 'Password too short' }],
    });
  });
});
