import type { PostDetail } from "../types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import styles from "../styles/components.module.css";

interface CommentSectionProps {
  post: PostDetail;
  onCommentAdded: () => void;
}

const commentLabel = (n: number) => `${n} comment${n === 1 ? "" : "s"}`;

export default function CommentSection({
  post,
  onCommentAdded,
}: CommentSectionProps) {
  return (
    <div className={styles.commentSection}>
      <h2 className={styles.commentHeading}>
        {commentLabel(post.comments.length)}
      </h2>

      <CommentForm postId={post.id} onCommentAdded={onCommentAdded} />

      {post.comments.length === 0 && (
        <p className={styles.emptyComments}>No comments yet.</p>
      )}

      <div className={styles.commentList}>
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
