import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router';
import ExternalServiceError from './ExternalServiceError';

// Mock react-router navigation hooks
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

/**
 * Integration/Unit tests for ExternalServiceError Page.
 * - Ensures recovery actions (Retry/Home) are present.
 * - Validates navigation triggers on button clicks.
 */
describe('ExternalServiceError Page', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders correctly with service interruption text', () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <ExternalServiceError />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText(/Service Interruption/i)).toBeInTheDocument();
    expect(screen.getByText(/external providers/i)).toBeInTheDocument();
  });

  it('navigates back to home when the home button is clicked', () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <ExternalServiceError />
      </MemoryRouter>
    );

    // --- Act ---
    const homeBtn = screen.getByText(/Return Home/i);
    fireEvent.click(homeBtn);

    // --- Assert ---
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('refreshes the page when the try again button is clicked', () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <ExternalServiceError />
      </MemoryRouter>
    );

    // --- Act ---
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    // --- Assert ---
    expect(mockNavigate).toHaveBeenCalledWith(0);
  });
});
