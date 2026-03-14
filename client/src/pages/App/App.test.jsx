import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';

// Mock auth hook to control lifecycle states
vi.mock('../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

/**
 * Unit tests for the App root layout.
 */
describe('App Component', () => {
  it('renders a loading state when initializing', () => {
    // Arrange
    useAuth.mockReturnValue({ loading: true });

    // Act
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Assert
    // Verify status role from the Spinner component
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Verify specific initialization text
    expect(screen.getByText(/Initializing session.../i)).toBeInTheDocument();
  });

  it('renders the application shell after loading', () => {
    // Arrange
    useAuth.mockReturnValue({ loading: false });

    // Act
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Assert
    const mainElement = container.querySelector('main');
    // Ensure main element exists
    expect(mainElement).toBeDefined();
    // Verify application of global layout class
    expect(mainElement).toHaveClass('container');
  });
});
