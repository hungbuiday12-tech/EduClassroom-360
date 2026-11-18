import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Printer, Trash2, TrendingUp, BarChart3 } from 'lucide-react';

export interface LabDataRow {
  id: number;
  timeStr: string;
  m1Label: string;
  m1Val: string;
  m2Label: string;
  m2Val: string;
  m3Label: string;
  m3Val: string;
}

interface LabDataLoggerPanelProps {
  title: string;
  rows: LabDataRow[];
  onClear: () => void;
}

function parseNum(raw: string): number {
  const cleaned = String(raw || '')
    .replace(/,/g, '.')
    .match(/-?\d+(\.\d+)?/);
  return cleaned ? parseFloat(cleaned[0]) : NaN;
}

type AxisKey = 't' | 'm1' | 'm2' | 'm3';

export const LabDataLoggerPanel: React.FC<LabDataLoggerPanelProps> = ({
  title,
  rows,
  onClear
}) => {
  const [xAxis, setXAxis] = useState<AxisKey>('t');
  const [yAxis, setYAxis] = useState<AxisKey>('m1');
  const [fitMode, setFitMode] = useState<'linear' | 'quadratic'>('linear');
  const [showChart, setShowChart] = useState<boolean>(true);

  const axisOptions = useMemo(() => {
    const first = rows[0];
    return [
      { key: 't' as AxisKey, label: 'Thời gian t (s)' },
      { key: 'm1' as AxisKey, label: first?.m1Label || 'Đại lượng 1' },
      { key: 'm2' as AxisKey, label: first?.m2Label || 'Đại lượng 2' },
      { key: 'm3' as AxisKey, label: first?.m3Label || 'Đại lượng 3' }
    ];
  }, [rows]);

  const points = useMemo(() => {
    const pick = (r: LabDataRow, k: AxisKey) => {
      if (k === 't') return parseNum(r.timeStr);
      if (k === 'm1') return parseNum(r.m1Val);
      if (k === 'm2') return parseNum(r.m2Val);
      return parseNum(r.m3Val);
    };
    return rows
      .map((r) => ({ x: pick(r, xAxis), y: pick(r, yAxis), id: r.id }))
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  }, [rows, xAxis, yAxis]);

  const regression = useMemo(() => {
    if (points.length < 2) return null;
    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
    }
    const meanX = sumX / n;
    const meanY = sumY / n;

    if (fitMode === 'linear') {
      let sxx = 0;
      let sxy = 0;
      let sst = 0;
      for (const p of points) {
        const dx = p.x - meanX;
        const dy = p.y - meanY;
        sxx += dx * dx;
        sxy += dx * dy;
        sst += dy * dy;
      }
      const slope = Math.abs(sxx) > 1e-12 ? sxy / sxx : 0;
      const intercept = meanY - slope * meanX;
      let sse = 0;
      for (const p of points) {
        const pred = slope * p.x + intercept;
        sse += (p.y - pred) ** 2;
      }
      const r2 = sst > 1e-12 ? Math.max(0, 1 - sse / sst) : 1;
      return {
        kind: 'linear' as const,
        predict: (x: number) => slope * x + intercept,
        equation: `y = ${slope.toFixed(3)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(3)}`,
        r2
      };
    }

    // Simple quadratic least squares (fallback to linear if singular or < 3 pts)
    if (n < 3) {
      return null;
    }
    let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0, sy = 0, sxy = 0, sx2y = 0;
    for (const p of points) {
      const x2 = p.x * p.x;
      sx += p.x;
      sx2 += x2;
      sx3 += x2 * p.x;
      sx4 += x2 * x2;
      sy += p.y;
      sxy += p.x * p.y;
      sx2y += x2 * p.y;
    }
    // Solve 3x3 Gaussian elimination for c + b*x + a*x^2
    const A = [
      [n, sx, sx2, sy],
      [sx, sx2, sx3, sxy],
      [sx2, sx3, sx4, sx2y]
    ];
    for (let i = 0; i < 3; i++) {
      let maxR = i;
      for (let r = i + 1; r < 3; r++) {
        if (Math.abs(A[r][i]) > Math.abs(A[maxR][i])) maxR = r;
      }
      [A[i], A[maxR]] = [A[maxR], A[i]];
      if (Math.abs(A[i][i]) < 1e-12) return null;
      for (let r = i + 1; r < 3; r++) {
        const f = A[r][i] / A[i][i];
        for (let c = i; c < 4; c++) A[r][c] -= f * A[i][c];
      }
    }
    const coef = [0, 0, 0];
    for (let i = 2; i >= 0; i--) {
      let s = A[i][3];
      for (let c = i + 1; c < 3; c++) s -= A[i][c] * coef[c];
      coef[i] = s / A[i][i];
    }
    const [c0, b1, a2] = coef;
    let sst = 0, sse = 0;
    for (const p of points) {
      sst += (p.y - meanY) ** 2;
      const pred = a2 * p.x * p.x + b1 * p.x + c0;
      sse += (p.y - pred) ** 2;
    }
    const r2 = sst > 1e-12 ? Math.max(0, 1 - sse / sst) : 1;
    return {
      kind: 'quadratic' as const,
      predict: (x: number) => a2 * x * x + b1 * x + c0,
      equation: `y = ${a2.toFixed(3)}x² ${b1 >= 0 ? '+' : '-'} ${Math.abs(b1).toFixed(3)}x ${c0 >= 0 ? '+' : '-'} ${Math.abs(c0).toFixed(3)}`,
      r2
    };
  }, [points, fitMode]);

  const handleExportCsv = () => {
    const first = rows[0];
    const headers = ['Lan', 'Thoi gian t', first.m1Label, first.m2Label, first.m3Label];
    const csvLines = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map((r) =>
        [r.id, r.timeStr, r.m1Val, r.m2Val, r.m3Val]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
    ];
    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-lab-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    document.body.classList.add('synapse-printing-report');
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.body.classList.remove('synapse-printing-report');
      }, 400);
    }, 80);
  };

  // Compute SVG coordinates
  const W = 520;
  const H = 200;
  const PAD = 34;
  let minX = 0, maxX = 1, minY = 0, maxY = 1;
  if (points.length > 0) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    minX = Math.min(...xs);
    maxX = Math.max(...xs);
    minY = Math.min(...ys);
    maxY = Math.max(...ys);
    if (Math.abs(maxX - minX) < 1e-6) {
      minX -= 1;
      maxX += 1;
    }
    if (Math.abs(maxY - minY) < 1e-6) {
      minY -= 1;
      maxY += 1;
    }
  }
  const mapX = (x: number) => PAD + ((x - minX) / (maxX - minX)) * (W - PAD * 2);
  const mapY = (y: number) => H - PAD - ((y - minY) / (maxY - minY)) * (H - PAD * 2);

  const curvePath = useMemo(() => {
    if (!regression || points.length < 2) return '';
    const steps = 32;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const xv = minX + ((maxX - minX) * i) / steps;
      const yv = regression.predict(xv);
      if (!Number.isFinite(yv)) continue;
      const px = mapX(xv).toFixed(1);
      const py = Math.max(8, Math.min(H - 8, mapY(yv))).toFixed(1);
      d += d ? ` L ${px} ${py}` : `M ${px} ${py}`;
    }
    return d;
  }, [regression, points.length, minX, maxX, minY, maxY]);

  if (rows.length === 0) return null;

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 rounded-md p-4 border border-slate-200/85 dark:border-slate-800/90 shadow-sm space-y-3">
      {/* Header + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Data Logger & Phân Tích Hồi Quy ({rows.length} mẫu)
          </h4>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowChart((s) => !s)}
            className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
            <span>{showChart ? 'Ẩn đồ thị' : 'Hiện đồ thị'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrintPdf}
            className="px-2.5 py-1 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/50 text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In / Lưu PDF</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2 py-1 rounded border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Xóa</span>
          </button>
        </div>
      </div>

      {/* Regression Graph Controls + Plot */}
      {showChart && (
        <div className="rounded border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <span>Trục X:</span>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value as AxisKey)}
                  className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                >
                  {axisOptions.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                <span>Trục Y:</span>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value as AxisKey)}
                  className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                >
                  {axisOptions.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFitMode('linear')}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  fitMode === 'linear' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
              >
                Bậc 1 (Tuyến tính)
              </button>
              <button
                type="button"
                onClick={() => setFitMode('quadratic')}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  fitMode === 'quadratic' ? 'bg-sky-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
              >
                Bậc 2 (Parabol)
              </button>
            </div>
          </div>

          {points.length >= 2 ? (
            <div className="space-y-1.5">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                {/* Grid axes */}
                <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#94a3b8" strokeWidth="1" />
                <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#94a3b8" strokeWidth="1" />
                {curvePath && (
                  <path d={curvePath} fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
                )}
                {points.map((pt, idx) => (
                  <g key={`${pt.id}-${idx}`}>
                    <circle cx={mapX(pt.x)} cy={mapY(pt.y)} r="4" fill="#f59e0b" stroke="#0f172a" strokeWidth="1" />
                  </g>
                ))}
                <text x={PAD} y={H - 10} fontSize="10" fill="#64748b" fontFamily="monospace">
                  x∈[{minX.toFixed(2)}, {maxX.toFixed(2)}]
                </text>
                <text x={W - PAD - 125} y={18} fontSize="10" fill="#64748b" fontFamily="monospace">
                  y∈[{minY.toFixed(2)}, {maxY.toFixed(2)}]
                </text>
              </svg>
              {regression && (
                <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11px] font-mono">
                  <span className="font-bold text-sky-800 dark:text-sky-200">
                    Phương trình khớp: {regression.equation}
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                    R² = {regression.r2.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Cần ít nhất 2 mẫu số liệu hợp lệ (bấm "Ghi mẫu" nhiều lần ở các thời điểm/tham số khác nhau) để vẽ đồ thị hồi quy.
            </p>
          )}
        </div>
      )}

      {/* Raw Table */}
      <div className="overflow-x-auto max-h-52">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <th className="py-1.5 pr-3">Lần</th>
              <th className="py-1.5 pr-3">t</th>
              <th className="py-1.5 pr-3">{rows[0].m1Label}</th>
              <th className="py-1.5 pr-3">{rows[0].m2Label}</th>
              <th className="py-1.5">{rows[0].m3Label}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800/80 font-mono">
                <td className="py-1.5 pr-3 text-slate-400">#{row.id}</td>
                <td className="py-1.5 pr-3 text-slate-700 dark:text-slate-300">{row.timeStr}</td>
                <td className="py-1.5 pr-3 text-blue-600 dark:text-blue-400 font-bold">{row.m1Val}</td>
                <td className="py-1.5 pr-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.m2Val}</td>
                <td className="py-1.5 text-amber-600 dark:text-amber-400 font-bold">{row.m3Val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden Print-Ready Academic Lab Report (PDF Export) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="synapse-print-report-root" className="hidden p-8 text-slate-900 bg-white space-y-5">
            <div className="border-b-2 border-slate-900 pb-3 flex items-baseline justify-between">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wide">
                  BÁO CÁO THÍ NGHIỆM STEM · SYNAPSE LAB
                </h1>
                <p className="text-sm text-slate-600 mt-1">Chuyên đề: {title}</p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Ngày xuất: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
            {regression && (
              <div className="p-3 border border-slate-300 rounded text-xs font-mono">
                <strong>Kết quả hồi quy ({fitMode === 'linear' ? 'Tuyến tính' : 'Bậc 2'}):</strong>{' '}
                {regression.equation} · Hệ số xác định R² = {regression.r2.toFixed(4)}
              </div>
            )}
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left">Mẫu</th>
                  <th className="border border-slate-300 p-2 text-left">Thời gian</th>
                  <th className="border border-slate-300 p-2 text-left">{rows[0].m1Label}</th>
                  <th className="border border-slate-300 p-2 text-left">{rows[0].m2Label}</th>
                  <th className="border border-slate-300 p-2 text-left">{rows[0].m3Label}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="border border-slate-300 p-1.5 font-mono">#{r.id}</td>
                    <td className="border border-slate-300 p-1.5 font-mono">{r.timeStr}</td>
                    <td className="border border-slate-300 p-1.5 font-mono">{r.m1Val}</td>
                    <td className="border border-slate-300 p-1.5 font-mono">{r.m2Val}</td>
                    <td className="border border-slate-300 p-1.5 font-mono">{r.m3Val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
          document.body
        )}
    </div>
  );
};
