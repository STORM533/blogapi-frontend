import SignupForm from "../components/SignupForm";
import styles from "../styles/auth.module.css";

export default function SignupPage() {
  return (
    <div className={styles.authPageWrap}>
      <div className={styles.brandSmall}>STORM Blog</div>
      <p className={styles.tagline}>join the readers</p>
      <h1 className={styles.authPageTitle}>Sign Up</h1>
      <SignupForm />
    </div>
  );
}
