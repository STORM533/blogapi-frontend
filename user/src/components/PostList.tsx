import type { Post, Pagination } from "../types";
import PostCard from "./PostCard";
import styles from "../styles/app.module.css";

interface PostListProps {
  posts: Post[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function PostList({
  posts,
  pagination,
  onPageChange,
}: PostListProps) {
  if (posts.length === 0) {
    return <p className={styles.emptyState}>No posts found.</p>;
  }

  return (
    <div>
      <div className={styles.postList}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
