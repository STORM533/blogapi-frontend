import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost } from "../api/posts";
import { getPostComments, deleteComment } from "../api/comments";
import PostForm from "../components/PostForm";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";
import type { PostFormData, Comment } from "../types";
import commonStyles from "../styles/common.module.css";
import postsStyles from "../styles/posts.module.css";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    const fetchPost = async () => {
      try {
        const data = await getPost(Number(id), controller.signal);
        setPost({
          title: data.title,
          content: data.content,
          published: data.published,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    return () => controller.abort();
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    const controller = new AbortController();
    try {
      setCommentsLoading(true);
      const data = await getPostComments(Number(id), controller.signal);
      setComments(data);
    } catch {
      // silently fail for comments
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (data: PostFormData) => {
    if (!id) return;
    await updatePost(Number(id), data);
    showToast("Post updated");
    navigate("/posts");
  };

  const handleDeleteComment = async () => {
    if (!deleteTarget) return;
    try {
      await deleteComment(deleteTarget.id);
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("Comment deleted");
    } catch {
      showToast("Failed to delete comment", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error || !post) {
    return (
      <div className={postsStyles.errorWrap}>
        <p className={commonStyles.errorText}>{error || "Post not found"}</p>
      </div>
    );
  }

  return (
    <div className={postsStyles.editPageWrap}>
      <h1 className={commonStyles.pageTitleSpaced}>Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleSubmit} submitLabel="Update Post" />

      <div className={postsStyles.commentsSection}>
        <h2 className={postsStyles.commentsTitle}>Comments</h2>
        {commentsLoading ? (
          <LoadingSpinner />
        ) : comments.length === 0 ? (
          <p className={postsStyles.commentsEmpty}>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={postsStyles.commentItem}>
              <div className={postsStyles.commentHeader}>
                <span className={postsStyles.commentUsername}>{comment.user.username}</span>
                <span className={postsStyles.commentDate}>
                  · {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setDeleteTarget(comment)}
                  className={postsStyles.commentDeleteBtn}
                >
                  Delete
                </button>
              </div>
              <p className={postsStyles.commentBody}>{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Comment"
        message={`Are you sure you want to delete this comment by "${deleteTarget?.user.username}"? This action cannot be undone.`}
        onConfirm={handleDeleteComment}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
