import { Link } from "react-router-dom";
import { formatVND } from "../utils/format";
import StarRating from "./StarRating";
import ProductImage from "./ProductImage";
import { useCart } from "../context/CartContext";
import { useCompare } from "../context/CompareContext";
import { useToast } from "../context/ToastContext";

/** US06/US07 — thẻ sản phẩm dùng lại ở trang chủ, danh sách, liên quan, so sánh */
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { ids, toggle, isFull } = useCompare();
  const toast = useToast();
  const outOfStock = product.stock <= 0;
  const checked = ids.includes(product.id);

  function handleAddCart(e) {
    e.preventDefault();
    if (outOfStock) return;
    addItem(product, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng.`);
  }

  function handleToggleCompare(e) {
    e.preventDefault();
    if (!checked && isFull) {
      toast.info("Bạn chỉ có thể so sánh tối đa 3 sản phẩm.");
      return;
    }
    toggle(product.id);
  }

  return (
    <Link to={`/san-pham/${product.id}`} className="product-card">
      <div className="product-thumb">
        {product.discountPercent > 0 && <span className="discount-badge">-{product.discountPercent}%</span>}
        <label className="compare-check" onClick={handleToggleCompare}>
          <input type="checkbox" checked={checked} readOnly /> So sánh
        </label>
        <ProductImage product={product} />
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brandName}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-specs-mini">
          {[product.cpu, product.gpu, product.ram].filter((s) => s && s !== "—").slice(0, 2).join(" • ")}
        </div>
        {product.reviewCount > 0 && <StarRating value={product.avgRating} count={product.reviewCount} />}
        <div className="product-price-row">
          <span className="price-final">{formatVND(product.finalPrice)}</span>
          {product.discountPercent > 0 && <span className="price-original">{formatVND(product.price)}</span>}
        </div>
        {outOfStock ? (
          <span className="stock-out">Tạm hết hàng</span>
        ) : product.stock <= 5 ? (
          <span className="stock-warning">Chỉ còn {product.stock} sản phẩm</span>
        ) : null}
        <button className="add-cart-btn" onClick={handleAddCart} disabled={outOfStock}>
          {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </Link>
  );
}
