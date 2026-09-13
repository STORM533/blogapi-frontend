import { useState, useEffect } from "react";
import { getPostStats } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import dashboardStyles from "../styles/dashboard.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
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
      <div className={dashboardStyles.welcomeHero}>
        <p className={dashboardStyles.welcomePrefix}>Welcome back,</p>
        <h1 className={dashboardStyles.welcomeName}>{user?.username}</h1>
        <p className={dashboardStyles.welcomeTagline}>editorial tools at your disposal</p>
        <div className={dashboardStyles.welcomeDivider} />
      </div>

      <div className={dashboardStyles.statsGrid}>
        <div className={dashboardStyles.statCard}>
          <h2 className={dashboardStyles.statLabel}>Total Posts</h2>
          <p className={dashboardStyles.statValue}>{stats.totalPosts}</p>
        </div>

        <div className={dashboardStyles.statCard}>
          <h2 className={dashboardStyles.statLabel}>Published</h2>
          <p className={dashboardStyles.statValueGreen}>{stats.publishedPosts}</p>
        </div>

        <div className={dashboardStyles.statCard}>
          <h2 className={dashboardStyles.statLabel}>Drafts</h2>
          <p className={dashboardStyles.statValueYellow}>{stats.draftPosts}</p>
        </div>

        <div className={dashboardStyles.statCard}>
          <h2 className={dashboardStyles.statLabel}>Total Comments</h2>
          <p className={dashboardStyles.statValueBlue}>{stats.totalComments}</p>
        </div>
      </div>
    </div>
  );
}
