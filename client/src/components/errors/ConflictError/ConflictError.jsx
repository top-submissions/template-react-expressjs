import styles from './ConflictError.module.css';

/**
 * Inline component for displaying resource conflict feedback.
 * - Handles 409 responses from the backend (e.g., duplicate username).
 * - Displays using the standard red error palette.
 * @param {Object} props
 * @param {string} props.message - The conflict message string from the server.
 * @returns {JSX.Element | null}
 */
const ConflictError = ({ message }) => {
  // Guard clause for empty messages
  if (!message) return null;

  return (
    <div className={styles.container} role="alert" aria-live="assertive">
      <span className={styles.label}>Error:</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default ConflictError;
