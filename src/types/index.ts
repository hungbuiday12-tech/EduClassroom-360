export type SubjectType = 'overview' | 'math' | 'physics' | 'cs' | 'literature';

export interface StudentProgress {
  xp: number;
  completedProblems: string[];
  exploredSimulations: string[];
  graphedFunctions: number;
  notes: { id: string; title: string; content: string; date: string }[];
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
  description: string;
  theory: string[];
  keyFormulas: string[];
  sampleProblems: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  defaultGraphConfig?: Partial<FunctionPlotConfig>;
}

// Physics Types
export type PhysicsSimType = 'spring_pendulum' | 'simple_pendulum' | 'light_refraction' | 'projectile_motion' | 'wave_interference';

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

// Literature Types
export interface LiteratureWork {
  id: string;
  title: string;
  author: string;
  period: string;
  genre: string;
  summary: string;
  mindmap: {
    id: string;
    label: string;
    description: string;
    children?: {
      id: string;
      label: string;
      description: string;
      children?: { id: string; label: string; description: string }[];
    }[];
  };
  goldenQuotes: {
    quote: string;
    context: string;
    analysis: string;
  }[];
  analysisQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    guide: string;
  }[];
}
