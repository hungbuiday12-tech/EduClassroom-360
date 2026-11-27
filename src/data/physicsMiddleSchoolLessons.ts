import { PhysicsLesson } from '../types';
import { PHYSICS_MS_2018_LESSONS } from './physicsMS2018';
import { PHYSICS_MS_2006_LESSONS } from './physicsMS2006';
import { PHYSICS_MS_EXTRA_LESSONS } from './physicsMiddleSchoolExtraLessons';

// Chương trình Vật lí THCS Lớp 6, 7, 8 — Đầy đủ 2 hệ (54 bài):
// 1. GDPT 2018 (khong_chuyen · KHTN 6, 7, 8 Phần Vật lí — 27 bài)
// 2. GDPT 2006 (gdpt_2006 · SGK Vật lí 6, 7, 8 — 27 bài)
export const PHYSICS_MIDDLE_SCHOOL_LESSONS: PhysicsLesson[] = [
  ...PHYSICS_MS_2018_LESSONS,
  ...PHYSICS_MS_2006_LESSONS,
  ...PHYSICS_MS_EXTRA_LESSONS
];
