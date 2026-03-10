import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../../providers/AuthProvider/AuthProvider';
import LoginForm from './LoginForm';

// suppress network calls during test execution
global.fetch = vi.fn();

/**
 * Integration tests for LoginForm.
 * - Wraps component in AuthProvider to satisfy context requirements.
 */
describe('LoginForm', () => {
  it('updates input values on change', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>
    );

    // --- Act ---
    const usernameInput = screen.getByLabelText(/Username/i);
    await user.type(usernameInput, 'john_doe');

    // --- Assert ---
    expect(usernameInput).toHaveValue('john_doe');
  });

  it('displays error message for invalid login attempt', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>
    );

    // --- Act ---
    const submitBtn = screen.getByRole('button', { name: /Enter/i });
    await user.click(submitBtn);

    // --- Assert ---
    const errorMsg = await screen.findByText(/Username is required/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
