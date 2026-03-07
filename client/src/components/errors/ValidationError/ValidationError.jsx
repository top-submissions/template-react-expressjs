import styles from './ValidationError.module.css';

/**
 * Inline component for displaying validation failure details.
 * - Specifically handles the array of field errors from the server.
 * - Used within forms (Signup/Login) for context-aware feedback.
 * @param {Object} props
 * @param {string} props.message - General error summary message.
 * @param {Array} props.errors - Optional list of specific field error objects.
 * @returns {JSX.Element | null}
 */
const ValidationError = ({ message, errors = [] }) => {
  // Return null if no error message is provided to avoid empty renders
  if (!message) return null;

  return (
    <div className={styles.container} role="alert">
      <p className={styles.summary}>{message}</p>

      {/* Map through specific field errors if provided by the server */}
      {errors.length > 0 && (
        <ul className={styles.errorList}>
          {errors.map((err, index) => (
            <li key={index} className={styles.errorItem}>
              {err.msg || err.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ValidationError;
