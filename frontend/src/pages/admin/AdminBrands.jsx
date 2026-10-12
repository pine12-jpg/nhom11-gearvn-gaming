import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api, { errMsg } from "../../api/client";
import { useToast } from "../../context/ToastContext";

/** US32 — Quản lý danh mục các hãng gaming (ASUS, MSI, Acer, Logitech, Razer...) */
export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null); // {id, name}
  const [error, setError] = useState("");
  const toast = useToast();

  function load() {
    api.get("/admin/brands").then(({ data }) => setBrands(data));
  }
  useEffect(load, []);

  async function addBrand(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/brands", { name });
      setName("");
      toast.success("Đã thêm hãng mới.");
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/admin/brands/${editing.id}`, { name: editing.name });
      setEditing(null);
      toast.success("Đã cập nhật.");
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  async function remove(b) {
    if (!window.confirm(`Xóa hãng "${b.name}"?`)) return;
    try {
      await api.delete(`/admin/brands/${b.id}`);
      toast.success("Đã xóa hãng.");
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <AdminLayout title="Quản lý hãng sản xuất (Brand)">
      <div className="card" style={{ maxWidth: 480 }}>
        <h3 className="panel-title">Thêm hãng mới</h3>
        <form onSubmit={addBrand} className="flex gap-8">
          <input className="form-control" placeholder="VD: Keychron" value={name} onChange={(e) => setName(e.target.value)} required />
          <button className="btn btn-primary">Thêm</button>
        </form>
        {error && <div className="alert alert-error mt-8">{error}</div>}
      </div>

      <div className="card mt-16">
        <table className="data-table">
          <thead><tr><th>Tên hãng</th><th>Số sản phẩm</th><th></th></tr></thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id}>
                <td>{editing?.id === b.id ? (
                  <form onSubmit={saveEdit} className="flex gap-8">
                    <input className="form-control" value={editing.name} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} />
                    <button className="btn btn-primary btn-sm">Lưu</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Hủy</button>
                  </form>
                ) : b.name}</td>
                <td>{b.productCount}</td>
                <td>
                  {editing?.id !== b.id && (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing({ id: b.id, name: b.name })}>Sửa</button>{" "}
                      <button className="btn btn-danger btn-sm" onClick={() => remove(b)}>Xóa</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
