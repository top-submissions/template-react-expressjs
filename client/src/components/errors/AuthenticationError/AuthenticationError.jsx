import styles from './AuthenticationError.module.css';

/**
 * Inline component for displaying authentication failure feedback.
 * - Handles 401 and 403 responses from the backend.
 * - Displays a text-based "Error:" prefix
 * @param {Object} props
 * @param {string} props.message - The specific error string from the server.
 * @returns {JSX.Element | null}
 */
const AuthenticationError = ({ message }) => {
  // Render nothing if no message is present
  if (!message) return null;

  return (
    <div className={styles.container} role="alert" aria-live="assertive">
      <span className={styles.label}>Error:</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default AuthenticationError;
