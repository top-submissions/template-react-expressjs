import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import Navbar from './Navbar';

// Mock the auth hook to control user state during testing
vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standard links for a regular USER', () => {
    // --- Arrange ---
    // Simulate a standard user session
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
    // Verify visibility of standard links and hidden status of Admin link
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('john_doe')).toBeInTheDocument();

    // We use a specific selector to avoid matching text inside comments or partial matches
    const adminLink = screen.queryByRole('link', { name: /admin panel/i });
    expect(adminLink).not.toBeInTheDocument();
  });

  it('renders Admin Panel link for an ADMIN role', () => {
    // --- Arrange ---
    // Simulate an administrator session
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
    // Verify elevated privilege link is visible specifically as a navigation link
    const adminLink = screen.getByRole('link', { name: /admin panel/i });
    expect(adminLink).toBeInTheDocument();
  });

  it('renders nothing in user section when unauthenticated', () => {
    // --- Arrange ---
    // Simulate no active session
    useAuth.mockReturnValue({ user: null, logout: vi.fn() });

    // --- Act ---
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // --- Assert ---
    // Verify logout button and username are absent
    expect(
      screen.queryByRole('button', { name: /log out/i })
    ).not.toBeInTheDocument();
  });
});
