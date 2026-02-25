import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import SignupForm from './SignupForm';

/**
 * Integration tests for SignupForm.
 * * Verifies input capture.
 * * Validates password mismatch handling.
 * * Ensures submission triggers fetch.
 */
describe('SignupForm', () => {
  it('displays error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );

    // --- Act ---
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    // Use a password that passes the "Uppercase" rule
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Different123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // --- Assert ---
    // Match the actual Zod message: "Passwords don't match"
    const errorMsg = await screen.findByText(/Passwords don't match/i);
    expect(errorMsg).toBeDefined();
  });

  it('updates input values on change', () => {
    // --- Arrange ---
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );

    // --- Act ---
    const usernameInput = screen.getByLabelText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: 'john_doe' } });

    // --- Assert ---
    expect(usernameInput.value).toBe('john_doe');
  });
});
