/**
 * Admin Controller
 * Handles logic for the administrative dashboard and user management.
 * @module controllers/adminController
 */
import * as adminQueries from '../db/queries/adminQueries.js';

/**
 * Renders the primary administrator dashboard.
 */
export const dashboardGet = (req, res) => {
  res.render('admin/dashboard', { user: req.user });
};

/**
 * Fetches the user list and renders the management page.
 */
export const usersGet = async (req, res, next) => {
  try {
    const users = await adminQueries.getAllUsersForManagement();
    res.render('admin/users', { users });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles the POST request to promote a user.
 */
export const promotePost = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    await adminQueries.promoteUserToAdmin(userId);
    res.redirect('/admin/users');
  } catch (error) {
    next(error);
  }
};
