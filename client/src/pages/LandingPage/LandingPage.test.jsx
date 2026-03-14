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
    Navigate: vi.fn(() => null),
  };
});

describe('LandingPage', () => {
  it('renders hero content and CTA links for guests', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: null });

    // --- Act ---
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText(/Welcome to the App/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /Get Started/i })).toHaveAttribute(
      'href',
      '/sign-up'
    );
    expect(screen.getByRole('link', { name: /Log In/i })).toHaveAttribute(
      'href',
      '/log-in'
    );
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
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/dashboard' }),
      undefined
    );
  });
});
