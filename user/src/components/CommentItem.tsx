import { useState } from "react";
import type { Comment } from "../types";
import { useAuth } from "../context/AuthContext";
import { updateComment, deleteComment } from "../api/comments";

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

  const handleSave = async () => {
    if (!editContent.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await updateComment(comment.id, editContent.trim());
      setIsEditing(false);
      onCommentSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update comment");
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
    <div className="border-b border-gray-100 py-3 sm:py-4 last:border-0">
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <span className="text-sm font-medium text-gray-900">
          {comment.user.username}
        </span>
        {isOwner && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            You
          </span>
        )}
        <span className="text-xs sm:text-sm text-gray-500">
          · {new Date(comment.createdAt).toLocaleDateString()}
        </span>
        {isOwner && !isEditing && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => {
                setIsEditing(true);
                setEditContent(comment.content);
                setError(null);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}

      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              disabled={loading || !editContent.trim()}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
                setError(null);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : showDeleteConfirm ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 mb-2">Delete this comment?</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setError(null);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm sm:text-base text-gray-700">{comment.content}</p>
      )}
    </div>
  );
}
