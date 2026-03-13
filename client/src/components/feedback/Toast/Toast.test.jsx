import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Toast from './Toast';

describe('Toast Component', () => {
  const mockProps = {
    message: 'Test Message',
    type: 'success',
    onClose: vi.fn(),
  };

  it('renders the correct message', () => {
    // --- Act ---
    render(<Toast {...mockProps} />);

    // --- Assert ---
    expect(screen.getByText(/Test Message/i)).toBeDefined();
  });

  it('calls onClose when the close button is clicked', () => {
    // --- Arrange ---
    render(<Toast {...mockProps} />);
    const closeButton = screen.getByRole('button', {
      name: /Close notification/i,
    });

    // --- Act ---
    fireEvent.click(closeButton);

    // --- Assert ---
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies the correct CSS class for error types', () => {
    // --- Act ---
    const { container } = render(<Toast {...mockProps} type="error" />);

    // --- Assert ---
    // Check if the div contains a class that looks like the error module class
    expect(container.firstChild.className).toContain('error');
  });
});
