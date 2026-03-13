// Define 30 days in milliseconds
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/**
 * Shared configuration for authentication cookies.
 * - httpOnly: Prevents client-side JS from accessing the token (XSS protection).
 * - secure: Ensures cookies are only sent over HTTPS in production.
 * - sameSite: Protects against CSRF attacks.
 */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: THIRTY_DAYS,
};

/**
 * Attaches a JWT token to the response as a secure cookie.
 * @param {Object} res - Express response object.
 * @param {string} token - The signed JWT string.
 */
export const setAuthCookie = (res, token) => {
  res.cookie('token', token, cookieOptions);
};

/**
 * Commands the browser to remove the authentication cookie.
 * - Uses the exact same options to ensure the browser identifies the correct cookie.
 * @param {Object} res - Express response object.
 */
export const clearAuthCookie = (res) => {
  // Overwriting maxAge to 0 forces immediate expiration
  res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
};
