/**
 * Custom error class for handling 404 Not Found scenarios.
 * * Sets a default HTTP status code of 404.
 * * Overrides the base Error name to 'NotFoundError'.
 * @param {string} message - Human-readable description of the error.
 * @extends Error
 */
export default class CustomNotFoundError extends Error {
  constructor(message) {
    // Initialize base Error class
    super(message);

    // Define custom error properties
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}
