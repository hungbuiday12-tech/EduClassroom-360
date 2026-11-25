import { BiologyLesson } from '../types';
import { BIOLOGY_GDPT_2018_LESSONS } from './biologyGdpt2018Lessons';
import { BIOLOGY_GDPT_2006_LESSONS } from './biologyGdpt2006Lessons';
import { BIOLOGY_CHUYEN_LESSONS } from './biologyChuyenLessons';

export const BIOLOGY_LESSONS: BiologyLesson[] = [
  ...BIOLOGY_GDPT_2018_LESSONS,
  ...BIOLOGY_GDPT_2006_LESSONS,
  ...BIOLOGY_CHUYEN_LESSONS
];
