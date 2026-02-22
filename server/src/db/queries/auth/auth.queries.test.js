import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as authQueries from './auth.queries.js';
import { prisma } from '../../../lib/prisma.js';

// Setup Vitest mocks for Prisma client operations
vi.mock('../../../lib/prisma.js', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('authQueries module', () => {
  // Reset mock state between tests
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser()', () => {
    it('should create a user with mapped data and default admin to false', async () => {
      // --- Arrange ---
      // Define input without admin flag and expected mock return
      const input = { username: 'testuser', password: 'hashed_password' };
      const mockUser = { id: 1, ...input, admin: false };
      prisma.user.create.mockResolvedValue(mockUser);

      // --- Act ---
      const result = await authQueries.registerUser(input);

      // --- Assert ---
      // Verify prisma mapping and explicit admin default
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          password: 'hashed_password',
          admin: false,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should respect the admin flag when provided in userData', async () => {
      // --- Arrange ---
      // Define input with explicit admin status
      const input = { username: 'admin', password: 'pw', admin: true };
      prisma.user.create.mockResolvedValue({ id: 2, ...input });

      // --- Act ---
      await authQueries.registerUser(input);

      // --- Assert ---
      // Check that admin: true was passed to prisma
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ admin: true }),
      });
    });
  });

  describe('getUserById()', () => {
    it('should fetch a unique user by primary key', async () => {
      // --- Arrange ---
      // Define target ID and mock user
      const userId = 101;
      prisma.user.findUnique.mockResolvedValue({ id: userId, username: 'dev' });

      // --- Act ---
      const result = await authQueries.getUserById(userId);

      // --- Assert ---
      // Verify correct 'where' clause usage
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result.id).toBe(userId);
    });
  });

  describe('updateLastLogin()', () => {
    it('should update the lastLogin field with a current timestamp', async () => {
      // --- Arrange ---
      // Define user ID and mock update response
      const userId = 5;
      prisma.user.update.mockResolvedValue({
        id: userId,
        lastLogin: new Date(),
      });

      // --- Act ---
      await authQueries.updateLastLogin(userId);

      // --- Assert ---
      // Verify update payload contains any valid Date object
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { lastLogin: expect.any(Date) },
      });
    });
  });
});
