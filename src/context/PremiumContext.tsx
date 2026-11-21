import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

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

  const isAdmin = user?.role === 'admin';
  const normalizedEmail = (user?.email || '').trim().toLowerCase();
  const normalizedName = (user?.displayName || '').trim().toLowerCase();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  // Sync requests & approvals across browser tabs AND across devices via server API
  useEffect(() => {
    let active = true;
    const fetchServerState = async () => {
      try {
        const res = await fetch('/api/premium/state');
        if (!res.ok) return;
        const data = (await res.json()) as Partial<PremiumStorageState>;
        if (!active) return;
        if (Array.isArray(data.approvedEmails) && Array.isArray(data.requests)) {
          const nextState: PremiumStorageState = {
            approvedEmails: data.approvedEmails,
            requests: data.requests,
            subscriptions:
              data.subscriptions && typeof data.subscriptions === 'object'
                ? data.subscriptions
                : {},
          };
          const nextJson = JSON.stringify(nextState);
          setState((prev) => (JSON.stringify(prev) === nextJson ? prev : nextState));
        }
      } catch {
        // fallback to localStorage silently
      }
    };

    void fetchServerState();
    const interval = window.setInterval(fetchServerState, 4000);
    const onFocus = () => void fetchServerState();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setState(loadPremiumState());
      }
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

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
    setState((prev) => {
      const exists = prev.requests.some((r) => r.email.toLowerCase() === normalizedEmail);
      const nextReq: PremiumRequest = {
        email: normalizedEmail,
        displayName: user.displayName || user.email,
        uid: user.uid,
        plan: '120.000đ / 3 tháng',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        isRenewal: false,
      };
      return {
        ...prev,
        requests: exists
          ? prev.requests.map((r) => (r.email.toLowerCase() === normalizedEmail ? nextReq : r))
          : [nextReq, ...prev.requests],
      };
    });
    void fetch('/api/premium/request', {
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
        if (data?.state) setState(data.state);
      })
      .catch(() => {});
    return {
      ok: true,
      message: 'Đã gửi yêu cầu đăng ký gói 120.000đ / 3 tháng! Vui lòng chờ Admin phê duyệt để mở khóa Synapse Pre.',
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

    setState((prev) => {
      const exists = prev.requests.some((r) => r.email.toLowerCase() === normalizedEmail);
      const nextReq: PremiumRequest = {
        email: normalizedEmail,
        displayName: user.displayName || user.email,
        uid: user.uid,
        plan: 'Gia hạn +3 tháng (120.000đ)',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        isRenewal: true,
      };
      return {
        ...prev,
        requests: exists
          ? prev.requests.map((r) => (r.email.toLowerCase() === normalizedEmail ? nextReq : r))
          : [nextReq, ...prev.requests],
      };
    });

    void fetch('/api/premium/request', {
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
        if (data?.state) setState(data.state);
      })
      .catch(() => {});

    return {
      ok: true,
      message: 'Đã gửi yêu cầu gia hạn +3 tháng (120.000đ) tới Admin để cộng thêm thời hạn gói!',
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

      return {
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
    });

    void fetch('/api/premium/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean, isRenewal }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.state) setState(data.state);
      })
      .catch(() => {});
  };

  const revokeUserPremium = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setState((prev) => {
      const nextSubs = { ...(prev.subscriptions || {}) };
      delete nextSubs[clean];
      return {
        approvedEmails: prev.approvedEmails.filter((e) => e !== clean),
        requests: prev.requests.map((r) =>
          r.email.toLowerCase() === clean || r.displayName.toLowerCase() === clean
            ? { ...r, status: 'rejected' }
            : r
        ),
        subscriptions: nextSubs,
      };
    });
    void fetch('/api/premium/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: clean }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.state) setState(data.state);
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
