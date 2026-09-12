import type { PostDetail } from "../types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
  post: PostDetail;
  onCommentAdded: () => void;
}

export default function CommentSection({
  post,
  onCommentAdded,
}: CommentSectionProps) {
  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        Comments ({post.comments.length})
      </h2>

      <CommentForm postId={post.id} onCommentAdded={onCommentAdded} />

      {post.comments.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No comments yet.</p>
      )}

      <div className="mt-4">
        {post.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onCommentSaved={onCommentAdded}
          />
        ))}
      </div>
    </div>
  );
}
