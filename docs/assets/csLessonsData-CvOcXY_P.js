var e={"cs-1":{vnoiPhase:`Phase 0 · Nhập môn & Độ phức tạp`,vnoiTag:`VNOI Wiki · I/O Tối Ưu & Đánh Giá Big-O`,lessonNumber:1,prerequisites:[],lectureSteps:[{stepTitle:`1. Tại sao code chạy đúng test nhỏ nhưng lại bị TLE hoặc WA trên test lớn?`,stepType:`intuition`,teacherExplanation:"Trong lộ trình VNOI, bước đầu tiên không phải học thuật toán khó ngay mà là làm chủ hai cạm bẫy chết người khiến 70% bài nộp bị đánh rớt: **Tràn số nguyên (Integer Overflow)** và **Đọc xuất chậm (I/O Bottleneck)**.\n\n• Khi bộ test có $N = 10^5$ hoặc $a, b = 10^9$: nếu dùng `cin`/`cout` mặc định mà không tắt đồng bộ với `stdio`, thời gian đọc dữ liệu đã có thể vượt quá $1\\text{ giây}$!\n• Nếu dùng `int` (tối đa $\\approx 2{,}14 \\cdot 10^9$) để nhân $a \\times b = 10^9 \\times 10^9 = 10^{18}$, kết quả bị tràn bit dấu và ra số âm sai hoàn toàn.",formulaHighlight:`10^8 \\text{ phép tính cơ bản} \\approx 1\\text{ giây (C++ O2)}`,keyTakeaway:"Luôn kiểm tra giới hạn $N$ và giá trị lớn nhất của biến trước khi chọn `int` hay `long long`, và ước lượng số phép tính theo quy tắc $10^8$ phép/giây."},{stepTitle:`2. Kỹ thuật Fast I/O & Quy tắc ước lượng Độ phức tạp Big-O`,stepType:`concept`,teacherExplanation:"• **Trong C++**: Luôn đặt cặp lệnh `ios_base::sync_with_stdio(false); cin.tie(NULL);` ở đầu hàm `main()`. Không dùng `endl` (vì `endl` ép flush buffer liên tục) mà dùng ký tự `'\\n'`.\n• **Trong Python**: Dùng `sys.stdin.read().split()` để đọc toàn bộ luồng dữ liệu một lần vào bộ nhớ thay vì gọi `input()` nhiều lần trong vòng lặp.\n• **Bảng chọn thuật toán theo $N$ trên VNOI**:\n  - $N \\le 20$: Đệ quy quay lui $O(2^N)$ hoặc $O(N!)$.\n  - $N \\le 5\\,000$: Vòng lặp lồng nhau / Quy hoạch động $O(N^2)$.\n  - $N \\le 10^5$: Sắp xếp, Tìm kiếm nhị phân, Segment Tree $O(N \\log N)$.\n  - $N \\le 10^6$: Thuật toán tuyến tính $O(N)$ (Hai con trỏ, Prefix Sum).",codeSnippet:{language:`cpp`,title:`Template chuẩn mở đầu mọi bài VNOI`,basicTitle:`Cơ bản: Nhập xuất trực tiếp trong main() (Tối giản)`,basicCode:`#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << endl;
    cout << a * b << endl;
    return 0;
}`,basicExplanation:`Phiên bản tối giản cho người mới: chỉ khai báo biến long long trực tiếp trong main(), không dùng Fast I/O hay cấu trúc nâng cao.`,advancedTitle:`Nâng cao / Chuyên: Fast I/O & Chống tràn số trung gian`,advancedCode:`#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    if (cin >> a >> b) {
        // Ép kiểu 1LL trước phép nhân để tránh tràn số trung gian
        long long product = 1LL * a * b;
        cout << a + b << '\\n' << product << '\\n';
    }
    return 0;
}`,advancedExplanation:`Tắt đồng bộ stdio với sync_with_stdio(false) + cin.tie(NULL) giúp tăng tốc I/O gấp 5–10 lần khi N ≥ 10⁵ trên VNOI.`,pythonBasicCode:`a, b = map(int, input().split())
print(a + b)
print(a * b)`,pythonAdvancedCode:`import sys

def main():
    data = sys.stdin.read().split()
    if len(data) >= 2:
        a, b = int(data[0]), int(data[1])
        print(f"{a + b}\\n{a * b}")

main()`,code:`#include <iostream>
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
}`},keyTakeaway:"Nếu $a$ và $b$ kiểu `int`, biểu thức `long long res = a * b;` VẪN TRÀN SỐ vì `a * b` được tính bằng `int` trước khi gán! Phải viết `1LL * a * b`."},{stepTitle:`3. Thực hành phân tích giới hạn bài toán cụ thể`,stepType:`example`,teacherExplanation:`Thầy/cô cùng em phân tích nhanh một bài toán đọc dữ liệu điển hình trên Online Judge:`,workedExample:{problem:`Cho $N = 10^5$ số nguyên dương $a_i \\le 10^9$. Hãy tính tổng $S = \\sum_{i=1}^N a_i$. Cần chọn kiểu dữ liệu gì và mất tối đa bao nhiêu thời gian?`,steps:["Bước 1 (Ước lượng giá trị cực đại): $S_{max} = 10^5 \\times 10^9 = 10^{14}$. Kiểu `int` ($2\\cdot 10^9$) chắc chắn tràn; kiểu `long long` ($9\\cdot 10^{18}$) chứa dư sức.","Bước 2 (Ước lượng độ phức tạp): Duyệt 1 vòng `for` từ $1$ đến $N$ tốn $O(N) = 10^5$ phép toán $\\ll 10^8$, chạy trong $< 0.02$ giây với Fast I/O.","Bước 3 (Kiểm tra nhập xuất): Dùng `cin.tie(NULL)` để đọc $10^5$ số không bị nghẽn bộ đệm."],answer:"Dùng `long long sum = 0;` kết hợp Fast I/O, độ phức tạp $O(N)$."},keyTakeaway:"Đọc xong đề bài luôn làm 2 việc đầu tiên: tính Max Value (chọn `long long`) và tính Max Operations (chọn Big-O)."}]},"cs-2":{vnoiPhase:`Phase 0 · Nhập môn & Độ phức tạp`,vnoiTag:`VNOI Wiki · Số Nguyên Tố & Sàng Eratosthenes`,lessonNumber:2,prerequisites:[`cs-1`],lectureSteps:[{stepTitle:`1. Tư duy tối ưu kiểm tra Số nguyên tố từ O(N) xuống O(√N)`,stepType:`intuition`,teacherExplanation:`Cách ngây thơ nhất để kiểm tra $N$ có phải số nguyên tố là thử chia cho mọi $i$ từ $2$ đến $N-1$. Nhưng nếu $N = 10^{12}$, vòng lặp $10^{12}$ bước sẽ chạy mất vài giờ (TLE ngay lập tức).

Nhận xét mấu chốt: Nếu $N$ là hợp số, tức $N = u \\times v$ ($1 < u \\le v < N$), thì chắc chắn thừa số nhỏ hơn $u$ phải thỏa mãn $u^2 \\le u \\times v = N \\Rightarrow u \\le \\sqrt{N}$. Do đó ta chỉ cần kiểm tra ước từ $2$ đến $\\lfloor\\sqrt{N}\\rfloor$!`,formulaHighlight:`N = u \\cdot v \\ (u \\le v) \\implies u \\le \\sqrt{N}`,keyTakeaway:"Không viết điều kiện `i <= sqrt(n)` trong vòng lặp vì hàm `sqrt` có sai số số thực và chậm; luôn viết `i * i <= n` với `i` kiểu `long long`!"},{stepTitle:`2. Sàng nguyên tố Eratosthenes — Bứt tốc cho nhiều truy vấn`,stepType:`derivation`,teacherExplanation:'Khi đề bài hỏi: "Cho $10^5$ truy vấn hoặc đếm tất cả số nguyên tố $\\le N$ ($N \\le 10^6$)", nếu mỗi số lại chạy $O(\\sqrt{N})$ thì tổng là $O(N\\sqrt{N}) \\approx 10^9$ phép toán (quá chậm).\n\n**Thuật toán Sàng Eratosthenes**:\n1. Khởi tạo mảng `isPrime[0..N] = true`, đặt `isPrime[0] = isPrime[1] = false`.\n2. Duyệt $p$ từ $2$ đến $\\sqrt{N}$: nếu `isPrime[p] == true` thì mọi bội của $p$ ($p^2, p^2+p, p^2+2p, \\dots$) đều là hợp số → đánh dấu `false`.\n3. Vì mỗi số chỉ bị gạch bởi các ước nguyên tố của nó, tổng số bước là $N \\left(\\frac{1}{2} + \\frac{1}{3} + \\frac{1}{5} + \\dots\\right) = O(N \\log \\log N)$!',formulaHighlight:`T(N) = \\sum_{p \\le \\sqrt{N}} \\frac{N}{p} = \\mathcal{O}(N \\log \\log N)`,keyTakeaway:"Bắt đầu gạch bội số từ `i = p * p` (thay vì `2 * p`) vì các bội nhỏ hơn `2p, 3p, ...` đã bị các số nguyên tố nhỏ hơn `p` gạch từ trước rồi."},{stepTitle:`3. Mô phỏng chạy tay Sàng Eratosthenes với N = 15`,stepType:`example`,teacherExplanation:`Cùng mô phỏng từng bước mảng đánh dấu với $N = 15$:`,workedExample:{problem:`Tìm tất cả các số nguyên tố $\\le 15$ bằng Sàng Eratosthenes.`,steps:["Khởi tạo: Đánh dấu $0, 1$ là `false`; các số $2..15$ tạm là `true`.","Xét $p = 2$ (đang `true`): Giữ nguyên $2$, gạch từ $2^2 = 4$: gạch $4, 6, 8, 10, 12, 14$.","Xét $p = 3$ (đang `true`): Giữ nguyên $3$, gạch từ $3^2 = 9$: gạch $9, 12, 15$.","Xét $p = 4$ đã `false` → bỏ qua. Vì $5^2 = 25 > 15$ nên dừng vòng sàng!"],answer:"Các số còn giữ `true` là $2, 3, 5, 7, 11, 13$ (tổng 6 số nguyên tố)."},keyTakeaway:`Sàng có thể mở rộng thành **Sàng trên đoạn $[L, R]$** ($R - L \\le 10^6, R \\le 10^{12}$) hoặc **Lưu ước nguyên tố nhỏ nhất (SPF)** để phân tích thừa số nguyên tố mỗi số chỉ trong $O(\\log N)$.`}]},"cs-3":{vnoiPhase:`Phase 1 · Cơ bản & Số học sơ cấp`,vnoiTag:`VNOI Wiki · Mảng Đếm & Xử Lý Xâu`,lessonNumber:3,prerequisites:[`cs-2`],lectureSteps:[{stepTitle:`1. Kỹ thuật Mảng Đếm (Counting / Frequency Bucket) giảm O(N²) xuống O(N)`,stepType:`concept`,teacherExplanation:"Rất nhiều bài toán sơ cấp yêu cầu đếm số lần xuất hiện của mỗi phần tử hoặc kiểm tra phần tử có tồn tại không.\n• Nếu lồng 2 vòng lặp để đếm → $O(N^2)$, gặp $N = 10^5$ là TLE ngay.\n• **Giải pháp VNOI**: Khi giá trị $0 \\le a_i \\le 10^6$, ta khai báo mảng toàn cục `int cnt[1000005]` (tự động khởi tạo bằng 0) rồi duyệt 1 vòng `cnt[a[i]]++`. Khi giá trị lớn tới $10^9$ hoặc số âm, ta dùng `sort` rồi đếm từng cụm giống nhau trong $O(N \\log N)$ hoặc dùng `map<long long, int>`!",keyTakeaway:"Mảng kích thước lớn ($10^6$ phần tử) PHẢI khai báo ở phạm vi toàn cục (Global) để nằm trên Heap/BSS, tránh lỗi tràn Stack (Segmentation Fault) khi khai báo trong `main()`."},{stepTitle:`2. Xử lý Xâu ký tự & Kiểm tra Đối xứng (Palindrome)`,stepType:`example`,teacherExplanation:"Xâu ký tự trong C++ (`std::string`) và Python (`str`) hỗ trợ truy cập $O(1)$ qua chỉ số. Để kiểm tra một xâu $S$ độ dài $L$ có đối xứng hay không, ta đặt 2 chỉ số từ đầu $l = 0$ và cuối $r = L - 1$, dịch dần vào tâm:",workedExample:{problem:'Kiểm tra xâu `s = "abccba"` và `s2 = "abca"` có phải Palindrome không.',steps:['Với `"abccba"`: $(l=0, r=5)$ có `a == a`; $(1,4)$ có `b == b`; $(2,3)$ có `c == c` → vòng lặp kết thúc khi $l \\ge r$ → `YES`.','Với `"abca"`: $(l=0, r=3)$ có `a == a`; $(1,2)$ có `b != c` → trả về `NO` ngay lập tức mà không cần xét tiếp.'],answer:`Độ phức tạp thời gian $O(L)$, bộ nhớ phụ $O(1)$.`},keyTakeaway:"Cẩn thận lỗi đọc trộn `cin >> n;` và `getline(cin, s);` trong C++: phải gọi `cin.ignore();` để nuốt ký tự xuống dòng thừa sau `n`."}]},"cs-4":{vnoiPhase:`Phase 1 · Cơ bản & Số học sơ cấp`,vnoiTag:`VNOI Wiki · Đệ Quy & Quay Lui (Backtracking)`,lessonNumber:5,prerequisites:[`cs-3`,`cs-10`],lectureSteps:[{stepTitle:`1. Tư duy Cây Đệ Quy & Nguyên tắc Backtracking`,stepType:`intuition`,teacherExplanation:"Quay lui (Backtracking) bản chất là duyệt theo chiều sâu trên cây các khả năng cấu hình. Tại bước thứ `k`, ta thử lần lượt mọi lựa chọn hợp lệ cho vị trí `k`, ghi nhận trạng thái, gọi đệ quy sang bước `k + 1`, và **bắt buộc hoàn tác trạng thái** khi hàm con trả về để nhánh tiếp theo được sạch sẽ.",keyTakeaway:"Mọi hàm quay lui đều tuân theo khung 3 bước: Chọn (Mark) → Gọi đệ quy `k + 1` → Bỏ chọn (Unmark / Restore)."},{stepTitle:`2. Phân tích bài toán kinh điển Xếp N Quân Hậu (N-Queens)`,stepType:`derivation`,teacherExplanation:"Trên bàn cờ $N \\times N$, mỗi hàng đặt đúng 1 quân hậu. Tại hàng $r$, ta chọn cột $c \\in [0, N-1]$. Làm sao kiểm tra ô $(r, c)$ có bị hậu ở các hàng trước ăn không trong $O(1)$?\n• Cùng cột: đánh dấu mảng `col[c]`.\n• Cùng đường chéo chính (hiệu $r - c$ là hằng số!): vì $r - c$ có thể âm nên cộng thêm độ lệch $N$: `diag1[r - c + N]`.\n• Cùng đường chéo phụ (tổng $r + c$ là hằng số!): `diag2[r + c]`.",formulaHighlight:`\\text{Chéo chính: } r - c = \\text{const}, \\quad \\text{Chéo phụ: } r + c = \\text{const}`,keyTakeaway:`Nhờ tính chất bất biến $r - c$ và $r + c$ trên đường chéo bàn cờ, ta kiểm tra hợp lệ chỉ trong $O(1)$ thay vì duyệt lại toàn bộ các quân hậu đã đặt.`},{stepTitle:`3. Cắt tỉa nhánh cận (Branch & Bound)`,stepType:`pitfall`,teacherExplanation:`Khi $N$ lớn dần, cây tìm kiếm bùng nổ theo giai thừa $O(N!)$ hoặc $O(2^N)$. Luôn kiểm tra tính toán cận dưới (lower bound) nếu bài toán yêu cầu tìm Min/Max để dừng sớm các nhánh chắc chắn không tối ưu hơn kỷ lục hiện tại.`,keyTakeaway:`Độ phức tạp hàm mũ/giai thừa chỉ chạy được với $N \\le 20$ (tập con) hoặc $N \\le 10..12$ (hoán vị / N-Queens).`}]},"cs-5":{vnoiPhase:`Phase 2 · Kỹ thuật tối ưu kinh điển`,vnoiTag:`VNOI Wiki · Tìm Kiếm Nhị Phân & Chặt Kết Quả`,lessonNumber:6,prerequisites:[`cs-4`],lectureSteps:[{stepTitle:`1. Tư duy chia đôi không gian tìm kiếm O(log N)`,stepType:`intuition`,teacherExplanation:`Với mảng 1 tỷ phần tử đã sắp xếp, tìm tuyến tính mất $10^9$ bước (~10 giây), nhưng Tìm kiếm nhị phân mỗi bước loại một nửa chỉ mất tối đa $\\lceil \\log_2(10^9) \\rceil = 30$ bước (< 0.00001 giây)!`,formulaHighlight:`mid = left + \\lfloor (right - left) / 2 \\rfloor`,keyTakeaway:"Luôn dùng `left + (right - left) / 2` thay cho `(left + right) / 2` để tránh tràn số khi `left, right` gần giới hạn kiểu dữ liệu."},{stepTitle:`2. Bí kíp VNOI: Chặt nhị phân trên tập Kết quả (Binary Search on Answer)`,stepType:`concept`,teacherExplanation:'Đây là kỹ thuật ăn điểm phổ biến nhất trong các đề thi HSG Tỉnh và Olympic 30/4. Dấu hiệu nhận biết:\n• Đề hỏi: *"Tìm giá trị nhỏ nhất của Max..."* hoặc *"Tìm giá trị lớn nhất của Min..."*.\n• Nếu ta kiểm tra được một hàm `bool check(X)` trả lời: *"Với ngưỡng $X$, ta có làm được không?"* và hàm `check(X)` có tính đơn điệu (kiểu `false, false, ..., false, true, true, ...`), thì giá trị nhỏ nhất thỏa mãn chính là vị trí chuyển từ `false` sang `true` đầu tiên!',workedExample:{problem:`Chia mảng $A = [7, 2, 5, 10, 8]$ thành $K = 2$ đoạn liên tiếp sao cho tổng đoạn lớn nhất là nhỏ nhất.`,steps:[`Xác định miền chặt: đoạn lớn nhất ít nhất bằng $\\max(A) = 10$ và nhiều nhất bằng $\\sum A = 32$.`,"Thử $mid = (10 + 32) / 2 = 21$: chia được `[7,2,5] (14)` và `[10,8] (18)` → dùng 2 đoạn $\\le K$ (`true`) → lưu `ans = 21`, thu hẹp `high = 20`.","Thử $mid = 15$: `[7,2,5] (14)`, `[10] (10)`, `[8] (8)` → cần 3 đoạn $> 2$ (`false`) → tăng `low = 16`.","Thu hẹp tiếp cho đến khi gặp ngưỡng nhỏ nhất đạt `true` là $18$."],answer:`Kết quả tối ưu là $18$. Độ phức tạp $O(N \\log(\\sum A))$.`},keyTakeaway:"Tách bạch 2 phần: (1) Vòng lặp `while (low <= high)` cập nhật `ans = mid`; (2) Hàm `check(mid)` tham lam thuần túy."}]},"cs-6":{vnoiPhase:`Phase 2 · Kỹ thuật tối ưu kinh điển`,vnoiTag:`VNOI Wiki · Prefix Sum, Mảng Hiệu & Two Pointers`,lessonNumber:7,prerequisites:[`cs-5`],lectureSteps:[{stepTitle:`1. Mảng Cộng Dồn (Prefix Sum) 1D & 2D: Trả lời Q truy vấn tổng trong O(1)`,stepType:`derivation`,teacherExplanation:`Nếu có $Q = 10^5$ truy vấn tính tổng đoạn $[L, R]$ trên mảng $N = 10^5$, tính trực tiếp mất $O(N \\cdot Q) = 10^{10}$ (TLE chắc chắn).
• **Tiền xử lý $O(N)$**: Định nghĩa $pref[0] = 0$, $pref[i] = pref[i-1] + a[i]$ (chỉ số 1-based cực kỳ sạch sẽ).
• **Truy vấn $O(1)$**: $\\sum_{k=L}^R a[k] = pref[R] - pref[L - 1]$.
• **Mở rộng Mảng Hiệu (Difference Array)**: Nếu đề bài cho $Q$ thao tác tăng cả đoạn $[L, R]$ lên $+V$, ta chỉ cần gán \`diff[L] += V; diff[R + 1] -= V;\` trong $O(1)$, rồi lấy Prefix Sum một lần ở cuối!`,formulaHighlight:`Sum(L, R) = pref[R] - pref[L - 1], \\quad pref[i] \\in \\text{long long}`,keyTakeaway:"Đánh chỉ số mảng từ `1` đến `N` khi làm Prefix Sum để tránh lỗi truy cập `pref[-1]` tại $L = 0$."},{stepTitle:`2. Hai Con Trỏ (Two Pointers) & Cửa Sổ Trượt (Sliding Window)`,stepType:`example`,teacherExplanation:"Khi cả `left` và `right` chỉ tiến về phía trước mà không bao giờ lùi lại, tổng số lần dịch chuyển của cả 2 con trỏ tối đa chỉ là $2N$, nên độ phức tạp luôn là $O(N)$!",workedExample:{problem:`Cho mảng số dương $A = [2, 1, 3, 4, 5]$ và $S = 7$. Tìm độ dài đoạn con liên tiếp dài nhất có tổng $\\le S$.`,steps:["Mở rộng `right` từ 0→2: cửa sổ `[2, 1, 3]`, tổng $= 6 \\le 7$, kỷ lục `maxLen = 3`.","Tăng `right = 3` (`a[3] = 4`): tổng $= 10 > 7$ → đẩy `left` tăng lên để trừ `a[0]=2` (tổng 8 > 7), trừ tiếp `a[1]=1` (tổng 7 $\\le 7$) → cửa sổ `[3, 4]`, độ dài 2.","Tăng `right = 4` (`a[4] = 5`): tổng $= 12 > 7$ → đẩy `left` trừ `3` và `4` → cửa sổ `[5]`, độ dài 1."],answer:"Độ dài lớn nhất tìm được là `maxLen = 3`."},keyTakeaway:`Cửa sổ trượt chỉ đúng khi các phần tử đều không âm (thêm phần tử làm tổng tăng, bớt phần tử làm tổng giảm).`}]},"cs-7":{vnoiPhase:`Phase 3 · Quy hoạch động & Đồ thị`,vnoiTag:`VNOI Wiki · Quy Hoạch Động Cơ Bản (DP)`,lessonNumber:9,prerequisites:[`cs-11`],lectureSteps:[{stepTitle:`1. Công thức 4 bước thiết kế mọi bài Quy hoạch động trên VNOI`,stepType:`concept`,teacherExplanation:`Học sinh mới hay sợ Quy hoạch động (DP) vì cứ cố đoán công thức. Trên VNOI, mọi bài DP đều giải theo đúng 4 bước kỷ luật:
1. **Định nghĩa Trạng thái**: \`dp[...]\` mang ý nghĩa chính xác là gì?
2. **Bài toán Cơ sở (Base Case)**: Giá trị khởi tạo nhỏ nhất mà không cần công thức.
3. **Công thức Chuyển trạng thái (Transition)**: Tính \`dp[hiện tại]\` từ các trạng thái nhỏ hơn đã biết.
4. **Thứ tự tính & Tối ưu bộ nhớ**: Đảm bảo bài toán con đã được tính trước khi dùng.`,keyTakeaway:'Nếu trả lời rõ ràng câu: "`dp[i]` lưu đáp án cho bài toán con nào?", bạn đã giải xong 70% bài Quy hoạch động.'},{stepTitle:`2. Phân tích 0-1 Knapsack & Lý do phải duyệt ngược`,stepType:`derivation`,teacherExplanation:"Với mảng 2 chiều: `dp[i][j] = max(dp[i-1][j], dp[i-1][j - w[i]] + v[i])`. Khi nén xuống mảng 1 chiều `dp[j]`, trạng thái cũ ở lượt `i-1` nằm bên trái (`j - w[i]`). Nếu duyệt `j` xuôi từ nhỏ đến lớn, `dp[j - w[i]]` vừa mới bị ghi đè ở lượt `i`, tức là một món đồ bị chọn nhiều lần! Vì vậy **0-1 Knapsack 1D bắt buộc phải duyệt ngược `j` từ $W$ về $w_i$**.",formulaHighlight:`dp[j] = \\max(dp[j],\\ dp[j - w_i] + v_i) \\quad (j: W \\to w_i)`,keyTakeaway:"0-1 Knapsack (mỗi vật chọn 1 lần) → duyệt ngược `j` từ $W$ về $w_i$. Unbounded Knapsack (chọn vô hạn lần) → duyệt xuôi `j` từ $w_i$ đến $W$."},{stepTitle:`3. Dãy con tăng dài nhất (LIS) trong O(N log N)`,stepType:`example`,teacherExplanation:"Cách DP thường $dp[i] = \\max_{j<i, a_j < a_i}(dp[j] + 1)$ tốn $O(N^2)$ chỉ qua $N \\le 5000$. Với $N = 10^5$, ta giữ mảng `tails` trong đó `tails[k]` là phần tử kết thúc NHỎ NHẤT của một dãy tăng độ dài `k + 1`. Vì `tails` luôn tăng nghiêm ngặt, ta dùng `lower_bound` tìm vị trí thay thế trong $O(\\log N)$!",workedExample:{problem:"Chạy tay thuật toán LIS $O(N \\log N)$ trên dãy `A = [1, 2, 5, 3, 4, 7]`.",steps:["Đọc 1, 2, 5: lần lượt nối vào cuối `tails = [1, 2, 5]`.","Đọc 3: `lower_bound(tails, 3)` trỏ vào số `5` → thay thế thành `tails = [1, 2, 3]` (giảm phần tử đuôi để dễ nối dài về sau).","Đọc 4: `tails = [1, 2, 3, 4]`. Đọc 7: `tails = [1, 2, 3, 4, 7]`."],answer:"Độ dài LIS là `tails.size() = 5`."},keyTakeaway:"Lưu ý `tails` chỉ đảm bảo đúng ĐỘ DÀI LIS chứ bản thân `tails` không phải lúc nào cũng là dãy con hợp lệ nếu có phần tử thay thế ở giữa; muốn truy vết dãy gốc cần lưu thêm mảng chỉ số cha."}]},"cs-8":{vnoiPhase:`Phase 3 · Quy hoạch động & Đồ thị`,vnoiTag:`VNOI Wiki · Đồ Thị DFS/BFS & Dijkstra`,lessonNumber:10,prerequisites:[`cs-7`],lectureSteps:[{stepTitle:`1. Biểu diễn Đồ thị trên VNOI: Danh sách kề (Adjacency List)`,stepType:`concept`,teacherExplanation:"Với $N = 10^5$ đỉnh, Ma trận kề `adj[N][N]` tốn $10^{10}$ ô nhớ (~40 GB RAM → Memory Limit Exceeded ngay!). Bắt buộc dùng Danh sách kề `vector<int> adj[N]` (không trọng số) hoặc `vector<pair<int, int>> adj[N]` (có trọng số), chỉ tốn $O(V + E)$ bộ nhớ.",keyTakeaway:"Đồ thị vô hướng cạnh $(u, v)$ phải `push_back` cả hai chiều: `adj[u].push_back(v)` và `adj[v].push_back(u)`."},{stepTitle:`2. Phân biệt sức mạnh của DFS và BFS`,stepType:`concept`,teacherExplanation:`• **DFS (Depth-First Search)**: Đi sâu hết nhánh mới quay lui. Rất mạnh để: đếm thành phần liên thông, kiểm tra đồ thị 2 phía (Bipartite), tìm chu trình, sắp xếp Topo, tính kích thước cây con.
• **BFS (Breadth-First Search)**: Loang theo từng lớp khoảng cách $0, 1, 2, \\dots$. Đảm bảo tìm được **đường đi ít cạnh nhất** trên đồ thị không trọng số (hoặc trọng số bằng nhau).`,keyTakeaway:"Đánh dấu `visited[v] = true` NGAY LÚC đẩy `v` vào hàng đợi BFS (không đợi lúc `pop` ra mới đánh dấu) để tránh một đỉnh bị đẩy vào queue hàng trăm lần gây MLE/TLE!"},{stepTitle:`3. Thuật toán Dijkstra tìm đường đi ngắn nhất O((V + E) log V)`,stepType:`derivation`,teacherExplanation:"Khi các cạnh có trọng số không âm $w \\ge 0$, BFS thường không còn đúng (nhiều cạnh nhưng tổng trọng số nhỏ hơn). Ta thay `queue` bằng **Min-Heap (`priority_queue` với `greater<>`)** luôn lấy đỉnh có `dist` nhỏ nhất hiện tại để nới lỏng các đỉnh kề: `if (dist[u] + w < dist[v]) ...`",formulaHighlight:`\\text{Relax}(u \\to v): \\ dist[v] = \\min(dist[v],\\ dist[u] + w(u, v))`,keyTakeaway:"Dòng `if (d > dist[u]) continue;` cực kỳ quan trọng để bỏ qua các bản sao cũ trong heap, giữ độ phức tạp chặt $O((V + E) \\log V)$. Và Dijkstra KHÔNG đúng nếu đồ thị có cạnh trọng số âm!"}]},"cs-9":{vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Segment Tree & DSU`,lessonNumber:11,prerequisites:[`cs-8`],lectureSteps:[{stepTitle:`1. Khi nào cần Cây Phân Đoạn (Segment Tree)?`,stepType:`intuition`,teacherExplanation:"Prefix Sum tính tổng đoạn $[L, R]$ trong $O(1)$ nhưng nếu có xen kẽ thao tác **sửa giá trị `a[p] = x`**, ta phải cập nhật lại $O(N)$ phần tử của mảng cộng dồn → lại thành $O(N \\cdot Q)$! Segment Tree chia đôi mảng theo cây nhị phân để CẢ cập nhật và truy vấn đoạn đều đạt $O(\\log N)$.",formulaHighlight:`\\text{Kích thước mảng cây an toàn: } 4 \\times N`,keyTakeaway:"Phần tử trung hòa (Identity) khi ra ngoài đoạn `[l, r]`: Tổng → trả `0`; Min → trả `+INF`; Max → trả `-INF`; GCD → trả `0`."},{stepTitle:`2. Disjoint Set Union (DSU) — Hợp nhất Tập hợp Rời rạc`,stepType:`derivation`,teacherExplanation:"DSU duy trì các tập hợp rời rạc qua 2 hàm `find(u)` (tìm gốc đại diện) và `unite(u, v)` (gộp 2 tập). Khi kết hợp:\n1. **Nén đường đi (Path Compression)**: `return parent[u] = find(parent[u]);` gắn thẳng mọi nút trên đường đi về gốc.\n2. **Gộp theo kích thước (Union by Size)**: luôn nối gốc tập nhỏ vào gốc tập lớn.\nNhờ đó mọi thao tác gần như $O(1)$ thực tế ($O(\\alpha(N))$)!",keyTakeaway:`DSU kết hợp sắp xếp cạnh theo trọng số tăng dần tạo thành thuật toán **Kruskal** tìm Cây khung nhỏ nhất (MST) kinh điển nhất của HSG Quốc gia.`}]}},t=[{id:`cs-10`,level:`Cơ bản`,vnoiPhase:`Phase 1 · Cơ bản & Số học sơ cấp`,vnoiTag:`VNOI Wiki · Euclid GCD, Luỹ Thừa Nhị Phân & Modulo`,prerequisites:[`cs-3`],lessonNumber:4,title:`Số học Thi đấu: Euclid GCD, Luỹ Thừa Nhị Phân & Đồng Dư Modulo`,topic:`ƯCLN/BCNN, Tính a^b mod M trong O(log b) & Định lý Fermat nhỏ`,estimatedMinutes:18,theory:[`1. Thuật toán Euclid tìm $\\gcd(a, b)$: Dựa trên tính chất $\\gcd(a, b) = \\gcd(b, a \\bmod b)$ với trường hợp cơ sở $\\gcd(a, 0) = a$. Độ phức tạp $O(\\log(\\min(a, b)))$. Khi tính BCNN: $\\text{lcm}(a, b) = (a / \\gcd(a, b)) \\times b$ (chia trước nhân sau để tránh tràn số!).`,"2. Các phép toán đồng dư modulo $M$ ($M = 10^9 + 7$): $(A + B) \\bmod M = ((A \\bmod M) + (B \\bmod M)) \\bmod M$; với phép trừ luôn cộng thêm $M$ trước khi lấy dư: `((A - B) % M + M) % M`.",`3. Luỹ thừa nhị phân (Binary Exponentiation): Tính $a^b \\bmod M$ với $b \\le 10^{18}$ trong $O(\\log b)$ bằng cách chia đôi số mũ: nếu $b$ chẵn thì $a^b = (a^{b/2})^2$; nếu $b$ lẻ thì $a^b = a \\cdot a^{b-1}$.`,`4. Nghịch đảo Modulo (Modular Inverse): Khi $M$ là số nguyên tố (như $10^9 + 7$), theo định lý Fermat nhỏ: $a^{M-1} \\equiv 1 \\pmod M \\implies a^{-1} \\equiv a^{M-2} \\pmod M$, dùng để tính phép chia $(A / B) \\bmod M = (A \\cdot B^{M-2}) \\bmod M$.`],lectureSteps:[{stepTitle:`1. Tại sao chia trước nhân sau khi tính BCNN và xử lý số âm khi Modulo?`,stepType:`pitfall`,teacherExplanation:"• **Cạm bẫy BCNN**: Nếu viết `(a * b) / gcd(a, b)` với $a, b = 10^{12}$, tích `a * b = 10^{24}` sẽ tràn cả `long long` ($9 \\cdot 10^{18}$)! Phải chia trước: `(a / gcd(a, b)) * b`.\n• **Cạm bẫy Modulo số âm trong C++**: Trong C++, `-3 % 7` cho ra `-3` (chứ không phải `4` như toán học và Python!). Vì vậy phép trừ trong C++ luôn phải viết: `((a - b) % MOD + MOD) % MOD`.",formulaHighlight:`\\text{lcm}(a, b) = \\left(\\frac{a}{\\gcd(a, b)}\\right) \\cdot b`,keyTakeaway:"Luôn ép về dương bằng `((x % M) + M) % M` sau mỗi phép trừ có thể ra âm trong C++."},{stepTitle:`2. Ý tưởng Luỹ thừa Nhị phân (Binary Exponentiation) O(log b)`,stepType:`derivation`,teacherExplanation:"Muốn tính $3^{13} \\bmod M$, nếu nhân lặp 13 lần mất $O(b)$ — với $b = 10^{18}$ thì chắc chắn TLE. Ta phân tích số mũ sang hệ nhị phân: $13 = 8 + 4 + 1 = 1101_2$, tức $3^{13} = 3^8 \\cdot 3^4 \\cdot 3^1$. Mỗi bước ta bình phương cơ số `a = (a * a) % M` và chia đôi số mũ `b /= 2`; nếu bit cuối của `b` là 1 (`b % 2 == 1`) thì nhân thêm `a` vào biến kết quả `res`.",formulaHighlight:`a^b = \\begin{cases} (a^2)^{b/2} & \\text{nếu } b \\text{ chẵn} \\\\ a \\cdot (a^2)^{\\lfloor b/2 \\rfloor} & \\text{nếu } b \\text{ lẻ} \\end{cases}`,workedExample:{problem:`Tính $2^{10} \\bmod 1000$ bằng luỹ thừa nhị phân từng bước.`,steps:["Khởi tạo `res = 1`, `a = 2`, `b = 10`.","`b = 10` (chẵn): `a = 2^2 = 4`, `b = 5`, `res = 1`.","`b = 5` (lẻ): `res = 1 * 4 = 4`, sau đó `a = 4^2 = 16`, `b = 2`.","`b = 2` (chẵn): `a = 16^2 = 256`, `b = 1`, `res = 4`.","`b = 1` (lẻ): `res = (4 * 256) % 1000 = 1024 % 1000 = 24`, `b = 0` → dừng!"],answer:`$2^{10} \\bmod 1000 = 24$ chỉ sau 4 bước lặp!`},keyTakeaway:`Luỹ thừa nhị phân là nền tảng để tính Tổ hợp $C_n^k \\bmod (10^9+7)$ qua nghịch đảo Fermat $k!^{M-2}$ và Nhân ma trận tính số Fibonacci thứ $10^{18}$!`}],complexity:{time:`O(log b) cho luỹ thừa & Euclid GCD`,space:`O(1)`},codeExamples:[{language:`cpp`,title:`C++ Euclid GCD & Binary Exponentiation`,basicTitle:`C++ Cơ bản: Tìm ƯCLN và tính lũy thừa bằng vòng lặp trực tiếp trong main`,basicCode:`#include <iostream>
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
}`,basicExplanation:`Tìm ƯCLN bằng trừ dần trực giác và tính lũy thừa bằng vòng lặp nhân từng bước ngay trong main().`,code:`#include <iostream>
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
}`,explanation:`Dùng vòng lặp while cho GCD và powerMod giúp tốn O(1) bộ nhớ và không lo tràn stack.`},{language:`python`,title:`Python math.gcd & pow(a, b, mod)`,basicTitle:`Python Cơ bản: Chia lấy dư Euclid & nhân lặp không dùng hàm thư viện`,basicCode:`a, b = 24, 36
while b != 0:
    a, b = b, a % b
print("GCD:", a)

MOD = 10**9 + 7
kq = 1
for _ in range(10):
    kq = (kq * 2) % MOD
print("2^10 mod M:", kq)`,basicExplanation:`Tự viết vòng lặp Euclid và nhân modulo từng bước để hiểu bản chất thuật toán.`,code:`import math

MOD = 10**9 + 7
a, b = 24, 36
g = math.gcd(a, b)
lcm = (a // g) * b
print("GCD:", g, "LCM:", lcm)
print("2^100 mod M:", pow(2, 100, MOD))`,explanation:`Hàm pow(a, b, mod) có sẵn trong Python triển khai luỹ thừa nhị phân ở tầng C.`}],practiceProblem:{id:`CS_P10`,title:`Tính lũy thừa lớn a^b mod (10^9 + 7)`,difficulty:`Medium`,description:`Cho hai số nguyên không âm a và b (0 ≤ a, b ≤ 10⁹, không đồng thời bằng 0). Hãy tính giá trị của a^b chia lấy dư cho 1000000007 (10⁹ + 7).`,inputFormat:`Một dòng chứa hai số nguyên a và b.`,outputFormat:`In ra kết quả a^b mod 1000000007.`,sampleCases:[{input:`2 10`,output:`1024`,explanation:`2¹⁰ = 1024, chia dư cho 10⁹ + 7 vẫn bằng 1024.`},{input:`3 1000000000`,output:`813379065`,explanation:`Áp dụng luỹ thừa nhị phân trong ~30 bước lặp.`}],solutionAnalysis:`Dùng thuật toán luỹ thừa nhị phân (Binary Exponentiation) nhân dồn bình phương cơ số kết hợp modulo ở mỗi bước nhân (O(log b)).`,basicAnalysis:`Cơ bản: Khi b nhỏ, nhân dồn a đúng b lần và chia dư cho 10^9 + 7 ngay trong vòng lặp for (O(b), không cần phép toán bit hay chia đôi số mũ).`,basicSolutionCpp:`#include <iostream>
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
}`,basicSolutionPython:`a, b = map(int, input().split())
MOD = 1000000007
res = 1
for _ in range(b):
    res = (res * a) % MOD
print(res)`,fullSolutionCpp:`#include <iostream>
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
}`,fullSolutionPython:`import sys

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

solve()`}},{id:`cs-11`,level:`Trung cấp`,vnoiPhase:`Phase 2 · Kỹ thuật tối ưu kinh điển`,vnoiTag:`VNOI Wiki · Stack Đơn Điệu, Deque Min/Max & Tham Lam`,prerequisites:[`cs-6`],lessonNumber:8,title:`Stack Đơn Điệu, Deque Min/Max Trên Đoạn Tịnh Tiến & Thuật Toán Tham Lam`,topic:`Monotonic Stack O(N), Sliding Window Min/Max & Lập lịch Tham lam`,estimatedMinutes:20,theory:[`1. Ngăn xếp đơn điệu (Monotonic Stack): Lưu các chỉ số sao cho giá trị tương ứng trong ngăn xếp luôn tăng dần (hoặc giảm dần). Mỗi phần tử chỉ được đẩy vào và lấy ra tối đa 1 lần nên tổng thời gian chỉ là $O(N)$!`,`2. Ứng dụng Stack đơn điệu: Tìm phần tử gần nhất bên trái/phải nhỏ hơn (hoặc lớn hơn) $a[i]$, tính diện tích hình chữ nhật lớn nhất trong biểu đồ cột (Histogram).`,"3. Hàng đợi hai đầu (Deque) tìm Min/Max trên mọi đoạn độ dài $K$: Duy trì một Deque chứa các chỉ số ứng viên tăng dần về giá trị. Đầu Deque (`dq.front()`) luôn là phần tử nhỏ nhất của cửa sổ hiện tại sau khi loại bỏ các chỉ số đã trôi ra ngoài phạm vi $[i - K + 1, i]$.",`4. Thuật toán Tham lam (Greedy): Chọn phương án tối ưu cục bộ ở từng bước (ví dụ bài toán Chọn lịch không giao nhau bằng cách sắp xếp theo thời gian kết thúc tăng dần).`],lectureSteps:[{stepTitle:`1. Bí mật giúp Stack đơn điệu và Deque đạt độ phức tạp O(N)`,stepType:`intuition`,teacherExplanation:"Thoạt nhìn, bên trong vòng lặp `for (int i = 0; i < n; i++)` lại có vòng lặp `while (!dq.empty() && ...)` khiến nhiều bạn tưởng độ phức tạp là $O(N^2)$. Thực tế **mỗi phần tử chỉ được `push` vào Stack/Deque đúng 1 lần và `pop` ra tối đa 1 lần** trong suốt cả chương trình! Do đó tổng số lần lặp của `while` cộng gộp qua toàn bộ chạy không quá $N$ → Độ phức tạp trừ dần (Amortized) là $O(N)$ tuyệt đối.",keyTakeaway:"Luôn lưu **chỉ số (index)** vào Stack/Deque thay vì lưu giá trị trực tiếp, vì từ chỉ số ta dễ dàng biết cả giá trị `a[idx]` lẫn khoảng cách / kiểm tra hết hạn `idx <= i - k`!"},{stepTitle:`2. Chạy tay Deque tìm Min trên cửa sổ trượt độ dài K = 3`,stepType:`example`,teacherExplanation:`Ta cần duy trì Deque chỉ số tăng dần giá trị để phần tử đầu Deque luôn là Min:`,workedExample:{problem:"Cho mảng `A = [4, 2, 5, 1, 3]` và $K = 3$. Tìm giá trị nhỏ nhất của từng đoạn 3 số liên tiếp.",steps:["i=0 (`4`): đẩy 0. Deque: `[0 (4)]`.","i=1 (`2`): `2 <= a[0]=4` → loại 0 khỏi đuôi, đẩy 1. Deque: `[1 (2)]`.","i=2 (`5`): `5 > a[1]=2` → đẩy 2. Deque: `[1 (2), 2 (5)]`. Đủ K=3 → In `a[1] = 2`.","i=3 (`1`): `1 <= 5` và `1 <= 2` → loại sạch 2 và 1, đẩy 3. Deque: `[3 (1)]`. Đủ K=3 → In `a[3] = 1`.","i=4 (`3`): đầu deque `3 > 4 - 3 = 1` (còn hạn), `3 > 1` → đẩy 4. Deque: `[3 (1), 4 (3)]` → In `a[3] = 1`."],answer:"Dãy Min các cửa sổ là `2 1 1` với thời gian $O(N)$."},keyTakeaway:`Với Stack đơn điệu/Deque: Vô dụng hóa các phần tử cũ đứng trước mà giá trị còn tệ hơn phần tử mới vào (vì phần tử mới vừa tốt hơn vừa sống lâu hơn trong cửa sổ!).`}],complexity:{time:`O(N) cho Monotonic Stack/Deque, O(N log N) cho Greedy cần Sort`,space:`O(N)`},codeExamples:[{language:`cpp`,title:`C++ Deque tìm Min đoạn tịnh tiến độ dài K (O(N))`,basicTitle:`C++ Cơ bản: Hai vòng lặp for tìm Min từng đoạn K phần tử (O(N·K))`,basicCode:`#include <iostream>
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
}`,basicExplanation:`Không cần Deque: duyệt từng đoạn độ dài K bắt đầu từ i và tìm phần tử nhỏ nhất bằng vòng lặp trong main().`,code:`#include <iostream>
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
}`,explanation:`Mỗi phần tử vào và ra deque đúng 1 lần nên toàn bộ vòng lặp chạy trong O(N).`},{language:`python`,title:`Python collections.deque Sliding Window Min`,basicTitle:`Python Cơ bản: Dùng vòng lặp cắt từng đoạn a[i:i+k]`,basicCode:`a = [4, 2, 5, 1, 3]
k = 3
res = []
for i in range(len(a) - k + 1):
    res.append(min(a[i:i + k]))
print(*res)`,basicExplanation:`Với mỗi cửa sổ độ dài K, lấy giá trị min trực tiếp mà không cần cấu trúc deque.`,code:`from collections import deque

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

print(*sliding_min([4, 2, 5, 1, 3], 3))`,explanation:`deque của Python hỗ trợ popleft() và pop() trong O(1).`}],practiceProblem:{id:`CS_P11`,title:`Kiểm tra Dãy Ngoặc Đúng (Valid Parentheses - Stack)`,difficulty:`Medium`,description:`Cho một xâu S chỉ gồm các ký tự ngoặc (), [], {} có độ dài không quá 10⁵. Hãy kiểm tra xem xâu ngoặc đó có cân bằng và đóng mở đúng cặp hay không. In ra YES nếu đúng, ngược lại in NO.`,inputFormat:`Một dòng duy nhất chứa xâu ký tự S.`,outputFormat:`In ra YES hoặc NO.`,sampleCases:[{input:`({[]})`,output:`YES`,explanation:`Mỗi ngoặc mở đều khớp với ngoặc đóng tương ứng gần nhất bên trong.`},{input:`([)]`,output:`NO`,explanation:`Ngoặc tròn ) đóng trước ngoặc vuông ], vi phạm thứ tự Stack.`}],solutionAnalysis:`Dùng Stack: gặp ngoặc mở thì đẩy vào Stack; gặp ngoặc đóng thì kiểm tra Stack không rỗng và đỉnh Stack phải là ngoặc mở cùng loại rồi pop ra. Cuối cùng Stack phải rỗng hoàn toàn.`,basicAnalysis:"Cơ bản: Thay vì dùng std::stack, mô phỏng ngăn xếp bằng một chuỗi ký tự đơn giản `openStr` cộng/xóa ở cuối, viết gọn trong main().",basicSolutionCpp:`#include <iostream>
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
}`,basicSolutionPython:`s = input().strip()
while "()" in s or "[]" in s or "{}" in s:
    s = s.replace("()", "").replace("[]", "").replace("{}", "")
print("YES" if s == "" else "NO")`,fullSolutionCpp:`#include <iostream>
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
}`,fullSolutionPython:`import sys

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

solve()`}},{id:`cs-12`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · String Hashing, KMP & LCA trên Cây`,prerequisites:[`cs-9`],lessonNumber:12,title:`Xử Lý Xâu Nâng Cao (Hash, KMP) & Tổ Tiên Chung Gần Nhất (LCA)`,topic:`Polynomial Rolling Hash, Hàm Tiền Tố KMP O(N+M) & Binary Lifting LCA`,estimatedMinutes:25,theory:["1. String Hashing (Băm đa thức): Biểu diễn xâu $S$ như một số ở cơ số $Base$ (thường chọn $311$) chia dư cho $MOD = 10^9 + 7$. Nhờ mảng `hash[i]` và luỹ thừa `powBase[i]`, ta tính được mã băm của MỌI xâu con $S[L..R]$ trong $O(1)$: $Hash(L, R) = (hash[R] - hash[L-1] \\cdot Base^{R-L+1}) \\bmod MOD$.","2. Thuật toán KMP (Knuth-Morris-Pratt): Xây dựng mảng hàm tiền tố `pi[i]` (độ dài tiền tố thực sự dài nhất đồng thời là hậu tố của $P[0..i]$). Khi so khớp thất bại, không quay lại đầu xâu mà nhảy về `pi[j - 1]`, giúp tìm mọi vị trí xuất hiện của mẫu $P$ trong văn bản $T$ chỉ mất $O(|T| + |P|)$.","3. Tổ tiên chung gần nhất (LCA) bằng Nhảy Nhị Phân (Binary Lifting): Lưu mảng `up[u][k]` là tổ tiên thứ $2^k$ của đỉnh $u$ trên cây. Để tìm $LCA(u, v)$, ta nâng đỉnh sâu hơn lên cùng độ cao với đỉnh kia, sau đó nhảy song song các bước $2^k$ từ lớn về nhỏ."],lectureSteps:[{stepTitle:`1. So khớp hai xâu con bất kỳ chỉ trong O(1) bằng Rolling Hash`,stepType:`derivation`,teacherExplanation:'Nếu cần trả lời $10^5$ truy vấn: *"Hai xâu con $S[l_1..r_1]$ và $S[l_2..r_2]$ có giống hệt nhau không?"*, so sánh từng ký tự mất $O(N \\cdot Q)$. Với Rolling Hash, ta coi mỗi ký tự như một chữ số trong hệ cơ số $B = 311$ (lấy dư theo $M = 10^9 + 7$). Cũng giống như trong hệ thập phân muốn tách 2 chữ số cuối của `12345`, ta lấy `12345 - 123 * 100 = 45`!',formulaHighlight:`Hash(L, R) = \\left(H[R] - H[L-1] \\cdot B^{R - L + 1} + M^2\\right) \\bmod M`,keyTakeaway:`Trong kỳ thi HSG Quốc gia (VOI), nên dùng Double Hash (hai cặp modulo khác nhau như $10^9+7$ và $10^9+9$) để xác suất đụng độ (Hash Collision) gần như bằng 0.`},{stepTitle:`2. Hàm tiền tố KMP (Prefix Function) & Ứng dụng tìm chu kỳ xâu`,stepType:`example`,teacherExplanation:"KMP không chỉ để tìm xâu $P$ trong $T$, mà mảng `pi[i]` còn cho biết chu kỳ nhỏ nhất lặp lại của một xâu: nếu $n \\bmod (n - pi[n-1]) == 0$ thì xâu có chu kỳ độ dài $n - pi[n-1]$.",workedExample:{problem:'Tìm mảng hàm tiền tố $\\pi$ cho xâu `S = "ababa"`.',steps:['`i = 0` (`"a"`): `pi[0] = 0` (tiền tố thực sự rỗng).','`i = 1` (`"ab"`): `pi[1] = 0`.','`i = 2` (`"aba"`): tiền tố `"a"` trùng hậu tố `"a"` → `pi[2] = 1`.','`i = 3` (`"abab"`): tiền tố `"ab"` trùng hậu tố `"ab"` → `pi[3] = 2`.','`i = 4` (`"ababa"`): tiền tố `"aba"` trùng hậu tố `"aba"` → `pi[4] = 3`.'],answer:`Mảng $\\pi = [0, 0, 1, 2, 3]$. Thời gian xây dựng $O(N)$.`},keyTakeaway:"Vòng lặp tính `pi[i]` luôn dùng mẹo `int j = pi[i - 1]; while (j > 0 && s[i] != s[j]) j = pi[j - 1];`."},{stepTitle:`3. Ý tưởng Binary Lifting & LCA trên Cây trong O(log N)`,stepType:`concept`,teacherExplanation:"Trên cây $N = 10^5$ đỉnh, khoảng cách giữa hai đỉnh $u, v$ bằng `dist(u, v) = depth[u] + depth[v] - 2 * depth[LCA(u, v)]`. Nhờ bảng nâng nhị phân `up[u][k] = up[up[u][k-1]][k-1]` (mất $O(N \\log N)$ xây dựng bằng 1 lần DFS), mọi truy vấn tìm cha chung gần nhất của $(u, v)$ chỉ tốn $\\log_2 N \\approx 17$ bước nhảy!",formulaHighlight:`dist(u, v) = depth[u] + depth[v] - 2 \\cdot depth[LCA(u, v)]`,keyTakeaway:"Khi nâng `u` và `v` lên cùng độ sâu, nhớ kiểm tra ngay `if (u == v) return u;` trước khi chạy vòng nhảy `k` từ `LOG` về `0`!"}],complexity:{time:`O(N + M) cho KMP & Hash, O(log N) cho mỗi truy vấn LCA`,space:`O(N log N) cho LCA, O(N) cho KMP/Hash`},codeExamples:[{language:`cpp`,title:`C++ Thuật toán KMP tìm số lần xuất hiện của P trong T (O(N + M))`,basicTitle:`C++ Cơ bản: So khớp trực tiếp bằng 2 vòng lặp for trong main (O(N·M))`,basicCode:`#include <iostream>
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
}`,basicExplanation:`Đặt mẫu P lần lượt tại mọi vị trí i của T rồi kiểm tra từng ký tự, không cần mảng hàm tiền tố KMP.`,code:`#include <iostream>
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
}`,explanation:`Mẹo ghép P + "#" + T giúp tái sử dụng đúng một mảng hàm tiền tố pi để đếm số lần khớp trong O(|T| + |P|).`},{language:`python`,title:`Python KMP Prefix Function`,basicTitle:`Python Cơ bản: Đếm bằng cắt chuỗi T[i:i+m] == P`,basicCode:`T = "ababcabcabababd"
P = "ababd"
ans = 0
for i in range(len(T) - len(P) + 1):
    if T[i:i + len(P)] == P:
        ans += 1
print(ans)`,basicExplanation:`Duyệt qua từng vị trí bắt đầu i và kiểm tra đoạn con dài |P| có bằng P hay không.`,code:`def kmp_count(text: str, pattern: str) -> int:
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

print(kmp_count("ababcabcabababd", "ababd"))`,explanation:`Kỹ thuật ghép ký tự phân tách "#" không xuất hiện trong bảng chữ cái cực kỳ gọn và an toàn.`}],practiceProblem:{id:`CS_P12`,title:`Đếm số lần xuất hiện của xâu mẫu P trong văn bản T (KMP)`,difficulty:`Hard`,description:`Cho hai xâu ký tự không chứa khoảng trắng: văn bản T và xâu mẫu P (1 ≤ |P|, |T| ≤ 10⁵). Hãy đếm xem xâu P xuất hiện bao nhiêu lần (có thể chồng lấp) bên trong T.`,inputFormat:`Dòng 1 là xâu T. Dòng 2 là xâu P.`,outputFormat:`In ra một số nguyên duy nhất là số lần P xuất hiện trong T.`,sampleCases:[{input:`aaaaa
aa`,output:`4`,explanation:`Xâu "aa" xuất hiện tại các vị trí bắt đầu 0, 1, 2, 3 trong "aaaaa" (chồng lấp).`}],solutionAnalysis:`Xây dựng hàm tiền tố trên xâu ghép S = P + "#" + T. Mỗi vị trí i > |P| có pi[i] == |P| tương ứng với một lần xâu P xuất hiện kết thúc tại vị trí đó (O(|T| + |P|)).`,basicAnalysis:`Cơ bản: Duyệt từng vị trí i từ 0 đến |T|-|P| trong main(), kiểm tra từng ký tự của P có khớp liên tiếp với T[i+j] hay không (O(|T|·|P|), dễ đọc không dùng KMP).`,basicSolutionCpp:`#include <iostream>
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
}`,basicSolutionPython:`T = input().strip()
P = input().strip()
ans = 0
for i in range(len(T) - len(P) + 1):
    if T[i:i + len(P)] == P:
        ans += 1
print(ans)`,fullSolutionCpp:`#include <iostream>
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
}`,fullSolutionPython:`import sys

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

solve()`}}],n=[{id:`cs-extra-1`,num:13,title:`Segment Tree với Lazy Propagation (Cập nhật Đoạn)`,topic:`Cây phân đoạn nâng cao`,phase:`Phase 4 · Cấu trúc dữ liệu & HSG`,time:`O((N + Q) log N)`,space:`O(4N)`,theory1:"Lưu giá trị chờ `lazy[id]` trên các nút cha và chỉ đẩy xuống nút con (`push`) khi truy vấn đi qua.",cpp:`void push(int id, int l, int r) {
    if (!lazy[id]) return;
    int mid = (l + r) >> 1;
    st[id << 1] += lazy[id] * (mid - l + 1);
    lazy[id << 1] += lazy[id];
    st[id << 1 | 1] += lazy[id] * (r - mid);
    lazy[id << 1 | 1] += lazy[id];
    lazy[id] = 0;
}`,py:`def push(node, l, r):
    if lazy[node] == 0:
        return
    mid = (l + r) // 2
    st[node * 2] += lazy[node] * (mid - l + 1)
    lazy[node * 2] += lazy[node]
    st[node * 2 + 1] += lazy[node] * (r - mid)
    lazy[node * 2 + 1] += lazy[node]
    lazy[node] = 0`,probTitle:`Cộng đoạn & Tính tổng đoạn [L, R]`,probDesc:"Cho mảng N phần tử (1-indexed) và Q truy vấn: `1 l r v` cộng v vào mọi phần tử thuộc [l, r]; `2 l r` in tổng đoạn [l, r].",inputFormat:"Dòng 1: N, Q. Dòng 2: N số nguyên A[1..N]. Q dòng sau: mỗi dòng `1 l r v` hoặc `2 l r`.",outputFormat:`Với mỗi truy vấn loại 2, in ra tổng đoạn [l, r] trên một dòng.`,sampleCases:[{input:`4 3
10 20 30 40
2 1 4
1 1 2 5
2 1 3`,output:`100
70`,explanation:`Tổng ban đầu [1,4] = 100. Sau khi cộng 5 vào [1,2], mảng thành [15,25,30,40] nên tổng [1,3] = 70.`}],fullCpp:`#include <iostream>
#include <vector>
using namespace std;

int n, q;
vector<long long> a, st, lazy;

void build(int id, int l, int r) {
    if (l == r) { st[id] = a[l]; return; }
    int mid = (l + r) >> 1;
    build(id << 1, l, mid);
    build(id << 1 | 1, mid + 1, r);
    st[id] = st[id << 1] + st[id << 1 | 1];
}

void push(int id, int l, int r) {
    if (!lazy[id]) return;
    int mid = (l + r) >> 1;
    st[id << 1] += lazy[id] * (mid - l + 1);
    lazy[id << 1] += lazy[id];
    st[id << 1 | 1] += lazy[id] * (r - mid);
    lazy[id << 1 | 1] += lazy[id];
    lazy[id] = 0;
}

void update(int id, int l, int r, int u, int v, long long val) {
    if (v < l || r < u) return;
    if (u <= l && r <= v) {
        st[id] += val * (r - l + 1);
        lazy[id] += val;
        return;
    }
    push(id, l, r);
    int mid = (l + r) >> 1;
    update(id << 1, l, mid, u, v, val);
    update(id << 1 | 1, mid + 1, r, u, v, val);
    st[id] = st[id << 1] + st[id << 1 | 1];
}

long long query(int id, int l, int r, int u, int v) {
    if (v < l || r < u) return 0;
    if (u <= l && r <= v) return st[id];
    push(id, l, r);
    int mid = (l + r) >> 1;
    return query(id << 1, l, mid, u, v) + query(id << 1 | 1, mid + 1, r, u, v);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    if (!(cin >> n >> q)) return 0;
    a.assign(n + 1, 0);
    st.assign(4 * n + 5, 0);
    lazy.assign(4 * n + 5, 0);
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, 1, n);
    while (q--) {
        int t, l, r;
        cin >> t >> l >> r;
        if (t == 1) {
            long long v; cin >> v;
            update(1, 1, n, l, r, v);
        } else {
            cout << query(1, 1, n, l, r) << '\\n';
        }
    }
    return 0;
}`,fullPy:`import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    a = [0] + [next(it) for _ in range(n)]
    st = [0] * (4 * n + 5)
    lazy = [0] * (4 * n + 5)

    def build(node, l, r):
        if l == r:
            st[node] = a[l]
            return
        mid = (l + r) // 2
        build(node * 2, l, mid)
        build(node * 2 + 1, mid + 1, r)
        st[node] = st[node * 2] + st[node * 2 + 1]

    def push(node, l, r):
        if lazy[node]:
            mid = (l + r) // 2
            st[node * 2] += lazy[node] * (mid - l + 1)
            lazy[node * 2] += lazy[node]
            st[node * 2 + 1] += lazy[node] * (r - mid)
            lazy[node * 2 + 1] += lazy[node]
            lazy[node] = 0

    def update(node, l, r, u, v, val):
        if v < l or r < u:
            return
        if u <= l and r <= v:
            st[node] += val * (r - l + 1)
            lazy[node] += val
            return
        push(node, l, r)
        mid = (l + r) // 2
        update(node * 2, l, mid, u, v, val)
        update(node * 2 + 1, mid + 1, r, u, v, val)
        st[node] = st[node * 2] + st[node * 2 + 1]

    def query(node, l, r, u, v):
        if v < l or r < u:
            return 0
        if u <= l and r <= v:
            return st[node]
        push(node, l, r)
        mid = (l + r) // 2
        return query(node * 2, l, mid, u, v) + query(node * 2 + 1, mid + 1, r, u, v)

    build(1, 1, n)
    out = []
    for _ in range(q):
        t = next(it)
        l, r = next(it), next(it)
        if t == 1:
            v = next(it)
            update(1, 1, n, l, r, v)
        else:
            out.append(str(query(1, 1, n, l, r)))
    sys.stdout.write("\\n".join(out))

solve()`},{id:`cs-extra-2`,num:14,title:`Cây Fenwick (Binary Indexed Tree) & Đếm Nghịch thế`,topic:`Cấu trúc dữ liệu gọn nhẹ`,phase:`Phase 4 · Cấu trúc dữ liệu & HSG`,time:`O(N log N)`,space:`O(N)`,theory1:"Tận dụng bit 1 thấp nhất `i & (-i)` để cập nhật điểm và tính tổng tiền tố cực nhanh trong 10 dòng code.",cpp:`void add(int idx, long long v) {
    for (; idx <= n; idx += idx & -idx) bit[idx] += v;
}
long long sum(int idx) {
    long long s = 0;
    for (; idx > 0; idx -= idx & -idx) s += bit[idx];
    return s;
}`,py:`def add(idx, val):
    while idx <= n:
        bit[idx] += val
        idx += idx & -idx

def prefix_sum(idx):
    s = 0
    while idx > 0:
        s += bit[idx]
        idx -= idx & -idx
    return s`,probTitle:`Đếm số cặp nghịch thế trong mảng`,probDesc:`Cho hoán vị N phần tử (N ≤ 2·10⁵). Đếm số cặp chỉ số i < j thỏa mãn A[i] > A[j].`,inputFormat:`Dòng 1: số nguyên N. Dòng 2: N số nguyên của mảng A.`,outputFormat:`Một số nguyên duy nhất là số cặp nghịch thế.`,sampleCases:[{input:`4
4 3 2 1`,output:`6`,explanation:`Mọi cặp trong 4 phần tử đều nghịch thế: C(4,2) = 6.`}],fullCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<long long> a(n), vals(n);
    for (int i = 0; i < n; ++i) { cin >> a[i]; vals[i] = a[i]; }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = (int)vals.size();
    vector<long long> bit(m + 1, 0);
    auto add = [&](int idx) {
        for (; idx <= m; idx += idx & -idx) bit[idx]++;
    };
    auto sum = [&](int idx) {
        long long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    };
    long long ans = 0;
    for (int i = 0; i < n; ++i) {
        int id = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin()) + 1;
        ans += sum(m) - sum(id);
        add(id);
    }
    cout << ans << '\\n';
    return 0;
}`,fullPy:`import sys
from bisect import bisect_left

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    vals = sorted(set(a))
    m = len(vals)
    bit = [0] * (m + 1)

    def add(idx):
        while idx <= m:
            bit[idx] += 1
            idx += idx & -idx

    def query(idx):
        s = 0
        while idx > 0:
            s += bit[idx]
            idx -= idx & -idx
        return s

    ans = 0
    for i, x in enumerate(a):
        idx = bisect_left(vals, x) + 1
        ans += i - query(idx)
        add(idx)
    print(ans)

solve()`},{id:`cs-extra-3`,num:15,title:`Thuật toán Tarjan tìm Thành phần Liên thông Mạnh (SCC) & Cầu Khớp`,topic:`Đồ thị DFS chuyên sâu`,phase:`Phase 3 · Quy hoạch động & Đồ thị`,time:`O(V + E)`,space:`O(V + E)`,theory1:"Duy trì thời gian thăm `num[u]` và giá trị `low[u]` — đỉnh thấp nhất chạm tới được từ cây con u.",cpp:`void dfs(int u) {
    num[u] = low[u] = ++timer;
    st.push_back(u);
    for (int v : adj[u]) {
        if (!num[v]) { dfs(v); low[u] = min(low[u], low[v]); }
        else if (!comp[v]) low[u] = min(low[u], num[v]);
    }
    if (low[u] == num[u]) { ++sccCnt; /* pop stack until u */ }
}`,py:`def dfs(u):
    nonlocal timer, scc_cnt
    timer += 1
    num[u] = low[u] = timer
    stack.append(u)
    for v in adj[u]:
        if not num[v]:
            dfs(v)
            low[u] = min(low[u], low[v])
        elif not comp[v]:
            low[u] = min(low[u], num[v])`,probTitle:`Đếm Thành phần liên thông mạnh`,probDesc:`Cho đồ thị có hướng N đỉnh (1..N), M cạnh u -> v. Hãy đếm và in ra số thành phần liên thông mạnh (SCC).`,inputFormat:`Dòng 1: N, M. M dòng tiếp theo, mỗi dòng gồm 2 số u v biểu diễn cạnh có hướng u -> v.`,outputFormat:`Một số nguyên duy nhất là số lượng SCC.`,sampleCases:[{input:`4 4
1 2
2 3
3 1
3 4`,output:`2`,explanation:`Gồm 2 SCC là {1, 2, 3} và {4}.`}],fullCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int timer = 0, sccCnt = 0;
vector<vector<int>> adj;
vector<int> num, low, comp, st;

void dfs(int u) {
    num[u] = low[u] = ++timer;
    st.push_back(u);
    for (int v : adj[u]) {
        if (!num[v]) {
            dfs(v);
            low[u] = min(low[u], low[v]);
        } else if (!comp[v]) {
            low[u] = min(low[u], num[v]);
        }
    }
    if (low[u] == num[u]) {
        ++sccCnt;
        while (true) {
            int w = st.back();
            st.pop_back();
            comp[w] = sccCnt;
            if (w == u) break;
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    adj.assign(n + 1, {});
    num.assign(n + 1, 0);
    low.assign(n + 1, 0);
    comp.assign(n + 1, 0);
    for (int i = 0; i < m; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
    }
    for (int i = 1; i <= n; ++i) if (!num[i]) dfs(i);
    cout << sccCnt << '\\n';
    return 0;
}`,fullPy:`import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, m = next(it), next(it)
    adj = [[] for _ in range(n + 1)]
    for _ in range(m):
        u, v = next(it), next(it)
        adj[u].append(v)

    num = [0] * (n + 1)
    low = [0] * (n + 1)
    comp = [0] * (n + 1)
    st = []
    timer = 0
    scc = 0

    def dfs(u):
        nonlocal timer, scc
        timer += 1
        num[u] = low[u] = timer
        st.append(u)
        for v in adj[u]:
            if not num[v]:
                dfs(v)
                if low[v] < low[u]:
                    low[u] = low[v]
            elif not comp[v]:
                if num[v] < low[u]:
                    low[u] = num[v]
        if low[u] == num[u]:
            scc += 1
            while True:
                w = st.pop()
                comp[w] = scc
                if w == u:
                    break

    for i in range(1, n + 1):
        if not num[i]:
            dfs(i)
    print(scc)

solve()`},{id:`cs-extra-4`,num:16,title:`Lowest Common Ancestor (LCA) bằng Binary Lifting`,topic:`Cây & Nhảy nhị phân`,phase:`Phase 3 · Quy hoạch động & Đồ thị`,time:`O((N + Q) log N)`,space:`O(N log N)`,theory1:"Lưu tổ tiên bậc 2^k của mỗi đỉnh `up[u][k] = up[up[u][k-1]][k-1]` để nhảy lên đồng độ sâu rồi tìm LCA.",cpp:`int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];
    for (int k = 0; k < 20; ++k) if ((diff >> k) & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = 19; k >= 0; --k)
        if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
    return up[u][0];
}`,py:`def lca(u, v):
    if depth[u] < depth[v]:
        u, v = v, u
    diff = depth[u] - depth[v]
    for k in range(20):
        if (diff >> k) & 1:
            u = up[u][k]
    if u == v:
        return u
    for k in range(19, -1, -1):
        if up[u][k] != up[v][k]:
            u, v = up[u][k], up[v][k]
    return up[u][0]`,probTitle:`Khoảng cách giữa 2 đỉnh trên cây`,probDesc:`Cho cây N đỉnh (1..N). Trả lời Q truy vấn tìm độ dài đường đi ngắn nhất (số cạnh) giữa hai đỉnh u và v.`,inputFormat:`Dòng 1: N, Q. N-1 dòng tiếp theo: mỗi dòng chứa u, v là một cạnh cây. Q dòng sau: mỗi dòng chứa u, v.`,outputFormat:`In kết quả từng truy vấn trên một dòng.`,sampleCases:[{input:`5 2
1 2
1 3
2 4
2 5
4 5
3 4`,output:`2
3`,explanation:`4-2-5 có độ dài 2; 3-1-2-4 có độ dài 3.`}],fullCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int LOG = 19;
vector<vector<int>> adj, up;
vector<int> depth;

void dfs(int u, int p) {
    up[u][0] = p;
    for (int k = 1; k < LOG; ++k) up[u][k] = up[up[u][k - 1]][k - 1];
    for (int v : adj[u]) {
        if (v != p) {
            depth[v] = depth[u] + 1;
            dfs(v, u);
        }
    }
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; ++k) if ((diff >> k) & 1) u = up[u][k];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k)
        if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
    return up[u][0];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    adj.assign(n + 1, {});
    up.assign(n + 1, vector<int>(LOG, 1));
    depth.assign(n + 1, 0);
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    dfs(1, 1);
    while (q--) {
        int u, v; cin >> u >> v;
        int w = lca(u, v);
        cout << depth[u] + depth[v] - 2 * depth[w] << '\\n';
    }
    return 0;
}`,fullPy:`import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = next(it), next(it)
        adj[u].append(v)
        adj[v].append(u)
    LOG = 19
    up = [[1] * LOG for _ in range(n + 1)]
    depth = [0] * (n + 1)

    def dfs(u, p):
        up[u][0] = p
        for k in range(1, LOG):
            up[u][k] = up[up[u][k - 1]][k - 1]
        for v in adj[u]:
            if v != p:
                depth[v] = depth[u] + 1
                dfs(v, u)

    def lca(u, v):
        if depth[u] < depth[v]:
            u, v = v, u
        diff = depth[u] - depth[v]
        for k in range(LOG):
            if (diff >> k) & 1:
                u = up[u][k]
        if u == v:
            return u
        for k in range(LOG - 1, -1, -1):
            if up[u][k] != up[v][k]:
                u, v = up[u][k], up[v][k]
        return up[u][0]

    dfs(1, 1)
    out = []
    for _ in range(q):
        u, v = next(it), next(it)
        w = lca(u, v)
        out.append(str(depth[u] + depth[v] - 2 * depth[w]))
    sys.stdout.write("\\n".join(out))

solve()`},{id:`cs-extra-5`,num:17,title:`Trie (Cây tiền tố) & Xử lý Xâu nhị phân XOR lớn nhất`,topic:`Xâu & Thao tác Bit`,phase:`Phase 4 · Cấu trúc dữ liệu & HSG`,time:`O(N · 30)`,space:`O(N · 30)`,theory1:`Dựng cây nhị phân độ sâu 30 bit; với mỗi số x ưu tiên rẽ nhánh bit đối lập (1 - bit) từ MSB xuống LSB.`,cpp:`int maxXor(int x) {
    int cur = 0, ans = 0;
    for (int b = 30; b >= 0; --b) {
        int bit = (x >> b) & 1;
        if (nxt[cur][bit ^ 1]) { ans |= (1 << b); cur = nxt[cur][bit ^ 1]; }
        else cur = nxt[cur][bit];
    }
    return ans;
}`,py:`def max_xor(x):
    cur = ans = 0
    for b in range(30, -1, -1):
        bit = (x >> b) & 1
        if nxt[cur][bit ^ 1]:
            ans |= (1 << b)
            cur = nxt[cur][bit ^ 1]
        else:
            cur = nxt[cur][bit]
    return ans`,probTitle:`Cặp số có XOR cực đại`,probDesc:`Cho mảng N số nguyên không âm. Tìm giá trị lớn nhất của (A[i] XOR A[j]) với i ≠ j.`,inputFormat:`Dòng 1: số nguyên N (N ≥ 2). Dòng 2: N số nguyên A[1..N].`,outputFormat:`Một số nguyên duy nhất là giá trị XOR cực đại.`,sampleCases:[{input:`4
3 10 5 25`,output:`28`,explanation:`5 XOR 25 = 00101 XOR 11001 = 11100 = 28.`}],fullCpp:`#include <iostream>
#include <vector>
#include <array>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    vector<array<int, 2>> nxt(1, {0, 0});
    auto insert = [&](int x) {
        int cur = 0;
        for (int b = 30; b >= 0; --b) {
            int bit = (x >> b) & 1;
            if (!nxt[cur][bit]) {
                nxt[cur][bit] = (int)nxt.size();
                nxt.push_back({0, 0});
            }
            cur = nxt[cur][bit];
        }
    };
    auto maxXor = [&](int x) {
        int cur = 0, ans = 0;
        for (int b = 30; b >= 0; --b) {
            int bit = (x >> b) & 1;
            if (nxt[cur][bit ^ 1]) {
                ans |= (1 << b);
                cur = nxt[cur][bit ^ 1];
            } else {
                cur = nxt[cur][bit];
            }
        }
        return ans;
    };
    insert(a[0]);
    int ans = 0;
    for (int i = 1; i < n; ++i) {
        ans = max(ans, maxXor(a[i]));
        insert(a[i]);
    }
    cout << ans << '\\n';
    return 0;
}`,fullPy:`import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = list(map(int, data[1:1 + n]))
    nxt = [[0, 0]]

    def insert(x):
        cur = 0
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if not nxt[cur][bit]:
                nxt[cur][bit] = len(nxt)
                nxt.append([0, 0])
            cur = nxt[cur][bit]

    def max_xor(x):
        cur = ans = 0
        for b in range(30, -1, -1):
            bit = (x >> b) & 1
            if nxt[cur][bit ^ 1]:
                ans |= (1 << b)
                cur = nxt[cur][bit ^ 1]
            else:
                cur = nxt[cur][bit]
        return ans

    insert(a[0])
    ans = 0
    for x in a[1:]:
        ans = max(ans, max_xor(x))
        insert(x)
    print(ans)

solve()`},{id:`cs-extra-6`,num:18,title:`Luồng Cực Đại trên Mạng (Dinic Max Flow)`,topic:`Đồ thị Luồng`,phase:`Phase 4 · Cấu trúc dữ liệu & HSG`,time:`O(E √V) trên mạng đơn vị`,space:`O(V + E)`,theory1:`Kết hợp BFS dựng đồ thị phân tầng (Level Graph) và DFS đẩy Blocking Flow với tối ưu current-arc.`,cpp:`bool bfs() {
    fill(lvl.begin(), lvl.end(), -1);
    queue<int> q; q.push(S); lvl[S] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto &e : g[u]) if (e.cap > e.flow && lvl[e.v] == -1) {
            lvl[e.v] = lvl[u] + 1; q.push(e.v);
        }
    }
    return lvl[T] != -1;
}`,py:`from collections import deque
def bfs():
    lvl = [-1] * n
    lvl[S] = 0
    q = deque([S])
    while q:
        u = q.popleft()
        for v, cap, flow in g[u]:
            if cap > flow and lvl[v] == -1:
                lvl[v] = lvl[u] + 1
                q.append(v)
    return lvl[T] != -1`,probTitle:`Cặp ghép cực đại hai phía`,probDesc:`Có N công nhân (1..N) và M công việc (1..M), cùng K cặp (u, v) cho biết công nhân u làm được việc v. Mỗi người nhận tối đa 1 việc và ngược lại. Tìm số cặp ghép lớn nhất.`,inputFormat:`Dòng 1: N, M, K. K dòng sau: mỗi dòng gồm u (1..N) và v (1..M).`,outputFormat:`Một số nguyên duy nhất là số cặp ghép tối đa.`,sampleCases:[{input:`3 3 4
1 1
1 2
2 2
3 3`,output:`3`,explanation:`Ghép (1,1), (2,2), (3,3) được 3 cặp.`}],fullCpp:`#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

struct Edge { int v, cap, flow, rev; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, k;
    if (!(cin >> n >> m >> k)) return 0;
    int S = 0, T = n + m + 1, V = T + 1;
    vector<vector<Edge>> g(V);
    auto addEdge = [&](int u, int v, int c) {
        g[u].push_back({v, c, 0, (int)g[v].size()});
        g[v].push_back({u, 0, 0, (int)g[u].size() - 1});
    };
    for (int i = 1; i <= n; ++i) addEdge(S, i, 1);
    for (int j = 1; j <= m; ++j) addEdge(n + j, T, 1);
    for (int i = 0; i < k; ++i) {
        int u, v; cin >> u >> v;
        addEdge(u, n + v, 1);
    }
    vector<int> lvl(V), ptr(V);
    auto bfs = [&]() {
        fill(lvl.begin(), lvl.end(), -1);
        queue<int> q; q.push(S); lvl[S] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (auto &e : g[u]) {
                if (e.cap > e.flow && lvl[e.v] == -1) {
                    lvl[e.v] = lvl[u] + 1;
                    q.push(e.v);
                }
            }
        }
        return lvl[T] != -1;
    };
    auto dfs = [&](auto& self, int u, int pushed) -> int {
        if (!pushed || u == T) return pushed;
        for (int &cid = ptr[u]; cid < (int)g[u].size(); ++cid) {
            auto &e = g[u][cid];
            if (lvl[u] + 1 != lvl[e.v] || e.cap == e.flow) continue;
            int tr = self(self, e.v, min(pushed, e.cap - e.flow));
            if (tr > 0) {
                e.flow += tr;
                g[e.v][e.rev].flow -= tr;
                return tr;
            }
        }
        return 0;
    };
    int flow = 0;
    while (bfs()) {
        fill(ptr.begin(), ptr.end(), 0);
        while (int pushed = dfs(dfs, S, 1e9)) flow += pushed;
    }
    cout << flow << '\\n';
    return 0;
}`,fullPy:`import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, m, k = next(it), next(it), next(it)
    S, T = 0, n + m + 1
    V = T + 1
    g = [[] for _ in range(V)]

    def add_edge(u, v, cap):
        g[u].append([v, cap, len(g[v])])
        g[v].append([u, 0, len(g[u]) - 1])

    for i in range(1, n + 1):
        add_edge(S, i, 1)
    for j in range(1, m + 1):
        add_edge(n + j, T, 1)
    for _ in range(k):
        u, v = next(it), next(it)
        add_edge(u, n + v, 1)

    flow = 0
    while True:
        lvl = [-1] * V
        lvl[S] = 0
        q = deque([S])
        while q:
            u = q.popleft()
            for v, cap, _ in g[u]:
                if cap > 0 and lvl[v] == -1:
                    lvl[v] = lvl[u] + 1
                    q.append(v)
        if lvl[T] == -1:
            break
        ptr = [0] * V

        def dfs(u, pushed):
            if u == T or pushed == 0:
                return pushed
            while ptr[u] < len(g[u]):
                v, cap, rev = g[u][ptr[u]]
                if lvl[v] == lvl[u] + 1 and cap > 0:
                    tr = dfs(v, min(pushed, cap))
                    if tr > 0:
                        g[u][ptr[u]][1] -= tr
                        g[v][rev][1] += tr
                        return tr
                ptr[u] += 1
            return 0

        while True:
            pushed = dfs(S, 10**9)
            if pushed == 0:
                break
            flow += pushed
    print(flow)

solve()`},{id:`cs-extra-7`,num:19,title:`Nhân Ma Trận Tối Ưu Truy Hồi Tuyến Tính`,topic:`Toán rời rạc & Quy hoạch động`,phase:`Phase 2 · Kỹ thuật tối ưu kinh điển`,time:`O(K³ log N)`,space:`O(K²)`,theory1:`Biểu diễn công thức truy hồi bậc K thành phép nhân ma trận chuyển trạng thái lũy thừa bậc N.`,cpp:`Matrix power(Matrix A, long long p) {
    Matrix res = Matrix::identity();
    while (p > 0) {
        if (p & 1) res = res * A;
        A = A * A;
        p >>= 1;
    }
    return res;
}`,py:`def mat_pow(A, p, mod):
    k = len(A)
    res = [[1 if i == j else 0 for j in range(k)] for i in range(k)]
    while p:
        if p & 1:
            res = mat_mul(res, A, mod)
        A = mat_mul(A, A, mod)
        p >>= 1
    return res`,probTitle:`Số Fibonacci thứ N với N ≤ 10^18`,probDesc:`Cho số nguyên N (0 ≤ N ≤ 10¹⁸), biết F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2). Tính F(N) mod (10⁹ + 7).`,inputFormat:`Một dòng duy nhất chứa số nguyên N.`,outputFormat:`In ra F(N) mod 1000000007.`,sampleCases:[{input:`10`,output:`55`,explanation:`Dãy Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55.`}],fullCpp:`#include <iostream>
#include <array>
using namespace std;

const long long MOD = 1000000007LL;
using Mat = array<array<long long, 2>, 2>;

Mat mul(const Mat& A, const Mat& B) {
    Mat C = {{{0, 0}, {0, 0}}};
    for (int i = 0; i < 2; ++i)
        for (int k = 0; k < 2; ++k)
            for (int j = 0; j < 2; ++j)
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
    return C;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    if (!(cin >> n)) return 0;
    Mat res = {{{1, 0}, {0, 1}}};
    Mat base = {{{1, 1}, {1, 0}}};
    while (n > 0) {
        if (n & 1LL) res = mul(res, base);
        base = mul(base, base);
        n >>= 1LL;
    }
    cout << res[0][1] << '\\n';
    return 0;
}`,fullPy:`import sys

def solve():
    raw = sys.stdin.read().strip()
    if not raw:
        return
    n = int(raw.split()[0])
    MOD = 10**9 + 7

    def mat_mul(A, B):
        return [
            [(A[0][0] * B[0][0] + A[0][1] * B[1][0]) % MOD,
             (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % MOD],
            [(A[1][0] * B[0][0] + A[1][1] * B[1][0]) % MOD,
             (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % MOD],
        ]

    res = [[1, 0], [0, 1]]
    base = [[1, 1], [1, 0]]
    while n > 0:
        if n & 1:
            res = mat_mul(res, base)
        base = mat_mul(base, base)
        n >>= 1
    print(res[0][1])

solve()`},{id:`cs-extra-8`,num:20,title:`Quy Hoạch Động Bitmask (Bitmask DP)`,topic:`Quy hoạch động trạng thái tập hợp`,phase:`Phase 3 · Quy hoạch động & Đồ thị`,time:`O(N² · 2^N)`,space:`O(N · 2^N)`,theory1:"Mã hóa tập con các đỉnh đã đi qua bằng số nguyên N bit `mask`, chuyển trạng thái qua toán tử bit.",cpp:`for (int mask = 1; mask < (1 << n); ++mask)
    for (int u = 0; u < n; ++u) if (mask >> u & 1)
        for (int v = 0; v < n; ++v) if (!(mask >> v & 1))
            dp[mask | (1 << v)][v] = min(dp[mask | (1 << v)][v], dp[mask][u] + dist[u][v]);`,py:`for mask in range(1, 1 << n):
    for u in range(n):
        if (mask >> u) & 1:
            for v in range(n):
                if not ((mask >> v) & 1):
                    nxt = mask | (1 << v)
                    dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + dist[u][v])`,probTitle:`Bài toán Người du lịch (TSP)`,probDesc:`Cho ma trận chi phí đi lại giữa N thành phố (0..N-1, N ≤ 16). Xuất phát từ thành phố 0, đi qua tất cả thành phố đúng một lần rồi quay về 0 với tổng chi phí nhỏ nhất.`,inputFormat:`Dòng 1: số nguyên N. N dòng sau: mỗi dòng N số nguyên C[i][0..N-1].`,outputFormat:`Một số nguyên duy nhất là tổng chi phí hành trình nhỏ nhất.`,sampleCases:[{input:`3
0 1 100
100 0 2
3 100 0`,output:`6`,explanation:`Chu trình tối ưu 0 -> 1 -> 2 -> 0 có chi phí 1 + 2 + 3 = 6.`}],fullCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    vector<vector<long long>> d(n, vector<long long>(n));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j) cin >> d[i][j];
    const long long INF = 1e18;
    vector<vector<long long>> dp(1 << n, vector<long long>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); ++mask) {
        for (int u = 0; u < n; ++u) {
            if (dp[mask][u] == INF) continue;
            for (int v = 0; v < n; ++v) {
                if (!(mask & (1 << v))) {
                    int nxt = mask | (1 << v);
                    dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + d[u][v]);
                }
            }
        }
    }
    long long ans = INF;
    int full = (1 << n) - 1;
    for (int u = 0; u < n; ++u) ans = min(ans, dp[full][u] + d[u][0]);
    cout << ans << '\\n';
    return 0;
}`,fullPy:`import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n = next(it)
    d = [[next(it) for _ in range(n)] for _ in range(n)]
    INF = 10**18
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if dp[mask][u] == INF:
                continue
            for v in range(n):
                if not ((mask >> v) & 1):
                    nxt = mask | (1 << v)
                    val = dp[mask][u] + d[u][v]
                    if val < dp[nxt][v]:
                        dp[nxt][v] = val
    full = (1 << n) - 1
    print(min(dp[full][u] + d[u][0] for u in range(n)))

solve()`},{id:`cs-extra-9`,num:21,title:`Euler Tour on Tree (Trải phẳng cây thành mảng)`,topic:`Cây & Cấu trúc dữ liệu`,phase:`Phase 4 · Cấu trúc dữ liệu & HSG`,time:`O(N + Q log N)`,space:`O(N)`,theory1:"Gán `tin[u]` và `tout[u]` theo thứ tự DFS; mọi đỉnh thuộc cây con gốc u nằm trọn trong đoạn `[tin[u], tout[u]]`.",cpp:`void dfs(int u, int p) {
    tin[u] = ++timer;
    for (int v : adj[u]) if (v != p) dfs(v, u);
    tout[u] = timer;
}`,py:`def dfs(u, p):
    nonlocal timer
    timer += 1
    tin[u] = timer
    for v in adj[u]:
        if v != p:
            dfs(v, u)
    tout[u] = timer`,probTitle:`Tổng giá trị cây con động`,probDesc:"Cho cây N đỉnh (gốc tại 1), mỗi đỉnh có trọng số ban đầu W[i]. Thực hiện Q truy vấn: `1 u x` gán W[u] = x; `2 u` in tổng trọng số cây con gốc u.",inputFormat:"Dòng 1: N, Q. Dòng 2: N trọng số W[1..N]. N-1 dòng tiếp: cạnh u v. Q dòng sau: truy vấn `1 u x` hoặc `2 u`.",outputFormat:`Với mỗi truy vấn loại 2, in ra tổng trọng số cây con gốc u trên một dòng.`,sampleCases:[{input:`5 3
1 2 3 4 5
1 2
1 3
2 4
2 5
2 2
1 4 10
2 1`,output:`11
21`,explanation:`Cây con 2 gồm {2,4,5}: 2+4+5 = 11. Sau khi đổi W[4]=10, tổng cả cây (gốc 1) là 1+2+3+10+5 = 21.`}],fullCpp:`#include <iostream>
#include <vector>
using namespace std;

int n, q, timer = 0;
vector<vector<int>> adj;
vector<int> tin, tout;
vector<long long> w, bit;

void dfs(int u, int p) {
    tin[u] = ++timer;
    for (int v : adj[u]) if (v != p) dfs(v, u);
    tout[u] = timer;
}

void add(int idx, long long delta) {
    for (; idx <= n; idx += idx & -idx) bit[idx] += delta;
}

long long sum(int idx) {
    long long s = 0;
    for (; idx > 0; idx -= idx & -idx) s += bit[idx];
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    if (!(cin >> n >> q)) return 0;
    w.assign(n + 1, 0);
    adj.assign(n + 1, {});
    tin.assign(n + 1, 0);
    tout.assign(n + 1, 0);
    bit.assign(n + 1, 0);
    for (int i = 1; i <= n; ++i) cin >> w[i];
    for (int i = 0; i < n - 1; ++i) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    dfs(1, 0);
    for (int i = 1; i <= n; ++i) add(tin[i], w[i]);
    while (q--) {
        int t; cin >> t;
        if (t == 1) {
            int u; long long x; cin >> u >> x;
            add(tin[u], x - w[u]);
            w[u] = x;
        } else {
            int u; cin >> u;
            cout << sum(tout[u]) - sum(tin[u] - 1) << '\\n';
        }
    }
    return 0;
}`,fullPy:`import sys
sys.setrecursionlimit(200000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    w = [0] + [next(it) for _ in range(n)]
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = next(it), next(it)
        adj[u].append(v)
        adj[v].append(u)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    timer = 0

    def dfs(u, p):
        nonlocal timer
        timer += 1
        tin[u] = timer
        for v in adj[u]:
            if v != p:
                dfs(v, u)
        tout[u] = timer

    dfs(1, 0)
    bit = [0] * (n + 1)

    def add(idx, delta):
        while idx <= n:
            bit[idx] += delta
            idx += idx & -idx

    def pref(idx):
        s = 0
        while idx > 0:
            s += bit[idx]
            idx -= idx & -idx
        return s

    for i in range(1, n + 1):
        add(tin[i], w[i])

    out = []
    for _ in range(q):
        t = next(it)
        if t == 1:
            u, x = next(it), next(it)
            add(tin[u], x - w[u])
            w[u] = x
        else:
            u = next(it)
            out.append(str(pref(tout[u]) - pref(tin[u] - 1)))
    sys.stdout.write("\\n".join(out))

solve()`},{id:`cs-extra-10`,num:22,title:`Thuật toán Mo (Chia căn truy vấn đoạn Offline)`,topic:`Chia căn (Sqrt Decomposition)`,phase:`Phase 4 · Cấu trúc dữ liệu & HSG`,time:`O((N + Q) √N)`,space:`O(N)`,theory1:"Sắp xếp truy vấn [L, R] theo cặp `(L / B, R)` với `B = √N` rồi trượt 2 con trỏ thêm/xóa phần tử.",cpp:`sort(queries.begin(), queries.end(), [&](auto &a, auto &b) {
    int ba = a.l / B, bb = b.l / B;
    return ba != bb ? ba < bb : (ba & 1 ? a.r > b.r : a.r < b.r);
});`,py:`B = max(1, int(n ** 0.5))
queries.sort(key=lambda q: (q[0] // B, -q[1] if (q[0] // B) & 1 else q[1]))`,probTitle:`Đếm số giá trị phân biệt trong [L, R]`,probDesc:`Cho mảng N phần tử (1-indexed) và Q truy vấn [L, R]. Đếm số lượng giá trị khác nhau trong đoạn A[L..R].`,inputFormat:`Dòng 1: N, Q. Dòng 2: N số nguyên A[1..N]. Q dòng sau: mỗi dòng chứa L, R.`,outputFormat:`In kết quả từng truy vấn trên một dòng.`,sampleCases:[{input:`5 3
1 1 2 1 3
1 5
2 4
1 2`,output:`3
2
1`,explanation:`[1..5] có {1,2,3} (3 giá trị); [2..4] có {1,2} (2 giá trị); [1..2] chỉ có {1} (1 giá trị).`}],fullCpp:`#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

struct Query { int l, r, idx; };

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n + 1), vals;
    for (int i = 1; i <= n; ++i) { cin >> a[i]; vals.push_back(a[i]); }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    for (int i = 1; i <= n; ++i)
        a[i] = (int)(lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin());

    vector<Query> qs(q);
    for (int i = 0; i < q; ++i) { cin >> qs[i].l >> qs[i].r; qs[i].idx = i; }
    int B = max(1, (int)sqrt(n));
    sort(qs.begin(), qs.end(), [&](const Query& x, const Query& y) {
        int bx = x.l / B, by = y.l / B;
        if (bx != by) return bx < by;
        return (bx & 1) ? x.r > y.r : x.r < y.r;
    });

    vector<int> cnt(vals.size(), 0), ans(q);
    int distinct = 0, curL = 1, curR = 0;
    auto add = [&](int pos) { if (++cnt[a[pos]] == 1) distinct++; };
    auto rem = [&](int pos) { if (--cnt[a[pos]] == 0) distinct--; };

    for (auto& qr : qs) {
        while (curL > qr.l) add(--curL);
        while (curR < qr.r) add(++curR);
        while (curL < qr.l) rem(curL++);
        while (curR > qr.r) rem(curR--);
        ans[qr.idx] = distinct;
    }
    for (int x : ans) cout << x << '\\n';
    return 0;
}`,fullPy:`import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    it = iter(map(int, data))
    n, q = next(it), next(it)
    a = [0] + [next(it) for _ in range(n)]
    qs = [(next(it), next(it), i) for i in range(q)]
    B = max(1, int(n ** 0.5))
    qs.sort(key=lambda item: (item[0] // B, -item[1] if (item[0] // B) & 1 else item[1]))

    cnt = defaultdict(int)
    distinct = 0
    cur_l, cur_r = 1, 0
    ans = [0] * q

    for l, r, idx in qs:
        while cur_l > l:
            cur_l -= 1
            if cnt[a[cur_l]] == 0:
                distinct += 1
            cnt[a[cur_l]] += 1
        while cur_r < r:
            cur_r += 1
            if cnt[a[cur_r]] == 0:
                distinct += 1
            cnt[a[cur_r]] += 1
        while cur_l < l:
            cnt[a[cur_l]] -= 1
            if cnt[a[cur_l]] == 0:
                distinct -= 1
            cur_l += 1
        while cur_r > r:
            cnt[a[cur_r]] -= 1
            if cnt[a[cur_r]] == 0:
                distinct -= 1
            cur_r -= 1
        ans[idx] = distinct

    sys.stdout.write("\\n".join(map(str, ans)))

solve()`}].map(e=>({id:e.id,level:`Nâng cao / HSG`,vnoiPhase:e.phase,vnoiTag:`VNOI · Chuyên đề HSG`,lessonNumber:e.num,title:e.title,topic:e.topic,estimatedMinutes:25,theory:[e.theory1],complexity:{time:e.time,space:e.space},codeExamples:[{language:`cpp`,title:`C++20 Chuẩn Thi Đấu · ${e.topic}`,code:e.cpp,explanation:e.theory1},{language:`python`,title:`Python 3 · ${e.topic}`,code:e.py,explanation:e.theory1}],practiceProblem:{id:`${e.id}-prob`,title:e.probTitle,difficulty:`Hard`,description:e.probDesc,inputFormat:e.inputFormat,outputFormat:e.outputFormat,sampleCases:e.sampleCases,solutionAnalysis:e.theory1,fullSolutionCpp:e.fullCpp,fullSolutionPython:e.fullPy}})),r=[...[{id:`cs-1`,level:`Cơ bản`,lessonNumber:1,title:`Kiểu dữ liệu, Biến & Kỹ thuật Nhập/Xuất Chuẩn Tối Ưu`,topic:`Cú pháp cơ bản & Fast I/O`,estimatedMinutes:12,theory:["1. Các kiểu dữ liệu nguyên thủy: `int` (-2·10⁹ đến 2·10⁹, 4 bytes), `long long` (-9·10¹⁸ đến 9·10¹⁸, 8 bytes), `double` (số thực dấu phẩy động 64-bit), `char` (1 byte), `bool` (true/false).","2. Hiện tượng tràn số (Integer Overflow): Khi tổng hoặc tích của hai số `int` vượt quá 2·10⁹, kết quả sẽ bị quay vòng thành số âm. Phải ép kiểu sang `long long` bằng cú pháp `1LL * a * b`.","3. Kỹ thuật Fast I/O trong C++: Mặc định `cin`/`cout` đồng bộ với `stdio` của C khiến tốc độ đọc chậm khi N ≥ 10⁵. Luôn thêm 2 dòng vào đầu hàm `main()`: `ios_base::sync_with_stdio(false); cin.tie(NULL);` và dùng `'\\n'` thay cho `endl`."],complexity:{time:`O(1) cho các phép toán số học`,space:`O(1)`},codeExamples:[{language:`cpp`,title:`C++20 Fast I/O & Xử lý Tràn số`,basicTitle:`C++ Cơ bản: Nhập xuất cin/cout trực tiếp trong main`,basicCode:`#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << "Tong: " << a + b << endl;
    cout << "Tich: " << a * b << endl;
    return 0;
}`,basicExplanation:`Phiên bản tối giản chỉ khai báo hai biến long long a, b trong main() và dùng cin/cout cơ bản.`,code:`#include <iostream>
using namespace std;

int main() {
    // Tăng tốc nhập xuất lên gấp 5-10 lần
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    long long a, b;
    if (cin >> a >> b) {
        long long tong = a + b;
        long long tich = a * b; // An toàn không bị tràn số
        cout << "Tong: " << tong << '\\n';
        cout << "Tich: " << tich << '\\n';
    }
    return 0;
}`,explanation:`Khai báo kiểu long long cho a và b giúp phép nhân a * b không bị tràn số khi a, b lên đến 10⁹.`},{language:`python`,title:`Python 3 Nhập xuất tối ưu sys.stdin`,basicTitle:`Python Cơ bản: input().split() tuần tự`,basicCode:`a, b = map(int, input().split())
print("Tong:", a + b)
print("Tich:", a * b)`,basicExplanation:`Cách viết ngắn gọn nhất cho người mới: dùng input().split() và không cần định nghĩa hàm.`,code:`import sys

def main():
    # Đọc nhanh toàn bộ dòng dữ liệu
    input_data = sys.stdin.read().split()
    if input_data:
        a = int(input_data[0])
        b = int(input_data[1])
        print(f"Tong: {a + b}")
        print(f"Tich: {a * b}")

if __name__ == '__main__':
    main()`,explanation:`Python tự động hỗ trợ số nguyên lớn vô hạn (Arbitrary-precision integer) nên không lo tràn số.`}],practiceProblem:{id:`CS_P1`,title:`Tính tổng và tích hai số lớn`,difficulty:`Easy`,description:`Cho hai số nguyên a và b (-10⁹ ≤ a, b ≤ 10⁹). Hãy tính và in ra trên 2 dòng: dòng 1 là tổng a + b, dòng 2 là tích a * b.`,inputFormat:`Một dòng chứa 2 số nguyên a và b cách nhau dấu cách.`,outputFormat:`Dòng 1 in tổng a + b. Dòng 2 in tích a * b.`,sampleCases:[{input:`1000000000 2000000000`,output:`3000000000
2000000000000000000`,explanation:`Tích 10⁹ * 2·10⁹ = 2·10¹⁸ vượt quá giới hạn 2·10⁹ của kiểu int, bắt buộc phải dùng long long trong C++.`}],solutionAnalysis:`Với giới hạn a, b lên tới 10⁹, tổng a+b tối đa 2·10⁹ (vẫn vừa int nhưng sát ngưỡng), còn tích a*b lên tới 10¹⁸ (bắt buộc dùng long long trong C++). Sử dụng phép nhân với kiểu long long để tránh tràn số.`,basicAnalysis:`Cơ bản: Nhập trực tiếp a, b kiểu long long trong hàm main() và in a + b, a * b không cần cấu hình Fast I/O.`,basicSolutionCpp:`#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << endl;
    cout << a * b << endl;
    return 0;
}`,basicSolutionPython:`a, b = map(int, input().split())
print(a + b)
print(a * b)`,fullSolutionCpp:`#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    cin >> a >> b;
    cout << a + b << '\\n';
    cout << a * b << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    line = sys.stdin.read().split()
    if line:
        a = int(line[0])
        b = int(line[1])
        print(a + b)
        print(a * b)

solve()`}},{id:`cs-2`,level:`Cơ bản`,lessonNumber:2,title:`Cấu trúc Rẽ nhánh If-Else & Vòng lặp For/While Tối Ưu`,topic:`Kiểm tra Số nguyên tố O(√N) & Số hoàn hảo`,estimatedMinutes:15,theory:["1. Cấu trúc rẽ nhánh `if - else if - else`: Kiểm tra các trường hợp loại trừ lẫn nhau, toán tử logic `&&` (AND), `||` (OR), `!` (NOT).",`2. Thuật toán kiểm tra số nguyên tố tối ưu $O(\\sqrt{N})$: Một số $N > 1$ là số nguyên tố nếu không chia hết cho bất kỳ số nào từ $2$ đến $\\lfloor\\sqrt{N}\\rfloor$. Vì nếu $N = u \\cdot v$ với $u \\le v$ thì chắc chắn $u \\le \\sqrt{N}$.`,"3. Vòng lặp `while` và `for`: Luôn chú ý điều kiện dừng để tránh vòng lặp vô tận (Infinite Loop). Câu lệnh `break` thoát khỏi vòng lặp ngay lập tức, `continue` bỏ qua lượt lặp hiện tại."],complexity:{time:`O(√N) cho kiểm tra số nguyên tố`,space:`O(1)`},codeExamples:[{language:`cpp`,title:`C++ Kiểm tra Số nguyên tố O(√N) bước nhảy 6k±1`,basicTitle:`C++ Cơ bản: Vòng lặp kiểm tra ước viết thẳng trong main`,basicCode:`#include <iostream>
using namespace std;

int main() {
    long long n = 1000000007;
    bool laNguyenTo = (n >= 2);
    for (long long i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            laNguyenTo = false;
            break;
        }
    }
    if (laNguyenTo) cout << n << " la so nguyen to\\n";
    return 0;
}`,basicExplanation:`Duyệt đơn giản từng ước i từ 2 đến căn N ngay trong main(), không tách hàm phụ.`,code:`#include <iostream>
using namespace std;

bool isPrime(long long n) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    // Bước nhảy 6k ± 1
    for (long long i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }
    return true;
}

int main() {
    long long n = 1000000007; // 10^9 + 7
    if (isPrime(n)) cout << n << " la so nguyen to\\n";
    return 0;
}`,explanation:`Duyệt bước nhảy 6k ± 1 giúp giảm số phép chia đi 3 lần so với duyệt thông thường.`},{language:`python`,title:`Python Hàm is_prime(n) tối ưu 6k±1`,basicTitle:`Python Cơ bản: Vòng lặp while i * i <= n tối giản`,basicCode:`n = 1000000007
la_nt = n >= 2
i = 2
while i * i <= n:
    if n % i == 0:
        la_nt = False
        break
    i += 1
print(la_nt)`,basicExplanation:`Chỉ dùng 1 vòng while đơn giản kiểm tra chia hết từ 2 tới căn N.`,code:`def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

print(is_prime(1000000007)) # True`,explanation:`Tối ưu vòng lặp bằng cách dừng ngay khi i * i > n.`}],practiceProblem:{id:`CS_P2`,title:`Đếm số lượng số nguyên tố trong đoạn`,difficulty:`Easy`,description:`Cho số nguyên dương N (1 ≤ N ≤ 10⁵). Hãy đếm xem có bao nhiêu số nguyên tố nhỏ hơn hoặc bằng N.`,inputFormat:`Một số nguyên dương N duy nhất.`,outputFormat:`In ra số lượng số nguyên tố trong khoảng [2; N].`,sampleCases:[{input:`10`,output:`4`,explanation:`Các số nguyên tố ≤ 10 là: 2, 3, 5, 7. Tổng cộng có 4 số.`}],solutionAnalysis:`Dùng sàng nguyên tố Eratosthenes để đạt độ phức tạp O(N log log N) cực nhanh với N = 10⁵.`,basicAnalysis:`Cơ bản: Duyệt từng số x từ 2 tới N, kiểm tra xem x có chia hết cho số nào từ 2 tới √x hay không và tăng biến đếm (O(N√N), không cần mảng sàng).`,basicSolutionCpp:`#include <iostream>
using namespace std;

int main() {
    int n, dem = 0;
    cin >> n;
    for (int x = 2; x <= n; x++) {
        bool ok = true;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) {
                ok = false;
                break;
            }
        }
        if (ok) dem++;
    }
    cout << dem;
    return 0;
}`,basicSolutionPython:`n = int(input())
dem = 0
for x in range(2, n + 1):
    ok = True
    i = 2
    while i * i <= x:
        if x % i == 0:
            ok = False
            break
        i += 1
    if ok:
        dem += 1
print(dem)`,fullSolutionCpp:`#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p)
                isPrime[i] = false;
        }
    }
    int count = 0;
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) count++;
    }
    cout << count << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def sieve():
    line = sys.stdin.read().split()
    if not line:
        return
    n = int(line[0])
    if n < 2:
        print(0)
        return
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    print(sum(is_prime))

sieve()`}},{id:`cs-3`,level:`Cơ bản`,lessonNumber:3,title:`Mảng 1 Chiều, Đếm Tần Số & Xử lý Chuỗi Ký Tự`,topic:`Kỹ thuật Mảng đếm & Xâu đối xứng Palindrome`,estimatedMinutes:14,theory:["1. Mảng và Vector: `vector<int> a(N)` có thể co giãn linh hoạt, truy cập phần tử `a[i]` trong $O(1)$.","2. Kỹ thuật mảng đếm (Frequency Array / Bucket): Cho dãy số các giá trị nhỏ hơn $10^6$, ta dùng mảng `cnt[x]` để đếm số lần xuất hiện của giá trị $x$ chỉ trong một lần duyệt $O(N)$.","3. Xử lý chuỗi (String): Kiểm tra xâu đối xứng (Palindrome) bằng cách so sánh ký tự đầu $s[i]$ với ký tự cuối $s[len - 1 - i]$. Đảo ngược chuỗi bằng `reverse(s.begin(), s.end())`."],complexity:{time:`O(N) duyệt tuyến tính`,space:`O(max_value) hoặc O(N)`},codeExamples:[{language:`cpp`,title:`C++ Hai con trỏ kiểm tra Palindrome tối ưu`,basicTitle:`C++ Cơ bản: Đảo chuỗi bằng vòng lặp for`,basicCode:`#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "radar", rev = "";
    for (int i = (int)s.size() - 1; i >= 0; i--) {
        rev += s[i];
    }
    cout << (s == rev ? "YES" : "NO") << '\\n';
    return 0;
}`,basicExplanation:`Tạo chuỗi đảo ngược rev bằng vòng for lùi và so sánh trực tiếp s == rev ngay trong main().`,code:`#include <iostream>
#include <string>
#include <vector>
using namespace std;

bool isPalindrome(const string& s) {
    int left = 0, right = (int)s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    string str = "radar";
    cout << (isPalindrome(str) ? "YES" : "NO") << '\\n';
    return 0;
}`,explanation:`Kỹ thuật hai con trỏ so khớp đối xứng từ hai đầu chuỗi tiến về tâm trong O(N) với O(1) bộ nhớ phụ.`},{language:`python`,title:`Python Slicing chuỗi s == s[::-1]`,basicTitle:`Python Cơ bản: Vòng lặp so sánh hai đầu chuỗi`,basicCode:`s = "radar"
ok = True
for i in range(len(s) // 2):
    if s[i] != s[len(s) - 1 - i]:
        ok = False
        break
print("YES" if ok else "NO")`,basicExplanation:`Dùng vòng for duyệt nửa đầu chuỗi, so sánh ký tự thứ i với ký tự đối xứng ở cuối.`,code:`def is_palindrome(s: str) -> bool:
    # Slicing đảo ngược chuỗi cực nhanh
    return s == s[::-1]

print("YES" if is_palindrome("radar") else "NO")`,explanation:`Trong Python, cú pháp s[::-1] đảo ngược chuỗi trong C-level memory speed.`}],practiceProblem:{id:`CS_P3`,title:`Tìm phần tử xuất hiện nhiều nhất trong mảng`,difficulty:`Easy`,description:`Cho mảng gồm N số nguyên dương (1 ≤ N ≤ 10⁵, 1 ≤ a[i] ≤ 10⁵). Hãy tìm số có số lần xuất hiện nhiều nhất. Nếu có nhiều số cùng số lần xuất hiện, in ra số có giá trị nhỏ nhất.`,inputFormat:`Dòng 1 ghi số N. Dòng 2 ghi N số nguyên cách nhau dấu cách.`,outputFormat:`In ra số xuất hiện nhiều nhất và tần số của nó cách nhau dấu cách.`,sampleCases:[{input:`6
2 3 2 4 3 2`,output:`2 3`,explanation:`Số 2 xuất hiện 3 lần (nhiều nhất).`}],solutionAnalysis:`Duyệt mảng một lần cập nhật cnt[a[i]]. Sau đó tìm max_count và phần tử nhỏ nhất đạt max_count trong O(N + maxA).`,basicAnalysis:`Cơ bản: Nhập mảng a[N], với mỗi phần tử a[i] dùng một vòng lặp đếm xem a[i] xuất hiện bao nhiêu lần rồi cập nhật đáp án (O(N²), dễ hiểu không cần mảng đánh dấu).`,basicSolutionCpp:`#include <iostream>
using namespace std;

int a[1005];

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    int bestVal = a[0], bestCnt = 0;
    for (int i = 0; i < n; i++) {
        int dem = 0;
        for (int j = 0; j < n; j++) {
            if (a[j] == a[i]) dem++;
        }
        if (dem > bestCnt || (dem == bestCnt && a[i] < bestVal)) {
            bestCnt = dem;
            bestVal = a[i];
        }
    }
    cout << bestVal << " " << bestCnt;
    return 0;
}`,basicSolutionPython:`n = int(input())
a = list(map(int, input().split()))
best_val = a[0]
best_cnt = 0
for x in a:
    dem = 0
    for y in a:
        if y == x:
            dem += 1
    if dem > best_cnt or (dem == best_cnt and x < best_val):
        best_cnt = dem
        best_val = x
print(best_val, best_cnt)`,fullSolutionCpp:`#include <iostream>
#include <vector>
using namespace std;

const int MAXA = 100005;
int cnt[MAXA];

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    int maxCnt = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        cnt[x]++;
        if (cnt[x] > maxCnt) maxCnt = cnt[x];
    }
    for (int x = 1; x < MAXA; x++) {
        if (cnt[x] == maxCnt) {
            cout << x << " " << maxCnt << '\\n';
            break;
        }
    }
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    cnt = {}
    for i in range(1, n + 1):
        x = int(tokens[i])
        cnt[x] = cnt.get(x, 0) + 1
    max_c = max(cnt.values())
    candidates = [x for x, c in cnt.items() if c == max_c]
    best_x = min(candidates)
    print(best_x, max_c)

solve()`}},{id:`cs-4`,level:`Trung cấp`,lessonNumber:4,title:`Hàm, Đệ Quy & Kỹ thuật Quay lui (Backtracking)`,topic:`Cây đệ quy, Bài toán sinh hoán vị & Xếp Hậu`,estimatedMinutes:18,theory:[`1. Khái niệm đệ quy: Hàm gọi lại chính nó với kích thước bài toán nhỏ hơn. Cấu trúc gồm 2 phần bắt buộc: Điều kiện dừng (Base Case) và Bước đệ quy (Recursive Step).`,`2. Kỹ thuật Quay lui (Backtracking): Thử tất cả các khả năng xây dựng nghiệm từng bước. Khi phát hiện một nhánh không thể dẫn đến lời giải hợp lệ, thuật toán lập tức "quay lui" (hoàn tác trạng thái) để thử nhánh khác.`,"3. Bài toán sinh hoán vị của $N$ phần tử: Dùng mảng đánh dấu `used[i]` để đảm bảo mỗi phần tử chỉ xuất hiện 1 lần. Độ phức tạp thời gian $O(N!)$."],complexity:{time:`O(N!) cho hoán vị, O(2ⁿ) cho tập con`,space:`O(N) ngăn xếp đệ quy`},codeExamples:[{language:`cpp`,title:`C++ Quay lui Sinh Hoán vị`,basicTitle:`C++ Cơ bản: Liệt kê hoán vị N = 3 bằng 3 vòng lặp lồng nhau`,basicCode:`#include <iostream>
using namespace std;

int main() {
    // Ý tưởng gốc trước khi dùng đệ quy: thử tất cả bộ (i, j, k) khác nhau
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            for (int k = 1; k <= 3; k++) {
                if (i != j && j != k && i != k) {
                    cout << i << " " << j << " " << k << '\\n';
                }
            }
        }
    }
    return 0;
}`,basicExplanation:`Viết trực tiếp bằng các vòng lặp for lồng nhau trong main() giúp hiểu bản chất sinh hoán vị trước khi tổng quát thành đệ quy.`,code:`#include <iostream>
#include <vector>
using namespace std;

int n;
vector<int> a;
vector<bool> used;

void backtrack(int k) {
    if (k == n) {
        for (int x : a) cout << x << " ";
        cout << '\\n';
        return;
    }
    for (int i = 1; i <= n; i++) {
        if (!used[i]) {
            used[i] = true;
            a[k] = i;
            backtrack(k + 1);
            used[i] = false; // Hoàn tác trạng thái
        }
    }
}

int main() {
    n = 3;
    a.resize(n);
    used.assign(n + 1, false);
    backtrack(0);
    return 0;
}`,explanation:`Mỗi khi gọi backtrack(k+1) xong, ta gán lại used[i] = false để nhả lại trạng thái cho các nhánh sau.`},{language:`python`,title:`Python Đệ quy Sinh Hoán vị`,basicTitle:`Python Cơ bản: Vòng lặp lồng nhau không dùng đệ quy`,basicCode:`for i in range(1, 4):
    for j in range(1, 4):
        for k in range(1, 4):
            if i != j and j != k and i != k:
                print(i, j, k)`,basicExplanation:`Dùng 3 vòng lặp trực quan cho trường hợp N = 3 trước khi tổng quát hóa bằng quay lui.`,code:`def permute(n: int):
    used = [False] * (n + 1)
    current = []

    def backtrack():
        if len(current) == n:
            print(" ".join(map(str, current)))
            return
        for i in range(1, n + 1):
            if not used[i]:
                used[i] = True
                current.append(i)
                backtrack()
                current.pop()
                used[i] = False

    backtrack()

permute(3)`,explanation:`current.pop() và used[i] = False là thao tác quay lui hoàn tác.`}],practiceProblem:{id:`CS_P4`,title:`Bài toán Xếp N Quân Hậu (N-Queens)`,difficulty:`Medium`,description:`Cho bàn cờ vua kích thước N x N (1 ≤ N ≤ 12). Hãy đếm xem có bao nhiêu cách xếp N quân hậu lên bàn cờ sao cho không có 2 quân hậu nào tấn công lẫn nhau (không cùng hàng, cùng cột, cùng đường chéo).`,inputFormat:`Một số nguyên dương N.`,outputFormat:`In ra số lượng cách xếp hợp lệ.`,sampleCases:[{input:`4`,output:`2`,explanation:`Với bàn cờ 4x4, có đúng 2 cấu hình xếp hậu không ăn nhau.`}],solutionAnalysis:"Duyệt từng hàng r từ 0 đến N-1. Ở mỗi hàng chọn cột c. Dùng các mảng đánh dấu cột `col[c]`, đường chéo chính `diag1[r - c + N]`, đường chéo phụ `diag2[r + c]` để kiểm tra hợp lệ trong O(1).",basicAnalysis:`Cơ bản: Chỉ dùng 1 mảng cot[r] lưu vị trí cột của quân hậu ở hàng r; khi đặt hậu ở hàng r, chạy một vòng for kiểm tra xung đột với các hàng trước đó (dễ đọc, không cần công thức dịch chỉ số đường chéo).`,basicSolutionCpp:`#include <iostream>
using namespace std;

int n, ways = 0;
int cot[20]; // cot[r] là cột đặt quân hậu ở hàng r

void thu(int r) {
    if (r == n) {
        ways++;
        return;
    }
    for (int c = 0; c < n; c++) {
        bool anToan = true;
        for (int i = 0; i < r; i++) {
            int diff = r - i;
            if (cot[i] == c || cot[i] - c == diff || c - cot[i] == diff) {
                anToan = false;
                break;
            }
        }
        if (anToan) {
            cot[r] = c;
            thu(r + 1);
        }
    }
}

int main() {
    cin >> n;
    thu(0);
    cout << ways;
    return 0;
}`,basicSolutionPython:`n = int(input())
cot = [0] * n
ways = 0

def thu(r):
    global ways
    if r == n:
        ways += 1
        return
    for c in range(n):
        ok = True
        for i in range(r):
            if cot[i] == c or abs(cot[i] - c) == r - i:
                ok = False
                break
        if ok:
            cot[r] = c
            thu(r + 1)

thu(0)
print(ways)`,fullSolutionCpp:`#include <iostream>
#include <vector>
using namespace std;

int n, ways = 0;
vector<bool> col, d1, d2;

void solveQueens(int r) {
    if (r == n) {
        ways++;
        return;
    }
    for (int c = 0; c < n; c++) {
        if (!col[c] && !d1[r - c + n] && !d2[r + c]) {
            col[c] = d1[r - c + n] = d2[r + c] = true;
            solveQueens(r + 1);
            col[c] = d1[r - c + n] = d2[r + c] = false;
        }
    }
}

int main() {
    if (cin >> n) {
        col.assign(n, false);
        d1.assign(2 * n, false);
        d2.assign(2 * n, false);
        solveQueens(0);
        cout << ways << '\\n';
    }
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    line = sys.stdin.read().split()
    if not line:
        return
    n = int(line[0])
    cols = [False] * n
    d1 = [False] * (2 * n)
    d2 = [False] * (2 * n)
    ways = 0

    def backtrack(r):
        nonlocal ways
        if r == n:
            ways += 1
            return
        for c in range(n):
            if not cols[c] and not d1[r - c + n] and not d2[r + c]:
                cols[c] = d1[r - c + n] = d2[r + c] = True
                backtrack(r + 1)
                cols[c] = d1[r - c + n] = d2[r + c] = False

    backtrack(0)
    print(ways)

solve()`}},{id:`cs-5`,level:`Trung cấp`,lessonNumber:5,title:`Tìm Kiếm Nhị Phân & Kỹ Thuật Chặt Nhị Phân Kết Quả`,topic:`Binary Search O(log N) & Chặt nhị phân trên tập kết quả`,estimatedMinutes:16,theory:["1. Thuật toán tìm kiếm nhị phân cổ điển: Yêu cầu mảng ĐÃ ĐƯỢC SẮP XẾP. Mỗi bước so sánh phần tử ở giữa `mid = (left + right) / 2` để loại bỏ 50% không gian tìm kiếm. Độ phức tạp $O(\\log N)$.","2. Hàm `lower_bound` và `upper_bound`: Trong C++, `lower_bound(a.begin(), a.end(), x)` trả về vị trí phần tử đầu tiên $\\ge x$.",`3. Kỹ thuật chặt nhị phân kết quả (Binary Search on Answer): Khi bài toán yêu cầu tìm giá trị lớn nhất hoặc nhỏ nhất $X$ thỏa mãn điều kiện $P(X)$, và hàm kiểm tra $P(X)$ có tính đơn điệu (Monotonicity: nếu $X$ thỏa thì mọi giá trị $\\le X$ cũng thỏa), ta có thể chặt nhị phân trực tiếp trên biến $X$!`],complexity:{time:`O(log N) cho tìm kiếm, O(K log(Max - Min)) cho chặt kết quả`,space:`O(1)`},codeExamples:[{language:`cpp`,title:`C++ Tìm kiếm Nhị phân & lower_bound`,basicTitle:`C++ Cơ bản: Tìm vị trí X tuần tự bằng vòng lặp for (O(N))`,basicCode:`#include <iostream>
using namespace std;

int main() {
    int a[6] = {1, 3, 5, 7, 9, 11};
    int x = 7, pos = -1;
    for (int i = 0; i < 6; i++) {
        if (a[i] == x) {
            pos = i;
            break;
        }
    }
    cout << pos << '\\n'; // Index 3
    return 0;
}`,basicExplanation:`Tìm kiếm tuyến tính từng phần tử một ngay trong main() — thuật toán cơ bản trước khi tối ưu sang chia đôi nhị phân.`,code:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int binarySearch(const vector<int>& a, int x) {
    int left = 0, right = (int)a.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Tránh tràn số (left + right)
        if (a[mid] == x) return mid;
        if (a[mid] < x) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Không tìm thấy
}

int main() {
    vector<int> a = {1, 3, 5, 7, 9, 11};
    cout << binarySearch(a, 7) << '\\n'; // Index 3
    return 0;
}`,explanation:`Cách viết mid = left + (right - left) / 2 là chuẩn an toàn tránh tràn số nguyên.`},{language:`python`,title:`Python bisect_left chuẩn thư viện`,basicTitle:`Python Cơ bản: Vòng lặp while left <= right tự cài`,basicCode:`a = [1, 3, 5, 7, 9, 11]
x = 7
l, r = 0, len(a) - 1
ans = -1
while l <= r:
    mid = (l + r) // 2
    if a[mid] == x:
        ans = mid
        break
    elif a[mid] < x:
        l = mid + 1
    else:
        r = mid - 1
print(ans)`,basicExplanation:`Tự viết vòng while nhị phân không dùng module bisect để nắm rõ cách dịch hai biên.`,code:`import bisect

a = [1, 3, 5, 7, 9, 11]
idx = bisect.bisect_left(a, 7)
print(f"Vi tri dau tien >= 7: {idx}")`,explanation:`Module bisect của Python triển khai binary search tối ưu trong C.`}],practiceProblem:{id:`CS_P5`,title:`Chặt nhị phân: Chia mảng thành K đoạn có tổng lớn nhất nhỏ nhất`,difficulty:`Medium`,description:`Cho mảng gồm N số nguyên dương và số nguyên K (1 ≤ K ≤ N ≤ 10⁵). Hãy chia mảng thành K đoạn liên tiếp sao cho tổng của đoạn có tổng lớn nhất là NHỎ NHẤT có thể.`,inputFormat:`Dòng 1: N và K. Dòng 2: N số nguyên dương a[i] (1 ≤ a[i] ≤ 10⁹).`,outputFormat:`In ra giá trị tổng lớn nhất nhỏ nhất tìm được.`,sampleCases:[{input:`5 2
7 2 5 10 8`,output:`18`,explanation:`Chia thành 2 đoạn: [7, 2, 5] (tổng 14) và [10, 8] (tổng 18). Tổng lớn nhất là 18 (tối ưu nhất).`}],solutionAnalysis:`Chặt nhị phân giá trị tổng maxTarget từ max(a) đến sum(a). Với mỗi mid, dùng hàm tham lam đếm số đoạn cần thiết. Nếu số đoạn <= K thì thử giá trị nhỏ hơn.`,basicAnalysis:`Cơ bản: Nhúng thẳng phần kiểm tra chia đoạn vào trong vòng lặp chặt nhị phân ngay trong hàm main(), dùng mảng tĩnh không cần tách hàm phụ hay thư viện <numeric>.`,basicSolutionCpp:`#include <iostream>
using namespace std;

long long a[100005];

int main() {
    int n, k;
    cin >> n >> k;
    long long low = 0, high = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        if (a[i] > low) low = a[i];
        high += a[i];
    }
    long long ans = high;
    while (low <= high) {
        long long mid = (low + high) / 2;
        int doan = 1;
        long long tong = 0;
        for (int i = 0; i < n; i++) {
            if (tong + a[i] > mid) {
                doan++;
                tong = a[i];
            } else {
                tong += a[i];
            }
        }
        if (doan <= k) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    cout << ans;
    return 0;
}`,basicSolutionPython:`n, k = map(int, input().split())
a = list(map(int, input().split()))
low, high = max(a), sum(a)
ans = high
while low <= high:
    mid = (low + high) // 2
    doan = 1
    tong = 0
    for x in a:
        if tong + x > mid:
            doan += 1
            tong = x
        else:
            tong += x
    if doan <= k:
        ans = mid
        high = mid - 1
    else:
        low = mid + 1
print(ans)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>
using namespace std;

bool canDivide(const vector<long long>& a, int k, long long maxCap) {
    int segments = 1;
    long long curSum = 0;
    for (long long x : a) {
        if (x > maxCap) return false;
        if (curSum + x > maxCap) {
            segments++;
            curSum = x;
        } else {
            curSum += x;
        }
    }
    return segments <= k;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, k;
    if (!(cin >> n >> k)) return 0;
    vector<long long> a(n);
    long long low = 0, high = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        low = max(low, a[i]);
        high += a[i];
    }
    long long ans = high;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (canDivide(a, k, mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    cout << ans << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    k = int(tokens[1])
    a = [int(x) for x in tokens[2:2 + n]]

    low = max(a)
    high = sum(a)

    def can_divide(cap):
        segs = 1
        cur = 0
        for x in a:
            if cur + x > cap:
                segs += 1
                cur = x
            else:
                cur += x
        return segs <= k

    ans = high
    while low <= high:
        mid = (low + high) // 2
        if can_divide(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
    print(ans)

solve()`}},{id:`cs-6`,level:`Trung cấp`,lessonNumber:6,title:`Mảng Cộng Dồn (Prefix Sum) & Kỹ thuật Hai Con Trỏ (Two Pointers)`,topic:`Truy vấn Tổng đoạn con O(1) & Cặp số có tổng bằng S`,estimatedMinutes:15,theory:[`1. Mảng tiền tố (Prefix Sum): Cho mảng $a$, mảng cộng dồn $pref[i] = pref[i-1] + a[i]$ (với $pref[0] = 0$). Khi đó tổng các phần tử từ chỉ số $L$ đến $R$ được tính trong $O(1)$: $Sum(L, R) = pref[R] - pref[L-1]$.`,`2. Mảng cộng dồn 2D: Hỗ trợ tính tổng hình chữ nhật con trong ma trận $O(1)$ với công thức: $Sum(r_1, c_1, r_2, c_2) = S[r_2][c_2] - S[r_1-1][c_2] - S[r_2][c_1-1] + S[r_1-1][c_1-1]$.`,"3. Kỹ thuật Hai con trỏ (Two Pointers): Dùng 2 chỉ số `left` và `right` cùng trượt trên mảng để giải các bài toán tìm cặp số có tổng bằng $X$, đoạn con dài nhất có tổng $\\le S$ trong thời gian tuyến tính $O(N)$."],complexity:{time:`O(N) tiền xử lý, O(1) mỗi truy vấn`,space:`O(N)`},codeExamples:[{language:`cpp`,title:`C++ Hai con trỏ tìm cặp có tổng bằng S (O(N))`,basicTitle:`C++ Cơ bản: Hai vòng lặp for kiểm tra mọi cặp (O(N²))`,basicCode:`#include <iostream>
using namespace std;

int main() {
    int a[6] = {1, 2, 4, 7, 11, 15};
    int S = 15;
    bool timThay = false;
    for (int i = 0; i < 6; i++) {
        for (int j = i + 1; j < 6; j++) {
            if (a[i] + a[j] == S) timThay = true;
        }
    }
    cout << (timThay ? "YES" : "NO") << '\\n';
    return 0;
}`,basicExplanation:`Ý tưởng trực giác nhất: duyệt mọi cặp (i, j) bằng 2 vòng lặp for trong main().`,code:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Tìm 2 số có tổng bằng S trong mảng đã sắp xếp
bool hasPairWithSum(vector<int>& a, int S) {
    int left = 0, right = (int)a.size() - 1;
    while (left < right) {
        int curSum = a[left] + a[right];
        if (curSum == S) return true;
        if (curSum < S) left++;
        else right--;
    }
    return false;
}

int main() {
    vector<int> a = {1, 2, 4, 7, 11, 15};
    cout << (hasPairWithSum(a, 15) ? "YES" : "NO") << '\\n';
    return 0;
}`,explanation:`Kỹ thuật hai con trỏ co lại từ hai đầu chỉ tốn O(N) thay vì O(N²) của vòng lặp lồng nhau.`},{language:`python`,title:`Python Prefix Sum itertools.accumulate`,basicTitle:`Python Cơ bản: Tính mảng cộng dồn bằng vòng for đơn giản`,basicCode:`a = [3, 2, 4, 5, 1]
pref = [0] * (len(a) + 1)
for i in range(len(a)):
    pref[i + 1] = pref[i] + a[i]
L, R = 1, 3
print("Tong doan:", pref[R + 1] - pref[L])`,basicExplanation:`Tự cộng dồn từng bước bằng vòng lặp for, không cần import itertools.`,code:`from itertools import accumulate

a = [3, 2, 4, 5, 1]
# pref = [0, 3, 5, 9, 14, 15]
pref = [0] + list(accumulate(a))

# Truy vấn tổng từ index 1 đến 3 (tức a[1] + a[2] + a[3] = 2 + 4 + 5 = 11):
L, R = 1, 3
print("Tong doan:", pref[R + 1] - pref[L])`,explanation:`Hàm itertools.accumulate tạo mảng cộng dồn cực kỳ ngắn gọn.`}],practiceProblem:{id:`CS_P6`,title:`Đoạn con liên tiếp dài nhất có tổng không vượt quá S`,difficulty:`Medium`,description:`Cho mảng gồm N số nguyên dương và số nguyên dương S (1 ≤ N ≤ 10⁵, 1 ≤ a[i] ≤ 10⁹). Hãy tìm độ dài của đoạn con liên tiếp dài nhất có tổng các phần tử không vượt quá S.`,inputFormat:`Dòng 1: N và S. Dòng 2: N số nguyên dương.`,outputFormat:`In ra độ dài lớn nhất của đoạn con thỏa mãn.`,sampleCases:[{input:`5 7
2 1 3 4 5`,output:`3`,explanation:`Đoạn con [2, 1, 3] có độ dài 3 và tổng = 6 ≤ 7.`}],solutionAnalysis:`Dùng cửa sổ trượt (Sliding Window / Two Pointers). Mở rộng con trỏ right, khi tổng > S thì tăng left để thu hẹp. Cập nhật maxLen = max(maxLen, right - left + 1) trong O(N).`,basicAnalysis:`Cơ bản: Thử mọi điểm đầu i và kéo dài điểm cuối j khi tổng đoạn [i..j] <= S để tìm độ dài lớn nhất (2 vòng lặp for O(N²), dễ cài với test vừa).`,basicSolutionCpp:`#include <iostream>
using namespace std;

long long a[1005];

int main() {
    int n;
    long long S;
    cin >> n >> S;
    for (int i = 0; i < n; i++) cin >> a[i];
    int maxLen = 0;
    for (int i = 0; i < n; i++) {
        long long tong = 0;
        for (int j = i; j < n; j++) {
            tong += a[j];
            if (tong <= S) {
                if (j - i + 1 > maxLen) maxLen = j - i + 1;
            } else {
                break;
            }
        }
    }
    cout << maxLen;
    return 0;
}`,basicSolutionPython:`n, S = map(int, input().split())
a = list(map(int, input().split()))
max_len = 0
for i in range(n):
    tong = 0
    for j in range(i, n):
        tong += a[j]
        if tong <= S:
            if j - i + 1 > max_len:
                max_len = j - i + 1
        else:
            break
print(max_len)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    long long S;
    if (!(cin >> n >> S)) return 0;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    int left = 0, maxLen = 0;
    long long curSum = 0;
    for (int right = 0; right < n; right++) {
        curSum += a[right];
        while (curSum > S && left <= right) {
            curSum -= a[left];
            left++;
        }
        if (curSum <= S) {
            maxLen = max(maxLen, right - left + 1);
        }
    }
    cout << maxLen << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    S = int(tokens[1])
    a = [int(x) for x in tokens[2:2 + n]]

    left = 0
    cur_sum = 0
    max_len = 0
    for right in range(n):
        cur_sum += a[right]
        while cur_sum > S and left <= right:
            cur_sum -= a[left]
            left += 1
        if cur_sum <= S:
            max_len = max(max_len, right - left + 1)
    print(max_len)

solve()`}},{id:`cs-7`,level:`Nâng cao / HSG`,lessonNumber:7,title:`Quy Hoạch Động Kinh Điển: Cái Túi (Knapsack) & LIS`,topic:`Dynamic Programming - Bài toán con gối nhau & Tối ưu bảng phương án`,estimatedMinutes:20,theory:[`1. Bản chất của Quy hoạch động: Giải quyết bài toán có cấu trúc con tối ưu (Optimal Substructure) và các bài toán con gối nhau (Overlapping Subproblems) bằng cách lưu trữ kết quả để không tính lại.`,"2. Bài toán Cái túi 0/1 (0-1 Knapsack): Có $N$ đồ vật với trọng lượng $w_i$ và giá trị $v_i$, cái túi chịu tải $W$. Gọi `dp[j]` là giá trị lớn nhất khi túi có sức chứa $j$. Công thức truy hồi duyệt ngược từ $W$ về $w_i$: `dp[j] = max(dp[j], dp[j - w[i]] + v[i])`. Độ phức tạp $O(N \\cdot W)$.","3. Dãy con tăng dài nhất (LIS): Tìm dãy con có các phần tử tăng dần có độ dài lớn nhất. Dùng mảng `dp` kết hợp tìm kiếm nhị phân `lower_bound` để đạt độ phức tạp tối ưu $O(N \\log N)$."],complexity:{time:`O(N·W) cho Knapsack, O(N log N) cho LIS`,space:`O(W) tối ưu mảng 1D`},codeExamples:[{language:`cpp`,title:`C++ Bài toán Cái túi 0/1 tối ưu mảng 1D (DP Nâng cao)`,basicTitle:`C++ Cơ bản: Bảng phương án 2 chiều trong main (dễ hình dung)`,basicCode:`#include <iostream>
using namespace std;

int main() {
    int W = 10, n = 4;
    int w[4] = {2, 3, 5, 7}, v[4] = {1, 5, 2, 4};
    int dp[5][11] = {0};
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= w[i - 1] && dp[i - 1][j - w[i - 1]] + v[i - 1] > dp[i][j]) {
                dp[i][j] = dp[i - 1][j - w[i - 1]] + v[i - 1];
            }
        }
    }
    cout << "Max value: " << dp[n][W] << '\\n';
    return 0;
}`,basicExplanation:`Dùng bảng 2 chiều dp[i][j] trong main(): chọn hoặc không chọn đồ vật thứ i, không cần nhớ quy tắc duyệt ngược.`,code:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int knapsack(int W, const vector<int>& w, const vector<int>& v) {
    int n = w.size();
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++) {
        // Duyệt ngược để mỗi vật chỉ được chọn 1 lần
        for (int j = W; j >= w[i]; j--) {
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
        }
    }
    return dp[W];
}

int main() {
    int W = 10;
    vector<int> w = {2, 3, 5, 7};
    vector<int> v = {1, 5, 2, 4};
    cout << "Max value: " << knapsack(W, w, v) << '\\n';
    return 0;
}`,explanation:`Duyệt ngược j từ W về w[i] đảm bảo không sử dụng trạng thái mới tính ở cùng lượt i (tránh biến thành bài toán balo không giới hạn).`},{language:`python`,title:`Python Knapsack 1D Array (DP tối ưu)`,basicTitle:`Python Cơ bản: Bảng DP 2 chiều trực quan`,basicCode:`W = 10
w = [2, 3, 5, 7]
v = [1, 5, 2, 4]
n = len(w)
dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(W + 1):
        dp[i][j] = dp[i - 1][j]
        if j >= w[i - 1]:
            dp[i][j] = max(dp[i][j], dp[i - 1][j - w[i - 1]] + v[i - 1])
print("Max value:", dp[n][W])`,basicExplanation:`Bảng 2 chiều dp[i][j] tương ứng xét i đồ vật đầu tiên với sức chứa j.`,code:`def knapsack(W: int, weights: list, values: list) -> int:
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for j in range(W, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
    return dp[W]

print("Max value:", knapsack(10, [2, 3, 5, 7], [1, 5, 2, 4]))`,explanation:`Duyệt mảng 1 chiều tiết kiệm bộ nhớ từ O(N·W) xuống chỉ còn O(W).`}],practiceProblem:{id:`CS_P7`,title:`Dãy con tăng dài nhất O(N log N) (LIS)`,difficulty:`Hard`,description:`Cho mảng số nguyên A gồm N phần tử (1 ≤ N ≤ 10⁵, -10⁹ ≤ A[i] ≤ 10⁹). Hãy tìm độ dài của dãy con tăng thực sự dài nhất.`,inputFormat:`Dòng 1: Số nguyên N. Dòng 2: N số nguyên A[i].`,outputFormat:`In ra độ dài lớn nhất của dãy con tăng.`,sampleCases:[{input:`6
1 2 5 3 4 7`,output:`5`,explanation:`Dãy con tăng dài nhất là [1, 2, 3, 4, 7] có độ dài 5.`}],solutionAnalysis:`Dùng mảng tails[len] lưu phần tử kết thúc nhỏ nhất của dãy con tăng độ dài len. Với mỗi x trong A, dùng lower_bound tìm vị trí đầu tiên >= x để thay thế, đạt O(N log N).`,basicAnalysis:`Cơ bản: Quy hoạch động cổ điển O(N²) trong main(): f[i] là độ dài dãy con tăng kết thúc tại i, duyệt mọi j < i có a[j] < a[i] để cập nhật f[i] = max(f[i], f[j] + 1).`,basicSolutionCpp:`#include <iostream>
using namespace std;

int a[2005], f[2005];

int main() {
    int n, ans = 0;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        f[i] = 1;
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i] && f[j] + 1 > f[i]) {
                f[i] = f[j] + 1;
            }
        }
        if (f[i] > ans) ans = f[i];
    }
    cout << ans;
    return 0;
}`,basicSolutionPython:`n = int(input())
a = list(map(int, input().split()))
f = [1] * n
for i in range(n):
    for j in range(i):
        if a[j] < a[i] and f[j] + 1 > f[i]:
            f[i] = f[j] + 1
print(max(f) if n > 0 else 0)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    vector<int> tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }
    cout << tails.size() << '\\n';
    return 0;
}`,fullSolutionPython:`import sys
import bisect

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    a = [int(x) for x in tokens[1:1 + n]]

    tails = []
    for x in a:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    print(len(tails))

solve()`}},{id:`cs-8`,level:`Nâng cao / HSG`,lessonNumber:8,title:`Lý thuyết Đồ thị: Duyệt DFS/BFS & Thuật toán Dijkstra`,topic:`Biểu diễn Danh sách kề, Đếm thành phần liên thông & Tìm đường đi ngắn nhất`,estimatedMinutes:22,theory:["1. Biểu diễn đồ thị: Danh sách kề `vector<int> adj[N]` hoặc `vector<pair<int, int>> adj[N]` cho đồ thị có trọng số.",`2. Duyệt theo chiều sâu (DFS): Dùng ngăn xếp đệ quy, thăm đỉnh sâu nhất có thể trước khi quay lui. Ứng dụng đếm số thành phần liên thông, kiểm tra chu trình.`,"3. Duyệt theo chiều rộng (BFS): Dùng hàng đợi `queue`, thăm các đỉnh theo từng lớp khoảng cách. Ứng dụng tìm đường đi ngắn nhất trên đồ thị không có trọng số.","4. Thuật toán Dijkstra: Tìm đường đi ngắn nhất từ 1 nguồn trên đồ thị có trọng số KHÔNG ÂM. Sử dụng hàng đợi ưu tiên `priority_queue<pair<long long, int>, vector<...>, greater<...>>` để đạt độ phức tạp tối ưu $O((V + E) \\log V)$."],complexity:{time:`O(V + E) cho DFS/BFS; O((V + E) log V) cho Dijkstra`,space:`O(V + E)`},codeExamples:[{language:`cpp`,title:`C++ Thuật toán Dijkstra với priority_queue`,basicTitle:`C++ Cơ bản: Dijkstra cổ điển không dùng priority_queue (mảng tĩnh O(V²))`,basicCode:`#include <iostream>
using namespace std;

const long long INF = 1e18;
long long c[505][505], distArr[505];
bool daChon[505];

int main() {
    int n = 3; // Ví dụ ma trận trọng số 3 đỉnh
    for (int i = 1; i <= n; i++) {
        distArr[i] = INF;
        for (int j = 1; j <= n; j++) c[i][j] = (i == j ? 0 : INF);
    }
    c[1][2] = 4; c[1][3] = 2; c[3][2] = 1;
    distArr[1] = 0;
    for (int step = 1; step <= n; step++) {
        int u = -1;
        for (int i = 1; i <= n; i++) {
            if (!daChon[i] && (u == -1 || distArr[i] < distArr[u])) u = i;
        }
        if (u == -1 || distArr[u] == INF) break;
        daChon[u] = true;
        for (int v = 1; v <= n; v++) {
            if (distArr[u] + c[u][v] < distArr[v]) distArr[v] = distArr[u] + c[u][v];
        }
    }
    for (int i = 1; i <= n; i++) cout << distArr[i] << " ";
    return 0;
}`,basicExplanation:`Phiên bản Dijkstra nguyên thủy chỉ dùng mảng 2 chiều & vòng lặp tìm đỉnh nhỏ nhất trong main(), không cần priority_queue hay pair.`,code:`#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const long long INF = 1e18;

vector<long long> dijkstra(int n, int start, const vector<vector<pair<int, int>>>& adj) {
    vector<long long> dist(n + 1, INF);
    // Hàng đợi ưu tiên lưu {khoảng cách, đỉnh} (nhỏ nhất ở trên)
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,explanation:`Điều kiện if (d > dist[u]) continue giúp bỏ qua các đỉnh đã được cập nhật đường đi ngắn hơn trước đó.`},{language:`python`,title:`Python Dijkstra heapq`,basicTitle:`Python Cơ bản: Tìm đỉnh nhỏ nhất bằng vòng lặp đơn giản`,basicCode:`INF = 10**18
n = 3
adj = {1: [(2, 4), (3, 2)], 2: [], 3: [(2, 1)]}
dist = [INF] * (n + 1)
visited = [False] * (n + 1)
dist[1] = 0

for _ in range(n):
    u = -1
    for i in range(1, n + 1):
        if not visited[i] and (u == -1 or dist[i] < dist[u]):
            u = i
    if u == -1 or dist[u] == INF:
        break
    visited[u] = True
    for v, w in adj[u]:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
print(dist[1:])`,basicExplanation:`Không cần thư viện heapq: chỉ chọn đỉnh chưa thăm có dist nhỏ nhất rồi nới lỏng các cạnh kề.`,code:`import heapq

def dijkstra(n: int, start: int, adj: list) -> list:
    INF = float('inf')
    dist = [INF] * (n + 1)
    dist[start] = 0
    pq = [(0, start)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,explanation:`heapq của Python hỗ trợ min-heap hiệu quả cho thuật toán Dijkstra.`}],practiceProblem:{id:`CS_P8`,title:`Đường đi ngắn nhất trên đồ thị có trọng số`,difficulty:`Hard`,description:`Cho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (1 ≤ N ≤ 10⁵, 1 ≤ M ≤ 2·10⁵, 0 ≤ w ≤ 10⁹). Hãy tìm khoảng cách ngắn nhất từ đỉnh 1 đến tất cả các đỉnh còn lại.`,inputFormat:`Dòng 1: N và M. M dòng tiếp theo, mỗi dòng gồm 3 số u, v, w mô tả cạnh từ u đến v có trọng số w.`,outputFormat:`In ra khoảng cách từ đỉnh 1 đến các đỉnh từ 1 đến N (nếu không đến được in -1).`,sampleCases:[{input:`3 3
1 2 4
1 3 2
3 2 1`,output:`0 3 2`,explanation:`Đường đi ngắn nhất từ 1 đến 2 là 1 -> 3 -> 2 với tổng trọng số 2 + 1 = 3.`}],solutionAnalysis:`Áp dụng thuật toán Dijkstra với priority_queue. Khởi tạo dist[1] = 0, các đỉnh khác INF, đạt O((V+E) log V).`,basicAnalysis:`Cơ bản: Thuật toán Bellman-Ford / nới lỏng đơn giản trên danh sách M cạnh viết trong main() (hoặc Dijkstra mảng O(N²)): không cần priority_queue hay struct phức tạp.`,basicSolutionCpp:`#include <iostream>
using namespace std;

const long long INF = 1e18;
int u[5005], v[5005];
long long w[5005], distArr[1005];

int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) cin >> u[i] >> v[i] >> w[i];
    for (int i = 1; i <= n; i++) distArr[i] = INF;
    distArr[1] = 0;
    for (int step = 1; step < n; step++) {
        for (int i = 0; i < m; i++) {
            if (distArr[u[i]] != INF && distArr[u[i]] + w[i] < distArr[v[i]]) {
                distArr[v[i]] = distArr[u[i]] + w[i];
            }
        }
    }
    for (int i = 1; i <= n; i++) {
        cout << (distArr[i] == INF ? -1 : distArr[i]) << " ";
    }
    return 0;
}`,basicSolutionPython:`n, m = map(int, input().split())
edges = []
for _ in range(m):
    a, b, c = map(int, input().split())
    edges.append((a, b, c))
INF = 10**18
dist = [INF] * (n + 1)
dist[1] = 0
for _ in range(n - 1):
    for a, b, c in edges:
        if dist[a] != INF and dist[a] + c < dist[b]:
            dist[b] = dist[a] + c
print(*[d if d != INF else -1 for d in dist[1:]])`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <queue>
using namespace std;

const long long INF = 1e18;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, int>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        adj[u].push_back({v, w});
    }

    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> pq;
    dist[1] = 0;
    pq.push({0, 1});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : adj[u]) {
            int v = edge.first;
            int w = edge.second;
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }

    for (int i = 1; i <= n; i++) {
        if (dist[i] == INF) cout << -1 << " ";
        else cout << dist[i] << " ";
    }
    cout << '\\n';
    return 0;
}`,fullSolutionPython:`import sys
import heapq

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    m = int(tokens[1])
    adj = [[] for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        u = int(tokens[idx])
        v = int(tokens[idx + 1])
        w = int(tokens[idx + 2])
        adj[u].append((v, w))
        idx += 3

    INF = 10**18
    dist = [INF] * (n + 1)
    dist[1] = 0
    pq = [(0, 1)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))

    res = []
    for i in range(1, n + 1):
        res.append(str(dist[i] if dist[i] != INF else -1))
    print(" ".join(res))

solve()`}},{id:`cs-9`,level:`Nâng cao / HSG`,lessonNumber:9,title:`Cấu trúc Dữ liệu Nâng cao: Cây Phân Đoạn (Segment Tree) & DSU`,topic:`Quản lý Truy vấn Đoạn O(log N) & Hợp nhất Tập hợp Rời rạc`,estimatedMinutes:24,theory:["1. Cây Phân Đoạn (Segment Tree): Là cây nhị phân hoàn chỉnh quản lý các đoạn con. Hỗ trợ 2 thao tác: (1) Cập nhật giá trị tại 1 vị trí `update(pos, val)`; (2) Tính hàm kết hợp (Tổng, Min, Max, GCD) trên đoạn $[L; R]$ `query(L, R)`. Cả hai thao tác đều chạy trong $O(\\log N)$. Mảng cây cần kích thước $4N$.",`2. Kỹ thuật Lazy Propagation: Khi cần cập nhật trên một đoạn $[L; R]$, ta trì hoãn việc đẩy giá trị xuống các nút con, giúp thao tác Range Update cũng chỉ tốn $O(\\log N)$.`,"3. Disjoint Set Union (DSU): Quản lý việc gộp các tập hợp rời rạc. Áp dụng hai tối ưu: Nén đường đi (Path Compression) và Gộp theo hạng (Union by Rank/Size). Khi kết hợp cả hai, mỗi thao tác `find` và `union` chỉ tốn độ phức tạp gần như hằng số $O(\\alpha(N))$ (hàm Ackermann nghịch đảo)."],complexity:{time:`O(log N) cho Segment Tree, O(α(N)) cho DSU`,space:`O(4N) cho Segment Tree, O(N) cho DSU`},codeExamples:[{language:`cpp`,title:`C++ Segment Tree Cập nhật Điểm & Truy vấn Tổng`,basicTitle:`C++ Cơ bản: Mảng thường — cập nhật O(1), tính tổng bằng vòng lặp`,basicCode:`#include <iostream>
using namespace std;

int main() {
    long long a[6] = {0, 2, 4, 1, 7, 3};
    a[2] = 10; // Cập nhật tại vị trí 2
    long long sum = 0;
    for (int i = 1; i <= 4; i++) sum += a[i]; // Truy vấn tổng [1..4]
    cout << sum << '\\n';
    return 0;
}`,basicExplanation:`Khi N và Q nhỏ, cập nhật trực tiếp mảng a[idx] = val và tính tổng bằng vòng lặp for rất đơn giản.`,code:`#include <iostream>
#include <vector>
using namespace std;

struct SegmentTree {
    int n;
    vector<long long> tree;

    SegmentTree(int n) : n(n), tree(4 * n, 0) {}

    void update(int node, int start, int end, int idx, long long val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = (start + end) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx, val);
        else update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    long long query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;
        if (l <= start && end <= r) return tree[node];
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);
    }
};`,explanation:`Mỗi nút quản lý đoạn [start, end]. Cây có độ cao không quá log₂(N) + 1.`},{language:`python`,title:`Python DSU với Path Compression`,basicTitle:`Python Cơ bản: Mảng nhãn nhóm (Union-Find tối giản không dùng class)`,basicCode:`n = 5
nhom = list(range(n + 1))

# Gộp nhóm của 2 phần tử u, v bằng cách đổi toàn bộ nhãn v sang nhãn u
u, v = 1, 3
cu, cv = nhom[u], nhom[v]
for i in range(1, n + 1):
    if nhom[i] == cv:
        nhom[i] = cu
print("Cung nhom:", nhom[1] == nhom[3])`,basicExplanation:`Quản lý tập hợp bằng mảng nhãn đơn thuần trong main(), không cần class hay đệ quy nén đường đi.`,code:`class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)

    def find(self, i):
        # Nén đường đi
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            # Gộp tập nhỏ vào tập lớn
            if self.size[root_i] < self.size[root_j]:
                root_i, root_j = root_j, root_i
            self.parent[root_j] = root_i
            self.size[root_i] += self.size[root_j]
            return True
        return False`,explanation:`DSU là vũ khí số một trong thuật toán Kruskal tìm cây khung nhỏ nhất và đếm thành phần liên thông động.`}],practiceProblem:{id:`CS_P9`,title:`Quản lý Dãy số với Segment Tree: Cập nhật & Tìm Max đoạn`,difficulty:`Hard`,description:"Cho mảng A gồm N số nguyên (1 ≤ N ≤ 10⁵) và Q truy vấn (1 ≤ Q ≤ 10⁵). Có 2 loại truy vấn: 1) `1 p x`: gán A[p] = x; 2) `2 l r`: in ra giá trị lớn nhất trong đoạn từ l đến r.",inputFormat:`Dòng 1: N và Q. Dòng 2: N số nguyên ban đầu. Q dòng tiếp theo mô tả truy vấn.`,outputFormat:`Với mỗi truy vấn loại 2, in ra kết quả trên một dòng.`,sampleCases:[{input:`5 3
1 3 2 7 9
2 1 3
1 2 8
2 1 3`,output:`3
8`,explanation:`Truy vấn 1: max đoạn [1..3] là 3. Cập nhật A[2]=8. Truy vấn 3: max đoạn [1..3] lúc này là 8.`}],solutionAnalysis:`Dùng Segment Tree quản lý Max đoạn. Nút lá lưu giá trị A[i], nút cha lưu max của 2 nút con. Cập nhật và truy vấn trong O(log N).`,basicAnalysis:`Cơ bản: Dùng mảng tĩnh a[1..N] ngay trong main(): truy vấn loại 1 gán trực tiếp a[p] = x; truy vấn loại 2 duyệt vòng for từ l đến r tìm giá trị lớn nhất.`,basicSolutionCpp:`#include <iostream>
using namespace std;

int a[100005];

int main() {
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (q--) {
        int loai;
        cin >> loai;
        if (loai == 1) {
            int p, x;
            cin >> p >> x;
            a[p] = x;
        } else {
            int l, r;
            cin >> l >> r;
            int mx = a[l];
            for (int i = l + 1; i <= r; i++) {
                if (a[i] > mx) mx = a[i];
            }
            cout << mx << '\\n';
        }
    }
    return 0;
}`,basicSolutionPython:`n, q = map(int, input().split())
a = [0] + list(map(int, input().split()))
for _ in range(q):
    dong = list(map(int, input().split()))
    if dong[0] == 1:
        a[dong[1]] = dong[2]
    else:
        l, r = dong[1], dong[2]
        mx = a[l]
        for i in range(l + 1, r + 1):
            if a[i] > mx:
                mx = a[i]
        print(mx)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int INF = 1e9 + 7;
vector<int> tree;

void build(const vector<int>& a, int node, int start, int end) {
    if (start == end) {
        tree[node] = a[start];
        return;
    }
    int mid = (start + end) / 2;
    build(a, 2 * node, start, mid);
    build(a, 2 * node + 1, mid + 1, end);
    tree[node] = max(tree[2 * node], tree[2 * node + 1]);
}

void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
        return;
    }
    int mid = (start + end) / 2;
    if (idx <= mid) update(2 * node, start, mid, idx, val);
    else update(2 * node + 1, mid + 1, end, idx, val);
    tree[node] = max(tree[2 * node], tree[2 * node + 1]);
}

int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return -INF;
    if (l <= start && end <= r) return tree[node];
    int mid = (start + end) / 2;
    return max(query(2 * node, start, mid, l, r), query(2 * node + 1, mid + 1, end, l, r));
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];

    tree.assign(4 * (n + 1), -INF);
    build(a, 1, 1, n);

    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int p, x;
            cin >> p >> x;
            update(1, 1, n, p, x);
        } else {
            int l, r;
            cin >> l >> r;
            cout << query(1, 1, n, l, r) << '\\n';
        }
    }
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    q = int(tokens[1])
    a = [0] + [int(x) for x in tokens[2:2 + n]]
    idx = 2 + n

    tree = [-10**18] * (4 * (n + 1))

    def build(node, start, end):
        if start == end:
            tree[node] = a[start]
            return
        mid = (start + end) // 2
        build(2 * node, start, mid)
        build(2 * node + 1, mid + 1, end)
        tree[node] = max(tree[2 * node], tree[2 * node + 1])

    def update(node, start, end, p, val):
        if start == end:
            tree[node] = val
            return
        mid = (start + end) // 2
        if p <= mid:
            update(2 * node, start, mid, p, val)
        else:
            update(2 * node + 1, mid + 1, end, p, val)
        tree[node] = max(tree[2 * node], tree[2 * node + 1])

    def query(node, start, end, l, r):
        if r < start or end < l:
            return -10**18
        if l <= start and end <= r:
            return tree[node]
        mid = (start + end) // 2
        return max(query(2 * node, start, mid, l, r), query(2 * node + 1, mid + 1, end, l, r))

    build(1, 1, n)

    out = []
    for _ in range(q):
        t = int(tokens[idx])
        if t == 1:
            p = int(tokens[idx + 1])
            x = int(tokens[idx + 2])
            update(1, 1, n, p, x)
            idx += 3
        else:
            l = int(tokens[idx + 1])
            r = int(tokens[idx + 2])
            out.append(str(query(1, 1, n, l, r)))
            idx += 3
    print("\\n".join(out))

solve()`}}].map(t=>{let n=e[t.id];return n?{...t,...n}:t}),...t,...n].sort((e,t)=>e.lessonNumber-t.lessonNumber);export{r as t};