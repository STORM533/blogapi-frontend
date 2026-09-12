import type { Post, Pagination } from "../types";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export default function PostList({
  posts,
  pagination,
  onPageChange,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">No posts found.</p>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="text-xs sm:text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-1 text-xs sm:text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
