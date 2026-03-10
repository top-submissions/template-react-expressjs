import { Link } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './Navbar.module.css';

/**
 * Global navigation component.
 * - Displays branding and core navigation links.
 * - Conditionally renders Administrative tools based on user role.
 * - Provides user session feedback (username/role) and logout trigger.
 * @returns {JSX.Element}
 */
const Navbar = () => {
  // Access session data and actions from the provider
  const { user, logout } = useAuth();

  // Logic: Check if the user has elevated privileges for the Admin Panel
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">CapstoneApp</Link>
      </div>

      <div className={styles.navLinks}>
        {/* Render standard navigation for all users */}
        <Link to="/profile" title="View Profile">
          Profile
        </Link>
        <Link to="/settings" title="Account Settings">
          Settings
        </Link>

        {/* Guarded UI: Only render if user role is ADMIN or SUPER_ADMIN */}
        {isAdmin && (
          <Link to="/admin-dashboard" className={styles.adminLink}>
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Session Section: Render user details if a session exists */}
      {user && (
        <div className={styles.userSection}>
          <div className={styles.info}>
            <span className={styles.username}>{user.username}</span>
            <span className={styles.roleLabel}>{user.role}</span>
          </div>
          <button
            onClick={logout}
            className={styles.logoutBtn}
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
