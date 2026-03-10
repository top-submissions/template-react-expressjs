import { createBrowserRouter } from 'react-router';
import App from './pages/App/App';
import MainLayout from './layouts/MainLayout/MainLayout';
import AuthRoute from './routes/AuthRoute/AuthRoute';
import AdminRoute from './routes/AdminRoute/AdminRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import SignupForm from './components/forms/SignupForm/SignupForm';
import LoginForm from './components/forms/LoginForm/LoginForm';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage/UserManagementPage';
import NotFoundError from './pages/errors/NotFoundError/NotFoundError';
import ForbiddenError from './pages/errors/ForbiddenError/ForbiddenError';
import InternalServerError from './pages/errors/InternalServerError/InternalServerError';
import ExternalServiceError from './pages/errors/ExternalServiceError/ExternalServiceError';

/**
 * Global application router configuration.
 * - Implements a three-tier protection strategy: Public -> Authenticated -> Administrative.
 * - Uses MainLayout as the UI shell for all post-login pages.
 * - Centralizes error handling via errorElement and catch-all routes.
 * @returns {Object} A React Router instance.
 */
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <InternalServerError />,
    children: [
      // Define standalone public routes that do not require the global Navbar
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'sign-up',
        element: <SignupForm />,
      },
      {
        path: 'log-in',
        element: <LoginForm />,
      },
      {
        path: 'forbidden',
        element: <ForbiddenError />,
      },
      {
        path: 'service-error',
        element: <ExternalServiceError />,
      },

      // Group routes that share the MainLayout (Navbar, global padding, etc.)
      {
        element: <MainLayout />,
        children: [
          // Tier 1 Protection: Verify user is authenticated
          {
            element: <AuthRoute />,
            children: [
              // Tier 2 Protection: Verify user has ADMIN or SUPER_ADMIN role
              {
                path: 'admin-dashboard',
                element: <AdminRoute />,
                children: [
                  // Default view for the admin-dashboard path
                  {
                    index: true,
                    element: <AdminDashboard />,
                  },
                  // Specific administrative sub-features
                  {
                    path: 'users',
                    element: <UserManagementPage />,
                  },
                ],
              },
            ],
          },
        ],
      },

      // Handle undefined routes with a custom 404 page
      {
        path: '*',
        element: <NotFoundError />,
      },
    ],
  },
]);

export default routes;
