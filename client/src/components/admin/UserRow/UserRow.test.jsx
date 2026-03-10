import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  beforeEach(() => {
    // Reset global fetch mock before every test
    global.fetch = vi.fn();
    // Clear all mock history
    vi.clearAllMocks();
  });

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

  it('toggles the actions menu when the trigger is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
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
    await user.click(trigger);

    // --- Assert ---
    expect(screen.getByText(/view profile/i)).toBeInTheDocument();
  });

  it('hides the promote option if the current admin lacks clearance', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
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
    await user.click(screen.getByLabelText(/open actions menu/i));

    // --- Assert ---
    expect(screen.queryByText(/promote to admin/i)).not.toBeInTheDocument();
  });

  it('calls the promote API when the promote button is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    // Allow promotion by mocking a SUPER_ADMIN user
    useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    // Simulate a successful API response
    fetch.mockResolvedValueOnce({ ok: true });
    // Prevent window reload from crashing the test environment
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

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
    // Open the dropdown menu
    await user.click(screen.getByLabelText(/open actions menu/i));
    // Click the promotion button
    await user.click(screen.getByText(/promote to admin/i));

    // --- Assert ---
    // Confirm the API endpoint and method are correct
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/users/${mockUser.id}/promote`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    // Verify the UI triggers a refresh on success
    expect(reloadMock).toHaveBeenCalled();
  });

  it('calls the demote API when a Super Admin clicks demote on an Admin', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const adminUser = { ...mockUser, role: 'ADMIN' };
    useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    fetch.mockResolvedValueOnce({ ok: true });

    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UserRow user={adminUser} />
          </tbody>
        </table>
      </MemoryRouter>
    );

    // --- Act ---
    // Trigger menu and click demote
    await user.click(screen.getByLabelText(/open actions menu/i));
    await user.click(screen.getByText(/demote to user/i));

    // --- Assert ---
    // Verify demote endpoint is hit with correct method and credentials
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/users/${adminUser.id}/demote`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    expect(reloadMock).toHaveBeenCalled();
  });

  it('hides demote option when a Super Admin views a regular User', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } });

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
    await user.click(screen.getByLabelText(/open actions menu/i));

    // --- Assert ---
    // Super Admins can only demote Admins, not regular Users
    expect(screen.queryByText(/demote to user/i)).not.toBeInTheDocument();
  });
});
