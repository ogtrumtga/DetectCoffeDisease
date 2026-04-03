/**
 * Community Service
 * API calls cho posts và community features
 */
// src/features/community/services/communityService.ts
import { CommunityPost, CreatePostRequest, PaginatedResponse } from '../models';

// Base URL cho API - sẽ được config từ environment
const API_BASE_URL = 'https://your-api-domain.com/api/v1';

// Mock data để test UI
const mockPosts: CommunityPost[] = [
  {
    id: 'sample-post-1',
    title: 'Lá cà phê của tôi bị vàng, làm sao để khắc phục?',
    content: 'Gần đây tôi thấy lá cà phê của mình bắt đầu chuyển vàng và rụng nhiều. Cây được trồng trong chậu, tưới nước đều đặn mỗi ngày. Có ai biết nguyên nhân và cách khắc phục không ạ? Cảm ơn mọi người!',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=400&fit=crop',
    author: {
      id: 'user-sample',
      name: 'Nguyễn Văn A',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=4CAF50&color=fff'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 giờ trước
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 5,
    comments: 3,
    tags: ['bệnh lá vàng', 'chăm sóc cà phê'],
    isLiked: false
  }
];

export const communityService = {
  // API: GET /community/posts - Lấy danh sách posts với phân trang
  /**
   * @param page - Số trang (mặc định: 1)
   * @param limit - Số items mỗi trang (mặc định: 10)
   * @returns PaginatedResponse<CommunityPost>
   */
  async getPosts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CommunityPost>> {
    try {
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/posts?page=${page}&limit=${limit}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to fetch posts');
      // }
      // 
      // const result: ApiResponse<PaginatedResponse<CommunityPost>> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: mockPosts,
            pagination: {
              page,
              limit,
              total: mockPosts.length,
              totalPages: Math.ceil(mockPosts.length / limit)
            }
          });
        }, 500);
      });
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
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/posts`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   },
      //   body: JSON.stringify(postData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create post');
      // }
      // 
      // const result: ApiResponse<CommunityPost> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPost: CommunityPost = {
            id: Date.now().toString(),
            title: postData.title,
            content: postData.content,
            image: postData.image,
            author: {
              id: 'current-user',
              name: 'Đăng Vinh',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
            isLiked: false
          };
          
          mockPosts.unshift(newPost);
          console.log('Added new post to mockPosts, total posts:', mockPosts.length);
          
          resolve(newPost);
        }, 500);
      });
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
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/posts/${postId}/like`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to toggle like');
      // }
      // 
      // const result: ApiResponse<{ isLiked: boolean; likesCount: number }> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const post = mockPosts.find(p => p.id === postId);
          if (post) {
            post.isLiked = !post.isLiked;
            post.likes += post.isLiked ? 1 : -1;
            console.log('Updated post like:', post.id, 'likes:', post.likes);
            resolve({
              isLiked: post.isLiked,
              likesCount: post.likes
            });
          } else {
            console.log('Post not found in mockPosts for like toggle:', postId);
            resolve({
              isLiked: false,
              likesCount: 0
            });
          }
        }, 300);
      });
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
      // TODO: Backend - Implement API endpoint
      // const response = await fetch(`${API_BASE_URL}/community/posts/search?q=${encodeURIComponent(query)}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to search posts');
      // }
      // 
      // const result: ApiResponse<CommunityPost[]> = await response.json();
      // return result.data;

      // Mock response
      return new Promise((resolve) => {
        setTimeout(() => {
          const filteredPosts = mockPosts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase())
          );
          resolve(filteredPosts);
        }, 300);
      });
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  },

  // Cập nhật comment count của post
  updatePostCommentCount: (postId: string, increment: number = 1) => {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      post.comments += increment;
      console.log('Updated post comment count:', post.id, 'comments:', post.comments);
    }
  }
};

// Helper function để lấy auth token - implement sau
// function getAuthToken(): string {
//   return 'your-auth-token';
// }