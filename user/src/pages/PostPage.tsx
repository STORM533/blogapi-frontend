import { useParams } from "react-router-dom";
import PostContent from "../components/PostContent";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect, useCallback } from "react";
import { getPost } from "../api/posts";
import type { PostDetail } from "../types";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getPost(Number(id));
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) return <LoadingSpinner />;

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Post not found"}</p>
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
