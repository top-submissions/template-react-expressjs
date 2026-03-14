import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { adminApi } from '../../../modules/api/admin/admin.api';
import UserList from '../../../components/admin/UserList/UserList';
import Spinner from '../../../components/feedback/Spinner/Spinner';
import styles from './UserManagementPage.module.css';

/**
 * Administrative User Management Page.
 * - Synchronizes with /api/admin/users.
 * - Handles asynchronous states: loading, error, and success.
 * - Provides navigation back to the Admin Dashboard.
 * @returns {JSX.Element}
 */
const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches user data from the server.
   * - Extracts the users array from the wrapped response object.
   * - Manages loading and error states during the request lifecycle.
   */
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminApi.getAllUsers();

      if (!response.ok) {
        throw new Error('Failed to retrieve user directory.');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      // Always stop the spinner regardless of outcome
      setIsLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <Link to="/admin-dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.stats}>Total Users: {users?.length || 0}</p>
        </div>
      </header>

      <div className={styles.listWrapper}>
        {/* Conditional Rendering Logic */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <Spinner size="3rem" />
            <p>Loading user records...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchUsers} className={styles.retryBtn}>
              Retry Fetch
            </button>
          </div>
        ) : (
          <div className={styles.listArea}>
            <UserList users={users} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
