import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  RotateCw,
  Sun,
  Zap,
  PenTool,
  Eye,
  RotateCcw,
  Layers
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type EmitterMode = 'laser' | 'parallel' | 'rainbow' | 'radial';
type ShapeMaterial = 'glass' | 'diamond' | 'water' | 'mirror';

interface Vec2 {
  x: number;
  y: number;
}

interface OpticalBody {
  id: string;
  label: string;
  material: ShapeMaterial;
  ior: number;
  points: Vec2[]; // normalized-ish canvas coords in 900x480 logical space
  color: string;
}

interface OpticalPreset {
  id: string;
  titleVi: string;
  titleEn: string;
  emitterMode: EmitterMode;
  emitterPos: Vec2;
  emitterAngleDeg: number;
  bodies: OpticalBody[];
}

const LOGICAL_W = 900;
const LOGICAL_H = 480;

const MATERIAL_DEFAULTS: Record<ShapeMaterial, { ior: number; color: string; labelVi: string; labelEn: string }> = {
  glass: { ior: 1.52, color: '#38bdf8', labelVi: 'Thủy tinh (n=1.52)', labelEn: 'Crown Glass (n=1.52)' },
  diamond: { ior: 2.42, color: '#a78bfa', labelVi: 'Kim cương (n=2.42)', labelEn: 'Diamond (n=2.42)' },
  water: { ior: 1.33, color: '#22d3ee', labelVi: 'Nước / Thạch anh (n=1.33)', labelEn: 'Water (n=1.33)' },
  mirror: { ior: 1.0, color: '#f59e0b', labelVi: 'Gương phản xạ 100%', labelEn: '100% Mirror' }
};

function makeRegularPolygon(cx: number, cy: number, r: number, sides: number, rotDeg = 0): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < sides; i++) {
    const a = ((i / sides) * Math.PI * 2) + (rotDeg * Math.PI) / 180;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

function makeBiconvexLens(cx: number, cy: number, halfH: number, halfW: number, segments = 14): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = -1 + (2 * i) / segments;
    const y = cy + t * halfH;
    const x = cx + halfW * (1 - t * t);
    pts.push({ x, y });
  }
  for (let i = segments; i >= 0; i--) {
    const t = -1 + (2 * i) / segments;
    const y = cy + t * halfH;
    const x = cx - halfW * (1 - t * t);
    pts.push({ x, y });
  }
  return pts;
}

function makeCurvedFiber(ptsCenter: Vec2[], halfThick: number): Vec2[] {
  const left: Vec2[] = [];
  const right: Vec2[] = [];
  for (let i = 0; i < ptsCenter.length; i++) {
    const prev = ptsCenter[Math.max(0, i - 1)];
    const next = ptsCenter[Math.min(ptsCenter.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    left.push({ x: ptsCenter[i].x + nx * halfThick, y: ptsCenter[i].y + ny * halfThick });
    right.unshift({ x: ptsCenter[i].x - nx * halfThick, y: ptsCenter[i].y - ny * halfThick });
  }
  return [...left, ...right];
}

function makeParabolicMirror(cx: number, cy: number, height: number, depth: number, thick = 10): Vec2[] {
  const front: Vec2[] = [];
  const back: Vec2[] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const t = -1 + (2 * i) / steps;
    const y = cy + t * (height / 2);
    const x = cx - depth * (1 - t * t);
    front.push({ x, y });
    back.unshift({ x: x + thick, y });
  }
  return [...front, ...back];
}

const OPTICS_PRESETS: OpticalPreset[] = [
  {
    id: 'prism_dispersion',
    titleVi: 'Lăng kính Tán sắc Newton',
    titleEn: 'Newton Dispersion Prism',
    emitterMode: 'rainbow',
    emitterPos: { x: 115, y: 265 },
    emitterAngleDeg: -10,
    bodies: [
      {
        id: 'prism-1',
        label: 'Lăng kính Thủy tinh',
        material: 'glass',
        ior: 1.56,
        color: '#38bdf8',
        points: [
          { x: 430, y: 120 },
          { x: 545, y: 335 },
          { x: 315, y: 335 }
        ]
      }
    ]
  },
  {
    id: 'fiber_tir',
    titleVi: 'Sợi quang học (Phản xạ toàn phần)',
    titleEn: 'Curved Fiber-Optic TIR',
    emitterMode: 'laser',
    emitterPos: { x: 90, y: 255 },
    emitterAngleDeg: -8,
    bodies: [
      {
        id: 'fiber-1',
        label: 'Lõi Sợi Quang n=1.68',
        material: 'glass',
        ior: 1.68,
        color: '#22d3ee',
        points: makeCurvedFiber(
          [
            { x: 165, y: 265 },
            { x: 280, y: 245 },
            { x: 410, y: 195 },
            { x: 550, y: 170 },
            { x: 690, y: 215 },
            { x: 805, y: 270 }
          ],
          36
        )
      }
    ]
  },
  {
    id: 'double_lens',
    titleVi: 'Kính thiên văn Hội tụ kép',
    titleEn: 'Dual Convex Lens Focusing',
    emitterMode: 'parallel',
    emitterPos: { x: 85, y: 240 },
    emitterAngleDeg: 0,
    bodies: [
      {
        id: 'lens-1',
        label: 'Thấu kính Vật',
        material: 'glass',
        ior: 1.54,
        color: '#38bdf8',
        points: makeBiconvexLens(335, 240, 125, 30)
      },
      {
        id: 'lens-2',
        label: 'Thị kính Hội tụ',
        material: 'glass',
        ior: 1.58,
        color: '#818cf8',
        points: makeBiconvexLens(615, 240, 82, 24)
      }
    ]
  },
  {
    id: 'parabolic_caustics',
    titleVi: 'Gương Parabol & Tụ sáng Caustics',
    titleEn: 'Parabolic Mirror Caustics',
    emitterMode: 'parallel',
    emitterPos: { x: 105, y: 240 },
    emitterAngleDeg: 0,
    bodies: [
      {
        id: 'mirror-para',
        label: 'Gương Parabol',
        material: 'mirror',
        ior: 1.0,
        color: '#f59e0b',
        points: makeParabolicMirror(730, 240, 320, 110, 12)
      },
      {
        id: 'drop-1',
        label: 'Khối Lục giác Thủy tinh',
        material: 'glass',
        ior: 1.52,
        color: '#38bdf8',
        points: makeRegularPolygon(395, 240, 62, 6, 15)
      }
    ]
  },
  {
    id: 'diamond_sparkle',
    titleVi: 'Kim cương n=2.42 Phản xạ đa tia',
    titleEn: 'Diamond Internal Reflection',
    emitterMode: 'rainbow',
    emitterPos: { x: 110, y: 175 },
    emitterAngleDeg: 14,
    bodies: [
      {
        id: 'diamond-1',
        label: 'Kim cương cắt Giác',
        material: 'diamond',
        ior: 2.42,
        color: '#a78bfa',
        points: makeRegularPolygon(465, 240, 122, 8, 22.5)
      }
    ]
  }
];

function centroid(pts: Vec2[]): Vec2 {
  let sx = 0;
  let sy = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / Math.max(1, pts.length), y: sy / Math.max(1, pts.length) };
}

function pointInPolygon(pt: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

interface RayHit {
  t: number;
  point: Vec2;
  normal: Vec2;
  body: OpticalBody;
}

function intersectScene(origin: Vec2, dir: Vec2, bodies: OpticalBody[]): RayHit | null {
  let best: RayHit | null = null;
  for (const body of bodies) {
    const pts = body.points;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const vx = b.x - a.x;
      const vy = b.y - a.y;
      const denom = dir.x * vy - dir.y * vx;
      if (Math.abs(denom) < 1e-8) continue;
      const dx = a.x - origin.x;
      const dy = a.y - origin.y;
      const t = (dx * vy - dy * vx) / denom;
      const u = (dx * dir.y - dy * dir.x) / denom;
      if (t > 0.45 && u >= 0 && u <= 1) {
        if (!best || t < best.t) {
          const edgeLen = Math.hypot(vx, vy) || 1;
          let nx = -vy / edgeLen;
          let ny = vx / edgeLen;
          // Ensure normal points opposite to incoming ray
          if (nx * dir.x + ny * dir.y > 0) {
            nx = -nx;
            ny = -ny;
          }
          best = {
            t,
            point: { x: origin.x + dir.x * t, y: origin.y + dir.y * t },
            normal: { x: nx, y: ny },
            body
          };
        }
      }
    }
  }
  return best;
}

interface TracedSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  alpha: number;
  width: number;
}

function traceSingleRay(
  start: Vec2,
  dirIn: Vec2,
  color: string,
  wavelengthFactor: number, // -1 (red) to +1 (violet) for Cauchy dispersion
  bodies: OpticalBody[],
  maxBounces = 10,
  width = 1.6,
  alpha = 0.85
): TracedSegment[] {
  const segs: TracedSegment[] = [];
  let origin = { ...start };
  let dir = { ...dirIn };
  const len = Math.hypot(dir.x, dir.y) || 1;
  dir.x /= len;
  dir.y /= len;

  for (let bounce = 0; bounce < maxBounces; bounce++) {
    const hit = intersectScene(origin, dir, bodies);
    if (!hit) {
      segs.push({
        x1: origin.x,
        y1: origin.y,
        x2: origin.x + dir.x * 1300,
        y2: origin.y + dir.y * 1300,
        color,
        alpha,
        width
      });
      break;
    }

    segs.push({
      x1: origin.x,
      y1: origin.y,
      x2: hit.point.x,
      y2: hit.point.y,
      color,
      alpha,
      width
    });

    const n = hit.normal;
    const dot = -(n.x * dir.x + n.y * dir.y);

    if (hit.body.material === 'mirror') {
      const rx = dir.x + 2 * dot * n.x;
      const ry = dir.y + 2 * dot * n.y;
      origin = { x: hit.point.x + rx * 0.6, y: hit.point.y + ry * 0.6 };
      dir = { x: rx, y: ry };
      continue;
    }

    // Determine whether entering or exiting the dielectric polygon
    const probeBefore = { x: hit.point.x - dir.x * 0.8, y: hit.point.y - dir.y * 0.8 };
    const isExiting = pointInPolygon(probeBefore, hit.body.points);
    const dispersedIor = Math.max(1.05, hit.body.ior + wavelengthFactor * 0.065);
    const eta = isExiting ? dispersedIor / 1.0 : 1.0 / dispersedIor;

    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) {
      // Total Internal Reflection (TIR)!
      const rx = dir.x + 2 * dot * n.x;
      const ry = dir.y + 2 * dot * n.y;
      origin = { x: hit.point.x + rx * 0.6, y: hit.point.y + ry * 0.6 };
      dir = { x: rx, y: ry };
    } else {
      // Snell Refraction
      const scaleN = eta * dot - Math.sqrt(k);
      const tx = eta * dir.x + scaleN * n.x;
      const ty = eta * dir.y + scaleN * n.y;
      const tLen = Math.hypot(tx, ty) || 1;
      dir = { x: tx / tLen, y: ty / tLen };
      origin = { x: hit.point.x + dir.x * 0.6, y: hit.point.y + dir.y * 0.6 };
    }
  }
  return segs;
}

const SPECTRUM_BANDS: { color: string; factor: number }[] = [
  { color: '#ef4444', factor: -1.0 },
  { color: '#f97316', factor: -0.65 },
  { color: '#facc15', factor: -0.3 },
  { color: '#22c55e', factor: 0.0 },
  { color: '#06b6d4', factor: 0.35 },
  { color: '#3b82f6', factor: 0.7 },
  { color: '#a855f7', factor: 1.0 }
];

export const FreeformOpticsRayLab: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [presetId, setPresetId] = useState<string>('prism_dispersion');
  const [emitterMode, setEmitterMode] = useState<EmitterMode>('rainbow');
  const [emitterPos, setEmitterPos] = useState<Vec2>({ x: 115, y: 265 });
  const [emitterAngleDeg, setEmitterAngleDeg] = useState<number>(-10);
  const [rayDensity, setRayDensity] = useState<number>(15);
  const [causticBoost, setCausticBoost] = useState<boolean>(true);
  const [showNormals, setShowNormals] = useState<boolean>(false);
  const [bodies, setBodies] = useState<OpticalBody[]>(() =>
    JSON.parse(JSON.stringify(OPTICS_PRESETS[0].bodies))
  );
  const [selectedId, setSelectedId] = useState<string | null>('prism-1');

  // Custom Polygon Draw Mode
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [drawMat, setDrawMat] = useState<ShapeMaterial>('glass');
  const [draftPoints, setDraftPoints] = useState<Vec2[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<{
    type: 'emitter' | 'emitter_aim' | 'body' | null;
    bodyId?: string;
    lastPt: Vec2;
  }>({ type: null, lastPt: { x: 0, y: 0 } });

  const applyPreset = (p: OpticalPreset) => {
    setPresetId(p.id);
    setEmitterMode(p.emitterMode);
    setEmitterPos({ ...p.emitterPos });
    setEmitterAngleDeg(p.emitterAngleDeg);
    const cloned: OpticalBody[] = JSON.parse(JSON.stringify(p.bodies));
    setBodies(cloned);
    setSelectedId(cloned[0]?.id || null);
    setDrawMode(false);
    setDraftPoints([]);
  };

  const selectedBody = useMemo(
    () => bodies.find((b) => b.id === selectedId) || null,
    [bodies, selectedId]
  );

  const addQuickShape = (kind: 'triangle' | 'lens' | 'hexagon' | 'mirror') => {
    const id = `shape-${Date.now()}`;
    const cx = 420 + ((bodies.length * 45) % 160);
    const cy = 220 + ((bodies.length * 25) % 80);
    let body: OpticalBody;
    if (kind === 'triangle') {
      body = {
        id,
        label: isEn ? 'Prism' : 'Lăng kính',
        material: 'glass',
        ior: 1.54,
        color: '#38bdf8',
        points: makeRegularPolygon(cx, cy, 85, 3, -90)
      };
    } else if (kind === 'lens') {
      body = {
        id,
        label: isEn ? 'Convex Lens' : 'Thấu kính Hội tụ',
        material: 'glass',
        ior: 1.52,
        color: '#22d3ee',
        points: makeBiconvexLens(cx, cy, 98, 26)
      };
    } else if (kind === 'hexagon') {
      body = {
        id,
        label: isEn ? 'Diamond Crystal' : 'Tinh thể Kim cương',
        material: 'diamond',
        ior: 2.42,
        color: '#a78bfa',
        points: makeRegularPolygon(cx, cy, 72, 6, 0)
      };
    } else {
      body = {
        id,
        label: isEn ? 'Flat Mirror' : 'Gương phẳng',
        material: 'mirror',
        ior: 1.0,
        color: '#f59e0b',
        points: [
          { x: cx - 8, y: cy - 88 },
          { x: cx + 8, y: cy - 88 },
          { x: cx + 8, y: cy + 88 },
          { x: cx - 8, y: cy + 88 }
        ]
      };
    }
    setBodies((prev) => [...prev, body]);
    setSelectedId(id);
  };

  const rotateSelected = (deg: number) => {
    if (!selectedId) return;
    const rad = (deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    setBodies((prev) =>
      prev.map((b) => {
        if (b.id !== selectedId) return b;
        const c = centroid(b.points);
        return {
          ...b,
          points: b.points.map((p) => {
            const dx = p.x - c.x;
            const dy = p.y - c.y;
            return { x: c.x + dx * cos - dy * sin, y: c.y + dx * sin + dy * cos };
          })
        };
      })
    );
  };

  const finishCustomPolygon = useCallback(() => {
    if (draftPoints.length < 3) {
      setDraftPoints([]);
      setDrawMode(false);
      return;
    }
    const meta = MATERIAL_DEFAULTS[drawMat];
    const id = `custom-${Date.now()}`;
    setBodies((prev) => [
      ...prev,
      {
        id,
        label: isEn ? 'Drawn Optical Shape' : 'Khối quang học tự vẽ',
        material: drawMat,
        ior: meta.ior,
        color: meta.color,
        points: draftPoints
      }
    ]);
    setSelectedId(id);
    setDraftPoints([]);
    setDrawMode(false);
  }, [draftPoints, drawMat, isEn]);

  // Render Raytracing Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Dark optical bench background
    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    // Optical bench grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= LOGICAL_W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, LOGICAL_H);
      ctx.stroke();
    }
    for (let y = 0; y <= LOGICAL_H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(LOGICAL_W, y);
      ctx.stroke();
    }

    // Draw optical bodies
    for (const body of bodies) {
      if (body.points.length < 3) continue;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(body.points[0].x, body.points[0].y);
      for (let i = 1; i < body.points.length; i++) {
        ctx.lineTo(body.points[i].x, body.points[i].y);
      }
      ctx.closePath();

      if (body.material === 'mirror') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.strokeStyle = body.id === selectedId ? '#fde68a' : '#f59e0b';
        ctx.lineWidth = body.id === selectedId ? 2.8 : 2;
      } else {
        ctx.fillStyle = body.id === selectedId ? 'rgba(56, 189, 248, 0.20)' : 'rgba(56, 189, 248, 0.12)';
        ctx.strokeStyle = body.id === selectedId ? '#7dd3fc' : body.color;
        ctx.lineWidth = body.id === selectedId ? 2.4 : 1.5;
      }
      ctx.fill();
      ctx.stroke();

      // Label + IOR tag at centroid
      const c = centroid(body.points);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.78)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        body.material === 'mirror' ? 'MIRROR' : `n = ${body.ior.toFixed(2)}`,
        c.x,
        c.y + 3
      );

      if (showNormals) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)';
        ctx.lineWidth = 1;
        for (let i = 0; i < body.points.length; i++) {
          const a = body.points[i];
          const b = body.points[(i + 1) % body.points.length];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const l = Math.hypot(dx, dy) || 1;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx + (-dy / l) * 14, my + (dx / l) * 14);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Generate rays
    const rad = (emitterAngleDeg * Math.PI) / 180;
    const baseDir = { x: Math.cos(rad), y: Math.sin(rad) };
    const perpDir = { x: -baseDir.y, y: baseDir.x };
    const allSegs: TracedSegment[] = [];

    if (emitterMode === 'laser') {
      allSegs.push(
        ...traceSingleRay(emitterPos, baseDir, '#38bdf8', 0, bodies, 12, 2.4, 0.96)
      );
    } else if (emitterMode === 'parallel') {
      const count = rayDensity;
      const spread = 140;
      for (let i = 0; i < count; i++) {
        const offset = ((i / Math.max(1, count - 1)) - 0.5) * spread;
        const p = {
          x: emitterPos.x + perpDir.x * offset,
          y: emitterPos.y + perpDir.y * offset
        };
        allSegs.push(
          ...traceSingleRay(p, baseDir, '#38bdf8', 0, bodies, 10, 1.35, 0.62)
        );
      }
    } else if (emitterMode === 'rainbow') {
      // Multiple stacked white rays splitting via Cauchy dispersion
      const beamCount = 3;
      for (let b = 0; b < beamCount; b++) {
        const offset = (b - 1) * 8;
        const p = {
          x: emitterPos.x + perpDir.x * offset,
          y: emitterPos.y + perpDir.y * offset
        };
        for (const band of SPECTRUM_BANDS) {
          allSegs.push(
            ...traceSingleRay(p, baseDir, band.color, band.factor, bodies, 9, 1.7, 0.65)
          );
        }
      }
    } else {
      // 360 radial point lamp
      const count = Math.max(24, rayDensity * 2);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const d = { x: Math.cos(a), y: Math.sin(a) };
        allSegs.push(
          ...traceSingleRay(emitterPos, d, '#fbbf24', 0, bodies, 8, 1.15, 0.45)
        );
      }
    }

    // Draw Caustics / Additive Glow
    ctx.save();
    if (causticBoost) {
      ctx.globalCompositeOperation = 'lighter';
    }
    for (const s of allSegs) {
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();

      if (causticBoost && s.width >= 1.5) {
        ctx.globalAlpha = s.alpha * 0.22;
        ctx.lineWidth = s.width * 3.2;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Draw custom polygon draft
    if (drawMode && draftPoints.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#34d399';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(draftPoints[0].x, draftPoints[0].y);
      for (let i = 1; i < draftPoints.length; i++) {
        ctx.lineTo(draftPoints[i].x, draftPoints[i].y);
      }
      if (draftPoints.length >= 3) ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (const p of draftPoints) {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw Emitter Gun + Aim Handle
    ctx.save();
    const aimHandle = {
      x: emitterPos.x + baseDir.x * 46,
      y: emitterPos.y + baseDir.y * 46
    };
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(emitterPos.x, emitterPos.y);
    ctx.lineTo(aimHandle.x, aimHandle.y);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(emitterPos.x, emitterPos.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(emitterPos.x, emitterPos.y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Aim knob
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(aimHandle.x, aimHandle.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [bodies, selectedId, emitterMode, emitterPos, emitterAngleDeg, rayDensity, causticBoost, showNormals, drawMode, draftPoints]);

  const toLogical = (e: React.PointerEvent<HTMLCanvasElement>): Vec2 => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / Math.max(1, rect.width)) * LOGICAL_W,
      y: ((e.clientY - rect.top) / Math.max(1, rect.height)) * LOGICAL_H
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = toLogical(e);
    if (drawMode) {
      setDraftPoints((prev) => [...prev, pt]);
      return;
    }

    const rad = (emitterAngleDeg * Math.PI) / 180;
    const aimHandle = {
      x: emitterPos.x + Math.cos(rad) * 46,
      y: emitterPos.y + Math.sin(rad) * 46
    };
    if (Math.hypot(pt.x - aimHandle.x, pt.y - aimHandle.y) < 16) {
      dragStateRef.current = { type: 'emitter_aim', lastPt: pt };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    if (Math.hypot(pt.x - emitterPos.x, pt.y - emitterPos.y) < 20) {
      dragStateRef.current = { type: 'emitter', lastPt: pt };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    // Check bodies reverse order
    for (let i = bodies.length - 1; i >= 0; i--) {
      if (pointInPolygon(pt, bodies[i].points)) {
        setSelectedId(bodies[i].id);
        dragStateRef.current = { type: 'body', bodyId: bodies[i].id, lastPt: pt };
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
      }
    }
    setSelectedId(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const st = dragStateRef.current;
    if (!st.type) return;
    const pt = toLogical(e);
    const dx = pt.x - st.lastPt.x;
    const dy = pt.y - st.lastPt.y;
    st.lastPt = pt;

    if (st.type === 'emitter') {
      setEmitterPos({
        x: Math.max(20, Math.min(LOGICAL_W - 20, pt.x)),
        y: Math.max(20, Math.min(LOGICAL_H - 20, pt.y))
      });
    } else if (st.type === 'emitter_aim') {
      const deg = (Math.atan2(pt.y - emitterPos.y, pt.x - emitterPos.x) * 180) / Math.PI;
      setEmitterAngleDeg(Math.round(deg));
    } else if (st.type === 'body' && st.bodyId) {
      setBodies((prev) =>
        prev.map((b) =>
          b.id === st.bodyId
            ? { ...b, points: b.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
            : b
        )
      );
    }
  };

  const handlePointerUp = () => {
    dragStateRef.current.type = null;
  };

  return (
    <div
      className={`sim-physics-scope sci-frame rounded-[4px] bg-slate-950 text-slate-100 border border-violet-500/40 overflow-hidden shadow-lg ${
        embedded ? '' : ''
      }`}
    >
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-violet-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              {isEn
                ? 'FREEFORM OPTICAL RAYTRACING & CAUSTICS LAB'
                : 'PHÒNG QUANG HỌC RAYTRACING VẼ TỰ DO · SNELL & TÁN SẮC CAUSTICS'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isEn
              ? 'Drag the light gun, aim the yellow handle, move/rotate prisms or draw any custom glass polygon.'
              : 'Kéo nguồn tia, xoay điểm vàng chỉnh góc, kéo di chuyển lăng kính hoặc bấm Vẽ Khối Tự Do để bắn Laser thực tế.'}
          </p>
        </div>

        {/* Preset Switchers */}
        <div className="flex flex-wrap items-center gap-1.5">
          {OPTICS_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              className={`sim-btn-phy px-2.5 py-1.5 rounded-[3px] text-[11px] font-bold border cursor-pointer whitespace-nowrap ${
                presetId === p.id
                  ? 'sim-btn-active bg-violet-600 border-violet-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-violet-400'
              }`}
            >
              {isEn ? p.titleEn : p.titleVi}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900/75 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 mr-1">
            {isEn ? 'Beam:' : 'Chùm tia:'}
          </span>
          {(
            [
              { id: 'rainbow', labelVi: 'Trắng Tán sắc', labelEn: 'Rainbow' },
              { id: 'parallel', labelVi: 'Song song', labelEn: 'Parallel' },
              { id: 'laser', labelVi: 'Laser đơn', labelEn: 'Single Laser' },
              { id: 'radial', labelVi: 'Tỏa 360°', labelEn: '360° Lamp' }
            ] as { id: EmitterMode; labelVi: string; labelEn: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setEmitterMode(m.id)}
              className={`sim-btn-phy px-2.5 py-1 rounded-[3px] border font-semibold cursor-pointer ${
                emitterMode === m.id
                  ? 'sim-btn-active bg-cyan-600 border-cyan-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isEn ? m.labelEn : m.labelVi}
            </button>
          ))}

          {(emitterMode === 'parallel' || emitterMode === 'radial') && (
            <label className="flex items-center gap-1.5 ml-2 text-[11px] text-slate-300 font-mono">
              <span>{rayDensity} tia</span>
              <input
                type="range"
                min={5}
                max={31}
                step={2}
                value={rayDensity}
                onChange={(e) => setRayDensity(Number(e.target.value))}
                className="w-20 accent-cyan-500"
              />
            </label>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => addQuickShape('triangle')}
            className="sim-btn-phy px-2.5 py-1 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-sky-400" />
            <span>{isEn ? 'Prism' : 'Lăng kính'}</span>
          </button>
          <button
            type="button"
            onClick={() => addQuickShape('lens')}
            className="sim-btn-phy px-2.5 py-1 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>{isEn ? 'Lens' : 'Thấu kính'}</span>
          </button>
          <button
            type="button"
            onClick={() => addQuickShape('mirror')}
            className="sim-btn-phy px-2.5 py-1 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-amber-400" />
            <span>{isEn ? 'Mirror' : 'Gương'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (drawMode && draftPoints.length >= 3) {
                finishCustomPolygon();
              } else {
                setDrawMode((v) => !v);
                setDraftPoints([]);
              }
            }}
            className={`sim-btn-phy sim-btn-hero px-2.5 py-1 rounded-[3px] border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
              drawMode
                ? 'sim-btn-active bg-emerald-600 border-emerald-400 text-white'
                : 'bg-emerald-950/60 border-emerald-500/45 text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>
              {drawMode
                ? draftPoints.length >= 3
                  ? isEn
                    ? `Finish (${draftPoints.length} pts)`
                    : `Khép kín (${draftPoints.length} đỉnh)`
                  : isEn
                  ? 'Click canvas points...'
                  : 'Chấm điểm trên khung...'
                : isEn
                ? 'Draw Freeform'
                : 'Vẽ khối tự do'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCausticBoost((v) => !v)}
            className={`sim-btn-phy px-2.5 py-1 rounded-[3px] border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
              causticBoost
                ? 'sim-btn-active bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Caustics</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNormals((v) => !v)}
            className={`sim-btn-phy px-2.5 py-1 rounded-[3px] border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
              showNormals
                ? 'sim-btn-active bg-rose-500/20 border-rose-400/50 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{isEn ? 'Normals' : 'Pháp tuyến'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Optical Canvas */}
      <div className="relative bg-[#050914] select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={() => {
            if (drawMode && draftPoints.length >= 3) finishCustomPolygon();
          }}
          className="w-full h-[320px] sm:h-[420px] block touch-none cursor-crosshair"
        />

        {drawMode && (
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <span>
              {isEn
                ? 'Click to place vertices, then double-click or press Finish:'
                : 'Nhấp chuột chọn các đỉnh đa giác, rồi bấm Khép kín:'}
            </span>
            <select
              value={drawMat}
              onChange={(e) => setDrawMat(e.target.value as ShapeMaterial)}
              className="px-1.5 py-0.5 rounded bg-slate-900 border border-emerald-500/40 text-xs"
            >
              <option value="glass">{isEn ? 'Glass (1.52)' : 'Thủy tinh (1.52)'}</option>
              <option value="diamond">{isEn ? 'Diamond (2.42)' : 'Kim cương (2.42)'}</option>
              <option value="water">{isEn ? 'Water (1.33)' : 'Nước (1.33)'}</option>
              <option value="mirror">{isEn ? 'Mirror' : 'Gương phản xạ'}</option>
            </select>
            {draftPoints.length >= 3 && (
              <button
                type="button"
                onClick={finishCustomPolygon}
                className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold cursor-pointer"
              >
                {isEn ? 'Done' : 'Xong'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Optical Element Inspector Bar */}
      <div className="px-4 py-2.5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {selectedBody ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono font-bold text-sky-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {selectedBody.label}
            </span>
            {selectedBody.material !== 'mirror' && (
              <label className="flex items-center gap-2 text-slate-300 font-mono">
                <span>n = {selectedBody.ior.toFixed(2)}</span>
                <input
                  type="range"
                  min={1.1}
                  max={2.6}
                  step={0.02}
                  value={selectedBody.ior}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBodies((prev) =>
                      prev.map((b) => (b.id === selectedBody.id ? { ...b, ior: val } : b))
                    );
                  }}
                  className="w-28 accent-violet-500"
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => rotateSelected(-15)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> -15°
            </button>
            <button
              type="button"
              onClick={() => rotateSelected(15)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" /> +15°
            </button>
            <button
              type="button"
              onClick={() => {
                setBodies((prev) => prev.filter((b) => b.id !== selectedBody.id));
                setSelectedId(null);
              }}
              className="px-2 py-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> {isEn ? 'Remove' : 'Xóa khối'}
            </button>
          </div>
        ) : (
          <div className="text-slate-400 font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isEn
                ? 'Click any optical block to adjust refractive index n, rotate, or delete.'
                : 'Bấm vào bất kỳ lăng kính / thấu kính / gương nào để chỉnh chiết suất n hoặc xoay góc.'}
            </span>
          </div>
        )}

        <div className="font-mono text-[11px] text-slate-400">
          n₁·sin(i) = n₂·sin(r) · sin(i_gh) = 1/n
        </div>
      </div>
    </div>
  );
};
