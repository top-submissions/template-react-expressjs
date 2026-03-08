import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { loginSchema } from '../../../modules/validators/auth/auth.validator.js';
import ValidationError from '../../errors/ValidationError/ValidationError';
import AuthenticationError from '../../errors/AuthenticationError/AuthenticationError';
import styles from './LoginForm.module.css';

/**
 * Login form component for user authentication.
 * - Manages credentials state.
 * - Dynamically switches error components based on backend status codes.
 * @returns {JSX.Element}
 */
const LoginForm = () => {
  // Define form state and status-aware error state
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorData, setErrorData] = useState({
    message: '',
    errors: [],
    status: null,
  });
  const navigate = useNavigate();

  // Update data and reset errors on interaction
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorData.message)
      setErrorData({ message: '', errors: [], status: null });
  };

  /**
   * Processes the login submission.
   * - Validates schema.
   * - Handles 401 via AuthenticationError.
   * - Handles 400 via ValidationError.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorData({ message: '', errors: [], status: null });

    // Perform client-side schema check
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      setErrorData({
        message: 'Invalid credentials format',
        errors: validation.error.issues.map((i) => ({ msg: i.message })),
        status: 400,
      });
      return;
    }

    // Determine target URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute post request to backend login route
      const response = await fetch(`${baseUrl}/api/auth/log-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle successful login or dispatch to correct error component
      if (response.ok) {
        navigate('/');
      } else {
        setErrorData({
          message: data.message || 'Login failed',
          errors: data.errors || [],
          status: response.status,
        });
      }
    } catch (err) {
      setErrorData({
        message: `Connection error: ${err.message}`,
        errors: [],
        status: 500,
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Log In</h2>

      {/* Conditionally render AuthenticationError for identity issues (401/403) */}
      {errorData.status === 401 ? (
        <AuthenticationError message={errorData.message} />
      ) : (
        /* Render ValidationError for malformed data or server crashes */
        <ValidationError
          message={errorData.message}
          errors={errorData.errors}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Enter
        </button>
      </form>

      <p className={styles.footerText}>
        Don't have an account? <Link to="/sign-up">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
