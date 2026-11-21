import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Atom,
  BookOpen,
  Code2,
  Cpu,
  Crown,
  Film,
  Layers,
  Orbit,
  Play,
  ShieldCheck,
  Sparkles,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { usePremium } from '../../context/PremiumContext';
import { FutureLabTabId, SubjectType } from '../../types';
import { SynapsePremiumGateModal } from './SynapsePremiumGateModal';

interface SynapsePremiumHomeProps {
  onOpenLab: (tab: FutureLabTabId) => void;
  onOpenAllLabs: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
}

interface AstraSimCard {
  id: string;
  labId: FutureLabTabId;
  badge: string;
  title: string;
  desc: string;
  cost: number;
  accent: string;
}

const ASTRA_SIMS: AstraSimCard[] = [
  {
    id: 'astra_whatif',
    labId: 'what_if_physics_3d',
    badge: 'ASTRA PHYSICS · 3D',
    title: 'Vũ Trụ "Nếu Định Luật Vật Lí Thay Đổi"',
    desc: 'Phá vỡ hằng số G, 1/rⁿ, tốc độ ánh sáng c & Planck h với phân tích hệ quả vật lí thời gian thực.',
    cost: 1,
    accent: 'from-amber-500/25 via-orange-500/10 to-pink-500/20 border-amber-400/50',
  },
  {
    id: 'astra_algocity',
    labId: 'algo_city_3d',
    badge: 'ASTRA CS · 3D',
    title: 'Thành Phố Thuật Toán 3D — AlgoCity',
    desc: 'Dijkstra 3D, Quy Hoạch Động DP 2D, Segment Tree 3D & mô phỏng quá tải nút cổ chai TLE.',
    cost: 1,
    accent: 'from-emerald-500/25 via-teal-500/10 to-cyan-500/20 border-emerald-400/50',
  },
  {
    id: 'astra_quantum',
    labId: 'quantum_holodeck_3d',
    badge: 'ASTRA QUANTUM · 3D',
    title: 'Quantum Holodeck — Quả Cầu Bloch 3D',
    desc: 'Ghép cổng H, X, Y, Z, CNOT, kích hoạt vướng víu Bell & chạy 1.000 lần đo sụp đổ hàm sóng.',
    cost: 1,
    accent: 'from-cyan-500/25 via-sky-500/10 to-violet-500/20 border-cyan-400/50',
  },
  {
    id: 'astra_text2sim',
    labId: 'text_to_sim',
    badge: 'ASTRA AI · LIVE',
    title: 'Sinh Mô Phỏng Từ Đề Bài (Text → Sim)',
    desc: 'Nhập đề bài Toán/Lí/Tin bất kỳ để AI dựng ngay mô phỏng đồ họa tương tác 60 FPS chuẩn Astra.',
    cost: 2,
    accent: 'from-violet-500/25 via-fuchsia-500/10 to-sky-500/20 border-violet-400/50',
  },
];

export const SynapsePremiumHome: React.FC<SynapsePremiumHomeProps> = ({
  onOpenLab,
  onOpenAllLabs,
  onNavigateSubject,
}) => {
  const { user } = useAuth();
  const { perfMode } = useBackgroundTheme();
  const {
    isAdmin,
    dailyQuotaLimit,
    dailyQuotaUsed,
    dailyQuotaRemaining,
    consumeDailyQuota,
  } = usePremium();

  const isUltra = perfMode === 'ultra';
  const isSmooth = perfMode === 'smooth';

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMode, setAiMode] = useState<'fast_analysis' | 'video_3b1b'>('fast_analysis');
  const [aiResult, setAiResult] = useState<{
    mode: 'fast_analysis' | 'video_3b1b';
    summary: string;
    steps: string[];
    formula: string;
    videoStoryboard?: string[];
  } | null>(null);
  const [quotaAlert, setQuotaAlert] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleRunPremiumAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const cost = aiMode === 'video_3b1b' ? 2 : 1;
    if (!consumeDailyQuota(cost)) {
      setQuotaAlert(
        `Bạn đã dùng hết hạn mức ${dailyQuotaLimit}/${dailyQuotaLimit} lượt Astra AI & Mô phỏng hôm nay. Hạn mức sẽ tự động làm mới vào 00:00 ngày mai!`
      );
      return;
    }
    setQuotaAlert(null);
    const topic = aiPrompt.trim();
    if (aiMode === 'video_3b1b') {
      setAiResult({
        mode: 'video_3b1b',
        summary: `Kịch bản Video 3Blue1Brown AI (60 FPS) cho chủ đề: "${topic}"`,
        steps: [
          'Cảnh 1 (0:00–0:15): Dựng hệ trục tọa độ & trực quan hóa bài toán bằng chuyển động vector mượt mà.',
          'Cảnh 2 (0:15–0:40): Biến đổi hình học từng bước, tô sáng các đại lượng bất biến và điểm cực trị.',
          'Cảnh 3 (0:40–1:00): Tổng kết trực giác bản chất & công thức tổng quát giúp ghi nhớ ngay lập tức.',
        ],
        formula: 'Syn Reel 3B1B Engine · Render 1080p 60fps · Giọng đọc AI song ngữ',
        videoStoryboard: [
          'Frame 01 · Khởi tạo không gian pha & lưới tọa độ',
          'Frame 02 · Quỹ đạo biến thiên & đạo hàm trực quan',
          'Frame 03 · Hội tụ nghiệm tối ưu & kiểm chứng',
        ],
      });
    } else {
      setAiResult({
        mode: 'fast_analysis',
        summary: `Phân tích Siêu Tốc Synapse Pre (< 0.8s) cho: "${topic}"`,
        steps: [
          'Bước 1 · Nhận diện dạng toán/hiện tượng: Tách rõ giả thiết, điều kiện biên và đại lượng cần tìm.',
          'Bước 2 · Lập luận cốt lõi: Áp dụng định luật bảo toàn / biến đổi tương đương ngắn gọn nhất.',
          'Bước 3 · Kiểm tra ngược & bẫy thường gặp: Đối chiếu thứ nguyên, dấu và miền xác định.',
        ],
        formula: 'Độ chính xác nâng cao · Bố cục 3 tầng rõ ràng · Hỗ trợ mở thẳng mô phỏng 3D',
      });
    }
  };

  const handleLaunchAstraSim = (sim: AstraSimCard) => {
    if (!consumeDailyQuota(sim.cost)) {
      setQuotaAlert(
        `Đã đạt giới hạn ${dailyQuotaLimit}/${dailyQuotaLimit} lượt Astra AI hôm nay! Bạn vẫn có thể học các môn cơ bản và quay lại vào ngày mai khi hạn mức được làm mới.`
      );
      return;
    }
    setQuotaAlert(null);
    onOpenLab(sim.labId);
  };

  const quotaPercent = Math.min(100, Math.round((dailyQuotaUsed / dailyQuotaLimit) * 100));

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes preGoldSweep {
          0% { transform: translateX(-140%) skewX(-18deg); }
          100% { transform: translateX(260%) skewX(-18deg); }
        }
        @keyframes preOrbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(18px, -14px) scale(1.08); }
        }
      `}</style>

      {/* HERO SYNAPSE PREMIUM (Vượt bật hơn Trang chính Free) */}
      <section
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-white ${
          isUltra
            ? 'border-amber-400/60 bg-slate-950 shadow-[0_0_65px_rgba(245,158,11,0.22)]'
            : 'border-amber-400/40 bg-slate-950 shadow-2xl'
        }`}
      >
        {!isSmooth && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"
              style={{ animation: isUltra ? 'preOrbFloat 7s ease-in-out infinite' : undefined }}
            />
            <div
              className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"
              style={{ animation: isUltra ? 'preOrbFloat 9s ease-in-out infinite reverse' : undefined }}
            />
            {isUltra && (
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.4) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            )}
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/60 bg-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-300">
                <Crown className="h-3.5 w-3.5" />
                SYNAPSE PREMIUM · ĐÃ KÍCH HOẠT
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-2.5 py-1 text-[11px] font-bold text-cyan-200">
                <Sparkles className="h-3 w-3" />
                Gói 120.000đ / 3 tháng
              </span>
              {user && (
                <span className="rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-[11px] text-slate-300">
                  {user.displayName || user.email}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-white to-cyan-300 bg-clip-text text-transparent">
              Trang Chính Synapse Premium — AI 3B1B & Mô Phỏng Chuẩn Astra AI
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Không gian học tập nâng cấp toàn diện: AI ra đáp án siêu tốc với bố cục 3 tầng rõ ràng, tạo Video 3B1B AI độc quyền, mô phỏng tương tác chuẩn Astra AI và trọn bộ 21 phòng thí nghiệm 3D/4D tương lai.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/50 bg-emerald-500/15 px-4 py-2.5 text-xs font-bold text-emerald-200 hover:bg-emerald-500/25 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin: Cấp quyền tài khoản Pre</span>
                </button>
              )}
            </div>
          </div>

          {/* Daily Astra Quest / Quota Card */}
          <div className="w-full lg:w-80 rounded-2xl border border-amber-400/35 bg-slate-900/90 p-4 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Hạn mức Astra AI hôm nay
              </span>
              <span className="font-mono font-extrabold text-white">
                {dailyQuotaRemaining}/{dailyQuotaLimit} lượt
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  dailyQuotaRemaining === 0
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-amber-400 to-cyan-400'
                }`}
                style={{ width: `${100 - quotaPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              AI Phân tích nhanh: <strong>1 lượt</strong> · Tạo Video 3B1B AI / Text→Sim: <strong>2 lượt</strong>. Tự động làm mới mỗi ngày.
            </p>
          </div>
        </div>
      </section>

      {quotaAlert && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/50 bg-rose-950/50 px-4 py-3 text-xs text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>{quotaAlert}</span>
        </div>
      )}

      {/* SYNAPSE PREMIUM AI STUDIO (Đáp án nhanh + Tạo Video 3B1B AI) */}
      <section className="rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-5 sm:p-6 text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Độc quyền Synapse Premium (Bản Free chỉ có 3 AI môn cơ bản)
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Synapse AI Pro · Giải Siêu Tốc & Tạo Video 3B1B AI
            </h2>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setAiMode('fast_analysis')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                aiMode === 'fast_analysis'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="mr-1 inline h-3.5 w-3.5" />
              Giải nhanh & Phân tích (1 lượt)
            </button>
            <button
              type="button"
              onClick={() => setAiMode('video_3b1b')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                aiMode === 'video_3b1b'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Film className="mr-1 inline h-3.5 w-3.5" />
              Tạo Video 3B1B AI (2 lượt)
            </button>
          </div>
        </div>

        <form onSubmit={handleRunPremiumAI} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={
              aiMode === 'video_3b1b'
                ? 'Nhập chủ đề muốn dựng Video 3B1B AI (vd: Ý nghĩa hình học của Đạo hàm, Giao thoa sóng)...'
                : 'Nhập bài toán Toán / Vật lí / Tin học để AI Pro phân tích siêu tốc...'
            }
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-xs sm:text-sm font-extrabold text-slate-950 hover:brightness-110 cursor-pointer whitespace-nowrap"
          >
            <Wand2 className="h-4 w-4" />
            <span>{aiMode === 'video_3b1b' ? 'Tạo Video 3B1B AI' : 'Phân tích siêu tốc'}</span>
          </button>
        </form>

        {aiResult && (
          <div className="rounded-xl border border-cyan-500/35 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-cyan-300">{aiResult.summary}</span>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                {aiResult.mode === 'video_3b1b' ? '3B1B VIDEO AI' : 'FAST PRO AI'}
              </span>
            </div>
            <ol className="space-y-1.5 text-xs text-slate-200">
              {aiResult.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/25 text-[10px] font-bold text-cyan-300">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            {aiResult.videoStoryboard && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {aiResult.videoStoryboard.map((frame, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-amber-400/35 bg-slate-950 p-2.5 text-[11px] text-amber-200"
                  >
                    <Play className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                    <span>{frame}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="text-[11px] font-mono text-emerald-300 border-t border-slate-800 pt-2">
              {aiResult.formula}
            </div>
          </div>
        )}
      </section>

      {/* MÔ PHỎNG CHẤT LƯỢNG CHUẨN ASTRA AI */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-500" />
              Mô Phỏng Tương Tác Chuẩn Astra AI
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Đồ họa 3D/WebGL độ phân giải cao, phản hồi vật lí & thuật toán thời gian thực. Toàn bộ 21 phòng Lab nằm gọn ở thanh menu bên trái.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASTRA_SIMS.map((sim) => (
            <div
              key={sim.id}
              className={`rounded-2xl border bg-gradient-to-br ${sim.accent} bg-slate-950 p-5 text-white flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-1`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-slate-950/70 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-300">
                    {sim.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    -{sim.cost} lượt Astra
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">{sim.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{sim.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchAstraSim(sim)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Khởi chạy Mô phỏng Astra</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TRUY CẬP NHANH 3 MÔN HỌC & PHÒNG MEET (GIAO DIỆN PRO) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'math' as SubjectType,
            title: 'Toán Học Pro',
            desc: 'Hình học Oxyz 3D & Giải tích',
            icon: BookOpen,
            color: 'text-sky-400 border-sky-500/40',
          },
          {
            id: 'physics' as SubjectType,
            title: 'Vật Lí Pro',
            desc: 'Phòng thí nghiệm 2D/3D toàn diện',
            icon: Atom,
            color: 'text-amber-400 border-amber-500/40',
          },
          {
            id: 'cs' as SubjectType,
            title: 'Tin Học Pro',
            desc: 'Sublime 4 IDE & Lộ trình VNOI',
            icon: Code2,
            color: 'text-emerald-400 border-emerald-500/40',
          },
          {
            id: 'live_meet' as SubjectType,
            title: 'Phòng Học Meet 3D',
            desc: 'Video WebRTC & Mô hình 3D chung',
            icon: Video,
            color: 'text-violet-400 border-violet-500/40',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigateSubject(item.id)}
              className={`flex items-start gap-3 rounded-2xl border ${item.color} bg-slate-950/90 p-4 text-left hover:bg-slate-900 transition cursor-pointer`}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-extrabold text-white">{item.title}</div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </section>

      <SynapsePremiumGateModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
};
