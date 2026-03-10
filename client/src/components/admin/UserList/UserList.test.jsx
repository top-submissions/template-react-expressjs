import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import UserList from './UserList';

// Mock the specific path used in the component import to intercept the render
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
    // Wrap in MemoryRouter to satisfy any internal routing hooks if the mock fails
    render(
      <MemoryRouter>
        <UserList users={mockUsers} />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText(/user/i)).toBeInTheDocument();

    // Verify rows rendered based on mock component
    const rows = screen.getAllByTestId('mock-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('alice')).toBeInTheDocument();
  });
});
