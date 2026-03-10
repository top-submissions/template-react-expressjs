import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import AdminDashboard from './AdminDashboard';

// Mock AuthProvider to simulate different administrative roles
vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('AdminDashboard Component', () => {
  it('renders a personalized welcome message for the admin', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({
      user: { username: 'Admin_Alpha', role: 'ADMIN' },
    });

    // --- Act ---
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // --- Assert ---
    // Verify the header displays the correct username
    expect(screen.getByText(/welcome back, admin_alpha/i)).toBeInTheDocument();
  });

  it('renders the core administrative links', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { username: 'admin', role: 'ADMIN' } });

    // --- Act ---
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // --- Assert ---
    // Check for the presence of the User Management and Logs links
    expect(
      screen.getByRole('link', { name: /user management/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /system logs/i })
    ).toBeInTheDocument();
  });

  it('applies standard styles for regular admin users', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { username: 'admin', role: 'ADMIN' } });

    // --- Act ---
    const { container } = render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // --- Assert ---
    // Verify that the critical (red/danger) style is not applied to the settings card
    const settingsCard = container.querySelector(
      'a[href="/admin-dashboard/settings"]'
    );
    expect(settingsCard).not.toHaveClass(/criticalCard/);
  });
});
