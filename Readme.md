# Cryptography Toolkit

## Team Members

| # | Name | Branch | Feature |
|---|------|--------|---------|
| 1 | Duy Khải (Nhóm trưởng) | N23DVCN026 | Merge code main, README, General Requirements, Asymmetric Encryption (RSA), GitHub Management |
| 2 | Quốc Hiếu | N23DVCN020 | Symmetric Encryption (DES, 3DES, AES) |
| 3 | N. Gia Huy | N23DVCN023 | Hash Functions (MD5, SHA-256) |
| 4 | T. Gia Huy | N23DVCN022 | Main Menu + UX Flow (CLI interaction, validation) |
| 5 | Quốc Huy | N23DVCN025 | Report + Demo Screenshots |

## Cài đặt và chạy

```bash
git clone <LINK_REPO>
cd crypto-toolkit
npm install
npm run dev
```

Sau khi chạy, mở địa chỉ local hiển thị trong terminal (thường là http://localhost:3000).

## Quy trình làm việc nhóm (Git Workflow)

### Quy tắc nhánh

- Mỗi thành viên làm việc trên nhánh đã phân công trong bảng Team Members.
- Không code trực tiếp trên main.

### Workflow 5 bước chuẩn

1. Trước khi code, luôn cập nhật main mới nhất:

```bash
git checkout main
git pull origin main
```

2. Chuyển sang nhánh cá nhân đã được phân công:

```bash
git checkout N23DVCN020
```

Nếu chưa có nhánh local:

```bash
git checkout -b N23DVCN020 origin/N23DVCN020
```

3. Code tính năng, sau đó add và commit rõ ràng:

```bash
git add .
git commit -m "feat: mo ta ngan gon thay doi"
```

4. Đẩy nhánh cá nhân lên GitHub:

```bash
git push origin N23DVCN020
```

5. Tạo Pull Request để Leader review và merge vào main.

### Lưu ý quan trọng

- Không bao giờ push trực tiếp lên main.
- Luôn kiểm tra conflict trước khi merge PR.
- Mỗi thành viên cần có commit thực tế trong phần mình phụ trách để đảm bảo điểm đóng góp cá nhân.
