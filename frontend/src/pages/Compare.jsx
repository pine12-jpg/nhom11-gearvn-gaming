import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/client";
import { formatVND } from "../utils/format";
import { useCompare } from "../context/CompareContext";
import ProductImage from "../components/ProductImage";

/** US11 — So sánh cấu hình 2-3 sản phẩm cùng lúc */
export default function Compare() {
  const [params] = useSearchParams();
  const { toggle } = useCompare();
  const ids = (params.get("ids") || "").split(",").filter(Boolean);
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ids.length < 2) {
      setItems([]);
      return;
    }
    api
      .get("/products/compare", { params: { ids: ids.join(",") } })
      .then(({ data }) => setItems(data))
      .catch((err) => setError(err?.response?.data?.message || "Không thể tải dữ liệu so sánh."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const rows = [
    ["Hãng", (p) => p.brandName],
    ["Giá", (p) => formatVND(p.finalPrice)],
    ["CPU", (p) => p.cpu],
    ["Card đồ họa (GPU)", (p) => p.gpu],
    ["RAM", (p) => p.ram],
    ["Ổ cứng", (p) => p.storage],
    ["Màn hình", (p) => p.screen],
    ["Đánh giá", (p) => (p.reviewCount ? `${p.avgRating} ★ (${p.reviewCount})` : "Chưa có")],
    ["Tồn kho", (p) => `${p.stock} sản phẩm`],
  ];

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>So sánh sản phẩm</h1>
      {ids.length < 2 && <p className="muted">Hãy chọn ít nhất 2 sản phẩm ở trang danh sách để so sánh (đánh dấu ✓ "So sánh" trên thẻ sản phẩm).</p>}
      {error && <div className="alert alert-error">{error}</div>}

      {items && items.length >= 2 && (
        <div className="table-wrap mt-16">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Thông số</th>
                {items.map((p) => (
                  <th key={p.id}>
                    <div className="mini-thumb" style={{ margin: "0 auto 6px" }}><ProductImage product={p} /></div>
                    <div>{p.name}</div>
                    <Link to={`/san-pham/${p.id}`} className="btn btn-outline btn-sm mt-8">Xem chi tiết</Link>
                    <button className="btn-link mt-8" style={{ display: "block" }} onClick={() => toggle(p.id)}>Bỏ khỏi so sánh</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, get]) => (
                <tr key={label}>
                  <td>{label}</td>
                  {items.map((p) => <td key={p.id}>{get(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
