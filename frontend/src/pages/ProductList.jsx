import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

/** US07 + US10 — Danh sách sản phẩm: phân trang + lọc theo hãng/ngành hàng/giá/cấu hình */
export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceMin, setPriceMin] = useState(params.get("minPrice") || "");
  const [priceMax, setPriceMax] = useState(params.get("maxPrice") || "");
  const [loading, setLoading] = useState(true);

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const selectedBrands = (params.get("brand") || "").split(",").filter(Boolean).map(Number);
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page")) || 1;
  const sale = params.get("sale") || "";
  const featured = params.get("featured") || "";

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
    api.get("/brands").then(({ data }) => setBrands(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", {
        params: {
          q: q || undefined,
          category: category || undefined,
          brand: selectedBrands.length ? selectedBrands.join(",") : undefined,
          minPrice: params.get("minPrice") || undefined,
          maxPrice: params.get("maxPrice") || undefined,
          sort,
          page,
          sale: sale || undefined,
          featured: featured || undefined,
          limit: 12,
        },
      })
      .then(({ data }) => setResult(data))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value === "" || value === null || value === undefined) next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  function toggleBrand(id) {
    const set = new Set(selectedBrands);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    updateParam("brand", [...set].join(","));
  }

  const currentCategory = categories.find((c) => c.slug === category);

  return (
    <div className="page container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / {currentCategory ? currentCategory.name : q ? `Kết quả cho "${q}"` : "Tất cả sản phẩm"}
      </div>

      <div className="list-layout">
        <aside>
          <div className="filter-box">
            <h4>Ngành hàng</h4>
            <label className="filter-option">
              <input type="radio" checked={!category} onChange={() => updateParam("category", "")} /> Tất cả
            </label>
            {categories.map((c) => (
              <label className="filter-option" key={c.id}>
                <input type="radio" checked={category === c.slug} onChange={() => updateParam("category", c.slug)} />
                {c.icon} {c.name} ({c.productCount})
              </label>
            ))}
          </div>

          <div className="filter-box">
            <h4>Hãng sản xuất</h4>
            {brands.filter((b) => b.productCount > 0).map((b) => (
              <label className="filter-option" key={b.id}>
                <input type="checkbox" checked={selectedBrands.includes(b.id)} onChange={() => toggleBrand(b.id)} />
                {b.name} ({b.productCount})
              </label>
            ))}
          </div>

          <div className="filter-box">
            <h4>Khoảng giá (đ)</h4>
            <div className="filter-price-row">
              <input placeholder="Từ" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <span>-</span>
              <input placeholder="Đến" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
            <button
              className="btn btn-outline btn-sm btn-block mt-8"
              onClick={() => {
                const next = new URLSearchParams(params);
                priceMin ? next.set("minPrice", priceMin) : next.delete("minPrice");
                priceMax ? next.set("maxPrice", priceMax) : next.delete("maxPrice");
                next.delete("page");
                setParams(next);
              }}
            >
              Áp dụng
            </button>
          </div>

          <Link to="/thu-cu-doi-moi" className="sidebar-ad">
            <span className="sidebar-ad-tag">Quảng cáo</span>
            <span className="sidebar-ad-icon">♻️</span>
            <strong>Thu cũ - Đổi mới</strong>
            <p>Trừ thẳng tiền máy cũ khi lên đời laptop/PC gaming mới</p>
          </Link>
        </aside>

        <div>
          <div className="list-toolbar">
            <span className="result-count">{loading ? "Đang tải…" : `${result?.total ?? 0} sản phẩm`}</span>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="discount">Khuyến mãi nhiều nhất</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>

          {loading ? (
            <div className="center muted" style={{ padding: 40 }}>Đang tải sản phẩm…</div>
          ) : result?.items.length ? (
            <>
              <div className="product-grid">
                {result.items.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              <Pagination page={result.page} totalPages={result.totalPages} onChange={(p) => updateParam("page", p)} />
            </>
          ) : (
            <div className="empty-state">
              <div className="ico">🔍</div>
              <p>Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
