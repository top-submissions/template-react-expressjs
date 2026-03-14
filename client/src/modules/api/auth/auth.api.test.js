import { describe, it, expect } from 'vitest';
import { authApi } from './auth.api';

describe('authApi', () => {
  it('login sends a POST request with credentials included', async () => {
    // --- Arrange ---
    const credentials = { username: 'test', password: 'password' };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' }),
    });

    // --- Act ---
    await authApi.login(credentials);

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/log-in'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credentials),
      })
    );
  });
});
