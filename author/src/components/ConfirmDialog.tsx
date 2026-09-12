import styles from "../styles/app.module.css";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.confirmOverlay}>
      <div className={styles.confirmCard}>
        <h3 className={styles.confirmTitle}>{title}</h3>
        <p className={styles.confirmMessage}>{message}</p>
        <div className={styles.confirmActions}>
          <button onClick={onCancel} className={styles.btnOutline}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.btnDanger}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
