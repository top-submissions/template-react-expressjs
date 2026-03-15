import { render, screen } from '../../../__tests__/test-utils';
import { useRouteError } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import NotFoundError from './NotFoundError';

describe('NotFoundError Component', () => {
  it('should display the 404 code and error message', () => {
    // --- Arrange ---
    // Simulate a standard 404 route error return
    vi.mocked(useRouteError).mockReturnValue({ statusText: 'Not Found' });

    render(<NotFoundError />);

    // --- Act ---
    const heading = screen.getByText('404');
    const message = screen.getByText('Not Found');

    // --- Assert ---
    expect(heading).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('should contain a functional link back to the landing page', () => {
    // --- Arrange ---
    vi.mocked(useRouteError).mockReturnValue({});

    render(<NotFoundError />);

    // --- Act ---
    const homeLink = screen.getByRole('link', { name: /return to home/i });

    // --- Assert ---
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
