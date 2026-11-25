import {
  LectureConceptEntry,
  LectureStep,
  LectureSymbolAnnotation
} from '../types';

export interface LectureEnrichmentContext {
  subject: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs';
  lessonTitle: string;
  grade?: string;
  keyFormulas?: string[];
  theoryTexts?: string[];
}

interface DomainKnowledgeRule {
  keywords: RegExp;
  concepts: LectureConceptEntry[];
  annotations: LectureSymbolAnnotation[];
  stepNotes?: string[];
}

// ============================================================================
// DOMAIN-ACCURATE CONCEPT & SYMBOL ANNOTATION RULES (PHYSICS, MATH, CS)
// ============================================================================

const PHYSICS_DOMAIN_RULES: DomainKnowledgeRule[] = [
  {
    keywords: /dao động điều hòa|con lắc lò xo|con lắc đơn|tổng hợp dao động|tắt dần|cộng hưởng/i,
    concepts: [
      {
        term: 'Li độ (x)',
        symbol: 'x = A\\cos(\\omega t + \\varphi)',
        definition: 'Độ lệch có hướng của vật so với vị trí cân bằng tại thời điểm $t$.',
        intuition: 'Giống vị trí quả lắc lệch sang phải ($x > 0$) hay sang trái ($x < 0$) tính từ tâm đứng yên.'
      },
      {
        term: 'Tần số góc, Chu kì & Tần số',
        symbol: '\\omega = \\frac{2\\pi}{T} = 2\\pi f',
        definition: 'Chu kì $T$ là thời gian thực hiện đúng $1$ dao động toàn phần; tần số $f$ là số dao động trong $1\\text{ giây}$.',
        intuition: '$T$ càng nhỏ thì vật rung càng nhanh; $\\omega$ đo tốc độ quay của vector pha trên vòng tròn lượng giác.'
      },
      {
        term: 'Pha ban đầu (φ) & Pha dao động (ωt + φ)',
        symbol: '\\Phi(t) = \\omega t + \\varphi',
        definition: 'Pha dao động cho biết đồng thời vị trí và chiều chuyển động của vật tại thời điểm xét.',
        intuition: '$\\varphi > 0$ nghĩa là vật đi theo chiều âm; $\\varphi < 0$ nghĩa là vật đi theo chiều dương lúc $t = 0$.'
      }
    ],
    annotations: [
      { symbol: 'x', meaning: 'Li độ tại thời điểm $t$', unitOrType: 'm hoặc cm', condition: '$-A \\le x \\le A$' },
      { symbol: 'A', meaning: 'Biên độ dao động (độ lệch cực đại)', unitOrType: 'm hoặc cm', condition: '$A > 0$' },
      { symbol: '\\omega', meaning: 'Tần số góc của dao động', unitOrType: 'rad/s', condition: '$\\omega > 0$' },
      { symbol: 'v', meaning: 'Vận tốc tức thời ($v = x\'(t)$)', unitOrType: 'm/s hoặc cm/s', condition: '$|v| \\le \\omega A$' },
      { symbol: 'a', meaning: 'Gia tốc tức thời ($a = -\\omega^2 x$)', unitOrType: 'm/s²', condition: 'Luôn hướng về VTCB' },
      { symbol: 'k, m', meaning: 'Độ cứng lò xo & khối lượng vật nặng', unitOrType: 'N/m và kg', condition: '$k > 0, m > 0$' }
    ],
    stepNotes: [
      'Bước 1: Đọc đề xem đề cho $x, v$ hay $a$ tại $t=0$ để xác định chiều chuyển động (dấu của $\\varphi$).',
      'Bước 2: Quy đổi đồng bộ đơn vị ($A$ và $v$ cùng dùng cm hoặc cùng dùng m).',
      'Bước 3: Dùng hệ thức độc lập $A^2 = x^2 + \\frac{v^2}{\\omega^2}$ khi đề không nhắc tới thời gian $t$.'
    ]
  },
  {
    keywords: /sóng cơ|giao thoa sóng|sóng dừng|sóng âm|ánh sáng|nhiễu xạ|giao thoa.*y-âng|y-ang|young/i,
    concepts: [
      {
        term: 'Bước sóng (λ)',
        symbol: '\\lambda = v \\cdot T = \\frac{v}{f}',
        definition: 'Quãng đường sóng truyền đi trong một chu kì dao động (hoặc khoảng cách ngắn nhất giữa hai điểm cùng pha trên một phương truyền sóng).',
        intuition: 'Nhìn trên mặt nước: $\\lambda$ chính là khoảng cách từ đỉnh gợn sóng này tới đỉnh gợn sóng liền kề.'
      },
      {
        term: 'Cực đại & Cực tiểu giao thoa',
        symbol: 'd_2 - d_1 = k\\lambda',
        definition: 'Vị trí hai sóng kết hợp gặp nhau tăng cường lẫn nhau (cùng pha) tạo biên độ cực đại, hoặc triệt tiêu nhau (ngược pha).',
        intuition: 'Hai người đẩy xích đu cùng nhịp sẽ đẩy biên độ lên cực đại; đẩy lệch nửa nhịp sẽ triệt tiêu.'
      },
      {
        term: 'Khoảng vân giao thoa ánh sáng (i)',
        symbol: 'i = \\frac{\\lambda D}{a}',
        definition: 'Khoảng cách giữa hai vân sáng (hoặc hai vân tối) liên tiếp nằm cạnh nhau trên màn quan sát.',
        intuition: 'Khi màn càng xa ($D$ tăng) hoặc hai khe càng sát nhau ($a$ giảm), các vạch sáng dãn rộng ra.'
      }
    ],
    annotations: [
      { symbol: '\\lambda', meaning: 'Bước sóng', unitOrType: 'm (hoặc μm, nm)', condition: '$\\lambda > 0$' },
      { symbol: 'v', meaning: 'Tốc độ truyền sóng trong môi trường', unitOrType: 'm/s', condition: 'Phụ thuộc bản chất môi trường' },
      { symbol: 'k', meaning: 'Bậc giao thoa / số bó sóng nguyên', unitOrType: 'Số nguyên $\\mathbb{Z}$', condition: '$k = 0, \\pm 1, \\pm 2, \\dots$' },
      { symbol: 'a, D', meaning: 'Khoảng cách 2 khe ($a$) và khe đến màn ($D$)', unitOrType: 'mm ($a$) và m ($D$)', condition: '$a \\ll D$' }
    ]
  },
  {
    keywords: /điện tích|điện trường|tụ điện|dòng điện|định luật ôm|ohm|công suất điện|điện trở|điện xoay chiều|cảm ứng điện từ|từ trường|lorentz/i,
    concepts: [
      {
        term: 'Cường độ điện trường (E) & Hiệu điện thế (U)',
        symbol: 'E = \\frac{F}{|q|}, \\quad U = E \\cdot d',
        definition: '$E$ đặc trưng cho độ mạnh của lực điện tác dụng lên $1\\text{ C}$ điện tích; $U$ đặc trưng cho công làm dịch chuyển điện tích giữa hai điểm.',
        intuition: 'Hiệu điện thế $U$ giống độ chênh lệch độ cao làm nước chảy, còn cường độ dòng $I$ giống lưu lượng dòng nước.'
      },
      {
        term: 'Định luật Ohm & Điện trở (R)',
        symbol: 'I = \\frac{U}{R}',
        definition: 'Cường độ dòng điện tỉ lệ thuận với hiệu điện thế hai đầu đoạn mạch và tỉ lệ nghịch với độ cản trở của vật dẫn.',
        intuition: 'Ống nước càng hẹp ($R$ lớn) thì cùng một áp suất bơm ($U$), lượng nước chảy qua ($I$) càng ít.'
      },
      {
        term: 'Từ thông (Φ) & Suất điện động cảm ứng',
        symbol: '\\Phi = B S \\cos\\alpha, \\quad e_c = -\\frac{\\Delta \\Phi}{\\Delta t}',
        definition: 'Từ thông đo số đường sức từ xuyên qua diện tích $S$; hễ từ thông biến thiên theo thời gian sẽ sinh ra dòng điện cảm ứng chống lại sự biến thiên đó (Định luật Lenz).',
        intuition: 'Đưa nam châm lại gần cuộn dây giống việc bạn ấn vào lò xo: mạch sinh từ trường đẩy lại.'
      }
    ],
    annotations: [
      { symbol: 'q', meaning: 'Điện tích điểm', unitOrType: 'C (Coulomb)', condition: 'Có thể âm hoặc dương' },
      { symbol: 'U, \\mathcal{E}', meaning: 'Hiệu điện thế & Suất điện động nguồn', unitOrType: 'V (Volt)', condition: '$U = \\mathcal{E} - I r$' },
      { symbol: 'I', meaning: 'Cường độ dòng điện', unitOrType: 'A (Ampere)', condition: '$I \\ge 0$' },
      { symbol: 'R, r', meaning: 'Điện trở mạch ngoài và điện trở trong nguồn', unitOrType: '$\\Omega$ (Ohm)', condition: '$R > 0$' },
      { symbol: 'B, \\Phi', meaning: 'Cảm ứng từ & Từ thông qua khung dây', unitOrType: 'Tesla (T) và Weber (Wb)', condition: '$\\alpha = (\\vec{n}, \\vec{B})$' }
    ]
  },
  {
    keywords: /động học|chuyển động|rơi tự do|ném|lực|niu-tơn|newton|ma sát|động lượng|công|cơ năng|bảo toàn/i,
    concepts: [
      {
        term: 'Vận tốc tức thời & Gia tốc (a)',
        symbol: 'a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}',
        definition: 'Gia tốc đo tốc độ thay đổi vận tốc trong mỗi giây. Khi $\\vec{a}$ cùng chiều $\\vec{v}$ vật nhanh dần; ngược chiều vật chậm dần.',
        intuition: 'Nhấn ga xe tăng $5\\text{ m/s}$ mỗi giây nghĩa là gia tốc $a = +5\\text{ m/s}^2$.'
      },
      {
        term: 'Định luật II Newton',
        symbol: '\\vec{F}_{\\text{hl}} = m\\vec{a}',
        definition: 'Hợp lực tác dụng lên vật gây ra gia tốc cùng hướng với hợp lực, độ lớn tỉ lệ thuận với lực và tỉ lệ nghịch với khối lượng.',
        intuition: 'Xe tải nặng ($m$ lớn) cần lực đẩy rất mạnh mới đạt cùng gia tốc với xe đạp.'
      },
      {
        term: 'Động lượng (p) & Cơ năng (W)',
        symbol: '\\vec{p} = m\\vec{v}, \\quad W = W_{\\text{đ}} + W_t',
        definition: 'Động lượng bảo toàn khi hệ cô lập (va chạm, nổ); cơ năng bảo toàn khi chỉ có lực thế (trọng lực, lực đàn hồi) sinh công.',
        intuition: 'Khi có ma sát trượt, cơ năng giảm đúng bằng công của lực ma sát chuyển thành nhiệt.'
      }
    ],
    annotations: [
      { symbol: 'v_0, v', meaning: 'Vận tốc ban đầu và vận tốc tại thời điểm $t$', unitOrType: 'm/s', condition: 'Đổi $\\text{km/h} \\div 3{,}6 \\to \\text{m/s}$' },
      { symbol: 'm', meaning: 'Khối lượng quán tính của vật', unitOrType: 'kg', condition: '$m > 0$' },
      { symbol: 'g', meaning: 'Gia tốc rơi tự do', unitOrType: 'm/s²', condition: 'Thường lấy $9{,}8$ hoặc $10\\text{ m/s}^2$' },
      { symbol: '\\mu', meaning: 'Hệ số ma sát trượt giữa hai bề mặt', unitOrType: 'Không đơn vị', condition: '$0 < \\mu < 1$' }
    ]
  },
  {
    keywords: /nhiệt|khí lí tưởng|bôilơ|boyle|sác-lơ|charles|claperon|nội năng|nhiệt lượng|nguyên lí i/i,
    concepts: [
      {
        term: 'Nhiệt độ tuyệt đối Kelvin (T)',
        symbol: 'T(\\text{K}) = t(^\\circ\\text{C}) + 273',
        definition: 'Thang đo nhiệt độ bắt đầu từ độ không tuyệt đối ($0\\text{ K}$), tỉ lệ thuận trực tiếp với động năng trung bình của phân tử khí.',
        intuition: 'Mọi công thức chất khí ($pV/T = \\text{const}$) BẮT BUỘC dùng Kelvin $T$, không được thay độ C.'
      },
      {
        term: 'Phương trình trạng thái Khí lí tưởng',
        symbol: 'p V = n R T',
        definition: 'Liên hệ đồng thời áp suất $p$, thể tích $V$ và nhiệt độ tuyệt đối $T$ của $n$ mol khí lí tưởng.',
        intuition: 'Nén xilanh nhỏ lại ($V$ giảm) ở nhiệt độ không đổi thì áp suất trong ống tăng vọt.'
      },
      {
        term: 'Nguyên lí I Nhiệt động lực học',
        symbol: '\\Delta U = A + Q',
        definition: 'Độ biến thiên nội năng của hệ bằng tổng công $A$ và nhiệt lượng $Q$ mà hệ nhận được.',
        intuition: 'Quy ước dấu: Hệ nhận nhiệt/nhận công mang dấu $+$; tỏa nhiệt/sinh công mang dấu $-$.'
      }
    ],
    annotations: [
      { symbol: 'p', meaning: 'Áp suất khối khí', unitOrType: 'Pa (N/m²) hoặc atm', condition: '$1\\text{ atm} \\approx 1{,}013\\cdot 10^5\\text{ Pa}$' },
      { symbol: 'V', meaning: 'Thể tích khối khí', unitOrType: 'm³ hoặc lít', condition: '$1\\text{ m}^3 = 1000\\text{ lít}$' },
      { symbol: 'T', meaning: 'Nhiệt độ tuyệt đối', unitOrType: 'Kelvin (K)', condition: '$T = t(^\\circ\\text{C}) + 273 > 0$' },
      { symbol: 'R', meaning: 'Hằng số khí lí tưởng', unitOrType: '$8{,}31\\text{ J/(mol}\\cdot\\text{K)}$', condition: 'Dùng chuẩn SI khi $p(\\text{Pa}), V(\\text{m}^3)$' }
    ]
  },
  {
    keywords: /quang|khúc xạ|phản xạ|thấu kính|gương|lăng kính|lượng tử|quang điện|bohr|hạt nhân|phóng xạ|liên kết hạt nhân/i,
    concepts: [
      {
        term: 'Chiết suất (n) & Định luật Khúc xạ',
        symbol: 'n_1 \\sin i = n_2 \\sin r',
        definition: 'Chiết suất đo độ làm chậm ánh sáng của môi trường; tia sáng đi vào môi trường chiết quang hơn ($n_2 > n_1$) sẽ gập gần pháp tuyến hơn.',
        intuition: 'Chiếc đũa cắm xiên vào cốc nước trông như bị gãy vì ánh sáng bị bẻ cong khi qua mặt nước.'
      },
      {
        term: 'Tiêu cự thấu kính (f) & Độ tụ (D)',
        symbol: '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
        definition: 'Thấu kính hội tụ có $f > 0$ (gom sáng), thấu kính phân kì có $f < 0$ (tỏa sáng); ảnh thật $d\' > 0$, ảnh ảo $d\' < 0$.',
        intuition: 'Số phóng đại $k = -\\frac{d\'}{d}$ âm là ảnh ngược chiều vật, dương là ảnh cùng chiều vật.'
      },
      {
        term: 'Độ hụt khối & Phóng xạ hạt nhân',
        symbol: '\\Delta E = \\Delta m \\cdot c^2, \\quad N(t) = N_0 2^{-t/T}',
        definition: 'Sau mỗi chu kì bán rã $T$, đúng một nửa số hạt nhân phóng xạ ban đầu bị phân rã thành hạt nhân khác.',
        intuition: 'Lượng chất còn lại giảm theo cấp số nhân: sau $1T$ còn $50\\%$, sau $2T$ còn $25\\%$, sau $3T$ còn $12{,}5\\%$.'
      }
    ],
    annotations: [
      { symbol: 'n_1, n_2', meaning: 'Chiết suất môi trường tới và môi trường khúc xạ', unitOrType: 'Không đơn vị', condition: '$n \\ge 1$' },
      { symbol: 'd, d\'', meaning: 'Khoảng cách từ vật và ảnh đến thấu kính', unitOrType: 'cm hoặc m', condition: '$d > 0$; $d\' > 0$ ảnh thật, $d\' < 0$ ảnh ảo' },
      { symbol: 'f', meaning: 'Tiêu cự thấu kính', unitOrType: 'cm hoặc m', condition: 'Hội tụ $f > 0$, Phân kì $f < 0$' },
      { symbol: 'T_{1/2}', meaning: 'Chu kì bán rã của chất phóng xạ', unitOrType: 's, ngày hoặc năm', condition: 'Không phụ thuộc nhiệt độ/áp suất ngoài' }
    ]
  }
];

const MATH_DOMAIN_RULES: DomainKnowledgeRule[] = [
  {
    keywords: /đạo hàm|cực trị|đơn điệu|tiệm cận|tiếp tuyến|khảo sát hàm số|biện luận.*hàm/i,
    concepts: [
      {
        term: 'Ý nghĩa hình học của Đạo hàm f\'(x₀)',
        symbol: 'k = f\'(x_0)',
        definition: 'Đạo hàm tại điểm $x_0$ chính là hệ số góc của tiếp tuyến đồ thị tại điểm đó, đo tốc độ tăng/giảm tức thời của hàm số.',
        intuition: '$f\'(x) > 0$ đồ thị đang leo dốc đi lên; $f\'(x) < 0$ đồ thị đang xuống dốc.'
      },
      {
        term: 'Điểm cực trị (Cực đại / Cực tiểu)',
        symbol: 'f\'(x) \\text{ đổi dấu qua } x_0',
        definition: 'Hàm số đạt cực trị tại $x_0$ nếu liên tục tại $x_0$ và đạo hàm $f\'(x)$ đổi dấu khi $x$ đi qua $x_0$ (đổi từ $+$ sang $-$ là cực đại).',
        intuition: 'Chỉ giải $f\'(x_0) = 0$ là CHƯA đủ — ví dụ $y = x^3$ có $y\'(0) = 0$ nhưng không đổi dấu nên không có cực trị.'
      },
      {
        term: 'Đường tiệm cận đứng & tiệm cận ngang',
        symbol: '\\lim_{x \\to x_0^\\pm} y = \\pm\\infty, \\quad \\lim_{x \\to \\pm\\infty} y = y_0',
        definition: 'Đường thẳng mà đồ thị tiến sát lại gần vô hạn nhưng không chạm tới (hoặc cắt tại điểm hữu hạn với TCN).',
        intuition: 'Tiệm cận đứng thường đến từ nghiệm của mẫu số mà tử số không bị triệt tiêu.'
      }
    ],
    annotations: [
      { symbol: 'D', meaning: 'Tập xác định của hàm số', unitOrType: 'Tập hợp số thực', condition: 'Xét đầu tiên trước khi tính $y\'$' },
      { symbol: 'f\'(x)', meaning: 'Đạo hàm cấp 1 theo biến $x$', unitOrType: 'Hàm số', condition: 'Quyết định tính đồng biến/nghịch biến' },
      { symbol: 'x_{\\text{CĐ}}, x_{\\text{CT}}', meaning: 'Hoành độ điểm cực đại, cực tiểu của hàm số', unitOrType: 'Giá trị $x \\in D$', condition: 'Phân biệt với *giá trị cực trị* $y_{\\text{CĐ}}$' },
      { symbol: 'm', meaning: 'Tham số thực cần biện luận', unitOrType: '$m \\in \\mathbb{R}$', condition: 'Cô lập $m$ hoặc xét hệ số bậc cao $= 0$' }
    ],
    stepNotes: [
      'Bước 1: Tìm tập xác định $D$ của hàm số (chú ý mẫu $\\ne 0$, trong căn $\\ge 0$, trong logarit $> 0$).',
      'Bước 2: Tính $y\'$ và giải $y\' = 0$ cùng các điểm mà $y\'$ không xác định.',
      'Bước 3: Lập bảng biến thiên xét dấu $y\'$ — tuyệt đối không bỏ qua điểm không xác định!'
    ]
  },
  {
    keywords: /nguyên hàm|tích phân|diện tích hình phẳng|thể tích vật thể/i,
    concepts: [
      {
        term: 'Nguyên hàm F(x)',
        symbol: 'F\'(x) = f(x)',
        definition: '$F(x)$ là một nguyên hàm của $f(x)$ trên $K$ nếu đạo hàm của $F(x)$ bằng đúng $f(x)$; mọi nguyên hàm sai khác nhau một hằng số $+C$.',
        intuition: 'Nguyên hàm là phép toán ngược của đạo hàm: biết vận tốc $v(t)$, tìm lại quãng đường $s(t)$.'
      },
      {
        term: 'Tích phân xác định & Diện tích',
        symbol: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
        definition: 'Đo độ biến thiên tổng cộng của $F$ trên đoạn $[a; b]$, hoặc diện tích đại số hình phẳng giới hạn bởi đường cong $y = f(x)$ và trục $Ox$.',
        intuition: 'Khi tính diện tích hình phẳng luôn nhớ bọc dấu giá trị tuyệt đối $\\int_a^b |f(x)-g(x)|\\,dx$!'
      }
    ],
    annotations: [
      { symbol: 'a, b', meaning: 'Cận dưới và cận trên của tích phân', unitOrType: 'Số thực', condition: 'Đổi biến $u = u(x)$ phải đổi lại cận tương ứng' },
      { symbol: 'C', meaning: 'Hằng số tích phân bất kỳ', unitOrType: '$C \\in \\mathbb{R}$', condition: 'Tìm $C$ dựa vào điều kiện $F(x_0) = y_0$' },
      { symbol: 'dx, du', meaning: 'Vi phân theo biến đang lấy tích phân', unitOrType: 'Ký hiệu vi phân', condition: '$du = u\'(x)\\,dx$' }
    ]
  },
  {
    keywords: /oxyz|vectơ|mặt phẳng|đường thẳng.*không gian|mặt cầu|hình học không gian|thể tích.*chóp|lăng trụ|khoảng cách/i,
    concepts: [
      {
        term: 'Vectơ pháp tuyến (VTPT) & Chỉ phương (VTCP)',
        symbol: '\\vec{n} \\perp (P), \\quad \\vec{u} \\parallel d',
        definition: 'Vectơ pháp tuyến $\\vec{n} \\ne \\vec{0}$ vuông góc với mọi đường thẳng nằm trong mặt phẳng $(P)$; vectơ chỉ phương $\\vec{u} \\ne \\vec{0}$ nằm song song hoặc trùng với đường thẳng $d$.',
        intuition: 'Tích có hướng $[\\vec{a}, \\vec{b}]$ tạo ra một vectơ mới vuông góc với cả hai vectơ $\\vec{a}$ và $\\vec{b}$.'
      },
      {
        term: 'Khoảng cách & Góc trong Không gian',
        symbol: 'd(M, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2+B^2+C^2}}',
        definition: 'Khoảng cách là độ dài đoạn vuông góc ngắn nhất hạ từ điểm tới mặt phẳng (hoặc đường vuông góc chung giữa hai đường chéo nhau).',
        intuition: 'Góc giữa đường $d$ và mặt $(P)$ dùng $\\sin\\varphi = |\\cos(\\vec{u}, \\vec{n})|$ (đổi $\\cos$ sang $\\sin$!).'
      }
    ],
    annotations: [
      { symbol: '\\vec{n} = (A; B; C)', meaning: 'Vectơ pháp tuyến của mặt phẳng $Ax+By+Cz+D=0$', unitOrType: 'Bộ 3 tọa độ', condition: '$A^2 + B^2 + C^2 > 0$' },
      { symbol: '\\vec{u} = (a; b; c)', meaning: 'Vectơ chỉ phương của đường thẳng', unitOrType: 'Bộ 3 tọa độ', condition: '$a^2 + b^2 + c^2 > 0$' },
      { symbol: '[\\vec{a}, \\vec{b}]', meaning: 'Tích có hướng hai vectơ', unitOrType: 'Vectơ 3D', condition: 'Bằng $\\vec{0}$ khi hai vectơ cùng phương' },
      { symbol: 'R, I', meaning: 'Bán kính và tâm mặt cầu', unitOrType: 'Đơn vị độ dài', condition: '$R = \\sqrt{a^2+b^2+c^2-d} > 0$' }
    ]
  },
  {
    keywords: /lượng giác|sin|cos|tan|tam thức bậc hai|phương trình bậc hai|vi-ét|viet|căn bậc hai|hàm số bậc nhất|đường tròn|góc nội tiếp|hệ thức lượng/i,
    concepts: [
      {
        term: 'Định lí Vi-ét & Điều kiện có nghiệm',
        symbol: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}',
        definition: 'Liên hệ tổng và tích hai nghiệm với các hệ số mà không cần tìm giá trị từng nghiệm cụ thể.',
        intuition: 'Luôn kiểm tra $\\Delta = b^2 - 4ac \\ge 0$ (và $a \\ne 0$) trước khi dùng công thức Vi-ét!'
      },
      {
        term: 'Tỉ số lượng giác & Đường tròn lượng giác',
        symbol: '\\sin^2\\alpha + \\cos^2\\alpha = 1',
        definition: 'Giá trị $\\cos\\alpha$ là hoành độ (trục $Ox$) và $\\sin\\alpha$ là tung độ (trục $Oy$) của điểm biểu diễn cung $\\alpha$ trên đường tròn bán kính $1$.',
        intuition: 'Nhớ mẹo "Cos đối – Sin bù – Phụ chéo – Hơn kém $\\pi$ tan, cot".'
      }
    ],
    annotations: [
      { symbol: '\\Delta', meaning: 'Biệt thức của phương trình bậc hai $ax^2+bx+c=0$', unitOrType: 'Số thực', condition: '$a \\ne 0$; $\\Delta \\ge 0$ mới có nghiệm thực' },
      { symbol: 'S, P', meaning: 'Tổng $x_1+x_2$ và tích $x_1 x_2$ theo Vi-ét', unitOrType: 'Biểu thức tham số', condition: 'Thử nghiệm lại với điều kiện $\\Delta \\ge 0$' },
      { symbol: 'R, d', meaning: 'Bán kính đường tròn và khoảng cách từ tâm đến đường thẳng', unitOrType: 'Đơn vị độ dài', condition: 'Tiếp xúc khi $d = R$' }
    ]
  },
  {
    keywords: /logarit|mũ|cấp số|tổ hợp|xác suất|nhị thức|bất đẳng thức|cauchy|cô-si|bunhiacopxki|số phức/i,
    concepts: [
      {
        term: 'Điều kiện tồn tại Logarit & Lũy thừa',
        symbol: '\\log_a b \\iff a^c = b',
        definition: 'Logarit cơ số $a$ của $b$ là số mũ $c$ cần nâng lên cho cơ số $a$ để thu được $b$. Chỉ tồn tại khi $0 < a \\ne 1$ và $b > 0$.',
        intuition: 'Khi cơ số $0 < a < 1$, giải bất phương trình nhớ ĐỔI CHIỀU bất đẳng thức!'
      },
      {
        term: 'Biến cố, Không gian mẫu & Xác suất',
        symbol: 'P(A) = \\frac{n(A)}{n(\\Omega)}',
        definition: 'Xác suất đo khả năng xảy ra biến cố $A$ trên tổng số kết quả đồng khả năng $n(\\Omega)$, luôn nằm trong đoạn $[0; 1]$.',
        intuition: 'Khi bài toán có từ "ít nhất 1", dùng biến cố đối $P(A) = 1 - P(\\overline{A})$ thường nhanh gấp nhiều lần.'
      }
    ],
    annotations: [
      { symbol: 'n(\\Omega)', meaning: 'Số phần tử của không gian mẫu', unitOrType: 'Số nguyên dương', condition: 'Đếm không trùng, không sót' },
      { symbol: 'A_n^k, C_n^k', meaning: 'Chỉnh hợp (có thứ tự) và Tổ hợp (không thứ tự)', unitOrType: 'Số tự nhiên', condition: '$0 \\le k \\le n$' },
      { symbol: 'a, b', meaning: 'Cơ số ($a$) và biểu thức dưới dấu logarit ($b$)', unitOrType: 'Số thực', condition: '$0 < a \\ne 1, \\; b > 0$' }
    ]
  }
];

const CS_DOMAIN_RULES: DomainKnowledgeRule[] = [
  {
    keywords: /kiểu dữ liệu|nhập xuất|biến|số nguyên|nguyên tố|sàng|eratosthenes|euclid|lũy thừa nhị phân|modulo/i,
    concepts: [
      {
        term: 'Tràn số nguyên (Integer Overflow)',
        symbol: 'int \\le 2\\cdot 10^9 < long\\ long \\le 9\\cdot 10^{18}',
        definition: 'Kiểu số nguyên 32-bit `int` bị tràn và quay vòng thành số rác nếu kết quả phép nhân hoặc tổng vượt quá $2^{31}-1$.',
        intuition: 'Viết `1LL * a * b` để ép phép tính lên 64-bit ngay lúc nhân, tránh tràn trước khi gán.'
      },
      {
        term: 'Đồng dư thức (Modulo Arithmetic)',
        symbol: '(a \\cdot b) \\bmod M = ((a \\bmod M) \\cdot (b \\bmod M)) \\bmod M',
        definition: 'Phép cộng, trừ, nhân có thể lấy dư ở từng bước trung gian; riêng phép trừ nhớ cộng thêm $M$ trước khi `% M` để tránh số âm.',
        intuition: 'Trong C++, `(-3) % 5` ra `-3`, nên luôn viết `((a - b) % M + M) % M`.'
      }
    ],
    annotations: [
      { symbol: 'N', meaning: 'Kích thước dữ liệu đầu vào', unitOrType: '`long long` / `int`', condition: '$10^8$ phép tính $\\approx 1\\text{ giây}$' },
      { symbol: '1LL', meaning: 'Hằng số ép kiểu 64-bit trong C++', unitOrType: '`long long` literal', condition: 'Dùng trước phép nhân 2 biến `int`' },
      { symbol: 'MOD', meaning: 'Số nguyên tố chia lấy dư (thường $10^9+7$)', unitOrType: '`const long long`', condition: 'Không chia trực tiếp `(a/b)%MOD`' }
    ]
  },
  {
    keywords: /mảng cộng dồn|hai con trỏ|cửa sổ|tìm kiếm nhị phân|binary search|stack|queue|deque|ngăn xếp/i,
    concepts: [
      {
        term: 'Mảng cộng dồn (Prefix Sum)',
        symbol: 'P[i] = P[i-1] + A[i], \\quad \\sum_{k=L}^R A[k] = P[R] - P[L-1]',
        definition: 'Tính trước tổng tích lũy từ đầu mảng để trả lời mọi truy vấn tổng đoạn $[L..R]$ chỉ trong đúng $1$ phép trừ $O(1)$.',
        intuition: 'Muốn biết tổng từ tầng 4 tới tầng 10, chỉ cần lấy tổng 10 tầng trừ đi tổng 3 tầng đầu!'
      },
      {
        term: 'Bất biến Tìm kiếm nhị phân (Monotonic Predicate)',
        symbol: '[F, F, \\dots, F, T, T, \\dots, T]',
        definition: 'Khi điều kiện kiểm tra chia tập kết quả thành hai nửa liên tiếp Đúng/Sai rõ rệt, ta chặt đôi khoảng tìm kiếm mỗi bước để đạt $O(\\log N)$.',
        intuition: 'Cẩn thận lỗi kẹt vòng lặp vô hạn khi `lo + 1 == hi`: dùng `mid = lo + (hi - lo) / 2`.'
      }
    ],
    annotations: [
      { symbol: 'L, R', meaning: 'Hai đầu mút đoạn hoặc hai con trỏ duyệt mảng', unitOrType: 'Chỉ số `int`', condition: 'Chú ý đánh số từ 0 hay từ 1 ($P[0] = 0$)' },
      { symbol: 'mid', meaning: 'Điểm chính giữa khoảng tìm kiếm $[lo, hi]$', unitOrType: '`long long`', condition: 'Viết `lo + (hi - lo) / 2` chống tràn' },
      { symbol: 'O(N\\log N)', meaning: 'Ngưỡng chạy an toàn với $N \\le 10^6$', unitOrType: 'Độ phức tạp thời gian', condition: 'Nhanh hơn nhiều so với $O(N^2)$' }
    ]
  },
  {
    keywords: /quy hoạch động|dp|knapsack|cái túi|dãy con|quay lui|đệ quy|đồ thị|bfs|dfs|dijkstra|cây khung|dsu|segment tree|kmp|hash/i,
    concepts: [
      {
        term: 'Trạng thái & Công thức truy hồi (DP)',
        symbol: 'dp[\\text{trạng thái}] = \\text{tối ưu}(dp[\\text{trạng thái trước}])',
        definition: 'Chia bài toán lớn thành bài toán con gối nhau, lưu kết quả từng trạng thái vào bảng `dp` để không bao giờ phải tính lại cùng một bài toán con.',
        intuition: 'Xác định 3 thứ theo đúng thứ tự: (1) Ý nghĩa mảng `dp`, (2) Bài toán cơ sở `dp[0]`, (3) Công thức chuyển trạng thái.'
      },
      {
        term: 'Danh sách kề & Độ phức tạp Đồ thị',
        symbol: 'O(V + E)',
        definition: 'Lưu đồ thị thưa bằng danh sách kề `adj[u]` để thuật toán loang BFS / đi sâu DFS đi thăm mỗi đỉnh và mỗi cạnh đúng một lần.',
        intuition: 'Đừng quên mảng `visited[u]` đánh dấu đỉnh đã đi qua để không bị lặp vô hạn nếu đồ thị có chu trình!'
      }
    ],
    annotations: [
      { symbol: 'V, E', meaning: 'Số đỉnh và số cạnh của đồ thị', unitOrType: '`int`', condition: 'Đồ thị vô hướng thêm cạnh 2 chiều `u->v, v->u`' },
      { symbol: 'INF', meaning: 'Giá trị vô cực khởi tạo cho bài toán tìm Min', unitOrType: '`1e18` (64-bit)', condition: 'Không dùng `INT_MAX` nếu cộng thêm trọng số' },
      { symbol: '4 \\cdot N', meaning: 'Kích thước an toàn cho mảng Segment Tree', unitOrType: 'Số phần tử mảng', condition: 'Luôn cấp phát `4 * MAXN` nút' }
    ]
  }
];

const CHEMISTRY_DOMAIN_RULES: DomainKnowledgeRule[] = [
  {
    keywords: /mol|nồng độ|khí|dung dịch|chuẩn độ|ph|axit|acid|bazơ|base|điện li|muối/i,
    concepts: [
      {
        term: 'Số mol & Nồng độ mol (C_M)',
        symbol: 'n = \\frac{m}{M} = \\frac{V}{24{,}79}, \\quad C_M = \\frac{n}{V_{\\text{dd}}}',
        definition: 'Mol đo lượng chất chứa $6{,}022\\cdot 10^{23}$ hạt vi mô; nồng độ mol cho biết số mol chất tan trong $1\\text{ lít}$ dung dịch.',
        intuition: 'Ở điều kiện chuẩn ($25^\\circ\\text{C}, 1\\text{ bar}$), $1\\text{ mol}$ mọi chất khí chiếm $24{,}79\\text{ lít}$ (CT 2018) hoặc $22{,}4\\text{ lít}$ ở đktc (CT 2006).'
      },
      {
        term: 'Thang đo pH & Cân bằng Acid–Base',
        symbol: '\\text{pH} = -\\log[\\text{H}^+], \\quad [\\text{H}^+][\\text{OH}^-] = 10^{-14}',
        definition: 'pH biểu thị độ acid hoặc base của dung dịch nước ở $25^\\circ\\text{C}$: $\\text{pH} < 7$ là môi trường acid, $\\text{pH} = 7$ trung tính, $\\text{pH} > 7$ là base.',
        intuition: 'Khi nồng độ $\\text{H}^+$ tăng gấp $10$ lần thì $\\text{pH}$ giảm đi $1$ đơn vị.'
      }
    ],
    annotations: [
      { symbol: 'n', meaning: 'Số mol chất', unitOrType: 'mol', condition: '$n > 0$' },
      { symbol: 'C_M', meaning: 'Nồng độ mol dung dịch', unitOrType: 'M (mol/L)', condition: '$V_{\\text{dd}}$ đổi ra lít' },
      { symbol: 'C\\%', meaning: 'Nồng độ phần trăm theo khối lượng', unitOrType: '%', condition: '$m_{\\text{dd}} = m_{\\text{ct}} + m_{\\text{dm}}$' },
      { symbol: '\\text{pH}', meaning: 'Chỉ số độ acid/base', unitOrType: 'Không đơn vị', condition: 'Ở $25^\\circ\\text{C}$: $\\text{pH}+\\text{pOH}=14$' }
    ]
  },
  {
    keywords: /nhiệt hóa|enthalpy|tốc độ phản ứng|cân bằng hóa học|le chatelier|chuyển dịch|xúc tác/i,
    concepts: [
      {
        term: 'Biến thiên Enthalpy chuẩn (Δ_rH°₂₉₈)',
        symbol: '\\Delta_r H^\\circ_{298} < 0 \\text{ (tỏa nhiệt)}, \\quad > 0 \\text{ (thu nhiệt)}',
        definition: 'Đo nhiệt lượng trao đổi của phản ứng hóa học ở điều kiện chuẩn ($1\\text{ bar}, 298\\text{ K}$).',
        intuition: 'Phản ứng tỏa nhiệt làm môi trường nóng lên ($\\Delta_r H^\\circ < 0$); phản ứng thu nhiệt hấp thụ nhiệt xung quanh ($\\Delta_r H^\\circ > 0$).'
      },
      {
        term: 'Hằng số cân bằng K_C & Nguyên lí Le Chatelier',
        symbol: 'K_C = \\frac{[C]^c[D]^d}{[A]^a[B]^b}',
        definition: '$K_C$ chỉ phụ thuộc vào nhiệt độ; hệ đang cân bằng khi bị tác động sẽ chuyển dịch theo chiều làm giảm tác động đó.',
        intuition: 'Chất rắn nguyên chất không xuất hiện trong biểu thức $K_C$.'
      }
    ],
    annotations: [
      { symbol: '\\Delta_r H^\\circ', meaning: 'Biến thiên enthalpy chuẩn phản ứng', unitOrType: 'kJ hoặc kJ/mol', condition: 'Âm: tỏa nhiệt; Dương: thu nhiệt' },
      { symbol: 'K_C', meaning: 'Hằng số cân bằng theo nồng độ', unitOrType: 'Hằng số theo T', condition: 'Không phụ thuộc nồng độ ban đầu/xúc tác' },
      { symbol: 'v', meaning: 'Tốc độ phản ứng hóa học', unitOrType: 'mol/(L·s)', condition: 'Tăng khi tăng $C, T, S$ hoặc thêm xúc tác' }
    ]
  },
  {
    keywords: /oxi hóa|khử|pin điện|điện phân|thế điện cực|kim loại|ester|este|lipit|cacbohidrat|amin|peptit|polime|hydrocacbon|ancol|andehit|axit cacboxylic/i,
    concepts: [
      {
        term: 'Thế điện cực chuẩn (E°) & Pin Galvani',
        symbol: 'E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} > 0',
        definition: 'Ở anode (cực âm) xảy ra quá trình oxi hóa; ở cathode (cực dương) xảy ra quá trình khử; quy tắc $\\alpha$ dự đoán chiều phản ứng tự diễn biến.',
        intuition: 'Pin sinh điện tự nhiên ($E^\\circ_{\\text{pin}} > 0$), còn điện phân dùng dòng điện ngoài ép phản ứng không tự xảy ra.'
      },
      {
        term: 'Bảo toàn Electron & Bảo toàn Khối lượng',
        symbol: '\\sum n_{e\\text{ cho}} = \\sum n_{e\\text{ nhận}}',
        definition: 'Tổng số mol electron chất khử nhường luôn bằng tổng số mol electron chất oxi hóa thu trong mọi phản ứng oxi hóa–khử.',
        intuition: 'Dùng bảo toàn electron + bảo toàn nguyên tố giúp giải nhanh bài hỗn hợp kim loại mà không cần viết hết mọi phương trình trung gian.'
      }
    ],
    annotations: [
      { symbol: 'E^\\circ', meaning: 'Thế điện cực chuẩn cặp oxi hóa–khử', unitOrType: 'V (Volt)', condition: 'Đo ở $25^\\circ\\text{C}, 1\\text{ M}, 1\\text{ bar}$' },
      { symbol: 'F', meaning: 'Hằng số Faraday', unitOrType: '$96\\,500\\text{ C/mol}$', condition: '$n_e = \\frac{I \\cdot t}{F}$ trong điện phân' },
      { symbol: 'k = \\frac{2C + 2 - H + N}{2}', meaning: 'Độ bất bão hòa (số vòng + liên kết $\\pi$)', unitOrType: 'Số nguyên $\\ge 0$', condition: 'Phân tử chỉ chứa C, H, O, N' }
    ]
  }
];

const BIOLOGY_DOMAIN_RULES: DomainKnowledgeRule[] = [
  {
    keywords: /tế bào|màng sinh chất|bào quan|ti thể|lục lạp|enzim|atp|quang hợp|hô hấp tế bào|nguyên phân|giảm phân/i,
    concepts: [
      {
        term: 'Chuyển hóa năng lượng ATP',
        symbol: '\\text{ATP} \\rightleftharpoons \\text{ADP} + \\text{P}_i + \\Delta G',
        definition: 'ATP là đồng tiền năng lượng trực tiếp của tế bào nhờ 2 liên kết cao năng giữa các nhóm phosphate dễ giải phóng năng lượng.',
        intuition: 'Glucose giống sổ tiết kiệm năng lượng dài hạn, còn ATP giống tiền mặt tiêu dùng ngay ở mọi phản ứng tế bào.'
      },
      {
        term: 'Nguyên phân & Giảm phân',
        symbol: '2n \\xrightarrow{\\text{NP}} 2\\times (2n); \\quad 2n \\xrightarrow{\\text{GP}} 4\\times (n)',
        definition: 'Nguyên phân giữ nguyên bộ NST $2n$ giúp cơ thể lớn lên; giảm phân tạo giao tử đơn bội $n$ và tạo biến dị tổ hợp.',
        intuition: 'Số tế bào con sau $k$ lần nguyên phân liên tiếp từ $1$ tế bào là $2^k$.'
      }
    ],
    annotations: [
      { symbol: '2n', meaning: 'Bộ NST lưỡng bội trong tế bào sinh dưỡng', unitOrType: 'Số chiếc NST', condition: 'Tồn tại thành từng cặp tương đồng' },
      { symbol: 'n', meaning: 'Bộ NST đơn bội trong giao tử', unitOrType: 'Số chiếc NST', condition: 'Kết hợp thụ tinh khôi phục $2n$' },
      { symbol: '\\text{ATP}', meaning: 'Adenosine triphosphate', unitOrType: 'Phân tử cao năng', condition: '$1\\text{ mol}$ ATP thủy phân $\\approx 30{,}5\\text{ kJ}$' }
    ]
  },
  {
    keywords: /adn|dna|arn|rna|gen|phiên mã|dịch mã|mã di truyền|đột biến|operon/i,
    concepts: [
      {
        term: 'Cấu trúc xoắn kép DNA & Chiều dài phân tử',
        symbol: 'N = 2A + 2G, \\quad L = \\frac{N}{2} \\cdot 3{,}4\\text{ \\AA}',
        definition: 'Hai mạch DNA bổ sung nhau theo nguyên tắc A liên kết T (2 liên kết H), G liên kết C/X (3 liên kết H); mỗi chu kì xoắn dài $34\\text{ \\AA}$ gồm $10$ cặp nuclêôtit.',
        intuition: 'Biết số nuclêôtit $N$ suy ra ngay chiều dài $L$, khối lượng $M = N \\cdot 300\\text{ đvC}$ và số liên kết hiđrô $H = 2A + 3G$.'
      },
      {
        term: 'Phiên mã (DNA → mRNA) & Dịch mã (mRNA → Chuỗi pôlipeptit)',
        symbol: '1\\text{ codon} = 3\\text{ ribônuclêôtit} \\to 1\\text{ aa}',
        definition: 'Thông tin di truyền từ mạch khuôn $3\'\\to 5\'$ của gen được phiên mã thành mRNA ($5\'\\to 3\'$), sau đó ribôxôm dịch mã bộ ba thành chuỗi axit amin.',
        intuition: 'Trong $64$ bộ ba có $3$ bộ ba kết thúc (UAA, UAG, UGA) không mã hóa axit amin.'
      }
    ],
    annotations: [
      { symbol: 'N', meaning: 'Tổng số nuclêôtit của đoạn gen/DNA kép', unitOrType: 'Nuclêôtit', condition: '$A = T, \\; G = C$' },
      { symbol: 'L', meaning: 'Chiều dài phân tử DNA', unitOrType: 'Å ($1\\text{ nm} = 10\\text{ \\AA}$)', condition: '$L = \\frac{N}{2} \\cdot 3{,}4\\text{ \\AA}$' },
      { symbol: 'H', meaning: 'Tổng số liên kết hiđrô giữa hai mạch', unitOrType: 'Liên kết', condition: '$H = 2A + 3G = N + G$' }
    ]
  },
  {
    keywords: /menden|menđen|phân li|hoán vị|liên kết gen|quần thể|hardy|tiến hóa|sinh thái|quần xã|hệ sinh thái|tuần hoàn|hô hấp|thần kinh|cảm ứng/i,
    concepts: [
      {
        term: 'Quy luật Menđen & Hoán vị gen',
        symbol: 'f_{\\text{hoán vị}} \\le 50\\%',
        definition: 'Phân li độc lập cho tỉ lệ giao tử bằng nhau khi các gen nằm trên các cặp NST khác nhau; hoán vị gen tạo giao tử tái tổ hợp có tổng tỉ lệ bằng tần số hoán vị $f$.',
        intuition: 'Mỗi loại giao tử hoán vị chiếm tỉ lệ $\\frac{f}{2}$, mỗi loại giao tử liên kết chiếm $\\frac{1 - f}{2}$.'
      },
      {
        term: 'Cân bằng Di truyền Quần thể (Hardy–Weinberg)',
        symbol: 'p^2 AA + 2pq Aa + q^2 aa = 1 \\quad (p + q = 1)',
        definition: 'Trong quần thể ngẫu phối lớn không chịu tác động của các nhân tố tiến hóa, tần số alen và thành phần kiểu gen duy trì không đổi qua các thế hệ.',
        intuition: 'Kiểm tra cân bằng nhanh: $\\sqrt{d_{\\text{AA}}} + \\sqrt{r_{\\text{aa}}} = 1$.'
      }
    ],
    annotations: [
      { symbol: 'p, q', meaning: 'Tần số tương đối của alen trội ($p$) và lặn ($q$)', unitOrType: 'Tỉ lệ $\\in [0; 1]$', condition: '$p + q = 1$' },
      { symbol: 'f', meaning: 'Tần số hoán vị gen', unitOrType: '% (0% < f ≤ 50%)', condition: 'Tỉ lệ thuận khoảng cách giữa 2 gen (cM)' },
      { symbol: 'k', meaning: 'Hiệu suất sinh thái chuyển bậc dinh dưỡng', unitOrType: '%', condition: 'Thường thất thoát ~90%, truyền lên ~10%' }
    ]
  }
];

function extractFormulaAnnotations(
  formula: string | undefined,
  subject: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs'
): LectureSymbolAnnotation[] {
  if (!formula) return [];
  const candidates: LectureSymbolAnnotation[] = [];
  const pushUnique = (item: LectureSymbolAnnotation) => {
    if (!candidates.some((c) => c.symbol === item.symbol)) {
      candidates.push(item);
    }
  };

  if (/\bf\b|f\(x\)|f'\(x\)/.test(formula) && subject === 'math') {
    pushUnique({
      symbol: 'f(x), x',
      meaning: 'Hàm số phụ thuộc biến số thực $x$',
      unitOrType: 'Hàm số / Biến thực',
      condition: '$x$ thuộc tập xác định $D$'
    });
  }
  if (/\\omega/.test(formula)) {
    pushUnique({
      symbol: '\\omega',
      meaning: 'Tần số góc / vận tốc góc',
      unitOrType: 'rad/s',
      condition: '$\\omega = 2\\pi f = \\frac{2\\pi}{T} > 0$'
    });
  }
  if (/\\lambda/.test(formula)) {
    pushUnique({
      symbol: '\\lambda',
      meaning: 'Bước sóng (hay giá trị riêng/tham số)',
      unitOrType: subject === 'physics' ? 'm (hoặc nm)' : 'Số thực',
      condition: '$\\lambda > 0$'
    });
  }
  if (/\\Delta/.test(formula)) {
    pushUnique({
      symbol: '\\Delta',
      meaning: subject === 'physics' ? 'Độ biến thiên (giá trị sau trừ trước)' : 'Biệt thức hoặc tam giác / độ biến thiên',
      unitOrType: subject === 'physics' ? 'Cùng đơn vị đại lượng' : 'Biểu thức đại số',
      condition: 'Xét kỹ dấu dương/âm của độ biến thiên'
    });
  }
  if (/\\vec\{/.test(formula)) {
    pushUnique({
      symbol: '\\vec{a}, \\vec{v}',
      meaning: 'Đại lượng có hướng (cả độ lớn và phương chiều)',
      unitOrType: 'Vectơ',
      condition: 'Phải chiếu lên trục tọa độ trước khi tính đại số'
    });
  }
  if (/\\int/.test(formula)) {
    pushUnique({
      symbol: '\\int_a^b',
      meaning: 'Tích phân xác định từ cận dưới $a$ đến cận trên $b$',
      unitOrType: 'Toán tử tích phân',
      condition: 'Hàm số liên tục trên đoạn lấy tích phân'
    });
  }
  if (/\\mathcal\{O\}|O\(/.test(formula)) {
    pushUnique({
      symbol: 'O(\\cdot)',
      meaning: 'Ký hiệu Big-O đánh giá tốc độ tăng số phép tính theo $N$',
      unitOrType: 'Độ phức tạp',
      condition: 'Giới hạn thực thi thường $\\le 10^8$ phép tính/giây'
    });
  }
  if (/\\Delta_r H|K_C|\\text\{pH\}|E\^\\circ/.test(formula) && subject === 'chemistry') {
    pushUnique({
      symbol: '\\Delta_r H^\\circ, K_C, \\text{pH}',
      meaning: 'Đại lượng nhiệt động, hằng số cân bằng hoặc độ acid–base của hệ hóa học',
      unitOrType: 'kJ/mol · Hằng số · pH',
      condition: 'Đo ở điều kiện chuẩn ($25^\\circ\\text{C}, 1\\text{ bar}$)'
    });
  }
  if (/3\{?,?\}4|p\^2|2pq|2A\s*\+\s*3G|ATP/i.test(formula) && subject === 'biology') {
    pushUnique({
      symbol: 'N, L, p, q',
      meaning: 'Thông số phân tử DNA / tần số alen trong quần thể sinh học',
      unitOrType: 'Nu · Å · Tỉ lệ [0..1]',
      condition: '$L = \\frac{N}{2}\\cdot 3{,}4\\text{ \\AA}$, $p + q = 1$'
    });
  }
  return candidates;
}

/**
 * Enriches every LectureStep across Math, Physics, Chemistry, Biology, and CS with structured
 * Concept Glossary cards, Symbol Annotation tables, and Step-by-step Reading Notes.
 * Preserves any hand-written entries already defined on the step.
 */
export function enrichLectureStepWithConceptsAndAnnotations(
  step: LectureStep,
  ctx: LectureEnrichmentContext,
  stepIdx: number
): LectureStep {
  const haystack = [
    ctx.lessonTitle,
    step.stepTitle,
    step.conceptSection || '',
    step.teacherExplanation || '',
    step.formulaSection?.primaryFormula || '',
    ...(ctx.keyFormulas || [])
  ]
    .join(' ')
    .toLowerCase();

  const rules =
    ctx.subject === 'physics'
      ? PHYSICS_DOMAIN_RULES
      : ctx.subject === 'math'
      ? MATH_DOMAIN_RULES
      : ctx.subject === 'chemistry'
      ? CHEMISTRY_DOMAIN_RULES
      : ctx.subject === 'biology'
      ? BIOLOGY_DOMAIN_RULES
      : CS_DOMAIN_RULES;

  const matchedRule = rules.find((r) => r.keywords.test(haystack));

  // Build Concept Glossary (max 3 crisp entries per step)
  let conceptGlossary: LectureConceptEntry[] = step.conceptGlossary || [];
  if (conceptGlossary.length === 0) {
    if (matchedRule) {
      conceptGlossary = matchedRule.concepts.slice(0, 3);
    } else {
      const cleanTitle = step.stepTitle.replace(/^\d+[\.\)]\s*/, '').trim();
      const firstSentence = (step.conceptSection || step.teacherExplanation || '')
        .split(/[\n.]+/)
        .map((s) => s.trim())
        .find((s) => s.length > 20);
      conceptGlossary = [
        {
          term: cleanTitle || ctx.lessonTitle,
          symbol: step.formulaSection?.primaryFormula || step.formulaHighlight,
          definition:
            firstSentence ||
            `Khái niệm nền tảng của bài "${ctx.lessonTitle}", giúp liên kết giả thiết bài toán với mô hình tính toán.`,
          intuition:
            step.quickIntuition ||
            step.keyTakeaway ||
            (ctx.subject === 'physics'
              ? 'Hãy liên hệ trực tiếp với thí nghiệm 2D/3D để thấy đại lượng nào là nguyên nhân, đại lượng nào là kết quả.'
              : ctx.subject === 'chemistry'
              ? 'Kiểm tra hệ số cân bằng phương trình, trạng thái chất và bảo toàn electron/nguyên tố khi tính mol.'
              : ctx.subject === 'biology'
              ? 'Liên hệ cấu trúc phân tử/tế bào với chức năng sinh lí và kiểm tra quy ước mạch khuôn $3\'\\to 5\'$ hoặc tần số alen.'
              : ctx.subject === 'math'
              ? 'Kiểm tra miền xác định và vẽ phác sơ đồ / đồ thị để nhìn bản chất hình học trước khi tính.'
              : 'Thử chạy tay trên bộ dữ liệu nhỏ $N=3..5$ để thấy giá trị từng biến thay đổi qua mỗi vòng lặp.')
        }
      ];
    }
  }

  // Build Symbol Annotations (up to 5 clean rows)
  let annotations: LectureSymbolAnnotation[] = step.annotations || [];
  if (annotations.length === 0) {
    const formulaExtracted = extractFormulaAnnotations(
      step.formulaSection?.primaryFormula || step.formulaHighlight,
      ctx.subject
    );
    const ruleAnns = matchedRule?.annotations || [];
    const combined: LectureSymbolAnnotation[] = [];
    for (const item of [...formulaExtracted, ...ruleAnns]) {
      if (!combined.some((x) => x.symbol === item.symbol)) {
        combined.push(item);
      }
      if (combined.length >= 5) break;
    }

    if (combined.length === 0) {
      if (ctx.subject === 'physics') {
        combined.push(
          { symbol: 'SI', meaning: 'Hệ đơn vị chuẩn quốc tế (m, kg, s, A, K)', unitOrType: 'Đơn vị vật lí', condition: 'Luôn quy đổi trước khi thay số' },
          { symbol: '\\Delta X', meaning: 'Độ biến thiên của đại lượng vật lí', unitOrType: 'Theo đại lượng', condition: '$\\Delta X = X_{\\text{sau}} - X_{\\text{trước}}$' }
        );
      } else if (ctx.subject === 'chemistry') {
        combined.push(
          { symbol: 'n', meaning: 'Số mol chất phản ứng hoặc sản phẩm', unitOrType: 'mol', condition: 'Đổi thể tích dung dịch sang lít, khí đúng đkc' },
          { symbol: 'C_M', meaning: 'Nồng độ mol của dung dịch', unitOrType: 'M (mol/L)', condition: '$C_M = \\frac{n}{V}$' }
        );
      } else if (ctx.subject === 'biology') {
        combined.push(
          { symbol: '2n, n', meaning: 'Bộ NST lưỡng bội và đơn bội của loài', unitOrType: 'Nhiễm sắc thể', condition: 'Giao tử mang bộ $n$, hợp tử mang bộ $2n$' },
          { symbol: 'N, L', meaning: 'Tổng số nuclêôtit và chiều dài gen/DNA', unitOrType: 'Nu · Å', condition: '$L = \\frac{N}{2} \\cdot 3{,}4\\text{ \\AA}$' }
        );
      } else if (ctx.subject === 'math') {
        combined.push(
          { symbol: 'x', meaning: 'Biến số độc lập của bài toán', unitOrType: 'Số thực $\\mathbb{R}$', condition: 'Thuộc tập xác định $D$' },
          { symbol: 'm', meaning: 'Tham số biện luận (nếu có)', unitOrType: 'Tham số thực', condition: 'Xét trường hợp suy biến' }
        );
      } else {
        combined.push(
          { symbol: 'N', meaning: 'Kích thước dữ liệu đầu vào', unitOrType: '`int` / `long long`', condition: 'Đối chiếu giới hạn $10^8$ phép tính/s' },
          { symbol: 'ans', meaning: 'Biến lưu kết quả bài toán', unitOrType: '`long long`', condition: 'Khởi tạo đúng giá trị ban đầu' }
        );
      }
    }
    annotations = combined;
  }

  // Build Step-by-step Notes
  let stepByStepNotes: string[] = step.stepByStepNotes || [];
  if (stepByStepNotes.length === 0) {
    if (matchedRule?.stepNotes && matchedRule.stepNotes.length > 0 && stepIdx === 0) {
      stepByStepNotes = matchedRule.stepNotes;
    } else if (ctx.subject === 'physics') {
      stepByStepNotes = [
        'Bước 1: Đọc kỹ hiện tượng, tóm tắt dữ kiện đã cho và đổi toàn bộ sang hệ đơn vị chuẩn SI.',
        'Bước 2: Xác định hệ quy chiếu / chiều dương (hoặc sơ đồ mạch) để ghi đúng dấu đại lượng.',
        'Bước 3: Chọn công thức phù hợp, kiểm tra điều kiện áp dụng rồi mới bấm máy tính.'
      ];
    } else if (ctx.subject === 'chemistry') {
      stepByStepNotes = [
        'Bước 1: Quy đổi các số liệu khối lượng, thể tích, nồng độ về số mol và kiểm tra điều kiện chuẩn.',
        'Bước 2: Cân bằng phương trình phản ứng hoặc thiết lập sơ đồ bảo toàn electron / bảo toàn nguyên tố.',
        'Bước 3: So sánh tỉ lệ mol để tìm chất hết – chất dư trước khi kết luận lượng sản phẩm.'
      ];
    } else if (ctx.subject === 'biology') {
      stepByStepNotes = [
        'Bước 1: Xác định cấp độ tổ chức (phân tử DNA/RNA, tế bào nguyên/giảm phân, cơ thể hay quần thể).',
        'Bước 2: Viết đúng quy ước chiều mạch ($3\'\\to 5\'$ hay $5\'\\to 3\'$) hoặc tỉ lệ giao tử/kiểu gen.',
        'Bước 3: Kiểm chứng kết quả qua mô phỏng 2D/3D để nắm chắc cơ chế biến đổi.'
      ];
    } else if (ctx.subject === 'math') {
      stepByStepNotes = [
        'Bước 1: Ghi ngay điều kiện xác định (mẫu $\\ne 0$, trong căn $\\ge 0$, biểu thức logarit $> 0$).',
        'Bước 2: Chọn công thức biến đổi tương đương hoặc phương pháp tọa độ/hình học tối ưu.',
        'Bước 3: Đối chiếu lại nghiệm tìm được với điều kiện ban đầu và kiểm tra dấu bằng (nếu có).'
      ];
    } else {
      stepByStepNotes = [
        'Bước 1: Phân tích giới hạn $N$ và giá trị lớn nhất để quyết định kiểu `int` hay `long long`.',
        'Bước 2: Phác thảo thuật toán theo bất biến đúng, sau đó chạy tay với test nhỏ nhất ($N=0, 1, 2$).',
        'Bước 3: Cài đặt code, kiểm tra lỗi tràn chỉ số mảng (off-by-one) và nộp kiểm thử trên Judge.'
      ];
    }
  }

  return {
    ...step,
    conceptGlossary,
    annotations,
    stepByStepNotes
  };
}
