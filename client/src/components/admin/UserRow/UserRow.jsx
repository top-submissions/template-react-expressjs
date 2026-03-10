import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './UserRow.module.css';

/**
 * Atomic table row for user management.
 * - Displays user identity, role, and metadata.
 * - Implements an inline actions menu with relative positioning.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The user object for the current row.
 * @returns {JSX.Element}
 */
const UserRow = ({ user }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define authority to promote based on role hierarchy
  const canPromote =
    currentUser?.role === 'SUPER_ADMIN' ||
    (currentUser?.role === 'ADMIN' && user.role === 'USER');

  // Toggle the visibility of the actions dropdown
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Redirect to the detailed profile view
  const handleViewProfile = () => {
    navigate(`/profile/${user.id}`);
    setIsMenuOpen(false);
  };

  /**
   * Triggers the promotion workflow.
   * - Sends POST request to admin promotion endpoint.
   * - Reloads window on success to sync data.
   */
  /**
   * Triggers the promotion workflow.
   * - Includes credentials to ensure the session cookie is sent.
   */
  /**
   * Triggers the promotion workflow.
   * - Includes credentials to ensure the session cookie is sent.
   */
  const handlePromote = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute request with credentials to bypass 401 Unauthorized
      const response = await fetch(
        `${baseUrl}/api/admin/users/${user.id}/promote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Ensure session cookies are sent
        }
      );

      if (response.ok) {
        setIsMenuOpen(false);
        window.location.reload();
      } else {
        const data = await response.json();
        console.error('Promotion denied:', data.message);
      }
    } catch (err) {
      console.error('Network error during promotion:', err);
    }
  };

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className={styles.username}>{user.username}</span>
        </div>
      </td>
      <td className={styles.cell}>
        <span className={styles.roleBadge}>{user.role}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.date}>
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </td>
      {/* Corrected the template literal for styles.actionsArea */}
      <td className={`${styles.cell} ${styles.actionsArea}`}>
        <button
          className={styles.menuTrigger}
          onClick={toggleMenu}
          aria-label="Open actions menu"
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div className={styles.dropdown}>
            <button className={styles.dropdownItem} onClick={handleViewProfile}>
              View Profile
            </button>

            {canPromote && (
              <button
                className={`${styles.dropdownItem} ${styles.promoteAction}`}
                onClick={handlePromote}
              >
                Promote to Admin
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
