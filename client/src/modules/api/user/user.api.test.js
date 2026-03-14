import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userApi } from './user.api';

describe('userApi', () => {
  beforeEach(() => {
    // Mock global fetch for unit testing the API module
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { id: 1, username: 'tester' } }),
      })
    );
  });

  it('getMe requests the correct /me endpoint', async () => {
    await userApi.getMe();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/me'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('getProfile requests the profile endpoint', async () => {
    await userApi.getProfile();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/profile'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getById appends the userId correctly', async () => {
    const userId = 99;
    await userApi.getById(userId);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/user/${userId}`),
      expect.objectContaining({ method: 'GET' })
    );
  });
});
