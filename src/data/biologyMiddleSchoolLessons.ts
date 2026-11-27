import { BiologyLesson } from '../types';
import { BIOLOGY_MS_2018_LESSONS } from './biologyMS2018';
import { BIOLOGY_MS_2006_LESSONS } from './biologyMS2006';
import { BIOLOGY_MS_EXTRA_LESSONS } from './biologyMiddleSchoolExtraLessons';

// Chương trình Sinh học THCS Lớp 6, 7, 8 — Đầy đủ 2 hệ (54 bài):
// 1. GDPT 2018 (khong_chuyen · KHTN 6, 7, 8 Phần Vật sống — 27 bài)
// 2. GDPT 2006 (gdpt_2006 · SGK Sinh học 6, 7, 8 — 27 bài)
export const BIOLOGY_MIDDLE_SCHOOL_LESSONS: BiologyLesson[] = [
  ...BIOLOGY_MS_2018_LESSONS,
  ...BIOLOGY_MS_2006_LESSONS,
  ...BIOLOGY_MS_EXTRA_LESSONS
];
