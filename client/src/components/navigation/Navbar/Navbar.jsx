import { useState } from 'react';
import { Link } from 'react-router';
import { Home, User, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import { useTheme } from '../../../providers/ThemeProvider/ThemeProvider';
import styles from './Navbar.module.css';

/**
 * Global navigation component.
 * - Manages branding and primary navigation links.
 * - Dynamic "Home" link points to specific dashboards based on user role.
 * - Displays session info and handles secure logout with confirmation.
 * - Integrated theme switching and role-based navigation.
 * - Uses Lucide icons for visual actions and indicators.
 * @returns {JSX.Element} The rendered navigation bar.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  // Manage logout confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);

  // Define navigation logic based on user authorization
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const homePath = isAdmin ? '/admin-dashboard' : '/dashboard';

  /**
   * Finalizes the logout process.
   * - Clears session data via AuthProvider.
   * - Triggers success notification.
   * - Closes the confirmation modal.
   */
  const handleConfirmLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    setShowConfirm(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link to={homePath} className={styles.navItem} aria-label="Home">
            <Home size={20} />
          </Link>
          {isAdmin && (
            <Link
              to="/profile"
              className={styles.navItem}
              aria-label="View Profile"
            >
              <User size={20} />
            </Link>
          )}
          <Link to="/settings" title="Account Settings">
            <Settings size={20} />
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {user && (
          <div className={styles.userSection}>
            <div className={styles.info}>
              <span className={styles.username}>{user.username}</span>
              <span className={styles.roleLabel}>{user.role}</span>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className={styles.logoutBtn}
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </nav>

      {showConfirm && (
        <div
          className={`${styles.modalOverlay} animate-fade-in`}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className={`${styles.modalContent} animate-slide-up`}
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
