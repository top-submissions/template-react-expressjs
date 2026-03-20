import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../modules/utils/testing/testing.utils';
import SearchActiveFilters from './SearchActiveFilters';

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

describe('SearchActiveFilters Component', () => {
  const baseProps = {
    activeSection: 'users',
    activeFilters: { role: '', joinedAfter: '', joinedBefore: '' },
    activeSort: null,
    activeView: 'table',
    onFiltersChange: vi.fn(),
    onSortChange: vi.fn(),
    onViewChange: vi.fn(),
  };

  it('always renders the view selector', () => {
    // --- Arrange ---
    // --- Act ---
    render(<SearchActiveFilters {...baseProps} />);

    // --- Assert ---
    expect(
      screen.getByRole('group', { name: /view mode/i })
    ).toBeInTheDocument();
  });

  it('renders nothing in the chip area when no filters or sort are active', () => {
    // --- Arrange ---
    // --- Act ---
    render(<SearchActiveFilters {...baseProps} />);

    // --- Assert ---
    expect(screen.queryByLabelText(/remove sort/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /remove.*filter/i })
    ).not.toBeInTheDocument();
  });

  it('renders a sort chip when activeSort is set', () => {
    // --- Arrange ---
    // --- Act ---
    render(
      <SearchActiveFilters
        {...baseProps}
        activeSort={{ key: 'createdAt', dir: 'desc' }}
      />
    );

    // --- Assert ---
    expect(screen.getByText(/date joined/i)).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('renders a filter chip for each active filter', () => {
    // --- Arrange ---
    // --- Act ---
    render(
      <SearchActiveFilters
        {...baseProps}
        activeFilters={{ role: 'ADMIN', joinedAfter: '', joinedBefore: '' }}
      />
    );

    // --- Assert ---
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('calls onSortChange with null when the sort chip X is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    // --- Act ---
    render(
      <SearchActiveFilters
        {...baseProps}
        activeSort={{ key: 'createdAt', dir: 'desc' }}
        onSortChange={onSortChange}
      />
    );
    await user.click(screen.getByLabelText(/remove sort/i));

    // --- Assert ---
    expect(onSortChange).toHaveBeenCalledWith(null);
  });

  it('calls onFiltersChange with the filter cleared when a filter chip X is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    // --- Act ---
    render(
      <SearchActiveFilters
        {...baseProps}
        activeFilters={{ role: 'ADMIN', joinedAfter: '', joinedBefore: '' }}
        onFiltersChange={onFiltersChange}
      />
    );
    await user.click(screen.getByLabelText(/remove role filter/i));

    // --- Assert ---
    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({ role: '' })
    );
  });

  it('calls onViewChange when a view button is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onViewChange = vi.fn();

    // --- Act ---
    render(<SearchActiveFilters {...baseProps} onViewChange={onViewChange} />);
    await user.click(screen.getByLabelText(/table view/i));

    // --- Assert ---
    expect(onViewChange).toHaveBeenCalledWith('table');
  });
});
