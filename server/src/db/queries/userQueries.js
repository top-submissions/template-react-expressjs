/**
 * User Database Queries
 * * Provides abstraction for Prisma operations on the User model.
 * @module db/queries/userQueries
 */
import { prisma } from '../../lib/prisma.js';

/**
 * Finds a single user by their username.
 * @param {string} username
 * @returns {Promise<Object|null>}
 */
export const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

/**
 * Creates a new user in the database.
 * @param {Object} userData - { username, password, admin }
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

/**
 * Retrieves all users from the database.
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { id: 'asc' },
  });
};
