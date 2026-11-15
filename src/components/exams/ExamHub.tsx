import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { EXAM_PAPERS } from '../../data/examData';
import {
  ExamImageEvaluation,
  ExamPaper,
  ExamQAMessage,
  ExamSubject,
  ExamTrack,
  SubjectType
} from '../../types';
import { FormattedText, MathFormula } from '../common/MathRenderer';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { safeFetchJson } from '../../lib/apiClient';
import {
  Search,
  Sparkles,
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
  Copy,
  GraduationCap,
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
  Loader2,
  Send,
  MessageSquare,
  AlertCircle,
  ZoomIn,
  X,
  Check
} from 'lucide-react';

interface ExamHubProps {
  onNavigateToSubject?: (subject: SubjectType) => void;
  onEarnXP?: (amount: number) => void;
  onBack?: () => void;
}

interface UploadedAnswerImage {
  id: string;
  name: string;
  base64: string;
  mimeType: string;
}

async function compressExamImageFile(file: File): Promise<UploadedAnswerImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const img = new Image();
      img.onerror = () => {
        resolve({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name || 'answer.png',
          base64: dataUrl,
          mimeType: file.type || 'image/png'
        });
      };
      img.onload = () => {
        const maxDim = 1400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: file.name || 'answer.jpg',
            base64: dataUrl,
            mimeType: file.type || 'image/jpeg'
          });
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        resolve({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name || 'answer.jpg',
          base64: compressed,
          mimeType: 'image/jpeg'
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const ExamHub: React.FC<ExamHubProps> = ({ onEarnXP, onBack }) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate, goBack } = useNavigation();

  const [selectedTrack, setSelectedTrack] = useState<'all' | ExamTrack>('all');
  const [selectedSubject, setSelectedSubject] = useState<'all' | ExamSubject>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const activeExam = useMemo(
    () => EXAM_PAPERS.find((e) => e.id === location.examId) || null,
    [location.examId]
  );

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);

  // Student answer notes
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});

  // Uploaded handwritten/solution photos + AI Grading + Follow-up Q&A
  const [uploadedImages, setUploadedImages] = useState<UploadedAnswerImage[]>([]);
  const [previewZoomUrl, setPreviewZoomUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<ExamImageEvaluation | null>(null);

  const [qaMessages, setQaMessages] = useState<ExamQAMessage[]>([]);
  const [qaInput, setQaInput] = useState<string>('');
  const [isQaSending, setIsQaSending] = useState<boolean>(false);
  const [qaError, setQaError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qaEndRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Solution toggles
  const [isMasterSolutionExpanded, setIsMasterSolutionExpanded] = useState<boolean>(false);
  const [revealedQuestionSolutions, setRevealedQuestionSolutions] = useState<Record<string, boolean>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Timer countdown
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

  // Reset exam state whenever activeExam changes
  useEffect(() => {
    if (activeExam) {
      setTimerSeconds(activeExam.timeMinutes * 60);
      setIsTimerRunning(false);
      setIsExamCompleted(false);
      setStudentNotes({});
      setUploadedImages([]);
      setPreviewZoomUrl(null);
      setIsGrading(false);
      setGradeError(null);
      setAiEvaluation(null);
      setQaMessages([]);
      setQaInput('');
      setQaError(null);
      setIsMasterSolutionExpanded(false);
      setRevealedQuestionSolutions({});
    } else {
      setIsTimerRunning(false);
    }
  }, [activeExam?.id]);

  // Clipboard paste support (Ctrl+V) for answer photos inside active exam
  useEffect(() => {
    if (!activeExam) return;
    const onPaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const f = items[i].getAsFile();
          if (f) imageFiles.push(f);
        }
      }
      if (imageFiles.length > 0) {
        e.preventDefault();
        await handleAddImageFiles(imageFiles);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [activeExam?.id]);

  useEffect(() => {
    if (qaMessages.length > 0) {
      qaEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaMessages.length, isQaSending]);

  const handleAddImageFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;
    setGradeError(null);
    const compressedList: UploadedAnswerImage[] = [];
    for (const file of fileArray.slice(0, 5)) {
      try {
        const compressed = await compressExamImageFile(file);
        compressedList.push(compressed);
      } catch {
        // skip unreadable image
      }
    }
    if (compressedList.length > 0) {
      setUploadedImages((prev) => [...prev, ...compressedList].slice(0, 5));
    }
  };

  const handleOpenExam = (exam: ExamPaper) => {
    navigate({ examId: exam.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseExam = () => {
    setIsTimerRunning(false);
    goBack();
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    if (activeExam) {
      setTimerSeconds(activeExam.timeMinutes * 60);
      setIsTimerRunning(false);
      setIsExamCompleted(false);
    }
  };

  const handleFinishExam = () => {
    setIsTimerRunning(false);
    if (!isExamCompleted && onEarnXP) onEarnXP(50);
    setIsExamCompleted(true);
    setIsMasterSolutionExpanded(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const buildCombinedNotesText = () => {
    if (!activeExam) return '';
    return activeExam.questions
      .map((q, idx) => {
        const val = (studentNotes[`q-${idx}`] || '').trim();
        return val ? `${q.number}:\n${val}` : '';
      })
      .filter(Boolean)
      .join('\n\n');
  };

  const handleSubmitPhotosForGrading = async () => {
    if (!activeExam || isGrading) return;
    const notesText = buildCombinedNotesText();
    if (uploadedImages.length === 0 && !notesText) {
      setGradeError(
        isEn
          ? 'Please upload at least 1 photo of your work (or write notes) before submitting to AI.'
          : 'Vui lòng tải lên ít nhất 1 ảnh bài làm (hoặc viết lời giải vào ô nháp) trước khi nộp AI chấm điểm.'
      );
      return;
    }

    setIsGrading(true);
    setGradeError(null);

    const res = await safeFetchJson<{ success?: boolean; evaluation?: ExamImageEvaluation; error?: string }>(
      '/api/gemini/grade-exam-image',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeExam.subject,
          examTitle: activeExam.title,
          track: activeExam.track,
          questions: activeExam.questions.map((q) => ({
            number: q.number,
            points: q.points,
            content: q.content,
            solution: q.solution
          })),
          studentImages: uploadedImages.map((img) => ({
            base64: img.base64,
            mimeType: img.mimeType
          })),
          studentNotesText: notesText,
          language
        })
      },
      75000
    );

    setIsGrading(false);

    if (!res.ok || !res.data?.evaluation) {
      setGradeError(
        res.error ||
          (isEn
            ? 'Could not grade the submitted exam photos. Please try again.'
            : 'Chưa thể chấm bài lúc này. Vui lòng thử nộp lại.')
      );
      return;
    }

    const ev = res.data.evaluation;
    setAiEvaluation(ev);
    setIsTimerRunning(false);
    if (!isExamCompleted && onEarnXP) onEarnXP(50);
    setIsExamCompleted(true);
    setIsMasterSolutionExpanded(true);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });

    const ts = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setQaMessages([
      {
        id: `qa_init_${Date.now()}`,
        role: 'tutor',
        text: isEn
          ? `Your score is **${ev.score}/10 (${ev.verdict})**! You can ask me below about any step you got wrong, why points were deducted, or anything unclear in the solutions.`
          : `AI đã công bố kết quả: **${ev.score}/10 (${ev.verdict})**! Nếu còn bất kỳ bước biến đổi, công thức hoặc lý do trừ điểm nào chưa hiểu, em hãy hỏi ngay bên dưới để AI giải đáp chi tiết nhé.`,
        timestamp: ts
      }
    ]);

    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSendQaMessage = async (customText?: string) => {
    if (!activeExam || isQaSending) return;
    const text = (customText ?? qaInput).trim();
    if (!text) return;

    const ts = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ExamQAMessage = {
      id: `qa_u_${Date.now()}`,
      role: 'user',
      text,
      timestamp: ts
    };
    const nextHistory = [...qaMessages, userMsg];
    setQaMessages(nextHistory);
    if (!customText) setQaInput('');
    setIsQaSending(true);
    setQaError(null);

    const res = await safeFetchJson<{ success?: boolean; reply?: string; error?: string }>(
      '/api/gemini/exam-qa',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeExam.subject,
          examTitle: activeExam.title,
          questions: activeExam.questions.map((q) => ({
            number: q.number,
            content: q.content,
            solution: q.solution
          })),
          studentImages: uploadedImages.map((img) => ({
            base64: img.base64,
            mimeType: img.mimeType
          })),
          evaluation: aiEvaluation,
          messages: nextHistory.map((m) => ({
            role: m.role === 'tutor' ? 'tutor' : 'user',
            text: m.text
          })),
          language
        })
      },
      60000
    );

    setIsQaSending(false);

    if (!res.ok || !res.data?.reply) {
      setQaError(
        res.error ||
          (isEn
            ? 'AI could not answer right now. Please resend.'
            : 'AI chưa thể phản hồi lúc này. Vui lòng thử gửi lại.')
      );
      return;
    }

    setQaMessages((prev) => [
      ...prev,
      {
        id: `qa_t_${Date.now()}`,
        role: 'tutor',
        text: res.data!.reply!,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredExams = useMemo(() => {
    return EXAM_PAPERS.filter((exam) => {
      if (selectedTrack !== 'all' && exam.track !== selectedTrack) return false;
      if (selectedSubject !== 'all' && exam.subject !== selectedSubject) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchTitle = exam.title.toLowerCase().includes(kw);
        const matchSchool = exam.school.toLowerCase().includes(kw);
        const matchTopics = exam.topics.some((topic) => topic.toLowerCase().includes(kw));
        const matchSnippet = exam.featuredSnippet.toLowerCase().includes(kw);
        if (!matchTitle && !matchSchool && !matchTopics && !matchSnippet) return false;
      }
      return true;
    });
  }, [selectedTrack, selectedSubject, searchKeyword]);

  const totalExams = EXAM_PAPERS.length;
  const countChuyen = useMemo(() => EXAM_PAPERS.filter((e) => e.track === 'chuyen').length, []);
  const countKhongChuyen = useMemo(() => EXAM_PAPERS.filter((e) => e.track === 'khong_chuyen').length, []);
  const subjectStats = useMemo(() => {
    const calc = (subj: ExamSubject) => {
      const items = EXAM_PAPERS.filter((e) => e.subject === subj);
      return {
        total: items.length,
        chuyen: items.filter((e) => e.track === 'chuyen').length,
        khongChuyen: items.filter((e) => e.track === 'khong_chuyen').length
      };
    };
    return {
      math: calc('math'),
      physics: calc('physics'),
      cs: calc('cs')
    };
  }, []);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const quickQaChips = isEn
    ? [
        'Why did I lose points and how can I fix my mistakes?',
        'Re-explain the hardest question step-by-step',
        'Check my handwritten steps in the uploaded image'
      ]
    : [
        'Vì sao em bị trừ điểm và cần sửa cụ thể thế nào?',
        'Giảng lại chi tiết câu em làm sai hoặc còn bỏ trống',
        'Chỉ ra dòng sai trong ảnh bài làm của em'
      ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Lightbox zoom for uploaded answer photo */}
      {previewZoomUrl && (
        <div
          className="fixed inset-0 z-[130] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewZoomUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewZoomUrl(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-white text-slate-900 shadow-lg hover:bg-slate-200"
              title={isEn ? 'Close preview' : 'Đóng ảnh'}
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewZoomUrl}
              alt="Answer preview"
              className="max-h-[85vh] rounded-2xl border border-slate-700 shadow-2xl object-contain bg-white"
            />
          </div>
        </div>
      )}

      {activeExam ? (
        <div className="space-y-6">
          {/* Top Sticky Timer & Control Bar */}
          <div className="md:sticky md:top-20 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={handleCloseExam}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? 'Back to exams' : 'Quay lại danh sách đề'}</span>
              </button>

              <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-700" />

              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {activeExam.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeExam.school} · {activeExam.questions.length} {isEn ? 'questions' : 'câu hỏi'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
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

              <button
                onClick={handleToggleTimer}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                  isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>
                  {isTimerRunning
                    ? t('exam.pause', 'Tạm dừng', 'Pause')
                    : t('exam.start', 'Bắt đầu tính giờ', 'Start Timer')}
                </span>
              </button>

              <button
                onClick={handleResetTimer}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t('exam.reset', 'Đặt lại thời gian làm bài', 'Reset Timer')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {!isExamCompleted ? (
                <button
                  onClick={handleFinishExam}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('exam.finish', 'Xem đáp án (+50 XP)', 'Finish & Solutions (+50 XP)')}</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {isEn ? 'Completed!' : 'Đã hoàn thành!'}
                </span>
              )}
            </div>
          </div>

          {/* Official Exam Paper Sheet */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-8">
            {/* Header */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 text-center space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest gap-2">
                <div>{activeExam.school}</div>
                <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {activeExam.track === 'chuyen'
                    ? isEn ? 'TRACK: SPECIALIZED & OLYMPIAD' : 'LĨNH VỰC: CHUYÊN & HSG'
                    : isEn ? 'TRACK: STANDARD / HIGH SCHOOL' : 'LĨNH VỰC: KHÔNG CHUYÊN / THPT'}
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight pt-2">
                {activeExam.title}
              </h1>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isEn ? 'Academic Year:' : 'Năm học:'} {activeExam.academicYear} ·{' '}
                {isEn ? 'Subject:' : 'Môn thi:'}{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {activeExam.subject === 'math'
                    ? isEn ? 'Mathematics' : 'Toán Học'
                    : activeExam.subject === 'physics'
                    ? isEn ? 'Physics' : 'Vật Lý'
                    : isEn ? 'Computer Science' : 'Tin Học'}
                </span>{' '}
                · {isEn ? 'Duration:' : 'Thời gian làm bài:'}{' '}
                <span className="font-bold">
                  {activeExam.timeMinutes} {isEn ? 'min' : 'phút'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 italic">{activeExam.source}</div>
            </div>

            {/* Questions List */}
            <div className="space-y-8 divide-y divide-slate-100 dark:divide-slate-800/60">
              {activeExam.questions.map((q, qIdx) => {
                const qKey = `q-${qIdx}`;
                const isSingleSolutionRevealed = revealedQuestionSolutions[qKey];

                return (
                  <div key={qKey} className={`space-y-4 ${qIdx > 0 ? 'pt-8' : ''}`}>
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
                            <span>{isEn ? 'Hide solution' : 'Ẩn lời giải câu này'}</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>{isEn ? 'View solution' : 'Xem lời giải câu này'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans pl-1">
                      <FormattedText text={q.content} />
                    </div>

                    {q.keyFormulasOrHints && q.keyFormulasOrHints.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-semibold text-slate-400">
                          {isEn ? 'Key hints:' : 'Gợi ý then chốt:'}
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

                    {/* Student Scratchpad */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>{isEn ? 'Your Draft / Notes:' : 'Nháp / Lời giải của bạn:'}</span>
                        <span className="text-[10px] text-slate-400 lowercase">
                          {isEn ? 'included when AI grades' : 'gửi kèm khi AI chấm điểm'}
                        </span>
                      </div>
                      <textarea
                        value={studentNotes[qKey] || ''}
                        onChange={(e) =>
                          setStudentNotes((prev) => ({ ...prev, [qKey]: e.target.value }))
                        }
                        placeholder={
                          isEn
                            ? 'Write your steps, formulas, or code draft here...'
                            : 'Ghi lại các bước lập luận, biến đổi hoặc code phác thảo tại đây...'
                        }
                        className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-sans text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    {isSingleSolutionRevealed && (
                      <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>
                              {isEn ? `Detailed Solution (${q.number}):` : `Hướng dẫn giải chi tiết ${q.number}:`}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(q.solution)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {copiedText === q.solution ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{isEn ? 'Copied' : 'Đã chép'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Copy' : 'Sao chép'}</span>
                              </>
                            )}
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
            {/* PHOTO SUBMISSION, AI GRADING & FOLLOW-UP Q&A SECTION */}
            {/* ============================================================ */}
            <div className="pt-8 border-t-2 border-dashed border-indigo-200 dark:border-indigo-900/60 space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/70 dark:from-indigo-950/35 dark:via-slate-900 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800/70 p-5 sm:p-6 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {isEn
                          ? 'Submit Answer Sheet Photos & AI Auto-Grading'
                          : 'Nộp Ảnh Bài Làm Để AI Chấm & Công Bố Điểm'}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {isEn
                          ? 'Upload or paste (Ctrl+V) up to 5 photos of your handwritten work. Gemini AI grades every question on a 0–10 scale and answers follow-up questions.'
                          : 'Tải lên, kéo thả hoặc dán (Ctrl+V) tối đa 5 ảnh chụp bài làm viết tay/code. AI sẽ chấm chi tiết thang điểm 10, công bố kết quả và giải đáp phần em chưa hiểu.'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 self-start sm:self-center shrink-0">
                    {uploadedImages.length}/5 {isEn ? 'photos' : 'ảnh'}
                  </span>
                </div>

                {/* Upload Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    if (e.dataTransfer.files?.length) {
                      await handleAddImageFiles(e.dataTransfer.files);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
                    isDraggingOver
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-950/60 hover:border-indigo-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files?.length) {
                        await handleAddImageFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Upload className="w-7 h-7 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isEn
                      ? 'Click to select exam photos, drag & drop here, or press Ctrl+V to paste'
                      : 'Bấm để chọn ảnh bài làm, kéo thả vào đây hoặc nhấn Ctrl+V để dán ảnh'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {isEn
                      ? 'Supports JPG, PNG, WebP — automatically compressed for fast AI vision grading'
                      : 'Hỗ trợ ảnh chụp điện thoại JPG, PNG, WebP (tự động nén rõ nét, tối đa 5 trang)'}
                  </p>
                </div>

                {/* Thumbnails Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                      >
                        <img
                          src={img.base64}
                          alt={img.name}
                          onClick={() => setPreviewZoomUrl(img.base64)}
                          className="w-full h-28 object-cover cursor-zoom-in"
                        />
                        <div className="px-2 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                          <span className="truncate">
                            {isEn ? `Page ${idx + 1}` : `Trang ${idx + 1}`}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPreviewZoomUrl(img.base64)}
                              className="p-0.5 text-slate-400 hover:text-indigo-500"
                              title={isEn ? 'Zoom' : 'Phóng to'}
                            >
                              <ZoomIn className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setUploadedImages((prev) => prev.filter((x) => x.id !== img.id))
                              }
                              className="p-0.5 text-slate-400 hover:text-rose-500"
                              title={isEn ? 'Remove' : 'Xóa ảnh'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {gradeError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{gradeError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn
                      ? 'Tip: Clear lighting & upright handwriting gives the most accurate per-step score.'
                      : 'Mẹo: Chụp ảnh đủ sáng, rõ chữ giúp AI đọc chính xác từng bước và chấm điểm sát nhất.'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmitPhotosForGrading}
                    disabled={isGrading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isGrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {isEn ? 'AI is grading your exam...' : 'AI đang đọc ảnh & chấm điểm...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {aiEvaluation
                            ? isEn
                              ? 'Re-submit & Re-grade with AI'
                              : 'Nộp lại ảnh & Chấm lại điểm'
                            : isEn
                            ? 'Submit & Announce AI Score (+50 XP)'
                            : 'Nộp Bài & Công Bố Điểm AI (+50 XP)'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI SCORE ANNOUNCEMENT & FOLLOW-UP Q&A */}
              {aiEvaluation && (
                <div ref={resultSectionRef} className="space-y-5 animate-fadeIn">
                  {/* Announced Score Card */}
                  <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-600/40 p-5 sm:p-6 shadow-lg space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4" />
                          <span>
                            {isEn ? 'OFFICIAL AI EXAM RESULT' : 'CÔNG BỐ KẾT QUẢ CHẤM BÀI TỪ AI'}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                          {activeExam.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          <FormattedText text={aiEvaluation.summary} />
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md min-w-[130px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                          {isEn ? 'TOTAL SCORE' : 'TỔNG ĐIỂM'}
                        </span>
                        <div className="text-3xl font-black font-mono tabular-nums leading-tight">
                          {aiEvaluation.score}
                          <span className="text-base font-bold opacity-80">/10</span>
                        </div>
                        <span className="mt-1 px-2 py-0.5 rounded bg-white/20 text-[11px] font-bold">
                          {aiEvaluation.verdict}
                        </span>
                      </div>
                    </div>

                    {/* Per-question Breakdown */}
                    {aiEvaluation.questionBreakdown.length > 0 && (
                      <div className="space-y-2.5">
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {isEn ? 'Per-Question Breakdown' : 'Chi Tiết Điểm Từng Câu'}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {aiEvaluation.questionBreakdown.map((item, bIdx) => {
                            const statusColors =
                              item.status === 'correct'
                                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/25'
                                : item.status === 'partial'
                                ? 'border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/25'
                                : item.status === 'missing'
                                ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                                : 'border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/25';

                            const statusLabel =
                              item.status === 'correct'
                                ? isEn ? 'Correct' : 'Đạt tối đa'
                                : item.status === 'partial'
                                ? isEn ? 'Partial' : 'Đúng một phần'
                                : item.status === 'missing'
                                ? isEn ? 'Missing' : 'Chưa thấy bài làm'
                                : isEn ? 'Needs fix' : 'Chưa chính xác';

                            return (
                              <div
                                key={bIdx}
                                className={`p-3.5 rounded-2xl border space-y-1.5 ${statusColors}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    {item.questionNumber}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                      {statusLabel}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
                                      {item.earned}/{item.max}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                  <FormattedText text={item.comment} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Mistakes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-900/60 space-y-2">
                        <h5 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                          {isEn ? 'Strengths' : 'Điểm làm tốt'}
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {(aiEvaluation.strengths.length > 0
                            ? aiEvaluation.strengths
                            : [isEn ? 'Attempted the exam workflow.' : 'Đã hoàn thành nộp bài kiểm tra.']
                          ).map((st, sIdx) => (
                            <li key={sIdx}>
                              <FormattedText text={st} />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/25 border border-rose-200/80 dark:border-rose-900/60 space-y-2">
                        <h5 className="text-xs font-extrabold text-rose-800 dark:text-rose-300">
                          {isEn ? 'Mistakes & Missing Steps' : 'Lỗi sai & Phần còn thiếu'}
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                          {(aiEvaluation.mistakes.length > 0
                            ? aiEvaluation.mistakes
                            : [isEn ? 'No major errors detected.' : 'Không phát hiện lỗi nghiêm trọng.']
                          ).map((mk, mIdx) => (
                            <li key={mIdx}>
                              <FormattedText text={mk} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200">
                      <span className="font-bold">
                        {isEn ? 'Next Study Advice: ' : 'Định hướng ôn tập tiếp theo: '}
                      </span>
                      <FormattedText text={aiEvaluation.nextAdvice} />
                    </div>
                  </div>

                  {/* Interactive Post-Grading Q&A Chat */}
                  <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {isEn
                              ? 'Ask AI Tutor About Unclear Steps & Solutions'
                              : 'Đặt Câu Hỏi Cho AI Giải Đáp Phần Chưa Hiểu'}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {isEn
                              ? 'AI remembers the full exam, official solutions, your uploaded photos, and your grading breakdown.'
                              : 'AI đã nắm toàn bộ đề thi, đáp án chuẩn, ảnh bài làm và phiếu chấm điểm của bạn.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick follow-up chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {quickQaChips.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSendQaMessage(chip)}
                          disabled={isQaSending}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/40 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Chat transcript */}
                    <div className="max-h-96 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                      {qaMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-xs'
                            }`}
                          >
                            <FormattedText text={msg.text} />
                            <div
                              className={`text-[10px] mt-1 ${
                                msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                            >
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isQaSending && (
                        <div className="flex justify-start">
                          <div className="rounded-2xl px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                            <span>
                              {isEn ? 'AI is analyzing your question...' : 'AI đang phân tích câu hỏi...'}
                            </span>
                          </div>
                        </div>
                      )}
                      <div ref={qaEndRef} />
                    </div>

                    {qaError && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                        {qaError}
                      </div>
                    )}

                    {/* Input bar */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={qaInput}
                        onChange={(e) => setQaInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendQaMessage();
                          }
                        }}
                        placeholder={
                          isEn
                            ? 'Ask about any question, deduction, or step you want explained...'
                            : 'Nhập câu hỏi về câu chưa hiểu, lý do trừ điểm hoặc bước biến đổi...'
                        }
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendQaMessage()}
                        disabled={isQaSending || !qaInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Ask AI' : 'Gửi hỏi AI'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* CREATIVE MASTER SOLUTION BUTTON & ACCORDION */}
            {/* ============================================================ */}
            <div className="pt-6 border-t-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-500 animate-pulse" />
                <button
                  onClick={() => setIsMasterSolutionExpanded(!isMasterSolutionExpanded)}
                  className="relative w-full py-5 px-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 dark:border-amber-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition-all hover:scale-[1.005]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {isEn
                          ? 'Full Answer Key & Step-by-Step Solutions'
                          : 'Hướng Dẫn Giải & Lời Giải Chi Tiết Từng Câu'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isEn
                          ? 'Click to expand complete step-by-step solutions and key formulas for the entire exam'
                          : 'Bấm để mở toàn bộ lời giải chi tiết, phân tích bản chất sư phạm và đáp số của toàn bộ đề thi'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 shrink-0">
                    <span>
                      {isMasterSolutionExpanded
                        ? isEn ? 'Collapse Solutions' : 'Thu gọn lời giải'
                        : isEn ? 'View All Solutions' : 'Xem toàn bộ lời giải'}
                    </span>
                    {isMasterSolutionExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
              </div>

              {isMasterSolutionExpanded && (
                <div className="space-y-6 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {isEn
                          ? `Detailed Solutions (${activeExam.questions.length} questions)`
                          : `Lời Giải Chi Tiết Từng Câu Hỏi (${activeExam.questions.length} câu)`}
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500">
                      {isEn ? `Official key · ${activeExam.school}` : `Chuẩn đáp án · ${activeExam.school}`}
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
                            <span>{isEn ? 'Copy solution' : 'Sao chép lời giải'}</span>
                          </button>
                        </div>

                        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          <FormattedText text={q.solution} />
                        </div>

                        {q.keyFormulasOrHints && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400">
                              {isEn ? 'Key formulas:' : 'Công thức chốt:'}
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

              <div className="flex justify-start pt-2">
                <button
                  onClick={handleCloseExam}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isEn ? 'Back to exam list' : 'Quay lại danh sách đề'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('nav.back_home', 'Quay lại Lớp học', 'Back to Classroom')}</span>
                  </button>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 tabular-nums">
                  {isEn
                    ? `${totalExams} Official Exam Bank`
                    : `Ngân Hàng ${totalExams} Đề Thi Quốc Gia`}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                  {isEn
                    ? `${countChuyen} Specialized & ${countKhongChuyen} Standard Exams`
                    : `Phân định rõ ràng: ${countChuyen} Đề Chuyên & ${countKhongChuyen} Đề Không Chuyên`}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isEn
                  ? 'Specialized & High School Exam Library (Full Papers + AI Photo Grading)'
                  : 'Thư Viện Đề Thi Chuyên & Tốt Nghiệp THPT (Full Đề + AI Chấm Ảnh)'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isEn
                  ? 'Complete exam papers with built-in timer, handwritten photo submission, instant AI grading (0–10), and follow-up Q&A.'
                  : 'Tất cả đề đều đầy đủ câu hỏi, tích hợp đồng hồ bấm giờ, nộp ảnh bài làm để AI chấm điểm và giải đáp thắc mắc ngay.'}
              </p>
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={isEn ? 'Search school, exam title, topic...' : 'Tìm trường, từ khóa đề thi...'}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Track Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTrack('all')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all border ${
                selectedTrack === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="tabular-nums">
                {isEn ? `All Tracks (${totalExams} exams)` : `Tất cả lĩnh vực (${totalExams} đề)`}
              </span>
            </button>

            <button
              onClick={() => setSelectedTrack('chuyen')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all border ${
                selectedTrack === 'chuyen'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-500 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="tabular-nums">
                {isEn
                  ? `1. Specialized & Olympiad (${countChuyen})`
                  : `1. Đề Chuyên & Olympic (${countChuyen} đề)`}
              </span>
            </button>

            <button
              onClick={() => setSelectedTrack('khong_chuyen')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all border ${
                selectedTrack === 'khong_chuyen'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="tabular-nums">
                {isEn
                  ? `2. Standard & National Exam (${countKhongChuyen})`
                  : `2. Đề Không Chuyên & Tốt Nghiệp (${countKhongChuyen} đề)`}
              </span>
            </button>
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedSubject === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isEn ? 'All Subjects' : 'Tất cả môn'}
            </button>
            <button
              onClick={() => setSelectedSubject('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedSubject === 'math'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="tabular-nums">
                {isEn
                  ? `Mathematics (${subjectStats.math.total}: ${subjectStats.math.chuyen} Spec + ${subjectStats.math.khongChuyen} Std)`
                  : `Toán Học (${subjectStats.math.total} đề: ${subjectStats.math.chuyen} Chuyên + ${subjectStats.math.khongChuyen} THPT)`}
              </span>
            </button>
            <button
              onClick={() => setSelectedSubject('physics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedSubject === 'physics'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="tabular-nums">
                {isEn
                  ? `Physics (${subjectStats.physics.total}: ${subjectStats.physics.chuyen} Spec + ${subjectStats.physics.khongChuyen} Std)`
                  : `Vật Lý (${subjectStats.physics.total} đề: ${subjectStats.physics.chuyen} Chuyên + ${subjectStats.physics.khongChuyen} THPT)`}
              </span>
            </button>
            <button
              onClick={() => setSelectedSubject('cs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedSubject === 'cs'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className="tabular-nums">
                {isEn
                  ? `Computer Science (${subjectStats.cs.total}: ${subjectStats.cs.chuyen} Spec + ${subjectStats.cs.khongChuyen} Std)`
                  : `Tin Học (${subjectStats.cs.total} đề: ${subjectStats.cs.chuyen} Chuyên + ${subjectStats.cs.khongChuyen} Cơ bản)`}
              </span>
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
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        exam.track === 'chuyen'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {exam.track === 'chuyen'
                        ? isEn ? 'Specialized' : 'Đề Chuyên'
                        : isEn ? 'Standard' : 'Không Chuyên'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {exam.timeMinutes} {isEn ? 'min' : 'phút'}
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                      {exam.school}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {exam.title}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    <FormattedText text={exam.featuredSnippet} />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      {isEn
                        ? `Full ${exam.questions.length} Qs`
                        : `Full ${exam.questions.length} câu hỏi`}
                    </span>
                    {exam.topics.slice(0, 2).map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  <span>{isEn ? 'Open Exam & AI Photo Grading' : 'Mở full đề · tính giờ & AI chấm'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="p-12 text-center bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isEn ? 'No matching exam papers found' : 'Không tìm thấy đề thi phù hợp'}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? 'Try switching the track filter or clearing your search keywords.'
                  : 'Hãy thử chọn bộ lọc lĩnh vực khác hoặc xóa từ khóa tìm kiếm.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
