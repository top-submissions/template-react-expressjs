import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from '../../../providers/AuthProvider/AuthProvider';
import UserDashboard from './UserDashboard';

describe('UserDashboard Component', () => {
  it('renders a personalized greeting with the username', () => {
    // --- Arrange ---
    const mockUser = { username: 'testuser123', role: 'USER' };
    vi.mocked(useAuth).mockReturnValue({ user: mockUser });

    // --- Act ---
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    // --- Assert ---
    expect(screen.getByText(/welcome back, testuser123!/i)).toBeInTheDocument();
  });
});
