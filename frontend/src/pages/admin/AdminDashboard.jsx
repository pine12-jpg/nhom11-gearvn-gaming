import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../api/client";
import { formatVND } from "../../utils/format";

/** US35 — Báo cáo thống kê doanh thu theo ngày/tháng + tồn kho thấp + sản phẩm bán chạy */
export default function AdminDashboard() {
  const [range, setRange] = useState("day");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats", { params: { range } }).then(({ data }) => setStats(data));
  }, [range]);

  const maxRevenue = stats ? Math.max(...stats.series.map((s) => s.revenue), 1) : 1;

  return (
    <AdminLayout title="Tổng quan & Thống kê doanh thu">
      {!stats ? (
        <div className="muted">Đang tải dữ liệu…</div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="label">Tổng doanh thu (đơn hợp lệ)</div>
              <div className="value red">{formatVND(stats.totals.revenue)}</div>
            </div>
            <div className="stat-card">
              <div className="label">Tổng số đơn hàng</div>
              <div className="value">{stats.totals.orders}</div>
            </div>
            <div className="stat-card">
              <div className="label">Đơn đang xử lý</div>
              <div className="value">{stats.totals.pendingOrders}</div>
            </div>
            <div className="stat-card">
              <div className="label">Khách hàng / Sản phẩm</div>
              <div className="value">{stats.totals.customers} / {stats.totals.products}</div>
            </div>
          </div>

          <div className="card">
            <div className="toolbar-row">
              <h3 className="panel-title" style={{ marginBottom: 0 }}>Doanh thu theo {range === "day" ? "ngày" : "tháng"} (14 kỳ gần nhất)</h3>
              <select className="form-control" style={{ width: 160 }} value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="day">Theo ngày</option>
                <option value="month">Theo tháng</option>
              </select>
            </div>
            <div className="bar-chart">
              {stats.series.map((s) => (
                <div className="bar-col" key={s.label} title={`${s.label}: ${formatVND(s.revenue)} (${s.orders} đơn)`}>
                  <div className="bar" style={{ height: `${(s.revenue / maxRevenue) * 100}%` }} />
                  <div className="bar-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-layout mt-16" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="card">
              <h3 className="panel-title">🔥 Sản phẩm bán chạy</h3>
              {stats.topProducts.length === 0 && <p className="muted">Chưa có dữ liệu.</p>}
              <table className="data-table">
                <tbody>
                  {stats.topProducts.map((p) => (
                    <tr key={p.productId}>
                      <td>{p.name}</td>
                      <td>{p.quantity} đã bán</td>
                      <td>{formatVND(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3 className="panel-title">⚠️ Sắp hết hàng (≤ 5 sản phẩm)</h3>
              {stats.lowStock.length === 0 && <p className="muted">Không có sản phẩm nào sắp hết hàng.</p>}
              <table className="data-table">
                <tbody>
                  {stats.lowStock.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td><span className="badge badge-cancelled">Còn {p.stock}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
