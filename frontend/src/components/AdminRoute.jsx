import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="page container center muted">Đang tải…</div>;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
