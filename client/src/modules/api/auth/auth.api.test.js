import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi } from './auth.api';

describe('authApi', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      })
    );
  });

  it('login sends a POST request with credentials included', async () => {
    const credentials = { username: 'test', password: 'password' };

    // --- Act ---
    await authApi.login(credentials);

    // --- Assert ---
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/log-in'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credentials),
      })
    );
  });
});
