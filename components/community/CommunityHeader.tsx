import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={[styles.searchContainer, { backgroundColor: '#FFFFFF' }]}>
        <IconSymbol 
          name="magnifyingglass" 
          size={20} 
          color="#9CA3AF" 
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: '#1F2937' }]}
          placeholder="Tìm kiếm"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={onNotificationPress}
      >
        <IconSymbol 
          name="bell" 
          size={24} 
          color="#374151"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  notificationButton: {
    padding: 8,
  },
});