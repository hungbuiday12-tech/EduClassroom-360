import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Dna,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
} from 'lucide-react';
import { useBackgroundTheme } from '../../../context/BackgroundContext';

type CellKind = 'animal' | 'plant';
type OrganelleType = 'nucleus' | 'mitochondria' | 'chloroplast' | 'ribosome' | 'golgi' | 'vacuole';

interface PlacedOrganelle {
  id: number;
  type: OrganelleType;
  nx: number; // normalized [-0.7, 0.7] relative to cell center
  ny: number;
}

const ORGANELLE_META: Record<
  OrganelleType,
  {
    nameVi: string;
    roleVi: string;
    color: string;
    radius: number;
  }
> = {
  nucleus: { nameVi: 'Nhân tế bào', roleVi: 'Lưu giữ ADN & điều khiển nguyên phân', color: '#8b5cf6', radius: 28 },
  mitochondria: { nameVi: 'Ty thể', roleVi: 'Hô hấp tế bào: Glucose + O₂ → ATP', color: '#f97316', radius: 18 },
  chloroplast: { nameVi: 'Lục lạp', roleVi: 'Quang hợp (Thực vật): Ánh sáng → Glucose + O₂', color: '#22c55e', radius: 19 },
  ribosome: { nameVi: 'Ribosome', roleVi: 'Tổng hợp chuỗi Protein từ Axit amin', color: '#38bdf8', radius: 10 },
  golgi: { nameVi: 'Bộ máy Golgi & ER', roleVi: 'Đóng gói, vận chuyển Protein & Lipid', color: '#eab308', radius: 20 },
  vacuole: { nameVi: 'Không bào', roleVi: 'Điều hòa áp suất thẩm thấu & dự trữ nước', color: '#06b6d4', radius: 24 },
};

export const CellBuilderSandbox: React.FC<{ isEn?: boolean }> = () => {
  const { perfMode } = useBackgroundTheme();
  const [cellKind, setCellKind] = useState<CellKind>('plant');
  const [activeOrg, setActiveOrg] = useState<OrganelleType>('mitochondria');
  const [organelles, setOrganelles] = useState<PlacedOrganelle[]>([]);
  const [glucose, setGlucose] = useState<number>(65);
  const [oxygen, setOxygen] = useState<number>(70);
  const [light, setLight] = useState<number>(75);
  const [aminoAcids, setAminoAcids] = useState<number>(60);
  const [growthProgress, setGrowthProgress] = useState<number>(0);
  const [divisionCount, setDivisionCount] = useState<number>(0);
  const [mitosisAnim, setMitosisAnim] = useState<number>(0); // 0 = single, >0..1 splitting animation

  const nextIdRef = useRef(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    cellKind,
    organelles,
    glucose,
    oxygen,
    light,
    aminoAcids,
    mitosisAnim,
    perfMode,
  });
  stateRef.current = { cellKind, organelles, glucose, oxygen, light, aminoAcids, mitosisAnim, perfMode };

  const counts = useMemo(() => {
    const c: Record<OrganelleType, number> = {
      nucleus: 0,
      mitochondria: 0,
      chloroplast: 0,
      ribosome: 0,
      golgi: 0,
      vacuole: 0,
    };
    organelles.forEach((o) => {
      c[o.type]++;
    });
    return c;
  }, [organelles]);

  const metrics = useMemo(() => {
    const photoRate =
      cellKind === 'plant' ? counts.chloroplast * (light / 100) * 18 : 0;
    const effectiveGlucose = Math.min(100, glucose + photoRate * 0.6);
    const effectiveO2 = Math.min(100, oxygen + photoRate * 0.4);
    const atpRate = Math.round(
      counts.mitochondria * (effectiveGlucose / 100) * (effectiveO2 / 100) * 36
    );
    const proteinRate = Math.round(
      counts.ribosome * (aminoAcids / 100) * Math.min(1.5, Math.max(0.2, atpRate / 25)) * 12 +
        counts.golgi * 4
    );
    const osmoticStability = Math.min(
      100,
      35 + counts.vacuole * 28 + (cellKind === 'plant' ? 20 : 10)
    );

    const warnings: string[] = [];
    if (counts.nucleus === 0) warnings.push('Chưa có Nhân tế bào: tế bào không thể chỉ đạo tổng hợp hay phân chia.');
    if (counts.mitochondria === 0) warnings.push('Thiếu Ty thể: tế bào thiếu năng lượng ATP để duy trì sống!');
    if (cellKind === 'plant' && counts.chloroplast === 0) {
      warnings.push('Tế bào thực vật chưa có Lục lạp để tự quang hợp tạo Glucose.');
    }
    if (counts.ribosome === 0) warnings.push('Thiếu Ribosome: không thể tổng hợp protein cấu trúc mới.');

    return { photoRate: Math.round(photoRate), atpRate, proteinRate, osmoticStability, warnings };
  }, [counts, cellKind, glucose, oxygen, light, aminoAcids]);

  const placeOrganelleAt = (nx: number, ny: number, type = activeOrg) => {
    if (type === 'chloroplast' && cellKind === 'animal') return;
    // Clamp inside unit circle radius 0.68
    const r = Math.hypot(nx, ny);
    const scale = r > 0.64 ? 0.64 / r : 1;
    setOrganelles((prev) => [
      ...prev.slice(-28),
      { id: nextIdRef.current++, type, nx: nx * scale, ny: ny * scale },
    ]);
  };

  const loadStarterOrganelles = () => {
    const starter: PlacedOrganelle[] = [
      { id: nextIdRef.current++, type: 'nucleus', nx: -0.08, ny: -0.05 },
      { id: nextIdRef.current++, type: 'mitochondria', nx: 0.34, ny: -0.2 },
      { id: nextIdRef.current++, type: 'mitochondria', nx: -0.35, ny: 0.28 },
      { id: nextIdRef.current++, type: 'ribosome', nx: 0.16, ny: 0.25 },
      { id: nextIdRef.current++, type: 'ribosome', nx: -0.24, ny: -0.3 },
      { id: nextIdRef.current++, type: 'golgi', nx: 0.28, ny: 0.12 },
      { id: nextIdRef.current++, type: 'vacuole', nx: -0.38, ny: -0.02 },
    ];
    if (cellKind === 'plant') {
      starter.push({ id: nextIdRef.current++, type: 'chloroplast', nx: 0.42, ny: 0.32 });
      starter.push({ id: nextIdRef.current++, type: 'chloroplast', nx: -0.1, ny: 0.44 });
    }
    setOrganelles(starter);
  };

  // Growth progress accumulation toward Mitosis
  useEffect(() => {
    const timer = window.setInterval(() => {
      const canGrow = counts.nucleus > 0 && metrics.atpRate >= 15 && metrics.proteinRate >= 10;
      if (canGrow) {
        setGrowthProgress((p) => Math.min(100, p + Math.max(2, Math.round((metrics.atpRate + metrics.proteinRate) / 25))));
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [counts.nucleus, metrics.atpRate, metrics.proteinRate]);

  // Mitosis animation timer
  useEffect(() => {
    if (mitosisAnim <= 0) return;
    const timer = window.setInterval(() => {
      setMitosisAnim((v) => {
        if (v >= 1) {
          setDivisionCount((c) => c + 1);
          setGrowthProgress(18);
          return 0;
        }
        return v + 0.04;
      });
    }, 35);
    return () => window.clearInterval(timer);
  }, [mitosisAnim]);

  const triggerMitosis = () => {
    if (counts.nucleus === 0 || metrics.atpRate < 12) return;
    setMitosisAnim(0.02);
  };

  // Live Cell Physiology 2D Canvas
  useEffect(() => {
    let raf = 0;
    const render = (now: number) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const W = rect.width;
            const H = rect.height;
            const s = stateRef.current;

            ctx.fillStyle = '#060d19';
            ctx.fillRect(0, 0, W, H);

            // Subtle ambient grid
            ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += 36) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, H);
              ctx.stroke();
            }
            for (let y = 0; y < H; y += 36) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(W, y);
              ctx.stroke();
            }

            const t = now * 0.001;
            const baseR = Math.min(W, H) * 0.37;
            const splitOffset = s.mitosisAnim > 0 ? Math.sin(s.mitosisAnim * Math.PI) * 95 : 0;
            const centers = splitOffset > 4 ? [W / 2 - splitOffset, W / 2 + splitOffset] : [W / 2];

            centers.forEach((cx, cIdx) => {
              const cy = H / 2;
              const rScale = centers.length > 1 ? 0.78 : 1;
              const R = baseR * rScale;

              // Outer Plant Cell Wall or Animal Membrane
              if (s.cellKind === 'plant') {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.roundRect(cx - R * 1.08, cy - R * 0.92, R * 2.16, R * 1.84, 34);
                ctx.fill();
                ctx.stroke();
              }

              // Cytoplasm & Membrane
              const cytoGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, R);
              cytoGrad.addColorStop(0, 'rgba(14, 116, 144, 0.34)');
              cytoGrad.addColorStop(1, 'rgba(15, 23, 42, 0.78)');
              ctx.fillStyle = cytoGrad;
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.ellipse(cx, cy, R, R * 0.86, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Render placed organelles
              s.organelles.forEach((org) => {
                const ox = cx + org.nx * R * 1.15 + Math.sin(t * 1.2 + org.id) * 3;
                const oy = cy + org.ny * R * 0.98 + Math.cos(t * 1.1 + org.id) * 3;
                const meta = ORGANELLE_META[org.type];
                const rad = meta.radius * rScale;

                if (org.type === 'nucleus') {
                  ctx.fillStyle = 'rgba(139, 92, 246, 0.45)';
                  ctx.strokeStyle = '#a78bfa';
                  ctx.lineWidth = 2.5;
                  ctx.beginPath();
                  ctx.arc(ox, oy, rad, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.stroke();
                  ctx.fillStyle = '#ddd6fe';
                  ctx.beginPath();
                  ctx.arc(ox + 4, oy - 3, rad * 0.35, 0, Math.PI * 2);
                  ctx.fill();
                } else if (org.type === 'mitochondria') {
                  ctx.save();
                  ctx.translate(ox, oy);
                  ctx.rotate(org.id * 0.6);
                  ctx.fillStyle = '#ea580c';
                  ctx.strokeStyle = '#fdba74';
                  ctx.lineWidth = 1.8;
                  ctx.beginPath();
                  ctx.ellipse(0, 0, rad * 1.2, rad * 0.65, 0, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();

                  // Animated ATP sparks if Glucose + O2 > 15
                  if (s.glucose > 15 && s.oxygen > 15 && !s.perfMode && cIdx === 0) {
                    const phase = (t * 1.8 + org.id * 0.4) % 1;
                    const sx = ox + Math.cos(org.id + phase * 3) * (rad + phase * 22);
                    const sy = oy + Math.sin(org.id + phase * 3) * (rad + phase * 22);
                    ctx.fillStyle = `rgba(250, 204, 21, ${(1 - phase).toFixed(2)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                    ctx.fill();
                  }
                } else if (org.type === 'chloroplast') {
                  ctx.save();
                  ctx.translate(ox, oy);
                  ctx.rotate(-org.id * 0.4);
                  ctx.fillStyle = '#16a34a';
                  ctx.strokeStyle = '#86efac';
                  ctx.lineWidth = 1.8;
                  ctx.beginPath();
                  ctx.ellipse(0, 0, rad * 1.25, rad * 0.72, 0, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.stroke();
                  ctx.restore();
                } else if (org.type === 'ribosome') {
                  ctx.fillStyle = '#38bdf8';
                  ctx.beginPath();
                  ctx.arc(ox, oy, rad * 0.55, 0, Math.PI * 2);
                  ctx.fill();
                } else if (org.type === 'golgi') {
                  ctx.strokeStyle = '#facc15';
                  ctx.lineWidth = 3;
                  for (let k = -1; k <= 1; k++) {
                    ctx.beginPath();
                    ctx.arc(ox, oy + k * 6, rad * 0.85, 0.25 * Math.PI, 0.75 * Math.PI);
                    ctx.stroke();
                  }
                } else if (org.type === 'vacuole') {
                  ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
                  ctx.strokeStyle = '#67e8f9';
                  ctx.lineWidth = 1.8;
                  ctx.beginPath();
                  ctx.ellipse(ox, oy, rad * 1.15, rad * 0.9, 0.2, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.stroke();
                }
              });
            });

            if (s.organelles.length === 0) {
              ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
              ctx.font = 'bold 13px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('Màng tế bào đang trống — Chọn bào quan bên trên rồi nhấp vào trong tế bào!', W / 2, H / 2);
            }

            ctx.restore();
          }
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const baseR = Math.min(rect.width, rect.height) * 0.37;
    const nx = (e.clientX - rect.left - rect.width / 2) / (baseR * 1.15);
    const ny = (e.clientY - rect.top - rect.height / 2) / (baseR * 0.98);
    placeOrganelleAt(nx, ny);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Cell Type & Organelle Palette */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setCellKind('plant');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                cellKind === 'plant' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Tế bào Thực vật (Có thành Xenlulozơ)
            </button>
            <button
              type="button"
              onClick={() => {
                setCellKind('animal');
                setOrganelles((prev) => prev.filter((o) => o.type !== 'chloroplast'));
                if (activeOrg === 'chloroplast') setActiveOrg('mitochondria');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-bold cursor-pointer ${
                cellKind === 'animal' ? 'bg-sky-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Tế bào Động vật
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={loadStarterOrganelles}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lắp nhanh bộ bào quan chuẩn</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOrganelles([]);
                setGrowthProgress(0);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Làm trống</span>
            </button>
          </div>
        </div>

        {/* Organelle Picker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          {(Object.keys(ORGANELLE_META) as OrganelleType[]).map((orgKey) => {
            const meta = ORGANELLE_META[orgKey];
            const disabled = orgKey === 'chloroplast' && cellKind === 'animal';
            const selected = activeOrg === orgKey;
            return (
              <button
                key={orgKey}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setActiveOrg(orgKey);
                  placeOrganelleAt((Math.random() - 0.5) * 0.85, (Math.random() - 0.5) * 0.85, orgKey);
                }}
                className={`text-left p-2.5 rounded-xl border text-xs transition-colors ${
                  disabled
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                    : selected
                    ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50 dark:bg-teal-950/40 cursor-pointer'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-teal-400 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between gap-1 font-bold text-slate-900 dark:text-white">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    {meta.nameVi}
                  </span>
                  <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">{counts[orgKey]}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{meta.roleVi}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Living Cell Viewport */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-[380px] sm:h-[440px] block cursor-crosshair"
        />

        <div className="border-t border-slate-800 bg-slate-900 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 text-slate-100">
          <div className="lg:col-span-5 space-y-2.5 text-xs">
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Nguồn Glucose ngoại bào</span>
                <span className="font-mono tabular-nums text-amber-300">{glucose}%</span>
              </div>
              <input type="range" min={0} max={100} value={glucose} onChange={(e) => setGlucose(Number(e.target.value))} className="w-full accent-amber-400" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Nồng độ Oxi (O₂)</span>
                <span className="font-mono tabular-nums text-sky-300">{oxygen}%</span>
              </div>
              <input type="range" min={0} max={100} value={oxygen} onChange={(e) => setOxygen(Number(e.target.value))} className="w-full accent-sky-400" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-yellow-400" /> Ánh sáng (Quang hợp)</span>
                <span className="font-mono tabular-nums text-yellow-300">{light}%</span>
              </div>
              <input type="range" min={0} max={100} value={light} onChange={(e) => setLight(Number(e.target.value))} className="w-full accent-yellow-400" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Axit amin (Tổng hợp Protein)</span>
                <span className="font-mono tabular-nums text-cyan-300">{aminoAcids}%</span>
              </div>
              <input type="range" min={0} max={100} value={aminoAcids} onChange={(e) => setAminoAcids(Number(e.target.value))} className="w-full accent-cyan-400" />
            </label>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Sản lượng ATP</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-amber-400">{metrics.atpRate} u/s</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Quang hợp Glucose</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-emerald-400">{metrics.photoRate} u/s</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Tổng hợp Protein</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-sky-400">{metrics.proteinRate} u/s</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Số lần Nguyên phân</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-purple-400">{divisionCount}</div>
              </div>
            </div>

            {/* Growth & Mitosis Trigger */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex-1 min-w-[180px] space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Tiến độ Chu kỳ tế bào (G1 → S → G2)</span>
                  <span className="font-mono text-emerald-400">{growthProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${growthProgress}%` }} />
                </div>
              </div>
              <button
                type="button"
                disabled={counts.nucleus === 0 || metrics.atpRate < 12 || mitosisAnim > 0}
                onClick={triggerMitosis}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold cursor-pointer whitespace-nowrap"
              >
                <Dna className="w-3.5 h-3.5" />
                <span>Kích hoạt Nguyên phân (1 → 2)</span>
              </button>
            </div>

            {metrics.warnings.length > 0 ? (
              <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs text-amber-200 space-y-1">
                {metrics.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-2.5 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tế bào vận hành cân bằng nội môi, đủ ATP &amp; Protein để sinh trưởng và phân chia!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
