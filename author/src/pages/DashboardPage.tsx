import { useState, useEffect } from "react";
import { getPostStats } from "../api/posts";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "../styles/app.module.css";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchStats = async () => {
      try {
        const data = await getPostStats(controller.signal);
        setStats(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    return () => controller.abort();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.pageTitleSpaced}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h2 className={styles.statLabel}>Total Posts</h2>
          <p className={styles.statValue}>{stats.totalPosts}</p>
        </div>

        <div className={styles.statCard}>
          <h2 className={styles.statLabel}>Published</h2>
          <p className={styles.statValueGreen}>{stats.publishedPosts}</p>
        </div>

        <div className={styles.statCard}>
          <h2 className={styles.statLabel}>Drafts</h2>
          <p className={styles.statValueYellow}>{stats.draftPosts}</p>
        </div>

        <div className={styles.statCard}>
          <h2 className={styles.statLabel}>Total Comments</h2>
          <p className={styles.statValueBlue}>{stats.totalComments}</p>
        </div>
      </div>
    </div>
  );
}
