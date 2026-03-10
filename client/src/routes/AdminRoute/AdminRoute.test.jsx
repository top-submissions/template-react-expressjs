import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../providers/AuthProvider/AuthProvider';
import AdminRoute from './AdminRoute';

// Mock Auth context
vi.mock('../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

// Mock ForbiddenError to simplify DOM assertions
vi.mock('../../pages/errors/ForbiddenError/ForbiddenError', () => ({
  default: () => <div data-testid="forbidden">Forbidden Access</div>,
}));

describe('AdminRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user has ADMIN role', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { role: 'ADMIN' }, loading: false });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // --- Act & Assert ---
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should allow SUPER_ADMIN access to Admin routes', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' }, loading: false });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // --- Act & Assert ---
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should show ForbiddenError when user is a standard USER', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { role: 'USER' }, loading: false });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // --- Act & Assert ---
    expect(screen.getByTestId('forbidden')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });

  it('should render nothing during the loading state', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: null, loading: true });

    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // --- Act & Assert ---
    expect(container.firstChild).toBeNull();
  });
});
