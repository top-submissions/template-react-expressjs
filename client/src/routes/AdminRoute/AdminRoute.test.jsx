import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import AdminRoute from './AdminRoute';
import { render } from '../../__tests__/test-utils';

// Local mock for the error page to simplify assertions
vi.mock('../../pages/errors/ForbiddenError/ForbiddenError', () => ({
  default: () => <div data-testid="forbidden">Forbidden Access</div>,
}));

describe('AdminRoute Component', () => {
  it('should render children when user has ADMIN role', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'ADMIN' },
      loading: false,
    });

    // --- Act ---
    render(
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
    );

    // --- Assert ---
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should allow SUPER_ADMIN access to Admin routes', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'SUPER_ADMIN' },
      loading: false,
    });

    // --- Act ---
    render(
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
    );

    // --- Assert ---
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should show ForbiddenError when user is a standard USER', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({
      user: { role: 'USER' },
      loading: false,
    });

    // --- Act ---
    render(
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
    );

    // --- Assert ---
    expect(screen.getByTestId('forbidden')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });

  it('should render nothing during the loading state', () => {
    // --- Arrange ---
    vi.mocked(useAuth).mockReturnValue({ user: null, loading: true });

    // --- Act ---
    const { container } = render(
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
    );

    // --- Assert ---
    expect(container.firstChild).toBeNull();
  });
});
