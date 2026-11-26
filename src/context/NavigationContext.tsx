import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Biology3DMode,
  BiologyDomainId,
  BiologySimType,
  Chemistry3DMode,
  ChemistryDomainId,
  ChemistrySimType,
  FunctionPlotConfig,
  FutureLabTabId,
  MathLecture,
  Physics3DMode,
  PhysicsDomainId,
  PhysicsSimType,
  SubjectType
} from '../types';
import { CSTrackId } from '../data/csTracksData';
import { CURRICULUM_COUNTS } from '../data/curriculumCounts';
import { PHYSICS_DOMAINS } from '../data/physicsDomainsData';

export interface NavLocation {
  subject: SubjectType;
  mathTab: 'lectures' | 'grapher' | 'geometry' | 'math3d';
  mathViewMode: 'catalog' | 'lecture';
  mathLectureId: string;
  physicsView: 'catalog' | 'lecture' | 'sim2d_hub' | 'sim3d_hub';
  physicsDomain: PhysicsDomainId;
  physicsSim2D: PhysicsSimType;
  physicsSim3D: Physics3DMode;
  physicsLessonId: string;
  physicsTab: 'theory' | 'simulation' | 'sim3d' | 'practice';
  chemistryView: 'catalog' | 'lecture' | 'sim2d_hub' | 'sim3d_hub' | 'sandbox';
  chemistryDomain: ChemistryDomainId;
  chemistrySim2D: ChemistrySimType;
  chemistrySim3D: Chemistry3DMode;
  chemistryLessonId: string;
  chemistryTab: 'theory' | 'simulation' | 'sim3d' | 'practice';
  biologyView: 'catalog' | 'lecture' | 'sim2d_hub' | 'sim3d_hub' | 'sandbox';
  biologyDomain: BiologyDomainId;
  biologySim2D: BiologySimType;
  biologySim3D: Biology3DMode;
  biologyLessonId: string;
  biologyTab: 'theory' | 'simulation' | 'sim3d' | 'practice';
  csViewMode: 'curriculum' | 'judge' | 'custom' | 'visualizer';
  csSubView: 'roadmap' | 'lecture';
  csTrackId: CSTrackId;
  csLessonId: string;
  csLessonTab: 'lecture' | 'code' | 'practice' | 'visualizer';
  csSimTab?: 'viz2d' | 'viz3d';
  csAlgoId?: string;
  examId: string | null;
  synapseMode: 'catalog' | 'stage';
  synapseMonumentId: string;
  futureTab?: 'hub' | FutureLabTabId;
  sensorRoomCode?: string | null;
  coopRoomCode: string | null;
  coopInviteMeta?: {
    roomId?: string;
    title?: string;
    modelId?: string;
    modelTitle?: string;
    hostName?: string;
  } | null;
  tutorOpen: boolean;
  tutorSubject: SubjectType;
  tutorTab?: 'chat' | 'motion_reel';
}

const DEFAULT_LOCATION: NavLocation = {
  subject: 'overview',
  mathTab: 'lectures',
  mathViewMode: 'catalog',
  mathLectureId: CURRICULUM_COUNTS.defaultMathLectureId,
  physicsView: 'catalog',
  physicsDomain: 'mechanics',
  physicsSim2D: 'kinematics_graphs',
  physicsSim3D: 'kinematics_3d',
  physicsLessonId: CURRICULUM_COUNTS.defaultPhysicsLessonId,
  physicsTab: 'theory',
  chemistryView: 'catalog',
  chemistryDomain: 'atomic_periodic',
  chemistrySim2D: 'atomic_orbitals_2d',
  chemistrySim3D: 'atomic_orbitals_3d',
  chemistryLessonId: CURRICULUM_COUNTS.defaultChemistryLessonId,
  chemistryTab: 'theory',
  biologyView: 'catalog',
  biologyDomain: 'cell_membrane',
  biologySim2D: 'cell_organelles_2d',
  biologySim3D: 'eukaryotic_cell_3d',
  biologyLessonId: CURRICULUM_COUNTS.defaultBiologyLessonId,
  biologyTab: 'theory',
  csViewMode: 'curriculum',
  csSubView: 'roadmap',
  csTrackId: 'vnoi',
  csLessonId: 'cs-1',
  csLessonTab: 'lecture',
  csSimTab: 'viz2d',
  csAlgoId: 'coord_hull',
  examId: null,
  synapseMode: 'catalog',
  synapseMonumentId: 'dyson',
  futureTab: 'what_if_physics_3d',
  sensorRoomCode: null,
  coopRoomCode: null,
  coopInviteMeta: null,
  tutorOpen: false,
  tutorSubject: 'math',
  tutorTab: 'chat'
};

function getInitialLocation(): NavLocation {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const rawCode = params.get('coopRoom')?.trim().toUpperCase();
      if (rawCode && /^[A-Z0-9]{4,12}$/.test(rawCode)) {
        return {
          ...DEFAULT_LOCATION,
          subject: 'synapse_v2',
          futureTab: 'spatial_gesture_3d',
          coopRoomCode: rawCode
        };
      }
      const rawSensorRoom = params.get('sensorRoom')?.trim().toUpperCase();
      const rawFutureTab = params.get('futureTab')?.trim() as FutureLabTabId | undefined;
      if (rawSensorRoom && /^[A-Z0-9]{4,12}$/.test(rawSensorRoom)) {
        return {
          ...DEFAULT_LOCATION,
          subject: 'synapse_v2',
          futureTab: 'phone_sensor_lab',
          sensorRoomCode: rawSensorRoom
        };
      }
      if (
        rawFutureTab &&
        [
          'megastructures',
          'what_if_physics_3d',
          'algo_city_3d',
          'galaxy3d',
          'text_to_sim',
          'paper_to_sim',
          'infinite_canvas',
          'audio_fft',
          'silicon_neural',
          'phone_sensor_lab',
          'dual_hand_sandbox',
          'cannon_ballistics_3d',
          'rocket_launch_3d',
          'jet_engine_3d',
          'four_d_lectures',
          'robotics_ik_3d',
          'quantum_holodeck_3d',
          'universe_forge_3d',
          'nanobot_bioswarm_4d',
          'timemachine_holo_3d',
          'spatial_gesture_3d',
          'tech_teardown_3d',
          'assembly_3d',
          'solar_system_3d',
          'typing_parroto_sandbox',
          'chem_reaction_3d',
          'chem_orbital_vsepr_3d',
          'bio_cell_atlas_3d',
          'bio_dna_crispr_3d'
        ].includes(rawFutureTab)
      ) {
        return {
          ...DEFAULT_LOCATION,
          subject: 'synapse_v2',
          futureTab: rawFutureTab
        };
      }
    }
  } catch {}
  return DEFAULT_LOCATION;
}

export function getLocationLabel(loc: NavLocation, lang: 'vi' | 'en' = 'vi'): string {
  const isEn = lang === 'en';
  if (loc.tutorOpen) {
    return loc.tutorSubject === 'physics'
      ? 'Syn Physics'
      : loc.tutorSubject === 'chemistry'
      ? 'Syn Chem'
      : loc.tutorSubject === 'biology'
      ? 'Syn Bio'
      : loc.tutorSubject === 'cs'
      ? 'Syn Code'
      : 'Syn Math';
  }
  switch (loc.subject) {
    case 'overview':
      return isEn ? 'Classroom' : 'Lớp học';
    case 'guide':
      return isEn ? 'Interactive Guide' : 'Hướng dẫn sử dụng';
    case 'authors':
      return isEn ? 'Authors · Class 9/4 Ben Tre' : 'Nhóm tác giả · 9/4 THCS Bến Tre';
    case 'synapse_v2':
      if (!loc.futureTab || loc.futureTab === 'hub' || loc.futureTab === 'what_if_physics_3d') {
        return isEn ? 'Synapse Pre · What-If Physics Sandbox 3D' : 'Synapse Pre · Vũ Trụ Định Luật Vật Lí 3D';
      }
      if (loc.futureTab === 'algo_city_3d') return isEn ? 'Synapse Pre · 3D AlgoCity' : 'Synapse Pre · Thành Phố Thuật Toán 3D';
      if (loc.futureTab === 'galaxy3d') return isEn ? 'Synapse Pre · 3D Neural Galaxy' : 'Synapse Pre · Vũ Trụ Tri Thức 3D';
      if (loc.futureTab === 'text_to_sim') return isEn ? 'Synapse Pre · 3D AI Simulation Studio' : 'Synapse Pre · Sinh Mô Phỏng 3D AI';
      if (loc.futureTab === 'paper_to_sim') return isEn ? 'Synapse Pre · Paper to 3D Sim' : 'Synapse Pre · Giấy Nháp → Mô Hình 3D';
      if (loc.futureTab === 'audio_fft') return isEn ? 'Synapse Pre · Audio FFT 3D Lab' : 'Synapse Pre · Sóng Âm FFT 3D';
      if (loc.futureTab === 'silicon_neural') return isEn ? 'Synapse Pre · 3D Silicon & Neural Lab' : 'Synapse Pre · Chip Silicon & Neural 3D';
      if (loc.futureTab === 'phone_sensor_lab') return isEn ? 'Synapse Pre · 3D Phone Sensor Twin' : 'Synapse Pre · Cảm Biến 3D Digital Twin';
      if (loc.futureTab === 'dual_hand_sandbox') return isEn ? 'Synapse Pre · Dual-Hand GPU Field' : 'Synapse Pre · Trường Hạt GPU 2 Tay';
      if (loc.futureTab === 'cannon_ballistics_3d') return isEn ? 'Synapse Pre · 3D Artillery Ballistics' : 'Synapse Pre · Quỹ Đạo Bắn Pháo 3D';
      if (loc.futureTab === 'rocket_launch_3d') return isEn ? 'Synapse Pre · 3D Multi-Stage Rocket Launch' : 'Synapse Pre · Phóng Tên Lửa Đa Tầng 3D';
      if (loc.futureTab === 'jet_engine_3d') return isEn ? 'Synapse Pre · 3D Turbofan Jet Engine' : 'Synapse Pre · Động Cơ Phản Lực 3D';
      if (loc.futureTab === 'four_d_lectures') return isEn ? 'Synapse Pre · 4D Hypergeometry Lectures' : 'Synapse Pre · Bài Giảng Không Gian 4D';
      if (loc.futureTab === 'robotics_ik_3d') return isEn ? 'Synapse Pre · 6-DOF Robotics IK 3D' : 'Synapse Pre · Cánh Tay Robot 6-DOF 3D';
      if (loc.futureTab === 'quantum_holodeck_3d') return isEn ? 'Synapse Pre · Quantum Holodeck 3D' : 'Synapse Pre · Máy Tính Lượng Tử 3D';
      if (loc.futureTab === 'universe_forge_3d') return isEn ? 'Synapse Pre · Universe Forge 3D' : 'Synapse Pre · Lò Rèn Vũ Trụ 3D';
      if (loc.futureTab === 'nanobot_bioswarm_4d') return isEn ? 'Synapse Pre · Nanobot Bio-Swarm 4D' : 'Synapse Pre · Đàn Robot Nano 4D';
      if (loc.futureTab === 'timemachine_holo_3d') return isEn ? 'Synapse Pre · Hologram Time Machine' : 'Synapse Pre · Cỗ Máy Thời Gian 3D';
      if (loc.futureTab === 'spatial_gesture_3d') return isEn ? 'Synapse Pre · Spatial 3D & WebAR Lab' : 'Synapse Pre · Học Cảm Giác 3D & AR';
      if (loc.futureTab === 'tech_teardown_3d') return isEn ? 'Synapse Pre · 3D Teardown & Repair Workshop' : 'Synapse Pre · Xưởng Phẫu Thuật Thiết Bị 3D';
      if (loc.futureTab === 'assembly_3d') return isEn ? 'Synapse Pre · Interactive 3D Assembly Studio' : 'Synapse Pre · Mô Phỏng Lắp Ráp Cơ Khí 3D';
      if (loc.futureTab === 'solar_system_3d') return isEn ? 'Synapse Pre · Solar System 3D Ephemeris' : 'Synapse Pre · Hệ Mặt Trời 3D';
      if (loc.futureTab === 'typing_parroto_sandbox') return isEn ? 'Synapse Pre · Parroto Typing Arena' : 'Synapse Pre · Đấu Trường Luyện Gõ Parroto';
      if (loc.futureTab === 'chem_reaction_3d') return isEn ? 'Synapse Pre · 3D Chemical Reaction & Kinetics' : 'Synapse Pre · Lò Phản Ứng & Động Hóa 3D';
      if (loc.futureTab === 'chem_orbital_vsepr_3d') return isEn ? 'Synapse Pre · 3D Orbital & VSEPR Atlas' : 'Synapse Pre · Orbital & Phân Tử VSEPR 3D';
      if (loc.futureTab === 'bio_cell_atlas_3d') return isEn ? 'Synapse Pre · 3D Cell & Organelle Atlas' : 'Synapse Pre · Atlas Tế Bào & Bào Quan 3D';
      if (loc.futureTab === 'bio_dna_crispr_3d') return isEn ? 'Synapse Pre · DNA Helix & CRISPR-Cas9 3D' : 'Synapse Pre · DNA & Chỉnh Sửa Gen CRISPR 3D';
      if (loc.futureTab === 'bio_sandbox_suite') return isEn ? 'Synapse Pre · Biology Sandbox KHTN' : 'Synapse Pre · Sandbox Sinh Học KHTN';
      if (loc.futureTab === 'math_sandbox_suite') return isEn ? 'Synapse Pre · Math Sandbox KHKT' : 'Synapse Pre · Sandbox Toán Học KHKT';
      if (loc.futureTab === 'chem_future_periodic_sandbox') return isEn ? 'Synapse Pre · Future Periodic Table (118)' : 'Synapse Pre · Bảng Tuần Hoàn Tương Lai (118)';
      if (loc.futureTab === 'chem_free_research_3d') return isEn ? 'Synapse Pre · Free 3D Chemistry Lab' : 'Synapse Pre · Thí Nghiệm Hóa 3D Tự Do';
      if (loc.futureTab === 'bio_anatomy_explorer_3d') return isEn ? 'Synapse Pre · 3D Human & Animal Anatomy' : 'Synapse Pre · Giải Phẫu 3D Người & Động Vật';
      return loc.synapseMode === 'stage'
        ? isEn
          ? 'Synapse Pre · 3D Megastructure Stage'
          : 'Synapse Pre · Không gian 3D Đại công trình'
        : isEn
        ? 'Synapse Pre · Futuristic Megastructures'
        : 'Synapse Pre · Đại công trình tương lai';
    case 'spatial_3d':
      return isEn ? 'Synapse Pre · Spatial 3D Gesture Lab' : 'Synapse Pre · Học cảm giác 3D';
    case 'roadmap':
      return isEn ? 'Study Roadmap' : 'Lộ trình học';
    case 'math':
      return loc.mathViewMode === 'lecture'
        ? isEn ? 'Math Lecture' : 'Bài giảng Toán'
        : isEn ? 'Mathematics Lessons' : 'Toán học (Bài giảng)';
    case 'math_sims':
      if (loc.mathTab === 'geometry') return isEn ? 'Math 2D Geometry & Draw' : 'Vẽ Hình học Toán 2D';
      if (loc.mathTab === 'math3d') return isEn ? 'Math 3D Oxyz Studio' : 'Mô phỏng Toán 3D Oxyz';
      return isEn ? 'Math 2D Grapher & Sims' : 'Mô phỏng & Vẽ Toán 2D/3D';
    case 'physics_sims':
      return isEn ? 'Physics 2D & 3D Simulations' : 'Mô phỏng Vật lí 2D & 3D';
    case 'physics': {
      const domainName =
        PHYSICS_DOMAINS.find((d) => d.id === loc.physicsDomain)?.shortName || 'Vật lí';
      if (loc.physicsView === 'sim2d_hub') {
        return isEn ? `2D Lab · ${domainName}` : `Mô phỏng 2D · ${domainName}`;
      }
      if (loc.physicsView === 'sim3d_hub') {
        return isEn ? `3D Lab · ${domainName}` : `Mô phỏng 3D · ${domainName}`;
      }
      if (loc.physicsView === 'lecture') {
        if (loc.physicsTab === 'simulation') return isEn ? 'Physics 2D Lab' : 'Lab Vật lí 2D';
        if (loc.physicsTab === 'sim3d') return isEn ? 'Physics 3D Lab' : 'Lab Vật lí 3D';
        if (loc.physicsTab === 'practice') return isEn ? 'Physics Practice' : 'Bài tập Vật lí';
        return isEn ? 'Physics Lecture' : 'Bài giảng Vật lí';
      }
      return isEn ? 'Physics' : 'Vật lí';
    }
    case 'chemistry_sims':
      return isEn ? 'Chemistry 2D & 3D Virtual Lab' : 'Khu Mô phỏng & Lab Hóa học 2D/3D';
    case 'chemistry':
      if (loc.chemistryView === 'sim2d_hub') return isEn ? 'Chemistry 2D Lab' : 'Mô phỏng Hóa học 2D';
      if (loc.chemistryView === 'sim3d_hub') return isEn ? 'Chemistry 3D Molecular Lab' : 'Mô phỏng Hóa học 3D';
      if (loc.chemistryView === 'sandbox') return isEn ? 'Chemistry Sandboxes' : 'Sandbox Hóa học';
      if (loc.chemistryView === 'lecture') return isEn ? 'Chemistry Lecture' : 'Bài giảng Hóa học';
      return isEn ? 'Chemistry' : 'Hóa học';
    case 'biology_sims':
      return isEn ? 'Biology 2D & 3D Virtual Lab' : 'Khu Mô phỏng & Lab Sinh học 2D/3D';
    case 'biology':
      if (loc.biologyView === 'sim2d_hub') return isEn ? 'Biology 2D Lab' : 'Mô phỏng Sinh học 2D';
      if (loc.biologyView === 'sim3d_hub') return isEn ? 'Biology 3D Cell & Bio Lab' : 'Mô phỏng Sinh học 3D';
      if (loc.biologyView === 'sandbox') return isEn ? 'Biology Sandboxes' : 'Sandbox Sinh học';
      if (loc.biologyView === 'lecture') return isEn ? 'Biology Lecture' : 'Bài giảng Sinh học';
      return isEn ? 'Biology' : 'Sinh học';
    case 'cs':
      if (loc.csViewMode === 'visualizer') return isEn ? 'Algorithm Graph & Sim' : 'Đồ thị & Mô phỏng Thuật toán';
      if (loc.csViewMode === 'judge') return 'Online Judge';
      if (loc.csViewMode === 'custom') return 'Sublime Studio';
      if (loc.csSubView === 'lecture') {
        if (loc.csLessonTab === 'visualizer') return isEn ? 'CS Simulation' : 'Mô phỏng Thuật toán';
        return isEn ? 'CS Lecture' : 'Bài giảng Tin học';
      }
      return isEn ? 'CS · 5 Roadmaps' : 'Tin học · 5 Lộ trình';
    case 'cs_sims':
      return loc.csSimTab === 'viz3d'
        ? isEn ? 'Code 3D Hologram Sims' : 'Mô phỏng Code 3D'
        : isEn ? 'Code 2D/3D Simulations' : 'Mô phỏng Code 2D/3D';
    case 'exams':
      return loc.examId
        ? isEn ? 'Exam Paper' : 'Đề thi chi tiết'
        : isEn ? 'Exams' : 'Đề thi';
    case 'arena':
      return isEn ? 'Weekly Arena' : 'Thi đấu & BXH';
    case 'forum':
      return isEn ? 'Study Forum' : 'Diễn đàn học tập';
    case 'growth_hub':
      return isEn ? 'Error Notebook · SM-2 · PDF Studio' : 'Sổ tay Lỗi sai & Thẻ SM-2';
    case 'showcase':
      return isEn ? '2D/3D Community Showcase' : 'Thư viện Sáng tạo 2D/3D';
    case 'future_lab':
      if (!loc.futureTab || loc.futureTab === 'megastructures') {
        return isEn
          ? 'Synapse Pre · Futuristic Megastructures'
          : 'Synapse Pre · Đại công trình tương lai';
      }
      return isEn ? 'Synapse Pre · AI & 3D Lab' : 'Synapse Pre · Phòng Lab AI & 3D';
    default:
      return isEn ? 'Classroom' : 'Lớp học';
  }
}

function isSameLocation(a: NavLocation, b: NavLocation): boolean {
  return (
    a.subject === b.subject &&
    a.mathTab === b.mathTab &&
    a.mathViewMode === b.mathViewMode &&
    a.mathLectureId === b.mathLectureId &&
    a.physicsView === b.physicsView &&
    a.physicsDomain === b.physicsDomain &&
    a.physicsSim2D === b.physicsSim2D &&
    a.physicsSim3D === b.physicsSim3D &&
    a.physicsLessonId === b.physicsLessonId &&
    a.physicsTab === b.physicsTab &&
    a.chemistryView === b.chemistryView &&
    a.chemistryDomain === b.chemistryDomain &&
    a.chemistrySim2D === b.chemistrySim2D &&
    a.chemistrySim3D === b.chemistrySim3D &&
    a.chemistryLessonId === b.chemistryLessonId &&
    a.chemistryTab === b.chemistryTab &&
    a.biologyView === b.biologyView &&
    a.biologyDomain === b.biologyDomain &&
    a.biologySim2D === b.biologySim2D &&
    a.biologySim3D === b.biologySim3D &&
    a.biologyLessonId === b.biologyLessonId &&
    a.biologyTab === b.biologyTab &&
    a.csViewMode === b.csViewMode &&
    a.csSubView === b.csSubView &&
    a.csTrackId === b.csTrackId &&
    a.csLessonId === b.csLessonId &&
    a.csLessonTab === b.csLessonTab &&
    a.csSimTab === b.csSimTab &&
    a.csAlgoId === b.csAlgoId &&
    a.examId === b.examId &&
    a.synapseMode === b.synapseMode &&
    a.synapseMonumentId === b.synapseMonumentId &&
    a.futureTab === b.futureTab &&
    a.coopRoomCode === b.coopRoomCode &&
    a.tutorOpen === b.tutorOpen &&
    a.tutorSubject === b.tutorSubject
  );
}

interface NavigationContextValue {
  location: NavLocation;
  canGoBack: boolean;
  previousLocation: NavLocation | null;
  navigate: (patch: Partial<NavLocation>, options?: { replace?: boolean }) => void;
  selectSubject: (subject: SubjectType) => void;
  goBack: () => void;
  goClassroom: () => void;
  reviewScrollTick: number;
  requestScrollToReviews: () => void;
  directoryScrollTick: number;
  directoryFilterRequest: 'all' | 'math' | 'physics' | 'chemistry' | 'biology' | 'cs';
  requestScrollToDirectory: (filter?: 'all' | 'math' | 'physics' | 'chemistry' | 'biology' | 'cs') => void;
  mathGraphConfig: Partial<FunctionPlotConfig> | null;
  setMathGraphConfig: (cfg: Partial<FunctionPlotConfig> | null) => void;
  math3DMode: NonNullable<MathLecture['sim3dMode']>;
  setMath3DMode: (mode: NonNullable<MathLecture['sim3dMode']>) => void;
  mathGeoPreset: string | null;
  setMathGeoPreset: (preset: string | null) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<NavLocation>(getInitialLocation);
  const [historyStack, setHistoryStack] = useState<NavLocation[]>([]);
  const [reviewScrollTick, setReviewScrollTick] = useState<number>(0);
  const [directoryScrollTick, setDirectoryScrollTick] = useState<number>(0);
  const [directoryFilterRequest, setDirectoryFilterRequest] = useState<'all' | 'math' | 'physics' | 'chemistry' | 'biology' | 'cs'>('all');
  const [mathGraphConfig, setMathGraphConfig] = useState<Partial<FunctionPlotConfig> | null>(null);
  const [math3DMode, setMath3DMode] = useState<NonNullable<MathLecture['sim3dMode']>>('oxyz_vector');
  const [mathGeoPreset, setMathGeoPreset] = useState<string | null>(null);

  const locationRef = useRef<NavLocation>(location);
  const stackRef = useRef<NavLocation[]>(historyStack);
  const browserDepthRef = useRef<number>(0);
  const ignoreNextPopRef = useRef<boolean>(false);

  locationRef.current = location;
  stackRef.current = historyStack;

  // Keep a base history state marker on mount so popstate knows where we started
  useEffect(() => {
    try {
      if (!window.history.state || typeof window.history.state.eduDepth !== 'number') {
        window.history.replaceState({ ...(window.history.state || {}), eduDepth: 0 }, '');
      }
    } catch {}
  }, []);

  // Listen to browser native Back/Forward arrow clicks
  useEffect(() => {
    const onPopState = () => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }
      if (stackRef.current.length > 0) {
        const prev = stackRef.current[stackRef.current.length - 1];
        const nextStack = stackRef.current.slice(0, -1);
        stackRef.current = nextStack;
        locationRef.current = prev;
        browserDepthRef.current = Math.max(0, browserDepthRef.current - 1);
        setHistoryStack(nextStack);
        setLocation(prev);
        window.dispatchEvent(new Event('educlassroom:nav-pop'));
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((patch: Partial<NavLocation>, options?: { replace?: boolean }) => {
    const prev = locationRef.current;
    const next: NavLocation = { ...prev, ...patch };
    if (isSameLocation(prev, next)) return;

    if (!options?.replace) {
      const nextStack = [...stackRef.current.slice(-49), prev];
      stackRef.current = nextStack;
      setHistoryStack(nextStack);
      try {
        browserDepthRef.current += 1;
        window.history.pushState({ eduDepth: browserDepthRef.current }, '');
      } catch {}
    }

    locationRef.current = next;
    setLocation(next);
  }, []);

  const selectSubject = useCallback(
    (subject: SubjectType) => {
      const prev = locationRef.current;
      // When switching to a subject from header/cards, reset that subject to its top catalog/overview while closing AI drawer
      const patch: Partial<NavLocation> = {
        subject,
        tutorOpen: false
      };

      if (subject === 'math') {
        patch.mathTab = 'lectures';
        patch.mathViewMode = 'catalog';
      } else if (subject === 'math_sims') {
        patch.mathTab =
          prev.mathTab === 'grapher' || prev.mathTab === 'geometry' || prev.mathTab === 'math3d'
            ? prev.mathTab
            : 'grapher';
      } else if (subject === 'physics') {
        patch.physicsView = 'catalog';
        patch.physicsTab = 'theory';
      } else if (subject === 'chemistry_sims') {
        patch.chemistryView =
          prev.chemistryView === 'sim2d_hub' || prev.chemistryView === 'sim3d_hub' || prev.chemistryView === 'sandbox'
            ? prev.chemistryView
            : 'sim2d_hub';
      } else if (subject === 'chemistry') {
        patch.chemistryView = 'catalog';
        patch.chemistryTab = 'theory';
      } else if (subject === 'biology_sims') {
        patch.biologyView =
          prev.biologyView === 'sim2d_hub' || prev.biologyView === 'sim3d_hub' || prev.biologyView === 'sandbox'
            ? prev.biologyView
            : 'sim2d_hub';
      } else if (subject === 'biology') {
        patch.biologyView = 'catalog';
        patch.biologyTab = 'theory';
      } else if (subject === 'cs') {
        patch.csViewMode = 'curriculum';
        patch.csSubView = 'roadmap';
        patch.csLessonTab = 'lecture';
      } else if (subject === 'cs_sims') {
        patch.csSimTab = prev.csSimTab === 'viz3d' ? 'viz3d' : 'viz2d';
      } else if (subject === 'exams') {
        patch.examId = null;
      } else if (subject === 'synapse_v2') {
        patch.synapseMode = 'catalog';
        patch.futureTab =
          prev.futureTab && prev.futureTab !== 'hub' && prev.futureTab !== 'infinite_canvas'
            ? prev.futureTab
            : 'what_if_physics_3d';
      } else if (subject === 'spatial_3d') {
        patch.subject = 'synapse_v2';
        patch.synapseMode = 'catalog';
        patch.futureTab = 'spatial_gesture_3d';
      } else if (subject === 'future_lab') {
        patch.futureTab =
          prev.futureTab && prev.futureTab !== 'hub' && prev.futureTab !== 'infinite_canvas'
            ? prev.futureTab
            : 'what_if_physics_3d';
      }

      if (isSameLocation(prev, { ...prev, ...patch })) {
        return;
      }
      navigate(patch);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    if (stackRef.current.length > 0) {
      const prev = stackRef.current[stackRef.current.length - 1];
      const nextStack = stackRef.current.slice(0, -1);
      stackRef.current = nextStack;
      locationRef.current = prev;
      setHistoryStack(nextStack);
      setLocation(prev);
      window.dispatchEvent(new Event('educlassroom:nav-pop'));

      if (browserDepthRef.current > 0) {
        browserDepthRef.current -= 1;
        ignoreNextPopRef.current = true;
        try {
          window.history.back();
        } catch {
          ignoreNextPopRef.current = false;
        }
      }
      return;
    }

    // Fallback when stack is empty (e.g. direct deep action)
    const cur = locationRef.current;
    if (cur.tutorOpen) {
      navigate({ tutorOpen: false }, { replace: true });
    } else if (cur.subject !== 'overview') {
      navigate({ subject: 'overview', tutorOpen: false }, { replace: true });
    }
  }, [navigate]);

  const goClassroom = useCallback(() => {
    const prev = locationRef.current;
    if (prev.subject === 'overview' && !prev.tutorOpen) return;
    navigate({ subject: 'overview', tutorOpen: false });
  }, [navigate]);

  const requestScrollToReviews = useCallback(() => {
    const prev = locationRef.current;
    if (prev.subject !== 'overview' || prev.tutorOpen) {
      navigate({ subject: 'overview', tutorOpen: false });
    }
    setReviewScrollTick((n) => n + 1);
  }, [navigate]);

  const requestScrollToDirectory = useCallback(
    (filter: 'all' | 'math' | 'physics' | 'chemistry' | 'biology' | 'cs' = 'all') => {
      const prev = locationRef.current;
      setDirectoryFilterRequest(filter);
      if (prev.subject !== 'overview' || prev.tutorOpen) {
        navigate({ subject: 'overview', tutorOpen: false });
      }
      setDirectoryScrollTick((n) => n + 1);
    },
    [navigate]
  );

  const previousLocation =
    historyStack.length > 0 ? historyStack[historyStack.length - 1] : null;
  const canGoBack =
    historyStack.length > 0 || location.tutorOpen || location.subject !== 'overview';

  return (
    <NavigationContext.Provider
      value={{
        location,
        canGoBack,
        previousLocation,
        navigate,
        selectSubject,
        goBack,
        goClassroom,
        reviewScrollTick,
        requestScrollToReviews,
        directoryScrollTick,
        directoryFilterRequest,
        requestScrollToDirectory,
        mathGraphConfig,
        setMathGraphConfig,
        math3DMode,
        setMath3DMode,
        mathGeoPreset,
        setMathGeoPreset
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used inside NavigationProvider');
  }
  return ctx;
}
