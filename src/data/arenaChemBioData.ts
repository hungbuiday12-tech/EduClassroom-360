import { ArenaDivisionId, ArenaEssayPrompt, ArenaQuestionMCQ } from '../types';

export const CHEM_BIO_BASE_MCQ: {
  chemistry: ArenaQuestionMCQ[];
  biology: ArenaQuestionMCQ[];
} = {
  chemistry: [
    {
      id: 'ac-chem-1',
      subject: 'chemistry',
      grade: 'Lớp 9 - 10',
      question: 'Dung dịch nào sau đây làm quỳ tím chuyển sang màu xanh?',
      options: ['$\\text{NaOH}$', '$\\text{HCl}$', '$\\text{NaCl}$', '$\\text{H}_2\\text{SO}_4$'],
      correctIndex: 0,
      explanation: '$\\text{NaOH}$ là bazơ tan (kiềm), phân li ra ion $\\text{OH}^-$ làm quỳ tím hóa xanh.',
      points: 20
    },
    {
      id: 'ac-chem-2',
      subject: 'chemistry',
      grade: 'Lớp 10',
      question: 'Cấu hình electron của nguyên tử Natri ($Z = 11$) ở trạng thái cơ bản là:',
      options: ['$1s^2 2s^2 2p^6 3s^1$', '$1s^2 2s^2 2p^6 3s^2$', '$1s^2 2s^2 2p^5 3s^2$', '$1s^2 2s^2 2p^6 3p^1$'],
      correctIndex: 0,
      explanation: 'Natri có $Z = 11$ electron, phân bố lần lượt vào các phân lớp $1s^2 2s^2 2p^6 3s^1$.',
      points: 20
    },
    {
      id: 'ac-chem-3',
      subject: 'chemistry',
      grade: 'Lớp 11',
      question: 'Dung dịch $\\text{HCl}$ có nồng độ $0{,}01\\text{ M}$ (coi điện li hoàn toàn) có giá trị $\\text{pH}$ bằng:',
      options: ['$2$', '$1$', '$12$', '$3$'],
      correctIndex: 0,
      explanation: 'Với axit mạnh $\\text{HCl}$ $0{,}01\\text{ M} = 10^{-2}\\text{ M}$, $[\\text{H}^+] = 10^{-2}\\text{ M} \\Rightarrow \\text{pH} = -\\log(10^{-2}) = 2$.',
      points: 20
    },
    {
      id: 'ac-chem-4',
      subject: 'chemistry',
      grade: 'Lớp 11',
      question: 'Chất nào sau đây thuộc loại hiđrocacbon không no, mạch hở có một liên kết ba $\\text{C}\\equiv\\text{C}$?',
      options: ['Axetilen ($\\text{C}_2\\text{H}_2$)', 'Etilen ($\\text{C}_2\\text{H}_4$)', 'Metan ($\\text{CH}_4$)', 'Benzen ($\\text{C}_6\\text{H}_6$)'],
      correctIndex: 0,
      explanation: 'Axetilen ($\\text{HC}\\equiv\\text{CH}$) là ankin đơn giản nhất thuộc dãy đồng đẳng $\\text{C}_n\\text{H}_{2n-2}$ ($n \\ge 2$).',
      points: 20
    },
    {
      id: 'ac-chem-5',
      subject: 'chemistry',
      grade: 'Lớp 12',
      question: 'Thủy phân hoàn toàn etyl axetat ($\\text{CH}_3\\text{COOC}_2\\text{H}_5$) trong dung dịch $\\text{NaOH}$ dư, đun nóng thu được muối có công thức là:',
      options: ['$\\text{CH}_3\\text{COONa}$', '$\\text{C}_2\\text{H}_5\\text{COONa}$', '$\\text{HCOONa}$', '$\\text{C}_2\\text{H}_5\\text{ONa}$'],
      correctIndex: 0,
      explanation: 'Phản ứng xà phòng hóa: $\\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{NaOH} \\xrightarrow{t^\\circ} \\text{CH}_3\\text{COONa} + \\text{C}_2\\text{H}_5\\text{OH}$.',
      points: 20
    },
    {
      id: 'ac-chem-6',
      subject: 'chemistry',
      grade: 'Lớp 12',
      question: 'Trong pin điện hóa chuẩn $\\text{Zn}-\\text{Cu}$ ($E^\\circ_{\\text{Zn}^{2+}/\\text{Zn}} = -0{,}76\\text{ V}$, $E^\\circ_{\\text{Cu}^{2+}/\\text{Cu}} = +0{,}34\\text{ V}$), sức điện động chuẩn của pin bằng:',
      options: ['$1{,}10\\text{ V}$', '$0{,}42\\text{ V}$', '$-1{,}10\\text{ V}$', '$0{,}76\\text{ V}$'],
      correctIndex: 0,
      explanation: '$E^\\circ_{\\text{pin}} = E^\\circ_{\\text{catot}} - E^\\circ_{\\text{anot}} = (+0{,}34) - (-0{,}76) = 1{,}10\\text{ V}$.',
      points: 20
    },
    {
      id: 'ac-chem-7',
      subject: 'chemistry',
      grade: 'Lớp 10 - 12',
      question: 'Cho $5{,}6\\text{ gam}$ sắt ($\\text{Fe} = 56$) tác dụng hoàn toàn với dung dịch $\\text{HCl}$ dư. Thể tích khí $\\text{H}_2$ thu được ở điều kiện chuẩn ($25^\\circ\\text{C}, 1\\text{ bar}$, $V_m = 24{,}79\\text{ L/mol}$) gần nhất là:',
      options: ['$2{,}479\\text{ lít}$', '$4{,}958\\text{ lít}$', '$1{,}239\\text{ lít}$', '$3{,}718\\text{ lít}$'],
      correctIndex: 0,
      explanation: '$n_{\\text{Fe}} = \\frac{5{,}6}{56} = 0{,}1\\text{ mol}$. $\\text{Fe} + 2\\text{HCl} \\to \\text{FeCl}_2 + \\text{H}_2\\uparrow \\Rightarrow n_{\\text{H}_2} = 0{,}1\\text{ mol} \\Rightarrow V = 0{,}1 \\times 24{,}79 = 2{,}479\\text{ lít}$.',
      points: 20
    }
  ],
  biology: [
    {
      id: 'ac-bio-1',
      subject: 'biology',
      grade: 'Lớp 9 - 10',
      question: 'Bào quan nào trong tế bào nhân thực được mệnh danh là "nhà máy năng lượng" tổng hợp $\\text{ATP}$ chủ yếu qua hô hấp hiếu khí?',
      options: ['Ti thể', 'Ribôxôm', 'Lưới nội chất trơn', 'Bộ máy Gôngi'],
      correctIndex: 0,
      explanation: 'Ti thể thực hiện chu trình Krebs và chuỗi truyền electron hô hấp để tổng hợp phần lớn $\\text{ATP}$ cho tế bào.',
      points: 20
    },
    {
      id: 'ac-bio-2',
      subject: 'biology',
      grade: 'Lớp 10',
      question: 'Trong quá trình nguyên phân của tế bào sinh dưỡng bình thường ($2n$), các nhiễm sắc thể kép xếp thành một hàng trên mặt phẳng xích đạo của thoi phân bào ở kì nào?',
      options: ['Kì giữa', 'Kì đầu', 'Kì sau', 'Kì cuối'],
      correctIndex: 0,
      explanation: 'Ở kì giữa nguyên phân, NST kép co xoắn cực đại và tập trung thành 1 hàng trên mặt phẳng xích đạo.',
      points: 20
    },
    {
      id: 'ac-bio-3',
      subject: 'biology',
      grade: 'Lớp 11',
      question: 'Sắc tố quang hợp trực tiếp tham gia chuyển hóa quang năng thành hóa năng ($\\text{ATP}$, $\\text{NADPH}$) ở trung tâm phản ứng là:',
      options: ['Diệp lục a ($P_{680}, P_{700}$)', 'Carôtenôit', 'Xantôphyl', 'Phicôbilin'],
      correctIndex: 0,
      explanation: 'Chỉ diệp lục a ở trung tâm phản ứng mới trực tiếp nhận năng lượng kích thích và truyền electron sơ cấp.',
      points: 20
    },
    {
      id: 'ac-bio-4',
      subject: 'biology',
      grade: 'Lớp 12',
      question: 'Một đoạn phân tử ADN mạch kép có $3000$ nuclêôtit, trong đó số nuclêôtit loại $\\text{A}$ chiếm $20\\%$. Số nuclêôtit loại $\\text{G}$ của đoạn ADN này là:',
      options: ['$900$', '$600$', '$1500$', '$300$'],
      correctIndex: 0,
      explanation: 'Theo nguyên tắc bổ sung: $\\%A + \\%G = 50\\% \\Rightarrow \\%G = 50\\% - 20\\% = 30\\%$. Vậy $G = 30\\% \\times 3000 = 900$.',
      points: 20
    },
    {
      id: 'ac-bio-5',
      subject: 'biology',
      grade: 'Lớp 12',
      question: 'Theo Menđen, phép lai $P: Aa \\times Aa$ (trội hoàn toàn) cho đời con $F_1$ có tỉ lệ kiểu hình là:',
      options: ['$3\\text{ trội} : 1\\text{ lặn}$', '$1\\text{ trội} : 1\\text{ lặn}$', '$1 : 2 : 1$', '$9 : 3 : 3 : 1$'],
      correctIndex: 0,
      explanation: '$Aa \\times Aa \\to 1AA : 2Aa : 1aa$. Với trội hoàn toàn, kiểu hình là $3\\text{ trội} : 1\\text{ lặn}$.',
      points: 20
    },
    {
      id: 'ac-bio-6',
      subject: 'biology',
      grade: 'Lớp 12',
      question: 'Quần thể có cấu trúc di truyền $0{,}36\\,AA : 0{,}48\\,Aa : 0{,}16\\,aa$. Tần số alen $A$ của quần thể là:',
      options: ['$0{,}6$', '$0{,}4$', '$0{,}48$', '$0{,}36$'],
      correctIndex: 0,
      explanation: 'Tần số alen $p_A = D + \\frac{H}{2} = 0{,}36 + \\frac{0{,}48}{2} = 0{,}6$.',
      points: 20
    },
    {
      id: 'ac-bio-7',
      subject: 'biology',
      grade: 'Lớp 11 - 12',
      question: 'Trong chuỗi thức ăn đồng cỏ: Cỏ $\\to$ Châu chấu $\\to$ Ếch $\\to$ Rắn $\\to$ Đại bàng, sinh vật tiêu thụ bậc $2$ là:',
      options: ['Ếch', 'Châu chấu', 'Rắn', 'Cỏ'],
      correctIndex: 0,
      explanation: 'Cỏ là sinh vật sản xuất (bậc 1); Châu chấu là SV tiêu thụ bậc 1; Ếch ăn châu chấu là SV tiêu thụ bậc 2.',
      points: 20
    }
  ]
};

export const CHEM_BIO_BASE_ESSAY: {
  chemistry: ArenaEssayPrompt[];
  biology: ArenaEssayPrompt[];
} = {
  chemistry: [
    {
      id: 'ae-chem-1',
      subject: 'chemistry',
      grade: 'Lớp 10 - 12',
      title: 'Cân bằng phương trình oxi hóa - khử & Tính toán theo mol',
      prompt: 'Cho $13{,}0\\text{ gam}$ kẽm ($\\text{Zn} = 65$) tác dụng hoàn toàn với dung dịch $\\text{HNO}_3$ loãng dư, thu được dung dịch $\\text{Zn(NO}_3)_2$, nước và khí $\\text{NO}$ duy nhất (sản phẩm khử duy nhất).\n1. Lập phương trình hóa học của phản ứng theo phương pháp thăng bằng electron.\n2. Tính số mol và thể tích khí $\\text{NO}$ thu được ở điều kiện chuẩn ($24{,}79\\text{ L/mol}$).',
      rubricChecklist: [
        'Xác định đúng số oxi hóa: $\\text{Zn}^0 \\to \\text{Zn}^{+2} + 2e$ và $\\text{N}^{+5} + 3e \\to \\text{N}^{+2}$ (30 điểm)',
        'Cân bằng đúng phương trình: $3\\text{Zn} + 8\\text{HNO}_3 \\to 3\\text{Zn(NO}_3)_2 + 2\\text{NO}\\uparrow + 4\\text{H}_2\\text{O}$ (35 điểm)',
        'Tính đúng $n_{\\text{Zn}} = \\frac{13}{65} = 0{,}2\\text{ mol}$ và $n_{\\text{NO}} = \\frac{2}{3}n_{\\text{Zn}} = \\frac{0{,}4}{3} \\approx 0{,}1333\\text{ mol}$ (20 điểm)',
        'Tính đúng $V_{\\text{NO}} \\approx 0{,}1333 \\times 24{,}79 \\approx 3{,}305\\text{ lít}$ (15 điểm)'
      ],
      referenceSolution: 'Quá trình oxi hóa: $\\text{Zn} \\to \\text{Zn}^{2+} + 2e$ (nhân 3). Quá trình khử: $\\text{N}^{+5} + 3e \\to \\text{N}^{+2}$ (nhân 2). PTHH: $3\\text{Zn} + 8\\text{HNO}_3 \\to 3\\text{Zn(NO}_3)_2 + 2\\text{NO}\\uparrow + 4\\text{H}_2\\text{O}$. Với $n_{\\text{Zn}} = 0{,}2\\text{ mol}$, bảo toàn e: $2n_{\\text{Zn}} = 3n_{\\text{NO}} \\Rightarrow n_{\\text{NO}} = \\frac{0{,}4}{3}\\text{ mol} \\Rightarrow V_{\\text{NO}} \\approx 3{,}305\\text{ lít}$.',
      maxScore: 100
    },
    {
      id: 'ae-chem-2',
      subject: 'chemistry',
      grade: 'Lớp 11 - 12',
      title: 'Bài toán Xà phòng hóa Este & Bảo toàn khối lượng',
      prompt: 'Đun nóng $8{,}8\\text{ gam}$ etyl axetat ($\\text{CH}_3\\text{COOC}_2\\text{H}_5$, $M = 88$) với $150\\text{ mL}$ dung dịch $\\text{NaOH}$ $1\\text{ M}$ đến khi phản ứng xảy ra hoàn toàn, sau đó cô cạn dung dịch thu được $m\\text{ gam}$ chất rắn khan.\n1. Viết phương trình hóa học và xác định chất dư sau phản ứng.\n2. Tính giá trị của $m$.',
      rubricChecklist: [
        'Viết đúng PTHH: $\\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{NaOH} \\xrightarrow{t^\\circ} \\text{CH}_3\\text{COONa} + \\text{C}_2\\text{H}_5\\text{OH}$ (25 điểm)',
        'Tính đúng $n_{\\text{este}} = 0{,}1\\text{ mol}$, $n_{\\text{NaOH}} = 0{,}15\\text{ mol}$ và kết luận $\\text{NaOH}$ dư $0{,}05\\text{ mol}$ (30 điểm)',
        'Xác định đúng rắn khan gồm $0{,}1\\text{ mol } \\text{CH}_3\\text{COONa}$ và $0{,}05\\text{ mol } \\text{NaOH}$ dư (25 điểm)',
        'Tính đúng $m = 0{,}1\\cdot 82 + 0{,}05\\cdot 40 = 10{,}2\\text{ gam}$ (hoặc dùng BTKL: $8{,}8 + 0{,}15\\cdot 40 - 0{,}1\\cdot 46 = 10{,}2\\text{ g}$) (20 điểm)'
      ],
      referenceSolution: '$n_{\\text{este}} = 0{,}1\\text{ mol}; n_{\\text{NaOH}} = 0{,}15\\text{ mol} \\Rightarrow \\text{NaOH}$ dư $0{,}05\\text{ mol}$, ancol bay hơi hết khi cô cạn là $0{,}1\\text{ mol}$. Bảo toàn khối lượng: $m_{\\text{rắn}} = 8{,}8 + 0{,}15\\times 40 - 0{,}1\\times 46 = 10{,}2\\text{ gam}$.',
      maxScore: 100
    }
  ],
  biology: [
    {
      id: 'ae-bio-1',
      subject: 'biology',
      grade: 'Lớp 12',
      title: 'Cấu trúc ADN & Nhân đôi ADN theo nguyên tắc bổ sung',
      prompt: 'Một gen có chiều dài $L = 5100\\text{ \\AA}$, hiệu số phần trăm giữa nuclêôtit loại $\\text{A}$ và loại không bổ sung với nó bằng $10\\%$.\n1. Tính tổng số nuclêôtit ($N$) và số lượng từng loại nuclêôtit của gen.\n2. Nếu gen này nhân đôi liên tiếp $3$ lần, hãy tính số nuclêôtit tự do từng loại mà môi trường nội bào cần cung cấp.',
      rubricChecklist: [
        'Tính đúng $N = \\frac{2L}{3{,}4} = \\frac{2\\cdot 5100}{3{,}4} = 3000$ nuclêôtit (25 điểm)',
        'Giải hệ $\\%A + \\%G = 50\\%$ và $\\%A - \\%G = 10\\%$ suy ra $\\%A = \\%T = 30\\%$, $\\%G = \\%X = 20\\%$ (30 điểm)',
        'Tính đúng $A = T = 900$, $G = X = 600$ (20 điểm)',
        'Tính đúng nhu cầu môi trường sau $k = 3$ lần nhân đôi ($2^3 - 1 = 7$): $A_{\\text{mt}} = T_{\\text{mt}} = 900\\times 7 = 6300$; $G_{\\text{mt}} = X_{\\text{mt}} = 600\\times 7 = 4200$ (25 điểm)'
      ],
      referenceSolution: '$N = \\frac{2L}{3{,}4} = 3000$. Vì $A$ và $G$ không bổ sung nhau: $\\%A+\\%G=50\\%, \\%A-\\%G=10\\% \\Rightarrow \\%A=30\\%, \\%G=20\\%$. Do đó $A=T=900, G=X=600$. Qua 3 lần nhân đôi, môi trường cung cấp $A_{\\text{mt}}=T_{\\text{mt}}=900(2^3-1)=6300$ và $G_{\\text{mt}}=X_{\\text{mt}}=600(2^3-1)=4200$.',
      maxScore: 100
    },
    {
      id: 'ae-bio-2',
      subject: 'biology',
      grade: 'Lớp 11 - 12',
      title: 'Quy luật Menđen & Di truyền học quần thể Hardy-Weinberg',
      prompt: 'Ở một loài thực vật giao phấn ngẫu nhiên, alen $A$ quy định hoa đỏ trội hoàn toàn so với alen $a$ quy định hoa trắng. Một quần thể đang ở trạng thái cân bằng di truyền có $16\\%$ cây hoa trắng ($aa$).\n1. Xác định tần số các alen $A, a$ và thành phần kiểu gen của quần thể.\n2. Nếu lấy ngẫu nhiên một cây hoa đỏ trong quần thể đem tự thụ phấn, xác suất thu được cây hoa trắng ở đời con là bao nhiêu?',
      rubricChecklist: [
        'Từ $q^2(aa) = 0{,}16$ suy ra tần số alen $q_a = 0{,}4$ và $p_A = 1 - 0{,}4 = 0{,}6$ (30 điểm)',
        'Viết đúng cấu trúc cân bằng: $0{,}36\\,AA : 0{,}48\\,Aa : 0{,}16\\,aa$ (25 điểm)',
        'Tính đúng tỉ lệ cây $Aa$ trong số các cây hoa đỏ: $\\frac{0{,}48}{0{,}36 + 0{,}48} = \\frac{4}{7}$ (25 điểm)',
        'Tính đúng xác suất thu được cây hoa trắng $aa$ khi tự thụ phấn: $\\frac{4}{7} \\times \\frac{1}{4} = \\frac{1}{7} \\approx 14{,}29\\%$ (20 điểm)'
      ],
      referenceSolution: 'Quần thể cân bằng có $q^2 = 0{,}16 \\Rightarrow q_a = 0{,}4; p_A = 0{,}6$, cấu trúc $0{,}36AA : 0{,}48Aa : 0{,}16aa$. Trong nhóm hoa đỏ ($0{,}84$), cây dị hợp $Aa$ chiếm $\\frac{0{,}48}{0{,}84} = \\frac{4}{7}$. Khi cây hoa đỏ tự thụ phấn, chỉ cây $Aa$ tạo $aa$ với tỉ lệ $\\frac{1}{4}$, nên xác suất $aa = \\frac{4}{7}\\cdot \\frac{1}{4} = \\frac{1}{7}$.',
      maxScore: 100
    }
  ]
};

export const CHEM_BIO_DIVISION_MCQ: Record<
  ArenaDivisionId,
  { chemistry: ArenaQuestionMCQ[]; biology: ArenaQuestionMCQ[] }
> = {
  '9k': {
    chemistry: [
      {
        id: '9k-ch1',
        subject: 'chemistry',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Oxit nào sau đây là oxit axit tác dụng với nước tạo dung dịch axit?',
        options: ['$\\text{SO}_3$', '$\\text{CaO}$', '$\\text{CuO}$', '$\\text{Fe}_2\\text{O}_3$'],
        correctIndex: 0,
        explanation: '$\\text{SO}_3$ là oxit axit: $\\text{SO}_3 + \\text{H}_2\\text{O} \\to \\text{H}_2\\text{SO}_4$.',
        points: 20
      },
      {
        id: '9k-ch2',
        subject: 'chemistry',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Để nhận biết hai dung dịch $\\text{Na}_2\\text{SO}_4$ và $\\text{NaCl}$, thuốc thử đơn giản nhất là dung dịch:',
        options: ['$\\text{BaCl}_2$', '$\\text{NaOH}$', '$\\text{KNO}_3$', 'Quỳ tím'],
        correctIndex: 0,
        explanation: '$\\text{BaCl}_2$ tạo kết tủa trắng $\\text{BaSO}_4$ không tan với $\\text{Na}_2\\text{SO}_4$, không phản ứng với $\\text{NaCl}$.',
        points: 20
      },
      {
        id: '9k-ch3',
        subject: 'chemistry',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Kim loại nào sau đây **không** phản ứng với dung dịch $\\text{HCl}$ loãng?',
        options: ['$\\text{Cu}$', '$\\text{Fe}$', '$\\text{Zn}$', '$\\text{Mg}$'],
        correctIndex: 0,
        explanation: 'Trong dãy hoạt động hóa học, đồng ($\\text{Cu}$) đứng sau hiđro ($\\text{H}$) nên không đẩy được $\\text{H}_2$ khỏi dung dịch $\\text{HCl}$.',
        points: 20
      },
      {
        id: '9k-ch4',
        subject: 'chemistry',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Khí etilen ($\\text{C}_2\\text{H}_4$) làm mất màu dung dịch nào sau đây ở điều kiện thường?',
        options: ['Dung dịch nước $\\text{Br}_2$', 'Dung dịch $\\text{NaCl}$', 'Nước vôi trong $\\text{Ca(OH)}_2$', 'Dung dịch $\\text{HCl}$'],
        correctIndex: 0,
        explanation: 'Etilen có liên kết đôi $\\text{C}=\\text{C}$ nên tham gia phản ứng cộng làm mất màu da cam của dung dịch $\\text{Br}_2$.',
        points: 20
      },
      {
        id: '9k-ch5',
        subject: 'chemistry',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Độ rượu $40^\\circ$ có nghĩa là trong $100\\text{ mL}$ dung dịch rượu etylic có chứa:',
        options: ['$40\\text{ mL}$ rượu etylic nguyên chất', '$40\\text{ g}$ rượu etylic nguyên chất', '$60\\text{ mL}$ rượu etylic nguyên chất', '$40\\text{ mol}$ rượu etylic'],
        correctIndex: 0,
        explanation: 'Độ rượu là số $\\text{mL}$ rượu etylic nguyên chất có trong $100\\text{ mL}$ hỗn hợp rượu với nước.',
        points: 20
      }
    ],
    biology: [
      {
        id: '9k-bi1',
        subject: 'biology',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Theo quy luật phân li của Menđen, khi lai hai bố mẹ thuần chủng khác nhau về 1 cặp tính trạng tương phản, đời $F_1$ thu được:',
        options: ['Đồng loạt mang tính trạng trội', 'Tỉ lệ $3\\text{ trội} : 1\\text{ lặn}$', 'Tỉ lệ $1\\text{ trội} : 1\\text{ lặn}$', 'Đồng loạt mang tính trạng lặn'],
        correctIndex: 0,
        explanation: 'Lai $P: AA \\times aa \\to F_1: 100\\%\\,Aa$ (đồng tính mang kiểu hình trội).',
        points: 20
      },
      {
        id: '9k-bi2',
        subject: 'biology',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Đơn phân cấu tạo nên phân tử prôtêin là:',
        options: ['Axit amin', 'Nuclêôtit', 'Glucôzơ', 'Axit béo'],
        correctIndex: 0,
        explanation: 'Prôtêin là đại phân tử sinh học cấu tạo theo nguyên tắc đa phân từ các đơn phân là axit amin.',
        points: 20
      },
      {
        id: '9k-bi3',
        subject: 'biology',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Bộ nhiễm sắc thể lưỡng bội của người bình thường ($2n$) bằng:',
        options: ['$46$ NST', '$23$ NST', '$48$ NST', '$44$ NST'],
        correctIndex: 0,
        explanation: 'Người bình thường có $2n = 46$ NST ($22$ cặp NST thường và $1$ cặp NST giới tính $XX$ hoặc $XY$).',
        points: 20
      },
      {
        id: '9k-bi4',
        subject: 'biology',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Quan hệ giữa vi khuẩn cố định đạm *Rhizobium* sống trong nốt sần rễ cây họ Đậu thuộc mối quan hệ sinh thái nào?',
        options: ['Cộng sinh', 'Kí sinh', 'Cạnh tranh', 'Hội sinh'],
        correctIndex: 0,
        explanation: 'Cả hai loài đều có lợi và gắn bó chặt chẽ với nhau (vi khuẩn cung cấp đạm, cây cung cấp chất hữu cơ).',
        points: 20
      },
      {
        id: '9k-bi5',
        subject: 'biology',
        grade: 'Lớp 9 · Không Chuyên',
        question: 'Bệnh Đao (Down) ở người phát sinh do dạng đột biến số lượng nhiễm sắc thể nào?',
        options: ['Thể ba nhiễm ($2n + 1$) ở cặp NST số 21', 'Thể một nhiễm ($2n - 1$) ở cặp NST số 21', 'Thể tam bội ($3n$)', 'Mất đoạn NST số 5'],
        correctIndex: 0,
        explanation: 'Người mắc hội chứng Đao có $3$ chiếc NST ở cặp số $21$ ($47$ NST).',
        points: 20
      }
    ]
  },
  '9c': {
    chemistry: [
      {
        id: '9c-ch1',
        subject: 'chemistry',
        grade: 'Lớp 9 · Chuyên',
        question: 'Hòa tan hoàn toàn $11{,}2\\text{ g}$ hỗn hợp $\\text{Fe}$ và $\\text{CuO}$ bằng dung dịch $\\text{HCl}$ dư thu được $2{,}24\\text{ lít}$ khí $\\text{H}_2$ (đktc cũ $22{,}4\\text{ L/mol}$). Phần trăm khối lượng của $\\text{Fe}$ trong hỗn hợp ban đầu là:',
        options: ['$50\\%$', '$40\\%$', '$60\\%$', '$75\\%$'],
        correctIndex: 0,
        explanation: 'Chỉ $\\text{Fe}$ sinh $\\text{H}_2$: $n_{\\text{Fe}} = n_{\\text{H}_2} = 0{,}1\\text{ mol} \\Rightarrow m_{\\text{Fe}} = 5{,}6\\text{ g} \\Rightarrow \\%m_{\\text{Fe}} = \\frac{5{,}6}{11{,}2}\\cdot 100\\% = 50\\%$.',
        points: 20
      },
      {
        id: '9c-ch2',
        subject: 'chemistry',
        grade: 'Lớp 9 · Chuyên',
        question: 'Sục từ từ khí $\\text{CO}_2$ đến dư vào dung dịch $\\text{Ca(OH)}_2$. Hiện tượng quan sát được theo đúng thứ tự là:',
        options: ['Xuất hiện kết tủa trắng tăng dần đến cực đại rồi tan dần tạo dung dịch trong suốt', 'Chỉ xuất hiện kết tủa trắng không tan', 'Không có hiện tượng gì rồi mới có kết tủa', 'Có khí thoát ra và kết tủa xanh'],
        correctIndex: 0,
        explanation: 'Ban đầu tạo $\\text{CaCO}_3\\downarrow$ trắng; khi $\\text{CO}_2$ dư xảy ra $\\text{CaCO}_3 + \\text{CO}_2 + \\text{H}_2\\text{O} \\to \\text{Ca(HCO}_3)_2$ tan.',
        points: 20
      },
      {
        id: '9c-ch3',
        subject: 'chemistry',
        grade: 'Lớp 9 · Chuyên',
        question: 'Cho $16{,}8\\text{ g}$ kim loại $\\text{Fe}$ vào dung dịch chứa $0{,}4\\text{ mol } \\text{AgNO}_3$. Sau phản ứng hoàn toàn, số mol $\\text{Fe(NO}_3)_3$ thu được là:',
        options: ['$\\text{0{,}05 mol}$', '$\\text{0{,}2 mol}$', '$\\text{0{,}15 mol}$', '$\\text{0 mol}$'],
        correctIndex: 3,
        explanation: '$n_{\\text{Fe}} = 0{,}3\\text{ mol}$; $\\text{Fe} + 2\\text{Ag}^+ \\to \\text{Fe}^{2+} + 2\\text{Ag}$. Cần $0{,}6\\text{ mol } \\text{Ag}^+$ mới hết $\\text{Fe}$, ở đây chỉ có $0{,}4\\text{ mol}$ nên $\\text{Fe}$ dư, chỉ tạo muối $\\text{Fe(NO}_3)_2$, $n_{\\text{Fe(NO}_3)_3} = 0$.',
        points: 20
      },
      {
        id: '9c-ch4',
        subject: 'chemistry',
        grade: 'Lớp 9 · Chuyên',
        question: 'Đốt cháy hoàn toàn $0{,}1\\text{ mol}$ một hiđrocacbon $X$ thu được $0{,}3\\text{ mol } \\text{CO}_2$ và $0{,}3\\text{ mol } \\text{H}_2\\text{O}$. Công thức phân tử của $X$ là:',
        options: ['$\\text{C}_3\\text{H}_6$', '$\\text{C}_3\\text{H}_8$', '$\\text{C}_2\\text{H}_4$', '$\\text{C}_3\\text{H}_4$'],
        correctIndex: 0,
        explanation: 'Số nguyên tử $C = \\frac{0{,}3}{0{,}1} = 3$; số nguyên tử $H = \\frac{2\\cdot 0{,}3}{0{,}1} = 6 \\Rightarrow X$ là $\\text{C}_3\\text{H}_6$.',
        points: 20
      },
      {
        id: '9c-ch5',
        subject: 'chemistry',
        grade: 'Lớp 9 · Chuyên',
        question: 'Ngâm một đinh sắt sạch trong $200\\text{ mL}$ dung dịch $\\text{CuSO}_4$ đến khi phản ứng hoàn toàn thấy khối lượng thanh sắt tăng thêm $0{,}8\\text{ g}$. Số mol $\\text{CuSO}_4$ đã phản ứng là:',
        options: ['$0{,}1\\text{ mol}$', '$0{,}05\\text{ mol}$', '$0{,}2\\text{ mol}$', '$0{,}01\\text{ mol}$'],
        correctIndex: 0,
        explanation: 'Tăng giảm khối lượng: mỗi $1\\text{ mol } \\text{Fe}$ ($56\\text{ g}$) tan ra có $1\\text{ mol } \\text{Cu}$ ($64\\text{ g}$) bám vào làm tăng $8\\text{ g}$. Vậy $n_{\\text{CuSO}_4} = \\frac{0{,}8}{64 - 56} = 0{,}1\\text{ mol}$.',
        points: 20
      }
    ],
    biology: [
      {
        id: '9c-bi1',
        subject: 'biology',
        grade: 'Lớp 9 · Chuyên',
        question: 'Ở cà chua, gen $A$ quy định quả đỏ trội hoàn toàn so với $a$ quy định quả vàng. Cho cây tứ bội $AAaa$ tự thụ phấn (giảm phân tạo giao tử $2n$ bình thường). Tỉ lệ cây quả vàng thu được ở đời con là:',
        options: ['$\\frac{1}{36}$', '$\\frac{1}{4}$', '$\\frac{1}{12}$', '$\\frac{1}{16}$'],
        correctIndex: 0,
        explanation: 'Cơ thể $AAaa$ tạo giao tử với tỉ lệ $\\frac{1}{6}AA : \\frac{4}{6}Aa : \\frac{1}{6}aa$. Giao tử $aa = \\frac{1}{6} \\Rightarrow$ quả vàng $aaaa = \\frac{1}{6} \\times \\frac{1}{6} = \\frac{1}{36}$.',
        points: 20
      },
      {
        id: '9c-bi2',
        subject: 'biology',
        grade: 'Lớp 9 · Chuyên',
        question: 'Một mạch đơn của phân tử ADN có trình tự là $3\'\\text{-ATG XGT AGT-5\'}$. Trình tự của phân tử mARN được phiên mã từ mạch khuôn trên là:',
        options: ['$5\'\\text{-UAX GXA UXA-3\'}$', '$5\'\\text{-TAX GXA TXA-3\'}$', '$3\'\\text{-UAX GXA UXA-5\'}$', '$5\'\\text{-ATG XGT AGT-3\'}$'],
        correctIndex: 0,
        explanation: 'Nguyên tắc bổ sung phiên mã: $A_{\\text{gốc}} \\to U; T_{\\text{gốc}} \\to A; G_{\\text{gốc}} \\to X; X_{\\text{gốc}} \\to G$, chiều mARN là $5\' \\to 3\'$.',
        points: 20
      },
      {
        id: '9c-bi3',
        subject: 'biology',
        grade: 'Lớp 9 · Chuyên',
        question: 'Có $5$ tế bào sinh tinh của một loài động vật ($2n = 8$) thực hiện giảm phân bình thường. Số tinh trùng tối đa tạo thành và tổng số NST trong các tinh trùng đó lần lượt là:',
        options: ['$20$ tinh trùng; $80$ NST', '$10$ tinh trùng; $40$ NST', '$20$ tinh trùng; $160$ NST', '$5$ tinh trùng; $20$ NST'],
        correctIndex: 0,
        explanation: '$5$ tế bào sinh tinh tạo $5 \\times 4 = 20$ tinh trùng; mỗi tinh trùng mang $n = 4$ NST nên tổng số NST $= 20 \\times 4 = 80$.',
        points: 20
      },
      {
        id: '9c-bi4',
        subject: 'biology',
        grade: 'Lớp 9 · Chuyên',
        question: 'Một gen có tổng số $2400$ nuclêôtit và $3120$ liên kết hiđrô. Số nuclêôtit loại $G$ của gen đó bằng:',
        options: ['$720$', '$480$', '$600$', '$360$'],
        correctIndex: 0,
        explanation: 'Ta có $2A + 2G = 2400$ và $2A + 3G = 3120$. Trừ hai phương trình được $G = 3120 - 2400 = 720$.',
        points: 20
      },
      {
        id: '9c-bi5',
        subject: 'biology',
        grade: 'Lớp 9 · Chuyên',
        question: 'Ở người, gen quy định nhóm máu có $3$ alen $I^A, I^B, I^O$. Cặp vợ chồng có kiểu gen $I^A I^O \\times I^B I^O$ có thể sinh con mang nhóm máu nào sau đây?',
        options: ['Cả $4$ nhóm máu $A, B, AB, O$', 'Chỉ nhóm máu $A$ và $B$', 'Chỉ nhóm máu $AB$ và $O$', 'Chỉ nhóm máu $A, B, AB$'],
        correctIndex: 0,
        explanation: '$I^A I^O \\times I^B I^O \\to \\frac{1}{4}I^A I^B (\\text{AB}) : \\frac{1}{4}I^A I^O (\\text{A}) : \\frac{1}{4}I^B I^O (\\text{B}) : \\frac{1}{4}I^O I^O (\\text{O})$.',
        points: 20
      }
    ]
  },
  '10k': {
    chemistry: CHEM_BIO_BASE_MCQ.chemistry.slice(0, 5),
    biology: CHEM_BIO_BASE_MCQ.biology.slice(0, 5)
  },
  '10c': {
    chemistry: [
      {
        id: '10c-ch1',
        subject: 'chemistry',
        grade: 'Lớp 10 · Chuyên',
        question: 'Nguyên tố $X$ có tổng số hạt cơ bản trong nguyên tử là $40$, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là $12$. Số hiệu nguyên tử $Z$ của $X$ là:',
        options: ['$13$', '$12$', '$14$', '$11$'],
        correctIndex: 0,
        explanation: '$2Z + N = 40$ và $2Z - N = 12 \\Rightarrow 4Z = 52 \\Rightarrow Z = 13$ (Nhôm).',
        points: 20
      },
      {
        id: '10c-ch2',
        subject: 'chemistry',
        grade: 'Lớp 10 · Chuyên',
        question: 'Theo quy tắc VSEPR, phân tử nào sau đây có dạng hình học tứ diện đều với góc liên kết $109{,}5^\\circ$?',
        options: ['$\\text{CH}_4$', '$\\text{NH}_3$', '$\\text{H}_2\\text{O}$', '$\\text{BF}_3$'],
        correctIndex: 0,
        explanation: 'Cacbon trong $\\text{CH}_4$ lai hóa $sp^3$, có $4$ cặp electron liên kết và $0$ cặp electron chưa liên kết nên cấu trúc tứ diện đều.',
        points: 20
      },
      {
        id: '10c-ch3',
        subject: 'chemistry',
        grade: 'Lớp 10 · Chuyên',
        question: 'Cho biến thiên enthalpy chuẩn $\\Delta_r H^\\circ_{298}$ của phản ứng $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g)$ bằng $-91{,}8\\text{ kJ}$. Phát biểu nào đúng?',
        options: ['Phản ứng tỏa nhiệt ($\\Delta_r H^\\circ < 0$)', 'Phản ứng thu nhiệt ($\\Delta_r H^\\circ > 0$)', 'Tổng năng lượng chất đầu nhỏ hơn sản phẩm', 'Không thể xảy ra theo chiều thuận'],
        correctIndex: 0,
        explanation: '$\\Delta_r H^\\circ_{298} < 0$ biểu thị phản ứng tỏa nhiệt ra môi trường.',
        points: 20
      },
      {
        id: '10c-ch4',
        subject: 'chemistry',
        grade: 'Lớp 10 · Chuyên',
        question: 'Khi tăng nhiệt độ thêm $20^\\circ\\text{C}$ cho một phản ứng có hệ số nhiệt độ Van’t Hoff $\\gamma = 3$, tốc độ phản ứng sẽ tăng lên bao nhiêu lần?',
        options: ['$9$ lần', '$6$ lần', '$27$ lần', '$3$ lần'],
        correctIndex: 0,
        explanation: 'Áp dụng công thức Van’t Hoff: $\\frac{v_2}{v_1} = \\gamma^{\\frac{\\Delta T}{10}} = 3^{\\frac{20}{10}} = 3^2 = 9$ lần.',
        points: 20
      },
      {
        id: '10c-ch5',
        subject: 'chemistry',
        grade: 'Lớp 10 · Chuyên',
        question: 'Trong phản ứng $\\text{MnO}_2 + 4\\text{HCl} \\to \\text{MnCl}_2 + \\text{Cl}_2 + 2\\text{H}_2\\text{O}$, tỉ lệ số phân tử $\\text{HCl}$ đóng vai trò chất khử so với tổng số phân tử $\\text{HCl}$ tham gia là:',
        options: ['$1 : 2$', '$1 : 4$', '$3 : 4$', '$1 : 1$'],
        correctIndex: 0,
        explanation: 'Trong $4$ phân tử $\\text{HCl}$ phản ứng, có $2$ phân tử bị oxi hóa lên $\\text{Cl}_2$ (chất khử) và $2$ phân tử tạo muối (môi trường) $\\Rightarrow$ tỉ lệ $2/4 = 1/2$.',
        points: 20
      }
    ],
    biology: [
      {
        id: '10c-bi1',
        subject: 'biology',
        grade: 'Lớp 10 · Chuyên',
        question: 'Khi đặt tế bào biểu bì vảy hành tím vào dung dịch đường saccarôzơ ưu trương, hiện tượng nào xảy ra?',
        options: ['Co nguyên sinh (nước thẩm thấu ra ngoài làm màng sinh chất tách khỏi thành tế bào)', 'Tế bào trương nước vỡ ra', 'Không có sự trao đổi nước qua màng', 'Phản co nguyên sinh ngay lập tức'],
        correctIndex: 0,
        explanation: 'Trong môi trường ưu trương (thế nước thấp hơn dịch bào), nước đi ra khỏi không bào qua kênh aquaporin gây co nguyên sinh.',
        points: 20
      },
      {
        id: '10c-bi2',
        subject: 'biology',
        grade: 'Lớp 10 · Chuyên',
        question: 'Chu trình đường phân diễn ra tại tế bào chất biến đổi $1$ phân tử glucôzơ thành $2$ phân tử axit piruvic thu được hiệu quả ròng là:',
        options: ['$2\\text{ ATP}$ và $2\\text{ NADH}$', '$38\\text{ ATP}$', '$4\\text{ ATP}$ và $2\\text{ FADH}_2$', '$2\\text{ ATP}$ và $2\\text{ CO}_2$'],
        correctIndex: 0,
        explanation: 'Đường phân tiêu tốn $2\\text{ ATP}$, tạo $4\\text{ ATP}$ (thu ròng $2\\text{ ATP}$) cùng $2\\text{ NADH}$ và $2$ axit piruvic.',
        points: 20
      },
      {
        id: '10c-bi3',
        subject: 'biology',
        grade: 'Lớp 10 · Chuyên',
        question: 'Trong chu kì tế bào, điểm kiểm soát $G_1$ (Restriction point) có vai trò chính là:',
        options: ['Quyết định tế bào tiếp tục bước vào pha $S$ nhân đôi ADN hay chuyển sang trạng thái nghỉ $G_0$', 'Kiểm tra sự gắn dây tơ vô sắc vào tâm động NST', 'Phân chia tế bào chất ở kì cuối', 'Tổng hợp trực tiếp prôtêin tubulin'],
        correctIndex: 0,
        explanation: 'Nếu điều kiện nội ngoại bào và kích thích tăng trưởng đạt chuẩn tại điểm $G_1$, tế bào mới vượt qua để nhân đôi ADN ở pha $S$.',
        points: 20
      },
      {
        id: '10c-bi4',
        subject: 'biology',
        grade: 'Lớp 10 · Chuyên',
        question: 'Chất ức chế cạnh tranh của enzim tác động bằng cơ chế nào sau đây?',
        options: ['Gắn trực tiếp vào trung tâm hoạt động của enzim do có cấu trúc gần giống cơ chất', 'Gắn vào vị trí dị lập thể làm biến dạng không gian enzim', 'Phá hủy liên kết peptit của phân tử enzim', 'Làm giảm vĩnh viễn nồng độ cơ chất trong tế bào'],
        correctIndex: 0,
        explanation: 'Chất ức chế cạnh tranh chiếm giữ trung tâm hoạt động của enzim; có thể khắc phục bằng cách tăng nồng độ cơ chất.',
        points: 20
      },
      {
        id: '10c-bi5',
        subject: 'biology',
        grade: 'Lớp 10 · Chuyên',
        question: 'Một loài vi khuẩn có thời gian thế hệ $g = 20\\text{ phút}$. Từ $10^3$ tế bào ban đầu, sau $2\\text{ giờ}$ nuôi cấy ở pha lũy thừa, số lượng tế bào thu được là:',
        options: ['$6{,}4 \\times 10^4$', '$1{,}6 \\times 10^4$', '$3{,}2 \\times 10^4$', '$1{,}28 \\times 10^5$'],
        correctIndex: 0,
        explanation: 'Số lần phân chia $n = \\frac{120}{20} = 6$. Số tế bào $N_t = N_0 \\cdot 2^n = 10^3 \\cdot 2^6 = 64 \\times 10^3 = 6{,}4 \\times 10^4$.',
        points: 20
      }
    ]
  },
  '11k': {
    chemistry: CHEM_BIO_BASE_MCQ.chemistry.slice(1, 6),
    biology: CHEM_BIO_BASE_MCQ.biology.slice(1, 6)
  },
  '11c': {
    chemistry: [
      {
        id: '11c-ch1',
        subject: 'chemistry',
        grade: 'Lớp 11 · Chuyên',
        question: 'Xét cân bằng $\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g)\\; (\\Delta_r H^\\circ = -92\\text{ kJ})$. Để cân bằng chuyển dịch theo chiều thuận tạo nhiều $\\text{NH}_3$, cần tác động như thế nào?',
        options: ['Tăng áp suất chung và giảm nhiệt độ hợp lí', 'Giảm áp suất chung và tăng nhiệt độ', 'Thêm chất xúc tác sắt làm dịch chuyển cân bằng', 'Giảm nồng độ $\\text{N}_2$ trong bình phản ứng'],
        correctIndex: 0,
        explanation: 'Theo nguyên lí Le Chatelier: chiều thuận làm giảm số mol khí ($4 \\to 2$) nên cần tăng áp suất; chiều thuận tỏa nhiệt nên cần giảm nhiệt độ.',
        points: 20
      },
      {
        id: '11c-ch2',
        subject: 'chemistry',
        grade: 'Lớp 11 · Chuyên',
        question: 'Trộn $100\\text{ mL}$ dung dịch $\\text{H}_2\\text{SO}_4$ $0{,}05\\text{ M}$ với $100\\text{ mL}$ dung dịch $\\text{NaOH}$ $0{,}12\\text{ M}$. Giá trị $\\text{pH}$ của dung dịch thu được ở $25^\\circ\\text{C}$ là:',
        options: ['$12$', '$2$', '$11$', '$13$'],
        correctIndex: 0,
        explanation: '$n_{\\text{H}^+} = 2\\cdot 0{,}1\\cdot 0{,}05 = 0{,}01\\text{ mol}$; $n_{\\text{OH}^-} = 0{,}1\\cdot 0{,}12 = 0{,}012\\text{ mol}$. Dư $\\text{OH}^- = 0{,}002\\text{ mol}$ trong $0{,}2\\text{ L} \\Rightarrow [\\text{OH}^-] = 0{,}01 = 10^{-2}\\text{ M} \\Rightarrow \\text{pH} = 14 - 2 = 12$.',
        points: 20
      },
      {
        id: '11c-ch3',
        subject: 'chemistry',
        grade: 'Lớp 11 · Chuyên',
        question: 'Theo quy tắc Markovnikov, sản phẩm chính khi cộng $\\text{HBr}$ vào propen ($\\text{CH}_2=\\text{CH}-\\text{CH}_3$) là:',
        options: ['2-brompropan ($\\text{CH}_3-\\text{CHBr}-\\text{CH}_3$)', '1-brompropan ($\\text{BrCH}_2-\\text{CH}_2-\\text{CH}_3$)', '1,2-đibrompropan', '2-metylpropan'],
        correctIndex: 0,
        explanation: 'Nguyên tử $\\text{H}$ ưu tiên cộng vào cacbon bậc thấp giàu $\\text{H}$ hơn ($\\text{CH}_2=$), tạo carbocation bậc 2 bền hơn nên $\\text{Br}^-$ gắn vào cacbon số 2.',
        points: 20
      },
      {
        id: '11c-ch4',
        subject: 'chemistry',
        grade: 'Lớp 11 · Chuyên',
        question: 'Trong phổ hồng ngoại (IR) của ancol etylic ($\\text{C}_2\\text{H}_5\\text{OH}$), dải hấp thụ đặc trưng rộng và tù ở vùng $3200 - 3600\\text{ cm}^{-1}$ ứng với dao động của liên kết nào?',
        options: ['Liên kết $\\text{O}-\\text{H}$ có liên kết hiđro', 'Liên kết $\\text{C}=\\text{O}$ xeton', 'Liên kết $\\text{C}\\equiv\\text{C}$', 'Liên kết $\\text{C}-\\text{Cl}$'],
        correctIndex: 0,
        explanation: 'Liên kết $\\text{O}-\\text{H}$ của ancol tạo vùng hấp thụ tù đặc trưng quanh $3300\\text{ cm}^{-1}$, giúp phân biệt nhanh với ete hoặc xeton.',
        points: 20
      },
      {
        id: '11c-ch5',
        subject: 'chemistry',
        grade: 'Lớp 11 · Chuyên',
        question: 'Sục $0{,}15\\text{ mol}$ hỗn hợp khí gồm $\\text{C}_2\\text{H}_4$ và $\\text{C}_2\\text{H}_2$ qua dung dịch $\\text{AgNO}_3/\\text{NH}_3$ dư thu được $12\\text{ g}$ kết tủa vàng nhạt ($\\text{C}_2\\text{Ag}_2 = 240$). Số mol $\\text{C}_2\\text{H}_4$ trong hỗn hợp là:',
        options: ['$0{,}10\\text{ mol}$', '$0{,}05\\text{ mol}$', '$0{,}12\\text{ mol}$', '$0{,}03\\text{ mol}$'],
        correctIndex: 0,
        explanation: 'Chỉ axetilen phản ứng tạo $\\text{C}_2\\text{Ag}_2$: $n_{\\text{C}_2\\text{H}_2} = n_{\\text{kết tủa}} = \\frac{12}{240} = 0{,}05\\text{ mol} \\Rightarrow n_{\\text{C}_2\\text{H}_4} = 0{,}15 - 0{,}05 = 0{,}10\\text{ mol}$.',
        points: 20
      }
    ],
    biology: [
      {
        id: '11c-bi1',
        subject: 'biology',
        grade: 'Lớp 11 · Chuyên',
        question: 'Ở thực vật $C_4$ (ngô, mía), enzim cố định $\\text{CO}_2$ đầu tiên ở tế bào mô giậu và sản phẩm cố định đầu tiên lần lượt là:',
        options: ['PEP cacboxylaza; Axit oxaloaxetic (AOA - $4C$)', 'Rubisco; Hợp chất $3C$ (APG)', 'PEP cacboxylaza; Glucôzơ ($6C$)', 'Rubisco; Axit malic ($4C$)'],
        correctIndex: 0,
        explanation: 'Enzim PEP cacboxylaza có ái lực rất cao với $\\text{CO}_2$, cố định $\\text{CO}_2$ vào PEP tạo AOA ($4C$), triệt tiêu hô hấp sáng.',
        points: 20
      },
      {
        id: '11c-bi2',
        subject: 'biology',
        grade: 'Lớp 11 · Chuyên',
        question: 'Trong hoạt động của tim người, pha nào có sự mở của van nhĩ – thất (van 2 lá và 3 lá) và đóng của van động mạch?',
        options: ['Pha dãn chung và pha co tâm nhĩ', 'Pha co tâm thất', 'Chỉ riêng pha co tâm thất', 'Giai đoạn tống máu động mạch chủ'],
        correctIndex: 0,
        explanation: 'Khi tâm nhĩ co và khi tim dãn chung, áp suất tâm thất thấp hơn tâm nhĩ nên van nhĩ–thất mở để máu đổ xuống thất, van động mạch đóng.',
        points: 20
      },
      {
        id: '11c-bi3',
        subject: 'biology',
        grade: 'Lớp 11 · Chuyên',
        question: 'Tại xinap hóa học, sự giải phóng chất trung gian hóa học (như axêtincôlin) từ chùy xinap vào khe xinap phụ thuộc trực tiếp vào sự đi vào của ion nào?',
        options: ['$\\text{Ca}^{2+}$', '$\\text{K}^+$', '$\\text{Cl}^-$', '$\\text{Mg}^{2+}$'],
        correctIndex: 0,
        explanation: 'Khi xung thần kinh tới chùy xinap làm mở kênh $\\text{Ca}^{2+}$; dòng $\\text{Ca}^{2+}$ từ dịch ngoại bào đi vào kích thích bóng xinap xuất bào.',
        points: 20
      },
      {
        id: '11c-bi4',
        subject: 'biology',
        grade: 'Lớp 11 · Chuyên',
        question: 'Tỉ lệ hormone thực vật nào điều khiển sự hình thành rễ và chồi khi nuôi cấy mô sẹo (callus)?',
        options: ['Auxin cao / Xitôkinin thấp kích thích ra rễ; ngược lại kích thích ra chồi', 'Êtilen cao kích thích ra chồi ngọn', 'Axit abxixic (AAB) kích thích nảy mầm hạt', 'Gibêrelin ức chế sự kéo dài thân'],
        correctIndex: 0,
        explanation: 'Thí nghiệm Skoog–Miller chứng minh tỉ lệ Auxin/Xitôkinin quyết định hướng phân hóa cơ quan: Auxin ưu thế tạo rễ, Xitôkinin ưu thế tạo chồi.',
        points: 20
      },
      {
        id: '11c-bi5',
        subject: 'biology',
        grade: 'Lớp 11 · Chuyên',
        question: 'Đồ thị đường cong phân li ôxi của hêmôglôbin dịch chuyển sang phải (hiệu ứng Bohr) khi nào?',
        options: ['$\\text{pH}$ máu giảm (tăng nồng độ $\\text{CO}_2$ và $\\text{H}^+$) hoặc tăng nhiệt độ tại mô đang vận động', 'Ở phổi nơi nồng độ $\\text{O}_2$ rất cao', 'Khi cơ thể hạ thân nhiệt sâu', 'Khi giảm nồng độ $2,3$-BPG trong hồng cầu'],
        correctIndex: 0,
        explanation: 'Tại mô vận động mạnh nhiều $\\text{CO}_2$ và $\\text{H}^+$, ái lực của Hb với $\\text{O}_2$ giảm (đường cong lệch phải) giúp nhả nhiều $\\text{O}_2$ cho tế bào.',
        points: 20
      }
    ]
  },
  '12k': {
    chemistry: CHEM_BIO_BASE_MCQ.chemistry.slice(2, 7),
    biology: CHEM_BIO_BASE_MCQ.biology.slice(2, 7)
  },
  '12c': {
    chemistry: [
      {
        id: '12c-ch1',
        subject: 'chemistry',
        grade: 'Lớp 12 · Chuyên',
        question: 'Thủy phân hoàn toàn $1\\text{ mol}$ este $X$ mạch hở (chứa $C, H, O$) trong dung dịch $\\text{NaOH}$ dư thu được $1\\text{ mol}$ muối natri ađipat ($\\text{NaOOC}-[\\text{CH}_2]_4-\\text{COONa}$) và $2\\text{ mol}$ $\\text{CH}_3\\text{OH}$. Công thức phân tử của $X$ là:',
        options: ['$\\text{C}_8\\text{H}_{14}\\text{O}_4$', '$\\text{C}_8\\text{H}_{12}\\text{O}_4$', '$\\text{C}_7\\text{H}_{12}\\text{O}_4$', '$\\text{C}_6\\text{H}_{10}\\text{O}_4$'],
        correctIndex: 0,
        explanation: '$X$ là đimetyl ađipat $\\text{CH}_3\\text{OOC}-[\\text{CH}_2]_4-\\text{COOCH}_3$, công thức phân tử $\\text{C}_8\\text{H}_{14}\\text{O}_4$.',
        points: 20
      },
      {
        id: '12c-ch2',
        subject: 'chemistry',
        grade: 'Lớp 12 · Chuyên',
        question: 'Giá trị $\\text{pH}$ tại điểm đẳng điện ($\\text{pI}$) của alanin ($\\text{H}_2\\text{N}-\\text{CH}(\\text{CH}_3)-\\text{COOH}$, biết $\\text{pK}_{a1} = 2{,}34, \\text{pK}_{a2} = 9{,}69$) xấp xỉ bằng:',
        options: ['$6{,}02$', '$7{,}00$', '$4{,}50$', '$9{,}69$'],
        correctIndex: 0,
        explanation: 'Với amino axit trung tính (1 nhóm $-\\text{NH}_2$, 1 nhóm $-\\text{COOH}$), $\\text{pI} = \\frac{\\text{pK}_{a1} + \\text{pK}_{a2}}{2} = \\frac{2{,}34 + 9{,}69}{2} \\approx 6{,}02$.',
        points: 20
      },
      {
        id: '12c-ch3',
        subject: 'chemistry',
        grade: 'Lớp 12 · Chuyên',
        question: 'Điện phân dung dịch chứa $0{,}2\\text{ mol } \\text{CuSO}_4$ và $0{,}1\\text{ mol } \\text{NaCl}$ với điện cực trơ, màng ngăn xốp, cường độ dòng điện $I = 5\\text{ A}$ trong $3860\\text{ giây}$ ($F = 96500$). Khối lượng kim loại $\\text{Cu}$ bám ở catot là:',
        options: ['$6{,}4\\text{ g}$', '$12{,}8\\text{ g}$', '$3{,}2\\text{ g}$', '$9{,}6\\text{ g}$'],
        correctIndex: 0,
        explanation: 'Số mol electron trao đổi $n_e = \\frac{I\\cdot t}{F} = \\frac{5\\times 3860}{96500} = 0{,}2\\text{ mol}$. Tại catot $\\text{Cu}^{2+} + 2e \\to \\text{Cu} \\Rightarrow n_{\\text{Cu}} = \\frac{0{,}2}{2} = 0{,}1\\text{ mol} \\Rightarrow m_{\\text{Cu}} = 6{,}4\\text{ g}$ (vì $0{,}1 < 0{,}2$).',
        points: 20
      },
      {
        id: '12c-ch4',
        subject: 'chemistry',
        grade: 'Lớp 12 · Chuyên',
        question: 'Phức chất bát diện $[\\text{Co}(\\text{NH}_3)_6]^{3+}$ có số phối trí của nguyên tử trung tâm $\\text{Co}^{3+}$ bằng bao nhiêu?',
        options: ['$6$', '$3$', '$4$', '$2$'],
        correctIndex: 0,
        explanation: 'Sáu phối tử đơn càng $\\text{NH}_3$ liên kết cho–nhận với ion trung tâm $\\text{Co}^{3+}$ nên số phối trí là $6$ (hình học bát diện).',
        points: 20
      },
      {
        id: '12c-ch5',
        subject: 'chemistry',
        grade: 'Lớp 12 · Chuyên',
        question: 'Đốt cháy hoàn toàn $m\\text{ gam}$ hỗn hợp $E$ gồm các triglixerit (chất béo no và không no) cần vừa đủ $2{,}28\\text{ mol } \\text{O}_2$, thu được $1{,}65\\text{ mol } \\text{CO}_2$ và $1{,}50\\text{ mol } \\text{H}_2\\text{O}$. Giá trị của $m$ gần nhất là:',
        options: ['$26{,}64\\text{ g}$', '$24{,}42\\text{ g}$', '$28{,}80\\text{ g}$', '$22{,}20\\text{ g}$'],
        correctIndex: 0,
        explanation: 'Triglixerit có $6$ nguyên tử $\\text{O}$: $n_{\\text{O trong } E} = 2n_{\\text{CO}_2} + n_{\\text{H}_2\\text{O}} - 2n_{\\text{O}_2} = 3{,}30 + 1{,}50 - 4{,}56 = 0{,}24\\text{ mol} \\Rightarrow m = 12(1{,}65) + 2(1{,}50) + 16(0{,}24) = 26{,}64\\text{ g}$.',
        points: 20
      }
    ],
    biology: [
      {
        id: '12c-bi1',
        subject: 'biology',
        grade: 'Lớp 12 · Chuyên',
        question: 'Trong mô hình Operon Lac ở *E. coli*, khi môi trường có lactôzơ (và không có glucôzơ), chất cảm ứng allolactôzơ gắn vào đâu để khởi động phiên mã?',
        options: ['Prôtêin ức chế (do gen điều hòa *lacI* tổng hợp), làm nó biến đổi cấu hình và không bám được vào vùng vận hành $O$', 'Vùng khởi động $P$ để trực tiếp cắt mạch ADN', 'Trực tiếp vào enzim ARN pôlimeraza', 'Vùng mã hóa của gen cấu trúc *lacZ*'],
        correctIndex: 0,
        explanation: 'Allolactôzơ đóng vai trò chất cảm ứng bám vào prôtêin ức chế, giải phóng vùng $O$ giúp ARN pôlimeraza trượt qua phiên mã nhóm gen *lacZ, lacY, lacA*.',
        points: 20
      },
      {
        id: '12c-bi2',
        subject: 'biology',
        grade: 'Lớp 12 · Chuyên',
        question: 'Ở một loài thực vật, xét cơ thể có kiểu gen $\\frac{AB}{ab}$ giảm phân với tần số hoán vị gen $f = 20\\%$. Tỉ lệ loại giao tử liên kết $\\underline{AB}$ tạo thành bằng:',
        options: ['$40\\%$', '$10\\%$', '$20\\%$', '$25\\%$'],
        correctIndex: 0,
        explanation: 'Giao tử liên kết $\\underline{AB} = \\underline{ab} = \\frac{1 - f}{2} = \\frac{1 - 0{,}20}{2} = 0{,}40 = 40\\%$.',
        points: 20
      },
      {
        id: '12c-bi3',
        subject: 'biology',
        grade: 'Lớp 12 · Chuyên',
        question: 'Hệ thống chỉnh sửa gen CRISPR-Cas9 dùng phân tử sgRNA dẫn đường cho enzim Cas9 cắt đứt cả hai mạch ADN tại vị trí ngay sát trình tự nào?',
        options: ['Trình tự PAM (ví dụ $5\'\\text{-NGG-3\'}$)', 'Hộp TATA ở đầu $5\'$', 'Đuôi poly-A ở đầu $3\'$', 'Intron tự cắt ở mARN'],
        correctIndex: 0,
        explanation: 'Cas9 chỉ nhận diện và cắt đứt sợi đôi ADN mục tiêu khi có trình tự bảo thủ PAM (Protospacer Adjacent Motif, thường là `5\'-NGG-3\'` với *SpCas9*) ở liền kề đầu $3\'$ vùng khớp bổ sung.',
        points: 20
      },
      {
        id: '12c-bi4',
        subject: 'biology',
        grade: 'Lớp 12 · Chuyên',
        question: 'Một quần thể ngẫu phối ban đầu có $0{,}2\\,AA : 0{,}4\\,Aa : 0{,}4\\,aa$. Nếu chọn lọc tự nhiên loại bỏ hoàn toàn kiểu hình lặn $aa$ trước tuổi sinh sản ở thế hệ $F_0$, thì tần số alen $a$ ở thế hệ $F_1$ còn lại là:',
        options: ['$\\frac{1}{3}$', '$0{,}6$', '$0{,}4$', '$\\frac{1}{4}$'],
        correctIndex: 0,
        explanation: 'Sau khi loại bỏ $aa$, quần thể còn lại $0{,}2\\,AA : 0{,}4\\,Aa \\iff \\frac{1}{3}AA : \\frac{2}{3}Aa$. Tần số alen $a$ lúc này là $\\frac{1}{2}\\cdot \\frac{2}{3} = \\frac{1}{3}$. Do ngẫu phối truyền nguyên tần số alen nên $q_a(F_1) = \\frac{1}{3}$.',
        points: 20
      },
      {
        id: '12c-bi5',
        subject: 'biology',
        grade: 'Lớp 12 · Chuyên',
        question: 'Hiệu suất sinh thái về năng lượng giữa bậc dinh dưỡng thứ $2$ ($2{,}5 \\times 10^4\\text{ kcal}$) và bậc dinh dưỡng thứ $3$ ($2{,}25 \\times 10^3\\text{ kcal}$) bằng:',
        options: ['$9\\%$', '$10\\%$', '$11{,}1\\%$', '$90\\%$'],
        correctIndex: 0,
        explanation: 'Hiệu suất sinh thái $H = \\frac{E_{\\text{bậc 3}}}{E_{\\text{bậc 2}}} \\times 100\\% = \\frac{2250}{25000} \\times 100\\% = 9\\%$.',
        points: 20
      }
    ]
  },
  olp: {
    chemistry: [
      {
        id: 'olp-ch1',
        subject: 'chemistry',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Cho phản ứng thuận nghịch có $\\Delta_r G^\\circ_{298} = -11{,}4\\text{ kJ/mol}$ ($R = 8{,}314\\text{ J/mol}\\cdot\\text{K}$). Giá trị $\\ln K_c$ tại $298\\text{ K}$ gần nhất với:',
        options: ['$4{,}60$', '$-4{,}60$', '$2{,}30$', '$0{,}0046$'],
        correctIndex: 0,
        explanation: 'Từ $\\Delta_r G^\\circ = -RT\\ln K \\Rightarrow \\ln K = \\frac{11400}{8{,}314 \\times 298} \\approx 4{,}60$.',
        points: 20
      },
      {
        id: 'olp-ch2',
        subject: 'chemistry',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Theo thuyết obitan phân tử (MO), bậc liên kết và từ tính của phân tử khí $\\text{O}_2$ lần lượt là:',
        options: ['Bậc liên kết $2$; Thuận từ ($2$ electron độc thân ở $\\pi^*_{2p}$)', 'Bậc liên kết $2$; Nghịch từ', 'Bậc liên kết $3$; Thuận từ', 'Bậc liên kết $1{,}5$; Nghịch từ'],
        correctIndex: 0,
        explanation: 'Cấu hình MO hóa trị của $\\text{O}_2$ có $(\\pi^*_{2p_x})^1(\\pi^*_{2p_y})^1$ (quy tắc Hund), nên bậc liên kết $= \\frac{8 - 4}{2} = 2$ và có 2 electron độc thân gây tính thuận từ.',
        points: 20
      },
      {
        id: 'olp-ch3',
        subject: 'chemistry',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Trong phản ứng thế nucleophin đơn phân tử $S_N1$ của dẫn xuất halogen quang hoạt (R)-2-brombutan với nước, sản phẩm ancol thu được có đặc điểm hóa lập thể nào?',
        options: ['Hỗn hợp racemic (mất tính quang hoạt do cacbocation trung gian phẳng)', 'Giữ nguyên cấu hình (R) 100%', 'Nghịch đảo cấu hình hoàn toàn sang (S)', 'Chỉ tạo anken tách HBr'],
        correctIndex: 0,
        explanation: 'Cơ chế $S_N1$ đi qua cacbocation $sp^2$ phẳng nên $\\text{H}_2\\text{O}$ tấn công từ hai phía với xác suất gần tương đương tạo hỗn hợp racemic.',
        points: 20
      },
      {
        id: 'olp-ch4',
        subject: 'chemistry',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Tích số tan của $\\text{AgCl}$ ở $25^\\circ\\text{C}$ là $K_{sp} = 1{,}8 \\times 10^{-10}$. Độ tan mol của $\\text{AgCl}$ trong dung dịch $\\text{NaCl}$ $0{,}01\\text{ M}$ xấp xỉ:',
        options: ['$1{,}8 \\times 10^{-8}\\text{ M}$', '$1{,}34 \\times 10^{-5}\\text{ M}$', '$1{,}8 \\times 10^{-10}\\text{ M}$', '$1{,}8 \\times 10^{-12}\\text{ M}$'],
        correctIndex: 0,
        explanation: 'Do hiệu ứng ion chung $[\\text{Cl}^-] \\approx 0{,}01\\text{ M} \\Rightarrow s = [\\text{Ag}^+] = \\frac{K_{sp}}{[\\text{Cl}^-]} = \\frac{1{,}8\\times 10^{-10}}{10^{-2}} = 1{,}8 \\times 10^{-8}\\text{ M}$.',
        points: 20
      },
      {
        id: 'olp-ch5',
        subject: 'chemistry',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Cho thế điện cực chuẩn $E^\\circ(\\text{Fe}^{3+}/\\text{Fe}^{2+}) = +0{,}77\\text{ V}$ và $E^\\circ(\\text{Fe}^{2+}/\\text{Fe}) = -0{,}44\\text{ V}$. Thế điện cực chuẩn $E^\\circ(\\text{Fe}^{3+}/\\text{Fe})$ bằng:',
        options: ['$-0{,}037\\text{ V}$', '$+0{,}33\\text{ V}$', '$-0{,}22\\text{ V}$', '$+0{,}165\\text{ V}$'],
        correctIndex: 0,
        explanation: 'Dùng bảo toàn $\\Delta G^\\circ = -nFE^\\circ$: $3E^\\circ(\\text{Fe}^{3+}/\\text{Fe}) = 1\\cdot (0{,}77) + 2\\cdot (-0{,}44) = -0{,}11\\text{ V} \\Rightarrow E^\\circ = -0{,}037\\text{ V}$.',
        points: 20
      }
    ],
    biology: [
      {
        id: 'olp-bi1',
        subject: 'biology',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Theo phương trình Michaelis-Menten $v = \\frac{V_{\\max}[S]}{K_M + [S]}$, khi có mặt chất ức chế **cạnh tranh**, hai thông số $V_{\\max}$ và $K_M$ biến đổi như thế nào?',
        options: ['$V_{\\max}$ không đổi; $K_M$ biểu kiến tăng', '$V_{\\max}$ giảm; $K_M$ không đổi', 'Cả $V_{\\max}$ và $K_M$ đều giảm', '$V_{\\max}$ tăng; $K_M$ giảm'],
        correctIndex: 0,
        explanation: 'Khi $[S] \\to \\infty$, cơ chất đẩy hết chất ức chế cạnh tranh nên vẫn đạt $V_{\\max}$ cũ, nhưng cần nồng độ cơ chất cao hơn để đạt $\\frac{1}{2}V_{\\max}$ nên $K_M$ biểu kiến tăng.',
        points: 20
      },
      {
        id: 'olp-bi2',
        subject: 'biology',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Dùng $2,4\\text{-DNP}$ (2,4-dinitrophenol, chất làm tăng tính thấm của màng trong ti thể đối với proton $\\text{H}^+$) sẽ gây hậu quả sinh lí nào?',
        options: ['Tiêu thụ $\\text{O}_2$ tăng hoặc duy trì nhưng tổng hợp $\\text{ATP}$ giảm mạnh và sinh nhiều nhiệt', 'Ngừng hoàn toàn chuỗi truyền electron nên $\\text{O}_2$ không được tiêu thụ', 'Tăng gấp đôi sản lượng $\\text{ATP}$ ở ti thể', 'Chuyển tế bào từ hô hấp hiếu khí sang quang hợp'],
        correctIndex: 0,
        explanation: 'DNP là chất tháo cặp (uncoupler): phá vỡ gradient $\\text{H}^+$ qua màng trong ti thể khiến ATP synthase không tạo $\\text{ATP}$, năng lượng tỏa ra dưới dạng nhiệt.',
        points: 20
      },
      {
        id: 'olp-bi3',
        subject: 'biology',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Một bệnh lặn liên kết NST giới tính $X$ ($X^a$) xuất hiện ở $4\\%$ nam giới trong quần thể cân bằng di truyền. Tần số nữ giới bị bệnh ($X^a X^a$) xấp xỉ:',
        options: ['$0{,}16\\%$', '$4\\%$', '$8\\%$', '$0{,}04\\%$'],
        correctIndex: 0,
        explanation: 'Ở nam giới ($XY$), tỉ lệ mắc bệnh chính bằng tần số alen $q_a = 0{,}04$. Ở nữ giới cân bằng, tỉ lệ mắc bệnh là $q_a^2 = (0{,}04)^2 = 0{,}0016 = 0{,}16\\%$.',
        points: 20
      },
      {
        id: 'olp-bi4',
        subject: 'biology',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Trong phân tích di truyền 3 điểm ở ruồi giấm, hệ số trùng hợp $C = 0{,}6$. Điều này có ý nghĩa gì về sự trao đổi chéo kép?',
        options: ['Trao đổi chéo tại vùng này ức chế một phần (nhiễu dương $I = 0{,}4$) sự trao đổi chéo ở vùng lân cận', 'Số lượng trao đổi chéo kép thực tế cao hơn lý thuyết', 'Các gen phân li hoàn toàn độc lập', 'Không có trao đổi chéo đơn xảy ra'],
        correctIndex: 0,
        explanation: 'Độ nhiễu $I = 1 - C = 1 - 0{,}6 = 0{,}4 > 0$, chứng tỏ tỉ lệ trao đổi chéo kép quan sát nhỏ hơn kỳ vọng lý thuyết do hiệu ứng cản trở không gian.',
        points: 20
      },
      {
        id: 'olp-bi5',
        subject: 'biology',
        grade: 'Đội tuyển HSG / Olympic',
        question: 'Ở người bình thường có phương trình Henderson–Hasselbalch hệ đệm bicarbonat $\\text{pH} = 6{,}1 + \\log\\frac{[\\text{HCO}_3^-]}{0{,}03 \\cdot P_{\\text{CO}_2}}$. Khi tăng thông khí phổi làm $P_{\\text{CO}_2}$ giảm xuống $25\\text{ mmHg}$ trong khi $[\\text{HCO}_3^-]$ chưa kịp đổi, máu rơi vào trạng thái:',
        options: ['Nhiễm kiềm hô hấp ($\\text{pH}$ máu tăng trên $7{,}45$)', 'Nhiễm toan hô hấp ($\\text{pH}$ giảm dưới $7{,}35$)', 'Nhiễm toan chuyển hóa', 'pH máu giữ nguyên tuyệt đối'],
        correctIndex: 0,
        explanation: 'Giảm $P_{\\text{CO}_2}$ làm mẫu số phân số giảm $\\Rightarrow$ tỉ số $\\frac{[\\text{HCO}_3^-]}{0{,}03 P_{\\text{CO}_2}}$ tăng $\\Rightarrow \\text{pH}$ tăng gây nhiễm kiềm hô hấp.',
        points: 20
      }
    ]
  }
};

export const CHEM_BIO_DIVISION_ESSAY: Record<
  ArenaDivisionId,
  { chemistry: ArenaEssayPrompt[]; biology: ArenaEssayPrompt[] }
> = {
  '9k': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[0]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[0]]
  },
  '9c': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[0]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[0]]
  },
  '10k': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[0]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[0]]
  },
  '10c': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[0]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[1]]
  },
  '11k': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[1]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[1]]
  },
  '11c': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[1]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[1]]
  },
  '12k': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[1]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[0]]
  },
  '12c': {
    chemistry: [CHEM_BIO_BASE_ESSAY.chemistry[1]],
    biology: [CHEM_BIO_BASE_ESSAY.biology[1]]
  },
  olp: {
    chemistry: [
      {
        id: 'e-olp-ch1',
        subject: 'chemistry',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Nhiệt động học phản ứng & Hằng số cân bằng $K_p$',
        prompt: 'Xét cân bằng $\\text{N}_2\\text{O}_4(g) \\rightleftharpoons 2\\text{NO}_2(g)$ ở $298\\text{ K}$ có $\\Delta_r H^\\circ = +57{,}2\\text{ kJ/mol}$ và $\\Delta_r S^\\circ = +175{,}8\\text{ J/(mol}\\cdot\\text{K)}$.\n1. Tính biến thiên năng lượng tự do Gibbs chuẩn $\\Delta_r G^\\circ_{298}$ và hằng số cân bằng $K_p$ ở $298\\text{ K}$ ($R = 8{,}314\\text{ J/mol}\\cdot\\text{K}$).\n2. Bơm $1{,}0\\text{ mol } \\text{N}_2\\text{O}_4$ vào bình dung tích không đổi ở áp suất ban đầu $1{,}0\\text{ bar}$ ($298\\text{ K}$). Tìm độ phân li $\\alpha$ của $\\text{N}_2\\text{O}_4$ khi hệ đạt cân bằng.',
        rubricChecklist: [
          'Tính đúng $\\Delta_r G^\\circ = \\Delta_r H^\\circ - T\\Delta_r S^\\circ = 57{,}2 - 298\\cdot 0{,}1758 = +4{,}81\\text{ kJ/mol}$ (30 điểm)',
          'Từ $\\Delta_r G^\\circ = -RT\\ln K_p \\Rightarrow K_p = e^{-\\frac{4810}{8{,}314\\cdot 298}} \\approx 0{,}1435$ (30 điểm)',
          'Thiết lập biểu thức $K_p = \\frac{4\\alpha^2}{1 - \\alpha^2} P_{\\text{đầu}}$ với $P_{\\text{tổng}} = (1+\\alpha)P_{\\text{đầu}}$ (20 điểm)',
          'Giải đúng $\\frac{4\\alpha^2}{1-\\alpha^2} \\approx 0{,}1435 \\Rightarrow \\alpha \\approx 0{,}186$ ($18{,}6\\%$) (20 điểm)'
        ],
        referenceSolution: '$\\Delta_r G^\\circ_{298} = 57200 - 298\\times 175{,}8 = +4811{,}6\\text{ J/mol} \\approx +4{,}81\\text{ kJ/mol}$. Suy ra $K_p = \\exp(-4811{,}6/(8{,}314\\times 298)) \\approx 0{,}1435$. Với $1\\text{ mol}$ ban đầu ($P_0 = 1\\text{ bar}$), tại cân bằng có $(1-\\alpha)\\text{ mol } \\text{N}_2\\text{O}_4$ và $2\\alpha\\text{ mol } \\text{NO}_2$, tổng số mol $1+\\alpha$, nên $P_{\\text{tổng}} = (1+\\alpha)\\text{ bar}$. Khi đó $K_p = \\frac{(2\\alpha/(1+\\alpha))^2 P_{\\text{tổng}}^2}{((1-\\alpha)/(1+\\alpha)) P_{\\text{tổng}}} = \\frac{4\\alpha^2}{1-\\alpha^2} \\cdot 1 = 0{,}1435 \\Rightarrow \\alpha \\approx 0{,}186$.',
        maxScore: 100
      }
    ],
    biology: [
      {
        id: 'e-olp-bi1',
        subject: 'biology',
        grade: 'Đội tuyển HSG / Olympic',
        title: 'Động học Enzim Michaelis-Menten & Di truyền học Quần thể',
        prompt: 'Một enzim xúc tác phản ứng có tốc độ cực đại $V_{\\max} = 120\\;\\mu\\text{mol/phút}$ và hằng số Michaelis $K_M = 4{,}0\\text{ mM}$.\n1. Tính tốc độ phản ứng ban đầu $v_0$ tại nồng độ cơ chất $[S] = 12{,}0\\text{ mM}$.\n2. Khi bổ sung chất ức chế không cạnh tranh làm giảm $V_{\\max}$ đi $25\%$ (giữ nguyên $K_M$), tốc độ phản ứng ở $[S] = 12{,}0\\text{ mM}$ còn bao nhiêu?',
        rubricChecklist: [
          'Viết đúng phương trình Michaelis-Menten $v_0 = \\frac{V_{\\max}[S]}{K_M + [S]}$ (25 điểm)',
          'Thay số tính đúng $v_0 = \\frac{120 \\times 12}{4 + 12} = 90\\;\\mu\\text{mol/phút}$ (35 điểm)',
          'Xác định đúng $V_{\\max}\' = 0{,}75 \\times 120 = 90\\;\\mu\\text{mol/phút}$ và $K_M\' = 4{,}0\\text{ mM}$ (20 điểm)',
          'Tính đúng $v_0\' = \\frac{90 \\times 12}{4 + 12} = 67{,}5\\;\\mu\\text{mol/phút}$ (20 điểm)'
        ],
        referenceSolution: 'Áp dụng phương trình Michaelis-Menten: $v_0 = \\frac{120\\cdot 12}{4+12} = 90\\;\\mu\\text{mol/phút}$. Chất ức chế không cạnh tranh giảm $V_{\\max}$ còn $0{,}75\\cdot 120 = 90\\;\\mu\\text{mol/phút}$, giữ $K_M = 4\\text{ mM}$, nên $v_0\' = \\frac{90\\cdot 12}{4+12} = 67{,}5\\;\\mu\\text{mol/phút}$.',
        maxScore: 100
      }
    ]
  }
};
