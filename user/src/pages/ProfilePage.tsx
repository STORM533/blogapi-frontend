import { useState, useEffect, useRef } from "react";
import { getMe, getMyComments } from "../api/users";
import type { User, MyComment, Pagination } from "../types";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import commonStyles from "../styles/common.module.css";
import compStyles from "../styles/components.module.css";
import profileStyles from "../styles/profile.module.css";

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
  const abortRef = useRef<AbortController | null>(null);

  const fetchComments = async (page: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const [userData, commentsData] = await Promise.all([
        getMe(controller.signal),
        getMyComments(page, 10, controller.signal),
      ]);
      setUser(userData);
      setComments(commentsData.comments);
      setPagination(commentsData.pagination);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
    return () => abortRef.current?.abort();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error || !user) {
    return (
      <div className={compStyles.errorWrap}>
        <p className={compStyles.errorText}>{error || "Failed to load profile"}</p>
      </div>
    );
  }

  return (
    <div className={profileStyles.profileWrap}>
      <h1 className={commonStyles.pageTitle}>Profile</h1>

      <div className={profileStyles.infoCard}>
        <div className={profileStyles.infoFields}>
          <div>
            <span className={profileStyles.fieldLabel}>Username</span>
            <p className={profileStyles.fieldValue}>{user.username}</p>
          </div>
          <div>
            <span className={profileStyles.fieldLabel}>Email</span>
            <p className={profileStyles.fieldValue}>{user.email}</p>
          </div>
          <div>
            <span className={profileStyles.fieldLabel}>Joined</span>
            <p className={profileStyles.fieldValue}>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <h2 className={profileStyles.sectionTitle}>
        Your Comments ({pagination.total})
      </h2>

      {comments.length === 0 ? (
        <p className={profileStyles.emptyProfileComments}>
          You haven't posted any comments yet.
        </p>
      ) : (
        <>
          <div className={profileStyles.profileCommentList}>
            {comments.map((comment) => (
              <div key={comment.id} className={profileStyles.profileCommentCard}>
                <Link
                  to={`/post/${comment.post.id}`}
                  className={profileStyles.profileCommentLink}
                >
                  {comment.post.title}
                </Link>
                <p className={profileStyles.profileCommentText}>{comment.content}</p>
                <p className={profileStyles.profileCommentDate}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className={compStyles.pagination}>
              <button
                onClick={() => fetchComments(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={compStyles.pageBtn}
              >
                Previous
              </button>
              <span className={compStyles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchComments(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className={compStyles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
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
