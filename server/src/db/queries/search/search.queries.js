import { prisma } from '../../../lib/prisma.js';

/**
 * Searches users by username with optional role filter and dynamic sorting.
 * @param {Object} params
 * @param {string} [params.q=''] - Partial username to search for.
 * @param {string} [params.role] - Optional role filter (USER, ADMIN, SUPER_ADMIN).
 * @param {string} [params.sortBy='createdAt'] - Field to sort by.
 * @param {string} [params.sortDir='desc'] - Sort direction ('asc' or 'desc').
 * @returns {Promise<Array>}
 */
export const searchUsers = async ({
  q = '',
  role,
  sortBy = 'createdAt',
  sortDir = 'desc',
} = {}) => {
  // Whitelist valid sort fields to prevent injection
  const validSortFields = ['username', 'createdAt', 'lastLogin', 'role'];
  const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const safeSortDir = sortDir === 'asc' ? 'asc' : 'desc';

  return await prisma.user.findMany({
    where: {
      ...(q && { username: { contains: q, mode: 'insensitive' } }),
      ...(role && { role }),
    },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      lastLogin: true,
    },
    orderBy: { [safeSortBy]: safeSortDir },
  });
};
