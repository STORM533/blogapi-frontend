import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FetchError } from "../api/client";
import commonStyles from "../styles/common.module.css";
import compStyles from "../styles/components.module.css";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await signup({ username, email, password });
      showToast("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err instanceof FetchError && err.data.errors?.length) {
        const fields: Record<string, string> = {};
        err.data.errors.forEach((e) => {
          if (e.field) fields[e.field] = e.message;
        });
        setFieldErrors(fields);
        setError(err.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Signup failed");
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
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={commonStyles.input}
        />
        {fieldErrors.username && <p className={compStyles.fieldError}>{fieldErrors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className={commonStyles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={commonStyles.input}
        />
        {fieldErrors.email && <p className={compStyles.fieldError}>{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className={commonStyles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          maxLength={128}
          autoComplete="new-password"
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
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className={compStyles.authFormFooter}>
        Already have an account?{" "}
        <Link to="/login" className={compStyles.authFormLink}>
          Login
        </Link>
      </p>
    </form>
  );
}
