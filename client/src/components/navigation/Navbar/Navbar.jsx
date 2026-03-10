import { Link } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './Navbar.module.css';

/**
 * Global navigation component.
 * - Manages branding and primary navigation links.
 * - Dynamic "Home" link points to specific dashboards based on user role.
 * - Displays session info (username/role) and handle logout.
 * @returns {JSX.Element}
 */
const Navbar = () => {
  const { user, logout } = useAuth();

  // check if current user has administrative clearance
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // determine the dashboard destination based on role
  const homePath = isAdmin ? '/admin-dashboard' : '/dashboard';

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">CapstoneApp</Link>
      </div>

      <div className={styles.navLinks}>
        {/* render dynamic home link if user is logged in */}
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
