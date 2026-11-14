import { LectureStep, MathLecture, PhysicsLesson } from '../types';
import { PHYSICS_CUSTOM_LECTURE_STEPS } from './physicsLectureSteps';

export function buildPhysicsLectureSteps(lesson: PhysicsLesson): LectureStep[] {
  const custom = PHYSICS_CUSTOM_LECTURE_STEPS[lesson.id];

  // If custom authored lecture steps exist, also append worked example if not already included
  if (custom && custom.length > 0) {
    const firstEssay = lesson.essayExercises?.[0];
    if (firstEssay && !custom.some((s) => s.workedExample)) {
      return [
        ...custom.slice(0, -1),
        {
          stepTitle: `Ví dụ mẫu giải chi tiết: ${firstEssay.source || 'Bài toán trọng tâm'}`,
          stepType: 'example',
          teacherExplanation:
            'Trước khi tự làm bài tập cuối bài, thầy/cô hướng dẫn em giải trọn vẹn một bài toán điển hình từ dữ kiện đề bài đến bước kiểm tra đơn vị hệ SI:',
          workedExample: {
            problem: firstEssay.question,
            steps: firstEssay.solutionSteps,
            answer: firstEssay.finalAnswer
          },
          keyTakeaway:
            firstEssay.hints?.[0] ||
            'Luôn tóm tắt giả thiết bằng ký hiệu vật lí và đổi toàn bộ đại lượng về đơn vị chuẩn SI trước khi thay số.'
        },
        custom[custom.length - 1]
      ];
    }
    return custom;
  }

  const steps: LectureStep[] = [];

  // Step 1: Intuition & Objective
  steps.push({
    stepTitle: `Đặt vấn đề & Mục tiêu bài học: ${lesson.title.split(':')[0]}`,
    stepType: 'intuition',
    teacherExplanation: `${lesson.subtitle}\n\n${lesson.description}\n\n• **Phạm vi chương trình**: ${
      lesson.track === 'chuyen'
        ? `Khu Chuyên Lí (${lesson.tier || 'Nâng cao'}) · ${lesson.grade}`
        : `Chương trình GDPT 2018 · ${lesson.grade}`
    }\n• **Mục tiêu sau buổi giảng**: Hiểu sâu bản chất vật lí của từng đại lượng, biết cách biến đổi hệ thức và kiểm chứng trực tiếp quy luật trên Phòng thí nghiệm 2D/3D.`,
    formulaHighlight: lesson.keyFormulas[0],
    keyTakeaway:
      'Đọc kỹ ý nghĩa vật lí của từng đại lượng trong công thức thay vì chỉ học vẹt chữ cái.'
  });

  // Steps 2..K: Detailed sections from theorySections
  lesson.theorySections.forEach((sec, idx) => {
    const relatedFormula = lesson.keyFormulas[idx] || lesson.keyFormulas[0];
    steps.push({
      stepTitle: sec.heading,
      stepType: idx === 0 ? 'concept' : 'derivation',
      teacherExplanation: `${sec.content}\n\n**Phân tích chi tiết từ giáo viên**: Khi vận dụng nội dung này vào bài tập thực tế, em hãy xác định rõ đối tượng khảo sát, hệ quy chiếu / chiều dương chọn trước và kiểm tra điều kiện áp dụng của công thức.`,
      formulaHighlight: idx < lesson.keyFormulas.length ? relatedFormula : undefined,
      keyTakeaway: `Nắm chắc hệ thức trọng tâm và đơn vị đo SI của mục "${sec.heading.replace(/^\d+\.\s*/, '')}".`
    });
  });

  // Guided Worked Example from first essayExercise
  const firstEssay = lesson.essayExercises?.[0];
  if (firstEssay) {
    steps.push({
      stepTitle: 'Ví dụ giảng giải từng bước (Tự luận chuẩn SGK)',
      stepType: 'example',
      teacherExplanation:
        'Cùng thầy/cô phân tích bài toán mẫu dưới đây theo 3 bước: Tóm tắt giả thiết → Thiết lập phương trình vật lí → Thay số và kiểm tra đơn vị:',
      workedExample: {
        problem: firstEssay.question,
        steps: firstEssay.solutionSteps,
        answer: firstEssay.finalAnswer
      },
      keyTakeaway:
        firstEssay.hints?.[0] ||
        'Trình bày rõ từng bước biến đổi biểu thức chữ trước khi thế số để tránh mất điểm bước trung gian.'
    });
  }

  // Experiment walkthrough step
  const paramNames = Object.values(lesson.paramBounds)
    .map((b) => `${b.label} (${b.unit})`)
    .join(', ');
  steps.push({
    stepTitle: 'Hướng dẫn thực hành Thí nghiệm 2D & Mô hình 3D',
    stepType: 'experiment',
    teacherExplanation: `Sau phần lý thuyết, em hãy chuyển sang tab **2. Thí Nghiệm 2D** để tự tay làm thí nghiệm:\n• **Các tham số tùy chỉnh (có thể nhập số trực tiếp hoặc kéo thanh trượt)**: ${paramNames}.\n• **Công cụ PhET tích hợp**: Dùng nút **Bước +0.05s** để soi kỹ khoảnh khắc chuyển trạng thái, bật **Vector & Dấu vết**, sử dụng **Đồng hồ bấm giây** và bấm **Ghi mẫu đo** để lập bảng số liệu so sánh giữa các lần đo!`,
    keyTakeaway:
      'Thử thay đổi từng tham số một (giữ nguyên các tham số còn lại) — đây chính là phương pháp thực nghiệm biến kiểm soát trong Vật lí học.'
  });

  return steps;
}

export function buildMathLectureSteps(lecture: MathLecture): LectureStep[] {
  if (lecture.lectureSteps && lecture.lectureSteps.length > 0) {
    return lecture.lectureSteps;
  }

  const steps: LectureStep[] = [];

  // Step 1: Overview & Intuition
  steps.push({
    stepTitle: `Tổng quan & Định hướng tư duy: ${lecture.title.split(':')[0]}`,
    stepType: 'intuition',
    teacherExplanation: `${lecture.description}\n\n• **Vị trí chuyên đề**: ${
      lecture.track === 'chuyen'
        ? `Khu Chuyên Toán · Mức độ ${lecture.tier || 'Nâng cao'}`
        : `${lecture.gradeGroup || lecture.grade} · ${lecture.category || 'Toán học'}`
    }\n• **Trọng tâm phương pháp**: Trước khi lao vào biến đổi đại số hoặc vẽ hình, luôn xác định điều kiện xác định của ẩn, tính đối xứng và hình dung trực quan hình học (đồ thị hoặc hình không gian 3D).`,
    formulaHighlight: lecture.keyFormulas[0],
    keyTakeaway:
      'Hiểu ý nghĩa hình học giúp nhớ công thức đại số lâu gấp 3 lần và phát hiện nhanh kết quả vô lý.'
  });

  // Steps 2..K: Each theory block unpacked with pedagogical guidance
  lecture.theory.forEach((item, idx) => {
    const cleanHeading = item.includes(':')
      ? item.split(':')[0].replace(/\*\*/g, '').trim()
      : `Nội dung trọng tâm ${idx + 1}`;
    const relatedFormula =
      idx + 1 < lecture.keyFormulas.length
        ? lecture.keyFormulas[idx + 1]
        : idx === 0 && lecture.keyFormulas.length > 1
        ? lecture.keyFormulas[1]
        : undefined;

    steps.push({
      stepTitle: cleanHeading.length > 65 ? `Kiến thức cốt lõi phần ${idx + 1}` : cleanHeading,
      stepType: idx === 0 ? 'concept' : 'derivation',
      teacherExplanation: `${item}\n\n**Lưu ý sư phạm khi áp dụng**: Hãy kiểm tra kỹ các trường hợp biên (dấu bằng xảy ra khi nào, hệ số bậc cao nhất có thể bằng $0$ hay không, điều kiện của tham số).`,
      formulaHighlight: relatedFormula,
      keyTakeaway:
        lecture.mnemonics?.[idx] ||
        'Ghi chú lại điều kiện áp dụng đi kèm ngay bên cạnh công thức trong vở nháp.'
    });
  });

  // Worked Example from Essay problem
  const firstEssay = lecture.essayProblems?.[0];
  if (firstEssay) {
    steps.push({
      stepTitle: 'Ví dụ mẫu giải chi tiết từng bước trên bảng',
      stepType: 'example',
      teacherExplanation:
        'Thầy/cô trình bày mẫu một bài toán tự luận tiêu biểu của chuyên đề này. Em hãy thử tự nháp hướng đi trước rồi bấm mở từng bước giải để đối chiếu:',
      workedExample: {
        problem: firstEssay.question,
        steps: firstEssay.solutionSteps,
        answer: firstEssay.finalAnswer
      },
      keyTakeaway:
        firstEssay.hints?.[0] ||
        'Luôn kiểm tra lại đáp số bằng cách thay ngược vào đề bài hoặc đối chiếu trên đồ thị 2D.'
    });
  }

  // Pitfalls & Simulation link step
  const pitfallText =
    lecture.commonTraps && lecture.commonTraps.length > 0
      ? lecture.commonTraps.map((t, i) => `${i + 1}. ${t}`).join('\n')
      : '1. Quên đặt điều kiện xác định (căn thức, mẫu số, cơ số và biểu thức dưới dấu logarit).\n2. Bỏ sót trường hợp hệ số $a = 0$ khi biện luận phương trình/hàm số theo tham số $m$.';

  steps.push({
    stepTitle: 'Tổng kết Bẫy phòng thi & Kiểm chứng trên Mô phỏng 2D/3D',
    stepType: 'pitfall',
    teacherExplanation: `Những lỗi mất điểm đáng tiếc nhất học sinh hay gặp ở chuyên đề này:\n${pitfallText}\n\n• **Kiểm chứng trực quan**: Bấm nút **Mô phỏng 2D** để vẽ đồ thị / dựng hình phẳng, hoặc **Mô phỏng 3D Oxyz** để xoay quan sát mặt phẳng, khối chóp và vật tròn xoay từ mọi góc nhìn.`,
    keyTakeaway:
      'Làm ngay bộ câu hỏi Trắc nghiệm (+25 XP) và Tự luận bên dưới ngay khi vừa đọc xong để khóa kiến thức vào trí nhớ dài hạn.'
  });

  return steps;
}
