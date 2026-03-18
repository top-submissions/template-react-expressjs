import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical, UserCog, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import { adminApi } from '../../../modules/api/admin/admin.api';
import ConfirmationModal from '../../feedback/modals/ConfirmationModal/ConfirmationModal';
import styles from './UserRow.module.css';

/**
 * Atomic table row for user management.
 * - Displays identity, role, and metadata.
 * - Provides conditional administrative actions via a dropdown menu.
 * - Uses ConfirmationModal for promote/demote role changes.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - The target user object for this specific row.
 * @param {function} props.onUpdate - Callback to refresh the user list after a role change.
 * @returns {JSX.Element} The rendered table row.
 */
const UserRow = ({ user: targetUser, onUpdate }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Track which action is pending confirmation: null | 'promote' | 'demote'
  const [pendingAction, setPendingAction] = useState(null);

  const canPromote =
    currentUser?.role === 'SUPER_ADMIN' && targetUser.role === 'USER';

  const canDemote =
    currentUser?.role === 'SUPER_ADMIN' && targetUser.role === 'ADMIN';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Toggles the visibility of the actions dropdown menu.
   */
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /**
   * Navigates to the detailed profile view.
   */
  const handleViewProfile = () => {
    navigate(`/profile/${targetUser.id}`);
    setIsMenuOpen(false);
  };

  /**
   * Executes the confirmed role change action via Admin API.
   * - Calls promote or demote based on pendingAction state.
   * - Triggers onUpdate callback to refresh the list in place.
   */
  const handleConfirmAction = async () => {
    const isPromote = pendingAction === 'promote';
    const apiCall = isPromote
      ? adminApi.promoteUser(targetUser.id)
      : adminApi.demoteUser(targetUser.id);
    const successMsg = isPromote
      ? `${targetUser.username} promoted to Admin`
      : `${targetUser.username} demoted to User`;
    const errorMsg = isPromote
      ? 'Failed to promote user'
      : 'Failed to demote user';

    setPendingAction(null);

    try {
      const response = await apiCall;

      if (response.ok) {
        showToast(successMsg, 'success');
        onUpdate();
      } else {
        showToast(errorMsg, 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const confirmModal = {
    promote: {
      title: 'Promote to Admin',
      message: `Are you sure you want to promote ${targetUser.username} to Admin?`,
      confirmLabel: 'Promote',
    },
    demote: {
      title: 'Demote to User',
      message: `Are you sure you want to demote ${targetUser.username} to User?`,
      confirmLabel: 'Demote',
    },
  };

  return (
    <>
      <tr className={styles.row}>
        <td className={styles.cell}>
          <div className={styles.userInfo}>
            <div className={`${styles.avatar} flex-center`}>
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
        <td className={`${styles.cell} ${styles.actionsArea}`} ref={menuRef}>
          <button
            className={`${styles.menuTrigger} flex-center`}
            onClick={toggleMenu}
            aria-label="Open actions menu"
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className={`${styles.dropdown} animate-slide-up`}>
              <button
                className={styles.dropdownItem}
                onClick={handleViewProfile}
              >
                View Profile
              </button>

              {canPromote && (
                <button
                  className={`${styles.dropdownItem} ${styles.promoteAction} flex-center`}
                  onClick={() => {
                    setPendingAction('promote');
                    setIsMenuOpen(false);
                  }}
                >
                  <UserCog size={14} />
                  <span>Promote to Admin</span>
                </button>
              )}

              {canDemote && (
                <button
                  className={`${styles.dropdownItem} ${styles.demoteAction} flex-center`}
                  onClick={() => {
                    setPendingAction('demote');
                    setIsMenuOpen(false);
                  }}
                >
                  <ShieldAlert size={14} />
                  <span>Demote to User</span>
                </button>
              )}
            </div>
          )}
        </td>
      </tr>

      {pendingAction && (
        <ConfirmationModal
          isOpen={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setPendingAction(null)}
          title={confirmModal[pendingAction].title}
          message={confirmModal[pendingAction].message}
          confirmLabel={confirmModal[pendingAction].confirmLabel}
        />
      )}
    </>
  );
};

export default UserRow;
