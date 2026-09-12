import { useState } from "react";
import { createComment } from "../api/comments";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";
import { FetchError } from "../api/client";
import commonStyles from "../styles/common.module.css";
import compStyles from "../styles/components.module.css";

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
      <p className={compStyles.loginPrompt}>
        <Link to="/login" className={compStyles.loginLink}>
          Login
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compStyles.commentForm}>
      {error && <div className={commonStyles.errorAlertSm}>{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        maxLength={2000}
        placeholder="Write a comment..."
        className={compStyles.commentTextarea}
      />
      {fieldErrors.content && <p className={compStyles.fieldError}>{fieldErrors.content}</p>}
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className={compStyles.commentSubmit}
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
