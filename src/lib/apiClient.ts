export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
}

function normalizeErrorPayload(rawMessage: unknown): string {
  if (!rawMessage) return '';
  if (typeof rawMessage === 'string') {
    const trimmed = rawMessage.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        const nested = parsed?.error?.message || parsed?.message || parsed?.error;
        if (typeof nested === 'string' && nested.trim()) {
          return normalizeErrorPayload(nested);
        }
      } catch {
        // Keep original string if not valid JSON
      }
    }
    if (/high demand|unavailable|503|overloaded/i.test(trimmed)) {
      return 'Hệ thống AI đang có lượng truy cập cao. Vui lòng thử gửi lại sau vài giây.';
    }
    if (/quota|resource_exhausted|429/i.test(trimmed)) {
      return 'Hạn mức AI tạm thời đạt giới hạn. Vui lòng chờ giây lát rồi thử lại.';
    }
    if (/api_key|permission_denied|403/i.test(trimmed)) {
      return 'Kết nối API AI chưa hợp lệ hoặc thiếu quyền truy cập. Vui lòng kiểm tra cấu hình Secrets.';
    }
    return trimmed;
  }
  if (typeof rawMessage === 'object') {
    const obj = rawMessage as Record<string, any>;
    return normalizeErrorPayload(obj?.error?.message || obj?.message || obj?.error || '');
  }
  return String(rawMessage);
}

export async function safeFetchJson<T = any>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 28000
): Promise<SafeApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Merge external signal if provided
  const externalSignal = init.signal;
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal
    });

    const rawText = await res.text();
    const trimmed = rawText.trim();

    // Guard against reverse proxy / Vite HTML fallback pages
    if (
      trimmed.startsWith('<') ||
      trimmed.toLowerCase().startsWith('<!doctype')
    ) {
      return {
        ok: false,
        status: res.status || 502,
        data: null,
        error:
          res.status === 504 || res.status === 502 || res.status === 503
            ? 'Máy chủ AI đang xử lý chậm hoặc tạm quá tải, vui lòng bấm gửi lại sau vài giây.'
            : 'Máy chủ trả về định dạng trang web thay vì JSON. Vui lòng thử lại.'
      };
    }

    let parsed: any = null;
    if (trimmed.length > 0) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        return {
          ok: false,
          status: res.status || 500,
          data: null,
          error: 'Phản hồi từ máy chủ không đúng định dạng JSON. Vui lòng thử lại.'
        };
      }
    }

    if (!res.ok) {
      const msg =
        normalizeErrorPayload(parsed?.error || parsed?.message) ||
        `Yêu cầu thất bại (Mã ${res.status}). Vui lòng thử lại.`;
      return {
        ok: false,
        status: res.status,
        data: parsed,
        error: msg
      };
    }

    return {
      ok: true,
      status: res.status,
      data: parsed as T
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        ok: false,
        status: 408,
        data: null,
        error: 'Yêu cầu phản hồi quá lâu (timeout). Vui lòng thử gửi lại.'
      };
    }
    return {
      ok: false,
      status: 0,
      data: null,
      error: err?.message || 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.'
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
