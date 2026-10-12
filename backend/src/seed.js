/**
 * seed.js — tạo dữ liệu mẫu ban đầu cho website (thương hiệu, ngành hàng,
 * sản phẩm, showroom, tin tức, voucher, tài khoản admin/khách demo...).
 *
 * Chạy: npm run seed   (sẽ ghi đè lại data/db.json)
 * File server.js cũng tự động gọi hàm ensureSeeded() khi db.json chưa tồn tại,
 * nên chỉ cần `npm run dev` là có dữ liệu để demo ngay.
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const CATEGORIES = [
  { id: 1, slug: "laptop-gaming", name: "Laptop Gaming", icon: "💻" },
  { id: 2, slug: "pc-gaming", name: "PC Gaming (Build sẵn)", icon: "🖥️" },
  { id: 3, slug: "man-hinh", name: "Màn hình", icon: "🖵" },
  { id: 4, slug: "ban-phim", name: "Bàn phím cơ", icon: "⌨️" },
  { id: 5, slug: "chuot", name: "Chuột gaming", icon: "🖱️" },
  { id: 6, slug: "tai-nghe", name: "Tai nghe gaming", icon: "🎧" },
  { id: 7, slug: "ghe-ban", name: "Ghế - Bàn Gaming", icon: "🪑" },
  { id: 8, slug: "linh-kien", name: "Linh kiện PC", icon: "🔧" },
];

const BRANDS = [
  { id: 1, name: "ASUS ROG" },
  { id: 2, name: "MSI" },
  { id: 3, name: "Acer Predator" },
  { id: 4, name: "Lenovo Legion" },
  { id: 5, name: "Dell Alienware" },
  { id: 6, name: "Logitech G" },
  { id: 7, name: "Razer" },
  { id: 8, name: "SteelSeries" },
  { id: 9, name: "Corsair" },
  { id: 10, name: "AKKO" },
  { id: 11, name: "HyperX" },
  { id: 12, name: "LG" },
  { id: 13, name: "Samsung" },
  { id: 14, name: "AOC" },
  { id: 15, name: "Gigabyte" },
  { id: 16, name: "DXRacer" },
  { id: 17, name: "E-Dra" },
];

// helper: tra id theo tên cho gọn khi khai báo sản phẩm
const B = Object.fromEntries(BRANDS.map((b) => [b.name, b.id]));
const C = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.id]));

const PRODUCTS = [
  // ---- Laptop Gaming ----
  {
    name: "ASUS ROG Strix G16 (2024) G614",
    brand: B["ASUS ROG"], category: C["laptop-gaming"],
    price: 34990000, salePrice: 32990000,
    cpu: "Intel Core i7-13650HX", gpu: "NVIDIA RTX 4060 8GB", ram: "16GB DDR5",
    storage: "512GB SSD NVMe", screen: "16\" QHD+ 165Hz",
    description: "Laptop gaming hiệu năng cao dành cho game thủ và sáng tạo nội dung, tản nhiệt ROG Intelligent Cooling, bàn phím RGB per-key.",
    stock: 12, featured: true, image: "/products/asus-rog-strix-g16.jpg",
  },
  {
    name: "MSI Katana 15 B13V",
    brand: B["MSI"], category: C["laptop-gaming"],
    price: 32990000, salePrice: 29990000,
    cpu: "Intel Core i7-13620H", gpu: "NVIDIA RTX 4070 8GB", ram: "16GB DDR5",
    storage: "1TB SSD NVMe", screen: "15.6\" FHD 144Hz",
    description: "Thiết kế mỏng nhẹ, hiệu năng mạnh mẽ với RTX 4070, phù hợp vừa chiến game vừa làm việc.",
    stock: 8, featured: true, image: "/products/msi-katana-15-b13v.jpg",
  },
  {
    name: "Acer Predator Helios Neo 16",
    brand: B["Acer Predator"], category: C["laptop-gaming"],
    price: 37490000, salePrice: null,
    cpu: "Intel Core i9-13900HX", gpu: "NVIDIA RTX 4060 8GB", ram: "16GB DDR5",
    storage: "512GB SSD NVMe", screen: "16\" WQXGA 165Hz",
    description: "Chip i9 hiệu năng khủng, hệ thống tản nhiệt kép Predator CoolBoost, màn hình sắc nét.",
    stock: 6, featured: false, image: "/products/acer-predator-helios-neo-16.jpg",
  },
  {
    name: "Lenovo Legion 5 Pro",
    brand: B["Lenovo Legion"], category: C["laptop-gaming"],
    price: 31990000, salePrice: 28990000,
    cpu: "AMD Ryzen 7 7745HX", gpu: "NVIDIA RTX 4060 8GB", ram: "16GB DDR5",
    storage: "512GB SSD NVMe", screen: "16\" QHD 165Hz",
    description: "Cấu hình AMD mạnh mẽ, màn hình QHD màu sắc chuẩn xác, loa Harman Kardon.",
    stock: 10, featured: true, image: "/products/lenovo-legion-5-pro.jpg",
  },
  {
    name: "ASUS TUF Gaming A15",
    brand: B["ASUS ROG"], category: C["laptop-gaming"],
    price: 18990000, salePrice: 17490000,
    cpu: "AMD Ryzen 5 7535HS", gpu: "NVIDIA RTX 3050 6GB", ram: "8GB DDR5",
    storage: "512GB SSD NVMe", screen: "15.6\" FHD 144Hz",
    description: "Laptop gaming phổ thông, độ bền chuẩn quân đội MIL-STD-810H, giá tốt cho sinh viên.",
    stock: 20, featured: false, image: "/products/asus-tuf-gaming-a15.jpg",
  },
  {
    name: "Dell Alienware m16 R2",
    brand: B["Dell Alienware"], category: C["laptop-gaming"],
    price: 54990000, salePrice: null,
    cpu: "Intel Core i9-14900HX", gpu: "NVIDIA RTX 4070 8GB", ram: "32GB DDR5",
    storage: "1TB SSD NVMe", screen: "16\" QHD+ 240Hz",
    description: "Dòng cao cấp Alienware, màn hình 240Hz siêu mượt, thiết kế đặc trưng khác biệt.",
    stock: 4, featured: false, image: "/products/dell-alienware-m16-r2.jpg",
  },
  // ---- PC Gaming ----
  {
    name: "PC GVN Intel i5 RTX 4060",
    brand: B["Gigabyte"], category: C["pc-gaming"],
    price: 21990000, salePrice: 20490000,
    cpu: "Intel Core i5-13400F", gpu: "NVIDIA RTX 4060 8GB", ram: "16GB DDR4",
    storage: "500GB SSD NVMe", screen: "—",
    description: "Bộ PC build sẵn tối ưu tản nhiệt và luồng khí, chiến tốt mọi tựa game eSports và AAA ở FHD.",
    stock: 15, featured: true,
  },
  {
    name: "PC GVN Ryzen 5 RTX 4060 Ti",
    brand: B["Gigabyte"], category: C["pc-gaming"],
    price: 26990000, salePrice: null,
    cpu: "AMD Ryzen 5 7500F", gpu: "NVIDIA RTX 4060 Ti 8GB", ram: "16GB DDR5",
    storage: "1TB SSD NVMe", screen: "—",
    description: "Cấu hình AMD mới nhất, hiệu năng/giá tốt, sẵn sàng nâng cấp về sau.",
    stock: 9, featured: false,
  },
  {
    name: "PC GVN Intel i7 RTX 4070 Super",
    brand: B["Gigabyte"], category: C["pc-gaming"],
    price: 39990000, salePrice: 37990000,
    cpu: "Intel Core i7-13700F", gpu: "NVIDIA RTX 4070 Super 12GB", ram: "32GB DDR5",
    storage: "1TB SSD NVMe", screen: "—",
    description: "Chiến mọi tựa game ở độ phân giải 2K max setting, dư sức stream/render.",
    stock: 7, featured: true,
  },
  {
    name: "PC GVN Ryzen 9 RTX 4080 Super",
    brand: B["Gigabyte"], category: C["pc-gaming"],
    price: 64990000, salePrice: null,
    cpu: "AMD Ryzen 9 7900X", gpu: "NVIDIA RTX 4080 Super 16GB", ram: "32GB DDR5",
    storage: "2TB SSD NVMe", screen: "—",
    description: "Cấu hình hi-end cho game thủ và creator chuyên nghiệp, chiến 4K mượt mà.",
    stock: 3, featured: false,
  },
  // ---- Màn hình ----
  {
    name: "LG UltraGear 27GP850",
    brand: B["LG"], category: C["man-hinh"],
    price: 8490000, salePrice: 7690000,
    cpu: "—", gpu: "—", ram: "—", storage: "—",
    screen: "27\" QHD Nano IPS 165Hz 1ms",
    description: "Màn hình chuẩn thi đấu, màu sắc chuẩn Nano IPS, hỗ trợ G-Sync/FreeSync.",
    stock: 18, featured: true,
  },
  {
    name: "ASUS TUF Gaming VG27AQ",
    brand: B["ASUS ROG"], category: C["man-hinh"],
    price: 7990000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—",
    screen: "27\" QHD IPS 165Hz 1ms",
    description: "Màn hình phổ biến nhất phân khúc, tấm nền IPS góc nhìn rộng.",
    stock: 14, featured: false,
  },
  {
    name: "Samsung Odyssey G5",
    brand: B["Samsung"], category: C["man-hinh"],
    price: 6990000, salePrice: 6290000,
    cpu: "—", gpu: "—", ram: "—", storage: "—",
    screen: "32\" QHD VA cong 165Hz 1ms",
    description: "Màn hình cong 1000R đắm chìm, phù hợp game đua xe, hành động.",
    stock: 11, featured: false,
  },
  {
    name: "AOC 24G2SP",
    brand: B["AOC"], category: C["man-hinh"],
    price: 3490000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—",
    screen: "24\" FHD IPS 165Hz 1ms",
    description: "Lựa chọn tiết kiệm cho dàn máy eSports, tần số quét cao.",
    stock: 25, featured: false,
  },
  // ---- Bàn phím ----
  {
    name: "Logitech G Pro X Keyboard",
    brand: B["Logitech G"], category: C["ban-phim"],
    price: 2990000, salePrice: 2590000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Bàn phím cơ hotswap switch GX Blue Clicky, nhỏ gọn TKL cho pro-gamer.",
    stock: 22, featured: true,
  },
  {
    name: "Razer BlackWidow V4",
    brand: B["Razer"], category: C["ban-phim"],
    price: 3490000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Switch Green tactile, kê tay êm ái, đèn RGB Chroma 16.8 triệu màu.",
    stock: 16, featured: false,
  },
  {
    name: "AKKO 5075B Plus",
    brand: B["AKKO"], category: C["ban-phim"],
    price: 2190000, salePrice: 1890000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Switch Cream Yellow êm mượt, gasket mount, được yêu thích trong cộng đồng bàn phím cơ.",
    stock: 30, featured: true,
  },
  {
    name: "Corsair K70 RGB Pro",
    brand: B["Corsair"], category: C["ban-phim"],
    price: 3790000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Khung nhôm cao cấp, switch Cherry MX Red, độ bền cao cho game thủ chuyên nghiệp.",
    stock: 9, featured: false,
  },
  // ---- Chuột ----
  {
    name: "Logitech G Pro X Superlight 2",
    brand: B["Logitech G"], category: C["chuot"],
    price: 3290000, salePrice: 2990000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Chuột không dây siêu nhẹ 60g, cảm biến HERO 2 32000 DPI, được pro-player FPS ưa chuộng.",
    stock: 20, featured: true,
  },
  {
    name: "Razer DeathAdder V3",
    brand: B["Razer"], category: C["chuot"],
    price: 1590000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Dáng cầm công thái học kinh điển, cảm biến Focus Pro 30K DPI.",
    stock: 28, featured: false,
  },
  {
    name: "SteelSeries Aerox 5 Wireless",
    brand: B["SteelSeries"], category: C["chuot"],
    price: 2490000, salePrice: 2190000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Thiết kế tổ ong siêu nhẹ, 9 nút lập trình được, phù hợp game MOBA/MMO.",
    stock: 17, featured: false,
  },
  {
    name: "Corsair M75 Air Wireless",
    brand: B["Corsair"], category: C["chuot"],
    price: 2290000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Trọng lượng chỉ 60g, pin 100 giờ, cảm biến quang học 26000 DPI.",
    stock: 13, featured: false,
  },
  // ---- Tai nghe ----
  {
    name: "SteelSeries Arctis Nova 5",
    brand: B["SteelSeries"], category: C["tai-nghe"],
    price: 2890000, salePrice: 2590000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Âm thanh vòm 360°, kết nối không dây 2.4GHz + Bluetooth, mic AI khử ồn.",
    stock: 19, featured: true,
  },
  {
    name: "HyperX Cloud III",
    brand: B["HyperX"], category: C["tai-nghe"],
    price: 1990000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Đệm tai êm ái đeo lâu không mỏi, driver 53mm âm bass mạnh mẽ.",
    stock: 24, featured: false,
  },
  {
    name: "Razer BlackShark V2 X",
    brand: B["Razer"], category: C["tai-nghe"],
    price: 1190000, salePrice: 990000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Nhẹ chỉ 240g, âm thanh định vị chính xác cho game FPS, giá sinh viên.",
    stock: 35, featured: true,
  },
  // ---- Ghế - Bàn Gaming ----
  {
    name: "Ghế Gaming DXRacer Air Series",
    brand: B["DXRacer"], category: C["ghe-ban"],
    price: 6990000, salePrice: 6290000,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Chất liệu lưới thoáng khí, nâng đỡ cột sống, phù hợp ngồi lâu làm việc/chơi game.",
    stock: 8, featured: false,
  },
  {
    name: "Bàn Gaming E-Dra Motorized EGD003",
    brand: B["E-Dra"], category: C["ghe-ban"],
    price: 5490000, salePrice: null,
    cpu: "—", gpu: "—", ram: "—", storage: "—", screen: "—",
    description: "Bàn nâng hạ độ cao bằng điện, khung thép chắc chắn, chịu tải 100kg.",
    stock: 6, featured: false,
  },
  // ---- Linh kiện PC ----
  {
    name: "VGA Gigabyte RTX 4070 Super WINDFORCE",
    brand: B["Gigabyte"], category: C["linh-kien"],
    price: 16990000, salePrice: 15990000,
    cpu: "—", gpu: "NVIDIA RTX 4070 Super 12GB", ram: "—", storage: "—", screen: "—",
    description: "Card đồ họa hiệu năng cao, tản nhiệt 3 quạt WINDFORCE, chiến tốt mọi game ở 2K.",
    stock: 5, featured: true,
  },
  {
    name: "RAM Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz",
    brand: B["Corsair"], category: C["linh-kien"],
    price: 2490000, salePrice: null,
    cpu: "—", gpu: "—", ram: "32GB DDR5 6000MHz", storage: "—", screen: "—",
    description: "Bộ kit RAM hiệu năng cao cho các dòng CPU Intel/AMD thế hệ mới.",
    stock: 21, featured: false,
  },
];

const SHOWROOMS = [
  { id: 1, name: "GVN Gaming - Quận 1", address: "212 Nguyễn Trãi, P. Nguyễn Cư Trinh, Quận 1, TP.HCM", hours: "8:30 - 21:30 (Thứ 2 - Chủ nhật)", phone: "1900 5301" },
  { id: 2, name: "GVN Gaming - Quận 10", address: "97 Hồ Thị Kỷ, P.1, Quận 10, TP.HCM", hours: "8:30 - 21:30 (Thứ 2 - Chủ nhật)", phone: "1900 5301" },
  { id: 3, name: "GVN Gaming - Thủ Đức", address: "234 Kha Vạn Cân, P. Hiệp Bình Chánh, TP. Thủ Đức", hours: "8:30 - 21:30 (Thứ 2 - Chủ nhật)", phone: "1900 5301" },
  { id: 4, name: "GVN Gaming - Cầu Giấy, Hà Nội", address: "88 Trần Thái Tông, Cầu Giấy, Hà Nội", hours: "8:30 - 21:30 (Thứ 2 - Chủ nhật)", phone: "1800 6975" },
  { id: 5, name: "GVN Gaming - Đống Đa, Hà Nội", address: "45 Thái Hà, Đống Đa, Hà Nội", hours: "8:30 - 21:30 (Thứ 2 - Chủ nhật)", phone: "1800 6975" },
];

const NEWS = [
  {
    id: 1,
    title: "So sánh RTX 4060 vs RTX 4060 Ti: Nên chọn laptop nào cho tầm giá 30 triệu?",
    summary: "Phân tích hiệu năng thực tế và mức giá để chọn ra chiếc laptop gaming phù hợp nhất tầm 30 triệu đồng.",
    content: "Ở tầm giá 30 triệu đồng, người dùng thường phân vân giữa các laptop trang bị RTX 4060 và RTX 4060 Ti. Bài viết tổng hợp benchmark ở nhiều tựa game phổ biến, đồng thời phân tích khả năng tản nhiệt, độ ồn và thời lượng pin để đưa ra khuyến nghị phù hợp với từng nhu cầu sử dụng.",
    coverIcon: "📰",
    author: "Đội ngũ biên tập",
    createdAt: "2026-06-02",
  },
  {
    id: 2,
    title: "Đánh giá bàn phím cơ AKKO 5075B Plus: Switch Cream Yellow có gì hay?",
    summary: "Trải nghiệm gõ phím, độ hoàn thiện và mức giá của một trong những bàn phím cơ hot nhất hiện nay.",
    content: "AKKO 5075B Plus gây ấn tượng với cảm giác gõ êm nhờ switch Cream Yellow bôi trơn sẵn, thiết kế gasket-mount cho độ nảy tốt, cùng mức giá dễ tiếp cận với sinh viên và người mới bắt đầu tìm hiểu bàn phím cơ.",
    coverIcon: "⌨️",
    author: "Đội ngũ biên tập",
    createdAt: "2026-06-10",
  },
  {
    id: 3,
    title: "Hướng dẫn chọn màn hình gaming: 144Hz, 165Hz hay 240Hz là đủ?",
    summary: "Tần số quét nào là hợp lý theo từng thể loại game và cấu hình máy bạn đang sở hữu.",
    content: "Tần số quét cao giúp hình ảnh mượt mà hơn nhưng cần đi kèm cấu hình máy đủ mạnh để khai thác hết tiềm năng. Bài viết phân tích nên chọn 144Hz, 165Hz hay 240Hz tùy theo thể loại game (FPS, MOBA, hành động) và ngân sách của bạn.",
    coverIcon: "🖵",
    author: "Đội ngũ biên tập",
    createdAt: "2026-06-18",
  },
];

const VOUCHERS = [
  { code: "GVNGAME10", type: "percent", value: 10, minOrder: 5000000, maxDiscount: 1000000, active: true },
  { code: "FREESHIP", type: "amount", value: 30000, minOrder: 0, maxDiscount: 30000, active: true },
  { code: "SINHVIEN50K", type: "amount", value: 50000, minOrder: 2000000, maxDiscount: 50000, active: true },
];

function buildInitialData() {
  const now = new Date().toISOString();

  const products = PRODUCTS.map((p, idx) => ({
    id: idx + 1,
    ...p,
    createdAt: now,
  }));

  const users = [
    {
      id: 1,
      name: "Quản trị viên",
      email: "admin@gvngaming.vn",
      phone: "0900000000",
      passwordHash: bcrypt.hashSync("Admin@123", 8),
      role: "admin",
      address: "",
      isHssv: false,
      locked: false,
      createdAt: now,
    },
    {
      id: 2,
      name: "Nguyễn Văn Khách",
      email: "khach@example.com",
      phone: "0912345678",
      passwordHash: bcrypt.hashSync("Khach@123", 8),
      role: "customer",
      address: "123 Lê Lợi, Quận 1, TP.HCM",
      isHssv: false,
      locked: false,
      createdAt: now,
    },
  ];

  const reviews = [
    { id: 1, productId: 1, userId: 2, rating: 5, comment: "Máy chạy mượt, tản nhiệt tốt, đóng gói cẩn thận. Rất hài lòng!", createdAt: now },
    { id: 2, productId: 1, userId: 2, rating: 4, comment: "Cấu hình mạnh nhưng hơi nặng khi mang đi học.", createdAt: now },
    { id: 3, productId: 18, userId: 2, rating: 5, comment: "Gõ rất đã tay, âm thanh switch nghe thích.", createdAt: now },
  ];

  return {
    _counters: {
      users: users.length,
      products: products.length,
      orders: 0,
      order_items: 0,
      reviews: reviews.length,
      tradein_requests: 0,
      news: NEWS.length,
      audit_logs: 0,
      cart_items: 0,
    },
    categories: CATEGORIES,
    brands: BRANDS,
    products,
    users,
    cart_items: [],
    orders: [],
    order_items: [],
    reviews,
    vouchers: VOUCHERS,
    tradein_requests: [],
    showrooms: SHOWROOMS,
    news: NEWS,
    audit_logs: [],
  };
}

function seed({ force = true } = {}) {
  if (!force && fs.existsSync(DB_PATH)) return false;
  const data = buildInitialData();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  return true;
}

function ensureSeeded() {
  return seed({ force: false });
}

if (require.main === module) {
  seed({ force: true });
  console.log("Đã tạo dữ liệu mẫu tại", DB_PATH);
}

module.exports = { seed, ensureSeeded, DB_PATH };
