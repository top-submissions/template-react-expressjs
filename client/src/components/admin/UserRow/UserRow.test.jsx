import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import { render, screen } from '../../../modules/utils/testing/testing.utils';
import UserRow from './UserRow';

vi.mock('../../../providers/AuthProvider/AuthProvider', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

/**
 * Unit tests for the UserRow component.
 * - Verifies conditional rendering of admin actions.
 * - Validates API interaction with confirmation and delays.
 */
describe('UserRow Component', () => {
  const mockUser = {
    id: '123',
    username: 'jdoe',
    role: 'USER',
    createdAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm to always return true
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    // Mock timers for the reload delay
    vi.useFakeTimers();
  });

  it('renders user details correctly', () => {
    // --- Arrange ---
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

  it('calls the promote API with confirmation and reloads after delay', async () => {
    // --- Arrange ---
    const user = userEvent.setup({ delay: null });
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    fetch.mockResolvedValueOnce({ ok: true });
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    // --- Act ---
    render(
      <table>
        <tbody>
          <UserRow user={mockUser} />
        </tbody>
      </table>
    );
    await user.click(screen.getByLabelText(/open actions menu/i));
    await user.click(screen.getByText(/promote to admin/i));

    // --- Assert ---
    expect(window.confirm).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/promote/${mockUser.id}`),
      expect.objectContaining({ method: 'POST' })
    );
    // Advance Timers To Trigger Reload
    vi.advanceTimersByTime(1500);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('calls the demote API with confirmation and reloads after delay', async () => {
    // --- Arrange ---
    const user = userEvent.setup({ delay: null });
    const adminTarget = { ...mockUser, role: 'ADMIN' };
    vi.mocked(useAuth).mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    fetch.mockResolvedValueOnce({ ok: true });
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    // --- Act ---
    render(
      <table>
        <tbody>
          <UserRow user={adminTarget} />
        </tbody>
      </table>
    );
    await user.click(screen.getByLabelText(/open actions menu/i));
    await user.click(screen.getByText(/demote to user/i));

    // --- Assert ---
    expect(window.confirm).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/demote/${adminTarget.id}`),
      expect.objectContaining({ method: 'POST' })
    );
    // Advance Timers To Trigger Reload
    vi.advanceTimersByTime(1500);
    expect(reloadSpy).toHaveBeenCalled();
  });
});