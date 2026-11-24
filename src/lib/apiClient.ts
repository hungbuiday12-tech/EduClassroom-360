export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  isStaticFallback?: boolean;
}

const BUILTIN_CLOUD_API_BASE =
  'https://ais-pre-5ofg64mouj443f725obvwb-999937700297.asia-east1.run.app';
const DEV_CLOUD_API_BASE =
  'https://ais-dev-5ofg64mouj443f725obvwb-999937700297.asia-east1.run.app';
const RETIRED_CLOUD_BASES = new Set([
  'https://ais-pre-qrbmu7cs5wp47n6nlbl4ci-223538708453.asia-east1.run.app',
  'https://ais-pre-zoetjpf6ywpdfftq66dzuz-183305151918.asia-southeast1.run.app',
  'https://ais-pre-2cajz7v7fqng2hy3peejkj-489067186717.asia-southeast1.run.app'
]);

const DEFAULT_REMOTE_API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') ||
  BUILTIN_CLOUD_API_BASE;

const STORAGE_KEY = 'educlassroom_api_base_url';
let sessionRemoteBase: string | null = null;
let warmUpStarted = false;

export function getDefaultRemoteApiBase(): string {
  return DEFAULT_REMOTE_API_BASE;
}

export function getCustomApiBase(): string {
  try {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(STORAGE_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

export function setCustomApiBase(url: string | null): void {
  sessionRemoteBase = null;
  try {
    if (typeof window === 'undefined') return;
    const clean = url?.trim().replace(/\/+$/, '') || '';
    if (clean && /^https?:\/\//i.test(clean)) {
      window.localStorage.setItem(STORAGE_KEY, clean);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export async function testApiBackendConnection(
  customBase?: string
): Promise<{ ok: boolean; url: string; latencyMs: number; aiConfigured?: boolean; error?: string }> {
  const base =
    customBase?.trim().replace(/\/+$/, '') ||
    (isPackagedOrStaticOrigin() || getCustomApiBase() || sessionRemoteBase
      ? getRemoteApiBase()
      : typeof window !== 'undefined'
      ? window.location.origin
      : DEFAULT_REMOTE_API_BASE);

  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${base}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    const latencyMs = Date.now() - startedAt;
    if (!res.ok) {
      return {
        ok: false,
        url: base,
        latencyMs,
        error: `HTTP ${res.status}`
      };
    }
    const json = await res.json().catch(() => null);
    if (!json?.ok) {
      return {
        ok: false,
        url: base,
        latencyMs,
        error: 'Phản hồi /api/health không hợp lệ.'
      };
    }
    return {
      ok: true,
      url: base,
      latencyMs,
      aiConfigured: Boolean(json.aiConfigured)
    };
  } catch (err: any) {
    return {
      ok: false,
      url: base,
      latencyMs: Date.now() - startedAt,
      error: err?.name === 'AbortError' ? 'Timeout (5s)' : normalizeErrorPayload(err?.message)
    };
  } finally {
    clearTimeout(timer);
  }
}

export function warmUpBackend(): void {
  if (warmUpStarted || typeof window === 'undefined') return;
  warmUpStarted = true;
  try {
    void fetch(resolveApiUrl('/api/health'), { method: 'GET' }).catch(() => {});
  } catch {}
}

if (typeof window !== 'undefined') {
  warmUpBackend();
}

function getStoredApiBase(): string | null {
  try {
    if (typeof window === 'undefined') return null;

    // Allow passing ?apiBase=https://... in APK/EXE/WebView URLs and persist it
    const params = new URLSearchParams(window.location.search);
    const paramVal = params.get('apiBase')?.trim();
    if (paramVal && /^https?:\/\//i.test(paramVal)) {
      const clean = paramVal.replace(/\/+$/, '');
      window.localStorage.setItem(STORAGE_KEY, clean);
      return clean;
    }

    const globalVal = (window as any).__EDUCLASSROOM_API_BASE__;
    if (typeof globalVal === 'string' && /^https?:\/\//i.test(globalVal.trim())) {
      return globalVal.trim().replace(/\/+$/, '');
    }

    const val = window.localStorage.getItem(STORAGE_KEY)?.trim();
    if (val && /^https?:\/\//i.test(val)) {
      const clean = val.replace(/\/+$/, '');
      if (RETIRED_CLOUD_BASES.has(clean)) {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return clean;
    }
  } catch {}
  return null;
}

function isNonHttpPackagedProtocol(): boolean {
  if (typeof window === 'undefined') return false;
  const { protocol } = window.location;
  return (
    protocol === 'file:' ||
    protocol === 'capacitor:' ||
    protocol === 'ionic:' ||
    protocol === 'tauri:' ||
    protocol === 'app:' ||
    protocol === 'chrome-extension:' ||
    protocol === 'ms-appx:'
  );
}

export function isPackagedOrStaticOrigin(): boolean {
  if (typeof window === 'undefined') return false;
  if (import.meta.env.VITE_STATIC_HOST === 'true') return true;
  if (isNonHttpPackagedProtocol()) return true;
  const { hostname } = window.location;
  if (
    hostname === 'synapse-stem.is-a.dev' ||
    hostname.endsWith('.is-a.dev') ||
    hostname.endsWith('.github.io') ||
    hostname.endsWith('.pages.dev') ||
    hostname.endsWith('.netlify.app')
  ) {
    return true;
  }
  if (hostname === 'tauri.localhost') return true;
  return false;
}

export function getRemoteApiBase(): string {
  return sessionRemoteBase || getStoredApiBase() || DEFAULT_REMOTE_API_BASE;
}

export function resolveApiUrl(path: string, forceRemote = false): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const envConfigured = Boolean((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim());
  const storedBase = getStoredApiBase();

  // Bypass same-origin when explicitly configured, switched to a verified remote base,
  // or running inside a packaged APK/EXE container or static site (GitHub Pages)
  if (
    forceRemote ||
    sessionRemoteBase ||
    envConfigured ||
    storedBase ||
    isPackagedOrStaticOrigin()
  ) {
    return `${getRemoteApiBase()}${normalizedPath}`;
  }

  // On standard http:// and https:// web origins with backend, try same-origin /api/* first
  return normalizedPath;
}

export function resolveWsUrl(path: string, forceRemote = false): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const envConfigured = Boolean((import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim());
  const storedBase = getStoredApiBase();

  if (
    forceRemote ||
    sessionRemoteBase ||
    envConfigured ||
    storedBase ||
    isPackagedOrStaticOrigin()
  ) {
    const httpBase = getRemoteApiBase().replace(/\/+$/, '');
    const wsBase = httpBase.replace(/^https:/i, 'wss:').replace(/^http:/i, 'ws:');
    return `${wsBase}${normalizedPath}`;
  }

  if (typeof window !== 'undefined' && window.location?.host) {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}${normalizedPath}`;
  }
  return `ws://127.0.0.1:3000${normalizedPath}`;
}

async function probeHealthyBackendBase(): Promise<string | null> {
  const candidates: string[] = [];
  if (
    typeof window !== 'undefined' &&
    !isPackagedOrStaticOrigin() &&
    window.location?.origin?.startsWith('http')
  ) {
    candidates.push(window.location.origin);
  }
  const stored = getStoredApiBase();
  if (stored) candidates.push(stored);
  candidates.push(DEFAULT_REMOTE_API_BASE);
  candidates.push(BUILTIN_CLOUD_API_BASE);
  candidates.push(DEV_CLOUD_API_BASE);
  candidates.push('http://127.0.0.1:3000');
  candidates.push('http://localhost:3000');
  if (typeof window !== 'undefined' && (window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:' || /android/i.test(navigator.userAgent || ''))) {
    candidates.push('http://10.0.2.2:3000');
  }

  const seen = new Set<string>();
  for (const base of candidates) {
    const cleanBase = base.replace(/\/+$/, '');
    if (!cleanBase || seen.has(cleanBase) || RETIRED_CLOUD_BASES.has(cleanBase)) continue;
    seen.add(cleanBase);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(`${cleanBase}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json?.ok) {
          sessionRemoteBase = cleanBase;
          return cleanBase;
        }
      }
    } catch {
      // candidate unreachable
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

function buildNetworkErrorMessage(raw: string): string {
  if (isPackagedOrStaticOrigin()) {
    return 'Không kết nối được tới máy chủ AI backend. Nếu bạn đang chạy bản Web tĩnh (GitHub Pages), file APK hoặc EXE, hãy đảm bảo máy chủ Node (server.ts) đã được Publish/deploy và cấu hình đúng URL backend (VITE_API_BASE_URL).';
  }
  if (/http2|protocol/i.test(raw)) {
    return 'Kết nối truyền dữ liệu bị gián đoạn tạm thời. Vui lòng thử gửi lại sau giây lát.';
  }
  return 'Không thể kết nối tới máy chủ AI. Vui lòng kiểm tra kết nối mạng và thử gửi lại.';
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
    if (/failed to fetch|load failed|networkerror|network request failed|err_connection|err_http2/i.test(trimmed)) {
      return buildNetworkErrorMessage(trimmed);
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
      const isProxyBusy = res.status >= 500 || res.status === 429;
      const isAuthGate =
        res.url.includes('__cookie_check') ||
        res.url.includes('accounts.google.com') ||
        /_aistudio-iframe|__cookie_check/i.test(trimmed);

      if (isAuthGate) {
        return {
          ok: false,
          status: 401,
          data: null,
          isStaticFallback: false,
          error:
            'Phiên truy cập bị chặn cookie bên thứ ba hoặc đã hết hạn. Hãy tải lại trang (F5) hoặc mở ứng dụng ở tab mới để dùng Gemini AI.'
        };
      }

      return {
        ok: false,
        status: res.status || 404,
        data: null,
        isStaticFallback: !isProxyBusy,
        error: isProxyBusy
          ? 'Máy chủ AI đang xử lý chậm hoặc tạm quá tải, vui lòng bấm gửi lại sau vài giây.'
          : 'Không tìm thấy máy chủ AI tại địa chỉ hiện tại.'
      };
    }

    if (res.status === 404 || res.status === 405 || res.status === 501) {
      return {
        ok: false,
        status: res.status,
        data: null,
        isStaticFallback: true,
        error: 'Endpoint backend không khả dụng trên địa chỉ hiện tại.'
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
          isStaticFallback: false,
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
      isStaticFallback: false,
      error: normalizeErrorPayload(err?.message) || buildNetworkErrorMessage('')
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function safeFetchJson<T = any>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 65000
): Promise<SafeApiResponse<T>> {
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  const primaryUrl = resolveApiUrl(url);
  let targetUrl = primaryUrl;
  let result = await fetchJsonOnce<T>(primaryUrl, init, timeoutMs);

  // If a custom/remote URL failed while running on a live full-stack origin, try same-origin first
  if (
    !result.ok &&
    /^https?:\/\//i.test(primaryUrl) &&
    !isPackagedOrStaticOrigin() &&
    (result.isStaticFallback || result.status === 0)
  ) {
    const sameOriginRes = await fetchJsonOnce<T>(normalizedPath, init, timeoutMs);
    if (sameOriginRes.ok || (!sameOriginRes.isStaticFallback && sameOriginRes.status !== 0)) {
      sessionRemoteBase = null;
      targetUrl = normalizedPath;
      result = sameOriginRes;
    }
  }

  // If same-origin served static HTML/404, or a static/packaged app could not reach its configured URL, probe backends
  const shouldProbeRemote =
    (!result.ok && result.isStaticFallback && !/^https?:\/\//i.test(primaryUrl)) ||
    (!result.ok && (result.status === 0 || result.isStaticFallback) && isPackagedOrStaticOrigin());

  if (shouldProbeRemote) {
    const remoteUrl = resolveApiUrl(url, true);
    if (remoteUrl !== primaryUrl) {
      const remoteRes = await fetchJsonOnce<T>(remoteUrl, init, timeoutMs);
      if (remoteRes.ok) {
        sessionRemoteBase = getRemoteApiBase();
        return remoteRes;
      }
      if (remoteRes.status !== 0 && !remoteRes.isStaticFallback) {
        targetUrl = remoteUrl;
        result = remoteRes;
      }
    }

    if (targetUrl === primaryUrl) {
      // Try discovering a healthy local/remote backend
      const discoveredBase = await probeHealthyBackendBase();
      if (discoveredBase) {
        targetUrl = `${discoveredBase}${normalizedPath}`;
        result = await fetchJsonOnce<T>(targetUrl, init, timeoutMs);
      } else if (isPackagedOrStaticOrigin()) {
        return {
          ok: false,
          status: result.status,
          data: null,
          isStaticFallback: true,
          error: `Chưa kết nối được tới máy chủ AI trực tuyến (${BUILTIN_CLOUD_API_BASE}). Nếu bạn đang chạy bản Web tĩnh (GitHub Pages), hãy nhấn Share/Publish ứng dụng trên AI Studio để kích hoạt máy chủ backend hoặc nhập URL server.ts đang chạy trong Cài đặt.`
        };
      } else {
        return {
          ...result,
          isStaticFallback: false,
          error:
            result.error && !/không tìm thấy máy chủ ai/i.test(result.error)
              ? result.error
              : 'Máy chủ AI đang khởi động lại hoặc tạm gián đoạn. Vui lòng thử lại sau vài giây.'
        };
      }
    }
  }

  return result;
}

export async function streamTutorChat(
  payload: {
    messages: { role: string; text: string; imageBase64?: string; mimeType?: string }[];
    context: Record<string, any>;
    language?: string;
  },
  onDelta: (accumulatedText: string) => void,
  timeoutMs = 70000
): Promise<{ ok: boolean; reply?: string; error?: string; isStaticFallback?: boolean }> {
  const tryNonStreamFallback = async (): Promise<{
    ok: boolean;
    reply?: string;
    error?: string;
    isStaticFallback?: boolean;
  }> => {
    const jsonFallback = await safeFetchJson<{ success?: boolean; reply?: string; error?: string }>(
      '/api/gemini/tutor',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      Math.max(45000, timeoutMs)
    );
    if (jsonFallback.ok && jsonFallback.data?.reply) {
      onDelta(jsonFallback.data.reply);
      return { ok: true, reply: jsonFallback.data.reply };
    }
    return {
      ok: false,
      isStaticFallback: jsonFallback.isStaticFallback,
      error: jsonFallback.error || 'Không nhận được phản hồi từ Gemini AI. Vui lòng thử lại.'
    };
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const runStreamAt = async (streamUrl: string) => {
    const res = await fetch(streamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const contentType = (res.headers.get('content-type') || '').toLowerCase();

    if (!res.ok || !res.body || !contentType.includes('text/event-stream')) {
      return { shouldRetryRemote: res.status === 404 || res.status === 405 || contentType.includes('text/html') };
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

    if (accumulated.trim()) {
      return { done: true as const, result: { ok: true, reply: accumulated.trim() } };
    }
    if (streamError) {
      return { done: true as const, result: { ok: false, error: streamError } };
    }
    return { shouldRetryRemote: false };
  };

  try {
    const primaryStreamUrl = resolveApiUrl('/api/gemini/tutor/stream');
    const firstAttempt = await runStreamAt(primaryStreamUrl);
    if ('done' in firstAttempt && firstAttempt.done) {
      return firstAttempt.result;
    }

    if (firstAttempt.shouldRetryRemote || isPackagedOrStaticOrigin()) {
      const discovered = await probeHealthyBackendBase();
      if (discovered) {
        const remoteAttempt = await runStreamAt(`${discovered}/api/gemini/tutor/stream`);
        if ('done' in remoteAttempt && remoteAttempt.done) {
          return remoteAttempt.result;
        }
      }
    }

    clearTimeout(timer);
    return await tryNonStreamFallback();
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { ok: false, error: 'Kết nối AI bị quá thời gian (timeout). Vui lòng thử lại.' };
    }
    try {
      const discovered = await probeHealthyBackendBase();
      if (discovered) {
        const remoteAttempt = await runStreamAt(`${discovered}/api/gemini/tutor/stream`);
        if ('done' in remoteAttempt && remoteAttempt.done) {
          return remoteAttempt.result;
        }
      }
    } catch {
      // fall through to non-stream fallback
    }
    clearTimeout(timer);
    return await tryNonStreamFallback();
  } finally {
    clearTimeout(timer);
  }
}
