import { ExamPaper } from '../types';
import { buildMathChuyenBatch4, buildMathStandardBatch4 } from './extraExamsBatch4Math';
import { buildPhysicsChuyenBatch4, buildPhysicsStandardBatch4 } from './extraExamsBatch4Physics';
import { buildCSChuyenBatch4, buildCSStandardBatch4 } from './extraExamsBatch4CS';

export const EXTRA_EXAM_PAPERS_BATCH_4: ExamPaper[] = [
  ...buildMathChuyenBatch4(),
  ...buildMathStandardBatch4(),
  ...buildPhysicsChuyenBatch4(),
  ...buildPhysicsStandardBatch4(),
  ...buildCSChuyenBatch4(),
  ...buildCSStandardBatch4()
];
