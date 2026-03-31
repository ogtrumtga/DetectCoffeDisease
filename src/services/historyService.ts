/**
 * History Service - Gọi backend API
 */
import { API_ENDPOINTS } from '../config/api';

export interface HistoryItem {
  inferenceId: string;
  imageId: string;
  predictions: any;
  createdAt: string;
}

/**
 * Lấy danh sách lịch sử chẩn đoán
 */
export async function getHistoryList(token: string, page: number = 1): Promise<HistoryItem[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.HISTORY}?page=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('[historyService] getHistoryList failed:', error);
    throw error;
  }
}

/**
 * Lấy chi tiết một bản ghi lịch sử
 */
export async function getHistoryDetail(token: string, id: string): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINTS.HISTORY_DETAIL(id), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.detail;
  } catch (error) {
    console.error('[historyService] getHistoryDetail failed:', error);
    throw error;
  }
}

/**
 * Tạo bản ghi lịch sử mới
 */
export async function createHistory(token: string, data: any): Promise<string> {
  try {
    const response = await fetch(API_ENDPOINTS.HISTORY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.id;
  } catch (error) {
    console.error('[historyService] createHistory failed:', error);
    throw error;
  }
}

/**
 * Xóa một bản ghi lịch sử
 */
export async function deleteHistory(token: string, id: string): Promise<void> {
  try {
    const response = await fetch(API_ENDPOINTS.HISTORY_DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('[historyService] deleteHistory failed:', error);
    throw error;
  }
}

/**
 * Xóa toàn bộ lịch sử
 */
export async function deleteAllHistory(token: string): Promise<void> {
  try {
    const response = await fetch(API_ENDPOINTS.HISTORY, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('[historyService] deleteAllHistory failed:', error);
    throw error;
  }
}
