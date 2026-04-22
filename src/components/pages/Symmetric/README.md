# 🔐 Tài liệu tính năng Symmetric Encryption (DES, 3DES, AES)

## 1. Mục tiêu

Trang Symmetric cho phép người dùng thao tác trực tiếp với mã hóa đối xứng trên web:

* Mã hóa văn bản (Encryption).
* Giải mã văn bản (Decryption).
* Hỗ trợ nhiều thuật toán: DES, 3DES, AES.
* Cho phép nhập key thủ công hoặc sinh key ngẫu nhiên.
* Hiển thị và sao chép nhanh kết quả.

---

## 2. Tổng quan luồng hoạt động

1. Người dùng nhập Plaintext hoặc Ciphertext.
2. Chọn thuật toán (AES / DES / 3DES).
3. Nhập Secret Key hoặc bấm "Generate Key".
4. Bấm:

   * "Encrypt" → gửi dữ liệu tới hàm mã hóa.
   * "Decrypt" → gửi dữ liệu tới hàm giải mã.
5. Kết quả trả về hiển thị ngay trên giao diện.

(Lưu ý: Feature này xử lý trực tiếp phía client bằng thư viện `crypto-js`, không cần API backend.)

---

## 3. Chi tiết từng thuật toán

## 3.1. Thuật toán AES

* Hàm sử dụng:

  * `encryptAES(plaintext, key)`
  * `decryptAES(ciphertext, key)`

* Cách hoạt động:

  1. Thư viện `crypto-js` sử dụng AES để mã hóa dữ liệu.
  2. Plaintext được encode UTF-8.
  3. Key được sử dụng trực tiếp (passphrase-based).
  4. Kết quả trả về dạng Base64 string.

* Giải mã:

  1. Ciphertext được decode.
  2. Dùng cùng key để giải mã.
  3. Kết quả trả về UTF-8 string.

---

## 3.2. Thuật toán DES

* Hàm sử dụng:

  * `encryptDES(plaintext, key)`
  * `decryptDES(ciphertext, key)`

* Cách hoạt động:

  * Sử dụng chuẩn DES (Data Encryption Standard).
  * Key length khuyến nghị: 8 bytes.
  * Output được encode Base64.

* Lưu ý:

  * DES đã lỗi thời, chỉ dùng cho mục đích học tập.

---

## 3.3. Thuật toán 3DES (Triple DES)

* Hàm sử dụng:

  * `encrypt3DES(plaintext, key)`
  * `decrypt3DES(ciphertext, key)`

* Cách hoạt động:

  * Áp dụng DES 3 lần để tăng độ bảo mật.
  * Key length: 24 bytes (khuyến nghị).
  * Output dạng Base64.

* Lưu ý:

  * An toàn hơn DES nhưng vẫn không khuyến nghị dùng trong hệ thống mới.

---

## 3.4. Thuật toán sinh key ngẫu nhiên

* Hàm: `generateKey(length)`

* Cách hoạt động:

  1. Sử dụng `CryptoJS.lib.WordArray.random`.
  2. Sinh chuỗi ngẫu nhiên theo số byte yêu cầu.
  3. Convert sang string hex.

* Mặc định:

  * length = 16 bytes

---

## 4. Hướng dẫn sử dụng trên web

## 4.1. Mã hóa (Encryption)

1. Nhập nội dung vào ô Plaintext.
2. Chọn thuật toán (AES / DES / 3DES).
3. Nhập Secret Key hoặc bấm "Generate Key".
4. Bấm "Encrypt".
5. Nhận Ciphertext (Base64).

---

## 4.2. Giải mã (Decryption)

1. Dán Ciphertext vào ô input.
2. Chọn đúng thuật toán đã dùng khi mã hóa.
3. Nhập đúng Secret Key.
4. Bấm "Decrypt".
5. Nhận lại Plaintext ban đầu.

---

## 4.3. Generate Key

1. Bấm nút "Generate Key".
2. Hệ thống tự sinh key ngẫu nhiên.
3. Có thể sử dụng key này cho Encrypt/Decrypt.

---

## 5. Xử lý lỗi thường gặp

* `Empty key`: chưa nhập key.
* `Wrong key`: key không đúng → decrypt ra rỗng.
* `Wrong algorithm`: chọn sai thuật toán khi decrypt.
* `Invalid ciphertext`: dữ liệu không đúng định dạng Base64.

---

## 6. Khuyến nghị bảo mật

* Không sử dụng DES trong môi trường production.
* AES là lựa chọn an toàn nhất hiện tại.
* Không lưu key trực tiếp trên frontend trong ứng dụng thực tế.
* Có thể nâng cấp thêm:

  * Hỗ trợ CBC mode (có IV)
  * Validate key length theo từng thuật toán
  * Mã hóa phía backend để tăng bảo mật

---

## 7. Ghi chú

* Feature này phục vụ mục đích học tập và demo.
* Việc mã hóa được thực hiện hoàn toàn trên client (browser).
* Không đảm bảo an toàn tuyệt đối khi triển khai thực tế.
