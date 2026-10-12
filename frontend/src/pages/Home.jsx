import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import PromoGrid from "../components/PromoGrid";
import FlashSaleBanner from "../components/FlashSaleBanner";
import SpotlightBanner from "../components/SpotlightBanner";

/** US06 — Trang chủ: sản phẩm nổi bật, khuyến mãi, hãng, danh mục, tin tức */
export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/home").then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="page container center muted">Đang tải trang chủ…</div>;

  return (
    <div className="page container">
      <HeroCarousel />
      <PromoGrid />

      <section className="section-title">
        <h2>Danh mục sản phẩm</h2>
      </section>
      <div className="category-grid mt-16">
        {data.categories.map((c) => (
          <Link key={c.id} to={`/san-pham?category=${c.slug}`} className="category-card">
            <div className="ico">{c.icon}</div>
            {c.name}
          </Link>
        ))}
      </div>

      <section className="section-title mt-24">
        <h2>Thương hiệu nổi bật</h2>
      </section>
      <div className="brand-strip">
        {data.brands.map((b) => (
          <Link key={b.id} to={`/san-pham?brand=${b.id}`} className="brand-chip">
            {b.name}
          </Link>
        ))}
      </div>

      <FlashSaleBanner />

      {data.onSale.length > 0 && (
        <>
          <section className="section-title mt-24">
            <h2>🔥 Đang khuyến mãi</h2>
            <Link className="more" to="/san-pham?sale=1">Xem tất cả ›</Link>
          </section>
          <div className="product-grid">
            {data.onSale.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}

      <SpotlightBanner
        tone="dark"
        icon="💻"
        eyebrow="ASUS ROG Collection"
        title="Laptop ROG Strix — Trang bị tản nhiệt Intelligent Cooling"
        desc="Hiệu năng vượt trội cho game thủ và sáng tạo nội dung, bàn phím RGB per-key."
        cta="Khám phá ASUS ROG"
        link="/san-pham?brand=1"
      />

      <section className="section-title mt-24">
        <h2>⭐ Sản phẩm nổi bật</h2>
        <Link className="more" to="/san-pham?featured=1">Xem tất cả ›</Link>
      </section>
      <div className="product-grid">
        {data.featured.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <SpotlightBanner
        tone="red"
        icon="🖱️"
        eyebrow="Razer Gaming Gear"
        title="Chuột & bàn phím Razer — Tốc độ phản hồi dành cho pro-gamer"
        desc="Cảm biến quang học chính xác cao, đèn Chroma RGB 16.8 triệu màu."
        cta="Khám phá Razer"
        link="/san-pham?brand=7"
      />

      <section className="section-title mt-24">
        <h2>🆕 Hàng mới về</h2>
        <Link className="more" to="/san-pham">Xem tất cả ›</Link>
      </section>
      <div className="product-grid">
        {data.newest.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {data.news.length > 0 && (
        <>
          <section className="section-title mt-24">
            <h2>📰 Tin tức - Review</h2>
            <Link className="more" to="/tin-tuc">Xem tất cả ›</Link>
          </section>
          <div className="news-grid">
            {data.news.map((n) => (
              <Link key={n.id} to={`/tin-tuc/${n.id}`} className="news-card">
                <div className="cover">{n.coverIcon}</div>
                <div className="body">
                  <div className="meta">{n.author} • {n.createdAt}</div>
                  <h3>{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
