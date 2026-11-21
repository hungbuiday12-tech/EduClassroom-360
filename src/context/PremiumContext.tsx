import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCircle2, ShieldAlert, Sparkles, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { resolveApiUrl, resolveWsUrl } from '../lib/apiClient';

export interface PremiumRequest {
  email: string;
  displayName: string;
  uid: string;
  plan: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  isRenewal?: boolean;
}

export interface PremiumSubscriptionInfo {
  activatedAt: string;
  expiresAt: string;
  plan: string;
}

interface PremiumStorageState {
  approvedEmails: string[];
  requests: PremiumRequest[];
  subscriptions: Record<string, PremiumSubscriptionInfo>;
}

interface DailyQuotaState {
  dateKey: string;
  used: number;
}

interface PremiumRealtimeToast {
  id: string;
  tone: 'request' | 'approved' | 'revoked';
  title: string;
  message: string;
  showAdminAction?: boolean;
}

interface PremiumRealtimePayload {
  type?: 'premium:state' | 'premium:request' | 'premium:approved' | 'premium:revoked';
  state?: Partial<PremiumStorageState>;
  meta?: {
    targetEmail?: string;
    displayName?: string;
    isRenewal?: boolean;
  };
  timestamp?: number;
}

interface PremiumContextType {
  hasPremiumAccess: boolean;
  isAdmin: boolean;
  approvedEmails: string[];
  requests: PremiumRequest[];
  subscriptions: Record<string, PremiumSubscriptionInfo>;
  mySubscription: PremiumSubscriptionInfo | null;
  pendingRequestsCount: number;
  myRequest: PremiumRequest | null;
  submitPremiumRequest: () => { ok: boolean; message: string };
  renewPremiumPlan: () => { ok: boolean; message: string };
  approveUserPremium: (email: string, isRenewal?: boolean) => void;
  revokeUserPremium: (email: string) => void;
  dailyQuotaLimit: number;
  dailyQuotaUsed: number;
  dailyQuotaRemaining: number;
  consumeDailyQuota: (amount?: number) => boolean;
}

const STORAGE_KEY = 'educlassroom360_synapse_premium_v1';
const BROADCAST_CHANNEL_NAME = 'educlassroom_premium_realtime_v1';
const QUOTA_KEY_PREFIX = 'educlassroom360_astra_quota_';
const FALLBACK_START_PREFIX = 'educlassroom360_pre_activated_';
const DAILY_QUOTA_LIMIT = 15;

const PremiumContext = createContext<PremiumContextType | null>(null);

function addMonthsIso(baseIso: string, months = 3): string {
  const base = new Date(baseIso);
  const valid = Number.isNaN(base.getTime()) ? new Date() : base;
  const next = new Date(valid.getTime());
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function normalizeServerState(data: Partial<PremiumStorageState> | null | undefined): PremiumStorageState | null {
  if (!data || !Array.isArray(data.approvedEmails) || !Array.isArray(data.requests)) {
    return null;
  }
  return {
    approvedEmails: data.approvedEmails,
    requests: data.requests,
    subscriptions:
      data.subscriptions && typeof data.subscriptions === 'object' ? data.subscriptions : {},
  };
}

function loadPremiumState(): PremiumStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { approvedEmails: [], requests: [], subscriptions: {} };
    const parsed = JSON.parse(raw) as Partial<PremiumStorageState>;
    return {
      approvedEmails: Array.isArray(parsed.approvedEmails) ? parsed.approvedEmails : [],
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      subscriptions:
        parsed.subscriptions && typeof parsed.subscriptions === 'object' ? parsed.subscriptions : {},
    };
  } catch {
    return { approvedEmails: [], requests: [], subscriptions: {} };
  }
}

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<PremiumStorageState>(loadPremiumState);
  const [dailyQuotaUsed, setDailyQuotaUsed] = useState<number>(0);
  const [realtimeToast, setRealtimeToast] = useState<PremiumRealtimeToast | null>(null);

  const isAdmin = user?.role === 'admin';
  const normalizedEmail = (user?.email || '').trim().toLowerCase();
  const normalizedName = (user?.displayName || '').trim().toLowerCase();

  const authRef = useRef({
    isAdmin,
    normalizedEmail,
    normalizedName,
    loggedIn: Boolean(user),
  });
  authRef.current = {
    isAdmin,
    normalizedEmail,
    normalizedName,
    loggedIn: Boolean(user),
  };

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const lastStateJsonRef = useRef<string>(JSON.stringify(state));
  const lastEventSigRef = useRef<string>('');
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((toast: Omit<PremiumRealtimeToast, 'id'>) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setRealtimeToast({ ...toast, id });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setRealtimeToast((prev) => (prev?.id === id ? null : prev));
    }, 9000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const nextJson = JSON.stringify(state);
    lastStateJsonRef.current = nextJson;
    try {
      localStorage.setItem(STORAGE_KEY, nextJson);
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  const handleIncomingPayload = useCallback(
    (payload: PremiumRealtimePayload) => {
      const normalized = normalizeServerState(payload.state);
      if (normalized) {
        const nextJson = JSON.stringify(normalized);
        if (lastStateJsonRef.current !== nextJson) {
          lastStateJsonRef.current = nextJson;
          setState(normalized);
        }
      }

      const eventType = payload.type;
      if (!eventType || eventType === 'premium:state') return;

      const targetEmail = String(payload.meta?.targetEmail || '').trim().toLowerCase();
      const displayName = String(payload.meta?.displayName || targetEmail || 'Học viên').trim();
      const isRenewal = Boolean(payload.meta?.isRenewal);
      const sig = `${eventType}:${targetEmail}:${isRenewal ? '1' : '0'}:${Math.floor(
        (payload.timestamp || Date.now()) / 800
      )}`;
      if (lastEventSigRef.current === sig) return;
      lastEventSigRef.current = sig;

      const currentAuth = authRef.current;

      if (eventType === 'premium:request' && currentAuth.isAdmin) {
        showToast({
          tone: 'request',
          title: isRenewal
            ? 'Yêu cầu gia hạn Synapse Pre mới'
            : 'Yêu cầu cấp quyền Synapse Pre mới',
          message: `${displayName}${targetEmail && displayName !== targetEmail ? ` (${targetEmail})` : ''} vừa gửi yêu cầu.`,
          showAdminAction: true,
        });
      } else if (
        eventType === 'premium:approved' &&
        currentAuth.loggedIn &&
        !currentAuth.isAdmin &&
        targetEmail &&
        (targetEmail === currentAuth.normalizedEmail ||
          (currentAuth.normalizedName.length > 0 && targetEmail === currentAuth.normalizedName))
      ) {
        showToast({
          tone: 'approved',
          title: isRenewal ? 'Đã gia hạn Synapse Pre (+3 tháng)!' : 'Đã mở khóa Synapse Pre!',
          message: `Admin vừa cấp quyền Synapse Pre cho ${currentAuth.normalizedEmail}. Hiệu lực ngay lập tức!`,
        });
      } else if (
        eventType === 'premium:revoked' &&
        currentAuth.loggedIn &&
        !currentAuth.isAdmin &&
        targetEmail &&
        (targetEmail === currentAuth.normalizedEmail ||
          (currentAuth.normalizedName.length > 0 && targetEmail === currentAuth.normalizedName))
      ) {
        showToast({
          tone: 'revoked',
          title: 'Quyền Synapse Pre đã được thu hồi',
          message: `Admin vừa cập nhật lại quyền truy cập cho ${currentAuth.normalizedEmail}.`,
        });
      }
    },
    [showToast]
  );

  // Instant Real-Time Sync: WebSocket + SSE + BroadcastChannel + focus/visibility fallback
  useEffect(() => {
    let active = true;
    let ws: WebSocket | null = null;
    let es: EventSource | null = null;
    let wsReconnectTimer: number | null = null;
    let wsOpen = false;
    let sseOpen = false;

    const fetchServerState = async () => {
      try {
        const res = await fetch(resolveApiUrl('/api/premium/state'), { cache: 'no-store' });
        if (!res.ok || !active) return;
        const data = (await res.json()) as Partial<PremiumStorageState>;
        if (!active) return;
        const nextState = normalizeServerState(data);
        if (nextState) {
          const nextJson = JSON.stringify(nextState);
          if (lastStateJsonRef.current !== nextJson) {
            lastStateJsonRef.current = nextJson;
            setState(nextState);
          }
        }
      } catch {
        // fallback to localStorage silently
      }
    };

    const connectWebSocket = () => {
      if (!active || typeof WebSocket === 'undefined') return;
      try {
        ws = new WebSocket(resolveWsUrl('/ws/premium'));
        ws.onopen = () => {
          wsOpen = true;
        };
        ws.onmessage = (evt) => {
          if (!active) return;
          try {
            const payload = JSON.parse(String(evt.data)) as PremiumRealtimePayload;
            handleIncomingPayload(payload);
          } catch {
            // ignore malformed frame
          }
        };
        ws.onclose = () => {
          wsOpen = false;
          if (!active) return;
          wsReconnectTimer = window.setTimeout(connectWebSocket, 1200);
        };
        ws.onerror = () => {
          wsOpen = false;
        };
      } catch {
        wsOpen = false;
      }
    };

    const connectSse = () => {
      if (!active || typeof EventSource === 'undefined') return;
      try {
        es = new EventSource(resolveApiUrl('/api/premium/stream'));
        es.onopen = () => {
          sseOpen = true;
        };
        es.onmessage = (evt) => {
          if (!active) return;
          try {
            const payload = JSON.parse(evt.data) as PremiumRealtimePayload;
            handleIncomingPayload(payload);
          } catch {
            // ignore keepalive
          }
        };
        es.onerror = () => {
          sseOpen = false;
        };
      } catch {
        sseOpen = false;
      }
    };

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastChannelRef.current = bc;
        bc.onmessage = (evt) => {
          if (!active || !evt.data) return;
          handleIncomingPayload(evt.data as PremiumRealtimePayload);
        };
      } catch {
        bc = null;
      }
    }

    void fetchServerState();
    connectWebSocket();
    connectSse();

    // Backup light poll only if both realtime streams are temporarily offline
    const backupInterval = window.setInterval(() => {
      if (!wsOpen && !sseOpen) {
        void fetchServerState();
      }
    }, 3000);

    const onFocus = () => void fetchServerState();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void fetchServerState();
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = loadPremiumState();
        lastStateJsonRef.current = JSON.stringify(next);
        setState(next);
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);

    return () => {
      active = false;
      if (wsReconnectTimer) window.clearTimeout(wsReconnectTimer);
      if (ws) {
        try {
          ws.close();
        } catch {}
      }
      if (es) {
        try {
          es.close();
        } catch {}
      }
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
      broadcastChannelRef.current = null;
      window.clearInterval(backupInterval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }, [handleIncomingPayload]);

  // Load daily quota for current user
  useEffect(() => {
    const key = `${QUOTA_KEY_PREFIX}${normalizedEmail || 'guest'}`;
    const today = getTodayKey();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as DailyQuotaState;
        if (parsed.dateKey === today) {
          setDailyQuotaUsed(parsed.used);
          return;
        }
      }
    } catch {
      // ignore
    }
    setDailyQuotaUsed(0);
  }, [normalizedEmail]);

  const hasPremiumAccess = useMemo(() => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return (
      state.approvedEmails.includes(normalizedEmail) ||
      (normalizedName.length > 0 && state.approvedEmails.includes(normalizedName))
    );
  }, [user, state.approvedEmails, normalizedEmail, normalizedName]);

  // Mark document for Synapse Premium styling without desyncing App's Light/Dark state
  useEffect(() => {
    const root = document.documentElement;
    if (hasPremiumAccess) {
      root.dataset.synapsePremium = 'true';
    } else {
      delete root.dataset.synapsePremium;
    }
    return () => {
      delete root.dataset.synapsePremium;
    };
  }, [hasPremiumAccess]);

  const pendingRequestsCount = useMemo(
    () => state.requests.filter((r) => r.status === 'pending').length,
    [state.requests]
  );

  const myRequest = useMemo(() => {
    if (!normalizedEmail) return null;
    return state.requests.find((r) => r.email.toLowerCase() === normalizedEmail) || null;
  }, [state.requests, normalizedEmail]);

  const mySubscription = useMemo<PremiumSubscriptionInfo | null>(() => {
    if (!hasPremiumAccess || !user) return null;
    const direct =
      (normalizedEmail ? state.subscriptions?.[normalizedEmail] : undefined) ??
      (normalizedName ? state.subscriptions?.[normalizedName] : undefined);
    if (direct?.activatedAt && direct?.expiresAt) {
      return direct;
    }
    // Deterministic fallback for Admin or legacy approved accounts without a stored server record yet
    const storageFallbackKey = `${FALLBACK_START_PREFIX}${normalizedEmail || user.uid || 'admin'}`;
    let baseIso = myRequest?.requestedAt || '';
    if (!baseIso) {
      try {
        const cached = localStorage.getItem(storageFallbackKey);
        if (cached) {
          baseIso = cached;
        } else {
          baseIso = new Date().toISOString();
          localStorage.setItem(storageFallbackKey, baseIso);
        }
      } catch {
        baseIso = new Date().toISOString();
      }
    }
    return {
      activatedAt: baseIso,
      expiresAt: addMonthsIso(baseIso, 3),
      plan: myRequest?.plan || '120.000đ / 3 tháng',
    };
  }, [hasPremiumAccess, user, normalizedEmail, normalizedName, state.subscriptions, myRequest]);

  const emitLocalBroadcast = (payload: PremiumRealtimePayload) => {
    try {
      broadcastChannelRef.current?.postMessage(payload);
    } catch {
      // ignore broadcast errors
    }
  };

  const submitPremiumRequest = (): { ok: boolean; message: string } => {
    if (!user || !normalizedEmail) {
      return {
        ok: false,
        message: 'Vui lòng đăng nhập tài khoản trước khi đăng ký Synapse Pre (120.000đ / 3 tháng).',
      };
    }
    if (hasPremiumAccess) {
      return renewPremiumPlan();
    }
    const nextReq: PremiumRequest = {
      email: normalizedEmail,
      displayName: user.displayName || user.email,
      uid: user.uid,
      plan: '120.000đ / 3 tháng',
      requestedAt: new Date().toISOString(),
      status: 'pending',
      isRenewal: false,
    };
    setState((prev) => {
      const exists = prev.requests.some((r) => r.email.toLowerCase() === normalizedEmail);
      const nextState: PremiumStorageState = {
        ...prev,
        requests: exists
          ? prev.requests.map((r) => (r.email.toLowerCase() === normalizedEmail ? nextReq : r))
          : [nextReq, ...prev.requests],
      };
      emitLocalBroadcast({
        type: 'premium:request',
        state: nextState,
        meta: { targetEmail: normalizedEmail, displayName: nextReq.displayName, isRenewal: false },
        timestamp: Date.now(),
      });
      return nextState;
    });
    void fetch(resolveApiUrl('/api/premium/request'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        displayName: user.displayName || user.email,
        uid: user.uid,
        plan: '120.000đ / 3 tháng',
        isRenewal: false,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const nextState = normalizeServerState(data?.state);
        if (nextState) setState(nextState);
      })
      .catch(() => {});
    return {
      ok: true,
      message: 'Đã gửi yêu cầu đăng ký gói 120.000đ / 3 tháng! Thông báo đã được đẩy tới Admin ngay lập tức.',
    };
  };

  const renewPremiumPlan = (): { ok: boolean; message: string } => {
    if (!user || !normalizedEmail) {
      return {
        ok: false,
        message: 'Vui lòng đăng nhập tài khoản để gia hạn gói Synapse Pre.',
      };
    }

    // Admin renewing their own account applies immediately (+3 months)
    if (isAdmin) {
      approveUserPremium(normalizedEmail, true);
      return {
        ok: true,
        message: 'Đã gia hạn gói Synapse Premium thêm +3 tháng thành công!',
      };
    }

    const nextReq: PremiumRequest = {
      email: normalizedEmail,
      displayName: user.displayName || user.email,
      uid: user.uid,
      plan: 'Gia hạn +3 tháng (120.000đ)',
      requestedAt: new Date().toISOString(),
      status: 'pending',
      isRenewal: true,
    };

    setState((prev) => {
      const exists = prev.requests.some((r) => r.email.toLowerCase() === normalizedEmail);
      const nextState: PremiumStorageState = {
        ...prev,
        requests: exists
          ? prev.requests.map((r) => (r.email.toLowerCase() === normalizedEmail ? nextReq : r))
          : [nextReq, ...prev.requests],
      };
      emitLocalBroadcast({
        type: 'premium:request',
        state: nextState,
        meta: { targetEmail: normalizedEmail, displayName: nextReq.displayName, isRenewal: true },
        timestamp: Date.now(),
      });
      return nextState;
    });

    void fetch(resolveApiUrl('/api/premium/request'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        displayName: user.displayName || user.email,
        uid: user.uid,
        plan: 'Gia hạn +3 tháng (120.000đ)',
        isRenewal: true,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const nextState = normalizeServerState(data?.state);
        if (nextState) setState(nextState);
      })
      .catch(() => {});

    return {
      ok: true,
      message: 'Đã gửi yêu cầu gia hạn +3 tháng (120.000đ)! Thông báo đã chuyển tới Admin ngay lập tức.',
    };
  };

  const approveUserPremium = (email: string, isRenewal = false) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    const nowIso = new Date().toISOString();

    setState((prev) => {
      const already = prev.approvedEmails.includes(clean);
      const existingSub = prev.subscriptions?.[clean];
      const matchReq = prev.requests.find(
        (r) => r.email.toLowerCase() === clean || r.displayName.toLowerCase() === clean
      );
      const extending = Boolean(existingSub && (isRenewal || matchReq?.isRenewal || already));
      const nextActivatedAt = existingSub?.activatedAt || nowIso;
      const baseExpiry =
        extending && existingSub && new Date(existingSub.expiresAt).getTime() > Date.now()
          ? existingSub.expiresAt
          : extending
          ? nowIso
          : nextActivatedAt;

      const nextState: PremiumStorageState = {
        approvedEmails: already ? prev.approvedEmails : [...prev.approvedEmails, clean],
        requests: prev.requests.map((r) =>
          r.email.toLowerCase() === clean || r.displayName.toLowerCase() === clean
            ? { ...r, status: 'approved', isRenewal: false }
            : r
        ),
        subscriptions: {
          ...(prev.subscriptions || {}),
          [clean]: {
            activatedAt: nextActivatedAt,
            expiresAt: addMonthsIso(baseExpiry, 3),
            plan: '120.000đ / 3 tháng',
          },
        },
      };
      emitLocalBroadcast({
        type: 'premium:approved',
        state: nextState,
        meta: { targetEmail: clean, displayName: matchReq?.displayName || clean, isRenewal: extending },
        timestamp: Date.now(),
      });
      return nextState;
    });

    void fetch(resolveApiUrl('/api/premium/approve'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean, isRenewal }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const nextState = normalizeServerState(data?.state);
        if (nextState) setState(nextState);
      })
      .catch(() => {});
  };

  const revokeUserPremium = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setState((prev) => {
      const nextSubs = { ...(prev.subscriptions || {}) };
      delete nextSubs[clean];
      const nextState: PremiumStorageState = {
        approvedEmails: prev.approvedEmails.filter((e) => e !== clean),
        requests: prev.requests.map((r) =>
          r.email.toLowerCase() === clean || r.displayName.toLowerCase() === clean
            ? { ...r, status: 'rejected' }
            : r
        ),
        subscriptions: nextSubs,
      };
      emitLocalBroadcast({
        type: 'premium:revoked',
        state: nextState,
        meta: { targetEmail: clean },
        timestamp: Date.now(),
      });
      return nextState;
    });
    void fetch(resolveApiUrl('/api/premium/revoke'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const nextState = normalizeServerState(data?.state);
        if (nextState) setState(nextState);
      })
      .catch(() => {});
  };

  const consumeDailyQuota = (amount = 1): boolean => {
    if (dailyQuotaUsed + amount > DAILY_QUOTA_LIMIT) {
      return false;
    }
    const nextUsed = dailyQuotaUsed + amount;
    setDailyQuotaUsed(nextUsed);
    const key = `${QUOTA_KEY_PREFIX}${normalizedEmail || 'guest'}`;
    try {
      localStorage.setItem(key, JSON.stringify({ dateKey: getTodayKey(), used: nextUsed }));
    } catch {
      // ignore
    }
    return true;
  };

  return (
    <PremiumContext.Provider
      value={{
        hasPremiumAccess,
        isAdmin,
        approvedEmails: state.approvedEmails,
        requests: state.requests,
        subscriptions: state.subscriptions || {},
        mySubscription,
        pendingRequestsCount,
        myRequest,
        submitPremiumRequest,
        renewPremiumPlan,
        approveUserPremium,
        revokeUserPremium,
        dailyQuotaLimit: DAILY_QUOTA_LIMIT,
        dailyQuotaUsed,
        dailyQuotaRemaining: Math.max(0, DAILY_QUOTA_LIMIT - dailyQuotaUsed),
        consumeDailyQuota,
      }}
    >
      {children}

      {realtimeToast && (
        <div
          role="status"
          aria-live="assertive"
          className={`fixed top-16 right-3 sm:right-5 z-[180] w-[calc(100vw-24px)] max-w-sm rounded-xl border px-4 py-3 shadow-2xl bg-slate-950/96 text-slate-100 ${
            realtimeToast.tone === 'request'
              ? 'border-amber-400/80'
              : realtimeToast.tone === 'approved'
              ? 'border-emerald-400/80'
              : 'border-rose-400/80'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                realtimeToast.tone === 'request'
                  ? 'border-amber-400/50 bg-amber-500/20 text-amber-300'
                  : realtimeToast.tone === 'approved'
                  ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                  : 'border-rose-400/50 bg-rose-500/20 text-rose-300'
              }`}
            >
              {realtimeToast.tone === 'request' ? (
                <Bell className="h-4 w-4 animate-bounce" />
              ) : realtimeToast.tone === 'approved' ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-extrabold text-white truncate">{realtimeToast.title}</p>
                <button
                  type="button"
                  onClick={() => setRealtimeToast(null)}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                  aria-label="Đóng thông báo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">{realtimeToast.message}</p>
              {realtimeToast.showAdminAction && isAdmin && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRealtimeToast(null);
                      window.dispatchEvent(new CustomEvent('synapse:open-admin-pre-modal'));
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-extrabold text-slate-950 hover:bg-emerald-400 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mở duyệt ngay</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const ctx = useContext(PremiumContext);
  if (!ctx) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return ctx;
};
