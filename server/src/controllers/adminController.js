import * as adminQueries from '../db/queries/admin/admin.js';

/**
 * Renders the primary administrator dashboard.
 * * Passes the current authenticated user object to the view.
 * * Used for high-level admin overviews.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const dashboardGet = (req, res) => {
  res.render('admin/dashboard', { user: req.user });
};

/**
 * Fetches the user list and renders the management page.
 * * Queries the database for all registered users.
 * * Handles asynchronous data retrieval and error propagation.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const usersGet = async (req, res, next) => {
  try {
    // Get users from database
    const users = await adminQueries.getAllUsersForManagement();

    // Render user management list
    res.render('admin/users', { users });
  } catch (error) {
    next(error);
  }
};

/**
 * Promotes a specific user to administrator status.
 * * Extracts user ID from route parameters.
 * * Updates the user's role and redirects back to the management list.
 * @param {Object} req - Express request object with ID parameter.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
export const promotePost = async (req, res, next) => {
  try {
    // Convert string ID to number
    const userId = parseInt(req.params.id);

    // Update user role in DB
    await adminQueries.promoteUserToAdmin(userId);

    // Refresh the user list
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
};
