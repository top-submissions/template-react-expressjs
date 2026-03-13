import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';
import { ToastProvider } from '../ToastProvider/ToastProvider';

/**
 * Enhanced helper component to test error state consumption.
 */
const TestComponent = () => {
  const { user, login, authError, clearAuthError } = useAuth();
  return (
    <div>
      <span data-testid="user-status">{user ? user.username : 'Guest'}</span>
      <span data-testid="auth-error">{authError || 'No Error'}</span>
      <button onClick={() => login({ username: 'tester' })}>Mock Login</button>
      <button onClick={clearAuthError}>Clear Error</button>
    </div>
  );
};

/**
 * Helper to wrap provider tests with necessary context dependencies.
 */
const renderWithProviders = (ui) => {
  return render(
    <ToastProvider>
      <AuthProvider>{ui}</AuthProvider>
    </ToastProvider>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it('provides guest status by default and updates on login', async () => {
    // --- Arrange ---
    fetch.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();

    // --- Act ---
    renderWithProviders(<TestComponent />);
    const loginBtn = screen.getByRole('button', { name: /mock login/i });
    await user.click(loginBtn);

    // --- Assert ---
    expect(screen.getByTestId('user-status')).toHaveTextContent('tester');
    expect(screen.getByTestId('auth-error')).toHaveTextContent('No Error');
  });

  it('sets an error message when a 401 unauthorized response occurs', async () => {
    // --- Arrange ---
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    // --- Act ---
    renderWithProviders(<TestComponent />);

    // --- Assert ---
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toHaveTextContent(
        /session has expired/i
      );
      expect(screen.getByTestId('user-status')).toHaveTextContent('Guest');
    });
  });

  it('sets a connection error message when the fetch fails', async () => {
    // --- Arrange ---
    fetch.mockRejectedValueOnce(new Error('Network Down'));

    // --- Act ---
    renderWithProviders(<TestComponent />);

    // --- Assert ---
    await waitFor(() => {
      expect(screen.getByTestId('auth-error')).toHaveTextContent(
        /unable to connect/i
      );
    });
  });

  it('clears the error message when clearAuthError is called', async () => {
    // --- Arrange ---
    fetch.mockResolvedValueOnce({ ok: false, status: 401 });
    const user = userEvent.setup();

    // --- Act ---
    renderWithProviders(<TestComponent />);

    // Wait for initial error state
    await waitFor(() =>
      expect(screen.getByTestId('auth-error')).not.toHaveTextContent('No Error')
    );

    // Click clear button
    const clearBtn = screen.getByRole('button', { name: /clear error/i });
    await user.click(clearBtn);

    // --- Assert ---
    expect(screen.getByTestId('auth-error')).toHaveTextContent('No Error');
  });
});
