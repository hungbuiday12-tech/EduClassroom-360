import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CloudRain,
  Flame,
  Leaf,
  Pause,
  Play,
  RotateCcw,
  Skull,
  Sparkles,
  Sun,
  Thermometer,
} from 'lucide-react';
import { useBackgroundTheme } from '../../../context/BackgroundContext';

type BiomeId = 'pond' | 'rainforest' | 'desert';
type SpeciesKind = 'plant' | 'herbivore' | 'carnivore' | 'decomposer';

interface Critter {
  id: number;
  kind: SpeciesKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  size: number;
}

interface PopSnapshot {
  year: number;
  plant: number;
  herbivore: number;
  carnivore: number;
  decomposer: number;
}

const BIOMES: Record<
  BiomeId,
  {
    nameVi: string;
    nameEn: string;
    bgTop: string;
    bgBot: string;
    groundColor: string;
    defaultLight: number;
    defaultRain: number;
    defaultTemp: number;
    optTemp: number;
    optRain: number;
    plantColor: string;
    herbColor: string;
    carnColor: string;
    decompColor: string;
  }
> = {
  pond: {
    nameVi: 'Ao hồ nước ngọt',
    nameEn: 'Freshwater Pond',
    bgTop: '#082f49',
    bgBot: '#0f172a',
    groundColor: '#1e3a3a',
    defaultLight: 78,
    defaultRain: 85,
    defaultTemp: 24,
    optTemp: 24,
    optRain: 80,
    plantColor: '#22c55e',
    herbColor: '#38bdf8',
    carnColor: '#f43f5e',
    decompColor: '#a78bfa',
  },
  rainforest: {
    nameVi: 'Rừng nhiệt đới',
    nameEn: 'Tropical Rainforest',
    bgTop: '#064e3b',
    bgBot: '#052e16',
    groundColor: '#3f2e1d',
    defaultLight: 82,
    defaultRain: 78,
    defaultTemp: 28,
    optTemp: 27,
    optRain: 75,
    plantColor: '#4ade80',
    herbColor: '#fbbf24',
    carnColor: '#fb7185',
    decompColor: '#c084fc',
  },
  desert: {
    nameVi: 'Sa mạc khô hạn',
    nameEn: 'Arid Desert',
    bgTop: '#78350f',
    bgBot: '#1c1917',
    groundColor: '#92400e',
    defaultLight: 96,
    defaultRain: 18,
    defaultTemp: 39,
    optTemp: 35,
    optRain: 25,
    plantColor: '#84cc16',
    herbColor: '#fde047',
    carnColor: '#f97316',
    decompColor: '#d97706',
  },
};

function makeCritter(id: number, kind: SpeciesKind, x?: number, y?: number): Critter {
  const rx = x ?? 0.08 + Math.random() * 0.84;
  const ry =
    y ??
    (kind === 'plant'
      ? 0.68 + Math.random() * 0.22
      : kind === 'decomposer'
      ? 0.84 + Math.random() * 0.1
      : 0.22 + Math.random() * 0.62);
  const speed = kind === 'plant' ? 0 : kind === 'decomposer' ? 0.03 : kind === 'herbivore' ? 0.09 : 0.13;
  const ang = Math.random() * Math.PI * 2;
  return {
    id,
    kind,
    x: rx,
    y: ry,
    vx: Math.cos(ang) * speed,
    vy: Math.sin(ang) * speed,
    energy: kind === 'plant' ? 75 : 85,
    size: kind === 'plant' ? 7 : kind === 'herbivore' ? 6 : kind === 'carnivore' ? 8 : 4.5,
  };
}

export const EcosystemTerrariumSandbox: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const { perfMode } = useBackgroundTheme();
  const [biome, setBiome] = useState<BiomeId>('rainforest');
  const [spawnKind, setSpawnKind] = useState<SpeciesKind>('herbivore');
  const [light, setLight] = useState<number>(82);
  const [rain, setRain] = useState<number>(78);
  const [temp, setTemp] = useState<number>(28);
  const [timeScale, setTimeScale] = useState<1 | 5 | 20>(5);
  const [playing, setPlaying] = useState<boolean>(true);
  const [year, setYear] = useState<number>(0);
  const [soilFertility, setSoilFertility] = useState<number>(72);
  const [eventBanner, setEventBanner] = useState<string>('');
  const [history, setHistory] = useState<PopSnapshot[]>([]);
  const [counts, setCounts] = useState({ plant: 28, herbivore: 14, carnivore: 4, decomposer: 10 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const crittersRef = useRef<Critter[]>([]);
  const nextIdRef = useRef(1);
  const yearRef = useRef(0);
  const fertilityRef = useRef(72);
  const stateRef = useRef({ biome, light, rain, temp, timeScale, playing, perfMode });
  stateRef.current = { biome, light, rain, temp, timeScale, playing, perfMode };

  const initBiome = (targetBiome: BiomeId) => {
    const spec = BIOMES[targetBiome];
    setBiome(targetBiome);
    setLight(spec.defaultLight);
    setRain(spec.defaultRain);
    setTemp(spec.defaultTemp);
    yearRef.current = 0;
    fertilityRef.current = 72;
    setYear(0);
    setSoilFertility(72);
    setEventBanner('');

    const arr: Critter[] = [];
    const pN = targetBiome === 'desert' ? 14 : 30;
    const hN = targetBiome === 'desert' ? 7 : 15;
    const cN = targetBiome === 'desert' ? 2 : 5;
    const dN = 10;
    for (let i = 0; i < pN; i++) arr.push(makeCritter(nextIdRef.current++, 'plant'));
    for (let i = 0; i < hN; i++) arr.push(makeCritter(nextIdRef.current++, 'herbivore'));
    for (let i = 0; i < cN; i++) arr.push(makeCritter(nextIdRef.current++, 'carnivore'));
    for (let i = 0; i < dN; i++) arr.push(makeCritter(nextIdRef.current++, 'decomposer'));
    crittersRef.current = arr;
    setCounts({ plant: pN, herbivore: hN, carnivore: cN, decomposer: dN });
    setHistory([{ year: 0, plant: pN, herbivore: hN, carnivore: cN, decomposer: dN }]);
  };

  useEffect(() => {
    initBiome('rainforest');
  }, []);

  const spawnBurst = (kind: SpeciesKind, n = 5, nx?: number, ny?: number) => {
    for (let i = 0; i < n; i++) {
      const jitterX = nx !== undefined ? Math.max(0.05, Math.min(0.95, nx + (Math.random() - 0.5) * 0.08)) : undefined;
      const jitterY = ny !== undefined ? Math.max(0.12, Math.min(0.92, ny + (Math.random() - 0.5) * 0.08)) : undefined;
      crittersRef.current.push(makeCritter(nextIdRef.current++, kind, jitterX, jitterY));
    }
  };

  const triggerOutbreak = () => {
    crittersRef.current = crittersRef.current.filter(
      (c) => (c.kind !== 'herbivore' && c.kind !== 'carnivore') || Math.random() > 0.55
    );
    setEventBanner('Dịch bệnh bùng phát: 55% quần thể động vật bị suy giảm!');
  };

  const triggerDrought = () => {
    setRain((r) => Math.max(5, r - 45));
    setTemp((t) => Math.min(48, t + 11));
    setEventBanner('Hạn hán kéo dài: Độ ẩm giảm sâu, thực vật cạnh tranh gay gắt.');
  };

  const triggerNutrients = () => {
    fertilityRef.current = Math.min(100, fertilityRef.current + 28);
    setSoilFertility(Math.round(fertilityRef.current));
    spawnBurst('decomposer', 6);
    setEventBanner('Bổ sung mùn hữu cơ & vi sinh vật phân giải.');
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let accumTime = 0;
    let frameCount = 0;

    const stepSimulation = (dtYears: number) => {
      const s = stateRef.current;
      const bSpec = BIOMES[s.biome];
      const list = crittersRef.current;

      const tempSuit = Math.max(0.15, 1 - Math.abs(s.temp - bSpec.optTemp) / 28);
      const rainSuit = Math.max(0.15, 1 - Math.abs(s.rain - bSpec.optRain) / 85);
      const photoRate = (s.light / 100) * tempSuit * rainSuit * (0.45 + fertilityRef.current / 180);

      let plants = 0;
      let herbs = 0;
      let carns = 0;
      let decomps = 0;
      list.forEach((c) => {
        if (c.kind === 'plant') plants++;
        else if (c.kind === 'herbivore') herbs++;
        else if (c.kind === 'carnivore') carns++;
        else decomps++;
      });

      // Plant growth & overcrowding carry capacity
      const maxPlants = s.biome === 'desert' ? 42 : 78;
      if (plants < maxPlants && Math.random() < photoRate * dtYears * 3.8) {
        list.push(makeCritter(nextIdRef.current++, 'plant'));
      }
      if (plants > 0 && (rainSuit < 0.35 || plants > maxPlants * 0.92) && Math.random() < dtYears * 0.9) {
        const idx = list.findIndex((c) => c.kind === 'plant');
        if (idx >= 0) list.splice(idx, 1);
      }

      // Move & interact
      const toRemove = new Set<number>();
      const newborns: Critter[] = [];

      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if (toRemove.has(c.id)) continue;

        if (c.kind !== 'plant') {
          c.x += c.vx * dtYears * 0.55;
          c.y += c.vy * dtYears * 0.55;
          if (c.x < 0.04 || c.x > 0.96) {
            c.vx *= -1;
            c.x = Math.max(0.04, Math.min(0.96, c.x));
          }
          const minY = c.kind === 'decomposer' ? 0.78 : 0.16;
          const maxY = 0.93;
          if (c.y < minY || c.y > maxY) {
            c.vy *= -1;
            c.y = Math.max(minY, Math.min(maxY, c.y));
          }
          if (Math.random() < 0.04) {
            c.vx += (Math.random() - 0.5) * 0.03;
            c.vy += (Math.random() - 0.5) * 0.03;
          }
        }

        if (c.kind === 'herbivore') {
          c.energy -= (4.2 + Math.max(0, s.temp - 34) * 0.25) * dtYears;
          // Seek & eat plant
          for (let j = 0; j < list.length; j++) {
            const p = list[j];
            if (p.kind !== 'plant' || toRemove.has(p.id)) continue;
            if (Math.hypot(p.x - c.x, p.y - c.y) < 0.065) {
              toRemove.add(p.id);
              c.energy = Math.min(130, c.energy + 34);
              break;
            }
          }
          if (c.energy > 110 && herbs < 46 && newborns.length < 4) {
            c.energy -= 48;
            newborns.push(makeCritter(nextIdRef.current++, 'herbivore', c.x, c.y));
          }
          if (c.energy <= 0) {
            toRemove.add(c.id);
            fertilityRef.current = Math.min(100, fertilityRef.current + 1.5);
          }
        } else if (c.kind === 'carnivore') {
          c.energy -= 6.5 * dtYears;
          for (let j = 0; j < list.length; j++) {
            const h = list[j];
            if (h.kind !== 'herbivore' || toRemove.has(h.id)) continue;
            if (Math.hypot(h.x - c.x, h.y - c.y) < 0.075) {
              toRemove.add(h.id);
              c.energy = Math.min(145, c.energy + 52);
              break;
            }
          }
          if (c.energy > 125 && carns < 20 && newborns.length < 2) {
            c.energy -= 60;
            newborns.push(makeCritter(nextIdRef.current++, 'carnivore', c.x, c.y));
          }
          if (c.energy <= 0) {
            toRemove.add(c.id);
            fertilityRef.current = Math.min(100, fertilityRef.current + 2.5);
          }
        } else if (c.kind === 'decomposer') {
          fertilityRef.current = Math.min(100, fertilityRef.current + 0.28 * dtYears);
          if (decomps < 18 && fertilityRef.current > 68 && Math.random() < 0.15 * dtYears) {
            newborns.push(makeCritter(nextIdRef.current++, 'decomposer', c.x, c.y));
          }
        }
      }

      fertilityRef.current = Math.max(20, fertilityRef.current - plants * 0.04 * dtYears);

      if (toRemove.size > 0 || newborns.length > 0) {
        crittersRef.current = [
          ...list.filter((c) => !toRemove.has(c.id)),
          ...newborns,
        ].slice(0, 175);
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;

      if (s.playing) {
        const dtYears = dt * s.timeScale;
        yearRef.current += dtYears;
        stepSimulation(dtYears);
        accumTime += dt;
      }

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
            const bSpec = BIOMES[s.biome];

            // Biome Sky / Water Gradient
            const grad = ctx.createLinearGradient(0, 0, 0, H);
            grad.addColorStop(0, bSpec.bgTop);
            grad.addColorStop(1, bSpec.bgBot);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            // Sunlight shafts
            const sunAlpha = (s.light / 100) * 0.16;
            ctx.fillStyle = `rgba(253, 224, 71, ${sunAlpha.toFixed(3)})`;
            for (let k = 0; k < 4; k++) {
              ctx.beginPath();
              ctx.moveTo(W * (0.15 + k * 0.22), 0);
              ctx.lineTo(W * (0.26 + k * 0.22), 0);
              ctx.lineTo(W * (0.14 + k * 0.22), H * 0.78);
              ctx.lineTo(W * (0.04 + k * 0.22), H * 0.78);
              ctx.closePath();
              ctx.fill();
            }

            // Rain streaks
            if (s.rain > 25 && !s.perfMode) {
              const drops = Math.round((s.rain / 100) * 45);
              ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
              ctx.lineWidth = 1;
              for (let r = 0; r < drops; r++) {
                const rx = ((r * 97 + now * 0.08) % W);
                const ry = ((r * 61 + now * 0.45) % (H * 0.8));
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 4, ry + 12);
                ctx.stroke();
              }
            }

            // Substrate / Ground layer
            ctx.fillStyle = bSpec.groundColor;
            ctx.fillRect(0, H * 0.78, W, H * 0.22);
            ctx.fillStyle = 'rgba(255,255,255,0.06)';
            ctx.fillRect(0, H * 0.78, W, 2);

            // Organisms
            const list = crittersRef.current;
            for (let i = 0; i < list.length; i++) {
              const c = list[i];
              const px = c.x * W;
              const py = c.y * H;
              if (c.kind === 'plant') {
                ctx.strokeStyle = bSpec.plantColor;
                ctx.lineWidth = 2.4;
                const sway = Math.sin(now * 0.002 + c.id) * 4;
                ctx.beginPath();
                ctx.moveTo(px, py + 12);
                ctx.quadraticCurveTo(px + sway, py - 6, px + sway * 1.3, py - 16);
                ctx.stroke();
                ctx.fillStyle = bSpec.plantColor;
                ctx.beginPath();
                ctx.arc(px + sway * 1.1, py - 16, 4.5, 0, Math.PI * 2);
                ctx.fill();
              } else if (c.kind === 'herbivore') {
                ctx.fillStyle = bSpec.herbColor;
                ctx.beginPath();
                ctx.ellipse(px, py, c.size * 1.25, c.size * 0.85, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.arc(px + (c.vx >= 0 ? 3 : -3), py - 1.5, 1.5, 0, Math.PI * 2);
                ctx.fill();
              } else if (c.kind === 'carnivore') {
                ctx.fillStyle = bSpec.carnColor;
                ctx.beginPath();
                const dir = c.vx >= 0 ? 1 : -1;
                ctx.moveTo(px + dir * 10, py);
                ctx.lineTo(px - dir * 8, py - 6);
                ctx.lineTo(px - dir * 5, py);
                ctx.lineTo(px - dir * 8, py + 6);
                ctx.closePath();
                ctx.fill();
              } else {
                ctx.fillStyle = bSpec.decompColor;
                ctx.beginPath();
                ctx.arc(px, py, c.size, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            // Year overlay badge
            ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
            ctx.fillRect(12, 12, 178, 30);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(`Năm ảo: ${Math.floor(yearRef.current)} năm`, 22, 31);
            ctx.restore();
          }
        }
      }

      frameCount++;
      if (frameCount % 12 === 0) {
        let plant = 0;
        let herbivore = 0;
        let carnivore = 0;
        let decomposer = 0;
        crittersRef.current.forEach((c) => {
          if (c.kind === 'plant') plant++;
          else if (c.kind === 'herbivore') herbivore++;
          else if (c.kind === 'carnivore') carnivore++;
          else decomposer++;
        });
        const yNow = Math.floor(yearRef.current);
        setYear(yNow);
        setSoilFertility(Math.round(fertilityRef.current));
        setCounts({ plant, herbivore, carnivore, decomposer });

        if (accumTime >= 0.9 && s.playing) {
          accumTime = 0;
          setHistory((prev) => [...prev.slice(-39), { year: yNow, plant, herbivore, carnivore, decomposer }]);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const successionStage = useMemo(() => {
    const total = counts.plant + counts.herbivore + counts.carnivore;
    if (total === 0) return 'Hoang mạc hóa / Suy thoái';
    if (year < 15 || counts.plant < 10) return 'Giai đoạn Tiên phong (Sơ khai)';
    if (counts.carnivore >= 3 && counts.herbivore >= 8 && counts.plant >= 18) {
      return 'Quần xã Đỉnh cực Cân bằng (Climax)';
    }
    return 'Diễn thế Trung gian — Đang tái lập lưới thức ăn';
  }, [counts, year]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    spawnBurst(spawnKind, 3, nx, ny);
  };

  return (
    <div className="space-y-4">
      {/* Biome & Species Spawner Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['pond', 'rainforest', 'desert'] as BiomeId[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => initBiome(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  biome === b
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isEn ? BIOMES[b].nameEn : BIOMES[b].nameVi}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {([1, 5, 20] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setTimeScale(spd)}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold cursor-pointer whitespace-nowrap ${
                  timeScale === spd
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {spd}× năm/s
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playing ? 'Tạm dừng' : 'Chạy'}</span>
            </button>
            <button
              type="button"
              onClick={() => initBiome(biome)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Khởi tạo lại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Click-to-drop species selector + Event triggers */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Nhấp hồ cạn để thả loài:</span>
            {([
              { id: 'plant', label: 'Thực vật / Tảo (+3)', color: 'bg-emerald-600' },
              { id: 'herbivore', label: 'Ăn cỏ (+3)', color: 'bg-sky-600' },
              { id: 'carnivore', label: 'Ăn thịt (+3)', color: 'bg-rose-600' },
              { id: 'decomposer', label: 'Phân giải (+3)', color: 'bg-purple-600' },
            ] as { id: SpeciesKind; label: string; color: string }[]).map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => {
                  setSpawnKind(sp.id);
                  spawnBurst(sp.id, 3);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap ${
                  spawnKind === sp.id
                    ? `${sp.color} text-white`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={triggerOutbreak}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Skull className="w-3.5 h-3.5" />
              <span>Dịch bệnh</span>
            </button>
            <button
              type="button"
              onClick={triggerDrought}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hạn hán</span>
            </button>
            <button
              type="button"
              onClick={triggerNutrients}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bón dinh dưỡng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terrarium Canvas */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-[400px] sm:h-[460px] block cursor-crosshair"
        />

        {/* Environmental Controls & Population Telemetry */}
        <div className="border-t border-slate-800 bg-slate-900 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 text-slate-100">
          <div className="lg:col-span-5 space-y-2.5">
            <label className="block space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-amber-400" /> Cường độ ánh sáng</span>
                <span className="font-mono tabular-nums text-amber-300">{light}%</span>
              </div>
              <input type="range" min={10} max={100} value={light} onChange={(e) => setLight(Number(e.target.value))} className="w-full accent-amber-400" />
            </label>
            <label className="block space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-sky-400" /> Lượng mưa / Độ ẩm</span>
                <span className="font-mono tabular-nums text-sky-300">{rain}%</span>
              </div>
              <input type="range" min={0} max={100} value={rain} onChange={(e) => setRain(Number(e.target.value))} className="w-full accent-sky-400" />
            </label>
            <label className="block space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> Nhiệt độ môi trường</span>
                <span className="font-mono tabular-nums text-rose-300">{temp}°C</span>
              </div>
              <input type="range" min={0} max={48} value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-rose-400" />
            </label>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400 flex items-center gap-1"><Leaf className="w-3 h-3 text-emerald-400" /> Thực vật</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-emerald-400">{counts.plant}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Ăn cỏ (Bậc 1)</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-sky-400">{counts.herbivore}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Ăn thịt (Bậc 2)</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-rose-400">{counts.carnivore}</div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="text-[11px] text-slate-400">Độ phì / Phân giải</div>
                <div className="text-lg font-mono font-extrabold tabular-nums text-purple-400">{soilFertility}% ({counts.decomposer})</div>
              </div>
            </div>

            {/* Population Time-Series Sparkline SVG */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] mb-1.5">
                <span className="font-bold text-slate-300">Biểu đồ diễn thế sinh thái: {successionStage}</span>
                {eventBanner && <span className="text-amber-300 font-semibold">{eventBanner}</span>}
              </div>
              <svg viewBox="0 0 360 64" className="w-full h-16 overflow-visible">
                {[
                  { key: 'plant' as const, color: '#34d399', max: 80 },
                  { key: 'herbivore' as const, color: '#38bdf8', max: 50 },
                  { key: 'carnivore' as const, color: '#fb7185', max: 25 },
                ].map((series) => {
                  if (history.length < 2) return null;
                  const pts = history
                    .map((h, i) => {
                      const x = (i / (history.length - 1)) * 360;
                      const y = 60 - Math.min(1, h[series.key] / series.max) * 54;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ');
                  return (
                    <polyline
                      key={series.key}
                      fill="none"
                      stroke={series.color}
                      strokeWidth="2"
                      points={pts}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
