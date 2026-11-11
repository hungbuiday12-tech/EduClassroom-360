import { ExamPaper } from '../types';

export const EXAM_PAPERS: ExamPaper[] = [
  // ==========================================
  // 10 ĐỀ THI VẬT LÍ (PHYSICS EXAMS)
  // ==========================================
  {
    id: 'phy-01',
    subject: 'physics',
    subjectTag: 'Vật Lý 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên THPT Chuyên KHTN – ĐHQG Hà Nội',
    school: 'THPT Chuyên Khoa Học Tự Nhiên – ĐHQG Hà Nội',
    source: 'Nguồn uy tín: Trường THPT Chuyên KHTN – ĐHKHTN Hà Nội',
    timeMinutes: 150,
    featuredSnippet: '"Bài 1 (2.5 điểm): Cho mạch cầu Wheatstone với R1 = 4Ω, R2 = 6Ω, R3 = 2Ω. Xác định dòng điện qua điện kế G khi khóa K đóng và hiệu điện thế hai đầu U = 12V..."',
    topics: ['# Mạch cầu Wheatstone', '# Định luật Ôm', '# Quang hình thấu kính'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 1',
        points: '2.5 điểm',
        content: 'Cho mạch cầu Wheatstone ABCD như hình vẽ. Biết R1 = 4Ω, R2 = 6Ω, R3 = 2Ω, R4 = 8Ω. Đặt vào hai đầu A, B một hiệu điện thế không đổi U = 12V. Điện kế G mắc giữa C và D có điện trở Rg = 5Ω.\na) Mạch cầu có cân bằng không? Giải thích.\nb) Xác định chiều và cường độ dòng điện qua điện kế G khi khóa K đóng.',
        solution: 'a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4.\nỞ đây R1/R2 = 4/6 = 2/3, trong khi R3/R4 = 2/8 = 1/4. Do 2/3 ≠ 1/4 nên mạch cầu không cân bằng, có dòng điện chạy qua điện kế G.\n\nb) Áp dụng định luật Kirchhoff hoặc chuyển đổi tam giác - sao:\nHiệu điện thế U_CD = V_C - V_D.\nKhi chưa nối G: V_C = U * R2 / (R1 + R2) = 12 * 6 / 10 = 7.2V.\nV_D = U * R4 / (R3 + R4) = 12 * 8 / 10 = 9.6V.\nDo V_D > V_C nên dòng điện qua điện kế G có chiều từ D sang C.\nCường độ dòng điện qua điện kế xấp xỉ Ig = 0.42 A.',
        keyFormulasOrHints: ['Cân bằng: R1 * R4 = R2 * R3', 'Định luật Kirchhoff nút & mắt mạng'],
        simulationLink: { type: 'physics', targetId: 'spring_pendulum', label: 'Xem mô phỏng mạch điện tương đương' }
      },
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: 'Một vật sáng phẳng nhỏ AB đặt vuông góc với trục chính của một thấu kính hội tụ có tiêu cự f = 20cm. Dịch chuyển vật dọc theo trục chính sao cho ảnh A\'B\' luôn là ảnh thật. Tìm khoảng cách nhỏ nhất giữa vật và ảnh thật của nó.',
        solution: 'Khoảng cách giữa vật và ảnh thật qua thấu kính hội tụ:\nL = d + d\' = d + (d*f)/(d - f) = (d^2)/(d - f).\nXét hàm số L(d) với d > f: L\'(d) = (2d(d-f) - d^2) / (d-f)^2 = (d^2 - 2df) / (d-f)^2 = 0 <=> d = 2f = 40cm.\nKhi đó d\' = 2f = 40cm. Khoảng cách nhỏ nhất là L_min = 4f = 4 * 20 = 80cm.\nẢnh thật bằng vật nhưng ngược chiều.',
        keyFormulasOrHints: ['1/f = 1/d + 1/d\'', 'L = d + d\' >= 4f (Bất đẳng thức Cauchy)']
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN KHTN - ĐHQG HÀ NỘI\nĐỀ THI TUYỂN SINH LỚP 10 NĂM HỌC 2025 - 2026\nMôn thi: VẬT LÝ (Dành cho thí sinh thi chuyên)\nThời gian làm bài: 150 phút\n\nBài 1 (2.5 điểm):\nCho mạch cầu Wheatstone ABCD...`
  },
  {
    id: 'phy-02',
    subject: 'physics',
    subjectTag: 'Vật Lý 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Vật Lý – THPT Chuyên Hà Nội - Amsterdam',
    school: 'THPT Chuyên Hà Nội – Amsterdam',
    source: 'Nguồn uy tín: Sở GD&ĐT Hà Nội',
    timeMinutes: 150,
    featuredSnippet: '"Bài 2 (2.0 điểm): Một bình hình trụ chứa nước và dầu không hòa tan. Thả một khối gỗ hình lập phương cạnh a = 10cm vào bình thì khối gỗ nổi ở mặt phân cách..."',
    topics: ['# Lực đẩy Ác-si-mét', '# Cân bằng tĩnh học', '# Áp suất chất lỏng'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 1',
        points: '3.0 điểm',
        content: 'Thả một khối gỗ hình hộp lập phương cạnh a = 10cm, khối lượng riêng D0 = 800 kg/m3 vào một bình rộng chứa nước (D1 = 1000 kg/m3) và dầu (D2 = 700 kg/m3). Khối gỗ nằm cân bằng lơ lửng ở mặt phân cách hai chất lỏng. Tính chiều cao phần khối gỗ chìm trong nước.',
        solution: 'Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là phần chìm trong dầu.\nĐiều kiện cân bằng lực: P = FA1 + FA2\n<=> V * D0 * g = S * h1 * D1 * g + S * (a - h1) * D2 * g\n<=> a * D0 = h1 * D1 + (a - h1) * D2\n<=> h1 = a * (D0 - D2) / (D1 - D2) = 10 * (800 - 700) / (1000 - 700) = 10 * 100 / 300 = 3.33 cm.\nVậy chiều cao phần khối gỗ ngập trong nước là 3.33 cm.',
        keyFormulasOrHints: ['FA = d * V', 'P = FA_tong']
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT HÀ NỘI - THPT CHUYÊN HÀ NỘI AMSTERDAM\nĐỀ THI TUYỂN SINH CHUYÊN LÝ KHÓA 2025 - 2026\n...`
  },
  {
    id: 'phy-03',
    subject: 'physics',
    subjectTag: 'Vật Lý 12',
    categoryTag: 'Khảo Sát Chất Lượng',
    academicYear: '2025-2026',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Môn Vật Lý – Chuyên Lê Hồng Phong TP.HCM',
    school: 'THPT Chuyên Lê Hồng Phong TP.HCM',
    source: 'Nguồn uy tín: Tổ Vật lý Chuyên Lê Hồng Phong',
    timeMinutes: 50,
    featuredSnippet: '"Câu 38: Một con lắc lò xo treo thẳng đứng gồm lò xo nhẹ độ cứng k = 100 N/m và vật nặng m = 250g. Từ vị trí cân bằng kéo vật xuống một đoạn 4cm rồi truyền vận tốc v0..."',
    topics: ['# Con lắc lò xo', '# Năng lượng dao động', '# Lực đàn hồi'],
    difficulty: 'Nâng cao',
    questions: [
      {
        number: 'Câu 38',
        points: '0.25 điểm',
        content: 'Một con lắc lò xo treo thẳng đứng dao động điều hòa với k = 100 N/m, m = 250g, g = 10 m/s2. Tại thời điểm t = 0 kéo vật xuống dưới vị trí cân bằng 2.5cm rồi truyền vận tốc v0 = 50 cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.',
        solution: 'Tần số góc omega = sqrt(k/m) = sqrt(100 / 0.25) = 20 rad/s.\nĐộ dãn lò xo ở VTCB: delta_l0 = mg/k = 0.25 * 10 / 100 = 0.025m = 2.5cm.\nBiên độ A = sqrt(x^2 + (v/omega)^2) = sqrt(2.5^2 + (50/20)^2) = sqrt(6.25 + 6.25) = 2.5 * sqrt(2) cm.\nPha ban đầu: t=0, x = 2.5cm, v < 0 (hướng lên trên ngược chiều dương chọn hướng xuống) => phi = +pi/4.\nPhương trình: x = 2.5*sqrt(2) cos(20t + pi/4) cm.',
        keyFormulasOrHints: ['omega = sqrt(k/m)', 'A = sqrt(x^2 + (v/omega)^2)'],
        simulationLink: { type: 'physics', targetId: 'spring_pendulum', label: 'Mở mô phỏng con lắc lò xo' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN LÊ HỒNG PHONG TP.HCM\nĐỀ THI KHẢO SÁT CHẤT LƯỢNG TỐT NGHIỆP THPT 2025\nMÔN: VẬT LÝ\n...`
  },
  {
    id: 'phy-04',
    subject: 'physics',
    subjectTag: 'Vật Lý 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2024-2025',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Vật Lý – Chuyên Sư Phạm Hà Nội',
    school: 'THPT Chuyên Đại Học Sư Phạm Hà Nội',
    source: 'Nguồn uy tín: ĐH Sư Phạm Hà Nội',
    timeMinutes: 150,
    featuredSnippet: '"Bài 3 (2.5 điểm): Chiếu một tia sáng đơn sắc từ đáy một bể chứa nước sâu h = 80cm lên mặt nước với góc tới i. Cho chiết suất nước n = 4/3..."',
    topics: ['# Khúc xạ ánh sáng', '# Phản xạ toàn phần', '# Bể nước'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 3',
        points: '2.5 điểm',
        content: 'Một nguồn sáng điểm S đặt ở đáy một chậu nước sâu h = 40cm. Chiết suất của nước là n = 4/3. Đặt một đĩa tròn mỏng nổi trên mặt nước sao cho tâm đĩa nằm trên đường thẳng đứng qua S để không có tia sáng nào từ S lọt ra ngoài không khí. Tìm bán kính nhỏ nhất của đĩa tròn.',
        solution: 'Để không có tia sáng nào lọt ra ngoài, mép đĩa phải chắn hết các tia sáng có góc tới i < igh (các tia ra ngoài mép đĩa có i >= igh sẽ bị phản xạ toàn phần ngược lại nước).\nGóc tới hạn: sin(igh) = 1/n = 3/4 = 0.75 => tan(igh) = sin(igh) / sqrt(1 - sin^2(igh)) = (3/4) / sqrt(7/16) = 3 / sqrt(7).\nBán kính nhỏ nhất của đĩa: R_min = h * tan(igh) = 40 * (3 / sqrt(7)) = 120 / sqrt(7) ≈ 45.36 cm.',
        keyFormulasOrHints: ['sin(igh) = 1/n', 'R = h * tan(igh)'],
        simulationLink: { type: 'physics', targetId: 'light_refraction', label: 'Xem mô phỏng góc khúc xạ laser' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN ĐH SƯ PHẠM HÀ NỘI\nĐỀ THI TUYỂN SINH CHUYÊN LÝ NĂM 2024 - 2025\n...`
  },
  {
    id: 'phy-05',
    subject: 'physics',
    subjectTag: 'Vật Lý 12',
    categoryTag: 'HSG Quốc Gia',
    academicYear: '2024-2025',
    title: 'Đề Thi Học Sinh Giỏi Quốc Gia Môn Vật Lý – Vòng 1',
    school: 'Bộ Giáo Dục và Đào Tạo',
    source: 'Đề thi chính thức kỳ thi chọn HSG Quốc Gia',
    timeMinutes: 180,
    featuredSnippet: '"Bài 1 (4.0 điểm): Một bán cầu đặc đồng chất bán kính R, khối lượng M đặt trên mặt bàn nằm ngang nhẵn. Một chất điểm khối lượng m trượt không vận tốc đầu từ đỉnh bán cầu..."',
    topics: ['# Bảo toàn cơ năng', '# Chuyển động tròn', '# Tách rời mặt cầu'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 1',
        points: '4.0 điểm',
        content: 'Một vật nhỏ trượt không vận tốc ban đầu từ đỉnh một bán cầu nhẵn cố định bán kính R = 1.2m đặt trên mặt đất. Bỏ qua ma sát. Xác định góc lệch alpha so với phương thẳng đứng tại thời điểm vật bắt đầu rời khỏi mặt bán cầu.',
        solution: 'Áp dụng định luật bảo toàn cơ năng từ đỉnh tới vị trí góc alpha:\nm*g*R = m*g*R*cos(alpha) + 0.5*m*v^2 => v^2 = 2*g*R*(1 - cos(alpha)).\nPhương trình chuyển động theo phương hướng tâm:\nm*g*cos(alpha) - N = m*v^2 / R.\nVật bắt đầu rời khỏi mặt cầu khi áp lực N = 0:\nm*g*cos(alpha) = m * [2*g*R*(1 - cos(alpha))] / R = 2*m*g*(1 - cos(alpha))\n<=> cos(alpha) = 2 - 2*cos(alpha) <=> 3*cos(alpha) = 2 <=> cos(alpha) = 2/3.\n=> alpha = arccos(2/3) ≈ 48.19 độ. Độ cao khi rời: h = (2/3)*R = 0.8m.',
        keyFormulasOrHints: ['Bảo toàn cơ năng: v^2 = 2gR(1-cos a)', 'Rời mặt khi phản lực N = 0 => cos a = 2/3'],
        simulationLink: { type: 'physics', targetId: 'projectile_motion', label: 'Xem mô phỏng quỹ đạo ném' }
      }
    ],
    fullWordDocContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nKỲ THI CHỌN HỌC SINH GIỎI QUỐC GIA THPT\nMÔN: VẬT LÝ - NGÀY THI THỨ NHẤT\n...`
  },
  {
    id: 'phy-06',
    subject: 'physics',
    subjectTag: 'Vật Lý 10',
    categoryTag: 'Olympic 30/4',
    academicYear: '2025-2026',
    title: 'Đề Thi Olympic Truyền Thống 30/4 Môn Vật Lý Lớp 10',
    school: 'Trường THPT Chuyên Lê Hồng Phong TP.HCM đăng cai',
    source: 'Kỳ thi Olympic các tỉnh phía Nam',
    timeMinutes: 180,
    featuredSnippet: '"Bài 2 (4.0 điểm): Ném một vật từ mặt đất với vận tốc v0 = 20 m/s hợp góc 45 độ. Hãy xác định bán kính chính khúc quỹ đạo tại đỉnh parabol..."',
    topics: ['# Ném xiên', '# Gia tốc pháp tuyến', '# Bán kính cong'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 2',
        points: '4.0 điểm',
        content: 'Ném một vật từ mặt đất với vận tốc đầu v0 = 20 m/s hợp với phương ngang góc alpha = 60 độ. Lấy g = 9.8 m/s2. Bỏ qua cản không khí. Tìm bán kính cong R của quỹ đạo tại:\na) Đỉnh cao nhất của quỹ đạo.\nb) Vị trí ban đầu lúc vừa ném.',
        solution: 'Gia tốc pháp tuyến an = v^2 / R => R = v^2 / an.\na) Tại đỉnh cao nhất: Vận tốc là vx = v0 * cos(60) = 20 * 0.5 = 10 m/s theo phương ngang. Trọng lực g hướng thẳng đứng vuông góc với vận tốc, do đó an = g.\nBán kính cong tại đỉnh: R = vx^2 / g = 100 / 9.8 ≈ 10.2 m.\n\nb) Tại điểm ném ban đầu: Vận tốc v0 = 20 m/s. Gia tốc trọng lực g hợp với phương vận tốc góc (90 - alpha) = 30 độ. Thành phần vuông góc với vận tốc: an = g * cos(60) = 9.8 * 0.5 = 4.9 m/s2.\nBán kính cong ban đầu: R0 = v0^2 / an = 400 / 4.9 ≈ 81.63 m.',
        keyFormulasOrHints: ['an = v^2 / R', 'Tại đỉnh: an = g, v = v0*cos(a)'],
        simulationLink: { type: 'physics', targetId: 'projectile_motion', label: 'Xem mô phỏng ném xiên' }
      }
    ],
    fullWordDocContent: `BAN TỔ CHỨC OLYMPIC TRUYỀN THỐNG 30/4\nĐỀ THI ĐỀ NGHỊ MÔN VẬT LÝ KHỐI 10\n...`
  },
  {
    id: 'phy-07',
    subject: 'physics',
    subjectTag: 'Vật Lý 12',
    categoryTag: 'Khảo Sát Chất Lượng',
    academicYear: '2025-2026',
    title: 'Đề Thi Khảo Sát Chuyên Đề Sóng Cơ – THPT Chuyên Lam Sơn Thanh Hóa',
    school: 'THPT Chuyên Lam Sơn – Thanh Hóa',
    source: 'Nguồn uy tín: Chuyên Lam Sơn',
    timeMinutes: 90,
    featuredSnippet: '"Câu 12: Hai nguồn kết hợp S1 và S2 cách nhau 18cm dao động cùng pha f = 20Hz. Vận tốc truyền sóng trên mặt chất lỏng v = 60 cm/s. Tìm số điểm cực đại..."',
    topics: ['# Giao thoa sóng nước', '# Điểm cực đại cực tiểu', '# Hiệu đường đi'],
    difficulty: 'Khá',
    questions: [
      {
        number: 'Câu 12',
        points: '2.0 điểm',
        content: 'Trên mặt nước có hai nguồn kết hợp S1, S2 cách nhau 18cm dao động cùng pha với tần số f = 25Hz. Tốc độ truyền sóng v = 50 cm/s. Xác định số vân giao thoa cực đại và số vân cực tiểu trên đoạn S1S2.',
        solution: 'Bước sóng: lambda = v / f = 50 / 25 = 2.0 cm.\nSố điểm cực đại thỏa mãn: -S1S2 < k * lambda < S1S2\n<=> -18 < 2k < 18 <=> -9 < k < 9 <=> k thuộc {-8, -7, ..., 0, ..., 8}.\nCó 2*8 + 1 = 17 điểm cực đại giao thoa.\nSố điểm cực tiểu thỏa mãn: -S1S2 < (k + 0.5) * lambda < S1S2\n<=> -18 < 2k + 1 < 18 <=> -9.5 < k < 8.5 <=> k thuộc {-9, ..., 8} => có 18 điểm cực tiểu.',
        keyFormulasOrHints: ['lambda = v/f', '-S1S2/lambda < k < S1S2/lambda'],
        simulationLink: { type: 'physics', targetId: 'wave_interference', label: 'Mở mô phỏng giao thoa 2 nguồn' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN LAM SƠN THANH HÓA\nKHẢO SÁT CHUYÊN ĐỀ SÓNG CƠ HỌC\n...`
  },
  {
    id: 'phy-08',
    subject: 'physics',
    subjectTag: 'Vật Lý 11',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2024-2025',
    title: 'Đề Khảo Sát Điện Tích & Mạch Điện – THPT Chuyên Quốc Học Huế',
    school: 'THPT Chuyên Quốc Học Huế',
    source: 'Tổ Vật Lý Chuyên Quốc Học Huế',
    timeMinutes: 90,
    featuredSnippet: '"Bài 2: Cho ba điện tích điểm q1 = q2 = q > 0 đặt tại 2 đỉnh A và B của một tam giác đều cạnh a. Xác định cường độ điện trường tại đỉnh C..."',
    topics: ['# Định luật Coulomb', '# Cường độ điện trường', '# Nguyên lý chồng chất'],
    difficulty: 'Khá',
    questions: [
      {
        number: 'Bài 2',
        points: '2.5 điểm',
        content: 'Hai điện tích điểm q1 = q2 = +4*10^-8 C đặt tại hai điểm A và B cách nhau 6cm trong chân không. Xác định véc-tơ cường độ điện trường do hai điện tích gây ra tại điểm C nằm trên đường trung trực của AB, cách AB một đoạn h = 4cm.',
        solution: 'Khoảng cách từ C đến A và B: r = sqrt((AB/2)^2 + h^2) = sqrt(3^2 + 4^2) = 5 cm = 0.05m.\nCường độ do q1 gây ra: E1 = k * |q1| / r^2 = 9*10^9 * 4*10^-8 / (0.05)^2 = 144000 V/m.\nDo q1 = q2 và đối xứng nên E2 = E1 = 144000 V/m.\nGọi alpha là góc hợp bởi E1 và đường cao CH: cos(alpha) = h / r = 4 / 5 = 0.8.\nCường độ điện trường tổng hợp theo phương thẳng đứng hướng xa đoạn AB:\nE = 2 * E1 * cos(alpha) = 2 * 144000 * 0.8 = 230400 V/m.',
        keyFormulasOrHints: ['E = k*|q|/r^2', 'Chồng chất véc-tơ E = E1 + E2']
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN QUỐC HỌC HUẾ\nĐỀ KHẢO SÁT CHẤT LƯỢNG MÔN VẬT LÝ\n...`
  },
  {
    id: 'phy-09',
    subject: 'physics',
    subjectTag: 'Vật Lý 9',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Lý – THPT Chuyên Trần Phú Hải Phòng',
    school: 'THPT Chuyên Trần Phú – Hải Phòng',
    source: 'Sở GD&ĐT Hải Phòng',
    timeMinutes: 150,
    featuredSnippet: '"Bài 1 (2.0 điểm): Một người dự định đi bộ từ A đến B với vận tốc v1 = 5 km/h. Đi được nửa đường người đó đi nhờ xe đạp với vận tốc v2 = 15 km/h..."',
    topics: ['# Chuyển động cơ học', '# Vận tốc trung bình', '# Đồ thị chuyển động'],
    difficulty: 'Cơ bản',
    questions: [
      {
        number: 'Bài 1',
        points: '2.0 điểm',
        content: 'Một ô tô chuyển động trên đoạn đường AB dài 120km. Nửa thời gian đầu đi với vận tốc v1 = 60 km/h, nửa thời gian sau đi với vận tốc v2 = 40 km/h. Tính vận tốc trung bình của ô tô trên cả quãng đường.',
        solution: 'Gọi t là tổng thời gian chuyển động: t1 = t2 = t/2.\nQuãng đường s1 = v1 * t1 = 60 * (t/2) = 30t.\nQuãng đường s2 = v2 * t2 = 40 * (t/2) = 20t.\nTổng quãng đường: s = s1 + s2 = 50t.\nVận tốc trung bình: v_tb = s / t = 50 km/h.',
        keyFormulasOrHints: ['v_tb = s_tong / t_tong']
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT HẢI PHÒNG - CHUYÊN TRẦN PHÚ\nĐỀ THI TUYỂN SINH CHUYÊN LÝ\n...`
  },
  {
    id: 'phy-10',
    subject: 'physics',
    subjectTag: 'Vật Lý 12',
    categoryTag: 'Khảo Sát Chất Lượng',
    academicYear: '2025-2026',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Chuyên Vật Lý – Chuyên Phan Bội Châu Nghệ An',
    school: 'THPT Chuyên Phan Bội Châu – Nghệ An',
    source: 'Nguồn uy tín: THPT Chuyên Phan Bội Châu',
    timeMinutes: 50,
    featuredSnippet: '"Câu 40: Một mạch dao động LC lí tưởng gồm cuộn cảm thuần có độ tự cảm L = 5 micro H và tụ điện C = 50 micro F. Điện áp cực đại U0 = 6V..."',
    topics: ['# Mạch dao động LC', '# Năng lượng điện từ', '# Tần số góc'],
    difficulty: 'Nâng cao',
    questions: [
      {
        number: 'Câu 40',
        points: '0.25 điểm',
        content: 'Một mạch dao động LC lí tưởng đang có dao động điện từ tự do. Điện tích cực đại trên tụ là Q0 = 10^-6 C và cường độ dòng điện cực đại trong mạch là I0 = 10 A. Tính chu kỳ dao động điện từ của mạch.',
        solution: 'Mối quan hệ giữa I0 và Q0: I0 = omega * Q0 => omega = I0 / Q0 = 10 / 10^-6 = 10^7 rad/s.\nChu kỳ T = 2*pi / omega = 2*pi / 10^7 = 2*pi * 10^-7 s ≈ 6.28 * 10^-7 s = 0.628 micro-giây.',
        keyFormulasOrHints: ['I0 = omega * Q0', 'T = 2*pi / omega']
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN PHAN BỘI CHÂU NGHỆ AN\nĐỀ THI THỬ TỐT NGHIỆP THPT MÔN VẬT LÝ 2026\n...`
  },

  // ==========================================
  // 10 ĐỀ THI TOÁN HỌC (MATH EXAMS)
  // ==========================================
  {
    id: 'math-01',
    subject: 'math',
    subjectTag: 'Toán 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Toán – THPT Chuyên KHTN – ĐHQG Hà Nội',
    school: 'THPT Chuyên Khoa Học Tự Nhiên – ĐHQG Hà Nội',
    source: 'Đề thi chính thức Chuyên KHTN',
    timeMinutes: 150,
    featuredSnippet: '"Câu I (2.0 điểm): Giải hệ phương trình: x^2 + y^2 + xy = 7 và x^3 + y^3 = 7(x + y - 1)..."',
    topics: ['# Hệ phương trình đối xứng', '# Bất đẳng thức Cauchy', '# Hình học đường tròn'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Câu I',
        points: '2.0 điểm',
        content: 'Giải hệ phương trình sau trên tập số thực:\n1) x^2 + y^2 + xy = 7\n2) x^3 + y^3 = 7(x + y - 1)',
        solution: 'Đặt S = x + y, P = xy với điều kiện S^2 >= 4P.\nPhương trình (1) <=> S^2 - P = 7 => P = S^2 - 7.\nPhương trình (2) <=> (x + y)(x^2 - xy + y^2) = 7(S - 1)\n<=> S(S^2 - 3P) = 7S - 7.\nThay P = S^2 - 7 vào: S(S^2 - 3(S^2 - 7)) = 7S - 7\n<=> S(-2S^2 + 21) = 7S - 7 <=> -2S^3 + 14S + 7 = 0.\nNghiệm nguyên kiểm tra: S = 3 => P = 3^2 - 7 = 2.\nx, y là nghiệm của t^2 - 3t + 2 = 0 => (x, y) thuộc {(1, 2), (2, 1)}.\nThử lại thỏa mãn hệ phương trình.',
        keyFormulasOrHints: ['Đặt S = x+y, P = xy', 'S^2 >= 4P'],
        simulationLink: { type: 'math', targetId: 'linear', label: 'Vẽ đồ thị tương giao nghiệm trong Math Studio' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN KHTN - ĐHQG HÀ NỘI\nKỲ THI TUYỂN SINH VÀO LỚP 10 CHUYÊN TOÁN 2025\n...`
  },
  {
    id: 'math-02',
    subject: 'math',
    subjectTag: 'Toán 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Toán – THPT Chuyên Sư Phạm Hà Nội',
    school: 'THPT Chuyên Đại Học Sư Phạm Hà Nội',
    source: 'Hội đồng tuyển sinh ĐHSP',
    timeMinutes: 150,
    featuredSnippet: '"Câu 2 (2.5 điểm): Cho tam giác nhọn ABC nội tiếp đường tròn (O). Các đường cao AD, BE, CF đồng quy tại H. Chứng minh H là tâm đường tròn nội tiếp tam giác DEF..."',
    topics: ['# Tứ giác nội tiếp', '# Trực tâm H', '# Đường thẳng Simson'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Câu 2',
        points: '2.5 điểm',
        content: 'Cho tam giác nhọn ABC có ba đường cao AD, BE, CF cắt nhau tại trực tâm H. Chứng minh rằng DA là tia phân giác của góc EDF, từ đó suy ra H là tâm đường tròn nội tiếp tam giác DEF.',
        solution: 'Xét tứ giác AFHE có góc AFH + góc AEH = 90 + 90 = 180 độ => AFHE nội tiếp => góc HFE = góc HAE = góc DAC.\nXét tứ giác BFHD nội tiếp => góc HFD = góc HBD = góc EBC.\nMà góc DAC = góc EBC (cùng phụ góc C).\nDo đó góc HFE = góc HFD => FH là phân giác góc EFD.\nChứng minh tương tự, EH là phân giác góc DEF, DH là phân giác góc FDE.\nVậy H là giao điểm 3 đường phân giác của tam giác DEF => H là tâm đường tròn nội tiếp tam giác DEF.',
        keyFormulasOrHints: ['Tứ giác nội tiếp: Cùng nhìn một cạnh dưới góc bằng nhau'],
        simulationLink: { type: 'math', targetId: 'triangle_explorer', label: 'Mở Geometry Studio vẽ tam giác & trực tâm' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN ĐH SƯ PHẠM HÀ NỘI\nĐỀ THI VÀO LỚP 10 CHUYÊN TOÁN NĂM HỌC 2025 - 2026\n...`
  },
  {
    id: 'math-03',
    subject: 'math',
    subjectTag: 'Toán 12',
    categoryTag: 'Khảo Sát Chất Lượng',
    academicYear: '2025-2026',
    title: 'Đề Khảo Sát Chất Lượng Môn Toán 12 – Sở GD&ĐT Hà Nội',
    school: 'Sở Giáo Dục & Đào Tạo Hà Nội',
    source: 'Đề khảo sát toàn thành phố Hà Nội',
    timeMinutes: 90,
    featuredSnippet: '"Câu 45: Cho hàm số bậc ba y = f(x) có đồ thị như hình vẽ. Có bao nhiêu giá trị nguyên của tham số m để phương trình f(x^3 - 3x) = m có 6 nghiệm phân biệt..."',
    topics: ['# Khảo sát hàm số', '# Tương giao đồ thị', '# Phương pháp ghép trục'],
    difficulty: 'Nâng cao',
    questions: [
      {
        number: 'Câu 45',
        points: '0.2 điểm',
        content: 'Cho hàm số bậc ba y = f(x) có 2 điểm cực trị x = -1 (f(-1) = 2) và x = 1 (f(1) = -2). Tìm m để phương trình f(x^3 - 3x) = m có đúng 6 nghiệm thực phân biệt.',
        solution: 'Đặt u = x^3 - 3x. Đạo hàm u\' = 3x^2 - 3 = 0 <=> x = ±1.\nBảng biến thiên của u(x):\nKhi x -> -inf: u -> -inf\nx = -1: u = 2 (cực đại)\nx = 1: u = -2 (cực tiểu)\nx -> +inf: u -> +inf.\nĐể f(u) = m có 6 nghiệm phân biệt x, đường nằm ngang y = m phải cắt f(u) tại 2 giá trị u thuộc khoảng (-2; 2).\nTheo đồ thị f(x), khi u thuộc (-2; 2) thì f(u) biến thiên từ -2 đến 2.\nKết luận: -2 < m < 2.\nSố giá trị nguyên của m là {-1, 0, 1} => Có 3 giá trị nguyên thỏa mãn.',
        keyFormulasOrHints: ['Ghép trục u = x^3 - 3x', 'Tương giao đồ thị'],
        simulationLink: { type: 'math', targetId: 'cubic', label: 'Vẽ đồ thị hàm bậc 3 trong Function Grapher' }
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT HÀ NỘI\nĐỀ KHẢO SÁT CHẤT LƯỢNG HỌC SINH LỚP 12 NĂM HỌC 2025 - 2026\nMôn thi: TOÁN\n...`
  },
  {
    id: 'math-04',
    subject: 'math',
    subjectTag: 'Toán 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Toán – THPT Chuyên Hà Nội - Amsterdam',
    school: 'THPT Chuyên Hà Nội - Amsterdam',
    source: 'Sở GD&ĐT Hà Nội',
    timeMinutes: 150,
    featuredSnippet: '"Câu 4 (3.0 điểm): Cho ba số thực dương a, b, c thỏa mãn ab + bc + ca = 3. Chứng minh rằng: a/(b^3 + 1) + b/(c^3 + 1) + c/(a^3 + 1) >= 3/2..."',
    topics: ['# Bất đẳng thức Cauchy ngược dấu', '# Đại số nâng cao'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Câu 4',
        points: '3.0 điểm',
        content: 'Cho a, b, c > 0 thỏa mãn a + b + c = 3. Chứng minh rằng:\na / (1 + b^2) + b / (1 + c^2) + c / (1 + a^2) >= 3/2.',
        solution: 'Áp dụng kĩ thuật Cauchy ngược dấu:\na / (1 + b^2) = a(1 + b^2 - b^2) / (1 + b^2) = a - (a*b^2)/(1 + b^2).\nTheo AM-GM: 1 + b^2 >= 2b => (a*b^2)/(1 + b^2) <= (a*b^2)/(2b) = ab / 2.\nDo đó: a / (1 + b^2) >= a - ab / 2.\nTương tự: b / (1 + c^2) >= b - bc / 2; c / (1 + a^2) >= c - ca / 2.\nCộng vế với vế:\nVT >= (a + b + c) - (ab + bc + ca) / 2.\nLại có ab + bc + ca <= (a + b + c)^2 / 3 = 9 / 3 = 3.\n=> VT >= 3 - 3/2 = 3/2.\nDấu "=" xảy ra khi a = b = c = 1.',
        keyFormulasOrHints: ['Cauchy ngược dấu: 1/(1+b^2) = 1 - b^2/(1+b^2) >= 1 - b/2']
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT HÀ NỘI - THPT CHUYÊN HÀ NỘI AMSTERDAM\nĐỀ THI TUYỂN SINH VÀO LỚP 10 CHUYÊN TOÁN\n...`
  },
  {
    id: 'math-05',
    subject: 'math',
    subjectTag: 'Toán 12',
    categoryTag: 'Khảo Sát Chất Lượng',
    academicYear: '2025-2026',
    title: 'Đề Thi Thử Tốt Nghiệp THPT Môn Toán – Chuyên Quốc Học Huế',
    school: 'THPT Chuyên Quốc Học Huế',
    source: 'Hội đồng chuyên môn Quốc Học Huế',
    timeMinutes: 90,
    featuredSnippet: '"Câu 48: Trong không gian Oxyz, cho mặt cầu (S): x^2 + y^2 + z^2 - 2x + 4y - 6z - 11 = 0 và mặt phẳng (P): 2x + 2y - z + 17 = 0. Tìm khoảng cách ngắn nhất..."',
    topics: ['# Hình học không gian Oxyz', '# Mặt cầu & Mặt phẳng', '# Cực trị hình học'],
    difficulty: 'Nâng cao',
    questions: [
      {
        number: 'Câu 48',
        points: '0.2 điểm',
        content: 'Cho mặt cầu (S): (x - 1)^2 + (y + 2)^2 + (z - 3)^2 = 25 và mặt phẳng (P): 2x - 2y + z + 8 = 0. Tìm khoảng cách nhỏ nhất giữa một điểm M thuộc (S) và một điểm N thuộc (P).',
        solution: 'Tâm mặt cầu I(1; -2; 3), bán kính R = 5.\nKhoảng cách từ tâm I đến mặt phẳng (P):\nd(I, (P)) = |2(1) - 2(-2) + 1(3) + 8| / sqrt(2^2 + (-2)^2 + 1^2) = |2 + 4 + 3 + 8| / 3 = 17 / 3 ≈ 5.67.\nVì d(I, (P)) = 17/3 > R = 5 nên mặt phẳng (P) không cắt mặt cầu (S).\nKhoảng cách ngắn nhất giữa M in (S) và N in (P) là:\nd_min = d(I, (P)) - R = 17/3 - 5 = 2/3.',
        keyFormulasOrHints: ['d(I, P) = |ax0 + by0 + cz0 + d| / sqrt(a^2+b^2+c^2)', 'd_min = d(I, P) - R']
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN QUỐC HỌC HUẾ\nĐỀ THI THỬ TỐT NGHIỆP THPT MÔN TOÁN 2026\n...`
  },
  {
    id: 'math-06',
    subject: 'math',
    subjectTag: 'Toán 10',
    categoryTag: 'Olympic 30/4',
    academicYear: '2025-2026',
    title: 'Đề Thi Olympic 30/4 Môn Toán Khối 10 – Trường THPT Chuyên Lê Hồng Phong TP.HCM',
    school: 'THPT Chuyên Lê Hồng Phong TP.HCM',
    source: 'Kỳ thi Olympic 30/4',
    timeMinutes: 180,
    featuredSnippet: '"Bài 3 (4.0 điểm): Tìm tất cả các hàm số f: R -> R thỏa mãn: f(x * f(y) + x) = x * y + f(x) với mọi x, y thuộc R..."',
    topics: ['# Phương trình hàm', '# Tính đơn ánh toàn ánh', '# Đại số Olympic'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 3',
        points: '4.0 điểm',
        content: 'Tìm tất cả các hàm số f: R -> R thỏa mãn:\nf(x + f(y)) = f(x) + y với mọi số thực x, y.',
        solution: 'Cho x = 0: f(f(y)) = f(0) + y (1).\nTừ (1), f là song ánh (toàn ánh và đơn ánh).\nThay y = 0: f(x + f(0)) = f(x) (2).\nVì f là đơn ánh, từ (2) suy ra x + f(0) = x <=> f(0) = 0.\nThay f(0) = 0 vào (1): f(f(y)) = y (3).\nÁp dụng phương trình ban đầu cho x = f(t):\nf(f(t) + f(y)) = f(f(t)) + y = t + y.\nLấy f hai vế và dùng (3): f(t) + f(y) = f(t + y).\nVậy f thỏa mãn phương trình hàm Cauchy: f(x) = cx.\nThay f(x) = cx vào phương trình ban đầu:\nc(x + cy) = cx + y <=> c*x + c^2*y = c*x + y <=> c^2 = 1 => c = 1 hoặc c = -1.\nThử lại cả 2 hàm f(x) = x và f(x) = -x: f(x) = x thỏa mãn.',
        keyFormulasOrHints: ['Phương trình hàm Cauchy', 'Chứng minh tính đơn ánh']
      }
    ],
    fullWordDocContent: `OLYMPIC TRUYỀN THỐNG 30/4 LẦN THỨ XXX\nĐỀ THI CHÍNH THỨC MÔN TOÁN LỚP 10\n...`
  },
  {
    id: 'math-07',
    subject: 'math',
    subjectTag: 'Toán 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2024-2025',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Toán – THPT Chuyên Lam Sơn Thanh Hóa',
    school: 'THPT Chuyên Lam Sơn – Thanh Hóa',
    source: 'Sở GD&ĐT Thanh Hóa',
    timeMinutes: 150,
    featuredSnippet: '"Câu 3 (2.0 điểm): Tìm tất cả các cặp số nguyên (x, y) thỏa mãn phương trình: x^2 + 2y^2 + 2xy + 3x + 3y - 4 = 0..."',
    topics: ['# Phương trình nghiệm nguyên', '# Số học Diophantine', '# Kẹp khoảng'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Câu 3',
        points: '2.0 điểm',
        content: 'Tìm các nghiệm nguyên (x; y) của phương trình:\nx^2 - 2xy + 5y^2 = y + 1.',
        solution: 'Coi phương trình là bậc hai đối với x:\nx^2 - 2yx + (5y^2 - y - 1) = 0.\nĐể phương trình có nghiệm thực, biệt thức Delta\' >= 0:\nDelta\' = y^2 - (5y^2 - y - 1) = -4y^2 + y + 1 >= 0\n<=> 4y^2 - y - 1 <= 0.\nNghiệm của tam thức: (1 - sqrt(17)) / 8 <= y <= (1 + sqrt(17)) / 8.\nDo y nguyên nên y chỉ có thể nhận giá trị y = 0.\nVới y = 0: x^2 = 1 => x = ±1.\nVậy các cặp nghiệm nguyên thỏa mãn là (1; 0) và (-1; 0).',
        keyFormulasOrHints: ['Delta\' >= 0 để chặn miền nghiệm nguyên']
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT THANH HÓA - THPT CHUYÊN LAM SƠN\nĐỀ THI TUYỂN SINH VÀO LỚP 10 CHUYÊN TOÁN\n...`
  },
  {
    id: 'math-08',
    subject: 'math',
    subjectTag: 'Toán 12',
    categoryTag: 'Khảo Sát Chất Lượng',
    academicYear: '2025-2026',
    title: 'Đề Khảo Sát Toán 12 Chuyên Đề Tích Phân & Ứng Dụng – THPT Chuyên Phan Bội Châu',
    school: 'THPT Chuyên Phan Bội Châu – Nghệ An',
    source: 'Chuyên Phan Bội Châu',
    timeMinutes: 90,
    featuredSnippet: '"Câu 42: Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số y = x^3 - 3x và trục hoành Ox..."',
    topics: ['# Tích phân & Diện tích', '# Hình phẳng Ox', '# Tích phân từng phần'],
    difficulty: 'Khá',
    questions: [
      {
        number: 'Câu 42',
        points: '0.2 điểm',
        content: 'Tính diện tích S của hình phẳng giới hạn bởi đồ thị hàm số y = x^3 - 4x và trục hoành.',
        solution: 'Phương trình hoành độ giao điểm: x^3 - 4x = 0 <=> x(x - 2)(x + 2) = 0 => x in {-2, 0, 2}.\nDo tính chất đối xứng của hàm lẻ y = x^3 - 4x qua gốc tọa độ O:\nS = 2 * tích_phân từ 0 đến 2 của |x^3 - 4x| dx = 2 * tích_phân từ 0 đến 2 của (4x - x^3) dx\n= 2 * [2x^2 - x^4 / 4] thế cận từ 0 đến 2\n= 2 * [2(4) - 16 / 4] = 2 * (8 - 4) = 8 (đơn vị diện tích).',
        keyFormulasOrHints: ['S = tích_phân |f(x)| dx', 'Hàm lẻ có diện tích 2 miền đối xứng bằng nhau']
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN PHAN BỘI CHÂU NGHỆ AN\nKHẢO SÁT CHUYÊN ĐỀ TÍCH PHÂN & HÌNH HỌC\n...`
  },
  {
    id: 'math-09',
    subject: 'math',
    subjectTag: 'Toán 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Toán – Phổ Thông Năng Khiếu ĐHQG TP.HCM',
    school: 'Trường Phổ Thông Năng Khiếu – ĐHQG TP.HCM',
    source: 'ĐHQG TP.HCM',
    timeMinutes: 150,
    featuredSnippet: '"Bài 5 (1.5 điểm): Cho đa giác đều 2024 đỉnh. Chọn ngẫu nhiên 3 đỉnh của đa giác. Tính xác suất để 3 đỉnh được chọn tạo thành một tam giác vuông..."',
    topics: ['# Tổ hợp & Xác suất', '# Đa giác đều', '# Tam giác vuông'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 5',
        points: '1.5 điểm',
        content: 'Cho đa giác đều có 20 đỉnh nội tiếp đường tròn (O). Chọn ngẫu nhiên 3 đỉnh. Tính số tam giác vuông được tạo thành từ 3 đỉnh đó.',
        solution: 'Một tam giác nội tiếp đường tròn là tam giác vuông khi và chỉ khi có 1 cạnh là đường kính của đường tròn.\nSố đường kính nối 2 đỉnh đối diện của đa giác 20 đỉnh: N = 20 / 2 = 10 đường kính.\nMỗi đường kính kết hợp với bất kỳ 1 trong (20 - 2) = 18 đỉnh còn lại sẽ tạo thành một tam giác vuông.\nSố tam giác vuông tạo thành là: 10 * 18 = 180 tam giác vuông.',
        keyFormulasOrHints: ['Đường kính chắn nửa đường tròn', 'Số tam giác vuông = (n/2) * (n - 2)']
      }
    ],
    fullWordDocContent: `TRƯỜNG PHỔ THÔNG NĂNG KHIẾU - ĐHQG TP.HCM\nĐỀ THI TUYỂN SINH LỚP 10 NĂM HỌC 2025 - 2026\nMÔN THI: TOÁN CHUYÊN\n...`
  },
  {
    id: 'math-10',
    subject: 'math',
    subjectTag: 'Toán 12',
    categoryTag: 'HSG Quốc Gia',
    academicYear: '2024-2025',
    title: 'Đề Thi Chọn Học Sinh Giỏi Quốc Gia Môn Toán – Ngày 1',
    school: 'Bộ Giáo Dục và Đào Tạo',
    source: 'Đề thi chọn HSG Quốc Gia (VMO)',
    timeMinutes: 180,
    featuredSnippet: '"Bài 1 (5.0 điểm): Cho dãy số (x_n) xác định bởi x_1 = 2 và x_{n+1} = (x_n^2 + 2)/(2x_n). Chứng minh dãy số có giới hạn hữu hạn và tìm giới hạn đó..."',
    topics: ['# Dãy số & Giới hạn', '# Dãy đơn điệu bị chặn', '# Phương pháp Newton-Raphson'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 1',
        points: '5.0 điểm',
        content: 'Cho dãy số (x_n) xác định bởi: x_1 = 2 và x_{n+1} = 0.5 * (x_n + 2 / x_n) với mọi n >= 1. Chứng minh dãy số (x_n) hội tụ và tìm lim(x_n).',
        solution: 'Theo bất đẳng thức AM-GM: x_{n+1} = 0.5 * (x_n + 2/x_n) >= sqrt(x_n * 2/x_n) = sqrt(2) với mọi n >= 1.\nDo đó x_n >= sqrt(2) với mọi n >= 2 (bị chặn dưới).\nXét hiệu x_{n+1} - x_n = 0.5 * (2/x_n - x_n) = (2 - x_n^2) / (2x_n).\nVì x_n >= sqrt(2) nên 2 - x_n^2 <= 0 => x_{n+1} <= x_n với mọi n >= 2.\nVậy dãy (x_n) giảm và bị chặn dưới bởi sqrt(2) nên theo định lý Weierstrass, dãy có giới hạn hữu hạn L >= sqrt(2).\nChuyển qua giới hạn: L = 0.5 * (L + 2/L) <=> 2L^2 = L^2 + 2 <=> L^2 = 2 => L = sqrt(2).\nVậy lim x_n = sqrt(2).',
        keyFormulasOrHints: ['AM-GM chặn dưới sqrt(2)', 'Dãy giảm và bị chặn dưới => Hội tụ']
      }
    ],
    fullWordDocContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nKỲ THI CHỌN HỌC SINH GIỎI QUỐC GIA LỚP 12 THPT\nMÔN: TOÁN (VMO)\n...`
  },

  // ==========================================
  // 10 ĐỀ THI TIN HỌC (COMPUTER SCIENCE EXAMS)
  // ==========================================
  {
    id: 'cs-01',
    subject: 'cs',
    subjectTag: 'Tin Học 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Tin – THPT Chuyên KHTN – ĐHQG Hà Nội',
    school: 'THPT Chuyên Khoa Học Tự Nhiên – ĐHQG Hà Nội',
    source: 'Hội đồng tuyển sinh Chuyên Tin KHTN',
    timeMinutes: 150,
    featuredSnippet: '"Bài 1: MATRIX - Cho ma trận số nguyên A kích thước N x M. Tìm đường đi từ ô (1, 1) đến ô (N, M) chỉ đi sang phải hoặc xuống dưới sao cho tổng các ô là lớn nhất..."',
    topics: ['# Quy hoạch động ma trận', '# Mảng 2 chiều', '# Tối ưu hóa bộ nhớ'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 1 (MATRIX)',
        points: '30 điểm',
        content: 'Cho bảng số A kích thước N x M (1 <= N, M <= 1000). Từ ô (i, j) chỉ được di chuyển sang ô (i+1, j) hoặc (i, j+1). Hãy tìm đường đi từ (1, 1) đến (N, M) có tổng giá trị lớn nhất.',
        solution: 'Quy hoạch động 2 chiều:\nGọi dp[i][j] là tổng lớn nhất khi đi từ (1, 1) đến (i, j).\nCông thức chuyển trạng thái:\ndp[i][j] = A[i][j] + max(dp[i-1][j], dp[i][j-1]) với i, j >= 1.\nKhởi tạo: dp[1][1] = A[1][1].\nKết quả: dp[N][M].\nĐộ phức tạp: O(N * M) thời gian và O(M) bộ nhớ nếu tối ưu mảng 1 chiều.',
        keyFormulasOrHints: ['dp[i][j] = A[i][j] + max(dp[i-1][j], dp[i][j-1])'],
        simulationLink: { type: 'cs', targetId: 'KNAPSACK', label: 'Mở bài tập Quy hoạch động tương tự trong Code Judge' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN KHTN - ĐHQG HÀ NỘI\nĐỀ THI TUYỂN SINH LỚP 10 CHUYÊN TIN NĂM 2025\n...`
  },
  {
    id: 'cs-02',
    subject: 'cs',
    subjectTag: 'Tin Học Chuyên',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Tin – THPT Chuyên Hà Nội - Amsterdam',
    school: 'THPT Chuyên Hà Nội - Amsterdam',
    source: 'Sở GD&ĐT Hà Nội',
    timeMinutes: 150,
    featuredSnippet: '"Bài 2: SUBARRAY - Cho dãy gồm N số nguyên và số nguyên K. Tìm độ dài dãy con liên tiếp ngắn nhất có tổng các phần tử không nhỏ hơn K..."',
    topics: ['# Two Pointers', '# Tìm kiếm nhị phân', '# Dãy con liên tiếp'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 2 (SUBARRAY)',
        points: '35 điểm',
        content: 'Cho mảng gồm N số nguyên dương A[1..N] và số nguyên S. Tìm độ dài nhỏ nhất của một mảng con liên tiếp có tổng >= S. Nếu không có, in ra 0. Ràng buộc: N <= 10^5.',
        solution: 'Sử dụng kỹ thuật hai con trỏ (Two Pointers / Sliding Window):\nKhởi tạo left = 0, current_sum = 0, min_len = vô cùng.\nDuyệt right từ 0 đến N-1:\n  current_sum += A[right]\n  Trong khi current_sum >= S:\n    min_len = min(min_len, right - left + 1)\n    current_sum -= A[left]\n    left++\nNếu min_len vẫn là vô cùng thì in 0, ngược lại in min_len.\nĐộ phức tạp O(N) thời gian, O(1) không gian nhớ.',
        keyFormulasOrHints: ['Kỹ thuật hai con trỏ (Two Pointers) O(N)'],
        simulationLink: { type: 'cs', targetId: 'BINSEARCH', label: 'Chạy thử thuật toán tìm kiếm trong Code Judge' }
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT HÀ NỘI - CHUYÊN HÀ NỘI AMSTERDAM\nĐỀ THI TUYỂN SINH LỚP 10 CHUYÊN TIN\n...`
  },
  {
    id: 'cs-03',
    subject: 'cs',
    subjectTag: 'Tin Học 12',
    categoryTag: 'HSG Quốc Gia',
    academicYear: '2024-2025',
    title: 'Đề Thi Học Sinh Giỏi Quốc Gia THPT Môn Tin Học – Bài 1 (VNOI / Bộ GD&ĐT)',
    school: 'Bộ Giáo Dục và Đào Tạo',
    source: 'Đề thi chính thức HSG Quốc Gia (VOI)',
    timeMinutes: 180,
    featuredSnippet: '"Bài 1: SOUVENIR - Bờ biển có N cửa hàng quà lưu niệm. Cần chọn một tập hợp các cửa hàng thỏa mãn điều kiện khoảng cách và ngân sách tối đa..."',
    topics: ['# Quy hoạch động', '# Chặt nhị phân kết quả', '# Mảng cộng dồn'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 1 (SOUVENIR)',
        points: '20 điểm',
        content: 'Cho N cửa hàng trên trục số tọa độ x_1 < x_2 < ... < x_N. Cần chọn K cửa hàng sao cho khoảng cách giữa hai cửa hàng gần nhau nhất là lớn nhất có thể. Ràng buộc: N <= 10^5, K <= N, x_i <= 10^9.',
        solution: 'Đây là bài toán kinh điển: Chặt nhị phân kết quả (Binary Search on Answer):\nKhoảng cách d khả dĩ nằm trong [1, x_N - x_1].\nHàm check(d): Liệu có thể chọn được ít nhất K cửa hàng với khoảng cách giữa 2 cửa hàng kề nhau >= d không?\nCách tham lam check(d): Luôn chọn cửa hàng đầu tiên x_1. Khi đã chọn x_last, cửa hàng tiếp theo chọn là x_i nhỏ nhất thỏa mãn x_i - x_last >= d. Đếm số cửa hàng chọn được.\nNếu đếm >= K thì return true, ngược lại false.\nĐộ phức tạp: O(N * log(x_N - x_1)).',
        keyFormulasOrHints: ['Binary search trên khoảng cách d', 'Greedy check()']
      }
    ],
    fullWordDocContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nKỲ THI CHỌN HỌC SINH GIỎI QUỐC GIA THPT\nMÔN: TIN HỌC (VOI)\n...`
  },
  {
    id: 'cs-04',
    subject: 'cs',
    subjectTag: 'Tin Học 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Tin – THPT Chuyên Lê Hồng Phong TP.HCM',
    school: 'THPT Chuyên Lê Hồng Phong TP.HCM',
    source: 'Sở GD&ĐT TP.HCM',
    timeMinutes: 150,
    featuredSnippet: '"Bài 2: PALIN - Cho chuỗi ký tự S. Tìm số phép chèn ký tự ít nhất để chuỗi S trở thành chuỗi đối xứng (Palindrome)..."',
    topics: ['# Quy hoạch động xâu', '# Chuỗi đối xứng', '# LCS'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 2 (PALIN)',
        points: '30 điểm',
        content: 'Cho chuỗi S độ dài N (N <= 2000). Tìm số ký tự ít nhất cần thêm vào chuỗi S để thu được một chuỗi Palindrome (đối xứng).',
        solution: 'Cách 1: Quy hoạch động 2 biến dp[i][j]:\nSố ký tự cần thêm vào chuỗi con S[i..j] để thành Palindrome:\nNếu S[i] == S[j]: dp[i][j] = dp[i+1][j-1]\nNếu S[i] != S[j]: dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1]).\nCách 2: Số ký tự thêm = N - độ dài xâu con chung dài nhất giữa S và S_reverse (LCS).\nĐộ phức tạp O(N^2) thời gian và bộ nhớ.',
        keyFormulasOrHints: ['dp[i][j] = S[i]==S[j] ? dp[i+1][j-1] : 1 + min(...)'],
        simulationLink: { type: 'cs', targetId: 'PALINDROME', label: 'Mở bài tập Palindrome trong Code Judge' }
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT TP.HCM - THPT CHUYÊN LÊ HỒNG PHONG\nĐỀ THI TUYỂN SINH LỚP 10 CHUYÊN TIN\n...`
  },
  {
    id: 'cs-05',
    subject: 'cs',
    subjectTag: 'Tin Học 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Tin – THPT Chuyên Sư Phạm Hà Nội',
    school: 'THPT Chuyên Đại Học Sư Phạm Hà Nội',
    source: 'ĐH Sư Phạm Hà Nội',
    timeMinutes: 150,
    featuredSnippet: '"Bài 3: PRIMEPATH - Tìm số bước ít nhất để biến đổi số nguyên tố P thành số nguyên tố Q có cùng 4 chữ số, mỗi bước chỉ đổi 1 chữ số..."',
    topics: ['# Sàng số nguyên tố', '# Duyệt đồ thị BFS', '# Hàng đợi queue'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 3 (PRIMEPATH)',
        points: '35 điểm',
        content: 'Cho hai số nguyên tố 4 chữ số P và Q (1000 <= P, Q <= 9999). Mỗi bước ta có thể thay đổi đúng 1 chữ số của số hiện tại để tạo ra một số nguyên tố 4 chữ số mới. Tìm số bước ít nhất để đi từ P đến Q.',
        solution: '1. Dùng sàng Eratosthenes tiền xử lý các số nguyên tố có 4 chữ số (mảng isPrime từ 1000 đến 9999).\n2. Xây dựng đồ thị: Mỗi số nguyên tố 4 chữ số là 1 đỉnh. Hai đỉnh nối với nhau nếu chỉ khác nhau đúng 1 chữ số.\n3. Dùng thuật toán tìm kiếm theo chiều rộng (BFS) từ đỉnh P:\n  - Khởi tạo queue chứa P, dist[P] = 0.\n  - Lấy u ra khỏi queue, duyệt tất cả các số v khác u 1 chữ số và isPrime[v] == true:\n    Nếu chưa thăm v: dist[v] = dist[u] + 1; push v vào queue.\n    Nếu v == Q: Trả về dist[Q].\nĐộ phức tạp O(V + E) với V <= 1061 số nguyên tố.',
        keyFormulasOrHints: ['Sàng Eratosthenes', 'BFS đường đi ngắn nhất đồ thị không trọng số'],
        simulationLink: { type: 'cs', targetId: 'PRIME', label: 'Xem thuật toán số nguyên tố trong Code Judge' }
      }
    ],
    fullWordDocContent: `TRƯỜNG THPT CHUYÊN ĐH SƯ PHẠM HÀ NỘI\nĐỀ THI TUYỂN SINH CHUYÊN TIN NĂM 2025\n...`
  },
  {
    id: 'cs-06',
    subject: 'cs',
    subjectTag: 'Tin Học 10-11',
    categoryTag: 'Olympic 30/4',
    academicYear: '2025-2026',
    title: 'Đề Thi Olympic Tin Học Miền Trung & Tây Nguyên – Bảng Chuyên',
    school: 'Trường ĐH Công Nghệ Thông Tin & Truyền Thông Việt - Hàn đăng cai',
    source: 'Kỳ thi Olympic Tin Học Miền Trung - Tây Nguyên',
    timeMinutes: 180,
    featuredSnippet: '"Bài 2: TOWER - Xây dựng tháp từ N khối hộp có kích thước dài, rộng, cao. Khối đặt trên phải có đáy nhỏ hơn khối đặt dưới..."',
    topics: ['# Quy hoạch động DAG', '# Sắp xếp mảng', '# Bài toán xếp hộp'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 2 (TOWER)',
        points: '40 điểm',
        content: 'Có N loại khối hộp chữ nhật (được dùng số lượng không giới hạn). Mỗi hộp có ba kích thước (x, y, z). Một hộp chỉ có thể đặt lên trên hộp khác nếu cả chiều dài và chiều rộng đáy của nó đều nhỏ hơn hộp dưới. Hãy tìm chiều cao lớn nhất có thể xếp được.',
        solution: 'Với mỗi hộp có kích thước (a, b, c), do có thể xoay hộp theo 3 hướng khác nhau để tạo mặt đáy, ta tạo ra 3 biến thể:\n(a, b) cao c; (a, c) cao b; (b, c) cao a (luôn chuẩn hóa dài >= rộng).\nSắp xếp tất cả các mặt đáy giảm dần theo diện tích.\nÁp dụng Quy hoạch động tìm dãy con tăng dần dài nhất (LIS):\nGọi dp[i] là chiều cao lớn nhất khi chọn hộp i làm đỉnh tháp.\ndp[i] = h[i] + max({dp[j] | hộp i đặt vừa trên hộp j}).\nKết quả là max(dp[i]).',
        keyFormulasOrHints: ['Nhân 3 biến thể xoay hộp', 'LIS Quy hoạch động O(N^2)']
      }
    ],
    fullWordDocContent: `BAN TỔ CHỨC OLYMPIC TIN HỌC MIỀN TRUNG - TÂY NGUYÊN\nĐỀ THI CHÍNH THỨC BẢNG CHUYÊN TIN\n...`
  },
  {
    id: 'cs-07',
    subject: 'cs',
    subjectTag: 'Tin Học Trẻ',
    categoryTag: 'HSG Quốc Gia',
    academicYear: '2024-2025',
    title: 'Đề Thi Hội Thi Tin Học Trẻ Toàn Quốc – Bảng C (THPT Chuyên)',
    school: 'Trung Ương Đoàn TNCS Hồ Chí Minh',
    source: 'Hội đồng giám khảo Tin Học Trẻ Toàn Quốc',
    timeMinutes: 150,
    featuredSnippet: '"Bài 1: CONNECT - Cho đồ thị vô hướng N đỉnh, M cạnh. Hãy đếm số lượng thành phần liên thông và tìm đỉnh có bậc lớn nhất..."',
    topics: ['# Đồ thị DFS / BFS', '# Disjoint Set Union (DSU)', '# Đếm thành phần liên thông'],
    difficulty: 'Khá',
    questions: [
      {
        number: 'Bài 1 (CONNECT)',
        points: '30 điểm',
        content: 'Cho đồ thị vô hướng G có N đỉnh và M cạnh (N <= 10^5, M <= 2*10^5). Đếm số lượng thành phần liên thông của đồ thị và tìm kích thước của thành phần liên thông lớn nhất.',
        solution: 'Sử dụng cấu trúc dữ liệu Disjoint Set Union (DSU) với tối ưu gộp theo kích thước (union by rank/size) và nén đường đi (path compression):\n1. Khởi tạo parent[i] = i, sz[i] = 1.\n2. Duyệt qua từng cạnh (u, v): Hợp nhất tập hợp chứa u và v nếu khác nhau: union(u, v).\n3. Đếm số đỉnh có parent[i] == i là số thành phần liên thông.\n4. Kích thước lớn nhất là max(sz[find(i)]).\nĐộ phức tạp: O(M * alpha(N)) gần như tuyến tính.',
        keyFormulasOrHints: ['DSU với nén đường đi', 'Đếm thành phần liên thông O(M alpha(N))']
      }
    ],
    fullWordDocContent: `TRUNG ƯƠNG ĐOÀN TNCS HỒ CHÍ MINH\nHỘI THI TIN HỌC TRẺ TOÀN QUỐC\nBẢNG C - KHỐI THPT CHUYÊN\n...`
  },
  {
    id: 'cs-08',
    subject: 'cs',
    subjectTag: 'Tin Học 9-10',
    categoryTag: 'Tuyển Sinh Chuyên',
    academicYear: '2025-2026',
    title: 'Đề Tuyển Sinh Lớp 10 Chuyên Tin – Phổ Thông Năng Khiếu ĐHQG TP.HCM',
    school: 'Trường Phổ Thông Năng Khiếu – ĐHQG TP.HCM',
    source: 'Hội đồng tuyển sinh PTNK',
    timeMinutes: 150,
    featuredSnippet: '"Bài 1: GAME - Hai người chơi luân phiên bốc từ 1 đến 3 viên sỏi từ đống N sỏi. Người bốc viên sỏi cuối cùng sẽ thắng. Hãy tìm chiến thuật thắng..."',
    topics: ['# Lý thuyết trò chơi (Game Theory)', '# Trạng thái P-position & N-position', '# Toán rời rạc'],
    difficulty: 'Khá',
    questions: [
      {
        number: 'Bài 1 (GAME)',
        points: '25 điểm',
        content: 'Có một đống gồm N viên sỏi (N <= 10^9). Hai bạn An và Bình lần lượt bốc sỏi, An đi trước. Mỗi lượt một người chỉ được bốc từ 1 đến K viên sỏi (K >= 2). Người bốc viên sỏi cuối cùng là người chiến thắng. Hỏi ai là người có chiến thuật chắc chắn thắng?',
        solution: 'Bài toán Nim cơ bản (Trò chơi Bachet):\nNếu N chia hết cho (K + 1): Bất kể An bốc x viên (1 <= x <= K), Bình luôn có thể bốc (K + 1 - x) viên để đưa số sỏi còn lại về một bội số mới của (K + 1). Cuối cùng Bình sẽ bốc viên sỏi cuối cùng => Bình thắng (Trạng thái P-position thua cho người đi trước).\nNếu N không chia hết cho (K + 1): An chỉ cần bốc (N mod (K + 1)) viên ở lượt đầu tiên, để lại cho Bình một số sỏi chia hết cho (K + 1). Từ đó An đóng vai trò người kiểm soát => An thắng.\nKết luận: Nếu N % (K + 1) != 0 thì An thắng, ngược lại Bình thắng. Thời gian O(1).',
        keyFormulasOrHints: ['N % (K + 1) != 0 => Người đi trước thắng']
      }
    ],
    fullWordDocContent: `TRƯỜNG PHỔ THÔNG NĂNG KHIẾU - ĐHQG TP.HCM\nĐỀ THI TUYỂN SINH VÀO LỚP 10 CHUYÊN TIN HỌC\n...`
  },
  {
    id: 'cs-09',
    subject: 'cs',
    subjectTag: 'Tin Học 10',
    categoryTag: 'Duyên Hải Bắc Bộ',
    academicYear: '2025-2026',
    title: 'Đề Thi Học Sinh Giỏi Duyên Hải & Đồng Bằng Bắc Bộ Môn Tin Học Khối 10',
    school: 'Khu vực Duyên Hải & Đồng Bằng Bắc Bộ',
    source: 'Hội đồng đề thi Duyên Hải',
    timeMinutes: 180,
    featuredSnippet: '"Bài 2: SEGMENT - Cho mảng A gồm N phần tử. Thực hiện Q truy vấn cập nhật giá trị phần tử và tính tổng đoạn [L, R]..."',
    topics: ['# Segment Tree (Cây phân đoạn)', '# Fenwick Tree (BIT)', '# Cập nhật điểm & truy vấn đoạn'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 2 (SEGMENT)',
        points: '35 điểm',
        content: 'Cho mảng A có N phần tử (N <= 10^5) và Q truy vấn (Q <= 10^5). Có 2 loại truy vấn:\n1 u v: Gán A[u] = v.\n2 l r: Tính tổng các phần tử từ A[l] đến A[r].',
        solution: 'Sử dụng Cây chỉ số nhị phân (Fenwick Tree / Binary Indexed Tree) hoặc Segment Tree:\nVới Fenwick Tree:\n- Hàm update(u, diff): Thêm diff vào vị trí u, nhảy u += u & (-u) trong O(log N).\n- Hàm query(p): Tính tổng từ 1 đến p bằng cách nhảy p -= p & (-p) trong O(log N).\n- Tổng đoạn [l, r] = query(r) - query(l - 1).\nĐộ phức tạp tổng thể: O((N + Q) * log N), bộ nhớ O(N).',
        keyFormulasOrHints: ['BIT: p += p & (-p) và p -= p & (-p)', 'Truy vấn đoạn trong O(log N)']
      }
    ],
    fullWordDocContent: `HỘI CÁC TRƯỜNG CHUYÊN DUYÊN HẢI VÀ ĐỒNG BẰNG BẮC BỘ\nĐỀ THI MÔN TIN HỌC KHỐI 10\n...`
  },
  {
    id: 'cs-10',
    subject: 'cs',
    subjectTag: 'Tin Học 12',
    categoryTag: 'HSG Quốc Gia',
    academicYear: '2024-2025',
    title: 'Đề Tuyển Chọn Đội Tuyển Dự Thi HSG Quốc Gia Môn Tin Học – Thừa Thiên Huế',
    school: 'Sở GD&ĐT Thừa Thiên Huế',
    source: 'Kỳ thi chọn đội tuyển HSGQG tỉnh Thừa Thiên Huế',
    timeMinutes: 180,
    featuredSnippet: '"Bài 3: DIJKSTRA - Cho mạng lưới giao thông gồm N giao lộ và M con đường có trọng số không âm. Tìm đường đi ngắn nhất từ đỉnh 1 đến đỉnh N..."',
    topics: ['# Thuật toán Dijkstra', '# Hàng đợi ưu tiên (priority_queue)', '# Đường đi ngắn nhất'],
    difficulty: 'Chuyên / HSG',
    questions: [
      {
        number: 'Bài 3 (DIJKSTRA)',
        points: '40 điểm',
        content: 'Cho đồ thị có hướng có trọng số N đỉnh và M cạnh (N <= 10^5, M <= 2*10^5), trọng số mỗi cạnh không âm. Tìm khoảng cách ngắn nhất từ đỉnh 1 đến tất cả các đỉnh còn lại.',
        solution: 'Áp dụng thuật toán Dijkstra tối ưu bằng hàng đợi ưu tiên (priority_queue / Min-heap):\n1. Khởi tạo mảng d[1..N] = vô cùng, d[1] = 0.\n2. Đưa cặp (d[1] = 0, đỉnh 1) vào priority_queue.\n3. Khi priority_queue chưa rỗng:\n   Lấy ra đỉnh u có d[u] nhỏ nhất.\n   Nếu d[u] đã bị làm lỏng bởi bước trước đó, bỏ qua.\n   Duyệt mọi đỉnh kề v với cạnh có trọng số w:\n     Nếu d[v] > d[u] + w:\n       d[v] = d[u] + w; push (d[v], v) vào priority_queue.\nĐộ phức tạp: O((N + M) * log N).',
        keyFormulasOrHints: ['priority_queue<pair<long long, int>, ...>', 'Dijkstra O((N+M)log N)']
      }
    ],
    fullWordDocContent: `SỞ GD&ĐT THỪA THIÊN HUẾ\nKỲ THI CHỌN ĐỘI TUYỂN DỰ THI HỌC SINH GIỎI QUỐC GIA\nMÔN THI: TIN HỌC\n...`
  }
];
