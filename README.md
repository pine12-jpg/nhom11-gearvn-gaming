# GVN Gaming — Website bán thiết bị Gaming (theo phong cách nền tảng GEARVN)

Đồ án môn **Công Nghệ Phần Mềm Nâng Cao** — Nhóm 11.
Website thương mại điện tử bán thiết bị gaming (laptop gaming, PC gaming, màn hình,
bàn phím, chuột, tai nghe, ghế - bàn gaming, linh kiện PC), xây dựng dựa trên bản
**Product Backlog** của nhóm (file `Nhom11_ProductBacklog_GEARVN_ThietBiGaming.docx`),
đầy đủ 37 user story / 121 story point / 4 sprint như trong backlog.

## 1. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React 18 + Vite + React Router 6 + Axios |
| Backend | Node.js + Express |
| "Cơ sở dữ liệu" | File JSON (`backend/data/db.json`) — không cần cài MySQL/MongoDB |
| Xác thực | JWT (jsonwebtoken) + mã hóa mật khẩu bcryptjs |

> Vì sao dùng file JSON thay vì MySQL/MongoDB thật? Để **bất kỳ máy nào cũng chạy
> được ngay** chỉ với `npm install`, không cần cài đặt/khởi động thêm server CSDL —
> rất phù hợp để demo đồ án. Phần "Nâng cấp" ở cuối file hướng dẫn cách thay bằng
> CSDL thật nếu nhóm muốn mở rộng.

## 2. Cấu trúc thư mục

```
gearvn-gaming/
├── backend/                  # REST API (Express)
│   ├── server.js             # điểm khởi động server
│   ├── data/db.json          # dữ liệu (tự sinh khi chạy lần đầu)
│   └── src/
│       ├── db.js             # lớp đọc/ghi dữ liệu JSON
│       ├── seed.js           # dữ liệu mẫu (sản phẩm, hãng, tài khoản demo...)
│       ├── helpers.js        # audit log, gửi mail giả lập
│       ├── middleware/auth.js
│       └── routes/
│           ├── auth.js       # Epic Tài khoản (US01-05, US22, US30)
│           ├── catalog.js    # Epic Trang chủ + Sản phẩm + Đánh giá (US06-11, US20)
│           ├── orders.js     # Epic Giỏ hàng/Đặt hàng/Thanh toán/Đơn hàng (US12-19,21)
│           ├── content.js    # Epic Tin tức, Showroom, Thu cũ-Đổi mới (US23,25,28)
│           └── admin.js      # Epic Quản trị (US24,29,31-37)
└── frontend/                 # Giao diện (React + Vite)
    └── src/
        ├── api/client.js     # axios instance (tự đính kèm JWT)
        ├── context/          # AuthContext, CartContext, CompareContext, ToastContext
        ├── components/       # Header, Footer, ProductCard, AdminLayout...
        ├── pages/            # các trang khách hàng
        └── pages/admin/      # các trang quản trị
```

## 3. Cách chạy dự án trong VS Code

### Yêu cầu
- Đã cài [Node.js](https://nodejs.org/) bản 18 trở lên (kiểm tra bằng `node -v`).
- Mở thư mục `gearvn-gaming` bằng VS Code (`File > Open Folder`).

### Bước 1 — Chạy Backend (Terminal 1)
Mở Terminal trong VS Code (`Terminal > New Terminal`):
```bash
cd backend
npm install
npm run dev
```
Thấy dòng `🎮 GVN Gaming API đang chạy tại http://localhost:4000` là thành công.
Lần chạy đầu tiên, hệ thống sẽ tự tạo `data/db.json` với dữ liệu mẫu.

### Bước 2 — Chạy Frontend (Terminal 2, mở thêm 1 terminal mới)
```bash
cd frontend
npm install
npm run dev
```
Mở trình duyệt tại địa chỉ hiện ra, thường là **http://localhost:5173**.

> Frontend đã cấu hình sẵn proxy `/api` → `http://localhost:4000` (xem `vite.config.js`),
> nên không bị lỗi CORS khi phát triển.

### Tài khoản demo
| Vai trò | Đăng nhập | Mật khẩu |
|---|---|---|
| Khách hàng | khach@example.com | Khach@123 |
| Quản trị viên | admin@gvngaming.vn (tại `/admin/login`) | Admin@123 |

### Reset lại dữ liệu mẫu
Nếu muốn xóa hết đơn hàng/đánh giá đã tạo trong lúc test và quay về dữ liệu mẫu ban đầu:
```bash
cd backend
npm run seed
```

## 4. Đối chiếu tính năng đã cài đặt với Product Backlog

Toàn bộ 37 user story trong backlog đều đã được cài đặt (một số tính năng cần tích
hợp bên thứ ba được **mô phỏng** để phục vụ demo — xem ghi chú "⚠️"):

| User Story | Trang / API tương ứng |
|---|---|
| US01 Đăng ký tài khoản | `/dang-ky` · `POST /api/auth/register` |
| US02 Đăng nhập/đăng xuất | `/dang-nhap` · `POST /api/auth/login` |
| US03 Đăng nhập Google ⚠️ | Nút "Đăng nhập nhanh bằng Google" ở `/dang-nhap` (mô phỏng, xem mục 5) |
| US04 Quên mật khẩu | `/quen-mat-khau` |
| US05 Cập nhật thông tin cá nhân | `/tai-khoan` |
| US06 Trang chủ nổi bật/khuyến mãi/hãng | `/` |
| US07 Danh sách sản phẩm + phân trang | `/san-pham` |
| US08 Chi tiết sản phẩm | `/san-pham/:id` |
| US09 Tìm kiếm gợi ý từ khóa | Ô tìm kiếm trên Header |
| US10 Lọc theo hãng/giá/ngành hàng/cấu hình | Bộ lọc trang `/san-pham` |
| US11 So sánh sản phẩm | `/so-sanh` |
| US12-13 Giỏ hàng | `/gio-hang` |
| US14-17 Đặt hàng/Thanh toán/Email xác nhận ⚠️ | `/thanh-toan` (thanh toán mô phỏng, xem mục 5) |
| US18-19 Lịch sử đơn hàng / Hủy đơn | `/don-hang` |
| US20 Đánh giá sản phẩm | Tab "Đánh giá" ở trang chi tiết sản phẩm |
| US21 Mã giảm giá | Ô nhập mã ở trang thanh toán (thử: `GVNGAME10`, `FREESHIP`) |
| US22 Ưu đãi HSSV | Mục "Ưu đãi HSSV" ở `/tai-khoan` |
| US23-24 Thu cũ - Đổi mới | `/thu-cu-doi-moi` (khách) · `/admin/thu-cu` (admin) |
| US25 Tra cứu showroom | `/showroom` |
| US26-27 Trang giới thiệu/chính sách/hướng dẫn | `/gioi-thieu`, `/bao-hanh`, `/doi-tra`, `/huong-dan` |
| US28-29 Tin tức - Review | `/tin-tuc` (khách) · `/admin/tin-tuc` (admin) |
| US30 Đăng nhập trang quản trị riêng | `/admin/login` |
| US31 CRUD sản phẩm | `/admin/san-pham` |
| US32 Quản lý hãng | `/admin/hang` |
| US33 Quản lý đơn hàng | `/admin/don-hang` |
| US34 Quản lý tồn kho | Nút sửa tồn kho trong `/admin/san-pham` |
| US35 Thống kê doanh thu | `/admin` (biểu đồ theo ngày/tháng) |
| US36 Quản lý tài khoản khách hàng | `/admin/khach-hang` |
| US37 Nhật ký thao tác admin | `/admin/nhat-ky` |

## 5. Hình ảnh sản phẩm & Mã QR thanh toán

- **Hình ảnh sản phẩm**: hệ thống hỗ trợ **ảnh thật** cho từng sản phẩm — chỉ cần
  lưu file ảnh vào `frontend/public/products/` và khai báo đường dẫn ở trường
  `image` (trong `backend/src/seed.js`, hoặc nhập trực tiếp qua trang quản trị
  *Admin > Sản phẩm*), xem hướng dẫn chi tiết tại
  `frontend/public/products/README.md`. Sản phẩm nào **chưa có ảnh thật** sẽ tự
  động hiển thị hình minh họa SVG do nhóm tự vẽ thay thế
  (`frontend/src/components/ProductImage.jsx` + `frontend/src/utils/productVisual.js`
  — chọn đúng kiểu dáng theo loại thiết bị và tô màu theo thương hiệu), đảm bảo
  không bao giờ có icon ảnh vỡ. Nhóm **không** đính kèm sẵn ảnh chụp sản phẩm thật
  của các hãng/đại lý trong mã nguồn vì đó là ảnh có bản quyền, không thể tự ý sao
  chép — bạn tự thêm ảnh mình có quyền sử dụng theo hướng dẫn trên.
- **Banner quảng cáo kiểu GEARVN**: trang chủ có banner khuyến mãi xoay tự động
  (`HeroCarousel`), dải quảng cáo chính sách (`PromoGrid`: miễn phí vận chuyển, trả
  góp 0%, thu cũ đổi mới, bảo hành), banner Flash Sale có đồng hồ đếm ngược thật
  (`FlashSaleBanner`), và banner quảng cáo theo hãng chèn giữa các khối sản phẩm
  (`SpotlightBanner`) — toàn bộ là thiết kế gốc (gradient + icon + chữ), không dùng
  ảnh banner thật của GearVN.
- **Mã QR thanh toán hóa đơn** (`frontend/src/components/PaymentQR.jsx`): ở trang
  chi tiết đơn hàng, nếu chọn thanh toán "Chuyển khoản ngân hàng", hệ thống sinh mã
  QR **đúng chuẩn VietQR/EMVCo** (`frontend/src/utils/vietqr.js`, có tính checksum
  CRC16 chuẩn) — quét được bằng app ngân hàng để tự điền đúng số tiền và nội dung
  chuyển khoản (mã đơn hàng). ⚠️ Tài khoản nhận tiền trong mã QR là **tài khoản DEMO**
  (xem `DEMO_BANK_ACCOUNT` trong file trên), không phải tài khoản thật — khi lên môi
  trường thật cần thay bằng tài khoản doanh nghiệp đã đăng ký VietQR với ngân hàng.
  Với MoMo/ZaloPay, mã QR chỉ mang tính minh họa giao diện (xem mục 6 bên dưới).

## 6. Những phần được mô phỏng (do không có tài khoản dịch vụ bên thứ ba thật)

Đồ án tập trung vào **kiến trúc, luồng nghiệp vụ và giao diện**. Các tích hợp cần tài
khoản/API-key thật của bên thứ ba được mô phỏng để chạy demo được ngay, kèm ghi chú
rõ trong code (tìm từ khóa `LƯU Ý` trong các file) hướng dẫn cách thay bằng dịch vụ thật:

- **Đăng nhập Google** (`backend/src/routes/auth.js`, route `/auth/google`): mô phỏng
  luồng OAuth. Muốn dùng thật: tạo OAuth Client ID tại Google Cloud Console, dùng
  `@react-oauth/google` ở frontend, xác thực id_token bằng `google-auth-library` ở backend.
- **Thanh toán MoMo/ZaloPay/Chuyển khoản/Trả góp** (`backend/src/routes/orders.js`):
  đơn hàng được ghi nhận và chuyển trạng thái ngay, không gọi cổng thanh toán thật.
  Muốn dùng thật: tích hợp API MoMo/VNPay/ZaloPay (cần đăng ký merchant).
- **Gửi email xác nhận đơn hàng** (`backend/src/helpers.js`, hàm `sendMail`): email được
  in ra console và lưu vào `mail_outbox` trong `db.json` thay vì gửi SMTP thật.
  Muốn dùng thật: thay bằng `nodemailer` + SMTP (Gmail, SendGrid...).
- **Hình ảnh sản phẩm**: dùng icon/emoji đại diện theo từng ngành hàng thay vì ảnh
  thật, để tránh vi phạm bản quyền ảnh sản phẩm và không phụ thuộc dịch vụ ảnh ngoài.

## 7. Hướng nâng cấp (nếu nhóm muốn mở rộng đồ án)

- Thay `backend/src/db.js` (file JSON) bằng MySQL/PostgreSQL (dùng `prisma` hoặc
  `sequelize`) hoặc MongoDB (`mongoose`) — các file `routes/*.js` gọi hàm qua `db.js`
  nên chỉ cần viết lại lớp này, không phải sửa toàn bộ route.
- Thêm upload ảnh sản phẩm thật (`multer` + lưu trữ cloud như Cloudinary/S3), thay
  cho hình minh họa SVG hiện tại.
- Đăng ký dịch vụ VietQR thật với ngân hàng để thay `DEMO_BANK_ACCOUNT`
  (`frontend/src/utils/vietqr.js`) bằng tài khoản doanh nghiệp thật; tích hợp API
  MoMo/ZaloPay thật để mã QR ví điện tử hoạt động đúng thay vì chỉ minh họa.
- Viết test tự động (Jest cho backend, React Testing Library cho frontend).
- Triển khai (deploy) backend lên Render/Railway, frontend lên Vercel/Netlify.

## 8. Liên hệ nội dung đồ án

Tài liệu Product Backlog gốc: `Nhom11_ProductBacklog_GEARVN_ThietBiGaming.docx`
(37 user story, 121 story point, 4 sprint / 8 tuần, theo mô hình nền tảng GEARVN).
