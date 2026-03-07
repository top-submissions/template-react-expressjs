import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import LoginForm from './LoginForm';

/**
 * Integration tests for LoginForm.
 * * Verifies input state synchronization via userEvent.
 * * Validates form submission error rendering.
 */
describe('LoginForm', () => {
  it('updates input values on change', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // --- Act ---
    const usernameInput = screen.getByLabelText(/Username/i);
    await user.type(usernameInput, 'john_doe');

    // --- Assert ---
    expect(usernameInput).toHaveValue('john_doe');
  });

  it('displays error message for invalid login attempt', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // --- Act ---
    // Clicking the button now triggers handleSubmit because noValidate is set
    const submitBtn = screen.getByRole('button', { name: /Enter/i });
    await user.click(submitBtn);

    // --- Assert ---
    // Verify the specific Zod error message appears in the DOM
    const errorMsg = await screen.findByText(/Username is required/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
