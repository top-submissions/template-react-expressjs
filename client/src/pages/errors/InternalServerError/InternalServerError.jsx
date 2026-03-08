import { useRouteError } from 'react-router';
import styles from './InternalServerError.module.css';

/**
 * Global Error Boundary page for the application.
 * - Catches uncaught JavaScript exceptions and 500 server responses.
 * - Prevents application "white screens" by providing a fallback UI.
 * @returns {JSX.Element}
 */
const InternalServerError = () => {
  const error = useRouteError();

  // Log error for developers in non-production environments
  console.error(error);

  return (
    <main className={`${styles.container} flex-center`}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>500</h1>
        <h2>Something went wrong</h2>
        <p className={styles.message}>
          An unexpected error occurred. We've been notified and are working to
          fix it.
        </p>

        {/* Reset button to clear state and try again */}
        <button
          onClick={() => window.location.assign('/')}
          className={styles.homeLink}
        >
          Try Refreshing
        </button>
      </div>
    </main>
  );
};

export default InternalServerError;
