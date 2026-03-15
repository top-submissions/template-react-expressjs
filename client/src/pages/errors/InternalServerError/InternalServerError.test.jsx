import { render, screen } from '../../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { useRouteError } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InternalServerError from './InternalServerError';

describe('InternalServerError Component', () => {
  beforeEach(() => {
    // Reset navigation and error mocks
    vi.clearAllMocks();
  });

  it('should render the 500 status and generic error message', () => {
    // --- Arrange ---
    // Simulate a critical error object caught by the router
    vi.mocked(useRouteError).mockReturnValue(
      new Error('Critical System Failure')
    );

    // --- Act ---
    render(<InternalServerError />);

    // --- Assert ---
    const code = screen.getByText('500');
    const title = screen.getByText(/something went wrong/i);

    expect(code).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it('should attempt to reload the application when clicking refresh', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    vi.mocked(useRouteError).mockReturnValue({});

    // Track page redirection calls
    const assignMock = vi.fn();
    vi.stubGlobal('location', { assign: assignMock });

    render(<InternalServerError />);

    // --- Act ---
    const refreshBtn = screen.getByRole('button', { name: /try refreshing/i });
    await user.click(refreshBtn);

    // --- Assert ---
    expect(assignMock).toHaveBeenCalledWith('/');
  });
});
