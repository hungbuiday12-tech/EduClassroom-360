import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS: Record<string, LectureStep[]> = {
  'phys-9-mech-heat': [
    {
      stepTitle: '1. Đặt vấn đề: Tại sao vận tốc trung bình KHÔNG phải trung bình cộng?',
      stepType: 'intuition',
      teacherExplanation:
        'Giả sử một xe đi nửa quãng đường đầu với tốc độ $40\\text{ km/h}$ và nửa quãng đường sau với $60\\text{ km/h}$. Rất nhiều học sinh vội lấy $(40 + 60)/2 = 50\\text{ km/h}$ — nhưng kết quả đó SAI!\n\nBởi vì khi đi với tốc độ chậm ($40\\text{ km/h}$), xe phải mất **nhiều thời gian hơn** ở chặng đầu so với chặng sau ($60\\text{ km/h}$). Theo định nghĩa bản chất, vận tốc trung bình phải lấy **Tổng quãng đường chia Tổng thời gian**:',
      formulaHighlight: 'v_{tb} = \\frac{s_1 + s_2 + \\dots}{t_1 + t_2 + \\dots}',
      keyTakeaway:
        'Chỉ khi thời gian đi hai chặng bằng nhau ($t_1 = t_2$) thì $v_{tb}$ mới bằng trung bình cộng $(v_1 + v_2)/2$; còn nếu hai chặng đường bằng nhau ($s_1 = s_2$), $v_{tb} = \\frac{2v_1v_2}{v_1+v_2}$.'
    },
    {
      stepTitle: '2. Công cơ học, Công suất & Cơ năng bảo toàn',
      stepType: 'concept',
      teacherExplanation:
        '• **Công cơ học ($A$)**: Lực $\\vec{F}$ chỉ sinh công khi làm vật dịch chuyển theo phương không vuông góc với lực: $A = F \\cdot s$ (khi $\\vec{F}$ cùng hướng chuyển động), đơn vị Jun ($\\text{J}$).\n• **Công suất ($P$)**: Đo tốc độ thực hiện công trong 1 giây: $P = \\frac{A}{t} = F \\cdot v$. Một động cơ khỏe hơn nghĩa là thực hiện cùng một công trong thời gian ngắn hơn.\n• **Chuyển hóa Động năng – Thế năng**: Khi thả vật rơi từ độ cao $h$, thế năng trọng trường $W_t = mgh$ giảm dần và chuyển hóa toàn bộ thành động năng $W_đ = \\frac{1}{2}mv^2$ (nếu bỏ qua lực cản không khí).',
      formulaHighlight: 'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}',
      keyTakeaway:
        'Đổi chuẩn đơn vị hệ SI trước khi tính: $m$ (kg), $h$ (m), $v$ (m/s), $t$ (s), $P$ (W).'
    },
    {
      stepTitle: '3. Nhiệt lượng & Phương trình cân bằng nhiệt',
      stepType: 'derivation',
      teacherExplanation:
        'Khi hai vật có nhiệt độ khác nhau tiếp xúc, nhiệt năng tự truyền từ vật nóng hơn sang vật lạnh hơn cho tới khi đạt cùng nhiệt độ cân bằng $t$.\n• Nhiệt lượng vật thu vào hoặc tỏa ra tỉ lệ thuận với khối lượng $m$, nhiệt dung riêng $c$ và độ biến thiên nhiệt độ $\\Delta t = |t_{\\text{sau}} - t_{\\text{đầu}}|$:\n  $Q = m \\cdot c \\cdot \\Delta t$.\n• Khi bỏ qua trao đổi nhiệt với môi trường ngoài: Tổng nhiệt lượng tỏa ra bằng tổng nhiệt lượng thu vào ($Q_{\\text{tỏa}} = Q_{\\text{thu}}$).',
      formulaHighlight: '\\sum Q_{\\text{tỏa}} = \\sum Q_{\\text{thu}} \\iff m_1 c_1 (t_1 - t) = m_2 c_2 (t - t_2)',
      keyTakeaway:
        'Luôn viết dấu dương cho $\\Delta t$: vật nóng dùng $(t_{\\text{cao}} - t)$, vật lạnh dùng $(t - t_{\\text{thấp}})$.'
    },
    {
      stepTitle: '4. Hướng dẫn kiểm chứng trên Thí nghiệm 2D Rơi tự do & Cột Năng lượng',
      stepType: 'experiment',
      teacherExplanation:
        'Hãy mở sang tab **2. Thí Nghiệm 2D** để trực tiếp quan sát sự bảo toàn cơ năng:\n1. Nhập thử giá trị độ cao $h = 30\\text{ m}$ và khối lượng $m = 5\\text{ kg}$ vào ô nhập số trực tiếp.\n2. Bật nút **Biểu đồ Năng lượng** & **Đồng hồ bấm giây** để đo thời gian chạm đất thực tế.\n3. Thử bấm chuyển sang **Mặt Trăng ($g = 1.62$)** hoặc bật **Lực cản không khí** để thấy phần cơ năng bị hao phí thành nhiệt!',
      keyTakeaway:
        'Quan sát tổng chiều cao cột $W_đ + W_t$ luôn giữ nguyên khi tắt ma sát chính là minh chứng trực quan của Định luật Bảo toàn Cơ năng.'
    }
  ],

  'phys-9-elec': [
    {
      stepTitle: '1. Bản chất dòng điện & Định luật Ôm I = U / R',
      stepType: 'intuition',
      teacherExplanation:
        'Hãy hình dung hiệu điện thế $U$ như "áp lực đẩy" của máy bơm (nguồn điện), cường độ dòng điện $I$ là "lưu lượng dòng hạt mang điện" chạy qua dây, còn điện trở $R$ là "độ cản trở" của đường ống.\n• Khi tăng hiệu điện thế $U$ (bơm mạnh hơn) thì dòng điện $I$ tăng tỉ lệ thuận.\n• Khi điện trở $R$ càng lớn (ống càng hẹp/cản mạnh) thì dòng điện $I$ giảm tỉ lệ nghịch.',
      formulaHighlight: 'I = \\frac{U}{R} \\quad \\text{(Định luật Ôm)}',
      keyTakeaway:
        'Điện trở $R$ của một dây dẫn chỉ phụ thuộc vào bản chất vật liệu ($\\rho$), chiều dài ($l$) và tiết diện ($S$): $R = \\rho\\frac{l}{S}$, KHÔNG phụ thuộc vào $U$ hay $I$.'
    },
    {
      stepTitle: '2. Phân biệt Mạch Nối Tiếp và Mạch Song Song',
      stepType: 'derivation',
      teacherExplanation:
        '• **Mạch Nối Tiếp** (chỉ có 1 con đường duy nhất cho electron đi qua): Dòng điện chạy qua mọi linh kiện đều bằng nhau ($I = I_1 = I_2$), còn hiệu điện thế bị chia ra ($U = U_1 + U_2$). Do cản trở cộng dồn: $R_{tđ} = R_1 + R_2$ (lớn hơn từng điện trở thành phần).\n• **Mạch Song Song** (dòng điện rẽ làm nhiều nhánh độc lập): Các nhánh dùng chung 2 điểm nối nên hiệu điện thế bằng nhau ($U = U_1 = U_2$), dòng mạch chính bằng tổng các nhánh ($I = I_1 + I_2$). Mở thêm nhánh mới làm dòng dễ đi hơn nên $R_{tđ}$ GIẢM đi: $\\frac{1}{R_{tđ}} = \\frac{1}{R_1} + \\frac{1}{R_2}$.',
      formulaHighlight: 'R_{nt} = R_1 + R_2, \\qquad R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
      keyTakeaway:
        'Trong mạng điện gia đình, các thiết bị (đèn, quạt, tivi) luôn được mắc **song song** để có cùng $220\\text{ V}$ và bật tắt độc lập.'
    },
    {
      stepTitle: '3. Công suất điện, Định luật Jun – Len-xơ & Thí nghiệm Mạch Điện',
      stepType: 'experiment',
      teacherExplanation:
        'Khi dòng điện chạy qua điện trở $R$, năng lượng điện chuyển hóa thành nhiệt năng tỏa ra theo định luật Jun – Len-xơ: $Q = I^2 R t = \\frac{U^2}{R} t = U I t$.\n\n**Thử ngay trong Thí Nghiệm 2D**:\n1. Bấm nút **Công tắc K (Đóng/Ngắt)** để quan sát mạch hở ($I = 0$) và mạch kín.\n2. Bấm nút **Đảo cực nguồn (+/-)** để quan sát chiều dịch chuyển electron.\n3. Nhập số trực tiếp $U = 24\\text{ V}$, $R_1 = 6\\,\\Omega$, $R_2 = 12\\,\\Omega$ rồi bấm chuyển đổi **Nối tiếp ↔ Song song** và **Ghi mẫu đo** vào bảng thí nghiệm để đối chiếu $R_{tđ}, I, P$!',
      formulaHighlight: 'P = U I = I^2 R = \\frac{U^2}{R}, \\qquad Q = I^2 R t',
      keyTakeaway:
        'Khi mắc song song vào cùng nguồn $U$ không đổi, công suất mạch song song lớn hơn mạch nối tiếp vì $R_{ss} < R_{nt}$ và $P = U^2/R$.'
    }
  ],

  'phys-10-proj': [
    {
      stepTitle: '1. Nguyên lý độc lập của chuyển động: Biến chuyển động cong 2D thành 2 chuyển động 1D đơn giản',
      stepType: 'intuition',
      teacherExplanation:
        'Chuyển động ném xiên hay ném ngang nhìn theo quỹ đạo Parabol có vẻ phức tạp, nhưng Galileo đã phát hiện một bí mật tuyệt đẹp: **Chuyển động theo phương ngang $Ox$ và phương thẳng đứng $Oy$ hoàn toàn độc lập với nhau!**\n• Trên trục ngang $Ox$: Không có lực kéo hay cản (khi bỏ qua không khí) $\\implies a_x = 0 \\implies$ vật chuyển động **thẳng đều** với $v_x = v_0 \\cos\\alpha = \\text{hằng số}$.\n• Trên trục thẳng đứng $Oy$: Chỉ chịu trọng lực hướng xuống $\\implies a_y = -g \\implies$ vật chuyển động **biến đổi đều** với $v_y = v_0 \\sin\\alpha - gt$.',
      formulaHighlight: 'x(t) = (v_0 \\cos\\alpha)\\,t, \\qquad y(t) = h_0 + (v_0 \\sin\\alpha)\\,t - \\frac{1}{2}gt^2',
      keyTakeaway:
        'Tại điểm cao nhất $H_{max}$, thành phần đứng $v_y = 0$, NHƯNG vận tốc toàn phần KHÁC KHÔNG mà bằng đúng $v_x = v_0\\cos\\alpha$!'
    },
    {
      stepTitle: '2. Công thức Độ cao cực đại & Tầm xa khi ném từ mặt đất (h₀ = 0)',
      stepType: 'derivation',
      teacherExplanation:
        '1. **Thời gian lên đỉnh cao nhất**: Khi chạm đỉnh $v_y = 0 \\implies t_{\\text{lên}} = \\frac{v_0\\sin\\alpha}{g}$. Do tính đối xứng, tổng thời gian bay là $t_{\\text{bay}} = 2 t_{\\text{lên}} = \\frac{2v_0\\sin\\alpha}{g}$.\n2. **Độ cao cực đại**: Thay $t_{\\text{lên}}$ vào $y(t)$ được $H_{max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}$.\n3. **Tầm xa $L$**: $L = v_x \\cdot t_{\\text{bay}} = \\frac{v_0^2 \\sin(2\\alpha)}{g}$. Vì $\\sin(2\\alpha) \\le 1$, tầm xa cực đại đạt được khi $\\sin(2\\alpha) = 1 \\iff \\alpha = 45^\\circ$ (nếu ném từ mặt đất).',
      formulaHighlight: 'H_{max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\qquad L = \\frac{v_0^2 \\sin(2\\alpha)}{g}',
      keyTakeaway:
        'Hai góc ném phụ nhau ($\\alpha_1 + \\alpha_2 = 90^\\circ$, ví dụ $30^\\circ$ và $60^\\circ$) với cùng tốc độ $v_0$ từ mặt đất sẽ cho **cùng một tầm xa $L$**!'
    },
    {
      stepTitle: '3. Thực hành PhET-style trên Thí nghiệm Ném xiên 2D & Bệ pháo 3D',
      stepType: 'experiment',
      teacherExplanation:
        'Trong tab **2. Thí Nghiệm 2D**, em hãy tự kiểm chứng các quy luật trên bằng cách:\n• Nhập góc $\\alpha = 30^\\circ$, nhấn **Bắn lại** và **Ghi mẫu đo**, sau đó nhập $\\alpha = 60^\\circ$ và $45^\\circ$ để so sánh trực tiếp tầm xa $L$ trong bảng số liệu.\n• Bật nút **Véc-tơ vận tốc** và **Dấu vết quỹ đạo (Trace)**.\n• Bật thử **Lực cản không khí** để xem góc cho tầm xa lớn nhất khi có sức cản thực tế hơi nhỏ hơn $45^\\circ$!',
      keyTakeaway:
        'Khi ném ngang ($\\alpha = 0^\\circ$) từ độ cao $h_0$, thời gian rơi $t = \\sqrt{2h_0/g}$ chỉ phụ thuộc vào độ cao $h_0$, không phụ thuộc vận tốc ném $v_0$!'
    }
  ],

  'phys-11-shm': [
    {
      stepTitle: '1. Dao động điều hòa & Ý nghĩa các đại lượng trong x = A cos(ωt + φ)',
      stepType: 'concept',
      teacherExplanation:
        'Dao động điều hòa là chuyển động lặp đi lặp lại quanh vị trí cân bằng $O$ mà li độ được mô tả bằng hàm $\\cos$ hoặc $\\sin$ theo thời gian:\n• **Biên độ $A > 0$**: Độ lệch lớn nhất khỏi VTCB (quỹ đạo dài $L = 2A$).\n• **Tần số góc $\\omega$ (rad/s)**, **Chu kỳ $T = \\frac{2\\pi}{\\omega}$** (thời gian 1 dao động toàn phần), **Tần số $f = \\frac{1}{T}$** (số dao động trong 1 giây).\n• **Pha ban đầu $\\varphi$**: Cho biết vị trí và chiều chuyển động ngay tại thời điểm $t = 0$.',
      formulaHighlight: 'x = A\\cos(\\omega t + \\varphi), \\quad v = x\' = -\\omega A\\sin(\\omega t + \\varphi), \\quad a = -\\omega^2 x',
      keyTakeaway:
        'Vận tốc $v$ sớm pha $\\frac{\\pi}{2}$ so với li độ $x$; Gia tốc $a$ luôn ngược pha ($\\pi$) với $x$ và luôn hướng về Vị trí cân bằng!'
    },
    {
      stepTitle: '2. Công thức Độc lập thời gian & Con lắc lò xo / Con lắc đơn',
      stepType: 'derivation',
      teacherExplanation:
        'Từ $\\cos^2(\\omega t + \\varphi) + \\sin^2(\\omega t + \\varphi) = 1$, ta khử được thời gian $t$ để tìm hệ thức vàng liên hệ tức thời giữa $(x, v)$:\n• $\\frac{x^2}{A^2} + \\frac{v^2}{(\\omega A)^2} = 1 \\implies A^2 = x^2 + \\frac{v^2}{\\omega^2}$.\n• **Con lắc lò xo**: $\\omega = \\sqrt{\\frac{k}{m}} \\implies T = 2\\pi\\sqrt{\\frac{m}{k}}$ (tăng khối lượng 4 lần thì $T$ tăng 2 lần).\n• **Con lắc đơn (góc nhỏ)**: $\\omega = \\sqrt{\\frac{g}{l}} \\implies T = 2\\pi\\sqrt{\\frac{l}{g}}$ (KHÔNG phụ thuộc khối lượng quả nặng $m$!).',
      formulaHighlight: 'A^2 = x^2 + \\frac{v^2}{\\omega^2}, \\qquad T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}',
      keyTakeaway:
        'Cơ năng $W = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2$ tỉ lệ với **bình phương biên độ** $A^2$.'
    },
    {
      stepTitle: '3. Thực hành với Đồng hồ Bấm giây trên Lab Con lắc 2D',
      stepType: 'experiment',
      teacherExplanation:
        'Trong tab **2. Thí Nghiệm 2D**, em hãy thử thí nghiệm chuẩn phòng Lab PhET:\n1. Chỉnh khối lượng $m = 0{,}5\\text{ kg}$, độ cứng $k = 50\\text{ N/m}$ (bằng cách nhập số trực tiếp).\n2. Dùng **Đồng hồ bấm giây tích hợp**, nhấn **Bắt đầu** khi vật qua biên phải và **Dừng** sau đúng 5 chu kỳ, chia cho 5 để kiểm chứng công thức lý thuyết $T = 2\\pi\\sqrt{m/k} \\approx 0{,}63\\text{ s}$!\n3. Bật **Đồ thị thời gian thực** & **Chế độ Tắt dần (Damping)** để quan sát biên độ giảm dần theo hàm mũ.',
      keyTakeaway:
        'Trong dao động điều hòa, động năng và thế năng biến thiên tuần hoàn với tần số $2f$ (chu kỳ $T/2$), còn tổng của chúng $W = W_đ + W_t$ luôn không đổi.'
    }
  ]
};
