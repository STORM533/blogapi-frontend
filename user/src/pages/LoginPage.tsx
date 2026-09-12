import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import styles from "../styles/app.module.css";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className={styles.authPageWrap}>
      <h1 className={styles.authPageTitle}>Login</h1>
      <div className={styles.card}>
        <LoginForm />
      </div>
    </div>
  );
}
