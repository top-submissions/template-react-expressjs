import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminApi } from './admin.api';

describe('adminApi', () => {
  beforeEach(() => {
    // Standard mock for a successful fetch response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  it('getAllUsers calls the correct endpoint with GET', async () => {
    await adminApi.getAllUsers();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/users'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('promoteUser injects the userId into the URL', async () => {
    const testId = 123;
    await adminApi.promoteUser(testId);

    // Verify ID placement in path
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/promote/${testId}`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });

  it('demoteUser injects the userId into the URL', async () => {
    const testId = 456;
    await adminApi.demoteUser(testId);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/demote/${testId}`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });
});
