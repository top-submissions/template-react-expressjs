/**
 * Renders the primary user dashboard.
 * * Injects the current authenticated user data into the view.
 * * Access restricted via JWT authentication middleware.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const dashboardGet = (req, res) => {
  // Render dashboard with user context
  res.render('dashboard', { currentUser: req.user });
};

/**
 * Renders the account upgrade page.
 * * Provides information on gaining administrative privileges.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const upgradeGet = (req, res) => {
  res.render('upgrade-account');
};

/**
 * Renders the user settings page.
 * * Allows users to view or modify their account details.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
export const settingsGet = (req, res) => {
  // Fetch profile data from request user
  res.render('settings', { user: req.user });
};
