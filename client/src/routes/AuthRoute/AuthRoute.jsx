import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';

/**
 * Route guard for authenticated pages.
 * - Redirects to login if user is not authenticated.
 * - Preserves the attempted location in state for post-login redirection.
 * @returns {JSX.Element}
 */
const AuthRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Handle session sync state
  if (loading) {
    return null; // Or a global loading spinner
  }

  // If no user exists, redirect to login and pass current location in state
  if (!user) {
    return (
      <Navigate
        to="/log-in"
        state={{
          from: location,
          message: 'Please log in to access this page',
        }}
        replace
      />
    );
  }

  // Render children (protected content)
  return <Outlet />;
};

export default AuthRoute;
