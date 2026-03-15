import { render, screen } from '../../__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import UserList from './UserList';

// Mock child component to isolate list rendering logic
vi.mock('../UserRow/UserRow', () => ({
  default: ({ user }) => (
    <tr data-testid="mock-row">
      <td>{user.username}</td>
    </tr>
  ),
}));

describe('UserList Component', () => {
  it('renders an empty state when no users are provided', () => {
    // --- Arrange ---
    const users = [];

    // --- Act ---
    render(<UserList users={users} />);

    // --- Assert ---
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('renders the correct number of UserRow components', () => {
    // --- Arrange ---
    const mockUsers = [
      { id: '1', username: 'alice' },
      { id: '2', username: 'bob' },
    ];

    // --- Act ---
    // MemoryRouter is provided by test-utils render wrapper
    render(<UserList users={mockUsers} />);

    // --- Assert ---
    expect(screen.getByText(/user/i)).toBeInTheDocument();

    // Verify row count matches input data
    const rows = screen.getAllByTestId('mock-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('alice')).toBeInTheDocument();
  });
});
