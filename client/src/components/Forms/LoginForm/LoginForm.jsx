import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { loginSchema } from '../../../modules/validators/auth/auth.validator.js';
import styles from './LoginForm.module.css';

/**
 * Login form component for user authentication.
 * * Manages local form state for credentials.
 * * Validates inputs against Zod loginSchema.
 * * Handles API submission and navigation on success.
 * @returns {JSX.Element} The rendered login form.
 */
const LoginForm = () => {
  // Define form state
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Processes the login submission.
   * * Validates schema.
   * * Posts to /api/auth/log-in.
   * * Redirects to home on 200 OK.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Perform client-side validation
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
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

      // Navigate to home on success or display server error
      if (response.ok) {
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Log In</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

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
