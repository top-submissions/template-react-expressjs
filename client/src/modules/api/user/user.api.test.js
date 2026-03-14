import { describe, it, expect } from 'vitest';
import { userApi } from './user.api';

describe('userApi', () => {
  it('getMe requests the correct /me endpoint', async () => {
    // --- Arrange ---
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: 1 } }),
    });

    // --- Act ---
    await userApi.getMe();

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/me'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('getProfile requests the profile endpoint', async () => {
    // --- Arrange ---
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ profile: {} }),
    });

    // --- Act ---
    await userApi.getProfile();

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/profile'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getById appends the userId correctly', async () => {
    // --- Arrange ---
    const userId = 99;
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: 99 } }),
    });

    // --- Act ---
    await userApi.getById(userId);

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/user/${userId}`),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
