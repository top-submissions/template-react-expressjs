import { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import SearchFilterPanel from '../SearchFilterPanel/SearchFilterPanel';
import SearchSortPanel from '../SearchSortPanel/SearchSortPanel';
import styles from './SearchControls.module.css';

/**
 * Toolbar above search results.
 * - Filter and Sort buttons toggle their respective panels.
 * - Buttons highlight when active filters or sorts are applied.
 * @param {Object} props
 * @param {Object} props.sectionCfg - Config for the active section.
 * @param {Object} props.activeFilters - Currently applied filter key/value pairs.
 * @param {Object|null} props.activeSort - Current sort { key, dir } or null.
 * @param {function} props.onFiltersChange - Called with updated filters object.
 * @param {function} props.onSortChange - Called with updated sort or null.
 * @returns {JSX.Element}
 */
const SearchControls = ({
  sectionCfg,
  activeFilters,
  activeSort,
  onFiltersChange,
  onSortChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className={styles.controls}>
      <div className={styles.buttonGroup}>
        <div className={styles.popoverWrapper}>
          <button
            className={`${styles.controlBtn} ${hasActiveFilters ? styles.active : ''}`}
            onClick={() => {
              setShowFilters(!showFilters);
              setShowSort(false);
            }}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className={styles.badge}>{activeFilterCount}</span>
            )}
          </button>

          {showFilters && (
            <SearchFilterPanel
              filters={sectionCfg.filters}
              activeFilters={activeFilters}
              onChange={onFiltersChange}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

        <div className={styles.popoverWrapper}>
          <button
            className={`${styles.controlBtn} ${activeSort ? styles.active : ''}`}
            onClick={() => {
              setShowSort(!showSort);
              setShowFilters(false);
            }}
            aria-label="Toggle sort"
          >
            <ArrowUpDown size={14} />
            <span>Sort</span>
          </button>

          {showSort && (
            <SearchSortPanel
              sorts={sectionCfg.sorts}
              activeSort={activeSort}
              onChange={onSortChange}
              onClose={() => setShowSort(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchControls;
