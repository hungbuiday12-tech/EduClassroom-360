import React, { useEffect, useState } from 'react';
import {
  X,
  Cpu,
  Check,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  MonitorCheck
} from 'lucide-react';
import {
  useBackgroundTheme,
  PERFORMANCE_MODE_OPTIONS,
  PerformanceMode
} from '../../context/BackgroundContext';
import { useLanguage } from '../../context/LanguageContext';

export const GraphicsTierModal: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    perfMode,
    bgStyle,
    hardwareProfile,
    applyGraphicsTier,
    isGraphicsModalOpen,
    closeGraphicsModal
  } = useBackgroundTheme();

  const [syncSceneWithTier, setSyncSceneWithTier] = useState<boolean>(true);

  useEffect(() => {
    if (!isGraphicsModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeGraphicsModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGraphicsModalOpen, closeGraphicsModal]);

  if (!isGraphicsModalOpen) return null;

  const recommendedOpt =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === hardwareProfile.recommendedMode) ||
    PERFORMANCE_MODE_OPTIONS[0];

  const tierDetails: Record<
    PerformanceMode,
    {
      indexLabel: string;
      subtitleVi: string;
      subtitleEn: string;
      bulletsVi: string[];
      bulletsEn: string[];
      previewLabelVi: string;
      previewLabelEn: string;
    }
  > = {
    smooth: {
      indexLabel: '01',
      subtitleVi: 'Mặc định khi vào web · Tối ưu máy yếu / PC trường học',
      subtitleEn: 'Default on first load · Best for school/entry PCs',
      bulletsVi: [
        'Tắt hoàn toàn blur nặng GPU & hiệu ứng nền tiêu tốn RAM',
        'Khung & nút bấm vuông sắc nét, phản hồi tức thì không độ trễ',
        'Tự động giữ Nền Trắng Động siêu mượt 22 FPS tiết kiệm pin'
      ],
      bulletsEn: [
        'Disables heavy GPU backdrop-blur and continuous background shaders',
        'Crisp square-cut buttons and frames with instant click feedback',
        'Pairs with ultra-light White Dynamic canvas at 22 FPS'
      ],
      previewLabelVi: 'Khung tĩnh sắc nét · Tải 0%',
      previewLabelEn: 'Crisp Static Frame · Zero Lag'
    },
    balanced: {
      indexLabel: '02',
      subtitleVi: 'Animation cơ bản sống động trên nút & khung',
      subtitleEn: 'Lively basic animations across buttons and frames',
      bulletsVi: [
        'Nút bấm nhấc nổi mượt mà + quét sáng nhẹ khi di chuột qua',
        'Khung bài học & thẻ có dải viền màu chuyển động dịu theo nền',
        'Bật hiệu ứng chữ né chuột nhẹ nhàng & canvas 30 FPS ổn định'
      ],
      bulletsEn: [
        'Smooth tactile hover lift and subtle sheen sweep on buttons',
        'Subtle top accent color drift on lesson cards and panels',
        'Gentle cursor-dodge title motion and smooth 30 FPS canvas'
      ],
      previewLabelVi: 'Nút nâng nổi · Viền trôi dịu',
      previewLabelEn: 'Tactile Lift · Accent Drift'
    },
    ultra: {
      indexLabel: '03',
      subtitleVi: 'Animation siêu hiện đại · Sống động tương lai',
      subtitleEn: 'Ultra-modern futuristic holographic animations',
      bulletsVi: [
        'Tia quét laser hologram & luồng sáng tương lai trên mọi khung lớn',
        'Nút CTA phát sáng hào quang đa tầng & tự động quét ánh kim',
        'Kính mờ sâu (Glassmorphism), chữ né chuột mạnh & canvas 60 FPS'
      ],
      bulletsEn: [
        'Active holographic laser scan beams on headers and showcase panels',
        'Multi-layer luminous aura and periodic specular sweep on buttons',
        'Deep glassmorphism blur, lively cursor-dodge & full 60 FPS canvas'
      ],
      previewLabelVi: 'Hologram Quét Laser · 60 FPS',
      previewLabelEn: 'Holo Laser Beam · 60 FPS'
    }
  };

  const handleSelectTier = (tier: PerformanceMode) => {
    applyGraphicsTier(tier, syncSceneWithTier);
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75"
      onClick={closeGraphicsModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="graphics-tier-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[4px] bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 shadow-2xl text-slate-900 dark:text-slate-100"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[4px] bg-accent-solid flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2
                id="graphics-tier-modal-title"
                className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate"
              >
                {isEn
                  ? 'Graphics Quality & Animation Engine (3 Tiers)'
                  : 'Thiết Lập Đồ Họa & Hiệu Ứng Khung / Nút (3 Cấp Độ)'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isEn
                  ? 'First-load default is Low Graphics to guarantee fast entry on school PCs'
                  : 'Mặc định khi mới vào web luôn là Đồ họa Thấp để đảm bảo mượt trên mọi máy'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeGraphicsModal}
            className="w-8 h-8 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
            aria-label={isEn ? 'Close graphics setup' : 'Đóng thiết lập đồ họa'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Real Hardware Detection & Smart Recommendation Panel */}
          <div className="rounded-[4px] border border-sky-300 dark:border-sky-500/35 bg-sky-50/75 dark:bg-sky-950/30 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-sky-300">
                  <MonitorCheck className="w-3.5 h-3.5" />
                  <span>
                    {isEn ? 'Detected Device Hardware' : 'Phân tích Cấu hình Thiết bị'}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  CPU: {hardwareProfile.cores} {isEn ? 'threads' : 'luồng'}
                </span>
                <span className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  RAM:{' '}
                  {hardwareProfile.memoryGb
                    ? `~${hardwareProfile.memoryGb} GB`
                    : isEn
                    ? 'Private'
                    : 'Ẩn trình duyệt'}
                </span>
                {hardwareProfile.effectiveType && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-200 uppercase">
                    {hardwareProfile.effectiveType}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong className="text-blue-700 dark:text-sky-300">
                  {isEn ? 'Recommended:' : 'Gợi ý tối ưu:'}{' '}
                  {isEn ? recommendedOpt.shortEn : recommendedOpt.shortVi}
                </strong>{' '}
                — {isEn ? hardwareProfile.reasonEn : hardwareProfile.reasonVi}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectTier(hardwareProfile.recommendedMode)}
              disabled={perfMode === hardwareProfile.recommendedMode}
              className={`px-3.5 py-2 rounded-[4px] font-mono text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-all ${
                perfMode === hardwareProfile.recommendedMode
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 cursor-default'
                  : 'bg-blue-700 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 border border-transparent shadow-sm'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {perfMode === hardwareProfile.recommendedMode
                  ? isEn
                    ? 'Recommended Active'
                    : 'Đang dùng mức gợi ý'
                  : isEn
                  ? `Apply ${recommendedOpt.shortEn}`
                  : `Áp dụng ${recommendedOpt.shortVi}`}
              </span>
            </button>
          </div>

          {/* 3 Graphics Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {PERFORMANCE_MODE_OPTIONS.map((opt) => {
              const selected = opt.id === perfMode;
              const isRecommended = opt.id === hardwareProfile.recommendedMode;
              const detail = tierDetails[opt.id];

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectTier(opt.id)}
                  className={`relative rounded-[4px] border-2 p-4 text-left flex flex-col justify-between gap-3.5 transition-all cursor-pointer ${
                    selected
                      ? opt.id === 'ultra'
                        ? 'border-indigo-500 dark:border-cyan-400 bg-indigo-50/70 dark:bg-indigo-950/35 shadow-lg'
                        : opt.id === 'balanced'
                        ? 'border-sky-600 dark:border-sky-400 bg-sky-50/70 dark:bg-sky-950/30 shadow-md'
                        : 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/65 dark:bg-emerald-950/25 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/75 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Number + Status Labels */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-[4px] bg-slate-900 dark:bg-white text-white dark:text-slate-950">
                        {detail.indexLabel}
                      </span>

                      <div className="flex flex-wrap items-center justify-end gap-1">
                        {isRecommended && (
                          <span className="px-2 py-0.5 rounded-[4px] bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 font-mono text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300">
                            {isEn ? 'Suggested' : 'Gợi ý máy bạn'}
                          </span>
                        )}
                        {selected && (
                          <span className="px-2 py-0.5 rounded-[4px] bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{isEn ? 'Active' : 'Đang bật'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <div className="flex items-center gap-1.5 font-display text-sm font-bold text-slate-900 dark:text-white">
                        {opt.id === 'smooth' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {opt.id === 'balanced' && (
                          <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                        )}
                        {opt.id === 'ultra' && (
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400 shrink-0" />
                        )}
                        <span>{isEn ? opt.shortEn : opt.shortVi}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {isEn ? detail.subtitleEn : detail.subtitleVi}
                      </p>
                    </div>

                    {/* Live Mini Frame + Button Preview */}
                    <div
                      className={`relative overflow-hidden rounded-[4px] border p-2.5 space-y-2 ${
                        opt.id === 'ultra'
                          ? 'bg-slate-950 border-cyan-400/60 text-white'
                          : opt.id === 'balanced'
                          ? 'bg-slate-100 dark:bg-slate-900 border-sky-400/60 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {opt.id === 'balanced' && (
                        <div
                          aria-hidden="true"
                          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-teal-400 to-blue-500"
                        />
                      )}
                      {opt.id === 'ultra' && (
                        <>
                          <div
                            aria-hidden="true"
                            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400"
                          />
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-[sci-scanline-x_2.8s_linear_infinite]"
                          />
                        </>
                      )}

                      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                        <span className="opacity-85">
                          {isEn ? detail.previewLabelEn : detail.previewLabelVi}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-[2px] ${
                            opt.id === 'ultra'
                              ? 'bg-cyan-400 animate-pulse'
                              : opt.id === 'balanced'
                              ? 'bg-sky-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      <div
                        className={`relative z-10 px-2.5 py-1.5 rounded-[4px] border text-[11px] font-semibold flex items-center justify-between ${
                          opt.id === 'ultra'
                            ? 'bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-600 border-cyan-300/60 text-white shadow-[0_0_16px_-4px_rgba(34,211,238,0.65)]'
                            : opt.id === 'balanced'
                            ? 'bg-sky-600 border-sky-500 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span>{isEn ? 'Sample Action Button' : 'Nút mẫu giao diện'}</span>
                        <span className="font-mono text-[10px] opacity-85">→</span>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      {(isEn ? detail.bulletsEn : detail.bulletsVi).map((line, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 rounded-[1px] bg-sky-500 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer Action Indicator */}
                  <div
                    className={`pt-2 border-t border-slate-200/80 dark:border-slate-800 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-between ${
                      selected
                        ? 'text-blue-700 dark:text-sky-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span>
                      {selected
                        ? isEn
                          ? 'Currently Selected'
                          : 'Đang sử dụng'
                        : isEn
                        ? 'Click to Activate'
                        : 'Bấm để kích hoạt'}
                    </span>
                    <span>{selected ? '✓' : '→'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scene Synchronization Toggle & Footer */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={syncSceneWithTier}
                onChange={(e) => setSyncSceneWithTier(e.target.checked)}
                className="w-4 h-4 rounded-[3px] accent-sky-600 cursor-pointer"
              />
              <span>
                {isEn
                  ? `Auto-match background wallpaper & cursor-dodge effect (Current scene: ${bgStyle})`
                  : `Tự động chuyển nền động & chữ né chuột phù hợp (Nền hiện tại: ${bgStyle})`}
              </span>
            </label>

            <button
              type="button"
              onClick={closeGraphicsModal}
              className="px-5 py-2 rounded-[4px] bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs cursor-pointer self-end sm:self-auto"
            >
              {isEn ? 'Done' : 'Hoàn tất'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
