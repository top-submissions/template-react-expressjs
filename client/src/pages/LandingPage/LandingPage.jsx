import { Link } from 'react-router';
import styles from './LandingPage.module.css';

/**
 * Public landing page component.
 * - Serves as the entry point for unauthenticated users.
 * - Provides navigation links to login and signup flows.
 * @returns {JSX.Element} The rendered landing page.
 */
const LandingPage = () => {
  // Define page structure
  return (
    <div className={styles.container}>
      {/* Hero section */}
      <h1 className={styles.title}>Welcome to the App</h1>

      {/* Navigation prompt */}
      <p className={styles.description}>
        Please{' '}
        <Link to="/log-in" className={styles.link}>
          Log In
        </Link>{' '}
        or{' '}
        <Link to="/sign-up" className={styles.link}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LandingPage;
