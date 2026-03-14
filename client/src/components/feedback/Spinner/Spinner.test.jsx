/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  it('renders successfully with accessible role', () => {
    // --- Act ---
    render(<Spinner />);

    // --- Assert ---
    // Check for the ARIA role status
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Check for the screen-reader-only text
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('applies custom size via props', () => {
    // --- Arrange ---
    const customSize = '64px';

    // --- Act ---
    render(<Spinner size={customSize} />);
    const spinnerGraphic = screen.getByRole('status').firstElementChild;

    // --- Assert ---
    expect(spinnerGraphic).toHaveStyle({
      width: customSize,
      height: customSize,
    });
  });
});
