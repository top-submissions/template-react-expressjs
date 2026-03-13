import styles from './Toast.module.css';

/**
 * Individual toast notification component.
 * @param {Object} props
 * @param {string} props.message - Text to display.
 * @param {'success'|'error'|'info'} props.type - Semantic style.
 * @param {function} props.onClose - Callback to remove toast.
 */
const Toast = ({ message, type = 'info', onClose }) => {
  // Combine base style with the semantic type class
  const toastClass = `${styles.toast} ${styles[type]}`;

  return (
    <div className={toastClass} role="alert">
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
