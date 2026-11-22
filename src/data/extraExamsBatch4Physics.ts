import { ExamPaper, ExamQuestion } from '../types';
import { ALL_CHUYEN_SCHOOLS_BATCH_4, ALL_THPT_SCHOOLS_BATCH_4 } from './extraExamsBatch4Math';

export function buildPhysicsChuyenBatch4(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 100; i++) {
    const num = 76 + i;
    const school = ALL_CHUYEN_SCHOOLS_BATCH_4[i % ALL_CHUYEN_SCHOOLS_BATCH_4.length];
    const year = i % 2 === 0 ? '2025-2026' : '2024-2025';

    const m1 = 1 + (i % 5); // 1..5 kg
    const m2 = m1 + 2 + (Math.floor(i / 5) % 3); // 3..9 kg (strictly > m1)
    const M = 2 + (Math.floor(i / 15) % 3) * 2; // 2, 4, 6 kg
    const v0 = 15 + (i % 6) * 5; // 15..40 m/s
    const ell = 1.0 + (i % 4) * 0.4; // 1.0..2.2 m
    const B = 0.2 + (i % 5) * 0.1; // 0.2..0.6 T
    const R_res = 20 + (i % 6) * 10; // 20..70 Ohm

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một ròng rọc đồng chất dạng đĩa tròn khối lượng $M = ${M}\\text{ kg}$, bán kính $R = 0.2\\text{ m}$ quay không ma sát quanh trục nằm ngang đi qua tâm ($I = \\frac{1}{2}MR^2$). Vắt qua ròng rọc một sợi dây nhẹ không giãn, hai đầu treo $m_1 = ${m1}\\text{ kg}$ và $m_2 = ${m2}\\text{ kg}$ ($g = 10\\text{ m/s}^2$).\na) Tính gia tốc $a$ của mỗi vật và gia tốc góc $\\gamma$ của ròng rọc.\nb) Tính lực căng $T_1, T_2$ trên hai nhánh dây.`,
        solution: `a) Phương trình động lực học:\n- $T_1 - m_1 g = m_1 a$, $m_2 g - T_2 = m_2 a$, và $(T_2 - T_1)R = I\\frac{a}{R} \\implies T_2 - T_1 = \\frac{M}{2}a$.\nCộng 3 phương trình:\n$$a = \\frac{(m_2 - m_1)g}{m_1 + m_2 + M/2} = \\frac{(${m2} - ${m1})\\cdot 10}{${m1 + m2 + M / 2}} = ${(((m2 - m1) * 10) / (m1 + m2 + M / 2)).toFixed(2)}\\text{ m/s}^2.$$\nGia tốc góc $\\gamma = \\frac{a}{R} = ${((((m2 - m1) * 10) / (m1 + m2 + M / 2)) / 0.2).toFixed(2)}\\text{ rad/s}^2$.\n\nb) Lực căng dây:\n- $T_1 = m_1(g + a) = ${(m1 * (10 + ((m2 - m1) * 10) / (m1 + m2 + M / 2))).toFixed(2)}\\text{ N}$.\n- $T_2 = m_2(g - a) = ${(m2 * (10 - ((m2 - m1) * 10) / (m1 + m2 + M / 2))).toFixed(2)}\\text{ N}$.`,
        keyFormulasOrHints: ['Đĩa tròn I = 1/2 MR^2', 'a = (m2 - m1)g / (m1 + m2 + M/2)'],
        simulationLink: { type: 'physics', targetId: 'mechanics', label: 'Động lực học & Ròng rọc 2D/3D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Từ chân mặt phẳng nghiêng góc $\\beta = 30^\\circ$ so với phương ngang, ném một vật với vận tốc $v_0 = ${v0}\\text{ m/s}$ hợp với phương ngang góc $\\alpha = 60^\\circ$ hướng lên dốc ($g = 10\\text{ m/s}^2$).\na) Tính thời gian bay $t$ cho đến khi vật chạm mặt phẳng nghiêng.\nb) Tính tầm xa $L$ đo dọc theo mặt phẳng nghiêng.`,
        solution: `a) Chọn hệ trục $Ox$ dọc mặt nghiêng, $Oy$ vuông góc mặt nghiêng. Góc ném so với mặt nghiêng là $\\theta = 60^\\circ - 30^\\circ = 30^\\circ$, nên $v_{0y} = v_0\\sin 30^\\circ = ${(v0 / 2).toFixed(1)}\\text{ m/s}$ và $a_y = -g\\cos 30^\\circ$.\nThời gian chạm dốc ($y = 0$):\n$$t = \\frac{2v_{0y}}{g\\cos 30^\\circ} = \\frac{${v0}}{5\\sqrt{3}} = ${(v0 / (5 * Math.sqrt(3))).toFixed(2)}\\text{ s}.$$\n\nb) Quãng đường dọc mặt dốc:\n$$L = \\frac{2v_0^2 \\sin(\\alpha - \\beta)\\cos\\alpha}{g\\cos^2\\beta} = \\frac{2\\cdot ${v0}^2 \\cdot 0.5 \\cdot 0.5}{10\\cdot 0.75} = \\frac{${v0 * v0}}{15} \\approx ${((v0 * v0) / 15).toFixed(2)}\\text{ m}.$$`,
        keyFormulasOrHints: ['Chọn Ox dọc dốc, Oy vuông góc dốc', 'L = 2 v0^2 sin(alpha - beta) cos(alpha) / (g cos^2 beta)'],
        simulationLink: { type: 'physics', targetId: 'mechanics', label: 'Quỹ đạo Ném xiên mặt nghiêng' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một thanh đồng chất khối lượng $M = ${m2}\\text{ kg}$, chiều dài $\\ell = ${ell.toFixed(1)}\\text{ m}$ tựa đầu trên vào tường thẳng đứng nhẵn và đầu dưới đặt trên sàn ngang có hệ số ma sát nghỉ $\\mu = 0.5$ ($g = 10\\text{ m/s}^2$).\na) Khi thanh cân bằng ở góc nghiêng $\\alpha = 60^\\circ$ so với sàn, tính áp lực $N_{\\text{tường}}$ và lực ma sát $F_{\\text{ms}}$.\nb) Tìm góc nghiêng nhỏ nhất $\\alpha_{\\min}$ để thanh không trượt.`,
        solution: `a) Cân bằng lực: $N_{\\text{sàn}} = Mg = ${10 * m2}\\text{ N}$, $F_{\\text{ms}} = N_{\\text{tường}}$.\nCân bằng mômen quanh điểm tựa sàn:\n$$N_{\\text{tường}}\\ell\\sin 60^\\circ = Mg\\frac{\\ell}{2}\\cos 60^\\circ \\implies N_{\\text{tường}} = \\frac{${10 * m2}}{2\\sqrt{3}} \\approx ${((5 * m2) / Math.sqrt(3)).toFixed(2)}\\text{ N}.$$\n\nb) Điều kiện không trượt: $F_{\\text{ms}} = \\frac{Mg}{2\\tan\\alpha} \\le \\mu Mg \\implies \\tan\\alpha \\ge \\frac{1}{2\\mu} = 1 \\implies \\alpha_{\\min} = 45^\\circ$.`,
        keyFormulasOrHints: ['Cân bằng lực và cân bằng mômen M_P = M_N', 'tan(alpha_min) = 1/(2 mu)']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một quả cầu đặc đồng chất khối lượng $M = ${m2}\\text{ kg}$, bán kính $R$ lăn không trượt từ đỉnh mặt phẳng nghiêng cao $h = ${(1.4 + (i % 3) * 0.7).toFixed(1)}\\text{ m}$ xuống chân dốc ($I = \\frac{2}{5}MR^2$, $g = 10\\text{ m/s}^2$).\na) Tính tốc độ khối tâm $v$ của quả cầu ở chân dốc bằng bảo toàn cơ năng.\nb) Tính gia tốc tịnh tiến của khối tâm theo góc nghiêng $\\alpha = 30^\\circ$.`,
        solution: `a) Bảo toàn cơ năng với động năng toàn phần $W_{\\text{đ}} = \\frac{1}{2}Mv^2 + \\frac{1}{2}I\\omega^2 = \\frac{7}{10}Mv^2$ (do $\\omega = v/R$):\n$$Mgh = \\frac{7}{10}Mv^2 \\implies v = \\sqrt{\\frac{10}{7}gh} = ${Math.sqrt((10 / 7) * 10 * (1.4 + (i % 3) * 0.7)).toFixed(2)}\\text{ m/s}.$$\n\nb) Gia tốc khối tâm khi lăn không trượt trên góc $\\alpha = 30^\\circ$:\n$$a = \\frac{g\\sin\\alpha}{1 + \\frac{I}{MR^2}} = \\frac{10 \\cdot 0.5}{1 + 0.4} = \\frac{5}{1.4} \\approx 3.57\\text{ m/s}^2.$$`,
        keyFormulasOrHints: ['Động năng lăn Wd = 1/2 mv^2 (1 + I/(mR^2))', 'a = g sin alpha / (1 + I/(mR^2))']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một viên đạn khối lượng $m = 0.05\\text{ kg}$ bay ngang với tốc độ $v_0 = ${10 * v0}\\text{ m/s}$ cắm chặt vào bao cát khối lượng $M = ${m2}\\text{ kg}$ treo trên dây dài $2\\text{ m}$ đang đứng yên ($g = 10\\text{ m/s}^2$).\na) Tính vận tốc hệ ngay sau va chạm mềm và nhiệt lượng tỏa ra.\nb) Tính độ cao cực đại $h_{\\max}$ của hệ sau va chạm.`,
        solution: `a) Bảo toàn động lượng: $V = \\frac{mv_0}{m + M} = \\frac{${0.5 * v0}}{${m2 + 0.05}} = ${((0.5 * v0) / (m2 + 0.05)).toFixed(2)}\\text{ m/s}$.\nNhiệt lượng hao hụt: $Q = \\frac{1}{2}\\frac{mM}{m + M}v_0^2 = ${(0.5 * ((0.05 * m2) / (m2 + 0.05)) * (10 * v0) ** 2).toFixed(1)}\\text{ J}$.\n\nb) Bảo toàn cơ năng sau va chạm: $h_{\\max} = \\frac{V^2}{2g} \\approx ${(((0.5 * v0) / (m2 + 0.05)) ** 2 / 20).toFixed(3)}\\text{ m}$.`,
        keyFormulasOrHints: ['Va chạm mềm bảo toàn động lượng', 'Sau va chạm bảo toàn cơ năng tìm h_max']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một mol khí lý tưởng đơn nguyên tử thực hiện chu trình $1 \\to 2 \\to 3 \\to 1$: đẳng áp $1 \\to 2$ từ $T_1 = 300\\text{ K}$ lên $T_2 = ${450 + (i % 4) * 50}\\text{ K}$, làm lạnh đẳng tích $2 \\to 3$ giảm áp suất còn $p_3 = p_1/2$, rồi nén tuyến tính $3 \\to 1$ trên giản đồ $(p, V)$ ($R = 8.31\\text{ J/(mol}\\cdot\\text{K)}$).\na) Tính nhiệt lượng $Q_{12}$ khí nhận ở quá trình đẳng áp $1 \\to 2$.\nb) Tính công $A$ khí thực hiện trong cả chu trình.`,
        solution: `a) Khí đơn nguyên tử có $C_p = \\frac{5}{2}R$. Nhiệt lượng nhận ở quá trình đẳng áp $1 \\to 2$:\n$$Q_{12} = nC_p(T_2 - T_1) = 1 \\cdot 2.5 \\cdot 8.31 \\cdot ${150 + (i % 4) * 50} = ${(2.5 * 8.31 * (150 + (i % 4) * 50)).toFixed(1)}\\text{ J}.$$\n\nb) Diện tích tam giác vuông chu trình trên $(p, V)$:\n$$A = \\frac{1}{2}(p_1 - p_3)(V_2 - V_1) = \\frac{1}{4}nR(T_2 - T_1) = ${(0.25 * 8.31 * (150 + (i % 4) * 50)).toFixed(2)}\\text{ J}.$$`,
        keyFormulasOrHints: ['Cp = 5/2 R với khí đơn nguyên tử', 'Công chu trình = Diện tích trên (p, V)'],
        simulationLink: { type: 'physics', targetId: 'thermodynamics', label: 'Động cơ Nhiệt & Chu trình (p,V)' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Động cơ nhiệt lý tưởng Carnot hoạt động giữa nguồn nóng $T_1 = ${600 + (i % 3) * 100}\\text{ K}$ và nguồn lạnh $T_2 = 300\\text{ K}$. Mỗi chu trình nhận nhiệt $Q_1 = ${m2 * 1000}\\text{ J}$.\na) Tính hiệu suất $H$ của chu trình Carnot và công $A$ sinh ra.\nb) Tính nhiệt lượng $Q_2$ tỏa cho nguồn lạnh.`,
        solution: `a) Hiệu suất Carnot: $H = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{${600 + (i % 3) * 100}} = ${((1 - 300 / (600 + (i % 3) * 100)) * 100).toFixed(1)}\\%$.\nCông cơ học sinh ra: $A = H Q_1 = ${(m2 * 1000 * (1 - 300 / (600 + (i % 3) * 100))).toFixed(1)}\\text{ J}$.\n\nb) Nhiệt lượng tỏa ra nguồn lạnh: $Q_2 = Q_1 - A = ${(m2 * 1000 * (300 / (600 + (i % 3) * 100))).toFixed(1)}\\text{ J}$.`,
        keyFormulasOrHints: ['H = 1 - T2/T1', 'Q2 = Q1 - A']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Thả $m_1 = ${m1 > 3 ? 2 : m1}\\text{ kg}$ nước đá ở $-10^\\circ\\text{C}$ vào $m_2 = ${(m1 > 3 ? 2 : m1) + 4}\\text{ kg}$ nước ở $50^\\circ\\text{C}$. Cho $c_{\\text{đá}} = 2100\\text{ J/(kg}\\cdot\\text{K)}$, $c_{\\text{nước}} = 4200\\text{ J/(kg}\\cdot\\text{K)}$, $\\lambda = 3.34\\cdot 10^5\\text{ J/kg}$.\na) Chứng minh nước đá tan hết hoàn toàn.\nb) Tính nhiệt độ cân bằng cuối cùng $t$ của hỗn hợp.`,
        solution: `a) Đặt $m_1' = ${m1 > 3 ? 2 : m1}\\text{ kg}$, $m_2' = ${(m1 > 3 ? 2 : m1) + 4}\\text{ kg}$. Nhiệt lượng nước $m_2'$ tỏa ra khi hạ về $0^\\circ\\text{C}$:\n$$Q_{\\text{tỏa max}} = ${(m1 > 3 ? 2 : m1) + 4}\\cdot 4200\\cdot 50 = ${((m1 > 3 ? 2 : m1) + 4) * 210000}\\text{ J}.$$\nNhiệt lượng cần để đá nóng lên $0^\\circ\\text{C}$ và tan hết: $Q_{\\text{thu đủ}} = ${(m1 > 3 ? 2 : m1) * 355000}\\text{ J} < Q_{\\text{tỏa max}}$, nên đá tan hết.\n\nb) Cân bằng nhiệt: $t = \\frac{Q_{\\text{tỏa max}} - Q_{\\text{thu đủ}}}{(m_1' + m_2')c_{\\text{nước}}} = ${((((m1 > 3 ? 2 : m1) + 4) * 210000 - (m1 > 3 ? 2 : m1) * 355000) / (((m1 > 3 ? 2 : m1) * 2 + 4) * 4200)).toFixed(2)}^\\circ\\text{C}$.`,
        keyFormulasOrHints: ['So sánh Q_toa_max với Q_thu_du tại 0°C', 'Phương trình cân bằng nhiệt']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Hai nguồn sóng kết hợp cùng pha $S_1, S_2$ trên mặt nước cách nhau $16\\text{ cm}$, dao động với tần số $f = ${25 + (i % 3) * 25}\\text{ Hz}$. Tốc độ truyền sóng là $v = ${100 + (i % 3) * 100}\\text{ cm/s}$ (bước sóng $\\lambda = 4\\text{ cm}$).\na) Tìm số cực đại và số cực tiểu giao thoa trên đoạn thẳng nối $S_1 S_2$.\nb) Xét điểm $M$ sao cho $\\triangle MS_1 S_2$ vuông tại $S_1$ với $MS_1 = 12\\text{ cm}$. Điểm $M$ thuộc dãy cực đại hay cực tiểu nào?`,
        solution: `a) Bước sóng $\\lambda = \\frac{v}{f} = 4\\text{ cm}$.\n- Cực đại trên $S_1 S_2$: $-4 < k < 4 \\implies 7$ cực đại ($k \\in \\{-3..3\\}$).\n- Cực tiểu trên $S_1 S_2$: $-4 < k + 0.5 < 4 \\iff -4.5 < k < 3.5 \\implies 8$ cực tiểu ($k \\in \\{-4..3\\}$).\n\nb) $MS_2 = \\sqrt{16^2 + 12^2} = 20\\text{ cm}$. Hiệu đường đi $MS_2 - MS_1 = 8\\text{ cm} = 2\\lambda \\implies M$ nằm trên vân cực đại bậc $2$.`,
        keyFormulasOrHints: ['lambda = v / f', 'Cực đại d2 - d1 = k*lambda; cực tiểu (k + 0.5)*lambda'],
        simulationLink: { type: 'physics', targetId: 'waves', label: 'Giao thoa Sóng 2 nguồn 2D' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một lò xo nhẹ độ cứng $k_1 = 100\\text{ N/m}$ ghép với lò xo $k_2 = 150\\text{ N/m}$ và vật nặng $m = 0.6\\text{ kg}$.\na) Tính chu kỳ dao động $T_{\\text{nt}}$ khi ghép nối tiếp hai lò xo.\nb) Tính chu kỳ dao động $T_{\\text{ss}}$ khi ghép song song hai lò xo.`,
        solution: `a) Nối tiếp: $\\frac{1}{k_{\\text{nt}}} = \\frac{1}{100} + \\frac{1}{150} \\implies k_{\\text{nt}} = 60\\text{ N/m}$.\n$T_{\\text{nt}} = 2\\pi\\sqrt{\\frac{0.6}{60}} = 0.2\\pi \\approx 0.628\\text{ s}$.\n\nb) Song song: $k_{\\text{ss}} = 100 + 150 = 250\\text{ N/m}$.\n$T_{\\text{ss}} = 2\\pi\\sqrt{\\frac{0.6}{250}} \\approx 0.308\\text{ s}$.`,
        keyFormulasOrHints: ['Nối tiếp 1/k = 1/k1 + 1/k2', 'Song song k = k1 + k2'],
        simulationLink: { type: 'physics', targetId: 'oscillations', label: 'Dao động Con lắc lò xo' }
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một thanh kim loại dài $\\ell = 1.0\\text{ m}$, khối lượng $m = 0.04\\text{ kg}$, điện trở $R = 0.5\\,\\Omega$ trượt không ma sát theo phương thẳng đứng dọc theo hai thanh ray dẫn điện nối với nhau ở đầu trên (đặt trong từ trường đều nằm ngang $B = ${B.toFixed(1)}\\text{ T}$ vuông góc mặt phẳng hai ray, $g = 10\\text{ m/s}^2$).\na) Giải thích tại sao thanh đạt tới một tốc độ giới hạn $v_{\\max}$ rồi chuyển động đều?\nb) Tính tốc độ giới hạn $v_{\\max}$ và cường độ dòng điện cảm ứng ổn định.`,
        solution: `a) Khi thanh rơi, từ thông biến thiên sinh ra suất điện động $e = B\\ell v$, tạo dòng điện $I = \\frac{B\\ell v}{R}$. Lực từ $F_t = BI\\ell = \\frac{B^2\\ell^2 v}{R}$ hướng lên cản trở chuyển động, tăng dần theo $v$ cho tới khi cân bằng với trọng lực $P = mg$, lúc đó $a = 0$ và thanh đạt tốc độ ổn định $v_{\\max}$.\n\nb) Tại trạng thái ổn định: $mg = \\frac{B^2\\ell^2 v_{\\max}}{R}$:\n$$v_{\\max} = \\frac{mgR}{B^2\\ell^2} = \\frac{0.04 \\cdot 10 \\cdot 0.5}{${B.toFixed(1)}^2 \\cdot 1.0^2} = ${(0.2 / (B * B)).toFixed(2)}\\text{ m/s}.$$\nDòng điện ổn định: $I = \\frac{mg}{B\\ell} = \\frac{0.4}{${B.toFixed(1)}} = ${(0.4 / B).toFixed(2)}\\text{ A}$.`,
        keyFormulasOrHints: ['Suất điện động cảm ứng thanh trượt e = B l v', 'Cân bằng lực F_t = mg cho v_max'],
        simulationLink: { type: 'physics', targetId: 'electromagnetism', label: 'Cảm ứng Điện từ 2D/3D' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một êlectron ($m_e = 9.1\\cdot 10^{-31}\\text{ kg}$, $|e| = 1.6\\cdot 10^{-19}\\text{ C}$) được tăng tốc từ trạng thái nghỉ qua hiệu điện thế $U = 2000\\text{ V}$, rồi bay vuông góc vào từ trường đều $B = ${B.toFixed(1)}\\text{ T}$.\na) Tính vận tốc $v$ của êlectron khi vừa ra khỏi vùng tăng tốc.\nb) Tính bán kính quỹ đạo tròn $R$ trong từ trường đều.`,
        solution: `a) Định lý động năng: $\\frac{1}{2}m_e v^2 = |e|U \\implies v = \\sqrt{\\frac{2|e|U}{m_e}} \\approx 2.65\\cdot 10^7\\text{ m/s}$.\n\nb) Lực Lorentz đóng vai trò lực hướng tâm:\n$$R = \\frac{m_e v}{|e|B} = \\frac{9.1\\cdot 10^{-31}\\cdot 2.65\\cdot 10^7}{1.6\\cdot 10^{-19}\\cdot ${B.toFixed(1)}} \\approx ${((9.1e-31 * 2.65e7) / (1.6e-19 * B) * 1000).toFixed(2)}\\text{ mm}.$$`,
        keyFormulasOrHints: ['1/2 mv^2 = |e|U', 'R = mv / (|q|B)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Đặt điện áp xoay chiều $u = 120\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ vào đoạn mạch $RLC$ nối tiếp gồm $R = ${R_res}\\,\\Omega$, cuộn cảm có $L$ biến thiên và tụ điện $Z_C = 60\\,\\Omega$.\na) Điều chỉnh $L$ để cường độ dòng điện hiệu dụng đạt cực đại (cộng hưởng điện). Tìm $Z_L$, $I_{\\max}$ và công suất $P_{\\max}$.\nb) Khi $Z_L = 100\\,\\Omega$, tính tổng trở $Z$ và hệ số công suất $\\cos\\varphi$.`,
        solution: `a) Cộng hưởng điện xảy ra khi $Z_L = Z_C = 60\\,\\Omega$.\nKhi đó $Z_{\\min} = R = ${R_res}\\,\\Omega$, dòng hiệu dụng $I_{\\max} = \\frac{120}{${R_res}} = ${(120 / R_res).toFixed(2)}\\text{ A}$, công suất $P_{\\max} = \\frac{U^2}{R} = ${(14400 / R_res).toFixed(1)}\\text{ W}$.\n\nb) Khi $Z_L = 100\\,\\Omega$: $Z = \\sqrt{${R_res}^2 + (100 - 60)^2} = ${Math.sqrt(R_res * R_res + 1600).toFixed(2)}\\,\\Omega$, hệ số công suất $\\cos\\varphi = \\frac{R}{Z} = ${(R_res / Math.sqrt(R_res * R_res + 1600)).toFixed(3)}$.`,
        keyFormulasOrHints: ['Cộng hưởng ZL = ZC', 'P = U^2 R / Z^2']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Hai điện tích điểm $q_1 = +4\\cdot 10^{-8}\\text{ C}$ và $q_2 = -9\\cdot 10^{-8}\\text{ C}$ đặt tại hai điểm $A, B$ cách nhau $10\\text{ cm}$ trong chân không ($k = 9\\cdot 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$).\na) Tính độ lớn lực tương tác tĩnh điện giữa $q_1$ và $q_2$.\nb) Tìm vị trí điểm $M$ nơi cường độ điện trường tổng hợp triệt tiêu ($\\vec{E}_M = \\vec{0}$).`,
        solution: `a) Lực Coulomb: $F = k\\frac{|q_1 q_2|}{r^2} = 9\\cdot 10^9\\frac{36\\cdot 10^{-16}}{0.1^2} = 3.24\\cdot 10^{-3}\\text{ N}$.\n\nb) Vì $q_1, q_2$ trái dấu và $|q_1| < |q_2|$, điểm $M$ nằm trên đường thẳng $AB$, ngoài đoạn $AB$ và gần phía $A$: $MA = r_1$, $MB = r_1 + 10$. Từ $\\frac{|q_1|}{r_1^2} = \\frac{|q_2|}{(r_1 + 10)^2} \\implies \\frac{2}{r_1} = \\frac{3}{r_1 + 10} \\implies r_1 = 20\\text{ cm}$ (cách $A$ $20\\text{ cm}$, cách $B$ $30\\text{ cm}$).`,
        keyFormulasOrHints: ['Định luật Coulomb F = k|q1q2|/r^2', 'E1 + E2 = 0: ngoài đoạn, gần điện tích nhỏ hơn'],
        simulationLink: { type: 'physics', targetId: 'electromagnetism', label: 'Đường sức Điện trường 2D/3D' }
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Cho mạch điện kín gồm nguồn $\\mathcal{E} = 12\\text{ V},\\; r = 2\\,\\Omega$ và mạch ngoài là điện trở $R$ thay đổi.\na) Khi $R = ${R_res}\\,\\Omega$, tính cường độ dòng điện và hiệu suất của nguồn điện.\nb) Tìm giá trị của $R$ để công suất tỏa nhiệt trên điện trở $R$ đạt cực đại và tính $P_{R\\max}$.`,
        solution: `a) Cường độ dòng điện $I = \\frac{\\mathcal{E}}{R + r} = \\frac{12}{${R_res + 2}} = ${(12 / (R_res + 2)).toFixed(3)}\\text{ A}$.\nHiệu suất nguồn: $H = \\frac{R}{R + r} = \\frac{${R_res}}{${R_res + 2}} = ${((R_res / (R_res + 2)) * 100).toFixed(1)}\\%$.\n\nb) Công suất mạch ngoài $P_R = \\frac{\\mathcal{E}^2 R}{(R + r)^2}$ đạt cực đại theo AM-GM khi $R = r = 2\\,\\Omega$, khi đó $P_{R\\max} = \\frac{\\mathcal{E}^2}{4r} = \\frac{144}{8} = 18\\text{ W}$.`,
        keyFormulasOrHints: ['Định luật Ôm toàn mạch I = E/(R + r)', 'P_R max khi R = r']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Trong thí nghiệm Young về giao thoa ánh sáng, khoảng cách giữa hai khe $a = 1.0\\text{ mm}$, màn quan sát cách mặt phẳng hai khe $D = 2.0\\text{ m}$. Chiếu đồng thời hai bức xạ đơn sắc $\\lambda_1 = 0.45\\,\\mu\\text{m}$ và $\\lambda_2 = 0.60\\,\\mu\\text{m}$.\na) Tính khoảng vân $i_1, i_2$ của hai bức xạ trên màn.\nb) Tìm vị trí gần vân trung tâm nhất mà hai vân sáng của $\\lambda_1$ và $\\lambda_2$ trùng nhau.`,
        solution: `a) Khoảng vân: $i_1 = \\frac{\\lambda_1 D}{a} = \\frac{0.45\\cdot 2}{1} = 0.9\\text{ mm}$; $i_2 = \\frac{\\lambda_2 D}{a} = 1.2\\text{ mm}$.\n\nb) Điều kiện trùng vân sáng: $\\frac{k_1}{k_2} = \\frac{\\lambda_2}{\\lambda_1} = \\frac{0.60}{0.45} = \\frac{4}{3}$.\nVậy vân sáng trùng đầu tiên gần vân trung tâm nhất ứng với $k_1 = 4, k_2 = 3$, cách vân trung tâm $x = 4 i_1 = 4 \\cdot 0.9 = 3.6\\text{ mm}$.`,
        keyFormulasOrHints: ['Khoảng vân i = lambda D / a', 'Trùng vân sáng k1/k2 = lambda2/lambda1'],
        simulationLink: { type: 'physics', targetId: 'optics', label: 'Giao thoa Khe Young 2D/3D' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Đặt một vật sáng nhỏ $AB$ vuông góc trục chính của một thấu kính hội tụ tiêu cự $f = 20\\text{ cm}$, cách thấu kính $d = 30\\text{ cm}$.\na) Xác định vị trí, tính chất và số phóng đại ảnh $A'B'$.\nb) Cần dịch chuyển vật đoạn bao nhiêu và theo chiều nào để thu được ảnh thật cao bằng $2$ lần vật?`,
        solution: `a) Công thức thấu kính: $\\frac{1}{d'} = \\frac{1}{f} - \\frac{1}{d} = \\frac{1}{20} - \\frac{1}{30} = \\frac{1}{60} \\implies d' = 60\\text{ cm} > 0$ (ảnh thật).\nSố phóng đại: $k = -\\frac{d'}{d} = -2$ (ảnh ngược chiều, cao gấp 2 lần vật!).\n\nb) Ảnh đã sẵn là ảnh thật cao bằng 2 lần vật ($|k| = 2$), nên cần dịch chuyển **0 cm** (giữ nguyên vị trí $d = 30\\text{ cm}$)!`,
        keyFormulasOrHints: ['1/f = 1/d + 1/d\'', 'k = -d\'/d'],
        simulationLink: { type: 'physics', targetId: 'optics', label: 'Thấu kính Quang hình 2D/3D' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Một sợi quang hình trụ gồm lõi thủy tinh chiết suất $n_1 = 1.50$ bao bọc bởi vỏ bọc chiết suất $n_2 = 1.20$ đặt trong không khí.\na) Tính góc giới hạn phản xạ toàn phần $i_{gh}$ tại mặt phân cách giữa lõi và vỏ.\nb) Tính góc nhận sáng cực đại $\\theta_{\\max}$ (theo khẩu độ số NA) ở mặt cắt đầu sợi quang để tia sáng truyền dọc theo sợi không bị lọt ra vỏ.`,
        solution: `a) Góc giới hạn phản xạ toàn phần: $\\sin i_{gh} = \\frac{n_2}{n_1} = \\frac{1.20}{1.50} = 0.8 \\implies i_{gh} \\approx 53.13^\\circ$.\n\nb) Khẩu độ số $\\text{NA} = \\sin\\theta_{\\max} = \\sqrt{n_1^2 - n_2^2} = \\sqrt{1.5^2 - 1.2^2} = 0.9 \\implies \\theta_{\\max} \\approx 64.16^\\circ$.`,
        keyFormulasOrHints: ['sin i_gh = n2 / n1', 'NA = sin theta_max = sqrt(n1^2 - n2^2)'],
        simulationLink: { type: 'physics', targetId: 'optics', label: 'Phản xạ toàn phần Sợi quang' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Chiếu bức xạ đơn sắc có bước sóng $\\lambda = 0.30\\,\\mu\\text{m}$ vào catôt của tế bào quang điện làm bằng kim loại có công thoát $A = 2.48\\text{ eV}$ ($h = 6.625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$, $c = 3\\cdot 10^8\\text{ m/s}$, $1\\text{ eV} = 1.6\\cdot 10^{-19}\\text{ J}$).\na) Tính năng lượng phôtôn (theo eV) và chứng minh xảy ra hiện tượng quang điện.\nb) Tính động năng ban đầu cực đại của quang êlectron và hiệu điện thế hãm $U_h$.`,
        solution: `a) Năng lượng phôtôn $\\varepsilon = \\frac{hc}{\\lambda} = 6.625\\cdot 10^{-19}\\text{ J} \\approx 4.14\\text{ eV} > A = 2.48\\text{ eV}$, nên xảy ra hiện tượng quang điện.\n\nb) Theo hệ thức Einstein: $W_{\\text{đmax}} = \\varepsilon - A = 4.14 - 2.48 = 1.66\\text{ eV} \\approx 2.66\\cdot 10^{-19}\\text{ J}$.\nHiệu điện thế hãm: $U_h = \\frac{W_{\\text{đmax}}}{|e|} \\approx 1.66\\text{ V}$.`,
        keyFormulasOrHints: ['epsilon = hc / lambda', 'W_dmax = epsilon - A = |e| U_h'],
        simulationLink: { type: 'physics', targetId: 'modern', label: 'Hiệu ứng Quang điện 2D/3D' }
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Xét phản ứng nhiệt hạch tổng hợp Hêli: $^2_1\\text{H} + ^3_1\\text{H} \\to ^4_2\\text{He} + ^1_0\\text{n}$. Biết khối lượng các hạt $m_{\\text{D}} = 2.01355\\text{ amu}$, $m_{\\text{T}} = 3.01550\\text{ amu}$, $m_{\\text{He}} = 4.00150\\text{ amu}$, $m_n = 1.00867\\text{ amu}$ và $1\\text{ amu}\\cdot c^2 = 931.5\\text{ MeV}$.\na) Phản ứng này tỏa hay thu năng lượng? Tính năng lượng của 1 phản ứng (MeV).\nb) Nếu tổng hợp được $4\\text{ g}$ Hêli thì năng lượng tỏa ra tương đương bao nhiêu kWh?`,
        solution: `a) Tổng khối lượng trước: $m_{\\text{trước}} = 2.01355 + 3.01550 = 5.02905\\text{ amu}$.\nTổng khối lượng sau: $m_{\\text{sau}} = 4.00150 + 1.00867 = 5.01017\\text{ amu} < m_{\\text{trước}}$ nên **tỏa năng lượng**:\n$$\\Delta E = (5.02905 - 5.01017) \\cdot 931.5 = 0.01888 \\cdot 931.5 \\approx 17.59\\text{ MeV}.$$\n\nb) Số hạt nhân Hêli trong $4\\text{ g}$ ($1\\text{ mol}$) là $N_A = 6.02\\cdot 10^{23}$. Tổng năng lượng tỏa ra:\n$$E = 6.02\\cdot 10^{23} \\cdot 17.59\\cdot 1.6\\cdot 10^{-13}\\text{ J} \\approx 1.694\\cdot 10^{12}\\text{ J} \\approx 4.71\\cdot 10^5\\text{ kWh}.$$`,
        keyFormulasOrHints: ['Delta E = (m_truoc - m_sau) c^2', '1 kWh = 3.6e6 J'],
        simulationLink: { type: 'physics', targetId: 'modern', label: 'Hạt nhân & Nhiệt hạch 3D' }
      }
    ];

    const s1 = i % 5;
    const s2 = (i + Math.floor(i / 5)) % 5;
    const s3 = (i + 2 * Math.floor(i / 5)) % 5;
    const s4 = (i + 3 * Math.floor(i / 5)) % 5;

    const q1 = q1Pool[s1];
    const q2 = q2Pool[s2];
    const q3 = q3Pool[s3];
    const q4 = q4Pool[s4];

    exams.push({
      id: `phy-chuyen-${num}`,
      subject: 'physics',
      track: 'chuyen',
      subjectTag: 'Vật Lí Chuyên',
      categoryTag: i % 2 === 0 ? 'Chuyên Lý & Chọn Đội Tuyển HSG' : 'Olympic Vật Lí & Chuyên ĐH',
      academicYear: year,
      title: `Đề Thi Chuyên & HSG Vật Lí #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn tổng hợp chuẩn đề: ${school}`,
      timeMinutes: 150,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Vật rắn & Cơ học', '# Nhiệt học & Sóng', '# Từ trường & Điện từ', '# Quang học & Hạt nhân'],
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
    const school = ALL_THPT_SCHOOLS_BATCH_4[i % ALL_THPT_SCHOOLS_BATCH_4.length];
    const year = i % 2 === 0 ? '2025-2026' : '2024-2025';

    const ell = 0.4 + (i % 4) * 0.2; // 0.4..1.0 m
    const R_val = 30 + (Math.floor(i / 4) % 5) * 10; // 30..70 Ohm
    const I_val = 2 + (Math.floor(i / 20) % 5); // 2..6 A
    const halfLife = 2 + (i % 5) * 2; // 2..10 days

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một con lắc đơn chiều dài $\\ell = ${ell.toFixed(1)}\\text{ m}$ dao động điều hòa tại nơi có $g = 10\\text{ m/s}^2$.\na) Tính chu kỳ $T$ và tần số góc $\\omega$.\nb) Với biên độ góc $\\alpha_0 = 0.1\\text{ rad}$ và vật nặng $m = 0.2\\text{ kg}$, tính cơ năng dao động của con lắc.`,
        solution: `a) $\\omega = \\sqrt{\\frac{g}{\\ell}} = ${Math.sqrt(10 / ell).toFixed(2)}\\text{ rad/s}$, chu kỳ $T = 2\\pi\\sqrt{\\frac{\\ell}{g}} = ${(2 * Math.PI * Math.sqrt(ell / 10)).toFixed(3)}\\text{ s}$.\n\nb) Cơ năng: $W = \\frac{1}{2}mg\\ell\\alpha_0^2 = ${(0.01 * ell).toFixed(4)}\\text{ J}$.`,
        keyFormulasOrHints: ['T = 2pi sqrt(l/g)', 'W = 1/2 m g l alpha_0^2'],
        simulationLink: { type: 'physics', targetId: 'oscillations', label: 'Dao động Con lắc đơn 2D/3D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một vật dao động điều hòa có phương trình $x = ${2 * I_val}\\cos(10t - \\frac{\\pi}{3})\\text{ (cm)}$ ($t$ tính bằng giây).\na) Xác định biên độ, tần số góc và pha ban đầu của dao động.\nb) Tính tốc độ cực đại và gia tốc cực đại của vật.`,
        solution: `a) Biên độ $A = ${2 * I_val}\\text{ cm}$, $\\omega = 10\\text{ rad/s}$, pha ban đầu $\\varphi = -\\frac{\\pi}{3}\\text{ rad}$.\n\nb) $v_{\\max} = \\omega A = ${20 * I_val}\\text{ cm/s}$; $a_{\\max} = \\omega^2 A = ${200 * I_val}\\text{ cm/s}^2 = ${2 * I_val}\\text{ m/s}^2$.`,
        keyFormulasOrHints: ['v_max = omega A', 'a_max = omega^2 A']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một dây đàn hồi dài $1.2\\text{ m}$ cố định hai đầu đang có sóng dừng với $3$ bụng sóng, tần số rung $f = 50\\text{ Hz}$.\na) Tính bước sóng $\\lambda$ trên dây.\nb) Tính tốc độ truyền sóng $v$ trên dây.`,
        solution: `a) Chiều dài dây $\\ell = k\\frac{\\lambda}{2} \\implies 1.2 = 3\\frac{\\lambda}{2} \\implies \\lambda = 0.8\\text{ m}$.\n\nb) Tốc độ truyền sóng: $v = \\lambda f = 0.8 \\cdot 50 = 40\\text{ m/s}$.`,
        keyFormulasOrHints: ['Hai đầu cố định: l = k lambda / 2', 'v = lambda * f'],
        simulationLink: { type: 'physics', targetId: 'waves', label: 'Sóng dừng trên dây 2D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Nguồn âm điểm phát công suất đẳng hướng $P = 0.4\\pi\\text{ W}$ ($I_0 = 10^{-12}\\text{ W/m}^2$).\na) Tính cường độ âm tại điểm cách nguồn $r = 10\\text{ m}$.\nb) Tính mức cường độ âm $L$ (dB) tại điểm đó.`,
        solution: `a) $I = \\frac{P}{4\\pi r^2} = \\frac{0.4\\pi}{4\\pi\\cdot 100} = 10^{-3}\\text{ W/m}^2$.\n\nb) $L = 10\\log(10^{-3}/10^{-12}) = 90\\text{ dB}$.`,
        keyFormulasOrHints: ['I = P / (4 pi r^2)', 'L = 10 log(I / I0)']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Trong thí nghiệm Young, $a = 1\\text{ mm},\\; D = 2\\text{ m}$, ánh sáng đơn sắc có bước sóng $\\lambda = 0.55\\,\\mu\\text{m}$.\na) Tính khoảng vân $i$.\nb) Xác định vị trí vân sáng bậc $4$ và vân tối thứ $3$ kể từ vân trung tâm.`,
        solution: `a) Khoảng vân $i = \\frac{\\lambda D}{a} = 1.1\\text{ mm}$.\n\nb) Vân sáng bậc 4: $x_{s4} = 4i = 4.4\\text{ mm}$; vân tối thứ 3: $x_{t3} = 2.5i = 2.75\\text{ mm}$.`,
        keyFormulasOrHints: ['i = lambda D / a', 'Vân tối thứ k: x = (k - 0.5) i']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Mạch $RLC$ nối tiếp gồm $R = ${R_val}\\,\\Omega$, $Z_L = 80\\,\\Omega$, $Z_C = 40\\,\\Omega$ đặt dưới điện áp $u = 100\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$.\na) Tính tổng trở $Z$ và hệ số công suất $\\cos\\varphi$.\nb) Tính cường độ hiệu dụng $I$ và công suất tiêu thụ $P$.`,
        solution: `a) $Z = \\sqrt{${R_val}^2 + (80 - 40)^2} = ${Math.sqrt(R_val * R_val + 1600).toFixed(2)}\\,\\Omega$, hệ số công suất $\\cos\\varphi = \\frac{R}{Z} = ${(R_val / Math.sqrt(R_val * R_val + 1600)).toFixed(3)}$.\n\nb) $I = \\frac{100}{Z} \\approx ${(100 / Math.sqrt(R_val * R_val + 1600)).toFixed(2)}\\text{ A}$, $P = I^2 R \\approx ${((100 / Math.sqrt(R_val * R_val + 1600)) ** 2 * R_val).toFixed(1)}\\text{ W}$.`,
        keyFormulasOrHints: ['Z = sqrt(R^2 + (ZL - ZC)^2)', 'P = I^2 R'],
        simulationLink: { type: 'physics', targetId: 'electromagnetism', label: 'Mạch điện Xoay chiều RLC' }
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Đoạn dây dẫn thẳng dài $0.5\\text{ m}$ mang dòng $I = ${I_val}\\text{ A}$ đặt trong từ trường đều $B = 0.2\\text{ T}$ (GDPT 2018 Vật lí 12).\na) Tính lực từ khi dây vuông góc đường sức từ.\nb) Tính lực từ khi dây hợp với đường sức từ góc $30^\\circ$.`,
        solution: `a) $F_{\\max} = BIl = 0.2 \\cdot ${I_val} \\cdot 0.5 = ${(0.1 * I_val).toFixed(2)}\\text{ N}$.\n\nb) $F = BIl\\sin 30^\\circ = ${(0.05 * I_val).toFixed(3)}\\text{ N}$.`,
        keyFormulasOrHints: ['F = B I l sin alpha']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Khung dây $50$ vòng, diện tích mỗi vòng $200\\text{ cm}^2$ đặt vuông góc từ trường đều tăng từ $0.1\\text{ T}$ lên $0.5\\text{ T}$ trong $0.05\\text{ s}$.\na) Tính độ biến thiên từ thông $\\Delta\\Phi$.\nb) Tính độ lớn suất điện động cảm ứng $e_c$ trong khung.`,
        solution: `a) $\\Delta\\Phi = N\\cdot \\Delta B \\cdot S = 50 \\cdot 0.4 \\cdot 0.02 = 0.4\\text{ Wb}$.\n\nb) $|e_c| = \\frac{\\Delta\\Phi}{\\Delta t} = \\frac{0.4}{0.05} = 8\\text{ V}$.`,
        keyFormulasOrHints: ['Phi = N B S cos alpha', 'Định luật Faraday |e_c| = |Delta Phi / Delta t|']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Máy biến áp lý tưởng có $N_1 = 1000$ vòng và $N_2 = 250$ vòng. Đặt điện áp hiệu dụng $U_1 = 220\\text{ V}$ vào cuộn sơ cấp.\na) Tính điện áp hiệu dụng $U_2$ ở hai đầu cuộn thứ cấp để hở.\nb) Nối cuộn thứ cấp với điện trở thuần $R = 11\\,\\Omega$, tính cường độ dòng điện hiệu dụng ở cuộn sơ cấp $I_1$.`,
        solution: `a) $\\frac{U_2}{U_1} = \\frac{N_2}{N_1} \\implies U_2 = 220 \\cdot \\frac{250}{1000} = 55\\text{ V}$.\n\nb) $I_2 = \\frac{U_2}{R} = \\frac{55}{11} = 5\\text{ A}$. Vì máy lý tưởng: $I_1 = I_2\\frac{N_2}{N_1} = 5 \\cdot 0.25 = 1.25\\text{ A}$.`,
        keyFormulasOrHints: ['U1/U2 = N1/N2', 'I1/I2 = N2/N1']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Trong sóng điện từ, thành phần điện trường cực đại có độ lớn $E_0 = 60\\text{ V/m}$. Cho tốc độ ánh sáng $c = 3\\cdot 10^8\\text{ m/s}$.\na) Tính độ lớn cảm ứng từ cực đại $B_0$ tại điểm đó.\nb) Nếu mạch chọn sóng $LC$ có $L = 10\\,\\mu\\text{H}$ thu sóng $\\lambda = 30\\text{ m}$, tính điện dung $C$.`,
        solution: `a) $E_0 = cB_0 \\implies B_0 = \\frac{60}{3\\cdot 10^8} = 2\\cdot 10^{-7}\\text{ T}$.\n\nb) $\\lambda = 2\\pi c\\sqrt{LC} \\implies 30 = 2\\pi\\cdot 3\\cdot 10^8\\sqrt{10^{-5}C} \\implies C = \\frac{25}{\\pi^2}\\cdot 10^{-12}\\text{ F} \\approx 25.3\\text{ pF}$.`,
        keyFormulasOrHints: ['E0 = c B0', 'lambda = 2 pi c sqrt(LC)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một khối khí lý tưởng có $p_1 = 2\\cdot 10^5\\text{ Pa}$, $V_1 = 6\\text{ lít}$ ở $t_1 = 27^\\circ\\text{C}$.\na) Nén đẳng nhiệt xuống còn $V_2 = 2\\text{ lít}$, tính áp suất $p_2$.\nb) Đun nóng đẳng tích để áp suất tăng gấp đôi $p_2$, tìm nhiệt độ $t_3$ ($^\\circ\\text{C}$).`,
        solution: `a) Định luật Boyle: $p_2 = \\frac{p_1 V_1}{V_2} = 6\\cdot 10^5\\text{ Pa}$.\n\nb) Định luật Charles ($T_2 = 300\\text{ K}$): $T_3 = 2T_2 = 600\\text{ K} \\implies t_3 = 327^\\circ\\text{C}$.`,
        keyFormulasOrHints: ['p1 V1 = p2 V2', 'p1 / T1 = p2 / T2'],
        simulationLink: { type: 'physics', targetId: 'thermodynamics', label: 'Đẳng quá trình Khí lý tưởng' }
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Dùng ấm điện công suất $1500\\text{ W}$ đun sôi $2\\text{ kg}$ nước từ $25^\\circ\\text{C}$ đến $100^\\circ\\text{C}$ ($c = 4200\\text{ J/(kg}\\cdot\\text{K)}$, hiệu suất $80\\%$).\na) Tính nhiệt lượng có ích cần cung cấp.\nb) Tính thời gian đun sôi nước.`,
        solution: `a) $Q_{\\text{ích}} = mc\\Delta t = 2 \\cdot 4200 \\cdot 75 = 630\\,000\\text{ J}$.\n\nb) $t = \\frac{Q_{\\text{ích}}}{H \\cdot P} = \\frac{630000}{0.8 \\cdot 1500} = 525\\text{ s}$.`,
        keyFormulasOrHints: ['Q = m c Delta t', 'H = Q_ich / (P t)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Khí lý tưởng ở nhiệt độ $T = 300\\text{ K}$ và áp suất $p = 1.24\\cdot 10^5\\text{ Pa}$ ($k = 1.38\\cdot 10^{-23}\\text{ J/K}$).\na) Tính động năng tịnh tiến trung bình của mỗi phân tử khí.\nb) Tính mật độ phân tử khí $n$ ($\\text{m}^{-3}$).`,
        solution: `a) $\\overline{E_đ} = \\frac{3}{2}kT = 6.21\\cdot 10^{-21}\\text{ J}$.\n\nb) $n = \\frac{p}{kT} \\approx 3.0\\cdot 10^{25}\\text{ phân tử/m}^3$.`,
        keyFormulasOrHints: ['E_d = 3/2 k T', 'p = n k T']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Cung cấp cho một khối khí công $A = 80\\text{ J}$ đồng thời khối khí truyền ra môi trường nhiệt lượng $30\\text{ J}$.\na) Tính độ biến thiên nội năng $\\Delta U$ của khối khí theo Nguyên lý I Nhiệt động lực học.\nb) Nội năng của khối khí tăng hay giảm bao nhiêu Jun?`,
        solution: `a) Quy ước dấu GDPT 2018 ($\\Delta U = A + Q$): khối khí nhận công nên $A = +80\\text{ J}$; truyền nhiệt ra ngoài nên $Q = -30\\text{ J}$.\nVậy $\\Delta U = 80 + (-30) = +50\\text{ J}$.\n\nb) Vì $\\Delta U > 0$, nội năng của khối khí **tăng thêm $50\\text{ J}$**.`,
        keyFormulasOrHints: ['Nguyên lý I: Delta U = A + Q', 'Nhận (+), Tỏa/Sinh (-)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một khối nước đá khối lượng $0.5\\text{ kg}$ ở $0^\\circ\\text{C}$ nóng chảy hoàn toàn rồi được đun nóng lên $40^\\circ\\text{C}$ ($\\lambda = 3.34\\cdot 10^5\\text{ J/kg}$, $c = 4200\\text{ J/(kg}\\cdot\\text{K)}$).\na) Tính nhiệt lượng làm tan chảy hoàn toàn lượng nước đá ở $0^\\circ\\text{C}$.\nb) Tính tổng nhiệt lượng cần thiết cho cả quá trình.`,
        solution: `a) $Q_1 = \\lambda m = 3.34\\cdot 10^5 \\cdot 0.5 = 167\\,000\\text{ J} = 167\\text{ kJ}$.\n\nb) $Q_2 = mc\\Delta t = 0.5\\cdot 4200\\cdot 40 = 84\\,000\\text{ J} = 84\\text{ kJ}$. Tổng $Q = 167 + 84 = 251\\text{ kJ}$.`,
        keyFormulasOrHints: ['Q_nc = lambda m', 'Q_nhiet = m c Delta t']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Mẫu phóng xạ có chu kỳ bán rã $T = ${halfLife}\\text{ ngày}$, khối lượng ban đầu $m_0 = 80\\text{ g}$.\na) Tính hằng số phóng xạ $\\lambda$ ($\\text{ngày}^{-1}$).\nb) Tính khối lượng chất còn lại và khối lượng đã phân rã sau $t = ${3 * halfLife}\\text{ ngày}$.`,
        solution: `a) $\\lambda = \\frac{\\ln 2}{${halfLife}} \\approx ${(0.693 / halfLife).toFixed(4)}\\text{ ngày}^{-1}$.\n\nb) Còn lại $m = 80\\cdot 2^{-3} = 10\\text{ g}$; đã phân rã $\\Delta m = 70\\text{ g}$.`,
        keyFormulasOrHints: ['lambda = ln 2 / T', 'm = m0 2^(-t/T)'],
        simulationLink: { type: 'physics', targetId: 'modern', label: 'Phóng xạ Hạt nhân 2D/3D' }
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Hoàn thành các phản ứng hạt nhân sau:\na) $^{27}_{13}\\text{Al} + ^4_2\\text{He} \\to ^{30}_{15}\\text{P} + X$.\nb) $^{235}_{92}\\text{U} + ^1_0\\text{n} \\to ^{95}_{39}\\text{Y} + ^{138}_{53}\\text{I} + k\\,^1_0\\text{n}$. Xác định hạt $X$ và số nơtron $k$.`,
        solution: `a) Bảo toàn $A$ và $Z$: $A_X = 27 + 4 - 30 = 1$, $Z_X = 13 + 2 - 15 = 0 \\implies X$ là hạt nơtron ($^1_0\\text{n}$).\n\nb) Bảo toàn số khối: $235 + 1 = 95 + 138 + k \\implies k = 3$ (3 nơtron thứ cấp).`,
        keyFormulasOrHints: ['Bảo toàn số nuclôn A', 'Bảo toàn điện tích Z']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Tính năng lượng liên kết và năng lượng liên kết riêng của hạt nhân $^4_2\\text{He}$, biết $m_p = 1.0073\\text{ amu}$, $m_n = 1.0087\\text{ amu}$, $m_{\\text{He}} = 4.0015\\text{ amu}$ và $1\\text{ amu}\\cdot c^2 = 931.5\\text{ MeV}$.`,
        solution: `Độ hụt khối $\\Delta m = 2m_p + 2m_n - m_{\\text{He}} = 2(1.0073 + 1.0087) - 4.0015 = 0.0305\\text{ amu}$.\nNăng lượng liên kết: $E_{\\text{lk}} = 0.0305 \\cdot 931.5 \\approx 28.41\\text{ MeV}$.\nNăng lượng liên kết riêng: $\\varepsilon = \\frac{E_{\\text{lk}}}{4} \\approx 7.10\\text{ MeV/nuclôn}$.`,
        keyFormulasOrHints: ['Delta m = Z mp + (A-Z) mn - m_hatnhan', 'epsilon = E_lk / A']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Catôt tế bào quang điện có giới hạn $\\lambda_0 = 0.50\\,\\mu\\text{m}$. Chiếu bức xạ $\\lambda = 0.30\\,\\mu\\text{m}$ ($h = 6.625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$, $c = 3\\cdot 10^8\\text{ m/s}$).\na) Tính công thoát của kim loại.\nb) Tính vận tốc ban đầu cực đại của quang êlectron ($m_e = 9.1\\cdot 10^{-31}\\text{ kg}$).`,
        solution: `a) $A = \\frac{hc}{\\lambda_0} = 3.975\\cdot 10^{-19}\\text{ J} \\approx 2.48\\text{ eV}$.\n\nb) $\\frac{1}{2}m_e v_{\\max}^2 = \\frac{hc}{\\lambda} - A = 2.65\\cdot 10^{-19}\\text{ J} \\implies v_{\\max} = \\sqrt{\\frac{2\\cdot 2.65\\cdot 10^{-19}}{9.1\\cdot 10^{-31}}} \\approx 7.63\\cdot 10^5\\text{ m/s}$.`,
        keyFormulasOrHints: ['A = hc / lambda0', '1/2 mv_max^2 = hc/lambda - A']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Theo mẫu nguyên tử Bo của Hiđrô, bán kính Bo $r_0 = 5.3\\cdot 10^{-11}\\text{ m}$ và năng lượng $E_n = -\\frac{13.6}{n^2}\\text{ eV}$.\na) Tính bán kính quỹ đạo dừng thứ $3$ ($M$).\nb) Tính bước sóng phôtôn phát ra khi êlectron chuyển từ mức $n = 3$ về mức $n = 2$ (vạch $H_\\alpha$ đỏ).`,
        solution: `a) $r_M = 3^2 r_0 = 9 \\cdot 5.3\\cdot 10^{-11} = 4.77\\cdot 10^{-10}\\text{ m}$.\n\nb) $\\varepsilon = E_3 - E_2 = -\\frac{13.6}{9} - (-\\frac{13.6}{4}) = 1.889\\text{ eV} = 3.022\\cdot 10^{-19}\\text{ J} \\implies \\lambda = \\frac{hc}{\\varepsilon} \\approx 0.658\\,\\mu\\text{m}$.`,
        keyFormulasOrHints: ['r_n = n^2 r0', 'hc/lambda = E_cao - E_thap'],
        simulationLink: { type: 'physics', targetId: 'modern', label: 'Quang phổ vạch Bo 3D' }
      }
    ];

    const s1 = i % 5;
    const s2 = (i + Math.floor(i / 5)) % 5;
    const s3 = (i + 2 * Math.floor(i / 5)) % 5;
    const s4 = (i + 3 * Math.floor(i / 5)) % 5;

    const q1 = q1Pool[s1];
    const q2 = q2Pool[s2];
    const q3 = q3Pool[s3];
    const q4 = q4Pool[s4];

    exams.push({
      id: `phy-kc-${num}`,
      subject: 'physics',
      track: 'khong_chuyen',
      subjectTag: 'Vật Lí 12 THPT',
      categoryTag: i % 2 === 0 ? 'Thi Thử THPT Chuẩn GDPT 2018' : 'Khảo Sát Chất Lượng Lí 12',
      academicYear: year,
      title: `Đề Thi Thử Tốt Nghiệp Môn Vật Lí #${num} – ${school.split('–')[0].trim()}`,
      school,
      source: `Nguồn đề chuẩn THPT 2026: ${school}`,
      timeMinutes: 50,
      featuredSnippet: q1.content.slice(0, 130) + '...',
      topics: ['# Dao động & Sóng', '# Dòng điện & Lực từ', '# Vật lí Nhiệt & Khí', '# Hạt nhân & Bo'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
