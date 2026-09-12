import { Link } from "react-router-dom";
import { sanitize } from "../utils/sanitize";
import type { PostDetail } from "../types";
import styles from "../styles/components.module.css";

interface PostContentProps {
  post: PostDetail;
}

function getReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PostContent({ post }: PostContentProps) {
  const readTime = getReadTime(post.content);

  return (
    <article className={styles.article}>
      <Link to="/" className={styles.backLink}>&#8592; back to all posts</Link>
      <h1 className={styles.articleTitle}>{post.title}</h1>
      <div className={styles.articleMeta}>
        <span>by {post.author.username}</span>
        <span className={styles.articleSeparator}>·</span>
        <span>{readTime} min read</span>
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
