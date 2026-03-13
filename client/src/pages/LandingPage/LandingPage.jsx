import { Link, Navigate } from 'react-router';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import styles from './LandingPage.module.css';

/**
 * Public landing page component.
 * - Serves as the entry point for unauthenticated users.
 * - Redirects authenticated users to their respective dashboards.
 * @returns {JSX.Element} The rendered landing page.
 */
const LandingPage = () => {
  const { user } = useAuth();

  // Redirect authenticated users away from landing
  if (user) {
    const destination =
      user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard';
    return <Navigate to={destination} replace />;
  }

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
