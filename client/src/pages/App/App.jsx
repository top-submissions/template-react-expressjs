import { Outlet } from 'react-router';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import styles from './App.module.css';
import '../../styles/index.css';

/**
 * Main Application Layout.
 * - Acts as the root wrapper for all routed pages.
 * - Blocks rendering until authentication sync is complete.
 * @returns {JSX.Element} The base application layout.
 */
function App() {
  const { loading } = useAuth();

  // Prevent router from rendering children until session status is known
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Initializing session...</p>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <main>
        {/* Render child routes once loading is complete */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
