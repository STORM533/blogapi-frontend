import { Link } from "react-router-dom";
import type { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
      <Link to={`/post/${post.id}`}>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-blue-600">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 text-sm sm:text-base text-gray-600 line-clamp-2">
        {post.content}
      </p>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
        <span>by {post.author.username}</span>
        <div className="flex items-center gap-3">
          {post._count && (
            <span>{post._count.comments} comments</span>
          )}
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
