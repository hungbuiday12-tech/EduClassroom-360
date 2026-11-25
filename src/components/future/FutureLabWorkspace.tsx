import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Command,
  Compass,
  Cpu,
  Hand,
  Info,
  Maximize2,
  Minimize2,
  QrCode,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useRemoteController } from '../../context/RemoteControllerContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { FutureLabTabId, SubjectType } from '../../types';
import { PRE_SANDBOX_DIVISIONS, PRE_SIDEBAR_GROUPS, PRE_STUDIOS, PRE_SUBJECT_ZONES, PreSandboxDivisionId, PreSidebarGroupId, PreSubjectZoneId } from '../../data/preLabsData';
import { RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
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
const AssemblyStudio3DLab = lazy(() =>
  import('./AssemblyStudio3DLab').then((m) => ({ default: m.AssemblyStudio3DLab }))
);
const SolarSystem3DLab = lazy(() =>
  import('./SolarSystem3DLab').then((m) => ({ default: m.SolarSystem3DLab }))
);
const TypingParrotoSandbox = lazy(() =>
  import('./TypingParrotoSandbox').then((m) => ({ default: m.TypingParrotoSandbox }))
);
const ChemReaction3DLab = lazy(() =>
  import('./ChemReaction3DLab').then((m) => ({ default: m.ChemReaction3DLab }))
);
const ChemOrbitalVsepr3DLab = lazy(() =>
  import('./ChemOrbitalVsepr3DLab').then((m) => ({ default: m.ChemOrbitalVsepr3DLab }))
);
const BioCellAtlas3DLab = lazy(() =>
  import('./BioCellAtlas3DLab').then((m) => ({ default: m.BioCellAtlas3DLab }))
);
const BioDnaCrispr3DLab = lazy(() =>
  import('./BioDnaCrispr3DLab').then((m) => ({ default: m.BioDnaCrispr3DLab }))
);
const ChemistrySandboxes = lazy(() =>
  import('../chemistry/ChemistrySandboxes').then((m) => ({ default: m.ChemistrySandboxes }))
);
const BiologySandboxes = lazy(() =>
  import('../biology/BiologySandboxes').then((m) => ({ default: m.BiologySandboxes }))
);
const MathSandboxSuite = lazy(() =>
  import('./MathSandboxSuite').then((m) => ({ default: m.MathSandboxSuite }))
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
  const [activeZoneTab, setActiveZoneTab] = useState<PreSubjectZoneId>(() => {
    const found = PRE_STUDIOS.find((s) => s.id === activeView);
    return found?.subjectZone || 'physics';
  });
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);
  const [switcherQuery, setSwitcherQuery] = useState('');
  const [switcherGroup, setSwitcherGroup] = useState<'all' | 'pinned' | PreSidebarGroupId>('all');
  const [switcherSubject, setSwitcherSubject] = useState<'all' | PreSubjectZoneId>('all');
  const [switcherSandboxDiv, setSwitcherSandboxDiv] = useState<'all' | PreSandboxDivisionId>('all');
  const [pinnedStudios, setPinnedStudios] = useState<FutureLabTabId[]>(() => {
    try {
      const raw = localStorage.getItem('synapse_pre_pinned_v1');
      return raw ? (JSON.parse(raw) as FutureLabTabId[]) : ['what_if_physics_3d', 'quantum_holodeck_3d', 'solar_system_3d'];
    } catch {
      return ['what_if_physics_3d', 'quantum_holodeck_3d', 'solar_system_3d'];
    }
  });
  const [exploredStudios, setExploredStudios] = useState<FutureLabTabId[]>(() => {
    try {
      const raw = localStorage.getItem('synapse_pre_explored_v1');
      return raw ? (JSON.parse(raw) as FutureLabTabId[]) : [];
    } catch {
      return [];
    }
  });
  const studioStageRef = useRef<HTMLDivElement | null>(null);
  const enteredNativeFsRef = useRef<boolean>(false);

  const {
    isRecording: isStudioRecording,
    recordSeconds: studioRecordSeconds,
    toggleRecording: toggleStudioRecording,
    stopRecording: stopStudioRecording,
    supported: studioVideoSupported,
  } = useCanvasRecorder(
    () => studioStageRef.current?.querySelector('canvas') as HTMLCanvasElement | null,
    `synapse-pre-${activeView}`
  );

  useEffect(() => {
    if (!activeView) return;
    setExploredStudios((prev) => {
      if (prev.includes(activeView)) return prev;
      const next = [...prev, activeView];
      try {
        localStorage.setItem('synapse_pre_explored_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [activeView]);

  const togglePinStudio = (id: FutureLabTabId) => {
    setPinnedStudios((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('synapse_pre_pinned_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('pre-fullscreen-active', isStudioFullscreen);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickSwitcherOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape') {
        if (quickSwitcherOpen) {
          setQuickSwitcherOpen(false);
          return;
        }
        if (isStudioFullscreen) {
          enteredNativeFsRef.current = false;
          setIsStudioFullscreen(false);
          try {
            if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
          } catch {}
        }
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
  }, [isStudioFullscreen, quickSwitcherOpen]);

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
    stopStudioRecording();
    setQuickSwitcherOpen(false);
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

  useEffect(() => {
    if (currentStudio?.subjectZone) {
      setActiveZoneTab(currentStudio.subjectZone);
    }
  }, [currentStudio?.subjectZone]);

  const activeZoneMeta = useMemo(
    () => PRE_SUBJECT_ZONES.find((z) => z.id === activeZoneTab) || PRE_SUBJECT_ZONES[0],
    [activeZoneTab]
  );

  const openSubjectStandardHub = (zoneId: PreSubjectZoneId) => {
    setIsStudioFullscreen(false);
    if (zoneId === 'physics') {
      navigate({ subject: 'physics_sims', physicsView: 'sim3d_hub', tutorOpen: false });
    } else if (zoneId === 'chemistry') {
      navigate({ subject: 'chemistry_sims', chemistryView: 'sandbox', tutorOpen: false });
    } else if (zoneId === 'biology') {
      navigate({ subject: 'biology_sims', biologyView: 'sandbox', tutorOpen: false });
    } else if (zoneId === 'math') {
      navigate({ subject: 'math_sims', mathTab: 'math3d', tutorOpen: false });
    } else {
      navigate({ subject: 'cs_sims', csViewMode: 'visualizer', csSimTab: 'viz3d', tutorOpen: false });
    }
  };
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
      assembly_3d: {
        vi: [
          'Chọn 1 trong 4 mô hình 3D (Động cơ V4, Đồng hồ Tourbillon, Drone FPV hoặc Hộp số Hành tinh) và bật chế độ Hướng dẫn hoặc Thử thách Tốc độ.',
          'Kéo thả trực tiếp linh kiện 3D nổi vào khung hologram phát sáng, chạm vào thẻ linh kiện ở khay dưới, hoặc nhấn Tự Lắp Ráp.',
          'Khi lắp đạt 100%, bấm Khởi Động / Chạy Thử để quan sát cơ cấu vận hành thực tế hoặc kéo thanh Tách lớp 3D để soi kết cấu.',
        ],
        en: [
          'Choose any of the 4 3D models (V4 Engine, Tourbillon Watch, FPV Drone, or Planetary Gearbox) and switch between Guided and Hardcore Speedrun modes.',
          'Drag floating 3D parts onto glowing hologram target slots, click parts in the bottom inventory tray, or run Auto Assemble.',
          'Once 100% assembled, launch the Live Mechanism Test Run or scrub the Exploded View slider to inspect tolerances.',
        ],
      },
      solar_system_3d: {
        vi: [
          'Chọn Mặt Trời hoặc 1 trong 8 hành tinh ở khay dưới (hoặc chạm trực tiếp trên cảnh 3D) để camera tự động bay tới và khóa mục tiêu.',
          'Kéo thanh thời gian 1800–2100 bên dưới hoặc bấm Thực / 1 ngày/s / 1 tháng/s / 1 năm/s để quan sát vị trí thiên văn thực tế.',
          'Xem khoảng cách từ Trái Đất tính theo AU và thời gian ánh sáng (light-min), bật tắt đường quỹ đạo hoặc nhãn tên thiên thể ở thanh bên phải.',
        ],
        en: [
          'Click the Sun or any of the 8 planets in the bottom dock (or directly in 3D space) to fly to and track that world.',
          'Scrub the 1800–2100 ephemeris timeline or pick Live / 1 day/s / 1 month/s / 1 year/s speeds.',
          'Inspect live distance from Earth in AU and light-minutes, and toggle orbital curves or world labels from the right rail.',
        ],
      },
      typing_parroto_sandbox: {
        vi: [
          'Chọn chế độ Parroto Săn Từ (gõ từ bay ngẫu nhiên Anh–Việt, C++, Python, Báo cáo) hoặc Gõ Đoạn Văn Đếm Giờ (tải file / dán bài bất kỳ).',
          'Chọn độ khó Dễ · Thường · Khó hoặc tự kéo thanh thời gian quy định cho bài văn, đồng thời chuyển mức đồ họa Thấp / Trung bình / Pro 3D ngay trên thanh trên.',
          'Quan sát bàn phím trực tiếp ở góc trái sáng phím theo thời gian thực, giữ chuỗi Combo để kích hoạt Đóng băng / EMP / Khiên và nhận XP.',
        ],
        en: [
          'Switch between Parroto Arcade (random EN–VI, C++, Python, or Report tokens) and Timed Passage Arena (upload or paste any text).',
          'Select Easy, Normal, or Hard difficulty (or dial a custom timer) and test Low / Medium / Pro 3D animated backdrops in the top bar.',
          'Watch the bottom-left live keyboard illuminate every keystroke in real time, chain combos for Freeze/EMP/Shield power-ups, and track WPM.',
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
              onClick={() => setQuickSwitcherOpen(true)}
              className="pre-grand-btn min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 border border-cyan-500/45 bg-cyan-500/12 hover:bg-cyan-500/25 text-xs font-bold text-cyan-700 dark:text-cyan-200 cursor-pointer whitespace-nowrap"
              title={isEn ? 'Quick Studio Switcher (Ctrl+K)' : 'Chuyển nhanh Phòng Lab Pre (Ctrl+K)'}
            >
              <Command className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isEn ? 'Switch Lab' : 'Kho Pre'} ({exploredStudios.length}/{PRE_STUDIOS.length})
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => togglePinStudio(activeView)}
              className={`pre-grand-btn min-h-[38px] inline-flex items-center justify-center px-2.5 py-1.5 border text-xs font-bold cursor-pointer whitespace-nowrap ${
                pinnedStudios.includes(activeView)
                  ? 'border-amber-400/70 bg-amber-500/20 text-amber-600 dark:text-amber-300'
                  : 'border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300'
              }`}
              title={pinnedStudios.includes(activeView) ? (isEn ? 'Unpin Lab' : 'Bỏ ghim phòng Lab') : isEn ? 'Pin Favorite' : 'Ghim phòng Lab'}
            >
              <Star className={`w-3.5 h-3.5 ${pinnedStudios.includes(activeView) ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(prevStudio.id)}
              className="pre-grand-btn min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? prevStudio.titleEn : prevStudio.titleVi}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Prev' : 'Trước'}</span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(nextStudio.id)}
              className="pre-grand-btn min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? nextStudio.titleEn : nextStudio.titleVi}
            >
              <span className="hidden sm:inline">{isEn ? 'Next' : 'Tiếp'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <RecordVideoButton
              isRecording={isStudioRecording}
              recordSeconds={studioRecordSeconds}
              onToggle={toggleStudioRecording}
              supported={studioVideoSupported}
              isEn={isEn}
              className="!min-h-[38px] !border-slate-300 dark:!border-slate-700 !bg-white/90 dark:!bg-slate-900/90 !text-slate-800 dark:!text-slate-200"
            />

            <button
              type="button"
              data-ripple="true"
              onClick={openRemoteModal}
              className={`pre-grand-btn min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold cursor-pointer whitespace-nowrap ${
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
              className={`pre-grand-btn min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 border text-xs font-bold cursor-pointer whitespace-nowrap ${
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
              className="pre-grand-btn min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-200 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Hand className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" />
              <span>{isEn ? 'Spatial 3D & WebAR' : 'Học Cảm Giác 3D & AR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Per-Subject Partition Bar: Toán · Vật lí · Hóa học · Sinh học · Tin học × Phòng Lab / Mô phỏng / Sandboxes */}
      {!isStudioFullscreen && (
        <section className={`rounded-2xl border ${glassSurfaceClass} border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-4 space-y-3`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {PRE_SUBJECT_ZONES.map((zone) => {
                const ZoneIcon = zone.icon;
                const isZoneSelected = activeZoneTab === zone.id;
                const zoneCount = PRE_STUDIOS.filter((s) => s.subjectZone === zone.id).length;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    data-ripple="true"
                    onClick={() => setActiveZoneTab(zone.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer whitespace-nowrap ${
                      isZoneSelected
                        ? `${zone.pillClass} shadow-xs`
                        : 'bg-white/80 dark:bg-slate-900/75 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400/60'
                    }`}
                  >
                    <ZoneIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? zone.labelEn : zone.labelVi}</span>
                    <span className="font-mono text-[10px] opacity-80 tabular-nums">({zoneCount})</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              data-ripple="true"
              onClick={() => openSubjectStandardHub(activeZoneTab)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-sky-600 hover:opacity-95 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isEn
                  ? `Open ${activeZoneMeta.labelEn} 2D/3D & Sandbox Hub`
                  : `Mở Kho 2D/3D & Sandbox ${activeZoneMeta.labelVi}`}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRE_SIDEBAR_GROUPS.map((grp) => {
              const items = PRE_STUDIOS.filter(
                (s) => s.subjectZone === activeZoneTab && s.sidebarGroup === grp.id
              );
              return (
                <div
                  key={grp.id}
                  className="rounded-xl border border-slate-200/85 dark:border-slate-800/90 bg-slate-50/75 dark:bg-slate-950/60 p-2.5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {isEn ? grp.labelEn : grp.labelVi}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                      {items.length}
                    </span>
                  </div>

                  {items.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((lab) => {
                        const LabIcon = lab.icon;
                        const active = lab.id === activeView;
                        return (
                          <button
                            key={lab.id}
                            type="button"
                            onClick={() => openModulePage(lab.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                              active
                                ? 'bg-sky-600 border-sky-500 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-cyan-400/70'
                            }`}
                          >
                            <LabIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : lab.accentTextClass}`} />
                            <span className="truncate max-w-[165px]">
                              {isEn ? lab.shortEn : lab.shortVi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openSubjectStandardHub(activeZoneTab)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 cursor-pointer"
                    >
                      {isEn
                        ? `Use ${activeZoneMeta.labelEn} 2D/3D Hub →`
                        : `Dùng trực tiếp tại Kho ${activeZoneMeta.labelVi} 2D/3D →`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 2-Part Premium Sandbox Division: Sandbox KHTN (Lí - Hóa - Sinh) & Sandbox KHKT (Toán - Tin) */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {PRE_SANDBOX_DIVISIONS.map((div) => {
              const divSandboxes = PRE_STUDIOS.filter(
                (s) => s.sidebarGroup === 'sandboxes' && s.sandboxDivision === div.id
              );
              return (
                <div
                  key={div.id}
                  className={`rounded-xl border p-4 sm:p-5 space-y-3 ${div.surfaceClass}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-extrabold tracking-wide ${div.badgeClass}`}
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        {isEn ? div.labelEn : div.labelVi}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {isEn ? div.descEn : div.descVi}
                      </p>
                    </div>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 tabular-nums">
                      {divSandboxes.length} {isEn ? 'sandboxes' : 'sandbox'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {divSandboxes.map((lab) => {
                      const LabIcon = lab.icon;
                      const active = lab.id === activeView;
                      return (
                        <button
                          key={lab.id}
                          type="button"
                          onClick={() => openModulePage(lab.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                            active
                              ? 'bg-sky-600 border-sky-400 text-white shadow-sm'
                              : 'bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 hover:border-cyan-400'
                          }`}
                        >
                          <LabIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : lab.accentTextClass}`} />
                          <span>{isEn ? lab.shortEn : lab.shortVi}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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
              <div className="w-full h-[360px] sm:h-[640px] rounded border border-amber-500/35 bg-[#060b16] flex items-center justify-center text-xs font-mono text-amber-300">
                {isEn
                  ? 'Initializing 3D Hardware Workbench...'
                  : 'Đang khởi tạo Xưởng Phẫu Thuật 3D...'}
              </div>
            }
          >
            <TechTeardown3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'assembly_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[360px] sm:h-[640px] rounded border border-orange-500/35 bg-[#060b16] flex items-center justify-center text-xs font-mono text-orange-300">
                {isEn
                  ? 'Initializing Interactive 3D Assembly Studio...'
                  : 'Đang khởi tạo Mô Phỏng Lắp Ráp 3D...'}
              </div>
            }
          >
            <AssemblyStudio3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'solar_system_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[360px] sm:h-[640px] rounded border border-amber-500/35 bg-[#03050a] flex items-center justify-center text-xs font-mono text-amber-300">
                {isEn ? 'Initializing Solar Ephemeris 3D...' : 'Đang khởi tạo Hệ Mặt Trời 3D...'}
              </div>
            }
          >
            <SolarSystem3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'spatial_gesture_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[360px] sm:h-[640px] rounded border border-teal-500/35 bg-[#050914] flex items-center justify-center text-xs font-mono text-teal-300">
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
        {activeView === 'typing_parroto_sandbox' && (
          <Suspense
            fallback={
              <div className="w-full h-[540px] rounded-2xl border border-sky-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-sky-300">
                {isEn ? 'Initializing Parroto Typing Arena...' : 'Đang khởi tạo Đấu trường Gõ Parroto...'}
              </div>
            }
          >
            <TypingParrotoSandbox onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'chem_reaction_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-amber-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-amber-300">
                {isEn ? 'Initializing 3D Potential Energy Surface...' : 'Đang khởi tạo Bề Mặt Thế Năng Hóa Học 3D...'}
              </div>
            }
          >
            <ChemReaction3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'chem_orbital_vsepr_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-sky-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-sky-300">
                {isEn ? 'Initializing Quantum Orbitals & VSEPR...' : 'Đang khởi tạo Orbital Lượng Tử & VSEPR 3D...'}
              </div>
            }
          >
            <ChemOrbitalVsepr3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'bio_cell_atlas_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-emerald-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-emerald-300">
                {isEn ? 'Initializing 3D Eukaryotic Cell Atlas...' : 'Đang khởi tạo Atlas Tế Bào Nhân Thực 3D...'}
              </div>
            }
          >
            <BioCellAtlas3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'bio_dna_crispr_3d' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-cyan-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-cyan-300">
                {isEn ? 'Initializing DNA & CRISPR-Cas9 Studio...' : 'Đang khởi tạo ADN 3D & CRISPR-Cas9...'}
              </div>
            }
          >
            <BioDnaCrispr3DLab onEarnXP={onEarnXP} />
          </Suspense>
        )}
        {activeView === 'chem_sandbox_suite' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-emerald-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-emerald-300">
                {isEn ? 'Initializing Chemistry Sandbox Suite...' : 'Đang khởi tạo Sandbox Hóa Học KHTN...'}
              </div>
            }
          >
            <ChemistrySandboxes isEn={isEn} />
          </Suspense>
        )}
        {activeView === 'bio_sandbox_suite' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-teal-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-teal-300">
                {isEn ? 'Initializing Biology Sandbox Suite...' : 'Đang khởi tạo Sandbox Sinh Học KHTN...'}
              </div>
            }
          >
            <BiologySandboxes isEn={isEn} />
          </Suspense>
        )}
        {activeView === 'math_sandbox_suite' && (
          <Suspense
            fallback={
              <div className="w-full h-[520px] rounded-2xl border border-indigo-500/35 bg-slate-950/90 flex items-center justify-center text-xs font-mono text-indigo-300">
                {isEn ? 'Initializing Math 2D/3D Sandbox...' : 'Đang khởi tạo Sandbox Toán Học KHKT...'}
              </div>
            }
          >
            <MathSandboxSuite isEn={isEn} />
          </Suspense>
        )}
      </div>

      {/* Quick Studio Switcher Spotlight Modal (Ctrl+K) */}
      {quickSwitcherOpen && (
        <div
          className="fixed inset-0 z-[180] bg-slate-950/92 flex items-start justify-center p-3 sm:p-8 pt-10 sm:pt-16"
          onClick={() => setQuickSwitcherOpen(false)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-cyan-500/40 bg-white dark:bg-[#071124] text-slate-900 dark:text-white shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-cyan-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={switcherQuery}
                onChange={(e) => setSwitcherQuery(e.target.value)}
                placeholder={
                  isEn
                    ? `Search all ${PRE_STUDIOS.length} Synapse Pre studios, megastructures, sandboxes...`
                    : `Tìm nhanh trong ${PRE_STUDIOS.length} phòng Lab, Mô phỏng & Sandboxes Synapse Pre...`
                }
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuickSwitcherOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-950/60">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: isEn ? `All (${PRE_STUDIOS.length})` : `Tất cả (${PRE_STUDIOS.length})` },
                    { id: 'pinned', label: isEn ? `Pinned (${pinnedStudios.length})` : `Đã ghim (${pinnedStudios.length})` },
                    ...PRE_SIDEBAR_GROUPS.map((g) => ({
                      id: g.id,
                      label: isEn ? g.labelEn : g.labelVi,
                    })),
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSwitcherGroup(tab.id);
                      if (tab.id !== 'sandboxes') setSwitcherSandboxDiv('all');
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer whitespace-nowrap transition-colors ${
                      switcherGroup === tab.id
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {switcherGroup === 'sandboxes' && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSwitcherSandboxDiv('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer whitespace-nowrap border ${
                      switcherSandboxDiv === 'all'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isEn ? 'All Sandboxes' : 'Tất cả Sandbox'}
                  </button>
                  {PRE_SANDBOX_DIVISIONS.map((div) => (
                    <button
                      key={div.id}
                      type="button"
                      onClick={() => setSwitcherSandboxDiv(div.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer whitespace-nowrap border transition-colors ${
                        switcherSandboxDiv === div.id
                          ? div.badgeClass
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isEn ? div.labelEn : div.labelVi}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSwitcherSubject('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer whitespace-nowrap border ${
                    switcherSubject === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isEn ? 'All Subjects' : 'Mọi môn học'}
                </button>
                {PRE_SUBJECT_ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSwitcherSubject(z.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer whitespace-nowrap border transition-colors ${
                      switcherSubject === z.id
                        ? z.badgeClass
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isEn ? z.labelEn : z.labelVi}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRE_STUDIOS.filter((st) => {
                if (switcherGroup === 'pinned' && !pinnedStudios.includes(st.id)) return false;
                if (switcherGroup !== 'all' && switcherGroup !== 'pinned' && st.sidebarGroup !== switcherGroup) return false;
                if (switcherGroup === 'sandboxes' && switcherSandboxDiv !== 'all' && st.sandboxDivision !== switcherSandboxDiv) return false;
                if (switcherSubject !== 'all' && st.subjectZone !== switcherSubject) return false;
                const q = switcherQuery.trim().toLowerCase();
                if (!q) return true;
                return `${st.titleVi} ${st.titleEn} ${st.metaVi} ${st.keywords}`.toLowerCase().includes(q);
              }).map((st) => {
                const IconComp = st.icon;
                const isActive = st.id === activeView;
                const isPinned = pinnedStudios.includes(st.id);
                const isExplored = exploredStudios.includes(st.id);
                return (
                  <div
                    key={st.id}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-cyan-400/60 bg-slate-50/70 dark:bg-slate-900/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => openModulePage(st.id)}
                      className="flex-1 min-w-0 flex items-center gap-2.5 text-left cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${st.iconBgClass}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span>{st.indexLabel}</span>
                          {isExplored && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        </div>
                        <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
                          {isEn ? st.titleEn : st.titleVi}
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePinStudio(st.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 cursor-pointer shrink-0"
                    >
                      <Star className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
