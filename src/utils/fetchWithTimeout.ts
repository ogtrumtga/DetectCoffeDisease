/**
 * Fetch wrapper with custom timeout and better error handling
 */

export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number; // milliseconds
}

export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeout = 60000, ...fetchOptions } = options; // Default 60s

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`[fetchWithTimeout] Requesting: ${url}`);
    console.log(`[fetchWithTimeout] Timeout: ${timeout}ms`);
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`[fetchWithTimeout] Response: ${response.status} ${response.statusText}`);
    
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error(`[fetchWithTimeout] Request timed out after ${timeout}ms`);
      throw new Error(`Request timed out after ${timeout / 1000}s. Backend có thể đang xử lý chậm hoặc không phản hồi.`);
    }
    
    console.error(`[fetchWithTimeout] Request failed:`, error);
    throw error;
  }
}
