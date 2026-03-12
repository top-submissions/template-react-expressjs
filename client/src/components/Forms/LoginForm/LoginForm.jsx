import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { loginSchema } from '../../../modules/validators/auth/auth.validator.js';
import { authApi } from '../../../modules/api/auth/auth.api.js';
import ValidationError from '../../errors/ValidationError/ValidationError';
import AuthenticationError from '../../errors/AuthenticationError/AuthenticationError';
import styles from './LoginForm.module.css';

/**
 * Login form component for user authentication.
 * - Manages credentials state and interaction.
 * - Synchronizes global auth state via useAuth on success.
 * - Redirects based on user role (Admin vs User).
 * @returns {JSX.Element} The rendered login form.
 */
const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorData, setErrorData] = useState({
    message: '',
    errors: [],
    status: null,
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorData.message)
      setErrorData({ message: '', errors: [], status: null });
  };

  /**
   * Processes the login submission.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorData({ message: '', errors: [], status: null });

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      setErrorData({
        message: 'Invalid credentials format',
        errors: validation.error.issues.map((i) => ({ msg: i.message })),
        status: 400,
      });
      return;
    }

    try {
      // Use authApi to execute the login request
      const response = await authApi.login(formData);
      const data = await response.json();

      if (response.ok) {
        login(data.user);

        const isAdmin =
          data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN';

        if (isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
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

      {errorData.status === 401 ? (
        <AuthenticationError message={errorData.message} />
      ) : (
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
