import { Link } from "react-router-dom";
import type { Post } from "../types";
import styles from "../styles/components.module.css";

interface PostCardProps {
  post: Post;
  index: number;
}

function getReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function getExcerpt(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

const commentLabel = (n: number) => `${n} comment${n === 1 ? "" : "s"}`;

export default function PostCard({ post, index }: PostCardProps) {
  const readTime = getReadTime(post.content);

  return (
    <article className={styles.postCard}>
      <span className={styles.postIndex}>{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.postCardBody}>
        <Link to={`/post/${post.id}`} className={styles.postCardTitle}>
          {post.title}
        </Link>
        <p className={styles.postCardContent}>{getExcerpt(post.content)}</p>
        <div className={styles.postCardMeta}>
          <span>by {post.author.username}</span>
          <span className={styles.postCardMetaSeparator}>·</span>
          <span>{readTime} min read</span>
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
