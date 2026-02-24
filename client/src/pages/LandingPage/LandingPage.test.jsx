import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';

/**
 * Integration tests for the LandingPage component.
 * - Verifies presence of key marketing text.
 * - Ensures navigation links are rendered with correct paths.
 */
describe('LandingPage', () => {
  it('renders welcome message and navigation links', () => {
    // --- Arrange ---
    // Wrap component in router to support Link elements
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    // --- Act ---
    // Search for elements by their role or text
    const heading = screen.getByText(/Welcome to the App/i);
    const loginLink = screen.getByRole('link', { name: /Log In/i });
    const signupLink = screen.getByRole('link', { name: /Sign Up/i });

    // --- Assert ---
    // Check for visibility and correct attributes
    expect(heading).toBeDefined();
    expect(loginLink.getAttribute('href')).toBe('/log-in');
    expect(signupLink.getAttribute('href')).toBe('/sign-up');
  });
});
