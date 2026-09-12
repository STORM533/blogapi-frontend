import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FetchError } from "../api/client";
import styles from "../styles/app.module.css";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await login({ username, password });
      showToast("Logged in successfully");
      navigate("/");
    } catch (err) {
      if (err instanceof FetchError && err.data.errors?.length) {
        const fields: Record<string, string> = {};
        err.data.errors.forEach((e) => {
          if (e.field) fields[e.field] = e.message;
        });
        setFieldErrors(fields);
        setError(err.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      {error && <div className={styles.errorAlert}>{error}</div>}

      <div>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        {fieldErrors.username && <p className={styles.fieldError}>{fieldErrors.username}</p>}
      </div>

      <div>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.btnPrimary}
        style={{ width: "100%" }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className={styles.authFormFooter}>
        Don't have an account?{" "}
        <Link to="/signup" className={styles.authFormLink}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
