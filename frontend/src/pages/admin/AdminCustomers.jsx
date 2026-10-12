import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api, { errMsg } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/format";

/** US36 — Quản lý danh sách tài khoản khách hàng, có thể khóa tài khoản vi phạm */
export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const toast = useToast();

  function load() {
    api.get("/admin/users").then(({ data }) => setUsers(data));
  }
  useEffect(load, []);

  async function toggleLock(u) {
    if (!window.confirm(`${u.locked ? "Mở khóa" : "Khóa"} tài khoản "${u.name}"?`)) return;
    try {
      await api.put(`/admin/users/${u.id}/lock`, { locked: !u.locked });
      toast.success(u.locked ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.");
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(q.toLowerCase()) || (u.email || "").includes(q) || (u.phone || "").includes(q)
  );

  return (
    <AdminLayout title="Quản lý tài khoản khách hàng">
      <div className="toolbar-row">
        <input className="search-mini" placeholder="Tìm theo tên, email, SĐT…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="muted">{filtered.length} tài khoản</span>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Đơn hàng</th><th>HSSV</th><th>Ngày tạo</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email || "—"}</td>
                  <td>{u.phone || "—"}</td>
                  <td>{u.role === "admin" ? "Quản trị" : "Khách hàng"}</td>
                  <td>{u.orderCount}</td>
                  <td>{u.isHssv ? "✅" : "—"}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{u.locked ? <span className="badge badge-cancelled">Đã khóa</span> : <span className="badge badge-delivered">Hoạt động</span>}</td>
                  <td>
                    {u.role !== "admin" && (
                      <button className={`btn btn-sm ${u.locked ? "btn-outline" : "btn-danger"}`} onClick={() => toggleLock(u)}>
                        {u.locked ? "Mở khóa" : "Khóa"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
