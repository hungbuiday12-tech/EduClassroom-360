import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Cpu,
  Hand,
  Info,
  Maximize2,
  Minimize2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useRemoteController } from '../../context/RemoteControllerContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { FutureLabTabId, SubjectType } from '../../types';
import { PRE_STUDIOS } from '../../data/preLabsData';
import { SynapseV2Studio } from '../synapsev2/SynapseV2Studio';
import { NeuralGalaxyTwin3D } from './NeuralGalaxyTwin3D';
import { TextToSimStudio } from './TextToSimStudio';
import { PaperToSimPanel } from './PaperToSimPanel';
import { AudioFFT3DLab } from './AudioFFT3DLab';
import { SiliconNeuralPlayground } from './SiliconNeuralPlayground';
import { PhoneSensorPhysicsLab } from './PhoneSensorPhysicsLab';
import { DualHandGPUParticleLab } from './DualHandGPUParticleLab';
import { CannonBallistics3DLab } from './CannonBallistics3DLab';
import { RocketLaunch3DLab } from './RocketLaunch3DLab';
import { JetPropulsion3DLab } from './JetPropulsion3DLab';
import { FourDLecture3DLab } from './FourDLecture3DLab';
import { RoboticsIK3DLab } from './RoboticsIK3DLab';
import { QuantumHolodeck3DLab } from './QuantumHolodeck3DLab';
import { UniverseForge3DLab } from './UniverseForge3DLab';
import { NanobotBioSwarm4DLab } from './NanobotBioSwarm4DLab';
import { TimeMachineHolo3DLab } from './TimeMachineHolo3DLab';
import { WhatIfPhysics3DLab } from './WhatIfPhysics3DLab';
import { AlgoCity3DLab } from './AlgoCity3DLab';
import { usePremium } from '../../context/PremiumContext';
import { SynapsePremiumGateModal } from '../premium/SynapsePremiumGateModal';

const SpatialGesture3DLab = lazy(() =>
  import('../spatial3d/SpatialGesture3DLab').then((m) => ({ default: m.SpatialGesture3DLab }))
);
const TechTeardown3DLab = lazy(() =>
  import('./TechTeardown3DLab').then((m) => ({ default: m.TechTeardown3DLab }))
);

interface FutureLabWorkspaceProps {
  onBack?: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
}

export const FutureLabWorkspace: React.FC<FutureLabWorkspaceProps> = ({
  onBack,
  onNavigateSubject,
  onEarnXP,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate } = useNavigation();
  const { activePalette, perfMode } = useBackgroundTheme();
  const { openModal: openRemoteModal, controllerCount } = useRemoteController();
  const { hasPremiumAccess } = usePremium();

  const rawTab = location.futureTab;
  const activeView: FutureLabTabId =
    rawTab && rawTab !== 'hub' && rawTab !== 'infinite_canvas'
      ? rawTab
      : PRE_STUDIOS[0].id;

  const [isStudioFullscreen, setIsStudioFullscreen] = useState<boolean>(false);
  const [showStudioIntro, setShowStudioIntro] = useState(true);
  const studioStageRef = useRef<HTMLDivElement | null>(null);
  const enteredNativeFsRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('pre-fullscreen-active', isStudioFullscreen);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isStudioFullscreen) {
        enteredNativeFsRef.current = false;
        setIsStudioFullscreen(false);
        try {
          if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
        } catch {}
      }
    };
    const onFsChange = () => {
      if (!document.fullscreenElement && enteredNativeFsRef.current) {
        enteredNativeFsRef.current = false;
        setIsStudioFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.documentElement.classList.remove('pre-fullscreen-active');
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [isStudioFullscreen]);

  const toggleStudioFullscreen = () => {
    if (!isStudioFullscreen) {
      setIsStudioFullscreen(true);
      try {
        const req = studioStageRef.current?.requestFullscreen?.();
        if (req && typeof req.then === 'function') {
          req
            .then(() => {
              enteredNativeFsRef.current = true;
            })
            .catch(() => {});
        }
      } catch {}
    } else {
      enteredNativeFsRef.current = false;
      setIsStudioFullscreen(false);
      try {
        if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      } catch {}
    }
  };

  const isMegastructureStage =
    activeView === 'megastructures' && location.synapseMode === 'stage';

  const glassSurfaceClass =
    perfMode === 'ultra'
      ? 'bg-white/72 dark:bg-slate-950/60 backdrop-blur-xl'
      : 'bg-white/82 dark:bg-slate-950/72';

  const openModulePage = (tab: FutureLabTabId) => {
    navigate({
      subject: 'synapse_v2',
      futureTab: tab,
      synapseMode: 'catalog',
      tutorOpen: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitToClassroom = () => {
    setIsStudioFullscreen(false);
    try {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    } catch {}
    if (onBack) {
      onBack();
    } else {
      onNavigateSubject('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStudioIndex = PRE_STUDIOS.findIndex((s) => s.id === activeView);
  const currentStudio =
    currentStudioIndex >= 0 ? PRE_STUDIOS[currentStudioIndex] : PRE_STUDIOS[0];
  const prevStudio =
    currentStudioIndex > 0
      ? PRE_STUDIOS[currentStudioIndex - 1]
      : PRE_STUDIOS[PRE_STUDIOS.length - 1];
  const nextStudio =
    currentStudioIndex >= 0 && currentStudioIndex < PRE_STUDIOS.length - 1
      ? PRE_STUDIOS[currentStudioIndex + 1]
      : PRE_STUDIOS[0];

  const studioGuideSteps = useMemo(() => {
    if (!currentStudio) return [];
    const customGuides: Partial<Record<FutureLabTabId, { vi: string[]; en: string[] }>> = {
      what_if_physics_3d: {
        vi: [
          'Chọn 1 trong 4 kịch bản vũ trụ có sẵn hoặc kéo thanh trượt hằng số G, lực 1/rⁿ, tốc độ ánh sáng c và hằng số Planck h.',
          'Kéo chuột trên khung 3D để xoay góc nhìn và cuộn chuột để phóng to/thu nhỏ quỹ đạo hành tinh.',
          'Quan sát bảng thông số Telemetry và khung Phân tích hệ quả vật lí tự động cập nhật theo thời gian thực.',
        ],
        en: [
          'Pick one of 4 universe presets or drag sliders for G, inverse-power law 1/rⁿ, speed of light c, and Planck constant h.',
          'Drag on the 3D viewport to orbit the camera and scroll to zoom into planetary trajectories.',
          'Monitor live Telemetry gauges and the automatic Physical Consequence Analysis panel.',
        ],
      },
      algo_city_3d: {
        vi: [
          'Chọn kiến trúc thuật toán muốn khám phá: Dijkstra 3D, Quy Hoạch Động DP 2D hoặc Cây Phân Đoạn (Segment Tree 3D).',
          'Dùng thanh điều khiển Chạy / Tạm dừng / Đi từng bước / Đặt lại để quan sát từng pha xử lí của thuật toán.',
          'Bật chế độ Quá tải TLE (Bottleneck Overflow) để xem hiện tượng nghẽn nút cổ chai ngay trên thành phố 3D.',
        ],
        en: [
          'Select an algorithm architecture: 3D Dijkstra, 2D Dynamic Programming, or 3D Segment Tree.',
          'Use Play, Pause, Step, and Reset controls to inspect each execution phase step by step.',
          'Toggle TLE Bottleneck Overflow mode to witness real-time congestion and slowdown on the 3D city.',
        ],
      },
      quantum_holodeck_3d: {
        vi: [
          'Chọn các cổng lượng tử (H, X, Y, Z, S, T, CNOT) để thêm vào mạch và xem vector trạng thái xoay trên quả cầu Bloch 3D.',
          'Thử kích hoạt trạng thái vướng víu Bell hoặc thuật toán Grover để quan sát biên độ xác suất.',
          'Nhấn Đo (Measure) để quan sát sự sụp đổ hàm sóng và biểu đồ tần suất 1.000 lần đo.',
        ],
        en: [
          'Apply quantum gates (H, X, Y, Z, S, T, CNOT) and watch the live state vector rotate on the 3D Bloch sphere.',
          'Trigger Bell entanglement or Grover search to inspect quantum amplitudes.',
          'Click Measure to observe wave-function collapse and the 1,000-shot histogram.',
        ],
      },
      universe_forge_3d: {
        vi: [
          'Điều chỉnh khối lượng sao, vận tốc tương đối tính v/c và hằng số vũ trụ trên bảng điều khiển.',
          'Xoay khung 3D để quan sát độ cong lưới không-thời gian, co độ dài Lorentz và dịch chuyển Doppler.',
          'So sánh các kịch bản hố đen, sao neutron và hệ hành tinh chuẩn.',
        ],
        en: [
          'Adjust stellar mass, relativistic velocity v/c, and cosmological parameters in the control panel.',
          'Orbit the 3D scene to inspect spacetime curvature, Lorentz contraction, and Doppler shifts.',
          'Compare presets across black holes, neutron stars, and standard planetary systems.',
        ],
      },
    };
    const found = customGuides[currentStudio.id];
    if (found) return isEn ? found.en : found.vi;
    return isEn
      ? [
          'Explore the interactive 3D/4D viewport: drag to rotate, scroll to zoom, and click elements to inspect.',
          'Adjust parameters, presets, or simulation controls in the workbench panel to test hypotheses.',
          'Use Fullscreen or QR 3D Remote in the top bar for immersive classroom presentation.',
        ]
      : [
          'Tương tác trực tiếp với khung mô phỏng 3D/4D: kéo chuột để xoay góc nhìn, cuộn để thu phóng và chạm vào đối tượng để nghiên cứu.',
          'Điều chỉnh các thông số, kịch bản mẫu hoặc thanh điều khiển trong bảng công cụ để kiểm chứng giả thuyết.',
          'Dùng nút Toàn màn hình hoặc QR 3D ở thanh trên cùng khi cần trình chiếu trực quan trên lớp.',
        ];
  }, [currentStudio, isEn]);

  /* Guard: Only logged-in accounts approved by Admin (or Admin) can access Synapse Pre */
  if (!hasPremiumAccess) {
    return <SynapsePremiumGateModal isOpen={true} inline={true} />;
  }

  /* Fullscreen 3D Megastructure stage leaves full canvas unobstructed */
  if (isMegastructureStage) {
    return (
      <div className="w-full">
        <SynapseV2Studio
          embeddedInPre
          onBack={exitToClassroom}
          onNavigate={onNavigateSubject}
          onEarnXP={onEarnXP}
        />
      </div>
    );
  }

  /* ==================== DEDICATED STANDALONE LAB STUDIO ==================== */
  const ActiveIcon = currentStudio?.icon || Cpu;

  return (
    <div
      ref={studioStageRef}
      key={activeView}
      className={
        isStudioFullscreen
          ? 'synapse-pre-scope fixed inset-0 z-[140] w-screen h-[100dvh] overflow-y-auto bg-slate-50/98 dark:bg-slate-950/98 px-3 sm:px-5 py-3 space-y-3 pre-page-enter'
          : 'synapse-pre-scope max-w-7xl mx-auto px-2.5 sm:px-6 py-3 sm:py-5 space-y-4 sm:space-y-5 pre-page-enter'
      }
    >
      {/* Adaptive Standalone Studio Header synced with user theme */}
      <div
        style={{ borderColor: activePalette.ring }}
        className={`pre-grand-hero sci-frame rounded-xl border ${glassSurfaceClass} text-slate-900 dark:text-white px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-[0_14px_40px_-16px_rgba(14,165,233,0.3)]`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <button
              type="button"
              data-ripple="true"
              onClick={exitToClassroom}
              className="pre-grand-btn min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
              <span>{isEn ? 'Classroom' : 'Lớp học'}</span>
            </button>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                  currentStudio?.iconBgClass ||
                  'bg-cyan-500/15 border-cyan-400/40 text-cyan-500 dark:text-cyan-300'
                }`}
              >
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  {currentStudio
                    ? `${currentStudio.indexLabel}. ${
                        isEn ? currentStudio.titleEn : currentStudio.titleVi
                      }`
                    : 'Synapse Pre Studio'}
                </h1>
                {currentStudio && (
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 truncate">
                    {isEn ? currentStudio.metaEn : currentStudio.metaVi}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 scrollbar-none pb-0.5 sm:pb-0">
            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(prevStudio.id)}
              className="pre-grand-btn inline-flex items-center gap-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? prevStudio.titleEn : prevStudio.titleVi}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Prev' : 'Trước'}</span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(nextStudio.id)}
              className="pre-grand-btn inline-flex items-center gap-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? nextStudio.titleEn : nextStudio.titleVi}
            >
              <span className="hidden sm:inline">{isEn ? 'Next' : 'Tiếp'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={openRemoteModal}
              className={`pre-grand-btn inline-flex items-center gap-1.5 px-3 py-2 border text-xs font-bold cursor-pointer whitespace-nowrap ${
                controllerCount > 0
                  ? 'border-emerald-400/70 bg-emerald-500/20 text-emerald-700 dark:text-emerald-200'
                  : 'border-sky-500/50 bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-200'
              }`}
              title={
                isEn
                  ? 'Scan QR to use Phone as 3D Controller'
                  : 'Quét QR dùng Điện thoại điều khiển 3D từ xa'
              }
            >
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">{isEn ? 'QR Remote' : 'QR 3D'}</span>
              {controllerCount > 0 && (
                <span className="px-1 rounded-[3px] bg-emerald-500 text-slate-950 text-[10px] font-mono font-extrabold tabular-nums">
                  {controllerCount}
                </span>
              )}
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={toggleStudioFullscreen}
              className={`pre-grand-btn inline-flex items-center gap-1.5 px-3.5 py-2 border text-xs font-bold cursor-pointer whitespace-nowrap ${
                isStudioFullscreen
                  ? 'border-amber-400/70 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                  : 'border-sky-500/50 bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-200'
              }`}
              title={
                isStudioFullscreen
                  ? isEn
                    ? 'Exit Fullscreen (Esc)'
                    : 'Thu nhỏ (Esc)'
                  : isEn
                  ? 'Fullscreen'
                  : 'Toàn màn hình'
              }
            >
              {isStudioFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span>
                {isStudioFullscreen
                  ? isEn
                    ? 'Exit Fullscreen'
                    : 'Thu nhỏ'
                  : isEn
                  ? 'Fullscreen'
                  : 'Toàn màn hình'}
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => {
                setIsStudioFullscreen(false);
                openModulePage('spatial_gesture_3d');
              }}
              className="pre-grand-btn inline-flex items-center gap-1.5 px-3.5 py-2 border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-200 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Hand className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" />
              <span>{isEn ? 'Spatial 3D & WebAR' : 'Học Cảm Giác 3D & AR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unified Room Intro, Features & Quick Guide Panel (Top of Every Synapse Pre Room) */}
      {currentStudio && !isStudioFullscreen && (
        <section
          className={`rounded-2xl border ${glassSurfaceClass} overflow-hidden transition-all`}
          style={{
            borderColor: `${currentStudio.accentHex}44`,
          }}
        >
          <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${currentStudio.accentHex}1a`,
                  borderColor: `${currentStudio.accentHex}55`,
                  color: currentStudio.accentHex,
                }}
              >
                <Info className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {isEn
                    ? 'Room Overview · Key Features · Quick Guide'
                    : 'Giới thiệu phòng Lab · Tính năng nổi bật · Hướng dẫn sử dụng'}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowStudioIntro((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {showStudioIntro ? (
                <>
                  <span>{isEn ? 'Collapse' : 'Thu gọn'}</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>{isEn ? 'Expand Guide' : 'Mở hướng dẫn'}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {showStudioIntro && (
            <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Column 1: Giới thiệu */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5" style={{ color: currentStudio.accentHex }} />
                  <span>{isEn ? 'Introduction' : 'Giới thiệu'}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {isEn ? currentStudio.descEn : currentStudio.descVi}
                </p>
              </div>

              {/* Column 2: Tính năng nổi bật */}
              <div className="lg:col-span-3 space-y-2 lg:border-l lg:border-slate-200/80 dark:lg:border-slate-800/80 lg:pl-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: currentStudio.accentHex }} />
                  <span>{isEn ? 'Key Features' : 'Tính năng nổi bật'}</span>
                </div>
                <ul className="space-y-1.5">
                  {(isEn ? currentStudio.specsEn : currentStudio.specsVi)
                    .split('·')
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: currentStudio.accentHex }}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Column 3: Hướng dẫn thao tác nhanh */}
              <div className="lg:col-span-4 space-y-2 lg:border-l lg:border-slate-200/80 dark:lg:border-slate-800/80 lg:pl-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Compass className="w-3.5 h-3.5" style={{ color: currentStudio.accentHex }} />
                  <span>{isEn ? 'Quick Guide' : 'Hướng dẫn thao tác'}</span>
                </div>
                <ol className="space-y-1.5">
                  {studioGuideSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <span
                        className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-white"
                        style={{ backgroundColor: currentStudio.accentHex }}
                      >
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Dedicated Module Content Canvas (All 21 3D/4D/AR Labs) */}
      <div>
        {activeView === 'what_if_physics_3d' && <WhatIfPhysics3DLab onEarnXP={onEarnXP} />}
        {activeView === 'algo_city_3d' && <AlgoCity3DLab onEarnXP={onEarnXP} />}
        {activeView === 'quantum_holodeck_3d' && <QuantumHolodeck3DLab onEarnXP={onEarnXP} />}
        {activeView === 'universe_forge_3d' && <UniverseForge3DLab onEarnXP={onEarnXP} />}
        {activeView === 'nanobot_bioswarm_4d' && <NanobotBioSwarm4DLab onEarnXP={onEarnXP} />}
        {activeView === 'timemachine_holo_3d' && <TimeMachineHolo3DLab onEarnXP={onEarnXP} />}
        {activeView === 'tech_teardown_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[640px] rounded border border-amber-500/35 bg-[#060b16] flex items-center justify-center text-xs font-mono text-amber-300">
                {isEn
                  ? 'Initializing 3D Hardware Workbench...'
                  : 'Đang khởi tạo Xưởng Phẫu Thuật 3D...'}
              </div>
            }
          >
            <TechTeardown3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'spatial_gesture_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[640px] rounded border border-teal-500/35 bg-[#050914] flex items-center justify-center text-xs font-mono text-teal-300">
                {isEn ? 'Loading Spatial 3D & WebAR Studio...' : 'Đang tải Học Cảm Giác 3D & WebAR...'}
              </div>
            }
          >
            <SpatialGesture3DLab
              onBack={exitToClassroom}
              onNavigate={onNavigateSubject}
              onEarnXP={onEarnXP}
              initialCoopRoomCode={location.coopRoomCode}
              coopInviteMeta={location.coopInviteMeta}
              onConsumeCoopRoom={() =>
                navigate({ coopRoomCode: null, coopInviteMeta: null }, { replace: true })
              }
            />
          </Suspense>
        )}
        {activeView === 'rocket_launch_3d' && <RocketLaunch3DLab onEarnXP={onEarnXP} />}
        {activeView === 'jet_engine_3d' && <JetPropulsion3DLab onEarnXP={onEarnXP} />}
        {activeView === 'four_d_lectures' && <FourDLecture3DLab onEarnXP={onEarnXP} />}
        {activeView === 'robotics_ik_3d' && <RoboticsIK3DLab onEarnXP={onEarnXP} />}
        {activeView === 'cannon_ballistics_3d' && <CannonBallistics3DLab onEarnXP={onEarnXP} />}
        {activeView === 'megastructures' && (
          <SynapseV2Studio
            embeddedInPre
            onBack={exitToClassroom}
            onNavigate={onNavigateSubject}
            onEarnXP={onEarnXP}
          />
        )}
        {activeView === 'galaxy3d' && <NeuralGalaxyTwin3D language={language} />}
        {activeView === 'text_to_sim' && <TextToSimStudio language={language} />}
        {activeView === 'paper_to_sim' && <PaperToSimPanel language={language} />}
        {activeView === 'audio_fft' && <AudioFFT3DLab language={language} />}
        {activeView === 'silicon_neural' && <SiliconNeuralPlayground />}
        {activeView === 'phone_sensor_lab' && (
          <PhoneSensorPhysicsLab initialRoomCode={location.sensorRoomCode} />
        )}
        {activeView === 'dual_hand_sandbox' && <DualHandGPUParticleLab />}
      </div>
    </div>
  );
};
