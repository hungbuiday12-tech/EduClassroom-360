export type SubjectType = 'overview' | 'math' | 'physics' | 'cs' | 'exams';

export type ExamSubject = 'math' | 'physics' | 'cs';

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
  subjectTag: string; // e.g. "Toán 9-10", "Vật Lý 9", "Tin Học Chuyên"
  categoryTag: string; // e.g. "Tuyển Sinh Chuyên", "Khảo Sát Chất Lượng", "Olympic 30/4", "HSG Quốc Gia"
  academicYear: string; // e.g. "2025-2026", "2024-2025"
  title: string;
  school: string;
  source: string;
  timeMinutes: number;
  featuredSnippet: string;
  topics: string[];
  difficulty: 'Cơ bản' | 'Khá' | 'Nâng cao' | 'Chuyên / HSG';
  questions: ExamQuestion[];
  fullWordDocContent: string;
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
  category?: 'Giải tích' | 'Hình học' | 'Đại số & Xác suất' | 'Lượng giác & Mũ' | 'Số phức';
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
