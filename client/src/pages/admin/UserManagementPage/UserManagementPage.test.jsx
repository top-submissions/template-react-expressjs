import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../../providers/AuthProvider/AuthProvider';
import UserManagementPage from './UserManagementPage';

/**
 * Integration tests for the User Management Page.
 * - Mocks global fetch for API simulation.
 * - Wraps component in AuthProvider to satisfy context requirements.
 */
describe('UserManagementPage Component', () => {
  beforeEach(() => {
    // Reset fetch mock and provide a default mock for the AuthProvider's /me call
    global.fetch = vi.fn();

    // Mock the initial auth check to prevent AuthProvider from hanging
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

  it('shows loading state initially', async () => {
    // --- Arrange ---
    // Override the users fetch to stay pending
    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) return new Promise(() => {});
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserManagementPage />
        </AuthProvider>
      </MemoryRouter>
    );

    // --- Assert ---
    // Verify visibility of loading indicator
    expect(screen.getByText(/loading user records/i)).toBeInTheDocument();
  });

  it('renders user count after successful fetch', async () => {
    // --- Arrange ---
    // Prepare mock response following the backend data shape { users: [] }
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
      // Handle the AuthProvider's /me call
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: { id: 99, role: 'ADMIN' } }),
      });
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserManagementPage />
        </AuthProvider>
      </MemoryRouter>
    );

    // --- Assert ---
    // Check for total count after the async render completes
    await waitFor(() => {
      const statsElement = screen.getByText(/total users:/i);
      expect(statsElement).toHaveTextContent('Total Users: 2');
    });
  });

  it('displays error state on network failure', async () => {
    // --- Arrange ---
    // Simulate an API error response for the users endpoint
    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) {
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserManagementPage />
        </AuthProvider>
      </MemoryRouter>
    );

    // --- Assert ---
    // Ensure error message is visible to the user
    await waitFor(() => {
      expect(
        screen.getByText(/failed to retrieve user directory/i)
      ).toBeInTheDocument();
    });
  });
});
