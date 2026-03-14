import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import UserRow from './UserRow';

describe('UserRow Component', () => {
  const mockUser = {
    id: '123',
    username: 'jdoe',
    role: 'USER',
    createdAt: '2023-01-01T00:00:00Z',
  };

  it('renders user details correctly', () => {
    // --- Arrange ---
    // Set specific auth state for this test
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
    useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    // Mock specific fetch response for this test
    fetch.mockResolvedValueOnce({ ok: true });

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
    await user.click(screen.getByText(/promote to admin/i));

    // --- Assert ---
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/admin/users/${mockUser.id}/promote`),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
      })
    );
    // Reload mock is now provided globally by setup.js
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('calls the demote API when a Super Admin clicks demote on an Admin', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const adminUser = { ...mockUser, role: 'ADMIN' };
    useAuth.mockReturnValue({ user: { role: 'SUPER_ADMIN' } });
    fetch.mockResolvedValueOnce({ ok: true });

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
    expect(screen.queryByText(/demote to user/i)).not.toBeInTheDocument();
  });
});
