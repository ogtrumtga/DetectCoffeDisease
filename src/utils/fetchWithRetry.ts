/**
 * Fetch with timeout and retry logic
 * Giúp xử lý network timeout và retry tự động
 */

interface FetchWithRetryOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    timeout = 30000, // 30 giây mặc định
    retries = 2, // Retry 2 lần
    retryDelay = 1000, // Đợi 1 giây giữa các lần retry
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Tạo AbortController cho timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      lastError = error;
      
      // Nếu là lần thử cuối cùng, throw error
      if (attempt === retries) {
        console.error(`[fetchWithRetry] Failed after ${retries + 1} attempts:`, error);
        throw error;
      }

      // Log retry attempt
      console.log(`[fetchWithRetry] Attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`);
      
      // Đợi trước khi retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError || new Error('Fetch failed');
}
