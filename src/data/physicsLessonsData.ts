import { PhysicsLesson } from '../types';
import { PHYSICS_GDPT_9_LESSONS } from './physicsGdpt2018Grade9';
import { PHYSICS_GDPT_10_LESSONS } from './physicsGdpt2018Grade10';
import { PHYSICS_GDPT_11_LESSONS } from './physicsGdpt2018Grade11';
import { PHYSICS_GDPT_12_LESSONS } from './physicsGdpt2018Grade12';
import { PHYSICS_GDPT_ELECTIVES } from './physicsGdpt2018Electives';
import { PHYSICS_EXTRA_10_LESSONS } from './physicsExtra10Lessons';
import { PHYSICS_GDPT_2006_LESSONS } from './physicsGdpt2006Lessons';

export const PHYSICS_LESSONS: PhysicsLesson[] = [
  // ============================================================================
  // KHU KHÔNG CHUYÊN — CHUẨN CHƯƠNG TRÌNH GDPT 2018 (KHTN 9 & VẬT LÍ 10–12)
  // ============================================================================

  // ---------- LỚP 9 (KHTN 9 — ĐẦY ĐỦ 17 BÀI CHƯƠNG I–XIV + CẦU NỐI LÝ 10) ----------
  ...PHYSICS_GDPT_9_LESSONS,

  // ---------- CHƯƠNG TRÌNH GDPT 2018: VẬT LÍ 10 · 11 · 12 (ĐẦY ĐỦ TỪNG BÀI) ----------
  ...PHYSICS_GDPT_10_LESSONS,
  ...PHYSICS_GDPT_11_LESSONS,
  ...PHYSICS_GDPT_12_LESSONS,

  // ---------- CHUYÊN ĐỀ HỌC TẬP VẬT LÍ 10 · 11 · 12 (GDPT 2018) ----------
  ...PHYSICS_GDPT_ELECTIVES,

  // ============================================================================
  // KHU CHUYÊN VẬT LÍ — LỘ TRÌNH PHÂN TẦNG: CƠ BẢN -> NÂNG CAO -> CHUYÊN / HSG
  // ============================================================================

  {
    id: 'phys-pro-1',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Cơ bản',
    stageLabel: 'Khu Chuyên Lí · Bậc 1: Cơ bản Chuyên',
    sourceTag: 'Chuyên đề Bồi dưỡng HSG Vật lí · Đề Chuyên Sở GD',
    lessonNumber: 18,
    title: 'Động lực học Hệ quy chiếu Phi quán tính & Mặt phẳng nghiêng di động',
    subtitle: 'Phương pháp lực quán tính F_qt = -ma₀, điều kiện trượt tương đối và bài toán nêm chuyển động có gia tốc',
    description:
      'Bước đệm đầu tiên của Khu Chuyên Lí (Mức Cơ bản Chuyên): giải nhanh các bài toán vật trượt trên xe tăng tốc, vật đặt trên nêm có gia tốc bằng phương pháp gắn hệ quy chiếu phi quán tính và thêm lực quán tính $\\vec{F}_{qt} = -m\\vec{a}_0$.',
    theorySections: [
      {
        heading: '1. Nguyên tắc chọn Hệ quy chiếu Phi quán tính',
        content:
          '• Khi gắn hệ quy chiếu vào vật chuẩn đang chuyển động với gia tốc $\\vec{a}_0$ so với mặt đất, ngoài các lực thực (trọng lực, phản lực, ma sát, lực căng), ta phải đưa thêm **lực quán tính** đặt vào vật:\n  $$\\vec{F}_{qt} = -m\\vec{a}_0$$\n• Sau đó áp dụng phương trình cân bằng hoặc Định luật II Newton như bình thường: $\\sum\\vec{F}_{\\text{thực}} + \\vec{F}_{qt} = m\\vec{a}_{\\text{tương đối}}$.'
      },
      {
        heading: '2. Trọng lực hiệu dụng g\' trong thang máy hoặc xe tăng tốc',
        content:
          '• Kết hợp trọng lực và lực quán tính thành trọng lực biểu kiến $\\vec{P}\' = m\\vec{g} - m\\vec{a}_0 \\Rightarrow \\vec{g}\' = \\vec{g} - \\vec{a}_0$.\n• Thang máy đi lên nhanh dần đều gia tốc $a_0$: $g\' = g + a_0$.\n• Xe tăng tốc ngang gia tốc $a_0$: dây treo con lắc lệch góc $\\tan\\alpha = \\frac{a_0}{g}$, $g\' = \\sqrt{g^2 + a_0^2}$.'
      }
    ],
    keyFormulas: [
      '\\vec{F}_{qt} = -m\\vec{a}_0',
      '\\sum \\vec{F}_{\\text{thực}} + \\vec{F}_{qt} = m\\vec{a}_{\\text{td}}',
      '\\tan\\alpha = \\frac{a_0}{g}, \\quad g\' = \\sqrt{g^2 + a_0^2}'
    ],
    simulationType: 'inclined_plane',
    sim3dType: 'inclined_plane_3d',
    defaultParams: { angle: 30, mu: 0.2, mass: 3 },
    paramBounds: {
      angle: { min: 5, max: 65, step: 1, unit: '°', label: 'Góc nêm α' },
      mu: { min: 0, max: 0.8, step: 0.05, unit: '', label: 'Hệ số ma sát μ' },
      mass: { min: 1, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng vật m' }
    },
    practiceExercises: [
      {
        source: 'Chuyên đề HSG Vật lí 10',
        question:
          'Một ô tô tăng tốc đều theo phương ngang với gia tốc $a_0 = 5{,}77\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Dây treo một quả cầu nhỏ gắn trên trần xe lệch khỏi phương thẳng đứng một góc:',
        options: ['A. 30°', 'B. 45°', 'C. 60°', 'D. 15°'],
        correctIndex: 0,
        explanation:
          'Trong hệ quy chiếu gắn với xe, quả cầu chịu trọng lực $P = mg$, lực quán tính ngang $F_{qt} = ma_0$ và lực căng dây. Khi cân bằng: $\\tan\\alpha = \\frac{F_{qt}}{P} = \\frac{a_0}{g} = \\frac{5{,}77}{10} \\approx \\frac{1}{\\sqrt{3}} \\Rightarrow \\alpha = 30^\\circ$.'
      },
      {
        source: 'VietJack · Nâng cao 10',
        question:
          'Một người đứng trên cân đặt trong thang máy đi xuống chậm dần đều với gia tốc $2\\text{ m/s}^2$ ($g = 10\\text{ m/s}^2$). Số chỉ của cân so với trọng lượng thực $P$ của người sẽ:',
        options: [
          'A. Tăng thêm 20%',
          'B. Giảm đi 20%',
          'C. Không thay đổi',
          'D. Giảm còn 0'
        ],
        correctIndex: 0,
        explanation:
          'Thang máy đi xuống chậm dần đều nên vectơ $\\vec{a}_0$ hướng LÊN trên. Lực quán tính $\\vec{F}_{qt} = -m\\vec{a}_0$ hướng XUỐNG dưới cùng chiều trọng lực! Do đó $N = m(g + a_0) = 1{,}2mg$, số chỉ tăng $20\\%$.'
      },
      {
        source: 'Đề tuyển sinh Chuyên Lí 10',
        question:
          'Đặt vật khối lượng $m$ trên mặt nêm nhẵn nghiêng góc $\\alpha = 45^\\circ$ so với phương ngang. Để vật đứng yên trên mặt nêm, phải đẩy nêm chuyển động ngang theo chiều hợp lý với gia tốc tối thiểu là:',
        options: ['A. a₀ = g', 'B. a₀ = g/2', 'C. a₀ = g√2', 'D. a₀ = g/√2'],
        correctIndex: 0,
        explanation:
          'Chiếu phương trình cân bằng dọc mặt nêm: $mg\\sin\\alpha = ma_0\\cos\\alpha \\Rightarrow a_0 = g\\tan\\alpha = g\\tan 45^\\circ = g$.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề thi Chuyên Vật lí 10',
        question:
          'Một chiếc nêm khối lượng $M$ có mặt nghiêng nhẵn góc $\\alpha = 30^\\circ$ đặt trên mặt sàn ngang nhẵn. Đặt vật nhỏ khối lượng $m$ lên mặt nêm rồi thả nhẹ. Tìm gia tốc của nêm và gia tốc tương đối của vật đối với nêm ($g = 10\\text{ m/s}^2$, cho $M = 2m$).',
        hints: ['Gắn HQC phi quán tính vào nêm có gia tốc $a_M$ hướng sang trái; viết phương trình định luật II cho $m$ (có thêm lực quán tính $ma_M$) và cho nêm $M$ dưới tác dụng của áp lực $N$.'],
        solutionSteps: [
          'Bước 1: Xét nêm $M$ trượt ngang dưới tác dụng thành phần ngang của áp lực $N$: $N\\sin\\alpha = M a_M \\quad (1)$.',
          'Bước 2: Trong HQC gắn nêm, vật $m$ không rời mặt nêm nên gia tốc vuông góc mặt nêm bằng 0: $N + m a_M \\sin\\alpha = mg\\cos\\alpha \\quad (2)$.',
          'Bước 3: Thay $a_M = \\frac{N\\sin\\alpha}{M}$ vào (2): $N\\left(1 + \\frac{m\\sin^2\\alpha}{M}\\right) = mg\\cos\\alpha$. Với $M = 2m, \\alpha = 30^\\circ$: $N\\left(1 + \\frac{1}{8}\\right) = mg\\frac{\\sqrt{3}}{2} \\Rightarrow N = \\frac{4\\sqrt{3}}{9}mg$.',
          'Bước 4: Suy ra gia tốc nêm: $a_M = \\frac{N\\sin 30^\\circ}{2m} = \\frac{\\sqrt{3}}{9}g \\approx 1{,}92\\text{ m/s}^2$. Gia tốc trượt tương đối của vật dọc nêm: $a_{td} = g\\sin\\alpha + a_M\\cos\\alpha = 5 + \\frac{3}{18}g \\approx 6{,}67\\text{ m/s}^2$.'
        ],
        finalAnswer: '$a_M \\approx 1{,}92\\text{ m/s}^2$; $a_{td} \\approx 6{,}67\\text{ m/s}^2$.'
      },
      {
        source: 'Bồi dưỡng HSG Vật lí 10',
        question:
          'Một khúc gỗ đặt trên sàn toa tàu đang đứng yên. Hệ số ma sát giữa gỗ và sàn là $\\mu = 0{,}25$ ($g = 10\\text{ m/s}^2$). Hỏi đoàn tàu phải tăng tốc ít nhất bao nhiêu thì khúc gỗ bắt đầu trượt về phía sau toa?',
        hints: ['Gỗ trượt khi lực quán tính $F_{qt} = ma_0$ thắng được lực ma sát nghỉ cực đại $\\mu mg$.'],
        solutionSteps: [
          'Bước 1: Trong HQC gắn toa tàu, lực quán tính kéo gỗ về sau là $F_{qt} = m a_0$.',
          'Bước 2: Lực ma sát nghỉ cực đại giữ gỗ đứng yên trên sàn là $F_{msn,\\max} = \\mu m g$.',
          'Bước 3: Điều kiện trượt: $m a_0 > \\mu m g \\Rightarrow a_0 > \\mu g = 0{,}25 \\cdot 10 = 2{,}5\\text{ m/s}^2$.'
        ],
        finalAnswer: '$a_{0\\min} = 2{,}5\\text{ m/s}^2$.'
      }
    ]
  },

  {
    id: 'phys-pro-2',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Bậc 2: Nâng cao Chuyên',
    sourceTag: 'Tài liệu Chuyên Vật lí · Tuyển tập HSG Tỉnh/Thành phố',
    lessonNumber: 19,
    title: 'Chuyển động liên kết, Ròng rọc động & Bài toán Va chạm Đàn hồi',
    subtitle: 'Phương trình liên kết dây không dãn, quan hệ gia tốc ròng rọc động a₁ = 2a₂ và bảo toàn động lượng – động năng khi va chạm xiên',
    description:
      'Chủ đề Vật lí Chuyên mức Nâng cao: thiết lập phương trình liên kết hình học của hệ nhiều vật qua ròng rọc động/cố định, giải hệ va chạm đàn hồi xuyên tâm và va chạm hai chiều.',
    theorySections: [
      {
        heading: '1. Nguyên tắc tìm phương trình liên kết Ròng rọc',
        content:
          '• Khi sợi dây lý tưởng không dãn và khối lượng không đáng kể: độ dài toàn bộ dây $L = \\text{const}$.\n• Đạo hàm 2 lần phương trình độ dài dây theo thời gian ta thu được liên hệ giữa gia tốc các vật (ví dụ: kéo 1 đầu dây qua ròng rọc động nâng vật nặng thì đầu dây đi đoạn $2h$ khi vật lên đoạn $h \\Rightarrow a_{\\text{dây}} = 2a_{\\text{vật}}$).\n• Lực căng dây đồng nhất trên suốt một sợi dây liên tục khi ròng rọc không khối lượng, không ma sát: $T_{\\text{trục}} = 2T_{\\text{nhánh}}$.'
      },
      {
        heading: '2. Va chạm đàn hồi xuyên tâm & Công thức vận tốc sau va chạm',
        content:
          '• Trong va chạm hoàn toàn đàn hồi, **cả Động lượng và Động năng** đều được bảo toàn:\n  $$v_1\' = \\frac{(m_1 - m_2)v_1 + 2m_2 v_2}{m_1 + m_2}, \\quad v_2\' = \\frac{(m_2 - m_1)v_2 + 2m_1 v_1}{m_1 + m_2}$$\n• Hệ quả cực đẹp: Nếu $m_1 = m_2$, hai vật trao đổi vận tốc cho nhau ($v_1\' = v_2, v_2\' = v_1$). Nếu $m_1$ va chạm vào $m_2$ đứng yên với hai khối lượng bằng nhau va chạm không xuyên tâm, hai vectơ vận tốc sau va chạm hợp với nhau góc $90^\\circ$!'
      }
    ],
    keyFormulas: [
      'L_{\\text{dây}} = \\text{const} \\implies \\sum \\Delta x_i = 0',
      'v_1\' = \\frac{(m_1 - m_2)v_1 + 2m_2 v_2}{m_1 + m_2}',
      '\\Delta W_{\\text{nhiệt}} = \\frac{1}{2}\\frac{m_1 m_2}{m_1 + m_2}(v_1 - v_2)^2 \\quad (\\text{va chạm mềm})'
    ],
    simulationType: 'atwood_pulley',
    sim3dType: 'atwood_pulley_3d',
    defaultParams: { m1: 2, m2: 3.5, g: 9.8 },
    paramBounds: {
      m1: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₁' },
      m2: { min: 0.5, max: 10, step: 0.5, unit: 'kg', label: 'Khối lượng m₂' },
      g: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc rơi tự do g' }
    },
    practiceExercises: [
      {
        source: 'HSG Vật lí 10',
        question:
          'Vật $m_1 = 2\\text{ kg}$ chuyển động với tốc độ $6\\text{ m/s}$ va chạm hoàn toàn đàn hồi xuyên tâm vào vật $m_2 = 4\\text{ kg}$ đang đứng yên. Vận tốc của vật $m_1$ ngay sau va chạm là:',
        options: ['A. -2 m/s (bật ngược lại)', 'B. +2 m/s', 'C. -4 m/s', 'D. 0 m/s'],
        correctIndex: 0,
        explanation:
          'Áp dụng công thức va chạm đàn hồi ($v_2 = 0$): $v_1\' = \\frac{(m_1 - m_2)v_1}{m_1 + m_2} = \\frac{(2 - 4)\\cdot 6}{2 + 4} = -2\\text{ m/s}$ (bật ngược lại với tốc độ $2\\text{ m/s}$).'
      },
      {
        source: 'Chuyên Lí 10',
        question:
          'Trong một hệ ròng rọc động lý tưởng, người ta kéo đầu dây tự do đi xuống với gia tốc $a_1 = 4\\text{ m/s}^2$. Khi đó vật nặng gắn vào trục ròng rọc động đi lên với gia tốc:',
        options: ['A. 2 m/s²', 'B. 4 m/s²', 'C. 8 m/s²', 'D. 1 m/s²'],
        correctIndex: 0,
        explanation:
          'Do một đầu dây cố định và một đầu di chuyển, khi ròng rọc động lên đoạn $x$ thì hai nhánh dây rút ngắn tổng cộng $2x$, do đó $a_{\\text{vật}} = \\frac{a_1}{2} = 2\\text{ m/s}^2$.'
      },
      {
        source: 'Olympic Vật lí',
        question:
          'Hai quả cầu giống hệt nhau ($m_1 = m_2$), quả 1 chuyển động tốc độ $v$ đến va chạm hoàn toàn đàn hồi lệch tâm vào quả 2 đang đứng yên. Góc hợp bởi hai vectơ vận tốc ngay sau va chạm là:',
        options: ['A. 90°', 'B. 60°', 'C. 45°', 'D. 180°'],
        correctIndex: 0,
        explanation:
          'Từ $\\vec{v} = \\vec{v}_1\' + \\vec{v}_2\'$ và $v^2 = v_1\'^2 + v_2\'^2$, suy ra $\\vec{v}_1\' \\cdot \\vec{v}_2\' = 0$, tức là hai vectơ vuông góc ($90^\\circ$).'
      }
    ],
    essayExercises: [
      {
        source: 'Đề HSG Tỉnh · Ròng rọc động',
        question:
          'Hệ ròng rọc gồm 1 ròng rọc cố định và 1 ròng rọc động (khối lượng không đáng kể, dây không dãn). Vật $m_1 = 3\\text{ kg}$ treo vào trục ròng rọc động, vật $m_2 = 2\\text{ kg}$ treo vào đầu dây tự do vắt qua ròng rọc cố định. Thả hệ tự do ($g = 10\\text{ m/s}^2$). Tìm gia tốc của mỗi vật và lực căng dây $T$.',
        hints: ['Khi $m_2$ đi xuống đoạn $s_2$, thì $m_1$ đi lên đoạn $s_1 = s_2 / 2 \\Rightarrow a_2 = 2a_1$. Trục ròng rọc động chịu lực kéo lên $2T$.'],
        solutionSteps: [
          'Bước 1: Giả sử $m_2$ đi xuống với gia tốc $a_2$, $m_1$ đi lên với gia tốc $a_1 = a_2/2$.',
          'Bước 2: Phương trình cho $m_2$: $m_2 g - T = m_2 a_2 = 2m_2 a_1 \\quad (1)$.',
          'Bước 3: Phương trình cho $m_1$: $2T - m_1 g = m_1 a_1 \\quad (2)$.',
          'Bước 4: Nhân (1) với 2 rồi cộng (2): $(2m_2 - m_1)g = (4m_2 + m_1)a_1 \\Rightarrow (4 - 3)\\cdot 10 = (8 + 3)a_1 \\Rightarrow a_1 = \\frac{10}{11} \\approx 0{,}91\\text{ m/s}^2$; $a_2 = \\frac{20}{11} \\approx 1{,}82\\text{ m/s}^2$; $T = m_2(g - a_2) = 2(10 - 20/11) \\approx 16{,}36\\text{ N}$.'
        ],
        finalAnswer: '$a_1 \\approx 0{,}91\\text{ m/s}^2$ (đi lên), $a_2 \\approx 1{,}82\\text{ m/s}^2$ (đi xuống), $T \\approx 16{,}36\\text{ N}$.'
      },
      {
        source: 'Olympic Vật lí · Đạn bắn nêm',
        question:
          'Viên bi $m_1 = 1\\text{ kg}$ chuyển động với vận tốc $v_0 = 6\\text{ m/s}$ đến va chạm đàn hồi trực diện vào bi $m_2 = 2\\text{ kg}$ đang đứng yên gắn với một lò xo nhẹ độ cứng $k = 150\\text{ N/m}$ đầu kia cố định vào tường (bỏ qua ma sát). Tính độ nén cực đại của lò xo trong quá trình $m_2$ chuyển động.',
        hints: ['Sau va chạm đàn hồi, bi $m_2$ nhận vận tốc $v_2\'$ rồi toàn bộ động năng của $m_2$ chuyển thành thế năng đàn hồi $\\frac{1}{2}kx_{\\max}^2$.'],
        solutionSteps: [
          'Bước 1: Vận tốc bi $m_2$ ngay sau va chạm đàn hồi: $v_2\' = \\frac{2m_1 v_0}{m_1 + m_2} = \\frac{2 \\cdot 1 \\cdot 6}{1 + 2} = 4\\text{ m/s}$.',
          'Bước 2: Bảo toàn cơ năng khi lò xo nén cực đại: $\\frac{1}{2}m_2 v_2\'^2 = \\frac{1}{2}k\\Delta l_{\\max}^2$.',
          'Bước 3: $\\Delta l_{\\max} = v_2\'\\sqrt{\\frac{m_2}{k}} = 4\\sqrt{\\frac{2}{150}} = \\frac{4}{5\\sqrt{3}} \\approx 0{,}462\\text{ m}$.'
        ],
        finalAnswer: '$\\Delta l_{\\max} \\approx 0{,}462\\text{ m}$.'
      }
    ]
  },

  {
    id: 'phys-pro-3',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Bậc 2: Nâng cao Chuyên',
    sourceTag: 'Bồi dưỡng HSG Điện học · Mạch cầu & Biến đổi Sao-Tam giác',
    lessonNumber: 20,
    title: 'Mạch điện không phẳng, Mạch cầu tổng quát & Biến đổi Sao – Tam giác',
    subtitle: 'Quy tắc chập nút đẳng thế (đối xứng), điều kiện cầu cân bằng R₁/R₂ = R₃/R₄ và công thức biến đổi mạch Tam giác ↔ Sao',
    description:
      'Vũ khí giải mọi bài toán mạch điện phức tạp trong đề thi Chuyên & HSG Vật lí: nhận diện cầu cân bằng, khai thác tính đối xứng trục/tâm để tách hoặc chập nút đẳng thế, và phép biến đổi Sao – Tam giác $(Y \\leftrightarrow \\Delta)$ khi mạch cầu lệch.',
    theorySections: [
      {
        heading: '1. Mạch cầu cân bằng & Kỹ thuật Chập nút đối xứng',
        content:
          '• Mạch cầu gồm 4 cạnh $R_1, R_2, R_3, R_4$ và đường chéo cầu $R_5$:\n  – **Cầu cân bằng** khi $R_1 R_4 = R_2 R_3$ (hay $\\frac{R_1}{R_2} = \\frac{R_3}{R_4}$). Khi đó dòng qua nhánh cầu $I_5 = 0$, ta có thể **bỏ $R_5$** hoặc **chập 2 đầu cầu thành 1 nút**.\n• Với mạch đối xứng qua trục nối 2 cực hoặc trục vuông góc, các nút đối xứng có điện thế bằng nhau → chập lại giúp đơn giản hóa tức thì.'
      },
      {
        heading: '2. Phép biến đổi Tam giác (Δ) ↔ Hình Sao (Y)',
        content:
          '• Khi chuyển từ mạch Tam giác $(R_{12}, R_{23}, R_{31})$ sang mạch hình Sao $(R_1, R_2, R_3)$ chung tâm $O$:\n  $$R_1 = \\frac{R_{12} \\cdot R_{31}}{R_{12} + R_{23} + R_{31}}, \\quad R_2 = \\frac{R_{12} \\cdot R_{23}}{\\sum R}, \\quad R_3 = \\frac{R_{23} \\cdot R_{31}}{\\sum R}$$\n• Đặc biệt: Nếu tam giác đều có 3 điện trở bằng nhau $R_\\Delta$ thì hình sao tương ứng có $R_Y = \\frac{R_\\Delta}{3}$!'
      }
    ],
    keyFormulas: [
      '\\text{Cầu cân bằng}: \\frac{R_1}{R_2} = \\frac{R_3}{R_4} \\implies I_5 = 0',
      'R_1 = \\frac{R_{12}R_{31}}{R_{12}+R_{23}+R_{31}}',
      'R_Y = \\frac{R_\\Delta}{3} \\quad (\\text{mạch đều})'
    ],
    simulationType: 'wheatstone_bridge',
    sim3dType: 'ohm_circuit_3d',
    defaultParams: { voltage: 24, r1: 12, r2: 12, r3: 8, r4: 8 },
    paramBounds: {
      voltage: { min: 6, max: 36, step: 2, unit: 'V', label: 'Hiệu điện thế U_AB' },
      r1: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₁' },
      r2: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₂' },
      r3: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₃' },
      r4: { min: 2, max: 40, step: 2, unit: 'Ω', label: 'Nhánh R₄' }
    },
    practiceExercises: [
      {
        source: 'Đề Chuyên Lí · Mạch cầu',
        question:
          'Cho mạch cầu $A-C-B$ và $A-D-B$ với $R_{AC} = 4\\,\\Omega$, $R_{CB} = 6\\,\\Omega$, $R_{AD} = 8\\,\\Omega$, $R_{DB} = 12\\,\\Omega$, giữa $C$ và $D$ có điện trở $R_5 = 10\\,\\Omega$. Điện trở tương đương $R_{AB}$ bằng:',
        options: ['A. 20/3 Ω', 'B. 12 Ω', 'C. 8 Ω', 'D. 5 Ω'],
        correctIndex: 0,
        explanation:
          'Kiểm tra $\\frac{R_{AC}}{R_{CB}} = \\frac{4}{6} = \\frac{8}{12} = \\frac{R_{AD}}{R_{DB}} \\Rightarrow$ Cầu cân bằng, bỏ $R_5$! Khi đó $(R_{AC}\\text{ nt }R_{CB}) = 10\\,\\Omega$ song song với $(R_{AD}\\text{ nt }R_{DB}) = 20\\,\\Omega \\Rightarrow R_{AB} = \\frac{10\\cdot 20}{10+20} = \\frac{20}{3}\\,\\Omega$.'
      },
      {
        source: 'Chuyên Lí · Biến đổi Y-Δ',
        question:
          'Ba điện trở bằng nhau cùng giá trị $R = 9\\,\\Omega$ mắc thành hình tam giác $ABC$. Nếu biến đổi tương đương sang mạch hình sao tâm $O$ nối tới 3 đỉnh $A, B, C$ thì mỗi điện trở nhánh hình sao bằng:',
        options: ['A. 3 Ω', 'B. 27 Ω', 'C. 9 Ω', 'D. 4,5 Ω'],
        correctIndex: 0,
        explanation:
          'Theo công thức chuyển đổi $\\Delta \\to Y$ cho mạch đối xứng 3 nhánh bằng nhau: $R_Y = \\frac{R_\\Delta}{3} = \\frac{9}{3} = 3\\,\\Omega$.'
      },
      {
        source: 'HSG Điện học · Mạng lập phương',
        question:
          'Một khung dây dẫn hình lập phương gồm 12 cạnh, mỗi cạnh có điện trở $R = 12\\,\\Omega$. Điện trở tương đương giữa hai đỉnh đối diện xa nhất (đường chéo không gian của hình lập phương) bằng:',
        options: ['A. 10 Ω', 'B. 12 Ω', 'C. 6 Ω', 'D. 14,4 Ω'],
        correctIndex: 0,
        explanation:
          'Áp dụng tính đối xứng chập nút: 3 đỉnh kề cực A đẳng thế, 3 đỉnh kề cực B đẳng thế. Tổng trở tương đương luôn là $R_{AB} = \\frac{5}{6}R = \\frac{5}{6} \\cdot 12 = 10\\,\\Omega$.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề thi Chuyên Vật lí · Mạch cầu không cân bằng',
        question:
          'Cho mạch cầu AB không cân bằng: $R_1 = 6\\,\\Omega$ (nhánh AC), $R_2 = 6\\,\\Omega$ (nhánh AD), $R_5 = 6\\,\\Omega$ (nhánh CD), $R_3 = 3\\,\\Omega$ (nhánh CB), $R_4 = 6\\,\\Omega$ (nhánh DB). Dùng phép biến đổi Tam giác ACD thành Hình Sao để tính $R_{AB}$.',
        hints: ['Tam giác ACD gồm 3 điện trở đều bằng $6\\,\\Omega$ nên đổi sang Hình Sao tâm O có 3 nhánh $R_A = R_C = R_D = 2\\,\\Omega$.'],
        solutionSteps: [
          'Bước 1: Biến đổi tam giác $ACD$ ($R_{AC} = R_{AD} = R_{CD} = 6\\,\\Omega$) thành hình sao tâm $O$: $R_A = R_C = R_D = \\frac{6}{3} = 2\\,\\Omega$.',
          'Bước 2: Mạch mới gồm $R_A = 2\\,\\Omega$ nối tiếp với cụm song song $[(R_C + R_3) // (R_D + R_4)]$.',
          'Bước 3: Tính nhánh song song: $R_C + R_3 = 2 + 3 = 5\\,\\Omega$; $R_D + R_4 = 2 + 6 = 8\\,\\Omega \\Rightarrow R_{OB} = \\frac{5 \\cdot 8}{5 + 8} = \\frac{40}{13}\\,\\Omega$.',
          'Bước 4: Tổng điện trở: $R_{AB} = 2 + \\frac{40}{13} = \\frac{66}{13} \\approx 5{,}08\\,\\Omega$.'
        ],
        finalAnswer: '$R_{AB} = \\frac{66}{13}\\,\\Omega \\approx 5{,}08\\,\\Omega$.'
      },
      {
        source: 'HSG Vật lí · Mạch đối xứng cầu',
        question:
          'Cho mạch cầu AB có 4 cạnh mắc hai đầu nguồn $U_{AB} = 30\\text{ V}$ với $R_{AC} = 10\\,\\Omega$, $R_{CB} = 20\\,\\Omega$, $R_{AD} = 20\\,\\Omega$, $R_{DB} = 10\\,\\Omega$. Giữa hai điểm C và D mắc một Ampe kế lý tưởng ($R_A = 0$). Hãy tính số chỉ và chiều dòng điện qua Ampe kế.',
        hints: ['Vì $R_A = 0$, hai điểm C và D bị chập làm một nút! Mạch trở thành $(R_{AC} // R_{AD})$ nối tiếp $(R_{CB} // R_{DB})$.'],
        solutionSteps: [
          'Bước 1: Do $R_A = 0$, $V_C = V_D$. Chập nút C và D thành một điểm.',
          'Bước 2: Cụm bên trái: $R_{AC} // R_{AD} = \\frac{10 \\cdot 20}{10 + 20} = \\frac{20}{3}\\,\\Omega$. Cụm bên phải: $R_{CB} // R_{DB} = \\frac{20 \\cdot 10}{20 + 10} = \\frac{20}{3}\\,\\Omega$.',
          'Bước 3: Điện trở toàn mạch $R_{AB} = \\frac{40}{3}\\,\\Omega \\Rightarrow I = \\frac{30}{40/3} = 2{,}25\\text{ A}$.',
          'Bước 4: Do đối xứng: $U_{AC} = U_{CB} = 15\\text{ V} \\Rightarrow I_{AC} = 1{,}5\\text{ A}$, $I_{CB} = 0{,}75\\text{ A}$. Tại nút C: dòng qua Ampe kế từ C sang D là $I_A = I_{AC} - I_{CB} = 1{,}5 - 0{,}75 = 0{,}75\\text{ A}$.'
        ],
        finalAnswer: '$I_A = 0{,}75\\text{ A}$ (chiều từ C đến D).'
      }
    ]
  },

  {
    id: 'phys-pro-4',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Bậc 3: Chuyên / HSG Quốc Gia',
    sourceTag: 'Tuyển tập Đề Chuyên Quang hình · HSG Quốc gia',
    lessonNumber: 21,
    title: 'Quang hệ ghép Thấu kính – Gương cầu & Cực trị khoảng cách ảnh',
    subtitle: 'Sơ đồ tạo ảnh qua hệ 2 thấu kính, công thức tiêu cự tương đương và bài toán cực trị L_min = 4f khi giữ cố định vật và màn',
    description:
      'Chuyên đề Quang hình học bậc Chuyên / HSG: phân tích sơ đồ tạo ảnh nối tiếp $AB \\xrightarrow{L_1} A_1B_1 \\xrightarrow{L_2} A_2B_2$, kỹ thuật xử lý vật ảo ($d_2 = l - d_1\' < 0$) và chứng minh khoảng cách cực tiểu vật – màn là $4f$.',
    theorySections: [
      {
        heading: '1. Sơ đồ tạo ảnh qua Quang hệ đồng trục',
        content:
          '• Hai thấu kính $L_1, L_2$ đặt đồng trục cách nhau khoảng $l$:\n  $$AB \\xrightarrow{L_1 (d_1, d_1\')} A_1B_1 \\xrightarrow{L_2 (d_2, d_2\')} A_2B_2$$\n• Công thức liên hệ khoảng cách: $d_2 = l - d_1\'$.\n  – Nếu $d_2 > 0$: $A_1B_1$ là vật thật đối với $L_2$.\n  – Nếu $d_2 < 0$: $A_1B_1$ nằm sau $L_2$ nên đóng vai trò **vật ảo** đối với $L_2$ (công thức thấu kính vẫn đúng hoàn toàn về mặt đại số!).\n• Độ phóng đại toàn hệ: $k = k_1 \\cdot k_2$.'
      },
      {
        heading: '2. Bài toán Cực trị khoảng cách Vật – Màn & Dịch chuyển thấu kính',
        content:
          '• Khoảng cách giữa vật thật và ảnh thật qua thấu kính hội tụ: $L = d + d\' = d + \\frac{df}{d-f}$.\n• Áp dụng BĐT Cô-si: $L \\ge 4f$. Do đó muốn thu được ảnh thật trên màn cố định cách vật khoảng $L$, điều kiện cần là $L \\ge 4f$.\n• Khi $L > 4f$, có 2 vị trí đặt thấu kính cách nhau đoạn $a = \\sqrt{L^2 - 4Lf}$ cùng cho ảnh rõ nét trên màn, với $f = \\frac{L^2 - a^2}{4L}$ (phương pháp Bessel đo tiêu cự!).'
      }
    ],
    keyFormulas: [
      'd_2 = l - d_1\', \\quad k_{\\text{hệ}} = k_1 \\cdot k_2',
      'L_{\\min} = 4f \\quad (\\text{khi } d = d\' = 2f)',
      'f = \\frac{L^2 - a^2}{4L} \\quad (\\text{Công thức Bessel})'
    ],
    simulationType: 'telescope_microscope',
    sim3dType: 'double_lens_microscope_3d',
    defaultParams: { f1Cm: 14, f2Cm: 10, objDistCm: 22 },
    paramBounds: {
      f1Cm: { min: 5, max: 30, step: 1, unit: 'cm', label: 'Tiêu cự Vật kính f₁' },
      f2Cm: { min: 4, max: 25, step: 1, unit: 'cm', label: 'Tiêu cự Thị kính f₂' },
      objDistCm: { min: 8, max: 60, step: 1, unit: 'cm', label: 'Khoảng cách vật d₁' }
    },
    practiceExercises: [
      {
        source: 'Đề Chuyên Lí · Phương pháp Bessel',
        question:
          'Đặt vật sáng $AB$ và màn ảnh cố định cách nhau $L = 90\\text{ cm}$. Dịch chuyển một thấu kính hội tụ giữa vật và màn thấy có 2 vị trí cho ảnh rõ nét trên màn, cách nhau $a = 30\\text{ cm}$. Tiêu cự của thấu kính là:',
        options: ['A. 20 cm', 'B. 22,5 cm', 'C. 15 cm', 'D. 30 cm'],
        correctIndex: 0,
        explanation:
          'Áp dụng công thức Bessel: $f = \\frac{L^2 - a^2}{4L} = \\frac{90^2 - 30^2}{4 \\cdot 90} = \\frac{7200}{360} = 20\\text{ cm}$.'
      },
      {
        source: 'HSG Vật lí · Hệ 2 thấu kính',
        question:
          'Hai thấu kính mỏng ghép sát nhau có tiêu cự lần lượt là $f_1 = 20\\text{ cm}$ và $f_2 = -10\\text{ cm}$. Tiêu cự tương đương của hệ thấu kính ghép sát là:',
        options: ['A. -20 cm (phân kỳ)', 'B. +20 cm (hội tụ)', 'C. +10 cm', 'D. -6,67 cm'],
        correctIndex: 0,
        explanation:
          'Độ tụ hệ ghép sát: $\\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2} = \\frac{1}{20} - \\frac{1}{10} = -\\frac{1}{20} \\Rightarrow f = -20\\text{ cm}$.'
      },
      {
        source: 'Chuyên Lí · Ảnh sau hệ',
        question:
          'Chùm tia sáng song song trục chính chiếu qua hệ 2 thấu kính đặt cách nhau $l = f_1 + f_2$ (hệ vô tiêu, kính thiên văn). Chùm tia ló ra khỏi $L_2$ có đặc điểm:',
        options: [
          'A. Là chùm tia song song trục chính',
          'B. Hội tụ tại tiêu điểm $F_2\'$',
          'C. Hội tụ tại trung điểm $O_1 O_2$',
          'D. Bị phản xạ toàn phần'
        ],
        correctIndex: 0,
        explanation:
          'Chùm song song qua $L_1$ hội tụ đúng tại $F_1\' \\equiv F_2$ (tiêu điểm vật của $L_2$), nên sau khi qua $L_2$ lại trở thành chùm tia ló song song.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề HSG Tỉnh · Hệ 2 thấu kính đồng trục',
        question:
          'Cho hệ hai thấu kính đồng trục: $L_1$ hội tụ tiêu cự $f_1 = 20\\text{ cm}$, $L_2$ phân kỳ tiêu cự $f_2 = -15\\text{ cm}$ đặt cách nhau $l = 45\\text{ cm}$. Đặt vật sáng $AB$ trước $L_1$ cách $L_1$ một khoảng $d_1 = 30\\text{ cm}$. Xác định vị trí, tính chất và độ phóng đại của ảnh cuối cùng $A_2 B_2$.',
        hints: ['Tính $d_1\'$ và $k_1$, sau đó tính $d_2 = l - d_1\'$ để thay vào công thức $L_2$.'],
        solutionSteps: [
          'Bước 1: Qua $L_1$: $d_1\' = \\frac{d_1 f_1}{d_1 - f_1} = \\frac{30 \\cdot 20}{30 - 20} = 60\\text{ cm}$ (ảnh thật); $k_1 = -\\frac{60}{30} = -2$.',
          'Bước 2: Khoảng cách từ $A_1B_1$ tới $L_2$: $d_2 = l - d_1\' = 45 - 60 = -15\\text{ cm}$ ($A_1B_1$ là vật ảo nằm sau $L_2$ đúng $15\\text{ cm}$).',
          'Bước 3: Qua $L_2$: $\\frac{1}{d_2\'} = \\frac{1}{f_2} - \\frac{1}{d_2} = \\frac{1}{-15} - \\frac{1}{-15} = 0 \\Rightarrow d_2\' = \\infty$! Chùm tia ló là chùm tia song song, ảnh cuối cùng ở vô cực.'
        ],
        finalAnswer: 'Ảnh $A_1B_1$ là vật ảo đặt đúng tại tiêu điểm ảnh của $L_2$ ($d_2 = -15\\text{ cm}$), nên ảnh cuối cùng $A_2B_2$ ở vô cực.'
      },
      {
        source: 'Chuyên Lí · Bài toán Vật – Màn – Thấu kính',
        question:
          'Vật sáng $AB$ cao $1\\text{ cm}$ đặt trước màn ảnh cách nhau $L = 100\\text{ cm}$. Giữa vật và màn đặt thấu kính hội tụ cho 2 vị trí ảnh rõ nét trên màn, biết ảnh lớn cao $4\\text{ cm}$. Tính chiều cao ảnh nhỏ và tiêu cự $f$ của thấu kính.',
        hints: ['Áp dụng tính thuận nghịch ánh sáng: $h_{\\text{vật}}^2 = h_1 \\cdot h_2$ và tỉ lệ $d_2 = d_1\'$.'],
        solutionSteps: [
          'Bước 1: Theo tính thuận nghịch: $|k_1 \\cdot k_2| = 1 \\Rightarrow h_1 \\cdot h_2 = AB^2 \\Rightarrow h_2 = \\frac{1^2}{4} = 0{,}25\\text{ cm}$.',
          'Bước 2: Khi cho ảnh lớn cao $4\\text{ cm}$: $\\frac{d\'}{d} = 4 \\Rightarrow d\' = 4d$. Mà $d + d\' = 100 \\Rightarrow 5d = 100 \\Rightarrow d = 20\\text{ cm}, d\' = 80\\text{ cm}$.',
          'Bước 3: Tiêu cự thấu kính: $f = \\frac{d d\'}{d + d\'} = \\frac{20 \\cdot 80}{100} = 16\\text{ cm}$.'
        ],
        finalAnswer: 'Ảnh nhỏ cao $0{,}25\\text{ cm}$; tiêu cự $f = 16\\text{ cm}$.'
      }
    ]
  },

  {
    id: 'phys-pro-5',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Bậc 3: Chuyên / HSG Quốc Gia',
    sourceTag: 'Tuyển tập Đề Chuyên & HSG Quốc gia Vật lí',
    lessonNumber: 22,
    title: 'Con lắc vướng đinh, Dao động tắt dần & Chu trình Nhiệt động lực học',
    subtitle: 'Con lắc đơn vướng đinh đóng trên phương thẳng đứng, số lần qua VTCB khi có ma sát khô và công – hiệu suất chu trình Carnot/P-V',
    description:
      'Đỉnh cao Chuyên Lí tổng hợp: phân tích dao động bất đối xứng của con lắc vướng đinh, tính độ giảm biên độ sau mỗi chu kì và quãng đường đi được đến khi dừng hẳn trong dao động tắt dần, cùng bài toán tính công và hiệu suất chu trình nhiệt động.',
    theorySections: [
      {
        heading: '1. Con lắc vướng đinh',
        content:
          '• Con lắc đơn dài $l_1$ khi qua VTCB bị vướng đinh ở độ cao dưới điểm treo đoạn $d$, nửa chu kì bên kia dao động với chiều dài $l_2 = l_1 - d$.\n• Chu kì toàn phần của con lắc vướng đinh: $T = \\frac{T_1 + T_2}{2} = \\pi\\left(\\sqrt{\\frac{l_1}{g}} + \\sqrt{\\frac{l_2}{g}}\\right)$.\n• Khi bỏ qua ma sát, độ cao cực đại hai bên luôn bằng nhau ($h_1 = h_2$), nhưng góc lệch cực đại bên ngắn lớn hơn: $\\alpha_{2\\max} \\approx \\alpha_{1\\max}\\sqrt{\\frac{l_1}{l_2}}$.'
      },
      {
        heading: '2. Dao động tắt dần của Con lắc lò xo có ma sát khô',
        content:
          '• Vật dao động ngang có hệ số ma sát $\\mu$: Độ giảm biên độ sau mỗi **nửa chu kì** là $\\Delta A_{1/2} = \\frac{2\\mu m g}{k}$, sau **1 chu kì** là $\\Delta A = \\frac{4\\mu m g}{k}$.\n• Tổng quãng đường đi được từ lúc thả biên $A_0$ đến khi dừng hẳn (gần đúng theo định luật bảo toàn năng lượng): $S \\approx \\frac{k A_0^2}{2\\mu m g}$.'
      },
      {
        heading: '3. Chu trình Nhiệt động lực học & Hiệu suất Carnot',
        content:
          '• Công khí thực hiện trong cả chu trình khép kín bằng diện tích hình phẳng bao bởi đồ thị chu trình trên hệ trục $(p - V)$.\n• Hiệu suất động cơ nhiệt: $H = \\frac{A\'}{Q_{\\text{nhận}}} = 1 - \\frac{|Q_{\\text{tỏa}}|}{Q_{\\text{nhận}}} \\le H_{\\text{Carnot}} = 1 - \\frac{T_{\\text{lạnh}}}{T_{\\text{nóng}}}$.'
      }
    ],
    keyFormulas: [
      'T = \\pi\\left(\\sqrt{\\frac{l_1}{g}} + \\sqrt{\\frac{l_2}{g}}\\right)',
      '\\Delta A_{\\text{chu kì}} = \\frac{4\\mu mg}{k}, \\quad S_{\\max} \\approx \\frac{kA_0^2}{2\\mu mg}',
      'H_{\\text{Carnot}} = 1 - \\frac{T_2}{T_1}'
    ],
    simulationType: 'simple_pendulum',
    sim3dType: 'simple_pendulum_3d',
    defaultParams: { length: 2.0, gravity: 9.8, theta0: 15 },
    paramBounds: {
      length: { min: 0.5, max: 4.0, step: 0.1, unit: 'm', label: 'Chiều dài dây l₁' },
      gravity: { min: 1.6, max: 15, step: 0.2, unit: 'm/s²', label: 'Gia tốc g' },
      theta0: { min: 5, max: 45, step: 1, unit: '°', label: 'Góc lệch ban đầu α₀' }
    },
    practiceExercises: [
      {
        source: 'HSG Vật lí · Con lắc vướng đinh',
        question:
          'Con lắc đơn dài $l_1 = 1\\text{ m}$ ($g = \\pi^2\\text{ m/s}^2$). Trên đường thẳng đứng qua điểm treo, tại vị trí cách điểm treo $75\\text{ cm}$ có đóng một chiếc đinh ($l_2 = 25\\text{ cm}$). Chu kì dao động nhỏ của con lắc vướng đinh là:',
        options: ['A. 1,5 s', 'B. 2,0 s', 'C. 1,0 s', 'D. 1,25 s'],
        correctIndex: 0,
        explanation:
          '$T_1 = 2\\pi\\sqrt{\\frac{1}{\\pi^2}} = 2\\text{ s}$; $T_2 = 2\\pi\\sqrt{\\frac{0{,}25}{\\pi^2}} = 1\\text{ s}$. Chu kì toàn phần $T = \\frac{T_1 + T_2}{2} = \\frac{2 + 1}{2} = 1{,}5\\text{ s}$.'
      },
      {
        source: 'Chuyên Lí · Dao động tắt dần',
        question:
          'Con lắc lò xo ngang gồm $k = 100\\text{ N/m}$, $m = 0{,}2\\text{ kg}$, hệ số ma sát $\\mu = 0{,}1$ ($g = 10\\text{ m/s}^2$). Kéo lệch biên độ $A_0 = 10\\text{ cm}$ rồi thả nhẹ. Độ giảm biên độ sau 1 chu kì đầu tiên là:',
        options: ['A. 0,8 cm', 'B. 0,4 cm', 'C. 1,6 cm', 'D. 0,2 cm'],
        correctIndex: 0,
        explanation:
          '$\\Delta A = \\frac{4\\mu m g}{k} = \\frac{4 \\cdot 0{,}1 \\cdot 0{,}2 \\cdot 10}{100} = 0{,}008\\text{ m} = 0{,}8\\text{ cm}$.'
      },
      {
        source: 'Chuyên Nhiệt động lực học',
        question:
          'Một động cơ nhiệt lý tưởng hoạt động theo chu trình Carnot giữa nguồn nóng $227^\\circ\\text{C}$ và nguồn lạnh $27^\\circ\\text{C}$. Hiệu suất cực đại của động cơ là:',
        options: ['A. 40%', 'B. 88%', 'C. 60%', 'D. 20%'],
        correctIndex: 0,
        explanation:
          'Đổi sang Kelvin: $T_1 = 500\\text{ K}$, $T_2 = 300\\text{ K}$. $H_{\\max} = 1 - \\frac{300}{500} = 0{,}4 = 40\\%$.'
      }
    ],
    essayExercises: [
      {
        source: 'Đề HSG · Dao động tắt dần chính xác',
        question:
          'Một con lắc lò xo nằm ngang có $k = 50\\text{ N/m}$, $m = 0{,}5\\text{ kg}$, hệ số ma sát $\\mu = 0{,}1$ ($g = 10\\text{ m/s}^2$). Kéo vật tới vị trí lò xo giãn $A_0 = 10\\text{ cm}$ rồi thả không vận tốc đầu. Tìm vận tốc cực đại của vật trong quá trình dao động và tổng quãng đường vật đi được đến lúc dừng.',
        hints: ['Vận tốc đạt cực đại khi vật đi qua VTCB tạm $x_0 = \\frac{\\mu m g}{k}$ ở nửa chu kì đầu tiên!'],
        solutionSteps: [
          'Bước 1: Tần số góc $\\omega = \\sqrt{\\frac{50}{0{,}5}} = 10\\text{ rad/s}$. Độ biến dạng tại VTCB tạm: $x_0 = \\frac{\\mu mg}{k} = \\frac{0{,}1 \\cdot 0{,}5 \\cdot 10}{50} = 0{,}01\\text{ m} = 1\\text{ cm}$.',
          'Bước 2: Ở nửa chu kì đầu, vật dao động quanh VTCB tạm với biên độ $A_1 = A_0 - x_0 = 10 - 1 = 9\\text{ cm}$. Vậy $v_{\\max} = \\omega A_1 = 10 \\cdot 9 = 90\\text{ cm/s} = 0{,}9\\text{ m/s}$.',
          'Bước 3: Quãng đường xấp xỉ: $N = \\lfloor \\frac{A_0}{2x_0} \\rfloor = \\frac{10}{2} = 5$ nửa chu kì, vật dừng đúng tại $x = 0$! Tổng quãng đường: $S = \\frac{k A_0^2}{2\\mu mg} = \\frac{50 \\cdot 0{,}1^2}{2 \\cdot 0{,}5} = 0{,}5\\text{ m} = 50\\text{ cm}$.'
        ],
        finalAnswer: '$v_{\\max} = 0{,}9\\text{ m/s}$; tổng quãng đường $S = 50\\text{ cm}$.'
      },
      {
        source: 'Đề Chuyên Lí · Chu trình p-V',
        question:
          '$1\\text{ mol}$ khí lí tưởng đơn nguyên tử thực hiện chu trình $1 \\to 2 \\to 3 \\to 1$ trên đồ thị $(p - V)$: $1 \\to 2$ giãn đẳng áp ở $p_1 = 2\\cdot 10^5\\text{ Pa}$ từ $V_1 = 2\\text{ lít}$ lên $V_2 = 6\\text{ lít}$; $2 \\to 3$ làm lạnh đẳng tích xuống $p_3 = 1\\cdot 10^5\\text{ Pa}$; $3 \\to 1$ nén tuyến tính theo đường thẳng về trạng thái 1. Tính công khí thực hiện sau 1 chu trình.',
        hints: ['Trên đồ thị $(p - V)$, chu trình $1\\to 2\\to 3\\to 1$ là một tam giác vuông chiều thuận kim đồng hồ. Công bằng diện tích tam giác!'],
        solutionSteps: [
          'Bước 1: Đổi thể tích sang $\\text{m}^3$: $V_1 = 2\\cdot 10^{-3}\\text{ m}^3$, $V_2 = 6\\cdot 10^{-3}\\text{ m}^3$.',
          'Bước 2: Chu trình chạy theo chiều kim đồng hồ nên công sinh ra dương ($A\' > 0$) và bằng diện tích tam giác vuông $123$.',
          'Bước 3: $A\' = \\frac{1}{2} (p_1 - p_3)(V_2 - V_1) = \\frac{1}{2}(2\\cdot 10^5 - 1\\cdot 10^5)(6 - 2)\\cdot 10^{-3} = 0{,}5 \\cdot 10^5 \\cdot 4\\cdot 10^{-3} = 200\\text{ J}$.'
        ],
        finalAnswer: 'Công khí sinh ra sau 1 chu trình: $A\' = 200\\text{ J}$.'
      }
    ]
  },
  {
    id: 'phys-doppler-effect',
    lessonNumber: 16,
    title: 'Hiệu ứng Doppler & Sóng xung kích Mach: Nguồn sóng chuyển động',
    subtitle: 'Chuyên Lí Sóng âm · Độ nén bước sóng & Nón Mach',
    grade: 'Lớp 11',
    track: 'chuyen',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Bậc 2: Nâng cao Chuyên · Sóng âm & Doppler',
    sourceTag: 'Bồi dưỡng Chuyên Lí · Lab 2D & 3D Doppler',
    description:
      'Giải thích trực quan sự thay đổi bước sóng và cao độ âm thanh khi nguồn phát chuyển động (như tiếng còi xe cứu thương lao tới rồi đi xa), cùng cơ chế hình thành nón sóng xung kích khi bay vượt tốc độ âm thanh.',
    theorySections: [
      {
        heading: '1. Độ nén mặt sóng & Công thức Doppler',
        content: 'Khi nguồn âm vừa phát ra sóng vừa chạy đuổi theo sóng đó về phía người nghe đứng yên với tốc độ $v_s < v$, các gợn sóng phía trước bị ép sát vào nhau nên bước sóng ngắn lại: $\\lambda\' = \\lambda\\left(1 - \\frac{v_s}{v}\\right)$, làm tần số âm nghe được cao (bổng) hơn bình thường.'
      },
      {
        heading: '2. Nón sóng Mach khi $v_s \\ge v$',
        content: 'Khi nguồn phát chuyển động nhanh hơn tốc độ âm thanh ($M = v_s/v > 1$), các mặt cầu sóng xếp chồng lên nhau tạo thành mặt nón sóng xung kích (gây tiếng nổ siêu thanh) với nửa góc mở $\\sin\\theta = \\frac{v}{v_s} = \\frac{1}{M}$.'
      }
    ],
    keyFormulas: [
      "f'_{\\text{lại gần}} = f_0 \\frac{v}{v - v_s}",
      "f''_{\\text{ra xa}} = f_0 \\frac{v}{v + v_s}",
      '\\sin\\theta_{\\text{Mach}} = \\frac{v}{v_s}'
    ],
    simulationType: 'doppler_effect',
    sim3dType: 'doppler_effect_3d',
    defaultParams: { waveSpeed: 340, sourceSpeed: 140, sourceFreq: 440 },
    paramBounds: {
      waveSpeed: { min: 150, max: 500, step: 10, unit: 'm/s', label: 'Tốc độ truyền sóng v' },
      sourceSpeed: { min: 0, max: 520, step: 10, unit: 'm/s', label: 'Tốc độ nguồn phát v_s' },
      sourceFreq: { min: 150, max: 800, step: 10, unit: 'Hz', label: 'Tần số gốc nguồn f₀' }
    },
    practiceExercises: [
      {
        source: 'Chuyên Lí · Hiệu ứng Doppler âm thanh',
        question:
          'Một xe cứu thương phát còi tần số $f_0 = 600\\text{ Hz}$ chạy thẳng lại gần người đứng yên với tốc độ $v_s = 34\\text{ m/s}$ (tốc độ âm $v = 340\\text{ m/s}$). Tần số người đó nghe được gần nhất với:',
        options: ['A. 666,7 Hz', 'B. 545,5 Hz', 'C. 634,0 Hz', 'D. 720,0 Hz'],
        correctIndex: 0,
        explanation: "$f' = f_0 \\frac{v}{v - v_s} = 600 \\cdot \\frac{340}{340 - 34} = 600 \\cdot \\frac{340}{306} \\approx 666{,}7\\text{ Hz}$."
      }
    ],
    essayExercises: [
      {
        source: 'Chuyên đề Sóng siêu thanh · Góc nón Mach',
        question:
          'Một máy bay siêu thanh bay ngang ở độ cao không đổi với tốc độ $v_s = 680\\text{ m/s}$ trong không khí có tốc độ âm $v = 340\\text{ m/s}$. Tính số Mach và nửa góc mở của nón sóng xung kích.',
        hints: ['Tính số Mach $M = v_s / v$, sau đó áp dụng $\\sin\\theta = 1/M$.'],
        solutionSteps: [
          'Bước 1: Số Mach $M = \\frac{v_s}{v} = \\frac{680}{340} = 2$.',
          'Bước 2: $\\sin\\theta = \\frac{1}{M} = \\frac{1}{2} \\Rightarrow \\theta = 30^\\circ$.'
        ],
        finalAnswer: 'Số Mach $M = 2$; nửa góc mở nón sóng xung kích $\\theta = 30^\\circ$.'
      }
    ]
  },
  ...PHYSICS_EXTRA_10_LESSONS,
  ...PHYSICS_GDPT_2006_LESSONS,
];
