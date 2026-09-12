import { useParams } from "react-router-dom";
import PostContent from "../components/PostContent";
import CommentSection from "../components/CommentSection";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect } from "react";
import { getPost } from "../api/posts";
import type { PostDetail } from "../types";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
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
    };

    fetchPost();
  }, [id]);

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
      <CommentSection postId={post.id} />
    </div>
  );
}
