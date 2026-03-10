import { createBrowserRouter } from 'react-router';
import App from './pages/App/App';
import MainLayout from './layouts/MainLayout/MainLayout';
import LandingPage from './pages/LandingPage/LandingPage';
import SignupForm from './components/forms/SignupForm/SignupForm';
import LoginForm from './components/forms/LoginForm/LoginForm';
import NotFoundError from './pages/errors/NotFoundError/NotFoundError';
import ForbiddenError from './pages/errors/ForbiddenError/ForbiddenError';
import InternalServerError from './pages/errors/InternalServerError/InternalServerError';
import ExternalServiceError from './pages/errors/ExternalServiceError/ExternalServiceError';

/**
 * Global application router configuration.
 * - Root level uses App for global providers and state.
 * - MainLayout wraps pages that require a consistent Navbar/UI shell.
 * - Login and Signup are kept outside MainLayout for a clean focus.
 */
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <InternalServerError />,
    children: [
      // Pages WITHOUT the Global Navbar
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

      // Pages WITH the Global Navbar (Wrapped in MainLayout)
      {
        element: <MainLayout />,
        children: [
          // Future routes like Dashboard, Profile, etc.
        ],
      },

      // Catch-all for undefined paths
      {
        path: '*',
        element: <NotFoundError />,
      },
    ],
  },
]);

export default routes;
