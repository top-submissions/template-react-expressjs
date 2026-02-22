import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getAllUsersForManagement, promoteUserToAdmin } from './admin.js';
import { prisma } from '../../../lib/prisma.js';

// Setup Vitest to intercept prisma calls via the shared library path
vi.mock('../../../lib/prisma.js', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('adminQueries module', () => {
  // Reset mock state to ensure clean test runs
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllUsersForManagement()', () => {
    it('should query specific user fields sorted by id', async () => {
      // Setup: define mock users
      const mockUsers = [
        { id: 1, username: 'user1', admin: false, createdAt: new Date() },
      ];

      // Setup: instruct prisma mock to return data
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await getAllUsersForManagement();

      // Verify: check prisma selection and ordering logic
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          username: true,
          admin: true,
          createdAt: true,
        },
        orderBy: { id: 'asc' },
      });

      // Verify: return value matches mock
      expect(result).toEqual(mockUsers);
    });
  });

  describe('promoteUserToAdmin()', () => {
    it('should update the admin flag for a specific user id', async () => {
      // Setup: define input and response
      const userId = 42;
      const mockUpdatedUser = { id: 42, admin: true };

      // Setup: inject successful update response
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await promoteUserToAdmin(userId);

      // Verify: check update filter and data payload
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { admin: true },
      });

      // Verify: ensure returned record shows admin as true
      expect(result.admin).toBe(true);
    });
  });
});
