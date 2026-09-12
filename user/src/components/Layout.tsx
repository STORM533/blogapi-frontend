import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Blog
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              !isAuthPage && (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
