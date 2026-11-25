import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  Cpu,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  StepForward,
  Users,
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollProgressBar, ScrollReveal } from '../common/ScrollReveal';

interface GuideTourPageProps {
  onBack: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onReturnToLanding?: () => void;
}

type GuideViewMode = 'split' | 'sandbox' | 'blueprint';

interface GuideSceneDef {
  id: string;
  chapterNumber: string;
  shortTitleVi: string;
  shortTitleEn: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  kind: 'workflow' | 'math_calc' | 'physics_snell' | 'cs_sort' | 'phasor_3b1b' | 'pre_cad';
  targetSubject: SubjectType;
  actionLabelVi: string;
  actionLabelEn: string;
  stepsVi: string[];
  stepsEn: string[];
  blueprintTitleVi: string;
  blueprintTitleEn: string;
  blueprintSpecs: { labelVi: string; labelEn: string; value: string }[];
  blueprintNotesVi: string[];
  blueprintNotesEn: string[];
}

const GUIDE_SCENES: GuideSceneDef[] = [
  {
    id: 'workflow',
    chapterNumber: '01',
    shortTitleVi: 'Quy trình học',
    shortTitleEn: 'Study Workflow',
    titleVi: 'Quy trình 3 bước trên Synapse: Bài giảng · Phòng Lab · Kiểm tra',
    titleEn: 'Three-Stage Study Workflow: Lesson · Interactive Lab · Practice',
    subtitleVi:
      'Mỗi chuyên đề Toán, Vật lí và Tin học đều gắn trực tiếp mô hình 2D/3D để bạn vừa xem lý thuyết, vừa kéo thông số kiểm chứng và hỏi đáp theo từng bước.',
    subtitleEn:
      'Every Math, Physics, and Computer Science module links structured notes directly to live 2D/3D sandboxes and step-by-step checks.',
    kind: 'workflow',
    targetSubject: 'roadmap',
    actionLabelVi: 'Mở Lộ trình học',
    actionLabelEn: 'Open Study Roadmap',
    stepsVi: [
      'Chọn môn học hoặc khối lớp (9–12, Ôn thi HSG) ở thanh điều hướng bên trái.',
      'Mở mô phỏng 2D/3D ngay trong bài giảng hoặc chuyển sang phòng thực hành toàn màn hình.',
      'Ghi lại bảng số liệu đo CSV, xuất hình/video báo cáo hoặc hỏi đáp theo bước vừa dừng.',
    ],
    stepsEn: [
      'Select a subject or grade track (Grades 9–12 & Olympiad) from the left navigation rail.',
      'Manipulate embedded 2D/3D labs directly inside the lesson or expand to full-screen workbench.',
      'Capture telemetry rows to CSV, record .webm snapshots, or inspect individual steps.',
    ],
    blueprintTitleVi: 'Cấu trúc không gian làm việc',
    blueprintTitleEn: 'Workspace Architecture',
    blueprintSpecs: [
      { labelVi: 'Khối lớp hỗ trợ', labelEn: 'Curriculum Span', value: 'Lớp 9 – 12 & Chuyên' },
      { labelVi: 'Phòng thí nghiệm', labelEn: 'Lab Suites', value: 'Toán · Lí · Tin · Pre' },
      { labelVi: 'Xuất báo cáo', labelEn: 'Exports', value: 'PNG · WebM · CSV' },
    ],
    blueprintNotesVi: [
      'Thanh bên trái chuyển nhanh giữa Kho Bài giảng, Phòng Mô phỏng và Kho Đề thi.',
      'Chế độ Sáng / Tối đồng bộ trên toàn bộ đồ thị 2D, bảng số liệu và giao diện đọc.',
      'Mọi thanh trượt đều hỗ trợ nhập trực tiếp giá trị số chính xác.',
    ],
    blueprintNotesEn: [
      'Left sidebar switches smoothly between Lectures, Simulation Studios, and Exam Bank.',
      'Light and Dark surface palettes stay synchronized across 2D canvases and tables.',
      'All parameter sliders accept direct exact numerical keyboard entry.',
    ],
  },
  {
    id: 'math_calc',
    chapterNumber: '02',
    shortTitleVi: 'Toán 2D & Oxyz',
    shortTitleEn: 'Math 2D & Oxyz',
    titleVi: 'Đồ thị Oxy, Tiếp tuyến Đạo hàm & Hình học Không gian 3D',
    titleEn: 'Oxy Calculus Plotter, Tangent Slopes & 3D Oxyz Geometry',
    subtitleVi:
      'Kéo thử điểm tiếp xúc x₀ và cận tích phân b ngay bên cạnh để xem hệ số góc tiếp tuyến f′(x₀) và diện tích tô màu cập nhật theo thời gian thực.',
    subtitleEn:
      'Drag the contact point x₀ and upper bound b right here to inspect live tangent slope f′(x₀) and definite integral Riemann area.',
    kind: 'math_calc',
    targetSubject: 'math_sims',
    actionLabelVi: 'Vào Phòng Toán 2D/3D',
    actionLabelEn: 'Open Math 2D/3D',
    stepsVi: [
      'Vẽ nhiều hàm số cùng lúc (Bậc 3, Phân thức, Lượng giác, Logarit hoặc biểu thức tự nhập).',
      'Bật đường tiếp tuyến, tô miền tích phân [a, b] và xem bảng giá trị f(x), f′(x).',
      'Chuyển sang tab Mô phỏng 3D Oxyz để xoay 11 mô hình mặt cầu, nón conic và khối tròn xoay.',
    ],
    stepsEn: [
      'Overlay multiple curves (polynomials, rationals, trig, logs, or custom expressions).',
      'Toggle tangent lines, definite integral shading [a, b], and synchronized f(x)/f′(x) tables.',
      'Switch to 3D Oxyz mode to orbit 11 spatial scenes including conics, spheres, and solids.',
    ],
    blueprintTitleVi: 'Công cụ Phòng Toán học',
    blueprintTitleEn: 'Mathematics Studio Spec',
    blueprintSpecs: [
      { labelVi: 'Đồ thị 2D', labelEn: '2D Plotter', value: 'Đa hàm + Đạo hàm f′(x)' },
      { labelVi: 'Hình học phẳng', labelEn: '2D Geometry', value: 'Thước · Compa · Dựng hình' },
      { labelVi: 'Không gian 3D', labelEn: '3D Oxyz', value: '11 Mô hình & Mặt cắt' },
    ],
    blueprintNotesVi: [
      'Chuột cuộn để phóng to/thu nhỏ hệ trục tọa độ, kéo chuột để dịch chuyển gốc nhìn.',
      'Tích hợp xuất ảnh PNG độ phân giải cao và quay video .webm cho bài thuyết trình.',
      'Hỗ trợ tìm nhanh cực trị, giao điểm trục và giá trị bảng từng bước.',
    ],
    blueprintNotesEn: [
      'Scroll to zoom coordinate grid scale cleanly and drag to pan the origin.',
      'Includes high-resolution PNG snapshots and .webm recording for presentations.',
      'Supports instant extremum readouts, intercepts, and step-based value tables.',
    ],
  },
  {
    id: 'physics_snell',
    chapterNumber: '03',
    shortTitleVi: 'Vật lí & Đo đạc',
    shortTitleEn: 'Physics & Lab',
    titleVi: '10 Chuyên đề Vật lí & 36 Dụng cụ Đo thực tế',
    titleEn: '10 Physics Domains & 36 Interactive Lab Instruments',
    subtitleVi:
      'Thay đổi góc tới θ₁ và chiết suất môi trường n₂ ở khung mẫu dưới đây để quan sát tia khúc xạ và ngưỡng phản xạ toàn phần theo định luật Snell.',
    subtitleEn:
      'Adjust incidence angle θ₁ and refractive index n₂ below to observe live refraction and total internal reflection thresholds.',
    kind: 'physics_snell',
    targetSubject: 'physics_sims',
    actionLabelVi: 'Mở Lab Vật lí 2D/3D',
    actionLabelEn: 'Launch Physics Lab',
    stepsVi: [
      'Chọn chuyên đề Cơ học, Dao động Sóng, Điện học, Quang học, Nhiệt hoặc Hạt nhân.',
      'Đặt Ampe kế, Vôn kế, Thước kẹp, Lăng kính lên bàn đo và bấm "Ghi mẫu đo" vào bảng.',
      'Dùng thanh Time Machine tua chậm 0.25x, đi từng khung hình và xuất bảng số liệu CSV.',
    ],
    stepsEn: [
      'Browse Mechanics, Waves, Circuits, Optics, Thermodynamics, and Quantum domains.',
      'Place ammeters, voltmeters, calipers, and prisms on the bench and log live readings.',
      'Use the Time Machine bar for 0.25x slow motion, frame stepping, and CSV export.',
    ],
    blueprintTitleVi: 'Bàn thí nghiệm & Dữ liệu đo',
    blueprintTitleEn: 'Workbench & Telemetry Spec',
    blueprintSpecs: [
      { labelVi: 'Cảnh 2D / 3D', labelEn: '2D & 3D Labs', value: '32+ Mô hình tương tác' },
      { labelVi: 'Dụng cụ rời', labelEn: 'Instruments', value: '36 Thiết bị kéo thả' },
      { labelVi: 'Dữ liệu thực nghiệm', labelEn: 'Data Logger', value: 'Bảng mẫu + Xuất CSV' },
    ],
    blueprintNotesVi: [
      'Đồ thị dao động ký thời gian thực vẽ đồng thời nhiều đại lượng vật lí (x, v, a, E).',
      'Nút "Mặt cắt 3D" trong Physics 3D cho phép nhìn xuyên vào ống nghiệm, tokamak và lò nhiệt.',
      'Hỗ trợ đặt nhanh cấu hình chuẩn (Trái Đất, Mặt Trăng, Sao Hỏa) để so sánh.',
    ],
    blueprintNotesEn: [
      'Real-time oscilloscope plots multiple synchronized physical channels (x, v, a, E).',
      '3D cutaway mode reveals internal cross-sections of tubes, reactors, and vessels.',
      'Quick environment presets compare Earth, Moon, and Mars gravity constants.',
    ],
  },
  {
    id: 'cs_sort',
    chapterNumber: '04',
    shortTitleVi: 'Tin học & Truy vết',
    shortTitleEn: 'CS & Code Trace',
    titleVi: 'Trình soạn thảo Sublime 4 & Truy vết Thuật toán 2D/3D từng bước',
    titleEn: 'Sublime 4 IDE & Step-by-Step 2D/3D Algorithm Tracing',
    subtitleVi:
      'Bấm "Tiến 1 bước" hoặc "Chạy" ngay trong khung minh họa để theo dõi từng lần so sánh, đổi chỗ phần tử mảng và dòng code C++ đang thực thi.',
    subtitleEn:
      'Click Step or Play in the live tracer to watch each array comparison, element swap, and synchronized C++ source line.',
    kind: 'cs_sort',
    targetSubject: 'cs_sims',
    actionLabelVi: 'Mở Mô phỏng Code',
    actionLabelEn: 'Open Code Simulations',
    stepsVi: [
      'Thực hành 5 lộ trình lập trình C++20/Python 3 kèm bộ test tự động ngay trên trình duyệt.',
      'Chuyển qua 16 mô phỏng thuật toán 2D (Sort, DP, Dijkstra, Segment Tree) và 10 sân khấu 3D.',
      'Dừng ở bất kỳ bước nào để kiểm tra giá trị biến (Watch Variables) hoặc hỏi giải thích chi tiết.',
    ],
    stepsEn: [
      'Solve C++20 and Python 3 problems across 5 structured tracks with instant test feedback.',
      'Explore 16 2D visualizers (Sort, DP, Dijkstra, SegTree) plus 10 3D WebGL stages.',
      'Pause at any step to inspect variable states or request a step-specific explanation.',
    ],
    blueprintTitleVi: 'Hệ thống Lập trình & Debug',
    blueprintTitleEn: 'IDE & Tracer Architecture',
    blueprintSpecs: [
      { labelVi: 'Thuật toán 2D', labelEn: '2D Visualizers', value: '16 Thuật toán chuẩn' },
      { labelVi: 'Cấu trúc 3D', labelEn: '3D Structures', value: '10 Sân khấu WebGL' },
      { labelVi: 'Truy vết Code', labelEn: 'Execution Trace', value: 'Biến + Dòng lệnh 1-1' },
    ],
    blueprintNotesVi: [
      'Bộ đếm thao tác đo chính xác số phép so sánh, hoán đổi và độ phức tạp thực tế.',
      'Cho phép nhập bộ test tùy chỉnh (mảng, đồ thị, xâu, mê cung) để tự kiểm chứng.',
      'Tải log từng bước (.json) hoặc ảnh chụp sơ đồ trạng thái trực tiếp.',
    ],
    blueprintNotesEn: [
      'Operation counter tracks exact comparisons, writes/swaps, and empirical complexity.',
      'Accepts custom arrays, graphs, strings, and grid walls to test edge cases.',
      'Exports execution step traces (.json) or diagram snapshots with one click.',
    ],
  },
  {
    id: 'phasor_3b1b',
    chapterNumber: '05',
    shortTitleVi: 'Giọng Việt & 3B1B',
    shortTitleEn: 'Audio & 3B1B',
    titleVi: 'Thuyết minh Tiếng Việt, Trình dựng Video 3B1B & Ôn Đề thi',
    titleEn: 'Vietnamese Lecture Audio, 3B1B Motion Builder & Exam Grader',
    subtitleVi:
      'Thay đổi biên độ A và tần số góc ω trên mô hình vòng tròn lượng giác chiếu sóng sin — đúng cơ chế trình dựng Video 3Blue1Brown tích hợp sẵn trong bài học.',
    subtitleEn:
      'Tune amplitude A and angular velocity ω on the rotating phasor-to-sine projector — matching the built-in 3Blue1Brown lecture reel engine.',
    kind: 'phasor_3b1b',
    targetSubject: 'math',
    actionLabelVi: 'Xem trong Bài giảng',
    actionLabelEn: 'Open Lesson Library',
    stepsVi: [
      'Bấm "Nghe giảng" ở đầu bài học hoặc từng mục để phát thuyết minh tiếng Việt rõ ràng.',
      'Mở tab "Video 3B1B" trong bài giảng để xem hoạt họa vector và xuất thành file video .webm.',
      'Trong Kho Đề Thi, dán ảnh bài làm (Ctrl+V) để đối chiếu lời giải chi tiết từng bước.',
    ],
    stepsEn: [
      'Click Listen per section or full-lesson audio in the lecture header for hands-free study.',
      'Open the embedded Video 3B1B tab to inspect vector motion and export .webm clips.',
      'Paste solution photos in the Exam Hub to review structured step-by-step feedback.',
    ],
    blueprintTitleVi: 'Trình bày & Ôn tập đa phương thức',
    blueprintTitleEn: 'Multimodal Study Spec',
    blueprintSpecs: [
      { labelVi: 'Thuyết minh bài học', labelEn: 'Narration', value: 'Giọng Việt từng mục' },
      { labelVi: 'Xuất Video 3B1B', labelEn: 'Reel Export', value: 'Canvas → .webm' },
      { labelVi: 'Kho Đề & Chấm bài', labelEn: 'Exam Practice', value: 'Chấm từng ý 0–10' },
    ],
    blueprintNotesVi: [
      'Hoạt họa vector và đồ thị được dựng trực tiếp bằng Canvas/Math nên luôn sắc nét.',
      'Hỗ trợ tua đoạn, đổi tốc độ đọc và xuất file video không cần phần mềm ngoài.',
      'Kho đề thi phân loại theo học kỳ, thi vào 10, THPT Quốc gia và HSG.',
    ],
    blueprintNotesEn: [
      'Vector reels render mathematically on canvas for crisp typography at any resolution.',
      'Supports section seek, narration speed control, and built-in .webm export.',
      'Exam archive organizes papers by grade level, entrance exams, and olympiad tracks.',
    ],
  },
  {
    id: 'pre_cad',
    chapterNumber: '06',
    shortTitleVi: 'Synapse Pre & 3D',
    shortTitleEn: 'Synapse Pre & 3D',
    titleVi: 'Synapse Pre: 30 Đại Công Trình, Thước đo 3D & Mặt cắt X/Y/Z',
    titleEn: 'Synapse Pre: 30 Megastructures, 3D Laser Ruler & X/Y/Z Cutaways',
    subtitleVi:
      'Kéo thanh "Tách lớp CAD" và bật "Mặt cắt tiết diện" ngay bên cạnh để xem cách hệ thống Synapse Pre mổ xẻ kết cấu 3D thời gian thực.',
    subtitleEn:
      'Scrub the CAD Explode slider and toggle Cross-Section Cutaway to preview how Synapse Pre dissects 3D megastructures in real time.',
    kind: 'pre_cad',
    targetSubject: 'synapse_v2',
    actionLabelVi: 'Khám phá Synapse Pre',
    actionLabelEn: 'Explore Synapse Pre',
    stepsVi: [
      'Khám phá 21+ phòng Lab Pre (Cơ khí lắp ráp 3D, Hệ Mặt Trời Kepler, Máy tính Lượng tử, Vũ trụ What-If).',
      'Trong 30 Đại Công Trình: dùng Thước đo khoảng cách 3D, Mặt cắt 3 trục X/Y/Z, đồ thị Telemetry và So sánh 2 công trình.',
      'Quét mã QR để biến điện thoại thành tay cầm xoay 3D hoặc tham gia phòng Syn Meet cùng bạn học.',
    ],
    stepsEn: [
      'Launch 21+ Pre Labs (3D Mechanical Assembly, Kepler Solar System, Quantum Bloch, What-If Physics).',
      'Inside 30 Megastructures: use 3D Point-to-Point Ruler, X/Y/Z Cutaway Planes, Telemetry Oscilloscope, and Spec Comparator.',
      'Scan QR to turn your phone into a 3D controller or collaborate live inside Syn Meet.',
    ],
    blueprintTitleVi: 'Bộ công cụ Kỹ thuật Synapse Pre',
    blueprintTitleEn: 'Synapse Pre Engineering Suite',
    blueprintSpecs: [
      { labelVi: 'Đại công trình 3D', labelEn: 'Megastructures', value: '30 Công trình WebGL' },
      { labelVi: 'Công cụ đo CAD', labelEn: 'CAD Inspection', value: 'Thước 3D · Cắt X/Y/Z' },
      { labelVi: 'Ghi dữ liệu', labelEn: 'Telemetry', value: 'Oscilloscope · CSV · WebM' },
    ],
    blueprintNotesVi: [
      'Nhấn 2 điểm bất kỳ trên mô hình 3D để đo khoảng cách thực tế Δx, Δy, Δz và góc nghiêng.',
      'So sánh song song thông số, công thức và cấu trúc của 2 Đại Công Trình bất kỳ.',
      'Hỗ trợ tối ưu máy yếu (0.5x – 1.35x, khóa 30/60 FPS) và điều khiển cử chỉ tay.',
    ],
    blueprintNotesEn: [
      'Click any two 3D surface points to measure Euclidean distance Δx, Δy, Δz and slope.',
      'Compare formulas, engineering bounds, and parameters across any two megastructures.',
      'Includes adaptive resolution scaling (0.5x–1.35x, 30/60 FPS) and hand tracking.',
    ],
  },
];

/* ============================================================================
   AUTHENTIC INTERACTIVE LAB SANDBOXES (ZERO AI RASTER ART)
   ============================================================================ */
const GuideInteractiveStage: React.FC<{
  kind: GuideSceneDef['kind'];
  isEn: boolean;
  onUserInteract: () => void;
}> = ({ kind, isEn, onUserInteract }) => {
  // Chapter 01: Interactive 3-Stage Preview
  const [wfStep, setWfStep] = useState<0 | 1 | 2>(1);

  // Chapter 02: Math Calculus Interactive State
  const [calcX0, setCalcX0] = useState<number>(1.0);
  const [calcBoundB, setCalcBoundB] = useState<number>(1.8);
  const mathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chapter 03: Physics Snell Law Interactive State
  const [incAngleDeg, setIncAngleDeg] = useState<number>(42);
  const [mediumN2, setMediumN2] = useState<number>(1.5);

  // Chapter 04: CS Sort Interactive Tracer
  const sortTraceSteps = useMemo(() => {
    const arr = [38, 16, 64, 24, 52, 44];
    const frames: {
      arr: number[];
      cmp: [number, number] | null;
      swapped: boolean;
      codeLine: number;
      i: number;
      j: number;
      swaps: number;
      comps: number;
      noteVi: string;
      noteEn: string;
    }[] = [
      {
        arr: [...arr],
        cmp: null,
        swapped: false,
        codeLine: 0,
        i: 0,
        j: 0,
        swaps: 0,
        comps: 0,
        noteVi: 'Khởi tạo mảng ban đầu 6 phần tử.',
        noteEn: 'Initialize 6-element input array.',
      },
    ];
    const work = [...arr];
    let swaps = 0;
    let comps = 0;
    for (let i = 0; i < work.length - 1; i++) {
      for (let j = 0; j < work.length - 1 - i; j++) {
        comps++;
        const needSwap = work[j] > work[j + 1];
        frames.push({
          arr: [...work],
          cmp: [j, j + 1],
          swapped: false,
          codeLine: 2,
          i,
          j,
          swaps,
          comps,
          noteVi: `So sánh a[${j}] = ${work[j]} và a[${j + 1}] = ${work[j + 1]}`,
          noteEn: `Compare a[${j}] = ${work[j]} vs a[${j + 1}] = ${work[j + 1]}`,
        });
        if (needSwap) {
          [work[j], work[j + 1]] = [work[j + 1], work[j]];
          swaps++;
          frames.push({
            arr: [...work],
            cmp: [j, j + 1],
            swapped: true,
            codeLine: 3,
            i,
            j,
            swaps,
            comps,
            noteVi: `Đổi chỗ ${work[j + 1]} ↔ ${work[j]} vì nghịch thế.`,
            noteEn: `Swap ${work[j + 1]} ↔ ${work[j]} (out of order).`,
          });
        }
        if (frames.length >= 11) break;
      }
      if (frames.length >= 11) break;
    }
    return frames;
  }, []);
  const [sortIdx, setSortIdx] = useState(1);
  const [sortAuto, setSortAuto] = useState(false);

  useEffect(() => {
    if (!sortAuto || kind !== 'cs_sort') return;
    const t = window.setInterval(() => {
      setSortIdx((prev) => (prev + 1) % sortTraceSteps.length);
    }, 950);
    return () => window.clearInterval(t);
  }, [sortAuto, kind, sortTraceSteps.length]);

  // Chapter 05: Phasor 3B1B Interactive State
  const [omega, setOmega] = useState<number>(1.8);
  const [amp, setAmp] = useState<number>(1.0);
  const [phasorPlaying, setPhasorPlaying] = useState<boolean>(true);
  const phasorCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Chapter 06: Pre CAD Blueprint Interactive State
  const [cadExplode, setCadExplode] = useState<number>(28);
  const [cadCutaway, setCadCutaway] = useState<boolean>(false);
  const [cadAngle, setCadAngle] = useState<number>(32);

  // Draw Chapter 02 Math Calculus Canvas
  useEffect(() => {
    if (kind !== 'math_calc') return;
    const canvas = mathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = 520;
    const h = 250;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#0b1220' : '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.64;
    const sx = 68;
    const sy = 56;
    const toPx = (x: number, y: number): [number, number] => [cx + x * sx, cy - y * sy];

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.14)' : 'rgba(148,163,184,0.28)';
    ctx.lineWidth = 1;
    for (let gx = -3; gx <= 3; gx++) {
      const [px] = toPx(gx, 0);
      ctx.beginPath();
      ctx.moveTo(px, 12);
      ctx.lineTo(px, h - 14);
      ctx.stroke();
    }
    for (let gy = -1; gy <= 3; gy++) {
      const [, py] = toPx(0, gy);
      ctx.beginPath();
      ctx.moveTo(16, py);
      ctx.lineTo(w - 16, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = isDark ? '#64748b' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(16, cy);
    ctx.lineTo(w - 16, cy);
    ctx.moveTo(cx, 12);
    ctx.lineTo(cx, h - 14);
    ctx.stroke();

    const fn = (x: number) => 0.42 * x * x - 0.6;
    const dfn = (x: number) => 0.84 * x;

    // Riemann shaded bars from a=-1.2 to b=calcBoundB
    const aX = -1.2;
    const bX = Math.max(aX + 0.2, calcBoundB);
    const nBars = 14;
    const dx = (bX - aX) / nBars;
    for (let i = 0; i < nBars; i++) {
      const xMid = aX + (i + 0.5) * dx;
      const yVal = fn(xMid);
      const [x0, yTop] = toPx(aX + i * dx, yVal);
      const [x1, yZero] = toPx(aX + (i + 1) * dx, 0);
      ctx.fillStyle =
        yVal >= 0
          ? isDark
            ? 'rgba(14, 165, 233, 0.24)'
            : 'rgba(2, 132, 199, 0.18)'
          : isDark
          ? 'rgba(245, 158, 11, 0.22)'
          : 'rgba(217, 119, 6, 0.16)';
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.45)';
      ctx.lineWidth = 1;
      ctx.fillRect(x0, Math.min(yTop, yZero), Math.max(1, x1 - x0 - 1), Math.abs(yZero - yTop));
      ctx.strokeRect(x0, Math.min(yTop, yZero), Math.max(1, x1 - x0 - 1), Math.abs(yZero - yTop));
    }

    // Curve
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -3.1; x <= 3.1; x += 0.05) {
      const [px, py] = toPx(x, fn(x));
      if (x === -3.1) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Tangent Line at calcX0
    const y0 = fn(calcX0);
    const slope = dfn(calcX0);
    const [tx0, ty0] = toPx(calcX0, y0);
    const [lx1, ly1] = toPx(calcX0 - 1.35, y0 - slope * 1.35);
    const [lx2, ly2] = toPx(calcX0 + 1.35, y0 + slope * 1.35);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx1, ly1);
    ctx.lineTo(lx2, ly2);
    ctx.stroke();

    // Point marker
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(tx0, ty0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Coordinate labels
    ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText('O', cx + 5, cy + 13);
    ctx.fillText(`x₀=${calcX0.toFixed(1)}`, tx0 + 8, ty0 - 8);
  }, [kind, calcX0, calcBoundB]);

  // Draw Chapter 05 Phasor Canvas
  useEffect(() => {
    if (kind !== 'phasor_3b1b') return;
    const canvas = phasorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let last = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (phasorPlaying) t += dt;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = 520;
      const h = 230;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#0b1220' : '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      const cx = 112;
      const cy = h * 0.5;
      const r = 56 * amp;
      const waveStart = 212;
      const theta = t * omega;

      // Baseline grid
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.16)' : 'rgba(148,163,184,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(w - 20, cy);
      ctx.moveTo(cx, 24);
      ctx.lineTo(cx, h - 24);
      ctx.stroke();

      // Reference circle
      ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.45)' : 'rgba(2,132,199,0.4)';
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      const px = cx + Math.cos(theta) * r;
      const py = cy - Math.sin(theta) * r;

      // Rotating phasor vector
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Projection dashed line
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.45)' : 'rgba(100,116,139,0.45)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(waveStart, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Projected sine wave
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x <= w - waveStart - 20; x += 2) {
        const wy = cy - Math.sin(theta - x * 0.032) * r;
        if (x === 0) ctx.moveTo(waveStart + x, wy);
        else ctx.lineTo(waveStart + x, wy);
      }
      ctx.stroke();

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(waveStart, py, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [kind, omega, amp, phasorPlaying]);

  if (kind === 'workflow') {
    const stages = [
      {
        titleVi: 'Bước 1 · Đọc & Nghe Lý thuyết',
        titleEn: 'Stage 1 · Structured Theory & Voice',
        metaVi: 'Định nghĩa · Công thức chuẩn · Nghe giảng',
        metaEn: 'Definitions · Equations · Audio Narration',
        detailVi: 'Các định lý được chia từng ý ngắn kèm ví dụ mẫu minh họa và công thức toán rõ nét.',
        detailEn: 'Theorems are organized into clear blocks with worked examples and crisp equations.',
      },
      {
        titleVi: 'Bước 2 · Thực hành Mô phỏng 2D/3D',
        titleEn: 'Stage 2 · Manipulate 2D/3D Labs',
        metaVi: 'Kéo thả dụng cụ · Xoay 360° · Bảng số liệu',
        metaEn: 'Interactive Controls · 360° Orbit · Telemetry',
        detailVi: 'Điều chỉnh trực tiếp thông số như góc α, khối lượng m, mảng dữ liệu và quan sát thay đổi tức thì.',
        detailEn: 'Modify variables such as angle α, mass m, or arrays and watch physical curves update live.',
      },
      {
        titleVi: 'Bước 3 · Kiểm chứng & Xuất báo cáo',
        titleEn: 'Stage 3 · Verify & Export Results',
        metaVi: 'Ghi CSV · Chụp PNG · Hỏi theo bước',
        metaEn: 'CSV Logger · PNG/WebM · Step Inspection',
        detailVi: 'Lưu dữ liệu đo thực nghiệm ra file CSV/PNG hoặc kiểm tra từng bước giải bài tập.',
        detailEn: 'Export experiment logs to CSV/PNG or verify intermediate steps directly.',
      },
    ];
    const current = stages[wfStep];
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 flex flex-col justify-between gap-4 h-full">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
            {isEn ? 'INTERACTIVE WORKFLOW DEMO' : 'MINH HỌA QUY TRÌNH TƯƠNG TÁC'}
          </span>
          <span className="font-mono text-sky-700 dark:text-sky-300 font-semibold tabular-nums">
            {wfStep + 1} / 3
          </span>
        </div>

        {/* Clean Workspace Wireframe Schematic */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {stages.map((st, idx) => {
              const active = idx === wfStep;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onUserInteract();
                    setWfStep(idx as 0 | 1 | 2);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">
                    0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold truncate mt-0.5">
                    {isEn ? st.titleEn.split('·')[1] : st.titleVi.split('·')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="text-xs font-mono text-sky-700 dark:text-sky-300 font-semibold">
              {isEn ? current.metaEn : current.metaVi}
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {isEn ? current.titleEn : current.titleVi}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEn ? current.detailEn : current.detailVi}
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {isEn
            ? 'Click steps 01–03 above to preview each stage of a Synapse session.'
            : 'Bấm chọn 3 bước 01–03 ở trên để xem cách một bài học liên kết với phòng thí nghiệm.'}
        </div>
      </div>
    );
  }

  if (kind === 'math_calc') {
    const fnVal = 0.42 * calcX0 * calcX0 - 0.6;
    const slopeVal = 0.84 * calcX0;
    // Exact definite integral of (0.42x^2 - 0.6) from -1.2 to calcBoundB
    const antideriv = (x: number) => 0.14 * x * x * x - 0.6 * x;
    const areaVal = antideriv(calcBoundB) - antideriv(-1.2);

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 h-full flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            f(x) = 0.42x² − 0.6
          </span>
          <div className="flex items-center gap-3 tabular-nums">
            <span className="text-amber-700 dark:text-amber-300">
              f′({calcX0.toFixed(1)}) = {slopeVal.toFixed(2)}
            </span>
            <span className="text-sky-700 dark:text-sky-300">
              ∫ ≈ {areaVal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <canvas ref={mathCanvasRef} className="w-full h-[220px] block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600 dark:text-slate-300">
                {isEn ? 'Tangent point x₀' : 'Tiếp điểm x₀'}
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {calcX0.toFixed(1)} (y={fnVal.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min={-2.2}
              max={2.2}
              step={0.1}
              value={calcX0}
              onChange={(e) => {
                onUserInteract();
                setCalcX0(Number(e.target.value));
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600 dark:text-slate-300">
                {isEn ? 'Upper bound b' : 'Cận tích phân b'}
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400">
                [-1.2, {calcBoundB.toFixed(1)}]
              </span>
            </div>
            <input
              type="range"
              min={0.0}
              max={2.5}
              step={0.1}
              value={calcBoundB}
              onChange={(e) => {
                onUserInteract();
                setCalcBoundB(Number(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'physics_snell') {
    const n1 = 1.0; // Air
    const sinTheta2 = (n1 / mediumN2) * Math.sin((incAngleDeg * Math.PI) / 180);
    const refractedDeg =
      Math.abs(sinTheta2) <= 1 ? (Math.asin(sinTheta2) * 180) / Math.PI : null;
    const rad1 = (incAngleDeg * Math.PI) / 180;
    const rad2 = refractedDeg !== null ? (refractedDeg * Math.PI) / 180 : rad1;

    const cx = 240;
    const cy = 115;
    const L = 96;
    const ix = cx - Math.sin(rad1) * L;
    const iy = cy - Math.cos(rad1) * L;
    const rx = cx + Math.sin(rad2) * L;
    const ry = cy + Math.cos(rad2) * L;

    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 h-full flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            n₁·sin(θ₁) = n₂·sin(θ₂)
          </span>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold tabular-nums">
            θ₁ = {incAngleDeg}° → θ₂ = {refractedDeg !== null ? `${refractedDeg.toFixed(1)}°` : 'TIR'}
          </span>
        </div>

        <svg
          viewBox="0 0 480 230"
          className="w-full h-[220px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          {/* Medium 2 slab (bottom half) */}
          <rect
            x={0}
            y={cy}
            width={480}
            height={230 - cy}
            fill="currentColor"
            className="text-sky-100/80 dark:text-sky-950/50"
          />
          {/* Interface line */}
          <line x1={16} y1={cy} x2={464} y2={cy} stroke="#64748b" strokeWidth={1.5} />
          {/* Normal line */}
          <line
            x1={cx}
            y1={16}
            x2={cx}
            y2={214}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeWidth={1.2}
          />
          {/* Protractor semicircle */}
          <circle
            cx={cx}
            cy={cy}
            r={54}
            fill="none"
            stroke="rgba(148,163,184,0.35)"
            strokeWidth={1}
          />

          {/* Incident ray */}
          <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="#dc2626" strokeWidth={2.5} />
          {/* Faint reflected ray */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + Math.sin(rad1) * L}
            y2={cy - Math.cos(rad1) * L}
            stroke="rgba(220,38,38,0.3)"
            strokeWidth={1.5}
          />
          {/* Refracted ray */}
          <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#0284c7" strokeWidth={2.8} />

          <circle cx={cx} cy={cy} r={4} fill="#0f172a" className="dark:fill-white" />
          <text x={24} y={32} fontSize={11} fontFamily="monospace" fill="#64748b">
            n₁ = 1.00 ({isEn ? 'Air' : 'Không khí'})
          </text>
          <text x={24} y={208} fontSize={11} fontFamily="monospace" fill="#0284c7">
            n₂ = {mediumN2.toFixed(2)}
          </text>
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600 dark:text-slate-300">
                {isEn ? 'Incidence θ₁' : 'Góc tới θ₁'}
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{incAngleDeg}°</span>
            </div>
            <input
              type="range"
              min={10}
              max={75}
              step={1}
              value={incAngleDeg}
              onChange={(e) => {
                onUserInteract();
                setIncAngleDeg(Number(e.target.value));
              }}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between font-mono">
              <span className="text-slate-600 dark:text-slate-300">
                {isEn ? 'Material n₂' : 'Môi trường n₂'}
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{mediumN2.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: isEn ? 'Water' : 'Nước', n: 1.33 },
                { label: isEn ? 'Glass' : 'Thủy tinh', n: 1.5 },
                { label: isEn ? 'Diamond' : 'Kim cương', n: 2.42 },
              ].map((mat) => (
                <button
                  key={mat.n}
                  type="button"
                  onClick={() => {
                    onUserInteract();
                    setMediumN2(mat.n);
                  }}
                  className={`py-1 rounded text-[10px] font-semibold border cursor-pointer ${
                    mediumN2 === mat.n
                      ? 'bg-sky-600 border-sky-500 text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {mat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'cs_sort') {
    const frame = sortTraceSteps[sortIdx] || sortTraceSteps[0];
    const codeLines = [
      'for (int i = 0; i < n - 1; i++)',
      '  for (int j = 0; j < n - 1 - i; j++)',
      '    if (a[j] > a[j + 1])',
      '      swap(a[j], a[j + 1]);',
    ];
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 h-full flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            STEP {sortIdx + 1}/{sortTraceSteps.length}
          </span>
          <div className="flex items-center gap-3 tabular-nums text-[11px]">
            <span className="text-sky-700 dark:text-sky-300">comps={frame.comps}</span>
            <span className="text-emerald-700 dark:text-emerald-300">swaps={frame.swaps}</span>
          </div>
        </div>

        {/* Array Bars */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="h-28 flex items-end justify-center gap-2.5">
            {frame.arr.map((val, idx) => {
              const active = frame.cmp && (frame.cmp[0] === idx || frame.cmp[1] === idx);
              return (
                <div key={idx} className="flex flex-col items-center gap-1 w-9">
                  <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                    {val}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all duration-200 ${
                      active
                        ? frame.swapped
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                        : 'bg-sky-600'
                    }`}
                    style={{ height: `${Math.round((val / 70) * 74)}px` }}
                  />
                  <span className="font-mono text-[10px] text-slate-400">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="rounded bg-slate-900 text-slate-200 p-2.5 font-mono text-[11px] space-y-0.5">
            {codeLines.map((line, lIdx) => (
              <div
                key={lIdx}
                className={`px-2 py-0.5 rounded whitespace-pre ${
                  frame.codeLine === lIdx ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-300 truncate">
            {isEn ? frame.noteEn : frame.noteVi}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                onUserInteract();
                setSortAuto(false);
                setSortIdx((p) => (p - 1 + sortTraceSteps.length) % sortTraceSteps.length);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                onUserInteract();
                setSortAuto((a) => !a);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
            >
              {sortAuto ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{sortAuto ? (isEn ? 'Pause' : 'Dừng') : isEn ? 'Run' : 'Chạy'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onUserInteract();
                setSortAuto(false);
                setSortIdx((p) => (p + 1) % sortTraceSteps.length);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <StepForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'phasor_3b1b') {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 h-full flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            y(t) = {amp.toFixed(1)}·sin({omega.toFixed(1)}t)
          </span>
          <button
            type="button"
            onClick={() => {
              onUserInteract();
              setPhasorPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {phasorPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{phasorPlaying ? (isEn ? 'Pause' : 'Dừng') : isEn ? 'Play' : 'Chạy'}</span>
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          <canvas ref={phasorCanvasRef} className="w-full h-[215px] block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600 dark:text-slate-300">
                {isEn ? 'Amplitude A' : 'Biên độ A'}
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{amp.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.3}
              step={0.1}
              value={amp}
              onChange={(e) => {
                onUserInteract();
                setAmp(Number(e.target.value));
              }}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex justify-between font-mono tabular-nums">
              <span className="text-slate-600 dark:text-slate-300">
                {isEn ? 'Angular freq ω' : 'Tần số góc ω'}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {omega.toFixed(1)} rad/s
              </span>
            </div>
            <input
              type="range"
              min={0.6}
              max={3.8}
              step={0.2}
              value={omega}
              onChange={(e) => {
                onUserInteract();
                setOmega(Number(e.target.value));
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  }

  // Chapter 06: Interactive Pre CAD / Exploded Isometric Wireframe Schematic
  const layers = [
    { dy: -cadExplode * 0.55, rx: 74, ry: 22, color: '#0284c7', label: 'Outer Ring' },
    { dy: 0, rx: 52, ry: 16, color: '#059669', label: 'Toroidal Core' },
    { dy: cadExplode * 0.55, rx: 66, ry: 20, color: '#d97706', label: 'Base Pedestal' },
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3 h-full flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="font-bold text-slate-800 dark:text-slate-200">
          CAD LAYER INSPECTOR · {cadExplode}%
        </span>
        <button
          type="button"
          onClick={() => {
            onUserInteract();
            setCadCutaway((c) => !c);
          }}
          className={`px-2.5 py-1 rounded border text-[11px] font-semibold cursor-pointer ${
            cadCutaway
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
          }`}
        >
          {cadCutaway ? (isEn ? 'Cutaway: ON' : 'Mặt cắt: BẬT') : isEn ? 'Cutaway: OFF' : 'Mặt cắt: TẮT'}
        </button>
      </div>

      <svg
        viewBox="0 0 480 220"
        className="w-full h-[215px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      >
        <defs>
          <clipPath id="guide-cad-half">
            <rect x={0} y={0} width={240} height={220} />
          </clipPath>
        </defs>
        {/* Center vertical CAD axis */}
        <line
          x1={240}
          y1={20}
          x2={240}
          y2={200}
          stroke="rgba(148,163,184,0.45)"
          strokeDasharray="4 4"
        />

        {layers.map((layer, idx) => {
          const cy = 110 + layer.dy;
          const rotOffset = Math.sin((cadAngle * Math.PI) / 180) * 14;
          return (
            <g
              key={idx}
              clipPath={cadCutaway ? 'url(#guide-cad-half)' : undefined}
            >
              <ellipse
                cx={240 + rotOffset * 0.25}
                cy={cy}
                rx={layer.rx}
                ry={layer.ry}
                fill={`${layer.color}18`}
                stroke={layer.color}
                strokeWidth={2}
              />
              <ellipse
                cx={240 + rotOffset * 0.25}
                cy={cy - 10}
                rx={layer.rx * 0.84}
                ry={layer.ry * 0.84}
                fill="none"
                stroke={layer.color}
                strokeWidth={1.2}
                strokeDasharray="3 3"
              />
            </g>
          );
        })}

        {/* Measurement Ruler Demo Line */}
        <line x1={148} y1={178} x2={332} y2={178} stroke="#64748b" strokeWidth={1.4} />
        <circle cx={148} cy={178} r={3.5} fill="#0284c7" />
        <circle cx={332} cy={178} r={3.5} fill="#d97706" />
        <text
          x={240}
          y={195}
          textAnchor="middle"
          fontSize={11}
          fontFamily="monospace"
          fill="#64748b"
        >
          ΔL = 14.80 m · Tilt = {cadAngle}°
        </text>
      </svg>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between font-mono tabular-nums">
            <span className="text-slate-600 dark:text-slate-300">
              {isEn ? 'Explode Layers' : 'Tách lớp 3D'}
            </span>
            <span className="font-bold text-sky-600 dark:text-sky-400">{cadExplode}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={2}
            value={cadExplode}
            onChange={(e) => {
              onUserInteract();
              setCadExplode(Number(e.target.value));
            }}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between font-mono tabular-nums">
            <span className="text-slate-600 dark:text-slate-300">
              {isEn ? 'View Yaw' : 'Góc xoay quan sát'}
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{cadAngle}°</span>
          </div>
          <input
            type="range"
            min={-45}
            max={45}
            step={1}
            value={cadAngle}
            onChange={(e) => {
              onUserInteract();
              setCadAngle(Number(e.target.value));
            }}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   CLEAN STRUCTURAL UI BLUEPRINT CARD (REPLACES AI RASTER ART)
   ============================================================================ */
const BlueprintDiagramPanel: React.FC<{
  scene: GuideSceneDef;
  isEn: boolean;
}> = ({ scene, isEn }) => {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col justify-between gap-4 h-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isEn ? scene.blueprintTitleEn : scene.blueprintTitleVi}
          </span>
          <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300">
            #{scene.chapterNumber}
          </span>
        </div>

        {/* Clean Spec Table */}
        <div className="grid grid-cols-1 gap-2">
          {scene.blueprintSpecs.map((sp, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs"
            >
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {isEn ? sp.labelEn : sp.labelVi}
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {sp.value}
              </span>
            </div>
          ))}
        </div>

        {/* Architecture Notes */}
        <ul className="space-y-2 pt-1">
          {(isEn ? scene.blueprintNotesEn : scene.blueprintNotesVi).map((note, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
        <span>{isEn ? 'Keyboard: ← / →' : 'Phím mũi tên: ← / →'}</span>
        <span>{isEn ? 'Live Canvas + Docs' : 'Sơ đồ thực tế'}</span>
      </div>
    </div>
  );
};

export const GuideTourPage: React.FC<GuideTourPageProps> = ({
  onBack,
  onNavigateSubject,
  onReturnToLanding,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const prefersReducedMotion = useReducedMotion();

  const [sceneIdx, setSceneIdx] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [viewMode, setViewMode] = useState<GuideViewMode>('split');

  const activeScene = GUIDE_SCENES[sceneIdx] || GUIDE_SCENES[0];

  const goToScene = (nextIdx: number) => {
    const normalized = (nextIdx + GUIDE_SCENES.length) % GUIDE_SCENES.length;
    setSlideDir(normalized >= sceneIdx ? 1 : -1);
    setSceneIdx(normalized);
  };

  useEffect(() => {
    if (!autoPlay || prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setSlideDir(1);
      setSceneIdx((prev) => (prev + 1) % GUIDE_SCENES.length);
    }, 9000);
    return () => window.clearInterval(id);
  }, [autoPlay, prefersReducedMotion, sceneIdx]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') goToScene(sceneIdx + 1);
      else if (e.key === 'ArrowLeft') goToScene(sceneIdx - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      <ScrollProgressBar />

      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
          </button>

          {onReturnToLanding && (
            <button
              type="button"
              onClick={onReturnToLanding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-sky-500 cursor-pointer whitespace-nowrap"
            >
              <span>{isEn ? 'Welcome Page' : 'Trang chào mừng'}</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigateSubject('authors')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 cursor-pointer whitespace-nowrap"
        >
          <Users className="w-4 h-4" />
          <span>{isEn ? 'Meet the Authors (Class 9/4)' : 'Giới thiệu Nhóm tác giả 9/4'}</span>
        </button>
      </div>

      {/* Editorial Hero Header */}
      <section className="space-y-4">
        <div className="text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-300">
          {isEn
            ? 'Interactive Walkthrough · Try Live Controls Before Entering Any Lab'
            : 'Hướng dẫn sử dụng trực tiếp · Kéo thử thông số và xem cấu trúc từng phân hệ'}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.14] max-w-3xl text-balance">
            {isEn
              ? 'How Synapse Works: Interactive Labs, Code Tracing & Pre Engineering'
              : 'Hướng dẫn sử dụng Synapse: Thao tác mẫu & Cấu trúc hệ thống'}
          </h1>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 self-start">
            {(
              [
                { id: 'split', vi: 'Song song', en: 'Split View', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'sandbox', vi: 'Thử tương tác', en: 'Live Try-It', icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: 'blueprint', vi: 'Thông số', en: 'Spec Card', icon: <BookOpen className="w-3.5 h-3.5" /> },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setViewMode(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  viewMode === opt.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.icon}
                <span>{isEn ? opt.en : opt.vi}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE WALKTHROUGH STAGE */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm overflow-hidden">
        {/* Chapter Selector Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/70">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
            {GUIDE_SCENES.map((sc, idx) => {
              const active = idx === sceneIdx;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setAutoPlay(false);
                    goToScene(idx);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono tabular-nums mr-1.5 opacity-80">{sc.chapterNumber}.</span>
                  <span>{isEn ? sc.shortTitleEn : sc.shortTitleVi}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setAutoPlay((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 cursor-pointer whitespace-nowrap"
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{autoPlay ? (isEn ? 'Auto-Next On' : 'Tự chuyển') : isEn ? 'Manual' : 'Thủ công'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAutoPlay(false);
                goToScene(sceneIdx - 1);
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500 cursor-pointer"
              aria-label={isEn ? 'Previous chapter' : 'Phần trước'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setAutoPlay(false);
                goToScene(sceneIdx + 1);
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500 cursor-pointer"
              aria-label={isEn ? 'Next chapter' : 'Phần tiếp theo'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Progress Line */}
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {autoPlay && !prefersReducedMotion ? (
            <motion.div
              key={`progress-${sceneIdx}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 9, ease: 'linear' }}
              style={{ transformOrigin: '0% 50%' }}
              className="h-full bg-sky-600"
            />
          ) : (
            <div
              className="h-full bg-sky-600 transition-transform duration-300"
              style={{
                width: '100%',
                transform: `scaleX(${(sceneIdx + 1) / GUIDE_SCENES.length})`,
                transformOrigin: '0% 50%',
              }}
            />
          )}
        </div>

        {/* Main Walkthrough Content */}
        <div className="p-5 sm:p-7 overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDir}>
            <motion.div
              key={`${activeScene.id}-${viewMode}`}
              custom={slideDir}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: slideDir * 28 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -slideDir * 28 }
              }
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left Column: Authentic Live Interactive Preview & Technical Blueprint */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div
                  className={`grid gap-3 h-full ${
                    viewMode === 'split' ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1'
                  }`}
                >
                  {(viewMode === 'split' || viewMode === 'sandbox') && (
                    <div className={viewMode === 'split' ? 'md:col-span-7' : ''}>
                      <GuideInteractiveStage
                        kind={activeScene.kind}
                        isEn={isEn}
                        onUserInteract={() => setAutoPlay(false)}
                      />
                    </div>
                  )}

                  {(viewMode === 'split' || viewMode === 'blueprint') && (
                    <div className={viewMode === 'split' ? 'md:col-span-5' : ''}>
                      <BlueprintDiagramPanel scene={activeScene} isEn={isEn} />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Clear Step Guide & Direct Launch */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="text-xs font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                    {isEn
                      ? `Chapter ${activeScene.chapterNumber} / 06`
                      : `Phần ${activeScene.chapterNumber} / 06`}
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug text-balance">
                    {isEn ? activeScene.titleEn : activeScene.titleVi}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? activeScene.subtitleEn : activeScene.subtitleVi}
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {(isEn ? activeScene.stepsEn : activeScene.stepsVi).map((line, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                      >
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums shrink-0 mt-0.5">
                          0{sIdx + 1}
                        </span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onNavigateSubject(activeScene.targetSubject)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Compass className="w-4 h-4" />
                    <span>{isEn ? activeScene.actionLabelEn : activeScene.actionLabelVi}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAutoPlay(false);
                      goToScene(0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back to Chapter 01' : 'Về phần 01'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 1: Operational Architecture Cards */}
      <ScrollReveal direction="up" className="space-y-5">
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Four Core Areas of Synapse' : 'Bốn phân hệ chính trên nền tảng Synapse'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {isEn
              ? 'Click any module below to jump straight into its workspace.'
              : 'Chọn nhanh phân hệ bên dưới để mở trực tiếp không gian học tập và mô phỏng.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01',
              icon: BookOpen,
              titleVi: 'Kho Bài giảng & Lộ trình',
              titleEn: 'Curriculum & Lectures',
              descVi: 'Bài giảng Toán, Vật lí, Tin học lớp 9–12 kèm thuyết minh tiếng Việt và ví dụ mẫu.',
              descEn: 'Grades 9–12 Math, Physics, and CS lessons with audio narration and worked examples.',
              subject: 'roadmap' as SubjectType,
            },
            {
              num: '02',
              icon: Compass,
              titleVi: 'Phòng Mô phỏng 2D/3D',
              titleEn: '2D/3D Simulation Labs',
              descVi: '36 dụng cụ đo Vật lí, đồ thị giải tích Oxy/Oxyz và 16 + 10 thuật toán Tin học.',
              descEn: '36 physics tools, Oxy/Oxyz math plots, and 2D/3D computer science visualizers.',
              subject: 'physics_sims' as SubjectType,
            },
            {
              num: '03',
              icon: Code2,
              titleVi: 'IDE Code & Luyện Đề',
              titleEn: 'Code IDE & Exam Bank',
              descVi: 'Biên dịch C++20/Python 3 trực tiếp, truy vết biến từng dòng và chấm bài theo đề thi.',
              descEn: 'Run C++20/Python 3 code, trace variables line by line, and practice full exam sets.',
              subject: 'cs_sims' as SubjectType,
            },
            {
              num: '04',
              icon: Box,
              titleVi: 'Synapse Pre & Công trình 3D',
              titleEn: 'Synapse Pre & Megastructures',
              descVi: '30 Đại Công Trình 3D kèm thước đo laser, mặt cắt X/Y/Z, đồ thị Telemetry và 21 phòng Lab Pre.',
              descEn: '30 WebGL megastructures with 3D ruler, X/Y/Z cutaways, telemetry charts, and 21 Pre labs.',
              subject: 'synapse_v2' as SubjectType,
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <ScrollReveal key={card.num} direction="up" delay={idx * 0.06}>
                <button
                  type="button"
                  onClick={() => onNavigateSubject(card.subject)}
                  className="w-full h-full text-left p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
                      <span className="font-mono text-xs font-bold tabular-nums">{card.num}</span>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                      {isEn ? card.titleEn : card.titleVi}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isEn ? card.descEn : card.descVi}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <span>{isEn ? 'Open module' : 'Mở ngay'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </ScrollReveal>

      {/* SECTION 2: Keyboard Shortcuts */}
      <ScrollReveal direction="up" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            {isEn ? 'Keyboard Shortcuts' : 'Phím tắt thao tác nhanh'}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>{isEn ? 'Works across classroom & labs' : 'Áp dụng trên toàn bộ phòng học & mô phỏng'}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { keys: 'Ctrl + D', labelVi: 'Mở nhanh Gia sư Toán', labelEn: 'Open Math Tutor' },
            { keys: 'Ctrl + F', labelVi: 'Mở nhanh Gia sư Vật lí', labelEn: 'Open Physics Tutor' },
            { keys: 'Ctrl + G', labelVi: 'Mở nhanh Gia sư Tin học', labelEn: 'Open CS Tutor' },
            { keys: 'Alt + Space', labelVi: 'Bật / Tắt Voice OS', labelEn: 'Toggle Voice OS' },
          ].map((sc) => (
            <div
              key={sc.keys}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2"
            >
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                {isEn ? sc.labelEn : sc.labelVi}
              </span>
              <kbd className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-[11px] font-bold text-sky-700 dark:text-sky-300 shrink-0">
                {sc.keys}
              </kbd>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
};
