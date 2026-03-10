import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import UserList from '../../../components/admin/UserList/UserList';
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

      // Request users
      const response = await fetch('/api/admin/users');

      if (!response.ok) {
        throw new Error('Failed to retrieve user directory.');
      }

      const data = await response.json();
      // Extract users array
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
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
            Back to Dashboard
          </Link>
          <h1 className={styles.title}>User Management</h1>
          {/* Ensure length check safe-guard for the user count */}
          <p className={styles.stats}>Total Users: {users?.length || 0}</p>
        </div>
      </header>

      <div className={styles.listWrapper}>
        {/* Render loading feedback during active request */}
        {isLoading && (
          <div className={styles.loadingState}>
            <p>Loading user records...</p>
          </div>
        )}

        {/* Render error feedback with retry capability on failure */}
        {error && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchUsers} className={styles.retryBtn}>
              Retry Fetch
            </button>
          </div>
        )}

        {/* Render the actual UserList once data is available */}
        {!isLoading && !error && (
          <div className={styles.listArea}>
            <UserList users={users} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
