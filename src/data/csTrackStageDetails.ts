export interface CSTrackStageQuiz {
  id: string;
  question: string;
  questionEn: string;
  options: string[];
  optionsEn: string[];
  correctIndex: number;
  explanation: string;
  explanationEn: string;
}

export interface CSTrackLabStarter {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  starterCpp: string;
}

export interface CSTrackStageDetail {
  stageId: string;
  quickIntuition: string;
  quickIntuitionEn: string;
  codeTitle: string;
  codeTitleEn: string;
  cppCode: string;
  commonMistakes: string[];
  commonMistakesEn: string[];
  checkpointQuiz: CSTrackStageQuiz[];
  labStarter: CSTrackLabStarter;
}

export const CS_TRACK_STAGE_DETAILS: Record<string, CSTrackStageDetail> = {
  // =========================================================================
  // 1. C++ INSTITUTE (OpenEDG: CPE -> CPA -> CPP)
  // =========================================================================
  'openedg-1': {
    stageId: 'openedg-1',
    quickIntuition:
      'Chứng chỉ CPE kiểm tra xem bạn có hiểu chính xác cách máy tính lưu từng con số và chạy từng vòng lặp hay không: giống như chọn đúng cỡ hộp (int chứa ±2 tỷ, long long chứa ±9 tỷ tỷ) và nắm rõ phép chia nguyên `7 / 2 == 3` khác với chia số thực `7.0 / 2 == 3.5`.',
    quickIntuitionEn:
      'OpenEDG CPE checks whether you know how C++ stores numbers and evaluates loops: choosing 64-bit `long long` over 32-bit `int` when multiplying large values, and remembering integer division `7 / 2 == 3` vs floating-point `7.0 / 2 == 3.5`.',
    codeTitle: 'CPE Core: Ép kiểu an toàn, Bitwise & Vòng lặp O(√N)',
    codeTitleEn: 'CPE Core: Safe Casting, Bitwise Flags & O(√N) Loop',
    cppCode: `#include <iostream>
using namespace std;

int main() {
    long long n;
    if (!(cin >> n)) return 0;

    bool isPrime = (n >= 2);
    for (long long i = 2; i * i <= n && isPrime; ++i) {
        if (n % i == 0) isPrime = false;
    }

    cout << (isPrime ? "YES" : "NO") << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Nhầm toán tử gán `=` với so sánh `==` trong `if (x = 5)` — luôn biên dịch với `-Wall` hoặc viết giá trị hằng bên trái.',
      'Quên `break;` trong các nhánh `switch (choice)` khiến chương trình chạy thông (fall-through) xuống nhánh bên dưới.',
      'Viết `double r = 5 / 2;` ra `2.0` thay vì `2.5` do cả `5` và `2` đều là `int`.'
    ],
    commonMistakesEn: [
      'Confusing assignment `=` with equality `==` inside `if` conditions.',
      'Forgetting `break;` inside `switch` cases, causing unintended fall-through.',
      'Writing `double r = 5 / 2;` expecting `2.5` instead of `2.0` due to integer division.'
    ],
    checkpointQuiz: [
      {
        id: 'openedg1-q1',
        question: 'Giá trị của biến `double res = 9 / 2;` trong C++ là bao nhiêu?',
        questionEn: 'What value does `double res = 9 / 2;` store in C++?',
        options: ['A. 4.5', 'B. 4.0', 'C. 5.0', 'D. Lỗi biên dịch'],
        optionsEn: ['A. 4.5', 'B. 4.0', 'C. 5.0', 'D. Compile error'],
        correctIndex: 1,
        explanation: 'Hai toán hạng `9` và `2` đều là `int`, nên `9 / 2` thực hiện phép chia nguyên ra `4` rồi mới chuyển thành `4.0`.',
        explanationEn: 'Both `9` and `2` are `int`, so `9 / 2` evaluates to integer `4`, then converts to `4.0`.'
      },
      {
        id: 'openedg1-q2',
        question: 'Biểu thức kiểm tra số nguyên `x` có là số lẻ bằng toán tử bit nhanh nhất là:',
        questionEn: 'Which bitwise check tests if positive integer `x` is odd?',
        options: ['A. (x | 1) == 1', 'B. (x & 1) == 1', 'C. (x ^ 1) == 0', 'D. (x >> 1) == 1'],
        optionsEn: ['A. (x | 1) == 1', 'B. (x & 1) == 1', 'C. (x ^ 1) == 0', 'D. (x >> 1) == 1'],
        correctIndex: 1,
        explanation: 'Bit cuối cùng (LSB) của số lẻ luôn bằng 1, nên `(x & 1) == 1` đúng với mọi số lẻ.',
        explanationEn: 'An odd integer always has its least significant bit set to 1, so `(x & 1) == 1`.'
      }
    ],
    labStarter: {
      title: 'CPE Drill: Kiểm tra số nguyên tố & Đếm ước tối ưu O(√N)',
      titleEn: 'CPE Drill: Primality Check O(√N)',
      description: 'Cho số nguyên dương N (1 <= N <= 10^12). Hãy kiểm tra xem N có phải số nguyên tố hay không. In ra YES nếu đúng, NO nếu sai.',
      descriptionEn: 'Given integer N (1 <= N <= 10^12), print YES if N is prime and NO otherwise.',
      inputFormat: 'Một số nguyên dương N duy nhất.',
      outputFormat: 'YES hoặc NO.',
      sampleInput: '29',
      sampleOutput: 'YES',
      starterCpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    // Kiểm tra n < 2 và thử chia đến sqrt(n)
    
    return 0;
}`
    }
  },
  'openedg-2': {
    stageId: 'openedg-2',
    quickIntuition:
      'Truyền tham trị giống như photocopy cả quyển sách đưa cho hàm đọc (sửa bản photo không ảnh hưởng bản gốc, nhưng sách dày thì tốn công photo); còn truyền tham chiếu `const T&` giống như cho hàm mượn trực tiếp quyển sách gốc chỉ để xem, vừa nhanh O(1) vừa an toàn tuyệt đối.',
    quickIntuitionEn:
      'Pass-by-value copies the whole object (safe but slow for big strings/vectors), whereas `const T&` lets a function read the original object directly with zero copying.',
    codeTitle: 'CPA Module 1–2: Truyền tham chiếu const & Chuỗi std::string',
    codeTitleEn: 'CPA Module 1–2: Const Reference & std::string Palindrome',
    cppCode: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(const string& s) {
    int l = 0, r = static_cast<int>(s.size()) - 1;
    while (l < r) {
        if (s[l] != s[r]) return false;
        ++l;
        --r;
    }
    return true;
}

int main() {
    string s;
    cin >> s;
    cout << (isPalindrome(s) ? "YES" : "NO") << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Truyền `string s` theo giá trị (pass-by-value) bên trong vòng lặp lớn gây copy O(|s|) lặp đi lặp lại.',
      'Trộn `cin >> n` với `getline(cin, s)` mà quên `cin >> ws` hoặc `cin.ignore()`, dẫn đến đọc nhầm dòng trống.',
      'Viết `s.size() - 1` khi `s` rỗng: vì `size()` trả về `size_t` (không dấu), `0 - 1` tràn thành số dương khổng lồ!'
    ],
    commonMistakesEn: [
      'Passing large `std::string` by value inside tight loops instead of `const std::string&`.',
      'Mixing `cin >> n` and `getline(cin, s)` without clearing trailing whitespace.',
      'Subtracting `s.size() - 1` when `s` is empty causes unsigned `size_t` wraparound.'
    ],
    checkpointQuiz: [
      {
        id: 'openedg2-q1',
        question: 'Tại sao nên truyền `const std::string& s` cho hàm chỉ đọc độ dài và ký tự?',
        questionEn: 'Why pass `const std::string& s` to a read-only inspection function?',
        options: [
          'A. Cho phép hàm sửa trực tiếp chuỗi gốc',
          'B. Tránh copy chuỗi tốn bộ nhớ mà vẫn bảo vệ không cho sửa',
          'C. Bắt buộc trong C++20 nếu muốn dùng vòng for',
          'D. Để tự động chuyển chuỗi sang số nguyên'
        ],
        optionsEn: [
          'A. Allows mutating the caller string',
          'B. Avoids copying the string while preventing mutation',
          'C. Required syntax for range-for loops',
          'D. Automatically parses string to integer'
        ],
        correctIndex: 1,
        explanation: 'Tham chiếu `&` tránh copy dữ liệu, còn từ khóa `const` đảm bảo hàm không làm thay đổi chuỗi của người gọi.',
        explanationEn: 'Reference `&` avoids copying, and `const` guarantees the function cannot mutate caller data.'
      },
      {
        id: 'openedg2-q2',
        question: 'Trong Nạp chồng hàm (Function Overloading), hai hàm nào dưới đây HỢP LỆ cùng tên `calc`?',
        questionEn: 'Which pair of `calc` declarations is valid C++ function overloading?',
        options: [
          'A. `int calc(int x);` và `double calc(int x);`',
          'B. `int calc(int x);` và `int calc(double x);`',
          'C. `void calc(int a);` và `void calc(int b);`',
          'D. Không thể đặt 2 hàm trùng tên trong C++'
        ],
        optionsEn: [
          'A. `int calc(int x);` and `double calc(int x);`',
          'B. `int calc(int x);` and `int calc(double x);`',
          'C. `void calc(int a);` and `void calc(int b);`',
          'D. Two functions cannot share the same name'
        ],
        correctIndex: 1,
        explanation: 'Overloading phân biệt nhau theo danh sách kiểu tham số (ở B là `int` vs `double`), KHÔNG phân biệt theo mỗi kiểu trả về hay tên biến.',
        explanationEn: 'Overloads must differ in parameter types (`int` vs `double`), not solely return type or parameter names.'
      }
    ],
    labStarter: {
      title: 'CPA Drill: Tìm giá trị xuất hiện nhiều nhất trong mảng',
      titleEn: 'CPA Drill: Most Frequent Element in Array',
      description: 'Cho mảng gồm N số nguyên (1 <= N <= 10^5, 0 <= a[i] <= 10^5). Hãy tìm giá trị xuất hiện nhiều nhất và số lần xuất hiện (nếu hòa chọn giá trị nhỏ hơn).',
      descriptionEn: 'Given N integers (0 <= a[i] <= 10^5), find the value with maximum frequency (tie-break smallest) and its count.',
      inputFormat: 'Dòng 1: N. Dòng 2: N số nguyên.',
      outputFormat: 'Hai số cách nhau bởi dấu cách: giá trị và số lần xuất hiện.',
      sampleInput: '6\n4 2 4 7 2 4',
      sampleOutput: '4 3',
      starterCpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> cnt(100005, 0);
    // Đếm tần suất và tìm max
    
    return 0;
}`
    }
  },
  'openedg-3': {
    stageId: 'openedg-3',
    quickIntuition:
      'Con trỏ giống như tờ giấy ghi **địa chỉ nhà** chứ không phải ngôi nhà. Còn Đa hình OOP (`virtual`) giống như chiếc điều khiển vạn năng cùng bấm nút `draw()` nhưng Hình Tròn tự vẽ đường tròn còn Hình Chữ Nhật tự vẽ 4 cạnh nhờ bảng hàm ảo.',
    quickIntuitionEn:
      'A pointer stores a memory address rather than the house itself. Virtual polymorphism lets one base interface call `area()` and automatically run the derived class formula at runtime.',
    codeTitle: 'CPA Module 3–4: Class Đa hình (Virtual Dispatch & Override)',
    codeTitleEn: 'CPA Module 3–4: Polymorphic Class Hierarchy & Virtual Destructor',
    cppCode: `#include <iostream>
#include <memory>
using namespace std;

class Shape {
public:
    virtual double area() const = 0;
    virtual ~Shape() = default;
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

int main() {
    double w, h;
    cin >> w >> h;
    unique_ptr<Shape> s = make_unique<Rectangle>(w, h);
    cout << s->area() << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Quên khai báo `virtual ~Base()` khi xóa đối tượng lớp con qua con trỏ lớp cha (`delete basePtr`) gây rò rỉ bộ nhớ (Undefined Behavior).',
      'Trả về con trỏ tới biến cục bộ đã bị hủy sau khi hàm kết thúc (Dangling Pointer).',
      'Quên từ khóa `override` khiến sai chữ ký hàm tạo ra hàm mới thay vì ghi đè hàm ảo của lớp cha.'
    ],
    commonMistakesEn: [
      'Omitting `virtual ~Base()` when deleting derived objects through a base pointer.',
      'Returning pointers or references to local stack variables that die on return.',
      'Omitting `override`, silently creating an unrelated overload when signatures differ.'
    ],
    checkpointQuiz: [
      {
        id: 'openedg3-q1',
        question: 'Tại sao lớp cơ sở đa hình (`virtual` methods) luôn phải có `virtual ~Base()`?',
        questionEn: 'Why must a polymorphic base class declare a virtual destructor?',
        options: [
          'A. Để gọi được hàm tạo mặc định',
          'B. Để khi hủy qua con trỏ lớp cha, destructor của lớp con cũng được gọi đúng',
          'C. Để lớp con không bị kế thừa biến private',
          'D. Không cần thiết trong C++'
        ],
        optionsEn: [
          'A. Required to invoke default constructors',
          'B. Ensures derived destructors run when deleted via base pointer',
          'C. Prevents derived classes from seeing private members',
          'D. Optional cosmetic keyword'
        ],
        correctIndex: 1,
        explanation: 'Không có virtual destructor, lệnh `delete basePtr;` chỉ chạy destructor lớp cha và bỏ sót tài nguyên của lớp con.',
        explanationEn: 'Without a virtual destructor, deleting through a base pointer skips the derived destructor.'
      },
      {
        id: 'openedg3-q2',
        question: 'Toán tử nào dùng để truy cập thành viên của đối tượng THÔNG QUA con trỏ `ptr`?',
        questionEn: 'Which operator accesses a member through object pointer `ptr`?',
        options: ['A. ptr.member', 'B. ptr::member', 'C. ptr->member', 'D. *ptr->member'],
        optionsEn: ['A. ptr.member', 'B. ptr::member', 'C. ptr->member', 'D. *ptr->member'],
        correctIndex: 2,
        explanation: '`ptr->member` tương đương `(*ptr).member`, dùng để giải tham chiếu con trỏ và truy cập thuộc tính/phương thức.',
        explanationEn: '`ptr->member` dereferences the pointer and accesses the member cleanly.'
      }
    ],
    labStarter: {
      title: 'CPA OOP Lab: Tính diện tích & chu vi hình chữ nhật qua Class',
      titleEn: 'CPA OOP Lab: Encapsulated Rectangle Class',
      description: 'Cho chiều rộng W và chiều cao H là hai số nguyên dương. Hãy cài đặt lớp Rectangle có phương thức `area()` và `perimeter()` in ra Diện tích và Chu vi.',
      descriptionEn: 'Given positive integers W and H, implement a Rectangle class with `area()` and `perimeter()` methods.',
      inputFormat: 'Hai số nguyên W và H.',
      outputFormat: 'Hai số trên một dòng: Diện tích và Chu vi.',
      sampleInput: '5 3',
      sampleOutput: '15 16',
      starterCpp: `#include <iostream>
using namespace std;

class Rectangle {
    long long w, h;
public:
    Rectangle(long long w, long long h) : w(w), h(h) {}
    long long area() const { return w * h; }
    long long perimeter() const { return 2 * (w + h); }
};

int main() {
    long long w, h;
    cin >> w >> h;
    Rectangle r(w, h);
    cout << r.area() << " " << r.perimeter() << '\\n';
    return 0;
}`
    }
  },
  'openedg-4': {
    stageId: 'openedg-4',
    quickIntuition:
      'Templates giống như khuôn làm bánh đa năng: chỉ viết 1 hàm `sort` hay `findMax<T>` mà dùng chung được cho cả số nguyên, số thực lẫn đối tượng tự định nghĩa! Còn STL là bộ đồ nghề chuẩn quốc tế (`vector`, `map`, `set`, `lower_bound`) giúp bạn code nhanh và sạch gấp 10 lần tự viết lại từ đầu.',
    quickIntuitionEn:
      'Templates act like type-agnostic blueprints (`template <typename T>`), while STL gives you battle-tested containers (`vector`, `set`, `map`) and `O(log N)` / `O(N log N)` algorithms out of the box.',
    codeTitle: 'CPP Master: Function Template + STL lower_bound & Lambda',
    codeTitleEn: 'CPP Master: Generic Template + STL Sort & lower_bound',
    cppCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

template <typename T>
int firstGeIndex(const vector<T>& a, const T& target) {
    auto it = lower_bound(a.begin(), a.end(), target);
    if (it == a.end()) return -1;
    return static_cast<int>(it - a.begin()) + 1;
}

int main() {
    int n;
    long long x;
    cin >> n >> x;
    vector<long long> a(n);
    for (auto& v : a) cin >> v;
    sort(a.begin(), a.end());
    cout << firstGeIndex(a, x) << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Truyền Comparator vào `std::sort` trả về `<=` thay vì `<` (vi phạm Strict Weak Ordering) gây lỗi treo hoặc crash!',
      'Dùng `std::lower_bound(s.begin(), s.end(), x)` trên `std::set` làm mất O(N) bước nhảy — phải gọi phương thức riêng `s.lower_bound(x)` để đạt O(log N).',
      'Bắt ngoại lệ bằng giá trị `catch (exception e)` gây cắt cụt đối tượng (Object Slicing); phải viết `catch (const exception& e)`.'
    ],
    commonMistakesEn: [
      'Returning `a <= b` instead of strict `<` in a `std::sort` comparator (violates strict weak ordering).',
      'Calling free function `std::lower_bound(set.begin(), ...)` instead of `set.lower_bound(x)`.',
      'Catching exceptions by value `catch (exception e)` instead of `catch (const exception& e)`.'
    ],
    checkpointQuiz: [
      {
        id: 'openedg4-q1',
        question: 'Trong `std::sort`, hàm so sánh `cmp(a, b)` phải tuân thủ nguyên tắc nào để không gây crash?',
        questionEn: 'What rule must a custom comparator `cmp(a, b)` obey for `std::sort`?',
        options: [
          'A. `cmp(a, a)` phải trả về `true`',
          'B. Strict Weak Ordering: `cmp(a, a)` luôn là `false`',
          'C. Phải trả về số nguyên -1, 0, +1',
          'D. Bắt buộc viết bằng Template'
        ],
        optionsEn: [
          'A. `cmp(a, a)` must return `true`',
          'B. Strict Weak Ordering: `cmp(a, a)` must be `false`',
          'C. Must return -1, 0, or +1',
          'D. Must be a template function'
        ],
        correctIndex: 1,
        explanation: 'Comparator C++ là predicate boolean (`<`), nếu trả về `true` khi 2 phần tử bằng nhau (`<=`), `std::sort` có thể truy cập tràn mảng.',
        explanationEn: 'C++ comparators require irreflexive `<` ordering; using `<=` causes undefined behavior.'
      },
      {
        id: 'openedg4-q2',
        question: 'Container STL nào duy trì phần tử tự động SẮP XẾP tăng dần và KHÔNG trùng lặp với tìm kiếm $O(\\log N)$?',
        questionEn: 'Which STL container keeps unique elements sorted with $O(\\log N)$ lookup?',
        options: ['A. std::vector', 'B. std::unordered_set', 'C. std::set', 'D. std::queue'],
        optionsEn: ['A. std::vector', 'B. std::unordered_set', 'C. std::set', 'D. std::queue'],
        correctIndex: 2,
        explanation: '`std::set` dùng cây đỏ-đen cân bằng, lưu phần tử duy nhất theo thứ tự tăng dần với tìm kiếm/thêm/xóa $O(\\log N)$.',
        explanationEn: '`std::set` maintains sorted unique keys via a balanced binary search tree in $O(\\log N)$.'
      }
    ],
    labStarter: {
      title: 'CPP Drill: Sắp xếp mảng & Tìm vị trí đầu tiên >= X',
      titleEn: 'CPP Drill: Sort & STL lower_bound',
      description: 'Cho mảng N số nguyên a[1..N] và số X. Hãy sắp xếp mảng tăng dần và tìm chỉ số (1-based) đầu tiên có giá trị >= X (in -1 nếu không có).',
      descriptionEn: 'Sort array A[1..N] ascending and print the 1-based index of the first element >= X, or -1 if none.',
      inputFormat: 'Dòng 1: N X. Dòng 2: N số nguyên.',
      outputFormat: 'Một số nguyên duy nhất.',
      sampleInput: '5 6\n9 2 7 4 10',
      sampleOutput: '3',
      starterCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    long long x;
    cin >> n >> x;
    vector<long long> a(n);
    for (auto& v : a) cin >> v;
    sort(a.begin(), a.end());
    // Gọi lower_bound và in chỉ số 1-based hoặc -1
    
    return 0;
}`
    }
  },

  // =========================================================================
  // 2. ROADMAP.SH (C++ DEVELOPER ROADMAP)
  // =========================================================================
  'rsh-1': {
    stageId: 'rsh-1',
    quickIntuition:
      'Khi bạn bấm Compile một dự án C++ công nghiệp, file `.cpp` không biến ngay thành file chạy: nó đi qua 4 trạm dây chuyền **Tiền xử lý (`#include`) → Biên dịch ra Assembly → Tạo file Object (`.o`) → Linker ghép tất cả lại**. Bật `-Wall -Wextra -Werror` giống như lắp cảm biến kiểm định lỗi trước khi xuất xưởng!',
    quickIntuitionEn:
      'Industrial C++ builds follow a 4-step factory pipeline: Preprocessor -> Compiler -> Assembler (`.o`) -> Linker. Flags like `-Wall -Wextra` catch subtle bugs at compile time before production.',
    codeTitle: 'Modern C++ Toolchain: Guardrail Flags & Zero-UB Math',
    codeTitleEn: 'Modern C++ Toolchain: Compile-Time Checks & Safe Modular Math',
    cppCode: `#include <iostream>
#include <cstdint>
using namespace std;

constexpr int64_t MOD = 1'000'000'007LL;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int64_t a, b;
    if (cin >> a >> b) {
        int64_t sumMod = ((a % MOD) + (b % MOD)) % MOD;
        if (sumMod < 0) sumMod += MOD;
        cout << sumMod << '\\n';
    }
    return 0;
}`,
    commonMistakes: [
      'Đặt định nghĩa hàm thường (non-inline) trực tiếp trong file `.hpp` rồi include ở 2 file `.cpp` gây lỗi Linker `multiple definition` (vi phạm ODR).',
      'Quên `#pragma once` hoặc header guards trong file `.hpp` làm biên dịch bị nhân đôi khai báo.',
      'Tin vào Undefined Behavior (như đọc biến chưa khởi tạo hoặc tràn số nguyên có dấu) vì chạy thử trên máy mình vẫn "có vẻ đúng".'
    ],
    commonMistakesEn: [
      'Defining non-inline functions inside a `.hpp` included by multiple `.cpp` files, causing ODR linker errors.',
      'Missing `#pragma once` / include guards in headers.',
      'Relying on undefined behavior like uninitialized reads or signed integer overflow.'
    ],
    checkpointQuiz: [
      {
        id: 'rsh1-q1',
        question: 'Lỗi `"undefined reference to foo()"` xảy ra ở bước nào trong quy trình build C++?',
        questionEn: 'Which stage produces an `"undefined reference"` build error?',
        options: ['A. Preprocessor', 'B. Linker', 'C. Runtime OS', 'D. Git commit'],
        optionsEn: ['A. Preprocessor', 'B. Linker', 'C. Runtime OS', 'D. Git commit'],
        correctIndex: 1,
        explanation: 'Trình biên dịch đã thấy khai báo của `foo()` trong header nên qua bước compile, nhưng Linker không tìm thấy phần cài đặt ở file `.o` hoặc thư viện liên kết.',
        explanationEn: 'Compilation saw the declaration, but the Linker could not find the compiled definition.'
      },
      {
        id: 'rsh1-q2',
        question: 'Chỉ thị `#pragma once` ở đầu file header `.hpp` có tác dụng gì?',
        questionEn: 'What is the purpose of `#pragma once` in a `.hpp` header?',
        options: [
          'A. Tăng tốc độ chạy của vòng lặp',
          'B. Ngăn file header bị include trùng lặp nhiều lần trong cùng translation unit',
          'C. Tự động tạo unit test',
          'D. Ép dùng chuẩn C++11'
        ],
        optionsEn: [
          'A. Speeds up runtime loops',
          'B. Prevents multiple inclusion within a single translation unit',
          'C. Generates unit tests',
          'D. Forces C++11 mode'
        ],
        correctIndex: 1,
        explanation: '`#pragma once` tránh khai báo lặp lại struct/class khi nhiều header cùng include chéo một file gốc.',
        explanationEn: '`#pragma once` protects against duplicate declarations when headers include shared headers.'
      }
    ],
    labStarter: {
      title: 'Toolchain Lab: Cộng hai số nguyên lớn theo Modulo 10^9 + 7',
      titleEn: 'Toolchain Lab: Safe 64-bit Modular Sum',
      description: 'Cho hai số nguyên 64-bit A và B (-10^18 <= A, B <= 10^18). Tính (A + B) mod (10^9 + 7) sao cho kết quả luôn không âm trong [0, 10^9 + 6].',
      descriptionEn: 'Compute (A + B) mod (10^9 + 7) safely for signed 64-bit inputs, ensuring a non-negative remainder.',
      inputFormat: 'Hai số nguyên A và B.',
      outputFormat: 'Một số nguyên không âm duy nhất.',
      sampleInput: '-5 2',
      sampleOutput: '1000000004',
      starterCpp: `#include <iostream>
#include <cstdint>
using namespace std;

int main() {
    const int64_t MOD = 1000000007LL;
    int64_t a, b;
    cin >> a >> b;
    // Xử lý modulo số âm an toàn
    
    return 0;
}`
    }
  },
  'rsh-2': {
    stageId: 'rsh-2',
    quickIntuition:
      'RAII giống như thẻ từ phòng khách sạn: khi bạn rời phòng (biến ra khỏi scope `{}`), tài nguyên/bộ nhớ tự động được thu hồi ngay lập tức kể cả khi xảy ra lỗi! Dùng `std::unique_ptr` là hợp đồng sở hữu độc quyền — không bao giờ sợ quên `delete`.',
    quickIntuitionEn:
      'RAII works like an automatic hotel keycard: the moment an object leaves its scope `{}`, its destructor cleans up memory or file handles automatically. Prefer `std::unique_ptr` over raw `new`/`delete`.',
    codeTitle: 'Modern C++20 Memory: std::unique_ptr & Move Semantics',
    codeTitleEn: 'Modern C++20 Memory: RAII with std::unique_ptr & std::move',
    cppCode: `#include <iostream>
#include <memory>
#include <utility>
using namespace std;

struct Buffer {
    size_t size;
    explicit Buffer(size_t n) : size(n) {}
};

int main() {
    size_t n;
    cin >> n;
    auto p1 = make_unique<Buffer>(n);
    auto p2 = std::move(p1); // Chuyển quyền sở hữu không copy!
    cout << "Moved size=" << p2->size << " p1_null=" << (p1 == nullptr) << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Gọi `new` / `delete` thủ công trong code ứng dụng hiện đại thay vì `std::make_unique` / `std::vector`.',
      'Tạo vòng tham chiếu `shared_ptr` trỏ lẫn nhau (A giữ B, B giữ A) khiến bộ nhớ không bao giờ giải phóng — cần dùng `std::weak_ptr` ở một chiều.',
      'Đọc lại biến sau khi đã gọi `std::move(obj)` khi chưa gán giá trị mới cho nó.'
    ],
    commonMistakesEn: [
      'Calling raw `new` and `delete` instead of `std::make_unique` or standard containers.',
      'Creating reference cycles with `std::shared_ptr`; break cycles using `std::weak_ptr`.',
      'Reading moved-from objects as if they still hold their previous value.'
    ],
    checkpointQuiz: [
      {
        id: 'rsh2-q1',
        question: 'Loại Smart Pointer nào nhẹ nhất (chi phí 0 overhead so với raw pointer) cho quyền sở hữu duy nhất?',
        questionEn: 'Which smart pointer models exclusive ownership with zero runtime overhead?',
        options: ['A. std::shared_ptr', 'B. std::unique_ptr', 'C. std::weak_ptr', 'D. std::auto_ptr'],
        optionsEn: ['A. std::shared_ptr', 'B. std::unique_ptr', 'C. std::weak_ptr', 'D. std::auto_ptr'],
        correctIndex: 1,
        explanation: '`std::unique_ptr` không cần reference-counter nên kích thước và tốc độ y hệt raw pointer, tự hủy khi ra khỏi scope.',
        explanationEn: '`std::unique_ptr` has no atomic ref-count overhead and frees automatically on scope exit.'
      },
      {
        id: 'rsh2-q2',
        question: 'Để phá vỡ vòng lặp tham chiếu (circular reference) giữa hai đối tượng `shared_ptr`, ta thay một chiều bằng:',
        questionEn: 'Which smart pointer breaks `std::shared_ptr` reference cycles?',
        options: ['A. std::unique_ptr', 'B. std::weak_ptr', 'C. void*', 'D. std::move'],
        optionsEn: ['A. std::unique_ptr', 'B. std::weak_ptr', 'C. void*', 'D. std::move'],
        correctIndex: 1,
        explanation: '`std::weak_ptr` quan sát đối tượng mà không tăng bộ đếm tham chiếu strong count.',
        explanationEn: '`std::weak_ptr` observes a `shared_ptr`-managed resource without incrementing strong ownership count.'
      }
    ],
    labStarter: {
      title: 'RAII Lab: Quản lý danh sách bộ đệm bằng unique_ptr & Vector',
      titleEn: 'RAII Lab: Zero-Leak Resource Buffer Simulation',
      description: 'Đọc N số nguyên bằng vector chuẩn RAII và tính tổng các phần tử dương (tư duy không bao giờ dùng new/delete thủ công).',
      descriptionEn: 'Read N integers into an RAII-managed std::vector and output the sum of positive values.',
      inputFormat: 'Dòng 1: N. Dòng 2: N số nguyên.',
      outputFormat: 'Tổng các số dương.',
      sampleInput: '5\n-3 10 -1 4 2',
      sampleOutput: '16',
      starterCpp: `#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> data(n);
    long long ans = 0;
    for (auto& x : data) {
        cin >> x;
        if (x > 0) ans += x;
    }
    cout << ans << '\\n';
    return 0;
}`
    }
  },
  'rsh-3': {
    stageId: 'rsh-3',
    quickIntuition:
      '`std::string_view` và `std::span` giống như nhìn qua khung cửa sổ ngắm bức tranh thay vì photocopy cả bức tranh mang đi! Còn `std::optional<T>` cho biết rõ ràng một hàm "có thể tìm thấy kết quả hoặc không có gì" mà không cần quy ước số `-1` hay con trỏ `nullptr` dễ nhầm lẫn.',
    quickIntuitionEn:
      '`std::string_view` and `std::span` let functions read slices without allocating memory, while `std::optional<T>` explicitly models "value or nothing" without magic `-1` sentinels.',
    codeTitle: 'Modern C++17/20: std::optional & std::string_view Zero-Copy',
    codeTitleEn: 'Modern C++17/20: std::optional & Zero-Copy std::string_view',
    cppCode: `#include <iostream>
#include <optional>
#include <string_view>
using namespace std;

optional<int> findFirstDigit(string_view sv) {
    for (size_t i = 0; i < sv.size(); ++i) {
        if (sv[i] >= '0' && sv[i] <= '9') return static_cast<int>(i);
    }
    return nullopt;
}

int main() {
    string s;
    cin >> s;
    if (auto pos = findFirstDigit(s)) {
        cout << *pos << '\\n';
    } else {
        cout << "NONE\\n";
    }
    return 0;
}`,
    commonMistakes: [
      'Lưu `std::string_view` trỏ vào một `std::string` tạm thời đã bị hủy (Dangling View).',
      'Giải tham chiếu `*opt` mà không kiểm tra `opt.has_value()` hoặc `if (opt)` trước (gây Undefined Behavior).',
      'Giả định `std::string_view` luôn kết thúc bằng ký tự null `\'\\0\'` khi truyền vào hàm C API.'
    ],
    commonMistakesEn: [
      'Storing a `std::string_view` to a temporary `std::string` that gets destroyed immediately.',
      'Dereferencing `*opt` without checking `if (opt.has_value())`.',
      'Assuming a sliced `std::string_view` is null-terminated.'
    ],
    checkpointQuiz: [
      {
        id: 'rsh3-q1',
        question: 'Lợi ích chính của `std::string_view` khi truyền tham số vào hàm phân tích văn bản là gì?',
        questionEn: 'What is the main benefit of accepting `std::string_view` in string-parsing functions?',
        options: [
          'A. Tự động nén dữ liệu xâu',
          'B. Không cấp phát bộ nhớ heap / không copy khi cắt xâu con `substr()`',
          'C. Cho phép sửa đổi trực tiếp chữ hoa/thường trên xâu gốc',
          'D. Tự động đa luồng hóa'
        ],
        optionsEn: [
          'A. Compresses strings automatically',
          'B. Zero heap allocations and O(1) non-copying `substr()` slices',
          'C. Mutates characters in place',
          'D. Enables multithreading automatically'
        ],
        correctIndex: 1,
        explanation: '`std::string_view` chỉ giữ 1 con trỏ + độ dài, nên `sv.substr(...)` chạy trong O(1) mà không xin thêm RAM.',
        explanationEn: '`std::string_view` stores only a pointer and length, making `substr()` an O(1) zero-allocation slice.'
      },
      {
        id: 'rsh3-q2',
        question: 'Kiểu `std::optional<int>` dùng hợp lý nhất trong tình huống nào?',
        questionEn: 'When should you return `std::optional<int>`?',
        options: [
          'A. Khi cần mảng động kích thước lớn',
          'B. Khi hàm tìm kiếm có thể trả về một số nguyên hoặc không có kết quả (`std::nullopt`)',
          'C. Khi muốn lưu trữ 2 kiểu dữ liệu cùng lúc',
          'D. Thay thế cho vòng lặp `while`'
        ],
        optionsEn: [
          'A. Replacing dynamic arrays',
          'B. When a lookup may return an integer or nothing (`std::nullopt`)',
          'C. Storing two values simultaneously',
          'D. Replacing `while` loops'
        ],
        correctIndex: 1,
        explanation: '`std::optional` diễn tả rõ ý đồ "có hoặc không có kết quả" ngay trong kiểu trả về.',
        explanationEn: '`std::optional` explicitly encodes a possibly absent return value in the type system.'
      }
    ],
    labStarter: {
      title: 'C++17 Idiom Lab: Tìm vị trí chữ số đầu tiên bằng std::optional',
      titleEn: 'C++17 Idiom Lab: std::optional First Digit Finder',
      description: 'Cho một chuỗi không chứa khoảng trắng. Dùng `std::optional<int>` tìm chỉ số (0-based) chữ số đầu tiên xuất hiện, hoặc in NONE nếu không có chữ số nào.',
      descriptionEn: 'Using `std::optional<int>`, print the 0-based index of the first digit in a string, or NONE.',
      inputFormat: 'Một chuỗi ký tự S.',
      outputFormat: 'Chỉ số 0-based hoặc NONE.',
      sampleInput: 'synapse2026',
      sampleOutput: '7',
      starterCpp: `#include <iostream>
#include <optional>
#include <string_view>
using namespace std;

optional<int> firstDigit(string_view sv) {
    for (int i = 0; i < (int)sv.size(); ++i)
        if (sv[i] >= '0' && sv[i] <= '9') return i;
    return nullopt;
}

int main() {
    string s;
    cin >> s;
    auto res = firstDigit(s);
    cout << (res ? to_string(*res) : "NONE") << '\\n';
    return 0;
}`
    }
  },
  'rsh-4': {
    stageId: 'rsh-4',
    quickIntuition:
      'CMake giống bản thiết kế tổng của kỹ sư xây dựng: bạn viết cấu hình 1 lần là nó tự tạo project chạy được trên cả Linux Makefile, macOS Xcode lẫn Windows Visual Studio. Còn Sanitizers (`-fsanitize=address,undefined`) giống máy quét X-quang: chạy test tới đâu bắt sống tràn mảng/rò bộ nhớ tới đó!',
    quickIntuitionEn:
      'CMake acts as a cross-platform build blueprint (Linux, macOS, Windows), while ASan/UBSan act as an X-ray during tests to catch out-of-bounds reads, leaks, and UB immediately.',
    codeTitle: 'Testing & Sanitizers: Kiểm tra điều kiện biên (Unit Assertions)',
    codeTitleEn: 'Testing & Sanitizers: Self-Validating Test Assertions',
    cppCode: `#include <iostream>
#include <cassert>
#include <vector>
using namespace std;

long long safeSum(const vector<int>& v) {
    long long total = 0;
    for (int x : v) total += x;
    return total;
}

int main() {
    assert(safeSum({}) == 0);
    assert(safeSum({1000000000, 1000000000, 1000000000}) == 3000000000LL);
    int n;
    if (cin >> n) {
        vector<int> v(n);
        for (auto& x : v) cin >> x;
        cout << safeSum(v) << '\\n';
    }
    return 0;
}`,
    commonMistakes: [
      'Viết `include_directories(...)` toàn cục thay vì Modern Target-based CMake (`target_include_directories(app PRIVATE ...)`).',
      'Đặt biểu thức có tác dụng phụ (như `assert(vec.pop_back())`) vào `assert()` — ở bản build Release (`-DNDEBUG`), `assert` bị xóa sạch!',
      'Chỉ test trên input đẹp mà không chạy bộ test với `-fsanitize=address,undefined`.'
    ],
    commonMistakesEn: [
      'Using global directory commands instead of target-scoped `target_link_libraries` / `target_include_directories`.',
      'Putting side effects inside `assert(...)`, which disappears in Release (`-DNDEBUG`) builds.',
      'Skipping ASan/UBSan sanitizer runs in CI.'
    ],
    checkpointQuiz: [
      {
        id: 'rsh4-q1',
        question: 'Cờ biên dịch `-fsanitize=address,undefined` giúp phát hiện lỗi nào ngay khi chạy unit test?',
        questionEn: 'What does `-fsanitize=address,undefined` detect during test execution?',
        options: [
          'A. Sai chính tả tên biến trong README',
          'B. Truy cập tràn mảng, use-after-free, rò rỉ bộ nhớ và hành vi bất định (UB)',
          'C. Tự động đẩy code lên GitHub',
          'D. Giảm kích thước file nhị phân'
        ],
        optionsEn: [
          'A. Typos in README files',
          'B. Out-of-bounds memory access, use-after-free, leaks, and UB',
          'C. Pushing commits to GitHub',
          'D. Shrinking executable binary size'
        ],
        correctIndex: 1,
        explanation: 'ASan và UBSan gắn kiểm tra runtime giúp bắt sống bug bộ nhớ và tràn số ngay lập tức với stack trace chi tiết.',
        explanationEn: 'ASan and UBSan instrument memory accesses and arithmetic at runtime to report exact stack traces on bugs.'
      },
      {
        id: 'rsh4-q2',
        question: 'Trong Modern CMake, lệnh chuẩn để gắn thư viện `GTest::gtest_main` vào target `unit_tests` là:',
        questionEn: 'Which Modern CMake command links `GTest::gtest_main` to `unit_tests`?',
        options: [
          'A. add_library(unit_tests GTest)',
          'B. target_link_libraries(unit_tests PRIVATE GTest::gtest_main)',
          'C. link_libraries(all)',
          'D. #include <CMakeLists.txt>'
        ],
        optionsEn: [
          'A. add_library(unit_tests GTest)',
          'B. target_link_libraries(unit_tests PRIVATE GTest::gtest_main)',
          'C. link_libraries(all)',
          'D. #include <CMakeLists.txt>'
        ],
        correctIndex: 1,
        explanation: 'Modern CMake quản lý mọi phụ thuộc theo từng target với từ khóa phạm vi `PRIVATE`, `PUBLIC`, `INTERFACE`.',
        explanationEn: 'Modern CMake attaches dependencies per-target using visibility keywords (`PRIVATE` / `PUBLIC` / `INTERFACE`).'
      }
    ],
    labStarter: {
      title: 'Testing Lab: Tổng mảng kiểm thử không tràn & Case rỗng N=0',
      titleEn: 'Testing Lab: Safe Sum Handling Edge Case N=0',
      description: 'Viết hàm tính tổng N số nguyên (`0 <= N <= 10^5`, `|a[i]| <= 10^9`), đảm bảo đúng cả trường hợp biên `N = 0` và không tràn 32-bit.',
      descriptionEn: 'Compute the sum of N integers (`0 <= N <= 10^5`, `|a[i]| <= 10^9`), safely handling `N = 0` and 64-bit sums.',
      inputFormat: 'Dòng 1: N. Dòng 2: N số nguyên (nếu N > 0).',
      outputFormat: 'Tổng 64-bit.',
      sampleInput: '3\n1000000000 1000000000 1000000000',
      sampleOutput: '3000000000',
      starterCpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    long long sum = 0, x;
    for (int i = 0; i < n; ++i) {
        cin >> x;
        sum += x;
    }
    cout << sum << '\\n';
    return 0;
}`
    }
  },
  'rsh-5': {
    stageId: 'rsh-5',
    quickIntuition:
      'Đa luồng (Multithreading) giống như thuê nhiều đầu bếp cùng nấu trong 1 căn bếp: nếu 2 người cùng thò tay sửa chung 1 nồi súp mà không khóa cửa luân phiên (`std::mutex`) hay bộ đếm nguyên tử (`std::atomic`), món ăn sẽ hỏng (Data Race)! Dùng `std::scoped_lock` luôn tự mở khóa an toàn.',
    quickIntuitionEn:
      'Multithreading is like multiple chefs sharing one kitchen: modifying shared state without a `std::mutex` or `std::atomic` creates data races. Always guard shared locks with RAII `std::scoped_lock`.',
    codeTitle: 'Modern C++20 Concurrency: Mutex Guard & Atomic Counter',
    codeTitleEn: 'Modern C++20 Concurrency: RAII Lock Guard & Atomic Counter',
    cppCode: `#include <iostream>
#include <atomic>
#include <mutex>
using namespace std;

int main() {
    atomic<long long> jobsDone{0};
    mutex mtx;
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        scoped_lock lk(mtx);
        jobsDone.fetch_add(i, memory_order_relaxed);
    }
    cout << jobsDone.load() << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Gọi `mtx.lock()` / `mtx.unlock()` thủ công thay vì `std::scoped_lock` — nếu có ngoại lệ hay `return` sớm sẽ bị kẹt khóa mãi mãi (Deadlock).',
      'Khóa 2 mutex theo thứ tự ngược nhau ở 2 thread gây Deadlock — dùng `std::scoped_lock(m1, m2)` để tự tránh deadlock.',
      'Dùng `bool` hay `int` thường làm cờ báo giữa các luồng thay vì `std::atomic<bool>` (gây Data Race UB).'
    ],
    commonMistakesEn: [
      'Calling raw `mtx.lock()`/`unlock()` instead of RAII `std::scoped_lock`.',
      'Locking two mutexes in opposite orders across threads (deadlock); use `std::scoped_lock(m1, m2)`.',
      'Sharing non-atomic flags across threads without synchronization (data race UB).'
    ],
    checkpointQuiz: [
      {
        id: 'rsh5-q1',
        question: 'Tại sao nên dùng `std::scoped_lock lock(m1, m2);` thay vì gọi `m1.lock(); m2.lock();`?',
        questionEn: 'Why prefer `std::scoped_lock lock(m1, m2)` over calling `m1.lock(); m2.lock()`?',
        options: [
          'A. Tự động tránh deadlock thứ tự khóa và tự mở khóa khi thoát scope (RAII)',
          'B. Làm CPU chạy ở xung nhịp cao gấp đôi',
          'C. Tự động tạo thêm thread mới',
          'D. Chỉ chạy được trên Windows'
        ],
        optionsEn: [
          'A. Uses deadlock-avoidance locking and RAII-unlocks on scope exit',
          'B. Doubles CPU clock speed',
          'C. Automatically spawns extra threads',
          'D. Windows-only API'
        ],
        correctIndex: 0,
        explanation: '`std::scoped_lock` dùng thuật toán tránh deadlock khi khóa nhiều mutex và luôn tự nhả khóa khi ra khỏi phạm vi hàm.',
        explanationEn: '`std::scoped_lock` acquires multiple mutexes safely with deadlock avoidance and unlocks automatically via RAII.'
      },
      {
        id: 'rsh5-q2',
        question: 'Lớp nào trong C++20 tự động gọi `join()` trong destructor để không bao giờ quên thu hồi thread?',
        questionEn: 'Which C++20 thread class automatically joins in its destructor?',
        options: ['A. std::thread', 'B. std::jthread', 'C. std::future', 'D. std::mutex'],
        optionsEn: ['A. std::thread', 'B. std::jthread', 'C. std::future', 'D. std::mutex'],
        correctIndex: 1,
        explanation: '`std::jthread` (Joining Thread, C++20) hỗ trợ tự động `join()` khi hủy và có `stop_token` tiện lợi.',
        explanationEn: '`std::jthread` (C++20) joins automatically on destruction and supports cooperative `std::stop_token` cancellation.'
      }
    ],
    labStarter: {
      title: 'Concurrency Prep: Tính tổng công việc tích lũy an toàn 64-bit',
      titleEn: 'Concurrency Prep: Accumulator Pattern',
      description: 'Cho số nguyên N (1 <= N <= 10^6). Tính tổng 1 + 2 + ... + N mô phỏng tác vụ gom kết quả song song từ N worker.',
      descriptionEn: 'Compute cumulative sum 1 + 2 + ... + N simulating parallel worker reduction.',
      inputFormat: 'Một số nguyên dương N.',
      outputFormat: 'Tổng 64-bit duy nhất.',
      sampleInput: '10',
      sampleOutput: '55',
      starterCpp: `#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    cout << n * (n + 1) / 2 << '\\n';
    return 0;
}`
    }
  },

  // =========================================================================
  // 3. LEARNCPP.COM (CHAPTERS 0 -> 28)
  // =========================================================================
  'lcpp-1': {
    stageId: 'lcpp-1',
    quickIntuition:
      'LearnCpp nhấn mạnh 3 thói quen vàng ngay từ Chương 1–5: **khởi tạo biến bằng ngoặc nhọn `{ }`** để máy tự chặn lỗi mất dữ liệu (như ép `double 4.5` vào `int`), **dùng `constexpr`** cho hằng số biên dịch, và dùng `static_cast<T>(x)` rõ ràng thay vì ép kiểu kiểu C `(T)x`.',
    quickIntuitionEn:
      'LearnCpp Ch. 0–5 teaches three rock-solid habits: brace initialization `{}` to catch narrowing conversions, `constexpr` for compile-time constants, and explicit `static_cast<T>` instead of C-style casts.',
    codeTitle: 'LearnCpp Ch. 1–5: Brace Initialization, constexpr & static_cast',
    codeTitleEn: 'LearnCpp Ch. 1–5: Brace Initialization & static_cast',
    cppCode: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    long long a{}, b{};
    cin >> a >> b;
    double avg{ static_cast<double>(a + b) / 2.0 };
    cout << (a + b) << '\\n' << (a * b) << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Khai báo biến cục bộ không khởi tạo `int x;` rồi đem cộng ngay — chứa giá trị rác không xác định!',
      'Dùng số nguyên không dấu `unsigned int` cho các phép trừ đại số thông thường (ví dụ `3u - 5u` tràn thành `4294967294`).',
      'Nhầm lẫn `const` (giá trị cố định lúc chạy) với `constexpr` (hằng số tính sẵn lúc biên dịch).'
    ],
    commonMistakesEn: [
      'Declaring uninitialized local variables like `int x;` and reading garbage values.',
      'Using `unsigned` integers for general subtraction where negative wraparound can strike.',
      'Writing C-style `(double)x` casts instead of explicit `static_cast<double>(x)`.'
    ],
    checkpointQuiz: [
      {
        id: 'lcpp1-q1',
        question: 'Vì sao LearnCpp khuyên dùng khởi tạo `int x{ 5 };` (brace initialization) thay vì `int x = 4.5;`?',
        questionEn: 'Why does LearnCpp recommend brace initialization `int x{ 5 };`?',
        options: [
          'A. Tự động chặn ép kiểu thu hẹp (narrowing conversion) làm mất phần thập phân',
          'B. Biến sẽ biến thành hằng số không đổi được',
          'C. Chạy nhanh hơn 10 lần',
          'D. Bắt buộc nếu dùng `cout`'
        ],
        optionsEn: [
          'A. Rejects narrowing conversions such as 4.5 -> int at compile time',
          'B. Makes the variable immutable',
          'C. Runs 10x faster at runtime',
          'D. Required whenever using `cout`'
        ],
        correctIndex: 0,
        explanation: 'Brace initialization `{ }` cấm các phép chuyển đổi làm mất thông tin như `int x{ 4.5 };` ngay ở bước biên dịch.',
        explanationEn: 'List/brace initialization disallows narrowing conversions (`int x{ 4.5 };` is a compile error).'
      },
      {
        id: 'lcpp1-q2',
        question: 'Lệnh nào chuyển đổi kiểu rõ ràng và chuẩn Modern C++ nhất?',
        questionEn: 'Which cast is idiomatic and safest in Modern C++?',
        options: ['A. (double)a', 'B. double(a)', 'C. static_cast<double>(a)', 'D. reinterpret_cast<double>(a)'],
        optionsEn: ['A. (double)a', 'B. double(a)', 'C. static_cast<double>(a)', 'D. reinterpret_cast<double>(a)'],
        correctIndex: 2,
        explanation: '`static_cast<T>(expr)` kiểm tra hợp lệ lúc biên dịch và dễ tìm kiếm khi rà soát mã nguồn.',
        explanationEn: '`static_cast<T>` performs compile-time type checking and stands out clearly in code review.'
      }
    ],
    labStarter: {
      title: 'LearnCpp Ch.1–5: Tính tổng & tích hai số nguyên an toàn kiểu dữ liệu',
      titleEn: 'LearnCpp Ch.1–5: Overflow-Safe Sum & Product',
      description: 'Cho hai số nguyên A và B (-10^9 <= A, B <= 10^9). Hãy tính tổng A + B và tích A * B, mỗi kết quả trên một dòng.',
      descriptionEn: 'Given two 32-bit integers A and B, print A + B and A * B on separate lines without 32-bit overflow.',
      inputFormat: 'A B trên một dòng.',
      outputFormat: 'Dòng 1: A + B. Dòng 2: A * B.',
      sampleInput: '100000 100000',
      sampleOutput: '200000\n10000000000',
      starterCpp: `#include <iostream>
using namespace std;

int main() {
    long long a{}, b{};
    cin >> a >> b;
    cout << (a + b) << '\\n' << (a * b) << '\\n';
    return 0;
}`
    }
  },
  'lcpp-2': {
    stageId: 'lcpp-2',
    quickIntuition:
      'Trong chương 6–11, LearnCpp giải thích vì sao `0.1 + 0.2 == 0.3` có thể cho kết quả `false` trên máy tính (sai số dấu phẩy động!), cách gói biến trong namespace để không đụng tên, và cách viết 1 Function Template `maxVal<T>` dùng cho mọi kiểu số.',
    quickIntuitionEn:
      'Chapters 6–11 explain why `0.1 + 0.2 == 0.3` can return `false` due to IEEE-754 precision, how scope/linkage organize multi-file code, and how function templates eliminate copy-paste code.',
    codeTitle: 'LearnCpp Ch. 6–11: Function Templates & Epsilon Precision',
    codeTitleEn: 'LearnCpp Ch. 6–11: Function Template & Floating-Point Tolerance',
    cppCode: `#include <iostream>
#include <cmath>
using namespace std;

template <typename T>
T myMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    long long x{}, y{};
    cin >> x >> y;
    cout << myMax(x, y) << '\\n';
    return 0;
}`,
    commonMistakes: [
      'So sánh bằng tuyệt đối hai số thực `if (a == b)` — nên kiểm tra `abs(a - b) <= 1e-9`.',
      'Dùng hàm `rand() % N` kiểu C cũ (phân bố lệch) thay vì `<random>` `std::mt19937`.',
      'Khai báo biến toàn cục trùng tên khiến hiện tượng che khuất biến (Variable Shadowing) gây bug khó tìm.'
    ],
    commonMistakesEn: [
      'Testing floating-point numbers with exact `==` instead of an epsilon tolerance.',
      'Using legacy `rand() % N` instead of `<random>` `std::mt19937`.',
      'Shadowing outer-scope variables accidentally inside inner blocks.'
    ],
    checkpointQuiz: [
      {
        id: 'lcpp2-q1',
        question: 'Cách so sánh hai số thực `double a, b` an toàn trước sai số làm tròn IEEE-754 là:',
        questionEn: 'How should two floating-point `double a, b` values be compared for near-equality?',
        options: ['A. a == b', 'B. std::abs(a - b) <= 1e-9', 'C. a ^ b == 0', 'D. (int)a == (int)b'],
        optionsEn: ['A. a == b', 'B. std::abs(a - b) <= 1e-9', 'C. a ^ b == 0', 'D. (int)a == (int)b'],
        correctIndex: 1,
        explanation: 'Do biểu diễn nhị phân IEEE-754 có sai số rất nhỏ (~1e-16), ta kiểm tra độ chênh lệch nằm trong ngưỡng epsilon.',
        explanationEn: 'Checking `std::abs(a - b) <= eps` handles tiny IEEE-754 rounding drift.'
      },
      {
        id: 'lcpp2-q2',
        question: 'Trong C++, `auto add(auto x, auto y)` (Abbreviated Function Template C++20) thực chất là:',
        questionEn: 'In C++20, what is `auto add(auto x, auto y)`?',
        options: [
          'A. Lỗi cú pháp',
          'B. Cách viết gọn của Function Template với 2 kiểu tham số độc lập',
          'C. Ép kiểu cả 2 biến về `int`',
          'D. Biến toàn cục'
        ],
        optionsEn: [
          'A. Syntax error',
          'B. Shorthand for a function template with deduced parameter types',
          'C. Casts both parameters to `int`',
          'D. Global variable declaration'
        ],
        correctIndex: 1,
        explanation: 'Từ C++20, dùng `auto` ở tham số tự động sinh Function Template rất gọn và sạch.',
        explanationEn: 'C++20 abbreviated function templates deduce each `auto` parameter as a template type parameter.'
      }
    ],
    labStarter: {
      title: 'LearnCpp Ch.6–11: Tìm ƯCLN và BCNN bằng Function Template',
      titleEn: 'LearnCpp Ch.6–11: GCD & LCM Function Template',
      description: 'Cho hai số nguyên dương A, B (1 <= A, B <= 10^9). Viết hàm `gcd(a, b)` và `lcm(a, b)` không bị tràn số khi tính BCNN.',
      descriptionEn: 'Compute GCD and overflow-safe LCM for two positive integers A and B.',
      inputFormat: 'Hai số nguyên A và B.',
      outputFormat: 'Hai số trên một dòng: GCD(A, B) và LCM(A, B).',
      sampleInput: '12 18',
      sampleOutput: '6 36',
      starterCpp: `#include <iostream>
using namespace std;

template <typename T>
T myGcd(T a, T b) {
    while (b != 0) { T r = a % b; a = b; b = r; }
    return a;
}

int main() {
    long long a, b;
    cin >> a >> b;
    long long g = myGcd(a, b);
    cout << g << " " << (a / g) * b << '\\n';
    return 0;
}`
    }
  },
  'lcpp-3': {
    stageId: 'lcpp-3',
    quickIntuition:
      'Đây là chương bản lề của C++: `enum class` thay thế các hằng số rời rạc để tránh lẫn màu sắc với trạng thái; còn `Member Initializer List` (`Point(int x) : x(x) {}`) khởi tạo thuộc tính ngay khi tạo đối tượng thay vì tạo rỗng rồi mới gán lại!',
    quickIntuitionEn:
      'Chapters 12–17 are C++’s heart: `enum class` prevents unrelated enum constants from mixing, and constructor Member Initializer Lists construct fields directly instead of default-initializing then assigning.',
    codeTitle: 'LearnCpp Ch. 12–17: enum class, Member Initializer List & vector',
    codeTitleEn: 'LearnCpp Ch. 12–17: Scoped enum class & Member Initializer List',
    cppCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

enum class Grade { Fail, Pass, Excellent };

struct StudentScore {
    int score;
    explicit StudentScore(int s) : score{s} {}
    Grade rank() const {
        if (score >= 8) return Grade::Excellent;
        return score >= 5 ? Grade::Pass : Grade::Fail;
    }
};

int main() {
    int s;
    cin >> s;
    StudentScore st{s};
    cout << (st.rank() == Grade::Excellent ? "GIOI" : st.rank() == Grade::Pass ? "DAT" : "CHUA DAT") << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Dùng `enum` không phạm vi (unscoped) khiến các enum khác nhau bị trộn ngầm thành `int` và đụng tên.',
      'Gán thành viên trong thân constructor `{ m_x = x; }` thay vì dùng Member Initializer List `: m_x{ x }` (bắt buộc với `const` và tham chiếu `&`).',
      'Quên phân biệt `v.size()` vs `v.capacity()` hoặc vòng lặp dùng chỉ số `size_t` chạy ngược `i >= 0` gây lặp vô tận.'
    ],
    commonMistakesEn: [
      'Using unscoped `enum` whose enumerators leak into the outer scope and implicitly convert to `int`.',
      'Assigning inside the constructor body instead of using a Member Initializer List.',
      'Running backwards loop `for (size_t i = v.size()-1; i >= 0; --i)` (infinite loop on unsigned wraparound!).'
    ],
    checkpointQuiz: [
      {
        id: 'lcpp3-q1',
        question: 'Tại sao vòng lặp `for (size_t i = 5; i >= 0; --i)` chạy vô tận?',
        questionEn: 'Why is `for (size_t i = 5; i >= 0; --i)` an infinite loop?',
        options: [
          'A. `size_t` là kiểu không dấu, nên sau `0` phép `--i` quay vòng thành số rất lớn (>= 0 luôn đúng)',
          'B. C++ không hỗ trợ toán tử `--i` trong `for`',
          'C. `size_t` chỉ lưu được số từ 1 đến 5',
          'D. Thiếu từ khóa `static`'
        ],
        optionsEn: [
          'A. `size_t` is unsigned, so decrementing 0 wraps to SIZE_MAX (>= 0 is always true)',
          'B. Pre-decrement is invalid inside `for` loops',
          'C. `size_t` maxes out at 5',
          'D. Missing `static` keyword'
        ],
        correctIndex: 0,
        explanation: 'Luôn dùng kiểu có dấu (`int` hoặc `ptrdiff_t`) khi viết vòng lặp đếm lùi tới `0`.',
        explanationEn: 'Use a signed counter (`int` or `std::ptrdiff_t`) whenever counting down past zero.'
      },
      {
        id: 'lcpp3-q2',
        question: 'Thành viên nào trong `class` BẮT BUỘC phải khởi tạo bằng Member Initializer List `: member(val)`?',
        questionEn: 'Which class members MUST be initialized via Member Initializer List?',
        options: [
          'A. Biến `int` thông thường',
          'B. Biến `const` và biến tham chiếu `&`',
          'C. Biến `static`',
          'D. Không có loại nào bắt buộc'
        ],
        optionsEn: [
          'A. Regular `int` fields',
          'B. `const` and reference (`&`) member fields',
          'C. `static` members',
          'D. None'
        ],
        correctIndex: 1,
        explanation: 'Hằng `const` và tham chiếu `&` không thể gán lại sau khi tạo, nên bắt buộc phải khởi tạo trực tiếp tại danh sách khởi tạo thành viên.',
        explanationEn: '`const` and reference members cannot be assigned inside the constructor body and must use the initializer list.'
      }
    ],
    labStarter: {
      title: 'LearnCpp Ch.12–17: Quản lý điểm & Tìm kiếm bằng std::vector',
      titleEn: 'LearnCpp Ch.12–17: Class Score Filter with std::vector',
      description: 'Cho N điểm số nguyên (0..10). Đếm xem có bao nhiêu điểm đạt loại Giỏi (>= 8) và tìm điểm cao nhất.',
      descriptionEn: 'Given N integer scores (0..10), print how many are >= 8 and the maximum score.',
      inputFormat: 'Dòng 1: N. Dòng 2: N số nguyên.',
      outputFormat: 'Hai số: số lượng >= 8 và điểm lớn nhất.',
      sampleInput: '5\n7 9 6 10 8',
      sampleOutput: '3 10',
      starterCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    int cnt = 0, mx = 0;
    for (int& x : a) {
        cin >> x;
        if (x >= 8) ++cnt;
        mx = max(mx, x);
    }
    cout << cnt << " " << mx << '\\n';
    return 0;
}`
    }
  },
  'lcpp-4': {
    stageId: 'lcpp-4',
    quickIntuition:
      'Nạp chồng toán tử (`operator+`, `operator<<`) giúp các kiểu do bạn tự tạo (như Phân số, Vector 2D, Ma trận) cộng trừ và in ra bằng `cout << f` tự nhiên y như số nguyên `int`! Còn Composition ("có một" — Ô tô *có* Động cơ) thường linh hoạt hơn kế thừa ("là một").',
    quickIntuitionEn:
      'Operator overloading lets user-defined types like Fractions or Vec2 use `+`, `==`, and `cout << x` just like built-in integers, while object composition models "has-a" cleanly.',
    codeTitle: 'LearnCpp Ch. 18–24: Nạp chồng Toán tử & Lambda',
    codeTitleEn: 'LearnCpp Ch. 18–24: Operator Overloading (+, <<) on Fraction',
    cppCode: `#include <iostream>
#include <numeric>
using namespace std;

struct Fraction {
    long long num, den;
    Fraction(long long n, long long d) {
        long long g = gcd(n, d);
        num = n / g;
        den = d / g;
    }
    Fraction operator+(const Fraction& o) const {
        return Fraction(num * o.den + o.num * den, den * o.den);
    }
    friend ostream& operator<<(ostream& os, const Fraction& f) {
        return os << f.num << '/' << f.den;
    }
};

int main() {
    long long a, b, c, d;
    cin >> a >> b >> c >> d;
    cout << (Fraction(a, b) + Fraction(c, d)) << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Cố tình viết `operator<<` là member function của lớp thay vì `friend` bên ngoài, dẫn đến phải viết ngược `f << cout` rất kỳ cục.',
      'Quên từ khóa `const` cuối hàm toán tử (`operator+() const`) khiến không cộng được các biến `const` hoặc biến tạm.',
      'Lạm dụng kế thừa (Inheritance) cho mọi thứ trong khi quan hệ "có một" (Composition) đơn giản và dễ bảo trì hơn nhiều.'
    ],
    commonMistakesEn: [
      'Implementing `operator<<` as a member function instead of a non-member/friend function.',
      'Forgetting trailing `const` on `operator+` or `operator==`, preventing calls on temporaries or const objects.',
      'Overusing inheritance when simple composition (`has-a`) is cleaner.'
    ],
    checkpointQuiz: [
      {
        id: 'lcpp4-q1',
        question: 'Tại sao `operator<<` để in `cout << myObj` thường được khai báo là hàm `friend` ngoài lớp?',
        questionEn: 'Why is `operator<<` for `cout << myObj` typically written as a `friend`/non-member function?',
        options: [
          'A. Vì toán hạng bên trái là `std::ostream` (`cout`), không phải lớp của bạn',
          'B. Vì `std::ostream` không có phép cộng',
          'C. Để chạy nhanh hơn khi tối ưu O2',
          'D. Bắt buộc cho mọi toán tử'
        ],
        optionsEn: [
          'A. Because the left operand is `std::ostream` (`cout`), which you cannot modify',
          'B. Because streams lack addition',
          'C. Required for O2 optimization',
          'D. Required for every C++ operator'
        ],
        correctIndex: 0,
        explanation: 'Toán hạng trái của `cout << obj` là `std::ostream`, bạn không thể sửa class chuẩn của thư viện nên viết thành non-member `friend`.',
        explanationEn: 'Since the left-hand operand is `std::ostream`, overloading `<<` requires a non-member/friend signature.'
      },
      {
        id: 'lcpp4-q2',
        question: 'Trong biểu thức Lambda `[&total](int x) { total += x; }`, phần `[&total]` có ý nghĩa gì?',
        questionEn: 'In lambda `[&total](int x) { total += x; }`, what does `[&total]` do?',
        options: [
          'A. Khai báo tham số đầu vào mới',
          'B. Capture biến `total` bên ngoài theo tham chiếu để cập nhật trực tiếp',
          'C. Xóa biến `total` khỏi bộ nhớ',
          'D. Trả về kiểu tham chiếu'
        ],
        optionsEn: [
          'A. Declares a parameter',
          'B. Captures outer variable `total` by reference so the lambda can mutate it',
          'C. Deletes `total`',
          'D. Sets the return type'
        ],
        correctIndex: 1,
        explanation: 'Capture list `[...]` đưa các biến bên ngoài vào thân Lambda; dấu `&` truyền theo tham chiếu.',
        explanationEn: 'The capture clause `[&total]` binds the enclosing `total` variable by reference.'
      }
    ],
    labStarter: {
      title: 'LearnCpp Ch.18–24: Cộng và Rút gọn Hai Phân Số bằng Operator+',
      titleEn: 'LearnCpp Ch.18–24: Operator-Overloaded Fraction Addition',
      description: 'Cho 2 phân số dương a/b và c/d. Hãy cài đặt struct Fraction nạp chồng toán tử `+` và `<<` để in ra tổng phân số đã rút gọn tối giản.',
      descriptionEn: 'Implement `Fraction::operator+` and `operator<<` to print the reduced sum of two positive fractions a/b and c/d.',
      inputFormat: '4 số nguyên dương a b c d.',
      outputFormat: 'Phân số tối giản dạng p/q.',
      sampleInput: '1 2 1 3',
      sampleOutput: '5/6',
      starterCpp: `#include <iostream>
#include <numeric>
using namespace std;

struct Fraction {
    long long num, den;
    Fraction(long long n, long long d) {
        long long g = gcd(n, d);
        num = n / g; den = d / g;
    }
    Fraction operator+(const Fraction& o) const {
        return Fraction(num * o.den + o.num * den, den * o.den);
    }
};

int main() {
    long long a, b, c, d;
    cin >> a >> b >> c >> d;
    Fraction res = Fraction(a, b) + Fraction(c, d);
    cout << res.num << "/" << res.den << '\\n';
    return 0;
}`
    }
  },
  'lcpp-5': {
    stageId: 'lcpp-5',
    quickIntuition:
      'Chặng cuối của LearnCpp ghép 4 mảnh ghép hoàn chỉnh một kỹ sư C++: **Đa hình Ảo (vtable)** để mở rộng hệ thống dễ dàng, **Move Semantics** để chuyển hàng tỷ byte chỉ bằng đổi con trỏ O(1), **Exceptions** xử lý sự cố sạch sẽ, và **File Streams (`ifstream`/`ofstream`)** tự đóng tệp nhờ RAII.',
    quickIntuitionEn:
      'LearnCpp’s final stage unites virtual polymorphism (vtable dispatch), O(1) move semantics, exception safety via stack unwinding, and RAII file streams (`ifstream`/`ofstream`).',
    codeTitle: 'LearnCpp Ch. 25–28: Stream Parsing, Exceptions & Templates',
    codeTitleEn: 'LearnCpp Ch. 25–28: Exception Handling & Stream Parsing',
    cppCode: `#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
using namespace std;

int parsePositive(const string& token) {
    int val = stoi(token);
    if (val < 0) throw runtime_error("Negative not allowed");
    return val;
}

int main() {
    string line;
    getline(cin >> ws, line);
    stringstream ss(line);
    string tok;
    long long total = 0;
    while (ss >> tok) {
        try { total += parsePositive(tok); }
        catch (const exception&) { /* skip invalid */ }
    }
    cout << total << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Quên dùng chế độ đọc từng token/dòng rõ ràng với `stringstream` khi dòng input có độ dài biến đổi.',
      'Tung ngoại lệ từ Destructor (`~Class()`) trong quá trình Stack Unwinding — dễ khiến chương trình bị `std::terminate()` ngay lập tức!',
      'Dùng `while (!fin.eof())` làm vòng lặp đọc file bị lặp thừa dòng cuối — phải viết `while (fin >> x)`.'
    ],
    commonMistakesEn: [
      'Using `while (!fin.eof())` instead of `while (fin >> x)`, causing duplicate last-line reads.',
      'Throwing uncaught exceptions out of destructors during stack unwinding.',
      'Forgetting `stringstream` when parsing variable-length whitespace-separated lines.'
    ],
    checkpointQuiz: [
      {
        id: 'lcpp5-q1',
        question: 'Cách viết vòng lặp đọc tới hết file `ifstream fin` ĐÚNG chuẩn C++ không bị lặp dòng cuối là:',
        questionEn: 'What is the idiomatic C++ loop to read all tokens from `std::ifstream fin`?',
        options: [
          'A. `while (!fin.eof()) { fin >> x; ... }`',
          'B. `while (fin >> x) { ... }`',
          'C. `while (true) { if (fin == NULL) break; }`',
          'D. `for (int i = 0; i < fin.size(); ++i)`'
        ],
        optionsEn: [
          'A. `while (!fin.eof()) { fin >> x; ... }`',
          'B. `while (fin >> x) { ... }`',
          'C. `while (true)`',
          'D. `for (int i = 0; i < fin.size(); ++i)`'
        ],
        correctIndex: 1,
        explanation: 'Toán tử `fin >> x` chỉ đánh giá `true` nếu đọc thành công thực sự, tránh lỗi đọc thừa 1 lần sau phần tử cuối như `eof()`.',
        explanationEn: '`while (fin >> x)` checks stream success directly after extraction, avoiding duplicate EOF iterations.'
      },
      {
        id: 'lcpp5-q2',
        question: 'Quá trình tự động gọi destructor của các biến cục bộ khi có `throw` thoát ngược ra ngoài gọi là gì?',
        questionEn: 'What is the automatic cleanup of local RAII objects when an exception is thrown called?',
        options: ['A. Garbage Collection', 'B. Stack Unwinding', 'C. Dynamic Linking', 'D. Template Instantiation'],
        optionsEn: ['A. Garbage Collection', 'B. Stack Unwinding', 'C. Dynamic Linking', 'D. Template Instantiation'],
        correctIndex: 1,
        explanation: 'Stack Unwinding tự hủy mọi đối tượng RAII theo thứ tự ngược lại cho tới khi gặp khối `catch` phù hợp.',
        explanationEn: 'Stack unwinding destroys local RAII objects in reverse construction order until a matching `catch` block handles the exception.'
      }
    ],
    labStarter: {
      title: 'LearnCpp Ch.25–28: Cộng dồn các số hợp lệ trên 1 dòng với stringstream',
      titleEn: 'LearnCpp Ch.25–28: Stringstream + Exception Sum',
      description: 'Cho một dòng gồm các số nguyên cách nhau bởi dấu cách (có thể chứa số âm). Chỉ cộng các số >= 0 và in ra tổng cuối cùng.',
      descriptionEn: 'Read a full line of space-separated integers via `stringstream` and print the sum of non-negative integers.',
      inputFormat: 'Một dòng chứa nhiều số nguyên.',
      outputFormat: 'Tổng các số >= 0.',
      sampleInput: '10 -4 25 -9 5',
      sampleOutput: '40',
      starterCpp: `#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string line;
    getline(cin >> ws, line);
    stringstream ss(line);
    long long x, sum = 0;
    while (ss >> x) {
        if (x >= 0) sum += x;
    }
    cout << sum << '\\n';
    return 0;
}`
    }
  },

  // =========================================================================
  // 4. GITHUB CAREER TRACK
  // =========================================================================
  'gh-1': {
    stageId: 'gh-1',
    quickIntuition:
      'Một lập trình viên giỏi trên GitHub không chỉ biết code đúng trên máy mình: họ làm việc theo quy trình **Tạo nhánh (Feature Branch) → Commit rõ nghĩa → Mở Pull Request → Robot GitHub Actions tự build & chạy test xanh sạch**. Có CI xanh, nhà tuyển dụng nhìn repo của bạn là tin tưởng ngay!',
    quickIntuitionEn:
      'Strong GitHub engineers work on feature branches, write clear Conventional Commits, open reviewed Pull Requests, and let GitHub Actions CI automatically verify builds and tests on every push.',
    codeTitle: 'GitHub Workflow: Chuẩn hóa xử lý Input sạch & Exit Code chuẩn CI',
    codeTitleEn: 'GitHub CI Mindset: Clean CLI Parser & Deterministic Exit Status',
    cppCode: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Mô phỏng kiểm tra commit message chuẩn Conventional Commits
bool isValidCommit(const string& msg) {
    const vector<string> prefixes = {"feat:", "fix:", "docs:", "refactor:", "test:", "chore:"};
    for (const auto& p : prefixes) {
        if (msg.rfind(p, 0) == 0) return true;
    }
    return false;
}

int main() {
    string line;
    getline(cin >> ws, line);
    cout << (isValidCommit(line) ? "VALID" : "INVALID") << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Commit thẳng vào nhánh `main` mọi thay đổi lớn mà không tạo branch riêng và chạy test trước.',
      'Đẩy nhầm file biên dịch rác (`a.exe`, `.o`, `build/`) hoặc file chứa API key lên GitHub vì thiếu `.gitignore`.',
      'Viết commit message chung chung như `"update"`, `"fix bug 1"` khiến không thể đọc lịch sử.'
    ],
    commonMistakesEn: [
      'Pushing untested changes straight to `main` instead of opening Pull Requests.',
      'Committing compiled binaries (`build/`, `.o`, `.exe`) or `.env` secrets due to a missing `.gitignore`.',
      'Writing vague commit messages like `"fix"` or `"update"`.'
    ],
    checkpointQuiz: [
      {
        id: 'gh1-q1',
        question: 'Tệp nào trong repo C++ trên GitHub dùng để ngăn Git theo dõi các thư mục `build/`, file `.o` và `.env`?',
        questionEn: 'Which file keeps `build/`, `.o`, and `.env` secrets out of your Git repository?',
        options: ['A. CMakeLists.txt', 'B. .gitignore', 'C. LICENSE', 'D. .clang-format'],
        optionsEn: ['A. CMakeLists.txt', 'B. .gitignore', 'C. LICENSE', 'D. .clang-format'],
        correctIndex: 1,
        explanation: '`.gitignore` liệt kê quy tắc tệp/thư mục bỏ qua để repo trên GitHub luôn gọn nhẹ và bảo mật.',
        explanationEn: '`.gitignore` excludes build artifacts and secret files from Git tracking.'
      },
      {
        id: 'gh1-q2',
        question: 'Công cụ nào giúp tự động định dạng code C++ đồng nhất cho cả nhóm trước mỗi Pull Request?',
        questionEn: 'Which tool enforces consistent C++ formatting across a GitHub team?',
        options: ['A. clang-format', 'B. git push --force', 'C. zip', 'D. printf'],
        optionsEn: ['A. clang-format', 'B. git push --force', 'C. zip', 'D. printf'],
        correctIndex: 0,
        explanation: '`clang-format` đọc file `.clang-format` để chuẩn hóa thụt lề, dấu ngoặc và khoảng trắng đồng loạt.',
        explanationEn: '`clang-format` applies repository style rules consistently before PRs merge.'
      }
    ],
    labStarter: {
      title: 'GitHub CI Drill: Kiểm tra chuẩn Conventional Commit Message',
      titleEn: 'GitHub CI Drill: Conventional Commit Linter',
      description: 'Cho 1 dòng commit message. In VALID nếu dòng bắt đầu bằng một trong các tiền tố `feat:`, `fix:`, `docs:`, `test:`, ngược lại in INVALID.',
      descriptionEn: 'Given a commit message line, print VALID if it starts with `feat:`, `fix:`, `docs:`, or `test:`, else INVALID.',
      inputFormat: 'Một dòng văn bản.',
      outputFormat: 'VALID hoặc INVALID.',
      sampleInput: 'feat: add O(N log N) segment tree template',
      sampleOutput: 'VALID',
      starterCpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string msg;
    getline(cin >> ws, msg);
    vector<string> ok = {"feat:", "fix:", "docs:", "test:"};
    bool valid = false;
    for (const auto& p : ok) if (msg.rfind(p, 0) == 0) valid = true;
    cout << (valid ? "VALID" : "INVALID") << '\\n';
    return 0;
}`
    }
  },
  'gh-2': {
    stageId: 'gh-2',
    quickIntuition:
      'Nhánh Kỹ sư Hệ thống & Backend C++ xây dựng những "động cơ phản lực" ẩn dưới mặt nước: cơ sở dữ liệu (như Redis, RocksDB), Web Server chịu tải hàng trăm nghìn kết nối cùng lúc qua `epoll` / Async I/O, và cơ chế ghi log nhật ký (WAL) để mất điện không mất dữ liệu.',
    quickIntuitionEn:
      'Systems & Backend C++ engineers build high-throughput databases, caches, and async network servers using non-blocking I/O (`epoll`/Asio), binary protocols, and Write-Ahead Logs (WAL).',
    codeTitle: 'Systems Branch: Mô phỏng Key-Value Store In-Memory với Hash Index',
    codeTitleEn: 'Systems Branch: In-Memory Key-Value Engine (SET / GET)',
    cppCode: `#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    unordered_map<string, string> kv;
    while (q--) {
        string cmd, k, v;
        cin >> cmd >> k;
        if (cmd == "SET") {
            cin >> v;
            kv[k] = v;
        } else if (cmd == "GET") {
            auto it = kv.find(k);
            cout << (it != kv.end() ? it->second : "NULL") << '\\n';
        }
    }
    return 0;
}`,
    commonMistakes: [
      'Tạo 1 thread mới cho mỗi kết nối TCP (C10K problem) làm cạn kiệt RAM và context-switch thay vì dùng Event Loop / epoll.',
      'Đọc/ghi socket mạng mà giả sử 1 lần gọi `recv()` sẽ nhận trọn gói tin — TCP là dòng byte liên tục, phải đọc theo framing/độ dài.',
      'Dùng `kv[k]` để tra cứu khi kiểm tra tồn tại: `operator[]` sẽ TỰ ĐỘNG chèn key rỗng mới vào `unordered_map`! Phải dùng `kv.find(k)`.'
    ],
    commonMistakesEn: [
      'Spawning one OS thread per socket connection instead of event-driven I/O (`epoll` / Asio).',
      'Assuming a single `recv()` call delivers a complete message on a TCP byte stream.',
      'Checking existence with `map[key]`, which accidentally inserts default values; always use `map.find(key)`.'
    ],
    checkpointQuiz: [
      {
        id: 'gh2-q1',
        question: 'Khi tra xem key `k` có tồn tại trong `std::unordered_map<string, int> mp` mà KHÔNG làm phình map, nên dùng:',
        questionEn: 'How should you check if key `k` exists in `std::unordered_map` without inserting it?',
        options: ['A. `if (mp[k])`', 'B. `if (mp.find(k) != mp.end())` (hoặc `mp.contains(k)` C++20)', 'C. `mp.clear()`', 'D. `sort(mp)`'],
        optionsEn: ['A. `if (mp[k])`', 'B. `if (mp.find(k) != mp.end())` or `mp.contains(k)`', 'C. `mp.clear()`', 'D. `sort(mp)`'],
        correctIndex: 1,
        explanation: '`mp[k]` tự tạo mục mới nếu `k` chưa tồn tại. `mp.find(k)` / `mp.contains(k)` chỉ đọc mà không làm thay đổi map.',
        explanationEn: '`mp[k]` mutates the map by inserting a default entry if absent; `.contains(k)` / `.find(k)` is strictly read-only.'
      },
      {
        id: 'gh2-q2',
        question: 'Trong cơ sở dữ liệu Key-Value (như RocksDB/Redis), kỹ thuật WAL (Write-Ahead Log) dùng để:',
        questionEn: 'What problem does a Write-Ahead Log (WAL) solve in storage engines?',
        options: [
          'A. Tô màu syntax trong trình soạn thảo',
          'B. Khôi phục dữ liệu không bị mất khi máy sập nguồn đột ngột',
          'C. Render đồ họa 3D',
          'D. Nén ảnh PNG'
        ],
        optionsEn: [
          'A. Syntax highlighting',
          'B. Crash recovery durability before flushing in-memory tables to disk',
          'C. 3D shader rendering',
          'D. PNG compression'
        ],
        correctIndex: 1,
        explanation: 'Ghi tuần tự các lệnh thay đổi vào file log trên ổ đĩa trước giúp dựng lại toàn bộ trạng thái RAM nếu mất điện.',
        explanationEn: 'Appending mutations sequentially to an on-disk log lets the engine replay and recover state after a crash.'
      }
    ],
    labStarter: {
      title: 'Systems Lab: Mô phỏng Mini Key-Value Store (SET / GET)',
      titleEn: 'Systems Lab: In-Memory Key-Value Engine',
      description: 'Thực hiện Q truy vấn (`1 <= Q <= 10^5`): `SET k v` gán giá trị `v` cho khóa `k`, `GET k` in giá trị hiện tại của `k` (hoặc `NULL` nếu chưa có).',
      descriptionEn: 'Process Q queries: `SET k v` stores key-value, `GET k` prints the value or `NULL` if missing.',
      inputFormat: 'Dòng 1: Q. Q dòng tiếp theo: SET k v hoặc GET k.',
      outputFormat: 'Mỗi truy vấn GET in 1 dòng.',
      sampleInput: '4\nSET host localhost\nGET host\nGET port\nSET port 3000',
      sampleOutput: 'localhost\nNULL',
      starterCpp: `#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    unordered_map<string, string> store;
    while (q--) {
        string op, k, v;
        cin >> op >> k;
        if (op == "SET") { cin >> v; store[k] = v; }
        else { cout << (store.count(k) ? store[k] : "NULL") << '\\n'; }
    }
    return 0;
}`
    }
  },
  'gh-3': {
    stageId: 'gh-3',
    quickIntuition:
      'Trong Game Engine & Mô phỏng 3D, mọi nhân vật/hạt vật lý đều cập nhật 60–120 lần mỗi giây! Kiến trúc **ECS (Entity-Component-System)** xếp dữ liệu vị trí `[x1, x2, x3...]` liền kề nhau trong `std::vector` để CPU Cache nạp 1 phát xử lý hàng vạn vật thể mượt 60 FPS thay vì nhảy cóc từng con trỏ OOP rời rạc.',
    quickIntuitionEn:
      'In Game/3D Engines, ECS stores tightly packed `std::vector` component arrays so the CPU cache processes tens of thousands of entities per frame smoothly at 60+ FPS, alongside math primitives like Dot Product and AABB intersection.',
    codeTitle: 'Game/Graphics Branch: Tích vô hướng & Kiểm tra va chạm 2 hộp AABB',
    codeTitleEn: 'Game/Graphics Branch: AABB Overlap Detection in C++',
    cppCode: `#include <iostream>
using namespace std;

struct AABB {
    double minX, minY, maxX, maxY;
    bool overlaps(const AABB& o) const {
        return !(maxX < o.minX || o.maxX < minX || maxY < o.minY || o.maxY < minY);
    }
};

int main() {
    AABB a{}, b{};
    cin >> a.minX >> a.minY >> a.maxX >> a.maxY;
    cin >> b.minX >> b.minY >> b.maxX >> b.maxY;
    cout << (a.overlaps(b) ? "COLLIDE" : "CLEAR") << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Cập nhật vị trí bằng `pos += vel` mà không nhân với `deltaTime` (hoặc không dùng Fixed Timestep) làm game chạy nhanh/chậm theo tốc độ màn hình.',
      'Cấp phát `new Particle()` rời rạc hàng trăm lần mỗi giây thay vì lưu mảng liền kề Data-Oriented Design.',
      'Dùng góc Euler (Pitch/Yaw/Roll) xoay tự do gây hiện tượng khóa khớp (Gimbal Lock) thay vì Quaternion.'
    ],
    commonMistakesEn: [
      'Updating physics without a fixed timestep or `dt`, tying game speed to monitor refresh rate.',
      'Allocating individual heap objects per particle/entity instead of contiguous `std::vector` arrays.',
      'Using raw Euler angles for full 3D orientation and hitting Gimbal Lock instead of Quaternions.'
    ],
    checkpointQuiz: [
      {
        id: 'gh3-q1',
        question: 'Tại sao kiến trúc Data-Oriented / ECS dùng `std::vector<Vec3>` liền kề nhanh hơn danh sách con trỏ OOP rời rạc?',
        questionEn: 'Why is contiguous `std::vector<Vec3>` ECS storage faster than scattered heap pointers?',
        options: [
          'A. Tận dụng CPU Cache Locality — đọc tuần tự ít bị Cache Miss',
          'B. Tốn nhiều RAM hơn nên nhanh hơn',
          'C. Tự động dùng GPU vẽ chữ',
          'D. Bỏ qua được hệ tọa độ Oxyz'
        ],
        optionsEn: [
          'A. Maximizes CPU cache locality and hardware prefetching',
          'B. Uses extra memory allocations',
          'C. Runs automatically on GPU shaders',
          'D. Skips 3D coordinate transforms'
        ],
        correctIndex: 0,
        explanation: 'Dữ liệu đặt cạnh nhau trong RAM được nạp trọn vào cache line của CPU, tăng tốc vòng lặp cập nhật vật lý lên nhiều lần.',
        explanationEn: 'Contiguous memory maximizes cache-line hits and CPU vectorization during frame updates.'
      },
      {
        id: 'gh3-q2',
        question: 'Hai hộp hình chữ nhật AABB (`[x1, y1, x2, y2]` và `[u1, v1, u2, v2]`) KHÔNG giao nhau khi:',
        questionEn: 'When are two 2D Axis-Aligned Bounding Boxes (AABBs) guaranteed NOT to overlap?',
        options: [
          'A. Khi một hộp nằm hoàn toàn bên trái/phải hoặc trên/dưới hộp kia',
          'B. Khi hai hộp có diện tích khác nhau',
          'C. Khi tọa độ có số âm',
          'D. Chỉ khi một hộp là hình vuông'
        ],
        optionsEn: [
          'A. When separated along either the X axis or Y axis',
          'B. Whenever their areas differ',
          'C. When coordinates are negative',
          'D. Only when both are squares'
        ],
        correctIndex: 0,
        explanation: 'Theo định lý trục tách (Separating Axis), hai AABB không chạm nhau nếu tách rời trên trục X hoặc trục Y.',
        explanationEn: 'By the Separating Axis Theorem, AABBs are disjoint iff they do not overlap on X or Y.'
      }
    ],
    labStarter: {
      title: 'Game Physics Lab: Kiểm tra va chạm 2 hình hộp AABB',
      titleEn: 'Game Physics Lab: 2D AABB Collision Check',
      description: 'Cho 2 hình hộp chữ nhật song song trục tọa độ: hộp 1 (x1, y1, x2, y2) và hộp 2 (u1, v1, u2, v2). In `COLLIDE` nếu hai hộp chạm/chồng lên nhau, ngược lại in `CLEAR`.',
      descriptionEn: 'Given two 2D axis-aligned rectangles, print `COLLIDE` if they overlap or touch, and `CLEAR` otherwise.',
      inputFormat: 'Dòng 1: x1 y1 x2 y2. Dòng 2: u1 v1 u2 v2.',
      outputFormat: 'COLLIDE hoặc CLEAR.',
      sampleInput: '0 0 4 4\n3 2 6 5',
      sampleOutput: 'COLLIDE',
      starterCpp: `#include <iostream>
using namespace std;

int main() {
    double x1, y1, x2, y2, u1, v1, u2, v2;
    cin >> x1 >> y1 >> x2 >> y2 >> u1 >> v1 >> u2 >> v2;
    bool separated = (x2 < u1 || u2 < x1 || y2 < v1 || v2 < y1);
    cout << (separated ? "CLEAR" : "COLLIDE") << '\\n';
    return 0;
}`
    }
  },
  'gh-4': {
    stageId: 'gh-4',
    quickIntuition:
      'Ở chặng cuối Career Track, bạn rèn kỹ năng giải thuật toán tốc độ cao (như LIS $O(N \\log N)$, Segment Tree, KMP) kết hợp tư duy **Low-Latency**: hạn chế cấp phát bộ nhớ động (dùng Ring Buffer / Object Pool) và tự tin đọc, sửa lỗi, gửi Pull Request vào các dự án mã nguồn mở lớn trên GitHub!',
    quickIntuitionEn:
      'The final career track pairs algorithmic interview mastery (O(N log N) LIS, SegTree, KMP) with low-latency C++ habits (ring buffers, arena allocators) and real open-source GitHub contributions.',
    codeTitle: 'Algorithms & Low-Latency: Dãy con tăng dài nhất O(N log N)',
    codeTitleEn: 'Algorithms & Low-Latency: O(N log N) Patience Sorting LIS',
    cppCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> tails;
    tails.reserve(n);
    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    cout << tails.size() << '\\n';
    return 0;
}`,
    commonMistakes: [
      'Trong `std::vector` biết trước kích thước `N`, quên gọi `v.reserve(N)` khiến vector phải cấp phát lại bộ nhớ và copy nhiều lần (`2, 4, 8, ...`).',
      'Nhầm `lower_bound` (tăng NGHIÊM NGẶT `<`) với `upper_bound` (tăng KHÔNG GIẢM `<=`) khi tìm LIS.',
      'Khi đóng góp Open-Source trên GitHub, mở PR khổng lồ sửa nhiều thứ ngoài issue hoặc quên bổ sung test cho bug mình vừa sửa.'
    ],
    commonMistakesEn: [
      'Forgetting `v.reserve(N)` on hot paths, triggering repeated heap reallocations.',
      'Confusing `lower_bound` (strictly increasing LIS) with `upper_bound` (non-decreasing LIS).',
      'Submitting oversized open-source PRs without unit tests covering the fix.'
    ],
    checkpointQuiz: [
      {
        id: 'gh4-q1',
        question: 'Gọi `tails.reserve(n)` trước khi `push_back` $N$ lần vào `std::vector` có tác dụng gì?',
        questionEn: 'What does `tails.reserve(n)` achieve before pushing $N$ items into a `std::vector`?',
        options: [
          'A. Cấp phát sẵn đủ sức chứa RAM 1 lần, tránh reallocate và copy giữa chừng',
          'B. Điền sẵn $N$ số 0 vào mảng (làm `size()` thành `n`)',
          'C. Sắp xếp mảng giảm dần',
          'D. Tự động xóa các phần tử trùng nhau'
        ],
        optionsEn: [
          'A. Pre-allocates capacity once to eliminate intermediate heap reallocations',
          'B. Sets `size()` to `n` and fills zeroes',
          'C. Sorts descending',
          'D. Deduplicates elements'
        ],
        correctIndex: 0,
        explanation: '`reserve(n)` chỉ tăng `capacity()` mà giữ nguyên `size() == 0`, giúp `push_back` không phải xin cấp phát lại vùng nhớ mới.',
        explanationEn: '`reserve(n)` increases capacity without changing `size()`, avoiding costly reallocations during pushes.'
      },
      {
        id: 'gh4-q2',
        question: 'Để tìm Dãy con tăng NGHIÊM NGẶT dài nhất (LIS) trong $O(N \\log N)$, ta dùng hàm STL nào trên mảng `tails`?',
        questionEn: 'Which binary search helper updates `tails` for strictly increasing LIS in $O(N \\log N)$?',
        options: ['A. upper_bound', 'B. lower_bound', 'C. next_permutation', 'D. accumulate'],
        optionsEn: ['A. upper_bound', 'B. lower_bound', 'C. next_permutation', 'D. accumulate'],
        correctIndex: 1,
        explanation: '`lower_bound` tìm vị trí đầu tiên `>= x`, đảm bảo phần tử đứng ngay trước đó luôn nhỏ hơn hẳn `x`.',
        explanationEn: '`lower_bound` replaces the first tail `>= x`, preserving strictly increasing sequence tails.'
      }
    ],
    labStarter: {
      title: 'Career Track DSA: Dãy con tăng dài nhất O(N log N)',
      titleEn: 'Career Track DSA: Longest Increasing Subsequence O(N log N)',
      description: 'Cho dãy N số nguyên A[1..N] (1 <= N <= 10^5). Hãy tìm độ dài của dãy con tăng nghiêm ngặt dài nhất (LIS).',
      descriptionEn: 'Given N integers (1 <= N <= 10^5), find the length of the longest strictly increasing subsequence.',
      inputFormat: 'Dòng 1: N. Dòng 2: N số nguyên.',
      outputFormat: 'Một số nguyên duy nhất là độ dài LIS.',
      sampleInput: '6\n3 10 2 1 20 5',
      sampleOutput: '3',
      starterCpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> tails;
    tails.reserve(n);
    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    cout << tails.size() << '\\n';
    return 0;
}`
    }
  }
};
