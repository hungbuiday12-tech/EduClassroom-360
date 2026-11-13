import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Move,
  Maximize2,
  Minimize2,
  Compass,
  Ruler,
  Circle as CircleIcon,
  Slash,
  Camera,
  Undo2,
  Grid,
  Trash2,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  ChevronRight,
  Eye,
  Scissors,
  ArrowLeft
} from 'lucide-react';
import { ViewportPortal } from '../common/ViewportPortal';

export interface GeoPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  color?: string;
  isFixed?: boolean;
}

export interface GeoSegment {
  id: string;
  p1Id: string;
  p2Id: string;
  showLength?: boolean;
  color?: string;
  style?: 'solid' | 'dashed';
}

export interface GeoAngle {
  id: string;
  vertexId: string;
  p1Id: string;
  p2Id: string;
  degree: number;
  label?: string;
  color?: string;
}

export interface GeoCircle {
  id: string;
  centerId: string;
  radiusPtId: string;
  color?: string;
}

export interface GeoPolygon {
  id: string;
  pointIds: string[];
  color?: string;
}

type StudioMode = 'free_construction' | 'presets';
type GeoPreset = 'pythagoras' | 'triangle_explorer' | 'circle_tangent' | 'spatial_pyramid';
type FreeTool =
  | 'select'
  | 'point'
  | 'segment'
  | 'angle_degree'
  | 'protractor'
  | 'ruler'
  | 'midpoint'
  | 'circle'
  | 'polygon'
  | 'eraser';

const POINT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GeometryStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Overall studio navigation & fullscreen state
  const [studioMode, setStudioMode] = useState<StudioMode>('free_construction');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Presets state
  const [activePreset, setActivePreset] = useState<GeoPreset>('pythagoras');
  const [spatialRotation, setSpatialRotation] = useState<number>(30);
  const [spatialHeight, setSpatialHeight] = useState<number>(180);

  // Free construction state
  const [activeTool, setActiveTool] = useState<FreeTool>('segment');
  const [selectedAngleDegree, setSelectedAngleDegree] = useState<number>(60);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);

  // Geometric entities for Free Construction
  const [freePoints, setFreePoints] = useState<GeoPoint[]>([
    { id: 'A', x: 200, y: 320, label: 'A' },
    { id: 'B', x: 420, y: 320, label: 'B' },
    { id: 'C', x: 310, y: 150, label: 'C' }
  ]);

  const [freeSegments, setFreeSegments] = useState<GeoSegment[]>([
    { id: 's_AB', p1Id: 'A', p2Id: 'B', showLength: true },
    { id: 's_BC', p1Id: 'B', p2Id: 'C', showLength: true },
    { id: 's_CA', p1Id: 'C', p2Id: 'A', showLength: true }
  ]);

  const [freeAngles, setFreeAngles] = useState<GeoAngle[]>([
    { id: 'a_BAC', vertexId: 'A', p1Id: 'B', p2Id: 'C', degree: 57.1 }
  ]);

  const [freeCircles, setFreeCircles] = useState<GeoCircle[]>([]);
  const [freePolygons, setFreePolygons] = useState<GeoPolygon[]>([]);

  // Virtual Measurement Instruments
  const [protractor, setProtractor] = useState({
    visible: true,
    x: 480,
    y: 240,
    rotation: 0, // degrees
    radius: 120,
    isDragging: false,
    isRotating: false
  });

  const [ruler, setRuler] = useState({
    visible: false,
    x: 180,
    y: 400,
    rotation: 0,
    length: 300, // 15 cm
    isDragging: false,
    isRotating: false
  });

  // Construction interaction states
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [isDraggingCanvasPoint, setIsDraggingCanvasPoint] = useState<boolean>(false);
  const [pendingPointId, setPendingPointId] = useState<string | null>(null);
  const [polygonPendingIds, setPolygonPendingIds] = useState<string[]>([]);

  // Presets points state
  const [presetPoints, setPresetPoints] = useState<Record<GeoPreset, GeoPoint[]>>({
    pythagoras: [
      { id: 'A', x: 220, y: 150, label: 'A' },
      { id: 'B', x: 220, y: 350, label: 'B' },
      { id: 'C', x: 480, y: 350, label: 'C' }
    ],
    triangle_explorer: [
      { id: 'A', x: 300, y: 120, label: 'A' },
      { id: 'B', x: 180, y: 360, label: 'B' },
      { id: 'C', x: 460, y: 340, label: 'C' }
    ],
    circle_tangent: [
      { id: 'O', x: 300, y: 250, label: 'O', isFixed: true },
      { id: 'R', x: 420, y: 250, label: 'R' },
      { id: 'P', x: 520, y: 160, label: 'P' }
    ],
    spatial_pyramid: []
  });

  // History for Undo
  const [history, setHistory] = useState<string[]>([]);

  const pushHistory = useCallback(() => {
    const snapshot = JSON.stringify({
      points: freePoints,
      segments: freeSegments,
      angles: freeAngles,
      circles: freeCircles,
      polygons: freePolygons
    });
    setHistory((prev) => [...prev.slice(-15), snapshot]);
  }, [freePoints, freeSegments, freeAngles, freeCircles, freePolygons]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    try {
      const data = JSON.parse(last);
      setFreePoints(data.points || []);
      setFreeSegments(data.segments || []);
      setFreeAngles(data.angles || []);
      setFreeCircles(data.circles || []);
      setFreePolygons(data.polygons || []);
    } catch {}
  };

  // Listen for Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, history]);

  // Math Helpers
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  };

  const getNextPointLabel = (existing: GeoPoint[]) => {
    const usedLabels = new Set(existing.map((p) => p.label));
    for (let i = 0; i < POINT_ALPHABET.length; i++) {
      const char = POINT_ALPHABET[i];
      if (!usedLabels.has(char)) return char;
    }
    return `P${existing.length + 1}`;
  };

  // Convert distance pixels to cm (e.g. 25px = 1cm)
  const pxToCm = (px: number) => (px / 25).toFixed(1);

  // Compute angle between 3 points in degrees
  const computeAngleDeg = (p1: { x: number; y: number }, vertex: { x: number; y: number }, p2: { x: number; y: number }) => {
    const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);
    if (mag1 === 0 || mag2 === 0) return 0;
    const cosTheta = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return (Math.acos(cosTheta) * 180) / Math.PI;
  };

  // Re-draw Canvas Effect
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

    // Canvas Background
    ctx.fillStyle = isDark ? '#080c18' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Grid lines & coordinate markings
    if (showGrid) {
      ctx.strokeStyle = isDark ? 'rgba(51, 65, 85, 0.28)' : 'rgba(226, 232, 240, 0.85)';
      ctx.lineWidth = 1;
      const step = 25; // 1 cm in screen units
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid lines every 100px (4cm)
      ctx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1.2;
      for (let x = 0; x <= width; x += step * 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += step * 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // ==========================================
    // 1. FREE CONSTRUCTION RENDERING
    // ==========================================
    if (studioMode === 'free_construction') {
      const pointMap = new Map<string, GeoPoint>();
      freePoints.forEach((p) => pointMap.set(p.id, p));

      // Draw Polygons
      freePolygons.forEach((poly) => {
        const pts = poly.pointIds.map((id) => pointMap.get(id)).filter(Boolean) as GeoPoint[];
        if (pts.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = poly.color || 'rgba(99, 102, 241, 0.08)';
          ctx.fill();
          ctx.strokeStyle = poly.color || '#6366f1';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw Circles
      freeCircles.forEach((c) => {
        const center = pointMap.get(c.centerId);
        const radPt = pointMap.get(c.radiusPtId);
        if (center && radPt) {
          const radius = dist(center, radPt);
          ctx.beginPath();
          ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.06)';
          ctx.fill();
          ctx.strokeStyle = c.color || '#06b6d4';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Radius dashed line
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#0891b2';
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(radPt.x, radPt.y);
          ctx.stroke();
          ctx.restore();

          if (showMeasurements) {
            const midX = (center.x + radPt.x) / 2;
            const midY = (center.y + radPt.y) / 2;
            ctx.fillStyle = '#0891b2';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillText(`R = ${pxToCm(radius)}cm`, midX + 6, midY - 6);
          }
        }
      });

      // Draw Segments
      freeSegments.forEach((seg) => {
        const p1 = pointMap.get(seg.p1Id);
        const p2 = pointMap.get(seg.p2Id);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = seg.color || (isDark ? '#e2e8f0' : '#1e293b');
          ctx.lineWidth = 2.4;
          if (seg.style === 'dashed') {
            ctx.setLineDash([5, 4]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Length Measurement
          if (showMeasurements && seg.showLength !== false) {
            const lengthCm = pxToCm(dist(p1, p2));
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            // Offset tag perpendicular to segment
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);
            const nx = len > 0 ? -dy / len : 0;
            const ny = len > 0 ? dx / len : 0;
            const tagX = midX + nx * 14;
            const tagY = midY + ny * 14;

            ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillText(`${p1.label}${p2.label} = ${lengthCm}cm`, tagX - 18, tagY + 3);
          }
        }
      });

      // Draw Angles
      freeAngles.forEach((ang) => {
        const vertex = pointMap.get(ang.vertexId);
        const p1 = pointMap.get(ang.p1Id);
        const p2 = pointMap.get(ang.p2Id);
        if (vertex && p1 && p2) {
          const angle1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
          const angle2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
          const currentDeg = computeAngleDeg(p1, vertex, p2);
          const arcRadius = 28;

          const isRightAngle = Math.abs(currentDeg - 90) < 1.5;

          if (isRightAngle) {
            // Draw Right Angle Square Marker
            const v1 = { x: (p1.x - vertex.x) / dist(p1, vertex), y: (p1.y - vertex.y) / dist(p1, vertex) };
            const v2 = { x: (p2.x - vertex.x) / dist(p2, vertex), y: (p2.y - vertex.y) / dist(p2, vertex) };
            const sq = 16;
            const c1 = { x: vertex.x + v1.x * sq, y: vertex.y + v1.y * sq };
            const c2 = { x: vertex.x + v2.x * sq, y: vertex.y + v2.y * sq };
            const corner = { x: c1.x + v2.x * sq, y: c1.y + v2.y * sq };

            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(corner.x, corner.y);
            ctx.lineTo(c2.x, c2.y);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          } else {
            // Draw Arc
            ctx.beginPath();
            let start = angle1;
            let end = angle2;
            let diff = end - start;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            ctx.arc(vertex.x, vertex.y, arcRadius, start, start + diff, diff < 0);
            ctx.strokeStyle = ang.color || '#f59e0b';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Arc fill
            ctx.beginPath();
            ctx.moveTo(vertex.x, vertex.y);
            ctx.arc(vertex.x, vertex.y, arcRadius, start, start + diff, diff < 0);
            ctx.closePath();
            ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
            ctx.fill();
          }

          // Angle Text Label
          if (showMeasurements) {
            const midAngle = (angle1 + angle2) / 2;
            const labelDist = 42;
            const lx = vertex.x + Math.cos(midAngle) * labelDist;
            const ly = vertex.y + Math.sin(midAngle) * labelDist;
            ctx.fillStyle = '#d97706';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillText(`${currentDeg.toFixed(1)}°`, lx - 10, ly + 4);
          }
        }
      });

      // Draw Virtual Protractor
      if (protractor.visible) {
        ctx.save();
        ctx.translate(protractor.x, protractor.y);
        ctx.rotate((protractor.rotation * Math.PI) / 180);

        const prR = protractor.radius;
        // Transparent acrylic body
        ctx.beginPath();
        ctx.arc(0, 0, prR, 0, Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.72)' : 'rgba(224, 242, 254, 0.78)';
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner cutout
        ctx.beginPath();
        ctx.arc(0, 0, prR * 0.45, 0, Math.PI, true);
        ctx.closePath();
        ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(14, 116, 144, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Origin crosshair
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(12, 0);
        ctx.moveTo(0, -12);
        ctx.lineTo(0, 12);
        ctx.stroke();

        // Degree markings 0° to 180°
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let deg = 0; deg <= 180; deg += 1) {
          const rad = Math.PI - (deg * Math.PI) / 180;
          const isMajor = deg % 10 === 0;
          const isMedium = deg % 5 === 0;
          const tickLen = isMajor ? 12 : isMedium ? 8 : 4;

          const x1 = Math.cos(rad) * prR;
          const y1 = -Math.sin(rad) * prR;
          const x2 = Math.cos(rad) * (prR - tickLen);
          const y2 = -Math.sin(rad) * (prR - tickLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = isMajor ? '#0369a1' : isDark ? '#94a3b8' : '#64748b';
          ctx.lineWidth = isMajor ? 1.4 : 0.8;
          ctx.stroke();

          // Numbers at major intervals
          if (isMajor && deg > 0 && deg < 180) {
            const numX = Math.cos(rad) * (prR - 22);
            const numY = -Math.sin(rad) * (prR - 22);
            ctx.fillStyle = isDark ? '#f8fafc' : '#0369a1';
            ctx.fillText(`${deg}°`, numX, numY);
          }
        }

        // Rotation Handle indicator at 0° edge
        ctx.beginPath();
        ctx.arc(prR - 10, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      // Draw Virtual Ruler
      if (ruler.visible) {
        ctx.save();
        ctx.translate(ruler.x, ruler.y);
        ctx.rotate((ruler.rotation * Math.PI) / 180);

        const rLen = ruler.length;
        const rH = 46;

        // Ruler acrylic body
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.82)' : 'rgba(254, 243, 199, 0.82)';
        ctx.fillRect(0, -rH / 2, rLen, rH);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(0, -rH / 2, rLen, rH);

        // Centimeter & millimeter ticks (25px per cm)
        const cmPx = 25;
        const totalCm = Math.floor(rLen / cmPx);

        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isDark ? '#f8fafc' : '#78350f';
        ctx.textAlign = 'center';

        for (let mm = 0; mm <= totalCm * 10; mm++) {
          const posX = (mm / 10) * cmPx;
          if (posX > rLen) break;
          const isCm = mm % 10 === 0;
          const isHalfCm = mm % 5 === 0;
          const tickH = isCm ? 14 : isHalfCm ? 9 : 5;

          ctx.beginPath();
          ctx.moveTo(posX, -rH / 2);
          ctx.lineTo(posX, -rH / 2 + tickH);
          ctx.strokeStyle = isCm ? '#b45309' : '#d97706';
          ctx.lineWidth = isCm ? 1.4 : 0.8;
          ctx.stroke();

          if (isCm) {
            ctx.fillText(`${mm / 10}`, posX, -rH / 2 + 24);
          }
        }

        ctx.restore();
      }

      // Draw Points
      freePoints.forEach((p) => {
        const isSelected = p.id === selectedPointId;
        const isPending = p.id === pendingPointId || polygonPendingIds.includes(p.id);

        ctx.fillStyle = isSelected ? '#ef4444' : isPending ? '#10b981' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(p.x, p.y, isSelected ? 7 : 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillText(p.label, p.x + 8, p.y - 8);
      });
    }

    // ==========================================
    // 2. THEOREM PRESETS RENDERING
    // ==========================================
    if (studioMode === 'presets') {
      const activePts = presetPoints[activePreset] || [];

      if (activePreset === 'pythagoras') {
        const pA = activePts.find((p) => p.id === 'A') || { x: 220, y: 150, label: 'A', id: 'A' };
        const pB = activePts.find((p) => p.id === 'B') || { x: 220, y: 350, label: 'B', id: 'B' };
        const pC = activePts.find((p) => p.id === 'C') || { x: 480, y: 350, label: 'C', id: 'C' };

        const c = dist(pA, pB);
        const a = dist(pB, pC);
        const b = dist(pA, pC);

        // Square AB (left)
        ctx.fillStyle = 'rgba(59, 130, 246, 0.16)';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(pB.x - c, pA.y, c, c);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#2563eb';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`c² = ${((c * c) / 1000).toFixed(1)}k`, pB.x - c / 2 - 25, pA.y + c / 2);

        // Square BC (bottom)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.rect(pB.x, pB.y, a, a);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#059669';
        ctx.fillText(`a² = ${((a * a) / 1000).toFixed(1)}k`, pB.x + a / 2 - 25, pB.y + a / 2);

        // Square AC (hypotenuse)
        const dx = pC.x - pA.x;
        const dy = pC.y - pA.y;
        const nx = -dy;
        const ny = dx;

        ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.lineTo(pC.x + nx, pC.y + ny);
        ctx.lineTo(pA.x + nx, pA.y + ny);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#d97706';
        ctx.fillText(`b² = ${((b * b) / 1000).toFixed(1)}k`, pA.x + nx / 2 + dx / 2 - 25, pA.y + ny / 2 + dy / 2);

        // Triangle ABC
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(241, 245, 249, 0.95)';
        ctx.strokeStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right angle at B
        const sqSize = 16;
        ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pB.x, pB.y - sqSize);
        ctx.lineTo(pB.x + sqSize, pB.y - sqSize);
        ctx.lineTo(pB.x + sqSize, pB.y);
        ctx.stroke();
      } else if (activePreset === 'triangle_explorer') {
        const pA = activePts.find((p) => p.id === 'A') || { x: 300, y: 120, label: 'A', id: 'A' };
        const pB = activePts.find((p) => p.id === 'B') || { x: 180, y: 360, label: 'B', id: 'B' };
        const pC = activePts.find((p) => p.id === 'C') || { x: 460, y: 340, label: 'C', id: 'C' };

        // Triangle
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

        // Centroid G
        const gX = (pA.x + pB.x + pC.x) / 3;
        const gY = (pA.y + pB.y + pC.y) / 3;

        // Medians
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
        ctx.lineWidth = 1.2;

        const mBC = { x: (pB.x + pC.x) / 2, y: (pB.y + pC.y) / 2 };
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(mBC.x, mBC.y);
        ctx.stroke();

        const mAC = { x: (pA.x + pC.x) / 2, y: (pA.y + pC.y) / 2 };
        ctx.beginPath();
        ctx.moveTo(pB.x, pB.y);
        ctx.lineTo(mAC.x, mAC.y);
        ctx.stroke();
        ctx.restore();

        // Point G
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(gX, gY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText('G (Trọng tâm)', gX + 8, gY + 4);

        // Vertex angles
        const angA = computeAngleDeg(pB, pA, pC);
        const angB = computeAngleDeg(pA, pB, pC);
        const angC = computeAngleDeg(pA, pC, pB);

        ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`∠A: ${angA.toFixed(1)}°`, pA.x - 15, pA.y - 14);
        ctx.fillText(`∠B: ${angB.toFixed(1)}°`, pB.x - 40, pB.y + 18);
        ctx.fillText(`∠C: ${angC.toFixed(1)}°`, pC.x + 10, pC.y + 18);
      } else if (activePreset === 'circle_tangent') {
        const pO = activePts.find((p) => p.id === 'O') || { x: 300, y: 250, label: 'O', id: 'O' };
        const pR = activePts.find((p) => p.id === 'R') || { x: 420, y: 250, label: 'R', id: 'R' };
        const pP = activePts.find((p) => p.id === 'P') || { x: 520, y: 160, label: 'P', id: 'P' };

        const radius = dist(pO, pR);

        // Circle
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(pO.x, pO.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Radius
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pO.x, pO.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();

        const dOP = dist(pO, pP);
        if (dOP > radius) {
          const theta = Math.acos(radius / dOP);
          const phi = Math.atan2(pP.y - pO.y, pP.x - pO.x);

          const t1X = pO.x + radius * Math.cos(phi - theta);
          const t1Y = pO.y + radius * Math.sin(phi - theta);
          const t2X = pO.x + radius * Math.cos(phi + theta);
          const t2Y = pO.y + radius * Math.sin(phi + theta);

          // Tangents
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pP.x, pP.y);
          ctx.lineTo(t1X, t1Y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(pP.x, pP.y);
          ctx.lineTo(t2X, t2Y);
          ctx.stroke();

          // Normal radii
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

          [
            { x: t1X, y: t1Y, l: 'T₁' },
            { x: t2X, y: t2Y, l: 'T₂' }
          ].forEach((t) => {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(t.x, t.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.fillText(t.l, t.x + 6, t.y - 6);
          });
        }
      } else if (activePreset === 'spatial_pyramid') {
        const rad = (spatialRotation * Math.PI) / 180;
        const cosR = Math.cos(rad);
        const sinR = Math.sin(rad);

        const centerX = width / 2;
        const baseY = height / 2 + 70;
        const baseR = 130;

        const baseLocal = [
          { x: -baseR, y: -baseR * 0.5 },
          { x: baseR, y: -baseR * 0.5 },
          { x: baseR, y: baseR * 0.5 },
          { x: -baseR, y: baseR * 0.5 }
        ];

        const proj = baseLocal.map((pt) => {
          const rotX = pt.x * cosR - pt.y * sinR;
          const rotY = (pt.x * sinR + pt.y * cosR) * 0.5;
          return { x: centerX + rotX, y: baseY + rotY };
        });

        const apexS = { x: centerX, y: baseY - spatialHeight };
        const centerO = {
          x: (proj[0].x + proj[1].x + proj[2].x + proj[3].x) / 4,
          y: (proj[0].y + proj[1].y + proj[2].y + proj[3].y) / 4
        };

        // Dashed altitude SO
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(apexS.x, apexS.y);
        ctx.lineTo(centerO.x, centerO.y);
        ctx.stroke();

        // Base diagonals
        ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.moveTo(proj[1].x, proj[1].y);
        ctx.lineTo(proj[3].x, proj[3].y);
        ctx.stroke();

        // Hidden edges
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[1].x, proj[1].y);
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[3].x, proj[3].y);
        ctx.moveTo(apexS.x, apexS.y);
        ctx.lineTo(proj[0].x, proj[0].y);
        ctx.stroke();
        ctx.restore();

        // Visible Base edges
        ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(proj[3].x, proj[3].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.lineTo(proj[1].x, proj[1].y);
        ctx.stroke();

        // Visible Side edges
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

      // Draw vertex handles for 2D presets
      activePts.forEach((p) => {
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
    }
  }, [
    studioMode,
    activePreset,
    freePoints,
    freeSegments,
    freeAngles,
    freeCircles,
    freePolygons,
    protractor,
    ruler,
    presetPoints,
    selectedPointId,
    pendingPointId,
    polygonPendingIds,
    spatialRotation,
    spatialHeight,
    showGrid,
    showMeasurements
  ]);

  // Handle Canvas Pointer Actions (mouse + touch + stylus)
  const handleCanvasMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    if (snapToGrid && showGrid) {
      mx = Math.round(mx / 25) * 25;
      my = Math.round(my / 25) * 25;
    }

    // Check if dragging protractor
    if (protractor.visible && studioMode === 'free_construction') {
      const dProtCenter = Math.hypot(mx - protractor.x, my - protractor.y);
      if (dProtCenter < 24) {
        setProtractor((prev) => ({ ...prev, isDragging: true }));
        return;
      }
      // Check rotation handle at right edge
      const handleRad = (protractor.rotation * Math.PI) / 180;
      const hX = protractor.x + Math.cos(handleRad) * (protractor.radius - 10);
      const hY = protractor.y + Math.sin(handleRad) * (protractor.radius - 10);
      if (Math.hypot(mx - hX, my - hY) < 18) {
        setProtractor((prev) => ({ ...prev, isRotating: true }));
        return;
      }
    }

    // Preset interactions
    if (studioMode === 'presets') {
      const activePts = presetPoints[activePreset] || [];
      const clicked = activePts.find((p) => dist(p, { x: mx, y: my }) < 20);
      if (clicked && !clicked.isFixed) {
        setSelectedPointId(clicked.id);
        setIsDraggingCanvasPoint(true);
      }
      return;
    }

    // ==========================================
    // Free Construction Tool Actions
    // ==========================================
    const clickedPt = freePoints.find((p) => dist(p, { x: mx, y: my }) < 18);

    if (activeTool === 'select') {
      if (clickedPt) {
        setSelectedPointId(clickedPt.id);
        setIsDraggingCanvasPoint(true);
      } else {
        setSelectedPointId(null);
      }
    } else if (activeTool === 'point') {
      pushHistory();
      const label = getNextPointLabel(freePoints);
      const newPt: GeoPoint = { id: `pt_${Date.now()}`, x: mx, y: my, label };
      setFreePoints((prev) => [...prev, newPt]);
    } else if (activeTool === 'segment') {
      pushHistory();
      let p1 = clickedPt;
      if (!p1) {
        const label = getNextPointLabel(freePoints);
        p1 = { id: `pt_${Date.now()}`, x: mx, y: my, label };
        setFreePoints((prev) => [...prev, p1!]);
      }

      if (!pendingPointId) {
        setPendingPointId(p1.id);
      } else if (pendingPointId !== p1.id) {
        // Complete segment
        const newSeg: GeoSegment = {
          id: `seg_${Date.now()}`,
          p1Id: pendingPointId,
          p2Id: p1.id,
          showLength: true
        };
        setFreeSegments((prev) => [...prev, newSeg]);
        setPendingPointId(null);
      }
    } else if (activeTool === 'angle_degree') {
      // Draw Angle with exact degrees
      pushHistory();
      let vertex = clickedPt;
      if (!vertex) {
        const vLabel = getNextPointLabel(freePoints);
        vertex = { id: `pt_${Date.now()}_O`, x: mx, y: my, label: vLabel };
      }

      // Generate arm 1 (horizontal right or user pos) and arm 2 at selectedAngleDegree
      const armLength = 120; // ~4.8 cm
      const arm1: GeoPoint = {
        id: `pt_${Date.now()}_A`,
        x: vertex.x + armLength,
        y: vertex.y,
        label: getNextPointLabel(clickedPt ? [...freePoints] : [...freePoints, vertex])
      };

      const rad = (-selectedAngleDegree * Math.PI) / 180;
      const arm2: GeoPoint = {
        id: `pt_${Date.now()}_B`,
        x: vertex.x + Math.round(armLength * Math.cos(rad)),
        y: vertex.y + Math.round(armLength * Math.sin(rad)),
        label: getNextPointLabel([...freePoints, vertex, arm1])
      };

      const seg1: GeoSegment = { id: `seg_${Date.now()}_1`, p1Id: vertex.id, p2Id: arm1.id, showLength: true };
      const seg2: GeoSegment = { id: `seg_${Date.now()}_2`, p1Id: vertex.id, p2Id: arm2.id, showLength: true };
      const angleObj: GeoAngle = {
        id: `ang_${Date.now()}`,
        vertexId: vertex.id,
        p1Id: arm1.id,
        p2Id: arm2.id,
        degree: selectedAngleDegree
      };

      setFreePoints((prev) => (clickedPt ? [...prev, arm1, arm2] : [...prev, vertex!, arm1, arm2]));
      setFreeSegments((prev) => [...prev, seg1, seg2]);
      setFreeAngles((prev) => [...prev, angleObj]);
    } else if (activeTool === 'midpoint') {
      if (!pendingPointId) {
        if (clickedPt) setPendingPointId(clickedPt.id);
      } else if (clickedPt && pendingPointId !== clickedPt.id) {
        pushHistory();
        const p1 = freePoints.find((p) => p.id === pendingPointId);
        const p2 = clickedPt;
        if (p1 && p2) {
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const midPt: GeoPoint = {
            id: `mid_${Date.now()}`,
            x: midX,
            y: midY,
            label: `M`
          };
          setFreePoints((prev) => [...prev, midPt]);
        }
        setPendingPointId(null);
      }
    } else if (activeTool === 'circle') {
      if (!pendingPointId) {
        let center = clickedPt;
        if (!center) {
          center = { id: `pt_${Date.now()}`, x: mx, y: my, label: 'O' };
          setFreePoints((prev) => [...prev, center!]);
        }
        setPendingPointId(center.id);
      } else {
        pushHistory();
        let radPt = clickedPt;
        if (!radPt) {
          radPt = { id: `pt_${Date.now()}_R`, x: mx, y: my, label: 'R' };
          setFreePoints((prev) => [...prev, radPt!]);
        }
        const newCircle: GeoCircle = {
          id: `circ_${Date.now()}`,
          centerId: pendingPointId,
          radiusPtId: radPt.id
        };
        setFreeCircles((prev) => [...prev, newCircle]);
        setPendingPointId(null);
      }
    } else if (activeTool === 'eraser') {
      pushHistory();
      if (clickedPt) {
        setFreePoints((pts) => pts.filter((p) => p.id !== clickedPt.id));
        setFreeSegments((segs) => segs.filter((s) => s.p1Id !== clickedPt.id && s.p2Id !== clickedPt.id));
        setFreeAngles((angs) =>
          angs.filter((a) => a.vertexId !== clickedPt.id && a.p1Id !== clickedPt.id && a.p2Id !== clickedPt.id)
        );
        setFreeCircles((circs) => circs.filter((c) => c.centerId !== clickedPt.id && c.radiusPtId !== clickedPt.id));
      }
    }
  };

  const handleCanvasMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    // Protractor dragging
    if (protractor.isDragging) {
      setProtractor((prev) => ({ ...prev, x: mx, y: my }));
      return;
    }
    // Protractor rotating
    if (protractor.isRotating) {
      const angleRad = Math.atan2(my - protractor.y, mx - protractor.x);
      const angleDeg = (angleRad * 180) / Math.PI;
      setProtractor((prev) => ({ ...prev, rotation: angleDeg }));
      return;
    }

    if (!isDraggingCanvasPoint || !selectedPointId) return;

    if (snapToGrid && showGrid) {
      mx = Math.round(mx / 25) * 25;
      my = Math.round(my / 25) * 25;
    }

    if (studioMode === 'presets') {
      setPresetPoints((prev) => {
        const curList = prev[activePreset] || [];
        const updated = curList.map((p) => {
          if (p.id === selectedPointId) {
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
    } else {
      // Free Construction move point
      setFreePoints((pts) => pts.map((p) => (p.id === selectedPointId ? { ...p, x: mx, y: my } : p)));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvasPoint(false);
    setProtractor((prev) => ({ ...prev, isDragging: false, isRotating: false }));
    setRuler((prev) => ({ ...prev, isDragging: false, isRotating: false }));
  };

  // Export Screenshot
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `hinh_hoc_${studioMode === 'free_construction' ? 've_tu_do' : activePreset}.png`;
    a.click();
  };

  const handleClearAll = () => {
    pushHistory();
    setFreePoints([]);
    setFreeSegments([]);
    setFreeAngles([]);
    setFreeCircles([]);
    setFreePolygons([]);
    setPendingPointId(null);
  };

  return (
    <ViewportPortal active={isFullScreen}>
      <div
        className={
          isFullScreen
            ? 'fixed inset-0 z-[100] h-[100dvh] w-screen p-3 sm:p-5 bg-slate-100/98 dark:bg-slate-950/98 backdrop-blur-xl flex flex-col lg:flex-row gap-4 overflow-y-auto lg:overflow-hidden'
            : 'flex flex-col lg:flex-row gap-6 h-full'
        }
      >
        {/* MAIN: Geometry Drawing Stage */}
        <div className={`flex-1 flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs ${isFullScreen ? 'min-h-[420px] lg:min-h-0' : ''}`}>
          {/* Top Studio Switcher & Fullscreen Action */}
          <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 gap-2 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              {isFullScreen && (
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại (Esc)</span>
                </button>
              )}
              {/* Studio Mode Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setStudioMode('free_construction')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                studioMode === 'free_construction'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Vẽ hình tự do & Đo đạc
            </button>
            <button
              onClick={() => setStudioMode('presets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                studioMode === 'presets'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Mô hình định lý mẫu
            </button>
          </div>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5">
            {studioMode === 'free_construction' && (
              <>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  title={showGrid ? 'Ẩn lưới toạ độ' : 'Hiện lưới toạ độ'}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                    showGrid
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMeasurements(!showMeasurements)}
                  title={showMeasurements ? 'Ẩn số đo kích thước' : 'Hiện số đo kích thước'}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                    showMeasurements
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                </button>
                <button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  title="Hoàn tác (Ctrl+Z)"
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md disabled:opacity-40 transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearAll}
                  title="Xoá toàn bộ hình vẽ"
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleExportPNG}
              title="Xuất ảnh PNG chất lượng cao"
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* FULLSCREEN TOGGLE BUTTON */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Thu nhỏ (Esc)' : 'Toàn màn hình hình học (Full Screen)'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isFullScreen
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Thu nhỏ</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Toàn màn hình</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Free Construction Active Tool Palette Banner */}
        {studioMode === 'free_construction' && (
          <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTool('select')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'select'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                Chọn & Di chuyển
              </button>

              <button
                onClick={() => setActiveTool('segment')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'segment'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Slash className="w-3.5 h-3.5" />
                Vẽ đoạn thẳng (Đo độ dài)
              </button>

              <button
                onClick={() => setActiveTool('angle_degree')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'angle_degree'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Vẽ góc theo số đo ({selectedAngleDegree}°)
              </button>

              <button
                onClick={() => setActiveTool('point')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'point'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Vẽ điểm
              </button>

              <button
                onClick={() => setActiveTool('midpoint')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'midpoint'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Trung điểm M
              </button>

              <button
                onClick={() => setActiveTool('circle')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'circle'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <CircleIcon className="w-3.5 h-3.5" />
                Đường tròn (O, R)
              </button>

              <button
                onClick={() => setProtractor((p) => ({ ...p, visible: !p.visible }))}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  protractor.visible
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300/50'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Thước đo độ ảo {protractor.visible ? '✓' : ''}
              </button>

              <button
                onClick={() => setActiveTool('eraser')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTool === 'eraser'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                Tẩy xoá
              </button>
            </div>

            {/* Quick Angle Degree Switcher */}
            {activeTool === 'angle_degree' && (
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md border border-amber-200/60 dark:border-amber-900/60">
                <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">Góc:</span>
                {[30, 45, 60, 90, 120, 135].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setSelectedAngleDegree(deg)}
                    className={`px-1.5 py-0.5 text-[11px] font-mono rounded font-semibold transition-colors ${
                      selectedAngleDegree === deg
                        ? 'bg-amber-600 text-white'
                        : 'text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
                <input
                  type="number"
                  min="1"
                  max="359"
                  value={selectedAngleDegree}
                  onChange={(e) => setSelectedAngleDegree(Math.max(1, Math.min(359, parseInt(e.target.value) || 60)))}
                  className="w-12 px-1 text-center text-xs font-mono bg-white dark:bg-slate-800 border border-amber-300 rounded text-slate-800 dark:text-slate-200"
                />
              </div>
            )}
          </div>
        )}

        {/* Preset Sub-tabs Banner */}
        {studioMode === 'presets' && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 overflow-x-auto">
            <button
              onClick={() => setActivePreset('pythagoras')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'pythagoras'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Định lý Pythagoras
            </button>
            <button
              onClick={() => setActivePreset('triangle_explorer')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'triangle_explorer'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Tam giác & Trọng tâm G
            </button>
            <button
              onClick={() => setActivePreset('circle_tangent')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'circle_tangent'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Đường tròn & 2 Tiếp tuyến
            </button>
            <button
              onClick={() => setActivePreset('spatial_pyramid')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activePreset === 'spatial_pyramid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Hình không gian 3D (Chóp tứ giác đều)
            </button>
          </div>
        )}

        {/* Canvas Area */}
        <div className="relative flex-1 min-h-[360px] sm:min-h-[500px] bg-slate-900/5 dark:bg-black/25">
          <canvas
            ref={canvasRef}
            onPointerDown={handleCanvasMouseDown}
            onPointerMove={handleCanvasMouseMove}
            onPointerUp={handleCanvasMouseUp}
            onPointerCancel={handleCanvasMouseUp}
            onPointerLeave={handleCanvasMouseUp}
            className="w-full h-full cursor-crosshair block touch-none"
          />

          {/* Pending Point Floating Instruction */}
          {pendingPointId && (
            <div className="absolute top-3 left-4 bg-indigo-600/90 text-white text-xs px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm animate-pulse">
              Đang chọn điểm thứ 2 để hoàn tất dựng hình...
            </div>
          )}

          {/* Instructions Overlay Bottom Left */}
          <div className="absolute bottom-3 left-4 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>
              {studioMode === 'free_construction'
                ? activeTool === 'segment'
                  ? 'Nhấp 2 điểm để vẽ đoạn thẳng và tự động đo độ dài (cm).'
                  : activeTool === 'angle_degree'
                  ? `Nhấp đỉnh để dựng góc chính xác ${selectedAngleDegree}° có cung tròn và nhãn số đo.`
                  : activeTool === 'select'
                  ? 'Kéo thả các điểm để co giãn biến hình tự do.'
                  : 'Chọn công cụ phía trên để tương tác vẽ hình.'
                : 'Kéo các điểm tròn xanh hoặc điều chỉnh thanh trượt để khảo sát định lý.'}
            </span>
          </div>
        </div>
      </div>

      {/* SIDEBAR: Properties, Tools, & Theory Explorer */}
      <div className={`w-full lg:w-96 flex flex-col gap-4 ${isFullScreen ? 'lg:overflow-y-auto lg:pr-1 shrink-0 pb-4 lg:pb-0' : ''}`}>
        {studioMode === 'free_construction' ? (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" />
                Bảng thông số & Đo đạc
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {freePoints.length} điểm · {freeSegments.length} đoạn · {freeAngles.length} góc
              </span>
            </div>

            {/* Custom Angle Selector */}
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-950 dark:text-indigo-200 mb-2">
                <span>Vẽ góc theo số đo chính xác</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                  {selectedAngleDegree}°
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={selectedAngleDegree}
                onChange={(e) => setSelectedAngleDegree(parseInt(e.target.value))}
                className="w-full h-1.5 bg-indigo-200 dark:bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-2"
              />
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {[30, 45, 60, 90, 120, 135, 150, 180].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => {
                      setSelectedAngleDegree(deg);
                      setActiveTool('angle_degree');
                    }}
                    className={`py-1 rounded font-mono font-semibold transition-colors ${
                      selectedAngleDegree === deg
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>

            {/* Virtual Protractor Control */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Thước đo độ bán nguyệt 180°
                </span>
                <button
                  onClick={() => setProtractor((p) => ({ ...p, visible: !p.visible }))}
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    protractor.visible
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {protractor.visible ? 'Đang mở' : 'Đang ẩn'}
                </button>
              </div>
              {protractor.visible && (
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Góc xoay thước:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {Math.round(protractor.rotation)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={Math.round(protractor.rotation)}
                    onChange={(e) => setProtractor((p) => ({ ...p, rotation: parseInt(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                  <p className="text-[10px] text-slate-400">
                    Kéo tâm thước để di chuyển, kéo chấm tròn viền phải để xoay trực tiếp trên màn hình!
                  </p>
                </div>
              )}
            </div>

            {/* List of Segments & Measurements */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Danh sách đoạn thẳng & Độ dài thực
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {freeSegments.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">Chưa có đoạn thẳng nào. Chọn công cụ vẽ đoạn thẳng để bắt đầu.</p>
                ) : (
                  freeSegments.map((s) => {
                    const p1 = freePoints.find((p) => p.id === s.p1Id);
                    const p2 = freePoints.find((p) => p.id === s.p2Id);
                    if (!p1 || !p2) return null;
                    const length = pxToCm(dist(p1, p2));
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                          Đoạn {p1.label}{p2.label}
                        </span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          {length} cm
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-indigo-500" />
              Khám phá định lý hình học
            </h3>

            {activePreset === 'pythagoras' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Định lý Pythagoras:</strong> Trong tam giác vuông, tổng diện tích hai hình vuông dựng trên hai cạnh góc vuông bằng diện tích hình vuông dựng trên cạnh huyền:
                </p>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-lg font-mono text-center text-blue-900 dark:text-blue-200 font-bold">
                  c² (AB) + a² (BC) = b² (AC)
                </div>
                <p className="text-slate-500">
                  Kéo điểm A lên xuống hoặc điểm C sang ngang: các hình vuông màu xanh lam, xanh lá và hổ phách tự động co giãn và luôn bảo toàn đẳng thức!
                </p>
              </div>
            )}

            {activePreset === 'triangle_explorer' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>Tính chất trọng tâm G:</strong> Giao điểm của ba đường trung tuyến chia mỗi trung tuyến theo tỉ lệ 2/3 tính từ đỉnh:
                </p>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 rounded-lg font-mono text-center text-indigo-900 dark:text-indigo-200 font-bold">
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
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-900/40 rounded-lg font-mono text-center text-cyan-900 dark:text-cyan-200 font-bold">
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
        )}
      </div>
    </div>
    </ViewportPortal>
  );
};
