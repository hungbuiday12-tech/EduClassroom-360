import {
  AITutorMode,
  ArenaEssayEvaluation,
  DiagnosticQuestion,
  LectureStepEvaluation,
  LectureStepMCQ,
  LectureStepMiniEssay,
  LessonProgressAnalysis,
  PersonalizedRoadmapResult
} from '../types';

function normalizeText(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function extractKeyTokens(text: string): string[] {
  const stop = new Set([
    'va', 'cua', 'la', 'cho', 'khi', 'neu', 'thi', 'voi', 'trong', 'theo', 'tu', 'den', 'cac', 'mot',
    'hai', 'ba', 'nhu', 'nay', 'do', 'duoc', 'bang', 'tren', 'duoi', 'sau', 'truoc', 'khong', 'phai',
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'are', 'was'
  ]);
  return normalizeText(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stop.has(w));
}

export function buildLocalTutorReply(params: {
  messages: { role: string; text: string }[];
  context?: {
    subject?: 'math' | 'physics' | 'cs' | string;
    mode?: AITutorMode;
    topicTitle?: string;
    grade?: string;
    problemStatement?: string;
  };
  language?: string;
}): string {
  const isEn = params.language === 'en';
  const subj = params.context?.subject === 'physics' || params.context?.subject === 'cs' ? params.context.subject : 'math';
  const mode: AITutorMode = params.context?.mode || 'explain_no_answer';
  const topic = params.context?.topicTitle || (subj === 'physics' ? 'Vật Lí' : subj === 'cs' ? 'Tin Học' : 'Toán Học');
  const lastMsg = params.messages[params.messages.length - 1]?.text || '';
  const problem = params.context?.problemStatement || '';
  const combinedNorm = normalizeText(`${topic} ${problem} ${lastMsg}`);

  // Detect topic-specific hints cleanly
  const isDerivative = combinedNorm.includes('dao ham') || combinedNorm.includes('cuc tri') || combinedNorm.includes('dong bien');
  const isIntegral = combinedNorm.includes('nguyen ham') || combinedNorm.includes('tich phan');
  const isOxyz = combinedNorm.includes('oxyz') || combinedNorm.includes('mat cau') || combinedNorm.includes('tich co huong');
  const isQuadOrViet = combinedNorm.includes('bac hai') || combinedNorm.includes('vi-et') || combinedNorm.includes('viet') || combinedNorm.includes('delta');
  const isOptics = combinedNorm.includes('thau kinh') || combinedNorm.includes('tieu cu') || combinedNorm.includes('khuc xa');
  const isOscillation = combinedNorm.includes('con lac') || combinedNorm.includes('dao dong') || combinedNorm.includes('giao thoa') || combinedNorm.includes('song');
  const isCircuit = combinedNorm.includes('mach dien') || combinedNorm.includes('dinh luat om') || combinedNorm.includes('cong suat') || combinedNorm.includes('xoay chieu');
  const isDPOrGraph = combinedNorm.includes('quy hoach dong') || combinedNorm.includes('knapsack') || combinedNorm.includes('bfs') || combinedNorm.includes('dfs') || combinedNorm.includes('dijkstra');

  const detectedFormula = isDerivative
    ? "$$y' = 0 \\text{ và xét đổi dấu } y' \\text{ qua } x_0$$"
    : isIntegral
    ? "$$\\int_a^b f(x)\\,dx = F(b) - F(a), \\quad V = \\pi\\int_a^b [f(x)]^2\\,dx$$"
    : isOxyz
    ? "$$[\\vec{u},\\vec{v}] \\perp \\vec{u}, \\perp \\vec{v}; \\quad d(I,(P)) = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$$"
    : isQuadOrViet
    ? "$$\\Delta = b^2 - 4ac \\ge 0; \\quad x_1 + x_2 = -\\frac{b}{a}, \\; x_1 x_2 = \\frac{c}{a}$$"
    : isOptics
    ? "$$\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d'}, \\quad k = -\\frac{d'}{d}$$"
    : isOscillation
    ? "$$\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{g}{l}}, \\quad v_{\\max} = \\omega A, \\quad \\lambda = \\frac{v}{f}$$"
    : isCircuit
    ? "$$I = \\frac{U}{R_{tđ}}, \\quad Z = \\sqrt{R^2 + (Z_L - Z_C)^2}, \\quad P = UI\\cos\\varphi$$"
    : isDPOrGraph
    ? "$$\\text{Tối ưu trạng thái } dp[i] \\text{ với } \\mathcal{O}(N\\log N) \\text{ hoặc } \\mathcal{O}(N\\cdot W)$$"
    : subj === 'physics'
    ? "$$\\sum \\vec{F} = m\\vec{a}, \\quad W = W_đ + W_t = \\text{hằng số}$$"
    : subj === 'cs'
    ? "$$\\text{Kiểm tra giới hạn } N \\le 10^5 \\Rightarrow \\text{cần thuật toán } \\mathcal{O}(N) \\text{ hoặc } \\mathcal{O}(N\\log N)$$"
    : "$$\\text{Xác định điều kiện xác định trước, sau đó biến đổi tương đương}$$" ;

  if (mode === 'explain_no_answer') {
    if (isEn) {
      return `Great question about **${topic}**!\n\nTo keep you thinking actively (Mode 1 — No final answer), let's break down what you asked ("${lastMsg.slice(0, 120)}"):\n\n1. **Core Concept & Formula**:\n${detectedFormula}\n2. **What to check first**:\n- Identify all known quantities and domain constraints.\n- Connect the target quantity directly to the formula above before substituting numbers.\n\n**Guiding question for your next step**: In your expression/setup, which variable is independent and what condition must hold so the formula stays valid?`;
    }
    return `Câu hỏi rất hay về chủ đề **${topic}**!\n\nỞ **Chế độ 1 (Giảng chỗ chưa hiểu · Không đưa đáp án cuối)**, Thầy/Cô cùng em gỡ từng nút thắt cho thắc mắc *"${lastMsg.slice(0, 140)}"*:\n\n1. **Bản chất & Hệ thức cần dùng**:\n${detectedFormula}\n\n2. **Cách tư duy gỡ vướng tại bước này**:\n• **Bước kiểm tra 1**: Gạch chân những giả thiết đã biết và **điều kiện xác định / đơn vị chuẩn** ($a \\ne 0$, mẫu $\\ne 0$, đổi về đơn vị SI m, kg, s hoặc kiểm tra \`long long\` nếu số lớn).\n• **Bước kiểm tra 2**: Chuyển đại lượng đề hỏi về đúng các biến xuất hiện trong công thức trên rồi biến đổi từng bước.\n\n**Câu hỏi gợi mở**: Với bước này, em thử xác định xem hệ số / đại lượng nào đang đóng vai trò biến chính và điều kiện ràng buộc kèm theo là gì nhé?`;
  }

  if (mode === 'full_solution') {
    if (isEn) {
      return `**Summary, Method & Guided Solution (${topic})**\n\n1. **Problem Summary**: Analyze the request: *"${lastMsg.slice(0, 140)}"*.\n2. **Core Method & Formula**:\n${detectedFormula}\n3. **Step-by-Step Resolution**:\n- State domain/SI constraints cleanly.\n- Apply the governing law/algorithm above step-by-step and simplify.\n- Verify edge cases before stating the final result.\n4. **Key Check**: Cross-check units, signs, and edge cases to ensure 100% accuracy.`;
    }
    const csSnippet =
      subj === 'cs'
        ? `\n\`\`\`cpp\n#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // Đọc dữ liệu, dùng long long tránh tràn số và xử lý theo độ phức tạp O(N log N)\n    return 0;\n}\n\`\`\``
        : '';

    return `**Phân Tích Trọn Vẹn & Hướng Giải Chi Tiết (${topic})**\n\n1. **Tóm tắt & Phân tích đề bài**:\n• Nội dung cần xử lý: *"${lastMsg.slice(0, 160)}"*\n• Xác định rõ dữ kiện đầu vào, ràng buộc điều kiện và đại lượng cần tìm.\n\n2. **Phương pháp & Công thức trọng tâm**:\n${detectedFormula}\n\n3. **Quy trình giải từng bước**:\n• **Bước 1**: Đặt điều kiện xác định (với Toán) / chọn hệ quy chiếu & quy đổi đơn vị SI (với Lí) / xác định giới hạn $N$ & kiểu \`long long\` (với Tin).\n• **Bước 2**: Thiết lập phương trình hoặc hàm mục tiêu từ hệ thức trọng tâm ở trên, thay số/biến đổi tường minh từng dòng.${csSnippet}\n• **Bước 3**: Đối chiếu nghiệm hoặc test biên ($N = 0, 1$, dấu âm/dương) trước khi chốt kết quả.\n\n4. **Kết luận & Lưu ý tránh mất điểm**:\n• Luôn kiểm tra lại điều kiện ban đầu ở bước cuối cùng và sử dụng **Lab 2D / Lab 3D** hoặc **IDE Chấm Test** ngay trong lớp để kiểm chứng trực quan!`;
  }

  return isEn
    ? `**Mode 3 Roadmap Advice (${topic})**: Focus 30–45 minutes daily: (1) Review core formulas & 2 MCQs + 1 mini-essay per lecture part, (2) Verify visually in 2D/3D Lab, (3) Practice timed Exam Papers matched to your track.`
    : `**Tư Vấn Điều Chỉnh Lộ Trình (${topic})**:\n• **Nhịp học tối ưu 40 phút/ngày**: 15 phút đọc kỹ Khái niệm – Công thức và làm trọn 2 TN + 1 Tự luận nhỏ cho từng phần; 15 phút kiểm chứng trên **Mô phỏng 2D/3D** (hoặc nộp test C++/Python); 10 phút làm 1 đề bấm giờ hoặc thi đấu **Đấu Trường Tuần**.\n• Hãy hoàn thành bài Đánh giá 5 câu phía trên để AI vẽ sơ đồ chặng học cá nhân hóa cho em!`;
}

export function buildLocalDiagnosticQuiz(params: {
  subject: 'math' | 'physics' | 'cs';
  grade: string;
  targetMajor: string;
  selfLevel: string;
  language?: string;
}): DiagnosticQuestion[] {
  const { subject, grade, language } = params;
  const isEn = language === 'en';

  const specQuestions: DiagnosticQuestion[] = [
    {
      id: 'q4',
      category: 'specialization',
      topicTag: isEn ? 'Specialization Direction' : 'Định hướng Chuyên ngành',
      question: isEn
        ? `Which role/application in "${params.targetMajor}" excites you most?`
        : `Trong định hướng "${params.targetMajor}", mảng ứng dụng nào em muốn theo đuổi sâu nhất?`,
      options: isEn
        ? [
            'Research & core mathematical/algorithmic modeling',
            'Software engineering, AI systems & real-world simulations',
            'Competitive Olympiad / Top University Entrance Exam',
            'Applied data analysis & interdisciplinary problem solving'
          ]
        : [
            'Nghiên cứu chuyên sâu & mô hình hóa Toán / Thuật toán lõi',
            'Phát triển hệ thống AI, kỹ thuật phần mềm & mô phỏng 2D/3D',
            'Ôn thi Đại học điểm 9+ / Học sinh Giỏi cấp Tỉnh - Quốc gia',
            'Ứng dụng phân tích dữ liệu, kinh tế định lượng & kỹ thuật'
          ]
    },
    {
      id: 'q5',
      category: 'specialization',
      topicTag: isEn ? 'Current Bottleneck' : 'Điểm nghẽn hiện tại',
      question: isEn
        ? 'Which hurdle slows you down most when solving hard problems?'
        : 'Rào cản lớn nhất khiến em hay mất điểm khi làm bài kiểm tra / thi thử là gì?',
      options: isEn
        ? [
            'Knowing which theorem/formula to pick from the prompt',
            'Missing edge conditions or sign/unit conversions',
            'Running out of time on multi-step & Olympiad problems',
            'Turning theory into working code or visual intuition'
          ]
        : [
            'Đọc đề xong chưa biết bắt đầu từ định lí / công thức nào',
            'Hay sai vặt: thiếu điều kiện xác định, nhầm dấu hoặc quên đổi đơn vị SI',
            'Thiếu tốc độ và chiến thuật khi gặp câu Vận dụng cao / Chuyên',
            'Hiểu lý thuyết nhưng khó cài đặt thành code chuẩn / mô hình hình học'
          ]
    }
  ];

  if (subject === 'physics') {
    return [
      {
        id: 'p1',
        category: 'knowledge',
        topicTag: grade.includes('9') ? 'Điện học KHTN 9' : 'Dao động điều hòa',
        question: grade.includes('9')
          ? 'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào $U = 12\\text{ V}$. Cường độ dòng mạch chính là:'
          : 'Con lắc lò xo gồm vật $m = 0{,}4\\text{ kg}$ và lò xo $k = 40\\text{ N/m}$. Tần số góc $\\omega$ của dao động điều hòa là:',
        options: grade.includes('9')
          ? ['A. 3 A', 'B. 2 A', 'C. 0,67 A', 'D. 4 A']
          : ['A. 10 rad/s', 'B. 100 rad/s', 'C. 5 rad/s', 'D. 20 rad/s'],
        correctIndex: 0
      },
      {
        id: 'p2',
        category: 'knowledge',
        topicTag: 'Quang hình & Sóng',
        question: 'Vật sáng đặt trước thấu kính hội tụ tiêu cự $f = 15\\text{ cm}$, cách thấu kính $d = 30\\text{ cm}$. Vị trí ảnh là:',
        options: ['A. Ảnh ảo, d\' = -30 cm', 'B. Ảnh thật, d\' = 30 cm', 'C. Ảnh thật, d\' = 15 cm', 'D. Ảnh ở vô cực'],
        correctIndex: 1
      },
      {
        id: 'p3',
        category: 'knowledge',
        topicTag: 'Bảo toàn & Động học',
        question: 'Ném một vật từ mặt đất với vận tốc đầu $v_0$ theo góc nghiêng $\\alpha$. Khi bỏ qua sức cản không khí, tầm bay xa cực đại đạt được khi $\\alpha$ bằng:',
        options: ['A. 30°', 'B. 60°', 'C. 45°', 'D. 90°'],
        correctIndex: 2
      },
      ...specQuestions
    ];
  }

  if (subject === 'cs') {
    return [
      {
        id: 'c1',
        category: 'knowledge',
        topicTag: 'Độ phức tạp Big-O',
        question: 'Với giới hạn $N \\le 10^5$ và Time Limit $1{,}0\\text{ s}$, độ phức tạp thuật toán nào dưới đây chắc chắn ĐẠT (AC)?',
        options: ['A. $\\mathcal{O}(N^2)$', 'B. $\\mathcal{O}(N \\log N)$', 'C. $\\mathcal{O}(2^N)$', 'D. $\\mathcal{O}(N^3)$'],
        correctIndex: 1
      },
      {
        id: 'c2',
        category: 'knowledge',
        topicTag: 'Kiểu dữ liệu & Tràn số',
        question: 'Trong C++, để tính tích $a \\times b$ với $a, b \\le 10^9$ mà không bị tràn số (Overflow), cần dùng kiểu dữ liệu nào?',
        options: ['A. int', 'B. short', 'C. long long', 'D. unsigned char'],
        correctIndex: 2
      },
      {
        id: 'c3',
        category: 'knowledge',
        topicTag: 'Quy hoạch động & Tìm kiếm',
        question: 'Bài toán Tìm kiếm nhị phân (Binary Search) chỉ áp dụng chính xác trên mảng có tính chất nào?',
        options: [
          'A. Mảng chứa toàn số nguyên tố',
          'B. Mảng có kích thước chẵn',
          'C. Dữ liệu có tính đơn điệu (đã sắp xếp tăng/giảm)',
          'D. Mảng không có phần tử âm'
        ],
        correctIndex: 2
      },
      ...specQuestions
    ];
  }

  // Math default
  return [
    {
      id: 'm1',
      category: 'knowledge',
      topicTag: grade.includes('9') ? 'Hệ thức Vi-ét & Phương trình bậc 2' : 'Đạo hàm & Cực trị',
      question: grade.includes('9')
        ? 'Phương trình $x^2 - 5x + 6 = 0$ có hai nghiệm $x_1, x_2$. Giá trị của $x_1^2 + x_2^2$ bằng:'
        : 'Hàm số $y = x^3 - 3x + 1$ đạt cực tiểu tại điểm có hoành độ bằng:',
      options: grade.includes('9')
        ? ['A. 13', 'B. 25', 'C. 19', 'D. 37']
        : ['A. x = -1', 'B. x = 0', 'C. x = 1', 'D. x = 3'],
      correctIndex: grade.includes('9') ? 0 : 2
    },
    {
      id: 'm2',
      category: 'knowledge',
      topicTag: 'Tích phân & Hình học',
      question: 'Mặt cầu tâm $I(1; -2; 2)$ bán kính $R = 5$ bị mặt phẳng $(P)$ cắt với khoảng cách $d(I,(P)) = 3$. Bán kính đường tròn giao tuyến $r$ là:',
      options: ['A. 2', 'B. 4', 'C. 8', 'D. $\\sqrt{34}$'],
      correctIndex: 1
    },
    {
      id: 'm3',
      category: 'knowledge',
      topicTag: 'Lượng giác & Mũ - Logarit',
      question: 'Điều kiện xác định của phương trình $\\log_2(x - 3) = 4$ là:',
      options: ['A. $x \\ge 3$', 'B. $x > 0$', 'C. $x > 3$', 'D. $x \\ne 3$'],
      correctIndex: 2
    },
    ...specQuestions
  ];
}

export function buildLocalDiagnosticRoadmap(params: {
  subject: 'math' | 'physics' | 'cs';
  grade: string;
  targetMajor: string;
  quizAnswers: any[];
  customGoal?: string;
  language?: string;
}): PersonalizedRoadmapResult {
  const { subject, grade, targetMajor, quizAnswers = [], language } = params;
  const isEn = language === 'en';
  const knowledgeItems = quizAnswers.filter((a) => a.category === 'knowledge');
  const total = knowledgeItems.length || 3;
  const correct = knowledgeItems.filter(
    (a) => typeof a.correctIndex === 'number' && a.selectedIndex === a.correctIndex
  ).length;
  const scorePct = Math.round((correct / total) * 100);
  const missedTags = knowledgeItems
    .filter((a) => a.selectedIndex !== a.correctIndex)
    .map((a) => a.topicTag)
    .filter(Boolean);

  const estimatedLevel =
    scorePct >= 80
      ? isEn
        ? 'Strong Foundation · Ready for Advanced & Specialized Problems'
        : 'Nền tảng Vững · Sẵn sàng Chuyên sâu & Vận dụng cao'
      : scorePct >= 50
      ? isEn
        ? 'Solid Intermediate · Polish Formulas & Conditions'
        : 'Trình độ Khá · Cần gia cố công thức trọng tâm & điều kiện'
      : isEn
      ? 'Foundation Builder · Reinforce Core Concepts First'
      : 'Giai đoạn Xây gốc · Tập trung nắm chắc Khái niệm & Bài mẫu';

  return {
    subject,
    grade,
    targetMajor,
    estimatedLevel,
    knowledgeScore: scorePct,
    knowledgeCorrect: correct,
    knowledgeTotal: total,
    strengths:
      correct > 0
        ? [
            `Trả lời chính xác ${correct}/${total} câu kiểm tra chuyên môn ${grade}.`,
            `Xác định rõ mục tiêu theo chuyên ngành "${targetMajor}".`
          ]
        : [`Đã chủ động đánh giá năng lực và xác định mục tiêu "${targetMajor}".`],
    weaknesses:
      missedTags.length > 0
        ? missedTags.map((t) => `Cần ôn lại chắc phần "${t}" kèm 2 câu TN + 1 tự luận nhỏ.`)
        : ['Cần duy trì luyện tập đều các dạng Vận dụng cao và kiểm soát tốc độ bấm giờ.'],
    majorAdvice: isEn
      ? `To excel in "${targetMajor}", connect theoretical formulas in ${subject.toUpperCase()} directly with 2D/3D simulations and timed exam practice.`
      : `Để bứt phá đúng hướng "${targetMajor}", em hãy học gắn liền lý thuyết từng phần với **Mô phỏng 2D/3D trực quan** và giải quyết dứt điểm từng lỗ hổng chuyên môn trước khi tăng tốc luyện đề.`,
    dailyScheduleSummary: isEn
      ? 'Recommended 45 min/day: 20m Core Lecture Parts + 15m 2D/3D Simulation + 10m Quick Quiz'
      : 'Lịch khuyến nghị 45 phút/ngày: 20p học từng phần bài giảng (2 TN + 1 Tự luận) · 15p thực nghiệm 2D/3D · 10p rà soát lỗi sai.',
    stages: [
      {
        step: 1,
        phase: 'Chặng 01 · Vá Lỗ Hổng Gốc',
        title: missedTags.length > 0 ? `Củng cố: ${missedTags.join(' & ')}` : `Hệ thống hóa nền tảng ${grade}`,
        durationWeeks: 2,
        dailyMinutes: 40,
        focusTopics: missedTags.length > 0 ? missedTags : ['Khái niệm cốt lõi', 'Điều kiện xác định', 'Đơn vị SI & Công thức gốc'],
        recommendedModule: subject,
        concreteTasks: [
          'Mở lớp Bài giảng tương tác, học kỹ từng mục Khái niệm – Công thức – Giải thích sâu hơn.',
          'Hoàn thành tối thiểu 2 câu Trắc nghiệm + 1 câu Tự luận nhỏ ở mỗi phần.'
        ],
        targetMilestone: 'Đạt ≥ 80% câu kiểm tra từng phần bài giảng'
      },
      {
        step: 2,
        phase: 'Chặng 02 · Trực Quan Hóa 2D & 3D',
        title: subject === 'cs' ? 'Thực chiến IDE Sublime & Online Judge' : 'Kiểm chứng quy luật qua Mô phỏng 2D / 3D',
        durationWeeks: 2,
        dailyMinutes: 45,
        focusTopics: ['Tương tác tham số', 'Nhận diện đồ thị / mô hình không gian', 'Phân tích test biên'],
        recommendedModule: subject,
        concreteTasks: [
          subject === 'cs'
            ? 'Code và nộp tối thiểu 4 bài mẫu bằng Sublime Text 4 IDE đạt 100% AC test.'
            : 'Mở tab Lab 2D & Lab 3D, tự nhập thông số và đối chiếu với kết quả tính tay.'
        ],
        targetMilestone: 'Làm chủ tư duy trực giác và tránh lỗi sai dấu / đơn vị'
      },
      {
        step: 3,
        phase: 'Chặng 03 · Thực Chiến Kho Đề Chuẩn',
        title: 'Luyện đề bấm giờ (Chuyên & Không Chuyên)',
        durationWeeks: 2,
        dailyMinutes: 60,
        focusTopics: ['Chiến thuật phân bổ thời gian', 'Bài toán Vận dụng cao', 'Trình bày Tự luận chuẩn'],
        recommendedModule: 'exams',
        concreteTasks: [
          'Giải 2–3 đề bấm giờ mỗi tuần trong Kho Đề Thi (lọc đúng khối & mức độ).',
          'Dùng Gia sư AI Chế độ 1 để tự gỡ đúng câu sai trước khi xem đáp án.'
        ],
        targetMilestone: 'Đạt ổn định từ 8.5/10 trở lên trên đề chuẩn'
      },
      {
        step: 4,
        phase: 'Chặng 04 · Đấu Trường Xếp Hạng Tuần',
        title: 'Thi đấu Online & Duy trì Phong độ Đỉnh cao',
        durationWeeks: 2,
        dailyMinutes: 30,
        focusTopics: ['Phản xạ nhanh Trắc nghiệm', 'Viết Tự luận súc tích', 'Tổng hợp 3 môn'],
        recommendedModule: 'arena',
        concreteTasks: [
          'Tham gia Đấu Trường Tuần mỗi ngày (Trắc nghiệm hoặc Tự luận) để kiểm tra phong độ thực tế.'
        ],
        targetMilestone: 'Duy trì điểm trung bình ≥ 85/100 và hoàn thành lộ trình mục tiêu'
      }
    ],
    createdAt: new Date().toISOString()
  };
}

export function gradeLocalMiniEssay(params: {
  subject?: 'math' | 'physics' | 'cs';
  lessonTitle?: string;
  stepTitle?: string;
  question: string;
  rubricChecklist: string[];
  sampleAnswer: string;
  studentAnswer: string;
  language?: string;
}): LectureStepEvaluation {
  const ans = (params.studentAnswer || '').trim();
  const isEn = params.language === 'en';
  if (!ans || ans.length < 8) {
    return {
      score: 1,
      maxScore: 10,
      isCorrectDirection: false,
      strengths: [],
      mistakes: [isEn ? 'Answer is too brief; explain the main concept, formula, and condition.' : 'Câu trả lời quá ngắn, chưa đủ ý chính và công thức / điều kiện.'],
      feedback: isEn ? 'Write 2–4 clear sentences covering the key principle and constraints.' : 'Em hãy trình bày rõ 2–4 câu nêu khái niệm, công thức và điều kiện áp dụng nhé.',
      gradedBy: 'ai'
    };
  }

  const refTokens = Array.from(
    new Set([
      ...extractKeyTokens(params.sampleAnswer || ''),
      ...extractKeyTokens((params.rubricChecklist || []).join(' '))
    ])
  );
  const studentNorm = normalizeText(ans);
  const matchedTokens = refTokens.filter((tok) => studentNorm.includes(tok));
  const coverage = refTokens.length > 0 ? matchedTokens.length / Math.min(10, refTokens.length) : 0.6;
  const hasFormulaSignal = /[=^+\-*/<>]|\\frac|o\(|delta|dieu kien|cong thuc|luat/i.test(studentNorm);
  const lengthBonus = ans.length >= 60 ? 1.5 : ans.length >= 30 ? 0.8 : 0;

  let raw = 3.5 + coverage * 5.0 + (hasFormulaSignal ? 1.0 : 0) + lengthBonus;
  raw = Math.max(2, Math.min(9.5, Math.round(raw * 2) / 2));

  const strengths: string[] = [];
  const mistakes: string[] = [];

  if (matchedTokens.length >= 2) {
    strengths.push(
      isEn
        ? `Hit key domain concepts (${matchedTokens.slice(0, 4).join(', ')}).`
        : `Nêu được từ khóa trọng tâm của phần "${params.stepTitle || 'bài học'}".`
    );
  }
  if (hasFormulaSignal) {
    strengths.push(
      isEn
        ? 'Included explicit mathematical/algorithmic relationships or constraints.'
        : 'Có diễn đạt hệ thức/công thức hoặc điều kiện ràng buộc trong câu trả lời.'
    );
  }
  if (strengths.length === 0) {
    strengths.push(isEn ? 'Attempted the prompt cleanly.' : 'Đã chủ động trình bày suy nghĩ theo yêu cầu câu hỏi.');
  }

  if (raw < 8.5) {
    mistakes.push(
      isEn
        ? `Compare against the sample rubric to refine exact conditions/units (${params.rubricChecklist?.[0] || 'key principle'}).`
        : `Cần đối chiếu thêm tiêu chí chuẩn: "${params.rubricChecklist?.[0] || 'Nêu đủ điều kiện và ý nghĩa đại lượng'}".`
    );
  }

  return {
    score: raw,
    maxScore: 10,
    isCorrectDirection: raw >= 5.5,
    strengths,
    mistakes,
    feedback:
      raw >= 8
        ? isEn
          ? 'Strong explanation! Clear conceptual structure and proper conditions.'
          : 'Bài làm tốt! Em đã nắm được bản chất và lập luận khá chặt chẽ.'
        : isEn
        ? 'Good start—add the explicit governing formula and boundary condition to reach 9–10/10.'
        : 'Đúng hướng cơ bản; em hãy bổ sung thêm biểu thức công thức chuẩn và điều kiện áp dụng để đạt trọn điểm 9–10.',
    gradedBy: 'ai'
  };
}

export function generateLocalStepQuiz(params: {
  subject?: 'math' | 'physics' | 'cs';
  lessonTitle?: string;
  stepTitle?: string;
  conceptSection?: string;
  primaryFormula?: string;
  deepDiveSection?: string;
  language?: string;
}): { miniQuiz: LectureStepMCQ[]; miniEssay: LectureStepMiniEssay } {
  const stepTitle = (params.stepTitle || 'Nội dung trọng tâm').replace(/^\d+\.\s*/, '');
  const formula = params.primaryFormula?.trim();
  const fTxt = formula ? `$${formula}$` : 'hệ thức trọng tâm của phần này';
  const subj = params.subject || 'math';
  const ts = Date.now();

  const q1: LectureStepMCQ = {
    id: `local_mcq1_${ts}`,
    question: `Khi áp dụng kiến thức ở mục "${stepTitle}" (công thức ${fTxt}), bước kiểm tra đầu tiên bắt buộc phải làm là gì?`,
    options: [
      subj === 'physics'
        ? 'A. Kiểm tra hệ quy chiếu, chiều dương và quy đổi đơn vị về chuẩn SI'
        : subj === 'cs'
        ? 'A. Kiểm tra giới hạn N, chọn kiểu dữ liệu (long long) và độ phức tạp Big-O'
        : 'A. Kiểm tra điều kiện xác định, miền giá trị và các hệ số đặc biệt (= 0)',
      'B. Bỏ qua mọi giả thiết và thay ngay một giá trị bất kỳ để thử',
      'C. Giả sử mọi đại lượng đều luôn dương và không đổi theo thời gian',
      'D. Không cần xét trường hợp biên vì kết quả luôn giống nhau'
    ],
    correctIndex: 0,
    explanation: `Luôn kiểm tra điều kiện áp dụng/đơn vị/giới hạn trước khi biến đổi ${fTxt} để không mất điểm oan ở câu "${stepTitle}".`
  };

  const q2: LectureStepMCQ = {
    id: `local_mcq2_${ts}`,
    question: `Trong phần "${stepTitle}" thuộc bài "${params.lessonTitle || ''}", phát biểu nào phản ánh đúng bản chất mối quan hệ giữa các đại lượng?`,
    options: [
      'A. Các đại lượng chỉ liên hệ ngẫu nhiên, không phụ thuộc công thức',
      `B. Mối quan hệ định lượng được mô tả chính xác bởi ${fTxt} trong phạm vi điều kiện cho phép`,
      'C. Có thể hoán đổi tùy ý mọi biến số ở tử số và mẫu số mà kết quả không đổi',
      'D. Công thức chỉ dùng để minh họa, không thể kiểm chứng qua mô phỏng hay thực nghiệm'
    ],
    correctIndex: 1,
    explanation: `Hệ thức ${fTxt} liên kết trực tiếp các biến số của "${stepTitle}" và luôn có thể kiểm chứng qua Lab 2D/3D.`
  };

  const miniEssay: LectureStepMiniEssay = {
    id: `local_essay_${ts}`,
    question: `Hãy tự diễn đạt lại bằng lời của em (3–4 dòng) cho phần "${stepTitle}": (1) Nêu ý nghĩa của ${fTxt}; (2) Chỉ ra 1 trường hợp đặc biệt hoặc lỗi sai thường gặp nhất khi giải bài tập.`,
    hint: 'Tóm tắt ngắn gọn ý nghĩa từng biến/đại lượng và nêu rõ 1 điều kiện biên hay bẫy tính toán.',
    rubricChecklist: [
      `Nêu đúng vai trò / công thức ${fTxt}.`,
      'Giải thích rõ ý nghĩa từng đại lượng hoặc biến số chính.',
      'Chỉ ra đúng 1 lỗi sai hoặc điều kiện cần lưu ý.'
    ],
    sampleAnswer: `${(params.conceptSection || '').slice(0, 220)}\n\nLưu ý vận dụng: Luôn kiểm tra điều kiện xác định, dấu và đơn vị của ${fTxt} trước khi kết luận.`
  };

  return { miniQuiz: [q1, q2], miniEssay };
}

export function analyzeLocalLessonProgress(params: {
  subject: 'math' | 'physics' | 'cs';
  grade?: string;
  lessonTitle: string;
  stepsSummary: any[];
  language?: string;
}): LessonProgressAnalysis {
  const isEn = params.language === 'en';
  const stepsSummary = Array.isArray(params.stepsSummary) ? params.stepsSummary : [];
  let totalMcq = 0;
  let correctMcq = 0;
  let essaySum = 0;
  let essayCount = 0;
  const strongPoints: string[] = [];
  const weakPoints: string[] = [];
  const weakStepIndices: number[] = [];

  for (const s of stepsSummary) {
    const t = Number(s.mcqTotal || 0);
    const c = Number(s.mcqCorrect || 0);
    totalMcq += t;
    correctMcq += c;

    const hasEssay = typeof s.essayScore === 'number';
    if (hasEssay) {
      essaySum += s.essayScore;
      essayCount += 1;
    }

    const mcqRate = t > 0 ? c / t : 0;
    const essayRate = hasEssay ? s.essayScore / 10 : mcqRate;
    const combined = (mcqRate + essayRate) / 2;

    if (Number(s.mcqAttempted || 0) > 0 || hasEssay) {
      if (combined >= 0.75) {
        strongPoints.push(`${s.stepTitle}: Đạt ${c}/${t} TN${hasEssay ? `, Tự luận ${s.essayScore}/10` : ''}`);
      } else {
        weakPoints.push(`${s.stepTitle}: Cần ôn lại (${c}/${t} TN${hasEssay ? `, Tự luận ${s.essayScore}/10` : ''})`);
        weakStepIndices.push(Number(s.stepIndex || 0));
      }
    }
  }

  const mcqPct = totalMcq > 0 ? (correctMcq / totalMcq) * 100 : 0;
  const essayPct = essayCount > 0 ? (essaySum / essayCount) * 10 : mcqPct;
  const overallMastery =
    totalMcq > 0 || essayCount > 0 ? Math.round(mcqPct * 0.55 + essayPct * 0.45) : 0;

  const readinessLevel =
    overallMastery >= 80
      ? isEn
        ? 'Mastered · Ready for Next Lesson'
        : 'Nắm vững cốt lõi · Sẵn sàng thực chiến & học bài tiếp'
      : overallMastery >= 55
      ? isEn
        ? 'Developing · Review Flagged Formulas'
        : 'Đạt mức Khá · Cần vá lại phần công thức còn hổng'
      : isEn
      ? 'Needs Reinforcement · Review Step-by-Step'
      : 'Cần củng cố gốc · Ôn lại Khái niệm & hỏi Gia sư AI';

  const recommendedRoadmap: LessonProgressAnalysis['recommendedRoadmap'] = [];
  let stepOrder = 1;

  if (weakStepIndices.length > 0) {
    const firstWeak = stepsSummary.find((s) => Number(s.stepIndex) === weakStepIndices[0]);
    recommendedRoadmap.push({
      step: stepOrder++,
      title: `Ôn lại ngay: ${firstWeak?.stepTitle || 'Phần còn yếu'}`,
      action: 'Đọc lại Khái niệm, Công thức, Giải thích sâu hơn và đặt câu hỏi cho AI ở phần này.',
      targetType: 'review_step',
      stepIndex: weakStepIndices[0]
    });
  }

  recommendedRoadmap.push({
    step: stepOrder++,
    title:
      params.subject === 'cs'
        ? 'Thực hành viết code & Chấm Test Online Judge'
        : 'Kiểm chứng trực quan trên Mô phỏng 2D / 3D',
    action:
      params.subject === 'cs'
        ? 'Mở Sublime Text 4 IDE và nộp bài thực hành để kiểm tra toàn bộ test biên.'
        : 'Mở Mô phỏng 2D & Mô hình 3D, kéo thanh trượt tham số để kiểm chứng trực tiếp công thức.',
    targetType: params.subject === 'cs' ? 'sim_2d' : 'sim_3d'
  });

  if (overallMastery < 75) {
    recommendedRoadmap.push({
      step: stepOrder++,
      title: 'Gỡ nút thắt cùng Gia Sư AI (Chế độ 1)',
      action: 'Hỏi Gia Sư AI về các câu sai hoặc ý tự luận còn thiếu trước khi chuyển bài.',
      targetType: 'ai_tutor'
    });
  }

  recommendedRoadmap.push({
    step: stepOrder++,
    title: overallMastery >= 75 ? 'Chuyển sang Bài tiếp theo hoặc Thử sức Đề thi' : 'Làm lại bộ câu hỏi phần yếu rồi sang Bài mới',
    action:
      overallMastery >= 75
        ? `Kết quả bài "${params.lessonTitle}" rất khả quan — hãy tiến sang bài mới hoặc thử sức trong Kho Đề / Đấu Trường.`
        : 'Đạt tối thiểu 75% mức nắm vững ở bài này để xây nền chắc trước khi sang bài tiếp theo.',
    targetType: overallMastery >= 75 ? 'next_lesson' : 'exams'
  });

  return {
    overallMastery,
    readinessLevel,
    summaryFeedback: `Ở bài "${params.lessonTitle}", bạn đạt ${correctMcq}/${totalMcq} câu trắc nghiệm${
      essayCount > 0 ? ` và điểm trung bình tự luận ngắn là ${Math.round((essaySum / essayCount) * 10) / 10}/10` : ''
    }. ${weakPoints.length > 0 ? 'Hãy tập trung vá lại các phần đánh dấu cần ôn trước khi chuyển bài.' : 'Nhịp học hiện tại rất tốt!'}`,
    strongPoints: strongPoints.length > 0 ? strongPoints : ['Đã chủ động tiếp cận bài giảng từng bước.'],
    weakPoints: weakPoints.length > 0 ? weakPoints : ['Hoàn thành thêm câu tự luận nhỏ ở các phần còn trống để đạt tối đa độ vững.'],
    recommendedRoadmap,
    analyzedAt: new Date().toISOString()
  };
}

export function gradeLocalArenaEssay(params: {
  subject: string;
  title: string;
  prompt: string;
  rubricChecklist: string[];
  referenceSolution: string;
  studentAnswer: string;
}): ArenaEssayEvaluation {
  const ans = (params.studentAnswer || '').trim();
  const baseEval = gradeLocalMiniEssay({
    question: params.prompt,
    rubricChecklist: params.rubricChecklist,
    sampleAnswer: params.referenceSolution,
    studentAnswer: ans
  });

  // Check if CS sandbox passed tests note exists
  const sandboxMatch = ans.match(/KẾT QUẢ CHẠY SANDBOX[^:]*:\s*(\d+)\/(\d+)/i);
  let score100 = Math.round(baseEval.score * 10);
  if (sandboxMatch) {
    const passed = Number(sandboxMatch[1]);
    const total = Math.max(1, Number(sandboxMatch[2]));
    score100 = Math.max(score100, Math.round((passed / total) * 85 + (ans.length > 80 ? 15 : 5)));
  }
  score100 = Math.max(0, Math.min(100, score100));

  const rubrics = params.rubricChecklist || ['Phân tích giả thiết', 'Thiết lập công thức / thuật toán', 'Kết luận đáp số'];
  const perMax = Math.round(100 / Math.max(1, rubrics.length));
  const stepScores = rubrics.map((r, i) => {
    const maxPt = i === rubrics.length - 1 ? 100 - perMax * (rubrics.length - 1) : perMax;
    const earnedPt = Math.round((score100 / 100) * maxPt);
    return {
      criterion: r,
      earned: earnedPt,
      max: maxPt,
      comment: earnedPt >= maxPt * 0.7 ? 'Đạt yêu cầu trọng tâm.' : 'Cần bổ sung chi tiết và điều kiện đầy đủ hơn.'
    };
  });

  return {
    score: score100,
    strengths: baseEval.strengths,
    mistakes: baseEval.mistakes,
    stepScores,
    detailedFeedback: baseEval.feedback,
    suggestedStudyTip: 'Đối chiếu từng bước với đáp án mẫu ngay bên dưới và hỏi Gia sư AI ở bước còn vướng.'
  };
}
