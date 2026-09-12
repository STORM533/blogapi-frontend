import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getPosts, deletePost, setPostPublished } from "../api/posts";
import type { Post, Pagination } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDialog from "../components/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import styles from "../styles/app.module.css";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const abortRef = useRef<AbortController | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const fetchPosts = useCallback(async (page: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const data = await getPosts(page, 10, controller.signal);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
    return () => abortRef.current?.abort();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deletePost(deleteTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
      showToast("Post deleted");
    } catch {
      showToast("Failed to delete post", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const updated = await setPostPublished(post.id, !post.published);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
      showToast(
        updated.published ? "Post published" : "Post unpublished",
      );
    } catch {
      showToast("Failed to update post", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorText}>{error}</p>
        <button onClick={() => fetchPosts(1)} className={styles.retryBtn}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Posts</h1>
        <Link to="/posts/new" className={styles.newPostBtn}>
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className={styles.errorText} style={{ color: "#6b7280" }}>No posts yet.</p>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Status</th>
                  <th className={`${styles.th} ${styles.tableRowHidden}`}>Comments</th>
                  <th className={`${styles.th} ${styles.tableRowHidden}`}>Created</th>
                  <th className={styles.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className={styles.tableRow}>
                    <td className={styles.td}>
                      <Link to={`/posts/${post.id}/edit`} className={styles.textLink}>
                        {post.title}
                      </Link>
                    </td>
                    <td className={styles.td}>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`${styles.statusBtn} ${post.published ? styles.statusPublished : styles.statusDraft}`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className={`${styles.td} ${styles.tableRowHidden}`}>
                      {post._count?.comments || 0}
                    </td>
                    <td className={`${styles.td} ${styles.tableRowHidden}`}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className={styles.tdActions}>
                      <Link to={`/posts/${post.id}/edit`} className={styles.textLink}>
                        Edit
                      </Link>
                      <button onClick={() => setDeleteTarget(post)} className={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => fetchPosts(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchPosts(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
