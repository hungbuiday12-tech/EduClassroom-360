import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  BookOpen,
  Check,
  Code2,
  Compass,
  Copy,
  Flame,
  Printer,
  ShieldCheck,
  X,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { loadAllLessonAssessments } from '../../lib/lessonProgressStore';
import {
  computeStemBadges,
  getErrorNotebook,
  getFlashcards,
  getStreakState
} from '../../lib/learningGrowthStore';
import { loadCustomLessons, loadCustomMockResults } from '../../lib/customLessonsStore';

interface LearnerPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
}

export const LearnerPortfolioModal: React.FC<LearnerPortfolioModalProps> = ({
  isOpen,
  onClose,
  xp
}) => {
  const { user, firebaseUser } = useAuth();
  const { completedSessions } = useFocusTimer();
  const [copiedSummary, setCopiedSummary] = useState(false);

  const uid = user?.uid || firebaseUser?.uid;

  const summary = useMemo(() => {
    const assessments = loadAllLessonAssessments(uid);
    const errors = getErrorNotebook(uid);
    const flashcards = getFlashcards(uid);
    const streak = getStreakState(uid);
    const badges = computeStemBadges(uid);
    const customLessons = loadCustomLessons(uid);
    const mockResults = loadCustomMockResults(uid);

    const calcSubjectAvg = (subj: 'math' | 'physics' | 'cs') => {
      const list = assessments.filter((a) => a.subject === subj);
      if (list.length === 0) return { count: 0, avgMastery: 0 };
      let totalM = 0;
      list.forEach((rec) => {
        if (typeof rec.analysis?.overallMastery === 'number') {
          totalM += rec.analysis.overallMastery;
        } else {
          const steps = Object.values(rec.stepResults || {});
          let correct = 0;
          let checked = 0;
          steps.forEach((s) => {
            correct += s.mcqCorrectCount || 0;
            checked += s.mcqCheckedCount || 0;
          });
          totalM += checked > 0 ? Math.round((correct / checked) * 100) : 50;
        }
      });
      return { count: list.length, avgMastery: Math.round(totalM / list.length) };
    };

    const math = calcSubjectAvg('math');
    const physics = calcSubjectAvg('physics');
    const cs = calcSubjectAvg('cs');

    const strongTopics = assessments
      .filter((a) => (a.analysis?.overallMastery || 0) >= 75)
      .slice(0, 4)
      .map((a) => a.lessonTitle);

    const weakTopics = [
      ...assessments
        .filter((a) => (a.analysis?.overallMastery || 100) < 65)
        .map((a) => a.lessonTitle),
      ...errors.filter((e) => !e.resolved).map((e) => e.lessonTitle)
    ]
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .slice(0, 4);

    return {
      displayName: user?.displayName || 'Học viên Synapse',
      handle: user?.username ? `@${user.username}` : '@guest_learner',
      xp: user?.xp ?? xp,
      level: Math.floor((user?.xp ?? xp) / 500) + 1,
      math,
      physics,
      cs,
      assessmentsCount: assessments.length,
      unresolvedErrors: errors.filter((e) => !e.resolved).length,
      resolvedErrors: errors.filter((e) => e.resolved).length,
      totalFlashcards: flashcards.length,
      streak,
      badges,
      unlockedBadges: badges.filter((b) => b.unlocked),
      pomodoroCount: Math.max(completedSessions, streak.stats.pomodoroCompleted),
      customLessonsCount: customLessons.length,
      mockResults
    };
  }, [uid, user, xp, completedSessions, isOpen]);

  if (!isOpen) return null;

  const handlePrintPortfolioPdf = () => {
    document.body.classList.add('synapse-printing-report');
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.body.classList.remove('synapse-printing-report');
      }, 450);
    }, 80);
  };

  const handleCopyCard = () => {
    const text = [
      `HỒ SƠ NĂNG LỰC SYNAPSE STEM — ${summary.displayName} (${summary.handle})`,
      `Cấp độ: Lv.${summary.level} · ${summary.xp} XP · Chuỗi học: ${summary.streak.currentStreak} ngày`,
      `Toán: ${summary.math.avgMastery}% (${summary.math.count} bài) | Vật lí: ${summary.physics.avgMastery}% (${summary.physics.count} bài) | Tin: ${summary.cs.avgMastery}% (${summary.cs.count} bài)`,
      `Pomodoro: ${summary.pomodoroCount} phiên · Huy hiệu: ${summary.unlockedBadges.length}/${summary.badges.length}`
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-[185] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sci-frame syn-top-laser w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-display font-extrabold text-base">
              {summary.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-base font-bold">{summary.displayName}</h2>
              <p className="text-[11px] font-mono text-cyan-300">
                Hồ sơ Năng lực STEM · Lv.{summary.level} · {summary.xp} XP
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCard}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Đã sao chép' : 'Sao chép thẻ'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrintPortfolioPdf}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Xuất Báo Cáo PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 dark:bg-slate-950">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-3.5">
              <div className="text-[11px] font-mono uppercase text-slate-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Chuỗi học
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {summary.streak.currentStreak} ngày
              </div>
              <div className="text-[11px] text-slate-500">Kỷ lục: {summary.streak.longestStreak} ngày</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-3.5">
              <div className="text-[11px] font-mono uppercase text-slate-500 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" /> Bài giảng đã đánh giá
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {summary.assessmentsCount}
              </div>
              <div className="text-[11px] text-slate-500">+{summary.customLessonsCount} bài từ PDF/Ảnh</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-3.5">
              <div className="text-[11px] font-mono uppercase text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Lỗi sai & Thẻ SM-2
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {summary.resolvedErrors} sửa / {summary.unresolvedErrors} chờ
              </div>
              <div className="text-[11px] text-slate-500">{summary.totalFlashcards} thẻ ôn ngắt quãng</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-3.5">
              <div className="text-[11px] font-mono uppercase text-slate-500 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-500" /> Pomodoro & Huy hiệu
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                {summary.pomodoroCount} phiên
              </div>
              <div className="text-[11px] text-slate-500">
                {summary.unlockedBadges.length}/{summary.badges.length} huy hiệu STEM
              </div>
            </div>
          </div>

          {/* 3-Subject Mastery Bars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Mức độ làm chủ 3 môn học trọng tâm
            </h3>
            {[
              { label: 'Toán học', icon: <Compass className="w-4 h-4 text-blue-600" />, data: summary.math, bar: 'bg-blue-600' },
              { label: 'Vật lí', icon: <Zap className="w-4 h-4 text-amber-500" />, data: summary.physics, bar: 'bg-amber-500' },
              { label: 'Tin học', icon: <Code2 className="w-4 h-4 text-emerald-600" />, data: summary.cs, bar: 'bg-emerald-600' }
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    {row.icon} {row.label} ({row.data.count} bài)
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {row.data.avgMastery}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
                  <div className={`h-full ${row.bar} transition-all duration-500`} style={{ width: `${row.data.avgMastery}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Mock Test History + Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 space-y-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Huy hiệu STEM ({summary.unlockedBadges.length}/{summary.badges.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {summary.badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-2.5 rounded border text-xs ${
                      b.unlocked
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-slate-100'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 opacity-75'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{b.titleVi}</span>
                      <span className="text-[10px] font-mono">{b.unlocked ? 'ĐẠT' : b.progressText}</span>
                    </div>
                    <p className="text-[11px] mt-0.5 leading-snug">{b.descriptionVi}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4 space-y-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Lịch sử Đề kiểm tra cá nhân hóa ({summary.mockResults.length})
              </h3>
              {summary.mockResults.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Chưa có bài kiểm tra cá nhân hóa nào. Hãy thử tạo đề theo điểm yếu tại Kho Đề Thi!
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {summary.mockResults.slice(0, 6).map((m) => (
                    <div key={m.id} className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{m.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {m.correctCount}/{m.totalCount} đúng · {new Date(m.completedAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-blue-600 text-white font-mono font-bold shrink-0">
                        {m.score10.toFixed(1)}đ
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print-Only Academic Portfolio Sheet */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="synapse-print-report-root" className="hidden p-8 bg-white text-slate-900 space-y-5">
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold uppercase">HỒ SƠ NĂNG LỰC HỌC TẬP SYNAPSE STEM</h1>
                <p className="text-sm mt-1">
                  Học viên: <strong>{summary.displayName}</strong> ({summary.handle}) · Cấp {summary.level} ({summary.xp} XP)
                </p>
              </div>
              <span className="text-xs font-mono">Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 border border-slate-300 p-4 text-sm">
              <div><strong>Toán học:</strong> {summary.math.avgMastery}% ({summary.math.count} bài)</div>
              <div><strong>Vật lí:</strong> {summary.physics.avgMastery}% ({summary.physics.count} bài)</div>
              <div><strong>Tin học:</strong> {summary.cs.avgMastery}% ({summary.cs.count} bài)</div>
            </div>
            <div className="text-sm space-y-1">
              <p><strong>Chuỗi ngày học liên tục:</strong> {summary.streak.currentStreak} ngày (Kỷ lục: {summary.streak.longestStreak} ngày)</p>
              <p><strong>Phiên tập trung Pomodoro:</strong> {summary.pomodoroCount} phiên</p>
              <p><strong>Sổ tay Lỗi sai & Thẻ SM-2:</strong> {summary.resolvedErrors} lỗi đã khắc phục, {summary.totalFlashcards} thẻ ghi nhớ</p>
              <p><strong>Huy hiệu đạt được:</strong> {summary.unlockedBadges.map((b) => b.titleVi).join(', ') || 'Đang tích lũy'}</p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
