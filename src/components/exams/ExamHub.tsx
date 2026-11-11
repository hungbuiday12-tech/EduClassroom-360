import React, { useState } from 'react';
import { EXAM_PAPERS } from '../../data/examData';
import { ExamPaper, ExamSubject, SubjectType } from '../../types';
import {
  FileText,
  Eye,
  Download,
  Building2,
  CheckCircle,
  Tag,
  Search,
  Filter,
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
  BookOpen
} from 'lucide-react';

interface ExamHubProps {
  onNavigateToSubject?: (subject: SubjectType) => void;
  onEarnXP?: (amount: number) => void;
}

export const ExamHub: React.FC<ExamHubProps> = ({ onNavigateToSubject, onEarnXP }) => {
  const [selectedSubject, setSelectedSubject] = useState<ExamSubject | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Modal solution state
  const [activeSolutionExam, setActiveSolutionExam] = useState<ExamPaper | null>(null);

  // Online practice test mode state
  const [practiceExam, setPracticeExam] = useState<ExamPaper | null>(null);
  const [practiceSecondsLeft, setPracticeSecondsLeft] = useState<number>(150 * 60);
  const [isPracticeRunning, setIsPracticeRunning] = useState<boolean>(false);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Filter logic
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

  // Download Word (.doc) Handler
  const handleDownloadWord = (exam: ExamPaper) => {
    const docHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${exam.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; padding: 20px; }
          .header { text-align: center; font-weight: bold; margin-bottom: 25px; }
          .school { font-size: 14pt; text-transform: uppercase; }
          .title { font-size: 16pt; color: #1e3a8a; margin: 10px 0; }
          .meta { font-size: 11pt; font-style: italic; color: #475569; }
          .section { margin-top: 20px; }
          .question-title { font-weight: bold; color: #0f172a; margin-top: 15px; }
          .solution { background-color: #f1f5f9; padding: 12px; border-left: 4px solid #3b82f6; margin-top: 10px; }
          .footer { margin-top: 40px; text-align: center; font-size: 10pt; color: #64748b; }
        </style>
      </head>
      <body>
        <div class='header'>
          <div class='school'>${exam.school}</div>
          <div class='title'>${exam.title}</div>
          <div class='meta'>Năm học: ${exam.academicYear} | Thời gian làm bài: ${exam.timeMinutes} phút</div>
          <div class='meta'>${exam.source}</div>
        </div>
        <hr/>
        <div class='section'>
          <h3>I. NỘI DUNG ĐỀ THI</h3>
          ${exam.questions.map((q) => `
            <div class='question-title'>${q.number} ${q.points ? `(${q.points})` : ''}:</div>
            <p>${q.content.replace(/\n/g, '<br/>')}</p>
          `).join('')}
        </div>
        <hr style='margin-top: 30px;'/>
        <div class='section'>
          <h3>II. HƯỚNG DẪN GIẢI CHI TIẾT & BIỂU ĐIỂM</h3>
          ${exam.questions.map((q) => `
            <div class='question-title'>Lời giải ${q.number}:</div>
            <div class='solution'>${q.solution.replace(/\n/g, '<br/>')}</div>
          `).join('')}
        </div>
        <div class='footer'>
          Tài liệu được trích xuất từ hệ thống EduClassroom 360 - Nền tảng lớp học mô phỏng trực tuyến
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `De_thi_${exam.id}_${exam.subjectTag.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Start Practice Exam
  const handleStartPractice = (exam: ExamPaper) => {
    setPracticeExam(exam);
    setPracticeSecondsLeft(exam.timeMinutes * 60);
    setIsPracticeRunning(true);
    setPracticeAnswers({});
    setIsSubmitted(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kho Lưu Trữ 30 Đề Thi Tuyển Sinh Chuyên & Học Sinh Giỏi</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Đề Thi & Hướng Dẫn Giải Chi Tiết
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mỗi môn Toán, Lí, Tin gồm 10 đề thi chính thức kèm lời giải từng bước, tải file Word (.doc) và liên kết mô phỏng
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo trường, dạng bài, từ khóa..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs by Subject & Category */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedSubject === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tất cả ({EXAM_PAPERS.length})
          </button>
          <button
            onClick={() => setSelectedSubject('math')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedSubject === 'math'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Toán học ({EXAM_PAPERS.filter((e) => e.subject === 'math').length})
          </button>
          <button
            onClick={() => setSelectedSubject('physics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedSubject === 'physics'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Vật lí ({EXAM_PAPERS.filter((e) => e.subject === 'physics').length})
          </button>
          <button
            onClick={() => setSelectedSubject('cs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedSubject === 'cs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Tin học ({EXAM_PAPERS.filter((e) => e.subject === 'cs').length})
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0">Kỳ thi:</span>
          {['all', 'Tuyển Sinh Chuyên', 'Khảo Sát Chất Lượng', 'HSG Quốc Gia', 'Olympic 30/4'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả kỳ thi' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exam Cards (Styled identically to user photo with enhancements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="relative flex flex-col justify-between rounded-2xl bg-[#0f172a] text-slate-100 p-6 border border-slate-800/90 shadow-xl hover:border-slate-700 transition-all group overflow-hidden"
          >
            {/* Background subtle glowing radial gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Header Badges: [Subject] [Category] Year */}
              <div className="flex items-center justify-between gap-2 mb-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    exam.subject === 'physics'
                      ? 'bg-slate-800 text-amber-300 border border-amber-500/30'
                      : exam.subject === 'math'
                      ? 'bg-slate-800 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {exam.subject === 'physics' && <Zap className="w-3 h-3 text-amber-400" />}
                    {exam.subject === 'math' && <Compass className="w-3 h-3 text-blue-400" />}
                    {exam.subject === 'cs' && <Code2 className="w-3 h-3 text-emerald-400" />}
                    {exam.subjectTag}
                  </span>

                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-950/60 text-red-300 border border-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {exam.categoryTag}
                  </span>
                </div>

                <span className="font-mono text-slate-400 text-xs tabular-nums">
                  {exam.academicYear}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-white leading-snug tracking-tight mb-3 group-hover:text-indigo-300 transition-colors">
                {exam.title}
              </h2>

              {/* School Name with temple icon */}
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{exam.school}</span>
              </div>

              {/* Source verification badge */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-4">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{exam.source}</span>
              </div>

              {/* Featured Quote Snippet in Dark Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed mb-4 font-mono font-medium">
                {exam.featuredSnippet}
              </div>

              {/* Hashtag Topics */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {exam.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
              {/* Xem Lời Giải (Outlined Dark) */}
              <button
                onClick={() => setActiveSolutionExam(exam)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-slate-300" />
                Xem Lời Giải
              </button>

              {/* Tải Word (.doc) (Cyan Gradient Button) */}
              <button
                onClick={() => handleDownloadWord(exam)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <FileText className="w-3.5 h-3.5 text-slate-950" />
                Tải Word (.doc)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SOLUTION MODAL (Xem Lời Giải Chi Tiết) */}
      {activeSolutionExam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
                  <span>{activeSolutionExam.school}</span>
                  <span className="text-slate-600">·</span>
                  <span>Thời gian: {activeSolutionExam.timeMinutes} phút</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Hướng Dẫn Giải: {activeSolutionExam.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSolutionExam(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed">
              {activeSolutionExam.questions.map((q, idx) => (
                <div key={idx} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-sm text-amber-400">
                      {q.number} {q.points && `(${q.points})`}
                    </span>
                    {q.simulationLink && onNavigateToSubject && (
                      <button
                        onClick={() => {
                          setActiveSolutionExam(null);
                          onNavigateToSubject(q.simulationLink!.type);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 text-[11px] hover:bg-indigo-900 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {q.simulationLink.label}
                      </button>
                    )}
                  </div>

                  {/* Question Content */}
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                      Đề bài:
                    </span>
                    <p className="text-slate-200 whitespace-pre-line font-mono bg-slate-900 p-3 rounded-lg border border-slate-800/60">
                      {q.content}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                      Lời giải chi tiết & Biểu điểm:
                    </span>
                    <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-emerald-100 whitespace-pre-line font-sans leading-relaxed">
                      {q.solution}
                    </div>
                  </div>

                  {/* Key formulas */}
                  {q.keyFormulasOrHints && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-slate-400 text-[11px]">Công thức mấu chốt:</span>
                      {q.keyFormulasOrHints.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[11px]">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
              <span className="text-slate-400 text-xs">
                Có thể tải về bản in hoặc chỉnh sửa trên Word (.doc)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadWord(activeSolutionExam)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => setActiveSolutionExam(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
