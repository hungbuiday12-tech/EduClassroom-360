import { PhysicsLesson } from '../types';
import { PHYSICS_GDPT_2006_GRADE_9 } from './physicsGdpt2006Grade9';
import { PHYSICS_GDPT_2006_GRADE_10 } from './physicsGdpt2006Grade10';
import { PHYSICS_GDPT_2006_GRADE_11 } from './physicsGdpt2006Grade11';
import { PHYSICS_GDPT_2006_GRADE_12 } from './physicsGdpt2006Grade12';

// Chương trình Vật lí GDPT 2006 (Không chuyên · Sách Giáo Khoa NXB Giáo dục Việt Nam 2006)
// Đầy đủ 80 bài học across 4 khối Lớp 9 (18) · Lớp 10 (20) · Lớp 11 (20) · Lớp 12 (22)
// Mỗi bài đều gắn sẵn Mô phỏng 2D và Mô phỏng 3D tương tác từ SIM_PRESETS
export const PHYSICS_GDPT_2006_LESSONS: PhysicsLesson[] = [
  ...PHYSICS_GDPT_2006_GRADE_9,
  ...PHYSICS_GDPT_2006_GRADE_10,
  ...PHYSICS_GDPT_2006_GRADE_11,
  ...PHYSICS_GDPT_2006_GRADE_12,
];
