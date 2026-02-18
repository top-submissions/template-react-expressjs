/**
 * Admin Database Queries
 * Abstraction for administrative database operations.
 * @module db/queries/adminQueries
 */
import { prisma } from '../../lib/prisma.js';

/**
 * Fetches all users from the database for the management table.
 * Includes ID, username, admin status, and creation date.
 * @returns {Promise<Array>}
 */
export const getAllUsersForManagement = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      admin: true,
      createdAt: true,
    },
    orderBy: { id: 'asc' },
  });
};

/**
 * Promotes a specific user to admin status.
 * @param {number} userId - The ID of the user to promote.
 * @returns {Promise<Object>}
 */
export const promoteUserToAdmin = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { admin: true },
  });
};
