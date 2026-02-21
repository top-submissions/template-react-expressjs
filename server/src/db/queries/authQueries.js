import { prisma } from '../../lib/prisma.js';

/**
 * Creates a new user record in the database.
 * * Maps user data to the Prisma model schema.
 * * Defaults administrative privileges to false if not specified.
 * @param {Object} userData - Object containing account details.
 * @param {string} userData.username - Unique identifier for the user.
 * @param {string} userData.password - Hashed password string.
 * @param {boolean} [userData.admin] - Optional flag for admin status.
 * @returns {Promise<Object>} The newly created user record.
 */
export const registerUser = async (userData) => {
  // Map provided data to user schema and save
  return await prisma.user.create({
    data: {
      username: userData.username,
      password: userData.password,
      admin: userData.admin || false,
    },
  });
};

/**
 * Finds a unique user record by its primary ID.
 * * Used primarily for JWT payload verification and authorization guards.
 * @param {number} id - The unique database ID of the user.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
export const getUserById = async (id) => {
  // Retrieve user by primary key
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Updates the user's last login timestamp.
 * * Sets the lastLogin field to the current system date/time.
 * @param {number} userId - The ID of the user currently logging in.
 * @returns {Promise<Object>} The updated user record.
 */
export const updateLastLogin = async (userId) => {
  // Update timestamp for the specific user record
  return await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  });
};
