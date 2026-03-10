import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';

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

describe('AuthProvider', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it('provides guest status by default and updates on login', async () => {
    // --- Arrange ---
    fetch.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // --- Act ---
    const loginBtn = screen.getByText('Mock Login');
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
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

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
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

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

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for error to appear
    await waitFor(() =>
      expect(screen.getByTestId('auth-error')).not.toHaveTextContent('No Error')
    );

    // --- Act ---
    const clearBtn = screen.getByText('Clear Error');
    await user.click(clearBtn);

    // --- Assert ---
    expect(screen.getByTestId('auth-error')).toHaveTextContent('No Error');
  });
});
