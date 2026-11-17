import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GalaxyBackground } from '../galaxy/GalaxyBackground';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme, CREATURE_THEME_OPTIONS } from '../../context/BackgroundContext';
import { BrandLogo } from '../common/BrandLogo';
import { CursorDodgeText } from '../common/CursorDodgeText';
import { AppearanceStudioBar } from '../common/AppearanceStudioBar';
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
  Download
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useNavigation } from '../../context/NavigationContext';
import { PlatformReviews } from '../common/PlatformReviews';
import { AppDownloadGuideSection } from '../common/AppDownloadGuideSection';
import {
  LectureDirectorySection,
  DirectorySubjectFilter,
  LectureDirectoryTarget
} from '../common/LectureDirectorySection';

import { EXAM_PAPERS } from '../../data/examData';
import { MATH_LECTURES } from '../../data/curriculumData';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { CS_LESSONS } from '../../data/csLessonsData';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../../data/csTracksData';

interface VisitorLandingPageProps {
  onEnterAsGuest: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onOpenInstallApp?: () => void;
}

type LandingSpotlightKey = 'synapse_v2' | 'spatial_3d' | 'math' | 'physics' | 'cs' | 'exams';
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
    navigate({ subject: 'synapse_v2', tutorOpen: false });
    onEnterAsGuest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterSpatial3D = () => {
    navigate({ subject: 'spatial_3d', tutorOpen: false });
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

  const totalExams = EXAM_PAPERS.length;
  const chuyenExams = EXAM_PAPERS.filter((e) => e.track === 'chuyen').length;
  const khongChuyenExams = EXAM_PAPERS.filter((e) => e.track === 'khong_chuyen').length;
  const csSpecializedStageCount = CS_SPECIALIZED_TRACKS.reduce((s, t) => s + t.stages.length, 0);
  const totalLessons = MATH_LECTURES.length + PHYSICS_LESSONS.length + CS_LESSONS.length;

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
      label: isEn ? 'Synapse v2 · 30 Worlds' : 'Synapse v2 · 30 Công trình',
      badge: isEn ? '30 Interactive 3D Chambers' : '30 Đại Công Trình 3D WebGL',
      headline: isEn
        ? 'Virtual Science Campus: 30 Futuristic 3D Physics, Space, CS & Math Chambers'
        : 'Lớp Học Ảo Synapse v2: 30 Đại Công Trình 3D Vật Lí, Vũ Trụ, Vi Tính & Toán',
      summary: isEn
        ? 'Step inside 30 real-time 3D scientific chambers with live formulas: CERN LHC, Double-Slit Laser, James Webb, Dyson Black Hole, Tokamak Fusion, LiDAR SLAM, 7T MRI, Sagnac Gyro, Acoustic Levitation & Photonic Tensor Core.'
        : 'Khám phá 30 không gian 3D tương tác trực tiếp cùng công thức: Máy gia tốc CERN LHC, Laser Khe kép, Kính James Webb, Hố đen Dyson, Lò Tokamak, LiDAR SLAM, MRI 7T, Con quay Sagnac & Chip quang tử.',
      highlights: isEn
        ? [
            '30 holographic chambers across Physics, Space, AI & Math',
            'Real-time Three.js WebGL controls & live equations',
            'Instant launch directly inside any observatory chamber',
          ]
        : [
            '30 phòng thí nghiệm 3D Vật lí, Vũ trụ, Tin học & Toán',
            'Điều chỉnh thông số & công thức trực tiếp trong WebGL',
            'Chuyển cảnh mượt, tối ưu FPS theo cấu hình máy',
          ],
      accentClass: 'text-sky-600 dark:text-sky-300 border-sky-500/30 bg-sky-500/10',
    },
    spatial_3d: {
      label: isEn ? 'Spatial 3D Gesture' : 'Học cảm giác 3D',
      badge: isEn ? '10-Fingertip AI Sensor' : 'Cảm biến Webcam 10 ngón',
      headline: isEn
        ? 'Control 6 2D Geometry Labs & 15 Advanced 3D Models Using Your Real Hands'
        : 'Điều Khiển 6 Xưởng Hình Học 2D & 15 Mô Hình 3D Tiên Tiến Bằng 10 Đầu Ngón Tay',
      summary: isEn
        ? 'Strict 5-finger per hand MediaPipe tracking locks circular pins directly onto your fingertips. Customize sensitivity, 1-hand or dual-hand interaction modes, and sculpt 2D geometry or 3D turbines & robot arms.'
        : 'AI chỉ nhận diện đúng 10 đầu ngón tay chống nhảy loạn. Tự do chỉnh độ nhạy, phương thức 1/2 tay để dựng 6 xưởng 2D (Euler, Compa, Vector, Conic) và xoay 15 mô hình 3D thực tế (Động cơ phản lực, Robot IK, Hầm gió).',
      highlights: isEn
        ? [
            'Locked 10-fingertip tracking with zero random jumps',
            '6 2D Geometry Workshops + 15 Kinetic 3D Models',
            'Custom sensitivity sliders & per-gesture action mapping',
          ]
        : [
            'Gắn chặt điểm tròn lên đúng 10 đầu ngón tay chống loạn',
            '6 Xưởng Hình học 2D + 15 Mô hình 3D thực tế sáng tạo',
            'Tùy chỉnh độ nhạy, chế độ tay & nút tính năng theo ý thích',
          ],
      accentClass: 'text-teal-600 dark:text-teal-300 border-teal-500/30 bg-teal-500/10',
    },
    math: {
      label: isEn ? 'Math 2D & 3D' : 'Toán 2D & 3D',
      badge: isEn ? `${MATH_LECTURES.length} Grades 9–12 topics` : `${MATH_LECTURES.length} chuyên đề 9–12`,
      headline: isEn
        ? 'Oxy Analytic Grapher, Circle Geometry & 8 Oxyz 3D Scenes'
        : 'Đồ thị Oxy, Đường tròn Tương tác & 8 mô hình Oxyz 3D',
      summary: isEn
        ? 'Plot polynomials, rationals, exponentials, logarithms, and integrals; explore circle chords, tangents, Power of a Point and ellipses in 2D alongside sphere tangent cones, Conic sections and Oxyz lines.'
        : 'Khảo sát hàm đa thức, phân thức, mũ – lôgarit, tích phân; tương tác dây cung, góc nội tiếp, hai tiếp tuyến, phương tích đường tròn 2D cùng nón tiếp tuyến mặt cầu và Oxyz 3D.',
      highlights: isEn
        ? [
            'Visualize definite integral shaded area ∫ f(x)dx',
            '8 interactive 3D scenes: Circle Spheres, Conic, Oxyz, Pyramids',
            '5-step lectures + 2 MCQs & 1 essay synced with AI roadmap',
          ]
        : [
            'Tô bóng diện tích tích phân ∫ f(x)dx & Hình học Đường tròn',
            '8 cảnh 3D xoay tự do: Tiếp tuyến cầu, Conic, Oxyz, Thiết diện chóp',
            'Bài giảng 5 bước + 2 TN & 1 TL tự lưu phân tích lộ trình AI',
          ],
      accentClass: 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
    physics: {
      label: isEn ? 'Physics 2D & 3D' : 'Vật Lí 2D & 3D',
      badge: isEn
        ? `5 Domains · ${PHYSICS_LESSONS.length} lessons (Grades 9–12)`
        : `5 Lĩnh vực tách riêng · ${PHYSICS_LESSONS.length} bài 9–12`,
      headline: isEn
        ? '5 Dedicated Physics Simulation Domains (2D & 3D) + Standard THPT/Specialized Lectures'
        : 'Mô Phỏng Vật Lí 2D/3D Tách Riêng 5 Chuyên Đề (Lớp 9–12) & Bài Giảng Chuẩn THPT/Chuyên',
      summary: isEn
        ? 'Separate pages for Mechanics, Waves/Oscillations, Electricity/Magnetism, Optics/Quantum & Thermal/Nuclear with full PhET-inspired controls, separated 2D/3D views, and clear THPT/Specialized explanations.'
        : 'Tách riêng 5 trang thực hành (Cơ học, Sóng & Dao động, Điện & Điện từ, Quang & Lượng tử, Nhiệt & Hạt nhân) tham khảo PhET với đầy đủ thanh trượt thông số, tách biệt 2D/3D và văn phong chuẩn THPT/Chuyên.',
      highlights: isEn
        ? [
            '41 2D Labs & 32 3D Models across 5 dedicated domain pages',
            'RLC phasors, Doppler cones, Photoelectric tube & Bohr Atom',
            'Adaptive difficulty labels for Grade 9–12 & Olympiad',
          ]
        : [
            '41 Lab 2D & 32 mô hình 3D chia thành 5 trang lĩnh vực riêng',
            'Mạch RLC, hiệu ứng Doppler, Quang điện ngoài & Nguyên tử Bohr',
            'Bài giảng tinh gọn, chuẩn mực theo cấp độ THPT & Chuyên',
          ],
      accentClass: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    cs: {
      label: isEn ? 'CS 5 Roadmaps & IDE' : 'Tin Học · 5 Lộ Trình',
      badge: isEn
        ? `5 CS Roadmaps (${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++) · 16 Algos`
        : `5 Lộ trình Tin (${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++) · 16 Thuật toán`,
      headline: isEn
        ? '5 Complete CS Roadmaps, Sublime Text 4 Studio & Online Judge'
        : '5 Lộ Trình Tin Học Toàn Diện, IDE Sublime Text 4 & Online Judge',
      summary: isEn
        ? 'Master VNOI Competitive Programming alongside 4 international C++ tracks (OpenEDG CPE/CPA/CPP, Roadmap.sh C++, LearnCpp Modern C++20/23 & GitHub Systems), full Sublime Text 4 menus, auto test-gen, and 16 visualizers.'
        : 'Đầy đủ VNOI Thi đấu + 4 lộ trình C++ Quốc tế (OpenEDG CPE/CPA/CPP, Roadmap.sh, LearnCpp Modern C++20/23 & GitHub C++ Career). Menu Sublime Text 4, gửi đề Ảnh/Ctrl+V/Giọng nói sinh test ẩn & 16 đồ thị thuật toán.',
      highlights: isEn
        ? [
            `5 Roadmaps: VNOI (${CS_LESSONS.length}) + OpenEDG, Roadmap.sh, LearnCpp & GitHub (${csSpecializedStageCount} stages)`,
            'Full Sublime menus: 60-step Undo/Redo, Find & Replace, Snippets & 16 Algo graphs',
            'Upload problem via Image / Ctrl+V / Voice for instant AI test grading',
          ]
        : [
            `5 Lộ trình: VNOI (${CS_LESSONS.length} bài) + OpenEDG, Roadmap.sh, LearnCpp & GitHub (${csSpecializedStageCount} chặng)`,
            'IDE Sublime Text 4 + 16 mô phỏng thuật toán (Oxy, Xâu, DP, Dijkstra...)',
            'Nhận đề bằng Ảnh / Ctrl+V / Giọng nói & chấm test ẩn tự động',
          ],
      accentClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    exams: {
      label: isEn ? `${totalExams} Exams & Syn AI` : `${totalExams} Đề Thi & Syn AI`,
      badge: isEn
        ? `${chuyenExams} Spec · ${khongChuyenExams} Std · Fast Upload`
        : `${chuyenExams} Chuyên · ${khongChuyenExams} THPT · Tải Đề Nhanh`,
      headline: isEn
        ? `${totalExams} Exam Bank + Drag-Drop / Ctrl+V / Voice & Syn AI`
        : `Kho ${totalExams} Đề Thi + Nộp Ảnh/Dán Ctrl+V/Giọng Nói & Syn AI`,
      summary: isEn
        ? 'Drop an exam photo, paste via Ctrl+V, or dictate via Voice Recognition to solve or launch a timed exam room immediately. Includes AI handwritten scoring (0–10) and Syn AI (Syn Math, Syn Physics, Syn Code).'
        : 'Kéo-thả ảnh, dán Ctrl+V hoặc đọc đề bằng Giọng nói để AI giải ngay hoặc tạo phòng thi bấm giờ. Nộp ảnh bài làm viết tay cho AI chấm điểm 0–10 và hỏi đáp cùng Syn AI (Syn Math · Syn Physics · Syn Code).',
      highlights: isEn
        ? [
            `Complete ${totalExams} papers (Specialized/Olympic & THPT)`,
            'Fast upload: Drag & Drop, Ctrl+V Paste, Voice Recognition Mic',
            'Handwritten photo AI grading (0–10) & Syn AI (Ctrl+D/F/G)',
          ]
        : [
            `Đủ ${totalExams} đề Toán · Lí · Tin (Chuyên & Không chuyên)`,
            'Tải đề siêu tốc: Kéo thả ảnh, dán Ctrl+V, Giọng nói Micro',
            'Chấm bài viết tay 0–10 & Syn AI giọng nói (Ctrl+D/F/G)',
          ],
      accentClass: 'text-teal-600 dark:text-teal-400 border-teal-500/30 bg-teal-500/10',
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
                  ? 'Interactive Visual Learning Ecosystem Grades 9–12 & Olympiad'
                  : 'Hệ Sinh Thái Học Tập Trực Quan 9–12 & Chuyên Quốc Gia'}
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
                  Complete Grades 9–12 &amp; Olympiad STEM workspace featuring{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">30 Synapse v2 3D chambers</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">10-fingertip webcam 2D/3D labs</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">5 Physics simulation domains</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Sublime Text 4 Judge</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Syn AI (Syn Math · Syn Physics · Syn Code)</strong> and{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">{totalExams} official exams</strong>.
                </>
              ) : (
                <>
                  Hệ sinh thái học tập toàn diện cho học sinh THCS, THPT &amp; Đội tuyển Chuyên: tích hợp{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">30 đại công trình 3D Synapse v2</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Học cảm giác 3D bằng 10 đầu ngón tay</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">5 chuyên đề Mô phỏng Vật lí</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">IDE Sublime Text 4</strong>,{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">Syn AI (Syn Math · Syn Physics · Syn Code)</strong> cùng kho{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">{totalLessons} bài giảng &amp; {totalExams} đề thi</strong>.
                </>
              )}
            </p>

            {/* Interactive 6-Pillar Quick Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('synapse_v2')}
                className={`group cs-deck-btn min-w-0 text-left p-3 sm:p-3.5 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'synapse_v2'
                    ? 'bg-white dark:bg-slate-900/90 border-sky-500 ring-2 ring-sky-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-sky-400/60'
                }`}
              >
                <Orbit className="w-5 h-5 text-sky-600 dark:text-sky-400 mb-1.5 icon-anim-cosmos" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Synapse v2 · 3D' : 'Synapse v2 · 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? '30 3D Chambers' : '30 Đại công trình 3D'}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('spatial_3d')}
                className={`group cs-deck-btn min-w-0 text-left p-3 sm:p-3.5 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'spatial_3d'
                    ? 'bg-white dark:bg-slate-900/90 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-teal-400/60'
                }`}
              >
                <Hand className="w-5 h-5 text-teal-600 dark:text-teal-400 mb-1.5 icon-anim-hand" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Spatial 3D Gesture' : 'Học cảm giác 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? '10-Finger · 6 2D + 15 3D' : '10 ngón · 6 2D + 15 3D'}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('physics')}
                className={`group cs-deck-btn min-w-0 text-left p-3 sm:p-3.5 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
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
                  {isEn ? '5 Domains · 41 2D + 32 3D' : '5 Lĩnh vực · 41 2D + 32 3D'}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('math')}
                className={`group cs-deck-btn min-w-0 text-left p-3 sm:p-3.5 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'math'
                    ? 'bg-white dark:bg-slate-900/90 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-400/60'
                }`}
              >
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1.5 icon-anim-compass" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Math 2D / Oxyz 3D' : 'Toán 2D / Oxyz 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${MATH_LECTURES.length} topics · 8 3D scenes` : `${MATH_LECTURES.length} bài · 8 cảnh 3D`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('cs')}
                className={`group cs-deck-btn min-w-0 text-left p-3 sm:p-3.5 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
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
                  {isEn ? `${CS_LESSONS.length}+${csSpecializedStageCount} · 16 Algos` : `${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++`}
                </p>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => setActiveSpotlight('exams')}
                className={`group cs-deck-btn min-w-0 text-left p-3 sm:p-3.5 rounded border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'exams'
                    ? 'bg-white dark:bg-slate-900/90 border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'bg-white/85 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-cyan-400/60'
                }`}
              >
                <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-1.5 icon-anim-award" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate tabular-nums">
                  {isEn ? `${totalExams} Exams & Syn AI` : `${totalExams} Đề & Syn AI`}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? 'Upload / Voice / Grading' : 'Tải ảnh / Giọng nói / Chấm'}
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

            {/* Live Dynamic Scene, Font, Palette & Cursor Dodge Bar */}
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
                  className="group sci-frame cs-deck-btn cta-beacon-glow w-full p-3.5 rounded-md bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700 hover:from-sky-500 hover:via-cyan-500 hover:to-blue-600 border border-sky-300/60 text-white text-left transition-all flex flex-col justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-[4px] bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                        <Orbit className="w-4 h-4 icon-anim-cosmos" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xs sm:text-[13px] font-bold leading-snug">
                          {isEn ? 'Synapse 2.0 · 30 3D Mega-Models' : 'Synapse 2.0 · 30 Đại Công Trình 3D'}
                        </div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sky-100/90">
                          {isEn ? '360° WebGL · Live Math & Physics' : 'WebGL 360° · Tương tác thông số sống'}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-sky-100 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] leading-relaxed text-sky-50/90">
                    {isEn
                      ? 'Inspect solar systems, RLC circuits, 3D geometry & 73 Physics labs with real-time sliders.'
                      : 'Xoay 360° Hệ Mặt Trời, mạch RLC, hình học Oxyz & kho 73 mô phỏng Vật lí có đồ thị trực tiếp.'}
                  </p>
                </button>

                <button
                  type="button"
                  data-ripple="true"
                  onClick={() => scrollToShowcase('spatial_3d')}
                  className="group sci-frame cs-deck-btn w-full p-3.5 rounded-md bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 border border-teal-300/60 text-white text-left transition-all flex flex-col justify-between gap-2 cursor-pointer shadow-lg shadow-teal-600/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-[4px] bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                        <Hand className="w-4 h-4 icon-anim-hand" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-display text-xs sm:text-[13px] font-bold leading-snug">
                          {isEn ? '3D Hand Lab & AI Sandbox' : 'Học Cảm Giác 3D Bằng Tay (AI)'}
                        </div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-100/90">
                          {isEn ? '10-Finger Tracking · 6 2D + 15 3D' : 'Webcam 10 ngón · 6 2D + 15 3D + Tạo AI'}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-emerald-100 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-50/90">
                    {isEn
                      ? 'Pinch, rotate & grab 3D models via webcam or upload your own sketch for AI to build.'
                      : 'Cầm nắm, xoay phóng mô hình bằng cử chỉ tay hoặc gửi ý tưởng/ảnh để AI dựng mô hình tự do.'}
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
                    ? `Math (${MATH_LECTURES.length}) · Physics (${PHYSICS_LESSONS.length}) · CS (${CS_LESSONS.length}) · ${totalExams} Official Exam Papers`
                    : `Toán học (${MATH_LECTURES.length} bài) · Vật lí (${PHYSICS_LESSONS.length} bài) · Tin học (${CS_LESSONS.length} bài) · ${totalExams} Đề thi chuẩn`}
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
        <section className="mt-6 sm:mt-8 sci-frame sci-scan-bar rounded-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-sky-500/25 p-5 sm:p-6 shadow-sm space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  01 · {isEn ? 'ALL 9 PLATFORM SYSTEMS' : 'TOÀN BỘ 9 HỆ THỐNG'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-sky-200 truncate block transition-colors">
                  {isEn ? 'Complete Feature Tour' : 'Giới thiệu toàn bộ chức năng web'}
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
                  {isEn ? `All Lectures (${totalLessons} lessons)` : `Danh sách bài giảng (${totalLessons} bài)`}
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
                  {isEn ? `Math Lectures (${MATH_LECTURES.length})` : `Bài giảng Toán (${MATH_LECTURES.length} bài)`}
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
                  {isEn ? `Physics Labs & Lessons (${PHYSICS_LESSONS.length})` : `Bài giảng Vật lí (${PHYSICS_LESSONS.length} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-105">
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
                  05 · {isEn ? 'COMPUTER SCIENCE' : 'TIN HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate block transition-colors">
                  {isEn
                    ? `CS 5 Roadmaps (${CS_LESSONS.length} + ${csSpecializedStageCount})`
                    : `Tin học · 5 lộ trình (${CS_LESSONS.length} + ${csSpecializedStageCount} chặng)`}
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
                  06 · {isEn ? 'COMMUNITY' : 'CỘNG ĐỒNG'}
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

        {/* GRAND ANIMATED OVERVIEW SHOWCASE: SYNAPSE 2.0 · HỌC TƯƠNG TÁC 3D · DIỄN ĐÀN HỌC TẬP */}
        <section
          aria-label={isEn ? 'Virtual Classroom, Interactive 3D and Forum Overview' : 'Giới thiệu sơ lược Synapse 2.0, Học tương tác 3D và Diễn đàn học tập'}
          className="mt-10 sm:mt-14 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-400">
                <Orbit className="w-4 h-4 icon-anim-cosmos" />
                <span>{isEn ? 'INTERACTIVE FLAGSHIP OVERVIEW' : 'GIỚI THIỆU SƠ LƯỢC · KHÔNG GIAN TRẢI NGHIỆM NỔI BẬT'}</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? 'Synapse 2.0 · Interactive 3D Lab · Study Forum'
                  : 'Synapse 2.0 · Học Tương Tác 3D · Diễn Đàn Học Tập'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md">
              {isEn
                ? 'Switch preview tabs inside each animated deck, then click launch to enter directly.'
                : 'Khám phá trực tiếp cấu trúc từng khu vực bên dưới trước khi bấm bước vào trải nghiệm ngay.'}
            </p>
          </div>

          {/* FRAME 1: SYNAPSE 2.0 (30 ĐẠI CÔNG TRÌNH 3D) */}
          <div
            id="visitor-synapse-overview"
            style={{ ['--holo-accent' as string]: '#38bdf8', ['--holo-secondary' as string]: '#818cf8' }}
            className={`scroll-mt-24 holo-card-frame rounded-lg shadow-2xl shadow-sky-950/25 ${
              focusedShowcase === 'synapse_v2' ? 'showcase-focus-active ring-2 ring-sky-400' : ''
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
                className="synapse-aurora-blob-b pointer-events-none -bottom-24 right-10 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl absolute"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent showcase-beam-glide"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* Left Content & Interactive 4-Domain Preview */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-500/15 border border-sky-400/40 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-sky-300">
                      <Orbit className="w-4 h-4 icon-anim-cosmos" />
                      <span>{isEn ? 'SYNAPSE 2.0 · 30 WEBGL 3D WORLDS' : 'SYNAPSE 2.0 · 30 ĐẠI CÔNG TRÌNH 3D'}</span>
                    </span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white leading-snug">
                    {isEn
                      ? 'Explore 30 Interactive 3D Scientific Chambers with Live Formulas'
                      : '30 Không Gian Mô Phỏng Vũ Trụ, Vật Lí, Vi Tính & Toán Học 60 FPS'}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {isEn
                      ? 'Step inside large-scale 3D structures on your browser—rotate 360°, adjust experimental variables in real time, and inspect live physical & mathematical equations.'
                      : 'Bước trực tiếp vào từng đại công trình 3D trên trình duyệt: xoay 360°, phóng to cấu trúc hạt – quang học – mạng nơ-ron và điều chỉnh tham số công thức sống ngay trên mô hình.'}
                  </p>

                  {/* Interactive Domain Tabs */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(
                      [
                        { id: 'physics', vi: 'Vật lí & Lượng tử', en: 'Physics & Quantum' },
                        { id: 'space', vi: 'Vũ trụ & Thiên văn', en: 'Cosmos & Space' },
                        { id: 'cs', vi: 'Vi tính & AI 3D', en: 'CS & AI Core' },
                        { id: 'math', vi: 'Toán học 3D', en: '3D Mathematics' },
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
                              ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-sm shadow-sky-400/30'
                              : 'bg-white/6 hover:bg-white/14 text-slate-200 border-white/15'
                          }`}
                        >
                          {isEn ? tab.en : tab.vi}
                        </button>
                      );
                    })}
                  </div>

                  {/* Highlighted Chambers for Active Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      {
                        physics: [
                          { title: isEn ? 'CERN LHC Collider' : 'Máy gia tốc CERN LHC', desc: isEn ? 'Magnetic beam bending' : 'Từ trường bẻ cong chùm hạt' },
                          { title: isEn ? 'Double-Slit Laser' : 'Giao thoa Laser Khe kép', desc: isEn ? 'Live λ & fringe spacing' : 'Chỉnh bước sóng λ & vân sáng' },
                          { title: isEn ? 'Tokamak Fusion & 7T MRI' : 'Lò Tokamak & MRI 7T', desc: isEn ? 'Plasma confinement ring' : 'Vòng plasma từ trường siêu dẫn' },
                        ],
                        space: [
                          { title: isEn ? 'James Webb Telescope' : 'Kính thiên văn James Webb', desc: isEn ? '18-mirror gold array' : 'Hệ 18 gương vàng L2' },
                          { title: isEn ? 'Dyson Black Hole' : 'Hố đen & Vòng Dyson', desc: isEn ? 'Relativistic accretion disk' : 'Đĩa bồi tụ & chân trời sự kiện' },
                          { title: isEn ? 'Wormhole & Solar Tower' : 'Hố sâu & Tháp Mặt Trời', desc: isEn ? 'Spacetime curvature mesh' : 'Lưới cong không-thời gian' },
                        ],
                        cs: [
                          { title: isEn ? 'LiDAR SLAM Core' : 'Cảm biến LiDAR SLAM', desc: isEn ? '360° point-cloud scan' : 'Quét đám mây điểm 360°' },
                          { title: isEn ? 'Photonic Tensor Chip' : 'Chip Quang tử Tensor', desc: isEn ? 'Optical matrix waveguides' : 'Ống dẫn sóng nhân ma trận' },
                          { title: isEn ? '3D Neural & Dijkstra' : 'Mạng Nơ-ron & Đồ thị 3D', desc: isEn ? 'Live shortest-path pulse' : 'Truyền xung tìm đường ngắn nhất' },
                        ],
                        math: [
                          { title: isEn ? 'Riemann & Oxyz Mesh' : 'Mặt cầu Riemann & Oxyz', desc: isEn ? 'Complex plane mapping' : 'Ánh xạ mặt phẳng phức 3D' },
                          { title: isEn ? 'Platonic Polyhedra' : 'Khối đa diện Platon', desc: isEn ? 'Vertex-edge-face duality' : 'Đối ngẫu đỉnh - cạnh - mặt' },
                          { title: isEn ? '3D Surface Integrals' : 'Tích phân mặt cong 3D', desc: isEn ? 'Gradient & flux vectors' : 'Vector thông lượng qua mặt cong' },
                        ],
                      }[synapsePreviewDomain]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-md bg-white/6 border border-sky-300/25 px-3 py-2.5 space-y-0.5 transition-all hover:border-sky-300/60 hover:bg-white/10"
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
                      className="group/btn cs-deck-btn cta-beacon-glow px-6 py-3 rounded-md bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 hover:from-sky-300 hover:to-blue-300 text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Orbit className="w-4 h-4 icon-anim-cosmos" />
                      <span>{isEn ? 'Launch Synapse 2.0 Classroom' : 'Bước vào Synapse 2.0 ngay'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-xs text-slate-400">
                      {isEn ? '30 worlds · Direct browser launch' : 'Mở ngay 30 không gian 3D · Không cần cài đặt'}
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
                      <span>SYNAPSE 2.0 · 360° WEBGL</span>
                      <span className="tabular-nums px-2 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-cyan-200">
                        {synapsePreviewDomain === 'physics' && 'E = γ·m₀c²'}
                        {synapsePreviewDomain === 'space' && 'Rs = 2GM/c²'}
                        {synapsePreviewDomain === 'cs' && 'y = σ(W·x + b)'}
                        {synapsePreviewDomain === 'math' && '∬ F·dS = ∭ ∇·F dV'}
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
                        {synapsePreviewDomain === 'physics' && (isEn ? '9 Physics & Quantum Chambers' : '9 Phòng Vật lí & Lượng tử')}
                        {synapsePreviewDomain === 'space' && (isEn ? '7 Space & Astrophysics Chambers' : '7 Trạm Vũ trụ & Thiên văn')}
                        {synapsePreviewDomain === 'cs' && (isEn ? '8 AI, Robotics & CS Chambers' : '8 Lõi AI, LiDAR & Vi tính')}
                        {synapsePreviewDomain === 'math' && (isEn ? '6 Pure Math & Geometry Chambers' : '6 Không gian Toán học 3D')}
                      </span>
                      <span className="font-mono text-sky-300 font-semibold tabular-nums">30 / 30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FRAME 2: HỌC TƯƠNG TÁC 3D (10-FINGER GESTURE & OXYZ) */}
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
                      <span>{spatialPreviewTab === 'models3d' ? '15 MODELS · 3D IK' : '6 LABS · 2D STUDIO'}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/15 border border-teal-400/30 text-emerald-300">
                        10-FINGER LOCK
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
                            ? 'Pinch to zoom, spread to explode 3D layers'
                            : 'Chụm ngón phóng to, xòe tay tách lớp mô hình 3D'
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
                    <span>{isEn ? 'INTERACTIVE 3D · 10-FINGERTIP WEBCAM & OXYZ LAB' : 'HỌC TƯƠNG TÁC 3D · CẢM BIẾN 10 ĐẦU NGÓN TAY'}</span>
                  </div>

                  <h4 className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-white leading-snug">
                    {isEn
                      ? 'Sculpt 2D Geometry & Manipulate 15 Realistic 3D Models by Hand or Mouse'
                      : 'Xưởng Hình Học 2D & 15 Mô Hình 3D Thực Tế Điều Khiển Trực Quan'}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {isEn
                      ? 'Smooth 10-fingertip tracking with anti-jitter locking and single/dual-hand modes—plus instant mouse and touch controls if you prefer studying without a webcam.'
                      : 'Thuật toán nhận diện cố định 10 đầu ngón tay chống rung loạn kèm nút chọn 1 hoặc 2 tay, độ nhạy tùy chỉnh — đồng thời hỗ trợ kéo chuột và chạm cảm ứng trực tiếp khi không mở camera.'}
                  </p>

                  {/* Interactive Tab Toggle: 15 3D Models vs 6 2D Geometry Labs */}
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
                      {isEn ? '15 Realistic 3D Models' : '15 Mô hình 3D Thực tế'}
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
                          { title: isEn ? 'Turbofan Jet Engine' : 'Động cơ phản lực Turbofan', desc: isEn ? 'Exploded turbine rotors' : 'Tách lớp cánh quạt & buồng đốt' },
                          { title: isEn ? 'Hand-IK Robotic Arm' : 'Cánh tay Robot IK 6 bậc', desc: isEn ? 'Follows finger joints live' : 'Bám theo khớp tay thời gian thực' },
                          { title: isEn ? 'Solar Orrery & Wind Tunnel' : 'Hệ Mặt Trời & Hầm Gió', desc: isEn ? 'Orbital Kepler & airflow' : 'Quỹ đạo Kepler & dòng khí động lực' },
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
                      <span>{isEn ? 'Launch Interactive 3D Lab' : 'Vào Học tương tác 3D ngay'}</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <span className="text-xs text-slate-400">
                      {isEn ? 'Works with Webcam or Mouse/Touch' : 'Dùng được bằng Webcam hoặc Chuột / Cảm ứng'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                        MATH · PHYS · CS
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
                          : 'Thảo luận Toán · Lí · Tin & chia sẻ cách giải hay'}
                      </span>
                      <span className="font-mono text-indigo-300 font-semibold">24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GRAND MULTI-DEVICE APP DOWNLOAD SHOWCASE (LAPTOP · ANDROID · IPHONE) */}
        <div className="cv-auto mt-12 sm:mt-16">
          <AppDownloadGuideSection
            id="visitor-app-download"
            onOpenInstallApp={onOpenInstallApp}
            showFeatureMatrix={true}
          />
        </div>

        {/* COMPLETE PLATFORM CAPABILITIES SHOWCASE (ALL 9 WEB SYSTEMS) */}
        <section
          id="visitor-all-features"
          className="cv-auto scroll-mt-24 mt-12 sm:mt-16 pt-10 border-t border-slate-200/80 dark:border-white/10 space-y-8"
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
            {/* 01: Synapse v2 */}
            {(featureCategory === 'all' || featureCategory === 'simulation') && (
              <div
                data-ripple="true"
                onClick={handleEnterSynapseV2}
                className="group sci-frame relative overflow-hidden p-5 sm:p-6 rounded-xl bg-white/92 dark:bg-slate-900/82 border border-sky-300/85 dark:border-sky-500/35 hover:border-sky-500 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 120"
                  className="absolute right-2 top-2 w-20 h-20 opacity-20 dark:opacity-30 pointer-events-none animate-orbit-slow"
                >
                  <circle cx="60" cy="60" r="42" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6 5" />
                  <circle cx="60" cy="60" r="24" fill="none" stroke="#38bdf8" strokeWidth="1.3" />
                </svg>
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Orbit className="w-6 h-6 icon-anim-cosmos" />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                      01 · WEBGL 3D
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                    {isEn ? 'Synapse v2 · 30 3D Chambers' : 'Lớp Học Ảo Synapse v2 · 30 Đại Công Trình'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'CERN LHC, Double-Slit Laser, James Webb, Dyson Black Hole, Tokamak Fusion, LiDAR SLAM, 7T MRI Ring, Sagnac Gyro, Metamaterial Cloak & Photonic Chip.'
                      : '30 không gian 3D tương tác trực tiếp: LHC, Laser khe kép, James Webb, Hố đen Dyson, Tokamak, LiDAR SLAM, MRI 7T, Con quay Sagnac, Áo tàng hình & Chip quang tử.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{isEn ? 'Live formula tuning inside 3D chambers' : 'Chỉnh thông số & công thức sống trong 3D'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>{isEn ? 'Physics · Space · CS · Pure Math' : 'Đủ 4 nhóm: Vật lí, Vũ trụ, Vi tính & Toán'}</span>
                    </li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnterSynapseV2();
                  }}
                  className="cs-deck-btn relative z-10 w-full py-2.5 px-4 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>{isEn ? 'Launch 30 3D Worlds' : 'Mở 30 Đại công trình 3D'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 02: Spatial 3D 10-Fingertip Gesture Lab */}
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
                      02 · 10-FINGER AI
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                    {isEn ? 'Spatial 3D · 10-Fingertip Webcam' : 'Học Cảm Giác 3D · Cảm Biến 10 Ngón Tay'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Strict 10-fingertip webcam lock with zero jumping. Build 6 2D labs + "Tự do tạo" freehand geometry canvas, explode & pinch-reassemble (4 fingers) 15 realistic 3D models.'
                      : 'Nhận diện cố định 10 đầu ngón tay chống loạn. 6 xưởng 2D + bảng "Tự do tạo" vẽ tay tự do; 15 mô hình 3D tách cấu trúc, chọn từng bộ phận bằng 2 ngón & ghép lại với 4 ngón tay.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{isEn ? 'Explode layers, inspect parts & 4-finger reassemble' : 'Tách lớp, soi chi tiết bộ phận & ghép lại bằng 4 ngón'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{isEn ? 'Freehand 2D drawing + mouse/touch fallback' : 'Tự do tạo hình học 2D & kéo chuột mượt khi tắt cam'}</span>
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
                  <span>{isEn ? 'Open Spatial 3D Lab' : 'Vào Học cảm giác 3D'}</span>
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
                      03 · 5 DOMAINS
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                    {isEn ? 'Physics 2D/3D · 5 Separate Domains' : 'Mô Phỏng Vật Lí 2D/3D · 5 Lĩnh Vực Riêng'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'PhET-inspired Grade 9–12 labs split into 5 clean pages: Mechanics, Waves, Electricity/RLC, Optics/Quantum & Thermal/Nuclear, plus clear THPT & Specialized lessons.'
                      : 'Tổng hợp thí nghiệm Lớp 9–12 chuẩn PhET tách riêng 5 trang: Cơ học, Dao động & Sóng, Điện từ & RLC, Quang & Lượng tử, Nhiệt & Hạt nhân.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isEn ? '41 2D interactive canvases + 32 3D 60FPS labs' : 'Tách rõ 41 Lab 2D & 32 mô phỏng 3D 60 FPS'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isEn ? `${PHYSICS_LESSONS.length} THPT & Specialized lectures` : `${PHYSICS_LESSONS.length} bài giảng chuẩn cấp độ THPT / Chuyên`}</span>
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
                  <span>{isEn ? 'Open 5 Physics Domains' : 'Mở 5 Chuyên đề Vật lí'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* 04: Math 2D & Oxyz 3D */}
            {(featureCategory === 'all' || featureCategory === 'simulation' || featureCategory === 'curriculum_ai') && (
              <div
                data-ripple="true"
                onClick={() => {
                  navigate({ subject: 'math', mathTab: 'grapher', tutorOpen: false });
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
                    {isEn ? `Math 2D & Oxyz 3D (${MATH_LECTURES.length})` : `Toán Học 2D & Oxyz 3D (${MATH_LECTURES.length} bài)`}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Plot functions & shade definite integrals; explore 2D Circle geometry, Conics, tangent cones, and 8 rotatable Oxyz 3D models alongside 5-step Grade 9–12 lessons.'
                      : 'Vẽ đồ thị đa thức, mũ-logarit, tô diện tích tích phân; tương tác đường tròn 2D (tiếp tuyến, phương tích) & 8 mô hình Oxyz 3D xoay tự do kèm bài giảng 5 bước.'}
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
                    navigate({ subject: 'math', mathTab: 'grapher', tutorOpen: false });
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
                    {isEn ? '5 CS Roadmaps · Sublime 4 & 16 Algos' : 'Tin Học 5 Lộ Trình & Sublime 4 IDE'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? '5 curated roadmaps (VNOI CP + OpenEDG, Roadmap.sh, LearnCpp & GitHub C++ Career), Monokai Sublime Text 4 IDE, Online Judge with auto test generation, and 16 interactive algorithm graphs.'
                      : 'Đủ 5 lộ trình chuẩn (VNOI Thi đấu + OpenEDG CPE/CPA/CPP, Roadmap.sh, LearnCpp Modern C++ & GitHub C++ Career), trình code Sublime Text 4 Monokai, Online Judge & 16 đồ thị thuật toán.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>
                        {isEn
                          ? `5 Roadmaps: ${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++ stages`
                          : `5 Lộ trình: ${CS_LESSONS.length} bài VNOI + ${csSpecializedStageCount} chặng C++ Quốc tế`}
                      </span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{isEn ? '16 interactive algorithm graphs + AI debug' : '16 đồ thị chạy từng bước + Sinh test ẩn bằng ảnh/giọng nói'}</span>
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
                  <span>{isEn ? 'Open Code Judge IDE' : 'Mở IDE & 16 Thuật toán'}</span>
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

            {/* 07: 3 Independent AI Tutors + Voice Recognition */}
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
                      07 · SYN AI ×3
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {isEn ? 'Syn AI (Syn Math · Syn Physics · Syn Code)' : 'Syn AI (Syn Math · Syn Physics · Syn Code)'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Dedicated Syn Math, Syn Physics & Syn Code engines (Left Ctrl + D/F/G) with real-time Voice Mic, image paste, and 3 modes: Guided Hints, 4-Step Solution & Roadmap.'
                      : '3 động cơ độc lập Syn Math · Syn Physics · Syn Code (Ctrl trái + D/F/G). Hỗ trợ Micro giọng nói Việt/Anh, dán ảnh đề và 3 chế độ: Gợi mở, Giải 4 bước & Test vẽ lộ trình.'}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{isEn ? 'Live Voice-to-Text inside Syn AI HUD' : 'Micro nhận diện giọng nói trong giao diện Syn AI'}</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{isEn ? 'Shortcuts: Ctrl+D (Syn Math) · Ctrl+F (Syn Physics) · Ctrl+G (Syn Code)' : 'Phím tắt: Ctrl+D (Syn Math), Ctrl+F (Syn Physics), Ctrl+G (Syn Code)'}</span>
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
                  <span>{isEn ? 'Launch Syn AI' : 'Mở Syn AI Command Center'}</span>
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
                      ? 'Smart Knowledge Map & adaptive weekly planner for Grades 9–12, daily MCQ & AI-graded Essay Arena rankings, plus the collaborative STEM Study Forum.'
                      : 'Bản đồ tri thức thông minh tự chẩn đoán lỗ hổng kiến thức & xếp lịch tuần, thi Đấu Trường Tuần (Trắc nghiệm & Tự luận AI chấm) lên BXH trực tuyến, và Diễn đàn hỏi đáp 24/7.'}
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

        {/* Full Lecture Directory on Welcome Page */}
        <div className="cv-auto mt-12 sm:mt-16">
          <LectureDirectorySection
            id="visitor-lecture-directory"
            subjectFilter={directorySubject}
            onSubjectFilterChange={setDirectorySubject}
            onSelectLecture={handleOpenLectureFromVisitor}
            onSelectCsTrack={handleOpenCsTrackFromVisitor}
            actionHintVi="Bấm vào bất kỳ bài giảng hoặc lộ trình nào để vào ngay lớp học mô phỏng 5 bước (không cần đăng nhập)."
            actionHintEn="Click any lecture or roadmap below to launch directly into its 5-step simulation classroom (no sign-in required)."
          />
        </div>

        {/* Community Reviews & Ratings Section on Landing */}
        <div className="cv-auto mt-12 sm:mt-16">
          <PlatformReviews id="visitor-platform-reviews" />
        </div>
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
            <span>{isEn ? 'Synapse v2 (30)' : 'Synapse v2 (30)'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Spatial 3D (10-Finger)' : 'Học cảm giác 3D'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? '5 Physics Domains' : '5 Chuyên đề Vật lí'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Math Oxyz 3D' : 'Toán 2D & Oxyz'}</span>
            <span aria-hidden="true">·</span>
            <span>Sublime Text 4 Judge</span>
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
