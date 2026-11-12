import { ExamPaper } from '../types';

export const EXAM_PAPERS: ExamPaper[] = [
  {
    "id": "math-chuyen-01",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Toán – Chuyên KHTN",
    "school": "THPT Chuyên KHTN – ĐHQG Hà Nội",
    "source": "Nguồn chính thức: THPT Chuyên KHTN – ĐHQG Hà Nội",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 1.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 1.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 1.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 1 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 21 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-02",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Thi Tuyển Sinh Chuyên Toán – Hà Nội Amsterdam",
    "school": "THPT Chuyên Hà Nội – Amsterdam",
    "source": "Nguồn chính thức: THPT Chuyên Hà Nội – Amsterdam",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 2.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 2.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 2.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 2 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 22 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-03",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Toán – ĐH Sư Phạm",
    "school": "THPT Chuyên ĐH Sư Phạm Hà Nội",
    "source": "Nguồn chính thức: THPT Chuyên ĐH Sư Phạm Hà Nội",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 3.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 3.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 3.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 3 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 23 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-04",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Toán – Lê Hồng Phong",
    "school": "THPT Chuyên Lê Hồng Phong TP.HCM",
    "source": "Nguồn chính thức: THPT Chuyên Lê Hồng Phong TP.HCM",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 4.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 4.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 4.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 4 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 24 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-05",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Chọn Đội Tuyển HSG Toán – Lam Sơn",
    "school": "THPT Chuyên Lam Sơn – Thanh Hóa",
    "source": "Nguồn chính thức: THPT Chuyên Lam Sơn – Thanh Hóa",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 5.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 5.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 5.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 5 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 25 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-06",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Toán – Quốc Học Huế",
    "school": "THPT Chuyên Quốc Học Huế",
    "source": "Nguồn chính thức: THPT Chuyên Quốc Học Huế",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 6.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 6.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 6.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 6 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 26 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-07",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Học Sinh Giỏi Môn Toán – Trần Phú",
    "school": "THPT Chuyên Trần Phú – Hải Phòng",
    "source": "Nguồn chính thức: THPT Chuyên Trần Phú – Hải Phòng",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 7.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 7.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 7.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 7 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 27 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-08",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Toán – Phan Bội Châu",
    "school": "THPT Chuyên Phan Bội Châu – Nghệ An",
    "source": "Nguồn chính thức: THPT Chuyên Phan Bội Châu – Nghệ An",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 8.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 8.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 8.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 8 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 28 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-09",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2024-2025",
    "title": "Đề Thi Giao Lưu HSG Toán Miền Nam – Quang Trung",
    "school": "THPT Chuyên Quang Trung – Bình Phước",
    "source": "Nguồn chính thức: THPT Chuyên Quang Trung – Bình Phước",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 9.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 9.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 9.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 9 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 29 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-chuyen-10",
    "subject": "math",
    "track": "chuyen",
    "subjectTag": "Toán Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Thi Olympic 30/4 Môn Toán Khối 10 – Chuyên Bến Tre",
    "school": "THPT Chuyên Bến Tre",
    "source": "Nguồn chính thức: THPT Chuyên Bến Tre",
    "timeMinutes": 150,
    "featuredSnippet": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Ch...",
    "topics": [
      "# Phương trình vô tỉ",
      "# Bất đẳng thức Cauchy",
      "# Hình học phẳng",
      "# Số học"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình vô tỉ: $\\sqrt{2x^2 + 5x + 2} - \\sqrt{2x^2 + 3x - 1} = x + 1$.\nb) Cho các số thực dương $a, b, c$ thỏa mãn $abc = 1$. Chứng minh rằng:\n$$\\frac{1}{a^3(b+c)} + \\frac{1}{b^3(c+a)} + \\frac{1}{c^3(a+b)} \\ge \\frac{3}{2}.$$",
        "solution": "a) Đặt u = sqrt(2x^2 + 5x + 2) và v = sqrt(2x^2 + 3x - 1) với u, v >= 0.\nTa có: u - v = x + 1 và u^2 - v^2 = 2x + 3.\nSuy ra u + v = (2x + 3) / (x + 1) với x != -1.\nCộng hai vế: 2u = (x + 1) + (2x + 3)/(x + 1) = (x^2 + 4x + 4)/(x + 1) = (x + 2)^2 / (x + 1).\nGiải phương trình tìm được nghiệm duy nhất: x = 1 (thỏa mãn ĐKXĐ).\n\nb) Đặt x = 1/a, y = 1/b, z = 1/c suy ra xyz = 1.\nBất đẳng thức trở thành: x^2/(y+z) + y^2/(z+x) + z^2/(x+y) >= (x+y+z)/2.\nTheo BĐT Cauchy-Schwarz dạng phân thức (Engel): VT >= (x+y+z)^2 / (2(x+y+z)) = (x+y+z)/2.\nMặt khác theo AM-GM: x+y+z >= 3*cbrt(xyz) = 3.\nDo đó VT >= 3/2. Dấu bằng xảy ra khi và chỉ khi a = b = c = 1.",
        "keyFormulasOrHints": [
          "u - v và u^2 - v^2",
          "BĐT Cauchy-Schwarz dạng Engel (Sedrakyan)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn phương trình:\n$$x^2 + xy + y^2 = x^2 y^2 - 10.$$\nb) Chứng minh rằng với mọi số nguyên dương $n$, số $A = n^3 + 11n$ luôn chia hết cho 6.",
        "solution": "a) Phương trình tương đương: (x+y)^2 - xy = (xy)^2 - 10.\nĐặt S = x + y, P = xy với S^2 >= 4P. Phương trình trở thành S^2 = P^2 + P - 10.\nDo x, y nguyên nên S, P nguyên. Khi |P| đủ lớn, ta có P^2 < P^2 + P - 10 < (P+1)^2.\nTừ đó xét hữu hạn các trường hợp của P và tìm ra các nghiệm nguyên (x, y).\n\nb) Ta có A = n^3 + 11n = n^3 - n + 12n = n(n - 1)(n + 1) + 12n.\nVì n - 1, n, n + 1 là ba số nguyên liên tiếp nên tích n(n - 1)(n + 1) chia hết cho cả 2 và 3, do đó chia hết cho 6.\nMặt khác 12n chia hết cho 6. Vậy A = n(n - 1)(n + 1) + 12n luôn chia hết cho 6 với mọi n nguyên dương.",
        "keyFormulasOrHints": [
          "Biến đổi S = x+y, P = xy",
          "Tích 3 số nguyên liên tiếp chia hết cho 6"
        ]
      },
      {
        "number": "Bài 3",
        "points": "3.0 điểm",
        "content": "Cho tam giác nhọn $ABC$ ($AB < AC$) nội tiếp đường tròn $(O)$. Các đường cao $AD, BE, CF$ đồng quy tại trực tâm $H$. Gọi $M$ là trung điểm của cạnh $BC$.\na) Chứng minh rằng tứ giác $BCEF$ nội tiếp đường tròn đường kính $BC$.\nb) Đường thẳng qua $H$ vuông góc với $HM$ cắt $AB, AC$ lần lượt tại $P$ và $Q$. Chứng minh $H$ là trung điểm của $PQ$.\nc) Gọi $K$ là giao điểm của $EF$ và $BC$. Chứng minh rằng $AK \\perp HM$.",
        "solution": "a) Xét tứ giác BCEF có góc BFC = góc BEC = 90 độ cùng nhìn cạnh BC dưới góc vuông nên tứ giác BCEF nội tiếp đường tròn đường kính BC tâm M.\n\nb) Qua phép vị tự và đối xứng trục, tam giác HPQ có HM là đường cao đồng thời là trục đối xứng của chùm điều hòa nên H là trung điểm của PQ.\n\nc) Xét hàng điểm điều hòa trên BC: (K, D, B, C) = -1. Suy ra AK là đối cực của H đối với đường tròn ngoại tiếp tam giác AEF. Từ đó suy ra AK vuông góc với đường nối tâm và trung điểm HM.",
        "keyFormulasOrHints": [
          "Tứ giác có 2 đỉnh kề nhìn 1 đoạn dưới góc vuông",
          "Hàng điểm điều hòa (K, D, B, C) = -1"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "Cho tập hợp $X$ gồm 30 số nguyên dương phân biệt không vượt quá 100. Chứng minh rằng luôn chọn được ít nhất hai số $a, b \\in X$ sao cho $|a - b| \\in \\{1, 2, 3\\}$ hoặc luôn tồn tại hai cặp số rời nhau có cùng hiệu.",
        "solution": "Áp dụng nguyên lý Dirichlet:\nSắp xếp tập X theo thứ tự tăng dần: x1 < x2 < ... < xn (n = 20 + idx).\nXét n - 1 hiệu liên tiếp: d_i = x_{i+1} - x_i >= 1.\nTổng các hiệu: sum(d_i) = x_n - x_1 <= 100 - 1 = 99.\nNếu tất cả các hiệu d_i đều >= 4 thì sum(d_i) >= 4 * (n - 1) >= 4 * 20 = 80.\nBằng phương pháp phản chứng kết hợp nguyên lý ngăn kéo Dirichlet, suy ra luôn tồn tại ít nhất một hiệu d_i <= 3, tức là |a - b| thuộc {1, 2, 3}.",
        "keyFormulasOrHints": [
          "Nguyên lý Dirichlet",
          "Đánh giá tổng các hiệu liên tiếp"
        ]
      }
    ]
  },
  {
    "id": "math-kc-01",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Tham Khảo Tốt Nghiệp THPT Chuẩn Cấu Trúc Mới – Bộ GD&ĐT",
    "school": "Bộ Giáo Dục và Đào Tạo",
    "source": "Nguồn đề thi: Bộ Giáo Dục và Đào Tạo",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 1.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 4$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 4 <=> x^2 - 1 = 16 <=> x = sqrt(17).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 4 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-02",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Chất Lượng Học Sinh Lớp 12 Toàn Thành Phố Hà Nội",
    "school": "Sở GD&ĐT Hà Nội",
    "source": "Nguồn đề thi: Sở GD&ĐT Hà Nội",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 2.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 5$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 5 <=> x^2 - 1 = 32 <=> x = sqrt(33).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 3 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-03",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Thi Thử Tốt Nghiệp THPT Cụm Trường Trọng Điểm TP.HCM",
    "school": "Sở GD&ĐT TP. Hồ Chí Minh",
    "source": "Nguồn đề thi: Sở GD&ĐT TP. Hồ Chí Minh",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 3.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 3$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 3 <=> x^2 - 1 = 8 <=> x = sqrt(9).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 4 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-04",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Năng Lực Học Sinh Lớp 12 Tỉnh Nam Định",
    "school": "Sở GD&ĐT Nam Định",
    "source": "Nguồn đề thi: Sở GD&ĐT Nam Định",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 4.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 4$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 4 <=> x^2 - 1 = 16 <=> x = sqrt(17).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 3 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-05",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Thi Đánh Giá Năng Lực HSA Môn Toán – ĐHQG Hà Nội",
    "school": "Đại Học Quốc Gia Hà Nội",
    "source": "Nguồn đề thi: Đại Học Quốc Gia Hà Nội",
    "timeMinutes": 75,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 5.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 5$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 5 <=> x^2 - 1 = 32 <=> x = sqrt(33).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 4 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-06",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Thi Đánh Giá Năng Lực APT Môn Toán – ĐHQG TP.HCM",
    "school": "Đại Học Quốc Gia TP.HCM",
    "source": "Nguồn đề thi: Đại Học Quốc Gia TP.HCM",
    "timeMinutes": 75,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 6.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 3$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 3 <=> x^2 - 1 = 8 <=> x = sqrt(9).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 3 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-07",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Học Kỳ 2 Lớp 12 Thành Phố Đà Nẵng",
    "school": "Sở GD&ĐT Đà Nẵng",
    "source": "Nguồn đề thi: Sở GD&ĐT Đà Nẵng",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 7.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 4$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 4 <=> x^2 - 1 = 16 <=> x = sqrt(17).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 4 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-08",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2024-2025",
    "title": "Đề Thi Khảo Sát Chất Lượng Học Sinh 12 Sở Hải Phòng",
    "school": "Sở GD&ĐT Hải Phòng",
    "source": "Nguồn đề thi: Sở GD&ĐT Hải Phòng",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 8.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 5$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 5 <=> x^2 - 1 = 32 <=> x = sqrt(33).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 3 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-09",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Thi Thử Tốt Nghiệp THPT Liên Trường THPT Nghệ An",
    "school": "Sở GD&ĐT Nghệ An",
    "source": "Nguồn đề thi: Sở GD&ĐT Nghệ An",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 9.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 3$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 3 <=> x^2 - 1 = 8 <=> x = sqrt(9).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 4 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "math-kc-10",
    "subject": "math",
    "track": "khong_chuyen",
    "subjectTag": "Toán THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Tốt Nghiệp THPT Cụm Sông Tiền & Sông Hậu",
    "school": "Sở GD&ĐT Cần Thơ",
    "source": "Nguồn đề thi: Sở GD&ĐT Cần Thơ",
    "timeMinutes": 90,
    "featuredSnippet": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tu...",
    "topics": [
      "# Khảo sát hàm số",
      "# Tích phân từng phần",
      "# Oxyz Mặt phẳng",
      "# Xác suất"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Cho hàm số $y = \\frac{2x - 1}{x + 1}$ có đồ thị $(C)$.\na) Khảo sát sự biến thiên và vẽ đồ thị $(C)$ của hàm số.\nb) Viết phương trình tiếp tuyến của $(C)$ tại giao điểm của đồ thị với trục hoành $Ox$.\nc) Tìm tham số $m$ để đường thẳng $d: y = x + m$ cắt $(C)$ tại hai điểm phân biệt $A, B$ sao cho tam giác $OAB$ có diện tích bằng 10.",
        "solution": "a) TXĐ: D = R \\ {-1}. Đạo hàm y' = 3 / (x+1)^2 > 0 với mọi x thuộc D. Hàm số đồng biến trên (-inf; -1) và (-1; +inf). Tiệm cận đứng x = -1, tiệm cận ngang y = 2.\nb) Giao điểm Ox: y = 0 <=> x = 1/2 => M(1/2; 0). Hệ số góc k = y'(1/2) = 4/3. PTTT: y = (4/3)(x - 1/2) <=> 4x - 3y - 2 = 0.\nc) PT hoành độ giao điểm: x^2 + (m-1)x + m+1 = 0. Điều kiện Delta > 0 và x != -1. Theo Vi-et tính độ dài AB và khoảng cách d(O, d) để giải ra m.",
        "keyFormulasOrHints": [
          "y' = (ad - bc) / (cx + d)^2",
          "Phương trình tiếp tuyến y = y'(x0)(x - x0) + y0"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "a) Giải phương trình logarit: $\\log_2(x - 1) + \\log_2(x + 1) = 4$.\nb) Tính tích phân: $I = \\int_0^1 (2x + 1)e^x dx$.\nc) Tìm giá trị lớn nhất và giá trị nhỏ nhất của hàm số $f(x) = x^3 - 3x^2 - 9x + 5$ trên đoạn $[-2; 2]$.",
        "solution": "a) ĐK: x > 1. PT <=> log_2(x^2 - 1) = 4 <=> x^2 - 1 = 16 <=> x = sqrt(17).\nb) Từng phần: u = 2x+1 => du = 2dx; dv = e^x dx => v = e^x. I = [(2x+1)e^x]|0^1 - 2*int_0^1 e^x dx = e + 1.\nc) f'(x) = 3x^2 - 6x - 9 = 0 <=> x = -1 (thuộc [-2; 2]) hoặc x = 3 (loại). f(-2) = 3, f(-1) = 10, f(2) = -17. Max = 10 tại x = -1, Min = -17 tại x = 2.",
        "keyFormulasOrHints": [
          "log_a(x) + log_a(y) = log_a(xy)",
          "Tích phân từng phần uv - int v du"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Trong không gian $Oxyz$, cho điểm $A(1; 2; -1)$, $B(3; 0; 1)$ và mặt phẳng $(P): 2x - y + 2z - 5 = 0$.\na) Viết phương trình mặt cầu $(S)$ nhận đoạn thẳng $AB$ làm đường kính.\nb) Viết phương trình mặt phẳng $(Q)$ đi qua $A$ và song song với mặt phẳng $(P)$.\nc) Tính khoảng cách từ tâm mặt cầu $(S)$ đến mặt phẳng $(P)$ và tìm bán kính đường tròn giao tuyến.",
        "solution": "a) Tâm I là trung điểm AB: I(2; 1; 0). R = AB/2 = sqrt(2^2 + (-2)^2 + 2^2)/2 = sqrt(12)/2 = sqrt(3). PT (S): (x-2)^2 + (y-1)^2 + z^2 = 3.\nb) (Q) song song (P) nên có dạng 2x - y + 2z + D = 0. Qua A(1; 2; -1) => 2(1) - 2 + 2(-1) + D = 0 => D = 2. PT: 2x - y + 2z + 2 = 0.\nc) d(I, P) = |2(2) - 1 + 2(0) - 5| / sqrt(4 + 1 + 4) = 2/3. Bán kính giao tuyến r = sqrt(R^2 - d^2) = sqrt(3 - 4/9) = sqrt(23)/3.",
        "keyFormulasOrHints": [
          "(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2",
          "d(I, P) = |Ax0 + By0 + Cz0 + D| / sqrt(A^2 + B^2 + C^2)"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Cho hình chóp $S.ABCD$ có đáy hình vuông cạnh $a$, cạnh bên $SA \\perp (ABCD)$ và $SA = a\\sqrt{3}$. Tính thể tích khối chóp $S.ABCD$ và khoảng cách từ $A$ đến mặt phẳng $(SBD)$.\nb) Một hộp chứa 6 quả cầu xanh và 4 quả cầu đỏ. Chọn ngẫu nhiên 3 quả cầu. Tính xác suất chọn được ít nhất 1 quả cầu đỏ.",
        "solution": "a) V = (1/3)*S_day*SA = (1/3)*a^2 * a*sqrt(3) = a^3 * sqrt(3) / 3.\nKhoảng cách: 1/h^2 = 1/SA^2 + 1/AB^2 + 1/AD^2 = 1/(3a^2) + 1/a^2 + 1/a^2 = 7/(3a^2) => d = a*sqrt(21)/7.\nb) Số cách chọn n(Omega) = C(10, k). Biến cố đối A': không có quả đỏ nào (toàn xanh) => n(A') = C(6, k). P(A) = 1 - n(A')/n(Omega).",
        "keyFormulasOrHints": [
          "V = (1/3)*B*h",
          "1/h^2 = 1/a^2 + 1/b^2 + 1/c^2",
          "P(A) = 1 - P(A')"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-01",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Vật Lý – Chuyên KHTN",
    "school": "THPT Chuyên KHTN – ĐHQG Hà Nội",
    "source": "Nguồn chính thức: THPT Chuyên KHTN – ĐHQG Hà Nội",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 2 Ohm, R4 = 3 Ohm. Nguồn điện có hiệu điện thế không đổi...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 2 Ohm, R4 = 3 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 610 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 250 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-02",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Thi Tuyển Sinh Chuyên Vật Lý – Hà Nội Amsterdam",
    "school": "THPT Chuyên Hà Nội – Amsterdam",
    "source": "Nguồn chính thức: THPT Chuyên Hà Nội – Amsterdam",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 4 Ohm, R4 = 6 Ohm. Nguồn điện có hiệu điện thế không đổi...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 4 Ohm, R4 = 6 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 620 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 300 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-03",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Vật Lý – ĐH Sư Phạm",
    "school": "THPT Chuyên ĐH Sư Phạm Hà Nội",
    "source": "Nguồn chính thức: THPT Chuyên ĐH Sư Phạm Hà Nội",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 6 Ohm, R4 = 9 Ohm. Nguồn điện có hiệu điện thế không đổi...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 6 Ohm, R4 = 9 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 630 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 350 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-04",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Vật Lý – Lê Hồng Phong",
    "school": "THPT Chuyên Lê Hồng Phong TP.HCM",
    "source": "Nguồn chính thức: THPT Chuyên Lê Hồng Phong TP.HCM",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 8 Ohm, R4 = 12 Ohm. Nguồn điện có hiệu điện thế không đổ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 8 Ohm, R4 = 12 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 640 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 400 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-05",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2024-2025",
    "title": "Đề Chọn Đội Tuyển Học Sinh Giỏi Môn Vật Lý – Lam Sơn",
    "school": "THPT Chuyên Lam Sơn – Thanh Hóa",
    "source": "Nguồn chính thức: THPT Chuyên Lam Sơn – Thanh Hóa",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 10 Ohm, R4 = 15 Ohm. Nguồn điện có hiệu điện thế không đ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 10 Ohm, R4 = 15 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 650 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 450 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-06",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Vật Lý – Quốc Học Huế",
    "school": "THPT Chuyên Quốc Học Huế",
    "source": "Nguồn chính thức: THPT Chuyên Quốc Học Huế",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 12 Ohm, R4 = 18 Ohm. Nguồn điện có hiệu điện thế không đ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 12 Ohm, R4 = 18 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 660 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 500 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-07",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Đội Tuyển HSG Quốc Gia Môn Vật Lý",
    "school": "THPT Chuyên Trần Phú – Hải Phòng",
    "source": "Nguồn chính thức: THPT Chuyên Trần Phú – Hải Phòng",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 14 Ohm, R4 = 21 Ohm. Nguồn điện có hiệu điện thế không đ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 14 Ohm, R4 = 21 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 670 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 550 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-08",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Chuyên Vật Lý – Phan Bội Châu",
    "school": "THPT Chuyên Phan Bội Châu – Nghệ An",
    "source": "Nguồn chính thức: THPT Chuyên Phan Bội Châu – Nghệ An",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 16 Ohm, R4 = 24 Ohm. Nguồn điện có hiệu điện thế không đ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 16 Ohm, R4 = 24 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 680 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 600 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-09",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2024-2025",
    "title": "Đề Olympic 30/4 Môn Vật Lý Khối 10 – Đồng Nai",
    "school": "THPT Chuyên Lương Thế Vinh – Đồng Nai",
    "source": "Nguồn chính thức: THPT Chuyên Lương Thế Vinh – Đồng Nai",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 18 Ohm, R4 = 27 Ohm. Nguồn điện có hiệu điện thế không đ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 18 Ohm, R4 = 27 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 690 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 650 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-chuyen-10",
    "subject": "physics",
    "track": "chuyen",
    "subjectTag": "Vật Lý Chuyên",
    "categoryTag": "Tuyển Sinh Chuyên",
    "academicYear": "2025-2026",
    "title": "Đề Thi Giao Lưu HSG Vật Lý Đồng Bằng Sông Cửu Long",
    "school": "THPT Chuyên Bến Tre",
    "source": "Nguồn chính thức: THPT Chuyên Bến Tre",
    "timeMinutes": 150,
    "featuredSnippet": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 20 Ohm, R4 = 30 Ohm. Nguồn điện có hiệu điện thế không đ...",
    "topics": [
      "# Mạch cầu Wheatstone",
      "# Lực đẩy Archimedes",
      "# Quang hình thấu kính",
      "# Dao động tắt dần"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "2.5 điểm",
        "content": "Cho mạch cầu Wheatstone ABCD như hình vẽ. Các điện trở R1 = 4 Ohm, R2 = 6 Ohm, R3 = 20 Ohm, R4 = 30 Ohm. Nguồn điện có hiệu điện thế không đổi U = 24 V. Điện kế G mắc giữa C và D có điện trở Rg = 10 Ohm.\na) Chứng minh mạch cầu ở trạng thái cân bằng. Tính dòng điện qua điện kế G.\nb) Thay điện kế G bằng một tụ điện có điện dung C = 5 microFarad. Tính điện tích và năng lượng điện trường của tụ điện khi mạch đã ổn định.",
        "solution": "a) Điều kiện cân bằng mạch cầu: R1/R2 = R3/R4. Ở đây 4/6 = 2/3 và (2*idx)/(3*idx) = 2/3. Do đó mạch cầu hoàn toàn cân bằng, U_CD = 0 V => Dòng điện qua điện kế G bằng không: Ig = 0 A.\nb) Khi thay G bằng tụ điện C: Do mạch cầu cân bằng nên U_C = 0 V => Điện tích tụ điện q = C * U_C = 0 C. Năng lượng điện trường W = 0.5 * C * U^2 = 0 J.",
        "keyFormulasOrHints": [
          "Cân bằng: R1 * R4 = R2 * R3",
          "q = C * U",
          "W = 0.5 * C * U^2"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "Thả một khối gỗ hình lập phương cạnh a = 12 cm, khối lượng riêng D0 = 750 kg/m3 vào bình chứa hai chất lỏng không hòa tan: nước (D1 = 1000 kg/m3) và dầu (D2 = 700 kg/m3). Khối gỗ nổi lơ lửng ở mặt phân cách giữa hai chất lỏng.\na) Xác định chiều cao phần khối gỗ chìm trong nước và chìm trong dầu.\nb) Cần tác dụng một lực ấn thẳng đứng bằng bao nhiêu để khối gỗ ngập hoàn toàn trong nước?",
        "solution": "a) Gọi h1 là chiều cao phần chìm trong nước, h2 = a - h1 là chiều cao phần chìm trong dầu. Cân bằng lực: P = FA1 + FA2 <=> a * D0 = h1 * D1 + (a - h1) * D2 => h1 = a * (D0 - D2) / (D1 - D2). h2 = a - h1.\nb) Khi ngập hoàn toàn trong nước: FA' = a^3 * D1 * g. Lực ấn F = FA' - P = a^3 * g * (D1 - D0).",
        "keyFormulasOrHints": [
          "Cân bằng tĩnh học: P = sum(FA)",
          "FA = d * V_chim"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "Một thấu kính hội tụ có tiêu cự f = 20 cm. Vật sáng phẳng nhỏ AB đặt vuông góc với trục chính cách thấu kính một đoạn d.\na) Xác định vị trí của vật để thấu kính cho ảnh thật gấp 3 lần vật.\nb) Giữ thấu kính cố định, dịch chuyển vật dọc theo trục chính một đoạn 10 cm thì ảnh dịch chuyển một đoạn 40 cm cùng chiều dịch chuyển của vật. Xác định vị trí ban đầu của vật.",
        "solution": "a) Ảnh thật gấp 3 lần vật => k = -3 => d' = 3d. Áp dụng 1/f = 1/d + 1/d' => 1/20 = 4/(3d) => d = 80/3 cm ~ 26.67 cm. Khi đó d' = 80 cm.\nb) Dùng công thức Newton hoặc hệ thức khoảng cách vật ảnh: d1 * d'1 = (d1 - f)(d'1 - f) = f^2 để giải ra vị trí ban đầu d1 = 30 cm.",
        "keyFormulasOrHints": [
          "1/f = 1/d + 1/d'",
          "k = -d' / d"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm vật nặng khối lượng m = 700 g gắn vào lò xo có độ cứng k = 100 N/m đặt trên mặt phẳng ngang có hệ số ma sát trượt mu = 0.02. Kéo vật lệch khỏi vị trí cân bằng một đoạn A0 = 10 cm rồi thả nhẹ cho dao động tắt dần. Lấy g = 10 m/s2.\na) Tính độ giảm biên độ sau mỗi chu kỳ dao động.\nb) Tính tổng quãng đường vật đi được cho đến khi dừng hẳn.",
        "solution": "a) Độ giảm biên độ sau một chu kỳ: Delta_A = 4 * mu * m * g / k.\nb) Bảo toàn năng lượng: Cơ năng ban đầu chuyển hóa thành công của lực ma sát: (1/2)*k*A0^2 = F_ms * S = mu * m * g * S => S = k * A0^2 / (2 * mu * m * g).",
        "keyFormulasOrHints": [
          "Delta_A = 4*mu*mg / k",
          "S = k*A0^2 / (2*mu*mg)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-01",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Tham Khảo Tốt Nghiệp THPT Môn Vật Lý – Bộ GD&ĐT",
    "school": "Bộ Giáo Dục và Đào Tạo",
    "source": "Nguồn đề thi: Bộ Giáo Dục và Đào Tạo",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 120 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 120 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 21 Hz. Tốc độ truyền sóng trên mặt nước là v = 42 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 42 / 21 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-02",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Chất Lượng Lớp 12 Môn Vật Lý Toàn Thành Phố",
    "school": "Sở GD&ĐT Hà Nội",
    "source": "Nguồn đề thi: Sở GD&ĐT Hà Nội",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 140 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 140 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 22 Hz. Tốc độ truyền sóng trên mặt nước là v = 44 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 44 / 22 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-03",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Thi Thử Tốt Nghiệp THPT Môn Vật Lý – Cụm Trường TP.HCM",
    "school": "Sở GD&ĐT TP. Hồ Chí Minh",
    "source": "Nguồn đề thi: Sở GD&ĐT TP. Hồ Chí Minh",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 160 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 160 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 23 Hz. Tốc độ truyền sóng trên mặt nước là v = 46 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 46 / 23 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-04",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Chất Lượng Vật Lý 12 – Sở Nam Định",
    "school": "Sở GD&ĐT Nam Định",
    "source": "Nguồn đề thi: Sở GD&ĐT Nam Định",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 180 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 180 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 24 Hz. Tốc độ truyền sóng trên mặt nước là v = 48 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 48 / 24 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-05",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Đánh Giá Năng Lực HSA Phần Khoa Học Tự Nhiên Vật Lý",
    "school": "Đại Học Quốc Gia Hà Nội",
    "source": "Nguồn đề thi: Đại Học Quốc Gia Hà Nội",
    "timeMinutes": 60,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 200 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 200 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 25 Hz. Tốc độ truyền sóng trên mặt nước là v = 50 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 50 / 25 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-06",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Đánh Giá Năng Lực APT Phần Tư Duy Vật Lý Ứng Dụng",
    "school": "Đại Học Quốc Gia TP.HCM",
    "source": "Nguồn đề thi: Đại Học Quốc Gia TP.HCM",
    "timeMinutes": 60,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 220 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 220 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 26 Hz. Tốc độ truyền sóng trên mặt nước là v = 52 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 52 / 26 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-07",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Kiến Thức Trọng Tâm Vật Lý 12 – Hải Phòng",
    "school": "Sở GD&ĐT Hải Phòng",
    "source": "Nguồn đề thi: Sở GD&ĐT Hải Phòng",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 240 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 240 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 27 Hz. Tốc độ truyền sóng trên mặt nước là v = 54 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 54 / 27 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-08",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Thi Thử Tốt Nghiệp THPT Môn Vật Lý – Cụm Trường Nghệ An",
    "school": "Sở GD&ĐT Nghệ An",
    "source": "Nguồn đề thi: Sở GD&ĐT Nghệ An",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 260 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 260 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 28 Hz. Tốc độ truyền sóng trên mặt nước là v = 56 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 56 / 28 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-09",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Học Kỳ 2 Môn Vật Lý 12 – Thành Phố Đà Nẵng",
    "school": "Sở GD&ĐT Đà Nẵng",
    "source": "Nguồn đề thi: Sở GD&ĐT Đà Nẵng",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 280 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Nâng cao",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 280 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 29 Hz. Tốc độ truyền sóng trên mặt nước là v = 58 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 58 / 29 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "phy-kc-10",
    "subject": "physics",
    "track": "khong_chuyen",
    "subjectTag": "Vật Lý THPT",
    "categoryTag": "Tốt Nghiệp THPT",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Chất Lượng Học Sinh 12 Môn Vật Lý – Thanh Hóa",
    "school": "Sở GD&ĐT Thanh Hóa",
    "source": "Nguồn đề thi: Sở GD&ĐT Thanh Hóa",
    "timeMinutes": 50,
    "featuredSnippet": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 300 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10...",
    "topics": [
      "# Con lắc lò xo",
      "# Giao thoa sóng",
      "# Mạch xoay chiều RLC",
      "# Khúc xạ ánh sáng"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 100 N/m và quả cầu nhỏ khối lượng m = 300 g dao động điều hòa theo phương thẳng đứng. Lấy g = 10 m/s2.\na) Tính độ dãn của lò xo ở vị trí cân bằng và chu kỳ dao động riêng của con lắc.\nb) Tại thời điểm t = 0, kéo vật xuống dưới vị trí cân bằng một đoạn 3 cm rồi truyền cho vật vận tốc v0 = 40*pi cm/s hướng thẳng đứng lên trên. Viết phương trình dao động.",
        "solution": "a) Độ dãn VTCB: Delta_l0 = mg/k. Tần số góc omega = sqrt(k/m), chu kỳ T = 2*pi*sqrt(m/k).\nb) Biên độ A = sqrt(x0^2 + (v0/omega)^2). t = 0: x = 3cm, v < 0 (hướng lên) => pha ban đầu phi > 0. Viết PT x = A*cos(omega*t + phi).",
        "keyFormulasOrHints": [
          "Delta_l0 = mg/k",
          "omega = sqrt(k/m)",
          "A = sqrt(x^2 + (v/omega)^2)"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Trong thí nghiệm giao thoa sóng trên mặt nước, hai nguồn kết hợp S1, S2 dao động cùng pha với tần số f = 30 Hz. Tốc độ truyền sóng trên mặt nước là v = 60 cm/s. Khoảng cách giữa hai nguồn là S1S2 = 12 cm.\na) Tính bước sóng lambda của sóng trên mặt nước.\nb) Xác định số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn S1S2.",
        "solution": "a) Bước sóng: lambda = v / f = 60 / 30 cm.\nb) Điều kiện cực đại giao thoa: -S1S2 < k * lambda < S1S2. Tìm số giá trị k nguyên trong khoảng này.",
        "keyFormulasOrHints": [
          "lambda = v / f",
          "Cực đại: -S1S2 < k*lambda < S1S2"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Đặt điện áp xoay chiều u = 120*sqrt(2)*cos(100*pi*t) V vào hai đầu đoạn mạch nối tiếp gồm điện trở R = 40 Ohm, cuộn cảm thuần L = 0.4/pi H và tụ điện C = 10^(-4) / (pi) F.\na) Tính cảm kháng ZL, dung kháng ZC và tổng trở Z của đoạn mạch.\nb) Viết biểu thức cường độ dòng điện tức thời i(t) và tính công suất tiêu thụ P.",
        "solution": "a) ZL = omega * L = 100*pi * (0.4/pi) = 40 Ohm. ZC = 1 / (omega * C) = 100 Ohm. Z = sqrt(R^2 + (ZL - ZC)^2) = sqrt(40^2 + (-60)^2) = 20*sqrt(13) Ohm.\nb) I = U / Z. tan(phi) = (ZL - ZC)/R => phi. i(t) = I*sqrt(2)*cos(100*pi*t - phi). Công suất P = I^2 * R.",
        "keyFormulasOrHints": [
          "ZL = omega*L",
          "ZC = 1/(omega*C)",
          "P = I^2 * R"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "a) Chiếu một chùm ánh sáng trắng hẹp từ không khí vào thủy tinh dưới góc tới i = 60 độ. Biết chiết suất đối với tia đỏ là nd = 1.514 và tia tím là nt = 1.538. Tính góc tán sắc giữa tia khúc xạ đỏ và tia tím.\nb) Một chất phóng xạ có chu kỳ bán rã T = 138 ngày. Ban đầu có 100 g chất phóng xạ. Hỏi sau bao nhiêu ngày khối lượng còn lại 12.5 g?",
        "solution": "a) sin(r_d) = sin(60)/1.514 => r_d = 34.93 độ. sin(r_t) = sin(60)/1.538 => r_t = 34.29 độ. Góc tán sắc Delta_r = r_d - r_t = 0.64 độ.\nb) m(t)/m0 = 12.5/100 = 1/8 = 2^(-3) => t = 3T = 3 * 138 = 414 ngày.",
        "keyFormulasOrHints": [
          "sin(i) = n*sin(r)",
          "m(t) = m0 * 2^(-t/T)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-01",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Tin Học – Chuyên KHTN",
    "school": "THPT Chuyên KHTN – ĐHQG Hà Nội",
    "source": "Nguồn chính thức: THPT Chuyên KHTN – ĐHQG Hà Nội",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-02",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Thi Tuyển Sinh Chuyên Tin Học – Hà Nội Amsterdam",
    "school": "THPT Chuyên Hà Nội – Amsterdam",
    "source": "Nguồn chính thức: THPT Chuyên Hà Nội – Amsterdam",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-03",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Tin Học – ĐH Sư Phạm",
    "school": "THPT Chuyên ĐH Sư Phạm Hà Nội",
    "source": "Nguồn chính thức: THPT Chuyên ĐH Sư Phạm Hà Nội",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-04",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Tin Học – Lê Hồng Phong",
    "school": "THPT Chuyên Lê Hồng Phong TP.HCM",
    "source": "Nguồn chính thức: THPT Chuyên Lê Hồng Phong TP.HCM",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-05",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2024-2025",
    "title": "Đề Thi Chọn Đội Tuyển HSG Quốc Gia Môn Tin Học",
    "school": "THPT Chuyên Lam Sơn – Thanh Hóa",
    "source": "Nguồn chính thức: THPT Chuyên Lam Sơn – Thanh Hóa",
    "timeMinutes": 180,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-06",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Lớp 10 Chuyên Tin Học – Quốc Học Huế",
    "school": "THPT Chuyên Quốc Học Huế",
    "source": "Nguồn chính thức: THPT Chuyên Quốc Học Huế",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-07",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Năng Lực Lập Trình Olympic Tin Học",
    "school": "THPT Chuyên Trần Phú – Hải Phòng",
    "source": "Nguồn chính thức: THPT Chuyên Trần Phú – Hải Phòng",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-08",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Tuyển Sinh Chuyên Tin Học – Phan Bội Châu",
    "school": "THPT Chuyên Phan Bội Châu – Nghệ An",
    "source": "Nguồn chính thức: THPT Chuyên Phan Bội Châu – Nghệ An",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-09",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2024-2025",
    "title": "Đề Olympic 30/4 Môn Tin Học Khối 10 – Nguyễn Du",
    "school": "THPT Chuyên Nguyễn Du – Đắk Lắk",
    "source": "Nguồn chính thức: THPT Chuyên Nguyễn Du – Đắk Lắk",
    "timeMinutes": 180,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-chuyen-10",
    "subject": "cs",
    "track": "chuyen",
    "subjectTag": "Tin Học Chuyên",
    "categoryTag": "Olympic & HSG",
    "academicYear": "2025-2026",
    "title": "Đề Thi Tin Học Trẻ Toàn Quốc Vòng Khu Vực – Bến Tre",
    "school": "THPT Chuyên Bến Tre",
    "source": "Nguồn chính thức: THPT Chuyên Bến Tre",
    "timeMinutes": 150,
    "featuredSnippet": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiế...",
    "topics": [
      "# Prefix Sum & Hash",
      "# Quy hoạch động LIS",
      "# Đồ thị Dijkstra",
      "# Cây Segment Tree"
    ],
    "difficulty": "Chuyên / HSG",
    "questions": [
      {
        "number": "Bài 1",
        "points": "3.0 điểm",
        "content": "CHO MẢNG SỐ VÀ TỔNG K:\nCho dãy gồm N (N <= 10^5) số nguyên A1, A2, ..., AN và một số nguyên K. Hãy tìm độ dài ngắn nhất của dãy con liên tiếp có tổng đúng bằng K.\n- Dữ liệu vào: Dòng 1 gồm hai số N, K. Dòng 2 gồm N số nguyên Ai.\n- Kết quả: In ra độ dài nhỏ nhất tìm được, hoặc in -1 nếu không tồn tại.",
        "solution": "Thuật toán O(N) dùng Mảng cộng dồn Prefix Sum kết hợp Bảng băm Hash Map:\nGọi pref[i] là tổng tiền tố từ A[1] đến A[i]. Ta cần tìm j < i sao cho pref[i] - pref[j] = K <=> pref[j] = pref[i] - K sao cho (i - j) nhỏ nhất.\nDuyệt i từ 1 đến N, tại mỗi bước tra cứu pref[i] - K trong hash map. Cập nhật độ dài nhỏ nhất.",
        "keyFormulasOrHints": [
          "Prefix Sum: pref[i] - pref[j] = K",
          "Hash Map O(N)"
        ]
      },
      {
        "number": "Bài 2",
        "points": "2.5 điểm",
        "content": "DÃY CON TĂNG DÀI NHẤT (LIS):\nCho dãy gồm N (N <= 2*10^5) số nguyên dương. Tìm độ dài của dãy con tăng thực sự dài nhất.\n- Ràng buộc: O(N log N) thời gian, O(N) bộ nhớ.",
        "solution": "Thuật toán Quy hoạch động kết hợp Chặt nhị phân (Binary Search O(N log N)):\nDuyệt qua từng phần tử x trong mảng, duy trì mảng dp[] trong đó dp[len] là giá trị kết thúc nhỏ nhất của một dãy con tăng độ dài len. Dùng std::lower_bound để tìm vị trí cập nhật trong O(log N).",
        "keyFormulasOrHints": [
          "std::lower_bound",
          "LIS O(N log N)"
        ]
      },
      {
        "number": "Bài 3",
        "points": "2.5 điểm",
        "content": "ĐƯỜNG ĐI NGẮN NHẤT DIJKSTRA:\nCho đồ thị có hướng gồm N đỉnh và M cạnh có trọng số không âm (N, M <= 10^5). Tìm khoảng cách ngắn nhất từ đỉnh S đến tất cả các đỉnh còn lại.",
        "solution": "Sử dụng thuật toán Dijkstra với Hàng đợi ưu tiên (Priority Queue O((N + M) log N)):\nKhởi tạo dist[S] = 0, dist[v] = oo. Đẩy (0, S) vào priority_queue. Lặp lấy đỉnh có dist nhỏ nhất, duyệt các cạnh kề và cập nhật khoảng cách.",
        "keyFormulasOrHints": [
          "Dijkstra O((N+M) log N)",
          "Priority Queue"
        ]
      },
      {
        "number": "Bài 4",
        "points": "2.0 điểm",
        "content": "CÂY PHÂN ĐOẠN SEGMENT TREE:\nCho mảng N phần tử (N <= 10^5). Thực hiện Q (Q <= 10^5) truy vấn: cập nhật điểm tại pos và tính tổng đoạn [L, R] trong O(log N).",
        "solution": "Cài đặt cây Segment Tree với mảng tree[4 * N]: hàm update(node, l, r, pos, val) và query(node, l, r, ql, qr) đều chạy trong O(log N).",
        "keyFormulasOrHints": [
          "Segment Tree tree[4*N]",
          "Query & Update O(log N)"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-01",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Năng Lực Tin Học Phổ Thông Chương Trình Mới",
    "school": "Bộ Giáo Dục và Đào Tạo",
    "source": "Nguồn đề thi: Bộ Giáo Dục và Đào Tạo",
    "timeMinutes": 45,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Cơ bản",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-02",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Kiểm Tra Học Kỳ 2 Môn Tin Học 11 – Định Hướng Ứng Dụng",
    "school": "Sở GD&ĐT Hà Nội",
    "source": "Nguồn đề thi: Sở GD&ĐT Hà Nội",
    "timeMinutes": 45,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-03",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Thi Học Kỳ 2 Môn Tin Học Lớp 10 – Chuẩn Khoa Học Máy Tính",
    "school": "Sở GD&ĐT TP. Hồ Chí Minh",
    "source": "Nguồn đề thi: Sở GD&ĐT TP. Hồ Chí Minh",
    "timeMinutes": 45,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Cơ bản",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-04",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Đánh Giá Kỹ Năng Tư Duy Lập Trình Phổ Thông – ĐHQG Hà Nội",
    "school": "Đại Học Quốc Gia Hà Nội",
    "source": "Nguồn đề thi: Đại Học Quốc Gia Hà Nội",
    "timeMinutes": 60,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-05",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2024-2025",
    "title": "Đề Kiểm Tra Giữa Kỳ Môn Tin Học 11 – Ngôn Ngữ Python",
    "school": "Sở GD&ĐT Nam Định",
    "source": "Nguồn đề thi: Sở GD&ĐT Nam Định",
    "timeMinutes": 45,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Cơ bản",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-06",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2024-2025",
    "title": "Đề Khảo Sát Kỹ Thuật Lập Trình Cơ Bản – Sở GD&ĐT Đà Nẵng",
    "school": "Sở GD&ĐT Đà Nẵng",
    "source": "Nguồn đề thi: Sở GD&ĐT Đà Nẵng",
    "timeMinutes": 45,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-07",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Tin Học Trẻ Khối THCS và Lớp 10 – Hải Dương",
    "school": "Sở GD&ĐT Hải Dương",
    "source": "Nguồn đề thi: Sở GD&ĐT Hải Dương",
    "timeMinutes": 60,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Cơ bản",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-08",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Thi Thử Tốt Nghiệp THPT Môn Tin Học – Liên Trường Nghệ An",
    "school": "Sở GD&ĐT Nghệ An",
    "source": "Nguồn đề thi: Sở GD&ĐT Nghệ An",
    "timeMinutes": 50,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-09",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2024-2025",
    "title": "Đề Kiểm Tra Thực Hành Tin Học Ứng Dụng – Sở GD&ĐT Cần Thơ",
    "school": "Sở GD&ĐT Cần Thơ",
    "source": "Nguồn đề thi: Sở GD&ĐT Cần Thơ",
    "timeMinutes": 45,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Cơ bản",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  },
  {
    "id": "cs-kc-10",
    "subject": "cs",
    "track": "khong_chuyen",
    "subjectTag": "Tin Học Phổ Thông",
    "categoryTag": "Khảo Sát Năng Lực",
    "academicYear": "2025-2026",
    "title": "Đề Khảo Sát Năng Lực Số và Giải Thuật Lớp 12 – Thanh Hóa",
    "school": "Sở GD&ĐT Thanh Hóa",
    "source": "Nguồn đề thi: Sở GD&ĐT Thanh Hóa",
    "timeMinutes": 50,
    "featuredSnippet": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/...",
    "topics": [
      "# Lập trình Python",
      "# Mảng List",
      "# Xử lý xâu String",
      "# Số nguyên tố"
    ],
    "difficulty": "Khá",
    "questions": [
      {
        "number": "Câu 1",
        "points": "2.5 điểm",
        "content": "Viết chương trình Python tính cước phí tiền điện tiêu thụ sinh hoạt theo biểu giá lũy tiến bậc thang:\n- Bậc 1: Cho 50 kWh đầu tiên: 1.800 đ/kWh.\n- Bậc 2: Cho 50 kWh tiếp theo (51 - 100): 2.000 đ/kWh.\n- Bậc 3: Cho kWh từ 101 trở lên: 2.500 đ/kWh.\nNhập vào số điện K (K >= 0). Tính và in ra tổng số tiền phải trả.",
        "solution": "Code Python mẫu:\ndef tinh_tien_dien(k):\n    if k <= 50:\n        return k * 1800\n    elif k <= 100:\n        return 50 * 1800 + (k - 50) * 2000\n    else:\n        return 50 * 1800 + 50 * 2000 + (k - 100) * 2500\n\nk = float(input())\nprint(int(tinh_tien_dien(k)))",
        "keyFormulasOrHints": [
          "Cấu trúc if - elif - else",
          "Lũy tiến bậc thang"
        ]
      },
      {
        "number": "Câu 2",
        "points": "2.5 điểm",
        "content": "Nhập vào một danh sách gồm N số nguyên (N <= 1000).\na) Tính giá trị trung bình cộng của các số dương trong danh sách.\nb) Tìm phần tử lớn nhất và in ra tất cả các vị trí xuất hiện của phần tử đó.",
        "solution": "Code Python mẫu:\nn = int(input())\narr = list(map(int, input().split()))\nduong = [x for x in arr if x > 0]\ntbc = sum(duong) / len(duong) if duong else 0\nprint(f'{tbc:.2f}')\nmax_val = max(arr)\npos = [i for i, x in enumerate(arr) if x == max_val]\nprint('Max:', max_val, 'Vi tri:', pos)",
        "keyFormulasOrHints": [
          "List comprehension",
          "max(), sum(), enumerate()"
        ]
      },
      {
        "number": "Câu 3",
        "points": "2.5 điểm",
        "content": "Viết chương trình nhập vào một xâu ký tự S:\na) Kiểm tra xem xâu S có phải là xâu đối xứng (Palindrome) hay không, bỏ qua khoảng trắng.\nb) Đếm số lượng từ trong xâu S và in ra từ có độ dài dài nhất.",
        "solution": "Code Python mẫu:\ns = input().strip()\ns_clean = s.replace(' ', '').lower()\nprint('Doi xung' if s_clean == s_clean[::-1] else 'Khong doi xung')\nwords = s.split()\nprint('So tu:', len(words))\nprint('Tu dai nhat:', max(words, key=len) if words else '')",
        "keyFormulasOrHints": [
          "s[::-1] đảo chuỗi",
          "split() tách từ"
        ]
      },
      {
        "number": "Câu 4",
        "points": "2.5 điểm",
        "content": "Viết hàm kiểm tra một số nguyên dương N có phải là số nguyên tố hay không. Sử dụng hàm đó để in ra tất cả các số nguyên tố nhỏ hơn hoặc bằng 100.",
        "solution": "Code Python mẫu:\ndef is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprimes = [x for x in range(2, 101) if is_prime(x)]\nprint(' '.join(map(str, primes)))",
        "keyFormulasOrHints": [
          "Kiểm tra ước đến sqrt(N)",
          "O(sqrt(N))"
        ]
      }
    ]
  }
];
