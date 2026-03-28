# 🔗 CÁCH FIRESTORE XỬ LÝ MỐI QUAN HỆ

## ❌ FIRESTORE KHÔNG CÓ:
- Foreign Keys
- JOIN queries
- Cascading deletes
- Referential integrity

## ✅ FIRESTORE CHỈ CÓ:
- Document references (chỉ là string ID)
- Manual queries (phải query nhiều lần)
- Application-level relationships (xử lý trong code)

---

## 📝 VÍ DỤ CỤ THỂ

### SQL Server (Có mối quan hệ tự động):

```sql
-- Tạo bảng với Foreign Key
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,
    author_id VARCHAR(50),
    title VARCHAR(200),
    FOREIGN KEY (author_id) REFERENCES users(id)  ← Mối quan hệ
);

-- Query với JOIN (1 lần query)
SELECT 
    posts.id,
    posts.title,
    users.name AS author_name
FROM posts
JOIN users ON posts.author_id = users.id
WHERE posts.id = 'post123';
```

### Firestore (KHÔNG có mối quan hệ):

```javascript
// Collection: users
{
  "id": "user456",
  "name": "Nguyễn Văn A"
}

// Collection: posts
{
  "id": "post123",
  "authorId": "user456",  ← Chỉ là string, KHÔNG có constraint!
  "title": "My post"
}

// Query (phải 2 lần):
// 1. Lấy post
const post = await db.collection('posts').doc('post123').get();

// 2. Lấy user (manual join trong code)
const user = await db.collection('users').doc(post.data().authorId).get();

// 3. Kết hợp trong code
const result = {
  ...post.data(),
  author: user.data()
};
```

---

## 🔧 CÁCH XỬ LÝ MỐI QUAN HỆ TRONG CODE

### Ví dụ 1: Lấy bài đăng kèm thông tin tác giả

```python
# backend/services/community_service.py

def get_post_with_author(post_id: str):
    """Lấy bài đăng kèm thông tin tác giả."""
    
    # 1. Lấy post
    post = firebase_post_repository.get_post_by_id(post_id)
    if not post:
        return None
    
    # 2. Lấy author (manual join)
    author = firebase_user_repository.get_user_by_id(post['authorId'])
    
    # 3. Kết hợp dữ liệu
    return {
        'id': post['id'],
        'title': post['title'],
        'content': post['content'],
        'author': {
            'id': author['id'],
            'name': author['displayName'],
            'avatar': author['photoURL']
        },
        'createdAt': post['createdAt']
    }
```

### Ví dụ 2: Lấy danh sách bài đăng kèm tác giả

```python
def get_posts_with_authors(limit: int = 20):
    """Lấy danh sách bài đăng kèm thông tin tác giả."""
    
    # 1. Lấy danh sách posts
    posts = firebase_post_repository.get_posts(limit=limit)
    
    # 2. Lấy danh sách author IDs (unique)
    author_ids = list(set([post['authorId'] for post in posts]))
    
    # 3. Lấy tất cả authors (batch query)
    authors = {}
    for author_id in author_ids:
        author = firebase_user_repository.get_user_by_id(author_id)
        authors[author_id] = author
    
    # 4. Kết hợp dữ liệu
    result = []
    for post in posts:
        author = authors.get(post['authorId'])
        result.append({
            'id': post['id'],
            'title': post['title'],
            'content': post['content'],
            'author': {
                'id': author['id'],
                'name': author['displayName'],
                'avatar': author['photoURL']
            } if author else None,
            'createdAt': post['createdAt']
        })
    
    return result
```

---

## ⚠️ VẤN ĐỀ VỚI FIRESTORE

### 1. Không có Referential Integrity

```python
# SQL Server: Không thể xóa user nếu còn posts
DELETE FROM users WHERE id = 'user456';  
# ❌ Error: Foreign key constraint

# Firestore: Có thể xóa user, posts vẫn còn!
db.collection('users').document('user456').delete()
# ✅ Xóa thành công, nhưng posts vẫn có authorId = 'user456'
# → Dữ liệu bị orphaned!
```

**Giải pháp**: Phải tự xử lý trong code:

```python
def delete_user_with_cleanup(user_id: str):
    """Xóa user và cleanup dữ liệu liên quan."""
    
    # 1. Xóa tất cả posts của user
    posts = db.collection('posts').where('authorId', '==', user_id).stream()
    for post in posts:
        post.reference.delete()
    
    # 2. Xóa tất cả comments của user
    comments = db.collection('comments').where('authorId', '==', user_id).stream()
    for comment in comments:
        comment.reference.delete()
    
    # 3. Xóa tất cả likes của user
    likes = db.collection('likes').where('userId', '==', user_id).stream()
    for like in likes:
        like.reference.delete()
    
    # 4. Xóa user
    db.collection('users').document(user_id).delete()
```

### 2. Không có JOIN → Nhiều queries

```python
# SQL: 1 query
SELECT posts.*, users.name 
FROM posts 
JOIN users ON posts.author_id = users.id;

# Firestore: N+1 queries
posts = get_all_posts()  # 1 query
for post in posts:
    author = get_user(post.authorId)  # N queries
```

**Giải pháp**: Denormalization (lưu dữ liệu trùng lặp)

```javascript
// Thay vì chỉ lưu authorId:
{
  "id": "post123",
  "authorId": "user456",
  "title": "My post"
}

// Lưu luôn thông tin author (denormalized):
{
  "id": "post123",
  "authorId": "user456",
  "authorName": "Nguyễn Văn A",  ← Trùng lặp
  "authorAvatar": "https://...",  ← Trùng lặp
  "title": "My post"
}

// Lợi ích: Chỉ cần 1 query để lấy post + author info
// Nhược điểm: Khi user đổi tên, phải update tất cả posts
```

---

## 🎯 KẾT LUẬN

### Firestore quản lý mối quan hệ như thế nào?

**KHÔNG TỰ ĐỘNG!** Bạn phải:

1. **Lưu ID dạng string** (authorId, postId, userId)
2. **Tự query nhiều lần** trong code
3. **Tự xử lý cascading deletes**
4. **Tự maintain data consistency**

### Mối quan hệ được định nghĩa ở đâu?

**Trong CODE (Services layer)**, không phải trong database!

```python
# backend/services/community_service.py
# ← Đây là nơi định nghĩa mối quan hệ!

def get_post_with_relations(post_id: str):
    # Mối quan hệ 1: post → author
    post = get_post(post_id)
    author = get_user(post['authorId'])
    
    # Mối quan hệ 2: post → comments
    comments = get_comments_by_post(post_id)
    
    # Mối quan hệ 3: post → likes
    likes_count = count_likes_by_post(post_id)
    
    return {
        'post': post,
        'author': author,
        'comments': comments,
        'likes_count': likes_count
    }
```

### So sánh:

| Feature | SQL Server | Firestore |
|---------|-----------|-----------|
| Foreign Keys | ✅ Có | ❌ Không |
| JOIN | ✅ Có | ❌ Không |
| Referential Integrity | ✅ Tự động | ❌ Phải tự code |
| Cascading Delete | ✅ Tự động | ❌ Phải tự code |
| Relationships | ✅ Database level | ❌ Application level |

---

## 💡 BEST PRACTICES

1. **Luôn validate IDs** trước khi lưu
2. **Implement cleanup functions** khi xóa
3. **Denormalize** dữ liệu thường dùng
4. **Cache** kết quả queries
5. **Document** mối quan hệ trong code comments
