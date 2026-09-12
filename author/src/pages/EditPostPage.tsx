import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api/posts";
import PostForm from "../components/PostForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import type { PostFormData } from "../types";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const data = await getPost(Number(id));
        setPost({
          title: data.title,
          content: data.content,
          published: data.published,
        });
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (data: PostFormData) => {
    if (!id) return;
    await updatePost(Number(id), data);
    showToast("Post updated");
    navigate("/posts");
  };

  if (loading) return <LoadingSpinner />;

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          submitLabel="Update Post"
        />
      </div>
    </div>
  );
}
