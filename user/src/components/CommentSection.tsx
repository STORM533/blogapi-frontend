import { useState, useEffect, useCallback } from "react";
import { getComments } from "../api/comments";
import type { Comment } from "../types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Comments ({comments.length})
      </h2>

      <CommentForm postId={postId} onCommentAdded={fetchComments} />

      {loading && <p className="text-sm text-gray-500 mt-4">Loading comments...</p>}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {!loading && !error && comments.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No comments yet.</p>
      )}

      <div className="mt-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
