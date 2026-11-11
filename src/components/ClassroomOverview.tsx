import React, { useState, useEffect } from 'react';
import { SubjectType } from '../types';
import {
  Compass,
  Zap,
  Code2,
  Feather,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ClassroomOverviewProps {
  onNavigate: (subject: SubjectType) => void;
  xp: number;
}

export const ClassroomOverview: React.FC<ClassroomOverviewProps> = ({ onNavigate, xp }) => {
  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Quick Notes State
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('edusim_notes');
      return saved ? JSON.parse(saved) : [
        { id: '1', text: 'Nhớ công thức đạo hàm hàm bậc 3: y\' = 3ax² + 2bx + c', date: 'Hôm nay' },
        { id: '2', text: 'Con lắc lò xo: Chu kỳ T = 2π√(m/k), cơ năng tỉ lệ với bình phương biên độ A²', date: 'Hôm nay' }
      ];
    } catch {
      return [];
    }
  });

  const [newNoteText, setNewNoteText] = useState('');

  // Pomodoro effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setPomodoroSeconds(25 * 60);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };
    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem('edusim_notes', JSON.stringify(updated));
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem('edusim_notes', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Smart Digital Blackboard Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 border border-slate-800 shadow-xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Phòng học trực tuyến thông minh · Hệ thống mô phỏng đa môn</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Bục giảng ảo: Khám phá trực quan Toán học, Vật lí, Tin học & Ngữ văn
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Trang bị các công cụ chuyên sâu: hệ thống vẽ đồ thị hàm số và hình học Oxy, phòng thí nghiệm vật lý 2D thời gian thực, trình biên dịch chấm test C++/Python tự động, và sơ đồ tư duy tác phẩm.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigate('math')}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Vào học Toán học
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('physics')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Vào học Vật lí
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('cs')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-700/80 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                Vào học Tin học
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Student Status Badge / Level */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-5 min-w-[240px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/30 border border-indigo-400 flex items-center justify-center text-amber-300">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Học bạ cá nhân</div>
                <div className="text-sm font-bold text-white">Học sinh tích cực</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Điểm kinh nghiệm:</span>
                <span className="text-amber-300 font-bold tabular-nums">{xp} XP</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((xp / 500) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 text-right">
                {500 - (xp % 500)} XP nữa để lên cấp tiếp theo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Disciplines Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Math Card */}
        <div
          onClick={() => onNavigate('math')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Toán học tương tác
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vẽ đồ thị hàm số đa thức, phân thức, lượng giác; vẽ hình học kéo thả điểm và định lý Pythagoras trực quan.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Mở công cụ vẽ Oxy</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Physics Card */}
        <div
          onClick={() => onNavigate('physics')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Vật lí thực nghiệm 2D
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              5 mô phỏng động 60fps: Con lắc lò xo, con lắc đơn, quang hình khúc xạ laser, đạn đạo parabol, giao thoa sóng.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span>Mở phòng thí nghiệm</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CS Card */}
        <div
          onClick={() => onNavigate('cs')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Tin học & Chấm test
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Editor code C++ và Python, hệ thống nộp bài tự động chấm nhiều test case ngầm, đo lường thời gian chạy.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Mở Code Judge Lab</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Literature Card */}
        <div
          onClick={() => onNavigate('literature')}
          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Ngữ văn & Sơ đồ tư duy
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sơ đồ tư duy mở rộng phân tích các tác phẩm kinh điển (Tây Tiến, Sóng, Vợ chồng A Phủ), thư viện dẫn chứng vàng.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span>Khám phá văn học</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Classroom Utilities: Focus Timer (Pomodoro) & Quick Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pomodoro Focus Timer */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Đồng hồ tập trung học tập (Pomodoro)
              </h3>
              <span className="text-xs text-slate-400">Phiên 25 phút</span>
            </div>

            <div className="text-center py-6">
              <div className="text-5xl font-mono font-extrabold tracking-wider text-slate-900 dark:text-slate-100 tabular-nums">
                {formatTimer(pomodoroSeconds)}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isTimerRunning ? 'Đang trong phiên tập trung làm bài' : 'Sẵn sàng bắt đầu buổi học'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={toggleTimer}
              className={`px-5 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-colors ${
                isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Tạm dừng' : 'Bắt đầu học'}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Đặt lại 25 phút"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Classroom Notes */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Sổ tay ghi chú bài học cá nhân
            </h3>
            <span className="text-xs text-slate-400">{notes.length} ghi chú</span>
          </div>

          {/* Add note input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              placeholder="Ghi lại công thức hoặc mẹo học nhanh..."
              className="flex-1 text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddNote}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Lưu
            </button>
          </div>

          {/* Note List */}
          <div className="space-y-2 overflow-y-auto max-h-48 pr-1">
            {notes.map((n) => (
              <div
                key={n.id}
                className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {n.text}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {n.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
