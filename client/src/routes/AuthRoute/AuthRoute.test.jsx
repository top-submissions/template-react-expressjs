import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import AuthRoute from './AuthRoute';

// Mock the useAuth hook to control user state
vi.mock('../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('AuthRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user is authenticated', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { username: 'testuser' }, loading: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // --- Act & Assert ---
    // Verify protected content is visible
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is unauthenticated', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/log-in" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // --- Act & Assert ---
    // Verify user was bounced to login
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render nothing while loading session status', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: null, loading: true });

    // --- Act ---
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // --- Assert ---
    // Ensure no content is rendered during loading
    expect(container.firstChild).toBeNull();
  });
});
