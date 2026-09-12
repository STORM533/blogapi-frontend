import { sanitize } from "../utils/sanitize";
import type { PostDetail } from "../types";
import styles from "../styles/app.module.css";

interface PostContentProps {
  post: PostDetail;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className={styles.article}>
      <h1 className={styles.articleTitle}>{post.title}</h1>
      <div className={styles.articleMeta}>
        <span>by {post.author.username}</span>
        <span className={styles.articleSeparator}>·</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div
        className={styles.articleContent}
        dangerouslySetInnerHTML={{ __html: sanitize(post.content) }}
      />
    </article>
  );
}
