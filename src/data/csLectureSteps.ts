import { LectureStep } from '../types';

export const CS_CUSTOM_LECTURE_STEPS: Record<string, LectureStep[]> = {
  'cs-1': [
    {
      stepTitle: '1. Kiểu dữ liệu, Giới hạn bit & Phòng chống Tràn số',
      stepType: 'concept',
      conceptSection:
        'Trong lập trình thi đấu C++/Python, mọi biến số nguyên C++ đều có kích thước bit cố định trên thanh ghi CPU. Việc chọn sai kiểu giữa `int` ($32\\text{-bit}$) và `long long` ($64\\text{-bit}$) là nguyên nhân số 1 khiến code đúng thuật toán vẫn nhận phán quyết **WA (Wrong Answer)** ở các test lớn.',
      formulaSection: {
        primaryFormula: '\\text{int} \\in [-2^{31},\\, 2^{31}-1] \\approx \\pm 2{,}14\\cdot 10^9',
        secondaryFormulas: [
          '\\text{long long} \\in [-2^{63},\\, 2^{63}-1] \\approx \\pm 9{,}22\\cdot 10^{18}',
          'a \\cdot b \\le 10^{18} \\implies \\text{Bắt buộc ép kiểu } \\texttt{(long long)a * b}'
        ],
        variablesNote:
          '• Nếu $a, b$ kiểu `int` cỡ $10^5$, phép tính `a * b` thực hiện theo $32\\text{-bit}$ **trước** khi gán vào biến `long long` $\\implies$ vẫn tràn!\n• Python 3 hỗ trợ số nguyên độ chính xác tùy ý (BigInt tự động), nhưng phép toán quá lớn ($> 10^{1000}$) sẽ tốn thời gian $O(k^2)$.'
      },
      deepDiveSection:
        'Khi CPU nhân hai toán hạng kiểu `int`, bộ nhân $32\\text{-bit}$ cho ra kết quả $32\\text{-bit}$ bị cắt bỏ phần bit cao (Signed Overflow — Undefined Behavior trong C++). Cách khắc phục chuẩn: khai báo `using ll = long long;` hoặc viết `1LL * a * b` để ép phép nhân thực hiện ngay ở thanh ghi $64\\text{-bit}$.',
      teacherExplanation:
        'Phân biệt chính xác giới hạn $2 \\cdot 10^9$ của `int` và $9 \\cdot 10^{18}$ của `long long`, luôn ép kiểu `1LL *` trước khi nhân hai số cỡ $10^5$ trở lên.',
      keyTakeaway: 'Tích hai `int` vẫn là `int` trước khi gán! Dùng `1LL * a * b` ngay từ phép nhân.',
      miniQuiz: [
        {
          id: 'cs1-s1-q1',
          question: 'Cho `int a = 100000, b = 100000;`. Câu lệnh C++ nào gán đúng tích $10^{10}$ vào biến `long long res`?',
          options: [
            'A. `long long res = a * b;`',
            'B. `long long res = 1LL * a * b;`',
            'C. `long long res = (long long)(a * b);`',
            'D. `int res = a * b;`'
          ],
          correctIndex: 1,
          explanation: 'Ở A và C, biểu thức `a * b` bị tràn `int` trước rồi mới gán hoặc ép kiểu sang `long long`. Chỉ `1LL * a * b` ép kiểu ngay từ toán hạng đầu tiên.'
        },
        {
          id: 'cs1-s1-q2',
          question: 'Khi tổng hai số nguyên dương có thể đạt tới $3 \\cdot 10^9$, kiểu dữ liệu nào trong C++ lưu trữ an toàn tuyệt đối?',
          options: [
            'A. `short`',
            'B. `int`',
            'C. `long long`',
            'D. `float`'
          ],
          correctIndex: 2,
          explanation: '`int` tối đa $\\approx 2{,}14 \\cdot 10^9 < 3 \\cdot 10^9$ nên sẽ tràn; `float` chỉ giữ khoảng 7 chữ số thập phân có nghĩa. `long long` chứa tới $9{,}22 \\cdot 10^{18}$.'
        }
      ],
      miniEssay: {
        id: 'cs1-s1-e1',
        question: 'Giải thích vì sao `long long s = (long long)(a * b);` vẫn sai khi $a = b = 50000$ trong C++, và viết lại biểu thức đúng.',
        hint: 'Xét thứ tự thực hiện phép nhân trong dấu ngoặc trước khi ép kiểu.',
        rubricChecklist: [
          'Chỉ ra phép nhân `a * b` trong ngoặc dùng kiểu `int` có giá trị $2{,}5\\cdot 10^9 > 2^{31}-1$ nên tràn ngay trước khi ép.',
          'Viết đúng biểu thức sửa: `1LL * a * b` hoặc `(long long)a * b`.'
        ],
        sampleAnswer: 'Do $a, b$ cùng là `int` nên phép tính trong ngoặc `(a * b)` được tính bằng số $32\\text{-bit}$ cho ra $2{,}5\\cdot 10^9$ (tràn `int`, thành số âm) rồi mới ép sang `long long`. Cách viết đúng là `long long s = 1LL * a * b;` hoặc `(long long)a * b`.'
      }
    },
    {
      stepTitle: '2. Kỹ thuật Nhập/Xuất Tốc độ Cao (Fast I/O)',
      stepType: 'derivation',
      conceptSection:
        'Với các bài có kích thước mảng $N = 10^5$ đến $10^6$, phần thời gian đọc dữ liệu (`cin`/`input`) và in kết quả (`cout`/`print`) có thể chiếm tới **70–80%** tổng thời gian chạy nếu không tắt đồng bộ đệm.',
      formulaSection: {
        primaryFormula: '\\text{Time}_{\\text{I/O}} \\le 0{,}15\\text{ s} \\quad (N = 10^6 \\text{ với Fast I/O})',
        secondaryFormulas: [
          '\\texttt{ios::sync\\_with\\_stdio(false);\\ cin.tie(nullptr);}',
          '\\text{Dùng } \\texttt{"\\n"} \\text{ thay } \\texttt{endl} \\text{ để tránh xả bộ đệm liên tục}'
        ],
        variablesNote:
          '• `sync_with_stdio(false)`: ngắt đồng bộ giữa C++ streams (`cin/cout`) và C stdio (`scanf/printf`) — tuyệt đối **không trộn lẫn** cả hai sau khi gọi lệnh này.\n• `cin.tie(nullptr)`: không tự động flush `cout` trước mỗi lần `cin`.\n• Trong Python 3, dùng `sys.stdin.buffer.read().split()` để đọc toàn bộ token cực nhanh.'
      },
      deepDiveSection:
        'Tại sao `cout << x << endl;` làm chương trình bị TLE khi in $10^5$ dòng?\nMỗi lần gặp `endl`, chương trình bắt buộc gọi lệnh hệ điều hành `flush()` đẩy ngay bộ đệm ra I/O, gây tốn $10^5$ system calls. Trong khi đó `\'\\n\'` chỉ ghi vào buffer RAM và đẩy 1 lần khi đầy ($4\\text{ KB}$), nhanh gấp **10–20 lần**.',
      teacherExplanation:
        'Luôn đặt cặp lệnh Fast I/O ở đầu `main()` và dùng `\'\\n\'` thay cho `endl` trong mọi vòng lặp in kết quả.',
      keyTakeaway: 'Không trộn `cin`/`scanf` khi đã tắt sync; tuyệt đối dùng `\'\\n\'` thay `endl`.',
      miniQuiz: [
        {
          id: 'cs1-s2-q1',
          question: 'Khi in $2 \\cdot 10^5$ dòng kết quả trong C++, lệnh nào giúp tránh lỗi Time Limit Exceeded (TLE) do xả bộ đệm?',
          options: [
            'A. `cout << ans << endl;`',
            'B. `cout << ans << flush;`',
            'C. `cout << ans << \'\\n\';`',
            'D. `cerr << ans << endl;`'
          ],
          correctIndex: 2,
          explanation: '`endl` và `flush` đều ép hệ điều hành xả bộ đệm mỗi dòng; `\'\\n\'` chỉ ghi ký tự xuống dòng vào bộ đệm cực nhanh.'
        },
        {
          id: 'cs1-s2-q2',
          question: 'Sau khi gọi `ios_base::sync_with_stdio(false);`, lập trình viên cần tuân thủ quy tắc nào?',
          options: [
            'A. Chỉ dùng `cin/cout`, không gọi xen kẽ `scanf/printf`',
            'B. Không được khai báo biến `long long`',
            'C. Bắt buộc phải dùng `endl` sau mỗi câu lệnh',
            'D. Phải đóng file sau mỗi phép cộng'
          ],
          correctIndex: 0,
          explanation: 'Vì hai luồng đệm C++ và C không còn đồng bộ vị trí đọc/ghi, trộn `cin` với `scanf` sẽ làm đảo lộn thứ tự dữ liệu.'
        }
      ],
      miniEssay: {
        id: 'cs1-s2-e1',
        question: 'So sánh tốc độ xử lý I/O giữa `input()` thông thường và `sys.stdin.buffer.read().split()` trong Python 3 khi đọc $5 \\cdot 10^5$ số nguyên.',
        hint: 'Xét chi phí gọi hàm Python và tách chuỗi từng dòng so với đọc theo khối byte.',
        rubricChecklist: [
          'Giải thích được `input()` đọc từng dòng và tạo hàng trăm nghìn lời gọi hệ thống, dễ bị TLE.',
          'Nêu được `sys.stdin.buffer.read().split()` đọc toàn bộ luồng đầu vào một lần ở mức byte rồi tách token tốc độ C.'
        ],
        sampleAnswer: 'Hàm `input()` gọi đọc từng dòng và giải mã UTF-8 lặp lại $5\\cdot 10^5$ lần nên rất chậm. Ngược lại `sys.stdin.buffer.read().split()` đọc toàn bộ input thành 1 khối nhị phân duy nhất rồi tách bằng hàm C tối ưu, giúp giảm thời gian đọc từ vài giây xuống dưới $0{,}2$ giây.'
      }
    },
    {
      stepTitle: '3. Số thực Dấu phẩy động & Bài toán Kiểm thử Biên',
      stepType: 'example',
      conceptSection:
        'Số thực (`double`, `long double`) không biểu diễn chính xác mọi phân số thập phân trong hệ nhị phân (ví dụ `0.1 + 0.2 != 0.3`). Do đó trong thi đấu, khi so sánh hai số thực ta dùng sai số cho phép $\\varepsilon = 10^{-9}$, còn khi làm việc với tiền tệ/tọa độ nguyên hãy chuyển hết về **số nguyên** nếu được.',
      formulaSection: {
        primaryFormula: '|a - b| < \\varepsilon \\quad (\\varepsilon = 10^{-9})',
        secondaryFormulas: [
          '\\texttt{cout << fixed << setprecision(6) << ans;}',
          '\\lceil a / b \\rceil = (a + b - 1) / b \\quad (a, b \\in \\mathbb{Z}^+)'
        ],
        variablesNote:
          '• `double` có độ chính xác $\\approx 15$ chữ số thập phân; `float` chỉ $\\approx 6\\text{–}7$ chữ số (không nên dùng `float`).\n• Chia làm tròn lên hai số nguyên dương: dùng công thức nguyên `(a + b - 1) / b` thay vì `ceil(1.0 * a / b)` để tránh sai số dấu phẩy động.'
      },
      deepDiveSection:
        'Sai lầm phổ biến: viết `ceil(a / b)` với `a, b` kiểu `long long` cỡ $10^{17}$ sẽ làm mất các chữ số hàng đơn vị vì `double` chỉ giữ chính xác 53 bit phần định trị ($\\approx 9 \\cdot 10^{15}$). Luôn dùng `(a + b - 1) / b` cho số nguyên dương.',
      teacherExplanation:
        'Ưu tiên tính toán hoàn toàn bằng số nguyên (`(a + b - 1) / b` cho làm tròn lên); nếu bắt buộc dùng số thực, chọn `double` và so sánh theo $|a - b| < 10^{-9}$.',
      workedExample: {
        problem: 'Cần xếp $N = 10^{16} + 1$ học sinh vào các phòng, mỗi phòng tối đa $K = 2$ học sinh. Tính số phòng ít nhất.',
        steps: [
          'Nếu dùng `ceil((double)N / K)`, vì $10^{16} > 2^{53}$, kiểu `double` làm tròn $10^{16}+1$ thành $10^{16}$ nên trả về sai $5\\cdot 10^{15}$ phòng.',
          'Dùng phép chia nguyên làm tròn lên: `(N + K - 1) / K = (10^16 + 1 + 1) / 2 = 5\\cdot 10^{15} + 1$.'
        ],
        answer: '$5 \\cdot 10^{15} + 1$ phòng (Chính xác tuyệt đối, không sai số).'
      },
      keyTakeaway: 'Tránh `double` khi làm tròn lên số nguyên lớn; dùng `(a + b - 1) / b`.',
      miniQuiz: [
        {
          id: 'cs1-s3-q1',
          question: 'Để tính $\\lceil n / k \\rceil$ với hai số nguyên dương $n, k$ tới $10^{18}$ không sai số, biểu thức C++ chuẩn nhất là:',
          options: [
            'A. `ceil(n / k)`',
            'B. `(n + k - 1) / k`',
            'C. `round(1.0 * n / k)`',
            'D. `(n - 1) / k`'
          ],
          correctIndex: 1,
          explanation: '`(n + k - 1) / k` dùng hoàn toàn phép chia nguyên $64\\text{-bit}$, tránh lỗi mất độ chính xác của `double` khi $n > 9\\cdot 10^{15}$.'
        },
        {
          id: 'cs1-s3-q2',
          question: 'Khi in đáp án số thực với chính xác 4 chữ số sau dấu phẩy trong C++, ta viết:',
          options: [
            'A. `cout << setprecision(4) << x;`',
            'B. `cout << fixed << setprecision(4) << x;`',
            'C. `cout << x << 4;`',
            'D. `cout << int(x);`'
          ],
          correctIndex: 1,
          explanation: 'Thiếu `fixed`, `setprecision(4)` chỉ in tổng cộng 4 chữ số có nghĩa (ví dụ `1234` thành `1.234e+03`). Có `fixed` mới cố định 4 chữ số thập phân.'
        }
      ],
      miniEssay: {
        id: 'cs1-s3-e1',
        question: 'Tại sao không nên so sánh trực tiếp `if (a == b)` cho hai biến kiểu `double`, và cách viết an toàn thay thế là gì?',
        hint: 'Nhắc tới biểu diễn nhị phân dấu phẩy động IEEE 754 và hằng số $\\varepsilon$.',
        rubricChecklist: [
          'Giải thích được số thập phân hữu hạn như $0.1$ thành vô hạn tuần hoàn trong hệ nhị phân nên phát sinh sai số làm tròn.',
          'Viết đúng điều kiện so sánh an toàn: `fabs(a - b) < 1e-9`.'
        ],
        sampleAnswer: 'Theo chuẩn IEEE 754, nhiều số thập phân như $0.1$ hay $0.2$ không biểu diễn chính xác được trong hệ nhị phân nên phép tính tạo ra sai số nhỏ cỡ $10^{-16}$. Do đó ta kiểm tra `fabs(a - b) < 1e-9` thay cho `a == b`.'
      }
    }
  ],

  'cs-2': [
    {
      stepTitle: '1. Rẽ nhánh Logic & Biểu thức Điều kiện Ngắn mạch',
      stepType: 'concept',
      conceptSection:
        'Cấu trúc `if / else if / else` phân luồng thực thi dựa trên biểu thức Boolean. Đặc tính cực kỳ quan trọng là **đánh giá ngắn mạch (short-circuit evaluation)**: với `A && B`, nếu `A` sai thì `B` không được đánh giá; với `A || B`, nếu `A` đúng thì `B` bị bỏ qua.',
      formulaSection: {
        primaryFormula: '\\text{if } (i < n \\;\\&\\&\\; a[i] > 0) \\quad \\text{(An toàn chỉ số)}',
        secondaryFormulas: [
          '\\neg(A \\land B) \\equiv (\\neg A) \\lor (\\neg B) \\quad \\text{(Định luật De Morgan)}',
          '\\text{Năm nhuận: } (y \\bmod 400 = 0) \\lor (y \\bmod 4 = 0 \\land y \\bmod 100 \\ne 0)'
        ],
        variablesNote:
          '• Luôn đặt điều kiện kiểm tra biên `i < n` hoặc `x != 0` ở **vế trái** của `&&` trước khi truy cập `a[i]` hoặc chia `k / x`.'
      },
      deepDiveSection:
        'Nếu viết đảo ngược `if (a[i] > 0 && i < n)` khi `i == n`, CPU truy cập `a[n]` ngoài vùng nhớ **trước** khi kiểm tra `i < n`, gây lỗi **RE (Runtime Error / Segfault)**. Tính chất ngắn mạch giúp code vừa gọn vừa an toàn bộ nhớ.',
      teacherExplanation:
        'Tận dụng đánh giá ngắn mạch và luật De Morgan để viết điều kiện rẽ nhánh gọn, chặt chẽ, không truy cập ngoài biên.',
      keyTakeaway: 'Kiểm tra biên (`i < n`, `x != 0`) luôn đứng TRƯỚC trong biểu thức `&&`.',
      miniQuiz: [
        {
          id: 'cs2-s1-q1',
          question: 'Đoạn điều kiện nào trong C++ an toàn KHÔNG gây lỗi chia cho 0 hoặc truy cập ngoài mảng khi `idx == n`?',
          options: [
            'A. `if (a[idx] == 5 && idx < n)`',
            'B. `if (idx < n && a[idx] == 5)`',
            'C. `if (10 / x > 2 && x != 0)`',
            'D. `if (idx <= n && a[idx] == 5)`'
          ],
          correctIndex: 1,
          explanation: 'Nhờ short-circuit, `idx < n` được kiểm tra trước; khi `idx == n` vế trái sai nên `a[idx]` không bao giờ được đọc.'
        },
        {
          id: 'cs2-s1-q2',
          question: 'Phủ định của điều kiện `!(x >= 1 && x <= 10)` tương đương với:',
          options: [
            'A. `x < 1 && x > 10`',
            'B. `x < 1 || x > 10`',
            'C. `x <= 1 || x >= 10`',
            'D. `x > 1 && x < 10`'
          ],
          correctIndex: 1,
          explanation: 'Theo định luật De Morgan, phủ định của `AND` trở thành `OR` với từng điều kiện đảo chiều: `x < 1 || x > 10`.'
        }
      ],
      miniEssay: {
        id: 'cs2-s1-e1',
        question: 'Viết biểu thức kiểm tra một năm $y$ là năm nhuận và giải thích vì sao cần viết điều kiện chia hết cho $400$.',
        hint: 'Liên hệ ngoại lệ của các năm tròn thế kỷ như 1900 và 2000.',
        rubricChecklist: [
          'Viết đúng điều kiện `(y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)`.',
          'Giải thích năm chia hết $100$ nhưng không chia hết $400$ (như 1900) không nhuận; chia hết $400$ (như 2000) vẫn nhuận.'
        ],
        sampleAnswer: 'Biểu thức chuẩn: `(y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)`. Cần có điều kiện 400 vì các năm tròn thế kỷ chia hết cho 4 nhưng không chia hết cho 400 (như 1900) không phải năm nhuận, còn chia hết cho 400 (như 2000) là năm nhuận.'
      }
    },
    {
      stepTitle: '2. Vòng lặp Tối ưu $O(\\sqrt{N})$ cho Kiểm tra Nguyên tố & Ước số',
      stepType: 'derivation',
      conceptSection:
        'Khi kiểm tra số $N$ có phải số nguyên tố hay đếm ước của $N$, ta không bao giờ chạy vòng lặp từ $1$ đến $N$ ($O(N)$ — TLE khi $N = 10^{12}$). Tính đối xứng của cặp ước $(d, N/d)$ đảm bảo nếu $N$ có ước lớn hơn $1$ thì chắc chắn có ít nhất một ước $\\le \\sqrt{N}$.',
      formulaSection: {
        primaryFormula: 'd \\cdot \\frac{N}{d} = N \\implies \\min\\left(d, \\frac{N}{d}\\right) \\le \\sqrt{N}',
        secondaryFormulas: [
          '\\text{Điều kiện lặp an toàn: } \\texttt{for (long long i = 2; i * i <= n; ++i)}',
          '\\text{Nếu } d^2 = N \\implies \\text{chỉ đếm } 1 \\text{ ước};\\quad d^2 < N \\implies \\text{đếm cặp } (d, N/d)'
        ],
        variablesNote:
          '• Dùng `i * i <= n` (với `i` là `long long`) nhanh hơn và chính xác hơn `i <= sqrt(n)`.\n• Độ phức tạp giảm từ $O(N)$ xuống $O(\\sqrt{N})$: với $N = 10^{12}$, số vòng lặp chỉ còn $\\mathbf{10^6}$ ($\\approx 5\\text{ ms}$!).'
      },
      deepDiveSection:
        'Nếu viết `for (int i = 2; i * i <= n; ++i)` khi $n = 2{,}14\\cdot 10^9$: tới lúc $i = 46341$, giá trị $i \\cdot i = 2{,}147{,}488{,}281$ sẽ bị **tràn `int`** thành số âm làm vòng lặp chạy vô tận hoặc lỗi!\nVì vậy luôn khai báo `long long i` cho điều kiện `i * i <= n`.',
      teacherExplanation:
        'Chuyển bài toán duyệt ước từ $O(N)$ xuống $O(\\sqrt{N})$ bằng cặp đối xứng $(i, N/i)$ và dùng `long long i` trong `i * i <= n`.',
      keyTakeaway: 'Dùng `for (long long i = 2; i * i <= n; ++i)` đạt $O(\\sqrt{N})$ không sai số.',
      miniQuiz: [
        {
          id: 'cs2-s2-q1',
          question: 'Với $N = 10^{12}$, thuật toán kiểm tra số nguyên tố chạy đến $\\sqrt{N}$ thực hiện tối đa khoảng bao nhiêu phép lặp?',
          options: [
            'A. $10^{12}$',
            'B. $10^9$',
            'C. $10^6$',
            'D. $40$'
          ],
          correctIndex: 2,
          explanation: '$\\sqrt{10^{12}} = 10^6$, chạy trong vài mili-giây; trong khi duyệt tới $N$ cần $10^{12}$ bước (mất hàng giờ).'
        },
        {
          id: 'cs2-s2-q2',
          question: 'Khi đếm tất cả ước nguyên dương của $N = 36$ bằng vòng `i` từ $1$ đến $6$ (`i * i <= 36`), tại `i = 6` ta cộng thêm mấy vào biến đếm?',
          options: [
            'A. Cộng $0$',
            'B. Cộng $1$ (vì $36 / 6 = 6$ trùng nhau)',
            'C. Cộng $2$',
            'D. Cộng $6$'
          ],
          correctIndex: 1,
          explanation: 'Vì $6 \\cdot 6 = 36$ là số chính phương, $i$ và $N/i$ trùng nhau nên chỉ tính là 1 ước duy nhất.'
        }
      ],
      miniEssay: {
        id: 'cs2-s2-e1',
        question: 'Tại sao điều kiện `for (int i = 2; i * i <= n; ++i)` có thể gây vòng lặp vô hạn khi $n = 2{,}147{,}483{,}647$?',
        hint: 'Tính giá trị $46341^2$ so với $2^{31} - 1$.',
        rubricChecklist: [
          'Chỉ ra $46341^2 = 2{,}147{,}488{,}281 > 2^{31}-1$ nên tràn `int` sang giá trị âm.',
          'Nêu cách sửa đúng: khai báo `long long i` hoặc viết `i <= n / i`.'
        ],
        sampleAnswer: 'Khi $i = 46341$, $i^2 = 2{,}147{,}488{,}281$ vượt quá giới hạn tối đa của `int` ($2{,}147{,}483{,}647$), gây tràn số thành số âm. Điều kiện `i * i <= n` lúc đó tiếp tục đúng dẫn đến lặp sai. Sửa bằng cách dùng `long long i` hoặc `i <= n / i`.'
      }
    },
    {
      stepTitle: '3. Phân tích Độ phức tạp Vòng lặp Lồng & Kỹ thuật Sàng Eratosthenes',
      stepType: 'example',
      conceptSection:
        'Khi đề bài hỏi *trên nhiều truy vấn* (ví dụ đếm số nguyên tố trong đoạn $[L, R]$ lặp lại $10^5$ lần), việc gọi `isPrime(x)` cho từng số sẽ chậm ($O(Q \\cdot N\\sqrt{N})$). Thay vào đó, ta tiền xử lý bằng **Sàng Eratosthenes** + mảng cộng dồn để mỗi truy vấn chỉ mất $O(1)$.',
      formulaSection: {
        primaryFormula: '\\text{Time}_{\\text{Sieve}} = O\\left(N \\sum_{p \\le \\sqrt{N}} \\frac{1}{p}\\right) = O(N \\log \\log N)',
        secondaryFormulas: [
          '\\text{Số nguyên tố từ } 1 \\text{ đến } n:\\; \\pi(n) \\approx \\frac{n}{\\ln n}',
          '\\text{Số phép tính tối đa trong } 1\\text{ giây CPU} \\approx 10^8'
        ],
        variablesNote:
          '• Vòng lặp ngoài chạy từ $2$ tới $\\sqrt{N}$, vòng lặp trong đánh dấu bội bắt đầu từ $i \\cdot i$ với bước nhảy $i$.\n• $N \\le 10^7$: Sàng Eratosthenes chạy chưa tới $0{,}2$ giây trong C++.'
      },
      deepDiveSection:
        'Tại sao trong sàng Eratosthenes, vòng trong bắt đầu từ `j = i * i` mà không cần bắt đầu từ `j = 2 * i`?\nMọi hợp số dạng $k \\cdot i$ với $k < i$ đều có thừa số nguyên tố $\\le k < i$ nên đã bị loại ở các bước trước đó rồi! Bắt đầu từ `i * i` giúp giảm hằng số thực thi đi đáng kể.',
      teacherExplanation:
        'Ước lượng Big-O dựa trên ngưỡng $10^8$ phép tính/giây và biết dùng Sàng Eratosthenes khi cần kiểm tra nguyên tố hàng loạt.',
      workedExample: {
        problem: 'Cho $10^5$ truy vấn, mỗi truy vấn cho $L, R \\le 10^6$, hỏi có bao nhiêu số nguyên tố trong $[L, R]$.',
        steps: [
          'Bước 1: Dùng Sàng Eratosthenes đánh dấu mọi số nguyên tố $\\le 10^6$ trong $O(N \\log \\log N)$.',
          'Bước 2: Tạo mảng `pref[i]` = số lượng số nguyên tố từ $1$ đến $i$ trong $O(N)$.',
          'Bước 3: Trả lời mỗi truy vấn trong $O(1)$ bằng `pref[R] - pref[L - 1]`.'
        ],
        answer: 'Tổng thời gian $O(N \\log \\log N + Q) \\approx 0{,}05\\text{ giây}$.'
      },
      keyTakeaway: 'Ngưỡng $10^8$ phép tính/giây; sàng Eratosthenes chạy $O(N \\log \\log N)$ bằng cách gạch bội từ $i^2$.',
      miniQuiz: [
        {
          id: 'cs2-s3-q1',
          question: 'Thuật toán $O(N^2)$ có chạy kịp dưới $1\\text{ giây}$ khi giới hạn $N = 10^5$ không?',
          options: [
            'A. Có, vì $10^5$ rất nhỏ',
            'B. Không, vì $N^2 = 10^{10} \\gg 10^8$ phép tính/giây (sẽ bị TLE)',
            'C. Chỉ chạy kịp trên Python',
            'D. Tùy thuộc vào giá trị phần tử âm hay dương'
          ],
          correctIndex: 1,
          explanation: 'Giới hạn $N = 10^5$ đòi hỏi thuật toán $O(N)$ hoặc $O(N \\log N)$, vì $N^2 = 10^{10}$ mất khoảng $100\\text{ giây}$.'
        },
        {
          id: 'cs2-s3-q2',
          question: 'Độ phức tạp thời gian chuẩn của Sàng số nguyên tố Eratosthenes trên đoạn $[1, N]$ là:',
          options: [
            'A. $O(N^2)$',
            'B. $O(N \\log \\log N)$',
            'C. $O(N \\sqrt{N})$',
            'D. $O(\\log N)$'
          ],
          correctIndex: 1,
          explanation: 'Tổng nghịch đảo các số nguyên tố $\\sum_{p \\le N} 1/p$ tăng cỡ $\\ln \\ln N$, cho ra độ phức tạp $O(N \\log \\log N)$.'
        }
      ],
      miniEssay: {
        id: 'cs2-s3-e1',
        question: 'Trong Sàng Eratosthenes, giải thích tại sao khi gặp số nguyên tố $i$, vòng lặp gạch bội có thể bắt đầu ngay từ $i \\cdot i$ thay vì $2 \\cdot i$?',
        hint: 'Xét các bội $k \\cdot i$ với $2 \\le k < i$.',
        rubricChecklist: [
          'Nêu được với mọi $k < i$, tích $k \\cdot i$ có ước nguyên tố nhỏ hơn $i$.',
          'Kết luận các bội đó đã bị gạch bởi các số nguyên tố trước $i$ nên bắt đầu từ $i^2$ là đủ.'
        ],
        sampleAnswer: 'Mọi bội dạng $k \\cdot i$ với $2 \\le k < i$ đều có ít nhất một ước nguyên tố $p \\le k < i$. Vì vậy chúng đã chắc chắn bị gạch khi thuật toán xử lý số nguyên tố $p$ trước đó, nên ta bắt đầu gạch trực tiếp từ $i \\cdot i$.'
      }
    }
  ],

  'cs-3': [
    {
      stepTitle: '1. Mảng 1 Chiều, Chỉ số & Kỹ thuật Mảng Đếm Tần số',
      stepType: 'concept',
      conceptSection:
        'Mảng 1 chiều (`vector<int>` / `list`) lưu các phần tử liên tiếp trên RAM giúp truy cập phần tử bất kỳ `a[i]` chỉ trong **$O(1)$**. Khi miền giá trị phần tử nhỏ ($0 \\le a_i \\le 10^6$), ta dùng chính **giá trị phần tử làm chỉ số mảng** (`cnt[x]++`) để đếm tần số mà không cần vòng lặp lồng $O(N^2)$.',
      formulaSection: {
        primaryFormula: '\\text{Truy cập } a[i]: O(1), \\quad \\text{Mảng đếm } \\texttt{cnt[a[i]]++}: O(N)',
        secondaryFormulas: [
          '\\text{Bộ nhớ } 10^6 \\text{ phần tử } \\texttt{int} \\approx 4\\text{ MB}',
          '\\text{Giá trị âm hoặc } \\le 10^9 \\implies \\text{Dùng } \\texttt{unordered\\_map} \\text{ hoặc sort } O(N\\log N)'
        ],
        variablesNote:
          '• Nếu kích thước mảng $\\ge 10^5$, khai báo ở biến **toàn cục** (hoặc dùng `std::vector`) để tránh tràn bộ nhớ Stack (Stack Overflow giới hạn ~1–8 MB).'
      },
      deepDiveSection:
        'Rất nhiều học sinh khai báo `int a[1000005];` bên trong hàm `main()` khiến chương trình chết ngay lập tức (`Segmentation Fault`) dù chưa chạy câu lệnh nào! Nguyên nhân: biến cục bộ nằm trên Stack (kích thước nhỏ), còn biến toàn cục hoặc `vector` cấp phát trên vùng Data/Heap rộng hàng trăm MB.',
      teacherExplanation:
        'Dùng mảng đếm `cnt[x]` hoặc `unordered_map`/`dict` để hạ bài toán đếm tần số từ $O(N^2)$ xuống $O(N)$, và nhớ cấp phát mảng lớn ở toàn cục hoặc dùng `vector`.',
      keyTakeaway: 'Khai báo mảng lớn ($> 10^5$) ở toàn cục hoặc `vector`; dùng mảng đếm `cnt[x]` đạt $O(N)$.',
      miniQuiz: [
        {
          id: 'cs3-s1-q1',
          question: 'Khi biết $0 \\le a_i \\le 10^5$ và $N = 10^5$, cách nào tìm phần tử xuất hiện nhiều nhất nhanh và đơn giản nhất?',
          options: [
            'A. Dùng hai vòng lặp lồng đếm từng phần tử ($O(N^2)$)',
            'B. Tạo mảng `cnt[100005]` và duyệt 1 vòng `cnt[a[i]]++` ($O(N)$)',
            'C. Gọi đệ quy chia đôi mảng ($O(N^2)$)',
            'D. Sắp xếp nổi bọt ($O(N^2)$)'
          ],
          correctIndex: 1,
          explanation: 'Mảng đếm `cnt` xử lý toàn bộ $10^5$ phần tử chỉ trong 1 lượt duyệt $O(N)$.'
        },
        {
          id: 'cs3-s1-q2',
          question: 'Khai báo `int a[2000000];` bên trong hàm `main()` dễ gây ra lỗi gì?',
          options: [
            'A. Tràn số nguyên (Integer Overflow)',
            'B. Tràn bộ nhớ Stack (Stack Overflow / Runtime Error)',
            'C. Sai kiểu dữ liệu ký tự',
            'D. Chương trình chạy nhanh hơn'
          ],
          correctIndex: 1,
          explanation: '2 triệu `int` chiếm $\\approx 8\\text{ MB}$, thường vượt kích thước Stack mặc định. Cần khai báo toàn cục hoặc dùng `vector<int> a(2000000)`.'
        }
      ],
      miniEssay: {
        id: 'cs3-s1-e1',
        question: 'Nếu các phần tử trong mảng có giá trị rất lớn ($|a_i| \\le 10^9$), có dùng trực tiếp `int cnt[1000000005]` được không? Đề xuất 2 cách thay thế tối ưu.',
        hint: 'Tính lượng RAM của $10^9$ phần tử `int`, sau đó nghĩ tới sắp xếp hoặc bảng băm.',
        rubricChecklist: [
          'Tính được $10^9$ `int` tốn $4\\text{ GB}$ RAM nên bị lỗi MLE/CE.',
          'Đề xuất được 2 giải pháp đúng: dùng `map` / `unordered_map` (Python `dict`), hoặc `sort` mảng ($O(N\\log N)$) rồi đếm các đoạn phần tử liên tiếp giống nhau.'
        ],
        sampleAnswer: 'Không dùng được vì mảng $10^9$ `int` cần tới $4\\text{ GB}$ RAM (vượt giới hạn 256–512 MB). Thay vào đó: (1) Dùng `unordered_map<int, int>` (hoặc `dict`/`Counter` trong Python); (2) Sắp xếp mảng trong $O(N \\log N)$ rồi đếm độ dài các đoạn giá trị giống nhau đứng cạnh nhau.'
      }
    },
    {
      stepTitle: '2. Xử lý Chuỗi Ký tự, Bảng mã ASCII & Chuỗi Đối xứng (Palindrome)',
      stepType: 'derivation',
      conceptSection:
        'Chuỗi ký tự (`string` / `str`) thực chất là mảng các ký tự với mã ASCII liên tiếp (`\'a\'` là $97$, `\'A\'` là $65$, `\'0\'` là $48$). Để kiểm tra đối xứng, hai con trỏ $l = 0$ và $r = |S|-1$ đối chiếu hướng vào giữa trong $O(|S|/2)$.',
      formulaSection: {
        primaryFormula: 'S \\text{ đối xứng} \\iff S[i] = S[|S|-1-i] \\quad \\forall\\, 0 \\le i < \\lfloor |S|/2 \\rfloor',
        secondaryFormulas: [
          '\\text{Chuyển chữ số } c \\text{ sang số: } d = c - \\texttt{\'0\'}',
          '\\text{Đếm chữ cái thường: } \\texttt{freq[c - \'a\']++} \\quad (26\\text{ ô nhớ})'
        ],
        variablesNote:
          '• Lưu ý trong C++: nếu vừa đọc số `cin >> n;` xong mà gọi ngay `getline(cin, s);`, ký tự `\'\\n\'` còn sót lại sẽ khiến `s` bị rỗng! Cần gọi `cin.ignore();` hoặc `getline(cin >> ws, s);`.'
      },
      deepDiveSection:
        'Trong Python, chuỗi là **bất biến (immutable)** nên cộng chuỗi liên tục trong vòng lặp (`s = s + ch`) có thể mất tới $O(|S|^2)$ nếu không được tối ưu; cách chuẩn là gom ký tự vào list rồi `"".join(chars)`. Trong C++, nối chuỗi bằng `s += ch` chỉ tốn trung bình $O(1)$ khấu hao!',
      teacherExplanation:
        'Làm chủ phép biến đổi mã ASCII (`c - \'a\'`, `c - \'0\'`), đọc dòng an toàn với `cin >> ws`, và kiểm tra đối xứng bằng hai chỉ số.',
      keyTakeaway: 'Dùng `getline(cin >> ws, s)` để không dính dòng trống; dùng `freq[c - \'a\']` đếm ký tự.',
      miniQuiz: [
        {
          id: 'cs3-s2-q1',
          question: 'Khi biết `c` là một ký tự chữ số từ `\'0\'` đến `\'9\'` trong C++, biểu thức nào đổi `c` thành giá trị số nguyên tương ứng?',
          options: [
            'A. `int(c)`',
            'B. `c - \'0\'`',
            'C. `c + \'0\'`',
            'D. `c - \'a\'`'
          ],
          correctIndex: 1,
          explanation: '`int(c)` trả về mã ASCII (48..57); trừ đi `\'0\'` (48) mới cho ra số nguyên 0..9.'
        },
        {
          id: 'cs3-s2-q2',
          question: 'Sau lệnh `cin >> n;`, muốn đọc một xâu có chứa dấu cách ở dòng tiếp theo mà không bị bỏ qua dòng trống, ta dùng:',
          options: [
            'A. `cin >> s;`',
            'B. `getline(cin, s);` trực tiếp không ignore',
            'C. `getline(cin >> ws, s);`',
            'D. `s = cin.get();`'
          ],
          correctIndex: 2,
          explanation: '`cin >> ws` dọn sạch toàn bộ khoảng trắng và `\'\\n\'` còn sót trong luồng nhập trước khi `getline` đọc dòng thực sự.'
        }
      ],
      miniEssay: {
        id: 'cs3-s2-e1',
        question: 'Viết hàm (bằng C++ hoặc Python) kiểm tra xâu $S$ chỉ gồm chữ cái thường có thể hoán vị thành một xâu đối xứng (Palindrome) hay không, và nêu độ phức tạp.',
        hint: 'Xét số lượng ký tự có tần số xuất hiện là số lẻ.',
        rubricChecklist: [
          'Nêu đúng điều kiện cần và đủ: có tối đa 1 ký tự xuất hiện với số lần lẻ.',
          'Viết code đếm 26 chữ cái (`freq[26]`) rồi đếm số ký tự lẻ trong $O(|S|)$ thời gian, $O(1)$ bộ nhớ.'
        ],
        sampleAnswer: 'Một xâu hoán vị được thành Palindrome khi và chỉ khi có tối đa 1 ký tự xuất hiện lẻ lần. Ta dùng mảng `cnt[26] = {0}` duyệt xâu tăng `cnt[c - \'a\']++`, sau đó đếm số chữ cái có `cnt[i] % 2 == 1`; trả về `true` nếu số lượng lẻ `<= 1`. Độ phức tạp: Time $O(|S|)$, Space $O(1)$.'
      }
    },
    {
      stepTitle: '3. Thực hành Phân tích Đề: Tìm phần tử xuất hiện nhiều nhất',
      stepType: 'example',
      conceptSection:
        'Tổng hợp quy trình giải bài mảng hoàn chỉnh: (1) Kiểm tra giới hạn $N$ và giá trị $a_i$ để chọn kiểu đếm phù hợp; (2) Giải quyết trường hợp đồng hạng (nếu nhiều số cùng tần số cao nhất thì chọn số nào theo yêu cầu đề); (3) Tránh sai sót khởi tạo.',
      formulaSection: {
        primaryFormula: '\\text{Time: } O(N), \\quad \\text{Space: } O(M) \\text{ hoặc } O(N)',
        secondaryFormulas: [
          '\\text{Cập nhật đồng hạng: } (\\texttt{cnt[x] > bestCnt}) \\lor (\\texttt{cnt[x] == bestCnt} \\land x < \\texttt{bestVal})'
        ],
        variablesNote:
          '• Luôn đọc kỹ tiêu chí tie-break của đề: lấy số **nhỏ hơn**, **lớn hơn**, hay **xuất hiện đầu tiên**.'
      },
      deepDiveSection:
        'Nếu dùng mảng `unordered_map` và duyệt qua từng cặp `(val, count)`, thứ tự các khóa trong `unordered_map` là ngẫu nhiên theo hàm băm — nếu đề yêu cầu in số xuất hiện sớm nhất khi đồng hạng, cần duyệt lại theo mảng gốc hoặc so sánh cả chỉ số xuất hiện đầu tiên.',
      teacherExplanation:
        'Xử lý chuẩn cả độ phức tạp $O(N)$ lẫn điều kiện phá vỡ đồng hạng (tie-break) thường gặp trong đề thi.',
      keyTakeaway: 'Đừng quên xét điều kiện tie-break khi có hai phần tử cùng đạt tần số lớn nhất.',
      miniQuiz: [
        {
          id: 'cs3-s3-q1',
          question: 'Cho mảng `[4, 2, 4, 2, 5]`. Nếu đề yêu cầu in phần tử xuất hiện nhiều nhất, nếu cùng tần số thì lấy giá trị NHỎ HƠN, kết quả là:',
          options: ['A. 4', 'B. 2', 'C. 5', 'D. 3'],
          correctIndex: 1,
          explanation: 'Cả 2 và 4 đều xuất hiện 2 lần, nên lấy giá trị nhỏ hơn là 2.'
        },
        {
          id: 'cs3-s3-q2',
          question: 'Đoạn code `for (int i = 0; i <= n; ++i) a[i]` với mảng `a` kích thước `n` có chỉ số $0..n-1$ mắc lỗi gì?',
          options: [
            'A. Off-by-one (truy cập quá biên ở `i == n`)',
            'B. Thiếu biến đếm',
            'C. Sai thuật toán sắp xếp',
            'D. Không biên dịch được'
          ],
          correctIndex: 0,
          explanation: 'Mảng 0-indexed kích thước `n` chỉ có các chỉ số hợp lệ từ `0` đến `n - 1`.'
        }
      ],
      miniEssay: {
        id: 'cs3-s3-e1',
        question: 'So sánh ưu/nhược điểm giữa `std::map` ($O(N\\log N)$) và `std::unordered_map` ($O(N)$ trung bình) khi giải bài toán đếm tần số trong thi đấu C++.',
        hint: 'Nhắc tới trường hợp anti-hash test làm `unordered_map` chậm $O(N^2)$.',
        rubricChecklist: [
          '`unordered_map` trung bình $O(1)$ mỗi truy vấn nhưng có thể bị hack test thành $O(N^2)$.',
          '`map` ổn định tuyệt đối $O(\\log N)$ và giữ khóa theo thứ tự tăng dần.'
        ],
        sampleAnswer: '`unordered_map` nhanh hơn trong trường hợp ngẫu nhiên ($O(N)$), nhưng trong các kỳ thi chuẩn có test chống băm (anti-hash), nó có thể suy biến thành $O(N^2)$ gây TLE. `map` tuy tốn $O(N\\log N)$ nhưng đảm bảo ổn định tuyệt đối và tự động sắp xếp khóa tăng dần.'
      }
    }
  ],

  'cs-4': [
    {
      stepTitle: '1. Cơ chế Call Stack & Hai Điều kiện của Hàm Đệ quy',
      stepType: 'concept',
      conceptSection:
        'Hàm đệ quy là hàm tự gọi lại chính nó trên một bài toán con nhỏ hơn. Mỗi lần gọi hàm, CPU đẩy một khung nhớ (**Stack Frame**) chứa tham số và địa chỉ trả về lên Call Stack; khi chạm điểm dừng, các khung lần lượt được rút ra (LIFO).',
      formulaSection: {
        primaryFormula: 'T(n) = T(n-1) + O(1) \\implies O(n), \\qquad F(n) = F(n-1) + F(n-2) \\implies O(\\varphi^n)',
        secondaryFormulas: [
          '\\text{1. Base Case (Điều kiện dừng) bắt buộc chặn mọi nhánh}',
          '\\text{2. Recursive Step tiến dần về Base Case}'
        ],
        variablesNote:
          '• Python mặc định giới hạn độ sâu đệ quy chỉ **1000 tầng** (`RecursionError`). Có thể tăng bằng `sys.setrecursionlimit(200000)`.\n• Đệ quy Fibonacci ngây thơ lặp lại bài toán con theo cấp số mũ $O(1{,}618^n)$ — cần nhớ bằng mảng (Memoization) để hạ xuống $O(n)$.'
      },
      deepDiveSection:
        'Tại sao Fibonacci đệ quy thuần `fib(n-1) + fib(n-2)` chậm khủng khiếp ở $n = 45$? Vì nó tính lại `fib(2)` hàng trăm triệu lần! Chỉ cần thêm mảng nhớ `memo[n]` kiểm tra xem trạng thái đã tính chưa, cây nhị phân $2^n$ nút lập tức thu gọn thành đồ thị $n$ nút ($O(n)$).',
      teacherExplanation:
        'Thiết kế đệ quy luôn cần điểm dừng hợp lệ và bước thu nhỏ kích thước; dùng Memoization khi có bài toán con gối nhau.',
      keyTakeaway: 'Đệ quy cần Base Case rõ ràng; thêm Memoization để biến $O(2^n)$ thành $O(n)$ khi trùng bài toán con.',
      miniQuiz: [
        {
          id: 'cs4-s1-q1',
          question: 'Hàm đệ quy không có điều kiện dừng hợp lệ (Base Case) sẽ gây ra lỗi nào?',
          options: [
            'A. Syntax Error khi biên dịch',
            'B. Tràn Call Stack (Stack Overflow / RecursionError)',
            'C. Tự động trả về 0 sau 10 lần gọi',
            'D. Tốn ít bộ nhớ hơn vòng lặp'
          ],
          correctIndex: 1,
          explanation: 'Mỗi lần tự gọi hàm đẩy thêm một Stack Frame cho đến khi cạn kiệt vùng nhớ Stack của tiến trình.'
        },
        {
          id: 'cs4-s1-q2',
          question: 'Độ phức tạp thời gian của hàm Fibonacci đệ quy thuần `f(n) = f(n-1) + f(n-2)` (chưa có ghi nhớ) xấp xỉ:',
          options: [
            'A. $O(n)$',
            'B. $O(n \\log n)$',
            'C. $O(2^n)$ (chính xác $O(\\varphi^n)$)',
            'D. $O(1)$'
          ],
          correctIndex: 2,
          explanation: 'Mỗi lời gọi đẻ ra 2 lời gọi nhỏ hơn, tạo cây đệ quy hàm mũ khoảng $\\varphi^n$ nút ($\\varphi \\approx 1{,}618$).'
        }
      ],
      miniEssay: {
        id: 'cs4-s1-e1',
        question: 'Giải thích cơ chế hoàn trả trạng thái (Restore State) trong thuật toán Quay lui (Backtracking) khi dùng một mảng dùng chung.',
        hint: 'Điều gì xảy ra nếu ta đánh dấu `used[v] = true` trước lời gọi đệ quy nhưng quên đặt lại `used[v] = false` sau khi quay về?',
        rubricChecklist: [
          'Nêu đúng thứ tự 3 bước: Chọn (đánh dấu) → Gọi đệ quy nhánh con → Bỏ chọn (hoàn trả trạng thái).',
          'Giải thích được nếu quên hoàn trả thì các nhánh tìm kiếm anh em kế tiếp sẽ bị chặn nhầm phần tử.'
        ],
        sampleAnswer: 'Vì toàn bộ cây tìm kiếm dùng chung một mảng `used[]` hoặc `cur[]`, sau khi thử xong nhánh đi qua lựa chọn `v`, ta bắt buộc đặt lại `used[v] = false` (và `cur.pop_back()`). Nếu quên hoàn trả, `v` vẫn bị đánh dấu bận vĩnh viễn khiến các nhánh cấu hình sau bỏ sót nghiệm.'
      }
    },
    {
      stepTitle: '2. Khuôn mẫu Quay lui Sinh Cấu hình (Hoán vị – Tổ hợp – Tập con)',
      stepType: 'derivation',
      conceptSection:
        'Quay lui (Backtracking) hệ thống hóa việc tìm tất cả cấu hình bằng cách xây từng vị trí $1 \\to n$ theo dạng cây quyết định. Ba bài toán nền tảng là: **Sinh nhị phân ($2^N$)**, **Sinh chỉnh hợp/tổ hợp ($C_N^K$)**, và **Sinh hoán vị ($N!$)**.',
      formulaSection: {
        primaryFormula: '\\text{Nhị phân: } 2^N, \\quad \\text{Tổ hợp: } \\binom{N}{K}, \\quad \\text{Hoán vị: } N!',
        secondaryFormulas: [
          '\\text{Tổ hợp tăng dần: } \\texttt{for (int x = prev + 1; x <= N - K + i; ++x)}',
          '\\text{Giới hạn } N \\text{ trong 1s: Hoán vị } N \\le 10,\\; \\text{Nhị phân } N \\le 20'
        ],
        variablesNote:
          '• `used[v]` (mảng đánh dấu) kiểm tra phần tử `v` đã đứng ở các vị trí trước đó chưa chỉ trong $O(1)$.'
      },
      deepDiveSection:
        'Lưu ý giới hạn kích thước đầu vào để nhận biết bài toán dùng Quay lui trong thi đấu:\n• Nếu $N \\le 20$: có thể thử tất cả $2^N \\approx 10^6$ tập con.\n• Nếu $N \\le 10$: có thể thử $N! \\approx 3{,}6 \\cdot 10^6$ hoán vị.\n• Nếu $N > 25$: tuyệt đối **không** dùng quay lui thuần mà phải nghĩ tới Tham lam, Chia đôi tập (Meet-in-the-middle) hoặc Quy hoạch động!',
      teacherExplanation:
        'Nhận diện nhanh giới hạn $N \\le 20$ / $N \\le 10$ phù hợp Quay lui và cài đặt chuẩn khung đệ quy sinh tổ hợp – hoán vị.',
      keyTakeaway: 'Hoán vị dùng được khi $N \\le 10$; tập con nhị phân dùng được khi $N \\le 20$.',
      miniQuiz: [
        {
          id: 'cs4-s2-q1',
          question: 'Thuật toán quay lui sinh toàn bộ các dãy hoán vị độ dài $N$ thường chỉ chạy kịp trong $1\\text{ giây}$ khi $N$ tối đa cỡ:',
          options: [
            'A. $N \\le 10$ ($10! \\approx 3{,}6 \\cdot 10^6$)',
            'B. $N \\le 100$',
            'C. $N \\le 10^5$',
            'D. $N \\le 50$'
          ],
          correctIndex: 0,
          explanation: 'Vì $12! \\approx 4{,}79 \\cdot 10^8 > 10^8$ đã vượt ngưỡng 1 giây, nên quay lui hoán vị chuẩn giới hạn ở $N \\le 10$ (hoặc $11$).'
        },
        {
          id: 'cs4-s2-q2',
          question: 'Khi sinh tất cả tập con gồm $K$ phần tử từ $\{1..N\}$ không lặp thứ tự, giá trị bắt đầu của vòng lặp chọn phần tử ở vị trí tiếp theo nên là:',
          options: [
            'A. Luôn bắt đầu từ $1$',
            'B. Bắt đầu từ `last_chosen + 1`',
            'C. Bắt đầu từ $N$',
            'D. Bắt đầu từ $0$'
          ],
          correctIndex: 1,
          explanation: 'Chọn phần tử lớn hơn phần tử vừa chọn (`last_chosen + 1`) đảm bảo mỗi tổ hợp chỉ được liệt kê đúng 1 lần theo thứ tự tăng dần.'
        }
      ],
      miniEssay: {
        id: 'cs4-s2-e1',
        question: 'So sánh không gian tìm kiếm và thời gian chạy khi sinh tập con của tập 20 phần tử so với sinh hoán vị của tập 20 phần tử.',
        hint: 'So sánh $2^{20}$ và $20!$ với ngưỡng $10^8$ phép tính/giây.',
        rubricChecklist: [
          'Tính đúng $2^{20} = 1{,}048{,}576 \\ll 10^8$ nên chạy dưới $0{,}1$ giây.',
          'Tính/ước lượng $20! \\approx 2{,}43 \\cdot 10^{18} \\gg 10^8$ nên bất khả thi bằng quay lui thuần.'
        ],
        sampleAnswer: 'Số tập con của 20 phần tử là $2^{20} \\approx 10^6$, quay lui duyệt xong chỉ trong vài chục mili-giây. Ngược lại số hoán vị là $20! \\approx 2{,}43 \\cdot 10^{18}$, vượt quá hàng tỉ năm chạy CPU nên không thể liệt kê.'
      }
    },
    {
      stepTitle: '3. Kỹ thuật Nhánh cận (Pruning) & Bài toán N Quân Hậu',
      stepType: 'example',
      conceptSection:
        'Nhánh cận (Branch & Bound / Pruning) giúp chặt bỏ sớm các nhánh cây đệ quy chắc chắn vô nghiệm hoặc không thể tốt hơn kỷ lục hiện tại. Trong bài toán **Xếp $N$ quân Hậu**, mỗi hàng đặt đúng 1 hậu và dùng 3 mảng đánh dấu $O(1)$ để loại trừ ngay cột và hai đường chéo bị ăn.',
      formulaSection: {
        primaryFormula: '\\text{Đường chéo chính: } r - c + N = \\text{const}, \\quad \\text{Phụ: } r + c = \\text{const}',
        secondaryFormulas: [
          '\\text{Kiểm tra ô } (r, c) \\text{ hợp lệ trong } O(1):\\; \\neg\\texttt{col}[c] \\land \\neg\\texttt{d1}[r-c+N] \\land \\neg\\texttt{d2}[r+c]'
        ],
        variablesNote:
          '• Phép cộng $+N$ ở đường chéo chính `r - c + N` đảm bảo chỉ số luôn không âm ($\\ge 0$) khi truy cập mảng C++.'
      },
      deepDiveSection:
        'Nhờ quy ước mỗi hàng chỉ chứa 1 quân hậu và kiểm tra 3 mảng bit/boolean trong $O(1)$, số cấu hình cần duyệt với bàn cờ $8 \\times 8$ giảm từ $\\binom{64}{8} \\approx 4{,}4 \\cdot 10^9$ xuống chỉ còn vài nghìn trạng thái!',
      teacherExplanation:
        'Áp dụng đánh dấu đường chéo $(r+c)$ và $(r-c+N)$ để hạ bước kiểm tra va chạm N-Queens xuống $O(1)$.',
      workedExample: {
        problem: 'Đặt 4 quân hậu lên bàn cờ $4 \\times 4$ sao cho không quân nào ăn nhau.',
        steps: [
          'Hàng 0 thử cột 0 → hàng 1 thử cột 2 → hàng 2 không đặt được cột nào → quay lui.',
          'Hàng 0 thử cột 1 → hàng 1 đặt cột 3 → hàng 2 đặt cột 0 → hàng 3 đặt cột 2 → hợp lệ!'
        ],
        answer: 'Có đúng 2 nghiệm trên bàn cờ $4 \\times 4$: $(1,3,0,2)$ và $(2,0,3,1)$.'
      },
      keyTakeaway: 'Mọi ô cùng đường chéo chính có $r - c$ bằng nhau; cùng đường chéo phụ có $r + c$ bằng nhau.',
      miniQuiz: [
        {
          id: 'cs4-s3-q1',
          question: 'Hai ô $(r_1, c_1)$ và $(r_2, c_2)$ trên bàn cờ nằm trên cùng một đường chéo PHỤ khi nào?',
          options: [
            'A. $r_1 + c_1 = r_2 + c_2$',
            'B. $r_1 \\cdot c_1 = r_2 \\cdot c_2$',
            'C. $r_1 = r_2$',
            'D. $c_1 + 1 = c_2$'
          ],
          correctIndex: 0,
          explanation: 'Trên đường chéo phụ (hướng xuống-trái), khi hàng tăng 1 thì cột giảm 1 nên tổng $r + c$ không đổi.'
        },
        {
          id: 'cs4-s3-q2',
          question: 'Khi đặt quân hậu ở bàn cờ $N \\times N$ ($0$-indexed), hiệu $r - c$ có thể âm nên khi truy cập mảng đánh dấu đường chéo chính `diag1[...]` ta thường cộng bù thêm:',
          options: ['A. $+1$', 'B. $+N$ (hoặc $+(N-1)$)', 'C. $-N$', 'D. Không cần cộng vì mảng C++ cho chỉ số âm'],
          correctIndex: 1,
          explanation: 'Vì $r - c \\ge -(N-1)$, cộng thêm $N$ giúp mọi chỉ số nằm an toàn trong đoạn $[1, 2N-1]$ (C++ không cho chỉ số mảng âm).'
        }
      ],
      miniEssay: {
        id: 'cs4-s3-e1',
        question: 'Tại sao khi đánh số chỉ số đường chéo chính trong N-Queens bằng $r - c + N$, kích thước mảng `diag1` tối thiểu cần khai báo là $2N$?',
        hint: 'Tìm giá trị nhỏ nhất và lớn nhất của $r - c + N$ với $0 \\le r, c < N$.',
        rubricChecklist: [
          'Tìm đúng miền giá trị: $\\min = 0 - (N-1) + N = 1$, $\\max = (N-1) - 0 + N = 2N - 1$.',
          'Kết luận cần mảng kích thước tối thiểu $2N$ phần tử.'
        ],
        sampleAnswer: 'Với $0 \\le r, c \\le N - 1$, hiệu $r - c$ nằm trong $[-(N-1), N-1]$. Sau khi cộng bù $N$, chỉ số nằm trong $[1, 2N - 1]$, nên mảng đánh dấu phải có kích thước tối thiểu $2N$ ô nhớ.'
      }
    }
  ],

  'cs-5': [
    {
      stepTitle: '1. Tìm kiếm Nhị phân & Bẫy Lặp Vô Hạn / Tràn `mid`',
      stepType: 'concept',
      conceptSection:
        'Tìm kiếm nhị phân (Binary Search) chia đôi không gian tìm kiếm sau mỗi bước dựa trên **tính đơn điệu** của mảng đã sắp xếp, giúp giảm độ phức tạp từ $O(N)$ xuống chỉ còn $O(\\log_2 N)$ (với $10^9$ phần tử chỉ mất tối đa 30 bước!).',
      formulaSection: {
        primaryFormula: '\\text{mid} = l + \\frac{r - l}{2} \\quad \\text{(An toàn tuyệt đối, không tràn } \\texttt{int}\\text{)}',
        secondaryFormulas: [
          '\\text{Số bước tối đa: } \\lceil \\log_2 N \\rceil \\implies N = 10^9 \\text{ chỉ cần } 30 \\text{ bước}',
          '\\texttt{lower\\_bound}: \\text{phần tử đầu tiên } \\ge x; \\quad \\texttt{upper\\_bound}: \\text{đầu tiên } > x'
        ],
        variablesNote:
          '• Tại sao không viết `(l + r) / 2`? Nếu `l` và `r` đều cỡ $1{,}5 \\cdot 10^9$ (trong kiểu `int`), tổng `l + r` vượt quá $2{,}14 \\cdot 10^9$ gây tràn thành số âm!\n• Trong C++, chuẩn nhất là dùng `std::lower_bound` và `std::upper_bound` cho mảng đã sắp xếp.'
      },
      deepDiveSection:
        'Bẫy kinh điển nhất khi tự code Binary Search tìm giá trị biên: dùng `while (l < r)` với `l = mid` và `mid = (l + r) / 2` — khi $r = l + 1$ thì `mid == l`, nhánh `l = mid` khiến `[l, r]` **không co lại** và lặp vô hạn!\nQuy tắc vàng: luôn lưu đáp án tốt nhất vào biến `ans = -1` rồi thu hẹp hẳn `l = mid + 1` hoặc `r = mid - 1` trong vòng `while (l <= r)`.',
      teacherExplanation:
        'Dùng công thức `mid = l + (r - l) / 2` và khuôn mẫu lưu biến `ans` với `while (l <= r)` để không bao giờ kẹt lặp vô hạn.',
      keyTakeaway: 'Dùng `mid = l + (r - l) / 2` và lưu biến `ans` khi `while (l <= r)`.',
      miniQuiz: [
        {
          id: 'cs5-s1-q1',
          question: 'Với mảng đã sắp xếp gồm $N = 10^6$ phần tử, tìm kiếm nhị phân mất tối đa bao nhiêu phép so sánh?',
          options: ['A. 20 phép so sánh', 'B. 1000 phép so sánh', 'C. $5\\cdot 10^5$ phép so sánh', 'D. $10^6$ phép so sánh'],
          correctIndex: 0,
          explanation: '$2^{20} = 1{,}048{,}576 > 10^6$, nên chỉ cần tối đa 20 lần chia đôi.'
        },
        {
          id: 'cs5-s1-q2',
          question: 'Trong C++, biểu thức tính `mid` nào an toàn KHÔNG bị tràn số `int` khi $l, r \\approx 2 \\cdot 10^9$?',
          options: [
            'A. `(l + r) / 2`',
            'B. `l + (r - l) / 2`',
            'C. `(l * r) / 2`',
            'D. `(l + r + 1) / 2`'
          ],
          correctIndex: 1,
          explanation: '`r - l` luôn nhỏ hơn $r$, nên `l + (r - l) / 2` đảm bảo không vượt quá giá trị `r`.'
        }
      ],
      miniEssay: {
        id: 'cs5-s1-e1',
        question: 'Cho mảng đã sắp xếp `a = [1, 3, 3, 3, 7, 9]`. Viết công thức tính số lần xuất hiện của giá trị $x = 3$ bằng `lower_bound` và `upper_bound` trong C++.',
        hint: '`lower_bound` trỏ tới số 3 đầu tiên; `upper_bound` trỏ tới phần tử đầu tiên lớn hơn 3 (số 7).',
        rubricChecklist: [
          'Nêu đúng vị trí trả về của `lower_bound` (chỉ số 1) và `upper_bound` (chỉ số 4).',
          'Viết đúng công thức `upper_bound(all(a), x) - lower_bound(all(a), x)` với độ phức tạp $O(\\log N)$.'
        ],
        sampleAnswer: 'Hàm `lower_bound` trả về vị trí đầu tiên có giá trị $\\ge 3$ (index 1); `upper_bound` trả về vị trí đầu tiên $> 3$ (index 4). Do đó số lượng phần tử bằng $3$ chính là hiệu `upper_bound(a.begin(), a.end(), 3) - lower_bound(a.begin(), a.end(), 3)` $= 4 - 1 = 3$ trong $O(\\log N)$.'
      }
    },
    {
      stepTitle: '2. Chặt Nhị phân Theo Đáp án (Binary Search on Answer)',
      stepType: 'derivation',
      conceptSection:
        'Đây là kỹ thuật biến một bài toán **tối ưu khó** ("Tìm giá trị lớn nhất/nhỏ nhất thỏa mãn...") thành bài toán **kiểm tra dễ** ("Với giá trị $X$ cố định, liệu có chia/làm được không?"). Khi hàm `check(X)` có tính đơn điệu (Đúng-Đúng-...-Sai-Sai hoặc ngược lại), ta chặt nhị phân trực tiếp trên miền giá trị của $X$!',
      formulaSection: {
        primaryFormula: '\\text{check}(X) \\text{ đơn điệu } \\implies \\text{Time} = O(\\text{Cost}(\\text{check}) \\cdot \\log(\\text{MaxVal}))',
        secondaryFormulas: [
          '\\text{Tìm MIN thỏa mãn: nếu } \\texttt{check(mid)} \\text{ đúng} \\implies \\texttt{ans = mid; r = mid - 1;}',
          '\\text{Tìm MAX thỏa mãn: nếu } \\texttt{check(mid)} \\text{ đúng} \\implies \\texttt{ans = mid; l = mid + 1;}'
        ],
        variablesNote:
          '• Miền $[l, r]$ khi tìm kiếm trên đáp án không phải chỉ số mảng mà là **khoảng giá trị** của đáp án (ví dụ $[\\max(a_i), \\sum a_i]$).\n• Nếu đáp án lên tới $10^{14}$ thì $\\log_2(10^{14}) \\approx 47$ bước — cực nhanh!'
      },
      deepDiveSection:
        'Dấu hiệu nhận biết ngay bài dùng Chặt nhị phân kết quả trong đề thi: *"Tìm giá trị nhỏ nhất của tổng lớn nhất..."* hoặc *"Tìm độ dài lớn nhất sao cho cắt được ít nhất K đoạn..."*. Hàm `check(mid)` chỉ việc duyệt tham lam 1 vòng $O(N)$ để trả lời `true/false`.',
      teacherExplanation:
        'Nhận diện tính đơn điệu của hàm điều kiện `check(mid)` và phân biệt hướng cập nhật `[l, r]` cho bài toán tìm Min vs tìm Max.',
      keyTakeaway: 'Tìm Min thỏa $\\texttt{check(mid)}$ thì thử nhỏ hơn (`r = mid - 1`); tìm Max thì thử lớn hơn (`l = mid + 1`).',
      miniQuiz: [
        {
          id: 'cs5-s2-q1',
          question: 'Khi chặt nhị phân tìm giá trị **LỚN NHẤT** $X$ thỏa điều kiện đơn điệu `check(X) == true` (đúng ở bên trái, sai ở bên phải), nếu `check(mid)` trả về `true`, ta cập nhật thế nào?',
          options: [
            'A. `ans = mid; r = mid - 1;`',
            'B. `ans = mid; l = mid + 1;`',
            'C. `l = mid - 1;`',
            'D. `r = mid + 1;`'
          ],
          correctIndex: 1,
          explanation: 'Vì `mid` đã thỏa mãn và ta muốn tìm giá trị lớn hơn nữa, ta lưu `ans = mid` rồi đẩy cận trái lên `l = mid + 1`.'
        },
        {
          id: 'cs5-s2-q2',
          question: 'Cho $N = 10^5$ thanh gỗ dài tới $10^9$. Nếu hàm `check(L)` mất $O(N)$, tổng độ phức tạp của thuật toán chặt nhị phân tìm độ dài đoạn cắt $L$ lớn nhất là:',
          options: [
            'A. $O(N \\cdot 10^9)$',
            'B. $O(N \\log(10^9)) \\approx 3 \\cdot 10^6$ phép tính',
            'C. $O(N^2)$',
            'D. $O(\\log N)$'
          ],
          correctIndex: 1,
          explanation: 'Có $\\log_2(10^9) \\approx 30$ lần gọi `check`, mỗi lần $O(N)$, nên tổng số phép tính chỉ $\\approx 3 \\cdot 10^6$ (chạy cực nhanh).'
        }
      ],
      miniEssay: {
        id: 'cs5-s2-e1',
        question: 'Trong bài toán "Chia mảng $a$ (các số dương) thành tối đa $K$ đoạn liên tiếp sao cho tổng lớn nhất của một đoạn là nhỏ nhất", xác định cận trái $l$ và cận phải $r$ chặt nhất khi khởi tạo Binary Search.',
        hint: 'Đoạn có tổng lớn nhất không thể nhỏ hơn phần tử lớn nhất, và cũng không thể vượt quá tổng cả mảng.',
        rubricChecklist: [
          'Nêu đúng cận dưới $l = \\max(a_i)$ (vì mọi phần tử phải thuộc ít nhất 1 đoạn).',
          'Nêu đúng cận trên $r = \\sum_{i=1}^N a_i$ (trường hợp $K = 1$ gộp thành 1 đoạn).'
        ],
        sampleAnswer: 'Vì không thể xé lẻ phần tử nên giới hạn tổng lớn nhất tối thiểu phải chứa được phần tử lớn nhất: $l = \\max(a_i)$. Trường hợp xấu nhất $K = 1$ gộp cả mảng thành 1 đoạn nên cận trên là $r = \\sum a_i$. Khởi tạo đúng `[l, r]` giúp tránh trường hợp `check(mid)` không chứa nổi một phần tử.'
      }
    },
    {
      stepTitle: '3. Chặt Nhị phân trên Số thực (Real Binary Search)',
      stepType: 'example',
      conceptSection:
        'Khi đáp án bài toán là một số thực (ví dụ độ dài cạnh, vận tốc, thời gian), không thể dùng `l = mid + 1` hay `while (l <= r)` vì số thực liên tục. Cách chuẩn và không bao giờ lặp vô tận là **chạy cố định 80–100 vòng lặp `for`**.',
      formulaSection: {
        primaryFormula: '\\text{Sai số sau } k \\text{ bước} = \\frac{R_0 - L_0}{2^k} \\xrightarrow{k = 80} < 10^{-24} (R_0 - L_0)',
        secondaryFormulas: [
          '\\texttt{for (int step = 0; step < 80; ++step) \\{ double mid = (l + r) * 0.5; ... \\}}'
        ],
        variablesNote:
          '• Tại sao không dùng `while (r - l > 1e-9)`? Nếu giá trị `l, r` cỡ $10^9$, khoảng cách biểu diễn giữa 2 số `double` liên tiếp lớn hơn $10^{-9}$, khiến `while (r - l > eps)` bị **treo TLE vĩnh viễn**!\n• Chạy cố định 80–100 lần `for` luôn đảm bảo độ chính xác tối đa của `double` trong $O(1)$ bước.'
      },
      deepDiveSection:
        'Với $k = 80$ bước, khoảng tìm kiếm thu hẹp đi $2^{80} \\approx 1{,}2 \\cdot 10^{24}$ lần — vượt xa giới hạn $53\\text{ bit}$ phần định trị của `double`. Đây là chuẩn mực vàng trong các kỳ thi ICPC/VOI khi chặt nhị phân số thực.',
      teacherExplanation:
        'Luôn dùng vòng lặp cố định 80–100 bước khi chặt nhị phân trên số thực để tránh lỗi lặp vô tận của sai số IEEE 754.',
      workedExample: {
        problem: 'Tìm nghiệm dương gần đúng của phương trình $x^3 + x - 10 = 0$ với sai số $< 10^{-6}$.',
        steps: [
          'Xét $f(x) = x^3 + x - 10$ đồng biến trên $[0, 10]$ với $f(0) = -10 < 0$ và $f(10) = 1000 > 0$.',
          'Chạy `for (int it = 0; it < 80; ++it)`: nếu $f(\\text{mid}) < 0$ gán `l = mid`, ngược lại gán `r = mid`.'
        ],
        answer: '$x \\approx 2{,}000000$ (chính xác hơn $10^{-15}$).'
      },
      keyTakeaway: 'Chặt nhị phân số thực luôn chạy cố định `for (step = 0..80)` thay cho `while (r - l > eps)`.',
      miniQuiz: [
        {
          id: 'cs5-s3-q1',
          question: 'Khi chặt nhị phân trên số thực với đáp án cỡ $10^9$, tại sao `for (int i = 0; i < 80; ++i)` an toàn hơn `while (r - l > 1e-12)`?',
          options: [
            'A. Vì `double` không đủ bit biểu diễn độ chênh $10^{-12}$ ở vùng số lớn nên vòng `while` dễ kẹt lặp vô hạn',
            'B. Vì `for` tự động chuyển `double` thành `int`',
            'C. Vì vòng `while` không dùng được biến `mid`',
            'D. Không có sự khác biệt nào'
          ],
          correctIndex: 0,
          explanation: 'Ở giá trị $10^9$, độ phân giải của `double` chỉ đạt khoảng $10^{-7}$, nên `mid` không thay đổi nữa và `r - l > 1e-12` luôn đúng mãi mãi.'
        },
        {
          id: 'cs5-s3-q2',
          question: 'Nếu ban đầu độ dài đoạn $[l, r]$ là $10^6$, sau 60 bước chia đôi đoạn còn lại có độ dài xấp xỉ:',
          options: [
            'A. $10^{-2}$',
            'B. $< 10^{-12}$ (vì $2^{60} > 10^{18}$)',
            'C. $10^3$',
            'D. $1$'
          ],
          correctIndex: 1,
          explanation: '$10^6 / 2^{60} \\approx 10^6 / 1{,}15 \\cdot 10^{18} < 10^{-12}$, dư sức đạt độ chính xác thi đấu.'
        }
      ],
      miniEssay: {
        id: 'cs5-s3-e1',
        question: 'Nêu điều kiện toán học cần có của hàm $f(x)$ trên đoạn $[a, b]$ để có thể tìm nghiệm $f(x) = 0$ bằng tìm kiếm nhị phân.',
        hint: 'Liên hệ tính liên tục và định lý giá trị trung gian (trái dấu ở hai đầu mút).',
        rubricChecklist: [
          'Nêu được $f(x)$ liên tục (thường đơn điệu) trên $[a, b]$.',
          'Nêu điều kiện $f(a) \\cdot f(b) \\le 0$ (hai đầu mút trái dấu hoặc có nghiệm tại biên).'
        ],
        sampleAnswer: 'Hàm $f(x)$ phải liên tục (và lý tưởng là đơn điệu) trên đoạn $[a, b]$ đồng thời thỏa $f(a) \\cdot f(b) \\le 0$ (tức giá trị tại hai đầu mút trái dấu nhau) để đảm bảo tại mỗi bước chia đôi luôn giữ được nửa đoạn chứa nghiệm.'
      }
    }
  ],

  'cs-6': [
    {
      stepTitle: '1. Mảng Cộng dồn 1D & 2D (Prefix Sum) Truy vấn Tổng $O(1)$',
      stepType: 'concept',
      conceptSection:
        'Mảng cộng dồn (`P[i]`) lưu tổng tích lũy từ đầu mảng tới chỉ số `i`. Nhờ phép tiền xử lý tuyến tính $O(N)$, mọi truy vấn tính tổng đoạn $[L, R]$ bất kỳ không còn tốn vòng lặp $O(N)$ mà trả lời tức thì trong **$O(1)$**.',
      formulaSection: {
        primaryFormula: 'P[i] = P[i-1] + A[i] \\implies \\sum_{k=L}^{R} A[k] = P[R] - P[L-1]',
        secondaryFormulas: [
          '\\text{Prefix Sum 2D: } S(r_1..r_2, c_1..c_2) = P[r_2][c_2] - P[r_1-1][c_2] - P[r_2][c_1-1] + P[r_1-1][c_1-1]',
          '\\text{Mảng hiệu (Difference Array): } D[L] += x,\\; D[R+1] -= x'
        ],
        variablesNote:
          '• Nên đánh số mảng từ **chỉ số 1** (`1-indexed`, với `P[0] = 0`) để không phải viết `if (L == 0)` khi lấy `P[L - 1]`.\n• Tổng $P[i]$ dễ vượt $2 \\cdot 10^9$ khi $N = 10^5, A_i = 10^9$ $\\implies$ luôn dùng `long long` cho mảng `P`!'
      },
      deepDiveSection:
        'Cặp bài trùng ngược của Prefix Sum là **Mảng hiệu (Difference Array)**: Nếu đề yêu cầu cộng thêm giá trị $x$ vào toàn bộ đoạn $[L, R]$ lặp lại $Q = 10^5$ lần rồi mới hỏi mảng cuối cùng, chỉ cần gán `D[L] += x; D[R + 1] -= x;` trong $O(1)$ mỗi truy vấn, cuối cùng tính tổng cộng dồn một lượt trên `D` là ra kết quả trong $O(N + Q)$!',
      teacherExplanation:
        'Dùng mảng 1-indexed với kiểu `long long` cho Prefix Sum 1D/2D và tận dụng Mảng hiệu để cập nhật đoạn trong $O(1)$.',
      keyTakeaway: 'Tổng đoạn $P[R] - P[L-1]$ dùng `long long` và chỉ số 1-indexed; cập nhật đoạn dùng Mảng hiệu.',
      miniQuiz: [
        {
          id: 'cs6-s1-q1',
          question: 'Cho mảng 1-indexed `A = [0, 3, -1, 4, 2, 5]`. Giá trị `P[5] - P[2]` tương ứng với tổng đoạn nào?',
          options: [
            'A. Đoạn $[2, 5]$ bằng $10$',
            'B. Đoạn $[3, 5]$ bằng $4 + 2 + 5 = 11$',
            'C. Đoạn $[1, 5]$ bằng $13$',
            'D. Đoạn $[3, 4]$ bằng $6$'
          ],
          correctIndex: 1,
          explanation: '$P[R] - P[L-1]$ tính tổng từ $L$ đến $R$. Với $R=5, L-1=2 \\implies L=3$, tổng là $A[3]+A[4]+A[5] = 4+2+5 = 11$.'
        },
        {
          id: 'cs6-s1-q2',
          question: 'Để tăng toàn bộ phần tử trong đoạn $[L, R]$ lên $v$ đơn vị bằng kỹ thuật Mảng hiệu `D`, ta thực hiện 2 lệnh $O(1)$ nào?',
          options: [
            'A. `D[L] += v; D[R] -= v;`',
            'B. `D[L] += v; D[R + 1] -= v;`',
            'C. `D[L - 1] += v; D[R] -= v;`',
            'D. `D[L] *= v; D[R] /= v;`'
          ],
          correctIndex: 1,
          explanation: 'Khi cộng dồn từ trái sang phải, hiệu ứng `+v` bắt đầu từ `L` và phải bị triệt tiêu ngay sau `R`, tức tại vị trí `R + 1`.'
        }
      ],
      miniEssay: {
        id: 'cs6-s1-e1',
        question: 'Giải thích công thức Bao hàm – Loại trừ trong Prefix Sum 2D: tại sao khi tính tổng hình chữ nhật $(r_1, c_1) \\to (r_2, c_2)$ phải cộng thêm `P[r1 - 1][c1 - 1]`?',
        hint: 'Kiểm tra vùng giao nhau khi trừ đi phần bên trên `P[r1-1][c2]` và phần bên trái `P[r2][c1-1]`.',
        rubricChecklist: [
          'Chỉ ra khi trừ `P[r1-1][c2]` và `P[r2][c1-1]`, vùng góc trên-trái `(1..r1-1, 1..c1-1)` bị trừ đi tới **hai lần**.',
          'Kết luận phải cộng bù lại `P[r1-1][c1-1]` đúng một lần.'
        ],
        sampleAnswer: 'Khi lấy `P[r2][c2]` trừ đi hình chữ nhật phía trên (`P[r1-1][c2]`) và hình chữ nhật bên trái (`P[r2][c1-1]`), phần giao của hai hình chữ nhật này là góc trên-trái `(1..r1-1, 1..c1-1)` đã bị trừ đi 2 lần. Do đó ta phải cộng trả lại `P[r1-1][c1-1]` để kết quả cân bằng chính xác.'
      }
    },
    {
      stepTitle: '2. Hai Con Trỏ (Two Pointers) & Cửa sổ Trượt (Sliding Window)',
      stepType: 'derivation',
      conceptSection:
        'Hai con trỏ `L` và `R` di chuyển **cùng một hướng tăng dần** từ $0$ tới $N-1$ thay vì quay đầu lại như hai vòng `for` lồng nhau. Mỗi phần tử chỉ được thêm bởi `R` đúng 1 lần và bỏ bởi `L` tối đa 1 lần, bảo đảm tổng thời gian đạt **$O(N)$**.',
      formulaSection: {
        primaryFormula: '\\text{Số lần dịch } L + \\text{Số lần dịch } R \\le 2N \\implies \\text{Time: } O(N)',
        secondaryFormulas: [
          '\\text{Điều kiện dùng Cửa sổ trượt mở rộng–thu hẹp: } a_i \\ge 0 \\text{ (tính đơn điệu tổng)}',
          '\\text{Hai con trỏ ngược chiều (mảng đã sort): nếu } a[L]+a[R] > S \\implies R--'
        ],
        variablesNote:
          '• **Cảnh báo cực quan trọng**: Nếu mảng có **số âm**, khi thu hẹp `L++` tổng đoạn có thể TĂNG lên thay vì giảm $\\implies$ phá vỡ tính đơn điệu, Sliding Window sẽ SAI! Khi mảng có số âm cần dùng `Prefix Sum + Map` ($O(N)$).'
      },
      deepDiveSection:
        'Cách kiểm tra nhanh một đoạn code có phải $O(N)$ dù viết vòng `while` bên trong `for` không?\nHãy nhìn xem con trỏ `L` có bao giờ lùi về bên trái (`L--` hay reset `L = 0`) không! Nếu `L` và `R` chỉ tiến về phía phải từ $0$ đến $N-1$, tổng số lần thực thi phần thân vòng `while` cả chương trình tối đa đúng bằng $N$ lần.',
      teacherExplanation:
        'Phân biệt điều kiện dùng Sliding Window ($a_i \\ge 0$) với Prefix Sum + Hash Map khi mảng chứa số âm.',
      keyTakeaway: 'Cửa sổ trượt đạt $O(N)$ nhưng CHỈ ĐÚNG cho tổng khi mảng không chứa số âm.',
      miniQuiz: [
        {
          id: 'cs6-s2-q1',
          question: 'Khi tìm đoạn con dài nhất có tổng $\\le S$ bằng kỹ thuật Sliding Window (`L` tăng khi `sum > S`), điều kiện bắt buộc của mảng `a` là gì?',
          options: [
            'A. Mảng phải chứa số âm',
            'B. Mọi phần tử $a_i \\ge 0$ (đảm bảo khi kéo rộng tổng không giảm, thu hẹp tổng không tăng)',
            'C. Mảng phải là số nguyên tố',
            'D. $N$ phải là số chẵn'
          ],
          correctIndex: 1,
          explanation: 'Nếu có phần tử âm, việc thu hẹp `L++` có thể làm tổng tăng lên hoặc mở rộng `R++` lại làm tổng giảm xuống, làm mất tính đơn điệu.'
        },
        {
          id: 'cs6-s2-q2',
          question: 'Trong thuật toán Cửa sổ trượt với `for (r = 0..n-1) { while (bad) l++; }`, tại sao độ phức tạp vẫn là $O(N)$ dù có `while` lồng trong `for`?',
          options: [
            'A. Vì `r` chỉ chạy tối đa $N$ bước và `l` chỉ tiến lên tối đa $N$ bước trên suốt chương trình',
            'B. Vì vòng `while` luôn chỉ lặp đúng 1 lần mỗi bước `r`',
            'C. Vì trình biên dịch bỏ qua vòng `while`',
            'D. Độ phức tạp thực tế vẫn là $O(N^2)$'
          ],
          correctIndex: 0,
          explanation: 'Con trỏ `l` không bao giờ reset lại về 0 ở mỗi bước `r`, nên tổng số phép tăng `l++` cộng dồn suốt toàn bộ vòng `for` tối đa bằng $N$.'
        }
      ],
      miniEssay: {
        id: 'cs6-s2-e1',
        question: 'Nếu đề cho mảng $A$ gồm CẢ SỐ ÂM VÀ SỐ DƯƠNG, yêu cầu đếm số đoạn con liên tiếp có tổng ĐÚNG BẰNG $K$. Trình bày ý tưởng giải $O(N)$ (hoặc $O(N\\log N)$) thay thế cho Hai con trỏ.',
        hint: 'Tổng đoạn $(j..i]$ bằng $K$ tương đương $P[i] - P[j-1] = K \\iff P[j-1] = P[i] - K$.',
        rubricChecklist: [
          'Viết được phương trình Prefix Sum: $P[i] - P[j] = K \\iff P[j] = P[i] - K$.',
          'Nêu cách dùng `map/unordered_map` đếm tần số các giá trị $P[j]$ đã gặp (khởi tạo `cnt[0] = 1`).'
        ],
        sampleAnswer: 'Ta duy trì tổng cộng dồn hiện tại `curSum` và bảng băm `cnt` lưu số lần xuất hiện của các tổng tiền tố trước đó (khởi tạo `cnt[0] = 1`). Tại mỗi phần tử `x`, ta cộng `curSum += x`, cộng vào đáp án giá trị `cnt[curSum - K]`, rồi tăng `cnt[curSum]++`. Thời gian $O(N)$ (hoặc $O(N\\log N)$ với `map`).'
      }
    },
    {
      stepTitle: '3. Thực hành: Đoạn con Dài nhất Tổng $\\le S$ & Gộp Mảng Đã Sort',
      stepType: 'example',
      conceptSection:
        'Ngoài Sliding Window, kỹ thuật Hai con trỏ còn dùng để **gộp hai mảng đã sắp xếp** (`merge` trong Merge Sort) và tìm cặp $a_i + a_j = S$ bằng 2 con trỏ đi từ hai đầu `l = 0, r = n - 1` ngược chiều nhau vào giữa.',
      formulaSection: {
        primaryFormula: '\\text{Merge 2 mảng sort: } O(N + M), \\qquad \\text{Two Sum (đã sort): } O(N)',
        secondaryFormulas: [
          '\\text{Cập nhật độ dài max đoạn } [l..r]:\\; \\texttt{ans = max(ans, r - l + 1)}'
        ],
        variablesNote:
          '• Khi cài đặt Sliding Window cho đoạn $[l, r]$, công thức độ dài đoạn luôn là `r - l + 1` (trừ khi đã tăng `r` trước).'
      },
      deepDiveSection:
        'Hãy để ý kỹ thứ tự cập nhật trong cửa sổ trượt tìm độ dài lớn nhất: (1) Thêm phần tử `a[r]` vào cửa sổ; (2) Chừng nào cửa sổ còn vi phạm điều kiện (ví dụ `sum > S`), loại `a[l]` và tăng `l++`; (3) Lúc này cửa sổ chắc chắn hợp lệ $\\implies$ cập nhật `ans = max(ans, r - l + 1)`.',
      teacherExplanation:
        'Thực hành đúng thứ tự 3 bước Mở rộng → Thu hẹp cho hết vi phạm → Cập nhật đáp án của Sliding Window.',
      workedExample: {
        problem: 'Cho mảng $a = [2, 3, 1, 2, 4, 3]$ và $S = 7$. Tìm độ dài đoạn con liên tiếp dài nhất có tổng $\\le 7$.',
        steps: [
          '$r=0..2$: $[2, 3, 1]$, tổng $6 \\le 7 \\implies \\text{len} = 3$.',
          '$r=3$: thêm $2 \\implies$ tổng $8 > 7$, bỏ $l=0$ ($2$) $\\implies$ còn $[3, 1, 2]$ tổng $6$, $\\text{len} = 3$.',
          '$r=4$: thêm $4 \\implies$ tổng $10 > 7$, bỏ $3$ còn $7 \\le 7$ ($[1, 2, 4]$), $\\text{len} = 3$.'
        ],
        answer: 'Độ dài tối đa bằng $3$.'
      },
      keyTakeaway: 'Thứ tự Sliding Window: Thêm `r` → `while` loại `l` tới khi hợp lệ → Cập nhật kết quả.',
      miniQuiz: [
        {
          id: 'cs6-s3-q1',
          question: 'Cho đoạn chỉ số hợp lệ từ `l` đến `r` (tính cả 2 đầu mút). Số lượng phần tử trong đoạn đó là:',
          options: ['A. `r - l`', 'B. `r - l + 1`', 'C. `r - l - 1`', 'D. `r + l`'],
          correctIndex: 1,
          explanation: 'Số phần tử từ `l` tới `r` (inclusive) luôn là `r - l + 1`.'
        },
        {
          id: 'cs6-s3-q2',
          question: 'Trên mảng đã sắp xếp tăng dần `[-3, 1, 4, 6, 9]`, dùng 2 con trỏ ngược chiều tìm 2 số có tổng bằng $10$. Ban đầu `l = 0 (-3), r = 4 (9)`. Tổng $-3 + 9 = 6 < 10$, bước tiếp theo ta dịch con trỏ nào?',
          options: [
            'A. Giảm `r--`',
            'B. Tăng `l++` để tăng tổng lên',
            'C. Dừng ngay vì không có nghiệm',
            'D. Đặt lại `l = r`'
          ],
          correctIndex: 1,
          explanation: 'Do mảng tăng dần và tổng đang nhỏ hơn $10$, ta cần tăng giá trị tổng bằng cách dịch con trỏ trái sang phải (`l++`).'
        }
      ],
      miniEssay: {
        id: 'cs6-s3-e1',
        question: 'Viết vòng lặp Sliding Window (C++ hoặc Python) tìm độ dài đoạn con liên tiếp ngắn nhất có tổng $\\ge S$ trên mảng các số nguyên dương.',
        hint: 'Khi `sum >= S`, cập nhật `ans = min(ans, r - l + 1)` NGAY BÊN TRONG vòng `while` trước khi đẩy `l++`.',
        rubricChecklist: [
          'Đặt `ans = min(ans, r - l + 1)` bên trong `while (sum >= S)` trước khi trừ `a[l]` và tăng `l++`.',
          'Xử lý trường hợp không tìm thấy đoạn nào (trả về 0).'
        ],
        sampleAnswer: 'Khởi tạo `ans = n + 1, sum = 0, l = 0`. Với mỗi `r` từ `0` đến `n-1`: `sum += a[r]; while (sum >= S) { ans = min(ans, r - l + 1); sum -= a[l++]; }`. Cuối cùng nếu `ans == n + 1` trả về `0`, ngược lại trả về `ans`.'
      }
    }
  ],

  'cs-7': [
    {
      stepTitle: '1. Bản chất Quy hoạch động: Trạng thái & Công thức Truy hồi',
      stepType: 'concept',
      conceptSection:
        'Quy hoạch động (Dynamic Programming - DP) giải bài toán lớn bằng cách chia thành các bài toán con gối nhau, giải mỗi trạng thái **đúng 1 lần** và lưu vào bảng `dp[]`. Bốn bước thiết kế DP chuẩn là: (1) Định nghĩa trạng thái; (2) Công thức chuyển trạng thái; (3) Khởi tạo bài toán cơ sở; (4) Thứ tự tính.',
      formulaSection: {
        primaryFormula: '\\text{DP} = \\text{Cấu trúc con tối ưu} + \\text{Bài toán con gối nhau}',
        secondaryFormulas: [
          '\\text{0/1 Knapsack 2D: } dp[i][w] = \\max(dp[i-1][w],\\; dp[i-1][w - w_i] + v_i)',
          '\\text{0/1 Knapsack tối ưu 1D: } \\texttt{for (w = W; w >= w[i]; w--)} \\; dp[w] = \\max(dp[w], dp[w-w_i]+v_i)'
        ],
        variablesNote:
          '• **Điểm sống còn của Knapsack 0/1 bản 1D**: vòng lặp trọng lượng `w` BẮT BUỘC duyệt **ngược từ `W` về `w[i]`**. Nếu duyệt xuôi `w[i] -> W` thì cùng một món hàng sẽ bị chọn nhiều lần (biến thành bài toán Cái túi Không giới hạn / Unbounded Knapsack!).'
      },
      deepDiveSection:
        'Tại sao duyệt ngược `w` từ `W` xuống `w[i]` giúp giảm bộ nhớ Knapsack 0/1 từ $O(N \\cdot W)$ xuống chỉ còn $O(W)$?\nKhi đang tính hàng $i$, giá trị `dp[w - w[i]]` ở bên trái vẫn đang giữ nguyên kết quả của hàng $i - 1$ vì ta chưa ghi đè lên các ô nhỏ hơn `w`!',
      teacherExplanation:
        'Phân biệt vòng lặp `w` duyệt ngược (0/1 Knapsack — mỗi vật chọn tối đa 1 lần) và duyệt xuôi (Unbounded Knapsack — chọn vô hạn lần).',
      keyTakeaway: '0/1 Knapsack 1D: vòng `w` duyệt NGƯỢC (`W -> w[i]`); Unbounded: duyệt XUÔI (`w[i] -> W`).',
      miniQuiz: [
        {
          id: 'cs7-s1-q1',
          question: 'Trong cài đặt Knapsack 0/1 (mỗi vật chọn tối đa 1 lần) tối ưu mảng 1D `dp[W]`, vòng lặp `w` phải chạy theo chiều nào?',
          options: [
            'A. Xuôi từ `w[i]` lên `W`',
            'B. Ngược từ `W` xuống `w[i]`',
            'C. Ngẫu nhiên đều đúng',
            'D. Chỉ kiểm tra tại `w == W`'
          ],
          correctIndex: 1,
          explanation: 'Duyệt ngược đảm bảo khi đọc `dp[w - w[i]]`, ô đó vẫn là giá trị của lớp `i - 1` (chưa dùng vật `i`).'
        },
        {
          id: 'cs7-s1-q2',
          question: 'Với $N = 100$ đồ vật và sức chứa $W = 10^4$, độ phức tạp thời gian và bộ nhớ tối ưu của bài toán Cái túi 0/1 là:',
          options: [
            'A. Time $O(N \\cdot W)$, Space $O(W)$',
            'B. Time $O(2^N)$, Space $O(N)$',
            'C. Time $O(N \\log W)$, Space $O(1)$',
            'D. Time $O(W^2)$, Space $O(N^2)$'
          ],
          correctIndex: 0,
          explanation: 'Chạy 2 vòng lặp `N` và `W` mất $O(N \\cdot W)$, tối ưu mảng cuộn chỉ cần đúng 1 mảng 1D cỡ $W + 1$.'
        }
      ],
      miniEssay: {
        id: 'cs7-s1-e1',
        question: 'Cho bài toán Đổi tiền (Coin Change): có các mệnh giá $c_1, \\dots, c_n$ (mỗi loại có vô hạn đồng). Giải thích tại sao khi tính số cách hoặc số đồng ít nhất để tạo tổng $S$, vòng lặp tổng `w` lại cần duyệt XUÔI từ $c_i$ đến $S$?',
        hint: 'Liên hệ việc sử dụng lại cùng một mệnh giá nhiều lần trong cùng bước chuyển.',
        rubricChecklist: [
          'Giải thích được khi duyệt xuôi từ `c[i]` lên `S`, ô `dp[w - c[i]]` đã chứa trạng thái có thể đã chọn mệnh giá `c[i]` trước đó.',
          'Kết luận điều đó cho phép chọn mệnh giá `c[i]` lặp lại không giới hạn số lần.'
        ],
        sampleAnswer: 'Do mỗi mệnh giá tiền được phép dùng vô hạn lần, khi tính `dp[w]` từ `dp[w - c[i]]`, ta muốn `dp[w - c[i]]` đã bao gồm khả năng dùng chính đồng $c_i$ trước đó rồi. Vì vậy duyệt xuôi `w` từ `c[i]` lên `S` sẽ tự động cho phép tái sử dụng mệnh giá $c_i$ nhiều lần.'
      }
    },
    {
      stepTitle: '2. Dãy con Tăng Dài nhất (LIS): Từ $O(N^2)$ lên $O(N \\log N)$',
      stepType: 'derivation',
      conceptSection:
        'Bài toán LIS tìm độ dài dãy con (không nhất thiết liên tiếp) tăng nghiêm ngặt dài nhất. Cách DP cơ bản `dp[i] = max(dp[j] + 1)` mất $O(N^2)$, chỉ chạy được $N \\le 5000$. Để giải $N = 2 \\cdot 10^5$, ta dùng mảng `tails[]` kết hợp `lower_bound` đạt **$O(N \\log N)$**.',
      formulaSection: {
        primaryFormula: 'O(N^2): dp[i] = 1 + \\max_{j < i,\\; a[j] < a[i]} dp[j] \\xrightarrow{\\text{lower\\_bound}} O(N \\log N)',
        secondaryFormulas: [
          '\\texttt{tails[k]} = \\text{giá trị kết thúc NHỎ NHẤT của một dãy tăng độ dài } k + 1',
          '\\text{Tăng nghiêm ngặt } (<): \\texttt{lower\\_bound}; \\quad \\text{Không giảm } (\\le): \\texttt{upper\\_bound}'
        ],
        variablesNote:
          '• Mảng `tails` luôn giữ tính chất **tăng nghiêm ngặt**, cho phép dùng `lower_bound(tails, x)` tìm vị trí thay thế trong $O(\\log N)$.\n• Chú ý: độ dài `tails.size()` chính xác là độ dài LIS, nhưng các phần tử bên trong `tails` **không phải** là một dãy con hợp lệ thực tế (nếu muốn truy vết phải lưu thêm mảng `parent`).'
      },
      deepDiveSection:
        'Tại sao thay thế phần tử đầu tiên `>= x` trong `tails` bằng `x` không làm giảm đáp án mà còn mở rộng cơ hội cho tương lai?\nVì với cùng một độ dài $L$, một dãy con kết thúc bằng số nhỏ hơn ($x \\le y$) luôn "dễ" nối thêm các phần tử lớn hơn ở phía sau hơn!',
      teacherExplanation:
        'Nắm vững tư duy tham lam của mảng `tails` và phân biệt `lower_bound` (tăng nghiêm ngặt) với `upper_bound` (không giảm).',
      keyTakeaway: 'LIS tăng nghiêm ngặt dùng `lower_bound` trên `tails[]`; dãy không giảm dùng `upper_bound`.',
      miniQuiz: [
        {
          id: 'cs7-s2-q1',
          question: 'Khi cài đặt LIS $O(N \\log N)$ cho dãy **không giảm** ($a_{i_1} \\le a_{i_2} \\le \\dots$), hàm tìm kiếm nhị phân nào được dùng trên mảng `tails`?',
          options: [
            'A. `lower_bound`',
            'B. `upper_bound`',
            'C. `binary_search` trả về bool',
            'D. Duyệt tuyến tính từ cuối'
          ],
          correctIndex: 1,
          explanation: 'Vì cho phép các phần tử bằng nhau đứng cạnh nhau, giá trị `x` chỉ thay thế phần tử đầu tiên **lớn hơn hẳn** `x` (`upper_bound`), còn nếu bằng thì có thể kéo dài dãy.'
        },
        {
          id: 'cs7-s2-q2',
          question: 'Cho mảng `a = [3, 1, 5, 2, 6, 4]`. Sau khi xử lý xong thuật toán `tails[]` với `lower_bound`, độ dài LIS thu được là:',
          options: ['A. 2', 'B. 3 (ví dụ `[1, 2, 6]` hoặc `[1, 2, 4]`)', 'C. 4', 'D. 5'],
          correctIndex: 1,
          explanation: 'Quá trình cập nhật `tails`: `[3] -> [1] -> [1,5] -> [1,2] -> [1,2,6] -> [1,2,4]`, kích thước cuối là $3$.'
        }
      ],
      miniEssay: {
        id: 'cs7-s2-e1',
        question: 'Cho mảng `a = [10, 9, 2, 5, 3, 7, 101, 18]`. Hãy mô phỏng từng bước mảng `tails[]` theo thuật toán $O(N\\log N)$ và cho biết vì sao không thể in trực tiếp mảng `tails[]` làm đáp án dãy con nếu $a$ kết thúc bằng một số rất nhỏ.',
        hint: 'Thử xem điều gì xảy ra nếu phần tử cuối cùng của mảng là `1`.',
        rubricChecklist: [
          'Mô phỏng đúng quá trình `tails` ra độ dài 4 (`[2, 3, 7, 18]`).',
          'Giải thích được khi thêm một số nhỏ hơn vào đầu `tails`, nó ghi đè phần tử ở chỉ số đầu nhưng những phần tử sau vẫn thuộc nhánh dãy cũ nên `tails` mất thứ tự chỉ số gốc.'
        ],
        sampleAnswer: 'Diễn biến `tails`: `[10] -> [9] -> [2] -> [2,5] -> [2,3] -> [2,3,7] -> [2,3,7,101] -> [2,3,7,18]` (độ dài 4). Nếu thêm phần tử `1` vào cuối mảng, `tails` thành `[1,3,7,18]`, trong đó số `1` đứng SAU số `3` trong mảng gốc nên không tạo thành dãy con hợp lệ mà chỉ đóng vai trò lưu độ dài tiềm năng.'
      }
    },
    {
      stepTitle: '3. Thực hành: Truy vết Kết quả DP & Xâu con Chung Dài nhất (LCS)',
      stepType: 'example',
      conceptSection:
        'Ngoài tìm giá trị tối ưu (tổng max, độ dài max), đề thi thường yêu cầu **in ra cụ thể** các vật được chọn hoặc xâu kết quả. Muốn vậy ta chỉ cần đi ngược lại từ trạng thái đích `dp[n][W]` theo đúng nhánh đã tạo ra giá trị cực đại.',
      formulaSection: {
        primaryFormula: 'LCS: \\; dp[i][j] = \\begin{cases} dp[i-1][j-1] + 1 & \\text{nếu } A[i]=B[j] \\\\ \\max(dp[i-1][j], dp[i][j-1]) & \\text{nếu } A[i]\\ne B[j] \\end{cases}',
        secondaryFormulas: [
          '\\text{Truy vết Knapsack 2D: nếu } dp[i][w] \\ne dp[i-1][w] \\implies \\text{Đã chọn vật } i'
        ],
        variablesNote:
          '• Nếu bài toán yêu cầu **truy vết** trong Knapsack mà $N \\cdot W$ nhỏ ($\\le 10^7$), nên giữ mảng 2D `dp[i][w]` (hoặc `bool take[i][w]`) để truy vết ngược dễ dàng.'
      },
      deepDiveSection:
        'Đừng quên khử tràn bộ nhớ trong LCS khi độ dài hai xâu tới $5000$: mảng `int dp[5005][5005]` tốn tới $100\\text{ MB}$; nếu chỉ cần độ dài (không cần truy vết) thì nén về 2 hàng `prev[]` và `curr[]` chỉ tốn $40\\text{ KB}$!',
      teacherExplanation:
        'Nắm chắc công thức chuyển LCS và cách lần ngược bảng DP để in nghiệm khi đề yêu cầu truy vết.',
      workedExample: {
        problem: 'Tìm độ dài LCS của hai xâu `"ABCB"` và `"BDCAB"`.',
        steps: [
          'Điền bảng $dp[4][5]$ theo công thức so khớp ký tự.',
          'Truy vết ngược từ $dp[4][5] = 3$ thu được các xâu chung độ dài 3 như `"BCB"` hoặc `"BAB"`.'
        ],
        answer: 'Độ dài LCS = $3$.'
      },
      keyTakeaway: 'Nếu cần truy vết Knapsack, giữ mảng 2D `take[i][w]`; LCS độ dài lớn có thể nén 2 dòng.',
      miniQuiz: [
        {
          id: 'cs7-s3-q1',
          question: 'Khi truy vết trên bảng $dp[i][w]$ của bài toán Cái túi 0/1 (từ $i = N$ về $1$), dấu hiệu chắc chắn vật $i$ ĐÃ ĐƯỢC CHỌN là:',
          options: [
            'A. `dp[i][w] == dp[i - 1][w]`',
            'B. `dp[i][w] != dp[i - 1][w]` (và cập nhật `w -= w[i]`)',
            'C. `w[i] == 0`',
            'D. `dp[i][w] == 0`'
          ],
          correctIndex: 1,
          explanation: 'Nếu giá trị tốt nhất khi xét đến vật $i$ khác hẳn lúc chưa xét vật $i$, vật $i$ chắc chắn đã được lấy vào túi.'
        },
        {
          id: 'cs7-s3-q2',
          question: 'Độ phức tạp của bài toán tìm độ dài Xâu con chung dài nhất (LCS) cho hai xâu độ dài $M$ và $N$ bằng Quy hoạch động cơ bản là:',
          options: [
            'A. $O(M + N)$',
            'B. $O(M \\cdot N)$',
            'C. $O(2^{M+N})$',
            'D. $O(M \\log N)$'
          ],
          correctIndex: 1,
          explanation: 'Bảng $dp$ gồm $M \\times N$ trạng thái, mỗi ô tính trong $O(1)$ nên mất $O(M \\cdot N)$.'
        }
      ],
      miniEssay: {
        id: 'cs7-s3-e1',
        question: 'So sánh cách cài đặt truy hồi giữa DP Top-Down (Đệ quy có nhớ) và DP Bottom-Up (Vòng lặp). Khi nào nên ưu tiên Bottom-Up?',
        hint: 'Xét chi phí gọi hàm đệ quy, giới hạn Stack và khả năng tối ưu bộ nhớ cuộn mảng.',
        rubricChecklist: [
          'Top-Down dễ viết theo định nghĩa toán học và chỉ tính trạng thái cần thiết, nhưng tốn chi phí Stack.',
          'Bottom-Up nhanh hơn (không overhead gọi hàm), không tràn Stack và dễ nén mảng cuộn từ 2D xuống 1D.'
        ],
        sampleAnswer: 'Top-Down (đệ quy có nhớ) tự nhiên với tư duy truy hồi và bỏ qua các trạng thái không chạm tới, nhưng dễ tràn Stack khi sâu $> 10^5$. Bottom-Up (vòng lặp) chạy nhanh hơn hẳn, an toàn Stack và cho phép nén mảng cuộn (như từ 2D xuống 1D ở Knapsack) nên luôn được ưu tiên khi cần tối ưu thời gian và RAM.'
      }
    }
  ],

  'cs-8': [
    {
      stepTitle: '1. Biểu diễn Đồ thị & Thuật toán Duyệt DFS / BFS',
      stepType: 'concept',
      conceptSection:
        'Đồ thị gồm tập đỉnh $V$ và tập cạnh $E$. Trong lập trình thi đấu, ta biểu diễn bằng **Danh sách kề (`vector<vector<int>> adj`)** chiếm $O(V + E)$ bộ nhớ thay vì Ma trận kề $O(V^2)$ (tràn RAM khi $V > 10^4$). **DFS** đi sâu tối đa bằng ngăn xếp/đệ quy; **BFS** loang theo từng lớp bằng hàng đợi (`queue`), đảm bảo tìm ra đường đi **ngắn nhất** trên đồ thị **không trọng số**.',
      formulaSection: {
        primaryFormula: '\\text{Time}(\\text{DFS}) = \\text{Time}(\\text{BFS}) = O(V + E)',
        secondaryFormulas: [
          '\\text{Số thành phần liên thông} = \\text{số lần khởi phát DFS/BFS từ đỉnh chưa thăm}',
          '\\text{Kiểm tra đồ thị hai phía (Bipartite): Tô 2 màu bằng BFS/DFS}'
        ],
        variablesNote:
          '• Nếu đồ thị vô hướng, khi thêm cạnh `(u, v)` nhớ `adj[u].push_back(v)` VÀ `adj[v].push_back(u)`.\n• Trên lưới 2D kích thước $R \\times C$, sử dụng 4 hướng dịch chuyển `dx = {-1, 1, 0, 0}`, `dy = {0, 0, -1, 1}` cùng BFS là cách chuẩn xác để tìm đường ngắn nhất trong mê cung.'
      },
      deepDiveSection:
        'Bẫy rất hay gặp với BFS: chỉ đánh dấu `vis[v] = true` **sau khi lấy `v` ra khỏi queue** thay vì đánh dấu **ngay lúc đẩy `v` vào queue**! Làm vậy khiến cùng một đỉnh `v` bị nhiều hàng xóm đẩy lặp lại vào `queue`, gây bùng nổ bộ nhớ (MLE) và chậm (TLE)!',
      teacherExplanation:
        'Sử dụng Danh sách kề $O(V+E)$ và tuân thủ nguyên tắc vàng của BFS: đánh dấu `visited`/`dist` ngay tại thời điểm push đỉnh vào `queue`.',
      keyTakeaway: 'BFS đánh dấu đỉnh đã thăm NGAY LÚC đẩy vào `queue`, cho đường ngắn nhất khi cạnh đồng trọng số.',
      miniQuiz: [
        {
          id: 'cs8-s1-q1',
          question: 'Với đồ thị có $V = 10^5$ đỉnh và $E = 2 \\cdot 10^5$ cạnh, cấu trúc lưu trữ nào hợp lý nhất?',
          options: [
            'A. Ma trận kề `int adj[100005][100005]`',
            'B. Danh sách kề `vector<int> adj[100005]` ($O(V+E)$ bộ nhớ)',
            'C. Chỉ lưu mảng 1 chiều các đỉnh',
            'D. Không cấu trúc nào lưu được'
          ],
          correctIndex: 1,
          explanation: 'Ma trận kề $10^5 \\times 10^5$ tốn tới $40\\text{ GB}$ RAM; Danh sách kề chỉ tốn khoảng vài MB.'
        },
        {
          id: 'cs8-s1-q2',
          question: 'Tại sao trong thuật toán BFS phải đặt `vis[v] = true` (hoặc cập nhật `dist[v]`) ngay trước khi `q.push(v)`?',
          options: [
            'A. Để tránh cùng một đỉnh `v` bị nhiều đỉnh kề khác nhau đẩy lặp lại vào hàng đợi',
            'B. Để biến BFS thành DFS',
            'C. Vì C++ không cho phép kiểm tra `vis` sau khi `pop`',
            'D. Không bắt buộc, kết quả thời gian vẫn hệt nhau'
          ],
          correctIndex: 0,
          explanation: 'Nếu không đánh dấu lúc `push`, một đỉnh có $k$ hàng xóm ở lớp trước sẽ bị đẩy vào `queue` tới $k$ lần, dễ tràn queue và TLE.'
        }
      ],
      miniEssay: {
        id: 'cs8-s1-e1',
        question: 'So sánh mục đích sử dụng chính giữa DFS và BFS trên đồ thị không trọng số (ví dụ: tìm đường đi ngắn nhất, đếm thành phần liên thông, tìm chu trình).',
        hint: 'Chỉ ra tác vụ nào BFS bắt buộc vượt trội và tác vụ nào DFS tự nhiên hơn.',
        rubricChecklist: [
          'Cả hai đều đếm thành phần liên thông trong $O(V+E)$.',
          'BFS loang từng lớp nên tìm đúng đường đi ngắn nhất ít cạnh nhất; DFS thuận tiện tìm chu trình, thứ tự topo, khớp cầu.'
        ],
        sampleAnswer: 'Cả DFS và BFS đều duyệt toàn bộ đồ thị trong $O(V+E)$ nên đều dùng để kiểm tra liên thông hay tô 2 màu. Tuy nhiên, BFS lan theo bán kính tăng dần nên luôn tìm ra đường đi ngắn nhất (ít cạnh nhất) trên đồ thị không trọng số; còn DFS rất tự nhiên khi phát hiện chu trình, sắp xếp Topo hoặc tính thời gian vào/ra trên cây.'
      }
    },
    {
      stepTitle: '2. Đường đi Ngắn nhất có Trọng số không âm: Thuật toán Dijkstra',
      stepType: 'derivation',
      conceptSection:
        'Khi các cạnh có trọng số dương khác nhau (ví dụ độ dài đường bộ, chi phí vé), BFS không còn tìm đúng đường ngắn nhất. Thuật toán **Dijkstra** dùng **Hàng đợi ưu tiên (`priority_queue` Min-Heap)** luôn chọn đỉnh `u` có khoảng cách `dist[u]` nhỏ nhất hiện tại để thư giãn (relax) các cạnh kề.',
      formulaSection: {
        primaryFormula: '\\text{Relax}(u \\xrightarrow{w} v):\\; \\text{nếu } d[u] + w < d[v] \\implies d[v] = d[u] + w',
        secondaryFormulas: [
          '\\text{Time Dijkstra + Min-Heap: } O((V + E) \\log V)',
          '\\text{Cấm: } w < 0 \\text{ (nếu có cạnh âm phải dùng Bellman-Ford / SPFA)}'
        ],
        variablesNote:
          '• **Cảnh báo Lazy Deletion**: Khi đỉnh `u` được lấy ra từ `priority_queue` với giá trị `d`, bắt buộc kiểm tra `if (d > dist[u]) continue;` (nếu giá trị trong heap đã cũ hơn kỷ lục `dist[u]` thì bỏ qua ngay!), nếu thiếu dòng này độ phức tạp sẽ bị nâng lên $O(V \\cdot E)$!'
      },
      deepDiveSection:
        'Tại sao Dijkstra không dùng được khi đồ thị có trọng số âm? Bởi Dijkstra dựa trên tính chất tham lam: một khi đã lấy đỉnh `u` nhỏ nhất ra khỏi Min-Heap, mọi đường vòng đi qua các đỉnh chưa xét (có tổng $\\ge d[u]$ cộng thêm cạnh $\\ge 0$) đều không thể ngắn hơn $d[u]$. Nếu có cạnh âm ở phía sau, tính chất đó bị phá vỡ hoàn toàn.',
      teacherExplanation:
        'Cài đặt chuẩn Dijkstra với Min-Heap (`priority_queue` ngược dấu), `long long INF = 4e18` và câu lệnh chặn cũ `if (d > dist[u]) continue;`.',
      keyTakeaway: 'Dijkstra chỉ đúng khi trọng số $w \\ge 0$; luôn có `if (d > dist[u]) continue;` và dùng `long long`.',
      miniQuiz: [
        {
          id: 'cs8-s2-q1',
          question: 'Nếu quên dòng `if (d > dist[u]) continue;` ngay sau khi `pop` đỉnh `(d, u)` khỏi `priority_queue` trong Dijkstra, chuyện gì xảy ra?',
          options: [
            'A. Đáp án bị sai hoàn toàn',
            'B. Đỉnh `u` bị duyệt lặp lại nhiều lần với các giá trị cũ gây mất thời gian (TLE)',
            'C. Chương trình không biên dịch được',
            'D. Tự động giải được cả cạnh âm'
          ],
          correctIndex: 1,
          explanation: 'Vì mỗi lần cập nhật tốt hơn ta đẩy một bản sao mới vào heap mà không xóa bản sao cũ, kiểm tra `d > dist[u]` giúp bỏ qua các bản sao lỗi thời.'
        },
        {
          id: 'cs8-s2-q2',
          question: 'Khi đồ thị có trọng số cạnh lên tới $10^9$ và $10^5$ đỉnh, giá trị vô cực `INF` cho mảng `dist` nên chọn là:',
          options: [
            'A. `1000000` ($10^6$)',
            'B. `INT_MAX` ($2{,}14 \\cdot 10^9$)',
            'C. `long long INF = 4e18`',
            'D. `-1`'
          ],
          correctIndex: 2,
          explanation: 'Độ dài đường đi dài nhất qua $10^5$ cạnh có thể lên tới $10^{14}$, vượt xa `int`, nên cần kiểu `long long` với `INF = 4e18`.'
        }
      ],
      miniEssay: {
        id: 'cs8-s2-e1',
        question: 'Lấy một ví dụ đồ thị nhỏ gồm 3 đỉnh có cạnh âm mà thuật toán Dijkstra trả về sai đáp án đường đi ngắn nhất từ đỉnh 1 đến đỉnh 3.',
        hint: 'Đặt 2 đường đi: $1 \\to 3$ trọng số $2$, và $1 \\to 2$ trọng số $5$, $2 \\to 3$ trọng số $-10$.',
        rubricChecklist: [
          'Xây dựng được ví dụ có cạnh âm làm đường vòng ngắn hơn đường trực tiếp đã được chốt trước.',
          'Chỉ ra bước mà Dijkstra chốt nhầm khoảng cách đỉnh đích vì tham lam không xét cạnh âm phía sau.'
        ],
        sampleAnswer: 'Xét 3 đỉnh với các cạnh: $1 \\to 3$ (trọng số $2$), $1 \\to 2$ (trọng số $5$), $2 \\to 3$ (trọng số $-10$). Từ 1, Dijkstra rút đỉnh $3$ ra đầu tiên vì $d[3] = 2 < d[2] = 5$ và chốt $d[3]=2$. Nhưng thực tế đường đi $1 \\to 2 \\to 3$ có tổng chi phí chỉ $5 + (-10) = -5 < 2$.'
      }
    },
    {
      stepTitle: '3. Thực hành Đường đi Ngắn nhất: Đa nguồn & Truy vết Đường đi',
      stepType: 'example',
      conceptSection:
        'Trong nhiều bài thực tế (tìm đường từ một trong nhiều trạm cứu hỏa, hoặc tính ngắn nhất có 1 vé giảm giá nửa tiền), ta mở rộng Dijkstra/BFS bằng **Multi-Source** (đẩy toàn bộ nguồn xuất phát vào queue ngay từ đầu) hoặc tách mỗi đỉnh thành **trạng thái `(u, k)`** trên đồ thị mở rộng.',
      formulaSection: {
        primaryFormula: '\\text{Truy vết đường đi: } \\texttt{parent[v] = u} \\implies \\text{Đảo ngược mảng từ đích } T \\text{ về } S',
        secondaryFormulas: [
          '\\text{Kiểm tra không có đường: } \\texttt{dist[T] == INF}'
        ],
        variablesNote:
          '• Khi đồ thị mở rộng trạng thái `(u, used_coupon)` có 2 trạng thái mỗi đỉnh: ta giữ mảng khoảng cách 2 chiều `dist[u][0]` và `dist[u][1]`, vẫn chạy Dijkstra bình thường trong $O((V+E)\\log V)$!'
      },
      deepDiveSection:
        'Bài toán *Flight Discount (CSES)* — được giảm giá 50% cho **đúng 1 cạnh** trên đường đi — chính là ví dụ kinh điển nhất cho việc mở rộng đồ thị thành 2 tầng (`dist[u][0]`: chưa dùng vé; `dist[u][1]`: đã dùng vé) rồi chạy Dijkstra một lượt duy nhất.',
      teacherExplanation:
        'Biết cách lưu mảng `parent[v]` để truy vết hành trình và mô hình hóa bài toán trạng thái thành đồ thị nhiều tầng cho Dijkstra.',
      workedExample: {
        problem: 'Tìm đường đi ngắn nhất từ đỉnh 1 đến đỉnh $N$, được phép giảm giá một nửa cho tối đa 1 chuyến bay.',
        steps: [
          'Tạo trạng thái `dist[u][0]` (chưa dùng vé) và `dist[u][1]` (đã dùng vé).',
          'Từ `(u, 0)` đi cạnh $w$ sang `v`: hoặc sang `(v, 0)` tốn $+w$, hoặc dùng vé sang `(v, 1)` tốn $+\\lfloor w/2 \\rfloor$.',
          'Từ `(u, 1)` chỉ được sang `(v, 1)` tốn $+w$.'
        ],
        answer: 'Đáp án là $\\min(dist[N][0], dist[N][1])$.'
      },
      keyTakeaway: 'Dùng đồ thị trạng thái `dist[u][state]` biến các bài đường đi có điều kiện về Dijkstra chuẩn.',
      miniQuiz: [
        {
          id: 'cs8-s3-q1',
          question: 'Khi chạy Dijkstra/BFS có lưu mảng `parent[v] = u` để truy vết đường đi từ $S$ tới $T$, bước khôi phục chuỗi đỉnh đúng thứ tự xuôi từ $S \\to T$ là:',
          options: [
            'A. Xuất trực tiếp theo vòng `for (i = S; i <= T; ++i)`',
            'B. Lần ngược `cur = T; while (cur != -1) { path.push_back(cur); cur = parent[cur]; }` rồi **đảo ngược** `path`',
            'C. In mảng `dist` theo thứ tự tăng dần',
            'D. Sắp xếp mảng `parent`'
          ],
          correctIndex: 1,
          explanation: '`parent` trỏ ngược từ đích về nguồn, nên sau khi lần ngược thu được dãy $T \\to \\dots \\to S$, ta cần `reverse(path)` để được $S \\to \\dots \\to T$.'
        },
        {
          id: 'cs8-s3-q2',
          question: 'Nếu cần tìm khoảng cách ngắn nhất từ MỘT TRONG CÁC trạm xăng $\{s_1, s_2, \\dots, s_k\}$ tới mỗi đỉnh trong lưới/đồ thị, cách làm $O(V + E)$ tốt nhất là:',
          options: [
            'A. Chạy $k$ lần BFS riêng biệt ($O(k(V+E))$)',
            'B. Khởi tạo tất cả $s_1 \\dots s_k$ cùng lúc `dist[s_i] = 0` vào chung 1 `queue` và chạy BFS **1 lần duy nhất**',
            'C. Dùng Floyd-Warshall $O(V^3)$',
            'D. Dùng Quay lui'
          ],
          correctIndex: 1,
          explanation: 'BFS đa nguồn (Multi-source BFS) khởi đầu đồng thời lớp 0 gồm mọi nguồn và giữ nguyên độ phức tạp $O(V+E)$.'
        }
      ],
      miniEssay: {
        id: 'cs8-s3-e1',
        question: 'So sánh phạm vi áp dụng và độ phức tạp của 3 thuật toán đường đi ngắn nhất: BFS, Dijkstra, và Floyd-Warshall.',
        hint: 'Xét trọng số (không trọng số / không âm / có thể âm) và $1$ nguồn so với mọi cặp đỉnh.',
        rubricChecklist: [
          'BFS: không trọng số (hoặc trọng số 1), 1 nguồn, $O(V+E)$.',
          'Dijkstra: trọng số không âm, 1 nguồn, $O((V+E)\\log V)$.',
          'Floyd-Warshall: mọi cặp đỉnh, cho phép cạnh âm (không chu trình âm), $O(V^3)$ (chỉ dùng khi $V \\le 400$).'
        ],
        sampleAnswer: '1. **BFS**: Dùng cho đồ thị không trọng số, độ phức tạp $O(V+E)$.\n2. **Dijkstra**: Dùng cho đồ thị có trọng số không âm ($w \\ge 0$), độ phức tạp $O((V+E)\\log V)$.\n3. **Floyd-Warshall**: Tìm đường đi ngắn nhất giữa mọi cặp đỉnh cùng lúc (cho phép cạnh âm nếu không có chu trình âm), độ phức tạp $O(V^3)$ nên chỉ áp dụng khi $V \\le 400$.'
      }
    }
  ],

  'cs-9': [
    {
      stepTitle: '1. Cây Phân đoạn (Segment Tree): Cập nhật Điểm & Truy vấn Đoạn',
      stepType: 'concept',
      conceptSection:
        'Mảng cộng dồn trả lời tổng đoạn trong $O(1)$ nhưng cập nhật 1 phần tử mất $O(N)$ nếu phải dựng lại cả mảng. **Segment Tree** lưu thông tin tổng hợp (Sum/Min/Max) của từng nửa đoạn dưới dạng cây nhị phân đầy đủ, cân bằng tuyệt đối cả hai thao tác ở mức **$O(\\log N)$**!',
      formulaSection: {
        primaryFormula: '\\text{Nút } id \\text{ quản lý } [l, r] \\longrightarrow \\text{Trái: } 2\\cdot id\\, [l, m], \\quad \\text{Phải: } 2\\cdot id + 1\\, [m+1, r]',
        secondaryFormulas: [
          '\\text{Build: } O(N), \\quad \\text{Update 1 điểm: } O(\\log N), \\quad \\text{Query đoạn } [u, v]: O(\\log N)',
          '\\text{Kích thước mảng cây an toàn: } 4 \\cdot N \\text{ phần tử}'
        ],
        variablesNote:
          '• Tại sao cần cấp phát kích thước **`4 * N`**? Khi $N$ không phải lũy thừa của 2 (ví dụ $N = 2^k + 1$), độ sâu cây làm chỉ số nút lá lớn nhất có thể vượt $2N$ lên gần $4N$.'
      },
      deepDiveSection:
        'Quy tắc 3 trường hợp khi viết hàm `query(id, l, r, u, v)` trên Segment Tree:\n1. **Không giao nhau** (`r < u || l > v`): trả về **phần tử đơn vị** (`0` nếu tính Tổng, `-INF` nếu tìm Max, `+INF` nếu tìm Min).\n2. **Nằm gọn bên trong** (`u <= l && r <= v`): trả ngay `st[id]` mà không đi sâu nữa.\n3. **Giao một phần**: gộp kết quả của con trái và con phải!',
      teacherExplanation:
        'Nắm vững cấu trúc đánh số nút $2\\cdot id$, kích thước mảng $4N$, và 3 trường hợp giao đoạn trong hàm `query`.',
      keyTakeaway: 'Mảng Segment Tree luôn khai báo `4 * N`; nút con là `2*id` và `2*id + 1`.',
      miniQuiz: [
        {
          id: 'cs9-s1-q1',
          question: 'Khi dùng Segment Tree tìm giá trị **LỚN NHẤT (Max)** trên đoạn $[u, v]$, nếu đoạn $[l, r]$ của nút hiện tại nằm hoàn toàn ngoài $[u, v]$ (`r < u || l > v`), hàm `query` phải trả về giá trị nào?',
          options: [
            'A. `0` (sẽ sai nếu mảng có toàn số âm!)',
            'B. `-INF` (âm vô cực, nhỏ hơn mọi giá trị trong mảng)',
            'C. `+INF`',
            'D. `st[id]`'
          ],
          correctIndex: 1,
          explanation: 'Phần tử đơn vị của phép toán `max` là `-INF` để khi lấy `max(leftRes, rightRes)` nó không ảnh hưởng kết quả của nhánh hợp lệ.'
        },
        {
          id: 'cs9-s1-q2',
          question: 'Cho mảng có $N = 10^5$ phần tử. Kích thước mảng `st[]` tối thiểu cần khai báo để cài đặt Segment Tree an toàn không tràn chỉ số là:',
          options: ['A. $N + 5$', 'B. $2N$', 'C. $4N$ (`400005`)', 'D. $N^2$'],
          correctIndex: 2,
          explanation: 'Với kích thước bất kỳ không phải lũy thừa của 2, chỉ số nút cây nhị phân trên đoạn có thể đạt gần $4N$.'
        }
      ],
      miniEssay: {
        id: 'cs9-s1-e1',
        question: 'Nêu sự khác biệt chính về công năng và độ phức tạp giữa Mảng cộng dồn (Prefix Sum) và Cây phân đoạn (Segment Tree). Khi nào bắt buộc dùng Segment Tree?',
        hint: 'So sánh bài toán chỉ có truy vấn đọc (tĩnh) với bài toán vừa cập nhật giá trị vừa truy vấn đoạn (động).',
        rubricChecklist: [
          'Prefix Sum: Build $O(N)$, Query $O(1)$, nhưng Update 1 phần tử tốn $O(N)$.',
          'Segment Tree: Update và Query đều $O(\\log N)$, bắt buộc dùng khi dữ liệu thay đổi liên tục giữa các truy vấn.'
        ],
        sampleAnswer: 'Mảng cộng dồn xử lý mảng tĩnh cực nhanh ($O(1)$ mỗi truy vấn) nhưng nếu giá trị phần tử thay đổi liên tục, mỗi lần sửa phải tính lại $O(N)$. Segment Tree hỗ trợ xen kẽ cả sửa phần tử và truy vấn Tổng/Min/Max đoạn trong $O(\\log N)$ mỗi thao tác.'
      }
    },
    {
      stepTitle: '2. Lazy Propagation (Cập nhật Đoạn trên Segment Tree)',
      stepType: 'derivation',
      conceptSection:
        'Nếu bài toán yêu cầu cộng thêm $val$ cho **cả một đoạn $[u, v]$** thay vì chỉ 1 điểm, gọi update từng điểm sẽ mất $O(N \\log N)$. Kỹ thuật **Lazy Propagation** giữ lại lượng cập nhật ở mảng `lazy[id]` và chỉ đẩy (`push`) xuống 2 nút con **khi thực sự cần đi xuống tiếp**.',
      formulaSection: {
        primaryFormula: '\\texttt{push(id, l, r)}: \\; st[2id] += \\text{lazy}[id]\\cdot \\text{len}_L,\\quad st[2id+1] += \\text{lazy}[id]\\cdot \\text{len}_R',
        secondaryFormulas: [
          '\\text{Range Update } [u, v] \\text{ + Range Query } [u, v]: \\text{cùng đạt } O(\\log N)'
        ],
        variablesNote:
          '• Lưu ý cực quan trọng: Khi cập nhật TỔNG đoạn, công thức push là `st[child] += lazy[id] * (r_child - l_child + 1)` (nhân với số phần tử mà con quản lý!); còn khi cập nhật MAX/MIN đoạn thì chỉ cộng `st[child] += lazy[id]` (không nhân kích thước đoạn!).'
      },
      deepDiveSection:
        'Hãy tưởng tượng `lazy[id]` như một tờ giấy ghi chú nợ: *"Nút này đã cộng xong cho chính nó rồi, nhưng 2 con bên dưới vẫn chưa nhận tiền, khi nào có ai hỏi tới chúng thì mới chuyển tờ giấy xuống và xóa giấy nợ ở cha (`lazy[id] = 0`)"*. Nhờ vậy mỗi lần Range Update chỉ chạm vào tối đa $4\\log N$ nút!',
      teacherExplanation:
        'Hiểu bản chất trì hoãn đẩy xuống (`push`) của `lazy[]` và phân biệt cập nhật Tổng (có nhân độ dài đoạn) với Max/Min (không nhân).',
      keyTakeaway: 'Gọi `push(id, l, r)` ngay trước khi rẽ nhánh xuống `2*id` và `2*id + 1`; tính xong nhớ reset `lazy[id] = 0`.',
      miniQuiz: [
        {
          id: 'cs9-s2-q1',
          question: 'Trong hàm `push` của Segment Tree cộng thêm giá trị $v$ lên cả đoạn để truy vấn **MAX** của đoạn, giá trị `st[2*id]` được cộng thêm lượng nào?',
          options: [
            'A. `lazy[id] * (mid - l + 1)`',
            'B. `lazy[id]` (chỉ cộng 1 lần vì mọi phần tử trong đoạn đều tăng cùng lượng `lazy[id]`)',
            'C. `lazy[id] / 2`',
            'D. `0`'
          ],
          correctIndex: 1,
          explanation: 'Khi mọi số trong đoạn cùng tăng thêm $v$, giá trị Max mới chỉ bằng giá trị Max cũ $+ v$ (khác với phép tính Tổng phải nhân độ dài đoạn).'
        },
        {
          id: 'cs9-s2-q2',
          question: 'Khi viết Lazy Propagation, thao tác `push(id)` cần được gọi vào thời điểm nào?',
          options: [
            'A. Sau khi đã đệ quy về từ 2 con',
            'B. Ngay trước khi đệ quy rẽ xuống 2 nút con `2*id` và `2*id + 1` (ở cả `update` và `query`)',
            'C. Chỉ gọi 1 lần duy nhất ở hàm `build`',
            'D. Không cần gọi trong hàm `query`'
          ],
          correctIndex: 1,
          explanation: 'Phải đẩy thông tin còn nợ từ `id` xuống 2 con TRƯỚC khi đọc hoặc cập nhật dữ liệu trong 2 con ở cả `update` lẫn `query`.'
        }
      ],
      miniEssay: {
        id: 'cs9-s2-e1',
        question: 'Giải thích tại sao sau khi đẩy giá trị `lazy[id]` xuống 2 con trong hàm `push(id)`, ta bắt buộc phải gán `lazy[id] = 0`?',
        hint: 'Điều gì xảy ra nếu có một truy vấn khác đi qua nút `id` lần thứ hai?',
        rubricChecklist: [
          'Chỉ ra `lazy[id]` đại diện cho lượng cập nhật CHƯA chuyển giao cho con.',
          'Nếu quên đặt lại về 0, lần đi qua tiếp theo sẽ đẩy trùng thêm một lần nữa làm sai lệch toàn bộ cây con.'
        ],
        sampleAnswer: 'Biến `lazy[id]` chỉ lưu phần cập nhật đang "nợ" hai nút con. Một khi đã cộng đầy đủ xuống `2*id` và `2*id + 1`, món nợ của nút `id` đã hoàn tất. Nếu không đặt lại `lazy[id] = 0`, mọi lần truy vấn hoặc cập nhật sau đi qua nút `id` sẽ cộng dồn trùng lặp giá trị đó nhiều lần.'
      }
    },
    {
      stepTitle: '3. Disjoint Set Union (DSU): Nén Đường & Gộp Theo Kích thước',
      stepType: 'example',
      conceptSection:
        '**DSU (Union-Find)** quản lý các tập hợp rời nhau hỗ trợ 2 thao tác cực nhanh gần như $O(1)$ ($O(\\alpha(N))$): `find(u)` tìm đại diện tập chứa `u`, và `unite(u, v)` hợp nhất hai tập. DSU là trái tim của **Thuật toán Kruskal** tìm Cây khung nhỏ nhất (MST).',
      formulaSection: {
        primaryFormula: '\\text{Time mỗi thao tác (Path Compression + Union by Size): } O(\\alpha(N)) \\approx O(1)',
        secondaryFormulas: [
          '\\texttt{find(u)}: \\texttt{return parent[u] == u ? u : parent[u] = find(parent[u]);}',
          '\\text{Số thao tác tối đa với } N \\le 10^9: \\; \\alpha(N) \\le 4'
        ],
        variablesNote:
          '• **Nén đường (Path Compression)**: khi `find(u)` đi qua nút nào thì gắn thẳng `parent` của nó vào gốc tối cao, giúp các lần gọi sau gần như đi 1 bước.\n• **Gộp theo kích thước (Union by Size)**: luôn gộp cây ít đỉnh hơn làm con của cây nhiều đỉnh hơn để giữ chiều cao cây rất nông.'
      },
      deepDiveSection:
        'Ngoài kiểm tra liên thông động khi *thêm cạnh* ($u \\leftrightarrow v$), DSU còn dùng rất hay cho bài toán **tô màu đoạn / xóa phần tử tiếp theo**: đặt `nxt[i]` là phần tử chưa bị xóa nhỏ nhất $\\ge i$; khi xóa `i`, chỉ việc `unite` / gán `nxt[i] = find(i + 1)`!',
      teacherExplanation:
        'Kết hợp Path Compression và Union by Size để DSU đạt $O(\\alpha(N))$ và ứng dụng vào cây khung Kruskal.',
      workedExample: {
        problem: 'Kiểm tra khi thêm tuần tự $10^5$ cạnh xem cạnh nào tạo ra chu trình mới.',
        steps: [
          'Khởi tạo `parent[i] = i, sz[i] = 1` cho $i = 1..N$.',
          'Với mỗi cạnh `(u, v)`: gọi `a = find(u)`, `b = find(v)`. Nếu `a == b`, hai đỉnh đã cùng thành phần $\\implies$ cạnh này tạo chu trình! Ngược lại gọi `unite(a, b)`.'
        ],
        answer: 'Toàn bộ $10^5$ cạnh xử lý trong $\\approx 10\\text{ ms}$.'
      },
      keyTakeaway: 'Cài đủ Nén đường (`parent[u] = find(parent[u])`) và Gộp theo size để DSU chạy $O(\\alpha(N))$.',
      miniQuiz: [
        {
          id: 'cs9-s3-q1',
          question: 'Khi thêm một cạnh nối hai đỉnh $u, v$ vào đồ thị đang quản lý bởi DSU, điều kiện để biết cạnh này tạo thành **chu trình** là:',
          options: [
            'A. `find(u) != find(v)`',
            'B. `find(u) == find(v)`',
            'C. `sz[u] == sz[v]`',
            'D. `u < v`'
          ],
          correctIndex: 1,
          explanation: 'Nếu `find(u) == find(v)`, hai đỉnh $u$ và $v$ đã nằm trong cùng một thành phần liên thông trước đó, nên nối thêm cạnh `(u, v)` chắc chắn khép kín thành chu trình.'
        },
        {
          id: 'cs9-s3-q2',
          question: 'Hàm `int find(int u) { return parent[u] == u ? u : parent[u] = find(parent[u]); }` thể hiện kỹ thuật tối ưu nào của DSU?',
          options: [
            'A. Chia để trị',
            'B. Nén đường (Path Compression)',
            'C. Sàng nguyên tố',
            'D. Lazy Propagation'
          ],
          correctIndex: 1,
          explanation: 'Phép gán `parent[u] = find(...)` nối thẳng tất cả các đỉnh trên đường tìm kiếm vào nút gốc của tập.'
        }
      ],
      miniEssay: {
        id: 'cs9-s3-e1',
        question: 'Mô tả các bước của Thuật toán Kruskal tìm Cây khung nhỏ nhất (MST) và nêu vai trò của DSU trong thuật toán này.',
        hint: 'Sắp xếp danh sách cạnh rồi dùng DSU kiểm tra trước khi chọn.',
        rubricChecklist: [
          'Bước 1: Sắp xếp tất cả $E$ cạnh theo trọng số tăng dần ($O(E \\log E)$).',
          'Bước 2: Duyệt từng cạnh $(u, v, w)$; dùng DSU kiểm tra `find(u) != find(v)` — nếu khác nhau thì chọn cạnh vào MST và gộp `unite(u, v)`.'
        ],
        sampleAnswer: 'Thuật toán Kruskal sắp xếp toàn bộ cạnh theo trọng số tăng dần ($O(E \\log E)$), sau đó duyệt lần lượt từng cạnh $(u, v, w)$. DSU đóng vai trò kiểm tra trong $O(\\alpha(V))$ xem $u$ và $v$ đã liên thông chưa (`find(u) == find(v)`). Nếu chưa, ta thêm cạnh vào cây khung và gộp hai tập bằng `unite(u, v)` cho đến khi đủ $V - 1$ cạnh.'
      }
    }
  ],

  'cs-10': [
    {
      stepTitle: '1. Thuật toán Euclid (GCD/LCM) & Số học Đồng dư Modulo',
      stepType: 'concept',
      conceptSection:
        'Thuật toán Euclid tìm ước chung lớn nhất $\\gcd(a, b)$ dựa trên đẳng thức $\\gcd(a, b) = \\gcd(b, a \\bmod b)$ chỉ mất **$O(\\log(\\min(a,b)))$** bước. Với các bài kết quả khổng lồ, mọi phép toán cộng, trừ, nhân đều phải lấy phần dư theo **modulo** (thường $MOD = 10^9 + 7$) ngay ở từng phép tính trung gian.',
      formulaSection: {
        primaryFormula: '\\text{lcm}(a, b) = \\frac{a}{\\gcd(a, b)} \\cdot b \\quad \\text{(Chia TRƯỚC, nhân SAU để tránh tràn!)}',
        secondaryFormulas: [
          '(a + b) \\bmod M = ((a \\bmod M) + (b \\bmod M)) \\bmod M',
          '\\text{Phép trừ an toàn tránh âm: } ((a - b) \\bmod M + M) \\bmod M'
        ],
        variablesNote:
          '• **Cạm bẫy phép trừ trong C++**: Toán tử `-5 % 7` trong C++ trả về `-5` (số âm!), còn Python trả về `2`. Vì thế trong C++ luôn phải cộng bù `+ M` rồi `% M`!\n• **Cạm bẫy phép chia**: Không được làm `(a / b) % M`! Muốn chia theo modulo $p$ nguyên tố phải nhân với **nghịch đảo modulo**: $a \\cdot b^{p-2} \\bmod p$.'
      },
      deepDiveSection:
        'Tại sao trong công thức BCNN lại viết `(a / gcd(a, b)) * b` thay vì `(a * b) / gcd(a, b)`?\nGiả sử $a = b = 10^{12}$. Nếu tính $a \\cdot b = 10^{24}$ trước thì sẽ **tràn `long long`** ($9{,}22 \\cdot 10^{18}$) ngay lập tức! Chia `a` cho `gcd(a, b)` trước bảo đảm thương số là số nguyên và giảm cỡ số tối đa trước khi nhân.',
      teacherExplanation:
        'Tránh tràn số bằng chia trước nhân sau khi tính LCM; xử lý phép trừ đồng dư C++ bằng `((a - b) % M + M) % M`.',
      keyTakeaway: 'Tính LCM luôn viết `(a / gcd(a, b)) * b`; phép trừ đồng dư C++ luôn viết `((x % M) + M) % M`.',
      miniQuiz: [
        {
          id: 'cs10-s1-q1',
          question: 'Khi $a, b$ kiểu `long long` cỡ $10^{12}$, biểu thức tính Bội chung nhỏ nhất nào sau đây KHÔNG bị tràn số trung gian (nếu kết quả cuối $\\le 10^{18}$)?',
          options: [
            'A. `(a * b) / __gcd(a, b)`',
            'B. `(a / __gcd(a, b)) * b`',
            'C. `a * b % __gcd(a, b)`',
            'D. `a + b / __gcd(a, b)`'
          ],
          correctIndex: 1,
          explanation: 'Vì $\\gcd(a, b)$ luôn chia hết $a$, thực hiện `a / gcd(a, b)` trước cho số nguyên nhỏ nhất rồi mới nhân $b$.'
        },
        {
          id: 'cs10-s1-q2',
          question: 'Trong C++, để đảm bảo kết quả hiệu $(A - B) \\bmod M$ luôn nằm trong $[0, M - 1]$ (không âm), ta viết:',
          options: [
            'A. `(A - B) % M`',
            'B. `((A - B) % M + M) % M`',
            'C. `abs(A - B) % M`',
            'D. `(A + B) % M`'
          ],
          correctIndex: 1,
          explanation: '`abs(A - B)` sai khi $A - B$ âm (ví dụ $-1 \\bmod 7 = 6$, không phải $1$). Cộng `+ M` rồi `% M` đảm bảo chuẩn đồng dư.'
        }
      ],
      miniEssay: {
        id: 'cs10-s1-e1',
        question: 'Tại sao ta KHÔNG ĐƯỢC phép viết `(a / b) % MOD` khi tính toán đồng dư, và định lý nào giúp thay thế phép chia trong modulo nguyên tố $p$?',
        hint: 'Liên hệ Định lý Fermat nhỏ $b^{p-1} \\equiv 1 \\pmod p$.',
        rubricChecklist: [
          'Giải thích phép chia nguyên không bảo toàn tính chất đồng dư (ví dụ $(10/2)\\bmod 7 = 5$, nhưng $(10\\bmod 7)/2 = 3/2$).',
          'Nêu đúng cách nhân với nghịch đảo modulo bằng Định lý Fermat nhỏ: $b^{-1} \\equiv b^{p-2} \\pmod p$.'
        ],
        sampleAnswer: 'Phép đồng dư không bảo toàn với phép chia thông thường (ví dụ $a$ sau khi lấy mod $p$ có thể không còn chia hết cho $b$). Với $p$ là số nguyên tố và $\\gcd(b, p) = 1$, theo Định lý Fermat nhỏ ta có $b^{p-1} \\equiv 1 \\pmod p \\implies b^{-1} \\equiv b^{p-2} \\pmod p$. Ta biến phép chia thành phép nhân $a \\cdot b^{p-2} \\bmod p$.'
      }
    },
    {
      stepTitle: '2. Lũy thừa Nhị phân (Binary Exponentiation) $O(\\log B)$',
      stepType: 'derivation',
      conceptSection:
        'Tính $a^b \\bmod M$ khi $b = 10^{18}$ không thể dùng vòng `for` $b$ lần. Kỹ thuật **Lũy thừa Nhị phân** tách số mũ $b$ theo các bit nhị phân (hoặc chia đôi $b \\to b/2$): bình phương cơ số $a$ lên và nhân vào đáp án mỗi khi bit cuối của $b$ là $1$.',
      formulaSection: {
        primaryFormula: 'a^b = \\begin{cases} 1 & b = 0 \\\\ (a^{b/2})^2 & b \\text{ chẵn} \\\\ (a^{b/2})^2 \\cdot a & b \\text{ lẻ} \\end{cases}',
        secondaryFormulas: [
          '\\text{Số lần lặp: } \\lfloor \\log_2 b \\rfloor + 1 \\le 60 \\text{ bước với } b = 10^{18}',
          '\\text{Áp dụng tổng quát: Lũy thừa Ma trận tính } F_n \\text{ trong } O(\\log n)'
        ],
        variablesNote:
          '• Trước khi chạy vòng lặp, luôn đưa cơ số về dạng dư: `a %= mod;`.\n• Trong bước nhân `res = res * a % mod`, nhớ cả `res`, `a`, `mod` dùng kiểu `long long` để $10^9 \\times 10^9 = 10^{18}$ không tràn.'
      },
      deepDiveSection:
        'Sức mạnh thật sự của Lũy thừa Nhị phân nằm ở chỗ nó áp dụng được cho **mọi phép toán có tính kết hợp**, bao gồm **Nhân Ma trận**! Nhờ nhân ma trận kích thước $2 \\times 2$ kết hợp lũy thừa nhị phân, ta tính được số Fibonacci thứ $10^{18}$ mod $10^9 + 7$ chỉ trong $O(2^3 \\log(10^{18})) \\approx 480$ phép tính!',
      teacherExplanation:
        'Cài đặt vòng lặp Lũy thừa Nhị phân không đệ quy trong $O(\\log b)$ và mở rộng sang Nhân Ma trận.',
      keyTakeaway: 'Lũy thừa Nhị phân tính $a^b \\bmod M$ với $b \\le 10^{18}$ chỉ trong tối đa 60 vòng lặp.',
      miniQuiz: [
        {
          id: 'cs10-s2-q1',
          question: 'Khi tính $a^b \\bmod M$ với $b = 10^{18}$ bằng Lũy thừa Nhị phân, vòng lặp `while (b > 0)` chạy tối đa khoảng bao nhiêu lần?',
          options: ['A. $10^9$ lần', 'B. 60 lần', 'C. $10^6$ lần', 'D. $10^{18}$ lần'],
          correctIndex: 1,
          explanation: 'Mỗi bước chia đôi `b >>= 1` tương đương mất 1 bit; $10^{18} < 2^{60}$ nên chỉ tốn tối đa 60 bước.'
        },
        {
          id: 'cs10-s2-q2',
          question: 'Trong Lũy thừa Nhị phân tìm $3^{13}$, số mũ $13 = (1101)_2$ khiến biến kết quả `res` được nhân thêm cơ số ở những lũy thừa nào của 3?',
          options: [
            'A. $3^1, 3^4, 3^8$',
            'B. $3^1, 3^2, 3^8$',
            'C. Chỉ nhân 1 lần ở $3^8$',
            'D. Phải nhân đủ 13 lần'
          ],
          correctIndex: 0,
          explanation: '$13 = 8 + 4 + 1 = 2^3 + 2^2 + 2^0$, tương ứng nhân `res` với $3^1 \\cdot 3^4 \\cdot 3^8 = 3^{13}$.'
        }
      ],
      miniEssay: {
        id: 'cs10-s2-e1',
        question: 'Viết hàm C++ hoặc Python tính $a^b \\bmod m$ bằng vòng lặp `while (b > 0)` (không đệ quy) và chỉ ra vì sao cần gán `a %= m` ngay đầu hàm.',
        hint: 'Điều gì xảy ra nếu đầu vào cho $a = 10^{18}$ và $m = 10^9 + 7$?',
        rubricChecklist: [
          'Viết đúng vòng lặp `if (b & 1) res = res * a % m; a = a * a % m; b >>= 1;`.',
          'Giải thích được nếu không `a %= m`, phép tính `a * a` ngay bước đầu có thể thành $(10^{18})^2$ gây tràn `long long`.'
        ],
        sampleAnswer: '```cpp\nlong long binpow(long long a, long long b, long long m) {\n  long long res = 1;\n  a %= m;\n  while (b > 0) {\n    if (b & 1) res = res * a % m;\n    a = a * a % m;\n    b >>= 1;\n  }\n  return res;\n}\n```\nCần `a %= m` ngay đầu để đưa `a < m` (thường $< 10^9$), nếu không phép `a * a` khi $a \\approx 10^{18}$ sẽ lập tức tràn `long long`.'
      }
    },
    {
      stepTitle: '3. Thực hành Tổ hợp Modulo $C_n^k \\bmod p$',
      stepType: 'example',
      conceptSection:
        'Tính hệ số nhị phân $C_n^k \\bmod (10^9 + 7)$ cho nhiều truy vấn với $n \\le 10^6$: tiền xử lý sẵn mảng giai thừa `fact[i]` và mảng nghịch đảo giai thừa `invFact[i]` trong $O(N)$ để trả lời mỗi truy vấn trong **$O(1)$**!',
      formulaSection: {
        primaryFormula: '\\binom{n}{k} \\bmod p = \\texttt{fact}[n] \\cdot \\texttt{invFact}[k] \\bmod p \\cdot \\texttt{invFact}[n-k] \\bmod p',
        secondaryFormulas: [
          '\\texttt{invFact}[N] = (\\texttt{fact}[N])^{p - 2} \\bmod p',
          '\\texttt{invFact}[i - 1] = \\texttt{invFact}[i] \\cdot i \\bmod p \\quad (\\text{Lùi từ } N \\text{ về } 0 \\text{ chỉ mất } O(N)!)'
        ],
        variablesNote:
          '• Lưu ý tính `invFact[i - 1] = invFact[i] * i % p`: chỉ cần gọi `binpow` **đúng 1 lần** ở `invFact[N]`, toàn bộ $10^6$ phần tử còn lại suy ra bằng vòng lặp lùi trong $O(N)$!'
      },
      deepDiveSection:
        'Nếu gọi `binpow` tính nghịch đảo cho từng truy vấn sẽ mất $O(Q \\log p)$; còn với công thức lùi `invFact[i - 1] = invFact[i] * i % p`, chi phí nghịch đảo cả triệu số giai thừa tốn chưa tới $5\\text{ ms}$ và mỗi truy vấn $C_n^k$ chỉ còn đúng 2 phép nhân!',
      teacherExplanation:
        'Áp dụng `fact[N]` + `invFact[N]` lùi tuyến tính để giải tổ hợp modulo tốc độ $O(1)$ mỗi truy vấn.',
      workedExample: {
        problem: 'Tính $\\binom{10^6}{5\\cdot 10^5} \\bmod (10^9 + 7)$ cho $10^5$ truy vấn.',
        steps: [
          'Tiền xử lý `fact[0..10^6]` trong $O(N)$.',
          'Tính `invFact[10^6] = binpow(fact[10^6], MOD - 2, MOD)`.',
          'Dùng vòng lùi `invFact[i-1] = invFact[i] * i % MOD`, sau đó trả lời mỗi truy vấn trong $O(1)$.'
        ],
        answer: 'Tổng thời gian $< 0{,}1\\text{ giây}$.'
      },
      keyTakeaway: 'Tiền xử lý `invFact[N]` rồi tính lùi `invFact[i-1] = invFact[i] * i % p` cho phép tính $C_n^k$ trong $O(1)$.',
      miniQuiz: [
        {
          id: 'cs10-s3-q1',
          question: 'Khi $k > n$ hoặc $k < 0$, giá trị tổ hợp $\\binom{n}{k}$ trả về phải là:',
          options: ['A. 1', 'B. 0', 'C. -1', 'D. `fact[n]`'],
          correctIndex: 1,
          explanation: 'Theo định nghĩa tổ hợp, không có cách nào chọn $k > n$ phần tử từ $n$ phần tử, nên luôn trả về 0.'
        },
        {
          id: 'cs10-s3-q2',
          question: 'Mối liên hệ đúng giúp tính nhanh `invFact[i - 1]` từ `invFact[i]` (với $i!^{-1}$) là:',
          options: [
            'A. `invFact[i - 1] = invFact[i] * i % MOD`',
            'B. `invFact[i - 1] = invFact[i] / i % MOD`',
            'C. `invFact[i - 1] = invFact[i] + i`',
            'D. `invFact[i - 1] = binpow(i, MOD - 2)`'
          ],
          correctIndex: 0,
          explanation: 'Vì $\\frac{1}{(i-1)!} = \\frac{1}{i!} \\cdot i$, chỉ cần nhân thêm $i$ rồi lấy đồng dư trong $O(1)$!'
        }
      ],
      miniEssay: {
        id: 'cs10-s3-e1',
        question: 'Kiểm tra và chứng minh vì sao $\\texttt{invFact}[i - 1] \\equiv \\texttt{invFact}[i] \\cdot i \\pmod p$.',
        hint: 'Khai triển $i! = (i-1)! \\cdot i$.',
        rubricChecklist: [
          'Viết được $(i!)^{-1} \\cdot i = ((i-1)! \\cdot i)^{-1} \\cdot i = ((i-1)!)^{-1}$.',
          'Nêu được lợi ích hạ thời gian tiền xử lý từ $O(N\\log p)$ xuống $O(N + \\log p)$.'
        ],
        sampleAnswer: 'Ta có $i! = (i-1)! \\cdot i$. Nhân cả hai vế với $(i!)^{-1} \\cdot ((i-1)!)^{-1}$ suy ra $((i-1)!)^{-1} \\equiv (i!)^{-1} \\cdot i \\pmod p$. Nhờ vậy ta chỉ cần tính đúng 1 lần `binpow` cho $N!$ rồi duyệt lùi để có toàn bộ bảng nghịch đảo trong $O(N)$.'
      }
    }
  ],

  'cs-11': [
    {
      stepTitle: '1. Stack Đơn điệu (Monotonic Stack): Tìm Phần tử Lớn hơn Gần nhất',
      stepType: 'concept',
      conceptSection:
        '**Stack đơn điệu** giữ các phần tử (thường lưu **chỉ số**) luôn sắp xếp theo thứ tự tăng hoặc giảm nghiêm ngặt. Khi có phần tử mới `a[i]` chuẩn bị đẩy vào mà làm hỏng tính đơn điệu, ta lần lượt `pop` những phần tử vi phạm ra — chính lúc `pop` đó giúp ta xác định ngay điểm giới hạn trái/phải của mỗi phần tử trong **$O(N)$**!',
      formulaSection: {
        primaryFormula: '\\text{Mỗi phần tử } i \\text{ vào Stack } 1 \\text{ lần, ra tối đa } 1 \\text{ lần} \\implies \\text{Time: } O(N)',
        secondaryFormulas: [
          '\\text{Diện tích Hình chữ nhật lớn nhất trong Histogram: } S_i = h[i] \\cdot (R[i] - L[i] - 1)'
        ],
        variablesNote:
          '• Luôn lưu **chỉ số `i`** vào `stack<int>` thay vì giá trị `a[i]`, vì từ chỉ số `i` vừa biết được vị trí tính khoảng cách `(i - prev)` vừa tra được giá trị `a[i]`!'
      },
      deepDiveSection:
        'Tại sao các bài toán tìm hình chữ nhật lớn nhất trên lưới 0/1 hoặc trên biểu đồ cột Histogram đều quy về Stack đơn điệu?\nVới mỗi cột cao $h[i]$, chiều rộng tối đa mở rộng được về hai bên chỉ bị chặn bởi **cột đầu tiên thấp hơn $h[i]$** ở bên trái ($L[i]$) và bên phải ($R[i]$). Một lượt Stack đơn điệu tăng tìm cả $L[i], R[i]$ cho $10^5$ cột chỉ tốn $O(N)$!',
      teacherExplanation:
        'Lưu chỉ số vào Stack đơn điệu để tìm biên trái/phải nhỏ hơn (hoặc lớn hơn) gần nhất của mọi phần tử trong $O(N)$.',
      keyTakeaway: 'Đẩy CHỈ SỐ vào Stack đơn điệu; mỗi phần tử vào-ra Stack đúng 1 lần nên luôn chạy $O(N)$.',
      miniQuiz: [
        {
          id: 'cs11-s1-q1',
          question: 'Cho dãy cột `[2, 1, 5, 6, 2, 3]`. Để tìm biên trái & biên phải thấp hơn gần nhất của từng cột nhằm tính hình chữ nhật lớn nhất (Histogram), ta duy trì Stack đơn điệu:',
          options: [
            'A. Tăng dần giá trị từ đáy lên đỉnh (`a[st.top()] >= a[i]` thì `pop`)',
            'B. Ngẫu nhiên không cần sắp thứ tự',
            'C. Chỉ chứa duy nhất 1 phần tử',
            'D. Sắp theo chỉ số giảm dần'
          ],
          correctIndex: 0,
          explanation: 'Duy trì Stack tăng dần: khi gặp `a[i] <= a[st.top()]`, ta biết phần tử đỉnh stack bị chặn bên phải bởi `i`, còn phần tử đứng ngay dưới nó trong stack chính là biên chặn bên trái.'
        },
        {
          id: 'cs11-s1-q2',
          question: 'Tại sao nên lưu **chỉ số `idx`** vào Stack đơn điệu thay vì lưu trực tiếp giá trị `a[idx]`?',
          options: [
            'A. Vì chỉ số chiếm ít bit hơn',
            'B. Vì từ chỉ số `idx` vừa lấy được giá trị `a[idx]` vừa tính được độ rộng khoảng cách giữa hai phần tử',
            'C. Vì C++ không cho đẩy `int` vào `stack`',
            'D. Vì giá trị `a[idx]` không thể so sánh được'
          ],
          correctIndex: 1,
          explanation: 'Nếu chỉ lưu giá trị, ta không biết vị trí thực tế của cột để tính độ rộng `R - L - 1`.'
        }
      ],
      miniEssay: {
        id: 'cs11-s1-e1',
        question: 'Mô phỏng trạng thái Stack (chỉ số hoặc giá trị) khi tìm phần tử lớn hơn gần nhất bên phải (Next Greater Element) cho mảng `[2, 1, 2, 4, 3]`.',
        hint: 'Dùng Stack đơn điệu giảm: khi gặp phần tử mới lớn hơn `a[st.top()]`, gán đáp án cho `st.top()` rồi `pop`.',
        rubricChecklist: [
          'Mô phỏng đúng khi gặp `2` (index 2) thì `1` bị pop với đáp án `2`; khi gặp `4` thì cả `2` và `2` đều nhận đáp án `4`.',
          'Kết quả cuối cùng đúng: `[4, 2, 4, -1, -1]`.'
        ],
        sampleAnswer: 'Dùng stack lưu chỉ số có giá trị giảm dần:\n- `i=0 (2)`: push 0.\n- `i=1 (1)`: $1 < 2$, push 1.\n- `i=2 (2)`: $2 > a[1]$, pop 1 (NGE=2), còn `a[0]=2`, push 2.\n- `i=3 (4)`: $4 > a[2]$ và $4 > a[0]$, pop 2 và 0 (đều có NGE=4), push 3.\n- `i=4 (3)`: $3 < 4$, push 4.\nCác chỉ số còn lại (3, 4) có NGE = -1. Kết quả: `[4, 2, 4, -1, -1]`.'
      }
    },
    {
      stepTitle: '2. Deque Min/Max Trên Cửa sổ Tịnh tiến (Sliding Window RMQ)',
      stepType: 'derivation',
      conceptSection:
        'Bài toán tìm giá trị nhỏ nhất (hoặc lớn nhất) trong **tất cả** các đoạn dài $K$ liên tiếp nếu dùng Segment Tree mất $O(N \\log N)$, nhưng bằng **Hàng đợi hai đầu (`deque`)** đơn điệu ta giải chỉ trong **$O(N)$** tuyệt đối!',
      formulaSection: {
        primaryFormula: '\\text{Front của } \\texttt{deque} \\text{ luôn là chỉ số của Min/Max cửa sổ } [i - K + 1,\\; i]',
        secondaryFormulas: [
          '\\text{1. Đẩy hết các phần tử kém hơn ở cuối: } \\texttt{while (!dq.empty() \\&\\& a[dq.back()] >= a[i]) dq.pop\\_back();}',
          '\\text{2. Loại bỏ đầu cũ ngoài cửa sổ: } \\texttt{if (dq.front() <= i - K) dq.pop\\_front();}'
        ],
        variablesNote:
          '• Luôn nhớ 2 đầu làm việc khác nhau trên `deque`: **đuôi (`back`)** dùng để giữ tính đơn điệu; **đầu (`front`)** dùng để loại phần tử hết hạn ($\\le i - K$) và lấy đáp án tức thì!'
      },
      deepDiveSection:
        'Vì sao khi có phần tử mới `a[i]` đứng sau mà lại nhỏ hơn `a[j]` đứng trước (trong bài tìm Min), ta được phép **xóa vĩnh viễn** `j` khỏi tương lai?\nBởi `a[i]` vừa **nhỏ hơn** lại vừa **tồn tại lâu hơn** `a[j]` khi cửa sổ trượt sang phải — `a[j]` không bao giờ còn cơ hội làm Min của bất kỳ cửa sổ nào nữa!',
      teacherExplanation:
        'Dùng `deque` hai đầu để duy trì cửa sổ trượt Min/Max trong $O(N)$ chuẩn xác cho các bài DP tối ưu chuyển trạng thái.',
      keyTakeaway: 'Deque Min: loại phần tử $\\ge a[i]$ ở `back`, loại chỉ số $\\le i - K$ ở `front`.',
      miniQuiz: [
        {
          id: 'cs11-s2-q1',
          question: 'Khi dùng `deque` tìm **MIN** trên cửa sổ độ dài $K$, tại bước `i`, điều kiện để loại bỏ phần tử hết hạn ở **ĐẦU** `dq.front()` là:',
          options: [
            'A. `dq.front() <= i - K`',
            'B. `dq.front() == i`',
            'C. `a[dq.front()] >= a[i]`',
            'D. `dq.size() > K`'
          ],
          correctIndex: 0,
          explanation: 'Cửa sổ hiện tại là `[i - K + 1, i]`, mọi chỉ số `<= i - K` đã trượt ra khỏi cửa sổ nên phải `pop_front()`.'
        },
        {
          id: 'cs11-s2-q2',
          question: 'Độ phức tạp của thuật toán dùng `deque` tìm Min cho mọi đoạn độ dài $K$ trong mảng $N$ phần tử là:',
          options: ['A. $O(N \\cdot K)$', 'B. $O(N \\log K)$', 'C. $O(N)$', 'D. $O(N^2)$'],
          correctIndex: 2,
          explanation: 'Mỗi chỉ số chỉ được đẩy vào `back` một lần và bị bật ra tối đa một lần, nên tổng thời gian là $O(N)$.'
        }
      ],
      miniEssay: {
        id: 'cs11-s2-e1',
        question: 'Cho mảng `[1, 3, -1, -3, 5, 3, 6, 7]` và $K = 3$. Hãy tìm dãy giá trị MAX của từng cửa sổ độ dài $3$ khi trượt từ trái sang phải.',
        hint: 'Từ `i = 2` tới `i = 7`, xét 6 cửa sổ độ dài 3 liên tiếp.',
        rubricChecklist: [
          'Tính đúng 6 cửa sổ: `[1,3,-1]->3`, `[3,-1,-3]->3`, `[-1,-3,5]->5`, `[-3,5,3]->5`, `[5,3,6]->6`, `[3,6,7]->7`.',
          'Nêu được cấu trúc `deque` giữ dãy giảm dần chỉ cần $O(N)$.'
        ],
        sampleAnswer: 'Các cửa sổ độ dài 3 cho giá trị Max lần lượt là: `[3, 3, 5, 5, 6, 7]`. Dùng `deque` giảm dần (loại phần tử `<= a[i]` ở `back` và loại chỉ số `<= i - 3` ở `front`) đạt tổng thời gian $O(N)$.'
      }
    },
    {
      stepTitle: '3. Thuật toán Tham lam (Greedy) & Điều kiện Đúng Đắn',
      stepType: 'example',
      conceptSection:
        'Thuật toán Tham lam luôn chọn phương án **tốt nhất tại thời điểm hiện tại** với kỳ vọng dẫn tới tối ưu toàn cục. Khác với DP phải thử mọi khả năng, Tham lam chạy rất nhanh ($O(N\\log N)$ sau khi sort), nhưng **chỉ đúng** khi bài toán thỏa mãn tính chất lựa chọn tham lam (có thể chứng minh bằng *Exchange Argument*).',
      formulaSection: {
        primaryFormula: '\\text{Lập lịch đoạn } [L_i, R_i] \\text{ không giao nhau nhiều nhất} \\implies \\text{Sort tăng theo } R_i \\text{ (thời điểm kết thúc)}',
        secondaryFormulas: [
          '\\text{Exchange Argument: Đổi cặp nghịch thế không làm nghiệm xấu đi}'
        ],
        variablesNote:
          '• Bài toán **chọn nhiều cuộc họp nhất**: nếu sort theo thời điểm bắt đầu $L_i$ hoặc độ dài $R_i - L_i$ đều **SAI**! Phải sort theo **thời điểm kết thúc $R_i$** để dành khoảng trống thời gian phía sau rộng nhất cho các cuộc họp kế tiếp.'
      },
      deepDiveSection:
        'Trước khi nộp code Tham lam, hãy luôn thử tạo 1 phản ví dụ (counter-example) nhỏ chỉ gồm 2–3 phần tử! Nếu không chứng minh được bằng phép đổi chỗ (Exchange Argument) và có phản ví dụ thì bài toán đó đòi hỏi DP chứ không phải Greedy.',
      teacherExplanation:
        'Nắm chuẩn chiến thuật Tham lam kinh điển (Activity Selection sort theo thời điểm kết thúc $R_i$) và kiểm chứng bằng Exchange Argument.',
      workedExample: {
        problem: 'Có 3 đoạn `[1, 10]`, `[2, 4]`, `[5, 8]`. Chọn được tối đa mấy đoạn không giao nhau?',
        steps: [
          'Nếu tham lam theo `L` nhỏ nhất: chọn `[1, 10]` $\\implies$ chỉ chọn được 1 đoạn (SAI).',
          'Sort theo `R` tăng dần: `[2, 4]`, `[5, 8]`, `[1, 10]`. Chọn `[2, 4]` rồi `[5, 8]` $\\implies$ chọn được 2 đoạn!'
        ],
        answer: 'Tối đa 2 đoạn không giao nhau.'
      },
      keyTakeaway: 'Xếp lịch chọn nhiều đoạn nhất luôn sort tăng theo thời điểm KẾT THÚC $R_i$.',
      miniQuiz: [
        {
          id: 'cs11-s3-q1',
          question: 'Trong bài toán "Chọn số lượng tối đa các cuộc họp $[start_i, end_i]$ không trùng giờ nhau", tiêu chí sắp xếp tham lam ĐÚNG là:',
          options: [
            'A. Sắp xếp tăng dần theo thời điểm bắt đầu $start_i$',
            'B. Sắp xếp tăng dần theo độ dài cuộc họp $end_i - start_i$',
            'C. Sắp xếp tăng dần theo thời điểm kết thúc $end_i$',
            'D. Không cần sắp xếp'
          ],
          correctIndex: 2,
          explanation: 'Chọn cuộc họp kết thúc sớm nhất ($end_i$ nhỏ nhất) luôn chừa lại nhiều quỹ thời gian trống nhất ở phía sau.'
        },
        {
          id: 'cs11-s3-q2',
          question: 'Ví dụ nào chứng minh Tham lam KHÔNG phải lúc nào cũng giải đúng bài toán Đổi tiền (Coin Change) tối thiểu số đồng?',
          options: [
            'A. Mệnh giá `[1, 5, 10]` cần đổi $15$',
            'B. Mệnh giá `[1, 3, 4]` cần đổi $6$ (Tham lam lấy $4+1+1 = 3$ đồng, trong khi tối ưu là $3+3 = 2$ đồng)',
            'C. Mệnh giá `[1, 2, 4]` cần đổi $7$',
            'D. Mệnh giá `[1]` cần đổi $10$'
          ],
          correctIndex: 1,
          explanation: 'Với bộ `[1, 3, 4]` và $S = 6$, chọn đồng lớn nhất $4$ ép phải dùng $4+1+1$ (3 đồng), thua $3+3$ (2 đồng) — phải dùng DP!'
        }
      ],
      miniEssay: {
        id: 'cs11-s3-e1',
        question: 'Dùng phương pháp phản ví dụ (Counter-example) để bác bỏ chiến lược Tham lam "chọn đoạn có độ dài $R_i - L_i$ ngắn nhất" trong bài toán chọn tối đa đoạn không giao nhau.',
        hint: 'Vẽ 3 đoạn sao cho đoạn ngắn nhất nằm đè lên đúng điểm nối giữa hai đoạn dài hơn một chút.',
        rubricChecklist: [
          'Xây dựng đúng 3 đoạn mà đoạn ngắn nhất giao với cả 2 đoạn kia (ví dụ `[1, 5]`, `[4, 7]`, `[6, 10]`).',
          'Chỉ ra tham lam ngắn nhất chọn `[4, 7]` nên chỉ được 1 đoạn, trong khi tối ưu chọn `[1, 5]` và `[6, 10]` được 2 đoạn.'
        ],
        sampleAnswer: 'Xét 3 đoạn: $A = [1, 5]$ (dài 4), $B = [4, 7]$ (dài 3), $C = [6, 10]$ (dài 4). Chiến lược chọn đoạn ngắn nhất sẽ chọn $B = [4, 7]$, làm vướng cả $A$ lẫn $C$ nên chỉ được 1 đoạn; trong khi chọn $A$ và $C$ đạt được 2 đoạn.'
      }
    }
  ],

  'cs-12': [
    {
      stepTitle: '1. Rolling Hash (Băm Chuỗi) So sánh Xâu Con $O(1)$',
      stepType: 'concept',
      conceptSection:
        'Rolling Hash biến mỗi xâu con $S[L..R]$ thành một **con số nguyên (mã Hash)** theo hệ cơ số $BASE$ (như $311$) lấy dư $MOD$. Nhờ công thức tổng tiền tố của đa thức, ta kiểm tra hai xâu con bất kỳ có giống hệt nhau hay không chỉ trong **$O(1)$**!',
      formulaSection: {
        primaryFormula: '\\text{Hash}(S[L..R]) = \\left(H[R] - H[L - 1] \\cdot \\text{POW}[R - L + 1]\\right) \\bmod MOD',
        secondaryFormulas: [
          'H[i] = (H[i - 1] \\cdot \\text{BASE} + (S[i] - \\texttt{\'a\'} + 1)) \\bmod MOD',
          '\\text{Chống đụng độ (Collision): Dùng Double Hash với 2 cặp } MOD \\text{ nguyên tố lớn}'
        ],
        variablesNote:
          '• **Cạm bẫy hay gặp**: Ánh xạ `\'a\'` $\\to 0$ làm `"a"`, `"aa"`, `"aaa"` có chung mã Hash bằng $0$! Luôn cộng thêm `+ 1` (hoặc dùng trực tiếp mã ASCII $97..122$) để không ký tự nào mang giá trị $0$.\n• Nhớ cộng bù `+ MOD * MOD` hoặc `((x % MOD) + MOD) % MOD` khi trừ $H[R] - H[L-1] \\cdot POW$!'
      },
      deepDiveSection:
        'Tại sao nên dùng **Double Hash** (2 số `MOD` nguyên tố như $10^9 + 7$ và $10^9 + 9$) trong các kỳ thi?\nTheo Nghịch lý Ngày sinh (Birthday Paradox), khi so sánh $10^5$ xâu con với chỉ 1 mod $10^9$, xác suất trùng ngẫu nhiên 2 xâu khác nhau có thể xảy ra! Double Hash đưa xác suất đụng độ xuống cỡ $10^{-18}$ (gần như bằng 0 tuyệt đối).',
      teacherExplanation:
        'Cài đặt đúng Rolling Hash 1-indexed không gán ký tự bằng 0, dùng Double Hash để tránh xung đột mã băm.',
      keyTakeaway: 'Gán ký tự khác 0 (`c - \'a\' + 1`); dùng Double Hash và công thức trừ không âm.',
      miniQuiz: [
        {
          id: 'cs12-s1-q1',
          question: 'Khi thiết lập Rolling Hash cho chuỗi chữ thường, nếu gán giá trị `\'a\' = 0` thì hai chuỗi nào sau đây bị trùng mã Hash hoàn toàn?',
          options: [
            'A. `"ab"` và `"ba"`',
            'B. `"a"` và `"aaa"` (đều cho Hash = $0$)',
            'C. `"z"` và `"a"`',
            'D. Không có chuỗi nào trùng'
          ],
          correctIndex: 1,
          explanation: 'Vì $0 \\cdot \\text{BASE} + 0 = 0$, mọi chuỗi chỉ toàn ký tự `\'a\'` đều cho ra mã Hash bằng $0$ nếu `\'a\' = 0`.'
        },
        {
          id: 'cs12-s1-q2',
          question: 'Độ phức tạp của việc kiểm tra xâu $S[L..R]$ có phải là xâu đối xứng (bằng cách so sánh Hash xuôi và Hash ngược) sau bước tiền xử lý $O(N)$ là:',
          options: ['A. $O(N)$', 'B. $O(1)$', 'C. $O(\\log N)$', 'D. $O(N^2)$'],
          correctIndex: 1,
          explanation: 'Chỉ cần đối chiếu `getHash(L, R) == getRevHash(...)` trong đúng $O(1)$.'
        }
      ],
      miniEssay: {
        id: 'cs12-s1-e1',
        question: 'Giải thích ý nghĩa của **Double Hash** trong bài toán so khớp chuỗi, và tại sao chỉ dùng 1 mod $10^9 + 7$ đôi khi lại bị hack hoặc đụng độ.',
        hint: 'Liên hệ nghịch lý ngày sinh (Birthday Paradox) khi số cặp đối chiếu cỡ $10^5$.',
        rubricChecklist: [
          'Nêu được một mod $10^9$ khi kiểm tra cặp $N \\approx 10^5$ (hoặc bộ test anti-hash) có nguy cơ đụng độ (collision).',
          'Double Hash ghép thành cặp `(hash1, hash2)` với hai cặp `(BASE, MOD)` nguyên tố độc lập giảm xác suất trùng về $\\sim 10^{-18}$.'
        ],
        sampleAnswer: 'Với 1 mod cỡ $10^9$, theo nghịch lý ngày sinh khi sinh khoảng $\\sqrt{10^9} \\approx 31622$ xâu con trở lên xác suất trùng ngẫu nhiên đã rất đáng kể (chưa kể test cố tình gài). Double Hash dùng song song 2 phép tính băm với 2 MOD nguyên tố khác nhau (như $10^9+7$ và $10^9+9$) để so sánh cặp `(h1, h2)`, hạ xác suất đụng độ xuống mức $10^{-18}$.'
      }
    },
    {
      stepTitle: '2. Thuật toán KMP & Mảng Hàm Tiền tố (Prefix Function $\\pi$)',
      stepType: 'derivation',
      conceptSection:
        'Thuật toán **KMP (Knuth-Morris-Pratt)** tìm tất cả vị trí xuất hiện của mẫu $P$ trong văn bản $T$ chỉ trong **$O(|P| + |T|)$** — loại bỏ hoàn toàn việc lùi con trỏ văn bản nhờ bảng tiền xử lý **Hàm tiền tố $\\pi[i]$**.',
      formulaSection: {
        primaryFormula: '\\pi[i] = \\max \\{ k < i + 1 : S[0..k-1] = S[i-k+1..i] \\}',
        secondaryFormulas: [
          '\\text{Chu kỳ nhỏ nhất của xâu } S \\text{ độ dài } n:\\; p = n - \\pi[n - 1] \\quad (\\text{nếu } n \\bmod p = 0)',
          '\\text{Tìm } P \\text{ trong } T:\\; \\text{Tính } \\pi \\text{ trên xâu ghép } P + \\texttt{"\\#"} + T'
        ],
        variablesNote:
          '• Ký tự ngăn cách `\'#\'` trong `P + "#" + T` phải là ký tự **không xuất hiện** trong cả $P$ và $T$, đảm bảo giá trị $\\pi[i]$ không bao giờ vượt quá $|P|$!'
      },
      deepDiveSection:
        'Mảng $\\pi$ còn giải được một bài toán cực hay trong 1 dòng: *Xâu $S$ có phải lặp lại từ một mẫu con nhỏ hơn không?* Ta chỉ cần lấy $p = n - \\pi[n - 1]$; nếu $n$ chia hết cho $p$ thì $p$ chính là **độ dài chu kỳ cơ bản ngắn nhất** của $S$!',
      teacherExplanation:
        'Hiểu định nghĩa hàm tiền tố $\\pi[i]$ (tiền tố dài nhất đồng thời là hậu tố thực sự) và ứng dụng tìm mẫu lẫn tìm chu kỳ xâu.',
      keyTakeaway: 'KMP chạy tất định $O(|P| + |T|)$ không lo đụng độ; $\\pi$ giúp tìm chu kỳ xâu ngay bằng $n - \\pi[n-1]$.',
      miniQuiz: [
        {
          id: 'cs12-s2-q1',
          question: 'Cho xâu $S = \\text{"ababab"}$ ($n = 6$). Giá trị hàm tiền tố tại cuối xâu $\\pi[5]$ là bao nhiêu?',
          options: ['A. 2', 'B. 4 (vì `"abab"` vừa là tiền tố vừa là hậu tố dài nhất $< 6$)', 'C. 5', 'D. 0'],
          correctIndex: 1,
          explanation: 'Tiền tố dài nhất (nhỏ hơn 6) đồng thời là hậu tố của `"ababab"` là `"abab"` có độ dài 4. Khi đó chu kỳ là $6 - 4 = 2$ (`"ab"`).'
        },
        {
          id: 'cs12-s2-q2',
          question: 'Khi ghép $P + \\text{"\\#"} + T$ để chạy KMP tìm $P$ trong $T$, tại vị trí $i$ nào trên xâu ghép ta kết luận tìm thấy $P$?',
          options: [
            'A. Khi $\\pi[i] == |P|$',
            'B. Khi $\\pi[i] == 0$',
            'C. Khi $\\pi[i] == |T|$',
            'D. Khi $i == |P|$'
          ],
          correctIndex: 0,
          explanation: 'Do có dấu ngăn cách `\'#\'`, $\\pi[i]$ không thể lớn hơn $|P|$; khi $\\pi[i] == |P|$ nghĩa là toàn bộ $P$ khớp khít với hậu tố kết thúc tại $i$.'
        }
      ],
      miniEssay: {
        id: 'cs12-s2-e1',
        question: 'So sánh ưu/nhược điểm giữa Rolling Hash và KMP trong bài toán tìm tất cả vị trí xuất hiện của mẫu $P$ trong văn bản $T$.',
        hint: 'Xét tốc độ code, bộ nhớ và tính tất định (deterministic) không bao giờ sai.',
        rubricChecklist: [
          'KMP là thuật toán tất định (100% chính xác, không bao giờ có xác suất đụng độ), chi phí $O(|P|+|T|)$.',
          'Rolling Hash tổng quát dễ mở rộng cho truy vấn đoạn con bất kỳ trên 2D/Palindrome/Longest Common Substring.'
        ],
        sampleAnswer: 'KMP mang tính tất định tuyệt đối $O(|P|+|T|)$, không có rủi ro đụng độ mã băm nhưng chuyên biệt cho so khớp tiền tố–hậu tố. Rolling Hash tuy cần Double Hash để tránh đụng độ nhưng cực kỳ linh hoạt khi cần so sánh hai xâu con bất kỳ $S[L_1..R_1]$ và $S[L_2..R_2]$ hoặc tìm xâu con chung dài nhất bằng Binary Search.'
      }
    },
    {
      stepTitle: '3. Tổ Tiên Chung Gần Nhất (LCA) bằng Binary Lifting $O(\\log N)$',
      stepType: 'example',
      conceptSection:
        'Trên cây có gốc $N$ đỉnh ($N \\le 2\\cdot 10^5$), kỹ thuật **Binary Lifting** lưu bảng `up[u][k]` là **tổ tiên thứ $2^k$** của đỉnh `u`. Nhờ nhảy theo lũy thừa của 2, ta tìm được **Tổ tiên chung gần nhất `LCA(u, v)`** và **khoảng cách giữa hai đỉnh trên cây** chỉ trong **$O(\\log N)$**!',
      formulaSection: {
        primaryFormula: '\\text{up}[u][k] = \\text{up}[\\text{up}[u][k - 1]][k - 1] \\quad (k = 1..19)',
        secondaryFormulas: [
          '\\text{Khoảng cách trên cây: } \\text{dist}(u, v) = \\text{depth}[u] + \\text{depth}[v] - 2\\cdot \\text{depth}[\\text{LCA}(u, v)]'
        ],
        variablesNote:
          '• Nếu $N \\le 2 \\cdot 10^5$, chọn `LOG = 18` hoặc `19` (vì $2^{18} = 262{,}144 > N$).\n• Hai bước chuẩn trong `LCA(u, v)`: (1) Cân bằng độ sâu — nâng đỉnh sâu hơn lên ngang độ sâu đỉnh kia; (2) Nếu `u == v` trả ngay; ngược lại nhảy đồng thời từ $k = \\text{LOG}$ về $0$ sao cho `up[u][k] != up[v][k]`.'
      },
      deepDiveSection:
        'Mở rộng cực mạnh của Binary Lifting: nếu cạnh cây có trọng số (ví dụ tìm **cạnh lớn nhất** hoặc tổng trọng số trên đường đi $u \\leftrightarrow v$), ta chỉ cần duy trì thêm bảng `maxEdge[u][k]` cập nhật song song `maxEdge[u][k] = max(maxEdge[u][k-1], maxEdge[up[u][k-1]][k-1])` trong cùng hàm nhảy LCA!',
      teacherExplanation:
        'Xây dựng bảng `up[u][k]` từ DFS, áp dụng chuẩn 2 bước cân bằng độ sâu và nhảy song song để tính LCA & khoảng cách cây.',
      workedExample: {
        problem: 'Cho cây với gốc 1 có `depth[u] = 4`, `depth[v] = 3` và `LCA(u, v)` ở độ sâu $1$. Tính độ dài đường đi giữa $u$ và $v$.',
        steps: [
          'Áp dụng công thức $\\text{dist}(u, v) = \\text{depth}[u] + \\text{depth}[v] - 2\\cdot \\text{depth}[\\text{LCA}(u, v)]$.',
          'Thay số: $4 + 3 - 2 \\cdot 1 = 5$.'
        ],
        answer: 'Khoảng cách bằng $5$ cạnh.'
      },
      keyTakeaway: '`up[u][k] = up[up[u][k-1]][k-1]`; khoảng cách $u \\leftrightarrow v$ bằng `depth[u] + depth[v] - 2*depth[lca]`.',
      miniQuiz: [
        {
          id: 'cs12-s3-q1',
          question: 'Khi nhảy đồng thời tìm LCA ở bước 2 (`for k from LOG down to 0`), tại sao điều kiện nhảy là `if (up[u][k] != up[v][k])` chứ KHÔNG phải `==`?',
          options: [
            'A. Vì ta muốn dừng ở ngay BÊN DƯỚI LCA (con trực tiếp của LCA) để tránh nhảy vọt qua quá cao trên tổ tiên chung',
            'B. Vì nếu bằng nhau thì đã tới gốc 1',
            'C. Vì mảng `up` lưu giá trị âm',
            'D. Để chạy nhanh gấp đôi'
          ],
          correctIndex: 0,
          explanation: 'Nhảy khi hai tổ tiên CÒN KHÁC NHAU giúp $(u, v)$ dừng ở hai đỉnh nằm ngay dưới `LCA(u, v)`, khi đó `up[u][0]` chính là LCA.'
        },
        {
          id: 'cs12-s3-q2',
          question: 'Độ phức tạp tiền xử lý và mỗi truy vấn `LCA(u, v)` bằng Binary Lifting với $N$ đỉnh là:',
          options: [
            'A. Tiền xử lý $O(N^2)$, Truy vấn $O(1)$',
            'B. Tiền xử lý $O(N \\log N)$, Truy vấn $O(\\log N)$',
            'C. Tiền xử lý $O(N)$, Truy vấn $O(N)$',
            'D. Tiền xử lý $O(\\log N)$, Truy vấn $O(1)$'
          ],
          correctIndex: 1,
          explanation: 'Bảng `up[N][LOG]` có kích thước $N \\log N$, mỗi truy vấn vòng `k` chạy tối đa `LOG` bước.'
        }
      ],
      miniEssay: {
        id: 'cs12-s3-e1',
        question: 'Giải thích công thức $\\text{dist}(u, v) = \\text{depth}[u] + \\text{depth}[v] - 2\\cdot \\text{depth}[\\text{LCA}(u, v)]$. Điều này còn đúng nếu cây có trọng số cạnh khác 1 không?',
        hint: 'Thay `depth[x]` (số cạnh từ gốc) bằng `distRoot[x]` (tổng trọng số từ gốc đến `x`).',
        rubricChecklist: [
          'Giải thích đường đi từ gốc tới $u$ và tới $v$ cùng đi chung đoạn từ gốc tới `LCA(u, v)` nên phải trừ 2 lần phần chung.',
          'Khẳng định công thức vẫn ĐÚNG khi thay `depth` bằng `distRoot[x]` (tổng trọng số từ gốc tới `x`).'
        ],
        sampleAnswer: 'Đoạn đường từ gốc tới $u$ gồm đoạn $(Gốc \\to LCA)$ cộng đoạn $(LCA \\to u)$. Tương tự đường tới $v$ gồm $(Gốc \\to LCA)$ cộng $(LCA \\to v)$. Cộng hai đường rồi trừ đi $2$ lần đoạn chung $(Gốc \\to LCA)$ sẽ còn đúng đường nối $u \\leftrightarrow v$. Nếu cây có trọng số, chỉ cần thay `depth[x]` bằng `distRoot[x]` (tổng trọng số từ gốc đến $x$) là công thức vẫn đúng nguyên vẹn.'
      }
    }
  ]
};
