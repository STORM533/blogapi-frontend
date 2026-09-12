import type { Comment } from "../types";
import { useAuth } from "../context/AuthContext";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const { user } = useAuth();
  const isOwner = user?.id === comment.user.id;

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
      </div>
      <p className="text-sm sm:text-base text-gray-700">{comment.content}</p>
    </div>
  );
}
