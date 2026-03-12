import { Link } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './Navbar.module.css';

/**
 * Global navigation component.
 * - Manages branding and primary navigation links.
 * - Dynamic "Home" link points to specific dashboards based on user role.
 * - Displays session info (username/role) and handle logout.
 * @returns {JSX.Element} The rendered navigation bar.
 */
const Navbar = () => {
  const { user, logout } = useAuth();

  // Determine administrative status
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Define dashboard route based on user privileges
  const homePath = isAdmin ? '/admin-dashboard' : '/dashboard';

  /**
   * Orchestrates the logout workflow.
   * - Triggers asynchronous cookie clearing.
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    // Clear server and local session
    await logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">CapstoneApp</Link>
      </div>

      <div className={styles.navLinks}>
        {/* Render home link conditionally for authenticated users */}
        {user && (
          <Link to={homePath} className={styles.homeLink}>
            Home
          </Link>
        )}

        <Link to="/profile" title="View Profile">
          Profile
        </Link>

        <Link to="/settings" title="Account Settings">
          Settings
        </Link>
      </div>

      {user && (
        <div className={styles.userSection}>
          <div className={styles.info}>
            <span className={styles.username}>{user.username}</span>
            <span className={styles.roleLabel}>{user.role}</span>
          </div>
          <button
            onClick={handleLogout}
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
