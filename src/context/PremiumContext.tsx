import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

export interface PremiumRequest {
  email: string;
  displayName: string;
  uid: string;
  plan: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PremiumStorageState {
  approvedEmails: string[];
  requests: PremiumRequest[];
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
  pendingRequestsCount: number;
  myRequest: PremiumRequest | null;
  submitPremiumRequest: () => { ok: boolean; message: string };
  approveUserPremium: (email: string) => void;
  revokeUserPremium: (email: string) => void;
  dailyQuotaLimit: number;
  dailyQuotaUsed: number;
  dailyQuotaRemaining: number;
  consumeDailyQuota: (amount?: number) => boolean;
}

const STORAGE_KEY = 'educlassroom360_synapse_premium_v1';
const QUOTA_KEY_PREFIX = 'educlassroom360_astra_quota_';
const DAILY_QUOTA_LIMIT = 15;

const PremiumContext = createContext<PremiumContextType | null>(null);

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadPremiumState(): PremiumStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { approvedEmails: [], requests: [] };
    const parsed = JSON.parse(raw) as Partial<PremiumStorageState>;
    return {
      approvedEmails: Array.isArray(parsed.approvedEmails) ? parsed.approvedEmails : [],
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
    };
  } catch {
    return { approvedEmails: [], requests: [] };
  }
}

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<PremiumStorageState>(loadPremiumState);
  const [dailyQuotaUsed, setDailyQuotaUsed] = useState<number>(0);

  const isAdmin = user?.role === 'admin';
  const normalizedEmail = (user?.email || '').trim().toLowerCase();

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
          setState({
            approvedEmails: data.approvedEmails,
            requests: data.requests,
          });
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
    const normalizedName = (user.displayName || '').trim().toLowerCase();
    return (
      state.approvedEmails.includes(normalizedEmail) ||
      (normalizedName.length > 0 && state.approvedEmails.includes(normalizedName))
    );
  }, [user, state.approvedEmails, normalizedEmail]);

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

  const submitPremiumRequest = (): { ok: boolean; message: string } => {
    if (!user || !normalizedEmail) {
      return {
        ok: false,
        message: 'Vui lòng đăng nhập tài khoản trước khi đăng ký Synapse Pre (120.000đ / 3 tháng).',
      };
    }
    if (hasPremiumAccess) {
      return { ok: true, message: 'Tài khoản của bạn đã có quyền truy cập Synapse Pre.' };
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

  const approveUserPremium = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setState((prev) => ({
      approvedEmails: prev.approvedEmails.includes(clean)
        ? prev.approvedEmails
        : [...prev.approvedEmails, clean],
      requests: prev.requests.map((r) =>
        r.email.toLowerCase() === clean || r.displayName.toLowerCase() === clean
          ? { ...r, status: 'approved' }
          : r
      ),
    }));
    void fetch('/api/premium/approve', {
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

  const revokeUserPremium = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    setState((prev) => ({
      approvedEmails: prev.approvedEmails.filter((e) => e !== clean),
      requests: prev.requests.map((r) =>
        r.email.toLowerCase() === clean || r.displayName.toLowerCase() === clean
          ? { ...r, status: 'rejected' }
          : r
      ),
    }));
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
        pendingRequestsCount,
        myRequest,
        submitPremiumRequest,
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
