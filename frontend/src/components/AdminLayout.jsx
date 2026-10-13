import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/admin", label: "📊 Tổng quan & Thống kê", end: true },
  { to: "/admin/san-pham", label: "🎮 Sản phẩm" },
  { to: "/admin/hang", label: "🏷️ Hãng (Brand)" },
  { to: "/admin/don-hang", label: "📦 Đơn hàng" },
  { to: "/admin/thu-cu", label: "♻️ Thu cũ - Đổi mới" },
  { to: "/admin/khach-hang", label: "👥 Khách hàng" },
  { to: "/admin/tin-tuc", label: "📰 Tin tức - Review" },
  { to: "/admin/nhat-ky", label: "🧾 Nhật ký thao tác" },
];

export default function AdminLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">
          <Link to="/admin" title="Về trang Tổng quan & Thống kê">
            GVN<span>ADMIN</span>
          </Link>
        </div>
        <nav>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer">🌐 Xem website</a>
          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            style={{ width: "100%", textAlign: "left" }}
          >
            🚪 Đăng xuất
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{title}</h1>
          <div className="muted">Xin chào, <strong>{user?.name}</strong></div>
        </div>
        {children}
      </main>
    </div>
  );
}
