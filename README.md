# EduClassroom 360 - Lớp Học Trực Tuyến Mô Phỏng

Nền tảng lớp học mô phỏng trực tuyến tích hợp 4 môn học: **Toán học**, **Vật lí**, **Tin học** và **Ngữ văn**, được xây dựng trên nền tảng **React 19 + TypeScript + Tailwind CSS v4 + Vite**.

---

## 🌟 Tính Năng Nổi Bật

### 1. 📐 Toán Học (Math Studio)
- **Vẽ đồ thị hàm số Oxy**: Hỗ trợ hàm bậc 1, bậc 2 (Parabol), bậc 3, phân thức hữu tỉ kèm tiệm cận, lượng giác và hàm số mũ.
- **Khảo sát tiếp tuyến & bảng biến thiên**: Điều chỉnh thanh trượt hệ số $a, b, c, d$ và hoành độ tiếp điểm $x_0$ theo thời gian thực.
- **Hình học động (Geometry Studio)**: Kéo thả đỉnh tự do, kiểm chứng trực quan Định lý Pythagoras qua diện tích các hình vuông, xác định trọng tâm $G$, và mô hình chóp tứ giác 3D $S.ABCD$ xoay $360^\circ$.
- **Bài giảng & Trắc nghiệm**: Lý thuyết chắt lọc kèm trắc nghiệm tự luyện có giải thích chi tiết.

### 2. ⚡ Vật Lí Thực Nghiệm 2D (Interactive Physics Lab)
- **5 mô phỏng thời gian thực 60 FPS**:
  1. *Con lắc lò xo dao động điều hòa*: Véc-tơ lực $\vec{F}$, vận tốc $\vec{v}$, biểu đồ bảo toàn động năng & thế năng.
  2. *Con lắc đơn*: Chu kỳ $T = 2\pi\sqrt{l/g}$, góc lệch $\alpha$ và gia tốc trọng trường $g$.
  3. *Quang hình học (Khúc xạ & Phản xạ toàn phần)*: Định luật Snellius $n_1 \sin i = n_2 \sin r$, tự động phát hiện phản xạ toàn phần khi $i \ge i_{gh}$.
  4. *Chuyển động ném vật / Đạn đạo*: Quỹ đạo parabol, độ cao cực đại $H_{max}$, tầm xa $L$.
  5. *Giao thoa sóng cơ*: Hai nguồn sóng kết hợp $S_1, S_2$, lan truyền gợn sóng và vân cực đại hyperbol.

### 3. 💻 Tin Học & Chấm Test Trực Tuyến (Online Judge)
- **Hỗ trợ 2 ngôn ngữ**: **C++ (G++ 17)** và **Python 3**.
- **IDE đầy đủ**: Đánh số dòng, thụt lề Tab tự động, tùy chọn cỡ chữ, nạp lại template chuẩn.
- **Hệ thống chấm test ngầm**: Chạy thử dữ liệu nhập (Custom Stdin) và chấm tự động qua nhiều test case ngầm, đo lường thời gian thực thi (ms), tính điểm thang 100 và lưu trữ lịch sử nộp bài.

### 4. 📖 Ngữ Văn (Literature Hub)
- **Sơ đồ tư duy đa tầng (Interactive Mindmap)**: Phân tích các tác phẩm kinh điển (*Tây Tiến*, *Sóng*, *Vợ chồng A Phủ*).
- **Sổ tay dẫn chứng vàng**: Trích đoạn tiêu biểu kèm phân tích nghệ thuật chuyên sâu.
- **Đố vui cảm thụ**: Câu hỏi trắc nghiệm đọc hiểu có đáp án và giải thích.

### 5. 🎓 Tiện Ích Phòng Học Ảo
- Đồng hồ **Pomodoro 25 phút** rèn luyện tính tập trung.
- Sổ tay ghi chú bài học cá nhân (lưu tự động trên trình duyệt).
- Chế độ giao diện **Sáng / Tối (Dark mode)**.
- Hệ thống tích lũy điểm kinh nghiệm **XP**.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy Local

1. **Cài đặt thư viện phụ thuộc:**
```bash
npm install
```

2. **Khởi chạy môi trường phát triển (Dev server):**
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ `http://localhost:3000`.

3. **Đóng gói sản phẩm (Production build):**
```bash
npm run build
```
Kết quả bản phát hành sẽ nằm trong thư mục `dist/` sẵn sàng deploy lên Vercel, Netlify hoặc GitHub Pages.

---

## 📄 Giấy phép
Dự án được phân phối dưới giấy phép Apache-2.0.
