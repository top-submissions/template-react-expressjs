import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import App from './App';

describe('App Component', () => {
  it('renders a loading state when initializing', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ loading: true });

    // --- Act ---
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Initializing session.../i)).toBeInTheDocument();
  });

  it('renders the application shell after loading', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ loading: false });

    // --- Act ---
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // --- Assert ---
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('container');
  });
});
