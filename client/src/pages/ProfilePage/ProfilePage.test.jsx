import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import ProfilePage from './ProfilePage';

vi.mock('../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('ProfilePage Component', () => {
  const mockCurrentUser = {
    id: 'admin-1',
    username: 'admin_boss',
    role: 'ADMIN',
  };
  const mockTargetUser = {
    id: 'user-123',
    username: 'test_subject',
    role: 'USER',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the current user profile when no ID is provided', async () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: mockCurrentUser });

    // --- Act ---
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText('admin_boss')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('fetches and displays another user profile when an ID is provided', async () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: mockCurrentUser });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTargetUser,
    });

    // --- Act ---
    render(
      <MemoryRouter initialEntries={['/profile/user-123']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    // --- Assert ---
    await waitFor(() => {
      expect(screen.getByText('test_subject')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('shows the promote button for admins viewing a standard user', async () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: mockCurrentUser });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTargetUser,
    });

    // --- Act ---
    render(
      <MemoryRouter initialEntries={['/profile/user-123']}>
        <Routes>
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    // --- Assert ---
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /promote to admin/i })
      ).toBeInTheDocument();
    });
  });
});
