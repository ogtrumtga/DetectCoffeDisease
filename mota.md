# Mô tả các file đã tạo cho tính năng Community

## 📁 Cấu trúc thư mục
```
app/
├── (tabs)/
│   └── community.tsx              # Trang chính cộng đồng
├── create-post.tsx                # Trang tạo bài viết mới
└── post-detail.tsx               # Trang chi tiết bài viết

components/community/
├── CommunityHeader.tsx           # Header với search và notification
├── CommunityFeed.tsx            # Danh sách bài viết
├── CommunityPost.tsx            # Component hiển thị 1 bài viết
├── CreatePostButton.tsx         # Nút floating "Hỏi cộng đồng"
├── PostDetailContent.tsx        # Nội dung chi tiết bài viết
├── CommentList.tsx              # Danh sách comment
├── CommentItem.tsx              # Component hiển thị 1 comment
└── CommentInput.tsx             # Input để nhập comment

services/community/
├── types.ts                     # Định nghĩa TypeScript interfaces
├── communityAPI.ts              # API calls cho bài viết
└── commentAPI.ts                # API calls cho comment
```

## 📄 Chi tiết từng file

### 🎯 **App Screens**

#### `app/(tabs)/community.tsx`
- **Chức năng**: Trang chính của tính năng cộng đồng
- **Bao gồm**: 
  - Header với search và notification
  - Danh sách bài viết với infinite scroll
  - Pull-to-refresh
  - Nút floating "Hỏi cộng đồng"
- **Navigation**: Điều hướng đến trang tạo bài viết và chi tiết bài viết

#### `app/create-post.tsx`
- **Chức năng**: Modal tạo bài viết mới
- **Tính năng**:
  - Chọn ảnh từ camera/thư viện
  - Nhập tiêu đề và mô tả (có validation)
  - Xử lý keyboard với KeyboardAvoidingView
  - Header màu xanh lá (#DAF1DE)
- **Sau khi đăng**: Quay về trang cộng đồng và hiển thị bài viết mới

#### `app/post-detail.tsx`
- **Chức năng**: Trang chi tiết bài viết
- **Tính năng**:
  - Hiển thị đầy đủ thông tin bài viết
  - Hệ thống comment với nested replies
  - Like bài viết và comment
  - Đồng bộ số lượng comment với trang chính

### 🧩 **Components**

#### `components/community/CommunityHeader.tsx`
- **Chức năng**: Header của trang cộng đồng
- **Bao gồm**: 
  - Tiêu đề "Cộng đồng"
  - Icon search
  - Icon notification

#### `components/community/CommunityFeed.tsx`
- **Chức năng**: Danh sách bài viết với FlatList
- **Tính năng**:
  - Infinite scroll
  - Pull-to-refresh
  - Loading states
  - Empty state khi không có bài viết

#### `components/community/CommunityPost.tsx`
- **Chức năng**: Component hiển thị 1 bài viết trong danh sách
- **Bao gồm**:
  - Avatar và thông tin tác giả
  - Tiêu đề và nội dung
  - Hình ảnh (nếu có)
  - Actions: Like, Comment, Share
  - Tính năng "Xem thêm" cho nội dung dài (đã implement nhưng bị dừng theo yêu cầu)

#### `components/community/CreatePostButton.tsx`
- **Chức năng**: Nút floating "Hỏi cộng đồng"
- **Vị trí**: Bottom right của màn hình
- **Action**: Mở modal tạo bài viết

#### `components/community/PostDetailContent.tsx`
- **Chức năng**: Hiển thị nội dung đầy đủ của bài viết trong trang chi tiết
- **Bao gồm**:
  - Hình ảnh lớn (resizeMode="contain")
  - Thông tin tác giả
  - Tiêu đề và nội dung đầy đủ
  - Actions: Like, Comment, Share

#### `components/community/CommentList.tsx`
- **Chức năng**: Danh sách comment với FlatList
- **Tính năng**:
  - Hiển thị comment theo thứ tự thời gian
  - Hỗ trợ nested replies
  - Loading và empty states

#### `components/community/CommentItem.tsx`
- **Chức năng**: Component hiển thị 1 comment
- **Tính năng**:
  - Avatar và tên người comment
  - Nội dung comment và thời gian
  - Nút reply để trả lời
  - Hiển thị replies với indentation
  - Visual hierarchy cho replies (avatar nhỏ hơn, background khác)

#### `components/community/CommentInput.tsx`
- **Chức năng**: Input để nhập comment hoặc reply
- **Tính năng**:
  - TextInput với placeholder động
  - Nút gửi
  - Xử lý keyboard
  - Hỗ trợ cả comment mới và reply

### 🔧 **Services**

#### `services/community/types.ts`
- **Chức năng**: Định nghĩa TypeScript interfaces
- **Bao gồm**:
  - `CommunityPost`: Cấu trúc bài viết
  - `Comment`: Cấu trúc comment với nested replies
  - `CreatePostRequest`, `CreateCommentRequest`: Request types
  - `ApiResponse`, `PaginatedResponse`: Response types

#### `services/community/communityAPI.ts`
- **Chức năng**: API calls cho bài viết
- **Methods**:
  - `getPosts()`: Lấy danh sách bài viết (có pagination)
  - `createPost()`: Tạo bài viết mới
  - `toggleLike()`: Like/unlike bài viết
  - `searchPosts()`: Tìm kiếm bài viết
  - `updatePostCommentCount()`: Cập nhật số lượng comment
- **Hiện tại**: Sử dụng mock data, API thật đã comment sẵn

#### `services/community/commentAPI.ts`
- **Chức năng**: API calls cho comment
- **Methods**:
  - `getComments()`: Lấy comment của bài viết
  - `createComment()`: Tạo comment hoặc reply
  - `toggleCommentLike()`: Like/unlike comment
- **Hiện tại**: Sử dụng mock data, API thật đã comment sẵn

## 🎨 **Đặc điểm UI/UX**

### Màu sắc
- Header tạo bài viết: `#DAF1DE` (xanh lá sáng)
- Background chính: Trắng
- Text chính: Đen
- Text phụ: `#6B7280` (xám)
- Link/tên tác giả: `#3B82F6` (xanh dương)

### Tính năng đặc biệt
- **Infinite scroll**: Tự động load thêm bài viết khi scroll xuống
- **Pull-to-refresh**: Kéo xuống để refresh danh sách
- **Nested comments**: Hỗ trợ reply comment với visual hierarchy
- **Image handling**: Hiển thị ảnh với aspect ratio đúng
- **Real-time sync**: Đồng bộ số lượng comment giữa các màn hình
- **Keyboard handling**: Xử lý bàn phím khi nhập liệu

## 🔄 **Luồng hoạt động**

1. **Xem bài viết**: Trang cộng đồng → Danh sách bài viết
2. **Tạo bài viết**: Nút "Hỏi cộng đồng" → Modal tạo bài viết → Đăng → Quay về trang chính
3. **Xem chi tiết**: Click bài viết → Trang chi tiết → Xem comment
4. **Comment**: Trang chi tiết → Nhập comment → Gửi → Cập nhật số lượng
5. **Reply**: Click reply → Nhập reply → Gửi → Hiển thị nested

## 📝 **Lưu ý cho Backend**

- Tất cả API calls đã được comment sẵn trong code
- Mock data hiện tại để test UI
- Cần implement authentication (getAuthToken function)
- Database cần hỗ trợ nested comments (parentId field)
- Image upload cần endpoint riêng
- Pagination cho comments nếu số lượng lớn

## 🚀 **Sẵn sàng tích hợp**

Tất cả file đã được tổ chức theo cấu trúc rõ ràng, dễ maintain và mở rộng. Backend developer chỉ cần uncomment các API calls và thay thế bằng endpoint thật.