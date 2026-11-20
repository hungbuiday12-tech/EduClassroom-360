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
      ? 'High Graphics (Pro)'
      : 'Đồ họa Cao (Pro)'
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
          ? 'border-sky-400/50 bg-slate-950/95 shadow-[0_0_40px_rgba(14,165,233,0.16)]'
          : isBalanced
          ? 'border-sky-500/35 bg-slate-950/95 shadow-xl'
          : 'border-slate-700 bg-slate-950'
      }`}
    >
      {/* Adaptive Background Animation based on performanceMode */}
      {!isSmooth && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl ${
              isUltra ? 'animate-pulse' : ''
            }`}
          />
          <div
            className={`absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl ${
              isUltra ? 'animate-pulse' : ''
            }`}
          />
          {isUltra && (
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
          )}
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Left: Feature Copy & CTA */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/15 px-2.5 py-1 text-xs font-bold text-sky-300">
              <Video className="h-3.5 w-3.5" />
              {isEn ? 'LIVE MEET & SHARED 3D' : 'PHÒNG HỌC TRỰC TUYẾN 3D'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              {tierLabel}
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            {isEn
              ? 'Study Together Live with Screen Share & Shared 3D Models'
              : 'Học nhóm trực tuyến chuẩn Google Meet · Chia sẻ màn hình & Mô hình 3D chung'}
          </h2>

          <p className="text-sm leading-relaxed text-slate-300">
            {isEn
              ? 'Create a 6-character room in one click, turn on WebRTC video/audio, share your screen, and collaboratively rotate, zoom, explode, or upload .glb/.gltf/.obj 3D models in real time.'
              : 'Tạo phòng học bằng mã 6 ký tự chỉ với 1 chạm: gọi video/thoại WebRTC, chia sẻ màn hình bài giảng/code, cùng xoay, tách lớp, soi chi tiết bằng chuột hoặc tải lên file 3D (.glb/.gltf/.obj) và dùng ngay thư viện Học tương tác 3D.'}
          </p>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div
              className={`flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-3 ${
                !isSmooth ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:border-sky-500/40' : ''
              }`}
            >
              <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {isEn ? 'WebRTC Video & Screen Share' : 'Gọi Video & Chia sẻ màn hình'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isEn ? 'Pin presentations or view in responsive grid.' : 'Tự động ghim màn hình trình chiếu hoặc xem dạng lưới.'}
                </div>
              </div>
            </div>

            <div
              className={`flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-3 ${
                !isSmooth ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40' : ''
              }`}
            >
              <Box className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {isEn ? 'Mouse-Controlled Shared 3D' : 'Nghiên cứu mô hình 3D bằng chuột'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isEn ? 'Rotate, pan, zoom, wireframe, explode & click-to-inspect.' : 'Xoay, pan, zoom, khung dây, tách lớp & click soi chi tiết.'}
                </div>
              </div>
            </div>

            <div
              className={`flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-3 ${
                !isSmooth ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:border-violet-500/40' : ''
              }`}
            >
              <Upload className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {isEn ? 'Upload .glb/.obj & 3D Library' : 'Up file .glb/.obj & Kho 3D tương tác'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isEn ? 'Upload your own 3D files or pick saved models.' : 'Tải mô hình 3D của bạn lên hoặc chọn từ Học tương tác.'}
                </div>
              </div>
            </div>

            <div
              className={`flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-3 ${
                !isSmooth ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:border-amber-500/40' : ''
              }`}
            >
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  {isEn ? 'Live Chat, Hand Raise & Reactions' : 'Chat trực tiếp, Giơ tay & Cảm xúc'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isEn ? 'Real-time classroom discussion with zero lag.' : 'Trao đổi nhóm, giơ tay phát biểu và thả cảm xúc tức thì.'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenMeet}
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg cursor-pointer whitespace-nowrap ${
                !isSmooth ? 'transition-all duration-200 hover:scale-[1.02] hover:shadow-sky-500/30' : 'hover:bg-sky-400'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>{isEn ? 'Open Live Meet & 3D Classroom' : 'Vào Phòng Học Trực Tuyến 3D'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: Adaptive Visual Stage Preview */}
        <div className="lg:col-span-5">
          <div
            className={`relative rounded-2xl border bg-slate-900/90 p-4 ${
              isUltra ? 'border-sky-400/40 shadow-inner' : 'border-slate-800'
            }`}
          >
            {/* Mini Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-[11px]">
              <div className="flex items-center gap-2 font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Nhóm Toán - Lí - Tin 3D</span>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                CODE: STEM3D
              </span>
            </div>

            {/* Mini 3D + Video Preview */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="col-span-2 relative flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#060b16]">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-400/50 bg-sky-500/15 text-sky-300 ${
                    isUltra
                      ? 'animate-spin [animation-duration:10s]'
                      : isBalanced
                      ? 'animate-pulse'
                      : ''
                  }`}
                >
                  <Box className="h-8 w-8" />
                </div>
                <span className="mt-2 text-[10px] font-semibold text-cyan-300">
                  {isEn ? 'Shared 3D Stage (Synced)' : 'Sân khấu 3D đồng bộ'}
                </span>
                {isUltra && (
                  <span className="absolute right-2 top-2 rounded bg-amber-400/90 px-1.5 py-0.5 text-[9px] font-bold text-slate-950 animate-bounce">
                    💡
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex h-[68px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-slate-950">
                    AN
                  </div>
                  <span className="mt-1 text-[9px] text-slate-400">Minh An</span>
                </div>
                <div className="flex h-[68px] flex-col items-center justify-center rounded-xl border border-amber-400/50 bg-slate-950/90">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                    KH
                  </div>
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] text-amber-300">
                    <Hand className="h-2.5 w-2.5" /> Gia Khánh
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
