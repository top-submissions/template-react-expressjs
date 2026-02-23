import { prisma } from '../../../lib/prisma.js';

/**
 * Fetches all users for management UI.
 * @returns {Promise<Array>}
 */
export const getAllUsersForManagement = async () => {
  // Query specifically for ID, username, role, and creation date
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' },
  });
};

/**
 * Promotes a specific user to ADMIN role.
 * @param {number} userId
 * @returns {Promise<Object>}
 */
export const promoteUserToAdmin = async (userId) => {
  // Set the enum value to ADMIN
  return await prisma.user.update({
    where: { id: userId },
    data: { role: 'ADMIN' },
  });
};
