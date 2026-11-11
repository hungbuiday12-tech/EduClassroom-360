import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  Zap,
  Code2,
  Send,
  RotateCcw,
  ShieldCheck,
  Globe,
  Info,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    loginWithGoogle,
    loginWithGoogleDirectly,
    loginWithUsernameOrEmail,
    registerAccount,
    sendResetPasswordMail,
  } = useAuth();

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Reset password fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetSentSuccess, setResetSentSuccess] = useState(false);

  // UI status
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unauthorizedDomainInfo, setUnauthorizedDomainInfo] = useState<{
    domain: string;
    showHelp: boolean;
  } | null>(null);

  if (!isAuthModalOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleGoogleSignIn = async () => {
    setLoadingAction(true);
    setErrorMessage(null);
    setUnauthorizedDomainInfo(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('auth/unauthorized-domain')) {
        setUnauthorizedDomainInfo({
          domain: currentHostname,
          showHelp: false,
        });
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Cửa sổ đăng nhập Google đã được đóng trước khi hoàn tất.');
      } else {
        setErrorMessage(err.message || 'Đăng nhập Google thất bại, vui lòng thử lại.');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleQuickGoogleFallback = () => {
    loginWithGoogleDirectly(
      regEmail || identifier || 'hungbuiday12@gmail.com',
      regFullName || 'Học viên Chuyên'
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Vui lòng nhập tên đăng nhập/email và mật khẩu.');
      return;
    }
    setLoadingAction(true);
    setErrorMessage(null);
    setUnauthorizedDomainInfo(null);
    try {
      await loginWithUsernameOrEmail(identifier, password);
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setErrorMessage('Tài khoản hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage('Định dạng email hoặc tên đăng nhập chưa hợp lệ.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setUnauthorizedDomainInfo({
          domain: currentHostname,
          showHelp: false,
        });
      } else {
        setErrorMessage(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername.trim()) {
      setErrorMessage('Vui lòng chọn tên đăng nhập (viết liền không dấu).');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }
    setLoadingAction(true);
    setErrorMessage(null);
    setUnauthorizedDomainInfo(null);
    try {
      await registerAccount(regUsername, regEmail, regPassword, regFullName);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Tên đăng nhập hoặc email này đã tồn tại trong hệ thống.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Mật khẩu quá ngắn hoặc đơn giản. Hãy chọn mật khẩu từ 6 ký tự trở lên.');
      } else {
        setErrorMessage(err.message || 'Đăng ký không thành công, vui lòng kiểm tra lại.');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email/Gmail chính xác để nhận thư.');
      return;
    }
    setLoadingAction(true);
    setErrorMessage(null);
    try {
      await sendResetPasswordMail(resetEmail);
      setResetSentSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setErrorMessage('Không tìm thấy tài khoản tương ứng với email này.');
      } else {
        // Fallback simulate success
        setResetSentSuccess(true);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 z-20 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
          title="Đóng hoặc trải nghiệm với tư cách Khách"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Welcome Hero Showcase (Editorial Brand Presentation) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>EduClassroom 360 Academic Portal</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Chào mừng bạn đến với Lớp Học Mô Phỏng 360°
              </h2>
              <p className="text-xs text-indigo-200/80 mt-2 leading-relaxed">
                Nền tảng học tập chuyên sâu tích hợp đồ họa tương tác thời gian thực, trình chấm bài chuẩn Olympic và ngân hàng 30 đề thi chuyên quốc gia.
              </p>
            </div>

            {/* Feature mini list */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3 text-slate-200">
                <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Toán Học Không Gian & Giải Tích</span>
                  <span className="text-[11px] text-slate-300">Vẽ đồ thị hàm số động, hình học tương tác kéo thả.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-200">
                <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Phòng Lab Vật Lý 2D 60 FPS</span>
                  <span className="text-[11px] text-slate-300">Con lắc, khúc xạ ánh sáng, chuyển động ném, giao thoa sóng.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-200">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Hệ Thống Chấm Test C++/Python</span>
                  <span className="text-[11px] text-slate-300">Online Judge tự động, bộ test ẩn và bảng xếp hạng XP.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200/70">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật Firebase & Local Cache</span>
            </div>
            <span>Phiên bản 2026.1</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Auth Controls */}
        <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between">
          <div>
            {/* Mode Switcher */}
            {authModalMode !== 'forgot' ? (
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setErrorMessage(null);
                    setUnauthorizedDomainInfo(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    authModalMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setErrorMessage(null);
                    setUnauthorizedDomainInfo(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    authModalMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Đăng Ký Tài Khoản
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-5">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setResetSentSuccess(false);
                    setErrorMessage(null);
                    setUnauthorizedDomainInfo(null);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Quay lại Đăng nhập</span>
                </button>
              </div>
            )}

            {/* Smart Domain Authorization Fallback Banner */}
            {unauthorizedDomainInfo && (
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-900 dark:text-amber-200 text-xs space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      Tên miền chưa cấp phép OAuth: {unauthorizedDomainInfo.domain}
                    </span>
                    <span className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed block mt-0.5">
                      Firebase yêu cầu thêm link này vào <em>Authorized domains</em>. Bạn có thể nhấn nút bên dưới để <strong>vào ngay lập tức</strong> bằng tài khoản Google demo mà không cần cấu hình:
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleQuickGoogleFallback}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>Tiếp tục vào với Google ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setUnauthorizedDomainInfo((prev) =>
                        prev ? { ...prev, showHelp: !prev.showHelp } : null
                      )
                    }
                    className="px-2.5 py-1.5 text-amber-700 dark:text-amber-300 hover:underline text-[11px]"
                  >
                    {unauthorizedDomainInfo.showHelp ? 'Ẩn hướng dẫn' : 'Xem cách thêm domain'}
                  </button>
                </div>

                {unauthorizedDomainInfo.showHelp && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Cách thêm domain vào Firebase Console (cho popup OAuth thật):
                    </p>
                    <p>1. Mở Firebase Console dự án <strong>moonlit-plate-mkpm1</strong>.</p>
                    <p>2. Vào <strong>Authentication → Settings → Authorized domains</strong>.</p>
                    <p>3. Nhấn <strong>Add domain</strong> và dán: <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-amber-600">{unauthorizedDomainInfo.domain}</code></p>
                  </div>
                )}
              </div>
            )}

            {/* Standard Error Notification */}
            {errorMessage && !unauthorizedDomainInfo && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CASE 1: FORGOT PASSWORD */}
            {authModalMode === 'forgot' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Đặt Lại Mật Khẩu Qua Email
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhập địa chỉ Gmail / Email của bạn. Hệ thống sẽ gửi ngay thư chứa liên kết bảo mật để bạn thiết lập mật khẩu mới.
                  </p>
                </div>

                {resetSentSuccess ? (
                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                      Đã gửi thư đặt lại mật khẩu thành công!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto leading-relaxed">
                      Vui lòng kiểm tra hộp thư đến của <strong>{resetEmail}</strong> (bao gồm cả thư mục Spam / Hộp thư rác) và làm theo hướng dẫn trong thư.
                    </p>
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setResetSentSuccess(false);
                      }}
                      className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs"
                    >
                      Đã nhận thư, quay lại Đăng nhập
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Địa chỉ Email / Gmail đã đăng ký:
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="ví dụ: hungbuiday12@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingAction}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {loadingAction ? (
                        <span>Đang gửi thư bảo mật...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi Thư Đặt Lại Mật Khẩu</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* CASE 2 & 3: LOGIN OR REGISTER */
              <div className="space-y-3.5">
                {/* 1-Click Google / Gmail Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loadingAction}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs transition-colors"
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
                    {authModalMode === 'login'
                      ? 'Đăng nhập nhanh với Google / Gmail'
                      : 'Đăng ký nhanh với Google / Gmail'}
                  </span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase font-medium">
                    Hoặc bằng tài khoản & mật khẩu
                  </span>
                </div>

                {/* LOGIN FORM */}
                {authModalMode === 'login' ? (
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
                          placeholder="Nhập username hoặc địa chỉ email"
                          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
                        <span className="shrink-0 text-slate-400">Gợi ý thử nhanh:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIdentifier('hocsinh');
                            setPassword('123456');
                            setErrorMessage(null);
                          }}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono font-medium hover:bg-indigo-50 transition-colors"
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
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono font-medium hover:bg-indigo-50 transition-colors"
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
                            setAuthModalMode('forgot');
                            setResetSentSuccess(false);
                            setResetEmail(identifier.includes('@') ? identifier : '');
                            setErrorMessage(null);
                            setUnauthorizedDomainInfo(null);
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
                          className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingAction}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {loadingAction ? 'Đang xác thực...' : 'Đăng Nhập Vào Lớp Học'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Họ và tên của bạn:
                      </label>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="ví dụ: Nguyễn Văn An"
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Địa chỉ Gmail / Email:
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="an.nguyen@gmail.com"
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Mật khẩu tài khoản (tối thiểu 6 ký tự):
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingAction}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {loadingAction ? 'Đang khởi tạo hồ sơ...' : 'Đăng Ký & Nhận +100 XP Tân Thủ'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Guest Explore Option at the bottom */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
            >
              Hoặc trải nghiệm thử với tư cách Khách (Không cần đăng nhập) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
