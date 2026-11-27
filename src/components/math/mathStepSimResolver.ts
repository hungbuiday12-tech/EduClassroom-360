import { MathLecture } from '../../types';
import { Math3DMode } from './Math3DView';

export type Math2DSimKind =
  | 'quadratic_parabola_2d'
  | 'cubic_extrema_2d'
  | 'derivative_tangent_2d'
  | 'integral_riemann_2d'
  | 'trig_unit_circle_2d'
  | 'exp_log_2d'
  | 'circle_theorems_2d'
  | 'triangle_pythagoras_2d'
  | 'conic_sections_2d'
  | 'vectors_2d'
  | 'probability_normal_2d'
  | 'number_arithmetic_2d'
  | 'fractions_ratio_2d'
  | 'statistics_chart_2d';

export interface Math2DParamSpec {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface Math2DPreset {
  label: string;
  params: Record<string, number>;
}

export interface ResolvedMathStepSim {
  sim2dKind: Math2DSimKind;
  title2d: string;
  subtitle2d: string;
  formula2d: string;
  defaultParams: Record<string, number>;
  paramDefs: Math2DParamSpec[];
  presets: Math2DPreset[];
  mode3d: Math3DMode;
  allowed3dModes: Math3DMode[];
  title3d: string;
  subtitle3d: string;
}

function normText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const MODE_3D_LABELS: Record<Math3DMode, { title: string; subtitle: string }> = {
  oxyz_vector: {
    title: 'Hệ Trục Oxyz · Vectơ & Tích Có Hướng 3D',
    subtitle: 'Xoay hệ trục tọa độ Oxyz, chỉnh vectơ u, v và quan sát mặt phẳng bình hành tích có hướng.'
  },
  sphere_plane: {
    title: 'Mặt Cầu & Mặt Phẳng Thiết Diện 3D',
    subtitle: 'Thay đổi bán kính R và khoảng cách d(I, (P)) để kiểm chứng giao tuyến đường tròn r = √(R² − d²).'
  },
  pyramid_section: {
    title: 'Hình Chóp & Mặt Cắt Thiết Diện Động 3D',
    subtitle: 'Trượt mặt phẳng song song đáy để quan sát tỉ số đồng dạng diện tích thiết diện theo k².'
  },
  revolution_solid: {
    title: 'Khối Tròn Xoay & Thể Tích Tích Phân 3D',
    subtitle: 'Quay đường cong quanh trục Ox tạo nên vật thể tròn xoay V = π∫[f(x)]²dx.'
  },
  conic_sections_3d: {
    title: 'Mặt Nón Đôi & Ba Đường Conic 3D',
    subtitle: 'Thay đổi góc nghiêng mặt cắt qua mặt nón đôi để thu được Elip, Parabol hoặc Hypebol.'
  },
  line_plane_oxyz: {
    title: 'Đường Thẳng & Mặt Phẳng Trong Oxyz',
    subtitle: 'Điều chỉnh vectơ chỉ phương, góc nghiêng mặt phẳng (P) để quan sát giao điểm và góc sin(d,(P)).'
  },
  integral_disks_3d: {
    title: 'Đĩa Trụ Tích Phân Riemann 3D',
    subtitle: 'Tăng số lát cắt n đĩa trụ để thấy tổng thể tích xấp xỉ hội tụ về giá trị tích phân chính xác.'
  },
  circle_theorems_3d: {
    title: 'Đường Tròn, Tiếp Tuyến & Nón Tiếp Xúc 3D',
    subtitle: 'Quan sát hai tiếp tuyến cắt nhau, góc nội tiếp và tính chất vuông góc với bán kính trong 3D.'
  },
  tangent_surface_3d: {
    title: 'Bề Mặt Đạo Hàm & Mặt Phẳng Tiếp Diện 3D',
    subtitle: 'Di chuyển điểm (x₀, y₀) trên mặt cong f(x,y) để thấy tiếp diện và vectơ pháp tuyến.'
  },
  probability_bell_3d: {
    title: 'Chuông Phân Phối Chuẩn & Xác Suất 3D',
    subtitle: 'Thay đổi kỳ vọng μ và độ lệch chuẩn σ để quan sát độ tập trung của mật độ xác suất.'
  },
  geometric_transform_3d: {
    title: 'Phép Biến Hình & Tọa Độ Không Gian 3D',
    subtitle: 'Trực quan hóa phép tịnh tiến, phép quay và phép vị tự tỉ số k trên khối đa diện 3D.'
  },
  arithmetic_prism_3d: {
    title: 'Khối Lập Phương ƯCLN / BCNN & Phân Tích Thừa Số 3D',
    subtitle: 'Xếp khít hình hộp a × b × c bằng khối lập phương cạnh d = ƯCLN và mô hình hóa tỉ số thể tích 3D.'
  },
  solid_prism_nets_3d: {
    title: 'Hình Hộp, Lăng Trụ Đứng & Khai Triển Hình Chóp 3D',
    subtitle: 'Kéo thanh gập/mở khai triển từ lưới 2D thành hình hộp chữ nhật, lăng trụ tam giác hoặc hình chóp đều 3D.'
  },
  angle_thales_3d: {
    title: 'Góc Song Song, Tam Giác & Định Lý Thalès 3D',
    subtitle: 'Trực quan hóa hai đường song song bị cắt bởi cát tuyến, các góc so le trong/đồng vị và mặt cắt tỉ lệ Thalès trên khối chóp.'
  }
};

export function resolveMathStepSim(
  lesson: MathLecture,
  _stepIndex: number,
  stepTitle?: string,
  stepConcept?: string
): ResolvedMathStepSim {
  const combined = normText(
    `${lesson.id} ${lesson.title} ${lesson.category || ''} ${stepTitle || ''} ${stepConcept || ''}`
  );

  // Pick 3D mode (prefer step/context hints, then lesson.sim3dMode fallback)
  let mode3d: Math3DMode = lesson.sim3dMode || 'oxyz_vector';
  if (/mat cau|duong tron giao tuyen|khoang cach tam/.test(combined)) {
    mode3d = 'sphere_plane';
  } else if (/hinh hop|lang tru|khai trien|trai phang|dien tich xung quanh|hinh chop.*deu|chop tam giac|chop tu giac/.test(combined)) {
    mode3d = 'solid_prism_nets_3d';
  } else if (/chop|thiet dien|the tich khoi|hinh hoc khong gian|tu dien/.test(combined)) {
    mode3d = 'pyramid_section';
  } else if (/tich phan|nguyen ham|riemann|dien tich hinh phang/.test(combined)) {
    mode3d = /tron xoay|the tich vat the/.test(combined) ? 'revolution_solid' : 'integral_disks_3d';
  } else if (/conic|elip|hypebol|parabol trong mat phang/.test(combined) && !/bac 2|tam thuc/.test(combined)) {
    mode3d = 'conic_sections_3d';
  } else if (/ucln|bcnn|nguyen to|chia het|tap hop|so nguyen|truc so|phan so|thap phan|ti so|ti le thuc|phan tram|luy thua so tu nhien|so huu ti/.test(combined)) {
    mode3d = 'arithmetic_prism_3d';
  } else if (/duong thang.*mat phang|phuong trinh mat phang|oxyz|bac nhat/.test(combined)) {
    mode3d = /vecto|tich co huong/.test(combined) ? 'oxyz_vector' : 'line_plane_oxyz';
  } else if (/dao ham|tiep tuyen|cuc tri|don dieu|khao sat|hang dang thuc|da thuc/.test(combined)) {
    mode3d = 'tangent_surface_3d';
  } else if (/xac suat|thong ke|bieu do|tung dong xu|xuc xac|to hop|phan phoi|nhi thuc/.test(combined)) {
    mode3d = 'probability_bell_3d';
  } else if (/duong tron|goc noi tiep|tu giac noi tiep|cung|day/.test(combined)) {
    mode3d = 'circle_theorems_3d';
  } else if (/thales|tal[eé]t|dong dang|song song|so le trong|dong vi|tia phan giac|goc o vi tri dac biet|tong ba goc|hai tam giac bang nhau|hinh thang|binh hanh|hinh thoi|hinh chu nhat|hinh vuong/.test(combined)) {
    mode3d = 'angle_thales_3d';
  } else if (/bien hinh|tinh tien|vi tu|phep quay|doi xung|tam giac|tu giac|pytago|pythagore/.test(combined)) {
    mode3d = 'geometric_transform_3d';
  }

  const allowedSet = new Set<Math3DMode>([mode3d]);
  if (lesson.sim3dMode) allowedSet.add(lesson.sim3dMode);
  if (mode3d === 'integral_disks_3d') allowedSet.add('revolution_solid');
  if (mode3d === 'oxyz_vector') allowedSet.add('line_plane_oxyz');
  if (mode3d === 'circle_theorems_3d') allowedSet.add('sphere_plane');
  if (mode3d === 'solid_prism_nets_3d') allowedSet.add('pyramid_section');
  if (mode3d === 'angle_thales_3d') allowedSet.add('pyramid_section');
  const allowed3dModes = Array.from(allowedSet);

  const m3 = MODE_3D_LABELS[mode3d];

  // Determine 2D simulation kind
  let sim2dKind: Math2DSimKind = 'quadratic_parabola_2d';

  if (/tich phan|nguyen ham|riemann|dien tich hinh phang|the tich tron xoay/.test(combined)) {
    sim2dKind = 'integral_riemann_2d';
  } else if (/dao ham|tiep tuyen/.test(combined) && !/duong tron/.test(combined)) {
    sim2dKind = 'derivative_tangent_2d';
  } else if (/bac 3|cuc tri|don dieu|tiem can|khao sat ham|gia tri lon nhat/.test(combined)) {
    sim2dKind = 'cubic_extrema_2d';
  } else if (/luong giac|sin|cos|tan|cot|cung luong giac/.test(combined)) {
    sim2dKind = 'trig_unit_circle_2d';
  } else if (/ham so mu|logarit|e\^x/.test(combined) && !/so tu nhien|so huu ti/.test(combined)) {
    sim2dKind = 'exp_log_2d';
  } else if (/conic|elip|hypebol|tieu diem|tam sai/.test(combined)) {
    sim2dKind = 'conic_sections_2d';
  } else if (/ucln|bcnn|nguyen to|chia het|tap hop|so tu nhien|so nguyen|truc so|luy thua voi so mu tu nhien/.test(combined)) {
    sim2dKind = 'number_arithmetic_2d';
  } else if (/phan so|thap phan|ti so|ti le thuc|phan tram|so huu ti|ti le thuan|ti le nghich/.test(combined)) {
    sim2dKind = 'fractions_ratio_2d';
  } else if (/bieu do|thong ke|tan so|xac suat thuc nghiem|tung dong xu|xuc xac|xac suat co dien/.test(combined)) {
    sim2dKind = 'statistics_chart_2d';
  } else if (/xac suat|to hop|chinh hop|hoan vi|trung binh|phuong sai|do lech/.test(combined)) {
    sim2dKind = 'probability_normal_2d';
  } else if (/duong tron|goc noi tiep|tu giac noi tiep|tiep tuyen.*duong tron|cung tron/.test(combined)) {
    sim2dKind = 'circle_theorems_2d';
  } else if (/pythagoras|pytago|pythagore|tam giac|tu giac|thales|tal[eé]t|hinh thang|binh hanh|hinh thoi|trung diem|he thuc luong|duong cao|duong trung tuyen|hinh chop|lang tru|hinh hop|mat cau/.test(combined)) {
    sim2dKind = 'triangle_pythagoras_2d';
  } else if (/vecto|toa do|oxyz|so phuc|bieu dien hinh hoc|tich vo huong|tich co huong/.test(combined)) {
    sim2dKind = 'vectors_2d';
  } else if (lesson.sim2dMode === 'geometry') {
    if (lesson.sim2dPreset === 'circle_tangent' || lesson.sim2dPreset === 'circle_chords_angles' || lesson.sim2dPreset === 'inscribed_quad' || lesson.sim2dPreset === 'circle_secant_power' || lesson.sim2dPreset === 'two_circles_relative') {
      sim2dKind = 'circle_theorems_2d';
    } else if (lesson.sim2dPreset === 'conic_ellipse') {
      sim2dKind = 'conic_sections_2d';
    } else if (lesson.sim2dPreset === 'vector_parallelogram' || lesson.sim2dPreset === 'complex_plane') {
      sim2dKind = 'vectors_2d';
    } else {
      sim2dKind = 'triangle_pythagoras_2d';
    }
  } else {
    sim2dKind = 'quadratic_parabola_2d';
  }

  switch (sim2dKind) {
    case 'cubic_extrema_2d':
      return {
        sim2dKind,
        title2d: 'Đồ Thị Hàm Bậc 3 · Cực Trị & Điểm Uốn',
        subtitle2d: 'Chỉnh hệ số a, b, c để quan sát cực đại, cực tiểu và sự biến thiên y’ = 0.',
        formula2d: 'y = a x^3 + b x^2 + c x + d,\\quad y\' = 3ax^2 + 2bx + c',
        defaultParams: { a: 1, b: 0, c: -3, d: 1 },
        paramDefs: [
          { key: 'a', label: 'Hệ số bậc 3 (a)', unit: '', min: -2, max: 2, step: 0.25 },
          { key: 'b', label: 'Hệ số bậc 2 (b)', unit: '', min: -3, max: 3, step: 0.5 },
          { key: 'c', label: 'Hệ số bậc 1 (c)', unit: '', min: -5, max: 4, step: 0.5 },
          { key: 'd', label: 'Hằng số tự do (d)', unit: '', min: -3, max: 3, step: 0.5 }
        ],
        presets: [
          { label: '2 cực trị (x³ − 3x + 1)', params: { a: 1, b: 0, c: -3, d: 1 } },
          { label: 'Đơn điệu tăng (x³ + x)', params: { a: 1, b: 0, c: 1, d: 0 } },
          { label: 'Nhánh trái lên (a < 0)', params: { a: -1, b: 0, c: 3, d: 0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'derivative_tangent_2d':
      return {
        sim2dKind,
        title2d: 'Đạo Hàm & Tiếp Tuyến Trượt Tại M(x₀, f(x₀))',
        subtitle2d: 'Kéo điểm x₀ hoặc bấm Chạy để quan sát tiếp tuyến đổi độ dốc theo f’(x₀).',
        formula2d: 'y - y_0 = f\'(x_0)(x - x_0),\\quad k = f\'(x_0)',
        defaultParams: { x0: 1.0, a: 0.5, c: -1.0 },
        paramDefs: [
          { key: 'x0', label: 'Hoành độ tiếp điểm x₀', unit: '', min: -2.8, max: 2.8, step: 0.1 },
          { key: 'a', label: 'Độ cong Parabol a', unit: '', min: -1.5, max: 1.5, step: 0.25 },
          { key: 'c', label: 'Tịnh tiến tung độ c', unit: '', min: -2.5, max: 2.5, step: 0.5 }
        ],
        presets: [
          { label: 'Tiếp tuyến dương (x₀ = 1,2)', params: { x0: 1.2, a: 0.5, c: -1.0 } },
          { label: 'Tiếp tuyến ngang (Đỉnh x₀ = 0)', params: { x0: 0, a: 0.5, c: -1.0 } },
          { label: 'Tiếp tuyến âm (x₀ = −1,5)', params: { x0: -1.5, a: 0.5, c: -1.0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'integral_riemann_2d':
      return {
        sim2dKind,
        title2d: 'Tích Phân Xác Định & Tổng Riemann n Hình Chữ Nhật',
        subtitle2d: 'Tăng số lát cắt n để thấy tổng diện tích các dải chữ nhật tiến tới ∫ₐᵇ f(x)dx.',
        formula2d: 'S = \\int_a^b f(x)\\,dx \\approx \\sum_{i=1}^{n} f(x_i)\\,\\Delta x',
        defaultParams: { aLim: 0, bLim: 3.0, nRects: 8 },
        paramDefs: [
          { key: 'aLim', label: 'Cận dưới a', unit: '', min: -2.0, max: 1.5, step: 0.25 },
          { key: 'bLim', label: 'Cận trên b', unit: '', min: 1.5, max: 4.0, step: 0.25 },
          { key: 'nRects', label: 'Số lát cắt Riemann n', unit: 'dải', min: 2, max: 40, step: 2 }
        ],
        presets: [
          { label: 'Thô (4 dải)', params: { aLim: 0, bLim: 3.0, nRects: 4 } },
          { label: 'Trung bình (12 dải)', params: { aLim: 0, bLim: 3.0, nRects: 12 } },
          { label: 'Mịn gần đúng (36 dải)', params: { aLim: 0, bLim: 3.0, nRects: 36 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'trig_unit_circle_2d':
      return {
        sim2dKind,
        title2d: 'Đường Tròn Lượng Giác & Sóng Sin / Cos Đồng Bộ',
        subtitle2d: 'Quay điểm M theo góc α (độ) để thấy tung độ sin(α) và hoành độ cos(α) chiếu sang đồ thị.',
        formula2d: '\\sin^2\\alpha + \\cos^2\\alpha = 1,\\quad M(\\cos\\alpha,\\, \\sin\\alpha)',
        defaultParams: { angleDeg: 45, amp: 1.0, freq: 1.0 },
        paramDefs: [
          { key: 'angleDeg', label: 'Góc lượng giác α', unit: '°', min: 0, max: 360, step: 5 },
          { key: 'amp', label: 'Biên độ sóng A', unit: '', min: 0.5, max: 1.5, step: 0.1 },
          { key: 'freq', label: 'Tần số góc ω', unit: '', min: 0.5, max: 2.5, step: 0.5 }
        ],
        presets: [
          { label: 'α = 30° (sin = 0,5)', params: { angleDeg: 30, amp: 1.0, freq: 1.0 } },
          { label: 'α = 60° (cos = 0,5)', params: { angleDeg: 60, amp: 1.0, freq: 1.0 } },
          { label: 'α = 135° (Góc tù)', params: { angleDeg: 135, amp: 1.0, freq: 1.0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'exp_log_2d':
      return {
        sim2dKind,
        title2d: 'Hàm Số Mũ y = aˣ & Logarit y = logₐx Đối Xứng Qua y = x',
        subtitle2d: 'Thử chuyển cơ số a > 1 (đồng biến) xuống 0 < a < 1 (nghịch biến) để so sánh đồ thị.',
        formula2d: 'y = a^x \\iff x = \\log_a y \\quad (a > 0,\\, a \\neq 1)',
        defaultParams: { baseA: 2.0, xVal: 1.5 },
        paramDefs: [
          { key: 'baseA', label: 'Cơ số a', unit: '', min: 0.3, max: 3.5, step: 0.1 },
          { key: 'xVal', label: 'Điểm khảo sát x', unit: '', min: -1.5, max: 2.5, step: 0.25 }
        ],
        presets: [
          { label: 'a = 2 (Đồng biến)', params: { baseA: 2.0, xVal: 1.5 } },
          { label: 'a = e ≈ 2,7', params: { baseA: 2.7, xVal: 1.0 } },
          { label: 'a = 0,5 (Nghịch biến)', params: { baseA: 0.5, xVal: 1.0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'circle_theorems_2d':
      return {
        sim2dKind,
        title2d: 'Đường Tròn · Góc Nội Tiếp & Hai Tiếp Tuyến Cắt Nhau',
        subtitle2d: 'Thay đổi vị trí điểm C trên cung lớn và khoảng cách M để kiểm chứng góc ở tâm = 2 × góc nội tiếp.',
        formula2d: '\\widehat{AOB} = 2\\widehat{ACB},\\quad MA = MB \\perp R',
        defaultParams: { radius: 95, arcAngle: 110, extFactor: 1.85 },
        paramDefs: [
          { key: 'radius', label: 'Bán kính R (tỉ lệ)', unit: 'px', min: 65, max: 115, step: 5 },
          { key: 'arcAngle', label: 'Góc ở tâm AOB', unit: '°', min: 50, max: 160, step: 5 },
          { key: 'extFactor', label: 'Khoảng cách OM/R', unit: 'R', min: 1.35, max: 2.4, step: 0.05 }
        ],
        presets: [
          { label: 'Cung 90° (Vuông)', params: { radius: 95, arcAngle: 90, extFactor: 1.8 } },
          { label: 'Cung 120° (Đều)', params: { radius: 95, arcAngle: 120, extFactor: 2.0 } },
          { label: 'Cung 60°', params: { radius: 95, arcAngle: 60, extFactor: 1.6 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'triangle_pythagoras_2d':
      return {
        sim2dKind,
        title2d: 'Tam Giác Vuông · Đường Cao & Hệ Thức Lượng',
        subtitle2d: 'Điều chỉnh hai cạnh góc vuông b, c để kiểm chứng định lí Pythagoras a² = b² + c² và h² = b’c’.',
        formula2d: 'a^2 = b^2 + c^2,\\quad h^2 = b\'\\cdot c\',\\quad a\\cdot h = b\\cdot c',
        defaultParams: { sideB: 3.0, sideC: 4.0 },
        paramDefs: [
          { key: 'sideB', label: 'Cạnh góc vuông AB (c)', unit: 'cm', min: 2.0, max: 6.0, step: 0.5 },
          { key: 'sideC', label: 'Cạnh góc vuông AC (b)', unit: 'cm', min: 2.0, max: 8.0, step: 0.5 }
        ],
        presets: [
          { label: 'Bộ số (3-4-5)', params: { sideB: 3.0, sideC: 4.0 } },
          { label: 'Bộ số (5-12 → tỉ lệ 2,5-6)', params: { sideB: 2.5, sideC: 6.0 } },
          { label: 'Tam giác vuông cân (4-4)', params: { sideB: 4.0, sideC: 4.0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'conic_sections_2d':
      return {
        sim2dKind,
        title2d: 'Đường Conic (Elip) · Tiêu Điểm F₁, F₂ & Tâm Sai e',
        subtitle2d: 'Thay đổi bán trục lớn a và bán trục nhỏ b để kiểm tra tổng MF₁ + MF₂ = 2a không đổi.',
        formula2d: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1,\\quad MF_1 + MF_2 = 2a,\\quad c^2 = a^2 - b^2',
        defaultParams: { semiA: 4.5, semiB: 2.7, thetaDeg: 40 },
        paramDefs: [
          { key: 'semiA', label: 'Bán trục lớn a', unit: '', min: 2.5, max: 5.5, step: 0.25 },
          { key: 'semiB', label: 'Bán trục nhỏ b', unit: '', min: 1.5, max: 4.0, step: 0.25 },
          { key: 'thetaDeg', label: 'Vị trí điểm M(θ)', unit: '°', min: 0, max: 360, step: 10 }
        ],
        presets: [
          { label: 'Elip chuẩn (a=4.5, b=2.7)', params: { semiA: 4.5, semiB: 2.7, thetaDeg: 40 } },
          { label: 'Elip dẹt (e lớn)', params: { semiA: 5.0, semiB: 1.75, thetaDeg: 55 } },
          { label: 'Gần tròn (a ≈ b)', params: { semiA: 3.5, semiB: 3.25, thetaDeg: 45 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'vectors_2d':
      return {
        sim2dKind,
        title2d: 'Vectơ Trên Mặt Phẳng Oxy · Quy Tắc Hình Bình Hành',
        subtitle2d: 'Chỉnh tọa độ vectơ u, v để tính tổng u + v, góc giữa hai vectơ và tích vô hướng u · v.',
        formula2d: '\\vec{u}\\cdot\\vec{v} = u_xv_x + u_yv_y = |\\vec{u}||\\vec{v}|\\cos\\varphi',
        defaultParams: { ux: 3.0, uy: 1.5, vx: 1.0, vy: 3.0 },
        paramDefs: [
          { key: 'ux', label: 'Hoành độ u_x', unit: '', min: -4, max: 4, step: 0.5 },
          { key: 'uy', label: 'Tung độ u_y', unit: '', min: -3, max: 3, step: 0.5 },
          { key: 'vx', label: 'Hoành độ v_x', unit: '', min: -4, max: 4, step: 0.5 },
          { key: 'vy', label: 'Tung độ v_y', unit: '', min: -3, max: 3, step: 0.5 }
        ],
        presets: [
          { label: 'Hai vectơ góc nhọn', params: { ux: 3.0, uy: 1.0, vx: 1.5, vy: 2.5 } },
          { label: 'Hai vectơ vuông góc (u·v = 0)', params: { ux: 3.0, uy: 1.5, vx: -1.5, vy: 3.0 } },
          { label: 'Cùng phương ngược hướng', params: { ux: 3.0, uy: 1.5, vx: -2.0, vy: -1.0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'probability_normal_2d':
      return {
        sim2dKind,
        title2d: 'Phân Phối Xác Suất & Mật Độ Chuẩn Gauss',
        subtitle2d: 'Điều chỉnh trung bình μ, độ lệch chuẩn σ và ngưỡng z để xem vùng xác suất tích lũy.',
        formula2d: 'P(\\mu-\\sigma \\le X \\le \\mu+\\sigma) \\approx 68{,}27\\%,\\quad \\mu \\pm 2\\sigma \\approx 95{,}45\\%',
        defaultParams: { mu: 0.0, sigma: 1.0, zBand: 1.0 },
        paramDefs: [
          { key: 'mu', label: 'Giá trị trung bình μ', unit: '', min: -1.5, max: 1.5, step: 0.25 },
          { key: 'sigma', label: 'Độ lệch chuẩn σ', unit: '', min: 0.5, max: 1.8, step: 0.1 },
          { key: 'zBand', label: 'Khoảng ±k·σ', unit: 'σ', min: 0.5, max: 3.0, step: 0.25 }
        ],
        presets: [
          { label: 'Quy tắc ±1σ (68,3%)', params: { mu: 0, sigma: 1.0, zBand: 1.0 } },
          { label: 'Quy tắc ±2σ (95,4%)', params: { mu: 0, sigma: 1.0, zBand: 2.0 } },
          { label: 'Phân tán rộng (σ = 1,6)', params: { mu: 0, sigma: 1.6, zBand: 1.5 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'number_arithmetic_2d':
      return {
        sim2dKind,
        title2d: 'Số Học & Trục Số Nguyên · Chia Ô Vuông ƯCLN / BCNN',
        subtitle2d: 'Chỉnh hai số a, b để chia hình chữ nhật a × b thành các ô vuông lớn nhất d = ƯCLN(a,b) và kiểm tra phép cộng trên trục số.',
        formula2d: '\\text{ƯCLN}(a,b) \\cdot \\text{BCNN}(a,b) = a \\cdot b,\\quad a + (-a) = 0',
        defaultParams: { numA: 12, numB: 8, intShift: -3 },
        paramDefs: [
          { key: 'numA', label: 'Số nguyên dương a', unit: '', min: 4, max: 24, step: 1 },
          { key: 'numB', label: 'Số nguyên dương b', unit: '', min: 4, max: 20, step: 1 },
          { key: 'intShift', label: 'Bước nhảy trục số Δ', unit: '', min: -6, max: 6, step: 1 }
        ],
        presets: [
          { label: 'ƯCLN(12, 8) = 4', params: { numA: 12, numB: 8, intShift: -3 } },
          { label: 'Nguyên tố cùng nhau (9, 8)', params: { numA: 9, numB: 8, intShift: 4 } },
          { label: 'ƯCLN(18, 12) = 6', params: { numA: 18, numB: 12, intShift: -5 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'fractions_ratio_2d':
      return {
        sim2dKind,
        title2d: 'Phân Số · Tỉ Lệ Thức & Đại Lượng Tỉ Lệ Thuận / Nghịch',
        subtitle2d: 'Kéo tử số p, mẫu số q và hệ số k để thấy trực quan phân số bằng nhau, phần trăm và quy tắc tam suất.',
        formula2d: '\\frac{a}{b} = \\frac{c}{d} \\iff a\\cdot d = b\\cdot c,\\quad y = kx,\\; x\\cdot y = k',
        defaultParams: { numerP: 3, denomQ: 4, scaleK: 2 },
        paramDefs: [
          { key: 'numerP', label: 'Tử số / Phần tô màu p', unit: '', min: 1, max: 12, step: 1 },
          { key: 'denomQ', label: 'Mẫu số / Tổng phần q', unit: '', min: 2, max: 12, step: 1 },
          { key: 'scaleK', label: 'Hệ số nhân / tỉ lệ k', unit: '', min: 1, max: 4, step: 1 }
        ],
        presets: [
          { label: 'Phân số 3/4 (75%)', params: { numerP: 3, denomQ: 4, scaleK: 2 } },
          { label: 'Phân số 2/5 (40%)', params: { numerP: 2, denomQ: 5, scaleK: 3 } },
          { label: 'Hỗn số 7/4 (175%)', params: { numerP: 7, denomQ: 4, scaleK: 2 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    case 'statistics_chart_2d':
      return {
        sim2dKind,
        title2d: 'Biểu Đồ Thống Kê & Tần Suất Xác Suất Thực Nghiệm',
        subtitle2d: 'Tăng số phép thử n (tung đồng xu / gieo xúc xắc) để thấy tần suất thực nghiệm hội tụ về xác suất lý thuyết.',
        formula2d: 'P_n(A) = \\frac{k}{n} \\xrightarrow{n\\to\\infty} P(A)',
        defaultParams: { nTrials: 40, trueProbPct: 50, chartMode: 1 },
        paramDefs: [
          { key: 'nTrials', label: 'Số phép thử n', unit: 'lần', min: 10, max: 200, step: 10 },
          { key: 'trueProbPct', label: 'Xác suất lý thuyết', unit: '%', min: 15, max: 85, step: 5 },
          { key: 'chartMode', label: 'Loại (1: Cột, 2: Quạt tròn)', unit: '', min: 1, max: 2, step: 1 }
        ],
        presets: [
          { label: 'Tung đồng xu (50%)', params: { nTrials: 60, trueProbPct: 50, chartMode: 1 } },
          { label: 'Ra mặt 6 chấm (≈17%)', params: { nTrials: 120, trueProbPct: 17, chartMode: 1 } },
          { label: 'Biểu đồ hình quạt tròn', params: { nTrials: 80, trueProbPct: 35, chartMode: 2 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };

    default:
      // quadratic_parabola_2d
      return {
        sim2dKind: 'quadratic_parabola_2d',
        title2d: 'Đồ Thị Parabol y = ax² + bx + c & Nghiệm Δ',
        subtitle2d: 'Thay đổi a, b, c để quan sát bề lõm Parabol, tọa độ đỉnh I và giao điểm trục hoành.',
        formula2d: '\\Delta = b^2 - 4ac,\\quad I\\left(-\\frac{b}{2a};\\,-\\frac{\\Delta}{4a}\\right)',
        defaultParams: { a: 1.0, b: -2.0, c: -3.0 },
        paramDefs: [
          { key: 'a', label: 'Hệ số bậc 2 (a)', unit: '', min: -2.0, max: 2.0, step: 0.25 },
          { key: 'b', label: 'Hệ số bậc 1 (b)', unit: '', min: -4.0, max: 4.0, step: 0.5 },
          { key: 'c', label: 'Hằng số tự do (c)', unit: '', min: -4.0, max: 4.0, step: 0.5 }
        ],
        presets: [
          { label: '2 nghiệm (x² − 2x − 3)', params: { a: 1.0, b: -2.0, c: -3.0 } },
          { label: 'Nghiệm kép (x² − 2x + 1)', params: { a: 1.0, b: -2.0, c: 1.0 } },
          { label: 'Úp ngược (a < 0)', params: { a: -1.0, b: 0, c: 3.0 } }
        ],
        mode3d,
        allowed3dModes,
        title3d: m3.title,
        subtitle3d: m3.subtitle
      };
  }
}
