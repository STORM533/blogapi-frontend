import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getPosts(1, 1000);
        const posts = data.posts;
        setStats({
          totalPosts: data.pagination.total,
          publishedPosts: posts.filter((p) => p.published).length,
          draftPosts: posts.filter((p) => !p.published).length,
          totalComments: posts.reduce(
            (sum, p) => sum + (p._count?.comments || 0),
            0,
          ),
        });
      } catch {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Posts</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalPosts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500">Published</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.publishedPosts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500">Drafts</h2>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.draftPosts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-sm font-medium text-gray-500">
            Total Comments
          </h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.totalComments}
          </p>
        </div>
      </div>
    </div>
  );
}
