import { MathLecture } from '../types';

export const MATH_EXTRA_10_LESSONS: MathLecture[] = [
  {
    id: 'math-ext-1',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    lessonNumber: 113,
    stageLabel: 'Chuyên đề Bồi dưỡng HSG & Olympic · Đại số Hàm số',
    sourceTag: 'VMO / Olympic 30-4 · Phương trình Hàm & Đa thức',
    title: 'Chuyên đề 1: Phương trình Hàm trên R & Đa thức Bất khả quy',
    grade: 'Chuyên Toán · Olympic (Lớp 10–12)',
    category: 'Đại số',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 16,
    description:
      'Làm chủ phương pháp thế biến đặc biệt, tính đơn ánh – toàn ánh, phương trình hàm Cauchy cộng tính / nhân tính và tiêu chuẩn Eisenstein cho đa thức bất khả quy trên Q[x].',
    mnemonics: [
      'Gặp $f(x + f(y)) = \\dots$: thử chứng minh $f$ đơn ánh trước bằng cách giả sử $f(a) = f(b)$.',
      'Phương trình hàm Cauchy $f(x+y) = f(x) + f(y)$ kết hợp tính bị chặn một phía hoặc đơn điệu suy ra $f(x) = cx$.',
      'Nghiệm hữu tỉ $\\frac{p}{q}$ (tối giản) của đa thức hệ số nguyên $\\sum a_k x^k = 0$: $p \\mid a_0$, $q \\mid a_n$.'
    ],
    commonTraps: [
      'Từ $f(x+y) = f(x) + f(y)$ trên $\\mathbb{R}$ vội suy ra $f(x) = cx$ mà chưa kiểm tra điều kiện liên tục, đơn điệu hay bị chặn.',
      'Khi thay $f(x) = 0$ hoặc $f(x) = x$ cần thử lại vào phương trình hàm ban đầu để loại nghiệm ngoại lai.'
    ],
    theory: [
      '1. Phương trình hàm Cauchy trên $\\mathbb{Q}$ và $\\mathbb{R}$: Mọi hàm cộng tính $f(x+y) = f(x) + f(y)$ thỏa $f(qx) = qf(x)$ với $\\forall q \\in \\mathbb{Q}$. Nếu $f$ liên tục tại một điểm, đơn điệu hoặc bị chặn trên một khoảng mở thì $f(x) = cx$ với $c = f(1)$.',
      '2. Kỹ thuật chứng minh đơn ánh – toàn ánh: Nếu vế phải chứa biểu thức bậc nhất theo một biến (như $x + f(y)$) mà biến đó chỉ xuất hiện một lần ở vế trái bên trong $f$, đặt $f(u) = f(v)$ sẽ lập tức chứng minh $u = v$ (đơn ánh) hoặc tìm được giá trị toàn ánh.',
      '3. Đa thức hệ số nguyên: Với mọi $P(x) \\in \\mathbb{Z}[x]$ và $a \\neq b \\in \\mathbb{Z}$, ta luôn có tính chất chia hết cốt lõi: $(a - b) \\mid (P(a) - P(b))$.',
      '4. Tiêu chuẩn Eisenstein: Đa thức $P(x) = a_n x^n + \\dots + a_0 \\in \\mathbb{Z}[x]$ bất khả quy trên $\\mathbb{Q}[x]$ nếu tồn tại số nguyên tố $p$ sao cho $p \\nmid a_n$, $p \\mid a_i$ ($0 \\le i < n$) và $p^2 \\nmid a_0$.'
    ],
    keyFormulas: [
      'f(x+y) = f(x) + f(y) \\implies f(qx) = qf(x)\\ (\\forall q \\in \\mathbb{Q})',
      '\\forall P \\in \\mathbb{Z}[x],\\ \\forall a \\neq b \\in \\mathbb{Z}:\\ (a - b) \\mid (P(a) - P(b))',
      'P(x) \\text{ thỏa } p \\nmid a_n,\\ p \\mid a_{n-1},\\dots,a_0,\\ p^2 \\nmid a_0 \\implies P \\text{ bất khả quy}'
    ],
    flashcards: [
      {
        front: 'Điều kiện nào giúp hàm cộng tính $f(x+y) = f(x)+f(y)$ trên $\\mathbb{R}$ bắt buộc có dạng $f(x) = cx$?',
        back: 'Chỉ cần một trong 3 điều kiện: (1) $f$ liên tục tại ít nhất 1 điểm; (2) $f$ đơn điệu trên một khoảng; (3) $f$ bị chặn (trên hoặc dưới) trên một khoảng có độ dài dương.',
        tip: 'Ví dụ nếu $f(x) \\ge 0$ với mọi $x > 0$ và $f$ cộng tính thì $f$ đồng biến nên $f(x) = cx$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Olympic Chuyên Toán · Phương trình hàm',
        question: 'Cho hàm $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa $f(x + y) = f(x) + f(y) + 2xy$ với mọi $x, y \\in \\mathbb{R}$ và $f(1) = 3$. Khi đó giá trị $f(4)$ bằng:',
        options: ['A. 24', 'B. 20', 'C. 16', 'D. 18'],
        correctIndex: 0,
        explanation:
          'Tính trực tiếp từ hệ thức hàm: $f(2) = f(1+1) = f(1)+f(1)+2\\cdot 1\\cdot 1 = 3+3+2 = 8$. Tiếp tục $f(4) = f(2+2) = f(2)+f(2)+2\\cdot 2\\cdot 2 = 8+8+8 = 24$.'
      },
      {
        source: 'Đề HSG Quốc gia · Đa thức hệ số nguyên',
        question: 'Đa thức $P(x) \\in \\mathbb{Z}[x]$ thỏa mãn $P(1) = 5$ và $P(5) = 19$. Giá trị nào sau đây KHÔNG thể là $P(3)$?',
        options: ['A. 10', 'B. 11', 'C. 13', 'D. 9'],
        correctIndex: 0,
        explanation:
          'Ta có $(3 - 1) \\mid (P(3) - P(1)) \\implies 2 \\mid (P(3) - 5)$ nên $P(3)$ phải là số lẻ! Đồng thời $(5 - 3) \\mid (P(5) - P(3)) \\implies 2 \\mid (19 - P(3))$ cũng cho $P(3)$ lẻ. Trong 4 đáp án chỉ có $10$ là số chẵn nên $10$ không thể là $P(3)$.'
      }
    ],
    essayProblems: [
      {
        source: 'Olympic Toán Học · Phương trình hàm',
        question:
          'Tìm tất cả các hàm số $f: \\mathbb{R} \\to \\mathbb{R}$ thỏa mãn $f(x^2 + f(y)) = y + (f(x))^2$ với mọi $x, y \\in \\mathbb{R}$.',
        hints: ['Thay $x = 0$ để chứng minh $f$ toàn ánh và tìm $f(0)$; sau đó biến đổi với $f(a) = f(b)$.'],
        solutionSteps: [
          'Bước 1: Đặt $x = 0$: $f(f(y)) = y + c^2$ với $c = f(0)$. Từ đây với mọi $z \\in \\mathbb{R}$, tồn tại $y = z - c^2$ sao cho $f(f(y)) = z$, suy ra $f$ toàn ánh; đồng thời nếu $f(y_1) = f(y_2)$ thì $y_1 = y_2$ nên $f$ đơn ánh.',
          'Bước 2: Chọn $x_0$ sao cho $f(x_0) = 0$ (tồn tại vì $f$ toàn ánh). Thay $x = x_0, y = 0$ được $f(x_0^2 + c) = 0 = f(x_0)$, do đơn ánh nên $x_0^2 + c = x_0$.',
          'Bước 3: Thay $y = 0$ và $x$ bất kì: $f(x^2 + c) = f(x)^2 \\ge 0$. Kết hợp $f(f(y)) = y + c^2$, thử $x = 0$: nếu $f(x) = x$, kiểm tra lại: $(x^2+y) = y+x^2$ (thỏa mãn). Ngược lại nếu có $x_1$ khác $0$, đặt $y = -x^2$ suy ra $c = 0$, khi đó $f(x^2) = f(x)^2$ và $f(f(y)) = y$. Với $x$ bất kì, $f(x+1)^2 = f((x+1)^2) = f(x^2+2x+1) = 2x+1 + f(x)^2$ nên $f(x) = x$.'
        ],
        finalAnswer: 'Hàm duy nhất thỏa mãn là $f(x) = x$ với mọi $x \\in \\mathbb{R}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: {
      type: 'cubic',
      params: { a: 1, b: 0, c: -3, d: 0 },
      color: '#6366f1',
      name: 'f(x) = x³ - 3x'
    }
  },
  {
    id: 'math-ext-2',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    lessonNumber: 114,
    stageLabel: 'Chuyên đề Bồi dưỡng HSG & Olympic · Bất đẳng thức',
    sourceTag: 'HSG Quốc gia · Bất đẳng thức Schur, SOS & Chebyshev',
    title: 'Chuyên đề 2: Bất đẳng thức Schur, Kỹ thuật SOS & Chuẩn hóa',
    grade: 'Chuyên Toán · Olympic (Lớp 10–12)',
    category: 'Đại số',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 15,
    description:
      'Khai thác sức mạnh của BĐT Schur bậc 3 và bậc 4, phân tích tổng bình phương S.O.S (Sum of Squares) $S_a(b-c)^2 + S_b(c-a)^2 + S_c(a-b)^2 \\ge 0$ và kỹ thuật chuẩn hóa cho BĐT thuần nhất.',
    mnemonics: [
      'Chuẩn hóa: BĐT thuần nhất theo $a, b, c$ có thể giả sử $a+b+c = 3$ hoặc $abc = 1$ để giảm bậc biểu thức.',
      'Schur bậc 3 dạng hệ quả cực mạnh: $abc \\ge (a+b-c)(b+c-a)(c+a-b)$ và $a^3+b^3+c^3+3abc \\ge ab(a+b)+bc(b+c)+ca(c+a)$.',
      'SOS: Viết vế trái trừ vế phải về $S_a(b-c)^2 + S_b(c-a)^2 + S_c(a-b)^2 \\ge 0$, kiểm tra $S_a, S_b, S_c \\ge 0$ hoặc $S_a + S_b \\ge 0, S_b + S_c \\ge 0$.'
    ],
    commonTraps: [
      'Áp dụng chuẩn hóa $a+b+c = 3$ cho bất đẳng thức KHÔNG thuần nhất là sai hoàn toàn.',
      'Trong BĐT Schur không được quên điều kiện các biến $a, b, c \\ge 0$.'
    ],
    theory: [
      '1. Bất đẳng thức Schur tổng quát: Với mọi số thực không âm $a, b, c$ và số thực $r > 0$, ta luôn có $a^r(a-b)(a-c) + b^r(b-c)(b-a) + c^r(c-a)(c-b) \\ge 0$. Trường hợp hay dùng nhất là $r = 1$ (Schur bậc 3) và $r = 2$ (Schur bậc 4).',
      '2. Hệ quả $p, q, r$: Đặt $p = a+b+c$, $q = ab+bc+ca$, $r = abc$. Từ Schur bậc 3 suy ra $r \\ge \\frac{4pq - p^3}{9}$ (nếu $4q > p^2$).',
      '3. Phương pháp S.O.S: Mọi BĐT đối xứng ba biến với dấu bằng tại $a = b = c$ đều có thể phân tích thành $\\sum_{\\text{cyc}} S_a (b - c)^2 \\ge 0$. Chỉ cần chứng minh các hệ số $S_a, S_b, S_c$ không âm hoặc thỏa tiêu chuẩn $S_b + S_c \\ge 0$ khi giả sử $a \\ge b \\ge c$.',
      '4. Bất đẳng thức Chebyshev: Với hai dãy cùng chiều đơn điệu $a_1 \\le \\dots \\le a_n$ và $b_1 \\le \\dots \\le b_n$, thì $\\frac{1}{n}\\sum a_i b_i \\ge \\left(\\frac{1}{n}\\sum a_i\\right)\\left(\\frac{1}{n}\\sum b_i\\right)$.'
    ],
    keyFormulas: [
      'a^3 + b^3 + c^3 + 3abc \\ge ab(a+b) + bc(b+c) + ca(c+a)',
      'abc \\ge \\frac{(a+b+c)(4(ab+bc+ca) - (a+b+c)^2)}{9}',
      '\\sum_{\\text{cyc}} S_a(b-c)^2 \\ge 0'
    ],
    flashcards: [
      {
        front: 'Dạng quy về $p, q, r$ của bất đẳng thức Schur bậc 3 với $p = a+b+c, q = ab+bc+ca, r = abc$ là gì?',
        back: '$9r \\ge p(4q - p^2) \\iff p^3 - 4pq + 9r \\ge 0$ với mọi $a, b, c \\ge 0$.',
        tip: 'Thay $p = 1$ ta được ngay $9r \\ge 4q - 1$, cực kì hữu dụng khi có giả thiết $a+b+c=1$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Bất đẳng thức Schur bậc 3 · $p, q, r$',
        question: 'Cho $a, b, c \\ge 0$ thỏa mãn $a + b + c = 3$. Giá trị nhỏ nhất của biểu thức $M = ab + bc + ca - abc$ bằng:',
        options: ['A. $0$', 'B. $2$', 'C. $1$', 'D. $\\frac{8}{9}$'],
        correctIndex: 0,
        explanation:
          'Vì $a, b, c \\ge 0$ và $a+b+c=3$: nếu cho $a = 3, b = c = 0$ thì $M = 0$. Chứng minh $M \\ge 0$: thực ra khi $a=b=c=1$ thì $M = 3 - 1 = 2$, còn tại $(3, 0, 0)$ thì $M = 0$! Do $ab+bc+ca - abc = ab(1-c) + c(a+b)$: nếu $c \\le 1$ thì hiển nhiên $\\ge 0$; nếu có 1 số $> 1$, giả sử $c > 1 \\implies a+b < 2 \\implies ab \\le 1$, hơn nữa $M = ab + c(a+b - ab) \\ge 0$ vì $a+b - ab = a + b(1-a) \\ge 0$ (do $a, b < 2$, cụ thể $ab \\le (\\frac{a+b}{2})^2 < a+b$ khi $a+b < 4$). Vậy GTNN là $0$ tại $(3, 0, 0)$.'
      },
      {
        source: 'Hệ quả Schur bậc 3 · Chọn điểm rơi',
        question: 'Cho $a, b, c > 0$ thỏa $a + b + c = 1$. Theo BĐT Schur bậc 3 ($p=1$), đánh giá đúng nhất cho $9abc$ theo $q = ab+bc+ca$ là:',
        options: ['A. $9abc \\ge 4q - 1$', 'B. $9abc \\le 4q - 1$', 'C. $9abc \\ge 1 - 4q$', 'D. $3abc \\ge q^2$'],
        correctIndex: 0,
        explanation:
          'Từ $p^3 - 4pq + 9r \\ge 0$ với $p = 1, q = ab+bc+ca, r = abc$, ta có $1 - 4q + 9abc \\ge 0 \\iff 9abc \\ge 4q - 1$.'
      }
    ],
    essayProblems: [
      {
        source: 'Chuyên Toán · Bất đẳng thức đối xứng',
        question:
          'Cho $a, b, c > 0$ thỏa $a + b + c = 3$. Chứng minh rằng $a^2 + b^2 + c^2 + abc \\ge 4$.',
        hints: ['Biến đổi $a^2+b^2+c^2 = p^2 - 2q = 9 - 2q$, rồi áp dụng BĐT Schur $9r \\ge p(4q-p^2) = 12q - 27$.'],
        solutionSteps: [
          'Bước 1: Đặt $p = a+b+c = 3$, $q = ab+bc+ca$, $r = abc$. Ta có $a^2+b^2+c^2 = 9 - 2q$.',
          'Bước 2: Nếu $q \\le \\frac{5}{2}$ thì $9 - 2q + r > 9 - 5 = 4$ (hiển nhiên đúng).',
          'Bước 3: Nếu $q > \\frac{5}{2}$, áp dụng BĐT Schur $r \\ge \\frac{12q - 27}{9} = \\frac{4q}{3} - 3$. Khi đó $9 - 2q + r \\ge 6 - \\frac{2q}{3}$. Vì $q \\le \\frac{p^2}{3} = 3$, suy ra $6 - \\frac{2q}{3} \\ge 6 - 2 = 4$.'
        ],
        finalAnswer: 'ĐPCM, dấu bằng xảy ra khi $a = b = c = 1$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: -2, c: 2, d: 0 },
      color: '#10b981',
      name: 'y = x² - 2x + 2'
    }
  },
  {
    id: 'math-ext-3',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    lessonNumber: 115,
    stageLabel: 'Chuyên đề Bồi dưỡng HSG · Giải tích Dãy số',
    sourceTag: 'HSG Tỉnh & VMO · Giới hạn Dãy số & Định lý Stolz',
    title: 'Chuyên đề 3: Dãy số Truy hồi, Định lý Stolz-Cesaro & Lagrange',
    grade: 'Chuyên Toán · Lớp 11–12',
    category: 'Giải tích',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 15,
    description:
      'Kỹ thuật tìm công thức tổng quát bằng phương trình đặc trưng, chứng minh hội tụ bằng định lý Weierstrass / ánh xạ co Banach (Lagrange) và tính giới hạn tỷ số tổng bằng Định lý Stolz-Cesaro.',
    mnemonics: [
      'Dãy đơn điệu và bị chặn thì hội tụ (Weierstrass).',
      'Stolz-Cesaro (dạng $\\frac{*}{\\infty}$): nếu $(y_n)$ tăng ngặt tới $+\\infty$ và $\\lim \\frac{x_{n+1}-x_n}{y_{n+1}-y_n} = L$ thì $\\lim \\frac{x_n}{y_n} = L$.',
      'Ánh xạ co: nếu $|f\'(x)| \\le q < 1$ trên khoảng chứa nghiệm $\\alpha$ thì $|u_{n+1}-\\alpha| \\le q|u_n-\\alpha| \\implies \\lim u_n = \\alpha$.'
    ],
    commonTraps: [
      'Áp dụng định lý Stolz-Cesaro khi mẫu số $(y_n)$ chưa chứng minh tăng ngặt (hoặc giảm ngặt) và tiến ra vô cùng.',
      'Chứng minh $\\lim u_n = L$ bằng cách chuyển qua giới hạn $L = f(L)$ trước khi chứng minh dãy $(u_n)$ thực sự có giới hạn!'
    ],
    theory: [
      '1. Phương trình đặc trưng cho dãy tuyến tính cấp 2: $u_{n+2} = au_{n+1} + bu_n$ giải qua $\\lambda^2 - a\\lambda - b = 0$. Nếu có 2 nghiệm phân biệt $\\lambda_1, \\lambda_2$ thì $u_n = c_1\\lambda_1^n + c_2\\lambda_2^n$; nếu nghiệm kép $\\lambda_0$ thì $u_n = (c_1 + c_2 n)\\lambda_0^n$.',
      '2. Phương pháp dãy con chẵn – lẻ: Với dãy $u_{n+1} = f(u_n)$ mà $f$ nghịch biến, hàm hợp $f(f(x))$ sẽ đồng biến! Ta xét riêng hai dãy con $(u_{2k})$ và $(u_{2k+1})$ để chứng minh cả hai cùng hội tụ về chung một giới hạn.',
      '3. Định lý Stolz-Cesaro: Cho $(y_n)$ tăng ngặt và $\\lim y_n = +\\infty$. Nếu $\\lim_{n\\to\\infty} \\frac{x_{n+1} - x_n}{y_{n+1} - y_n} = L \\in \\overline{\\mathbb{R}}$, thì $\\lim_{n\\to\\infty} \\frac{x_n}{y_n} = L$.',
      '4. Định lý Lagrange cho dãy truy hồi: Nếu $u_{n+1} = f(u_n)$ với $\\alpha = f(\\alpha)$ và $|f\'(x)| \\le q < 1$ trên miền đóng $I$ bất biến qua $f$, thì $(u_n)$ hội tụ về $\\alpha$ bất kể điểm khởi đầu $u_0 \\in I$.'
    ],
    keyFormulas: [
      '\\lim \\frac{x_{n+1} - x_n}{y_{n+1} - y_n} = L \\implies \\lim \\frac{x_n}{y_n} = L \\quad (y_n \\uparrow +\\infty)',
      '|u_{n+1} - \\alpha| = |f\'(c_n)|\\cdot|u_n - \\alpha| \\le q|u_n - \\alpha| \\implies u_n \\to \\alpha',
      '\\lim_{n\\to\\infty} \\frac{1}{n}\\sum_{k=1}^n a_k = \\lim_{n\\to\\infty} a_n'
    ],
    flashcards: [
      {
        front: 'Khi $f$ là hàm nghịch biến trong dãy $u_{n+1} = f(u_n)$, làm sao xét tính đơn điệu?',
        back: 'Hợp của hai hàm nghịch biến $g(x) = f(f(x))$ là hàm ĐỒNG BIẾN! Vì thế ta tách thành 2 dãy con chẵn $(u_{2k})$ và lẻ $(u_{2k+1})$, mỗi dãy con này đều đơn điệu.',
        tip: 'Nhớ chứng minh thêm $\\lim u_{2k} = \\lim u_{2k+1} = L$ bằng cách giải $f(f(L)) = L$ và kiểm tra nghiệm duy nhất.'
      }
    ],
    sampleProblems: [
      {
        source: 'Giải tích Dãy số · Định lý Stolz-Cesaro',
        question: 'Giá trị của giới hạn $L = \\lim_{n\\to\\infty} \\frac{1^3 + 2^3 + \\dots + n^3}{n^4}$ bằng:',
        options: ['A. $\\frac{1}{4}$', 'B. $\\frac{1}{2}$', 'C. $\\frac{1}{3}$', 'D. $1$'],
        correctIndex: 0,
        explanation:
          'Đặt $x_n = \\sum_{k=1}^n k^3$ và $y_n = n^4$ ($y_n \\uparrow +\\infty$). Theo định lý Stolz: $\\frac{x_{n+1}-x_n}{y_{n+1}-y_n} = \\frac{(n+1)^3}{(n+1)^4 - n^4} = \\frac{n^3 + 3n^2 + 3n + 1}{4n^3 + 6n^2 + 4n + 1} \\to \\frac{1}{4}$.'
      },
      {
        source: 'Dãy truy hồi · Phương trình đặc trưng',
        question: 'Cho dãy số $(u_n)$ thỏa $u_0 = 2, u_1 = 5$ và $u_{n+2} = 5u_{n+1} - 6u_n$ ($\\forall n \\ge 0$). Công thức tổng quát của $u_n$ là:',
        options: ['A. $2^n + 3^n$', 'B. $2\\cdot 3^n$', 'C. $3^n + 1$', 'D. $2^{n+1} + 3^{n-1}$'],
        correctIndex: 0,
        explanation:
          'Phương trình đặc trưng $\\lambda^2 - 5\\lambda + 6 = 0$ có 2 nghiệm $\\lambda = 2, \\lambda = 3$. Vậy $u_n = A\\cdot 2^n + B\\cdot 3^n$. Với $n=0: A+B=2$; $n=1: 2A+3B=5 \\implies A=1, B=1$. Suy ra $u_n = 2^n + 3^n$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề HSG · Dãy co hội tụ',
        question:
          'Cho dãy $(x_n)$ xác định bởi $x_1 = 1$ và $x_{n+1} = \\frac{1}{2}\\cos(x_n) + 1$ với mọi $n \\ge 1$. Chứng minh dãy $(x_n)$ hội tụ.',
        hints: ['Đặt $f(x) = \\frac{1}{2}\\cos x + 1$, tính $|f\'(x)|$ và dùng định lý Lagrange so sánh $|x_{n+1} - x_n|$.'],
        solutionSteps: [
          'Bước 1: Xét hàm $f(x) = \\frac{1}{2}\\cos x + 1$. Ta có $|f\'(x)| = \\left|-\\frac{1}{2}\\sin x\\right| \\le \\frac{1}{2} < 1$ với mọi $x \\in \\mathbb{R}$.',
          'Bước 2: Phương trình $f(x) = x$ có nghiệm duy nhất $\\alpha \\in [0,5; 1,5]$ vì $g(x) = f(x) - x$ nghịch biến ($g\'(x) < 0$) và $g(0) > 0, g(2) < 0$.',
          'Bước 3: Áp dụng định lý Lagrange cho $f$ trên đoạn giữa $x_n$ và $\\alpha$: $|x_{n+1} - \\alpha| = |f(x_n) - f(\\alpha)| \\le \\frac{1}{2}|x_n - \\alpha| \\le \\dots \\le \\frac{1}{2^n}|x_1 - \\alpha| \\to 0$ khi $n \\to \\infty$.'
        ],
        finalAnswer: 'Dãy $(x_n)$ hội tụ về nghiệm duy nhất $\\alpha$ của phương trình $\\frac{1}{2}\\cos x + 1 = x$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: {
      type: 'rational',
      params: { a: 2, b: 1, c: 1, d: 1 },
      color: '#0ea5e9',
      name: 'u_n = (2n+1)/(n+1)'
    }
  },
  {
    id: 'math-ext-4',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    lessonNumber: 116,
    stageLabel: 'Chuyên đề Bồi dưỡng HSG · Hình học Phẳng Olympic',
    sourceTag: 'Olympic Hình học · Đường tròn Euler, Điểm Miquel & Hàng Điều hòa',
    title: 'Chuyên đề 4: Đường tròn Euler 9 điểm, Điểm Miquel & Chùm Điều hòa',
    grade: 'Chuyên Toán · Hình học (Lớp 9–12)',
    category: 'Hình học',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 16,
    description:
      'Khám phá các cấu hình hình học Olympic bất biến: đường tròn Euler đi qua 9 điểm đặc biệt, định lý Miquel cho tứ giác toàn phần, cực – đối cực và chùm 4 đường thẳng điều hòa.',
    mnemonics: [
      'Đường tròn Euler 9 điểm có tâm là trung điểm $OH$ và bán kính bằng $R/2$.',
      'Tâm đường tròn Euler là tâm vị tự biến $O \\to H$ hay trung điểm nối trực tâm với ngoại tâm.',
      '4 đường thẳng tạo tứ giác toàn phần cắt nhau cho 4 đường tròn ngoại tiếp đồng quy tại 1 điểm (điểm Miquel).'
    ],
    commonTraps: [
      'Nhầm lẫn vị trí tâm đường tròn 9 điểm $E$ nằm trên đường thẳng Euler theo tỉ lệ $\\overrightarrow{OE} = \\frac{1}{2}\\overrightarrow{OH}$ chứ không phải trọng tâm $G$ ($\overrightarrow{OG} = \\frac{1}{3}\\overrightarrow{OH}$).',
      'Khi dùng hàng điểm điều hòa $(AB, CD) = -1$, phải chú ý thứ tự cặp điểm liên hợp $A, B$ và $C, D$.'
    ],
    theory: [
      '1. Đường tròn Euler (Đường tròn 9 điểm): Trong mọi tam giác $ABC$ không đều, 9 điểm sau cùng thuộc một đường tròn tâm $E$ (trung điểm $OH$), bán kính $\\frac{R}{2}$: 3 trung điểm cạnh $M_a, M_b, M_c$; 3 chân đường cao $H_a, H_b, H_c$; 3 trung điểm các đoạn $HA, HB, HC$ (điểm Euler).',
      '2. Đường thẳng Euler: Ngoại tâm $O$, trọng tâm $G$, tâm Euler $E$ và trực tâm $H$ thẳng hàng với $\\overrightarrow{OH} = 3\\overrightarrow{OG} = 2\\overrightarrow{OE}$.',
      '3. Định lý Miquel: Cho tứ giác $ABCD$ có $AB \\cap CD = E$, $AD \\cap BC = F$. Khi đó 4 đường tròn ngoại tiếp các tam giác $(EAD), (EBC), (FAB), (FDC)$ đồng quy tại điểm Miquel $M$. Hơn nữa $M$ nằm trên đường tròn đường kính $EF$ khi tứ giác $ABCD$ nội tiếp!',
      '4. Hàng điểm điều hòa & Hệ thức Maclaurin – Newton: Bốn điểm thẳng hàng $(A, B; C, D) = -1$ khi và chỉ khi $\\frac{CA}{CB} = \\frac{DA}{DB}$, tương đương $\\frac{2}{AB} = \\frac{1}{AC} + \\frac{1}{AD}$ (Descartes) hoặc $IA^2 = IB^2 = IC \\cdot ID$ với $I$ là trung điểm $AB$ (Newton).'
    ],
    keyFormulas: [
      'R_{\\text{Euler}} = \\frac{R}{2}, \\quad \\overrightarrow{OH} = 3\\overrightarrow{OG} = 2\\overrightarrow{OE}',
      '(A, B; C, D) = -1 \\iff IC \\cdot ID = IA^2 \\ (I \\text{ là trung điểm } AB)',
      '\\frac{2}{AB} = \\frac{1}{AC} + \\frac{1}{AD} \\ (C \\text{ nằm giữa } A, B)'
    ],
    flashcards: [
      {
        front: 'Ba bộ ba điểm nào hợp thành 9 điểm đặc biệt trên đường tròn Euler của $\\triangle ABC$?',
        back: '(1) 3 trung điểm 3 cạnh; (2) 3 chân đường cao; (3) 3 trung điểm các đoạn nối trực tâm $H$ với 3 đỉnh $A, B, C$. Bán kính bằng $R/2$.',
        tip: 'Chứng minh nhanh bằng phép vị tự tâm $H$ tỉ số $1/2$ biến $(O, R)$ thành đường tròn 9 điểm.'
      }
    ],
    sampleProblems: [
      {
        source: 'Hình học Chuyên · Đường tròn 9 điểm',
        question: 'Tam giác $ABC$ có bán kính đường tròn ngoại tiếp $R = 10\\text{ cm}$ và khoảng cách từ ngoại tâm $O$ đến trực tâm $H$ là $OH = 6\\text{ cm}$. Bán kính đường tròn Euler $R_E$ và khoảng cách $GE$ ($G$ là trọng tâm) lần lượt bằng:',
        options: [
          'A. $R_E = 5\\text{ cm},\\ GE = 1\\text{ cm}$',
          'B. $R_E = 5\\text{ cm},\\ GE = 2\\text{ cm}$',
          'C. $R_E = 2{,}5\\text{ cm},\\ GE = 1\\text{ cm}$',
          'D. $R_E = 5\\text{ cm},\\ GE = 3\\text{ cm}$'
        ],
        correctIndex: 0,
        explanation:
          'Bán kính đường tròn Euler $R_E = \\frac{R}{2} = 5\\text{ cm}$. Trên đường thẳng Euler: $OG = \\frac{1}{3}OH = 2\\text{ cm}$, $OE = \\frac{1}{2}OH = 3\\text{ cm}$ (cùng hướng từ $O$ đến $H$). Suy ra $GE = OE - OG = 3 - 2 = 1\\text{ cm}$.'
      },
      {
        source: 'Hình học Xạ ảnh · Hệ thức Newton',
        question: 'Cho hàng điểm điều hòa $(A, B; C, D) = -1$. Biết trung điểm $I$ của đoạn $AB$ cách $C$ một đoạn $IC = 4$ và $ID = 9$. Độ dài đoạn $AB$ bằng:',
        options: ['A. $12$', 'B. $6$', 'C. $13$', 'D. $5$'],
        correctIndex: 0,
        explanation:
          'Theo hệ thức Newton cho hàng điều hòa: $IA^2 = IB^2 = IC \\cdot ID = 4 \\cdot 9 = 36 \\implies IA = 6$. Vậy $AB = 2IA = 12$.'
      }
    ],
    essayProblems: [
      {
        source: 'Olympic Hình học · Đường tròn Euler',
        question:
          'Cho $\\triangle ABC$ nhọn có trực tâm $H$, ngoại tâm $O$, các đường cao $AD, BE, CF$ và trung điểm các cạnh là $M, N, P$, trung điểm $AH$ là $K$. Chứng minh rằng $K, M, D, E$ cùng nằm trên một đường tròn có tâm là trung điểm $OH$ và bán kính $R/2$.',
        hints: ['Gọi $K$ là trung điểm $AH$. Chứng minh $KM$ là đường kính của đường tròn 9 điểm (bằng $R$ và đi qua $D$ với $\\widehat{KDM} = 90^\\circ$).'],
        solutionSteps: [
          'Bước 1: Gọi $K$ là trung điểm $AH$, $M$ là trung điểm $BC$. Ta biết $\\overrightarrow{AH} = 2\\overrightarrow{OM}$ (tính chất trực tâm – ngoại tâm), suy ra $AK = KH = OM$ và $AK \\parallel OM$.',
          'Bước 2: Tứ giác $KOMH$ có $KH \\parallel OM$ và $KH = OM$ nên là hình bình hành. Do đó trung điểm $E$ của $OH$ cũng là trung điểm của $KM$. Hơn nữa $AKMO$ cũng là hình bình hành nên $KM = OA = R$.',
          'Bước 3: Vì $AD \\perp BC$, tam giác $KDM$ vuông tại $D$ nên $D$ thuộc đường tròn đường kính $KM$ tâm $E$, bán kính $R/2$. Tương tự cho các điểm còn lại.'
        ],
        finalAnswer: 'Đường tròn đường kính $KM$ có tâm $E$ (trung điểm $OH$) và bán kính $R/2$ đi qua cả 9 điểm.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'circle_theorems_3d'
  },
  {
    id: 'math-ext-5',
    track: 'chuyen',
    gradeGroup: 'Chuyên Toán',
    tier: 'Chuyên / HSG',
    lessonNumber: 117,
    stageLabel: 'Chuyên đề Bồi dưỡng HSG & Olympic · Số học Nâng cao',
    sourceTag: 'VMO / IMO · Phương trình Diophantine, LTE & Vieta Jumping',
    title: 'Chuyên đề 5: Số học Olympic — Đồng dư, Định lý LTE & Bước nhảy Vieta',
    grade: 'Chuyên Toán · Số học (Lớp 10–12)',
    category: 'Số học & Tổ hợp',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 17,
    description:
      'Giải quyết các bài toán Số học HSG Quốc gia bằng Bổ đề Nâng mũ LTE (Lifting The Exponent), phương trình Pell, bước nhảy Vieta (Vieta Jumping) và định lý phần dư Trung Hoa CRT.',
    mnemonics: [
      'Bổ đề LTE (với $p$ nguyên tố lẻ, $p \\mid x - y$, $p \\nmid x, y$): $v_p(x^n - y^n) = v_p(x - y) + v_p(n)$.',
      'Vieta Jumping: Gặp phương trình đối xứng kiểu $\\frac{a^2+b^2}{ab+1} = k$, cố định $b$ và thay $a$ bằng nghiệm thứ hai $a\' = kb - a < a$ để lùi vô hạn về trường hợp biên.',
      'Phương trình Pell $x^2 - dy^2 = 1$ ($d$ không chính phương) luôn có vô số nghiệm sinh bởi $(x_1 + y_1\\sqrt{d})^n$.'
    ],
    commonTraps: [
      'Áp dụng công thức LTE $v_p(x^n - y^n) = v_p(x-y) + v_p(n)$ khi $p = 2$ mà $n$ chẵn và $4 \\nmid (x-y)$ (với $p=2$, công thức là $v_2(x-y) + v_2(x+y) + v_2(n) - 1$).',
      'Quên kiểm tra điều kiện $\\gcd(m_i, m_j) = 1$ trước khi áp dụng Định lý phần dư Trung Hoa (CRT).'
    ],
    theory: [
      '1. Định lý Fermat nhỏ, Euler & Wilson: Với $\\gcd(a, n) = 1$, $a^{\\varphi(n)} \\equiv 1 \\pmod n$. Theo Wilson, $p$ là số nguyên tố khi và chỉ khi $(p-1)! \\equiv -1 \\pmod p$.',
      '2. Bổ đề Nâng mũ LTE (Lifting The Exponent Lemma): Cho $p$ nguyên tố lẻ, $x, y \\in \\mathbb{Z}$ sao cho $p \\mid (x - y)$ nhưng $p \\nmid x$ và $p \\nmid y$. Khi đó với mọi $n \\ge 1$: $v_p(x^n - y^n) = v_p(x - y) + v_p(n)$. Tương tự với $n$ lẻ và $p \\mid (x + y)$: $v_p(x^n + y^n) = v_p(x + y) + v_p(n)$.',
      '3. Kỹ thuật Bước nhảy Vieta (Vieta Jumping): Giả sử tồn tại cặp $(a, b)$ nguyên dương thỏa phương trình bậc hai đối xứng, chọn cặp có $a + b$ nhỏ nhất (với $a \\ge b$). Xét phương trình bậc hai ẩn $x$ giữ $b$ cố định, dùng Vi-ét suy ra nghiệm còn lại $x_2$, chứng minh $x_2$ nguyên, $0 \\le x_2 < a$ và buộc $x_2 = 0$ để tìm $k$.',
      '4. Số chính phương modulo $p$: Nếu $p \\equiv 3 \\pmod 4$ và $p \\mid (a^2 + b^2)$ thì bắt buộc $p \\mid a$ và $p \\mid b$ (do $-1$ không là thặng dư bậc hai mod $p$).'
    ],
    keyFormulas: [
      'v_p(x^n - y^n) = v_p(x - y) + v_p(n) \\quad (p \\text{ lẻ},\\ p \\mid x-y,\\ p \\nmid xy)',
      'v_2(x^n - y^n) = v_2(x-y) + v_2(x+y) + v_2(n) - 1 \\quad (n \\text{ chẵn},\\ 2 \\mid x-y)',
      'p \\equiv 3 \\pmod 4,\\ p \\mid (a^2 + b^2) \\implies p \\mid a \\land p \\mid b'
    ],
    flashcards: [
      {
        front: 'Tại sao nếu $p \\equiv 3 \\pmod 4$ là ước nguyên tố của $a^2 + b^2$ thì $p$ phải chia hết cả $a$ và $b$?',
        back: 'Nếu $p \\nmid a, b$ thì $a^{p-1} + b^{p-1} \\equiv 2 \\pmod p$, nhưng theo Fermat nhỏ $a^2 \\equiv -b^2 \\implies a^{p-1} \\equiv (-1)^{(p-1)/2} b^{p-1} = -b^{p-1}$ (vì $(p-1)/2$ lẻ), suy ra $a^{p-1}+b^{p-1} \\equiv 0 \\pmod p$, mâu thuẫn!',
        tip: 'Tính chất kinh điển để chứng minh phương trình Diophantine vô nghiệm!'
      }
    ],
    sampleProblems: [
      {
        source: 'Số học HSG · Định lý LTE',
        question: 'Số mũ đúng của $3$ trong phân tích thừa số nguyên tố của $A = 7^{45} - 4^{45}$ (tức $v_3(A)$) bằng:',
        options: ['A. $3$', 'B. $2$', 'C. $4$', 'D. $1$'],
        correctIndex: 0,
        explanation:
          'Vì $p = 3$ là số nguyên tố lẻ, $3 \\mid (7 - 4) = 3$ và $3 \\nmid 7, 3 \\nmid 4$. Áp dụng bổ đề LTE: $v_3(7^{45} - 4^{45}) = v_3(7 - 4) + v_3(45) = v_3(3) + v_3(9 \\cdot 5) = 1 + 2 = 3$.'
      },
      {
        source: 'Số học Olympic · Số chính phương & Mod 4',
        question: 'Số cặp số nguyên $(x, y)$ thỏa mãn phương trình $x^2 + y^2 = 2023\\cdot(z^2 + 1)$ khi $2023 = 7 \\cdot 17^2$ là:',
        options: ['A. $0$ cặp (Vô nghiệm)', 'B. $4$ cặp', 'C. $8$ cặp', 'D. Vô số cặp'],
        correctIndex: 0,
        explanation:
          'Để ý $7 \\equiv 3 \\pmod 4$, nên nếu $7 \\mid (x^2 + y^2)$ thì $7 \\mid x$ và $7 \\mid y$, dẫn đến $49 \\mid (x^2 + y^2)$. Trong khi $v_7(2023) = 1$ (lẻ) và $z^2 + 1$ không chia hết cho $7$ (vì $-1$ không là số chính phương mod 7), do đó $v_7(\\text{VP}) = 1$ (lẻ) còn $v_7(\\text{VT})$ luôn chẵn! Suy ra vô nghiệm.'
      }
    ],
    essayProblems: [
      {
        source: 'IMO 1988 · Bài toán Bước nhảy Vieta kinh điển',
        question:
          'Cho $a, b$ là các số nguyên dương sao cho $ab + 1$ chia hết $a^2 + b^2$. Đặt $k = \\frac{a^2 + b^2}{ab + 1}$. Chứng minh rằng $k$ là một số chính phương.',
        hints: ['Giả sử $k$ không chính phương, chọn cặp $(a, b)$ sao cho $a + b$ nhỏ nhất ($a \\ge b$) rồi xét phương trình $x^2 - kbx + (b^2 - k) = 0$.'],
        solutionSteps: [
          'Bước 1: Phản chứng: giả sử có cặp nguyên dương $(a, b)$ mà $k = \\frac{a^2+b^2}{ab+1}$ không là số chính phương. Trong các cặp tạo ra cùng giá trị $k$ đó, chọn cặp $(a, b)$ có $a + b$ nhỏ nhất và không mất tính tổng quát giả sử $a \\ge b \\ge 1$.',
          'Bước 2: Xem $a$ là một nghiệm của phương trình bậc hai $x^2 - (kb)x + (b^2 - k) = 0$. Nghiệm thứ hai $a\'$ thỏa $a\' = kb - a = \\frac{b^2 - k}{a} \\in \\mathbb{Z}$.',
          'Bước 3: Do $k$ không chính phương, $a\' = 0$ không thể xảy ra (vì nếu $b^2 - k = 0$ thì $k = b^2$). Nếu $a\' < 0$ thì $a\'^2 - kba\' + b^2 - k \\ge 1 + kb + b^2 - k = k(b-1) + b^2 + 1 > 0$, vô lý. Nếu $a\' \\ge a$ thì $b^2 - k = aa\' \\ge a^2 \\ge b^2 \\implies k \\le 0$, vô lý. Vậy $0 < a\' < a$, suy ra $a\' + b < a + b$, mâu thuẫn tính nhỏ nhất!'
        ],
        finalAnswer: '$k$ bắt buộc phải là số chính phương.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'conic_sections_3d',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 1, b: -5, c: 1, d: 0 },
      color: '#f59e0b',
      name: 'x² - kx + b² - k = 0'
    }
  },
  {
    id: 'math-ext-6',
    track: 'chuyen',
    gradeGroup: 'Lớp 12',
    tier: 'Nâng cao',
    lessonNumber: 118,
    stageLabel: 'Hình học Không gian Oxyz · Vận dụng Cao',
    sourceTag: 'Chuẩn GDPT 2018 Nâng cao · Hình học Oxyz',
    title: 'Chuyên đề 6: Góc Nhị diện, Đường vuông góc chung & Khoảng cách Oxyz',
    grade: 'Lớp 12 · Hình học Không gian',
    category: 'Hình học',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 14,
    description:
      'Làm chủ kỹ năng gắn hệ trục tọa độ Oxyz cho hình chóp/lăng trụ, xác định góc phẳng nhị diện, tính khoảng cách giữa 2 đường thẳng chéo nhau và viết phương trình đường vuông góc chung.',
    mnemonics: [
      'Góc nhị diện $[P, d, Q]$ có thể tù ($> 90^\\circ$) hoặc nhọn; cần chọn hai tia xuất phát từ giao tuyến $d$ cùng chiều vào 2 nửa mặt phẳng.',
      'Khoảng cách 2 đường chéo nhau: $d(\\Delta_1, \\Delta_2) = \\frac{|\\left[\\vec{u}_1, \\vec{u}_2\\right] \\cdot \\overrightarrow{M_1 M_2}|}{|\\left[\\vec{u}_1, \\vec{u}_2\\right]|}$.',
      'Đường vuông góc chung $\\Delta$ cắt $d_1$ tại $A(t_1)$ và $d_2$ tại $B(t_2)$ thỏa $\\overrightarrow{AB} \\cdot \\vec{u}_1 = 0$ và $\\overrightarrow{AB} \\cdot \\vec{u}_2 = 0$.'
    ],
    commonTraps: [
      'Nhầm góc giữa hai mặt phẳng (luôn $\\le 90^\\circ$, lấy $|\\cos\\varphi|$) với góc phẳng nhị diện (có thể $> 90^\\circ$, không được tự ý lấy trị tuyệt đối khi 2 góc khác hướng!).',
      'Chọn gốc tọa độ không vuông góc khi hình đáy là hình bình hành/thoi làm sai tích vô hướng.'
    ],
    theory: [
      '1. Góc phẳng nhị diện $[P, d, Q]$: Lấy điểm $O \\in d$, dựng $Ox \\subset (P), Oy \\subset (Q)$ cùng vuông góc với $d$ tại $O$. Khi đó $\\alpha = \\widehat{xOy} \\in (0^\\circ; 180^\\circ)$ chính là số đo góc nhị diện. Dùng tọa độ: $\\cos \\alpha = \\frac{\\overrightarrow{OA} \\cdot \\overrightarrow{OB}}{OA \\cdot OB}$ với $A \\in Ox, B \\in Oy$.',
      '2. Khoảng cách từ điểm $M_0(x_0; y_0; z_0)$ đến đường thẳng $\\Delta$ đi qua $M_1$ có VTCP $\\vec{u}$: $d(M_0, \\Delta) = \\frac{|\\left[\\overrightarrow{M_1 M_0}, \\vec{u}\\right]|}{|\\vec{u}|}$.',
      '3. Khoảng cách giữa hai đường thẳng chéo nhau $\\Delta_1(M_1, \\vec{u}_1)$ và $\\Delta_2(M_2, \\vec{u}_2)$ bằng chiều cao hình hộp dựng trên 3 vectơ $\\vec{u}_1, \\vec{u}_2, \\overrightarrow{M_1 M_2}$: chia trị tuyệt đối tích hỗn tạp cho độ dài tích có hướng $|[\\vec{u}_1, \\vec{u}_2]|$.',
      '4. Bài toán cực trị hình học không gian: Tìm điểm $M$ trên mặt phẳng $(P)$ hoặc mặt cầu $(S)$ tối ưu tổng bình phương khoảng cách hoặc góc tạo bởi đường và mặt.'
    ],
    keyFormulas: [
      'd(\\Delta_1, \\Delta_2) = \\frac{|[\\vec{u}_1, \\vec{u}_2] \\cdot \\overrightarrow{M_1 M_2}|}{|[\\vec{u}_1, \\vec{u}_2]|}',
      'd(M_0, \\Delta) = \\frac{|[\\overrightarrow{M_1 M_0}, \\vec{u}]|}{|\\vec{u}|}',
      '\\cos([P, d, Q]) = \\frac{\\overrightarrow{OA} \\cdot \\overrightarrow{OB}}{OA \\cdot OB} \\quad (OA \\perp d,\\ OB \\perp d)'
    ],
    flashcards: [
      {
        front: 'Phân biệt góc giữa hai mặt phẳng và số đo góc phẳng nhị diện?',
        back: 'Góc giữa hai mặt phẳng luôn thuộc $[0^\\circ; 90^\\circ]$ (lấy giá trị dương $\\cos\\varphi$). Số đo góc nhị diện $[P, a, Q]$ có thể nhọn hoặc tù trong khoảng $(0^\\circ; 180^\\circ)$.',
        tip: 'Với góc nhị diện trong Oxyz, tìm đúng 2 vectơ vuông góc giao tuyến hướng vào lòng mỗi nửa mặt phẳng rồi mới tính cos!'
      }
    ],
    sampleProblems: [
      {
        source: 'Hình học Oxyz 12 · Khoảng cách 2 đường chéo nhau',
        question:
          'Trong không gian $Oxyz$, cho đường thẳng $d_1: \\frac{x-1}{1} = \\frac{y}{1} = \\frac{z}{-1}$ đi qua $M_1(1;0;0)$ và đường thẳng $d_2: \\frac{x}{1} = \\frac{y-2}{-1} = \\frac{z-1}{0}$ đi qua $M_2(0;2;1)$. Khoảng cách giữa $d_1$ và $d_2$ bằng:',
        options: ['A. $\\frac{3}{\\sqrt{6}}$', 'B. $\\frac{4}{\\sqrt{6}}$', 'C. $\\frac{2}{\\sqrt{6}}$', 'D. $\\sqrt{6}$'],
        correctIndex: 0,
        explanation:
          'Ta có $\\vec{u}_1 = (1; 1; -1)$, $\\vec{u}_2 = (1; -1; 0)$, $\\overrightarrow{M_1 M_2} = (-1; 2; 1)$. Suy ra $[\\vec{u}_1, \\vec{u}_2] = (-1; -1; -2)$, độ dài $\\sqrt{6}$. Tích hỗn tạp $|(-1)(-1) + (-1)(2) + (-2)(1)| = |-3| = 3$. Vậy $d(d_1, d_2) = \\frac{3}{\\sqrt{6}}$.'
      },
      {
        source: 'Hình học 12 GDPT 2018 · Góc nhị diện',
        question: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$ và $SA = a$. Số đo góc phẳng nhị diện $[S, CD, A]$ bằng:',
        options: ['A. $45^\\circ$', 'B. $60^\\circ$', 'C. $30^\\circ$', 'D. $135^\\circ$'],
        correctIndex: 0,
        explanation:
          'Vì $CD \\perp AD$ và $CD \\perp SA \\implies CD \\perp (SAD) \\implies CD \\perp SD$. Do đó góc phẳng nhị diện $[S, CD, A]$ là $\\widehat{SDA}$. Tam giác $SAD$ vuông cân tại $A$ ($SA = AD = a$) nên $\\widehat{SDA} = 45^\\circ$.'
      }
    ],
    essayProblems: [
      {
        source: 'Oxyz Nâng cao · Đường vuông góc chung',
        question:
          'Trong Oxyz, viết phương trình đường vuông góc chung của $d_1: \\frac{x-1}{1} = \\frac{y-2}{1} = \\frac{z}{-1}$ và $d_2: \\frac{x}{1} = \\frac{y}{-1} = \\frac{z-1}{2}$.',
        hints: ['Tham số hóa $A(1+t; 2+t; -t) \\in d_1$ và $B(s; -s; 1+2s) \\in d_2$, giải hệ $\\overrightarrow{AB}\\cdot\\vec{u}_1 = 0$ và $\\overrightarrow{AB}\\cdot\\vec{u}_2 = 0$.'],
        solutionSteps: [
          'Bước 1: $A(1+t; 2+t; -t) \\in d_1$ ($\vec{u}_1 = (1;1;-1)$), $B(s; -s; 1+2s) \\in d_2$ ($\\vec{u}_2 = (1;-1;2)$).',
          'Bước 2: $\\overrightarrow{AB} = (s-t-1;\\ -s-t-2;\\ 2s+t+1)$. Giải $\\overrightarrow{AB}\\cdot\\vec{u}_1 = 0 \\iff -2s - 3t - 4 = 0$ và $\\overrightarrow{AB}\\cdot\\vec{u}_2 = 0 \\iff 6s + 2t + 3 = 0$.',
          'Bước 3: Tìm được $s = -\\frac{1}{14},\\ t = -\\frac{9}{7}$ (từ đó xác định điểm $A$ và vectơ chỉ phương $\\overrightarrow{AB}$ tỉ lệ với $[\\vec{u}_1, \\vec{u}_2] = (1; -3; -2)$).'
        ],
        finalAnswer: 'Đường vuông góc chung qua $A\\left(-\\frac{2}{7}; \\frac{5}{7}; \\frac{9}{7}\\right)$ có VTCP $\\vec{u} = (1; -3; -2)$.'
      }
    ],
    sim2dMode: 'geometry',
    sim3dMode: 'line_plane_oxyz'
  },
  {
    id: 'math-ext-7',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    tier: 'Nâng cao',
    lessonNumber: 119,
    stageLabel: 'Giải tích 12 · Ứng dụng Tích phân Thực tiễn',
    sourceTag: 'Chuẩn GDPT 2018 · Thể tích Khối tròn xoay & Thiết diện',
    title: 'Chuyên đề 7: Thể tích Vật thể Tròn xoay Phức hợp & Thiết diện Vuông góc',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 13,
    description:
      'Tính thể tích khối tròn xoay giới hạn bởi nhiều đường cong (vòng đệm / hình vành khăn), thể tích vật thể có thiết diện $S(x)$ vuông góc trục $Ox$ (chỏm cầu, đống cát, bồn chứa nghiêng).',
    mnemonics: [
      'Cắt vuông góc Ox có thiết diện $S(x)$: $V = \\int_a^b S(x)\\,dx$ (KHÔNG nhân thêm $\\pi$ nếu $S(x)$ đã tính sẵn diện tích!).',
      'Quay quanh Ox miền kẹp giữa hai đồ thị cùng phía Ox: $V = \\pi \\int_a^b \\left|f^2(x) - g^2(x)\\right|dx$.',
      'Không nhầm $\\pi \\int [f(x)-g(x)]^2 dx$ với $\\pi \\int |f^2(x)-g^2(x)| dx$!'
    ],
    commonTraps: [
      'Khi hai đường $y = f(x)$ và $y = g(x)$ nằm hai phía khác nhau của trục $Ox$, nếu quay quanh $Ox$ phải xét phần chồng lấn hình học chứ không trừ máy móc $|f^2 - g^2|$.',
      'Quên nhân $\\pi$ trong công thức quay quanh trục $Ox$, hoặc ngược lại nhân nhầm $\\pi$ vào bài toán thiết diện $S(x)$ tổng quát.'
    ],
    theory: [
      '1. Công thức tổng quát theo thiết diện: Một vật thể giới hạn bởi hai mặt phẳng $x = a, x = b$ ($a < b$) và có diện tích thiết diện cắt bởi mặt phẳng vuông góc $Ox$ tại hoành độ $x$ là hàm liên tục $S(x)$, khi đó $V = \\int_a^b S(x)\\,dx$.',
      '2. Thể tích khối tròn xoay giữa 2 đường: Cho $0 \\le g(x) \\le f(x)$ trên $[a; b]$. Khi quay hình phẳng giới hạn bởi $y = f(x), y = g(x), x = a, x = b$ quanh trục $Ox$, mỗi lát cắt là hình vành khăn có diện tích $S(x) = \\pi(f^2(x) - g^2(x))$, suy ra $V = \\pi \\int_a^b (f^2(x) - g^2(x))\\,dx$.',
      '3. Mô hình bồn chứa trụ nằm ngang / chỏm cầu: Gắn trục tọa độ vào tâm đáy hoặc tâm mặt cầu, biểu diễn cạnh/bán kính thiết diện $r(x)$ theo định lý Pitago $r^2(x) = R^2 - x^2$.',
      '4. Quay quanh trục $Oy$: Khi biểu diễn được $x = h(y)$ trên $[c; d]$, thể tích quay quanh $Oy$ là $V_y = \\pi \\int_c^d h^2(y)\\,dy$.'
    ],
    keyFormulas: [
      'V = \\int_a^b S(x)\\,dx',
      'V_{Ox} = \\pi \\int_a^b \\left|f^2(x) - g^2(x)\\right|\\,dx \\quad (f(x)\\cdot g(x) \\ge 0)',
      'V_{\\text{chỏm cầu}} = \\pi h^2\\left(R - \\frac{h}{3}\\right)'
    ],
    flashcards: [
      {
        front: 'Vì sao thể tích quay hình phẳng kẹp giữa $y = x$ và $y = x^2$ quanh $Ox$ KHÔNG PHẢI là $\\pi \\int_0^1 (x - x^2)^2 dx$?',
        back: 'Vì mỗi lát cắt tại $x$ là một hình vành khăn có bán kính ngoài $x$ và bán kính trong $x^2$, diện tích là $\\pi(x^2 - (x^2)^2) = \\pi(x^2 - x^4)$, chứ không phải $\\pi(x - x^2)^2$!',
        tip: 'Luôn nhớ quy tắc "bình phương trước, trừ sau": $f^2(x) - g^2(x)$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Tốt nghiệp THPT · Thể tích tròn xoay',
        question: 'Quay hình phẳng giới hạn bởi $y = \\sqrt{x}$, $y = x$ trên đoạn $[0; 1]$ quanh trục $Ox$. Thể tích khối tròn xoay tạo thành bằng:',
        options: ['A. $\\frac{\\pi}{6}$', 'B. $\\frac{\\pi}{3}$', 'C. $\\frac{\\pi}{30}$', 'D. $\\frac{\\pi}{2}$'],
        correctIndex: 0,
        explanation:
          'Trên $[0; 1]$ có $\\sqrt{x} \\ge x \\ge 0$. Vậy $V = \\pi \\int_0^1 \\left((\\sqrt{x})^2 - x^2\\right)dx = \\pi \\int_0^1 (x - x^2)dx = \\pi\\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 = \\frac{\\pi}{6}$.'
      },
      {
        source: 'Ứng dụng Tích phân · Thiết diện tam giác đều',
        question: 'Vật thể nằm giữa $x = 0$ và $x = 2$, thiết diện vuông góc $Ox$ tại $x$ là tam giác đều cạnh $\\sqrt{x}$. Thể tích vật thể bằng:',
        options: ['A. $\\frac{\\sqrt{3}}{2}$', 'B. $\\frac{\\pi\\sqrt{3}}{2}$', 'C. $\\sqrt{3}$', 'D. $\\frac{2\\sqrt{3}}{3}$'],
        correctIndex: 0,
        explanation:
          'Diện tích tam giác đều cạnh $a = \\sqrt{x}$ là $S(x) = \\frac{a^2\\sqrt{3}}{4} = \\frac{x\\sqrt{3}}{4}$. Thể tích $V = \\int_0^2 \\frac{\\sqrt{3}}{4}x\\,dx = \\frac{\\sqrt{3}}{4} \\cdot \\left.\\frac{x^2}{2}\\right|_0^2 = \\frac{\\sqrt{3}}{2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Thực tế THPT · Thể tích chỏm cầu',
        question: 'Chứng minh công thức thể tích chỏm cầu có chiều cao $h$ cắt từ khối cầu bán kính $R$: $V = \\pi h^2\\left(R - \\frac{h}{3}\\right)$.',
        hints: ['Quay cung tròn $y = \\sqrt{R^2 - x^2}$ từ $x = R - h$ đến $x = R$ quanh trục $Ox$.'],
        solutionSteps: [
          'Bước 1: Chỏm cầu chiều cao $h$ sinh ra khi quay nửa đường tròn $y = \\sqrt{R^2 - x^2}$ trên đoạn $[R-h; R]$ quanh $Ox$.',
          'Bước 2: $V = \\pi \\int_{R-h}^R (R^2 - x^2)\\,dx = \\pi \\left[R^2 x - \\frac{x^3}{3}\\right]_{R-h}^R$.',
          'Bước 3: Rút gọn $V = \\pi\\left(\\frac{2}{3}R^3 - R^2(R-h) + \\frac{(R-h)^3}{3}\\right) = \\pi h^2\\left(R - \\frac{h}{3}\\right)$.'
        ],
        finalAnswer: '$V = \\pi h^2\\left(R - \\frac{h}{3}\\right)$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'revolution_solid',
    defaultGraphConfig: {
      type: 'sqrt',
      params: { a: 1, b: 4, c: 0, d: 0 },
      showIntegral: true,
      integralA: 0,
      integralB: 4,
      color: '#ec4899',
      name: 'y = √(4x)'
    }
  },
  {
    id: 'math-ext-8',
    track: 'chuyen',
    gradeGroup: 'Lớp 12',
    tier: 'Chuyên / HSG',
    lessonNumber: 120,
    stageLabel: 'Giải tích 12 · Tích phân Hàm ẩn & Đối xứng',
    sourceTag: 'Đề Tham khảo Bộ GD & Chuyên · Tích phân Nâng cao',
    title: 'Chuyên đề 8: Tích phân Hàm Ẩn, Đổi biến King\'s Property & Phương trình Vi phân',
    grade: 'Lớp 12 - Giải tích',
    category: 'Giải tích',
    difficulty: 'Vận dụng cao',
    readTimeMinutes: 15,
    description:
      'Giải nhanh các câu 9+ tích phân hàm ẩn bằng đồng nhất đạo hàm $(u\\cdot v)\'$, đổi biến đối xứng $t = a + b - x$ (King\'s property), hàm chẵn/lẻ và đưa về bình phương hoàn hảo.',
    mnemonics: [
      'King\'s Property: $\\int_a^b f(x)\\,dx = \\int_a^b f(a + b - x)\\,dx$. Cộng 2 vế nếu $f(x) + f(a+b-x) = \\text{const}$.',
      'Hàm chẵn trên $[-a; a]$: $\\int_{-a}^a \\frac{f(x)}{1 + b^x}\\,dx = \\int_0^a f(x)\\,dx$.',
      'Gặp $f\'(x) + p(x)f(x) = q(x)$: nhân cả hai vế với thừa số tích phân $e^{\\int p(x)\\,dx}$ để tạo đạo hàm tích!'
    ],
    commonTraps: [
      'Quên đổi cận tích phân khi thực hiện phép đặt $t = a + b - x$ hoặc $t = \\varphi(x)$.',
      'Khi lấy nguyên hàm từ phương trình vi phân $f\'(x) = \\dots$ quên tìm hằng số $C$ từ điều kiện $f(x_0) = y_0$.'
    ],
    theory: [
      '1. Tính chất đối xứng cận (King\'s Property): Với mọi hàm $f$ liên tục trên $[a; b]$, đặt $t = a + b - x$ cho $\\int_a^b f(x)\\,dx = \\int_a^b f(a+b-x)\\,dx$. Đặc biệt hữu ích khi $f(x) + f(a+b-x)$ rút gọn thành hàm đơn giản.',
      '2. Tích phân hàm chẵn với mẫu mũ $\\int_{-a}^a \\frac{f(x)}{1 + c^x}\\,dx$: Khi $f(-x) = f(x)$, đặt $t = -x$ và cộng với tích phân ban đầu thu được ngay $\\int_0^a f(x)\\,dx$ độc lập với $c > 0$.',
      '3. Phương pháp thừa số tích phân cho hàm ẩn: Gặp $f\'(x) + k f(x) = g(x)$, nhân hai vế cho $e^{kx}$ thành $(e^{kx}f(x))\' = e^{kx}g(x)$. Gặp $xf\'(x) + nf(x) = g(x)$, nhân với $x^{n-1}$ thành $(x^n f(x))\' = x^{n-1}g(x)$.',
      '4. Đánh giá bất đẳng thức tích phân (Cauchy-Schwarz): $\\left(\\int_a^b f(x)g(x)\\,dx\\right)^2 \\le \\int_a^b f^2(x)\\,dx \\cdot \\int_a^b g^2(x)\\,dx$; dấu bằng khi $f(x) = kg(x)$.'
    ],
    keyFormulas: [
      '\\int_a^b f(x)\\,dx = \\int_a^b f(a+b-x)\\,dx',
      '\\int_{-a}^a \\frac{f(x)}{1+c^x}\\,dx = \\int_0^a f(x)\\,dx \\quad (f \\text{ chẵn},\\ c > 0)',
      '\\left(e^{kx}f(x)\\right)\' = e^{kx}\\left(f\'(x) + kf(x)\\right)'
    ],
    flashcards: [
      {
        front: 'Thừa số cần nhân vào phương trình $xf\'(x) + 3f(x) = g(x)$ để vế trái thành đạo hàm một tích là gì?',
        back: 'Nhân hai vế với $x^2$ (với $x \\neq 0$), ta được $x^3 f\'(x) + 3x^2 f(x) = \\left(x^3 f(x)\\right)\' = x^2 g(x)$.',
        tip: 'Tổng quát: $xf\'(x) + nf(x)$ nhân với $x^{n-1}$ ra $(x^n f(x))\'$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Tích phân đối xứng · King\'s Property',
        question: 'Giá trị của tích phân $I = \\int_0^{\\frac{\\pi}{2}} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x}\\,dx$ bằng:',
        options: ['A. $\\frac{\\pi}{4}$', 'B. $\\frac{\\pi}{2}$', 'C. $\\frac{\\pi}{3}$', 'D. $\\frac{\\pi}{6}$'],
        correctIndex: 0,
        explanation:
          'Đặt $t = \\frac{\\pi}{2} - x$ cho $I = \\int_0^{\\pi/2} \\frac{\\cos^3 t}{\\cos^3 t + \\sin^3 t}\\,dt$. Cộng hai tích phân: $2I = \\int_0^{\\pi/2} 1\\,dx = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}$.'
      },
      {
        source: 'Tích phân hàm ẩn · Thừa số tích phân',
        question: 'Cho hàm $f(x)$ liên tục trên $\\mathbb{R}$ thỏa $f\'(x) + 2f(x) = 2e^{-2x}$ với mọi $x$ và $f(0) = 1$. Giá trị của $f(1)$ là:',
        options: ['A. $3e^{-2}$', 'B. $2e^{-2}$', 'C. $e^{-2}$', 'D. $4e^{-2}$'],
        correctIndex: 0,
        explanation:
          'Nhân hai vế với $e^{2x}$: $(e^{2x}f(x))\' = 2 \\implies e^{2x}f(x) = 2x + C$. Thay $x=0, f(0)=1 \\implies C = 1$. Vậy $f(x) = (2x+1)e^{-2x} \\implies f(1) = 3e^{-2}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Vận dụng cao · Tích phân hàm chẵn',
        question: 'Tính tích phân $J = \\int_{-1}^1 \\frac{x^2 + 1}{1 + 2025^x}\\,dx$.',
        hints: ['Đặt $t = -x$ rồi cộng hai biểu thức của $J$.'],
        solutionSteps: [
          'Bước 1: Đặt $t = -x \\implies dx = -dt$. Đổi cận: $x = -1 \\to t = 1$, $x = 1 \\to t = -1$.',
          'Bước 2: $J = \\int_{-1}^1 \\frac{t^2+1}{1 + 2025^{-t}}\\,dt = \\int_{-1}^1 \\frac{2025^x(x^2+1)}{2025^x + 1}\\,dx$.',
          'Bước 3: Cộng với $J$ ban đầu: $2J = \\int_{-1}^1 (x^2+1)\\,dx = 2\\int_0^1 (x^2+1)\\,dx = 2\\left(\\frac{1}{3}+1\\right) = \\frac{8}{3} \\implies J = \\frac{4}{3}$.'
        ],
        finalAnswer: '$J = \\frac{4}{3}$.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'integral_disks_3d',
    defaultGraphConfig: {
      type: 'trig_sin',
      params: { a: 2, b: 1, c: 0, d: 0 },
      showIntegral: true,
      integralA: 0,
      integralB: 3.14,
      color: '#8b5cf6',
      name: 'y = 2sin(x)'
    }
  },
  {
    id: 'math-ext-9',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    tier: 'Nâng cao',
    lessonNumber: 121,
    stageLabel: 'Toán Thực Tế GDPT 2018 · Tối ưu hóa & Kinh tế',
    sourceTag: 'Chuẩn GDPT 2018 · Bài toán Tối ưu Logistics & Lợi nhuận',
    title: 'Chuyên đề 9: Toán Thực Tế Tối ưu Logistics, Quy hoạch Tuyến tính & Chi phí Biên',
    grade: 'Lớp 10–12 · Toán Thực Tế',
    category: 'Giải tích',
    difficulty: 'Vận dụng',
    readTimeMinutes: 13,
    description:
      'Mô hình hóa các bài toán tối ưu chuỗi cung ứng, đường đi nhanh nhất kết hợp tốc độ khác nhau (Định luật Fermat), chi phí biên $C\'(x)$ và miền nghiệm bất phương trình tuyến tính 2 biến.',
    mnemonics: [
      'Quy hoạch tuyến tính: Giá trị cực đại/tiểu của hàm mục tiêu $F = ax + by$ luôn đạt tại một trong các ĐỈNH của đa giác miền nghiệm.',
      'Chi phí trung bình $\\overline{C}(x) = \\frac{C(x)}{x}$ đạt cực tiểu khi chi phí trung bình bằng chi phí biên: $\\overline{C}(x) = C\'(x)$.',
      'Đặt ẩn hình học chính xác + xác định miền giá trị thực tế $(0 < x < L)$ trước khi tìm đạo hàm $f\'(x) = 0$.'
    ],
    commonTraps: [
      'Tính điểm dừng $x_0$ từ $f\'(x) = 0$ nhưng quên kiểm tra xem $x_0$ có nằm trong đoạn/khoảng ràng buộc thực tế của bài toán hay không.',
      'Trong bài toán đặt giá vé / tăng giảm số lượng, nhầm dấu giữa mức tăng giá và mức giảm khách hàng.'
    ],
    theory: [
      '1. Chi phí biên & Doanh thu biên trong kinh tế học: Cho tổng chi phí sản xuất $x$ sản phẩm là $C(x)$ và tổng doanh thu $R(x) = p(x)\\cdot x$. Lợi nhuận $L(x) = R(x) - C(x)$ đạt cực đại tại điểm $L\'(x) = 0 \\iff R\'(x) = C\'(x)$ (Doanh thu biên bằng Chi phí biên).',
      '2. Cực tiểu hóa chi phí trung bình: Chi phí bình quân $\\overline{C}(x) = \\frac{C(x)}{x}$. Đạo hàm $\\overline{C}\'(x) = \\frac{xC\'(x) - C(x)}{x^2} = 0 \\iff C\'(x) = \\frac{C(x)}{x} = \\overline{C}(x)$.',
      '3. Mô hình tối ưu tuyến đường Logistics (Nguyên lý thời gian tối thiểu): Khi vận chuyển hàng qua hai môi trường có vận tốc $v_1$ (đường bộ) và $v_2$ (đường sông/biển), tổng thời gian $T(x) = \\frac{\\sqrt{a^2+x^2}}{v_2} + \\frac{L - x}{v_1}$ đạt GTNN tại $\\frac{x}{\\sqrt{a^2+x^2}} = \\frac{v_2}{v_1}$ (tương tự định luật khúc xạ ánh sáng Snell!).',
      '4. Quy hoạch tuyến tính 2 biến: Miền nghiệm hệ bất phương trình bậc nhất hai ẩn là miền đa giác lồi; chỉ cần tính tọa độ các đỉnh đa giác rồi thay vào biểu thức $F(x, y) = ax + by$ để chọn Max/Min.'
    ],
    keyFormulas: [
      'L_{\\max} \\iff R\'(x) = C\'(x) \\quad (\\text{Doanh thu biên = Chi phí biên})',
      '\\overline{C}_{\\min} \\iff C\'(x) = \\frac{C(x)}{x}',
      '\\sin\\theta_{\\text{tối ưu}} = \\frac{v_2}{v_1} \\quad (\\text{Định luật Snell tối ưu thời gian})'
    ],
    flashcards: [
      {
        front: 'Tại mức sản lượng nào thì lợi nhuận $L(x) = R(x) - C(x)$ đạt cực đại (nếu tồn tại cực trị trong)?',
        back: 'Tại $L\'(x) = 0 \\iff R\'(x) = C\'(x)$, tức Doanh thu biên bằng Chi phí biên và $L\'\'(x) < 0$.',
        tip: 'Nếu bài toán cho $x$ nguyên, nhớ kiểm tra hai số nguyên lân cận hai bên điểm cực trị!'
      }
    ],
    sampleProblems: [
      {
        source: 'Toán Thực tế 12 · Tối ưu Chi phí',
        question:
          'Chi phí sản xuất $x$ nghìn sản phẩm của một nhà máy được cho bởi $C(x) = 0{,}5x^2 + 4x + 50$ (triệu đồng, $x > 0$). Mức sản lượng $x$ để chi phí trung bình $\\overline{C}(x) = \\frac{C(x)}{x}$ thấp nhất là:',
        options: ['A. $x = 10$ nghìn', 'B. $x = 5$ nghìn', 'C. $x = 20$ nghìn', 'D. $x = 8$ nghìn'],
        correctIndex: 0,
        explanation:
          'Ta có $\\overline{C}(x) = 0{,}5x + 4 + \\frac{50}{x}$. Áp dụng AM-GM cho hai số dương $0{,}5x$ và $\\frac{50}{x}$ (hoặc giải $\\overline{C}\'(x) = 0{,}5 - \\frac{50}{x^2} = 0$): suy ra $x^2 = 100 \\implies x = 10$ (nghìn sản phẩm).'
      },
      {
        source: 'Toán Thực tế · Tối ưu doanh thu',
        question: 'Một rạp chiếu phim bán vé $100$ nghìn đồng thì có $300$ khách. Cứ giảm giá vé $5$ nghìn đồng thì có thêm $30$ khách. Giá vé mới để doanh thu lớn nhất là:',
        options: ['A. $75$ nghìn đồng', 'B. $80$ nghìn đồng', 'C. $70$ nghìn đồng', 'D. $85$ nghìn đồng'],
        correctIndex: 0,
        explanation:
          'Gọi số lần giảm $5$ nghìn đồng là $t$. Doanh thu $R(t) = (100 - 5t)(300 + 30t) = 150(20 - t)(10 + t)$. Hàm bậc hai đạt cực đại tại trung điểm $t = \\frac{20 - 10}{2} = 5$. Giá vé tối ưu: $100 - 5\\cdot 5 = 75$ nghìn đồng.'
      }
    ],
    essayProblems: [
      {
        source: 'Toán 12 · Bài toán Đưa cáp qua sông',
        question:
          'Một nhà máy điện $A$ bên bờ sông rộng $3\\text{ km}$ cần kéo dây cáp đến trạm $B$ bên kia bờ, cách hình chiếu $H$ của $A$ một đoạn $HB = 8\\text{ km}$. Chi phí kéo $1\\text{ km}$ cáp dưới nước là $5$ tỉ đồng, trên bờ là $3$ tỉ đồng. Tìm vị trí điểm $M$ trên đoạn $HB$ để tổng chi phí kéo từ $A \\to M \\to B$ nhỏ nhất.',
        hints: ['Đặt $HM = x$ ($0 \\le x \\le 8$), viết hàm tổng chi phí $C(x) = 5\\sqrt{9 + x^2} + 3(8 - x)$.'],
        solutionSteps: [
          'Bước 1: Đặt $HM = x$ ($0 \\le x \\le 8$), ta có $AM = \\sqrt{3^2 + x^2} = \\sqrt{9 + x^2}$ và $MB = 8 - x$.',
          'Bước 2: Tổng chi phí $C(x) = 5\\sqrt{9 + x^2} + 3(8 - x)$. Đạo hàm $C\'(x) = \\frac{5x}{\\sqrt{9 + x^2}} - 3$.',
          'Bước 3: Giải $C\'(x) = 0 \\iff 5x = 3\\sqrt{9 + x^2} \\iff 25x^2 = 81 + 9x^2 \\iff 16x^2 = 81 \\implies x = \\frac{9}{4} = 2{,}25\\text{ km} \\in [0; 8]$.',
          'Bước 4: Lập bảng biến thiên suy ra GTNN đạt tại $x = 2{,}25\\text{ km}$ với $C_{\\min} = 5\\cdot\\frac{15}{4} + 3\\cdot 5{,}75 = 36$ tỉ đồng.'
        ],
        finalAnswer: 'Điểm $M$ cách $H$ một đoạn $2{,}25\\text{ km}$; chi phí nhỏ nhất là $36$ tỉ đồng.'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'tangent_surface_3d',
    defaultGraphConfig: {
      type: 'quadratic',
      params: { a: 0.5, b: -4, c: 10, d: 0 },
      showTangent: true,
      tangentX0: 4,
      color: '#f97316',
      name: 'C(x) = 0.5x² - 4x + 10'
    }
  },
  {
    id: 'math-ext-10',
    track: 'khong_chuyen',
    gradeGroup: 'Lớp 12',
    tier: 'Nâng cao',
    lessonNumber: 122,
    stageLabel: 'Xác suất & Thống kê 12 GDPT 2018 · Chuyên sâu',
    sourceTag: 'Chuẩn GDPT 2018 Mới · Xác suất Có điều kiện & Bayes',
    title: 'Chuyên đề 10: Công thức Xác suất Toàn phần, Định lý Bayes & Phân phối Nhị thức',
    grade: 'Lớp 12 - Xác suất Thống kê',
    category: 'Đại số & Xác suất',
    difficulty: 'Vận dụng',
    readTimeMinutes: 14,
    description:
      'Làm chủ mạch kiến thức mới trọng tâm của chương trình GDPT 2018 Lớp 12: cây xác suất, công thức xác suất toàn phần, định lý Bayes cập nhật niềm tin, phân phối Bernoulli – Nhị thức $B(n, p)$ và kỳ vọng toán $E(X)$.',
    mnemonics: [
      'Xác suất toàn phần: $P(B) = P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A})$ (cộng các nhánh dẫn tới $B$ trên sơ đồ cây).',
      'Công thức Bayes (lật ngược điều kiện): $P(A|B) = \\frac{P(A)\\cdot P(B|A)}{P(B)}$.',
      'Phân phối nhị thức $X \\sim B(n, p)$: $P(X = k) = C_n^k p^k (1-p)^{n-k}$, kỳ vọng $E(X) = np$, phương sai $\\text{Var}(X) = np(1-p)$.'
    ],
    commonTraps: [
      'Nhầm lẫn giữa $P(B|A)$ (xác suất dương tính khi bị bệnh) và $P(A|B)$ (xác suất thực sự bị bệnh khi đã có kết quả dương tính).',
      'Quên nhân hệ số tổ hợp $C_n^k$ khi tính xác suất có đúng $k$ lần thành công trong $n$ phép thử độc lập.'
    ],
    theory: [
      '1. Hệ đầy đủ các biến cố & Công thức Xác suất Toàn phần: Nếu $A_1, A_2, \\dots, A_n$ đôi một xung khắc và có hợp là $\\Omega$, với $P(A_i) > 0$, thì với mọi biến cố $B$: $P(B) = \\sum_{i=1}^n P(A_i)\\cdot P(B|A_i)$.',
      '2. Định lý Bayes: Cho phép tính xác suất hậu nghiệm của nguyên nhân $A_k$ khi đã quan sát thấy kết quả $B$: $P(A_k|B) = \\frac{P(A_k)\\cdot P(B|A_k)}{\\sum_{i=1}^n P(A_i)\\cdot P(B|A_i)}$.',
      '3. Dãy phép thử Bernoulli & Phân phối nhị thức $B(n, p)$: Thực hiện $n$ phép thử độc lập, mỗi lần thành công với xác suất $p$. Số lần thành công $X$ có phân phối $P(X = k) = C_n^k p^k (1-p)^{n-k}$.',
      '4. Kỳ vọng & Phương sai của $B(n, p)$: Giá trị kỳ vọng (trung bình lý thuyết) là $E(X) = n\\cdot p$, phương sai là $V(X) = n\\cdot p\\cdot (1-p)$, độ lệch chuẩn $\\sigma = \\sqrt{np(1-p)}$.'
    ],
    keyFormulas: [
      'P(B) = P(A)P(B|A) + P(\\overline{A})P(B|\\overline{A})',
      'P(A|B) = \\frac{P(A)P(B|A)}{P(B)}',
      'X \\sim B(n, p) \\implies P(X=k) = C_n^k p^k(1-p)^{n-k},\\ E(X) = np'
    ],
    flashcards: [
      {
        front: 'Tại sao khi xét nghiệm một bệnh rất hiếm (tỉ lệ mắc 0,1%) bằng bộ test chính xác 99%, xác suất thực sự mắc bệnh khi dương tính vẫn khá thấp?',
        back: 'Do nghịch lý tỷ lệ gốc (Base Rate Fallacy) theo định lý Bayes: số người khỏe mạnh chiếm 99,9% nên $1\\%$ dương tính giả của họ đông hơn nhiều so với $0,1\\%$ người bệnh thật!',
        tip: 'Tính mẫu $P(\\text{Dương tính}) = 0{,}001\\cdot 0{,}99 + 0{,}999\\cdot 0{,}01 \\approx 0{,}011$, suy ra $P(\\text{Bệnh}|+) \\approx 9\\%$.'
      }
    ],
    sampleProblems: [
      {
        source: 'Toán 12 GDPT 2018 · Định lý Bayes',
        question:
          'Có 2 hộp bi: Hộp I có $4$ bi đỏ, $6$ bi xanh; Hộp II có $7$ bi đỏ, $3$ bi xanh. Chọn ngẫu nhiên một hộp (xác suất như nhau) rồi lấy ra $1$ bi thấy đó là bi ĐỎ. Xác suất để bi đỏ đó được lấy từ Hộp II bằng:',
        options: ['A. $\\frac{7}{11}$', 'B. $\\frac{4}{11}$', 'C. $\\frac{7}{10}$', 'D. $\\frac{11}{20}$'],
        correctIndex: 0,
        explanation:
          'Xác suất lấy được bi đỏ toàn phần: $P(Đ) = \\frac{1}{2}\\cdot\\frac{4}{10} + \\frac{1}{2}\\cdot\\frac{7}{10} = \\frac{11}{20}$. Theo Bayes: $P(\\text{II}|Đ) = \\frac{\\frac{1}{2}\\cdot\\frac{7}{10}}{11/20} = \\frac{7}{11}$.'
      },
      {
        source: 'Xác suất Thống kê · Phân phối Nhị thức',
        question: 'Gieo một con xúc xắc cân đối $6$ lần độc lập. Gọi $X$ là số lần xuất hiện mặt 6 chấm. Kỳ vọng $E(X)$ và phương sai $V(X)$ bằng:',
        options: [
          'A. $E(X) = 1,\\ V(X) = \\frac{5}{6}$',
          'B. $E(X) = 1,\\ V(X) = \\frac{1}{6}$',
          'C. $E(X) = \\frac{1}{6},\\ V(X) = \\frac{5}{36}$',
          'D. $E(X) = 6,\\ V(X) = 5$'
        ],
        correctIndex: 0,
        explanation:
          'Ta có $X \\sim B\\left(6, \\frac{1}{6}\\right)$. Vậy kỳ vọng $E(X) = np = 6\\cdot\\frac{1}{6} = 1$, và phương sai $V(X) = np(1-p) = 6\\cdot\\frac{1}{6}\\cdot\\frac{5}{6} = \\frac{5}{6}$.'
      }
    ],
    essayProblems: [
      {
        source: 'Đề Tham khảo Toán 12 · Công thức Bayes thực tế',
        question:
          'Một dây chuyền sản xuất gồm 2 máy: Máy I sản xuất $60\\%$ tổng sản phẩm với tỉ lệ phế phẩm $2\\%$; Máy II sản xuất $40\\%$ tổng sản phẩm với tỉ lệ phế phẩm $5\\%$. Lấy ngẫu nhiên $1$ sản phẩm từ kho.\na) Tính xác suất lấy được phế phẩm.\nb) Biết sản phẩm lấy ra là phế phẩm, tính xác suất để nó do Máy II làm ra.',
        hints: ['Gọi $A_1, A_2$ là biến cố sản phẩm do Máy I, Máy II sản xuất; $B$ là biến cố lấy phải phế phẩm.'],
        solutionSteps: [
          'Bước 1: $P(A_1) = 0{,}6,\\ P(B|A_1) = 0{,}02$; $P(A_2) = 0{,}4,\\ P(B|A_2) = 0{,}05$.',
          'Bước 2: Áp dụng công thức xác suất toàn phần: $P(B) = 0{,}6\\cdot 0{,}02 + 0{,}4\\cdot 0{,}05 = 0{,}012 + 0{,}020 = 0{,}032$ ($3{,}2\\%$).',
          'Bước 3: Áp dụng định lý Bayes: $P(A_2|B) = \\frac{P(A_2)P(B|A_2)}{P(B)} = \\frac{0{,}020}{0{,}032} = \\frac{5}{8} = 0{,}625$.'
        ],
        finalAnswer: 'a) $P(B) = 0{,}032$; b) $P(A_2|B) = 0{,}625$ ($62{,}5\\%$).'
      }
    ],
    sim2dMode: 'grapher',
    sim3dMode: 'probability_bell_3d',
    defaultGraphConfig: {
      type: 'custom',
      customExpr: 'exp(-x*x/2)/2.5066',
      params: { a: 1, b: 0, c: 1, d: 0 },
      color: '#14b8a6',
      name: 'φ(x) Phân phối chuẩn'
    }
  }
];
