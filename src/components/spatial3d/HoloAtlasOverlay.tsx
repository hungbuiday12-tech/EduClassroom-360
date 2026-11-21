import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Box,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Crosshair,
  Download,
  Eraser,
  Eye,
  EyeOff,
  FileDown,
  FlipHorizontal,
  Focus,
  Grid,
  Hand,
  Layers,
  Magnet,
  Maximize2,
  Minimize2,
  Orbit,
  PanelLeft,
  PanelRight,
  Pause,
  Play,
  QrCode,
  RotateCcw,
  Scan,
  ScanFace,
  Scissors,
  Search,
  SlidersHorizontal,
  Sparkles,
  Undo2,
  Users,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import type { ExplodablePartInfo } from './advancedModels3D';
import type { CustomSpatialModel } from './customModelTypes';
import {
  GESTURE_PRESETS,
  type GestureSettings,
  type HandGestureId,
  type HandTrackingFrame,
  REAL_GRAB_GESTURES
} from './handGestureTracker';
import type { CreativeBrushId, MaterialFinishId } from './SpatialGesture3DLab';
import { SpatialVoiceMentor } from './SpatialVoiceMentor';

export type QuickObsPresetId =
  | 'full'
  | 'xray'
  | 'explode'
  | 'row'
  | 'wireframe'
  | 'gold';

export type HoloCameraPresetId =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'focus_part'
  | 'overview';

export interface SpatialModelCatalogItem {
  id: string;
  group: 'realistic' | 'geometry' | 'simulation';
  titleVi: string;
  titleEn: string;
  formula: string;
  descVi: string;
  descEn: string;
  badge: string;
}

interface HoloAtlasOverlayProps {
  isEn: boolean;
  language: 'vi' | 'en';
  modes: SpatialModelCatalogItem[];
  customModels: CustomSpatialModel[];
  activeModeId: string;
  activeCustomId: string | null;
  activeModeMeta: SpatialModelCatalogItem;
  activeCustomModel: CustomSpatialModel | null;
  onSelectMode: (id: string) => void;
  onSelectCustomModel: (id: string) => void;
  onDeleteCustomModel: (id: string) => void;
  modelParts: ExplodablePartInfo[];
  selectedPartIdx: number | null;
  isolatedPartIdx: number | null;
  onSelectPart: (idx: number) => void;
  onToggleIsolatePart: (idx: number | null) => void;
  onFocusPart: (idx: number) => void;
  partVisibility: Record<number, boolean>;
  partOpacities: Record<number, number>;
  onTogglePartVisibility: (indices: number[], visible: boolean) => void;
  onChangeGroupOpacity: (indices: number[], opacityPct: number) => void;
  onShowAllParts: () => void;
  explodeVal: number;
  explodeStyle: 'radial' | 'row';
  onChangeExplode: (val: number, style?: 'radial' | 'row') => void;
  activeQuickPreset: QuickObsPresetId;
  onApplyQuickPreset: (preset: QuickObsPresetId) => void;
  activeCameraPreset: HoloCameraPresetId;
  onSelectCameraPreset: (preset: HoloCameraPresetId) => void;
  autoSpin: boolean;
  onToggleAutoSpin: () => void;
  frozen: boolean;
  onToggleFrozen: () => void;
  cameraActive: boolean;
  cameraLoading: boolean;
  cameraError: string | null;
  onToggleCamera: () => void;
  handFrame: HandTrackingFrame;
  virtualGesture: HandGestureId;
  onSelectVirtualGesture: (g: HandGestureId) => void;
  arMode: boolean;
  onToggleArMode: () => void;
  pointAskActive: boolean;
  onTogglePointAsk: () => void;
  hologramCockpitOn: boolean;
  onToggleHologramCockpit: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onHideHud: () => void;
  onSwitchTo2D: () => void;
  onOpenPortal: () => void;
  onOpenAICreator: () => void;
  onOpenRealScanner: () => void;
  onOpenCoop: () => void;
  onOpenRemoteQr: () => void;
  controllerCount: number;
  coopPeerCount: number;
  onBack?: () => void;
  mediaStream: MediaStream | null;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  mirrorCamera: boolean;
  // Extended 3D Studio Pro Tools (accessible in both normal & fullscreen mode)
  sliceEnabled?: boolean;
  sliceY?: number;
  onToggleSlice?: () => void;
  onChangeSliceY?: (y: number) => void;
  scaleVal?: number;
  onChangeScale?: (s: number) => void;
  heightVal?: number;
  onChangeHeight?: (h: number) => void;
  simSpeed?: number;
  onChangeSimSpeed?: (v: number) => void;
  showAxes?: boolean;
  onToggleShowAxes?: () => void;
  finish?: MaterialFinishId;
  onChangeFinish?: (f: MaterialFinishId) => void;
  finishOptions?: { id: MaterialFinishId; labelVi: string; labelEn: string }[];
  paletteId?: string;
  onChangePaletteId?: (id: string) => void;
  palettes?: { id: string; label: string; css: string }[];
  interactionStyle?: 'real_grab' | 'classic';
  onChangeInteractionStyle?: (s: 'real_grab' | 'classic') => void;
  creativeBrush?: CreativeBrushId;
  onChangeCreativeBrush?: (b: CreativeBrushId) => void;
  brushOptions?: { id: CreativeBrushId; labelVi: string; labelEn: string }[];
  snapGrid?: boolean;
  onToggleSnapGrid?: () => void;
  strokeCount?: number;
  markerCount?: number;
  onUndoStroke?: () => void;
  onClearCreations?: () => void;
  gestureSettings?: GestureSettings;
  onUpdateGestureSetting?: <K extends keyof GestureSettings>(key: K, val: GestureSettings[K]) => void;
  onApplyGesturePreset?: (patch: Partial<GestureSettings>, label: string) => void;
  onResetGestureDefaults?: () => void;
  onResetTracker?: () => void;
  musicPlaying?: boolean;
  onToggleMusic?: () => void;
  onSnapshot?: () => void;
  onExportOBJ?: () => void;
  onOpenGuide?: () => void;
  onResetView?: () => void;
  detachedPartCount?: number;
  onReassembleAll?: () => void;
}

const LAYER_COLORS = [
  '#22d3ee',
  '#34d399',
  '#f59e0b',
  '#818cf8',
  '#f472b6',
  '#38bdf8',
  '#a3e635'
];

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

export const HoloAtlasOverlay: React.FC<HoloAtlasOverlayProps> = ({
  isEn,
  language,
  modes,
  customModels,
  activeModeId,
  activeCustomId,
  activeModeMeta,
  activeCustomModel,
  onSelectMode,
  onSelectCustomModel,
  onDeleteCustomModel,
  modelParts,
  selectedPartIdx,
  isolatedPartIdx,
  onSelectPart,
  onToggleIsolatePart,
  onFocusPart,
  partVisibility,
  partOpacities,
  onTogglePartVisibility,
  onChangeGroupOpacity,
  onShowAllParts,
  explodeVal,
  explodeStyle,
  onChangeExplode,
  activeQuickPreset,
  onApplyQuickPreset,
  activeCameraPreset,
  onSelectCameraPreset,
  autoSpin,
  onToggleAutoSpin,
  frozen,
  onToggleFrozen,
  cameraActive,
  cameraLoading,
  cameraError,
  onToggleCamera,
  handFrame,
  virtualGesture,
  onSelectVirtualGesture,
  arMode,
  onToggleArMode,
  pointAskActive,
  onTogglePointAsk,
  hologramCockpitOn,
  onToggleHologramCockpit,
  isFullscreen,
  onToggleFullscreen,
  onHideHud,
  onSwitchTo2D,
  onOpenPortal,
  onOpenAICreator,
  onOpenRealScanner,
  onOpenCoop,
  onOpenRemoteQr,
  controllerCount,
  coopPeerCount,
  onBack,
  mediaStream,
  overlayCanvasRef,
  mirrorCamera,
  sliceEnabled = false,
  sliceY = 2.4,
  onToggleSlice,
  onChangeSliceY,
  scaleVal = 1.0,
  onChangeScale,
  heightVal = 1.0,
  onChangeHeight,
  simSpeed = 1.0,
  onChangeSimSpeed,
  showAxes = true,
  onToggleShowAxes,
  finish = 'ceramic',
  onChangeFinish,
  finishOptions = [],
  paletteId = 'cyan',
  onChangePaletteId,
  palettes = [],
  interactionStyle = 'real_grab',
  onChangeInteractionStyle,
  creativeBrush = 'tube',
  onChangeCreativeBrush,
  brushOptions = [],
  snapGrid = false,
  onToggleSnapGrid,
  strokeCount = 0,
  markerCount = 0,
  onUndoStroke,
  onClearCreations,
  gestureSettings,
  onUpdateGestureSetting,
  onApplyGesturePreset,
  onResetGestureDefaults,
  onResetTracker,
  musicPlaying = false,
  onToggleMusic,
  onSnapshot,
  onExportOBJ,
  onOpenGuide,
  onResetView,
  detachedPartCount = 0,
  onReassembleAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [showGesturesDrawer, setShowGesturesDrawer] = useState(false);
  const [toolsDrawerOpen, setToolsDrawerOpen] = useState(false);
  const [toolsTab, setToolsTab] = useState<'transform' | 'style' | 'sculpt' | 'sensor'>('transform');

  const activeTitle = activeCustomModel
    ? isEn
      ? activeCustomModel.titleEn
      : activeCustomModel.titleVi
    : isEn
    ? activeModeMeta.titleEn
    : activeModeMeta.titleVi;

  const activeFormula = activeCustomModel ? activeCustomModel.formula : activeModeMeta.formula;

  const visibleCount = useMemo(() => {
    if (modelParts.length === 0) return 0;
    return modelParts.reduce(
      (acc, _p, idx) => acc + (partVisibility[idx] !== false ? 1 : 0),
      0
    );
  }, [modelParts, partVisibility]);

  // Group parts by badgeVi/badgeEn (or consolidate tiny 1-part badges into coherent structural groups)
  const partGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map = new Map<string, { key: string; label: string; indices: number[] }>();

    modelParts.forEach((p, idx) => {
      const label = (isEn ? p.badgeEn : p.badgeVi) || (isEn ? 'Component' : 'Cấu tạo');
      const normName = `${p.nameVi} ${p.nameEn} ${label}`.toLowerCase();
      if (q && !normName.includes(q)) return;

      // Group numbered sides/levels/orbits cleanly (e.g. "Mặt bên 1/4" -> "Mặt bên", "QUỸ ĐẠO 1" -> "Quỹ đạo")
      let groupLabel = label
        .replace(/\s*\d+\/\d+$/, '')
        .replace(/\s+S\d+$/, '')
        .replace(/\s+n=\d+$/, '')
        .replace(/\s+\d+$/, '')
        .trim();
      if (!groupLabel) groupLabel = label;

      const existing = map.get(groupLabel);
      if (existing) {
        existing.indices.push(idx);
      } else {
        map.set(groupLabel, { key: groupLabel, label: groupLabel, indices: [idx] });
      }
    });

    return Array.from(map.values()).map((g, gIdx) => {
      const color = LAYER_COLORS[gIdx % LAYER_COLORS.length];
      const allVisible = g.indices.some((i) => partVisibility[i] !== false);
      const avgOpacity =
        g.indices.length > 0
          ? Math.round(
              g.indices.reduce((sum, i) => sum + (partOpacities[i] ?? 100), 0) / g.indices.length
            )
          : 100;
      return {
        ...g,
        color,
        allVisible,
        avgOpacity
      };
    });
  }, [modelParts, searchQuery, isEn, partVisibility, partOpacities]);

  const filteredModes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return modes;
    return modes.filter((m) =>
      `${m.titleVi} ${m.titleEn} ${m.badge} ${m.descVi}`.toLowerCase().includes(q)
    );
  }, [modes, searchQuery]);

  const filteredCustomModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customModels;
    return customModels.filter((m) =>
      `${m.titleVi} ${m.titleEn} ${m.badge || ''}`.toLowerCase().includes(q)
    );
  }, [customModels, searchQuery]);

  const currentSelectedIdx =
    isolatedPartIdx !== null
      ? isolatedPartIdx
      : selectedPartIdx !== null && modelParts[selectedPartIdx]
      ? selectedPartIdx
      : modelParts.length > 0
      ? 0
      : null;

  const inspectedPart =
    currentSelectedIdx !== null ? modelParts[currentSelectedIdx] || null : null;

  const explodePct = Math.round(Math.min(100, (explodeVal / 1.25) * 100));

  const activeGestureId =
    cameraActive && handFrame.detected ? handFrame.gesture : virtualGesture;
  const currentGestureMeta =
    REAL_GRAB_GESTURES.find((g) => g.id === activeGestureId) || REAL_GRAB_GESTURES[0];

  const handleStepPart = (delta: number) => {
    if (modelParts.length === 0) return;
    const base = currentSelectedIdx ?? 0;
    const next = (base + delta + modelParts.length) % modelParts.length;
    onSelectPart(next);
    if (isolatedPartIdx !== null) {
      onToggleIsolatePart(next);
    }
  };

  const quickPresets: { id: QuickObsPresetId; labelVi: string; labelEn: string }[] = [
    { id: 'full', labelVi: 'Toàn mô hình', labelEn: 'Full Model' },
    { id: 'xray', labelVi: 'X-Quang lớp', labelEn: 'X-Ray Layers' },
    { id: 'explode', labelVi: 'Tách lớp 3D', labelEn: 'Explode 3D' },
    { id: 'row', labelVi: 'Hàng ngang', labelEn: 'Row Align' },
    { id: 'wireframe', labelVi: 'Lưới Neon', labelEn: 'Neon Mesh' },
    { id: 'gold', labelVi: 'Kim loại Pro', labelEn: 'Pro Metal' }
  ];

  const cameraButtons: { id: HoloCameraPresetId; labelVi: string; labelEn: string }[] = [
    { id: 'front', labelVi: 'Trước', labelEn: 'Front' },
    { id: 'back', labelVi: 'Sau', labelEn: 'Back' },
    { id: 'left', labelVi: 'Trái', labelEn: 'Left' },
    { id: 'right', labelVi: 'Phải', labelEn: 'Right' },
    { id: 'top', labelVi: 'Trên', labelEn: 'Top' },
    { id: 'focus_part', labelVi: 'Cận cảnh', labelEn: 'Focus' },
    { id: 'overview', labelVi: 'Toàn mô hình', labelEn: 'Overview' }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none text-slate-100">
      {/* TOP BAR: LEFT BRAND BADGE & RIGHT BIO-LAB HUD CLUSTER */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex flex-wrap items-start justify-between gap-1.5 sm:gap-2">
        {/* Top-Left Holographic Title Card */}
        <div className="pointer-events-auto flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 rounded-xl border border-cyan-500/30 bg-[#050d1c]/94 px-2.5 sm:px-3.5 py-1.5 sm:py-2 shadow-[0_8px_30px_rgba(0,0,0,0.6)] max-w-full">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/45 bg-cyan-500/15 text-cyan-300">
            <Crosshair className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-display text-xs sm:text-base font-extrabold tracking-wide text-white uppercase">
                {isEn ? 'ATLAS 3D HAND & MODEL LAB' : 'ATLAS MÔ HÌNH 3D TƯƠNG TÁC TAY'}
              </h2>
            </div>
            <div className="truncate font-mono text-[9.5px] sm:text-[10px] font-semibold tracking-wider text-cyan-400 uppercase tabular-nums">
              {isEn
                ? `BIO-LAB SPECIMEN · ${modelParts.length} PARTS · ${15 + customModels.length} MODELS`
                : `BIO-LAB SPECIMEN · ${modelParts.length} BỘ PHẬN · ${15 + customModels.length} MÔ HÌNH`}
            </div>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2 shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[34px] flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900/90 px-2 py-1 text-[11px] font-bold text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200 cursor-pointer"
                title={isEn ? 'Back' : 'Quay lại'}
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="hidden sm:inline">{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onSwitchTo2D}
              className="min-h-[34px] flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900/90 px-2 py-1 text-[11px] font-bold text-cyan-300 hover:border-cyan-400 cursor-pointer"
              title={isEn ? 'Switch to 2D Geometry Lab' : 'Chuyển sang Không gian 2D'}
            >
              <Compass className="h-3 w-3" />
              <span>2D</span>
            </button>
            <button
              type="button"
              onClick={onOpenPortal}
              className="min-h-[34px] flex items-center gap-1 rounded-md border border-slate-700/80 bg-slate-900/90 px-2 py-1 text-[11px] font-bold text-slate-300 hover:border-cyan-400 hover:text-white cursor-pointer"
              title={isEn ? 'Open Spatial Guide Portal' : 'Mở Trang Giới thiệu & Hướng dẫn'}
            >
              <Layers className="h-3 w-3" />
              <span>Hub</span>
            </button>
          </div>
        </div>

        {/* Top-Right Bio-Lab Waveform + Visibility Counter + Quick Tools */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-start sm:justify-end gap-1.5 max-w-full">
          {/* Live Hand / Sensor Waveform Pill (Matches ECG pill in screenshot) */}
          <button
            type="button"
            onClick={onToggleCamera}
            disabled={cameraLoading}
            className={`min-h-[36px] flex items-center gap-2 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold shadow-lg transition-colors cursor-pointer ${
              cameraActive
                ? 'border-emerald-400/60 bg-[#05141c]/95 text-emerald-300'
                : 'border-cyan-500/30 bg-[#050d1c]/92 text-slate-100 hover:border-cyan-400/70'
            }`}
            title={
              isEn
                ? 'Toggle 10-Fingertip Webcam Hand Control'
                : 'Bật / Tắt Điều khiển Tay 3D 10 ngón qua Webcam'
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                cameraActive ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
              data-circle="true"
            />
            <svg width="40" height="14" viewBox="0 0 46 16" className="hidden sm:block shrink-0">
              <polyline
                fill="none"
                stroke={cameraActive ? '#34d399' : '#fb7185'}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,8 8,8 11,3 14,13 17,2 20,14 23,8 30,8 33,4 36,12 39,8 46,8"
              />
            </svg>
            <span className="tabular-nums whitespace-nowrap text-[11px] sm:text-xs">
              {cameraLoading
                ? isEn
                  ? 'CAM...'
                  : 'ĐANG MỞ...'
                : cameraActive
                ? handFrame.detected
                  ? `${handFrame.trackedTipCount}/10 NGÓN`
                  : isEn
                  ? 'SHOW HAND'
                  : 'ĐƯA TAY VÀO'
                : isEn
                ? 'HAND 3D'
                : 'TAY 3D · CAM'}
            </span>
          </button>

          {/* HIỂN THỊ X / Y Counter Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-[#050d1c]/92 px-3 py-2 font-mono text-xs font-bold text-slate-200 shadow-lg tabular-nums">
            <span className="text-slate-400 text-[10px] tracking-wider uppercase">
              {isEn ? 'VISIBLE' : 'HIỂN THỊ'}
            </span>
            <span className="text-cyan-300">
              {visibleCount} / {modelParts.length}
            </span>
          </div>

          {/* Compact Holographic Action Icons */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-cyan-500/25 bg-[#050d1c]/94 p-1 shadow-lg max-w-full">
            <button
              type="button"
              onClick={onOpenAICreator}
              className="p-1.5 rounded-lg text-purple-300 hover:bg-purple-500/20 cursor-pointer"
              title={isEn ? 'Create AI 3D Model' : 'Tạo Mô Hình AI 3D'}
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenRealScanner}
              className="p-1.5 rounded-lg text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
              title={isEn ? 'Scan Real Object → 3D' : 'Quét Đồ Vật Thực Tế → 3D'}
            >
              <Scan className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleArMode}
              className={`p-1.5 rounded-lg cursor-pointer ${
                arMode ? 'bg-emerald-500 text-slate-950' : 'text-emerald-300 hover:bg-emerald-500/20'
              }`}
              title={isEn ? 'WebAR Desk Pro' : 'AR Bàn Học Pro'}
            >
              <Camera className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onTogglePointAsk}
              className={`p-1.5 rounded-lg cursor-pointer ${
                pointAskActive ? 'bg-amber-400 text-slate-950' : 'text-amber-300 hover:bg-amber-500/20'
              }`}
              title={isEn ? 'Point & Ask AI' : 'Chỉ & Hỏi AI'}
            >
              <Crosshair className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleHologramCockpit}
              className={`p-1.5 rounded-lg cursor-pointer ${
                hologramCockpitOn ? 'bg-cyan-400 text-slate-950' : 'text-sky-300 hover:bg-sky-500/20'
              }`}
              title={isEn ? 'Hologram Eye/Head Parallax' : 'Hologram Mắt/Đầu'}
            >
              <ScanFace className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenCoop}
              className={`relative p-1.5 rounded-lg cursor-pointer ${
                coopPeerCount > 0 ? 'bg-emerald-500/25 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={isEn ? 'Co-op Virtual Hands' : 'Bạn Học 3D (Co-op)'}
            >
              <Users className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenRemoteQr}
              className={`relative p-1.5 rounded-lg cursor-pointer ${
                controllerCount > 0 ? 'bg-emerald-500/25 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={isEn ? 'QR Phone Remote' : 'QR Điều khiển 3D'}
            >
              <QrCode className="h-4 w-4" />
            </button>
            {onToggleMusic && (
              <button
                type="button"
                onClick={onToggleMusic}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  musicPlaying
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                title={isEn ? 'Toggle Study Music' : 'Bật/Tắt Nhạc nền Piano'}
              >
                {musicPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}
            {onSnapshot && (
              <button
                type="button"
                onClick={onSnapshot}
                className="p-1.5 rounded-lg text-sky-300 hover:bg-sky-500/20 cursor-pointer"
                title={isEn ? 'Save 3D PNG Snapshot' : 'Chụp ảnh 3D (.PNG)'}
              >
                <Download className="h-4 w-4" />
              </button>
            )}
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                title={isEn ? '3D Gesture Guide' : 'Hướng dẫn Cử chỉ 3D'}
              >
                <BookOpen className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setToolsDrawerOpen((v) => !v)}
              className={`p-1.5 rounded-lg cursor-pointer ${
                toolsDrawerOpen
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-cyan-300 hover:bg-cyan-500/20'
              }`}
              title={
                isEn
                  ? 'All 3D Pro Tools, Slice, Material & Sensor Settings'
                  : 'Toàn bộ Công cụ 3D (Mặt cắt, Chất liệu, Bút 3D & Cảm biến)'
              }
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`p-1.5 rounded-lg cursor-pointer ${
                isFullscreen
                  ? 'bg-cyan-500/25 text-cyan-300'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              title={isEn ? 'Fullscreen' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onHideHud}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
              title={isEn ? 'Hide HUD (H)' : 'Ẩn giao diện (H)'}
            >
              <EyeOff className="h-4 w-4" />
            </button>
          </div>

          {/* Right Panel Toggle Icon (Matches top-right square button in screenshot) */}
          <button
            type="button"
            onClick={() => setRightOpen((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
              rightOpen
                ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-300'
                : 'border-cyan-500/30 bg-[#050d1c]/92 text-slate-300 hover:border-cyan-400'
            }`}
            title={isEn ? 'Toggle Inspector Panel' : 'Bật/Tắt Bảng Thông Tin Chi Tiết'}
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ALL-IN-ONE PRO TOOLS & SENSOR SETTINGS DRAWER (Accessible in Normal & Fullscreen Mode) */}
      {toolsDrawerOpen && (
        <div className="pointer-events-auto absolute top-[116px] sm:top-[66px] right-2.5 sm:right-3 z-40 w-[min(392px,calc(100vw-20px))] max-h-[calc(100vh-175px)] flex flex-col rounded-2xl border border-cyan-400/45 bg-[#050d1c]/96 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 px-3.5 py-2.5 bg-[#040a16]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-extrabold tracking-wide text-white uppercase">
                {isEn ? '3D Pro Tools & Settings' : 'Công Cụ & Cài Đặt 3D Pro'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setToolsDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Close tools drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 border-b border-slate-800 p-2 bg-[#061020]">
            {(
              [
                { id: 'transform', vi: 'Cắt & Tỷ lệ', en: 'Transform' },
                { id: 'style', vi: 'Chất liệu', en: 'Material' },
                { id: 'sculpt', vi: 'Sáng tạo', en: 'Sculpt 3D' },
                { id: 'sensor', vi: 'Cảm biến', en: 'Sensor' }
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setToolsTab(t.id)}
                className={`rounded-lg py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  toolsTab === t.id
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {isEn ? t.en : t.vi}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs scrollbar-thin">
            {toolsTab === 'transform' && (
              <>
                <div className="rounded-xl border border-slate-800 bg-[#081325] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Scissors className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Cross-Section Slice Y' : 'Mặt Cắt Ngang Y (Slice)'}</span>
                    </span>
                    {onToggleSlice && (
                      <button
                        type="button"
                        onClick={onToggleSlice}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold cursor-pointer ${
                          sliceEnabled
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {sliceEnabled ? (isEn ? 'ON' : 'ĐANG BẬT') : isEn ? 'OFF' : 'TẮT'}
                      </button>
                    )}
                  </div>
                  {onChangeSliceY && (
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={-1.5}
                        max={3.5}
                        step={0.05}
                        value={sliceY}
                        onChange={(e) => onChangeSliceY(Number(e.target.value))}
                        className="flex-1 accent-amber-400 cursor-pointer"
                      />
                      <span className="w-12 text-right font-mono text-[11px] text-amber-200 tabular-nums">
                        y={sliceY.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#081325] p-3 space-y-2.5">
                  {onChangeScale && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">{isEn ? 'Model Scale' : 'Tỷ lệ kích thước'}</span>
                        <span className="font-mono text-cyan-300 tabular-nums">{scaleVal.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.45}
                        max={2.4}
                        step={0.05}
                        value={scaleVal}
                        onChange={(e) => onChangeScale(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                  )}
                  {onChangeHeight && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">{isEn ? 'Vertical Elevation' : 'Độ cao trục Y'}</span>
                        <span className="font-mono text-sky-300 tabular-nums">{heightVal.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.4}
                        max={1.8}
                        step={0.05}
                        value={heightVal}
                        onChange={(e) => onChangeHeight(Number(e.target.value))}
                        className="w-full accent-sky-400 cursor-pointer"
                      />
                    </div>
                  )}
                  {onChangeSimSpeed && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">{isEn ? 'Kinematics Speed' : 'Tốc độ mô phỏng'}</span>
                        <span className="font-mono text-emerald-300 tabular-nums">{simSpeed.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={2.5}
                        step={0.1}
                        value={simSpeed}
                        onChange={(e) => onChangeSimSpeed(Number(e.target.value))}
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {onToggleShowAxes && (
                    <button
                      type="button"
                      onClick={onToggleShowAxes}
                      className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-bold cursor-pointer ${
                        showAxes
                          ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200'
                          : 'border-slate-700 bg-slate-900 text-slate-300'
                      }`}
                    >
                      <Grid className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Oxyz Grid' : 'Hệ trục Oxyz'}</span>
                    </button>
                  )}
                  {onResetView && (
                    <button
                      type="button"
                      onClick={onResetView}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-400 py-2 text-[11px] font-bold text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Reset Model' : 'Đặt lại tất cả'}</span>
                    </button>
                  )}
                  {detachedPartCount > 0 && onReassembleAll && (
                    <button
                      type="button"
                      onClick={onReassembleAll}
                      className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/60 bg-emerald-500/20 py-2 text-[11px] font-bold text-emerald-200 cursor-pointer"
                    >
                      <Orbit className="h-3.5 w-3.5" />
                      <span>
                        {isEn
                          ? `Reassemble ${detachedPartCount} Detached Parts`
                          : `Lắp khít ${detachedPartCount} chi tiết đã tách`}
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}

            {toolsTab === 'style' && (
              <>
                {finishOptions.length > 0 && onChangeFinish && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Surface Finish' : 'Chất liệu bề mặt 3D'}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {finishOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onChangeFinish(opt.id)}
                          className={`rounded-xl border px-2.5 py-2 text-[11px] font-bold cursor-pointer ${
                            finish === opt.id
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                              : 'border-slate-800 bg-[#081325] text-slate-300 hover:border-cyan-500/40'
                          }`}
                        >
                          {isEn ? opt.labelEn : opt.labelVi}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {palettes.length > 0 && onChangePaletteId && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Hologram Accent Color' : 'Màu sắc chủ đạo'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {palettes.map((pal) => (
                        <button
                          key={pal.id}
                          type="button"
                          onClick={() => onChangePaletteId(pal.id)}
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold cursor-pointer ${
                            paletteId === pal.id
                              ? 'border-white bg-slate-800 text-white'
                              : 'border-slate-800 bg-[#081325] text-slate-300'
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full"
                            data-circle="true"
                            style={{ backgroundColor: pal.css }}
                          />
                          <span>{pal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {onSnapshot && (
                    <button
                      type="button"
                      onClick={onSnapshot}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-cyan-500/15 py-2 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/25 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Save PNG' : 'Chụp ảnh PNG'}</span>
                    </button>
                  )}
                  {onExportOBJ && (
                    <button
                      type="button"
                      onClick={onExportOBJ}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-400/50 bg-purple-500/15 py-2 text-[11px] font-bold text-purple-200 hover:bg-purple-500/25 cursor-pointer"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Export .OBJ' : 'Xuất mô hình .OBJ'}</span>
                    </button>
                  )}
                  {onToggleMusic && (
                    <button
                      type="button"
                      onClick={onToggleMusic}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2 text-[11px] font-bold text-slate-200 hover:border-emerald-400 cursor-pointer"
                    >
                      {musicPlaying ? <Volume2 className="h-3.5 w-3.5 text-emerald-400" /> : <VolumeX className="h-3.5 w-3.5" />}
                      <span>{musicPlaying ? (isEn ? 'Music ON' : 'Đang phát nhạc') : isEn ? 'Music OFF' : 'Bật nhạc nền'}</span>
                    </button>
                  )}
                  {onOpenGuide && (
                    <button
                      type="button"
                      onClick={() => {
                        setToolsDrawerOpen(false);
                        onOpenGuide();
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2 text-[11px] font-bold text-emerald-300 hover:border-emerald-400 cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{isEn ? '3D Guide' : 'Hướng dẫn 3D'}</span>
                    </button>
                  )}
                </div>
              </>
            )}

            {toolsTab === 'sculpt' && (
              <>
                {onChangeInteractionStyle && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Hand Interaction Style' : 'Phong cách tương tác tay 3D'}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onChangeInteractionStyle('real_grab')}
                        className={`rounded-xl border px-2.5 py-2 text-[11px] font-bold cursor-pointer ${
                          interactionStyle === 'real_grab'
                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                            : 'border-slate-800 bg-[#081325] text-slate-300'
                        }`}
                      >
                        {isEn ? 'Real Grab (5 Gestures)' : 'Cầm Nắm Thực Tế (5 cử chỉ)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeInteractionStyle('classic')}
                        className={`rounded-xl border px-2.5 py-2 text-[11px] font-bold cursor-pointer ${
                          interactionStyle === 'classic'
                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                            : 'border-slate-800 bg-[#081325] text-slate-300'
                        }`}
                      >
                        {isEn ? 'Classic (8 Gestures)' : 'Cổ Điển (8 cử chỉ)'}
                      </button>
                    </div>
                  </div>
                )}

                {brushOptions.length > 0 && onChangeCreativeBrush && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {isEn ? '1-Finger 3D Sculpt Brush' : 'Bút vẽ & dựng khối 3D (1 Ngón)'}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {brushOptions.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => onChangeCreativeBrush(b.id)}
                          className={`rounded-xl border px-2.5 py-1.5 text-[11px] font-bold cursor-pointer ${
                            creativeBrush === b.id
                              ? 'border-purple-400 bg-purple-500/20 text-purple-200'
                              : 'border-slate-800 bg-[#081325] text-slate-300'
                          }`}
                        >
                          {isEn ? b.labelEn : b.labelVi}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {onToggleSnapGrid && (
                    <button
                      type="button"
                      onClick={onToggleSnapGrid}
                      className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-[11px] font-bold cursor-pointer ${
                        snapGrid
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                          : 'border-slate-700 bg-slate-900 text-slate-300'
                      }`}
                    >
                      <Magnet className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Snap Oxyz Grid' : 'Bắt lưới tọa độ'}</span>
                    </button>
                  )}
                  {onUndoStroke && (
                    <button
                      type="button"
                      onClick={onUndoStroke}
                      disabled={strokeCount + markerCount === 0}
                      className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900 disabled:opacity-40 px-3 py-1.5 text-[11px] font-bold text-slate-200 cursor-pointer"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      <span>{isEn ? `Undo (${strokeCount + markerCount})` : `Hoàn tác (${strokeCount + markerCount})`}</span>
                    </button>
                  )}
                  {onClearCreations && (
                    <button
                      type="button"
                      onClick={onClearCreations}
                      disabled={strokeCount + markerCount === 0}
                      className="flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-950/50 disabled:opacity-40 px-3 py-1.5 text-[11px] font-bold text-rose-200 cursor-pointer"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                      <span>{isEn ? 'Clear 3D' : 'Xóa nét vẽ'}</span>
                    </button>
                  )}
                </div>
              </>
            )}

            {toolsTab === 'sensor' && gestureSettings && onUpdateGestureSetting && (
              <>
                {onApplyGesturePreset && (
                  <div className="flex flex-wrap gap-1.5">
                    {GESTURE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          onApplyGesturePreset(
                            preset.patch,
                            isEn ? preset.labelEn : preset.labelVi
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 hover:border-cyan-400 px-2.5 py-1 text-[11px] font-semibold text-slate-200 cursor-pointer"
                      >
                        {isEn ? preset.labelEn : preset.labelVi}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-2 rounded-xl border border-slate-800 bg-[#081325] p-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{isEn ? 'Pinch Sensitivity' : 'Độ nhạy Chụm ngón'}</span>
                      <span className="font-mono text-amber-300">{gestureSettings.pinchSensitivity.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={1.6}
                      step={0.05}
                      value={gestureSettings.pinchSensitivity}
                      onChange={(e) => onUpdateGestureSetting('pinchSensitivity', Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{isEn ? '10-Tip Smoothing' : 'Độ mượt 10 Ngón'}</span>
                      <span className="font-mono text-cyan-300">{Math.round(gestureSettings.smoothing * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.9}
                      step={0.05}
                      value={gestureSettings.smoothing}
                      onChange={(e) => onUpdateGestureSetting('smoothing', Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300">{isEn ? '3D Rotation Speed' : 'Tốc độ xoay 3D'}</span>
                      <span className="font-mono text-sky-300">{gestureSettings.rotationSensitivity.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={4.0}
                      step={0.1}
                      value={gestureSettings.rotationSensitivity}
                      onChange={(e) => onUpdateGestureSetting('rotationSensitivity', Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateGestureSetting('mirrorCamera', !gestureSettings.mirrorCamera)}
                    className={`flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[11px] font-bold cursor-pointer ${
                      gestureSettings.mirrorCamera
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    <FlipHorizontal className="h-3 w-3" />
                    <span>{isEn ? 'Mirror' : 'Gương'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateGestureSetting('invertX', !gestureSettings.invertX)}
                    className={`rounded-lg border py-1.5 text-[11px] font-bold cursor-pointer ${
                      gestureSettings.invertX
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {isEn ? 'Invert X' : 'Đảo X'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateGestureSetting('invertY', !gestureSettings.invertY)}
                    className={`rounded-lg border py-1.5 text-[11px] font-bold cursor-pointer ${
                      gestureSettings.invertY
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                        : 'border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {isEn ? 'Invert Y' : 'Đảo Y'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {onResetTracker && (
                    <button
                      type="button"
                      onClick={onResetTracker}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 py-1.5 text-[11px] font-bold text-slate-200 hover:border-cyan-400 cursor-pointer"
                    >
                      {isEn ? 'Reset Hand Lock' : 'Reset Khóa 10 Ngón'}
                    </button>
                  )}
                  {onResetGestureDefaults && (
                    <button
                      type="button"
                      onClick={onResetGestureDefaults}
                      className="flex-1 rounded-lg border border-rose-500/40 bg-rose-950/40 py-1.5 text-[11px] font-bold text-rose-200 cursor-pointer"
                    >
                      {isEn ? 'Defaults' : 'Mặc định'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* RESPONSIVE & COLLAPSE TOGGLE FOR LEFT DRAWER (Always visible on mobile, or when collapsed on desktop) */}
      <button
        type="button"
        onClick={() => setLeftOpen((v) => !v)}
        className={`pointer-events-auto absolute top-[72px] left-3 z-30 flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-[#050d1c]/95 px-2.5 py-1.5 text-[11px] font-bold text-cyan-300 shadow-lg cursor-pointer ${
          leftOpen ? 'lg:hidden' : ''
        }`}
      >
        <PanelLeft className="h-3.5 w-3.5" />
        <span>{leftOpen ? (isEn ? 'Hide Panel' : 'Ẩn bảng') : isEn ? 'Models & Layers' : 'Mô hình & Lớp'}</span>
      </button>

      {/* LEFT FLOATING CONTROL PANEL (EXACT BIO-LAB HOLOGRAPHIC STYLE FROM SCREENSHOT) */}
      {leftOpen && (
        <aside className="pointer-events-auto absolute top-[106px] lg:top-[76px] bottom-[88px] left-3 w-[274px] sm:w-[292px] flex flex-col rounded-2xl border border-cyan-500/25 bg-[#050c19]/92 shadow-[0_16px_50px_rgba(0,0,0,0.75)] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search model or part...' : 'Tìm mô hình / bộ phận...'}
                className="w-full rounded-xl border border-slate-700/80 bg-[#091426] py-2 pl-9 pr-7 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-400/70 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* ACTIVE 3D MODEL SELECTOR (REPLACES HUMAN BODY WITH SWITCHABLE 3D MODELS) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                <span>{isEn ? `3D SPECIMEN MODEL (${15 + customModels.length})` : `MÔ HÌNH 3D (${15 + customModels.length})`}</span>
                <button
                  type="button"
                  onClick={() => setModelPickerOpen((v) => !v)}
                  className="text-cyan-400 hover:text-cyan-300 font-sans normal-case font-bold cursor-pointer"
                >
                  {modelPickerOpen ? (isEn ? 'Close' : 'Thu gọn') : isEn ? 'Change Model' : 'Đổi mô hình'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setModelPickerOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-cyan-400/45 bg-cyan-950/30 px-3 py-2 text-left hover:border-cyan-300 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                    {activeCustomModel
                      ? `AI · ${activeCustomModel.badge || 'CUSTOM'}`
                      : activeModeMeta.badge}
                  </div>
                  <div className="truncate text-xs font-extrabold text-white">
                    {activeTitle}
                  </div>
                </div>
                {modelPickerOpen ? (
                  <ChevronUp className="h-4 w-4 text-cyan-300 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-cyan-300 shrink-0" />
                )}
              </button>

              {modelPickerOpen && (
                <div className="max-h-[225px] overflow-y-auto space-y-1 rounded-xl border border-slate-800 bg-[#040a15] p-1.5">
                  <div className="grid grid-cols-2 gap-1 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModelPickerOpen(false);
                        onOpenAICreator();
                      }}
                      className="flex items-center justify-center gap-1 rounded-lg bg-purple-600/85 hover:bg-purple-500 px-2 py-1.5 text-[11px] font-bold text-white cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{isEn ? '+ AI Model' : '+ Tạo AI 3D'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModelPickerOpen(false);
                        onOpenRealScanner();
                      }}
                      className="flex items-center justify-center gap-1 rounded-lg bg-cyan-500/85 hover:bg-cyan-400 px-2 py-1.5 text-[11px] font-bold text-slate-950 cursor-pointer"
                    >
                      <Scan className="h-3 w-3" />
                      <span>{isEn ? 'Scan Object' : 'Quét thực tế'}</span>
                    </button>
                  </div>
                  {filteredCustomModels.map((cm) => {
                    const active = activeCustomId === cm.id;
                    return (
                      <div
                        key={cm.id}
                        className={`w-full flex items-center justify-between gap-1 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                          active
                            ? 'bg-purple-500/20 border border-purple-400/60 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCustomModel(cm.id);
                            setModelPickerOpen(false);
                          }}
                          className="min-w-0 flex-1 truncate text-left cursor-pointer"
                        >
                          {isEn ? cm.titleEn : cm.titleVi}
                        </button>
                        <span className="text-[9px] font-mono text-purple-300 shrink-0">AI</span>
                        <button
                          type="button"
                          onClick={() => onDeleteCustomModel(cm.id)}
                          className="p-0.5 text-slate-500 hover:text-rose-400 cursor-pointer shrink-0"
                          title={isEn ? 'Delete model' : 'Xóa mô hình'}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                  {filteredModes.map((m) => {
                    const active = !activeCustomId && activeModeId === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onSelectMode(m.id);
                          setModelPickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                          active
                            ? 'bg-cyan-500/20 border border-cyan-400/60 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                        }`}
                      >
                        <span className="truncate">{isEn ? m.titleEn : m.titleVi}</span>
                        <span className="text-[9px] font-mono text-cyan-400/85 shrink-0">
                          {m.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CHẾ ĐỘ QUAN SÁT NHANH (3x2 Grid matching screenshot) */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                {isEn ? 'QUICK OBSERVATION MODES' : 'CHẾ ĐỘ QUAN SÁT NHANH'}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {quickPresets.map((preset) => {
                  const active = activeQuickPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onApplyQuickPreset(preset.id)}
                      className={`rounded-lg border px-1.5 py-2 text-[11px] font-semibold text-center transition-colors cursor-pointer truncate ${
                        active
                          ? 'border-cyan-400 bg-cyan-500/18 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                          : 'border-slate-800 bg-[#081325] text-slate-300 hover:border-cyan-500/40 hover:text-white'
                      }`}
                    >
                      {isEn ? preset.labelEn : preset.labelVi}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TÁCH LỚP CẤU TẠO 3D (Explode Slider matching screenshot) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {isEn ? '3D LAYER EXPLOSION' : 'TÁCH LỚP CẤU TẠO 3D'}
                </span>
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 tabular-nums">
                  {explodePct}%
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="range"
                  min={0}
                  max={1.25}
                  step={0.02}
                  value={Math.min(1.25, explodeVal)}
                  onChange={(e) => onChangeExplode(Number(e.target.value), explodeStyle)}
                  className="flex-1 h-1.5 accent-cyan-400 cursor-pointer"
                />
                <span className="min-w-[42px] rounded-md border border-slate-700/80 bg-[#081325] px-2 py-1 text-center font-mono text-[11px] text-slate-200 tabular-nums">
                  {explodePct}%
                </span>
              </div>
            </div>

            {/* LỚP & BỘ PHẬN CẤU TẠO (Cards with Eye toggle + Opacity slider matching screenshot) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase tabular-nums">
                  {isEn
                    ? `${partGroups.length} GROUPS (${modelParts.length} PARTS)`
                    : `${partGroups.length} NHÓM (${modelParts.length} BỘ PHẬN)`}
                </span>
                <button
                  type="button"
                  onClick={onShowAllParts}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {isEn ? 'Show all' : 'Hiện tất cả'}
                </button>
              </div>

              <div className="space-y-2">
                {partGroups.map((group) => {
                  const isExpanded = Boolean(expandedGroups[group.key]);
                  return (
                    <div
                      key={group.key}
                      className="rounded-xl border border-slate-800/90 bg-[#081325]/95 p-2.5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (group.indices.length === 1) {
                              onSelectPart(group.indices[0]);
                            } else {
                              setExpandedGroups((prev) => ({
                                ...prev,
                                [group.key]: !prev[group.key]
                              }));
                            }
                          }}
                          className="flex min-w-0 flex-1 items-center gap-2 text-left cursor-pointer"
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            data-circle="true"
                            style={{ backgroundColor: group.color }}
                          />
                          <span className="truncate text-xs font-bold text-white">
                            {group.label}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                            ({group.indices.length})
                          </span>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {group.indices.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedGroups((prev) => ({
                                  ...prev,
                                  [group.key]: !prev[group.key]
                                }))
                              }
                              className="p-1 text-slate-400 hover:text-white cursor-pointer"
                              aria-label="Expand group"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onTogglePartVisibility(group.indices, !group.allVisible)}
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                              group.allVisible
                                ? 'border-cyan-400/55 bg-cyan-500/20 text-cyan-300'
                                : 'border-slate-700 bg-slate-900 text-slate-500 hover:text-slate-300'
                            }`}
                            title={
                              group.allVisible
                                ? isEn
                                  ? 'Hide layer'
                                  : 'Ẩn lớp này'
                                : isEn
                                ? 'Show layer'
                                : 'Hiện lớp này'
                            }
                          >
                            {group.allVisible ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Opacity Slider (Độ mờ 0% - 100%) */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {isEn ? 'Opacity' : 'Độ mờ'}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={2}
                          value={group.avgOpacity}
                          onChange={(e) =>
                            onChangeGroupOpacity(group.indices, Number(e.target.value))
                          }
                          className="flex-1 h-1 accent-cyan-400 cursor-pointer"
                        />
                        <span className="min-w-[32px] text-right font-mono text-[10px] text-slate-300 tabular-nums">
                          {group.avgOpacity}%
                        </span>
                      </div>

                      {/* Expanded Individual Part Rows */}
                      {isExpanded && group.indices.length > 1 && (
                        <div className="space-y-1 border-t border-slate-800/90 pt-1.5">
                          {group.indices.map((pIdx) => {
                            const part = modelParts[pIdx];
                            const isSel = currentSelectedIdx === pIdx;
                            const pVis = partVisibility[pIdx] !== false;
                            return (
                              <div
                                key={part.id + pIdx}
                                className={`flex items-center justify-between gap-1.5 rounded-lg px-2 py-1 text-[11px] ${
                                  isSel
                                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50'
                                    : 'text-slate-300 hover:bg-slate-800/70'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => onSelectPart(pIdx)}
                                  className="min-w-0 flex-1 truncate text-left font-medium cursor-pointer"
                                >
                                  {isEn ? part.nameEn : part.nameVi}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onTogglePartVisibility([pIdx], !pVis)}
                                  className="text-slate-400 hover:text-cyan-300 cursor-pointer shrink-0"
                                >
                                  {pVis ? (
                                    <Eye className="h-3 w-3 text-cyan-400" />
                                  ) : (
                                    <EyeOff className="h-3 w-3 text-slate-500" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Left Panel Bottom Dual Switch Bar (Matches screenshot footer switches) */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-800/90 bg-[#040a16] px-3.5 py-2.5 text-[11px]">
            <button
              type="button"
              onClick={onToggleCamera}
              className="flex items-center gap-2 font-semibold text-slate-200 cursor-pointer"
            >
              <span
                role="switch"
                aria-checked={cameraActive}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                  cameraActive ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
              >
                <span
                  data-circle="true"
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    cameraActive ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`}
                />
              </span>
              <span>{isEn ? '10-Finger Hand' : 'Tay 3D (10 ngón)'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAutoSpin}
              className="flex items-center gap-2 font-semibold text-slate-200 cursor-pointer"
            >
              <span
                role="switch"
                aria-checked={autoSpin}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                  autoSpin ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
              >
                <span
                  data-circle="true"
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    autoSpin ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`}
                />
              </span>
              <span>{isEn ? 'Auto rotate' : 'Tự động xoay'}</span>
            </button>
          </div>
        </aside>
      )}

      {/* RIGHT FLOATING PART INSPECTOR & 10-FINGER HAND MONITOR (EXACT BIO-LAB STYLE) */}
      {rightOpen && (
        <aside className="pointer-events-auto absolute top-[106px] lg:top-[76px] bottom-[88px] right-3 w-[290px] sm:w-[320px] flex flex-col rounded-2xl border border-cyan-500/25 bg-[#050c19]/92 shadow-[0_16px_50px_rgba(0,0,0,0.75)] overflow-hidden">
          {inspectedPart ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {/* Category Pill + Close Button */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-200">
                    <span
                      className="h-2 w-2 rounded-full bg-rose-400"
                      data-circle="true"
                    />
                    <span>{isEn ? inspectedPart.badgeEn : inspectedPart.badgeVi}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRightOpen(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/80 bg-[#081325] text-slate-400 hover:border-cyan-400 hover:text-white cursor-pointer"
                    aria-label="Close inspector"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Part Headline + Scientific/Formula Subtitle */}
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-extrabold leading-tight text-white">
                    {isEn ? inspectedPart.nameEn : inspectedPart.nameVi}
                  </h3>
                  <div className="text-xs italic font-medium text-cyan-300">
                    {inspectedPart.specFormula || activeFormula}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isEn ? inspectedPart.nameVi : inspectedPart.nameEn}
                  </div>
                </div>

                {/* Cận cảnh & Cô lập Side-by-Side Buttons (Exact Match to Screenshot) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      currentSelectedIdx !== null && onFocusPart(currentSelectedIdx)
                    }
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-500/25 cursor-pointer"
                  >
                    <Focus className="h-3.5 w-3.5" />
                    <span>{isEn ? 'Focus' : 'Cận cảnh'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentSelectedIdx === null) return;
                      onToggleIsolatePart(
                        isolatedPartIdx === currentSelectedIdx ? null : currentSelectedIdx
                      );
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      isolatedPartIdx === currentSelectedIdx
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                        : 'border-slate-700 bg-[#081325] text-slate-200 hover:border-cyan-400/60'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>
                      {isolatedPartIdx === currentSelectedIdx
                        ? isEn
                          ? 'Full Model'
                          : 'Bỏ cô lập'
                        : isEn
                        ? 'Isolate'
                        : 'Cô lập'}
                    </span>
                  </button>
                </div>

                {/* Card 1: VỊ TRÍ & CẤU TẠO */}
                <div className="rounded-xl border border-slate-800/90 bg-[#071122]/95 p-3.5 space-y-1.5">
                  <div className="text-[10px] font-mono font-extrabold tracking-wider text-cyan-400 uppercase">
                    {isEn ? 'POSITION & STRUCTURE' : 'VỊ TRÍ & CẤU TẠO CHI TIẾT'}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200">
                    {isEn ? inspectedPart.introEn : inspectedPart.introVi}
                  </p>
                </div>

                {/* Card 2: CHỨC NĂNG & NGUYÊN LÝ */}
                <div className="rounded-xl border border-slate-800/90 bg-[#071122]/95 p-3.5 space-y-2">
                  <div className="text-[10px] font-mono font-extrabold tracking-wider text-cyan-400 uppercase">
                    {isEn ? 'FUNCTION & MECHANISM' : 'CHỨC NĂNG & NGUYÊN LÝ'}
                  </div>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-slate-200">
                    {splitSentences(
                      isEn ? inspectedPart.functionEn : inspectedPart.functionVi
                    ).map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400"
                          data-circle="true"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 10-Fingertip Webcam PiP & Hand Gesture Controls Strip */}
                {(cameraActive || showGesturesDrawer) && (
                  <div className="rounded-xl border border-cyan-500/35 bg-[#061020] p-2.5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-300">
                      <span className="flex items-center gap-1.5">
                        <Hand className="h-3.5 w-3.5" />
                        <span>
                          {cameraActive
                            ? isEn
                              ? `WEBCAM 10-FINGER · ${handFrame.trackedTipCount}/10`
                              : `CẢM BIẾN 10 NGÓN · ${handFrame.trackedTipCount}/10`
                            : isEn
                            ? 'HAND GESTURE SIMULATOR'
                            : 'CỬ CHỈ ĐIỀU KHIỂN TAY 3D'}
                        </span>
                      </span>
                      <span className="text-emerald-300">
                        {isEn ? currentGestureMeta.labelEn : currentGestureMeta.labelVi}
                      </span>
                    </div>

                    {cameraError && (
                      <div className="rounded bg-amber-950/80 border border-amber-500/40 px-2 py-1 text-[11px] text-amber-200">
                        {cameraError}
                      </div>
                    )}

                    {cameraActive && (
                      <div className="relative w-full h-[136px] rounded-lg overflow-hidden bg-slate-950 border border-cyan-400/50">
                        <video
                          ref={(el) => {
                            if (el && mediaStream && el.srcObject !== mediaStream) {
                              el.srcObject = mediaStream;
                              el.play().catch(() => {});
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-fill ${mirrorCamera ? '-scale-x-100' : ''}`}
                        />
                        <canvas
                          ref={overlayCanvasRef}
                          width={240}
                          height={180}
                          className="absolute inset-0 w-full h-full pointer-events-none"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-5 gap-1">
                      {REAL_GRAB_GESTURES.map((g) => {
                        const active = activeGestureId === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => onSelectVirtualGesture(g.id)}
                            className={`rounded-md border px-1 py-1 text-[10px] font-bold text-center cursor-pointer ${
                              active
                                ? 'border-cyan-400 bg-cyan-500/20 text-white'
                                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/40'
                            }`}
                            title={isEn ? g.actionEn : g.actionVi}
                          >
                            <div>{g.fingers}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowGesturesDrawer((v) => !v)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-[#081325] px-2.5 py-1.5 text-[11px] font-bold text-cyan-300 hover:border-cyan-400 cursor-pointer"
                  >
                    <Hand className="h-3.5 w-3.5" />
                    <span>{showGesturesDrawer ? (isEn ? 'Hide Hand Map' : 'Ẩn cử chỉ tay') : isEn ? 'Hand Gestures' : 'Cử chỉ Tay 3D'}</span>
                  </button>

                  <SpatialVoiceMentor
                    compactButton
                    spaceName="Atlas Mô Hình 3D"
                    modelTitle={activeTitle}
                    partName={isEn ? inspectedPart.nameEn : inspectedPart.nameVi}
                    partDescription={isEn ? inspectedPart.introEn : inspectedPart.introVi}
                    formula={inspectedPart.specFormula || activeFormula}
                    language={language}
                  />
                </div>
              </div>

              {/* Bottom Pagination Footer (Matches screenshot: ← Bộ phận trước | 54 / 58 | Tiếp theo →) */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-800/90 bg-[#040a16] px-3.5 py-2.5">
                <button
                  type="button"
                  onClick={() => handleStepPart(-1)}
                  disabled={modelParts.length <= 1}
                  className="flex items-center gap-1 rounded-lg border border-slate-700/80 bg-[#081325] px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:border-cyan-400 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Prev' : 'Bộ phận trước'}</span>
                </button>
                <span className="font-mono text-xs font-bold text-slate-300 tabular-nums">
                  {(currentSelectedIdx ?? 0) + 1} / {modelParts.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStepPart(1)}
                  disabled={modelParts.length <= 1}
                  className="flex items-center gap-1 rounded-lg border border-slate-700/80 bg-[#081325] px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:border-cyan-400 disabled:opacity-40 cursor-pointer"
                >
                  <span>{isEn ? 'Next' : 'Tiếp theo'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-5 text-xs text-slate-400">
              {isEn ? 'Select a model part to inspect.' : 'Nhấp vào một bộ phận trên mô hình 3D để xem chi tiết.'}
            </div>
          )}
        </aside>
      )}

      {/* BOTTOM CENTER CAMERA BAR + SUBTLE HELPER LEGEND (EXACT MATCH TO SCREENSHOT) */}
      <div className="pointer-events-auto absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 max-w-[96vw]">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none rounded-xl border border-cyan-500/25 bg-[#050d1c]/94 px-2.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] max-w-full">
          {cameraButtons.slice(0, 4).map((btn) => {
            const active = activeCameraPreset === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onSelectCameraPreset(btn.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'border border-cyan-400/70 bg-cyan-500/20 text-cyan-200'
                    : 'border border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {isEn ? btn.labelEn : btn.labelVi}
              </button>
            );
          })}

          <span className="mx-1 h-4 w-px bg-slate-700/80 shrink-0" aria-hidden="true" />

          {cameraButtons.slice(4).map((btn) => {
            const active = activeCameraPreset === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onSelectCameraPreset(btn.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'border border-cyan-400/70 bg-cyan-500/20 text-cyan-200'
                    : 'border border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {isEn ? btn.labelEn : btn.labelVi}
              </button>
            );
          })}

          <span className="mx-1 h-4 w-px bg-slate-700/80 shrink-0" aria-hidden="true" />

          <button
            type="button"
            onClick={onToggleFrozen}
            className={`rounded-lg p-1.5 cursor-pointer ${
              frozen ? 'text-amber-300 bg-amber-500/15' : 'text-slate-300 hover:text-white'
            }`}
            title={isEn ? 'Pause / Play (Space)' : 'Tạm dừng / Chạy (Space)'}
          >
            {frozen ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => onSelectCameraPreset('overview')}
            className="rounded-lg p-1.5 text-slate-300 hover:text-cyan-300 cursor-pointer"
            title={isEn ? 'Reset View (R)' : 'Đặt lại góc nhìn (R)'}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="hidden sm:block text-center text-[11px] text-slate-400 whitespace-nowrap">
          {isEn
            ? 'Left drag: Rotate · Scroll: Zoom · Right drag: Pan · Click: Inspect part · Turn on Hand 3D for 10-finger control'
            : 'Kéo trái: Xoay · Cuộn: Thu phóng · Kéo phải: Dịch chuyển · Nhấp: Chọn bộ phận · Bật Tay 3D: Điều khiển 10 ngón'}
        </div>
      </div>
    </div>
  );
};
