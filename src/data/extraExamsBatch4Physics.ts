import { ExamPaper, ExamQuestion } from '../types';
import { CHUYEN_SCHOOLS_BATCH_3, THPT_INSTITUTIONS_BATCH_3 } from './extraExamsBatch3Math';

export function buildPhysicsChuyenBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = CHUYEN_SCHOOLS_BATCH_3[i % CHUYEN_SCHOOLS_BATCH_3.length];
    const m1 = 1 + (i % 5); // 1..5 kg
    const m2 = m1 + 2; // 3..7 kg
    const v0 = 15 + (i % 6) * 5; // 15..40 m/s
    const k = 100 + (i % 4) * 50; // 100..250 N/m
    const B = 0.2 + (i % 5) * 0.1; // 0.2..0.6 T
    const shift = Math.floor(i / 4);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một hình trụ đặc đồng chất khối lượng $M = ${m2}\\text{ kg}$, bán kính $R = 0.1\\text{ m}$ lăn không trượt từ đỉnh một mặt phẳng nghiêng góc $\\alpha = 30^\\circ$ so với phương ngang, chiều dài mặt nghiêng $S = 4.5\\text{ m}$ ($g = 10\\text{ m/s}^2$, mômen quán tính trụ đặc $I = \\frac{1}{2}MR^2$).\na) Tính gia tốc tịnh tiến $a$ của khối tâm hình trụ và lực ma sát nghỉ $F_{\\text{ms}}$ tác dụng lên trụ.\nb) Tính tốc độ khối tâm $v$ khi hình trụ xuống tới chân mặt phẳng nghiêng.`,
        solution: `a) Phương trình động lực học tịnh tiến và quay quanh trục khối tâm (điều kiện lăn không trượt $a = \\gamma R$):\n$$\\begin{cases} Mg\\sin\\alpha - F_{\\text{ms}} = Ma \\\\ F_{\\text{ms}} R = I\\gamma = \\frac{1}{2}MR^2 \\cdot \\frac{a}{R} \\implies F_{\\text{ms}} = \\frac{1}{2}Ma \\end{cases}$$\nCộng hai phương trình: $\\frac{3}{2}Ma = Mg\\sin\\alpha \\implies a = \\frac{2}{3}g\\sin 30^\\circ = \\frac{10}{3} \\approx 3.33\\text{ m/s}^2$.\nLực ma sát nghỉ: $F_{\\text{ms}} = \\frac{1}{2}Ma = \\frac{1}{2}\\cdot ${m2}\\cdot \\frac{10}{3} = ${(5 * m2 / 3).toFixed(2)}\\text{ N}$.\n\nb) Dùng bảo toàn cơ năng hoặc động học: $v = \\sqrt{2aS} = \\sqrt{2 \\cdot \\frac{10}{3} \\cdot 4.5} = \\sqrt{30} \\approx 5.48\\text{ m/s}$.`,
        keyFormulasOrHints: ['Lăn không trượt: a = gamma * R', 'Cơ năng gồm động năng tịnh tiến + động năng quay'],
        simulationLink: { type: 'physics', targetId: 'mechanics', label: 'Động lực học Vật rắn 3D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một vật nhỏ khối lượng $m = ${m1}\\text{ kg}$ trượt không ma sát từ đỉnh một bán cầu nhẵn bán kính $R = 2.4\\text{ m}$ đặt cố định trên mặt sàn nằm ngang (vận tốc ban đầu ở đỉnh bằng $0$, $g = 10\\text{ m/s}^2$).\na) Tìm góc $\\theta$ hợp bởi bán kính nối vật và phương thẳng đứng khi vật bắt đầu rời khỏi mặt bán cầu.\nb) Tính độ cao nơi vật rời bán cầu so với mặt sàn và tốc độ của vật tại thời điểm đó.`,
        solution: `a) Áp dụng bảo toàn cơ năng từ đỉnh tới vị trí có góc $\\theta$:\n$$mgR(1 - \\cos\\theta) = \\frac{1}{2}mv^2 \\implies v^2 = 2gR(1 - \\cos\\theta).$$\nPhương trình định luật II Newton theo phương hướng tâm:\n$$mg\\cos\\theta - N = \\frac{mv^2}{R} \\implies N = mg(3\\cos\\theta - 2).$$\nVật bắt đầu rời mặt bán cầu khi $N = 0 \\iff \\cos\\theta = \\frac{2}{3} \\implies \\theta \\approx 48.19^\\circ$.\n\nb) Độ cao so với sàn: $h = R\\cos\\theta = 2.4 \\cdot \\frac{2}{3} = 1.6\\text{ m}$.\nTốc độ khi rời: $v = \\sqrt{2gR\\left(1 - \\frac{2}{3}\\right)} = \\sqrt{\\frac{2\\cdot 10\\cdot 2.4}{3}} = 4\\text{ m/s}$.`,
        keyFormulasOrHints: ['Điều kiện rời mặt cầu: phản lực N = 0', 'cos(theta) = 2/3 không phụ thuộc khối lượng và R']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một vật nhỏ có khối lượng $m = 0.5\\text{ kg}$ gắn vào lò xo nhẹ độ cứng $k = ${k}\\text{ N/m}$ đặt nằm ngang trên mặt phẳng có hệ số ma sát $\\mu = 0.2$ ($g = 10\\text{ m/s}^2$). Kéo vật ra khỏi vị trí lò xo không biến dạng một đoạn $A_0 = 10\\text{ cm}$ rồi buông nhẹ.\na) Tính độ giảm biên độ sau mỗi nửa chu kỳ $\\Delta A_{1/2}$ và số nửa chu kỳ vật thực hiện cho đến khi dừng hẳn.\nb) Tính tốc độ cực đại mà vật đạt được trong quá trình dao động.`,
        solution: `a) Lực ma sát trượt $F_{\\text{ms}} = \\mu mg = 0.2\\cdot 0.5\\cdot 10 = 1\\text{ N}$.\nĐộ dịch chuyển vị trí cân bằng tạm: $x_0 = \\frac{F_{\\text{ms}}}{k} = \\frac{1}{${k}}\\;\\text{m}$.\nĐộ giảm biên độ mỗi nửa chu kỳ: $\\Delta A_{1/2} = 2x_0 = \\frac{2}{${k}}\\;\\text{m} = ${(200 / k).toFixed(2)}\\text{ cm}$.\n\nb) Vật đạt tốc độ cực đại lần đầu tiên khi qua vị trí cân bằng tạm $x = x_0$ trong nửa chu kỳ đầu:\n$$v_{\\max} = \\omega(A_0 - x_0) = \\sqrt{\\frac{${k}}{0.5}}\\left(0.1 - \\frac{1}{${k}}\\right)\\;\\text{m/s}.$$`,
        keyFormulasOrHints: ['Vị trí cân bằng tạm x0 = mu * m * g / k', 'Giảm biên độ 2*x0 mỗi nửa chu kỳ'],
        simulationLink: { type: 'physics', targetId: 'oscillations', label: 'Dao động tắt dần có ma sát' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một tên lửa phóng thẳng đứng từ mặt đất nhờ phụt khí với tốc độ tương đối so với tên lửa là $u = 2000\\text{ m/s}$ và lưu lượng khối lượng khí phụt ổn định $\\mu = 50\\text{ kg/s}$. Khối lượng ban đầu của tên lửa (kể cả nhiên liệu) là $M_0 = 5000\\text{ kg}$ ($g = 10\\text{ m/s}^2$).\na) Tính lực đẩy của động cơ tên lửa và gia tốc ngay khi rời bệ phóng.\nb) Khi đã đốt hết $1000\\text{ kg}$ nhiên liệu, bỏ qua trọng lực trong giai đoạn ngắn trên không gian, tính độ tăng vận tốc $\\Delta v$ theo công thức Tsiolkovsky.`,
        solution: `a) Lực đẩy phản lực: $F_{\\text{đẩy}} = \\mu u = 50 \\cdot 2000 = 10^5\\text{ N}$.\nTrọng lực ban đầu: $P_0 = M_0 g = 50\\,000\\text{ N}$.\nGia tốc lúc rời bệ: $a_0 = \\frac{F_{\\text{đẩy}} - P_0}{M_0} = \\frac{10^5 - 5\\cdot 10^4}{5000} = 10\\text{ m/s}^2$.\n\nb) Công thức Tsiolkovsky:\n$$\\Delta v = u\\ln\\left(\\frac{M_0}{M}\\right) = 2000\\ln\\left(\\frac{5000}{4000}\\right) = 2000\\ln(1.25) \\approx 446.3\\text{ m/s}.$$`,
        keyFormulasOrHints: ['Lực đẩy phản lực F = u * dm/dt', 'Công thức Tsiolkovsky Delta v = u ln(M0/M)']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một lượng khí lí tưởng đơn nguyên tử thực hiện chu trình khép kín $1 \\to 2 \\to 3 \\to 1$ trên đồ thị $p - V$: từ $(p_1 = 10^5\\text{ Pa}, V_1 = 2\\text{ lít})$ nén đẳng áp tới $(p_1, V_2 = 1\\text{ lít})$, nung nóng đẳng tích lên $p_3 = 4p_1$, rồi giãn nở theo đường thẳng trên đồ thị về trạng thái $1$.\na) Tính công khí sinh ra trong cả chu trình.\nb) Tính tổng nhiệt lượng khí nhận vào trong quá trình đẳng tích $2 \\to 3$ (cho $C_V = \\frac{3}{2}R$).`,
        solution: `a) Trên đồ thị $p - V$, độ lớn công cả chu trình bằng diện tích tam giác $123$ (vì đi theo chiều ngược kim đồng hồ? Kiểm tra: $1 \\to 2$ giảm $V$, $2 \\to 3$ tăng $p$, $3 \\to 1$ tăng $V$ giảm $p$ $\\implies$ chiều **cùng kim đồng hồ**? Vẽ tọa độ: $(2, 1) \\to (1, 1) \\to (1, 4) \\to (2, 1)$ là **ngược chiều kim đồng hồ**, nên công nhận $A' > 0$ và công sinh ra $A = -A'$):\n$$|A| = \\frac{1}{2}(p_3 - p_1)(V_1 - V_2) = 0.5 \\cdot 3\\cdot 10^5 \\cdot 10^{-3} = 150\\text{ J}.$$\n\nb) Trong quá trình đẳng tích $2 \\to 3$, công $A_{23} = 0$, nên $Q_{23} = \\Delta U_{23} = \\frac{3}{2}(p_3 - p_1)V_2 = 1.5 \\cdot 3\\cdot 10^5 \\cdot 10^{-3} = 450\\text{ J}$.`,
        keyFormulasOrHints: ['Công chu trình bằng diện tích trên đồ thị p-V', 'Đẳng tích Q = Delta U = 3/2 * V * Delta p']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một mol khí lí tưởng thực hiện quá trình biến đổi đẳng nhiệt ở nhiệt độ $T = 300\\text{ K}$ từ thể tích $V_1 = 10\\text{ lít}$ đến thể tích $V_2 = 20\\text{ lít}$ ($R = 8.31\\text{ J/(mol}\\cdot\\text{K)}$).\na) Tính công mà khí thực hiện được trong quá trình giãn nở đẳng nhiệt này.\nb) Tính nhiệt lượng mà khí đã nhận từ nguồn nhiệt trong quá trình trên.`,
        solution: `a) Công giãn nở đẳng nhiệt:\n$$A = nRT\\ln\\left(\\frac{V_2}{V_1}\\right) = 1 \\cdot 8.31 \\cdot 300 \\cdot \\ln 2 \\approx 1728\\text{ J}.$$\n\nb) Vì quá trình đẳng nhiệt đối với khí lí tưởng nên $\\Delta U = 0$. Theo nguyên lý I nhiệt động lực học: $Q = A = 1728\\text{ J}$.`,
        keyFormulasOrHints: ['Công đẳng nhiệt A = nRT ln(V2/V1)', 'Khí lí tưởng đẳng nhiệt có Delta U = 0']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Trong thí nghiệm giao thoa sóng mặt nước với hai nguồn kết hợp ngược pha $S_1, S_2$ cách nhau $20\\text{ cm}$, tần số $f = 20\\text{ Hz}$, tốc độ truyền sóng $v = 80\\text{ cm/s}$.\na) Tính bước sóng $\\lambda$ và số điểm cực đại giao thoa trên đoạn thẳng nối $S_1 S_2$.\nb) Điểm $M$ cách $S_1$ đoạn $14\\text{ cm}$ và cách $S_2$ đoạn $22\\text{ cm}$ thuộc vân cực đại hay cực tiểu thứ mấy?`,
        solution: `a) Bước sóng $\\lambda = \\frac{v}{f} = \\frac{80}{20} = 4\\text{ cm}$.\nVì hai nguồn **ngược pha**, cực đại thỏa $d_2 - d_1 = (k + 0.5)\\lambda$. Trên $S_1 S_2$: $-20 < (k + 0.5)\\cdot 4 < 20 \\iff -5.5 < k < 4.5 \\implies k \\in \\{-5, \\dots, 4\\}$, có $10$ cực đại.\n\nb) Xét tỉ số $\\frac{d_2 - d_1}{\\lambda} = \\frac{22 - 14}{4} = 2$ (số nguyên!). Với hai nguồn ngược pha, hiệu đường đi bằng số nguyên lần bước sóng là **cực tiểu giao thoa** thứ $3$ (ứng với $k = 2$).`,
        keyFormulasOrHints: ['Hai nguồn ngược pha: Cực đại (k+0.5)lambda, Cực tiểu k*lambda'],
        simulationLink: { type: 'physics', targetId: 'waves', label: 'Giao thoa hai nguồn ngược pha' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một sợi dây đàn ghi-ta dài $L = 65\\text{ cm}$ căng giữa hai đầu cố định phát ra âm cơ bản có tần số $f_1 = 110\\text{ Hz}$.\na) Tính tốc độ truyền sóng ngang trên dây đàn và các tần số họa âm bậc $2$, bậc $3$.\nb) Khi bấm ngón tay rút ngắn chiều dài dây còn $L' = 52\\text{ cm}$ (lực căng không đổi), âm cơ bản mới có tần số bao nhiêu?`,
        solution: `a) Sóng dừng hai đầu cố định có âm cơ bản ứng với $1$ bó sóng: $L = \\frac{\\lambda_1}{2} \\implies \\lambda_1 = 1.3\\text{ m}$.\nTốc độ sóng trên dây: $v = \\lambda_1 f_1 = 1.3 \\cdot 110 = 143\\text{ m/s}$.\nHọa âm bậc $2$: $f_2 = 2f_1 = 220\\text{ Hz}$; bậc $3$: $f_3 = 3f_1 = 330\\text{ Hz}$.\n\nb) Vì $f_1 = \\frac{v}{2L}$ tỉ lệ nghịch với $L$: $f'_1 = f_1 \\frac{L}{L'} = 110\\cdot \\frac{65}{52} = 137.5\\text{ Hz}$.`,
        keyFormulasOrHints: ['f_n = n * v / (2L)', 'Sóng dừng 2 đầu cố định']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một thanh kim loại dài $\\ell = 0.5\\text{ m}$, khối lượng $m = 0.1\\text{ kg}$ đặt nằm ngang trượt không ma sát trên hai thanh ray song song nghiêng góc $\\alpha = 30^\\circ$ so với mặt ngang, nằm trong từ trường đều $\\vec{B}$ thẳng đứng hướng lên với $B = ${B.toFixed(1)}\\text{ T}$. Hai đầu trên thanh ray nối với nhau bởi điện trở $R = 0.5\\,\\Omega$. Thả thanh trượt xuống ($g = 10\\text{ m/s}^2$).\na) Viết biểu thức suất điện động cảm ứng và dòng điện cảm ứng khi thanh có vận tốc $v$.\nb) Tính vận tốc giới hạn ổn định $v_{\\max}$ mà thanh đạt được.`,
        solution: `a) Thành phần cảm ứng từ vuông góc mặt nghiêng là $B_{\\perp} = B\\cos\\alpha$. Suất điện động cảm ứng $e_c = B\\ell v\\cos\\alpha$. Dòng điện cảm ứng $I = \\frac{B\\ell v\\cos\\alpha}{R}$.\n\nb) Lực từ hướng ngang sang trái (chống lại sự trượt xuống) có thành phần dọc theo mặt nghiêng cản trở chuyển động là $F_{\\text{từ}} \\cos\\alpha = I\\ell B\\cos\\alpha = \\frac{B^2\\ell^2\\cos^2\\alpha}{R}v$.\nThanh đạt vận tốc ổn định khi cân bằng lực dọc mặt nghiêng:\n$$mg\\sin\\alpha = \\frac{B^2\\ell^2\\cos^2\\alpha}{R}v_{\\max} \\implies v_{\\max} = \\frac{mgR\\sin\\alpha}{B^2\\ell^2\\cos^2\\alpha}.$$\nThay số tính $v_{\\max} = \\frac{0.1\\cdot 10\\cdot 0.5\\cdot 0.5}{${(B * B * 0.25 * 0.75).toFixed(4)}} = ${(0.25 / (B * B * 0.1875)).toFixed(2)}\\text{ m/s}$.`,
        keyFormulasOrHints: ['Suất điện động cảm ứng B l v cos(alpha)', 'Cân bằng lực đạt v_max'],
        simulationLink: { type: 'physics', targetId: 'em_induction', label: 'Cảm ứng điện từ thanh trượt 3D' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một mạch điện xoay chiều $RLC$ nối tiếp gồm $R = 100\\,\\Omega$, cuộn thuần cảm $L = \\frac{2}{\\pi}\\text{ H}$ và tụ điện $C$ có điện dung thay đổi được. Đặt vào hai đầu mạch điện áp $u = 200\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$.\na) Điều chỉnh $C$ để công suất tiêu thụ trên mạch đạt cực đại. Tính giá trị $C$ và công suất cực đại $P_{\\max}$.\nb) Điều chỉnh $C = C_1$ để điện áp hiệu dụng trên tụ đạt cực đại $U_{C\\max}$. Tính $U_{C\\max}$.`,
        solution: `a) Cảm kháng $Z_L = \\omega L = 100\\pi \\cdot \\frac{2}{\\pi} = 200\\,\\Omega$.\nCông suất cực đại khi cộng hưởng: $Z_C = Z_L = 200\\,\\Omega \\implies C = \\frac{1}{\\omega Z_C} = \\frac{10^{-4}}{2\\pi}\\text{ F} \\approx 15.92\\,\\mu\\text{F}$.\nKhi đó $P_{\\max} = \\frac{U^2}{R} = \\frac{200^2}{100} = 400\\text{ W}$.\n\nb) Cực đại $U_{C\\max}$ khi $Z_C = \\frac{R^2 + Z_L^2}{Z_L} = \\frac{100^2 + 200^2}{200} = 250\\,\\Omega$, và giá trị cực đại:\n$$U_{C\\max} = \\frac{U\\sqrt{R^2 + Z_L^2}}{R} = \\frac{200\\sqrt{100^2 + 200^2}}{100} = 200\\sqrt{5} \\approx 447.2\\text{ V}.$$`,
        keyFormulasOrHints: ['Cộng hưởng Z_L = Z_C', 'U_Cmax = U * sqrt(R^2 + Z_L^2) / R']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho mạch cầu điện trở không cân bằng: nguồn suất điện động $E = 12\\text{ V}, r = 0$, mạch ngoài gồm nhánh trên $R_1 = 2\\,\\Omega$ nối tiếp $R_2 = 4\\,\\Omega$, nhánh dưới $R_3 = 4\\,\\Omega$ nối tiếp $R_4 = 2\\,\\Omega$, giữa hai điểm trung gian $M, N$ mắc một ampe kế lí tưởng ($R_A \\approx 0$).\na) Tính điện trở tương đương của mạch ngoài.\nb) Tính số chỉ ampe kế và chiều dòng điện chạy qua ampe kế.`,
        solution: `a) Vì $R_A = 0$ nên hai điểm $M$ và $N$ chập làm một: mạch gồm $(R_1 \\parallel R_3)$ nối tiếp $(R_2 \\parallel R_4)$.\n- $R_{13} = \\frac{2\\cdot 4}{2 + 4} = \\frac{4}{3}\\,\\Omega$.\n- $R_{24} = \\frac{4\\cdot 2}{4 + 2} = \\frac{4}{3}\\,\\Omega$.\nTổng trở $R_{\\text{td}} = \\frac{8}{3}\\,\\Omega$.\n\nb) Cường độ mạch chính $I = \\frac{E}{R_{\\text{td}}} = 4.5\\text{ A}$. Do đối xứng hai cụm, $U_{AM} = U_{MB} = 6\\text{ V}$.\nDòng qua $R_1$: $I_1 = 6 / 2 = 3\\text{ A}$; dòng qua $R_2$: $I_2 = 6 / 4 = 1.5\\text{ A}$.\nTại nút $M$: $I_A = I_1 - I_2 = 1.5\\text{ A}$, chiều dòng từ $M$ sang $N$.`,
        keyFormulasOrHints: ['Ampe kế lí tưởng chập 2 điểm M, N', 'Định luật nút mạch KCL tính I_A']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Một lượng chất phóng xạ ban đầu nguyên chất $^{210}_{84}\\text{Po}$ có chu kỳ bán rã $T = 138\\text{ ngày}$, khối lượng ban đầu $m_0 = 2.1\\text{ g}$. Phản ứng phân rã $\\alpha$ tạo thành hạt nhân con bền X (Chì $^{206}_{82}\\text{Pb}$).\na) Viết phương trình phản ứng và tính số hạt nhân $^{210}\\text{Po}$ còn lại sau $t = 276\\text{ ngày}$.\nb) Tính tỉ số giữa khối lượng hạt nhân Chì tạo thành và khối lượng $^{210}\\text{Po}$ còn lại tại thời điểm $t = 276\\text{ ngày}$.`,
        solution: `a) Phương trình: $^{210}_{84}\\text{Po} \\to ^4_2\\text{He} + ^{206}_{82}\\text{Pb}$.\nSau $t = 276 = 2T$, số hạt nhân còn lại bằng $\\frac{1}{4}$ ban đầu:\n$$N = \\frac{1}{4}\\cdot\\frac{m_0}{A_{\\text{Po}}} N_A = \\frac{1}{4}\\cdot\\frac{2.1}{210}\\cdot 6.02\\cdot 10^{23} = 1.505\\cdot 10^{21}\\text{ hạt}.$$\n\nb) Số hạt nhân Chì sinh ra bằng số hạt Pôlôni bị phân rã: $N_{\\text{Pb}} = N_0(1 - 2^{-t/T}) = 3N$.\nTỉ số khối lượng:\n$$\\frac{m_{\\text{Pb}}}{m_{\\text{Po}}} = \\frac{A_{\\text{Pb}}}{A_{\\text{Po}}}(2^{t/T} - 1) = \\frac{206}{210}(4 - 1) = \\frac{618}{210} \\approx 2.943.$$`,
        keyFormulasOrHints: ['N_con = Delta N_me', 'm_Pb / m_Po = (A_Pb / A_Po)(2^(t/T) - 1)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Trong thí nghiệm giao thoa ánh sáng Y-âng với ánh sáng trắng có bước sóng biến thiên liên tục từ $\\lambda_{\\min} = 0.38\\,\\mu\\text{m}$ đến $\\lambda_{\\max} = 0.76\\,\\mu\\text{m}$. Cho $a = 1\\text{ mm}, D = 2\\text{ m}$.\na) Tính bề rộng quang phổ bậc $1$ và bậc $2$ trên màn.\nb) Tại vị trí $M$ trên màn cách vân trung tâm $x_M = 4\\text{ mm}$, có bao nhiêu bức xạ đơn sắc cho vân sáng? Tìm các bước sóng đó.`,
        solution: `a) Bề rộng quang phổ bậc $k$: $\\Delta x_k = k\\frac{(\\lambda_{\\max} - \\lambda_{\\min})D}{a} = k\\frac{(0.76 - 0.38)\\cdot 10^{-6}\\cdot 2}{10^{-3}} = 0.76 k\\text{ mm}$.\nVậy $\\Delta x_1 = 0.76\\text{ mm}$ và $\\Delta x_2 = 1.52\\text{ mm}$.\n\nb) Điều kiện vân sáng tại $x_M$: $k\\frac{\\lambda D}{a} = x_M \\implies \\lambda = \\frac{a x_M}{k D} = \\frac{1\\cdot 4}{k \\cdot 2} = \\frac{2}{k}\\;(\\mu\\text{m})$.\nDo $0.38 \\le \\frac{2}{k} \\le 0.76 \\iff 2.63 \\le k \\le 5.26 \\implies k \\in \\{3, 4, 5\\}$.\nCó $3$ bức xạ cho vân sáng tại $M$: $\\lambda_3 = 0.667\\,\\mu\\text{m}$, $\\lambda_4 = 0.50\\,\\mu\\text{m}$, $\\lambda_5 = 0.40\\,\\mu\\text{m}$.`,
        keyFormulasOrHints: ['Bề rộng quang phổ bậc k = k(lambda_do - lambda_tim)D/a', 'Chặn k trong [lambda_min, lambda_max]'],
        simulationLink: { type: 'physics', targetId: 'optics', label: 'Giao thoa Ánh sáng trắng Y-âng' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Đặt một vật sáng nhỏ $AB$ vuông góc với trục chính của một thấu kính hội tụ có tiêu cự $f = 20\\text{ cm}$, thu được ảnh thật $A'B'$ cao gấp $2$ lần vật trên màn.\na) Tính khoảng cách từ vật đến thấu kính ($d$) và từ ảnh đến thấu kính ($d'$).\nb) Giữ nguyên vị trí vật $AB$ và màn ảnh, hỏi phải dịch chuyển thấu kính dọc trục chính một đoạn bao nhiêu để trên màn thu được ảnh rõ nét nữa?`,
        solution: `a) Ảnh thật ngược chiều cao gấp $2$ lần vật $\\implies k = -\\frac{d'}{d} = -2 \\implies d' = 2d$.\nÁp dụng công thức thấu kính: $\\frac{1}{d} + \\frac{1}{2d} = \\frac{1}{20} \\iff \\frac{3}{2d} = \\frac{1}{20} \\implies d = 30\\text{ cm},\\; d' = 60\\text{ cm}$.\n\nb) Khoảng cách vật – màn cố định $L = d + d' = 90\\text{ cm}$. Theo nguyên lý thuận nghịch ánh sáng, vị trí thứ hai của thấu kính cho ảnh rõ nét trên màn là $d_2 = d' = 60\\text{ cm},\\; d'_2 = d = 30\\text{ cm}$.\nVậy phải dịch chuyển thấu kính lại gần màn (ra xa vật) đoạn $\\Delta d = 60 - 30 = 30\\text{ cm}$.`,
        keyFormulasOrHints: ['Nguyên lý thuận nghịch đổi vai trò d và d\'', '1/f = 1/d + 1/d\'']
      }
    ];

    const q1 = q1Pool[(i + shift) % q1Pool.length];
    const q2 = q2Pool[(i + 1 + shift) % q2Pool.length];
    const q3 = q3Pool[(i + 2 + shift) % q3Pool.length];
    const q4 = q4Pool[(i + 3 + shift) % q4Pool.length];

    exams.push({
      id: `phy-chuyen-${num}`,
      subject: 'physics',
      track: 'chuyen',
      subjectTag: 'Vật Lí Chuyên',
      categoryTag: i % 2 === 0 ? 'Chuyên Lí & Olympic 30/4' : 'Chọn Đội Tuyển HSG Vật Lí',
      academicYear: '2025-2026',
      title: `Đề Luyện Thi Chuyên & HSG Vật Lí #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tổng hợp chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Vật rắn & Tsiolkovsky', '# Nhiệt động lực & Sóng dừng', '# Cảm ứng & RLC', '# Hạt nhân & Quang học'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

export function buildPhysicsStandardBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = THPT_INSTITUTIONS_BATCH_3[i % THPT_INSTITUTIONS_BATCH_3.length];
    const m = 0.2 + (i % 4) * 0.2; // 0.2..0.8 kg
    const k = 50 + (i % 4) * 25; // 50..125 N/m
    const f = 50 + (i % 3) * 10; // 50..70 Hz
    const shift = Math.floor(i / 4);

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một con lắc lò xo gồm vật nặng khối lượng $m = ${m.toFixed(1)}\\text{ kg}$ và lò xo độ cứng $k = ${k}\\text{ N/m}$ dao động điều hòa với biên độ $A = 8\\text{ cm}$.\na) Tính tần số góc $\\omega$, chu kỳ $T$ và cơ năng $W$ của con lắc.\nb) Tính động năng và thế năng của vật khi vật có li độ $x = 4\\text{ cm}$.`,
        solution: `a) Tần số góc $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{${k}}{${m.toFixed(1)}}} = ${(Math.sqrt(k / m)).toFixed(2)}\\text{ rad/s}$. Chu kỳ $T = \\frac{2\\pi}{\\omega} \\approx ${(2 * Math.PI * Math.sqrt(m / k)).toFixed(3)}\\text{ s}$.\nCơ năng $W = \\frac{1}{2}kA^2 = 0.5 \\cdot ${k} \\cdot 0.08^2 = ${(0.5 * k * 0.0064).toFixed(4)}\\text{ J}$.\n\nb) Tại $x = 4\\text{ cm} = \\frac{A}{2}$: thế năng $W_t = \\frac{1}{4}W = ${(0.25 * 0.5 * k * 0.0064).toFixed(4)}\\text{ J}$, động năng $W_{\\text{đ}} = \\frac{3}{4}W = ${(0.75 * 0.5 * k * 0.0064).toFixed(4)}\\text{ J}$.`,
        keyFormulasOrHints: ['omega = sqrt(k/m)', 'W_t = 1/2 k x^2, W_d = W - W_t'],
        simulationLink: { type: 'physics', targetId: 'oscillations', label: 'Dao động Con lắc lò xo' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một sóng cơ hình sin lan truyền trên phương $Ox$ với tần số $f = ${f}\\text{ Hz}$, tốc độ truyền sóng $v = 40\\text{ m/s}$.\na) Tính bước sóng $\\lambda$.\nb) Hai điểm $M, N$ trên phương truyền sóng cách nhau $d = 20\\text{ cm}$ lệch pha nhau góc $\\Delta\\varphi$ bằng bao nhiêu?`,
        solution: `a) Bước sóng $\\lambda = \\frac{v}{f} = \\frac{40}{${f}} = ${(40 / f).toFixed(3)}\\text{ m}$.\n\nb) Độ lệch pha $\\Delta\\varphi = \\frac{2\\pi d}{\\lambda} = \\frac{2\\pi \\cdot 0.2}{${(40 / f).toFixed(3)}} = ${(0.4 * Math.PI / (40 / f)).toFixed(3)}\\text{ rad}$.`,
        keyFormulasOrHints: ['lambda = v / f', 'Delta phi = 2 * pi * d / lambda']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Con lắc đơn dài $\\ell = 1\\text{ m}$ dao động điều hòa tại nơi có $g = \\pi^2 \\approx 10\\text{ m/s}^2$.\na) Tính chu kỳ và tần số dao động của con lắc.\nb) Nếu giảm chiều dài dây treo còn $\\ell' = 0.25\\text{ m}$, chu kỳ dao động mới là bao nhiêu?`,
        solution: `a) $T = 2\\pi\\sqrt{\\frac{\\ell}{g}} = 2\\pi\\sqrt{\\frac{1}{\\pi^2}} = 2\\text{ s}$, tần số $f = \\frac{1}{T} = 0.5\\text{ Hz}$.\n\nb) Chiều dài giảm $4$ lần $\\implies$ chu kỳ giảm $\\sqrt{4} = 2$ lần: $T' = 1\\text{ s}$.`,
        keyFormulasOrHints: ['T = 2pi sqrt(l/g)', 'T tỉ lệ thuận căn bậc hai chiều dài dây']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Một máy biến áp lí tưởng có số vòng dây cuộn sơ cấp $N_1 = 1000$ vòng và thứ cấp $N_2 = 200$ vòng. Đặt vào hai đầu cuộn sơ cấp điện áp xoay chiều hiệu dụng $U_1 = 220\\text{ V}$.\na) Tính điện áp hiệu dụng $U_2$ ở hai đầu cuộn thứ cấp để hở.\nb) Nối hai đầu cuộn thứ cấp với điện trở thuần $R = 22\\,\\Omega$, tính cường độ dòng điện chạy trong cuộn sơ cấp và thứ cấp.`,
        solution: `a) Tỉ số máy biến áp lí tưởng: $\\frac{U_2}{U_1} = \\frac{N_2}{N_1} \\implies U_2 = 220 \\cdot \\frac{200}{1000} = 44\\text{ V}$.\n\nb) Dòng điện thứ cấp: $I_2 = \\frac{U_2}{R} = \\frac{44}{22} = 2\\text{ A}$.\nVì $P_1 = P_2 \\implies I_1 = I_2\\frac{N_2}{N_1} = 2 \\cdot \\frac{200}{1000} = 0.4\\text{ A}$.`,
        keyFormulasOrHints: ['U1/U2 = N1/N2 = I2/I1', 'Máy biến áp lí tưởng P_vao = P_ra']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Đoạn mạch điện xoay chiều $RLC$ nối tiếp gồm $R = 30\\,\\Omega$, $Z_L = 80\\,\\Omega$, $Z_C = 40\\,\\Omega$, đặt vào điện áp $u = 100\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$.\na) Tính tổng trở $Z$ và cường độ dòng điện hiệu dụng $I$ trong mạch.\nb) Tính hệ số công suất $\\cos\\varphi$ và công suất tiêu thụ $P$ của mạch.`,
        solution: `a) Tổng trở $Z = \\sqrt{R^2 + (Z_L - Z_C)^2} = \\sqrt{30^2 + (80 - 40)^2} = 50\\,\\Omega$.\nCường độ dòng điện hiệu dụng: $I = \\frac{U}{Z} = \\frac{100}{50} = 2\\text{ A}$.\n\nb) Hệ số công suất $\\cos\\varphi = \\frac{R}{Z} = \\frac{30}{50} = 0.6$.\nCông suất tiêu thụ $P = UI\\cos\\varphi = I^2 R = 2^2 \\cdot 30 = 120\\text{ W}$.`,
        keyFormulasOrHints: ['Z = sqrt(R^2 + (Z_L - Z_C)^2)', 'P = I^2 R']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Một đoạn dây dẫn thẳng dài $\\ell = 0.5\\text{ m}$ mang dòng điện $I = 4\\text{ A}$ đặt trong từ trường đều $B = 0.3\\text{ T}$ hợp với đường sức từ góc $\\alpha = 30^\\circ$.\na) Tính độ lớn lực từ tác dụng lên đoạn dây dẫn.\nb) Khi tăng dòng điện lên gấp đôi và đặt dây vuông góc với đường sức từ thì lực từ bằng bao nhiêu?`,
        solution: `a) Lực từ Ampère: $F = B I \\ell \\sin\\alpha = 0.3 \\cdot 4 \\cdot 0.5 \\cdot \\sin 30^\\circ = 0.3\\text{ N}$.\n\nb) Khi $I' = 8\\text{ A}$ và $\\alpha' = 90^\\circ$: $F' = 0.3 \\cdot 8 \\cdot 0.5 \\cdot 1 = 1.2\\text{ N}$.`,
        keyFormulasOrHints: ['F = B I l sin(alpha)', 'Quy tắc bàn tay trái']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một khối khí lí tưởng ở nhiệt độ $27^\\circ\\text{C}$, áp suất $p_1 = 1\\text{ atm}$, thể tích $V_1 = 6\\text{ lít}$ được nung nóng đẳng áp tới nhiệt độ $177^\\circ\\text{C}$.\na) Tính thể tích $V_2$ của khối khí ở trạng thái sau.\nb) Nếu sau đó nén đẳng nhiệt khối khí về lại thể tích ban đầu $6\\text{ lít}$, áp suất cuối cùng là bao nhiêu?`,
        solution: `a) Đổi nhiệt độ tuyệt đối: $T_1 = 27 + 273 = 300\\text{ K}$, $T_2 = 177 + 273 = 450\\text{ K}$.\nTheo định luật Charles (đẳng áp): $\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\implies V_2 = 6\\cdot\\frac{450}{300} = 9\\text{ lít}$.\n\nb) Theo định luật Boyle (đẳng nhiệt): $p_2 V_2 = p_3 V_1 \\implies p_3 = 1\\cdot\\frac{9}{6} = 1.5\\text{ atm}$.`,
        keyFormulasOrHints: ['Nhiệt độ Kelvin T(K) = t(°C) + 273', 'Đẳng áp V/T = const; Đẳng nhiệt pV = const']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cung cấp nhiệt lượng $Q = 1500\\text{ J}$ cho một khối khí đựng trong xi-lanh nằm ngang làm khí giãn nở đẩy pit-tông dịch chuyển đều thực hiện một công $A = 600\\text{ J}$.\na) Phát biểu quy ước dấu trong nguyên lý I nhiệt động lực học cho trường hợp này.\nb) Tính độ biến thiên nội năng $\\Delta U$ của khối khí (nội năng tăng hay giảm?).`,
        solution: `a) Khí nhận nhiệt nên $Q = +1500\\text{ J}$; khí thực hiện công nên $A = -600\\text{ J}$.\n\nb) Theo nguyên lý I nhiệt động lực học: $\\Delta U = Q + A = 1500 - 600 = +900\\text{ J}$. Nội năng khối khí **tăng** thêm $900\\text{ J}$.`,
        keyFormulasOrHints: ['Delta U = Q + A', 'Nhận nhiệt Q > 0, sinh công A < 0']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một bình kín dung tích $V = 8.31\\text{ lít}$ chứa $1\\text{ mol}$ khí Heli ở nhiệt độ $27^\\circ\\text{C}$ ($R = 8.31\\text{ J/(mol}\\cdot\\text{K)}$, $k = 1.38\\cdot 10^{-23}\\text{ J/K}$).\na) Tính áp suất khí trong bình theo đơn vị Pa.\nb) Tính động năng tịnh tiến trung bình của mỗi phân tử khí Heli.`,
        solution: `a) Phương trình Clapeyron ($V = 8.31\\cdot 10^{-3}\\text{ m}^3, T = 300\\text{ K}$):\n$$p = \\frac{nRT}{V} = \\frac{1\\cdot 8.31\\cdot 300}{8.31\\cdot 10^{-3}} = 3\\cdot 10^5\\text{ Pa}.$$\n\nb) Động năng tịnh tiến trung bình của một phân tử:\n$$\\overline{W_d} = \\frac{3}{2}kT = 1.5 \\cdot 1.38\\cdot 10^{-23} \\cdot 300 = 6.21\\cdot 10^{-21}\\text{ J}.$$`,
        keyFormulasOrHints: ['pV = nRT (đơn vị chuẩn SI: m^3, Pa, K)', 'W_d = 3/2 k T']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Hạt nhân $^{235}_{92}\\text{U}$ hấp thụ một nơtron chậm gây phản ứng phân hạch tạo thành $^{95}_{42}\\text{Mo}$, $^{139}_{57}\\text{La}$, $x$ nơtron và $7$ êlectron.\na) Cân bằng phương trình phản ứng để tìm số nơtron $x$ giải phóng ra.\nb) Biết độ hụt khối của các hạt tương ứng cho năng lượng tỏa ra mỗi phân hạch là $200\\text{ MeV}$. Tính năng lượng tỏa ra khi phân hạch hết $1\\text{ g}$ Urani-235.`,
        solution: `a) Bảo toàn số khối $A$: $235 + 1 = 95 + 139 + x\\cdot 1 + 7\\cdot 0 \\implies x = 236 - 234 = 2$ nơtron.\n\nb) Số hạt nhân trong $1\\text{ g}$ $^{235}\\text{U}$ là $N = \\frac{1}{235}\\cdot 6.02\\cdot 10^{23} \\approx 2.56\\cdot 10^{21}$.\nNăng lượng tỏa ra: $E = N \\cdot 200\\text{ MeV} = 5.12\\cdot 10^{23}\\text{ MeV} \\approx 8.2\\cdot 10^{10}\\text{ J}$.`,
        keyFormulasOrHints: ['Bảo toàn số khối A và điện tích Z', '1 MeV = 1.6e-13 J']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Trong thí nghiệm Y-âng, hai khe cách nhau $a = 1.5\\text{ mm}$, màn cách hai khe $D = 3\\text{ m}$, nguồn đơn sắc bước sóng $\\lambda = 0.5\\,\\mu\\text{m}$.\na) Tính khoảng vân $i$.\nb) Xác định vị trí vân sáng bậc $4$ và vân tối thứ $3$ kể từ vân trung tâm.`,
        solution: `a) Khoảng vân $i = \\frac{\\lambda D}{a} = \\frac{0.5\\cdot 10^{-6}\\cdot 3}{1.5\\cdot 10^{-3}} = 10^{-3}\\text{ m} = 1\\text{ mm}$.\n\nb) Vân sáng bậc $4$: $x_{s4} = \\pm 4i = \\pm 4\\text{ mm}$.\nVân tối thứ $3$: $x_{t3} = \\pm 2.5i = \\pm 2.5\\text{ mm}$.`,
        keyFormulasOrHints: ['i = lambda D / a', 'Vân tối thứ k nằm tại (k - 0.5)i'],
        simulationLink: { type: 'physics', targetId: 'optics', label: 'Giao thoa Y-âng 2D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Chất phóng xạ $^{24}_{11}\\text{Na}$ có chu kỳ bán rã $T = 15\\text{ giờ}$. Ban đầu có $16\\text{ mg}$ chất phóng xạ trên.\na) Sau $45\\text{ giờ}$, khối lượng $^{24}\\text{Na}$ còn lại bằng bao nhiêu?\nb) Sau bao lâu thì $75\\%$ lượng chất phóng xạ ban đầu bị phân rã?`,
        solution: `a) Số chu kỳ $t / T = 45 / 15 = 3 \\implies m = 16 \\cdot 2^{-3} = 2\\text{ mg}$.\n\nb) Phân rã $75\\%$ nghĩa là còn lại $25\\% = \\frac{1}{4} = 2^{-2}$, nên $t = 2T = 30\\text{ giờ}$.`,
        keyFormulasOrHints: ['m = m0 * 2^(-t/T)', 'Còn lại 1 - phần trăm đã phân rã']
      }
    ];

    const q1 = q1Pool[(i + shift) % q1Pool.length];
    const q2 = q2Pool[(i + 1 + shift) % q2Pool.length];
    const q3 = q3Pool[(i + 2 + shift) % q3Pool.length];
    const q4 = q4Pool[(i + 3 + shift) % q4Pool.length];

    exams.push({
      id: `phy-kc-${num}`,
      subject: 'physics',
      track: 'khong_chuyen',
      subjectTag: 'Vật Lí 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử THPT Chuẩn GDPT 2018' : 'Khảo Sát Chất Lượng Lí 12',
      academicYear: '2025-2026',
      title: `Đề Thi Thử Tốt Nghiệp Môn Vật Lí #${num} – ${school}`,
      school,
      source: `Nguồn đề chuẩn THPT 2026: ${school}`,
      timeMinutes: 50,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Dao động & Sóng cơ', '# Điện xoay chiều & Từ trường', '# Nhiệt học & Khí lí tưởng', '# Hạt nhân & Giao thoa'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
