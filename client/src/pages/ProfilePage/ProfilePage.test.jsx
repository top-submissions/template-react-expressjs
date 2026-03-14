import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import ProfilePage from './ProfilePage';

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

  it('renders the current user profile when no ID is provided', async () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ user: mockCurrentUser });

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
    vi.mocked(useAuth).mockReturnValue({ user: mockCurrentUser });
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
});
