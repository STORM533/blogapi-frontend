import { useState, useEffect } from "react";
import { getMe, getMyComments } from "../api/users";
import type { User, MyComment, Pagination } from "../types";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import styles from "../styles/app.module.css";

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
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, commentsData] = await Promise.all([
          getMe(controller.signal),
          getMyComments(1, 10, controller.signal),
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

    fetchData();
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error || !user) {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorText}>{error || "Failed to load profile"}</p>
      </div>
    );
  }

  return (
    <div className={styles.profileWrap}>
      <h1 className={styles.pageTitle}>Profile</h1>

      <div className={styles.infoCard}>
        <div className={styles.infoFields}>
          <div>
            <span className={styles.fieldLabel}>Username</span>
            <p className={styles.fieldValue}>{user.username}</p>
          </div>
          <div>
            <span className={styles.fieldLabel}>Email</span>
            <p className={styles.fieldValue}>{user.email}</p>
          </div>
          <div>
            <span className={styles.fieldLabel}>Joined</span>
            <p className={styles.fieldValue}>
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>
        Your Comments ({pagination.total})
      </h2>

      {comments.length === 0 ? (
        <p className={styles.emptyProfileComments}>
          You haven't posted any comments yet.
        </p>
      ) : (
        <div className={styles.profileCommentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.profileCommentCard}>
              <Link
                to={`/post/${comment.post.id}`}
                className={styles.profileCommentLink}
              >
                {comment.post.title}
              </Link>
              <p className={styles.profileCommentText}>{comment.content}</p>
              <p className={styles.profileCommentDate}>
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
