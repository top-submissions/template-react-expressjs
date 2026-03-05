import { render, screen } from '@testing-library/react';
import { MemoryRouter, useRouteError } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import NotFoundError from './NotFoundError';

// Mock react-router to control the error state
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useRouteError: vi.fn(),
  };
});

describe('NotFoundError Component', () => {
  it('should display the 404 code and error message', () => {
    // --- Arrange ---
    // Simulate a standard 404 route error
    useRouteError.mockReturnValue({ statusText: 'Not Found' });

    render(
      <MemoryRouter>
        <NotFoundError />
      </MemoryRouter>
    );

    // --- Act ---
    const heading = screen.getByText('404');
    const message = screen.getByText('Not Found');

    // --- Assert ---
    expect(heading).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('should contain a functional link back to the landing page', () => {
    // --- Arrange ---
    useRouteError.mockReturnValue({});

    render(
      <MemoryRouter>
        <NotFoundError />
      </MemoryRouter>
    );

    // --- Act ---
    const homeLink = screen.getByRole('link', { name: /return to home/i });

    // --- Assert ---
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
