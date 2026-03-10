import { Outlet } from 'react-router';
import Navbar from '../../components/navigation/Navbar/Navbar';
import styles from './MainLayout.module.css';

/**
 * Primary layout wrapper for the application.
 * - Provides a persistent global navigation header.
 * - Manages the main content area using the Router Outlet.
 * - Handles top-level layout constraints (min-height, background).
 * @returns {JSX.Element}
 */
const MainLayout = () => {
  return (
    <div className={styles.layoutContainer}>
      {/* Persistent navigation across all nested routes */}
      <Navbar />

      {/* Main content area with layout-specific padding/constraints */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
