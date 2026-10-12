/**
 * vietqr.js — Sinh chuỗi dữ liệu mã QR chuyển khoản ngân hàng theo đúng cấu trúc
 * chuẩn EMVCo QR Code for Payment Systems mà VietQR (NAPAS) đang sử dụng tại Việt Nam
 * (định dạng TLV: Tag - Length - Value, kết thúc bằng CRC16-CCITT).
 *
 * ⚠️ LƯU Ý QUAN TRỌNG: Ngân hàng (bankBin) và số tài khoản (accountNumber) bên dưới
 * là thông tin DEMO phục vụ đồ án, KHÔNG phải tài khoản nhận tiền thật. Mã BIN ngân
 * hàng dùng ở đây là mã định tuyến công khai do NAPAS phát hành (tương tự mã vùng
 * điện thoại), không phải thông tin bí mật. Khi triển khai thực tế, cần thay bằng
 * tài khoản doanh nghiệp đã đăng ký dịch vụ VietQR với ngân hàng.
 */

// Thông tin tài khoản DEMO của "cửa hàng" — KHÔNG phải tài khoản thật
export const DEMO_BANK_ACCOUNT = {
  bankBin: "970436", // mã BIN NAPAS công khai của Vietcombank, chỉ dùng làm ví dụ minh họa
  bankName: "Vietcombank (DEMO)",
  accountNumber: "0071000999999",
  accountName: "CONG TY GVN GAMING DEMO",
};

function crc16ccitt(input) {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id, value) {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

/**
 * Sinh chuỗi payload QR chuyển khoản ngân hàng (static nếu không truyền amount,
 * dynamic — có sẵn số tiền — nếu có amount).
 */
export function buildVietQRPayload({
  bankBin = DEMO_BANK_ACCOUNT.bankBin,
  accountNumber = DEMO_BANK_ACCOUNT.accountNumber,
  accountName = DEMO_BANK_ACCOUNT.accountName,
  amount,
  message = "",
  city = "HO CHI MINH",
} = {}) {
  const accountInfo = tlv("00", bankBin) + tlv("01", accountNumber);
  const merchantInfo = tlv("00", "A000000727") + tlv("01", accountInfo) + tlv("02", "QRIBFTTA");
  const additional = message ? tlv("08", message.slice(0, 25)) : "";

  let payload =
    tlv("00", "01") +
    tlv("01", amount ? "12" : "11") +
    tlv("38", merchantInfo) +
    tlv("53", "704") +
    (amount ? tlv("54", String(Math.max(0, Math.round(amount)))) : "") +
    tlv("58", "VN") +
    tlv("59", accountName.slice(0, 25)) +
    tlv("60", city.slice(0, 15)) +
    (additional ? tlv("62", additional) : "");

  payload += "6304";
  return payload + crc16ccitt(payload);
}
