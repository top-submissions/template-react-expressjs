import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserList from './UserList';

// Mock UserRow to isolate List testing from individual row behavior
vi.mock('./UserRow', () => ({
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
    render(<UserList users={mockUsers} />);

    // --- Assert ---
    // Verify headers exist
    expect(screen.getByText(/user/i)).toBeInTheDocument();
    // Verify rows rendered based on array length
    const rows = screen.getAllByTestId('mock-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('alice')).toBeInTheDocument();
  });
});
