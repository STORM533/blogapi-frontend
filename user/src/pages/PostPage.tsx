import { useParams } from "react-router-dom";
import PostContent from "../components/PostContent";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect, useCallback, useRef } from "react";
import { getPost } from "../api/posts";
import type { PostDetail } from "../types";
import styles from "../styles/app.module.css";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPost = useCallback(async () => {
    if (!id) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const data = await getPost(Number(id), controller.signal);
      setPost(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    return () => abortRef.current?.abort();
  }, [fetchPost]);

  if (loading) return <LoadingSpinner />;

  if (error || !post) {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorText}>{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <PostContent post={post} />
      <CommentSection post={post} onCommentAdded={fetchPost} />
    </div>
  );
}
