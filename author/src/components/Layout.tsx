import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" ? "bg-gray-800" : "";
    return location.pathname.startsWith(path) ? "bg-gray-800" : "";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Blog Author</h1>
          </div>

          <nav className="space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded hover:bg-gray-800 ${isActive("/")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/posts"
              className={`block px-3 py-2 rounded hover:bg-gray-800 ${isActive("/posts")}`}
            >
              Posts
            </Link>
            <Link
              to="/posts/new"
              className={`block px-3 py-2 rounded hover:bg-gray-800 ${isActive("/posts/new")}`}
            >
              New Post
            </Link>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400">{user?.username}</p>
              <button
                onClick={logout}
                className="mt-2 text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
