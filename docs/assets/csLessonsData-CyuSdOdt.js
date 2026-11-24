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

solve()`}}],n=[{id:`cs-13`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Fenwick Tree (BIT) & Nghịch thế`,prerequisites:[`cs-6`,`cs-9`],lessonNumber:13,title:`Cây Fenwick (Binary Indexed Tree) & Bài toán Đếm Nghịch thế`,topic:`BIT O(log N) gọn nhẹ · Rời rạc hóa (Coordinate Compression) & Tổng tiền tố động`,estimatedMinutes:20,theory:["1. Ý tưởng cốt lõi của Fenwick Tree (BIT): Mỗi chỉ số $i$ lưu tổng của đúng $i \\& (-i)$ phần tử kết thúc tại $i$ (với `i & -i` là bit 1 thấp nhất của $i$). Nhờ phép toán bit cực nhanh, cả hai thao tác `update(i, delta)` và `queryPrefix(i)` đều tốn $O(\\log N)$ với bộ nhớ đúng bằng $N+1$ (nhẹ hơn Segment Tree 4 lần!).","2. Công thức nhảy chỉ số trong BIT: Khi cập nhật tại $i$: tiến lên `i += i & -i` cho đến $\\le N$. Khi lấy tổng tiền tố $[1..i]$: lùi xuống `i -= i & -i` cho đến $> 0$.","3. Đếm cặp nghịch thế (Inversion Count): Duyệt ngược mảng từ phải sang trái; tại $a[i]$, số phần tử đứng sau nhỏ hơn $a[i]$ chính là `queryPrefix(a[i] - 1)`, sau đó gọi `update(a[i], 1)`. Nếu $a[i] \\le 10^9$, cần rời rạc hóa (nén giá trị) về $[1..N]$ trước!"],complexity:{time:`O(N log N) dựng & đếm nghịch thế, O(log N) mỗi truy vấn`,space:`O(N)`},codeExamples:[{language:`cpp`,title:`C++ Fenwick Tree chuẩn thi HSG`,basicTitle:`C++ Cơ bản: Đếm nghịch thế bằng 2 vòng lặp for (O(N²))`,basicCode:`#include <iostream>
using namespace std;

int main() {
    int a[5] = {3, 1, 4, 2, 5}, n = 5;
    long long inv = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (a[i] > a[j]) inv++;
    cout << inv << '\\n'; // 3
    return 0;
}`,basicExplanation:`Kiểm tra trực tiếp mọi cặp i < j xem a[i] > a[j] để hiểu định nghĩa nghịch thế.`,code:`#include <iostream>
#include <vector>
using namespace std;

struct Fenwick {
    int n;
    vector<long long> bit;
    Fenwick(int n) : n(n), bit(n + 1, 0) {}
    void add(int i, long long v) {
        for (; i <= n; i += i & -i) bit[i] += v;
    }
    long long sum(int i) {
        long long s = 0;
        for (; i > 0; i -= i & -i) s += bit[i];
        return s;
    }
    long long rangeSum(int l, int r) { return sum(r) - sum(l - 1); }
};`,explanation:`Chỉ mất 8 dòng code để quản lý cập nhật điểm và tính tổng đoạn trong O(log N).`},{language:`python`,title:`Python Fenwick Tree`,basicTitle:`Python Cơ bản: Đếm trực tiếp O(N²)`,basicCode:`a = [3, 1, 4, 2, 5]
inv = sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] > a[j])
print(inv)`,basicExplanation:`Viết biểu thức đếm trực tiếp cho dữ liệu nhỏ N ≤ 2000.`,code:`class Fenwick:
    def __init__(self, n: int):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i: int, delta: int):
        while i <= self.n:
            self.bit[i] += delta
            i += i & -i

    def prefix(self, i: int) -> int:
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s`,explanation:`Toán tử i & -i hoạt động giống hệt trong Python trên số nguyên dương.`}],practiceProblem:{id:`CS_P13`,title:`Đếm số cặp nghịch thế bằng Fenwick Tree`,difficulty:`Medium`,description:`Cho hoán vị hoặc dãy gồm N số nguyên dương (1 ≤ N ≤ 10⁵, 1 ≤ a[i] ≤ N). Hãy đếm số cặp chỉ số (i, j) sao cho i < j và a[i] > a[j].`,inputFormat:`Dòng 1: Số nguyên dương N. Dòng 2: N số nguyên dương a[1..N].`,outputFormat:`In ra một số nguyên duy nhất là số cặp nghịch thế.`,sampleCases:[{input:`5
2 4 1 3 5`,output:`3`,explanation:`Các cặp nghịch thế là (2, 1), (4, 1), (4, 3).`}],solutionAnalysis:`Duyệt i từ N về 1, cộng sum(a[i] - 1) vào kết quả rồi gọi add(a[i], 1). Độ phức tạp O(N log N).`,basicAnalysis:`Cơ bản: Hai vòng lặp lồng nhau kiểm tra trực tiếp mọi cặp i < j.`,basicSolutionCpp:`#include <iostream>
using namespace std;
int a[100005];
int main() {
    int n; cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    long long ans = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (a[i] > a[j]) ans++;
    cout << ans;
    return 0;
}`,basicSolutionPython:`n = int(input())
a = list(map(int, input().split()))
ans = 0
for i in range(n):
    for j in range(i + 1, n):
        if a[i] > a[j]:
            ans += 1
print(ans)`,fullSolutionCpp:`#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    int mx = 1;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        if (a[i] > mx) mx = a[i];
    }
    vector<long long> bit(mx + 2, 0);
    auto add = [&](int idx, long long v) {
        for (; idx <= mx; idx += idx & -idx) bit[idx] += v;
    };
    auto sum = [&](int idx) {
        long long s = 0;
        for (; idx > 0; idx -= idx & -idx) s += bit[idx];
        return s;
    };
    long long ans = 0;
    for (int i = n - 1; i >= 0; i--) {
        ans += sum(a[i] - 1);
        add(a[i], 1);
    }
    cout << ans << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    a = [int(x) for x in data[1:1 + n]]
    mx = max(a) if a else 1
    bit = [0] * (mx + 2)
    ans = 0
    for x in reversed(a):
        i = x - 1
        while i > 0:
            ans += bit[i]
            i -= i & -i
        i = x
        while i <= mx:
            bit[i] += 1
            i += i & -i
    print(ans)

solve()`}},{id:`cs-14`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Segment Tree Lazy Propagation`,prerequisites:[`cs-9`],lessonNumber:14,title:`Segment Tree Lazy Propagation: Cập nhật & Truy vấn Đoạn O(log N)`,topic:`Cập nhật lười trên cây phân đoạn · Trì hoãn đẩy nhãn xuống nút con`,estimatedMinutes:24,theory:[`1. Vấn đề đặt ra: Khi cần cộng thêm giá trị $v$ cho TẤT CẢ phần tử trong đoạn $[L; R]$, nếu cập nhật từng phần tử sẽ mất $O(N \\log N)$ mỗi truy vấn. Lazy Propagation giải quyết thao tác Range Update chỉ trong $O(\\log N)$.`,"2. Cơ chế Lazy Tag (`lazy[node]`): Khi đoạn $[start; end]$ nằm gọn trong $[L; R]$, ta cập nhật trực tiếp giá trị tổng trên nút `tree[node] += v * (end - start + 1)`, lưu phần chưa đẩy vào `lazy[node] += v` rồi DỪNG NGAY không đệ quy xuống con.","3. Hàm `pushDown(node, start, end)`: Bất cứ khi nào phải rẽ nhánh xuống con trong `update` hoặc `query`, ta lập tức xả `lazy[node]` xuống `2*node` và `2*node+1`, cập nhật `tree` của hai con rồi đặt lại `lazy[node] = 0`."],complexity:{time:`O(N) dựng cây, O(log N) cho cả Range Update & Range Query`,space:`O(4N)`},codeExamples:[{language:`cpp`,title:`C++ Segment Tree Lazy Update (Cộng đoạn, Tổng đoạn)`,basicTitle:`C++ Cơ bản: Vòng lặp cộng trực tiếp đoạn [L..R]`,basicCode:`#include <iostream>
using namespace std;
int main() {
    long long a[6] = {0, 1, 2, 3, 4, 5};
    for (int i = 2; i <= 4; i++) a[i] += 10;
    long long s = 0;
    for (int i = 1; i <= 5; i++) s += a[i];
    cout << s << '\\n'; // 45
    return 0;
}`,basicExplanation:`Cách cài đặt thô bằng vòng for: dễ kiểm chứng đúng sai trên mảng nhỏ.`,code:`struct LazySegTree {
    int n;
    vector<long long> tree, lazy;
    LazySegTree(int n) : n(n), tree(4 * n + 4, 0), lazy(4 * n + 4, 0) {}

    void push(int node, int l, int r) {
        if (lazy[node] == 0 || l == r) return;
        int mid = (l + r) >> 1;
        long long tag = lazy[node];
        tree[node << 1] += tag * (mid - l + 1);
        lazy[node << 1] += tag;
        tree[node << 1 | 1] += tag * (r - mid);
        lazy[node << 1 | 1] += tag;
        lazy[node] = 0;
    }

    void update(int node, int l, int r, int ql, int qr, long long v) {
        if (qr < l || r < ql) return;
        if (ql <= l && r <= qr) {
            tree[node] += v * (r - l + 1);
            lazy[node] += v;
            return;
        }
        push(node, l, r);
        int mid = (l + r) >> 1;
        update(node << 1, l, mid, ql, qr, v);
        update(node << 1 | 1, mid + 1, r, ql, qr, v);
        tree[node] = tree[node << 1] + tree[node << 1 | 1];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (qr < l || r < ql) return 0;
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) >> 1;
        return query(node << 1, l, mid, ql, qr) + query(node << 1 | 1, mid + 1, r, ql, qr);
    }
};`,explanation:`Hàm push() đảm bảo dữ liệu ở nút con luôn chính xác trước khi truy cập.`},{language:`python`,title:`Python Lazy Segment Tree`,basicTitle:`Python Cơ bản: Mảng cộng dồn / Vòng lặp`,basicCode:`a = [0, 1, 2, 3, 4, 5]
for i in range(2, 5):
    a[i] += 10
print(sum(a[1:6]))`,basicExplanation:`Minh họa trên N = 5 trước khi tổng quát thành cây Segment Tree.`,code:`class LazySeg:
    def __init__(self, a):
        self.n = len(a) - 1
        self.tree = [0] * (4 * self.n + 4)
        self.lazy = [0] * (4 * self.n + 4)
        if self.n > 0:
            self._build(a, 1, 1, self.n)

    def _build(self, a, node, l, r):
        if l == r:
            self.tree[node] = a[l]
            return
        mid = (l + r) // 2
        self._build(a, 2 * node, l, mid)
        self._build(a, 2 * node + 1, mid + 1, r)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]`,explanation:`Triển khai hàm build, push, update, query tương tự bản C++.`}],practiceProblem:{id:`CS_P14`,title:`Cộng đoạn [L..R] và Tính tổng đoạn [L..R] (Lazy Propagation)`,difficulty:`Hard`,description:"Cho mảng A gồm N số nguyên (1 ≤ N ≤ 10⁵) và Q truy vấn: `1 L R V` cộng V vào mọi phần tử từ L đến R; `2 L R` in ra tổng các phần tử từ L đến R.",inputFormat:`Dòng 1: N và Q. Dòng 2: N số nguyên A[1..N]. Q dòng sau mô tả truy vấn.`,outputFormat:`Mỗi truy vấn loại 2 in ra tổng đoạn trên 1 dòng.`,sampleCases:[{input:`5 3
1 2 3 4 5
2 1 3
1 2 4 10
2 1 3`,output:`6
26`,explanation:`Tổng [1..3] ban đầu là 1+2+3 = 6. Sau khi cộng 10 vào [2..4], mảng là [1, 12, 13, 14, 5], tổng [1..3] = 26.`}],solutionAnalysis:"Dùng Segment Tree Lazy Propagation với `tree[node]` lưu tổng đoạn và `lazy[node]` lưu lượng cộng chờ đẩy.",basicAnalysis:`Cơ bản: Duyệt vòng for [L..R] để cộng và tính tổng cho từng truy vấn.`,basicSolutionCpp:`#include <iostream>
using namespace std;
long long a[100005];
int main() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    while (q--) {
        int t, l, r; cin >> t >> l >> r;
        if (t == 1) {
            long long v; cin >> v;
            for (int i = l; i <= r; i++) a[i] += v;
        } else {
            long long s = 0;
            for (int i = l; i <= r; i++) s += a[i];
            cout << s << '\\n';
        }
    }
    return 0;
}`,basicSolutionPython:`n, q = map(int, input().split())
a = [0] + list(map(int, input().split()))
for _ in range(q):
    row = list(map(int, input().split()))
    if row[0] == 1:
        for i in range(row[1], row[2] + 1):
            a[i] += row[3]
    else:
        print(sum(a[row[1]:row[2] + 1]))`,fullSolutionCpp:`#include <iostream>
#include <vector>
using namespace std;

vector<long long> tree, lazy;

void build(const vector<long long>& a, int node, int l, int r) {
    if (l == r) { tree[node] = a[l]; return; }
    int mid = (l + r) >> 1;
    build(a, node << 1, l, mid);
    build(a, node << 1 | 1, mid + 1, r);
    tree[node] = tree[node << 1] + tree[node << 1 | 1];
}

void push(int node, int l, int r) {
    if (lazy[node] == 0 || l == r) return;
    int mid = (l + r) >> 1;
    long long v = lazy[node];
    tree[node << 1] += v * (mid - l + 1);
    lazy[node << 1] += v;
    tree[node << 1 | 1] += v * (r - mid);
    lazy[node << 1 | 1] += v;
    lazy[node] = 0;
}

void update(int node, int l, int r, int ql, int qr, long long v) {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
        tree[node] += v * (r - l + 1);
        lazy[node] += v;
        return;
    }
    push(node, l, r);
    int mid = (l + r) >> 1;
    update(node << 1, l, mid, ql, qr, v);
    update(node << 1 | 1, mid + 1, r, ql, qr, v);
    tree[node] = tree[node << 1] + tree[node << 1 | 1];
}

long long query(int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return tree[node];
    push(node, l, r);
    int mid = (l + r) >> 1;
    return query(node << 1, l, mid, ql, qr) + query(node << 1 | 1, mid + 1, r, ql, qr);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> a(n + 1);
    for (int i = 1; i <= n; i++) cin >> a[i];
    tree.assign(4 * (n + 1), 0);
    lazy.assign(4 * (n + 1), 0);
    build(a, 1, 1, n);
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
}`,fullSolutionPython:`import sys
sys.setrecursionlimit(300000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n, q = int(data[0]), int(data[1])
    a = [0] + [int(x) for x in data[2:2 + n]]
    idx = 2 + n
    tree = [0] * (4 * (n + 1))
    lazy = [0] * (4 * (n + 1))

    def build(node, l, r):
        if l == r:
            tree[node] = a[l]
            return
        mid = (l + r) >> 1
        build(node << 1, l, mid)
        build(node << 1 | 1, mid + 1, r)
        tree[node] = tree[node << 1] + tree[node << 1 | 1]

    def push(node, l, r):
        if lazy[node] == 0 or l == r:
            return
        mid = (l + r) >> 1
        v = lazy[node]
        tree[node << 1] += v * (mid - l + 1)
        lazy[node << 1] += v
        tree[node << 1 | 1] += v * (r - mid)
        lazy[node << 1 | 1] += v
        lazy[node] = 0

    def update(node, l, r, ql, qr, v):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            tree[node] += v * (r - l + 1)
            lazy[node] += v
            return
        push(node, l, r)
        mid = (l + r) >> 1
        update(node << 1, l, mid, ql, qr, v)
        update(node << 1 | 1, mid + 1, r, ql, qr, v)
        tree[node] = tree[node << 1] + tree[node << 1 | 1]

    def query(node, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return tree[node]
        push(node, l, r);
        mid = (l + r) >> 1
        return query(node << 1, l, mid, ql, qr) + query(node << 1 | 1, mid + 1, r, ql, qr)

    build(1, 1, n)
    out = []
    for _ in range(q):
        t = int(data[idx])
        if t == 1:
            update(1, 1, n, int(data[idx + 1]), int(data[idx + 2]), int(data[idx + 3]))
            idx += 4
        else:
            out.append(str(query(1, 1, n, int(data[idx + 1]), int(data[idx + 2]))))
            idx += 3
    print("\\n".join(out))

solve()`}},{id:`cs-15`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Trie (Cây Tiền tố) & Aho-Corasick`,prerequisites:[`cs-3`,`cs-12`],lessonNumber:15,title:`Cây Tiền tố (Trie), XOR Max Trie & Tự động hóa Aho-Corasick`,topic:`Lưu trữ từ điển O(|S|) · Truy vấn tiền tố & Tìm kiếm đa mẫu đồng thời`,estimatedMinutes:22,theory:["1. Cấu trúc Trie (Prefix Tree): Mỗi cạnh gán một ký tự (hoặc bit $0/1$ với Binary Trie). Mỗi nút lưu số từ đi qua `cnt` và số từ kết thúc `end`. Thao tác thêm và tìm xâu dài $L$ chỉ tốn $O(L)$, không phụ thuộc số từ $N$!",`2. Binary Trie cho bài toán XOR Max: Đưa các số nguyên 30-bit vào Trie từ bit cao nhất (bit 29) xuống bit 0. Để tối đa hóa $x \\oplus y$, tại mỗi tầng bit $b$, luôn ưu tiên rẽ sang nhánh bit đối ngược $1 - b$ nếu còn tồn tại.`,"3. Tự động hóa Aho-Corasick: Là sự kết hợp giữa Trie và con trỏ thất bại `fail[u]` (tương tự KMP trên cây). Cho phép quét toàn bộ văn bản $T$ một lần duy nhất trong $O(|T| + \\sum |P_i| + \\text{matches})$ để phát hiện tất cả từ khóa trong từ điển."],complexity:{time:`O(|S|) cho mỗi thao tác Insert / Query`,space:`O(Tổng độ dài các xâu × |Alphabet|)`},codeExamples:[{language:`cpp`,title:`C++ Trie Từ điển & Đếm Tiền tố`,basicTitle:`C++ Cơ bản: Dùng vector<string> kiểm tra tiền tố từng từ`,basicCode:`#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    vector<string> words = {"code", "coding", "cpu", "cat"};
    string pref = "co";
    int cnt = 0;
    for (auto& w : words)
        if (w.rfind(pref, 0) == 0) cnt++;
    cout << cnt << '\\n';
    return 0;
}`,basicExplanation:`Duyệt tuyến tính từng xâu trong danh sách khi số truy vấn ít.`,code:`struct Trie {
    struct Node {
        int child[26]{};
        int pass = 0, end = 0;
        Node() { fill(begin(child), end(child), -1); }
    };
    vector<Node> nodes{Node()};

    void insert(const string& s) {
        int u = 0;
        for (char c : s) {
            int ch = c - 'a';
            if (nodes[u].child[ch] == -1) {
                nodes[u].child[ch] = (int)nodes.size();
                nodes.emplace_back();
            }
            u = nodes[u].child[ch];
            nodes[u].pass++;
        }
        nodes[u].end++;
    }

    int countPrefix(const string& p) {
        int u = 0;
        for (char c : p) {
            int ch = c - 'a';
            if (nodes[u].child[ch] == -1) return 0;
            u = nodes[u].child[ch];
        }
        return nodes[u].pass;
    }
};`,explanation:`Mỗi bước đi xuống đúng 1 ký tự giúp đếm tiền tố trong O(|P|).`},{language:`python`,title:`Python Dictionary Trie`,basicTitle:`Python Cơ bản: startswith()`,basicCode:`words = ["code", "coding", "cpu", "cat"]
print(sum(1 for w in words if w.startswith("co")))`,basicExplanation:`Dùng hàm startswith chuẩn Python cho danh sách nhỏ.`,code:`class TrieNode:
    def __init__(self):
        self.ch = {}
        self.pass_cnt = 0

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str):
        cur = self.root
        for c in word:
            if c not in cur.ch:
                cur.ch[c] = TrieNode()
            cur = cur.ch[c]
            cur.pass_cnt += 1

    def count_prefix(self, pref: str) -> int:
        cur = self.root
        for c in pref:
            if c not in cur.ch:
                return 0
            cur = cur.ch[c]
        return cur.pass_cnt`,explanation:`Dùng dict giúp tiết kiệm bộ nhớ với bảng chữ cái lớn.`}],practiceProblem:{id:`CS_P15`,title:`Từ điển Tiền tố với Cây Trie`,difficulty:`Medium`,description:`Cho N từ chỉ gồm chữ cái thường (a–z) và Q truy vấn. Mỗi truy vấn cho một xâu tiền tố P, hãy đếm xem có bao nhiêu từ trong N từ đã cho bắt đầu bằng tiền tố P.`,inputFormat:`Dòng 1: N và Q. N dòng tiếp theo: mỗi dòng 1 từ. Q dòng tiếp theo: mỗi dòng 1 tiền tố P.`,outputFormat:`Với mỗi truy vấn, in ra số từ có tiền tố P trên 1 dòng.`,sampleCases:[{input:`4 2
code
coding
cpu
cat
co
c`,output:`2
4`,explanation:`Có 2 từ bắt đầu bằng "co" ("code", "coding") và 4 từ bắt đầu bằng "c".`}],solutionAnalysis:"Chèn N từ vào Trie, tăng `pass` ở mỗi nút đi qua. Mỗi truy vấn đi theo các ký tự của P và trả về `nodes[u].pass`.",basicAnalysis:"Cơ bản: Lưu mảng xâu và dùng `startswith` / `substr` kiểm tra từng cặp.",basicSolutionCpp:`#include <iostream>
#include <vector>
#include <string>
using namespace std;
int main() {
    int n, q; cin >> n >> q;
    vector<string> w(n);
    for (int i = 0; i < n; i++) cin >> w[i];
    while (q--) {
        string p; cin >> p;
        int cnt = 0;
        for (auto& s : w) if (s.size() >= p.size() && s.compare(0, p.size(), p) == 0) cnt++;
        cout << cnt << '\\n';
    }
    return 0;
}`,basicSolutionPython:`n, q = map(int, input().split())
words = [input().strip() for _ in range(n)]
for _ in range(q):
    p = input().strip()
    print(sum(1 for w in words if w.startswith(p)))`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Node {
    int nxt[26];
    int pass = 0;
    Node() { fill(nxt, nxt + 26, -1); }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<Node> trie(1);
    for (int i = 0; i < n; i++) {
        string s; cin >> s;
        int u = 0;
        for (char c : s) {
            int k = c - 'a';
            if (trie[u].nxt[k] == -1) {
                trie[u].nxt[k] = (int)trie.size();
                trie.emplace_back();
            }
            u = trie[u].nxt[k];
            trie[u].pass++;
        }
    }
    while (q--) {
        string p; cin >> p;
        int u = 0;
        bool ok = true;
        for (char c : p) {
            int k = c - 'a';
            if (trie[u].nxt[k] == -1) { ok = false; break; }
            u = trie[u].nxt[k];
        }
        cout << (ok ? trie[u].pass : 0) << '\\n';
    }
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n, q = int(tokens[0]), int(tokens[1])
    root = {}
    idx = 2
    for _ in range(n):
        cur = root
        for c in tokens[idx]:
            if c not in cur:
                cur[c] = {'#': 0}
            cur = cur[c]
            cur['#'] += 1
        idx += 1
    out = []
    for _ in range(q):
        cur = root
        ok = True
        for c in tokens[idx]:
            if c not in cur:
                ok = False
                break
            cur = cur[c]
        out.append(str(cur['#'] if ok else 0))
        idx += 1
    print("\\n".join(out))

solve()`}},{id:`cs-16`,level:`Trung cấp`,vnoiPhase:`Phase 2 · Kỹ thuật tối ưu kinh điển`,vnoiTag:`VNOI Wiki · Hàm Z (Z-Function) & Manacher O(N)`,prerequisites:[`cs-3`,`cs-12`],lessonNumber:16,title:`Thuật toán Z-Function & Thuật toán Manacher (Xâu Đối xứng O(N))`,topic:`Hàm Z khớp tiền tố & Tìm xâu con đối xứng dài nhất tuyến tính`,estimatedMinutes:20,theory:[`1. Định nghĩa Z-Function: Cho xâu $S$ độ dài $N$. $Z[i]$ là độ dài tiền tố chung dài nhất (LCP) giữa xâu $S$ và hậu tố bắt đầu tại $i$ ($S[i..N-1]$). Quy ước $Z[0] = 0$.`,`2. Cửa sổ $[L, R]$ trong Z-Function: Luôn duy trì đoạn $[L, R]$ là Z-box có $R$ lớn nhất từng thấy sao cho $S[L..R] == S[0..R-L]$. Khi tính $Z[i]$ với $i \\le R$, ta tận dụng ngay giá trị đã biết $Z[i - L]$ để nhảy cóc trong $O(N)$ tổng thời gian!`,'3. Thuật toán Manacher: Chèn ký tự `#` xen giữa mọi ký tự của $S$ (ví dụ `"aba"` $\\to$ `"#a#b#a#"`). Khi đó mọi xâu con đối xứng (kể cả độ dài chẵn hay lẻ) đều có tâm lẻ, ta dùng tính đối xứng gương qua tâm $C$ trong cửa sổ $[L, R]$ để tìm độ dài xâu đối xứng dài nhất chỉ trong $O(N)$!'],complexity:{time:`O(N) tuyến tính tuyệt đối cho cả Z-Function và Manacher`,space:`O(N)`},codeExamples:[{language:`cpp`,title:`C++ Xây dựng Mảng Z trong O(N)`,basicTitle:`C++ Cơ bản: Tính từng Z[i] bằng vòng while O(N²)`,basicCode:`#include <iostream>
#include <string>
#include <vector>
using namespace std;
int main() {
    string s = "abacaba";
    int n = s.size();
    vector<int> z(n, 0);
    for (int i = 1; i < n; i++)
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
    for (int v : z) cout << v << " ";
    return 0;
}`,basicExplanation:`Đếm trực tiếp số ký tự giống nhau tại mỗi vị trí i để hiểu rõ ý nghĩa mảng Z.`,code:`vector<int> zFunction(const string& s) {
    int n = (int)s.size();
    vector<int> z(n, 0);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) {
            l = i;
            r = i + z[i] - 1;
        }
    }
    return z;
}`,explanation:`Vì con trỏ phải R chỉ dịch tăng tối đa N lần nên toàn bộ vòng lặp chạy đúng O(N).`},{language:`python`,title:`Python Z-Function O(N)`,basicTitle:`Python Cơ bản: Đếm LCP từng hậu tố`,basicCode:`s = "abacaba"
z = [0] * len(s)
for i in range(1, len(s)):
    while i + z[i] < len(s) and s[z[i]] == s[i + z[i]]:
        z[i] += 1
print(z)`,basicExplanation:`Cách tính trực tiếp độ dài tiền tố chung dài nhất.`,code:`def z_function(s: str):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z`,explanation:`Trả về mảng Z chỉ trong thời gian tuyến tính O(N).`}],practiceProblem:{id:`CS_P16`,title:`Tìm độ dài xâu con đối xứng dài nhất (Manacher O(N))`,difficulty:`Medium`,description:`Cho xâu ký tự S có độ dài từ 1 đến 10⁵. Hãy tìm độ dài của xâu con liên tiếp đối xứng (Palindrome) dài nhất bên trong S.`,inputFormat:`Một dòng duy nhất chứa xâu ký tự S.`,outputFormat:`In ra một số nguyên là độ dài xâu con đối xứng dài nhất.`,sampleCases:[{input:`babad`,output:`3`,explanation:`Xâu con đối xứng dài nhất là "bab" hoặc "aba", độ dài 3.`}],solutionAnalysis:"Dùng thuật toán Manacher chèn ký tự phân cách `#` (ví dụ `^#b#a#b#a#d#$`) và tính mảng bán kính đối xứng `p[i]` trong O(N).",basicAnalysis:`Cơ bản: Duyệt mọi tâm đối xứng lẻ và chẵn rồi mở rộng sang 2 bên (O(N²)).`,basicSolutionCpp:`#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    string s; cin >> s;
    int n = s.size(), best = 1;
    for (int c = 0; c < n; c++) {
        for (int off : {0, 1}) {
            int l = c, r = c + off;
            while (l >= 0 && r < n && s[l] == s[r]) {
                best = max(best, r - l + 1);
                l--; r++;
            }
        }
    }
    cout << best;
    return 0;
}`,basicSolutionPython:`s = input().strip()
n = len(s)
best = 1
for c in range(n):
    for l, r in ((c, c), (c, c + 1)):
        while l >= 0 and r < n and s[l] == s[r]:
            best = max(best, r - l + 1)
            l -= 1
            r += 1
print(best)`,fullSolutionCpp:`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (!(cin >> s)) return 0;
    string t = "^#";
    for (char c : s) { t.push_back(c); t.push_back('#'); }
    t.push_back('$');
    int n = (int)t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0, best = 0;
    for (int i = 1; i < n - 1; i++) {
        int mirr = 2 * c - i;
        if (i < r) p[i] = min(r - i, p[mirr]);
        while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i]; }
        if (p[i] > best) best = p[i];
    }
    cout << best << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    t = "^#" + "#".join(s) + "#$"
    n = len(t)
    p = [0] * n
    c = r = best = 0
    for i in range(1, n - 1):
        mirr = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mirr])
        while t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
        if p[i] > best:
            best = p[i]
    print(best)

solve()`}},{id:`cs-17`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 3 · Quy hoạch động & Đồ thị`,vnoiTag:`VNOI Wiki · Tarjan Khớp–Cầu–SCC & Đường đi Euler`,prerequisites:[`cs-8`],lessonNumber:17,title:`Thuật toán Tarjan (Khớp, Cầu, SCC) & Đường đi Euler (Hierholzer)`,topic:`Cây DFS (num/low) · Thành phần Liên thông mạnh & Chu trình qua mọi cạnh`,estimatedMinutes:25,theory:["1. Cây DFS & Hai mảng kinh điển `num[u]`, `low[u]`: `num[u]` là thứ tự duyệt DFS vào đỉnh $u$; `low[u]` là giá trị `num` nhỏ nhất mà từ cây con gốc $u$ có thể nhảy ngược lên qua tối đa 1 cạnh ngược (back-edge).","2. Nhận diện Cầu & Khớp bằng Tarjan: Cạnh $(u, v)$ trên cây DFS ($v$ là con của $u$) là **CẦU** nếu `low[v] > num[u]`. Đỉnh $u$ không phải gốc là **KHỚP** nếu tồn tại con $v$ sao cho `low[v] >= num[u]` (nếu là gốc DFS thì $u$ cần ít nhất 2 nhánh con độc lập).",`3. Chu trình & Đường đi Euler (Hierholzer): Đồ thị vô hướng liên thông có chu trình Euler khi mọi đỉnh bậc chẵn; có đường đi Euler khi có đúng 0 hoặc 2 đỉnh bậc lẻ. Thuật toán Hierholzer dùng stack xóa cạnh đã đi trong $O(V + E)$.`],complexity:{time:`O(V + E) cho cả Tarjan và Hierholzer`,space:`O(V + E)`},codeExamples:[{language:`cpp`,title:`C++ Tarjan Đếm Khớp & Cầu trên Đồ thị Vô hướng`,basicTitle:`C++ Cơ bản: Thử xóa từng cạnh kiểm tra tính liên thông (O(E·(V+E)))`,basicCode:`// Ý tưởng định nghĩa Cầu: một cạnh là Cầu nếu khi tạm ẩn nó đi,
// số thành phần liên thông của đồ thị tăng lên!`,basicExplanation:`Cách kiểm tra theo đúng định nghĩa lý thuyết (phù hợp N ≤ 500).`,code:`int timer = 0, bridges = 0;
vector<int> num, low;
vector<bool> isArticulation;

void dfs(int u, int p, const vector<vector<int>>& adj) {
    num[u] = low[u] = ++timer;
    int children = 0;
    for (int v : adj[u]) {
        if (v == p) continue;
        if (num[v]) {
            low[u] = min(low[u], num[v]);
        } else {
            children++;
            dfs(v, u, adj);
            low[u] = min(low[u], low[v]);
            if (low[v] > num[u]) bridges++;
            if (p != -1 && low[v] >= num[u]) isArticulation[u] = true;
        }
    }
    if (p == -1 && children > 1) isArticulation[u] = true;
}`,explanation:`Chỉ một lần DFS duy nhất tính cả số Cầu và toàn bộ đỉnh Khớp.`},{language:`python`,title:`Python Tarjan Bridges & Articulation Points`,basicTitle:`Python Cơ bản: DFS kiểm tra cầu O(E·(V+E))`,basicCode:`# Với đồ thị nhỏ, có thể duyệt thử bỏ từng cạnh và BFS đếm đỉnh tới được.`,basicExplanation:`Minh họa khái niệm đồ thị mất liên thông khi cắt cầu.`,code:`def find_bridges(n, adj):
    num = [0] * (n + 1)
    low = [0] * (n + 1)
    timer = [0]
    bridges = []
    def dfs(u, p):
        timer[0] += 1
        num[u] = low[u] = timer[0]
        for v in adj[u]:
            if v == p: continue
            if num[v]:
                low[u] = min(low[u], num[v])
            else:
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if low[v] > num[u]:
                    bridges.append((u, v))
    for i in range(1, n + 1):
        if not num[i]: dfs(i, -1)
    return bridges`,explanation:"Chú ý bật `sys.setrecursionlimit` nếu $N$ lên tới $10^5$."}],practiceProblem:{id:`CS_P17`,title:`Đếm số Cầu của Đồ thị Vô hướng (Tarjan)`,difficulty:`Hard`,description:`Cho đơn đồ thị vô hướng gồm N đỉnh (1..N) và M cạnh (1 ≤ N, M ≤ 10⁵). Một cạnh được gọi là Cầu nếu khi xóa cạnh đó khỏi đồ thị, số thành phần liên thông tăng lên. Hãy đếm số cạnh Cầu.`,inputFormat:`Dòng 1: N và M. M dòng tiếp theo: mỗi dòng 2 đỉnh u, v biểu thị cạnh nối.`,outputFormat:`In ra số lượng cạnh Cầu.`,sampleCases:[{input:`5 5
1 2
2 3
3 1
3 4
4 5`,output:`2`,explanation:`Chu trình 1-2-3 không có cầu; hai cạnh (3, 4) và (4, 5) là 2 cạnh cầu.`}],solutionAnalysis:`Chạy thuật toán Tarjan: tại mỗi cạnh cây (u → v), nếu low[v] > num[u] thì (u, v) là cầu.`,basicAnalysis:`Cơ bản: Lần lượt bỏ qua từng cạnh và chạy DFS/BFS kiểm tra xem hai đầu mút còn đi tới nhau được không.`,basicSolutionCpp:`#include <iostream>
#include <vector>
using namespace std;

bool vis[1005];
vector<int> adj[1005];
int banU, banV;

void dfs(int u) {
    vis[u] = true;
    for (int v : adj[u]) {
        if ((u == banU && v == banV) || (u == banV && v == banU)) continue;
        if (!vis[v]) dfs(v);
    }
}

int main() {
    int n, m; cin >> n >> m;
    vector<pair<int, int>> edges(m);
    for (int i = 0; i < m; i++) {
        cin >> edges[i].first >> edges[i].second;
        adj[edges[i].first].push_back(edges[i].second);
        adj[edges[i].second].push_back(edges[i].first);
    }
    int ans = 0;
    for (auto e : edges) {
        fill(vis, vis + n + 1, false);
        banU = e.first; banV = e.second;
        dfs(banU);
        if (!vis[banV]) ans++;
    }
    cout << ans;
    return 0;
}`,basicSolutionPython:`n, m = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
adj = [[] for _ in range(n + 1)]
for u, v in edges:
    adj[u].append(v); adj[v].append(u)
ans = 0
for bu, bv in edges:
    vis = [False] * (n + 1)
    st = [bu]; vis[bu] = True
    while st:
        u = st.pop()
        for v in adj[u]:
            if (u == bu and v == bv) or (u == bv and v == bu): continue
            if not vis[v]:
                vis[v] = True; st.append(v)
    if not vis[bv]: ans += 1
print(ans)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<pair<int, int>>> adj(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back({v, i});
        adj[v].push_back({u, i});
    }
    vector<int> num(n + 1, 0), low(n + 1, 0);
    int timer = 0, bridges = 0;
    auto dfs = [&](auto& self, int u, int peid) -> void {
        num[u] = low[u] = ++timer;
        for (auto [v, eid] : adj[u]) {
            if (eid == peid) continue;
            if (num[v]) {
                low[u] = min(low[u], num[v]);
            } else {
                self(self, v, eid);
                low[u] = min(low[u], low[v]);
                if (low[v] > num[u]) bridges++;
            }
        }
    };
    for (int i = 1; i <= n; i++) if (!num[i]) dfs(dfs, i, -1);
    cout << bridges << '\\n';
    return 0;
}`,fullSolutionPython:`import sys
sys.setrecursionlimit(300000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    adj = [[] for _ in range(n + 1)]
    idx = 2
    for eid in range(m):
        u, v = int(data[idx]), int(data[idx + 1])
        idx += 2
        adj[u].append((v, eid))
        adj[v].append((u, eid))
    num = [0] * (n + 1)
    low = [0] * (n + 1)
    timer = [0]
    bridges = [0]
    def dfs(u, peid):
        timer[0] += 1
        num[u] = low[u] = timer[0]
        for v, eid in adj[u]:
            if eid == peid: continue
            if num[v]:
                low[u] = min(low[u], num[v])
            else:
                dfs(v, eid)
                low[u] = min(low[u], low[v])
                if low[v] > num[u]:
                    bridges[0] += 1
    for i in range(1, n + 1):
        if not num[i]:
            dfs(i, -1)
    print(bridges[0])

solve()`}},{id:`cs-18`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Max Flow (Edmonds-Karp / Dinic) & Min Cut`,prerequisites:[`cs-8`],lessonNumber:18,title:`Luồng Cực đại (Max Flow · Edmonds-Karp / Dinic) & Lát cắt Cực tiểu`,topic:`Đồ thị thặng dư (Residual Graph) · Định lý Ford-Fulkerson & Cặp ghép Cực đại`,estimatedMinutes:26,theory:[`1. Bài toán Luồng cực đại (Max Flow): Cho mạng có hướng với nguồn $S$, đích $T$, mỗi cung $(u, v)$ có khả năng thông qua $c(u, v)$. Cần tìm tổng lưu lượng lớn nhất có thể đẩy từ $S$ tới $T$ sao cho luồng qua mỗi cung không vượt sức chứa và bảo toàn luồng tại mọi đỉnh trung gian.`,'2. Đồ thị thặng dư & Cung ngược: Khi đẩy lượng luồng $f$ dọc theo đường tăng luồng $S \\rightsquigarrow T$, ta trừ sức chứa thuận `cap[u][v] -= f` và CỘNG thêm sức chứa nghịch `cap[v][u] += f` để các bước sau có thể "hủy/chuyển hướng" luồng đã đẩy sai.',"3. Edmonds-Karp ($O(VE^2)$) vs Dinic ($O(V^2 E)$): Edmonds-Karp dùng BFS tìm đường tăng luồng ngắn nhất theo số cạnh; Dinic dựng đồ thị phân tầng (Level Graph) bằng BFS rồi đẩy đồng thời nhiều luồng (Blocking Flow) với tối ưu `ptr[]` chạy siêu nhanh trong thi đấu.",`4. Định lý Max-Flow Min-Cut: Giá trị Luồng cực đại luôn bằng tổng khả năng thông qua của Lát cắt hẹp nhất chia tách $S$ và $T$. Đây cũng là chìa khóa giải bài toán Cặp ghép cực đại đồ thị hai phía (Bipartite Matching) trong $O(E\\sqrt{V})$!`],complexity:{time:`O(VE²) với Edmonds-Karp, O(V²E) / O(E√V) với Dinic`,space:`O(V + E)`},codeExamples:[{language:`cpp`,title:`C++ Thuật toán Edmonds-Karp tìm Max Flow`,basicTitle:`C++ Cơ bản: Minh họa luồng đẩy qua BFS đơn giản`,basicCode:`// Ý tưởng cốt lõi: chừng nào BFS còn tìm được đường đi dương từ S -> T,
// tìm nút thắt cổ chai (bottleneck) nhỏ nhất và đẩy luồng + mở cung ngược!`,basicExplanation:`Từng bước BFS tìm đường tăng luồng ngắn nhất trên ma trận sức chứa.`,code:`long long maxFlowEK(int n, int s, int t, vector<vector<long long>>& cap) {
    long long total = 0;
    while (true) {
        vector<int> parent(n + 1, -1);
        queue<int> q;
        q.push(s); parent[s] = s;
        while (!q.empty() && parent[t] == -1) {
            int u = q.front(); q.pop();
            for (int v = 1; v <= n; v++) {
                if (parent[v] == -1 && cap[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }
        if (parent[t] == -1) break;
        long long push = 1e18;
        for (int v = t; v != s; v = parent[v])
            push = min(push, cap[parent[v]][v]);
        for (int v = t; v != s; v = parent[v]) {
            cap[parent[v]][v] -= push;
            cap[v][parent[v]] += push;
        }
        total += push;
    }
    return total;
}`,explanation:`Cập nhật cả cung thuận cap[u][v] -= push lẫn cung ngược cap[v][u] += push.`},{language:`python`,title:`Python Edmonds-Karp Max Flow`,basicTitle:`Python Cơ bản: BFS tìm đường tăng luồng`,basicCode:`from collections import deque
# Dùng deque chạy BFS trên đồ thị thặng dư tìm bottleneck mỗi vòng.`,basicExplanation:`Code sạch gọn với deque và danh sách kề.`,code:`from collections import deque

def max_flow(n, s, t, cap):
    flow = 0
    while True:
        parent = [-1] * (n + 1)
        parent[s] = s
        q = deque([s])
        while q and parent[t] == -1:
            u = q.popleft()
            for v in range(1, n + 1):
                if parent[v] == -1 and cap[u][v] > 0:
                    parent[v] = u
                    q.append(v)
        if parent[t] == -1:
            break
        push = 10**18
        v = t
        while v != s:
            push = min(push, cap[parent[v]][v])
            v = parent[v]
        v = t
        while v != s:
            cap[parent[v]][v] -= push
            cap[v][parent[v]] += push
            v = parent[v]
        flow += push
    return flow`,explanation:`Khi không còn đường tăng luồng từ S đến T thì giá trị flow thu được chính là Max Flow.`}],practiceProblem:{id:`CS_P18`,title:`Tìm Luồng Cực Đại từ Nguồn 1 đến Đích N`,difficulty:`Hard`,description:`Cho mạng có hướng N đỉnh (1..N) và M cung có hướng (1 ≤ N ≤ 200, 1 ≤ M ≤ 2000). Cung thứ i nối u → v với khả năng thông qua c (1 ≤ c ≤ 10⁹). Tính giá trị luồng cực đại từ đỉnh 1 đến đỉnh N.`,inputFormat:`Dòng 1: N và M. M dòng tiếp theo: u, v, c.`,outputFormat:`In ra một số nguyên là luồng cực đại.`,sampleCases:[{input:`4 5
1 2 10
1 3 10
2 3 2
2 4 4
3 4 12`,output:`16`,explanation:`Đẩy 4 qua 1→2→4, đẩy 2 qua 1→2→3→4 và đẩy 10 qua 1→3→4, tổng cộng 4 + 2 + 10 = 16.`}],solutionAnalysis:`Dùng thuật toán Edmonds-Karp với BFS trên ma trận kề sức chứa thặng dư.`,basicAnalysis:`Cơ bản: Tìm đường tăng luồng bằng DFS trên đồ thị thặng dư.`,basicSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

long long cap[205][205];
bool vis[205];
int n, m;

long long dfs(int u, long long flow) {
    if (u == n) return flow;
    vis[u] = true;
    for (int v = 1; v <= n; v++) {
        if (!vis[v] && cap[u][v] > 0) {
            long long pushed = dfs(v, min(flow, cap[u][v]));
            if (pushed > 0) {
                cap[u][v] -= pushed;
                cap[v][u] += pushed;
                return pushed;
            }
        }
    }
    return 0;
}

int main() {
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v; long long c; cin >> u >> v >> c;
        cap[u][v] += c;
    }
    long long ans = 0;
    while (true) {
        fill(vis, vis + n + 1, false);
        long long pushed = dfs(1, 1e18);
        if (pushed == 0) break;
        ans += pushed;
    }
    cout << ans;
    return 0;
}`,basicSolutionPython:`n, m = map(int, input().split())
cap = [[0] * (n + 1) for _ in range(n + 1)]
for _ in range(m):
    u, v, c = map(int, input().split())
    cap[u][v] += c
def dfs(u, flow, vis):
    if u == n: return flow
    vis[u] = True
    for v in range(1, n + 1):
        if not vis[v] and cap[u][v] > 0:
            p = dfs(v, min(flow, cap[u][v]), vis)
            if p > 0:
                cap[u][v] -= p; cap[v][u] += p
                return p
    return 0
ans = 0
while True:
    p = dfs(1, 10**18, [False] * (n + 1))
    if p == 0: break
    ans += p
print(ans)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    vector<vector<long long>> cap(n + 1, vector<long long>(n + 1, 0));
    for (int i = 0; i < m; i++) {
        int u, v; long long c;
        cin >> u >> v >> c;
        cap[u][v] += c;
    }
    long long total = 0;
    while (true) {
        vector<int> parent(n + 1, -1);
        queue<int> q;
        q.push(1);
        parent[1] = 1;
        while (!q.empty() && parent[n] == -1) {
            int u = q.front(); q.pop();
            for (int v = 1; v <= n; v++) {
                if (parent[v] == -1 && cap[u][v] > 0) {
                    parent[v] = u;
                    q.push(v);
                }
            }
        }
        if (parent[n] == -1) break;
        long long push = 1e18;
        for (int v = n; v != 1; v = parent[v])
            push = min(push, cap[parent[v]][v]);
        for (int v = n; v != 1; v = parent[v]) {
            cap[parent[v]][v] -= push;
            cap[v][parent[v]] += push;
        }
        total += push;
    }
    cout << total << '\\n';
    return 0;
}`,fullSolutionPython:`import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n, m = int(data[0]), int(data[1])
    cap = [[0] * (n + 1) for _ in range(n + 1)]
    idx = 2
    for _ in range(m):
        u, v, c = int(data[idx]), int(data[idx + 1]), int(data[idx + 2])
        idx += 3
        cap[u][v] += c
    total = 0
    while True:
        parent = [-1] * (n + 1)
        parent[1] = 1
        q = deque([1])
        while q and parent[n] == -1:
            u = q.popleft()
            for v in range(1, n + 1):
                if parent[v] == -1 and cap[u][v] > 0:
                    parent[v] = u
                    q.append(v)
        if parent[n] == -1:
            break
        push = 10**18
        v = n
        while v != 1:
            push = min(push, cap[parent[v]][v])
            v = parent[v]
        v = n
        while v != 1:
            cap[parent[v]][v] -= push
            cap[v][parent[v]] += push
            v = parent[v]
        total += push
    print(total)

solve()`}},{id:`cs-19`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Heavy-Light Decomposition (HLD)`,prerequisites:[`cs-9`,`cs-14`],lessonNumber:19,title:`Heavy-Light Decomposition (HLD) & Truy vấn Đường đi Trên Cây`,topic:`Phân rã chuỗi nặng–nhẹ · Quy bài toán Cây về Segment Tree O(log² N)`,estimatedMinutes:26,theory:["1. Ý tưởng phân rã Heavy-Light Decomposition: Với mỗi đỉnh $u$ trên cây gốc 1, chọn một đỉnh con $v$ có kích thước cây con `sz[v]` LỚN NHẤT làm **Heavy Child** (nối thành Heavy Chain), các con còn lại nối qua Light Edge.","2. Tính chất vàng của HLD: Khi đi từ một đỉnh bất kì $u$ lên gốc, mỗi lần băng qua một Light Edge thì kích thước cây con ít nhất tăng GẤP ĐÔI! Do đó đường đi giữa hai đỉnh bất kì $u, v$ bị cắt thành tối đa $O(\\log N)$ đoạn liên tiếp trên mảng `pos[]`.","3. Kết hợp Segment Tree: Đánh số lại toàn bộ cây theo DFS ưu tiên đi qua `heavy[u]` trước để mọi Heavy Chain nằm liên tiếp trên mảng tuyến tính. Mỗi truy vấn cập nhật/tìm max/tổng đường đi $(u, v)$ mất đúng $O(\\log^2 N)$."],complexity:{time:`O(N) tiền xử lý DFS + O(log² N) mỗi truy vấn đường đi`,space:`O(N)`},codeExamples:[{language:`cpp`,title:`C++ Hai bước DFS & Query Đường đi HLD`,basicTitle:`C++ Cơ bản: Leo trực tiếp từ u, v lên LCA (O(N))`,basicCode:`// Leo trực tiếp hai đỉnh u và v bằng parent[] cho đến khi gặp nhau tại LCA,
// tổng giá trị trên đường đi được cộng dồn từng đỉnh (O(N) mỗi truy vấn).`,basicExplanation:`Phiên bản cơ bản dễ hiểu cho cây nhỏ khi Q · N ≤ 10⁷.`,code:`// DFS 1: tính parent, depth, sz, heavy[u]
int dfsSize(int u, int p) {
    parent[u] = p; depth[u] = depth[p] + 1; sz[u] = 1;
    int maxSub = 0;
    for (int v : adj[u]) if (v != p) {
        int s = dfsSize(v, u);
        sz[u] += s;
        if (s > maxSub) { maxSub = s; heavy[u] = v; }
    }
    return sz[u];
}
// DFS 2: ưu tiên heavy[u] trước để giữ chain liên tiếp trong pos[]
void dfsHld(int u, int h) {
    head[u] = h; pos[u] = ++curPos;
    if (heavy[u]) dfsHld(heavy[u], h);
    for (int v : adj[u])
        if (v != parent[u] && v != heavy[u]) dfsHld(v, v);
}`,explanation:"Nhảy `u = parent[head[u]]` khi hai đầu chuỗi khác nhau cho tới khi cùng chuỗi."},{language:`python`,title:`Python Leo Cây & Tìm Tổng Đường Đi`,basicTitle:`Python Cơ bản: Truy vết parent hai đỉnh`,basicCode:`def path_max(u, v, parent, depth, val):
    res = -10**18
    while u != v:
        if depth[u] < depth[v]: u, v = v, u
        res = max(res, val[u])
        u = parent[u]
    return max(res, val[u])`,basicExplanation:`Leo trực tiếp theo depth để kiểm chứng logic truy vấn đường đi trên cây.`,code:`def query_path(u, v, head, parent, depth, pos, seg_query):
    ans = 0
    while head[u] != head[v]:
        if depth[head[u]] < depth[head[v]]:
            u, v = v, u
        ans += seg_query(pos[head[u]], pos[u])
        u = parent[head[u]]
    if depth[u] > depth[v]:
        u, v = v, u
    ans += seg_query(pos[u], pos[v])
    return ans`,explanation:`Mỗi bước vòng while nhảy qua đúng 1 chuỗi nặng nên chạy tối đa O(log N) lần.`}],practiceProblem:{id:`CS_P19`,title:`Cập nhật Đỉnh & Tìm Max trên Đường đi Cây (HLD)`,difficulty:`Hard`,description:"Cho cây N đỉnh (gốc 1), mỗi đỉnh có giá trị a[i]. Thực hiện Q truy vấn: `1 u x` gán a[u] = x; `2 u v` in ra giá trị lớn nhất trên đường đi đơn từ u đến v.",inputFormat:`Dòng 1: N và Q. Dòng 2: N số a[1..N]. N-1 dòng tiếp: cạnh cây. Q dòng cuối: truy vấn.`,outputFormat:`Mỗi truy vấn loại 2 in ra kết quả trên một dòng.`,sampleCases:[{input:`4 3
1 5 3 2
1 2
1 3
2 4
2 4 3
1 2 9
2 4 3`,output:`5
9`,explanation:`Đường 4–2–1–3 có giá trị [2, 5, 1, 3] → max 5; sau khi đổi a[2] = 9 thì max thành 9.`}],solutionAnalysis:"Dùng HLD chuyển cây về mảng `pos[]` rồi chạy Segment Tree quản lý Max đoạn.",basicAnalysis:`Cơ bản: Tiền xử lý depth và parent bằng 1 lần DFS, mỗi truy vấn loại 2 leo dần u và v về LCA.`,basicSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
vector<int> adj[100005];
int par[100005], dep[100005], val[100005];
void dfs(int u, int p) {
    par[u] = p; dep[u] = dep[p] + 1;
    for (int v : adj[u]) if (v != p) dfs(v, u);
}
int main() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> val[i];
    for (int i = 1; i < n; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    dfs(1, 0);
    while (q--) {
        int t, u, v; cin >> t >> u >> v;
        if (t == 1) val[u] = v;
        else {
            int ans = -1e9;
            while (u != v) {
                if (dep[u] < dep[v]) swap(u, v);
                ans = max(ans, val[u]);
                u = par[u];
            }
            cout << max(ans, val[u]) << '\\n';
        }
    }
    return 0;
}`,basicSolutionPython:`n, q = map(int, input().split())
val = [0] + list(map(int, input().split()))
adj = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    adj[u].append(v); adj[v].append(u)
par = [0] * (n + 1); dep = [0] * (n + 1)
st = [(1, 0)]
while st:
    u, p = st.pop()
    par[u] = p
    for v in adj[u]:
        if v != p:
            dep[v] = dep[u] + 1; st.append((v, u))
for _ in range(q):
    t, u, v = map(int, input().split())
    if t == 1: val[u] = v
    else:
        ans = -10**9
        while u != v:
            if dep[u] < dep[v]: u, v = v, u
            ans = max(ans, val[u]); u = par[u]
        print(max(ans, val[u]))`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

const int INF = 1e9 + 7;
vector<vector<int>> adj;
vector<int> par, dep, heavy, head, pos, val, seg;
int curPos = 0, N;

int dfs1(int u, int p) {
    par[u] = p; dep[u] = dep[p] + 1;
    int sz = 1, mx = 0;
    for (int v : adj[u]) if (v != p) {
        int s = dfs1(v, u);
        sz += s;
        if (s > mx) { mx = s; heavy[u] = v; }
    }
    return sz;
}
void dfs2(int u, int h) {
    head[u] = h; pos[u] = ++curPos;
    if (heavy[u]) dfs2(heavy[u], h);
    for (int v : adj[u]) if (v != par[u] && v != heavy[u]) dfs2(v, v);
}
void upd(int p, int v) {
    for (seg[p += N - 1] = v; p > 1; p >>= 1) seg[p >> 1] = max(seg[p], seg[p ^ 1]);
}
int qry(int l, int r) {
    int res = -INF;
    for (l += N - 1, r += N; l < r; l >>= 1, r >>= 1) {
        if (l & 1) res = max(res, seg[l++]);
        if (r & 1) res = max(res, seg[--r]);
    }
    return res;
}
int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int q; if (!(cin >> N >> q)) return 0;
    adj.assign(N + 1, {}); par.assign(N + 1, 0); dep.assign(N + 1, 0);
    heavy.assign(N + 1, 0); head.assign(N + 1, 0); pos.assign(N + 1, 0);
    val.assign(N + 1, 0); seg.assign(2 * N + 4, -INF);
    for (int i = 1; i <= N; i++) cin >> val[i];
    for (int i = 1; i < N; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v); adj[v].push_back(u);
    }
    dfs1(1, 0); dfs2(1, 1);
    for (int i = 1; i <= N; i++) upd(pos[i], val[i]);
    while (q--) {
        int t, u, v; cin >> t >> u >> v;
        if (t == 1) upd(pos[u], v);
        else {
            int ans = -INF;
            while (head[u] != head[v]) {
                if (dep[head[u]] < dep[head[v]]) swap(u, v);
                ans = max(ans, qry(pos[head[u]], pos[u]));
                u = par[head[u]];
            }
            if (dep[u] > dep[v]) swap(u, v);
            cout << max(ans, qry(pos[u], pos[v])) << '\\n';
        }
    }
    return 0;
}`,fullSolutionPython:`import sys
sys.setrecursionlimit(300000)

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n, q = int(data[0]), int(data[1])
    val = [0] + [int(x) for x in data[2:2 + n]]
    idx = 2 + n
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = int(data[idx]), int(data[idx + 1]); idx += 2
        adj[u].append(v); adj[v].append(u)
    par = [0] * (n + 1); dep = [0] * (n + 1); heavy = [0] * (n + 1)
    head = [0] * (n + 1); pos = [0] * (n + 1); cur = [0]
    def dfs1(u, p):
        par[u] = p; dep[u] = dep[p] + 1
        sz = 1; mx = 0
        for v in adj[u]:
            if v != p:
                s = dfs1(v, u); sz += s
                if s > mx: mx = s; heavy[u] = v
        return sz
    def dfs2(u, h):
        cur[0] += 1; head[u] = h; pos[u] = cur[0]
        if heavy[u]: dfs2(heavy[u], h)
        for v in adj[u]:
            if v != par[u] and v != heavy[u]: dfs2(v, v)
    dfs1(1, 0); dfs2(1, 1)
    seg = [-10**18] * (2 * n + 4)
    def upd(p, v):
        p += n - 1; seg[p] = v
        while p > 1:
            p >>= 1; seg[p] = max(seg[p << 1], seg[p << 1 | 1])
    def qry(l, r):
        res = -10**18; l += n - 1; r += n
        while l < r:
            if l & 1: res = max(res, seg[l]); l += 1
            if r & 1: r -= 1; res = max(res, seg[r])
            l >>= 1; r >>= 1
        return res
    for i in range(1, n + 1): upd(pos[i], val[i])
    out = []
    for _ in range(q):
        t, u, v = int(data[idx]), int(data[idx + 1]), int(data[idx + 2]); idx += 3
        if t == 1: upd(pos[u], v)
        else:
            ans = -10**18
            while head[u] != head[v]:
                if dep[head[u]] < dep[head[v]]: u, v = v, u
                ans = max(ans, qry(pos[head[u]], pos[u])); u = par[head[u]]
            if dep[u] > dep[v]: u, v = v, u
            out.append(str(max(ans, qry(pos[u], pos[v]))))
    print("\\n".join(out))

solve()`}},{id:`cs-20`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 3 · Quy hoạch động & Đồ thị`,vnoiTag:`VNOI Wiki · DP Bitmask & DP Trên Cây (Tree DP)`,prerequisites:[`cs-7`,`cs-8`],lessonNumber:20,title:`Quy hoạch động Trạng thái Bitmask & Quy hoạch động Trên Cây (Tree DP)`,topic:`Nén tập hợp bằng số nguyên bitmask (N ≤ 20) & Bài toán Người du lịch TSP`,estimatedMinutes:23,theory:["1. Khái niệm Bitmask: Khi tập hợp có kích thước nhỏ $N \\le 20$, ta biểu diễn một tập con bằng số nguyên $N$-bit `mask` ($0 \\le mask < 2^N$). Bit thứ $i$ bằng 1 nghĩa là phần tử $i$ đã được chọn (`mask >> i & 1`).","2. Các phép toán bit hay dùng: Bật bit $i$: `mask | (1 << i)`; Tắt bit $i$: `mask ^ (1 << i)`; Đếm số bit 1: `__builtin_popcount(mask)`. Bài toán Người du lịch (TSP) dùng `dp[mask][u]` đạt $O(N^2 2^N)$ thay vì $O(N!)$.","3. DP Trên Cây (Tree DP): Tính trạng thái tại nút $u$ từ các nút con $v$ trong lúc duyệt DFS hậu thứ tự (Post-order). Ví dụ Tập độc lập Cực đại trên cây (Maximum Independent Set): `dp[u][0]` (không chọn $u$) $= \\sum \\max(dp[v][0], dp[v][1])$, `dp[u][1]` (chọn $u$) $= w[u] + \\sum dp[v][0]$."],complexity:{time:`O(N²·2ⁿ) cho TSP Bitmask, O(N) cho Tree DP`,space:`O(N·2ⁿ) / O(N)`},codeExamples:[{language:`cpp`,title:`C++ Bitmask DP: Bài toán Người du lịch TSP (Quay lại đỉnh 0)`,basicTitle:`C++ Cơ bản: Duyệt toàn bộ hoán vị next_permutation (O(N!))`,basicCode:`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;
int main() {
    // Với N <= 10, thử mọi hoán vị các thành phố 1..N-1 bằng next_permutation
    return 0;
}`,basicExplanation:`Khi N ≤ 10 có thể sinh hoán vị, nhưng từ N = 14..20 bắt buộc phải dùng Bitmask DP.`,code:`int tsp(int n, const vector<vector<int>>& dist) {
    const int INF = 1e9;
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; v++) {
                if (mask >> v & 1) continue;
                int nmask = mask | (1 << v);
                dp[nmask][v] = min(dp[nmask][v], dp[mask][u] + dist[u][v]);
            }
        }
    }
    int ans = INF, full = (1 << n) - 1;
    for (int u = 0; u < n; u++) ans = min(ans, dp[full][u] + dist[u][0]);
    return ans;
}`,explanation:`Trạng thái dp[mask][u] lưu chi phí nhỏ nhất đã đi qua tập mask và đang đứng tại u.`},{language:`python`,title:`Python Bitmask TSP`,basicTitle:`Python Cơ bản: itertools.permutations`,basicCode:`from itertools import permutations
# Duyệt mọi hành trình qua các thành phố còn lại khi N nhỏ.`,basicExplanation:`Cách đối chiếu đáp án trên bộ test nhỏ.`,code:`def tsp(n, dist):
    INF = 10**15
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if not (mask >> u & 1) or dp[mask][u] >= INF: continue
            for v in range(n):
                if not (mask >> v & 1):
                    nm = mask | (1 << v)
                    if dp[mask][u] + dist[u][v] < dp[nm][v]:
                        dp[nm][v] = dp[mask][u] + dist[u][v]
    return min(dp[(1 << n) - 1][u] + dist[u][0] for u in range(n))`,explanation:`Dùng toán tử dịch bit trên Python rất trực quan và gọn.`}],practiceProblem:{id:`CS_P20`,title:`Hành trình Người Du Lịch Tối Thiểu (TSP Bitmask)`,difficulty:`Hard`,description:`Cho đồ thị đầy đủ gồm N thành phố (0..N-1, 2 ≤ N ≤ 15) và ma trận chi phí đi lại C[i][j]. Xuất phát từ thành phố 0, hãy tìm tổng chi phí nhỏ nhất để đi qua MỖI thành phố đúng 1 lần rồi quay trở về thành phố 0.`,inputFormat:`Dòng 1: N. N dòng tiếp theo: mỗi dòng gồm N số nguyên biểu thị ma trận C[i][j].`,outputFormat:`In ra chi phí nhỏ nhất tìm được.`,sampleCases:[{input:`4
0 10 15 20
10 0 35 25
15 35 0 30
20 25 30 0`,output:`80`,explanation:`Chu trình 0 → 1 → 3 → 2 → 0 có chi phí 10 + 25 + 30 + 15 = 80.`}],solutionAnalysis:"Quy hoạch động bitmask `dp[mask][u]` với $O(N^2 2^N)$ xử lý mượt tới $N = 16$.",basicAnalysis:`Cơ bản: Quay lui sinh hoán vị cho trường hợp N nhỏ.`,basicSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int n, c[20][20], ans = 1e9;
bool used[20];
void ql(int u, int cnt, int cost) {
    if (cost >= ans) return;
    if (cnt == n) { ans = min(ans, cost + c[u][0]); return; }
    for (int v = 1; v < n; v++) if (!used[v]) {
        used[v] = true; ql(v, cnt + 1, cost + c[u][v]); used[v] = false;
    }
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) cin >> c[i][j];
    used[0] = true; ql(0, 1, 0);
    cout << ans;
    return 0;
}`,basicSolutionPython:`n = int(input())
c = [list(map(int, input().split())) for _ in range(n)]
ans = 10**18
used = [False] * n; used[0] = True
def ql(u, cnt, cost):
    global ans
    if cost >= ans: return
    if cnt == n: ans = min(ans, cost + c[u][0]); return
    for v in range(1, n):
        if not used[v]:
            used[v] = True; ql(v, cnt + 1, cost + c[u][v]); used[v] = False
ql(0, 1, 0); print(ans)`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int n; if (!(cin >> n)) return 0;
    vector<vector<long long>> c(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> c[i][j];
    const long long INF = 1e18;
    vector<vector<long long>> dp(1 << n, vector<long long>(n, INF));
    dp[1][0] = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (!(mask >> u & 1) || dp[mask][u] >= INF) continue;
            for (int v = 0; v < n; v++) {
                if (mask >> v & 1) continue;
                int nm = mask | (1 << v);
                dp[nm][v] = min(dp[nm][v], dp[mask][u] + c[u][v]);
            }
        }
    }
    long long ans = INF;
    int full = (1 << n) - 1;
    for (int u = 0; u < n; u++) ans = min(ans, dp[full][u] + c[u][0]);
    cout << ans << '\\n';
    return 0;
}`,fullSolutionPython:`import sys

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    c = [[int(data[1 + i * n + j]) for j in range(n)] for i in range(n)]
    INF = 10**18
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for u in range(n):
            if not (mask >> u & 1) or dp[mask][u] >= INF: continue
            for v in range(n):
                if not (mask >> v & 1):
                    nm = mask | (1 << v)
                    val = dp[mask][u] + c[u][v]
                    if val < dp[nm][v]: dp[nm][v] = val
    full = (1 << n) - 1
    print(min(dp[full][u] + c[u][0] for u in range(n)))

solve()`}},{id:`cs-21`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Bao lồi QHĐ (CHT & Li Chao Tree)`,prerequisites:[`cs-7`,`cs-11`],lessonNumber:21,title:`Kỹ thuật Bao lồi QHĐ (Convex Hull Trick) & Cây Li Chao`,topic:`Tối ưu công thức DP bậc nhất dp[i] = min(a_j·x_i + b_j) từ O(N²) xuống O(N) / O(N log X)`,estimatedMinutes:25,theory:["1. Dấu hiệu nhận biết CHT: Công thức chuyển trạng thái Quy hoạch động có dạng `dp[i] = min_{j < i} (m_j * x_i + c_j) + const`, trong đó hệ số góc $m_j$ chỉ phụ thuộc $j$ và biến truy vấn $x_i$ chỉ phụ thuộc $i$ — tương ứng bài toán tìm đường thẳng thấp nhất tại hoành độ $x_i$!",`2. Hàng đợi hai đầu (Deque CHT): Khi hệ số góc $m_j$ giảm dần (hoặc tăng dần) đơn điệu, các đường thẳng hữu ích tạo thành bao dưới lồi. Mỗi lần thêm đường thẳng mới $l_3$, nếu giao điểm $(l_1, l_3)$ nằm bên trái giao điểm $(l_1, l_2)$ thì loại bỏ $l_2$ (bằng phép nhân chéo tránh sai số số thực!).`,"3. Cây Li Chao (Li Chao Segment Tree): Khi hệ số góc KHÔNG đơn điệu, mỗi nút trên cây quản lý một đoạn $[L, R]$ giữ duy nhất đường thẳng tốt nhất tại điểm giữa `mid`. Thêm mới hoặc truy vấn đều mất $O(\\log(\\text{Coord}))$."],complexity:{time:`O(N) với CHT đơn điệu, O(N log X) với Li Chao Tree`,space:`O(N)`},codeExamples:[{language:`cpp`,title:`C++ Convex Hull Trick đơn điệu (Tìm Min)`,basicTitle:`C++ Cơ bản: Tính dp[i] bằng 2 vòng lặp (O(N²))`,basicCode:`// Duyệt mọi j < i: dp[i] = min(dp[i], m[j] * x[i] + c[j]);`,basicExplanation:`Đúng với mọi dữ liệu nhưng tốn O(N²), dễ TLE khi N = 10⁵.`,code:`struct Line {
    long long m, c;
    long long eval(long long x) const { return m * x + c; }
};
// Loại l2 nếu l2 bị l1 và l3 che khuất (với m1 > m2 > m3)
bool bad(const Line& l1, const Line& l2, const Line& l3) {
    return (__int128)(l2.c - l1.c) * (l2.m - l3.m) >= (__int128)(l3.c - l2.c) * (l1.m - l2.m);
}`,explanation:`Dùng __int128 khi kiểm tra giao điểm giúp tuyệt đối không tràn số với hệ số 10⁹.`},{language:`python`,title:`Python CHT Bao Lồi`,basicTitle:`Python Cơ bản: Duyệt tất cả các đường thẳng`,basicCode:`def query_naive(lines, x):
    return min(m * x + c for m, c in lines)`,basicExplanation:`Minh họa phép tìm min(m*x + c) tại hoành độ x.`,code:`from collections import deque

def is_bad(l1, l2, l3):
    return (l2[1] - l1[1]) * (l2[0] - l3[0]) >= (l3[1] - l2[1]) * (l1[0] - l2[0])

def add_line(hull: deque, m: int, c: int):
    while len(hull) >= 2 and is_bad(hull[-2], hull[-1], (m, c)):
        hull.pop()
    hull.append((m, c))`,explanation:`Python hỗ trợ số nguyên lớn mặc định nên kiểm tra giao điểm không lo tràn số.`}],practiceProblem:{id:`CS_P21`,title:`Chi phí Chia Nhóm Tối Thiểu (CHT / DP O(N))`,difficulty:`Hard`,description:`Cho N điểm sắp xếp tăng dần x[1] < x[2] < ... < x[N] (1 ≤ N ≤ 10⁵) và hằng số K. Nếu ghép một nhóm liên tiếp từ l đến r sẽ tốn chi phí (x[r] - x[l])² + K. Hãy phân hoạch dãy thành các nhóm sao cho tổng chi phí là nhỏ nhất.`,inputFormat:`Dòng 1: N và K. Dòng 2: N số nguyên x[1..N] không giảm.`,outputFormat:`In ra tổng chi phí nhỏ nhất.`,sampleCases:[{input:`4 10
1 2 5 6`,output:`22`,explanation:`Chia thành 2 nhóm [1, 2] và [5, 6]: ((2-1)² + 10) + ((6-5)² + 10) = 11 + 11 = 22.`}],solutionAnalysis:"Viết lại công thức: `dp[i] = min_{j < i} (dp[j] + (x[i] - x[j+1])² + K) = x[i]² + K + min (-2*x[j+1]*x[i] + (dp[j] + x[j+1]²))`. Hệ số góc `m_j = -2*x[j+1]` giảm dần và `x[i]` tăng dần nên chạy CHT Deque trong O(N)!",basicAnalysis:`Cơ bản: Dùng vòng lặp DP 2 chiều O(N²).`,basicSolutionCpp:`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n; long long K; cin >> n >> K;
    vector<long long> x(n + 1), dp(n + 1, 4e18);
    for (int i = 1; i <= n; i++) cin >> x[i];
    dp[0] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++) {
            long long d = x[i] - x[j + 1];
            dp[i] = min(dp[i], dp[j] + d * d + K);
        }
    cout << dp[n];
    return 0;
}`,basicSolutionPython:`n, K = map(int, input().split())
x = [0] + list(map(int, input().split()))
dp = [0] + [10**18] * n
for i in range(1, n + 1):
    for j in range(i):
        dp[i] = min(dp[i], dp[j] + (x[i] - x[j + 1])**2 + K)
print(dp[n])`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <deque>
using namespace std;

struct Line {
    long long m, c;
    long long eval(long long x) const { return m * x + c; }
};
bool bad(const Line& a, const Line& b, const Line& c) {
    return (__int128)(b.c - a.c) * (b.m - c.m) >= (__int128)(c.c - b.c) * (a.m - b.m);
}
int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int n; long long K;
    if (!(cin >> n >> K)) return 0;
    vector<long long> x(n + 1), dp(n + 1, 0);
    for (int i = 1; i <= n; i++) cin >> x[i];
    deque<Line> hull;
    hull.push_back({-2 * x[1], x[1] * x[1]});
    for (int i = 1; i <= n; i++) {
        while (hull.size() >= 2 && hull[0].eval(x[i]) >= hull[1].eval(x[i]))
            hull.pop_front();
        dp[i] = x[i] * x[i] + K + hull[0].eval(x[i]);
        if (i < n) {
            Line nl = {-2 * x[i + 1], dp[i] + x[i + 1] * x[i + 1]};
            if (hull.back().m == nl.m) {
                if (nl.c < hull.back().c) hull.pop_back();
                else continue;
            }
            while (hull.size() >= 2 && bad(hull[hull.size() - 2], hull.back(), nl))
                hull.pop_back();
            hull.push_back(nl);
        }
    }
    cout << dp[n] << '\\n';
    return 0;
}`,fullSolutionPython:`import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n, K = int(data[0]), int(data[1])
    x = [0] + [int(v) for v in data[2:2 + n]]
    dp = [0] * (n + 1)
    hull = deque([(-2 * x[1], x[1] * x[1])])
    def eval_l(ln, v): return ln[0] * v + ln[1]
    def bad(a, b, c): return (b[1] - a[1]) * (b[0] - c[0]) >= (c[1] - b[1]) * (a[0] - b[0])
    for i in range(1, n + 1):
        while len(hull) >= 2 and eval_l(hull[0], x[i]) >= eval_l(hull[1], x[i]):
            hull.popleft()
        dp[i] = x[i] * x[i] + K + eval_l(hull[0], x[i])
        if i < n:
            nl = (-2 * x[i + 1], dp[i] + x[i + 1] * x[i + 1])
            if hull[-1][0] == nl[0]:
                if nl[1] < hull[-1][1]: hull.pop()
                else: continue
            while len(hull) >= 2 and bad(hull[-2], hull[-1], nl):
                hull.pop()
            hull.append(nl)
    print(dp[n])

solve()`}},{id:`cs-22`,level:`Nâng cao / HSG`,vnoiPhase:`Phase 4 · Cấu trúc dữ liệu & HSG`,vnoiTag:`VNOI Wiki · Tìm đường A* Heuristic & Octree 3D`,prerequisites:[`cs-8`],lessonNumber:22,title:`Thuật toán Tìm đường A* Heuristic & Phân hoạch Không gian Octree 3D`,topic:`Hàm đánh giá f(n) = g(n) + h(n) (Manhattan/Euclidean) & Cây bát phân 8 vùng 3D`,estimatedMinutes:22,theory:["1. Từ Dijkstra đến Thuật toán A*: Thuật toán Dijkstra mở rộng đều theo mọi hướng vì chỉ xét khoảng cách thực từ gốc `g(n)`. Thuật toán A* sử dụng hàm ưu tiên $f(n) = g(n) + h(n)$, trong đó $h(n)$ là ước lượng khoảng cách từ $n$ tới đích (Heuristic).",`2. Điều kiện tối ưu (Admissible Heuristic): Nếu $h(n)$ không bao giờ ước lượng LỚN HƠN chi phí thực tế tới đích (ví dụ khoảng cách Manhattan trên lưới 4 hướng hoặc Euclidean trên không gian 3D), A* đảm bảo tìm ra đường đi NGẮN NHẤT mà duyệt ít ô hơn hẳn Dijkstra!`,`3. Phân hoạch Không gian Octree 3D: Tương tự Quadtree trên mặt phẳng 2D chia một hình vuông thành 4 phần, Octree chia đệ quy một khối hộp lập phương 3D thành **8 khối hộp con (Octants)** theo 3 trục $X, Y, Z$ — cấu trúc xương sống của mọi Game Engine 3D, Robotics SLAM và phát hiện va chạm hàng triệu vật thể.`],complexity:{time:`O((V + E) log V) cho A*, O(log₈ Vol) cho truy vấn Octree`,space:`O(V) / O(N)`},codeExamples:[{language:`cpp`,title:`C++ Tìm đường A* trên Lưới 2D/3D với Manhattan Heuristic`,basicTitle:`C++ Cơ bản: BFS tìm đường ngắn nhất không trọng số`,basicCode:`// Với lưới không trọng số, BFS luôn tìm được đường ngắn nhất O(R·C)
// trong khi A* định hướng thẳng về đích nhờ hàm f = g + h.`,basicExplanation:`BFS duyệt đồng tâm; A* ưu tiên nhánh hướng về mục tiêu.`,code:`struct Node {
    int x, y, g, f;
    bool operator>(const Node& o) const { return f > o.f; }
};
int manhattan(int x1, int y1, int x2, int y2) {
    return abs(x1 - x2) + abs(y1 - y2);
}`,explanation:`Khoảng cách Manhattan luôn ≤ đường đi thực trên lưới 4 hướng nên A* luôn tối ưu.`},{language:`python`,title:`Python A* Heuristic Priority Queue`,basicTitle:`Python Cơ bản: BFS trên lưới bằng deque`,basicCode:`from collections import deque
# Dùng deque mở rộng 4 hướng kề hợp lệ trên lưới.`,basicExplanation:`Dùng để so sánh số bước mở rộng của BFS so với A*.`,code:`import heapq

def a_star_grid(grid, sx, sy, tx, ty):
    R, C = len(grid), len(grid[0])
    g = {(sx, sy): 0}
    pq = [(abs(sx - tx) + abs(sy - ty), 0, sx, sy)]
    while pq:
        f, cur_g, x, y = heapq.heappop(pq)
        if (x, y) == (tx, ty):
            return cur_g
        if cur_g > g.get((x, y), 10**9):
            continue
        for dx, dy in ((1,0), (-1,0), (0,1), (0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < R and 0 <= ny < C and grid[nx][ny] == 0:
                ng = cur_g + 1
                if ng < g.get((nx, ny), 10**9):
                    g[(nx, ny)] = ng
                    heapq.heappush(pq, (ng + abs(nx - tx) + abs(ny - ty), ng, nx, ny))
    return -1`,explanation:`Ưu tiên mở rộng ô có f = g + h nhỏ nhất bằng heapq.`}],practiceProblem:{id:`CS_P22`,title:`Tìm đường Ngắn nhất trên Mê cung Có vật cản (A* / BFS)`,difficulty:`Medium`,description:"Cho lưới kích thước R × C (1 ≤ R, C ≤ 500) gồm các ô trống `.` và ô tường `#`. Xuất phát từ ô góc trên trái (1, 1), hãy tìm số bước ít nhất để đi tới ô góc dưới phải (R, C) bằng cách di chuyển sang 4 ô kề cạnh. In -1 nếu không có đường đi.",inputFormat:"Dòng 1: R và C. R dòng tiếp theo: mỗi dòng C ký tự (`.` hoặc `#`).",outputFormat:`In ra số bước ngắn nhất từ (1, 1) đến (R, C), hoặc -1.`,sampleCases:[{input:`3 4
..#.
.#..
...#`,output:`-1`,explanation:"Ô đích (3, 4) bị tường `#` chặn hoặc không có đường đi hợp lệ."},{input:`3 3
..#
.#.
...`,output:`4`,explanation:`Đường đi (1,1)→(2,1)→(3,1)→(3,2)→(3,3) tốn 4 bước.`}],solutionAnalysis:`Dùng thuật toán A* với hàm Heuristic Manhattan $h(x, y) = |R - x| + |C - y|$ (hoặc BFS O(R·C)) từ (0, 0) đến (R-1, C-1).`,basicAnalysis:`Cơ bản: Duyệt BFS bằng hàng đợi queue lưu tọa độ (r, c) và khoảng cách.`,basicSolutionCpp:`#include <iostream>
#include <vector>
#include <queue>
#include <string>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    vector<string> g(r);
    for (int i = 0; i < r; i++) cin >> g[i];
    if (g[0][0] == '#' || g[r - 1][c - 1] == '#') { cout << -1; return 0; }
    vector<vector<int>> d(r, vector<int>(c, -1));
    queue<pair<int, int>> q;
    d[0][0] = 0; q.push({0, 0});
    int dx[4] = {1, -1, 0, 0}, dy[4] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && g[nx][ny] == '.' && d[nx][ny] == -1) {
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    cout << d[r - 1][c - 1];
    return 0;
}`,basicSolutionPython:`from collections import deque
r, c = map(int, input().split())
g = [input().strip() for _ in range(r)]
if g[0][0] == '#' or g[r - 1][c - 1] == '#':
    print(-1)
else:
    d = [[-1] * c for _ in range(r)]
    d[0][0] = 0; q = deque([(0, 0)])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0), (-1,0), (0,1), (0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < r and 0 <= ny < c and g[nx][ny] == '.' and d[nx][ny] == -1:
                d[nx][ny] = d[x][y] + 1; q.append((nx, ny))
    print(d[r - 1][c - 1])`,fullSolutionCpp:`#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <cmath>
using namespace std;

struct State {
    int f, g, x, y;
    bool operator>(const State& o) const { return f > o.f; }
};

int main() {
    ios_base::sync_with_stdio(false); cin.tie(NULL);
    int r, c;
    if (!(cin >> r >> c)) return 0;
    vector<string> grid(r);
    for (int i = 0; i < r; i++) cin >> grid[i];
    if (grid[0][0] == '#' || grid[r - 1][c - 1] == '#') {
        cout << -1 << '\\n';
        return 0;
    }
    const int INF = 1e9;
    vector<vector<int>> g(r, vector<int>(c, INF));
    priority_queue<State, vector<State>, greater<State>> pq;
    g[0][0] = 0;
    pq.push({(r - 1) + (c - 1), 0, 0, 0});
    int dx[4] = {1, -1, 0, 0}, dy[4] = {0, 0, 1, -1};
    while (!pq.empty()) {
        auto cur = pq.top(); pq.pop();
        if (cur.x == r - 1 && cur.y == c - 1) {
            cout << cur.g << '\\n';
            return 0;
        }
        if (cur.g > g[cur.x][cur.y]) continue;
        for (int k = 0; k < 4; k++) {
            int nx = cur.x + dx[k], ny = cur.y + dy[k];
            if (nx >= 0 && nx < r && ny >= 0 && ny < c && grid[nx][ny] == '.') {
                int ng = cur.g + 1;
                if (ng < g[nx][ny]) {
                    g[nx][ny] = ng;
                    int h = abs(r - 1 - nx) + abs(c - 1 - ny);
                    pq.push({ng + h, ng, nx, ny});
                }
            }
        }
    }
    cout << -1 << '\\n';
    return 0;
}`,fullSolutionPython:`import sys, heapq

def solve():
    data = sys.stdin.read().split()
    if not data: return
    r, c = int(data[0]), int(data[1])
    grid = data[2:2 + r]
    if grid[0][0] == '#' or grid[r - 1][c - 1] == '#':
        print(-1); return
    INF = 10**9
    g = [[INF] * c for _ in range(r)]
    g[0][0] = 0
    pq = [(r + c - 2, 0, 0, 0)]
    while pq:
        f, cg, x, y = heapq.heappop(pq)
        if (x, y) == (r - 1, c - 1):
            print(cg); return
        if cg > g[x][y]: continue
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < r and 0 <= ny < c and grid[nx][ny] == '.':
                ng = cg + 1
                if ng < g[nx][ny]:
                    g[nx][ny] = ng
                    heapq.heappush(pq, (ng + (r - 1 - nx) + (c - 1 - ny), ng, nx, ny))
    print(-1)

solve()`}}],r=[...[{id:`cs-1`,level:`Cơ bản`,lessonNumber:1,title:`Kiểu dữ liệu, Biến & Kỹ thuật Nhập/Xuất Chuẩn Tối Ưu`,topic:`Cú pháp cơ bản & Fast I/O`,estimatedMinutes:12,theory:["1. Các kiểu dữ liệu nguyên thủy: `int` (-2·10⁹ đến 2·10⁹, 4 bytes), `long long` (-9·10¹⁸ đến 9·10¹⁸, 8 bytes), `double` (số thực dấu phẩy động 64-bit), `char` (1 byte), `bool` (true/false).","2. Hiện tượng tràn số (Integer Overflow): Khi tổng hoặc tích của hai số `int` vượt quá 2·10⁹, kết quả sẽ bị quay vòng thành số âm. Phải ép kiểu sang `long long` bằng cú pháp `1LL * a * b`.","3. Kỹ thuật Fast I/O trong C++: Mặc định `cin`/`cout` đồng bộ với `stdio` của C khiến tốc độ đọc chậm khi N ≥ 10⁵. Luôn thêm 2 dòng vào đầu hàm `main()`: `ios_base::sync_with_stdio(false); cin.tie(NULL);` và dùng `'\\n'` thay cho `endl`."],complexity:{time:`O(1) cho các phép toán số học`,space:`O(1)`},codeExamples:[{language:`cpp`,title:`C++20 Fast I/O & Xử lý Tràn số`,basicTitle:`C++ Cơ bản: Nhập xuất cin/cout trực tiếp trong main`,basicCode:`#include <iostream>
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