import React, { useCallback, useEffect, useState } from 'react';
import {
  Command,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { BackgroundStyle, useBackgroundTheme } from '../../context/BackgroundContext';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { useSpeechRecognition } from '../../lib/useSpeechRecognition';
import { safeFetchJson } from '../../lib/apiClient';
import { SubjectType, VoiceOSActionPlan } from '../../types';

interface SynapseVoiceOSProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenTutor: (subject?: SubjectType, promptText?: string) => void;
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

function tryLocalCommandMatch(rawCmd: string): VoiceOSActionPlan | null {
  const cmd = normalizeText(rawCmd);
  if (!cmd) return null;

  // Theme switches
  if (/(nen toi|che do toi|dark mode|ban dem|tat den)/.test(cmd)) {
    return { replyVi: 'Đã chuyển sang giao diện Nền tối.', actionType: 'toggle_theme', darkMode: true };
  }
  if (/(nen sang|che do sang|light mode|ban ngay|bat den)/.test(cmd)) {
    return { replyVi: 'Đã chuyển sang giao diện Nền sáng.', actionType: 'toggle_theme', darkMode: false };
  }

  // Pomodoro controls
  if (/(pomodoro|dong ho|tap trung)/.test(cmd)) {
    if (/(dat lai|reset|lam lai)/.test(cmd)) {
      return { replyVi: 'Đã đặt lại đồng hồ tập trung Pomodoro.', actionType: 'timer', timerAction: 'reset' };
    }
    if (/(dung|tam dung|pause|stop|tat)/.test(cmd)) {
      return { replyVi: 'Đã tạm dừng đồng hồ Pomodoro.', actionType: 'timer', timerAction: 'pause' };
    }
    return { replyVi: 'Đã bật đồng hồ tập trung Pomodoro!', actionType: 'timer', timerAction: 'start' };
  }

  // Backgrounds
  const bgMap: { regex: RegExp; style: BackgroundStyle; label: string }[] = [
    { regex: /(he sinh thai|ca koi|ecosystem)/, style: 'ecosystem', label: 'Hệ sinh thái' },
    { regex: /(phan tu|nguyen tu|molecules)/, style: 'molecules', label: 'Mạng hạt Phân tử' },
    { regex: /(dai duong|bien sau|ocean|sua bien)/, style: 'ocean', label: 'Đại dương sâu' },
    { regex: /(bau troi|may bay|sky)/, style: 'sky', label: 'Bầu trời mây' },
    { regex: /(chom sao|thien van|constellation)/, style: 'constellations', label: 'Chòm sao 3D' },
    { regex: /(ngan ha|vu tru|galaxy)/, style: 'cosmic_galaxy', label: 'Ngân hà sống động' },
    { regex: /(ban ve|ky thuat|blueprint)/, style: 'blueprint_tech', label: 'Bản vẽ STEM' },
    { regex: /(luoi song|studio grid)/, style: 'studio_grid', label: 'Lưới sóng Studio' },
    { regex: /(tinh van|sao roi|aurora)/, style: 'aurora_clean', label: 'Tinh vân sao rơi' },
    { regex: /(sieu muot|toi gian|minimal)/, style: 'minimal_solid', label: 'Nền siêu mượt' }
  ];
  if (/(doi nen|hinh nen|nen dong|background)/.test(cmd)) {
    const matchedBg = bgMap.find((b) => b.regex.test(cmd));
    if (matchedBg) {
      return {
        replyVi: `Đã đổi nền động sang ${matchedBg.label}.`,
        actionType: 'set_background',
        bgStyle: matchedBg.style
      };
    }
  }

  // Future Lab Tabs
  if (/(vu tru tri thuc|galaxy twin|ban sao 3d)/.test(cmd)) {
    return { replyVi: 'Đang mở Vũ trụ Tri thức 3D cá nhân.', actionType: 'navigate_future', targetFutureTab: 'galaxy3d' };
  }
  if (/(sinh mo phong|text to sim|tao mo phong)/.test(cmd)) {
    return { replyVi: 'Đang mở trình Sinh Mô Phỏng AI.', actionType: 'navigate_future', targetFutureTab: 'text_to_sim' };
  }
  if (/(giay nhap|paper to sim|quet giay|anh bai tap)/.test(cmd)) {
    return { replyVi: 'Đang mở máy quét Giấy Nháp → Mô phỏng.', actionType: 'navigate_future', targetFutureTab: 'paper_to_sim' };
  }
  if (/(bang vo cuc|bang nhap|infinite canvas|whiteboard|scratchpad)/.test(cmd)) {
    return { replyVi: 'Đang mở Bảng Nháp Mini-Chat.', actionType: 'navigate_future', targetFutureTab: 'infinite_canvas' };
  }
  if (/(song am|fft|am thanh|micro 3d)/.test(cmd)) {
    return { replyVi: 'Đang mở Phòng Lab Sóng Âm FFT 3D trong Synapse Pre.', actionType: 'navigate_future', targetFutureTab: 'audio_fft' };
  }

  // Core Route Navigation
  if (/(webar|cam giac 3d|ar ban hoc|tay 3d|khong gian 3d)/.test(cmd)) {
    return { replyVi: 'Đang mở Học cảm giác 3D & WebAR.', actionType: 'navigate', targetSubject: 'spatial_3d' };
  }
  if (/(synapse pre|dai cong trinh|phong lab tuong lai|future lab|synapse v2|lop hoc ao)/.test(cmd)) {
    return { replyVi: 'Đang mở Synapse Pre · Đại công trình tương lai & Phòng Lab AI.', actionType: 'navigate_future', targetFutureTab: 'megastructures' };
  }
  if (/(so tay loi|sm2|flashcard|loi sai)/.test(cmd)) {
    return { replyVi: 'Đang mở Sổ tay Lỗi sai & Thẻ SM-2.', actionType: 'navigate', targetSubject: 'growth_hub' };
  }
  if (/(thu vien sang tao|showcase)/.test(cmd)) {
    return { replyVi: 'Đang mở Thư viện Sáng tạo 2D/3D.', actionType: 'navigate', targetSubject: 'showcase' };
  }
  if (/(de thi|kiem tra|luyen de)/.test(cmd)) {
    return { replyVi: 'Đang mở Ngân hàng Đề thi.', actionType: 'navigate', targetSubject: 'exams' };
  }
  if (/(dau truong|thi dau|xep hang)/.test(cmd)) {
    return { replyVi: 'Đang mở Đấu trường Tuần.', actionType: 'navigate', targetSubject: 'arena' };
  }
  if (/(dien dan|hoi nhom)/.test(cmd)) {
    return { replyVi: 'Đang mở Diễn đàn học tập.', actionType: 'navigate', targetSubject: 'forum' };
  }
  if (/(lo trinh|roadmap)/.test(cmd)) {
    return { replyVi: 'Đang mở Lộ trình học thông minh.', actionType: 'navigate', targetSubject: 'roadmap' };
  }
  if (/(online judge|tin hoc|code c\+\+|lap trinh)/.test(cmd) && /(mo|vao|chuyen)/.test(cmd)) {
    return { replyVi: 'Đang mở phân hệ Tin học & Online Judge.', actionType: 'navigate', targetSubject: 'cs' };
  }
  if (/(vat li|mo phong li)/.test(cmd) && /(mo|vao|chuyen)/.test(cmd)) {
    return { replyVi: 'Đang mở phòng Lab Vật lí.', actionType: 'navigate', targetSubject: 'physics' };
  }
  if (/(toan hoc|do thi oxyz)/.test(cmd) && /(mo|vao|chuyen)/.test(cmd)) {
    return { replyVi: 'Đang mở phòng Toán học 2D/3D.', actionType: 'navigate', targetSubject: 'math' };
  }
  if (/(trang chu|lop hoc|tong quan)/.test(cmd) && /(ve|mo|quay)/.test(cmd)) {
    return { replyVi: 'Đang quay về Lớp học Tổng quan.', actionType: 'navigate', targetSubject: 'overview' };
  }

  return null;
}

const QUICK_CHIPS = [
  'Mở Synapse Pre',
  'Mở Vũ trụ Tri thức 3D',
  'Mở Sinh Mô Phỏng AI',
  'Mở Bảng Nháp Mini',
  'Đổi nền Đại dương',
  'Hỏi Syn AI về định luật bảo toàn động lượng'
];

export const SynapseVoiceOS: React.FC<SynapseVoiceOSProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  onOpenTutor
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { navigate, selectSubject } = useNavigation();
  const { setBgStyle } = useBackgroundTheme();
  const { isRunning, startPause, resetTimer } = useFocusTimer();

  const [inputCmd, setInputCmd] = useState('');
  const [processing, setProcessing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [logs, setLogs] = useState<{ role: 'user' | 'os'; text: string }[]>([
    {
      role: 'os',
      text: isEn
        ? 'Synapse Voice OS ready. Speak or type any command to navigate, switch labs, control Pomodoro, or ask Syn AI.'
        : 'Synapse Voice OS đã sẵn sàng! Hãy nói hoặc gõ lệnh để chuyển phòng Lab 3D, đổi nền, bấm giờ Pomodoro hoặc hỏi nhanh Syn AI.'
    }
  ]);

  const speakFeedback = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = isEn ? 'en-US' : 'vi-VN';
        utter.rate = 1.06;
        window.speechSynthesis.speak(utter);
      } catch {}
    },
    [ttsEnabled, isEn]
  );

  const executePlan = useCallback(
    (plan: VoiceOSActionPlan) => {
      const reply = plan.replyVi || 'Đã thực hiện lệnh.';
      setLogs((prev) => [...prev.slice(-8), { role: 'os', text: reply }]);
      speakFeedback(reply);

      switch (plan.actionType) {
        case 'navigate':
          if (plan.targetSubject) {
            selectSubject(plan.targetSubject);
          }
          break;
        case 'navigate_future':
          if (plan.targetFutureTab === 'infinite_canvas') {
            window.dispatchEvent(new CustomEvent('synapse:open-scratchpad-mini'));
            onClose();
            break;
          }
          navigate({
            subject: 'synapse_v2',
            futureTab: plan.targetFutureTab || 'megastructures',
            synapseMode: 'catalog',
            tutorOpen: false
          });
          break;
        case 'set_background':
          if (plan.bgStyle) {
            setBgStyle(plan.bgStyle as BackgroundStyle);
          }
          break;
        case 'toggle_theme':
          if (typeof plan.darkMode === 'boolean') {
            if (plan.darkMode !== isDark) onToggleTheme();
          } else {
            onToggleTheme();
          }
          break;
        case 'timer':
          if (plan.timerAction === 'start' && !isRunning) startPause();
          else if (plan.timerAction === 'pause' && isRunning) startPause();
          else if (plan.timerAction === 'reset') resetTimer();
          break;
        case 'open_tutor':
          onOpenTutor(plan.tutorSubject || 'math', plan.tutorQuestion);
          onClose();
          break;
        default:
          break;
      }
    },
    [
      isDark,
      isRunning,
      navigate,
      onClose,
      onOpenTutor,
      onToggleTheme,
      resetTimer,
      selectSubject,
      setBgStyle,
      speakFeedback,
      startPause
    ]
  );

  const runCommand = useCallback(
    async (rawText: string) => {
      const clean = rawText.trim();
      if (!clean) return;
      setInputCmd('');
      setLogs((prev) => [...prev.slice(-8), { role: 'user', text: clean }]);

      const localPlan = tryLocalCommandMatch(clean);
      if (localPlan) {
        executePlan(localPlan);
        return;
      }

      setProcessing(true);
      const res = await safeFetchJson<{ success: boolean; plan: VoiceOSActionPlan }>(
        '/api/gemini/voice-os-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: clean, language })
        },
        15000
      );
      setProcessing(false);

      if (res.ok && res.data?.plan) {
        executePlan(res.data.plan);
      } else {
        const msg =
          res.error ||
          (isEn
            ? 'Could not parse voice command right now.'
            : 'Chưa nhận diện được lệnh lúc này, thử nói rõ hơn nhé!');
        setLogs((prev) => [...prev.slice(-8), { role: 'os', text: msg }]);
      }
    },
    [executePlan, isEn, language]
  );

  const {
    isSupported,
    isListening,
    interimText,
    error: speechError,
    toggleListening,
    stopListening
  } = useSpeechRecognition({
    language,
    continuous: false,
    onFinalTranscript: (transcript) => {
      runCommand(transcript);
    }
  });

  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
  }, [isOpen, isListening, stopListening]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4">
      <div className="w-full max-w-2xl rounded-md border border-cyan-500/40 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center border ${
                isListening
                  ? 'bg-rose-500/20 border-rose-400 voice-os-orb-pulse'
                  : 'bg-cyan-500/15 border-cyan-400/50'
              }`}
            >
              <Command className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                Synapse Voice OS
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                  AI Control
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isEn
                  ? 'Hands-free voice & command palette'
                  : 'Điều khiển toàn bộ phòng Lab, giao diện & Syn AI bằng giọng nói'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTtsEnabled((v) => !v)}
              className="p-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title={ttsEnabled ? 'Tắt giọng đọc phản hồi' : 'Bật giọng đọc phản hồi'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded border border-slate-700 bg-slate-800 hover:bg-rose-600 hover:border-rose-500 text-slate-200 cursor-pointer"
              aria-label="Đóng Voice OS"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orb & Transcript Feed */}
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded border border-slate-800 bg-slate-900/70">
            <button
              type="button"
              onClick={toggleListening}
              disabled={!isSupported}
              className={`w-16 h-16 rounded-md flex flex-col items-center justify-center border transition shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 border-rose-400 text-white voice-os-orb-pulse'
                  : isSupported
                  ? 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="text-[10px] font-bold mt-1">
                {isListening ? 'ĐANG NGHE' : 'NÓI NGAY'}
              </span>
            </button>

            <div className="flex-1 w-full space-y-2 max-h-44 overflow-y-auto pr-1">
              {logs.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded text-xs leading-relaxed ${
                    item.role === 'user'
                      ? 'bg-sky-950/80 border border-sky-700/60 text-sky-100 ml-6'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 mr-6'
                  }`}
                >
                  <span className="font-bold mr-1.5 text-[10px] uppercase text-cyan-400">
                    {item.role === 'user' ? 'Bạn:' : 'Voice OS:'}
                  </span>
                  {item.text}
                </div>
              ))}
              {interimText && (
                <div className="px-3 py-1.5 rounded bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 italic">
                  “{interimText}...”
                </div>
              )}
              {processing && (
                <div className="inline-flex items-center gap-2 text-xs text-cyan-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isEn ? 'Routing command via Gemini...' : 'Đang phân tích ý định lệnh...'}
                </div>
              )}
              {speechError && (
                <div className="text-xs text-amber-300">{speechError}</div>
              )}
            </div>
          </div>

          {/* Text Command Fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runCommand(inputCmd);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder={
                isEn
                  ? 'Type a command (e.g., "Open Audio FFT Lab" or "Switch background to Ocean")...'
                  : 'Gõ nhanh lệnh điều khiển (vd: "Mở Giấy Nháp → Sim", "Đổi nền Chòm sao", "Bật Pomodoro")...'
              }
              className="flex-1 px-3 py-2.5 rounded border border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={processing || !inputCmd.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isEn ? 'Run' : 'Thực thi'}
            </button>
          </form>

          {/* Preset Voice Command Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isEn ? 'Instant Voice / Command Presets' : 'Lệnh mẫu thử ngay 1 chạm'}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => runCommand(chip)}
                  className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-cyan-500 text-xs text-slate-200 transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
