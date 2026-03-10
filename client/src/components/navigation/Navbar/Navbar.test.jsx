import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import Navbar from './Navbar';

vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standard links and user dashboard home for a regular USER', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({
      user: { username: 'john_doe', role: 'USER' },
      logout: vi.fn(),
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Assert ---
    // check for the dynamic Home link pointing to standard dashboard
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('john_doe')).toBeInTheDocument();
  });

  it('renders Admin Dashboard home link for an ADMIN role', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({
      user: { username: 'admin_user', role: 'ADMIN' },
      logout: vi.fn(),
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Assert ---
    // check for the dynamic Home link pointing to admin dashboard
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/admin-dashboard');
  });

  it('renders nothing in user section when unauthenticated', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });

    // --- Act ---
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(
      screen.queryByRole('button', { name: /log out/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/home/i)).not.toBeInTheDocument();
  });
});
