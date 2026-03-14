import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import { userApi } from '../../modules/api/user/user.api';
import styles from './ProfilePage.module.css';

/**
 * User Profile Page.
 * - Displays account details for the current user or a targeted user.
 * - Manages data fetching for external profiles via URL parameters.
 * @returns {JSX.Element}
 */
const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads user data.
   * - If an ID is in the URL, fetches that specific user.
   * - Otherwise, defaults to the current authenticated user's data.
   */
  useEffect(() => {
    const loadProfile = async () => {
      // Use current user if no ID parameter is present
      if (!id) {
        setProfileUser(currentUser);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch specific user via API service
        const response = await userApi.getById(id);
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

  if (isLoading)
    return (
      <div className={`${styles.loadingWrapper} animate-fade-in`}>
        Loading profile...
      </div>
    );
  if (error) return <div className={styles.errorWrapper}>Error: {error}</div>;
  if (!profileUser) return null;

  return (
    <div className={`${styles.container} animate-fade-in`}>
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
      </div>
    </div>
  );
};

export default ProfilePage;
