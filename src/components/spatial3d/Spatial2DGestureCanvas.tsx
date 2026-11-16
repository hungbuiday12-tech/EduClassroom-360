import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { HandGestureId, HandTrackingFrame } from './handGestureTracker';

export type Spatial2DModeId =
  | 'polygon_euler'
  | 'compass_circle'
  | 'vectors_oxy'
  | 'symmetry_kaleido'
  | 'conic_wave'
  | 'tangram_build';

export interface Spatial2DModeMeta {
  id: Spatial2DModeId;
  titleVi: string;
  titleEn: string;
  formula: string;
  descVi: string;
  descEn: string;
  badge: string;
}

export const SPATIAL_2D_MODES: Spatial2DModeMeta[] = [
  {
    id: 'polygon_euler',
    titleVi: 'Tam giác & Đường thẳng Euler',
    titleEn: 'Polygon & Euler Line',
    formula: 'O — G — H thẳng hàng · HG = 2·GO',
    descVi: 'Chụm ngón kéo đỉnh A, B, C (hoặc 2 tay kéo 2 đỉnh cùng lúc) để quan sát Trực tâm H, Trọng tâm G, Tâm ngoại tiếp O.',
    descEn: 'Pinch to drag vertices A, B, C (or 2 hands simultaneously) to inspect Orthocenter H, Centroid G & Circumcenter O.',
    badge: 'HÌNH HỌC 2D'
  },
  {
    id: 'compass_circle',
    titleVi: 'Compa 2 Tay & Tiếp Tuyến',
    titleEn: '2-Hand Compass & Tangents',
    formula: '(x - x₀)² + (y - y₀)² = R² · PT₁ = PT₂',
    descVi: 'Dùng 2 tay làm compa: Tay 1 đặt tâm O, Tay 2 kéo bán kính R; chụm ngón dời điểm P dựng tiếp tuyến.',
    descEn: 'Use 2 hands as a compass: Hand 1 sets center O, Hand 2 stretches radius R; pinch to move tangent point P.',
    badge: 'ĐƯỜNG TRÒN'
  },
  {
    id: 'vectors_oxy',
    titleVi: 'Phép Cộng Vector & Tích Vô Hướng',
    titleEn: '2-Hand Vector Addition',
    formula: 'w = u + v · u·v = |u|·|v|·cos(θ)',
    descVi: 'Tay trái điều khiển vector u, tay phải điều khiển vector v để dựng hình bình hành tổng & đo góc tức thì.',
    descEn: 'Left hand aims vector u while right hand aims vector v simultaneously to inspect parallelogram sum & dot product.',
    badge: 'VECTOR OXY'
  },
  {
    id: 'symmetry_kaleido',
    titleVi: 'Kính Vạn Hoa Đối Xứng Toán Học',
    titleEn: 'Radial Symmetry Kaleidoscope',
    formula: 'R(θₖ) = (cos 2πk/n, sin 2πk/n)',
    descVi: 'Dùng 1 ngón hoặc cả 2 tay (10 ngón) vẽ hoa văn đối xứng tâm bậc n; giơ 3 ngón để đổi số cánh đối xứng.',
    descEn: 'Draw with 1 finger or both hands across n radial symmetry axes; show 3 fingers to cycle symmetry order.',
    badge: 'ĐỐI XỨNG'
  },
  {
    id: 'conic_wave',
    titleVi: 'Parabol & Tương Giao Tiếp Tuyến',
    titleEn: 'Parabola & Secant Intersection',
    formula: 'y = ax² + bx + c ∩ y = kx + m',
    descVi: 'Chụm ngón uốn độ cong Parabol, 2 ngón xoay đường thẳng cắt để giải trực quan nghiệm giao điểm.',
    descEn: 'Pinch to bend parabola curvature, 2 fingers to sweep intersecting line and read live intersection roots.',
    badge: 'ĐỒ THỊ'
  },
  {
    id: 'tangram_build',
    titleVi: 'Xếp Hình Tangram Bằng Cử Chỉ',
    titleEn: 'Gesture Tangram Puzzle',
    formula: 'S_tổng = ∑ S_mảnh = a² (7 mảnh ghép)',
    descVi: 'Chụm ngón gắp các mảnh đa giác, nghiêng tay hoặc 5 ngón xoay góc 15° để ghép thành các hình sáng tạo.',
    descEn: 'Pinch to grab geometric Tangram tiles and tilt/5-finger rotate to assemble custom silhouettes.',
    badge: 'SÁNG TẠO 2D'
  }
];

export interface Spatial2DHandle {
  exportPNG: () => void;
  clearCanvas: () => void;
  resetBoard: () => void;
  addVertexOrTile: () => void;
  cycleSymmetry: () => void;
}

interface Spatial2DGestureCanvasProps {
  mode2D: Spatial2DModeId;
  accentCss: string;
  isEn: boolean;
  cameraActive: boolean;
  virtualGesture: HandGestureId;
  frozen: boolean;
  handFrameRef: React.MutableRefObject<HandTrackingFrame>;
  onMetricsChange: (metrics: { metricA: string; metricB: string; metricC: string }) => void;
}

interface Vec2 {
  x: number;
  y: number;
}

interface TangramPiece {
  id: number;
  kind: 'bigTriA' | 'bigTriB' | 'medTri' | 'smallTriA' | 'smallTriB' | 'square' | 'parallelogram';
  x: number; // world units
  y: number;
  rot: number; // radians
  color: string;
  pts: Vec2[];
}

function makeTangramPieces(): TangramPiece[] {
  return [
    {
      id: 0,
      kind: 'bigTriA',
      x: -4.2,
      y: 1.5,
      rot: 0,
      color: '#22d3ee',
      pts: [{ x: -1.8, y: -0.9 }, { x: 1.8, y: -0.9 }, { x: 0, y: 0.9 }]
    },
    {
      id: 1,
      kind: 'bigTriB',
      x: -1.6,
      y: 2.3,
      rot: Math.PI / 2,
      color: '#38bdf8',
      pts: [{ x: -1.8, y: -0.9 }, { x: 1.8, y: -0.9 }, { x: 0, y: 0.9 }]
    },
    {
      id: 2,
      kind: 'medTri',
      x: 2.2,
      y: 2.1,
      rot: -Math.PI / 4,
      color: '#34d399',
      pts: [{ x: -1.27, y: -0.64 }, { x: 1.27, y: -0.64 }, { x: 0, y: 0.64 }]
    },
    {
      id: 3,
      kind: 'smallTriA',
      x: 4.3,
      y: 1.0,
      rot: 0,
      color: '#f59e0b',
      pts: [{ x: -0.9, y: -0.45 }, { x: 0.9, y: -0.45 }, { x: 0, y: 0.45 }]
    },
    {
      id: 4,
      kind: 'smallTriB',
      x: 4.1,
      y: -1.6,
      rot: Math.PI,
      color: '#f472b6',
      pts: [{ x: -0.9, y: -0.45 }, { x: 0.9, y: -0.45 }, { x: 0, y: 0.45 }]
    },
    {
      id: 5,
      kind: 'square',
      x: 0.2,
      y: -2.0,
      rot: Math.PI / 4,
      color: '#a855f7',
      pts: [
        { x: -0.64, y: -0.64 },
        { x: 0.64, y: -0.64 },
        { x: 0.64, y: 0.64 },
        { x: -0.64, y: 0.64 }
      ]
    },
    {
      id: 6,
      kind: 'parallelogram',
      x: -3.5,
      y: -1.9,
      rot: 0,
      color: '#fbbf24',
      pts: [
        { x: -1.2, y: -0.45 },
        { x: 0.6, y: -0.45 },
        { x: 1.2, y: 0.45 },
        { x: -0.6, y: 0.45 }
      ]
    }
  ];
}

function pointInPoly(p: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export const Spatial2DGestureCanvas = React.forwardRef<Spatial2DHandle, Spatial2DGestureCanvasProps>(
  ({ mode2D, accentCss, isEn, cameraActive, virtualGesture, frozen, handFrameRef, onMetricsChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Interactive world states held in refs for crisp 60fps animation
    const worldScaleRef = useRef<number>(48); // pixels per unit
    const boardRotRef = useRef<number>(0);

    // Mode 1: Polygon / Euler Triangle vertices
    const polyVertsRef = useRef<Vec2[]>([
      { x: -3.5, y: -2.0 },
      { x: 3.6, y: -1.8 },
      { x: 0.8, y: 3.2 }
    ]);
    const draggedPolyIdxRef = useRef<number | null>(null);

    // Mode 2: Compass circle & external tangent point P
    const circleCenterRef = useRef<Vec2>({ x: -0.6, y: 0.2 });
    const circleRadiusRef = useRef<number>(2.8);
    const externalPtRef = useRef<Vec2>({ x: 4.8, y: 2.2 });
    const inscribedAngleRef = useRef<number>(1.9);

    // Mode 3: 2-Hand Vector Lab
    const vecURef = useRef<Vec2>({ x: 3.8, y: 1.5 });
    const vecVRef = useRef<Vec2>({ x: 1.2, y: 3.4 });

    // Mode 4: Radial Symmetry Kaleidoscope strokes
    const kaleidoOrderRef = useRef<number>(8);
    const [kaleidoOrderUI, setKaleidoOrderUI] = useState<number>(8);
    const kaleidoStrokesRef = useRef<{ pts: Vec2[]; color: string }[]>([]);
    const activeKaleidoH1Ref = useRef<Vec2[]>([]);
    const activeKaleidoH2Ref = useRef<Vec2[]>([]);
    const lastSymToggleRef = useRef<number>(0);

    // Mode 5: Conic Parabola & Secant line
    const conicRef = useRef<{ a: number; b: number; c: number; k: number; m: number }>({
      a: 0.32,
      b: 0.1,
      c: -1.4,
      k: 0.45,
      m: 1.1
    });

    // Mode 6: Tangram pieces
    const tangramRef = useRef<TangramPiece[]>(makeTangramPieces());
    const grabbedPieceRef = useRef<number | null>(null);

    // Pointer interaction (mouse/touch fallback when webcam is off)
    const pointerDownRef = useRef<boolean>(false);
    const pointerWorldRef = useRef<Vec2>({ x: 0, y: 0 });
    const prevPointerDownRef = useRef<boolean>(false);

    const lastMetricPushRef = useRef<number>(0);

    const worldToScreen = useCallback((wx: number, wy: number, w: number, h: number): Vec2 => {
      const s = worldScaleRef.current;
      return {
        x: w * 0.5 + wx * s,
        y: h * 0.5 - wy * s
      };
    }, []);

    const screenToWorld = useCallback((sx: number, sy: number, w: number, h: number): Vec2 => {
      const s = worldScaleRef.current;
      return {
        x: (sx - w * 0.5) / s,
        y: (h * 0.5 - sy) / s
      };
    }, []);

    const resetBoard = useCallback(() => {
      boardRotRef.current = 0;
      polyVertsRef.current = [
        { x: -3.5, y: -2.0 },
        { x: 3.6, y: -1.8 },
        { x: 0.8, y: 3.2 }
      ];
      circleCenterRef.current = { x: -0.6, y: 0.2 };
      circleRadiusRef.current = 2.8;
      externalPtRef.current = { x: 4.8, y: 2.2 };
      vecURef.current = { x: 3.8, y: 1.5 };
      vecVRef.current = { x: 1.2, y: 3.4 };
      kaleidoStrokesRef.current = [];
      activeKaleidoH1Ref.current = [];
      activeKaleidoH2Ref.current = [];
      conicRef.current = { a: 0.32, b: 0.1, c: -1.4, k: 0.45, m: 1.1 };
      tangramRef.current = makeTangramPieces();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        exportPNG: () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = `synapse-2d-${mode2D}.png`;
          a.click();
        },
        clearCanvas: () => {
          kaleidoStrokesRef.current = [];
          activeKaleidoH1Ref.current = [];
          activeKaleidoH2Ref.current = [];
          if (mode2D === 'polygon_euler') {
            polyVertsRef.current = [
              { x: -3.5, y: -2.0 },
              { x: 3.6, y: -1.8 },
              { x: 0.8, y: 3.2 }
            ];
          }
        },
        resetBoard,
        addVertexOrTile: () => {
          if (mode2D === 'polygon_euler') {
            if (polyVertsRef.current.length < 8) {
              const angle = (polyVertsRef.current.length * Math.PI * 2) / 6;
              polyVertsRef.current.push({
                x: +(Math.cos(angle) * 3.4).toFixed(2),
                y: +(Math.sin(angle) * 2.8).toFixed(2)
              });
            } else {
              polyVertsRef.current = polyVertsRef.current.slice(0, 3);
            }
          } else if (mode2D === 'tangram_build') {
            tangramRef.current = makeTangramPieces();
          }
        },
        cycleSymmetry: () => {
          const orders = [4, 6, 8, 12];
          const next = orders[(orders.indexOf(kaleidoOrderRef.current) + 1) % orders.length];
          kaleidoOrderRef.current = next;
          setKaleidoOrderUI(next);
        }
      }),
      [mode2D, resetBoard]
    );

    // Resize observer for crisp HiDPI 2D rendering
    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const updateSize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = container.clientWidth || 960;
        const h = container.clientHeight || 600;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        worldScaleRef.current = Math.max(32, Math.min(62, Math.min(w, h) / 11.5));
      };

      updateSize();
      const ro = new ResizeObserver(updateSize);
      ro.observe(container);
      return () => ro.disconnect();
    }, []);

    // Pointer listeners for mouse/touch mode
    const handlePointer = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>, isDown: boolean, isMove: boolean) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        pointerWorldRef.current = screenToWorld(sx, sy, rect.width, rect.height);
        if (!isMove) {
          pointerDownRef.current = isDown;
        }
      },
      [screenToWorld]
    );

    // Main 60fps 2D geometry & gesture loop
    useEffect(() => {
      let rafId = 0;

      const renderFrame = (nowMs: number) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
          rafId = requestAnimationFrame(renderFrame);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          rafId = requestAnimationFrame(renderFrame);
          return;
        }

        const dpr = canvas.width / Math.max(1, container.clientWidth);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;

        ctx.save();
        ctx.scale(dpr, dpr);

        // Background
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 30, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
        bgGrad.addColorStop(0, '#0b152a');
        bgGrad.addColorStop(1, '#040814');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Read hand gesture state or pointer fallback
        const frame = handFrameRef.current;
        const hasHand = cameraActive && frame.detected;
        const gesture: HandGestureId = hasHand ? frame.gesture : pointerDownRef.current ? virtualGesture : 'none';

        // Map normalized [0..1] hand coords into 2D world coordinates
        const normToWorld = (nx: number, ny: number): Vec2 => screenToWorld(nx * w, ny * h, w, h);

        const primaryWorld = hasHand
          ? normToWorld(frame.cursorX, frame.cursorY)
          : pointerWorldRef.current;

        const h1World = hasHand && frame.hand1Index ? normToWorld(frame.hand1Index.x, frame.hand1Index.y) : primaryWorld;
        const h2World = hasHand && frame.hand2Index ? normToWorld(frame.hand2Index.x, frame.hand2Index.y) : null;

        const isPinchActive = hasHand
          ? frame.hand1Pinching || frame.hand2Pinching || frame.gesture === 'pinch'
          : pointerDownRef.current && virtualGesture === 'pinch';

        const isPointDraw = hasHand
          ? frame.gesture === 'point_1' || (frame.handCount === 2 && frame.gesture === 'two_hand_10')
          : pointerDownRef.current && virtualGesture === 'point_1';

        const isTwoHand = hasHand ? frame.handCount === 2 : pointerDownRef.current && virtualGesture === 'two_hand_10';

        // Apply gesture interactions to the active 2D geometric lab (unless frozen)
        if (!frozen) {
          if (mode2D === 'polygon_euler') {
            const verts = polyVertsRef.current;
            if (isTwoHand && h2World) {
              // Dual hand simultaneously moves A & B!
              verts[0].x += (h1World.x - verts[0].x) * 0.35;
              verts[0].y += (h1World.y - verts[0].y) * 0.35;
              if (verts[1]) {
                verts[1].x += (h2World.x - verts[1].x) * 0.35;
                verts[1].y += (h2World.y - verts[1].y) * 0.35;
              }
            } else if (isPinchActive || (pointerDownRef.current && virtualGesture === 'palm_5')) {
              if (draggedPolyIdxRef.current === null) {
                let bestIdx = 0;
                let bestD = Infinity;
                verts.forEach((v, idx) => {
                  const d = Math.hypot(v.x - primaryWorld.x, v.y - primaryWorld.y);
                  if (d < bestD) {
                    bestD = d;
                    bestIdx = idx;
                  }
                });
                if (bestD < 2.2) draggedPolyIdxRef.current = bestIdx;
              }
              if (draggedPolyIdxRef.current !== null && verts[draggedPolyIdxRef.current]) {
                const target = verts[draggedPolyIdxRef.current];
                target.x += (primaryWorld.x - target.x) * 0.45;
                target.y += (primaryWorld.y - target.y) * 0.45;
              }
            } else {
              draggedPolyIdxRef.current = null;
            }
          } else if (mode2D === 'compass_circle') {
            if (isTwoHand && h2World) {
              // Hand 1 sets circle center O, Hand 2 stretches radius R!
              circleCenterRef.current.x += (h1World.x - circleCenterRef.current.x) * 0.35;
              circleCenterRef.current.y += (h1World.y - circleCenterRef.current.y) * 0.35;
              const newR = Math.max(0.8, Math.min(4.8, Math.hypot(h2World.x - h1World.x, h2World.y - h1World.y)));
              circleRadiusRef.current += (newR - circleRadiusRef.current) * 0.35;
            } else if (isPinchActive) {
              externalPtRef.current.x += (primaryWorld.x - externalPtRef.current.x) * 0.4;
              externalPtRef.current.y += (primaryWorld.y - externalPtRef.current.y) * 0.4;
            } else if (gesture === 'slice_2') {
              inscribedAngleRef.current = Math.atan2(
                primaryWorld.y - circleCenterRef.current.y,
                primaryWorld.x - circleCenterRef.current.x
              );
            } else if (pointerDownRef.current && virtualGesture === 'two_hand_10') {
              const newR = Math.max(0.8, Math.min(4.8, Math.hypot(primaryWorld.x - circleCenterRef.current.x, primaryWorld.y - circleCenterRef.current.y)));
              circleRadiusRef.current = newR;
            }
          } else if (mode2D === 'vectors_oxy') {
            if (isTwoHand && h2World) {
              vecURef.current.x += (h1World.x - vecURef.current.x) * 0.42;
              vecURef.current.y += (h1World.y - vecURef.current.y) * 0.42;
              vecVRef.current.x += (h2World.x - vecVRef.current.x) * 0.42;
              vecVRef.current.y += (h2World.y - vecVRef.current.y) * 0.42;
            } else if (isPinchActive || isPointDraw || pointerDownRef.current) {
              const dU = Math.hypot(primaryWorld.x - vecURef.current.x, primaryWorld.y - vecURef.current.y);
              const dV = Math.hypot(primaryWorld.x - vecVRef.current.x, primaryWorld.y - vecVRef.current.y);
              if (dU <= dV) {
                vecURef.current.x += (primaryWorld.x - vecURef.current.x) * 0.45;
                vecURef.current.y += (primaryWorld.y - vecURef.current.y) * 0.45;
              } else {
                vecVRef.current.x += (primaryWorld.x - vecVRef.current.x) * 0.45;
                vecVRef.current.y += (primaryWorld.y - vecVRef.current.y) * 0.45;
              }
            }
          } else if (mode2D === 'symmetry_kaleido') {
            if (gesture === 'morph_3' && nowMs - lastSymToggleRef.current > 1100) {
              lastSymToggleRef.current = nowMs;
              const orders = [4, 6, 8, 12];
              const next = orders[(orders.indexOf(kaleidoOrderRef.current) + 1) % orders.length];
              kaleidoOrderRef.current = next;
              setKaleidoOrderUI(next);
            }
            if (gesture === 'palm_5' && (hasHand || pointerDownRef.current)) {
              boardRotRef.current += (primaryWorld.x * 0.015);
            }

            if (isPointDraw) {
              const pts1 = activeKaleidoH1Ref.current;
              const last1 = pts1[pts1.length - 1];
              if (!last1 || Math.hypot(h1World.x - last1.x, h1World.y - last1.y) > 0.08) {
                pts1.push({ x: h1World.x, y: h1World.y });
                if (pts1.length > 200) pts1.shift();
              }
              if (isTwoHand && h2World) {
                const pts2 = activeKaleidoH2Ref.current;
                const last2 = pts2[pts2.length - 1];
                if (!last2 || Math.hypot(h2World.x - last2.x, h2World.y - last2.y) > 0.08) {
                  pts2.push({ x: h2World.x, y: h2World.y });
                  if (pts2.length > 200) pts2.shift();
                }
              }
            } else {
              if (activeKaleidoH1Ref.current.length >= 2) {
                kaleidoStrokesRef.current.push({ pts: activeKaleidoH1Ref.current, color: accentCss });
                if (kaleidoStrokesRef.current.length > 40) kaleidoStrokesRef.current.shift();
              }
              if (activeKaleidoH2Ref.current.length >= 2) {
                kaleidoStrokesRef.current.push({ pts: activeKaleidoH2Ref.current, color: '#34d399' });
                if (kaleidoStrokesRef.current.length > 40) kaleidoStrokesRef.current.shift();
              }
              activeKaleidoH1Ref.current = [];
              activeKaleidoH2Ref.current = [];
            }
          } else if (mode2D === 'conic_wave') {
            if (isPinchActive || (pointerDownRef.current && virtualGesture === 'point_1')) {
              const targetA = Math.max(-0.8, Math.min(0.85, primaryWorld.y * 0.16));
              const targetB = Math.max(-1.6, Math.min(1.6, -primaryWorld.x * 0.28));
              conicRef.current.a += (targetA - conicRef.current.a) * 0.35;
              conicRef.current.b += (targetB - conicRef.current.b) * 0.35;
            } else if (gesture === 'slice_2') {
              const targetK = Math.max(-2.0, Math.min(2.0, primaryWorld.x * 0.4));
              const targetM = Math.max(-3.5, Math.min(3.5, primaryWorld.y));
              conicRef.current.k += (targetK - conicRef.current.k) * 0.35;
              conicRef.current.m += (targetM - conicRef.current.m) * 0.35;
            }
          } else if (mode2D === 'tangram_build') {
            const pieces = tangramRef.current;
            if (isPinchActive || (pointerDownRef.current && virtualGesture === 'point_1')) {
              if (grabbedPieceRef.current === null) {
                // Find piece containing pointer or closest piece center
                let picked: number | null = null;
                let bestD = Infinity;
                for (let i = pieces.length - 1; i >= 0; i--) {
                  const pc = pieces[i];
                  const cos = Math.cos(-pc.rot);
                  const sin = Math.sin(-pc.rot);
                  const dx = primaryWorld.x - pc.x;
                  const dy = primaryWorld.y - pc.y;
                  const local = { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
                  if (pointInPoly(local, pc.pts)) {
                    picked = i;
                    break;
                  }
                  const d = Math.hypot(dx, dy);
                  if (d < bestD && d < 1.8) {
                    bestD = d;
                    picked = i;
                  }
                }
                grabbedPieceRef.current = picked;
              }
              if (grabbedPieceRef.current !== null && pieces[grabbedPieceRef.current]) {
                const pc = pieces[grabbedPieceRef.current];
                pc.x += (primaryWorld.x - pc.x) * 0.48;
                pc.y += (primaryWorld.y - pc.y) * 0.48;
                if (hasHand) {
                  pc.rot += (frame.handTiltAngle - pc.rot) * 0.22;
                }
              }
            } else {
              if (grabbedPieceRef.current !== null && pieces[grabbedPieceRef.current]) {
                // Snap rotation to nearest 15 deg on release
                const pc = pieces[grabbedPieceRef.current];
                const step = Math.PI / 12;
                pc.rot = Math.round(pc.rot / step) * step;
              }
              grabbedPieceRef.current = null;
              if (gesture === 'palm_5' && (hasHand || pointerDownRef.current)) {
                // Rotate nearest piece gently
                let bestIdx = 0;
                let bestD = Infinity;
                pieces.forEach((pc, i) => {
                  const d = Math.hypot(pc.x - primaryWorld.x, pc.y - primaryWorld.y);
                  if (d < bestD) {
                    bestD = d;
                    bestIdx = i;
                  }
                });
                if (bestD < 2.2) {
                  pieces[bestIdx].rot += 0.035;
                }
              }
            }
          }
        }
        prevPointerDownRef.current = pointerDownRef.current;

        // Draw Cartesian Oxy Grid
        const scale = worldScaleRef.current;
        const cx = w * 0.5;
        const cy = h * 0.5;

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.lineWidth = 1;
        for (let gx = -12; gx <= 12; gx++) {
          const px = cx + gx * scale;
          if (px < 0 || px > w) continue;
          ctx.beginPath();
          ctx.moveTo(px, 0);
          ctx.lineTo(px, h);
          ctx.stroke();
        }
        for (let gy = -10; gy <= 10; gy++) {
          const py = cy - gy * scale;
          if (py < 0 || py > h) continue;
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(w, py);
          ctx.stroke();
        }

        // Major Oxy Axes
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.38)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(w, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('O(0,0)', cx + 6, cy + 14);
        ctx.fillText('x', w - 16, cy - 8);
        ctx.fillText('y', cx + 10, 18);

        // Render Mode-Specific Live Geometry
        let metricA = '';
        let metricB = '';
        let metricC = '';

        if (mode2D === 'polygon_euler') {
          const verts = polyVertsRef.current;
          const scrVerts = verts.map((v) => worldToScreen(v.x, v.y, w, h));

          // Polygon fill & stroke
          ctx.beginPath();
          scrVerts.forEach((sv, idx) => (idx === 0 ? ctx.moveTo(sv.x, sv.y) : ctx.lineTo(sv.x, sv.y)));
          ctx.closePath();
          ctx.fillStyle = 'rgba(34, 211, 238, 0.12)';
          ctx.fill();
          ctx.strokeStyle = accentCss;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Shoelace area & perimeter
          let area2 = 0;
          let perim = 0;
          for (let i = 0; i < verts.length; i++) {
            const p = verts[i];
            const q = verts[(i + 1) % verts.length];
            area2 += p.x * q.y - q.x * p.y;
            perim += Math.hypot(q.x - p.x, q.y - p.y);
          }
          const area = Math.abs(area2) * 0.5;

          // If Triangle (3 vertices): draw Medians, Centroid G, Circumcenter O, Orthocenter H & Euler Line!
          if (verts.length === 3) {
            const [A, B, C] = verts;
            const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };

            const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
            if (Math.abs(D) > 0.01) {
              const a2 = A.x * A.x + A.y * A.y;
              const b2 = B.x * B.x + B.y * B.y;
              const c2 = C.x * C.x + C.y * C.y;
              const Ox = (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / D;
              const Oy = (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / D;
              const O = { x: Ox, y: Oy };
              const R = Math.hypot(A.x - Ox, A.y - Oy);
              const H = { x: A.x + B.x + C.x - 2 * Ox, y: A.y + B.y + C.y - 2 * Oy };

              const sO = worldToScreen(O.x, O.y, w, h);
              const sG = worldToScreen(G.x, G.y, w, h);
              const sH = worldToScreen(H.x, H.y, w, h);

              // Circumcircle
              ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
              ctx.setLineDash([5, 5]);
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(sO.x, sO.y, R * scale, 0, Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);

              // Medians dashed
              ctx.strokeStyle = 'rgba(52, 211, 153, 0.32)';
              ctx.lineWidth = 1.2;
              [
                [A, { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }],
                [B, { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }],
                [C, { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }]
              ].forEach(([p, m]) => {
                const sp = worldToScreen(p.x, p.y, w, h);
                const sm = worldToScreen(m.x, m.y, w, h);
                ctx.beginPath();
                ctx.moveTo(sp.x, sp.y);
                ctx.lineTo(sm.x, sm.y);
                ctx.stroke();
              });

              // Glowing Euler Line O - G - H
              ctx.strokeStyle = '#fbbf24';
              ctx.lineWidth = 2.4;
              ctx.beginPath();
              ctx.moveTo(sO.x, sO.y);
              ctx.lineTo(sH.x, sH.y);
              ctx.stroke();

              // Draw O, G, H centers
              [
                { pt: sO, lbl: 'O', col: '#a855f7' },
                { pt: sG, lbl: 'G', col: '#34d399' },
                { pt: sH, lbl: 'H', col: '#fbbf24' }
              ].forEach(({ pt, lbl, col }) => {
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = 'bold 12px monospace';
                ctx.fillText(lbl, pt.x + 8, pt.y - 6);
              });

              const dOG = Math.hypot(G.x - O.x, G.y - O.y);
              const dGH = Math.hypot(H.x - G.x, H.y - G.y);
              metricC = `HG=${dGH.toFixed(2)} · 2·GO=${(2 * dOG).toFixed(2)}`;
            }
          } else {
            metricC = `${verts.length} đỉnh · Đường thẳng & Đa giác`;
          }

          // Draw draggable vertices
          const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
          scrVerts.forEach((sv, idx) => {
            const isGrabbed = draggedPolyIdxRef.current === idx;
            ctx.fillStyle = isGrabbed ? '#fbbf24' : '#ffffff';
            ctx.beginPath();
            ctx.arc(sv.x, sv.y, isGrabbed ? 8 : 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = accentCss;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(
              `${letters[idx]}(${verts[idx].x.toFixed(1)}, ${verts[idx].y.toFixed(1)})`,
              sv.x + 10,
              sv.y - 10
            );
          });

          metricA = `S = ${area.toFixed(2)} đvdt`;
          metricB = `Chu vi P = ${perim.toFixed(2)} đv`;
        } else if (mode2D === 'compass_circle') {
          const O = circleCenterRef.current;
          const R = circleRadiusRef.current;
          const P = externalPtRef.current;
          const sO = worldToScreen(O.x, O.y, w, h);
          const sP = worldToScreen(P.x, P.y, w, h);

          // Circle
          ctx.beginPath();
          ctx.arc(sO.x, sO.y, R * scale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
          ctx.fill();
          ctx.strokeStyle = accentCss;
          ctx.lineWidth = 2.6;
          ctx.stroke();

          // Radius sweep arm (Inscribed/Central angle)
          const ang = inscribedAngleRef.current;
          const M = { x: O.x + Math.cos(ang) * R, y: O.y + Math.sin(ang) * R };
          const sM = worldToScreen(M.x, M.y, w, h);
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sO.x, sO.y);
          ctx.lineTo(sM.x, sM.y);
          ctx.stroke();

          // Tangent lines from P if outside circle
          const dx = P.x - O.x;
          const dy = P.y - O.y;
          const dOP = Math.hypot(dx, dy);
          if (dOP > R + 0.15) {
            const baseAng = Math.atan2(dy, dx);
            const alpha = Math.acos(R / dOP);
            [baseAng + alpha, baseAng - alpha].forEach((tAng, idx) => {
              const T = { x: O.x + Math.cos(tAng) * R, y: O.y + Math.sin(tAng) * R };
              const sT = worldToScreen(T.x, T.y, w, h);
              ctx.strokeStyle = '#fbbf24';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(sP.x, sP.y);
              ctx.lineTo(sT.x, sT.y);
              ctx.stroke();

              // Right-angle radius to tangent
              ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(sO.x, sO.y);
              ctx.lineTo(sT.x, sT.y);
              ctx.stroke();
              ctx.setLineDash([]);

              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              ctx.arc(sT.x, sT.y, 5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillText(`T${idx + 1}`, sT.x + 8, sT.y - 8);
            });
          }

          // Center O and External Point P
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sO.x, sO.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`O(${O.x.toFixed(1)}, ${O.y.toFixed(1)})`, sO.x + 10, sO.y + 14);

          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(sP.x, sP.y, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`P(${P.x.toFixed(1)}, ${P.y.toFixed(1)})`, sP.x + 10, sP.y - 10);

          const tangentLen = dOP > R ? Math.sqrt(dOP * dOP - R * R) : 0;
          metricA = `R = ${R.toFixed(2)} · C = ${(2 * Math.PI * R).toFixed(2)}`;
          metricB = `S = ${(Math.PI * R * R).toFixed(2)} đvdt`;
          metricC = tangentLen > 0 ? `PT₁ = PT₂ = ${tangentLen.toFixed(2)}` : 'P nằm trong đường tròn';
        } else if (mode2D === 'vectors_oxy') {
          const u = vecURef.current;
          const v = vecVRef.current;
          const sum = { x: u.x + v.x, y: u.y + v.y };
          const sO = worldToScreen(0, 0, w, h);
          const sU = worldToScreen(u.x, u.y, w, h);
          const sV = worldToScreen(v.x, v.y, w, h);
          const sSum = worldToScreen(sum.x, sum.y, w, h);

          // Parallelogram fill
          ctx.beginPath();
          ctx.moveTo(sO.x, sO.y);
          ctx.lineTo(sU.x, sU.y);
          ctx.lineTo(sSum.x, sSum.y);
          ctx.lineTo(sV.x, sV.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.setLineDash([]);

          const drawArrow = (from: Vec2, to: Vec2, col: string, label: string) => {
            ctx.strokeStyle = col;
            ctx.fillStyle = col;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();

            const ang = Math.atan2(to.y - from.y, to.x - from.x);
            ctx.beginPath();
            ctx.moveTo(to.x, to.y);
            ctx.lineTo(to.x - Math.cos(ang - 0.35) * 13, to.y - Math.sin(ang - 0.35) * 13);
            ctx.lineTo(to.x - Math.cos(ang + 0.35) * 13, to.y - Math.sin(ang + 0.35) * 13);
            ctx.closePath();
            ctx.fill();

            ctx.font = 'bold 12px monospace';
            ctx.fillText(label, to.x + 10, to.y - 8);
          };

          drawArrow(sO, sU, '#22d3ee', `u(${u.x.toFixed(1)}, ${u.y.toFixed(1)})`);
          drawArrow(sO, sV, '#34d399', `v(${v.x.toFixed(1)}, ${v.y.toFixed(1)})`);
          drawArrow(sO, sSum, '#fbbf24', `u+v(${sum.x.toFixed(1)}, ${sum.y.toFixed(1)})`);

          const magU = Math.hypot(u.x, u.y);
          const magV = Math.hypot(v.x, v.y);
          const dot = u.x * v.x + u.y * v.y;
          const cosTheta = magU > 0.01 && magV > 0.01 ? Math.max(-1, Math.min(1, dot / (magU * magV))) : 1;
          const thetaDeg = (Math.acos(cosTheta) * 180) / Math.PI;

          metricA = `|u|=${magU.toFixed(2)} · |v|=${magV.toFixed(2)}`;
          metricB = `u·v = ${dot.toFixed(2)}`;
          metricC = `Góc θ = ${thetaDeg.toFixed(1)}°`;
        } else if (mode2D === 'symmetry_kaleido') {
          const order = kaleidoOrderRef.current;
          const rot = boardRotRef.current;

          // Symmetry axis guide lines
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
          ctx.lineWidth = 1;
          for (let k = 0; k < order; k++) {
            const ang = (k * Math.PI * 2) / order;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang) * Math.max(w, h), Math.sin(ang) * Math.max(w, h));
            ctx.stroke();
          }

          const drawMirroredStroke = (pts: Vec2[], col: string) => {
            if (pts.length < 2) return;
            ctx.strokeStyle = col;
            ctx.lineWidth = 2.6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (let k = 0; k < order; k++) {
              const ang = (k * Math.PI * 2) / order;
              const cos = Math.cos(ang);
              const sin = Math.sin(ang);
              // Direct rotation
              ctx.beginPath();
              pts.forEach((p, idx) => {
                const px = (p.x * cos - p.y * sin) * scale;
                const py = -(p.x * sin + p.y * cos) * scale;
                if (idx === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              });
              ctx.stroke();
              // Mirror reflection
              ctx.beginPath();
              pts.forEach((p, idx) => {
                const mx = p.x;
                const my = -p.y;
                const px = (mx * cos - my * sin) * scale;
                const py = -(mx * sin + my * cos) * scale;
                if (idx === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              });
              ctx.stroke();
            }
          };

          kaleidoStrokesRef.current.forEach((st) => drawMirroredStroke(st.pts, st.color));
          drawMirroredStroke(activeKaleidoH1Ref.current, accentCss);
          drawMirroredStroke(activeKaleidoH2Ref.current, '#34d399');
          ctx.restore();

          metricA = `Đối xứng bậc n = ${order} (${order * 2} tia)`;
          metricB = `${kaleidoStrokesRef.current.length} dải nét`;
          metricC = `Góc quay ${Math.round(((rot * 180) / Math.PI) % 360)}°`;
        } else if (mode2D === 'conic_wave') {
          const { a, b, c, k, m } = conicRef.current;

          // Plot parabola y = ax^2 + bx + c
          ctx.strokeStyle = accentCss;
          ctx.lineWidth = 3;
          ctx.beginPath();
          let started = false;
          for (let wx = -9; wx <= 9; wx += 0.08) {
            const wy = a * wx * wx + b * wx + c;
            const sPt = worldToScreen(wx, wy, w, h);
            if (!started) {
              ctx.moveTo(sPt.x, sPt.y);
              started = true;
            } else {
              ctx.lineTo(sPt.x, sPt.y);
            }
          }
          ctx.stroke();

          // Plot intersecting line y = kx + m
          const sL1 = worldToScreen(-9, k * -9 + m, w, h);
          const sL2 = worldToScreen(9, k * 9 + m, w, h);
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(sL1.x, sL1.y);
          ctx.lineTo(sL2.x, sL2.y);
          ctx.stroke();

          // Solve intersection: a x^2 + (b - k) x + (c - m) = 0
          const B = b - k;
          const C = c - m;
          const delta = B * B - 4 * a * C;
          if (Math.abs(a) > 0.01 && delta >= 0) {
            const sqrtD = Math.sqrt(delta);
            const roots = delta < 0.001 ? [-B / (2 * a)] : [(-B - sqrtD) / (2 * a), (-B + sqrtD) / (2 * a)];
            roots.forEach((rx, idx) => {
              const ry = k * rx + m;
              const sr = worldToScreen(rx, ry, w, h);
              ctx.fillStyle = '#34d399';
              ctx.beginPath();
              ctx.arc(sr.x, sr.y, 6, 0, Math.PI * 2);
              ctx.fill();
              ctx.font = 'bold 11px monospace';
              ctx.fillText(`M${idx + 1}(${rx.toFixed(1)}, ${ry.toFixed(1)})`, sr.x + 8, sr.y - 8);
            });
            metricC = roots.length === 2 ? `2 giao điểm (Δ=${delta.toFixed(2)})` : 'Tiếp xúc kép!';
          } else {
            metricC = 'Không giao nhau (Δ < 0)';
          }

          metricA = `y = ${a.toFixed(2)}x² ${b >= 0 ? '+' : ''}${b.toFixed(2)}x ${c.toFixed(1)}`;
          metricB = `d: y = ${k.toFixed(2)}x ${m >= 0 ? '+' : ''}${m.toFixed(2)}`;
        } else if (mode2D === 'tangram_build') {
          tangramRef.current.forEach((pc, idx) => {
            const sp = worldToScreen(pc.x, pc.y, w, h);
            const isGrabbed = grabbedPieceRef.current === idx;
            ctx.save();
            ctx.translate(sp.x, sp.y);
            ctx.rotate(-pc.rot);
            ctx.beginPath();
            pc.pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x * scale, -p.y * scale) : ctx.lineTo(p.x * scale, -p.y * scale)));
            ctx.closePath();
            ctx.fillStyle = isGrabbed ? '#ffffffcc' : `${pc.color}b8`;
            ctx.fill();
            ctx.strokeStyle = isGrabbed ? '#fbbf24' : '#ffffff';
            ctx.lineWidth = isGrabbed ? 3 : 1.6;
            ctx.stroke();
            ctx.restore();
          });
          metricA = '7 Mảnh Đa Giác Tangram';
          metricB = grabbedPieceRef.current !== null ? `Đang gắp mảnh #${grabbedPieceRef.current + 1}` : 'Chụm ngón để gắp mảnh';
          metricC = 'Nghiêng cổ tay / 5 ngón để xoay';
        }

        // Draw crisp 2D fingertip sensors right on the 2D board when camera active
        if (hasHand) {
          for (const tip of frame.tips) {
            const sx = tip.x * w;
            const sy = tip.y * h;
            const col = tip.handIndex === 0 ? accentCss : '#34d399';
            ctx.strokeStyle = col;
            ctx.lineWidth = tip.extended ? 2.2 : 1.3;
            ctx.beginPath();
            ctx.arc(sx, sy, tip.extended ? 9 : 5.5, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = tip.extended ? '#ffffff' : col;
            ctx.beginPath();
            ctx.arc(sx, sy, tip.extended ? 3.2 : 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();

        if (nowMs - lastMetricPushRef.current > 90) {
          lastMetricPushRef.current = nowMs;
          onMetricsChange({ metricA, metricB, metricC });
        }

        rafId = requestAnimationFrame(renderFrame);
      };

      rafId = requestAnimationFrame(renderFrame);
      return () => cancelAnimationFrame(rafId);
    }, [accentCss, cameraActive, frozen, handFrameRef, mode2D, onMetricsChange, screenToWorld, virtualGesture, worldToScreen]);

    return (
      <div ref={containerRef} className="relative w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handlePointer(e, true, false);
          }}
          onPointerMove={(e) => handlePointer(e, pointerDownRef.current, true)}
          onPointerUp={(e) => handlePointer(e, false, false)}
          onPointerCancel={(e) => handlePointer(e, false, false)}
          className="w-full h-full cursor-crosshair touch-none block"
        />
        {mode2D === 'symmetry_kaleido' && (
          <div className="absolute top-16 left-3 z-10 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-[11px] font-bold text-cyan-300">
            {isEn ? `Symmetry Order: ${kaleidoOrderUI}-fold` : `Bậc đối xứng: ${kaleidoOrderUI} cánh`}
          </div>
        )}
      </div>
    );
  }
);
Spatial2DGestureCanvas.displayName = 'Spatial2DGestureCanvas';
