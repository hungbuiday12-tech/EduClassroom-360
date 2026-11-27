import React, { Suspense, lazy, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GalaxyBackground } from '../galaxy/GalaxyBackground';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme, CREATURE_THEME_OPTIONS } from '../../context/BackgroundContext';
import { BrandLogo } from '../common/BrandLogo';
import { CursorDodgeText } from '../common/CursorDodgeText';
import { AppearanceStudioBar } from '../common/AppearanceStudioBar';
import { GraphicsTierTriggerButton } from '../common/GraphicsTierTriggerButton';
import { LiveMeetShowcaseCard } from '../meet/LiveMeetShowcaseCard';
import {
  Sparkles,
  Compass,
  Zap,
  Code2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Play,
  FileText,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Send,
  RotateCcw,
  Globe,
  Star,
  ChevronRight,
  Sun,
  Moon,
  Wand2,
  Check,
  Volume2,
  VolumeX,
  ListOrdered,
  ChevronDown,
  Orbit,
  Hand,
  Atom,
  Mic,
  Trophy,
  GitBranch,
  MessageSquare,
  Clock,
  Sliders,
  UploadCloud,
  Layers,
  Download,
  Crown,
  HelpCircle,
  Users,
  FlaskConical,
  Dna
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useNavigation } from '../../context/NavigationContext';
import { PlatformReviews } from '../common/PlatformReviews';
import { AppDownloadGuideSection } from '../common/AppDownloadGuideSection';
import { ScrollProgressBar, ScrollReveal } from '../common/ScrollReveal';
import type {
  DirectorySubjectFilter,
  LectureDirectoryTarget
} from '../common/LectureDirectorySection';

import { CURRICULUM_COUNTS } from '../../data/curriculumCounts';
import { getPhysicsSimCounts } from '../../data/physicsDomainsData';
import { CHEMISTRY_2D_SIMS, CHEMISTRY_3D_SIMS } from '../../data/chemistryDomainsData';
import { BIOLOGY_2D_SIMS, BIOLOGY_3D_SIMS } from '../../data/biologyDomainsData';
import { PRE_STUDIOS } from '../../data/preLabsData';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../../data/csTracksData';

const LectureDirectorySection = lazy(() =>
  import('../common/LectureDirectorySection').then((m) => ({ default: m.LectureDirectorySection }))
);

interface VisitorLandingPageProps {
  onEnterAsGuest: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onOpenInstallApp?: () => void;
}

type LandingSpotlightKey =
  | 'synapse_v2'
  | 'spatial_3d'
  | 'math'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'cs'
  | 'exams';
type FeatureCategoryFilter = 'all' | 'simulation' | 'curriculum_ai' | 'arena_tools';

export const VisitorLandingPage: React.FC<VisitorLandingPageProps> = ({
  onEnterAsGuest,
  isDark = true,
  onToggleTheme,
  onOpenInstallApp,
}) => {
  const {
    loginWithGoogle,
    loginWithGoogleDirectly,
    loginWithUsernameOrEmail,
    registerAccount,
    sendResetPasswordMail,
  } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { isBgPlaying, toggleBgPlaying, bgSound } = useAudio();
  const { navigate } = useNavigation();
  const isEn = language === 'en';
  const phyCounts = getPhysicsSimCounts();
  const [directorySubject, setDirectorySubject] = useState<DirectorySubjectFilter>('all');

  const scrollToVisitorReviews = () => {
    const el = document.getElementById('visitor-platform-reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToLectureDirectory = (subj: DirectorySubjectFilter = 'all') => {
    setDirectorySubject(subj);
    window.setTimeout(() => {
      const el = document.getElementById('visitor-lecture-directory');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 30);
  };

  const [focusedShowcase, setFocusedShowcase] = useState<'synapse_v2' | 'spatial_3d' | 'forum' | null>(null);
  const [synapsePreviewDomain, setSynapsePreviewDomain] = useState<'physics' | 'space' | 'cs' | 'math'>('physics');
  const [spatialPreviewTab, setSpatialPreviewTab] = useState<'models3d' | 'labs2d'>('models3d');
  const [forumPreviewTab, setForumPreviewTab] = useState<'discussions' | 'solutions' | 'qa'>('discussions');
  const showcaseFocusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (showcaseFocusTimerRef.current) {
        window.clearTimeout(showcaseFocusTimerRef.current);
      }
    };
  }, []);

  const handleEnterSynapseV2 = () => {
    navigate({ subject: 'synapse_v2', futureTab: 'what_if_physics_3d', synapseMode: 'catalog', tutorOpen: false });
    onEnterAsGuest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterSpatial3D = () => {
    navigate({ subject: 'synapse_v2', futureTab: 'spatial_gesture_3d', synapseMode: 'catalog', tutorOpen: false });
    onEnterAsGuest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterForum = () => {
    navigate({ subject: 'forum', tutorOpen: false });
    onEnterAsGuest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToShowcase = (target: 'synapse_v2' | 'spatial_3d' | 'forum') => {
    const id =
      target === 'synapse_v2'
        ? 'visitor-synapse-overview'
        : target === 'spatial_3d'
        ? 'visitor-spatial-overview'
        : 'visitor-forum-overview';
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setFocusedShowcase(null);
    if (showcaseFocusTimerRef.current) {
      window.clearTimeout(showcaseFocusTimerRef.current);
    }
    window.requestAnimationFrame(() => {
      setFocusedShowcase(target);
    });
    showcaseFocusTimerRef.current = window.setTimeout(() => {
      setFocusedShowcase(null);
    }, 2400);
  };

  const scrollToVisitorSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenLectureFromVisitor = (target: LectureDirectoryTarget) => {
    if (target.subject === 'math') {
      navigate({
        subject: 'math',
        mathTab: 'lectures',
        mathViewMode: 'lecture',
        mathLectureId: target.lectureId,
        tutorOpen: false
      });
    } else if (target.subject === 'physics') {
      navigate({
        subject: 'physics',
        physicsView: 'lecture',
        physicsLessonId: target.lectureId,
        physicsTab: 'theory',
        tutorOpen: false
      });
    } else if (target.subject === 'chemistry') {
      navigate({
        subject: 'chemistry',
        chemistryView: 'lecture',
        chemistryLessonId: target.lectureId,
        chemistryTab: 'theory',
        tutorOpen: false
      });
    } else if (target.subject === 'biology') {
      navigate({
        subject: 'biology',
        biologyView: 'lecture',
        biologyLessonId: target.lectureId,
        biologyTab: 'theory',
        tutorOpen: false
      });
    } else {
      navigate({
        subject: 'cs',
        csViewMode: 'curriculum',
        csSubView: 'lecture',
        csLessonId: target.lectureId,
        csLessonTab: 'lecture',
        tutorOpen: false
      });
    }
    onEnterAsGuest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCsTrackFromVisitor = (csTrackId: CSTrackId) => {
    navigate({
      subject: 'cs',
      csViewMode: 'curriculum',
      csSubView: 'roadmap',
      csTrackId,
      tutorOpen: false
    });
    onEnterAsGuest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Card Modes on Landing: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Reset password
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unauthDomainWarning, setUnauthDomainWarning] = useState<string | null>(null);
  const { creatureTheme, setCreatureTheme } = useBackgroundTheme();
  const [isCreatureMenuOpen, setIsCreatureMenuOpen] = useState(false);
  const [creatureCoords, setCreatureCoords] = useState<{ top: number; right: number }>({
    top: 66,
    right: 24
  });
  const creatureMenuRef = useRef<HTMLDivElement | null>(null);
  const creaturePanelRef = useRef<HTMLDivElement | null>(null);

  const syncCreatureCoords = () => {
    const rect = creatureMenuRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCreatureCoords({
      top: Math.round(rect.bottom + 8),
      right: Math.max(12, Math.round(window.innerWidth - rect.right))
    });
  };

  useEffect(() => {
    if (!isCreatureMenuOpen) return;
    syncCreatureCoords();
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = creatureMenuRef.current?.contains(target);
      const inPanel = creaturePanelRef.current?.contains(target);
      if (!inTrigger && !inPanel) {
        setIsCreatureMenuOpen(false);
      }
    };
    const handleReposition = () => syncCreatureCoords();
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isCreatureMenuOpen]);

  const [activeSpotlight, setActiveSpotlight] = useState<LandingSpotlightKey>('synapse_v2');
  const [featureCategory, setFeatureCategory] = useState<FeatureCategoryFilter>('all');
  const activeCreature =
    CREATURE_THEME_OPTIONS.find((opt) => opt.id === creatureTheme) || CREATURE_THEME_OPTIONS[0];

  const totalExams = CURRICULUM_COUNTS.totalExams;
  const chuyenExams = CURRICULUM_COUNTS.chuyenExams;
  const khongChuyenExams = CURRICULUM_COUNTS.standardExams;
  const csSpecializedStageCount = CS_SPECIALIZED_TRACKS.reduce((s, t) => s + t.stages.length, 0);
  const totalLessons = CURRICULUM_COUNTS.totalLessons;
  const mathCount = CURRICULUM_COUNTS.mathLectures;
  const physicsCount = CURRICULUM_COUNTS.physicsLessons;
  const chemistryCount = CURRICULUM_COUNTS.chemistryLessons;
  const biologyCount = CURRICULUM_COUNTS.biologyLessons;
  const csCount = CURRICULUM_COUNTS.csLessons;
  const chemTotalSims = CHEMISTRY_2D_SIMS.length + CHEMISTRY_3D_SIMS.length;
  const bioTotalSims = BIOLOGY_2D_SIMS.length + BIOLOGY_3D_SIMS.length;
  const preTotal = PRE_STUDIOS.length;
  const preLabsCount = PRE_STUDIOS.filter((s) => s.sidebarGroup === 'labs').length;
  const preSimsCount = PRE_STUDIOS.filter((s) => s.sidebarGroup === 'simulations').length;
  const preSandboxesCount = PRE_STUDIOS.filter((s) => s.sidebarGroup === 'sandboxes').length;

  const spotlightDetails: Record<
    LandingSpotlightKey,
    {
      label: string;
      badge: string;
      headline: string;
      summary: string;
      highlights: string[];
      accentClass: string;
    }
  > = {
    synapse_v2: {
      label: isEn ? `Synapse Pre · ${preTotal} Labs & AI Pro` : `Synapse Pre · ${preTotal} Lab & AI Pro`,
      badge: isEn
        ? `${preTotal} Pre Studios (5 Subject Zones) · Syn AI Pro · Voice OS`
        : `${preTotal} Không Gian (5 Khu Môn) · Syn AI Pro · Voice OS`,
      headline: isEn
        ? `Synapse Pre: ${preTotal} Subject-Partitioned 3D/4D Labs, Dedicated Syn AI Pro & Voice OS`
        : `Synapse Pre: ${preTotal} Phòng Lab / Mô Phỏng / Sandboxes Phân Khu 5 Môn & Syn AI Pro`,
      summary: isEn
        ? `Organizes all ${preTotal} advanced WebGL studios by subject zone across 3 sidebar menus (${preLabsCount} Labs, ${preSimsCount} Simulations including 3D Chem Reaction, Orbital VSEPR, Cell Atlas, DNA CRISPR & Mechanical Assembly, ${preSandboxesCount} Sandboxes) alongside exclusive Syn AI Pro & Voice OS.`
        : `Phân tách rành mạch ${preTotal} không gian 3D/4D theo từng môn (Toán, Lí, Hóa, Sinh, Tin) và 3 nhóm menu trái (${preLabsCount} Phòng Lab, ${preSimsCount} Mô phỏng gồm Lò Phản Ứng Hóa, Orbital VSEPR, Atlas Tế Bào, CRISPR 3D & Lắp Ráp Cơ Khí, ${preSandboxesCount} Sandboxes) cùng Syn AI Pro riêng biệt & Voice OS.`,
      highlights: isEn
        ? [
            `3 Sidebar Menus × 5 Subjects: ${preLabsCount} Labs · ${preSimsCount} Sims · ${preSandboxesCount} Sandboxes`,
            'Dedicated Syn AI Pro + Pause/Resume Minichat + 3B1B Video Studio',
            'Hands-free Synapse Voice OS (Alt+Space) & Multi-User Shared Syn Meet 3D',
          ]
        : [
            `3 Nhóm Menu Trái × 5 Môn: ${preLabsCount} Lab · ${preSimsCount} Mô phỏng · ${preSandboxesCount} Sandboxes`,
            'Syn AI Pro độc quyền (3 tầng, Sơ đồ Pro, Video 3B1B) & Tạm đóng giữ hội thoại',
            'Voice OS ra lệnh giọng nói (Alt+Space) & Syn Meet chiếu 3D nhiều người',
          ],
      accentClass: 'text-amber-700 dark:text-amber-300 border-amber-500/35 bg-amber-500/10',
    },
    spatial_3d: {
      label: isEn ? 'Spatial 3D & Holo Atlas' : 'Học 3D & Atlas Giải Phẫu/Mô Hình',
      badge: isEn
        ? 'Holo Atlas 58 Parts · 10-Finger AI · Fullscreen Dock'
        : 'Atlas 58 Bộ Phận · 10 Ngón Tay · Toàn Màn Hình Đủ Công Cụ',
      headline: isEn
        ? 'Holo Atlas 3D Explorer, WebAR Desk Pro & 10-Finger / Mouse Inspection'
        : 'Holo Atlas 3D (58 Bộ Phận Chi Tiết), WebAR Bàn Học & Điều Khiển 10 Ngón / Chuột',
      summary: isEn
        ? 'Inspect multi-part 3D assemblies in an interactive Atlas layout with part filtering, X-Ray, horizontal exploded rows, WebAR Desk Pro, 10-finger webcam control, and full toolbar retention even in Fullscreen mode.'
        : 'Quan sát mô hình 3D chi tiết theo giao diện Atlas trực quan: lọc nhóm bộ phận, bật X-Quang, tách lớp 1 hàng ngang, chiếu WebAR lên bàn học, điều khiển 10 ngón tay hoặc chuột và giữ nguyên toàn bộ chức năng khi bật Toàn màn hình.',
      highlights: isEn
        ? [
            'Atlas Inspector: Filter sub-systems, isolate parts, X-Ray & horizontal explode',
            'Full toolbar & sidebar preserved cleanly when entering Fullscreen mode',
            'WebAR Desk Pro (Rear/Front cam, Y-slice, PNG) + 10-Finger / Mouse controls',
          ]
        : [
            'Giao diện Atlas trực quan: lọc bộ phận, tách rời từng phần, X-Quang & xếp hàng',
            'Bật Toàn màn hình vẫn giữ đầy đủ thanh điều khiển, chú thích & điều hướng',
            'WebAR Bàn Học Pro (Cam sau/trước, Cắt lớp Y, Lưu PNG) + 10 ngón / Chuột',
          ],
      accentClass: 'text-teal-700 dark:text-teal-300 border-teal-500/30 bg-teal-500/10',
    },
    math: {
      label: isEn ? 'Math 2D & 3D' : 'Toán 2D & 3D',
      badge: isEn ? `${mathCount} Grades 6–12 topics` : `${mathCount} chuyên đề 6–12`,
      headline: isEn
        ? 'Oxy Analytic Grapher, Circle Geometry & 11 Oxyz 3D Scenes'
        : 'Đồ thị Oxy, Đường tròn Tương tác & 11 mô hình Oxyz 3D',
      summary: isEn
        ? 'Plot polynomials, rationals, exponentials, logarithms, and integrals; explore circle chords, tangents, Power of a Point and ellipses in 2D alongside sphere tangent cones, Conic sections and Oxyz lines.'
        : 'Khảo sát hàm đa thức, phân thức, mũ – lôgarit, tích phân; tương tác dây cung, góc nội tiếp, hai tiếp tuyến, phương tích đường tròn 2D cùng nón tiếp tuyến mặt cầu và Oxyz 3D.',
      highlights: isEn
        ? [
            'Visualize definite integral shaded area ∫ f(x)dx',
            '11 interactive 3D scenes: Circle Spheres, Conic, Oxyz, Pyramids',
            '5-step lectures + 2 MCQs & 1 essay synced with AI roadmap',
          ]
        : [
            'Tô bóng diện tích tích phân ∫ f(x)dx & Hình học Đường tròn',
            '11 cảnh 3D xoay tự do: Tiếp tuyến cầu, Conic, Oxyz, Thiết diện chóp',
            'Bài giảng 5 bước + 2 TN & 1 TL tự lưu phân tích lộ trình AI',
          ],
      accentClass: 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
    physics: {
      label: isEn ? 'Physics 2D & 3D' : 'Vật Lí 2D & 3D',
      badge: isEn
        ? `${phyCounts.domainCount} Domains · ${physicsCount} lessons (Grades 6–12)`
        : `${phyCounts.domainCount} Lĩnh vực tách riêng · ${physicsCount} bài 6–12`,
      headline: isEn
        ? `${phyCounts.domainCount} Dedicated Physics Domains (2D & Standardized 3D) + THCS/THPT/Olympiad`
        : `Mô Phỏng Vật Lí 2D/3D Tách Riêng ${phyCounts.domainCount} Chuyên Đề (Chuẩn Hóa Bệ Pháo 3D)`,
      summary: isEn
        ? `Separate pages for Mechanics, Waves/Oscillations, Electricity/Magnetism, Optics/Quantum & Thermal/Nuclear with precision 3D projectile cannon alignment, drag-and-drop 36-tool lab bench, and clear Grades 6–12 lessons.`
        : `Tách riêng ${phyCounts.domainCount} chuyên đề (Cơ học, Sóng & Dao động, Điện & Điện từ, Quang & Lượng tử, Nhiệt & Hạt nhân) kèm bệ pháo ném xiên 3D đồng bộ chuẩn tâm nòng, bộ 36 dụng cụ đo kéo thả & bài giảng Lớp 6–12 / Chuyên.`,
      highlights: isEn
        ? [
            `${phyCounts.count2D} 2D Labs & ${phyCounts.count3D} 3D Models across ${phyCounts.domainCount} domains`,
            'Drag-and-drop Ammeter, Voltmeter, Oscilloscope, Ruler & 32 more tools',
            'Calibrated 3D Cannon ballistics + adaptive Grade 6–12 & Olympiad notes',
          ]
        : [
            `${phyCounts.count2D} Lab 2D & ${phyCounts.count3D} mô hình 3D chia thành ${phyCounts.domainCount} lĩnh vực riêng`,
            'Kéo thả 36 dụng cụ đo trực tiếp & gợi ý dụng cụ riêng cho mỗi bài',
            'Chuẩn hóa góc bắn bệ pháo 3D khớp nòng pháo & quỹ đạo parabol thực',
          ],
      accentClass: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    chemistry: {
      label: isEn ? 'Chemistry 2D/3D & Sandbox' : 'Hóa Học 2D/3D & Sandbox',
      badge: isEn
        ? `${chemistryCount} Lessons · ${chemTotalSims} Labs + 4 Sandboxes`
        : `${chemistryCount} Bài (2006/2018/Chuyên) · ${chemTotalSims} Lab + 4 Sandbox`,
      headline: isEn
        ? 'Dedicated Chemistry Zone: Titration, Stoichiometry, Organic & VSEPR 3D'
        : 'Khu Vực Hóa Học Riêng: Chuẩn Độ, Cân Bằng PTHH, Hữu Cơ & VSEPR 3D',
      summary: isEn
        ? `Full Grades 6–12 GDPT 2006, 2018 & Olympiad lectures paired with ${CHEMISTRY_2D_SIMS.length} 2D interactive canvases, ${CHEMISTRY_3D_SIMS.length} 3D VSEPR/crystal labs, 4 standalone Chemistry Sandboxes, and 350 Chemistry exams.`
        : `Trọn bộ ${chemistryCount} bài giảng Lớp 6–12 (GDPT 2006, 2018 & Chuyên HSG) cùng ${CHEMISTRY_2D_SIMS.length} thí nghiệm 2D, ${CHEMISTRY_3D_SIMS.length} mô hình VSEPR/Tinh thể 3D, 4 Sandbox tách riêng và 350 đề thi Hóa.`,
      highlights: isEn
        ? [
            `${chemistryCount} lessons + Syn Chem AI (Ctrl+H) & 350 Chem exams`,
            `${CHEMISTRY_2D_SIMS.length} 2D + ${CHEMISTRY_3D_SIMS.length} 3D molecular labs & 4 Chemistry Sandboxes`,
            'Pre 3D Chem Reaction Potential Surface & Quantum Orbital Labs',
          ]
        : [
            `${chemistryCount} bài 2006/2018/Chuyên · Syn Chem AI (Ctrl+H) & 350 Đề Hóa`,
            `${CHEMISTRY_2D_SIMS.length} Lab 2D + ${CHEMISTRY_3D_SIMS.length} Lab 3D & 4 Sandbox Hóa tách riêng`,
            'Bổ trợ Pre: Lò Phản Ứng Ea 3D & Orbital Lai Hóa VSEPR 3D',
          ],
      accentClass: 'text-violet-700 dark:text-violet-300 border-violet-500/35 bg-violet-500/10',
    },
    biology: {
      label: isEn ? 'Biology 2D/3D & Sandbox' : 'Sinh Học 2D/3D & Sandbox',
      badge: isEn
        ? `${biologyCount} Lessons · ${bioTotalSims} Labs + 4 Sandboxes`
        : `${biologyCount} Bài (2006/2018/Chuyên) · ${bioTotalSims} Lab + 4 Sandbox`,
      headline: isEn
        ? 'Dedicated Biology Zone: Cell Atlas, DNA/CRISPR 3D & Mendel Genetics Sandbox'
        : 'Khu Vực Sinh Học Riêng: Atlas Tế Bào, ADN/CRISPR 3D & Sandbox Di Truyền',
      summary: isEn
        ? `Complete Grades 6–12 GDPT 2006, 2018 & Olympiad lectures paired with ${BIOLOGY_2D_SIMS.length} 2D labs, ${BIOLOGY_3D_SIMS.length} 3D cellular/DNA scenes, 4 standalone Biology Sandboxes, and 350 Biology exams.`
        : `Đủ ${biologyCount} bài giảng Lớp 6–12 (GDPT 2006, 2018 & Chuyên HSG) cùng ${BIOLOGY_2D_SIMS.length} mô phỏng 2D, ${BIOLOGY_3D_SIMS.length} mô hình Tế bào/ADN 3D, 4 Sandbox tách riêng và 350 đề Sinh.`,
      highlights: isEn
        ? [
            `${biologyCount} lessons + Syn Bio AI (Ctrl+B) & 350 Biology exams`,
            `${BIOLOGY_2D_SIMS.length} 2D + ${BIOLOGY_3D_SIMS.length} 3D cellular labs & 4 Biology Sandboxes`,
            'Pre 3D Eukaryotic Cell Atlas & 4-Stage CRISPR-Cas9 Cutaway',
          ]
        : [
            `${biologyCount} bài 2006/2018/Chuyên · Syn Bio AI (Ctrl+B) & 350 Đề Sinh`,
            `${BIOLOGY_2D_SIMS.length} Lab 2D + ${BIOLOGY_3D_SIMS.length} Lab 3D & 4 Sandbox Sinh tách riêng`,
            'Bổ trợ Pre: Atlas Tế Bào Nhân Thực 3D & Cắt Chỉnh Gen CRISPR 3D',
          ],
      accentClass: 'text-teal-700 dark:text-teal-300 border-teal-500/35 bg-teal-500/10',
    },
    cs: {
      label: isEn ? 'CS · Trace & 5 Roadmaps' : 'Tin Học · Trace & 5 Lộ Trình',
      badge: isEn
        ? `5 Roadmaps · Code Trace 1-1 & Thought Replay`
        : `5 Lộ trình · Truy vết 1-1 & Replay Tư Duy`,
      headline: isEn
        ? '5 Complete CS Roadmaps, Sublime 4, Live Code-to-Animation Trace & Thought Replay'
        : '5 Lộ Trình Tin Học, IDE Sublime 4, Truy Vết Biến Từng Dòng & Replay Tư Duy',
      summary: isEn
        ? 'Master VNOI + 4 international C++ tracks, compile real C++20/Python 3 with TLE/File I/O modes, animate variables & arrays line-by-line (Code-to-Animation Trace), and scrub Thought-Trace Replay snapshots.'
        : 'Đủ VNOI + 4 lộ trình C++ Quốc tế, biên dịch g++/Python thật có TLE & File I/O, hoạt hình hóa giá trị biến/mảng từng dòng lệnh (Code-to-Animation Trace) và tua lại quá trình sửa lỗi WA → AC.',
      highlights: isEn
        ? [
            'Live Code-to-Animation Trace (Python sys.settrace & C++ g++ trace)',
            'Thought-Trace Replay timeline (restore past code snapshots anytime)',
            `5 Roadmaps (${csCount}+${csSpecializedStageCount}), Sublime 4 & 16 Algo graphs`,
          ]
        : [
            'Truy vết từng dòng Code-to-Animation (biến, mảng DP, stdout tức thì)',
            'Replay Tư Duy lưu mọi mốc gõ/chạy/chấm & khôi phục tức thì',
            `5 Lộ trình (${csCount} VNOI + ${csSpecializedStageCount} C++), Sublime 4 & 16 Đồ thị`,
          ],
      accentClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    exams: {
      label: isEn ? `${totalExams} Exams & 5+1 AI` : `${totalExams} Đề Thi & 5+1 AI`,
      badge: isEn
        ? `${chuyenExams} Spec · 5 Subject AIs + Syn AI Pro · Pause/Resume`
        : `${chuyenExams} Chuyên · 5 AI Chuyên Môn & Syn AI Pro`,
      headline: isEn
        ? `${totalExams} Exam Bank (5 Subjects) + Dual-Tier AI (5 Base Tutors & Syn AI Pro)`
        : `Kho ${totalExams} Đề Thi 5 Môn + Hệ AI 2 Tầng (5 AI Chuyên Môn & Syn AI Pro)`,
      summary: isEn
        ? 'Free users get 5 subject tutors (Math, Physics, Chem, Bio, Code) with Live Vision & Pause/Resume continuity; Synapse Pre unlocks standalone Syn AI Pro with 3-Layer Fast Solve, Deep Reasoning, Pro Flowchart & 3B1B Video.'
        : 'Bản Free có đủ 5 AI chuyên môn (Toán · Lí · Hóa · Sinh · Tin) kèm Mắt Thần & nút Tạm đóng giữ hội thoại; Synapse Pre mở khóa trợ lý riêng Syn AI Pro (Giải 3 tầng siêu tốc, Suy luận sâu, Sơ đồ Pro & Dựng Video 3B1B).',
      highlights: isEn
        ? [
            'Pause button keeps your active conversation ready to resume anytime',
            'Free: 5 Subject AIs (Ctrl+D/F/H/B/G) · Pre: Standalone Syn AI Pro',
            `350 exams × 5 subjects (${totalExams} total) + Drag-Drop / Ctrl+V / AI grading`,
          ]
        : [
            'Nút Tạm đóng giữ nguyên nội dung chat để mở lại trò chuyện tiếp',
            'Free: 5 AI Môn (Ctrl+D/F/H/B/G) · Pre: Syn AI Pro & Video 3B1B',
            `Đủ 350 đề × 5 môn (${totalExams} đề) + Up ảnh/Ctrl+V & Chấm 0–10`,
          ],
      accentClass: 'text-cyan-700 dark:text-cyan-300 border-cyan-500/30 bg-cyan-500/10',
    },
  };

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    setUnauthDomainWarning(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      const errStr = `${err?.code || ''} ${err?.message || ''}`.toLowerCase();
      if (
        errStr.includes('unauthorized-domain') ||
        errStr.includes('unauthorized') ||
        errStr.includes('configuration-not-found')
      ) {
        // Seamlessly log in directly with Google demo session
        loginWithGoogleDirectly(
          regEmail || identifier || 'hocsinh.chuyen@gmail.com',
          regFullName || 'Học viên Chuyên'
        );
        return;
      }
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage(isEn ? 'Google sign-in window was closed.' : 'Cửa sổ đăng nhập Google đã được đóng.');
      } else {
        loginWithGoogleDirectly(
          regEmail || identifier || 'hocsinh.chuyen@gmail.com',
          regFullName || 'Học viên Chuyên'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDirect = () => {
    loginWithGoogleDirectly(
      regEmail || identifier || 'hocsinh.chuyen@gmail.com',
      regFullName || 'Học viên Chuyên'
    );
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage(isEn ? 'Please enter your username/email and password.' : 'Vui lòng nhập tên đăng nhập/email và mật khẩu.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setUnauthDomainWarning(null);
    try {
      await loginWithUsernameOrEmail(identifier, password);
    } catch (err: any) {
      const errStr = `${err?.code || ''} ${err?.message || ''}`.toLowerCase();
      if (errStr.includes('unauthorized-domain')) {
        loginWithGoogleDirectly(
          identifier.includes('@') ? identifier : `${identifier}@educlassroom360.vn`,
          identifier
        );
        return;
      }
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password'
      ) {
        setErrorMessage(isEn ? 'Incorrect username/email or password. Please check again.' : 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      } else if (err?.code === 'auth/invalid-email') {
        setErrorMessage(isEn ? 'Invalid email or username format.' : 'Định dạng email hoặc tên đăng nhập chưa hợp lệ.');
      } else {
        setErrorMessage(isEn ? 'Sign-in failed. Please retry or use a demo account.' : 'Đăng nhập thất bại. Vui lòng thử lại với mật khẩu 123456 hoặc tài khoản mẫu.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim()) {
      setErrorMessage(isEn ? 'Please choose a username (no spaces).' : 'Vui lòng nhập tên đăng nhập (viết liền không dấu).');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage(isEn ? 'Password must be at least 4 characters.' : 'Mật khẩu phải chứa ít nhất 4 ký tự.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await registerAccount(regUsername, regEmail, regPassword, regFullName);
    } catch (err: any) {
      const errStr = `${err?.code || ''} ${err?.message || ''}`.toLowerCase();
      if (errStr.includes('unauthorized-domain')) {
        // Registration already saved locally, modal will close or page will redirect
        return;
      }
      if (err?.code === 'auth/email-already-in-use') {
        setErrorMessage(isEn ? 'This username or email already exists. Try signing in.' : 'Tên đăng nhập hoặc email này đã tồn tại trong hệ thống. Bạn có thể chọn tab Đăng Nhập.');
      } else {
        setErrorMessage(isEn ? 'Registration failed. Please check your details.' : 'Đăng ký không thành công, vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage(isEn ? 'Please enter a valid email address.' : 'Vui lòng nhập email chính xác để nhận thư.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await sendResetPasswordMail(resetEmail);
      setResetSent(true);
    } catch {
      setResetSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-sky-600 selection:text-white transition-colors duration-300">
      <ScrollProgressBar />
      {/* Dynamic 60fps Galaxy Background (Works in both Dark Deep Space & Light Celestial Aurora) */}
      <GalaxyBackground interactive={true} intensity="vibrant" isDark={isDark} />

      {/* Top Navigation Bar (Single-row medium-balanced VI/EN header, never wraps to second row) */}
      <header className="relative z-40 sci-scan-bar border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 min-h-[58px] sm:min-h-[64px] flex items-center justify-between gap-2 sm:gap-3 flex-nowrap overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-0 shrink-0">
            <BrandLogo sizeClass="w-8 h-8 sm:w-9 sm:h-9" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white block truncate">
                  Synapse
                </span>
                <span aria-hidden="true" className="hidden sm:inline-flex items-end gap-[2px] h-3 pb-0.5 opacity-80">
                  <span className="w-[2px] h-full bg-sky-500 rounded-xs sci-meter-1" />
                  <span className="w-[2px] h-full bg-teal-500 rounded-xs sci-meter-2" />
                  <span className="w-[2px] h-full bg-blue-600 rounded-xs sci-meter-3" />
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-mono text-blue-700 dark:text-sky-300 -mt-0.5 truncate">
                Academic STEM Lab
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 lg:gap-2 flex-nowrap shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-slate-300/90 dark:border-white/20 bg-white/95 dark:bg-white/10 text-slate-800 dark:text-slate-100 hover:bg-sky-50 dark:hover:bg-white/20 hover:border-sky-400 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400 icon-anim-globe shrink-0" />
              <span className={!isEn ? 'text-blue-700 dark:text-sky-300 font-black' : 'opacity-60'}>VI</span>
              <span className="opacity-40">/</span>
              <span className={isEn ? 'text-blue-700 dark:text-sky-300 font-black' : 'opacity-60'}>EN</span>
            </button>

            <div className="relative shrink-0" ref={creatureMenuRef}>
              <button
                type="button"
                onClick={() => {
                  syncCreatureCoords();
                  setIsCreatureMenuOpen((v) => !v);
                }}
                aria-expanded={isCreatureMenuOpen}
                className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-sky-200/90 dark:border-white/20 bg-white/95 dark:bg-white/10 text-blue-700 dark:text-sky-200 hover:bg-sky-50 dark:hover:bg-white/20 hover:border-sky-400 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title={isEn ? 'Choose interactive background creature' : 'Chọn sinh vật nền tương tác'}
              >
                <Wand2 className="w-4 h-4 icon-anim-wand shrink-0" />
                <span className="hidden lg:inline">{isEn ? activeCreature.shortEn : activeCreature.shortVi}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-75 transition-transform duration-200 ${
                    isCreatureMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCreatureMenuOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                  <div
                    ref={creaturePanelRef}
                    style={{ top: creatureCoords.top, right: creatureCoords.right }}
                    className="fixed w-64 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-200 dark:border-white/15 rounded-xl shadow-[0_24px_64px_-12px_rgba(15,23,42,0.4)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] p-1.5 z-[220] text-xs max-h-[75vh] overflow-y-auto"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                      {isEn ? 'Interactive Background' : 'Nền Sinh Vật Tương Tác'}
                    </div>
                    {CREATURE_THEME_OPTIONS.map((opt) => {
                      const selected = opt.id === creatureTheme;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setCreatureTheme(opt.id);
                            setIsCreatureMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer ${
                            selected
                              ? 'bg-sky-50 dark:bg-sky-950/70 text-blue-700 dark:text-sky-300 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{isEn ? opt.labelEn : opt.labelVi}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>,
                  document.body
                )}
            </div>

            <button
              type="button"
              onClick={() => {
                navigate({ subject: 'guide', tutorOpen: false });
                onEnterAsGuest();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3.5 py-1.5 text-xs font-extrabold rounded-md border border-cyan-400/70 bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-600 hover:text-white shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Interactive Visual Guide' : 'Hướng dẫn cách hoạt động & tính năng'}
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Guide' : 'Hướng dẫn'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate({ subject: 'authors', tutorOpen: false });
                onEnterAsGuest();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-slate-300/90 dark:border-white/20 bg-white/95 dark:bg-white/10 text-slate-800 dark:text-slate-100 hover:border-slate-500 dark:hover:border-sky-400 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Meet the Creators (Class 9/4)' : 'Giới thiệu nhóm tác giả (9/4 THCS Bến Tre)'}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">{isEn ? 'Authors' : 'Tác giả'}</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToLectureDirectory('all')}
              className="group cs-deck-btn flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 text-xs font-extrabold rounded-md border border-blue-500/60 dark:border-sky-400/50 bg-blue-600/10 dark:bg-sky-500/20 text-blue-700 dark:text-sky-200 hover:bg-blue-700 hover:text-white dark:hover:bg-sky-600 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Table of Contents · Jump to Lectures' : 'Mục lục · Cuộn xuống Danh sách bài giảng'}
            >
              <ListOrdered className="w-4 h-4 icon-anim-list shrink-0" />
              <span>{isEn ? 'Contents' : 'Mục lục'}</span>
            </button>

            <button
              type="button"
              onClick={scrollToVisitorReviews}
              className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-amber-300/90 dark:border-amber-400/40 bg-amber-50/95 dark:bg-amber-950/45 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Scroll to Reviews & Votes' : 'Cuộn xuống Đánh giá & Bình chọn'}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 icon-anim-star shrink-0" />
              <span className="hidden xl:inline">{isEn ? 'Reviews' : 'Đánh giá'}</span>
            </button>

            <button
              type="button"
              onClick={toggleBgPlaying}
              className={`group cs-deck-btn p-2 rounded-md border shadow-xs transition-all cursor-pointer shrink-0 ${
                isBgPlaying && bgSound !== 'off'
                  ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-white/20 bg-white/95 dark:bg-white/10 text-slate-600 dark:text-slate-200 hover:border-sky-400'
              }`}
              title={isEn ? 'Toggle background music' : 'Bật/tắt âm thanh nền'}
            >
              {isBgPlaying && bgSound !== 'off' ? (
                <Volume2 className="w-4 h-4 icon-anim-wave" />
              ) : (
                <VolumeX className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="group cs-deck-btn p-2 text-slate-600 dark:text-slate-200 bg-white/95 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-amber-50 dark:hover:bg-white/20 rounded-md shadow-xs transition-all cursor-pointer shrink-0"
                title={isEn ? (isDark ? 'Switch to Light' : 'Switch to Dark') : isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 icon-anim-star" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-700 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            {onOpenInstallApp && (
              <button
                type="button"
                onClick={onOpenInstallApp}
                className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-sky-400/70 bg-sky-500/15 text-blue-700 dark:text-sky-200 hover:bg-sky-500 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                title={isEn ? 'Install Synapse App (Laptop, Android & iPhone)' : 'Tải Ứng dụng cho Laptop, Android & iPhone'}
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden lg:inline">{isEn ? 'Get App' : 'Tải App'}</span>
              </button>
            )}

            <button
              onClick={onEnterAsGuest}
              className="group cs-deck-btn px-3 lg:px-4 py-1.5 text-xs font-bold rounded-md bg-blue-700 text-white dark:bg-sky-500 dark:text-slate-950 hover:bg-blue-800 dark:hover:bg-sky-400 border border-transparent transition-all flex items-center gap-1.5 shadow-md whitespace-nowrap cursor-pointer shrink-0"
            >
              <span className="hidden md:inline">{isEn ? 'Explore as Guest' : 'Vào trải nghiệm thử'}</span>
              <span className="md:hidden">{isEn ? 'Try Now' : 'Vào thử'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>
      </header>

      {/* Grand Hero Section with Dedicated Auth Portal */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Academic Presentation */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-sky-500/10 border border-sky-400/35 text-xs font-semibold text-blue-700 dark:text-sky-300 backdrop-blur-sm max-w-full">
              <Star className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-300 fill-amber-400" />
              <span className="truncate sm:whitespace-normal">
                {isEn
                  ? 'Interactive Visual Learning Ecosystem Grades 6–12 · Math–Physics–CS Core'
                  : 'Hệ Sinh Thái Liên Thông Lớp 6–12 · Mũi Nhọn Toán – Lý – Tin'}
              </span>
            </div>

            <CursorDodgeText
              as="h1"
              text={
                isEn
                  ? 'Explore the 360° Interactive STEM Observatory'
                  : 'Khám Phá Vũ Trụ Học Tập Trực Quan Synapse 360°'
              }
              highlightWords={['observatory', 'synapse', '360°', 'trực', 'quan']}
              className="font-display text-2xl sm:text-4xl lg:text-[2.95rem] font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.15] hero-blend-shadow"
            />

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {isEn ? (
                <>
                  Complete Grades 6–12 THCS/THPT &amp; Olympiad STEM workspace (Math–Physics–CS spearhead) featuring{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Free Base Classroom ({totalLessons} lessons across Math, Physics, Chem, Bio 6–12 &amp; standalone CS · {totalExams} exams · 2D/3D Labs &amp; Sandboxes · Sublime 4 Code Trace 1-1)</strong>{' '}
                  and{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Synapse Pre ({preTotal} 3D/4D Studios split by subject · Dedicated Syn AI Pro &amp; 3B1B Video · Voice OS · Shared Syn Meet 3D)</strong>, plus{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Holo Atlas 58-part 3D &amp; WebAR Desk Pro</strong>.
                </>
              ) : (
                <>
                  Hệ sinh thái học tập toàn diện cho THCS, THPT &amp; Đội tuyển Chuyên:{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Bản Miễn Phí ({totalLessons} bài giảng 5 môn · {totalExams} đề thi · Hóa &amp; Sinh 2D/3D + Sandbox tách riêng · IDE Sublime 4 Trace 1-1 · 5 AI Chuyên Môn có nút Tạm đóng)</strong>{' '}
                  và{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Synapse Pre ({preTotal} Lab, Mô phỏng &amp; Sandboxes phân khu 5 môn · Syn AI Pro độc quyền &amp; Video 3B1B · Voice OS · Meet 3D)</strong>, cùng{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Học Cảm Giác 3D Holo Atlas 58 bộ phận &amp; WebAR Pro</strong>.
                </>
              )}
            </p>

            {/* Interactive 8-Pillar Quick Cards (5 Subjects + Pre + Atlas + Exams/AI) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('synapse_v2')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'synapse_v2'
                    ? 'bg-white dark:bg-slate-900/90 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-amber-400/60'
                }`}
              >
                <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Synapse Pre · AI Pro' : 'Synapse Pre · AI Pro'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${preTotal} Labs · 5 Zones` : `${preTotal} Lab · 5 Khu Môn`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('spatial_3d')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'spatial_3d'
                    ? 'bg-white dark:bg-slate-900/90 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-teal-400/60'
                }`}
              >
                <Hand className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-1.5 icon-anim-hand" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Holo Atlas 3D' : 'Học cảm giác 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? '58 Parts · WebAR' : '58 Bộ phận · WebAR'}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('physics')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'physics'
                    ? 'bg-white dark:bg-slate-900/90 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-amber-400/60'
                }`}
              >
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5 icon-anim-zap" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Physics 2D & 3D' : 'Vật Lí 2D & 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn
                    ? `${physicsCount} lessons · ${phyCounts.total} Labs`
                    : `${physicsCount} bài · ${phyCounts.total} Lab`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('chemistry')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'chemistry'
                    ? 'bg-white dark:bg-slate-900/90 border-violet-500 ring-2 ring-violet-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-violet-400/60'
                }`}
              >
                <FlaskConical className="w-5 h-5 text-violet-600 dark:text-violet-400 mb-1.5 icon-anim-flask" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Chemistry 2D/3D' : 'Hóa Học 2D & 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${chemistryCount} · ${chemTotalSims}+4 Labs` : `${chemistryCount} bài · ${chemTotalSims}+4 Lab`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('biology')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'biology'
                    ? 'bg-white dark:bg-slate-900/90 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-teal-400/60'
                }`}
              >
                <Dna className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-1.5 icon-anim-dna" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Biology 2D/3D' : 'Sinh Học 2D & 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${biologyCount} · ${bioTotalSims}+4 Labs` : `${biologyCount} bài · ${bioTotalSims}+4 Lab`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('math')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'math'
                    ? 'bg-white dark:bg-slate-900/90 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-400/60'
                }`}
              >
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1.5 icon-anim-compass" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Math 2D / Oxyz' : 'Toán 2D / Oxyz 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${mathCount} · 11 3D scenes` : `${mathCount} bài · 11 cảnh 3D`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('cs')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'cs'
                    ? 'bg-white dark:bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-400/60'
                }`}
              >
                <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5 icon-anim-code" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'CS · 5 Roadmaps' : 'Tin Học · 5 Lộ Trình'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${csCount}+${csSpecializedStageCount} Trace` : `${csCount}+${csSpecializedStageCount} Trace`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('exams')}
                className={`group cs-deck-btn min-w-0 text-left p-3 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'exams'
                    ? 'bg-white dark:bg-slate-900/90 border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-400/60'
                }`}
              >
                <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-1.5 icon-anim-award" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate tabular-nums">
                  {isEn ? `${totalExams} Exams & AI` : `${totalExams} Đề & 5+1 AI`}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? '5 AIs + Syn AI Pro' : '5 AI Môn · AI Pro'}
                </p>
              </button>
            </div>

            {/* Interactive Feature Spotlight Panel */}
            <div className="sci-frame sci-blueprint-bg p-4 sm:p-5 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/15 backdrop-blur-md shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${spotlightDetails[activeSpotlight].accentClass}`}>
                  {spotlightDetails[activeSpotlight].badge}
                </span>
                {(activeSpotlight === 'synapse_v2' || activeSpotlight === 'spatial_3d') ? (
                  <button
                    type="button"
                    onClick={() => scrollToShowcase(activeSpotlight)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-sky-300 hover:underline cursor-pointer"
                  >
                    <span>{isEn ? 'Jump to animated overview below' : 'Xem khung giới thiệu chi tiết bên dưới'}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? 'Click any card above to inspect features' : 'Bấm từng thẻ phía trên để xem chi tiết tính năng'}
                  </span>
                )}
              </div>
              <h3 className="font-display text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                {spotlightDetails[activeSpotlight].headline}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {spotlightDetails[activeSpotlight].summary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {spotlightDetails[activeSpotlight].highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-200 bg-slate-100/85 dark:bg-white/5 px-2.5 py-2 rounded border border-slate-200/60 dark:border-white/10"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prominent 3-Tier Graphics Setup Button + Live Studio Bar */}
            <GraphicsTierTriggerButton variant="landing" />
            <AppearanceStudioBar compact />

            {/* Quick Guest Enter Action + Synapse 2.0 + Học tương tác 3D + Diễn đàn học tập + All Features */}
            <div className="pt-1 space-y-2.5 w-full max-w-full">
              <div className="flex flex-wrap items-center gap-2.5 w-full max-w-full">
                <button
                  type="button"
                  data-ripple="true"
                  onClick={onEnterAsGuest}
                  className="sci-frame cs-deck-btn w-full sm:w-auto max-w-full px-5 py-3 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform shrink-0" />
                  <span>{isEn ? 'Enter Classroom Directly (Guest Mode)' : 'Vào Trực Tiếp Lớp Học (Không Cần Đăng Nhập)'}</span>
                  <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => scrollToVisitorSection('visitor-all-features')}
                  className="group cs-deck-btn w-full sm:w-auto max-w-full px-4 py-3 rounded-md bg-white/95 dark:bg-white/10 hover:bg-sky-50 dark:hover:bg-sky-950/45 border border-slate-300/90 dark:border-white/20 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>{isEn ? 'All Features' : 'Xem toàn bộ chức năng'}</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform shrink-0" />
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => {
                    navigate({ subject: 'guide', tutorOpen: false });
                    onEnterAsGuest();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group sci-frame cs-deck-btn w-full sm:w-auto max-w-full px-4 py-3 rounded-md bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/20"
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{isEn ? 'Interactive Guide' : 'Hướng dẫn'}</span>
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => {
                    navigate({ subject: 'authors', tutorOpen: false });
                    onEnterAsGuest();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cs-deck-btn w-full sm:w-auto max-w-full px-4 py-3 rounded-md bg-white/95 dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-300/90 dark:border-white/20 text-slate-800 dark:text-slate-100 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{isEn ? 'Creators (9/4)' : 'Nhóm tác giả'}</span>
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={scrollToVisitorReviews}
                  className="group cs-deck-btn w-full sm:w-auto max-w-full px-4 py-3 rounded-md bg-white/95 dark:bg-white/10 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-amber-300/90 dark:border-amber-400/40 text-amber-800 dark:text-amber-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400 icon-anim-star shrink-0" />
                  <span>{isEn ? 'Reviews' : 'Đánh giá'}</span>
                </button>
              </div>

              {/* 4 Detailed Square-Framed Showcase & App Action Cards (Untruncated, Full Context) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-full">
                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => scrollToShowcase('synapse_v2')}
                  className="group sci-frame cs-deck-btn cta-beacon-glow w-full p-3.5 rounded-md bg-gradient-to-br from-slate-900 via-[#0d2240] to-blue-900 hover:from-slate-800 hover:to-blue-800 border border-amber-400/55 text-white text-left transition-all flex flex-col justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-[4px] bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4 text-amber-300" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xs sm:text-[13px] font-bold leading-snug">
                          {isEn ? `Synapse Pre · ${preTotal} Labs & Syn AI Pro` : `Synapse Pre · ${preTotal} Lab & Syn AI Pro`}
                        </div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-200/95">
                          {isEn ? `${preLabsCount} Labs · ${preSimsCount} Sims · ${preSandboxesCount} Sandboxes` : `${preLabsCount} Phòng Lab · ${preSimsCount} Mô phỏng · ${preSandboxesCount} Sandboxes`}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-amber-200 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] leading-relaxed text-sky-50/90">
                    {isEn
                      ? `${preTotal} 3D/4D labs (Chem Ea, VSEPR, Cell, CRISPR, 3D Assembly) split by 5 subjects, standalone Syn AI Pro & Meet 3D.`
                      : `Mở ${preTotal} Lab 3D/4D phân khu 5 môn (Hóa Ea, VSEPR, Tế Bào, CRISPR, Lắp Ráp 3D), Syn AI Pro độc quyền & Meet 3D.`}
                  </p>
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => scrollToShowcase('spatial_3d')}
                  className="group sci-frame cs-deck-btn w-full p-3.5 rounded-md bg-gradient-to-br from-teal-700 via-emerald-700 to-cyan-800 hover:from-teal-600 hover:to-cyan-700 border border-teal-300/60 text-white text-left transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-lg shadow-teal-700/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-[4px] bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                        <Hand className="w-4 h-4 icon-anim-hand" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xs sm:text-[13px] font-bold leading-snug">
                          {isEn ? 'Holo Atlas 3D · 10-Finger & WebAR' : 'Holo Atlas 3D · 10 Ngón & WebAR'}
                        </div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-100/90">
                          {isEn ? '58 Parts · X-Ray · Fullscreen Toolbar' : '58 Bộ Phận · Tách Lớp · Toàn Màn Hình Đủ Nút'}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-emerald-100 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-50/90">
                    {isEn
                      ? 'Atlas 3D model & anatomy viewer with filterable parts, X-Ray, WebAR desk projection & full controls in Fullscreen.'
                      : 'Quan sát mô hình 3D chi tiết theo giao diện Atlas, tách lớp hàng ngang, WebAR bàn học & đủ công cụ khi bật Toàn màn hình.'}
                  </p>
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => scrollToShowcase('forum')}
                  className="group sci-frame cs-deck-btn w-full p-3.5 rounded-md bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 border border-indigo-300/60 text-white text-left transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-[4px] bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 icon-anim-wave" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xs sm:text-[13px] font-bold leading-snug">
                          {isEn ? 'Live Academic Study Forum' : 'Diễn Đàn Học Tập & Giải Bài LIVE'}
                        </div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-indigo-100/90">
                          {isEn ? 'LaTeX · C++/Python Snippets · Q&A' : 'Cộng đồng trực tuyến · Chuẩn LaTeX & Code'}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-indigo-100 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-50/90">
                    {isEn
                      ? 'Post tricky Math/Physics/CS exercises, vote solutions, and discuss live with peers.'
                      : 'Đăng đề bài khó Toán, Lí, Tin, chia sẻ lời giải chi tiết có công thức LaTeX & code chạy thử.'}
                  </p>
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => scrollToVisitorSection('visitor-app-download')}
                  className="group sci-frame cs-deck-btn w-full p-3.5 rounded-md bg-gradient-to-br from-slate-900 via-blue-900 to-sky-800 hover:from-slate-800 hover:to-sky-700 border border-cyan-300/60 text-white text-left transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-lg shadow-sky-700/25"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-[4px] bg-cyan-400/20 border border-cyan-300/35 flex items-center justify-center shrink-0">
                        <Download className="w-4 h-4 text-cyan-200" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xs sm:text-[13px] font-bold leading-snug">
                          {isEn ? 'Download App · PC, Android & iPhone' : 'Tải Ứng Dụng · PC, Android & iPhone'}
                        </div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                          {isEn ? 'Desktop Launcher · Mobile PWA · Offline' : 'App Laptop riêng · Mobile PWA mượt nhẹ'}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-cyan-200 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] leading-relaxed text-sky-100/90">
                    {isEn
                      ? 'Install standalone Windows/macOS launcher or Android/iOS home app with offline sync.'
                      : 'Cài đặt bản độc lập cho Windows/macOS, Android APK/PWA & iPhone để học mượt không giật lag.'}
                  </p>
                </button>
              </div>

              <span className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isEn ? 'Study progress & roadmap saved automatically' : 'Lưu kết quả học & phân tích lộ trình trực tiếp trên máy bạn'}</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Crisp Architectural Authentication Card */}
          <div className="lg:col-span-5">
            <div className="sci-frame bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-300 dark:border-white/15 rounded-md p-6 sm:p-7 shadow-2xl shadow-slate-950/15 dark:shadow-slate-950/50">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/80 dark:border-white/10">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-sky-400">
                  SYNAPSE ACCESS PORTAL
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  SYNC · AUTH
                </span>
              </div>
              {/* Card Mode Tabs */}
              {authMode !== 'forgot' ? (
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded mb-5 border border-slate-200/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                      setUnauthDomainWarning(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      authMode === 'login'
                        ? 'bg-white dark:bg-white text-slate-900 dark:text-slate-900 shadow-sm'
                        : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? 'Sign In' : 'Đăng Nhập'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMessage(null);
                      setUnauthDomainWarning(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      authMode === 'register'
                        ? 'bg-white dark:bg-white text-slate-900 dark:text-slate-900 shadow-sm'
                        : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? 'Create Account' : 'Đăng Ký Tài Khoản'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-5">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setResetSent(false);
                      setErrorMessage(null);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:underline transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back to Sign In' : 'Quay lại Đăng nhập'}</span>
                  </button>
                </div>
              )}

              {/* Domain Warning for OAuth */}
              {unauthDomainWarning && (
                <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/30 rounded-lg text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
                    <span>
                      {isEn
                        ? `Unauthorized OAuth domain: ${unauthDomainWarning}`
                        : `Tên miền chưa cấp phép: ${unauthDomainWarning}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {isEn
                      ? 'Click below to enter immediately with your Google profile:'
                      : 'Bấm nút bên dưới để vào ngay lập tức bằng hồ sơ Google mà không cần cài đặt:'}
                  </p>
                  <button
                    onClick={handleGoogleDirect}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{isEn ? 'Continue with Google Now' : 'Tiếp tục vào với Google ngay'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && !unauthDomainWarning && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 rounded-md text-rose-700 dark:text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* MODE 1: FORGOT PASSWORD */}
              {authMode === 'forgot' ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Forgot Password?' : 'Quên Mật Khẩu?'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                      {isEn
                        ? 'Enter your Gmail address to receive a secure password reset link.'
                        : 'Nhập địa chỉ Gmail của bạn để nhận liên kết bảo mật thiết lập lại mật khẩu mới.'}
                    </p>
                  </div>

                  {resetSent ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-400/30 rounded-lg text-center space-y-2.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
                      <p className="text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
                        {isEn ? (
                          <>
                            Reset instructions sent to <strong>{resetEmail}</strong>!
                          </>
                        ) : (
                          <>
                            Đã gửi thư hướng dẫn đặt lại mật khẩu đến <strong>{resetEmail}</strong>!
                          </>
                        )}
                      </p>
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setResetSent(false);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-md text-xs font-bold"
                      >
                        {isEn ? 'Back to Sign In' : 'Quay lại Đăng nhập'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {isEn ? 'Gmail / Email Address:' : 'Địa chỉ Gmail / Email:'}
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder={isEn ? 'e.g., student@gmail.com' : 'ví dụ: hocsinh@gmail.com'}
                            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm cs-deck-btn"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Send Password Reset Email' : 'Gửi Thư Đặt Lại Mật Khẩu'}</span>
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* MODE 2 & 3: LOGIN / REGISTER */
                <div className="space-y-3.5">
                  {/* Google 1-Click Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>
                      {authMode === 'login'
                        ? isEn ? 'Quick Sign In with Google / Gmail' : 'Đăng nhập nhanh với Google / Gmail'
                        : isEn ? 'Quick Sign Up with Google / Gmail' : 'Đăng ký nhanh với Google / Gmail'}
                    </span>
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                    <span className="bg-white dark:bg-slate-900/90 px-3 text-[11px] text-slate-400 uppercase font-medium">
                      {isEn ? 'Or account & password' : 'Hoặc tài khoản & mật khẩu'}
                    </span>
                  </div>

                  {/* LOGIN FORM */}
                  {authMode === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {isEn ? 'Username or Gmail:' : 'Tên đăng nhập (Username) hoặc Gmail:'}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder={isEn ? 'e.g., hocsinh or email' : 'ví dụ: hocsinh hoặc email'}
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>

                        {/* Demo test buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{isEn ? 'Quick demo:' : 'Gợi ý thử nhanh:'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIdentifier('hocsinh');
                              setPassword('123456');
                              setErrorMessage(null);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-blue-700 dark:text-sky-300 font-mono transition-colors"
                          >
                            hocsinh (123456)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIdentifier('chuyentoan2026');
                              setPassword('123456');
                              setErrorMessage(null);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-blue-700 dark:text-sky-300 font-mono transition-colors"
                          >
                            chuyentoan2026
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {isEn ? 'Password:' : 'Mật khẩu:'}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('forgot');
                              setResetSent(false);
                              setResetEmail(identifier.includes('@') ? identifier : '');
                              setErrorMessage(null);
                            }}
                            className="text-[11px] font-semibold text-blue-700 dark:text-sky-400 hover:underline"
                          >
                            {isEn ? 'Forgot password?' : 'Quên mật khẩu?'}
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-md transition-colors shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 cursor-pointer cs-deck-btn"
                      >
                        {loading
                          ? isEn ? 'Signing in...' : 'Đang vào...'
                          : isEn ? 'Sign In to Classroom' : 'Đăng Nhập Vào Bục Giảng'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    /* REGISTER FORM */
                    <form onSubmit={handleRegisterSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {isEn ? 'Full Name:' : 'Họ và tên học sinh:'}
                        </label>
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder={isEn ? 'e.g., Nguyen Van An' : 'ví dụ: Nguyễn Văn An'}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {isEn ? 'Username:' : 'Tên đăng nhập (Username):'}
                          </label>
                          <input
                            type="text"
                            required
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            placeholder="chuyentoan2026"
                            className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {isEn ? 'Gmail / Email:' : 'Gmail / Email:'}
                          </label>
                          <input
                            type="email"
                            required
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="an@gmail.com"
                            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {isEn ? 'Password:' : 'Mật khẩu:'}
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-md transition-colors shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 cursor-pointer cs-deck-btn"
                      >
                        {loading
                          ? isEn ? 'Creating...' : 'Đang tạo...'
                          : isEn ? 'Register & Earn +150 XP' : 'Đăng Ký & Nhận +150 XP'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Bottom Quick Guest Link */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
                <button
                  type="button"
                  onClick={onEnterAsGuest}
                  className="text-xs text-blue-700 dark:text-sky-300 hover:underline font-medium transition-colors"
                >
                  {isEn
                    ? 'Or explore directly as a Guest (No account required) →'
                    : 'Hoặc trải nghiệm với tư cách Khách (Không cần tài khoản) →'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GIANT UNIFIED CENTERPIECE "MỤC LỤC" GATEWAY BUTTON */}
        <div className="mt-10 sm:mt-14">
          <button
            type="button"
            data-ripple="true"
            onClick={() => scrollToLectureDirectory('all')}
            className="sci-frame group relative overflow-hidden w-full rounded-xl p-5 sm:p-7 bg-gradient-to-r from-blue-700 via-sky-600 to-teal-600 hover:from-blue-600 hover:via-sky-500 hover:to-teal-500 text-white border border-white/25 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-left cursor-pointer active:scale-[0.98]"
          >
            {/* Moving specular sweep */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[160%] group-hover-sheen"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.18),transparent_55%)] opacity-80 group-hover:opacity-100 transition-opacity"
            />

            <div className="relative z-10 flex items-center gap-4 sm:gap-5 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white/18 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <ListOrdered className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="text-[11px] sm:text-xs font-mono font-extrabold uppercase tracking-[0.2em] text-sky-100">
                  {isEn ? 'UNIFIED DIRECTORY · ONE-CLICK ACCESS' : 'MỤC LỤC TOÀN HỆ THỐNG · TRUY CẬP NHANH'}
                </div>
                <div className="font-display text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight">
                  {isEn
                    ? `MỤC LỤC · EXPLORE ALL ${totalLessons} INTERACTIVE LECTURES`
                    : `MỤC LỤC · KHÁM PHÁ NGAY ${totalLessons} BÀI GIẢNG TRỰC QUAN`}
                </div>
                <p className="text-xs sm:text-sm text-sky-100/95 font-medium truncate">
                  {isEn
                    ? `Math (${mathCount}) · Physics (${physicsCount}) · Chemistry (${chemistryCount}) · Biology (${biologyCount}) · CS (${csCount}) · ${totalExams} Exams`
                    : `Toán (${mathCount}) · Vật lí (${physicsCount}) · Hóa học (${chemistryCount}) · Sinh học (${biologyCount}) · Tin (${csCount}) · ${totalExams} Đề thi`}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2.5 px-5 py-3 rounded-lg bg-white text-blue-700 font-extrabold text-xs sm:text-sm shadow-lg shrink-0 group-hover:bg-sky-50 group-hover:scale-105 transition-all whitespace-nowrap">
              <span>{isEn ? 'Scroll to Lectures' : 'Cuộn xuống xem ngay'}</span>
              <ChevronDown className="w-5 h-5 text-blue-600 animate-bounce" />
            </div>
          </button>
        </div>

        {/* TABLE OF CONTENTS (MỤC LỤC) BAR */}
        <ScrollReveal direction="up" className="mt-6 sm:mt-8">
        <section className="sci-frame sci-scan-bar rounded-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-sky-500/25 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <ListOrdered className="w-5 h-5 text-blue-700 dark:text-sky-400 icon-anim-list shrink-0" />
              <h2 className="font-display text-sm sm:text-base font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                {isEn ? 'Table of Contents · Quick Navigation' : 'Mục Lục · Điều Hướng Nhanh Toàn Trang'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Click any entry below to scroll directly to features or lectures'
                : 'Bấm vào từng mục bên dưới để cuộn thẳng xuống các chức năng hoặc bài giảng'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToVisitorSection('visitor-all-features')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-gradient-to-r from-sky-50 via-blue-50/80 to-teal-50/70 dark:from-sky-950/60 dark:via-slate-900/80 dark:to-teal-950/45 hover:from-sky-100 hover:to-teal-100 dark:hover:from-sky-900/70 dark:hover:to-teal-950/70 border border-sky-300/80 dark:border-sky-500/40 hover:border-blue-500 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-sky-400 block">
                  01 · {isEn ? 'ALL PLATFORM SYSTEMS' : 'TOÀN BỘ HỆ THỐNG'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-200 truncate block transition-colors">
                  {isEn ? 'Complete Feature Tour' : 'Giới thiệu toàn bộ chức năng'}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-blue-600/10 group-hover:bg-blue-700 text-blue-700 dark:text-sky-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('all')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-sky-50 dark:hover:bg-sky-950/45 border border-slate-200/85 dark:border-white/10 hover:border-blue-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-sky-400 block">
                  02 · {isEn ? 'FULL DIRECTORY' : 'TOÀN BỘ BÀI GIẢNG'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-200 truncate block transition-colors">
                  {isEn ? `All Lectures (${totalLessons} lessons)` : `Tất cả bài giảng (${totalLessons} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-blue-600/10 group-hover:bg-blue-700 text-blue-700 dark:text-sky-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('math')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-sky-50 dark:hover:bg-sky-950/45 border border-slate-200/85 dark:border-white/10 hover:border-sky-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-sky-600 dark:text-sky-400 block">
                  03 · {isEn ? 'MATHEMATICS' : 'TOÁN HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate block transition-colors">
                  {isEn ? `Math Lectures (${mathCount})` : `Bài giảng Toán (${mathCount} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-sky-500/10 group-hover:bg-sky-600 text-sky-600 dark:text-sky-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('physics')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-slate-200/85 dark:border-white/10 hover:border-amber-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
                  04 · {isEn ? 'PHYSICS' : 'VẬT LÍ'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate block transition-colors">
                  {isEn ? `Physics Labs (${physicsCount})` : `Bài giảng Vật lí (${physicsCount} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('chemistry')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-violet-50 dark:hover:bg-violet-950/45 border border-slate-200/85 dark:border-white/10 hover:border-violet-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-violet-600 dark:text-violet-400 block">
                  05 · {isEn ? 'CHEMISTRY' : 'HÓA HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 truncate block transition-colors">
                  {isEn ? `Chemistry (${chemistryCount})` : `Bài giảng Hóa (${chemistryCount} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-violet-500/12 group-hover:bg-violet-600 text-violet-600 dark:text-violet-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('biology')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-teal-50 dark:hover:bg-teal-950/45 border border-slate-200/85 dark:border-white/10 hover:border-teal-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-teal-600 dark:text-teal-400 block">
                  06 · {isEn ? 'BIOLOGY' : 'SINH HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 truncate block transition-colors">
                  {isEn ? `Biology (${biologyCount})` : `Bài giảng Sinh (${biologyCount} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-teal-500/12 group-hover:bg-teal-600 text-teal-600 dark:text-teal-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('cs')}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-emerald-50 dark:hover:bg-emerald-950/45 border border-slate-200/85 dark:border-white/10 hover:border-emerald-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                  07 · {isEn ? 'COMPUTER SCIENCE' : 'TIN HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate block transition-colors">
                  {isEn
                    ? `CS 5 Roadmaps (${csCount}+${csSpecializedStageCount})`
                    : `Tin học (${csCount}+${csSpecializedStageCount} chặng)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-emerald-500/12 group-hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={scrollToVisitorReviews}
              className="group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-slate-50/90 dark:bg-slate-800/65 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-slate-200/85 dark:border-white/10 hover:border-amber-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">
                  08 · {isEn ? 'COMMUNITY' : 'CỘNG ĐỒNG'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate block transition-colors">
                  {isEn ? 'Platform Ratings & Votes' : 'Đánh giá & Bình chọn'}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </section>
        </ScrollReveal>

        {/* GRAND ANIMATED OVERVIEW SHOWCASE: FREE VS SYNAPSE PRE · LABS · HOLO ATLAS 3D */}
        <ScrollReveal direction="up" className="mt-10 sm:mt-14">
        <section
          aria-label={isEn ? `Free vs Synapse Pre, ${preTotal} 3D/4D Labs and Holo Atlas Overview` : `Giới thiệu Miễn phí & Synapse Pre, ${preTotal} Phòng Lab 3D/4D và Học tương tác 3D`}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                <Orbit className="w-4 h-4 icon-anim-cosmos" />
                <span>{isEn ? 'PLATFORM ARCHITECTURE · FREE VS SYNAPSE PRE' : 'GIỚI THIỆU CẬP NHẬT · BẢN MIỄN PHÍ & SYNAPSE PRE'}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight text-balance">
                {isEn
                  ? `Free Classroom (5 Subjects) · Synapse Pre (${preTotal} Labs & AI Pro) · Holo Atlas`
                  : `Lớp Học Free (5 Môn) · Synapse Pre (${preTotal} Lab & Syn AI Pro) · Holo Atlas`}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
              {isEn
                ? 'Compare Free and Synapse Pre tiers clearly, switch preview domains, or enter the classroom directly.'
                : 'Xem rõ quyền lợi từng phiên bản, khám phá 3 nhóm phòng Lab bản Pre trước khi đăng nhập hoặc vào học thử ngay.'}
            </p>
          </div>

          {/* FRAME 0: BẢNG GIỚI THIỆU MINH BẠCH BẢN FREE VS SYNAPSE PRE */}
          <div
            id="visitor-plans-comparison"
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* FREE TIER INTRO CARD */}
            <div className="sci-frame rounded-xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {isEn ? 'STANDARD TIER · ALWAYS OPEN' : 'PHIÊN BẢN CƠ BẢN · MỞ RỘNG'}
                  </span>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {isEn ? 'Synapse Free (All Students)' : 'Bản Miễn Phí (Free)'}
                  </h4>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/12 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 whitespace-nowrap tabular-nums">
                  {isEn ? '0đ · Forever' : '0đ · Vĩnh viễn'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isEn ? '5 Subject AI Tutors + Pause' : '5 Trợ Lý AI Môn · Tạm Đóng'}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Syn Math (Ctrl+D), Syn Physics (Ctrl+F), Syn Chem (Ctrl+H), Syn Bio (Ctrl+B) & Syn Code (Ctrl+G) with Pause/Resume.'
                      : 'Syn Math, Physics, Chem, Bio & Code kèm Mắt Thần và nút Tạm đóng giữ hội thoại để mở lại trò chuyện tiếp.'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isEn ? `${totalLessons} Lessons & ${totalExams} Exams` : `${totalLessons} Bài Giảng & ${totalExams} Đề Thi`}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? `Math, Physics (${phyCounts.total} labs), Chem (${chemTotalSims}+4), Bio (${bioTotalSims}+4) across 2006/2018 & 350 exams/subject.`
                      : `Toán, Lí (${phyCounts.total} Lab), Hóa (${chemTotalSims}+4), Sinh (${bioTotalSims}+4) chuẩn 2006/2018 & 350 đề/môn.`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Syn Meet · Screen Share' : 'Syn Meet · Chia Sẻ Màn Hình'}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Create 6-char rooms for WebRTC video/voice, screen sharing & group discussion.'
                      : 'Gọi Video/Thoại WebRTC, chia sẻ màn hình bài giảng, chat & giơ tay phát biểu nhóm.'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Holo Atlas 3D & WebAR' : 'Holo Atlas 3D & Toàn Màn Hình'}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? '58-part Atlas 3D & hand control with full toolbar kept active in Fullscreen.'
                      : 'Atlas mô hình 58 bộ phận chi tiết, X-Quang, WebAR & giữ đủ thanh công cụ khi Toàn màn hình.'}
                  </p>
                </div>
              </div>
            </div>

            {/* SYNAPSE PRE TIER INTRO CARD */}
            <div className="sci-frame rounded-xl bg-gradient-to-br from-slate-950 via-[#0e1933] to-slate-950 text-white border border-amber-400/55 p-6 space-y-4 shadow-xl shadow-amber-950/15">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                    {isEn ? 'PRO EDITION · ADMIN APPROVED ACCESS' : 'PHIÊN BẢN CAO CẤP · CẤP QUYỀN ADMIN'}
                  </span>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-300 shrink-0" />
                    <span>{isEn ? 'Synapse Pre (Premium)' : 'Synapse Pre (Bản Quyền Pro)'}</span>
                  </h4>
                </div>
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-amber-400 text-slate-950 whitespace-nowrap tabular-nums">
                  {isEn ? '120k VND / 3 mo' : '120.000đ / 3 tháng'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-amber-400/30 space-y-1">
                  <div className="font-bold text-amber-300">
                    {isEn ? 'Standalone Syn AI Pro' : 'Syn AI Pro Độc Quyền Riêng'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Separated from base tutors: 3-Layer Fast Solve, Deep Olympiad Reasoning, Pro Flowchart & 3B1B Video.'
                      : 'Tách riêng hoàn toàn cho bản Pre: Giải Siêu Tốc 3 Tầng, Suy Luận Sâu, Sơ Đồ Pro & Tạo Video 3B1B.'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-cyan-400/30 space-y-1">
                  <div className="font-bold text-cyan-300">
                    {isEn ? `${preTotal} Labs Across 5 Subjects` : `${preTotal} Lab Phân Khu 5 Môn`}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isEn
                      ? `${preLabsCount} Pre Labs (incl. Chem Reaction Ea, Cell Atlas), ${preSimsCount} Sims & ${preSandboxesCount} Sandboxes.`
                      : `${preLabsCount} Phòng Lab (có Lò Hóa Ea, Atlas Tế Bào, CRISPR), ${preSimsCount} Mô phỏng & ${preSandboxesCount} Sandboxes.`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-emerald-400/30 space-y-1">
                  <div className="font-bold text-emerald-300">
                    {isEn ? 'Multi-User Shared 3D Meet' : 'Meet Chiếu Mô Hình 3D Chung'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Collaboratively rotate, explode parts, inspect layers & upload .glb/.gltf/.obj in real time.'
                      : 'Cùng xoay, tách lớp, soi từng bộ phận mô hình 3D đồng bộ nhiều người & tải lên file .glb/.obj.'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-sky-400/30 space-y-1">
                  <div className="font-bold text-sky-300">
                    {isEn ? 'Voice OS & Plan Tracking' : 'Voice OS & Theo Dõi Hạn Gói'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Hands-free Voice OS (Alt+Space), transparent registration/expiry dates & instant renewal requests.'
                      : 'Ra lệnh giọng nói toàn hệ thống (Alt+Space), hiển thị rõ ngày đăng ký/hết hạn & Gia hạn gói.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FRAME 1: SYNAPSE PRE */}
          <div
            id="visitor-synapse-overview"
            style={{ ['--holo-accent' as string]: '#38bdf8', ['--holo-secondary' as string]: '#f59e0b' }}
            className={`scroll-mt-24 holo-card-frame rounded-lg shadow-2xl shadow-sky-950/25 ${
              focusedShowcase === 'synapse_v2' ? 'showcase-focus-active ring-2 ring-amber-400' : ''
            }`}
          >
            <div className="holo-conic-ring" aria-hidden="true" />
            <div className="sci-frame relative z-10 rounded-md bg-gradient-to-br from-[#040a18] via-[#091834] to-[#050f24] text-white p-6 sm:p-8 overflow-hidden">
              <div className="absolute inset-0 sci-blueprint-bg opacity-40 pointer-events-none" />
              <div
                aria-hidden="true"
                className="synapse-aurora-blob-a pointer-events-none -top-24 -left-16 w-72 h-72 rounded-full bg-sky-500/20 blur-3xl absolute"
              />
              <div
                aria-hidden="true"
                className="synapse-aurora-blob-b pointer-events-none -bottom-24 right-10 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl absolute"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent showcase-beam-glide"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Content & Interactive 4-Domain Preview matching 3 Sidebar Groups + AI Pro */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-400/40 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-amber-300">
                      <Crown className="w-4 h-4" />
                      <span>{isEn ? `SYNAPSE PRE · ${preTotal} LABS IN 5 SUBJECT ZONES` : `SYNAPSE PRE · ${preTotal} LAB 3D/4D PHÂN KHU 5 MÔN`}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white leading-snug">
                    {isEn
                      ? `${preTotal} WebGL Labs Separated by Subject Zone + Dedicated Syn AI Pro`
                      : `${preTotal} Không Gian Lab, Mô Phỏng & Sandboxes Phân Khu 5 Môn + Syn AI Pro`}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {isEn
                      ? `When Synapse Pre is active, all ${preTotal} interactive chambers appear neatly by subject across 3 sidebar groups (${preLabsCount} Pre Labs, ${preSimsCount} Simulations, ${preSandboxesCount} Sandboxes) — paired with Syn AI Pro, Voice OS, and transparent subscription dates.`
                      : `Khi kích hoạt Synapse Pre, toàn bộ ${preTotal} không gian được tách theo từng môn trong 3 nhóm menu trái (${preLabsCount} Phòng Lab · ${preSimsCount} Mô phỏng · ${preSandboxesCount} Sandboxes), đi cùng Syn AI Pro riêng biệt, Voice OS (Alt+Space) & thẻ theo dõi ngày hết hạn gói.`}
                  </p>

                  {/* Interactive Domain Tabs */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(
                      [
                        { id: 'physics', vi: `${preLabsCount} Phòng Lab`, en: `${preLabsCount} Pre Labs` },
                        { id: 'space', vi: `${preSimsCount} Mô Phỏng 3D/4D`, en: `${preSimsCount} Simulations` },
                        { id: 'cs', vi: `${preSandboxesCount} Sandboxes AI/GPU`, en: `${preSandboxesCount} Sandboxes` },
                        { id: 'math', vi: 'Syn AI Pro & Voice OS', en: 'Syn AI Pro & Voice' },
                      ] as const
                    ).map((tab) => {
                      const active = synapsePreviewDomain === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSynapsePreviewDomain(tab.id)}
                          className={`cs-deck-btn px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                            active
                              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm shadow-amber-400/30'
                              : 'bg-white/6 hover:bg-white/14 text-slate-200 border-white/15'
                          }`}
                        >
                          {isEn ? tab.en : tab.vi}
                        </button>
                      );
                    })}
                  </div>

                  {/* Highlighted Chambers for Active Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      {
                        physics: [
                          { title: isEn ? 'Chem Reaction & Orbital 3D' : 'Lò Phản Ứng Hóa & VSEPR 3D', desc: isEn ? 'Potential surface Ea & sp3d2 orbitals' : 'Bề mặt thế năng Ea & Orbital sp³d²' },
                          { title: isEn ? 'Cell Atlas & CRISPR-Cas9' : 'Atlas Tế Bào & CRISPR 3D', desc: isEn ? 'Cutaway organelles & gene editing' : 'Cắt lớp bào quan & cắt gen sgARN' },
                          { title: isEn ? 'Quantum & Hardware 3D' : 'Lượng Tử & Phẫu Thuật PCB', desc: isEn ? 'Bloch sphere & VOM circuit probe' : 'Quả cầu Bloch & đo que VOM thật' },
                        ],
                        space: [
                          { title: isEn ? '3D Mechanical Assembly' : 'Lắp Ráp Cơ Khí 3D Tương Tác', desc: isEn ? 'V4 Engine, Watch & Drone snap-fit' : 'Kéo thả Động cơ, Đồng hồ & Drone' },
                          { title: isEn ? 'Rocket & Brayton Jet 3D' : 'Phóng Tên Lửa & Phản Lực', desc: isEn ? 'Cutaway LOX & shock cones' : 'Tách tầng đẩy & tách lớp tua-bin' },
                          { title: isEn ? '4D Space & 30 Megastructures' : 'Không Gian 4D & 30 Công Trình', desc: isEn ? 'Tesseract, LHC & Webb 3D' : 'Siêu lập phương, LHC & Webb' },
                        ],
                        cs: [
                          { title: isEn ? 'Future Periodic 118 & Free Chem 3D' : 'Bảng Tuần Hoàn 118 & Hóa 3D Tự Do', desc: isEn ? 'Element reactions & 25-reagent 3D bench' : 'Animation từng nguyên tố & pha chế 25 hóa chất 3D' },
                          { title: isEn ? '3D Human & Animal Anatomy' : 'Giải Phẫu Người & Động Vật 3D', desc: isEn ? '8 PBR systems: Heart, Brain, Bird Air Sacs' : '8 hệ PBR sắc nét: Tim, Não, Chim 9 túi khí, Cá' },
                          { title: isEn ? 'What-If Physics, AlgoCity & 28K GPU' : 'Vũ Trụ What-If, AlgoCity & 28K GPU', desc: isEn ? 'Dual-hand GLSL, Dijkstra 3D & Math Oxyz' : '2 tay điều khiển hạt, Thành phố thuật toán & Toán' },
                        ],
                        math: [
                          { title: isEn ? '3-Layer Fast AI Pro' : 'Syn AI Pro · Giải 3 Tầng', desc: isEn ? 'Summary, strategy & proof' : 'Tóm tắt, chiến lược & đáp án chuẩn' },
                          { title: isEn ? 'Deep Reasoning & 3B1B Reel' : 'Suy Luận Sâu & Video 3B1B', desc: isEn ? 'Olympiad checks & .webm export' : 'Bẫy điều kiện biên & dựng video' },
                          { title: isEn ? 'Voice OS & Pause/Resume' : 'Voice OS & Tạm Đóng Chat', desc: isEn ? 'Alt+Space control & keep thread' : 'Điều khiển giọng nói & giữ chat' },
                        ],
                      }[synapsePreviewDomain]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-md bg-white/6 border border-sky-300/25 px-3 py-2.5 space-y-0.5 transition-all hover:border-amber-300/60 hover:bg-white/10"
                      >
                        <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-sky-200/85 leading-snug">{item.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-1 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={handleEnterSynapseV2}
                      className="group/btn cs-deck-btn cta-beacon-glow px-6 py-3 rounded-md bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{isEn ? 'Explore Synapse Pre Workspace' : 'Xem Không Gian Synapse Pre'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-xs text-slate-400">
                      {isEn ? `${preTotal} Labs across 5 Subject Zones · 120k/3 mo` : `${preLabsCount} Lab · ${preSimsCount} Mô phỏng · ${preSandboxesCount} Sandboxes · Mở qua Admin`}
                    </span>
                  </div>
                </div>

                {/* Right Grand Animated 3D Gyroscope & Collider Schematic Stage */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-md border border-sky-400/35 bg-[#020816] p-5 overflow-hidden min-h-[275px] flex flex-col justify-between shadow-inner">
                    <div
                      aria-hidden="true"
                      className="holo-radar-sweep pointer-events-none absolute left-1/2 top-1/2 w-[320px] h-[320px] rounded-full opacity-30"
                      style={{
                        background:
                          'conic-gradient(from 0deg, rgba(56,189,248,0.55), transparent 72deg, transparent 360deg)',
                      }}
                    />

                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-sky-300/95">
                      <span>SYNAPSE PRE · {preTotal} LABS</span>
                      <span className="tabular-nums px-2 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-amber-200">
                        {synapsePreviewDomain === 'physics' && `${preLabsCount} PRE LABS`}
                        {synapsePreviewDomain === 'space' && `${preSimsCount} SIMULATIONS`}
                        {synapsePreviewDomain === 'cs' && `${preSandboxesCount} SANDBOXES`}
                        {synapsePreviewDomain === 'math' && 'AI PRO + VOICE'}
                      </span>
                    </div>

                    <div className="relative z-10 my-2 flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 260 170"
                        className="w-full max-w-[280px] h-44 showcase-float-slow"
                      >
                        <defs>
                          <radialGradient id="synapseCoreGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                            <stop offset="55%" stopColor="#0284c7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <circle cx="130" cy="85" r="54" fill="url(#synapseCoreGlow)" />
                        <g className="holo-orbit-cw">
                          <circle
                            cx="130"
                            cy="85"
                            r="72"
                            fill="none"
                            stroke="#38bdf8"
                            strokeOpacity="0.6"
                            strokeWidth="1.3"
                            strokeDasharray="8 5"
                          />
                          <circle cx="202" cy="85" r="4.5" fill="#38bdf8" />
                          <circle cx="58" cy="85" r="4" fill="#818cf8" />
                          <circle cx="130" cy="13" r="3.5" fill="#2dd4bf" />
                        </g>
                        <g className="holo-orbit-ccw">
                          <ellipse
                            cx="130"
                            cy="85"
                            rx="58"
                            ry="28"
                            fill="none"
                            stroke="#2dd4bf"
                            strokeOpacity="0.78"
                            strokeWidth="1.4"
                          />
                          <circle cx="130" cy="57" r="4" fill="#2dd4bf" />
                          <circle cx="130" cy="113" r="3.5" fill="#fbbf24" />
                        </g>
                        <ellipse
                          cx="130"
                          cy="85"
                          rx="30"
                          ry="58"
                          fill="none"
                          stroke="#818cf8"
                          strokeOpacity="0.7"
                          strokeWidth="1.3"
                          className="holo-dash"
                        />
                        <circle cx="130" cy="85" r="12" fill="#e0f2fe" />
                        <circle cx="130" cy="85" r="21" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="holo-ring-pulse" />
                        <circle cx="130" cy="85" r="31" fill="none" stroke="#818cf8" strokeOpacity="0.45" strokeWidth="1" className="holo-ring-pulse" />
                      </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] text-slate-300 border-t border-white/10 pt-2.5">
                      <span>
                        {synapsePreviewDomain === 'physics' && (isEn ? 'Sidebar Group 1: 7 Interactive Pre Labs' : 'Nhóm 1: 7 Phòng Lab 3D/4D Chuyên Sâu')}
                        {synapsePreviewDomain === 'space' && (isEn ? 'Sidebar Group 2: 8 Engineering & Space Sims' : 'Nhóm 2: 8 Mô Phỏng Hàng Không & Vũ Trụ')}
                        {synapsePreviewDomain === 'cs' && (isEn ? 'Sidebar Group 3: 6 AI & Physics Sandboxes' : 'Nhóm 3: 6 Sandboxes AI, Code & Hạt GPU')}
                        {synapsePreviewDomain === 'math' && (isEn ? 'Standalone Syn AI Pro + Voice OS + Meet 3D' : 'Syn AI Pro riêng · Voice OS · Meet 3D')}
                      </span>
                      <span className="font-mono text-amber-300 font-semibold tabular-nums">22 / 22</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FRAME 2: HỌC TƯƠNG TÁC 3D · HOLO ATLAS 58 BỘ PHẬN & TOÀN MÀN HÌNH */}
          <div
            id="visitor-spatial-overview"
            style={{ ['--holo-accent' as string]: '#14b8a6', ['--holo-secondary' as string]: '#38bdf8' }}
            className={`scroll-mt-24 holo-card-frame rounded-lg shadow-2xl shadow-teal-950/25 ${
              focusedShowcase === 'spatial_3d' ? 'showcase-focus-active ring-2 ring-teal-400' : ''
            }`}
          >
            <div className="holo-conic-ring" aria-hidden="true" />
            <div className="sci-frame relative z-10 rounded-md bg-gradient-to-br from-[#031317] via-[#06222b] to-[#05121c] text-white p-6 sm:p-8 overflow-hidden">
              <div className="absolute inset-0 sci-blueprint-bg opacity-35 pointer-events-none" />
              <div
                aria-hidden="true"
                className="synapse-aurora-blob-b pointer-events-none -top-24 right-8 w-72 h-72 rounded-full bg-teal-500/20 blur-3xl absolute"
              />
              <div
                aria-hidden="true"
                className="synapse-aurora-blob-c pointer-events-none -bottom-24 -left-10 w-80 h-80 rounded-full bg-cyan-500/18 blur-3xl absolute"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-teal-300/20 to-transparent showcase-beam-glide"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Grand Animated 10-Fingertip Constellation & 3D Wireframe Stage */}
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <div className="relative rounded-md border border-teal-400/35 bg-[#020f13] p-5 overflow-hidden min-h-[275px] flex flex-col justify-between shadow-inner">
                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-teal-300/95">
                      <span>{spatialPreviewTab === 'models3d' ? 'HOLO ATLAS · 58 PARTS' : '6 LABS · 2D STUDIO'}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/15 border border-teal-400/30 text-emerald-300">
                        FULLSCREEN HUD
                      </span>
                    </div>

                    <div className="relative z-10 my-2 flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 260 170"
                        className="w-full max-w-[280px] h-44 showcase-float-slow"
                      >
                        <g className="holo-orbit-cw" style={{ transformOrigin: '198px 82px' }}>
                          <circle
                            cx="198"
                            cy="82"
                            r="48"
                            fill="none"
                            stroke="#2dd4bf"
                            strokeOpacity="0.35"
                            strokeWidth="1"
                            strokeDasharray="5 4"
                          />
                        </g>
                        {/* Oxyz wireframe isometric crystal / cube */}
                        <g transform="translate(154, 32)">
                          <polygon
                            points="44,4 84,27 84,75 44,98 4,75 4,27"
                            fill="rgba(20, 184, 166, 0.14)"
                            stroke="#2dd4bf"
                            strokeWidth="1.6"
                          />
                          <polyline
                            points="4,27 44,50 84,27"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.4"
                          />
                          <line x1="44" y1="50" x2="44" y2="98" stroke="#38bdf8" strokeWidth="1.4" />
                          <circle cx="44" cy="50" r="4.5" fill="#fbbf24" className="showcase-node-ping" />
                        </g>

                        {/* 10-Fingertip sensor fan & kinetic laser filaments */}
                        <g>
                          {[
                            { x: 22, y: 116 },
                            { x: 32, y: 82 },
                            { x: 48, y: 56 },
                            { x: 68, y: 46 },
                            { x: 88, y: 60 },
                            { x: 28, y: 138 },
                            { x: 48, y: 120 },
                            { x: 66, y: 98 },
                            { x: 84, y: 86 },
                            { x: 98, y: 106 },
                          ].map((pt, i) => (
                            <g key={i}>
                              <line
                                x1={pt.x}
                                y1={pt.y}
                                x2={198}
                                y2={82}
                                stroke={i < 5 ? '#2dd4bf' : '#38bdf8'}
                                strokeOpacity="0.34"
                                strokeWidth="1.1"
                                className="animate-electric-flow"
                              />
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={i < 5 ? 4.4 : 3.4}
                                fill={i < 5 ? '#2dd4bf' : '#38bdf8'}
                                className="showcase-node-ping"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              />
                            </g>
                          ))}
                        </g>
                      </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] text-slate-300 border-t border-white/10 pt-2.5">
                      <span>
                        {spatialPreviewTab === 'models3d'
                          ? isEn
                            ? 'Atlas filter, X-Ray, explode row & full HUD in Fullscreen'
                            : 'Lọc bộ phận, X-Quang, tách hàng & đủ công cụ khi Toàn màn hình'
                          : isEn
                          ? 'Drag vertices & tangents directly on 2D canvas'
                          : 'Kéo đỉnh đa giác, tiêu điểm conic & tiếp tuyến 2D'}
                      </span>
                      <span className="font-mono text-teal-300 font-semibold">60 FPS</span>
                    </div>
                  </div>
                </div>

                {/* Right Content & Interactive Mode Preview */}
                <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-teal-500/15 border border-teal-400/40 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-teal-300">
                    <Hand className="w-4 h-4 icon-anim-hand" />
                    <span>{isEn ? 'HOLO ATLAS 3D · 10-FINGER GESTURE & WEBAR PRO' : 'HOLO ATLAS 3D · 58 BỘ PHẬN · CẢM BIẾN 10 NGÓN TAY'}</span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white leading-snug">
                    {isEn
                      ? 'Atlas 3D Model Inspector, WebAR Desk Pro & 10-Finger / Mouse Control'
                      : 'Giao Diện Atlas 3D Trực Quan (58 Bộ Phận), WebAR Bàn Học & 10 Ngón Tay'}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {isEn
                      ? 'Explore 3D models & anatomical/mechanical structures with side-by-side Atlas part search, horizontal row explode, X-Ray mode, 10-finger webcam gestures or mouse drag — with every tool preserved even in Fullscreen mode.'
                      : 'Quan sát mô hình 3D với bảng Atlas tra cứu từng bộ phận, tách lớp hàng ngang cố định, chế độ X-Quang, điều khiển 10 ngón tay hoặc kéo chuột mượt — giữ nguyên đầy đủ thanh tính năng kể cả khi bật Toàn màn hình.'}
                  </p>

                  {/* Interactive Tab Toggle: Atlas 3D Models vs 6 2D Geometry Labs */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSpatialPreviewTab('models3d')}
                      className={`cs-deck-btn px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                        spatialPreviewTab === 'models3d'
                          ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-sm shadow-teal-500/30'
                          : 'bg-white/6 hover:bg-white/14 text-slate-200 border-white/15'
                      }`}
                    >
                      {isEn ? 'Holo Atlas & 15+ 3D Models' : 'Holo Atlas & 15+ Mô hình 3D'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpatialPreviewTab('labs2d')}
                      className={`cs-deck-btn px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                        spatialPreviewTab === 'labs2d'
                          ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-sm shadow-teal-500/30'
                          : 'bg-white/6 hover:bg-white/14 text-slate-200 border-white/15'
                      }`}
                    >
                      {isEn ? '6 Interactive 2D Geometry Labs' : '6 Xưởng Hình học 2D'}
                    </button>
                  </div>

                  {/* Highlighted Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(spatialPreviewTab === 'models3d'
                      ? [
                          { title: isEn ? 'Atlas Part Inspector (58)' : 'Atlas Soi 58 Bộ Phận', desc: isEn ? 'Search, isolate, X-Ray & row' : 'Tìm kiếm, ẩn/hiện, X-Quang & tách hàng' },
                          { title: isEn ? 'Fullscreen Complete HUD' : 'Toàn Màn Hình Đủ Nút', desc: isEn ? 'All controls stay reachable' : 'Giữ nguyên toàn bộ tính năng khi phóng to' },
                          { title: isEn ? 'WebAR Desk Pro & Scan' : 'WebAR Bàn Học & Quét AI', desc: isEn ? 'Rear cam, Y-slice & PNG save' : 'Cam sau, Cắt Y, Lưu PNG & Dựng AI' },
                        ]
                      : [
                          { title: isEn ? 'Euler Triangle & Circle' : 'Đường tròn Euler & Compa', desc: isEn ? 'Live orthocenter & centroid' : 'Di chuyển đỉnh thấy trực tâm đổi' },
                          { title: isEn ? 'Conic Sections Studio' : 'Tiết diện Elip · Hyperbol', desc: isEn ? 'Tune eccentricity & foci' : 'Chỉnh tâm sai & tiêu điểm sống' },
                          { title: isEn ? 'Vector & Symmetry Lab' : 'Vector Oxy & Phép đối xứng', desc: isEn ? 'Dot product & reflection axes' : 'Tích vô hướng & trục đối xứng' },
                        ]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-md bg-white/6 border border-teal-300/25 px-3 py-2.5 space-y-0.5 transition-all hover:border-teal-300/60 hover:bg-white/10"
                      >
                        <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-teal-200/85 leading-snug">{item.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-1 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={handleEnterSpatial3D}
                      className="group/btn cs-deck-btn px-6 py-3 rounded-md bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Hand className="w-4 h-4 icon-anim-hand" />
                      <span>{isEn ? 'Launch Holo Atlas 3D Lab' : 'Vào Học Cảm Giác & Atlas 3D ngay'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-xs text-slate-400">
                      {isEn ? 'Works with Webcam, Mouse/Touch & Fullscreen' : 'Dùng bằng Webcam, Chuột / Cảm ứng & Toàn màn hình'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FRAME 2B: PHÒNG HỌC TRỰC TUYẾN LIVE MEET & 3D */}
          <LiveMeetShowcaseCard
            id="visitor-live-meet-overview"
            isEn={isEn}
            onOpenMeet={() => {
              navigate({ subject: 'live_meet', tutorOpen: false });
              onEnterAsGuest();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* FRAME 3: DIỄN ĐÀN HỌC TẬP (COLLABORATIVE KNOWLEDGE NETWORK) */}
          <div
            id="visitor-forum-overview"
            style={{ ['--holo-accent' as string]: '#818cf8', ['--holo-secondary' as string]: '#c084fc' }}
            className={`scroll-mt-24 holo-card-frame rounded-lg shadow-2xl shadow-indigo-950/25 ${
              focusedShowcase === 'forum' ? 'showcase-focus-active ring-2 ring-indigo-400' : ''
            }`}
          >
            <div className="holo-conic-ring" aria-hidden="true" />
            <div className="sci-frame relative z-10 rounded-md bg-gradient-to-br from-[#08091f] via-[#131438] to-[#0a0c24] text-white p-6 sm:p-8 overflow-hidden">
              <div className="absolute inset-0 sci-blueprint-bg opacity-35 pointer-events-none" />
              <div
                aria-hidden="true"
                className="synapse-aurora-blob-a pointer-events-none -top-24 -right-12 w-72 h-72 rounded-full bg-indigo-500/22 blur-3xl absolute"
              />
              <div
                aria-hidden="true"
                className="synapse-aurora-blob-c pointer-events-none -bottom-24 left-10 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl absolute"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent showcase-beam-glide"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Content & Interactive Forum Topic Tabs */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-500/18 border border-indigo-400/40 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    <MessageSquare className="w-4 h-4 icon-anim-wave" />
                    <span>{isEn ? 'STUDY FORUM · PEER EXCHANGE & SOLUTIONS' : 'DIỄN ĐÀN HỌC TẬP · CỘNG ĐỒNG TOÁN · LÍ · TIN'}</span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white leading-snug">
                    {isEn
                      ? 'Ask Hard Problems, Share Olympiad Solutions & Debate STEM Ideas Together'
                      : 'Trao Đổi Bài Khó, Chia Sẻ Lời Giải Chuyên & Hỏi Đáp Cùng Cộng Đồng'}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {isEn
                      ? 'Post tough Math, Physics, or CS questions with equations and images, compare alternative proofs, and build study reputation alongside your weekly Arena XP.'
                      : 'Đăng bài hỏi đáp Toán – Lí – Tin kèm ảnh đề và công thức trực quan, thảo luận nhiều cách giải tối ưu từ cơ bản đến HSG Quốc gia và tích lũy điểm đóng góp học thuật.'}
                  </p>

                  {/* Interactive Forum Preview Tabs */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(
                      [
                        { id: 'discussions', vi: 'Thảo luận nổi bật', en: 'Top Discussions' },
                        { id: 'solutions', vi: 'Kho lời giải hay', en: 'Best Solutions' },
                        { id: 'qa', vi: 'Hỏi đáp nhanh 24/7', en: 'Fast Q&A Threads' },
                      ] as const
                    ).map((tab) => {
                      const active = forumPreviewTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setForumPreviewTab(tab.id)}
                          className={`cs-deck-btn px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                            active
                              ? 'bg-indigo-400 text-slate-950 border-indigo-300 shadow-sm shadow-indigo-500/30'
                              : 'bg-white/6 hover:bg-white/14 text-slate-200 border-white/15'
                          }`}
                        >
                          {isEn ? tab.en : tab.vi}
                        </button>
                      );
                    })}
                  </div>

                  {/* Highlighted Forum Threads */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      {
                        discussions: [
                          { title: isEn ? 'Cauchy-Schwarz Olympiad Tricks' : 'Kỹ thuật chọn điểm rơi BĐT', desc: isEn ? 'Math Chuyên · 18 replies' : 'Toán Chuyên · 18 bình luận hay' },
                          { title: isEn ? 'RLC Resonance Phase Shift' : 'Độ lệch pha & Cộng hưởng RLC', desc: isEn ? 'Physics 12 · Vector diagram' : 'Vật lí 12 · Giản đồ vectơ kép' },
                          { title: isEn ? 'DP Bitmask & Segment Tree' : 'Tối ưu DP Bitmask & Cây IT', desc: isEn ? 'CS VNOI · O(N log N) code' : 'Tin VNOI · Code mẫu C++20' },
                        ],
                        solutions: [
                          { title: isEn ? '3 Ways to Solve Oxyz Distance' : '3 Cách tính khoảng cách Oxyz', desc: isEn ? 'Visual 3D vector proof' : 'Kèm hình tọa độ không gian 3D' },
                          { title: isEn ? 'Damped Pendulum Energy Loss' : 'Dao động tắt dần & Cơ năng', desc: isEn ? 'Step-by-step conservation' : 'Phân tích từng nửa chu kỳ' },
                          { title: isEn ? 'Dijkstra with State Compression' : 'Dijkstra mở rộng trạng thái', desc: isEn ? 'Annotated complexity analysis' : 'Phân tích độ phức tạp chi tiết' },
                        ],
                        qa: [
                          { title: isEn ? 'Snap & Paste Exam Question' : 'Chụp / Ctrl+V ảnh đề cần hỏi', desc: isEn ? 'Instant math/code formatting' : 'Hiển thị rõ đề & công thức' },
                          { title: isEn ? 'Pin Best Peer Answers' : 'Bình chọn lời giải chuẩn xác', desc: isEn ? 'Community verified solutions' : 'Đánh dấu lời giải được đồng thuận' },
                          { title: isEn ? 'Link Directly to Syn AI' : 'Hỏi tiếp với Syn AI', desc: isEn ? 'Deepen any step you miss' : 'Giải thích sâu từng bước chưa rõ' },
                        ],
                      }[forumPreviewTab]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-md bg-white/6 border border-indigo-300/25 px-3 py-2.5 space-y-0.5 transition-all hover:border-indigo-300/60 hover:bg-white/10"
                      >
                        <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-indigo-200/85 leading-snug">{item.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-1 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      data-ripple="true"
                      onClick={handleEnterForum}
                      className="group/btn cs-deck-btn px-6 py-3 rounded-md bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 hover:from-indigo-300 hover:to-fuchsia-300 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 icon-anim-wave" />
                      <span>{isEn ? 'Open Study Forum Now' : 'Tham gia Diễn đàn học tập'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-xs text-slate-400">
                      {isEn ? 'Post questions & vote answers freely' : 'Đặt câu hỏi & chia sẻ lời giải cùng bạn học'}
                    </span>
                  </div>
                </div>

                {/* Right Grand Animated Collaborative Synaptic Mesh SVG Stage */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-md border border-indigo-400/35 bg-[#040516] p-5 overflow-hidden min-h-[275px] flex flex-col justify-between shadow-inner">
                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-indigo-300/95">
                      <span>KNOWLEDGE GRAPH · LIVE</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/18 border border-indigo-400/35 text-violet-200">
                        MATH · PHYS · CHEM · BIO · CS
                      </span>
                    </div>

                    <div className="relative z-10 my-2 flex items-center justify-center">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 260 170"
                        className="w-full max-w-[280px] h-44 showcase-float-slow"
                      >
                        <defs>
                          <radialGradient id="forumHubGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.95" />
                            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <circle cx="130" cy="85" r="52" fill="url(#forumHubGlow)" />
                        <g className="holo-orbit-cw" style={{ transformOrigin: '130px 85px' }}>
                          <circle
                            cx="130"
                            cy="85"
                            r="66"
                            fill="none"
                            stroke="#818cf8"
                            strokeOpacity="0.4"
                            strokeWidth="1.2"
                            strokeDasharray="6 5"
                          />
                        </g>
                        {/* Synaptic links connecting scholar nodes */}
                        {[
                          { x1: 52, y1: 42, x2: 130, y2: 85, c: '#38bdf8' },
                          { x1: 208, y1: 44, x2: 130, y2: 85, c: '#fbbf24' },
                          { x1: 48, y1: 128, x2: 130, y2: 85, c: '#34d399' },
                          { x1: 212, y1: 126, x2: 130, y2: 85, c: '#c084fc' },
                          { x1: 52, y1: 42, x2: 208, y2: 44, c: '#818cf8' },
                          { x1: 48, y1: 128, x2: 212, y2: 126, c: '#818cf8' },
                        ].map((edge, idx) => (
                          <line
                            key={idx}
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            stroke={edge.c}
                            strokeOpacity="0.58"
                            strokeWidth="1.5"
                            className="animate-electric-flow"
                          />
                        ))}
                        {/* Outer Subject Hub Nodes */}
                        {[
                          { x: 52, y: 42, fill: '#38bdf8', label: 'Σ' },
                          { x: 208, y: 44, fill: '#fbbf24', label: 'λ' },
                          { x: 48, y: 128, fill: '#34d399', label: '</>' },
                          { x: 212, y: 126, fill: '#c084fc', label: 'Q&A' },
                        ].map((node, idx) => (
                          <g key={idx}>
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="15"
                              fill="#0b1029"
                              stroke={node.fill}
                              strokeWidth="1.6"
                              className="showcase-node-ping"
                              style={{ animationDelay: `${idx * 0.3}s` }}
                            />
                            <text
                              x={node.x}
                              y={node.y + 4}
                              textAnchor="middle"
                              fill={node.fill}
                              fontSize="10"
                              fontWeight="700"
                              fontFamily="monospace"
                            >
                              {node.label}
                            </text>
                          </g>
                        ))}
                        {/* Central Hub */}
                        <circle cx="130" cy="85" r="18" fill="#1e1b4b" stroke="#a5b4fc" strokeWidth="2" />
                        <circle cx="130" cy="85" r="26" fill="none" stroke="#818cf8" strokeWidth="1.2" className="holo-ring-pulse" />
                        <text x="130" y="89" textAnchor="middle" fill="#e0e7ff" fontSize="9.5" fontWeight="700" fontFamily="monospace">
                          FORUM
                        </text>
                      </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] text-slate-300 border-t border-white/10 pt-2.5">
                      <span>
                        {isEn
                          ? 'Real-time academic discussions & peer grading'
                          : 'Thảo luận Toán · Lí · Hóa · Sinh · Tin & chia sẻ cách giải'}
                      </span>
                      <span className="font-mono text-indigo-300 font-semibold">24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* GRAND MULTI-DEVICE APP DOWNLOAD SHOWCASE (LAPTOP · ANDROID · IPHONE) */}
        <ScrollReveal direction="up" className="mt-12 sm:mt-16">
          <AppDownloadGuideSection
            id="visitor-app-download"
            onOpenInstallApp={onOpenInstallApp}
            showFeatureMatrix={true}
          />
        </ScrollReveal>

        {/* COMPLETE PLATFORM CAPABILITIES SHOWCASE (ALL 9 WEB SYSTEMS) */}
        <ScrollReveal direction="up" className="mt-12 sm:mt-16">
        <section
          id="visitor-all-features"
          className="scroll-mt-24 pt-10 border-t border-slate-200/80 dark:border-white/10 space-y-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                <Layers className="w-4 h-4 icon-anim-grid" />
                <span>{isEn ? 'COMPLETE PLATFORM ARCHITECTURE' : 'TOÀN BỘ CHỨC NĂNG CỦA NỀN TẢNG'}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? '9 Integrated Workspaces for Visual STEM Mastery'
                  : '9 Hệ Thống Tích Hợp Từ Mô Phỏng 3D Đến Luyện Thi AI'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Click any module card below to jump straight into its interactive workspace—no registration required.'
                  : 'Mỗi tính năng bên dưới hoạt động độc lập và liên thông lộ trình XP. Bấm trực tiếp vào bất kỳ khung nào để mở ngay phòng học đó.'}
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/85 dark:bg-slate-900/75 p-1.5 rounded border border-slate-200/90 dark:border-white/15 backdrop-blur-md shrink-0">
              {(
                [
                  { id: 'all', vi: 'Tất cả (9)', en: 'All (9)' },
                  { id: 'simulation', vi: 'Mô phỏng 2D/3D', en: '2D/3D Labs' },
                  { id: 'curriculum_ai', vi: 'Bài giảng & Đề AI', en: 'Lessons & AI' },
                  { id: 'arena_tools', vi: 'Đấu trường & Tiện ích', en: 'Arena & Tools' },
                ] as const
              ).map((tab) => {
                const active = featureCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-ripple="true"
                    onClick={() => setFeatureCategory(tab.id)}
                    className={`cs-deck-btn px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-blue-700 dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {isEn ? tab.en : tab.vi}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 01: Synapse Pre */}
            {(featureCategory === 'all' || featureCategory === 'simulation') && (
              <div
                data-ripple="true"
                onClick={handleEnterSynapseV2}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-amber-300/85 dark:border-amber-500/35 hover:border-amber-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 120"
                  className="absolute right-2 top-2 w-20 h-20 opacity-20 dark:opacity-30 pointer-events-none animate-orbit-slow"
                >
                  <circle cx="60" cy="60" r="42" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 5" />
                  <circle cx="60" cy="60" r="24" fill="none" stroke="#38bdf8" strokeWidth="1.3" />
                </svg>
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Crown className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      01 · SYNAPSE PRE
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {isEn ? `Synapse Pre · ${preTotal} Labs (5 Subject Zones)` : `Synapse Pre · ${preTotal} Lab (Phân Khu 5 Môn)`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? `Separated by 5 subjects & 3 sidebar groups: ${preLabsCount} Pre Labs (incl. Chem Reaction Ea, Orbital VSEPR, Cell Atlas, DNA CRISPR), ${preSimsCount} Simulations & ${preSandboxesCount} Sandboxes.`
                      : `Tách riêng 5 khu môn học trên thanh điều hướng: ${preLabsCount} Phòng Lab (có Lò Phản Ứng Hóa, VSEPR, Tế Bào, CRISPR 3D), ${preSimsCount} Mô phỏng & ${preSandboxesCount} Sandboxes GPU.`}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isEn ? `${preTotal} 3D/4D Studios + 30 Megastructures` : `${preTotal} Studio 3D/4D + 30 Đại công trình WebGL`}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isEn ? 'Voice OS (Alt+Space) + QR Telemetry + Admin Plan' : 'Voice OS (Alt+Space) + QR Cảm biến & Gia hạn gói'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnterSynapseV2();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? `Explore ${preTotal} Synapse Pre Labs` : `Khám phá ${preTotal} Lab Synapse Pre`}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 02: Spatial 3D Holo Atlas + 10-Fingertip Gesture + Fullscreen */}
            {(featureCategory === 'all' || featureCategory === 'simulation') && (
              <div
                data-ripple="true"
                onClick={handleEnterSpatial3D}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-teal-300/85 dark:border-teal-500/35 hover:border-teal-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-teal-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Hand className="w-6 h-6 icon-anim-hand" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                      02 · HOLO ATLAS 3D
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {isEn ? 'Holo Atlas 3D (58 Parts) & WebAR Desk Pro' : 'Holo Atlas 3D (58 Bộ Phận) & WebAR Pro'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Atlas multi-part 3D viewer (filter parts, X-Ray, horizontal explode row), WebAR desk projection (rear cam, Y-slice, PNG), 10-finger / mouse controls, and full tools preserved in Fullscreen.'
                      : 'Giao diện Atlas tra cứu 58 bộ phận chi tiết, bật X-Quang, tách hàng ngang cố định, chiếu WebAR bàn học, điều khiển 10 ngón / chuột & giữ trọn thanh tính năng khi Toàn màn hình.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{isEn ? 'Fullscreen keeps every Atlas & 3D control accessible' : 'Toàn màn hình giữ đầy đủ thanh điều khiển & danh sách bộ phận'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{isEn ? 'WebAR Desk Pro + AI Object Scanner + Mouse/Touch support' : 'WebAR Bàn Học Pro + AI Tạo Mô Hình + Kéo chuột mượt'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnterSpatial3D();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Open Holo Atlas & AR Pro' : 'Vào Holo Atlas 3D & AR Pro'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 03: Physics 2D/3D (5 Dedicated Domains) */}
            {(featureCategory === 'all' || featureCategory === 'simulation') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'physics_sims', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-amber-300/85 dark:border-amber-500/35 hover:border-amber-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Atom className="w-6 h-6 icon-anim-atom" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      03 · {phyCounts.domainCount} DOMAINS
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {isEn
                      ? `Physics 2D/3D · ${phyCounts.domainCount} Separate Domains`
                      : `Mô Phỏng Vật Lí 2D/3D · ${phyCounts.domainCount} Lĩnh Vực Riêng`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? `Interactive Grade 6–12 labs split into ${phyCounts.domainCount} clean domains: Mechanics, Waves, Electricity/RLC, Optics/Quantum & Thermal/Nuclear, plus drag-and-drop lab apparatus and clear THCS/THPT/Specialized lessons.`
                      : `Tổng hợp thí nghiệm Lớp 6–12 tương tác tách riêng ${phyCounts.domainCount} lĩnh vực: Cơ học, Dao động & Sóng, Điện từ & RLC, Quang & Lượng tử, Nhiệt & Hạt nhân kèm dụng cụ kéo thả.`}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        {isEn
                          ? `${phyCounts.count2D} 2D interactive canvases + ${phyCounts.count3D} 3D 60FPS labs`
                          : `Tách rõ ${phyCounts.count2D} Lab 2D & ${phyCounts.count3D} mô phỏng 3D 60 FPS`}
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isEn ? `${physicsCount} THPT & Specialized lectures` : `${physicsCount} bài giảng chuẩn cấp độ THPT / Chuyên`}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'physics_sims', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? `Open ${phyCounts.domainCount} Physics Domains` : `Mở ${phyCounts.domainCount} Chuyên đề Vật lí`}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 04: Math 2D & Oxyz 3D */}
            {(featureCategory === 'all' || featureCategory === 'simulation' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'math_sims', mathTab: 'grapher', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-blue-300/85 dark:border-blue-500/35 hover:border-blue-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Compass className="w-6 h-6 icon-anim-compass" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                      04 · OXY &amp; OXYZ 3D
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {isEn ? `Math 2D & Oxyz 3D (${mathCount})` : `Toán Học 2D & Oxyz 3D (${mathCount} bài)`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Plot functions & shade definite integrals; explore 2D Circle geometry, Conics, tangent cones, and 8 rotatable Oxyz 3D models alongside 5-step Grade 6–12 lessons.'
                      : 'Vẽ đồ thị đa thức, mũ-logarit, tô diện tích tích phân; tương tác đường tròn 2D (tiếp tuyến, phương tích) & 8 mô hình Oxyz 3D xoay tự do kèm bài giảng 5 bước lớp 6–12.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{isEn ? 'Integral shading + Interactive Circle Lab' : 'Tích phân tô màu + Xưởng Đường tròn 2D'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{isEn ? '2 MCQs & 1 Essay per lecture saved to Roadmap' : '2 TN + 1 TL tự lưu phân tích lỗ hổng kiến thức'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'math_sims', mathTab: 'grapher', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Open Math 2D/3D' : 'Mở Toán 2D & Oxyz 3D'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 05: CS Sublime Text 4 + Online Judge + 16 Algo Visualizers */}
            {(featureCategory === 'all' || featureCategory === 'simulation' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'cs', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-emerald-300/85 dark:border-emerald-500/35 hover:border-emerald-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Code2 className="w-6 h-6 icon-anim-code" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      05 · SUBLIME IDE
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {isEn ? '5 CS Roadmaps · Sublime 4 & Trace 1-1' : 'Tin Học 5 Lộ Trình · Trace 1-1 & Replay Tư Duy'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? '5 curated roadmaps, Monokai Sublime 4 IDE, C++20/Python 3 Judge with Live Code-to-Animation Tracer (variable/array animation), Thought-Trace Replay & 16 algorithm graphs.'
                      : '5 lộ trình chuẩn (VNOI + OpenEDG, Roadmap.sh, LearnCpp & GitHub C++), IDE Sublime Text 4, Truy vết Biến từng dòng (Code-to-Animation Trace) & Replay Tư Duy WA → AC.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {isEn
                          ? 'Live Code Trace 1-1 & Thought-Trace Replay'
                          : 'Truy vết biến & mảng DP từng dòng + Replay Tư Duy'}
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{isEn ? '5 Roadmaps + 16 Algo Graphs + AI test generator' : '5 Lộ trình + 16 Đồ thị thuật toán + Sinh test tự động'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'cs', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Open Code Judge & Trace 1-1' : `Mở IDE, Trace 1-1 & ${csCount} Bài Giảng`}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 05B: Chemistry 2D/3D + Dedicated Sandbox */}
            {(featureCategory === 'all' || featureCategory === 'simulation' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'chemistry', chemistryView: 'catalog', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-violet-300/85 dark:border-violet-500/35 hover:border-violet-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-violet-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FlaskConical className="w-6 h-6 icon-anim-flask" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                      05B · CHEMISTRY
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    {isEn ? `Chemistry (${chemistryCount}) & 4 Sandboxes` : `Hóa Học (${chemistryCount} Bài) · 2D/3D & Sandbox`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? `GDPT 2006, 2018 & Olympiad lectures, ${CHEMISTRY_2D_SIMS.length} 2D + ${CHEMISTRY_3D_SIMS.length} 3D labs (Titration, VSEPR, Electrolysis), 4 dedicated Sandboxes & 350 Chemistry exams.`
                      : `Đủ GDPT 2006, 2018 & Chuyên, ${CHEMISTRY_2D_SIMS.length} Lab 2D + ${CHEMISTRY_3D_SIMS.length} mô hình 3D (Chuẩn độ, VSEPR, Điện phân), 4 Sandbox Hóa tách riêng & 350 Đề Hóa.`}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'chemistry_sims', chemistryView: 'sim2d_hub', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-violet-500/15 hover:bg-violet-600 hover:text-white text-violet-700 dark:text-violet-300 text-[11px] font-semibold cursor-pointer"
                    >
                      {isEn ? 'Chem 2D/3D' : 'Mô phỏng 2D/3D'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'chemistry_sims', chemistryView: 'sandbox', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 dark:bg-slate-800 text-violet-300 border border-violet-500/40 text-[11px] font-semibold cursor-pointer"
                    >
                      Sandbox Hóa
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'chemistry', chemistryView: 'catalog', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Open Chemistry Zone' : 'Vào Phòng Hóa Học'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 05C: Biology 2D/3D + Dedicated Sandbox */}
            {(featureCategory === 'all' || featureCategory === 'simulation' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'biology', biologyView: 'catalog', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-teal-300/85 dark:border-teal-500/35 hover:border-teal-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-teal-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Dna className="w-6 h-6 icon-anim-dna" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                      05C · BIOLOGY
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {isEn ? `Biology (${biologyCount}) & 4 Sandboxes` : `Sinh Học (${biologyCount} Bài) · 2D/3D & Sandbox`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? `GDPT 2006, 2018 & Olympiad lectures, ${BIOLOGY_2D_SIMS.length} 2D + ${BIOLOGY_3D_SIMS.length} 3D cellular/DNA labs, 4 dedicated Sandboxes & 350 Biology exams.`
                      : `Đủ GDPT 2006, 2018 & Chuyên, ${BIOLOGY_2D_SIMS.length} Lab 2D + ${BIOLOGY_3D_SIMS.length} mô hình Tế bào/ADN 3D, 4 Sandbox Sinh tách riêng & 350 Đề Sinh.`}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'biology_sims', biologyView: 'sim2d_hub', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-teal-500/15 hover:bg-teal-600 hover:text-white text-teal-700 dark:text-teal-300 text-[11px] font-semibold cursor-pointer"
                    >
                      {isEn ? 'Bio 2D/3D' : 'Mô phỏng 2D/3D'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'biology_sims', biologyView: 'sandbox', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-900 dark:bg-slate-800 text-teal-300 border border-teal-500/40 text-[11px] font-semibold cursor-pointer"
                    >
                      Sandbox Sinh
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'biology', biologyView: 'catalog', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Open Biology Zone' : 'Vào Phòng Sinh Học'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 06: Exam Bank + Fast Drag-Drop/Ctrl+V/Voice Upload */}
            {(featureCategory === 'all' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'exams', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-cyan-300/85 dark:border-cyan-500/35 hover:border-cyan-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6 icon-anim-award" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 tabular-nums">
                      06 · {totalExams} EXAMS
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    {isEn ? `${totalExams} Exams & Fast AI Upload` : `Kho ${totalExams} Đề Thi & Up Đề Siêu Tốc`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Drag-drop files, paste images with Ctrl+V, or dictate via Voice to solve instantly or open a timed room. Upload handwritten photos for AI 0–10 scoring & Q&A.'
                      : 'Tách rõ Chuyên & THPT. Kéo-thả ảnh, dán Ctrl+V hoặc đọc đề bằng Giọng nói để AI giải ngay hoặc tạo phòng thi bấm giờ; nộp ảnh viết tay chấm 0–10 & hỏi đáp.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>{isEn ? 'Drag-drop / Ctrl+V paste / Voice exam upload' : 'Up đề tức thì: Kéo thả, Ctrl+V & Giọng nói'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>{isEn ? 'Handwritten AI grading (0–10) & feedback' : 'Chấm ảnh bài làm viết tay 0–10 & giải đáp'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'exams', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Explore Exam Bank' : 'Mở Kho Đề & Up Đề AI'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 07: Dual-Tier AI (3 Base Tutors + Standalone Syn AI Pro) + Pause/Resume */}
            {(featureCategory === 'all' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'overview', tutorOpen: true, tutorSubject: 'math' });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-indigo-300/85 dark:border-indigo-500/35 hover:border-indigo-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Mic className="w-6 h-6 icon-anim-wave" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                      07 · DUAL AI &amp; PAUSE
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {isEn ? '5 Base AIs + Standalone Syn AI Pro & Pause' : '5 AI Chuyên Môn · Syn AI Pro & Tạm Đóng'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Free includes 5 subject tutors (Math/Physics/Chem/Bio/Code · Ctrl+D/F/H/B/G) with Live Vision & Pause/Resume; Synapse Pre unlocks Syn AI Pro with 3-Layer Solve & 3B1B Video.'
                      : 'Bản Free có đủ 5 AI (Syn Math · Physics · Chem · Bio · Code) kèm Mắt Thần & nút Tạm đóng giữ hội thoại; Synapse Pre mở khóa Syn AI Pro giải 3 tầng, Suy luận sâu & Video 3B1B.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{isEn ? 'Pause Minichat & resume conversation seamlessly anytime' : 'Nút Tạm đóng giữ nguyên lịch sử để mở lại trò chuyện tiếp'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{isEn ? 'Opaque zero-lag UI + Screen/Canvas Vision + 3B1B .webm' : 'Khung chat mượt không giật + Mắt Thần & Dựng Video 3B1B'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'overview', tutorOpen: true, tutorSubject: 'math' });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Open Syn AI Chat Studio' : 'Mở Syn AI & Syn AI Pro'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 08: Roadmap + Weekly Arena + Study Forum */}
            {(featureCategory === 'all' || featureCategory === 'arena_tools') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'arena', tutorOpen: false });
                  onEnterAsGuest();
                }}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-orange-300/85 dark:border-orange-500/35 hover:border-orange-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Trophy className="w-6 h-6 icon-anim-trophy" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-orange-700 dark:text-orange-300">
                      08 · COMMUNITY &amp; XP
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">
                    {isEn ? 'Smart Knowledge Map · Arena · Forum' : 'Bản Đồ Tri Thức · Đấu Trường · Diễn Đàn'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Smart Knowledge Map & adaptive weekly planner for Grades 6–12, daily MCQ & AI-graded Essay Arena rankings, plus the collaborative STEM Study Forum.'
                      : 'Bản đồ tri thức thông minh lớp 6–12 tự chẩn đoán lỗ hổng kiến thức & xếp lịch tuần, thi Đấu Trường Tuần (Trắc nghiệm & Tự luận AI chấm) lên BXH trực tuyến, và Diễn đàn hỏi đáp 24/7.'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'roadmap', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-blue-500/12 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-sky-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <GitBranch className="w-3 h-3" />
                      <span>{isEn ? 'Roadmap' : 'Lộ trình'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'arena', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-700 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trophy className="w-3 h-3" />
                      <span>{isEn ? 'Arena' : 'Đấu trường'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({ subject: 'forum', tutorOpen: false });
                        onEnterAsGuest();
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-500/15 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>{isEn ? 'Forum' : 'Diễn đàn'}</span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ subject: 'arena', tutorOpen: false });
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Enter Weekly Arena' : 'Vào Đấu trường & BXH'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 09: Study Utilities + Dynamic PC-Spec Themes + Molecular Sidebar */}
            {(featureCategory === 'all' || featureCategory === 'arena_tools') && (
              <div
                data-ripple="true"
                onClick={onEnterAsGuest}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-slate-300/90 dark:border-white/20 hover:border-sky-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-slate-500/15 text-sky-600 dark:text-sky-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sliders className="w-6 h-6 icon-anim-clock" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-sky-300">
                      09 · STUDIO &amp; FPS
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                    {isEn ? 'Draggable Widgets & Dynamic Themes' : 'Góc Tập Trung / Syn AI Tự Kéo Vị Trí & Nền Động'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Freely drag & reposition Focus Timer and Syn AI anywhere on screen, enjoy ambient audio, Quick Notes, cursor-dodge typography, and 5 PC-tuned animated backgrounds.'
                      : 'Kéo thả tự do vị trí nút Góc tập trung & Syn AI mọi góc màn hình, nhạc nền + chuông báo, Sổ tay ghi chú, chữ né chuột & 5 nền động (Hệ sinh thái, Phân tử, Đại dương, Bầu trời, Chòm sao).'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{isEn ? 'Drag-anywhere Focus Timer & Syn AI buttons' : 'Tự do kéo thả vị trí nút Góc tập trung & Syn AI'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{isEn ? 'Smooth / Balanced / Ultra FPS performance modes' : '3 chế độ hiệu năng FPS (Mượt / Cân bằng / Cao cấp)'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterAsGuest();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-400 text-white dark:text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Enter Full Workspace' : 'Vào Toàn Bộ Không Gian Học'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Cross-Platform Smart Conveniences Bar */}
          <div className="sci-frame sci-scan-bar rounded-xl bg-gradient-to-r from-slate-900 via-[#0d1f3d] to-slate-900 text-white p-5 sm:p-6 border border-sky-400/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-sky-300 icon-anim-wave shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-white">{isEn ? 'Voice Recognition' : 'Nhận diện Giọng nói'}</div>
                <p className="text-slate-300 leading-snug">
                  {isEn ? 'Speak questions & exam prompts in VI/EN.' : 'Đọc đề bài & câu hỏi trực tiếp bằng Tiếng Việt/Anh.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UploadCloud className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-white">{isEn ? 'Instant Ctrl+V Paste' : 'Dán Ảnh Đề Ctrl+V'}</div>
                <p className="text-slate-300 leading-snug">
                  {isEn ? 'Paste screenshots straight into Exams, Code & Syn AI.' : 'Dán ảnh đề thi vào Đề thi, Code IDE & Syn AI.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sliders className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-white">{isEn ? 'PC-Spec Background Modes' : 'Tùy biến theo Cấu hình PC'}</div>
                <p className="text-slate-300 leading-snug">
                  {isEn ? 'Switch between 5 animated themes & FPS caps.' : '5 giao diện nền động & giảm tải GPU chống giật lag.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-white">{isEn ? '5-Step Cloud/Local Sync' : 'Đồng bộ Bài học 5 Bước'}</div>
                <p className="text-slate-300 leading-snug">
                  {isEn ? 'XP, scores & weak-topic roadmap saved automatically.' : 'Tự lưu XP, bài tập tự luận & phân tích lỗ hổng kiến thức.'}
                </p>
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* Full Lecture Directory on Welcome Page (Lazy-Loaded) */}
        <ScrollReveal direction="up" className="mt-12 sm:mt-16">
          <Suspense
            fallback={
              <div className="py-10 text-center text-xs text-slate-400">
                {isEn ? 'Loading lecture directory...' : 'Đang tải mục lục bài giảng...'}
              </div>
            }
          >
            <LectureDirectorySection
              id="visitor-lecture-directory"
              subjectFilter={directorySubject}
              onSubjectFilterChange={setDirectorySubject}
              onSelectLecture={handleOpenLectureFromVisitor}
              onSelectCsTrack={handleOpenCsTrackFromVisitor}
              actionHintVi="Bấm vào bất kỳ bài giảng hoặc lộ trình nào để vào ngay lớp học mô phỏng 5 bước (không cần đăng nhập)."
              actionHintEn="Click any lecture or roadmap below to launch directly into its 5-step simulation classroom (no sign-in required)."
            />
          </Suspense>
        </ScrollReveal>

        {/* Community Reviews & Ratings Section on Landing */}
        <ScrollReveal direction="up" className="mt-12 sm:mt-16">
          <PlatformReviews id="visitor-platform-reviews" />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/10 py-6 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            {isEn
              ? 'Synapse · Academic STEM Simulation Classroom'
              : 'Synapse · Hệ thống giáo dục mô phỏng vũ trụ học thuật'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]">
            <span>{isEn ? `Synapse Pre (${preTotal} Labs · 5 Subject Zones)` : `Synapse Pre (${preTotal} Lab · 5 Khu Môn)`}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Holo Atlas 3D (58 Parts)' : 'Holo Atlas 3D (58 Bộ Phận)'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? '5 Subject AIs + Syn AI Pro' : '5 AI Môn + Syn AI Pro'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Syn Meet Free & 3D Pre' : 'Syn Meet & Meet 3D'}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {isEn ? `${totalExams} Official Exams` : `${totalExams} Đề Khảo Thí`}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
