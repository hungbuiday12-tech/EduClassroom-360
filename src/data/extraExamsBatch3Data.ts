import { ExamPaper } from '../types';
import { buildMathChuyenBatch3, buildMathStandardBatch3 } from './extraExamsBatch3Math';
import { buildPhysicsChuyenBatch3, buildPhysicsStandardBatch3 } from './extraExamsBatch3Physics';
import { buildCSChuyenBatch3, buildCSStandardBatch3 } from './extraExamsBatch3CS';

export const EXTRA_EXAM_PAPERS_BATCH_3: ExamPaper[] = [
  ...buildMathChuyenBatch3(),
  ...buildMathStandardBatch3(),
  ...buildPhysicsChuyenBatch3(),
  ...buildPhysicsStandardBatch3(),
  ...buildCSChuyenBatch3(),
  ...buildCSStandardBatch3()
];
