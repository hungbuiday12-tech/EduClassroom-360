import { ChemistryLesson } from '../types';
import { CHEMISTRY_MS_2018_LESSONS } from './chemistryMS2018';
import { CHEMISTRY_MS_2006_LESSONS } from './chemistryMS2006';

// Chương trình Hóa học THCS Lớp 6, 7, 8 — Đầy đủ 2 hệ (28 bài):
// 1. GDPT 2018 (khong_chuyen · KHTN 6, 7, 8 Phần Chất và Sự biến đổi của chất — 16 bài)
// 2. GDPT 2006 (gdpt_2006 · Cầu nối Lớp 6–7 + Trọn 6 Chương SGK Hóa học 8 — 12 bài)
export const CHEMISTRY_MIDDLE_SCHOOL_LESSONS: ChemistryLesson[] = [
  ...CHEMISTRY_MS_2018_LESSONS,
  ...CHEMISTRY_MS_2006_LESSONS
];
