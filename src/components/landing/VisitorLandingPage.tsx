import React, { useState } from 'react';
import { GalaxyBackground } from '../galaxy/GalaxyBackground';
import { useAuth } from '../../context/AuthContext';
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
} from 'lucide-react';

interface VisitorLandingPageProps {
  onEnterAsGuest: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

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

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    setUnauthDomainWarning(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('auth/unauthorized-domain')) {
        setUnauthDomainWarning(currentHostname);
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Cửa sổ đăng nhập Google đã được đóng.');
      } else {
        setErrorMessage(err.message || 'Đăng nhập Google thất bại, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDirect = () => {
    loginWithGoogleDirectly(
      regEmail || identifier || 'hungbuiday12@gmail.com',
      regFullName || 'Học viên Chuyên'
    );
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Vui lòng nhập tên đăng nhập/email và mật khẩu.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setUnauthDomainWarning(null);
    try {
      await loginWithUsernameOrEmail(identifier, password);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        setErrorMessage('Mật khẩu không chính xác. Vui lòng kiểm tra lại.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Định dạng email hoặc tên đăng nhập chưa hợp lệ.');
      } else {
        setErrorMessage(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập (viết liền không dấu).');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 4 ký tự.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await registerAccount(regUsername, regEmail, regPassword, regFullName);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Tên đăng nhập hoặc email này đã tồn tại trong hệ thống.');
      } else {
        setErrorMessage(err.message || 'Đăng ký không thành công, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập email chính xác để nhận thư.');
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

      {/* Top Navigation Bar */}
      <header className="relative z-20 border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white block">
                EduClassroom 360
              </span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300 block -mt-0.5">
                Galaxy Academic Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-xl transition-colors"
                title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>
            )}

            <button
              onClick={onEnterAsGuest}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 dark:text-white border border-transparent dark:border-white/15 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Vào trải nghiệm thử (Khách)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Grand Hero Section with Dedicated Auth Portal */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: Academic Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-xs font-semibold text-indigo-700 dark:text-indigo-300 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300 fill-amber-400" />
              <span>Cổng Giáo Dục & Khảo Thí Trực Quan Chuyên Sâu</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Khám Phá Vũ Trụ Mô Phỏng Lớp Học <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 dark:from-indigo-400 dark:via-purple-300 dark:to-amber-300">360°</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Nền tảng học tập đỉnh cao dành cho học sinh THCS, THPT Chuyên và Đội tuyển Olympic. Tích hợp trực quan đồ thị giải tích Oxy, phòng thí nghiệm vật lý 2D 60 FPS, trình chấm Online Judge C++/Python và 30 bộ đề thi chuẩn quốc gia.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xs">
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Toán Học Oxy</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Vẽ đồ thị & hình học</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xs">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Vật Lý 2D</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">5 mô phỏng thời gian thực</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xs">
                <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tin Học Judge</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Chấm C++/Python tự động</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xs">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1.5" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">30 Đề Chuyên</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Lời giải & tải file Word</p>
              </div>
            </div>

            {/* Quick Guest Enter Action */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnterAsGuest}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Vào Trực Tiếp Lớp Học (Không Cần Đăng Nhập)</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Dữ liệu lưu an toàn trên máy bạn</span>
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
                    Đăng Nhập
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
                    Đăng Ký Tài Khoản
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
                    <span>Quay lại Đăng nhập</span>
                  </button>
                </div>
              )}

              {/* Domain Warning for OAuth */}
              {unauthDomainWarning && (
                <div className="mb-4 p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-400/30 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
                    <span>Tên miền chưa cấp phép: {unauthDomainWarning}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Bấm nút bên dưới để vào ngay lập tức bằng hồ sơ Google mà không cần cài đặt:
                  </p>
                  <button
                    onClick={handleGoogleDirect}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Tiếp tục vào với Google ngay</span>
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
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quên Mật Khẩu?</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                      Nhập địa chỉ Gmail của bạn để nhận liên kết bảo mật thiết lập lại mật khẩu mới.
                    </p>
                  </div>

                  {resetSent ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-400/30 rounded-2xl text-center space-y-2.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mx-auto" />
                      <p className="text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
                        Đã gửi thư hướng dẫn đặt lại mật khẩu đến <strong>{resetEmail}</strong>!
                      </p>
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setResetSent(false);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold"
                      >
                        Quay lại Đăng nhập
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Địa chỉ Gmail / Email:
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="ví dụ: hocsinh@gmail.com"
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
                        <span>Gửi Thư Đặt Lại Mật Khẩu</span>
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
                        ? 'Đăng nhập nhanh với Google / Gmail'
                        : 'Đăng ký nhanh với Google / Gmail'}
                    </span>
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                    <span className="bg-white dark:bg-slate-900/90 px-3 text-[11px] text-slate-400 uppercase font-medium">
                      Hoặc tài khoản & mật khẩu
                    </span>
                  </div>

                  {/* LOGIN FORM */}
                  {authMode === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Tên đăng nhập (Username) hoặc Gmail:
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="ví dụ: hocsinh hoặc email"
                            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Demo test buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Gợi ý thử nhanh:</span>
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
                            Mật khẩu:
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
                            Quên mật khẩu?
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
                        {loading ? 'Đang vào...' : 'Đăng Nhập Vào Bục Giảng'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    /* REGISTER FORM */
                    <form onSubmit={handleRegisterSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Họ và tên học sinh:
                        </label>
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          placeholder="ví dụ: Nguyễn Văn An"
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Tên đăng nhập (Username):
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
                            Gmail / Email:
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
                          Mật khẩu:
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
                        {loading ? 'Đang tạo...' : 'Đăng Ký & Nhận +150 XP'}
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
                  Hoặc trải nghiệm với tư cách Khách (Không cần tài khoản) →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Overview Section */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-slate-200/80 dark:border-white/10 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Hệ Sinh Thái Lớp Học Mô Phỏng 360°
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Công nghệ tương tác giải phóng trí tưởng tượng học thuật, giúp nắm bắt cốt lõi mọi định lý và quy luật.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                Toán Học Tương Tác
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Khảo sát biến thiên hàm số, tìm tiệm cận, tiếp tuyến đạo hàm và vẽ hình học phẳng có tọa độ chính xác.
              </p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                Xem phòng Toán →
              </span>
            </div>

            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                Phòng Lab Vật Lý 2D
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Mô phỏng 60 FPS con lắc lò xo, khúc xạ ánh sáng theo định luật Snell, chuyển động ném xiên và giao thoa 2 nguồn sóng.
              </p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                Vào phòng thí nghiệm →
              </span>
            </div>

            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                Tin Học & Online Judge
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Luyện thuật toán chuyên Tin với bộ test ẩn, chấm tự động C++ và Python, kiểm tra giới hạn thời gian chạy mili-giây.
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                Luyện code ngay →
              </span>
            </div>

            <div
              onClick={onEnterAsGuest}
              className="p-5 rounded-3xl bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer group space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                30 Đề Thi & Hướng Dẫn Giải
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Ngân hàng 30 đề thi chuyên Toán, Lí, Tin từ KHTN, Sư Phạm, Amsterdam, Lê Hồng Phong kèm tải file Word chuẩn.
              </p>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                Khám phá đề thi →
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/10 py-6 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>EduClassroom 360 · Hệ thống giáo dục mô phỏng vũ trụ học thuật</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Toán học Oxy</span>
            <span>·</span>
            <span>Vật lí 2D 60FPS</span>
            <span>·</span>
            <span>Online Judge Tin học</span>
            <span>·</span>
            <span>30 Đề Khảo Thí</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
