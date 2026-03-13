import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import Navbar from './Navbar';

// Mock both contexts
vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../../../providers/ToastProvider/ToastProvider', () => ({
  useToast: vi.fn(),
}));

describe('Navbar Component', () => {
  const mockLogout = vi.fn();
  const mockShowToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue({ showToast: mockShowToast });
  });

  it('opens confirmation modal when logout is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    useAuth.mockReturnValue({
      user: { username: 'john_doe', role: 'USER' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Act ---
    const logoutBtn = screen.getByRole('button', { name: /log out/i });
    await user.click(logoutBtn);

    // --- Assert ---
    // Modal should be visible
    expect(
      screen.getByText(/Are you sure you want to log out/i)
    ).toBeInTheDocument();
    // logout should NOT have been called yet
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('calls logout and shows toast when confirmed', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    useAuth.mockReturnValue({
      user: { username: 'john_doe', role: 'USER' },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Act ---
    await user.click(screen.getByRole('button', { name: /log out/i }));
    const confirmBtn = screen.getByRole('button', { name: /^Logout$/i }); // Match exact modal button
    await user.click(confirmBtn);

    // --- Assert ---
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'info');
  });
});
