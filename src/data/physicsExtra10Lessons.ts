import { Physics3DMode, PhysicsLesson, PhysicsSimType } from '../types';
import { PHYSICS_2D_SIMS } from './physicsDomainsData';

function bindSim(simulationType: PhysicsSimType, sim3dType: Physics3DMode) {
  const spec = PHYSICS_2D_SIMS[simulationType];
  return {
    simulationType,
    sim3dType,
    defaultParams: { ...spec.defaultParams },
    paramBounds: spec.paramBounds
  };
}

export const PHYSICS_EXTRA_10_LESSONS: PhysicsLesson[] = [
  {
    id: 'phys-ext-1',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Cơ học Dao động Nâng cao',
    sourceTag: 'HSG Vật lí 11–12 · Dao động tắt dần & Ma sát',
    lessonNumber: 108,
    title: 'Dao động Tắt dần Khô (Coulomb) & Con lắc Lò xo Nằm ngang Có Ma sát',
    subtitle: 'Độ giảm biên độ sau mỗi nửa chu kì, tốc độ cực đại khi lực hồi phục cân bằng lực ma sát và vị trí dừng',
    description:
      'Phân tích định lượng dao động tắt dần do lực ma sát trượt có độ lớn không đổi: vị trí cân bằng tạm thời dịch chuyển về hai phía $x_0 = \\pm\\frac{\\mu mg}{k}$, công thức tính số dao động thực hiện trước khi dừng và tốc độ cực đại.',
    theorySections: [
      {
        heading: '1. Vị trí cân bằng tạm & Độ giảm biên độ mỗi nửa chu kì',
        content:
          '• Khi vật có khối lượng $m$ gắn lò xo độ cứng $k$ dao động trên mặt ngang hệ số ma sát $\\mu$, lực ma sát có độ lớn $F_{ms} = \\mu mg$ luôn ngược chiều vận tốc.\n• Trong nửa chu kì đầu (đi từ $+A_0$ về $-A_1$), vật cân bằng lực tạm thời tại $x_0 = \\frac{\\mu mg}{k}$, nên độ giảm biên độ sau **mỗi nửa chu kì** là $\\Delta A_{1/2} = 2x_0 = \\frac{2\\mu mg}{k}$, và sau **1 chu kì** là $\\Delta A = \\frac{4\\mu mg}{k}$.'
      },
      {
        heading: '2. Vận tốc cực đại & Vị trí dừng cuối cùng',
        content:
          '• Trong nửa chu kì đầu tiên, vận tốc đạt cực đại tại vị trí cân bằng tạm $x = x_0$: $v_{\\max} = \\omega(A_0 - x_0) = \\sqrt{\\frac{k}{m}}\\left(A_0 - \\frac{\\mu mg}{k}\\right)$.\n• Theo định lí biến thiên cơ năng, tổng quãng đường vật đi được cho đến khi dừng hẳn (gần đúng khi dừng gần VTCB) là $S \\approx \\frac{kA_0^2}{2\\mu mg}$. Số nửa chu kì thực hiện được là $N = \\left\\lfloor \\frac{A_0}{2x_0} \\right\\rfloor$ (chú ý xét biên dừng).'
      }
    ],
    keyFormulas: [
      'x_0 = \\frac{\\mu m g}{k}, \\quad \\Delta A_{1/2} = \\frac{2\\mu m g}{k}, \\quad \\Delta A_T = \\frac{4\\mu m g}{k}',
      'v_{\\max} = \\omega(A_0 - x_0) = \\sqrt{\\frac{k}{m}}\\left(A_0 - \\frac{\\mu m g}{k}\\right)',
      'S_{\\text{tổng}} \\approx \\frac{\\frac{1}{2}kA_0^2}{\\mu m g}'
    ],
    ...bindSim('spring_oscillation_horizontal', 'pendulum_spring'),
    practiceExercises: [
      {
        source: 'Chuyên Lí 11 · Con lắc tắt dần',
        question:
          'Một con lắc lò xo nằm ngang gồm vật $m = 0{,}4\\text{ kg}$, độ cứng $k = 40\\text{ N/m}$, kéo lệch $A_0 = 10\\text{ cm}$ rồi thả nhẹ. Hệ số ma sát trượt $\\mu = 0{,}05$, $g = 10\\text{ m/s}^2$. Độ giảm biên độ sau mỗi chu kì bằng:',
        options: ['A. $2\\text{ cm}$', 'B. $1\\text{ cm}$', 'C. $0{,}5\\text{ cm}$', 'D. $4\\text{ cm}$'],
        correctIndex: 0,
        explanation:
          'Ta có $x_0 = \\frac{\\mu m g}{k} = \\frac{0{,}05 \\cdot 0{,}4 \\cdot 10}{40} = 0{,}005\\text{ m} = 0{,}5\\text{ cm}$. Độ giảm biên độ sau một chu kì là $\\Delta A = 4x_0 = 2\\text{ cm}$.'
      },
      {
        source: 'HSG Vật lí · Vận tốc cực đại khi tắt dần',
        question:
          'Với số liệu câu trên ($m = 0{,}4\\text{ kg}$, $k = 40\\text{ N/m}$, $A_0 = 10\\text{ cm}$, $\\mu = 0{,}05$, $g = 10\\text{ m/s}^2$), tốc độ cực đại của vật trong quá trình dao động là:',
        options: ['A. $0{,}95\\text{ m/s}$', 'B. $1{,}00\\text{ m/s}$', 'C. $0{,}90\\text{ m/s}$', 'D. $0{,}85\\text{ m/s}$'],
        correctIndex: 0,
        explanation:
          'Tần số góc $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{40}{0{,}4}} = 10\\text{ rad/s}$. Tốc độ cực đại đạt tại $x_0 = 0{,}5\\text{ cm}$: $v_{\\max} = \\omega(A_0 - x_0) = 10 \\cdot (0{,}10 - 0{,}005) = 0{,}95\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: 'HSG Vật lí 12 · Cơ năng Dao động tắt dần',
        question:
          'Con lắc lò xo ngang có $k = 100\\text{ N/m}$, $m = 1\\text{ kg}$, $\\mu = 0{,}1$, $g = 10\\text{ m/s}^2$. Ban đầu kéo vật dãn $10\\text{ cm}$ rồi thả nhẹ. Tính tổng quãng đường vật đi được cho đến khi dừng lại và số nửa chu kì vật đi qua vị trí lò xo không biến dạng.',
        hints: ['Tính $x_0 = \\frac{\\mu mg}{k} = 1\\text{ cm}$, độ giảm sau mỗi nửa chu kì $\\Delta A_{1/2} = 2\\text{ cm}$.'],
        solutionSteps: [
          'Bước 1: $x_0 = \\frac{0{,}1 \\cdot 1 \\cdot 10}{100} = 0{,}01\\text{ m} = 1\\text{ cm}$. Sau mỗi nửa chu kì biên độ giảm $2x_0 = 2\\text{ cm}$: $10 \\to 8 \\to 6 \\to 4 \\to 2 \\to 0\\text{ cm}$ (vừa tròn 5 nửa chu kì!).',
          'Bước 2: Vì sau đúng 5 nửa chu kì vật dừng tại đúng $x = 0$, toàn bộ thế năng ban đầu chuyển thành công ma sát: $S = \\frac{\\frac{1}{2}kA_0^2}{\\mu mg} = \\frac{0{,}5 \\cdot 100 \\cdot 0{,}1^2}{0{,}1 \\cdot 1 \\cdot 10} = 0{,}5\\text{ m} = 50\\text{ cm}$.'
        ],
        finalAnswer: 'Quãng đường $S = 50\\text{ cm}$; vật đi qua vị trí lò xo không biến dạng $5$ lần.'
      }
    ]
  },
  {
    id: 'phys-ext-2',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Cơ học Tương đối & Hệ quay',
    sourceTag: 'Olympic Vật lí 30-4 · Hệ quy chiếu Quay & Con lắc Foucault',
    title: 'Hệ quy chiếu Quay, Lực Li tâm – Lực Coriolis & Đường vòng Nghiêng',
    subtitle: 'Gia tốc li tâm, lực Coriolis làm lệch mặt phẳng dao động con lắc Foucault và góc nghiêng an toàn trên đường đua',
    description:
      'Khám phá hai lực quán tính đặc trưng trong hệ quy chiếu quay với vận tốc góc $\\vec{\\omega}$: lực quán tính li tâm $\\vec{F}_{lt} = m\\omega^2\\vec{r}$ và lực Coriolis $\\vec{F}_C = -2m(\\vec{\\omega} \\times \\vec{v}\')$ — chìa khóa giải thích con lắc Foucault và chuyển động bão xoáy trên Trái Đất.',
    theorySections: [
      {
        heading: '1. Lực quán tính li tâm & Bài toán đường đua nghiêng',
        content:
          '• Trong hệ quy chiếu quay với tốc độ góc $\\omega$, vật ở cách trục quay đoạn $r$ chịu lực quán tính li tâm hướng ra xa trục: $F_{lt} = m\\omega^2 r = m\\frac{v^2}{r}$.\n• Trên khúc cua bán kính $R$ nghiêng góc $\\theta$ so với mặt ngang, để xe chạy không cần lực ma sát ngang: $\\tan\\theta = \\frac{v^2}{gR} \\implies v_{\\text{lí tưởng}} = \\sqrt{Rg\\tan\\theta}$.'
      },
      {
        heading: '2. Lực Coriolis & Con lắc Foucault',
        content:
          '• Khi vật chuyển động với vận tốc tương đối $\\vec{v}\'$ trong hệ quy chiếu quay $\\vec{\\omega}$, nó chịu thêm lực quán tính Coriolis: $\\vec{F}_C = -2m(\\vec{\\omega} \\times \\vec{v}\')$, có độ lớn $F_C = 2m\\omega v\'\\sin\\alpha$.\n• Do Trái Đất tự quay với tốc độ góc $\\omega_{\\text{TĐ}}$, tại vĩ độ $\\varphi$, mặt phẳng dao động của con lắc Foucault quay chậm với tốc độ góc biểu kiến $\\Omega = \\omega_{\\text{TĐ}}\\sin\\varphi$, chứng minh trực tiếp sự tự quay của Trái Đất!'
      }
    ],
    keyFormulas: [
      'v_{\\text{cua}} = \\sqrt{R g \\tan\\theta}, \\quad F_{lt} = m\\omega^2 r',
      '\\vec{F}_{\\text{Coriolis}} = -2m(\\vec{\\omega} \\times \\vec{v}\')',
      '\\Omega_{\\text{Foucault}} = \\omega_{\\text{TĐ}} \\sin\\varphi \\quad (T_{\\text{quay}} = \\frac{24\\text{ h}}{\\sin\\varphi})'
    ],
    ...bindSim('centrifuge_banked_curve', 'foucault_pendulum_3d'),
    practiceExercises: [
      {
        source: 'Chuyên Lí 10 · Đường cua nghiêng',
        question:
          'Một khúc cua đường đua có bán kính $R = 40\\text{ m}$, mặt đường nghiêng góc $\\theta$ với $\\tan\\theta = 0{,}25$ (lấy $g = 10\\text{ m/s}^2$). Tốc độ chạy xe sao cho không cần lực ma sát ngang là:',
        options: ['A. $10\\text{ m/s}$', 'B. $20\\text{ m/s}$', 'C. $12\\text{ m/s}$', 'D. $8\\text{ m/s}$'],
        correctIndex: 0,
        explanation:
          'Điều kiện cân bằng theo phương ngang không cần ma sát: $N\\sin\\theta = \\frac{mv^2}{R}$ và $N\\cos\\theta = mg \\implies v = \\sqrt{Rg\\tan\\theta} = \\sqrt{40 \\cdot 10 \\cdot 0{,}25} = \\sqrt{100} = 10\\text{ m/s}$.'
      },
      {
        source: 'Olympic Vật lí · Con lắc Foucault',
        question: 'Tại vĩ độ $\\varphi = 30^\\circ$ Bắc, chu kì quay trọn $360^\\circ$ của mặt phẳng dao động con lắc Foucault xấp xỉ bằng bao nhiêu giờ?',
        options: ['A. $48\\text{ giờ}$', 'B. $24\\text{ giờ}$', 'C. $12\\text{ giờ}$', 'D. $36\\text{ giờ}$'],
        correctIndex: 0,
        explanation:
          'Tốc độ góc tiến động $\\Omega = \\omega_{\\text{TĐ}}\\sin\\varphi \\implies T_{\\text{quay}} = \\frac{T_{\\text{TĐ}}}{\\sin\\varphi} = \\frac{24}{\\sin 30^\\circ} = \\frac{24}{0{,}5} = 48\\text{ giờ}$.'
      }
    ],
    essayExercises: [
      {
        source: 'Bồi dưỡng HSG 10 · Lực Coriolis',
        question:
          'Một đĩa tròn phẳng quay đều quanh trục thẳng đứng với $\\omega = 2\\text{ rad/s}$. Một viên bi nhỏ khối lượng $m = 0{,}1\\text{ kg}$ trượt dọc theo rãnh bán kính từ tâm ra mép với tốc độ tương đối không đổi $v\' = 1{,}5\\text{ m/s}$. Tính độ lớn lực Coriolis tác dụng lên bi.',
        hints: ['Vì $\\vec{v}\'$ nằm trong mặt phẳng đĩa còn $\\vec{\\omega}$ vuông góc với đĩa nên góc $\\alpha = 90^\\circ$.'],
        solutionSteps: [
          'Bước 1: Vì $\\vec{\\omega} \\perp \\vec{v}\'$ nên $\\sin\\alpha = 1$.',
          'Bước 2: Độ lớn lực Coriolis: $F_C = 2m\\omega v\' = 2 \\cdot 0{,}1 \\cdot 2 \\cdot 1{,}5 = 0{,}6\\text{ N}$.'
        ],
        finalAnswer: '$F_C = 0{,}6\\text{ N}$ (vuông góc với thành rãnh).'
      }
    ]
  },
  {
    id: 'phys-ext-3',
    track: 'chuyen',
    grade: 'Lớp 10',
    tier: 'Nâng cao',
    stageLabel: 'Khu Chuyên Lí · Cơ học Chất lưu',
    sourceTag: 'Chuyên đề Cơ học Chất lưu · Phương trình Bernoulli & Liên tục',
    title: 'Thủy động lực học: Phương trình Liên tục & Định luật Bernoulli',
    subtitle: 'Bảo toàn lưu lượng $S_1 v_1 = S_2 v_2$, áp suất tĩnh – áp suất động, ống đo Venturi và lực nâng cánh máy bay',
    description:
      'Giải bài toán dòng chảy ổn định không nhớt của chất lỏng lí tưởng bằng hai phương trình nền tảng: phương trình liên tục và định luật Bernoulli, ứng dụng đo tốc độ dòng bằng ống Pitot / Venturi và tính lực đẩy Ác-si-mét.',
    theorySections: [
      {
        heading: '1. Phương trình Liên tục của dòng chảy ổn định',
        content:
          '• Với chất lỏng không nén được chảy ổn định qua ống có tiết diện thay đổi, lưu lượng thể tích qua mọi mặt cắt là không đổi: $Q_V = S_1 v_1 = S_2 v_2 = \\text{const}$.\n• Do đó nơi nào ống hẹp ($S$ nhỏ), tốc độ dòng chảy $v$ càng lớn!'
      },
      {
        heading: '2. Phương trình Bernoulli',
        content:
          '• Dọc theo một đường dòng trong trọng trường: $p + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}$.\n• Trong đó $p$ là áp suất tĩnh, $\\frac{1}{2}\\rho v^2$ là áp suất động, $\\rho g h$ là áp suất thủy tĩnh. Khi ống nằm ngang ($h_1 = h_2$), nơi tốc độ chảy $v$ lớn thì áp suất tĩnh $p$ lại giảm (hiệu ứng Venturi tạo lực nâng cánh máy bay).'
      }
    ],
    keyFormulas: [
      'S_1 v_1 = S_2 v_2 = \\text{const}',
      'p_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = p_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2',
      'v_{\\text{thoát}} = \\sqrt{2gh} \\quad (\\text{Công thức Torricelli})'
    ],
    ...bindSim('bernoulli_flow', 'diffusion_gases_3d'),
    practiceExercises: [
      {
        source: 'Cơ học Chất lưu · Ống Venturi',
        question:
          'Nước ($\\rho = 1000\\text{ kg/m}^3$) chảy trong ống nằm ngang từ đoạn rộng tiết diện $S_1 = 20\\text{ cm}^2$ với tốc độ $v_1 = 2\\text{ m/s}$ sang đoạn thắt hẹp tiết diện $S_2 = 10\\text{ cm}^2$. Độ giảm áp suất tĩnh $p_1 - p_2$ là:',
        options: ['A. $6\\,000\\text{ Pa}$', 'B. $2\\,000\\text{ Pa}$', 'C. $4\\,000\\text{ Pa}$', 'D. $8\\,000\\text{ Pa}$'],
        correctIndex: 0,
        explanation:
          'Từ phương trình liên tục: $v_2 = \\frac{S_1}{S_2}v_1 = 2 \\cdot 2 = 4\\text{ m/s}$. Áp dụng Bernoulli cho ống ngang: $p_1 - p_2 = \\frac{1}{2}\\rho(v_2^2 - v_1^2) = 0{,}5 \\cdot 1000 \\cdot (16 - 4) = 6\\,000\\text{ Pa}$.'
      },
      {
        source: 'Định luật Torricelli · Bình thông nhau',
        question: 'Một bể nước lớn để hở miệng, khoét một lỗ nhỏ ở thành bên dưới mặt thoáng $h = 5\\text{ m}$ ($g = 10\\text{ m/s}^2$). Tốc độ tia nước phun ra ngay tại lỗ bằng:',
        options: ['A. $10\\text{ m/s}$', 'B. $5\\text{ m/s}$', 'C. $10\\sqrt{2}\\text{ m/s}$', 'D. $20\\text{ m/s}$'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức Torricelli suy từ Bernoulli: $v = \\sqrt{2gh} = \\sqrt{2 \\cdot 10 \\cdot 5} = 10\\text{ m/s}$.'
      }
    ],
    essayExercises: [
      {
        source: 'Bài tập Thủy động lực học · Lực nâng cánh',
        question:
          'Không khí ($\rho = 1{,}2\\text{ kg/m}^3$) thổi qua cánh máy bay diện tích $S = 25\\text{ m}^2$ với tốc độ ở mặt dưới $v_1 = 60\\text{ m/s}$ và mặt trên $v_2 = 80\\text{ m/s}$. Tính lực nâng khí động học tác dụng lên cánh.',
        hints: ['Áp dụng $\\Delta p = p_1 - p_2 = \\frac{1}{2}\\rho(v_2^2 - v_1^2)$, suy ra $F_{\\text{nâng}} = \\Delta p \\cdot S$.'],
        solutionSteps: [
          'Bước 1: Độ chênh áp suất giữa mặt dưới và mặt trên: $\\Delta p = \\frac{1}{2} \\cdot 1{,}2 \\cdot (80^2 - 60^2) = 0{,}6 \\cdot (6400 - 3600) = 1680\\text{ Pa}$.',
          'Bước 2: Lực nâng tác dụng lên toàn bộ diện tích cánh: $F = \\Delta p \\cdot S = 1680 \\cdot 25 = 42\\,000\\text{ N} = 42\\text{ kN}$.'
        ],
        finalAnswer: '$F_{\\text{nâng}} = 42\\text{ kN}$.'
      }
    ]
  },
  {
    id: 'phys-ext-4',
    track: 'chuyen',
    grade: 'Lớp 11',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Quang Sóng Nâng cao',
    sourceTag: 'Bồi dưỡng HSG Vật lí · Giao thoa Màng mỏng & Nhiễu xạ Một khe',
    title: 'Giao thoa Bản mỏng (Lớp phủ Chống chói) & Nhiễu xạ Một khe hẹp',
    subtitle: 'Bước nhảy pha $\\pi$ khi phản xạ từ môi trường chiết quang hơn, điều kiện cực đại màng mỏng và cực tiểu nhiễu xạ',
    description:
      'Giải mã nguyên lí màng xà phòng sặc sỡ và lớp phủ chống phản xạ AR trên ống kính quang học: tính hiệu quang trình $\\Delta L = 2nd\\cos r \\pm \\frac{\\lambda}{2}$ và khảo sát cường độ sáng nhiễu xạ qua khe đơn $a\\sin\\theta = k\\lambda$.',
    theorySections: [
      {
        heading: '1. Giao thoa trên Bản mỏng (Màng xà phòng / Lớp phủ AR)',
        content:
          '• Khi ánh sáng chiếu gần vuông góc ($r \\approx 0$) vào màng mỏng chiết suất $n$ bề dày $d$ đặt trong không khí, tia phản xạ mặt trên bị đổi pha $\\pi$ (tương đương cộng $\\frac{\\lambda}{2}$), tia mặt dưới phản xạ từ môi trường chiết quang kém nên không đổi pha.\n• Do đó hiệu quang trình là $\\Delta = 2nd + \\frac{\\lambda}{2}$. Điều kiện cực đại phản xạ: $2nd = \\left(k + \\frac{1}{2}\\right)\\lambda$; cực tiểu phản xạ (triệt tiêu chống chói): $2nd = k\\lambda$ ($k \\in \\mathbb{Z}$). Nếu lớp phủ nằm trên kính có $n_{\\text{kính}} > n_{\\text{phủ}} > 1$ thì cả hai mặt đều đổi pha $\\pi \\implies$ cực tiểu chống chói xảy ra khi $2nd = \\left(k + \\frac{1}{2}\\right)\\lambda$ (tối thiểu $d = \\frac{\\lambda}{4n}$).'
      },
      {
        heading: '2. Nhiễu xạ ánh sáng qua Một khe hẹp',
        content:
          '• Chiếu chùm sáng đơn sắc bước sóng $\\lambda$ vuông góc qua khe bề rộng $a$: vị trí các **cực tiểu** nhiễu xạ bậc $k$ thỏa $a\\sin\\theta_k = k\\lambda$ ($k = \\pm 1, \\pm 2, \\dots$).\n• Bề rộng của vân sáng trung tâm trên màn cách khe khoảng $D$ rộng gấp đôi các vân phụ: $\\Delta y_{TT} = \\frac{2\\lambda D}{a}$.'
      }
    ],
    keyFormulas: [
      '\\text{Lớp phủ trên kính } (1 < n < n_k):\\ 2nd = \\left(k + \\frac{1}{2}\\right)\\lambda \\implies d_{\\min} = \\frac{\\lambda}{4n}',
      'a\\sin\\theta_k = k\\lambda \\quad (k = \\pm 1, \\pm 2, \\dots \\text{ cực tiểu nhiễu xạ})',
      '\\Delta y_{TT} = \\frac{2\\lambda D}{a}'
    ],
    ...bindSim('thin_film_interference', 'young_interference_3d'),
    practiceExercises: [
      {
        source: 'Quang sóng Chuyên · Lớp phủ chống phản xạ',
        question:
          'Để triệt tiêu ánh sáng phản xạ có bước sóng $\\lambda = 552\\text{ nm}$ trên mặt kính ($n_k = 1{,}5$), người ta phủ lên kính một lớp $\\text{MgF}_2$ chiết suất $n = 1{,}38$. Độ dày tối thiểu của lớp phủ là:',
        options: ['A. $100\\text{ nm}$', 'B. $200\\text{ nm}$', 'C. $138\\text{ nm}$', 'D. $400\\text{ nm}$'],
        correctIndex: 0,
        explanation:
          'Vì $1 < 1{,}38 < 1{,}5$, ánh sáng phản xạ ở cả mặt trên và mặt dưới lớp phủ đều bị mất nửa bước sóng (đổi pha $\\pi$). Để triệt tiêu phản xạ thì $2nd = \\frac{\\lambda}{2} \\implies d_{\\min} = \\frac{\\lambda}{4n} = \\frac{552}{4 \\cdot 1{,}38} = 100\\text{ nm}$.'
      },
      {
        source: 'Quang học · Nhiễu xạ một khe',
        question:
          'Chiếu ánh sáng đơn sắc $\\lambda = 0{,}6\\,\\mu\\text{m}$ qua khe hẹp $a = 0{,}12\\text{ mm}$ lên màn cách khe $D = 1{,}5\\text{ m}$. Bề rộng vân sáng trung tâm là:',
        options: ['A. $15\\text{ mm}$', 'B. $7{,}5\\text{ mm}$', 'C. $30\\text{ mm}$', 'D. $10\\text{ mm}$'],
        correctIndex: 0,
        explanation:
          'Bề rộng vân sáng trung tâm bằng khoảng cách hai cực tiểu bậc $\\pm 1$: $\\Delta y_{TT} = \\frac{2\\lambda D}{a} = \\frac{2 \\cdot 0{,}6\\cdot 10^{-6} \\cdot 1{,}5}{0{,}12\\cdot 10^{-3}} = 0{,}015\\text{ m} = 15\\text{ mm}$.'
      }
    ],
    essayExercises: [
      {
        source: 'HSG Quang học · Màng xà phòng',
        question:
          'Một màng xà phòng đặt thẳng đứng trong không khí ($n = 1{,}33$) được rọi gần vuông góc bởi ánh sáng có bước sóng $\\lambda = 532\\text{ nm}$. Tìm hai giá trị độ dày dương nhỏ nhất của màng cho phản xạ sáng nhất.',
        hints: ['Màng trong không khí chỉ đổi pha $\\pi$ ở mặt trước, nên cực đại phản xạ khi $2nd = \\left(k + \\frac{1}{2}\\right)\\lambda$ với $k = 0, 1$.'],
        solutionSteps: [
          'Bước 1: Hiệu quang trình phản xạ từ hai mặt màng xà phòng: $\\Delta = 2nd + \\frac{\\lambda}{2}$. Điều kiện cực đại: $2nd = \\left(k + \\frac{1}{2}\\right)\\lambda$.',
          'Bước 2: Với $k = 0$: $d_1 = \\frac{\\lambda}{4n} = \\frac{532}{4 \\cdot 1{,}33} = 100\\text{ nm}$.',
          'Bước 3: Với $k = 1$: $d_2 = \\frac{3\\lambda}{4n} = 300\\text{ nm}$.'
        ],
        finalAnswer: '$d_1 = 100\\text{ nm}$ và $d_2 = 300\\text{ nm}$.'
      }
    ]
  },
  {
    id: 'phys-ext-5',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Vật lí Lượng tử Hiện đại',
    sourceTag: 'Chuyên đề Lượng tử · Tán xạ Compton & Sóng De Broglie',
    title: 'Hiệu ứng Compton (Động lượng Photon) & Sóng Vật chất De Broglie',
    subtitle: 'Chứng minh photon mang động lượng $p = h/\\lambda$, công thức độ dịch Compton $\\Delta\\lambda$ và bước sóng vật chất electron',
    description:
      'Khám phá bằng chứng thực nghiệm sắc bén nhất cho bản chất hạt của ánh sáng (hiệu ứng Compton) và bản chất sóng của hạt vi mô (giả thuyết De Broglie làm cơ sở cho kính hiển vi điện tử).',
    theorySections: [
      {
        heading: '1. Hiệu ứng Tán xạ Compton',
        content:
          '• Khi chùm tia X bước sóng $\\lambda$ va chạm đàn hồi với electron tự do, tia X tán xạ theo góc $\\theta$ có bước sóng $\\lambda\'$ dài hơn $\\lambda$.\n• Áp dụng bảo toàn năng lượng tương đối tính và động lượng photon $p = \\frac{h}{\\lambda}$ thu được: $\\Delta\\lambda = \\lambda\' - \\lambda = \\lambda_C (1 - \\cos\\theta)$, với bước sóng Compton của electron $\\lambda_C = \\frac{h}{m_e c} \\approx 2{,}426\\text{ pm}$.'
      },
      {
        heading: '2. Sóng Vật chất De Broglie',
        content:
          '• Năm 1924, Louis de Broglie đề xuất mọi hạt vi mô có động lượng $p = mv$ đều liên kết với một sóng có bước sóng $\\lambda = \\frac{h}{p} = \\frac{h}{mv}$ (hoặc $\\frac{h}{\\sqrt{2m e U}}$ nếu tăng tốc từ nghỉ qua hiệu điện thế $U$).\n• Nhờ $\\lambda$ của electron rất nhỏ (cỡ picomet), kính hiển vi điện tử đạt độ phân giải gấp hàng nghìn lần kính hiển vi quang học.'
      }
    ],
    keyFormulas: [
      'p_{\\text{photon}} = \\frac{\\varepsilon}{c} = \\frac{h}{\\lambda}',
      '\\Delta\\lambda = \\lambda\' - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta) \\approx 2{,}426(1 - \\cos\\theta)\\text{ pm}',
      '\\lambda_{\\text{De Broglie}} = \\frac{h}{mv} = \\frac{h}{\\sqrt{2m_e e U}}'
    ],
    ...bindSim('compton_scattering', 'compton_3d'),
    practiceExercises: [
      {
        source: 'Vật lí Hiện đại · Tán xạ Compton',
        question:
          'Photon tia X có bước sóng ban đầu $\\lambda = 50\\text{ pm}$ tán xạ Compton trên electron đứng yên theo góc lệch $\\theta = 60^\\circ$ (lấy $\\lambda_C = 2{,}426\\text{ pm}$). Bước sóng tia tán xạ $\\lambda\'$ bằng:',
        options: ['A. $51{,}213\\text{ pm}$', 'B. $52{,}426\\text{ pm}$', 'C. $54{,}852\\text{ pm}$', 'D. $50{,}606\\text{ pm}$'],
        correctIndex: 0,
        explanation:
          'Độ tăng bước sóng $\\Delta\\lambda = \\lambda_C(1 - \\cos 60^\\circ) = 2{,}426 \\cdot (1 - 0{,}5) = 1{,}213\\text{ pm}$. Vậy $\\lambda\' = 50 + 1{,}213 = 51{,}213\\text{ pm}$.'
      },
      {
        source: 'Lượng tử · Động năng Electron giật lùi',
        question: 'Trong tán xạ Compton, góc tán xạ $\\theta$ nào của photon truyền lại cho electron động năng giật lùi LỚN NHẤT?',
        options: ['A. $\\theta = 180^\\circ$ (bật ngược)', 'B. $\\theta = 90^\\circ$', 'C. $\\theta = 0^\\circ$', 'D. $\\theta = 60^\\circ$'],
        correctIndex: 0,
        explanation:
          'Năng lượng truyền cho electron $K_e = \\frac{hc}{\\lambda} - \\frac{hc}{\\lambda\'}$ lớn nhất khi $\\Delta\\lambda$ cực đại, tức $1 - \\cos\\theta = 2$ tại $\\theta = 180^\\circ$.'
      }
    ],
    essayExercises: [
      {
        source: 'Chuyên Vật lí 12 · Tán xạ Compton',
        question:
          'Chiếu chùm photon bước sóng $\\lambda = 20\\text{ pm}$ tán xạ Compton theo góc $\\theta = 90^\\circ$. Tính bước sóng sau tán xạ và phần trăm năng lượng photon bị mất.',
        hints: ['Tính $\\Delta\\lambda = \\lambda_C(1 - \\cos 90^\\circ) = 2{,}426\\text{ pm}$, tỉ lệ mất $\\frac{\\Delta E}{E} = \\frac{\\Delta\\lambda}{\\lambda\'}$.'],
        solutionSteps: [
          'Bước 1: $\\Delta\\lambda = 2{,}426(1 - 0) = 2{,}426\\text{ pm} \\implies \\lambda\' = 22{,}426\\text{ pm}$.',
          'Bước 2: Tỉ lệ năng lượng mất đi: $\\frac{E - E\'}{E} = 1 - \\frac{\\lambda}{\\lambda\'} = \\frac{\\Delta\\lambda}{\\lambda\'} = \\frac{2{,}426}{22{,}426} \\approx 10{,}82\\%$.'
        ],
        finalAnswer: '$\\lambda\' = 22{,}426\\text{ pm}$; photon mất khoảng $10{,}82\\%$ năng lượng.'
      }
    ]
  },
  {
    id: 'phys-ext-6',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    tier: 'Nâng cao',
    stageLabel: 'Điện Từ Học 12 · Dao động & Sóng Điện từ',
    sourceTag: 'Chuẩn Vật lí 12 · Mạch dao động LC & Sóng vô tuyến',
    title: 'Mạch Dao động Điện từ LC, Năng lượng Điện – Từ & Sóng Điện từ',
    subtitle: 'Tần số riêng $\\omega = 1/\\sqrt{LC}$, sự chuyển hóa năng lượng giữa tụ điện và cuộn cảm và công thức bước sóng $\\lambda = cT$',
    description:
      'Nắm chắc cơ chế phóng – nạp dao động điện từ tự do trong mạch LC lí tưởng: quan hệ vuông pha giữa điện tích $q$ và cường độ dòng $i$, bảo toàn năng lượng điện từ và cách mạch chọn sóng vô tuyến.',
    theorySections: [
      {
        heading: '1. Dao động điện từ tự do trong mạch LC lí tưởng',
        content:
          '• Phương trình dao động của điện tích trên bản tụ: $q(t) = Q_0\\cos(\\omega t + \\varphi)$ với tần số góc riêng $\\omega = \\frac{1}{\\sqrt{LC}}$, chu kì $T = 2\\pi\\sqrt{LC}$, tần số $f = \\frac{1}{2\\pi\\sqrt{LC}}$.\n• Cường độ dòng điện $i = q\'(t) = I_0\\cos(\\omega t + \\varphi + \\frac{\\pi}{2})$ (sớm pha $\\pi/2$ so với $q$ và $u$), với $I_0 = \\omega Q_0 = U_0\\sqrt{\\frac{C}{L}}$.'
      },
      {
        heading: '2. Năng lượng Điện từ & Mạch chọn sóng Vô tuyến',
        content:
          '• Năng lượng điện từ toàn phần bảo toàn: $W = W_đ + W_t = \\frac{q^2}{2C} + \\frac{1}{2}Li^2 = \\frac{1}{2}CU_0^2 = \\frac{1}{2}LI_0^2$. Khi $W_đ = n W_t$ thì $|u| = \\frac{U_0}{\\sqrt{1 + 1/n}}$ và $|i| = \\frac{I_0}{\\sqrt{n+1}}$.\n• Bước sóng điện từ mạch thu/phát được: $\\lambda = c \\cdot T = 2\\pi c \\sqrt{LC}$ (với $c = 3\\cdot 10^8\\text{ m/s}$).'
      }
    ],
    keyFormulas: [
      'T = 2\\pi\\sqrt{LC}, \\quad \\omega = \\frac{1}{\\sqrt{LC}}, \\quad I_0 = \\omega Q_0 = U_0\\sqrt{\\frac{C}{L}}',
      'W = \\frac{1}{2}CU_0^2 = \\frac{1}{2}LI_0^2 = \\frac{q^2}{2C} + \\frac{1}{2}Li^2',
      '\\lambda = 2\\pi c \\sqrt{LC}'
    ],
    ...bindSim('lc_oscillation', 'ac_generator_3d'),
    practiceExercises: [
      {
        source: 'Vật lí 12 · Mạch dao động LC',
        question:
          'Một mạch dao động LC lí tưởng gồm cuộn cảm $L = 4\\text{ mH}$ và tụ điện $C = 10\\,\\mu\\text{F}$. Lấy $\\pi^2 = 10$. Chu kì dao động riêng của mạch là:',
        options: ['A. $1{,}26\\text{ ms}$', 'B. $0{,}63\\text{ ms}$', 'C. $2{,}51\\text{ ms}$', 'D. $4{,}00\\text{ ms}$'],
        correctIndex: 0,
        explanation:
          '$T = 2\\pi\\sqrt{LC} = 2\\pi\\sqrt{4\\cdot 10^{-3} \\cdot 10\\cdot 10^{-6}} = 2\\pi \\cdot 2\\cdot 10^{-4} \\approx 1{,}256\\cdot 10^{-3}\\text{ s} \\approx 1{,}26\\text{ ms}$.'
      },
      {
        source: 'Vật lí 12 · Chọn sóng vô tuyến',
        question: 'Mạch thu sóng có $L$ không đổi, khi ghép với tụ $C_1$ thu được bước sóng $\\lambda_1 = 30\\text{ m}$. Để thu được bước sóng $\\lambda_2 = 60\\text{ m}$ cần điều chỉnh điện dung đến giá trị:',
        options: ['A. $4C_1$', 'B. $2C_1$', 'C. $0{,}5C_1$', 'D. $0{,}25C_1$'],
        correctIndex: 0,
        explanation: 'Vì $\\lambda = 2\\pi c\\sqrt{LC} \\propto \\sqrt{C}$, muốn $\\lambda$ tăng $2$ lần thì $C$ phải tăng $2^2 = 4$ lần.'
      }
    ],
    essayExercises: [
      {
        source: 'Bài tập Chuẩn Vật lí 12 · Năng lượng LC',
        question:
          'Mạch LC lí tưởng có $L = 2\\text{ mH}$, $C = 8\\text{ nF}$. Hiệu điện thế cực đại trên tụ là $U_0 = 6\\text{ V}$. Tính cường độ dòng điện cực đại $I_0$ và tìm độ lớn hiệu điện thế $u$ khi năng lượng từ trường gấp $3$ lần năng lượng điện trường.',
        hints: ['Dùng $\\frac{1}{2}LI_0^2 = \\frac{1}{2}CU_0^2$ và $W = W_đ + 3W_đ = 4W_đ$.'],
        solutionSteps: [
          'Bước 1: $I_0 = U_0\\sqrt{\\frac{C}{L}} = 6\\sqrt{\\frac{8\\cdot 10^{-9}}{2\\cdot 10^{-3}}} = 6 \\cdot 2\\cdot 10^{-3} = 12\\text{ mA}$.',
          'Bước 2: Khi $W_t = 3W_đ \\implies W = 4W_đ \\implies \\frac{1}{2}CU_0^2 = 4 \\cdot \\frac{1}{2}Cu^2 \\implies |u| = \\frac{U_0}{2} = 3\\text{ V}$.'
        ],
        finalAnswer: '$I_0 = 12\\text{ mA}$; $|u| = 3\\text{ V}$.'
      }
    ]
  },
  {
    id: 'phys-ext-7',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Từ trường & Hạt mang điện',
    sourceTag: 'HSG Vật lí · Máy gia tốc Cyclotron & Hiệu ứng Hall',
    title: 'Máy Gia tốc Hạt Cyclotron & Hiệu ứng Hall Đo Từ trường',
    subtitle: 'Tính bất biến của tần số cộng hưởng Cyclotron $f_c = qB/(2\\pi m)$, động năng cực đại $E_{\\max}$ và điện áp Hall $U_H$',
    description:
      'Nghiên cứu chuyển động tròn của hạt mang điện trong hai hộp chữ D của máy gia tốc Cyclotron và ứng dụng lực Lorentz giải thích hiệu ứng Hall tạo hiệu điện thế ngang trong bản dẫn điện.',
    theorySections: [
      {
        heading: '1. Nguyên lí máy gia tốc Cyclotron',
        content:
          '• Khi hạt điện tích $q$, khối lượng $m$ chuyển động vuông góc từ trường đều $B$, lực Lorentz làm hạt chuyển động tròn bán kính $R = \\frac{mv}{|q|B}$.\n• Điều kỳ diệu là chu kì quay $T = \\frac{2\\pi R}{v} = \\frac{2\\pi m}{|q|B}$ **hoàn toàn độc lập** với tốc độ $v$ và bán kính $R$! Do đó đặt điện áp xoay chiều tần số $f_c = \\frac{|q|B}{2\\pi m}$ giữa hai khe hộp chữ D sẽ gia tốc hạt đồng bộ mỗi nửa vòng đến tận mép hộp bán kính $R_{\\max}$, đạt động năng $K_{\\max} = \\frac{(qBR_{\\max})^2}{2m}$.'
      },
      {
        heading: '2. Hiệu ứng Hall & Cảm biến Từ trường',
        content:
          '• Cho dòng điện $I$ chạy qua tấm kim loại/bán dẫn bề dày $d$ đặt vuông góc với cảm ứng từ $B$. Lực Lorentz đẩy các hạt tải điện (mật độ $n$) dạt về một cạnh, sinh ra điện trường ngang $E_H$ cân bằng với lực Lorentz: $|q|E_H = |q|v_d B$.\n• Kết hợp $I = n|q|v_d S = n|q|v_d b d$ thu được hiệu điện thế Hall: $U_H = E_H b = \\frac{I \\cdot B}{n|q|d}$.'
      }
    ],
    keyFormulas: [
      'f_c = \\frac{|q|B}{2\\pi m}, \\quad K_{\\max} = \\frac{q^2 B^2 R_{\\max}^2}{2m}',
      'U_H = \\frac{I \\cdot B}{n \\cdot |q| \\cdot d}'
    ],
    ...bindSim('cyclotron_accelerator', 'cyclotron_3d'),
    practiceExercises: [
      {
        source: 'Chuyên Lí 12 · Máy Cyclotron',
        question:
          'Một máy gia tốc Cyclotron có từ trường $B = 1{,}5\\text{ T}$, bán kính cực đại $R = 0{,}5\\text{ m}$ dùng để gia tốc proton ($m = 1{,}67\\cdot 10^{-27}\\text{ kg}$, $q = 1{,}6\\cdot 10^{-19}\\text{ C}$). Động năng cực đại của chùm proton phóng ra xấp xỉ:',
        options: ['A. $26{,}8\\text{ MeV}$', 'B. $13{,}4\\text{ MeV}$', 'C. $53{,}6\\text{ MeV}$', 'D. $6{,}7\\text{ MeV}$'],
        correctIndex: 0,
        explanation:
          '$K_{\\max} = \\frac{q^2 B^2 R^2}{2m} = \\frac{(1{,}6\\cdot 10^{-19})^2 \\cdot 1{,}5^2 \\cdot 0{,}5^2}{2 \\cdot 1{,}67\\cdot 10^{-27}} \\approx 4{,}31\\cdot 10^{-12}\\text{ J}$. Đổi sang MeV (chia cho $1{,}6\\cdot 10^{-13}\\text{ J/MeV}$) được $\\approx 26{,}9\\text{ MeV} \\approx 26{,}8\\text{ MeV}$.'
      },
      {
        source: 'Điện từ học · Hiệu ứng Hall',
        question: 'Nếu giữ nguyên cường độ dòng điện $I$ và kích thước tấm dẫn nhưng tăng cảm ứng từ $B$ lên gấp đôi, hiệu điện thế Hall $U_H$ sẽ:',
        options: ['A. Tăng gấp đôi', 'B. Giảm một nửa', 'C. Tăng gấp bốn', 'D. Không đổi'],
        correctIndex: 0,
        explanation: 'Theo công thức $U_H = \\frac{I \\cdot B}{n|q|d}$, $U_H$ tỉ lệ thuận bậc nhất với $B$.'
      }
    ],
    essayExercises: [
      {
        source: 'HSG Điện từ · Cyclotron',
        question:
          'Tìm tần số cộng hưởng $f_c$ của điện áp đặt vào khe máy Cyclotron khi gia tốc hạt $\\alpha$ ($m_\\alpha \\approx 6{,}64\\cdot 10^{-27}\\text{ kg}$, $q = 3{,}2\\cdot 10^{-19}\\text{ C}$) trong từ trường $B = 1{,}3\\text{ T}$.',
        hints: ['Áp dụng $f_c = \\frac{|q|B}{2\\pi m_\\alpha}$.'],
        solutionSteps: [
          'Bước 1: $f_c = \\frac{3{,}2\\cdot 10^{-19} \\cdot 1{,}3}{2\\pi \\cdot 6{,}64\\cdot 10^{-27}}$.',
          'Bước 2: Tính số: $\\frac{4{,}16\\cdot 10^{-19}}{41{,}72\\cdot 10^{-27}} \\approx 9{,}97\\cdot 10^6\\text{ Hz} \\approx 10\\text{ MHz}$.'
        ],
        finalAnswer: '$f_c \\approx 10\\text{ MHz}$.'
      }
    ]
  },
  {
    id: 'phys-ext-8',
    track: 'chuyen',
    grade: 'Lớp 12',
    tier: 'Chuyên / HSG',
    stageLabel: 'Khu Chuyên Lí · Nhiệt động lực học Nâng cao',
    sourceTag: 'Chuẩn GDPT 2018 & Chuyên Lí · Chu trình Carnot & Nguyên lý II',
    title: 'Chu trình Nhiệt Carnot, Động cơ Nhiệt & Nguyên lí II Nhiệt động lực học',
    subtitle: '4 quá trình thuận nghịch đẳng nhiệt – đoạn nhiệt, hiệu suất lí tưởng Carnot $H = 1 - T_2/T_1$ và công thức entropy',
    description:
      'Phân tích giới hạn lí thuyết tối đa của mọi động cơ nhiệt do Sadi Carnot khám phá: cách tính công $A$, nhiệt lượng nhận $Q_1$, nhiệt nhả $Q_2$ trên giản đồ $p-V$ và ý nghĩa Nguyên lí II Nhiệt động lực học.',
    theorySections: [
      {
        heading: '1. Nguyên lí II Nhiệt động lực học & Động cơ Nhiệt',
        content:
          '• Nhiệt không thể tự truyền từ vật lạnh hơn sang vật nóng hơn (phát biểu Clausius); không thể chế tạo động cơ nhiệt hoạt động tuần hoàn biến toàn bộ nhiệt nhận từ một nguồn nóng thành công cơ học (phát biểu Kelvin-Planck).\n• Một động cơ nhiệt nhận nhiệt lượng $Q_1$ từ nguồn nóng (nhiệt độ $T_1$), thực hiện công $A = Q_1 - |Q_2|$ và nhả $|Q_2|$ cho nguồn lạnh ($T_2$). Hiệu suất thực tế luôn $H = \\frac{A}{Q_1} = 1 - \\frac{|Q_2|}{Q_1}$.'
      },
      {
        heading: '2. Chu trình Carnot & Hiệu suất Cực đại',
        content:
          '• Chu trình Carnot gồm 2 quá trình đẳng nhiệt thuận nghịch (nhiệt độ $T_1, T_2$) xen kẽ 2 quá trình đoạn nhiệt thuận nghịch ($Q = 0$, $pV^\\gamma = \\text{const}$).\n• Hiệu suất của máy Carnot chỉ phụ thuộc nhiệt độ tuyệt đối (Kelvin) hai nguồn: $H_{\\max} = 1 - \\frac{T_2}{T_1}$. Mọi động cơ thực làm việc giữa $T_1, T_2$ đều có $H \\le H_{\\text{Carnot}}$.'
      }
    ],
    keyFormulas: [
      'H = \\frac{A}{Q_1} = 1 - \\frac{|Q_2|}{Q_1}',
      'H_{\\text{Carnot}} = 1 - \\frac{T_2}{T_1} \\quad (T_1, T_2 \\text{ tính bằng Kelvin})',
      '\\varepsilon_{\\text{máy lạnh}} = \\frac{Q_2}{A} = \\frac{T_2}{T_1 - T_2}'
    ],
    ...bindSim('carnot_cycle_pv', 'carnot_piston_3d'),
    practiceExercises: [
      {
        source: 'Vật lí 12 · Động cơ Carnot',
        question:
          'Một động cơ nhiệt Carnot hoạt động giữa nguồn nóng có nhiệt độ $t_1 = 527^\\circ\\text{C}$ và nguồn lạnh có nhiệt độ $t_2 = 27^\\circ\\text{C}$. Hiệu suất cực đại của động cơ là:',
        options: ['A. $62{,}5\\%$', 'B. $94{,}9\\%$', 'C. $37{,}5\\%$', 'D. $50{,}0\\%$'],
        correctIndex: 0,
        explanation:
          'Đổi sang nhiệt độ tuyệt đối Kelvin: $T_1 = 527 + 273 = 800\\text{ K}$, $T_2 = 27 + 273 = 300\\text{ K}$. Hiệu suất Carnot: $H = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{800} = 0{,}625 = 62{,}5\\%$.'
      },
      {
        source: 'Nhiệt động lực học · Công cơ học',
        question: 'Một máy Carnot có hiệu suất $40\\%$, mỗi chu trình nhận nhiệt $Q_1 = 5\\text{ kJ}$ từ nguồn nóng. Nhiệt lượng tỏa ra cho nguồn lạnh bằng:',
        options: ['A. $3\\text{ kJ}$', 'B. $2\\text{ kJ}$', 'C. $4\\text{ kJ}$', 'D. $1\\text{ kJ}$'],
        correctIndex: 0,
        explanation: 'Công sinh ra $A = H \\cdot Q_1 = 0{,}4 \\cdot 5 = 2\\text{ kJ}$. Nhiệt nhả nguồn lạnh $|Q_2| = Q_1 - A = 5 - 2 = 3\\text{ kJ}$.'
      }
    ],
    essayExercises: [
      {
        source: 'Chuyên Nhiệt học · Chu trình Carnot',
        question:
          'Một động cơ Carnot hoạt động với nguồn lạnh ở $27^\\circ\\text{C}$ và có hiệu suất $40\\%$. Muốn hiệu suất tăng lên đến $60\\%$ mà giữ nguyên nguồn lạnh thì cần tăng nhiệt độ nguồn nóng thêm bao nhiêu Kelvin?',
        hints: ['Tính $T_1 = \\frac{T_2}{1 - H}$ cho cả hai trường hợp với $T_2 = 300\\text{ K}$.'],
        solutionSteps: [
          'Bước 1: $T_2 = 27 + 273 = 300\\text{ K}$. Lúc đầu: $T_1 = \\frac{300}{1 - 0{,}4} = 500\\text{ K}$.',
          'Bước 2: Lúc sau: $T_1\' = \\frac{300}{1 - 0{,}6} = 750\\text{ K}$.',
          'Bước 3: Độ tăng nhiệt độ nguồn nóng: $\\Delta T_1 = 750 - 500 = 250\\text{ K}$.'
        ],
        finalAnswer: 'Cần tăng nhiệt độ nguồn nóng thêm $250\\text{ K}$.'
      }
    ]
  },
  {
    id: 'phys-ext-9',
    track: 'khong_chuyen',
    grade: 'Lớp 12',
    tier: 'Nâng cao',
    stageLabel: 'Vật lí Hạt nhân 12 · Năng lượng & Tokamak',
    sourceTag: 'Chuẩn GDPT 2018 · Phản ứng Nhiệt hạch & Độ bền vững Hạt nhân',
    title: 'Năng lượng Liên kết Riêng, Phản ứng Nhiệt hạch & Lò phản ứng Tokamak',
    subtitle: 'Đường cong Aston, tính năng lượng tỏa thu theo $\\Delta W_{\\text{lk}}$ và điều kiện kích hoạt phản ứng nhiệt hạch D–T',
    description:
      'Hiểu vì sao các hạt nhân có số khối trung bình ($50 < A < 80$, tiêu biểu là $^{56}\\text{Fe}$) bền vững nhất, cách tính năng lượng phản ứng hạt nhân qua năng lượng liên kết riêng và nguyên lí giam hãm từ trường plasma trong lò Tokamak.',
    theorySections: [
      {
        heading: '1. Độ hụt khối, Năng lượng liên kết & Độ bền vững',
        content:
          '• Độ hụt khối: $\\Delta m = Z m_p + (A - Z) m_n - m_X$. Năng lượng liên kết: $W_{\\text{lk}} = \\Delta m \\cdot c^2$ ($1\\text{ u}c^2 \\approx 931{,}5\\text{ MeV}$).\n• **Năng lượng liên kết riêng** $W_{\\text{lkr}} = \\frac{W_{\\text{lk}}}{A}$ quyết định mức độ bền vững của hạt nhân: lớn nhất ở khoảng $A \\in [50; 80]$ (xấp xỉ $8{,}8\\text{ MeV/nuclôn}$ tại $^{56}_{26}\\text{Fe}$).'
      },
      {
        heading: '2. Phản ứng Nhiệt hạch & Lò Tokamak ITER',
        content:
          '• Phản ứng nhiệt hạch tổng hợp các hạt nhân rất nhẹ ($^2\\text{H} + ^3\\text{H} \\to ^4\\text{He} + ^1n$) có tổng năng lượng liên kết sau lớn hơn trước: $\\Delta E = \\sum W_{\\text{lk, sau}} - \\sum W_{\\text{lk, trước}} > 0$ (tỏa năng lượng cực lớn tính trên $1\\text{ kg}$ nhiên liệu).\n• Để vượt qua lực đẩy Coulomb giữa các hạt nhân dương, plasma D–T được nung tới hơn $100\\text{ triệu K}$ và giam hãm trong từ trường hình xuyến của lò Tokamak.'
      }
    ],
    keyFormulas: [
      'W_{\\text{lkr}} = \\frac{\\Delta m \\cdot c^2}{A}, \\quad 1\\text{ u}c^2 = 931{,}5\\text{ MeV}',
      '\\Delta E = \\left(\\sum m_{\\text{trước}} - \\sum m_{\\text{sau}}\\right)c^2 = \\sum W_{\\text{lk, sau}} - \\sum W_{\\text{lk, trước}}'
    ],
    ...bindSim('binding_energy_curve', 'tokamak_fusion_3d'),
    practiceExercises: [
      {
        source: 'Vật lí 12 GDPT 2018 · Năng lượng phản ứng hạt nhân',
        question:
          'Cho phản ứng nhiệt hạch $^2_1\\text{H} + ^3_1\\text{H} \\to ^4_2\\text{He} + ^1_0n$. Biết năng lượng liên kết riêng của $^2\\text{H}$, $^3\\text{H}$ và $^4\\text{He}$ lần lượt là $1{,}1\\text{ MeV}$, $2{,}83\\text{ MeV}$ và $7{,}1\\text{ MeV}$. Năng lượng tỏa ra của phản ứng xấp xỉ:',
        options: ['A. $17{,}71\\text{ MeV}$', 'B. $3{,}17\\text{ MeV}$', 'C. $28{,}40\\text{ MeV}$', 'D. $10{,}69\\text{ MeV}$'],
        correctIndex: 0,
        explanation:
          'Năng lượng liên kết của từng hạt: $W_{\\text{lk}}(\\text{D}) = 2 \\cdot 1{,}1 = 2{,}2\\text{ MeV}$; $W_{\\text{lk}}(\\text{T}) = 3 \\cdot 2{,}83 = 8{,}49\\text{ MeV}$; $W_{\\text{lk}}(\\text{He}) = 4 \\cdot 7{,}1 = 28{,}4\\text{ MeV}$ (nơtron đứng tự do có $W_{\\text{lk}} = 0$). Tỏa năng lượng: $\\Delta E = 28{,}4 - (2{,}2 + 8{,}49) = 17{,}71\\text{ MeV}$.'
      },
      {
        source: 'Vật lí Hạt nhân 12 · Độ bền vững',
        question: 'Sắp xếp theo thứ tự ĐỘ BỀN VỮNG tăng dần của 3 hạt nhân biết $W_{\\text{lkr}}(^{235}\\text{U}) = 7{,}6\\text{ MeV}$, $W_{\\text{lkr}}(^{4}\\text{He}) = 7{,}1\\text{ MeV}$, $W_{\\text{lkr}}(^{56}\\text{Fe}) = 8{,}8\\text{ MeV}$:',
        options: [
          'A. $^4\\text{He} < ^{235}\\text{U} < ^{56}\\text{Fe}$',
          'B. $^{56}\\text{Fe} < ^{235}\\text{U} < ^4\\text{He}$',
          'C. $^4\\text{He} < ^{56}\\text{Fe} < ^{235}\\text{U}$',
          'D. $^{235}\\text{U} < ^4\\text{He} < ^{56}\\text{Fe}$'
        ],
        correctIndex: 0,
        explanation: 'Hạt nhân nào có năng lượng liên kết riêng càng lớn thì càng bền vững.'
      }
    ],
    essayExercises: [
      {
        source: 'Chuẩn Vật lí 12 · Nhiệt hạch & Sản lượng điện',
        question:
          'Mỗi phản ứng D–T tỏa năng lượng $\\Delta E = 17{,}6\\text{ MeV}$. Nếu dùng $1\\text{ gam}$ hỗn hợp Deuteri–Triti tham gia phản ứng hoàn toàn (xem khối lượng mol trung bình cặp phản ứng là $5\\text{ g/mol}$, $N_A = 6{,}02\\cdot 10^{23}\\text{ mol}^{-1}$, $1\\text{ MeV} = 1{,}6\\cdot 10^{-13}\\text{ J}$), hãy tính tổng năng lượng tỏa ra theo đơn vị kWh ($1\\text{ kWh} = 3{,}6\\cdot 10^6\\text{ J}$).',
        hints: ['Số phản ứng xảy ra từ $1\\text{ g}$ nhiên liệu (gồm $\\frac{1}{5}\\text{ mol}$ cặp D+T) là $N = 0{,}2 \\cdot N_A$.'],
        solutionSteps: [
          'Bước 1: Số cặp phản ứng D–T trong $1\\text{ g}$ ($2\\text{ g D} + 3\\text{ g T} = 5\\text{ g}$ cho $N_A$ phản ứng): $N = \\frac{1}{5}\\cdot 6{,}02\\cdot 10^{23} = 1{,}204\\cdot 10^{23}$ phản ứng.',
          'Bước 2: Tổng năng lượng: $E = N \\cdot 17{,}6 \\cdot 1{,}6\\cdot 10^{-13} \\approx 3{,}39\\cdot 10^{11}\\text{ J}$.',
          'Bước 3: Đổi sang kWh: $E \\approx \\frac{3{,}39\\cdot 10^{11}}{3{,}6\\cdot 10^6} \\approx 94\\,180\\text{ kWh}$!'
        ],
        finalAnswer: 'Xấp xỉ $3{,}39\\cdot 10^{11}\\text{ J} \\approx 94\\,180\\text{ kWh}$ (tương đương hàng chục tấn than).'
      }
    ]
  },
  {
    id: 'phys-ext-10',
    track: 'khong_chuyen',
    grade: 'Lớp 11',
    tier: 'Nâng cao',
    stageLabel: 'Quang Học 11 · Quang sợi & Phân cực Ánh sáng',
    sourceTag: 'Chuẩn GDPT 2018 & Quang ứng dụng · Cáp quang & Malus',
    title: 'Cáp Quang Phản xạ Toàn phần, Khẩu độ Số NA & Định luật Malus',
    subtitle: 'Điều kiện truyền dẫn không tổn hao trong sợi quang $n_1 > n_2$, góc nhận ánh sáng và cường độ qua kính phân cực',
    description:
      'Tìm hiểu công nghệ truyền dữ liệu Internet tốc độ ánh sáng qua sợi cáp quang dựa trên hiện tượng phản xạ toàn phần, khái niệm khẩu độ số $\\text{NA} = \\sqrt{n_1^2 - n_2^2}$ và định luật Malus cho ánh sáng phân cực.',
    theorySections: [
      {
        heading: '1. Cáp quang & Phản xạ toàn phần tại vách lõi–vỏ',
        content:
          '• Sợi quang gồm lõi thủy tinh chiết suất $n_1$ bao bọc bởi lớp vỏ chiết suất $n_2 < n_1$.\n• Tia sáng đi từ lõi tới mặt phân cách vỏ sẽ phản xạ toàn phần liên tiếp dọc chiều dài sợi nếu góc tới mặt vách thỏa $\\sin i \\ge \\sin i_{gh} = \\frac{n_2}{n_1}$.\n• Để tia sáng đi từ không khí ($n_0 = 1$) vào đầu sợi quang không bị lọt ra vỏ, góc tới ở đầu sợi không vượt quá góc thu $\\theta_{\\max}$ xác định bởi **khẩu độ số**: $\\text{NA} = \\sin\\theta_{\\max} = \\sqrt{n_1^2 - n_2^2}$.'
      },
      {
        heading: '2. Ánh sáng Phân cực & Định luật Malus',
        content:
          '• Khi ánh sáng tự nhiên cường độ $I_0$ đi qua kính phân cực thứ nhất (Polarizer), cường độ giảm còn $I_1 = \\frac{I_0}{2}$ và trở thành ánh sáng phân cực thẳng.\n• Khi đi tiếp qua kính phân tích thứ hai (Analyzer) có trục truyền hợp góc $\\alpha$ với trục kính thứ nhất, cường độ sáng truyền qua tuân theo **Định luật Malus**: $I_2 = I_1 \\cos^2\\alpha$.'
      }
    ],
    keyFormulas: [
      '\\sin i_{gh} = \\frac{n_2}{n_1} \\quad (n_1 > n_2)',
      '\\text{NA} = \\sin\\theta_{\\max} = \\sqrt{n_1^2 - n_2^2}',
      'I = I_1 \\cos^2\\alpha \\quad (\\text{Định luật Malus})'
    ],
    ...bindSim('fiber_optic_tir', 'fiber_optic_3d'),
    practiceExercises: [
      {
        source: 'Quang học 11 · Sợi quang học',
        question:
          'Một sợi quang có lõi chiết suất $n_1 = 1{,}50$ và vỏ chiết suất $n_2 = 1{,}44$. Giá trị khẩu độ số $\\text{NA}$ của sợi quang (giới hạn $\\sin\\theta_{\\max}$ khi nhận sáng từ không khí) bằng:',
        options: ['A. $0{,}42$', 'B. $0{,}96$', 'C. $0{,}24$', 'D. $0{,}60$'],
        correctIndex: 0,
        explanation:
          'Áp dụng $\\text{NA} = \\sqrt{n_1^2 - n_2^2} = \\sqrt{1{,}50^2 - 1{,}44^2} = \\sqrt{2{,}25 - 2{,}0736} = \\sqrt{0{,}1764} = 0{,}42$.'
      },
      {
        source: 'Quang sóng · Định luật Malus',
        question: 'Chiếu ánh sáng phân cực thẳng cường độ $I_1 = 40\\text{ W/m}^2$ qua kính phân tích có trục truyền hợp với phương phân cực góc $\\alpha = 60^\\circ$. Cường độ sáng ló ra là:',
        options: ['A. $10\\text{ W/m}^2$', 'B. $20\\text{ W/m}^2$', 'C. $30\\text{ W/m}^2$', 'D. $5\\text{ W/m}^2$'],
        correctIndex: 0,
        explanation: 'Theo định luật Malus: $I = I_1 \\cos^2 60^\\circ = 40 \\cdot (0{,}5)^2 = 10\\text{ W/m}^2$.'
      }
    ],
    essayExercises: [
      {
        source: 'Tự luận Quang Hình · Giới hạn Cáp quang',
        question:
          'Một sợi quang lõi chiết suất $n_1 = 1{,}5$, vỏ bọc chiết suất $n_2 = 1{,}2$ đặt trong không khí. Tính góc giới hạn phản xạ toàn phần $i_{gh}$ tại vách lõi–vỏ và góc nhận sáng cực đại $\\theta_{\\max}$ ở mặt cắt đầu sợi.',
        hints: ['Dùng $\\sin i_{gh} = \\frac{n_2}{n_1}$ và $\\sin\\theta_{\\max} = \\sqrt{n_1^2 - n_2^2}$.'],
        solutionSteps: [
          'Bước 1: Góc giới hạn tại mặt phân cách lõi–vỏ: $\\sin i_{gh} = \\frac{n_2}{n_1} = \\frac{1{,}2}{1{,}5} = 0{,}8 \\implies i_{gh} \\approx 53{,}13^\\circ$.',
          'Bước 2: Khi tia vào đầu sợi với góc tới $\\theta$, góc khúc xạ trong lõi là $r$, góc tới mặt vách là $i = 90^\\circ - r \\ge i_{gh} \\iff \\cos r \\ge \\sin i_{gh}$. Do đó $\\sin r \\le \\sqrt{1 - (n_2/n_1)^2} \\implies \\sin\\theta = n_1\\sin r \\le \\sqrt{n_1^2 - n_2^2} = \\sqrt{1{,}5^2 - 1{,}2^2} = 0{,}9 \\implies \\theta_{\\max} \\approx 64{,}16^\\circ$.'
        ],
        finalAnswer: '$i_{gh} \\approx 53{,}13^\\circ$; góc nhận sáng cực đại $\\theta_{\\max} \\approx 64{,}16^\\circ$.'
      }
    ]
  }
];
