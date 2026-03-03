// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Original mappings
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  
  // Navigation & UI
  'chevron.left': 'chevron-left',
  'xmark': 'close',
  
  // Search & Communication
  'magnifyingglass': 'search',
  'bell': 'notifications',
  'bell.fill': 'notifications',
  'bell.badge': 'notifications-active',
  'bell.slash': 'notifications-off',
  
  // Calendar & Time
  'calendar': 'event',
  
  // Camera & Media
  'camera': 'camera-alt',
  
  // People & Social
  'person.fill': 'person',
  'person': 'person-outline',
  'person.badge.plus': 'person-add',
  
  // Actions & Gestures - Fixed for MaterialIcons
  'hand.thumbsup': 'thumb-up',
  'hand.thumbsup.fill': 'thumb-up',
  'arrowshape.turn.up.left.fill': 'reply',
  'at': 'alternate-email',
  
  // Communication & Chat
  'bubble.left': 'chat-bubble-outline',
  'bubble.left.fill': 'chat-bubble',
  
  // Share & Export
  'square.and.arrow.up': 'share',
  
  // Edit & Create
  'pencil': 'edit',
  
  // Status & Feedback
  'checkmark.circle': 'check-circle',
  'checkmark': 'check',
  
  // Emotions
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
