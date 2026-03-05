/**
 * Pending Action Utility
 * Quản lý các hành động chờ xử lý sau khi đăng nhập
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_ACTION_KEY = '@pending_action';
const ACTION_TIMEOUT = 5 * 60 * 1000; // 5 phút

export interface PendingAction {
  action: 'create-post' | 'like-post' | 'comment' | 'like-comment' | 'notification';
  returnPath: string;
  timestamp: number;
  data?: {
    postId?: string;
    commentId?: string;
    postData?: string;
  };
}

/**
 * Lưu hành động chờ xử lý
 */
export const savePendingAction = async (action: Omit<PendingAction, 'timestamp'>): Promise<void> => {
  try {
    const pendingAction: PendingAction = {
      ...action,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(PENDING_ACTION_KEY, JSON.stringify(pendingAction));
    console.log('Saved pending action:', pendingAction);
  } catch (error) {
    console.error('Error saving pending action:', error);
  }
};

/**
 * Lấy hành động chờ xử lý
 */
export const getPendingAction = async (): Promise<PendingAction | null> => {
  try {
    const data = await AsyncStorage.getItem(PENDING_ACTION_KEY);
    if (!data) return null;

    const pendingAction: PendingAction = JSON.parse(data);

    // Kiểm tra hết hạn
    const isExpired = Date.now() - pendingAction.timestamp > ACTION_TIMEOUT;
    if (isExpired) {
      console.log('Pending action expired, removing...');
      await clearPendingAction();
      return null;
    }

    return pendingAction;
  } catch (error) {
    console.error('Error getting pending action:', error);
    return null;
  }
};

/**
 * Xóa hành động chờ xử lý
 */
export const clearPendingAction = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PENDING_ACTION_KEY);
    console.log('Cleared pending action');
  } catch (error) {
    console.error('Error clearing pending action:', error);
  }
};

/**
 * Kiểm tra có hành động chờ xử lý không
 */
export const hasPendingAction = async (): Promise<boolean> => {
  const action = await getPendingAction();
  return action !== null;
};
