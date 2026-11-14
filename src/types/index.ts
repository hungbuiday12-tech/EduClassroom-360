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
export type FunctionType = 'linear' | 'quadratic' | 'cubic' | 'rational' | 'trig_sin' | 'trig_cos' | 'exponential' | 'custom';

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

export interface MathLecture {
  id: string;
  title: string;
  grade: string;
  category?: 'Giải tích' | 'Hình học' | 'Đại số & Xác suất' | 'Lượng giác & Mũ' | 'Số phức' | 'Đại số';
  difficulty?: 'Cơ bản' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  readTimeMinutes?: number;
  description: string;
  mnemonics?: string[];
  commonTraps?: string[];
  theory: string[];
  keyFormulas: string[];
  flashcards?: { front: string; back: string; tip?: string }[];
  sampleProblems: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    tip?: string;
  }[];
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
  | 'wave_interference';

export interface PhysicsLesson {
  id: string;
  grade: 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
  lessonNumber: number;
  title: string;
  subtitle: string;
  description: string;
  theorySections: {
    heading: string;
    content: string;
  }[];
  keyFormulas: string[];
  simulationType: PhysicsSimType;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, { min: number; max: number; step: number; unit: string; label: string }>;
  practiceExercises: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    stepByStep?: string[];
  }[];
  phetSim?: {
    slug: string;
    title: string;
    subtitle: string;
    experimentTasks: string[];
  };
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

export interface CSLesson {
  id: string;
  level: CSLevel;
  lessonNumber: number;
  title: string;
  topic: string;
  estimatedMinutes: number;
  theory: string[];
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

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
  explanation?: string;
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

