import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { signupSchema } from '../../../modules/validators/auth/auth.validator.js';
import ValidationError from '../../errors/ValidationError/ValidationError';
import styles from './SignupForm.module.css';

/**
 * Signup form component for user registration.
 * - Manages local form state for username, password, and confirmation.
 * - Uses Zod schema for client-side validation logic.
 * - Integrates ValidationError component for detailed feedback.
 * @returns {JSX.Element}
 */
const SignupForm = () => {
  // Initialize form state and error object structure
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errorData, setErrorData] = useState({ message: '', errors: [] });
  const navigate = useNavigate();

  // Track input changes and clear errors on type
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorData.message) setErrorData({ message: '', errors: [] });
  };

  /**
   * Processes the signup submission.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorData({ message: '', errors: [] });

    // Validate form data against Zod schema
    const validation = signupSchema.safeParse(formData);

    // Set client-side validation error if schema check fails
    if (!validation.success) {
      setErrorData({
        message: 'Validation failed',
        errors: validation.error.issues.map((issue) => ({
          msg: issue.message,
        })),
      });
      return;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

    try {
      // Execute post request to backend signup route
      const response = await fetch(`${baseUrl}/api/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Navigate to login on success or populate error state from server response
      if (response.ok) {
        navigate('/log-in');
      } else {
        setErrorData({
          message: data.message || 'Signup failed',
          errors: data.errors || [],
        });
      }
    } catch (err) {
      setErrorData({
        message: `An error occurred: ${err.message}`,
        errors: [],
      });
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Sign Up</h2>

      {/* Component for displaying rich validation feedback */}
      <ValidationError message={errorData.message} errors={errorData.errors} />

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

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Register
        </button>
      </form>

      <p className={styles.footerText}>
        Already have an account? <Link to="/log-in">Log In</Link>
      </p>
    </div>
  );
};

export default SignupForm;
