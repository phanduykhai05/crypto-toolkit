# Tài liệu tính năng Asymmetric (RSA)

## 1. Mục tiêu
Trang Asymmetric cho phép người dùng thao tác trực tiếp với mã hóa bất đối xứng RSA trên web:
- Sinh cặp khóa RSA (Public/Private key).
- Mã hóa văn bản (Encrypt) bằng Public key (khuyến nghị) hoặc Private key (chế độ demo/lab).
- Giải mã văn bản (Decrypt) bằng Private key hoặc Public key tương ứng.
- Sao chép nhanh khóa và ciphertext.

## 2. Tổng quan luồng hoạt động
1. Người dùng bấm "Generate RSA Key Pair".
2. Frontend gọi API POST `/api/rsa` với `action: "generate"`.
3. API dùng Node `crypto.generateKeyPairSync("rsa")` tạo khóa RSA 2048-bit dạng PEM.
4. Khóa được trả về và hiển thị trong form.
5. Khi mã hóa/giải mã, frontend gửi dữ liệu tới `/api/rsa` với `action: "encrypt"` hoặc `action: "decrypt"`.
6. API thực hiện thuật toán tương ứng, trả lại `result`.

## 3. Chi tiết từng thuật toán

## 3.1. Thuật toán sinh khóa RSA
- Hàm backend: `generateRSAKeyPair()`.
- Cấu hình:
  - `modulusLength = 2048` (độ dài khóa 2048-bit).
  - `publicKeyEncoding`: PKCS#1, PEM.
  - `privateKeyEncoding`: PKCS#1, PEM.
- Kết quả:
  - Public key PEM (dùng để mã hóa trong kịch bản chuẩn).
  - Private key PEM (dùng để giải mã trong kịch bản chuẩn).

## 3.2. Thuật toán mã hóa RSA
- Hàm backend: `encryptRSA(plaintext, key, keyType)`.
- Các bước:
1. Chuẩn hóa khóa PEM (`trim`).
2. Chuyển plaintext thành `Buffer` UTF-8.
3. Xác định kích thước modulus (số byte của khóa RSA).
4. Tính kích thước khối dữ liệu tối đa cho mỗi lần mã hóa:
   - Nếu `keyType = public`: dùng OAEP SHA-256, overhead = 66 byte.
     - Công thức: `maxChunk = keyBytes - 66`.
   - Nếu `keyType = private`: dùng PKCS#1 v1.5, overhead = 11 byte.
     - Công thức: `maxChunk = keyBytes - 11`.
5. Chia plaintext thành nhiều khối (`splitBuffer`) nếu dữ liệu dài.
6. Mã hóa từng khối:
   - Public key: `crypto.publicEncrypt` + `RSA_PKCS1_OAEP_PADDING` + `oaepHash = sha256`.
   - Private key: `crypto.privateEncrypt` + `RSA_PKCS1_PADDING` (chế độ demo/lab).
7. Ghép các khối đã mã hóa và encode Base64.

Lưu ý:
- Chế độ `privateEncrypt` không phải quy trình bảo mật dữ liệu tiêu chuẩn để bảo mật nội dung; nó gần với cơ chế ký/xác thực hơn, giữ lại cho mục đích học tập minh họa.

## 3.3. Thuật toán giải mã RSA
- Hàm backend: `decryptRSA(ciphertext, key, keyType)`.
- Các bước:
1. Chuẩn hóa khóa PEM và ciphertext Base64 (loại bỏ khoảng trắng dư).
2. Decode ciphertext Base64 thành `Buffer`.
3. Kiểm tra chiều dài ciphertext phải là bội số của `keyBytes`.
4. Chia ciphertext thành các khối đúng bằng độ dài khóa.
5. Giải mã từng khối:
   - Private key: `crypto.privateDecrypt` + OAEP SHA-256.
   - Public key: `crypto.publicDecrypt` + PKCS#1 v1.5.
6. Ghép các khối kết quả và decode UTF-8.

Cơ chế fallback:
- Nếu người dùng chọn nhầm `keyType`, API thử giải mã lại với loại khóa ngược lại để tăng khả năng phục hồi lỗi thao tác.

## 4. Hướng dẫn sử dụng trên web

## 4.1. Sinh khóa
1. Bấm nút "Generate RSA Key Pair".
2. Hệ thống tự điền Public key và Private key.
3. Có thể bấm "Copy Public Key" hoặc "Copy Private Key".

## 4.2. Mã hóa
1. Nhập nội dung vào ô Plaintext.
2. Chọn "Encrypt Key Type":
   - `Public key (recommended)`: khuyến nghị trong thực tế.
   - `Private key (lab/demo)`: chỉ dùng minh họa.
3. Dán khóa tương ứng vào ô Key Input.
4. Bấm "Encrypt" để nhận Ciphertext (Base64).

## 4.3. Giải mã
1. Dán Ciphertext (Base64) vào ô Ciphertext.
2. Chọn "Decrypt Key Type" phù hợp.
3. Dán khóa vào ô Key Input.
4. Bấm "Decrypt" để lấy lại Plaintext.

## 4.4. Đọc tài liệu trong popup
1. Bấm ô/nút "Mở tài liệu RSA" trên đầu trang.
2. Popup toàn màn hình mở ra và tải nội dung README này từ server.
3. Bấm nút "Đóng" hoặc click nền tối để tắt popup.

## 5. Xử lý lỗi thường gặp
- `Missing plaintext or key`: thiếu dữ liệu đầu vào khi mã hóa.
- `Missing ciphertext or key`: thiếu dữ liệu đầu vào khi giải mã.
- `Invalid ciphertext length for this RSA key`: ciphertext không tương thích với độ dài khóa.
- `Cannot detect RSA key size`: khóa không đúng định dạng PEM hợp lệ.

## 6. Khuyến nghị bảo mật
- Không chia sẻ Private key.
- Chỉ dùng `public -> encrypt` và `private -> decrypt` cho luồng bảo mật dữ liệu chuẩn.
- Tránh dùng chế độ privateEncrypt/publicDecrypt cho dữ liệu nhạy cảm trong môi trường production.
- Có thể nâng cấp thêm:
  - Ký số riêng (`sign/verify`) thay cho demo privateEncrypt.
  - Quản lý khóa bằng HSM/KMS.
  - Giới hạn tần suất gọi API và thêm logging/audit.
