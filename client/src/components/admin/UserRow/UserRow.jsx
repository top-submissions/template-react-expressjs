import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './UserRow.module.css';

/**
 * Atomic table row for user management.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The user object for the current row.
 * @returns {JSX.Element}
 */
const UserRow = ({ user: targetUser }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use explicit naming to prevent auth state confusion
  const canPromote =
    currentUser?.role === 'SUPER_ADMIN' && targetUser.role === 'USER';

  const canDemote =
    currentUser?.role === 'SUPER_ADMIN' && targetUser.role === 'ADMIN';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleViewProfile = () => {
    navigate(`/profile/${targetUser.id}`);
    setIsMenuOpen(false);
  };

  /**
   * Triggers the promotion workflow.
   */
  const handlePromote = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute request targeting specific targetUser ID
      const response = await fetch(
        `${baseUrl}/api/admin/users/${targetUser.id}/promote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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

  /**
   * Reverts an administrative user back to standard status.
   */
  const handleDemote = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute request targeting specific targetUser ID
      const response = await fetch(
        `${baseUrl}/api/admin/users/${targetUser.id}/demote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

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
