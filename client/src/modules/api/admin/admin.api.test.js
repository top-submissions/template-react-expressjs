import { describe, it, expect } from 'vitest';
import { adminApi } from './admin.api';

describe('adminApi', () => {
  it('getAllUsers calls the correct endpoint with GET', async () => {
    // --- Arrange ---
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // --- Act ---
    await adminApi.getAllUsers();

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/admin/users'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      })
    );
  });

  it('promoteUser injects the userId into the URL', async () => {
    // --- Arrange ---
    const testId = 123;
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // --- Act ---
    await adminApi.promoteUser(testId);

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/promote/${testId}`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });

  it('demoteUser injects the userId into the URL', async () => {
    // --- Arrange ---
    const testId = 456;
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    // --- Act ---
    await adminApi.demoteUser(testId);

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/demote/${testId}`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
  });
});
