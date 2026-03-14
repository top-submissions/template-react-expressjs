import { render, screen } from '@testing-library/react';
import { MemoryRouter, Navigate } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders hero content and CTA links for guests', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ user: null });

    // --- Act ---
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText(/Welcome to the App/i)).toBeInTheDocument();
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
    vi.mocked(useAuth).mockReturnValue({
      user: { username: 'Boss', role: 'USER' },
    });

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
