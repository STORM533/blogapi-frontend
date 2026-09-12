import { useState } from "react";
import type { Comment } from "../types";
import { useAuth } from "../context/AuthContext";
import { updateComment, deleteComment } from "../api/comments";
import { FetchError } from "../api/client";
import commonStyles from "../styles/common.module.css";
import compStyles from "../styles/components.module.css";

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
    <div className={compStyles.commentItem}>
      <div className={compStyles.commentHeader}>
        <span className={compStyles.commentUsername}>
          {comment.user.username}
        </span>
        {isOwner && <span className={compStyles.youBadge}>You</span>}
        <span className={compStyles.commentDate}>
          · {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {isOwner && !isEditing && (
          <div className={compStyles.commentActions}>
            <button
              onClick={() => {
                setIsEditing(true);
                setEditContent(comment.content);
                setError(null);
                setFieldErrors({});
              }}
              className={compStyles.commentEditBtn}
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={compStyles.commentDeleteBtn}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {error && <p className={compStyles.commentError}>{error}</p>}

      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={compStyles.editTextarea}
            rows={3}
          />
          {fieldErrors.content && <p className={compStyles.fieldError}>{fieldErrors.content}</p>}
          <div className={compStyles.editActions}>
            <button
              onClick={handleSave}
              disabled={loading || !editContent.trim()}
              className={commonStyles.btnPrimary}
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
              className={compStyles.cancelTextBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : showDeleteConfirm ? (
        <div className={compStyles.deleteConfirm}>
          <p className={compStyles.deleteConfirmText}>Delete this comment?</p>
          <div className={compStyles.deleteConfirmActions}>
            <button
              onClick={handleDelete}
              disabled={loading}
              className={commonStyles.btnDanger}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setError(null);
              }}
              className={compStyles.cancelTextBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={compStyles.commentBody}>{comment.content}</p>
      )}
    </div>
  );
}
