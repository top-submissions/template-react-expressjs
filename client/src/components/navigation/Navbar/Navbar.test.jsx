import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import { useTheme } from '../../../providers/ThemeProvider/ThemeProvider'; // Added
import Navbar from './Navbar';

vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../../../providers/ToastProvider/ToastProvider', () => ({
  useToast: vi.fn(),
}));
vi.mock('../../../providers/ThemeProvider/ThemeProvider', () => ({
  useTheme: vi.fn(),
}));

describe('Navbar Component', () => {
  const mockLogout = vi.fn();
  const mockShowToast = vi.fn();
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useToast.mockReturnValue({ showToast: mockShowToast });
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: mockToggleTheme });
  });

  it('renders theme toggle and calls toggleTheme on click', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    useAuth.mockReturnValue({ user: null, logout: mockLogout });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Act ---
    const toggleBtn = screen.getByLabelText(/switch to light mode/i);
    expect(toggleBtn).toHaveTextContent('☀️');

    // --- Assert ---
    await user.click(toggleBtn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
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
    await user.click(screen.getByRole('button', { name: /^Logout$/i }));

    // --- Assert ---
    expect(mockLogout).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'info');
  });
});
