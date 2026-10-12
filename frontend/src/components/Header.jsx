import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatVND } from "../utils/format";
import ProductImage from "./ProductImage";

/** US06 + US09 — thanh điều hướng, tìm kiếm có gợi ý, giỏ hàng, tài khoản */
export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setShowSuggest(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      api.get("/products/suggest", { params: { q } }).then(({ data }) => setSuggestions(data)).catch(() => {});
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  function submitSearch(e) {
    e.preventDefault();
    setShowSuggest(false);
    navigate(`/san-pham?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container">
          <span>Hotline mua hàng: 1900 5301 — Miễn phí vận chuyển đơn từ 3.000.000đ</span>
          <div className="topbar-links">
            <Link to="/showroom">Hệ thống showroom</Link>
            <Link to="/tin-tuc">Tin tức - Review</Link>
            <Link to="/thu-cu-doi-moi">Thu cũ - Đổi mới</Link>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <Link to="/" className="logo">
            GVN<span>GAMING</span>
          </Link>

          <div className="search-box" ref={boxRef}>
            <form onSubmit={submitSearch}>
              <input
                placeholder="Tìm laptop gaming, PC, bàn phím, chuột, tai nghe…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setShowSuggest(true)}
              />
              <button type="submit">🔍</button>
            </form>
            {showSuggest && suggestions.length > 0 && (
              <div className="search-suggest">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="search-suggest-item"
                    onMouseDown={() => {
                      setShowSuggest(false);
                      setQ("");
                      navigate(`/san-pham/${s.id}`);
                    }}
                  >
                    <span className="mini-thumb"><ProductImage product={s} /></span>
                    <span className="name">{s.name}</span>
                    <span className="price">{formatVND(s.finalPrice)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="header-actions">
            {isAuthenticated ? (
              <div className="account-menu" tabIndex={0}>
                <div className="header-action">
                  <span className="ico">👤</span>
                  <span>{user.name?.split(" ").pop()}</span>
                </div>
                <div className="account-dropdown">
                  <Link to="/tai-khoan">Thông tin tài khoản</Link>
                  <Link to="/don-hang">Đơn hàng của tôi</Link>
                  <Link to="/thu-cu-doi-moi">Thu cũ - Đổi mới</Link>
                  {user.role === "admin" && <Link to="/admin">Trang quản trị</Link>}
                  <button onClick={() => { logout(); navigate("/dang-ky"); }}>Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link to="/dang-nhap" className="header-action">
                <span className="ico">👤</span>
                <span>Đăng nhập</span>
              </Link>
            )}
            <Link to="/gio-hang" className="header-action">
              <span className="ico">🛒</span>
              <span>Giỏ hàng</span>
              {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      <nav className="nav-bar">
        <div className="container">
          <NavLink to="/san-pham" end className={({ isActive }) => (isActive ? "active" : "")}>
            Tất cả sản phẩm
          </NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/san-pham?category=${c.slug}`}>
              {c.icon} {c.name}
            </NavLink>
          ))}
          <NavLink to="/so-sanh">So sánh sản phẩm</NavLink>
        </div>
      </nav>
    </header>
  );
}
