import { vi } from 'vitest';

/**
 * Global test environment configuration.
 * - Centralizes mock definitions for external services.
 * - Handles teardown and cleanup between test suites.
 * - Useful for setting up standard request/response mocks.
 * @returns {Object} A collection of common mock generators.
 */
export const setupTestEnv = () => {
  // Define standard Express mock objects
  const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.redirect = vi.fn().mockReturnValue(res);
    res.locals = {};
    return res;
  };

  const mockNext = vi.fn();

  return { mockRes, mockNext };
};

/**
 * Resets all global mocks to a clean state.
 * - Clears Vitest call history and implementation overrides.
 * - Prevents test pollution across different files.
 * @returns {void}
 */
export const teardownTestEnv = () => {
  vi.clearAllMocks();
  vi.resetModules();
};
