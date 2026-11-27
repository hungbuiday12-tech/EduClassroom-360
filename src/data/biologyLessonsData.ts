import { BiologyLesson } from '../types';
import { BIOLOGY_GDPT_2018_LESSONS } from './biologyGdpt2018Lessons';
import { BIOLOGY_GDPT_2018_EXTRA_LESSONS } from './biologyGdpt2018ExtraLessons';
import { BIOLOGY_GDPT_2006_LESSONS } from './biologyGdpt2006Lessons';
import { BIOLOGY_GDPT_2006_EXTRA_LESSONS } from './biologyGdpt2006ExtraLessons';
import { BIOLOGY_CHUYEN_LESSONS } from './biologyChuyenLessons';
import { BIOLOGY_CHUYEN_EXTRA_LESSONS } from './biologyChuyenExtraLessons';
import { BIOLOGY_SYLLABUS_MODULES } from './biologySyllabusModules';
import { BIOLOGY_MIDDLE_SCHOOL_LESSONS } from './biologyMiddleSchoolLessons';

export const BIOLOGY_LESSONS: BiologyLesson[] = [
  ...BIOLOGY_MIDDLE_SCHOOL_LESSONS,
  ...BIOLOGY_GDPT_2018_LESSONS,
  ...BIOLOGY_GDPT_2018_EXTRA_LESSONS,
  ...BIOLOGY_GDPT_2006_LESSONS,
  ...BIOLOGY_GDPT_2006_EXTRA_LESSONS,
  ...BIOLOGY_CHUYEN_LESSONS,
  ...BIOLOGY_CHUYEN_EXTRA_LESSONS,
  ...BIOLOGY_SYLLABUS_MODULES
];
