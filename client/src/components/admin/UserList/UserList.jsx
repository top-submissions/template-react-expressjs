import styles from './UserList.module.css';
import UserRow from '../UserRow/UserRow';

/**
 * Tabular display for user directory.
 * - Renders a semantic table with sortable columns.
 * - Maps through user data to generate specialized UserRow components.
 * - Handles empty states gracefully.
 * @param {Object} props - Component properties.
 * @param {Array} props.users - Array of user objects to display.
 * @returns {JSX.Element}
 */
const UserList = ({ users }) => {
  // Check if directory is empty to show feedback
  const isEmpty = !users || users.length === 0;

  return (
    <div className={styles.tableWrapper}>
      {isEmpty ? (
        <div className={styles.emptyState}>
          <p>No users found in the directory.</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.colUser}>User</th>
              <th className={styles.colRole}>Role</th>
              <th className={styles.colJoined}>Joined</th>
              <th className={styles.colActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate through list and inject atomic row components */}
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
