import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * HeroCarousel — banner quảng cáo xoay tự động ở đầu trang chủ, mô phỏng khu vực
 * banner khuyến mãi của GEARVN (trang chủ có banner khuyến mãi và sản phẩm nổi
 * bật theo hãng — US06). Nội dung do nhóm tự thiết kế (gradient + icon + chữ),
 * không dùng ảnh quảng cáo/banner thật của GearVN hay bất kỳ hãng nào.
 */
const SLIDES = [
  {
    key: "laptop",
    badge: "🔥 Khuyến mãi laptop gaming",
    title: "Laptop Gaming giảm đến 15%",
    desc: "ASUS ROG, MSI, Acer Predator, Lenovo Legion — card đồ họa RTX thế hệ mới, trả góp 0%.",
    cta: "Săn deal laptop",
    link: "/san-pham?category=laptop-gaming",
    icon: "💻",
    gradient: "linear-gradient(120deg,#0b0e14,#1a1e27 55%,#b80e1b)",
  },
  {
    key: "pc",
    badge: "🖥️ PC Gaming build sẵn",
    title: "Chiến mọi tựa game ở mọi mức giá",
    desc: "PC GVN build sẵn, tối ưu tản nhiệt — hoặc để đội ngũ tư vấn build theo đúng ngân sách của bạn.",
    cta: "Khám phá PC Gaming",
    link: "/san-pham?category=pc-gaming",
    icon: "🖥️",
    gradient: "linear-gradient(120deg,#0b0e14,#17202b 55%,#0e6fa8)",
  },
  {
    key: "gear",
    badge: "⌨️ Combo Gaming Gear",
    title: "Nâng cấp dàn setup: bàn phím, chuột, tai nghe",
    desc: "Logitech G, Razer, SteelSeries, Corsair, AKKO — mua combo tiết kiệm hơn.",
    cta: "Mua Gaming Gear",
    link: "/san-pham?category=ban-phim",
    icon: "⌨️",
    gradient: "linear-gradient(120deg,#0b0e14,#1c1424 55%,#5b21b6)",
  },
  {
    key: "tradein",
    badge: "♻️ Thu cũ - Đổi mới",
    title: "Lên đời máy mới, trừ thẳng tiền máy cũ",
    desc: "Định giá nhanh trong 24h, trừ trực tiếp vào hóa đơn mua laptop/PC gaming mới.",
    cta: "Định giá máy cũ",
    link: "/thu-cu-doi-moi",
    icon: "♻️",
    gradient: "linear-gradient(120deg,#0b0e14,#142018 55%,#0f7a42)",
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <section
      className="hero-carousel"
      style={{ background: slide.gradient }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        className="hero-arrow left"
        aria-label="Banner trước"
        onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
      >
        ‹
      </button>

      <div className="hero-carousel-body" onClick={() => navigate(slide.link)}>
        <div className="hero-carousel-text">
          <span className="hero-badge">{slide.badge}</span>
          <h1>{slide.title}</h1>
          <p>{slide.desc}</p>
          <span className="btn btn-primary mt-8" style={{ width: "fit-content" }}>{slide.cta} →</span>
        </div>
        <div className="hero-carousel-icon">{slide.icon}</div>
      </div>

      <button
        className="hero-arrow right"
        aria-label="Banner tiếp theo"
        onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
      >
        ›
      </button>

      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            className={i === index ? "active" : ""}
            aria-label={`Xem banner ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
