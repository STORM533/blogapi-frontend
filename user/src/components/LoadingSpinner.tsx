import styles from "../styles/app.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.spinnerWrap}>
      <div className={styles.spinner} />
    </div>
  );
}
