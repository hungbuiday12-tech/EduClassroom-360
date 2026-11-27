// Lightweight precomputed counts so shell views (VisitorLandingPage, ClassroomOverview, Header/Footer, AuthModal)
// never force bundling 3+ MB of curriculum & exam data arrays into the initial entry chunk.
export const CURRICULUM_COUNTS = {
  totalExams: 1750,
  chuyenExams: 875,
  standardExams: 875,
  mathLectures: 219,
  physicsLessons: 219,
  chemistryLessons: 184,
  biologyLessons: 121,
  csLessons: 22,
  defaultMathLectureId: 'math-9-1',
  defaultPhysicsLessonId: 'phys-9-mech-heat',
  defaultChemistryLessonId: 'chem-9-1',
  defaultBiologyLessonId: 'bio-9-1',
  get totalLessons() {
    return (
      this.mathLectures +
      this.physicsLessons +
      this.chemistryLessons +
      this.biologyLessons +
      this.csLessons
    );
  }
} as const;
