import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import commonStyles from "../styles/common.module.css";
import layoutStyles from "../styles/layout.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" ? commonStyles.navLinkActive : "";
    return location.pathname.startsWith(path) ? commonStyles.navLinkActive : "";
  };

  return (
    <div className={commonStyles.page}>
      <div className={layoutStyles.mobileHeader}>
        <Link to="/" className={commonStyles.brandWrap}>
          <span className={commonStyles.brand}>Blog Author</span>
          <span className={commonStyles.brandTagline}>editorial tools</span>
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className={layoutStyles.mobileMenuBtn}
        >
          <svg className={layoutStyles.menuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileNavOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileNavOpen && (
        <div className={layoutStyles.mobileNav}>
          <Link to="/" onClick={() => setMobileNavOpen(false)} className={layoutStyles.mobileNavLink}>
            Dashboard
          </Link>
          <Link to="/posts" onClick={() => setMobileNavOpen(false)} className={layoutStyles.mobileNavLink}>
            Posts
          </Link>
          <Link to="/posts/new" onClick={() => setMobileNavOpen(false)} className={layoutStyles.mobileNavLink}>
            New Post
          </Link>
          <div className={layoutStyles.mobileNavFooter}>
            <span className={layoutStyles.mobileNavUsername}>{user?.username}</span>
            <button onClick={() => { logout(); setMobileNavOpen(false); }} className={layoutStyles.mobileLogoutBtn}>
              Logout
            </button>
          </div>
        </div>
      )}

      <nav className={commonStyles.nav}>
        <div className={commonStyles.navInner}>
          <Link to="/" className={commonStyles.brandWrap}>
            <span className={commonStyles.brand}>Blog Author</span>
            <span className={commonStyles.brandTagline}>editorial tools</span>
          </Link>
          <div className={commonStyles.navLinks}>
            <Link to="/" className={`${commonStyles.navLink} ${isActive("/")}`}>
              Dashboard
            </Link>
            <Link to="/posts" className={`${commonStyles.navLink} ${isActive("/posts")}`}>
              Posts
            </Link>
            <Link to="/posts/new" className={commonStyles.newPostLink}>
              New Post
            </Link>
            <button onClick={logout} className={commonStyles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className={commonStyles.main}>
        <Outlet />
      </main>

      <footer className={commonStyles.footer}>
        <span className={commonStyles.footerBrand}>Blog Author</span>
        <span className={commonStyles.footerMeta}>est. 2026</span>
      </footer>
    </div>
  );
}
