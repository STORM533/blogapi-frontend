import { Link } from "react-router-dom";
import componentStyles from "../styles/components.module.css";

export default function NotFoundPage() {
  return (
    <div className={componentStyles.notFound}>
      <h1 className={componentStyles.notFoundCode}>404</h1>
      <p className={componentStyles.notFoundText}>Page not found</p>
      <Link to="/" className={componentStyles.homeLink}>
        Back to dashboard
      </Link>
    </div>
  );
}
