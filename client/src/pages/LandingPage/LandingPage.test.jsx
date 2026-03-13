import { render, screen } from '@testing-library/react';
import { MemoryRouter, Navigate } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './LandingPage';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';

// Mock the auth hook to simulate guest vs authenticated states
vi.mock('../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

// Mock Navigate to avoid full route changes in unit tests
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    // Return null to avoid rendering actual navigation components
    Navigate: vi.fn(() => null),
  };
});

describe('LandingPage', () => {
  it('renders welcome message and navigation links for guests', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // --- Act ---
    const heading = screen.getByText(/Welcome to the App/i);
    const loginLink = screen.getByRole('link', { name: /Log In/i });

    // --- Assert ---
    expect(heading).toBeDefined();
    expect(loginLink.getAttribute('href')).toBe('/log-in');
  });

  it('redirects to dashboard when user is already logged in', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { username: 'Boss', role: 'USER' } });

    // --- Act ---
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // --- Assert ---
    // Fix: expect one argument (props object) containing the 'to' property
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/dashboard' }),
      undefined
    );
  });
});
