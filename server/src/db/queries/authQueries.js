/**
 * Authentication Database Queries
 * Handles specialized lookups and creation for auth processes.
 * @module db/queries/authQueries
 */
import { prisma } from '../../lib/prisma.js';

/**
 * Creates a new user record.
 * @param {Object} userData - Contains username, hashedPassword, and admin status.
 * @returns {Promise<Object>}
 */
export const registerUser = async (userData) => {
  return await prisma.user.create({
    data: {
      username: userData.username,
      password: userData.password,
      admin: userData.admin || false,
    },
  });
};

/**
 * Finds a user by ID for session deserialization.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
