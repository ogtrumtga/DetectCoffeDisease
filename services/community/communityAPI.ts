import { CommunityPost, CreatePostRequest, PaginatedResponse } from './types';

// Base URL cho API - sẽ được config từ environment
const API_BASE_URL = 'https://your-api-domain.com/api/v1';

// Mock data để test UI
const mockPosts: CommunityPost[] = [];

// API Functions - Hiện tại return mock data, sau này uncomment để gọi API thật

export const communityAPI = {
  // Lấy danh sách posts
  async getPosts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CommunityPost>> {
    try {
      // TODO: Uncomment khi có API thật
      // const response = await fetch(`${API_BASE_URL}/community/posts?page=${page}&limit=${limit}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}` // Implement getAuthToken()
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
        }, 500); // Simulate network delay
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Tạo post mới
  async createPost(postData: CreatePostRequest): Promise<CommunityPost> {
    try {
      // TODO: Uncomment khi có API thật
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
          
          // Thêm post mới vào đầu danh sách mock
          mockPosts.unshift(newPost);
          
          console.log('Added new post to mockPosts, total posts:', mockPosts.length); // Debug log
          
          resolve(newPost);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Like/Unlike post
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    try {
      // TODO: Uncomment khi có API thật
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
            console.log('Updated post like:', post.id, 'likes:', post.likes); // Debug log
            resolve({
              isLiked: post.isLiked,
              likesCount: post.likes
            });
          } else {
            console.log('Post not found in mockPosts for like toggle:', postId); // Debug log
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

  // Tìm kiếm posts
  async searchPosts(query: string): Promise<CommunityPost[]> {
    try {
      // TODO: Uncomment khi có API thật
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
      console.log('Updated post comment count:', post.id, 'comments:', post.comments); // Debug log
    }
  }
};

// Helper function để lấy auth token - implement sau
// function getAuthToken(): string {
//   // Implement logic để lấy token từ AsyncStorage hoặc secure store
//   return 'your-auth-token';
// }