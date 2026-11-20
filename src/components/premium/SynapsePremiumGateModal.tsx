import React, { useState } from 'react';
import {
  CheckCircle2,
  Crown,
  Film,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserX,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePremium } from '../../context/PremiumContext';

interface SynapsePremiumGateModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onEnterPremium?: () => void;
  inline?: boolean;
}

export const SynapsePremiumGateModal: React.FC<SynapsePremiumGateModalProps> = ({
  isOpen,
  onClose,
  onEnterPremium,
  inline = false,
}) => {
  const { user } = useAuth();
  const {
    hasPremiumAccess,
    isAdmin,
    approvedEmails,
    requests,
    myRequest,
    submitPremiumRequest,
    approveUserPremium,
    revokeUserPremium,
  } = usePremium();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [adminGrantEmail, setAdminGrantEmail] = useState('');

  if (!isOpen) return null;

  const handleRequest = () => {
    const res = submitPremiumRequest();
    setFeedback(res.message);
  };

  const handleAdminGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminGrantEmail.trim()) return;
    approveUserPremium(adminGrantEmail.trim());
    setFeedback(`Đã cấp quyền Synapse Pre cho tài khoản ${adminGrantEmail.trim()}`);
    setAdminGrantEmail('');
  };

  const content = (
    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-amber-400/50 bg-slate-950 text-slate-100 shadow-[0_0_60px_rgba(245,158,11,0.22)]">
      {/* Top Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl"
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/50 bg-gradient-to-br from-amber-400/25 to-orange-500/25 text-amber-300">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Synapse Premium — Nâng Cấp Không Gian STEM Đỉnh Cao
              </h2>
              <span className="rounded-md border border-amber-400/50 bg-amber-500/20 px-2 py-0.5 text-[11px] font-extrabold text-amber-300">
                120.000đ / 3 tháng
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Chỉ mở khóa khi đăng nhập tài khoản và được Admin phê duyệt cấp quyền.
            </p>
          </div>
        </div>
        {onClose && !inline && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="relative z-10 grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
        {/* Free Tier Summary */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200">Bản Miễn Phí (Free)</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
              0đ / Vĩnh viễn
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Đầy đủ 3 môn học Toán, Vật lí, Tin học & mô phỏng 2D/3D cơ bản.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Cộng đồng học tập, Phòng học trực tuyến Meet & chia sẻ 3D.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>3 trợ lí AI cơ bản thuần túy cho 3 môn Toán · Vật lí · Tin học.</span>
            </li>
          </ul>
        </div>

        {/* Synapse Premium Tier */}
        <div className="rounded-xl border border-amber-400/50 bg-gradient-to-br from-amber-500/10 via-slate-900 to-cyan-500/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-amber-300">
              <Sparkles className="h-4 w-4" /> Synapse Pre (Premium)
            </span>
            <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-slate-950">
              120.000đ / 3 tháng
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            <li className="flex items-start gap-2">
              <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <span>
                <strong>AI Siêu Tốc & Phân tích rõ ràng</strong>: Trả lời nhanh hơn, bố cục 3 tầng khoa học.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Film className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
              <span>
                <strong>Tạo Video 3B1B AI & Phân tích chuyên sâu</strong> (độc quyền Premium).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Crown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span>
                <strong>Giao diện Trang Chính Premium vượt bật</strong> + Mô phỏng chất lượng chuẩn Astra AI (15 lượt/ngày) & trọn bộ 21 Lab 3D/4D tương lai.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action / Status Area */}
      <div className="relative z-10 border-t border-slate-800 bg-slate-900/60 px-5 py-4 space-y-4">
        {feedback && (
          <div className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200">
            {feedback}
          </div>
        )}

        {!user ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Bạn cần đăng nhập tài khoản trước để đăng ký và được Admin cấp quyền Synapse Pre.</span>
            </div>
            {onClose && !inline && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-300 cursor-pointer"
              >
                Đóng & Đăng nhập
              </button>
            )}
          </div>
        ) : hasPremiumAccess ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              <span>
                Tài khoản <strong>{user.email}</strong> đã được cấp quyền Synapse Pre!
              </span>
            </div>
            {onEnterPremium && (
              <button
                type="button"
                onClick={onEnterPremium}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg hover:brightness-110 cursor-pointer"
              >
                <Crown className="h-4 w-4" />
                <span>Vào Giao Diện Synapse Premium</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              {myRequest?.status === 'pending' ? (
                <span className="font-semibold text-amber-300">
                  ⏳ Yêu cầu gói 120.000đ / 3 tháng của tài khoản {user.email} đang chờ Admin phê duyệt.
                </span>
              ) : (
                <span>
                  Tài khoản <strong>{user.email}</strong> chưa được kích hoạt Synapse Pre. Gửi yêu cầu để Admin cấp quyền ngay.
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleRequest}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg hover:brightness-110 cursor-pointer"
            >
              <Crown className="h-4 w-4" />
              <span>
                {myRequest?.status === 'pending'
                  ? 'Gửi lại yêu cầu (120k / 3 tháng)'
                  : 'Đăng ký Synapse Pre · 120k / 3 tháng'}
              </span>
            </button>
          </div>
        )}

        {/* Admin Control Panel for granting/revoking Synapse Pre */}
        {isAdmin && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/25 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                <span>BẢNG QUẢN TRỊ ADMIN — CẤP QUYỀN SYNAPSE PRE (120K / 3 THÁNG)</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                Đã cấp: {approvedEmails.length} tài khoản
              </span>
            </div>

            <form onSubmit={handleAdminGrant} className="flex flex-wrap gap-2">
              <input
                type="email"
                value={adminGrantEmail}
                onChange={(e) => setAdminGrantEmail(e.target.value)}
                placeholder="Nhập email học sinh để cấp quyền Synapse Pre..."
                className="flex-1 min-w-[220px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Cấp quyền ngay</span>
              </button>
            </form>

            {requests.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {requests.map((req) => {
                  const approved = approvedEmails.includes(req.email.toLowerCase());
                  return (
                    <div
                      key={req.email}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{req.displayName}</span>
                        <span className="ml-2 text-slate-400">{req.email}</span>
                        <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                          {req.plan}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!approved ? (
                          <button
                            type="button"
                            onClick={() => approveUserPremium(req.email)}
                            className="inline-flex items-center gap-1 rounded bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-emerald-400 cursor-pointer"
                          >
                            <UserCheck className="h-3 w-3" /> Duyệt
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => revokeUserPremium(req.email)}
                            className="inline-flex items-center gap-1 rounded bg-rose-500/20 border border-rose-500/50 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                          >
                            <UserX className="h-3 w-3" /> Thu hồi
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return <div className="mx-auto max-w-4xl py-6 px-4">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      {content}
    </div>
  );
};
