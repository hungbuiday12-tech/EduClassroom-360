import {
  CSLesson,
  CSLevel,
  CurriculumTrack,
  LectureStep,
  LectureStepFormulaSection,
  LectureStepMCQ,
  LectureStepMiniEssay,
  MathLecture,
  PhysicsLesson,
  SpecializedTier
} from '../types';
import { PHYSICS_CUSTOM_LECTURE_STEPS } from './physicsLectureSteps';

interface PedagogicalContext {
  track?: CurriculumTrack;
  tier?: SpecializedTier;
  grade?: string;
  csLevel?: CSLevel;
}

// ============================================================================
// SHARED HELPERS FOR EXTRACTING FORMULAS, CONCEPTS & BUILDING STEP QUIZZES
// ============================================================================

function isTrivialConventionOrLabel(tex: string): boolean {
  const cleaned = tex.replace(/\s+/g, ' ').trim();
  const hasRelation = /(=|\\neq|\\ne|\\approx|\\equiv|<|>|\\le|\\ge|\\iff|\\implies|\\Leftrightarrow|\\Rightarrow|\\perp|\\parallel)/.test(cleaned);

  // Comma-separated segment/variable naming conventions like "AC = b, AB = c" or "AH = h" or "BH = c', CH = b'"
  const assignParts = cleaned.split(/\s*,\s*/);
  if (
    assignParts.length > 0 &&
    assignParts.every((p) => /^[A-Z]{1,3}'?(?:_[A-Za-z0-9]+)?\s*=\s*[a-zA-Z0-9']+(?:'|_[a-zA-Z0-9{}]+)?$/.test(p))
  ) {
    return true;
  }

  // Simple numeric assignments like "N = 0", "x = 1", "k = 0"
  if (/^[a-zA-Z]'?(?:_[a-zA-Z0-9]+)?\s*=\s*-?\d+(?:[.,]\d+)?$/.test(cleaned)) return true;

  // Simple domain bounds like "x > 0", "a \neq 0", "n \ge 2", "B > 0"
  if (/^[a-zA-Z]'?(?:_[a-zA-Z0-9]+)?\s*(?:<|>|\\le|\\ge|\\neq|\\ne)\s*-?\d+(?:[.,]\d+)?$/.test(cleaned)) return true;

  // Pure set notation / membership without an equation, e.g., "D = R", "k \in \mathbb{N}^*", "a, b \in R", "c \in [0, N-1]"
  if (/^[A-Za-z0-9',\s.\\]*(?:=|\\in)\s*(?:(\\mathbb\{)?[RNZQ](\})?(\^\*)?|\[[^\]]+\]|\([^)]+\))$/.test(cleaned)) return true;

  if (!hasRelation) {
    // Pure geometric/point/tuple/interval notation: \triangle ABC, \angle AOB, M(x_0; y_0), (O_1; R_1), [a; b), (-\infty; -d/c), (u_n), (\alpha), S[l_1..r_1]
    if (/^\\?(triangle|Delta|angle|widehat|square|overrightarrow|vec|overset)\b/.test(cleaned)) return true;
    if (/^[A-Za-z][A-Za-z0-9'_]*(?:\([^)]+\)|\[[^\]]+\])$/.test(cleaned) && !cleaned.includes('O(')) return true;
    if (/^[\[(][^)\]]+[)\]]$/.test(cleaned)) return true;
    if (/^(\[[a-z0-9_]+;\s*[a-z0-9_]+\)\s*,?\s*)+(\\dots)?$/i.test(cleaned)) return true;

    // Standalone numbers, powers, or angles like "180^\circ", "2\pi", "10^9", "10^{12}", "\frac{0}{0}", "9 \cdot 10^{18}"
    if (/^-?(?:\d+(?:[.,]\d+)?(?:\s*\\cdot\s*)?)*\d*(?:\^\{?[-+]?\d+\}?|\\circ|\\pi|\\frac\{[01]\}\{[02]\})+(?:\^\\circ)?$/.test(cleaned)) return true;
    if (/^\\frac\{\\lambda\}\{\d+\}$/.test(cleaned)) return true;

    // Single symbols, Greek letters, subscripts, simple powers, or comma lists of variables/indices
    const listParts = cleaned.split(/\s*,\s*/);
    if (
      listParts.every((p) =>
        /^(?:\\(?:alpha|beta|gamma|delta|Delta|varepsilon|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|varphi|chi|psi|omega|Omega|dots|ldots)|[A-Za-z0-9]+)(?:'|_(?:\{[^{}]+\}|[A-Za-z0-9]+)|\^(?:\{[^{}]+\}|[A-Za-z0-9]+))*$/.test(
          p
        )
      )
    ) {
      return true;
    }

    // Bare SI units like "\text{kg}\cdot\text{m/s}", "\text{N}\cdot\text{m}"
    if (/^(?:\\text\{[^}]+\}|\\cdot|\/|\s)+$/.test(cleaned)) return true;

    // Bare single radical/fraction/exponent placeholders like "\sqrt{A}", "\frac{1}{\sqrt{A}}", "{}^A_Z X", "M \in (P)"
    if (/^\\(sqrt|frac)\{[A-Z0-9\\{}]+\}$/.test(cleaned) || /^(\{\})?\^[A-Z]_[A-Z]\s+[A-Z]$/.test(cleaned)) return true;
    if (/\\(in|notin|subset|not\\subset)\b/.test(cleaned)) return true;
  }

  return false;
}

function extractInlineFormulas(text: string): string[] {
  const found: string[] = [];
  const regex = /\$([^$]+)\$/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const candidate = match[1].trim();
    if (
      candidate.length >= 4 &&
      candidate.length <= 140 &&
      (/[=<>+\-*/]|\\(frac|sqrt|sum|prod|int|lim|sin|cos|tan|cot|log|ln|vec|widehat|perp|parallel|approx|equiv|neq|ne|le|ge|iff|implies|Rightarrow|Leftrightarrow)/.test(candidate) ||
        candidate.includes('O(')) &&
      !isTrivialConventionOrLabel(candidate) &&
      !found.includes(candidate)
    ) {
      found.push(candidate);
    }
  }
  return found;
}

function stripLeadingNumber(title: string): string {
  return title.replace(/^\d+[\.\)]\s*/, '').trim();
}

function buildVariablesNote(
  subject: 'math' | 'physics' | 'cs',
  formula: string | undefined,
  extraContext: string,
  commonTrap?: string,
  ctx?: PedagogicalContext
): string {
  const lines: string[] = [];
  const isChuyen = ctx?.track === 'chuyen';
  const gradeText = ctx?.grade || '';

  if (subject === 'math') {
    if (isChuyen) {
      lines.push(
        '• Thiết lập chặt chẽ miền xác định, điều kiện đẳng thức hoặc giả thiết tham số ngay từ đầu; kiểm tra biến đổi có tương đương hoàn toàn hay chỉ là hệ quả.'
      );
      if (formula && /[a-zA-Z]/.test(formula)) {
        lines.push(
          '• Biện luận đầy đủ các trường hợp suy biến (hệ số bậc cao bằng $0$, trường hợp biên) và kiểm tra dấu bằng khi đánh giá cực trị.'
        );
      }
    } else if (gradeText.includes('9')) {
      lines.push('• Nhớ đặt điều kiện có nghĩa trước khi giải (mẫu thức $\\ne 0$, biểu thức trong căn bậc hai $\\ge 0$, ẩn biểu diễn độ dài/số lượng $> 0$).');
      if (formula && /[a-zA-Z]/.test(formula)) {
        lines.push('• Phân biệt rõ ẩn cần tìm ($x, y$) và hệ số đã cho; thử thay lại nghiệm vào phương trình ban đầu để chắc chắn không sai dấu.');
      }
    } else {
      lines.push('• Đặt điều kiện xác định rõ ràng (mẫu số $\\ne 0$, trong căn $\\ge 0$, biểu thức logarit $> 0$) trước khi biến đổi công thức.');
      if (formula && /[a-zA-Z]/.test(formula)) {
        lines.push('• Phân biệt biến số ($x, t$) với tham số ($m, a$); nếu tham số đi cùng bậc cao nhất nhớ xét riêng trường hợp hệ số đó bằng $0$.');
      }
    }
  } else if (subject === 'physics') {
    if (isChuyen) {
      lines.push('• Quy đổi đồng nhất toàn bộ đại lượng về hệ SI; xác định rõ hệ quy chiếu (quán tính hay phi quán tính) và phương trình liên kết trước khi chiếu vectơ.');
      lines.push('• Kiểm tra thứ nguyên của biểu thức kết quả và xét các trường hợp giới hạn đặc biệt để tự kiểm chứng đáp án.');
    } else {
      lines.push('• Đổi các số liệu đề bài về đơn vị chuẩn trước khi thay số (ví dụ: $\\text{cm} \\to \\text{m}$, $\\text{g} \\to \\text{kg}$, $\\text{phút/giờ} \\to \\text{s}$, $\\text{km/h} \\div 3{,}6 \\to \\text{m/s}$).');
      lines.push('• Chú ý dấu cộng/trừ theo chiều dương đã chọn: vật đi ngược chiều dương thì vận tốc mang dấu âm, vật tỏa nhiệt hoặc sinh công cần xét đúng quy ước.');
    }
  } else {
    if (ctx?.csLevel === 'Cơ bản') {
      lines.push('• Đọc kỹ kiểu dữ liệu và giới hạn đầu vào: nếu tích hoặc tổng có thể vượt $2\\cdot 10^9$ hãy dùng `long long` (C++) hoặc số nguyên chuẩn trong Python.');
      lines.push('• Thử chạy tay với các bộ test nhỏ nhất ($N = 0$, $N = 1$, mảng toàn số bằng nhau) để chắc chắn vòng lặp không bị tràn chỉ số.');
    } else {
      lines.push('• Đánh giá giới hạn $N$ và giá trị lớn nhất của biến trung gian (dùng `long long` trong C++ nếu vượt $2\\cdot 10^9$ hoặc lấy modulo đúng bước).');
      lines.push('• Kiểm tra các trường hợp biên: $N = 0$, $N = 1$, mảng toàn số âm, phần tử trùng nhau hoặc đồ thị không liên thông.');
    }
  }

  if (commonTrap) {
    lines.push(`• Lưu ý hay sai: ${commonTrap}`);
  } else if (extraContext && extraContext.length < 180) {
    lines.push(`• Trọng tâm cần nhớ: ${extraContext}`);
  }

  return lines.join('\n');
}

function createFlashcardMCQ(
  id: string,
  card: { front: string; back: string; tip?: string },
  otherCards: { front: string; back: string }[],
  subject: 'math' | 'physics' | 'cs'
): LectureStepMCQ {
  const distractorPool: string[] = [];
  for (const oc of otherCards) {
    if (oc.back !== card.back && oc.back.length <= 160) {
      distractorPool.push(oc.back);
    }
  }
  const genericPool =
    subject === 'math'
      ? [
          'Chỉ đúng khi hàm số là hằng số trên toàn tập xác định $\\mathbb{R}$.',
          'Không thể xác định nếu chưa biết giá trị cụ thể của mọi tham số tự do.',
          'Luôn đổi dấu khi lấy đạo hàm cấp hai tại mọi điểm thuộc miền xác định.'
        ]
      : subject === 'physics'
      ? [
          'Chỉ áp dụng khi hệ đứng yên hoàn toàn trong chân không tuyệt đối.',
          'Đại lượng này luôn tỉ lệ nghịch với thời gian và không phụ thuộc vào môi trường.',
          'Giá trị luôn bằng $0$ tại mọi thời điểm trong suốt quá trình biến đổi.'
        ]
      : [
          'Thuật toán luôn chạy với độ phức tạp $O(N^3)$ nên không dùng được cho $N > 100$.',
          'Chỉ hoạt động đúng khi dữ liệu đầu vào đã được sắp xếp giảm dần nghiêm ngặt.',
          'Bắt buộc phải cấp phát bộ nhớ $O(N^2)$ nên sẽ bị tràn bộ nhớ.'
        ];

  const optionsRaw = [card.back];
  for (const d of [...distractorPool, ...genericPool]) {
    if (optionsRaw.length >= 4) break;
    if (!optionsRaw.includes(d)) optionsRaw.push(d);
  }

  // Deterministic rotation so correctIndex isn't always 0
  const shift = id.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0) % 4;
  const labels = ['A.', 'B.', 'C.', 'D.'];
  const rotated = optionsRaw.map((_, i) => optionsRaw[(i + (4 - shift)) % 4]);
  const correctIndex = rotated.indexOf(card.back);

  return {
    id,
    question: `Kiểm tra khái niệm: ${card.front}`,
    options: rotated.map((txt, idx) => `${labels[idx]} ${txt}`),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${card.back}${card.tip ? ` (Mẹo ghi nhớ: ${card.tip})` : ''}`
  };
}

function buildFormulaCheckMCQ(
  id: string,
  stepTitle: string,
  formula: string | undefined,
  otherFormulas: string[],
  subject: 'math' | 'physics' | 'cs',
  keyTakeaway?: string
): LectureStepMCQ {
  const cleanTitle = stripLeadingNumber(stepTitle);
  const seed = id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);

  if (formula && formula.trim().length > 0 && !formula.includes('\\text{')) {
    const wrappedTrue = `$${formula}$`;
    const candidates: string[] = [];
    for (const f of otherFormulas) {
      const wrapped = `$${f}$`;
      if (wrapped !== wrappedTrue && !candidates.includes(wrapped)) {
        candidates.push(wrapped);
      }
    }

    // Add realistic mathematical/physical variations as fallback distractors
    const variations = [
      formula.includes('+') ? `$${formula.replace('+', '-')}$` : `$${formula} + 1$`,
      formula.includes('\\frac')
        ? `$${formula.replace('\\frac', '\\frac{1}{2}\\cdot\\frac')}$`
        : `$${formula.replace('=', '\\neq')}$`,
      subject === 'physics'
        ? 'Hệ thức không tồn tại trong hệ đơn vị chuẩn SI'
        : subject === 'cs'
        ? '$\\mathcal{O}(N^3)$ (Vét cạn 3 vòng lặp lồng nhau)'
        : 'Không có hệ thức liên hệ xác định trong miền thực'
    ];

    const opts = [wrappedTrue];
    for (const c of [...candidates, ...variations]) {
      if (opts.length >= 4) break;
      if (!opts.includes(c)) opts.push(c);
    }
    while (opts.length < 4) {
      opts.push(`Phương án khác (${opts.length + 1})`);
    }

    const correctPos = seed % 4;
    const arranged = [...opts];
    [arranged[0], arranged[correctPos]] = [arranged[correctPos], arranged[0]];
    const labels = ['A.', 'B.', 'C.', 'D.'];

    return {
      id,
      question: `Hệ thức / công thức trọng tâm nào sau đây mô tả đúng nội dung "${cleanTitle}"?`,
      options: arranged.map((o, i) => `${labels[i]} ${o}`),
      correctIndex: correctPos,
      explanation: `Hệ thức chuẩn cho phần "${cleanTitle}" là $${formula}$.${
        keyTakeaway ? ` Lưu ý: ${keyTakeaway}` : ''
      }`
    };
  }

  // Fallback conceptual accuracy MCQ when no symbolic formula is isolated
  const trueStmt =
    keyTakeaway ||
    `Phải kiểm tra đầy đủ điều kiện xác định, đơn vị và các trường hợp biên trước khi kết luận ở phần "${cleanTitle}".`;

  const falseStmts =
    subject === 'math'
      ? [
          'Có thể bỏ qua điều kiện xác định của ẩn và tham số vì kết quả cuối luôn tự triệt tiêu.',
          'Mọi hàm số hoặc phương trình đều có cùng công thức nghiệm bất kể hệ số bậc cao bằng $0$.',
          'Không cần đối chiếu dấu của biểu thức hoặc đạo hàm khi tìm cực trị và tính đơn điệu.'
        ]
      : subject === 'physics'
      ? [
          'Có thể thay trực tiếp mọi đơn vị như $\\text{cm}$, $\\text{g}$, $\\text{phút}$ vào công thức SI mà không cần quy đổi.',
          'Các đại lượng vector như vận tốc, gia tốc, lực luôn luôn cộng đại số bỏ qua phương chiều.',
          'Mọi định luật bảo toàn vẫn giữ nguyên giá trị số ngay cả khi có lực ma sát lớn làm tỏa nhiệt.'
        ]
      : [
          'Không cần ước lượng giới hạn $N$ và giá trị lớn nhất của biến, luôn dùng kiểu `int` và `endl`.',
          'Thuật toán có độ phức tạp $O(N^2)$ luôn chạy dưới $1\\text{ giây}$ với $N = 10^6$.',
          'Không cần kiểm tra các trường hợp biên như $N = 0$, $N = 1$ hay mảng rỗng.'
        ];

  const correctPos = seed % 4;
  const arranged = [falseStmts[0], falseStmts[1], falseStmts[2]];
  arranged.splice(correctPos, 0, trueStmt);
  const labels = ['A.', 'B.', 'C.', 'D.'];

  return {
    id,
    question: `Nhận định nào sau đây là ĐÚNG và quan trọng nhất khi vận dụng nội dung "${cleanTitle}"?`,
    options: arranged.map((o, i) => `${labels[i]} ${o}`),
    correctIndex: correctPos,
    explanation: `Đáp án đúng là ${labels[correctPos].replace('.', '')}: ${trueStmt}`
  };
}

function buildConditionCheckMCQ(
  id: string,
  stepTitle: string,
  conceptText: string,
  subject: 'math' | 'physics' | 'cs',
  trap?: string
): LectureStepMCQ {
  const cleanTitle = stripLeadingNumber(stepTitle);
  const seed = id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const correctPos = (seed + 1) % 4;

  const trueAnswer =
    trap ||
    (subject === 'math'
      ? `Luôn rà soát điều kiện xác định, điều kiện tham số ($a \\ne 0$, $\\Delta$) và đối chiếu nghiệm sau khi biến đổi trong "${cleanTitle}".`
      : subject === 'physics'
      ? `Xác định rõ hệ quy chiếu, điều kiện áp dụng định luật và quy đổi chuẩn đơn vị SI trước khi thay số ở phần "${cleanTitle}".`
      : `Phân tích kỹ độ phức tạp Big-O theo giới hạn $N$, chọn kiểu dữ liệu tránh tràn số và xử lý test biên cho "${cleanTitle}".`);

  const distractors =
    subject === 'math'
      ? [
          'Thay ngay giá trị gần đúng bằng cảm tính mà không cần đặt điều kiện hay kiểm tra dấu.',
          'Áp dụng công thức cho trường hợp tổng quát ngay cả khi mẫu thức bằng $0$.',
          'Chỉ xét chiều biến thiên tăng dần và bỏ qua các điểm không xác định.'
        ]
      : subject === 'physics'
      ? [
          'Chỉ cần nhớ tên đại lượng mà không cần quan tâm điều kiện lý tưởng hay hệ quy chiếu.',
          'Cộng trực tiếp độ lớn các đại lượng mà không xét góc hợp hay chiều chuyển động.',
          'Luôn giả sử ma sát và lực cản bằng $0$ ngay cả khi đề bài cho hệ số ma sát $\\mu > 0$.'
        ]
      : [
          'Viết vòng lặp lồng nhau bất chấp $N = 10^5$ vì máy tính hiện đại luôn chạy kịp $1\\text{ giây}$.',
          'Bỏ qua `ios_base::sync_with_stdio(false)` và dùng `endl` trong vòng lặp $10^5$ lần.',
          'Luôn dùng `int` cho phép nhân $10^9 \\times 10^9$ vì kết quả sẽ tự động mở rộng.'
        ];

  const arranged = [...distractors];
  arranged.splice(correctPos, 0, trueAnswer);
  const labels = ['A.', 'B.', 'C.', 'D.'];

  const shortExcerpt = conceptText.split(/[.!?\n]/)[0]?.slice(0, 95) || cleanTitle;

  return {
    id,
    question: `Khi học và làm bài tập thuộc phần "${cleanTitle}" (${shortExcerpt}...), nguyên tắc bắt buộc nào giúp tránh mất điểm oan?`,
    options: arranged.map((o, i) => `${labels[i]} ${o}`),
    correctIndex: correctPos,
    explanation: `${trueAnswer}`
  };
}

function buildSectionMiniEssay(
  id: string,
  stepTitle: string,
  conceptText: string,
  formula: string | undefined,
  deepDiveText: string,
  subject: 'math' | 'physics' | 'cs',
  keyTakeaway?: string
): LectureStepMiniEssay {
  const cleanTitle = stripLeadingNumber(stepTitle);
  const formulaSnippet = formula ? ` và công thức $${formula}$` : '';

  if (subject === 'cs') {
    return {
      id,
      question: `Trong phần "${cleanTitle}", hãy trình bày ngắn gọn (3–5 dòng): (1) Ý tưởng cốt lõi của thuật toán/kỹ thuật này là gì? (2) Độ phức tạp thời gian & bộ nhớ đạt được, và một cạm bẫy cần tránh khi cài đặt?`,
      hint: keyTakeaway || 'Nêu rõ ý tưởng chính, độ phức tạp Big-O và lưu ý tràn số / trường hợp biên.',
      rubricChecklist: [
        'Nêu đúng bản chất tư duy hoặc cơ chế hoạt động của kỹ thuật trong bài.',
        'Chỉ ra được độ phức tạp / giới hạn dữ liệu phù hợp.',
        'Nhắc được ít nhất 1 lưu ý quan trọng khi cài đặt (tràn số, Fast I/O, test biên).'
      ],
      sampleAnswer: `${conceptText.slice(0, 260)}\n\nLưu ý cài đặt: ${keyTakeaway || deepDiveText.slice(0, 200)}`
    };
  }

  return {
    id,
    question: `Dựa vào kiến thức phần "${cleanTitle}", hãy nêu ngắn gọn (3–5 dòng): (1) Bản chất khái niệm${formulaSnippet}; (2) Điều kiện áp dụng hoặc lỗi sai thường gặp nhất khi làm bài?`,
    hint: keyTakeaway || 'Trình bày ngắn gọn định nghĩa, ý nghĩa các đại lượng và điều kiện áp dụng.',
    rubricChecklist: [
      `Trình bày đúng khái niệm / hệ thức cốt lõi${formula ? ` ($${formula}$)` : ''}.`,
      'Giải thích rõ ý nghĩa các đại lượng hoặc biến số trong công thức.',
      'Nêu đúng điều kiện áp dụng hoặc cạm bẫy cần tránh.'
    ],
    sampleAnswer: `${conceptText.slice(0, 260)}${formula ? `\nCông thức trọng tâm: $${formula}$.` : ''}\nLưu ý quan trọng: ${keyTakeaway || deepDiveText.slice(0, 200)}`
  };
}

// ============================================================================
// 1. PHYSICS LECTURE STEPS BUILDER
// ============================================================================

export function buildPhysicsLectureSteps(lesson: PhysicsLesson): LectureStep[] {
  const custom = PHYSICS_CUSTOM_LECTURE_STEPS[lesson.id];
  if (custom && custom.length > 0) {
    return custom.map((st, idx) => {
      const primaryFormula = st.formulaSection?.primaryFormula || st.formulaHighlight || lesson.keyFormulas[idx];
      const conceptSection = st.conceptSection || st.teacherExplanation;
      const deepDiveSection =
        st.deepDiveSection ||
        `${st.teacherExplanation}${st.keyTakeaway ? `\n\n• **Điểm mấu chốt**: ${st.keyTakeaway}` : ''}`;

      const mcqs: LectureStepMCQ[] =
        st.miniQuiz && st.miniQuiz.length >= 2
          ? st.miniQuiz.slice(0, 2)
          : [
              buildFormulaCheckMCQ(
                `${lesson.id}-s${idx}-q1`,
                st.stepTitle,
                primaryFormula,
                lesson.keyFormulas,
                'physics',
                st.keyTakeaway
              ),
              buildConditionCheckMCQ(
                `${lesson.id}-s${idx}-q2`,
                st.stepTitle,
                conceptSection,
                'physics',
                st.keyTakeaway
              )
            ];

      const miniEssay: LectureStepMiniEssay =
        st.miniEssay ||
        buildSectionMiniEssay(
          `${lesson.id}-s${idx}-e1`,
          st.stepTitle,
          conceptSection,
          primaryFormula,
          deepDiveSection,
          'physics',
          st.keyTakeaway
        );

      return {
        ...st,
        conceptSection,
        formulaSection: st.formulaSection || (primaryFormula ? {
          primaryFormula,
          secondaryFormulas: lesson.keyFormulas.filter((f) => f !== primaryFormula).slice(0, 2),
          variablesNote: buildVariablesNote('physics', primaryFormula, lesson.subtitle, st.keyTakeaway, {
            track: lesson.track,
            tier: lesson.tier,
            grade: lesson.grade
          })
        } : undefined),
        deepDiveSection,
        miniQuiz: mcqs,
        miniEssay
      };
    });
  }

  // Dynamic structured multi-part builder for all other Physics lessons
  const rawSteps: LectureStep[] = [];
  const mcqsPool = lesson.practiceExercises || [];
  const essaysPool = lesson.essayExercises || [];
  let mcqCursor = 0;
  let essayCursor = 0;
  const pedCtx: PedagogicalContext = {
    track: lesson.track,
    tier: lesson.tier,
    grade: lesson.grade
  };

  const takeNextPracticeMCQ = (stepIdx: number, slot: number): LectureStepMCQ | null => {
    if (mcqCursor >= mcqsPool.length) return null;
    const item = mcqsPool[mcqCursor++];
    return {
      id: `${lesson.id}-s${stepIdx}-prac-${slot}`,
      question: item.question,
      options: item.options,
      correctIndex: item.correctIndex,
      explanation: item.explanation
    };
  };

  const takeNextEssay = (stepIdx: number): LectureStepMiniEssay | null => {
    if (essayCursor >= essaysPool.length) return null;
    const item = essaysPool[essayCursor++];
    return {
      id: `${lesson.id}-s${stepIdx}-essay`,
      question: item.question,
      hint: item.hints?.[0],
      rubricChecklist: item.solutionSteps.slice(0, 3),
      sampleAnswer: `${item.solutionSteps.join('\n')}\n→ Kết quả: ${item.finalAnswer}`
    };
  };

  const tierGuidance =
    lesson.tier === 'Cơ bản'
      ? 'Bậc Cơ bản Chuyên (cầu nối từ SGK lên tư duy phân tích hệ nhiều vật / mạch điện)'
      : lesson.tier === 'Chuyên / HSG'
      ? 'Bậc Chuyên / HSG (bài toán tổng hợp nhiều giai đoạn, cực trị vật lí & biện luận chặt)'
      : 'Bậc Nâng cao Chuyên (kỹ thuật biến đổi mô hình và phương trình liên kết)';

  // Part 1..K from theorySections (each section is a dedicated Concept + Formula + Deep Dive part)
  lesson.theorySections.forEach((sec, idx) => {
    const inlineFormulas = extractInlineFormulas(sec.content);
    const primaryFormula = lesson.keyFormulas[idx] || inlineFormulas[0] || lesson.keyFormulas[0];
    const secondaryFormulas = [
      ...inlineFormulas.filter((f) => f !== primaryFormula),
      ...lesson.keyFormulas.filter((f) => f !== primaryFormula && !inlineFormulas.includes(f))
    ].slice(0, 2);

    const sentences = sec.content.split('\n').map((s) => s.trim()).filter(Boolean);
    const conceptSection =
      sentences.length > 0
        ? `${sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join('\n')}\n\n• **Định hướng học phần này**: ${
            lesson.track === 'chuyen'
              ? `Khu Chuyên Lí · ${tierGuidance} (${lesson.grade}).`
              : `${lesson.grade} · Chuẩn chương trình phổ thông (hiểu bản chất hiện tượng trước rồi mới thay số tính toán).`
          }`
        : sec.content;

    const deepDiveSection =
      lesson.track === 'chuyen'
        ? `${sec.content}\n\n**Phân tích Chuyên sâu & Phương pháp giải bài Chuyên**:\n• Xây dựng mô hình vật lí đầy đủ (chọn hệ quy chiếu, phân tích điều kiện biên/ràng buộc hình học hoặc nút mạch) trước khi lập phương trình.\n• Kiểm tra thứ nguyên công thức kết quả và xét trường hợp giới hạn đặc biệt để tự kiểm chứng.`
        : `${sec.content}\n\n**Cách hiểu nhanh & Mẹo làm bài ${lesson.grade}**:\n• Tóm tắt các đại lượng đề bài đã cho và đổi ngay về đơn vị chuẩn ($\\text{m}$, $\\text{kg}$, $\\text{s}$, $\\text{V}$, $\\text{A}$, $\\Omega$) để không bị lệch kết quả.\n• Hình dung hiện tượng thực tế hoặc vẽ nhanh sơ đồ minh họa để xác định đúng chiều chuyển động / dấu của đại lượng rồi mới áp dụng công thức.`;

    const keyTakeaway =
      lesson.track === 'chuyen'
        ? `Nắm chắc điều kiện giới hạn và cách lập phương trình tổng quát cho mục "${stripLeadingNumber(sec.heading)}".`
        : `Hiểu rõ ý nghĩa từng đại lượng và đổi đúng đơn vị khi áp dụng phần "${stripLeadingNumber(sec.heading)}".`;

    const q1 =
      takeNextPracticeMCQ(idx, 1) ||
      buildFormulaCheckMCQ(
        `${lesson.id}-s${idx}-q1`,
        sec.heading,
        primaryFormula,
        lesson.keyFormulas,
        'physics',
        keyTakeaway
      );
    const q2 =
      takeNextPracticeMCQ(idx, 2) ||
      buildConditionCheckMCQ(
        `${lesson.id}-s${idx}-q2`,
        sec.heading,
        sec.content,
        'physics'
      );

    const essay =
      takeNextEssay(idx) ||
      buildSectionMiniEssay(
        `${lesson.id}-s${idx}-e1`,
        sec.heading,
        sec.content,
        primaryFormula,
        deepDiveSection,
        'physics',
        keyTakeaway
      );

    rawSteps.push({
      stepTitle: sec.heading,
      stepType: idx === 0 ? 'concept' : 'derivation',
      conceptSection,
      formulaSection: {
        primaryFormula,
        secondaryFormulas,
        variablesNote: buildVariablesNote('physics', primaryFormula, lesson.subtitle, undefined, pedCtx)
      },
      deepDiveSection,
      teacherExplanation: sec.content,
      formulaHighlight: primaryFormula,
      workedExample:
        idx === lesson.theorySections.length - 1 && essaysPool[0]
          ? {
              problem: essaysPool[0].question,
              steps: essaysPool[0].solutionSteps,
              answer: essaysPool[0].finalAnswer
            }
          : undefined,
      keyTakeaway,
      miniQuiz: [q1, q2],
      miniEssay: essay
    });
  });

  // Final Part: Experiment & Simulation Verification
  const paramNames = Object.values(lesson.paramBounds)
    .map((b) => `${b.label} (${b.unit})`)
    .join(', ');
  const expIdx = rawSteps.length;
  const expFormula = lesson.keyFormulas[0];
  const expConcept =
    lesson.track === 'chuyen'
      ? `Thí nghiệm mô phỏng 2D & 3D giúp kiểm chứng định lượng các hệ thức và điểm giới hạn trong "${lesson.title.split(':')[0]}" bằng cách thay đổi: ${paramNames}.`
      : `Thực hành trên mô phỏng 2D & 3D giúp em trực tiếp nhìn thấy sự thay đổi của bài "${lesson.title.split(':')[0]}" khi kéo chỉnh: ${paramNames}.`;
  const expDeepDive =
    lesson.track === 'chuyen'
      ? `• Áp dụng phương pháp **biến kiểm soát**: thay đổi từng tham số một (giữ nguyên các biến còn lại) và bấm **Ghi mẫu đo** để lập bảng đối chiếu với công thức lý thuyết.\n• Bật **Vector**, **Dấu vết quỹ đạo** hoặc **Đồ thị thời gian thực** để kiểm tra dấu hiệu cực trị và giới hạn mô hình.`
      : `• Thử thay đổi **từng thanh trượt một** (giữ nguyên các thông số còn lại) rồi bấm **Ghi mẫu đo** để quan sát trực quan đại lượng tăng hay giảm.\n• Bật **Vector** hoặc **Đồ thị** ngay trên màn hình thí nghiệm để hiểu vì sao công thức lại có dạng như vậy.`;

  rawSteps.push({
    stepTitle: `${expIdx + 1}. Thực hành Kiểm chứng trên Thí nghiệm 2D & Mô hình 3D`,
    stepType: 'experiment',
    conceptSection: expConcept,
    formulaSection: expFormula
      ? {
          primaryFormula: expFormula,
          secondaryFormulas: lesson.keyFormulas.slice(1, 3),
          variablesNote: `Các thông số điều chỉnh được trong phòng thí nghiệm ảo: ${paramNames}.`
        }
      : undefined,
    deepDiveSection: expDeepDive,
    teacherExplanation: expDeepDive,
    keyTakeaway:
      lesson.track === 'chuyen'
        ? 'Ghi lại ít nhất 3 mẫu đo để đối chiếu sai số và kiểm chứng quy luật hàm số trong công thức.'
        : 'Ghi lại ít nhất 3 mẫu đo khác nhau để tự thấy mối liên hệ tăng – giảm giữa các đại lượng trong bài.',
    miniQuiz: [
      takeNextPracticeMCQ(expIdx, 1) ||
        buildFormulaCheckMCQ(
          `${lesson.id}-s${expIdx}-q1`,
          'Kiểm chứng thí nghiệm 2D',
          expFormula,
          lesson.keyFormulas,
          'physics',
          'Khi khảo sát thí nghiệm, chỉ thay đổi từng thông số một để nhận ra đúng quy luật phụ thuộc.'
        ),
      takeNextPracticeMCQ(expIdx, 2) ||
        buildConditionCheckMCQ(
          `${lesson.id}-s${expIdx}-q2`,
          'Kiểm chứng thí nghiệm 2D',
          expConcept,
          'physics',
          'Luôn giữ cố định các thông số còn lại khi khảo sát sự thay đổi của một đại lượng.'
        )
    ],
    miniEssay:
      takeNextEssay(expIdx) ||
      buildSectionMiniEssay(
        `${lesson.id}-s${expIdx}-e1`,
        'Thực hành Kiểm chứng Thí nghiệm',
        expConcept,
        expFormula,
        expDeepDive,
        'physics',
        'Thay đổi từng tham số và so sánh số liệu đo được với giá trị tính từ công thức lý thuyết.'
      )
  });

  return rawSteps;
}

// ============================================================================
// 2. MATH LECTURE STEPS BUILDER
// ============================================================================

export function buildMathLectureSteps(lecture: MathLecture): LectureStep[] {
  const pedCtx: PedagogicalContext = {
    track: lecture.track || 'khong_chuyen',
    tier: lecture.tier,
    grade: lecture.gradeGroup || lecture.grade
  };
  const isChuyenMath = pedCtx.track === 'chuyen';

  if (lecture.lectureSteps && lecture.lectureSteps.length > 0) {
    return lecture.lectureSteps.map((st, idx) => {
      const primaryFormula = st.formulaSection?.primaryFormula || st.formulaHighlight || lecture.keyFormulas[idx];
      const conceptSection = st.conceptSection || st.teacherExplanation;
      const deepDiveSection =
        st.deepDiveSection ||
        `${st.teacherExplanation}${st.keyTakeaway ? `\n\n• **Bí kíp nhớ nhanh**: ${st.keyTakeaway}` : ''}`;

      return {
        ...st,
        conceptSection,
        formulaSection: st.formulaSection || (primaryFormula ? {
          primaryFormula,
          secondaryFormulas: lecture.keyFormulas.filter((f) => f !== primaryFormula).slice(0, 2),
          variablesNote: buildVariablesNote('math', primaryFormula, lecture.description, lecture.commonTraps?.[idx], pedCtx)
        } : undefined),
        deepDiveSection,
        miniQuiz:
          st.miniQuiz && st.miniQuiz.length >= 2
            ? st.miniQuiz.slice(0, 2)
            : [
                buildFormulaCheckMCQ(`${lecture.id}-s${idx}-q1`, st.stepTitle, primaryFormula, lecture.keyFormulas, 'math', st.keyTakeaway),
                buildConditionCheckMCQ(`${lecture.id}-s${idx}-q2`, st.stepTitle, conceptSection, 'math', lecture.commonTraps?.[idx])
              ],
        miniEssay:
          st.miniEssay ||
          buildSectionMiniEssay(`${lecture.id}-s${idx}-e1`, st.stepTitle, conceptSection, primaryFormula, deepDiveSection, 'math', st.keyTakeaway)
      };
    });
  }

  const steps: LectureStep[] = [];
  const mcqsPool = lecture.sampleProblems || [];
  const flashcardsPool = lecture.flashcards || [];
  const essaysPool = lecture.essayProblems || [];
  let mcqCursor = 0;
  let flashCursor = 0;
  let essayCursor = 0;

  const takeMCQ = (stepIdx: number, slot: number): LectureStepMCQ | null => {
    if (mcqCursor < mcqsPool.length) {
      const p = mcqsPool[mcqCursor++];
      return {
        id: `${lecture.id}-s${stepIdx}-mcq-${slot}`,
        question: p.question,
        options: p.options,
        correctIndex: p.correctIndex,
        explanation: p.explanation
      };
    }
    if (flashCursor < flashcardsPool.length) {
      const card = flashcardsPool[flashCursor++];
      return createFlashcardMCQ(`${lecture.id}-s${stepIdx}-fc-${slot}`, card, flashcardsPool, 'math');
    }
    return null;
  };

  const takeEssay = (stepIdx: number): LectureStepMiniEssay | null => {
    if (essayCursor < essaysPool.length) {
      const e = essaysPool[essayCursor++];
      return {
        id: `${lecture.id}-s${stepIdx}-essay`,
        question: e.question,
        hint: e.hints?.[0],
        rubricChecklist: e.solutionSteps.slice(0, 3),
        sampleAnswer: `${e.solutionSteps.join('\n')}\n→ Kết luận: ${e.finalAnswer}`
      };
    }
    return null;
  };

  // Group or expand theory points into well-paced content/formula sections (4 to 6 parts)
  const theoryItems = lecture.theory && lecture.theory.length > 0 ? lecture.theory : [lecture.description];
  const partCount = Math.max(theoryItems.length, Math.min(4, lecture.keyFormulas.length));

  for (let idx = 0; idx < partCount; idx++) {
    const rawTheory = theoryItems[idx] || lecture.description;
    const inlineFormulas = extractInlineFormulas(rawTheory);
    const primaryFormula =
      lecture.keyFormulas[idx] || inlineFormulas[0] || lecture.keyFormulas[0];
    const secondaryFormulas = [
      ...inlineFormulas.filter((f) => f !== primaryFormula),
      ...lecture.keyFormulas.filter((f) => f !== primaryFormula && !inlineFormulas.includes(f))
    ].slice(0, 2);

    const rawTitle = rawTheory.includes(':')
      ? rawTheory.split(':')[0].replace(/\*\*/g, '').trim()
      : `Nội dung trọng tâm ${idx + 1}`;
    const stepTitle =
      rawTitle.length > 65
        ? `${idx + 1}. Kiến thức & Công thức phần ${idx + 1}`
        : /^\d+\./.test(rawTitle)
        ? rawTitle
        : `${idx + 1}. ${rawTitle}`;

    const mnemonic = lecture.mnemonics?.[idx % Math.max(1, lecture.mnemonics?.length || 1)];
    const trap = lecture.commonTraps?.[idx % Math.max(1, lecture.commonTraps?.length || 1)];

    const mathTierLabel =
      lecture.tier === 'Cơ bản'
        ? 'Chuyên Toán · Bậc Cơ bản (luyện nền tảng chứng minh & biến đổi chuẩn)'
        : lecture.tier === 'Chuyên / HSG'
        ? 'Chuyên Toán · Bậc Chuyên / HSG (biện luận sâu, cực trị & bất biến Olympiad)'
        : 'Chuyên Toán · Bậc Nâng cao (kỹ thuật biến đổi & tách ghép đa bước)';

    const conceptSection = isChuyenMath
      ? `${rawTheory}\n\n• **Định hướng ${mathTierLabel}**: Nắm vững giả thiết cần và đủ, cấu trúc chứng minh và điều kiện xảy ra dấu bằng trước khi biến đổi.`
      : `${rawTheory}\n\n• **Trọng tâm ${lecture.grade}**: Hiểu rõ ý nghĩa của công thức và đặt đúng điều kiện xác định trước khi bắt tay vào tính toán.`;

    const deepDiveSection = isChuyenMath
      ? [
          `**Phân tích Chuyên sâu & Chiến thuật giải đề Chuyên / HSG**:`,
          mnemonic ? `• **Ý tưởng then chốt**: ${mnemonic}` : `• Tìm đại lượng bất biến, đánh giá điểm rơi hoặc liên hệ hình học để rút gọn phép biến đổi.`,
          trap ? `• **Lỗi mất điểm thường gặp**: ${trap}` : `• Kiểm tra kỹ điều kiện áp dụng bất đẳng thức/đồng dư và biện luận mọi trường hợp suy biến.`,
          idx === 0 && lecture.description ? `• **Tổng quan chuyên đề**: ${lecture.description}` : ''
        ]
          .filter(Boolean)
          .join('\n')
      : [
          `**Giải thích dễ hiểu & Mẹo làm bài thi THPT**:`,
          mnemonic ? `• **Mẹo nhớ nhanh**: ${mnemonic}` : `• Vẽ nhanh hình minh họa hoặc thử một vài giá trị số cụ thể để hình dung quy luật trước khi giải tổng quát.`,
          trap ? `• **Cẩn thận lỗi hay nhầm**: ${trap}` : `• Đừng quên kiểm tra điều kiện xác định (mẫu khác $0$, căn không âm) và đối chiếu nghiệm sau khi giải.`,
          idx === 0 && lecture.description ? `• **Nội dung chính của bài**: ${lecture.description}` : ''
        ]
          .filter(Boolean)
          .join('\n');

    const keyTakeaway =
      mnemonic ||
      trap ||
      (isChuyenMath
        ? 'Kiểm tra chặt chẽ điều kiện tương đương, trường hợp suy biến và dấu đẳng thức ở mỗi bước.'
        : 'Viết điều kiện xác định ngay dòng đầu tiên và kiểm tra lại kết quả trước khi chọn đáp án.');

    const workedExample =
      idx === partCount - 1 && essaysPool[0]
        ? {
            problem: essaysPool[0].question,
            steps: essaysPool[0].solutionSteps,
            answer: essaysPool[0].finalAnswer
          }
        : undefined;

    const q1 =
      takeMCQ(idx, 1) ||
      buildFormulaCheckMCQ(
        `${lecture.id}-s${idx}-q1`,
        stepTitle,
        primaryFormula,
        lecture.keyFormulas,
        'math',
        keyTakeaway
      );
    const q2 =
      takeMCQ(idx, 2) ||
      buildConditionCheckMCQ(
        `${lecture.id}-s${idx}-q2`,
        stepTitle,
        rawTheory,
        'math',
        trap
      );

    const essay =
      takeEssay(idx) ||
      buildSectionMiniEssay(
        `${lecture.id}-s${idx}-e1`,
        stepTitle,
        rawTheory,
        primaryFormula,
        deepDiveSection,
        'math',
        keyTakeaway
      );

    steps.push({
      stepTitle,
      stepType: idx === 0 ? 'concept' : idx === partCount - 1 ? 'example' : 'derivation',
      conceptSection,
      formulaSection: primaryFormula
        ? {
            primaryFormula,
            secondaryFormulas,
            variablesNote: buildVariablesNote('math', primaryFormula, lecture.description, trap, pedCtx)
          }
        : undefined,
      deepDiveSection,
      teacherExplanation: rawTheory,
      formulaHighlight: primaryFormula,
      workedExample,
      keyTakeaway,
      miniQuiz: [q1, q2],
      miniEssay: essay
    });
  }

  return steps;
}

// ============================================================================
// 3. COMPUTER SCIENCE LECTURE STEPS BUILDER
// ============================================================================

export function buildCSLectureSteps(lesson: CSLesson): LectureStep[] {
  const baseSteps: LectureStep[] =
    lesson.lectureSteps && lesson.lectureSteps.length > 0
      ? lesson.lectureSteps
      : lesson.theory.map((tItem, idx) => {
          const cleanTitle = tItem.includes(':')
            ? tItem.split(':')[0].replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim()
            : `Kiến thức cốt lõi ${idx + 1}`;
          const codeEx = lesson.codeExamples[idx % Math.max(1, lesson.codeExamples.length)];

          return {
            stepTitle: `${idx + 1}. ${cleanTitle.length > 62 ? `Nội dung phần ${idx + 1}` : cleanTitle}`,
            stepType: idx === 0 ? 'concept' : 'derivation',
            teacherExplanation: tItem,
            codeSnippet: codeEx
              ? {
                  language: codeEx.language,
                  title: codeEx.title,
                  code: codeEx.code
                }
              : undefined,
            keyTakeaway:
              codeEx?.explanation ||
              `Độ phức tạp mục tiêu: Time ${lesson.complexity.time}, Space ${lesson.complexity.space}.`
          };
        });

  // Add a dedicated worked-example step from practiceProblem if none of the steps has a workedExample
  const enrichedInput: LectureStep[] = [...baseSteps];
  if (!enrichedInput.some((s) => s.workedExample) && lesson.practiceProblem) {
    const sample = lesson.practiceProblem.sampleCases?.[0];
    enrichedInput.push({
      stepTitle: `${enrichedInput.length + 1}. Phân tích Bài toán Áp dụng: ${lesson.practiceProblem.title}`,
      stepType: 'example',
      teacherExplanation: `${lesson.practiceProblem.description}\n\n**Phân tích thuật toán chuẩn**: ${lesson.practiceProblem.solutionAnalysis}`,
      workedExample: {
        problem: lesson.practiceProblem.description,
        steps: [
          `Bước 1 (Đọc hiểu I/O): Input: ${lesson.practiceProblem.inputFormat} | Output: ${lesson.practiceProblem.outputFormat}`,
          ...(sample
            ? [
                `Bước 2 (Chạy tay test mẫu): Input "${sample.input}" → Output "${sample.output}"${
                  sample.explanation ? ` (${sample.explanation})` : ''
                }`
              ]
            : []),
          `Bước 3 (Phân tích & Tối ưu): ${lesson.practiceProblem.solutionAnalysis}`
        ],
        answer: `Time Complexity: ${lesson.complexity.time} · Space Complexity: ${lesson.complexity.space}`
      },
      codeSnippet: {
        language: 'cpp',
        title: `Lời giải tham khảo C++ (${lesson.practiceProblem.title})`,
        code: lesson.practiceProblem.fullSolutionCpp
      },
      keyTakeaway: `Luôn tự chạy tay trên test mẫu và kiểm tra giới hạn ${lesson.complexity.time} trước khi nhấn Nộp bài.`
    });
  }

  return enrichedInput.map((st, idx) => {
    const inlineFormulas = extractInlineFormulas(st.teacherExplanation);
    const complexityFormula = `\\text{Time: } ${lesson.complexity.time.replace(/O\(/g, '\\mathcal{O}(')}, \\quad \\text{Space: } ${lesson.complexity.space.replace(/O\(/g, '\\mathcal{O}(')}`;
    const primaryFormula =
      st.formulaSection?.primaryFormula ||
      st.formulaHighlight ||
      inlineFormulas[0] ||
      complexityFormula;

    const conceptSection = st.conceptSection || st.teacherExplanation;
    const csDeepDiveHint =
      lesson.level === 'Cơ bản'
        ? `**Hướng dẫn cài đặt & Lưu ý nhập môn (${lesson.level})**:\n• Chạy tay từng bước thuật toán với 1 bộ dữ liệu nhỏ để hiểu rõ biến chạy thay đổi thế nào.\n• Chú ý kiểu dữ liệu (\`long long\` nếu số vượt $2\\cdot 10^9$) và trường hợp biên ($N = 0, N = 1$).`
        : lesson.level === 'Trung cấp'
        ? `**Tối ưu thuật toán & Lưu ý thực hành (${lesson.level})**:\n• Đối chiếu độ phức tạp \`${lesson.complexity.time}\` với giới hạn $N$ của đề bài để chọn thuật toán đủ nhanh dưới $1\\text{ giây}$.\n• Kiểm tra khởi tạo mảng/giá trị ban đầu và các trường hợp biên ($N = 1$, phần tử trùng lặp, số âm).`
        : `**Phân tích chuyên sâu & Bẫy thi HSG Tin học (${lesson.level})**:\n• Kiểm soát chặt độ phức tạp \`${lesson.complexity.time}\` (ngưỡng $\\approx 10^8$ phép tính/giây), bộ nhớ \`${lesson.complexity.space}\` và phép nhân/cộng cần \`long long\` hoặc modulo.\n• Kiểm tra mọi test biên: đồ thị không liên thông, chu trình âm, $N = 0/1$ và dùng Fast I/O tránh TLE.`;

    const deepDiveSection = st.deepDiveSection || `${st.teacherExplanation}\n\n${csDeepDiveHint}`;

    const mcqs: LectureStepMCQ[] =
      st.miniQuiz && st.miniQuiz.length >= 2
        ? st.miniQuiz.slice(0, 2)
        : [
            {
              id: `${lesson.id}-s${idx}-q1`,
              question: `Với bài học "${lesson.title}", độ phức tạp thời gian và không gian chuẩn cần đạt ở phần "${stripLeadingNumber(st.stepTitle)}" là:`,
              options: [
                `A. Time: ${lesson.complexity.time} | Space: ${lesson.complexity.space}`,
                'B. Time: O(N^3) | Space: O(N^2)',
                'C. Time: O(2^N) | Space: O(N!)',
                'D. Không thể đánh giá được bằng ký hiệu Big-O'
              ],
              correctIndex: 0,
              explanation: `Thiết kế chuẩn của bài "${lesson.title}" đạt Time ${lesson.complexity.time} và Space ${lesson.complexity.space}.`
            },
            buildConditionCheckMCQ(
              `${lesson.id}-s${idx}-q2`,
              st.stepTitle,
              conceptSection,
              'cs',
              st.keyTakeaway
            )
          ];

    const miniEssay: LectureStepMiniEssay =
      st.miniEssay ||
      buildSectionMiniEssay(
        `${lesson.id}-s${idx}-e1`,
        st.stepTitle,
        conceptSection,
        primaryFormula,
        deepDiveSection,
        'cs',
        st.keyTakeaway
      );

    return {
      ...st,
      conceptSection,
      formulaSection: st.formulaSection || {
        primaryFormula,
        secondaryFormulas: inlineFormulas.filter((f) => f !== primaryFormula).slice(0, 2),
        variablesNote: buildVariablesNote('cs', primaryFormula, lesson.topic, st.keyTakeaway, {
          csLevel: lesson.level
        })
      },
      deepDiveSection,
      miniQuiz: mcqs,
      miniEssay
    };
  });
}
