import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";
import styles from "../styles/common.module.css";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/" className={styles.brandWrap}>
            <span className={styles.brand}>STORM Blog</span>
            <span className={styles.brandTagline}>fiction &amp; field notes</span>
          </Link>
          <div className={styles.navLinks}>
            {user ? (
              <>
                <Link to="/profile" className={styles.navLink}>
                  {user.username}
                </Link>
                <button onClick={logout} className={styles.logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link to="/login" className={styles.navLink}>
                    Login
                  </Link>
                  <Link to="/signup" className={styles.signupLink}>
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
