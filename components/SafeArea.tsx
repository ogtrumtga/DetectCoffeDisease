/**
 * SafeArea Component
 * Cross-platform SafeAreaView wrapper
 * Sử dụng SafeAreaView trên mobile và View thông thường trên web
 */

import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

export function SafeArea({ children, style, ...props }: ViewProps) {
  if (Platform.OS === 'web') {
    // Trên web, sử dụng View thông thường
    return (
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    );
  }

  // Trên mobile, sử dụng SafeAreaView với edges
  return (
    <RNSafeAreaView style={[styles.container, style]} edges={['top']} {...props}>
      {children}
    </RNSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
