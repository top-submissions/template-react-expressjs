import { render, screen, fireEvent } from '@testing-library/react';
import { useRouteError } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ServerError from './ServerError';

// Mock react-router to simulate a component crash
vi.mock('react-router', () => ({
  useRouteError: vi.fn(),
}));

describe('ServerError Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the 500 status and generic error message', () => {
    // --- Arrange ---
    useRouteError.mockReturnValue(new Error('Critical System Failure'));

    render(<ServerError />);

    // --- Act ---
    const code = screen.getByText('500');
    const title = screen.getByText(/something went wrong/i);

    // --- Assert ---
    expect(code).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it('should attempt to reload the application when clicking refresh', () => {
    // --- Arrange ---
    useRouteError.mockReturnValue({});
    // Mock window.location.assign to track redirects
    const assignMock = vi.fn();
    vi.stubGlobal('location', { assign: assignMock });

    render(<ServerError />);

    // --- Act ---
    const refreshBtn = screen.getByRole('button', { name: /try refreshing/i });
    fireEvent.click(refreshBtn);

    // --- Assert ---
    expect(assignMock).toHaveBeenCalledWith('/');
  });
});
