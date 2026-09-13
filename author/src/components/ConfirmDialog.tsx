import componentStyles from "../styles/components.module.css";
import commonStyles from "../styles/common.module.css";

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
    <div className={componentStyles.confirmOverlay}>
      <div className={componentStyles.confirmCard}>
        <h3 className={componentStyles.confirmTitle}>{title}</h3>
        <p className={componentStyles.confirmMessage}>{message}</p>
        <div className={componentStyles.confirmActions}>
          <button onClick={onCancel} className={commonStyles.btnOutline}>
            Cancel
          </button>
          <button onClick={onConfirm} className={commonStyles.btnDanger}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
