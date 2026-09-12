import SignupForm from "../components/SignupForm";
import styles from "../styles/app.module.css";

export default function SignupPage() {
  return (
    <div className={styles.authPageWrap}>
      <h1 className={styles.authPageTitle}>Sign Up</h1>
      <div className={styles.card}>
        <SignupForm />
      </div>
    </div>
  );
}
