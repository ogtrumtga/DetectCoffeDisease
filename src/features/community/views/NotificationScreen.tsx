/**
 * Notification Screen
 * Màn hình hiển thị danh sách notifications
 */

import { SafeArea } from '@/components/SafeArea';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { clearPendingAction } from '../../../utils/pendingAction';
import { SwipeableNotificationItem } from '../components';
import { CommunityColors } from '../design-system';
import { Notification } from '../models';
import { notificationStyles } from '../styles';
import { useNotificationVM } from '../viewmodels';

export default function NotificationScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const {
    notifications,
    loading,
    refreshing,
    hasMore,
    unreadCount,
    handleRefresh,
    handleLoadMore,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleNotificationPress
  } = useNotificationVM();

  // Xóa pending action khi màn hình mount
  // Đảm bảo không bị redirect lại khi quay về tab Community
  useEffect(() => {
    const cleanup = async () => {
      await clearPendingAction();
      console.log('Cleared pending action on NotificationScreen mount');
    };
    cleanup();
  }, []);

  const onNotificationPress = async (notification: Notification) => {
    const result = await handleNotificationPress(notification);
    
    console.log('NotificationScreen - notification pressed:', notification);
    console.log('NotificationScreen - result:', result);
    
    // Navigate based on notification type
    if (result.postId) {
      const navParams = { 
        postId: result.postId,
        commentId: result.commentId || '', // Truyền commentId để scroll đến comment
        highlightComment: result.commentId ? 'true' : 'false' // Flag để highlight comment
      };
      
      console.log('NotificationScreen - navigating with params:', navParams);
      
      router.push({
        pathname: '/(tabs)/community/post-detail',
        params: navParams
      });
    }
    
    // Close notification screen
    router.back();
  };

  const onMarkAllAsRead = () => {
    setShowMenu(false);
    Alert.alert(
      'Đánh dấu tất cả đã đọc',
      'Bạn có chắc muốn đánh dấu tất cả thông báo là đã đọc?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: handleMarkAllAsRead }
      ]
    );
  };

  const onToggleNotifications = () => {
    setShowMenu(false);
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    
    Alert.alert(
      newState ? 'Bật thông báo' : 'Tắt thông báo',
      newState 
        ? 'Bạn sẽ nhận được thông báo khi có hoạt động mới'
        : 'Bạn sẽ không nhận được thông báo. Số lượng thông báo vẫn được cập nhật.',
      [{ text: 'OK' }]
    );
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <SwipeableNotificationItem
      notification={item}
      onPress={onNotificationPress}
      onDelete={handleDeleteNotification}
    />
  );

  const renderEmptyState = () => (
    <View style={notificationStyles.emptyContainer}>
      <Text style={notificationStyles.emptyText}>
        Chưa có thông báo nào
      </Text>
      <Text style={notificationStyles.emptySubtext}>
        Các thông báo mới sẽ xuất hiện ở đây
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={notificationStyles.footerLoader}>
        <ActivityIndicator size="small" color={CommunityColors.likeButton} />
      </View>
    );
  };

  return (
    <SafeArea style={notificationStyles.container}>
      {/* Header */}
      <View style={notificationStyles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={notificationStyles.backButton}
        >
          <IconSymbol 
            name="chevron.left" 
            size={24} 
            color={CommunityColors.titleText}
          />
        </TouchableOpacity>
        
        <Text style={notificationStyles.headerTitle}>
          Thông báo {unreadCount > 0 && `(${unreadCount})`}
        </Text>
        
        <TouchableOpacity 
          onPress={() => setShowMenu(!showMenu)}
          style={notificationStyles.menuButton}
        >
          <Text style={{ fontSize: 28, color: CommunityColors.titleText, fontWeight: 'bold', lineHeight: 28 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={CommunityColors.likeButton}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={notifications.length === 0 ? { flexGrow: 1 } : undefined}
      />

      {/* Overlay to close menu */}
      {showMenu && (
        <TouchableOpacity 
          style={[StyleSheet.absoluteFill, { zIndex: 999 }]}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        />
      )}

      {/* Menu */}
      {showMenu && (
        <View style={notificationStyles.menuContainer}>
          <TouchableOpacity 
            style={notificationStyles.menuItem}
            onPress={onToggleNotifications}
          >
            <IconSymbol 
              name={notificationsEnabled ? "bell.slash" : "bell.badge"} 
              size={20} 
              color={CommunityColors.titleText}
            />
            <Text style={notificationStyles.menuItemText}>
              {notificationsEnabled ? 'Tắt thông báo' : 'Bật thông báo'}
            </Text>
          </TouchableOpacity>
          
          <View style={notificationStyles.menuSeparator} />
          
          <TouchableOpacity 
            style={notificationStyles.menuItem}
            onPress={onMarkAllAsRead}
          >
            <IconSymbol 
              name="checkmark.circle" 
              size={20} 
              color={CommunityColors.titleText}
            />
            <Text style={notificationStyles.menuItemText}>
              Đánh dấu tất cả đã đọc
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeArea>
  );
}