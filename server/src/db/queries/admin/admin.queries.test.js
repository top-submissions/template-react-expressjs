import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as adminQueries from './admin.queries.js';
import { prisma } from '../../../lib/prisma.js';

// Isolate DB calls by mocking the Prisma client
vi.mock('../../../lib/prisma.js', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('adminQueries module', () => {
  // Clear mock history before each execution
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllUsersForManagement()', () => {
    it('should query specific user fields sorted by id', async () => {
      // --- Arrange ---
      // Define a standard user list for the UI
      const mockUsers = [
        { id: 1, username: 'user1', admin: false, createdAt: new Date() },
      ];
      // Inject the mock data into the findMany call
      prisma.user.findMany.mockResolvedValue(mockUsers);

      // --- Act ---
      const result = await adminQueries.getAllUsersForManagement();

      // --- Assert ---
      // Verify specific field selection and ascending sort order
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          username: true,
          admin: true,
          createdAt: true,
        },
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('promoteUserToAdmin()', () => {
    it('should update the admin flag for a specific user id', async () => {
      // --- Arrange ---
      const userId = 42;
      const mockUpdatedUser = { id: 42, admin: true };
      // Inject the successful update response
      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      // --- Act ---
      const result = await adminQueries.promoteUserToAdmin(userId);

      // --- Assert ---
      // Verify the query targets the correct ID and sets admin to true
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { admin: true },
      });
      expect(result.admin).toBe(true);
    });
  });
});
