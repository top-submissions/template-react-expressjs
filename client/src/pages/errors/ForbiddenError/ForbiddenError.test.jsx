import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import ForbiddenError from './ForbiddenError';

describe('ForbiddenError Component', () => {
  it('should render the 403 error code and permission message', () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <ForbiddenError />
      </MemoryRouter>
    );

    // --- Act ---
    const heading = screen.getByText('403');
    const subHeading = screen.getByText(/access denied/i);

    // --- Assert ---
    expect(heading).toBeInTheDocument();
    expect(subHeading).toBeInTheDocument();
  });

  it('should provide a link to return to the home page', () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <ForbiddenError />
      </MemoryRouter>
    );

    // --- Act ---
    const link = screen.getByRole('link', { name: /return to home/i });

    // --- Assert ---
    expect(link).toHaveAttribute('href', '/');
  });
});
