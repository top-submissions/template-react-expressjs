import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../../modules/utils/testing/testing.utils';
import SearchSortPanel from './SearchSortPanel';
import { sectionConfig } from '../../../config/searchConfig';

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

describe('SearchSortPanel Component', () => {
  const baseProps = {
    sorts: sectionConfig.users.sorts,
    activeSort: null,
    onChange: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders all sort property options', () => {
    // --- Arrange ---
    // --- Act ---
    render(<SearchSortPanel {...baseProps} />);

    // --- Assert ---
    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/date joined/i)).toBeInTheDocument();
    expect(screen.getByText(/last login/i)).toBeInTheDocument();
  });

  it('calls onChange with the selected key and default desc direction on property click', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onChange = vi.fn();

    // --- Act ---
    render(<SearchSortPanel {...baseProps} onChange={onChange} />);
    await user.click(screen.getByText(/date joined/i));

    // --- Assert ---
    expect(onChange).toHaveBeenCalledWith({ key: 'createdAt', dir: 'desc' });
  });

  it('shows Ascending and Descending buttons when a sort is active', () => {
    // --- Arrange ---
    // --- Act ---
    render(
      <SearchSortPanel
        {...baseProps}
        activeSort={{ key: 'createdAt', dir: 'desc' }}
      />
    );

    // --- Assert ---
    expect(screen.getByLabelText(/sort ascending/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort descending/i)).toBeInTheDocument();
  });

  it('calls onChange with asc direction when Ascending is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onChange = vi.fn();

    // --- Act ---
    render(
      <SearchSortPanel
        {...baseProps}
        activeSort={{ key: 'createdAt', dir: 'desc' }}
        onChange={onChange}
      />
    );
    await user.click(screen.getByLabelText(/sort ascending/i));

    // --- Assert ---
    expect(onChange).toHaveBeenCalledWith({ key: 'createdAt', dir: 'asc' });
  });

  it('calls onChange with desc direction when Descending is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onChange = vi.fn();

    // --- Act ---
    render(
      <SearchSortPanel
        {...baseProps}
        activeSort={{ key: 'createdAt', dir: 'asc' }}
        onChange={onChange}
      />
    );
    await user.click(screen.getByLabelText(/sort descending/i));

    // --- Assert ---
    expect(onChange).toHaveBeenCalledWith({ key: 'createdAt', dir: 'desc' });
  });

  it('calls onChange with null and onClose when Clear is clicked', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClose = vi.fn();

    // --- Act ---
    render(
      <SearchSortPanel
        {...baseProps}
        activeSort={{ key: 'username', dir: 'asc' }}
        onChange={onChange}
        onClose={onClose}
      />
    );
    await user.click(screen.getByText(/clear/i));

    // --- Assert ---
    expect(onChange).toHaveBeenCalledWith(null);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Done is clicked without clearing the sort', async () => {
    // --- Arrange ---
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClose = vi.fn();

    // --- Act ---
    render(
      <SearchSortPanel
        {...baseProps}
        activeSort={{ key: 'username', dir: 'desc' }}
        onChange={onChange}
        onClose={onClose}
      />
    );
    await user.click(screen.getByRole('button', { name: /done/i }));

    // --- Assert ---
    expect(onClose).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
