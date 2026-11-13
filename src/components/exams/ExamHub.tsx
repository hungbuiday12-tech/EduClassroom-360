import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { EXAM_PAPERS } from '../../data/examData';
import { ExamPaper, ExamSubject, ExamTrack, SubjectType } from '../../types';
import { FormattedText, MathFormula } from '../common/MathRenderer';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileText,
  Search,
  Sparkles,
  Clock,
  Compass,
  Zap,
  Code2,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  HelpCircle,
  Timer,
  Check,
  Copy,
  GraduationCap,
  Flame,
  ArrowLeft
} from 'lucide-react';

interface ExamHubProps {
  onNavigateToSubject?: (subject: SubjectType) => void;
  onEarnXP?: (amount: number) => void;
}

export const ExamHub: React.FC<ExamHubProps> = ({ onNavigateToSubject, onEarnXP }) => {
  const { t, language } = useLanguage();
  // Main Track Filter: 'all' | 'chuyen' | 'khong_chuyen'
  const [selectedTrack, setSelectedTrack] = useState<'all' | ExamTrack>('all');

  // Subject Filter: 'all' | 'math' | 'physics' | 'cs'
  const [selectedSubject, setSelectedSubject] = useState<'all' | ExamSubject>('all');

  // Keyword search
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Active Full Exam View State
  const [activeExam, setActiveExam] = useState<ExamPaper | null>(null);

  // Timer State for Active Exam
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

  // Student answer notes: { [questionNumber]: string }
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  // Solution toggles
  const [isMasterSolutionExpanded, setIsMasterSolutionExpanded] = useState<boolean>(false);
  const [revealedQuestionSolutions, setRevealedQuestionSolutions] = useState<Record<string, boolean>>({});

  // Copied formula helper
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsExamCompleted(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Open Full Exam
  const handleOpenExam = (exam: ExamPaper) => {
    setActiveExam(exam);
    setTimerSeconds(exam.timeMinutes * 60);
    setIsTimerRunning(false); // student can start timer when ready
    setIsExamCompleted(false);
    setStudentNotes({});
    setIsMasterSolutionExpanded(false);
    setRevealedQuestionSolutions({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close Full Exam
  const handleCloseExam = () => {
    setActiveExam(null);
    setIsTimerRunning(false);
  };

  // Toggle timer
  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  // Reset timer
  const handleResetTimer = () => {
    if (activeExam) {
      setTimerSeconds(activeExam.timeMinutes * 60);
      setIsTimerRunning(false);
      setIsExamCompleted(false);
    }
  };

  // Finish exam
  const handleFinishExam = () => {
    setIsTimerRunning(false);
    setIsExamCompleted(true);
    setIsMasterSolutionExpanded(true); // Automatically reveal solution on finish
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    if (onEarnXP) onEarnXP(50);
  };

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter exams
  const filteredExams = useMemo(() => {
    return EXAM_PAPERS.filter((exam) => {
      if (selectedTrack !== 'all' && exam.track !== selectedTrack) return false;
      if (selectedSubject !== 'all' && exam.subject !== selectedSubject) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchTitle = exam.title.toLowerCase().includes(kw);
        const matchSchool = exam.school.toLowerCase().includes(kw);
        const matchTopics = exam.topics.some((t) => t.toLowerCase().includes(kw));
        const matchSnippet = exam.featuredSnippet.toLowerCase().includes(kw);
        if (!matchTitle && !matchSchool && !matchTopics && !matchSnippet) return false;
      }
      return true;
    });
  }, [selectedTrack, selectedSubject, searchKeyword]);

  // Counts for tabs
  const countChuyen = useMemo(() => EXAM_PAPERS.filter((e) => e.track === 'chuyen').length, []);
  const countKhongChuyen = useMemo(() => EXAM_PAPERS.filter((e) => e.track === 'khong_chuyen').length, []);

  // Format timer seconds into hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* ============================================================ */}
      {/* VIEW A: FULL EXAM READER & TEST ENVIRONMENT (khi bấm vào đề) */}
      {/* ============================================================ */}
      {activeExam ? (
        <div className="space-y-6">
          {/* Top Sticky Timer & Control Bar (sticky on iPad/Desktop md+, static on small phones) */}
          <div className="md:sticky md:top-20 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseExam}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'en' ? 'Back to exams' : 'Quay lại danh sách đề'}</span>
              </button>

              <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />

              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {activeExam.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeExam.school} • {activeExam.questions.length} câu hỏi
                </span>
              </div>
            </div>

            {/* Interactive Timer Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Timer Badge */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border transition-all ${
                  timerSeconds < 300 && timerSeconds > 0
                    ? 'bg-red-500/10 border-red-500/30 text-red-600 animate-pulse'
                    : isTimerRunning
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>{formatTime(timerSeconds)}</span>
              </div>

              {/* Start / Pause Button */}
              <button
                onClick={handleToggleTimer}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                  isTimerRunning
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? t('exam.pause', 'Tạm dừng', 'Pause') : t('exam.start', 'Bắt đầu tính giờ', 'Start Timer')}</span>
              </button>

              {/* Reset Timer Button */}
              <button
                onClick={handleResetTimer}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t('exam.reset', 'Đặt lại thời gian làm bài', 'Reset Timer')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Finish Exam Button */}
              {!isExamCompleted ? (
                <button
                  onClick={handleFinishExam}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('exam.finish', 'Nộp bài & Xem giải (+50 XP)', 'Finish & Solutions (+50 XP)')}</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {language === 'en' ? 'Completed!' : 'Đã hoàn thành!'}
                </span>
              )}
            </div>
          </div>

          {/* Official Exam Paper Sheet (Giấy thi chính thức) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-8">
            {/* National Exam Header */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 text-center space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest gap-2">
                <div>{activeExam.school}</div>
                <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {activeExam.track === 'chuyen' ? 'LĨNH VỰC: CHUYÊN & HSG' : 'LĨNH VỰC: KHÔNG CHUYÊN / THPT'}
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight pt-2">
                {activeExam.title}
              </h1>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Năm học: {activeExam.academicYear} • Môn thi:{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {activeExam.subject === 'math' ? 'Toán Học' : activeExam.subject === 'physics' ? 'Vật Lý' : 'Tin Học'}
                </span>{' '}
                • Thời gian làm bài: <span className="font-bold">{activeExam.timeMinutes} phút</span> (Không kể thời gian phát đề)
              </div>
              <div className="text-[11px] text-slate-400 italic">
                {activeExam.source}
              </div>
            </div>

            {/* Questions List (FULL ĐỀ - RENDER TỪNG CÂU HOÀN CHỈNH) */}
            <div className="space-y-8 divide-y divide-slate-100 dark:divide-slate-800/60">
              {activeExam.questions.map((q, qIdx) => {
                const qKey = `q-${qIdx}`;
                const isSingleSolutionRevealed = revealedQuestionSolutions[qKey];

                return (
                  <div key={qKey} className={`space-y-4 ${qIdx > 0 ? 'pt-8' : ''}`}>
                    {/* Question Header & Points */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                          {q.number}
                        </span>
                        {q.points && (
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            ({q.points})
                          </span>
                        )}
                      </div>

                      {/* Individual question solution toggle */}
                      <button
                        onClick={() =>
                          setRevealedQuestionSolutions((prev) => ({
                            ...prev,
                            [qKey]: !prev[qKey]
                          }))
                        }
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {isSingleSolutionRevealed ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Ẩn lời giải câu này</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Xem lời giải câu này</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Question Content */}
                    <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans pl-1">
                      <FormattedText text={q.content} />
                    </div>

                    {/* Key formulas or hints */}
                    {q.keyFormulasOrHints && q.keyFormulasOrHints.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {language === 'en' ? 'Key hints:' : 'Gợi ý then chốt:'}
                        </span>
                        {q.keyFormulasOrHints.map((hint, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                          >
                            <FormattedText text={hint} />
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Student Scratchpad / Draft Area */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Nháp / Lời giải của bạn:</span>
                        <span className="text-[10px] text-slate-400 lowercase">tự động lưu nháp</span>
                      </div>
                      <textarea
                        value={studentNotes[qKey] || ''}
                        onChange={(e) =>
                          setStudentNotes((prev) => ({ ...prev, [qKey]: e.target.value }))
                        }
                        placeholder="Ghi lại các bước lập luận, biến đổi hoặc code phác thảo tại đây..."
                        className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-sans text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    {/* Individual Revealed Solution Box */}
                    {isSingleSolutionRevealed && (
                      <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Hướng dẫn giải chi tiết {q.number}:</span>
                          </div>
                          <button
                            onClick={() => handleCopy(q.solution)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép</span>
                          </button>
                        </div>
                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          <FormattedText text={q.solution} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ============================================================ */}
            {/* CREATIVE MASTER SOLUTION BUTTON & ACCORDION (PHÍA DƯỚI ĐỀ) */}
            {/* ============================================================ */}
            <div className="pt-10 border-t-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
              {/* Creative Guide Button */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500 animate-pulse" />
                <button
                  onClick={() => setIsMasterSolutionExpanded(!isMasterSolutionExpanded)}
                  className="relative w-full py-5 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition-all hover:scale-[1.005]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
                      <Sparkles className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>✨ Hướng Dẫn Giải & Lời Giải Chi Tiết Từng Câu</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Bấm để mở toàn bộ lời giải chi tiết, phân tích bản chất sư phạm và đáp số của toàn bộ đề thi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 shrink-0">
                    <span>{isMasterSolutionExpanded ? 'Thu gọn lời giải' : 'Xem toàn bộ lời giải'}</span>
                    {isMasterSolutionExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>

              {/* Master Solutions Accordion Container */}
              {isMasterSolutionExpanded && (
                <div className="space-y-6 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Lời Giải Chi Tiết Từng Câu Hỏi ({activeExam.questions.length} câu):
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500">
                      Chuẩn đáp án ban ra đề {activeExam.school}
                    </span>
                  </div>

                  <div className="space-y-5">
                    {activeExam.questions.map((q, qIdx) => (
                      <div
                        key={`full-sol-${qIdx}`}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            {q.number} {q.points ? `(${q.points})` : ''}
                          </span>
                          <button
                            onClick={() => handleCopy(q.solution)}
                            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao chép lời giải</span>
                          </button>
                        </div>

                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          <FormattedText text={q.solution} />
                        </div>

                        {q.keyFormulasOrHints && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400">
                              {language === 'en' ? 'Key formulas:' : 'Công thức chốt:'}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                              {q.keyFormulasOrHints.map((hint, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/10">
                                  <MathFormula formula={hint} />
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* VIEW B: EXAM CATALOG (DANH SÁCH 60 ĐỀ THI ĐƯỢC PHÂN LĨNH VỰC)*/
        /* ============================================================ */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Ngân Hàng 60 Đề Thi Quốc Gia
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Phân định rõ ràng: 30 Đề Chuyên & 30 Đề Không Chuyên
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Thư Viện Đề Thi Chuyên & Tốt Nghiệp THPT (Full Đề)
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tất cả các đề đều được biên soạn trọn vẹn đầy đủ câu hỏi, tích hợp đồng hồ bấm giờ làm bài và hướng dẫn giải chi tiết cho từng câu.
              </p>
            </div>

            {/* Keyword Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm trường, từ khóa đề thi..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Track Filter Tabs (Chuyên vs Không chuyên) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTrack('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                selectedTrack === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Tất cả lĩnh vực (60 đề)</span>
            </button>

            <button
              onClick={() => setSelectedTrack('chuyen')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                selectedTrack === 'chuyen'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-500 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>🏆 1. Đề Chuyên & Olympic ({countChuyen} đề)</span>
            </button>

            <button
              onClick={() => setSelectedTrack('khong_chuyen')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                selectedTrack === 'khong_chuyen'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>🎯 2. Đề Không Chuyên & Tốt Nghiệp ({countKhongChuyen} đề)</span>
            </button>
          </div>

          {/* Subject Filter Pills (Toán, Lí, Tin) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tất cả môn
            </button>
            <button
              onClick={() => setSelectedSubject('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === 'math'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>📐 Toán Học (20 đề: 10 Chuyên + 10 Không Chuyên)</span>
            </button>
            <button
              onClick={() => setSelectedSubject('physics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === 'physics'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>⚡ Vật Lý (20 đề: 10 Chuyên + 10 Không Chuyên)</span>
            </button>
            <button
              onClick={() => setSelectedSubject('cs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === 'cs'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>💻 Tin Học (20 đề: 10 Chuyên + 10 Không Chuyên)</span>
            </button>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => handleOpenExam(exam)}
                className="group cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        exam.track === 'chuyen'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {exam.track === 'chuyen' ? '🏆 Đề Chuyên' : '🎯 Không Chuyên'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {exam.timeMinutes} phút
                    </span>
                  </div>

                  {/* School & Title */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                      {exam.school}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {exam.title}
                    </h3>
                  </div>

                  {/* Snippet */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    <FormattedText text={exam.featuredSnippet} />
                  </div>

                  {/* Question count & Topics */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      Full {exam.questions.length} câu hỏi
                    </span>
                    {exam.topics.slice(0, 2).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Mở full đề & tính giờ</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="p-12 text-center bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Không tìm thấy đề thi phù hợp
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Hãy thử chọn bộ lọc lĩnh vực khác hoặc xóa từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
