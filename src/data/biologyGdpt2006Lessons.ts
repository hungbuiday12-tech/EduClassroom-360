import { BiologyLesson } from '../types';
import { makeBioLesson } from './biologyGdpt2018Lessons';

export const BIOLOGY_GDPT_2006_LESSONS: BiologyLesson[] = [
  makeBioLesson({
    id: 'bio-2006-9-1',
    track: 'gdpt_2006',
    grade: 'Lớp 9',
    stageLabel: 'GDPT 2006 · Sinh học 9',
    sourceTag: 'SGK Sinh 9 (2006) · Chương I–III: Mendel, NST & DNA',
    lessonNumber: 1,
    title: 'Phả hệ Người, Đột biến NST & Công nghệ Tế bào (2006)',
    subtitle: 'Phân tích sơ đồ phả hệ 3 thế hệ và bệnh di truyền phân tử – lệch bội ở người',
    description: 'Hệ thống hóa phương pháp đọc phả hệ tìm gen trội/lặn và phân biệt bệnh Down, Turner XO, Klinefelter XXY.',
    theory1Heading: '1. Quy tắc Đọc Sơ đồ Phả hệ',
    theory1: '• Bố mẹ bình thường sinh con bị bệnh $\\Rightarrow$ bệnh do **alen lặn** quy định.\n• Bố mẹ bị bệnh sinh con bình thường $\\Rightarrow$ bệnh do **alen trội** quy định.',
    theory2Heading: '2. Bệnh Di truyền Người',
    theory2: '• Bệnh hồng cầu hình liềm (đột biến điểm gen Hbβ), bệnh Phenylketon niệu (thiếu enzyme chuyển hóa phenylalanine), hội chứng Down (3 NST 21).',
    keyFormulas: ['P(\\text{con bệnh}) = P(\\text{bố } Aa) \\times P(\\text{mẹ } Aa) \\times \\frac{1}{4}'],
    sim2d: 'blood_typing_2d',
    sim3d: 'chromosome_mitosis_3d',
    mcq1: {
      source: 'SGK Sinh 9 (2006)',
      question: 'Bố và mẹ đều bình thường nhưng sinh con gái bị bệnh bạch tạng. Kết luận nào đúng?',
      options: ['A. Bệnh do gen trội trên X', 'B. Bệnh do gen lặn nằm trên NST thường', 'C. Bệnh do gen lặn trên Y', 'D. Không do gen quy định'],
      correctIndex: 1,
      explanation: 'Bố bình thường không truyền alen lặn trên X cho con gái bệnh $\\Rightarrow$ gen lặn nằm trên NST thường.'
    },
    mcq2: {
      source: 'SGK Sinh 9 (2006)',
      question: 'Người mắc hội chứng Turner có kiểu NST giới tính là:',
      options: ['A. XXY', 'B. XO (45 NST)', 'C. XXX', 'D. XYY'],
      correctIndex: 1,
      explanation: 'Thể một nhiễm cặp giới tính $XO$ ($2n - 1 = 45$) là hội chứng Turner ở nữ.'
    },
    essay: {
      source: 'Sinh 9 (2006)',
      question: 'Tại sao luật Hôn nhân gia đình cấm kết hôn cận huyết trong vòng 3 đời?',
      solutionSteps: ['Kết hôn gần làm tăng xác suất gặp nhau của các alen lặn gây bệnh vốn ẩn giấu ở trạng thái dị hợp trong dòng họ'],
      finalAnswer: 'Giảm nguy cơ tạo thể đồng hợp lặn gây dị tật bẩm sinh và suy thoái giống nòi.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-10-1',
    track: 'gdpt_2006',
    grade: 'Lớp 10',
    stageLabel: 'GDPT 2006 · Sinh học 10',
    sourceTag: 'SGK Sinh 10 (2006) · Chuyển hóa Vật chất & Vi sinh vật',
    lessonNumber: 1,
    title: 'Các Con đường Chuyển hóa Vi sinh vật & Ứng dụng Lên men (2006)',
    subtitle: 'Quang tự dưỡng, hóa tự dưỡng, quang dị dưỡng, hóa dị dưỡng và lên men thực phẩm',
    description: 'Phân loại 4 kiểu dinh dưỡng dựa theo nguồn Cacbon ($CO_2$ / hữu cơ) và nguồn Năng lượng (ánh sáng / hóa học).',
    theory1Heading: '1. Bốn kiểu Dinh dưỡng ở Vi sinh vật',
    theory1: '• Nguồn năng lượng: ánh sáng (Quang-) vs chất hóa học (Hóa-).\n• Nguồn Cacbon: $CO_2$ (-tự dưỡng) vs chất hữu cơ (-dị dưỡng).',
    theory2Heading: '2. Hô hấp kỵ khí & Lên men',
    theory2: '• Lên men sữa chua ($\\text{Lactobacillus}$ chuyển đường lactose thành axit lactic làm đông tụ casein).',
    keyFormulas: ['\\text{C}_6\\text{H}_{12}\\text{O}_6 \\xrightarrow{\\text{Nấm men}} 2\\text{C}_2\\text{H}_5\\text{OH} + 2\\text{CO}_2'],
    sim2d: 'cellular_respiration_2d',
    sim3d: 'virus_bacteriophage_3d',
    mcq1: {
      source: 'SGK Sinh 10 (2006)',
      question: 'Vi khuẩn lam có nguồn năng lượng từ ánh sáng và nguồn cacbon là $CO_2$ thuộc kiểu dinh dưỡng nào?',
      options: ['A. Quang tự dưỡng', 'B. Hóa tự dưỡng', 'C. Quang dị dưỡng', 'D. Hóa dị dưỡng'],
      correctIndex: 0,
      explanation: 'Quang tự dưỡng sử dụng ánh sáng và đồng hóa $CO_2$.'
    },
    mcq2: {
      source: 'Sinh 10 (2006)',
      question: 'Trong làm sữa chua tại nhà, hiện tượng sữa đông đặc và có vị chua thanh là nhờ vi khuẩn chuyển lactose thành:',
      options: ['A. Rượu etanol', 'B. Axit lactic', 'C. Khí metan', 'D. Axit axetic'],
      correctIndex: 1,
      explanation: 'Vi khuẩn lactic lên men tạo axit lactic hạ pH làm đông tụ protein casein trong sữa.'
    },
    essay: {
      source: 'Sinh 10 (2006)',
      question: 'Giải thích vì sao muối dưa cải nếu đổ ngập nước muối sạch và đậy kín sẽ ngon, không bị khú.',
      solutionSteps: ['Tạo môi trường kỵ khí ức chế vi khuẩn thối hiếu khí và thuận lợi cho vi khuẩn lactic hoạt động'],
      finalAnswer: 'Đảm bảo điều kiện yếm khí và pH axit cho vi khuẩn lactic ưu thế.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-11-1',
    track: 'gdpt_2006',
    grade: 'Lớp 11',
    stageLabel: 'GDPT 2006 · Sinh học 11',
    sourceTag: 'SGK Sinh 11 (2006) · Sinh trưởng, Phát triển & Sinh sản',
    lessonNumber: 1,
    title: 'Sinh trưởng – Phát triển, Biến thái & Sinh sản Hữu tính (2006)',
    subtitle: 'Hormone Ecdyson & Juvenin ở côn trùng, Thyroxin ở người và Thụ tinh kép Thực vật',
    description: 'Phân biệt biến thái hoàn toàn vs không hoàn toàn và chu trình thụ tinh kép độc đáo ở Thực vật hạt kín.',
    theory1Heading: '1. Hormone Điều hòa Biến thái Động vật',
    theory1: '• Ở sâu bướm (biến thái hoàn toàn): **Juvenin** cao giữ trạng thái sâu ăn lá; khi **Ecdyson** thắng thế và Juvenin giảm $\\to$ hóa nhộng $\\to$ lột xác thành bướm.',
    theory2Heading: '2. Thụ tinh Kép ở Thực vật có Hoa',
    theory2: '• Ống phấn mang 2 tinh tử ($n$): 1 tinh tử hợp nhất noãn cầu ($n$) $\\to$ hợp tử ($2n$); 1 tinh tử hợp nhất nhân cực ($2n$) $\\to$ nội nhũ ($3n$) nuôi phôi.',
    keyFormulas: ['\\text{Hợp tử}: 2n,\\quad \\text{Nội nhũ hạt kín}: 3n'],
    sim2d: 'phytohormone_tropism_2d',
    sim3d: 'plant_vascular_3d',
    mcq1: {
      source: 'SGK Sinh 11 (2006)',
      question: 'Trong thụ tinh kép ở thực vật hạt kín, tế bào nội nhũ nuôi dưỡng phôi có bộ NST là:',
      options: ['A. n', 'B. 2n', 'C. 3n', 'D. 4n'],
      correctIndex: 2,
      explanation: 'Tinh tử ($n$) kết hợp với nhân cực lưỡng bội ($2n$) tạo tế bào nội nhũ tam bội ($3n$).'
    },
    mcq2: {
      source: 'SGK Sinh 11 (2006)',
      question: 'Cặp hormone phối hợp điều khiển lột xác và biến thái từ sâu thành nhộng và bướm ở côn trùng là:',
      options: ['A. Insulin và Glucagon', 'B. Ecdyson và Juvenin', 'C. GH và Thyroxin', 'D. FSH và LH'],
      correctIndex: 1,
      explanation: 'Ecdyson gây lột xác, còn Juvenin ức chế sự chuyển hóa thành nhộng cho tới khi giảm nồng độ.'
    },
    essay: {
      source: 'Sinh 11 (2006)',
      question: 'Nêu nguyên nhân gây bướu cổ ở trẻ em thiếu Iốt trong khẩu phần ăn.',
      solutionSteps: ['Thiếu Iốt làm tuyến giáp không tổng hợp đủ Thyroxin; tuyến yên tăng tiết TSH kích thích tuyến giáp phì đại'],
      finalAnswer: 'Tuyến yên mất phản hồi âm nên liên tục tiết TSH phì đại tuyến giáp.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-12-1',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2006 · Sinh học 12',
    sourceTag: 'SGK Sinh 12 (2006) · Bằng chứng Tiến hóa & Hình thành Loài',
    lessonNumber: 1,
    title: 'Bằng chứng Tiến hóa, Cách li Sinh sản & Hình thành Loài Mới (2006)',
    subtitle: 'Cơ quan tương đồng vs tương tự, các con đường cách li địa lí và đa bội hóa cùng khu',
    description: 'Phân biệt tiến hóa phân li (tương đồng) và tiến hóa hội tụ (tương tự), cùng 6 cơ chế cách li trước/sau hợp tử.',
    theory1Heading: '1. Bằng chứng Giải phẫu & Sinh học Phân tử',
    theory1: '• **Cơ quan tương đồng**: cùng nguồn gốc phôi thai (tay người và cánh dơi) phản ánh tiến hóa phân li.\n• **Cơ quan tương tự**: khác nguồn gốc nhưng cùng chức năng (cánh côn trùng và cánh chim) phản ánh tiến hóa hội tụ.',
    theory2Heading: '2. Hình thành Loài Mới',
    theory2: '• Cách li địa lí là điều kiện thúc đẩy phân hóa vốn gen dẫn tới **cách li sinh sản** (dấu mốc hình thành loài mới).\n• Lai xa kết hợp **đa bội hóa** (song nhị bội) tạo loài mới nhanh chóng ở thực vật.',
    keyFormulas: ['\\text{Loài A }(2n_A) \\times \\text{Loài B }(2n_B) \\to (n_A + n_B) \\xrightarrow{\\text{Đa bội}} 2n_A + 2n_B'],
    sim2d: 'natural_selection_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'SGK Sinh 12 (2006)',
      question: 'Cánh chim và cánh bướm (côn trùng) là ví dụ cho:',
      options: ['A. Cơ quan thoái hóa', 'B. Cơ quan tương đồng', 'C. Cơ quan tương tự (tiến hóa hội tụ)', 'D. Hiện tượng lại giống'],
      correctIndex: 2,
      explanation: 'Cánh chim (biến đổi chi trước xương) và cánh côn trùng (gốc biểu bì) khác nguồn gốc nhưng cùng chức năng bay.'
    },
    mcq2: {
      source: 'SGK Sinh 12 (2006)',
      question: 'Dấu mốc đánh dấu một quần thể đã trở thành loài mới độc lập với quần thể gốc là:',
      options: ['A. Xuất hiện cách li địa lí', 'B. Xuất hiện cách li sinh sản', 'C. Thay đổi màu sắc lông', 'D. Tăng kích thước quần thể'],
      correctIndex: 1,
      explanation: 'Theo khái niệm loài sinh học của Mayr, cách li sinh sản khép kín dòng gen là tiêu chuẩn hình thành loài mới.'
    },
    essay: {
      source: 'Sinh 12 (2006)',
      question: 'Cây lai giữa Cải củ ($2n=18R$) và Cải bắp ($2n=18B$) bị bất thụ. Làm thế nào để tạo ra loài mới hữu thụ ($36$ NST)?',
      solutionSteps: ['Xử lí con lai $F_1$ ($9R + 9B$) bằng Cônsixin (Colchicine) gây đa bội hóa thành thể song nhị bội $18R + 18B = 36$ NST'],
      finalAnswer: 'Dùng Colchicine đa bội hóa thành thể song nhị bội 2n = 36 NST giảm phân bình thường.'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-12-2',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2006 · Sinh học 12',
    sourceTag: 'SGK Sinh 12 (2006) · Di truyền Phả hệ & Tương tác Gen',
    lessonNumber: 2,
    title: 'Bài tập Đếm Phép lai Tương tác Gen & PCR – Điện di Hiện đại (2006)',
    subtitle: 'Tương tác bổ sung 9:7, 9:6:1, át chế 12:3:1, 13:3 và đọc bản điện di DNA',
    description: 'Nhận diện bản chất sinh hóa của tương tác gen (nhiều enzyme xúc tác chuỗi phản ứng) và giải thích băng điện di.',
    theory1Heading: '1. Các tỉ lệ Biến dạng từ 9 : 3 : 3 : 1',
    theory1: '• Tổng hợp sắc tố 2 bước: $9\\,A-B- : 7\\text{ trắng}$ ($9:7$).\n• Tác động cộng gộp: số alen trội quyết định sắc độ da, chiều cao.\n• Át chế trội: $12:3:1$ hoặc $13:3$.',
    theory2Heading: '2. Phản ứng Chuỗi Polymerase (PCR) & Điện di',
    theory2: '• Taq polymerase chịu nhiệt $72^\\circ\\text{C}$ khuếch đại đoạn DNA đích theo hàm mũ $2^n$; trên gel Agarose, đoạn DNA ngắn hơn di chuyển nhanh hơn về cực dương.',
    keyFormulas: ['N_{\\text{PCR}} = N_0 \\cdot 2^n', '9+7=16,\\ 9+6+1=16,\\ 12+3+1=16'],
    sim2d: 'pcr_electrophoresis_2d',
    sim3d: 'dna_double_helix_3d',
    mcq1: {
      source: 'SGK Sinh 12 (2006)',
      question: 'Trong điện di trên gel Agarose, các đoạn DNA phân tách dựa vào yếu tố nào và chạy về phía cực nào?',
      options: ['A. Kích thước (đoạn ngắn chạy nhanh) về cực dương (+)', 'B. Đoạn dài chạy nhanh về cực âm (-)', 'C. Màu sắc nhuộm về cực âm', 'D. Không phụ thuộc điện áp'],
      correctIndex: 0,
      explanation: 'Nhóm photphat khiến DNA mang điện tích âm nên chạy về cực dương (+), đoạn nhỏ dễ luồn qua lỗ gel hơn.'
    },
    mcq2: {
      source: 'SGK Sinh 12 (2006)',
      question: 'Phép lai $AaBb \\times AaBb$ thu được $F_1$ có $9\\text{ hoa đỏ} : 7\\text{ hoa trắng}$. Đây là quy luật:',
      options: ['A. Liên kết hoàn toàn', 'B. Tương tác bổ sung (cần cả A và B cho hoa đỏ)', 'C. Trội không hoàn toàn', 'D. Hoán vị gen'],
      correctIndex: 1,
      explanation: 'Khi hai gen không alen cùng tạo ra 2 enzyme cần thiết cho một chuỗi tạo sắc tố đỏ sẽ cho tỉ lệ $9:7$.'
    },
    essay: {
      source: 'Sinh 12 (2006)',
      question: 'Một mẫu phản ứng PCR chứa $100$ bản sao DNA đích trải qua $20$ chu kì nhiệt. Tính số bản sao thu được (giả sử hiệu suất 100%).',
      solutionSteps: ['$100 \\times 2^{20} = 100 \\times 1{,}048{,}576 \\approx 1{,}05 \\times 10^8$ bản sao'],
      finalAnswer: '104.857.600 bản sao DNA'
    }
  }),
  makeBioLesson({
    id: 'bio-2006-12-3',
    track: 'gdpt_2006',
    grade: 'Lớp 12',
    stageLabel: 'GDPT 2006 · Sinh học 12',
    sourceTag: 'SGK Sinh 12 (2006) · Chu trình Sinh địa hóa & Diễn thế',
    lessonNumber: 3,
    title: 'Chu trình Cacbon – Nitơ & Quản lí Bền vững Tài nguyên Sinh quyển (2006)',
    subtitle: 'Hiệu ứng nhà kính, phú dưỡng hóa nguồn nước và cân bằng quần xã đỉnh cực',
    description: 'Phân tích vai trò nhóm vi khuẩn nitrat hóa / phản nitrat hóa và biện pháp bảo tồn đa dạng sinh học.',
    theory1Heading: '1. Chu trình Cacbon & Biến đổi Khí hậu',
    theory1: '• Quang hợp hấp thụ $CO_2$; hô hấp, phân giải và đốt nhiên liệu hóa thạch phát thải $CO_2$. Gia tăng quá mức $CO_2$ gây hiệu ứng nhà kính.',
    theory2Heading: '2. Chu trình Nitơ trong Nông nghiệp',
    theory2: '• Vi khuẩn cố định đạm chuyển $N_2 \\to NH_4^+$; vi khuẩn nitrat hóa chuyển $NH_4^+ \\to NO_3^-$; vi khuẩn phản nitrat hóa trả lại $N_2$ khi đất yếm khí ngập úng.',
    keyFormulas: ['\\text{NH}_4^+ \\xrightarrow{\\text{Nitrosomonas}} \\text{NO}_2^- \\xrightarrow{\\text{Nitrobacter}} \\text{NO}_3^-'],
    sim2d: 'carbon_nitrogen_cycle_2d',
    sim3d: 'ecosystem_biome_3d',
    mcq1: {
      source: 'Sinh 12 (2006)',
      question: 'Tại sao đất trồng bị ngập úng, thiếu oxi lâu ngày lại bị nghèo đạm?',
      options: ['A. Kích thích vi khuẩn phản nitrat hóa chuyển NO₃⁻ thành N₂ bay mất', 'B. Hủy diệt rễ cây', 'C. Làm tăng vi khuẩn cố định đạm', 'D. Tăng quang hợp'],
      correctIndex: 0,
      explanation: 'Vi khuẩn phản nitrat hóa hoạt động mạnh trong điều kiện yếm khí gây mất nitrat khỏi đất.'
    },
    mcq2: {
      source: 'Sinh 12 (2006)',
      question: 'Tác nhân chủ yếu giúp đưa nguyên tử Cacbon từ môi trường vô sinh ($CO_2$) vào lưới thức ăn là:',
      options: ['A. Động vật ăn thịt', 'B. Sinh vật sản xuất (Thực vật, Tảo, Vi khuẩn quang hợp)', 'C. Nấm hoại sinh', 'D. Giun đất'],
      correctIndex: 1,
      explanation: 'Chỉ sinh vật tự dưỡng (quang hợp/hóa tổng hợp) mới cố định được $CO_2$ thành hợp chất hữu cơ.'
    },
    essay: {
      source: 'Sinh 12 (2006)',
      question: 'Nêu biện pháp sinh học giúp hạn chế mất đạm và tăng độ phì đất trồng trọt.',
      solutionSteps: ['Xới đất thoáng khí ức chế vi khuẩn phản nitrat hóa và trồng xen canh cây họ Đậu có vi khuẩn Rhizobium'],
      finalAnswer: 'Cày bừa làm thoáng đất kết hợp luân canh/xen canh cây họ Đậu.'
    }
  })
];
