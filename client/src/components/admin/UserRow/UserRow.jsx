import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './UserRow.module.css';

/**
 * Atomic table row for user management.
 * - Displays identity, role, and metadata.
 * - Provides conditional administrative actions.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The target user object for this specific row.
 * @returns {JSX.Element} The rendered table row.
 */
const UserRow = ({ user: targetUser }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check If Current User Is Super Admin And Target Is A Standard User
  const canPromote =
    currentUser?.role === 'SUPER_ADMIN' && targetUser.role === 'USER';

  // Check If Current User Is Super Admin And Target Is An Admin
  const canDemote =
    currentUser?.role === 'SUPER_ADMIN' && targetUser.role === 'ADMIN';

  /**
   * Toggles the visibility of the actions dropdown menu.
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /**
   * Navigates to the detailed profile view of the target user.
   */
  const handleViewProfile = () => {
    navigate(`/profile/${targetUser.id}`);
    setIsMenuOpen(false);
  };

  /**
   * Triggers the promotion workflow via backend API.
   * - Sends POST request to the promotion endpoint.
   * - Refreshes the page on success to sync global state.
   * @returns {Promise<void>}
   */
  const handlePromote = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute Promotion Request With Credentials To Send Session Cookie
      const response = await fetch(
        `${baseUrl}/api/admin/users/${targetUser.id}/promote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      // Refresh Data On Success
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

  /**
   * Reverts an administrative user back to standard status.
   * - Sends POST request to the demotion endpoint.
   * - Refreshes the page on success to sync global state.
   * @returns {Promise<void>}
   */
  const handleDemote = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute Demotion Request Targeting Specific Target User
      const response = await fetch(
        `${baseUrl}/api/admin/users/${targetUser.id}/demote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      // Refresh Data On Success
      if (response.ok) {
        setIsMenuOpen(false);
        window.location.reload();
      } else {
        const data = await response.json();
        console.error('Demotion denied:', data.message);
      }
    } catch (err) {
      console.error('Network error during demotion:', err);
    }
  };

  return (
    <tr className={styles.row}>
      <td className={styles.cell}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {targetUser.username.charAt(0).toUpperCase()}
          </div>
          <span className={styles.username}>{targetUser.username}</span>
        </div>
      </td>
      <td className={styles.cell}>
        <span className={styles.roleBadge}>{targetUser.role}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.date}>
          {new Date(targetUser.createdAt).toLocaleDateString()}
        </span>
      </td>
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

            {canDemote && (
              <button
                className={`${styles.dropdownItem} ${styles.demoteAction}`}
                onClick={handleDemote}
              >
                Demote to User
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserRow;
