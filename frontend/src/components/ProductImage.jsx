import { useState } from "react";
import { getProductVisual } from "../utils/productVisual";

/**
 * ProductImage — hiển thị ảnh sản phẩm.
 *
 * Ưu tiên ảnh thật nếu sản phẩm có `product.image` (đường dẫn file trong
 * frontend/public/, ví dụ "/products/asus-rog-strix-g16.jpg" — xem hướng dẫn
 * thêm ảnh tại frontend/public/products/README.md). Nếu sản phẩm chưa có ảnh
 * thật, hoặc file ảnh chưa được thêm vào máy (load lỗi), tự động hiển thị hình
 * minh họa SVG do nhóm tự vẽ thay thế — không bao giờ hiện icon ảnh vỡ.
 *
 * Hình minh họa SVG chọn đúng kiểu dáng theo ngành hàng (laptop/PC/màn hình/
 * bàn phím/chuột/tai nghe/ghế/bàn/VGA/RAM) và tô theo màu thương hiệu, xem quy
 * tắc chọn ở src/utils/productVisual.js.
 */
export default function ProductImage({ product, className = "", title }) {
  const [imgError, setImgError] = useState(false);
  const { type, color } = getProductVisual(product);

  if (product?.image && !imgError) {
    return (
      <img
        src={product.image}
        alt={title || product.name || "Ảnh sản phẩm"}
        className={`product-visual product-photo ${className}`.trim()}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }
  const dark = "#232733";
  const darker = "#1a1d24";
  const mid = "#2d3240";
  const light = "#3b4150";

  const common = {
    viewBox: "0 0 120 120",
    className: `product-visual ${className}`.trim(),
    role: "img",
    "aria-label": title || product?.name || "Hình minh họa sản phẩm",
  };

  switch (type) {
    case "laptop":
      return (
        <svg {...common}>
          <rect x="28" y="14" width="64" height="46" rx="5" fill={dark} />
          <rect x="32.5" y="18.5" width="55" height="37" rx="2" fill={color} opacity="0.16" />
          <rect x="32.5" y="18.5" width="55" height="37" rx="2" fill="none" stroke={color} strokeWidth="1.4" opacity="0.6" />
          <circle cx="60" cy="16" r="1.1" fill="#6b7280" />
          <path d="M16 64 H104 L96 82 H24 Z" fill={mid} />
          <rect x="16" y="62" width="88" height="3.5" rx="1.75" fill={light} />
          <rect x="49" y="70" width="22" height="8" rx="2" fill={light} />
          <rect x="24" y="84" width="72" height="2.4" rx="1.2" fill={color} />
        </svg>
      );

    case "pc":
      return (
        <svg {...common}>
          <rect x="38" y="10" width="44" height="98" rx="7" fill={dark} />
          <rect x="38" y="10" width="44" height="5" rx="2.5" fill={color} />
          <rect x="44.5" y="20" width="31" height="80" rx="4" fill={darker} stroke={color} strokeOpacity="0.35" />
          <circle cx="60" cy="40" r="10.5" fill="none" stroke={color} strokeWidth="2" opacity="0.85" />
          <circle cx="60" cy="40" r="2" fill={color} />
          <path d="M60 40 L60 31 M60 40 L68 35 M60 40 L68 45 M60 40 L52 45 M60 40 L52 35" stroke={color} strokeWidth="1.2" opacity="0.6" />
          <circle cx="60" cy="74" r="10.5" fill="none" stroke={color} strokeWidth="2" opacity="0.85" />
          <circle cx="60" cy="74" r="2" fill={color} />
          <path d="M60 74 L60 65 M60 74 L68 69 M60 74 L68 79 M60 74 L52 79 M60 74 L52 69" stroke={color} strokeWidth="1.2" opacity="0.6" />
          <circle cx="45.5" cy="16" r="1.8" fill={color} />
        </svg>
      );

    case "monitor":
      return (
        <svg {...common}>
          <rect x="12" y="20" width="96" height="58" rx="5" fill={dark} />
          <rect x="17.5" y="25.5" width="85" height="47" rx="2" fill={color} opacity="0.16" />
          <rect x="17.5" y="25.5" width="85" height="47" rx="2" fill="none" stroke={color} strokeWidth="1.4" opacity="0.6" />
          <circle cx="60" cy="74" r="1.3" fill={color} />
          <path d="M50 78 H70 L75 92 H45 Z" fill={mid} />
          <rect x="32" y="92" width="56" height="6" rx="3" fill={mid} />
        </svg>
      );

    case "keyboard": {
      const rows = [
        { y: 44, count: 13, w: 5.3 },
        { y: 52, count: 13, w: 5.3 },
        { y: 60, count: 12, w: 5.3 },
      ];
      return (
        <svg {...common}>
          <rect x="8" y="34" width="104" height="50" rx="6" fill={dark} />
          {rows.map((row, ri) =>
            Array.from({ length: row.count }).map((_, i) => (
              <rect
                key={`${ri}-${i}`}
                x={16 + i * (row.w + 1.2)}
                y={row.y}
                width={row.w}
                height={5.4}
                rx="1.2"
                fill={light}
              />
            ))
          )}
          <rect x="30" y="68" width="60" height="6" rx="2.4" fill={light} />
          <rect x="8" y="78" width="104" height="2.6" rx="1.3" fill={color} />
        </svg>
      );
    }

    case "mouse":
      return (
        <svg {...common}>
          <rect x="41" y="26" width="38" height="62" rx="19" fill={dark} />
          <line x1="60" y1="26" x2="60" y2="46" stroke={darker} strokeWidth="1.6" />
          <rect x="56.5" y="38" width="7" height="12" rx="3.5" fill={color} />
          <ellipse cx="51" cy="36" rx="7" ry="10" fill="#ffffff" opacity="0.06" />
          <rect x="41" y="82" width="38" height="4" rx="2" fill={color} opacity="0.9" />
        </svg>
      );

    case "headset":
      return (
        <svg {...common}>
          <path d="M26 58 C26 24 94 24 94 58" fill="none" stroke={dark} strokeWidth="7" strokeLinecap="round" />
          <rect x="13" y="52" width="19" height="30" rx="9.5" fill={dark} />
          <rect x="88" y="52" width="19" height="30" rx="9.5" fill={dark} />
          <circle cx="22.5" cy="67" r="6.5" fill="none" stroke={color} strokeWidth="2.2" />
          <circle cx="97.5" cy="67" r="6.5" fill="none" stroke={color} strokeWidth="2.2" />
          <path d="M14 74 Q4 82 11 90" fill="none" stroke={dark} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="11" cy="90" r="2.6" fill={color} />
        </svg>
      );

    case "chair":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="18" rx="15" ry="8.5" fill={mid} />
          <rect x="27" y="11" width="66" height="48" rx="15" fill={dark} />
          <rect x="55.5" y="16" width="9" height="39" rx="4.5" fill={color} opacity="0.85" />
          <rect x="33" y="60" width="54" height="17" rx="8" fill={dark} />
          <rect x="20" y="62" width="11" height="5" rx="2.5" fill={mid} />
          <rect x="89" y="62" width="11" height="5" rx="2.5" fill={mid} />
          <rect x="57" y="77" width="6" height="17" fill={light} />
          <ellipse cx="60" cy="97" rx="32" ry="4.5" fill={mid} />
          <circle cx="30" cy="97" r="2.3" fill={light} />
          <circle cx="60" cy="100" r="2.3" fill={light} />
          <circle cx="90" cy="97" r="2.3" fill={light} />
        </svg>
      );

    case "desk":
      return (
        <svg {...common}>
          <rect x="10" y="40" width="100" height="9" rx="3" fill={dark} />
          <rect x="10" y="48" width="100" height="2.4" rx="1.2" fill={color} />
          <rect x="20" y="50" width="7" height="48" rx="2" fill={mid} />
          <rect x="93" y="50" width="7" height="48" rx="2" fill={mid} />
          <line x1="27" y1="72" x2="93" y2="72" stroke={mid} strokeWidth="3.2" />
          <circle cx="60" cy="44.5" r="4.2" fill={darker} stroke={color} strokeWidth="1.2" />
        </svg>
      );

    case "gpu":
      return (
        <svg {...common}>
          <rect x="12" y="38" width="94" height="34" rx="6" fill={dark} />
          <rect x="12" y="38" width="94" height="4" rx="2" fill={color} opacity="0.9" />
          <circle cx="37" cy="55" r="12.5" fill="none" stroke={color} strokeWidth="2" opacity="0.85" />
          <circle cx="37" cy="55" r="2" fill={color} />
          <circle cx="77" cy="55" r="12.5" fill="none" stroke={color} strokeWidth="2" opacity="0.85" />
          <circle cx="77" cy="55" r="2" fill={color} />
          <rect x="106" y="42" width="6" height="5" fill={mid} />
          <rect x="106" y="51" width="6" height="5" fill={mid} />
          <rect x="106" y="60" width="6" height="5" fill={mid} />
        </svg>
      );

    case "ram":
      return (
        <svg {...common}>
          <rect x="44" y="10" width="32" height="88" rx="4" fill={dark} />
          <rect x="44" y="10" width="32" height="15" rx="4" fill={color} opacity="0.85" />
          {[34, 44, 54, 64, 74, 84].map((y) => (
            <line key={y} x1="48" y1={y} x2="72" y2={y} stroke={light} strokeWidth="1.6" />
          ))}
          <rect x="48" y="94" width="24" height="7" rx="1" fill="#d7b24d" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <rect x="20" y="20" width="80" height="80" rx="10" fill={dark} />
          <circle cx="60" cy="60" r="18" fill="none" stroke={color} strokeWidth="2.5" />
        </svg>
      );
  }
}
