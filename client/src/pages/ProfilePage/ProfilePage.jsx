import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import styles from './ProfilePage.module.css';

/**
 * User Profile Page.
 * - Displays account details for the current user or a targeted user (admin view).
 * - Handles role-based promotion logic.
 * - Manages data fetching for external profiles via URL parameters.
 * @returns {JSX.Element}
 */
const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  // State for the user being viewed
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads user data.
   * - If an ID is in the URL, fetches that specific user (Admin view).
   * - Otherwise, defaults to the current authenticated user's data.
   */
  useEffect(() => {
    const loadProfile = async () => {
      // If no ID is provided, we are viewing our own profile
      if (!id) {
        setProfileUser(currentUser);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setProfileUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [id, currentUser]);

  /**
   * Administrative action to upgrade a user's role.
   */
  const handlePromote = async () => {
    try {
      const response = await fetch(`/api/users/${profileUser.id}/promote`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Promotion failed');

      // Update local state to reflect the new role immediately
      setProfileUser({ ...profileUser, role: 'ADMIN' });
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading)
    return <div className={styles.loadingWrapper}>Loading profile...</div>;
  if (error) return <div className={styles.errorWrapper}>Error: {error}</div>;
  if (!profileUser) return null;

  // Logic: Can only promote if viewer is Admin/SuperAdmin and target is a regular User
  const showPromoteAction =
    (currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') &&
    profileUser.role === 'USER' &&
    currentUser.id !== profileUser.id;

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {profileUser.username?.charAt(0).toUpperCase()}
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.username}>{profileUser.username}</h1>
          <span className={styles.roleBadge}>{profileUser.role}</span>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>User ID</span>
            <span className={styles.detailValue}>{profileUser.id}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email Address</span>
            <span className={styles.detailValue}>
              {profileUser.email || 'N/A'}
            </span>
          </div>
        </div>

        {showPromoteAction && (
          <div className={styles.adminActions}>
            <button className={styles.promoteBtn} onClick={handlePromote}>
              Promote to Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
