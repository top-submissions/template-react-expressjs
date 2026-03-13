import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../../providers/AuthProvider/AuthProvider';
import { ToastProvider } from '../../../providers/ToastProvider/ToastProvider';
import LoginForm from './LoginForm';

// suppress network calls during test execution
global.fetch = vi.fn();

/**
 * Integration tests for LoginForm.
 * - Wraps component in ToastProvider and AuthProvider to satisfy context requirements.
 */
describe('LoginForm', () => {
  /**
   * Helper to wrap the form with all required application context.
   */
  const renderLoginForm = () => {
    return render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </ToastProvider>
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
    // Wait for the validator to catch empty fields
    const errorMsg = await screen.findByText(/Username is required/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
