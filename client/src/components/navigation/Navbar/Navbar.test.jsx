import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { useToast } from '../../../providers/ToastProvider/ToastProvider';
import { useTheme } from '../../../providers/ThemeProvider/ThemeProvider';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('renders theme toggle and calls toggleTheme on click', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const mockToggleTheme = vi.fn();

    // Use vi.mocked to set specific returns on the global mocks
    vi.mocked(useAuth).mockReturnValue({ user: null });
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Act ---
    const toggleBtn = screen.getByLabelText(/switch to light mode/i);
    expect(toggleBtn).toHaveTextContent('☀️');
    await user.click(toggleBtn);

    // --- Assert ---
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls logout and shows toast when confirmed', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const mockLogout = vi.fn();
    const mockShowToast = vi.fn();

    // Explicitly set what the hooks return for this test
    vi.mocked(useToast).mockReturnValue({ showToast: mockShowToast });
    vi.mocked(useAuth).mockReturnValue({
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
