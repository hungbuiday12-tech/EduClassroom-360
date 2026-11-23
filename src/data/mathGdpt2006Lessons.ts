import { MathLecture } from '../types';
import { MATH_GDPT_2006_GRADE_9 } from './mathGdpt2006Grade9';
import { MATH_GDPT_2006_GRADE_10 } from './mathGdpt2006Grade10';
import { MATH_GDPT_2006_GRADE_11 } from './mathGdpt2006Grade11';
import { MATH_GDPT_2006_GRADE_12 } from './mathGdpt2006Grade12';

// Chương trình Toán GDPT 2006 (Không chuyên · Sách Giáo Khoa NXB Giáo dục Việt Nam 2006)
// Đầy đủ 80 bài học across 4 khối Lớp 9 (18) · Lớp 10 (20) · Lớp 11 (22) · Lớp 12 (20)
// Mỗi bài đều tích hợp Mô phỏng 2D (Grapher/Geometry) và Mô phỏng 3D tương tác
export const MATH_GDPT_2006_LESSONS: MathLecture[] = [
  ...MATH_GDPT_2006_GRADE_9,
  ...MATH_GDPT_2006_GRADE_10,
  ...MATH_GDPT_2006_GRADE_11,
  ...MATH_GDPT_2006_GRADE_12,
];
