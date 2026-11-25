import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FunctionPlotConfig,
  FunctionType
} from '../../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Maximize2,
  Minimize2,
  Sliders,
  Table as TableIcon,
  ArrowLeft,
  Play,
  Pause,
  Download,
  TrendingUp
} from 'lucide-react';
import { ViewportPortal } from '../common/ViewportPortal';
import { exportRowsToCsv, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { SimAnalysisProBar } from '../common/SimAnalysisProBar';

const PRESET_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#0891b2'];

interface FunctionGrapherProps {
  initialConfig?: Partial<FunctionPlotConfig> | null;
  onBack?: () => void;
}

const formatFormulaDisplay = (fn: Pick<FunctionPlotConfig, 'type' | 'params' | 'customExpr'>): string => {
  const { a, b, c, d } = fn.params;
  switch (fn.type) {
    case 'linear':
      return `y = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}`;
    case 'quadratic':
      return `y = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`;
    case 'cubic':
      return `y = ${a}x³ ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x² ${c >= 0 ? '+' : '-'} ${Math.abs(c)}x ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'rational':
      return `y = (${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)})/(${c}x ${d >= 0 ? '+' : '-'} ${Math.abs(d)})`;
    case 'trig_sin':
      return `y = ${a}·sin(${b}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}) ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'trig_cos':
      return `y = ${a}·cos(${b}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}) ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'exponential':
      return `y = ${a}·e^(${b}x) ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'logarithmic':
      return `y = ${a}·ln(${b}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}) ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'abs':
      return `y = ${a}·|${b}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}| ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'sqrt':
      return `y = ${a}·√(${b}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}) ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`;
    case 'custom':
      return fn.customExpr ? `y = ${fn.customExpr}` : 'y = f(x)';
    default:
      return 'y = f(x)';
  }
};

export const FunctionGrapher: React.FC<FunctionGrapherProps> = ({ initialConfig = null, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Viewport transforms: center (cx, cy) in math units, scale (pixels per unit)
  const [viewport, setViewport] = useState({
    cx: 0,
    cy: 0,
    scale: 40 // 40px per 1 math unit
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // List of functions
  const [functions, setFunctions] = useState<FunctionPlotConfig[]>([
    {
      id: 'f1',
      type: 'cubic',
      color: '#2563eb',
      name: 'f(x)',
      formulaDisplay: 'y = x³ - 3x² + 2',
      params: { a: 1, b: -3, c: 0, d: 2 },
      showTangent: true,
      tangentX0: 1,
      visible: true
    },
    {
      id: 'f2',
      type: 'linear',
      color: '#dc2626',
      name: 'g(x)',
      formulaDisplay: 'y = 2x - 1',
      params: { a: 2, b: -1, c: 0, d: 0 },
      showTangent: false,
      tangentX0: 0,
      visible: false
    }
  ]);

  const [activeFuncId, setActiveFuncId] = useState<string>('f1');
  const [showTable, setShowTable] = useState<boolean>(false);
  const [showDerivative, setShowDerivative] = useState<boolean>(false);
  const [isSweepingTangent, setIsSweepingTangent] = useState<boolean>(false);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [resizeTick, setResizeTick] = useState(0);

  const { isRecording, recordSeconds: recSeconds, toggleRecording } = useCanvasRecorder(
    () => canvasRef.current,
    'synapse-function-graph'
  );

  useEffect(() => {
    if (!initialConfig) return;
    setFunctions((prev) => {
      const base = prev[0] || {
        id: 'f1',
        type: 'cubic' as FunctionType,
        color: '#2563eb',
        name: 'f(x)',
        formulaDisplay: 'y = x³ - 3x² + 2',
        params: { a: 1, b: -3, c: 0, d: 2 },
        showTangent: false,
        tangentX0: 1,
        visible: true
      };
      const mergedType = (initialConfig.type || base.type) as FunctionType;
      const mergedParams = {
        a: initialConfig.params?.a ?? base.params.a,
        b: initialConfig.params?.b ?? base.params.b,
        c: initialConfig.params?.c ?? base.params.c,
        d: initialConfig.params?.d ?? base.params.d
      };
      const customExpr =
        initialConfig.customExpr ?? (mergedType === 'custom' ? base.customExpr : undefined);
      const updatedFirst: FunctionPlotConfig = {
        ...base,
        ...initialConfig,
        id: 'f1',
        type: mergedType,
        params: mergedParams,
        customExpr,
        name: initialConfig.name || base.name,
        formulaDisplay:
          initialConfig.formulaDisplay ||
          initialConfig.name ||
          formatFormulaDisplay({ type: mergedType, params: mergedParams, customExpr }),
        visible: true
      };
      return [updatedFirst, ...prev.slice(1)];
    });
    setActiveFuncId('f1');
  }, [initialConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setResizeTick((t) => t + 1));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Keyboard shortcut listener to exit fullscreen on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const activeFunc = functions.find((f) => f.id === activeFuncId) || functions[0];

  // Auto-sweep tangent contact point x0 along [-4, 4]
  useEffect(() => {
    if (!isSweepingTangent || !activeFunc?.showTangent) return;
    let rafId = 0;
    let last = performance.now();
    let dir = 1;
    const stepSweep = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setFunctions((list) =>
        list.map((fn) => {
          if (fn.id !== activeFuncId) return fn;
          let nextX = (fn.tangentX0 ?? 0) + dir * dt * 1.45;
          if (nextX >= 4) {
            nextX = 4;
            dir = -1;
          } else if (nextX <= -4) {
            nextX = -4;
            dir = 1;
          }
          return { ...fn, tangentX0: Number(nextX.toFixed(3)) };
        })
      );
      rafId = requestAnimationFrame(stepSweep);
    };
    rafId = requestAnimationFrame(stepSweep);
    return () => cancelAnimationFrame(rafId);
  }, [isSweepingTangent, activeFuncId, activeFunc?.showTangent]);

  // Evaluate function at x
  const evaluateFunc = useCallback((fn: FunctionPlotConfig, x: number): number | null => {
    try {
      const { a, b, c, d } = fn.params;
      switch (fn.type) {
        case 'linear':
          return a * x + b;
        case 'quadratic':
          return a * x * x + b * x + c;
        case 'cubic':
          return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
        case 'rational': {
          const denom = c * x + d;
          if (Math.abs(denom) < 1e-7) return null;
          return (a * x + b) / denom;
        }
        case 'trig_sin':
          return a * Math.sin(b * x + c) + d;
        case 'trig_cos':
          return a * Math.cos(b * x + c) + d;
        case 'exponential':
          return a * Math.exp(b * x) + d;
        case 'logarithmic': {
          const arg = b * x + c;
          if (arg <= 1e-6) return null;
          return a * Math.log(arg) + d;
        }
        case 'abs':
          return a * Math.abs(b * x + c) + d;
        case 'sqrt': {
          const inner = b * x + c;
          if (inner < 0) return null;
          return a * Math.sqrt(inner) + d;
        }
        case 'custom':
          if (!fn.customExpr) return null;
          return evaluateSafeMath(fn.customExpr, x);
        default:
          return null;
      }
    } catch {
      return null;
    }
  }, []);

  // Approximate derivative at x
  const evaluateDerivative = useCallback((fn: FunctionPlotConfig, x: number): number | null => {
    const h = 0.0001;
    const y1 = evaluateFunc(fn, x + h);
    const y0 = evaluateFunc(fn, x - h);
    if (y1 === null || y0 === null || isNaN(y1) || isNaN(y0)) return null;
    return (y1 - y0) / (2 * h);
  }, [evaluateFunc]);

  // Safe parser for user expressions
  const evaluateSafeMath = (expr: string, x: number): number => {
    const sanitized = expr
      .toLowerCase()
      .replace(/\^/g, '**')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/pow\(/g, 'Math.pow(')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/\bpi\b/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');

    if (!/^[0-9x\s\+\-\*\/\(\)\.\,MathsincotaqrblgpePIEw]+$/.test(sanitized)) {
      throw new Error('Invalid formula');
    }

    const fn = new Function('x', `return ${sanitized};`);
    return fn(x);
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI (capped at 2x for crisp lines)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    const isDarkTheme = document.documentElement.classList.contains('dark');

    // Clear background with subtle studio radial lighting
    const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 20, width * 0.5, height * 0.5, Math.max(width, height) * 0.78);
    if (isDarkTheme) {
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#060913');
    } else {
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#f8fafc');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Math coords to canvas pixels
    const toPxX = (x: number) => width / 2 + (x - viewport.cx) * viewport.scale;
    const toPxY = (y: number) => height / 2 - (y - viewport.cy) * viewport.scale;

    // Canvas pixels to math coords
    const toMathX = (px: number) => (px - width / 2) / viewport.scale + viewport.cx;
    const toMathY = (py: number) => (height / 2 - py) / viewport.scale + viewport.cy;

    const minX = toMathX(0);
    const maxX = toMathX(width);
    const minY = toMathY(height);
    const maxY = toMathY(0);

    // Grid step calculation
    const rawStep = 60 / viewport.scale;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    let gridStep = magnitude;
    if (residual > 5) gridStep = magnitude * 5;
    else if (residual > 2) gridStep = magnitude * 2;

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.9)';
    const axisColor = isDark ? '#94a3b8' : '#334155';
    const textColor = isDark ? '#64748b' : '#94a3b8';

    // 1. Draw Grid Lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;

    // Vertical grid
    const firstX = Math.floor(minX / gridStep) * gridStep;
    for (let x = firstX; x <= maxX; x += gridStep) {
      const px = toPxX(x);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      if (Math.abs(x) > 1e-6) {
        const py = Math.min(Math.max(toPxY(0) + 14, 14), height - 6);
        ctx.fillText(Number(x.toFixed(2)).toString(), px - 8, py);
      }
    }

    // Horizontal grid
    const firstY = Math.floor(minY / gridStep) * gridStep;
    for (let y = firstY; y <= maxY; y += gridStep) {
      const py = toPxY(y);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      if (Math.abs(y) > 1e-6) {
        const px = Math.min(Math.max(toPxX(0) + 6, 6), width - 36);
        ctx.fillText(Number(y.toFixed(2)).toString(), px, py + 3);
      }
    }

    // 2. Draw Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;

    // X Axis
    const axisY = toPxY(0);
    if (axisY >= 0 && axisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, axisY);
      ctx.lineTo(width, axisY);
      ctx.stroke();

      // Arrow
      ctx.beginPath();
      ctx.moveTo(width - 8, axisY - 4);
      ctx.lineTo(width, axisY);
      ctx.lineTo(width - 8, axisY + 4);
      ctx.fillStyle = axisColor;
      ctx.fill();

      ctx.fillText('x', width - 14, axisY - 8);
    }

    // Y Axis
    const axisX = toPxX(0);
    if (axisX >= 0 && axisX <= width) {
      ctx.beginPath();
      ctx.moveTo(axisX, height);
      ctx.lineTo(axisX, 0);
      ctx.stroke();

      // Arrow
      ctx.beginPath();
      ctx.moveTo(axisX - 4, 8);
      ctx.lineTo(axisX, 0);
      ctx.lineTo(axisX + 4, 8);
      ctx.fillStyle = axisColor;
      ctx.fill();

      ctx.fillText('y', axisX + 8, 14);
    }

    // Origin O label
    if (axisX >= 0 && axisX <= width && axisY >= 0 && axisY <= height) {
      ctx.fillText('O', axisX - 12, axisY + 14);
    }

    // 3. Draw Functions
    functions.forEach((fn) => {
      if (!fn.visible) return;

      // Definite Integral Shading ∫[a, b] f(x) dx
      if (fn.showIntegral) {
        const intA = fn.integralA ?? 0;
        const intB = fn.integralB ?? 2;
        const lo = Math.min(intA, intB);
        const hi = Math.max(intA, intB);
        if (hi > lo) {
          const slices = 120;
          const dxStep = (hi - lo) / slices;
          let signedIntegral = 0;
          let unsignedArea = 0;

          ctx.save();
          for (let i = 0; i < slices; i++) {
            const x0 = lo + i * dxStep;
            const x1 = x0 + dxStep;
            const xm = 0.5 * (x0 + x1);
            const y0 = evaluateFunc(fn, x0);
            const y1 = evaluateFunc(fn, x1);
            const ym = evaluateFunc(fn, xm);
            if (y0 === null || y1 === null || !isFinite(y0) || !isFinite(y1)) continue;

            const simpsonSlice =
              ym !== null && isFinite(ym)
                ? ((y0 + 4 * ym + y1) / 6) * dxStep
                : 0.5 * (y0 + y1) * dxStep;
            signedIntegral += simpsonSlice;
            unsignedArea += Math.abs(simpsonSlice);

            const px0 = toPxX(x0);
            const px1 = toPxX(x1);
            const py0 = toPxY(y0);
            const py1 = toPxY(y1);
            const pyAxis = toPxY(0);

            const posGrad = ctx.createLinearGradient(0, Math.min(py0, py1), 0, pyAxis);
            posGrad.addColorStop(0, simpsonSlice >= 0 ? 'rgba(16, 185, 129, 0.36)' : 'rgba(244, 63, 94, 0.36)');
            posGrad.addColorStop(1, simpsonSlice >= 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)');
            ctx.fillStyle = posGrad;
            ctx.beginPath();
            ctx.moveTo(px0, pyAxis);
            ctx.lineTo(px0, py0);
            ctx.lineTo(px1, py1);
            ctx.lineTo(px1, pyAxis);
            ctx.closePath();
            ctx.fill();
          }

          // Vertical bound lines x = a and x = b
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.5;
          [lo, hi].forEach((boundX) => {
            const bPx = toPxX(boundX);
            const boundY = evaluateFunc(fn, boundX);
            ctx.beginPath();
            ctx.moveTo(bPx, toPxY(0));
            ctx.lineTo(bPx, boundY !== null && isFinite(boundY) ? toPxY(boundY) : toPxY(0));
            ctx.stroke();
          });

          // Integral readout badge on canvas
          ctx.setLineDash([]);
          const midPx = toPxX((lo + hi) / 2);
          ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)';
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.2;
          const badgeW = 175;
          const badgeH = 38;
          const badgeX = Math.max(8, Math.min(width - badgeW - 8, midPx - badgeW / 2));
          const badgeY = 12;
          ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
          ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillText(`∫[${lo.toFixed(1)}, ${hi.toFixed(1)}] = ${signedIntegral.toFixed(3)}`, badgeX + 8, badgeY + 15);
          ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`S hình phẳng = ${unsignedArea.toFixed(3)} đvdt`, badgeX + 8, badgeY + 30);
          ctx.restore();
        }
      }

      // Asymptote lines for rational functions
      if (fn.type === 'rational' && fn.params.c !== 0) {
        const verticalAsymptote = -fn.params.d / fn.params.c;
        const horizontalAsymptote = fn.params.a / fn.params.c;

        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = fn.color;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 1.2;

        // Draw vertical asymptote
        const asympPxX = toPxX(verticalAsymptote);
        if (asympPxX >= 0 && asympPxX <= width) {
          ctx.beginPath();
          ctx.moveTo(asympPxX, 0);
          ctx.lineTo(asympPxX, height);
          ctx.stroke();
        }

        // Draw horizontal asymptote
        const asympPxY = toPxY(horizontalAsymptote);
        if (asympPxY >= 0 && asympPxY <= height) {
          ctx.beginPath();
          ctx.moveTo(0, asympPxY);
          ctx.lineTo(width, asympPxY);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Domain boundary line for logarithmic/sqrt
      if ((fn.type === 'logarithmic' || fn.type === 'sqrt') && Math.abs(fn.params.b) > 1e-6) {
        const boundaryX = -fn.params.c / fn.params.b;
        const bPx = toPxX(boundaryX);
        if (bPx >= 0 && bPx <= width) {
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = fn.color;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(bPx, 0);
          ctx.lineTo(bPx, height);
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.save();
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = fn.color;
      ctx.shadowBlur = isDark ? 10 : 5;
      ctx.beginPath();

      const samplePixelStep = 1;
      let isDrawing = false;
      let lastY: number | null = null;

      for (let px = 0; px <= width; px += samplePixelStep) {
        const x = toMathX(px);
        const y = evaluateFunc(fn, x);

        if (y === null || isNaN(y) || !isFinite(y)) {
          isDrawing = false;
          lastY = null;
          continue;
        }

        const py = toPxY(y);

        // Discontinuity check for asymptotes
        if (lastY !== null && Math.abs(py - lastY) > height * 0.8) {
          isDrawing = false;
        }

        if (!isDrawing) {
          ctx.moveTo(px, py);
          isDrawing = true;
        } else {
          ctx.lineTo(px, py);
        }
        lastY = py;
      }
      ctx.stroke();
      ctx.restore();

      // Optional f'(x) dashed derivative curve overlay
      if (showDerivative) {
        ctx.save();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        let dDrawing = false;
        let lastDY: number | null = null;
        for (let px = 0; px <= width; px += 2) {
          const x = toMathX(px);
          const dy = evaluateDerivative(fn, x);
          if (dy === null || !isFinite(dy)) {
            dDrawing = false;
            lastDY = null;
            continue;
          }
          const py = toPxY(dy);
          if (lastDY !== null && Math.abs(py - lastDY) > height * 0.75) {
            dDrawing = false;
          }
          if (!dDrawing) {
            ctx.moveTo(px, py);
            dDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
          lastDY = py;
        }
        ctx.stroke();
        ctx.restore();
      }

      // Tangent line if active
      if (fn.showTangent && fn.tangentX0 !== undefined) {
        const x0 = fn.tangentX0;
        const y0 = evaluateFunc(fn, x0);
        const slope = evaluateDerivative(fn, x0);

        if (y0 !== null && slope !== null && isFinite(y0) && isFinite(slope)) {
          ctx.save();
          ctx.strokeStyle = '#f59e0b'; // Amber
          ctx.lineWidth = 2;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
          ctx.setLineDash([6, 3]);

          const span = 8;
          const xA = x0 - span;
          const yA = y0 + slope * (xA - x0);
          const xB = x0 + span;
          const yB = y0 + slope * (xB - x0);

          ctx.beginPath();
          ctx.moveTo(toPxX(xA), toPxY(yA));
          ctx.lineTo(toPxX(xB), toPxY(yB));
          ctx.stroke();
          ctx.restore();

          // Tangent touch point with glow halo
          const ptX = toPxX(x0);
          const ptY = toPxY(y0);
          ctx.save();
          ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
          ctx.beginPath();
          ctx.arc(ptX, ptY, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(ptX, ptY, 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();

          // Coordinate label
          ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(`M(${x0.toFixed(1)}; ${y0.toFixed(2)}) | k = ${slope.toFixed(2)}`, ptX + 8, ptY - 8);
        }
      }
    });

    if (showDerivative) {
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1;
      ctx.fillRect(10, 10, 134, 24);
      ctx.strokeRect(10, 10, 134, 24);
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText("--- Đạo hàm f'(x)", 18, 26);
      ctx.restore();
    }

    // 4. Cursor crosshair if hovering
    if (hoverCoord) {
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
      ctx.setLineDash([3, 3]);
      const hPx = toPxX(hoverCoord.x);
      const hPy = toPxY(hoverCoord.y);

      ctx.beginPath();
      ctx.moveTo(hPx, 0);
      ctx.lineTo(hPx, height);
      ctx.moveTo(0, hPy);
      ctx.lineTo(width, hPy);
      ctx.stroke();
      ctx.restore();
    }
  }, [viewport, functions, evaluateFunc, evaluateDerivative, hoverCoord, resizeTick, showDerivative]);

  // Pointer (mouse + touch + stylus) pan handlers
  const handleMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathX = (mouseX - rect.width / 2) / viewport.scale + viewport.cx;
    const mathY = (rect.height / 2 - mouseY) / viewport.scale + viewport.cy;
    setHoverCoord({ x: mathX, y: mathY });

    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setViewport((prev) => ({
      ...prev,
      cx: prev.cx - dx / prev.scale,
      cy: prev.cy + dy / prev.scale
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setViewport((prev) => {
      const nextScale = Math.min(Math.max(prev.scale * factor, 10), 300);
      return { ...prev, scale: nextScale };
    });
  };

  // Zoom controls
  const zoomIn = () => setViewport((v) => ({ ...v, scale: Math.min(v.scale * 1.25, 300) }));
  const zoomOut = () => setViewport((v) => ({ ...v, scale: Math.max(v.scale * 0.8, 10) }));
  const resetView = () => setViewport({ cx: 0, cy: 0, scale: 40 });

  // Update active function parameters
  const updateParam = (paramName: keyof FunctionPlotConfig['params'], val: number) => {
    setFunctions((list) =>
      list.map((fn) => {
        if (fn.id !== activeFuncId) return fn;
        const newParams = { ...fn.params, [paramName]: val };
        return {
          ...fn,
          params: newParams,
          formulaDisplay: formatFormulaDisplay({ type: fn.type, params: newParams, customExpr: fn.customExpr })
        };
      })
    );
  };

  // Add new function
  const addNewFunction = () => {
    const newId = 'f' + (functions.length + 1);
    const color = PRESET_COLORS[functions.length % PRESET_COLORS.length];
    const newFn: FunctionPlotConfig = {
      id: newId,
      type: 'quadratic',
      color,
      name: `f${functions.length + 1}(x)`,
      formulaDisplay: 'y = x² - 4',
      params: { a: 1, b: 0, c: -4, d: 0 },
      visible: true
    };
    setFunctions([...functions, newFn]);
    setActiveFuncId(newId);
  };

  // Export screenshot
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `do_thi_ham_so_${activeFunc.name}.png`;
    a.click();
  };

  // Values table generator (-5 to 5)
  const tableData: Array<{ x: number; y: string; dy: string }> = [];
  if (activeFunc) {
    for (let x = -5; x <= 5; x += 1) {
      const y = evaluateFunc(activeFunc, x);
      const dy = evaluateDerivative(activeFunc, x);
      tableData.push({ x, y: y !== null ? y.toFixed(3) : 'Không XĐ', dy: dy !== null ? dy.toFixed(3) : '-' });
    }
  }

  return (
    <ViewportPortal active={isFullScreen}>
      <div
        className={
          isFullScreen
            ? 'sim-math-scope fixed inset-0 z-[100] h-[100dvh] w-screen p-3 sm:p-5 bg-slate-100/98 dark:bg-slate-950/98 backdrop-blur-xl flex flex-col lg:flex-row gap-4 overflow-y-auto lg:overflow-hidden'
            : 'sim-math-scope flex flex-col lg:flex-row gap-6 h-full'
        }
      >
        {/* LEFT / MAIN: Graphing Stage */}
        <div className={`flex-1 flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-[4px] overflow-hidden shadow-xs ${isFullScreen ? 'min-h-[380px] lg:min-h-0' : ''}`}>
          {/* Stage Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              {(isFullScreen || onBack) && (
                <button
                  onClick={() => {
                    if (isFullScreen) {
                      setIsFullScreen(false);
                    } else if (onBack) {
                      onBack();
                    }
                  }}
                  className="sim-btn-math sim-btn-hero flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] border border-indigo-400/60 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isFullScreen ? 'Thu nhỏ (Esc)' : 'Quay lại'}</span>
                </button>
              )}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tọa độ Oxy</span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {hoverCoord ? `x: ${hoverCoord.x.toFixed(2)} / y: ${hoverCoord.y.toFixed(2)}` : 'Di chuột để xem tọa độ'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap max-w-full scrollbar-none">
              <button
                onClick={zoomIn}
                title="Phóng to (Zoom In)"
                className="sim-btn-math min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[3px] shrink-0 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={zoomOut}
                title="Thu nhỏ (Zoom Out)"
                className="sim-btn-math min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[3px] shrink-0 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                title="Khôi phục vị trí ban đầu"
                className="sim-btn-math min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[3px] shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDerivative((d) => !d)}
                title="Bật/tắt đồ thị đạo hàm f'(x)"
                className={`sim-btn-math min-h-[38px] flex items-center gap-1 px-2.5 py-1.5 rounded-[3px] border text-xs font-mono font-bold shrink-0 cursor-pointer ${
                  showDerivative
                    ? 'sim-btn-active bg-purple-600 border-purple-400 text-white'
                    : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>f&apos;(x)</span>
              </button>
              <button
                onClick={() => setShowTable(!showTable)}
                title="Bảng giá trị biến thiên"
                className={`sim-btn-math min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 rounded-[3px] border shrink-0 cursor-pointer ${showTable ? 'sim-btn-active bg-indigo-100 border-indigo-400 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportPNG}
                title="Xuất ảnh đồ thị PNG"
                className="sim-btn-math min-w-[38px] min-h-[38px] flex items-center justify-center p-1.5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[3px] shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
              <RecordVideoButton
                isRecording={isRecording}
                recordSeconds={recSeconds}
                onToggle={toggleRecording}
                compact
              />
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                title={isFullScreen ? 'Thu nhỏ (Esc)' : 'Toàn màn hình (Full Screen)'}
                className={`sim-btn-math min-h-[38px] flex items-center gap-1 px-2.5 py-1.5 rounded-[3px] border text-xs font-semibold shrink-0 whitespace-nowrap cursor-pointer ${
                  isFullScreen
                    ? 'sim-btn-active bg-indigo-600 border-indigo-400 text-white hover:bg-indigo-700 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative flex-1 flex flex-col sm:block min-h-[290px] sm:min-h-[460px] bg-slate-900/5 dark:bg-black/20">
            <div className="relative w-full h-[290px] sm:h-full">
              <canvas
                ref={canvasRef}
                onPointerDown={handleMouseDown}
                onPointerMove={handleMouseMove}
                onPointerUp={handleMouseUp}
                onPointerCancel={handleMouseUp}
                onPointerLeave={() => {
                  setIsDragging(false);
                  setHoverCoord(null);
                }}
                onWheel={handleWheel}
                className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
              />
            </div>

            {/* Table Slide-Over (Below canvas on mobile < sm, floating top-right on sm+) */}
            {showTable && (
              <div className="relative sm:absolute sm:top-3 sm:right-3 w-full sm:w-64 max-h-56 sm:max-h-[90%] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t sm:border border-slate-200 dark:border-slate-800 sm:rounded-lg p-3 shadow-lg overflow-y-auto z-10">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2 gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Bảng giá trị: {activeFunc?.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        exportRowsToCsv(
                          `bang_gia_tri_${activeFunc?.name || 'fx'}.csv`,
                          ['x', 'f(x)', "f'(x)"],
                          tableData.map((r) => [r.x, r.y, r.dy])
                        )
                      }
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer"
                      title="Xuất bảng giá trị CSV"
                    >
                      <Download className="w-3 h-3" />
                      <span>CSV</span>
                    </button>
                    <button onClick={() => setShowTable(false)} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">✕</button>
                  </div>
                </div>
                <table className="w-full text-xs font-mono tabular-nums">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="py-1 text-left">x</th>
                      <th className="py-1 text-right">f(x)</th>
                      <th className="py-1 text-right">f'(x)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.x} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="py-1 text-slate-700 dark:text-slate-300">{row.x}</td>
                        <td className="py-1 text-right text-indigo-600 dark:text-indigo-400 font-medium">{row.y}</td>
                        <td className="py-1 text-right text-amber-600 dark:text-amber-400">{row.dy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      {/* RIGHT: Parameter & Function Controls */}
      <div className={`w-full lg:w-96 flex flex-col gap-4 ${isFullScreen ? 'lg:overflow-y-auto lg:pr-1 shrink-0 pb-4 lg:pb-0' : ''}`}>
        {/* Function Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Danh sách đồ thị
            </h3>
            <button
              onClick={addNewFunction}
              className="group sim-btn-math sim-btn-hero sim-btn-active flex items-center gap-1 px-2.5 py-1 text-xs font-bold border border-indigo-400/60 text-white bg-indigo-600 hover:bg-indigo-700 rounded-[3px] cursor-pointer"
            >
              <span className="icon-anim-plus">
                <Plus className="w-3.5 h-3.5" />
              </span>
              Thêm hàm
            </button>
          </div>

          <div className="space-y-2">
            {functions.map((fn) => {
              const isActive = fn.id === activeFuncId;
              return (
                <div
                  key={fn.id}
                  onClick={() => setActiveFuncId(fn.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: fn.color }}
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {fn.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFunctions((list) =>
                            list.map((item) => (item.id === fn.id ? { ...item, visible: !item.visible } : item))
                          );
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={fn.visible ? 'Ẩn đồ thị' : 'Hiện đồ thị'}
                      >
                        {fn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      {functions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const remaining = functions.filter((item) => item.id !== fn.id);
                            setFunctions(remaining);
                            if (activeFuncId === fn.id) setActiveFuncId(remaining[0].id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500"
                          title="Xóa hàm này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-mono truncate">
                    {fn.formulaDisplay}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Function Details & Sliders */}
        {activeFunc && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex-1 space-y-4">
            {/* Quick VietJack Presets */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mẫu đồ thị SGK & Ôn thi nhanh
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Bậc 3', type: 'cubic' as FunctionType, params: { a: 1, b: -3, c: 0, d: 2 }, showIntegral: false },
                  { label: 'Phân thức 1/1', type: 'rational' as FunctionType, params: { a: 2, b: 1, c: 1, d: -1 }, showIntegral: false },
                  { label: 'Parabol', type: 'quadratic' as FunctionType, params: { a: 1, b: -2, c: -3, d: 0 }, showIntegral: false },
                  { label: 'Trị tuyệt đối |x|', type: 'abs' as FunctionType, params: { a: 1, b: 1, c: -1, d: -2 }, showIntegral: false },
                  { label: 'Căn √(x+2)', type: 'sqrt' as FunctionType, params: { a: 1, b: 1, c: 2, d: 0 }, showIntegral: false },
                  { label: 'Logarit ln(x)', type: 'logarithmic' as FunctionType, params: { a: 1.5, b: 1, c: 0, d: 0 }, showIntegral: false },
                  { label: 'Sin(x)', type: 'trig_sin' as FunctionType, params: { a: 2, b: 1, c: 0, d: 0 }, showIntegral: false },
                  { label: 'Tích phân ∫x²dx', type: 'quadratic' as FunctionType, params: { a: 1, b: 0, c: 0, d: 0 }, showIntegral: true, integralA: 0, integralB: 2 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setFunctions((list) =>
                        list.map((fn) =>
                          fn.id !== activeFuncId
                            ? fn
                            : {
                                ...fn,
                                type: preset.type,
                                params: preset.params,
                                showIntegral: preset.showIntegral,
                                integralA: preset.integralA ?? fn.integralA ?? 0,
                                integralB: preset.integralB ?? fn.integralB ?? 2,
                                formulaDisplay: formatFormulaDisplay({ type: preset.type, params: preset.params }),
                                visible: true
                              }
                        )
                      );
                    }}
                    className="sim-btn-tile sim-btn-tile-math sim-btn-math px-2.5 py-1 text-[11px] font-semibold rounded-[3px] border border-slate-300/80 dark:border-slate-700 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-200 dark:hover:text-white cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Điều chỉnh hệ số & khảo sát
              </span>
              <select
                value={activeFunc.type}
                onChange={(e) => {
                  const newType = e.target.value as FunctionType;
                  setFunctions((list) =>
                    list.map((fn) => {
                      if (fn.id !== activeFuncId) return fn;
                      const nextParams =
                        newType === 'rational'
                          ? { a: 2, b: 1, c: 1, d: -1 }
                          : newType === 'trig_sin' || newType === 'trig_cos'
                          ? { a: 2, b: 1, c: 0, d: 0 }
                          : newType === 'logarithmic'
                          ? { a: 1.5, b: 1, c: 1, d: 0 }
                          : newType === 'sqrt'
                          ? { a: 1.5, b: 1, c: 2, d: 0 }
                          : newType === 'abs'
                          ? { a: 1, b: 1, c: -1, d: -2 }
                          : fn.params;
                      return {
                        ...fn,
                        type: newType,
                        params: nextParams,
                        customExpr: newType === 'custom' ? fn.customExpr || 'x^4 - 2*x^2' : fn.customExpr,
                        formulaDisplay: formatFormulaDisplay({
                          type: newType,
                          params: nextParams,
                          customExpr: newType === 'custom' ? fn.customExpr || 'x^4 - 2*x^2' : fn.customExpr
                        })
                      };
                    })
                  );
                }}
                className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 max-w-full"
              >
                <option value="linear">Bậc 1: y = ax + b</option>
                <option value="quadratic">Bậc 2 (Parabol): y = ax² + bx + c</option>
                <option value="cubic">Bậc 3: y = ax³ + bx² + cx + d</option>
                <option value="rational">Phân thức: (ax+b)/(cx+d)</option>
                <option value="trig_sin">Lượng giác: a·sin(bx + c) + d</option>
                <option value="trig_cos">Lượng giác: a·cos(bx + c) + d</option>
                <option value="exponential">Mũ: a·e^(bx) + d</option>
                <option value="logarithmic">Logarit: a·ln(bx + c) + d</option>
                <option value="abs">Trị tuyệt đối: a·|bx + c| + d</option>
                <option value="sqrt">Căn thức: a·√(bx + c) + d</option>
                <option value="custom">Tùy chỉnh: f(x)</option>
              </select>
            </div>

            {activeFunc.type === 'custom' ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Biểu thức f(x) (hỗ trợ x^4, sin(x), cos(x), sqrt(x), abs(x), ln(x)):
                </label>
                <input
                  type="text"
                  value={activeFunc.customExpr || ''}
                  onChange={(e) => {
                    const expr = e.target.value;
                    setFunctions((list) =>
                      list.map((fn) =>
                        fn.id !== activeFuncId
                          ? fn
                          : { ...fn, customExpr: expr, formulaDisplay: expr ? `y = ${expr}` : 'y = f(x)' }
                      )
                    );
                  }}
                  placeholder="Ví dụ: x^4 - 2*x^2"
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {(['a', 'b', 'c', 'd'] as const)
                  .filter((coef) => {
                    if (coef === 'a' || coef === 'b') return true;
                    if (coef === 'c') {
                      return (
                        activeFunc.type === 'quadratic' ||
                        activeFunc.type === 'cubic' ||
                        activeFunc.type === 'rational' ||
                        activeFunc.type === 'trig_sin' ||
                        activeFunc.type === 'trig_cos' ||
                        activeFunc.type === 'logarithmic' ||
                        activeFunc.type === 'abs' ||
                        activeFunc.type === 'sqrt'
                      );
                    }
                    return (
                      activeFunc.type === 'cubic' ||
                      activeFunc.type === 'rational' ||
                      activeFunc.type === 'trig_sin' ||
                      activeFunc.type === 'trig_cos' ||
                      activeFunc.type === 'exponential' ||
                      activeFunc.type === 'logarithmic' ||
                      activeFunc.type === 'abs' ||
                      activeFunc.type === 'sqrt'
                    );
                  })
                  .map((coef) => {
                    const val = activeFunc.params[coef];
                    return (
                      <div key={coef}>
                        <div className="flex items-center justify-between text-xs mb-1 gap-2">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Hệ số {coef}</span>
                          <input
                            type="number"
                            step="any"
                            value={Number.isFinite(val) ? val : 0}
                            onChange={(e) => {
                              const parsed = parseFloat(e.target.value);
                              if (Number.isFinite(parsed)) updateParam(coef, parsed);
                            }}
                            className="w-24 px-2 py-0.5 text-right text-xs font-mono tabular-nums rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          step="0.25"
                          value={Math.max(-10, Math.min(10, val))}
                          onChange={(e) => updateParam(coef, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Tangent Line Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Vẽ tiếp tuyến tại tiếp điểm x₀</span>
                <input
                  type="checkbox"
                  checked={!!activeFunc.showTangent}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFunctions((list) =>
                      list.map((fn) => (fn.id === activeFuncId ? { ...fn, showTangent: checked } : fn))
                    );
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {activeFunc.showTangent && (
                <div className="mt-2.5 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40 space-y-2">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="text-amber-800 dark:text-amber-200 font-medium">Hoành độ x₀</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsSweepingTangent((s) => !s)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                          isSweepingTangent
                            ? 'bg-amber-600 text-white'
                            : 'bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                        }`}
                        title="Tự động trượt tiếp điểm x₀ qua lại"
                      >
                        {isSweepingTangent ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isSweepingTangent ? 'Dừng quét' : 'Quét x₀'}</span>
                      </button>
                      <input
                        type="number"
                        step="any"
                        value={activeFunc.tangentX0 ?? 0}
                        onChange={(e) => {
                          setIsSweepingTangent(false);
                          const x0 = parseFloat(e.target.value);
                          if (Number.isFinite(x0)) {
                            setFunctions((list) =>
                              list.map((fn) => (fn.id === activeFuncId ? { ...fn, tangentX0: x0 } : fn))
                            );
                          }
                        }}
                        className="w-20 px-2 py-0.5 text-right text-xs font-mono tabular-nums rounded-md bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="0.1"
                    value={Math.max(-8, Math.min(8, activeFunc.tangentX0 ?? 0))}
                    onChange={(e) => {
                      setIsSweepingTangent(false);
                      const x0 = parseFloat(e.target.value);
                      setFunctions((list) =>
                        list.map((fn) => (fn.id === activeFuncId ? { ...fn, tangentX0: x0 } : fn))
                      );
                    }}
                    className="w-full h-1.5 bg-amber-200 dark:bg-amber-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              )}
            </div>

            {/* Definite Integral Shading Controls */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <span>Tô diện tích tích phân ∫[a, b] f(x)dx</span>
                <input
                  type="checkbox"
                  checked={!!activeFunc.showIntegral}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFunctions((list) =>
                      list.map((fn) =>
                        fn.id === activeFuncId
                          ? {
                              ...fn,
                              showIntegral: checked,
                              integralA: fn.integralA ?? 0,
                              integralB: fn.integralB ?? 2
                            }
                          : fn
                      )
                    );
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              {activeFunc.showIntegral && (
                <div className="mt-2.5 bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[11px] text-emerald-800 dark:text-emerald-200 font-medium mb-1">
                        Cận dưới a
                      </span>
                      <input
                        type="number"
                        step="0.25"
                        value={activeFunc.integralA ?? 0}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (Number.isFinite(v)) {
                            setFunctions((list) =>
                              list.map((fn) => (fn.id === activeFuncId ? { ...fn, integralA: v } : fn))
                            );
                          }
                        }}
                        className="w-full px-2 py-1 text-right text-xs font-mono tabular-nums rounded-md bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 font-semibold"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] text-emerald-800 dark:text-emerald-200 font-medium mb-1">
                        Cận trên b
                      </span>
                      <input
                        type="number"
                        step="0.25"
                        value={activeFunc.integralB ?? 2}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (Number.isFinite(v)) {
                            setFunctions((list) =>
                              list.map((fn) => (fn.id === activeFuncId ? { ...fn, integralB: v } : fn))
                            );
                          }
                        }}
                        className="w-full px-2 py-1 text-right text-xs font-mono tabular-nums rounded-md bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeFunc && (
          <SimAnalysisProBar
            simKey={`math-graph-${activeFunc.type}`}
            title={`Đồ thị ${activeFunc.name}: ${activeFunc.formulaDisplay}`}
            formula={activeFunc.formulaDisplay}
            params={{
              a: activeFunc.params.a,
              b: activeFunc.params.b,
              c: activeFunc.params.c,
              d: activeFunc.params.d,
              x0: activeFunc.tangentX0 ?? 0
            }}
            paramBounds={{
              a: { min: -10, max: 10, step: 0.25, unit: '', label: 'Hệ số a' },
              b: { min: -10, max: 10, step: 0.25, unit: '', label: 'Hệ số b' },
              c: { min: -10, max: 10, step: 0.25, unit: '', label: 'Hệ số c' },
              d: { min: -10, max: 10, step: 0.25, unit: '', label: 'Hệ số d' },
              x0: { min: -8, max: 8, step: 0.1, unit: '', label: 'Điểm x₀' }
            }}
            metrics={(() => {
              const x0 = activeFunc.tangentX0 ?? 0;
              const y0 = evaluateFunc(activeFunc, x0);
              const dy0 = evaluateDerivative(activeFunc, x0);
              return [
                { label: `f(${x0})`, value: y0 !== null ? Number(y0.toFixed(3)) : 'N/A' },
                { label: `f'(${x0})`, value: dy0 !== null ? Number(dy0.toFixed(3)) : 'N/A' }
              ];
            })()}
            onApplyParams={(next) => {
              const nextParams = {
                a: next.a ?? activeFunc.params.a,
                b: next.b ?? activeFunc.params.b,
                c: next.c ?? activeFunc.params.c,
                d: next.d ?? activeFunc.params.d
              };
              const nextX0 = next.x0 ?? activeFunc.tangentX0 ?? 0;
              setFunctions((list) =>
                list.map((fn) =>
                  fn.id === activeFuncId
                    ? {
                        ...fn,
                        params: nextParams,
                        tangentX0: nextX0,
                        formulaDisplay: formatFormulaDisplay({
                          type: fn.type,
                          params: nextParams,
                          customExpr: fn.customExpr
                        })
                      }
                    : fn
                )
              );
            }}
            onTogglePlay={() => setIsSweepingTangent((s) => !s)}
            onReset={() => setViewport({ cx: 0, cy: 0, scale: 40 })}
            evaluateSweep={(paramKey, testVal, base) => {
              const testX = paramKey === 'x0' ? testVal : base.x0 ?? 0;
              const tempFn: FunctionPlotConfig = {
                ...activeFunc,
                params: {
                  a: paramKey === 'a' ? testVal : base.a ?? activeFunc.params.a,
                  b: paramKey === 'b' ? testVal : base.b ?? activeFunc.params.b,
                  c: paramKey === 'c' ? testVal : base.c ?? activeFunc.params.c,
                  d: paramKey === 'd' ? testVal : base.d ?? activeFunc.params.d
                }
              };
              const val = evaluateFunc(tempFn, testX);
              return {
                value: val !== null && Number.isFinite(val) ? Number(val.toFixed(3)) : 0,
                metricLabel: `f(${testX.toFixed(1)})`,
                metricUnit: ''
              };
            }}
          />
        )}
      </div>
    </div>
    </ViewportPortal>
  );
};
