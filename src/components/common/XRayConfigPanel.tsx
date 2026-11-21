import React, { useRef, useState } from 'react';
import {
  Upload,
  RotateCcw,
  ArrowLeftRight,
  Image as ImageIcon,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { useLanguage } from '../../context/LanguageContext';

interface XRayConfigPanelProps {
  compact?: boolean;
}

export const XRayConfigPanel: React.FC<XRayConfigPanelProps> = ({ compact = false }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    xrayTopImage,
    xrayBottomImage,
    xrayHasCustomTop,
    xrayHasCustomBottom,
    xraySwapped,
    setXraySwapped,
    xrayMaskRadius,
    setXrayMaskRadius,
    xrayFitMode,
    setXrayFitMode,
    setXrayTopImageFile,
    setXrayBottomImageFile,
    resetXrayImage
  } = useBackgroundTheme();

  const topInputRef = useRef<HTMLInputElement | null>(null);
  const bottomInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [busySlot, setBusySlot] = useState<'top' | 'bottom' | null>(null);

  const handleFileChange = async (
    slot: 'top' | 'bottom',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    setBusySlot(slot);
    try {
      if (slot === 'top') {
        await setXrayTopImageFile(file);
      } else {
        await setXrayBottomImageFile(file);
      }
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : isEn
          ? 'Could not load image file.'
          : 'Không thể tải tệp ảnh này.'
      );
    } finally {
      setBusySlot(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Two-Layer Image Cards (Top Layer + Revealed X-Ray Layer) */}
      <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-1 sm:grid-cols-2 gap-3'}`}>
        {/* Top Layer */}
        <div className="rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/90 p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
              {isEn ? 'Top Layer (Cover)' : 'Ảnh lớp trên (Che phủ)'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
              {xrayHasCustomTop ? (isEn ? 'Custom' : 'Ảnh riêng') : isEn ? 'System' : 'Mặc định'}
            </span>
          </div>

          <div className="relative h-24 rounded-[4px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <img
              src={xrayTopImage}
              alt={isEn ? 'X-Ray top portrait layer' : 'Ảnh lớp trên X-Ray'}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <input
            ref={topInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange('top', e)}
            className="hidden"
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={busySlot === 'top'}
              onClick={() => topInputRef.current?.click()}
              className="flex-1 min-h-[32px] px-2.5 py-1 rounded-[4px] bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {busySlot === 'top'
                  ? isEn
                    ? 'Loading...'
                    : 'Đang nạp...'
                  : isEn
                  ? 'Upload Top'
                  : 'Tải ảnh trên'}
              </span>
            </button>
            {xrayHasCustomTop && (
              <button
                type="button"
                onClick={() => resetXrayImage('top')}
                className="min-h-[32px] px-2 py-1 rounded-[4px] border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title={isEn ? 'Restore system default top image' : 'Khôi phục ảnh mặc định lớp trên'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom / Reveal Layer */}
        <div className="rounded-[4px] border border-amber-300/70 dark:border-amber-500/40 bg-white dark:bg-slate-900/90 p-2.5 space-y-2">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
              {isEn ? 'Bottom Layer (X-Ray)' : 'Ảnh lớp dưới (Soi lộ)'}
            </span>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 shrink-0">
              {xrayHasCustomBottom ? (isEn ? 'Custom' : 'Ảnh riêng') : isEn ? 'System' : 'Mặc định'}
            </span>
          </div>

          <div className="relative h-24 rounded-[4px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-amber-200 dark:border-amber-500/30">
            <img
              src={xrayBottomImage}
              alt={isEn ? 'X-Ray bottom reveal layer' : 'Ảnh lớp dưới X-Ray'}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <input
            ref={bottomInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange('bottom', e)}
            className="hidden"
          />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={busySlot === 'bottom'}
              onClick={() => bottomInputRef.current?.click()}
              className="flex-1 min-h-[32px] px-2.5 py-1 rounded-[4px] bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <ImageIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {busySlot === 'bottom'
                  ? isEn
                    ? 'Loading...'
                    : 'Đang nạp...'
                  : isEn
                  ? 'Upload Reveal'
                  : 'Tải ảnh dưới'}
              </span>
            </button>
            {xrayHasCustomBottom && (
              <button
                type="button"
                onClick={() => resetXrayImage('bottom')}
                className="min-h-[32px] px-2 py-1 rounded-[4px] border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title={isEn ? 'Restore system default bottom image' : 'Khôi phục ảnh mặc định lớp dưới'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="px-2.5 py-1.5 rounded-[4px] border border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-700 text-[11px] font-medium text-rose-700 dark:text-rose-300">
          {uploadError}
        </div>
      )}

      {/* Controls: Swap Layers + Fit Mode + Restore */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setXraySwapped(!xraySwapped)}
          className={`min-h-[34px] px-3 py-1.5 rounded-[4px] border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
            xraySwapped
              ? 'bg-sky-600 border-sky-500 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-400'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
          <span>{isEn ? 'Switch portrait' : 'Đảo 2 lớp ảnh'}</span>
        </button>

        <button
          type="button"
          onClick={() => setXrayFitMode(xrayFitMode === 'cover' ? 'contain' : 'cover')}
          className="min-h-[34px] px-3 py-1.5 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-400 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer"
          title={
            isEn
              ? 'Toggle Full Cover vs Studio Framed fit'
              : 'Chuyển giữa phủ toàn màn hình (Cover) và khung chân dung (Studio)'
          }
        >
          {xrayFitMode === 'cover' ? (
            <Maximize2 className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Minimize2 className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{xrayFitMode === 'cover' ? (isEn ? 'Full Cover' : 'Phủ toàn màn') : 'Studio Fit'}</span>
        </button>

        {(xrayHasCustomTop || xrayHasCustomBottom || xraySwapped) && (
          <button
            type="button"
            onClick={() => resetXrayImage()}
            className="min-h-[34px] px-2.5 py-1.5 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'Restore Defaults' : 'Khôi phục ảnh gốc'}</span>
          </button>
        )}
      </div>

      {/* Mask Radius Slider */}
      <div className="flex items-center gap-3 pt-0.5">
        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
          {isEn ? 'X-Ray Beam Radius:' : 'Bán kính soi:'}{' '}
          <span className="font-mono tabular-nums text-slate-900 dark:text-white">
            {xrayMaskRadius}px
          </span>
        </label>
        <input
          type="range"
          min={40}
          max={220}
          step={5}
          value={xrayMaskRadius}
          onChange={(e) => setXrayMaskRadius(Number(e.target.value))}
          className="flex-1 accent-sky-600 cursor-pointer"
        />
      </div>
    </div>
  );
};
