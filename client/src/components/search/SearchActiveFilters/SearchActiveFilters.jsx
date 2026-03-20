import { X } from 'lucide-react';
import { sectionConfig } from '../../../config/searchConfig';
import SearchViewSelector from '../SearchViewSelector/SearchViewSelector';
import styles from './SearchActiveFilters.module.css';

/**
 * Strip below SearchControls showing applied sorts, filters, and the view selector.
 * - Sort chips appear on the left; filter chips in the middle.
 * - SearchViewSelector is pinned to the right.
 * - Always renders (view selector is always visible).
 * @param {Object} props
 * @param {string} props.activeSection - Current section key.
 * @param {Object} props.activeFilters - Current filter key/value state.
 * @param {Object|null} props.activeSort - Current sort { key, dir } or null.
 * @param {string} props.activeView - Current view mode key.
 * @param {function} props.onFiltersChange - Called with updated filters.
 * @param {function} props.onSortChange - Called with updated sort or null.
 * @param {function} props.onViewChange - Called with new view key.
 * @returns {JSX.Element}
 */
const SearchActiveFilters = ({
  activeSection,
  activeFilters,
  activeSort,
  activeView,
  onFiltersChange,
  onSortChange,
  onViewChange,
}) => {
  const cfg = sectionConfig[activeSection];
  const activeFilterEntries = Object.entries(activeFilters).filter(
    ([, v]) => v
  );

  const getSortLabel = () => {
    const def = cfg.sorts.find((s) => s.key === activeSort?.key);
    return def ? `${def.label} ${activeSort.dir === 'asc' ? '↑' : '↓'}` : null;
  };

  const getFilterLabel = (key) =>
    cfg.filters.find((f) => f.key === key)?.label ?? key;

  const removeFilter = (key) =>
    onFiltersChange({ ...activeFilters, [key]: '' });

  const hasChips = activeSort || activeFilterEntries.length > 0;

  return (
    <div className={styles.strip}>
      {/* Left: sort + filter chips */}
      <div className={styles.chips}>
        {activeSort && (
          <span className={`${styles.chip} ${styles.sortChip}`}>
            {getSortLabel()}
            <button
              className={styles.removeBtn}
              onClick={() => onSortChange(null)}
              aria-label="Remove sort"
            >
              <X size={10} />
            </button>
          </span>
        )}

        {activeSort && activeFilterEntries.length > 0 && (
          <span className={styles.divider} />
        )}

        {activeFilterEntries.map(([key, value]) => (
          <span key={key} className={`${styles.chip} ${styles.filterChip}`}>
            <span className={styles.chipKey}>{getFilterLabel(key)}:</span>
            <span className={styles.chipValue}>{value}</span>
            <button
              className={styles.removeBtn}
              onClick={() => removeFilter(key)}
              aria-label={`Remove ${getFilterLabel(key)} filter`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>

      {/* Right: view selector — always visible */}
      <SearchViewSelector activeView={activeView} onViewChange={onViewChange} />
    </div>
  );
};

export default SearchActiveFilters;
