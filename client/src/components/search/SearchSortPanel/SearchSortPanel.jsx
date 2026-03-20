import { ArrowDown, ArrowUp } from 'lucide-react';
import styles from './SearchSortPanel.module.css';

/**
 * Popover panel for selecting sort field and direction.
 * - Click a property to select it (defaults to descending).
 * - Ascending / Descending buttons appear inline for the active sort.
 * - Done button closes the panel; Clear removes the sort and closes.
 * @param {Object} props
 * @param {Array} props.sorts - Sort definitions from sectionConfig.
 * @param {Object|null} props.activeSort - Current sort { key, dir } or null.
 * @param {function} props.onChange - Called with new sort { key, dir } or null.
 * @param {function} props.onClose - Called when the panel should close.
 * @returns {JSX.Element}
 */
const SearchSortPanel = ({ sorts, activeSort, onChange, onClose }) => {
  const handleSelect = (key) => {
    // If a new property is selected, default to descending
    if (activeSort?.key !== key) {
      onChange({ key, dir: 'desc' });
    }
    // Stay open so user can pick direction
  };

  const handleDirChange = (dir) => {
    if (activeSort) onChange({ ...activeSort, dir });
  };

  const handleClear = () => {
    onChange(null);
    onClose();
  };

  return (
    <div className={`${styles.panel} animate-slide-up`}>
      <div className={styles.header}>
        <span className={styles.title}>Sort by</span>
        {activeSort && (
          <button className={styles.clearBtn} onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      <div className={styles.options}>
        {sorts.map((sort) => {
          const isActive = activeSort?.key === sort.key;
          return (
            <div key={sort.key} className={styles.sortRow}>
              <button
                className={`${styles.option} ${isActive ? styles.activeOption : ''}`}
                onClick={() => handleSelect(sort.key)}
              >
                {sort.label}
              </button>

              {isActive && (
                <div className={styles.dirButtons}>
                  <button
                    className={`${styles.dirBtn} ${activeSort.dir === 'asc' ? styles.dirActive : ''}`}
                    onClick={() => handleDirChange('asc')}
                    aria-label="Sort ascending"
                  >
                    <ArrowUp size={11} />
                    <span>Ascending</span>
                  </button>
                  <button
                    className={`${styles.dirBtn} ${activeSort.dir === 'desc' ? styles.dirActive : ''}`}
                    onClick={() => handleDirChange('desc')}
                    aria-label="Sort descending"
                  >
                    <ArrowDown size={11} />
                    <span>Descending</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Done closes the panel without clearing the sort */}
      <button className={styles.doneBtn} onClick={onClose}>
        Done
      </button>
    </div>
  );
};

export default SearchSortPanel;
