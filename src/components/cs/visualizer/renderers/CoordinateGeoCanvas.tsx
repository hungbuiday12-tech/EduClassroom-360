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
  const PAD = 42;

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
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-mono text-[11px] text-cyan-200/85">
          {algoId === 'coord_hull'
            ? 'OXY_MATRIX · Bấm vào lưới tọa độ để thêm điểm mới (tự làm tròn nguyên)'
            : 'SWEEP_SCAN · Đường quét laser x = x_sweep từ trái sang phải'}
        </span>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          {algoId === 'coord_hull' ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-sky-400">
                <span className="w-3 h-0.5 bg-sky-400 shadow-[0_0_8px_#38bdf8] inline-block" /> Bao dưới (L)
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-0.5 bg-amber-400 shadow-[0_0_8px_#fbbf24] inline-block" /> Bao trên (U)
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400/25 border border-emerald-400 inline-block" /> Bao lồi
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 text-cyan-300">
                <span className="w-3 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] inline-block" /> Active Set
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 inline-block" /> Giao điểm
              </span>
            </>
          )}
        </div>
      </div>

      <div className="relative rounded-xl border border-cyan-500/30 bg-[#040b18] overflow-hidden shadow-[inset_0_0_40px_rgba(6,182,212,0.08)]">
        {/* Corner HUD Reticles */}
        <span className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-xs z-10" />
        <span className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-xs z-10" />
        <span className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-xs z-10" />
        <span className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400/60 rounded-br-xs z-10" />

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          onClick={handleSvgClick}
          className={`w-full h-auto max-h-[430px] select-none ${
            algoId === 'coord_hull' ? 'cursor-crosshair' : ''
          }`}
        >
          <defs>
            <radialGradient id="geo-stage-glow" cx="50%" cy="48%" r="55%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.14" />
              <stop offset="60%" stopColor="#06142b" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#040b18" stopOpacity="0" />
            </radialGradient>
            <filter id="geo-neon" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={W} height={H} fill="#040b18" />
          <rect width={W} height={H} fill="url(#geo-stage-glow)" />

          {/* Grid lines */}
          {gridXs.map((gx) => {
            const px = toPxX(gx);
            const isOrigin = gx === 0;
            return (
              <g key={`gx-${gx}`}>
                <line
                  x1={px}
                  y1={PAD / 2}
                  x2={px}
                  y2={H - PAD / 2}
                  stroke={isOrigin ? '#38bdf8' : '#0f2847'}
                  strokeOpacity={isOrigin ? 0.55 : 0.75}
                  strokeWidth={isOrigin ? 1.4 : 0.9}
                />
                <text
                  x={px}
                  y={Math.min(H - 12, Math.max(16, axisY0 + 14))}
                  textAnchor="middle"
                  className="fill-cyan-400/65 text-[10px] font-mono tabular-nums"
                >
                  {gx}
                </text>
              </g>
            );
          })}

          {gridYs.map((gy) => {
            const py = toPxY(gy);
            const isOrigin = gy === 0;
            return (
              <g key={`gy-${gy}`}>
                <line
                  x1={PAD / 2}
                  y1={py}
                  x2={W - PAD / 2}
                  y2={py}
                  stroke={isOrigin ? '#38bdf8' : '#0f2847'}
                  strokeOpacity={isOrigin ? 0.55 : 0.75}
                  strokeWidth={isOrigin ? 1.4 : 0.9}
                />
                {gy !== 0 && (
                  <text
                    x={Math.max(16, Math.min(W - 20, axisX0 - 8))}
                    y={py + 3}
                    textAnchor="end"
                    className="fill-cyan-400/65 text-[10px] font-mono tabular-nums"
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
            className="fill-cyan-300 text-[11px] font-bold font-mono"
          >
            x
          </text>
          <text
            x={Math.min(W - 20, Math.max(18, axisX0 + 8))}
            y={18}
            className="fill-cyan-300 text-[11px] font-bold font-mono"
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
                  fill="rgba(56, 189, 248, 0.14)"
                  stroke="#34d399"
                  strokeWidth={2.6}
                  strokeLinejoin="round"
                  filter="url(#geo-neon)"
                />
              )}

              {/* Lower Hull Polyline */}
              {Array.isArray(st.lower) && st.lower.length >= 2 && (
                <polyline
                  points={(st.lower as Point2D[])
                    .map((p) => `${toPxX(p.x)},${toPxY(p.y)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2.8}
                  strokeDasharray="7 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#geo-neon)"
                />
              )}

              {/* Upper Hull Polyline */}
              {Array.isArray(st.upper) && st.upper.length >= 2 && (
                <polyline
                  points={(st.upper as Point2D[])
                    .map((p) => `${toPxX(p.x)},${toPxY(p.y)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={2.6}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#geo-neon)"
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
                        ? 'rgba(244, 63, 94, 0.2)'
                        : 'rgba(16, 185, 129, 0.18)'
                    }
                    stroke={(st.crossVal ?? 0) <= 0 ? '#fb7185' : '#34d399'}
                    strokeWidth={1.6}
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={toPxX(st.checking.a.x)}
                    y1={toPxY(st.checking.a.y)}
                    x2={toPxX(st.checking.b.x)}
                    y2={toPxY(st.checking.b.y)}
                    stroke={(st.crossVal ?? 0) <= 0 ? '#fb7185' : '#34d399'}
                    strokeWidth={2.8}
                    filter="url(#geo-neon)"
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
                  ? '#fbbf24'
                  : isCheckingPivot && (st.crossVal ?? 0) <= 0
                  ? '#fb7185'
                  : inHull
                  ? '#34d399'
                  : inLower
                  ? '#38bdf8'
                  : inUpper
                  ? '#818cf8'
                  : '#94a3b8';

                const isLit = isCheckingTarget || isCheckingPivot || inHull || inLower || inUpper;

                return (
                  <g key={p.id}>
                    {isLit && (
                      <circle
                        cx={toPxX(p.x)}
                        cy={toPxY(p.y)}
                        r={10}
                        fill="none"
                        stroke={fill}
                        strokeOpacity={0.4}
                        strokeWidth={1.5}
                      />
                    )}
                    <circle
                      cx={toPxX(p.x)}
                      cy={toPxY(p.y)}
                      r={isCheckingTarget || isCheckingPivot ? 6.5 : 5}
                      fill={fill}
                      stroke="#040b18"
                      strokeWidth={1.8}
                      filter={isLit ? 'url(#geo-neon)' : undefined}
                    />
                    <text
                      x={toPxX(p.x) + 10}
                      y={toPxY(p.y) - 7}
                      className="fill-cyan-100 text-[10.5px] font-bold font-mono tabular-nums"
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
              {/* Vertical Laser Sweep Line */}
              {typeof st.sweepX === 'number' && (
                <g>
                  <line
                    x1={toPxX(st.sweepX)}
                    y1={PAD / 2}
                    x2={toPxX(st.sweepX)}
                    y2={H - PAD / 2}
                    stroke="#f59e0b"
                    strokeWidth={2.2}
                    strokeDasharray="6 4"
                    filter="url(#geo-neon)"
                  />
                  <circle
                    cx={toPxX(st.sweepX)}
                    cy={PAD / 2 + 18}
                    r={4.5}
                    fill="#fbbf24"
                    filter="url(#geo-neon)"
                  />
                  <rect
                    x={toPxX(st.sweepX) - 30}
                    y={6}
                    width={60}
                    height={19}
                    rx={5}
                    fill="#091930"
                    stroke="#f59e0b"
                    strokeWidth={1.2}
                  />
                  <text
                    x={toPxX(st.sweepX)}
                    y={19}
                    textAnchor="middle"
                    className="fill-amber-300 text-[10px] font-bold font-mono tabular-nums"
                  >
                    x = {st.sweepX}
                  </text>
                </g>
              )}

              {/* Segments */}
              {(st.segments as Segment2D[] | undefined)?.map((s) => {
                const isActive = (st.activeIds as string[] | undefined)?.includes(s.id);
                const isChecking = (st.checkingPair as string[] | null)?.includes(s.id);
                const color = isChecking ? '#10b981' : isActive ? '#38bdf8' : '#64748b';
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
                      filter={isActive || isChecking ? 'url(#geo-neon)' : undefined}
                    />
                    <circle cx={toPxX(s.x1)} cy={toPxY(s.y1)} r={4} fill={color} />
                    <circle cx={toPxX(s.x2)} cy={toPxY(s.y2)} r={4} fill={color} />
                    <text
                      x={mx}
                      y={my - 8}
                      textAnchor="middle"
                      className="fill-cyan-100 text-[11px] font-bold font-mono"
                    >
                      {s.label}
                    </text>
                  </g>
                );
              })}

              {/* Intersections (Amber Glow Diamond matching GEO-02) */}
              {(st.intersections as { x: number; y: number; s1: string; s2: string }[] | undefined)?.map(
                (pt, idx) => (
                  <g key={`int-${idx}`}>
                    <polygon
                      points={`${toPxX(pt.x)},${toPxY(pt.y) - 9} ${toPxX(pt.x) + 9},${toPxY(pt.y)} ${toPxX(
                        pt.x
                      )},${toPxY(pt.y) + 9} ${toPxX(pt.x) - 9},${toPxY(pt.y)}`}
                      fill="#fbbf24"
                      stroke="#040b18"
                      strokeWidth={1.8}
                      filter="url(#geo-neon)"
                    />
                    <text
                      x={toPxX(pt.x) + 12}
                      y={toPxY(pt.y) + 13}
                      className="fill-amber-300 text-[10.5px] font-bold font-mono tabular-nums"
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
