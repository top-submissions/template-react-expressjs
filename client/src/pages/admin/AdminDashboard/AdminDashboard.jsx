import { Link } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './AdminDashboard.module.css';

/**
 * Administrative Hub Page.
 * - Provides entry points to various management tools.
 * - Displays contextual greetings for the logged-in Administrator.
 * - Conditionally highlights high-privilege actions (e.g., Super Admin tools).
 * @returns {JSX.Element}
 */
const AdminDashboard = () => {
  // Extract user info for the personalized header
  const { user } = useAuth();

  // Logic: Identify if the user is a SUPER_ADMIN to potentially show restricted cards
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Control Center</h1>
        <p className={styles.subtitle}>
          Welcome back, {user?.username}. Manage users, roles, and system
          configurations.
        </p>
      </header>

      <div className={styles.grid}>
        {/* User Management Card: The primary tool for Admins */}
        <Link to="/admin-panel/users" className={styles.card}>
          <h2 className={styles.cardTitle}>User Management</h2>
          <p className={styles.cardDescription}>
            View registered users, promote members to admin roles, or manage
            account status.
          </p>
        </Link>

        {/* Audit Logs Card: Example of a standard Admin tool */}
        <Link to="/admin-panel/logs" className={styles.card}>
          <h2 className={styles.cardTitle}>System Logs</h2>
          <p className={styles.cardDescription}>
            Monitor application activity, security events, and server-side
            errors.
          </p>
        </Link>

        {/* High-Level Settings: Use 'criticalCard' style if role is SUPER_ADMIN */}
        <Link
          to="/admin-panel/settings"
          className={`${styles.card} ${isSuperAdmin ? styles.criticalCard : ''}`}
        >
          <h2 className={styles.cardTitle}>Global Settings</h2>
          <p className={styles.cardDescription}>
            Configure environment variables and core platform behavior.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
