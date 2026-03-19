import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical, UserCog, ShieldAlert } from 'lucide-react';
import styles from './UserRowActions.module.css';

/**
 * Dropdown actions menu for a user table row.
 * - Renders a trigger button and contextual action items.
 * - Closes on outside click via menuRef.
 * - Permission flags are computed by the parent UserRow.
 * @param {Object} props
 * @param {Object} props.targetUser - The user this row represents.
 * @param {boolean} props.canPromote - Whether the promote action should be shown.
 * @param {boolean} props.canDemote - Whether the demote action should be shown.
 * @param {function} props.onPromote - Called when promote is clicked.
 * @param {function} props.onDemote - Called when demote is clicked.
 * @returns {JSX.Element}
 */
const UserRowActions = ({
  targetUser,
  canPromote,
  canDemote,
  onPromote,
  onDemote,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
   * Navigates to the detailed profile view.
   */
  const handleViewProfile = () => {
    navigate(`/profile/${targetUser.id}`);
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.actionsWrapper} ref={menuRef}>
      <button
        className={`${styles.menuTrigger} flex-center`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Open actions menu"
      >
        <MoreVertical size={18} />
      </button>

      {isMenuOpen && (
        <div className={`${styles.dropdown} animate-slide-up`}>
          <button className={styles.dropdownItem} onClick={handleViewProfile}>
            View Profile
          </button>

          {canPromote && (
            <button
              className={`${styles.dropdownItem} ${styles.promoteAction} flex-center`}
              onClick={() => {
                onPromote();
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
                onDemote();
                setIsMenuOpen(false);
              }}
            >
              <ShieldAlert size={14} />
              <span>Demote to User</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserRowActions;
