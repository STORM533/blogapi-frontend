import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthor } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user || !isAuthor) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
