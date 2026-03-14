import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../../providers/AuthProvider/AuthProvider';
import { ToastProvider } from '../../../providers/ToastProvider/ToastProvider';
import UserManagementPage from './UserManagementPage';

describe('UserManagementPage Component', () => {
  /**
   * Helper to render the page with necessary context providers.
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
    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) return new Promise(() => {}); // Never resolves
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: { id: 1, role: 'ADMIN' } }),
      });
    });

    // --- Act ---
    renderPage();

    // --- Assert ---
    expect(screen.getByText(/loading user records/i)).toBeInTheDocument();
  });

  it('renders user count after successful fetch', async () => {
    // --- Arrange ---
    const mockResponse = {
      users: [
        { id: 1, username: 'user1', role: 'USER' },
        { id: 2, username: 'user2', role: 'USER' },
      ],
    };

    fetch.mockImplementation((url) => {
      if (url.includes('/api/admin/users')) {
        return Promise.resolve({ ok: true, json: async () => mockResponse });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ user: { id: 99, role: 'ADMIN' } }),
      });
    });

    // --- Act ---
    renderPage();

    // --- Assert ---
    await waitFor(() => {
      const statsElement = screen.getByText(/total users:/i);
      expect(statsElement).toHaveTextContent('Total Users: 2');
    });
  });

  it('displays error state on network failure', async () => {
    // --- Arrange ---
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
    await waitFor(() => {
      expect(
        screen.getByText(/failed to retrieve user directory/i)
      ).toBeInTheDocument();
    });
  });
});
