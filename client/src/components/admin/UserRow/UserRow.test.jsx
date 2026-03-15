import { render, screen } from '../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import UserRow from './UserRow';

describe('UserRow Component', () => {
  const mockUser = {
    id: '123',
    username: 'jdoe',
    role: 'USER',
    createdAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user details correctly', () => {
    // --- Arrange ---
    // Use local mock for useAuth to control role per test
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'ADMIN' } });

    // --- Act ---
    render(
      <table>
        <tbody>
          <UserRow user={mockUser} />
        </tbody>
      </table>
    );

    // --- Assert ---
    expect(screen.getByText('jdoe')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
  });

  it('toggles the actions menu when the trigger is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'ADMIN' } });

    render(
      <table>
        <tbody>
          <UserRow user={mockUser} />
        </tbody>
      </table>
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
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'ADMIN' } });

    render(
      <table>
        <tbody>
          <UserRow user={targetAdmin} />
        </tbody>
      </table>
    );

    // --- Act ---
    await user.click(screen.getByLabelText(/open actions menu/i));

    // --- Assert ---
    expect(screen.queryByText(/promote to admin/i)).not.toBeInTheDocument();
  });

  it('calls the promote API when the promote button is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <table>
        <tbody>
          <UserRow user={mockUser} />
        </tbody>
      </table>
    );

    // --- Act ---
    await user.click(screen.getByLabelText(/open actions menu/i));
    await user.click(screen.getByText(/promote to admin/i));

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/users/${mockUser.id}/promote`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('calls the demote API when a Super Admin clicks demote on an Admin', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const adminUser = { ...mockUser, role: 'ADMIN' };
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <table>
        <tbody>
          <UserRow user={adminUser} />
        </tbody>
      </table>
    );

    // --- Act ---
    await user.click(screen.getByLabelText(/open actions menu/i));
    await user.click(screen.getByText(/demote to user/i));

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/users/${adminUser.id}/demote`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('hides demote option when a Super Admin views a regular User', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'SUPER_ADMIN' } });

    render(
      <table>
        <tbody>
          <UserRow user={mockUser} />
        </tbody>
      </table>
    );

    // --- Act ---
    await user.click(screen.getByLabelText(/open actions menu/i));

    // --- Assert ---
    expect(screen.queryByText(/demote to user/i)).not.toBeInTheDocument();
  });
});
