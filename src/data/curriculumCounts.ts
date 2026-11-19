// Lightweight precomputed counts so shell views (VisitorLandingPage, ClassroomOverview, Header/Footer, AuthModal)
// never force bundling 3+ MB of curriculum & exam data arrays into the initial entry chunk.
export const CURRICULUM_COUNTS = {
  totalExams: 450,
  chuyenExams: 225,
  standardExams: 225,
  mathLectures: 112,
  physicsLessons: 107,
  csLessons: 12,
  defaultMathLectureId: 'math-9-1',
  defaultPhysicsLessonId: 'phys-9-mech-heat',
  get totalLessons() {
    return this.mathLectures + this.physicsLessons + this.csLessons;
  }
} as const;
