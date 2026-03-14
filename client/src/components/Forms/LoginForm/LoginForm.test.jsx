import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../../../providers/AuthProvider/AuthProvider';
import { ToastProvider } from '../../../providers/ToastProvider/ToastProvider';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  /**
   * Helper to wrap the form with all required application context.
   * @returns {RenderResult}
   */
  const renderLoginForm = () => {
    return render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  };

  it('updates input values on change', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    renderLoginForm();

    // --- Act ---
    const usernameInput = screen.getByLabelText(/Username/i);
    await user.type(usernameInput, 'john_doe');

    // --- Assert ---
    expect(usernameInput).toHaveValue('john_doe');
  });

  it('displays error message for invalid login attempt', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    renderLoginForm();

    // --- Act ---
    const submitBtn = screen.getByRole('button', { name: /Enter/i });
    await user.click(submitBtn);

    // --- Assert ---
    // Validate that validator catches empty fields
    const errorMsg = await screen.findByText(/Username is required/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
