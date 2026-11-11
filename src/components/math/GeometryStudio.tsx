import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Move,
  Maximize2,
  HelpCircle,
  Eye,
  CheckCircle2,
  Box,
  Compass
} from 'lucide-react';

interface Point2D {
  id: string;
  x: number;
  y: number;
  label: string;
  isFixed?: boolean;
}

type GeoPreset = 'pythagoras' | 'triangle_explorer' | 'circle_tangent' | 'spatial_pyramid';

export const GeometryStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activePreset, setActivePreset] = useState<GeoPreset>('pythagoras');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [spatialRotation, setSpatialRotation] = useState<number>(30); // for 3D model
  const [spatialHeight, setSpatialHeight] = useState<number>(180);

  // Points state for 2D presets
  const [points, setPoints] = useState<Record<GeoPreset, Point2D[]>>({
    pythagoras: [
      { id: 'A', x: 220, y: 150, label: 'A' },
      { id: 'B', x: 220, y: 350, label: 'B' }, // Right angle at B
      { id: 'C', x: 480, y: 350, label: 'C' }
    ],
    triangle_explorer: [
      { id: 'A', x: 300, y: 120, label: 'A' },
      { id: 'B', x: 180, y: 360, label: 'B' },
      { id: 'C', x: 460, y: 340, label: 'C' }
    ],
    circle_tangent: [
      { id: 'O', x: 300, y: 250, label: 'O', isFixed: true }, // Center
      { id: 'R', x: 420, y: 250, label: 'R' }, // Radius point
      { id: 'P', x: 520, y: 160, label: 'P' }  // External point
    ],
    spatial_pyramid: []
  });

  const activePoints = points[activePreset] || [];

  // Distance helper
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  };

  // Angle between 3 points in degrees
  const angleDeg = (p1: Point2D, pVertex: Point2D, p2: Point2D) => {
    const v1 = { x: p1.x - pVertex.x, y: p1.y - pVertex.y };
    const v2 = { x: p2.x - pVertex.x, y: p2.y - pVertex.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);
    if (mag1 === 0 || mag2 === 0) return 0;
    const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return (Math.acos(cosTheta) * 180) / Math.PI;
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const isDark = document.documentElement.classList.contains('dark');

    // Background
    ctx.fillStyle = isDark ? '#090d16' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid pattern
    ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)';
    ctx.lineWidth = 1;
    const gridStep = 40;
    for (let x = 0; x <= width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (activePreset === 'pythagoras') {
      const pA = activePoints.find((p) => p.id === 'A') || { x: 220, y: 150, label: 'A', id: 'A' };
      const pB = activePoints.find((p) => p.id === 'B') || { x: 220, y: 350, label: 'B', id: 'B' };
      const pC = activePoints.find((p) => p.id === 'C') || { x: 480, y: 350, label: 'C', id: 'C' };

      const c = dist(pA, pB); // AB
      const a = dist(pB, pC); // BC
      const b = dist(pA, pC); // AC (hypotenuse)

      // Draw square on AB (left)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(pB.x - c, pA.y, c, c);
      ctx.fill();
      ctx.stroke();

      // Label square AB
      ctx.fillStyle = '#2563eb';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`c² = ${(c * c / 1000).toFixed(1)}k`, pB.x - c / 2 - 25, pA.y + c / 2);

      // Draw square on BC (bottom)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.rect(pB.x, pB.y, a, a);
      ctx.fill();
      ctx.stroke();

      // Label square BC
      ctx.fillStyle = '#059669';
      ctx.fillText(`a² = ${(a * a / 1000).toFixed(1)}k`, pB.x + a / 2 - 25, pB.y + a / 2);

      // Draw square on AC (hypotenuse)
      const dx = pC.x - pA.x;
      const dy = pC.y - pA.y;
      const nx = -dy; // Perpendicular vector outwards
      const ny = dx;

      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.lineTo(pC.x + nx, pC.y + ny);
      ctx.lineTo(pA.x + nx, pA.y + ny);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Label square AC
      ctx.fillStyle = '#d97706';
      ctx.fillText(`b² = ${(b * b / 1000).toFixed(1)}k`, pA.x + nx / 2 + dx / 2 - 25, pA.y + ny / 2 + dy / 2);

      // Triangle ABC
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(241, 245, 249, 0.9)';
      ctx.strokeStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right angle symbol at B
      const sqSize = 16;
      ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pB.x, pB.y - sqSize);
      ctx.lineTo(pB.x + sqSize, pB.y - sqSize);
      ctx.lineTo(pB.x + sqSize, pB.y);
      ctx.stroke();
    } else if (activePreset === 'triangle_explorer') {
      const pA = activePoints.find((p) => p.id === 'A') || { x: 300, y: 120, label: 'A', id: 'A' };
      const pB = activePoints.find((p) => p.id === 'B') || { x: 180, y: 360, label: 'B', id: 'B' };
      const pC = activePoints.find((p) => p.id === 'C') || { x: 460, y: 340, label: 'C', id: 'C' };

      // Fill triangle
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.lineTo(pC.x, pC.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Centroid (Trọng tâm G)
      const gX = (pA.x + pB.x + pC.x) / 3;
      const gY = (pA.y + pB.y + pC.y) / 3;

      // Medians (Đường trung tuyến)
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.lineWidth = 1;

      // Median A to midpoint(B, C)
      const mBC = { x: (pB.x + pC.x) / 2, y: (pB.y + pC.y) / 2 };
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(mBC.x, mBC.y);
      ctx.stroke();

      // Median B to midpoint(A, C)
      const mAC = { x: (pA.x + pC.x) / 2, y: (pA.y + pC.y) / 2 };
      ctx.beginPath();
      ctx.moveTo(pB.x, pB.y);
      ctx.lineTo(mAC.x, mAC.y);
      ctx.stroke();
      ctx.restore();

      // Point G
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(gX, gY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('G (Trọng tâm)', gX + 8, gY + 4);

      // Angles at vertices
      const angA = angleDeg(pB, pA, pC);
      const angB = angleDeg(pA, pB, pC);
      const angC = angleDeg(pA, pC, pB);

      ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`∠A: ${angA.toFixed(1)}°`, pA.x - 15, pA.y - 14);
      ctx.fillText(`∠B: ${angB.toFixed(1)}°`, pB.x - 40, pB.y + 18);
      ctx.fillText(`∠C: ${angC.toFixed(1)}°`, pC.x + 10, pC.y + 18);
    } else if (activePreset === 'circle_tangent') {
      const pO = activePoints.find((p) => p.id === 'O') || { x: 300, y: 250, label: 'O', id: 'O' };
      const pR = activePoints.find((p) => p.id === 'R') || { x: 420, y: 250, label: 'R', id: 'R' };
      const pP = activePoints.find((p) => p.id === 'P') || { x: 520, y: 160, label: 'P', id: 'P' };

      const radius = dist(pO, pR);

      // Draw Circle (O, R)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(pO.x, pO.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Radius line O-R
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pO.x, pO.y);
      ctx.lineTo(pR.x, pR.y);
      ctx.stroke();

      // Distance from O to P
      const dOP = dist(pO, pP);

      if (dOP > radius) {
        // Compute tangent points T1, T2 from external point P
        const theta = Math.acos(radius / dOP);
        const phi = Math.atan2(pP.y - pO.y, pP.x - pO.x);

        const t1X = pO.x + radius * Math.cos(phi - theta);
        const t1Y = pO.y + radius * Math.sin(phi - theta);
        const t2X = pO.x + radius * Math.cos(phi + theta);
        const t2Y = pO.y + radius * Math.sin(phi + theta);

        // Tangent 1
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pP.x, pP.y);
        ctx.lineTo(t1X, t1Y);
        ctx.stroke();

        // Tangent 2
        ctx.beginPath();
        ctx.moveTo(pP.x, pP.y);
        ctx.lineTo(t2X, t2Y);
        ctx.stroke();

        // Radii to tangent points (perpendiculars)
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(pO.x, pO.y);
        ctx.lineTo(t1X, t1Y);
        ctx.moveTo(pO.x, pO.y);
        ctx.lineTo(t2X, t2Y);
        ctx.stroke();
        ctx.restore();

        // Tangent points
        [
          { x: t1X, y: t1Y, l: 'T₁' },
          { x: t2X, y: t2Y, l: 'T₂' }
        ].forEach((t) => {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(t.l, t.x + 6, t.y - 6);
        });
      }
    } else if (activePreset === 'spatial_pyramid') {
      // 3D Spatial Geometry: Chóp tứ giác đều S.ABCD
      const rad = (spatialRotation * Math.PI) / 180;
      const cosR = Math.cos(rad);
      const sinR = Math.sin(rad);

      const centerX = width / 2;
      const baseY = height / 2 + 70;
      const baseR = 130;

      // Base vertices ABCD in isometric projection
      const baseLocal = [
        { x: -baseR, y: -baseR * 0.5 }, // A (Back-left)
        { x: baseR, y: -baseR * 0.5 },  // B (Back-right)
        { x: baseR, y: baseR * 0.5 },   // C (Front-right)
        { x: -baseR, y: baseR * 0.5 }   // D (Front-left)
      ];

      const proj = baseLocal.map((pt) => {
        const rotX = pt.x * cosR - pt.y * sinR;
        const rotY = (pt.x * sinR + pt.y * cosR) * 0.5;
        return { x: centerX + rotX, y: baseY + rotY };
      });

      // Apex S
      const apexS = { x: centerX, y: baseY - spatialHeight };

      // Base Center O
      const centerO = {
        x: (proj[0].x + proj[1].x + proj[2].x + proj[3].x) / 4,
        y: (proj[0].y + proj[1].y + proj[2].y + proj[3].y) / 4
      };

      // Draw dashed altitude SO
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(apexS.x, apexS.y);
      ctx.lineTo(centerO.x, centerO.y);
      ctx.stroke();

      // Base diagonals AC & BD
      ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(proj[0].x, proj[0].y);
      ctx.lineTo(proj[2].x, proj[2].y);
      ctx.moveTo(proj[1].x, proj[1].y);
      ctx.lineTo(proj[3].x, proj[3].y);
      ctx.stroke();

      // Hidden edges (back edges AB, AD)
      ctx.beginPath();
      ctx.moveTo(proj[0].x, proj[0].y);
      ctx.lineTo(proj[1].x, proj[1].y);
      ctx.moveTo(proj[0].x, proj[0].y);
      ctx.lineTo(proj[3].x, proj[3].y);
      ctx.moveTo(apexS.x, apexS.y);
      ctx.lineTo(proj[0].x, proj[0].y);
      ctx.stroke();
      ctx.restore();

      // Visible Base edges BC, CD
      ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(proj[3].x, proj[3].y);
      ctx.lineTo(proj[2].x, proj[2].y);
      ctx.lineTo(proj[1].x, proj[1].y);
      ctx.stroke();

      // Visible Side edges SB, SC, SD
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(apexS.x, apexS.y);
      ctx.lineTo(proj[1].x, proj[1].y);
      ctx.moveTo(apexS.x, apexS.y);
      ctx.lineTo(proj[2].x, proj[2].y);
      ctx.moveTo(apexS.x, apexS.y);
      ctx.lineTo(proj[3].x, proj[3].y);
      ctx.stroke();

      // Labels
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('S (Đỉnh)', apexS.x - 8, apexS.y - 10);
      ctx.fillText('A', proj[0].x - 14, proj[0].y);
      ctx.fillText('B', proj[1].x + 8, proj[1].y);
      ctx.fillText('C', proj[2].x + 8, proj[2].y + 14);
      ctx.fillText('D', proj[3].x - 14, proj[3].y + 14);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('O (Tâm đáy)', centerO.x + 6, centerO.y - 6);
    }

    // Draw vertex handles for 2D models
    activePoints.forEach((p) => {
      ctx.fillStyle = p.id === selectedPointId ? '#f59e0b' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText(p.label, p.x + 8, p.y - 8);
    });
  }, [activePreset, points, activePoints, selectedPointId, spatialRotation, spatialHeight]);

  // Mouse interaction for dragging points
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activePreset === 'spatial_pyramid') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Find point near click
    const clicked = activePoints.find((p) => dist(p, { x: mx, y: my }) < 18);
    if (clicked && !clicked.isFixed) {
      setSelectedPointId(clicked.id);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedPointId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setPoints((prev) => {
      const currentList = prev[activePreset] || [];
      const updated = currentList.map((p) => {
        if (p.id === selectedPointId) {
          // If Pythagoras, keep B as right angle alignment if desired
          if (activePreset === 'pythagoras') {
            if (p.id === 'A') return { ...p, y: Math.max(80, Math.min(my, 320)) };
            if (p.id === 'C') return { ...p, x: Math.max(260, Math.min(mx, 560)) };
          }
          return { ...p, x: mx, y: my };
        }
        return p;
      });
      return { ...prev, [activePreset]: updated };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {/* Preset Selector */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setActivePreset('pythagoras')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'pythagoras'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Định lý Pythagoras
            </button>
            <button
              onClick={() => setActivePreset('triangle_explorer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'triangle_explorer'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Tam giác & Trọng tâm
            </button>
            <button
              onClick={() => setActivePreset('circle_tangent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'circle_tangent'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Đường tròn & Tiếp tuyến
            </button>
            <button
              onClick={() => setActivePreset('spatial_pyramid')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'spatial_pyramid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Không gian 3D (Hình chóp)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Kéo các điểm tròn xanh để biến hình tương tác</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative flex-1 min-h-[460px] bg-slate-900/5 dark:bg-black/20">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-crosshair block"
          />
        </div>
      </div>

      {/* Control & Theory Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-indigo-500" />
            Khám phá kiến thức hình học
          </h3>

          {activePreset === 'pythagoras' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Định lý Pythagoras:</strong> Trong tam giác vuông, tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông bằng diện tích hình vuông dựng trên cạnh huyền:
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-lg font-mono text-center text-blue-900 dark:text-blue-200 font-semibold">
                c² (AB) + a² (BC) = b² (AC)
              </div>
              <p className="text-slate-500">
                Thử kéo điểm A lên xuống hoặc điểm C sang ngang: các hình vuông màu xanh lam, xanh lá và hổ phách tự động co giãn và luôn bảo toàn đẳng thức!
              </p>
            </div>
          )}

          {activePreset === 'triangle_explorer' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Tính chất trọng tâm G:</strong> Giao điểm của ba đường trung tuyến chia mỗi trung tuyến theo tỉ lệ 2/3 tính từ đỉnh:
              </p>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 rounded-lg font-mono text-center text-indigo-900 dark:text-indigo-200 font-semibold">
                AG = 2/3 AM | BG = 2/3 BN | CG = 2/3 CP
              </div>
              <p className="text-slate-500">
                Kéo bất kỳ đỉnh nào của tam giác ABC để kiểm chứng trọng tâm G luôn di chuyển mượt mà bên trong tam giác.
              </p>
            </div>
          )}

          {activePreset === 'circle_tangent' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Định lý hai tiếp tuyến cắt nhau:</strong> Từ điểm P nằm ngoài đường tròn (O), hai tiếp tuyến PT₁ và PT₂ có độ dài bằng nhau:
              </p>
              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-900/40 rounded-lg font-mono text-center text-cyan-900 dark:text-cyan-200 font-semibold">
                PT₁ = PT₂ và PO là tia phân giác ∠T₁PT₂
              </div>
              <p className="text-slate-500">
                Kéo điểm P hoặc điểm R (bán kính) để quan sát hai tiếp điểm T₁ và T₂ tự động bám sát đường tròn.
              </p>
            </div>
          )}

          {activePreset === 'spatial_pyramid' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Hình chóp đều S.ABCD:</strong> Đáy là hình vuông ABCD tâm O, đỉnh S nằm trên đường thẳng vuông góc với mặt phẳng đáy tại O (SO ⊥ (ABCD)).
              </p>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Góc xoay 3D</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{spatialRotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={spatialRotation}
                  onChange={(e) => setSpatialRotation(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Chiều cao chóp (SO)</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{spatialHeight} px</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="260"
                  value={spatialHeight}
                  onChange={(e) => setSpatialHeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
