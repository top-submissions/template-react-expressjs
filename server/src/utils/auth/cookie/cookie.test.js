import { describe, it, expect, vi } from 'vitest';
import { setAuthCookie, clearAuthCookie, cookieOptions } from './cookie.js';

describe('Auth Cookie Utility', () => {
  // Create a mock Express response object
  const mockResponse = () => {
    const res = {};
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    return res;
  };

  it('setAuthCookie() should call res.cookie with correct parameters', () => {
    const res = mockResponse();
    const testToken = 'mock-jwt-token';

    setAuthCookie(res, testToken);

    // Verify token and options were passed correctly
    expect(res.cookie).toHaveBeenCalledWith('token', testToken, cookieOptions);
  });

  it('clearAuthCookie() should call res.clearCookie with matching options', () => {
    const res = mockResponse();

    clearAuthCookie(res);

    // Verify clearCookie was called with same security options but 0 maxAge
    expect(res.clearCookie).toHaveBeenCalledWith('token', {
      ...cookieOptions,
      maxAge: 0,
    });
  });
});
