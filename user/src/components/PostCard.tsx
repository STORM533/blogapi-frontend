import { Link } from "react-router-dom";
import type { Post } from "../types";
import styles from "../styles/components.module.css";

interface PostCardProps {
  post: Post;
  index: number;
}

const commentLabel = (n: number) => `${n} comment${n === 1 ? "" : "s"}`;

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <article className={styles.postCard}>
      <span className={styles.postIndex}>{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.postCardBody}>
        <Link to={`/post/${post.id}`} className={styles.postCardTitle}>
          {post.title}
        </Link>
        <div className={styles.postCardMeta}>
          <span>by {post.author.username}</span>
          {post._count && (
            <>
              <span className={styles.postCardMetaSeparator}>·</span>
              <span>{commentLabel(post._count.comments)}</span>
            </>
          )}
          <span className={styles.postCardMetaSeparator}>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
