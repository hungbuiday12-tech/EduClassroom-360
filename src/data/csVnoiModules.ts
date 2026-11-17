import { CSLesson, LectureStep, VNOIPhase } from '../types';

export interface VnoiEnrichment {
  vnoiPhase: VNOIPhase;
  vnoiTag: string;
  lessonNumber: number;
  prerequisites: string[];
  lectureSteps: LectureStep[];
}

export const VNOI_LESSON_ENRICHMENT: Record<string, VnoiEnrichment> = {
  'cs-1': {
    vnoiPhase: 'Phase 0 · Nhập môn & Độ phức tạp',
    vnoiTag: 'VNOI Wiki · I/O Tối Ưu & Đánh Giá Big-O',
    lessonNumber: 1,
    prerequisites: [],
    lectureSteps: [
      {
        stepTitle: '1. Tại sao code chạy đúng test nhỏ nhưng lại bị TLE hoặc WA trên test lớn?',
        stepType: 'intuition',
        teacherExplanation:
          'Trong lộ trình VNOI, bước đầu tiên không phải học thuật toán khó ngay mà là làm chủ hai cạm bẫy chết người khiến 70% bài nộp bị đánh rớt: **Tràn số nguyên (Integer Overflow)** và **Đọc xuất chậm (I/O Bottleneck)**.\n\n• Khi bộ test có $N = 10^5$ hoặc $a, b = 10^9$: nếu dùng `cin`/`cout` mặc định mà không tắt đồng bộ với `stdio`, thời gian đọc dữ liệu đã có thể vượt quá $1\\text{ giây}$!\n• Nếu dùng `int` (tối đa $\\approx 2{,}14 \\cdot 10^9$) để nhân $a \\times b = 10^9 \\times 10^9 = 10^{18}$, kết quả bị tràn bit dấu và ra số âm sai hoàn toàn.',
        formulaHighlight: '10^8 \\text{ phép tính cơ bản} \\approx 1\\text{ giây (C++ O2)}',
        keyTakeaway:
          'Luôn kiểm tra giới hạn $N$ và giá trị lớn nhất của biến trước khi chọn `int` hay `long long`, và ước lượng số phép tính theo quy tắc $10^8$ phép/giây.'
      },
      {
        stepTitle: '2. Kỹ thuật Fast I/O & Quy tắc ước lượng Độ phức tạp Big-O',
        stepType: 'concept',
        teacherExplanation:
          '• **Trong C++**: Luôn đặt cặp lệnh `ios_base::sync_with_stdio(false); cin.tie(NULL);` ở đầu hàm `main()`. Không dùng `endl` (vì `endl` ép flush buffer liên tục) mà dùng ký tự `\'\\n\'`.\n• **Trong Python**: Dùng `sys.stdin.read().split()` để đọc toàn bộ luồng dữ liệu một lần vào bộ nhớ thay vì gọi `input()` nhiều lần trong vòng lặp.\n• **Bảng chọn thuật toán theo $N$ trên VNOI**:\n  - $N \\le 20$: Đệ quy quay lui $O(2^N)$ hoặc $O(N!)$.\n  - $N \\le 5\\,000$: Vòng lặp lồng nhau / Quy hoạch động $O(N^2)$.\n  - $N \\le 10^5$: Sắp xếp, Tìm kiếm nhị phân, Segment Tree $O(N \\log N)$.\n  - $N \\le 10^6$: Thuật toán tuyến tính $O(N)$ (Hai con trỏ, Prefix Sum).',
        codeSnippet: {
          language: 'cpp',
          title: 'Template chuẩn mở đầu mọi bài VNOI',
          code: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    cin >> a >> b;
    // Ép kiểu 1LL trước phép nhân để tránh tràn số trung gian
    long long product = 1LL * a * b;
    cout << a + b << '\\n' << product << '\\n';
    return 0;
}`
        },
        keyTakeaway:
          'Nếu $a$ và $b$ kiểu `int`, biểu thức `long long res = a * b;` VẪN TRÀN SỐ vì `a * b` được tính bằng `int` trước khi gán! Phải viết `1LL * a * b`.'
      },
      {
        stepTitle: '3. Thực hành phân tích giới hạn bài toán cụ thể',
        stepType: 'example',
        teacherExplanation:
          'Thầy/cô cùng em phân tích nhanh một bài toán đọc dữ liệu điển hình trên Online Judge:',
        workedExample: {
          problem:
            'Cho $N = 10^5$ số nguyên dương $a_i \\le 10^9$. Hãy tính tổng $S = \\sum_{i=1}^N a_i$. Cần chọn kiểu dữ liệu gì và mất tối đa bao nhiêu thời gian?',
          steps: [
            'Bước 1 (Ước lượng giá trị cực đại): $S_{max} = 10^5 \\times 10^9 = 10^{14}$. Kiểu `int` ($2\\cdot 10^9$) chắc chắn tràn; kiểu `long long` ($9\\cdot 10^{18}$) chứa dư sức.',
            'Bước 2 (Ước lượng độ phức tạp): Duyệt 1 vòng `for` từ $1$ đến $N$ tốn $O(N) = 10^5$ phép toán $\\ll 10^8$, chạy trong $< 0.02$ giây với Fast I/O.',
            'Bước 3 (Kiểm tra nhập xuất): Dùng `cin.tie(NULL)` để đọc $10^5$ số không bị nghẽn bộ đệm.'
          ],
          answer: 'Dùng `long long sum = 0;` kết hợp Fast I/O, độ phức tạp $O(N)$.'
        },
        keyTakeaway:
          'Đọc xong đề bài luôn làm 2 việc đầu tiên: tính Max Value (chọn `long long`) và tính Max Operations (chọn Big-O).'
      }
    ]
  },

  'cs-2': {
    vnoiPhase: 'Phase 0 · Nhập môn & Độ phức tạp',
    vnoiTag: 'VNOI Wiki · Số Nguyên Tố & Sàng Eratosthenes',
    lessonNumber: 2,
    prerequisites: ['cs-1'],
    lectureSteps: [
      {
        stepTitle: '1. Tư duy tối ưu kiểm tra Số nguyên tố từ O(N) xuống O(√N)',
        stepType: 'intuition',
        teacherExplanation:
          'Cách ngây thơ nhất để kiểm tra $N$ có phải số nguyên tố là thử chia cho mọi $i$ từ $2$ đến $N-1$. Nhưng nếu $N = 10^{12}$, vòng lặp $10^{12}$ bước sẽ chạy mất vài giờ (TLE ngay lập tức).\n\nNhận xét mấu chốt: Nếu $N$ là hợp số, tức $N = u \\times v$ ($1 < u \\le v < N$), thì chắc chắn thừa số nhỏ hơn $u$ phải thỏa mãn $u^2 \\le u \\times v = N \\Rightarrow u \\le \\sqrt{N}$. Do đó ta chỉ cần kiểm tra ước từ $2$ đến $\\lfloor\\sqrt{N}\\rfloor$!',
        formulaHighlight: 'N = u \\cdot v \\ (u \\le v) \\implies u \\le \\sqrt{N}',
        keyTakeaway:
          'Không viết điều kiện `i <= sqrt(n)` trong vòng lặp vì hàm `sqrt` có sai số số thực và chậm; luôn viết `i * i <= n` với `i` kiểu `long long`!'
      },
      {
        stepTitle: '2. Sàng nguyên tố Eratosthenes — Bứt tốc cho nhiều truy vấn',
        stepType: 'derivation',
        teacherExplanation:
          'Khi đề bài hỏi: "Cho $10^5$ truy vấn hoặc đếm tất cả số nguyên tố $\\le N$ ($N \\le 10^6$)", nếu mỗi số lại chạy $O(\\sqrt{N})$ thì tổng là $O(N\\sqrt{N}) \\approx 10^9$ phép toán (quá chậm).\n\n**Thuật toán Sàng Eratosthenes**:\n1. Khởi tạo mảng `isPrime[0..N] = true`, đặt `isPrime[0] = isPrime[1] = false`.\n2. Duyệt $p$ từ $2$ đến $\\sqrt{N}$: nếu `isPrime[p] == true` thì mọi bội của $p$ ($p^2, p^2+p, p^2+2p, \\dots$) đều là hợp số → đánh dấu `false`.\n3. Vì mỗi số chỉ bị gạch bởi các ước nguyên tố của nó, tổng số bước là $N \\left(\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{5} + \\dots\\right) = O(N \\log \\log N)$!',
        formulaHighlight: 'T(N) = \\sum_{p \\le \\sqrt{N}} \\frac{N}{p} = \\mathcal{O}(N \\log \\log N)',
        keyTakeaway:
          'Bắt đầu gạch bội số từ `i = p * p` (thay vì `2 * p`) vì các bội nhỏ hơn `2p, 3p, ...` đã bị các số nguyên tố nhỏ hơn `p` gạch từ trước rồi.'
      },
      {
        stepTitle: '3. Mô phỏng chạy tay Sàng Eratosthenes với N = 15',
        stepType: 'example',
        teacherExplanation: 'Cùng mô phỏng từng bước mảng đánh dấu với $N = 15$:',
        workedExample: {
          problem: 'Tìm tất cả các số nguyên tố $\\le 15$ bằng Sàng Eratosthenes.',
          steps: [
            'Khởi tạo: Đánh dấu $0, 1$ là `false`; các số $2..15$ tạm là `true`.',
            'Xét $p = 2$ (đang `true`): Giữ nguyên $2$, gạch từ $2^2 = 4$: gạch $4, 6, 8, 10, 12, 14$.',
            'Xét $p = 3$ (đang `true`): Giữ nguyên $3$, gạch từ $3^2 = 9$: gạch $9, 12, 15$.',
            'Xét $p = 4$ đã `false` → bỏ qua. Vì $5^2 = 25 > 15$ nên dừng vòng sàng!'
          ],
          answer: 'Các số còn giữ `true` là $2, 3, 5, 7, 11, 13$ (tổng 6 số nguyên tố).'
        },
        keyTakeaway:
          'Sàng có thể mở rộng thành **Sàng trên đoạn $[L, R]$** ($R - L \\le 10^6, R \\le 10^{12}$) hoặc **Lưu ước nguyên tố nhỏ nhất (SPF)** để phân tích thừa số nguyên tố mỗi số chỉ trong $O(\\log N)$.'
      }
    ]
  },

  'cs-3': {
    vnoiPhase: 'Phase 1 · Cơ bản & Số học sơ cấp',
    vnoiTag: 'VNOI Wiki · Mảng Đếm & Xử Lý Xâu',
    lessonNumber: 3,
    prerequisites: ['cs-2'],
    lectureSteps: [
      {
        stepTitle: '1. Kỹ thuật Mảng Đếm (Counting / Frequency Bucket) giảm O(N²) xuống O(N)',
        stepType: 'concept',
        teacherExplanation:
          'Rất nhiều bài toán sơ cấp yêu cầu đếm số lần xuất hiện của mỗi phần tử hoặc kiểm tra phần tử có tồn tại không.\n• Nếu lồng 2 vòng lặp để đếm → $O(N^2)$, gặp $N = 10^5$ là TLE ngay.\n• **Giải pháp VNOI**: Khi giá trị $0 \\le a_i \\le 10^6$, ta khai báo mảng toàn cục `int cnt[1000005]` (tự động khởi tạo bằng 0) rồi duyệt 1 vòng `cnt[a[i]]++`. Khi giá trị lớn tới $10^9$ hoặc số âm, ta dùng `sort` rồi đếm từng cụm giống nhau trong $O(N \\log N)$ hoặc dùng `map<long long, int>`!',
        keyTakeaway:
          'Mảng kích thước lớn ($10^6$ phần tử) PHẢI khai báo ở phạm vi toàn cục (Global) để nằm trên Heap/BSS, tránh lỗi tràn Stack (Segmentation Fault) khi khai báo trong `main()`.'
      },
      {
        stepTitle: '2. Xử lý Xâu ký tự & Kiểm tra Đối xứng (Palindrome)',
        stepType: 'example',
        teacherExplanation:
          'Xâu ký tự trong C++ (`std::string`) và Python (`str`) hỗ trợ truy cập $O(1)$ qua chỉ số. Để kiểm tra một xâu $S$ độ dài $L$ có đối xứng hay không, ta đặt 2 chỉ số từ đầu $l = 0$ và cuối $r = L - 1$, dịch dần vào tâm:',
        workedExample: {
          problem: 'Kiểm tra xâu `s = "abccba"` và `s2 = "abca"` có phải Palindrome không.',
          steps: [
            'Với `"abccba"`: $(l=0, r=5)$ có `a == a`; $(1,4)$ có `b == b`; $(2,3)$ có `c == c` → vòng lặp kết thúc khi $l \\ge r$ → `YES`.',
            'Với `"abca"`: $(l=0, r=3)$ có `a == a`; $(1,2)$ có `b != c` → trả về `NO` ngay lập tức mà không cần xét tiếp.'
          ],
          answer: 'Độ phức tạp thời gian $O(L)$, bộ nhớ phụ $O(1)$.'
        },
        keyTakeaway:
          'Cẩn thận lỗi đọc trộn `cin >> n;` và `getline(cin, s);` trong C++: phải gọi `cin.ignore();` để nuốt ký tự xuống dòng thừa sau `n`.'
      }
    ]
  },

  'cs-4': {
    vnoiPhase: 'Phase 1 · Cơ bản & Số học sơ cấp',
    vnoiTag: 'VNOI Wiki · Đệ Quy & Quay Lui (Backtracking)',
    lessonNumber: 5,
    prerequisites: ['cs-3', 'cs-10'],
    lectureSteps: [
      {
        stepTitle: '1. Tư duy Cây Đệ Quy & Nguyên tắc Backtracking',
        stepType: 'intuition',
        teacherExplanation:
          'Quay lui (Backtracking) bản chất là duyệt theo chiều sâu trên cây các khả năng cấu hình. Tại bước thứ `k`, ta thử lần lượt mọi lựa chọn hợp lệ cho vị trí `k`, ghi nhận trạng thái, gọi đệ quy sang bước `k + 1`, và **bắt buộc hoàn tác trạng thái** khi hàm con trả về để nhánh tiếp theo được sạch sẽ.',
        keyTakeaway:
          'Mọi hàm quay lui đều tuân theo khung 3 bước: Chọn (Mark) → Gọi đệ quy `k + 1` → Bỏ chọn (Unmark / Restore).'
      },
      {
        stepTitle: '2. Phân tích bài toán kinh điển Xếp N Quân Hậu (N-Queens)',
        stepType: 'derivation',
        teacherExplanation:
          'Trên bàn cờ $N \\times N$, mỗi hàng đặt đúng 1 quân hậu. Tại hàng $r$, ta chọn cột $c \\in [0, N-1]$. Làm sao kiểm tra ô $(r, c)$ có bị hậu ở các hàng trước ăn không trong $O(1)$?\n• Cùng cột: đánh dấu mảng `col[c]`.\n• Cùng đường chéo chính (hiệu $r - c$ là hằng số!): vì $r - c$ có thể âm nên cộng thêm độ lệch $N$: `diag1[r - c + N]`.\n• Cùng đường chéo phụ (tổng $r + c$ là hằng số!): `diag2[r + c]`.',
        formulaHighlight: '\\text{Chéo chính: } r - c = \\text{const}, \\quad \\text{Chéo phụ: } r + c = \\text{const}',
        keyTakeaway:
          'Nhờ tính chất bất biến $r - c$ và $r + c$ trên đường chéo bàn cờ, ta kiểm tra hợp lệ chỉ trong $O(1)$ thay vì duyệt lại toàn bộ các quân hậu đã đặt.'
      },
      {
        stepTitle: '3. Cắt tỉa nhánh cận (Branch & Bound)',
        stepType: 'pitfall',
        teacherExplanation:
          'Khi $N$ lớn dần, cây tìm kiếm bùng nổ theo giai thừa $O(N!)$ hoặc $O(2^N)$. Luôn kiểm tra tính toán cận dưới (lower bound) nếu bài toán yêu cầu tìm Min/Max để dừng sớm các nhánh chắc chắn không tối ưu hơn kỷ lục hiện tại.',
        keyTakeaway:
          'Độ phức tạp hàm mũ/giai thừa chỉ chạy được với $N \\le 20$ (tập con) hoặc $N \\le 10..12$ (hoán vị / N-Queens).'
      }
    ]
  },

  'cs-5': {
    vnoiPhase: 'Phase 2 · Kỹ thuật tối ưu kinh điển',
    vnoiTag: 'VNOI Wiki · Tìm Kiếm Nhị Phân & Chặt Kết Quả',
    lessonNumber: 6,
    prerequisites: ['cs-4'],
    lectureSteps: [
      {
        stepTitle: '1. Tư duy chia đôi không gian tìm kiếm O(log N)',
        stepType: 'intuition',
        teacherExplanation:
          'Với mảng 1 tỷ phần tử đã sắp xếp, tìm tuyến tính mất $10^9$ bước (~10 giây), nhưng Tìm kiếm nhị phân mỗi bước loại một nửa chỉ mất tối đa $\\lceil \\log_2(10^9) \\rceil = 30$ bước (< 0.00001 giây)!',
        formulaHighlight: 'mid = left + \\lfloor (right - left) / 2 \\rfloor',
        keyTakeaway:
          'Luôn dùng `left + (right - left) / 2` thay cho `(left + right) / 2` để tránh tràn số khi `left, right` gần giới hạn kiểu dữ liệu.'
      },
      {
        stepTitle: '2. Bí kíp VNOI: Chặt nhị phân trên tập Kết quả (Binary Search on Answer)',
        stepType: 'concept',
        teacherExplanation:
          'Đây là kỹ thuật ăn điểm phổ biến nhất trong các đề thi HSG Tỉnh và Olympic 30/4. Dấu hiệu nhận biết:\n• Đề hỏi: *"Tìm giá trị nhỏ nhất của Max..."* hoặc *"Tìm giá trị lớn nhất của Min..."*.\n• Nếu ta kiểm tra được một hàm `bool check(X)` trả lời: *"Với ngưỡng $X$, ta có làm được không?"* và hàm `check(X)` có tính đơn điệu (kiểu `false, false, ..., false, true, true, ...`), thì giá trị nhỏ nhất thỏa mãn chính là vị trí chuyển từ `false` sang `true` đầu tiên!',
        workedExample: {
          problem:
            'Chia mảng $A = [7, 2, 5, 10, 8]$ thành $K = 2$ đoạn liên tiếp sao cho tổng đoạn lớn nhất là nhỏ nhất.',
          steps: [
            'Xác định miền chặt: đoạn lớn nhất ít nhất bằng $\\max(A) = 10$ và nhiều nhất bằng $\\sum A = 32$.',
            'Thử $mid = (10 + 32) / 2 = 21$: chia được `[7,2,5] (14)` và `[10,8] (18)` → dùng 2 đoạn $\\le K$ (`true`) → lưu `ans = 21`, thu hẹp `high = 20`.',
            'Thử $mid = 15$: `[7,2,5] (14)`, `[10] (10)`, `[8] (8)` → cần 3 đoạn $> 2$ (`false`) → tăng `low = 16`.',
            'Thu hẹp tiếp cho đến khi gặp ngưỡng nhỏ nhất đạt `true` là $18$.'
          ],
          answer: 'Kết quả tối ưu là $18$. Độ phức tạp $O(N \\log(\\sum A))$.'
        },
        keyTakeaway:
          'Tách bạch 2 phần: (1) Vòng lặp `while (low <= high)` cập nhật `ans = mid`; (2) Hàm `check(mid)` tham lam thuần túy.'
      }
    ]
  },

  'cs-6': {
    vnoiPhase: 'Phase 2 · Kỹ thuật tối ưu kinh điển',
    vnoiTag: 'VNOI Wiki · Prefix Sum, Mảng Hiệu & Two Pointers',
    lessonNumber: 7,
    prerequisites: ['cs-5'],
    lectureSteps: [
      {
        stepTitle: '1. Mảng Cộng Dồn (Prefix Sum) 1D & 2D: Trả lời Q truy vấn tổng trong O(1)',
        stepType: 'derivation',
        teacherExplanation:
          'Nếu có $Q = 10^5$ truy vấn tính tổng đoạn $[L, R]$ trên mảng $N = 10^5$, tính trực tiếp mất $O(N \\cdot Q) = 10^{10}$ (TLE chắc chắn).\n• **Tiền xử lý $O(N)$**: Định nghĩa $pref[0] = 0$, $pref[i] = pref[i-1] + a[i]$ (chỉ số 1-based cực kỳ sạch sẽ).\n• **Truy vấn $O(1)$**: $\\sum_{k=L}^R a[k] = pref[R] - pref[L - 1]$.\n• **Mở rộng Mảng Hiệu (Difference Array)**: Nếu đề bài cho $Q$ thao tác tăng cả đoạn $[L, R]$ lên $+V$, ta chỉ cần gán `diff[L] += V; diff[R + 1] -= V;` trong $O(1)$, rồi lấy Prefix Sum một lần ở cuối!',
        formulaHighlight: 'Sum(L, R) = pref[R] - pref[L - 1], \\quad pref[i] \\in \\text{long long}',
        keyTakeaway:
          'Đánh chỉ số mảng từ `1` đến `N` khi làm Prefix Sum để tránh lỗi truy cập `pref[-1]` tại $L = 0$.'
      },
      {
        stepTitle: '2. Hai Con Trỏ (Two Pointers) & Cửa Sổ Trượt (Sliding Window)',
        stepType: 'example',
        teacherExplanation:
          'Khi cả `left` và `right` chỉ tiến về phía trước mà không bao giờ lùi lại, tổng số lần dịch chuyển của cả 2 con trỏ tối đa chỉ là $2N$, nên độ phức tạp luôn là $O(N)$!',
        workedExample: {
          problem: 'Cho mảng số dương $A = [2, 1, 3, 4, 5]$ và $S = 7$. Tìm độ dài đoạn con liên tiếp dài nhất có tổng $\\le S$.',
          steps: [
            'Mở rộng `right` từ 0→2: cửa sổ `[2, 1, 3]`, tổng $= 6 \\le 7$, kỷ lục `maxLen = 3`.',
            'Tăng `right = 3` (`a[3] = 4`): tổng $= 10 > 7$ → đẩy `left` tăng lên để trừ `a[0]=2` (tổng 8 > 7), trừ tiếp `a[1]=1` (tổng 7 $\\le 7$) → cửa sổ `[3, 4]`, độ dài 2.',
            'Tăng `right = 4` (`a[4] = 5`): tổng $= 12 > 7$ → đẩy `left` trừ `3` và `4` → cửa sổ `[5]`, độ dài 1.'
          ],
          answer: 'Độ dài lớn nhất tìm được là `maxLen = 3`.'
        },
        keyTakeaway:
          'Cửa sổ trượt chỉ đúng khi các phần tử đều không âm (thêm phần tử làm tổng tăng, bớt phần tử làm tổng giảm).'
      }
    ]
  },

  'cs-7': {
    vnoiPhase: 'Phase 3 · Quy hoạch động & Đồ thị',
    vnoiTag: 'VNOI Wiki · Quy Hoạch Động Cơ Bản (DP)',
    lessonNumber: 9,
    prerequisites: ['cs-11'],
    lectureSteps: [
      {
        stepTitle: '1. Công thức 4 bước thiết kế mọi bài Quy hoạch động trên VNOI',
        stepType: 'concept',
        teacherExplanation:
          'Học sinh mới hay sợ Quy hoạch động (DP) vì cứ cố đoán công thức. Trên VNOI, mọi bài DP đều giải theo đúng 4 bước kỷ luật:\n1. **Định nghĩa Trạng thái**: `dp[...]` mang ý nghĩa chính xác là gì?\n2. **Bài toán Cơ sở (Base Case)**: Giá trị khởi tạo nhỏ nhất mà không cần công thức.\n3. **Công thức Chuyển trạng thái (Transition)**: Tính `dp[hiện tại]` từ các trạng thái nhỏ hơn đã biết.\n4. **Thứ tự tính & Tối ưu bộ nhớ**: Đảm bảo bài toán con đã được tính trước khi dùng.',
        keyTakeaway:
          'Nếu trả lời rõ ràng câu: "`dp[i]` lưu đáp án cho bài toán con nào?", bạn đã giải xong 70% bài Quy hoạch động.'
      },
      {
        stepTitle: '2. Phân tích 0-1 Knapsack & Lý do phải duyệt ngược',
        stepType: 'derivation',
        teacherExplanation:
          'Với mảng 2 chiều: `dp[i][j] = max(dp[i-1][j], dp[i-1][j - w[i]] + v[i])`. Khi nén xuống mảng 1 chiều `dp[j]`, trạng thái cũ ở lượt `i-1` nằm bên trái (`j - w[i]`). Nếu duyệt `j` xuôi từ nhỏ đến lớn, `dp[j - w[i]]` vừa mới bị ghi đè ở lượt `i`, tức là một món đồ bị chọn nhiều lần! Vì vậy **0-1 Knapsack 1D bắt buộc phải duyệt ngược `j` từ $W$ về $w_i$**.',
        formulaHighlight: 'dp[j] = \\max(dp[j],\\ dp[j - w_i] + v_i) \\quad (j: W \\to w_i)',
        keyTakeaway:
          '0-1 Knapsack (mỗi vật chọn 1 lần) → duyệt ngược `j` từ $W$ về $w_i$. Unbounded Knapsack (chọn vô hạn lần) → duyệt xuôi `j` từ $w_i$ đến $W$.'
      },
      {
        stepTitle: '3. Dãy con tăng dài nhất (LIS) trong O(N log N)',
        stepType: 'example',
        teacherExplanation:
          'Cách DP thường $dp[i] = \\max_{j<i, a_j < a_i}(dp[j] + 1)$ tốn $O(N^2)$ chỉ qua $N \\le 5000$. Với $N = 10^5$, ta giữ mảng `tails` trong đó `tails[k]` là phần tử kết thúc NHỎ NHẤT của một dãy tăng độ dài `k + 1`. Vì `tails` luôn tăng nghiêm ngặt, ta dùng `lower_bound` tìm vị trí thay thế trong $O(\\log N)$!',
        workedExample: {
          problem: 'Chạy tay thuật toán LIS $O(N \\log N)$ trên dãy `A = [1, 2, 5, 3, 4, 7]`.',
          steps: [
            'Đọc 1, 2, 5: lần lượt nối vào cuối `tails = [1, 2, 5]`.',
            'Đọc 3: `lower_bound(tails, 3)` trỏ vào số `5` → thay thế thành `tails = [1, 2, 3]` (giảm phần tử đuôi để dễ nối dài về sau).',
            'Đọc 4: `tails = [1, 2, 3, 4]`. Đọc 7: `tails = [1, 2, 3, 4, 7]`.'
          ],
          answer: 'Độ dài LIS là `tails.size() = 5`.'
        },
        keyTakeaway:
          'Lưu ý `tails` chỉ đảm bảo đúng ĐỘ DÀI LIS chứ bản thân `tails` không phải lúc nào cũng là dãy con hợp lệ nếu có phần tử thay thế ở giữa; muốn truy vết dãy gốc cần lưu thêm mảng chỉ số cha.'
      }
    ]
  },

  'cs-8': {
    vnoiPhase: 'Phase 3 · Quy hoạch động & Đồ thị',
    vnoiTag: 'VNOI Wiki · Đồ Thị DFS/BFS & Dijkstra',
    lessonNumber: 10,
    prerequisites: ['cs-7'],
    lectureSteps: [
      {
        stepTitle: '1. Biểu diễn Đồ thị trên VNOI: Danh sách kề (Adjacency List)',
        stepType: 'concept',
        teacherExplanation:
          'Với $N = 10^5$ đỉnh, Ma trận kề `adj[N][N]` tốn $10^{10}$ ô nhớ (~40 GB RAM → Memory Limit Exceeded ngay!). Bắt buộc dùng Danh sách kề `vector<int> adj[N]` (không trọng số) hoặc `vector<pair<int, int>> adj[N]` (có trọng số), chỉ tốn $O(V + E)$ bộ nhớ.',
        keyTakeaway:
          'Đồ thị vô hướng cạnh $(u, v)$ phải `push_back` cả hai chiều: `adj[u].push_back(v)` và `adj[v].push_back(u)`.'
      },
      {
        stepTitle: '2. Phân biệt sức mạnh của DFS và BFS',
        stepType: 'concept',
        teacherExplanation:
          '• **DFS (Depth-First Search)**: Đi sâu hết nhánh mới quay lui. Rất mạnh để: đếm thành phần liên thông, kiểm tra đồ thị 2 phía (Bipartite), tìm chu trình, sắp xếp Topo, tính kích thước cây con.\n• **BFS (Breadth-First Search)**: Loang theo từng lớp khoảng cách $0, 1, 2, \\dots$. Đảm bảo tìm được **đường đi ít cạnh nhất** trên đồ thị không trọng số (hoặc trọng số bằng nhau).',
        keyTakeaway:
          'Đánh dấu `visited[v] = true` NGAY LÚC đẩy `v` vào hàng đợi BFS (không đợi lúc `pop` ra mới đánh dấu) để tránh một đỉnh bị đẩy vào queue hàng trăm lần gây MLE/TLE!'
      },
      {
        stepTitle: '3. Thuật toán Dijkstra tìm đường đi ngắn nhất O((V + E) log V)',
        stepType: 'derivation',
        teacherExplanation:
          'Khi các cạnh có trọng số không âm $w \\ge 0$, BFS thường không còn đúng (nhiều cạnh nhưng tổng trọng số nhỏ hơn). Ta thay `queue` bằng **Min-Heap (`priority_queue` với `greater<>`)** luôn lấy đỉnh có `dist` nhỏ nhất hiện tại để nới lỏng các đỉnh kề: `if (dist[u] + w < dist[v]) ...`',
        formulaHighlight: '\\text{Relax}(u \\to v): \\ dist[v] = \\min(dist[v],\\ dist[u] + w(u, v))',
        keyTakeaway:
          'Dòng `if (d > dist[u]) continue;` cực kỳ quan trọng để bỏ qua các bản sao cũ trong heap, giữ độ phức tạp chặt $O((V + E) \\log V)$. Và Dijkstra KHÔNG đúng nếu đồ thị có cạnh trọng số âm!'
      }
    ]
  },

  'cs-9': {
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · Segment Tree & DSU',
    lessonNumber: 11,
    prerequisites: ['cs-8'],
    lectureSteps: [
      {
        stepTitle: '1. Khi nào cần Cây Phân Đoạn (Segment Tree)?',
        stepType: 'intuition',
        teacherExplanation:
          'Prefix Sum tính tổng đoạn $[L, R]$ trong $O(1)$ nhưng nếu có xen kẽ thao tác **sửa giá trị `a[p] = x`**, ta phải cập nhật lại $O(N)$ phần tử của mảng cộng dồn → lại thành $O(N \\cdot Q)$! Segment Tree chia đôi mảng theo cây nhị phân để CẢ cập nhật và truy vấn đoạn đều đạt $O(\\log N)$.',
        formulaHighlight: '\\text{Kích thước mảng cây an toàn: } 4 \\times N',
        keyTakeaway:
          'Phần tử trung hòa (Identity) khi ra ngoài đoạn `[l, r]`: Tổng → trả `0`; Min → trả `+INF`; Max → trả `-INF`; GCD → trả `0`.'
      },
      {
        stepTitle: '2. Disjoint Set Union (DSU) — Hợp nhất Tập hợp Rời rạc',
        stepType: 'derivation',
        teacherExplanation:
          'DSU duy trì các tập hợp rời rạc qua 2 hàm `find(u)` (tìm gốc đại diện) và `unite(u, v)` (gộp 2 tập). Khi kết hợp:\n1. **Nén đường đi (Path Compression)**: `return parent[u] = find(parent[u]);` gắn thẳng mọi nút trên đường đi về gốc.\n2. **Gộp theo kích thước (Union by Size)**: luôn nối gốc tập nhỏ vào gốc tập lớn.\nNhờ đó mọi thao tác gần như $O(1)$ thực tế ($O(\\alpha(N))$)!',
        keyTakeaway:
          'DSU kết hợp sắp xếp cạnh theo trọng số tăng dần tạo thành thuật toán **Kruskal** tìm Cây khung nhỏ nhất (MST) kinh điển nhất của HSG Quốc gia.'
      }
    ]
  }
};

export const EXTRA_VNOI_LESSONS: CSLesson[] = [
  {
    id: 'cs-10',
    level: 'Cơ bản',
    vnoiPhase: 'Phase 1 · Cơ bản & Số học sơ cấp',
    vnoiTag: 'VNOI Wiki · Euclid GCD, Luỹ Thừa Nhị Phân & Modulo',
    prerequisites: ['cs-3'],
    lessonNumber: 4,
    title: 'Số học Thi đấu: Euclid GCD, Luỹ Thừa Nhị Phân & Đồng Dư Modulo',
    topic: 'ƯCLN/BCNN, Tính a^b mod M trong O(log b) & Định lý Fermat nhỏ',
    estimatedMinutes: 18,
    theory: [
      '1. Thuật toán Euclid tìm $\\gcd(a, b)$: Dựa trên tính chất $\\gcd(a, b) = \\gcd(b, a \\bmod b)$ với trường hợp cơ sở $\\gcd(a, 0) = a$. Độ phức tạp $O(\\log(\\min(a, b)))$. Khi tính BCNN: $\\text{lcm}(a, b) = (a / \\gcd(a, b)) \\times b$ (chia trước nhân sau để tránh tràn số!).',
      '2. Các phép toán đồng dư modulo $M$ ($M = 10^9 + 7$): $(A + B) \\bmod M = ((A \\bmod M) + (B \\bmod M)) \\bmod M$; với phép trừ luôn cộng thêm $M$ trước khi lấy dư: `((A - B) % M + M) % M`.',
      '3. Luỹ thừa nhị phân (Binary Exponentiation): Tính $a^b \\bmod M$ với $b \\le 10^{18}$ trong $O(\\log b)$ bằng cách chia đôi số mũ: nếu $b$ chẵn thì $a^b = (a^{b/2})^2$; nếu $b$ lẻ thì $a^b = a \\cdot a^{b-1}$.',
      '4. Nghịch đảo Modulo (Modular Inverse): Khi $M$ là số nguyên tố (như $10^9 + 7$), theo định lý Fermat nhỏ: $a^{M-1} \\equiv 1 \\pmod M \\implies a^{-1} \\equiv a^{M-2} \\pmod M$, dùng để tính phép chia $(A / B) \\bmod M = (A \\cdot B^{M-2}) \\bmod M$.'
    ],
    lectureSteps: [
      {
        stepTitle: '1. Tại sao chia trước nhân sau khi tính BCNN và xử lý số âm khi Modulo?',
        stepType: 'pitfall',
        teacherExplanation:
          '• **Cạm bẫy BCNN**: Nếu viết `(a * b) / gcd(a, b)` với $a, b = 10^{12}$, tích `a * b = 10^{24}` sẽ tràn cả `long long` ($9 \\cdot 10^{18}$)! Phải chia trước: `(a / gcd(a, b)) * b`.\n• **Cạm bẫy Modulo số âm trong C++**: Trong C++, `-3 % 7` cho ra `-3` (chứ không phải `4` như toán học và Python!). Vì vậy phép trừ trong C++ luôn phải viết: `((a - b) % MOD + MOD) % MOD`.',
        formulaHighlight: '\\text{lcm}(a, b) = \\left(\\frac{a}{\\gcd(a, b)}\\right) \\cdot b',
        keyTakeaway:
          'Luôn ép về dương bằng `((x % M) + M) % M` sau mỗi phép trừ có thể ra âm trong C++.'
      },
      {
        stepTitle: '2. Ý tưởng Luỹ thừa Nhị phân (Binary Exponentiation) O(log b)',
        stepType: 'derivation',
        teacherExplanation:
          'Muốn tính $3^{13} \\bmod M$, nếu nhân lặp 13 lần mất $O(b)$ — với $b = 10^{18}$ thì chắc chắn TLE. Ta phân tích số mũ sang hệ nhị phân: $13 = 8 + 4 + 1 = 1101_2$, tức $3^{13} = 3^8 \\cdot 3^4 \\cdot 3^1$. Mỗi bước ta bình phương cơ số `a = (a * a) % M` và chia đôi số mũ `b /= 2`; nếu bit cuối của `b` là 1 (`b % 2 == 1`) thì nhân thêm `a` vào biến kết quả `res`.',
        formulaHighlight: 'a^b = \\begin{cases} (a^2)^{b/2} & \\text{nếu } b \\text{ chẵn} \\\\ a \\cdot (a^2)^{\\lfloor b/2 \\rfloor} & \\text{nếu } b \\text{ lẻ} \\end{cases}',
        workedExample: {
          problem: 'Tính $2^{10} \\bmod 1000$ bằng luỹ thừa nhị phân từng bước.',
          steps: [
            'Khởi tạo `res = 1`, `a = 2`, `b = 10`.',
            '`b = 10` (chẵn): `a = 2^2 = 4`, `b = 5`, `res = 1`.',
            '`b = 5` (lẻ): `res = 1 * 4 = 4`, sau đó `a = 4^2 = 16`, `b = 2`.',
            '`b = 2` (chẵn): `a = 16^2 = 256`, `b = 1`, `res = 4`.',
            '`b = 1` (lẻ): `res = (4 * 256) % 1000 = 1024 % 1000 = 24`, `b = 0` → dừng!'
          ],
          answer: '$2^{10} \\bmod 1000 = 24$ chỉ sau 4 bước lặp!'
        },
        keyTakeaway:
          'Luỹ thừa nhị phân là nền tảng để tính Tổ hợp $C_n^k \\bmod (10^9+7)$ qua nghịch đảo Fermat $k!^{M-2}$ và Nhân ma trận tính số Fibonacci thứ $10^{18}$!'
      }
    ],
    complexity: {
      time: 'O(log b) cho luỹ thừa & Euclid GCD',
      space: 'O(1)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Euclid GCD & Binary Exponentiation',
        basicTitle: 'C++ Cơ bản: Tìm ƯCLN và tính lũy thừa bằng vòng lặp trực tiếp trong main',
        basicCode: `#include <iostream>
using namespace std;

int main() {
    long long a = 24, b = 36;
    while (a != b) {
        if (a > b) a -= b;
        else b -= a;
    }
    cout << "GCD(24, 36) = " << a << '\\n';

    long long base = 2, exp = 10, mod = 1000000007, kq = 1;
    for (int i = 0; i < exp; i++) kq = (kq * base) % mod;
    cout << "2^10 mod M = " << kq << '\\n';
    return 0;
}`,
        basicExplanation: 'Tìm ƯCLN bằng trừ dần trực giác và tính lũy thừa bằng vòng lặp nhân từng bước ngay trong main().',
        code: `#include <iostream>
using namespace std;

const long long MOD = 1000000007LL;

long long gcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

long long powerMod(long long a, long long b, long long mod) {
    long long res = 1;
    a %= mod;
    while (b > 0) {
        if (b & 1) res = (res * a) % mod;
        a = (a * a) % mod;
        b >>= 1;
    }
    return res;
}

int main() {
    cout << "GCD(24, 36) = " << gcd(24, 36) << '\\n';
    cout << "2^100 mod (10^9+7) = " << powerMod(2, 100, MOD) << '\\n';
    return 0;
}`,
        explanation: 'Dùng vòng lặp while cho GCD và powerMod giúp tốn O(1) bộ nhớ và không lo tràn stack.'
      },
      {
        language: 'python',
        title: 'Python math.gcd & pow(a, b, mod)',
        basicTitle: 'Python Cơ bản: Chia lấy dư Euclid & nhân lặp không dùng hàm thư viện',
        basicCode: `a, b = 24, 36
while b != 0:
    a, b = b, a % b
print("GCD:", a)

MOD = 10**9 + 7
kq = 1
for _ in range(10):
    kq = (kq * 2) % MOD
print("2^10 mod M:", kq)`,
        basicExplanation: 'Tự viết vòng lặp Euclid và nhân modulo từng bước để hiểu bản chất thuật toán.',
        code: `import math

MOD = 10**9 + 7
a, b = 24, 36
g = math.gcd(a, b)
lcm = (a // g) * b
print("GCD:", g, "LCM:", lcm)
print("2^100 mod M:", pow(2, 100, MOD))`,
        explanation: 'Hàm pow(a, b, mod) có sẵn trong Python triển khai luỹ thừa nhị phân ở tầng C.'
      }
    ],
    practiceProblem: {
      id: 'CS_P10',
      title: 'Tính lũy thừa lớn a^b mod (10^9 + 7)',
      difficulty: 'Medium',
      description: 'Cho hai số nguyên không âm a và b (0 ≤ a, b ≤ 10⁹, không đồng thời bằng 0). Hãy tính giá trị của a^b chia lấy dư cho 1000000007 (10⁹ + 7).',
      inputFormat: 'Một dòng chứa hai số nguyên a và b.',
      outputFormat: 'In ra kết quả a^b mod 1000000007.',
      sampleCases: [
        {
          input: '2 10',
          output: '1024',
          explanation: '2¹⁰ = 1024, chia dư cho 10⁹ + 7 vẫn bằng 1024.'
        },
        {
          input: '3 1000000000',
          output: '813379065',
          explanation: 'Áp dụng luỹ thừa nhị phân trong ~30 bước lặp.'
        }
      ],
      solutionAnalysis: 'Dùng thuật toán luỹ thừa nhị phân (Binary Exponentiation) nhân dồn bình phương cơ số kết hợp modulo ở mỗi bước nhân (O(log b)).',
      basicAnalysis: 'Cơ bản: Khi b nhỏ, nhân dồn a đúng b lần và chia dư cho 10^9 + 7 ngay trong vòng lặp for (O(b), không cần phép toán bit hay chia đôi số mũ).',
      basicSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    long long MOD = 1000000007;
    long long res = 1;
    for (long long i = 0; i < b; i++) {
        res = (res * (a % MOD)) % MOD;
    }
    cout << res;
    return 0;
}`,
      basicSolutionPython: `a, b = map(int, input().split())
MOD = 1000000007
res = 1
for _ in range(b):
    res = (res * a) % MOD
print(res)`,
      fullSolutionCpp: `#include <iostream>
using namespace std;

const long long MOD = 1000000007LL;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    if (!(cin >> a >> b)) return 0;
    long long res = 1;
    a %= MOD;
    while (b > 0) {
        if (b % 2 == 1) res = (res * a) % MOD;
        a = (a * a) % MOD;
        b /= 2;
    }
    cout << res << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    a = int(tokens[0])
    b = int(tokens[1])
    MOD = 1000000007
    res = 1
    a %= MOD
    while b > 0:
        if b % 2 == 1:
            res = (res * a) % MOD
        a = (a * a) % MOD
        b //= 2
    print(res)

solve()`
    }
  },

  {
    id: 'cs-11',
    level: 'Trung cấp',
    vnoiPhase: 'Phase 2 · Kỹ thuật tối ưu kinh điển',
    vnoiTag: 'VNOI Wiki · Stack Đơn Điệu, Deque Min/Max & Tham Lam',
    prerequisites: ['cs-6'],
    lessonNumber: 8,
    title: 'Stack Đơn Điệu, Deque Min/Max Trên Đoạn Tịnh Tiến & Thuật Toán Tham Lam',
    topic: 'Monotonic Stack O(N), Sliding Window Min/Max & Lập lịch Tham lam',
    estimatedMinutes: 20,
    theory: [
      '1. Ngăn xếp đơn điệu (Monotonic Stack): Lưu các chỉ số sao cho giá trị tương ứng trong ngăn xếp luôn tăng dần (hoặc giảm dần). Mỗi phần tử chỉ được đẩy vào và lấy ra tối đa 1 lần nên tổng thời gian chỉ là $O(N)$!',
      '2. Ứng dụng Stack đơn điệu: Tìm phần tử gần nhất bên trái/phải nhỏ hơn (hoặc lớn hơn) $a[i]$, tính diện tích hình chữ nhật lớn nhất trong biểu đồ cột (Histogram).',
      '3. Hàng đợi hai đầu (Deque) tìm Min/Max trên mọi đoạn độ dài $K$: Duy trì một Deque chứa các chỉ số ứng viên tăng dần về giá trị. Đầu Deque (`dq.front()`) luôn là phần tử nhỏ nhất của cửa sổ hiện tại sau khi loại bỏ các chỉ số đã trôi ra ngoài phạm vi $[i - K + 1, i]$.',
      '4. Thuật toán Tham lam (Greedy): Chọn phương án tối ưu cục bộ ở từng bước (ví dụ bài toán Chọn lịch không giao nhau bằng cách sắp xếp theo thời gian kết thúc tăng dần).'
    ],
    lectureSteps: [
      {
        stepTitle: '1. Bí mật giúp Stack đơn điệu và Deque đạt độ phức tạp O(N)',
        stepType: 'intuition',
        teacherExplanation:
          'Thoạt nhìn, bên trong vòng lặp `for (int i = 0; i < n; i++)` lại có vòng lặp `while (!dq.empty() && ...)` khiến nhiều bạn tưởng độ phức tạp là $O(N^2)$. Thực tế **mỗi phần tử chỉ được `push` vào Stack/Deque đúng 1 lần và `pop` ra tối đa 1 lần** trong suốt cả chương trình! Do đó tổng số lần lặp của `while` cộng gộp qua toàn bộ chạy không quá $N$ → Độ phức tạp trừ dần (Amortized) là $O(N)$ tuyệt đối.',
        keyTakeaway:
          'Luôn lưu **chỉ số (index)** vào Stack/Deque thay vì lưu giá trị trực tiếp, vì từ chỉ số ta dễ dàng biết cả giá trị `a[idx]` lẫn khoảng cách / kiểm tra hết hạn `idx <= i - k`!'
      },
      {
        stepTitle: '2. Chạy tay Deque tìm Min trên cửa sổ trượt độ dài K = 3',
        stepType: 'example',
        teacherExplanation: 'Ta cần duy trì Deque chỉ số tăng dần giá trị để phần tử đầu Deque luôn là Min:',
        workedExample: {
          problem: 'Cho mảng `A = [4, 2, 5, 1, 3]` và $K = 3$. Tìm giá trị nhỏ nhất của từng đoạn 3 số liên tiếp.',
          steps: [
            'i=0 (`4`): đẩy 0. Deque: `[0 (4)]`.',
            'i=1 (`2`): `2 <= a[0]=4` → loại 0 khỏi đuôi, đẩy 1. Deque: `[1 (2)]`.',
            'i=2 (`5`): `5 > a[1]=2` → đẩy 2. Deque: `[1 (2), 2 (5)]`. Đủ K=3 → In `a[1] = 2`.',
            'i=3 (`1`): `1 <= 5` và `1 <= 2` → loại sạch 2 và 1, đẩy 3. Deque: `[3 (1)]`. Đủ K=3 → In `a[3] = 1`.',
            'i=4 (`3`): đầu deque `3 > 4 - 3 = 1` (còn hạn), `3 > 1` → đẩy 4. Deque: `[3 (1), 4 (3)]` → In `a[3] = 1`.'
          ],
          answer: 'Dãy Min các cửa sổ là `2 1 1` với thời gian $O(N)$.'
        },
        keyTakeaway:
          'Với Stack đơn điệu/Deque: Vô dụng hóa các phần tử cũ đứng trước mà giá trị còn tệ hơn phần tử mới vào (vì phần tử mới vừa tốt hơn vừa sống lâu hơn trong cửa sổ!).'
      }
    ],
    complexity: {
      time: 'O(N) cho Monotonic Stack/Deque, O(N log N) cho Greedy cần Sort',
      space: 'O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Deque tìm Min đoạn tịnh tiến độ dài K (O(N))',
        basicTitle: 'C++ Cơ bản: Hai vòng lặp for tìm Min từng đoạn K phần tử (O(N·K))',
        basicCode: `#include <iostream>
using namespace std;

int main() {
    int a[5] = {4, 2, 5, 1, 3};
    int n = 5, k = 3;
    for (int i = 0; i <= n - k; i++) {
        int nhoNhat = a[i];
        for (int j = i + 1; j < i + k; j++) {
            if (a[j] < nhoNhat) nhoNhat = a[j];
        }
        cout << nhoNhat << " ";
    }
    return 0;
}`,
        basicExplanation: 'Không cần Deque: duyệt từng đoạn độ dài K bắt đầu từ i và tìm phần tử nhỏ nhất bằng vòng lặp trong main().',
        code: `#include <iostream>
#include <vector>
#include <deque>
using namespace std;

int main() {
    vector<int> a = {4, 2, 5, 1, 3};
    int k = 3;
    deque<int> dq;
    for (int i = 0; i < (int)a.size(); i++) {
        // Loại bỏ phần tử ở đuôi lớn hơn hoặc bằng a[i]
        while (!dq.empty() && a[dq.back()] >= a[i]) dq.pop_back();
        dq.push_back(i);
        // Loại bỏ phần tử ở đầu đã ra ngoài cửa sổ [i - k + 1, i]
        if (dq.front() <= i - k) dq.pop_front();
        if (i >= k - 1) cout << a[dq.front()] << " ";
    }
    return 0;
}`,
        explanation: 'Mỗi phần tử vào và ra deque đúng 1 lần nên toàn bộ vòng lặp chạy trong O(N).'
      },
      {
        language: 'python',
        title: 'Python collections.deque Sliding Window Min',
        basicTitle: 'Python Cơ bản: Dùng vòng lặp cắt từng đoạn a[i:i+k]',
        basicCode: `a = [4, 2, 5, 1, 3]
k = 3
res = []
for i in range(len(a) - k + 1):
    res.append(min(a[i:i + k]))
print(*res)`,
        basicExplanation: 'Với mỗi cửa sổ độ dài K, lấy giá trị min trực tiếp mà không cần cấu trúc deque.',
        code: `from collections import deque

def sliding_min(a, k):
    dq = deque()
    res = []
    for i, x in enumerate(a):
        while dq and a[dq[-1]] >= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(a[dq[0]])
    return res

print(*sliding_min([4, 2, 5, 1, 3], 3))`,
        explanation: 'deque của Python hỗ trợ popleft() và pop() trong O(1).'
      }
    ],
    practiceProblem: {
      id: 'CS_P11',
      title: 'Kiểm tra Dãy Ngoặc Đúng (Valid Parentheses - Stack)',
      difficulty: 'Medium',
      description: 'Cho một xâu S chỉ gồm các ký tự ngoặc (), [], {} có độ dài không quá 10⁵. Hãy kiểm tra xem xâu ngoặc đó có cân bằng và đóng mở đúng cặp hay không. In ra YES nếu đúng, ngược lại in NO.',
      inputFormat: 'Một dòng duy nhất chứa xâu ký tự S.',
      outputFormat: 'In ra YES hoặc NO.',
      sampleCases: [
        {
          input: '({[]})',
          output: 'YES',
          explanation: 'Mỗi ngoặc mở đều khớp với ngoặc đóng tương ứng gần nhất bên trong.'
        },
        {
          input: '([)]',
          output: 'NO',
          explanation: 'Ngoặc tròn ) đóng trước ngoặc vuông ], vi phạm thứ tự Stack.'
        }
      ],
      solutionAnalysis: 'Dùng Stack: gặp ngoặc mở thì đẩy vào Stack; gặp ngoặc đóng thì kiểm tra Stack không rỗng và đỉnh Stack phải là ngoặc mở cùng loại rồi pop ra. Cuối cùng Stack phải rỗng hoàn toàn.',
      basicAnalysis: 'Cơ bản: Thay vì dùng std::stack, mô phỏng ngăn xếp bằng một chuỗi ký tự đơn giản `openStr` cộng/xóa ở cuối, viết gọn trong main().',
      basicSolutionCpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s, st = "";
    cin >> s;
    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            st += c;
        } else {
            if (st.empty()) {
                cout << "NO";
                return 0;
            }
            char top = st.back();
            if ((c == ')' && top == '(') || (c == ']' && top == '[') || (c == '}' && top == '{')) {
                st.pop_back();
            } else {
                cout << "NO";
                return 0;
            }
        }
    }
    cout << (st.empty() ? "YES" : "NO");
    return 0;
}`,
      basicSolutionPython: `s = input().strip()
while "()" in s or "[]" in s or "{}" in s:
    s = s.replace("()", "").replace("[]", "").replace("{}", "")
print("YES" if s == "" else "NO")`,
      fullSolutionCpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (!(cin >> s)) return 0;
    stack<char> st;
    bool ok = true;
    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) {
                ok = false;
                break;
            }
            char top = st.top();
            if ((c == ')' && top == '(') || (c == ']' && top == '[') || (c == '}' && top == '{')) {
                st.pop();
            } else {
                ok = false;
                break;
            }
        }
    }
    if (!st.empty()) ok = false;
    cout << (ok ? "YES" : "NO") << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    st = []
    match = {')': '(', ']': '[', '}': '{'}
    ok = True
    for c in s:
        if c in '([{':
            st.append(c)
        else:
            if not st or st[-1] != match.get(c, ''):
                ok = False
                break
            st.pop()
    if st:
        ok = False
    print("YES" if ok else "NO")

solve()`
    }
  },

  {
    id: 'cs-12',
    level: 'Nâng cao / HSG',
    vnoiPhase: 'Phase 4 · Cấu trúc dữ liệu & HSG',
    vnoiTag: 'VNOI Wiki · String Hashing, KMP & LCA trên Cây',
    prerequisites: ['cs-9'],
    lessonNumber: 12,
    title: 'Xử Lý Xâu Nâng Cao (Hash, KMP) & Tổ Tiên Chung Gần Nhất (LCA)',
    topic: 'Polynomial Rolling Hash, Hàm Tiền Tố KMP O(N+M) & Binary Lifting LCA',
    estimatedMinutes: 25,
    theory: [
      '1. String Hashing (Băm đa thức): Biểu diễn xâu $S$ như một số ở cơ số $Base$ (thường chọn $311$) chia dư cho $MOD = 10^9 + 7$. Nhờ mảng `hash[i]` và luỹ thừa `powBase[i]`, ta tính được mã băm của MỌI xâu con $S[L..R]$ trong $O(1)$: $Hash(L, R) = (hash[R] - hash[L-1] \\cdot Base^{R-L+1}) \\bmod MOD$.',
      '2. Thuật toán KMP (Knuth-Morris-Pratt): Xây dựng mảng hàm tiền tố `pi[i]` (độ dài tiền tố thực sự dài nhất đồng thời là hậu tố của $P[0..i]$). Khi so khớp thất bại, không quay lại đầu xâu mà nhảy về `pi[j - 1]`, giúp tìm mọi vị trí xuất hiện của mẫu $P$ trong văn bản $T$ chỉ mất $O(|T| + |P|)$.',
      '3. Tổ tiên chung gần nhất (LCA) bằng Nhảy Nhị Phân (Binary Lifting): Lưu mảng `up[u][k]` là tổ tiên thứ $2^k$ của đỉnh $u$ trên cây. Để tìm $LCA(u, v)$, ta nâng đỉnh sâu hơn lên cùng độ cao với đỉnh kia, sau đó nhảy song song các bước $2^k$ từ lớn về nhỏ.'
    ],
    lectureSteps: [
      {
        stepTitle: '1. So khớp hai xâu con bất kỳ chỉ trong O(1) bằng Rolling Hash',
        stepType: 'derivation',
        teacherExplanation:
          'Nếu cần trả lời $10^5$ truy vấn: *"Hai xâu con $S[l_1..r_1]$ và $S[l_2..r_2]$ có giống hệt nhau không?"*, so sánh từng ký tự mất $O(N \\cdot Q)$. Với Rolling Hash, ta coi mỗi ký tự như một chữ số trong hệ cơ số $B = 311$ (lấy dư theo $M = 10^9 + 7$). Cũng giống như trong hệ thập phân muốn tách 2 chữ số cuối của `12345`, ta lấy `12345 - 123 * 100 = 45`!',
        formulaHighlight: 'Hash(L, R) = \\left(H[R] - H[L-1] \\cdot B^{R - L + 1} + M^2\\right) \\bmod M',
        keyTakeaway:
          'Trong kỳ thi HSG Quốc gia (VOI), nên dùng Double Hash (hai cặp modulo khác nhau như $10^9+7$ và $10^9+9$) để xác suất đụng độ (Hash Collision) gần như bằng 0.'
      },
      {
        stepTitle: '2. Hàm tiền tố KMP (Prefix Function) & Ứng dụng tìm chu kỳ xâu',
        stepType: 'example',
        teacherExplanation:
          'KMP không chỉ để tìm xâu $P$ trong $T$, mà mảng `pi[i]` còn cho biết chu kỳ nhỏ nhất lặp lại của một xâu: nếu $n \\bmod (n - pi[n-1]) == 0$ thì xâu có chu kỳ độ dài $n - pi[n-1]$.',
        workedExample: {
          problem: 'Tìm mảng hàm tiền tố $\\pi$ cho xâu `S = "ababa"`.',
          steps: [
            '`i = 0` (`"a"`): `pi[0] = 0` (tiền tố thực sự rỗng).',
            '`i = 1` (`"ab"`): `pi[1] = 0`.',
            '`i = 2` (`"aba"`): tiền tố `"a"` trùng hậu tố `"a"` → `pi[2] = 1`.',
            '`i = 3` (`"abab"`): tiền tố `"ab"` trùng hậu tố `"ab"` → `pi[3] = 2`.',
            '`i = 4` (`"ababa"`): tiền tố `"aba"` trùng hậu tố `"aba"` → `pi[4] = 3`.'
          ],
          answer: 'Mảng $\\pi = [0, 0, 1, 2, 3]$. Thời gian xây dựng $O(N)$.'
        },
        keyTakeaway:
          'Vòng lặp tính `pi[i]` luôn dùng mẹo `int j = pi[i - 1]; while (j > 0 && s[i] != s[j]) j = pi[j - 1];`.'
      },
      {
        stepTitle: '3. Ý tưởng Binary Lifting & LCA trên Cây trong O(log N)',
        stepType: 'concept',
        teacherExplanation:
          'Trên cây $N = 10^5$ đỉnh, khoảng cách giữa hai đỉnh $u, v$ bằng `dist(u, v) = depth[u] + depth[v] - 2 * depth[LCA(u, v)]`. Nhờ bảng nâng nhị phân `up[u][k] = up[up[u][k-1]][k-1]` (mất $O(N \\log N)$ xây dựng bằng 1 lần DFS), mọi truy vấn tìm cha chung gần nhất của $(u, v)$ chỉ tốn $\\log_2 N \\approx 17$ bước nhảy!',
        formulaHighlight: 'dist(u, v) = depth[u] + depth[v] - 2 \\cdot depth[LCA(u, v)]',
        keyTakeaway:
          'Khi nâng `u` và `v` lên cùng độ sâu, nhớ kiểm tra ngay `if (u == v) return u;` trước khi chạy vòng nhảy `k` từ `LOG` về `0`!'
      }
    ],
    complexity: {
      time: 'O(N + M) cho KMP & Hash, O(log N) cho mỗi truy vấn LCA',
      space: 'O(N log N) cho LCA, O(N) cho KMP/Hash'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Thuật toán KMP tìm số lần xuất hiện của P trong T (O(N + M))',
        basicTitle: 'C++ Cơ bản: So khớp trực tiếp bằng 2 vòng lặp for trong main (O(N·M))',
        basicCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string T = "ababcabcabababd";
    string P = "ababd";
    int n = T.size(), m = P.size(), matches = 0;
    for (int i = 0; i <= n - m; i++) {
        bool khop = true;
        for (int j = 0; j < m; j++) {
            if (T[i + j] != P[j]) {
                khop = false;
                break;
            }
        }
        if (khop) matches++;
    }
    cout << "So lan xuat hien: " << matches << '\\n';
    return 0;
}`,
        basicExplanation: 'Đặt mẫu P lần lượt tại mọi vị trí i của T rồi kiểm tra từng ký tự, không cần mảng hàm tiền tố KMP.',
        code: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string T = "ababcabcabababd";
    string P = "ababd";
    string S = P + "#" + T;
    int n = S.size(), m = P.size();
    vector<int> pi(n, 0);
    int matches = 0;
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && S[i] != S[j]) j = pi[j - 1];
        if (S[i] == S[j]) j++;
        pi[i] = j;
        if (i > m && pi[i] == m) matches++;
    }
    cout << "So lan xuat hien: " << matches << '\\n';
    return 0;
}`,
        explanation: 'Mẹo ghép P + "#" + T giúp tái sử dụng đúng một mảng hàm tiền tố pi để đếm số lần khớp trong O(|T| + |P|).'
      },
      {
        language: 'python',
        title: 'Python KMP Prefix Function',
        basicTitle: 'Python Cơ bản: Đếm bằng cắt chuỗi T[i:i+m] == P',
        basicCode: `T = "ababcabcabababd"
P = "ababd"
ans = 0
for i in range(len(T) - len(P) + 1):
    if T[i:i + len(P)] == P:
        ans += 1
print(ans)`,
        basicExplanation: 'Duyệt qua từng vị trí bắt đầu i và kiểm tra đoạn con dài |P| có bằng P hay không.',
        code: `def kmp_count(text: str, pattern: str) -> int:
    s = pattern + "#" + text
    n, m = len(s), len(pattern)
    pi = [0] * n
    ans = 0
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
        pi[i] = j
        if i > m and pi[i] == m:
            ans += 1
    return ans

print(kmp_count("ababcabcabababd", "ababd"))`,
        explanation: 'Kỹ thuật ghép ký tự phân tách "#" không xuất hiện trong bảng chữ cái cực kỳ gọn và an toàn.'
      }
    ],
    practiceProblem: {
      id: 'CS_P12',
      title: 'Đếm số lần xuất hiện của xâu mẫu P trong văn bản T (KMP)',
      difficulty: 'Hard',
      description: 'Cho hai xâu ký tự không chứa khoảng trắng: văn bản T và xâu mẫu P (1 ≤ |P|, |T| ≤ 10⁵). Hãy đếm xem xâu P xuất hiện bao nhiêu lần (có thể chồng lấp) bên trong T.',
      inputFormat: 'Dòng 1 là xâu T. Dòng 2 là xâu P.',
      outputFormat: 'In ra một số nguyên duy nhất là số lần P xuất hiện trong T.',
      sampleCases: [
        {
          input: 'aaaaa\naa',
          output: '4',
          explanation: 'Xâu "aa" xuất hiện tại các vị trí bắt đầu 0, 1, 2, 3 trong "aaaaa" (chồng lấp).'
        }
      ],
      solutionAnalysis: 'Xây dựng hàm tiền tố trên xâu ghép S = P + "#" + T. Mỗi vị trí i > |P| có pi[i] == |P| tương ứng với một lần xâu P xuất hiện kết thúc tại vị trí đó (O(|T| + |P|)).',
      basicAnalysis: 'Cơ bản: Duyệt từng vị trí i từ 0 đến |T|-|P| trong main(), kiểm tra từng ký tự của P có khớp liên tiếp với T[i+j] hay không (O(|T|·|P|), dễ đọc không dùng KMP).',
      basicSolutionCpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string T, P;
    cin >> T >> P;
    int n = T.size(), m = P.size(), ans = 0;
    for (int i = 0; i <= n - m; i++) {
        bool ok = true;
        for (int j = 0; j < m; j++) {
            if (T[i + j] != P[j]) {
                ok = false;
                break;
            }
        }
        if (ok) ans++;
    }
    cout << ans;
    return 0;
}`,
      basicSolutionPython: `T = input().strip()
P = input().strip()
ans = 0
for i in range(len(T) - len(P) + 1):
    if T[i:i + len(P)] == P:
        ans += 1
print(ans)`,
      fullSolutionCpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string T, P;
    if (!(cin >> T >> P)) return 0;
    string S = P + "#" + T;
    int n = (int)S.size();
    int m = (int)P.size();
    vector<int> pi(n, 0);
    int ans = 0;
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && S[i] != S[j]) j = pi[j - 1];
        if (S[i] == S[j]) j++;
        pi[i] = j;
        if (i > m && pi[i] == m) ans++;
    }
    cout << ans << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2:
        return
    T, P = tokens[0], tokens[1]
    S = P + "#" + T
    n, m = len(S), len(P)
    pi = [0] * n
    ans = 0
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and S[i] != S[j]:
            j = pi[j - 1]
        if S[i] == S[j]:
            j += 1
        pi[i] = j
        if i > m and pi[i] == m:
            ans += 1
    print(ans)

solve()`
    }
  }
];
