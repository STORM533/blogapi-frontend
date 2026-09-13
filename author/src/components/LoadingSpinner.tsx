import componentStyles from "../styles/components.module.css";

export default function LoadingSpinner() {
  return (
    <div className={componentStyles.spinnerWrap}>
      <div className={componentStyles.spinner} />
    </div>
  );
}
