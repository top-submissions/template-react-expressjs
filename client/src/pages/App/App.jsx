import { Outlet } from 'react-router';
import styles from './App.module.css';
import '../../styles/index.css';

/**
 * Main Application Layout.
 * * Acts as the root wrapper for all routed pages.
 * * Uses Outlet to render child components (like LandingPage).
 * @returns {JSX.Element} The base application layout.
 */
function App() {
  // Define application shell and rendering slot for routes
  return (
    <div className={styles.appContainer}>
      <main>
        {/* Slot for nested routes defined in routes.jsx */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
