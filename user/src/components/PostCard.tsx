import { Link } from "react-router-dom";
import { sanitize } from "../utils/sanitize";
import type { Post } from "../types";
import styles from "../styles/app.module.css";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className={styles.postCard}>
      <Link to={`/post/${post.id}`}>
        <h2 className={styles.postCardTitle}>{post.title}</h2>
      </Link>
      <div
        className={styles.postCardContent}
        dangerouslySetInnerHTML={{ __html: sanitize(post.content) }}
      />
      <div className={styles.postCardMeta}>
        <span>by {post.author.username}</span>
        <div className={styles.postCardMetaInner}>
          {post._count && (
            <span>{post._count.comments} comments</span>
          )}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
