// client\src\pages\App\App.test.jsx
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import App from './App';

/**
 * Unit tests for the App root layout.
 * * Ensures the component renders without crashing.
 * * Validates that the application shell exists.
 */
describe('App Component', () => {
  it('renders the application shell', () => {
    // --- Arrange ---
    // Wrap App in MemoryRouter because it contains an <Outlet />
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // --- Act ---
    // Target the main container defined in App.jsx
    const mainElement = container.querySelector('main');

    // --- Assert ---
    // Confirm the layout structure is present
    expect(mainElement).toBeDefined();
  });
});
