import Toast from '../Toast/Toast';
import styles from './ToastContainer.module.css';

/**
 * Orchestrates the display of multiple toast notifications.
 * @param {Object} props
 * @param {Array} props.toasts - Array of toast objects { id, message, type }.
 * @param {function} props.removeToast - Function to remove a toast by ID.
 */
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
