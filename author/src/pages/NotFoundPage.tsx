import { Link } from "react-router-dom";
import styles from "../styles/app.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFoundCode}>404</h1>
      <p className={styles.notFoundText}>Page not found</p>
      <Link to="/" className={styles.homeLink}>
        Back to dashboard
      </Link>
    </div>
  );
}
