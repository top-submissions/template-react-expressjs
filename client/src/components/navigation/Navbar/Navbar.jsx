import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import styles from './Navbar.module.css';

/**
 * Global navigation component.
 * - Manages branding and primary navigation links.
 * - Dynamic "Home" link points to specific dashboards based on user role.
 * - Displays session info and handles secure logout with confirmation.
 * @returns {JSX.Element} The rendered navigation bar.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  // Track visibility of the logout confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const homePath = isAdmin ? '/admin-dashboard' : '/dashboard';

  /**
   * Finalizes the logout process.
   * - Calls AuthProvider logout (clears cookies and state).
   * - Notifies the user of success.
   */
  const handleConfirmLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    setShowConfirm(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">CapstoneApp</Link>
        </div>

        <div className={styles.navLinks}>
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
            {/* Open confirmation modal instead of logging out immediately */}
            <button
              onClick={() => setShowConfirm(true)}
              className={styles.logoutBtn}
              aria-label="Log out"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Animated Logout Confirmation Modal */}
      {showConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your session?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
