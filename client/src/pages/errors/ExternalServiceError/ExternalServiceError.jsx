import { useNavigate } from 'react-router';
import styles from './ExternalServiceError.module.css';

/**
 * Page component for handling external API and service failures.
 * - Triggered by ExternalServiceError (500/503) from the server.
 * - Specific to third-party integrations (Google, 2FA, etc.).
 * @returns {JSX.Element}
 */
const ExternalServiceError = () => {
  const navigate = useNavigate();

  // Define retry logic to attempt re-fetching or re-authenticating
  const handleRetry = () => {
    navigate(0); // Refresh current route
  };

  return (
    <main className={styles.container}>
      {/* Visual Indicator for External Connection Failure */}
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>🔌</span>
      </div>

      <h1 className={styles.title}>Service Interruption</h1>

      <p className={styles.message}>
        We're having trouble connecting to one of our external providers. This
        is usually temporary. Please try again in a few moments.
      </p>

      <div className={styles.actions}>
        <button onClick={handleRetry} className={styles.retryButton}>
          Try Again
        </button>

        <button onClick={() => navigate('/')} className={styles.homeButton}>
          Return Home
        </button>
      </div>
    </main>
  );
};

export default ExternalServiceError;
