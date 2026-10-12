import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/client";
import { formatDateTime } from "../../utils/format";

/** US37 — Ghi log các thao tác quan trọng của admin để dễ truy vết khi có sự cố */
export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/admin/logs").then(({ data }) => setLogs(data));
  }, []);

  return (
    <AdminLayout title="Nhật ký thao tác (Audit Log)">
      <p className="muted">Ghi lại các thao tác quan trọng (thêm/sửa/xóa sản phẩm, cập nhật đơn hàng, khóa tài khoản…) để dễ truy vết khi có sự cố.</p>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Thời gian</th><th>Admin</th><th>Thao tác</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{formatDateTime(l.createdAt)}</td>
                <td>{l.adminName}</td>
                <td>{l.action}</td>
                <td>{l.target}</td>
                <td>{l.detail}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="muted center">Chưa có nhật ký nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
