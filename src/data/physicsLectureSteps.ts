import { LectureStep } from '../types';

export const PHYSICS_CUSTOM_LECTURE_STEPS: Record<string, LectureStep[]> = {
  'phys-9-mech-heat': [
    {
      stepTitle: '1. Vận tốc trung bình & Tư duy chia chặng',
      stepType: 'intuition',
      conceptSection:
        'Vận tốc trung bình ($v_{tb}$) trên một hành trình đặc trưng cho mức độ nhanh chậm tính trên **toàn bộ quãng đường** và **toàn bộ thời gian** đi hết quãng đường đó. Điểm cốt lõi nhất là $v_{tb}$ là thương số của tổng quãng đường chia tổng thời gian, hoàn toàn **không phải** trung bình cộng đại số các vận tốc thành phần (trừ trường hợp đặc biệt thời gian đi các chặng bằng nhau).',
      formulaSection: {
        primaryFormula: 'v_{tb} = \\frac{s_1 + s_2 + \\dots + s_n}{t_1 + t_2 + \\dots + t_n} = \\frac{\\sum s}{\\sum t}',
        secondaryFormulas: [
          '\\text{Nếu } s_1 = s_2 = \\frac{S}{2} \\implies v_{tb} = \\frac{2 v_1 v_2}{v_1 + v_2}',
          '\\text{Nếu } t_1 = t_2 = \\frac{t}{2} \\implies v_{tb} = \\frac{v_1 + v_2}{2}'
        ],
        variablesNote:
          '• $s_i$: quãng đường chặng thứ $i$ (đơn vị chuẩn $\\text{m}$ hoặc $\\text{km}$).\n• $t_i = \\frac{s_i}{v_i}$: thời gian thực tế đi hết chặng $i$ (đơn vị $\\text{s}$ hoặc $\\text{h}$).\n• Lưu ý đổi đồng nhất đơn vị: $1\\text{ m/s} = 3{,}6\\text{ km/h}$.'
      },
      deepDiveSection:
        'Tại sao khi xe đi nửa quãng đường đầu với $40\\text{ km/h}$ và nửa sau với $60\\text{ km/h}$ thì vận tốc trung bình lại là $48\\text{ km/h}$ chứ không phải $50\\text{ km/h}$?\n\nBởi vì cùng một độ dài $S/2$, khi chạy chậm ($40\\text{ km/h}$) xe tốn **nhiều thời gian hơn** so với lúc chạy nhanh ($60\\text{ km/h}$). Do đó tốc độ chậm chiếm "trọng số thời gian" lớn hơn, kéo vận tốc trung bình xuống dưới mức trung bình cộng ($48 < 50$). Bất đẳng thức Cô-si cũng chứng minh rằng trung bình điều hòa $\\frac{2v_1v_2}{v_1+v_2}$ luôn nhỏ hơn $\\frac{v_1+v_2}{2}$ khi $v_1 \\ne v_2$.',
      teacherExplanation:
        'Giả sử một xe đi nửa quãng đường đầu với tốc độ $40\\text{ km/h}$ và nửa quãng đường sau với $60\\text{ km/h}$. Rất nhiều học sinh vội lấy $(40 + 60)/2 = 50\\text{ km/h}$ — nhưng kết quả đó SAI vì thời gian ở hai chặng khác nhau.',
      formulaHighlight: 'v_{tb} = \\frac{s_1 + s_2 + \\dots}{t_1 + t_2 + \\dots}',
      keyTakeaway:
        'Luôn đặt ẩn $S$ (hoặc $t$) để tính tường minh từng thời gian $t_i = s_i/v_i$ rồi mới lấy $\\sum s / \\sum t$; tuyệt đối không cộng vội $v_1 + v_2$ chia đôi.',
      miniQuiz: [
        {
          id: 'p9mh-s1-q1',
          question:
            'Một người đi xe đạp trên nửa quãng đường đầu với tốc độ $12\\text{ km/h}$ và nửa quãng đường sau với tốc độ $20\\text{ km/h}$. Tốc độ trung bình trên cả quãng đường là:',
          options: ['A. $16\\text{ km/h}$', 'B. $15\\text{ km/h}$', 'C. $14{,}5\\text{ km/h}$', 'D. $17\\text{ km/h}$'],
          correctIndex: 1,
          explanation:
            'Vì đi hai nửa quãng đường bằng nhau nên $v_{tb} = \\frac{2 v_1 v_2}{v_1 + v_2} = \\frac{2 \\cdot 12 \\cdot 20}{12 + 20} = \\frac{480}{32} = 15\\text{ km/h}$.'
        },
        {
          id: 'p9mh-s1-q2',
          question:
            'Trong trường hợp nào sau đây, tốc độ trung bình của vật chuyển động trên hai chặng ĐÚNG BẰNG trung bình cộng $\\frac{v_1 + v_2}{2}$?',
          options: [
            'A. Khi độ dài hai chặng đường bằng nhau ($s_1 = s_2$)',
            'B. Khi thời gian đi hai chặng bằng nhau ($t_1 = t_2$)',
            'C. Khi $v_1 > v_2$ bất kỳ',
            'D. Luôn đúng với mọi chuyển động thẳng'
          ],
          correctIndex: 1,
          explanation:
            'Khi $t_1 = t_2 = t_0$, tổng quãng đường là $v_1 t_0 + v_2 t_0 = (v_1 + v_2)t_0$, chia cho tổng thời gian $2t_0$ sẽ ra đúng $\\frac{v_1 + v_2}{2}$.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s1-e1',
        question:
          'Một ca nô đi trong $2\\text{ giờ}$ đầu với tốc độ $30\\text{ km/h}$ và $1\\text{ giờ}$ sau với tốc độ $45\\text{ km/h}$. Hãy tính tốc độ trung bình của ca nô trên cả hành trình và giải thích ngắn gọn vì sao không thể lấy $(30+45)/2$.',
        hint: 'Tính $s_1 = v_1 t_1$, $s_2 = v_2 t_2$, rồi lấy tổng $s_1 + s_2$ chia cho tổng $t_1 + t_2$.',
        rubricChecklist: [
          'Tính đúng quãng đường từng chặng: $s_1 = 60\\text{ km}$, $s_2 = 45\\text{ km}$.',
          'Áp dụng đúng công thức $v_{tb} = \\frac{60 + 45}{2 + 1} = 35\\text{ km/h}$.',
          'Giải thích được do thời gian hai chặng khác nhau ($2\\text{ h} \\ne 1\\text{ h}$) nên không lấy trung bình cộng.'
        ],
        sampleAnswer:
          'Quãng đường chặng 1: $s_1 = 30 \\cdot 2 = 60\\text{ km}$. Quãng đường chặng 2: $s_2 = 45 \\cdot 1 = 45\\text{ km}$.\nTổng quãng đường $S = 60 + 45 = 105\\text{ km}$, tổng thời gian $t = 2 + 1 = 3\\text{ h}$.\nTốc độ trung bình: $v_{tb} = \\frac{105}{3} = 35\\text{ km/h}$. Không lấy $(30+45)/2 = 37{,}5\\text{ km/h}$ vì thời gian đi ở mỗi tốc độ khác nhau ($2\\text{ h}$ và $1\\text{ h}$).'
      }
    },
    {
      stepTitle: '2. Công cơ học, Công suất & Bảo toàn Cơ năng',
      stepType: 'concept',
      conceptSection:
        '• **Công cơ học ($A$)**: Đo phần năng lượng được truyền cho vật nhờ tác dụng của lực $\\vec{F}$ làm vật dịch chuyển theo phương không vuông góc với lực.\n• **Công suất ($\\mathcal{P}$)**: Đại lượng đặc trưng cho tốc độ thực hiện công nhanh hay chậm (công sinh ra trong $1\\text{ giây}$).\n• **Cơ năng ($W$)**: Tổng động năng ($W_đ$, năng lượng do chuyển động) và thế năng trọng trường ($W_t$, năng lượng do độ cao). Trong hệ kín không ma sát, tổng này luôn giữ nguyên.',
      formulaSection: {
        primaryFormula: 'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}',
        secondaryFormulas: [
          'A = F \\cdot s \\quad (\\text{khi } \\vec{F} \\text{ cùng hướng dịch chuyển})',
          'P = \\frac{A}{t} = F \\cdot v'
        ],
        variablesNote:
          '• $m$ (kg): khối lượng; $v$ (m/s): tốc độ; $h$ (m): độ cao so với mốc thế năng.\n• $g \\approx 9{,}8\\text{ m/s}^2$ (hoặc $10\\text{ m/s}^2$).\n• $A, W$ đo bằng Jun ($\\text{J}$); công suất $P$ đo bằng Oát ($\\text{W}$, $1\\text{ kW} = 1000\\text{ W}$).'
      },
      deepDiveSection:
        'Khi một lực tác dụng vuông góc với phương chuyển động (như trọng lực khi xe chạy trên đường nằm ngang), công của lực đó bằng $0$ vì không làm thay đổi tốc độ theo phương ngang.\n\nKhi thả rơi vật không ma sát từ độ cao $h_0$: tại đỉnh $v = 0 \\implies W = W_{t,\\max} = mgh_0$; khi rơi xuống, $h$ giảm làm $W_t$ chuyển hóa dần thành $W_đ = \\frac{1}{2}mv^2$; ngay trước khi chạm đất ($h = 0$), toàn bộ thế năng biến thành động năng cực đại $\\frac{1}{2}mv_{\\max}^2 = mgh_0 \\implies v_{\\max} = \\sqrt{2gh_0}$ (không phụ thuộc khối lượng $m$!).',
      teacherExplanation:
        'Công cơ học, công suất và định luật bảo toàn cơ năng liên kết chặt chẽ thành một chuỗi: lực sinh công làm biến đổi động năng, và trong trọng trường lý tưởng thì độ giảm thế năng bằng đúng độ tăng động năng.',
      formulaHighlight: 'W = W_đ + W_t = \\frac{1}{2}mv^2 + mgh = \\text{hằng số}',
      keyTakeaway:
        'Đổi chuẩn đơn vị hệ SI trước khi tính: $m$ (kg), $h$ (m), $v$ (m/s), $t$ (s), $P$ (W). Tốc độ chạm đất khi rơi tự do $v = \\sqrt{2gh}$ độc lập với khối lượng.',
      miniQuiz: [
        {
          id: 'p9mh-s2-q1',
          question:
            'Một cần cẩu nâng thùng hàng $500\\text{ kg}$ lên cao $12\\text{ m}$ đều đặn trong $20\\text{ s}$ ($g = 10\\text{ m/s}^2$). Công suất của cần cẩu là:',
          options: ['A. $3\\,000\\text{ W}$', 'B. $60\\,000\\text{ W}$', 'C. $300\\text{ W}$', 'D. $1\\,500\\text{ W}$'],
          correctIndex: 0,
          explanation:
            'Trọng lượng $P = 10m = 5000\\text{ N}$. Công nâng $A = P \\cdot h = 5000 \\cdot 12 = 60\\,000\\text{ J}$. Công suất $\\mathcal{P} = \\frac{A}{t} = \\frac{60\\,000}{20} = 3\\,000\\text{ W}$.'
        },
        {
          id: 'p9mh-s2-q2',
          question:
            'Một vật $m = 2\\text{ kg}$ rơi tự do từ độ cao $h_0 = 5\\text{ m}$ ($g = 10\\text{ m/s}^2$). Khi vật ở độ cao $2\\text{ m}$, động năng của vật bằng:',
          options: ['A. $40\\text{ J}$', 'B. $60\\text{ J}$', 'C. $100\\text{ J}$', 'D. $20\\text{ J}$'],
          correctIndex: 1,
          explanation:
            'Cơ năng $W = mgh_0 = 2 \\cdot 10 \\cdot 5 = 100\\text{ J}$. Tại $h = 2\\text{ m}$, $W_t = 2 \\cdot 10 \\cdot 2 = 40\\text{ J} \\implies W_đ = W - W_t = 60\\text{ J}$.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s2-e1',
        question:
          'Thả một quả bóng khối lượng $0{,}5\\text{ kg}$ rơi tự do từ độ cao $20\\text{ m}$ (lấy $g = 10\\text{ m/s}^2$, bỏ qua cản không khí). Tính cơ năng ban đầu và tìm độ cao nơi động năng bằng 3 lần thế năng.',
        hint: 'Đặt $W_đ = 3 W_t$ rồi thay vào $W = W_đ + W_t = 4 W_t = mgh_0$.',
        rubricChecklist: [
          'Tính đúng cơ năng ban đầu $W = mgh_0 = 0{,}5 \\cdot 10 \\cdot 20 = 100\\text{ J}$.',
          'Thiết lập được phương trình $W_đ + W_t = 4 W_t = W$.',
          'Suy ra $h = \\frac{h_0}{4} = 5\\text{ m}$.'
        ],
        sampleAnswer:
          'Chọn mốc thế năng tại mặt đất. Cơ năng ban đầu của bóng: $W = mgh_0 = 0{,}5 \\cdot 10 \\cdot 20 = 100\\text{ J}$.\nTại vị trí $W_đ = 3W_t$, theo bảo toàn cơ năng: $W = W_đ + W_t = 4W_t = 4mgh$.\nSuy ra $4mgh = mgh_0 \\implies h = \\frac{h_0}{4} = \\frac{20}{4} = 5\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Nhiệt lượng & Phương trình Cân bằng nhiệt',
      stepType: 'derivation',
      conceptSection:
        'Nhiệt năng truyền tự phát từ vật có nhiệt độ cao sang vật có nhiệt độ thấp cho đến khi nhiệt độ hai vật bằng nhau (trạng thái **cân bằng nhiệt**). Nhiệt lượng là phần nhiệt năng vật nhận thêm hoặc mất đi trong quá trình truyền nhiệt đó.',
      formulaSection: {
        primaryFormula: '\\sum Q_{\\text{tỏa}} = \\sum Q_{\\text{thu}} \\iff m_1 c_1 (t_1 - t) = m_2 c_2 (t - t_2)',
        secondaryFormulas: [
          'Q = m \\cdot c \\cdot \\Delta t',
          'Q_{\\text{nhiên liệu}} = q \\cdot m'
        ],
        variablesNote:
          '• $c$: nhiệt dung riêng ($\\text{J/(kg}\\cdot\\text{K)}$), cho biết nhiệt lượng cần để $1\\text{ kg}$ chất đó tăng thêm $1^\\circ\\text{C}$ (nước có $c = 4200\\text{ J/(kg}\\cdot\\text{K)}$).\n• $t_1 > t > t_2$: luôn đặt $\\Delta t > 0$ cho cả hai vế ($t_1 - t$ với vật tỏa nhiệt; $t - t_2$ với vật thu nhiệt).'
      },
      deepDiveSection:
        'Sai lầm kinh điển khi viết phương trình cân bằng nhiệt là viết nhầm dấu $(t - t_1)$ cho vật nóng khiến phương trình ra kết quả vô lý hoặc nhiệt độ cân bằng vượt ra ngoài khoảng $[t_{\\text{thấp}}, t_{\\text{cao}}]$.\n\nNgoài ra, nếu có $H\\%$ hiệu suất truyền nhiệt (ví dụ bếp đun chỉ truyền $80\\%$ nhiệt lượng cho nước, $20\\%$ thất thoát ra môi trường), ta phải viết: $Q_{\\text{có ích}} = H \\cdot Q_{\\text{tỏa}}$, tức $m_{\\text{nước}} c_{\\text{nước}} \\Delta t = 0{,}8 \\cdot Q_{\\text{bếp}}$.',
      teacherExplanation:
        'Khi hai vật có nhiệt độ khác nhau tiếp xúc, nhiệt năng truyền từ vật nóng sang vật lạnh cho tới khi cùng đạt nhiệt độ cân bằng $t$. Trong hệ cô lập, tổng nhiệt lượng tỏa ra bằng tổng nhiệt lượng thu vào.',
      formulaHighlight: '\\sum Q_{\\text{tỏa}} = \\sum Q_{\\text{thu}} \\iff m_1 c_1 (t_1 - t) = m_2 c_2 (t - t_2)',
      workedExample: {
        problem:
          'Thả $0{,}5\\text{ kg}$ nhôm ở $100^\\circ\\text{C}$ ($c_1 = 880\\text{ J/(kg}\\cdot\\text{K)}$) vào $2\\text{ kg}$ nước ở $20^\\circ\\text{C}$ ($c_2 = 4200\\text{ J/(kg}\\cdot\\text{K)}$). Tìm nhiệt độ cân bằng $t$.',
        steps: [
          'Bước 1: Nhiệt lượng nhôm tỏa ra khi hạ từ $100^\\circ\\text{C}$ xuống $t$: $Q_{\\text{tỏa}} = 0{,}5 \\cdot 880 \\cdot (100 - t) = 440(100 - t)$.',
          'Bước 2: Nhiệt lượng nước thu vào khi tăng từ $20^\\circ\\text{C}$ lên $t$: $Q_{\\text{thu}} = 2 \\cdot 4200 \\cdot (t - 20) = 8400(t - 20)$.',
          'Bước 3: Cho $Q_{\\text{tỏa}} = Q_{\\text{thu}} \\implies 44000 - 440t = 8400t - 168000 \\implies 8840t = 212000$.'
        ],
        answer: '$t \\approx 23{,}98^\\circ\\text{C} \\approx 24^\\circ\\text{C}$.'
      },
      keyTakeaway:
        'Luôn kiểm tra điều kiện hợp lý sau khi giải: nhiệt độ cân bằng $t$ bắt buộc phải nằm giữa $t_{\\text{lạnh}}$ và $t_{\\text{nóng}}$.',
      miniQuiz: [
        {
          id: 'p9mh-s3-q1',
          question:
            'Cần cung cấp nhiệt lượng bao nhiêu để đun nóng $2\\text{ kg}$ nước từ $25^\\circ\\text{C}$ lên $100^\\circ\\text{C}$ ($c = 4200\\text{ J/(kg}\\cdot\\text{K)}$)?',
          options: ['A. $630\\text{ kJ}$', 'B. $840\\text{ kJ}$', 'C. $210\\text{ kJ}$', 'D. $420\\text{ kJ}$'],
          correctIndex: 0,
          explanation:
            '$\\Delta t = 100 - 25 = 75^\\circ\\text{C}$. Nhiệt lượng: $Q = 2 \\cdot 4200 \\cdot 75 = 630\\,000\\text{ J} = 630\\text{ kJ}$.'
        },
        {
          id: 'p9mh-s3-q2',
          question:
            'Vì sao nhiệt độ cân bằng khi thả miếng đồng $100^\\circ\\text{C}$ ($c_{\\text{đồng}} = 380$) vào lượng nước cùng khối lượng ở $20^\\circ\\text{C}$ ($c_{\\text{nước}} = 4200$) lại gần $20^\\circ\\text{C}$ hơn rất nhiều so với $100^\\circ\\text{C}$?',
          options: [
            'A. Vì đồng dẫn nhiệt kém hơn nước',
            'B. Vì nhiệt dung riêng của nước lớn hơn đồng hơn 11 lần nên cùng nhiệt lượng nước chỉ tăng nhiệt độ rất ít',
            'C. Vì nước bốc hơi ngay ở $20^\\circ\\text{C}$',
            'D. Vì đồng nặng hơn nên chìm xuống đáy'
          ],
          correctIndex: 1,
          explanation:
            'Từ $m c_1 (100 - t) = m c_2 (t - 20)$, vì $c_2 = 4200 \\gg c_1 = 380$ nên độ tăng nhiệt $(t - 20)$ của nước nhỏ hơn nhiều lần độ giảm nhiệt $(100 - t)$ của đồng.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s3-e1',
        question:
          'Trộn $1\\text{ kg}$ nước ở $80^\\circ\\text{C}$ với $3\\text{ kg}$ nước ở $20^\\circ\\text{C}$ (bỏ qua trao đổi nhiệt với bình và môi trường). Tính nhiệt độ cân bằng của hỗn hợp.',
        hint: 'Hai chất đều là nước nên nhiệt dung riêng $c$ giống nhau và triệt tiêu ở hai vế.',
        rubricChecklist: [
          'Viết đúng phương trình cân bằng nhiệt $m_1 c (80 - t) = m_2 c (t - 20)$.',
          'Triệt tiêu $c$ và thế số $1(80 - t) = 3(t - 20)$.',
          'Giải đúng $4t = 140 \\implies t = 35^\\circ\\text{C}$.'
        ],
        sampleAnswer:
          'Áp dụng phương trình cân bằng nhiệt: $Q_{\\text{tỏa}} = Q_{\\text{thu}} \\iff m_1 c (80 - t) = m_2 c (t - 20)$.\nRút gọn $c$ ở hai vế: $1 \\cdot (80 - t) = 3 \\cdot (t - 20) \\iff 80 - t = 3t - 60 \\iff 4t = 140 \\implies t = 35^\\circ\\text{C}$.'
      }
    },
    {
      stepTitle: '4. Thực hành Kiểm chứng Rơi tự do & Bảo toàn Năng lượng 2D',
      stepType: 'experiment',
      conceptSection:
        'Trong vật lí học thực nghiệm, mỗi công thức lý thuyết cần được đối chiếu bằng cách đo đạc trực tiếp khi thay đổi **từng biến kiểm soát một** (như độ cao $h$, khối lượng $m$, gia tốc trọng trường $g$ hoặc lực cản không khí).',
      formulaSection: {
        primaryFormula: 't_{\\text{rơi}} = \\sqrt{\\frac{2h}{g}}, \\qquad v_{\\text{chạm đất}} = \\sqrt{2gh}',
        secondaryFormulas: ['W_{\\text{mất mát}} = |W_{\\text{sau}} - W_{\\text{đầu}}| \\ge 0 \\text{ (khi có lực cản)}'],
        variablesNote:
          '• $t_{\\text{rơi}}$: thời gian từ lúc thả không vận tốc đầu đến lúc chạm đất ($\\text{s}$).\n• Quan sát biểu đồ cột $W_đ$ và $W_t$ trong Lab 2D để thấy tổng $W$ không đổi khi tắt ma sát.'
      },
      deepDiveSection:
        'Trên Trái Đất ($g \\approx 9{,}8\\text{ m/s}^2$), nếu bật lực cản không khí, một phần cơ năng chuyển hóa thành nhiệt làm nóng không khí và vật nên chiều cao nảy lại hoặc động năng cuối luôn nhỏ hơn cơ năng ban đầu. Khi chuyển sang Mặt Trăng ($g \\approx 1{,}62\\text{ m/s}^2$), gia tốc giảm 6 lần khiến thời gian rơi tăng $\\sqrt{6} \\approx 2{,}45$ lần.',
      teacherExplanation:
        'Hãy mở sang tab 2. Thí Nghiệm 2D để tự tay nhập số liệu, dùng đồng hồ bấm giây và ghi lại ít nhất 3 mẫu đo vào bảng so sánh.',
      keyTakeaway:
        'Phương pháp biến kiểm soát: muốn khảo sát ảnh hưởng của $h$ lên $v$, chỉ thay đổi $h$ và giữ nguyên $m, g$.',
      miniQuiz: [
        {
          id: 'p9mh-s4-q1',
          question:
            'Nếu thả rơi tự do một vật từ độ cao tăng gấp 4 lần (giữ nguyên $g$, không lực cản), thời gian rơi sẽ thay đổi thế nào?',
          options: ['A. Tăng 4 lần', 'B. Tăng 2 lần', 'C. Giảm 2 lần', 'D. Không đổi'],
          correctIndex: 1,
          explanation:
            'Từ $t = \\sqrt{\\frac{2h}{g}}$, khi $h$ tăng 4 lần thì $\\sqrt{h}$ tăng $\\sqrt{4} = 2$ lần.'
        },
        {
          id: 'p9mh-s4-q2',
          question:
            'Khi thí nghiệm với cùng độ cao $h = 20\\text{ m}$ không ma sát, nếu tăng khối lượng quả cầu từ $1\\text{ kg}$ lên $5\\text{ kg}$ thì đại lượng nào KHÔNG thay đổi?',
          options: [
            'A. Thế năng ban đầu $W_t$',
            'B. Động năng ngay trước khi chạm đất $W_đ$',
            'C. Vận tốc chạm đất $v$ và thời gian rơi $t$',
            'D. Trọng lực $P$ tác dụng lên quả cầu'
          ],
          correctIndex: 2,
          explanation:
            '$W_t, W_đ, P$ đều tỉ lệ thuận với khối lượng $m$, riêng $v = \\sqrt{2gh}$ và $t = \\sqrt{2h/g}$ hoàn toàn độc lập với $m$.'
        }
      ],
      miniEssay: {
        id: 'p9mh-s4-e1',
        question:
          'Nếu em thực hiện thí nghiệm thả rơi hai vật nặng nhẹ khác nhau trong buồng chân không và ngoài không khí thường, hiện tượng quan sát được ở cột năng lượng và thời gian rơi khác nhau như thế nào?',
        hint: 'So sánh vai trò của lực cản không khí với tổng cơ năng $W_đ + W_t$.',
        rubricChecklist: [
          'Trong chân không: hai vật rơi như nhau, tổng $W_đ + W_t$ bảo toàn không đổi.',
          'Ngoài không khí: có lực cản làm một phần cơ năng chuyển thành nhiệt ($W$ giảm dần), vật nhẹ/diện tích cản lớn rơi chậm hơn.'
        ],
        sampleAnswer:
          'Trong chân không (không lực cản), cả hai vật đều rơi với cùng gia tốc $g$, chạm đất cùng lúc ($t = \\sqrt{2h/g}$) và tổng cột $W_đ + W_t$ giữ nguyên không đổi. Khi có không khí, lực cản sinh công âm khiến tổng cơ năng $W_đ + W_t$ giảm dần (chuyển thành nhiệt) và làm vật rơi chậm hơn.'
      }
    }
  ],

  'phys-9-elec': [
    {
      stepTitle: '1. Bản chất dòng điện & Định luật Ôm I = U / R',
      stepType: 'intuition',
      conceptSection:
        'Hiệu điện thế $U$ đóng vai trò như "áp lực đẩy" của nguồn điện tạo ra dòng chuyển dời có hướng của các hạt mang điện, cường độ dòng điện $I$ đo "lưu lượng điện tích" đi qua tiết diện dây trong $1\\text{ giây}$, còn điện trở $R$ biểu thị mức độ cản trở dòng điện của vật dẫn.',
      formulaSection: {
        primaryFormula: 'I = \\frac{U}{R} \\qquad \\Longleftrightarrow \\qquad U = I \\cdot R',
        secondaryFormulas: ['R = \\rho \\frac{l}{S}'],
        variablesNote:
          '• $I$: cường độ dòng điện (Ampe, $\\text{A}$).\n• $U$: hiệu điện thế (Vôn, $\\text{V}$).\n• $R$: điện trở (Ôm, $\\Omega$); $R$ chỉ phụ thuộc vật liệu ($\\rho$), chiều dài ($l$), tiết diện ($S$), KHÔNG phụ thuộc vào $U$ hay $I$.'
      },
      deepDiveSection:
        'Một lỗi hiểu nhầm rất phổ biến là nhìn công thức $R = U/I$ rồi kết luận "khi tăng $U$ gấp đôi thì $R$ tăng gấp đôi". Điều đó SAI! Đối với một dây dẫn kim loại ở nhiệt độ không đổi, $R$ là hằng số đặc trưng của dây; khi tăng $U$ gấp đôi thì $I$ cũng tăng gấp đôi sao cho tỉ số $U/I = R$ không đổi.',
      teacherExplanation:
        'Định luật Ôm khẳng định cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.',
      formulaHighlight: 'I = \\frac{U}{R}',
      keyTakeaway:
        'Điện trở $R$ là thuộc tính nội tại của dây dẫn ($R = \\rho l/S$); thay đổi $U$ làm thay đổi $I$ chứ không làm thay đổi $R$ của điện trở tuyến tính.',
      miniQuiz: [
        {
          id: 'p9el-s1-q1',
          question:
            'Đặt hiệu điện thế $U = 12\\text{ V}$ vào hai đầu một điện trở $R = 4\\,\\Omega$. Nếu tăng hiệu điện thế lên $24\\text{ V}$ thì cường độ dòng điện và điện trở $R$ lúc này lần lượt là:',
          options: [
            'A. $I = 6\\text{ A};\\; R = 4\\,\\Omega$',
            'B. $I = 3\\text{ A};\\; R = 8\\,\\Omega$',
            'C. $I = 6\\text{ A};\\; R = 8\\,\\Omega$',
            'D. $I = 1{,}5\\text{ A};\\; R = 4\\,\\Omega$'
          ],
          correctIndex: 0,
          explanation:
            'Điện trở không đổi vẫn là $R = 4\\,\\Omega$. Khi $U = 24\\text{ V}$, cường độ dòng điện là $I = U/R = 24/4 = 6\\text{ A}$.'
        },
        {
          id: 'p9el-s1-q2',
          question:
            'Nếu cắt đôi một dây dẫn đồng chất tiết diện đều thành hai đoạn bằng nhau rồi chỉ dùng một nửa đoạn dây đó, điện trở của đoạn nửa dây sẽ:',
          options: ['A. Tăng gấp đôi', 'B. Giảm đi một nửa', 'C. Không thay đổi', 'D. Giảm đi 4 lần'],
          correctIndex: 1,
          explanation:
            'Theo $R = \\rho\\frac{l}{S}$, khi chiều dài $l$ giảm một nửa (giữ nguyên $\\rho$ và $S$) thì điện trở $R$ giảm đi một nửa.'
        }
      ],
      miniEssay: {
        id: 'p9el-s1-e1',
        question:
          'Giải thích ngắn gọn vì sao từ công thức $R = U/I$, người ta không nói "điện trở tỉ lệ thuận với hiệu điện thế $U$" và cho biết điện trở dây dẫn phụ thuộc vào những yếu tố nào.',
        hint: 'Nêu rõ khi $U$ tăng thì $I$ tăng tỉ lệ thuận theo, còn $R$ chỉ phụ thuộc cấu tạo dây dẫn.',
        rubricChecklist: [
          'Giải thích được khi $U$ thay đổi, $I$ thay đổi tỉ lệ thuận nên tỉ số $U/I$ không đổi.',
          'Nêu đúng công thức/yếu tố quyết định $R = \\rho l/S$: vật liệu ($\\rho$), chiều dài ($l$), tiết diện ($S$).'
        ],
        sampleAnswer:
          'Với một vật dẫn xác định ở nhiệt độ không đổi, khi tăng $U$ lên $k$ lần thì $I$ cũng tăng $k$ lần nên tỉ số $R = U/I$ không đổi. Điện trở $R$ chỉ phụ thuộc vào bản chất vật liệu (điện trở suất $\\rho$), chiều dài dây ($l$) và tiết diện dây ($S$) theo hệ thức $R = \\rho\\frac{l}{S}$.'
      }
    },
    {
      stepTitle: '2. Mạch Nối Tiếp vs Mạch Song Song',
      stepType: 'derivation',
      conceptSection:
        '• **Mạch nối tiếp**: Các điện trở mắc liên tiếp nhau tạo thành **một đường đi duy nhất** cho dòng điện, nên dòng qua mọi phần tử bằng nhau.\n• **Mạch song song**: Hai đầu các điện trở chập chung vào hai nút mạch, tạo nhiều **nhánh rẽ song song** có cùng hiệu điện thế.',
      formulaSection: {
        primaryFormula: 'R_{nt} = R_1 + R_2, \\qquad R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
        secondaryFormulas: [
          '\\text{Nối tiếp: } I = I_1 = I_2, \\quad U = U_1 + U_2',
          '\\text{Song song: } U = U_1 = U_2, \\quad I = I_1 + I_2'
        ],
        variablesNote:
          '• Nối tiếp: $R_{nt} > \\max(R_1, R_2)$ (tăng cản trở).\n• Song song: $R_{ss} < \\min(R_1, R_2)$ (mở thêm đường đi cho dòng điện nên tổng trở giảm xuống nhỏ hơn từng nhánh).'
      },
      deepDiveSection:
        'Trong mạng điện dân dụng $220\\text{ V}$, tất cả đèn, quạt, tủ lạnh đều mắc **song song** để: (1) mỗi thiết bị nhận đúng hiệu điện thế định mức $220\\text{ V}$, và (2) tắt hoặc hỏng một thiết bị không làm ngắt dòng qua các thiết bị còn lại. Ngược lại, cầu chì hoặc aptomat phải mắc **nối tiếp** ở đầu mạch chính để khi quá dòng sẽ ngắt toàn bộ mạch.',
      teacherExplanation:
        'Phân biệt nối tiếp và song song dựa trên 2 quy tắc vàng: nối tiếp giữ nguyên dòng $I$ (chia áp $U$), song song giữ nguyên áp $U$ (chia dòng $I$).',
      formulaHighlight: 'R_{nt} = R_1 + R_2, \\qquad R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}',
      keyTakeaway:
        'Mắc thêm nhánh song song làm điện trở tương đương GIẢM và dòng mạch chính TĂNG.',
      miniQuiz: [
        {
          id: 'p9el-s2-q1',
          question:
            'Hai điện trở $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ mắc song song vào nguồn $U = 12\\text{ V}$. Cường độ dòng điện mạch chính bằng:',
          options: ['A. $0{,}67\\text{ A}$', 'B. $3\\text{ A}$', 'C. $2\\text{ A}$', 'D. $1\\text{ A}$'],
          correctIndex: 1,
          explanation:
            '$R_{ss} = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega \\implies I = \\frac{12}{4} = 3\\text{ A}$ (hoặc $I_1 = 2\\text{ A}, I_2 = 1\\text{ A} \\implies I = 3\\text{ A}$).'
        },
        {
          id: 'p9el-s2-q2',
          question:
            'Hai điện trở $R_1 = 4\\,\\Omega$ và $R_2 = 8\\,\\Omega$ mắc nối tiếp. Hiệu điện thế $U_2$ trên $R_2$ so với $U_1$ trên $R_1$ như thế nào?',
          options: ['A. $U_2 = U_1$', 'B. $U_2 = 2 U_1$', 'C. $U_2 = 0{,}5 U_1$', 'D. $U_2 = 4 U_1$'],
          correctIndex: 1,
          explanation:
            'Mạch nối tiếp có cùng $I$ nên $U = I \\cdot R$ tỉ lệ thuận với $R$. Vì $R_2 = 2R_1$ nên $U_2 = 2U_1$.'
        }
      ],
      miniEssay: {
        id: 'p9el-s2-e1',
        question:
          'Cho $R_1 = 6\\,\\Omega$ và $R_2 = 12\\,\\Omega$ cùng nguồn $U = 24\\text{ V}$. Hãy tính $R_{tđ}$ và cường độ dòng điện mạch chính trong cả hai cách mắc nối tiếp và song song, rồi rút ra nhận xét.',
        hint: 'Tính $R_{nt} = R_1 + R_2$ và $R_{ss} = \\frac{R_1 R_2}{R_1 + R_2}$, sau đó dùng $I = U / R_{tđ}$.',
        rubricChecklist: [
          'Nối tiếp: $R_{nt} = 18\\,\\Omega$, $I_{nt} = \\frac{24}{18} \\approx 1{,}33\\text{ A}$.',
          'Song song: $R_{ss} = 4\\,\\Omega$, $I_{ss} = \\frac{24}{4} = 6\\text{ A}$.',
          'Nhận xét: Cùng nguồn $U$, mạch song song có $R_{tđ}$ nhỏ hơn nên dòng mạch chính lớn hơn.'
        ],
        sampleAnswer:
          '• Mắc nối tiếp: $R_{nt} = 6 + 12 = 18\\,\\Omega \\implies I_{nt} = \\frac{24}{18} \\approx 1{,}33\\text{ A}$.\n• Mắc song song: $R_{ss} = \\frac{6 \\cdot 12}{6 + 12} = 4\\,\\Omega \\implies I_{ss} = \\frac{24}{4} = 6\\text{ A}$.\nNhận xét: Mạch song song có điện trở tương đương nhỏ hơn hẳn nên dòng điện mạch chính lớn hơn nhiều ($6\\text{ A} > 1{,}33\\text{ A}$).'
      }
    },
    {
      stepTitle: '3. Công suất điện & Định luật Jun – Len-xơ',
      stepType: 'experiment',
      conceptSection:
        'Khi dòng điện chạy qua đoạn mạch, điện năng tiêu thụ chuyển hóa thành các dạng năng lượng khác (nhiệt năng, cơ năng, quang năng). Với đoạn mạch chỉ có điện trở thuần, toàn bộ điện năng biến thành nhiệt tỏa ra (Định luật Jun – Len-xơ).',
      formulaSection: {
        primaryFormula: 'P = U I = I^2 R = \\frac{U^2}{R}, \\qquad Q = I^2 R t = U I t',
        secondaryFormulas: ['A_{\\text{điện}} = P \\cdot t = U I t \\quad (1\\text{ kWh} = 3{,}6 \\cdot 10^6\\text{ J})'],
        variablesNote:
          '• $P$: công suất điện ($\\text{W}$); $Q$: nhiệt lượng tỏa ra ($\\text{J}$); $t$: thời gian dòng điện chạy qua ($\\text{s}$).\n• Dùng $P = I^2 R$ khi so sánh mạch **nối tiếp** (cùng $I$); dùng $P = U^2/R$ khi so sánh mạch **song song** (cùng $U$).'
      },
      deepDiveSection:
        'Lưu ý mẹo chọn công thức công suất siêu nhanh:\n• Khi hai bóng đèn mắc **nối tiếp** (cùng $I$), bóng nào có $R$ lớn hơn thì tỏa công suất $P = I^2 R$ lớn hơn.\n• Khi mắc **song song** vào cùng nguồn $U$, mạch song song có $R_{ss} < R_{nt}$ nên theo $P = U^2/R$, công suất tiêu thụ của mạch song song luôn lớn hơn mạch nối tiếp.',
      teacherExplanation:
        'Mở tab 2. Thí Nghiệm 2D để bật/tắt công tắc K, đảo cực nguồn và ghi mẫu đo đối chiếu công suất giữa mạch nối tiếp và song song.',
      formulaHighlight: 'P = U I = I^2 R = \\frac{U^2}{R}, \\qquad Q = I^2 R t',
      keyTakeaway:
        'Cùng nguồn $U$ không đổi: $P_{ss} > P_{nt}$ vì $R_{ss} < R_{nt}$ và $P = U^2/R$.',
      miniQuiz: [
        {
          id: 'p9el-s3-q1',
          question:
            'Một bếp điện có điện trở $R = 40\\,\\Omega$ hoạt động với dòng điện $I = 2{,}5\\text{ A}$ trong $10\\text{ phút}$. Nhiệt lượng bếp tỏa ra là:',
          options: ['A. $150\\text{ kJ}$', 'B. $250\\text{ kJ}$', 'C. $15\\text{ kJ}$', 'D. $60\\text{ kJ}$'],
          correctIndex: 0,
          explanation:
            '$t = 10 \\cdot 60 = 600\\text{ s}$. $Q = I^2 R t = (2{,}5)^2 \\cdot 40 \\cdot 600 = 6{,}25 \\cdot 40 \\cdot 600 = 150\\,000\\text{ J} = 150\\text{ kJ}$.'
        },
        {
          id: 'p9el-s3-q2',
          question:
            'Hai điện trở $R_1 = 10\\,\\Omega$ và $R_2 = 20\\,\\Omega$ mắc nối tiếp với nhau. Tỉ số nhiệt lượng tỏa ra $Q_1 / Q_2$ trong cùng một khoảng thời gian bằng:',
          options: ['A. $2$', 'B. $0{,}5$', 'C. $4$', 'D. $1$'],
          correctIndex: 1,
          explanation:
            'Mắc nối tiếp nên cùng $I$ và cùng $t$. Theo $Q = I^2 R t$, nhiệt lượng tỉ lệ thuận với $R$: $\\frac{Q_1}{Q_2} = \\frac{R_1}{R_2} = \\frac{10}{20} = 0{,}5$.'
        }
      ],
      miniEssay: {
        id: 'p9el-s3-e1',
        question:
          'Một bóng đèn ghi $220\\text{ V} - 100\\text{ W}$ được thắp sáng liên tục trong $5\\text{ giờ}$ ở hiệu điện thế đúng $220\\text{ V}$. Tính điện trở của bóng đèn khi sáng bình thường và số tiền điện phải trả (biết $1\\text{ kWh}$ giá $2\\,500\\text{ đồng}$).',
        hint: 'Dùng $R = U^2_{\\text{đm}} / P_{\\text{đm}}$ và đổi $100\\text{ W} = 0{,}1\\text{ kW}$.',
        rubricChecklist: [
          'Tính đúng $R = \\frac{220^2}{100} = 484\\,\\Omega$.',
          'Tính đúng điện năng $A = P \\cdot t = 0{,}1 \\cdot 5 = 0{,}5\\text{ kWh}$.',
          'Tính đúng chi phí $0{,}5 \\cdot 2500 = 1\\,250\\text{ đồng}$.'
        ],
        sampleAnswer:
          '• Điện trở bóng đèn: $R = \\frac{U^2}{P} = \\frac{220^2}{100} = 484\\,\\Omega$.\n• Điện năng tiêu thụ trong $5\\text{ giờ}$: $A = P \\cdot t = 0{,}1\\text{ kW} \\cdot 5\\text{ h} = 0{,}5\\text{ kWh}$.\n• Tiền điện: $0{,}5 \\times 2\\,500 = 1\\,250\\text{ đồng}$.'
      }
    }
  ],

  'phys-10-proj': [
    {
      stepTitle: '1. Nguyên lý độc lập chuyển động & Phương trình quỹ đạo Parabol',
      stepType: 'intuition',
      conceptSection:
        'Theo nguyên lý độc lập của chuyển động (Galileo), chuyển động cong 2D của vật bị ném trong trọng trường là sự **tổng hợp đồng thời của 2 chuyển động thẳng độc lập**: thẳng đều theo phương ngang $Ox$ (vì không có lực theo phương ngang) và thẳng biến đổi đều theo phương thẳng đứng $Oy$ (chịu gia tốc trọng trường $g$ hướng xuống).',
      formulaSection: {
        primaryFormula: 'x(t) = (v_0 \\cos\\alpha)\\,t, \\qquad y(t) = h_0 + (v_0 \\sin\\alpha)\\,t - \\frac{1}{2}gt^2',
        secondaryFormulas: [
          'v_x = v_0 \\cos\\alpha = \\text{const}, \\qquad v_y(t) = v_0 \\sin\\alpha - gt',
          'v(t) = \\sqrt{v_x^2 + v_y^2}'
        ],
        variablesNote:
          '• $v_0$ (m/s): tốc độ ném ban đầu; $\\alpha$: góc ném hợp với phương ngang ($\\alpha = 0^\\circ$ là ném ngang).\n• $h_0$ (m): độ cao ban đầu; $g$ (m/s²): gia tốc trọng trường.'
      },
      deepDiveSection:
        'Bẫy tư duy số 1: Tại đỉnh cao nhất của quỹ đạo Parabol, vật có vận tốc bằng $0$? **SAI!** Tại đỉnh cao nhất, chỉ có thành phần thẳng đứng $v_y = 0$ (vật ngừng đi lên để bắt đầu đi xuống), còn thành phần nằm ngang $v_x = v_0\\cos\\alpha$ vẫn giữ nguyên không đổi. Vì vậy tốc độ tại đỉnh bằng $v_0\\cos\\alpha > 0$ (nếu $\\alpha < 90^\\circ$).',
      teacherExplanation:
        'Khử thời gian $t = \\frac{x}{v_0\\cos\\alpha}$ thay vào $y(t)$ cho ta phương trình quỹ đạo dạng bậc hai $y(x)$ — chứng minh quỹ đạo ném là đường Parabol.',
      formulaHighlight: 'x(t) = (v_0 \\cos\\alpha)\\,t, \\qquad y(t) = h_0 + (v_0 \\sin\\alpha)\\,t - \\frac{1}{2}gt^2',
      keyTakeaway:
        'Tại đỉnh cao nhất $H_{max}$, $v_y = 0$ nhưng tốc độ toàn phần bằng $v_x = v_0\\cos\\alpha \\ne 0$.',
      miniQuiz: [
        {
          id: 'p10p-s1-q1',
          question:
            'Một vật được ném xiên từ mặt đất với tốc độ $v_0 = 20\\text{ m/s}$ dưới góc $\\alpha = 60^\\circ$ (bỏ qua sức cản). Tốc độ của vật tại điểm cao nhất của quỹ đạo là:',
          options: ['A. $0\\text{ m/s}$', 'B. $10\\text{ m/s}$', 'C. $10\\sqrt{3}\\text{ m/s}$', 'D. $20\\text{ m/s}$'],
          correctIndex: 1,
          explanation:
            'Tại điểm cao nhất $v_y = 0$, tốc độ vật bằng đúng $v_x = v_0\\cos 60^\\circ = 20 \\cdot 0{,}5 = 10\\text{ m/s}$.'
        },
        {
          id: 'p10p-s1-q2',
          question:
            'Ném ngang một vật từ độ cao $h_0 = 45\\text{ m}$ ($g = 10\\text{ m/s}^2$) với tốc độ $v_0 = 20\\text{ m/s}$. Thời gian vật rơi đến khi chạm đất là:',
          options: ['A. $2{,}25\\text{ s}$', 'B. $3\\text{ s}$', 'C. $4{,}5\\text{ s}$', 'D. $9\\text{ s}$'],
          correctIndex: 1,
          explanation:
            'Khi ném ngang ($\\alpha = 0^\\circ$), chuyển động đứng là rơi tự do: $t = \\sqrt{\\frac{2h_0}{g}} = \\sqrt{\\frac{90}{10}} = 3\\text{ s}$ (không phụ thuộc $v_0$).'
        }
      ],
      miniEssay: {
        id: 'p10p-s1-e1',
        question:
          'Từ phương trình $x(t) = (v_0\\cos\\alpha)t$ và $y(t) = (v_0\\sin\\alpha)t - \\frac{1}{2}gt^2$ (với $h_0 = 0$), hãy khử $t$ để thiết lập phương trình quỹ đạo $y(x)$ và giải thích tại sao quỹ đạo là đường Parabol.',
        hint: 'Rút $t = \\frac{x}{v_0\\cos\\alpha}$ rồi thay vào $y(t)$.',
        rubricChecklist: [
          'Rút đúng $t = \\frac{x}{v_0\\cos\\alpha}$.',
          'Thế vào được $y = (\\tan\\alpha)x - \\frac{g}{2v_0^2\\cos^2\\alpha}x^2$.',
          'Nhận xét đây là hàm bậc hai theo $x$ với hệ số $x^2$ âm nên quỹ đạo là Parabol bề lõm quay xuống.'
        ],
        sampleAnswer:
          'Từ $x = (v_0\\cos\\alpha)t \\implies t = \\frac{x}{v_0\\cos\\alpha}$.\nThay vào $y(t)$: $y = (v_0\\sin\\alpha)\\frac{x}{v_0\\cos\\alpha} - \\frac{1}{2}g\\left(\\frac{x}{v_0\\cos\\alpha}\\right)^2 = (\\tan\\alpha)x - \\frac{g}{2v_0^2\\cos^2\\alpha}x^2$.\nVì đây là hàm bậc hai dạng $y = ax^2 + bx$ với $a < 0$, quỹ đạo là đường Parabol hướng bề lõm xuống dưới.'
      }
    },
    {
      stepTitle: '2. Độ cao cực đại H_max & Tầm xa L (h₀ = 0)',
      stepType: 'derivation',
      conceptSection:
        'Khi ném xiên từ mặt đất ($h_0 = 0$), quỹ đạo Parabol đối xứng hoàn toàn qua trục đi qua đỉnh: thời gian đi lên bằng thời gian đi xuống, và điểm chạm đất có độ cao bằng $0$ cho phép tìm nhanh tầm bay xa $L$.',
      formulaSection: {
        primaryFormula: 'H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\qquad L = \\frac{v_0^2 \\sin(2\\alpha)}{g}',
        secondaryFormulas: [
          't_{\\text{lên}} = \\frac{v_0\\sin\\alpha}{g}, \\qquad t_{\\text{bay}} = \\frac{2v_0\\sin\\alpha}{g}'
        ],
        variablesNote:
          '• Công thức $L = \\frac{v_0^2\\sin(2\\alpha)}{g}$ CHỈ ĐÚNG khi điểm ném và điểm chạm đất cùng độ cao ($h_0 = 0$) và bỏ qua lực cản không khí.\n• Nếu $h_0 > 0$ (ném từ vách cao), góc tầm xa cực đại sẽ nhỏ hơn $45^\\circ$.'
      },
      deepDiveSection:
        'Tính đối xứng lượng giác tuyệt đẹp của tầm xa: vì $\\sin(2(90^\\circ - \\alpha)) = \\sin(180^\\circ - 2\\alpha) = \\sin(2\\alpha)$, nên hai góc phụ nhau (như $30^\\circ$ và $60^\\circ$) cho **cùng một tầm xa $L$**, trong đó góc $60^\\circ$ bay cao hơn và ở trên không lâu hơn, còn góc $45^\\circ$ cho $\\sin(90^\\circ) = 1 \\implies L_{\\max} = \\frac{v_0^2}{g}$.',
      teacherExplanation:
        'Từ điều kiện đỉnh $v_y = 0$ suy ra $t_{\\text{lên}}$, nhân đôi được tổng thời gian bay, rồi nhân $v_x$ để ra công thức tầm xa $L$.',
      formulaHighlight: 'H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g}, \\qquad L = \\frac{v_0^2 \\sin(2\\alpha)}{g}',
      keyTakeaway:
        'Hai góc phụ nhau $\\alpha_1 + \\alpha_2 = 90^\\circ$ cho cùng tầm xa $L$; tầm xa lớn nhất tại $\\alpha = 45^\\circ$ (khi $h_0 = 0$).',
      miniQuiz: [
        {
          id: 'p10p-s2-q1',
          question:
            'Ném một vật từ mặt đất với $v_0 = 20\\text{ m/s}$ ($g = 10\\text{ m/s}^2$). Tầm bay xa cực đại có thể đạt được là:',
          options: ['A. $20\\text{ m}$', 'B. $40\\text{ m}$', 'C. $80\\text{ m}$', 'D. $40\\sqrt{2}\\text{ m}$'],
          correctIndex: 1,
          explanation:
            '$L_{\\max} = \\frac{v_0^2}{g} = \\frac{20^2}{10} = 40\\text{ m}$ (đạt được tại góc $\\alpha = 45^\\circ$).'
        },
        {
          id: 'p10p-s2-q2',
          question:
            'Với cùng tốc độ ném $v_0$ từ mặt đất (không sức cản), góc ném $\\alpha_1 = 25^\\circ$ sẽ cho cùng tầm xa với góc ném nào sau đây?',
          options: ['A. $50^\\circ$', 'B. $65^\\circ$', 'C. $45^\\circ$', 'D. $75^\\circ$'],
          correctIndex: 1,
          explanation:
            'Hai góc phụ nhau $\\alpha_1 + \\alpha_2 = 90^\\circ$ cho cùng $\\sin(2\\alpha)$, nên $\\alpha_2 = 90^\\circ - 25^\\circ = 65^\\circ$.'
        }
      ],
      miniEssay: {
        id: 'p10p-s2-e1',
        question:
          'Một vận động viên đẩy tạ từ độ cao ban đầu $h_0 = 0$ (giả sử sát mặt đất) với tốc độ $v_0 = 14\\text{ m/s}$, góc $\\alpha = 30^\\circ$, $g = 9{,}8\\text{ m/s}^2$. Tính độ cao cực đại $H_{\\max}$ và tầm xa $L$.',
        hint: 'Dùng $\\sin 30^\\circ = 0{,}5$ và $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}$.',
        rubricChecklist: [
          'Tính đúng $H_{\\max} = \\frac{14^2 \\cdot 0{,}5^2}{2 \\cdot 9{,}8} = 2{,}5\\text{ m}$.',
          'Tính đúng $L = \\frac{14^2 \\cdot \\sin 60^\\circ}{9{,}8} = 10\\sqrt{3} \\approx 17{,}32\\text{ m}$.'
        ],
        sampleAnswer:
          '• Độ cao cực đại: $H_{\\max} = \\frac{v_0^2 \\sin^2\\alpha}{2g} = \\frac{196 \\cdot 0{,}25}{19{,}6} = 2{,}5\\text{ m}$.\n• Tầm xa: $L = \\frac{v_0^2 \\sin(2\\alpha)}{g} = \\frac{196 \\cdot \\sin 60^\\circ}{9{,}8} = 20 \\cdot \\frac{\\sqrt{3}}{2} = 10\\sqrt{3} \\approx 17{,}32\\text{ m}$.'
      }
    },
    {
      stepTitle: '3. Thực hành Bệ phóng 2D & Mô hình 3D (Ảnh hưởng lực cản)',
      stepType: 'experiment',
      conceptSection:
        'Trong thực tế có lực cản không khí phụ thuộc vận tốc, quỹ đạo không còn là Parabol đối xứng hoàn hảo mà nhánh đi xuống dốc hơn nhánh đi lên, đồng thời cả $H_{\\max}$ và tầm xa $L$ đều giảm đi.',
      formulaSection: {
        primaryFormula: 'L_{\\text{thực tế}} < L_{\\text{lý tưởng}}, \\qquad \\alpha_{\\text{tối ưu (có cản)}} < 45^\\circ',
        variablesNote:
          '• Trong Lab 2D: thử bắn ở $\\alpha = 30^\\circ, 45^\\circ, 60^\\circ$ rồi bấm **Ghi mẫu đo** để lập bảng đối chiếu.\n• Bật **Lực cản không khí** để thấy góc tầm xa lớn nhất dịch chuyển về khoảng $38^\\circ - 42^\\circ$.'
      },
      deepDiveSection:
        'Tại sao khi có lực cản không khí, góc ném cho tầm xa cực đại lại nhỏ hơn $45^\\circ$? Vì bay ở góc thấp hơn giúp giảm thời gian vật chịu tác dụng của lực cản và rút ngắn quãng đường bay trong không khí, giữ được thành phần vận tốc ngang lâu hơn.',
      teacherExplanation:
        'Mở tab 2. Thí Nghiệm 2D, bật Dấu vết quỹ đạo (Trace) và so sánh 2 đường bay khi tắt và bật Lực cản không khí.',
      keyTakeaway:
        'Góc $45^\\circ$ chỉ tối ưu trong chân không trên mặt đất phẳng; ngoài đời thực (có cản và $h_0 > 0$) góc tối ưu nhỏ hơn $45^\\circ$.',
      miniQuiz: [
        {
          id: 'p10p-s3-q1',
          question:
            'Khi bật lực cản không khí trong thí nghiệm ném xiên từ mặt đất, hình dạng quỹ đạo thay đổi thế nào so với Parabol lý tưởng?',
          options: [
            'A. Đối xứng hoàn toàn nhưng cao hơn',
            'B. Bất đối xứng: tầm xa giảm, nhánh rơi xuống dốc hơn nhánh đi lên',
            'C. Biến thành đường tròn',
            'D. Tầm xa không đổi nhưng thời gian bay tăng'
          ],
          correctIndex: 1,
          explanation:
            'Lực cản luôn ngược hướng vận tốc làm tiêu hao cơ năng liên tục, khiến vật đạt đỉnh thấp hơn, tầm xa ngắn hơn và nhánh xuống rơi dốc hơn.'
        },
        {
          id: 'p10p-s3-q2',
          question:
            'Trong phòng thí nghiệm ném ngang từ độ cao $h_0 > 0$, nếu tăng gấp đôi vận tốc ném ngang $v_0$ (không cản), đại lượng nào tăng gấp đôi?',
          options: [
            'A. Thời gian rơi chạm đất $t$',
            'B. Gia tốc trọng trường $g$',
            'C. Tầm bay xa $L = v_0\\sqrt{2h_0/g}$',
            'D. Thành phần vận tốc đứng khi chạm đất $v_y$'
          ],
          correctIndex: 2,
          explanation:
            'Thời gian rơi $t = \\sqrt{2h_0/g}$ không đổi khi tăng $v_0$, nên tầm xa $L = v_0 t$ tỉ lệ thuận với $v_0$ và tăng gấp đôi.'
        }
      ],
      miniEssay: {
        id: 'p10p-s3-e1',
        question:
          'Một khẩu pháo bắn đạn từ trên đồi cao ($h_0 = 25\\text{ m}$) xuống thung lũng. Giải thích vì sao nếu bắn ở góc $\\alpha = 40^\\circ$ có thể đạt tầm xa hơn góc $\\alpha = 45^\\circ$ dù bỏ qua sức cản không khí.',
        hint: 'Xét lợi thế của vận tốc ngang $v_0\\cos\\alpha$ lớn hơn khi thời gian rơi đã được cộng thêm nhờ độ cao $h_0$.',
        rubricChecklist: [
          'Khi $h_0 > 0$, vật có sẵn thời gian rơi thêm từ độ cao $h_0$ nên không cần dành quá nhiều vận tốc cho phương đứng.',
          'Góc thấp hơn $45^\\circ$ (như $40^\\circ$) cho thành phần ngang $v_0\\cos\\alpha$ lớn hơn, giúp tầm xa $L = v_x t_{\\text{bay}}$ lớn hơn.'
        ],
        sampleAnswer:
          'Khi bắn từ độ cao $h_0 > 0$, vật đã có sẵn thời gian rơi bổ sung nhờ độ cao ban đầu. Do đó giảm góc nâng xuống dưới $45^\\circ$ làm tăng vận tốc ngang $v_x = v_0\\cos\\alpha$ nhiều hơn mức giảm tương đối của tổng thời gian bay $t_{\\text{bay}}$, khiến tích $L = v_x \\cdot t_{\\text{bay}}$ đạt cực đại ở góc $\\alpha < 45^\\circ$.'
      }
    }
  ],

  'phys-11-shm': [
    {
      stepTitle: '1. Phương trình Dao động điều hòa, Vận tốc & Gia tốc',
      stepType: 'concept',
      conceptSection:
        'Dao động điều hòa là dao động mà li độ của vật là một hàm côsin (hoặc sin) theo thời gian. Nó tương ứng với hình chiếu của một chất điểm chuyển động tròn đều lên một trục đường kính nằm trong mặt phẳng quỹ đạo.',
      formulaSection: {
        primaryFormula: 'x = A\\cos(\\omega t + \\varphi), \\quad v = -\\omega A\\sin(\\omega t + \\varphi), \\quad a = -\\omega^2 x',
        secondaryFormulas: [
          'T = \\frac{2\\pi}{\\omega} = \\frac{1}{f}, \\qquad v_{\\max} = \\omega A, \\qquad a_{\\max} = \\omega^2 A'
        ],
        variablesNote:
          '• $A > 0$: biên độ (quỹ đạo dài $L = 2A$).\n• $\\omega > 0$ (rad/s): tần số góc; $\\varphi$ (rad): pha ban đầu xác định trạng thái tại $t = 0$.\n• $v$ sớm pha $\\pi/2$ so với $x$; $a$ ngược pha ($\\pi$) với $x$ và luôn hướng về Vị trí cân bằng $O$.'
      },
      deepDiveSection:
        'Quy luật "Biên – Cân bằng" cực kỳ quan trọng:\n• Tại **Vị trí cân bằng ($x = 0$)**: vận tốc đạt độ lớn cực đại $|v| = \\omega A$, còn gia tốc và lực kéo về triệt tiêu ($a = 0$).\n• Tại **Hai biên ($x = \\pm A$)**: vật đổi chiều chuyển động nên vận tốc tức thời $v = 0$, nhưng độ lớn gia tốc đạt cực đại $|a| = \\omega^2 A$ kéo vật quay ngược trở lại.',
      teacherExplanation:
        'Hiểu rõ mối quan hệ pha giữa $x$, $v$, $a$ và giá trị cực đại tại VTCB và hai biên là chìa khóa giải nhanh 80% bài tập Dao động điều hòa.',
      formulaHighlight: 'x = A\\cos(\\omega t + \\varphi), \\quad v = -\\omega A\\sin(\\omega t + \\varphi), \\quad a = -\\omega^2 x',
      keyTakeaway:
        'Gia tốc $a = -\\omega^2 x$ luôn trái dấu với li độ $x$ và luôn hướng về VTCB; $v$ đạt cực đại tại VTCB và bằng $0$ ở biên.',
      miniQuiz: [
        {
          id: 'p11s-s1-q1',
          question:
            'Một vật dao động điều hòa với phương trình $x = 6\\cos(4\\pi t - \\frac{\\pi}{3})\\text{ (cm)}$. Chu kỳ và tốc độ cực đại của vật là:',
          options: [
            'A. $T = 0{,}5\\text{ s};\\; v_{\\max} = 24\\pi\\text{ cm/s}$',
            'B. $T = 2\\text{ s};\\; v_{\\max} = 24\\text{ cm/s}$',
            'C. $T = 0{,}5\\text{ s};\\; v_{\\max} = 6\\pi\\text{ cm/s}$',
            'D. $T = 4\\text{ s};\\; v_{\\max} = 24\\pi\\text{ cm/s}$'
          ],
          correctIndex: 0,
          explanation:
            '$\\omega = 4\\pi \\implies T = \\frac{2\\pi}{4\\pi} = 0{,}5\\text{ s}$ và $v_{\\max} = \\omega A = 4\\pi \\cdot 6 = 24\\pi\\text{ cm/s}$.'
        },
        {
          id: 'p11s-s1-q2',
          question:
            'Khi vật dao động điều hòa đi từ biên dương ($x = +A$) về vị trí cân bằng ($x = 0$), nhận xét nào đúng?',
          options: [
            'A. Tốc độ tăng dần, độ lớn gia tốc tăng dần',
            'B. Tốc độ tăng dần, độ lớn gia tốc giảm dần về $0$',
            'C. Tốc độ giảm dần, gia tốc hướng ra biên dương',
            'D. Cả vận tốc và gia tốc đều có giá trị dương'
          ],
          correctIndex: 1,
          explanation:
            'Từ biên về VTCB vật chuyển động nhanh dần (tốc độ tăng từ $0$ lên $\\omega A$), đồng thời $|x|$ giảm về $0$ nên $|a| = \\omega^2|x|$ giảm về $0$.'
        }
      ],
      miniEssay: {
        id: 'p11s-s1-e1',
        question:
          'Cho vật dao động điều hòa với phương trình $x = 4\\cos(2\\pi t + \\frac{\\pi}{2})\\text{ (cm)}$. Xác định vị trí và chiều chuyển động của vật tại thời điểm ban đầu $t = 0$, và tính gia tốc khi vật ở biên âm.',
        hint: 'Thay $t = 0$ vào $x(t)$ và $v(t) = -\\omega A \\sin(\\omega t + \\varphi)$.',
        rubricChecklist: [
          'Tại $t = 0$: $x(0) = 4\\cos(\\pi/2) = 0\\text{ cm}$ (vị trí cân bằng).',
          'Tính $v(0) = -8\\pi\\sin(\\pi/2) = -8\\pi\\text{ cm/s} < 0$ (đi theo chiều âm).',
          'Tại biên âm $x = -4\\text{ cm}$: $a = -\\omega^2 x = -(2\\pi)^2(-4) = 16\\pi^2 \\approx 157{,}9\\text{ cm/s}^2$.'
        ],
        sampleAnswer:
          '• Tại $t = 0$: $x(0) = 4\\cos(\\frac{\\pi}{2}) = 0\\text{ cm}$, và $v(0) = -2\\pi \\cdot 4 \\sin(\\frac{\\pi}{2}) = -8\\pi\\text{ cm/s} < 0$. Vậy lúc $t = 0$ vật qua VTCB theo chiều âm.\n• Tại biên âm $x = -4\\text{ cm}$: $a = -\\omega^2 x = -(2\\pi)^2(-4) = 16\\pi^2\\text{ cm/s}^2 \\approx 1{,}58\\text{ m/s}^2$.'
      }
    },
    {
      stepTitle: '2. Công thức Độc lập Thời gian, Con lắc Lò xo & Con lắc Đơn',
      stepType: 'derivation',
      conceptSection:
        'Bằng cách khử thời gian $t$ từ hệ phương trình điều hòa, ta thu được các hệ thức liên hệ trực tiếp giữa $x, v, a$ tại cùng một thời điểm bất kỳ (đồ thị pha là đường Elip). Với con lắc lò xo và con lắc đơn, tần số góc $\\omega$ hoàn toàn do cấu tạo cơ hệ quyết định.',
      formulaSection: {
        primaryFormula: 'A^2 = x^2 + \\frac{v^2}{\\omega^2}, \\qquad T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}',
        secondaryFormulas: [
          'T_{\\text{đơn}} = 2\\pi\\sqrt{\\frac{l}{g}}, \\qquad W = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2'
        ],
        variablesNote:
          '• $k$ (N/m): độ cứng lò xo; $m$ (kg): khối lượng quả nặng.\n• $l$ (m): chiều dài dây treo con lắc đơn.\n• Lưu ý đơn vị cực kỳ hay sai: nếu dùng $\\omega = \\sqrt{k/m}$ ($\\text{rad/s}$) thì $x$ và $v$ phải đồng bộ mét và $\\text{m/s}$, hoặc cm và $\\text{cm/s}$!'
      },
      deepDiveSection:
        'Điểm khác biệt thú vị cần nhớ:\n• **Con lắc lò xo**: chu kỳ $T = 2\\pi\\sqrt{m/k}$ phụ thuộc khối lượng $m$ và độ cứng $k$, **KHÔNG** phụ thuộc gia tốc trọng trường $g$ (đem lên Mặt Trăng vẫn dao động cùng chu kỳ!).\n• **Con lắc đơn (góc nhỏ)**: chu kỳ $T = 2\\pi\\sqrt{l/g}$ phụ thuộc chiều dài $l$ và $g$, **KHÔNG** phụ thuộc khối lượng $m$ (quả nặng $100\\text{ g}$ hay $1\\text{ kg}$ có cùng chu kỳ!).',
      teacherExplanation:
        'Từ $\\cos^2(\\omega t + \\varphi) + \\sin^2(\\omega t + \\varphi) = 1$ ta rút ra công thức độc lập $A^2 = x^2 + v^2/\\omega^2$, một trong những hệ thức dùng nhiều nhất chương Dao động.',
      formulaHighlight: 'A^2 = x^2 + \\frac{v^2}{\\omega^2}, \\qquad T_{\\text{lò xo}} = 2\\pi\\sqrt{\\frac{m}{k}}',
      keyTakeaway:
        'Cơ năng $W = \\frac{1}{2}kA^2$ tỉ lệ với bình phương biên độ $A^2$; động năng và thế năng biến thiên tuần hoàn với chu kỳ $T/2$ ($f\' = 2f$).',
      miniQuiz: [
        {
          id: 'p11s-s2-q1',
          question:
            'Một vật dao động điều hòa với $\\omega = 10\\text{ rad/s}$. Khi ở li độ $x = 3\\text{ cm}$, vật có vận tốc $v = 40\\text{ cm/s}$. Biên độ dao động $A$ bằng:',
          options: ['A. $5\\text{ cm}$', 'B. $7\\text{ cm}$', 'C. $4{,}3\\text{ cm}$', 'D. $25\\text{ cm}$'],
          correctIndex: 0,
          explanation:
            'Áp dụng công thức độc lập: $A = \\sqrt{x^2 + \\frac{v^2}{\\omega^2}} = \\sqrt{3^2 + (40/10)^2} = \\sqrt{9 + 16} = 5\\text{ cm}$.'
        },
        {
          id: 'p11s-s2-q2',
          question:
            'Để chu kỳ của một con lắc lò xo tăng lên gấp đôi, ta phải thay đổi khối lượng vật nặng như thế nào (giữ nguyên độ cứng $k$)?',
          options: ['A. Tăng khối lượng gấp 2 lần', 'B. Tăng khối lượng gấp 4 lần', 'C. Giảm khối lượng 2 lần', 'D. Giảm khối lượng 4 lần'],
          correctIndex: 1,
          explanation:
            'Vì $T = 2\\pi\\sqrt{m/k}$ tỉ lệ với $\\sqrt{m}$, muốn $T$ tăng 2 lần thì $m$ phải tăng $2^2 = 4$ lần.'
        }
      ],
      miniEssay: {
        id: 'p11s-s2-e1',
        question:
          'Một con lắc lò xo có độ cứng $k = 100\\text{ N/m}$ gắn vật $m = 0{,}25\\text{ kg}$ dao động điều hòa với biên độ $A = 4\\text{ cm}$. Tính tần số góc $\\omega$, chu kỳ $T$ và cơ năng toàn phần $W$.',
        hint: 'Đổi $A = 0{,}04\\text{ m}$ trước khi tính cơ năng $W = \\frac{1}{2}kA^2$ ra Jun!',
        rubricChecklist: [
          'Tính đúng $\\omega = \\sqrt{100 / 0{,}25} = 20\\text{ rad/s}$ và $T = \\frac{2\\pi}{20} = \\frac{\\pi}{10} \\approx 0{,}314\\text{ s}$.',
          'Đổi đúng $A = 0{,}04\\text{ m}$.',
          'Tính đúng cơ năng $W = \\frac{1}{2} \\cdot 100 \\cdot (0{,}04)^2 = 0{,}08\\text{ J}$.'
        ],
        sampleAnswer:
          '• Tần số góc: $\\omega = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{100}{0{,}25}} = 20\\text{ rad/s}$.\n• Chu kỳ: $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{20} = 0{,}1\\pi \\approx 0{,}314\\text{ s}$.\n• Đổi $A = 4\\text{ cm} = 0{,}04\\text{ m}$. Cơ năng: $W = \\frac{1}{2}kA^2 = 0{,}5 \\cdot 100 \\cdot 0{,}04^2 = 0{,}08\\text{ J}$.'
      }
    },
    {
      stepTitle: '3. Thực hành Đo Chu kỳ với Đồng hồ Bấm giây & Tắt dần 2D',
      stepType: 'experiment',
      conceptSection:
        'Trong thí nghiệm đo chu kỳ dao động nhanh, bấm giờ 1 chu kỳ đơn lẻ thường gây sai số phản xạ lớn. Phương pháp chuẩn là đo tổng thời gian $\\Delta t$ của $N$ dao động liên tiếp (ví dụ $N = 5$ hoặc $10$) rồi lấy $T = \\Delta t / N$.',
      formulaSection: {
        primaryFormula: 'T_{\\text{đo}} = \\frac{\\Delta t_{N\\text{ chu kỳ}}}{N}, \\qquad A(t) = A_0 e^{-\\beta t} \\text{ (tắt dần)}',
        variablesNote:
          '• Chọn mốc đếm khi vật đi qua biên hoặc VTCB theo cùng một chiều.\n• Trong tab 2D: bật **Đồ thị thời gian thực** và **Tắt dần** để thấy biên độ suy giảm theo hàm mũ.'
      },
      deepDiveSection:
        'Khi có lực ma sát hay lực cản môi trường, dao động trở thành **dao động tắt dần**: biên độ và cơ năng giảm dần theo thời gian (cơ năng chuyển thành nhiệt). Để duy trì biên độ ổn định như ở đồng hồ quả lắc, ta phải cung cấp đúng phần năng lượng hao hụt sau mỗi chu kỳ (dao động duy trì).',
      teacherExplanation:
        'Chuyển sang tab 2. Thí Nghiệm 2D để dùng đồng hồ bấm giây đo 5 chu kỳ và kiểm chứng công thức $T = 2\\pi\\sqrt{m/k}$.',
      keyTakeaway:
        'Đo nhiều chu kỳ liên tiếp giúp giảm sai số tuyệt đối của phản xạ tay xuống $N$ lần.',
      miniQuiz: [
        {
          id: 'p11s-s3-q1',
          question:
            'Một học sinh dùng đồng hồ bấm giây đo thời gian con lắc thực hiện $10$ dao động toàn phần hết $12{,}5\\text{ s}$. Chu kỳ dao động đo được là:',
          options: ['A. $125\\text{ s}$', 'B. $1{,}25\\text{ s}$', 'C. $0{,}8\\text{ s}$', 'D. $2{,}5\\text{ s}$'],
          correctIndex: 1,
          explanation:
            '$T = \\frac{\\Delta t}{N} = \\frac{12{,}5}{10} = 1{,}25\\text{ s}$.'
        },
        {
          id: 'p11s-s3-q2',
          question:
            'Trong dao động tắt dần của con lắc lò xo có ma sát, đại lượng nào sau đây giảm dần theo thời gian?',
          options: [
            'A. Khối lượng và độ cứng lò xo',
            'B. Biên độ dao động và cơ năng toàn phần',
            'C. Gia tốc trọng trường',
            'D. Tần số góc tự nhiên'
          ],
          correctIndex: 1,
          explanation:
            'Lực ma sát sinh công âm làm tiêu hao cơ năng, do đó cả cơ năng và biên độ dao động đều giảm dần theo thời gian.'
        }
      ],
      miniEssay: {
        id: 'p11s-s3-e1',
        question:
          'Nếu sai số phản xạ tay mỗi lần bấm đồng hồ là $\\pm 0{,}2\\text{ s}$, hãy tính sai số của chu kỳ $T$ khi em đo $1$ chu kỳ so với khi đo $10$ chu kỳ liên tiếp rồi chia cho $10$.',
        hint: 'Tổng sai số bấm bắt đầu và kết thúc là $0{,}2\\text{ s}$, chia đều cho $N$ chu kỳ.',
        rubricChecklist: [
          'Đo 1 chu kỳ: sai số $\\Delta T_1 = 0{,}2\\text{ s}$.',
          'Đo 10 chu kỳ: sai số $\\Delta T_{10} = \\frac{0{,}2}{10} = 0{,}02\\text{ s}$ (giảm 10 lần).'
        ],
        sampleAnswer:
          'Nếu chỉ đo 1 chu kỳ, sai số phép đo chu kỳ chính bằng sai số phản xạ $\\Delta T = 0{,}2\\text{ s}$ (rất lớn nếu $T \\approx 0{,}6\\text{ s}$).\nKhi đo $10$ chu kỳ liên tiếp rồi chia cho $10$, sai số bị chia nhỏ $10$ lần còn $\\Delta T = \\frac{0{,}2}{10} = 0{,}02\\text{ s}$, tăng độ chính xác vượt trội.'
      }
    }
  ]
};
