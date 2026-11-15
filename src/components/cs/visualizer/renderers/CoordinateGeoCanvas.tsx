import React, { useMemo, useRef } from 'react';
import { Point2D, Segment2D, VizStep } from '../types';

interface CoordinateGeoCanvasProps {
  algoId: 'coord_hull' | 'coord_sweep';
  step: VizStep;
  onAddPoint?: (x: number, y: number) => void;
}

export const CoordinateGeoCanvas: React.FC<CoordinateGeoCanvasProps> = ({
  algoId,
  step,
  onAddPoint
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const st = step.state || {};

  // Compute coordinate bounds
  const bounds = useMemo(() => {
    const xs: number[] = [-1, 10];
    const ys: number[] = [-1, 10];
    if (algoId === 'coord_hull') {
      const pts: Point2D[] = st.points || [];
      pts.forEach((p) => {
        xs.push(p.x);
        ys.push(p.y);
      });
    } else {
      const segs: Segment2D[] = st.segments || [];
      segs.forEach((s) => {
        xs.push(s.x1, s.x2);
        ys.push(s.y1, s.y2);
      });
    }
    const minX = Math.floor(Math.min(...xs)) - 1;
    const maxX = Math.ceil(Math.max(...xs)) + 1;
    const minY = Math.floor(Math.min(...ys)) - 1;
    const maxY = Math.ceil(Math.max(...ys)) + 1;
    return { minX, maxX, minY, maxY };
  }, [algoId, st]);

  const W = 640;
  const H = 400;
  const PAD = 40;

  const toPxX = (x: number) =>
    PAD + ((x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX)) * (W - 2 * PAD);
  const toPxY = (y: number) =>
    H - PAD - ((y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY)) * (H - 2 * PAD);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (algoId !== 'coord_hull' || !onAddPoint || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const mathX =
      bounds.minX + ((px - PAD) / (W - 2 * PAD)) * (bounds.maxX - bounds.minX);
    const mathY =
      bounds.minY + ((H - PAD - py) / (H - 2 * PAD)) * (bounds.maxY - bounds.minY);
    onAddPoint(Math.round(mathX), Math.round(mathY));
  };

  const gridXs = useMemo(() => {
    const arr: number[] = [];
    const span = bounds.maxX - bounds.minX;
    const stepVal = span > 18 ? 2 : 1;
    for (let x = Math.ceil(bounds.minX); x <= Math.floor(bounds.maxX); x += stepVal) {
      arr.push(x);
    }
    return arr;
  }, [bounds]);

  const gridYs = useMemo(() => {
    const arr: number[] = [];
    const span = bounds.maxY - bounds.minY;
    const stepVal = span > 14 ? 2 : 1;
    for (let y = Math.ceil(bounds.minY); y <= Math.floor(bounds.maxY); y += stepVal) {
      arr.push(y);
    }
    return arr;
  }, [bounds]);

  const axisX0 = toPxX(0);
  const axisY0 = toPxY(0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span>
          {algoId === 'coord_hull'
            ? 'Mặt phẳng Oxy · Bấm vào lưới tọa độ để thêm điểm mới (tự làm tròn nguyên)'
            : 'Mặt phẳng Oxy · Đường quét đứng x = x_sweep từ trái sang phải'}
        </span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          {algoId === 'coord_hull' ? (
            <>
              <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                <span className="w-2.5 h-0.5 bg-sky-500 inline-block" /> Bao dưới (L)
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block" /> Bao trên (U)
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/25 border border-emerald-500 inline-block" /> Bao lồi
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400">
                <span className="w-2.5 h-0.5 bg-sky-500 inline-block" /> Active Set
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Giao điểm
              </span>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          onClick={handleSvgClick}
          className={`w-full h-auto max-h-[420px] select-none ${
            algoId === 'coord_hull' ? 'cursor-crosshair' : ''
          }`}
        >
          {/* Grid lines */}
          {gridXs.map((gx) => {
            const px = toPxX(gx);
            return (
              <g key={`gx-${gx}`}>
                <line
                  x1={px}
                  y1={PAD / 2}
                  x2={px}
                  y2={H - PAD / 2}
                  stroke="currentColor"
                  className={
                    gx === 0
                      ? 'text-slate-400 dark:text-slate-600'
                      : 'text-slate-200/80 dark:text-slate-800/80'
                  }
                  strokeWidth={gx === 0 ? 1.5 : 1}
                />
                <text
                  x={px}
                  y={Math.min(H - 12, Math.max(16, axisY0 + 14))}
                  textAnchor="middle"
                  className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                >
                  {gx}
                </text>
              </g>
            );
          })}

          {gridYs.map((gy) => {
            const py = toPxY(gy);
            return (
              <g key={`gy-${gy}`}>
                <line
                  x1={PAD / 2}
                  y1={py}
                  x2={W - PAD / 2}
                  y2={py}
                  stroke="currentColor"
                  className={
                    gy === 0
                      ? 'text-slate-400 dark:text-slate-600'
                      : 'text-slate-200/80 dark:text-slate-800/80'
                  }
                  strokeWidth={gy === 0 ? 1.5 : 1}
                />
                {gy !== 0 && (
                  <text
                    x={Math.max(16, Math.min(W - 20, axisX0 - 8))}
                    y={py + 3}
                    textAnchor="end"
                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                  >
                    {gy}
                  </text>
                )}
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={W - 14}
            y={Math.min(H - 16, Math.max(20, axisY0 - 6))}
            className="fill-slate-500 text-[11px] font-bold font-mono"
          >
            x
          </text>
          <text
            x={Math.min(W - 20, Math.max(18, axisX0 + 8))}
            y={18}
            className="fill-slate-500 text-[11px] font-bold font-mono"
          >
            y
          </text>

          {/* CONVEX HULL RENDERING */}
          {algoId === 'coord_hull' && (
            <>
              {/* Final Hull Polygon */}
              {Array.isArray(st.hull) && st.hull.length >= 3 && (
                <polygon
                  points={(st.hull as Point2D[])
                    .map((p) => `${toPxX(p.x)},${toPxY(p.y)}`)
                    .join(' ')}
                  fill="rgba(16, 185, 129, 0.16)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                />
              )}

              {/* Lower Hull Polyline */}
              {Array.isArray(st.lower) && st.lower.length >= 2 && (
                <polyline
                  points={(st.lower as Point2D[])
                    .map((p) => `${toPxX(p.x)},${toPxY(p.y)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Upper Hull Polyline */}
              {Array.isArray(st.upper) && st.upper.length >= 2 && (
                <polyline
                  points={(st.upper as Point2D[])
                    .map((p) => `${toPxX(p.x)},${toPxY(p.y)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  strokeDasharray="6 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Cross-product check triangle O -> A -> B */}
              {st.checking && (
                <g>
                  <polygon
                    points={`${toPxX(st.checking.o.x)},${toPxY(st.checking.o.y)} ${toPxX(
                      st.checking.a.x
                    )},${toPxY(st.checking.a.y)} ${toPxX(st.checking.b.x)},${toPxY(st.checking.b.y)}`}
                    fill={
                      (st.crossVal ?? 0) <= 0
                        ? 'rgba(225, 29, 72, 0.16)'
                        : 'rgba(16, 185, 129, 0.16)'
                    }
                    stroke={(st.crossVal ?? 0) <= 0 ? '#e11d48' : '#10b981'}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={toPxX(st.checking.a.x)}
                    y1={toPxY(st.checking.a.y)}
                    x2={toPxX(st.checking.b.x)}
                    y2={toPxY(st.checking.b.y)}
                    stroke={(st.crossVal ?? 0) <= 0 ? '#e11d48' : '#10b981'}
                    strokeWidth={2.5}
                  />
                </g>
              )}

              {/* All Points */}
              {(st.points as Point2D[] | undefined)?.map((p) => {
                const inHull = (st.hull as Point2D[] | undefined)?.some((h) => h.id === p.id);
                const inLower = (st.lower as Point2D[] | undefined)?.some((h) => h.id === p.id);
                const inUpper = (st.upper as Point2D[] | undefined)?.some((h) => h.id === p.id);
                const isCheckingTarget = st.checking?.b?.id === p.id;
                const isCheckingPivot = st.checking?.a?.id === p.id;

                const fill = isCheckingTarget
                  ? '#f59e0b'
                  : isCheckingPivot && (st.crossVal ?? 0) <= 0
                  ? '#e11d48'
                  : inHull
                  ? '#10b981'
                  : inLower
                  ? '#0284c7'
                  : inUpper
                  ? '#d97706'
                  : '#64748b';

                return (
                  <g key={p.id}>
                    <circle
                      cx={toPxX(p.x)}
                      cy={toPxY(p.y)}
                      r={isCheckingTarget || isCheckingPivot ? 7 : 5.5}
                      fill={fill}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                    <text
                      x={toPxX(p.x) + 8}
                      y={toPxY(p.y) - 6}
                      className="fill-slate-800 dark:fill-slate-100 text-[11px] font-bold font-mono"
                    >
                      {p.label}({p.x},{p.y})
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* SWEEP LINE RENDERING */}
          {algoId === 'coord_sweep' && (
            <>
              {/* Vertical Sweep Line */}
              {typeof st.sweepX === 'number' && (
                <g>
                  <line
                    x1={toPxX(st.sweepX)}
                    y1={PAD / 2}
                    x2={toPxX(st.sweepX)}
                    y2={H - PAD / 2}
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                  <rect
                    x={toPxX(st.sweepX) - 28}
                    y={6}
                    width={56}
                    height={18}
                    rx={4}
                    fill="#4f46e5"
                  />
                  <text
                    x={toPxX(st.sweepX)}
                    y={18}
                    textAnchor="middle"
                    className="fill-white text-[10px] font-bold font-mono"
                  >
                    x = {st.sweepX}
                  </text>
                </g>
              )}

              {/* Segments */}
              {(st.segments as Segment2D[] | undefined)?.map((s) => {
                const isActive = (st.activeIds as string[] | undefined)?.includes(s.id);
                const isChecking = (st.checkingPair as string[] | null)?.includes(s.id);
                const color = isChecking ? '#f59e0b' : isActive ? '#0284c7' : '#64748b';
                const mx = (toPxX(s.x1) + toPxX(s.x2)) / 2;
                const my = (toPxY(s.y1) + toPxY(s.y2)) / 2;

                return (
                  <g key={s.id}>
                    <line
                      x1={toPxX(s.x1)}
                      y1={toPxY(s.y1)}
                      x2={toPxX(s.x2)}
                      y2={toPxY(s.y2)}
                      stroke={color}
                      strokeWidth={isChecking ? 3.5 : isActive ? 3 : 2}
                      strokeLinecap="round"
                    />
                    <circle cx={toPxX(s.x1)} cy={toPxY(s.y1)} r={4} fill={color} />
                    <circle cx={toPxX(s.x2)} cy={toPxY(s.y2)} r={4} fill={color} />
                    <text
                      x={mx}
                      y={my - 7}
                      textAnchor="middle"
                      className="fill-slate-800 dark:fill-slate-100 text-[11px] font-bold font-mono"
                    >
                      {s.label}
                    </text>
                  </g>
                );
              })}

              {/* Intersections */}
              {(st.intersections as { x: number; y: number; s1: string; s2: string }[] | undefined)?.map(
                (pt, idx) => (
                  <g key={`int-${idx}`}>
                    <circle
                      cx={toPxX(pt.x)}
                      cy={toPxY(pt.y)}
                      r={6.5}
                      fill="#e11d48"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                    <text
                      x={toPxX(pt.x) + 8}
                      y={toPxY(pt.y) + 12}
                      className="fill-rose-600 dark:fill-rose-400 text-[10px] font-bold font-mono"
                    >
                      ({pt.x},{pt.y})
                    </text>
                  </g>
                )
              )}
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
