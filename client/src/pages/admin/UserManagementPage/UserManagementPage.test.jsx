import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserManagementPage from './UserManagementPage';

describe('UserManagementPage Component', () => {
  // Reset fetch mock before each test run
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('shows loading state initially', async () => {
    // --- Arrange ---
    // Simulate a delayed response
    fetch.mockReturnValue(new Promise(() => {}));

    // --- Act ---
    render(
      <MemoryRouter>
        <UserManagementPage />
      </MemoryRouter>
    );

    // --- Assert ---
    // Verify visibility of loading indicator
    expect(screen.getByText(/loading user records/i)).toBeInTheDocument();
  });

  it('renders user count after successful fetch', async () => {
    // --- Arrange ---
    // Prepare mock user data
    const mockUsers = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <UserManagementPage />
      </MemoryRouter>
    );

    // --- Assert ---
    // Confirm total count updates based on response length
    await waitFor(() => {
      expect(screen.getByText(/total users: 2/i)).toBeInTheDocument();
    });
  });

  it('displays error state on network failure', async () => {
    // --- Arrange ---
    // Simulate an API error response
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <UserManagementPage />
      </MemoryRouter>
    );

    // --- Assert ---
    // Ensure error message and retry button are visible
    await waitFor(() => {
      expect(
        screen.getByText(/failed to retrieve user directory/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /retry fetch/i })
      ).toBeInTheDocument();
    });
  });
});
