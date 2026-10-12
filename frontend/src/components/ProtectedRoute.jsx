import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page container center muted">Đang tải…</div>;
  if (!isAuthenticated) return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  return children;
}
