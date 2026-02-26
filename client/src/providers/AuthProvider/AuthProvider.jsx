import { createContext, useState, useEffect, useContext } from 'react';

// Create context for auth data
const AuthContext = createContext(null);

/**
 * Provider component for authentication state and actions.
 * * Manages the 'user' object and 'loading' status.
 * * Provides login, logout, and signup wrappers.
 * * Syncs auth state with the backend on mount.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {JSX.Element} The provider wrapper.
 */
export const AuthProvider = ({ children }) => {
  // Initialize state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session with server on refresh
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Pings the server to verify if a valid session cookie exists.
   */
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates global state after successful login.
   * @param {Object} userData - The user profile returned from the API.
   */
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Resets global state after logout.
   */
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context.
 * @returns {Object} { user, loading, login, logout }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
