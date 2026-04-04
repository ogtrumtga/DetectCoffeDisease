# 🔧 FIX LỖI: PERMISSION DENIED KHI PUSH LÊN GITHUB MỚI

## ❌ LỖI

```
remote: Permission to YOUR_NEW_REPO denied to 2324802010205-sudo.
fatal: unable to access 'https://github.com/...': The requested URL returned error: 403
```

## 🎯 NGUYÊN NHÂN

Git đang sử dụng credentials của tài khoản GitHub cũ (2324802010205-sudo).

---

## ✅ GIẢI PHÁP (Windows)

### Cách 1: Xóa Credentials trong Windows Credential Manager (Khuyến nghị)

1. **Mở Credential Manager:**
   - Nhấn `Windows + R`
   - Gõ: `control /name Microsoft.CredentialManager`
   - Nhấn Enter

2. **Xóa GitHub credentials cũ:**
   - Click "Windows Credentials"
   - Tìm các mục có tên `git:https://github.com`
   - Click vào → "Remove"
   - Xóa TẤT CẢ các credentials liên quan đến GitHub

3. **Push lại:**
   ```bash
   git push
   ```
   
4. **Đăng nhập tài khoản mới:**
   - Một cửa sổ popup sẽ hiện ra
   - Đăng nhập bằng tài khoản GitHub MỚI của bạn

---

### Cách 2: Sử dụng Git Credential Manager

```bash
# Xóa credentials cũ
git credential-manager-core erase
# Hoặc
git credential reject

# Sau đó push lại
git push
```

---

### Cách 3: Đổi Remote URL sang SSH (Không cần password)

#### Bước 1: Tạo SSH Key (nếu chưa có)

```bash
# Tạo SSH key mới
ssh-keygen -t ed25519 -C "your_email@example.com"

# Nhấn Enter 3 lần (không cần passphrase)
```

#### Bước 2: Copy SSH Public Key

```bash
# Copy nội dung file public key
cat ~/.ssh/id_ed25519.pub
```

#### Bước 3: Thêm SSH Key vào GitHub

1. Vào GitHub → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste nội dung đã copy
4. Click "Add SSH key"

#### Bước 4: Đổi Remote URL

```bash
# Xem remote hiện tại
git remote -v

# Đổi sang SSH
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# Push lại
git push
```

---

### Cách 4: Sử dụng Personal Access Token (PAT)

#### Bước 1: Tạo Personal Access Token

1. Vào GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Chọn scopes:
   - ✅ repo (full control)
   - ✅ workflow
4. Click "Generate token"
5. **COPY TOKEN NGAY** (chỉ hiện 1 lần!)

#### Bước 2: Sử dụng Token khi push

```bash
# Đổi remote URL với token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git

# Hoặc push với token trong URL
git push https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

## 🔄 ĐỔI SANG REPOSITORY MỚI

### Nếu muốn push lên repo GitHub hoàn toàn mới:

```bash
# 1. Xem remote hiện tại
git remote -v

# 2. Xóa remote cũ
git remote remove origin

# 3. Thêm remote mới
git remote add origin https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git

# 4. Xóa credentials cũ (Cách 1 ở trên)

# 5. Push lên repo mới
git push -u origin main
```

---

## 🧪 KIỂM TRA

### Kiểm tra Git config:

```bash
# Xem user hiện tại
git config user.name
git config user.email

# Đổi user nếu cần
git config --global user.name "Your New Name"
git config --global user.email "your_new_email@example.com"
```

### Kiểm tra remote:

```bash
git remote -v
```

**Kết quả mong đợi:**
```
origin  https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git (fetch)
origin  https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git (push)
```

---

## 📋 CHECKLIST

- [ ] Đã xóa credentials cũ trong Credential Manager
- [ ] Đã đổi remote URL sang repo mới
- [ ] Đã kiểm tra `git remote -v`
- [ ] Đã kiểm tra `git config user.name` và `user.email`
- [ ] Đã test push thành công

---

## 🎯 LỆNH NHANH (TÓM TẮT)

```bash
# 1. Xóa remote cũ
git remote remove origin

# 2. Thêm remote mới
git remote add origin https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git

# 3. Xóa credentials (mở Credential Manager thủ công)
# Windows + R → control /name Microsoft.CredentialManager
# Xóa tất cả git:https://github.com

# 4. Push lại
git push -u origin main

# 5. Đăng nhập tài khoản mới khi được hỏi
```

---

## 🆘 NẾU VẪN LỖI

### Lỗi: "fatal: 'origin' does not appear to be a git repository"

```bash
# Thêm lại remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Lỗi: "error: src refspec main does not match any"

```bash
# Đổi branch name
git branch -M main
git push -u origin main
```

### Lỗi: "Updates were rejected because the remote contains work"

```bash
# Pull trước khi push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 💡 KHUYẾN NGHỊ

**Dùng SSH thay vì HTTPS:**
- ✅ Không cần nhập password mỗi lần push
- ✅ An toàn hơn
- ✅ Không bị conflict credentials

**Setup SSH:**
```bash
# 1. Tạo SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. Copy public key
cat ~/.ssh/id_ed25519.pub

# 3. Thêm vào GitHub Settings → SSH Keys

# 4. Đổi remote
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# 5. Test
ssh -T git@github.com
# → "Hi YOUR_USERNAME! You've successfully authenticated"
```

---

## 🎉 HOÀN THÀNH

Sau khi làm theo các bước trên, bạn có thể push code lên GitHub mới thành công!

```bash
git push -u origin main
```
