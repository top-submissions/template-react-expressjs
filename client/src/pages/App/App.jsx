import { Outlet } from 'react-router';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import Spinner from '../../components/feedback/Spinner/Spinner';
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

  // Block rendering during session initialization
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="3rem" message="Initializing session..." />
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <main className="container">
        {/* Render nested routes via Outlet */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
