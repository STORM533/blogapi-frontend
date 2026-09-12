import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/app.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" ? styles.sidebarLinkActive : "";
    return location.pathname.startsWith(path) ? styles.sidebarLinkActive : "";
  };

  return (
    <div className={styles.page}>
      <div className={styles.mobileHeader}>
        <h1 className={styles.mobileHeaderTitle}>Blog Author</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={styles.mobileMenuBtn}
        >
          <svg className={styles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className={styles.flex}>
        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.sidebarBrand}>Blog Author</div>

          <nav className={styles.sidebarNav}>
            <Link to="/" onClick={() => setSidebarOpen(false)} className={`${styles.sidebarLink} ${isActive("/")}`}>
              Dashboard
            </Link>
            <Link to="/posts" onClick={() => setSidebarOpen(false)} className={`${styles.sidebarLink} ${isActive("/posts")}`}>
              Posts
            </Link>
            <Link to="/posts/new" onClick={() => setSidebarOpen(false)} className={`${styles.sidebarLink} ${isActive("/posts/new")}`}>
              New Post
            </Link>
          </nav>

          <div className={styles.sidebarFooter}>
            <p className={styles.sidebarUsername}>{user?.username}</p>
            <button onClick={logout} className={styles.sidebarLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
