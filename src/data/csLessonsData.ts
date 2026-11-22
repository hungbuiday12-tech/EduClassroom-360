import { CSLesson } from '../types';
import { EXTRA_VNOI_LESSONS, VNOI_LESSON_ENRICHMENT } from './csVnoiModules';
import { CS_EXTRA_10_LESSONS } from './csExtra10Lessons';

const BASE_CS_LESSONS: CSLesson[] = [
  // ==========================================
  // CẤP ĐỘ 1: CƠ BẢN (BEGINNER)
  // ==========================================
  {
    id: 'cs-1',
    level: 'Cơ bản',
    lessonNumber: 1,
    title: 'Kiểu dữ liệu, Biến & Kỹ thuật Nhập/Xuất Chuẩn Tối Ưu',
    topic: 'Cú pháp cơ bản & Fast I/O',
    estimatedMinutes: 12,
    theory: [
      '1. Các kiểu dữ liệu nguyên thủy: `int` (-2·10⁹ đến 2·10⁹, 4 bytes), `long long` (-9·10¹⁸ đến 9·10¹⁸, 8 bytes), `double` (số thực dấu phẩy động 64-bit), `char` (1 byte), `bool` (true/false).',
      '2. Hiện tượng tràn số (Integer Overflow): Khi tổng hoặc tích của hai số `int` vượt quá 2·10⁹, kết quả sẽ bị quay vòng thành số âm. Phải ép kiểu sang `long long` bằng cú pháp `1LL * a * b`.',
      '3. Kỹ thuật Fast I/O trong C++: Mặc định `cin`/`cout` đồng bộ với `stdio` của C khiến tốc độ đọc chậm khi N ≥ 10⁵. Luôn thêm 2 dòng vào đầu hàm `main()`: `ios_base::sync_with_stdio(false); cin.tie(NULL);` và dùng `\'\\n\'` thay cho `endl`.'
    ],
    complexity: {
      time: 'O(1) cho các phép toán số học',
      space: 'O(1)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++20 Fast I/O & Xử lý Tràn số',
        basicTitle: 'C++ Cơ bản: Nhập xuất cin/cout trực tiếp trong main',
        basicCode: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << "Tong: " << a + b << endl;
    cout << "Tich: " << a * b << endl;
    return 0;
}`,
        basicExplanation: 'Phiên bản tối giản chỉ khai báo hai biến long long a, b trong main() và dùng cin/cout cơ bản.',
        code: `#include <iostream>
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
}`,
        explanation: 'Khai báo kiểu long long cho a và b giúp phép nhân a * b không bị tràn số khi a, b lên đến 10⁹.'
      },
      {
        language: 'python',
        title: 'Python 3 Nhập xuất tối ưu sys.stdin',
        basicTitle: 'Python Cơ bản: input().split() tuần tự',
        basicCode: `a, b = map(int, input().split())
print("Tong:", a + b)
print("Tich:", a * b)`,
        basicExplanation: 'Cách viết ngắn gọn nhất cho người mới: dùng input().split() và không cần định nghĩa hàm.',
        code: `import sys

def main():
    # Đọc nhanh toàn bộ dòng dữ liệu
    input_data = sys.stdin.read().split()
    if input_data:
        a = int(input_data[0])
        b = int(input_data[1])
        print(f"Tong: {a + b}")
        print(f"Tich: {a * b}")

if __name__ == '__main__':
    main()`,
        explanation: 'Python tự động hỗ trợ số nguyên lớn vô hạn (Arbitrary-precision integer) nên không lo tràn số.'
      }
    ],
    practiceProblem: {
      id: 'CS_P1',
      title: 'Tính tổng và tích hai số lớn',
      difficulty: 'Easy',
      description: 'Cho hai số nguyên a và b (-10⁹ ≤ a, b ≤ 10⁹). Hãy tính và in ra trên 2 dòng: dòng 1 là tổng a + b, dòng 2 là tích a * b.',
      inputFormat: 'Một dòng chứa 2 số nguyên a và b cách nhau dấu cách.',
      outputFormat: 'Dòng 1 in tổng a + b. Dòng 2 in tích a * b.',
      sampleCases: [
        {
          input: '1000000000 2000000000',
          output: '3000000000\n2000000000000000000',
          explanation: 'Tích 10⁹ * 2·10⁹ = 2·10¹⁸ vượt quá giới hạn 2·10⁹ của kiểu int, bắt buộc phải dùng long long trong C++.'
        }
      ],
      solutionAnalysis: 'Với giới hạn a, b lên tới 10⁹, tổng a+b tối đa 2·10⁹ (vẫn vừa int nhưng sát ngưỡng), còn tích a*b lên tới 10¹⁸ (bắt buộc dùng long long trong C++). Sử dụng phép nhân với kiểu long long để tránh tràn số.',
      basicAnalysis: 'Cơ bản: Nhập trực tiếp a, b kiểu long long trong hàm main() và in a + b, a * b không cần cấu hình Fast I/O.',
      basicSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << endl;
    cout << a * b << endl;
    return 0;
}`,
      basicSolutionPython: `a, b = map(int, input().split())
print(a + b)
print(a * b)`,
      fullSolutionCpp: `#include <iostream>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    long long a, b;
    cin >> a >> b;
    cout << a + b << '\\n';
    cout << a * b << '\\n';
    return 0;
}`,
      fullSolutionPython: `import sys

def solve():
    line = sys.stdin.read().split()
    if line:
        a = int(line[0])
        b = int(line[1])
        print(a + b)
        print(a * b)

solve()`
    }
  },
  {
    id: 'cs-2',
    level: 'Cơ bản',
    lessonNumber: 2,
    title: 'Cấu trúc Rẽ nhánh If-Else & Vòng lặp For/While Tối Ưu',
    topic: 'Kiểm tra Số nguyên tố O(√N) & Số hoàn hảo',
    estimatedMinutes: 15,
    theory: [
      '1. Cấu trúc rẽ nhánh `if - else if - else`: Kiểm tra các trường hợp loại trừ lẫn nhau, toán tử logic `&&` (AND), `||` (OR), `!` (NOT).',
      '2. Thuật toán kiểm tra số nguyên tố tối ưu $O(\\sqrt{N})$: Một số $N > 1$ là số nguyên tố nếu không chia hết cho bất kỳ số nào từ $2$ đến $\\lfloor\\sqrt{N}\\rfloor$. Vì nếu $N = u \\cdot v$ với $u \\le v$ thì chắc chắn $u \\le \\sqrt{N}$.',
      '3. Vòng lặp `while` và `for`: Luôn chú ý điều kiện dừng để tránh vòng lặp vô tận (Infinite Loop). Câu lệnh `break` thoát khỏi vòng lặp ngay lập tức, `continue` bỏ qua lượt lặp hiện tại.'
    ],
    complexity: {
      time: 'O(√N) cho kiểm tra số nguyên tố',
      space: 'O(1)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Kiểm tra Số nguyên tố O(√N) bước nhảy 6k±1',
        basicTitle: 'C++ Cơ bản: Vòng lặp kiểm tra ước viết thẳng trong main',
        basicCode: `#include <iostream>
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
}`,
        basicExplanation: 'Duyệt đơn giản từng ước i từ 2 đến căn N ngay trong main(), không tách hàm phụ.',
        code: `#include <iostream>
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
}`,
        explanation: 'Duyệt bước nhảy 6k ± 1 giúp giảm số phép chia đi 3 lần so với duyệt thông thường.'
      },
      {
        language: 'python',
        title: 'Python Hàm is_prime(n) tối ưu 6k±1',
        basicTitle: 'Python Cơ bản: Vòng lặp while i * i <= n tối giản',
        basicCode: `n = 1000000007
la_nt = n >= 2
i = 2
while i * i <= n:
    if n % i == 0:
        la_nt = False
        break
    i += 1
print(la_nt)`,
        basicExplanation: 'Chỉ dùng 1 vòng while đơn giản kiểm tra chia hết từ 2 tới căn N.',
        code: `def is_prime(n: int) -> bool:
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

print(is_prime(1000000007)) # True`,
        explanation: 'Tối ưu vòng lặp bằng cách dừng ngay khi i * i > n.'
      }
    ],
    practiceProblem: {
      id: 'CS_P2',
      title: 'Đếm số lượng số nguyên tố trong đoạn',
      difficulty: 'Easy',
      description: 'Cho số nguyên dương N (1 ≤ N ≤ 10⁵). Hãy đếm xem có bao nhiêu số nguyên tố nhỏ hơn hoặc bằng N.',
      inputFormat: 'Một số nguyên dương N duy nhất.',
      outputFormat: 'In ra số lượng số nguyên tố trong khoảng [2; N].',
      sampleCases: [
        {
          input: '10',
          output: '4',
          explanation: 'Các số nguyên tố ≤ 10 là: 2, 3, 5, 7. Tổng cộng có 4 số.'
        }
      ],
      solutionAnalysis: 'Dùng sàng nguyên tố Eratosthenes để đạt độ phức tạp O(N log log N) cực nhanh với N = 10⁵.',
      basicAnalysis: 'Cơ bản: Duyệt từng số x từ 2 tới N, kiểm tra xem x có chia hết cho số nào từ 2 tới √x hay không và tăng biến đếm (O(N√N), không cần mảng sàng).',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n = int(input())
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
print(dem)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys

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

sieve()`
    }
  },
  {
    id: 'cs-3',
    level: 'Cơ bản',
    lessonNumber: 3,
    title: 'Mảng 1 Chiều, Đếm Tần Số & Xử lý Chuỗi Ký Tự',
    topic: 'Kỹ thuật Mảng đếm & Xâu đối xứng Palindrome',
    estimatedMinutes: 14,
    theory: [
      '1. Mảng và Vector: `vector<int> a(N)` có thể co giãn linh hoạt, truy cập phần tử `a[i]` trong $O(1)$.',
      '2. Kỹ thuật mảng đếm (Frequency Array / Bucket): Cho dãy số các giá trị nhỏ hơn $10^6$, ta dùng mảng `cnt[x]` để đếm số lần xuất hiện của giá trị $x$ chỉ trong một lần duyệt $O(N)$.',
      '3. Xử lý chuỗi (String): Kiểm tra xâu đối xứng (Palindrome) bằng cách so sánh ký tự đầu $s[i]$ với ký tự cuối $s[len - 1 - i]$. Đảo ngược chuỗi bằng `reverse(s.begin(), s.end())`.'
    ],
    complexity: {
      time: 'O(N) duyệt tuyến tính',
      space: 'O(max_value) hoặc O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Hai con trỏ kiểm tra Palindrome tối ưu',
        basicTitle: 'C++ Cơ bản: Đảo chuỗi bằng vòng lặp for',
        basicCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "radar", rev = "";
    for (int i = (int)s.size() - 1; i >= 0; i--) {
        rev += s[i];
    }
    cout << (s == rev ? "YES" : "NO") << '\\n';
    return 0;
}`,
        basicExplanation: 'Tạo chuỗi đảo ngược rev bằng vòng for lùi và so sánh trực tiếp s == rev ngay trong main().',
        code: `#include <iostream>
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
}`,
        explanation: 'Kỹ thuật hai con trỏ so khớp đối xứng từ hai đầu chuỗi tiến về tâm trong O(N) với O(1) bộ nhớ phụ.'
      },
      {
        language: 'python',
        title: 'Python Slicing chuỗi s == s[::-1]',
        basicTitle: 'Python Cơ bản: Vòng lặp so sánh hai đầu chuỗi',
        basicCode: `s = "radar"
ok = True
for i in range(len(s) // 2):
    if s[i] != s[len(s) - 1 - i]:
        ok = False
        break
print("YES" if ok else "NO")`,
        basicExplanation: 'Dùng vòng for duyệt nửa đầu chuỗi, so sánh ký tự thứ i với ký tự đối xứng ở cuối.',
        code: `def is_palindrome(s: str) -> bool:
    # Slicing đảo ngược chuỗi cực nhanh
    return s == s[::-1]

print("YES" if is_palindrome("radar") else "NO")`,
        explanation: 'Trong Python, cú pháp s[::-1] đảo ngược chuỗi trong C-level memory speed.'
      }
    ],
    practiceProblem: {
      id: 'CS_P3',
      title: 'Tìm phần tử xuất hiện nhiều nhất trong mảng',
      difficulty: 'Easy',
      description: 'Cho mảng gồm N số nguyên dương (1 ≤ N ≤ 10⁵, 1 ≤ a[i] ≤ 10⁵). Hãy tìm số có số lần xuất hiện nhiều nhất. Nếu có nhiều số cùng số lần xuất hiện, in ra số có giá trị nhỏ nhất.',
      inputFormat: 'Dòng 1 ghi số N. Dòng 2 ghi N số nguyên cách nhau dấu cách.',
      outputFormat: 'In ra số xuất hiện nhiều nhất và tần số của nó cách nhau dấu cách.',
      sampleCases: [
        {
          input: '6\n2 3 2 4 3 2',
          output: '2 3',
          explanation: 'Số 2 xuất hiện 3 lần (nhiều nhất).'
        }
      ],
      solutionAnalysis: 'Duyệt mảng một lần cập nhật cnt[a[i]]. Sau đó tìm max_count và phần tử nhỏ nhất đạt max_count trong O(N + maxA).',
      basicAnalysis: 'Cơ bản: Nhập mảng a[N], với mỗi phần tử a[i] dùng một vòng lặp đếm xem a[i] xuất hiện bao nhiêu lần rồi cập nhật đáp án (O(N²), dễ hiểu không cần mảng đánh dấu).',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n = int(input())
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
print(best_val, best_cnt)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys

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

solve()`
    }
  },

  // ==========================================
  // CẤP ĐỘ 2: TRUNG CẤP (INTERMEDIATE)
  // ==========================================
  {
    id: 'cs-4',
    level: 'Trung cấp',
    lessonNumber: 4,
    title: 'Hàm, Đệ Quy & Kỹ thuật Quay lui (Backtracking)',
    topic: 'Cây đệ quy, Bài toán sinh hoán vị & Xếp Hậu',
    estimatedMinutes: 18,
    theory: [
      '1. Khái niệm đệ quy: Hàm gọi lại chính nó với kích thước bài toán nhỏ hơn. Cấu trúc gồm 2 phần bắt buộc: Điều kiện dừng (Base Case) và Bước đệ quy (Recursive Step).',
      '2. Kỹ thuật Quay lui (Backtracking): Thử tất cả các khả năng xây dựng nghiệm từng bước. Khi phát hiện một nhánh không thể dẫn đến lời giải hợp lệ, thuật toán lập tức "quay lui" (hoàn tác trạng thái) để thử nhánh khác.',
      '3. Bài toán sinh hoán vị của $N$ phần tử: Dùng mảng đánh dấu `used[i]` để đảm bảo mỗi phần tử chỉ xuất hiện 1 lần. Độ phức tạp thời gian $O(N!)$.'
    ],
    complexity: {
      time: 'O(N!) cho hoán vị, O(2ⁿ) cho tập con',
      space: 'O(N) ngăn xếp đệ quy'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Quay lui Sinh Hoán vị',
        basicTitle: 'C++ Cơ bản: Liệt kê hoán vị N = 3 bằng 3 vòng lặp lồng nhau',
        basicCode: `#include <iostream>
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
}`,
        basicExplanation: 'Viết trực tiếp bằng các vòng lặp for lồng nhau trong main() giúp hiểu bản chất sinh hoán vị trước khi tổng quát thành đệ quy.',
        code: `#include <iostream>
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
}`,
        explanation: 'Mỗi khi gọi backtrack(k+1) xong, ta gán lại used[i] = false để nhả lại trạng thái cho các nhánh sau.'
      },
      {
        language: 'python',
        title: 'Python Đệ quy Sinh Hoán vị',
        basicTitle: 'Python Cơ bản: Vòng lặp lồng nhau không dùng đệ quy',
        basicCode: `for i in range(1, 4):
    for j in range(1, 4):
        for k in range(1, 4):
            if i != j and j != k and i != k:
                print(i, j, k)`,
        basicExplanation: 'Dùng 3 vòng lặp trực quan cho trường hợp N = 3 trước khi tổng quát hóa bằng quay lui.',
        code: `def permute(n: int):
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

permute(3)`,
        explanation: 'current.pop() và used[i] = False là thao tác quay lui hoàn tác.'
      }
    ],
    practiceProblem: {
      id: 'CS_P4',
      title: 'Bài toán Xếp N Quân Hậu (N-Queens)',
      difficulty: 'Medium',
      description: 'Cho bàn cờ vua kích thước N x N (1 ≤ N ≤ 12). Hãy đếm xem có bao nhiêu cách xếp N quân hậu lên bàn cờ sao cho không có 2 quân hậu nào tấn công lẫn nhau (không cùng hàng, cùng cột, cùng đường chéo).',
      inputFormat: 'Một số nguyên dương N.',
      outputFormat: 'In ra số lượng cách xếp hợp lệ.',
      sampleCases: [
        {
          input: '4',
          output: '2',
          explanation: 'Với bàn cờ 4x4, có đúng 2 cấu hình xếp hậu không ăn nhau.'
        }
      ],
      solutionAnalysis: 'Duyệt từng hàng r từ 0 đến N-1. Ở mỗi hàng chọn cột c. Dùng các mảng đánh dấu cột `col[c]`, đường chéo chính `diag1[r - c + N]`, đường chéo phụ `diag2[r + c]` để kiểm tra hợp lệ trong O(1).',
      basicAnalysis: 'Cơ bản: Chỉ dùng 1 mảng cot[r] lưu vị trí cột của quân hậu ở hàng r; khi đặt hậu ở hàng r, chạy một vòng for kiểm tra xung đột với các hàng trước đó (dễ đọc, không cần công thức dịch chỉ số đường chéo).',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n = int(input())
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
print(ways)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys

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

solve()`
    }
  },
  {
    id: 'cs-5',
    level: 'Trung cấp',
    lessonNumber: 5,
    title: 'Tìm Kiếm Nhị Phân & Kỹ Thuật Chặt Nhị Phân Kết Quả',
    topic: 'Binary Search O(log N) & Chặt nhị phân trên tập kết quả',
    estimatedMinutes: 16,
    theory: [
      '1. Thuật toán tìm kiếm nhị phân cổ điển: Yêu cầu mảng ĐÃ ĐƯỢC SẮP XẾP. Mỗi bước so sánh phần tử ở giữa `mid = (left + right) / 2` để loại bỏ 50% không gian tìm kiếm. Độ phức tạp $O(\\log N)$.',
      '2. Hàm `lower_bound` và `upper_bound`: Trong C++, `lower_bound(a.begin(), a.end(), x)` trả về vị trí phần tử đầu tiên $\\ge x$.',
      '3. Kỹ thuật chặt nhị phân kết quả (Binary Search on Answer): Khi bài toán yêu cầu tìm giá trị lớn nhất hoặc nhỏ nhất $X$ thỏa mãn điều kiện $P(X)$, và hàm kiểm tra $P(X)$ có tính đơn điệu (Monotonicity: nếu $X$ thỏa thì mọi giá trị $\\le X$ cũng thỏa), ta có thể chặt nhị phân trực tiếp trên biến $X$!'
    ],
    complexity: {
      time: 'O(log N) cho tìm kiếm, O(K log(Max - Min)) cho chặt kết quả',
      space: 'O(1)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Tìm kiếm Nhị phân & lower_bound',
        basicTitle: 'C++ Cơ bản: Tìm vị trí X tuần tự bằng vòng lặp for (O(N))',
        basicCode: `#include <iostream>
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
}`,
        basicExplanation: 'Tìm kiếm tuyến tính từng phần tử một ngay trong main() — thuật toán cơ bản trước khi tối ưu sang chia đôi nhị phân.',
        code: `#include <iostream>
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
}`,
        explanation: 'Cách viết mid = left + (right - left) / 2 là chuẩn an toàn tránh tràn số nguyên.'
      },
      {
        language: 'python',
        title: 'Python bisect_left chuẩn thư viện',
        basicTitle: 'Python Cơ bản: Vòng lặp while left <= right tự cài',
        basicCode: `a = [1, 3, 5, 7, 9, 11]
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
print(ans)`,
        basicExplanation: 'Tự viết vòng while nhị phân không dùng module bisect để nắm rõ cách dịch hai biên.',
        code: `import bisect

a = [1, 3, 5, 7, 9, 11]
idx = bisect.bisect_left(a, 7)
print(f"Vi tri dau tien >= 7: {idx}")`,
        explanation: 'Module bisect của Python triển khai binary search tối ưu trong C.'
      }
    ],
    practiceProblem: {
      id: 'CS_P5',
      title: 'Chặt nhị phân: Chia mảng thành K đoạn có tổng lớn nhất nhỏ nhất',
      difficulty: 'Medium',
      description: 'Cho mảng gồm N số nguyên dương và số nguyên K (1 ≤ K ≤ N ≤ 10⁵). Hãy chia mảng thành K đoạn liên tiếp sao cho tổng của đoạn có tổng lớn nhất là NHỎ NHẤT có thể.',
      inputFormat: 'Dòng 1: N và K. Dòng 2: N số nguyên dương a[i] (1 ≤ a[i] ≤ 10⁹).',
      outputFormat: 'In ra giá trị tổng lớn nhất nhỏ nhất tìm được.',
      sampleCases: [
        {
          input: '5 2\n7 2 5 10 8',
          output: '18',
          explanation: 'Chia thành 2 đoạn: [7, 2, 5] (tổng 14) và [10, 8] (tổng 18). Tổng lớn nhất là 18 (tối ưu nhất).'
        }
      ],
      solutionAnalysis: 'Chặt nhị phân giá trị tổng maxTarget từ max(a) đến sum(a). Với mỗi mid, dùng hàm tham lam đếm số đoạn cần thiết. Nếu số đoạn <= K thì thử giá trị nhỏ hơn.',
      basicAnalysis: 'Cơ bản: Nhúng thẳng phần kiểm tra chia đoạn vào trong vòng lặp chặt nhị phân ngay trong hàm main(), dùng mảng tĩnh không cần tách hàm phụ hay thư viện <numeric>.',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n, k = map(int, input().split())
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
print(ans)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys

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

solve()`
    }
  },
  {
    id: 'cs-6',
    level: 'Trung cấp',
    lessonNumber: 6,
    title: 'Mảng Cộng Dồn (Prefix Sum) & Kỹ thuật Hai Con Trỏ (Two Pointers)',
    topic: 'Truy vấn Tổng đoạn con O(1) & Cặp số có tổng bằng S',
    estimatedMinutes: 15,
    theory: [
      '1. Mảng tiền tố (Prefix Sum): Cho mảng $a$, mảng cộng dồn $pref[i] = pref[i-1] + a[i]$ (với $pref[0] = 0$). Khi đó tổng các phần tử từ chỉ số $L$ đến $R$ được tính trong $O(1)$: $Sum(L, R) = pref[R] - pref[L-1]$.',
      '2. Mảng cộng dồn 2D: Hỗ trợ tính tổng hình chữ nhật con trong ma trận $O(1)$ với công thức: $Sum(r_1, c_1, r_2, c_2) = S[r_2][c_2] - S[r_1-1][c_2] - S[r_2][c_1-1] + S[r_1-1][c_1-1]$.',
      '3. Kỹ thuật Hai con trỏ (Two Pointers): Dùng 2 chỉ số `left` và `right` cùng trượt trên mảng để giải các bài toán tìm cặp số có tổng bằng $X$, đoạn con dài nhất có tổng $\\le S$ trong thời gian tuyến tính $O(N)$.'
    ],
    complexity: {
      time: 'O(N) tiền xử lý, O(1) mỗi truy vấn',
      space: 'O(N)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Hai con trỏ tìm cặp có tổng bằng S (O(N))',
        basicTitle: 'C++ Cơ bản: Hai vòng lặp for kiểm tra mọi cặp (O(N²))',
        basicCode: `#include <iostream>
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
}`,
        basicExplanation: 'Ý tưởng trực giác nhất: duyệt mọi cặp (i, j) bằng 2 vòng lặp for trong main().',
        code: `#include <iostream>
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
}`,
        explanation: 'Kỹ thuật hai con trỏ co lại từ hai đầu chỉ tốn O(N) thay vì O(N²) của vòng lặp lồng nhau.'
      },
      {
        language: 'python',
        title: 'Python Prefix Sum itertools.accumulate',
        basicTitle: 'Python Cơ bản: Tính mảng cộng dồn bằng vòng for đơn giản',
        basicCode: `a = [3, 2, 4, 5, 1]
pref = [0] * (len(a) + 1)
for i in range(len(a)):
    pref[i + 1] = pref[i] + a[i]
L, R = 1, 3
print("Tong doan:", pref[R + 1] - pref[L])`,
        basicExplanation: 'Tự cộng dồn từng bước bằng vòng lặp for, không cần import itertools.',
        code: `from itertools import accumulate

a = [3, 2, 4, 5, 1]
# pref = [0, 3, 5, 9, 14, 15]
pref = [0] + list(accumulate(a))

# Truy vấn tổng từ index 1 đến 3 (tức a[1] + a[2] + a[3] = 2 + 4 + 5 = 11):
L, R = 1, 3
print("Tong doan:", pref[R + 1] - pref[L])`,
        explanation: 'Hàm itertools.accumulate tạo mảng cộng dồn cực kỳ ngắn gọn.'
      }
    ],
    practiceProblem: {
      id: 'CS_P6',
      title: 'Đoạn con liên tiếp dài nhất có tổng không vượt quá S',
      difficulty: 'Medium',
      description: 'Cho mảng gồm N số nguyên dương và số nguyên dương S (1 ≤ N ≤ 10⁵, 1 ≤ a[i] ≤ 10⁹). Hãy tìm độ dài của đoạn con liên tiếp dài nhất có tổng các phần tử không vượt quá S.',
      inputFormat: 'Dòng 1: N và S. Dòng 2: N số nguyên dương.',
      outputFormat: 'In ra độ dài lớn nhất của đoạn con thỏa mãn.',
      sampleCases: [
        {
          input: '5 7\n2 1 3 4 5',
          output: '3',
          explanation: 'Đoạn con [2, 1, 3] có độ dài 3 và tổng = 6 ≤ 7.'
        }
      ],
      solutionAnalysis: 'Dùng cửa sổ trượt (Sliding Window / Two Pointers). Mở rộng con trỏ right, khi tổng > S thì tăng left để thu hẹp. Cập nhật maxLen = max(maxLen, right - left + 1) trong O(N).',
      basicAnalysis: 'Cơ bản: Thử mọi điểm đầu i và kéo dài điểm cuối j khi tổng đoạn [i..j] <= S để tìm độ dài lớn nhất (2 vòng lặp for O(N²), dễ cài với test vừa).',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n, S = map(int, input().split())
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
print(max_len)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys

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

solve()`
    }
  },

  // ==========================================
  // CẤP ĐỘ 3: NÂNG CAO, CHUYÊN TIN & OLYMPIC (ADVANCED)
  // ==========================================
  {
    id: 'cs-7',
    level: 'Nâng cao / HSG',
    lessonNumber: 7,
    title: 'Quy Hoạch Động Kinh Điển: Cái Túi (Knapsack) & LIS',
    topic: 'Dynamic Programming - Bài toán con gối nhau & Tối ưu bảng phương án',
    estimatedMinutes: 20,
    theory: [
      '1. Bản chất của Quy hoạch động: Giải quyết bài toán có cấu trúc con tối ưu (Optimal Substructure) và các bài toán con gối nhau (Overlapping Subproblems) bằng cách lưu trữ kết quả để không tính lại.',
      '2. Bài toán Cái túi 0/1 (0-1 Knapsack): Có $N$ đồ vật với trọng lượng $w_i$ và giá trị $v_i$, cái túi chịu tải $W$. Gọi `dp[j]` là giá trị lớn nhất khi túi có sức chứa $j$. Công thức truy hồi duyệt ngược từ $W$ về $w_i$: `dp[j] = max(dp[j], dp[j - w[i]] + v[i])`. Độ phức tạp $O(N \\cdot W)$.',
      '3. Dãy con tăng dài nhất (LIS): Tìm dãy con có các phần tử tăng dần có độ dài lớn nhất. Dùng mảng `dp` kết hợp tìm kiếm nhị phân `lower_bound` để đạt độ phức tạp tối ưu $O(N \\log N)$.'
    ],
    complexity: {
      time: 'O(N·W) cho Knapsack, O(N log N) cho LIS',
      space: 'O(W) tối ưu mảng 1D'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Bài toán Cái túi 0/1 tối ưu mảng 1D (DP Nâng cao)',
        basicTitle: 'C++ Cơ bản: Bảng phương án 2 chiều trong main (dễ hình dung)',
        basicCode: `#include <iostream>
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
}`,
        basicExplanation: 'Dùng bảng 2 chiều dp[i][j] trong main(): chọn hoặc không chọn đồ vật thứ i, không cần nhớ quy tắc duyệt ngược.',
        code: `#include <iostream>
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
}`,
        explanation: 'Duyệt ngược j từ W về w[i] đảm bảo không sử dụng trạng thái mới tính ở cùng lượt i (tránh biến thành bài toán balo không giới hạn).'
      },
      {
        language: 'python',
        title: 'Python Knapsack 1D Array (DP tối ưu)',
        basicTitle: 'Python Cơ bản: Bảng DP 2 chiều trực quan',
        basicCode: `W = 10
w = [2, 3, 5, 7]
v = [1, 5, 2, 4]
n = len(w)
dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(W + 1):
        dp[i][j] = dp[i - 1][j]
        if j >= w[i - 1]:
            dp[i][j] = max(dp[i][j], dp[i - 1][j - w[i - 1]] + v[i - 1])
print("Max value:", dp[n][W])`,
        basicExplanation: 'Bảng 2 chiều dp[i][j] tương ứng xét i đồ vật đầu tiên với sức chứa j.',
        code: `def knapsack(W: int, weights: list, values: list) -> int:
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for j in range(W, w - 1, -1):
            dp[j] = max(dp[j], dp[j - w] + v)
    return dp[W]

print("Max value:", knapsack(10, [2, 3, 5, 7], [1, 5, 2, 4]))`,
        explanation: 'Duyệt mảng 1 chiều tiết kiệm bộ nhớ từ O(N·W) xuống chỉ còn O(W).'
      }
    ],
    practiceProblem: {
      id: 'CS_P7',
      title: 'Dãy con tăng dài nhất O(N log N) (LIS)',
      difficulty: 'Hard',
      description: 'Cho mảng số nguyên A gồm N phần tử (1 ≤ N ≤ 10⁵, -10⁹ ≤ A[i] ≤ 10⁹). Hãy tìm độ dài của dãy con tăng thực sự dài nhất.',
      inputFormat: 'Dòng 1: Số nguyên N. Dòng 2: N số nguyên A[i].',
      outputFormat: 'In ra độ dài lớn nhất của dãy con tăng.',
      sampleCases: [
        {
          input: '6\n1 2 5 3 4 7',
          output: '5',
          explanation: 'Dãy con tăng dài nhất là [1, 2, 3, 4, 7] có độ dài 5.'
        }
      ],
      solutionAnalysis: 'Dùng mảng tails[len] lưu phần tử kết thúc nhỏ nhất của dãy con tăng độ dài len. Với mỗi x trong A, dùng lower_bound tìm vị trí đầu tiên >= x để thay thế, đạt O(N log N).',
      basicAnalysis: 'Cơ bản: Quy hoạch động cổ điển O(N²) trong main(): f[i] là độ dài dãy con tăng kết thúc tại i, duyệt mọi j < i có a[j] < a[i] để cập nhật f[i] = max(f[i], f[j] + 1).',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n = int(input())
a = list(map(int, input().split()))
f = [1] * n
for i in range(n):
    for j in range(i):
        if a[j] < a[i] and f[j] + 1 > f[i]:
            f[i] = f[j] + 1
print(max(f) if n > 0 else 0)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys
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

solve()`
    }
  },
  {
    id: 'cs-8',
    level: 'Nâng cao / HSG',
    lessonNumber: 8,
    title: 'Lý thuyết Đồ thị: Duyệt DFS/BFS & Thuật toán Dijkstra',
    topic: 'Biểu diễn Danh sách kề, Đếm thành phần liên thông & Tìm đường đi ngắn nhất',
    estimatedMinutes: 22,
    theory: [
      '1. Biểu diễn đồ thị: Danh sách kề `vector<int> adj[N]` hoặc `vector<pair<int, int>> adj[N]` cho đồ thị có trọng số.',
      '2. Duyệt theo chiều sâu (DFS): Dùng ngăn xếp đệ quy, thăm đỉnh sâu nhất có thể trước khi quay lui. Ứng dụng đếm số thành phần liên thông, kiểm tra chu trình.',
      '3. Duyệt theo chiều rộng (BFS): Dùng hàng đợi `queue`, thăm các đỉnh theo từng lớp khoảng cách. Ứng dụng tìm đường đi ngắn nhất trên đồ thị không có trọng số.',
      '4. Thuật toán Dijkstra: Tìm đường đi ngắn nhất từ 1 nguồn trên đồ thị có trọng số KHÔNG ÂM. Sử dụng hàng đợi ưu tiên `priority_queue<pair<long long, int>, vector<...>, greater<...>>` để đạt độ phức tạp tối ưu $O((V + E) \\log V)$.'
    ],
    complexity: {
      time: 'O(V + E) cho DFS/BFS; O((V + E) log V) cho Dijkstra',
      space: 'O(V + E)'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Thuật toán Dijkstra với priority_queue',
        basicTitle: 'C++ Cơ bản: Dijkstra cổ điển không dùng priority_queue (mảng tĩnh O(V²))',
        basicCode: `#include <iostream>
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
}`,
        basicExplanation: 'Phiên bản Dijkstra nguyên thủy chỉ dùng mảng 2 chiều & vòng lặp tìm đỉnh nhỏ nhất trong main(), không cần priority_queue hay pair.',
        code: `#include <iostream>
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
}`,
        explanation: 'Điều kiện if (d > dist[u]) continue giúp bỏ qua các đỉnh đã được cập nhật đường đi ngắn hơn trước đó.'
      },
      {
        language: 'python',
        title: 'Python Dijkstra heapq',
        basicTitle: 'Python Cơ bản: Tìm đỉnh nhỏ nhất bằng vòng lặp đơn giản',
        basicCode: `INF = 10**18
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
print(dist[1:])`,
        basicExplanation: 'Không cần thư viện heapq: chỉ chọn đỉnh chưa thăm có dist nhỏ nhất rồi nới lỏng các cạnh kề.',
        code: `import heapq

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
    return dist`,
        explanation: 'heapq của Python hỗ trợ min-heap hiệu quả cho thuật toán Dijkstra.'
      }
    ],
    practiceProblem: {
      id: 'CS_P8',
      title: 'Đường đi ngắn nhất trên đồ thị có trọng số',
      difficulty: 'Hard',
      description: 'Cho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (1 ≤ N ≤ 10⁵, 1 ≤ M ≤ 2·10⁵, 0 ≤ w ≤ 10⁹). Hãy tìm khoảng cách ngắn nhất từ đỉnh 1 đến tất cả các đỉnh còn lại.',
      inputFormat: 'Dòng 1: N và M. M dòng tiếp theo, mỗi dòng gồm 3 số u, v, w mô tả cạnh từ u đến v có trọng số w.',
      outputFormat: 'In ra khoảng cách từ đỉnh 1 đến các đỉnh từ 1 đến N (nếu không đến được in -1).',
      sampleCases: [
        {
          input: '3 3\n1 2 4\n1 3 2\n3 2 1',
          output: '0 3 2',
          explanation: 'Đường đi ngắn nhất từ 1 đến 2 là 1 -> 3 -> 2 với tổng trọng số 2 + 1 = 3.'
        }
      ],
      solutionAnalysis: 'Áp dụng thuật toán Dijkstra với priority_queue. Khởi tạo dist[1] = 0, các đỉnh khác INF, đạt O((V+E) log V).',
      basicAnalysis: 'Cơ bản: Thuật toán Bellman-Ford / nới lỏng đơn giản trên danh sách M cạnh viết trong main() (hoặc Dijkstra mảng O(N²)): không cần priority_queue hay struct phức tạp.',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n, m = map(int, input().split())
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
print(*[d if d != INF else -1 for d in dist[1:]])`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys
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

solve()`
    }
  },
  {
    id: 'cs-9',
    level: 'Nâng cao / HSG',
    lessonNumber: 9,
    title: 'Cấu trúc Dữ liệu Nâng cao: Cây Phân Đoạn (Segment Tree) & DSU',
    topic: 'Quản lý Truy vấn Đoạn O(log N) & Hợp nhất Tập hợp Rời rạc',
    estimatedMinutes: 24,
    theory: [
      '1. Cây Phân Đoạn (Segment Tree): Là cây nhị phân hoàn chỉnh quản lý các đoạn con. Hỗ trợ 2 thao tác: (1) Cập nhật giá trị tại 1 vị trí `update(pos, val)`; (2) Tính hàm kết hợp (Tổng, Min, Max, GCD) trên đoạn $[L; R]$ `query(L, R)`. Cả hai thao tác đều chạy trong $O(\\log N)$. Mảng cây cần kích thước $4N$.',
      '2. Kỹ thuật Lazy Propagation: Khi cần cập nhật trên một đoạn $[L; R]$, ta trì hoãn việc đẩy giá trị xuống các nút con, giúp thao tác Range Update cũng chỉ tốn $O(\\log N)$.',
      '3. Disjoint Set Union (DSU): Quản lý việc gộp các tập hợp rời rạc. Áp dụng hai tối ưu: Nén đường đi (Path Compression) và Gộp theo hạng (Union by Rank/Size). Khi kết hợp cả hai, mỗi thao tác `find` và `union` chỉ tốn độ phức tạp gần như hằng số $O(\\alpha(N))$ (hàm Ackermann nghịch đảo).'
    ],
    complexity: {
      time: 'O(log N) cho Segment Tree, O(α(N)) cho DSU',
      space: 'O(4N) cho Segment Tree, O(N) cho DSU'
    },
    codeExamples: [
      {
        language: 'cpp',
        title: 'C++ Segment Tree Cập nhật Điểm & Truy vấn Tổng',
        basicTitle: 'C++ Cơ bản: Mảng thường — cập nhật O(1), tính tổng bằng vòng lặp',
        basicCode: `#include <iostream>
using namespace std;

int main() {
    long long a[6] = {0, 2, 4, 1, 7, 3};
    a[2] = 10; // Cập nhật tại vị trí 2
    long long sum = 0;
    for (int i = 1; i <= 4; i++) sum += a[i]; // Truy vấn tổng [1..4]
    cout << sum << '\\n';
    return 0;
}`,
        basicExplanation: 'Khi N và Q nhỏ, cập nhật trực tiếp mảng a[idx] = val và tính tổng bằng vòng lặp for rất đơn giản.',
        code: `#include <iostream>
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
};`,
        explanation: 'Mỗi nút quản lý đoạn [start, end]. Cây có độ cao không quá log₂(N) + 1.'
      },
      {
        language: 'python',
        title: 'Python DSU với Path Compression',
        basicTitle: 'Python Cơ bản: Mảng nhãn nhóm (Union-Find tối giản không dùng class)',
        basicCode: `n = 5
nhom = list(range(n + 1))

# Gộp nhóm của 2 phần tử u, v bằng cách đổi toàn bộ nhãn v sang nhãn u
u, v = 1, 3
cu, cv = nhom[u], nhom[v]
for i in range(1, n + 1):
    if nhom[i] == cv:
        nhom[i] = cu
print("Cung nhom:", nhom[1] == nhom[3])`,
        basicExplanation: 'Quản lý tập hợp bằng mảng nhãn đơn thuần trong main(), không cần class hay đệ quy nén đường đi.',
        code: `class DSU:
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
        return False`,
        explanation: 'DSU là vũ khí số một trong thuật toán Kruskal tìm cây khung nhỏ nhất và đếm thành phần liên thông động.'
      }
    ],
    practiceProblem: {
      id: 'CS_P9',
      title: 'Quản lý Dãy số với Segment Tree: Cập nhật & Tìm Max đoạn',
      difficulty: 'Hard',
      description: 'Cho mảng A gồm N số nguyên (1 ≤ N ≤ 10⁵) và Q truy vấn (1 ≤ Q ≤ 10⁵). Có 2 loại truy vấn: 1) `1 p x`: gán A[p] = x; 2) `2 l r`: in ra giá trị lớn nhất trong đoạn từ l đến r.',
      inputFormat: 'Dòng 1: N và Q. Dòng 2: N số nguyên ban đầu. Q dòng tiếp theo mô tả truy vấn.',
      outputFormat: 'Với mỗi truy vấn loại 2, in ra kết quả trên một dòng.',
      sampleCases: [
        {
          input: '5 3\n1 3 2 7 9\n2 1 3\n1 2 8\n2 1 3',
          output: '3\n8',
          explanation: 'Truy vấn 1: max đoạn [1..3] là 3. Cập nhật A[2]=8. Truy vấn 3: max đoạn [1..3] lúc này là 8.'
        }
      ],
      solutionAnalysis: 'Dùng Segment Tree quản lý Max đoạn. Nút lá lưu giá trị A[i], nút cha lưu max của 2 nút con. Cập nhật và truy vấn trong O(log N).',
      basicAnalysis: 'Cơ bản: Dùng mảng tĩnh a[1..N] ngay trong main(): truy vấn loại 1 gán trực tiếp a[p] = x; truy vấn loại 2 duyệt vòng for từ l đến r tìm giá trị lớn nhất.',
      basicSolutionCpp: `#include <iostream>
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
}`,
      basicSolutionPython: `n, q = map(int, input().split())
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
        print(mx)`,
      fullSolutionCpp: `#include <iostream>
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
}`,
      fullSolutionPython: `import sys

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

solve()`
    }
  }
];

export const CS_LESSONS: CSLesson[] = [
  ...BASE_CS_LESSONS.map((lesson) => {
    const enrich = VNOI_LESSON_ENRICHMENT[lesson.id];
    return enrich ? { ...lesson, ...enrich } : lesson;
  }),
  ...EXTRA_VNOI_LESSONS,
  ...CS_EXTRA_10_LESSONS
].sort((a, b) => a.lessonNumber - b.lessonNumber);

