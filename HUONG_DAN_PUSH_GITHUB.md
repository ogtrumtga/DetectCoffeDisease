# 🚀 HƯỚNG DẪN PUSH CODE LÊN GITHUB

## ⚠️ QUAN TRỌNG: BẢO MẬT

File `serviceAccountKey.json` chứa thông tin nhạy cảm và **TUYỆT ĐỐI KHÔNG** được push lên GitHub!

File `.gitignore` đã được cấu hình để ignore file này.

---

## ✅ KIỂM TRA TRƯỚC KHI PUSH

### 1. Kiểm tra file nào sẽ được commit:

```bash
git status
```

**Đảm bảo KHÔNG thấy**:
- ❌ `backend/serviceAccountKey.json`
- ❌ `.env` (nếu có thông tin nhạy cảm)

### 2. Kiểm tra file đã bị track chưa:

```bash
git ls-files | grep serviceAccountKey
```

**Nếu có kết quả** → File đã bị track, cần xóa khỏi Git:

```bash
git rm --cached backend/serviceAccountKey.json
git commit -m "Remove serviceAccountKey.json from tracking"
```

---

## 📤 LỆNH PUSH LÊN GITHUB

### Lần đầu tiên (chưa có remote):

```bash
# 1. Khởi tạo Git (nếu chưa có)
git init

# 2. Thêm tất cả files (trừ những file trong .gitignore)
git add .

# 3. Commit
git commit -m "Initial commit: Coffee Disease Detection App"

# 4. Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push lên GitHub
git push -u origin main
```

### Lần sau (đã có remote):

```bash
# 1. Kiểm tra status
git status

# 2. Thêm files đã thay đổi
git add .

# 3. Commit với message mô tả
git commit -m "Add Firestore collections and diagnosis feature"

# 4. Push lên GitHub
git push
```

---

## 🔒 ĐẢM BẢO BẢO MẬT

### Files KHÔNG được push (đã có trong .gitignore):

```
❌ backend/serviceAccountKey.json
❌ .env
❌ .env.local
❌ backend/__pycache__/
❌ node_modules/
❌ venv/
```

### Files NÊN push:

```
✅ backend/config.py
✅ backend/firestore.rules
✅ backend/firestore.indexes.json
✅ backend/repositories/*.py
✅ backend/services/*.py
✅ backend/api/*.py
✅ All frontend code
✅ README.md
✅ .gitignore
```

---

## 🆘 NẾU ĐÃ PUSH NHỦ TÌNH serviceAccountKey.json

### ⚠️ NGUY HIỂM! Cần xử lý ngay:

1. **Xóa file khỏi Git history:**

```bash
# Xóa file khỏi tất cả commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/serviceAccountKey.json" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (ghi đè history)
git push origin --force --all
```

2. **Vô hiệu hóa Service Account Key cũ:**
   - Vào Firebase Console
   - Project Settings → Service Accounts
   - Xóa key cũ
   - Generate key mới
   - Download và lưu vào `backend/serviceAccountKey.json`

3. **Kiểm tra lại:**

```bash
# Đảm bảo file không còn trong history
git log --all --full-history -- backend/serviceAccountKey.json
```

---

## 📋 CHECKLIST TRƯỚC KHI PUSH

- [ ] Đã kiểm tra `git status`
- [ ] KHÔNG thấy `serviceAccountKey.json` trong danh sách
- [ ] Đã test code chạy được
- [ ] Đã viết commit message rõ ràng
- [ ] Đã kiểm tra `.gitignore` có đầy đủ

---

## 💡 BEST PRACTICES

### 1. Commit message tốt:

```bash
# ❌ Bad
git commit -m "update"
git commit -m "fix bug"

# ✅ Good
git commit -m "Add Firestore collections structure"
git commit -m "Implement diagnosis service with AI integration"
git commit -m "Fix: User authentication flow"
```

### 2. Commit thường xuyên:

```bash
# Commit sau mỗi feature hoàn thành
git add .
git commit -m "Add user profile update feature"
git push
```

### 3. Sử dụng branches:

```bash
# Tạo branch mới cho feature
git checkout -b feature/diagnosis

# Làm việc trên branch
git add .
git commit -m "Add diagnosis feature"

# Push branch
git push -u origin feature/diagnosis

# Merge vào main (trên GitHub qua Pull Request)
```

---

## 🔐 SETUP SECRETS TRÊN GITHUB (Cho CI/CD)

Nếu cần chạy tests/deploy tự động, thêm secrets:

1. Vào GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Thêm secrets:
   - `FIREBASE_SERVICE_ACCOUNT`: Nội dung file serviceAccountKey.json
   - `FIREBASE_PROJECT_ID`: Project ID
   - Các API keys khác

---

## 📚 TÀI LIỆU THAM KHẢO

- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Docs](https://docs.github.com/en)
- [Gitignore Templates](https://github.com/github/gitignore)

---

## 🎯 TÓM TẮT LỆNH NHANH

```bash
# Kiểm tra
git status

# Thêm files
git add .

# Commit
git commit -m "Your message here"

# Push
git push

# Kiểm tra serviceAccountKey KHÔNG có trong Git
git ls-files | grep serviceAccountKey
# → Không có kết quả = OK ✅
```

---

## ⚠️ LƯU Ý CUỐI CÙNG

**TUYỆT ĐỐI KHÔNG:**
- ❌ Push `serviceAccountKey.json`
- ❌ Push `.env` có thông tin nhạy cảm
- ❌ Push API keys, passwords
- ❌ Push database credentials

**LUÔN LUÔN:**
- ✅ Kiểm tra `git status` trước khi commit
- ✅ Review code trước khi push
- ✅ Sử dụng `.gitignore` đúng cách
- ✅ Backup `serviceAccountKey.json` ở nơi an toàn (không phải Git)
