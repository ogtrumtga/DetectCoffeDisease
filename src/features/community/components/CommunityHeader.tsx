/**
 * Community Header Component
 * Header với search và notification cho community
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNotificationContext } from '../contexts/NotificationContext';
import { CommunityColors } from '../design-system';
import { communityStyles } from '../styles';

interface CommunityHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNotificationPress: () => void;
}

export function CommunityHeader({ 
  searchQuery, 
  onSearchChange, 
  onNotificationPress 
}: CommunityHeaderProps) {
  const { unreadCount } = useNotificationContext();
  const router = useRouter();

  return (
    <View style={communityStyles.headerContainer}>
      {/* Search Container */}
      <View style={communityStyles.searchContainer}>
        <IconSymbol 
          name="magnifyingglass" 
          size={20} 
          color={CommunityColors.captionText}
          style={communityStyles.searchIcon}
        />
        <TextInput
          style={communityStyles.searchInput}
          placeholder="Tìm kiếm"
          placeholderTextColor={CommunityColors.captionText}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      
      {/* Notification Button */}
      <TouchableOpacity 
        style={communityStyles.notificationButton}
        onPress={onNotificationPress}
      >
        <IconSymbol 
          name="bell" 
          size={24} 
          color={CommunityColors.titleText} // Đổi lại màu đen cho icon
        />
        {unreadCount > 0 && (
          <View style={communityStyles.notificationBadge}>
            <Text style={communityStyles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}