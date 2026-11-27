import { ChemistryLesson } from '../types';
import { makeChemLesson } from './chemistryGdpt2018Lessons';

const SRC_2018_6 = 'GDPT 2018 · KHTN 6 (Phần Chất)';
const SRC_2018_7 = 'GDPT 2018 · KHTN 7 (Phần Chất)';
const SRC_2018_8 = 'GDPT 2018 · KHTN 8 (Phần Chất)';
const SRC_2006_6 = 'GDPT 2006 · Cầu nối Hóa học Lớp 6';
const SRC_2006_7 = 'GDPT 2006 · Cầu nối Hóa học Lớp 7';
const SRC_2006_8 = 'GDPT 2006 · SGK Hóa học 8';

export const CHEMISTRY_MS_EXTRA_LESSONS: ChemistryLesson[] = [
  // ============================================================================
  // 1. GDPT 2018 — BỔ SUNG ĐẦY ĐỦ LỚP 6, 7, 8
  // ============================================================================
  makeChemLesson({
    id: 'chem-6-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Tính chất Vật lí & Hóa học của Chất',
    sourceTag: SRC_2018_6,
    lessonNumber: 6,
    title: 'Bài 6: Tính chất Vật lí – Hóa học, Nhiệt độ Nóng chảy & Nhiệt độ Sôi',
    subtitle: 'Phân biệt nước cất sôi cố định ở 100°C với nước muối và phân biệt tính chất vật lí vs tính chất hóa học',
    description:
      'Thí nghiệm đun nóng băng tan – nước sôi và kiểm chứng sự biến đổi tạo chất mới qua mô phỏng hạt phân tử 2D/3D.',
    theory1Heading: '1. Tính chất Vật lí vs Tính chất Hóa học',
    theory1:
      '• **Tính chất vật lí**: trạng thái, màu sắc, mùi vị, nhiệt độ nóng chảy, nhiệt độ sôi, tính tan, khối lượng riêng, dẫn điện/nhiệt (không tạo chất mới).\n• **Tính chất hóa học**: khả năng biến đổi thành **chất khác** (đường cháy thành than đen, sắt gỉ sét ngoài trời, than cháy sinh $\\text{CO}_2$).',
    theory2Heading: '2. Nhận biết Chất tinh khiết qua Nhiệt độ Sôi – Nóng chảy',
    theory2:
      '• **Chất tinh khiết** có nhiệt độ nóng chảy và nhiệt độ sôi **xác định** (nước tinh khiết ở $1\\text{ atm}$ nóng chảy ở $0^\\circ\\text{C}$ và sôi ở $100^\\circ\\text{C}$).\n• Khi lẫn tạp chất (như pha muối vào nước), nhiệt độ sôi **tăng trên $100^\\circ\\text{C}$** và nhiệt độ đông đặc **giảm dưới $0^\\circ\\text{C}$**.',
    keyFormulas: [
      't_{\\text{nc}}(\\text{H}_2\\text{O tinh khiết}) = 0^\\circ\\text{C}; \\quad t_{\\text{sôi}}(\\text{H}_2\\text{O tinh khiết}) = 100^\\circ\\text{C}'
    ],
    sim2d: 'states_of_matter_2d',
    sim3d: 'matter_states_3d',
    mcq1: {
      source: 'KHTN 6 · Tính chất của chất',
      question: 'Tính chất nào sau đây của đường mía là TÍNH CHẤT HÓA HỌC?',
      options: [
        'A. Tinh thể màu trắng, vị ngọt',
        'B. Tan tốt trong nước ấm',
        'C. Đun nóng mạnh bị phân hủy thành than đen và hơi nước',
        'D. Có khối lượng riêng lớn hơn nước'
      ],
      correctIndex: 2,
      explanation: 'Đường cháy biến thành chất mới (than cacbon + hơi nước) là tính chất hóa học.'
    },
    mcq2: {
      source: 'KHTN 6 · Chất tinh khiết',
      question: 'Ở áp suất tiêu chuẩn, đun sôi mẫu nước A thấy sôi ổn định đúng $100^\\circ\\text{C}$, mẫu nước B sôi ở $102{,}5^\\circ\\text{C}$. Kết luận nào đúng?',
      options: [
        'A. Mẫu A là nước tinh khiết, mẫu B có lẫn chất tan',
        'B. Mẫu B là nước tinh khiết hơn mẫu A',
        'C. Cả hai đều là chất tinh khiết',
        'D. Không thể kết luận'
      ],
      correctIndex: 0,
      explanation: 'Nước tinh khiết có điểm sôi xác định đúng $100^\\circ\\text{C}$ ở $1\\text{ atm}$.'
    },
    essay: {
      source: 'KHTN 6 · Thực tế đời sống',
      question: 'Giải thích vì sao ở các nước xứ lạnh vào mùa đông người ta thường rải muối lên mặt đường băng tuyết?',
      hints: ['Hỗn hợp nước – muối có nhiệt độ đông đặc thấp hơn $0^\\circ\\text{C}$.'],
      solutionSteps: [
        'Khi rải muối ăn vào băng tuyết, muối hòa tan tạo hỗn hợp nước muối có điểm đóng băng hạ xuống dưới $0^\\circ\\text{C}$ (có thể tới $-10^\\circ\\text{C}$).',
        'Nhờ vậy băng tuyết nhanh tan chảy ở nhiệt độ $0^\\circ\\text{C}$ giúp mặt đường không trơn trượt.'
      ],
      finalAnswer: 'Muối làm hạ nhiệt độ đông đặc của nước xuống dưới $0^\\circ\\text{C}$ khiến băng tan.'
    }
  }),
  makeChemLesson({
    id: 'chem-6-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Sự cháy & Nhiên liệu an toàn',
    sourceTag: SRC_2018_6,
    lessonNumber: 7,
    title: 'Bài 7: Sự cháy, Tam giác Lửa & Sử dụng Nhiên liệu An toàn – Tiết kiệm',
    subtitle: 'Ba điều kiện phát sinh sự cháy, chọn đúng nhiên liệu Rắn – Lỏng – Khí và cách xử lí từng loại đám cháy',
    description:
      'Thực hành điều chỉnh lượng Oxygen và nhiệt độ trong lò đốt 2D/3D để hiểu bản chất sự cháy và nguyên tắc dập lửa an toàn.',
    theory1Heading: '1. Tam giác Lửa & Hai cách dập tắt đám cháy',
    theory1:
      '• Muốn duy trì sự cháy cần đủ **3 yếu tố**: (1) **Chất cháy (nhiên liệu)**, (2) **Khí Oxygen ($\\text{O}_2$)**, (3) **Nhiệt độ đạt điểm bắt cháy**.\n• Muốn dập lửa chỉ cần cắt **ít nhất 1 cạnh** của tam giác: phun nước (hạ nhiệt cho gỗ/giấy) hoặc trùm chăn ẩm/phủ cát/bình $\\text{CO}_2$ (ngăn $\\text{O}_2$ với cháy xăng dầu, chập điện).',
    theory2Heading: '2. Phân loại & Sử dụng Nhiên liệu hiệu quả',
    theory2:
      '• **Nhiên liệu rắn** (than, củi), **lỏng** (xăng, dầu hỏa, cồn), **khí** (gas LPG, bioga — cháy sạch và tỏa nhiệt cao nhất).\n• Để tiết kiệm nhiên liệu: tăng tiếp xúc với không khí vừa đủ (bếp tổ ong có lỗ thoáng), không để lửa quá to gây thất thoát nhiệt.',
    keyFormulas: [
      '\\text{Sự cháy} = \\text{Nhiên liệu} + \\text{O}_2 + \\text{Nhiệt độ bắt cháy}'
    ],
    sim2d: 'oxygen_combustion_2d',
    sim3d: 'combustion_reactor_3d',
    mcq1: {
      source: 'KHTN 6 · An toàn cháy nổ',
      question: 'Khi chảo dầu ăn trên bếp đang bốc cháy, xử lí nào sau đây ĐÚNG và AN TOÀN nhất?',
      options: [
        'A. Tạt ngay một ca nước lạnh vào chảo dầu',
        'B. Tắt bếp và đậy kín nắp vung nồi/chăn ẩm để cắt nguồn Oxygen',
        'C. Thổi thật mạnh vào chảo',
        'D. Bê chảo chạy ra ngoài phòng'
      ],
      correctIndex: 1,
      explanation: 'Dầu nhẹ hơn nước nên tạt nước sẽ làm dầu bắn tung tóe bùng lửa; đậy nắp vung kín sẽ ngăn Oxygen làm tắt lửa ngay.'
    },
    mcq2: {
      source: 'KHTN 6 · Nhiên liệu',
      question: 'Vì sao bếp than có nhiều lỗ khí thông thoáng ở dưới đáy bếp lại giúp than cháy đượm và ít khói độc CO hơn?',
      options: [
        'A. Vì giúp cung cấp đủ khí Oxygen cho than cháy hoàn toàn',
        'B. Vì làm than nặng hơn',
        'C. Vì làm giảm nhiệt độ bếp',
        'D. Vì hút hơi nước'
      ],
      correctIndex: 0,
      explanation: 'Cung cấp đủ luồng khí Oxygen giúp nhiên liệu cháy hoàn toàn và tỏa nhiều nhiệt.'
    },
    essay: {
      source: 'KHTN 6 · Phòng cháy',
      question: 'Khi phát hiện mùi khí gas rò rỉ nồng nặc trong bếp kín, vì sao tuyệt đối KHÔNG được bật công tắc đèn điện hay quẹt diêm kiểm tra?',
      hints: ['Tia lửa điện khi đóng mở công tắc đủ làm hỗn hợp gas + O₂ phát nổ.'],
      solutionSteps: [
        'Khí gas trộn với Oxygen trong không khí tạo thành hỗn hợp dễ cháy nổ.',
        'Khi bật công tắc đèn tạo ra tia lửa điện nhỏ cung cấp nhiệt độ kích nổ tức thì.',
        'Cách đúng: khóa van bình gas, mở toang cửa thông gió tự nhiên và ra ngoài gọi hỗ trợ.'
      ],
      finalAnswer: 'Tia lửa điện ở công tắc có thể kích nổ hỗn hợp khí gas – Oxygen.'
    }
  }),
  makeChemLesson({
    id: 'chem-6-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 6',
    stageLabel: 'KHTN 6 · Thực hành Tách chất & Tinh chế',
    sourceTag: SRC_2018_6,
    lessonNumber: 8,
    title: 'Bài 8: Thực hành Tinh chế Muối ăn từ Muối thô & Quy trình Tách nhiều lớp',
    subtitle: 'Phối hợp Hòa tan → Lọc bỏ bã cát → Cô cạn thu tinh thể muối sạch bằng dụng cụ thí nghiệm chuẩn',
    description:
      'Thiết kế quy trình tách hỗn hợp 3–4 chất (bột sắt, cát, muối ăn, dầu ăn) và thực hành mô phỏng lọc – cô cạn trên bàn thí nghiệm.',
    theory1Heading: '1. Nguyên tắc Tách hỗn hợp nhiều thành phần',
    theory1:
      '• Luôn dựa vào **sự khác biệt tính chất vật lí**: từ tính (hút sắt bằng nam châm), kích thước hạt không tan (lọc qua phễu giấy), khối lượng riêng không trộn lẫn (chiết phễu), nhiệt độ sôi khác nhau (cô cạn hoặc chưng cất).\n• **Tinh chế muối lẫn cát**: (1) Hòa tan vào nước (muối tan, cát không tan) $\\to$ (2) Lọc giữ cát trên giấy lọc $\\to$ (3) Cô cạn nước lọc thu muối tinh khiết.',
    theory2Heading: '2. Quy tắc An toàn Phòng thí nghiệm Hóa học',
    theory2:
      '• Đọc kĩ nhãn hóa chất, không nếm hay ngửi trực tiếp sát miệng lọ (dùng tay phẩy nhẹ).\n• Đeo kính bảo hộ, cột gọn tóc, hơ đều đáy ống nghiệm trước khi đun tập trung.',
    keyFormulas: [
      '\\text{Muối lẫn Cát} \\xrightarrow{+\\text{H}_2\\text{O}} \\text{Hỗn hợp} \\xrightarrow{\\text{Lọc}} \\text{Nước muối} \\xrightarrow{\\text{Cô cạn}} \\text{Muối sạch}'
    ],
    sim2d: 'mixture_separation_2d',
    sim3d: 'separation_lab_3d',
    mcq1: {
      source: 'KHTN 6 · Thực hành tách chất',
      question: 'Để tách hỗn hợp gồm Bột sắt, Cát và Muối ăn thành 3 chất riêng biệt, trình tự hợp lí nhất là:',
      options: [
        'A. Cô cạn → Lọc → Dùng nam châm',
        'B. Dùng nam châm hút Bột sắt → Hòa tan vào nước và Lọc lấy Cát → Cô cạn nước lọc thu Muối ăn',
        'C. Dùng phễu chiết ngay từ đầu',
        'D. Đổ thêm dầu ăn vào'
      ],
      correctIndex: 1,
      explanation: 'Dùng nam châm tách sắt trước khi cho nước vào để tránh rỉ sét và giúp lọc cát – cô cạn muối cực sạch.'
    },
    mcq2: {
      source: 'KHTN 6 · Chưng cất',
      question: 'Phương pháp Chưng cất phân đoạn dùng để tách 2 chất lỏng hòa tan vào nhau (như Rượu etylic sôi $78{,}3^\\circ\\text{C}$ và Nước sôi $100^\\circ\\text{C}$) dựa vào sự khác nhau về:',
      options: ['A. Màu sắc', 'B. Từ tính', 'C. Nhiệt độ sôi', 'D. Kích thước tinh thể'],
      correctIndex: 2,
      explanation: 'Chất có nhiệt độ sôi thấp hơn (cồn $78{,}3^\\circ\\text{C}$) bay hơi trước và được làm lạnh ngưng tụ riêng.'
    },
    essay: {
      source: 'KHTN 6 · Thiết kế thí nghiệm',
      question: 'Đề xuất cách tách lấy riêng dầu ăn từ hỗn hợp dầu ăn trộn lẫn với nước lọc.',
      hints: ['Dầu ăn nhẹ hơn nước và không tan trong nước nên tách thành lớp nổi phía trên.'],
      solutionSteps: [
        'Đổ hỗn hợp vào **phễu chiết**, để yên vài phút cho dầu ăn nổi hoàn toàn thành lớp riêng bên trên lớp nước.',
        'Mở khóa phễu chiết cho phần nước nặng hơn ở dưới chảy hết vào cốc, sau đó khóa van lại để giữ trọn lớp dầu ăn trong phễu.'
      ],
      finalAnswer: 'Dùng phễu chiết tách lớp nước ở dưới và thu phần dầu ăn nổi ở trên.'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b6',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Cấu trúc Vỏ Electron & Khối lượng Nguyên tử',
    sourceTag: SRC_2018_7,
    lessonNumber: 6,
    title: 'Bài 6: Cấu tạo Vỏ Electron (Lớp 2–8–8) & Dự đoán Tính Kim loại – Phi kim',
    subtitle: 'Vì sao lớp ngoài cùng 1–3e là Kim loại, 5–7e là Phi kim, 8e là Khí hiếm bền vững',
    description:
      'Trực quan hóa các lớp electron K–L–M trên mô hình Bohr 2D và đám mây orbital 3D để hiểu quy luật nhường – nhận electron.',
    theory1Heading: '1. Quy luật xếp Electron & Độ bền Khí hiếm',
    theory1:
      '• Các electron chuyển động quanh hạt nhân xếp thành từng **lớp từ trong ra ngoài**: lớp 1 tối đa **$2e$**, lớp 2 tối đa **$8e$**, lớp 3 (20 nguyên tố đầu) tối đa $8e$.\n• Khí hiếm ($\text{He}$ có $2e$; $\text{Ne, Ar}$ có $8e$ lớp ngoài cùng) đạt cấu hình **bền vững trơ hóa học**.',
    theory2Heading: '2. Dự đoán nhanh Kim loại – Phi kim từ Lớp ngoài cùng',
    theory2:
      '• Có **$1, 2, 3$ electron** lớp ngoài cùng $\\to$ **Kim loại** (dễ nhường $e$ tạo ion dương, trừ $\\text{H, He, B}$).\n• Có **$5, 6, 7$ electron** lớp ngoài cùng $\\to$ **Phi kim** (dễ nhận thêm $e$ hoặc góp chung $e$).\n• Có **$8$ electron** ($2e$ với $\\text{He}$) $\\to$ **Khí hiếm**.',
    keyFormulas: [
      '\\text{Số } p = \\text{Số } e = Z; \\quad m_{\\text{nguyên tử (amu)}} \\approx \\text{Số } p + \\text{Số } n'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'atomic_orbitals_3d',
    mcq1: {
      source: 'KHTN 7 · Vỏ electron',
      question: 'Nguyên tử Sodium ($\\text{Na}$) có $Z = 11$ proton. Số lớp electron và số electron lớp ngoài cùng của $\\text{Na}$ lần lượt là:',
      options: ['A. $2$ lớp, $1e$ ngoài cùng', 'B. $3$ lớp ($2-8-1$), $1e$ ngoài cùng (Kim loại)', 'C. $3$ lớp ($2-8-1$), $8e$ ngoài cùng', 'D. $4$ lớp, $2e$ ngoài cùng'],
      correctIndex: 1,
      explanation: '$11 = 2 + 8 + 1 \\implies 3$ lớp electron và $1e$ lớp ngoài cùng nên $\\text{Na}$ là kim loại hoạt động rất mạnh.'
    },
    mcq2: {
      source: 'KHTN 7 · Khối lượng nguyên tử',
      question: 'Một nguyên tử Oxygen có $8$ proton và $8$ neutron. Khối lượng nguyên tử xấp xỉ tính theo đơn vị $\\text{amu}$ là:',
      options: ['A. $8\\text{ amu}$', 'B. $16\\text{ amu}$', 'C. $24\\text{ amu}$', 'D. $32\\text{ amu}$'],
      correctIndex: 1,
      explanation: 'Electron quá nhẹ nên khối lượng tập trung ở hạt nhân: $8 + 8 = 16\\text{ amu}$.'
    },
    essay: {
      source: 'KHTN 7 · Sơ đồ Bohr',
      question: 'Vẽ/mô tả sự phân bố electron theo từng lớp của nguyên tử Chlorine ($Z = 17$) và dự đoán đây là kim loại hay phi kim.',
      hints: ['Xếp lần lượt: lớp 1 = $2e$, lớp 2 = $8e$, phần còn lại ở lớp 3.'],
      solutionSteps: [
        'Tổng số electron bằng số proton: $17e$.',
        'Phân bố: lớp 1 có $2e$, lớp 2 có $8e$, lớp 3 có $17 - 10 = 7e$.',
        'Do lớp ngoài cùng có $7e$ ($> 4$), Chlorine có xu hướng nhận $1e$ để đạt $8e$ bền vững nên là **Phi kim** hoạt động mạnh.'
      ],
      finalAnswer: 'Cấu hình lớp $(2, 8, 7)$; có $7e$ ngoài cùng nên là Phi kim.'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Khám phá Bảng Tuần hoàn',
    sourceTag: SRC_2018_7,
    lessonNumber: 7,
    title: 'Bài 7: Quy luật Bảng Tuần hoàn 20 Nguyên tố đầu — Kim loại Kiềm, Halogen & Khí hiếm',
    subtitle: 'Tra nhanh Ô – Chu kì – Nhóm trên Bảng tuần hoàn và hiểu vì sao các nguyên tố cùng cột có tính chất giống nhau',
    description:
      'Khám phá tháp Bảng tuần hoàn 3D và biểu đồ xu hướng bán kính – độ âm điện 2D cho 20 nguyên tố quan trọng nhất cấp THCS.',
    theory1Heading: '1. Nguyên tắc sắp xếp Bảng Tuần hoàn',
    theory1:
      '• Các nguyên tố xếp theo chiều **tăng dần điện tích hạt nhân ($Z$)**.\n• **Số thứ tự Chu kì** (hàng ngang) = **Số lớp electron**.\n• **Số thứ tự Nhóm A** (cột dọc) = **Số electron lớp ngoài cùng** (quy định tính chất hóa học tương tự nhau trong cùng một cột!).',
    theory2Heading: '2. Ba nhóm đặc trưng dễ gặp nhất',
    theory2:
      '• **Nhóm IA (Kim loại kiềm)**: $\\text{Li, Na, K}$ — kim loại mềm, phản ứng mãnh liệt với nước.\n• **Nhóm VIIA (Halogen)**: $\\text{F, Cl, Br, I}$ — phi kim hoạt động mạnh.\n• **Nhóm VIIIA (Khí hiếm)**: $\\text{He, Ne, Ar}$ — khí đơn nguyên tử trơ, dùng bơm khinh khí cầu hoặc đèn neon.',
    keyFormulas: [
      '\\text{STT Ô} = Z = p = e; \\quad \\text{Chu kì} = \\text{Số lớp } e; \\quad \\text{Nhóm A} = e_{\\text{ngoài cùng}}'
    ],
    sim2d: 'periodic_trends_2d',
    sim3d: 'periodic_tower_3d',
    mcq1: {
      source: 'KHTN 7 · Bảng tuần hoàn',
      question: 'Nguyên tố Calcium ($\text{Ca}$) nằm ở Ô 20, Chu kì 4, Nhóm IIA. Thông tin nào sau đây ĐÚNG về nguyên tử $\\text{Ca}$?',
      options: [
        'A. Có 2 lớp electron và 4 electron ngoài cùng',
        'B. Có 4 lớp electron và 2 electron lớp ngoài cùng (Kim loại)',
        'C. Có 20 neutron',
        'D. Là khí hiếm trơ'
      ],
      correctIndex: 1,
      explanation: 'Chu kì 4 nghĩa là có $4$ lớp electron; Nhóm IIA nghĩa là có $2e$ lớp ngoài cùng.'
    },
    mcq2: {
      source: 'KHTN 7 · Nhóm nguyên tố',
      question: 'Cặp nguyên tố nào sau đây có tính chất hóa học TƯƠNG TỰ nhau vì nằm cùng một nhóm?',
      options: ['A. $\\text{Na}$ và $\\text{Cl}$', 'B. $\\text{Li}$ ($Z=3$) và $\\text{K}$ ($Z=19$)', 'C. $\\text{C}$ và $\\text{O}$', 'D. $\\text{He}$ và $\\text{H}$'],
      correctIndex: 1,
      explanation: 'Cả $\\text{Li}$ và $\\text{K}$ đều có $1e$ lớp ngoài cùng (Nhóm IA – kim loại kiềm).'
    },
    essay: {
      source: 'KHTN 7 · Tra Bảng tuần hoàn',
      question: 'Cho nguyên tố Aluminum ($\text{Al}$) có $Z = 13$. Hãy xác định số lớp electron, số electron lớp ngoài cùng và vị trí Ô – Chu kì – Nhóm của $\\text{Al}$ trong Bảng tuần hoàn.',
      hints: ['Phân lớp $13 = 2 + 8 + 3$.'],
      solutionSteps: [
        'Ô nguyên tố: **13** (vì $Z = 13$).',
        'Cấu hình lớp: $2 - 8 - 3 \\implies$ có **3 lớp electron** nên thuộc **Chu kì 3**.',
        'Có **3 electron lớp ngoài cùng** nên thuộc **Nhóm IIIA** (kim loại nhẹ).'
      ],
      finalAnswer: 'Ô 13, Chu kì 3, Nhóm IIIA.'
    }
  }),
  makeChemLesson({
    id: 'chem-7-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 7',
    stageLabel: 'KHTN 7 · Phân tử, Hóa trị & Phần trăm Nguyên tố',
    sourceTag: SRC_2018_7,
    lessonNumber: 8,
    title: 'Bài 8: Hình học Phân tử đơn giản, Lập CTHH & Tính % Khối lượng Nguyên tố',
    subtitle: 'Thực hành ráp mô hình phân tử H₂O – CH₄ – CO₂ trong không gian 3D và thành thạo quy tắc chéo lập CTHH',
    description:
      'Kết nối góc liên kết phân tử 3D (thẳng, góc gấp khúc, tứ diện) với bài toán lập công thức hóa học và tính phần trăm hàm lượng nguyên tố trong phân bón/khoáng vật.',
    theory1Heading: '1. Quy tắc Hóa trị & Lập nhanh Công thức Hóa học',
    theory1:
      '• Hợp chất tạo bởi $A$ (hóa trị $a$) và $B$ (hóa trị $b$) có dạng $A_x B_y$ thỏa mãn **$x \\cdot a = y \\cdot b \\iff \\frac{x}{y} = \\frac{b}{a}$** (rút gọn tối giản!).\n• Ví dụ: $\\text{Fe}$ (III) kết hợp nhóm $\\text{SO}_4$ (II) cho $\\text{Fe}_2(\\text{SO}_4)_3$.',
    theory2Heading: '2. Tính Khối lượng phân tử & Thành phần Phần trăm',
    theory2:
      '• Khối lượng phân tử $M(A_x B_y) = x \\cdot M_A + y \\cdot M_B$ (amu).\n• Phần trăm nguyên tố $A$: **$\\%A = \\frac{x \\cdot M_A}{M(A_x B_y)} \\cdot 100\\%$**.',
    keyFormulas: [
      'x \\cdot a = y \\cdot b',
      '\\%A = \\frac{x \\cdot M_A}{M_{\\text{hợp chất}}} \\cdot 100\\%'
    ],
    sim2d: 'vsepr_bonding_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'KHTN 7 · Lập CTHH',
      question: 'Công thức hóa học đúng của hợp chất tạo bởi Carbon hóa trị IV và Oxygen hóa trị II là:',
      options: ['A. $\\text{C}_2\\text{O}_4$', 'B. $\\text{CO}_2$', 'C. $\\text{CO}$', 'D. $\\text{C}_4\\text{O}_2$'],
      correctIndex: 1,
      explanation: 'Tỉ lệ $\\frac{x}{y} = \\frac{2}{4} = \\frac{1}{2}$ (rút gọn tối giản!) nên công thức là $\\text{CO}_2$.'
    },
    mcq2: {
      source: 'KHTN 7 · Phần trăm nguyên tố',
      question: 'Phần trăm khối lượng của nguyên tố Nitrogen ($\text{N}=14$) trong phân đạm Urea $\\text{CO(NH}_2)_2$ ($M = 60\\text{ amu}$) bằng bao nhiêu?',
      options: ['A. $23{,}3\\%$', 'B. $46{,}67\\%$', 'C. $35\\%$', 'D. $50\\%$'],
      correctIndex: 1,
      explanation: 'Có $2$ nguyên tử $\\text{N}$ nên $\\%\\text{N} = \\frac{2 \\cdot 14}{60} \\cdot 100\\% \\approx 46{,}67\\%$.'
    },
    essay: {
      source: 'KHTN 7 · Bài toán tổng hợp',
      question: 'Một hợp chất khí $X$ tạo bởi nguyên tố $S$ và $O$ có khối lượng phân tử bằng $64\\text{ amu}$, trong đó Oxygen chiếm $50\\%$ khối lượng. Tìm công thức hóa học của $X$.',
      hints: ['Tính $m_O = 50\\% \\cdot 64 = 32\\text{ amu}$, rồi chia cho $16$ tìm số nguyên tử O.'],
      solutionSteps: [
        'Khối lượng O trong 1 phân tử: $m_{\\text{O}} = 64 \\cdot 50\\% = 32\\text{ amu} \\implies y = 32 / 16 = 2$ nguyên tử O.',
        'Khối lượng S trong 1 phân tử: $m_{\\text{S}} = 64 - 32 = 32\\text{ amu} \\implies x = 32 / 32 = 1$ nguyên tử S.',
        'Vậy công thức hóa học của $X$ là $\\text{SO}_2$.'
      ],
      finalAnswer: 'Công thức hóa học: $\\text{SO}_2$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b7',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Tốc độ Phản ứng & Chất xúc tác',
    sourceTag: SRC_2018_8,
    lessonNumber: 7,
    title: 'Bài 7: Tốc độ Phản ứng, Thuyết Va chạm & Cơ chế Chất xúc tác ($\\text{MnO}_2$, Enzyme)',
    subtitle: 'Điều khiển nhiệt độ, nồng độ, diện tích bề mặt và hạ "rào cản năng lượng hoạt hóa" bằng chất xúc tác',
    description:
      'Tách riêng bài chuyên sâu về Động hóa học KHTN 8: quan sát các hạt va chạm hiệu quả trên mặt phẳng năng lượng hoạt hóa 2D/3D.',
    theory1Heading: '1. Bản chất Va chạm hiệu quả & Năng lượng Hoạt hóa ($E_a$)',
    theory1:
      '• Phản ứng chỉ xảy ra khi các phân tử chất tham gia **va chạm đủ mạnh** (vượt qua **năng lượng hoạt hóa $E_a$**) và **đúng hướng**.\n• Khi tăng nhiệt độ hoặc nồng độ, số lần va chạm hiệu quả trong 1 giây tăng vọt nên phản ứng xảy ra nhanh hơn.',
    theory2Heading: '2. Vai trò của Chất xúc tác & Ức chế',
    theory2:
      '• **Chất xúc tác** (như $\\text{MnO}_2$ khi phân hủy $\\text{H}_2\\text{O}_2$, hay enzyme Amylase trong nước bọt) mở ra con đường mới có **năng lượng hoạt hóa $E_a$ thấp hơn**, làm tốc độ tăng vọt nhưng **khối lượng xúc tác vẫn còn nguyên sau phản ứng**.\n• Chất ức chế làm chậm phản ứng (dùng bảo quản thực phẩm chống ôi thiu).',
    keyFormulas: [
      'v = -\\frac{\\Delta C_{\\text{tham gia}}}{\\Delta t} = \\frac{\\Delta C_{\\text{sản phẩm}}}{\\Delta t}',
      '\\text{Xúc tác} \\implies E_a \\text{ giảm} \\implies v \\text{ tăng}'
    ],
    sim2d: 'reaction_kinetics_2d',
    sim3d: 'activation_surface_3d',
    mcq1: {
      source: 'KHTN 8 · Tốc độ phản ứng',
      question: 'Trong hai ống nghiệm chứa cùng lượng dung dịch $\\text{H}_2\\text{O}_2$ $3\\%$, nhỏ thêm một ít bột $\\text{MnO}_2$ vào ống 2 thấy khí Oxygen sủi bọt dữ dội. Sau khi phản ứng kết thúc, lượng $\\text{MnO}_2$:',
      options: [
        'A. Bị biến mất hoàn toàn',
        'B. Giữ nguyên khối lượng và tính chất hóa học vì đóng vai trò chất xúc tác',
        'C. Tăng gấp đôi khối lượng',
        'D. Tan hết thành khí Oxygen'
      ],
      correctIndex: 1,
      explanation: 'Chất xúc tác tham gia hạ năng lượng hoạt hóa rồi hoàn nguyên lại sau chu trình nên khối lượng không đổi.'
    },
    mcq2: {
      source: 'KHTN 8 · Đời sống',
      question: 'Tại sao thực phẩm nấu chín để trong ngăn mát tủ lạnh ($4^\\circ\\text{C}$) giữ được lâu hỏng hơn nhiều so với để ngoài trời nắng ($35^\\circ\\text{C}$)?',
      options: [
        'A. Nhiệt độ thấp làm giảm mạnh tốc độ các phản ứng phân hủy sinh hóa của vi khuẩn',
        'B. Tủ lạnh hút hết khối lượng thức ăn',
        'C. Nhiệt độ thấp làm tăng áp suất',
        'D. Thức ăn đóng băng biến thành muối'
      ],
      correctIndex: 0,
      explanation: 'Hạ nhiệt độ làm giảm động năng phân tử và ức chế tốc độ phản ứng oxi hóa – phân hủy.'
    },
    essay: {
      source: 'KHTN 8 · So sánh tốc độ',
      question: 'So sánh tốc độ thoát khí $\\text{H}_2$ khi cho cùng $2\\text{ g}$ Kẽm ($\text{Zn}$) vào $50\\text{ ml}$ dung dịch $\\text{HCl}\\ 2\\text{M}$ ở hai trường hợp: (1) dùng $\\text{Zn}$ hạt to ở $25^\\circ\\text{C}$; (2) dùng $\\text{Zn}$ bột mịn ở $50^\\circ\\text{C}$. Giải thích.',
      hints: ['Trường hợp (2) vừa tăng diện tích bề mặt vừa tăng nhiệt độ.'],
      solutionSteps: [
        'Trường hợp (2) sủi bọt khí $\\text{H}_2$ **nhanh hơn rất nhiều** so với trường hợp (1).',
        'Lí do: nghiền $\\text{Zn}$ thành bột làm tăng mạnh diện tích tiếp xúc với axit và đun lên $50^\\circ\\text{C}$ giúp các ion chuyển động va chạm mạnh hơn.'
      ],
      finalAnswer: 'Trường hợp (2) nhanh hơn do cả diện tích tiếp xúc và nhiệt độ đều cao hơn.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b8',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Bài toán Chất dư – Hiệu suất',
    sourceTag: SRC_2018_8,
    lessonNumber: 8,
    title: 'Bài 8: Bài toán Chất hết – Chất dư & Tính Hiệu suất Phản ứng ($H\\%$)',
    subtitle: 'Mẹo chia tỉ lệ $n/\\text{hệ số}$ tìm ngay chất phản ứng hết trong 2 giây và xử lí bài toán hiệu suất công nghiệp',
    description:
      'Nâng cao kĩ năng tính toán theo phương trình hóa học KHTN 8 với piston khí 3D và cân tỉ lệ mol 2D.',
    theory1Heading: '1. Cách nhận biết Chất hết – Chất dư (Quy tắc Chia hệ số)',
    theory1:
      '• Cho phản ứng $aA + bB \\to cC$ biết trước cả $n_A$ và $n_B$.\n• Lập tỉ số **$\\frac{n_A}{a}$** và **$\\frac{n_B}{b}$**. Tỉ số nào **NHỎ HƠN** thì chất đó **PHẢN ỨNG HẾT** — mọi sản phẩm đều phải tính theo chất hết này!',
    theory2Heading: '2. Công thức Hiệu suất Phản ứng ($H\\%$)',
    theory2:
      '• Trong thực tế sản xuất, hiệu suất luôn $H\\% \\le 100\\%$:\n  $$H\\% = \\frac{m_{\\text{sản phẩm thực tế}}}{m_{\\text{sản phẩm lí thuyết}}} \\cdot 100\\% = \\frac{m_{\\text{tham gia phản ứng}}}{m_{\\text{ban đầu}}} \\cdot 100\\%$$\n• Mẹo nhớ: Tính **sản phẩm** thực tế thì **NHÂN $\\frac{H}{100}$**; tính **nguyên liệu** cần lấy thực tế thì **CHIA $\\frac{H}{100}$**.',
    keyFormulas: [
      '\\frac{n_A}{a} < \\frac{n_B}{b} \\implies A \\text{ hết},\\ B \\text{ dư}',
      'H\\% = \\frac{n_{\\text{thực tế}}}{n_{\\text{lí thuyết}}} \\cdot 100\\%'
    ],
    sim2d: 'stoichiometry_gas_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'KHTN 8 · Chất dư – hết',
      question: 'Đốt $0{,}2\\text{ mol}$ $\\text{H}_2$ với $0{,}2\\text{ mol}$ $\\text{O}_2$ theo PTHH $2\\text{H}_2 + \\text{O}_2 \\to 2\\text{H}_2\\text{O}$. Chất nào còn dư sau phản ứng và dư bao nhiêu mol?',
      options: [
        'A. $\\text{H}_2$ dư $0{,}1\\text{ mol}$',
        'B. $\\text{O}_2$ dư $0{,}1\\text{ mol}$',
        'C. Phản ứng vừa đủ',
        'D. $\\text{O}_2$ dư $0{,}05\\text{ mol}$'
      ],
      correctIndex: 1,
      explanation: 'Xét tỉ lệ: $\\frac{0{,}2}{2} = 0{,}1 < \\frac{0{,}2}{1} = 0{,}2 \\implies \\text{H}_2$ hết, $\\text{O}_2$ phản ứng $0{,}1\\text{ mol}$ nên dư $0{,}1\\text{ mol}$.'
    },
    mcq2: {
      source: 'KHTN 8 · Hiệu suất',
      question: 'Nhiệt phân $100\\text{ g}$ đá vôi $\\text{CaCO}_3$ ($M = 100$) thu được $44{,}8\\text{ g}$ vôi sống $\\text{CaO}$ ($M = 56$). Hiệu suất phản ứng là:',
      options: ['A. $75\\%$', 'B. $80\\%$', 'C. $85\\%$', 'D. $90\\%$'],
      correctIndex: 1,
      explanation: 'Lí thuyết $1\\text{ mol}$ $\\text{CaCO}_3$ tạo $56\\text{ g}$ $\\text{CaO}$. Thực tế thu $44{,}8\\text{ g} \\implies H = \\frac{44{,}8}{56} \\cdot 100\\% = 80\\%$.'
    },
    essay: {
      source: 'KHTN 8 · Tính hiệu suất',
      question: 'Từ $6{,}4\\text{ g}$ $\\text{S}$ ($M=32$) đốt trong khí $\\text{O}_2$ dư thu được khí $\\text{SO}_2$ ($M=64$) với hiệu suất đạt $85\\%$. Tính thể tích khí $\\text{SO}_2$ thu được ở điều kiện chuẩn ĐKC ($24{,}79\\text{ L/mol}$).',
      hints: ['Tính $n_S = 6{,}4 / 32 = 0{,}2\\text{ mol}$, rồi nhân với $0{,}85$ ra $n_{\\text{SO}_2}$ thực tế.'],
      solutionSteps: [
        'PTHH: $\\text{S} + \\text{O}_2 \\xrightarrow{t^\\circ} \\text{SO}_2$.',
        'Số mol S ban đầu: $n_S = \\frac{6{,}4}{32} = 0{,}2\\text{ mol}$.',
        'Số mol $\\text{SO}_2$ thực tế ($H = 85\\%$): $n_{\\text{SO}_2} = 0{,}2 \\cdot 0{,}85 = 0{,}17\\text{ mol}$.',
        'Thể tích khí ở ĐKC: $V = 0{,}17 \\cdot 24{,}79 = 4{,}2143\\text{ lít}$.'
      ],
      finalAnswer: '$V_{\\text{SO}_2} = 4{,}214\\text{ lít}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-8-b9',
    track: 'khong_chuyen',
    grade: 'Lớp 8',
    stageLabel: 'KHTN 8 · Thực hành pH & Nhận biết Dung dịch',
    sourceTag: SRC_2018_8,
    lessonNumber: 9,
    title: 'Bài 9: Thực hành Đo pH Đất – Nước, Chuẩn độ Trung hòa & Nhận biết Mất nhãn',
    subtitle: 'Dùng giấy pH/chất chỉ thị tự nhiên (bắp cải tím) và thuốc thử BaCl₂ – AgNO₃ phân biệt các dung dịch vô cơ',
    description:
      'Tổng hợp kĩ năng phòng thí nghiệm Hóa học lớp 8: pha chế dung dịch, đo pH, nhỏ giọt chuẩn độ 3D và giải bài tập nhận biết mất nhãn.',
    theory1Heading: '1. Đo pH & Phản ứng Trung hòa Acid – Base',
    theory1:
      '• Phản ứng trung hòa: **$\\text{Acid} + \\text{Base} \\to \\text{Muối} + \\text{H}_2\\text{O}$** đưa $\\text{pH}$ tiến về mức trung tính **$7$**.\n• Đất trồng bị chua ($\\text{pH} < 5$) được bón **vôi bột ($\\text{CaO}$ / $\\text{Ca(OH)}_2$)** để khử chua nâng $\\text{pH}$.',
    theory2Heading: '2. Thuốc thử vàng Nhận biết các dung dịch mất nhãn',
    theory2:
      '• Bước 1: Dùng **Quỳ tím** chia 3 nhóm: Đỏ (Acid: $\\text{HCl}, \\text{H}_2\\text{SO}_4$), Xanh (Base tan: $\\text{NaOH}, \\text{Ba(OH)}_2$), Tím (Muối trung tính: $\\text{NaCl}, \\text{Na}_2\\text{SO}_4$).\n• Bước 2: Dùng **$\\text{BaCl}_2$** nhận gốc $\\text{SO}_4^{2-}$ (kết tủa trắng $\\text{BaSO}_4\\downarrow$) và **$\\text{AgNO}_3$** nhận gốc $\\text{Cl}^-$ (kết tủa trắng $\\text{AgCl}\\downarrow$).',
    keyFormulas: [
      '\\text{Ba}^{2+} + \\text{SO}_4^{2-} \\to \\text{BaSO}_4\\downarrow \\text{ (trắng)}',
      '\\text{Ag}^+ + \\text{Cl}^- \\to \\text{AgCl}\\downarrow \\text{ (trắng)}'
    ],
    sim2d: 'qualitative_ion_2d',
    sim3d: 'titration_bench_3d',
    mcq1: {
      source: 'KHTN 8 · Nhận biết hóa chất',
      question: 'Chỉ dùng MỘT thuốc thử duy nhất nào dưới đây để phân biệt được 3 dung dịch $\\text{H}_2\\text{SO}_4$, $\\text{NaOH}$ và $\\text{BaCl}_2$?',
      options: ['A. Nước cất', 'B. Quỳ tím (sau đó trộn chéo các dung dịch với nhau)', 'C. Khí Oxygen', 'D. Đồng kim loại'],
      correctIndex: 1,
      explanation: 'Quỳ tím nhận ra $\\text{H}_2\\text{SO}_4$ (đỏ), $\\text{NaOH}$ (xanh) và $\\text{BaCl}_2$ (không đổi màu).'
    },
    mcq2: {
      source: 'KHTN 8 · pH nông nghiệp',
      question: 'Nước ép bắp cải tím có màu tím ở $\\text{pH}=7$, hóa đỏ hồng trong chanh và hóa xanh lục trong xà phòng. Nhỏ nước bắp cải tím vào giấm ăn sẽ thấy màu gì?',
      options: ['A. Đỏ hồng', 'B. Xanh lục', 'C. Vàng cam', 'D. Không màu'],
      correctIndex: 0,
      explanation: 'Giấm ăn chứa acetic acid ($\text{pH} < 7$) làm chỉ thị bắp cải tím chuyển màu đỏ hồng.'
    },
    essay: {
      source: 'KHTN 8 · Bài toán nhận biết',
      question: 'Nêu cách nhận biết 3 lọ dung dịch mất nhãn: $\\text{HCl}$, $\\text{H}_2\\text{SO}_4$ và $\\text{Na}_2\\text{SO}_4$. Viết PTHH minh họa.',
      hints: ['Dùng quỳ tím tách riêng muối $\\text{Na}_2\\text{SO}_4$, rồi dùng $\\text{BaCl}_2$ phân biệt 2 axit.'],
      solutionSteps: [
        'Trích mẫu thử đánh số. Nhúng **quỳ tím** vào 3 mẫu: mẫu không đổi màu là $\\text{Na}_2\\text{SO}_4$; hai mẫu làm quỳ hóa đỏ là $\\text{HCl}$ và $\\text{H}_2\\text{SO}_4$.',
        'Nhỏ dung dịch **$\\text{BaCl}_2$** vào 2 mẫu acid: mẫu xuất hiện **kết tủa trắng** là $\\text{H}_2\\text{SO}_4$ ($\\text{H}_2\\text{SO}_4 + \\text{BaCl}_2 \\to \\text{BaSO}_4\\downarrow + 2\\text{HCl}$); mẫu còn lại không hiện tượng là $\\text{HCl}$.'
      ],
      finalAnswer: 'Dùng quỳ tím nhận $\\text{Na}_2\\text{SO}_4$, rồi dùng $\\text{BaCl}_2$ phân biệt $\\text{H}_2\\text{SO}_4$ (kết tủa trắng) với $\\text{HCl}$.'
    }
  }),

  // ============================================================================
  // 2. GDPT 2006 — BỔ SUNG ĐẦY ĐỦ CẦU NỐI LỚP 6–7 & CHƯƠNG TRÌNH LỚP 8
  // ============================================================================
  makeChemLesson({
    id: 'chem-2006-6-4',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Ba thể & Sự chuyển thể)',
    sourceTag: SRC_2006_6,
    lessonNumber: 4,
    title: 'Ba thể Rắn – Lỏng – Khí & Sự chuyển thể của Chất (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Giải thích hình dạng – thể tích ở 3 thể và 4 quá trình Nóng chảy, Đông đặc, Bay hơi, Ngưng tụ',
    description:
      'Làm quen sớm mô hình hạt phân tử ở 3 trạng thái để kết nối giữa Vật lí – Sinh học lớp 6 hệ 2006 và Hóa học 8.',
    theory1Heading: '1. Đặc điểm hạt phân tử ở 3 thể Rắn – Lỏng – Khí',
    theory1:
      '• **Thể rắn**: hạt xếp khít có trật tự, chỉ dao động tại chỗ $\\to$ **hình dạng và thể tích xác định**, khó nén.\n• **Thể lỏng**: hạt sát nhau nhưng trượt lên nhau $\\to$ **thể tích xác định**, hình dạng theo bình chứa.\n• **Thể khí**: hạt ở rất xa, bay tự do hỗn loạn $\\to$ **dễ bị nén** và lan tỏa kín bình.',
    theory2Heading: '2. Bốn quá trình chuyển thể thuận nghịch',
    theory2:
      '• **Cung cấp nhiệt**: Rắn $\\xrightarrow{\\text{Nóng chảy}}$ Lỏng $\\xrightarrow{\\text{Bay hơi / Sôi}}$ Khí.\n• **Tỏa nhiệt (làm lạnh)**: Khí $\\xrightarrow{\\text{Ngưng tụ}}$ Lỏng $\\xrightarrow{\\text{Đông đặc}}$ Rắn.',
    keyFormulas: [
      '\\text{Rắn} \\xrightleftharpoons[\\text{Đông đặc}]{\\text{Nóng chảy}} \\text{Lỏng} \\xrightleftharpoons[\\text{Ngưng tụ}]{\\text{Bay hơi}} \\text{Khí}'
    ],
    sim2d: 'states_of_matter_2d',
    sim3d: 'matter_states_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Vì sao không khí trong bơm xe đạp có thể bị nén lại dễ dàng, còn nước lỏng trong xi-lanh gần như không nén được?',
      options: [
        'A. Vì các hạt khí nằm cách xa nhau có nhiều khoảng trống, còn hạt chất lỏng nằm sát nhau',
        'B. Vì hạt khí nhẹ hơn không có khối lượng',
        'C. Vì nước lỏng không có phân tử',
        'D. Vì xi-lanh hút không khí'
      ],
      correctIndex: 0,
      explanation: 'Khoảng cách giữa các phân tử chất khí rất lớn nên dễ ép chúng lại gần nhau.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Hiện tượng giọt sương đọng trên lá cỏ vào sáng sớm mùa thu là quá trình chuyển thể nào?',
      options: ['A. Nóng chảy', 'B. Đông đặc', 'C. Ngưng tụ (hơi nước gặp lạnh thành lỏng)', 'D. Bay hơi'],
      correctIndex: 2,
      explanation: 'Hơi nước trong không khí ban đêm gặp lá lạnh ngưng tụ thành giọt nước.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Nêu 3 yếu tố làm tăng tốc độ bay hơi của nước khi phơi quần áo ướt ngoài sân.',
      hints: ['Gió, nhiệt độ (nắng), diện tích mặt thoáng (giũ phẳng).'],
      solutionSteps: [
        '(1) **Nhiệt độ cao**: phơi ngoài nắng ấm giúp phân tử nước thoát ra nhanh.',
        '(2) **Gió thổi**: cuốn hơi nước đi tránh bão hòa quanh sợi vải.',
        '(3) **Diện tích mặt thoáng lớn**: trải phẳng quần áo ra móc giúp hơi nước thoát đều.'
      ],
      finalAnswer: 'Tăng nhiệt độ, có gió thổi và tăng diện tích mặt thoáng.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-6-5',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Vật liệu – Tài nguyên)',
    sourceTag: SRC_2006_6,
    lessonNumber: 5,
    title: 'Kim loại, Thủy tinh, Gốm, Chất dẻo & Luyện kim (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Nhận diện tính chất vật liệu thông dụng, nguồn gốc quặng sắt – đá vôi và tái chế 3R bảo vệ môi trường',
    description:
      'Gắn kết kiến thức vật liệu xây dựng – đồ gia dụng với quy trình lò cao nấu quặng sắt và tái chế nhựa an toàn.',
    theory1Heading: '1. Nhóm Vật liệu phổ biến quanh em',
    theory1:
      '• **Kim loại** (sắt, đồng, nhôm): dẫn điện – nhiệt tốt, ánh kim, dễ dát mỏng; cần sơn chống gỉ cho sắt.\n• **Thủy tinh & Gốm sứ**: cứng, giòn, không gỉ, cách điện tốt.\n• **Chất dẻo (nhựa)**: nhẹ, bền, cách điện nhưng rất khó phân hủy ngoài môi trường.',
    theory2Heading: '2. Từ Quặng tự nhiên tới Sản phẩm Công nghiệp',
    theory2:
      '• **Quặng sắt ($\\text{Fe}_2\\text{O}_3$)** nung trong lò cao tạo gang thép; **Đá vôi ($\\text{CaCO}_3$)** nung thành vôi sống và xi măng; **Cát thạch anh ($\\text{SiO}_2$)** nấu thành thủy tinh.',
    keyFormulas: [
      '\\text{Quặng sắt } (\\text{Fe}_2\\text{O}_3) \\xrightarrow{\\text{Lò cao}} \\text{Gang / Thép}'
    ],
    sim2d: 'metallurgy_furnace_2d',
    sim3d: 'matter_states_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Vì sao dây dẫn điện lõi bằng Đồng và Nhôm nhưng vỏ bọc ngoài lại làm bằng Chất dẻo (PVC)?',
      options: [
        'A. Kim loại dẫn điện tốt, còn chất dẻo cách điện an toàn cho người chạm vào',
        'B. Chất dẻo dẫn điện mạnh hơn đồng',
        'C. Nhôm cách điện hoàn toàn',
        'D. Để dây điện nặng hơn'
      ],
      correctIndex: 0,
      explanation: 'Lõi kim loại dẫn dòng điện, vỏ nhựa PVC cách điện và chống ẩm bảo vệ an toàn.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Hành động nào tuân thủ quy tắc **3R (Tiết giảm – Tái sử dụng – Tái chế)** đối với rác thải nhựa?',
      options: [
        'A. Đốt túi nilon ngay sau nhà',
        'B. Dùng bình nước cá nhân thay chai nhựa dùng một lần và phân loại chai cũ để tái chế',
        'C. Vứt túi nilon xuống sông',
        'D. Chôn lấp tất cả nhựa chung với thức ăn thừa'
      ],
      correctIndex: 1,
      explanation: 'Dùng bình cá nhân là Tiết giảm (Reduce) và phân loại rác nhựa giúp Tái chế (Recycle).'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Tại sao không nên dùng nồi nhôm để nấu hoặc đựng canh chua, dưa muối lâu ngày?',
      hints: ['Axit hữu cơ trong canh chua và muối ăn phản ứng ăn mòn dần lớp oxit bảo vệ của nhôm.'],
      solutionSteps: [
        'Canh chua, dưa muối chứa axit hữu cơ và muối ăn.',
        'Các chất này hòa tan lớp màng oxit mỏng bảo vệ rồi ăn mòn kim loại nhôm tạo muối nhôm hòa lẫn vào thức ăn, gây hại sức khỏe và làm thủng nồi.'
      ],
      finalAnswer: 'Axit và muối ăn mòn kim loại nhôm, làm hỏng nồi và nhiễm tạp chất vào thức ăn.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-6-6',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Dung dịch & Hòa tan)',
    sourceTag: SRC_2006_6,
    lessonNumber: 6,
    title: 'Chất tan – Dung môi, Dung dịch – Huyền phù – Nhũ tương (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Vì sao đường tan nhanh hơn trong nước nóng và phân biệt nước đường – nước phù sa – nước sốt dầu giấm',
    description:
      'Khám phá quá trình hòa tan chất rắn trong cốc nước qua mô phỏng độ tan 2D và bình khuấy dung dịch 3D.',
    theory1Heading: '1. Phân biệt Dung dịch – Huyền phù – Nhũ tương',
    theory1:
      '• **Dung dịch**: hỗn hợp đồng nhất giữa **chất tan** và **dung môi** (nước đường, nước muối lọc trong suốt, không lắng cặn).\n• **Huyền phù**: hạt **chất rắn không tan** lơ lửng trong chất lỏng (nước phù sa, bột sắn pha sống).\n• **Nhũ tương**: giọt **chất lỏng không tan** lơ lửng trong chất lỏng khác (sữa, dầu ăn lắc mạnh trong nước).',
    theory2Heading: '2. Ba cách giúp chất rắn hòa tan nhanh hơn',
    theory2:
      '• (1) **Khuấy đều** dung dịch, (2) **Đun nóng** dung môi (hạt chuyển động nhanh), (3) **Nghiền nhỏ** chất rắn (tăng diện tích tiếp xúc với nước).',
    keyFormulas: [
      '\\text{Dung dịch} = \\text{Chất tan} + \\text{Dung môi (đồng nhất)}'
    ],
    sim2d: 'solution_solubility_2d',
    sim3d: 'solution_mixing_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Cốc nước sông đục ngầu có các hạt đất mịn lơ lửng, để yên một lúc lắng cặn xuống đáy thuộc loại nào?',
      options: ['A. Dung dịch đồng nhất', 'B. Huyền phù', 'C. Chất tinh khiết', 'D. Nhũ tương'],
      correctIndex: 1,
      explanation: 'Hạt rắn (đất phù sa) lơ lửng không tan trong nước lỏng gọi là huyền phù.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Cách nào giúp viên đường phèn to tan nhanh NHẤT vào cốc nước lọc?',
      options: [
        'A. Thả nguyên viên vào nước đá lạnh và để yên',
        'B. Giã nhỏ đường phèn, pha với nước ấm và khuấy đều bằng thìa',
        'C. Bỏ vào tủ lạnh',
        'D. Không khuấy'
      ],
      correctIndex: 1,
      explanation: 'Kết hợp cả 3 yếu tố: nghiền nhỏ + tăng nhiệt độ + khuấy đều giúp hòa tan nhanh nhất.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Kể 2 chất tan tốt trong dầu ăn/xăng nhưng KHÔNG tan trong nước, và nêu ứng dụng tẩy vết bẩn.',
      hints: ['Dầu mỡ máy, sáp nến hoặc vết nhựa cây không tan trong nước nhưng tan trong dầu hỏa/cồn.'],
      solutionSteps: [
        'Ví dụ: **dầu mỡ xe máy** và **sáp nến/nhựa đường** không tan trong nước.',
        'Ứng dụng: khi áo dính vết dầu mỡ hoặc nhựa cây, dùng dầu hỏa, cồn hoặc nước rửa chén (chất hoạt động bề mặt) hòa tan trước khi giặt bằng nước.'
      ],
      finalAnswer: 'Dầu mỡ, sáp nến không tan trong nước nhưng tan trong dung môi hữu cơ như dầu hỏa/cồn.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-6-7',
    track: 'gdpt_2006',
    grade: 'Lớp 6',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 6 (Thực hành Tách chất)',
    sourceTag: SRC_2006_6,
    lessonNumber: 7,
    title: 'Thực hành Lọc – Cô cạn – Chiết & Làm sạch Nước đơn giản (Cầu nối Lớp 6 hệ 2006)',
    subtitle: 'Lắp phễu giấy lọc, đèn cồn cô cạn và cột lọc nước bằng cát – sỏi – than hoạt tính',
    description:
      'Thực hành tổng hợp tách chất trong phòng thí nghiệm kết nối ứng dụng xử lí nước sạch gia đình.',
    theory1Heading: '1. Nguyên tắc Lắp dụng cụ Lọc & Cô cạn',
    theory1:
      '• **Lọc**: gấp giấy lọc 4 phần đặt vào phễu, rót hỗn hợp nhẹ theo đũa thủy tinh tránh rách giấy lọc.\n• **Cô cạn**: dùng bát sứ đun nhẹ cho nước bay hơi hết thu chất rắn khó bay hơi (như muối ăn).',
    theory2Heading: '2. Bể lọc nước thô (Sỏi – Cát – Than hoạt tính)',
    theory2:
      '• Tầng **sỏi và cát** lọc giữ rác, phù sa lơ lửng; tầng **than hoạt tính** hấp phụ màu và mùi hôi khó chịu trong nước.',
    keyFormulas: [
      '\\text{Bể lọc: Sỏi/Cát (lọc cặn)} + \\text{Than hoạt tính (khử mùi/màu)}'
    ],
    sim2d: 'mixture_separation_2d',
    sim3d: 'separation_lab_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Trong cột lọc nước mini, lớp **than hoạt tính** có tác dụng chính gì?',
      options: [
        'A. Làm nước ngọt hơn bằng cách hòa tan muối',
        'B. Hấp phụ các chất gây màu, mùi hôi và tạp chất hữu cơ nhỏ',
        'C. Làm tăng độ đục của nước',
        'D. Đun sôi nước'
      ],
      correctIndex: 1,
      explanation: 'Than hoạt tính có cấu trúc xốp rỗng diện tích bề mặt cực lớn nên hấp phụ mùi và chất màu rất tốt.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Có tách được Muối ăn hòa tan hoàn toàn trong nước bằng cách đổ qua giấy lọc thông thường không?',
      options: [
        'A. Có, muối bị giữ hết trên giấy lọc',
        'B. Không, vì hạt muối hòa tan siêu nhỏ đi qua lỗ giấy lọc; phải dùng phương pháp CÔ CẠN',
        'C. Tách được bằng nam châm',
        'D. Tách được bằng phễu chiết'
      ],
      correctIndex: 1,
      explanation: 'Ion/phân tử chất tan nhỏ hơn lỗ giấy lọc hàng nghìn lần nên đi lọt hết qua giấy lọc.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 6',
      question: 'Nước sau khi đi qua bể lọc cát – than hoạt tính đã trong và hết mùi. Có uống trực tiếp ngay không cần đun sôi được không? Vì sao?',
      hints: ['Vi khuẩn và virus siêu nhỏ vẫn có thể lọt qua cát và than hoạt tính.'],
      solutionSteps: [
        '**Không nên uống trực tiếp ngay** nước mới qua bể lọc cát – than thủ công.',
        'Vì lỗ hở giữa các hạt cát/than không thể diệt hoặc giữ lại hết vi khuẩn, virus gây bệnh; vẫn cần **đun sôi** (hoặc màng lọc RO chuyên dụng) trước khi uống.'
      ],
      finalAnswer: 'Không được, vẫn cần đun sôi để tiêu diệt vi sinh vật gây bệnh.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-7-4',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Biến đổi Chất)',
    sourceTag: SRC_2006_7,
    lessonNumber: 4,
    title: 'Hiện tượng Vật lí vs Hiện tượng Hóa học & Dấu hiệu Phản ứng (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Phân biệt đá tan/dây đồng uốn cong với sắt gỉ/trứng thối/sữa chua lên men và 4 dấu hiệu nhận biết có chất mới',
    description:
      'Bước đệm trực tiếp vào Chương II SGK Hóa học 8 (2006): quan sát sự thay đổi liên kết phân tử trong mô phỏng động học 2D & bề mặt hoạt hóa 3D.',
    theory1Heading: '1. Tiêu chuẩn vàng phân biệt Hiện tượng Vật lí vs Hóa học',
    theory1:
      '• **Hiện tượng vật lí**: KHÔNG sinh ra chất mới (chỉ đổi thể rắn–lỏng–khí, hòa tan, cắt nhỏ, uốn dẻo).\n• **Hiện tượng hóa học**: CÓ sự biến đổi thành **chất mới** mang tính chất khác hẳn chất ban đầu.',
    theory2Heading: '2. Bốn dấu hiệu dễ thấy khi có Phản ứng Hóa học xảy ra',
    theory2:
      '• (1) Đổi màu sắc (quỳ tím hóa đỏ), (2) Xuất hiện **kết tủa** không tan, (3) **Sủi bọt khí**, (4) **Tỏa nhiệt / phát sáng** (đốt pháo hoa, vôi sống gặp nước nóng bốc hơi).',
    keyFormulas: [
      '\\text{Hiện tượng hóa học} \\iff \\text{Có chất mới sinh ra}'
    ],
    sim2d: 'reaction_kinetics_2d',
    sim3d: 'activation_surface_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Quá trình nào dưới đây là HIỆN TƯỢNG HÓA HỌC?',
      options: [
        'A. Hòa tan muối ăn vào cốc nước lọc',
        'B. Thổi thủy tinh nóng chảy thành bình cầu',
        'C. Đốt cháy cây nến parafin tạo khí cacbonic và hơi nước',
        'D. Bẻ cong thanh sắt'
      ],
      correctIndex: 2,
      explanation: 'Khi nến cháy, parafin biến thành $\\text{CO}_2$ và hơi nước (chất mới).'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Dây tóc bóng đèn sợi đốt bằng Vonfram nóng sáng rực khi có dòng điện chạy qua rồi nguội lại vẫn là Vonfram. Đây là:',
      options: ['A. Hiện tượng hóa học', 'B. Hiện tượng vật lí', 'C. Phản ứng phân hủy', 'D. Sự lên men'],
      correctIndex: 1,
      explanation: 'Không có chất mới nào sinh ra, dây tóc vẫn giữ nguyên là kim loại Vonfram.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Khi làm nến (đèn cầy), có cả hiện tượng vật lí lẫn hiện tượng hóa học xảy ra cùng lúc. Hãy chỉ rõ từng giai đoạn.',
      hints: ['Sáp nến chảy lỏng là vật lí; sáp thấm lên bấc cháy thành CO₂ + H₂O là hóa học.'],
      solutionSteps: [
        '**Hiện tượng vật lí**: Sáp nến rắn nóng lên **chảy thành lỏng** (chuyển thể) rồi thấm dọc theo bấc.',
        '**Hiện tượng hóa học**: Sáp lỏng hóa hơi ở ngọn bấc **cháy với khí Oxi** biến thành khí $\\text{CO}_2$ và hơi nước (tạo chất mới).'
      ],
      finalAnswer: 'Sáp chảy lỏng là vật lí; hơi sáp cháy tạo $\\text{CO}_2$ và $\\text{H}_2\\text{O}$ là hóa học.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-7-5',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Bảng Tuần hoàn & Kim loại – Phi kim)',
    sourceTag: SRC_2006_7,
    lessonNumber: 5,
    title: 'Bảng Tuần hoàn & Phân biệt Kim loại – Phi kim – Khí hiếm (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Tra cứu nhanh nguyên tử khối, số hiệu Z và cách phân biệt kim loại (Na, Fe, Cu) với phi kim (C, S, P, Cl)',
    description:
      'Chuẩn bị kĩ năng tra bảng nguyên tố trang 42 SGK Hóa 8 (2006) kết hợp trực quan hóa quy luật tuần hoàn 2D/3D.',
    theory1Heading: '1. Tra cứu Bảng Hệ thống Tuần hoàn rút gọn',
    theory1:
      '• Mỗi ô nguyên tố cho biết **Số hiệu nguyên tử $Z$** (bằng số proton và electron), **Kí hiệu hóa học** và **Nguyên tử khối** ($\\text{H}=1, \\text{C}=12, \\text{N}=14, \\text{O}=16, \\text{Na}=23, \\text{Mg}=24, \\text{Al}=27, \\text{S}=32, \\text{Cl}=35{,}5, \\text{Fe}=56, \\text{Cu}=64$).',
    theory2Heading: '2. Phân biệt Kim loại với Phi kim ở điều kiện thường',
    theory2:
      '• **Kim loại**: ở thể rắn (trừ Thủy ngân $\\text{Hg}$ lỏng), có ánh kim, dẫn điện/nhiệt tốt.\n• **Phi kim**: tồn tại đủ 3 thể (rắn: $\\text{C, S, P}$; lỏng: $\\text{Br}_2$; khí: $\\text{O}_2, \\text{N}_2, \\text{Cl}_2$), không dẫn điện (trừ than chì).',
    keyFormulas: [
      'Z = p = e; \\quad \\text{Nguyên tử khối } (M) \\approx p + n'
    ],
    sim2d: 'periodic_trends_2d',
    sim3d: 'periodic_tower_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Kim loại duy nhất tồn tại ở thể LỎNG trong điều kiện nhiệt độ phòng (thường dùng làm nhiệt kế y tế truyền thống) là:',
      options: ['A. Sắt (Fe)', 'B. Thủy ngân (Hg)', 'C. Nhôm (Al)', 'D. Đồng (Cu)'],
      correctIndex: 1,
      explanation: 'Thủy ngân ($\text{Hg}$) nóng chảy ở $-38{,}8^\\circ\\text{C}$ nên ở thể lỏng tại nhiệt độ thường.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Tính phân tử khối của hợp chất Canxi cacbonat $\\text{CaCO}_3$ (biết $\\text{Ca}=40, \\text{C}=12, \\text{O}=16$):',
      options: ['A. $68\\text{ đvC}$', 'B. $84\\text{ đvC}$', 'C. $100\\text{ đvC}$', 'D. $116\\text{ đvC}$'],
      correctIndex: 2,
      explanation: '$\\text{PTK}(\\text{CaCO}_3) = 40 + 12 + 3 \\cdot 16 = 100\\text{ đvC}$.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Tính phân tử khối của hai hợp chất hay gặp ở Hóa 8: $\\text{H}_2\\text{SO}_4$ và $\\text{Al}_2(\\text{SO}_4)_3$ (biết $\\text{H}=1, \\text{S}=32, \\text{O}=16, \\text{Al}=27$).',
      hints: ['Cộng theo từng nhóm nguyên tử $\\text{SO}_4 = 32 + 4 \\cdot 16 = 96$.'],
      solutionSteps: [
        '$\\text{PTK}(\\text{H}_2\\text{SO}_4) = 2 \\cdot 1 + 32 + 4 \\cdot 16 = 98\\text{ đvC}$.',
        'Nhóm $\\text{SO}_4$ nặng $32 + 64 = 96\\text{ đvC} \\implies \\text{PTK}(\\text{Al}_2(\\text{SO}_4)_3) = 2 \\cdot 27 + 3 \\cdot 96 = 54 + 288 = 342\\text{ đvC}$.'
      ],
      finalAnswer: '$\\text{H}_2\\text{SO}_4 = 98\\text{ đvC}$; $\\text{Al}_2(\\text{SO}_4)_3 = 342\\text{ đvC}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-7-6',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Bảo toàn Khối lượng)',
    sourceTag: SRC_2006_7,
    lessonNumber: 6,
    title: 'Định luật Bảo toàn Khối lượng & Lập Phương trình Hóa học đơn giản (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Vì sao tổng khối lượng trước và sau phản ứng bằng nhau trên cân điện tử và cách đặt hệ số cân bằng chuẩn',
    description:
      'Làm quen trước quy luật cân bằng số nguyên tử trên mô hình cân bảo toàn khối lượng 2D/3D để sẵn sàng bứt tốc Hóa 8.',
    theory1Heading: '1. Giải thích Định luật Bảo toàn Khối lượng ở mức Nguyên tử',
    theory1:
      '• Trong phản ứng hóa học, các nguyên tử **không bị sinh thêm hay mất đi**, chúng chỉ tách ra rồi ghép lại thành phân tử mới.\n• Do khối lượng mỗi nguyên tử giữ nguyên nên **tổng khối lượng các chất tham gia luôn bằng tổng khối lượng các sản phẩm**.',
    theory2Heading: '2. Ba nguyên tắc vàng khi cân bằng sơ đồ phản ứng',
    theory2:
      '• Chỉ thêm **hệ số nguyên** đặt TRƯỚC công thức hóa học.\n• Tuyệt đối **không thay đổi chỉ số chân** trong công thức đúng.\n• Kiểm đếm lại số nguyên tử từng nguyên tố ở hai vế cho bằng nhau.',
    keyFormulas: [
      'm_A + m_B = m_C + m_D'
    ],
    sim2d: 'mass_conservation_2d',
    sim3d: 'mass_balance_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Trong phản ứng $\\text{Mg} + 2\\text{HCl} \\to \\text{MgCl}_2 + \\text{H}_2$, biết $m_{\\text{Mg}} = 2{,}4\\text{ g}$, $m_{\\text{HCl}} = 7{,}3\\text{ g}$, $m_{\\text{MgCl}_2} = 9{,}5\\text{ g}$. Khối lượng khí $\\text{H}_2$ thoát ra là:',
      options: ['A. $0{,}2\\text{ g}$', 'B. $0{,}4\\text{ g}$', 'C. $1{,}0\\text{ g}$', 'D. $2{,}0\\text{ g}$'],
      correctIndex: 0,
      explanation: '$m_{\\text{H}_2} = (2{,}4 + 7{,}3) - 9{,}5 = 9{,}7 - 9{,}5 = 0{,}2\\text{ g}$.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Hệ số cân bằng lần lượt cho sơ đồ $\\text{Na} + \\text{O}_2 \\to \\text{Na}_2\\text{O}$ là:',
      options: ['A. $2, 1, 1$', 'B. $4, 1, 2$', 'C. $1, 1, 1$', 'D. $2, 2, 2$'],
      correctIndex: 1,
      explanation: '$4\\text{Na} + \\text{O}_2 \\to 2\\text{Na}_2\\text{O}$ (4 Na và 2 O mỗi vế).'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Khi nung một lá Đồng ngoài không khí, người ta thấy khối lượng lá Đồng sau khi nung TĂNG lên. Điều này có vi phạm Định luật Bảo toàn Khối lượng không? Giải thích.',
      hints: ['Lá đồng đã kết hợp thêm khí Oxi từ không khí tạo thành lớp Đồng(II) oxit CuO màu đen.'],
      solutionSteps: [
        'Không hề vi phạm Định luật Bảo toàn Khối lượng.',
        'Vì khi nung, Đồng đã phản ứng với khí Oxi trong không khí theo PTHH $2\\text{Cu} + \\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{CuO}$, nên khối lượng chất rắn tăng đúng bằng khối lượng khí Oxi đã phản ứng vào.'
      ],
      finalAnswer: 'Không vi phạm; phần khối lượng tăng thêm chính là khối lượng khí Oxi đã kết hợp.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-7-7',
    track: 'gdpt_2006',
    grade: 'Lớp 7',
    stageLabel: 'GDPT 2006 · Cầu nối Lớp 7 (Làm quen Mol)',
    sourceTag: SRC_2006_7,
    lessonNumber: 7,
    title: 'Khái niệm Mol, Khối lượng Mol ($M$) & Quy đổi Khối lượng – Thể tích khí đktc (Cầu nối Lớp 7 hệ 2006)',
    subtitle: 'Hiểu trực quan 1 mol = $6\\cdot 10^{23}$ hạt và cách chuyển đổi giữa số gam $m$ với số mol $n$ chuẩn SGK 2006',
    description:
      'Làm quen công thức quan trọng nhất của Hóa học THCS trước khi vào Chương III SGK Hóa 8 (2006).',
    theory1Heading: '1. Mol là gì? Khối lượng mol ($M$) tính thế nào?',
    theory1:
      '• Vì nguyên tử vô cùng nhỏ bé nên nhà hóa học đếm theo nhóm lớn gọi là **mol**: **$1\\text{ mol} = 6 \\cdot 10^{23}$** hạt nguyên tử/phân tử.\n• **Khối lượng mol ($M$, đơn vị g/mol)** của một chất có giá trị bằng đúng nguyên tử khối/phân tử khối chất đó (Ví dụ: $M_{\\text{H}_2\\text{O}} = 18\\text{ g/mol}$).',
    theory2Heading: '2. Hai công thức bỏ túi chuyển đổi Mol',
    theory2:
      '• Từ khối lượng: **$n = \\frac{m}{M} \\iff m = n \\cdot M$**.\n• Từ thể tích chất khí ở đktc ($0^\\circ\\text{C}, 1\\text{ atm}$ hệ 2006): **$n = \\frac{V}{22{,}4} \\iff V = 22{,}4 \\cdot n$**.',
    keyFormulas: [
      'n = \\frac{m}{M}; \\quad V_{\\text{đktc}} = 22{,}4 \\cdot n'
    ],
    sim2d: 'stoichiometry_gas_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Khối lượng của $0{,}5\\text{ mol}$ phân tử nước $\\text{H}_2\\text{O}$ ($M = 18\\text{ g/mol}$) là:',
      options: ['A. $9\\text{ g}$', 'B. $18\\text{ g}$', 'C. $36\\text{ g}$', 'D. $4{,}5\\text{ g}$'],
      correctIndex: 0,
      explanation: '$m = n \\cdot M = 0{,}5 \\cdot 18 = 9\\text{ g}$.'
    },
    mcq2: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Ở điều kiện tiêu chuẩn (đktc 2006), $4{,}48\\text{ lít}$ khí $\\text{CO}_2$ ứng với bao nhiêu mol?',
      options: ['A. $0{,}1\\text{ mol}$', 'B. $0{,}2\\text{ mol}$', 'C. $0{,}4\\text{ mol}$', 'D. $0{,}5\\text{ mol}$'],
      correctIndex: 1,
      explanation: '$n = \\frac{4{,}48}{22{,}4} = 0{,}2\\text{ mol}$.'
    },
    essay: {
      source: 'Cầu nối Hóa 2006 · Lớp 7',
      question: 'Tính số mol và thể tích ở đktc ($22{,}4\\text{ L/mol}$) của $8{,}8\\text{ g}$ khí $\\text{CO}_2$ ($\\text{C}=12, \\text{O}=16$).',
      hints: ['Tính $M_{\\text{CO}_2} = 44\\text{ g/mol}$, rồi suy ra $n$ và $V$.'],
      solutionSteps: [
        'Khối lượng mol $\\text{CO}_2$: $M = 12 + 2 \\cdot 16 = 44\\text{ g/mol}$.',
        'Số mol: $n = \\frac{8{,}8}{44} = 0{,}2\\text{ mol}$.',
        'Thể tích ở đktc: $V = 0{,}2 \\cdot 22{,}4 = 4{,}48\\text{ lít}$.'
      ],
      finalAnswer: '$n = 0{,}2\\text{ mol}$; $V = 4{,}48\\text{ lít}$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-7',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Ôn tập Hóa trị & Công thức',
    sourceTag: SRC_2006_8,
    lessonNumber: 7,
    title: 'Chuyên đề (Hóa 8 2006): Quy tắc Hóa trị, Lập CTHH & Tìm CTHH từ % Nguyên tố',
    subtitle: 'Giải thành thạo bài toán ngược tìm CTHH khi biết phần trăm khối lượng nguyên tố và Phân tử khối',
    description:
      'Củng cố trọng tâm Chương I–III SGK Hóa học 8 (2006): lập công thức theo hóa trị và suy luận công thức hóa học qua tỉ lệ mol nguyên tử.',
    theory1Heading: '1. Ba bước tìm Công thức Hóa học khi biết % Khối lượng',
    theory1:
      '• Bước 1: Tính khối lượng từng nguyên tố trong $1\\text{ mol}$ hợp chất: $m_A = M \\cdot \\frac{\\%A}{100}$.\n• Bước 2: Chia cho nguyên tử khối tìm số mol (chỉ số nguyên tử): $x = \\frac{m_A}{M_A}$.\n• Bước 3: Viết CTHH $A_x B_y$ và kiểm tra lại tổng phân tử khối.',
    theory2Heading: '2. Hóa trị của một số Nhóm nguyên tử thường gặp',
    theory2:
      '• Hóa trị I: **$\\text{-OH}$**, **$\\text{-NO}_3$**, $\\text{-Cl}$.\n• Hóa trị II: **$=\\text{SO}_4$**, **$=\\text{CO}_3$**, $=\\text{SO}_3$.\n• Hóa trị III: **$\\equiv\\text{PO}_4$**.',
    keyFormulas: [
      'x = \\frac{M_{\\text{hợp chất}} \\cdot \\%A}{100 \\cdot M_A}'
    ],
    sim2d: 'bohr_shells_2d',
    sim3d: 'ionic_covalent_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Chuyên đề CTHH',
      question: 'Công thức hóa học đúng của Sắt(III) sunfat tạo bởi $\\text{Fe}$ (III) và nhóm $\\text{SO}_4$ (II) là:',
      options: ['A. $\\text{FeSO}_4$', 'B. $\\text{Fe}_2(\\text{SO}_4)_3$', 'C. $\\text{Fe}_3(\\text{SO}_4)_2$', 'D. $\\text{Fe}_2\\text{SO}_4$'],
      correctIndex: 1,
      explanation: 'Áp dụng quy tắc chéo: $x=2, y=3 \\implies \\text{Fe}_2(\\text{SO}_4)_3$.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Tìm CTHH',
      question: 'Một oxit của Sắt có phân tử khối $M = 160\\text{ đvC}$, trong đó Sắt ($\text{Fe}=56$) chiếm $70\\%$ khối lượng. Công thức của oxit là:',
      options: ['A. $\\text{FeO}$', 'B. $\\text{Fe}_2\\text{O}_3$', 'C. $\\text{Fe}_3\\text{O}_4$', 'D. $\\text{FeO}_2$'],
      correctIndex: 1,
      explanation: '$m_{\\text{Fe}} = 160 \\cdot 70\\% = 112 \\implies x = 112/56 = 2$; $m_{\\text{O}} = 48 \\implies y = 3 \\implies \\text{Fe}_2\\text{O}_3$.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Bài toán CTHH',
      question: 'Hợp chất $A$ chứa $40\\%$ Cu, $20\\%$ S và $40\\%$ O về khối lượng, biết khối lượng mol $M_A = 160\\text{ g/mol}$. Lập CTHH của $A$ ($\\text{Cu}=64, \\text{S}=32, \\text{O}=16$).',
      hints: ['Tính số mol mỗi nguyên tử trong $1\\text{ mol}$ hợp chất ($160\\text{ g}$).'],
      solutionSteps: [
        '$n_{\\text{Cu}} = \\frac{160 \\cdot 40\\%}{64} = 1$.',
        '$n_{\\text{S}} = \\frac{160 \\cdot 20\\%}{32} = 1$.',
        '$n_{\\text{O}} = \\frac{160 \\cdot 40\\%}{16} = 4$.',
        'Vậy công thức hóa học của $A$ là $\\text{CuSO}_4$ (Đồng(II) sunfat).'
      ],
      finalAnswer: 'Công thức hóa học: $\\text{CuSO}_4$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-8',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Toán Dư – Hết & Hiệu suất',
    sourceTag: SRC_2006_8,
    lessonNumber: 8,
    title: 'Chuyên đề (Hóa 8 2006): Bài toán Lượng chất Dư – Hết & Hiệu suất Phản ứng',
    subtitle: 'Giải trọn vẹn dạng toán biết đồng thời lượng 2 chất tham gia và tính lượng chất còn lại sau phản ứng',
    description:
      'Dạng bài tập trọng tâm thi học kì và học sinh giỏi lớp 8 hệ 2006 kết hợp mô phỏng bình phản ứng khí 2D/3D.',
    theory1Heading: '1. Phương pháp 3 dòng cho Bài toán Chất dư – Hết',
    theory1:
      '• Viết PTHH cân bằng.\n• Lập tỉ số $\\frac{n_1}{\\text{hệ số } 1}$ và $\\frac{n_2}{\\text{hệ số } 2}$; bên nào **nhỏ hơn** là **chất hết**.\n• Ghi 3 dòng: **Ban đầu – Phản ứng – Sau phản ứng** (mọi cột ở dòng Phản ứng tính theo chất hết!).',
    theory2Heading: '2. Tính khối lượng chất rắn sau phản ứng & Hiệu suất',
    theory2:
      '• Lưu ý nếu đốt chất rắn hoặc khử oxit bằng $\\text{H}_2$ không hoàn toàn ($H < 100\\%$), chất rắn sau phản ứng gồm cả sản phẩm mới tạo thành VÀ chất rắn ban đầu còn dư.',
    keyFormulas: [
      'n_{\\text{sau}} = n_{\\text{ban đầu}} - n_{\\text{phản ứng}}; \\quad H\\% = \\frac{n_{\\text{pư thực tế}}}{n_{\\text{pư tối đa}}} \\cdot 100\\%'
    ],
    sim2d: 'stoichiometry_gas_2d',
    sim3d: 'equilibrium_piston_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Toán chất dư',
      question: 'Cho $5{,}4\\text{ g}$ Nhôm ($\\text{Al}=27$) vào dung dịch chứa $0{,}4\\text{ mol}$ $\\text{HCl}$ theo PTHH $2\\text{Al} + 6\\text{HCl} \\to 2\\text{AlCl}_3 + 3\\text{H}_2\\uparrow$. Thể tích khí $\\text{H}_2$ thu được ở đktc ($22{,}4\\text{ L/mol}$) là:',
      options: ['A. $6{,}72\\text{ lít}$', 'B. $4{,}48\\text{ lít}$', 'C. $3{,}36\\text{ lít}$', 'D. $2{,}24\\text{ lít}$'],
      correctIndex: 1,
      explanation: '$n_{\\text{Al}} = 0{,}2$. So sánh $\\frac{0{,}2}{2} = 0{,}1 > \\frac{0{,}4}{6} \\approx 0{,}067 \\implies \\text{HCl}$ hết! $n_{\\text{H}_2} = \\frac{0{,}4}{2} = 0{,}2 \\implies V = 4{,}48\\text{ L}$.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Hiệu suất',
      question: 'Nung $50\\text{ g}$ $\\text{CaCO}_3$ với hiệu suất $90\\%$ thu được bao nhiêu mol khí $\\text{CO}_2$?',
      options: ['A. $0{,}5\\text{ mol}$', 'B. $0{,}45\\text{ mol}$', 'C. $0{,}4\\text{ mol}$', 'D. $0{,}9\\text{ mol}$'],
      correctIndex: 1,
      explanation: '$n_{\\text{CaCO}_3} = 0{,}5\\text{ mol} \\implies n_{\\text{CO}_2} = 0{,}5 \\cdot 90\\% = 0{,}45\\text{ mol}$.'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Toán tổng hợp',
      question: 'Đốt cháy $6{,}2\\text{ g}$ Photpho ($\text{P}=31$) trong bình chứa $6{,}72\\text{ lít}$ khí $\\text{O}_2$ (đktc, $22{,}4\\text{ L/mol}$). Tính khối lượng $\\text{P}_2\\text{O}_5$ tạo thành và chất nào còn dư.',
      hints: ['PTHH $4\\text{P} + 5\\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{P}_2\\text{O}_5$.'],
      solutionSteps: [
        '$n_{\\text{P}} = \\frac{6{,}2}{31} = 0{,}2\\text{ mol}$; $n_{\\text{O}_2} = \\frac{6{,}72}{22{,}4} = 0{,}3\\text{ mol}$.',
        'So sánh tỉ lệ: $\\frac{0{,}2}{4} = 0{,}05 < \\frac{0{,}3}{5} = 0{,}06 \\implies \\text{P}$ phản ứng hết, $\\text{O}_2$ dư.',
        'Số mol $\\text{O}_2$ đã phản ứng: $0{,}2 \\cdot \\frac{5}{4} = 0{,}25\\text{ mol} \\implies$ dư $0{,}05\\text{ mol}$ $\\text{O}_2$.',
        'Số mol $\\text{P}_2\\text{O}_5 = \\frac{0{,}2}{2} = 0{,}1\\text{ mol} \\implies m_{\\text{P}_2\\text{O}_5} = 0{,}1 \\cdot 142 = 14{,}2\\text{ g}$.'
      ],
      finalAnswer: '$m_{\\text{P}_2\\text{O}_5} = 14{,}2\\text{ g}$; dư $0{,}05\\text{ mol}$ $\\text{O}_2$.'
    }
  }),
  makeChemLesson({
    id: 'chem-2006-8-9',
    track: 'gdpt_2006',
    grade: 'Lớp 8',
    stageLabel: 'SGK Hóa 8 (2006) · Tổng ôn 4 Hợp chất Vô cơ',
    sourceTag: SRC_2006_8,
    lessonNumber: 9,
    title: 'Tổng ôn (Hóa 8 2006): Phân loại – Gọi tên Oxit, Axit, Bazơ, Muối & Chuỗi Biến hóa',
    subtitle: 'Hệ thống toàn diện cách gọi tên cũ (2006), làm quỳ tím đổi màu và nối mạch chuyển hóa Oxit ↔ Bazơ/Axit ↔ Muối',
    description:
      'Khép lại trọn vẹn chương trình Hóa học THCS lớp 6–8 hệ 2006 trước khi bước vào Hóa học 9.',
    theory1Heading: '1. Bảng Phân loại & Gọi tên chuẩn SGK 2006',
    theory1:
      '• **Oxit**: Oxit bazơ (đọc kèm hóa trị nếu nhiều hóa trị: *Sắt(III) oxit* $\\text{Fe}_2\\text{O}_3$) & Oxit axit (đọc tiền tố đi, tri, penta: *Lưu huỳnh đioxit* $\\text{SO}_2$).\n• **Axit**: không Oxi đuôi *-hiđric* ($\\text{HCl}$: axit clohiđric); có nhiều Oxi đuôi *-ic* ($\\text{H}_2\\text{SO}_4$: axit sunfuric).\n• **Bazơ**: Tên kim loại (hóa trị) + hiđroxit ($\\text{NaOH}$: natri hiđroxit, $\\text{Fe(OH)}_3$: sắt(III) hiđroxit).\n• **Muối**: Tên kim loại + tên gốc axit ($\\text{NaCl}$: natri clorua, $\\text{CuSO}_4$: đồng(II) sunfat).',
    theory2Heading: '2. Hai sơ đồ chuyển hóa kinh điển chuẩn bị lên Lớp 9',
    theory2:
      '• Dãy Kim loại: $\\text{Na} \\to \\text{Na}_2\\text{O} \\to \\text{NaOH} \\to \\text{NaCl}$.\n• Dãy Phi kim: $\\text{S} \\to \\text{SO}_2 \\to \\text{H}_2\\text{SO}_3 \\to \\text{Na}_2\\text{SO}_3$.',
    keyFormulas: [
      '\\text{Oxit bazơ tan} + \\text{H}_2\\text{O} \\to \\text{Kiềm (quỳ xanh)}',
      '\\text{Oxit axit} + \\text{H}_2\\text{O} \\to \\text{Axit (quỳ đỏ)}'
    ],
    sim2d: 'acid_base_oxide_2d',
    sim3d: 'indicator_bench_3d',
    mcq1: {
      source: 'SGK Hóa 8 (2006) · Gọi tên hợp chất',
      question: 'Theo danh pháp SGK Hóa 8 (2006), tên gọi đúng của $\\text{P}_2\\text{O}_5$ và $\\text{Fe(OH)}_3$ lần lượt là:',
      options: [
        'A. Photpho oxit và Sắt hiđroxit',
        'B. Điphotpho pentaoxit và Sắt(III) hiđroxit',
        'C. Photpho pentaoxit và Sắt(II) hiđroxit',
        'D. Điphotpho oxit và Sắt(III) oxit'
      ],
      correctIndex: 1,
      explanation: '$\\text{P}_2\\text{O}_5$ đọc là Điphotpho pentaoxit; $\\text{Fe}$ trong $\\text{Fe(OH)}_3$ hóa trị III nên đọc Sắt(III) hiđroxit.'
    },
    mcq2: {
      source: 'SGK Hóa 8 (2006) · Chuỗi phản ứng',
      question: 'Oxit nào khi hòa tan vào nước tạo dung dịch làm **quỳ tím chuyển sang màu XANH**?',
      options: ['A. $\\text{CuO}$', 'B. $\\text{CaO}$', 'C. $\\text{SO}_2$', 'D. $\\text{Fe}_2\\text{O}_3$'],
      correctIndex: 1,
      explanation: '$\\text{CaO} + \\text{H}_2\\text{O} \\to \\text{Ca(OH)}_2$ (bazơ kiềm tan làm quỳ hóa xanh).'
    },
    essay: {
      source: 'SGK Hóa 8 (2006) · Chuỗi chuyển hóa',
      question: 'Viết 3 PTHH thực hiện sơ đồ chuyển hóa: $\\text{K} \\xrightarrow{(1)} \\text{K}_2\\text{O} \\xrightarrow{(2)} \\text{KOH} \\xrightarrow{(3)} \\text{KCl}$.',
      hints: ['(1) Cộng $\\text{O}_2$; (2) Cộng $\\text{H}_2\\text{O}$; (3) Cộng axit $\\text{HCl}$.'],
      solutionSteps: [
        '(1) $4\\text{K} + \\text{O}_2 \\xrightarrow{t^\\circ} 2\\text{K}_2\\text{O}$.',
        '(2) $\\text{K}_2\\text{O} + \\text{H}_2\\text{O} \\to 2\\text{KOH}$.',
        '(3) $\\text{KOH} + \\text{HCl} \\to \\text{KCl} + \\text{H}_2\\text{O}$.'
      ],
      finalAnswer: '$4\\text{K}+\\text{O}_2\\to 2\\text{K}_2\\text{O}$; $\\text{K}_2\\text{O}+\\text{H}_2\\text{O}\\to 2\\text{KOH}$; $\\text{KOH}+\\text{HCl}\\to \\text{KCl}+\\text{H}_2\\text{O}$.'
    }
  })
];
