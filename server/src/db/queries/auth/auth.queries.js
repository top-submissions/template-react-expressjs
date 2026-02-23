import { prisma } from '../../../lib/prisma.js';

/**
 * Creates a new user record with assigned Role.
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const registerUser = async (userData) => {
  // Map admin boolean to Role enum if provided, otherwise default to USER
  const role = userData.role || (userData.admin ? 'ADMIN' : 'USER');

  return await prisma.user.create({
    data: {
      username: userData.username,
      password: userData.password,
      role: role,
    },
  });
};

/**
 * Finds a unique user record by its primary ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Updates the user's last login timestamp.
 * @param {number} userId
 * @returns {Promise<Object>}
 */
export const updateLastLogin = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
};
