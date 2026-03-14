import styles from './Spinner.module.css';

/**
 * Reusable loading spinner.
 * @param {string} size - CSS dimension for width/height (defaults to 2.5rem).
 */
const Spinner = ({ size = '2.5rem' }) => {
  return (
    // status role provides immediate feedback to assistive technologies
    <div className={styles.spinnerWrapper} role="status">
      <div
        className={`${styles.spinner} animate-spin`}
        style={{ width: size, height: size }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
