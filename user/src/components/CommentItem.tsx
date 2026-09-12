import { useState } from "react";
import type { Comment } from "../types";
import { useAuth } from "../context/AuthContext";
import { updateComment, deleteComment } from "../api/comments";
import { FetchError } from "../api/client";
import styles from "../styles/app.module.css";

interface CommentItemProps {
  comment: Comment;
  onCommentSaved: () => void;
}

export default function CommentItem({
  comment,
  onCommentSaved,
}: CommentItemProps) {
  const { user } = useAuth();
  const isOwner = user?.id === comment.user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      await updateComment(comment.id, editContent.trim());
      setIsEditing(false);
      onCommentSaved();
    } catch (err) {
      if (err instanceof FetchError && err.data.errors?.length) {
        const fields: Record<string, string> = {};
        err.data.errors.forEach((e) => {
          if (e.field) fields[e.field] = e.message;
        });
        setFieldErrors(fields);
        setError(err.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Failed to update comment");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteComment(comment.id);
      setShowDeleteConfirm(false);
      onCommentSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <span className={styles.commentUsername}>
          {comment.user.username}
        </span>
        {isOwner && <span className={styles.youBadge}>You</span>}
        <span className={styles.commentDate}>
          · {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {isOwner && !isEditing && (
          <div className={styles.commentActions}>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditContent(comment.content);
                setError(null);
                setFieldErrors({});
              }}
              className={styles.commentEditBtn}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.commentDeleteBtn}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {error && <p className={styles.commentError}>{error}</p>}

      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={styles.editTextarea}
            rows={3}
          />
          {fieldErrors.content && <p className={styles.fieldError}>{fieldErrors.content}</p>}
          <div className={styles.editActions}>
            <button
              onClick={handleSave}
              disabled={loading || !editContent.trim()}
              className={styles.btnPrimary}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
                setError(null);
                setFieldErrors({});
              }}
              className={styles.cancelTextBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : showDeleteConfirm ? (
        <div className={styles.deleteConfirm}>
          <p className={styles.deleteConfirmText}>Delete this comment?</p>
          <div className={styles.deleteConfirmActions}>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={styles.btnDanger}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setError(null);
              }}
              className={styles.cancelTextBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.commentBody}>{comment.content}</p>
      )}
    </div>
  );
}
