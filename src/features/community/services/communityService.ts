/**
 * Community Service
 * API calls cho posts và community features
 */
import { auth } from '@/config/firebase';
import { API_ENDPOINTS } from '@/src/config/api';
import { fetchWithRetry } from '@/src/utils/fetchWithRetry';
import { CommunityPost, CreatePostRequest, PaginatedResponse } from '../models';

type BackendPost = {
  id: string;
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  author?: {
    id?: string;
    displayName?: string;
    photoURL?: string;
  };
};

const toIso = (value: any): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  return new Date(value).toISOString();
};

const mapPost = (item: BackendPost): CommunityPost => ({
  id: item.id,
  title: item.title || '',
  content: item.content || '',
  image: item.images?.[0],
  author: {
    id: item.author?.id || '',
    name: item.author?.displayName || 'Unknown',
    avatar: item.author?.photoURL || '',
  },
  createdAt: toIso(item.createdAt),
  updatedAt: toIso(item.updatedAt || item.createdAt),
  likes: item.likesCount || 0,
  comments: item.commentsCount || 0,
  tags: item.tags || [],
  isLiked: !!item.isLiked,
});

const getAuthHeader = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const communityService = {
  // API: GET /community/posts - Lấy danh sách posts với phân trang
  /**
   * @param page - Số trang (mặc định: 1)
   * @param limit - Số items mỗi trang (mặc định: 10)
   * @returns PaginatedResponse<CommunityPost>
   */
  async getPosts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CommunityPost>> {
    try {
      const headers = await getAuthHeader();
      const response = await fetchWithRetry(`${API_ENDPOINTS.POSTS}?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout: 15000, // 15 giây
        retries: 2,
      });

      if (!response.ok) throw new Error('Failed to fetch posts');
      const result = await response.json();
      const mapped = (result.data || []).map((item: BackendPost) => mapPost(item));

      return {
        data: mapped,
        pagination: {
          page,
          limit,
          total: mapped.length,
          totalPages: mapped.length < limit ? page : page + 1,
        },
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // API: POST /community/posts - Tạo post mới
  /**
   * @param postData - Dữ liệu post (title, content, image)
   * @returns CommunityPost
   */
  async createPost(postData: CreatePostRequest): Promise<CommunityPost> {
    try {
      const headers = await getAuthHeader();
      const response = await fetchWithRetry(API_ENDPOINTS.POSTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          images: postData.image ? [postData.image] : [],
          tags: postData.tags || [],
        }),
        timeout: 15000,
        retries: 1,
      });
      if (!response.ok) throw new Error('Failed to create post');
      const created = await response.json();

      // đọc lại chi tiết để lấy author/photoURL thật từ Firestore
      return this.getPostDetail(created.post_id);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // API: POST /community/posts/{postId}/like - Like hoặc Unlike một post
  /**
   * @param postId - ID của post
   * @returns { isLiked, likesCount }
   */
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(API_ENDPOINTS.POST_LIKE(postId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      const result = await response.json();
      const isLiked = result.action === 'liked';
      const refreshed = await this.getPostDetail(postId);
      return { isLiked, likesCount: refreshed.likes };
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // API: GET /community/posts/search?q={query} - Tìm kiếm posts theo từ khóa
  /**
   * @param query - Từ khóa tìm kiếm
   * @returns CommunityPost[]
   */
  async searchPosts(query: string): Promise<CommunityPost[]> {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_ENDPOINTS.POSTS_SEARCH}?q=${encodeURIComponent(query)}&limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      if (!response.ok) throw new Error('Failed to search posts');
      const result = await response.json();
      return (result.data || []).map((item: BackendPost) => mapPost(item));
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  async getPostDetail(postId: string): Promise<CommunityPost> {
    const headers = await getAuthHeader();
    const response = await fetch(API_ENDPOINTS.POST_DETAIL(postId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch post detail');
    const result = await response.json();
    return mapPost(result.data);
  },

  // Cập nhật comment count của post
  updatePostCommentCount: (postId: string, increment: number = 1) => {
    console.log('Post comment count update requested:', postId, increment);
  }
};