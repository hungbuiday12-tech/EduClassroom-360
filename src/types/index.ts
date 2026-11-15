export type SubjectType = 'overview' | 'roadmap' | 'math' | 'physics' | 'cs' | 'exams' | 'arena';

export type ExamSubject = 'math' | 'physics' | 'cs';
export type ExamTrack = 'chuyen' | 'khong_chuyen';

export interface ExamQuestion {
  number: string;
  points?: string;
  content: string;
  solution: string;
  keyFormulasOrHints?: string[];
  simulationLink?: {
    type: 'math' | 'physics' | 'cs';
    targetId: string;
    label: string;
  };
}

export interface ExamPaper {
  id: string;
  subject: ExamSubject;
  track: ExamTrack; // 'chuyen' | 'khong_chuyen'
  subjectTag: string; // e.g. "Toán Chuyên", "Vật Lý 12", "Tin Học ĐHQG"
  categoryTag: string; // e.g. "Tuyển Sinh Chuyên", "Tốt Nghiệp THPT", "Đánh Giá Năng Lực"
  academicYear: string;
  title: string;
  school: string;
  source: string;
  timeMinutes: number;
  featuredSnippet: string;
  topics: string[];
  difficulty: 'Cơ bản' | 'Khá' | 'Nâng cao' | 'Chuyên / HSG';
  questions: ExamQuestion[];
  fullWordDocContent?: string;
}

export interface ExamQuestionBreakdownItem {
  questionNumber: string;
  earned: number;
  max: number;
  status: 'correct' | 'partial' | 'incorrect' | 'missing';
  comment: string;
}

export interface ExamImageEvaluation {
  score: number; // 0 - 10
  maxScore: number; // 10
  verdict: string;
  summary: string;
  questionBreakdown: ExamQuestionBreakdownItem[];
  strengths: string[];
  mistakes: string[];
  nextAdvice: string;
  gradedAt: string;
}

export interface ExamQAMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export interface StudentProgress {
  xp: number;
  completedProblems: string[];
  exploredSimulations: string[];
  notes: { id: string; title: string; content: string; date: string }[];
}

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  role: 'student' | 'teacher' | 'admin';
  xp: number;
  createdAt: string;
}

// Math Types
export type FunctionType =
  | 'linear'
  | 'quadratic'
  | 'cubic'
  | 'rational'
  | 'trig_sin'
  | 'trig_cos'
  | 'exponential'
  | 'logarithmic'
  | 'abs'
  | 'sqrt'
  | 'custom';

export interface FunctionPlotConfig {
  id: string;
  type: FunctionType;
  color: string;
  name: string;
  formulaDisplay: string;
  params: {
    a: number;
    b: number;
    c: number;
    d: number;
  };
  customExpr?: string;
  showTangent?: boolean;
  tangentX0?: number;
  showIntegral?: boolean;
  integralA?: number;
  integralB?: number;
  visible: boolean;
}

export type GeometryTool = 'select' | 'point' | 'segment' | 'circle' | 'triangle' | 'polygon';

export interface GeoPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  color?: string;
}

export interface GeoSegment {
  id: string;
  p1Id: string;
  p2Id: string;
  label?: string;
}

export interface GeoCircle {
  id: string;
  centerId: string;
  radiusPointId: string;
}

export type CurriculumTrack = 'khong_chuyen' | 'chuyen';
export type SpecializedTier = 'Cơ bản' | 'Nâng cao' | 'Chuyên / HSG';

export interface LectureStepMCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LectureStepMiniEssay {
  id: string;
  question: string;
  hint?: string;
  rubricChecklist: string[];
  sampleAnswer: string;
}

export interface LectureStepFormulaSection {
  primaryFormula?: string;
  secondaryFormulas?: string[];
  variablesNote?: string;
}

export interface LectureStep {
  stepTitle: string;
  stepType?: 'intuition' | 'concept' | 'derivation' | 'example' | 'pitfall' | 'experiment';
  conceptSection?: string;
  formulaSection?: LectureStepFormulaSection;
  deepDiveSection?: string;
  teacherExplanation: string;
  formulaHighlight?: string;
  workedExample?: {
    problem: string;
    steps: string[];
    answer: string;
  };
  codeSnippet?: {
    language: 'cpp' | 'python';
    title: string;
    code: string;
  };
  keyTakeaway?: string;
  miniQuiz?: LectureStepMCQ[];
  miniEssay?: LectureStepMiniEssay;
}

export interface LectureStepEvaluation {
  score: number; // 0 to 10
  maxScore: number; // 10
  isCorrectDirection: boolean;
  strengths: string[];
  mistakes: string[];
  feedback: string;
  gradedBy: 'ai' | 'self';
}

export interface LectureStepAiMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export interface LectureStepSavedResult {
  stepIndex: number;
  stepTitle: string;
  mcqAnswers: Record<number, number>;
  mcqChecked: Record<number, boolean>;
  mcqCorrectCount?: number;
  mcqCheckedCount?: number;
  essayAnswer: string;
  essayEvaluation?: LectureStepEvaluation;
  aiMessages?: LectureStepAiMessage[];
  customQuiz?: {
    miniQuiz: LectureStepMCQ[];
    miniEssay: LectureStepMiniEssay;
  };
  updatedAt: string;
}

export interface LessonRoadmapRecommendationItem {
  step: number;
  title: string;
  action: string;
  targetType: 'review_step' | 'sim_2d' | 'sim_3d' | 'ai_tutor' | 'next_lesson' | 'exams' | 'arena';
  stepIndex?: number;
}

export interface LessonProgressAnalysis {
  overallMastery: number;
  readinessLevel: string;
  summaryFeedback: string;
  strongPoints: string[];
  weakPoints: string[];
  recommendedRoadmap: LessonRoadmapRecommendationItem[];
  analyzedAt: string;
}

export interface LessonAssessmentRecord {
  lessonKey: string;
  subject: 'math' | 'physics' | 'cs';
  lessonTitle: string;
  grade?: string;
  totalSteps: number;
  stepResults: Record<number, LectureStepSavedResult>;
  analysis?: LessonProgressAnalysis;
  updatedAt: string;
}

export interface MathEssayProblem {
  source?: string;
  question: string;
  hints?: string[];
  solutionSteps: string[];
  finalAnswer: string;
}

export interface MathLecture {
  id: string;
  track?: CurriculumTrack;
  gradeGroup?: 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12' | 'Chuyên Toán';
  tier?: SpecializedTier;
  title: string;
  grade: string;
  category?: 'Giải tích' | 'Hình học' | 'Đại số & Xác suất' | 'Lượng giác & Mũ' | 'Số phức' | 'Đại số' | 'Số học & Tổ hợp';
  difficulty?: 'Cơ bản' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  readTimeMinutes?: number;
  description: string;
  mnemonics?: string[];
  commonTraps?: string[];
  theory: string[];
  lectureSteps?: LectureStep[];
  keyFormulas: string[];
  flashcards?: { front: string; back: string; tip?: string }[];
  sampleProblems: {
    source?: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    tip?: string;
  }[];
  essayProblems?: MathEssayProblem[];
  sim2dMode?: 'grapher' | 'geometry';
  sim3dMode?:
    | 'oxyz_vector'
    | 'sphere_plane'
    | 'pyramid_section'
    | 'revolution_solid'
    | 'conic_sections_3d'
    | 'line_plane_oxyz'
    | 'integral_disks_3d';
  defaultGraphConfig?: Partial<FunctionPlotConfig>;
}

// Physics Types
export type PhysicsSimType =
  | 'ohm_circuit'
  | 'lens_optics'
  | 'projectile_motion'
  | 'free_fall_energy'
  | 'light_refraction'
  | 'magnetic_induction'
  | 'spring_pendulum'
  | 'simple_pendulum'
  | 'wave_interference'
  | 'kinematics_graphs'
  | 'thermal_gas'
  | 'electric_field'
  | 'nuclear_decay'
  | 'circular_motion'
  | 'ac_rlc_circuit'
  | 'young_interference';

export type Physics3DMode =
  | 'pendulum_spring'
  | 'projectile_3d'
  | 'lorentz_helix'
  | 'wave_ripple'
  | 'bohr_atom'
  | 'optics_3d'
  | 'kinematics_3d'
  | 'thermal_gas_3d'
  | 'circular_motion_3d'
  | 'ac_generator_3d'
  | 'young_interference_3d';

export interface PhysicsEssayExercise {
  id?: string;
  source?: string;
  question: string;
  hints?: string[];
  solutionSteps: string[];
  finalAnswer: string;
}

export interface PhysicsLesson {
  id: string;
  track: CurriculumTrack;
  grade: 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
  tier?: SpecializedTier;
  stageLabel?: string;
  sourceTag?: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  description: string;
  theorySections: {
    heading: string;
    content: string;
  }[];
  lectureSteps?: LectureStep[];
  keyFormulas: string[];
  simulationType: PhysicsSimType;
  sim3dType: Physics3DMode;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, { min: number; max: number; step: number; unit: string; label: string }>;
  practiceExercises: {
    source?: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    stepByStep?: string[];
  }[];
  essayExercises: PhysicsEssayExercise[];
}

// Retain PhysicsExperiment for backwards compatibility
export interface PhysicsExperiment {
  id: PhysicsSimType;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  keyConcepts: string[];
  defaultParams: Record<string, number>;
  paramBounds: Record<string, { min: number; max: number; step: number; unit: string; label: string }>;
  theoryMarkdown: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

// Computer Science Types
export type CodeLanguage = 'cpp' | 'python';
export type CSLevel = 'Cơ bản' | 'Trung cấp' | 'Nâng cao / HSG';
export type VNOIPhase =
  | 'Phase 0 · Nhập môn & Độ phức tạp'
  | 'Phase 1 · Cơ bản & Số học sơ cấp'
  | 'Phase 2 · Kỹ thuật tối ưu kinh điển'
  | 'Phase 3 · Quy hoạch động & Đồ thị'
  | 'Phase 4 · Cấu trúc dữ liệu & HSG';

export interface CSLesson {
  id: string;
  level: CSLevel;
  vnoiPhase?: VNOIPhase;
  vnoiTag?: string;
  prerequisites?: string[];
  lessonNumber: number;
  title: string;
  topic: string;
  estimatedMinutes: number;
  theory: string[];
  lectureSteps?: LectureStep[];
  complexity: {
    time: string;
    space: string;
  };
  codeExamples: {
    language: 'cpp' | 'python';
    title: string;
    code: string;
    explanation: string;
  }[];
  practiceProblem: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    inputFormat: string;
    outputFormat: string;
    sampleCases: { input: string; output: string; explanation?: string }[];
    solutionAnalysis: string;
    fullSolutionCpp: string;
    fullSolutionPython: string;
  };
}

export type TestDifficultyTier = 'Cơ bản' | 'Trung bình' | 'Nâng cao' | 'Thử thách';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
  explanation?: string;
  difficulty?: TestDifficultyTier;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: TestCase[];
  hiddenCases: TestCase[];
  cppTemplate: string;
  pythonTemplate: string;
}

export interface TestResult {
  testId: number;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  runtimeMs: number;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  difficulty?: TestDifficultyTier;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  language: CodeLanguage;
  passedCount: number;
  totalCount: number;
  score: number;
  status: 'Accepted' | 'Partial' | 'Wrong Answer';
  submittedAt: string;
}

// Learning Process Roadmap Types
export interface WorkflowStage {
  stepNumber: number;
  id: 'concept' | 'simulate' | 'tutor' | 'practice' | 'arena';
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  actionChecklistVi: string[];
  actionChecklistEn: string[];
  targetSubject: SubjectType;
  estimatedMinutes: number;
}

export interface RoadmapNode {
  id: string;
  subject: 'math' | 'physics' | 'cs';
  grade: 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao / HSG';
  order: number;
  title: string;
  titleEn: string;
  goal: string;
  goalEn: string;
  prerequisites: string[];
  estimatedMinutes: number;
  targetLessonId?: string;
  workflowTips: string[];
  checkQuestions: string[];
}

// Socratic AI Tutor & 3-Mode Multi-Subject AI Types
export type AITutorMode = 'explain_no_answer' | 'full_solution' | 'diagnostic_roadmap';

export interface TutorMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: string;
  imagePreview?: string;
}

export interface TutorContextPayload {
  subject: SubjectType;
  mode?: AITutorMode;
  topicTitle?: string;
  problemStatement?: string;
  grade?: string;
}

export interface DiagnosticQuestion {
  id: string;
  category: 'knowledge' | 'specialization';
  topicTag: string;
  question: string;
  options: string[];
  correctIndex?: number; // present for 'knowledge' questions
}

export interface PersonalizedRoadmapStage {
  step: number;
  phase: string;
  title: string;
  durationWeeks: number;
  dailyMinutes: number;
  focusTopics: string[];
  recommendedModule: 'math' | 'physics' | 'cs' | 'exams' | 'arena' | 'roadmap';
  concreteTasks: string[];
  targetMilestone: string;
}

export interface PersonalizedRoadmapResult {
  subject: 'math' | 'physics' | 'cs';
  grade: string;
  targetMajor: string;
  estimatedLevel: string;
  knowledgeScore: number;
  knowledgeCorrect: number;
  knowledgeTotal: number;
  strengths: string[];
  weaknesses: string[];
  majorAdvice: string;
  dailyScheduleSummary: string;
  stages: PersonalizedRoadmapStage[];
  createdAt: string;
}

// Weekly Online Competition Arena Types
export type ArenaSubject = 'math' | 'physics' | 'cs';
export type ArenaMode = 'mcq' | 'essay';

export interface ArenaQuestionMCQ {
  id: string;
  subject: ArenaSubject;
  grade: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface ArenaEssayPrompt {
  id: string;
  subject: ArenaSubject;
  grade: string;
  title: string;
  prompt: string;
  rubricChecklist: string[];
  referenceSolution: string;
  sampleCode?: {
    language: CodeLanguage;
    starter: string;
    tests: { input: string; expectedOutput: string }[];
  };
  maxScore: number;
}

export interface ArenaEssayEvaluation {
  score: number;
  strengths: string[];
  mistakes: string[];
  stepScores: { criterion: string; earned: number; max: number; comment: string }[];
  detailedFeedback: string;
  suggestedStudyTip: string;
}

export interface ArenaAttempt {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  weekId: string;
  dateKey: string;
  subject: ArenaSubject;
  mode: ArenaMode;
  score: number; // 0 - 100
  correctCount?: number;
  totalQuestions?: number;
  durationSec: number;
  summary: string;
  createdAt: string;
}

export interface WeeklyLeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  weekId: string;
  mathBest: number | null;
  mathAvg: number | null;
  mathAttempts: number;
  physicsBest: number | null;
  physicsAvg: number | null;
  physicsAttempts: number;
  csBest: number | null;
  csAvg: number | null;
  csAttempts: number;
  overallAvg: number;
  totalAttempts: number;
  totalTimeSec: number;
  updatedAt: string;
}

