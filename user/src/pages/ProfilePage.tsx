import { useState, useEffect } from "react";
import { getMe, getMyComments } from "../api/users";
import type { User, MyComment, Pagination } from "../types";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";

function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<MyComment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, commentsData] = await Promise.all([
          getMe(),
          getMyComments(1, 10),
        ]);
        setUser(userData);
        setComments(commentsData.comments);
        setPagination(commentsData.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Failed to load profile"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500">Username</span>
            <p className="text-gray-900 font-medium">{user.username}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Email</span>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Role</span>
            <p className="text-gray-900 font-medium">{user.role}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Joined</span>
            <p className="text-gray-900 font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Your Comments ({pagination.total})
      </h2>

      {comments.length === 0 ? (
        <p className="text-gray-500">You haven't posted any comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow p-4">
              <Link
                to={`/post/${comment.post.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {comment.post.title}
              </Link>
              <p className="mt-2 text-gray-700">{comment.content}</p>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
