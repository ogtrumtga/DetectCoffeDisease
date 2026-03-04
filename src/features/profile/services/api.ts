/*
==========================
 AUTH ENDPOINTS
==========================

1. POST /api/auth/login
   → Đăng nhập
   Body:
   {
      email: string,
      password: string
   }

2. POST /api/auth/register
   → Đăng ký tài khoản

3. POST /api/auth/logout
   → Đăng xuất (xóa refresh token server)

4. POST /api/auth/refresh
   → Làm mới access token

5. GET /api/auth/me
   → Lấy thông tin user hiện tại
*/
/*
==========================
 PROFILE ENDPOINTS
==========================

1. GET /api/users/me
   → Lấy thông tin profile

   Response:
   {
      id: string,
      name: string,
      bio: string,
      avatarUrl: string
   }

2. PUT /api/users/me
   → Cập nhật thông tin cá nhân

   Body:
   {
      name: string,
      bio: string
   }

3. PUT /api/users/me/avatar
   → Cập nhật ảnh đại diện
   Body: FormData (image file)

4. DELETE /api/users/me
   → Xóa tài khoản

5. PATCH /api/users/me/password
   → Đổi mật khẩu
*/

/*
==========================
 HISTORY ENDPOINTS
==========================

1. GET /api/history
   → Lấy toàn bộ lịch sử chẩn đoán của user

   Query:
   ?page=1&limit=10

2. GET /api/history/:id
   → Lấy chi tiết 1 kết quả

3. POST /api/history
   → Lưu kết quả chẩn đoán mới

4. DELETE /api/history/:id
   → Xóa 1 lịch sử

5. DELETE /api/history
   → Xóa toàn bộ lịch sử
*/

/*
==========================
 ACTIVITY ENDPOINTS
==========================

1. GET /api/posts
   → Lấy danh sách bài đăng của user

2. POST /api/posts
   → Tạo bài đăng mới

3. GET /api/posts/:id
   → Lấy chi tiết bài đăng

4. DELETE /api/posts/:id
   → Xóa bài đăng

5. POST /api/posts/:id/like
   → Like bài đăng

6. DELETE /api/posts/:id/like
   → Bỏ like

7. POST /api/posts/:id/comment
   → Bình luận

8. GET /api/posts/:id/comments
   → Lấy danh sách comment
*/

