import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import PostForm from "../components/PostForm";
import { useToast } from "../context/ToastContext";
import type { PostFormData } from "../types";
import styles from "../styles/app.module.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (data: PostFormData) => {
    await createPost(data);
    showToast("Post created");
    navigate("/posts");
  };

  return (
    <div className={styles.editPageWrap}>
      <h1 className={styles.pageTitleSpaced}>New Post</h1>
      <div className={styles.statCard}>
        <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
      </div>
    </div>
  );
}
