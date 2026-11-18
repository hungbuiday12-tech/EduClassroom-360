export type SubjectType = 'overview' | 'roadmap' | 'synapse_v2' | 'spatial_3d' | 'math' | 'math_sims' | 'physics' | 'physics_sims' | 'cs' | 'cs_sims' | 'exams' | 'arena' | 'forum' | 'growth_hub' | 'showcase' | 'future_lab';

export type ForumSubject = 'announcements' | 'general' | 'math' | 'physics' | 'cs' | 'exams';

export interface ForumGroup {
  id: string;
  name: string;
  description: string;
  subject: ForumSubject;
  isMandatoryAdminGroup: boolean;
  creatorId: string;
  creatorName: string;
  creatorUsername?: string;
  messageCount: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface ForumMessage {
  id: string;
  groupId: string;
  isAdminGroup: boolean;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  senderAvatar?: string;
  senderRole: 'student' | 'teacher' | 'admin';
  content: string;
  createdAt: string;
}

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
  examCode?: string;
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
    basicTitle?: string;
    basicCode?: string;
    basicExplanation?: string;
    advancedTitle?: string;
    advancedCode?: string;
    advancedExplanation?: string;
    pythonBasicCode?: string;
    pythonAdvancedCode?: string;
  };
  keyTakeaway?: string;
  quickIntuition?: string;
  dryRunTrace?: {
    title: string;
    sampleInput: string;
    traceRows: string[];
    finalOutput: string;
  };
  commonMistakes?: string[];
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
  lessonNumber?: number;
  stageLabel?: string;
  sourceTag?: string;
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
    | 'integral_disks_3d'
    | 'circle_theorems_3d';
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
  | 'young_interference'
  | 'standing_wave'
  | 'doppler_effect'
  | 'photoelectric_effect'
  // +22 New 2D Physics Simulations
  | 'atwood_pulley'
  | 'inclined_plane'
  | 'momentum_collision'
  | 'torque_lever'
  | 'kepler_orbit'
  | 'damped_resonance'
  | 'beat_waves'
  | 'sound_intensity'
  | 'lissajous_shm'
  | 'coulomb_pendulum'
  | 'rc_capacitor'
  | 'wheatstone_bridge'
  | 'transformer_2d'
  | 'lc_oscillation'
  | 'prism_dispersion'
  | 'spherical_mirror'
  | 'malus_polarization'
  | 'hydrogen_spectrum'
  | 'pv_thermodynamics'
  | 'calorimetry_mixing'
  | 'bernoulli_flow'
  | 'nuclear_fission'
  // +18 New Batch-2 2D Physics Simulations
  | 'archimedes_buoyancy'
  | 'spring_oscillation_horizontal'
  | 'centrifuge_banked_curve'
  | 'planetary_escape_velocity'
  | 'single_slit_diffraction'
  | 'mach_shockwave'
  | 'coupled_oscillators_2d'
  | 'hall_effect'
  | 'cyclotron_accelerator'
  | 'electromagnet_crane'
  | 'diode_rectifier'
  | 'telescope_microscope'
  | 'thin_film_interference'
  | 'compton_scattering'
  | 'fiber_optic_tir'
  | 'carnot_cycle_pv'
  | 'thermal_conduction_bar'
  | 'binding_energy_curve';

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
  | 'young_interference_3d'
  | 'standing_wave_3d'
  | 'doppler_effect_3d'
  | 'photoelectric_3d'
  // +18 New 3D Physics Simulations
  | 'inclined_plane_3d'
  | 'collision_spheres_3d'
  | 'gyroscope_precession_3d'
  | 'kepler_orbit_3d'
  | 'simple_pendulum_3d'
  | 'coupled_pendulums_3d'
  | 'resonance_tubes_3d'
  | 'solenoid_field_3d'
  | 'electric_dipole_3d'
  | 'dc_motor_3d'
  | 'transformer_3d'
  | 'prism_dispersion_3d'
  | 'curved_mirror_3d'
  | 'polarization_3d'
  | 'blackbody_cavity_3d'
  | 'carnot_piston_3d'
  | 'nuclear_fission_3d'
  | 'rutherford_scattering_3d'
  // +16 New Batch-2 3D Physics Simulations
  | 'atwood_pulley_3d'
  | 'newtons_cradle_3d'
  | 'foucault_pendulum_3d'
  | 'transverse_longitudinal_3d'
  | 'lissajous_3d'
  | 'acoustic_interference_3d'
  | 'cyclotron_3d'
  | 'cathode_ray_tube_3d'
  | 'helmholtz_coils_3d'
  | 'electroscope_3d'
  | 'fiber_optic_3d'
  | 'compton_3d'
  | 'double_lens_microscope_3d'
  | 'diffusion_gases_3d'
  | 'brownian_motion_3d'
  | 'tokamak_fusion_3d';

export type PhysicsDomainId =
  | 'mechanics'
  | 'waves_osc'
  | 'electricity_mag'
  | 'optics_quantum'
  | 'thermal_nuclear';

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
    basicTitle?: string;
    basicCode?: string;
    basicExplanation?: string;
    advancedTitle?: string;
    advancedCode?: string;
    advancedExplanation?: string;
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
    basicAnalysis?: string;
    basicSolutionCpp?: string;
    basicSolutionPython?: string;
  };
}

export type TestDifficultyTier = 'Cơ bản' | 'Trung bình' | 'Nâng cao' | 'Thử thách';

export type ProblemIOMode = 'standard' | 'file';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample?: boolean;
  explanation?: string;
  difficulty?: TestDifficultyTier;
  timeLimitEnabled?: boolean;
  timeLimitMs?: number | null;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  timeLimit: string;
  timeLimitEnabled?: boolean;
  timeLimitMs?: number | null;
  ioMode?: ProblemIOMode;
  inputFileName?: string;
  outputFileName?: string;
  memoryLimit: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: TestCase[];
  hiddenCases: TestCase[];
  cppTemplate: string;
  pythonTemplate: string;
  basicSolutionCpp?: string;
  basicSolutionPython?: string;
  basicAnalysis?: string;
  advancedSolutionCpp?: string;
  advancedSolutionPython?: string;
  solutionAnalysis?: string;
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
  initialImageBase64?: string;
  initialImageMimeType?: string;
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
export type ArenaGradeGroup = '9' | '10' | '11' | '12' | 'olp';
export type ArenaTrack = 'khong_chuyen' | 'chuyen';
export type ArenaDivisionId =
  | '9k'
  | '9c'
  | '10k'
  | '10c'
  | '11k'
  | '11c'
  | '12k'
  | '12c'
  | 'olp';

export interface ArenaDivisionMeta {
  id: ArenaDivisionId;
  gradeGroup: ArenaGradeGroup;
  track: ArenaTrack;
  labelVi: string;
  labelEn: string;
  shortLabelVi: string;
  shortLabelEn: string;
  descriptionVi: string;
  descriptionEn: string;
  badgeColor: string;
}

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
  division?: ArenaDivisionId;
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
  division?: ArenaDivisionId;
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

// ============================================================================
// GROWTH SUITE: ERROR NOTEBOOK, SM-2 FLASHCARDS, QUESTS, BADGES, SHOWCASE
// ============================================================================

export type GrowthSubject = 'math' | 'physics' | 'cs';

export interface ErrorNotebookEntry {
  id: string;
  subject: GrowthSubject;
  sourceType: 'lecture_mcq' | 'lecture_essay' | 'cs_judge' | 'mock_test';
  lessonKey?: string;
  lessonTitle: string;
  stepTitle?: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  resolved: boolean;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardSM2Item {
  id: string;
  subject: GrowthSubject;
  topic: string;
  front: string;
  back: string;
  tip?: string;
  sourceErrorId?: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: string;
  lastReviewedAt?: string;
  createdAt: string;
}

export interface DailyQuestItem {
  id: 'focus_pomodoro' | 'practice_quiz_or_code' | 'review_errors_or_cards';
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  target: number;
  progress: number;
  xpReward: number;
  claimed: boolean;
}

export interface StemBadge {
  id: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
  unlockedAt?: string;
  progressText: string;
}

export interface LearningStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activeDates: string[];
  dailyQuestsDate: string;
  dailyQuests: DailyQuestItem[];
  stats: {
    pomodoroCompleted: number;
    mcqCorrectCount: number;
    codeAcceptedCount: number;
    flashcardsReviewed: number;
    errorsResolved: number;
    mockTestsCompleted: number;
    customLessonsCreated: number;
    showcasePublished: number;
  };
}

export interface CustomGeneratedLesson {
  id: string;
  subject: GrowthSubject;
  grade: string;
  title: string;
  description: string;
  sourceSummary: string;
  keyFormulas: string[];
  steps: LectureStep[];
  createdAt: string;
}

export type ShowcaseCategory = '3d_model' | '2d_canvas' | 'cs_algo';

export interface CommunityShowcaseItem {
  id: string;
  category: ShowcaseCategory;
  subject: GrowthSubject;
  title: string;
  description: string;
  authorName: string;
  authorHandle?: string;
  tags: string[];
  likes: number;
  likedByMe?: boolean;
  previewImageDataUrl?: string;
  payload3dModel?: any;
  payloadCode?: {
    language: CodeLanguage;
    code: string;
    complexity?: string;
  };
  payload2dMeta?: {
    modeId: string;
    shapeCount: number;
    caption?: string;
  };
  createdAt: string;
}

export interface CustomMockQuestionItem {
  id: string;
  subject: GrowthSubject;
  topic: string;
  grade: string;
  isWeakTopic: boolean;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CustomMockTestResult {
  id: string;
  title: string;
  subjects: GrowthSubject[];
  score10: number;
  correctCount: number;
  totalCount: number;
  durationUsedSec: number;
  tabSwitchWarnings: number;
  topicBreakdown: { topic: string; correct: number; total: number }[];
  completedAt: string;
}

export type FutureLabTabId =
  | 'megastructures'
  | 'galaxy3d'
  | 'text_to_sim'
  | 'paper_to_sim'
  | 'infinite_canvas'
  | 'audio_fft'
  | 'silicon_neural'
  | 'phone_sensor_lab'
  | 'dual_hand_sandbox'
  | 'cannon_ballistics_3d'
  | 'rocket_launch_3d'
  | 'jet_engine_3d'
  | 'four_d_lectures'
  | 'robotics_ik_3d';

export type PaperSimKind =
  | 'parabola'
  | 'trig_wave'
  | 'projectile'
  | 'pendulum'
  | 'spring'
  | 'incline'
  | 'oxyz_solid';

export interface PaperToSimParam {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export interface PaperToSimResult {
  detectedSubject: 'math' | 'physics';
  title: string;
  detectedFormula: string;
  simKind: PaperSimKind;
  summary: string;
  params: PaperToSimParam[];
  stepsCheck: { line: string; status: 'ok' | 'warning' | 'error'; note: string }[];
}

export type SimEngineKind =
  | 'collision_1d'
  | 'incline_forces'
  | 'wave_standing'
  | 'projectile_drag'
  | 'optics_lens'
  | 'math_tangent';

export interface GeneratedSimConfig {
  engine: SimEngineKind;
  title: string;
  summary: string;
  formulaLatex: string;
  parameters: PaperToSimParam[];
  notes: string[];
}

export type InfiniteNodeKind = 'graph' | 'solid3d' | 'formula' | 'code' | 'note';

export interface InfiniteCanvasNode {
  id: string;
  kind: InfiniteNodeKind;
  x: number;
  y: number;
  width: number;
  title: string;
  accent: 'sky' | 'amber' | 'emerald' | 'violet' | 'rose';
  content: string;
  paramA?: number;
  paramB?: number;
  graphType?: 'quadratic' | 'sine' | 'cubic';
  solidKind?: 'cube' | 'octahedron' | 'helix';
}

export interface InfiniteCanvasEdge {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}

export interface VoiceOSActionPlan {
  replyVi: string;
  actionType:
    | 'navigate'
    | 'navigate_future'
    | 'navigate_monument'
    | 'navigate_math_sim'
    | 'set_background'
    | 'toggle_theme'
    | 'timer'
    | 'open_tutor'
    | 'answer_qa'
    | 'none';
  targetSubject?: SubjectType;
  targetMathTab?: 'grapher' | 'geometry' | 'math3d';
  targetFutureTab?: FutureLabTabId;
  targetMonumentId?: string;
  bgStyle?: string;
  darkMode?: boolean;
  timerAction?: 'start' | 'pause' | 'reset';
  tutorSubject?: 'math' | 'physics' | 'cs';
  tutorQuestion?: string;
  formulaHighlight?: string;
  confidence?: number;
}
