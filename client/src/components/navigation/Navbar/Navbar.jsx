import { useState } from 'react';
import { Link } from 'react-router';
import { Home, User, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import { useTheme } from '../../../providers/ThemeProvider/ThemeProvider';
import ConfirmationModal from '../../feedback/modals/ConfirmationModal/ConfirmationModal';
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

  const [showConfirm, setShowConfirm] = useState(false);

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

      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowConfirm(false)}
        title="Confirm Logout"
        message="Are you sure you want to log out of your session?"
        confirmLabel="Logout"
      />
    </>
  );
};

export default Navbar;
