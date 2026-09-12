import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import styles from "../styles/auth.module.css";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className={styles.authPageWrap}>
      <div className={styles.brandSmall}>STORM Blog</div>
      <p className={styles.tagline}>welcome back</p>
      <h1 className={styles.authPageTitle}>Login</h1>
      <LoginForm />
    </div>
  );
}
