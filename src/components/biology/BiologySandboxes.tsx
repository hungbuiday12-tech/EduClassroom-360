import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Calculator,
  Dna,
  Download,
  FlaskConical,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Sprout
} from 'lucide-react';
import { useBackgroundTheme } from '../../context/BackgroundContext';

const CODON_TABLE: Record<string, string> = {
  AUG: 'Met (Mở đầu)',
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
  UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
  UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP', UGA: 'STOP',
  UGU: 'Cys', UGC: 'Cys', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
  CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
  CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
  GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
  GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
  GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val'
};

type MendelPresetId =
  | 'mono_het'
  | 'di_het'
  | 'test_cross'
  | 'incomplete'
  | 'sex_linked'
  | 'abo_blood';

interface CrossOutcome {
  genotype: string;
  phenotype: string;
  color: string;
  seedStyle?: 'yellow_smooth' | 'yellow_wrinkled' | 'green_smooth' | 'green_wrinkled' | 'flower_red' | 'flower_pink' | 'flower_white' | 'eye_red' | 'eye_white' | 'blood_a' | 'blood_b' | 'blood_ab' | 'blood_o';
}

interface MendelModel {
  title: string;
  lawNote: string;
  p1Label: string;
  p2Label: string;
  g1: string[];
  g2: string[];
  matrix: CrossOutcome[][];
  genotypeSummary: { genotype: string; count: number; pct: number }[];
  phenotypeSummary: {
    phenotype: string;
    count: number;
    pct: number;
    color: string;
    seedStyle: NonNullable<CrossOutcome['seedStyle']>;
  }[];
  totalCells: number;
}

const MONO_GENOTYPES = ['AA', 'Aa', 'aa'] as const;
const DI_GENOTYPES = ['AABB', 'AaBB', 'AABb', 'AaBb', 'AAbb', 'Aabb', 'aaBB', 'aaBb', 'aabb'] as const;

function getMonoGametes(g: string): string[] {
  if (g === 'AA') return ['A'];
  if (g === 'aa') return ['a'];
  return ['A', 'a'];
}

function getDiGametes(g: string): string[] {
  const aAlleles = g.slice(0, 2) === 'AA' ? ['A'] : g.slice(0, 2) === 'aa' ? ['a'] : ['A', 'a'];
  const bAlleles = g.slice(2, 4) === 'BB' ? ['B'] : g.slice(2, 4) === 'bb' ? ['b'] : ['B', 'b'];
  const res: string[] = [];
  for (const a of aAlleles) {
    for (const b of bAlleles) {
      res.push(`${a}${b}`);
    }
  }
  return res;
}

function combineMono(g1: string, g2: string): string {
  return [g1, g2].sort().join('');
}

function combineDi(g1: string, g2: string): string {
  const aPart = [g1[0], g2[0]].sort().join('');
  const bPart = [g1[1], g2[1]].sort().join('');
  return `${aPart}${bPart}`;
}

function chiSquareCritical05(df: number): number {
  const table: Record<number, number> = {
    1: 3.841,
    2: 5.991,
    3: 7.815,
    4: 9.488,
    5: 11.07,
    6: 12.592,
    7: 14.067
  };
  return table[df] || 3.841 + (df - 1) * 1.9;
}

function triggerDownloadText(filename: string, content: string, mime = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const BiologySandboxes: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const { perfMode } = useBackgroundTheme();
  const [tab, setTab] = useState<'mendel' | 'codon' | 'hardy' | 'enzyme' | 'eco'>('mendel');

  // 1. Mendel Cross & Punnett Sandbox
  const [mendelPreset, setMendelPreset] = useState<MendelPresetId>('di_het');
  const [p1Mono, setP1Mono] = useState<string>('Aa');
  const [p2Mono, setP2Mono] = useState<string>('Aa');
  const [p1Di, setP1Di] = useState<string>('AaBb');
  const [p2Di, setP2Di] = useState<string>('AaBb');
  const [sampleSize, setSampleSize] = useState<number>(640);
  const [simCounts, setSimCounts] = useState<Record<string, number> | null>(null);
  const [selectedPheno, setSelectedPheno] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);
  const mendelCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectMendelPreset = (preset: MendelPresetId) => {
    setMendelPreset(preset);
    setSimCounts(null);
    setSelectedPheno(null);
    setHoveredCell(null);
    if (preset === 'mono_het') {
      setP1Mono('Aa');
      setP2Mono('Aa');
    } else if (preset === 'di_het') {
      setP1Di('AaBb');
      setP2Di('AaBb');
    } else if (preset === 'test_cross') {
      setP1Di('AaBb');
      setP2Di('aabb');
    } else if (preset === 'incomplete') {
      setP1Mono('Aa');
      setP2Mono('Aa');
    }
  };

  const mendelModel: MendelModel = useMemo(() => {
    const classify = (g1: string, g2: string): CrossOutcome => {
      if (mendelPreset === 'mono_het') {
        const geno = combineMono(g1, g2);
        const dom = geno.includes('A');
        return {
          genotype: geno,
          phenotype: dom ? 'Hạt vàng (Trội A_)' : 'Hạt xanh (Lặn aa)',
          color: dom ? '#eab308' : '#10b981',
          seedStyle: dom ? 'yellow_smooth' : 'green_smooth'
        };
      }
      if (mendelPreset === 'incomplete') {
        const geno = combineMono(g1, g2);
        if (geno === 'AA') {
          return { genotype: geno, phenotype: 'Hoa Đỏ (AA)', color: '#ef4444', seedStyle: 'flower_red' };
        }
        if (geno === 'Aa') {
          return { genotype: geno, phenotype: 'Hoa Hồng (Aa)', color: '#f472b6', seedStyle: 'flower_pink' };
        }
        return { genotype: geno, phenotype: 'Hoa Trắng (aa)', color: '#e2e8f0', seedStyle: 'flower_white' };
      }
      if (mendelPreset === 'sex_linked') {
        const pair = [g1, g2].sort((a, b) => (a === 'Y' ? 1 : b === 'Y' ? -1 : a.localeCompare(b)));
        const geno = pair.join('');
        const isWhite = geno === 'XᵃXᵃ' || geno === 'XᵃY';
        const isMale = geno.includes('Y');
        return {
          genotype: geno,
          phenotype: isWhite
            ? isMale ? 'Đực mắt trắng (XᵃY)' : 'Cái mắt trắng (XᵃXᵃ)'
            : isMale ? 'Đực mắt đỏ (XᴬY)' : 'Cái mắt đỏ (XᴬX_)',
          color: isWhite ? '#f8fafc' : '#ef4444',
          seedStyle: isWhite ? 'eye_white' : 'eye_red'
        };
      }
      if (mendelPreset === 'abo_blood') {
        const order = (a: string) => (a === 'Iᴬ' ? 0 : a === 'Iᴮ' ? 1 : 2);
        const geno = [g1, g2].sort((a, b) => order(a) - order(b)).join('');
        if (geno.includes('Iᴬ') && geno.includes('Iᴮ')) {
          return { genotype: geno, phenotype: 'Nhóm máu AB (IᴬIᴮ)', color: '#a855f7', seedStyle: 'blood_ab' };
        }
        if (geno.includes('Iᴬ')) {
          return { genotype: geno, phenotype: 'Nhóm máu A (Iᴬ_)', color: '#ef4444', seedStyle: 'blood_a' };
        }
        if (geno.includes('Iᴮ')) {
          return { genotype: geno, phenotype: 'Nhóm máu B (Iᴮ_)', color: '#3b82f6', seedStyle: 'blood_b' };
        }
        return { genotype: geno, phenotype: 'Nhóm máu O (IᴼIᴼ)', color: '#14b8a6', seedStyle: 'blood_o' };
      }

      // Di-hybrid (di_het or test_cross)
      const geno = combineDi(g1, g2);
      const isYellow = geno.slice(0, 2).includes('A');
      const isSmooth = geno.slice(2, 4).includes('B');
      if (isYellow && isSmooth) {
        return { genotype: geno, phenotype: 'Vàng · Trơn (A_B_)', color: '#eab308', seedStyle: 'yellow_smooth' };
      }
      if (isYellow && !isSmooth) {
        return { genotype: geno, phenotype: 'Vàng · Nhăn (A_bb)', color: '#f59e0b', seedStyle: 'yellow_wrinkled' };
      }
      if (!isYellow && isSmooth) {
        return { genotype: geno, phenotype: 'Xanh · Trơn (aaB_)', color: '#10b981', seedStyle: 'green_smooth' };
      }
      return { genotype: geno, phenotype: 'Xanh · Nhăn (aabb)', color: '#0ea5e9', seedStyle: 'green_wrinkled' };
    };

    let title = '';
    let lawNote = '';
    let p1Label = '';
    let p2Label = '';
    let g1: string[] = [];
    let g2: string[] = [];

    if (mendelPreset === 'mono_het') {
      title = 'Quy luật Phân li Mendel (1 cặp tính trạng)';
      lawNote = 'Mỗi cặp alen phân li đồng đều về các giao tử; F₂ của phép lai dị hợp cho tỉ lệ 3 Trội : 1 Lặn.';
      p1Label = p1Mono;
      p2Label = p2Mono;
      g1 = getMonoGametes(p1Mono);
      g2 = getMonoGametes(p2Mono);
    } else if (mendelPreset === 'incomplete') {
      title = 'Trội không hoàn toàn (Hoa phấn Mirabilis jalapa)';
      lawNote = 'Kiểu gen dị hợp Aa biểu hiện tính trạng trung gian (Hoa Hồng) → Tỉ lệ Kiểu gen = Tỉ lệ Kiểu hình.';
      p1Label = p1Mono;
      p2Label = p2Mono;
      g1 = getMonoGametes(p1Mono);
      g2 = getMonoGametes(p2Mono);
    } else if (mendelPreset === 'sex_linked') {
      title = 'Di truyền Liên kết Giới tính (Morgan · NST X)';
      lawNote = 'Gen nằm trên vùng không tương đồng của NST X di truyền chéo; con đực XY chỉ cần 1 alen lặn đã biểu hiện.';
      p1Label = '♀ XᴬXᵃ (Mắt đỏ dị hợp)';
      p2Label = '♂ XᴬY (Mắt đỏ)';
      g1 = ['Xᴬ', 'Xᵃ'];
      g2 = ['Xᴬ', 'Y'];
    } else if (mendelPreset === 'abo_blood') {
      title = 'Tương tác Đa alen · Hệ nhóm máu ABO';
      lawNote = 'Alen Iᴬ và Iᴮ đồng trội với nhau và cùng trội hoàn toàn so với Iᴼ (Iᴬ = Iᴮ > Iᴼ).';
      p1Label = 'IᴬIᴼ (Nhóm A)';
      p2Label = 'IᴮIᴼ (Nhóm B)';
      g1 = ['Iᴬ', 'Iᴼ'];
      g2 = ['Iᴮ', 'Iᴼ'];
    } else {
      title =
        mendelPreset === 'test_cross'
          ? 'Lai Phân tích 2 cặp tính trạng (Kiểm tra thuần chủng)'
          : 'Quy luật Phân li Độc lập Mendel (2 cặp tính trạng)';
      lawNote =
        mendelPreset === 'test_cross'
          ? 'Lai cơ thể trội với đồng hợp lặn aabb để xác định kiểu gen và tỉ lệ giao tử (1:1:1:1 khi dị hợp 2 cặp).'
          : 'Các cặp alen nằm trên NST khác nhau phân li độc lập, tổ hợp tự do tạo biến dị tổ hợp 9:3:3:1.';
      p1Label = p1Di;
      p2Label = p2Di;
      g1 = getDiGametes(p1Di);
      g2 = getDiGametes(p2Di);
    }

    const matrix: CrossOutcome[][] = g1.map((gam1) => g2.map((gam2) => classify(gam1, gam2)));
    const totalCells = g1.length * g2.length;

    const genoMap = new Map<string, number>();
    const phenoMap = new Map<
      string,
      { count: number; color: string; seedStyle: NonNullable<CrossOutcome['seedStyle']> }
    >();

    for (const row of matrix) {
      for (const cell of row) {
        genoMap.set(cell.genotype, (genoMap.get(cell.genotype) || 0) + 1);
        const prev = phenoMap.get(cell.phenotype);
        if (prev) {
          prev.count += 1;
        } else {
          phenoMap.set(cell.phenotype, {
            count: 1,
            color: cell.color,
            seedStyle: cell.seedStyle || 'yellow_smooth'
          });
        }
      }
    }

    const genotypeSummary = Array.from(genoMap.entries()).map(([genotype, count]) => ({
      genotype,
      count,
      pct: (count / totalCells) * 100
    }));

    const phenotypeSummary = Array.from(phenoMap.entries())
      .map(([phenotype, info]) => ({
        phenotype,
        count: info.count,
        pct: (info.count / totalCells) * 100,
        color: info.color,
        seedStyle: info.seedStyle
      }))
      .sort((a, b) => b.count - a.count);

    return {
      title,
      lawNote,
      p1Label,
      p2Label,
      g1,
      g2,
      matrix,
      genotypeSummary,
      phenotypeSummary,
      totalCells
    };
  }, [mendelPreset, p1Mono, p2Mono, p1Di, p2Di]);

  const runMendelMonteCarlo = () => {
    const counts: Record<string, number> = {};
    for (const p of mendelModel.phenotypeSummary) counts[p.phenotype] = 0;

    const flat = mendelModel.matrix.flat();
    for (let i = 0; i < sampleSize; i++) {
      const pick = flat[Math.floor(Math.random() * flat.length)];
      counts[pick.phenotype] = (counts[pick.phenotype] || 0) + 1;
    }
    setSimCounts(counts);
  };

  const chiSquareResult = useMemo(() => {
    if (!simCounts) return null;
    const rows = mendelModel.phenotypeSummary.map((p) => {
      const obs = simCounts[p.phenotype] || 0;
      const exp = (p.count / mendelModel.totalCells) * sampleSize;
      const diff = obs - exp;
      const chiPart = exp > 0 ? (diff * diff) / exp : 0;
      return { phenotype: p.phenotype, color: p.color, obs, exp, chiPart };
    });
    const chi2 = rows.reduce((s, r) => s + r.chiPart, 0);
    const df = Math.max(1, rows.length - 1);
    const crit = chiSquareCritical05(df);
    return { rows, chi2, df, crit, passes: chi2 <= crit };
  }, [simCounts, mendelModel, sampleSize]);

  // Live animated Mendel Canvas (perfMode-lit pollen stream & 3D-shaded specimens)
  useEffect(() => {
    if (tab !== 'mendel') return;
    const canvas = mendelCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();

    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      const w = (canvas.width = canvas.clientWidth * (perfMode === 'ultra' ? 2 : 1.5));
      const h = (canvas.height = canvas.clientHeight * (perfMode === 'ultra' ? 2 : 1.5));
      const s = w / 640;

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#07131a');
      bg.addColorStop(1, '#091f1c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Ambient botanical light glow scaled by perfMode
      if (perfMode !== 'smooth') {
        const amb = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.45, w * 0.48);
        amb.addColorStop(0, perfMode === 'ultra' ? 'rgba(20, 184, 166, 0.18)' : 'rgba(20, 184, 166, 0.10)');
        amb.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = amb;
        ctx.fillRect(0, 0, w, h);
      }

      // Parental flowers / nodes at top
      const p1x = w * 0.28;
      const p2x = w * 0.72;
      const py = h * 0.24;

      // Cross-pollination arc + animated pollen stream
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
      ctx.lineWidth = 1.6 * s;
      ctx.setLineDash([5 * s, 4 * s]);
      ctx.beginPath();
      ctx.moveTo(p1x, py);
      ctx.quadraticCurveTo(w * 0.5, h * 0.04, p2x, py);
      ctx.stroke();
      ctx.setLineDash([]);

      const pollenCount = perfMode === 'ultra' ? 14 : perfMode === 'balanced' ? 9 : 5;
      for (let i = 0; i < pollenCount; i++) {
        const u = ((t * 0.45 + i / pollenCount) % 1);
        const inv = 1 - u;
        const px = inv * inv * p1x + 2 * inv * u * (w * 0.5) + u * u * p2x;
        const pyPos = inv * inv * py + 2 * inv * u * (h * 0.04) + u * u * py;
        if (perfMode === 'ultra') {
          const glow = ctx.createRadialGradient(px, pyPos, 0, px, pyPos, 9 * s);
          glow.addColorStop(0, 'rgba(250, 204, 21, 0.95)');
          glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, pyPos, 9 * s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(px, pyPos, 2.7 * s, 0, Math.PI * 2);
        ctx.fill();
      }

      // Converging heredity vectors to F1
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath();
      ctx.moveTo(p1x, py + 22 * s);
      ctx.lineTo(w * 0.5, h * 0.47);
      ctx.lineTo(p2x, py + 22 * s);
      ctx.stroke();

      const drawParentBadge = (x: number, y: number, tag: string, label: string, accent: string) => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.8 * s;
        ctx.beginPath();
        ctx.roundRect(x - 84 * s, y - 20 * s, 168 * s, 40 * s, 10 * s);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.font = `700 ${11 * s}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(tag, x, y - 3 * s);
        ctx.fillStyle = '#f8fafc';
        ctx.font = `600 ${11 * s}px sans-serif`;
        ctx.fillText(label.slice(0, 22), x, y + 13 * s);
      };

      drawParentBadge(p1x, py, 'P₁ (♂ Giao tử cho)', mendelModel.p1Label, '#38bdf8');
      drawParentBadge(p2x, py, 'P₂ (♀ Nhận phấn)', mendelModel.p2Label, '#f472b6');

      // Draw F1 Phenotype specimens across bottom row
      const items = mendelModel.phenotypeSummary;
      const span = w * 0.84;
      const startX = w * 0.08 + span / (items.length * 2);
      const stepX = span / items.length;
      const sy = h * 0.72;

      items.forEach((ph, idx) => {
        const cx = startX + idx * stepX;
        const bob = Math.sin(t * 2 + idx * 1.1) * 3 * s;
        const isFocus = selectedPheno === ph.phenotype;
        const rad = (isFocus ? 23 : 19) * s;

        // Branch line from F1 hub
        ctx.strokeStyle = ph.color;
        ctx.globalAlpha = selectedPheno && !isFocus ? 0.25 : 0.65;
        ctx.lineWidth = 1.6 * s;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.47);
        ctx.quadraticCurveTo(cx, h * 0.52, cx, sy - rad - 8 * s);
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (perfMode !== 'smooth') {
          const halo = ctx.createRadialGradient(cx, sy + bob, 2, cx, sy + bob, rad * 1.9);
          halo.addColorStop(0, `${ph.color}55`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(cx, sy + bob, rad * 1.9, 0, Math.PI * 2);
          ctx.fill();
        }

        // Specimen shape
        ctx.save();
        ctx.translate(cx, sy + bob);
        if (ph.seedStyle.startsWith('flower_')) {
          for (let p = 0; p < 5; p++) {
            const ang = (p / 5) * Math.PI * 2 + t * 0.2;
            ctx.fillStyle = ph.color;
            ctx.beginPath();
            ctx.ellipse(Math.cos(ang) * 9 * s, Math.sin(ang) * 9 * s, 9 * s, 6 * s, ang, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 5 * s, 0, Math.PI * 2);
          ctx.fill();
        } else if (ph.seedStyle.includes('wrinkled')) {
          ctx.fillStyle = ph.color;
          ctx.beginPath();
          for (let a = 0; a <= 16; a++) {
            const th = (a / 16) * Math.PI * 2;
            const rr = rad * (0.86 + 0.14 * Math.sin(th * 6));
            const rx = Math.cos(th) * rr;
            const ry = Math.sin(th) * rr;
            if (a === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,0.35)';
          ctx.lineWidth = 1.2 * s;
          ctx.stroke();
        } else {
          const sph = ctx.createRadialGradient(-rad * 0.3, -rad * 0.3, 2, 0, 0, rad);
          sph.addColorStop(0, '#ffffff');
          sph.addColorStop(0.28, ph.color);
          sph.addColorStop(1, '#0f172a');
          ctx.fillStyle = sph;
          ctx.beginPath();
          ctx.arc(0, 0, rad, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        ctx.fillStyle = '#f8fafc';
        ctx.font = `700 ${11.5 * s}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`${ph.count}/${mendelModel.totalCells} (${ph.pct.toFixed(1)}%)`, cx, sy + rad + 18 * s);
        ctx.fillStyle = '#94a3b8';
        ctx.font = `600 ${10 * s}px sans-serif`;
        ctx.fillText(ph.phenotype.split(' (')[0], cx, sy + rad + 33 * s);
      });

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [tab, mendelModel, selectedPheno, perfMode]);

  // 2. DNA -> mRNA -> Protein Codon Sandbox
  const [dnaTemplate, setDnaTemplate] = useState('TACAAAGCGCCTATT');
  const [ribosomePlaying, setRibosomePlaying] = useState(true);
  const codonCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const dnaTranslated = useMemo(() => {
    const clean = dnaTemplate.toUpperCase().replace(/[^ATGC]/g, '').slice(0, 48);
    const compMap: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
    const rnaMap: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };
    const codingDna = clean.split('').map((b) => compMap[b] || 'N').join('');
    const mrna = clean.split('').map((b) => rnaMap[b] || 'N').join('');
    const codons: { code: string; aa: string }[] = [];
    for (let i = 0; i + 2 < mrna.length; i += 3) {
      const c = mrna.slice(i, i + 3);
      codons.push({ code: c, aa: CODON_TABLE[c] || 'aa' });
    }
    const atCount = (clean.match(/[AT]/g) || []).length;
    const gcCount = clean.length - atCount;
    const hBonds = 2 * atCount + 3 * gcCount;
    const gcPct = clean.length > 0 ? (gcCount / clean.length) * 100 : 0;
    return { clean, codingDna, mrna, codons, hBonds, gcPct };
  }, [dnaTemplate]);

  useEffect(() => {
    if (tab !== 'codon') return;
    const canvas = codonCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let phase = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = (now - last) * 0.001;
      last = now;
      if (ribosomePlaying) phase += dt * 0.55;

      const w = (canvas.width = canvas.clientWidth * (perfMode === 'ultra' ? 2 : 1.5));
      const h = (canvas.height = canvas.clientHeight * (perfMode === 'ultra' ? 2 : 1.5));
      const s = w / 640;

      ctx.fillStyle = '#070f1b';
      ctx.fillRect(0, 0, w, h);

      const mrna = dnaTranslated.mrna || 'AUGUUUCGC';
      const codonCount = Math.max(1, dnaTranslated.codons.length);
      const activeIdx = Math.floor(phase) % codonCount;

      // Ribosome large & small subunit centered at x = 220*s
      const ribX = w * 0.36;
      const ribY = h * 0.56;
      if (perfMode !== 'smooth') {
        const g = ctx.createRadialGradient(ribX, ribY, 10, ribX, ribY, 120 * s);
        g.addColorStop(0, perfMode === 'ultra' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.12)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.ellipse(ribX, ribY - 26 * s, 92 * s, 54 * s, 0, Math.PI, Math.PI * 2);
      ctx.ellipse(ribX, ribY + 26 * s, 76 * s, 32 * s, 0, 0, Math.PI);
      ctx.fill();
      ctx.stroke();

      // Sliding mRNA ribbon
      const nuStep = 22 * s;
      const activeCenterBase = activeIdx * 3 + 1;
      const offsetX = ribX - activeCenterBase * nuStep;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(20 * s, ribY);
      ctx.lineTo(w - 20 * s, ribY);
      ctx.stroke();

      const baseColors: Record<string, string> = { A: '#38bdf8', U: '#fb7185', G: '#fbbf24', C: '#34d399' };
      for (let i = 0; i < mrna.length; i++) {
        const bx = offsetX + i * nuStep;
        if (bx < 16 * s || bx > w - 16 * s) continue;
        const b = mrna[i];
        const inActiveCodon = Math.floor(i / 3) === activeIdx;
        ctx.fillStyle = inActiveCodon ? '#ffffff' : (baseColors[b] || '#94a3b8');
        ctx.fillRect(bx - 7 * s, ribY - 12 * s, 14 * s, 20 * s);
        ctx.fillStyle = '#020617';
        ctx.font = `800 ${11 * s}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(b, bx, ribY + 2 * s);
      }

      // Growing Polypeptide chain emerging from top of ribosome
      const chainCount = activeIdx + 1;
      for (let c = 0; c < chainCount; c++) {
        const codon = dnaTranslated.codons[c];
        if (!codon) continue;
        const ax = ribX + c * 42 * s;
        const ay = ribY - 72 * s - Math.sin(c * 0.9 + phase * 1.5) * 10 * s;
        if (c > 0) {
          const px = ribX + (c - 1) * 42 * s;
          const py = ribY - 72 * s - Math.sin((c - 1) * 0.9 + phase * 1.5) * 10 * s;
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 2.5 * s;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ax, ay);
          ctx.stroke();
        }
        ctx.fillStyle = codon.aa === 'STOP' ? '#f43f5e' : '#6366f1';
        ctx.beginPath();
        ctx.arc(ax, ay, 14 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${9.5 * s}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(codon.aa.slice(0, 4), ax, ay + 3 * s);
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = `600 ${11 * s}px monospace`;
      ctx.textAlign = 'left';
      ctx.fillText(`Ribosome dịch mã codon #${activeIdx + 1}: ${dnaTranslated.codons[activeIdx]?.code || '---'} → ${dnaTranslated.codons[activeIdx]?.aa || ''}`, 16 * s, 22 * s);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [tab, dnaTranslated, ribosomePlaying, perfMode]);

  // 3. Hardy-Weinberg & Selfing Sandbox
  const [pFreq, setPFreq] = useState(0.6);
  const [selfingGen, setSelfingGen] = useState(0);
  const hardyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const qFreq = Math.max(0, 1 - pFreq);
  const hwGenotypes = useMemo(() => {
    const baseAa = 2 * pFreq * qFreq;
    const curAa = baseAa * Math.pow(0.5, selfingGen);
    const curAA = pFreq * pFreq + (baseAa - curAa) / 2;
    const curaa = qFreq * qFreq + (baseAa - curAa) / 2;
    const trend = Array.from({ length: 7 }, (_, g) => {
      const aaHet = baseAa * Math.pow(0.5, g);
      return {
        g,
        AA: pFreq * pFreq + (baseAa - aaHet) / 2,
        Aa: aaHet,
        aa: qFreq * qFreq + (baseAa - aaHet) / 2
      };
    });
    return { curAA, curAa, curaa, trend };
  }, [pFreq, qFreq, selfingGen]);

  useEffect(() => {
    if (tab !== 'hardy') return;
    const canvas = hardyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();

    const popDots = Array.from({ length: 60 }, (_, i) => ({
      x: ((i * 73) % 100) / 100,
      y: ((i * 37) % 100) / 100,
      vx: ((i % 7) - 3) * 0.015,
      vy: (((i + 2) % 5) - 2) * 0.015,
      slot: i / 60
    }));

    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      const w = (canvas.width = canvas.clientWidth * (perfMode === 'ultra' ? 2 : 1.5));
      const h = (canvas.height = canvas.clientHeight * (perfMode === 'ultra' ? 2 : 1.5));
      const s = w / 640;

      ctx.fillStyle = '#070d18';
      ctx.fillRect(0, 0, w, h);

      const cutAA = hwGenotypes.curAA;
      const cutAa = cutAA + hwGenotypes.curAa;

      popDots.forEach((d, idx) => {
        const px = ((d.x + t * d.vx + 10) % 1) * (w - 30 * s) + 15 * s;
        const py = ((d.y + t * d.vy + 10) % 1) * (h - 36 * s) + 24 * s;
        const color = d.slot < cutAA ? '#10b981' : d.slot < cutAa ? '#38bdf8' : '#fbbf24';
        if (perfMode === 'ultra' && idx % 2 === 0) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, 12 * s);
          glow.addColorStop(0, `${color}88`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, 12 * s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, 4.6 * s, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `600 ${11 * s}px monospace`;
      ctx.fillText(
        `Quần thể 60 cá thể (F${selfingGen}): AA ${(hwGenotypes.curAA * 100).toFixed(0)}% · Aa ${(hwGenotypes.curAa * 100).toFixed(0)}% · aa ${(hwGenotypes.curaa * 100).toFixed(0)}%`,
        14 * s,
        17 * s
      );

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [tab, hwGenotypes, selfingGen, perfMode]);

  // 4. Enzyme Kinetics Calculator
  const [vMax, setVMax] = useState(100);
  const [kmVal, setKmVal] = useState(15);
  const [subS, setSubS] = useState(30);
  const [inhibRatio, setInhibRatio] = useState(0);
  const enzymeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const enzCompRate = (vMax * subS) / (kmVal * (1 + inhibRatio) + subS);
  const enzNonCompRate = ((vMax / (1 + inhibRatio)) * subS) / (kmVal + subS);
  const enzCurves = useMemo(() => {
    const pts: { s: number; base: number; comp: number; nonComp: number }[] = [];
    for (let s = 0; s <= 120; s += 5) {
      pts.push({
        s,
        base: (vMax * s) / (kmVal + s),
        comp: (vMax * s) / (kmVal * (1 + inhibRatio) + s),
        nonComp: ((vMax / (1 + inhibRatio)) * s) / (kmVal + s)
      });
    }
    return pts;
  }, [vMax, kmVal, inhibRatio]);

  useEffect(() => {
    if (tab !== 'enzyme') return;
    const canvas = enzymeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();

    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      const w = (canvas.width = canvas.clientWidth * (perfMode === 'ultra' ? 2 : 1.5));
      const h = (canvas.height = canvas.clientHeight * (perfMode === 'ultra' ? 2 : 1.5));
      const s = w / 640;

      ctx.fillStyle = '#070f1d';
      ctx.fillRect(0, 0, w, h);

      // Enzymes
      const enzPositions = [
        { x: w * 0.30, y: h * 0.54 },
        { x: w * 0.68, y: h * 0.54 }
      ];
      enzPositions.forEach((ez, idx) => {
        const pulse = Math.sin(t * 3 + idx) * 2 * s;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#14b8a6';
        ctx.lineWidth = 2 * s;
        ctx.beginPath();
        ctx.arc(ez.x, ez.y + pulse, 34 * s, 0.35, Math.PI * 2 - 0.35);
        ctx.lineTo(ez.x, ez.y + pulse);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Substrate molecules moving toward active site; inhibitors proportional to inhibRatio
      const subCount = Math.max(4, Math.round(subS / 6));
      for (let i = 0; i < subCount; i++) {
        const prog = (t * (0.4 + enzCompRate / 220) + i / subCount) % 1;
        const target = enzPositions[i % 2];
        const sx = (i % 2 === 0 ? 40 * s : w - 40 * s) + (target.x - (i % 2 === 0 ? 40 * s : w - 40 * s)) * prog;
        const sy = target.y + Math.sin(t * 4 + i * 2.1) * 32 * s * (1 - prog);
        const isProduct = prog > 0.72;
        ctx.fillStyle = isProduct ? '#34d399' : '#38bdf8';
        if (perfMode === 'ultra' && isProduct) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12 * s);
          glow.addColorStop(0, 'rgba(52, 211, 153, 0.8)');
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, 12 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#34d399';
        }
        ctx.beginPath();
        ctx.arc(sx, sy, 5 * s, 0, Math.PI * 2);
        ctx.fill();
      }

      const inhCount = Math.round(inhibRatio * 4);
      for (let k = 0; k < inhCount; k++) {
        const target = enzPositions[k % 2];
        const ix = target.x + Math.cos(t * 1.8 + k * 2) * 34 * s;
        const iy = target.y + Math.sin(t * 1.8 + k * 2) * 24 * s;
        ctx.fillStyle = '#fb7185';
        ctx.fillRect(ix - 5 * s, iy - 5 * s, 10 * s, 10 * s);
      }

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `600 ${11 * s}px monospace`;
      ctx.fillText(
        `Cơ chất [S] (Lam) → Sản phẩm (Ngọc) · Chất ức chế [I] (Hồng): v = ${enzCompRate.toFixed(1)} μM/s`,
        14 * s,
        18 * s
      );

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [tab, subS, inhibRatio, enzCompRate, perfMode]);

  // 5. Ecosystem Energy Pyramid Sandbox
  const [ePrimary, setEPrimary] = useState(12000);
  const [ecoEff, setEcoEff] = useState(10);
  const ecoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (tab !== 'eco') return;
    const canvas = ecoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const t0 = performance.now();

    const render = (now: number) => {
      const t = (now - t0) * 0.001;
      const w = (canvas.width = canvas.clientWidth * (perfMode === 'ultra' ? 2 : 1.5));
      const h = (canvas.height = canvas.clientHeight * (perfMode === 'ultra' ? 2 : 1.5));
      const s = w / 640;

      ctx.fillStyle = '#071411';
      ctx.fillRect(0, 0, w, h);

      // 4 ascending energy tiers + heat loss sparks
      const tiers = [
        { label: 'Bậc 1 · Thực vật', w: 0.78, color: '#10b981' },
        { label: 'Bậc 2 · Châu chấu', w: 0.58, color: '#14b8a6' },
        { label: 'Bậc 3 · Rắn', w: 0.40, color: '#0ea5e9' },
        { label: 'Bậc 4 · Đại bàng', w: 0.24, color: '#f59e0b' }
      ];

      tiers.forEach((tr, lv) => {
        const bw = w * tr.w;
        const bx = (w - bw) / 2;
        const by = h - 42 * s - lv * 36 * s;
        ctx.fillStyle = `${tr.color}cc`;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, 28 * s, 6 * s);
        ctx.fill();

        const energy = ePrimary * Math.pow(ecoEff / 100, lv);
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${10.5 * s}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`${tr.label}: ${energy.toFixed(1)} kcal`, w / 2, by + 18 * s);

        // Heat dissipation particles escaping to sides
        const sparkCount = perfMode === 'ultra' ? 6 : 3;
        for (let sp = 0; sp < sparkCount; sp++) {
          const u = (t * 0.7 + sp / sparkCount + lv * 0.2) % 1;
          const dir = sp % 2 === 0 ? -1 : 1;
          const sx = w / 2 + dir * (bw * 0.42 + u * 60 * s);
          const sy = by + 14 * s - u * 22 * s;
          ctx.fillStyle = `rgba(251, 146, 60, ${(1 - u) * 0.85})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Vertical ascending biomass particles
      const flowCount = perfMode === 'ultra' ? 14 : 7;
      for (let f = 0; f < flowCount; f++) {
        const u = (t * 0.4 + f / flowCount) % 1;
        const fx = w / 2 + Math.sin(u * 9 + f) * 14 * s;
        const fy = h - 22 * s - u * (h - 46 * s);
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(fx, fy, 3 * s, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [tab, ePrimary, ecoEff, perfMode]);

  const activeHoverCell =
    hoveredCell && mendelModel.matrix[hoveredCell.r]?.[hoveredCell.c]
      ? mendelModel.matrix[hoveredCell.r][hoveredCell.c]
      : null;

  return (
    <div className="bio-zone-frame sci-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-6 relative overflow-hidden">
      <span className="bio-helix-sweep" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Dna className="w-5 h-5 text-teal-600 icon-anim-dna shrink-0" />
            <span>
              {isEn
                ? 'Interactive Biology Sandbox Workbench (5 Labs)'
                : 'Sandbox Sinh Học Tương Tác (5 Phòng Thực Hành)'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sơ đồ lai Mendel &amp; Punnett Chi-bình phương, Dịch mã Ribosome, Hardy–Weinberg, Động học Enzyme và Tháp Năng lượng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'mendel', label: 'Mendel · Sơ đồ lai', icon: Sprout },
              { id: 'codon', label: 'Dịch mã DNA/mRNA', icon: Dna },
              { id: 'hardy', label: 'Hardy–Weinberg', icon: Calculator },
              { id: 'enzyme', label: 'Động học Enzyme', icon: FlaskConical },
              { id: 'eco', label: 'Tháp Sinh thái', icon: Activity }
            ] as const
          ).map((tItem) => {
            const Icon = tItem.icon;
            return (
              <button
                key={tItem.id}
                type="button"
                data-ripple="true"
                onClick={() => setTab(tItem.id)}
                className={`sim-btn-bio inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  tab === tItem.id
                    ? 'bg-teal-600 text-white bio-zone-active'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'mendel' && (
        <div className="space-y-5 text-xs">
          {/* Cross Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'mono_het', label: '1 cặp: Aa × Aa (3:1)' },
                { id: 'di_het', label: '2 cặp: AaBb × AaBb (9:3:3:1)' },
                { id: 'test_cross', label: 'Lai phân tích: AaBb × aabb' },
                { id: 'incomplete', label: 'Trội không hoàn toàn (Hoa phấn)' },
                { id: 'sex_linked', label: 'Liên kết giới tính (XᴬXᵃ × XᴬY)' },
                { id: 'abo_blood', label: 'Nhóm máu ABO (IᴬIᴼ × IᴮIᴼ)' }
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                data-ripple="true"
                onClick={() => selectMendelPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer whitespace-nowrap shrink-0 transition ${
                  mendelPreset === preset.id
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-500'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Parent Allele Selectors for 1-gene & 2-gene */}
          {(mendelPreset === 'mono_het' ||
            mendelPreset === 'incomplete' ||
            mendelPreset === 'di_het' ||
            mendelPreset === 'test_cross') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">Kiểu gen bố P₁ (♂):</span>
                <select
                  value={mendelPreset === 'mono_het' || mendelPreset === 'incomplete' ? p1Mono : p1Di}
                  onChange={(e) => {
                    setSimCounts(null);
                    if (mendelPreset === 'mono_het' || mendelPreset === 'incomplete') setP1Mono(e.target.value);
                    else setP1Di(e.target.value);
                  }}
                  className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                >
                  {(mendelPreset === 'mono_het' || mendelPreset === 'incomplete' ? MONO_GENOTYPES : DI_GENOTYPES).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">Kiểu gen mẹ P₂ (♀):</span>
                <select
                  value={mendelPreset === 'mono_het' || mendelPreset === 'incomplete' ? p2Mono : p2Di}
                  onChange={(e) => {
                    setSimCounts(null);
                    if (mendelPreset === 'mono_het' || mendelPreset === 'incomplete') setP2Mono(e.target.value);
                    else setP2Di(e.target.value);
                  }}
                  className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                >
                  {(mendelPreset === 'mono_het' || mendelPreset === 'incomplete' ? MONO_GENOTYPES : DI_GENOTYPES).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Live animated Mendel Canvas + Sơ đồ lai */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-6 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <canvas ref={mendelCanvasRef} className="w-full h-56 block" />
              </div>

              {/* Standard Sơ đồ lai P -> G -> F */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2.5 font-mono">
                <div className="font-sans font-bold text-teal-700 dark:text-teal-300 text-sm">
                  {mendelModel.title}
                </div>
                <p className="font-sans text-slate-600 dark:text-slate-300 leading-relaxed">
                  {mendelModel.lawNote}
                </p>
                <div className="grid grid-cols-[56px_1fr] gap-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-sky-600">P:</span>
                  <span className="font-bold">{mendelModel.p1Label} × {mendelModel.p2Label}</span>
                  <span className="font-bold text-amber-600">Gₚ:</span>
                  <span>
                    ♂ ({mendelModel.g1.join(', ')}) × ♀ ({mendelModel.g2.join(', ')})
                  </span>
                  <span className="font-bold text-emerald-600">TLKG:</span>
                  <span className="break-words">
                    {mendelModel.genotypeSummary.map((g) => `${g.count} ${g.genotype}`).join(' : ')}
                  </span>
                  <span className="font-bold text-rose-600">TLKH:</span>
                  <span className="break-words">
                    {mendelModel.phenotypeSummary.map((p) => `${p.count} ${p.phenotype.split(' (')[0]}`).join(' : ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Punnett Matrix */}
            <div className="lg:col-span-6 space-y-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    Bảng Punnett ({mendelModel.g1.length}×{mendelModel.g2.length} = {mendelModel.totalCells} tổ hợp)
                  </span>
                  {selectedPheno && (
                    <button
                      type="button"
                      onClick={() => setSelectedPheno(null)}
                      className="text-[11px] font-semibold text-teal-600 hover:underline cursor-pointer"
                    >
                      Bỏ lọc màu
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-center font-mono text-xs tabular-nums">
                    <thead>
                      <tr>
                        <th className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          G♂ \ G♀
                        </th>
                        {mendelModel.g2.map((gam2, ci) => (
                          <th
                            key={ci}
                            className="p-2 border border-slate-200 dark:border-slate-700 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 font-bold"
                          >
                            {gam2}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mendelModel.g1.map((gam1, ri) => (
                        <tr key={ri}>
                          <th className="p-2 border border-slate-200 dark:border-slate-700 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 font-bold">
                            {gam1}
                          </th>
                          {mendelModel.matrix[ri].map((cell, ci) => {
                            const dimmed = selectedPheno !== null && selectedPheno !== cell.phenotype;
                            const isHover = hoveredCell?.r === ri && hoveredCell?.c === ci;
                            return (
                              <td
                                key={ci}
                                onMouseEnter={() => setHoveredCell({ r: ri, c: ci })}
                                onMouseLeave={() => setHoveredCell(null)}
                                onClick={() =>
                                  setSelectedPheno((prev) => (prev === cell.phenotype ? null : cell.phenotype))
                                }
                                style={{
                                  borderBottomWidth: '3px',
                                  borderBottomColor: cell.color
                                }}
                                className={`p-2 border border-slate-200 dark:border-slate-700 cursor-pointer transition select-none ${
                                  isHover
                                    ? 'bg-teal-100 dark:bg-teal-900/50 scale-[1.02]'
                                    : 'bg-white dark:bg-slate-900'
                                } ${dimmed ? 'opacity-30' : 'opacity-100'}`}
                              >
                                <div className="font-bold text-slate-900 dark:text-white">{cell.genotype}</div>
                                <div className="text-[10px] font-sans text-slate-500 dark:text-slate-400 truncate max-w-[90px] mx-auto">
                                  {cell.phenotype.split(' (')[0]}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Phenotype filter legend + hover inspection */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {mendelModel.phenotypeSummary.map((p) => (
                    <button
                      key={p.phenotype}
                      type="button"
                      onClick={() => setSelectedPheno((prev) => (prev === p.phenotype ? null : p.phenotype))}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold cursor-pointer ${
                        selectedPheno === p.phenotype
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                      <span>{p.phenotype.split(' (')[0]}</span>
                      <span className="font-mono tabular-nums text-slate-500">({p.pct.toFixed(1)}%)</span>
                    </button>
                  ))}
                </div>

                {activeHoverCell && (
                  <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 flex items-center justify-between gap-2">
                    <span>
                      Tổ hợp đang chọn: <strong className="font-mono">{activeHoverCell.genotype}</strong> →{' '}
                      <strong>{activeHoverCell.phenotype}</strong>
                    </span>
                    <span className="font-mono tabular-nums">1/{mendelModel.totalCells}</span>
                  </div>
                )}
              </div>

              {/* Monte Carlo & Chi-Square Tester */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Thí nghiệm Gieo hạt ngẫu nhiên (Kiểm định χ²)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[16, 100, 640, 1000, 4000].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSampleSize(n)}
                        className={`px-2 py-1 rounded border font-mono text-[11px] tabular-nums cursor-pointer ${
                          sampleSize === n
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        N={n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={runMendelMonteCarlo}
                    className="sim-btn-bio inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 text-white font-semibold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Gieo {sampleSize} cá thể F₁</span>
                  </button>
                  {simCounts && (
                    <button
                      type="button"
                      onClick={() => setSimCounts(null)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-200 dark:bg-slate-700 font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đặt lại</span>
                    </button>
                  )}
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={() =>
                      triggerDownloadText(
                        'mendel_punnett_chi2.csv',
                        'Phenotype,Theory_Pct,Theory_Ratio' +
                          (chiSquareResult ? ',Observed_N,Expected_N,Chi2_Part' : '') +
                          '\n' +
                          mendelModel.phenotypeSummary
                            .map((p) => {
                              const row = chiSquareResult?.rows.find((r) => r.phenotype === p.phenotype);
                              return (
                                `"${p.phenotype}",${p.pct.toFixed(2)},${p.count}/${mendelModel.totalCells}` +
                                (row ? `,${row.obs},${row.exp.toFixed(1)},${row.chiPart.toFixed(3)}` : '')
                              );
                            })
                            .join('\n')
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Sơ đồ &amp; χ² CSV</span>
                  </button>
                </div>

                {chiSquareResult && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {chiSquareResult.rows.map((r) => (
                        <div
                          key={r.phenotype}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 flex items-center justify-between font-mono tabular-nums"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
                            <span className="font-sans font-semibold truncate">{r.phenotype.split(' (')[0]}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-slate-900 dark:text-white">{r.obs}</span>
                            <span className="text-slate-400"> / {r.exp.toFixed(1)} LT</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`p-2.5 rounded-lg border font-mono tabular-nums flex flex-wrap items-center justify-between gap-2 ${
                        chiSquareResult.passes
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                          : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                      }`}
                    >
                      <span>
                        χ² = <strong>{chiSquareResult.chi2.toFixed(3)}</strong> (df = {chiSquareResult.df}, ngưỡng α=0.05:{' '}
                        {chiSquareResult.crit.toFixed(2)})
                      </span>
                      <span className="font-sans font-bold">
                        {chiSquareResult.passes
                          ? 'Phù hợp giả thuyết Mendel (p > 0.05)'
                          : 'Dao động ngẫu nhiên lớn (thử tăng N)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'codon' && (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 relative">
            <canvas ref={codonCanvasRef} className="w-full h-44 block" />
            <button
              type="button"
              onClick={() => setRibosomePlaying((p) => !p)}
              className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/85 border border-slate-700 text-slate-100 text-xs font-semibold cursor-pointer"
            >
              {ribosomePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{ribosomePlaying ? 'Tạm dừng' : 'Chạy tiếp'}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Nhập trình tự mạch khuôn DNA (3’ → 5’, tối đa 48 nu A, T, G, C):
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={dnaTemplate}
                onChange={(e) => setDnaTemplate(e.target.value)}
                className="flex-1 min-w-[220px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm uppercase"
              />
              <button
                type="button"
                data-ripple="true"
                onClick={() => setDnaTemplate('TACAAAGCGCCTATT')}
                className="sim-btn-bio px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Mẫu chuẩn
              </button>
              <button
                type="button"
                data-ripple="true"
                onClick={() => setDnaTemplate('TACAAAGCGCATATT')}
                className="sim-btn-bio px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold cursor-pointer"
              >
                Đột biến C→A
              </button>
              <button
                type="button"
                data-ripple="true"
                onClick={() =>
                  triggerDownloadText(
                    'trinh_tu_gen_protein.txt',
                    `DNA_3_5: ${dnaTranslated.clean}\nDNA_5_3: ${dnaTranslated.codingDna}\nmRNA:    ${dnaTranslated.mrna}\nGC%:     ${dnaTranslated.gcPct.toFixed(1)}%\nH_Bonds: ${dnaTranslated.hBonds}\nPolypeptide: ${dnaTranslated.codons.map((c) => `${c.code}(${c.aa})`).join(' - ')}\n`,
                    'text/plain;charset=utf-8;'
                  )
                }
                className="sim-btn-bio inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất FASTA/TXT</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs font-mono">
            <div className="bio-card-frame rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="text-slate-500">Mạch bổ sung DNA (5’→3’)</div>
              <div className="font-bold text-sky-600 dark:text-sky-400 mt-1.5 break-all">{dnaTranslated.codingDna}</div>
            </div>
            <div className="bio-card-frame rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="text-slate-500">mRNA phiên mã (5’→3’)</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 break-all">{dnaTranslated.mrna}</div>
            </div>
            <div className="bio-card-frame rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="text-slate-500">Số LK Hydro của đoạn gen</div>
              <div className="font-bold text-amber-600 dark:text-amber-400 mt-1.5 tabular-nums">
                {dnaTranslated.hBonds} LK ({dnaTranslated.clean.length} nu)
              </div>
            </div>
            <div className="bio-card-frame rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="text-slate-500">Tỉ lệ G–C / Độ bền nhiệt</div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-1.5 tabular-nums">
                {dnaTranslated.gcPct.toFixed(1)}% G–C
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {dnaTranslated.codons.map((c, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg border text-xs font-mono ${
                  c.aa === 'STOP'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
                }`}
              >
                <div className="font-bold">{c.code}</div>
                <div className="text-[11px]">{c.aa}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'hardy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4 text-xs">
              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Tần số alen trội p(A)</span>
                  <span className="font-mono tabular-nums text-emerald-600">{pFreq.toFixed(2)} (q = {qFreq.toFixed(2)})</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.95}
                  step={0.05}
                  value={pFreq}
                  onChange={(e) => setPFreq(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </label>
              <label className="block space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Số thế hệ tự thụ phấn liên tiếp (n)</span>
                  <span className="font-mono tabular-nums text-sky-600">{selfingGen} thế hệ</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={selfingGen}
                  onChange={(e) => setSelfingGen(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </label>
              <button
                type="button"
                data-ripple="true"
                onClick={() =>
                  triggerDownloadText(
                    'hardy_weinberg_selfing.csv',
                    'Generation,AA_pct,Aa_pct,aa_pct\n' +
                      hwGenotypes.trend.map((r) => `${r.g},${(r.AA * 100).toFixed(2)},${(r.Aa * 100).toFixed(2)},${(r.aa * 100).toFixed(2)}`).join('\n')
                  )
                }
                className="sim-btn-bio inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-teal-600 text-white font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất bảng phân li CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono tabular-nums">
              <div className="bio-card-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
                <div className="text-slate-500">AA (Đồng hợp trội)</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">{(hwGenotypes.curAA * 100).toFixed(2)}%</div>
              </div>
              <div className="bio-card-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
                <div className="text-slate-500">Aa (Dị hợp)</div>
                <div className="text-xl font-extrabold text-sky-600 mt-1">{(hwGenotypes.curAa * 100).toFixed(2)}%</div>
              </div>
              <div className="bio-card-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
                <div className="text-slate-500">aa (Đồng hợp lặn)</div>
                <div className="text-xl font-extrabold text-amber-600 mt-1">{(hwGenotypes.curaa * 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
              <canvas ref={hardyCanvasRef} className="w-full h-36 block" />
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
              <div className="text-[11px] font-mono text-slate-300 mb-1">
                Diễn biến giảm Dị hợp Aa (Lam) &amp; tăng Đồng hợp AA (Ngọc) / aa (Vàng) qua 6 thế hệ tự thụ
              </div>
              <svg viewBox="0 0 420 120" className="w-full h-28">
                <line x1="28" y1="100" x2="400" y2="100" stroke="#334155" />
                <path
                  d={hwGenotypes.trend.map((t, i) => `${i === 0 ? 'M' : 'L'} ${28 + (t.g / 6) * 365} ${100 - t.AA * 85}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                />
                <path
                  d={hwGenotypes.trend.map((t, i) => `${i === 0 ? 'M' : 'L'} ${28 + (t.g / 6) * 365} ${100 - t.Aa * 85}`).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.2"
                />
                <path
                  d={hwGenotypes.trend.map((t, i) => `${i === 0 ? 'M' : 'L'} ${28 + (t.g / 6) * 365} ${100 - t.aa * 85}`).join(' ')}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.2"
                />
                <circle
                  cx={28 + (selfingGen / 6) * 365}
                  cy={100 - hwGenotypes.curAa * 85}
                  r="4.5"
                  fill="#38bdf8"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {tab === 'enzyme' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
          <div className="space-y-3">
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Vmax chuẩn</span><span className="font-mono tabular-nums">{vMax} μM/s</span></div>
              <input type="range" min={40} max={200} step={10} value={vMax} onChange={(e) => setVMax(Number(e.target.value))} className="w-full accent-emerald-600" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Hằng số Km</span><span className="font-mono tabular-nums">{kmVal} mM</span></div>
              <input type="range" min={5} max={50} step={5} value={kmVal} onChange={(e) => setKmVal(Number(e.target.value))} className="w-full accent-sky-600" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Nồng độ cơ chất [S]</span><span className="font-mono tabular-nums">{subS} mM</span></div>
              <input type="range" min={5} max={120} step={5} value={subS} onChange={(e) => setSubS(Number(e.target.value))} className="w-full accent-indigo-600" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Tỉ lệ chất ức chế [I]/KI</span><span className="font-mono tabular-nums">{inhibRatio.toFixed(1)}</span></div>
              <input type="range" min={0} max={3} step={0.2} value={inhibRatio} onChange={(e) => setInhibRatio(Number(e.target.value))} className="w-full accent-rose-600" />
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bio-card-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
                <div className="text-slate-500">Ức chế Cạnh tranh</div>
                <div className="text-lg font-mono font-extrabold text-sky-600 mt-1 tabular-nums">{enzCompRate.toFixed(2)} μM/s</div>
              </div>
              <div className="bio-card-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
                <div className="text-slate-500">Không cạnh tranh</div>
                <div className="text-lg font-mono font-extrabold text-rose-600 mt-1 tabular-nums">{enzNonCompRate.toFixed(2)} μM/s</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
              <canvas ref={enzymeCanvasRef} className="w-full h-36 block" />
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Đồ thị Michaelis–Menten: Không ức chế (Ngọc) · Cạnh tranh (Lam) · Không cạnh tranh (Hồng)</span>
              </div>
              <svg viewBox="0 0 420 150" className="w-full h-36">
                <line x1="32" y1="132" x2="400" y2="132" stroke="#334155" />
                <line x1="32" y1="10" x2="32" y2="132" stroke="#334155" />
                <path
                  d={enzCurves.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${32 + (pt.s / 120) * 362} ${132 - (pt.base / 210) * 116}`).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                />
                <path
                  d={enzCurves.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${32 + (pt.s / 120) * 362} ${132 - (pt.comp / 210) * 116}`).join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <path
                  d={enzCurves.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${32 + (pt.s / 120) * 362} ${132 - (pt.nonComp / 210) * 116}`).join(' ')}
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="2"
                />
                <circle
                  cx={32 + (subS / 120) * 362}
                  cy={132 - (enzCompRate / 210) * 116}
                  r="4.5"
                  fill="#38bdf8"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {tab === 'eco' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center text-xs">
          <div className="space-y-4">
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Năng lượng Sinh vật Sản xuất</span><span className="font-mono tabular-nums">{ePrimary} kcal</span></div>
              <input type="range" min={5000} max={50000} step={1000} value={ePrimary} onChange={(e) => setEPrimary(Number(e.target.value))} className="w-full accent-emerald-600" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Hiệu suất sinh thái truyền bậc</span><span className="font-mono tabular-nums">{ecoEff}%</span></div>
              <input type="range" min={5} max={20} step={1} value={ecoEff} onChange={(e) => setEcoEff(Number(e.target.value))} className="w-full accent-amber-600" />
            </label>
            <button
              type="button"
              data-ripple="true"
              onClick={() =>
                triggerDownloadText(
                  'thap_sinh_thai.csv',
                  'TrophicLevel,Energy_kcal\n' +
                    [0, 1, 2, 3].map((lv) => `Bac_${lv + 1},${(ePrimary * Math.pow(ecoEff / 100, lv)).toFixed(2)}`).join('\n')
                )
              }
              className="sim-btn-bio inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-teal-600 text-white font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất dữ liệu Tháp CSV</span>
            </button>

            <div className="space-y-2 flex flex-col items-center pt-1">
              {[
                { name: 'SV Tiêu thụ bậc 3 (Đại bàng)', lv: 3, w: '56%' },
                { name: 'SV Tiêu thụ bậc 2 (Rắn)', lv: 2, w: '70%' },
                { name: 'SV Tiêu thụ bậc 1 (Châu chấu)', lv: 1, w: '85%' },
                { name: 'SV Sản xuất (Thực vật)', lv: 0, w: '100%' }
              ].map((b) => {
                const val = ePrimary * Math.pow(ecoEff / 100, b.lv);
                return (
                  <div
                    key={b.lv}
                    style={{ width: b.w }}
                    className="rounded-lg bg-emerald-600/90 text-white px-3 py-2 flex justify-between font-mono text-[11px]"
                  >
                    <span className="font-sans font-semibold truncate">{b.name}</span>
                    <span className="font-bold tabular-nums">{val.toFixed(1)} kcal</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
            <canvas ref={ecoCanvasRef} className="w-full h-56 block" />
          </div>
        </div>
      )}
    </div>
  );
};
