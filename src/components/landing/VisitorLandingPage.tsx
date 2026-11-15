import React, { useState, useRef, useEffect } from 'react';
import { GalaxyBackground } from '../galaxy/GalaxyBackground';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme, CREATURE_THEME_OPTIONS } from '../../context/BackgroundContext';
import { BrandLogo } from '../common/BrandLogo';
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
  ChevronDown
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useNavigation } from '../../context/NavigationContext';
import { PlatformReviews } from '../common/PlatformReviews';
import {
  LectureDirectorySection,
  DirectorySubjectFilter,
  LectureDirectoryTarget
} from '../common/LectureDirectorySection';

import { EXAM_PAPERS } from '../../data/examData';
import { MATH_LECTURES } from '../../data/curriculumData';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { CS_LESSONS } from '../../data/csLessonsData';

interface VisitorLandingPageProps {
  onEnterAsGuest: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

type LandingSpotlightKey = 'math' | 'physics' | 'cs' | 'exams';

export const VisitorLandingPage: React.FC<VisitorLandingPageProps> = ({
  onEnterAsGuest,
  isDark = true,
  onToggleTheme,
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
  const creatureMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCreatureMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (creatureMenuRef.current && !creatureMenuRef.current.contains(e.target as Node)) {
        setIsCreatureMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCreatureMenuOpen]);

  const [activeSpotlight, setActiveSpotlight] = useState<LandingSpotlightKey>('math');
  const activeCreature =
    CREATURE_THEME_OPTIONS.find((opt) => opt.id === creatureTheme) || CREATURE_THEME_OPTIONS[0];

  const totalExams = EXAM_PAPERS.length;
  const chuyenExams = EXAM_PAPERS.filter((e) => e.track === 'chuyen').length;
  const khongChuyenExams = EXAM_PAPERS.filter((e) => e.track === 'khong_chuyen').length;
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
    math: {
      label: isEn ? 'Math 2D & 3D' : 'Toán 2D & 3D',
      badge: isEn ? `${MATH_LECTURES.length} Grades 9–12 topics` : `${MATH_LECTURES.length} chuyên đề VietJack 9–12`,
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
        ? `${PHYSICS_LESSONS.length} lessons · 19 2D Labs & 14 3D models`
        : `${PHYSICS_LESSONS.length} bài giảng · 19 Lab 2D & 14 mô hình 3D`,
      headline: isEn
        ? 'Real-time 60 FPS Physics Laboratory for Grades 9 to 12'
        : 'Phòng thí nghiệm Vật lí thời gian thực 60 FPS từ Lớp 9 đến 12',
      summary: isEn
        ? 'Adjust standing waves, Doppler sound speed, photoelectric wavelengths, RLC circuits or angular velocity across 2D canvases and 3D simulations.'
        : 'Điều chỉnh tự do tham số sóng dừng, hiệu ứng Doppler, ống quang điện Einstein, mạch RLC nối tiếp hoặc tốc độ góc trên cả mặt phẳng 2D và không gian 3D tương tác.',
      highlights: isEn
        ? [
            'Standing waves, Doppler shock cones & Photoelectric tube 2D/3D',
            'RLC AC circuits, resonance & 3D AC generator',
            'Young double-slit light interference with dynamic λ colors',
          ]
        : [
            'Sóng dừng, Hiệu ứng Doppler & Ống Quang điện ngoài 2D/3D',
            'Mạch xoay chiều RLC, Cộng hưởng điện & Máy phát 3D',
            'Giao thoa ánh sáng khe Y-âng đổi màu theo bước sóng λ',
          ],
      accentClass: 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    cs: {
      label: isEn ? 'CS Sublime IDE' : 'Tin Học Sublime IDE',
      badge: isEn
        ? `${CS_LESSONS.length} VNOI modules + Free Studio`
        : `${CS_LESSONS.length} lộ trình VNOI + Code Tự Do`,
      headline: isEn
        ? 'Sublime Text 4 Monokai Studio & Multi-Language Online Judge'
        : 'Trình soạn thảo Sublime Text 4 Monokai & Online Judge đa ngôn ngữ',
      summary: isEn
        ? 'Includes Edit/Selection/Find-Replace/Goto Line menus, C++ & Python competitive snippets, and image/file problem upload to auto-generate hidden test cases and grade instantaneously.'
        : 'Trang bị đầy đủ thanh thực đơn Edit/Selection/Find-Replace/Goto Line/Snippets C++ & Python chuẩn thi HSG, kèm chế độ gửi đề bài bằng ảnh hoặc file để tự động sinh bộ test ẩn chấm điểm tức thì.',
      highlights: isEn
        ? [
            'Full Edit: 60-step Undo/Redo, Duplicate/Move Line, Find & Replace',
            '1-click CP Snippets (Fast I/O, Prefix Sum, BFS, DP)',
            'Auto-judge C++ & Python with stdin/stdout & hidden tests',
          ]
        : [
            'Full Edit: Undo/Redo 60 bước, Duplicate/Move Line, Find & Replace',
            'Thư viện Snippet CP (Fast I/O, Prefix Sum, BFS, DP) chèn 1 chạm',
            'Chấm tự động C++ & Python với stdin/stdout và báo cáo test ẩn',
          ],
      accentClass: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    exams: {
      label: isEn ? `${totalExams} Official Exams` : `${totalExams} Đề Thi Chuẩn`,
      badge: isEn
        ? `${chuyenExams} Specialized & ${khongChuyenExams} Standard`
        : `${chuyenExams} Chuyên & ${khongChuyenExams} Không Chuyên`,
      headline: isEn
        ? `${totalExams} national exam bank with timer, AI image grading & step solutions`
        : `Ngân hàng ${totalExams} đề thi quốc gia kèm đồng hồ bấm giờ, chấm ảnh AI & lời giải`,
      summary: isEn
        ? 'Synced dynamically with the full exam bank. Each paper features a countdown timer, scratchpad, photo submission with AI grading & follow-up Q&A, and step-by-step solutions.'
        : 'Số lượng đề hiển thị tự động cập nhật theo kho đề thực tế của hệ thống. Mỗi đề tích hợp đồng hồ đếm ngược, ghi chú đáp án, nộp ảnh bài làm để AI chấm điểm và giải đáp thắc mắc.',
      highlights: isEn
        ? [
            `Complete ${totalExams} papers across Math · Physics · CS`,
            'Separated into Specialized / Olympic & Standard High School tracks',
            'Upload handwritten work photo for AI scoring & follow-up Q&A',
          ]
        : [
            `Tự động đồng bộ đúng ${totalExams} bộ đề Toán · Lí · Tin`,
            'Phân khu rõ Chuyên & HSG Quốc gia với Không chuyên THPT',
            'Nộp ảnh bài làm để AI chấm điểm, công bố & giải đáp trực tiếp',
          ],
      accentClass: 'text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10',
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
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Dynamic 60fps Galaxy Background (Works in both Dark Deep Space & Light Celestial Aurora) */}
      <GalaxyBackground interactive={true} intensity="vibrant" isDark={isDark} />

      {/* Top Navigation Bar (Enlarged VI/EN row with lively interactions) */}
      <header className="relative z-20 border-b border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 min-h-[68px] sm:min-h-[78px] flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo sizeClass="w-9 h-9 sm:w-10 sm:h-10" />
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block truncate">
                Synapse
              </span>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-300 block -mt-0.5 truncate">
                Galaxy Academic Edition
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleLanguage}
              className="group sheen-btn flex items-center gap-1.5 px-3.5 sm:px-4.5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-2xl border border-indigo-200/90 dark:border-white/20 bg-white/90 dark:bg-white/10 text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-white/20 hover:border-indigo-400 shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title={isEn ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-indigo-500 group-hover:rotate-12 transition-transform" />
              <span className={!isEn ? 'text-indigo-600 dark:text-indigo-300 font-black' : 'opacity-60'}>VI</span>
              <span className="opacity-40">/</span>
              <span className={isEn ? 'text-indigo-600 dark:text-indigo-300 font-black' : 'opacity-60'}>EN</span>
            </button>

            <div className="relative" ref={creatureMenuRef}>
              <button
                onClick={() => setIsCreatureMenuOpen(!isCreatureMenuOpen)}
                className="group sheen-btn flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-2xl border border-indigo-200/80 dark:border-white/20 bg-white/90 dark:bg-white/10 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-white/20 hover:border-indigo-400 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title={isEn ? 'Choose interactive background creature' : 'Chọn sinh vật nền tương tác'}
              >
                <Wand2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:rotate-12 transition-transform shrink-0" />
                <span className="hidden sm:inline">{isEn ? activeCreature.shortEn : activeCreature.shortVi}</span>
              </button>

              {isCreatureMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 text-xs">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    {isEn ? 'Interactive Background' : 'Nền Sinh Vật Tương Tác'}
                  </div>
                  {CREATURE_THEME_OPTIONS.map((opt) => {
                    const selected = opt.id === creatureTheme;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setCreatureTheme(opt.id);
                          setIsCreatureMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{isEn ? opt.labelEn : opt.labelVi}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollToLectureDirectory('all')}
              className="group sheen-btn flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-extrabold rounded-2xl border border-indigo-400/80 dark:border-indigo-400/50 bg-indigo-600/12 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Table of Contents · Jump to Lectures' : 'Mục lục · Cuộn xuống Danh sách bài giảng'}
            >
              <ListOrdered className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform shrink-0" />
              <span>{isEn ? 'Contents' : 'Mục lục'}</span>
            </button>

            <button
              type="button"
              onClick={scrollToVisitorReviews}
              className="group sheen-btn flex items-center gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-2xl border border-amber-300/90 dark:border-amber-400/40 bg-amber-50/95 dark:bg-amber-950/45 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Scroll to Reviews & Votes' : 'Cuộn xuống Đánh giá & Bình chọn'}
            >
              <Star className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="hidden md:inline">{isEn ? 'Reviews' : 'Đánh giá & Bình chọn'}</span>
            </button>

            <button
              type="button"
              onClick={toggleBgPlaying}
              className={`group sheen-btn p-2.5 sm:p-3 rounded-2xl border shadow-xs transition-all cursor-pointer ${
                isBgPlaying && bgSound !== 'off'
                  ? 'border-emerald-400/70 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-white/20 bg-white/90 dark:bg-white/10 text-slate-600 dark:text-slate-200 hover:border-indigo-400'
              }`}
              title={isEn ? 'Toggle background music' : 'Bật/tắt âm thanh nền'}
            >
              {isBgPlaying && bgSound !== 'off' ? (
                <Volume2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
              )}
            </button>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="group sheen-btn p-2.5 sm:p-3 text-slate-600 dark:text-slate-200 bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-amber-50 dark:hover:bg-white/20 rounded-2xl shadow-xs transition-all cursor-pointer"
                title={isEn ? (isDark ? 'Switch to Light' : 'Switch to Dark') : isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-400 group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-indigo-600 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            )}

            <button
              onClick={onEnterAsGuest}
              className="group sheen-btn px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-100 border border-transparent transition-all flex items-center gap-2 shadow-md whitespace-nowrap cursor-pointer"
            >
              <span className="hidden sm:inline">{isEn ? 'Explore as Guest' : 'Vào trải nghiệm thử (Khách)'}</span>
              <span className="sm:hidden">{isEn ? 'Try Now' : 'Vào thử'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>
      </header>

      {/* Grand Hero Section with Dedicated Auth Portal */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Academic Presentation */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 backdrop-blur-sm max-w-full">
              <Star className="w-3.5 h-3.5 shrink-0 text-amber-500 dark:text-amber-300 fill-amber-400" />
              <span className="truncate sm:whitespace-normal">
                {isEn
                  ? 'Interactive Visual Learning Ecosystem Grades 9–12 & Olympiad'
                  : 'Hệ Sinh Thái Học Tập Trực Quan 9–12 & Chuyên Quốc Gia'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {isEn ? (
                <>
                  Explore the 360° Interactive Classroom{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 dark:from-indigo-400 dark:via-purple-300 dark:to-amber-300">
                    Galaxy
                  </span>
                </>
              ) : (
                <>
                  Khám Phá Vũ Trụ Mô Phỏng Lớp Học{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 dark:from-indigo-400 dark:via-purple-300 dark:to-amber-300">
                    360°
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {isEn ? (
                <>
                  Specialized STEM platform for Junior/High School &amp; Olympiad students featuring{' '}
                  <strong className="text-slate-900 dark:text-white">{totalLessons} 5-step lessons</strong>, real-time{' '}
                  <strong className="text-slate-900 dark:text-white">Math · Physics 2D/3D 60 FPS</strong> labs,{' '}
                  <strong className="text-slate-900 dark:text-white">Sublime Text 4</strong> Online Judge and{' '}
                  <strong className="text-slate-900 dark:text-white">{totalExams} official exam papers</strong>.
                </>
              ) : (
                <>
                  Nền tảng học tập chuyên sâu dành cho học sinh THCS, THPT và Đội tuyển Chuyên với{' '}
                  <strong className="text-slate-900 dark:text-white">{totalLessons} bài giảng 5 bước</strong> theo chuẩn VietJack, phòng mô phỏng{' '}
                  <strong className="text-slate-900 dark:text-white">Toán · Vật lí 2D/3D 60 FPS</strong>, trình soạn thảo{' '}
                  <strong className="text-slate-900 dark:text-white">Sublime Text 4</strong> kèm Online Judge và kho{' '}
                  <strong className="text-slate-900 dark:text-white">{totalExams} đề thi</strong> cập nhật linh hoạt.
                </>
              )}
            </p>

            {/* Interactive 4-Pillar Quick Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveSpotlight('math')}
                className={`min-w-0 text-left p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'math'
                    ? 'bg-white dark:bg-slate-900/90 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-400/60'
                }`}
              >
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Math 2D / Oxyz 3D' : 'Toán 2D / Oxyz 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${MATH_LECTURES.length} topics · 8 3D scenes` : `${MATH_LECTURES.length} bài · 8 cảnh 3D`}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpotlight('physics')}
                className={`min-w-0 text-left p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'physics'
                    ? 'bg-white dark:bg-slate-900/90 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-amber-400/60'
                }`}
              >
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isEn ? 'Physics 2D & 3D' : 'Vật Lý 2D & 3D'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? '19 2D Labs · 14 3D models' : '19 Lab 2D · 14 mẫu 3D'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpotlight('cs')}
                className={`min-w-0 text-left p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'cs'
                    ? 'bg-white dark:bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-emerald-400/60'
                }`}
              >
                <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isEn ? 'CS Sublime 4' : 'Tin Học Sublime 4'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${CS_LESSONS.length} modules · C++/Py` : `${CS_LESSONS.length} bài · Judge C++/Py`}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSpotlight('exams')}
                className={`min-w-0 text-left p-3 sm:p-3.5 rounded-2xl border backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                  activeSpotlight === 'exams'
                    ? 'bg-white dark:bg-slate-900/90 border-purple-500 ring-2 ring-purple-500/20'
                    : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-purple-400/60'
                }`}
              >
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate tabular-nums">
                  {isEn ? `${totalExams} Official Exams` : `${totalExams} Đề Thi Chuẩn`}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums truncate">
                  {isEn ? `${chuyenExams} Spec · ${khongChuyenExams} Std` : `${chuyenExams} Chuyên · ${khongChuyenExams} THPT`}
                </p>
              </button>
            </div>

            {/* Interactive Feature Spotlight Panel */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/85 dark:bg-slate-900/75 border border-slate-200/90 dark:border-white/15 backdrop-blur-md shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${spotlightDetails[activeSpotlight].accentClass}`}>
                  {spotlightDetails[activeSpotlight].badge}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Click any card above to inspect features' : 'Bấm từng thẻ phía trên để xem chi tiết tính năng'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {spotlightDetails[activeSpotlight].headline}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {spotlightDetails[activeSpotlight].summary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {spotlightDetails[activeSpotlight].highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-white/5 px-2.5 py-2 rounded-xl border border-slate-200/60 dark:border-white/10"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Guest Enter Action + Reviews Quick Scroll */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={onEnterAsGuest}
                className="sheen-btn w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform shrink-0" />
                <span>{isEn ? 'Enter Classroom Directly (Guest Mode)' : 'Vào Trực Tiếp Lớp Học (Không Cần Đăng Nhập)'}</span>
                <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToVisitorReviews}
                className="group sheen-btn w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/95 dark:bg-white/10 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-amber-300/90 dark:border-amber-400/40 text-amber-800 dark:text-amber-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                <span>{isEn ? 'Ratings & Votes' : 'Đánh giá & Bình chọn'}</span>
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isEn ? 'Study progress & roadmap saved automatically' : 'Lưu kết quả học & phân tích lộ trình trực tiếp trên máy bạn'}</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Glassmorphism Authentication Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/20 dark:shadow-indigo-950/50">
              {/* Card Mode Tabs */}
              {authMode !== 'forgot' ? (
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-5 border border-slate-200/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                      setUnauthDomainWarning(null);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      authMode === 'login'
                        ? 'bg-white dark:bg-white text-slate-900 dark:text-slate-900 shadow-md'
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
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      authMode === 'register'
                        ? 'bg-white dark:bg-white text-slate-900 dark:text-slate-900 shadow-md'
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
                <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/30 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-2">
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
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{isEn ? 'Continue with Google Now' : 'Tiếp tục vào với Google ngay'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && !unauthDomainWarning && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 rounded-xl text-rose-700 dark:text-rose-300 text-xs">
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
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-400/30 rounded-2xl text-center space-y-2.5">
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
                        className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold"
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
                            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
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
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white dark:hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors shadow-sm"
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
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-indigo-600 dark:text-indigo-300 font-mono transition-colors"
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
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-indigo-600 dark:text-indigo-300 font-mono transition-colors"
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
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
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
                            className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
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
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
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
                  className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline font-medium transition-colors"
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
            className="group relative overflow-hidden w-full rounded-3xl p-5 sm:p-7 bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 hover:from-indigo-500 hover:via-violet-500 hover:to-sky-500 text-white border border-white/25 animate-pulse-halo transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-left cursor-pointer active:scale-[0.97]"
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
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/18 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
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
                <p className="text-xs sm:text-sm text-indigo-100/95 font-medium truncate">
                  {isEn
                    ? `Math (${MATH_LECTURES.length}) · Physics (${PHYSICS_LESSONS.length}) · CS (${CS_LESSONS.length}) · ${totalExams} Official Exam Papers`
                    : `Toán học (${MATH_LECTURES.length} bài) · Vật lí (${PHYSICS_LESSONS.length} bài) · Tin học (${CS_LESSONS.length} bài) · ${totalExams} Đề thi chuẩn`}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-white text-indigo-700 font-extrabold text-xs sm:text-sm shadow-lg shrink-0 group-hover:bg-sky-50 group-hover:scale-105 transition-all whitespace-nowrap">
              <span>{isEn ? 'Scroll to Lectures' : 'Cuộn xuống xem ngay'}</span>
              <ChevronDown className="w-5 h-5 text-indigo-600 animate-bounce" />
            </div>
          </button>
        </div>

        {/* TABLE OF CONTENTS (MỤC LỤC) BAR */}
        <section className="mt-6 sm:mt-8 rounded-3xl bg-white/85 dark:bg-slate-900/75 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-500/25 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <h2 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                {isEn ? 'Table of Contents · Quick Navigation' : 'Mục Lục · Điều Hướng Nhanh Từng Môn'}
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Click any entry below to scroll directly to the lecture directory'
                : 'Bấm vào từng mục bên dưới để lọc & cuộn thẳng xuống danh sách bài giảng'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('all')}
              className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/55 hover:bg-indigo-100 dark:hover:bg-indigo-900/65 border border-indigo-300/80 dark:border-indigo-500/40 hover:border-indigo-500 text-left transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                  01 · {isEn ? 'FULL DIRECTORY' : 'TOÀN BỘ BÀI GIẢNG'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-200 truncate block transition-colors">
                  {isEn ? `All Lectures (${totalLessons} lessons)` : `Danh sách bài giảng (${totalLessons} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded-xl bg-indigo-600/10 group-hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('math')}
              className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/65 hover:bg-sky-50 dark:hover:bg-sky-950/45 border border-slate-200/85 dark:border-white/10 hover:border-sky-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 block">
                  02 · {isEn ? 'MATHEMATICS' : 'TOÁN HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate block transition-colors">
                  {isEn ? `Math Lectures (${MATH_LECTURES.length})` : `Bài giảng Toán (${MATH_LECTURES.length} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded-xl bg-sky-500/10 group-hover:bg-sky-500 text-sky-600 dark:text-sky-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('physics')}
              className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/65 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-slate-200/85 dark:border-white/10 hover:border-amber-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                  03 · {isEn ? 'PHYSICS' : 'VẬT LÍ'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate block transition-colors">
                  {isEn ? `Physics Labs & Lessons (${PHYSICS_LESSONS.length})` : `Bài giảng Vật lí (${PHYSICS_LESSONS.length} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded-xl bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToLectureDirectory('cs')}
              className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/65 hover:bg-emerald-50 dark:hover:bg-emerald-950/45 border border-slate-200/85 dark:border-white/10 hover:border-emerald-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  04 · {isEn ? 'COMPUTER SCIENCE' : 'TIN HỌC'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate block transition-colors">
                  {isEn ? `CS & VNOI Modules (${CS_LESSONS.length})` : `Bài giảng Tin học (${CS_LESSONS.length} bài)`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded-xl bg-emerald-500/12 group-hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => scrollToVisitorSection('visitor-ecosystem')}
              className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/65 hover:bg-purple-50 dark:hover:bg-purple-950/45 border border-slate-200/85 dark:border-white/10 hover:border-purple-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400 block">
                  05 · {isEn ? 'ECOSYSTEM & EXAMS' : 'HỆ SINH THÁI & ĐỀ THI'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 truncate block transition-colors">
                  {isEn ? `4 Pillars & ${totalExams} Exams` : `4 Phòng Lab & ${totalExams} Đề thi`}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded-xl bg-purple-500/12 group-hover:bg-purple-600 text-purple-600 dark:text-purple-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={scrollToVisitorReviews}
              className="group relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/65 hover:bg-amber-50 dark:hover:bg-amber-950/45 border border-slate-200/85 dark:border-white/10 hover:border-amber-400/80 text-left transition-all duration-200 cursor-pointer active:scale-[0.96] shadow-xs"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              <div className="relative z-10 min-w-0">
                <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                  06 · {isEn ? 'COMMUNITY' : 'CỘNG ĐỒNG'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 truncate block transition-colors">
                  {isEn ? 'Platform Ratings & Votes' : 'Đánh giá & Bình chọn'}
                </span>
              </div>
              <span className="relative z-10 w-8 h-8 rounded-xl bg-amber-500/12 group-hover:bg-amber-500 text-amber-600 dark:text-amber-400 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </section>

        {/* 4 Core Pillars Overview Section */}
        <div id="visitor-ecosystem" className="scroll-mt-24 mt-12 sm:mt-16 pt-10 border-t border-slate-200/80 dark:border-white/10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isEn
                ? 'Complete 360° Interactive STEM Learning Ecosystem'
                : 'Hệ Sinh Thái Lớp Học Mô Phỏng 360° Toàn Diện'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
              {isEn
                ? 'Every lesson includes 5 structured stages (Concept · Formula · Deep Dive · Ask AI · 2 MCQs & 1 Essay) with automatic progress & roadmap analysis.'
                : 'Mỗi bài giảng gồm 5 phần chuyên sâu (Khái niệm · Công thức · Giải thích sâu · Hỏi AI · 2 Trắc nghiệm & 1 Tự luận), tự động lưu kết quả và phân tích lộ trình học thông minh.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/85 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs min-w-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {isEn ? 'Math 2D & Oxyz 3D' : 'Toán Học 2D & Oxyz 3D'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Plot polynomials, logarithms, integrals; drag-and-drop geometry and rotate 7 interactive Oxyz 3D models.'
                  : 'Vẽ đồ thị đa thức, logarit, trị tuyệt đối, tô diện tích tích phân; dựng hình phẳng Conic/tứ giác nội tiếp và xoay 7 mô hình 3D trực quan.'}
              </p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                {isEn ? `Explore ${MATH_LECTURES.length} Math topics →` : `Xem ${MATH_LECTURES.length} bài Toán →`}
              </span>
            </div>

            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/85 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs min-w-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                {isEn ? 'Physics 2D & 3D Labs' : 'Phòng Lab Vật Lý 2D & 3D'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? '10 2D labs & 11 60 FPS 3D simulations: pendulums, circular motion, RLC AC phasors, Young wave interference, Lorentz fields.'
                  : '10 phòng thí nghiệm 2D và 11 cảnh 3D 60 FPS: Con lắc, chuyển động tròn, mạch xoay chiều RLC Fresnel, giao thoa khe Y-âng, từ trường Lorentz.'}
              </p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                {isEn ? `Explore ${PHYSICS_LESSONS.length} Physics labs →` : `Khám phá ${PHYSICS_LESSONS.length} bài Lí →`}
              </span>
            </div>

            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/85 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs min-w-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                Sublime Text 4 &amp; Online Judge
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? 'Monokai editor with Find/Replace, Goto Line, CP snippets; submit C++/Python against hidden tests or OCR custom problem images.'
                  : 'Trình soạn thảo Monokai đầy đủ Edit, Find/Replace, Goto Line, Snippet thi HSG; nộp bài C++/Python chấm test ẩn hoặc gửi đề tự do bằng ảnh/file.'}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                {isEn ? `Practice ${CS_LESSONS.length} modules →` : `Luyện ${CS_LESSONS.length} chuyên đề →`}
              </span>
            </div>

            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/85 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs min-w-0"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors tabular-nums">
                {isEn ? `${totalExams} Exams & AI Photo Grading` : `${totalExams} Đề Thi & AI Chấm Ảnh`}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {isEn
                  ? `${totalExams} curated papers (${chuyenExams} Specialized & ${khongChuyenExams} Standard) with photo submission, AI scoring & interactive Q&A.`
                  : `Ngân hàng ${totalExams} đề thi (${chuyenExams} Chuyên & ${khongChuyenExams} đề THPT) kèm nộp ảnh AI chấm điểm & giải đáp từng bước.`}
              </p>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                {isEn ? 'Explore Exam Bank →' : 'Khám phá đề thi →'}
              </span>
            </div>
          </div>
        </div>

        {/* Full Lecture Directory on Welcome Page */}
        <div className="mt-12 sm:mt-16">
          <LectureDirectorySection
            id="visitor-lecture-directory"
            subjectFilter={directorySubject}
            onSubjectFilterChange={setDirectorySubject}
            onSelectLecture={handleOpenLectureFromVisitor}
            actionHintVi="Bấm vào bất kỳ bài giảng nào để vào ngay lớp học mô phỏng 5 bước (không cần đăng nhập)."
            actionHintEn="Click any lecture below to launch directly into its 5-step simulation classroom (no sign-in required)."
          />
        </div>

        {/* Community Reviews & Ratings Section on Landing */}
        <div className="mt-12 sm:mt-16">
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
            <span>{isEn ? 'Math 2D & Oxyz 3D' : 'Toán 2D & Oxyz 3D'}</span>
            <span aria-hidden="true">·</span>
            <span>{isEn ? 'Physics 2D/3D 60FPS' : 'Vật lí 2D/3D 60FPS'}</span>
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
