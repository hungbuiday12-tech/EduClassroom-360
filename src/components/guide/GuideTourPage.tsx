import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Film,
  Image as ImageIcon,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Users
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollProgressBar, ScrollReveal } from '../common/ScrollReveal';
import guideMathPhysicsImg from '../../assets/images/guide_math_physics_lab_1795524974123.jpg';
import guideCsStudioImg from '../../assets/images/guide_cs_algorithm_studio_1795524974502.jpg';
import guideAi3b1bImg from '../../assets/images/guide_ai_3b1b_theater_1795524974689.jpg';

interface GuideTourPageProps {
  onBack: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onReturnToLanding?: () => void;
}

type GuideMediaMode = 'hybrid' | 'video' | 'image';

interface GuideSceneDef {
  id: string;
  chapterNumber: string;
  shortTitleVi: string;
  shortTitleEn: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  imageSrc: string;
  imageAltVi: string;
  imageAltEn: string;
  videoCaptionVi: string;
  videoCaptionEn: string;
  canvasKind: 'ecosystem' | 'math_calculus' | 'physics_optics' | 'cs_trace' | 'ai_3b1b' | 'pre_particles';
  targetSubject: SubjectType;
  actionLabelVi: string;
  actionLabelEn: string;
  stepsVi: string[];
  stepsEn: string[];
  hotspots: { xPct: number; yPct: number; labelVi: string; labelEn: string }[];
}

const GUIDE_SCENES: GuideSceneDef[] = [
  {
    id: 'ecosystem',
    chapterNumber: '01',
    shortTitleVi: 'Cách hoạt động',
    shortTitleEn: 'How It Works',
    titleVi: 'Quy trình học 3 bước trên Synapse STEM Observatory',
    titleEn: 'Three-Step Interactive STEM Workflow',
    subtitleVi:
      'Kết hợp bài giảng phân tầng, phòng thí nghiệm ảo 2D/3D thời gian thực và gia sư AI hỏi đáp theo từng bước.',
    subtitleEn:
      'Combines structured multi-step lectures, live 2D/3D laboratories, and context-aware AI tutoring.',
    imageSrc: guideMathPhysicsImg,
    imageAltVi: 'Tổng quan phòng thí nghiệm hình học Oxyz và quang học Vật lí trên nền tảng Synapse',
    imageAltEn: 'Overview of Synapse 3D Oxyz geometry and optical physics laboratory',
    videoCaptionVi: 'Video mô phỏng quỹ đạo 3 phân hệ Toán · Vật lí · Tin học đồng bộ',
    videoCaptionEn: 'Live orbital motion linking Mathematics, Physics, and Computer Science',
    canvasKind: 'ecosystem',
    targetSubject: 'roadmap',
    actionLabelVi: 'Mở Lộ trình học',
    actionLabelEn: 'Open Study Roadmap',
    stepsVi: [
      'Chọn môn Toán, Vật lí hoặc Tin học ở thanh bên trái hoặc Mục lục trang chính.',
      'Tương tác trực tiếp trên mô hình 2D/3D, kéo thả dụng cụ đo hoặc chạy thử mã nguồn.',
      'Nghe giảng tiếng Việt tự nhiên, xem Video 3B1B hoặc hỏi AI ngay khi gặp bước khó.'
    ],
    stepsEn: [
      'Pick Mathematics, Physics, or Computer Science from the sidebar or main Table of Contents.',
      'Interact directly with 2D/3D models, drag lab tools, or trace code live.',
      'Listen to natural Vietnamese lectures, watch 3B1B reels, or ask AI on any step.'
    ],
    hotspots: [
      { xPct: 20, yPct: 58, labelVi: 'Lăng kính & Quang học', labelEn: 'Optics Prism' },
      { xPct: 50, yPct: 48, labelVi: 'Hình học Oxyz 3D', labelEn: 'Oxyz 3D Sphere' },
      { xPct: 82, yPct: 42, labelVi: 'Con lắc cơ học', labelEn: 'Mechanics Pendulum' }
    ]
  },
  {
    id: 'math_lab',
    chapterNumber: '02',
    shortTitleVi: 'Toán 2D & 3D',
    shortTitleEn: 'Math 2D & 3D',
    titleVi: 'Đồ thị Oxy, Hình học Đường tròn & 8 mô hình Oxyz 3D',
    titleEn: 'Oxy Analytic Grapher, Circles & 8 Oxyz 3D Scenes',
    subtitleVi:
      'Khảo sát đạo hàm, tiếp tuyến, diện tích tích phân, phương tích đường tròn và xoay tự do các mặt nón, mặt cầu 3D.',
    subtitleEn:
      'Plot derivatives, tangent slopes, shaded definite integrals, circle theorems, and orbitable Oxyz 3D scenes.',
    imageSrc: guideAi3b1bImg,
    imageAltVi: 'Bảng đồ thị parabol, diện tích tích phân và vòng tròn lượng giác trực quan',
    imageAltEn: 'Visual chalkboard illustrating parabola, shaded integral area, and unit circle',
    videoCaptionVi: 'Hoạt ảnh thời gian thực: Tiếp tuyến trượt & tô diện tích tích phân Riemann',
    videoCaptionEn: 'Live canvas animation: Sliding tangent line & shaded Riemann integral',
    canvasKind: 'math_calculus',
    targetSubject: 'math_sims',
    actionLabelVi: 'Vào Phòng Toán 2D/3D',
    actionLabelEn: 'Open Math 2D/3D',
    stepsVi: [
      'Nhập hệ số a, b, c hoặc hàm tùy chọn để quan sát đồ thị thay đổi tức thì.',
      'Bật công cụ Tiếp tuyến hoặc Tích phân xác định để thấy phần diện tích tô màu.',
      'Chuyển sang tab Oxyz 3D để xoay góc nhìn 360 độ quanh mặt cầu, mặt nón và thiết diện.'
    ],
    stepsEn: [
      'Adjust coefficients a, b, c or enter custom functions to update plots immediately.',
      'Toggle tangent slope or definite integral shading directly on the coordinate grid.',
      'Switch to Oxyz 3D mode to orbit spheres, tangent cones, and cross-sections.'
    ],
    hotspots: [
      { xPct: 34, yPct: 56, labelVi: 'Vùng diện tích ∫ f(x)dx', labelEn: 'Integral Area' },
      { xPct: 72, yPct: 50, labelVi: 'Vòng tròn Pha & Góc', labelEn: 'Phasor Circle' }
    ]
  },
  {
    id: 'physics_lab',
    chapterNumber: '03',
    shortTitleVi: 'Vật lí & Dụng cụ',
    shortTitleEn: 'Physics Lab',
    titleVi: '10 Lĩnh vực Vật lí & 36 Dụng cụ Đo Thí nghiệm Thật',
    titleEn: '10 Physics Domains & 36 Frameless Real-World Instruments',
    subtitleVi:
      'Kéo thả trực tiếp Ampe kế, Vôn kế, Đồng hồ bấm giây, Thước kẹp, Lăng kính lên bàn thí nghiệm và bắn thử bệ pháo 3D.',
    subtitleEn:
      'Drag realistic ammeters, voltmeters, stopwatches, calipers, and prisms directly onto your bench alongside 3D ballistics.',
    imageSrc: guideMathPhysicsImg,
    imageAltVi: 'Mô phỏng thí nghiệm quang học khúc xạ ánh sáng và con lắc đồng hồ',
    imageAltEn: 'Physics optics refraction and brass pendulum simulation bench',
    videoCaptionVi: 'Video mô phỏng: Giao thoa sóng & chùm tia khúc xạ đổi góc theo chiết suất',
    videoCaptionEn: 'Live physics motion: Wave interference & refractive beam angle sweep',
    canvasKind: 'physics_optics',
    targetSubject: 'physics_sims',
    actionLabelVi: 'Mở Lab Vật lí 2D/3D',
    actionLabelEn: 'Launch Physics Lab',
    stepsVi: [
      'Chọn 1 trong 10 chuyên đề: Cơ học, Dao động & Sóng, Điện học, Quang học, Nhiệt & Hạt nhân.',
      'Bấm chọn dụng cụ từ khay để đặt thẳng thiết bị thực tế lên bàn đo (có thể xoay và đọc số).',
      'Trong mỗi bài giảng Vật lí, chuyển đổi linh hoạt giữa mô phỏng 2D và 3D ngay dưới bài học.'
    ],
    stepsEn: [
      'Choose any of the 10 physics domains from Mechanics and Waves to Optics and Nuclear.',
      'Place frameless realistic instruments onto the lab bench, rotate them, and take measurements.',
      'Toggle seamlessly between 2D and 3D simulations embedded right inside every Physics lecture.'
    ],
    hotspots: [
      { xPct: 18, yPct: 55, labelVi: 'Nguồn Laser & Lăng kính', labelEn: 'Laser & Prism' },
      { xPct: 83, yPct: 45, labelVi: 'Con lắc đồng thau', labelEn: 'Pendulum Rig' }
    ]
  },
  {
    id: 'cs_trace',
    chapterNumber: '04',
    shortTitleVi: 'Tin học & Hỏi AI',
    shortTitleEn: 'CS & Step AI',
    titleVi: 'IDE Sublime 4, Truy vết từng dòng 1-1 & Dừng hỏi AI',
    titleEn: 'Sublime 4 IDE, Line-by-Line Code Trace & Pause-to-Ask AI',
    subtitleVi:
      'Biên dịch C++20/Python 3 thật, xem mảng và biến nhảy theo từng dòng lệnh, và bấm Dừng ở mô phỏng 2D/3D để hỏi AI đúng bước đó.',
    subtitleEn:
      'Run real C++20/Python 3 code, watch array bars animate per line, and pause any 2D/3D CS simulation to ask AI.',
    imageSrc: guideCsStudioImg,
    imageAltVi: 'Không gian thuật toán Tin học 3D với cây nhị phân, cột sắp xếp và mã nguồn',
    imageAltEn: '3D Computer Science studio showing sorting bars, binary tree, and traced code',
    videoCaptionVi: 'Video mô phỏng: Sắp xếp cột & con trỏ truy vết mảng tự động dừng phân tích',
    videoCaptionEn: 'Live algorithm trace: Animated bar swaps with active step pointer',
    canvasKind: 'cs_trace',
    targetSubject: 'cs_sims',
    actionLabelVi: 'Mở Mô phỏng Code',
    actionLabelEn: 'Open Code Simulations',
    stepsVi: [
      'Luyện 5 lộ trình Tin học (VNOI & C++ Quốc tế) hoặc mở IDE Sublime 4 gõ code trực tiếp.',
      'Bấm "Truy vết Code Ngay" để xem từng dòng code đổi màu cùng biểu đồ mảng và stdout.',
      'Ở mô phỏng 2D/3D hoặc Trace, bấm Tạm dừng bất cứ lúc nào rồi chọn "Hỏi AI về bước này".'
    ],
    stepsEn: [
      'Follow 5 Informatics roadmaps or write C++/Python directly inside Sublime 4 IDE.',
      'Click "Trace My Code" to synchronize active code lines with variable pills and bar charts.',
      'Pause any 2D, 3D, or trace playback and click "Ask AI about this step" for instant analysis.'
    ],
    hotspots: [
      { xPct: 19, yPct: 35, labelVi: 'Biểu đồ Sắp xếp 2D/3D', labelEn: 'Sorting Bars' },
      { xPct: 68, yPct: 34, labelVi: 'Cây Tìm kiếm Nhị phân 3D', labelEn: '3D Binary Tree' },
      { xPct: 36, yPct: 76, labelVi: 'Truy vết từng dòng Code', labelEn: 'Live Line Trace' }
    ]
  },
  {
    id: 'ai_3b1b',
    chapterNumber: '05',
    shortTitleVi: 'Giọng Việt & 3B1B',
    shortTitleEn: 'Voice & 3B1B',
    titleVi: 'Thuyết minh Tiếng Việt, Video 3B1B & Gia sư Mắt Thần',
    titleEn: 'Vietnamese Lecture Voice, 3B1B Video & Vision AI Tutor',
    subtitleVi:
      'Nghe giảng trọn bài bằng giọng đọc tiếng Việt rõ ràng, dựng video phong cách 3Blue1Brown và nhận lời giải chia đề mục dễ đọc.',
    subtitleEn:
      'Listen to full Vietnamese lecture narration, render 3Blue1Brown-style animated videos, and read clearly structured AI answers.',
    imageSrc: guideAi3b1bImg,
    imageAltVi: 'Trình dựng video toán học 3Blue1Brown với đồ thị vectơ và công thức trên bảng đen',
    imageAltEn: '3Blue1Brown style blackboard displaying geometric curves and vectors',
    videoCaptionVi: 'Video 3B1B: Vòng tròn pha quay tạo sóng hình sin kèm chú thích tọa độ',
    videoCaptionEn: '3B1B Video scene: Rotating phasor vector projecting a live sine wave',
    canvasKind: 'ai_3b1b',
    targetSubject: 'math',
    actionLabelVi: 'Xem trong Bài giảng',
    actionLabelEn: 'Try in Lectures',
    stepsVi: [
      'Bấm "Nghe giảng" ở từng phần hoặc "Nghe cả bài" trên đầu bài giảng để học rảnh tay.',
      'Mở tab "Video 3B1B" ngay trong bài giảng để xem hoạt hình vector kèm giọng đọc và xuất file.',
      'Dán ảnh đề thi (Ctrl+V) vào Gia sư AI hoặc Kho Đề Thi để chấm điểm 0–10 theo từng ý.'
    ],
    stepsEn: [
      'Click "Listen" per section or "Listen to Full Lesson" in the lecture toolbar.',
      'Switch to the embedded "Video 3B1B" tab to play, customize with AI, and export .webm reels.',
      'Paste exam photos into the AI Tutor or Exam Hub for structured step-by-step explanations.'
    ],
    hotspots: [
      { xPct: 32, yPct: 48, labelVi: 'Phân tích Tích phân', labelEn: 'Calculus Canvas' },
      { xPct: 72, yPct: 48, labelVi: 'Vòng tròn Pha & Sóng', labelEn: 'Phasor Projection' }
    ]
  },
  {
    id: 'pre_3d',
    chapterNumber: '06',
    shortTitleVi: 'Hạt GPU & Meet 3D',
    shortTitleEn: 'GPU & Meet 3D',
    titleVi: 'Hạt GPU 2 Tay, Holo Atlas 3D & Phòng họp Syn Meet',
    titleEn: 'Dual-Hand GPU Particles, Holo Atlas 3D & Syn Meet',
    subtitleVi:
      'Điều khiển hàng chục nghìn hạt ánh sáng bằng webcam 2 tay, mổ xẻ mô hình 58 bộ phận 3D và cùng bạn bè xoay mô hình trong Syn Meet.',
    subtitleEn:
      'Steer glowing GPU particle fields with both hands via webcam, inspect 58-part 3D models, and collaborate live in Syn Meet.',
    imageSrc: guideCsStudioImg,
    imageAltVi: 'Phòng thí nghiệm mô phỏng không gian 3D tương tác đa lớp',
    imageAltEn: 'Interactive multi-layer 3D spatial computing laboratory',
    videoCaptionVi: 'Video mô phỏng: Trường hạt lưỡng cực xoay xoáy tương tác theo quỹ đạo 2 tâm',
    videoCaptionEn: 'Live simulation: Dual-center swirling particle field with orbital eddies',
    canvasKind: 'pre_particles',
    targetSubject: 'synapse_v2',
    actionLabelVi: 'Khám phá Synapse Pre',
    actionLabelEn: 'Explore Synapse Pre',
    stepsVi: [
      'Mở "Trường Hạt GPU 2 Tay" để dùng bàn tay trước webcam kéo, xoáy hoặc đẩy đám hạt 3D.',
      'Khám phá Holo Atlas 3D với tính năng X-Quang, tách lớp từng bộ phận và chiếu WebAR.',
      'Tạo phòng Syn Meet để chia sẻ màn hình và cùng xoay mô hình .glb/.obj theo thời gian thực.'
    ],
    stepsEn: [
      'Open Dual-Hand GPU Field to swirl, attract, or repel particle clouds with webcam hand tracking.',
      'Inspect multi-part assemblies in Holo Atlas 3D with X-Ray, layer explosion, and WebAR.',
      'Host a Syn Meet room for screen sharing and synchronized multi-user 3D model inspection.'
    ],
    hotspots: [
      { xPct: 50, yPct: 50, labelVi: 'Khối cấu trúc 3D tương tác', labelEn: 'Interactive 3D Core' },
      { xPct: 24, yPct: 35, labelVi: 'Biểu đồ dữ liệu trực tiếp', labelEn: 'Live Telemetry' }
    ]
  }
];

const LiveTourVideoCanvas: React.FC<{
  kind: GuideSceneDef['canvasKind'];
  playing: boolean;
}> = ({ kind, playing }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let simTime = 0;
    let lastTs = performance.now();

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, Math.floor(rect.width));
      const h = Math.max(200, Math.floor(rect.height));
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return { w, h };
    };

    const drawGrid = (w: number, h: number) => {
      ctx.fillStyle = '#070d19';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = (w / 2) % step; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = (h / 2) % step; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const renderFrame = (now: number) => {
      rafId = requestAnimationFrame(renderFrame);
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (playingRef.current && !prefersReduced) {
        simTime += dt;
      }

      const { w, h } = syncSize();
      const cx = w * 0.5;
      const cy = h * 0.52;
      drawGrid(w, h);

      if (kind === 'ecosystem') {
        const nodes = [
          { label: 'Toán 2D/3D', color: '#38bdf8', angle: simTime * 0.7 },
          { label: 'Vật lí Lab', color: '#f59e0b', angle: simTime * 0.7 + (Math.PI * 2) / 3 },
          { label: 'Tin học Trace', color: '#34d399', angle: simTime * 0.7 + (Math.PI * 4) / 3 }
        ];
        const rx = Math.min(w * 0.28, 150);
        const ry = Math.min(h * 0.25, 78);

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Center Synapse Core
        const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 44);
        coreGrad.addColorStop(0, '#38bdf8');
        coreGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 44, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e0f2fe';
        ctx.font = '600 13px "Lexend", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SYNAPSE AI', cx, cy + 4);

        nodes.forEach((n) => {
          const nx = cx + Math.cos(n.angle) * rx;
          const ny = cy + Math.sin(n.angle) * ry;
          ctx.strokeStyle = `${n.color}66`;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(nx, ny, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.font = '600 11px "Be Vietnam Pro", sans-serif';
          ctx.fillText(n.label, nx, ny + 36);
        });
      } else if (kind === 'math_calculus') {
        // Axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(32, cy + 36);
        ctx.lineTo(w - 32, cy + 36);
        ctx.moveTo(cx, 24);
        ctx.lineTo(cx, h - 24);
        ctx.stroke();

        const fn = (x: number) => 0.35 * x * x - 1.1;
        const dfn = (x: number) => 0.7 * x;
        const scaleX = Math.min(44, w / 9);
        const scaleY = Math.min(36, h / 7);
        const toPx = (x: number, y: number) => [cx + x * scaleX, cy + 36 - y * scaleY];

        // Shaded Riemann Integral [-1.4, bDynamic]
        const upperX = 1.1 + 0.7 * Math.sin(simTime * 0.9);
        const aX = -1.4;
        const slices = 18;
        const dx = (upperX - aX) / slices;
        for (let i = 0; i < slices; i++) {
          const x0 = aX + i * dx;
          const yVal = fn(x0 + dx * 0.5);
          const [px0, pyTop] = toPx(x0, yVal);
          const [px1, pyZero] = toPx(x0 + dx, 0);
          ctx.fillStyle = yVal >= 0 ? 'rgba(56, 189, 248, 0.28)' : 'rgba(245, 158, 11, 0.25)';
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
          ctx.lineWidth = 1;
          ctx.fillRect(px0, Math.min(pyTop, pyZero), Math.max(1, px1 - px0 - 1), Math.abs(pyZero - pyTop));
          ctx.strokeRect(px0, Math.min(pyTop, pyZero), Math.max(1, px1 - px0 - 1), Math.abs(pyZero - pyTop));
        }

        // Parabola curve
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = -3.2; x <= 3.2; x += 0.08) {
          const [px, py] = toPx(x, fn(x));
          if (x === -3.2) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Moving tangent line
        const tx = 1.5 * Math.cos(simTime * 1.1);
        const ty = fn(tx);
        const slope = dfn(tx);
        const [tpx, tpy] = toPx(tx, ty);
        const [l1x, l1y] = toPx(tx - 1.3, ty - slope * 1.3);
        const [l2x, l2y] = toPx(tx + 1.3, ty + slope * 1.3);

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(l1x, l1y);
        ctx.lineTo(l2x, l2y);
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(tpx, tpy, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`f'(x₀) = ${slope.toFixed(2)}  |  ∫ f(x)dx`, 20, 30);
      } else if (kind === 'physics_optics') {
        // Triangular prism + refracted rainbow beam
        const pTop = [cx - 10, cy - 58];
        const pLeft = [cx - 64, cy + 44];
        const pRight = [cx + 44, cy + 44];

        const hitX = (pTop[0] + pLeft[0]) * 0.5;
        const hitY = (pTop[1] + pLeft[1]) * 0.5;
        const incY = hitY + Math.sin(simTime * 1.4) * 26;

        // Incident white laser beam
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(24, incY);
        ctx.lineTo(hitX, hitY);
        ctx.stroke();

        // Dispersed spectrum rays exiting right face
        const spectrum = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#818cf8'];
        spectrum.forEach((col, i) => {
          const exitX = (pTop[0] + pRight[0]) * 0.5 + i * 2.2;
          const exitY = (pTop[1] + pRight[1]) * 0.5 + (i - 2.5) * 4.5;
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(hitX, hitY);
          ctx.lineTo(exitX, exitY);
          ctx.lineTo(w - 24, exitY + (i - 1.2) * 14 + Math.sin(simTime * 1.4) * 18);
          ctx.stroke();
        });

        // Glass prism polygon
        ctx.fillStyle = 'rgba(125, 211, 252, 0.16)';
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pTop[0], pTop[1]);
        ctx.lineTo(pRight[0], pRight[1]);
        ctx.lineTo(pLeft[0], pLeft[1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#bae6fd';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`n₁ sin(θ₁) = n₂ sin(θ₂)  |  λ: 400–700nm`, 20, 30);
      } else if (kind === 'cs_trace') {
        const vals = [32, 68, 22, 85, 47, 94, 58, 76];
        const phase = Math.floor(simTime * 1.6) % vals.length;
        const barW = Math.min(34, (w - 110) / vals.length);
        const gap = 10;
        const startX = cx - ((barW + gap) * vals.length - gap) / 2;

        vals.forEach((v, i) => {
          const swapOffset =
            i === phase
              ? Math.sin((simTime * 1.6 - Math.floor(simTime * 1.6)) * Math.PI) * 14
              : 0;
          const bh = (v / 100) * (h * 0.52);
          const bx = startX + i * (barW + gap);
          const by = h - 42 - bh - swapOffset;

          const active = i === phase || i === (phase + 1) % vals.length;
          ctx.fillStyle = active ? '#fbbf24' : i < phase ? '#10b981' : '#0284c7';
          ctx.fillRect(bx, by, barW, bh);

          ctx.fillStyle = '#f8fafc';
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(String(v), bx + barW / 2, by - 6);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(`[${i}]`, bx + barW / 2, h - 22);
        });

        ctx.fillStyle = '#6ee7b7';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`STEP #${phase + 1}: if (a[${phase}] > a[${(phase + 1) % vals.length}]) swap()`, 20, 30);
      } else if (kind === 'ai_3b1b') {
        const circleX = Math.max(92, w * 0.27);
        const r = Math.min(54, h * 0.24);
        const theta = simTime * 2.1;

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(circleX, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        const px = circleX + Math.cos(theta) * r;
        const py = cy - Math.sin(theta) * r;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(circleX, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Projection line to sine wave
        const waveStart = circleX + r + 24;
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(waveStart, py);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= w - waveStart - 24; x += 3) {
          const wy = cy - Math.sin(theta - x * 0.035) * r;
          if (x === 0) ctx.moveTo(waveStart + x, wy);
          else ctx.lineTo(waveStart + x, wy);
        }
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(waveStart, py, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e0f2fe';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`y(t) = A·sin(ωt)  |  3B1B Scene Reel`, 20, 30);
      } else {
        // Dual-hand GPU particle vortex
        const h1x = cx - 72 + Math.cos(simTime * 0.9) * 18;
        const h1y = cy + Math.sin(simTime * 1.1) * 14;
        const h2x = cx + 72 + Math.cos(simTime * 0.9 + Math.PI) * 18;
        const h2y = cy + Math.sin(simTime * 1.1 + Math.PI) * 14;

        for (let i = 0; i < 64; i++) {
          const seed = i * 1.37;
          const useFirst = i % 2 === 0;
          const ax = useFirst ? h1x : h2x;
          const ay = useFirst ? h1y : h2y;
          const orbit = 18 + (i % 9) * 9;
          const ang = simTime * (1.8 + (i % 4) * 0.35) * (useFirst ? 1 : -1) + seed;
          const px = ax + Math.cos(ang) * orbit;
          const py = ay + Math.sin(ang) * orbit * 0.68;
          ctx.fillStyle = useFirst ? 'rgba(56, 189, 248, 0.85)' : 'rgba(52, 211, 153, 0.85)';
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        [
          { x: h1x, y: h1y, col: '#38bdf8', tag: 'Tay Trái (+)' },
          { x: h2x, y: h2y, col: '#34d399', tag: 'Tay Phải (-)' }
        ].forEach((hnd) => {
          ctx.strokeStyle = hnd.col;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(hnd.x, hnd.y, 13, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '600 10px "Be Vietnam Pro", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(hnd.tag, hnd.x, hnd.y + 26);
        });
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [kind]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block rounded-xl bg-[#070d19]"
    />
  );
};

export const GuideTourPage: React.FC<GuideTourPageProps> = ({
  onBack,
  onNavigateSubject,
  onReturnToLanding
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const prefersReducedMotion = useReducedMotion();

  const [sceneIdx, setSceneIdx] = useState(0);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [autoPlay, setAutoPlay] = useState(true);
  const [mediaMode, setMediaMode] = useState<GuideMediaMode>('hybrid');
  const [videoPlaying, setVideoPlaying] = useState(true);

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
    }, 7500);
    return () => window.clearInterval(id);
  }, [autoPlay, prefersReducedMotion, sceneIdx]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToScene(sceneIdx + 1);
      else if (e.key === 'ArrowLeft') goToScene(sceneIdx - 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <ScrollProgressBar />

      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
          </button>

          {onReturnToLanding && (
            <button
              type="button"
              onClick={onReturnToLanding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-sky-400 cursor-pointer whitespace-nowrap"
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

      {/* Hero Header */}
      <section className="space-y-4">
        <div className="text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-300">
          {isEn
            ? 'Interactive Product Walkthrough · Video Motion & Technical Illustrations'
            : 'Hướng dẫn sử dụng trực quan · Chuyển cảnh động kết hợp Video & Hình ảnh'}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.14] max-w-3xl text-balance">
            {isEn
              ? 'How Synapse Works: Interactive Labs, Code Tracing & AI Tutor'
              : 'Cách thức hoạt động & Hệ thống tính năng của Synapse'}
          </h1>

          {/* Flexible Video / Image Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 self-start">
            {(
              [
                { id: 'hybrid', vi: 'Video + Ảnh', en: 'Video + Image', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'video', vi: 'Video hoạt họa', en: 'Motion Video', icon: <Film className="w-3.5 h-3.5" /> },
                { id: 'image', vi: 'Hình minh họa', en: 'Illustration', icon: <ImageIcon className="w-3.5 h-3.5" /> }
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMediaMode(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  mediaMode === opt.id
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

      {/* INTERACTIVE TRANSITION TOUR STAGE */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 shadow-sm overflow-hidden">
        {/* Chapter Selector Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 sm:pb-0">
            {GUIDE_SCENES.map((sc, idx) => {
              const active = idx === sceneIdx;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => goToScene(idx)}
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer whitespace-nowrap"
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{autoPlay ? (isEn ? 'Auto-play On' : 'Tự chuyển cảnh') : isEn ? 'Paused' : 'Đang dừng'}</span>
            </button>
            <button
              type="button"
              onClick={() => goToScene(sceneIdx - 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer"
              aria-label={isEn ? 'Previous scene' : 'Cảnh trước'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => goToScene(sceneIdx + 1)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer"
              aria-label={isEn ? 'Next scene' : 'Cảnh tiếp theo'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auto-transition progress line */}
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {autoPlay && !prefersReducedMotion ? (
            <motion.div
              key={`progress-${sceneIdx}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 7.5, ease: 'linear' }}
              style={{ transformOrigin: '0% 50%' }}
              className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-amber-400"
            />
          ) : (
            <div
              className="h-full bg-sky-500 transition-transform duration-300"
              style={{
                width: '100%',
                transform: `scaleX(${(sceneIdx + 1) / GUIDE_SCENES.length})`,
                transformOrigin: '0% 50%'
              }}
            />
          )}
        </div>

        {/* Animated Scene Viewport */}
        <div className="p-5 sm:p-7 overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDir}>
            <motion.div
              key={`${activeScene.id}-${mediaMode}`}
              custom={slideDir}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, x: slideDir * 44, scale: 0.985 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -slideDir * 44, scale: 0.985 }
              }
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left Column: Flexible Media Stage (Video + Image) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div
                  className={`grid gap-3 h-full min-h-[290px] sm:min-h-[340px] ${
                    mediaMode === 'hybrid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {/* Animated Motion Video Canvas */}
                  {(mediaMode === 'hybrid' || mediaMode === 'video') && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#070d19] min-h-[240px] flex flex-col">
                      <div className="flex-1 relative min-h-[210px]">
                        <LiveTourVideoCanvas kind={activeScene.canvasKind} playing={videoPlaying} />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-medium text-slate-100 leading-snug">
                            {isEn ? activeScene.videoCaptionEn : activeScene.videoCaptionVi}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVideoPlaying((v) => !v)}
                            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white shrink-0 cursor-pointer"
                            title={videoPlaying ? 'Tạm dừng video' : 'Chạy video'}
                          >
                            {videoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* High-Resolution Technical Illustration with Ken Burns Motion & Hotspots */}
                  {(mediaMode === 'hybrid' || mediaMode === 'image') && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 min-h-[240px]">
                      <motion.img
                        src={activeScene.imageSrc}
                        alt={isEn ? activeScene.imageAltEn : activeScene.imageAltVi}
                        initial={prefersReducedMotion ? false : { scale: 1.07 }}
                        animate={prefersReducedMotion ? undefined : { scale: 1 }}
                        transition={{ duration: 6.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-cover min-h-[240px]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
                      />

                      {/* Interactive Hotspots over Image */}
                      {activeScene.hotspots.map((hs, hIdx) => (
                        <div
                          key={hIdx}
                          style={{ left: `${hs.xPct}%`, top: `${hs.yPct}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        >
                          <div className="px-2 py-1 rounded-md bg-slate-950/90 border border-sky-400/60 text-[10px] font-semibold text-white shadow-md whitespace-nowrap">
                            {isEn ? hs.labelEn : hs.labelVi}
                          </div>
                        </div>
                      ))}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-200">
                        <span className="font-medium truncate">
                          {isEn ? activeScene.imageAltEn : activeScene.imageAltVi}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Staggered Copy & Direct Action */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="text-xs font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                    {isEn ? `Chapter ${activeScene.chapterNumber} / 06` : `Phần ${activeScene.chapterNumber} / 06`}
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug text-balance">
                    {isEn ? activeScene.titleEn : activeScene.titleVi}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn ? activeScene.subtitleEn : activeScene.subtitleVi}
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {(isEn ? activeScene.stepsEn : activeScene.stepsVi).map((line, sIdx) => (
                      <motion.div
                        key={sIdx}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.08 + sIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                      >
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 tabular-nums shrink-0 mt-0.5">
                          0{sIdx + 1}
                        </span>
                        <span>{line}</span>
                      </motion.div>
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
                    onClick={() => goToScene(0)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Restart Tour' : 'Xem lại từ đầu'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SCROLL-REVEAL SECTION 1: Step-by-Step Operational Architecture */}
      <ScrollReveal direction="up" className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Four Stages of an Interactive Study Session' : 'Cách một buổi học trên Synapse vận hành'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {isEn
              ? 'Each section below animates smoothly into view as you scroll down.'
              : 'Mỗi giai đoạn từ tiếp thu khái niệm đến thực hành mô phỏng và ôn tập đề thi được nối liền mạch.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01',
              titleVi: 'Chọn Lộ trình & Bài giảng',
              titleEn: 'Select Roadmap & Lesson',
              descVi: 'Tìm nhanh bài học theo khối lớp 9–12 hoặc theo dõi lộ trình cá nhân hóa.',
              descEn: 'Browse lectures across Grades 9–12 or follow your personalized track.',
              subject: 'roadmap' as SubjectType
            },
            {
              num: '02',
              titleVi: 'Thao tác Mô phỏng 2D/3D',
              titleEn: 'Run 2D/3D Simulations',
              descVi: 'Kéo thả 36 dụng cụ Vật lí, vẽ hàm Oxy/Oxyz hoặc truy vết từng dòng C++/Python.',
              descEn: 'Drag 36 lab tools, plot Oxy/Oxyz geometry, or trace C++/Python execution.',
              subject: 'physics_sims' as SubjectType
            },
            {
              num: '03',
              titleVi: 'Nghe Giảng & Video 3B1B',
              titleEn: 'Vietnamese Audio & 3B1B Video',
              descVi: 'Phát lời giảng tiếng Việt tự nhiên ngay trong bài học hoặc dựng video 3Blue1Brown.',
              descEn: 'Play Vietnamese audio narration or inspect 3Blue1Brown-style motion reels.',
              subject: 'math' as SubjectType
            },
            {
              num: '04',
              titleVi: 'Luyện Đề & Hỏi AI Theo Bước',
              titleEn: 'Exams & Step-Level AI',
              descVi: 'Dừng mô phỏng hỏi AI tại chỗ hoặc nộp ảnh bài làm để chấm thang điểm 0–10.',
              descEn: 'Pause simulations to question AI directly or submit exam photos for 0–10 grading.',
              subject: 'exams' as SubjectType
            }
          ].map((card, idx) => (
            <ScrollReveal key={card.num} direction="up" delay={idx * 0.08}>
              <button
                type="button"
                onClick={() => onNavigateSubject(card.subject)}
                className="w-full h-full text-left p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                    {card.num}
                  </div>
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    {isEn ? card.titleEn : card.titleVi}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? card.descEn : card.descVi}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span>{isEn ? 'Explore now' : 'Mở ngay'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      {/* SCROLL-REVEAL SECTION 2: Keyboard Shortcuts & Quick Tips */}
      <ScrollReveal direction="up" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
          {isEn ? 'Essential Shortcuts Inside Synapse' : 'Phím tắt nhanh trong toàn hệ thống'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { keys: 'Ctrl (trái) + D', labelVi: 'Mở nhanh Gia sư Toán', labelEn: 'Open Syn Math AI' },
            { keys: 'Ctrl (trái) + F', labelVi: 'Mở nhanh Gia sư Vật lí', labelEn: 'Open Syn Physics AI' },
            { keys: 'Ctrl (trái) + G', labelVi: 'Mở nhanh Gia sư Tin học', labelEn: 'Open Syn Code AI' },
            { keys: 'Alt + Space', labelVi: 'Bật / Tắt Voice OS', labelEn: 'Toggle Voice OS' }
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
