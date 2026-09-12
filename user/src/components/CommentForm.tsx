import { useState } from "react";
import { createComment } from "../api/comments";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";
import { FetchError } from "../api/client";
import styles from "../styles/app.module.css";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await createComment(postId, content);
      setContent("");
      showToast("Comment posted!");
      onCommentAdded();
    } catch (err) {
      if (err instanceof FetchError && err.data.errors?.length) {
        const fields: Record<string, string> = {};
        err.data.errors.forEach((e) => {
          if (e.field) fields[e.field] = e.message;
        });
        setFieldErrors(fields);
        setError(err.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Failed to post comment");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className={styles.loginPrompt}>
        <Link to="/login" className={styles.loginLink}>
          Login
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      {error && <div className={styles.errorAlertSm}>{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        maxLength={2000}
        placeholder="Write a comment..."
        className={styles.commentTextarea}
      />
      {fieldErrors.content && <p className={styles.fieldError}>{fieldErrors.content}</p>}
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className={styles.btnPrimary}
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
