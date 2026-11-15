import {
  CSLesson,
  LectureStep,
  LectureStepFormulaSection,
  LectureStepMCQ,
  LectureStepMiniEssay,
  MathLecture,
  PhysicsLesson
} from '../types';
import { PHYSICS_CUSTOM_LECTURE_STEPS } from './physicsLectureSteps';

// ============================================================================
// SHARED HELPERS FOR EXTRACTING FORMULAS, CONCEPTS & BUILDING STEP QUIZZES
// ============================================================================

function extractInlineFormulas(text: string): string[] {
  const found: string[] = [];
  const regex = /\$([^$]+)\$/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const candidate = match[1].trim();
    if (
      candidate.length >= 3 &&
      candidate.length <= 140 &&
      (/[=<>\\^_{}]/.test(candidate) || candidate.includes('O(')) &&
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
  commonTrap?: string
): string {
  const lines: string[] = [];
  if (subject === 'math') {
    lines.push('• Kiểm tra điều kiện xác định của ẩn/biến, mẫu số ($\\ne 0$), biểu thức trong căn ($\ge 0$) hoặc cơ số ($> 0, \\ne 1$) trước khi áp dụng.');
    if (formula && /[a-zA-Z]/.test(formula)) {
      lines.push('• Chú ý phân biệt tham số ($m$, $a$, $b$, $c$) với biến số độc lập ($x$, $t$); xét riêng trường hợp hệ số bậc cao nhất bằng $0$ nếu có tham số.');
    }
  } else if (subject === 'physics') {
    lines.push('• Đổi đồng nhất toàn bộ đại lượng sang hệ đo lường chuẩn SI ($\text{m}$, $\text{kg}$, $\text{s}$, $\text{N}$, $\text{J}$, $\text{W}$, $\text{A}$, $\text{V}$, $\\Omega$) trước khi bấm máy.');
    lines.push('• Chú ý quy ước dấu đại số theo chiều dương đã chọn (đặc biệt với vận tốc, gia tốc, li độ và nhiệt lượng).');
  } else {
    lines.push('• Đánh giá giới hạn $N$ và giá trị lớn nhất của biến trung gian (dùng `long long` trong C++ nếu vượt $2\\cdot 10^9$).');
    lines.push('• Kiểm tra các trường hợp biên: $N = 0$, $N = 1$, mảng toàn số âm, phần tử trùng nhau hoặc đồ thị không liên thông.');
  }

  if (commonTrap) {
    lines.push(`• Lưu ý bẫy hay gặp: ${commonTrap}`);
  } else if (extraContext && extraContext.length < 180) {
    lines.push(`• Trọng tâm: ${extraContext}`);
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
          variablesNote: buildVariablesNote('physics', primaryFormula, lesson.subtitle, st.keyTakeaway)
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
        ? `${sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join('\n')}\n\n• **Phạm vi bài học**: ${
            lesson.track === 'chuyen'
              ? `Khu Chuyên Lí (${lesson.tier || 'Nâng cao'}) · ${lesson.grade}`
              : `${lesson.grade} · Chương trình GDPT`
          }`
        : sec.content;

    const deepDiveSection = `${sec.content}\n\n**Giải thích sâu & Lưu ý vận dụng**:\n• Xác định chính xác đối tượng khảo sát, hệ quy chiếu và chiều dương trước khi viết biểu thức đại số.\n• Đối chiếu đơn vị toàn bộ đại lượng về chuẩn SI trước khi thay số và kiểm tra tính hợp lý vật lí của đáp số.`;

    const keyTakeaway = `Nắm vững ý nghĩa vật lí và điều kiện áp dụng của mục "${stripLeadingNumber(sec.heading)}".`;

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
        variablesNote: buildVariablesNote('physics', primaryFormula, lesson.subtitle)
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
  const expConcept = `Thực nghiệm 2D & 3D giúp kiểm chứng trực tiếp mối liên hệ định lượng giữa các đại lượng trong bài "${lesson.title.split(':')[0]}" thông qua thay đổi các tham số: ${paramNames}.`;
  const expDeepDive = `• Áp dụng phương pháp **biến kiểm soát**: mỗi lần chỉ thay đổi một tham số đầu vào (giữ nguyên các tham số còn lại) và bấm **Ghi mẫu đo** để lập bảng số liệu.\n• Bật **Vector**, **Dấu vết quỹ đạo** hoặc **Đồ thị thời gian thực** để liên hệ trực giác hình ảnh với công thức lý thuyết.`;

  rawSteps.push({
    stepTitle: `${expIdx + 1}. Thực hành Kiểm chứng trên Thí nghiệm 2D & Mô hình 3D`,
    stepType: 'experiment',
    conceptSection: expConcept,
    formulaSection: expFormula
      ? {
          primaryFormula: expFormula,
          secondaryFormulas: lesson.keyFormulas.slice(1, 3),
          variablesNote: `Các thông số điều chỉnh được trong Lab 2D: ${paramNames}.`
        }
      : undefined,
    deepDiveSection: expDeepDive,
    teacherExplanation: expDeepDive,
    keyTakeaway:
      'Ghi lại ít nhất 3 mẫu đo với tham số khác nhau để tự kiểm chứng quy luật tỉ lệ thuận/nghịch trong công thức.',
    miniQuiz: [
      takeNextPracticeMCQ(expIdx, 1) ||
        buildFormulaCheckMCQ(
          `${lesson.id}-s${expIdx}-q1`,
          'Kiểm chứng thí nghiệm 2D',
          expFormula,
          lesson.keyFormulas,
          'physics',
          'Phương pháp biến kiểm soát: thay đổi từng biến độc lập để đo phản ứng hệ.'
        ),
      takeNextPracticeMCQ(expIdx, 2) ||
        buildConditionCheckMCQ(
          `${lesson.id}-s${expIdx}-q2`,
          'Kiểm chứng thí nghiệm 2D',
          expConcept,
          'physics',
          'Luôn giữ cố định các biến còn lại khi khảo sát sự phụ thuộc theo một đại lượng.'
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
          variablesNote: buildVariablesNote('math', primaryFormula, lecture.description, lecture.commonTraps?.[idx])
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

    const conceptSection = `${rawTheory}\n\n• **Mục tiêu tư duy phần này**: Nắm rõ định nghĩa, điều kiện tồn tại và ý nghĩa hình học/đại số trước khi biến đổi biểu thức.`;
    const deepDiveSection = [
      `**Phân tích chuyên sâu & Cách nhận dạng bài toán**:`,
      mnemonic ? `• **Mẹo nhớ bản chất**: ${mnemonic}` : `• Luôn liên hệ biểu thức đại số với hình dáng đồ thị hoặc mô hình hình học để kiểm tra nhanh tính hợp lý.`,
      trap ? `• **Cảnh báo lỗi sai hay gặp**: ${trap}` : `• Kiểm tra kỹ các giá trị biên (hệ số bằng $0$, nghiệm kép, điều kiện mẫu số và căn thức).`,
      idx === 0 && lecture.description ? `• **Tổng quan chuyên đề**: ${lecture.description}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    const keyTakeaway =
      mnemonic ||
      trap ||
      'Luôn ghi điều kiện xác định và kiểm tra trường hợp đặc biệt ngay dòng đầu tiên của bài giải.';

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
            variablesNote: buildVariablesNote('math', primaryFormula, lecture.description, trap)
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
    const deepDiveSection =
      st.deepDiveSection ||
      `${st.teacherExplanation}\n\n**Phân tích sâu & Bẫy cài đặt thi đấu**:\n• Kiểm tra giới hạn dữ liệu (đặc biệt phép nhân cần \`long long\` hoặc modulo) và độ phức tạp \`${lesson.complexity.time}\` so với ngưỡng $10^8$ phép tính/giây.\n• Rà soát các test biên ($N=0, N=1$, số âm, phần tử trùng lặp) trước khi chạy Online Judge.`;

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
        variablesNote: buildVariablesNote('cs', primaryFormula, lesson.topic, st.keyTakeaway)
      },
      deepDiveSection,
      miniQuiz: mcqs,
      miniEssay
    };
  });
}
