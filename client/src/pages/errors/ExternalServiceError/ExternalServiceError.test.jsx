import { render, screen } from '../../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNavigate } from 'react-router';
import ExternalServiceError from './ExternalServiceError';

/**
 * Integration/Unit tests for ExternalServiceError Page.
 * * - Ensures recovery actions (Retry/Home) are present.
 * - Validates navigation triggers on button clicks.
 */
describe('ExternalServiceError Page', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset call history and set up navigation mock return
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders correctly with service interruption text and status label', () => {
    // --- Arrange ---
    render(<ExternalServiceError />);

    // --- Assert ---
    expect(screen.getByText(/Connection Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Service Interruption/i)).toBeInTheDocument();
    expect(screen.getByText(/external providers/i)).toBeInTheDocument();
  });

  it('navigates back to home when the home button is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(<ExternalServiceError />);

    // --- Act ---
    const homeBtn = screen.getByText(/Return Home/i);
    await user.click(homeBtn);

    // --- Assert ---
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('refreshes the page when the try again button is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(<ExternalServiceError />);

    // --- Act ---
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    await user.click(retryBtn);

    // --- Assert ---
    expect(mockNavigate).toHaveBeenCalledWith(0);
  });
});
