import { createBrowserRouter } from 'react-router';
import App from './pages/App/App';
import LandingPage from './pages/LandingPage/LandingPage';
import SignupForm from './components/forms/SignupForm/SignupForm';
import LoginForm from './components/forms/LoginForm/LoginForm';
import NotFoundError from './pages/errors/NotFoundError/NotFoundError';
import ForbiddenError from './pages/errors/ForbiddenError/ForbiddenError';
import InternalServerError from './pages/errors/InternalServerError/InternalServerError';

/**
 * Global application router configuration.
 * - Root path renders the App layout with LandingPage as default child.
 * - ErrorElement handles all routing-level exceptions.
 */
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <InternalServerError />,
    // Define nested routes for the application
    children: [
      {
        // Index: true renders this when the parent path ('/') is matched exactly
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
        // Catch-all route for any undefined paths within the root layout
        path: '*',
        element: <NotFoundError />,
      },
    ],
  },
]);

export default routes;
