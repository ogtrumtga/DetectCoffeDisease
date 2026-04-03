import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface GoogleAuthWebViewProps {
  visible: boolean;
  onSuccess: (idToken: string, accessToken: string) => void;
  onCancel: () => void;
}

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const REDIRECT_URI = `https://auth.expo.io/@${process.env.EXPO_PUBLIC_EXPO_USERNAME}/${process.env.EXPO_PUBLIC_EXPO_SLUG}`;

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: GOOGLE_CLIENT_ID!,
  redirect_uri: REDIRECT_URI,
  response_type: 'id_token token',
  scope: 'openid profile email',
  prompt: 'select_account',
  nonce: Math.random().toString(36).substring(7),
}).toString();

const GoogleAuthWebView: React.FC<GoogleAuthWebViewProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    console.log('[GoogleAuthWebView] Navigation URL:', url);

    // Check if redirected to auth.expo.io with tokens
    if (url.includes('auth.expo.io')) {
      // Parse tokens từ URL fragment (#)
      if (url.includes('#')) {
        const fragment = url.split('#')[1];
        const params = new URLSearchParams(fragment);
        const idToken = params.get('id_token');
        const accessToken = params.get('access_token');

        console.log('[GoogleAuthWebView] ID Token:', idToken ? 'Found' : 'Not found');
        console.log('[GoogleAuthWebView] Access Token:', accessToken ? 'Found' : 'Not found');

        if (idToken || accessToken) {
          onSuccess(idToken || '', accessToken || '');
        }
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Đăng nhập Google</Text>
          <Pressable onPress={onCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </Pressable>
        </View>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        )}

        {/* WebView */}
        <WebView
          source={{ uri: GOOGLE_AUTH_URL }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  webview: {
    flex: 1,
  },
});

export default GoogleAuthWebView;
