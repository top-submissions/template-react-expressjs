import { useRouteError, Link } from 'react-router';
import styles from './NotFoundError.module.css';

/**
 * Fallback page for 404 Not Found scenarios.
 * - Automatically triggered by React Router's errorElement.
 * - Extracts error details from the routing context.
 * @returns {JSX.Element}
 */
const NotFoundError = () => {
  const error = useRouteError();

  // Extract message if it exists, otherwise provide a fallback
  const errorMessage =
    error?.statusText ||
    error?.message ||
    "We couldn't find the page you're looking for.";

  return (
    <main className={`${styles.container} flex-center animate-fade-in`}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>{errorMessage}</p>
        <Link to="/" className={styles.homeLink}>
          Return to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundError;
