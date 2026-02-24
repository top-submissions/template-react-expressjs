import { createBrowserRouter } from 'react-router';
import App from './pages/App/App';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LandingPage from './pages/LandingPage/LandingPage';

/**
 * Global application router configuration.
 * - Root path renders the App layout with LandingPage as default child.
 * - ErrorElement handles all routing-level exceptions.
 */
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    // Define nested routes for the application
    children: [
      {
        // Index: true renders this when the parent path ('/') is matched exactly
        index: true,
        element: <LandingPage />,
      },
    ],
  },
]);

export default routes;
