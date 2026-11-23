import React from 'react';
import {
  ArrowRight,
  Box,
  Hand,
  MessageSquare,
  Monitor,
  Sparkles,
  Upload,
  Users,
  Video,
} from 'lucide-react';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface LiveMeetShowcaseCardProps {
  isEn: boolean;
  onOpenMeet: () => void;
  id?: string;
}

export const LiveMeetShowcaseCard: React.FC<LiveMeetShowcaseCardProps> = ({
  isEn,
  onOpenMeet,
  id,
}) => {
  const { perfMode } = useBackgroundTheme();
  const isUltra = perfMode === 'ultra';
  const isBalanced = perfMode === 'balanced';
  const isSmooth = perfMode === 'smooth';

  const tierLabel = isUltra
    ? isEn
      ? 'Pro Graphics (Ultra)'
      : 'Đồ họa Pro (Cao)'
    : isBalanced
    ? isEn
      ? 'Medium Graphics'
      : 'Đồ họa Trung bình'
    : isEn
    ? 'Smooth / Low Graphics'
    : 'Đồ họa Thấp (Mượt)';

  return (
    <section
      id={id}
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-7 transition-all duration-300 ${
        isUltra
          ? 'border-sky-300 dark:border-sky-500/50 bg-white dark:bg-slate-900 shadow-sm dark:shadow-[0_0_45px_rgba(14,165,233,0.16)]'
          : isBalanced
          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
      }`}
    >
      {/* Scoped keyframes for Pro & Balanced dynamic motion */}
      <style>{`
        @keyframes meetFloatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        @keyframes meetOrbitCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes meetOrbitCCW {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes meetScanline {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateY(420%); opacity: 0; }
        }
        @keyframes meetShimmer {
          0% { transform: translateX(-140%) skewX(-18deg); }
          100% { transform: translateX(260%) skewX(-18deg); }
        }
        @keyframes meetEqBar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        @keyframes meetDriftOrb {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(22px, -16px) scale(1.12); }
        }
      `}</style>

      {/* Adaptive Background Animation based on perfMode */}
      {!isSmooth && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Drifting Aurora Orbs */}
          <div
            className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"
            style={{
              animation: isUltra ? 'meetDriftOrb 7s ease-in-out infinite' : 'meetDriftOrb 12s ease-in-out infinite',
            }}
          />
          <div
            className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/18 blur-3xl"
            style={{
              animation: isUltra
                ? 'meetDriftOrb 8.5s ease-in-out infinite reverse'
                : 'meetDriftOrb 14s ease-in-out infinite reverse',
            }}
          />
          {isUltra && (
            <>
              <div
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-3xl"
                style={{ animation: 'meetDriftOrb 6s ease-in-out infinite' }}
              />
              {/* Subtle animated holographic grid in Pro mode */}
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(56,189,248,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(56,189,248,0.45) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                  maskImage: 'radial-gradient(circle at 68% 50%, black 25%, transparent 80%)',
                }}
              />
            </>
          )}
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left: Feature Copy & CTA */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/15 px-2.5 py-1 text-xs font-bold text-sky-700 dark:text-sky-300">
              <Video className="h-3.5 w-3.5" />
              {isEn ? 'SYN MEET · FREE & SYNAPSE PRE 3D' : 'SYN MEET · FREE & PRE 3D'}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
                isUltra
                  ? 'border-amber-400/50 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  : isBalanced
                  ? 'border-sky-400/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sparkles className={`h-3 w-3 text-amber-500 dark:text-amber-400 ${isUltra ? 'animate-spin [animation-duration:6s]' : ''}`} />
              {tierLabel}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {isEn
              ? 'Study Together Live: Free Video/Screen Share & Pre Shared 3D Stage'
              : 'Học nhóm trực tuyến WebRTC: Free chia sẻ màn hình · Synapse Pre chiếu 3D chung'}
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Create a 6-character room in one click. Free accounts enjoy WebRTC video/audio calls, screen sharing, and group chat; Synapse Pre unlocks collaborative multi-user 3D rotation, layer explode & .glb/.gltf/.obj uploads.'
              : 'Tạo phòng học bằng mã 6 ký tự chỉ với 1 chạm: bản Miễn phí (Free) hỗ trợ gọi Video/Thoại WebRTC, chia sẻ màn hình bài giảng và chat nhóm; nâng cấp Synapse Pre mở khóa sân khấu mô hình 3D tương tác đồng bộ nhiều người & tải lên file .glb/.gltf/.obj.'}
          </p>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-3">
              <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Free · WebRTC Video & Screen Share' : 'Bản Free · Video & Chia sẻ màn hình'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Pin presentations or view classmates in a responsive grid.' : 'Gọi Video/Thoại P2P, chia sẻ màn hình & ghim bài trình chiếu.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-300/60 dark:border-amber-500/35 bg-amber-50/50 dark:bg-amber-950/20 p-3">
              <Box className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Pre · Multi-User Shared 3D Stage' : 'Bản Pre · Chiếu Mô Hình 3D Nhiều Người'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Sync rotate, zoom, wireframe, explode & click-to-inspect.' : 'Cùng xoay, tách lớp, soi chi tiết mô hình 3D theo thời gian thực.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-amber-300/60 dark:border-amber-500/35 bg-amber-50/50 dark:bg-amber-950/20 p-3">
              <Upload className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Pre · Upload .glb/.obj & 3D Library' : 'Bản Pre · Up file .glb/.obj & Kho 3D'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Upload your own 3D files or pick models from Spatial 3D.' : 'Tải mô hình 3D riêng lên phòng học hoặc lấy từ Học tương tác.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-3">
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Free · Live Chat & Hand Raise' : 'Bản Free · Chat, Giơ tay & Cảm xúc'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Real-time classroom discussion & reactions with zero lag.' : 'Trao đổi nhóm, giơ tay phát biểu và thả cảm xúc tức thì.'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenMeet}
              className={`relative overflow-hidden inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg cursor-pointer whitespace-nowrap ${
                !isSmooth ? 'transition-all duration-200 hover:scale-[1.03] hover:shadow-sky-500/40' : 'hover:bg-sky-400'
              }`}
            >
              {isUltra && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-sm"
                  style={{ animation: 'meetShimmer 2.8s ease-in-out infinite' }}
                />
              )}
              <Video className="relative z-10 h-4 w-4" />
              <span className="relative z-10">
                {isEn ? 'Open Syn Meet & 3D Classroom' : 'Vào Syn Meet 3D'}
              </span>
              <ArrowRight className="relative z-10 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: Adaptive Visual Stage Preview */}
        <div className="lg:col-span-5">
          <div
            className={`relative rounded-2xl border bg-slate-900/90 p-4 ${
              isUltra
                ? 'border-sky-400/50 shadow-[0_0_32px_rgba(56,189,248,0.18)]'
                : isBalanced
                ? 'border-sky-500/35 shadow-lg'
                : 'border-slate-800'
            }`}
          >
            {/* Mini Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-[11px]">
              <div className="flex items-center gap-2 font-semibold text-white">
                <span className="relative flex h-2.5 w-2.5">
                  {!isSmooth && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span>Nhóm Toán - Lí - Tin 3D</span>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                CODE: STEM3D
              </span>
            </div>

            {/* Mini 3D + Video Preview */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="col-span-2 relative flex h-40 flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#050a18]">
                {/* Pro Laser Scanline */}
                {isUltra && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent"
                    style={{ animation: 'meetScanline 3.2s linear infinite' }}
                  />
                )}

                {/* Multi-Ring Holographic 3D Core */}
                <div className="relative flex h-24 w-24 items-center justify-center">
                  {/* Outer Orbit Ring (Pro & Balanced) */}
                  {!isSmooth && (
                    <div
                      className={`absolute inset-0 rounded-full border border-dashed ${
                        isUltra ? 'border-cyan-400/60' : 'border-sky-500/40'
                      }`}
                      style={{
                        animation: isUltra ? 'meetOrbitCW 8s linear infinite' : 'meetOrbitCW 14s linear infinite',
                      }}
                    >
                      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
                    </div>
                  )}

                  {/* Inner Counter-Rotating Ring (Pro only) */}
                  {isUltra && (
                    <div
                      className="absolute inset-2.5 rounded-full border border-emerald-400/50"
                      style={{ animation: 'meetOrbitCCW 5.5s linear infinite' }}
                    >
                      <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
                    </div>
                  )}

                  {/* Levitating 3D Model Cube */}
                  <div
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-400/60 bg-sky-500/20 text-sky-200 ${
                      isUltra ? 'shadow-[0_0_20px_rgba(56,189,248,0.45)]' : ''
                    }`}
                    style={
                      !isSmooth
                        ? {
                            animation: isUltra
                              ? 'meetFloatY 2.6s ease-in-out infinite'
                              : 'meetFloatY 4s ease-in-out infinite',
                          }
                        : undefined
                    }
                  >
                    <Box className="h-6 w-6" />
                  </div>
                </div>

                <span className="relative z-10 mt-1 text-[10px] font-semibold text-cyan-300">
                  {isEn ? 'Shared 3D Stage (Synced)' : 'Sân khấu 3D đồng bộ'}
                </span>

                {isUltra && (
                  <>
                    <span className="absolute right-2 top-2 rounded bg-amber-400/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-950 animate-bounce">
                      💡
                    </span>
                    <span className="absolute left-2 bottom-2 rounded border border-cyan-500/40 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[8px] text-cyan-300">
                      HOLO 3D
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {/* Participant 1 with Live Audio Equalizer */}
                <div className="relative flex h-[76px] flex-col items-center justify-center rounded-xl border border-sky-500/40 bg-slate-950/90">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-slate-950">
                    AN
                  </div>
                  <span className="mt-1 text-[9px] text-slate-300">Minh An</span>
                  {!isSmooth && (
                    <div className="mt-1 flex h-2.5 items-end gap-0.5">
                      {[0, 0.15, 0.3, 0.1].map((delay, idx) => (
                        <span
                          key={idx}
                          className="w-0.5 h-full rounded-full bg-sky-400 origin-bottom"
                          style={{
                            animation: `meetEqBar ${isUltra ? '0.65s' : '1.1s'} ease-in-out ${delay}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Participant 2 with Hand Raise */}
                <div className="flex h-[76px] flex-col items-center justify-center rounded-xl border border-amber-400/50 bg-slate-950/90">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                    KH
                  </div>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] text-amber-300">
                    <Hand className={`h-2.5 w-2.5 ${isUltra ? 'animate-bounce' : ''}`} /> Gia Khánh
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Bottom Bar */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-sky-400" />
                {isEn ? 'WebRTC P2P · Low Latency' : 'WebRTC P2P · Độ trễ thấp'}
              </span>
              <span className="font-mono text-[10px] text-emerald-400">
                {isUltra ? '60 FPS · Pro' : isBalanced ? 'Balanced' : 'Eco Smooth'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
