import { prisma } from '../../lib/prisma.js';

/**
 * Fetches all users from the database for the management table.
 * * Retrieves essential profile fields: id, username, admin status, and creation date.
 * * Results are sorted by ID in ascending order for consistent list rendering.
 * @returns {Promise<Array>} List of user objects tailored for management UI.
 */
export const getAllUsersForManagement = async () => {
  // Query users with specific field selection
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
 * * Updates the 'admin' boolean flag to true for the specified record.
 * @param {number} userId - The unique database ID of the user to update.
 * @returns {Promise<Object>} The updated user record.
 */
export const promoteUserToAdmin = async (userId) => {
  // Update admin flag for targeted user ID
  return await prisma.user.update({
    where: { id: userId },
    data: { admin: true },
  });
};
