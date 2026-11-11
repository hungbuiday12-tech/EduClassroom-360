import React, { useState, useEffect } from 'react';
import { EXAM_PAPERS } from '../../data/examData';
import { ExamPaper, ExamSubject, SubjectType } from '../../types';
import {
  FileText,
  Eye,
  Download,
  Building2,
  CheckCircle,
  Search,
  Sparkles,
  Clock,
  Compass,
  Zap,
  Code2,
  ExternalLink,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  Award,
  Layers,
  HelpCircle,
  Timer,
  FileCheck2
} from 'lucide-react';

interface ExamHubProps {
  onNavigateToSubject?: (subject: SubjectType) => void;
  onEarnXP?: (amount: number) => void;
}

export const ExamHub: React.FC<ExamHubProps> = ({ onNavigateToSubject, onEarnXP }) => {
  const [selectedSubject, setSelectedSubject] = useState<ExamSubject | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Active Card preview tabs: 'snippet' | 'method'
  const [activeCardTabs, setActiveCardTabs] = useState<Record<string, 'snippet' | 'method'>>({});

  // Solution Modal state
  const [activeSolutionExam, setActiveSolutionExam] = useState<ExamPaper | null>(null);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Timed Simulation Practice State
  const [activePracticeExam, setActivePracticeExam] = useState<ExamPaper | null>(null);
  const [practiceSeconds, setPracticeSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Record<string, boolean>>({});
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && practiceSeconds > 0) {
      interval = setInterval(() => {
        setPracticeSeconds((prev) => prev - 1);
      }, 1000);
    } else if (practiceSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
      setIsExamFinished(true);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, practiceSeconds]);

  // Filter exams
  const filteredExams = EXAM_PAPERS.filter((exam) => {
    if (selectedSubject !== 'all' && exam.subject !== selectedSubject) return false;
    if (selectedCategory !== 'all' && exam.categoryTag !== selectedCategory) return false;
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

  // Toggle card preview tab
  const setCardTab = (examId: string, tab: 'snippet' | 'method') => {
    setActiveCardTabs((prev) => ({ ...prev, [examId]: tab }));
  };

  // Toggle solution step
  const toggleSolutionStep = (stepKey: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  // Launch Practice Exam Mode
  const launchExamSession = (exam: ExamPaper) => {
    setActivePracticeExam(exam);
    setPracticeSeconds(exam.timeMinutes * 60);
    setIsTimerActive(true);
    setStudentNotes({});
    setCompletedQuestions({});
    setIsExamFinished(false);
  };

  // Finish practice exam
  const handleFinishPractice = () => {
    setIsTimerActive(false);
    setIsExamFinished(true);
    if (onEarnXP) {
      onEarnXP(50);
    }
  };

  // Download Word (.doc) Handler
  const handleDownloadWord = (exam: ExamPaper) => {
    const docHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${exam.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; padding: 30px; }
          .header-box { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
          .school { font-size: 13pt; text-transform: uppercase; font-weight: bold; color: #1e293b; }
          .title { font-size: 16pt; font-weight: bold; color: #1e3a8a; margin: 12px 0; }
          .meta { font-size: 11pt; color: #475569; font-style: italic; }
          .section-title { font-size: 13pt; font-weight: bold; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 25px; }
          .question-title { font-weight: bold; color: #1e293b; margin-top: 15px; }
          .content { margin-left: 15px; text-align: justify; }
          .solution-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 10px 0; }
          .formula { font-family: 'Courier New', monospace; font-weight: bold; color: #0369a1; }
          .footer { margin-top: 50px; text-align: center; font-size: 10pt; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class='header-box'>
          <div class='school'>${exam.school}</div>
          <div class='title'>${exam.title}</div>
          <div class='meta'>Năm học: ${exam.academicYear} · Thời gian làm bài: ${exam.timeMinutes} phút</div>
          <div class='meta'>${exam.source}</div>
        </div>

        <div class='section-title'>I. PHẦN ĐỀ BÀI CHÍNH THỨC</div>
        ${exam.questions.map((q) => `
          <div class='question-title'>${q.number} ${q.points ? `(${q.points})` : ''}:</div>
          <div class='content'>${q.content.replace(/\n/g, '<br/>')}</div>
        `).join('')}

        <div class='section-title' style='margin-top: 40px;'>II. ĐÁP ÁN, HƯỚNG DẪN GIẢI VÀ BIỂU ĐIỂM CHI TIẾT</div>
        ${exam.questions.map((q) => `
          <div class='question-title'>Lời giải ${q.number}:</div>
          <div class='solution-box'>${q.solution.replace(/\n/g, '<br/>')}</div>
          ${q.keyFormulasOrHints ? `<div style='font-size: 11pt; margin-left: 15px;'><strong>Công thức mấu chốt:</strong> <span class='formula'>${q.keyFormulasOrHints.join(' ; ')}</span></div>` : ''}
        `).join('')}

        <div class='footer'>
          EduClassroom 360 · Hệ thống khảo thí và thư viện đề thi chuyên THPT Quốc Gia
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `De_Thi_${exam.id}_${exam.subjectTag.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTimer = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Thư Viện Khảo Thí & Đề Thi Chuyên Quốc Gia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Kho Đề Thi & Hướng Dẫn Giải Chuyên Sâu
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Hệ thống 30 đề thi chính thức phân môn Toán, Lí, Tin với phân tích học thuật đa tầng, xuất file Word bản in chuẩn và tích hợp trực tiếp vào phòng thí nghiệm mô phỏng.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo trường thi, chủ đề, dạng bài..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Modern Filter Segmented Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Discipline Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedSubject === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tất cả (30 Đề)
          </button>
          <button
            onClick={() => setSelectedSubject('math')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedSubject === 'math'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Toán học (10)
          </button>
          <button
            onClick={() => setSelectedSubject('physics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedSubject === 'physics'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Vật lí (10)
          </button>
          <button
            onClick={() => setSelectedSubject('cs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedSubject === 'cs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Tin học (10)
          </button>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {['all', 'Tuyển Sinh Chuyên', 'Khảo Sát Chất Lượng', 'HSG Quốc Gia', 'Olympic 30/4'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'Toàn bộ kỳ thi' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* INNOVATIVE EXAM DOSSIER GRID (Distinctive Academic Architecture) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam, index) => {
          const currentTab = activeCardTabs[exam.id] || 'snippet';
          const subjectColor =
            exam.subject === 'math'
              ? 'text-blue-500'
              : exam.subject === 'physics'
              ? 'text-amber-500'
              : 'text-emerald-500';
          const borderColor =
            exam.subject === 'math'
              ? 'group-hover:border-blue-500/50'
              : exam.subject === 'physics'
              ? 'group-hover:border-amber-500/50'
              : 'group-hover:border-emerald-500/50';

          return (
            <div
              key={exam.id}
              className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${borderColor}`}
            >
              {/* Top Meta Bar */}
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold tracking-wider ${subjectColor}`}>
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {exam.subjectTag}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                    <span className="text-xs text-slate-500">
                      {exam.categoryTag}
                    </span>
                  </div>

                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    {exam.academicYear}
                  </span>
                </div>

                {/* Exam Title */}
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug tracking-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {exam.title}
                </h2>

                {/* Institution & Source Info (Clean unboxed style) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{exam.school}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mb-4">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{exam.source}</span>
                </div>

                {/* Interactive Card Tabs: Trích đoạn vs Định hướng giải */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 mb-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCardTab(exam.id, 'snippet')}
                        className={`font-semibold transition-colors ${
                          currentTab === 'snippet'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Đề bài điểm nhấn
                      </button>
                      <button
                        onClick={() => setCardTab(exam.id, 'method')}
                        className={`font-semibold transition-colors ${
                          currentTab === 'method'
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Phương pháp giải
                      </button>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {exam.timeMinutes} phút
                    </span>
                  </div>

                  {currentTab === 'snippet' ? (
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed line-clamp-3">
                      {exam.featuredSnippet}
                    </p>
                  ) : (
                    <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {exam.questions[0]?.number}:
                      </div>
                      <p className="line-clamp-3">
                        {exam.questions[0]?.solution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Concepts Separated by Typographic Dots (Anti-slop zero pills) */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-6">
                  {exam.topics.map((t, idx) => (
                    <React.Fragment key={idx}>
                      <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                        {t}
                      </span>
                      {idx < exam.topics.length - 1 && (
                        <span className="text-slate-300 dark:text-slate-700 select-none" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* DISTINCTIVE ACTION SUITE (Executive Examination Actions) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                {/* Primary Action Button: Mở Lời Giải Chi Tiết */}
                <button
                  onClick={() => setActiveSolutionExam(exam)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs transition-all shadow-sm group/btn"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400 dark:text-indigo-600" />
                    <span>Hướng Dẫn Giải Chi Tiết</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Secondary Utility Row (Download & Live Simulation Practice) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadWord(exam)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                    title="Tải đề thi và đáp án dạng Word (.doc)"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tải bản Word</span>
                  </button>

                  <button
                    onClick={() => launchExamSession(exam)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                    title="Mở chế độ phòng thi bấm giờ mô phỏng"
                  >
                    <Timer className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Bấm giờ thi</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE SOLUTION VIEWER MODAL (Step-by-step reveal) */}
      {activeSolutionExam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Top Bar */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  <span>{activeSolutionExam.school}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Thời gian thi: {activeSolutionExam.timeMinutes} phút</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Năm học {activeSolutionExam.academicYear}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {activeSolutionExam.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSolutionExam(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Questions and Solutions */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {activeSolutionExam.questions.map((q, idx) => {
                const stepKey = `${activeSolutionExam.id}-${idx}`;
                const isRevealed = revealedSolutions[stepKey] ?? true;

                return (
                  <div
                    key={idx}
                    className="space-y-3 bg-slate-50/70 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {q.number}
                        </span>
                        {q.points && (
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold font-mono">
                            [{q.points}]
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Cross-lab bridge button */}
                        {q.simulationLink && onNavigateToSubject && (
                          <button
                            onClick={() => {
                              setActiveSolutionExam(null);
                              onNavigateToSubject(q.simulationLink!.type);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {q.simulationLink.label}
                          </button>
                        )}

                        <button
                          onClick={() => toggleSolutionStep(stepKey)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          {isRevealed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {isRevealed ? 'Ẩn lời giải' : 'Hiện lời giải'}
                        </button>
                      </div>
                    </div>

                    {/* Question Statement */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        Nội dung đề bài:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line font-mono bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                        {q.content}
                      </p>
                    </div>

                    {/* Step-by-step Solution */}
                    {isRevealed && (
                      <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider block">
                          Hướng dẫn giải & Phân tích sư phạm:
                        </span>
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-xl text-emerald-950 dark:text-emerald-100 whitespace-pre-line font-sans leading-relaxed text-xs">
                          {q.solution}
                        </div>

                        {q.keyFormulasOrHints && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-slate-500 text-[11px] font-medium">
                              Kiến thức mấu chốt:
                            </span>
                            {q.keyFormulasOrHints.map((f, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded-md font-mono text-[11px]"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Tài liệu chuẩn từ ngân hàng khảo thí EduClassroom 360
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadWord(activeSolutionExam)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => setActiveSolutionExam(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE VIRTUAL EXAM SESSION MODAL (Bấm Giờ Thi Thử Chuyên Sâu) */}
      {activePracticeExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Header with countdown timer */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400">
                  Phòng thi thử trực tuyến
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-xl">
                  {activePracticeExam.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                {/* Countdown clock */}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-base font-bold tabular-nums text-amber-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{formatTimer(practiceSeconds)}</span>
                </div>

                <button
                  onClick={() => setActivePracticeExam(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Questions with student scratchpad */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {isExamFinished ? (
                <div className="p-6 bg-emerald-950/30 border border-emerald-800 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">
                    Bạn đã hoàn thành buổi thi thử!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Chúc mừng bạn đã rèn luyện tinh thần thi đấu! Bạn được cộng <strong>+50 XP</strong> vào học bạ cá nhân.
                  </p>
                  <button
                    onClick={() => {
                      setActiveSolutionExam(activePracticeExam);
                      setActivePracticeExam(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Xem lời giải & đối chiếu kết quả
                  </button>
                </div>
              ) : (
                activePracticeExam.questions.map((q, idx) => (
                  <div key={idx} className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 text-sm">
                        {q.number} {q.points && `(${q.points})`}
                      </span>
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!completedQuestions[q.number]}
                          onChange={(e) =>
                            setCompletedQuestions((prev) => ({
                              ...prev,
                              [q.number]: e.target.checked
                            }))
                          }
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Đã làm xong câu này</span>
                      </label>
                    </div>

                    <p className="text-slate-200 font-mono whitespace-pre-line bg-slate-900 p-3 rounded-xl border border-slate-800">
                      {q.content}
                    </p>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Nháp lời giải & đáp số của bạn:
                      </span>
                      <textarea
                        value={studentNotes[q.number] || ''}
                        onChange={(e) =>
                          setStudentNotes((prev) => ({
                            ...prev,
                            [q.number]: e.target.value
                          }))
                        }
                        rows={3}
                        placeholder="Nhập các bước suy luận, công thức hoặc kết quả nháp tại đây..."
                        className="w-full text-xs font-mono p-3 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {!isExamFinished && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Đã hoàn thành {Object.values(completedQuestions).filter(Boolean).length}/{activePracticeExam.questions.length} câu
                </span>
                <button
                  onClick={handleFinishPractice}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  Nộp bài & Đối chiếu đáp án (+50 XP)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
