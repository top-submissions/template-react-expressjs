import { describe, it, expect, vi } from 'vitest';
// Use centralized testing utility
import { render, screen } from '../../../modules/utils/testing/testing.utils';
import UserList from './UserList';

// Mock child component to isolate list rendering logic
vi.mock('../UserRow/UserRow', () => ({
  default: ({ user }) => (
    <tr data-testid="mock-row">
      <td>{user.username}</td>
    </tr>
  ),
}));

/**
 * Unit tests for the UserList component.
 * - Validates tabular data rendering.
 * - Checks empty state handling.
 */
describe('UserList Component', () => {
  it('renders an empty state when no users are provided', () => {
    // --- Arrange ---
    // Prepare empty dataset
    const users = [];

    // --- Act ---
    render(<UserList users={users} />);

    // --- Assert ---
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('renders the correct number of UserRow components', () => {
    // --- Arrange ---
    // Define mock user data
    const mockUsers = [
      { id: '1', username: 'alice' },
      { id: '2', username: 'bob' },
    ];

    // --- Act ---
    render(<UserList users={mockUsers} />);

    // --- Assert ---
    // Verify table structure exists
    expect(screen.getByText(/user/i)).toBeInTheDocument();

    // Check row count against input data
    const rows = screen.getAllByTestId('mock-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
  });
});