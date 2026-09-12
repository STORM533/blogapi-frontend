import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import PostForm from "../components/PostForm";
import { useToast } from "../context/ToastContext";
import type { PostFormData } from "../types";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (data: PostFormData) => {
    await createPost(data);
    showToast("Post created");
    navigate("/posts");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Post</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <PostForm
          onSubmit={handleSubmit}
          submitLabel="Create Post"
        />
      </div>
    </div>
  );
}
