import { RoadmapNode, WorkflowStage } from '../types';
import { EXAM_PAPERS } from './examData';

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    stepNumber: 1,
    id: 'concept',
    titleVi: '1. Nắm Bản Chất & Công Thức Cốt Lõi',
    titleEn: '1. Master Core Concepts & Formulas',
    subtitleVi: 'Đọc lý thuyết trọng tâm, ghi nhớ mẹo nhanh và nhận diện bẫy thường gặp trước khi làm bài.',
    subtitleEn: 'Study core theory, memory mnemonics, and common traps before solving problems.',
    actionChecklistVi: [
      'Đọc mục Lý thuyết trọng tâm của chuyên đề đang học',
      'Tự nhẩm lại các công thức KaTeX và điều kiện áp dụng',
      'Lật nhanh 3-5 thẻ Flashcards để kiểm tra trí nhớ ngắn hạn'
    ],
    actionChecklistEn: [
      'Read the core theory section of the chosen topic',
      'Recall key formulas and their boundary conditions',
      'Flip 3-5 Flashcards for active recall'
    ],
    targetSubject: 'math',
    estimatedMinutes: 15
  },
  {
    stepNumber: 2,
    id: 'simulate',
    titleVi: '2. Quan Sát & Tương Tác Trực Quan 2D/3D',
    titleEn: '2. Visualize via 2D/3D Simulations',
    subtitleVi: 'Kéo thả tham số trên Đồ thị Oxy, Phòng thí nghiệm 2D Canvas hoặc Không gian 3D để hiểu quy luật biến thiên.',
    subtitleEn: 'Manipulate parameters on 2D graphs, native 2D physics canvas, or 3D viewports to build intuition.',
    actionChecklistVi: [
      'Thay đổi các hệ số (a, b, k, góc tới, R...) để xem đồ thị và véc-tơ phản ứng',
      'Quan sát mô hình 3D xoay 360 độ trong từng bài giảng Toán & Vật lí',
      'Ghi chú lại hiện tượng bất biến và trường hợp biên vào sổ tay SI'
    ],
    actionChecklistEn: [
      'Vary coefficients/parameters and observe real-time changes',
      'Explore interactive 3D models inside every Math & Physics lesson',
      'Note invariant relationships and edge behaviors'
    ],
    targetSubject: 'physics',
    estimatedMinutes: 15
  },
  {
    stepNumber: 3,
    id: 'tutor',
    titleVi: '3. Hỏi Syn AI Khi Gặp Điểm Mù',
    titleEn: '3. Consult Syn AI on Stuck Steps',
    subtitleVi: 'Syn AI không giải hộ trực tiếp mà hỏi ngược xem bạn đang vướng phần nào, rồi giảng cặn kẽ đúng chỗ chưa hiểu.',
    subtitleEn: 'Syn AI never spoils answers—it pinpoints your exact confusion and re-explains step by step.',
    actionChecklistVi: [
      'Chỉ rõ bước hoặc công thức bạn đang thấy khó hiểu',
      'Đọc giải thích trực quan từng bước của Syn AI',
      'Tự trả lời câu hỏi gợi mở cuối mỗi lượt trao đổi'
    ],
    actionChecklistEn: [
      'State the exact formula or step you feel unclear about',
      'Follow the tailored concrete breakdown and mini-example',
      'Answer the tutor’s checkpoint question on your own'
    ],
    targetSubject: 'roadmap',
    estimatedMinutes: 10
  },
  {
    stepNumber: 4,
    id: 'practice',
    titleVi: '4. Thực Hành Củng Cố & Tự Chấm Test',
    titleEn: '4. Practice Exercises & Automated Grading',
    subtitleVi: 'Làm bài tập trắc nghiệm có giải thích chi tiết (Toán/Lí) hoặc viết code C++/Python nộp Online Judge (Tin).',
    subtitleEn: 'Solve worked quizzes (Math/Physics) or code in Sublime Studio and run Online Judge test suites (CS).',
    actionChecklistVi: [
      'Tự giải trước khi bấm xem lời giải chi tiết từng bước',
      'Với môn Tin: chạy thử input mẫu rồi nộp chấm bộ test ẩn',
      'Tích lũy XP và đánh dấu hoàn thành mốc lộ trình'
    ],
    actionChecklistEn: [
      'Attempt exercises independently before revealing solutions',
      'For CS: test custom stdin then submit against hidden test cases',
      'Earn XP and mark the roadmap node as mastered'
    ],
    targetSubject: 'cs',
    estimatedMinutes: 20
  },
  {
    stepNumber: 5,
    id: 'arena',
    titleVi: '5. Thi Đề Chuẩn & Đấu Trường Xếp Hạng Tuần',
    titleEn: '5. Official Exam Papers & Weekly Online Arena',
    subtitleVi: `Thử sức với ${EXAM_PAPERS.length} Đề thi có đồng hồ bấm giờ và tham gia Đấu trường Online (1 lượt/ngày/môn) để leo Bảng xếp hạng tuần.`,
    subtitleEn: `Take timed ${EXAM_PAPERS.length}-paper practice sets and enter the Weekly Online Arena (1 attempt/day/subject) to climb the rankings.`,
    actionChecklistVi: [
      'Mỗi ngày chọn Trắc nghiệm hoặc Tự luận để thi đấu 1 lượt/môn',
      'Nhận chấm điểm tự luận chi tiết hoặc điểm tốc độ trắc nghiệm',
      'Theo dõi Điểm Trung Bình và thứ hạng từng môn trên Bảng xếp hạng tuần'
    ],
    actionChecklistEn: [
      'Complete 1 daily Arena round per subject (MCQ or Essay)',
      'Review detailed AI rubric scoring or MCQ breakdown',
      'Track your subject & overall weekly average rank'
    ],
    targetSubject: 'arena',
    estimatedMinutes: 15
  }
];

export const ROADMAP_NODES: RoadmapNode[] = [
  // ==================== TOÁN HỌC (LỚP 9 -> 12) ====================
  {
    id: 'rm-math-9-1',
    subject: 'math',
    grade: 'Lớp 9',
    order: 1,
    title: 'Căn bậc hai, Hệ phương trình & Định lí Vi-ét',
    titleEn: 'Square Roots, Linear Systems & Viète’s Theorem',
    goal: 'Biết tìm điều kiện xác định căn thức, giải hệ 2 ẩn và ứng dụng $S = x_1 + x_2$, $P = x_1 x_2$ vào bài toán tham số $m$.',
    goalEn: 'Master radical domain conditions, linear systems, and parameter problems via Viète.',
    prerequisites: [],
    estimatedMinutes: 35,
    targetLessonId: 'math-9-4',
    workflowTips: ['Vẽ Parabol $y = ax^2$ và đường thẳng $y = mx + n$ trên Đồ thị 2D để thấy ngay số giao điểm'],
    checkQuestions: ['Khi nào cần dùng $|A|$ khi khai căn $\\sqrt{A^2}$?', 'Điều kiện $\\Delta \\ge 0$ trước khi áp dụng Vi-ét là gì?']
  },
  {
    id: 'rm-math-9-2',
    subject: 'math',
    grade: 'Lớp 9',
    order: 2,
    title: 'Góc với đường tròn, Tứ giác nội tiếp & Hình khối 3D',
    titleEn: 'Circle Angles, Cyclic Quadrilaterals & 3D Solids',
    goal: 'Chứng minh 4 điểm cùng thuộc 1 đường tròn và tính thể tích Hình trụ, Nón, Cầu.',
    goalEn: 'Prove cyclic quadrilaterals and compute Cylinder, Cone, Sphere volumes.',
    prerequisites: ['rm-math-9-1'],
    estimatedMinutes: 40,
    targetLessonId: 'math-9-6',
    workflowTips: ['Dùng Studio Hình học phẳng để dựng đường tròn ngoại tiếp và kiểm chứng góc nội tiếp'],
    checkQuestions: ['Tổng hai góc đối của tứ giác nội tiếp bằng bao nhiêu độ?']
  },
  {
    id: 'rm-math-10-1',
    subject: 'math',
    grade: 'Lớp 10',
    order: 3,
    title: 'Hàm số bậc hai, Bất phương trình & Hệ thức lượng tam giác',
    titleEn: 'Quadratics, Linear Inequalities & Triangle Trigonometry',
    goal: 'Xác định đỉnh Parabol, dấu tam thức bậc hai $ax^2+bx+c$, định lí Côsin - Sin trong tam giác.',
    goalEn: 'Analyze parabolic vertex, quadratic signs, and Law of Cosines/Sines.',
    prerequisites: ['rm-math-9-1'],
    estimatedMinutes: 40,
    targetLessonId: 'math-10-4',
    workflowTips: ['Thử nghiệm thanh trượt hệ số $a, b, c$ của hàm bậc 2 trên Đồ thị 2D'],
    checkQuestions: ['Độ dài $a^2 = b^2 + c^2 - 2bc\\cos A$ khi góc $A = 90^\\circ$ trở thành định lí gì?']
  },
  {
    id: 'rm-math-10-2',
    subject: 'math',
    grade: 'Lớp 10',
    order: 4,
    title: 'Vectơ, Tọa độ mặt phẳng Oxy & Tổ hợp - Xác suất',
    titleEn: 'Vectors, Oxy Plane Coordinates & Combinatorics',
    goal: 'Thành thạo tích vô hướng $\\vec{u}\\cdot\\vec{v}$, viết phương trình đường thẳng/đường tròn và tính xác suất cổ điển.',
    goalEn: 'Apply dot products, line/circle equations, and classical probability.',
    prerequisites: ['rm-math-10-1'],
    estimatedMinutes: 45,
    targetLessonId: 'math-10-6',
    workflowTips: ['Phân biệt Hoán vị $P_n$, Chỉnh hợp $A_n^k$ và Tổ hợp $C_n^k$ qua bài toán chọn ban cán sự'],
    checkQuestions: ['Khi nào chọn $k$ phần tử cần phân biệt thứ tự ($A_n^k$) hay không cần ($C_n^k$)?']
  },
  {
    id: 'rm-math-11-1',
    subject: 'math',
    grade: 'Lớp 11',
    order: 5,
    title: 'Hàm số Lượng giác, Dãy số & Cấp số cộng - nhân',
    titleEn: 'Trigonometric Functions, Sequences & Progressions',
    goal: 'Giải phương trình lượng giác cơ bản, tìm số hạng tổng quát $u_n$ và tổng $S_n$ của CSC, CSN.',
    goalEn: 'Solve trig equations and compute arithmetic/geometric series sums.',
    prerequisites: ['rm-math-10-1'],
    estimatedMinutes: 45,
    targetLessonId: 'math-11-5',
    workflowTips: ['Quan sát đồ thị $y = \\sin x, y = \\cos x$ tuần hoàn với chu kỳ $2\\pi$ trên Đồ thị 2D'],
    checkQuestions: ['Điều kiện để tổng CSN lùi vô hạn $S = \\frac{u_1}{1-q}$ tồn tại là gì?']
  },
  {
    id: 'rm-math-11-2',
    subject: 'math',
    grade: 'Lớp 11',
    order: 6,
    title: 'Giới hạn, Đạo hàm & Quan hệ vuông góc không gian 3D',
    titleEn: 'Limits, Derivatives & 3D Perpendicularity',
    goal: 'Khử dạng vô định $\\frac{0}{0}$, tính tiếp tuyến bằng đạo hàm và xác định góc, khoảng cách trong hình không gian.',
    goalEn: 'Resolve indeterminate limits, tangents via derivatives, and 3D angles/distances.',
    prerequisites: ['rm-math-11-1'],
    estimatedMinutes: 50,
    targetLessonId: 'math-11-8',
    workflowTips: ['Mở Không gian 3D để xoay hình chóp, lăng trụ và quan sát đường cao vuông góc với đáy'],
    checkQuestions: ['Muốn chứng minh đường thẳng $d \\perp (P)$, cần $d$ vuông góc với ít nhất mấy đường thẳng cắt nhau trong $(P)$?']
  },
  {
    id: 'rm-math-12-1',
    subject: 'math',
    grade: 'Lớp 12',
    order: 7,
    title: 'Khảo sát hàm số, Mũ - Logarit & Nguyên hàm - Tích phân',
    titleEn: 'Curve Sketching, Exp/Log & Integral Calculus',
    goal: 'Tìm cực trị, GTLN-GTNN, giải BPT Mũ/Logarit và tính diện tích, thể tích vật tròn xoay bằng tích phân.',
    goalEn: 'Find extrema, solve exponential/log inequalities, and compute areas/volumes via integrals.',
    prerequisites: ['rm-math-11-2'],
    estimatedMinutes: 60,
    targetLessonId: 'math-1',
    workflowTips: ['Luôn đặt điều kiện biểu thức dưới dấu logarit dương trước khi biến đổi'],
    checkQuestions: ['Tại sao khi đạo hàm đổi dấu từ dương sang âm qua $x_0$ thì $x_0$ là điểm cực đại?']
  },
  {
    id: 'rm-math-12-2',
    subject: 'math',
    grade: 'Lớp 12',
    order: 8,
    title: 'Hình học tọa độ Oxyz & Tổng ôn Thi đấu ĐHQG / THPT',
    titleEn: '3D Oxyz Coordinate Geometry & Exam Mastery',
    goal: 'Viết phương trình mặt phẳng, đường thẳng, mặt cầu trong không gian $Oxyz$ và chinh phục Đề thi chuẩn.',
    goalEn: 'Master planes, lines, and spheres in 3D Oxyz and solve full national papers.',
    prerequisites: ['rm-math-12-1'],
    estimatedMinutes: 55,
    targetLessonId: 'math-8',
    workflowTips: ['Dùng tích có hướng $[\\vec{u}, \\vec{v}]$ để tìm nhanh vectơ pháp tuyến mặt phẳng'],
    checkQuestions: ['Khoảng cách từ điểm $M_0$ đến mặt phẳng $(P): Ax+By+Cz+D=0$ tính như thế nào?']
  },

  // ==================== VẬT LÍ (LỚP 9 -> 12) ====================
  {
    id: 'rm-phys-9-1',
    subject: 'physics',
    grade: 'Lớp 9',
    order: 1,
    title: 'Định luật Ôm, Mạch nối tiếp - song song & Quang hình',
    titleEn: 'Ohm’s Law, Series/Parallel Circuits & Geometric Optics',
    goal: 'Tính $R_{tđ}$, cường độ dòng điện, công suất tỏa nhiệt và dựng ảnh qua thấu kính hội tụ/phân kì.',
    goalEn: 'Analyze DC circuits and ray diagrams through converging/diverging lenses.',
    prerequisites: [],
    estimatedMinutes: 35,
    targetLessonId: 'phys-9-elec',
    workflowTips: ['Mở Lab 2D Mạch Điện để tự đổi kiểu mắc nối tiếp/song song và đo I, U, P theo thời gian thực'],
    checkQuestions: ['Khi mắc thêm một điện trở song song vào mạch, điện trở tương đương tăng hay giảm?']
  },
  {
    id: 'rm-phys-10-1',
    subject: 'physics',
    grade: 'Lớp 10',
    order: 2,
    title: 'Chuyển động Ném ngang/xiên & Bảo toàn Cơ năng',
    titleEn: 'Projectile Motion & Conservation of Mechanical Energy',
    goal: 'Phân tích chuyển động 2 chiều ($O_x$ thẳng đều, $O_y$ rơi tự do) và áp dụng $W = W_đ + W_t = \\text{const}$.',
    goalEn: 'Decompose 2D projectile trajectories and apply energy conservation.',
    prerequisites: ['rm-phys-9-1'],
    estimatedMinutes: 40,
    targetLessonId: 'phys-10-proj',
    workflowTips: ['Chạy mô phỏng 2D & Bệ Pháo 3D thử góc bắn $30^\\circ, 45^\\circ, 60^\\circ$ để kiểm chứng tầm xa cực đại'],
    checkQuestions: ['Ở độ cao cực đại của vật ném xiên, vận tốc toàn phần có bằng 0 không?']
  },
  {
    id: 'rm-phys-11-1',
    subject: 'physics',
    grade: 'Lớp 11',
    order: 3,
    title: 'Dao động điều hòa, Con lắc & Sóng giao thoa',
    titleEn: 'Harmonic Oscillations, Pendulums & Wave Interference',
    goal: 'Viết phương trình $x = A\\cos(\\omega t + \\varphi)$, tính chu kì con lắc lò xo/đơn và tìm vân cực đại giao thoa.',
    goalEn: 'Model SHM equations, pendulum periods, and constructive/destructive interference fringes.',
    prerequisites: ['rm-phys-10-1'],
    estimatedMinutes: 45,
    targetLessonId: 'phys-11-shm',
    workflowTips: ['Thay đổi k và m trong Lab Con Lắc 2D/3D để quan sát sự chuyển hóa Động năng - Thế năng'],
    checkQuestions: ['Khi vật đi qua vị trí cân bằng, đại lượng nào đạt cực đại và đại lượng nào bằng 0?']
  },
  {
    id: 'rm-phys-12-1',
    subject: 'physics',
    grade: 'Lớp 12',
    order: 4,
    title: 'Từ trường, Cảm ứng điện từ & Hạt nhân - Lượng tử',
    titleEn: 'Magnetic Fields, Induction & Quantum/Nuclear Physics',
    goal: 'Nắm vững lực từ, lực Lorentz $f = |q|vB\\sin\\alpha$, định luật Faraday và định luật phóng xạ $N = N_0 2^{-t/T}$.',
    goalEn: 'Master Lorentz forces, Faraday induction, and radioactive decay laws.',
    prerequisites: ['rm-phys-11-1'],
    estimatedMinutes: 50,
    targetLessonId: 'phys-12-mag',
    workflowTips: ['Kéo thanh nam châm trong Lab 2D & Xoắn ốc Lorentz 3D để quan sát từ thông biến thiên'],
    checkQuestions: ['Từ thông qua khung dây biến thiên khi nào thì sinh ra suất điện động cảm ứng?']
  },

  // ==================== TIN HỌC (LỘ TRÌNH CHUẨN VNOI ROADMAP) ====================
  {
    id: 'rm-cs-1',
    subject: 'cs',
    grade: 'Cơ bản',
    order: 1,
    title: 'VNOI Phase 0: Fast I/O, Big-O & Sàng Eratosthenes',
    titleEn: 'VNOI Phase 0: Fast I/O, Big-O & Prime Sieve',
    goal: 'Làm chủ nhập xuất chuẩn thi đấu (`cin.tie`, `sys.stdin`), tránh tràn số `long long`, ước lượng $10^8$ phép/giây và Sàng nguyên tố $\\mathcal{O}(N\\log\\log N)$.',
    goalEn: 'Master competitive Fast I/O, 64-bit integer safety, Big-O estimation, and Sieve of Eratosthenes.',
    prerequisites: [],
    estimatedMinutes: 30,
    targetLessonId: 'cs-1',
    workflowTips: ['Code trực tiếp trong Sublime Studio với syntax Monokai và tự chạy thử `input.txt`'],
    checkQuestions: ['Tại sao bài toán tính tổng mảng $N \\le 10^5, |a_i| \\le 10^9$ trong C++ phải dùng `long long` thay vì `int`?']
  },
  {
    id: 'rm-cs-2',
    subject: 'cs',
    grade: 'Cơ bản',
    order: 2,
    title: 'VNOI Phase 1: Mảng Đếm, Euclid GCD, Luỹ Thừa Nhị Phân & Quay Lui',
    titleEn: 'VNOI Phase 1: Frequency Arrays, Binary Exponentiation & Backtracking',
    goal: 'Tối ưu đếm tần suất, Euclid GCD/LCM, tính $a^b \\bmod M$ trong $\\mathcal{O}(\\log b)$ và cây đệ quy Quay lui (Sinh cấu hình, Xếp Hậu).',
    goalEn: 'Master frequency arrays, Euclidean GCD, modular exponentiation, and recursive backtracking.',
    prerequisites: ['rm-cs-1'],
    estimatedMinutes: 40,
    targetLessonId: 'cs-10',
    workflowTips: ['Nộp bài lên Online Judge để kiểm tra cả test biên $N=1$, tràn số khi nhân $a\\cdot b$ và chia trước nhân sau khi tính LCM'],
    checkQuestions: ['Vì sao khi tính $\\text{lcm}(a, b)$ cần viết `(a / gcd(a, b)) * b` thay vì `(a * b) / gcd(a, b)`?']
  },
  {
    id: 'rm-cs-3',
    subject: 'cs',
    grade: 'Trung cấp',
    order: 3,
    title: 'VNOI Phase 2: Binary Search, Prefix Sum, Two Pointers & Stack/Deque',
    titleEn: 'VNOI Phase 2: Binary Search, Prefix Sums & Monotonic Stack/Deque',
    goal: 'Áp dụng Chặt nhị phân kết quả, Mảng cộng dồn 1D/2D, Mảng hiệu, Hai con trỏ và Stack/Deque đơn điệu $\\mathcal{O}(N)$.',
    goalEn: 'Apply Binary Search on Answer, Prefix/Difference Arrays, Two Pointers, and O(N) Monotonic Stack/Deque.',
    prerequisites: ['rm-cs-2'],
    estimatedMinutes: 45,
    targetLessonId: 'cs-5',
    workflowTips: ['Phân tích tính đơn điệu trước khi chặt nhị phân kết quả và luôn lưu chỉ số (index) vào Stack/Deque'],
    checkQuestions: ['Điều kiện bắt buộc của mảng đầu vào để áp dụng Tìm kiếm nhị phân là gì?']
  },
  {
    id: 'rm-cs-4',
    subject: 'cs',
    grade: 'Nâng cao / HSG',
    order: 4,
    title: 'VNOI Phase 3–4: Quy Hoạch Động, Đồ Thị, Segment Tree, KMP & LCA',
    titleEn: 'VNOI Phase 3–4: DP, Graphs, Segment Tree, KMP & Tree LCA',
    goal: 'Thiết kế Quy hoạch động (Knapsack, LIS $\\mathcal{O}(N\\log N)$), Đồ thị (DFS/BFS/Dijkstra), Cây Phân Đoạn/DSU và Xâu nâng cao (Hash/KMP).',
    goalEn: 'Master DP recurrences, Graph shortest paths, Segment Tree/DSU, and String Hashing/KMP/LCA.',
    prerequisites: ['rm-cs-3'],
    estimatedMinutes: 60,
    targetLessonId: 'cs-8',
    workflowTips: ['Xác định rõ: Trạng thái $dp[i]$ lưu gì? Bài toán cơ sở? Công thức chuyển trạng thái?'],
    checkQuestions: ['Tại sao ở bài toán Balo 0/1 dùng mảng 1 chiều phải duyệt trọng lượng $w$ ngược từ $W$ về $w_i$?']
  },

  // ==================== BỔ SUNG CHUYÊN ĐỀ LỚP 9–11 (MỚI) ====================
  {
    id: 'rm-math-9-3',
    subject: 'math',
    grade: 'Lớp 9',
    order: 3,
    title: 'Bất đẳng thức Cô-si, Cực trị & Giải bài toán lập Phương trình',
    titleEn: 'AM-GM Inequalities & Applied Word Problems (Grade 9)',
    goal: 'Thành thạo kỹ thuật điểm rơi AM-GM lấy điểm 9–10 và lập bảng 3 bước giải toán chuyển động, năng suất thi vào 10.',
    goalEn: 'Master AM-GM equality point techniques and 3-step equation modeling for Grade 10 entrance.',
    prerequisites: ['rm-math-9-1'],
    estimatedMinutes: 45,
    targetLessonId: 'math-9-11',
    workflowTips: ['Kiểm tra điều kiện dương trước khi áp dụng Cô-si và đối chiếu nghiệm với điều kiện đặt ẩn'],
    checkQuestions: ['Trong $x + \\frac{1}{x}$ với $x \\ge 2$, tại sao không dùng trực tiếp $x + \\frac{1}{x} \\ge 2$?']
  },
  {
    id: 'rm-math-10-3',
    subject: 'math',
    grade: 'Lớp 10',
    order: 5,
    title: 'Quy tắc Đếm, Tổ hợp – Nhị thức Newton & Ba Đường Conic',
    titleEn: 'Combinatorics, Binomial Theorem & Conic Sections',
    goal: 'Phân biệt chính xác $P_n, A_n^k, C_n^k$, khai triển $(a+b)^5$ và nhận diện Elip, Hypebol, Parabol.',
    goalEn: 'Distinguish permutations/combinations and model Ellipse, Hyperbola, Parabola equations.',
    prerequisites: ['rm-math-10-2'],
    estimatedMinutes: 45,
    targetLessonId: 'math-10-7',
    workflowTips: ['Gặp bài toán "có ít nhất 1", hãy thử tính phần bù (Tổng số cách trừ trường hợp đối nghịch)'],
    checkQuestions: ['Quan hệ giữa $a, b, c$ của Elip khác với Hypebol ở điểm nào?']
  },
  {
    id: 'rm-math-11-3',
    subject: 'math',
    grade: 'Lớp 11',
    order: 7,
    title: 'Quy tắc Tính Đạo hàm, Hàm hợp & Phương trình Tiếp tuyến',
    titleEn: 'Differentiation Rules, Chain Rule & Tangent Lines',
    goal: 'Tính nhanh đạo hàm hàm hợp $(f(u))\' = f\'(u)\\cdot u\'$, vận tốc tức thời và lập tiếp tuyến tại điểm hay song song đường thẳng.',
    goalEn: 'Differentiate composite functions and construct curve tangents.',
    prerequisites: ['rm-math-11-2'],
    estimatedMinutes: 45,
    targetLessonId: 'math-11-9',
    workflowTips: ['Dùng Đồ thị 2D để quan sát độ dốc tiếp tuyến $k = f\'(x_0)$ thay đổi dọc theo đường cong bậc ba'],
    checkQuestions: ['Đạo hàm của $y = \\sin(3x)$ khác $\\sin(x)$ ở hệ số nào?']
  },
  {
    id: 'rm-phys-9-2',
    subject: 'physics',
    grade: 'Lớp 9',
    order: 2,
    title: 'Cảm ứng Điện từ, Máy biến áp & Hiệu suất Cơ học 9',
    titleEn: 'Electromagnetic Induction, Transformers & Efficiency (Grade 9)',
    goal: 'Hiểu điều kiện xuất hiện dòng xoay chiều, công thức máy biến áp $\\frac{U_1}{U_2} = \\frac{N_1}{N_2}$ và hiệu suất máy cơ.',
    goalEn: 'Understand AC induction, transformer voltage ratio, and mechanical efficiency.',
    prerequisites: ['rm-phys-9-1'],
    estimatedMinutes: 40,
    targetLessonId: 'phys-9-induction-ac',
    workflowTips: ['Chạy Lab Cảm ứng điện từ 2D và Máy phát 3D để quan sát chiều dòng điện đổi liên tục'],
    checkQuestions: ['Muốn giảm hao phí truyền tải điện năng đi 100 lần cần tăng hiệu điện thế lên bao nhiêu lần?']
  },
  {
    id: 'rm-phys-10-2',
    subject: 'physics',
    grade: 'Lớp 10',
    order: 3,
    title: 'Động lượng, Xung lượng & Bảo toàn Động lượng Va chạm',
    titleEn: 'Momentum, Impulse & Collision Conservation',
    goal: 'Áp dụng định luật bảo toàn động lượng hệ kín cho va chạm mềm, va chạm đàn hồi và chuyển động phản lực.',
    goalEn: 'Apply momentum conservation in elastic/inelastic collisions and rocket propulsion.',
    prerequisites: ['rm-phys-10-1'],
    estimatedMinutes: 40,
    targetLessonId: 'phys-10-momentum',
    workflowTips: ['Luôn chọn một chiều dương cố định trước khi chiếu phương trình vectơ động lượng'],
    checkQuestions: ['Trong va chạm mềm hai vật dính vào nhau, đại lượng nào bảo toàn và đại lượng nào giảm?']
  },
  {
    id: 'rm-phys-11-2',
    subject: 'physics',
    grade: 'Lớp 11',
    order: 5,
    title: 'Tụ điện, Năng lượng Điện trường & Cộng hưởng Cơ học',
    titleEn: 'Capacitors, Electric Energy & Mechanical Resonance',
    goal: 'Tính công lực điện $A=qEd$, năng lượng tụ điện $W = \\frac{1}{2}CU^2$ và điều kiện cộng hưởng $f = f_0$.',
    goalEn: 'Calculate electric work, capacitor energy, and resonance frequency matching.',
    prerequisites: ['rm-phys-11-1'],
    estimatedMinutes: 45,
    targetLessonId: 'phys-11-capacitor',
    workflowTips: ['Bật chế độ "Ma sát tắt dần" trong Lab Con lắc 2D để quan sát đường bao biên độ giảm theo hàm mũ'],
    checkQuestions: ['Tại sao cầu treo hay tòa nhà phải tránh tần số dao động riêng trùng với tần số gió/bước chân?']
  }
];
