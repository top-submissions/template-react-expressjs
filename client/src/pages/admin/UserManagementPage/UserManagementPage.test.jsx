import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../../providers/AuthProvider/AuthProvider';
import { ToastProvider } from '../../../providers/ToastProvider/ToastProvider';
import UserManagementPage from './UserManagementPage';

/**
 * Integration tests for the User Management Page.
 * - Mocks global fetch for API simulation.
 * - Wraps component in ToastProvider and AuthProvider to satisfy context requirements.
 */
describe('UserManagementPage Component', () => {
  beforeEach(() => {
    // Reset fetch mock
    global.fetch = vi.fn();

    // Mock initial auth check to prevent AuthProvider from hanging
    fetch.mockImplementation((url) => {
      if (url.includes('/api/auth/me')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            user: { id: 1, role: 'ADMIN', username: 'admin' },
          }),
        });
      }
      return Promise.resolve({ ok: false });
    });
  });

  /**
   * Helper to render the page with all necessary context providers.
   */
  const renderPage = () => {
    return render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <UserManagementPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );
  };

  it('shows loading state initially', async () => {
    // --- Arrange ---
    // Ensure the user fetch stays in a pending state
    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) return new Promise(() => {});
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: { id: 1, role: 'ADMIN' } }),
      });
    });

    // --- Act ---
    renderPage();

    // --- Assert ---
    // Locate the loading indicator
    expect(screen.getByText(/loading user records/i)).toBeInTheDocument();
  });

  it('renders user count after successful fetch', async () => {
    // --- Arrange ---
    // Mock user data response shape
    const mockResponse = {
      users: [
        { id: 1, username: 'user1', role: 'USER' },
        { id: 2, username: 'user2', role: 'USER' },
      ],
    };

    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockResponse,
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: { id: 99, role: 'ADMIN' } }),
      });
    });

    // --- Act ---
    renderPage();

    // --- Assert ---
    // Wait for the total count to update in the UI
    await waitFor(() => {
      const statsElement = screen.getByText(/total users:/i);
      expect(statsElement).toHaveTextContent('Total Users: 2');
    });
  });

  it('displays error state on network failure', async () => {
    // --- Arrange ---
    // Force a 404 or failure for the user list endpoint
    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) {
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: { id: 1, role: 'ADMIN' } }),
      });
    });

    // --- Act ---
    renderPage();

    // --- Assert ---
    // Check for specific error message defined in component
    await waitFor(() => {
      expect(
        screen.getByText(/failed to retrieve user directory/i)
      ).toBeInTheDocument();
    });
  });
});
