// src/services/googleAuthService.ts
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const REDIRECT_URI = `https://auth.expo.io/@${process.env.EXPO_PUBLIC_EXPO_USERNAME}/${process.env.EXPO_PUBLIC_EXPO_SLUG}`;

export interface GoogleAuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  try {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: REDIRECT_URI,
      response_type: 'id_token token',
      scope: 'openid profile email',
      nonce: Math.random().toString(36).substring(7),
      prompt: 'select_account',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log('=== GOOGLE AUTH START ===');
    console.log('Auth URL:', authUrl);
    console.log('Redirect URI:', REDIRECT_URI);
    console.log('========================');

    // Mở browser để đăng nhập
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      REDIRECT_URI
    );

    console.log('=== AUTH SESSION RESULT ===');
    console.log('Type:', result.type);
    console.log('Full Result:', JSON.stringify(result, null, 2));
    console.log('===========================');

    if (result.type === 'success') {
      const { url } = result;
      console.log('Success URL:', url);
      
      // Parse tokens từ URL - có thể là fragment (#) hoặc query (?)
      let idToken = null;
      let accessToken = null;

      // Thử parse từ fragment (#)
      if (url.includes('#')) {
        const fragment = url.split('#')[1];
        const fragmentParams = new URLSearchParams(fragment);
        idToken = fragmentParams.get('id_token');
        accessToken = fragmentParams.get('access_token');
        console.log('Parsed from fragment - ID Token:', idToken ? 'Found' : 'Not found');
        console.log('Parsed from fragment - Access Token:', accessToken ? 'Found' : 'Not found');
      }

      // Nếu không có trong fragment, thử parse từ query (?)
      if (!idToken && !accessToken && url.includes('?')) {
        const query = url.split('?')[1]?.split('#')[0];
        const queryParams = new URLSearchParams(query);
        idToken = queryParams.get('id_token');
        accessToken = queryParams.get('access_token');
        console.log('Parsed from query - ID Token:', idToken ? 'Found' : 'Not found');
        console.log('Parsed from query - Access Token:', accessToken ? 'Found' : 'Not found');
      }

      if (idToken) {
        console.log('Signing in with ID token...');
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        console.log('Firebase sign-in successful!');
        
        return {
          success: true,
          user: userCredential.user,
        };
      } else if (accessToken) {
        console.log('Signing in with access token...');
        const credential = GoogleAuthProvider.credential(null, accessToken);
        const userCredential = await signInWithCredential(auth, credential);
        console.log('Firebase sign-in successful!');
        
        return {
          success: true,
          user: userCredential.user,
        };
      } else {
        console.error('No tokens found in URL');
        return {
          success: false,
          error: 'Không nhận được token từ Google. URL: ' + url,
        };
      }
    } else if (result.type === 'cancel') {
      console.log('User cancelled');
      return {
        success: false,
        error: 'Người dùng đã hủy đăng nhập',
      };
    } else {
      console.log('Auth failed with type:', result.type);
      return {
        success: false,
        error: 'Đăng nhập thất bại',
      };
    }
  } catch (error: any) {
    console.error('=== GOOGLE SIGN-IN ERROR ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('============================');
    return {
      success: false,
      error: error.message || 'Đã xảy ra lỗi',
    };
  }
};

const fetchGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};
