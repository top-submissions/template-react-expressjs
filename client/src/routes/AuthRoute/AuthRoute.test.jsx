import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import AuthRoute from './AuthRoute';
import { render } from '../../__tests__/test-utils';

describe('AuthRoute Component', () => {
  it('should render children when user is authenticated', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({
      user: { username: 'testuser' },
      loading: false,
    });

    // --- Act ---
    render(
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    );

    // --- Assert ---
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is unauthenticated', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: false });

    // --- Act ---
    render(
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/log-in" element={<div>Login Page</div>} />
      </Routes>
    );

    // --- Assert ---
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render nothing while loading session status', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: true });

    // --- Act ---
    const { container } = render(
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    );

    // --- Assert ---
    expect(container.firstChild).toBeNull();
  });
});
