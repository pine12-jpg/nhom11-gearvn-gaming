import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page container">
      <div className="empty-state">
        <div className="ico">🎮</div>
        <h2>404 — Không tìm thấy trang</h2>
        <p>Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
        <Link to="/" className="btn btn-primary mt-16">Về trang chủ</Link>
      </div>
    </div>
  );
}
