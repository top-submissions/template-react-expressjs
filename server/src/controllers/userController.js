/**
 * User Controller
 * * Handles non-admin authenticated routes.
 * @module controllers/userController
 */

/**
 * Renders the user dashboard.
 */
export const dashboardGet = (req, res) =>
  res.render('dashboard', { user: req.user });

/**
 * Renders the account upgrade page.
 */
export const upgradeGet = (req, res) => res.render('upgrade-account');

/**
 * Renders the settings page.
 */
export const settingsGet = (req, res) =>
  res.render('settings', { user: req.user });
