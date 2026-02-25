import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { signupSchema } from '../../modules/validators/auth/auth.validator.js';
import styles from './SignupForm.module.css';

/**
 * Signup form component for user registration.
 * * Manages local form state for username, password, and confirmation.
 * * Uses Zod schema for client-side validation logic.
 * * Handles submission to the backend API.
 * @returns {JSX.Element} The rendered signup form.
 */
const SignupForm = () => {
  // Initialize form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Track input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Processes the signup submission.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form data against Zod schema
    const validation = signupSchema.safeParse(formData);

    // If validation fails, set the first error message and stop
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      // Execute post request to backend signup route
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        navigate('/log-in');
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError(`An error occurred: ${err}`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Sign Up</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
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
