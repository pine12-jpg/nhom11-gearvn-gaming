import { Link } from "react-router-dom";

/** SpotlightBanner — banner quảng cáo dài theo hãng/ngành hàng, chèn giữa các khối sản phẩm. */
export default function SpotlightBanner({ icon, eyebrow, title, desc, cta, link, tone = "dark" }) {
  return (
    <Link to={link} className={`spotlight-banner tone-${tone}`}>
      <span className="spotlight-icon">{icon}</span>
      <div className="spotlight-text">
        <span className="spotlight-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <span className="btn btn-outline spotlight-cta">{cta} →</span>
    </Link>
  );
}
