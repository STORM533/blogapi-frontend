import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" ? "bg-gray-800" : "";
    return location.pathname.startsWith(path) ? "bg-gray-800" : "";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile header */}
      <div className="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Blog Author</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-gray-900 text-white min-h-screen p-4
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="mb-8">
            <h1 className="text-xl font-bold">Blog Author</h1>
          </div>

          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={`block px-3 py-2 rounded hover:bg-gray-800 ${isActive("/")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/posts"
              onClick={() => setSidebarOpen(false)}
              className={`block px-3 py-2 rounded hover:bg-gray-800 ${isActive("/posts")}`}
            >
              Posts
            </Link>
            <Link
              to="/posts/new"
              onClick={() => setSidebarOpen(false)}
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
