import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './UserManagementPage.module.css';

/**
 * Administrative User Management Page.
 * - Fetches all registered users from the backend.
 * - Handles asynchronous states: loading, error, and success.
 * - Provides navigation back to the Admin Dashboard.
 * @returns {JSX.Element}
 */
const UserManagementPage = () => {
  // State for storing the list of users
  const [users, setUsers] = useState([]);
  // UI state for asynchronous feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches user data from the server.
   * - Resets error state before retry.
   * - Finalizes by disabling the loading spinner.
   */
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Request user directory from the API
      const response = await fetch('/api/users');

      if (!response.ok) {
        throw new Error('Failed to retrieve user directory.');
      }

      const data = await response.json();
      setUsers(data);
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
          <p className={styles.stats}>Total Users: {users.length}</p>
        </div>
      </header>

      <div className={styles.listWrapper}>
        {/* Branch: Display spinner during network request */}
        {isLoading && (
          <div className={styles.loadingState}>
            <p>Loading user records...</p>
          </div>
        )}

        {/* Branch: Display error message and retry action on failure */}
        {error && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchUsers} className={styles.retryBtn}>
              Retry Fetch
            </button>
          </div>
        )}

        {/* Branch: Render data table if fetch succeeds and is not loading */}
        {!isLoading && !error && (
          <div className={styles.listArea}>
            {/* UserList component will be injected here next */}
            <p style={{ padding: '2rem' }}>User List component placeholder.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
