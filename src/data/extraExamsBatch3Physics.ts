import { ExamPaper, ExamQuestion } from '../types';
import { CHUYEN_SCHOOLS_BATCH_3, THPT_INSTITUTIONS_BATCH_3 } from './extraExamsBatch3Math';

export function buildPhysicsChuyenBatch3(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 25; i++) {
    const num = 51 + i;
    const school = CHUYEN_SCHOOLS_BATCH_3[i];
    const m1 = 1 + (i % 4); // 1..4 kg
    const m2 = m1 + 2; // 3..6 kg (luôn nặng hơn m1)
    const M = 2; // khối lượng ròng rọc 2 kg
    const v0 = 20 + (i % 5) * 5; // 20..40 m/s
    const L = 1.0 + (i % 3) * 0.5; // 1.0, 1.5, 2.0 m
    const B = 0.2 + (i % 4) * 0.1; // 0.2..0.5 T

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một ròng rọc đồng chất dạng đĩa tròn có khối lượng $M = ${M}\\text{ kg}$, bán kính $R = 0.2\\text{ m}$ có thể quay không ma sát quanh trục nằm ngang cố định đi qua tâm. Vắt qua ròng rọc một sợi dây nhẹ không giãn, hai đầu treo hai vật nhỏ khối lượng $m_1 = ${m1}\\text{ kg}$ và $m_2 = ${m2}\\text{ kg}$. Thả nhẹ cho hệ chuyển động ($g = 10\\text{ m/s}^2$, dây không trượt trên ròng rọc).\na) Tính gia tốc $a$ của các vật và gia tốc góc $\\gamma$ của ròng rọc.\nb) Tính lực căng $T_1, T_2$ ở hai nhánh dây nối với $m_1, m_2$.`,
        solution: `a) Áp dụng phương trình định luật II Newton cho hai vật ($m_2 > m_1$ nên $m_2$ đi xuống, $m_1$ đi lên) và phương trình động lực học vật rắn quay quanh trục cố định ($I = \\frac{1}{2}MR^2$, $\\gamma = \\frac{a}{R}$):\n$$\\begin{cases} T_1 - m_1 g = m_1 a \\\\ m_2 g - T_2 = m_2 a \\\\ (T_2 - T_1)R = I\\gamma = \\frac{1}{2}MR^2 \\cdot \\frac{a}{R} \\implies T_2 - T_1 = \\frac{M}{2}a \\end{cases}$$\nCộng ba phương trình thu được gia tốc:\n$$a = \\frac{(m_2 - m_1)g}{m_1 + m_2 + \\frac{M}{2}} = \\frac{(${m2} - ${m1})\\cdot 10}{${m1 + m2 + M / 2}} = ${(20 / (m1 + m2 + 1)).toFixed(2)}\\text{ m/s}^2.$$\nGia tốc góc: $\\gamma = \\frac{a}{R} = \\frac{${(20 / (m1 + m2 + 1)).toFixed(2)}}{0.2} = ${(100 / (m1 + m2 + 1)).toFixed(1)}\\text{ rad/s}^2$.\n\nb) Lực căng hai nhánh dây:\n- $T_1 = m_1(g + a) = ${m1}\\cdot (10 + ${(20 / (m1 + m2 + 1)).toFixed(2)}) = ${(m1 * (10 + 20 / (m1 + m2 + 1))).toFixed(2)}\\text{ N}$.\n- $T_2 = m_2(g - a) = ${m2}\\cdot (10 - ${(20 / (m1 + m2 + 1)).toFixed(2)}) = ${(m2 * (10 - 20 / (m1 + m2 + 1))).toFixed(2)}\\text{ N}$.`,
        keyFormulasOrHints: ['Mômen quán tính đĩa tròn I = 1/2 M R^2', 'Chú ý T2 != T1 khi ròng rọc có khối lượng'],
        simulationLink: { type: 'physics', targetId: 'mechanics', label: 'Mô phỏng Động lực học 2D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Từ chân một mặt phẳng nghiêng góc $\\beta = 30^\\circ$ so với phương ngang, người ta ném một vật nhỏ với vận tốc ban đầu $v_0 = ${v0}\\text{ m/s}$ hợp với phương ngang một góc $\\alpha = 60^\\circ$ (nằm trong mặt phẳng thẳng đứng chứa đường dốc chính, hướng lên dốc). Bỏ qua sức cản không khí, lấy $g = 10\\text{ m/s}^2$.\na) Tìm thời gian từ lúc ném đến khi vật rơi chạm mặt phẳng nghiêng.\nb) Tính khoảng cách từ điểm ném đến điểm rơi dọc theo mặt phẳng nghiêng.`,
        solution: `Chọn hệ trục $Oxy$ với gốc $O$ tại điểm ném, $Ox$ nằm dọc theo mặt phẳng nghiêng hướng lên, $Oy$ vuông góc với mặt phẳng nghiêng hướng lên.\nCác thành phần vận tốc và gia tốc ban đầu:\n- Góc ném so với mặt nghiêng: $\\theta = \\alpha - \\beta = 60^\\circ - 30^\\circ = 30^\\circ$.\n- $v_{0x} = v_0\\cos 30^\\circ$, $v_{0y} = v_0\\sin 30^\\circ = ${v0 / 2}\\text{ m/s}$.\n- $a_x = -g\\sin 30^\\circ = -5\\text{ m/s}^2$, $a_y = -g\\cos 30^\\circ = -5\\sqrt{3}\\text{ m/s}^2$.\n\na) Vật chạm mặt nghiêng khi $y(t) = v_{0y}t + \\frac{1}{2}a_y t^2 = 0$ ($t > 0$):\n$$t = \\frac{2v_{0y}}{g\\cos 30^\\circ} = \\frac{${v0}}{5\\sqrt{3}} = ${(v0 / (5 * Math.sqrt(3))).toFixed(2)}\\text{ s}.$$\n\nb) Tọa độ dọc theo mặt nghiêng khi chạm dốc:\n$$L_{\\text{dốc}} = v_{0x}t + \\frac{1}{2}a_x t^2 = \\frac{v_0^2}{g\\cos^2 30^\\circ}\\big(\\sin 30^\\circ\\cos 30^\\circ - \\sin^2 30^\\circ\\tan 30^\\circ\\dots\\big) = \\frac{2v_0^2\\sin 30^\\circ\\cos 60^\\circ}{g\\cos^2 30^\\circ} = \\frac{${v0 * v0}}{15} \\approx ${(v0 * v0 / 15).toFixed(2)}\\text{ m}.$$`,
        keyFormulasOrHints: ['Chọn hệ trục Ox dọc mặt nghiêng, Oy vuông góc mặt nghiêng', 'L = 2 v0^2 sin(alpha - beta) cos(alpha) / (g cos^2 beta)'],
        simulationLink: { type: 'physics', targetId: 'mechanics', label: 'Quỹ đạo Ném xiên 2D/3D' }
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một thanh cứng đồng chất tiết diện đều chiều dài $\\ell = ${L.toFixed(1)}\\text{ m}$, khối lượng $M = ${m2}\\text{ kg}$ đặt tựa đầu trên $B$ vào bức tường thẳng đứng hoàn toàn nhẵn và đầu dưới $A$ đặt trên sàn ngang có hệ số ma sát nghỉ cực đại $\\mu = 0.5$ ($g = 10\\text{ m/s}^2$).\na) Khi thanh cân bằng ở góc nghiêng $\\alpha = 60^\\circ$ so với sàn ngang, tính các phản lực $N_A, N_B$ và lực ma sát $F_{\\text{ms}}$ tác dụng lên thanh.\nb) Tìm góc nghiêng nhỏ nhất $\\alpha_{\\min}$ so với sàn mà thanh vẫn đứng yên cân bằng không bị trượt.`,
        solution: `a) Điều kiện cân bằng lực theo phương đứng và phương ngang:\n- $N_A = Mg = ${m2 * 10}\\text{ N}$.\n- $F_{\\text{ms}} = N_B$.\nĐiều kiện cân bằng mômen lấy trục quay tại đầu dưới $A$:\n$$N_B \\cdot \\ell\\sin\\alpha = Mg \\cdot \\frac{\\ell}{2}\\cos\\alpha \\implies N_B = \\frac{Mg}{2\\tan\\alpha} = \\frac{${m2 * 10}}{2\\sqrt{3}} \\approx ${(5 * m2 / Math.sqrt(3)).toFixed(2)}\\text{ N}.$$\nSuy ra $F_{\\text{ms}} = N_B \\approx ${(5 * m2 / Math.sqrt(3)).toFixed(2)}\\text{ N}$.\n\nb) Để thanh không trượt, lực ma sát nghỉ phải thỏa mãn $F_{\\text{ms}} \\le \\mu N_A$:\n$$\\frac{Mg}{2\\tan\\alpha} \\le \\mu Mg \\iff \\tan\\alpha \\ge \\frac{1}{2\\mu} = \\frac{1}{2\\cdot 0.5} = 1 \\implies \\alpha_{\\min} = 45^\\circ.$$`,
        keyFormulasOrHints: ['Cân bằng mômen tại đầu A: M(N_B) = M(P)', 'Không trượt khi F_ms <= mu * N_A']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một bao cát khối lượng $M = ${m2}\\text{ kg}$ được treo bằng sợi dây mảnh không giãn dài $\\ell = 2\\text{ m}$ đang đứng yên. Một viên đạn khối lượng $m = 0.05\\text{ kg}$ bay theo phương ngang với tốc độ $v_0 = ${10 * v0}\\text{ m/s}$ đến cắm chặt vào bao cát ($g = 10\\text{ m/s}^2$, thời gian va chạm rất ngắn).\na) Tính tốc độ của hệ (bao cát + đạn) ngay sau va chạm và phần cơ năng chuyển hóa thành nhiệt.\nb) Tính độ cao cực đại $h_{\\max}$ mà hệ đạt được sau va chạm.`,
        solution: `a) Áp dụng định luật bảo toàn động lượng theo phương ngang trong va chạm mềm:\n$$mv_0 = (m + M)V \\implies V = \\frac{0.05 \\cdot ${10 * v0}}{${m2} + 0.05} = ${((0.5 * v0) / (m2 + 0.05)).toFixed(2)}\\text{ m/s}.$$\nNhiệt lượng tỏa ra bằng độ giảm cơ năng trong va chạm:\n$$Q = \\frac{1}{2}mv_0^2 - \\frac{1}{2}(m + M)V^2 = \\frac{1}{2}\\cdot\\frac{mM}{m + M}v_0^2 \\approx ${(0.5 * ((0.05 * m2) / (m2 + 0.05)) * (10 * v0) ** 2).toFixed(1)}\\text{ J}.$$\n\nb) Sau va chạm, cơ năng của hệ được bảo toàn:\n$$(m + M)gh_{\\max} = \\frac{1}{2}(m + M)V^2 \\implies h_{\\max} = \\frac{V^2}{2g} \\approx ${(((0.5 * v0) / (m2 + 0.05)) ** 2 / 20).toFixed(3)}\\text{ m}.$$`,
        keyFormulasOrHints: ['Va chạm mềm: chỉ bảo toàn động lượng', 'Q_toa = 1/2 * [mM/(m+M)] * v0^2']
      },
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: `Một vệ tinh nhân tạo khối lượng $m = 500\\text{ kg}$ bay quanh Trái Đất theo quỹ đạo tròn ở độ cao $h = 3600\\text{ km}$ so với mặt đất. Cho bán kính Trái Đất $R = 6400\\text{ km}$, gia tốc rơi tự do tại mặt đất $g_0 = 10\\text{ m/s}^2$.\na) Tính tốc độ dài $v$ và chu kỳ quay $T$ của vệ tinh trên quỹ đạo này.\nb) Tính cơ năng toàn phần $E$ của vệ tinh (chọn gốc thế năng hấp dẫn ở vô cực).`,
        solution: `a) Bán kính quỹ đạo $r = R + h = 6400 + 3600 = 10\\,000\\text{ km} = 10^7\\text{ m}$.\nLực hấp dẫn đóng vai trò lực hướng tâm ($GM = g_0 R^2$):\n$$\\frac{mv^2}{r} = \\frac{GMm}{r^2} = \\frac{g_0 R^2 m}{r^2} \\implies v = R\\sqrt{\\frac{g_0}{r}} = 6.4\\cdot 10^6\\sqrt{\\frac{10}{10^7}} = 6400\\text{ m/s} = 6.4\\text{ km/s}.$$\nChu kỳ quay:\n$$T = \\frac{2\\pi r}{v} = \\frac{2\\pi\\cdot 10^7}{6400} \\approx 9817\\text{ s} \\approx 2.73\\text{ giờ}.$$\n\nb) Cơ năng trên quỹ đạo tròn bằng nửa thế năng (hay đối của động năng):\n$$E = K + U = \\frac{1}{2}mv^2 - \\frac{GMm}{r} = -\\frac{1}{2}mv^2 = -0.5\\cdot 500\\cdot 6400^2 = -1.024\\cdot 10^{10}\\text{ J}.$$`,
        keyFormulasOrHints: ['GM = g0 * R^2', 'Cơ năng quỹ đạo tròn E = -1/2 mv^2']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một động cơ nhiệt lí tưởng hoạt động theo chu trình Carnot với nguồn nóng có nhiệt độ $T_1 = 600\\text{ K}$ và nguồn lạnh có nhiệt độ $T_2 = 300\\text{ K}$. Trong mỗi chu trình, tác nhân nhận nhiệt lượng $Q_1 = ${m2 * 1000}\\text{ J}$ từ nguồn nóng.\na) Tính hiệu suất $H$ của động cơ Carnot và công cơ học $A$ sinh ra trong mỗi chu trình.\nb) Tính nhiệt lượng $Q_2$ tỏa ra cho nguồn lạnh trong mỗi chu trình.`,
        solution: `a) Hiệu suất chu trình Carnot chỉ phụ thuộc vào nhiệt độ tuyệt đối hai nguồn:\n$$H = 1 - \\frac{T_2}{T_1} = 1 - \\frac{300}{600} = 0.5 = 50\\%.$$\nCông sinh ra trong mỗi chu trình:\n$$A = H \\cdot Q_1 = 0.5 \\cdot ${m2 * 1000} = ${m2 * 500}\\text{ J}.$$\n\nb) Nhiệt lượng nhả cho nguồn lạnh:\n$$Q_2 = Q_1 - A = ${m2 * 1000} - ${m2 * 500} = ${m2 * 500}\\text{ J}.$$`,
        keyFormulasOrHints: ['Hiệu suất Carnot H = 1 - T2 / T1', 'A = Q1 - Q2']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Cho $m_1 = ${m1}\\text{ kg}$ nước đá ở nhiệt độ $t_1 = -10^\\circ\\text{C}$ vào một bình nhiệt lượng kế chứa $m_2 = ${m2}\\text{ kg}$ nước ở nhiệt độ $t_2 = 50^\\circ\\text{C}$. Bỏ qua nhiệt dung của bình và mất mát nhiệt ra môi trường. Cho $c_{\\text{đá}} = 2100\\text{ J/(kg}\\cdot\\text{K)}$, $c_{\\text{nước}} = 4200\\text{ J/(kg}\\cdot\\text{K)}$, nhiệt nóng chảy riêng của nước đá $\\lambda = 3.34\\cdot 10^5\\text{ J/kg}$.\na) Kiểm tra xem nước đá có tan hết hoàn toàn hay không?\nb) Tính nhiệt độ cân bằng cuối cùng $t$ của hệ.`,
        solution: `a) Nhiệt lượng tối đa nước $m_2$ tỏa ra khi hạ xuống $0^\\circ\\text{C}$:\n$$Q_{\\text{tỏa max}} = m_2 c_{\\text{nước}}(50 - 0) = ${m2} \\cdot 4200 \\cdot 50 = ${m2 * 210000}\\text{ J}.$$\nNhiệt lượng cần thiết để $m_1$ nước đá tăng lên $0^\\circ\\text{C}$ và tan hết:\n$$Q_{\\text{thu đủ}} = m_1 c_{\\text{đá}}\\cdot 10 + m_1\\lambda = ${m1}(21000 + 334000) = ${m1 * 355000}\\text{ J}.$$\nSo sánh $Q_{\\text{tỏa max}} = ${m2 * 210000}\\text{ J}$ với $Q_{\\text{thu đủ}} = ${m1 * 355000}\\text{ J}$: vì $m_2 = m_1 + 2$, dễ thấy $Q_{\\text{tỏa max}} > Q_{\\text{thu đủ}}$ với các giá trị $m_1 \\le 4$ ($Q_{\\text{tỏa max}} - Q_{\\text{thu đủ}} > 0$), nên **nước đá tan hết**.\n\nb) Phương trình cân bằng nhiệt ở $t > 0^\\circ\\text{C}$:\n$$m_1 c_{\\text{đá}}\\cdot 10 + m_1\\lambda + m_1 c_{\\text{nước}}(t - 0) = m_2 c_{\\text{nước}}(50 - t) \\implies t = \\frac{${m2 * 210000 - m1 * 355000}}{(${m1} + ${m2})\\cdot 4200} = ${((m2 * 210000 - m1 * 355000) / ((m1 + m2) * 4200)).toFixed(2)}^\\circ\\text{C}.$$`,
        keyFormulasOrHints: ['So sánh Q_toa_max với Q_thu_du ở 0°C trước khi giải', 'Phương trình cân bằng nhiệt ΣQ_thu = ΣQ_toa']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Trên mặt nước phẳng lặng có hai nguồn sóng kết hợp đồng bộ $S_1, S_2$ cách nhau $S_1 S_2 = 16\\text{ cm}$, dao động điều hòa cùng pha với tần số $f = 25\\text{ Hz}$. Tốc độ truyền sóng trên mặt nước là $v = 100\\text{ cm/s}$.\na) Tính bước sóng $\\lambda$ và số điểm cực đại giao thoa trên đoạn thẳng nối $S_1 S_2$.\nb) Xét điểm $M$ trên mặt nước sao cho $\\triangle MS_1 S_2$ vuông tại $S_1$ và $MS_1 = 12\\text{ cm}$. Kiểm tra $M$ là cực đại hay cực tiểu (hoặc tìm số cực đại trên đoạn $MS_2$).`,
        solution: `a) Bước sóng $\\lambda = \\frac{v}{f} = \\frac{100}{25} = 4\\text{ cm}$.\nSố cực đại trên đoạn $S_1 S_2$ thỏa điều kiện:\n$$-\\frac{S_1 S_2}{\\lambda} < k < \\frac{S_1 S_2}{\\lambda} \\iff -4 < k < 4 \\implies k \\in \\{-3, -2, -1, 0, 1, 2, 3\\}.$$\nCó $7$ điểm cực đại giao thoa trên đoạn $S_1 S_2$.\n\nb) Vì $\\triangle MS_1 S_2$ vuông tại $S_1$: $MS_2 = \\sqrt{S_1 S_2^2 + MS_1^2} = \\sqrt{16^2 + 12^2} = 20\\text{ cm}$.\nHiệu đường đi tại $M$: $\\Delta d_M = MS_2 - MS_1 = 20 - 12 = 8\\text{ cm} = 2\\lambda \\implies M$ nằm trên vân cực đại bậc $k = 2$.`,
        keyFormulasOrHints: ['lambda = v / f', 'Cực đại cùng pha: d2 - d1 = k * lambda'],
        simulationLink: { type: 'physics', targetId: 'waves', label: 'Giao thoa Sóng mặt nước 2D' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một còi tàu phát âm thanh tần số chuẩn $f_0 = 800\\text{ Hz}$ trong không khí tĩnh lặng (tốc độ truyền âm $v = 340\\text{ m/s}$).\na) Tàu chạy thẳng tiến lại gần một hành khách đứng yên trên sân ga với tốc độ $v_s = 20\\text{ m/s}$. Tính tần số âm thanh $f_1$ mà hành khách nghe được (Hiệu ứng Doppler).\nb) Khi tàu chạy vượt qua và đi ra xa hành khách với tốc độ như cũ, tính tần số $f_2$ mà hành khách nghe được.`,
        solution: `Áp dụng công thức hiệu ứng Doppler khi người nghe đứng yên ($v_O = 0$) và nguồn âm chuyển động với tốc độ $v_s$:\n\na) Khi nguồn tiến lại gần người nghe:\n$$f_1 = f_0 \\frac{v}{v - v_s} = 800 \\cdot \\frac{340}{340 - 20} = 800 \\cdot \\frac{340}{320} = 850\\text{ Hz}.$$\n\nb) Khi nguồn đi ra xa người nghe:\n$$f_2 = f_0 \\frac{v}{v + v_s} = 800 \\cdot \\frac{340}{340 + 20} = 800 \\cdot \\frac{340}{360} \\approx 755.56\\text{ Hz}.$$`,
        keyFormulasOrHints: ['Doppler f\' = f0 * (v +- v_O) / (v -+ v_s)', 'Lại gần thì tần số tăng, ra xa thì tần số giảm']
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: `Một lò xo nhẹ độ cứng $k = 100\\text{ N/m}$ cắt ghép hoặc gắn nối tiếp với một lò xo khác $k_2 = 150\\text{ N/m}$, đầu dưới gắn vật nặng $m = 0.6\\text{ kg}$ đặt trên mặt phẳng ngang không ma sát.\na) Tính độ cứng tương đương $k_{\\text{td}}$ khi ghép nối tiếp và chu kỳ dao động riêng $T$.\nb) Nếu chuyển sang ghép song song hai lò xo đó với cùng vật $m$, tỉ số chu kỳ $\\frac{T_{\\text{nt}}}{T_{\\text{ss}}}$ bằng bao nhiêu?`,
        solution: `a) Khi ghép nối tiếp:\n$$\\frac{1}{k_{\\text{nt}}} = \\frac{1}{k_1} + \\frac{1}{k_2} = \\frac{1}{100} + \\frac{1}{150} = \\frac{5}{300} \\implies k_{\\text{nt}} = 60\\text{ N/m}.$$\nChu kỳ dao động:\n$$T_{\\text{nt}} = 2\\pi\\sqrt{\\frac{m}{k_{\\text{nt}}}} = 2\\pi\\sqrt{\\frac{0.6}{60}} = \\frac{2\\pi}{10} = 0.2\\pi \\approx 0.628\\text{ s}.$$\n\nb) Khi ghép song song: $k_{\\text{ss}} = k_1 + k_2 = 100 + 150 = 250\\text{ N/m}$.\nTỉ số chu kỳ:\n$$\\frac{T_{\\text{nt}}}{T_{\\text{ss}}} = \\sqrt{\\frac{k_{\\text{ss}}}{k_{\\text{nt}}}} = \\sqrt{\\frac{250}{60}} = \\frac{5}{\\sqrt{6}} \\approx 2.04.$$`,
        keyFormulasOrHints: ['Nối tiếp 1/k = 1/k1 + 1/k2', 'Song song k = k1 + k2']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một êlectron (khối lượng $m_e = 9.1\\cdot 10^{-31}\\text{ kg}$, điện tích $q = -1.6\\cdot 10^{-19}\\text{ C}$) được tăng tốc qua hiệu điện thế $U_0 = 2000\\text{ V}$, rồi bay theo phương vuông góc với đường sức từ vào vùng từ trường đều có cảm ứng từ $B = ${B.toFixed(1)}\\text{ T}$.\na) Tính tốc độ $v$ của êlectron khi bắt đầu vào từ trường (bỏ qua vận tốc ban đầu trước khi tăng tốc).\nb) Chứng minh quỹ đạo trong từ trường đều là đường tròn, tính bán kính quỹ đạo $R$ và chu kỳ quay $T$.`,
        solution: `a) Áp dụng định lý động năng trong điện trường tăng tốc:\n$$\\frac{1}{2}m_e v^2 = |q|U_0 \\implies v = \\sqrt{\\frac{2|q|U_0}{m_e}} = \\sqrt{\\frac{2\\cdot 1.6\\cdot 10^{-19}\\cdot 2000}{9.1\\cdot 10^{-31}}} \\approx 2.65\\cdot 10^7\\text{ m/s}.$$\n\nb) Lực Lorentz $f_L = |q|vB$ luôn vuông góc với $\\vec{v}$ đóng vai trò lực hướng tâm không sinh công:\n$$|q|vB = \\frac{m_e v^2}{R} \\implies R = \\frac{m_e v}{|q|B} = \\frac{9.1\\cdot 10^{-31}\\cdot 2.65\\cdot 10^7}{1.6\\cdot 10^{-19}\\cdot ${B.toFixed(1)}} \\approx ${((9.1e-31 * 2.65e7) / (1.6e-19 * B) * 1000).toFixed(2)}\\text{ mm}.$$\nChu kỳ quay (không phụ thuộc vào vận tốc):\n$$T = \\frac{2\\pi R}{v} = \\frac{2\\pi m_e}{|q|B} \\approx ${((2 * Math.PI * 9.1e-31) / (1.6e-19 * B) * 1e12).toFixed(1)}\\text{ ps}.$$`,
        keyFormulasOrHints: ['Định lý động năng: 1/2 mv^2 = |q|U', 'Bán kính Lorentz R = mv / (|q|B)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Hai tụ điện có điện dung $C_1 = 2\\,\\mu\\text{F}$ và $C_2 = 3\\,\\mu\\text{F}$. Ban đầu tích điện cho $C_1$ tới hiệu điện thế $U_1 = 100\\text{ V}$, và $C_2$ chưa tích điện. Sau đó đóng khóa $K$ nối hai tụ song song với nhau (bản dương nối nhau, bản âm nối nhau).\na) Tính hiệu điện thế ổn định $U$ trên mỗi tụ sau khi đóng khóa $K$ và điện lượng $\\Delta q$ dịch chuyển qua khóa $K$.\nb) Tính phần năng lượng điện trường bị tỏa nhiệt trên dây nối khi đóng khóa $K$.`,
        solution: `a) Điện tích ban đầu trên $C_1$: $Q_1 = C_1 U_1 = 2\\cdot 100 = 200\\,\\mu\\text{C}$, trên $C_2$ là $Q_2 = 0$.\nTheo định luật bảo toàn điện tích khi nối song song cùng cực:\n$$Q'_1 + Q'_2 = Q_1 \\implies (C_1 + C_2)U = Q_1 \\implies U = \\frac{200}{2 + 3} = 40\\text{ V}.$$\nĐiện lượng chạy qua khóa $K$ sang nạp cho $C_2$: $\\Delta q = Q'_2 = C_2 U = 3\\cdot 40 = 120\\,\\mu\\text{C}$.\n\nb) Độ giảm năng lượng điện trường (tỏa nhiệt + bức xạ điện từ):\n$$\\Delta W = \\frac{1}{2}C_1 U_1^2 - \\frac{1}{2}(C_1 + C_2)U^2 = 0.5\\cdot 2\\cdot 10^{-6}\\cdot 100^2 - 0.5\\cdot 5\\cdot 10^{-6}\\cdot 40^2 = 0.01 - 0.004 = 0.006\\text{ J} = 6\\text{ mJ}.$$`,
        keyFormulasOrHints: ['Bảo toàn điện tích trên các bản nối liền', 'Tỏa nhiệt = W_truoc - W_sau']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một khung dây dẫn phẳng hình vuông gồm $N = 100$ vòng dây, cạnh $a = 20\\text{ cm}$, điện trở toàn phần của khung $R = 4\\,\\Omega$, quay đều quanh một trục đối xứng nằm trong mặt phẳng khung với tốc độ $n = 1500\\text{ vòng/phút}$ trong từ trường đều có $B = ${B.toFixed(1)}\\text{ T}$ (với $\\vec{B} \\perp$ trục quay).\na) Tính từ thông cực đại qua khung $\\Phi_0$ và suất điện động cực đại $E_0$.\nb) Tính cường độ dòng điện hiệu dụng chạy trong khung và nhiệt lượng tỏa ra trên khung trong $1$ phút.`,
        solution: `a) Tốc độ góc $\\omega = 2\\pi f = 2\\pi \\cdot \\frac{1500}{60} = 50\\pi\\text{ rad/s}$. Diện tích $S = a^2 = 0.04\\text{ m}^2$.\nTừ thông cực đại:\n$$\\Phi_0 = NBS = 100 \\cdot ${B.toFixed(1)} \\cdot 0.04 = ${(4 * B).toFixed(2)}\\text{ Wb}.$$\nSuất điện động cực đại:\n$$E_0 = \\omega \\Phi_0 = 50\\pi \\cdot ${(4 * B).toFixed(2)} = ${(200 * B).toFixed(0)}\\pi\\text{ V}.$$\n\nb) Cường độ dòng điện hiệu dụng:\n$$I = \\frac{E_0}{\\sqrt{2}R} = \\frac{${(200 * B).toFixed(0)}\\pi}{4\\sqrt{2}} \\approx ${((200 * B * Math.PI) / (4 * Math.SQRT2)).toFixed(2)}\\text{ A}.$$\nNhiệt lượng tỏa ra trong $t = 60\\text{ s}$: $Q = I^2 Rt \\approx ${((((200 * B * Math.PI) / (4 * Math.SQRT2)) ** 2) * 4 * 60).toFixed(0)}\\text{ J}$.`,
        keyFormulasOrHints: ['E0 = omega * N * B * S', 'I_hd = I0 / sqrt(2)']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Một trạm phát điện truyền đi công suất $P = 100\\text{ kW}$ bằng đường dây tải điện có tổng điện trở $R = 10\\,\\Omega$.\na) Nếu truyền đi ở điện áp hiệu dụng $U_1 = 5\\text{ kV}$ (coi $\\cos\\varphi = 1$), tính công suất hao phí $\\Delta P_1$ trên đường dây và hiệu suất truyền tải.\nb) Muốn giảm công suất hao phí xuống còn $1\\%$ công suất phát thì phải tăng điện áp nơi phát lên giá trị $U_2$ bằng bao nhiêu?`,
        solution: `a) Công suất hao phí trên đường dây:\n$$\\Delta P_1 = \\frac{P^2 R}{U_1^2 \\cos^2\\varphi} = \\frac{(10^5)^2 \\cdot 10}{(5\\cdot 10^3)^2} = 4000\\text{ W} = 4\\text{ kW}.$$\nHiệu suất truyền tải $H_1 = \\frac{P - \\Delta P_1}{P} = \\frac{100 - 4}{100} = 96\\%$.\n\nb) Hiện tại $\\Delta P_1 = 4\\% P$. Muốn giảm hao phí xuống $4$ lần (còn $1\\% P$), vì $\\Delta P \\propto \\frac{1}{U^2}$ nên cần **tăng điện áp lên $2$ lần**:\n$$U_2 = 2 U_1 = 10\\text{ kV}.$$`,
        keyFormulasOrHints: ['Delta P = P^2 R / (U cos phi)^2', 'Hao phí giảm k^2 lần khi tăng U lên k lần']
      },
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: `Hai điện tích điểm $q_1 = +4\\cdot 10^{-8}\\text{ C}$ và $q_2 = -9\\cdot 10^{-8}\\text{ C}$ đặt cố định tại hai điểm $A, B$ cách nhau $AB = 10\\text{ cm}$ trong chân không ($k = 9\\cdot 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$).\na) Xác định vị trí điểm $M$ trên đường thẳng $AB$ có cường độ điện trường tổng hợp $\\vec{E}_M = \\vec{0}$.\nb) Đặt một điện tích $q_3$ tại $M$ thì lực điện tác dụng lên $q_3$ bằng $0$; hỏi phải chọn $q_3$ có dấu và độ lớn bằng bao nhiêu để cả ba điện tích cùng cân bằng?`,
        solution: `a) Vì $q_1$ và $q_2$ trái dấu và $|q_1| < |q_2|$, điểm $M$ phải nằm ngoài đoạn $AB$ và gần $q_1$ hơn (phía $A$). Gọi $MA = x > 0 \\implies MB = x + 10\\text{ cm}$.\nĐiều kiện $E_1 = E_2$:\n$$\\frac{|q_1|}{x^2} = \\frac{|q_2|}{(x + 10)^2} \\iff \\frac{2}{x} = \\frac{3}{x + 10} \\implies x = 20\\text{ cm}.$$\nVậy $M$ nằm trên tia đối của tia $AB$, cách $A$ đoạn $20\\text{ cm}$ (cách $B$ đoạn $30\\text{ cm}$).\n\nb) Để $q_1$ cũng cân bằng, lực do $q_3$ tác dụng lên $q_1$ phải cân bằng với lực hút của $q_2$ lên $q_1$ (hướng về $B$), nên $q_3$ phải đẩy $q_1$ (hoặc hút? $q_2$ hút $q_1$ sang phải $\\implies q_3$ nằm bên trái $A$ phải **hút** $q_1$ sang trái $\\implies q_3 < 0$).\nĐộ lớn cân bằng tại $A$:\n$$\\frac{|q_3||q_1|}{MA^2} = \\frac{|q_2||q_1|}{AB^2} \\implies |q_3| = |q_2|\\left(\\frac{20}{10}\\right)^2 = 4|q_2| = 36\\cdot 10^{-8}\\text{ C}.$$\nVậy $q_3 = -3.6\\cdot 10^{-7}\\text{ C}$.`,
        keyFormulasOrHints: ['Hai điện tích trái dấu: điểm E=0 nằm ngoài đoạn, gần |q| nhỏ hơn', 'Hệ 3 điện tích cân bằng: F_12 + F_13 = 0']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Xét nguyên tử Hiđrô theo mẫu nguyên tử Bo, mức năng lượng ở trạng thái dừng thứ $n$ cho bởi $E_n = -\\frac{13.6}{n^2}\\text{ eV}$ ($n = 1, 2, 3, \\dots$).\na) Khi êlectron chuyển từ quỹ đạo $M$ ($n = 3$) về quỹ đạo $K$ ($n = 1$), nguyên tử phát ra phôtôn có năng lượng (theo eV) và bước sóng bằng bao nhiêu? ($h = 6.625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}, c = 3\\cdot 10^8\\text{ m/s}, 1\\text{ eV} = 1.6\\cdot 10^{-19}\\text{ J}$).\nb) Chiếu vào đám nguyên tử Hiđrô đang ở trạng thái cơ bản ($n = 1$) bức xạ kích thích để êlectron nhảy lên tối đa mức $n = 4$. Hỏi đám nguyên tử có thể phát ra tối đa bao nhiêu vạch quang phổ?`,
        solution: `a) Năng lượng phôtôn phát ra:\n$$\\varepsilon_{31} = E_3 - E_1 = -\\frac{13.6}{9} - (-13.6) = 13.6\\cdot\\frac{8}{9} \\approx 12.09\\text{ eV} = 1.934\\cdot 10^{-18}\\text{ J}.$$\nBước sóng phát ra:\n$$\\lambda = \\frac{hc}{\\varepsilon_{31}} = \\frac{6.625\\cdot 10^{-34}\\cdot 3\\cdot 10^8}{1.934\\cdot 10^{-18}} \\approx 0.1028\\,\\mu\\text{m}\\; (\\text{vùng tử ngoại, dãy Lai-man}).$$\n\nb) Khi bị kích thích lên mức $n = 4$, số vạch tối đa có thể phát ra khi chuyển về các mức thấp hơn là:\n$$N_{\\text{vạch}} = \\frac{n(n - 1)}{2} = \\frac{4 \\cdot 3}{2} = 6\\text{ vạch}.$$`,
        keyFormulasOrHints: ['hc / lambda = E_cao - E_thap', 'Số vạch tối đa = n(n - 1) / 2']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Trong thí nghiệm Y-âng về giao thoa ánh sáng, hai khe cách nhau $a = 1\\text{ mm}$, màn quan sát cách hai khe $D = 2\\text{ m}$, nguồn sáng đơn sắc bước sóng $\\lambda = 0.6\\,\\mu\\text{m}$.\na) Tính khoảng vân $i$ trong không khí.\nb) Đặt một bản mặt song song mỏng trong suốt dày $e = 10\\,\\mu\\text{m}$, chiết suất $n = 1.5$ chắn ngay phía trước khe $S_1$. Hệ vân dịch chuyển về phía nào và một đoạn bằng bao nhiêu?`,
        solution: `a) Khoảng vân:\n$$i = \\frac{\\lambda D}{a} = \\frac{0.6\\cdot 10^{-6} \\cdot 2}{10^{-3}} = 1.2\\cdot 10^{-3}\\text{ m} = 1.2\\text{ mm}.$$\n\nb) Do ánh sáng đi qua bản mỏng bị chậm lại (quang lộ tăng thêm $(n - 1)e$), hệ vân dịch chuyển **về phía khe $S_1$** (khe có đặt bản mỏng) một đoạn:\n$$\\Delta x = \\frac{(n - 1)e D}{a} = \\frac{(1.5 - 1)\\cdot 10\\cdot 10^{-6}\\cdot 2}{10^{-3}} = 0.01\\text{ m} = 10\\text{ mm}.$$`,
        keyFormulasOrHints: ['i = lambda D / a', 'Độ dịch hệ vân Delta x = (n - 1) e D / a về phía khe bị chắn']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Một hệ quang học gồm hai thấu kính hội tụ đồng trục $L_1$ ($f_1 = 20\\text{ cm}$) và $L_2$ ($f_2 = 10\\text{ cm}$) đặt cách nhau $O_1 O_2 = 50\\text{ cm}$. Đặt vật sáng phẳng nhỏ $AB$ vuông góc với trục chính trước $L_1$ đoạn $d_1 = 30\\text{ cm}$.\na) Xác định vị trí, tính chất và độ phóng đại của ảnh cuối cùng $A_2 B_2$ qua hệ hai thấu kính.\nb) Phải dịch chuyển $L_2$ về phía nào và bao nhiêu cm để ảnh cuối cùng $A_2 B_2$ thu được trên màn ảnh đặt cách $L_1$ cố định? (hoặc để ảnh cuối cùng hiện ra ở vô cực).`,
        solution: `a) Qua $L_1$: $d_1' = \\frac{d_1 f_1}{d_1 - f_1} = \\frac{30 \\cdot 20}{30 - 20} = 60\\text{ cm}$ (ảnh thật, ngược chiều, $k_1 = -\\frac{d_1'}{d_1} = -2$).\nKhoảng cách từ $A_1 B_1$ tới $L_2$: $d_2 = O_1 O_2 - d_1' = 50 - 60 = -10\\text{ cm}$ (vật ảo đối với $L_2$).\nQua $L_2$: $d_2' = \\frac{d_2 f_2}{d_2 - f_2} = \\frac{(-10)\\cdot 10}{-10 - 10} = +5\\text{ cm}$ (ảnh thật, nằm sau $L_2$ đoạn $5\\text{ cm}$).\nĐộ phóng đại toàn hệ: $k = k_1 \\cdot k_2 = (-2)\\cdot\\left(-\\frac{5}{-10}\\right) = -1$ (ảnh cuối cùng cao bằng vật và ngược chiều vật).\n\nb) Để ảnh cuối cùng nằm ở vô cực, $A_1 B_1$ phải nằm ngay tại tiêu điểm vật chính của $L_2$, tức $d_2 = f_2 = 10\\text{ cm} \\implies O_1 O_2 = d_1' + d_2 = 60 + 10 = 70\\text{ cm}$. Vậy cần dịch chuyển $L_2$ **ra xa $L_1$ thêm $20\\text{ cm}$**.`,
        keyFormulasOrHints: ['d2 = l - d1\'', 'k = k1 * k2', 'Ảnh ở vô cực khi d2 = f2']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Dùng hạt prôtôn ($p$) có động năng $K_p = 5.45\\text{ MeV}$ bắn vào hạt nhân $^9_4\\text{Be}$ đứng yên gây ra phản ứng tạo thành hạt nhân $^6_3\\text{Li}$ và hạt nhân $X$: $^1_1\\text{p} + ^9_4\\text{Be} \\to ^6_3\\text{Li} + X$. Biết hạt $X$ bay ra theo phương vuông góc với phương chuyển động của hạt prôtôn và lấy tỉ lệ khối lượng xấp xỉ số khối.\na) Xác định tên, số khối, điện tích của hạt nhân $X$.\nb) Cho năng lượng tỏa ra của phản ứng là $\\Delta E = 2.125\\text{ MeV}$. Tính động năng của hạt nhân $X$ và hạt $^6_3\\text{Li}$ sau phản ứng.`,
        solution: `a) Bảo toàn số khối $A$ và điện tích $Z$: $1 + 9 = 6 + A_X \\implies A_X = 4$; $1 + 4 = 3 + Z_X \\implies Z_X = 2$. Vậy hạt $X$ là hạt $\\alpha$ ($^4_2\\text{He}$).\n\nb) Vì $\\vec{p}_X \\perp \\vec{p}_p$ và $\\vec{p}_p = \\vec{p}_{\\text{Li}} + \\vec{p}_X$, theo định lý Pitago:\n$$p_{\\text{Li}}^2 = p_p^2 + p_X^2 \\iff 2m_{\\text{Li}} K_{\\text{Li}} = 2m_p K_p + 2m_X K_X \\iff 6 K_{\\text{Li}} = K_p + 4 K_X\\; (1).$$\nMặt khác, bảo toàn năng lượng toàn phần:\n$$K_X + K_{\\text{Li}} = K_p + \\Delta E = 5.45 + 2.125 = 7.575\\text{ MeV}\\; (2).$$\nThay $K_{\\text{Li}} = 7.575 - K_X$ vào $(1)$:\n$$6(7.575 - K_X) = 5.45 + 4 K_X \\iff 10 K_X = 40 \\implies K_X = 4\\text{ MeV}, \\quad K_{\\text{Li}} = 3.575\\text{ MeV}.$$`,
        keyFormulasOrHints: ['p^2 = 2mK', 'Pitago vecto động lượng p_Li^2 = p_p^2 + p_X^2']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Một lăng kính thủy tinh có tiết diện thẳng là tam giác đều $ABC$ ($A = 60^\\circ$) đặt trong không khí. Chiếu một tia sáng đơn sắc từ không khí tới mặt bên $AB$ với góc tới $i_1 = 45^\\circ$, biết chiết suất của thủy tinh đối với ánh sáng đó là $n = \\sqrt{2}$.\na) Tính góc khúc xạ $r_1$ tại mặt $AB$ và góc tới $r_2$ tại mặt bên $AC$.\nb) Tia sáng có ló ra ngoài qua mặt $AC$ hay xảy ra phản xạ toàn phần? Tính góc lệch toàn phần $D$ của tia ló so với tia tới.`,
        solution: `a) Áp dụng định luật khúc xạ tại mặt $AB$: $\\sin i_1 = n\\sin r_1 \\implies \\sin 45^\\circ = \\sqrt{2}\\sin r_1 \\implies \\sin r_1 = 0.5 \\implies r_1 = 30^\\circ$.\nCông thức lăng kính: $r_1 + r_2 = A = 60^\\circ \\implies r_2 = 60^\\circ - 30^\\circ = 30^\\circ$.\n\nb) Góc giới hạn phản xạ toàn phần của thủy tinh đối với không khí: $\\sin i_{\\text{gh}} = \\frac{1}{n} = \\frac{1}{\\sqrt{2}} \\implies i_{\\text{gh}} = 45^\\circ$.\nVì $r_2 = 30^\\circ < i_{\\text{gh}}$ nên tia sáng **ló ra ngoài qua mặt $AC$** với $\\sin i_2 = n\\sin r_2 = \\sqrt{2}\\cdot 0.5 = \\frac{\\sqrt{2}}{2} \\implies i_2 = 45^\\circ$.\nGóc lệch cực tiểu đạt được: $D = i_1 + i_2 - A = 45^\\circ + 45^\\circ - 60^\\circ = 30^\\circ$.`,
        keyFormulasOrHints: ['sin i1 = n sin r1; r1 + r2 = A', 'Góc lệch cực tiểu khi i1 = i2']
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[(i + 2) % q3Pool.length];
    const q4 = q4Pool[(i + 3) % q4Pool.length];

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
      topics: ['# Vật rắn & Quỹ đạo', '# Carnot & Doppler', '# Lorentz & Điện từ', '# Quang & Hạt nhân'],
      difficulty: 'Chuyên / HSG',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}

export function buildPhysicsStandardBatch3(): ExamPaper[] {
  const exams: ExamPaper[] = [];

  for (let i = 0; i < 25; i++) {
    const num = 51 + i;
    const school = THPT_INSTITUTIONS_BATCH_3[i];
    const ell = 0.4 + (i % 4) * 0.2; // 0.4..1.0 m (0.4, 0.6, 0.8, 1.0)
    const R_val = 30 + (i % 4) * 10; // 30..60 Ohm
    const I_val = 2 + (i % 3); // 2..4 A
    const halfLife = 2 + (i % 4) * 2; // 2..8 days

    const q1Pool: ExamQuestion[] = [
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một con lắc đơn có chiều dài dây treo $\\ell = ${ell.toFixed(1)}\\text{ m}$ dao động điều hòa tại nơi có gia tốc trọng trường $g = 10\\text{ m/s}^2$ (lấy $\\pi^2 \\approx 10$).\na) Tính chu kỳ $T$ và tần số góc $\\omega$ của con lắc đơn.\nb) Biết biên độ góc $\\alpha_0 = 0.1\\text{ rad}$ và vật nặng có khối lượng $m = 0.2\\text{ kg}$, tính cơ năng dao động của con lắc.`,
        solution: `a) Tần số góc:\n$$\\omega = \\sqrt{\\frac{g}{\\ell}} = \\sqrt{\\frac{10}{${ell.toFixed(1)}}} \\approx ${(Math.sqrt(10 / ell)).toFixed(2)}\\text{ rad/s}.$$\nChu kỳ dao động:\n$$T = 2\\pi\\sqrt{\\frac{\\ell}{g}} = 2\\pi\\sqrt{\\frac{${ell.toFixed(1)}}{10}} \\approx ${(2 * Math.PI * Math.sqrt(ell / 10)).toFixed(3)}\\text{ s}.$$\n\nb) Cơ năng con lắc đơn dao động nhỏ:\n$$W = \\frac{1}{2}mg\\ell\\alpha_0^2 = 0.5 \\cdot 0.2 \\cdot 10 \\cdot ${ell.toFixed(1)} \\cdot (0.1)^2 = ${(0.01 * ell).toFixed(4)}\\text{ J}.$$`,
        keyFormulasOrHints: ['T = 2pi * sqrt(l / g)', 'W = 1/2 m g l alpha_0^2'],
        simulationLink: { type: 'physics', targetId: 'oscillations', label: 'Mô phỏng Con lắc đơn 2D' }
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một chất điểm thực hiện đồng thời hai dao động điều hòa cùng phương, cùng tần số có phương trình lần lượt là $x_1 = 3\\cos(10t)\\text{ (cm)}$ và $x_2 = 4\\cos(10t + \\frac{\\pi}{2})\\text{ (cm)}$.\na) Xác định biên độ $A$ và pha ban đầu $\\varphi$ của dao động tổng hợp $x = x_1 + x_2$.\nb) Tính tốc độ cực đại và gia tốc cực đại của chất điểm.`,
        solution: `a) Vì hai dao động thành phần vuông pha ($\\Delta\\varphi = \\frac{\\pi}{2}$), biên độ tổng hợp:\n$$A = \\sqrt{A_1^2 + A_2^2} = \\sqrt{3^2 + 4^2} = 5\\text{ cm}.$$\nPha ban đầu: $\\tan\\varphi = \\frac{A_2}{A_1} = \\frac{4}{3} \\implies \\varphi \\approx 0.927\\text{ rad}$.\nPhương trình tổng hợp: $x = 5\\cos(10t + 0.927)\\text{ (cm)}$.\n\nb) Tốc độ cực đại $v_{\\max} = \\omega A = 10 \\cdot 5 = 50\\text{ cm/s} = 0.5\\text{ m/s}$.\nGia tốc cực đại $a_{\\max} = \\omega^2 A = 10^2 \\cdot 5 = 500\\text{ cm/s}^2 = 5\\text{ m/s}^2$.`,
        keyFormulasOrHints: ['Hai dao động vuông pha: A = sqrt(A1^2 + A2^2)', 'v_max = omega A, a_max = omega^2 A']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Một nguồn phát âm điểm phát sóng âm đẳng hướng ra không gian với công suất phát không đổi $P = 0.4\\pi\\text{ W}$ (lấy ngưỡng nghe chuẩn $I_0 = 10^{-12}\\text{ W/m}^2$).\na) Tính cường độ âm $I$ tại điểm $M$ cách nguồn đoạn $r = 10\\text{ m}$.\nb) Tính mức cường độ âm $L$ (theo đơn vị $\\text{dB}$) tại điểm $M$.`,
        solution: `a) Cường độ âm tại khoảng cách $r = 10\\text{ m}$:\n$$I = \\frac{P}{4\\pi r^2} = \\frac{0.4\\pi}{4\\pi \\cdot 10^2} = 10^{-3}\\text{ W/m}^2.$$\n\nb) Mức cường độ âm tại $M$:\n$$L = 10\\log\\left(\\frac{I}{I_0}\\right) = 10\\log\\left(\\frac{10^{-3}}{10^{-12}}\\right) = 10\\log(10^9) = 90\\text{ dB}.$$`,
        keyFormulasOrHints: ['I = P / (4 pi r^2)', 'L(dB) = 10 * log(I / I0)']
      },
      {
        number: 'Câu 1',
        points: '2.5 điểm',
        content: `Trên một sợi dây đàn hồi có sóng dừng, khoảng cách giữa $5$ nút sóng liên tiếp đo được là $40\\text{ cm}$. Tần số dao động của dây là $f = 50\\text{ Hz}$.\na) Tính bước sóng $\\lambda$ của sóng trên dây.\nb) Tính tốc độ truyền sóng $v$ trên sợi dây.`,
        solution: `a) Khoảng cách giữa hai nút liên tiếp là $\\frac{\\lambda}{2}$. Giữa $5$ nút liên tiếp có $4$ khoảng nút:\n$$4 \\cdot \\frac{\\lambda}{2} = 40\\text{ cm} \\implies \\lambda = 20\\text{ cm} = 0.2\\text{ m}.$$\n\nb) Tốc độ truyền sóng trên dây:\n$$v = \\lambda f = 0.2 \\cdot 50 = 10\\text{ m/s}.$$`,
        keyFormulasOrHints: ['Khoảng cách n nút liên tiếp = (n - 1) * lambda / 2', 'v = lambda * f']
      }
    ];

    const q2Pool: ExamQuestion[] = [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Đặt điện áp xoay chiều $u = 100\\sqrt{2}\\cos(100\\pi t)\\text{ (V)}$ vào hai đầu đoạn mạch $RLC$ nối tiếp gồm điện trở $R = ${R_val}\\,\\Omega$, cuộn cảm thuần có $Z_L = 80\\,\\Omega$ và tụ điện có $Z_C = 40\\,\\Omega$.\na) Tính tổng trở $Z$ của đoạn mạch và hệ số công suất $\\cos\\varphi$.\nb) Viết biểu thức cường độ dòng điện tức thời $i(t)$ chạy trong mạch và tính công suất tiêu thụ $P$.`,
        solution: `a) Tổng trở của đoạn mạch:\n$$Z = \\sqrt{R^2 + (Z_L - Z_C)^2} = \\sqrt{${R_val}^2 + (80 - 40)^2} = \\sqrt{${R_val * R_val + 1600}} \\approx ${(Math.sqrt(R_val * R_val + 1600)).toFixed(2)}\\,\\Omega.$$\nHệ số công suất:\n$$\\cos\\varphi = \\frac{R}{Z} \\approx ${(R_val / Math.sqrt(R_val * R_val + 1600)).toFixed(3)}.$$\n\nb) Độ lệch pha $\\tan\\varphi = \\frac{Z_L - Z_C}{R} = \\frac{40}{${R_val}} > 0 \\implies \\varphi = \\arctan\\left(\\frac{40}{${R_val}}\\right) \\approx ${(Math.atan(40 / R_val)).toFixed(2)}\\text{ rad}$.\nCường độ hiệu dụng $I = \\frac{U}{Z} = \\frac{100}{${(Math.sqrt(R_val * R_val + 1600)).toFixed(2)}} \\approx ${(100 / Math.sqrt(R_val * R_val + 1600)).toFixed(2)}\\text{ A}$.\nBiểu thức dòng điện: $i = ${(100 * Math.SQRT2 / Math.sqrt(R_val * R_val + 1600)).toFixed(2)}\\cos(100\\pi t - ${(Math.atan(40 / R_val)).toFixed(2)})\\text{ (A)}$.\nCông suất tiêu thụ: $P = I^2 R \\approx ${((100 / Math.sqrt(R_val * R_val + 1600)) ** 2 * R_val).toFixed(1)}\\text{ W}$.`,
        keyFormulasOrHints: ['Z = sqrt(R^2 + (ZL - ZC)^2)', 'cos phi = R / Z, P = U I cos phi']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Một khung dây phẳng diện tích $S = 200\\text{ cm}^2$ gồm $N = 50$ vòng đặt vuông góc với đường sức của một từ trường đều. Trong khoảng thời gian $\\Delta t = 0.05\\text{ s}$, cảm ứng từ tăng đều từ $B_1 = 0.1\\text{ T}$ lên $B_2 = 0.5\\text{ T}$.\na) Tính độ biến thiên từ thông $\\Delta\\Phi$ qua khung dây trong thời gian trên.\nb) Tính độ lớn suất điện động cảm ứng xuất hiện trong khung và dòng điện cảm ứng nếu điện trở khung là $R = 4\\,\\Omega$.`,
        solution: `a) Diện tích $S = 200\\text{ cm}^2 = 0.02\\text{ m}^2$, góc $\\alpha = 0^\\circ$ ($\\cos 0^\\circ = 1$).\nĐộ biến thiên từ thông:\n$$\\Delta\\Phi = N\\cdot\\Delta B\\cdot S\\cdot\\cos 0^\\circ = 50\\cdot (0.5 - 0.1)\\cdot 0.02 = 0.4\\text{ Wb}.$$\n\nb) Độ lớn suất điện động cảm ứng theo định luật Faraday:\n$$|e_c| = \\left|\\frac{\\Delta\\Phi}{\\Delta t}\\right| = \\frac{0.4}{0.05} = 8\\text{ V}.$$\nCường độ dòng điện cảm ứng: $I_c = \\frac{|e_c|}{R} = \\frac{8}{4} = 2\\text{ A}$.`,
        keyFormulasOrHints: ['Phi = N B S cos alpha', '|e_c| = |Delta Phi / Delta t|']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Một đoạn dây dẫn thẳng dài $l = 0.5\\text{ m}$ mang dòng điện cường độ $I = ${I_val}\\text{ A}$ đặt trong từ trường đều có cảm ứng từ $B = 0.2\\text{ T}$ (theo chương trình GDPT 2018).\na) Tính độ lớn lực từ tác dụng lên đoạn dây khi nó đặt vuông góc với đường sức từ.\nb) Nếu quay đoạn dây để nó hợp với véctơ $\\vec{B}$ một góc $\\alpha = 30^\\circ$, độ lớn lực từ khi đó bằng bao nhiêu?`,
        solution: `a) Khi dây dẫn đặt vuông góc với đường sức từ ($\\alpha = 90^\\circ, \\sin 90^\\circ = 1$):\n$$F_{\\max} = BIl = 0.2 \\cdot ${I_val} \\cdot 0.5 = ${(0.1 * I_val).toFixed(2)}\\text{ N}.$$\n\nb) Khi hợp với $\\vec{B}$ góc $\\alpha = 30^\\circ$:\n$$F = BIl\\sin 30^\\circ = ${(0.1 * I_val).toFixed(2)} \\cdot 0.5 = ${(0.05 * I_val).toFixed(3)}\\text{ N}.$$`,
        keyFormulasOrHints: ['Lực từ F = B I l sin alpha', 'Chiều xác định theo quy tắc bàn tay trái']
      },
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: `Cho đoạn mạch xoay chiều $RLC$ nối tiếp có $R$ thay đổi được, cuộn cảm thuần có $Z_L = 100\\,\\Omega$, tụ điện có $Z_C = 60\\,\\Omega$. Đặt điện áp hiệu dụng không đổi $U = 120\\text{ V}$ vào hai đầu mạch.\na) Tìm giá trị của $R$ để công suất tiêu thụ trên toàn mạch đạt cực đại.\nb) Tính công suất cực đại $P_{\\max}$ khi đó.`,
        solution: `a) Công suất tỏa nhiệt $P = \\frac{U^2 R}{R^2 + (Z_L - Z_C)^2} = \\frac{U^2}{R + \\frac{(Z_L - Z_C)^2}{R}}$.\nTheo bất đẳng thức Cô-si (AM-GM), công suất đạt cực đại khi:\n$$R = |Z_L - Z_C| = |100 - 60| = 40\\,\\Omega.$$\n\nb) Giá trị công suất cực đại:\n$$P_{\\max} = \\frac{U^2}{2R} = \\frac{120^2}{2 \\cdot 40} = \\frac{14400}{80} = 180\\text{ W}.$$`,
        keyFormulasOrHints: ['R thay đổi để P max => R = |ZL - ZC|', 'P_max = U^2 / (2R)']
      }
    ];

    const q3Pool: ExamQuestion[] = [
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một khối khí lí tưởng chứa trong xi lanh có áp suất $p_1 = 2\\cdot 10^5\\text{ Pa}$ và thể tích $V_1 = 6\\text{ lít}$ ở nhiệt độ $t_1 = 27^\\circ\\text{C}$.\na) Nén đẳng nhiệt khối khí để thể tích giảm xuống còn $V_2 = 2\\text{ lít}$ (định luật Boyle). Tính áp suất $p_2$.\nb) Tiếp tục giữ nguyên thể tích $V_2 = 2\\text{ lít}$, đun nóng đẳng tích để áp suất tăng gấp đôi áp suất $p_2$ (định luật Charles). Tìm nhiệt độ $t_3$ theo độ C.`,
        solution: `a) Theo định luật Boyle cho quá trình đẳng nhiệt:\n$$p_1 V_1 = p_2 V_2 \\implies p_2 = \\frac{p_1 V_1}{V_2} = \\frac{2\\cdot 10^5 \\cdot 6}{2} = 6\\cdot 10^5\\text{ Pa}.$$\n\nb) Nhiệt độ tuyệt đối $T_2 = T_1 = 27 + 273 = 300\\text{ K}$.\nTheo định luật Charles (đẳng tích) với $p_3 = 2p_2$:\n$$\\frac{p_3}{T_3} = \\frac{p_2}{T_2} \\implies T_3 = 2 T_2 = 600\\text{ K} \\implies t_3 = 600 - 273 = 327^\\circ\\text{C}.$$`,
        keyFormulasOrHints: ['Đẳng nhiệt: p1 V1 = p2 V2', 'Đẳng tích: p1 / T1 = p2 / T2 (T tính bằng K)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Theo mô hình động học phân tử chất khí (GDPT 2018 Vật lí 12), một bình kín dung tích $V = 20\\text{ lít}$ chứa khí lí tưởng ở nhiệt độ $T = 300\\text{ K}$ và áp suất $p = 1.24\\cdot 10^5\\text{ Pa}$. Cho hằng số Boltzmann $k = 1.38\\cdot 10^{-23}\\text{ J/K}$.\na) Tính động năng tịnh tiến trung bình $\\overline{E_đ}$ của mỗi phân tử khí.\nb) Tính mật độ phân tử khí $n$ (số phân tử trong $1\\text{ m}^3$).`,
        solution: `a) Động năng tịnh tiến trung bình của phân tử khí:\n$$\\overline{E_đ} = \\frac{3}{2}kT = 1.5 \\cdot 1.38\\cdot 10^{-23} \\cdot 300 = 6.21\\cdot 10^{-21}\\text{ J}.$$\n\nb) Áp dụng hệ thức áp suất khí $p = \\frac{2}{3}n\\overline{E_đ} = nkT$:\n$$n = \\frac{p}{kT} = \\frac{1.24\\cdot 10^5}{1.38\\cdot 10^{-23} \\cdot 300} \\approx 3.0\\cdot 10^{25}\\text{ phân tử/m}^3.$$`,
        keyFormulasOrHints: ['Động năng tịnh tiến TB: 3/2 k T', 'p = 2/3 n E_d = n k T']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Dùng ấm điện công suất $P = 1500\\text{ W}$ để đun sôi $2\\text{ kg}$ nước từ $25^\\circ\\text{C}$ lên $100^\\circ\\text{C}$. Biết hiệu suất đun của ấm là $H = 80\\%$ và nhiệt dung riêng của nước $c = 4200\\text{ J/(kg}\\cdot\\text{K)}$.\na) Tính nhiệt lượng có ích cần cung cấp để nước đạt $100^\\circ\\text{C}$.\nb) Tính thời gian đun sôi lượng nước trên (theo giây và phút).`,
        solution: `a) Nhiệt lượng có ích làm nước nóng lên $100^\\circ\\text{C}$:\n$$Q_{\\text{ích}} = mc\\Delta t = 2 \\cdot 4200 \\cdot (100 - 25) = 630\\,000\\text{ J} = 630\\text{ kJ}.$$\n\nb) Điện năng ấm tiêu thụ $A = \\frac{Q_{\\text{ích}}}{H} = \\frac{630\\,000}{0.8} = 787\\,500\\text{ J}$.\nThời gian đun:\n$$t = \\frac{A}{P} = \\frac{787\\,500}{1500} = 525\\text{ giây} = 8\\text{ phút } 45\\text{ giây}.$$`,
        keyFormulasOrHints: ['Q_ich = m c Delta t', 'H = Q_ich / (P * t)']
      },
      {
        number: 'Câu 3',
        points: '2.5 điểm',
        content: `Một lượng nước có khối lượng $m = 0.5\\text{ kg}$ đang ở nhiệt độ sôi $100^\\circ\\text{C}$ và áp suất chuẩn. Biết nhiệt hóa hơi riêng của nước ở $100^\\circ\\text{C}$ là $L = 2.26\\cdot 10^6\\text{ J/kg}$.\na) Tính nhiệt lượng cần thiết để hóa hơi hoàn toàn $200\\text{ g}$ nước trong lượng nước trên ở $100^\\circ\\text{C}$.\nb) Giải thích tại sao khi nước đang sôi dù tiếp tục đun thì nhiệt độ nước vẫn giữ nguyên ở $100^\\circ\\text{C}$.`,
        solution: `a) Khối lượng nước hóa hơi $m' = 200\\text{ g} = 0.2\\text{ kg}$. Nhiệt lượng cần cung cấp:\n$$Q = L \\cdot m' = 2.26\\cdot 10^6 \\cdot 0.2 = 4.52\\cdot 10^5\\text{ J} = 452\\text{ kJ}.$$\n\nb) Khi sôi, toàn bộ nhiệt lượng cung cấp không dùng để làm tăng động năng trung bình của phân tử (không tăng nhiệt độ) mà dùng để **phá vỡ lực liên kết** giữa các phân tử ở thể lỏng chuyển sang thể hơi (tăng thế năng tương tác phân tử).`,
        keyFormulasOrHints: ['Nhiệt hóa hơi Q = L * m', 'Chuyển thể đẳng nhiệt làm tăng thế năng nội tại']
      }
    ];

    const q4Pool: ExamQuestion[] = [
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Một mẫu chất phóng xạ Iôt $^{131}_{53}\\text{I}$ có chu kỳ bán rã $T = ${halfLife}\\text{ ngày}$ (giả định cho bài toán mẫu khảo sát), khối lượng ban đầu là $m_0 = 80\\text{ g}$.\na) Tính hằng số phóng xạ $\\lambda$ (theo $\\text{ngày}^{-1}$) và khối lượng chất phóng xạ còn lại sau thời gian $t = ${3 * halfLife}\\text{ ngày}$.\nb) Tính khối lượng chất phóng xạ đã bị phân rã sau thời gian $t = ${3 * halfLife}\\text{ ngày}$.`,
        solution: `a) Hằng số phóng xạ:\n$$\\lambda = \\frac{\\ln 2}{T} = \\frac{0.693}{${halfLife}} \\approx ${(0.693 / halfLife).toFixed(4)}\\text{ ngày}^{-1}.$$\nKhối lượng chất phóng xạ còn lại sau $t = 3T = ${3 * halfLife}\\text{ ngày}$:\n$$m = m_0 \\cdot 2^{-t/T} = 80 \\cdot 2^{-3} = \\frac{80}{8} = 10\\text{ g}.$$\n\nb) Khối lượng chất phóng xạ đã phân rã:\n$$\\Delta m = m_0 - m = 80 - 10 = 70\\text{ g}.$$`,
        keyFormulasOrHints: ['lambda = ln 2 / T', 'm = m0 * 2^(-t/T)']
      },
      {
        number: 'Bài 4',
        points: '2.5 điểm',
        content: `Hoàn thành và phân tích các phương trình phản ứng hạt nhân sau:\na) $^9_4\\text{Be} + ^4_2\\text{He} \\to ^{12}_6\\text{C} + X$ (phản ứng tìm ra neutron của Chadwick).\nb) $^{14}_7\\text{N} + ^1_0\\text{n} \\to ^{14}_6\\text{C} + Y$.\nXác định số khối $A$, số prôtôn $Z$ và gọi tên các hạt $X, Y$.`,
        solution: `Áp dụng định luật bảo toàn số khối (A) và bảo toàn điện tích (Z):\n\na) Với phản ứng a: $9 + 4 = 12 + A_X \\implies A_X = 1$; $4 + 2 = 6 + Z_X \\implies Z_X = 0$.\nVậy $X$ là hạt **nơtron** ($^1_0\\text{n}$).\n\nb) Với phản ứng b: $14 + 1 = 14 + A_Y \\implies A_Y = 1$; $7 + 0 = 6 + Z_Y \\implies Z_Y = 1$.\nVậy $Y$ là hạt **prôtôn** ($^1_1\\text{p}$ hay $^1_1\\text{H}$).`,
        keyFormulasOrHints: ['Bảo toàn số nuclôn A', 'Bảo toàn điện tích Z']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Một mạch dao động điện từ $LC$ lí tưởng gồm cuộn cảm thuần có độ tự cảm $L = \\frac{1}{\\pi}\\text{ mH}$ và tụ điện có điện dung $C = \\frac{4}{\\pi}\\text{ nF}$.\na) Tính chu kỳ riêng $T$ và tần số dao động riêng $f$ của mạch.\nb) Nếu hiệu điện thế cực đại trên tụ là $U_0 = 10\\text{ V}$, tính năng lượng điện từ của mạch và cường độ dòng điện cực đại $I_0$.`,
        solution: `a) Chu kỳ dao động riêng ($L = \\frac{10^{-3}}{\\pi}\\text{ H}$, $C = \\frac{4\\cdot 10^{-9}}{\\pi}\\text{ F}$):\n$$T = 2\\pi\\sqrt{LC} = 2\\pi\\sqrt{\\frac{4\\cdot 10^{-12}}{\\pi^2}} = 4\\cdot 10^{-6}\\text{ s} = 4\\,\\mu\\text{s}.$$\nTần số dao động riêng: $f = \\frac{1}{T} = 2.5\\cdot 10^5\\text{ Hz} = 250\\text{ kHz}$.\n\nb) Năng lượng điện từ: $W = \\frac{1}{2}CU_0^2 = 0.5\\cdot \\frac{4\\cdot 10^{-9}}{\\pi} \\cdot 100 \\approx 6.37\\cdot 10^{-8}\\text{ J}$.\nTừ $\\frac{1}{2}LI_0^2 = \\frac{1}{2}CU_0^2 \\implies I_0 = U_0\\sqrt{\\frac{C}{L}} = 10\\sqrt{4\\cdot 10^{-6}} = 0.02\\text{ A} = 20\\text{ mA}$.`,
        keyFormulasOrHints: ['T = 2pi * sqrt(LC)', '1/2 L I0^2 = 1/2 C U0^2']
      },
      {
        number: 'Câu 4',
        points: '2.5 điểm',
        content: `Kim loại làm catôt của một tế bào quang điện có giới hạn quang điện $\\lambda_0 = 0.5\\,\\mu\\text{m}$. Cho $h = 6.625\\cdot 10^{-34}\\text{ J}\\cdot\\text{s}$, $c = 3\\cdot 10^8\\text{ m/s}$, $e = 1.6\\cdot 10^{-19}\\text{ C}$.\na) Tính công thoát $A$ của kim loại theo đơn vị Jun và electron-vôn (eV).\nb) Chiếu vào catôt bức xạ có bước sóng $\\lambda = 0.3\\,\\mu\\text{m}$. Tính động năng ban đầu cực đại của quang êlectron và hiệu điện thế hãm $U_h$.`,
        solution: `a) Công thoát của kim loại:\n$$A = \\frac{hc}{\\lambda_0} = \\frac{6.625\\cdot 10^{-34}\\cdot 3\\cdot 10^8}{0.5\\cdot 10^{-6}} = 3.975\\cdot 10^{-19}\\text{ J} \\approx 2.48\\text{ eV}.$$\n\nb) Năng lượng phôtôn kích thích ($\\lambda = 0.3\\,\\mu\\text{m}$):\n$$\\varepsilon = \\frac{hc}{\\lambda} = 6.625\\cdot 10^{-19}\\text{ J} \\approx 4.14\\text{ eV}.$$\nĐộng năng cực đại: $W_{\\text{đmax}} = \\varepsilon - A = 2.65\\cdot 10^{-19}\\text{ J} \\approx 1.66\\text{ eV}$.\nHiệu điện thế hãm: $|e|U_h = W_{\\text{đmax}} \\implies U_h \\approx 1.66\\text{ V}$.`,
        keyFormulasOrHints: ['A = hc / lambda0', '|e| U_h = W_dmax = epsilon - A']
      }
    ];

    const q1 = q1Pool[i % q1Pool.length];
    const q2 = q2Pool[(i + 1) % q2Pool.length];
    const q3 = q3Pool[(i + 2) % q3Pool.length];
    const q4 = q4Pool[(i + 3) % q4Pool.length];

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
      topics: ['# Con lắc & Sóng âm', '# RLC & Lực từ 12', '# Động học phân tử', '# Phóng xạ & Quang điện'],
      difficulty: i % 3 === 0 ? 'Nâng cao' : i % 2 === 0 ? 'Khá' : 'Cơ bản',
      questions: [q1, q2, q3, q4]
    });
  }

  return exams;
}
