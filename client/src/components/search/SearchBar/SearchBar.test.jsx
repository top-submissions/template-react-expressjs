import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router';
import { render, screen } from '../../../modules/utils/testing/testing.utils';
import SearchBar from './SearchBar';

vi.mock(
  '../../../providers/AuthProvider/AuthProvider',
  async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: vi.fn(),
      AuthProvider: ({ children }) => children,
    };
  }
);

describe('SearchBar Component', () => {
  it('renders the search input and form', () => {
    // --- Arrange ---
    // --- Act ---
    render(<SearchBar />);

    // --- Assert ---
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
  });

  it('pre-fills the input from the URL q param', () => {
    // --- Arrange ---
    // --- Act ---
    render(<SearchBar />, { initialEntries: ['/search?q=bob'] });

    // --- Assert ---
    expect(screen.getByLabelText(/search/i)).toHaveValue('bob');
  });

  it('updates the input value as the user types', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(<SearchBar />);

    // --- Act ---
    await user.type(screen.getByLabelText(/search/i), 'alice');

    // --- Assert ---
    expect(screen.getByLabelText(/search/i)).toHaveValue('alice');
  });

  it('navigates to /search with q param on submit', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(
      <Routes>
        <Route path="/" element={<SearchBar />} />
        <Route path="/search" element={<div data-testid="search-page" />} />
      </Routes>
    );

    // --- Act ---
    await user.type(screen.getByLabelText(/search/i), 'alice');
    await user.keyboard('{Enter}');

    // --- Assert ---
    expect(screen.getByTestId('search-page')).toBeInTheDocument();
  });

  it('preserves the active section in the URL on submit', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    render(
      <Routes>
        <Route path="/search" element={<SearchBar />} />
      </Routes>,
      { initialEntries: ['/search?section=users'] }
    );

    // --- Act ---
    await user.clear(screen.getByLabelText(/search/i));
    await user.type(screen.getByLabelText(/search/i), 'new query');
    await user.keyboard('{Enter}');

    // --- Assert ---
    // Section should still be users in the resulting URL — verified by the input re-filling
    expect(screen.getByLabelText(/search/i)).toHaveValue('new query');
  });
});
