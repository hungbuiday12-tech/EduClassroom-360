import React, { useRef, useState } from 'react';
import { ArrowLeftRight, Eye, RotateCcw, Upload } from 'lucide-react';
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
    xrayShowAura,
    setXrayShowAura,
    xraySwapped,
    setXraySwapped,
    xrayMaskRadius,
    setXrayMaskRadius,
    xrayFitMode,
    setXrayFitMode,
    setXrayTopImageFile,
    setXrayBottomImageFile,
    resetXrayImage,
  } = useBackgroundTheme();

  const topInputRef = useRef<HTMLInputElement>(null);
  const bottomInputRef = useRef<HTMLInputElement>(null);
  const [busySlot, setBusySlot] = useState<'top' | 'bottom' | null>(null);

  const handleUpload = async (slot: 'top' | 'bottom', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusySlot(slot);
    try {
      if (slot === 'top') await setXrayTopImageFile(file);
      else await setXrayBottomImageFile(file);
    } finally {
      setBusySlot(null);
    }
  };

  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-3'}>
      <div className={`grid grid-cols-2 ${compact ? 'gap-2' : 'gap-3'}`}>
        {/* Top Layer */}
        <div className="p-2 rounded border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/70 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
              {isEn ? 'Outer Layer (Top)' : 'Lớp ngoài (Trên)'}
            </span>
            {xrayHasCustomTop && (
              <button
                type="button"
                onClick={() => void resetXrayImage('top')}
                title={isEn ? 'Reset default' : 'Khôi phục mặc định'}
                className="text-[10px] text-amber-600 dark:text-amber-300 hover:underline cursor-pointer"
              >
                {isEn ? 'Reset' : 'Mặc định'}
              </button>
            )}
          </div>
          <div className="relative h-16 rounded overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
            <img
              src={xrayTopImage}
              alt={isEn ? 'Top layer preview' : 'Xem trước lớp trên'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            ref={topInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void handleUpload('top', e)}
            className="hidden"
          />
          <button
            type="button"
            disabled={busySlot === 'top'}
            onClick={() => topInputRef.current?.click()}
            className="w-full py-1 px-2 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>{busySlot === 'top' ? '...' : isEn ? 'Upload Top' : 'Chọn ảnh trên'}</span>
          </button>
        </div>

        {/* Bottom Layer */}
        <div className="p-2 rounded border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/70 space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
              {isEn ? 'Inner X-Ray Layer' : 'Lớp ẩn (Soi X-Ray)'}
            </span>
            {xrayHasCustomBottom && (
              <button
                type="button"
                onClick={() => void resetXrayImage('bottom')}
                title={isEn ? 'Reset default' : 'Khôi phục mặc định'}
                className="text-[10px] text-amber-600 dark:text-amber-300 hover:underline cursor-pointer"
              >
                {isEn ? 'Reset' : 'Mặc định'}
              </button>
            )}
          </div>
          <div className="relative h-16 rounded overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
            <img
              src={xrayBottomImage}
              alt={isEn ? 'Bottom layer preview' : 'Xem trước lớp ẩn'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            ref={bottomInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => void handleUpload('bottom', e)}
            className="hidden"
          />
          <button
            type="button"
            disabled={busySlot === 'bottom'}
            onClick={() => bottomInputRef.current?.click()}
            className="w-full py-1 px-2 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>{busySlot === 'bottom' ? '...' : isEn ? 'Upload Inner' : 'Chọn ảnh ẩn'}</span>
          </button>
        </div>
      </div>

      {/* Radius & quick toggles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
          <span>{isEn ? 'Lens Radius' : 'Bán kính soi'}:</span>
          <span className="font-mono tabular-nums font-bold">{xrayMaskRadius}px</span>
        </div>
        <input
          type="range"
          min={40}
          max={220}
          step={5}
          value={xrayMaskRadius}
          onChange={(e) => setXrayMaskRadius(Number(e.target.value))}
          className="w-full accent-sky-500 cursor-pointer"
        />

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setXraySwapped(!xraySwapped)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              xraySwapped
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white/80 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>{isEn ? 'Swap Layers' : 'Đảo 2 lớp'}</span>
          </button>

          <button
            type="button"
            onClick={() => setXrayShowAura(!xrayShowAura)}
            className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              xrayShowAura
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-white/80 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{isEn ? 'Scanner Ring' : 'Vòng hào quang'}</span>
          </button>

          <button
            type="button"
            onClick={() => setXrayFitMode(xrayFitMode === 'cover' ? 'contain' : 'cover')}
            className="px-2.5 py-1 rounded border bg-white/80 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer whitespace-nowrap"
          >
            {xrayFitMode === 'cover' ? (isEn ? 'Fit: Cover' : 'Phủ: Toàn màn') : isEn ? 'Fit: Contain' : 'Phủ: Vừa khung'}
          </button>

          {(xrayHasCustomTop || xrayHasCustomBottom || xraySwapped) && (
            <button
              type="button"
              onClick={() => void resetXrayImage()}
              className="px-2.5 py-1 rounded border border-rose-300 dark:border-rose-700 text-[11px] font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? 'Reset All' : 'Đặt lại'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
