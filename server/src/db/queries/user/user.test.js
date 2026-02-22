import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as userQueries from './user.js';
import { prisma } from '../../../lib/prisma.js';

// Isolate DB logic by mocking the Prisma client
vi.mock('../../../lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('userQueries module', () => {
  // Clear mock history before each test to prevent data leaks
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByUsername()', () => {
    it('should retrieve a user matching the provided username', async () => {
      // --- Arrange ---
      // Define target username and mock response
      const username = 'testuser';
      const mockUser = { id: 1, username };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      // --- Act ---
      const result = await userQueries.getUserByUsername(username);

      // --- Assert ---
      // Verify: Prisma called with correct unique filter
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser()', () => {
    it('should persist a new user record with provided data', async () => {
      // --- Arrange ---
      // Define input data and mock successful creation
      const userData = { username: 'newguy', password: 'hashed_password' };
      const mockCreated = { id: 2, ...userData };
      prisma.user.create.mockResolvedValue(mockCreated);

      // --- Act ---
      const result = await userQueries.createUser(userData);

      // --- Assert ---
      // Verify: Prisma called with the raw data object
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData,
      });
      expect(result).toEqual(mockCreated);
    });
  });

  describe('getAllUsers()', () => {
    it('should fetch all users sorted by ID in ascending order', async () => {
      // --- Arrange ---
      // Mock an array of user records
      const mockList = [
        { id: 1, username: 'a' },
        { id: 2, username: 'b' },
      ];
      prisma.user.findMany.mockResolvedValue(mockList);

      // --- Act ---
      const result = await userQueries.getAllUsers();

      // --- Assert ---
      // Verify: Correct ordering parameter used in query
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
      expect(result).toEqual(mockList);
    });
  });
});
