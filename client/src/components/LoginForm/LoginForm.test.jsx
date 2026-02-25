import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import LoginForm from './LoginForm';

/**
 * Integration tests for LoginForm.
 * * Verifies input state synchronization.
 * * Validates form submission handling.
 */
describe('LoginForm', () => {
  it('updates input values on change', () => {
    // --- Arrange ---
    // Render component within router
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    // --- Act ---
    // Locate and type into username field
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'john_doe' } });

    // --- Assert ---
    // Ensure value is reflected in input
    expect(usernameInput.value).toBe('john_doe');
  });

  it('displays error message for invalid login attempt', async () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    // --- Act ---
    // Submit without filling fields to trigger validation
    fireEvent.click(screen.getByRole('button', { name: /Enter/i }));

    // --- Assert ---
    // Expect error message based on Zod schema defaults
    const errorMsg = await screen.findByText(/Username is required/i);
    expect(errorMsg).toBeDefined();
  });
});
