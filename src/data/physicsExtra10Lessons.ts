import { PhysicsLesson } from '../types';
import { SIM_PRESETS } from './physicsSimPresets';

const ITEMS: Array<{
  id: string;
  num: number;
  grade: PhysicsLesson['grade'];
  title: string;
  sub: string;
  formula: string;
  preset: keyof typeof SIM_PRESETS;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}> = [
  {
    id: 'phys-extra-1',
    num: 101,
    grade: 'Lớp 12',
    title: 'Chuyên đề Va chạm Đàn hồi & Bảo toàn Động lượng 2D',
    sub: 'Phân tích góc tán xạ hai quả cầu khối lượng bằng nhau và biến thiên cơ năng',
    formula: 'm_1\\vec{v}_1 + m_2\\vec{v}_2 = m_1\\vec{v}_1\' + m_2\\vec{v}_2\'',
    preset: 'momentum',
    q: 'Khi một hạt chuyển động va chạm đàn hồi hoàn toàn vào hạt cùng khối lượng đang đứng yên (va chạm không xuyên tâm), góc giữa hai vectơ vận tốc sau va chạm là:',
    opts: ['45°', '60°', '90°', '120°'],
    ans: 2,
    exp: 'Từ bảo toàn động lượng và bảo toàn động năng với m₁ = m₂ suy ra v₁\'² + v₂\'² = v₁², tức hai vectơ vận tốc vuông góc 90°.'
  },
  {
    id: 'phys-extra-2',
    num: 102,
    grade: 'Lớp 11',
    title: 'Con lắc trùng phùng & Cộng hưởng Cơ học có Ma sát',
    sub: 'Điều kiện biên độ cực đại khi tần số ngoại lực bằng tần số riêng của hệ',
    formula: 'f_{\\text{ngoại}} = f_0 = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{m}}',
    preset: 'damped_resonance',
    q: 'Hiện tượng cộng hưởng cơ học xảy ra rõ nét nhất khi nào?',
    opts: [
      'Lực cản môi trường cực lớn và ngoại lực đổi liên tục',
      'Tần số ngoại lực cưỡng bức bằng đúng tần số dao động riêng của hệ',
      'Biên độ ngoại lực bằng 0',
      'Khối lượng vật bằng 0'
    ],
    ans: 1,
    exp: 'Khi f_ngoại = f_0, năng lượng truyền cho hệ mỗi chu kì đạt cực đại làm biên độ tăng vọt.'
  },
  {
    id: 'phys-extra-3',
    num: 103,
    grade: 'Lớp 11',
    title: 'Mạch Cầu Wheatstone cân bằng & Biến đổi Sao – Tam giác',
    sub: 'Phương pháp giải nhanh mạch điện phức hợp đối xứng và đo điện trở chính xác',
    formula: '\\frac{R_1}{R_2} = \\frac{R_3}{R_4} \\implies I_{\\text{nhánh giữa}} = 0',
    preset: 'wheatstone',
    q: 'Cho mạch cầu Wheatstone gồm R₁ = 4 Ω, R₂ = 8 Ω, R₃ = 6 Ω. Để ampe kế nhánh giữa chỉ số 0 thì R₄ bằng:',
    opts: ['3 Ω', '10 Ω', '12 Ω', '16 Ω'],
    ans: 2,
    exp: 'Điều kiện cân bằng R₁·R₄ = R₂·R₃ ⇒ R₄ = (8·6)/4 = 12 Ω.'
  },
  {
    id: 'phys-extra-4',
    num: 104,
    grade: 'Lớp 12',
    title: 'Hiệu ứng Doppler trong Âm học & Sóng xung kích Mach',
    sub: 'Tính tần số thu được khi nguồn âm và máy thu chuyển động tương đối',
    formula: 'f\' = f \\frac{v \\pm v_{\\text{thu}}}{v \\mp v_{\\text{nguồn}}}',
    preset: 'doppler',
    q: 'Khi nguồn phát âm tiến lại gần người đứng yên, tần số âm mà người đó nghe được sẽ:',
    opts: ['Nhỏ hơn tần số phát', 'Bằng tần số phát', 'Lớn hơn tần số phát', 'Bằng 0'],
    ans: 2,
    exp: 'Bước sóng phía trước nguồn bị nén lại nên tần số thu tăng lên (âm bổng hơn).'
  },
  {
    id: 'phys-extra-5',
    num: 105,
    grade: 'Lớp 11',
    title: 'Lực Lorentz & Chuyển động hạt điện tích trong Từ trường đều',
    sub: 'Quỹ đạo tròn, xoắn ốc và nguyên lý máy gia tốc Cyclotron – Khối phổ kế',
    formula: 'R = \\frac{mv}{|q|B}, \\quad T = \\frac{2\\pi m}{|q|B}',
    preset: 'hall_lorentz',
    q: 'Chu kì quay T của hạt mang điện bay vuông góc với cảm ứng từ đều B phụ thuộc yếu tố nào?',
    opts: ['Tỉ lệ thuận vận tốc v', 'Không phụ thuộc vận tốc v', 'Tỉ lệ bình phương vận tốc v²', 'Tỉ lệ nghịch khối lượng m'],
    ans: 1,
    exp: 'Vì R tỉ lệ với v nên T = 2πR/v = 2πm/(|q|B) hoàn toàn độc lập với tốc độ hạt.'
  },
  {
    id: 'phys-extra-6',
    num: 106,
    grade: 'Lớp 12',
    title: 'Hiệu ứng Quang điện & Động năng ban đầu cực đại Electron',
    sub: 'Phương trình Einstein hν = A + 1/2 mv²_max và điện thế hãm',
    formula: '\\frac{hc}{\\lambda} = A + e U_h',
    preset: 'photoelectric',
    q: 'Hiện tượng quang điện ngoài chỉ xảy ra với kim loại có giới hạn quang điện λ₀ khi bước sóng ánh sáng kích thích λ thỏa mãn:',
    opts: ['λ > λ₀', 'λ ≤ λ₀', 'λ = 2λ₀', 'Mọi λ bất kỳ'],
    ans: 1,
    exp: 'Năng lượng photon hc/λ phải lớn hơn hoặc bằng công thoát hc/λ₀, tức λ ≤ λ₀.'
  },
  {
    id: 'phys-extra-7',
    num: 107,
    grade: 'Lớp 12',
    title: 'Tán xạ Compton & Lưỡng tính sóng – hạt của Photon',
    sub: 'Chứng minh photon mang động lượng p = h/λ qua va chạm với electron tự do',
    formula: '\\Delta\\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta)',
    preset: 'compton',
    q: 'Trong tán xạ Compton dưới góc lệch θ = 90°, độ tăng bước sóng Δλ bằng đúng:',
    opts: ['0', 'Bước sóng Compton λ_C = h/(m_e c)', '2λ_C', 'λ_C / 2'],
    ans: 1,
    exp: 'Với θ = 90°, cos 90° = 0 nên Δλ = h/(m_e c) = λ_C ≈ 2,43 pm.'
  },
  {
    id: 'phys-extra-8',
    num: 108,
    grade: 'Lớp 12',
    title: 'Chu trình Nhiệt động lực học Carnot & Động cơ Nhiệt',
    sub: 'Giới hạn hiệu suất lý thuyết giữa nguồn nóng T₁ và nguồn lạnh T₂',
    formula: 'H_{\\max} = 1 - \\frac{T_2}{T_1}',
    preset: 'pv_thermo',
    q: 'Một động cơ Carnot nhận nhiệt từ nguồn nóng 600 K và nhả nhiệt cho nguồn lạnh 300 K có hiệu suất tối đa là:',
    opts: ['25%', '50%', '75%', '100%'],
    ans: 1,
    exp: 'H = 1 - 300/600 = 0,5 = 50%.'
  },
  {
    id: 'phys-extra-9',
    num: 109,
    grade: 'Lớp 12',
    title: 'Năng lượng liên kết Hạt nhân & Phản ứng Phân hạch / Nhiệt hạch',
    sub: 'Độ hụt khối Δm, năng lượng tỏa ra ΔE = (∑m_trước - ∑m_sau)c² và đường cong bền vững',
    formula: '\\Delta E = \\Delta m\\, c^2, \\quad \\varepsilon = \\frac{W_{\\text{lk}}}{A}',
    preset: 'binding_energy',
    q: 'Hạt nhân bền vững nhất trong tự nhiên có số khối A nằm trong khoảng nào?',
    opts: ['A < 10', '50 < A < 80 (vùng Sắt Fe)', 'A > 235', 'A = 4'],
    ans: 1,
    exp: 'Các hạt nhân trung bình 50 < A < 80 có năng lượng liên kết riêng lớn nhất (~8,8 MeV/nuclôn).'
  },
  {
    id: 'phys-extra-10',
    num: 110,
    grade: 'Lớp 10',
    title: 'Định luật Kepler & Vận tốc vũ trụ cấp I – cấp II',
    sub: 'Tính tốc độ vệ tinh quỹ đạo tròn và tốc độ thoát khỏi trường hấp dẫn hành tinh',
    formula: 'v_I = \\sqrt{\\frac{GM}{R}}, \\quad v_{II} = \\sqrt{2}\\,v_I',
    preset: 'kepler',
    q: 'Tỉ số giữa vận tốc vũ trụ cấp II và vận tốc vũ trụ cấp I của một hành tinh bằng:',
    opts: ['2', '√2', '1/2', 'π'],
    ans: 1,
    exp: 'v_II = √(2GM/R) = √2 · v_I.'
  }
];

export const PHYSICS_EXTRA_10_LESSONS: PhysicsLesson[] = ITEMS.map((it) => ({
  id: it.id,
  track: 'chuyen',
  grade: it.grade,
  tier: 'Chuyên / HSG',
  stageLabel: 'Khu Chuyên Lí · Chuyên đề Nâng cao',
  sourceTag: 'Synapse Chuyên đề Vật lí · Bồi dưỡng HSG',
  lessonNumber: it.num,
  title: it.title,
  subtitle: it.sub,
  description: it.sub,
  theorySections: [
    {
      heading: '1. Nguyên lý & Thiết lập công thức',
      content: `• ${it.sub}\n• Biểu thức nền tảng: $${it.formula}$.`
    }
  ],
  keyFormulas: [it.formula],
  ...SIM_PRESETS[it.preset],
  practiceExercises: [
    {
      source: 'Synapse Physics Pro',
      question: it.q,
      options: it.opts,
      correctIndex: it.ans,
      explanation: it.exp
    }
  ],
  essayExercises: [
    {
      source: 'Bài tập tự luận trọng tâm',
      question: `Trình bày ý nghĩa vật lí và điều kiện áp dụng của công thức $${it.formula}$.`,
      hints: ['Nêu rõ tên từng đại lượng, đơn vị SI và giới hạn mô hình.'],
      solutionSteps: [`Xác định rõ hệ quy chiếu và các giả thiết bảo toàn gắn với biểu thức $${it.formula}$.`],
      finalAnswer: `Hoàn thiện phân tích định lượng cho $${it.formula}$.`
    }
  ]
}));
