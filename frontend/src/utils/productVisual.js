/**
 * productVisual.js
 *
 * Website không dùng ảnh chụp sản phẩm thật (ảnh sản phẩm của các hãng/đại lý đều
 * có bản quyền, không thể tự ý sao chép vào đồ án). Thay vào đó, mỗi sản phẩm được
 * hiển thị bằng một hình minh họa (icon) do nhóm tự vẽ bằng SVG, chọn đúng theo
 * loại thiết bị (laptop/PC/màn hình/bàn phím/chuột/tai nghe/ghế/bàn/VGA/RAM...)
 * và tô màu nhấn theo thương hiệu để mỗi sản phẩm vẫn có nhận diện riêng biệt.
 *
 * Xem component hiển thị tương ứng tại: src/components/ProductImage.jsx
 */

// Màu nhấn gợi nhớ thương hiệu (không dùng logo/biểu trưng, chỉ dùng 1 tông màu đặc trưng)
const BRAND_COLORS = {
  "ASUS ROG": "#ff2340",
  "MSI": "#ff2d2d",
  "Acer Predator": "#00c2ff",
  "Lenovo Legion": "#ff8a00",
  "Dell Alienware": "#00d4ff",
  "Logitech G": "#00b8fc",
  "Razer": "#44d62c",
  "SteelSeries": "#ff6900",
  "Corsair": "#ffd400",
  "AKKO": "#8b7cf6",
  "HyperX": "#e2231a",
  "LG": "#ff3d71",
  "Samsung": "#1676d6",
  "AOC": "#e2001a",
  "Gigabyte": "#ff7800",
  "DXRacer": "#e2231a",
  "E-Dra": "#00b386",
};
const DEFAULT_COLOR = "#e21221";

export function getBrandColor(brandName) {
  return BRAND_COLORS[brandName] || DEFAULT_COLOR;
}

const CATEGORY_TYPE = {
  "laptop-gaming": "laptop",
  "pc-gaming": "pc",
  "man-hinh": "monitor",
  "ban-phim": "keyboard",
  "chuot": "mouse",
  "tai-nghe": "headset",
};

/** Suy ra loại hình minh họa (và vài trường hợp cần phân biệt theo tên sản phẩm) */
export function getVisualType(product) {
  const slug = product?.categorySlug;
  const name = (product?.name || "").toLowerCase();

  if (slug === "ghe-ban") return name.includes("bàn") ? "desk" : "chair";
  if (slug === "linh-kien") return name.includes("ram") ? "ram" : "gpu";
  return CATEGORY_TYPE[slug] || "laptop";
}

export function getProductVisual(product) {
  return { type: getVisualType(product), color: getBrandColor(product?.brandName) };
}
