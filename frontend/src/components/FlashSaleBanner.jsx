import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getEndOfDay() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

/** FlashSaleBanner — quảng cáo "giờ vàng" khuyến mãi với đồng hồ đếm ngược thật,
 * kiểu banner flash sale thường thấy trên các sàn TMĐT / GEARVN. */
export default function FlashSaleBanner() {
  const [remaining, setRemaining] = useState(() => getEndOfDay() - new Date());

  useEffect(() => {
    const t = setInterval(() => {
      const diff = getEndOfDay() - new Date();
      setRemaining(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);

  return (
    <Link to="/san-pham?sale=1" className="flash-sale-banner">
      <div className="flash-sale-left">
        <span className="flash-sale-tag">⚡ FLASH SALE</span>
        <span className="flash-sale-title">Giá sốc hôm nay — giảm đến 10%</span>
      </div>
      <div className="flash-sale-countdown">
        <span>Kết thúc sau</span>
        <div className="countdown-digits">
          <span>{pad(h)}</span>:<span>{pad(m)}</span>:<span>{pad(s)}</span>
        </div>
      </div>
      <span className="btn btn-dark">Xem ngay →</span>
    </Link>
  );
}
