# Thư mục ảnh sản phẩm

Bỏ file ảnh laptop của bạn vào **đúng thư mục này** (`frontend/public/products/`),
đặt **đúng tên file** như bảng bên dưới — code đã trỏ sẵn đường dẫn, không cần sửa
gì thêm, chỉ cần bỏ ảnh vào là trang web hiện ảnh thật ngay.

> Vì sao không có sẵn ảnh trong này? Ảnh sản phẩm laptop (có logo ASUS/MSI/
> Lenovo/Acer/Dell) là ảnh thương mại có bản quyền của hãng/đại lý, nên không thể
> tự động sao chép vào mã nguồn giao cho bạn được. Bạn cần tự lưu ảnh (ví dụ từ 6
> ảnh bạn đã gửi) vào đây.

## Danh sách ảnh cần thêm (ứng với 6 ảnh bạn đã gửi)

| Lưu ảnh với tên file này | Sản phẩm tương ứng trong web |
|---|---|
| `asus-rog-strix-g16.jpg` | ASUS ROG Strix G16 (2024) G614 — *ảnh laptop màu ghi bạc, chữ "ROG STRIX" trên màn hình* |
| `asus-tuf-gaming-a15.jpg` | ASUS TUF Gaming A15 — *ảnh laptop đen, chữ "TUF GAMING" trên màn hình* |
| `lenovo-legion-5-pro.jpg` | Lenovo Legion 5 Pro — *ảnh laptop đen, logo "LEGION" + hiệu ứng sét* |
| `acer-predator-helios-neo-16.jpg` | Acer Predator Helios Neo 16 — *ảnh laptop đen, họa tiết màu hồng/tím* |
| `msi-katana-15-b13v.jpg` | MSI Katana 15 B13V — *ảnh laptop đen, logo rồng MSI đỏ/tím* |
| `dell-alienware-m16-r2.jpg` | Dell Alienware m16 R2 — *ảnh laptop đen, hình con sói/dê trắng* |

## Cách làm (1 phút)

1. Chuột phải vào từng ảnh bạn đã gửi cho Claude → **Save image as...**
2. Đặt tên file đúng như cột "Lưu ảnh với tên file này" ở bảng trên.
3. Lưu vào thư mục này: `frontend/public/products/`
4. Chạy lại `npm run dev` (hoặc chỉ cần refresh trình duyệt nếu đang chạy sẵn) —
   ảnh sẽ tự hiện ra ở trang chủ, danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng...

## Muốn thêm ảnh cho các sản phẩm khác (PC, màn hình, bàn phím...)?

Có 2 cách:

**Cách 1 — Qua trang quản trị (khuyên dùng, không cần sửa code):**
Đăng nhập `/admin/login` → *Sản phẩm* → bấm *Sửa* sản phẩm muốn thêm ảnh → nhập
đường dẫn vào ô **"Đường dẫn ảnh sản phẩm"**, ví dụ `/products/ten-file-moi.jpg`
(nhớ bỏ file ảnh tương ứng vào thư mục này trước) → *Lưu sản phẩm*.

**Cách 2 — Sửa trực tiếp trong code:**
Mở `backend/src/seed.js`, tìm sản phẩm muốn thêm ảnh, thêm dòng
`image: "/products/ten-file.jpg",` vào object sản phẩm đó, rồi chạy lại
`npm run seed` trong thư mục `backend` để áp dụng.

## Lưu ý

- Những sản phẩm **chưa có ảnh thật** (chưa đặt trường `image`) sẽ tự động hiển
  thị hình minh họa SVG mặc định — không bao giờ bị vỡ ảnh (icon ảnh lỗi), kể cả
  khi bạn gõ sai đường dẫn hoặc quên bỏ file vào.
- Nên dùng ảnh tỉ lệ vuông hoặc gần vuông, nền trong suốt/trắng để hiển thị đẹp
  nhất trong khung ảnh sản phẩm.
