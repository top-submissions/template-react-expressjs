import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import UserRow from './UserRow';

// Mock AuthProvider to test permission-based UI rendering
vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('UserRow Component', () => {
  const mockUser = {
    id: '123',
    username: 'jdoe',
    role: 'USER',
    createdAt: '2023-01-01T00:00:00Z',
  };

  it('renders user details correctly', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { role: 'ADMIN' } });

    // --- Act ---
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={mockUser} />
          </tbody>
        </table>
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText('jdoe')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('toggles the actions menu when the trigger is clicked', () => {
    // --- Arrange ---
    useAuth.mockReturnValue({ user: { role: 'ADMIN' } });
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={mockUser} />
          </tbody>
        </table>
      </MemoryRouter>
    );

    // --- Act ---
    const trigger = screen.getByLabelText(/open actions menu/i);
    fireEvent.click(trigger);

    // --- Assert ---
    expect(screen.getByText(/view profile/i)).toBeInTheDocument();
  });

  it('hides the promote option if the current admin lacks clearance', () => {
    // --- Arrange ---
    // A standard admin cannot promote another admin
    const targetAdmin = { ...mockUser, role: 'ADMIN' };
    useAuth.mockReturnValue({ user: { role: 'ADMIN' } });

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={targetAdmin} />
          </tbody>
        </table>
      </MemoryRouter>
    );

    // --- Act ---
    fireEvent.click(screen.getByLabelText(/open actions menu/i));

    // --- Assert ---
    expect(screen.queryByText(/promote to admin/i)).not.toBeInTheDocument();
  });
});
