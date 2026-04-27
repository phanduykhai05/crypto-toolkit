# 🧪 SEED Labs - MD5 Collision Attack Lab

Thư mục này chứa các chương trình C và file thực thi phục vụ **Task 3 và Task 4** trong MD5 Collision Lab.
Mục tiêu là chứng minh rằng **MD5 không còn an toàn**, vì có thể tạo ra hai file khác nhau nhưng có cùng giá trị hash.

---

## 📁 Files

* `task3.c`: chương trình tạo dữ liệu để sinh collision
* `task4.c`: chương trình có điều kiện rẽ nhánh (benign / malicious)
* `task3.out`: file thực thi của Task 3
* `task4.out`: file thực thi của Task 4
* `p1.out`, `p2.out`: hai file collision của Task 3
* `good.out`, `bad.out`: hai file collision của Task 4

---

## ⚙️ Build và chạy (Ubuntu / WSL)

### 🔨 Compile chương trình

```bash
gcc task3.c -o task3.out
gcc task4.c -o task4.out
```

---

# 🚀 Task 3 - Tạo 2 file thực thi có cùng MD5

## 🛠️ Các bước thực hiện

### 1. Tách prefix (phải chia hết cho 64)

```bash
head -c 12352 task3.out > task3_prefix
```

---

### 2. Sinh collision

```bash
md5collgen -p task3_prefix -o out1.bin out2.bin
```

👉 Tạo ra 2 file có cùng MD5 nhưng khác nội dung (128 bytes)

---

### 3. Tách suffix

```bash
tail -c +12481 task3.out > task3_suffix
```

---

### 4. Ghép file hoàn chỉnh

```bash
cat out1.bin task3_suffix > p1.out
cat out2.bin task3_suffix > p2.out
```

---

### 5. Kiểm tra MD5

```bash
md5sum p1.out p2.out
```

👉 Kết quả: **giống nhau**

---

### 6. Chạy chương trình

```bash
chmod +x p1.out p2.out
./p1.out
./p2.out
```

👉 Output khác nhau → chứng minh collision

---

## ✅ Kết luận Task 3

* Hai file có cùng MD5 nhưng nội dung khác nhau
* MD5 không đảm bảo tính **collision resistance**

---

# 💣 Task 4 - Hai chương trình khác hành vi nhưng cùng MD5

## 💡 Ý tưởng

```c
if (memcmp(X, Y) == 0)
    chạy code tốt (benign);
else
    chạy code xấu (malicious);
```

---

## 🛠️ Các bước thực hiện

### 1. Compile

```bash
gcc task4.c -o task4.out
```

---

### 2. Tách prefix

```bash
head -c 12352 task4.out > prefix4
```

---

### 3. Sinh collision

```bash
md5collgen -p prefix4 -o out1.bin out2.bin
```

---

### 4. Tách suffix

```bash
tail -c +12481 task4.out > suffix4
```

---

### 5. Ghép file

```bash
cat out1.bin suffix4 > good.out
cat out2.bin suffix4 > bad.out
```

---

### 6. Kiểm tra MD5

```bash
md5sum good.out bad.out
```

👉 Hai file có **cùng MD5**

---

### 7. Chạy chương trình

```bash
chmod +x good.out bad.out
./good.out
./bad.out
```

---

## 🎯 Kết quả mong đợi

* `good.out` → **BENIGN CODE EXECUTED**
* `bad.out` → **MALICIOUS CODE EXECUTED**

---

## ⚠️ Lưu ý

* Prefix phải chia hết cho 64 bytes
* Nếu 2 file chạy giống nhau:

  * collision chưa đúng vị trí
  * thử đổi prefix (12288, 12416, ...)
  * hoặc tăng kích thước mảng X, Y

---

## 🔐 Ý nghĩa bảo mật

Lab này mô phỏng tấn công:

👉 **Giả mạo chứng chỉ phần mềm**

* Gửi bản an toàn để được ký
* Sau đó thay bằng bản độc hại
* Vì MD5 giống nhau nên hệ thống vẫn tin tưởng

---

## 📌 Kết luận

* MD5 đã bị phá vỡ hoàn toàn
* Không nên sử dụng MD5 trong hệ thống bảo mật hiện đại

---

## 🧰 Yêu cầu môi trường

```bash
sudo apt install build-essential -y
```

Cài `md5collgen`:

```bash
git clone https://github.com/zhijieshi/md5collgen.git
cd md5collgen
make
sudo cp md5collgen /usr/local/bin/
```

---

## 📎 Ghi chú

* Chạy trên Ubuntu / WSL
* Không hỗ trợ trực tiếp Windows CMD
* Cần đảm bảo `md5collgen` đã được thêm vào PATH
* Các bước phải thực hiện đúng thứ tự để đảm bảo collision thành công