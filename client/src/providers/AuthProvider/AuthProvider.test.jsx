import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthProvider';

/**
 * Helper component to test hook consumption.
 */
const TestComponent = () => {
  const { user, login } = useAuth();
  return (
    <div>
      <span data-testid="user-status">{user ? user.username : 'Guest'}</span>
      <button onClick={() => login({ username: 'tester' })}>Mock Login</button>
    </div>
  );
};

describe('AuthProvider', () => {
  // Mock global fetch
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('provides guest status by default and updates on login', async () => {
    // --- Arrange ---
    // Mock failing auth check to start as Guest
    fetch.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // --- Act ---
    // Check initial state then trigger mock login
    const status = screen.getByTestId('user-status');
    const loginBtn = screen.getByText('Mock Login');
    await user.click(loginBtn);

    // --- Assert ---
    // Ensure state transition occurred
    expect(status).toHaveTextContent('tester');
  });

  it('hydrates user state if checkAuthStatus succeeds', async () => {
    // --- Arrange ---
    // Mock successful session check
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { username: 'persistent_user' } }),
    });

    // --- Act ---
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // --- Assert ---
    // Wait for the useEffect to finish hydration
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent(
        'persistent_user',
      );
    });
  });
});
