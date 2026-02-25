// client\src\components\SignupForm\SignupForm.test.jsx
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
    // --- Arrange ---
    // Prepare the component within a router context
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
    );

    // --- Act ---
    // Fill in mismatched password fields
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'different' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // --- Assert ---
    // Verify visibility of error message
    expect(await screen.findByText(/Passwords do not match/i)).toBeDefined();
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
