/**
 * Community Screen
 * Màn hình chính của community feature
 */
// src/features/community/views/CommunityScreen.tsx
import { SafeArea } from "@/components/SafeArea";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Share, View } from "react-native";
import {
    CommunityFeed,
    CommunityHeader,
    CreatePostButton,
} from "../components";
import { CommunityPost } from "../models";
import { communityStyles } from "../styles";
import { useCommunityVM } from "../viewmodels";

export default function CommunityHome() {
  const params = useLocalSearchParams();

  const {
    posts,
    loading,
    refreshing,
    searchQuery,
    hasMore,
    setSearchQuery,
    handleRefresh,
    handleLoadMore,
    handleLike,
    updatePost,
    refreshPosts,
  } = useCommunityVM();

  // Xử lý khi có trigger refresh từ create-post
  React.useEffect(() => {
    if (params.refresh) {
      refreshPosts();
      // Clear params sau khi đã xử lý
      router.setParams({ refresh: undefined });
    }
  }, [params.refresh]);

  // Xử lý khi có cập nhật post từ post-detail
  React.useEffect(() => {
    if (params.updatedPost) {
      try {
        const updatedPost: CommunityPost = JSON.parse(
          params.updatedPost as string,
        );
        console.log(
          "Received updated post:",
          updatedPost.id,
          "comments:",
          updatedPost.comments,
        );

        updatePost(updatedPost);
        // Clear params sau khi đã xử lý
        router.setParams({ updatedPost: undefined });
      } catch (error) {
        console.error("Error parsing updated post:", error);
      }
    }
  }, [params.updatedPost]);

  const handleComment = (postId: string) => {
    const selectedPost = posts.find((p) => p.id === postId);
    if (selectedPost) {
      router.push({
        pathname: "/(tabs)/community/post-detail",
        params: {
          postId: postId,
          postData: JSON.stringify(selectedPost),
        },
      });
    }
  };

  const handlePostPress = (postId: string) => {
    const selectedPost = posts.find((p) => p.id === postId);
    if (selectedPost) {
      router.push({
        pathname: "/(tabs)/community/post-detail",
        params: {
          postId: postId,
          postData: JSON.stringify(selectedPost),
        },
      });
    }
  };

  const handleCreatePost = () => {
    router.push("/(tabs)/community/create-post");
  };

  const handleNotificationPress = () => {
    router.push("/(tabs)/community/notification-modal");
  };

  const handleShare = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      const shareMessage = `${post.title}\n\n${post.content}\n\nĐược chia sẻ từ Cộng đồng Cà phê`;

      const result = await Share.share(
        {
          message: shareMessage,
          title: post.title,
          // URL có thể thêm sau khi có deep linking
          // url: `myapp://post/${postId}`
        },
        {
          // iOS only
          subject: post.title,
          dialogTitle: "Chia sẻ bài viết",
        },
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Chia sẻ thành công với activity type cụ thể (iOS)
          console.log("Shared with activity type:", result.activityType);
        } else {
          // Chia sẻ thành công (Android)
          console.log("Post shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // User đã dismiss share dialog
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      Alert.alert("Lỗi", "Không thể chia sẻ bài viết");
    }
  };

  return (
    <SafeArea style={communityStyles.container}>
      <CommunityHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNotificationPress={handleNotificationPress}
      />

      <View style={communityStyles.content}>
        <CommunityFeed
          posts={posts}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onLike={handleLike}
          onComment={handleComment}
          onPostPress={handlePostPress}
          onShare={handleShare}
        />
      </View>

      <CreatePostButton onPress={handleCreatePost} />
    </SafeArea>
  );
}
