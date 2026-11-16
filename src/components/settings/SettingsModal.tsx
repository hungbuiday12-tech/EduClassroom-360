import React, { useState, useEffect } from 'react';
import {
  X,
  UserCog,
  Mail,
  Lock,
  SlidersHorizontal,
  LogOut,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe,
  Wand2,
  Sparkles,
  KeyRound,
  Save,
  ShieldCheck,
  Volume2,
  VolumeX,
  Music,
  Bell,
  MousePointerClick,
  Play,
  Gauge,
  Type,
  Palette,
  MousePointer2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  useBackgroundTheme,
  CREATURE_THEME_OPTIONS,
  PERFORMANCE_MODE_OPTIONS,
  BACKGROUND_STYLE_OPTIONS,
  FONT_PRESET_OPTIONS,
  COLOR_PALETTE_OPTIONS
} from '../../context/BackgroundContext';
import { useAudio } from '../../context/AudioContext';
import {
  CLICK_SOUND_OPTIONS,
  BG_SOUND_OPTIONS,
  BELL_SOUND_OPTIONS
} from '../../lib/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onReturnToLanding?: () => void;
}

type SettingsTab = 'account' | 'security' | 'appearance' | 'audio';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=synapse_math',
  'https://api.dicebear.com/7.x/bottts/svg?seed=synapse_physics',
  'https://api.dicebear.com/7.x/bottts/svg?seed=synapse_cs',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=scholar_vn',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=cosmos_ai'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  onReturnToLanding
}) => {
  const {
    user,
    openAuthModal,
    logout,
    updateAccountProfile,
    updateAccountEmail,
    changeAccountPassword,
    sendResetPasswordMail
  } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const isEn = language === 'en';
  const {
    creatureTheme,
    setCreatureTheme,
    perfMode,
    setPerfMode,
    bgStyle,
    setBgStyle,
    fontPreset,
    setFontPreset,
    colorPalette,
    setColorPalette,
    dodgeEnabled,
    setDodgeEnabled,
    dodgeIntensity,
    setDodgeIntensity
  } = useBackgroundTheme();
  const {
    clickSound,
    setClickSound,
    sfxVolume,
    setSfxVolume,
    bgSound,
    setBgSound,
    bgVolume,
    setBgVolume,
    isBgPlaying,
    toggleBgPlaying,
    bellSound,
    setBellSound,
    playClick,
    playBell
  } = useAudio();

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Account Profile Form
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Gmail / Email Form
  const [newEmail, setNewEmail] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Feedback states
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSuccessMsg(null);
    setErrorMsg(null);
    if (user) {
      setDisplayName(user.displayName || '');
      setAvatarUrl(user.avatarUrl || '');
      setNewEmail(user.email || '');
    }
    setEmailConfirmPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [isOpen, user]);

  if (!isOpen) return null;

  const clearAlerts = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!displayName.trim()) {
      setErrorMsg(isEn ? 'Display name cannot be empty.' : 'Tên hiển thị không được để trống.');
      return;
    }
    setBusyAction('profile');
    try {
      await updateAccountProfile({ displayName, avatarUrl });
      setSuccessMsg(
        isEn
          ? 'Profile display name & avatar updated!'
          : 'Đã cập nhật thông tin tài khoản và ảnh đại diện!'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'Could not update profile.' : 'Không thể cập nhật hồ sơ.'));
    } finally {
      setBusyAction(null);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMsg(isEn ? 'Please enter a valid Gmail/email.' : 'Vui lòng nhập Gmail / Email hợp lệ.');
      return;
    }
    setBusyAction('email');
    try {
      const res = await updateAccountEmail(newEmail, emailConfirmPassword || undefined);
      setSuccessMsg(res.message);
      setEmailConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'Failed to update Gmail.' : 'Không thể đổi Gmail.'));
    } finally {
      setBusyAction(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (newPassword.length < 4) {
      setErrorMsg(
        isEn ? 'New password must be at least 4 characters.' : 'Mật khẩu mới phải có tối thiểu 4 ký tự.'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(
        isEn ? 'Confirmation password does not match.' : 'Mật khẩu xác nhận không khớp.'
      );
      return;
    }
    setBusyAction('password');
    try {
      await changeAccountPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg(
        isEn ? 'Password updated successfully!' : 'Đã đổi mật khẩu tài khoản thành công!'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'Failed to update password.' : 'Không thể đổi mật khẩu.'));
    } finally {
      setBusyAction(null);
    }
  };

  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    clearAlerts();
    setBusyAction('reset');
    try {
      await sendResetPasswordMail(user.email);
      setSuccessMsg(
        isEn
          ? `Password reset email sent to ${user.email}.`
          : `Đã gửi liên kết đặt lại mật khẩu đến ${user.email}.`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || (isEn ? 'Could not send reset email.' : 'Không thể gửi email đặt lại mật khẩu.'));
    } finally {
      setBusyAction(null);
    }
  };

  const handleSignOut = async () => {
    await logout();
    onClose();
    if (onReturnToLanding) onReturnToLanding();
  };

  const tabs: Array<{ id: SettingsTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'account',
      label: isEn ? 'Account & Gmail' : 'Tài khoản & Gmail',
      icon: <UserCog className="w-4 h-4" />
    },
    {
      id: 'security',
      label: isEn ? 'Password & Security' : 'Mật khẩu & Bảo mật',
      icon: <Lock className="w-4 h-4" />
    },
    {
      id: 'appearance',
      label: isEn ? 'Theme & PC Spec' : 'Giao diện nền & Cấu hình',
      icon: <SlidersHorizontal className="w-4 h-4" />
    },
    {
      id: 'audio',
      label: isEn ? 'Audio & Bells' : 'Âm thanh & Nhạc nền',
      icon: <Volume2 className="w-4 h-4" />
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[95] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/15 rounded-3xl shadow-[0_30px_80px_-20px_rgba(15,23,42,0.55)] overflow-hidden my-auto grid grid-cols-1 md:grid-cols-12"
      >
        {/* Left Navigation Sidebar */}
        <aside className="md:col-span-4 bg-slate-50/90 dark:bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-200/70 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {isEn ? 'SYSTEM PREFERENCES' : 'THIẾT LẬP HỆ THỐNG'}
                </div>
                <h2 className="font-display text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {isEn ? 'Settings' : 'Cài Đặt'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-500 cursor-pointer"
                aria-label="Đóng cài đặt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-indigo-400/60 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-display font-bold text-sm flex items-center justify-center shrink-0">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-display font-bold text-slate-900 dark:text-white truncate">
                    {user.displayName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">@{user.username}</div>
                </div>
              </div>
            )}

            <nav className="flex md:flex-col gap-1.5 overflow-x-auto">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      clearAlerts();
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Auth / Logout Action */}
          <div className="pt-4 border-t border-slate-200/70 dark:border-white/10">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isEn ? 'Sign Out' : 'Đăng xuất tài khoản'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isEn ? 'Sign In / Register' : 'Đăng nhập / Đăng ký'}</span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="md:col-span-8 p-5 sm:p-7 max-h-[82vh] overflow-y-auto space-y-5">
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-slate-200/70 dark:border-white/10">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTab === 'account'
                  ? isEn
                    ? 'Manage your profile name, avatar, and linked Gmail / email address.'
                    : 'Chỉnh tên hiển thị, ảnh đại diện và địa chỉ Gmail liên kết với tài khoản.'
                  : activeTab === 'security'
                  ? isEn
                    ? 'Update your password or send a secure recovery email.'
                    : 'Đổi mật khẩu đăng nhập hoặc gửi thư khôi phục bảo mật qua Gmail.'
                  : activeTab === 'audio'
                  ? isEn
                    ? 'Choose interactive click effects, continuous ambient study soundscapes, and focus timer bells.'
                    : 'Chọn hiệu ứng âm thanh khi click, nhạc nền không gian học tập và chuông báo đồng hồ tập trung.'
                  : isEn
                  ? 'Customize Light/Dark mode, VI/EN language, and animated galaxy creatures.'
                  : 'Tùy chỉnh giao diện Sáng/Tối, ngôn ngữ VI/EN và sinh vật nền tương tác.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: ACCOUNT & GMAIL */}
          {activeTab === 'account' && (
            user ? (
              <div className="space-y-6">
                {/* Profile Setup Form */}
                <form
                  onSubmit={handleSaveProfile}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCog className="w-4 h-4 text-indigo-500" />
                      <span>{isEn ? 'Profile Setup' : 'Thiết lập hồ sơ cá nhân'}</span>
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {user.role === 'teacher' ? (isEn ? 'Teacher' : 'Giáo viên') : isEn ? 'Student' : 'Học viên'} · {user.xp} XP
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEn ? 'Display Name' : 'Tên hiển thị'}
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={isEn ? 'Your full name' : 'Họ tên hiển thị'}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEn ? 'Username (ID)' : 'Tên đăng nhập (Username)'}
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`@${user.username}`}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/5 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isEn ? 'Avatar URL or choose quick preset' : 'Ảnh đại diện (URL hoặc chọn nhanh mẫu có sẵn)'}
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {PRESET_AVATARS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatarUrl(url)}
                          className={`p-0.5 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                            avatarUrl === url ? 'border-indigo-500' : 'border-transparent'
                          }`}
                          title={`Avatar mẫu ${i + 1}`}
                        >
                          <img src={url} alt={`Preset ${i + 1}`} className="w-8 h-8 rounded-full bg-slate-100" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={busyAction === 'profile'}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{busyAction === 'profile' ? (isEn ? 'Saving...' : 'Đang lưu...') : isEn ? 'Save Profile' : 'Lưu hồ sơ'}</span>
                    </button>
                  </div>
                </form>

                {/* Gmail / Email Update Form */}
                <form
                  onSubmit={handleSaveEmail}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-4"
                >
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-500" />
                    <span>{isEn ? 'Update Gmail / Email Address' : 'Chỉnh sửa Gmail / Email tài khoản'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEn ? 'New Gmail / Email' : 'Địa chỉ Gmail / Email mới'}
                      </label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEn ? 'Current Password (if required)' : 'Mật khẩu hiện tại (để xác thực)'}
                      </label>
                      <input
                        type="password"
                        value={emailConfirmPassword}
                        onChange={(e) => setEmailConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={busyAction === 'email'}
                      className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{busyAction === 'email' ? (isEn ? 'Updating...' : 'Đang cập nhật...') : isEn ? 'Update Gmail' : 'Cập nhật Gmail'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-white/15 text-center space-y-3">
                <UserCog className="w-10 h-10 text-indigo-500 mx-auto" />
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Sign in to configure your account' : 'Đăng nhập để thiết lập tài khoản & Gmail'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {isEn
                    ? 'You can still customize theme, language, and background creatures in the UI & Creatures tab.'
                    : 'Bạn vẫn có thể tùy chỉnh giao diện Sáng/Tối, ngôn ngữ và sinh vật nền ở tab Giao diện & Sinh vật bên cạnh.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isEn ? 'Sign In Now' : 'Đăng Nhập Ngay'}</span>
                </button>
              </div>
            )
          )}

          {/* TAB 2: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            user ? (
              <div className="space-y-5">
                <form
                  onSubmit={handleChangePassword}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      <span>{isEn ? 'Change Password' : 'Thay đổi mật khẩu tài khoản'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="text-xs font-semibold text-slate-500 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                    >
                      {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPasswords ? (isEn ? 'Hide' : 'Ẩn') : isEn ? 'Show' : 'Hiện'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isEn ? 'Current Password (leave blank if signed in with Google)' : 'Mật khẩu hiện tại (bỏ trống nếu tài khoản đăng nhập bằng Google)'}
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEn ? 'New Password (min 4–6 chars)' : 'Mật khẩu mới'}
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isEn ? 'Confirm New Password' : 'Xác nhận mật khẩu mới'}
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleSendResetEmail}
                      disabled={busyAction === 'reset'}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {isEn
                        ? 'Send password reset link to Gmail'
                        : 'Gửi email đặt lại mật khẩu về Gmail'}
                    </button>

                    <button
                      type="submit"
                      disabled={busyAction === 'password'}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{busyAction === 'password' ? (isEn ? 'Updating...' : 'Đang đổi...') : isEn ? 'Update Password' : 'Đổi mật khẩu'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-white/15 text-center space-y-3">
                <Lock className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {isEn ? 'Sign in to manage password & security' : 'Đăng nhập để đổi mật khẩu & bảo mật'}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal('login');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isEn ? 'Sign In' : 'Đăng nhập'}</span>
                </button>
              </div>
            )
          )}

          {/* TAB 3: APPEARANCE, LANGUAGE & INTERACTIVE CREATURES */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {isEn ? 'Color Theme' : 'Giao diện Sáng / Tối'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isDark ? (isEn ? 'Dark Galaxy' : 'Nền Tối (Dark)') : (isEn ? 'Light Daylight' : 'Nền Sáng (Light)')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                  >
                    {isEn ? 'Switch' : 'Đổi nền'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {isEn ? 'Interface Language' : 'Ngôn ngữ hiển thị'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {language === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleLanguage}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    {language === 'vi' ? 'VI → EN' : 'EN → VI'}
                  </button>
                </div>
              </div>

              {/* PC-Spec Background Style Selector */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span>
                      {isEn
                        ? 'Workspace Background Style (By PC Specs)'
                        : 'Chế độ Nền Tùy Chỉnh Theo Cấu Hình Máy'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? 'Auto-tunes Canvas load' : 'Tự động tối ưu tải GPU/CPU'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BACKGROUND_STYLE_OPTIONS.map((opt) => {
                    const selected = opt.id === bgStyle;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBgStyle(opt.id, true)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          selected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-white/10 hover:border-sky-400'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="w-8 h-8 rounded-md border border-white/25 shrink-0 mt-0.5 shadow-inner"
                          style={{ background: opt.previewGradient }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold leading-snug">
                            {isEn ? opt.labelEn : opt.labelVi}
                          </div>
                          <div
                            className={`text-[10px] font-semibold mt-0.5 ${
                              selected ? 'text-sky-100' : 'text-sky-600 dark:text-sky-400'
                            }`}
                          >
                            {isEn ? opt.specBadgeEn : opt.specBadgeVi}
                          </div>
                          <div
                            className={`text-[11px] mt-1 leading-snug ${
                              selected ? 'text-blue-50/90' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {isEn ? opt.descEn : opt.descVi}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {(bgStyle === 'ecosystem' ||
                bgStyle === 'ocean' ||
                bgStyle === 'sky' ||
                bgStyle === 'constellations' ||
                bgStyle === 'cosmic_galaxy') && (
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Wand2 className="w-4 h-4 text-sky-500" />
                      <span>
                        {isEn
                          ? 'Interactive Background Creatures'
                          : 'Sinh vật nền tương tác'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CREATURE_THEME_OPTIONS.map((opt) => {
                      const selected = opt.id === creatureTheme;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCreatureTheme(opt.id)}
                          className={`px-3 py-2 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                            selected
                              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-400'
                          }`}
                        >
                          {isEn ? opt.labelEn : opt.labelVi}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Typography & Font Family Selector */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Type className="w-4 h-4 text-sky-500" />
                  <span>{isEn ? 'Typography & Font Style' : 'Phông Chữ Hệ Thống'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {FONT_PRESET_OPTIONS.map((f) => {
                    const selected = f.id === fontPreset;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFontPreset(f.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-400'
                        }`}
                      >
                        <div className="text-sm font-bold" style={{ fontFamily: f.displayFont }}>
                          {f.sampleText}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${selected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {isEn ? f.labelEn : f.labelVi}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Palette Selector */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Palette className="w-4 h-4 text-sky-500" />
                  <span>{isEn ? 'Accent Color Palette' : 'Bảng Màu Chủ Đạo'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COLOR_PALETTE_OPTIONS.map((pal) => {
                    const selected = pal.id === colorPalette;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setColorPalette(pal.id)}
                        className={`px-3 py-2.5 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                          selected
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-400'
                        }`}
                      >
                        <span
                          data-circle="true"
                          className="w-5 h-5 rounded-full shrink-0 border border-white/40"
                          style={{ background: pal.swatch }}
                        />
                        <span>{isEn ? pal.labelEn : pal.labelVi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cursor Dodge Interaction Toggle */}
              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <MousePointer2 className="w-4 h-4 text-sky-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Hero Cursor-Dodge Text Effect' : 'Hiệu ứng Chữ "Né Chuột" Trang Chính'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Words smoothly repel away from mouse pointer' : 'Các chữ tự động dạt ra mượt mà khi di chuột gần'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDodgeEnabled(true);
                      setDodgeIntensity('gentle');
                    }}
                    className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                      dodgeEnabled && dodgeIntensity === 'gentle'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isEn ? 'Gentle' : 'Nhẹ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDodgeEnabled(true);
                      setDodgeIntensity('lively');
                    }}
                    className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                      dodgeEnabled && dodgeIntensity === 'lively'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isEn ? 'Lively' : 'Mạnh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDodgeEnabled(false)}
                    className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                      !dodgeEnabled
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isEn ? 'Off' : 'Tắt'}
                  </button>
                </div>
              </div>

              {/* FPS & Graphics Performance Tier */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Gauge className="w-4 h-4 text-sky-500" />
                  <span>{isEn ? 'FPS & Graphics Performance Mode' : 'Tối ưu FPS & Chất lượng Đồ họa'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PERFORMANCE_MODE_OPTIONS.map((opt) => {
                    const selected = opt.id === perfMode;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPerfMode(opt.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{isEn ? opt.labelEn : opt.labelVi}</div>
                        <div
                          className={`text-[11px] mt-1 leading-snug ${
                            selected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {isEn ? opt.descEn : opt.descVi}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    {isEn ? 'AI Tutor Shortcuts' : 'Phím tắt mở nhanh 3 Trợ lý AI'}
                  </span>
                  <span>
                    {isEn
                      ? 'Left Ctrl + D (Math AI) · Left Ctrl + F (Physics AI) · Left Ctrl + G (CS AI)'
                      : 'Ctrl trái + D (AI Toán) · Ctrl trái + F (AI Vật Lí) · Ctrl trái + G (AI Tin Học)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO, CLICK SFX, BACKGROUND MUSIC & FOCUS BELLS */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              {/* Click SFX Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <MousePointerClick className="w-4 h-4 text-sky-500" />
                    <span>{isEn ? 'Interactive Click Sound Effects' : 'Âm thanh hiệu ứng khi Click'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playClick()}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>{isEn ? 'Preview' : 'Nghe thử'}</span>
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={sfxVolume}
                      onChange={(e) => setSfxVolume(Number(e.target.value))}
                      aria-label={isEn ? 'Click SFX volume' : 'Âm lượng click'}
                      className="w-20 accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CLICK_SOUND_OPTIONS.map((opt) => {
                    const selected = opt.id === clickSound;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setClickSound(opt.id)}
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-400'
                        }`}
                      >
                        {isEn ? opt.labelEn : opt.labelVi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Ambient Soundscapes */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Music className="w-4 h-4 text-indigo-500" />
                    <span>{isEn ? 'Background Study Soundscapes' : 'Âm thanh nền tự chọn khi học'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleBgPlaying}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                        isBgPlaying && bgSound !== 'off'
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isBgPlaying && bgSound !== 'off' ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isBgPlaying && bgSound !== 'off'
                          ? isEn
                            ? 'Playing'
                            : 'Đang phát'
                          : isEn
                          ? 'Paused'
                          : 'Đang tắt'}
                      </span>
                    </button>
                    <input
                      type="range"
                      min={0.05}
                      max={1}
                      step={0.05}
                      value={bgVolume}
                      onChange={(e) => setBgVolume(Number(e.target.value))}
                      aria-label={isEn ? 'Ambient music volume' : 'Âm lượng nhạc nền'}
                      className="w-20 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BG_SOUND_OPTIONS.map((opt) => {
                    const selected = opt.id === bgSound;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBgSound(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-indigo-400'
                        }`}
                      >
                        <div className="text-xs font-bold">{isEn ? opt.labelEn : opt.labelVi}</div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            selected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {isEn ? opt.descEn : opt.descVi}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Timer Alarm Bell */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/45 border border-slate-200/80 dark:border-white/10 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? 'Focus Timer Completion Bell' : 'Chuông báo Đồng hồ tập trung'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => playBell()}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>{isEn ? 'Test Bell' : 'Nghe thử chuông'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BELL_SOUND_OPTIONS.map((opt) => {
                    const selected = opt.id === bellSound;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBellSound(opt.id)}
                        className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selected
                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-amber-400'
                        }`}
                      >
                        {isEn ? opt.labelEn : opt.labelVi}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
