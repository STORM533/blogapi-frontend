import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FetchError } from "../api/client";
import commonStyles from "../styles/common.module.css";
import compStyles from "../styles/components.module.css";

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
    <form onSubmit={handleSubmit} className={compStyles.authForm}>
      {error && <div className={compStyles.errorAlert}>{error}</div>}

      <div>
        <label htmlFor="username" className={commonStyles.label}>
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={commonStyles.input}
        />
        {fieldErrors.username && <p className={compStyles.fieldError}>{fieldErrors.username}</p>}
      </div>

      <div>
        <label htmlFor="password" className={commonStyles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={commonStyles.input}
        />
        {fieldErrors.password && <p className={compStyles.fieldError}>{fieldErrors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={compStyles.authSubmit}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className={compStyles.authFormFooter}>
        Don't have an account?{" "}
        <Link to="/signup" className={compStyles.authFormLink}>
          Sign up
        </Link>
      </p>
    </form>
  );
}
