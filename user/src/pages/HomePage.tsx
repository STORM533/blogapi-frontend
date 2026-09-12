import { useState, useEffect, useRef } from "react";
import { getPosts } from "../api/posts";
import type { Post, Pagination } from "../types";
import PostList from "../components/PostList";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "../styles/app.module.css";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPosts = async (page: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(posts.length === 0);
      setError(null);
      const data = await getPosts(page, 10, controller.signal);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    return () => abortRef.current?.abort();
  }, []);

  if (loading && posts.length === 0) return <LoadingSpinner />;

  if (error && posts.length === 0) {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorText}>{error}</p>
        <button onClick={() => fetchPosts(1)} className={styles.retryLink}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.homeTitle}>Latest Posts</h1>
      {loading && (
        <div className={styles.inlineSpinnerWrap}>
          <div className={styles.spinnerSm} />
        </div>
      )}
      <PostList
        posts={posts}
        pagination={pagination}
        onPageChange={fetchPosts}
      />
    </div>
  );
}
