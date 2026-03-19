import { ArrowDown, ArrowUp } from 'lucide-react';
import styles from './SearchSortPanel.module.css';

/**
 * Popover panel for selecting sort field and direction.
 * - Clicking an already-active sort toggles its direction.
 * @param {Object} props
 * @param {Array} props.sorts - Sort definitions from sectionConfig.
 * @param {Object|null} props.activeSort - Current sort { key, dir } or null.
 * @param {function} props.onChange - Called with new sort { key, dir } or null.
 * @param {function} props.onClose - Called when the panel should close.
 * @returns {JSX.Element}
 */
const SearchSortPanel = ({ sorts, activeSort, onChange, onClose }) => {
  const handleSelect = (key) => {
    if (activeSort?.key === key) {
      onChange({ key, dir: activeSort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onChange({ key, dir: 'desc' });
    }
    onClose();
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
            <button
              key={sort.key}
              className={`${styles.option} ${isActive ? styles.activeOption : ''}`}
              onClick={() => handleSelect(sort.key)}
            >
              <span>{sort.label}</span>
              {isActive &&
                (activeSort.dir === 'asc' ? (
                  <ArrowUp size={12} />
                ) : (
                  <ArrowDown size={12} />
                ))}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchSortPanel;
