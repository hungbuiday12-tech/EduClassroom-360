import {
  ArenaAchievement,
  ArenaAttempt,
  ArenaCompetitiveTier,
  ArenaDivisionId,
  ArenaDivisionMeta,
  ArenaEssayPrompt,
  ArenaQuestionMCQ,
  ArenaSprintRecord,
  ArenaSubject,
  WeeklyLeaderboardEntry
} from '../types';
import {
  ARENA_DIVISIONS,
  ARENA_DIVISION_ESSAY_BANK as BASE_DIVISION_ESSAY_BANK,
  ARENA_DIVISION_MCQ_BANK as BASE_DIVISION_MCQ_BANK
} from './arenaDivisionsData';
import {
  CHEM_BIO_BASE_ESSAY,
  CHEM_BIO_BASE_MCQ,
  CHEM_BIO_DIVISION_ESSAY,
  CHEM_BIO_DIVISION_MCQ
} from './arenaChemBioData';

export { ARENA_DIVISIONS };

export const ARENA_DIVISION_MCQ_BANK: Record<
  ArenaDivisionId,
  Record<ArenaSubject, ArenaQuestionMCQ[]>
> = (Object.keys(BASE_DIVISION_MCQ_BANK) as ArenaDivisionId[]).reduce(
  (acc, divId) => {
    acc[divId] = {
      ...BASE_DIVISION_MCQ_BANK[divId],
      chemistry: CHEM_BIO_DIVISION_MCQ[divId].chemistry,
      biology: CHEM_BIO_DIVISION_MCQ[divId].biology
    };
    return acc;
  },
  {} as Record<ArenaDivisionId, Record<ArenaSubject, ArenaQuestionMCQ[]>>
);

export const ARENA_DIVISION_ESSAY_BANK: Record<
  ArenaDivisionId,
  Record<ArenaSubject, ArenaEssayPrompt[]>
> = (Object.keys(BASE_DIVISION_ESSAY_BANK) as ArenaDivisionId[]).reduce(
  (acc, divId) => {
    acc[divId] = {
      ...BASE_DIVISION_ESSAY_BANK[divId],
      chemistry: CHEM_BIO_DIVISION_ESSAY[divId].chemistry,
      biology: CHEM_BIO_DIVISION_ESSAY[divId].biology
    };
    return acc;
  },
  {} as Record<ArenaDivisionId, Record<ArenaSubject, ArenaEssayPrompt[]>>
);

export function getArenaDivisionMeta(division: ArenaDivisionId): ArenaDivisionMeta {
  return ARENA_DIVISIONS.find((d) => d.id === division) || ARENA_DIVISIONS[6]; // default 12k
}

/**
 * Scope weekId cleanly per division (<= 13 chars, compatible with Firestore rules <= 16 chars)
 */
export function getArenaScopedWeekId(baseWeekId: string, division: ArenaDivisionId): string {
  return `${baseWeekId}_${division}`;
}

/**
 * Compute current dateKey ('YYYY-MM-DD') and ISO weekId ('YYYY-Www') in Vietnam Time (UTC+7)
 */
export function getVietnamNowParts(now: Date = new Date()): {
  dateKey: string;
  weekId: string;
  year: number;
  month: number;
  day: number;
  dayOfWeek: number; // 1 = Mon .. 7 = Sun
} {
  // Shift to UTC+7 cleanly
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnDate = new Date(utcMs + 7 * 3600000);

  const year = vnDate.getFullYear();
  const month = vnDate.getMonth() + 1;
  const day = vnDate.getDate();
  const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // ISO Week calculation on vnDate
  const temp = new Date(Date.UTC(year, vnDate.getMonth(), day));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const weekId = `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;

  return {
    dateKey,
    weekId,
    year,
    month,
    day,
    dayOfWeek: dayNum
  };
}

export function getWeekDateRangeLabel(now: Date = new Date()): string {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnDate = new Date(utcMs + 7 * 3600000);
  const dayNum = vnDate.getDay() || 7; // 1=Mon .. 7=Sun
  const monday = new Date(vnDate);
  monday.setDate(vnDate.getDate() - (dayNum - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${fmt(monday)} – ${fmt(sunday)}/${sunday.getFullYear()}`;
}

export function getDailyResetCountdown(now: Date = new Date()): string {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const vnDate = new Date(utcMs + 7 * 3600000);
  const nextMidnight = new Date(vnDate);
  nextMidnight.setHours(24, 0, 0, 0);
  const diffSec = Math.max(0, Math.floor((nextMidnight.getTime() - vnDate.getTime()) / 1000));
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// =====================================================================
// DAILY COMPETITION QUESTION BANKS (TOÁN - LÍ - TIN · TN & TỰ LUẬN)
// =====================================================================

export const ARENA_MCQ_BANK: Record<ArenaSubject, ArenaQuestionMCQ[]> = {
  math: [
    {
      id: 'am-1',
      subject: 'math',
      grade: 'Lớp 9',
      question: 'Cho phương trình $x^2 - 5x + m = 0$ có hai nghiệm $x_1, x_2$ thỏa mãn $x_1^2 + x_2^2 = 13$. Giá trị của tham số $m$ là:',
      options: ['$m = 6$', '$m = 12$', '$m = -6$', '$m = 3$'],
      correctIndex: 0,
      explanation: 'Theo định lí Vi-ét (với $\\Delta = 25 - 4m \\ge 0$), ta có $x_1 + x_2 = 5$ và $x_1 x_2 = m$. Khi đó $x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 25 - 2m = 13 \\Rightarrow m = 6$ (thỏa mãn $\\Delta = 1 > 0$).',
      points: 20
    },
    {
      id: 'am-2',
      subject: 'math',
      grade: 'Lớp 10',
      question: 'Tập nghiệm của bất phương trình $x^2 - 4x + 3 \\le 0$ là:',
      options: ['$[1; 3]$', '$(-\\infty; 1] \\cup [3; +\\infty)$', '$(1; 3)$', '$[-3; -1]$'],
      correctIndex: 0,
      explanation: 'Tam thức $f(x) = x^2 - 4x + 3$ có hai nghiệm $x=1, x=3$ và hệ số $a = 1 > 0$. Áp dụng quy tắc "Trong trái, ngoài cùng", $f(x) \\le 0 \\Leftrightarrow x \\in [1; 3]$.',
      points: 20
    },
    {
      id: 'am-3',
      subject: 'math',
      grade: 'Lớp 11',
      question: 'Cho cấp số cộng $(u_n)$ có $u_1 = 3$ và công sai $d = 4$. Tổng $10$ số hạng đầu tiên $S_{10}$ bằng:',
      options: ['$210$', '$190$', '$230$', '$420$'],
      correctIndex: 0,
      explanation: 'Ta có $S_n = \\frac{n[2u_1 + (n-1)d]}{2}$. Thay $n=10, u_1=3, d=4 \\Rightarrow S_{10} = \\frac{10(6 + 9\\cdot 4)}{2} = 5 \\cdot 42 = 210$.',
      points: 20
    },
    {
      id: 'am-4',
      subject: 'math',
      grade: 'Lớp 11',
      question: 'Giới hạn $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$ có giá trị bằng:',
      options: ['$4$', '$0$', '$2$', '$+\\infty$'],
      correctIndex: 0,
      explanation: 'Khử dạng vô định $\\frac{0}{0}$: $\\frac{x^2-4}{x-2} = \\frac{(x-2)(x+2)}{x-2} = x+2 \\to 4$ khi $x \\to 2$.',
      points: 20
    },
    {
      id: 'am-5',
      subject: 'math',
      grade: 'Lớp 12',
      question: 'Hàm số $y = x^3 - 3x + 2$ đạt cực tiểu tại điểm nào sau đây?',
      options: ['$x = 1$', '$x = -1$', '$x = 0$', '$x = 2$'],
      correctIndex: 0,
      explanation: 'Ta có $y\' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1$. Vì $y\'\' = 6x$ nên $y\'\'(1) = 6 > 0 \\Rightarrow x = 1$ là điểm cực tiểu.',
      points: 20
    },
    {
      id: 'am-6',
      subject: 'math',
      grade: 'Lớp 12',
      question: 'Tích phân $I = \\int_0^1 (3x^2 + 2x)\\,dx$ bằng bao nhiêu?',
      options: ['$2$', '$3$', '$1$', '$5$'],
      correctIndex: 0,
      explanation: 'Nguyên hàm là $F(x) = x^3 + x^2$. Do đó $I = F(1) - F(0) = (1 + 1) - 0 = 2$.',
      points: 20
    },
    {
      id: 'am-7',
      subject: 'math',
      grade: 'Lớp 10',
      question: 'Trong tam giác $ABC$ có $AB = 5, AC = 8, \\widehat{BAC} = 60^\\circ$. Độ dài cạnh $BC$ bằng:',
      options: ['$7$', '$\\sqrt{129}$', '$6$', '$\\sqrt{39}$'],
      correctIndex: 0,
      explanation: 'Theo định lí Côsin: $BC^2 = AB^2 + AC^2 - 2\\cdot AB\\cdot AC\\cdot \\cos 60^\\circ = 25 + 64 - 2\\cdot 5\\cdot 8\\cdot \\frac{1}{2} = 49 \\Rightarrow BC = 7$.',
      points: 20
    },
    {
      id: 'am-8',
      subject: 'math',
      grade: 'Lớp 12',
      question: 'Trong không gian $Oxyz$, mặt phẳng $(P): 2x - y + 3z - 5 = 0$ có một vectơ pháp tuyến là:',
      options: ['$\\vec{n} = (2; -1; 3)$', '$\\vec{n} = (2; 1; 3)$', '$\\vec{n} = (2; -1; -5)$', '$\\vec{n} = (-1; 3; -5)$'],
      correctIndex: 0,
      explanation: 'Mặt phẳng $Ax + By + Cz + D = 0$ có vectơ pháp tuyến $\\vec{n} = (A; B; C) = (2; -1; 3)$.',
      points: 20
    }
  ],

  physics: [
    {
      id: 'ap-1',
      subject: 'physics',
      grade: 'Lớp 9',
      question: 'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào hiệu điện thế $U = 12\\text{ V}$. Cường độ dòng điện qua mạch chính là:',
      options: ['$3\\text{ A}$', '$\\frac{2}{3}\\text{ A}$', '$2\\text{ A}$', '$1\\text{ A}$'],
      correctIndex: 0,
      explanation: 'Điện trở tương đương $R_{tđ} = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{6\\cdot 12}{6 + 12} = 4\\,\\Omega$. Suy ra $I = \\frac{U}{R_{tđ}} = \\frac{12}{4} = 3\\text{ A}$.',
      points: 20
    },
    {
      id: 'ap-2',
      subject: 'physics',
      grade: 'Lớp 10',
      question: 'Một vật được thả rơi tự do không vận tốc đầu từ độ cao $h = 45\\text{ m}$ tại nơi có $g = 10\\text{ m/s}^2$. Thời gian rơi chạm đất là:',
      options: ['$3\\text{ s}$', '$4{,}5\\text{ s}$', '$9\\text{ s}$', '$2\\text{ s}$'],
      correctIndex: 0,
      explanation: 'Áp dụng công thức rơi tự do $h = \\frac{1}{2}gt^2 \\Rightarrow t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{90}{10}} = 3\\text{ s}$.',
      points: 20
    },
    {
      id: 'ap-3',
      subject: 'physics',
      grade: 'Lớp 11',
      question: 'Một con lắc lò xo có độ cứng $k = 100\\text{ N/m}$ dao động điều hòa với biên độ $A = 4\\text{ cm}$. Cơ năng dao động của con lắc là:',
      options: ['$0{,}08\\text{ J}$', '$0{,}8\\text{ J}$', '$800\\text{ J}$', '$0{,}04\\text{ J}$'],
      correctIndex: 0,
      explanation: 'Đổi $A = 0{,}04\\text{ m}$. Cơ năng $W = \\frac{1}{2}kA^2 = \\frac{1}{2}\\cdot 100 \\cdot (0{,}04)^2 = 0{,}08\\text{ J}$.',
      points: 20
    },
    {
      id: 'ap-4',
      subject: 'physics',
      grade: 'Lớp 11',
      question: 'Một sóng cơ có tần số $f = 20\\text{ Hz}$ truyền đi với tốc độ $v = 4\\text{ m/s}$. Bước sóng $\\lambda$ bằng:',
      options: ['$0{,}2\\text{ m}$', '$5\\text{ m}$', '$80\\text{ m}$', '$0{,}5\\text{ m}$'],
      correctIndex: 0,
      explanation: 'Bước sóng $\\lambda = \\frac{v}{f} = \\frac{4}{20} = 0{,}2\\text{ m} = 20\\text{ cm}$.',
      points: 20
    },
    {
      id: 'ap-5',
      subject: 'physics',
      grade: 'Lớp 12',
      question: 'Đoạn mạch RLC nối tiếp có $R = 30\\,\\Omega$, $Z_L = 70\\,\\Omega$, $Z_C = 30\\,\\Omega$. Tổng trở $Z$ của đoạn mạch bằng:',
      options: ['$50\\,\\Omega$', '$70\\,\\Omega$', '$130\\,\\Omega$', '$40\\,\\Omega$'],
      correctIndex: 0,
      explanation: 'Tổng trở $Z = \\sqrt{R^2 + (Z_L - Z_C)^2} = \\sqrt{30^2 + (70 - 30)^2} = \\sqrt{900 + 1600} = 50\\,\\Omega$.',
      points: 20
    },
    {
      id: 'ap-6',
      subject: 'physics',
      grade: 'Lớp 12',
      question: 'Chất phóng xạ có chu kì bán rã $T = 10\\text{ ngày}$. Sau thời gian $t = 30\\text{ ngày}$, phần trăm số hạt nhân còn lại so với ban đầu là:',
      options: ['$12{,}5\\%$', '$25\\%$', '$33{,}3\\%$', '$87{,}5\\%$'],
      correctIndex: 0,
      explanation: 'Số hạt nhân còn lại $N = N_0 2^{-t/T} = N_0 2^{-30/10} = \\frac{N_0}{8} = 12{,}5\\%\\,N_0$.',
      points: 20
    },
    {
      id: 'ap-7',
      subject: 'physics',
      grade: 'Lớp 9',
      question: 'Một vật sáng đặt trước thấu kính hội tụ có tiêu cự $f = 20\\text{ cm}$ và cách thấu kính $d = 30\\text{ cm}$. Khoảng cách từ ảnh tới thấu kính $d\'$ là:',
      options: ['$60\\text{ cm}$', '$12\\text{ cm}$', '$30\\text{ cm}$', '$40\\text{ cm}$'],
      correctIndex: 0,
      explanation: 'Áp dụng công thức thấu kính $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\Rightarrow \\frac{1}{d\'} = \\frac{1}{20} - \\frac{1}{30} = \\frac{1}{60} \\Rightarrow d\' = 60\\text{ cm}$.',
      points: 20
    }
  ],

  cs: [
    {
      id: 'ac-1',
      subject: 'cs',
      grade: 'Cơ bản',
      question: 'Trong C++, để lưu tổng của $10^5$ số nguyên mà mỗi số có giá trị lên tới $10^9$ không bị tràn số (overflow), ta nên khai báo biến tổng kiểu nào?',
      options: ['`long long`', '`int`', '`short`', '`float`'],
      correctIndex: 0,
      explanation: 'Tổng tối đa đạt $10^{14}$, vượt quá giới hạn `int` ($\\approx 2\\times 10^9$). Kiểu `long long` (64-bit) lưu tới $\\approx 9\\times 10^{18}$.',
      points: 20
    },
    {
      id: 'ac-2',
      subject: 'cs',
      grade: 'Trung cấp',
      question: 'Độ phức tạp thời gian của thuật toán Tìm kiếm nhị phân (Binary Search) trên mảng đã sắp xếp gồm $N$ phần tử là:',
      options: ['$\\mathcal{O}(\\log N)$', '$\\mathcal{O}(N)$', '$\\mathcal{O}(N \\log N)$', '$\\mathcal{O}(N^2)$'],
      correctIndex: 0,
      explanation: 'Mỗi bước chia đôi không gian tìm kiếm đi $2$ lần nên số bước tối đa là $\\lceil \\log_2 N \\rceil$.',
      points: 20
    },
    {
      id: 'ac-3',
      subject: 'cs',
      grade: 'Trung cấp',
      question: 'Với mảng $A$ có độ dài $N = 10^5$ và $Q = 10^5$ truy vấn tính tổng đoạn $[L, R]$, cấu trúc nào giải quyết trong $\\mathcal{O}(N + Q)$?',
      options: ['Mảng cộng dồn (Prefix Sum)', 'Duyệt hai vòng lặp `for` lồng nhau', 'Sắp xếp nổi bọt (Bubble Sort)', 'Đệ quy quay lui không nhớ'],
      correctIndex: 0,
      explanation: 'Xây dựng mảng cộng dồn $P[i] = P[i-1] + A[i]$ mất $\\mathcal{O}(N)$, sau đó mỗi truy vấn $\\text{sum}(L, R) = P[R] - P[L-1]$ chỉ mất $\\mathcal{O}(1)$.',
      points: 20
    },
    {
      id: 'ac-4',
      subject: 'cs',
      grade: 'Cơ bản',
      question: 'Trong Python, kết quả của biểu thức `[x*x for x in range(1, 5) if x % 2 == 0]` là:',
      options: ['`[4, 16]`', '`[1, 4, 9, 16]`', '`[4, 16, 36]`', '`[2, 4]`'],
      correctIndex: 0,
      explanation: '`range(1, 5)` gồm $1, 2, 3, 4$. Các số chẵn là $2$ và $4$, bình phương lên được `[4, 16]`.',
      points: 20
    },
    {
      id: 'ac-5',
      subject: 'cs',
      grade: 'Nâng cao / HSG',
      question: 'Thuật toán Kadane dùng để giải bài toán nào sau đây với độ phức tạp $\\mathcal{O}(N)$?',
      options: [
        'Tìm tổng đoạn con liên tiếp lớn nhất',
        'Tìm đường đi ngắn nhất mọi cặp đỉnh',
        'Tìm ước chung lớn nhất hai số',
        'Kiểm tra đồ thị hai phía'
      ],
      correctIndex: 0,
      explanation: 'Thuật toán Kadane duy trì tổng kết thúc tại vị trí hiện tại `cur = max(a[i], cur + a[i])` trong $\\mathcal{O}(N)$.',
      points: 20
    },
    {
      id: 'ac-6',
      subject: 'cs',
      grade: 'Nâng cao / HSG',
      question: 'Để tìm đường đi ngắn nhất (theo số cạnh) từ đỉnh $S$ trên đồ thị **không có trọng số**, ta nên dùng thuật toán nào?',
      options: ['BFS (Tìm kiếm theo chiều rộng)', 'DFS (Tìm kiếm theo chiều sâu)', 'Quicksort', 'Sàng Eratosthenes'],
      correctIndex: 0,
      explanation: 'BFS duyệt đồ thị theo từng lớp khoảng cách tăng dần nên đảm bảo đỉnh chạm lần đầu chính là đường đi ít cạnh nhất.',
      points: 20
    },
    {
      id: 'ac-7',
      subject: 'cs',
      grade: 'Trung cấp',
      question: 'Cho hàm đệ quy Fibonacci thuần không ghi nhớ `f(n) = f(n-1) + f(n-2)`. Độ phức tạp thời gian của nó gần nhất với:',
      options: ['$\\mathcal{O}(2^N)$', '$\\mathcal{O}(N)$', '$\\mathcal{O}(N\\log N)$', '$\\mathcal{O}(1)$'],
      correctIndex: 0,
      explanation: 'Mỗi lời gọi đẻ thêm 2 nhánh con nên cây đệ quy phình theo hàm mũ $\\approx \\mathcal{O}(1{,}618^N) \\subset \\mathcal{O}(2^N)$.',
      points: 20
    }
  ],
  chemistry: CHEM_BIO_BASE_MCQ.chemistry,
  biology: CHEM_BIO_BASE_MCQ.biology
};

export const ARENA_ESSAY_BANK: Record<ArenaSubject, ArenaEssayPrompt[]> = {
  math: [
    {
      id: 'ae-math-1',
      subject: 'math',
      grade: 'Lớp 9 - 10',
      title: 'Biện luận nghiệm phương trình bậc hai bằng Định lí Vi-ét',
      prompt: 'Cho phương trình $x^2 - 2(m+1)x + m^2 + 2 = 0$ ($m$ là tham số).\n1. Tìm điều kiện của $m$ để phương trình có hai nghiệm phân biệt $x_1, x_2$.\n2. Tìm giá trị của $m$ để $x_1^2 + x_2^2 = 10$.',
      rubricChecklist: [
        'Tính đúng biệt thức thu gọn $\\Delta\' = (m+1)^2 - (m^2+2) = 2m - 1$ (25 điểm)',
        'Giải đúng điều kiện hai nghiệm phân biệt $\\Delta\' > 0 \\Leftrightarrow m > \\frac{1}{2}$ (20 điểm)',
        'Viết đúng hệ thức Vi-ét: $x_1+x_2 = 2(m+1)$ và $x_1 x_2 = m^2+2$ (20 điểm)',
        'Biến đổi $x_1^2+x_2^2 = (x_1+x_2)^2 - 2x_1x_2 = 2m^2 + 8m = 10$ và giải ra $m=1$ (nhận) hoặc $m=-5$ (loại do $m > \\frac{1}{2}$) (35 điểm)'
      ],
      referenceSolution: 'Ta có $\\Delta\' = (m+1)^2 - (m^2+2) = 2m - 1$. Để phương trình có 2 nghiệm phân biệt thì $\\Delta\' > 0 \\Leftrightarrow m > \\frac{1}{2}$. Theo Vi-ét: $S = 2(m+1), P = m^2+2$. Khi đó $x_1^2+x_2^2 = 4(m+1)^2 - 2(m^2+2) = 2m^2 + 8m = 10 \\Leftrightarrow m^2 + 4m - 5 = 0 \\Leftrightarrow m = 1$ (TM) hoặc $m = -5$ (Loại). Vậy $m = 1$.',
      maxScore: 100
    },
    {
      id: 'ae-math-2',
      subject: 'math',
      grade: 'Lớp 11 - 12',
      title: 'Tìm cực trị hàm số bậc ba và phương trình tiếp tuyến',
      prompt: 'Cho hàm số $y = x^3 - 3x^2 + 2$.\n1. Tìm các điểm cực đại, cực tiểu và giá trị cực trị tương ứng.\n2. Viết phương trình tiếp tuyến của đồ thị tại điểm có hoành độ $x_0 = 3$.',
      rubricChecklist: [
        'Tính đúng đạo hàm $y\' = 3x^2 - 6x$ và giải $y\' = 0 \\Leftrightarrow x = 0, x = 2$ (30 điểm)',
        'Kết luận đúng: Cực đại tại $x=0, y_{\\text{CĐ}}=2$; Cực tiểu tại $x=2, y_{\\text{CT}}=-2$ (30 điểm)',
        'Tính đúng $y(3) = 2$ và hệ số góc $y\'(3) = 9$ (20 điểm)',
        'Viết đúng phương trình tiếp tuyến $y = 9(x - 3) + 2 = 9x - 25$ (20 điểm)'
      ],
      referenceSolution: '$y\' = 3x^2 - 6x = 0 \\Leftrightarrow x=0$ hoặc $x=2$. Lập bảng biến thiên (hoặc $y\'\'=6x-6$): đạt CĐ tại $x=0$ với $y_{\\text{CĐ}}=2$, đạt CT tại $x=2$ với $y_{\\text{CT}}=-2$. Tại $x_0=3$: $y(3)=2, y\'(3)=9 \\Rightarrow$ tiếp tuyến $y = 9(x-3)+2 = 9x - 25$.',
      maxScore: 100
    }
  ],
  physics: [
    {
      id: 'ae-phys-1',
      subject: 'physics',
      grade: 'Lớp 9 - 11',
      title: 'Phân tích mạch hỗn hợp & Công suất tỏa nhiệt',
      prompt: 'Cho mạch điện gồm điện trở $R_1 = 6\\,\\Omega$ mắc nối tiếp với cụm hai điện trở $R_2 = 12\\,\\Omega$ và $R_3 = 4\\,\\Omega$ mắc song song. Đặt vào hai đầu đoạn mạch hiệu điện thế không đổi $U = 18\\text{ V}$.\n1. Tính điện trở tương đương của toàn mạch và cường độ dòng điện qua mạch chính.\n2. Tính hiệu điện thế hai đầu $R_2$ và công suất tỏa nhiệt trên điện trở $R_1$.',
      rubricChecklist: [
        'Tính đúng $R_{23} = \\frac{12\\cdot 4}{12+4} = 3\\,\\Omega$ và $R_{tđ} = 6 + 3 = 9\\,\\Omega$ (35 điểm)',
        'Tính đúng dòng điện mạch chính $I = \\frac{U}{R_{tđ}} = 2\\text{ A}$ (25 điểm)',
        'Tính đúng $U_2 = U_{23} = I\\cdot R_{23} = 6\\text{ V}$ (20 điểm)',
        'Tính đúng công suất tỏa nhiệt $P_1 = I^2 R_1 = 2^2 \\cdot 6 = 24\\text{ W}$ (20 điểm)'
      ],
      referenceSolution: 'Cụm song song $R_{23} = \\frac{12\\cdot 4}{12+4} = 3\\,\\Omega$. Toàn mạch $R_{tđ} = R_1 + R_{23} = 9\\,\\Omega$. Dòng điện mạch chính $I = \\frac{18}{9} = 2\\text{ A}$. Hiệu điện thế trên cụm song song $U_2 = U_{23} = I\\cdot R_{23} = 2\\cdot 3 = 6\\text{ V}$. Công suất tỏa nhiệt trên $R_1$: $P_1 = I^2 R_1 = 4\\cdot 6 = 24\\text{ W}$.',
      maxScore: 100
    },
    {
      id: 'ae-phys-2',
      subject: 'physics',
      grade: 'Lớp 10 - 12',
      title: 'Bảo toàn cơ năng kết hợp động học ném xiên / rơi',
      prompt: 'Một vật có khối lượng $m = 0{,}5\\text{ kg}$ được ném thẳng đứng lên cao từ mặt đất với vận tốc ban đầu $v_0 = 20\\text{ m/s}$, lấy $g = 10\\text{ m/s}^2$ (bỏ qua sức cản không khí). Chọn gốc thế năng tại mặt đất.\n1. Tính cơ năng của vật và độ cao cực đại $h_{\\max}$ mà vật đạt tới.\n2. Ở độ cao nào thì thế năng bằng 3 lần động năng ($W_t = 3W_đ$)?',
      rubricChecklist: [
        'Tính đúng cơ năng ban đầu $W = \\frac{1}{2}mv_0^2 = 100\\text{ J}$ (30 điểm)',
        'Áp dụng bảo toàn cơ năng suy ra $h_{\\max} = \\frac{v_0^2}{2g} = 20\\text{ m}$ (35 điểm)',
        'Thay $W_t = 3W_đ \\Rightarrow W = W_t + \\frac{1}{3}W_t = \\frac{4}{3}W_t = \\frac{4}{3}mgh$ và giải đúng $h = \\frac{3}{4}h_{\\max} = 15\\text{ m}$ (35 điểm)'
      ],
      referenceSolution: 'Tại mặt đất $W = \\frac{1}{2}mv_0^2 = 0{,}5\\cdot 0{,}5\\cdot 400 = 100\\text{ J}$. Ở độ cao cực đại $v=0 \\Rightarrow mgh_{\\max} = 100 \\Rightarrow h_{\\max} = 20\\text{ m}$. Khi $W_t = 3W_đ \\Rightarrow W_đ = \\frac{1}{3}W_t \\Rightarrow W = \\frac{4}{3}mgh = mgh_{\\max} \\Rightarrow h = \\frac{3}{4}\\cdot 20 = 15\\text{ m}$.',
      maxScore: 100
    }
  ],
  cs: [
    {
      id: 'ae-cs-1',
      subject: 'cs',
      grade: 'Cơ bản - Trung cấp',
      title: 'Bài toán Hai tổng (Count Pairs / Subarray) & Cài đặt code',
      prompt: 'Cho dãy số nguyên $A$ gồm $N$ phần tử ($1 \\le N \\le 10^5, |A_i| \\le 10^9$).\nYêu cầu: Viết thuật toán (C++ hoặc Python) và giải thích độ phức tạp để tìm **tổng lớn nhất của một đoạn con liên tiếp khác rỗng**.\nVí dụ Input:\n`5`\n`-2 1 -3 4 -1`\nOutput mong đợi: `4`.',
      rubricChecklist: [
        'Trình bày đúng ý tưởng thuật toán Kadane: duy trì `cur_sum = max(a[i], cur_sum + a[i])` và cập nhật `best = max(best, cur_sum)` (35 điểm)',
        'Cài đặt code C++ hoặc Python đúng cú pháp, đọc đủ $N$ và mảng $A$ (35 điểm)',
        'Xử lý đúng trường hợp toàn số âm (khởi tạo `cur_sum = best = a[0]`) và dùng kiểu 64-bit (`long long` trong C++) (15 điểm)',
        'Đánh giá đúng độ phức tạp thời gian $\\mathcal{O}(N)$ và bộ nhớ $\\mathcal{O}(1)$ (15 điểm)'
      ],
      referenceSolution: 'Dùng thuật toán Kadane $\\mathcal{O}(N)$: khởi tạo `cur = best = a[0]`. Với mỗi `i` từ `1` đến `n-1`: `cur = max(a[i], cur + a[i])`, `best = max(best, cur)`. In ra `best`. Trong C++ nhớ dùng `long long` để tránh tràn số khi $|a_i| \\le 10^9$.',
      sampleCode: {
        language: 'cpp',
        starter: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    // Viết thuật toán tại đây...
    
    return 0;
}`,
        tests: [
          { input: '5\n-2 1 -3 4 -1', expectedOutput: '4' },
          { input: '4\n-5 -2 -8 -3', expectedOutput: '-2' },
          { input: '6\n1 2 3 -2 5 -1', expectedOutput: '9' }
        ]
      },
      maxScore: 100
    },
    {
      id: 'ae-cs-2',
      subject: 'cs',
      grade: 'Trung cấp - Nâng cao',
      title: 'Đếm số nguyên tố trong đoạn [L, R] hoặc Tổng mảng cộng dồn',
      prompt: 'Cho mảng $N$ số nguyên ($1 \\le N \\le 10^5$) và $Q$ truy vấn ($1 \\le Q \\le 10^5$), mỗi truy vấn cho cặp $(L, R)$ ($1 \\le L \\le R \\le N$). Hãy trình bày giải thuật và viết chương trình C++/Python tính nhanh tổng các phần tử từ vị trí $L$ đến $R$ cho mọi truy vấn.',
      rubricChecklist: [
        'Nhận xét được cách duyệt trực tiếp mất $\\mathcal{O}(N\\cdot Q)$ bị quá thời gian (TLE) (20 điểm)',
        'Đề xuất đúng mảng cộng dồn `pref[i] = pref[i-1] + a[i]` với `pref[0] = 0` (35 điểm)',
        'Trả lời mỗi truy vấn trong $\\mathcal{O}(1)$ bằng `pref[R] - pref[L - 1]` (30 điểm)',
        'Cài đặt sạch, dùng `long long` (C++) / fast I/O và kết luận đúng độ phức tạp $\\mathcal{O}(N + Q)$ (15 điểm)'
      ],
      referenceSolution: 'Xây dựng mảng cộng dồn `pref[0] = 0`, `pref[i] = pref[i-1] + a[i]` (kiểu `long long` trong C++). Mỗi truy vấn $(L, R)$ xuất ra `pref[R] - pref[L - 1]`. Tổng độ phức tạp là $\\mathcal{O}(N + Q)$.',
      sampleCode: {
        language: 'python',
        starter: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Cài đặt thuật toán Prefix Sum tại đây...

if __name__ == '__main__':
    solve()
`,
        tests: [
          { input: '5 2\n1 2 3 4 5\n1 3\n2 5', expectedOutput: '6\n14' },
          { input: '3 1\n10 -5 20\n1 3', expectedOutput: '25' }
        ]
      },
      maxScore: 100
    }
  ],
  chemistry: CHEM_BIO_BASE_ESSAY.chemistry,
  biology: CHEM_BIO_BASE_ESSAY.biology
};

/**
 * Deterministically pick today's Arena MCQ set (5 questions) and Essay prompt (1 problem)
 * for a given subject, dateKey ('YYYY-MM-DD'), and division so all students competing in
 * the same grade/track zone on the same day receive the same fair challenge.
 */
export function getDailyArenaSet(
  subject: ArenaSubject,
  dateKey: string,
  division: ArenaDivisionId = '12k'
): { mcqs: ArenaQuestionMCQ[]; essay: ArenaEssayPrompt } {
  const divMcqPool = ARENA_DIVISION_MCQ_BANK[division]?.[subject];
  const divEssayPool = ARENA_DIVISION_ESSAY_BANK[division]?.[subject];

  const mcqPool = divMcqPool && divMcqPool.length > 0 ? divMcqPool : ARENA_MCQ_BANK[subject];
  const essayPool = divEssayPool && divEssayPool.length > 0 ? divEssayPool : ARENA_ESSAY_BANK[subject];

  // Deterministic hash from dateKey + division + subject
  let seed = 0;
  const key = `${dateKey}_${division}_${subject}`;
  for (let i = 0; i < key.length; i++) {
    seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  }

  // Deterministic Fisher-Yates copy
  const shuffled = [...mcqPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const mcqs = shuffled.slice(0, Math.min(5, shuffled.length));
  const essay = essayPool[seed % essayPool.length];

  return { mcqs, essay };
}

// =====================================================================
// COMPETITIVE SEASON TIERS, ELO, ACHIEVEMENTS & SPEEDRUN 90s GENERATOR
// =====================================================================

export const ARENA_COMPETITIVE_TIERS: ArenaCompetitiveTier[] = [
  {
    id: 'bronze',
    nameVi: 'Đồng Chiến Binh',
    nameEn: 'Bronze Warrior',
    minElo: 0,
    nextElo: 1100,
    accentClass: 'text-amber-700 dark:text-amber-400',
    borderClass: 'border-amber-400/60 bg-amber-500/10'
  },
  {
    id: 'silver',
    nameVi: 'Bạc Học Thuật',
    nameEn: 'Silver Scholar',
    minElo: 1100,
    nextElo: 1250,
    accentClass: 'text-slate-600 dark:text-slate-300',
    borderClass: 'border-slate-400/60 bg-slate-500/10'
  },
  {
    id: 'gold',
    nameVi: 'Vàng Tinh Anh',
    nameEn: 'Gold Elite',
    minElo: 1250,
    nextElo: 1450,
    accentClass: 'text-amber-600 dark:text-amber-300',
    borderClass: 'border-amber-400/70 bg-amber-400/15'
  },
  {
    id: 'platinum',
    nameVi: 'Bạch Kim',
    nameEn: 'Platinum Vanguard',
    minElo: 1450,
    nextElo: 1650,
    accentClass: 'text-cyan-600 dark:text-cyan-300',
    borderClass: 'border-cyan-400/70 bg-cyan-500/15'
  },
  {
    id: 'diamond',
    nameVi: 'Kim Cương',
    nameEn: 'Diamond Prodigy',
    minElo: 1650,
    nextElo: 1850,
    accentClass: 'text-sky-600 dark:text-sky-300',
    borderClass: 'border-sky-400/75 bg-sky-500/15'
  },
  {
    id: 'master',
    nameVi: 'Cao Thủ STEM',
    nameEn: 'STEM Master',
    minElo: 1850,
    nextElo: 2050,
    accentClass: 'text-violet-600 dark:text-violet-300',
    borderClass: 'border-violet-400/75 bg-violet-500/15'
  },
  {
    id: 'challenger',
    nameVi: 'Thách Đấu Huyền Thoại',
    nameEn: 'Grand Challenger',
    minElo: 2050,
    nextElo: null,
    accentClass: 'text-rose-600 dark:text-rose-300',
    borderClass: 'border-rose-400/80 bg-rose-500/15'
  }
];

export function computeArenaEloAndTier(
  attempts: ArenaAttempt[],
  leaderboardRow?: WeeklyLeaderboardEntry | null,
  sprintRecords: ArenaSprintRecord[] = []
): {
  elo: number;
  tier: ArenaCompetitiveTier;
  nextTier: ArenaCompetitiveTier | null;
  progressPct: number;
  pointsToNext: number;
  avgScore: number;
  bestScore: number;
  winStreakEstimate: number;
} {
  const scores = attempts.map((a) => a.score);
  const avgFromAttempts =
    scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
  const avgScore =
    leaderboardRow && leaderboardRow.overallAvg > 0
      ? leaderboardRow.overallAvg
      : Math.round(avgFromAttempts * 10) / 10;

  const bestFromRow = Math.max(
    leaderboardRow?.mathBest ?? 0,
    leaderboardRow?.physicsBest ?? 0,
    leaderboardRow?.chemistryBest ?? 0,
    leaderboardRow?.biologyBest ?? 0,
    leaderboardRow?.csBest ?? 0
  );
  const bestScore = Math.max(bestFromRow, scores.length > 0 ? Math.max(...scores) : 0);

  const distinctSubjects = new Set(attempts.map((a) => a.subject)).size;
  const highRounds = attempts.filter((a) => a.score >= 80).length;
  const sprintBonus = Math.min(180, sprintRecords.length * 14 + (sprintRecords.some((s) => s.score >= 300) ? 45 : 0));

  const totalMatches = Math.max(attempts.length, leaderboardRow?.totalAttempts ?? 0);
  const rawElo =
    1000 +
    Math.round(avgScore * 7.2) +
    Math.min(240, totalMatches * 28) +
    distinctSubjects * 35 +
    highRounds * 22 +
    sprintBonus;

  const elo = Math.max(950, rawElo);

  let tierIdx = 0;
  for (let i = 0; i < ARENA_COMPETITIVE_TIERS.length; i++) {
    if (elo >= ARENA_COMPETITIVE_TIERS[i].minElo) {
      tierIdx = i;
    }
  }
  const tier = ARENA_COMPETITIVE_TIERS[tierIdx];
  const nextTier =
    tierIdx < ARENA_COMPETITIVE_TIERS.length - 1 ? ARENA_COMPETITIVE_TIERS[tierIdx + 1] : null;

  const progressPct = nextTier
    ? Math.max(
        4,
        Math.min(
          100,
          Math.round(((elo - tier.minElo) / Math.max(1, nextTier.minElo - tier.minElo)) * 100)
        )
      )
    : 100;
  const pointsToNext = nextTier ? Math.max(0, nextTier.minElo - elo) : 0;

  const sortedRecent = [...attempts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  let winStreakEstimate = 0;
  for (const item of sortedRecent) {
    if (item.score >= 60) winStreakEstimate += 1;
    else break;
  }

  return {
    elo,
    tier,
    nextTier,
    progressPct,
    pointsToNext,
    avgScore,
    bestScore,
    winStreakEstimate
  };
}

export function computeArenaAchievements(
  attempts: ArenaAttempt[],
  sprintRecords: ArenaSprintRecord[] = []
): ArenaAchievement[] {
  const distinctSubjs = new Set(attempts.map((a) => a.subject));
  const bestSpeedHigh = attempts.some((a) => a.score >= 80 && a.durationSec <= 90);
  const hasPerfect100 = attempts.some((a) => a.score >= 100);
  const hasEssayMaster = attempts.some((a) => a.mode === 'essay' && a.score >= 85);
  const bestSprint = sprintRecords.reduce((max, r) => Math.max(max, r.score), 0);

  return [
    {
      id: 'first_blood',
      titleVi: 'Chiến Binh Khai Cuộc',
      titleEn: 'First Arena Match',
      descriptionVi: 'Hoàn thành ít nhất 1 lượt thi đấu chính thức tại Đấu trường.',
      descriptionEn: 'Complete at least 1 official Arena competition round.',
      tier: 'bronze',
      unlocked: attempts.length >= 1,
      progressText: `${Math.min(attempts.length, 1)}/1 lượt`
    },
    {
      id: 'pentathlon_master',
      titleVi: 'Ngũ Môn STEM Toàn Năng',
      titleEn: 'STEM Pentathlon',
      descriptionVi: 'Ghi điểm cả 5 môn Toán, Lí, Hóa, Sinh và Tin học trong cùng tuần.',
      descriptionEn: 'Record scores across Math, Physics, Chemistry, Biology & CS in the week.',
      tier: 'silver',
      unlocked: distinctSubjs.size >= 5,
      progressText: `${distinctSubjs.size}/5 môn`
    },
    {
      id: 'speed_demon',
      titleVi: 'Tia Chớp Giải Đề',
      titleEn: 'Lightning Solver',
      descriptionVi: 'Đạt từ 80 điểm trở lên trong thời gian dưới 90 giây.',
      descriptionEn: 'Score 80+ points in 90 seconds or less.',
      tier: 'gold',
      unlocked: bestSpeedHigh,
      progressText: bestSpeedHigh ? 'Đã đạt' : 'Chưa đạt'
    },
    {
      id: 'perfect_100',
      titleVi: 'Bách Phát Bách Trúng',
      titleEn: 'Flawless 100',
      descriptionVi: 'Đạt điểm tuyệt đối 100/100 ở bất kỳ môn thi đấu nào.',
      descriptionEn: 'Achieve a perfect 100/100 score in any round.',
      tier: 'diamond',
      unlocked: hasPerfect100,
      progressText: hasPerfect100 ? '100/100đ' : 'Tối đa hiện tại'
    },
    {
      id: 'essay_scholar',
      titleVi: 'Học Giả Tự Luận AI',
      titleEn: 'AI Essay Master',
      descriptionVi: 'Đạt từ 85/100 điểm trở lên ở phần thi Tự luận do Syn AI chấm.',
      descriptionEn: 'Score 85+ in an AI-graded Essay challenge.',
      tier: 'gold',
      unlocked: hasEssayMaster,
      progressText: hasEssayMaster ? '≥ 85đ' : 'Chưa đạt'
    },
    {
      id: 'sprint_legend',
      titleVi: 'Kỷ Lục Gia Speedrun 90s',
      titleEn: '90s Speedrun Champion',
      descriptionVi: 'Đạt từ 350 điểm Combo trở lên trong chế độ Speedrun 90s.',
      descriptionEn: 'Reach 350+ Combo points in 90s Speedrun mode.',
      tier: 'diamond',
      unlocked: bestSprint >= 350,
      progressText: `${bestSprint}/350 điểm`
    }
  ];
}

export function getSprintArenaSet(
  subject: ArenaSubject,
  division: ArenaDivisionId = '12k',
  seedOffset = 0
): ArenaQuestionMCQ[] {
  const divMcqs = ARENA_DIVISION_MCQ_BANK[division]?.[subject] || [];
  const generalMcqs = ARENA_MCQ_BANK[subject] || [];

  const mergedMap = new Map<string, ArenaQuestionMCQ>();
  [...divMcqs, ...generalMcqs].forEach((q) => {
    if (!mergedMap.has(q.id)) mergedMap.set(q.id, q);
  });
  const pool = Array.from(mergedMap.values());

  let seed = (Date.now() + seedOffset * 9973) >>> 0;
  for (let i = 0; i < division.length; i++) {
    seed = (seed * 31 + division.charCodeAt(i)) >>> 0;
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(6, shuffled.length));
}

