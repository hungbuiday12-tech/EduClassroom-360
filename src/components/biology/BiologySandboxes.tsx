import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Dna,
  Download,
  FlaskConical,
  Microscope,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Sprout,
  ThermometerSun,
  ZoomIn
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

interface MicroscopeOrganelle {
  id: string;
  name: string;
  sizeUm: string;
  role: string;
  color: string;
}

const MICROSCOPE_ORGANELLES: MicroscopeOrganelle[] = [
  {
    id: 'nucleus',
    name: 'Nhân tế bào (Nucleus)',
    sizeUm: '5 – 10 μm',
    role: 'Chứa vật chất di truyền ADN đóng gói thành NST; điều khiển phiên mã mRNA và mọi hoạt động sống của tế bào.',
    color: '#8b5cf6'
  },
  {
    id: 'mitochondria',
    name: 'Ty thể (Mitochondria)',
    sizeUm: '0,5 – 2 μm',
    role: 'Hô hấp tế bào hiếu khí (Chu trình Krebs & Chuỗi truyền electron) tổng hợp ATP cung cấp năng lượng.',
    color: '#f97316'
  },
  {
    id: 'chloroplast',
    name: 'Lục lạp (Chloroplast - Thực vật)',
    sizeUm: '4 – 6 μm',
    role: 'Chứa chất diệp lục trên màng Tilacoit xếp chồng Grana; thực hiện quang hợp chuyển quang năng thành hóa năng.',
    color: '#10b981'
  },
  {
    id: 'ribosome',
    name: 'Ribosome (80S / 70S)',
    sizeUm: '20 – 30 nm',
    role: 'Không có màng bao; nơi đọc bộ ba mã sao mRNA và ghép nối axit amin thành chuỗi polipeptit (dịch mã).',
    color: '#38bdf8'
  },
  {
    id: 'golgi',
    name: 'Bộ máy Golgi & Lưới nội chất',
    sizeUm: '1 – 3 μm',
    role: 'Hoàn thiện, gắn nhóm chức, đóng gói protein/lipid vào túi tiết để vận chuyển trong và ngoài màng sinh chất.',
    color: '#ec4899'
  }
];

interface BiomeFoodWebConfig {
  id: 'rainforest' | 'coral_reef' | 'grassland';
  label: string;
  species: {
    id: string;
    name: string;
    level: 'producer' | 'primary' | 'secondary' | 'apex' | 'decomposer';
    basePop: number;
    climateSens: number;
    color: string;
  }[];
  links: [number, number][];
}

const BIOME_WEBS: BiomeFoodWebConfig[] = [
  {
    id: 'rainforest',
    label: 'Rừng Nhiệt Đới',
    species: [
      { id: 'plants', name: 'Cây gỗ & Dương xỉ (SVSX)', level: 'producer', basePop: 100, climateSens: 0.35, color: '#10b981' },
      { id: 'insects', name: 'Sâu & Côn trùng ăn lá', level: 'primary', basePop: 75, climateSens: 0.25, color: '#14b8a6' },
      { id: 'birds', name: 'Chim sâu & Ếch cây', level: 'secondary', basePop: 48, climateSens: 0.45, color: '#0ea5e9' },
      { id: 'eagle', name: 'Đại bàng & Báo gấm', level: 'apex', basePop: 22, climateSens: 0.4, color: '#f59e0b' },
      { id: 'fungi', name: 'Nấm & Vi khuẩn đất', level: 'decomposer', basePop: 85, climateSens: 0.15, color: '#a855f7' }
    ],
    links: [[0, 1], [1, 2], [2, 3], [0, 4], [3, 4]]
  },
  {
    id: 'coral_reef',
    label: 'Rạn San Hô Đại Dương',
    species: [
      { id: 'algae', name: 'Tảo đơn bào & San hô cộng sinh', level: 'producer', basePop: 100, climateSens: 0.85, color: '#2dd4bf' },
      { id: 'zoo', name: 'Động vật phù du & Tôm nhỏ', level: 'primary', basePop: 80, climateSens: 0.5, color: '#38bdf8' },
      { id: 'parrotfish', name: 'Cá mó & Cá bướm rạn', level: 'secondary', basePop: 52, climateSens: 0.55, color: '#818cf8' },
      { id: 'shark', name: 'Cá mập rạn san hô', level: 'apex', basePop: 18, climateSens: 0.45, color: '#f43f5e' },
      { id: 'detritus', name: 'Hải sâm & Vi khuẩn biển', level: 'decomposer', basePop: 78, climateSens: 0.3, color: '#c084fc' }
    ],
    links: [[0, 1], [1, 2], [2, 3], [0, 4], [3, 4]]
  },
  {
    id: 'grassland',
    label: 'Thảo Nguyên Đồng Cỏ',
    species: [
      { id: 'grass', name: 'Cỏ hòa thảo (SVSX)', level: 'producer', basePop: 100, climateSens: 0.45, color: '#84cc16' },
      { id: 'zebra', name: 'Ngựa vằn & Châu chấu', level: 'primary', basePop: 72, climateSens: 0.3, color: '#eab308' },
      { id: 'hyena', name: 'Linh cẩu & Cáo đồng cỏ', level: 'secondary', basePop: 42, climateSens: 0.3, color: '#f97316' },
      { id: 'lion', name: 'Sư tử đỉnh chuỗi', level: 'apex', basePop: 16, climateSens: 0.35, color: '#ef4444' },
      { id: 'termite', name: 'Mối & Vi sinh vật đất', level: 'decomposer', basePop: 82, climateSens: 0.2, color: '#a855f7' }
    ],
    links: [[0, 1], [1, 2], [2, 3], [0, 4], [3, 4]]
  }
];

export const BiologySandboxes: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const { perfMode } = useBackgroundTheme();
  const [tab, setTab] = useState<'mendel' | 'codon' | 'hardy' | 'enzyme' | 'eco' | 'microscope'>('mendel');

  // 1. Genetics Organism Mode: Pea (Mendel), Drosophila (Morgan linkage), Human Pedigree
  const [geneticsMode, setGeneticsMode] = useState<'pea' | 'drosophila' | 'pedigree'>('pea');
  const [linkageFreq, setLinkageFreq] = useState<number>(18); // f% in Drosophila AB/ab x ab/ab
  const [pedigreeTrait, setPedigreeTrait] = useState<'auto_rec' | 'auto_dom' | 'x_rec'>('auto_rec');
  const [pedigreeQuizChoice, setPedigreeQuizChoice] = useState<string>('');
  const [selectedPedNode, setSelectedPedNode] = useState<string>('III₂');

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

  // 5. Ecosystem Energy Pyramid + Food Web & Climate Change Game
  const [ePrimary, setEPrimary] = useState(12000);
  const [ecoEff, setEcoEff] = useState(10);
  const [biomeId, setBiomeId] = useState<'rainforest' | 'coral_reef' | 'grassland'>('coral_reef');
  const [climateDeltaC, setClimateDeltaC] = useState<number>(1.2);
  const [humanHarvestPct, setHumanHarvestPct] = useState<number>(15);
  const [speciesAdjust, setSpeciesAdjust] = useState<Record<string, number>>({
    producer: 1.0,
    primary: 1.0,
    secondary: 1.0,
    apex: 1.0,
    decomposer: 1.0
  });
  const ecoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeBiome = useMemo(
    () => BIOME_WEBS.find((b) => b.id === biomeId) || BIOME_WEBS[0],
    [biomeId]
  );

  const ecosystemSim = useMemo(() => {
    const prod = activeBiome.species[0];
    const prim = activeBiome.species[1];
    const sec = activeBiome.species[2];
    const apex = activeBiome.species[3];
    const dec = activeBiome.species[4];

    const prodPop = Math.max(
      0,
      Math.round(prod.basePop * speciesAdjust.producer * Math.max(0.08, 1 - (climateDeltaC / 4) * prod.climateSens) * (1 - humanHarvestPct * 0.003))
    );
    const decompFactor = Math.max(0.35, speciesAdjust.decomposer * (1 - (climateDeltaC / 4) * dec.climateSens));
    const primPop = Math.max(
      0,
      Math.round(prim.basePop * speciesAdjust.primary * (prodPop / 100) * Math.max(0.15, 1 - (climateDeltaC / 4) * prim.climateSens) * decompFactor)
    );
    const secPop = Math.max(
      0,
      Math.round(sec.basePop * speciesAdjust.secondary * (primPop / Math.max(1, prim.basePop)) * (1 - humanHarvestPct * 0.005))
    );
    const apexPop = Math.max(
      0,
      Math.round(apex.basePop * speciesAdjust.apex * (secPop / Math.max(1, sec.basePop)) * (1 - humanHarvestPct * 0.008))
    );
    const decPop = Math.max(0, Math.round(dec.basePop * decompFactor));

    const pops = [prodPop, primPop, secPop, apexPop, decPop];
    let warning = 'Hệ sinh thái đang cân bằng động — chuỗi thức ăn vận hành ổn định.';
    let severity: 'ok' | 'warn' | 'critical' = 'ok';
    if (prodPop < 30 || climateDeltaC >= 2.8) {
      severity = 'critical';
      warning =
        biomeId === 'coral_reef'
          ? 'CẢNH BÁO TẨY TRẮNG SAN HÔ: Nhiệt độ tăng làm tảo cộng sinh chết hàng loạt → sụp đổ toàn chuỗi cá rạn!'
          : 'CẢNH BÁO SUY THOÁI SVSX: Sinh vật sản xuất giảm dưới ngưỡng, toàn bộ bậc dinh dưỡng trên suy kiệt!';
    } else if (apexPop < 5) {
      severity = 'warn';
      warning = 'Thiếu vắng Động vật ăn thịt đỉnh chuỗi → SV tiêu thụ bậc 1 có nguy cơ bùng phát mất kiểm soát!';
    } else if (humanHarvestPct >= 50) {
      severity = 'warn';
      warning = 'Khai thác & ô nhiễm vượt ngưỡng tự phục hồi, đa dạng sinh học suy giảm nhanh!';
    }
    const stabilityScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (prodPop > 45 ? 30 : prodPop * 0.6) +
            (primPop > 25 ? 25 : primPop) +
            (secPop > 15 ? 20 : secPop) +
            (apexPop >= 6 ? 15 : apexPop * 2) +
            (decPop > 40 ? 10 : decPop * 0.25)
        )
      )
    );
    return { pops, warning, severity, stabilityScore };
  }, [activeBiome, biomeId, climateDeltaC, humanHarvestPct, speciesAdjust]);

  // 6. Virtual Microscope (5 Zoom Levels) & Mitosis / Meiosis Animator
  const [zoomIdx, setZoomIdx] = useState<number>(3); // 0..4 (1x, 40x, 100x, 400x, 1000x)
  const [cellSpecimen, setCellSpecimen] = useState<'plant' | 'animal'>('plant');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string>('mitochondria');
  const [divMode, setDivMode] = useState<'mitosis' | 'meiosis'>('mitosis');
  const [divPhase, setDivPhase] = useState<number>(2); // 0..4
  const [divPlaying, setDivPlaying] = useState<boolean>(true);
  const divCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedOrganelle = useMemo(
    () => MICROSCOPE_ORGANELLES.find((o) => o.id === selectedOrganelleId) || MICROSCOPE_ORGANELLES[1],
    [selectedOrganelleId]
  );

  // Mitosis / Meiosis live Canvas animator
  useEffect(() => {
    if (tab !== 'microscope') return;
    const canvas = divCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = (now - last) * 0.001;
      last = now;
      if (divPlaying) t += dt;

      const w = (canvas.width = canvas.clientWidth * 1.6);
      const h = (canvas.height = canvas.clientHeight * 1.6);
      const s = w / 520;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = '#060d19';
      ctx.fillRect(0, 0, w, h);

      // Draw cell(s) envelope
      const splitOffset = divPhase === 4 ? 76 * s : divPhase === 3 ? 16 * s : 0;
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2.5 * s;
      if (divPhase === 4) {
        ctx.beginPath();
        ctx.ellipse(cx - splitOffset, cy, 88 * s, 78 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + splitOffset, cy, 88 * s, 78 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(cx, cy, (118 + splitOffset) * s, (92 - splitOffset * 0.25) * s, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Spindle poles & fibers (Kì đầu -> Kì sau)
      if (divPhase >= 1 && divPhase <= 3) {
        const poleLeft = cx - 96 * s;
        const poleRight = cx + 96 * s;
        [poleLeft, poleRight].forEach((px) => {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(px, cy, 5 * s, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
        ctx.lineWidth = 1.2 * s;
        for (let k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.moveTo(poleLeft, cy);
          ctx.quadraticCurveTo(cx, cy + k * 24 * s, poleRight, cy);
          ctx.stroke();
        }
      }

      // Draw 4 chromosomes (2 pairs: cyan & rose) animated by phase
      const chromPairs = [
        { color: '#38bdf8', yOff: -44 * s },
        { color: '#fb7185', yOff: -15 * s },
        { color: '#34d399', yOff: 15 * s },
        { color: '#f59e0b', yOff: 44 * s }
      ];

      chromPairs.forEach((ch, i) => {
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 4 * s;
        ctx.lineCap = 'round';
        if (divPhase === 0) {
          // Interphase chromatin threads inside nucleus
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(t + i * 1.6) * 22 * s, cy + Math.sin(t * 0.8 + i) * 22 * s, 14 * s, 0, Math.PI * 1.4);
          ctx.stroke();
          ctx.globalAlpha = 1;
        } else if (divPhase === 1) {
          // Prophase: X-shaped condensed chromosomes scattered
          const px = cx + Math.sin(t * 0.9 + i * 2) * 32 * s;
          const py = cy + ch.yOff * 0.8;
          ctx.beginPath();
          ctx.moveTo(px - 8 * s, py - 10 * s);
          ctx.lineTo(px + 8 * s, py + 10 * s);
          ctx.moveTo(px + 8 * s, py - 10 * s);
          ctx.lineTo(px - 8 * s, py + 10 * s);
          ctx.stroke();
        } else if (divPhase === 2) {
          // Metaphase: aligned on equatorial plate (x = cx, or two rows in Meiosis I)
          const eqShift = divMode === 'meiosis' ? (i % 2 === 0 ? -12 * s : 12 * s) : 0;
          const wobble = Math.sin(t * 3 + i) * 2 * s;
          const px = cx + eqShift;
          const py = cy + ch.yOff + wobble;
          ctx.beginPath();
          ctx.moveTo(px - 7 * s, py - 10 * s);
          ctx.lineTo(px + 7 * s, py + 10 * s);
          ctx.moveTo(px + 7 * s, py - 10 * s);
          ctx.lineTo(px - 7 * s, py + 10 * s);
          ctx.stroke();
        } else if (divPhase === 3) {
          // Anaphase: pulled toward poles
          const pull = 34 * s + Math.sin(t * 2.2) * 8 * s;
          [cx - pull, cx + pull].forEach((px, side) => {
            const py = cy + ch.yOff * 0.85;
            ctx.beginPath();
            ctx.moveTo(px, py - 9 * s);
            ctx.lineTo(px + (side === 0 ? 7 * s : -7 * s), py);
            ctx.lineTo(px, py + 9 * s);
            ctx.stroke();
          });
        } else {
          // Telophase: inside 2 daughter cells
          [-splitOffset, splitOffset].forEach((dx) => {
            const px = cx + dx + (i % 2 === 0 ? -14 * s : 14 * s);
            const py = cy + (i < 2 ? -14 * s : 14 * s);
            ctx.beginPath();
            ctx.moveTo(px - 6 * s, py - 7 * s);
            ctx.lineTo(px + 6 * s, py + 7 * s);
            ctx.stroke();
          });
        }
      });

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [tab, divMode, divPhase, divPlaying]);

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
                ? 'Interactive Biology Sandbox Workbench (6 Labs)'
                : 'Sandbox Sinh Học Tương Tác (6 Phòng Thực Hành)'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Di truyền Mendel · Ruồi giấm · Phả hệ, Dịch mã, Hardy–Weinberg, Enzyme, Lưới Thức Ăn &amp; Khí hậu, Kính hiển vi ảo (Tế bào &amp; Nguyên/Giảm phân).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
              { id: 'mendel', label: 'Di truyền & Phả hệ', icon: Sprout },
              { id: 'microscope', label: 'Kính hiển vi & Phân bào', icon: Microscope },
              { id: 'codon', label: 'Dịch mã DNA/mRNA', icon: Dna },
              { id: 'hardy', label: 'Hardy–Weinberg', icon: Calculator },
              { id: 'enzyme', label: 'Động học Enzyme', icon: FlaskConical },
              { id: 'eco', label: 'Lưới Thức Ăn & Khí hậu', icon: Activity }
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
          {/* Organism Mode Switcher: Pea vs Drosophila vs Human Pedigree */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'pea', label: 'Đậu Hà Lan (Quy luật Mendel)' },
                  { id: 'drosophila', label: 'Ruồi giấm Drosophila (Hoán vị gen Morgan)' },
                  { id: 'pedigree', label: 'Phả hệ Người & Xác suất Di truyền' }
                ] as const
              ).map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => setGeneticsMode(org.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                    geneticsMode === org.id
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  {org.label}
                </button>
              ))}
            </div>
          </div>

          {geneticsMode === 'drosophila' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-4">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Thí nghiệm Ruồi giấm Morgan (Liên kết &amp; Hoán vị gen)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    P: ♀ Thân xám, cánh dài dị hợp chéo/đều (AB/ab) × ♂ Thân đen, cánh cụt (ab/ab). Ruồi giấm đực không có hoán vị gen!
                  </div>
                </div>
                <label className="block space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>Tần số hoán vị gen ở ruồi cái (f)</span>
                    <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400">{linkageFreq}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={2}
                    value={linkageFreq}
                    onChange={(e) => setLinkageFreq(Number(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                  <div className="text-[11px] text-slate-500">
                    f = 0%: Liên kết hoàn toàn (1:1) · f = 17%–18%: Kết quả kinh điển của Morgan · f = 50%: Phân li độc lập (1:1:1:1)
                  </div>
                </label>

                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 font-mono space-y-1">
                  <div className="text-sky-600 dark:text-sky-400 font-bold">Giao tử ♀ AB/ab tạo ra:</div>
                  <div>• Giao tử liên kết (AB = ab) = (100% − {linkageFreq}%)/2 = <strong>{(50 - linkageFreq / 2).toFixed(1)}%</strong></div>
                  <div>• Giao tử hoán vị (Ab = aB) = {linkageFreq}%/2 = <strong>{(linkageFreq / 2).toFixed(1)}%</strong></div>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 space-y-3 text-slate-100">
                <div className="font-bold text-sm text-teal-400">Phân bố Kiểu hình Đời con F_a (Lai phân tích)</div>
                <div className="space-y-2.5">
                  {[
                    { name: 'Thân xám, cánh dài (AB/ab — Nhóm liên kết)', pct: 50 - linkageFreq / 2, color: '#10b981' },
                    { name: 'Thân đen, cánh cụt (ab/ab — Nhóm liên kết)', pct: 50 - linkageFreq / 2, color: '#0ea5e9' },
                    { name: 'Thân xám, cánh cụt (Ab/ab — Biến dị hoán vị)', pct: linkageFreq / 2, color: '#f59e0b' },
                    { name: 'Thân đen, cánh dài (aB/ab — Biến dị hoán vị)', pct: linkageFreq / 2, color: '#ec4899' }
                  ].map((row) => (
                    <div key={row.name} className="space-y-1">
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="font-sans font-semibold">{row.name}</span>
                        <span className="font-bold tabular-nums">{row.pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${row.pct * 2}%`, backgroundColor: row.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-[11px] text-slate-300">
                  Xác suất lấy ngẫu nhiên 1 cá thể thân xám, cánh dài: <strong className="text-emerald-400 font-mono">{(50 - linkageFreq / 2).toFixed(1)}%</strong> · Khoảng cách giữa 2 gen A và B trên NST = <strong className="text-amber-400 font-mono">{linkageFreq} cM (Morgan)</strong>.
                </div>
              </div>
            </div>
          )}

          {geneticsMode === 'pedigree' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-sm text-teal-400">Phả hệ Gia đình 3 Thế hệ (Bấm từng người)</span>
                  <div className="flex gap-1">
                    {(
                      [
                        { id: 'auto_rec', label: 'Lặn thường' },
                        { id: 'auto_dom', label: 'Trội thường' },
                        { id: 'x_rec', label: 'Lặn NST X' }
                      ] as const
                    ).map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => {
                          setPedigreeTrait(pt.id);
                          setPedigreeQuizChoice('');
                        }}
                        className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer ${
                          pedigreeTrait === pt.id ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive SVG 3-generation Pedigree */}
                <svg viewBox="0 0 420 220" className="w-full h-56 bg-slate-900/80 rounded-lg border border-slate-800">
                  {/* Generation labels */}
                  <text x="12" y="42" fill="#94a3b8" fontSize="11" fontWeight="bold">Thế hệ I</text>
                  <text x="12" y="114" fill="#94a3b8" fontSize="11" fontWeight="bold">Thế hệ II</text>
                  <text x="12" y="188" fill="#94a3b8" fontSize="11" fontWeight="bold">Thế hệ III</text>

                  {/* Connectors */}
                  <line x1="150" y1="38" x2="210" y2="38" stroke="#64748b" strokeWidth="2" />
                  <line x1="180" y1="38" x2="180" y2="74" stroke="#64748b" strokeWidth="2" />
                  <line x1="120" y1="74" x2="240" y2="74" stroke="#64748b" strokeWidth="2" />
                  <line x1="120" y1="74" x2="120" y2="96" stroke="#64748b" strokeWidth="2" />
                  <line x1="180" y1="74" x2="180" y2="96" stroke="#64748b" strokeWidth="2" />
                  <line x1="240" y1="74" x2="240" y2="96" stroke="#64748b" strokeWidth="2" />

                  {/* II3 x II4 -> III1, III2 */}
                  <line x1="254" y1="110" x2="316" y2="110" stroke="#64748b" strokeWidth="2" />
                  <line x1="285" y1="110" x2="285" y2="148" stroke="#64748b" strokeWidth="2" />
                  <line x1="255" y1="148" x2="315" y2="148" stroke="#64748b" strokeWidth="2" />
                  <line x1="255" y1="148" x2="255" y2="170" stroke="#64748b" strokeWidth="2" />
                  <line x1="315" y1="148" x2="315" y2="170" stroke="#64748b" strokeWidth="2" />

                  {[
                    { id: 'I₁', x: 136, y: 38, sex: 'M', affected: pedigreeTrait === 'auto_dom' },
                    { id: 'I₂', x: 224, y: 38, sex: 'F', affected: false },
                    { id: 'II₁', x: 120, y: 110, sex: 'F', affected: pedigreeTrait === 'auto_rec' },
                    { id: 'II₂', x: 180, y: 110, sex: 'M', affected: pedigreeTrait === 'x_rec' },
                    { id: 'II₃', x: 240, y: 110, sex: 'F', affected: pedigreeTrait === 'auto_dom' },
                    { id: 'II₄', x: 330, y: 110, sex: 'M', affected: false },
                    { id: 'III₁', x: 255, y: 184, sex: 'M', affected: false },
                    { id: 'III₂', x: 315, y: 184, sex: 'F', affected: false, unknown: true }
                  ].map((n) => {
                    const isSel = selectedPedNode === n.id;
                    const fill = n.unknown ? '#1e293b' : n.affected ? '#ef4444' : '#0f172a';
                    const stroke = isSel ? '#38bdf8' : n.affected ? '#fca5a5' : '#94a3b8';
                    return (
                      <g key={n.id} onClick={() => setSelectedPedNode(n.id)} style={{ cursor: 'pointer' }}>
                        {n.sex === 'M' ? (
                          <rect x={n.x - 14} y={n.y - 14} width="28" height="28" rx="3" fill={fill} stroke={stroke} strokeWidth={isSel ? 3 : 2} />
                        ) : (
                          <circle cx={n.x} cy={n.y} r="14" fill={fill} stroke={stroke} strokeWidth={isSel ? 3 : 2} />
                        )}
                        <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
                          {n.unknown ? '?' : n.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="text-[11px] text-slate-400">
                  Quy ước: Hình vuông = Nam · Hình tròn = Nữ · Tô đỏ = Biểu hiện bệnh · Đang xem: <strong className="text-sky-400">{selectedPedNode}</strong>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Bài toán Xác suất Phả hệ ({pedigreeTrait === 'auto_rec' ? 'Gen lặn NST thường' : pedigreeTrait === 'auto_dom' ? 'Gen trội NST thường' : 'Gen lặn trên NST X'})
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 space-y-1.5">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">
                    {pedigreeTrait === 'auto_rec'
                      ? 'Biết bố mẹ I₁ × I₂ bình thường sinh con gái II₁ bị bệnh (aa). Người nữ II₃ bình thường lấy chồng II₄ dị hợp (Aa). Xác suất đứa con gái III₂ KHÔNG mang alen bệnh (AA) là bao nhiêu?'
                      : pedigreeTrait === 'auto_dom'
                      ? 'Bệnh do gen trội A trên NST thường quy định. I₁ (Aa) × I₂ (aa) sinh II₃ bị bệnh (Aa) lấy chồng bình thường II₄ (aa). Xác suất sinh con III₂ KHÔNG bị bệnh là bao nhiêu?'
                      : 'Bệnh mù màu do gen lặn a trên NST X. I₁ (XᴬY) × I₂ (XᴬXᵃ) sinh con trai II₂ bị bệnh (XᵃY). Người con gái II₃ bình thường lấy chồng II₄ (XᴬY). Xác suất III₂ mang gen bệnh (XᴬXᵃ) là bao nhiêu?'}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(pedigreeTrait === 'auto_rec'
                    ? ['1/6', '1/3', '1/2', '2/3']
                    : pedigreeTrait === 'auto_dom'
                    ? ['1/4', '1/2', '3/4', '1/3']
                    : ['1/8', '1/4', '1/2', '3/4']
                  ).map((ans) => {
                    const correct = pedigreeTrait === 'auto_rec' ? '1/3' : pedigreeTrait === 'auto_dom' ? '1/2' : '1/4';
                    const picked = pedigreeQuizChoice === ans;
                    return (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => setPedigreeQuizChoice(ans)}
                        className={`py-2 rounded-lg border font-mono font-bold cursor-pointer ${
                          picked
                            ? ans === correct
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {ans}
                      </button>
                    );
                  })}
                </div>
                {pedigreeQuizChoice && (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800 p-3 text-emerald-900 dark:text-emerald-200">
                    {pedigreeTrait === 'auto_rec'
                      ? 'Lời giải: II₃ bình thường có dạng (1/3 AA : 2/3 Aa) ⇒ giao tử (2/3 A : 1/3 a). II₄ (Aa) cho (1/2 A : 1/2 a). Xác suất con III₂ bình thường = 1 − (1/3 × 1/2) = 5/6; trong đó P(AA) = (2/3 × 1/2) = 1/3.'
                      : pedigreeTrait === 'auto_dom'
                      ? 'Lời giải: II₃ bị bệnh có mẹ I₂ bình thường (aa) nên II₃ chắc chắn là Aa. Phép lai Aa × aa cho 1/2 Aa (bệnh) : 1/2 aa (bình thường).'
                      : 'Lời giải: II₃ có dạng (1/2 XᴬXᴬ : 1/2 XᴬXᵃ) ⇒ cho giao tử (3/4 Xᴬ : 1/4 Xᵃ). Bố II₄ (XᴬY) truyền Xᴬ cho con gái III₂ nên P(XᴬXᵃ) = 1/4 = 25%.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {geneticsMode === 'pea' && (
            <>
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
            </>
          )}
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
        <div className="space-y-5 text-xs">
          {/* Biome Selector + Stability Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {BIOME_WEBS.map((bm) => (
                <button
                  key={bm.id}
                  type="button"
                  onClick={() => {
                    setBiomeId(bm.id);
                    setSpeciesAdjust({ producer: 1, primary: 1, secondary: 1, apex: 1, decomposer: 1 });
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
                    biomeId === bm.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {bm.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-500">Chỉ số cân bằng hệ sinh thái:</span>
              <span
                className={`px-2.5 py-1 rounded-md font-extrabold ${
                  ecosystemSim.stabilityScore >= 70
                    ? 'bg-emerald-600 text-white'
                    : ecosystemSim.stabilityScore >= 40
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {ecosystemSim.stabilityScore}/100
              </span>
            </div>
          </div>

          <div
            className={`rounded-xl border p-3 flex items-center gap-2.5 font-semibold ${
              ecosystemSim.severity === 'critical'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
                : ecosystemSim.severity === 'warn'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            {ecosystemSim.severity === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{ecosystemSim.warning}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Species Add/Remove & Climate Sliders */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 space-y-2.5">
                <div className="font-bold text-slate-800 dark:text-slate-100">Thêm / Bớt quần thể sinh vật trong lưới thức ăn:</div>
                {activeBiome.species.map((sp, idx) => {
                  const pop = ecosystemSim.pops[idx];
                  const mult = speciesAdjust[sp.level];
                  return (
                    <div key={sp.id} className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                      <div className="min-w-0">
                        <div className="font-bold truncate flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sp.color }} />
                          <span>{sp.name}</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                          Mật độ hiện tại: <strong className="text-slate-900 dark:text-white">{pop}</strong> cá thể (Hệ số ×{mult.toFixed(1)})
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setSpeciesAdjust((p) => ({ ...p, [sp.level]: Math.max(0.2, Math.round((p[sp.level] - 0.2) * 10) / 10) }))
                          }
                          className="w-7 h-7 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold cursor-pointer"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSpeciesAdjust((p) => ({ ...p, [sp.level]: Math.min(2.0, Math.round((p[sp.level] + 0.2) * 10) / 10) }))
                          }
                          className="w-7 h-7 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 space-y-3">
                <label className="block space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="inline-flex items-center gap-1">
                      <ThermometerSun className="w-3.5 h-3.5 text-amber-500" />
                      Biến đổi khí hậu (Tăng nhiệt độ ΔT)
                    </span>
                    <span className="font-mono tabular-nums text-rose-600">+{climateDeltaC.toFixed(1)} °C</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    step={0.2}
                    value={climateDeltaC}
                    onChange={(e) => setClimateDeltaC(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </label>

                <label className="block space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Đánh bắt / Ô nhiễm / Phá rừng</span>
                    <span className="font-mono tabular-nums text-amber-600">{humanHarvestPct}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={5}
                    value={humanHarvestPct}
                    onChange={(e) => setHumanHarvestPct(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <label className="block space-y-1">
                    <div className="flex justify-between font-semibold"><span>NL Sản xuất</span><span className="font-mono">{ePrimary} kcal</span></div>
                    <input type="range" min={5000} max={50000} step={1000} value={ePrimary} onChange={(e) => setEPrimary(Number(e.target.value))} className="w-full accent-emerald-600" />
                  </label>
                  <label className="block space-y-1">
                    <div className="flex justify-between font-semibold"><span>Hiệu suất bậc</span><span className="font-mono">{ecoEff}%</span></div>
                    <input type="range" min={5} max={20} step={1} value={ecoEff} onChange={(e) => setEcoEff(Number(e.target.value))} className="w-full accent-teal-600" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Interactive Food Web SVG + Trophic Energy Pyramid Canvas */}
            <div className="lg:col-span-6 space-y-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
                <div className="text-[11px] font-mono text-teal-400 mb-1">Sơ đồ Lưới Thức Ăn Động ({activeBiome.label})</div>
                <svg viewBox="0 0 420 200" className="w-full h-48">
                  {[
                    { x: 70, y: 155 },
                    { x: 165, y: 112 },
                    { x: 255, y: 74 },
                    { x: 350, y: 38 },
                    { x: 320, y: 158 }
                  ].map((pos, idx) => {
                    const sp = activeBiome.species[idx];
                    const pop = ecosystemSim.pops[idx];
                    const nextPos = idx < 3 ? [{ x: 165, y: 112 }, { x: 255, y: 74 }, { x: 350, y: 38 }][idx] : { x: 320, y: 158 };
                    return (
                      <React.Fragment key={sp.id}>
                        {idx < 4 && (
                          <line
                            x1={pos.x}
                            y1={pos.y}
                            x2={nextPos.x}
                            y2={nextPos.y}
                            stroke={pop < 12 ? '#ef4444' : '#34d399'}
                            strokeWidth="2"
                            strokeDasharray={pop < 12 ? '4 4' : undefined}
                          />
                        )}
                        <circle cx={pos.x} cy={pos.y} r={Math.max(12, Math.min(26, 10 + pop * 0.16))} fill={`${sp.color}33`} stroke={sp.color} strokeWidth="2.2" />
                        <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                          {pop}
                        </text>
                        <text x={pos.x} y={pos.y + 28} textAnchor="middle" fill="#94a3b8" fontSize="9.5">
                          {sp.name.split(' (')[0]}
                        </text>
                      </React.Fragment>
                    );
                  })}
                </svg>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
                <canvas ref={ecoCanvasRef} className="w-full h-48 block" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: VIRTUAL MICROSCOPE (5 ZOOM LEVELS) & MITOSIS/MEIOSIS */}
      {tab === 'microscope' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-teal-600" />
                  <span>Kính Hiển Vi Ảo 5 Cấp Độ Tổ Chức Sống</span>
                </div>
                <div className="flex gap-1">
                  {(['plant', 'animal'] as const).map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => setCellSpecimen(sp)}
                      className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                        cellSpecimen === sp ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sp === 'plant' ? 'Thực vật' : 'Động vật'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {[
                  { idx: 0, label: '1× Cơ thể' },
                  { idx: 1, label: '40× Cơ quan' },
                  { idx: 2, label: '100× Mô' },
                  { idx: 3, label: '400× Tế bào' },
                  { idx: 4, label: '1000× Bào quan' }
                ].map((z) => (
                  <button
                    key={z.idx}
                    type="button"
                    onClick={() => setZoomIdx(z.idx)}
                    className={`py-1.5 px-1 rounded-md border font-bold text-[11px] cursor-pointer ${
                      zoomIdx === z.idx
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>

              {/* Microscope Circular Eyepiece View */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col items-center">
                <svg viewBox="0 0 360 220" className="w-full h-52">
                  <defs>
                    <clipPath id="lens-clip">
                      <circle cx="180" cy="110" r="96" />
                    </clipPath>
                  </defs>
                  <circle cx="180" cy="110" r="100" fill="#020617" stroke="#14b8a6" strokeWidth="3" />
                  <g clipPath="url(#lens-clip)">
                    {zoomIdx === 0 && (
                      <g>
                        <ellipse cx="180" cy="128" rx="46" ry="52" fill={cellSpecimen === 'plant' ? '#15803d' : '#be123c'} opacity="0.7" />
                        <text x="180" y="114" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">
                          {cellSpecimen === 'plant' ? 'Cây xanh hoàn chỉnh' : 'Cơ thể Động vật'}
                        </text>
                        <text x="180" y="134" textAnchor="middle" fill="#94a3b8" fontSize="10">
                          Hệ cơ quan phối hợp thống nhất
                        </text>
                      </g>
                    )}
                    {zoomIdx === 1 && (
                      <g>
                        <path d="M120 155 Q180 40 240 155 Q180 180 120 155 Z" fill={cellSpecimen === 'plant' ? '#16a34a' : '#e11d48'} opacity="0.75" />
                        <line x1="180" y1="70" x2="180" y2="165" stroke="#bbf7d0" strokeWidth="2.5" />
                        <text x="180" y="192" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">
                          {cellSpecimen === 'plant' ? 'Cơ quan: Lá (Hệ gân dẫn)' : 'Cơ quan: Tim co bóp 4 ngăn'}
                        </text>
                      </g>
                    )}
                    {zoomIdx === 2 && (
                      <g>
                        {[0, 1, 2, 3, 4, 5].map((k) => (
                          <rect
                            key={k}
                            x={105 + (k % 3) * 52}
                            y={65 + Math.floor(k / 3) * 44}
                            width="46"
                            height="38"
                            rx={cellSpecimen === 'plant' ? 4 : 16}
                            fill={cellSpecimen === 'plant' ? '#166534' : '#9f1239'}
                            stroke="#5eead4"
                            strokeWidth="1.5"
                          />
                        ))}
                        <text x="180" y="192" textAnchor="middle" fill="#e2e8f0" fontSize="10.5" fontWeight="bold">
                          {cellSpecimen === 'plant' ? 'Mô giậu lục lạp xếp sát nhau' : 'Mô cơ vân / biểu mô'}
                        </text>
                      </g>
                    )}
                    {zoomIdx >= 3 && (
                      <g>
                        <rect
                          x="104"
                          y="46"
                          width="152"
                          height="128"
                          rx={cellSpecimen === 'plant' ? 14 : 62}
                          fill="#0f172a"
                          stroke={cellSpecimen === 'plant' ? '#22c55e' : '#38bdf8'}
                          strokeWidth={cellSpecimen === 'plant' ? 5 : 2.5}
                        />
                        {/* Clickable Organelles */}
                        <circle
                          cx="166"
                          cy="102"
                          r={zoomIdx === 4 ? 28 : 22}
                          fill="#8b5cf655"
                          stroke="#8b5cf6"
                          strokeWidth="2.5"
                          onClick={() => setSelectedOrganelleId('nucleus')}
                          style={{ cursor: 'pointer' }}
                        />
                        <text x="166" y="106" textAnchor="middle" fill="#ede9fe" fontSize="9.5" fontWeight="bold">Nhân</text>

                        <ellipse
                          cx="222"
                          cy="92"
                          rx="16"
                          ry="9"
                          fill="#f9731655"
                          stroke="#f97316"
                          strokeWidth="2"
                          onClick={() => setSelectedOrganelleId('mitochondria')}
                          style={{ cursor: 'pointer' }}
                        />
                        <text x="222" y="95" textAnchor="middle" fill="#ffedd5" fontSize="8">Ty thể</text>

                        {cellSpecimen === 'plant' && (
                          <g onClick={() => setSelectedOrganelleId('chloroplast')} style={{ cursor: 'pointer' }}>
                            <ellipse cx="144" cy="144" rx="18" ry="10" fill="#10b98166" stroke="#10b981" strokeWidth="2" />
                            <text x="144" y="147" textAnchor="middle" fill="#d1fae5" fontSize="8">Lục lạp</text>
                          </g>
                        )}

                        <circle
                          cx="210"
                          cy="138"
                          r="6"
                          fill="#38bdf8"
                          onClick={() => setSelectedOrganelleId('ribosome')}
                          style={{ cursor: 'pointer' }}
                        />
                        <path
                          d="M126 76 Q142 66 158 76 Q142 86 126 76"
                          fill="#ec489966"
                          stroke="#ec4899"
                          strokeWidth="2"
                          onClick={() => setSelectedOrganelleId('golgi')}
                          style={{ cursor: 'pointer' }}
                        />
                      </g>
                    )}
                  </g>
                </svg>

                <div className="w-full grid grid-cols-5 gap-1 mt-2">
                  {MICROSCOPE_ORGANELLES.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        setZoomIdx(4);
                        setSelectedOrganelleId(org.id);
                      }}
                      className={`py-1 px-1.5 rounded text-[10px] font-bold truncate cursor-pointer ${
                        selectedOrganelle.id === org.id ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      {org.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 space-y-1">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span style={{ color: selectedOrganelle.color }}>{selectedOrganelle.name}</span>
                  <span className="font-mono text-slate-500">Kích thước: {selectedOrganelle.sizeUm}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedOrganelle.role}</p>
              </div>
            </div>
          </div>

          {/* Right: Mitosis / Meiosis Phase Animator */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Hoạt ảnh Quá trình Phân bào</div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDivMode('mitosis')}
                    className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                      divMode === 'mitosis' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Nguyên phân (2n → 2n)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDivMode('meiosis')}
                    className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                      divMode === 'meiosis' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Giảm phân (2n → n)
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 relative">
                <canvas ref={divCanvasRef} className="w-full h-56 block" />
                <button
                  type="button"
                  onClick={() => setDivPlaying((p) => !p)}
                  className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-white font-semibold cursor-pointer"
                >
                  {divPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{divPlaying ? 'Tạm dừng' : 'Chạy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {['Kì trung gian', 'Kì đầu', 'Kì giữa', 'Kì sau', 'Kì cuối'].map((ph, idx) => (
                  <button
                    key={ph}
                    type="button"
                    onClick={() => setDivPhase(idx)}
                    className={`py-1.5 px-1 rounded-md border font-bold text-[11px] cursor-pointer ${
                      divPhase === idx ? 'bg-teal-600 text-white border-teal-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {ph}
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 space-y-1">
                <div className="font-bold text-teal-600 dark:text-teal-400">
                  {divMode === 'mitosis'
                    ? ['Pha S nhân đôi ADN → 2n NST kép', 'Màng nhân tiêu biến, NST kép co xoắn', 'NST kép xếp 1 hàng trên mặt phẳng xích đạo', 'Mỗi NST kép tách thành 2 NST đơn phân li về 2 cực', 'Tạo 2 tế bào con giống hệt mẹ (2n)'][divPhase]
                    : ['Kì trung gian: ADN nhân đôi tạo 2n NST kép', 'Kì đầu I: Các NST kép tương đồng tiếp hợp & trao đổi chéo!', 'Kì giữa I: NST kép tương đồng xếp thành 2 hàng ở xích đạo', 'Kì sau I: Mỗi NST kép trong cặp tương đồng tiến về 1 cực (giảm một nửa)', 'Kết thúc Giảm phân I & II tạo 4 giao tử đơn bội (n)'][divPhase]}
                </div>
                <div className="font-mono text-[11px] text-slate-500">
                  Diễn biến bộ NST (với 2n = 4):{' '}
                  {divMode === 'mitosis'
                    ? ['4 NST kép (4C)', '4 NST kép', '4 NST kép (xếp 1 hàng)', '8 NST đơn (4 + 4)', '2 tế bào × 4 NST đơn'][divPhase]
                    : ['4 NST kép (4C)', '2 cặp tương đồng (Trao đổi chéo)', '4 NST kép (xếp 2 hàng)', '2 NST kép mỗi cực', '4 giao tử × 2 NST đơn (n = 2)'][divPhase]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
