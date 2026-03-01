// server/src/utils/errors/AppError.js

/**
 * Base class for all operational errors.
 * * Captures stack traces automatically.
 * * Supports custom HTTP status codes.
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human readable error description
   * @param {number} statusCode - HTTP response code (e.g. 404, 400)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Distinguishes known app errors from system crashes

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Specific error for failed authentication or invalid tokens.
 * @extends AppError
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

/**
 * Specific error for resource-not-found scenarios.
 * @extends AppError
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}
