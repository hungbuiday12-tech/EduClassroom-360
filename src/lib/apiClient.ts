export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  isStaticFallback?: boolean;
}

const DEFAULT_REMOTE_API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') ||
  'https://ais-pre-2cajz7v7fqng2hy3peejkj-489067186717.asia-southeast1.run.app';

let sessionForceRemote = false;

function getStoredApiBase(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    const val = window.localStorage.getItem('educlassroom_api_base_url')?.trim();
    if (val && /^https?:\/\//i.test(val)) {
      return val.replace(/\/+$/, '');
    }
  } catch {}
  return null;
}

function isPackagedOrStaticOrigin(): boolean {
  if (typeof window === 'undefined') return false;
  const { protocol, hostname, port } = window.location;
  if (
    protocol === 'file:' ||
    protocol === 'capacitor:' ||
    protocol === 'ionic:' ||
    protocol === 'tauri:' ||
    protocol === 'app:' ||
    protocol === 'chrome-extension:' ||
    protocol === 'ms-appx:'
  ) {
    return true;
  }
  if (hostname.endsWith('.github.io')) return true;
  if (hostname === 'tauri.localhost' || hostname.endsWith('.localhost')) return true;
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port !== '3000') {
    return true;
  }
  return false;
}

export function getRemoteApiBase(): string {
  return getStoredApiBase() || DEFAULT_REMOTE_API_BASE;
}

export function resolveApiUrl(path: string, forceRemote = false): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const envConfigured = Boolean((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim());
  const storedBase = getStoredApiBase();

  if (forceRemote || sessionForceRemote || envConfigured || storedBase || isPackagedOrStaticOrigin()) {
    return `${storedBase || DEFAULT_REMOTE_API_BASE}${normalizedPath}`;
  }
  return normalizedPath;
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

function extractBalancedJson(raw: string): any | null {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstObj = cleaned.indexOf('{');
    const lastObj = cleaned.lastIndexOf('}');
    if (firstObj !== -1 && lastObj > firstObj) {
      try {
        return JSON.parse(cleaned.slice(firstObj, lastObj + 1));
      } catch {
        // ignore
      }
    }
    const firstArr = cleaned.indexOf('[');
    const lastArr = cleaned.lastIndexOf(']');
    if (firstArr !== -1 && lastArr > firstArr) {
      try {
        return JSON.parse(cleaned.slice(firstArr, lastArr + 1));
      } catch {
        // ignore
      }
    }
    return null;
  }
}

async function fetchJsonOnce<T = any>(
  targetUrl: string,
  init: RequestInit,
  timeoutMs: number
): Promise<SafeApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const externalSignal = init.signal;
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    const res = await fetch(targetUrl, {
      ...init,
      signal: controller.signal
    });

    const rawText = await res.text();
    const trimmed = rawText.trim();

    if (trimmed.startsWith('<') || trimmed.toLowerCase().startsWith('<!doctype')) {
      const isProxyBusy = res.status === 502 || res.status === 503 || res.status === 504;
      return {
        ok: false,
        status: res.status || 404,
        data: null,
        isStaticFallback: !isProxyBusy,
        error: isProxyBusy
          ? 'Máy chủ AI đang xử lý chậm hoặc tạm quá tải, vui lòng bấm gửi lại sau vài giây.'
          : 'Origin hiện tại không có máy chủ API Node.'
      };
    }

    if (res.status === 404 || res.status === 405 || res.status === 501) {
      return {
        ok: false,
        status: res.status,
        data: null,
        isStaticFallback: true,
        error: 'Endpoint backend không khả dụng trên origin hiện tại.'
      };
    }

    let parsed: any = null;
    if (trimmed.length > 0) {
      parsed = extractBalancedJson(trimmed);
      if (parsed === null) {
        return {
          ok: false,
          status: res.status || 500,
          data: null,
          isStaticFallback: res.status >= 500,
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
      isStaticFallback: true,
      error: err?.message || 'Không thể kết nối tới máy chủ AI. Vui lòng kiểm tra mạng và thử lại.'
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function safeFetchJson<T = any>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 28000
): Promise<SafeApiResponse<T>> {
  const primaryUrl = resolveApiUrl(url);
  const firstRes = await fetchJsonOnce<T>(primaryUrl, init, timeoutMs);

  // If packaged APK/EXE/static host served HTML or 404 on relative /api/*, auto-route to remote AI backend
  if (!firstRes.ok && firstRes.isStaticFallback && !/^https?:\/\//i.test(primaryUrl)) {
    const remoteUrl = resolveApiUrl(url, true);
    if (remoteUrl !== primaryUrl) {
      const remoteRes = await fetchJsonOnce<T>(remoteUrl, init, timeoutMs);
      if (remoteRes.ok || !remoteRes.isStaticFallback) {
        sessionForceRemote = true;
      }
      return remoteRes;
    }
  }

  return firstRes;
}

export async function streamTutorChat(
  payload: {
    messages: { role: string; text: string; imageBase64?: string; mimeType?: string }[];
    context: Record<string, any>;
    language?: string;
  },
  onDelta: (accumulatedText: string) => void,
  timeoutMs = 42000
): Promise<{ ok: boolean; reply?: string; error?: string; isStaticFallback?: boolean }> {
  const attemptStream = async (forceRemote: boolean) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const streamUrl = resolveApiUrl('/api/gemini/tutor/stream', forceRemote);
      const res = await fetch(streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const contentType = (res.headers.get('content-type') || '').toLowerCase();

      if (!res.ok || !res.body || !contentType.includes('text/event-stream')) {
        const txt = await res.text().catch(() => '');
        const trimmed = txt.trim();
        if (
          trimmed.startsWith('<') ||
          trimmed.toLowerCase().startsWith('<!doctype') ||
          res.status === 404 ||
          res.status === 405
        ) {
          return {
            ok: false,
            isStaticFallback: true,
            error: 'Origin hiện tại không có máy chủ API Node.'
          };
        }

        const jsonFallback = await safeFetchJson<{ success?: boolean; reply?: string; error?: string }>(
          '/api/gemini/tutor',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          },
          timeoutMs
        );
        if (jsonFallback.ok && jsonFallback.data?.reply) {
          onDelta(jsonFallback.data.reply);
          return { ok: true, reply: jsonFallback.data.reply };
        }
        return {
          ok: false,
          isStaticFallback: jsonFallback.isStaticFallback,
          error: jsonFallback.error || `Không nhận được phản hồi từ Gemini (HTTP ${res.status}).`
        };
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulated = '';
      let streamError: string | undefined;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const evt of events) {
          const lines = evt.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const rawJson = line.slice(5).trim();
            if (!rawJson) continue;
            try {
              const parsed = JSON.parse(rawJson);
              if (parsed.error) {
                streamError = normalizeErrorPayload(parsed.error);
              } else if (typeof parsed.delta === 'string') {
                accumulated += parsed.delta;
                onDelta(accumulated);
              } else if (parsed.done && typeof parsed.reply === 'string' && !accumulated) {
                accumulated = parsed.reply;
                onDelta(accumulated);
              }
            } catch {
              // ignore partial SSE JSON frames
            }
          }
        }
      }

      if (streamError && !accumulated) {
        return { ok: false, error: streamError };
      }
      if (!accumulated.trim()) {
        return {
          ok: false,
          error: streamError || 'Gemini chưa trả về nội dung phản hồi. Vui lòng thử lại.'
        };
      }
      return { ok: true, reply: accumulated.trim() };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { ok: false, error: 'Kết nối AI bị quá thời gian (timeout). Vui lòng thử lại.' };
      }
      return {
        ok: false,
        isStaticFallback: !forceRemote,
        error: normalizeErrorPayload(err?.message) || 'Lỗi kết nối tới máy chủ Gemini AI.'
      };
    } finally {
      clearTimeout(timer);
    }
  };

  const firstAttempt = await attemptStream(false);
  if (!firstAttempt.ok && firstAttempt.isStaticFallback && !sessionForceRemote) {
    const remoteAttempt = await attemptStream(true);
    if (remoteAttempt.ok || !remoteAttempt.isStaticFallback) {
      sessionForceRemote = true;
    }
    return remoteAttempt;
  }
  return firstAttempt;
}
