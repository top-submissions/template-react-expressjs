import { useRouteError, Link } from 'react-router';

/**
 * Fallback page for 404 Not Found scenarios.
 * * Automatically triggered by React Router's errorElement.
 * * Extracts error details from the routing context.
 * @returns {JSX.Element}
 */
const NotFoundError = () => {
  const error = useRouteError();

  // Extract message if it exists, otherwise provide a fallback
  const errorMessage =
    error?.statusText ||
    error?.message ||
    "We couldn't find the page you're looking for.";

  return (
    <main>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>{errorMessage}</p>
      <Link to="/">Return to Home</Link>
    </main>
  );
};

export default NotFoundError;
