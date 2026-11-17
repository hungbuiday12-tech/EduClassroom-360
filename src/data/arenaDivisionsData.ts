import {
  ArenaDivisionId,
  ArenaDivisionMeta,
  ArenaEssayPrompt,
  ArenaQuestionMCQ,
  ArenaSubject
} from '../types';

export const ARENA_DIVISIONS: ArenaDivisionMeta[] = [
  {
    id: '9k',
    gradeGroup: '9',
    track: 'khong_chuyen',
    labelVi: 'Lớp 9 · Không Chuyên',
    labelEn: 'Grade 9 · Standard',
    shortLabelVi: 'Lớp 9 Chuẩn',
    shortLabelEn: 'G9 Standard',
    descriptionVi: 'Hệ phương trình, Vi-ét, hình tròn, Định luật Ôm, thấu kính & thuật toán cơ bản ôn thi vào lớp 10.',
    descriptionEn: 'Equations, Vieta, circle geometry, Ohm law, lenses & foundational algorithms for Grade 10 entrance prep.',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200 border-sky-300 dark:border-sky-700'
  },
  {
    id: '9c',
    gradeGroup: '9',
    track: 'chuyen',
    labelVi: 'Lớp 9 · Chuyên',
    labelEn: 'Grade 9 · Specialized',
    shortLabelVi: 'Lớp 9 Chuyên',
    shortLabelEn: 'G9 Spec',
    descriptionVi: 'Nghiệm nguyên, BĐT Cauchy, mạch cầu điện trở, quang hình ghép & số học/tham lam thi Chuyên vào 10.',
    descriptionEn: 'Diophantine equations, AM-GM, bridge circuits, combined optics & number theory for Specialized HS entrance.',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
  },
  {
    id: '10k',
    gradeGroup: '10',
    track: 'khong_chuyen',
    labelVi: 'Lớp 10 · Không Chuyên',
    labelEn: 'Grade 10 · Standard',
    shortLabelVi: 'Lớp 10 Chuẩn',
    shortLabelEn: 'G10 Standard',
    descriptionVi: 'Bất phương trình bậc 2, hệ thức lượng, rơi tự do, động lực học Newton & lập trình mảng/hàm cơ bản.',
    descriptionEn: 'Quadratic inequalities, triangle law, free fall, Newton laws & basic array programming.',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700'
  },
  {
    id: '10c',
    gradeGroup: '10',
    track: 'chuyen',
    labelVi: 'Lớp 10 · Chuyên',
    labelEn: 'Grade 10 · Specialized',
    shortLabelVi: 'Lớp 10 Chuyên',
    shortLabelEn: 'G10 Spec',
    descriptionVi: 'Bất đẳng thức Cauchy-Schwarz, tâm tỉ cự, ném xiên mặt nghiêng, va chạm đàn hồi & Prefix Sum / Hai con trỏ.',
    descriptionEn: 'Cauchy-Schwarz, barycenter, inclined-plane projectile, elastic collisions & Two Pointers / Prefix Sum.',
    badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200 border-violet-300 dark:border-violet-700'
  },
  {
    id: '11k',
    gradeGroup: '11',
    track: 'khong_chuyen',
    labelVi: 'Lớp 11 · Không Chuyên',
    labelEn: 'Grade 11 · Standard',
    shortLabelVi: 'Lớp 11 Chuẩn',
    shortLabelEn: 'G11 Standard',
    descriptionVi: 'Lượng giác, cấp số cộng/nhân, giới hạn, dao động điều hòa, sóng cơ & tìm kiếm sắp xếp.',
    descriptionEn: 'Trigonometry, sequences, limits, harmonic oscillation, mechanical waves & search/sort algorithms.',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
  },
  {
    id: '11c',
    gradeGroup: '11',
    track: 'chuyen',
    labelVi: 'Lớp 11 · Chuyên',
    labelEn: 'Grade 11 · Specialized',
    shortLabelVi: 'Lớp 11 Chuyên',
    shortLabelEn: 'G11 Spec',
    descriptionVi: 'Dãy số truy hồi, khoảng cách không gian nâng cao, hệ dao động ghép, tụ điện phức & đồ thị BFS/DFS/DP.',
    descriptionEn: 'Recurrence sequences, 3D distances, coupled oscillators, capacitor networks & Graph BFS/DFS/DP.',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 border-teal-300 dark:border-teal-700'
  },
  {
    id: '12k',
    gradeGroup: '12',
    track: 'khong_chuyen',
    labelVi: 'Lớp 12 · Không Chuyên',
    labelEn: 'Grade 12 · Standard',
    shortLabelVi: 'Lớp 12 Chuẩn',
    shortLabelEn: 'G12 Standard',
    descriptionVi: 'Cực trị, tích phân, hình Oxyz, khí lí tưởng, mạch RLC cơ bản, hạt nhân & AI / Mạng / Web chuẩn Bộ GD&ĐT 2025.',
    descriptionEn: 'Extrema, integrals, Oxyz geometry, ideal gas, basic RLC, nuclear physics & AI/Networking/Web (2025 curriculum).',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-300 dark:border-amber-700'
  },
  {
    id: '12c',
    gradeGroup: '12',
    track: 'chuyen',
    labelVi: 'Lớp 12 · Chuyên',
    labelEn: 'Grade 12 · Specialized',
    shortLabelVi: 'Lớp 12 Chuyên',
    shortLabelEn: 'G12 Spec',
    descriptionVi: 'Tích phân hàm ẩn, cực trị hàm hợp, RLC biến thiên cộng hưởng, Lorentz & Segment Tree / DP Bitmask.',
    descriptionEn: 'Implicit-function integrals, composite extrema, variable RLC resonance, Lorentz & Segment Tree / Bitmask DP.',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200 border-rose-300 dark:border-rose-700'
  },
  {
    id: 'olp',
    gradeGroup: 'olp',
    track: 'chuyen',
    labelVi: 'Đội tuyển HSG & Olympic',
    labelEn: 'Olympiad & National Team',
    shortLabelVi: 'HSG / Olympic',
    shortLabelEn: 'Olympiad',
    descriptionVi: 'Đấu trường cấp Tỉnh / Quốc gia / Olympic 30-4 / VNOI: Số học Euler, cơ học vật rắn, nhiệt động lực học & Đồ thị nâng cao.',
    descriptionEn: 'Provincial/National Olympiad & VNOI track: Euler totient, rigid body dynamics, thermodynamics & advanced graphs.',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-300 dark:border-purple-700'
  }
];

export const ARENA_DIVISION_MCQ_BANK: Record<
  ArenaDivisionId,
  Record<ArenaSubject, ArenaQuestionMCQ[]>
> = {
  // ========================== LỚP 9 KHÔNG CHUYÊN ==========================
  '9k': {
    math: [
      {
        id: '9k-m1',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Điều kiện xác định của biểu thức $\\sqrt{2x - 6}$ là:',
        options: ['$x \\ge 3$', '$x > 3$', '$x \\le 3$', '$x \\ge -3$'],
        correctIndex: 0,
        explanation: 'Căn thức bậc hai $\\sqrt{A}$ xác định khi $A \\ge 0 \\Leftrightarrow 2x - 6 \\ge 0 \\Leftrightarrow x \\ge 3$.',
        points: 20
      },
      {
        id: '9k-m2',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Nghiệm của hệ phương trình $\\begin{cases} x + y = 5 \\\\ x - y = 1 \\end{cases}$ là:',
        options: ['$(3; 2)$', '$(2; 3)$', '$(4; 1)$', '$(1; 4)$'],
        correctIndex: 0,
        explanation: 'Cộng vế theo vế hai phương trình được $2x = 6 \\Rightarrow x = 3$, suy ra $y = 5 - 3 = 2$.',
        points: 20
      },
      {
        id: '9k-m3',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Cho phương trình $x^2 - 7x + 10 = 0$ có hai nghiệm $x_1, x_2$. Giá trị của $x_1^2 + x_2^2$ bằng:',
        options: ['$29$', '$49$', '$39$', '$19$'],
        correctIndex: 0,
        explanation: 'Theo Vi-ét: $x_1 + x_2 = 7, x_1 x_2 = 10$. Do đó $x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1 x_2 = 49 - 20 = 29$.',
        points: 20
      },
      {
        id: '9k-m4',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$, biết $BH = 4\\text{ cm}, CH = 9\\text{ cm}$. Độ dài $AH$ là:',
        options: ['$6\\text{ cm}$', '$13\\text{ cm}$', '$\\sqrt{13}\\text{ cm}$', '$36\\text{ cm}$'],
        correctIndex: 0,
        explanation: 'Áp dụng hệ thức lượng $AH^2 = BH \\cdot CH = 4 \\cdot 9 = 36 \\Rightarrow AH = 6\\text{ cm}$.',
        points: 20
      },
      {
        id: '9k-m5',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Trong đường tròn $(O; 5\\text{ cm})$, dây cung $AB$ có độ dài $8\\text{ cm}$. Khoảng cách từ tâm $O$ đến dây $AB$ bằng:',
        options: ['$3\\text{ cm}$', '$4\\text{ cm}$', '$5\\text{ cm}$', '$2\\text{ cm}$'],
        correctIndex: 0,
        explanation: 'Gọi $H$ là trung điểm $AB \\Rightarrow HB = 4\\text{ cm}$. Tam giác $OHB$ vuông tại $H$ nên $OH = \\sqrt{R^2 - HB^2} = \\sqrt{5^2 - 4^2} = 3\\text{ cm}$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '9k-p1',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào hiệu điện thế $U = 12\\text{ V}$. Cường độ dòng điện qua mạch chính là:',
        options: ['$3\\text{ A}$', '$2\\text{ A}$', '$1\\text{ A}$', '$0{,}67\\text{ A}$'],
        correctIndex: 0,
        explanation: '$R_{tđ} = \\frac{6\\cdot 12}{6+12} = 4\\,\\Omega \\Rightarrow I = \\frac{U}{R_{tđ}} = \\frac{12}{4} = 3\\text{ A}$.',
        points: 20
      },
      {
        id: '9k-p2',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Một bóng đèn ghi $220\\text{ V} - 100\\text{ W}$ hoạt động bình thường trong $2\\text{ giờ}$. Điện năng tiêu thụ của đèn là:',
        options: ['$0{,}2\\text{ kWh}$', '$200\\text{ kWh}$', '$0{,}05\\text{ kWh}$', '$2\\text{ kWh}$'],
        correctIndex: 0,
        explanation: 'Đổi $100\\text{ W} = 0{,}1\\text{ kW}$. Điện năng tiêu thụ $A = P\\cdot t = 0{,}1 \\cdot 2 = 0{,}2\\text{ kWh}$.',
        points: 20
      },
      {
        id: '9k-p3',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Một vật sáng đặt trước thấu kính hội tụ có tiêu cự $f = 20\\text{ cm}$ và cách thấu kính $d = 30\\text{ cm}$. Khoảng cách từ ảnh tới thấu kính $d\'$ là:',
        options: ['$60\\text{ cm}$', '$12\\text{ cm}$', '$30\\text{ cm}$', '$40\\text{ cm}$'],
        correctIndex: 0,
        explanation: '$\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\Rightarrow \\frac{1}{d\'} = \\frac{1}{20} - \\frac{1}{30} = \\frac{1}{60} \\Rightarrow d\' = 60\\text{ cm}$.',
        points: 20
      },
      {
        id: '9k-p4',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Tia sáng truyền từ không khí ($n_1 = 1$) vào thủy tinh ($n_2 = \\sqrt{2}$) với góc tới $i = 45^\\circ$. Góc khúc xạ $r$ bằng:',
        options: ['$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$15^\\circ$'],
        correctIndex: 0,
        explanation: 'Định luật khúc xạ: $1\\cdot \\sin 45^\\circ = \\sqrt{2}\\sin r \\Rightarrow \\sin r = \\frac{1}{2} \\Rightarrow r = 30^\\circ$.',
        points: 20
      },
      {
        id: '9k-p5',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Một vật có khối lượng $m = 2\\text{ kg}$ ở độ cao $h = 5\\text{ m}$ so với mặt đất ($g = 10\\text{ m/s}^2$). Thế năng trọng trường của vật là:',
        options: ['$100\\text{ J}$', '$10\\text{ J}$', '$50\\text{ J}$', '$25\\text{ J}$'],
        correctIndex: 0,
        explanation: 'Thế năng $W_t = mgh = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '9k-c1',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Trong Python, kết quả của `sum([2, 4, 6, 8])` là:',
        options: ['$20$', '$10$', '$24$', '$4$'],
        correctIndex: 0,
        explanation: 'Hàm `sum()` cộng toàn bộ các phần tử trong danh sách: $2 + 4 + 6 + 8 = 20$.',
        points: 20
      },
      {
        id: '9k-c2',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Trong C++, biểu thức `17 % 5` cho kết quả bằng bao nhiêu?',
        options: ['$2$', '$3$', '$3.4$', '$5$'],
        correctIndex: 0,
        explanation: 'Toán tử `%` trả về phần dư của phép chia nguyên: $17 = 3\\times 5 + 2$, nên dư là $2$.',
        points: 20
      },
      {
        id: '9k-c3',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Vòng lặp `for i in range(1, 6):` trong Python sẽ lặp qua các giá trị nào của `i`?',
        options: ['$1, 2, 3, 4, 5$', '$1, 2, 3, 4, 5, 6$', '$0, 1, 2, 3, 4, 5$', '$2, 3, 4, 5$'],
        correctIndex: 0,
        explanation: '`range(1, 6)` sinh dãy số nguyên từ $1$ đến $6 - 1 = 5$.',
        points: 20
      },
      {
        id: '9k-c4',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Để kiểm tra số nguyên `n` có chia hết cho cả `3` và `5` trong C++, ta viết điều kiện nào?',
        options: ['`n % 3 == 0 && n % 5 == 0`', '`n % 3 == 0 || n % 5 == 0`', '`n / 3 == 0 && n / 5 == 0`', '`n % 8 == 0`'],
        correctIndex: 0,
        explanation: 'Phép `&&` (AND logic) yêu cầu đồng thời cả hai phép chia lấy dư đều bằng `0`.',
        points: 20
      },
      {
        id: '9k-c5',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Tìm giá trị lớn nhất trong mảng $N$ phần tử bằng 1 vòng lặp `for` có độ phức tạp thời gian là:',
        options: ['$\\mathcal{O}(N)$', '$\\mathcal{O}(1)$', '$\\mathcal{O}(N^2)$', '$\\mathcal{O}(\\log N)$'],
        correctIndex: 0,
        explanation: 'Ta chỉ cần duyệt tuần tự qua đúng $N$ phần tử một lần nên độ phức tạp là $\\mathcal{O}(N)$.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 9 CHUYÊN ==========================
  '9c': {
    math: [
      {
        id: '9c-m1',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        question: 'Số cặp số nguyên $(x; y)$ thỏa mãn phương trình $xy - 2x - 3y + 1 = 0$ là:',
        options: ['$4$', '$2$', '$6$', '$8$'],
        correctIndex: 0,
        explanation: 'Biến đổi $(x - 3)(y - 2) = 5$. Vì $5$ có $4$ ước nguyên là $\\pm 1, \\pm 5$ nên có đúng $4$ cặp nghiệm nguyên.',
        points: 20
      },
      {
        id: '9c-m2',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        question: 'Với $x > 0$, giá trị nhỏ nhất của biểu thức $P = x + \\frac{9}{x} + 2$ là:',
        options: ['$8$', '$6$', '$11$', '$5$'],
        correctIndex: 0,
        explanation: 'Theo BĐT Cauchy (AM-GM): $x + \\frac{9}{x} \\ge 2\\sqrt{9} = 6 \\Rightarrow P \\ge 6 + 2 = 8$ (dấu bằng khi $x = 3$).',
        points: 20
      },
      {
        id: '9c-m3',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        question: 'Cho $a, b > 0$ thỏa mãn $a + b = 4$. Giá trị lớn nhất của tích $ab$ và giá trị nhỏ nhất của $\\frac{1}{a} + \\frac{1}{b}$ lần lượt là:',
        options: ['$4$ và $1$', '$4$ và $2$', '$2$ và $1$', '$8$ và $0{,}5$'],
        correctIndex: 0,
        explanation: '$ab \\le \\left(\\frac{a+b}{2}\\right)^2 = 4$ và $\\frac{1}{a} + \\frac{1}{b} \\ge \\frac{4}{a+b} = 1$.',
        points: 20
      },
      {
        id: '9c-m4',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        question: 'Tứ giác $ABCD$ nội tiếp đường tròn có $\\widehat{ABC} = 112^\\circ$. Số đo góc $\\widehat{ADC}$ bằng:',
        options: ['$68^\\circ$', '$112^\\circ$', '$56^\\circ$', '$78^\\circ$'],
        correctIndex: 0,
        explanation: 'Tổng hai góc đối của tứ giác nội tiếp bằng $180^\\circ$, do đó $\\widehat{ADC} = 180^\\circ - 112^\\circ = 68^\\circ$.',
        points: 20
      },
      {
        id: '9c-m5',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        question: 'Số dư khi chia $2^{2025}$ cho $7$ bằng:',
        options: ['$1$', '$2$', '$4$', '$6$'],
        correctIndex: 0,
        explanation: 'Ta có $2^3 = 8 \\equiv 1 \\pmod 7$. Vì $2025 = 3 \\cdot 675$ nên $2^{2025} = (2^3)^{675} \\equiv 1^{675} = 1 \\pmod 7$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '9c-p1',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        question: 'Một mạch cầu cân bằng gồm 4 điện trở $R_1 = 4\\,\\Omega, R_2 = 8\\,\\Omega, R_3 = 6\\,\\Omega, R_4$ và điện trở cầu $R_5 = 10\\,\\Omega$. Để dòng qua $R_5$ bằng $0$ thì $R_4$ phải bằng:',
        options: ['$12\\,\\Omega$', '$3\\,\\Omega$', '$10\\,\\Omega$', '$24\\,\\Omega$'],
        correctIndex: 0,
        explanation: 'Điều kiện cầu cân bằng: $R_1 R_4 = R_2 R_3 \\Rightarrow 4\\cdot R_4 = 8\\cdot 6 = 48 \\Rightarrow R_4 = 12\\,\\Omega$.',
        points: 20
      },
      {
        id: '9c-p2',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        question: 'Trộn $m_1 = 2\\text{ kg}$ nước ở $20^\\circ\\text{C}$ với $m_2 = 1\\text{ kg}$ nước ở $80^\\circ\\text{C}$ (bỏ qua trao đổi nhiệt với bình). Nhiệt độ cân bằng là:',
        options: ['$40^\\circ\\text{C}$', '$50^\\circ\\text{C}$', '$35^\\circ\\text{C}$', '$45^\\circ\\text{C}$'],
        correctIndex: 0,
        explanation: '$m_1 c (t - 20) = m_2 c (80 - t) \\Rightarrow 2(t - 20) = 80 - t \\Rightarrow 3t = 120 \\Rightarrow t = 40^\\circ\\text{C}$.',
        points: 20
      },
      {
        id: '9c-p3',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        question: 'Hai thấu kính hội tụ $O_1, O_2$ đồng trục có tiêu cự $f_1 = 20\\text{ cm}, f_2 = 30\\text{ cm}$ đặt cách nhau $l = 50\\text{ cm}$. Chiếu chùm tia sáng song song trục chính qua $O_1$ rồi qua $O_2$, chùm tia ló ra khỏi $O_2$ sẽ là:',
        options: ['Chùm tia song song trục chính', 'Chùm hội tụ tại điểm cách $O_2$ $15\\text{ cm}$', 'Chùm phân kì', 'Chùm hội tụ tại tiêu điểm $O_2$'],
        correctIndex: 0,
        explanation: 'Vì $l = f_1 + f_2 = 50\\text{ cm}$, ảnh qua $O_1$ rơi đúng tiêu điểm vật của $O_2$ nên chùm tia ló khỏi $O_2$ song song (hệ vô tiêu).',
        points: 20
      },
      {
        id: '9c-p4',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        question: 'Một nguồn điện không đổi có $U = 12\\text{ V}$ mắc nối tiếp điện trở $R_0 = 4\\,\\Omega$ và biến trở $R$. Để công suất tỏa nhiệt trên $R$ đạt cực đại, giá trị $R$ bằng:',
        options: ['$4\\,\\Omega$', '$2\\,\\Omega$', '$8\\,\\Omega$', '$1\\,\\Omega$'],
        correctIndex: 0,
        explanation: '$P_R = \\frac{U^2 R}{(R_0 + R)^2} \\le \\frac{U^2}{4R_0}$, đạt cực đại khi $R = R_0 = 4\\,\\Omega$.',
        points: 20
      },
      {
        id: '9c-p5',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        question: 'Một ca nô đi xuôi dòng từ A đến B mất $2\\text{ h}$, đi ngược dòng từ B về A mất $3\\text{ h}$. Nếu ca nô tắt máy trôi tự do theo dòng nước từ A đến B thì mất:',
        options: ['$12\\text{ giờ}$', '$5\\text{ giờ}$', '$6\\text{ giờ}$', '$10\\text{ giờ}$'],
        correctIndex: 0,
        explanation: '$v_c + v_n = \\frac{S}{2}$ và $v_c - v_n = \\frac{S}{3} \\Rightarrow v_n = \\frac{1}{2}(\\frac{S}{2} - \\frac{S}{3}) = \\frac{S}{12} \\Rightarrow t_n = 12\\text{ h}$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '9c-c1',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        question: 'Độ phức tạp thời gian của thuật toán Sàng Eratosthenes tìm tất cả số nguyên tố $\\le N$ là:',
        options: ['$\\mathcal{O}(N \\log \\log N)$', '$\\mathcal{O}(N^2)$', '$\\mathcal{O}(N\\sqrt{N})$', '$\\mathcal{O}(\\log N)$'],
        correctIndex: 0,
        explanation: 'Tổng số lần đánh dấu bội là $N\\sum_{p \\le N} \\frac{1}{p} = \\mathcal{O}(N \\log \\log N)$.',
        points: 20
      },
      {
        id: '9c-c2',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        question: 'Giá trị của $\\gcd(1071, 462)$ bằng bao nhiêu?',
        options: ['$21$', '$7$', '$42$', '$14$'],
        correctIndex: 0,
        explanation: 'Euclid: $\\gcd(1071, 462) = \\gcd(462, 147) = \\gcd(147, 21) = \\gcd(21, 0) = 21$.',
        points: 20
      },
      {
        id: '9c-c3',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        question: 'Để đếm số lượng ước nguyên dương của số nguyên $N \\le 10^{12}$, thuật toán tối ưu chạy trong:',
        options: ['$\\mathcal{O}(\\sqrt{N})$', '$\\mathcal{O}(N)$', '$\\mathcal{O}(N \\log N)$', '$\\mathcal{O}(N^2)$'],
        correctIndex: 0,
        explanation: 'Chỉ cần duyệt từ $1$ đến $\\lfloor\\sqrt{N}\\rfloor$, mỗi ước $d$ sẽ sinh ra ước đối xứng $N/d$.',
        points: 20
      },
      {
        id: '9c-c4',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        question: 'Trong C++, để lưu tổng của $10^5$ số nguyên mà mỗi số lên tới $10^9$ không bị tràn số, ta dùng kiểu dữ liệu:',
        options: ['`long long`', '`int`', '`unsigned short`', '`char`'],
        correctIndex: 0,
        explanation: 'Tổng tối đa đạt $10^{14}$, vượt giới hạn `int` ($2\\cdot 10^9$). `long long` lưu tới $\\approx 9\\cdot 10^{18}$.',
        points: 20
      },
      {
        id: '9c-c5',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        question: 'Cho dãy $N \\le 10^5$ số nguyên dương. Để kiểm tra một số $x$ có xuất hiện trong mảng đã sắp xếp tăng dần hay không, thuật toán nhanh nhất là:',
        options: ['Tìm kiếm nhị phân $\\mathcal{O}(\\log N)$', 'Tìm kiếm tuần tự $\\mathcal{O}(N)$', 'Bubble Sort', 'Quay lui'],
        correctIndex: 0,
        explanation: 'Mảng đã sắp xếp cho phép dùng Binary Search với $\\mathcal{O}(\\log N)$ phép so sánh.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 10 KHÔNG CHUYÊN ==========================
  '10k': {
    math: [
      {
        id: '10k-m1',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Tập nghiệm của bất phương trình $x^2 - 4x + 3 \\le 0$ là:',
        options: ['$[1; 3]$', '$(-\\infty; 1] \\cup [3; +\\infty)$', '$(1; 3)$', '$[-3; -1]$'],
        correctIndex: 0,
        explanation: 'Tam thức $x^2 - 4x + 3$ có 2 nghiệm $1, 3$ và $a = 1 > 0$. Áp dụng "Trong trái, ngoài cùng", ta được $x \\in [1; 3]$.',
        points: 20
      },
      {
        id: '10k-m2',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Trong tam giác $ABC$ có $AB = 5, AC = 8, \\widehat{BAC} = 60^\\circ$. Độ dài cạnh $BC$ bằng:',
        options: ['$7$', '$\\sqrt{129}$', '$6$', '$\\sqrt{39}$'],
        correctIndex: 0,
        explanation: 'Theo định lí Côsin: $BC^2 = 5^2 + 8^2 - 2\\cdot 5\\cdot 8\\cdot \\cos 60^\\circ = 25 + 64 - 40 = 49 \\Rightarrow BC = 7$.',
        points: 20
      },
      {
        id: '10k-m3',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Trong mặt phẳng $Oxy$, cho $\\vec{a} = (2; -3)$ và $\\vec{b} = (4; 1)$. Tích vô hướng $\\vec{a} \\cdot \\vec{b}$ bằng:',
        options: ['$5$', '$11$', '$-5$', '$8$'],
        correctIndex: 0,
        explanation: '$\\vec{a}\\cdot\\vec{b} = 2\\cdot 4 + (-3)\\cdot 1 = 8 - 3 = 5$.',
        points: 20
      },
      {
        id: '10k-m4',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Từ các chữ số $1, 2, 3, 4, 5$ có thể lập được bao nhiêu số tự nhiên có $3$ chữ số đôi một khác nhau?',
        options: ['$60$', '$125$', '$10$', '$20$'],
        correctIndex: 0,
        explanation: 'Số cách lập là chỉnh hợp chập $3$ của $5$: $A_5^3 = 5 \\cdot 4 \\cdot 3 = 60$.',
        points: 20
      },
      {
        id: '10k-m5',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Phương trình chính tắc của đường tròn tâm $I(1; -2)$ và bán kính $R = 3$ là:',
        options: ['$(x-1)^2 + (y+2)^2 = 9$', '$(x+1)^2 + (y-2)^2 = 9$', '$(x-1)^2 + (y+2)^2 = 3$', '$(x-1)^2 + (y-2)^2 = 9$'],
        correctIndex: 0,
        explanation: 'Phương trình đường tròn tâm $I(a; b)$ bán kính $R$ là $(x-a)^2 + (y-b)^2 = R^2$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '10k-p1',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Một vật thả rơi tự do không vận tốc đầu từ độ cao $h = 45\\text{ m}$ tại nơi có $g = 10\\text{ m/s}^2$. Thời gian rơi chạm đất là:',
        options: ['$3\\text{ s}$', '$4{,}5\\text{ s}$', '$9\\text{ s}$', '$2\\text{ s}$'],
        correctIndex: 0,
        explanation: 'Rơi tự do: $h = \\frac{1}{2}gt^2 \\Rightarrow t = \\sqrt{\\frac{2\\cdot 45}{10}} = 3\\text{ s}$.',
        points: 20
      },
      {
        id: '10k-p2',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Một ô tô khối lượng $1000\\text{ kg}$ tăng tốc đều từ $0$ lên $20\\text{ m/s}$ trong $5\\text{ s}$. Hợp lực tác dụng lên ô tô có độ lớn:',
        options: ['$4000\\text{ N}$', '$2000\\text{ N}$', '$20000\\text{ N}$', '$500\\text{ N}$'],
        correctIndex: 0,
        explanation: 'Gia tốc $a = \\frac{20 - 0}{5} = 4\\text{ m/s}^2$. Theo định luật II Newton: $F = ma = 1000 \\cdot 4 = 4000\\text{ N}$.',
        points: 20
      },
      {
        id: '10k-p3',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Lực $F = 20\\text{ N}$ hợp với hướng chuyển động một góc $\\alpha = 60^\\circ$ kéo vật đi quãng đường $s = 5\\text{ m}$. Công của lực $F$ là:',
        options: ['$50\\text{ J}$', '$100\\text{ J}$', '$50\\sqrt{3}\\text{ J}$', '$25\\text{ J}$'],
        correctIndex: 0,
        explanation: '$A = F\\cdot s\\cdot \\cos\\alpha = 20 \\cdot 5 \\cdot \\cos 60^\\circ = 50\\text{ J}$.',
        points: 20
      },
      {
        id: '10k-p4',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Một bánh xe quay đều với tốc độ góc $\\omega = 10\\text{ rad/s}$, bán kính vành bánh $R = 0{,}4\\text{ m}$. Gia tốc hướng tâm ở vành bánh là:',
        options: ['$40\\text{ m/s}^2$', '$4\\text{ m/s}^2$', '$16\\text{ m/s}^2$', '$100\\text{ m/s}^2$'],
        correctIndex: 0,
        explanation: '$a_{ht} = \\omega^2 R = 10^2 \\cdot 0{,}4 = 40\\text{ m/s}^2$.',
        points: 20
      },
      {
        id: '10k-p5',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Một vật khối lượng $2\\text{ kg}$ chuyển động với vận tốc $5\\text{ m/s}$. Động lượng của vật có độ lớn bằng:',
        options: ['$10\\text{ kg}\\cdot\\text{m/s}$', '$25\\text{ kg}\\cdot\\text{m/s}$', '$2{,}5\\text{ kg}\\cdot\\text{m/s}$', '$7\\text{ kg}\\cdot\\text{m/s}$'],
        correctIndex: 0,
        explanation: 'Động lượng $p = m\\cdot v = 2 \\cdot 5 = 10\\text{ kg}\\cdot\\text{m/s}$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '10k-c1',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Số nguyên dương $25$ ở hệ thập phân được biểu diễn trong hệ nhị phân (base 2) là:',
        options: ['`11001`', '`10101`', '`11010`', '`10011`'],
        correctIndex: 0,
        explanation: '$25 = 16 + 8 + 1 = 1\\cdot 2^4 + 1\\cdot 2^3 + 0\\cdot 2^2 + 0\\cdot 2^1 + 1\\cdot 2^0 = 11001_2$.',
        points: 20
      },
      {
        id: '10k-c2',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Trong Python, kết quả của biểu thức `[x*x for x in range(1, 5) if x % 2 == 0]` là:',
        options: ['`[4, 16]`', '`[1, 4, 9, 16]`', '`[4, 16, 36]`', '`[2, 4]`'],
        correctIndex: 0,
        explanation: 'Các số chẵn trong `range(1, 5)` là $2$ và $4$, bình phương lên thu được `[4, 16]`.',
        points: 20
      },
      {
        id: '10k-c3',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Cho xâu `s = "Synapse"`. Trong Python, `s[1:4]` trả về chuỗi nào?',
        options: ['`"yna"`', '`"Syn"`', '`"ynap"`', '`"Syna"`'],
        correctIndex: 0,
        explanation: 'Chỉ số trong Python bắt đầu từ 0: `s[1]=\'y\', s[2]=\'n\', s[3]=\'a\'`, cận trên 4 không lấy.',
        points: 20
      },
      {
        id: '10k-c4',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Trong hệ mã ASCII chuẩn, $1\\text{ byte}$ gồm bao nhiêu bit?',
        options: ['$8\\text{ bit}$', '$4\\text{ bit}$', '$16\\text{ bit}$', '$32\\text{ bit}$'],
        correctIndex: 0,
        explanation: '$1\\text{ byte} = 8\\text{ bit}$, biểu diễn được $2^8 = 256$ trạng thái.',
        points: 20
      },
      {
        id: '10k-c5',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        question: 'Trong Python, câu lệnh nào dùng để định nghĩa một hàm tính bình phương `sq(x)`?',
        options: ['`def sq(x): return x * x`', '`function sq(x) { return x * x }`', '`int sq(int x) = x*x;`', '`func sq(x): x*x`'],
        correctIndex: 0,
        explanation: 'Từ khóa khai báo hàm trong Python là `def`.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 10 CHUYÊN ==========================
  '10c': {
    math: [
      {
        id: '10c-m1',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        question: 'Cho $x, y, z$ thực thỏa mãn $x + y + z = 6$. Giá trị nhỏ nhất của $S = x^2 + y^2 + z^2$ bằng:',
        options: ['$12$', '$6$', '$18$', '$9$'],
        correctIndex: 0,
        explanation: 'Theo BĐT Cauchy-Schwarz: $3(x^2 + y^2 + z^2) \\ge (x+y+z)^2 = 36 \\Rightarrow S \\ge 12$ khi $x=y=z=2$.',
        points: 20
      },
      {
        id: '10c-m2',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        question: 'Số giá trị nguyên của tham số $m$ để bất phương trình $(m-1)x^2 - 2(m-1)x + 3 > 0$ nghiệm đúng với mọi $x \\in \\mathbb{R}$ là:',
        options: ['$3$', '$2$', '$4$', '$5$'],
        correctIndex: 0,
        explanation: 'TH1: $m=1 \\Rightarrow 3 > 0$ (Đúng). TH2: $m > 1$ và $\\Delta\' = (m-1)^2 - 3(m-1) < 0 \\Leftrightarrow 1 < m < 4 \\Rightarrow m \\in \\{2, 3\\}$. Tổng cộng có $3$ giá trị ($1, 2, 3$).',
        points: 20
      },
      {
        id: '10c-m3',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        question: 'Cho tam giác $ABC$ có trọng tâm $G$, $M$ là điểm tùy ý. Đẳng thức nào sau đây đúng?',
        options: ['$MA^2 + MB^2 + MC^2 = 3MG^2 + GA^2 + GB^2 + GC^2$', '$MA^2 + MB^2 + MC^2 = MG^2$', '$\\vec{MA} + \\vec{MB} + \\vec{MC} = \\vec{MG}$', '$3MG^2 = GA^2 + GB^2 + GC^2$'],
        correctIndex: 0,
        explanation: 'Phân tích $\\vec{MA} = \\vec{MG} + \\vec{GA}$ tương tự cho B, C rồi bình phương và dùng $\\vec{GA}+\\vec{GB}+\\vec{GC}=\\vec{0}$.',
        points: 20
      },
      {
        id: '10c-m4',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        question: 'Tìm hệ số của số hạng chứa $x^3$ trong khai triển nhị thức Newton $(2x - 1)^5$:',
        options: ['$80$', '$-80$', '$40$', '$-40$'],
        correctIndex: 0,
        explanation: 'Số hạng chứa $x^3$ ứng với $k = 2$: $C_5^2 (2x)^3 (-1)^2 = 10 \\cdot 8 x^3 \\cdot 1 = 80x^3$.',
        points: 20
      },
      {
        id: '10c-m5',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        question: 'Cho hàm số $f(x)$ thỏa mãn $f(x) + 2f(1 - x) = 3x$ với mọi $x \\in \\mathbb{R}$. Giá trị của $f(2)$ bằng:',
        options: ['$-4$', '$4$', '$0$', '$2$'],
        correctIndex: 0,
        explanation: 'Với $x=2$: $f(2)+2f(-1)=6$. Với $x=-1$: $f(-1)+2f(2)=-3$. Nhân PT(2) cho 2 rồi trừ PT(1): $3f(2)=-12 \\Rightarrow f(2)=-4$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '10c-p1',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        question: 'Một quả cầu khối lượng $m$ chuyển động với vận tốc $v_0 = 6\\text{ m/s}$ va chạm hoàn toàn đàn hồi xuyên tâm với quả cầu giống hệt đang đứng yên. Sau va chạm, vận tốc của hai quả cầu lần lượt là:',
        options: ['$0\\text{ m/s}$ và $6\\text{ m/s}$', '$3\\text{ m/s}$ và $3\\text{ m/s}$', '$-6\\text{ m/s}$ và $6\\text{ m/s}$', '$2\\text{ m/s}$ và $4\\text{ m/s}$'],
        correctIndex: 0,
        explanation: 'Khi $m_1 = m_2$ va chạm đàn hồi trực diện, hai vật trao đổi vận tốc cho nhau: vật 1 dừng lại ($0\\text{ m/s}$), vật 2 chuyển động với $v_0 = 6\\text{ m/s}$.',
        points: 20
      },
      {
        id: '10c-p2',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        question: 'Ném một vật từ đỉnh mặt phẳng nghiêng góc $\\beta = 30^\\circ$ so với phương ngang với vận tốc $v_0$ vuông góc với mặt nghiêng ($g = 10\\text{ m/s}^2$). Tầm bay xa dọc theo mặt nghiêng là:',
        options: ['$L = \\frac{2v_0^2 \\sin\\beta}{g\\cos^2\\beta}$', '$L = \\frac{v_0^2}{g}$', '$L = \\frac{v_0^2 \\cos\\beta}{g}$', '$L = \\frac{v_0^2}{2g\\sin\\beta}$'],
        correctIndex: 0,
        explanation: 'Chiếu lên hệ trục gắn với mặt nghiêng: $a_x = g\\sin\\beta, a_y = -g\\cos\\beta$. Thời gian bay $t = \\frac{2v_0}{g\\cos\\beta}$, suy ra $L = \\frac{1}{2}g\\sin\\beta\\cdot t^2 = \\frac{2v_0^2\\sin\\beta}{g\\cos^2\\beta}$.',
        points: 20
      },
      {
        id: '10c-p3',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        question: 'Một vật khối lượng $m = 2\\text{ kg}$ trượt xuống mặt phẳng nghiêng góc $30^\\circ$ có hệ số ma sát $\\mu = \\frac{1}{2\\sqrt{3}}$, $g = 10\\text{ m/s}^2$. Gia tốc của vật là:',
        options: ['$2{,}5\\text{ m/s}^2$', '$5\\text{ m/s}^2$', '$0\\text{ m/s}^2$', '$4\\text{ m/s}^2$'],
        correctIndex: 0,
        explanation: '$a = g(\\sin 30^\\circ - \\mu\\cos 30^\\circ) = 10\\left(0{,}5 - \\frac{1}{2\\sqrt{3}}\\cdot\\frac{\\sqrt{3}}{2}\\right) = 10(0{,}5 - 0{,}25) = 2{,}5\\text{ m/s}^2$.',
        points: 20
      },
      {
        id: '10c-p4',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        question: 'Vệ tinh nhân tạo chuyển động tròn đều sát bề mặt Trái Đất (bán kính $R = 6400\\text{ km}, g = 10\\text{ m/s}^2$). Tốc độ vũ trụ cấp I gần bằng:',
        options: ['$8{,}0\\text{ km/s}$', '$11{,}2\\text{ km/s}$', '$4{,}0\\text{ km/s}$', '$16{,}0\\text{ km/s}$'],
        correctIndex: 0,
        explanation: '$\\frac{mv^2}{R} = mg \\Rightarrow v_1 = \\sqrt{gR} = \\sqrt{10 \\cdot 6{,}4\\cdot 10^6} = 8000\\text{ m/s} = 8{,}0\\text{ km/s}$.',
        points: 20
      },
      {
        id: '10c-p5',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        question: 'Con lắc đơn chiều dài $l$ kéo lệch góc $60^\\circ$ rồi thả nhẹ. Lực căng dây treo khi vật qua vị trí cân bằng bằng bao nhiêu lần trọng lượng $P = mg$?',
        options: ['$2\\text{ lần}$', '$3\\text{ lần}$', '$1{,}5\\text{ lần}$', '$2{,}5\\text{ lần}$'],
        correctIndex: 0,
        explanation: '$T = mg(3 - 2\\cos\\alpha_0) = mg(3 - 2\\cos 60^\\circ) = 2mg$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '10c-c1',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        question: 'Với mảng $A$ kích thước $N = 10^5$ và $Q = 10^5$ truy vấn tính tổng đoạn $[L, R]$, cấu trúc tối ưu $\\mathcal{O}(N + Q)$ là:',
        options: ['Mảng cộng dồn (Prefix Sum)', 'Hai vòng lặp lồng nhau', 'Bubble Sort', 'Đệ quy quay lui'],
        correctIndex: 0,
        explanation: 'Dựng `P[i] = P[i-1] + A[i]` trong $\\mathcal{O}(N)$, trả lời mỗi truy vấn trong $\\mathcal{O}(1)$ bằng `P[R] - P[L-1]`.',
        points: 20
      },
      {
        id: '10c-c2',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        question: 'Kĩ thuật Hai con trỏ (Two Pointers) tìm cặp $a_i + a_j = S$ trên mảng đã sắp xếp có độ phức tạp:',
        options: ['$\\mathcal{O}(N)$', '$\\mathcal{O}(N^2)$', '$\\mathcal{O}(N\\log N)$', '$\\mathcal{O}(\\log N)$'],
        correctIndex: 0,
        explanation: 'Con trỏ `l` chỉ tăng, `r` chỉ giảm, tổng số bước di chuyển không quá $N$.',
        points: 20
      },
      {
        id: '10c-c3',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        question: 'Để cập nhật cộng thêm giá trị $v$ cho mọi phần tử trong đoạn $[L, R]$ của mảng sau $Q$ thao tác rồi mới in kết quả, ta dùng:',
        options: ['Mảng hiệu (Difference Array)', 'Sàng nguyên tố', 'Merge Sort', 'DFS'],
        correctIndex: 0,
        explanation: 'Tăng `diff[L] += v` và `diff[R+1] -= v` tốn $\\mathcal{O}(1)$ mỗi thao tác, cuối cùng lấy tổng tiền tố.',
        points: 20
      },
      {
        id: '10c-c4',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        question: 'Thuật toán Kadane tìm tổng đoạn con liên tiếp lớn nhất có độ phức tạp thời gian là:',
        options: ['$\\mathcal{O}(N)$', '$\\mathcal{O}(N\\log N)$', '$\\mathcal{O}(N^2)$', '$\\mathcal{O}(2^N)$'],
        correctIndex: 0,
        explanation: 'Duy trì `cur = max(a[i], cur + a[i])` qua một lượt duyệt mảng.',
        points: 20
      },
      {
        id: '10c-c5',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        question: 'Trong ma trận cộng dồn 2D `S[i][j]`, tổng hình chữ nhật từ $(x_1, y_1)$ đến $(x_2, y_2)$ là:',
        options: [
          '`S[x2][y2] - S[x1-1][y2] - S[x2][y1-1] + S[x1-1][y1-1]`',
          '`S[x2][y2] - S[x1][y1]`',
          '`S[x2][y2] + S[x1-1][y1-1]`',
          '`S[x2][y2] - S[x1-1][y2] - S[x2][y1-1]`'
        ],
        correctIndex: 0,
        explanation: 'Áp dụng nguyên lý bù trừ (Inclusion-Exclusion) cho hình chữ nhật 2D.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 11 KHÔNG CHUYÊN ==========================
  '11k': {
    math: [
      {
        id: '11k-m1',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Nghiệm của phương trình lượng giác $\\sin x = \\frac{1}{2}$ là:',
        options: [
          '$x = \\frac{\\pi}{6} + k2\\pi$ hoặc $x = \\frac{5\\pi}{6} + k2\\pi$',
          '$x = \\pm \\frac{\\pi}{6} + k2\\pi$',
          '$x = \\frac{\\pi}{3} + k2\\pi$',
          '$x = \\frac{\\pi}{6} + k\\pi$'
        ],
        correctIndex: 0,
        explanation: '$\\sin x = \\sin\\frac{\\pi}{6} \\Leftrightarrow x = \\frac{\\pi}{6} + k2\\pi$ hoặc $x = \\pi - \\frac{\\pi}{6} + k2\\pi = \\frac{5\\pi}{6} + k2\\pi$.',
        points: 20
      },
      {
        id: '11k-m2',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Cho cấp số cộng $(u_n)$ có $u_1 = 3$ và công sai $d = 4$. Tổng $10$ số hạng đầu tiên $S_{10}$ bằng:',
        options: ['$210$', '$190$', '$230$', '$420$'],
        correctIndex: 0,
        explanation: '$S_{10} = \\frac{10(2\\cdot 3 + 9\\cdot 4)}{2} = 5 \\cdot 42 = 210$.',
        points: 20
      },
      {
        id: '11k-m3',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Giới hạn $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$ bằng:',
        options: ['$4$', '$0$', '$2$', '$+\\infty$'],
        correctIndex: 0,
        explanation: '$\\frac{x^2 - 4}{x - 2} = x + 2 \\to 4$ khi $x \\to 2$.',
        points: 20
      },
      {
        id: '11k-m4',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Đạo hàm của hàm số $y = \\sin(2x + 1)$ là:',
        options: ['$2\\cos(2x + 1)$', '$\\cos(2x + 1)$', '$-2\\cos(2x + 1)$', '$2\\sin(2x + 1)$'],
        correctIndex: 0,
        explanation: '$(\\sin u)\' = u\' \\cdot \\cos u = 2\\cos(2x + 1)$.',
        points: 20
      },
      {
        id: '11k-m5',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Tập nghiệm của bất phương trình $\\log_2(x - 1) < 3$ là:',
        options: ['$(1; 9)$', '$(-\\infty; 9)$', '$(1; 8)$', '$(0; 9)$'],
        correctIndex: 0,
        explanation: 'Điều kiện $x > 1$. Với cơ số $2 > 1$: $x - 1 < 2^3 = 8 \\Leftrightarrow x < 9$. Vậy $x \\in (1; 9)$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '11k-p1',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Một con lắc lò xo có độ cứng $k = 100\\text{ N/m}$ dao động điều hòa với biên độ $A = 4\\text{ cm}$. Cơ năng của con lắc là:',
        options: ['$0{,}08\\text{ J}$', '$0{,}8\\text{ J}$', '$800\\text{ J}$', '$0{,}04\\text{ J}$'],
        correctIndex: 0,
        explanation: 'Đổi $A = 0{,}04\\text{ m}$. $W = \\frac{1}{2}kA^2 = \\frac{1}{2}\\cdot 100 \\cdot (0{,}04)^2 = 0{,}08\\text{ J}$.',
        points: 20
      },
      {
        id: '11k-p2',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Một sóng cơ có tần số $f = 20\\text{ Hz}$ truyền với tốc độ $v = 4\\text{ m/s}$. Bước sóng $\\lambda$ bằng:',
        options: ['$0{,}2\\text{ m}$', '$5\\text{ m}$', '$80\\text{ m}$', '$0{,}5\\text{ m}$'],
        correctIndex: 0,
        explanation: '$\\lambda = \\frac{v}{f} = \\frac{4}{20} = 0{,}2\\text{ m}$.',
        points: 20
      },
      {
        id: '11k-p3',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Hai nguồn sóng kết hợp cùng pha có bước sóng $\\lambda = 2\\text{ cm}$. Điểm $M$ cách hai nguồn lần lượt $d_1 = 10\\text{ cm}, d_2 = 16\\text{ cm}$ thuộc:',
        options: ['Vân cực đại bậc $3$', 'Vân cực tiểu thứ $3$', 'Vân cực đại bậc $2$', 'Vân trung tâm'],
        correctIndex: 0,
        explanation: '$d_2 - d_1 = 6\\text{ cm} = 3\\lambda$, ứng với vân cực đại bậc $k = 3$.',
        points: 20
      },
      {
        id: '11k-p4',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Trong chân không, hai điện tích điểm $q_1 = q_2 = 2\\cdot 10^{-6}\\text{ C}$ đặt cách nhau $30\\text{ cm}$ đẩy nhau một lực bằng ($k = 9\\cdot 10^9$):',
        options: ['$0{,}4\\text{ N}$', '$0{,}12\\text{ N}$', '$4\\text{ N}$', '$1{,}2\\text{ N}$'],
        correctIndex: 0,
        explanation: '$F = \\frac{k|q_1 q_2|}{r^2} = \\frac{9\\cdot 10^9 \\cdot 4\\cdot 10^{-12}}{0{,}3^2} = 0{,}4\\text{ N}$.',
        points: 20
      },
      {
        id: '11k-p5',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Một tụ điện có điện dung $C = 5\\,\\mu\\text{F}$ được tích điện ở hiệu điện thế $U = 100\\text{ V}$. Năng lượng điện trường trong tụ bằng:',
        options: ['$0{,}025\\text{ J}$', '$0{,}05\\text{ J}$', '$2{,}5\\text{ J}$', '$0{,}25\\text{ J}$'],
        correctIndex: 0,
        explanation: '$W = \\frac{1}{2}CU^2 = \\frac{1}{2} \\cdot 5\\cdot 10^{-6} \\cdot 100^2 = 0{,}025\\text{ J}$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '11k-c1',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Độ phức tạp thời gian của thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng $N$ phần tử đã sắp xếp là:',
        options: ['$\\mathcal{O}(\\log N)$', '$\\mathcal{O}(N)$', '$\\mathcal{O}(N\\log N)$', '$\\mathcal{O}(N^2)$'],
        correctIndex: 0,
        explanation: 'Mỗi bước chia đôi khoảng tìm kiếm nên tối đa $\\lceil\\log_2 N\\rceil$ bước.',
        points: 20
      },
      {
        id: '11k-c2',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Trong cơ sở dữ liệu quan hệ, câu lệnh SQL nào dùng để lấy các bản ghi thỏa điều kiện?',
        options: ['`SELECT ... FROM ... WHERE ...`', '`INSERT INTO ...`', '`DROP TABLE ...`', '`ALTER TABLE ...`'],
        correctIndex: 0,
        explanation: '`SELECT ... FROM ... WHERE ...` là câu lệnh truy vấn dữ liệu chuẩn SQL.',
        points: 20
      },
      {
        id: '11k-c3',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Thuật toán sắp xếp nào dưới đây có độ phức tạp trung bình $\\mathcal{O}(N \\log N)$?',
        options: ['Merge Sort / Quick Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort'],
        correctIndex: 0,
        explanation: 'Merge Sort và Quick Sort áp dụng chia để trị nên có độ phức tạp trung bình $\\mathcal{O}(N\\log N)$.',
        points: 20
      },
      {
        id: '11k-c4',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Ngăn xếp (Stack) hoạt động theo nguyên tắc nào?',
        options: ['LIFO (Vào sau ra trước)', 'FIFO (Vào trước ra trước)', 'Ngẫu nhiên', 'Ưu tiên nhỏ nhất'],
        correctIndex: 0,
        explanation: 'Stack tuân theo Last-In First-Out (LIFO).',
        points: 20
      },
      {
        id: '11k-c5',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        question: 'Khóa chính (Primary Key) trong một bảng cơ sở dữ liệu quan hệ phải đảm bảo tính chất nào?',
        options: ['Duy nhất (Unique) và không NULL', 'Có thể trùng lặp', 'Bắt buộc là kiểu chuỗi', 'Cho phép rỗng (NULL)'],
        correctIndex: 0,
        explanation: 'Khóa chính xác định duy nhất mỗi dòng bản ghi nên không được trùng lặp và không được mang giá trị NULL.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 11 CHUYÊN ==========================
  '11c': {
    math: [
      {
        id: '11c-m1',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        question: 'Cho dãy số $(u_n)$ xác định bởi $u_1 = 2$ và $u_{n+1} = \\frac{1}{2}u_n + 3$ với mọi $n \\ge 1$. Giới hạn $\\lim u_n$ bằng:',
        options: ['$6$', '$3$', '$2$', '$4$'],
        correctIndex: 0,
        explanation: 'Đặt $v_n = u_n - 6 \\Rightarrow v_{n+1} = \\frac{1}{2}v_n \\to 0$ nên $\\lim u_n = 6$.',
        points: 20
      },
      {
        id: '11c-m2',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        question: 'Giới hạn $L = \\lim_{x \\to 0} \\frac{1 - \\cos 2x}{x^2}$ có giá trị bằng:',
        options: ['$2$', '$1$', '$4$', '$0$'],
        correctIndex: 0,
        explanation: '$1 - \\cos 2x = 2\\sin^2 x \\Rightarrow \\frac{2\\sin^2 x}{x^2} = 2\\left(\\frac{\\sin x}{x}\\right)^2 \\to 2$.',
        points: 20
      },
      {
        id: '11c-m3',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        question: 'Cho hình chóp $S.ABCD$ có đáy là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a\\sqrt{2}$. Khoảng cách từ $A$ đến mặt phẳng $(SBD)$ bằng:',
        options: ['$\\frac{a\\sqrt{10}}{5}$', '$\\frac{a\\sqrt{2}}{2}$', '$\\frac{a}{2}$', '$\\frac{a\\sqrt{3}}{3}$'],
        correctIndex: 0,
        explanation: 'Gọi $O = AC \\cap BD$, ta có $AO = \\frac{a\\sqrt{2}}{2}$. $\\frac{1}{d^2} = \\frac{1}{SA^2} + \\frac{1}{AO^2} = \\frac{1}{2a^2} + \\frac{2}{a^2} = \\frac{5}{2a^2} \\Rightarrow d = \\frac{a\\sqrt{10}}{5}$.',
        points: 20
      },
      {
        id: '11c-m4',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        question: 'Số nghiệm của phương trình $\\cos 2x + 3\\cos x + 2 = 0$ trên đoạn $[0; 2\\pi]$ là:',
        options: ['$3$', '$2$', '$4$', '$1$'],
        correctIndex: 0,
        explanation: '$2\\cos^2 x + 3\\cos x + 1 = 0 \\Leftrightarrow \\cos x = -1$ ($x = \\pi$) hoặc $\\cos x = -\\frac{1}{2}$ ($x = \\frac{2\\pi}{3}, \\frac{4\\pi}{3}$). Có $3$ nghiệm.',
        points: 20
      },
      {
        id: '11c-m5',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        question: 'Cho cấp số nhân lùi vô hạn có $u_1 = 4$ và tổng $S = 6$. Công bội $q$ bằng:',
        options: ['$\\frac{1}{3}$', '$\\frac{2}{3}$', '$\\frac{1}{2}$', '$-\\frac{1}{3}$'],
        correctIndex: 0,
        explanation: '$S = \\frac{u_1}{1 - q} = 6 \\Rightarrow 1 - q = \\frac{4}{6} = \\frac{2}{3} \\Rightarrow q = \\frac{1}{3}$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '11c-p1',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        question: 'Hai con lắc lò xo giống nhau có độ cứng $k$ gắn nối tiếp vào vật khối lượng $m$. Chu kì dao động của hệ là:',
        options: ['$T = 2\\pi\\sqrt{\\frac{2m}{k}}$', '$T = 2\\pi\\sqrt{\\frac{m}{2k}}$', '$T = 2\\pi\\sqrt{\\frac{m}{k}}$', '$T = 4\\pi\\sqrt{\\frac{m}{k}}$'],
        correctIndex: 0,
        explanation: 'Hai lò xo giống nhau mắc nối tiếp có độ cứng tương đương $k_{nt} = \\frac{k}{2} \\Rightarrow T = 2\\pi\\sqrt{\\frac{2m}{k}}$.',
        points: 20
      },
      {
        id: '11c-p2',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        question: 'Trên sợi dây dài $l = 1{,}2\\text{ m}$ hai đầu cố định có sóng dừng với $3$ bụng sóng, tần số $f = 50\\text{ Hz}$. Tốc độ truyền sóng trên dây là:',
        options: ['$40\\text{ m/s}$', '$20\\text{ m/s}$', '$60\\text{ m/s}$', '$30\\text{ m/s}$'],
        correctIndex: 0,
        explanation: '$l = 3\\frac{\\lambda}{2} \\Rightarrow \\lambda = \\frac{2l}{3} = 0{,}8\\text{ m} \\Rightarrow v = \\lambda f = 0{,}8 \\cdot 50 = 40\\text{ m/s}$.',
        points: 20
      },
      {
        id: '11c-p3',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        question: 'Tụ phẳng điện dung $C$ tích điện đến hiệu điện thế $U$ rồi **ngắt khỏi nguồn**. Nếu tăng khoảng cách hai bản tụ lên gấp đôi thì năng lượng tụ sẽ:',
        options: ['Tăng gấp $2$ lần', 'Giảm một nửa', 'Không đổi', 'Tăng gấp $4$ lần'],
        correctIndex: 0,
        explanation: 'Ngắt nguồn nên điện tích $Q$ không đổi. Khi $d$ tăng 2 lần thì $C$ giảm 2 lần. $W = \\frac{Q^2}{2C}$ tăng $2$ lần.',
        points: 20
      },
      {
        id: '11c-p4',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        question: 'Dao động điều hòa có đồ thị vận tốc - thời gian: tại $t=0$, vật có li độ $x = \\frac{A}{2}$ và đang chuyển động theo chiều âm. Pha ban đầu $\\varphi$ là:',
        options: ['$\\frac{\\pi}{3}$', '$-\\frac{\\pi}{3}$', '$\\frac{\\pi}{6}$', '$\\frac{2\\pi}{3}$'],
        correctIndex: 0,
        explanation: '$\\cos\\varphi = \\frac{1}{2}$ và $v < 0 \\Rightarrow \\sin\\varphi > 0 \\Rightarrow \\varphi = +\\frac{\\pi}{3}$.',
        points: 20
      },
      {
        id: '11c-p5',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        question: 'Cho nguồn điện có suất điện động $E = 12\\text{ V}$, điện trở trong $r = 1\\,\\Omega$ nối với điện trở ngoài $R = 5\\,\\Omega$. Hiệu suất của nguồn điện là:',
        options: ['$83{,}3\\%$', '$80\\%$', '$90\\%$', '$75\\%$'],
        correctIndex: 0,
        explanation: '$H = \\frac{R}{R + r} = \\frac{5}{6} \\approx 83{,}3\\%$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '11c-c1',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        question: 'Để tìm đường đi ngắn nhất theo số cạnh từ đỉnh $S$ trên đồ thị **không trọng số**, ta dùng:',
        options: ['BFS (Tìm kiếm theo chiều rộng)', 'DFS', 'Quicksort', 'Prim'],
        correctIndex: 0,
        explanation: 'BFS duyệt loang theo từng lớp khoảng cách tăng dần nên chạm mỗi đỉnh lần đầu theo đường đi ngắn nhất.',
        points: 20
      },
      {
        id: '11c-c2',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        question: 'Độ phức tạp của thuật toán Dijkstra sử dụng hàng đợi ưu tiên (`priority_queue`) trên đồ thị $(V, E)$ trọng số dương là:',
        options: ['$\\mathcal{O}((V + E)\\log V)$', '$\\mathcal{O}(V^3)$', '$\\mathcal{O}(V\\cdot E)$', '$\\mathcal{O}(V + E)$'],
        correctIndex: 0,
        explanation: 'Mỗi cạnh đẩy tối đa 1 lần vào heap nên chi phí là $\\mathcal{O}((V + E)\\log V)$.',
        points: 20
      },
      {
        id: '11c-c3',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        question: 'Bài toán Dãy con tăng dài nhất (LIS) có thể tối ưu bằng Binary Search đạt độ phức tạp:',
        options: ['$\\mathcal{O}(N\\log N)$', '$\\mathcal{O}(N^2)$', '$\\mathcal{O}(2^N)$', '$\\mathcal{O}(N\\sqrt{N})$'],
        correctIndex: 0,
        explanation: 'Duy trì mảng `tails` tăng ngặt và cập nhật bằng `lower_bound` trong $\\mathcal{O}(\\log N)$ mỗi phần tử.',
        points: 20
      },
      {
        id: '11c-c4',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        question: 'Trong bài toán Cái túi 0/1 (0/1 Knapsack) với $N$ đồ vật và sức chứa $W$, khi tối ưu bộ nhớ dùng mảng 1 chiều `dp[w]`, vòng lặp `w` phải duyệt:',
        options: ['Từ $W$ lùi về $w_i$', 'Từ $w_i$ tăng lên $W$', 'Từ $0$ đến $N$', 'Thứ tự nào cũng được'],
        correctIndex: 0,
        explanation: 'Duyệt ngược từ $W$ về $w_i$ đảm bảo mỗi đồ vật chỉ được chọn tối đa $1$ lần.',
        points: 20
      },
      {
        id: '11c-c5',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        question: 'Đồ thị vô hướng $G$ là đồ thị hai phía (Bipartite) khi và chỉ khi:',
        options: ['Không chứa chu trình có độ dài lẻ', 'Liên thông', 'Mọi đỉnh có bậc chẵn', 'Không có chu trình nào'],
        correctIndex: 0,
        explanation: 'Định lý König: Đồ thị tô được 2 màu kề khác nhau tương đương với việc không tồn tại chu trình lẻ.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 12 KHÔNG CHUYÊN ==========================
  '12k': {
    math: [
      {
        id: '12k-m1',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Hàm số $y = x^3 - 3x + 2$ đạt cực tiểu tại điểm nào sau đây?',
        options: ['$x = 1$', '$x = -1$', '$x = 0$', '$x = 2$'],
        correctIndex: 0,
        explanation: '$y\' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Vì $y\'\'(1) = 6 > 0$ nên $x = 1$ là điểm cực tiểu.',
        points: 20
      },
      {
        id: '12k-m2',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Tích phân $I = \\int_0^1 (3x^2 + 2x)\\,dx$ bằng bao nhiêu?',
        options: ['$2$', '$3$', '$1$', '$5$'],
        correctIndex: 0,
        explanation: 'Nguyên hàm $F(x) = x^3 + x^2 \\Rightarrow I = (1 + 1) - 0 = 2$.',
        points: 20
      },
      {
        id: '12k-m3',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Trong không gian $Oxyz$, mặt phẳng $(P): 2x - y + 3z - 5 = 0$ có một vectơ pháp tuyến là:',
        options: ['$\\vec{n} = (2; -1; 3)$', '$\\vec{n} = (2; 1; 3)$', '$\\vec{n} = (2; -1; -5)$', '$\\vec{n} = (-1; 3; -5)$'],
        correctIndex: 0,
        explanation: 'Mặt phẳng $Ax + By + Cz + D = 0$ có vectơ pháp tuyến $\\vec{n} = (A; B; C) = (2; -1; 3)$.',
        points: 20
      },
      {
        id: '12k-m4',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Cho hai biến cố $A, B$ có $P(B) = 0{,}5$ và $P(A \\cap B) = 0{,}2$. Xác suất có điều kiện $P(A \\mid B)$ bằng:',
        options: ['$0{,}4$', '$0{,}1$', '$0{,}7$', '$0{,}25$'],
        correctIndex: 0,
        explanation: '$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{0{,}2}{0{,}5} = 0{,}4$.',
        points: 20
      },
      {
        id: '12k-m5',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{2x - 1}{x + 3}$ là:',
        options: ['$y = 2$', '$x = -3$', '$y = -3$', '$y = -\\frac{1}{3}$'],
        correctIndex: 0,
        explanation: '$\\lim_{x \\to \\pm\\infty} \\frac{2x-1}{x+3} = 2$, suy ra tiệm cận ngang là $y = 2$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '12k-p1',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Đoạn mạch RLC nối tiếp có $R = 30\\,\\Omega$, $Z_L = 70\\,\\Omega$, $Z_C = 30\\,\\Omega$. Tổng trở $Z$ bằng:',
        options: ['$50\\,\\Omega$', '$70\\,\\Omega$', '$130\\,\\Omega$', '$40\\,\\Omega$'],
        correctIndex: 0,
        explanation: '$Z = \\sqrt{R^2 + (Z_L - Z_C)^2} = \\sqrt{30^2 + 40^2} = 50\\,\\Omega$.',
        points: 20
      },
      {
        id: '12k-p2',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Chất phóng xạ có chu kì bán rã $T = 10\\text{ ngày}$. Sau $t = 30\\text{ ngày}$, phần trăm số hạt nhân còn lại so với ban đầu là:',
        options: ['$12{,}5\\%$', '$25\\%$', '$33{,}3\\%$', '$87{,}5\\%$'],
        correctIndex: 0,
        explanation: '$N = N_0 2^{-t/T} = N_0 2^{-3} = 12{,}5\\%\\,N_0$.',
        points: 20
      },
      {
        id: '12k-p3',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Trong một quá trình đẳng nhiệt của lượng khí lí tưởng, áp suất tăng từ $2\\text{ atm}$ lên $6\\text{ atm}$. Thể tích khối khí sẽ:',
        options: ['Giảm $3$ lần', 'Tăng $3$ lần', 'Không đổi', 'Giảm $2$ lần'],
        correctIndex: 0,
        explanation: 'Định luật Boyle: $p_1 V_1 = p_2 V_2$. Áp suất tăng $3$ lần thì thể tích giảm $3$ lần.',
        points: 20
      },
      {
        id: '12k-p4',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Một dây dẫn dài $l = 0{,}5\\text{ m}$ mang dòng điện $I = 4\\text{ A}$ đặt vuông góc với đường sức từ trường đều $B = 0{,}2\\text{ T}$. Lực từ tác dụng lên dây là:',
        options: ['$0{,}4\\text{ N}$', '$4\\text{ N}$', '$0{,}2\\text{ N}$', '$0{,}8\\text{ N}$'],
        correctIndex: 0,
        explanation: '$F = BIl\\sin 90^\\circ = 0{,}2 \\cdot 4 \\cdot 0{,}5 = 0{,}4\\text{ N}$.',
        points: 20
      },
      {
        id: '12k-p5',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Truyền cho khối khí nhiệt lượng $Q = 100\\text{ J}$, khí thực hiện công $A = 40\\text{ J}$ đẩy pít-tông đi ra. Độ biến thiên nội năng $\\Delta U$ của khí là:',
        options: ['$60\\text{ J}$', '$140\\text{ J}$', '$-60\\text{ J}$', '$40\\text{ J}$'],
        correctIndex: 0,
        explanation: 'Nguyên lý I nhiệt động lực học: khí nhận nhiệt $Q = +100\\text{ J}$ và thực hiện công ($A\' = 40\\text{ J} \\Rightarrow A = -40\\text{ J}$), nên $\\Delta U = Q + A = 100 - 40 = 60\\text{ J}$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '12k-c1',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Trong mạng máy tính, thiết bị nào chuyển tiếp gói tin giữa các mạng khác nhau dựa trên địa chỉ IP?',
        options: ['Router (Bộ định tuyến)', 'Switch tầng 2', 'Hub', 'Repeater'],
        correctIndex: 0,
        explanation: 'Router hoạt động ở tầng Mạng (Layer 3), định tuyến gói tin dựa trên địa chỉ IP.',
        points: 20
      },
      {
        id: '12k-c2',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Trong HTML5, thẻ nào dùng để tạo siêu liên kết (hyperlink) tới một trang web khác?',
        options: ['`<a href="...">`', '`<link src="...">`', '`<href>...</href>`', '`<p url="...">`'],
        correctIndex: 0,
        explanation: 'Thẻ `<a>` kết hợp thuộc tính `href` tạo liên kết.',
        points: 20
      },
      {
        id: '12k-c3',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Trong CSS, thuộc tính nào làm thay đổi màu chữ của phần tử?',
        options: ['`color`', '`background-color`', '`font-color`', '`text-style`'],
        correctIndex: 0,
        explanation: 'Thuộc tính `color` đặt màu chữ.',
        points: 20
      },
      {
        id: '12k-c4',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Giao thức nào đảm nhiệm việc phân giải tên miền (ví dụ `synapse.edu`) thành địa chỉ IP?',
        options: ['DNS', 'HTTP', 'SMTP', 'FTP'],
        correctIndex: 0,
        explanation: 'DNS (Domain Name System) phân giải tên miền sang địa chỉ IP.',
        points: 20
      },
      {
        id: '12k-c5',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        question: 'Nhánh Trí tuệ nhân tạo (AI) cho phép máy tính học các quy luật từ dữ liệu mà không cần lập trình cứng từng bước gọi là:',
        options: ['Học máy (Machine Learning)', 'Dữ liệu lớn (Big Data)', 'Điện toán đám mây', 'Blockchain'],
        correctIndex: 0,
        explanation: 'Machine Learning là lĩnh vực giúp hệ thống tự rút trích quy luật từ tập dữ liệu.',
        points: 20
      }
    ]
  },

  // ========================== LỚP 12 CHUYÊN ==========================
  '12c': {
    math: [
      {
        id: '12c-m1',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        question: 'Cho hàm số $f(x)$ liên tục trên $\\mathbb{R}$ thỏa mãn $f(x) + f(-x) = \\sqrt{2 + 2\\cos 2x}$. Tích phân $\\int_{-\\pi/2}^{\\pi/2} f(x)\\,dx$ bằng:',
        options: ['$2$', '$4$', '$1$', '$\\pi$'],
        correctIndex: 0,
        explanation: 'Đặt $t=-x$, $2I = \\int_{-\\pi/2}^{\\pi/2} (f(x)+f(-x))\\,dx = \\int_{-\\pi/2}^{\\pi/2} 2|\\cos x|\\,dx = 4 \\Rightarrow I = 2$.',
        points: 20
      },
      {
        id: '12c-m2',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        question: 'Cho $f(x)$ có đạo hàm $f\'(x) = x(x-1)^2(x-3)$. Số điểm cực trị của hàm số $g(x) = f(x^2 - 2x)$ là:',
        options: ['$5$', '$3$', '$4$', '$2$'],
        correctIndex: 0,
        explanation: '$g\'(x) = (2x-2)f\'(x^2-2x)$. Các nghiệm bội lẻ: $x=1$; $x^2-2x=0 \\Rightarrow x=0, 2$; $x^2-2x=3 \\Rightarrow x=-1, 3$. Tổng cộng $5$ điểm cực trị.',
        points: 20
      },
      {
        id: '12c-m3',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        question: 'Trong không gian $Oxyz$, mặt cầu $(S): (x-1)^2 + (y+2)^2 + (z-3)^2 = 16$ cắt mặt phẳng $(P): 2x - 2y + z - 3 = 0$ theo đường tròn có bán kính $r$ bằng:',
        options: ['$2\\sqrt{3}$', '$4$', '$2$', '$\\sqrt{7}$'],
        correctIndex: 0,
        explanation: 'Tâm $I(1;-2;3)$, $R=4$. Khoảng cách $d(I,(P)) = \\frac{|2 + 4 + 3 - 3|}{\\sqrt{4+4+1}} = 2$. Vậy $r = \\sqrt{R^2 - d^2} = \\sqrt{16-4} = 2\\sqrt{3}$.',
        points: 20
      },
      {
        id: '12c-m4',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        question: 'Giá trị của tích phân $I = \\int_0^{\\pi/2} \\frac{\\sin 2x}{1 + \\cos^2 x}\\,dx$ bằng:',
        options: ['$\\ln 2$', '$2\\ln 2$', '$\\frac{1}{2}\\ln 2$', '$1$'],
        correctIndex: 0,
        explanation: 'Đặt $u = 1 + \\cos^2 x \\Rightarrow du = -2\\cos x\\sin x\\,dx = -\\sin 2x\\,dx$. Đổi cận $2 \\to 1$: $I = \\int_1^2 \\frac{du}{u} = \\ln 2$.',
        points: 20
      },
      {
        id: '12c-m5',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        question: 'Có bao nhiêu số nguyên $m \\in [-10; 10]$ để hàm số $y = \\frac{1}{3}x^3 - mx^2 + (m+2)x + 1$ đồng biến trên $\\mathbb{R}$?',
        options: ['$4$', '$3$', '$5$', '$2$'],
        correctIndex: 0,
        explanation: '$y\' = x^2 - 2mx + m + 2 \\ge 0\\,\\forall x \\Leftrightarrow \\Delta\' = m^2 - m - 2 \\le 0 \\Leftrightarrow -1 \\le m \\le 2$. Có $4$ giá trị nguyên: $-1, 0, 1, 2$.',
        points: 20
      }
    ],
    physics: [
      {
        id: '12c-p1',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        question: 'Đoạn mạch RLC nối tiếp đặt vào điện áp xoay chiều $u = U\\sqrt{2}\\cos(\\omega t)$. Thay đổi $L$ để $U_L$ đạt cực đại, giá trị $Z_L$ lúc đó là:',
        options: ['$Z_L = \\frac{R^2 + Z_C^2}{Z_C}$', '$Z_L = Z_C$', '$Z_L = \\sqrt{R^2 + Z_C^2}$', '$Z_L = 2Z_C$'],
        correctIndex: 0,
        explanation: 'Hệ quả cực trị RLC khi thay đổi $L$: $U_{L\\max}$ đạt được tại $Z_L = \\frac{R^2 + Z_C^2}{Z_C}$.',
        points: 20
      },
      {
        id: '12c-p2',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        question: 'Đoạn mạch RLC nối tiếp có $U = 100\\text{ V}$, thay đổi $C$ thấy khi $C = C_1$ hoặc $C = C_2$ thì mạch có cùng công suất và hai dòng điện lệch pha nhau $\\frac{\\pi}{3}$. Khi $C$ điều chỉnh để công suất cực đại, $P_{\\max}$ gấp mấy lần công suất ứng với $C_1$?',
        options: ['$\\frac{4}{3}$ lần', '$2$ lần', '$\\frac{2}{\\sqrt{3}}$ lần', '$\\frac{3}{2}$ lần'],
        correctIndex: 0,
        explanation: 'Hai giá trị cho cùng công suất có $|\\varphi_1| = |\\varphi_2| = \\frac{\\pi}{6} \\Rightarrow \\cos\\varphi_1 = \\frac{\\sqrt{3}}{2}$. Vậy $\\frac{P_{\\max}}{P_1} = \\frac{1}{\\cos^2\\varphi_1} = \\frac{4}{3}$.',
        points: 20
      },
      {
        id: '12c-p3',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        question: 'Một hạt electron bay vào từ trường đều $B$ theo phương vuông góc với $\\vec{B}$ với tốc độ $v$. Chu kì quay tròn của electron phụ thuộc như thế nào vào $v$?',
        options: ['Không phụ thuộc vào $v$', 'Tỉ lệ thuận với $v$', 'Tỉ lệ nghịch với $v$', 'Tỉ lệ với $v^2$'],
        correctIndex: 0,
        explanation: '$R = \\frac{mv}{|q|B} \\Rightarrow T = \\frac{2\\pi R}{v} = \\frac{2\\pi m}{|q|B}$, hoàn toàn độc lập với tốc độ $v$.',
        points: 20
      },
      {
        id: '12c-p4',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        question: 'Một lượng khí lí tưởng đơn nguyên tử thực hiện quá trình đẳng áp làm thể tích tăng gấp đôi. Tỉ số giữa nhiệt lượng nhận được $Q$ và độ biến thiên nội năng $\\Delta U$ là:',
        options: ['$\\frac{5}{3}$', '$\\frac{3}{2}$', '$\\frac{7}{5}$', '$2$'],
        correctIndex: 0,
        explanation: 'Khí đơn nguyên tử có $C_V = \\frac{3}{2}R, C_p = \\frac{5}{2}R$. Trong đẳng áp: $\\frac{Q}{\\Delta U} = \\frac{n C_p \\Delta T}{n C_V \\Delta T} = \\frac{5}{3}$.',
        points: 20
      },
      {
        id: '12c-p5',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        question: 'Mẫu phóng xạ ban đầu chứa hỗn hợp hai đồng vị A và B có số hạt như nhau và chu kì bán rã lần lượt $T_A = 2\\text{ h}, T_B = 4\\text{ h}$. Sau $t = 4\\text{ h}$, tỉ số số hạt còn lại $N_A / N_B$ bằng:',
        options: ['$0{,}5$', '$0{,}25$', '$2$', '$1$'],
        correctIndex: 0,
        explanation: '$\\frac{N_A}{N_B} = \\frac{2^{-4/2}}{2^{-4/4}} = \\frac{2^{-2}}{2^{-1}} = 2^{-1} = 0{,}5$.',
        points: 20
      }
    ],
    cs: [
      {
        id: '12c-c1',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        question: 'Cấu trúc dữ liệu Fenwick Tree (Binary Indexed Tree) hỗ trợ cập nhật điểm và tính tổng tiền tố trên mảng $N$ phần tử trong thời gian:',
        options: ['$\\mathcal{O}(\\log N)$', '$\\mathcal{O}(1)$', '$\\mathcal{O}(\\sqrt{N})$', '$\\mathcal{O}(N)$'],
        correctIndex: 0,
        explanation: 'Mỗi thao tác leo theo bit thấp nhất `i += i & -i` hoặc `i -= i & -i` tốn tối đa $\\log_2 N$ bước.',
        points: 20
      },
      {
        id: '12c-c2',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        question: 'Với $N = 18$, bài toán Hành trình người du lịch (TSP) dùng Quy hoạch động trạng thái bitmask có số trạng thái `dp[mask][u]` vào khoảng:',
        options: ['$18 \\cdot 2^{18}$', '$18!$', '$18^3$', '$2^{36}$'],
        correctIndex: 0,
        explanation: 'Có $2^N$ tập đỉnh đã thăm (`mask`) và $N$ đỉnh kết thúc (`u`), tổng số trạng thái là $N \\cdot 2^N$.',
        points: 20
      },
      {
        id: '12c-c3',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        question: 'Thuật toán KMP tìm kiếm xâu mẫu $P$ độ dài $M$ trong xâu $T$ độ dài $N$ chạy trong thời gian:',
        options: ['$\\mathcal{O}(N + M)$', '$\\mathcal{O}(N \\cdot M)$', '$\\mathcal{O}(N \\log M)$', '$\\mathcal{O}(M^2)$'],
        correctIndex: 0,
        explanation: 'Dựng hàm tiền tố $\\pi$ mất $\\mathcal{O}(M)$ và so khớp mất $\\mathcal{O}(N)$.',
        points: 20
      },
      {
        id: '12c-c4',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        question: 'Để cập nhật đồng loạt một đoạn $[L, R]$ và truy vấn đoạn $[u, v]$ trên Segment Tree trong $\\mathcal{O}(\\log N)$, ta kết hợp kĩ thuật nào?',
        options: ['Lazy Propagation', 'Sweep Line', 'Bitset', 'Two Pointers'],
        correctIndex: 0,
        explanation: 'Lazy Propagation trì hoãn đẩy giá trị cập nhật xuống các nút con cho tới khi thực sự cần truy cập.',
        points: 20
      },
      {
        id: '12c-c5',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        question: 'Trong thuật toán Disjoint Set Union (DSU), khi kết hợp Path Compression và Union by Rank/Size, độ phức tạp trung bình mỗi phép toán gần như:',
        options: ['$\\mathcal{O}(\\alpha(N)) \\approx \\mathcal{O}(1)$', '$\\mathcal{O}(N)$', '$\\mathcal{O}(\\log^2 N)$', '$\\mathcal{O}(\\sqrt{N})$'],
        correctIndex: 0,
        explanation: '$\alpha(N)$ là hàm Ackermann nghịch đảo, nhỏ hơn 5 với mọi giá trị $N$ thực tế.',
        points: 20
      }
    ]
  },

  // ========================== HSG & OLYMPIC ==========================
  olp: {
    math: [
      {
        id: 'olp-m1',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Theo Định lý nhỏ Fermat, số dư của $3^{100}$ khi chia cho số nguyên tố $101$ là:',
        options: ['$1$', '$3$', '$100$', '$0$'],
        correctIndex: 0,
        explanation: 'Vì $p = 101$ là số nguyên tố và $\\gcd(3, 101) = 1$, nên $3^{101 - 1} = 3^{100} \\equiv 1 \\pmod{101}$.',
        points: 20
      },
      {
        id: 'olp-m2',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Giá trị của hàm phi Euler $\\varphi(72)$ (số lượng số nguyên dương $\\le 72$ nguyên tố cùng nhau với $72$) là:',
        options: ['$24$', '$36$', '$18$', '$12$'],
        correctIndex: 0,
        explanation: '$72 = 2^3 \\cdot 3^2 \\Rightarrow \\varphi(72) = 72\\left(1 - \\frac{1}{2}\\right)\\left(1 - \\frac{1}{3}\\right) = 24$.',
        points: 20
      },
      {
        id: 'olp-m3',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Số nghiệm nguyên không âm của phương trình $x_1 + x_2 + x_3 + x_4 = 10$ là:',
        options: ['$286$', '$210$', '$220$', '$1000$'],
        correctIndex: 0,
        explanation: 'Áp dụng bài toán chia kẹo Euler (Stars and Bars): $C_{10 + 4 - 1}^{4 - 1} = C_{13}^3 = \\frac{13\\cdot 12\\cdot 11}{6} = 286$.',
        points: 20
      },
      {
        id: 'olp-m4',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Trong tam giác $ABC$, bán kính đường tròn ngoại tiếp $R$ và đường tròn nội tiếp $r$, khoảng cách $OI$ giữa tâm ngoại tiếp và nội tiếp thỏa mãn công thức Euler:',
        options: ['$OI^2 = R^2 - 2Rr$', '$OI^2 = R^2 + 2Rr$', '$OI^2 = 2R^2 - Rr$', '$OI = R - r$'],
        correctIndex: 0,
        explanation: 'Định lý Euler trong hình học phẳng: $d^2 = OI^2 = R(R - 2r)$.',
        points: 20
      },
      {
        id: 'olp-m5',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Cho đa thức hệ số thực $P(x)$ bậc $3$ thỏa mãn $P(1)=1, P(2)=4, P(3)=9, P(0)=-6$. Hệ số cao nhất của $P(x)$ là:',
        options: ['$1$', '$-1$', '$2$', '$-2$'],
        correctIndex: 0,
        explanation: 'Xét $Q(x) = P(x) - x^2 = a(x-1)(x-2)(x-3)$. Thay $x=0$: $Q(0) = -6 = -6a \\Rightarrow a = 1$.',
        points: 20
      }
    ],
    physics: [
      {
        id: 'olp-p1',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Một hình trụ đặc đồng chất lăn không trượt từ trạng thái nghỉ xuống mặt phẳng nghiêng góc $\\alpha$. Gia tốc tịnh tiến của khối tâm là:',
        options: ['$\\frac{2}{3}g\\sin\\alpha$', '$g\\sin\\alpha$', '$\\frac{1}{2}g\\sin\\alpha$', '$\\frac{5}{7}g\\sin\\alpha$'],
        correctIndex: 0,
        explanation: 'Hình trụ đặc có $I = \\frac{1}{2}mR^2$. Theo định luật bảo toàn năng lượng / động lực học vật rắn: $a = \\frac{g\\sin\\alpha}{1 + I/(mR^2)} = \\frac{2}{3}g\\sin\\alpha$.',
        points: 20
      },
      {
        id: 'olp-p2',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Một động cơ nhiệt lý tưởng chạy theo chu trình Carnot giữa hai nguồn nhiệt $T_1 = 600\\text{ K}$ và $T_2 = 300\\text{ K}$. Nếu nguồn nóng cung cấp $Q_1 = 1000\\text{ J}$, công sinh ra trong một chu trình là:',
        options: ['$500\\text{ J}$', '$600\\text{ J}$', '$300\\text{ J}$', '$250\\text{ J}$'],
        correctIndex: 0,
        explanation: 'Hiệu suất Carnot $H = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{600} = 0{,}5$. Công $A = H\\cdot Q_1 = 500\\text{ J}$.',
        points: 20
      },
      {
        id: 'olp-p3',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Thanh dẫn chiều dài $l$ quay đều với tốc độ góc $\\omega$ quanh một đầu cố định trong từ trường đều $\\vec{B}$ vuông góc mặt phẳng quay. Suất điện động cảm ứng giữa hai đầu thanh bằng:',
        options: ['$\\frac{1}{2}B\\omega l^2$', '$B\\omega l^2$', '$2B\\omega l^2$', '$\\frac{1}{3}B\\omega l^2$'],
        correctIndex: 0,
        explanation: '$e = \\int_0^l B (\\omega r)\\,dr = \\frac{1}{2}B\\omega l^2$.',
        points: 20
      },
      {
        id: 'olp-p4',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Một vật trượt không vận tốc đầu từ đỉnh bán cầu nhẵn bán kính $R$. Ở độ cao nào so với tâm cầu vật bắt đầu rời khỏi mặt bán cầu?',
        options: ['$\\frac{2}{3}R$', '$\\frac{1}{2}R$', '$\\frac{3}{4}R$', '$\\frac{\\sqrt{2}}{2}R$'],
        correctIndex: 0,
        explanation: 'Bảo toàn cơ năng $mg(R - R\\cos\\theta) = \\frac{1}{2}mv^2$ và điều kiện rời $N = mg\\cos\\theta - \\frac{mv^2}{R} = 0 \\Rightarrow \\cos\\theta = \\frac{2}{3} \\Rightarrow h = \\frac{2}{3}R$.',
        points: 20
      },
      {
        id: 'olp-p5',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Biến thiên Entropy $\\Delta S$ của $1\\text{ mol}$ khí lí tưởng giãn nở đẳng nhiệt thuận nghịch từ thể tích $V_1$ lên $2V_1$ là:',
        options: ['$R\\ln 2$', '$0$', '$2R$', '$\\frac{3}{2}R\\ln 2$'],
        correctIndex: 0,
        explanation: 'Trong giãn nở đẳng nhiệt thuận nghịch: $\\Delta S = \\frac{Q}{T} = nR\\ln\\frac{V_2}{V_1} = R\\ln 2$.',
        points: 20
      }
    ],
    cs: [
      {
        id: 'olp-c1',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Để tìm Tổ tiên chung gần nhất (LCA) của 2 đỉnh trên cây $N$ đỉnh cho $Q$ truy vấn online bằng Binary Lifting, thời gian tiền xử lý và truy vấn lần lượt là:',
        options: ['$\\mathcal{O}(N\\log N)$ và $\\mathcal{O}(\\log N)$', '$\\mathcal{O}(N)$ và $\\mathcal{O}(N)$', '$\\mathcal{O}(N^2)$ và $\\mathcal{O}(1)$', '$\\mathcal{O}(N)$ và $\\mathcal{O}(\\log^2 N)$'],
        correctIndex: 0,
        explanation: 'Bảng nhảy `up[u][k]` kích thước $N\\log N$ cho phép nhảy lũy thừa $2^k$ lên tổ tiên trong $\\mathcal{O}(\\log N)$.',
        points: 20
      },
      {
        id: 'olp-c2',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Thuật toán Tarjan tìm các Thành phần liên thông mạnh (SCC) trên đồ thị có hướng có độ phức tạp là:',
        options: ['$\\mathcal{O}(V + E)$', '$\\mathcal{O}(V\\cdot E)$', '$\\mathcal{O}((V+E)\\log V)$', '$\\mathcal{O}(V^2)$'],
        correctIndex: 0,
        explanation: 'Tarjan chỉ dùng 1 lượt DFS kết hợp mảng `tin`, `low` và `stack` nên mất $\\mathcal{O}(V + E)$.',
        points: 20
      },
      {
        id: 'olp-c3',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Công thức nhân ma trận chuyển trạng thái $T$ kích thước $k \\times k$ để tính số hạng thứ $N$ của dãy truy hồi tuyến tính ($N \\le 10^{18}$) đạt độ phức tạp:',
        options: ['$\\mathcal{O}(k^3 \\log N)$', '$\\mathcal{O}(k^2 N)$', '$\\mathcal{O}(N \\log k)$', '$\\mathcal{O}(k! \\log N)$'],
        correctIndex: 0,
        explanation: 'Nhân hai ma trận $k\\times k$ tốn $k^3$, dùng lũy thừa nhị phân tốn $\\log_2 N$ bước nhân.',
        points: 20
      },
      {
        id: 'olp-c4',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Kĩ thuật Bao lồi (Convex Hull Trick) tối ưu công thức DP dạng $dp[i] = \\min_{j < i}(a_j x_i + b_j)$ khi hệ số góc $a_j$ và $x_i$ đơn điệu giúp giảm độ phức tạp từ $\\mathcal{O}(N^2)$ xuống:',
        options: ['$\\mathcal{O}(N)$', '$\\mathcal{O}(N\\sqrt{N})$', '$\\mathcal{O}(N\\log^2 N)$', '$\\mathcal{O}(2^N)$'],
        correctIndex: 0,
        explanation: 'Dùng deque duy trì bao dưới các đường thẳng nên mỗi đường thêm và loại tối đa $1$ lần $\\Rightarrow \\mathcal{O}(N)$.',
        points: 20
      },
      {
        id: 'olp-c5',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Thuật toán Dinic tìm luồng cực đại (Max Flow) trên đồ thị tổng quát có cận trên độ phức tạp lý thuyết là:',
        options: ['$\\mathcal{O}(V^2 E)$', '$\\mathcal{O}(V \\cdot E^2)$', '$\\mathcal{O}(V + E)$', '$\\mathcal{O}(E \\log V)$'],
        correctIndex: 0,
        explanation: 'Dinic xây dựng đồ thị phân tầng bằng BFS và tìm luồng chặn bằng DFS, tổng cộng không quá $\\mathcal{O}(V^2 E)$.',
        points: 20
      }
    ]
  }
};

// =====================================================================
// CURATED ESSAY PROMPTS BY DIVISION & SUBJECT (2 PER DIVISION x SUBJECT)
// =====================================================================
const DEFAULT_CPP_STARTER = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // Viết lời giải tại đây...
    return 0;
}`;

const DEFAULT_PY_STARTER = `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Viết lời giải tại đây...

if __name__ == '__main__':
    solve()
`;

export const ARENA_DIVISION_ESSAY_BANK: Record<
  ArenaDivisionId,
  Record<ArenaSubject, ArenaEssayPrompt[]>
> = {
  '9k': {
    math: [
      {
        id: 'e-9k-m1',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        title: 'Phương trình bậc hai & Định lí Vi-ét ôn thi vào 10',
        prompt:
          'Cho phương trình $x^2 - 2(m+1)x + m^2 + 2 = 0$ ($m$ là tham số).\n1. Tìm điều kiện của $m$ để phương trình có hai nghiệm phân biệt $x_1, x_2$.\n2. Tìm giá trị của $m$ để $x_1^2 + x_2^2 = 10$.',
        rubricChecklist: [
          'Tính đúng $\\Delta\' = (m+1)^2 - (m^2+2) = 2m - 1$ (25 điểm)',
          'Giải điều kiện $\\Delta\' > 0 \\Leftrightarrow m > \\frac{1}{2}$ (20 điểm)',
          'Viết đúng $x_1 + x_2 = 2(m+1), x_1 x_2 = m^2 + 2$ (20 điểm)',
          'Biến đổi $x_1^2+x_2^2 = 2m^2 + 8m = 10$ và chọn $m = 1$ (loại $m = -5$) (35 điểm)'
        ],
        referenceSolution:
          '$\\Delta\' = 2m - 1 > 0 \\Leftrightarrow m > \\frac{1}{2}$. Theo Vi-ét: $x_1^2+x_2^2 = 4(m+1)^2 - 2(m^2+2) = 2m^2+8m = 10 \\Leftrightarrow m^2+4m-5=0 \\Leftrightarrow m=1$ (TM) hoặc $m=-5$ (Loại). Vậy $m=1$.',
        maxScore: 100
      },
      {
        id: 'e-9k-m2',
        subject: 'math',
        grade: 'Lớp 9 · Không Chuyên',
        title: 'Giải bài toán bằng cách lập hệ phương trình',
        prompt:
          'Hai đội công nhân cùng làm một công việc thì hoàn thành sau $12$ giờ. Nếu đội I làm một mình trong $4$ giờ rồi nghỉ, đội II làm tiếp một mình trong $6$ giờ thì cả hai đội làm được $\\frac{2}{5}$ công việc. Hỏi mỗi đội làm một mình thì bao lâu xong công việc?',
        rubricChecklist: [
          'Đặt ẩn $x, y > 12$ là thời gian mỗi đội làm riêng xong việc (20 điểm)',
          'Lập đúng hệ phương trình $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}$ và $\\frac{4}{x} + \\frac{6}{y} = \\frac{2}{5}$ (40 điểm)',
          'Giải đúng $\\frac{1}{x} = \\frac{1}{20}, \\frac{1}{y} = \\frac{1}{30}$ (25 điểm)',
          'Kết luận đội I: $20$ giờ, đội II: $30$ giờ (15 điểm)'
        ],
        referenceSolution:
          'Gọi $x, y$ ($>12$) là số giờ mỗi đội làm một mình xong việc. Hệ: $\\frac{1}{x} + \\frac{1}{y} = \\frac{1}{12}$ và $\\frac{4}{x} + \\frac{6}{y} = \\frac{2}{5}$. Giải ra $x = 20$ giờ, $y = 30$ giờ.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-9k-p1',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        title: 'Phân tích mạch hỗn hợp & Công suất tỏa nhiệt',
        prompt:
          'Cho mạch điện gồm điện trở $R_1 = 6\\,\\Omega$ mắc nối tiếp với cụm hai điện trở $R_2 = 12\\,\\Omega$ và $R_3 = 4\\,\\Omega$ mắc song song. Đặt vào hai đầu đoạn mạch hiệu điện thế không đổi $U = 18\\text{ V}$.\n1. Tính điện trở tương đương toàn mạch và cường độ dòng điện qua mạch chính.\n2. Tính hiệu điện thế hai đầu $R_2$ và công suất tỏa nhiệt trên $R_1$.',
        rubricChecklist: [
          'Tính $R_{23} = 3\\,\\Omega$ và $R_{tđ} = 9\\,\\Omega$ (35 điểm)',
          'Tính dòng mạch chính $I = 2\\text{ A}$ (25 điểm)',
          'Tính $U_2 = U_{23} = 6\\text{ V}$ (20 điểm)',
          'Tính $P_1 = I^2 R_1 = 24\\text{ W}$ (20 điểm)'
        ],
        referenceSolution:
          '$R_{23} = \\frac{12\\cdot 4}{12+4} = 3\\,\\Omega \\Rightarrow R_{tđ} = 6 + 3 = 9\\,\\Omega$. $I = \\frac{18}{9} = 2\\text{ A}$. $U_2 = I\\cdot R_{23} = 6\\text{ V}$. $P_1 = 2^2 \\cdot 6 = 24\\text{ W}$.',
        maxScore: 100
      },
      {
        id: 'e-9k-p2',
        subject: 'physics',
        grade: 'Lớp 9 · Không Chuyên',
        title: 'Bài toán thấu kính hội tụ & tính chất ảnh',
        prompt:
          'Một vật sáng $AB$ cao $h = 2\\text{ cm}$ đặt vuông góc trục chính của một thấu kính hội tụ tiêu cự $f = 12\\text{ cm}$, cách thấu kính $d = 18\\text{ cm}$.\n1. Xác định vị trí, tính chất ảnh $A\'B\'$.\n2. Tính chiều cao $h\'$ của ảnh.',
        rubricChecklist: [
          'Áp dụng đúng công thức $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$ (35 điểm)',
          'Tính ra $d\' = 36\\text{ cm}$ và kết luận ảnh thật ngược chiều (35 điểm)',
          'Tính đúng $h\' = h\\cdot \\frac{d\'}{d} = 4\\text{ cm}$ (30 điểm)'
        ],
        referenceSolution:
          '$\\frac{1}{d\'} = \\frac{1}{12} - \\frac{1}{18} = \\frac{1}{36} \\Rightarrow d\' = 36\\text{ cm}$ (ảnh thật, ngược chiều vật). Chiều cao ảnh $h\' = 2 \\cdot \\frac{36}{18} = 4\\text{ cm}$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-9k-c1',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        title: 'Tính tổng các số chẵn trong mảng số nguyên',
        prompt:
          'Cho số nguyên $N$ ($1 \\le N \\le 10^5$) và dãy $N$ số nguyên $A_1, A_2, \\dots, A_N$ ($|A_i| \\le 10^9$).\nViết chương trình C++ hoặc Python tính và in ra **tổng các phần tử có giá trị chẵn** trong dãy.',
        rubricChecklist: [
          'Đọc đúng $N$ và mảng $A$ (25 điểm)',
          'Kiểm tra số chẵn bằng `a[i] % 2 == 0` (25 điểm)',
          'Dùng kiểu `long long` trong C++ để tránh tràn số (25 điểm)',
          'Chạy đúng các test mẫu với $\\mathcal{O}(N)$ (25 điểm)'
        ],
        referenceSolution:
          'Duyệt qua từng phần tử, nếu `x % 2 == 0` thì cộng vào biến tổng kiểu 64-bit `long long` rồi in ra.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '5\n1 2 3 4 5', expectedOutput: '6' },
            { input: '4\n-2 7 10 3', expectedOutput: '8' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-9k-c2',
        subject: 'cs',
        grade: 'Lớp 9 · Không Chuyên',
        title: 'Tìm phần tử lớn nhất và số lần xuất hiện',
        prompt:
          'Cho mảng $N$ số nguyên ($1 \\le N \\le 10^5$). Hãy viết chương trình tìm giá trị lớn nhất $M$ trong mảng (in ra $M$).',
        rubricChecklist: [
          'Khởi tạo `mx = a[0]` đúng cả khi toàn số âm (35 điểm)',
          'Duyệt $i = 1..n-1$ cập nhật `mx = max(mx, a[i])` (40 điểm)',
          'Xuất kết quả đúng định dạng (25 điểm)'
        ],
        referenceSolution: 'Khởi tạo `mx = a[0]`, duyệt qua các phần tử còn lại và cập nhật `mx = max(mx, a[i])`.',
        sampleCode: {
          language: 'python',
          starter: DEFAULT_PY_STARTER,
          tests: [
            { input: '5\n3 9 2 9 4', expectedOutput: '9' },
            { input: '3\n-10 -4 -7', expectedOutput: '-4' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  '9c': {
    math: [
      {
        id: 'e-9c-m1',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        title: 'Chứng minh bất đẳng thức & Tìm GTNN (Thi Chuyên vào 10)',
        prompt:
          'Cho các số thực dương $a, b, c$ thỏa mãn $a + b + c = 3$.\nChứng minh rằng: $\\frac{a}{1 + b^2} + \\frac{b}{1 + c^2} + \\frac{c}{1 + a^2} \\ge \\frac{3}{2}$.',
        rubricChecklist: [
          'Áp dụng kĩ thuật Cauchy ngược dấu: $\\frac{a}{1+b^2} = a - \\frac{ab^2}{1+b^2}$ (35 điểm)',
          'Đánh giá $1 + b^2 \\ge 2b \\Rightarrow \\frac{ab^2}{1+b^2} \\le \\frac{ab}{2}$ (30 điểm)',
          'Cộng vế và dùng $ab + bc + ca \\le \\frac{(a+b+c)^2}{3} = 3$ để suy ra đpcm (35 điểm)'
        ],
        referenceSolution:
          'Ta có $\\frac{a}{1+b^2} = a - \\frac{ab^2}{1+b^2} \\ge a - \\frac{ab^2}{2b} = a - \\frac{ab}{2}$. Cộng ba bất đẳng thức: $VT \\ge (a+b+c) - \\frac{ab+bc+ca}{2} \\ge 3 - \\frac{3}{2} = \\frac{3}{2}$. Dấu bằng khi $a=b=c=1$.',
        maxScore: 100
      },
      {
        id: 'e-9c-m2',
        subject: 'math',
        grade: 'Lớp 9 · Chuyên',
        title: 'Phương trình nghiệm nguyên nâng cao',
        prompt: 'Tìm tất cả các cặp số nguyên $(x; y)$ thỏa mãn phương trình $x^2 + 2y^2 + 2xy - 2x - 4y + 2 = 0$.',
        rubricChecklist: [
          'Nhóm hằng đẳng thức $(x + y - 1)^2 + (y - 1)^2 = 0$ (50 điểm)',
          'Suy ra $y - 1 = 0$ và $x + y - 1 = 0$ (30 điểm)',
          'Kết luận nghiệm duy nhất $(x; y) = (0; 1)$ (20 điểm)'
        ],
        referenceSolution:
          'Biến đổi $(x^2 + 2xy + y^2 - 2x - 2y + 1) + (y^2 - 2y + 1) = 0 \\Leftrightarrow (x + y - 1)^2 + (y - 1)^2 = 0 \\Leftrightarrow y = 1, x = 0$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-9c-p1',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        title: 'Cân bằng nhiệt có sự chuyển thể (Nước đá tan)',
        prompt:
          'Thả một cục nước đá khối lượng $m_1 = 0{,}2\\text{ kg}$ ở $0^\\circ\\text{C}$ vào một bình chứa $m_2 = 0{,}8\\text{ kg}$ nước ở $30^\\circ\\text{C}$. Biết nhiệt dung riêng của nước $c = 4200\\text{ J/(kg.K)}$ và nhiệt nóng chảy riêng của nước đá $\\lambda = 3{,}36\\cdot 10^5\\text{ J/kg}$.\n1. Nước đá có tan hết không? Chứng minh bằng tính toán.\n2. Tìm nhiệt độ cân bằng của hỗn hợp.',
        rubricChecklist: [
          'Tính nhiệt lượng cần để làm tan hết đá: $Q_1 = m_1\\lambda = 67200\\text{ J}$ (30 điểm)',
          'Tính nhiệt lượng tối đa nước tỏa ra khi hạ về $0^\\circ\\text{C}$: $Q_2 = m_2 c \\cdot 30 = 100800\\text{ J} > Q_1$ (30 điểm)',
          'Lập PT cân bằng nhiệt $67200 + 0{,}2\\cdot 4200\\cdot t = 0{,}8\\cdot 4200\\cdot(30 - t)$ và giải đúng $t = 8^\\circ\\text{C}$ (40 điểm)'
        ],
        referenceSolution:
          '$Q_{\\text{tan}} = 0{,}2 \\cdot 336000 = 67200\\text{ J} < Q_{\\text{tỏa max}} = 0{,}8 \\cdot 4200 \\cdot 30 = 100800\\text{ J}$, nên đá tan hết. Phương trình cân bằng: $67200 + 840t = 3360(30 - t) \\Rightarrow 4200t = 33600 \\Rightarrow t = 8^\\circ\\text{C}$.',
        maxScore: 100
      },
      {
        id: 'e-9c-p2',
        subject: 'physics',
        grade: 'Lớp 9 · Chuyên',
        title: 'Tìm biến trở để công suất mạch ngoài cực đại',
        prompt:
          'Cho nguồn điện $U = 24\\text{ V}$ mắc nối tiếp với điện trở cố định $R_0 = 3\\,\\Omega$ và cụm song song gồm $R_1 = 6\\,\\Omega$ và biến trở $R_x$.\n1. Tính $R_x$ để công suất tiêu thụ trên cụm song song đạt cực đại.\n2. Tính công suất cực đại đó.',
        rubricChecklist: [
          'Đặt $R_{1x} = \\frac{6 R_x}{6 + R_x}$ và viết $P_{1x} = \\frac{U^2 R_{1x}}{(R_0 + R_{1x})^2}$ (35 điểm)',
          'Chứng minh $P_{1x}$ cực đại khi $R_{1x} = R_0 = 3\\,\\Omega \\Rightarrow R_x = 6\\,\\Omega$ (35 điểm)',
          'Tính đúng $P_{\\max} = \\frac{U^2}{4 R_0} = 48\\text{ W}$ (30 điểm)'
        ],
        referenceSolution:
          '$P_{1x} = \\frac{U^2 R_{1x}}{(R_0 + R_{1x})^2} \\le \\frac{U^2}{4R_0} = \\frac{576}{12} = 48\\text{ W}$. Dấu bằng khi $\\frac{6R_x}{6+R_x} = 3 \\Rightarrow R_x = 6\\,\\Omega$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-9c-c1',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        title: 'Đếm số lượng số nguyên tố trong mảng bằng Sàng Eratosthenes',
        prompt:
          'Cho $N$ ($1 \\le N \\le 10^5$) và dãy $N$ số nguyên dương $A_i \\le 10^6$. Viết chương trình đếm xem trong mảng có bao nhiêu số nguyên tố.',
        rubricChecklist: [
          'Xây dựng Sàng Eratosthenes tới $10^6$ trong $\\mathcal{O}(M\\log\\log M)$ (45 điểm)',
          'Đánh dấu đúng `0` và `1` không phải số nguyên tố (25 điểm)',
          'Đọc mảng và đếm đúng tất cả bộ test (30 điểm)'
        ],
        referenceSolution:
          'Dùng mảng `isPrime` kích thước $10^6 + 1$ sàng từ $2$ đến $\\sqrt{10^6}$, sau đó duyệt mảng $A$ và tăng biến đếm nếu `isPrime[a[i]]`.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '6\n1 2 3 4 5 9', expectedOutput: '3' },
            { input: '4\n7 11 13 17', expectedOutput: '4' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-9c-c2',
        subject: 'cs',
        grade: 'Lớp 9 · Chuyên',
        title: 'Tìm Ước chung lớn nhất của toàn bộ dãy số',
        prompt:
          'Cho $N$ số nguyên dương ($1 \\le N \\le 10^5, 1 \\le A_i \\le 10^9$). Hãy viết chương trình tìm ước chung lớn nhất $\\gcd(A_1, A_2, \\dots, A_N)$.',
        rubricChecklist: [
          'Cài đặt đúng thuật toán Euclid `gcd(a, b)` (40 điểm)',
          'Duyệt `g = gcd(g, a[i])` qua toàn bộ mảng trong $\\mathcal{O}(N \\log A_{\\max})$ (35 điểm)',
          'Chạy chính xác mọi test (25 điểm)'
        ],
        referenceSolution: 'Khởi tạo `g = a[0]`, với mỗi `a[i]` cập nhật `g = gcd(g, a[i])` bằng thuật toán Euclid.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '4\n12 18 24 30', expectedOutput: '6' },
            { input: '3\n7 14 25', expectedOutput: '1' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== LỚP 10 KHÔNG CHUYÊN ==========================
  '10k': {
    math: [
      {
        id: 'e-10k-m1',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        title: 'Tam thức bậc hai & Điều kiện vô nghiệm',
        prompt:
          'Tìm tất cả các giá trị thực của tham số $m$ để bất phương trình $x^2 - 2mx + m + 6 > 0$ nghiệm đúng với mọi $x \\in \\mathbb{R}$.',
        rubricChecklist: [
          'Nhận xét hệ số $a = 1 > 0$ (25 điểm)',
          'Áp dụng điều kiện $\\Delta\' < 0 \\Leftrightarrow m^2 - m - 6 < 0$ (40 điểm)',
          'Giải đúng $-2 < m < 3$ (35 điểm)'
        ],
        referenceSolution: 'Vì $a=1>0$, tam thức dương với mọi $x$ khi và chỉ khi $\\Delta\' = m^2 - (m+6) < 0 \\Leftrightarrow -2 < m < 3$.',
        maxScore: 100
      },
      {
        id: 'e-10k-m2',
        subject: 'math',
        grade: 'Lớp 10 · Không Chuyên',
        title: 'Hệ thức lượng trong tam giác',
        prompt:
          'Cho tam giác $ABC$ có $AB = 6, AC = 10, \\widehat{BAC} = 120^\\circ$.\n1. Tính độ dài cạnh $BC$.\n2. Tính diện tích tam giác $ABC$ và bán kính đường tròn ngoại tiếp $R$.',
        rubricChecklist: [
          'Áp dụng định lí Côsin tính đúng $BC = 14$ (40 điểm)',
          'Tính diện tích $S = \\frac{1}{2}AB\\cdot AC\\sin 120^\\circ = 15\\sqrt{3}$ (30 điểm)',
          'Tính $R = \\frac{BC}{2\\sin 120^\\circ} = \\frac{14\\sqrt{3}}{3}$ (30 điểm)'
        ],
        referenceSolution: '$BC^2 = 36 + 100 - 2\\cdot 6\\cdot 10\\cdot(-\\frac{1}{2}) = 196 \\Rightarrow BC = 14$. $S = 15\\sqrt{3}$, $R = \\frac{14}{\\sqrt{3}} = \\frac{14\\sqrt{3}}{3}$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-10k-p1',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        title: 'Bảo toàn cơ năng vật ném thẳng đứng',
        prompt:
          'Một vật có khối lượng $m = 0{,}5\\text{ kg}$ được ném thẳng đứng lên cao từ mặt đất với vận tốc ban đầu $v_0 = 20\\text{ m/s}$, lấy $g = 10\\text{ m/s}^2$ (bỏ qua lực cản). Chọn gốc thế năng tại mặt đất.\n1. Tính cơ năng và độ cao cực đại $h_{\\max}$.\n2. Ở độ cao nào thì thế năng bằng 3 lần động năng ($W_t = 3W_đ$)?',
        rubricChecklist: [
          'Tính đúng cơ năng $W = \\frac{1}{2}mv_0^2 = 100\\text{ J}$ (30 điểm)',
          'Suy ra $h_{\\max} = 20\\text{ m}$ (35 điểm)',
          'Giải $W_t = 3W_đ \\Rightarrow W = \\frac{4}{3}mgh \\Rightarrow h = 15\\text{ m}$ (35 điểm)'
        ],
        referenceSolution: '$W = 100\\text{ J}$, $h_{\\max} = 20\\text{ m}$. Khi $W_t = 3W_đ \\Rightarrow h = \\frac{3}{4}h_{\\max} = 15\\text{ m}$.',
        maxScore: 100
      },
      {
        id: 'e-10k-p2',
        subject: 'physics',
        grade: 'Lớp 10 · Không Chuyên',
        title: 'Định luật II Newton & Lực ma sát trượt',
        prompt:
          'Một vật khối lượng $m = 5\\text{ kg}$ đặt trên mặt sàn nằm ngang, hệ số ma sát trượt $\\mu = 0{,}2$, lấy $g = 10\\text{ m/s}^2$. Tác dụng lực kéo ngang $F = 20\\text{ N}$.\n1. Tính gia tốc của vật.\n2. Tính quãng đường vật đi được sau $4\\text{ s}$ kể từ lúc đứng yên.',
        rubricChecklist: [
          'Tính lực ma sát $F_{ms} = \\mu mg = 10\\text{ N}$ (30 điểm)',
          'Áp dụng $a = \\frac{F - F_{ms}}{m} = 2\\text{ m/s}^2$ (40 điểm)',
          'Tính quãng đường $s = \\frac{1}{2}at^2 = 16\\text{ m}$ (30 điểm)'
        ],
        referenceSolution: '$F_{ms} = 0{,}2 \\cdot 5 \\cdot 10 = 10\\text{ N}$. $a = \\frac{20 - 10}{5} = 2\\text{ m/s}^2$. $s = 0{,}5 \\cdot 2 \\cdot 16 = 16\\text{ m}$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-10k-c1',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        title: 'Đếm số phần tử lớn hơn giá trị trung bình',
        prompt:
          'Cho $N$ số nguyên ($1 \\le N \\le 10^5$). Hãy đếm có bao nhiêu phần tử trong mảng lớn hơn hẳn giá trị trung bình cộng của cả mảng.',
        rubricChecklist: [
          'Tính tổng `sum` bằng kiểu `long long` (35 điểm)',
          'Kiểm tra `a[i] * n > sum` tránh sai số chia số thực (40 điểm)',
          'Chạy đúng các bộ test (25 điểm)'
        ],
        referenceSolution: 'Dùng điều kiện `a[i] * n > sum` thay vì chia thực để đạt độ chính xác tuyệt đối.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '5\n1 2 3 4 5', expectedOutput: '2' },
            { input: '4\n10 10 10 10', expectedOutput: '0' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-10k-c2',
        subject: 'cs',
        grade: 'Lớp 10 · Không Chuyên',
        title: 'Tính tổng các chữ số của từng phần tử',
        prompt: 'Cho số nguyên $N$ và $N$ số nguyên không âm. In ra tổng tất cả phần tử của mảng.',
        rubricChecklist: [
          'Đọc đúng input (30 điểm)',
          'Cộng dồn chuẩn xác (40 điểm)',
          'Đảm bảo kiểu 64-bit (30 điểm)'
        ],
        referenceSolution: 'Duyệt qua toàn bộ phần tử và cộng dồn vào biến tổng.',
        sampleCode: {
          language: 'python',
          starter: DEFAULT_PY_STARTER,
          tests: [
            { input: '4\n10 20 30 40', expectedOutput: '100' },
            { input: '3\n5 15 25', expectedOutput: '45' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== LỚP 10 CHUYÊN ==========================
  '10c': {
    math: [
      {
        id: 'e-10c-m1',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        title: 'Bất đẳng thức Cauchy-Schwarz dạng Engel',
        prompt:
          'Cho $a, b, c > 0$ thỏa mãn $a + b + c = 3$. Tìm giá trị nhỏ nhất của biểu thức:\n$P = \\frac{a^2}{b+c} + \\frac{b^2}{c+a} + \\frac{c^2}{a+b}$.',
        rubricChecklist: [
          'Áp dụng BĐT Cauchy-Schwarz dạng cộng mẫu (Engel): $P \\ge \\frac{(a+b+c)^2}{2(a+b+c)}$ (50 điểm)',
          'Thay $a+b+c=3$ rút gọn ra $\\frac{3}{2}$ (30 điểm)',
          'Chỉ ra dấu bằng đạt tại $a = b = c = 1$ (20 điểm)'
        ],
        referenceSolution: 'Theo Cauchy-Schwarz: $P \\ge \\frac{(a+b+c)^2}{2(a+b+c)} = \\frac{a+b+c}{2} = \\frac{3}{2}$. Dấu bằng tại $a=b=c=1$.',
        maxScore: 100
      },
      {
        id: 'e-10c-m2',
        subject: 'math',
        grade: 'Lớp 10 · Chuyên',
        title: 'Quỹ tích & Tích vô hướng vectơ',
        prompt:
          'Cho tam giác đều $ABC$ cạnh $a$. Tìm tập hợp điểm $M$ trong mặt phẳng thỏa mãn $MA^2 + MB^2 = 2MC^2$.',
        rubricChecklist: [
          'Gọi $I$ là trung điểm $AB$, biến đổi $MA^2 + MB^2 = 2MI^2 + \\frac{AB^2}{2}$ (40 điểm)',
          'Đưa về hiệu bình phương $\\vec{MC}^2 - \\vec{MI}^2 = \\vec{IC} \\cdot (\\vec{MC} + \\vec{MI}) = \\frac{a^2}{4}$ (40 điểm)',
          'Kết luận quỹ tích là một đường thẳng vuông góc $CI$ (20 điểm)'
        ],
        referenceSolution: 'Dùng trung điểm $I$ của $AB$ và trung điểm $K$ của $IC$, rút ra $\\vec{KM}\\cdot \\vec{IC} = \\text{const}$, nên quỹ tích là đường thẳng vuông góc trung tuyến $CI$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-10c-p1',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        title: 'Hệ vật liên kết ròng rọc có ma sát',
        prompt:
          'Vật $m_1 = 3\\text{ kg}$ đặt trên mặt bàn ngang hệ số ma sát $\\mu = 0{,}2$, nối qua ròng rọc nhẹ không ma sát với vật $m_2 = 2\\text{ kg}$ treo thẳng đứng ($g = 10\\text{ m/s}^2$).\n1. Tính gia tốc của hệ hai vật.\n2. Tính lực căng dây nối và lực nén lên trục ròng rọc.',
        rubricChecklist: [
          'Viết đúng phương trình định luật II Newton cho $m_1$ và $m_2$ (40 điểm)',
          'Tính gia tốc $a = \\frac{m_2 g - \\mu m_1 g}{m_1 + m_2} = 2{,}8\\text{ m/s}^2$ (30 điểm)',
          'Tính $T = 14{,}4\\text{ N}$ và $F_{\\text{nén}} = T\\sqrt{2} \\approx 20{,}36\\text{ N}$ (30 điểm)'
        ],
        referenceSolution: '$a = \\frac{20 - 6}{5} = 2{,}8\\text{ m/s}^2$. $T = m_2(g - a) = 2(10 - 2{,}8) = 14{,}4\\text{ N}$. Lực nén ròng rọc $F = T\\sqrt{2} \\approx 20{,}36\\text{ N}$.',
        maxScore: 100
      },
      {
        id: 'e-10c-p2',
        subject: 'physics',
        grade: 'Lớp 10 · Chuyên',
        title: 'Va chạm không đàn hồi kết hợp dao động con lắc',
        prompt:
          'Viên đạn khối lượng $m = 20\\text{ g}$ bay ngang với vận tốc $v_0 = 204\\text{ m/s}$ cắm vào bao cát khối lượng $M = 2{,}02\\text{ kg}$ treo bởi dây nhẹ dài $l = 2\\text{ m}$ ($g = 10\\text{ m/s}^2$). Tính độ cao cực đại bao cát lên được sau va chạm.',
        rubricChecklist: [
          'Áp dụng bảo toàn động lượng ngay lúc va chạm: $V = \\frac{m v_0}{m + M} = 2\\text{ m/s}$ (45 điểm)',
          'Áp dụng bảo toàn cơ năng sau va chạm: $(m+M)gh = \\frac{1}{2}(m+M)V^2$ (35 điểm)',
          'Tính đúng $h = \\frac{V^2}{2g} = 0{,}2\\text{ m}$ (20 điểm)'
        ],
        referenceSolution: '$V = \\frac{0{,}02 \\cdot 204}{2{,}04} = 2\\text{ m/s}$. Sau đó $h = \\frac{V^2}{2g} = \\frac{4}{20} = 0{,}2\\text{ m} = 20\\text{ cm}$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-10c-c1',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        title: 'Tổng đoạn con liên tiếp lớn nhất (Thuật toán Kadane)',
        prompt:
          'Cho dãy số nguyên $A$ gồm $N$ phần tử ($1 \\le N \\le 10^5, |A_i| \\le 10^9$). Hãy viết chương trình tìm tổng lớn nhất của một đoạn con liên tiếp khác rỗng.',
        rubricChecklist: [
          'Trình bày đúng thuật toán Kadane `cur = max(a[i], cur + a[i])` (40 điểm)',
          'Xử lý đúng dãy toàn số âm (`cur = best = a[0]`) và dùng `long long` (35 điểm)',
          'Độ phức tạp $\\mathcal{O}(N)$ và vượt qua mọi test (25 điểm)'
        ],
        referenceSolution: 'Khởi tạo `cur = best = a[0]`, duyệt `i = 1..n-1`: `cur = max(a[i], cur + a[i])`, `best = max(best, cur)`.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '5\n-2 1 -3 4 -1', expectedOutput: '4' },
            { input: '4\n-5 -2 -8 -3', expectedOutput: '-2' },
            { input: '6\n1 2 3 -2 5 -1', expectedOutput: '9' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-10c-c2',
        subject: 'cs',
        grade: 'Lớp 10 · Chuyên',
        title: 'Truy vấn tổng đoạn bằng Prefix Sum',
        prompt:
          'Cho $N, Q$ ($1 \\le N, Q \\le 10^5$), mảng $A$ và $Q$ truy vấn $(L, R)$. In ra tổng các phần tử từ $L$ đến $R$ trên từng dòng.',
        rubricChecklist: [
          'Xây dựng đúng mảng cộng dồn 64-bit `pref[i] = pref[i-1] + a[i]` (45 điểm)',
          'Trả lời mỗi truy vấn trong $\\mathcal{O}(1)$ bằng `pref[R] - pref[L-1]` (35 điểm)',
          'Tốc độ $\\mathcal{O}(N+Q)$ (20 điểm)'
        ],
        referenceSolution: 'Dùng `pref[0] = 0`, `pref[i] = pref[i-1] + a[i]` và in `pref[R] - pref[L-1]`.',
        sampleCode: {
          language: 'python',
          starter: DEFAULT_PY_STARTER,
          tests: [
            { input: '5 2\n1 2 3 4 5\n1 3\n2 5', expectedOutput: '6\n14' },
            { input: '3 1\n10 -5 20\n1 3', expectedOutput: '25' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== LỚP 11 KHÔNG CHUYÊN ==========================
  '11k': {
    math: [
      {
        id: 'e-11k-m1',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        title: 'Cấp số cộng & Phương trình lượng giác',
        prompt:
          '1. Giải phương trình $\\cos 2x - 3\\cos x + 2 = 0$.\n2. Cho cấp số cộng $(u_n)$ biết $u_2 = 5$ và $u_5 = 14$. Tính tổng $20$ số hạng đầu tiên $S_{20}$.',
        rubricChecklist: [
          'Đưa PT về $2\\cos^2 x - 3\\cos x + 1 = 0$ và giải $\\cos x = 1, \\cos x = \\frac{1}{2}$ (50 điểm)',
          'Tìm đúng $d = 3, u_1 = 2$ (25 điểm)',
          'Tính $S_{20} = \\frac{20(4 + 19\\cdot 3)}{2} = 610$ (25 điểm)'
        ],
        referenceSolution: '1) $x = k2\\pi$ hoặc $x = \\pm\\frac{\\pi}{3} + k2\\pi$. 2) $3d = u_5 - u_2 = 9 \\Rightarrow d = 3, u_1 = 2 \\Rightarrow S_{20} = 610$.',
        maxScore: 100
      },
      {
        id: 'e-11k-m2',
        subject: 'math',
        grade: 'Lớp 11 · Không Chuyên',
        title: 'Tính giới hạn & Tiếp tuyến đồ thị hàm số',
        prompt:
          '1. Tính giới hạn $L = \\lim_{x \\to 3} \\frac{\\sqrt{x + 1} - 2}{x - 3}$.\n2. Viết phương trình tiếp tuyến của đồ thị $(C): y = x^3 - 2x + 1$ tại điểm có hoành độ $x_0 = 2$.',
        rubricChecklist: [
          'Nhân lượng liên hợp $\\sqrt{x+1} + 2$ và rút ra $L = \\frac{1}{4}$ (45 điểm)',
          'Tính $y(2) = 5$ và $y\'(2) = 10$ (30 điểm)',
          'Viết đúng tiếp tuyến $y = 10x - 15$ (25 điểm)'
        ],
        referenceSolution: '1) $\\frac{x-3}{(x-3)(\\sqrt{x+1}+2)} \\to \\frac{1}{4}$. 2) $y\' = 3x^2 - 2 \\Rightarrow y\'(2) = 10, y(2) = 5 \\Rightarrow y = 10(x-2)+5 = 10x - 15$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-11k-p1',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        title: 'Viết phương trình dao động điều hòa con lắc lò xo',
        prompt:
          'Con lắc lò xo gồm vật $m = 400\\text{ g}$ gắn vào lò xo $k = 40\\text{ N/m}$. Từ vị trí cân bằng kéo vật ra đoạn $6\\text{ cm}$ rồi thả nhẹ tại $t = 0$.\n1. Tính tần số góc $\\omega$, chu kì $T$ và cơ năng dao động.\n2. Viết phương trình li độ $x(t)$ (chọn chiều dương cùng chiều kéo).',
        rubricChecklist: [
          'Tính $\\omega = \\sqrt{k/m} = 10\\text{ rad/s}$ và $T = \\frac{\\pi}{5}\\text{ s}$ (35 điểm)',
          'Tính cơ năng $W = \\frac{1}{2}kA^2 = 0{,}072\\text{ J}$ (30 điểm)',
          'Xác định $A = 6\\text{ cm}, \\varphi = 0 \\Rightarrow x = 6\\cos(10t)\\text{ cm}$ (35 điểm)'
        ],
        referenceSolution: '$\\omega = \\sqrt{40/0{,}4} = 10\\text{ rad/s}, T = 0{,}2\\pi\\text{ s}, W = 0{,}072\\text{ J}$. Vì $t=0$ vật ở biên dương nên $x = 6\\cos(10t)\\text{ cm}$.',
        maxScore: 100
      },
      {
        id: 'e-11k-p2',
        subject: 'physics',
        grade: 'Lớp 11 · Không Chuyên',
        title: 'Giao thoa sóng nước & Đếm số vân cực đại',
        prompt:
          'Hai nguồn sóng kết hợp cùng pha $S_1, S_2$ cách nhau $15\\text{ cm}$ dao động tần số $f = 20\\text{ Hz}$, tốc độ truyền sóng $v = 80\\text{ cm/s}$.\n1. Tính bước sóng $\\lambda$.\n2. Tìm số điểm dao động với biên độ cực đại trên đoạn $S_1 S_2$.',
        rubricChecklist: [
          'Tính đúng $\\lambda = \\frac{v}{f} = 4\\text{ cm}$ (30 điểm)',
          'Thiết lập bất đẳng thức $-S_1S_2 < k\\lambda < S_1S_2$ (40 điểm)',
          'Giải $-3{,}75 < k < 3{,}75 \\Rightarrow 7$ điểm cực đại (30 điểm)'
        ],
        referenceSolution: '$\\lambda = 4\\text{ cm}$. Cực đại khi $-15 < 4k < 15 \\Rightarrow k \\in \\{-3,-2,-1,0,1,2,3\\}$, có $7$ điểm cực đại.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-11k-c1',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        title: 'Tìm kiếm nhị phân vị trí đầu tiên của X',
        prompt:
          'Cho mảng đã sắp xếp tăng dần gồm $N$ số nguyên ($1 \\le N \\le 10^5$) và giá trị $X$. Hãy tìm vị trí (1-indexed) nhỏ nhất có giá trị bằng $X$, nếu không có in `-1`.',
        rubricChecklist: [
          'Đọc $N, X$ và mảng tăng dần (25 điểm)',
          'Cài đặt Tìm kiếm nhị phân đạt $\\mathcal{O}(\\log N)$ (50 điểm)',
          'Trả về đúng vị trí đầu tiên hoặc `-1` (25 điểm)'
        ],
        referenceSolution: 'Dùng Binary Search tìm `lower_bound`: cập nhật `ans = mid, r = mid - 1` khi `a[mid] == x`.',
        sampleCode: {
          language: 'cpp',
          starter: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n; long long x;
    if (!(cin >> n >> x)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // Viết thuật toán Tìm kiếm nhị phân...
    return 0;
}`,
          tests: [
            { input: '6 4\n1 2 4 4 4 9', expectedOutput: '3' },
            { input: '4 5\n1 2 3 8', expectedOutput: '-1' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-11k-c2',
        subject: 'cs',
        grade: 'Lớp 11 · Không Chuyên',
        title: 'Sắp xếp mảng số nguyên tăng dần',
        prompt: 'Cho $N$ ($1 \\le N \\le 10^5$) và mảng $A$. Sắp xếp mảng theo thứ tự không giảm và in ra trên 1 dòng cách nhau bởi dấu cách.',
        rubricChecklist: [
          'Dùng thuật toán $\\mathcal{O}(N\\log N)$ (`sort`) (50 điểm)',
          'In đúng định dạng (50 điểm)'
        ],
        referenceSolution: 'Đọc mảng $A$, gọi `sort(a.begin(), a.end())` (hoặc `a.sort()` trong Python) và in ra.',
        sampleCode: {
          language: 'python',
          starter: DEFAULT_PY_STARTER,
          tests: [
            { input: '5\n5 1 4 2 8', expectedOutput: '1 2 4 5 8' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== LỚP 11 CHUYÊN ==========================
  '11c': {
    math: [
      {
        id: 'e-11c-m1',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        title: 'Dãy số truy hồi & Giới hạn dãy số',
        prompt:
          'Cho dãy số $(u_n)$ xác định bởi $u_1 = 1$ và $u_{n+1} = \\sqrt{2 + u_n}$ với mọi $n \\ge 1$.\n1. Chứng minh dãy $(u_n)$ tăng và bị chặn trên bởi $2$.\n2. Tìm $\\lim u_n$.',
        rubricChecklist: [
          'Quy nạp chứng minh $0 < u_n < 2$ với mọi $n$ (35 điểm)',
          'Chứng minh $u_{n+1} - u_n = \\frac{2 + u_n - u_n^2}{\\sqrt{2+u_n} + u_n} > 0$ (35 điểm)',
          'Giải $L = \\sqrt{2 + L}$ ($L > 0$) để kết luận $\\lim u_n = 2$ (30 điểm)'
        ],
        referenceSolution: 'Quy nạp $u_n < 2$, xét hiệu $u_{n+1} > u_n$ suy ra tồn tại giới hạn $L \\in [1; 2]$. Cho qua giới hạn: $L^2 - L - 2 = 0 \\Rightarrow L = 2$.',
        maxScore: 100
      },
      {
        id: 'e-11c-m2',
        subject: 'math',
        grade: 'Lớp 11 · Chuyên',
        title: 'Khoảng cách giữa hai đường thẳng chéo nhau',
        prompt:
          'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Tính khoảng cách giữa hai đường thẳng chéo nhau $SB$ và $CD$.',
        rubricChecklist: [
          'Chứng minh $CD // (SAB) \\Rightarrow d(CD, SB) = d(D, (SAB))$ (45 điểm)',
          'Chứng minh $DA \\perp (SAB)$ tại $A$ (35 điểm)',
          'Kết luận $d(SB, CD) = DA = a$ (20 điểm)'
        ],
        referenceSolution: 'Vì $CD // AB \\subset (SAB)$ nên $d(CD, SB) = d(D, (SAB))$. Mà $DA \\perp AB, DA \\perp SA \\Rightarrow DA \\perp (SAB)$, nên khoảng cách bằng $DA = a$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-11c-p1',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        title: 'Con lắc lò xo treo thẳng đứng & Lực đàn hồi',
        prompt:
          'Một con lắc lò xo treo thẳng đứng có $k = 100\\text{ N/m}$, vật $m = 250\\text{ g}$, lấy $g = 10\\text{ m/s}^2$. Kích thích vật dao động với biên độ $A = 5\\text{ cm}$.\n1. Tính độ biến dạng tại VTCB $\\Delta l_0$ và chu kì $T$.\n2. Tính lực đàn hồi cực đại và cực tiểu tác dụng lên điểm treo trong quá trình dao động.',
        rubricChecklist: [
          'Tính $\\Delta l_0 = \\frac{mg}{k} = 2{,}5\\text{ cm}$ và $T = \\frac{\\pi}{10}\\text{ s}$ (40 điểm)',
          'Tính $F_{\\max} = k(\\Delta l_0 + A) = 7{,}5\\text{ N}$ (30 điểm)',
          'Nhận xét $A > \\Delta l_0$ nên lò xo qua vị trí không biến dạng $\\Rightarrow F_{\\min} = 0$ (30 điểm)'
        ],
        referenceSolution: '$\\Delta l_0 = 2{,}5\\text{ cm}$, $F_{\\max} = 100(0{,}025 + 0{,}05) = 7{,}5\\text{ N}$. Do $A = 5\\text{ cm} > \\Delta l_0$ nên $F_{\\min} = 0$.',
        maxScore: 100
      },
      {
        id: 'e-11c-p2',
        subject: 'physics',
        grade: 'Lớp 11 · Chuyên',
        title: 'Cân bằng điện tích & Con lắc tích điện trong điện trường',
        prompt:
          'Con lắc đơn gồm quả cầu $m = 10\\text{ g}$ mang điện tích $q = +10^{-5}\\text{ C}$ treo vào dây mảnh trong điện trường đều nằm ngang $E = 10^4\\text{ V/m}$, $g = 10\\text{ m/s}^2$.\n1. Tính góc lệch của dây treo tại vị trí cân bằng.\n2. Tính gia tốc trọng trường hiệu dụng $g\'$ và lực căng dây tại VTCB.',
        rubricChecklist: [
          'Tính $F_đ = qE = 0{,}1\\text{ N}$ và $P = mg = 0{,}1\\text{ N}$ (30 điểm)',
          'Suy ra $\\tan\\alpha = \\frac{F_đ}{P} = 1 \\Rightarrow \\alpha = 45^\\circ$ (35 điểm)',
          'Tính $g\' = g\\sqrt{2} \\approx 14{,}14\\text{ m/s}^2$ và $T = 0{,}1\\sqrt{2}\\text{ N}$ (35 điểm)'
        ],
        referenceSolution: '$F_đ = P = 0{,}1\\text{ N} \\Rightarrow \\alpha = 45^\\circ$, $g\' = \\sqrt{g^2 + (qE/m)^2} = 10\\sqrt{2}\\text{ m/s}^2$, $T = mg\' = 0{,}1\\sqrt{2}\\text{ N}$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-11c-c1',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        title: 'Độ dài Dãy con tăng dài nhất (LIS)',
        prompt:
          'Cho dãy $N$ số nguyên ($1 \\le N \\le 10^5, |A_i| \\le 10^9$). Hãy viết chương trình tìm độ dài dãy con tăng ngặt dài nhất trong $\\mathcal{O}(N \\log N)$.',
        rubricChecklist: [
          'Sử dụng `lower_bound` (C++) hoặc `bisect_left` (Python) trên mảng `tails` (55 điểm)',
          'Đảm bảo độ phức tạp $\\mathcal{O}(N\\log N)$ (25 điểm)',
          'Xuất đúng kết quả mọi bộ test (20 điểm)'
        ],
        referenceSolution: 'Duy trì mảng `tails` lưu phần tử cuối nhỏ nhất của LIS độ dài $k$; thay thế hoặc mở rộng bằng `lower_bound`.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '6\n10 9 2 5 3 7', expectedOutput: '3' },
            { input: '5\n1 2 3 4 5', expectedOutput: '5' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-11c-c2',
        subject: 'cs',
        grade: 'Lớp 11 · Chuyên',
        title: 'Đếm số thành phần liên thông trên đồ thị vô hướng',
        prompt:
          'Cho đồ thị vô hướng gồm $N$ đỉnh ($1 \\le N \\le 10^5$) và $M$ cạnh ($0 \\le M \\le 10^5$). Hãy đếm số thành phần liên thông của đồ thị.',
        rubricChecklist: [
          'Dùng danh sách kề kết hợp DFS/BFS hoặc DSU (55 điểm)',
          'Độ phức tạp $\\mathcal{O}(N + M)$ (25 điểm)',
          'Xử lý đúng đỉnh cô lập (20 điểm)'
        ],
        referenceSolution: 'Duyệt các đỉnh `1..N`; mỗi khi gặp đỉnh chưa thăm, tăng biến đếm và loang BFS/DFS để đánh dấu cả thành phần.',
        sampleCode: {
          language: 'cpp',
          starter: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    // Đọc m cạnh và đếm thành phần liên thông...
    return 0;
}`,
          tests: [
            { input: '5 3\n1 2\n2 3\n4 5', expectedOutput: '2' },
            { input: '4 0', expectedOutput: '4' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== LỚP 12 KHÔNG CHUYÊN ==========================
  '12k': {
    math: [
      {
        id: 'e-12k-m1',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        title: 'Tìm cực trị hàm số bậc ba và phương trình tiếp tuyến',
        prompt:
          'Cho hàm số $y = x^3 - 3x^2 + 2$.\n1. Tìm các điểm cực đại, cực tiểu và giá trị cực trị tương ứng.\n2. Viết phương trình tiếp tuyến của đồ thị tại điểm có hoành độ $x_0 = 3$.',
        rubricChecklist: [
          'Tính đạo hàm $y\' = 3x^2 - 6x$ và giải $x = 0, x = 2$ (30 điểm)',
          'Kết luận đúng $y_{CĐ}(0) = 2$, $y_{CT}(2) = -2$ (30 điểm)',
          'Tính đúng $y(3) = 2$ và hệ số góc $y\'(3) = 9$ (20 điểm)',
          'Viết đúng phương trình tiếp tuyến $y = 9x - 25$ (20 điểm)'
        ],
        referenceSolution: '$y\' = 3x^2 - 6x = 0 \\Leftrightarrow x = 0, x = 2$. Đạt CĐ $(0; 2)$, CT $(2; -2)$. Tại $x_0=3$: $y = 9(x-3)+2 = 9x - 25$.',
        maxScore: 100
      },
      {
        id: 'e-12k-m2',
        subject: 'math',
        grade: 'Lớp 12 · Không Chuyên',
        title: 'Phương pháp tọa độ Oxyz: Mặt phẳng & Khoảng cách',
        prompt:
          'Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$ và mặt phẳng $(P): 2x - y + 2z - 4 = 0$.\n1. Tính khoảng cách từ $A$ đến $(P)$.\n2. Viết phương trình mặt cầu tâm $A$ tiếp xúc với $(P)$.',
        rubricChecklist: [
          'Áp dụng công thức khoảng cách $d(A, (P)) = \\frac{|2 - 2 - 2 - 4|}{\\sqrt{4 + 1 + 4}} = 2$ (50 điểm)',
          'Xác định bán kính $R = d(A, (P)) = 2$ (25 điểm)',
          'Viết đúng PT mặt cầu $(x-1)^2 + (y-2)^2 + (z+1)^2 = 4$ (25 điểm)'
        ],
        referenceSolution: '$d(A, (P)) = \\frac{|-6|}{3} = 2$. Mặt cầu tâm $A$ tiếp xúc $(P)$ có $R = 2$: $(x-1)^2 + (y-2)^2 + (z+1)^2 = 4$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-12k-p1',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        title: 'Mạch điện xoay chiều RLC nối tiếp chuẩn THPT',
        prompt:
          'Đặt điện áp $u = 100\\sqrt{2}\\cos(100\\pi t)\\text{ V}$ vào mạch RLC nối tiếp gồm $R = 30\\,\\Omega$, cuộn cảm thuần $L = \\frac{0{,}7}{\\pi}\\text{ H}$ và tụ điện $C = \\frac{10^{-3}}{3\\pi}\\text{ F}$.\n1. Tính cảm kháng $Z_L$, dung kháng $Z_C$ và tổng trở $Z$.\n2. Tính cường độ dòng điện hiệu dụng $I$ và công suất tiêu thụ $P$.',
        rubricChecklist: [
          'Tính $Z_L = 70\\,\\Omega$ và $Z_C = 30\\,\\Omega$ (35 điểm)',
          'Tính tổng trở $Z = \\sqrt{30^2 + (70-30)^2} = 50\\,\\Omega$ (25 điểm)',
          'Tính $I = \\frac{U}{Z} = 2\\text{ A}$ và $P = I^2 R = 120\\text{ W}$ (40 điểm)'
        ],
        referenceSolution: '$Z_L = 70\\,\\Omega, Z_C = 30\\,\\Omega \\Rightarrow Z = 50\\,\\Omega$. $I = \\frac{100}{50} = 2\\text{ A}$, $P = 4 \\cdot 30 = 120\\text{ W}$.',
        maxScore: 100
      },
      {
        id: 'e-12k-p2',
        subject: 'physics',
        grade: 'Lớp 12 · Không Chuyên',
        title: 'Khí lí tưởng & Phương trình trạng thái',
        prompt:
          'Một bình kín dung tích $V = 8{,}31\\text{ lít}$ chứa $n = 2\\text{ mol}$ khí lí tưởng ở nhiệt độ $27^\\circ\\text{C}$ ($R = 8{,}31\\text{ J/(mol.K)}$).\n1. Tính áp suất của khối khí trong bình.\n2. Nếu đun nóng đẳng tích lên $177^\\circ\\text{C}$ thì áp suất lúc sau bằng bao nhiêu?',
        rubricChecklist: [
          'Đổi $T_1 = 300\\text{ K}, V = 8{,}31\\cdot 10^{-3}\\text{ m}^3$ (25 điểm)',
          'Tính $p_1 = \\frac{nRT_1}{V} = 6\\cdot 10^5\\text{ Pa}$ (40 điểm)',
          'Áp dụng định luật Charles đẳng tích: $p_2 = p_1\\frac{450}{300} = 9\\cdot 10^5\\text{ Pa}$ (35 điểm)'
        ],
        referenceSolution: '$p_1 = \\frac{2\\cdot 8{,}31\\cdot 300}{8{,}31\\cdot 10^{-3}} = 6\\cdot 10^5\\text{ Pa}$. Khi $T_2 = 450\\text{ K}$, $p_2 = 9\\cdot 10^5\\text{ Pa}$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-12k-c1',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        title: 'Thiết kế trang HTML5 kết hợp CSS & Khái niệm AI/Mạng',
        prompt:
          '1. Trình bày vai trò của các thiết bị Switch, Router và Modem trong mạng LAN kết nối Internet.\n2. Viết đoạn mã HTML5 + CSS tạo một thẻ thông tin học sinh gồm tên, lớp (tiêu đề `<h2>`), mô tả ngắn và viền bo góc.',
        rubricChecklist: [
          'Phân biệt đúng Switch (chuyển mạch LAN theo MAC), Router (định tuyến IP), Modem (điều chế tín hiệu WAN) (50 điểm)',
          'Viết đúng cấu trúc HTML5 ngữ nghĩa và CSS `border-radius`, `padding`, `border` (50 điểm)'
        ],
        referenceSolution:
          'Switch nối các máy trong LAN qua địa chỉ MAC; Router định tuyến gói IP giữa các mạng; Modem chuyển đổi tín hiệu đường truyền ISP. Code HTML dùng `<div class="card"><h2>...</h2><p>...</p></div>` kèm CSS.',
        maxScore: 100
      },
      {
        id: 'e-12k-c2',
        subject: 'cs',
        grade: 'Lớp 12 · Không Chuyên',
        title: 'Lập trình Python xử lý dữ liệu học sinh đạt chuẩn',
        prompt: 'Cho $N$ và $N$ điểm số nguyên ($0 \\le A_i \\le 10$). In ra số lượng điểm đạt từ $8$ trở lên.',
        rubricChecklist: [
          'Đọc đúng $N$ và danh sách điểm (40 điểm)',
          'Đếm số phần tử `>= 8` chính xác (60 điểm)'
        ],
        referenceSolution: 'Duyệt qua mảng điểm và đếm số phần tử `x >= 8`.',
        sampleCode: {
          language: 'python',
          starter: DEFAULT_PY_STARTER,
          tests: [
            { input: '5\n6 8 9 7 10', expectedOutput: '3' },
            { input: '3\n5 6 7', expectedOutput: '0' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== LỚP 12 CHUYÊN ==========================
  '12c': {
    math: [
      {
        id: 'e-12c-m1',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        title: 'Tích phân hàm ẩn kết hợp phương trình vi phân bậc nhất',
        prompt:
          'Cho hàm số $f(x)$ có đạo hàm liên tục trên $\\mathbb{R}$ thỏa mãn $f(0) = 1$ và $f\'(x) + 2x\\,f(x) = 2x\\,e^{-x^2}$ với mọi $x \\in \\mathbb{R}$. Tính $I = \\int_0^1 f(x) e^{x^2}\\,dx$.',
        rubricChecklist: [
          'Nhân hai vế với thừa số tích phân $e^{x^2}$ thu được $(f(x)e^{x^2})\' = 2x$ (45 điểm)',
          'Nguyên hàm hai vế và thay $f(0) = 1$ suy ra $f(x)e^{x^2} = x^2 + 1$ (35 điểm)',
          'Tính đúng $I = \\int_0^1 (x^2 + 1)\\,dx = \\frac{4}{3}$ (20 điểm)'
        ],
        referenceSolution: 'Nhân với $e^{x^2}$: $(f(x)e^{x^2})\' = 2x \\Rightarrow f(x)e^{x^2} = x^2 + C$. Vì $f(0)=1 \\Rightarrow C=1$. Vậy $I = \\int_0^1 (x^2+1)\\,dx = \\frac{4}{3}$.',
        maxScore: 100
      },
      {
        id: 'e-12c-m2',
        subject: 'math',
        grade: 'Lớp 12 · Chuyên',
        title: 'Cực trị khoảng cách hình học Oxyz',
        prompt:
          'Trong không gian $Oxyz$, cho mặt cầu $(S): (x-1)^2 + (y-2)^2 + (z-2)^2 = 4$ và mặt phẳng $(P): 2x - y + 2z + 11 = 0$. Tìm giá trị nhỏ nhất của khoảng cách từ một điểm $M \\in (S)$ tới mặt phẳng $(P)$.',
        rubricChecklist: [
          'Xác định tâm $I(1; 2; 2), R = 2$ (25 điểm)',
          'Tính $d(I, (P)) = \\frac{|2 - 2 + 4 + 11|}{3} = 5$ (40 điểm)',
          'Kết luận $d_{\\min} = d(I, (P)) - R = 5 - 2 = 3$ (35 điểm)'
        ],
        referenceSolution: 'Vì $d(I, (P)) = 5 > R = 2$, mặt phẳng không cắt mặt cầu, nên khoảng cách nhỏ nhất từ $M \\in (S)$ tới $(P)$ là $5 - 2 = 3$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-12c-p1',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        title: 'Bài toán cực trị mạch RLC có cuộn dây không thuần cảm',
        prompt:
          'Mạch xoay chiều $AB$ mắc nối tiếp gồm điện trở $R = 40\\,\\Omega$, tụ $C$ có $Z_C = 80\\,\\Omega$ và cuộn dây có điện trở trong $r = 10\\,\\Omega$, độ tự cảm $L$ thay đổi được. Điện áp hai đầu mạch $U = 100\\text{ V}$.\n1. Tìm $Z_L$ để công suất toàn mạch đạt cực đại.\n2. Tìm giá trị công suất cực đại đó và hiệu điện thế giữa hai đầu cuộn dây lúc đó.',
        rubricChecklist: [
          'Công suất toàn mạch $P = \\frac{U^2(R+r)}{(R+r)^2 + (Z_L - Z_C)^2}$ cực đại khi $Z_L = Z_C = 80\\,\\Omega$ (40 điểm)',
          'Tính $P_{\\max} = \\frac{U^2}{R+r} = 200\\text{ W}$ (30 điểm)',
          'Tính $I = 2\\text{ A}$ và $U_d = I\\sqrt{r^2 + Z_L^2} = 2\\sqrt{6500} \\approx 161{,}25\\text{ V}$ (30 điểm)'
        ],
        referenceSolution: 'Cộng hưởng $Z_L = Z_C = 80\\,\\Omega$, $R+r = 50\\,\\Omega \\Rightarrow I = 2\\text{ A}, P_{\\max} = 200\\text{ W}$, $U_d = 2\\sqrt{10^2 + 80^2} = 20\\sqrt{65}\\text{ V}$.',
        maxScore: 100
      },
      {
        id: 'e-12c-p2',
        subject: 'physics',
        grade: 'Lớp 12 · Chuyên',
        title: 'Chu trình nhiệt động lực học trên đồ thị p-V',
        prompt:
          '$1\\text{ mol}$ khí lí tưởng đơn nguyên tử thực hiện chu trình $1 \\to 2 \\to 3 \\to 1$: $(1 \\to 2)$ đẳng áp từ $(p_0, V_0)$ đến $(p_0, 3V_0)$; $(2 \\to 3)$ đẳng tích hạ áp xuống $p_0/2$; $(3 \\to 1)$ áp suất tỉ lệ bậc nhất với thể tích. Tính công mà khí thực hiện trong cả chu trình theo $p_0 V_0$.',
        rubricChecklist: [
          'Vẽ đúng chu trình trên hệ trục $(p, V)$ là tam giác vuông (35 điểm)',
          'Tính công bằng diện tích tam giác $A = \\frac{1}{2}(3V_0 - V_0)(p_0 - \\frac{p_0}{2})$ (40 điểm)',
          'Kết luận đúng $A = 0{,}5\\,p_0 V_0$ (25 điểm)'
        ],
        referenceSolution: 'Chu trình khép kín tạo tam giác có đáy $\\Delta V = 2V_0$ và chiều cao $\\Delta p = 0{,}5 p_0$, nên $A = \\frac{1}{2} \\cdot 2V_0 \\cdot 0{,}5p_0 = 0{,}5 p_0 V_0$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-12c-c1',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        title: 'Truy vấn đoạn bằng Segment Tree / Fenwick Tree',
        prompt:
          'Cho mảng $A$ gồm $N$ số nguyên ($1 \\le N \\le 10^5$) và $Q$ truy vấn tính tổng đoạn $[L, R]$. Hãy cài đặt giải pháp hiệu quả.',
        rubricChecklist: [
          'Cài đặt đúng Segment Tree hoặc Fenwick Tree / Prefix Sum $\\mathcal{O}((N+Q)\\log N)$ (60 điểm)',
          'Không tràn số 64-bit `long long` (20 điểm)',
          'Vượt qua toàn bộ test mẫu (20 điểm)'
        ],
        referenceSolution: 'Sử dụng Fenwick Tree (`update` và `query`) hoặc Prefix Sum với kiểu `long long`.',
        sampleCode: {
          language: 'cpp',
          starter: DEFAULT_CPP_STARTER,
          tests: [
            { input: '5 2\n1 2 3 4 5\n1 3\n2 5', expectedOutput: '6\n14' },
            { input: '4 1\n100 200 300 400\n2 4', expectedOutput: '900' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-12c-c2',
        subject: 'cs',
        grade: 'Lớp 12 · Chuyên',
        title: 'Đếm số đoạn con có tổng chia hết cho K',
        prompt:
          'Cho dãy $N$ số nguyên và số nguyên dương $K$ ($1 \\le N, K \\le 10^5$). Đếm số đoạn con liên tiếp $[L, R]$ có tổng chia hết cho $K$.',
        rubricChecklist: [
          'Dùng đồng dư tiền tố `rem = ((pref % K) + K) % K` (45 điểm)',
          'Đếm tần suất dư trong `cnt[rem]` để cộng `ans += cnt[rem]` trong $\\mathcal{O}(N)$ (40 điểm)',
          'Khởi tạo `cnt[0] = 1` và dùng `long long` cho `ans` (15 điểm)'
        ],
        referenceSolution: 'Theo nguyên lí đồng dư, tổng đoạn $(L, R]$ chia hết cho $K$ khi `pref[R] % K == pref[L-1] % K`.',
        sampleCode: {
          language: 'cpp',
          starter: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n; long long k;
    if (!(cin >> n >> k)) return 0;
    // Đọc mảng và đếm số đoạn con tổng chia hết k...
    return 0;
}`,
          tests: [
            { input: '5 5\n4 5 0 -2 -3', expectedOutput: '4' }
          ]
        },
        maxScore: 100
      }
    ]
  },

  // ========================== ĐỘI TUYỂN HSG / OLYMPIC ==========================
  olp: {
    math: [
      {
        id: 'e-olp-m1',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Bài toán Số học Olympic & Định lý Fermat/Euler',
        prompt:
          'Tìm tất cả các số nguyên tố $p$ sao cho $2^p + p^2$ cũng là một số nguyên tố.',
        rubricChecklist: [
          'Thử các giá trị nhỏ $p = 2 \\Rightarrow 8$ (loại), $p = 3 \\Rightarrow 17$ (nhận) (30 điểm)',
          'Với $p > 3$, chứng minh $p \\equiv \\pm 1 \\pmod 6 \\Rightarrow p^2 \\equiv 1 \\pmod 3$ và $2^p \\equiv 2 \\pmod 3$ (50 điểm)',
          'Suy ra $2^p + p^2 \\equiv 0 \\pmod 3$ và lớn hơn $3$ nên là hợp số; kết luận $p = 3$ (20 điểm)'
        ],
        referenceSolution: 'Xét modulo $3$: với $p=3$, $2^3 + 3^2 = 17$ là nguyên tố. Với $p > 3$ lẻ và $3 \\nmid p$, có $2^p \\equiv (-1)^p \\equiv 2 \\pmod 3$ và $p^2 \\equiv 1 \\pmod 3$, nên $3 \\mid (2^p + p^2) > 3$. Vậy $p = 3$ duy nhất.',
        maxScore: 100
      },
      {
        id: 'e-olp-m2',
        subject: 'math',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Phương trình hàm trên tập số thực',
        prompt: 'Tìm tất cả các hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $f(x + f(y)) = f(x) + y$ với mọi $x, y \\in \\mathbb{R}$.',
        rubricChecklist: [
          'Chứng minh $f$ toàn ánh bằng cách cố định $x = 0$: $f(f(y)) = f(0) + y$ (35 điểm)',
          'Chứng minh $f$ đơn ánh từ $f(f(y_1)) = f(f(y_2)) \\Rightarrow y_1 = y_2$ (30 điểm)',
          'Thay $y = 0$ suy ra $f(x + f(0)) = f(x) \\Rightarrow x + f(0) = x \\Rightarrow f(0) = 0$ và chứng minh $f(x) = x$ (35 điểm)'
        ],
        referenceSolution: 'Với $x=0$: $f(f(y)) = y + f(0)$, suy ra $f$ song ánh. Thay $y=0$: $f(x + f(0)) = f(x) \\Rightarrow f(0) = 0 \\Rightarrow f(f(y)) = y$. Thay $x=0$ hay $f(x)$ phù hợp cho nghiệm duy nhất $f(x) = x$.',
        maxScore: 100
      }
    ],
    physics: [
      {
        id: 'e-olp-p1',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Cơ học vật rắn & Con lắc vật lý / Lăn không trượt',
        prompt:
          'Một thanh mảnh đồng chất dài $L$, khối lượng $M$ có thể quay không ma sát quanh trục nằm ngang đi qua một đầu thanh. Thanh được thả nhẹ từ vị trí nằm ngang.\n1. Tính gia tốc góc ban đầu ngay khi vừa thả.\n2. Tính vận tốc góc của thanh khi đi qua vị trí thẳng đứng dưới (lấy gia tốc trọng trường $g$).',
        rubricChecklist: [
          'Dùng mômen quán tính thanh $I = \\frac{1}{3}ML^2$ (25 điểm)',
          'Phương trình động lực học quay $Mg\\frac{L}{2} = I\\gamma \\Rightarrow \\gamma_0 = \\frac{3g}{2L}$ (35 điểm)',
          'Bảo toàn cơ năng $Mg\\frac{L}{2} = \\frac{1}{2}I\\omega^2 \\Rightarrow \\omega = \\sqrt{\\frac{3g}{L}}$ (40 điểm)'
        ],
        referenceSolution: '$I = \\frac{1}{3}ML^2$. Khi vừa thả: $Mg\\frac{L}{2} = \\frac{1}{3}ML^2 \\gamma_0 \\Rightarrow \\gamma_0 = \\frac{3g}{2L}$. Tại VTCB: $\\frac{1}{2}I\\omega^2 = Mg\\frac{L}{2} \\Rightarrow \\omega = \\sqrt{\\frac{3g}{L}}$.',
        maxScore: 100
      },
      {
        id: 'e-olp-p2',
        subject: 'physics',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Thanh dẫn trượt trên ray trong từ trường (Cảm ứng điện từ Olympic)',
        prompt:
          'Thanh dẫn khối lượng $m$, điện trở $R = 0$ trượt không ma sát trên hai thanh ray song song nằm ngang cách nhau $l$ đặt trong từ trường đều $\\vec{B}$ thẳng đứng. Hai đầu ray nối với tụ điện điện dung $C$. Tác dụng lực không đổi $F$ kéo thanh chuyển động từ trạng thái nghỉ. Chứng minh thanh chuyển động với gia tốc không đổi và tìm biểu thức gia tốc đó.',
        rubricChecklist: [
          'Viết suất điện động cảm ứng $e = Blv$ và điện tích tụ $q = C\\cdot u = CBlv$ (35 điểm)',
          'Tìm dòng điện qua thanh $i = \\frac{dq}{dt} = CBl\\frac{dv}{dt} = CBla$ (35 điểm)',
          'Áp dụng định luật II Newton $F - Bli = ma \\Rightarrow a = \\frac{F}{m + CB^2 l^2}$ (30 điểm)'
        ],
        referenceSolution: 'Điện tích tụ $q = CBlv \\Rightarrow i = \\frac{dq}{dt} = CBl a$. Phương trình Newton: $F - B l (C B l a) = ma \\Rightarrow a = \\frac{F}{m + C B^2 l^2} = \\text{const}$.',
        maxScore: 100
      }
    ],
    cs: [
      {
        id: 'e-olp-c1',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Cây khung nhỏ nhất (Minimum Spanning Tree - Kruskal/DSU)',
        prompt:
          'Cho đồ thị vô hướng liên thông có $N$ đỉnh ($1 \\le N \\le 10^5$) và $M$ cạnh có trọng số ($1 \\le M \\le 2\\cdot 10^5, w \\le 10^9$). Tìm tổng trọng số của Cây khung nhỏ nhất (MST).',
        rubricChecklist: [
          'Sắp xếp cạnh tăng dần theo trọng số trong $\\mathcal{O}(M\\log M)$ (30 điểm)',
          'Cài đặt DSU với Path Compression & Union by Size (45 điểm)',
          'Cộng tổng bằng kiểu `long long` chính xác (25 điểm)'
        ],
        referenceSolution: 'Dùng thuật toán Kruskal: sắp xếp cạnh tăng dần theo trọng số và hợp nhất các đỉnh bằng DSU.',
        sampleCode: {
          language: 'cpp',
          starter: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    // Cài đặt Kruskal + DSU...
    return 0;
}`,
          tests: [
            { input: '4 5\n1 2 1\n1 3 4\n2 3 2\n2 4 5\n3 4 3', expectedOutput: '6' }
          ]
        },
        maxScore: 100
      },
      {
        id: 'e-olp-c2',
        subject: 'cs',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Đường đi ngắn nhất Dijkstra',
        prompt:
          'Cho đồ thị có hướng trọng số không âm gồm $N$ đỉnh, $M$ cạnh ($1 \\le N, M \\le 10^5$). Tìm độ dài đường đi ngắn nhất từ đỉnh $1$ đến đỉnh $N$ (in `-1` nếu không đi tới được).',
        rubricChecklist: [
          'Cài đặt Dijkstra với `priority_queue` chi phí $\\mathcal{O}((N+M)\\log N)$ (60 điểm)',
          'Khởi tạo `INF` lớn (`1e18`) với kiểu `long long` (25 điểm)',
          'In `-1` nếu `dist[n] == INF` (15 điểm)'
        ],
        referenceSolution: 'Dùng Min-Heap `(dist, u)` thư giãn mọi cạnh đi ra từ `u`.',
        sampleCode: {
          language: 'cpp',
          starter: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int main() {
    int n, m;
    if (!(cin >> n >> m)) return 0;
    // Cài đặt Dijkstra từ 1 đến n...
    return 0;
}`,
          tests: [
            { input: '4 4\n1 2 2\n2 4 3\n1 3 1\n3 4 10', expectedOutput: '5' }
          ]
        },
        maxScore: 100
      }
    ]
  }
};
