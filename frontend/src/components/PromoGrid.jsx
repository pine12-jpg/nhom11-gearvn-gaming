import { Link } from "react-router-dom";

const ITEMS = [
  { icon: "🚚", title: "Miễn phí vận chuyển", desc: "Đơn hàng từ 3.000.000đ", link: "/huong-dan" },
  { icon: "💳", title: "Trả góp 0% lãi suất", desc: "Qua đối tác tài chính", link: "/huong-dan" },
  { icon: "♻️", title: "Thu cũ - Đổi mới", desc: "Định giá nhanh trong 24h", link: "/thu-cu-doi-moi" },
  { icon: "🛡️", title: "Bảo hành chính hãng", desc: "Lên đến 24 tháng", link: "/bao-hanh" },
];

/** PromoGrid — dải banner quảng cáo chính sách/ưu đãi, thường thấy ngay dưới banner chính của GEARVN. */
export default function PromoGrid() {
  return (
    <div className="promo-grid">
      {ITEMS.map((it) => (
        <Link key={it.title} to={it.link} className="promo-card">
          <span className="promo-icon">{it.icon}</span>
          <div>
            <strong>{it.title}</strong>
            <p>{it.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
