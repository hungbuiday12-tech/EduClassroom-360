import React, { useMemo, useState } from 'react';
import { Maximize2, Minimize2, PenTool } from 'lucide-react';
import { ExamQuestion, ExamSubject } from '../../types';

export type ExamDiagramKind =
  | 'math_circle_triangle'
  | 'math_right_triangle_metric'
  | 'math_3d_pyramid'
  | 'math_3d_sphere_oxyz'
  | 'math_func_graph'
  | 'physics_incline_mechanics'
  | 'physics_oscillator'
  | 'physics_waves'
  | 'physics_rlc_circuit'
  | 'physics_optics'
  | 'physics_field_atom'
  | 'cs_graph'
  | 'cs_tree'
  | 'cs_array_dp';

export interface DetectedDiagramInfo {
  kind: ExamDiagramKind;
  titleVi: string;
  titleEn: string;
  captionVi: string;
  captionEn: string;
}

export function detectQuestionDiagram(
  question: ExamQuestion,
  subject: ExamSubject
): DetectedDiagramInfo | null {
  const text = `${question.number} ${question.content} ${question.solution} ${(question.keyFormulasOrHints || []).join(' ')}`.toLowerCase();

  if (subject === 'math') {
    if (
      text.includes('oxyz') ||
      text.includes('mặt cầu') ||
      text.includes('mặt phẳng (p)') ||
      (text.includes('tâm i') && text.includes('bán kính r'))
    ) {
      return {
        kind: 'math_3d_sphere_oxyz',
        titleVi: 'Hình vẽ không gian Oxyz & Mặt cầu cắt mặt phẳng',
        titleEn: 'Oxyz Sphere & Plane Cross-Section Diagram',
        captionVi: 'Minh họa hệ trục Oxyz, mặt cầu (S) tâm I, mặt phẳng (P) và đường tròn giao tuyến tâm H: R² = d² + r².',
        captionEn: 'Illustrates Oxyz axes, sphere center I, cutting plane (P), and intersection circle with R² = d² + r².'
      };
    }
    if (
      text.includes('hình chóp') ||
      text.includes('lăng trụ') ||
      text.includes('tứ diện') ||
      text.includes('s.abcd') ||
      text.includes('s.abc')
    ) {
      return {
        kind: 'math_3d_pyramid',
        titleVi: 'Hình vẽ Hình học Không gian (Hình chóp & Đường cao)',
        titleEn: '3D Spatial Pyramid & Altitude Diagram',
        captionVi: 'Minh họa hình chóp S.ABCD, đường cao SH vuông góc mặt đáy, xác định góc và khoảng cách.',
        captionEn: 'Illustrates pyramid S.ABCD with altitude SH perpendicular to base for angle & distance calculations.'
      };
    }
    if (
      text.includes('đường tròn') ||
      text.includes('nội tiếp') ||
      text.includes('tiếp tuyến') ||
      text.includes('trực tâm') ||
      text.includes('tứ giác nội tiếp') ||
      text.includes('đường cao ad') ||
      text.includes('simson') ||
      text.includes('euler')
    ) {
      return {
        kind: 'math_circle_triangle',
        titleVi: 'Hình vẽ Đường tròn ngoại tiếp & Tam giác ABC',
        titleEn: 'Circumcircle & Triangle Geometry Figure',
        captionVi: 'Minh họa △ABC nội tiếp (O), trực tâm H, các đường cao AD, BE, CF và trung điểm M của BC.',
        captionEn: 'Illustrates acute △ABC inscribed in (O), orthocenter H, altitudes AD, BE, CF, and midpoint M of BC.'
      };
    }
    if (
      text.includes('vuông tại a') ||
      text.includes('hệ thức lượng') ||
      text.includes('tam giác abc') ||
      text.includes('hình thang') ||
      text.includes('hình bình hành')
    ) {
      return {
        kind: 'math_right_triangle_metric',
        titleVi: 'Hình vẽ Tam giác & Đường cao',
        titleEn: 'Triangle & Altitude Diagram',
        captionVi: 'Minh họa △ABC vuông tại A (AB < AC), đường cao AH = h, hình chiếu BH = c′, CH = b′.',
        captionEn: 'Illustrates right △ABC at A (AB < AC), altitude AH = h, and projections BH = c′, CH = b′.'
      };
    }
    if (
      text.includes('đồ thị') ||
      text.includes('tiệm cận') ||
      text.includes('cực trị') ||
      text.includes('tích phân') ||
      text.includes('diện tích hình phẳng') ||
      text.includes('parabol')
    ) {
      return {
        kind: 'math_func_graph',
        titleVi: 'Đồ thị hàm số & Miền hình phẳng Oxy',
        titleEn: 'Function Curve & Shaded Region on Oxy',
        captionVi: 'Minh họa đồ thị y = f(x), điểm cực trị và miền diện tích giới hạn trên hệ trục Oxy.',
        captionEn: 'Illustrates curve y = f(x), extrema points, and bounded integration region on Oxy.'
      };
    }
  }

  if (subject === 'physics') {
    if (
      text.includes('rlc') ||
      text.includes('mạch điện') ||
      text.includes('cuộn cảm') ||
      text.includes('tụ điện') ||
      text.includes('cộng hưởng') ||
      text.includes('điện trở') ||
      text.includes('suất điện động')
    ) {
      return {
        kind: 'physics_rlc_circuit',
        titleVi: 'Sơ đồ mạch điện R-L-C & Giản đồ Vectơ Fresnel',
        titleEn: 'R-L-C Circuit & Fresnel Phasor Diagram',
        captionVi: 'Sơ đồ mắc nối tiếp R-L-C kèm giản đồ pha U_R, U_L, U_C và góc lệch pha φ.',
        captionEn: 'Series R-L-C schematic paired with Fresnel phasor diagram for U_R, U_L, U_C and phase φ.'
      };
    }
    if (
      text.includes('giao thoa') ||
      text.includes('sóng dừng') ||
      text.includes('sóng cơ') ||
      text.includes('bước sóng') ||
      text.includes('nguồn s') ||
      text.includes('cực đại')
    ) {
      return {
        kind: 'physics_waves',
        titleVi: 'Hình vẽ Giao thoa sóng & Bụng/Nút sóng dừng',
        titleEn: 'Wave Interference & Standing Wave Pattern',
        captionVi: 'Minh họa hai nguồn S₁, S₂ phát sóng giao thoa với các vân cực đại/cực tiểu và biên độ sóng.',
        captionEn: 'Illustrates coherent wave sources S₁, S₂, interference fringes, and nodal spacing.'
      };
    }
    if (
      text.includes('con lắc') ||
      text.includes('lò xo') ||
      text.includes('dao động điều hòa') ||
      text.includes('biên độ') ||
      text.includes('tần số góc')
    ) {
      return {
        kind: 'physics_oscillator',
        titleVi: 'Hình vẽ Con lắc lò xo & Quỹ đạo dao động điều hòa',
        titleEn: 'Spring-Mass Oscillator & Harmonic Axis Diagram',
        captionVi: 'Minh họa hệ vật m gắn lò xo độ cứng k dao động quanh VTCB O từ -A đến +A.',
        captionEn: 'Illustrates spring-mass system (k, m) oscillating symmetrically around equilibrium O between ±A.'
      };
    }
    if (
      text.includes('thấu kính') ||
      text.includes('lăng kính') ||
      text.includes('khúc xạ') ||
      text.includes('gương') ||
      text.includes('quang học') ||
      text.includes('young')
    ) {
      return {
        kind: 'physics_optics',
        titleVi: 'Sơ đồ Quang hình (Thấu kính hội tụ & Đường truyền tia sáng)',
        titleEn: 'Geometrical Optics Ray Diagram',
        captionVi: 'Đường truyền 3 tia đặc biệt qua quang tâm O và tiêu điểm F, F′ tạo ảnh A′B′ của vật AB.',
        captionEn: 'Principal optical rays through center O and focal points F, F′ forming image A′B′.'
      };
    }
    if (
      text.includes('mặt phẳng nghiêng') ||
      text.includes('ròng rọc') ||
      text.includes('ma sát') ||
      text.includes('ném xiên') ||
      text.includes('ném ngang') ||
      text.includes('lực hấp dẫn') ||
      text.includes('động lượng') ||
      text.includes('va chạm')
    ) {
      return {
        kind: 'physics_incline_mechanics',
        titleVi: 'Hình phân tích Lực cơ học trên Mặt phẳng nghiêng',
        titleEn: 'Mechanics Force Vector Diagram',
        captionVi: 'Phân tích các vectơ trọng lực P, phản lực N, ma sát F_ms và góc nghiêng α.',
        captionEn: 'Free-body decomposition of gravity P, normal force N, friction F_ms on angle α.'
      };
    }
    if (
      text.includes('lorentz') ||
      text.includes('từ trường') ||
      text.includes('cảm ứng từ') ||
      text.includes('điện tích') ||
      text.includes('bohr') ||
      text.includes('quang điện') ||
      text.includes('hạt nhân')
    ) {
      return {
        kind: 'physics_field_atom',
        titleVi: 'Hình vẽ Quỹ đạo hạt trong Từ trường B & Mức năng lượng',
        titleEn: 'Magnetic Field Trajectory & Energy Levels',
        captionVi: 'Lực Lorentz F = |q|vB hướng tâm làm hạt tích điện chuyển động tròn bán kính R = mv/(|q|B).',
        captionEn: 'Centripetal Lorentz force guiding charged particle along circular radius R = mv/(|q|B).'
      };
    }
  }

  if (subject === 'cs') {
    if (
      text.includes('đồ thị') ||
      text.includes('dijkstra') ||
      text.includes('bfs') ||
      text.includes('dfs') ||
      text.includes('cạnh') ||
      text.includes('đỉnh') ||
      text.includes('kruskal') ||
      text.includes('topo')
    ) {
      return {
        kind: 'cs_graph',
        titleVi: 'Sơ đồ Đồ thị có trọng số & Đường đi ngắn nhất',
        titleEn: 'Weighted Graph & Shortest Path Diagram',
        captionVi: 'Minh họa các đỉnh 1..5, cạnh có trọng số và đường đi tối ưu được chọn.',
        captionEn: 'Illustrates weighted vertices 1..5 and highlighted optimal traversal path.'
      };
    }
    if (
      text.includes('cây') ||
      text.includes('nhị phân') ||
      text.includes('lca') ||
      text.includes('segment tree') ||
      text.includes('trie') ||
      text.includes('heap')
    ) {
      return {
        kind: 'cs_tree',
        titleVi: 'Sơ đồ Cây phân cấp & Cấu trúc Nút cha-con',
        titleEn: 'Hierarchical Tree Data Structure',
        captionVi: 'Minh họa gốc Root, các nút trung gian và nút lá phục vụ duyệt cây / Segment Tree.',
        captionEn: 'Illustrates Root, internal nodes, and leaves for tree traversal / queries.'
      };
    }
    if (
      text.includes('quy hoạch động') ||
      text.includes('mảng') ||
      text.includes('dãy con') ||
      text.includes('cộng dồn') ||
      text.includes('ngăn xếp') ||
      text.includes('tìm kiếm nhị phân') ||
      text.includes('ma trận')
    ) {
      return {
        kind: 'cs_array_dp',
        titleVi: 'Sơ đồ Mảng DP / Hai con trỏ & Bảng chuyển trạng thái',
        titleEn: 'DP Array & Two-Pointer State Diagram',
        captionVi: 'Minh họa chỉ số i, j, cập nhật bảng dp[i] và cửa sổ trượt trên dãy số.',
        captionEn: 'Illustrates array indices, DP state transitions, and sliding window range.'
      };
    }
  }

  return null;
}

interface ExamQuestionDiagramProps {
  question: ExamQuestion;
  subject: ExamSubject;
  isEn: boolean;
}

export const ExamQuestionDiagram: React.FC<ExamQuestionDiagramProps> = ({
  question,
  subject,
  isEn
}) => {
  const [expanded, setExpanded] = useState(false);

  const info = useMemo(
    () => detectQuestionDiagram(question, subject),
    [question, subject]
  );

  if (!info) return null;

  const renderSvg = () => {
    switch (info.kind) {
      case 'math_circle_triangle':
        return (
          <svg viewBox="0 0 360 230" className="w-full h-full">
            <circle cx="180" cy="115" r="88" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="1.8" />
            <circle cx="180" cy="115" r="3" fill="#3b82f6" />
            <text x="186" y="114" fill="#3b82f6" fontSize="11" fontWeight="700">O</text>
            {/* Triangle ABC (AB < AC) */}
            <polygon points="145,35 102,162 258,162" fill="rgba(16,185,129,0.08)" stroke="#0f172a" className="dark:stroke-slate-100" strokeWidth="2" />
            {/* Altitudes */}
            <line x1="145" y1="35" x2="145" y2="162" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="102" y1="162" x2="213" y2="111" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="4 3" />
            <line x1="258" y1="162" x2="122" y2="102" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="4 3" />
            {/* Segment EF */}
            <line x1="122" y1="102" x2="213" y2="111" stroke="#ec4899" strokeWidth="1.5" />
            {/* Right angle at D */}
            <rect x="145" y="153" width="8" height="9" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
            {/* Points */}
            <circle cx="145" cy="35" r="3.2" fill="#0ea5e9" />
            <text x="141" y="26" fill="currentColor" fontSize="12" fontWeight="700">A</text>
            <circle cx="102" cy="162" r="3.2" fill="#0ea5e9" />
            <text x="86" y="172" fill="currentColor" fontSize="12" fontWeight="700">B</text>
            <circle cx="258" cy="162" r="3.2" fill="#0ea5e9" />
            <text x="264" y="172" fill="currentColor" fontSize="12" fontWeight="700">C</text>
            <circle cx="145" cy="162" r="2.8" fill="#f59e0b" />
            <text x="141" y="177" fill="#d97706" fontSize="11" fontWeight="700">D</text>
            <circle cx="213" cy="111" r="2.8" fill="#ec4899" />
            <text x="220" y="112" fill="#db2777" fontSize="11" fontWeight="700">E</text>
            <circle cx="122" cy="102" r="2.8" fill="#ec4899" />
            <text x="108" y="101" fill="#db2777" fontSize="11" fontWeight="700">F</text>
            <circle cx="145" cy="142" r="3.4" fill="#ef4444" />
            <text x="151" y="140" fill="#ef4444" fontSize="11" fontWeight="800">H</text>
            <circle cx="180" cy="162" r="2.8" fill="#10b981" />
            <text x="176" y="177" fill="#059669" fontSize="11" fontWeight="700">M</text>
          </svg>
        );

      case 'math_right_triangle_metric':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            <polygon points="120,46 62,168 296,168" fill="rgba(59,130,246,0.08)" stroke="currentColor" strokeWidth="2" />
            <line x1="120" y1="46" x2="120" y2="168" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" />
            {/* Right angles at A and H */}
            <path d="M 111 65 L 129 73 L 138 55" fill="none" stroke="#3b82f6" strokeWidth="1.4" />
            <rect x="120" y="158" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1.3" />
            <text x="115" y="36" fill="currentColor" fontSize="12" fontWeight="800">A</text>
            <text x="48" y="176" fill="currentColor" fontSize="12" fontWeight="800">B</text>
            <text x="302" y="176" fill="currentColor" fontSize="12" fontWeight="800">C</text>
            <text x="115" y="185" fill="#d97706" fontSize="12" fontWeight="800">H</text>
            <text x="72" y="104" fill="#0ea5e9" fontSize="11" fontWeight="700">c</text>
            <text x="210" y="100" fill="#0ea5e9" fontSize="11" fontWeight="700">b</text>
            <text x="125" y="114" fill="#d97706" fontSize="11" fontWeight="700">h</text>
            <text x="86" y="184" fill="#10b981" fontSize="11" fontWeight="700">c′</text>
            <text x="206" y="184" fill="#10b981" fontSize="11" fontWeight="700">b′</text>
            <text x="174" y="203" fill="#64748b" fontSize="11" fontWeight="700">a = b′ + c′</text>
          </svg>
        );

      case 'math_3d_pyramid':
        return (
          <svg viewBox="0 0 360 230" className="w-full h-full">
            {/* Base parallelogram ABCD */}
            <line x1="88" y1="145" x2="178" y2="122" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.55" />
            <line x1="178" y1="122" x2="292" y2="145" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.55" />
            <line x1="88" y1="145" x2="200" y2="188" stroke="currentColor" strokeWidth="2" />
            <line x1="200" y1="188" x2="292" y2="145" stroke="currentColor" strokeWidth="2" />
            {/* Diagonals */}
            <line x1="88" y1="145" x2="292" y2="145" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="178" y1="122" x2="200" y2="188" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            {/* Altitude SH */}
            <line x1="189" y1="34" x2="189" y2="152" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 3" />
            {/* Slant edges */}
            <line x1="189" y1="34" x2="178" y2="122" stroke="currentColor" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.6" />
            <line x1="189" y1="34" x2="88" y2="145" stroke="currentColor" strokeWidth="2" />
            <line x1="189" y1="34" x2="200" y2="188" stroke="currentColor" strokeWidth="2" />
            <line x1="189" y1="34" x2="292" y2="145" stroke="currentColor" strokeWidth="2" />
            <rect x="189" y="142" width="8" height="10" fill="none" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="189" cy="34" r="3.4" fill="#3b82f6" />
            <text x="186" y="24" fill="#3b82f6" fontSize="12" fontWeight="800">S</text>
            <text x="166" y="117" fill="currentColor" fontSize="11" fontWeight="700">A</text>
            <text x="72" y="150" fill="currentColor" fontSize="11" fontWeight="700">B</text>
            <text x="196" y="206" fill="currentColor" fontSize="11" fontWeight="700">C</text>
            <text x="298" y="150" fill="currentColor" fontSize="11" fontWeight="700">D</text>
            <circle cx="189" cy="152" r="2.8" fill="#f59e0b" />
            <text x="196" y="156" fill="#d97706" fontSize="11" fontWeight="700">H</text>
          </svg>
        );

      case 'math_3d_sphere_oxyz':
        return (
          <svg viewBox="0 0 360 230" className="w-full h-full">
            {/* Plane P */}
            <polygon points="62,158 134,126 306,126 234,188 62,188" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.5" />
            <text x="285" y="144" fill="#10b981" fontSize="11" fontWeight="700">(P)</text>
            {/* Sphere */}
            <circle cx="184" cy="100" r="68" fill="rgba(59,130,246,0.07)" stroke="#3b82f6" strokeWidth="1.8" />
            <ellipse cx="184" cy="100" rx="68" ry="18" fill="none" stroke="#3b82f6" strokeWidth="1.1" strokeDasharray="4 4" opacity="0.6" />
            {/* Intersection circle */}
            <ellipse cx="184" cy="152" rx="44" ry="12" fill="rgba(245,158,11,0.14)" stroke="#f59e0b" strokeWidth="1.8" />
            {/* Right triangle IHM */}
            <line x1="184" y1="100" x2="184" y2="152" stroke="#ef4444" strokeWidth="1.8" />
            <line x1="184" y1="152" x2="228" y2="152" stroke="#f59e0b" strokeWidth="1.6" />
            <line x1="184" y1="100" x2="228" y2="152" stroke="#3b82f6" strokeWidth="1.6" />
            <rect x="184" y="143" width="8" height="9" fill="none" stroke="#ef4444" strokeWidth="1.1" />
            <circle cx="184" cy="100" r="3.4" fill="#3b82f6" />
            <text x="172" y="96" fill="#3b82f6" fontSize="12" fontWeight="800">I</text>
            <circle cx="184" cy="152" r="2.8" fill="#ef4444" />
            <text x="170" y="164" fill="#ef4444" fontSize="11" fontWeight="700">H</text>
            <text x="233" y="156" fill="#d97706" fontSize="11" fontWeight="700">M</text>
            <text x="169" y="130" fill="#ef4444" fontSize="10" fontWeight="700">d</text>
            <text x="210" y="122" fill="#3b82f6" fontSize="10" fontWeight="700">R</text>
            <text x="204" y="165" fill="#d97706" fontSize="10" fontWeight="700">r</text>
          </svg>
        );

      case 'math_func_graph':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            {/* Grid */}
            <line x1="35" y1="138" x2="325" y2="138" stroke="currentColor" strokeWidth="1.5" />
            <line x1="155" y1="20" x2="155" y2="200" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="325,138 318,134 318,142" fill="currentColor" />
            <polygon points="155,20 151,27 159,27" fill="currentColor" />
            <text x="320" y="154" fill="currentColor" fontSize="11" fontWeight="700">x</text>
            <text x="162" y="28" fill="currentColor" fontSize="11" fontWeight="700">y</text>
            <text x="142" y="152" fill="currentColor" fontSize="11" fontWeight="700">O</text>
            {/* Shaded integral region */}
            <path d="M 155 138 L 155 72 Q 198 44 235 128 L 235 138 Z" fill="rgba(14,165,233,0.18)" />
            {/* Smooth cubic curve */}
            <path d="M 55 190 C 95 62, 140 50, 180 104 C 218 156, 255 152, 298 32" fill="none" stroke="#0ea5e9" strokeWidth="2.4" />
            <circle cx="116" cy="72" r="3.4" fill="#ef4444" />
            <text x="103" y="62" fill="#ef4444" fontSize="10" fontWeight="700">CĐ</text>
            <circle cx="242" cy="142" r="3.4" fill="#10b981" />
            <text x="242" y="158" fill="#10b981" fontSize="10" fontWeight="700">CT</text>
            <text x="200" y="96" fill="#0284c7" fontSize="11" fontWeight="700">y = f(x)</text>
          </svg>
        );

      case 'physics_incline_mechanics':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            <polygon points="48,180 302,180 302,68" fill="rgba(148,163,184,0.15)" stroke="currentColor" strokeWidth="2" />
            <text x="92" y="172" fill="#3b82f6" fontSize="11" fontWeight="700">α</text>
            {/* Block */}
            <g transform="translate(185,112) rotate(-23.8)">
              <rect x="-22" y="-16" width="44" height="32" rx="4" fill="rgba(59,130,246,0.22)" stroke="#3b82f6" strokeWidth="2" />
              <text x="-5" y="4" fill="currentColor" fontSize="11" fontWeight="800">m</text>
              {/* Normal force N */}
              <line x1="0" y1="0" x2="0" y2="-56" stroke="#10b981" strokeWidth="2.2" />
              <polygon points="0,-60 -4,-51 4,-51" fill="#10b981" />
              <text x="6" y="-52" fill="#10b981" fontSize="11" fontWeight="800">N</text>
              {/* Friction F_ms */}
              <line x1="0" y1="0" x2="54" y2="0" stroke="#f59e0b" strokeWidth="2.2" />
              <polygon points="58,0 49,-4 49,4" fill="#f59e0b" />
              <text x="42" y="-8" fill="#d97706" fontSize="10" fontWeight="800">F_ms</text>
            </g>
            {/* Gravity P straight down */}
            <line x1="185" y1="112" x2="185" y2="178" stroke="#ef4444" strokeWidth="2.2" />
            <polygon points="185,182 181,173 189,173" fill="#ef4444" />
            <text x="191" y="174" fill="#ef4444" fontSize="11" fontWeight="800">P = mg</text>
          </svg>
        );

      case 'physics_oscillator':
        return (
          <svg viewBox="0 0 360 210" className="w-full h-full">
            {/* Wall */}
            <line x1="42" y1="54" x2="42" y2="132" stroke="currentColor" strokeWidth="3" />
            {/* Spring coils */}
            <polyline
              points="42,92 62,92 70,76 82,108 94,76 106,108 118,76 130,108 142,76 154,108 162,92 178,92"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.2"
            />
            <text x="102" y="64" fill="#0ea5e9" fontSize="11" fontWeight="700">k</text>
            {/* Mass */}
            <rect x="178" y="68" width="46" height="48" rx="6" fill="rgba(59,130,246,0.22)" stroke="#3b82f6" strokeWidth="2" />
            <text x="195" y="96" fill="currentColor" fontSize="12" fontWeight="800">m</text>
            {/* Ox Axis */}
            <line x1="90" y1="158" x2="318" y2="158" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="318,158 310,154 310,162" fill="currentColor" />
            <circle cx="132" cy="158" r="3" fill="#ef4444" />
            <circle cx="201" cy="158" r="3.5" fill="#10b981" />
            <circle cx="270" cy="158" r="3" fill="#ef4444" />
            <text x="122" y="177" fill="#ef4444" fontSize="11" fontWeight="700">-A</text>
            <text x="196" y="177" fill="#10b981" fontSize="11" fontWeight="800">O</text>
            <text x="262" y="177" fill="#ef4444" fontSize="11" fontWeight="700">+A</text>
            <text x="322" y="162" fill="currentColor" fontSize="11" fontWeight="700">x</text>
          </svg>
        );

      case 'physics_waves':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            <line x1="80" y1="110" x2="280" y2="110" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 3" />
            {/* Wavefronts from S1 and S2 */}
            {[28, 52, 76, 100].map((r, i) => (
              <React.Fragment key={i}>
                <circle cx="115" cy="110" r={r} fill="none" stroke="#0ea5e9" strokeWidth="1.2" opacity="0.65" />
                <circle cx="245" cy="110" r={r} fill="none" stroke="#10b981" strokeWidth="1.2" opacity="0.65" />
              </React.Fragment>
            ))}
            {/* Central maximum */}
            <line x1="180" y1="22" x2="180" y2="198" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="5 3" />
            <circle cx="115" cy="110" r="4" fill="#0ea5e9" />
            <circle cx="245" cy="110" r="4" fill="#10b981" />
            <circle cx="212" cy="52" r="3.4" fill="#f59e0b" />
            <line x1="115" y1="110" x2="212" y2="52" stroke="#f59e0b" strokeWidth="1.4" />
            <line x1="245" y1="110" x2="212" y2="52" stroke="#f59e0b" strokeWidth="1.4" />
            <text x="102" y="128" fill="#0284c7" fontSize="11" fontWeight="800">S₁</text>
            <text x="245" y="128" fill="#059669" fontSize="11" fontWeight="800">S₂</text>
            <text x="218" y="49" fill="#d97706" fontSize="11" fontWeight="800">M (d₂ - d₁ = kλ)</text>
          </svg>
        );

      case 'physics_rlc_circuit':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            {/* Left: Series R-L-C loop */}
            <rect x="26" y="45" width="170" height="125" fill="none" stroke="currentColor" strokeWidth="1.6" />
            {/* Resistor R */}
            <rect x="46" y="36" width="38" height="18" fill="#f8fafc" className="dark:fill-slate-900" stroke="#3b82f6" strokeWidth="1.8" />
            <text x="60" y="49" fill="#3b82f6" fontSize="10" fontWeight="800">R</text>
            {/* Inductor L */}
            <path d="M 100 45 Q 106 32 112 45 Q 118 32 124 45 Q 130 32 136 45" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
            <text x="114" y="28" fill="#d97706" fontSize="10" fontWeight="800">L</text>
            {/* Capacitor C */}
            <line x1="158" y1="34" x2="158" y2="56" stroke="#10b981" strokeWidth="2.4" />
            <line x1="166" y1="34" x2="166" y2="56" stroke="#10b981" strokeWidth="2.4" />
            <text x="158" y="28" fill="#059669" fontSize="10" fontWeight="800">C</text>
            {/* AC Source */}
            <circle cx="111" cy="170" r="14" fill="#f8fafc" className="dark:fill-slate-900" stroke="#8b5cf6" strokeWidth="1.8" />
            <text x="103" y="174" fill="#7c3aed" fontSize="11" fontWeight="800">~u</text>

            {/* Right: Fresnel Phasors */}
            <line x1="230" y1="125" x2="335" y2="125" stroke="#3b82f6" strokeWidth="2" />
            <text x="322" y="140" fill="#3b82f6" fontSize="10" fontWeight="800">U_R, I</text>
            <line x1="230" y1="125" x2="230" y2="48" stroke="#f59e0b" strokeWidth="2" />
            <text x="236" y="54" fill="#d97706" fontSize="10" fontWeight="800">U_L</text>
            <line x1="230" y1="125" x2="230" y2="178" stroke="#10b981" strokeWidth="2" />
            <text x="236" y="182" fill="#059669" fontSize="10" fontWeight="800">U_C</text>
            <line x1="230" y1="125" x2="318" y2="75" stroke="#ef4444" strokeWidth="2.2" />
            <text x="310" y="70" fill="#ef4444" fontSize="11" fontWeight="800">U (φ)</text>
          </svg>
        );

      case 'physics_optics':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            {/* Optical axis */}
            <line x1="24" y1="115" x2="336" y2="115" stroke="currentColor" strokeWidth="1.3" strokeDasharray="5 3" />
            {/* Converging lens */}
            <line x1="180" y1="35" x2="180" y2="195" stroke="#0ea5e9" strokeWidth="2.4" />
            <polygon points="180,30 175,40 185,40" fill="#0ea5e9" />
            <polygon points="180,200 175,190 185,190" fill="#0ea5e9" />
            <text x="186" y="128" fill="#0284c7" fontSize="11" fontWeight="800">O</text>
            {/* Foci */}
            <circle cx="128" cy="115" r="2.8" fill="#ef4444" />
            <text x="124" y="130" fill="#ef4444" fontSize="11" fontWeight="700">F</text>
            <circle cx="232" cy="115" r="2.8" fill="#ef4444" />
            <text x="229" y="130" fill="#ef4444" fontSize="11" fontWeight="700">F′</text>
            {/* Object AB */}
            <line x1="78" y1="115" x2="78" y2="72" stroke="#10b981" strokeWidth="2.4" />
            <polygon points="78,68 74,77 82,77" fill="#10b981" />
            <text x="64" y="128" fill="#059669" fontSize="11" fontWeight="800">A</text>
            <text x="64" y="72" fill="#059669" fontSize="11" fontWeight="800">B</text>
            {/* Rays */}
            <line x1="78" y1="72" x2="180" y2="72" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="180" y1="72" x2="294" y2="164" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="78" y1="72" x2="294" y2="164" stroke="#8b5cf6" strokeWidth="1.5" />
            {/* Image A'B' */}
            <line x1="285" y1="115" x2="285" y2="156" stroke="#ef4444" strokeWidth="2.4" />
            <polygon points="285,161 281,152 289,152" fill="#ef4444" />
            <text x="288" y="110" fill="#ef4444" fontSize="11" fontWeight="800">A′</text>
            <text x="288" y="168" fill="#ef4444" fontSize="11" fontWeight="800">B′</text>
          </svg>
        );

      case 'physics_field_atom':
        return (
          <svg viewBox="0 0 360 220" className="w-full h-full">
            <rect x="44" y="26" width="272" height="168" rx="14" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="1.4" strokeDasharray="4 4" />
            <text x="58" y="48" fill="#3b82f6" fontSize="12" fontWeight="800">⊗ B (Từ trường đều)</text>
            <circle cx="180" cy="112" r="56" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="180" cy="112" r="3" fill="#3b82f6" />
            <line x1="180" y1="112" x2="236" y2="112" stroke="#ef4444" strokeWidth="1.8" />
            <polygon points="184,112 193,108 193,116" fill="#ef4444" />
            <text x="194" y="106" fill="#ef4444" fontSize="10" fontWeight="800">F_L</text>
            <circle cx="236" cy="112" r="5" fill="#f59e0b" />
            <line x1="236" y1="112" x2="236" y2="62" stroke="#0ea5e9" strokeWidth="2" />
            <polygon points="236,58 232,67 240,67" fill="#0ea5e9" />
            <text x="244" y="70" fill="#0284c7" fontSize="11" fontWeight="800">v</text>
            <text x="246" y="116" fill="#d97706" fontSize="11" fontWeight="800">q</text>
          </svg>
        );

      case 'cs_graph':
        return (
          <svg viewBox="0 0 360 215" className="w-full h-full">
            {/* Edges */}
            <line x1="65" y1="108" x2="150" y2="48" stroke="#10b981" strokeWidth="2.8" />
            <line x1="65" y1="108" x2="155" y2="168" stroke="#94a3b8" strokeWidth="1.8" />
            <line x1="150" y1="48" x2="255" y2="55" stroke="#10b981" strokeWidth="2.8" />
            <line x1="150" y1="48" x2="155" y2="168" stroke="#94a3b8" strokeWidth="1.6" />
            <line x1="155" y1="168" x2="255" y2="162" stroke="#94a3b8" strokeWidth="1.6" />
            <line x1="255" y1="55" x2="305" y2="108" stroke="#10b981" strokeWidth="2.8" />
            <line x1="255" y1="162" x2="305" y2="108" stroke="#94a3b8" strokeWidth="1.8" />
            {/* Weights */}
            <text x="96" y="72" fill="#059669" fontSize="11" fontWeight="800">4</text>
            <text x="102" y="150" fill="#64748b" fontSize="11" fontWeight="700">9</text>
            <text x="200" y="42" fill="#059669" fontSize="11" fontWeight="800">3</text>
            <text x="159" y="112" fill="#64748b" fontSize="11" fontWeight="700">2</text>
            <text x="202" y="180" fill="#64748b" fontSize="11" fontWeight="700">5</text>
            <text x="285" y="74" fill="#059669" fontSize="11" fontWeight="800">2</text>
            <text x="286" y="148" fill="#64748b" fontSize="11" fontWeight="700">7</text>
            {/* Vertices */}
            {[
              { x: 65, y: 108, label: '1', active: true },
              { x: 150, y: 48, label: '2', active: true },
              { x: 155, y: 168, label: '3', active: false },
              { x: 255, y: 55, label: '4', active: true },
              { x: 255, y: 162, label: '5', active: false },
              { x: 305, y: 108, label: '6', active: true }
            ].map((v) => (
              <g key={v.label}>
                <circle
                  cx={v.x}
                  cy={v.y}
                  r="16"
                  fill={v.active ? '#10b981' : '#334155'}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text x={v.x - 4} y={v.y + 4} fill="#ffffff" fontSize="12" fontWeight="800">
                  {v.label}
                </text>
              </g>
            ))}
          </svg>
        );

      case 'cs_tree':
        return (
          <svg viewBox="0 0 360 215" className="w-full h-full">
            <line x1="180" y1="40" x2="105" y2="98" stroke="#64748b" strokeWidth="2" />
            <line x1="180" y1="40" x2="255" y2="98" stroke="#64748b" strokeWidth="2" />
            <line x1="105" y1="98" x2="62" y2="162" stroke="#64748b" strokeWidth="1.8" />
            <line x1="105" y1="98" x2="145" y2="162" stroke="#64748b" strokeWidth="1.8" />
            <line x1="255" y1="98" x2="215" y2="162" stroke="#64748b" strokeWidth="1.8" />
            <line x1="255" y1="98" x2="298" y2="162" stroke="#64748b" strokeWidth="1.8" />
            {[
              { x: 180, y: 40, label: '1', color: '#3b82f6' },
              { x: 105, y: 98, label: '2', color: '#0ea5e9' },
              { x: 255, y: 98, label: '3', color: '#0ea5e9' },
              { x: 62, y: 162, label: '4', color: '#10b981' },
              { x: 145, y: 162, label: '5', color: '#10b981' },
              { x: 215, y: 162, label: '6', color: '#10b981' },
              { x: 298, y: 162, label: '7', color: '#10b981' }
            ].map((n) => (
              <g key={n.label}>
                <circle cx={n.x} cy={n.y} r="16" fill={n.color} stroke="#ffffff" strokeWidth="2" />
                <text x={n.x - 4} y={n.y + 4} fill="#ffffff" fontSize="12" fontWeight="800">
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        );

      case 'cs_array_dp':
      default:
        return (
          <svg viewBox="0 0 360 190" className="w-full h-full">
            {[
              { i: 0, v: '3', dp: '3' },
              { i: 1, v: '1', dp: '4' },
              { i: 2, v: '4', dp: '8', active: true },
              { i: 3, v: '2', dp: '10', active: true },
              { i: 4, v: '5', dp: '15', active: true },
              { i: 5, v: '2', dp: '17' }
            ].map((cell) => {
              const x = 36 + cell.i * 48;
              return (
                <g key={cell.i}>
                  <rect
                    x={x}
                    y={44}
                    width={46}
                    height={36}
                    rx="4"
                    fill={cell.active ? 'rgba(16,185,129,0.22)' : 'rgba(59,130,246,0.1)'}
                    stroke={cell.active ? '#10b981' : '#3b82f6'}
                    strokeWidth="1.6"
                  />
                  <text x={x + 19} y={67} fill="currentColor" fontSize="13" fontWeight="800">
                    {cell.v}
                  </text>
                  <rect
                    x={x}
                    y={104}
                    width={46}
                    height={32}
                    rx="4"
                    fill="rgba(245,158,11,0.12)"
                    stroke="#f59e0b"
                    strokeWidth="1.4"
                  />
                  <text x={x + 15} y={124} fill="#d97706" fontSize="11" fontWeight="800">
                    {cell.dp}
                  </text>
                </g>
              );
            })}
            <text x="36" y="34" fill="#3b82f6" fontSize="11" fontWeight="800">A[i]</text>
            <text x="36" y="96" fill="#d97706" fontSize="11" fontWeight="800">dp[i] / Prefix[i]</text>
            <text x="150" y="164" fill="#10b981" fontSize="11" fontWeight="700">L = 2 → R = 4</text>
          </svg>
        );
    }
  };

  return (
    <div className="rounded-xl border border-sky-200 dark:border-sky-800/70 bg-white dark:bg-slate-950/80 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-extrabold text-sky-700 dark:text-sky-300">
          <PenTool className="w-3.5 h-3.5 shrink-0" />
          <span>{isEn ? info.titleEn : info.titleVi}</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{expanded ? (isEn ? 'Compact' : 'Thu nhỏ') : isEn ? 'Zoom Figure' : 'Phóng to hình'}</span>
        </button>
      </div>

      <div
        className={`w-full mx-auto rounded-lg bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-2 text-slate-800 dark:text-slate-100 transition-all ${
          expanded ? 'max-w-xl h-72' : 'max-w-md h-48'
        }`}
      >
        {renderSvg()}
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
        {isEn ? info.captionEn : info.captionVi}
      </p>
    </div>
  );
};
