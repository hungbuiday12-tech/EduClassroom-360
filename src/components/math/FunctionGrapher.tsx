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
  Sliders,
  Table as TableIcon
} from 'lucide-react';

const PRESET_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#0891b2'];

export const FunctionGrapher: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const activeFunc = functions.find((f) => f.id === activeFuncId) || functions[0];

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
          return a * Math.exp(b * x);
        case 'custom':
          if (!fn.customExpr) return null;
          // Safe eval using sanitized expression
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
    // Replace functions with Math equivalents
    let sanitized = expr.toLowerCase()
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/abs/g, 'Math.abs')
      .replace(/pi/g, 'Math.PI')
      .replace(/e\b/g, 'Math.E');

    // Only allow safe characters
    if (!/^[0-9x\s\+\-\*\/\(\)\.\,MathsincotaqrbeE]+$/.test(sanitized)) {
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

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear background
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#090d16' : '#ffffff';
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

      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2.5;
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

      // Tangent line if active
      if (fn.showTangent && fn.tangentX0 !== undefined) {
        const x0 = fn.tangentX0;
        const y0 = evaluateFunc(fn, x0);
        const slope = evaluateDerivative(fn, x0);

        if (y0 !== null && slope !== null && isFinite(y0) && isFinite(slope)) {
          ctx.save();
          ctx.strokeStyle = '#f59e0b'; // Amber
          ctx.lineWidth = 1.8;
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

          // Tangent touch point
          const ptX = toPxX(x0);
          const ptY = toPxY(y0);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(ptX, ptY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Coordinate label
          ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(`M(${x0.toFixed(1)}; ${y0.toFixed(2)}) | k = ${slope.toFixed(2)}`, ptX + 8, ptY - 8);
        }
      }
    });

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
  }, [viewport, functions, evaluateFunc, evaluateDerivative, hoverCoord]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
        let formulaDisplay = fn.formulaDisplay;
        if (fn.type === 'cubic') {
          formulaDisplay = `y = ${newParams.a}x³ + ${newParams.b}x² + ${newParams.c}x + ${newParams.d}`;
        } else if (fn.type === 'linear') {
          formulaDisplay = `y = ${newParams.a}x + ${newParams.b}`;
        } else if (fn.type === 'quadratic') {
          formulaDisplay = `y = ${newParams.a}x² + ${newParams.b}x + ${newParams.c}`;
        } else if (fn.type === 'rational') {
          formulaDisplay = `y = (${newParams.a}x + ${newParams.b})/(${newParams.c}x + ${newParams.d})`;
        }
        return {
          ...fn,
          params: newParams,
          formulaDisplay
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
  const tableData = [];
  if (activeFunc) {
    for (let x = -5; x <= 5; x += 1) {
      const y = evaluateFunc(activeFunc, x);
      const dy = evaluateDerivative(activeFunc, x);
      tableData.push({ x, y: y !== null ? y.toFixed(3) : 'Không XĐ', dy: dy !== null ? dy.toFixed(3) : '-' });
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* LEFT / MAIN: Graphing Stage */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {/* Stage Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tọa độ Oxy</span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {hoverCoord ? `x: ${hoverCoord.x.toFixed(2)} / y: ${hoverCoord.y.toFixed(2)}` : 'Di chuột để xem tọa độ'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={zoomIn}
              title="Phóng to (Zoom In)"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              title="Thu nhỏ (Zoom Out)"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              title="Khôi phục vị trí ban đầu"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowTable(!showTable)}
              title="Bảng giá trị biến thiên"
              className={`p-1.5 rounded-md transition-colors ${showTable ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportPNG}
              title="Xuất ảnh đồ thị PNG"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative flex-1 min-h-[460px] bg-slate-900/5 dark:bg-black/20">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setIsDragging(false);
              setHoverCoord(null);
            }}
            onWheel={handleWheel}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />

          {/* Table Slide-Over */}
          {showTable && (
            <div className="absolute top-3 right-3 w-64 max-h-[90%] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-lg overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bảng giá trị: {activeFunc?.name}</span>
                <button onClick={() => setShowTable(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
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
      <div className="w-full lg:w-96 flex flex-col gap-4">
        {/* Function Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Danh sách đồ thị
            </h3>
            <button
              onClick={addNewFunction}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex-1">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
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
                      return {
                        ...fn,
                        type: newType,
                        params:
                          newType === 'rational'
                            ? { a: 2, b: 1, c: 1, d: -1 }
                            : newType === 'trig_sin'
                            ? { a: 2, b: 1, c: 0, d: 0 }
                            : fn.params
                      };
                    })
                  );
                }}
                className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="linear">Bậc 1: y = ax + b</option>
                <option value="quadratic">Bậc 2 (Parabol): y = ax² + bx + c</option>
                <option value="cubic">Bậc 3: y = ax³ + bx² + cx + d</option>
                <option value="rational">Phân thức: (ax+b)/(cx+d)</option>
                <option value="trig_sin">Lượng giác: a·sin(bx + c) + d</option>
                <option value="exponential">Mũ: a·e^(bx)</option>
              </select>
            </div>

            {/* Sliders for a, b, c, d */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Hệ số a</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">{activeFunc.params.a}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={activeFunc.params.a}
                  onChange={(e) => updateParam('a', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Hệ số b</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">{activeFunc.params.b}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={activeFunc.params.b}
                  onChange={(e) => updateParam('b', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {(activeFunc.type === 'quadratic' || activeFunc.type === 'cubic' || activeFunc.type === 'rational' || activeFunc.type === 'trig_sin') && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Hệ số c</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">{activeFunc.params.c}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={activeFunc.params.c}
                    onChange={(e) => updateParam('c', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}

              {(activeFunc.type === 'cubic' || activeFunc.type === 'rational' || activeFunc.type === 'trig_sin') && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Hệ số d</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">{activeFunc.params.d}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={activeFunc.params.d}
                    onChange={(e) => updateParam('d', parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              )}
            </div>

            {/* Tangent Line Controls */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                <div className="mt-2.5 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-800 dark:text-amber-200">Hoành độ x₀</span>
                    <span className="font-mono tabular-nums text-amber-900 dark:text-amber-100 font-semibold">
                      {activeFunc.tangentX0 ?? 0}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.2"
                    value={activeFunc.tangentX0 ?? 0}
                    onChange={(e) => {
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
          </div>
        )}
      </div>
    </div>
  );
};
