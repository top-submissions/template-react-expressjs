import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import styles from './UserRow.module.css';

/**
 * Atomic table row for user management.
 * - Displays user identity, role, and metadata.
 * - Implements an inline actions menu for profile viewing and role promotion.
 * - Enforces administrative hierarchy for sensitive actions.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The user object for the current row.
 * @returns {JSX.Element}
 */
const UserRow = ({ user }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine if current admin has authority to promote this specific user
  const canPromote =
    currentUser?.role === 'SUPER_ADMIN' ||
    (currentUser?.role === 'ADMIN' && user.role === 'USER');

  /**
   * Toggles the visibility of the actions dropdown.
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /**
   * Redirects to the detailed profile view for the row user.
   */
  const handleViewProfile = () => {
    navigate(`/profile/${user.id}`);
    setIsMenuOpen(false);
  };

  /**
   * Triggers the promotion workflow for the row user.
   */
  const handlePromote = () => {
    // Logic for PATCH /api/users/:id will be implemented in the integration step
    console.log(`Promoting user: ${user.username}`);
    setIsMenuOpen(false);
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
      <td className={`${styles.cell} styles.actionsArea`}>
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

            {/* Conditional action based on admin clearance */}
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
