import { useState } from "react";
import { createComment } from "../api/comments";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createComment(postId, content);
      setContent("");
      onCommentAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-gray-600">
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Login
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
          {error}
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        placeholder="Write a comment..."
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
