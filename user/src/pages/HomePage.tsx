import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import type { Post, Pagination } from "../types";
import PostList from "../components/PostList";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(posts.length === 0);
      setError(null);
      const data = await getPosts(page);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  if (loading && posts.length === 0) return <LoadingSpinner />;

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchPosts(1)}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Latest Posts</h1>
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto" />
        </div>
      )}
      <PostList
        posts={posts}
        pagination={pagination}
        onPageChange={fetchPosts}
      />
    </div>
  );
}
