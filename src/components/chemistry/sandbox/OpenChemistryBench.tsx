import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Beaker,
  Droplets,
  Flame,
  FlaskConical,
  Plus,
  RotateCcw,
  Thermometer,
  Trash2,
  Wind,
  Zap,
} from 'lucide-react';
import { useBackgroundTheme } from '../../../context/BackgroundContext';

type ChemicalState = 'solid' | 'liquid' | 'gas';
type BenchTool = 'tube' | 'beaker' | 'electrolysis';

interface ChemicalItem {
  id: string;
  formula: string;
  nameVi: string;
  nameEn: string;
  state: ChemicalState;
  colorHex: string;
  phDelta: number;
}

const CHEMICAL_STOCK: ChemicalItem[] = [
  // Solids (Rắn)
  { id: 'Na', formula: 'Na', nameVi: 'Natri kim loại', nameEn: 'Sodium metal', state: 'solid', colorHex: '#cbd5e1', phDelta: 3.4 },
  { id: 'Mg', formula: 'Mg', nameVi: 'Magie dải', nameEn: 'Magnesium ribbon', state: 'solid', colorHex: '#e2e8f0', phDelta: 0.2 },
  { id: 'Zn', formula: 'Zn', nameVi: 'Kẽm viên', nameEn: 'Zinc granules', state: 'solid', colorHex: '#94a3b8', phDelta: 0 },
  { id: 'Fe', formula: 'Fe', nameVi: 'Sắt bột/đinh', nameEn: 'Iron', state: 'solid', colorHex: '#64748b', phDelta: 0 },
  { id: 'Cu', formula: 'Cu', nameVi: 'Đồng phoi', nameEn: 'Copper turnings', state: 'solid', colorHex: '#ea580c', phDelta: 0 },
  { id: 'CaCO3', formula: 'CaCO₃', nameVi: 'Đá vôi (rắn)', nameEn: 'Calcium carbonate', state: 'solid', colorHex: '#f8fafc', phDelta: 0.6 },
  { id: 'CuO', formula: 'CuO', nameVi: 'Đồng(II) oxit (đen)', nameEn: 'Copper(II) oxide', state: 'solid', colorHex: '#1e293b', phDelta: 0.2 },
  { id: 'S', formula: 'S', nameVi: 'Lưu huỳnh (vàng)', nameEn: 'Sulfur powder', state: 'solid', colorHex: '#eab308', phDelta: 0 },
  { id: 'KMnO4', formula: 'KMnO₄', nameVi: 'Thuốc tím (tinh thể)', nameEn: 'Potassium permanganate', state: 'solid', colorHex: '#7e22ce', phDelta: 0 },

  // Liquids / Aqueous (Lỏng & Dung dịch)
  { id: 'H2O', formula: 'H₂O', nameVi: 'Nước cất', nameEn: 'Distilled water', state: 'liquid', colorHex: '#bae6fd', phDelta: 0 },
  { id: 'HCl', formula: 'HCl', nameVi: 'Axit clohiđric', nameEn: 'Hydrochloric acid', state: 'liquid', colorHex: '#e0f2fe', phDelta: -3.2 },
  { id: 'H2SO4', formula: 'H₂SO₄', nameVi: 'Axit sunfuric', nameEn: 'Sulfuric acid', state: 'liquid', colorHex: '#e0f2fe', phDelta: -3.6 },
  { id: 'HNO3', formula: 'HNO₃', nameVi: 'Axit nitric', nameEn: 'Nitric acid', state: 'liquid', colorHex: '#fef9c3', phDelta: -3.3 },
  { id: 'NaOH', formula: 'NaOH', nameVi: 'Natri hiđroxit', nameEn: 'Sodium hydroxide', state: 'liquid', colorHex: '#e0f2fe', phDelta: 3.6 },
  { id: 'Ba(OH)2', formula: 'Ba(OH)₂', nameVi: 'Bari hiđroxit', nameEn: 'Barium hydroxide', state: 'liquid', colorHex: '#e0f2fe', phDelta: 3.3 },
  { id: 'NH3', formula: 'NH₃ (dd)', nameVi: 'Dung dịch Amoniac', nameEn: 'Aqueous ammonia', state: 'liquid', colorHex: '#e0f2fe', phDelta: 2.2 },
  { id: 'CuSO4', formula: 'CuSO₄', nameVi: 'Đồng(II) sunfat', nameEn: 'Copper(II) sulfate', state: 'liquid', colorHex: '#0ea5e9', phDelta: -0.4 },
  { id: 'FeCl3', formula: 'FeCl₃', nameVi: 'Sắt(III) clorua', nameEn: 'Iron(III) chloride', state: 'liquid', colorHex: '#d97706', phDelta: -0.9 },
  { id: 'AgNO3', formula: 'AgNO₃', nameVi: 'Bạc nitrat', nameEn: 'Silver nitrate', state: 'liquid', colorHex: '#f1f5f9', phDelta: 0 },
  { id: 'BaCl2', formula: 'BaCl₂', nameVi: 'Bari clorua', nameEn: 'Barium chloride', state: 'liquid', colorHex: '#f1f5f9', phDelta: 0 },
  { id: 'Na2CO3', formula: 'Na₂CO₃', nameVi: 'Natri cacbonat', nameEn: 'Sodium carbonate', state: 'liquid', colorHex: '#e0f2fe', phDelta: 2.1 },
  { id: 'NaCl', formula: 'NaCl', nameVi: 'Muối ăn (dd)', nameEn: 'Sodium chloride', state: 'liquid', colorHex: '#e0f2fe', phDelta: 0 },
  { id: 'KSCN', formula: 'KSCN', nameVi: 'Kali thioxianat', nameEn: 'Potassium thiocyanate', state: 'liquid', colorHex: '#f1f5f9', phDelta: 0 },
  { id: 'KI', formula: 'KI', nameVi: 'Kali iotua', nameEn: 'Potassium iodide', state: 'liquid', colorHex: '#f1f5f9', phDelta: 0 },
  { id: 'Phenol', formula: 'Phenolphtalein', nameVi: 'Phenolphtalein', nameEn: 'Phenolphthalein', state: 'liquid', colorHex: '#f472b6', phDelta: 0 },

  // Gases (Khí)
  { id: 'O2', formula: 'O₂ (k)', nameVi: 'Khí Oxi', nameEn: 'Oxygen gas', state: 'gas', colorHex: '#38bdf8', phDelta: 0 },
  { id: 'H2', formula: 'H₂ (k)', nameVi: 'Khí Hiđro', nameEn: 'Hydrogen gas', state: 'gas', colorHex: '#e2e8f0', phDelta: 0 },
  { id: 'Cl2', formula: 'Cl₂ (k)', nameVi: 'Khí Clo (vàng lục)', nameEn: 'Chlorine gas', state: 'gas', colorHex: '#a3e635', phDelta: -1.4 },
  { id: 'CO2', formula: 'CO₂ (k)', nameVi: 'Khí Cacbonic', nameEn: 'Carbon dioxide', state: 'gas', colorHex: '#cbd5e1', phDelta: -1.2 },
];

interface ReactionEvaluation {
  liquidColor: string;
  liquidAlpha: number;
  precipitateColor: string | null;
  precipitateLabel: string | null;
  gasColor: string | null;
  gasLabel: string | null;
  ph: number;
  litmusColor: string;
  litmusStatus: string;
  enthalpyKJ: number;
  effectiveTempC: number;
  hazard: { title: string; detail: string } | null;
  equations: string[];
  observations: string[];
}

function evaluateOpenBench(
  added: string[],
  tempC: number,
  pressureAtm: number,
  concM: number,
  burnerOn: boolean,
  electrolysisOn: boolean,
  tool: BenchTool
): ReactionEvaluation {
  const has = (id: string) => added.includes(id);
  const effectiveBaseTemp = burnerOn ? Math.max(tempC, 125) : tempC;
  const hasAcid = has('HCl') || has('H2SO4') || has('HNO3');
  const hasBase = has('NaOH') || has('Ba(OH)2') || has('NH3') || (has('Na') && has('H2O'));
  const hasLiquid = added.some((id) => CHEMICAL_STOCK.find((c) => c.id === id)?.state === 'liquid');

  let ph = 7.0;
  let bias = 0;
  added.forEach((id) => {
    const item = CHEMICAL_STOCK.find((c) => c.id === id);
    if (item) bias += item.phDelta;
  });
  const concFactor = 0.7 + (concM / 6) * 0.6;
  ph = Math.max(0.4, Math.min(13.7, 7.0 + bias * concFactor));
  if (added.length === 0) ph = 7.0;

  let liquidColor = hasLiquid ? '#bae6fd' : '#334155';
  let liquidAlpha = hasLiquid ? 0.36 : 0;
  let precipitateColor: string | null = null;
  let precipitateLabel: string | null = null;
  let gasColor: string | null = null;
  let gasLabel: string | null = null;
  let enthalpyKJ = 0;
  let hazard: { title: string; detail: string } | null = null;
  const equations: string[] = [];
  const observations: string[] = [];

  if (has('CuSO4')) {
    liquidColor = '#0ea5e9';
    liquidAlpha = 0.65;
  }
  if (has('FeCl3')) {
    liquidColor = '#d97706';
    liquidAlpha = 0.68;
  }
  if (has('KMnO4') && hasLiquid) {
    liquidColor = '#9333ea';
    liquidAlpha = 0.72;
  }

  // Hazard checks
  if (has('Na') && hasAcid) {
    hazard = {
      title: 'Cảnh báo phản ứng nổ: Natri (Na) tiếp xúc trực tiếp Axit mạnh!',
      detail: 'Tốc độ giải phóng H₂ và nhiệt lượng cực lớn làm sôi bùng và bắn axit.',
    };
    enthalpyKJ -= 368;
    gasColor = '#fef08a';
    gasLabel = 'H₂↑ (tỏa nhiệt mạnh)';
    equations.push('2Na + 2HCl → 2NaCl + H₂↑ (ΔH ≪ 0)');
    observations.push('Kim loại Na bốc cháy nổ nhỏ trên mặt axit, tỏa nhiệt cực mạnh.');
  }
  if (has('H2') && has('O2') && (burnerOn || effectiveBaseTemp >= 180)) {
    hazard = {
      title: 'Hỗn hợp nổ 2H₂ + O₂ gặp nguồn nhiệt!',
      detail: 'Áp suất tăng đột ngột trong bình kín khi kích hoạt ngọn lửa.',
    };
    enthalpyKJ -= 572;
    equations.push('2H₂ + O₂ → 2H₂O (t°)');
    observations.push('Phản ứng nổ kèm tia chớp hơi nước ngưng tụ trên thành bình.');
  }

  // Specific reactions
  if (has('Na') && has('H2O') && !hasAcid) {
    enthalpyKJ -= 184;
    gasColor = '#e2e8f0';
    gasLabel = 'H₂↑';
    equations.push('2Na + 2H₂O → 2NaOH + H₂↑');
    observations.push('Mẩu Na nóng chảy thành giọt tròn, chạy trên mặt nước và sủi bọt khí H₂.');
  }

  if ((has('Mg') || has('Zn') || has('Fe')) && (has('HCl') || has('H2SO4'))) {
    const metal = has('Mg') ? 'Mg' : has('Zn') ? 'Zn' : 'Fe';
    enthalpyKJ -= 150;
    gasColor = '#e2e8f0';
    gasLabel = 'H₂↑';
    equations.push(`${metal} + 2HCl → ${metal}Cl₂ + H₂↑`);
    if (metal === 'Fe') {
      liquidColor = '#86efac';
      liquidAlpha = 0.52;
    }
    observations.push(`Kim loại ${metal} tan dần, bọt khí H₂ không màu sủi mạnh (tăng theo nhiệt độ & nồng độ).`);
  }

  if (has('Cu') && has('HNO3')) {
    enthalpyKJ -= 132;
    liquidColor = '#0284c7';
    liquidAlpha = 0.68;
    gasColor = '#ea580c';
    gasLabel = 'NO₂↑ (nâu đỏ)';
    equations.push('Cu + 4HNO₃(đặc) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O');
    observations.push('Dung dịch chuyển xanh lam Cu²⁺, thoát ra khí NO₂ màu nâu đỏ đặc trưng.');
  }

  if ((has('CaCO3') || has('Na2CO3')) && hasAcid) {
    gasColor = '#cbd5e1';
    gasLabel = 'CO₂↑';
    equations.push('CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O');
    observations.push('Sủi bọt khí CO₂ mạnh mẽ; áp suất bình kín tăng nhanh nếu không xả khí.');
  }

  if (has('CuO') && (has('HCl') || has('H2SO4')) && effectiveBaseTemp >= 45) {
    liquidColor = '#0ea5e9';
    liquidAlpha = 0.65;
    equations.push('CuO (đen) + 2HCl → CuCl₂ (xanh lam) + H₂O');
    observations.push('Bột CuO đen tan ra khi đun nhẹ, dung dịch chuyển xanh lam sáng.');
  }

  if (has('CuSO4') && (has('NaOH') || has('Ba(OH)2'))) {
    precipitateColor = '#0284c7';
    precipitateLabel = has('Ba(OH)2') ? 'Cu(OH)₂↓ xanh + BaSO₄↓ trắng' : 'Cu(OH)₂↓ xanh lam';
    equations.push('CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄');
    observations.push('Xuất hiện kết tủa xanh lam lơ lửng rồi lắng xuống đáy bình.');
  }

  if (has('CuSO4') && has('NH3')) {
    liquidColor = '#1d4ed8';
    liquidAlpha = 0.85;
    precipitateColor = null;
    equations.push('Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂ (phức xanh thẫm)');
    observations.push('Kết tủa xanh tan trong NH₃ dư tạo phức đồng-amoniac màu xanh thẫm.');
  }

  if (has('FeCl3') && (has('NaOH') || has('NH3'))) {
    precipitateColor = '#9a3412';
    precipitateLabel = 'Fe(OH)₃↓ nâu đỏ';
    equations.push('FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl');
    observations.push('Kết tủa keo màu nâu đỏ Fe(OH)₃ tách ra rõ rệt.');
  }

  if (has('FeCl3') && has('KSCN')) {
    liquidColor = '#991b1b';
    liquidAlpha = 0.88;
    equations.push('Fe³⁺ + 3SCN⁻ ⇌ [Fe(SCN)₃] (đỏ máu)');
    observations.push('Dung dịch lập tức chuyển sang màu đỏ máu rất nhạy đặc trưng cho ion Fe³⁺.');
  }

  if (has('AgNO3') && (has('NaCl') || has('HCl') || has('BaCl2'))) {
    precipitateColor = '#f8fafc';
    precipitateLabel = 'AgCl↓ trắng';
    equations.push('Ag⁺ + Cl⁻ → AgCl↓ (trắng)');
    observations.push('Kết tủa trắng bông AgCl xuất hiện ngay lập tức.');
  } else if (has('AgNO3') && has('KI')) {
    precipitateColor = '#eab308';
    precipitateLabel = 'AgI↓ vàng đậm';
    equations.push('Ag⁺ + I⁻ → AgI↓ (vàng đậm)');
    observations.push('Xuất hiện kết tủa vàng đậm AgI không tan trong axit.');
  }

  if ((has('BaCl2') || has('Ba(OH)2')) && (has('H2SO4') || has('CuSO4'))) {
    precipitateColor = '#f8fafc';
    precipitateLabel = 'BaSO₄↓ trắng bền';
    equations.push('Ba²⁺ + SO₄²⁻ → BaSO₄↓ (trắng)');
    observations.push('Kết tủa trắng mịn BaSO₄ không tan kể cả khi thêm axit dư.');
  }

  if (has('Fe') && has('CuSO4')) {
    precipitateColor = '#c2410c';
    precipitateLabel = 'Cu↓ đỏ gạch bám trên Fe';
    liquidColor = '#86efac';
    liquidAlpha = 0.52;
    equations.push('Fe + CuSO₄ → FeSO₄ + Cu↓');
    observations.push('Lớp đồng đỏ bám lên thanh sắt, màu xanh CuSO₄ nhạt dần chuyển xanh lục nhạt Fe²⁺.');
  }

  if (has('S') && has('O2') && (burnerOn || effectiveBaseTemp >= 180)) {
    enthalpyKJ -= 297;
    gasColor = '#e2e8f0';
    gasLabel = 'SO₂↑ (mùi hắc)';
    equations.push('S + O₂ → SO₂↑ (ngọn lửa xanh tím)');
    observations.push('Lưu huỳnh cháy với ngọn lửa màu xanh lam nhạt tạo khí SO₂ mùi hắc.');
  }

  if (hasAcid && hasBase && equations.length === 0) {
    enthalpyKJ -= 57.3 * concFactor;
    equations.push('H⁺ + OH⁻ → H₂O (ΔH = -57,3 kJ/mol)');
    observations.push('Phản ứng trung hòa axit–bazơ xảy ra nhanh và tỏa nhiệt ra môi trường.');
  }

  if (electrolysisOn && tool === 'electrolysis' && hasLiquid) {
    if (has('NaCl')) {
      gasColor = '#bef264';
      gasLabel = 'H₂↑ (Catot) + Cl₂↑ (Anot)';
      ph = Math.min(13.4, ph + 3.8);
      equations.push('2NaCl + 2H₂O —(đpdd, mn)→ 2NaOH + H₂↑ + Cl₂↑');
      observations.push('Bọt khí H₂ thoát ra ở cực âm, khí Cl₂ vàng lục thoát ra ở cực dương; dung dịch kiềm hóa.');
    } else if (has('CuSO4')) {
      precipitateColor = '#c2410c';
      precipitateLabel = 'Cu↓ bám ở Catot';
      gasColor = '#bae6fd';
      gasLabel = 'O₂↑ (Anot)';
      ph = Math.max(1.2, ph - 2.6);
      equations.push('2CuSO₄ + 2H₂O —(đpdd)→ 2Cu↓ + 2H₂SO₄ + O₂↑');
      observations.push('Đồng kim loại đỏ phủ lên cực âm (-), khí O₂ sủi ở cực dương (+).');
    } else if (has('H2O')) {
      gasColor = '#e2e8f0';
      gasLabel = '2H₂↑ (Catot) + O₂↑ (Anot)';
      equations.push('2H₂O —(điện phân)→ 2H₂↑ + O₂↑');
      observations.push('Điện phân nước tạo khí H₂ (tỉ lệ thể tích 2:1 so với O₂).');
    }
  }

  // Phenolphthalein indicator tint
  if (has('Phenol') && ph >= 8.3) {
    liquidColor = ph >= 10 ? '#db2777' : '#f472b6';
    liquidAlpha = Math.max(liquidAlpha, 0.72);
    observations.push('Chỉ thị Phenolphtalein chuyển màu hồng cánh sen trong môi trường kiềm (pH ≥ 8,3).');
  }

  // Litmus strip readout
  let litmusColor = '#8b5cf6';
  let litmusStatus = 'Tím trung tính';
  if (has('Cl2') && hasLiquid) {
    litmusColor = '#e2e8f0';
    litmusStatus = 'Hóa đỏ rồi mất màu (HClO tẩy màu)';
  } else if (ph < 6.4) {
    litmusColor = '#ef4444';
    litmusStatus = 'Hóa ĐỎ (môi trường Axit)';
  } else if (ph > 7.6) {
    litmusColor = '#2563eb';
    litmusStatus = 'Hóa XANH (môi trường Bazơ)';
  }

  const effectiveTempC = Math.round(effectiveBaseTemp + Math.min(95, Math.abs(enthalpyKJ) * 0.14) * (pressureAtm >= 1 ? 1 : 0.9));

  if (added.length > 0 && equations.length === 0) {
    observations.push(
      `Hỗn hợp vật lí gồm ${added.join(' + ')} tại ${effectiveTempC}°C, ${pressureAtm.toFixed(1)} atm — chưa ghi nhận phản ứng hóa học đặc trưng. Thử bật Đèn cồn hoặc thêm chất khác!`
    );
  }

  return {
    liquidColor,
    liquidAlpha,
    precipitateColor,
    precipitateLabel,
    gasColor,
    gasLabel,
    ph,
    litmusColor,
    litmusStatus,
    enthalpyKJ,
    effectiveTempC,
    hazard,
    equations,
    observations,
  };
}

export const OpenChemistryBench: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const { perfMode } = useBackgroundTheme();
  const [stateFilter, setStateFilter] = useState<'all' | ChemicalState>('all');
  const [vesselChemicals, setVesselChemicals] = useState<string[]>(['CuSO4', 'NaOH']);
  const [tool, setTool] = useState<BenchTool>('beaker');
  const [tempC, setTempC] = useState<number>(25);
  const [pressureAtm, setPressureAtm] = useState<number>(1.0);
  const [concM, setConcM] = useState<number>(1.5);
  const [burnerOn, setBurnerOn] = useState<boolean>(false);
  const [litmusDipped, setLitmusDipped] = useState<boolean>(true);
  const [electrolysisOn, setElectrolysisOn] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const visibleStock = useMemo(
    () => CHEMICAL_STOCK.filter((c) => stateFilter === 'all' || c.state === stateFilter),
    [stateFilter]
  );

  const outcome = useMemo(
    () => evaluateOpenBench(vesselChemicals, tempC, pressureAtm, concM, burnerOn, electrolysisOn, tool),
    [vesselChemicals, tempC, pressureAtm, concM, burnerOn, electrolysisOn, tool]
  );

  const addChemical = (id: string) => {
    setVesselChemicals((prev) => (prev.includes(id) ? prev : [...prev, id].slice(-6)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const render = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const tw = Math.round(rect.width * dpr);
        const th = Math.round(rect.height * dpr);
        if (canvas.width !== tw || canvas.height !== th) {
          canvas.width = tw;
          canvas.height = th;
        }
        ctx.save();
        ctx.scale(dpr, dpr);
        const w = rect.width;
        const h = rect.height;
        const t = now * 0.001;

        ctx.fillStyle = '#070c18';
        ctx.fillRect(0, 0, w, h);

        // Lab bench surface
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, h - 48, w, 48);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h - 48);
        ctx.lineTo(w, h - 48);
        ctx.stroke();

        // Ambient glow behind vessel
        if (perfMode !== 'smooth') {
          const glowCol = outcome.hazard ? '#ef4444' : outcome.liquidAlpha > 0 ? outcome.liquidColor : '#38bdf8';
          const g = ctx.createRadialGradient(w * 0.5, h * 0.52, 12, w * 0.5, h * 0.52, 165);
          g.addColorStop(0, `${glowCol}30`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        // Bunsen burner beneath vessel if active
        const vx = w * 0.5;
        const vBottom = burnerOn ? h - 108 : h - 54;
        if (burnerOn) {
          ctx.fillStyle = '#475569';
          ctx.fillRect(vx - 28, h - 62, 56, 14);
          ctx.fillRect(vx - 9, h - 98, 18, 36);
          const flick = Math.sin(t * 14) * 4;
          const fg = ctx.createRadialGradient(vx, h - 108, 3, vx, h - 112, 34);
          fg.addColorStop(0, '#ffffff');
          fg.addColorStop(0.45, '#38bdf8');
          fg.addColorStop(0.85, '#f97316');
          fg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.moveTo(vx - 15, h - 98);
          ctx.quadraticCurveTo(vx - 14, h - 128, vx + flick, h - 144);
          ctx.quadraticCurveTo(vx + 14, h - 128, vx + 15, h - 98);
          ctx.closePath();
          ctx.fill();
        }

        // Vessel geometry
        const vW = tool === 'tube' ? 76 : tool === 'electrolysis' ? 190 : 146;
        const vH = tool === 'tube' ? 210 : 178;
        const vLeft = vx - vW / 2;
        const vTop = vBottom - vH;

        // Pressure lid if pressure > 1.2 atm
        if (pressureAtm > 1.15) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(vLeft - 6, vTop - 12, vW + 12, 12);
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`P = ${pressureAtm.toFixed(1)} atm`, vLeft + 8, vTop - 18);
        }

        // Liquid fill
        const liqH = outcome.liquidAlpha > 0 ? Math.min(vH - 28, 72 + vesselChemicals.length * 16) : 0;
        const liqTop = vBottom - liqH;
        if (liqH > 0) {
          ctx.save();
          ctx.globalAlpha = outcome.liquidAlpha;
          ctx.fillStyle = outcome.liquidColor;
          ctx.beginPath();
          ctx.moveTo(vLeft + 3, vBottom - 3);
          ctx.lineTo(vLeft + 3, liqTop);
          for (let x = 0; x <= vW - 6; x += 8) {
            const wave = Math.sin(t * 3 + x * 0.08) * (burnerOn || outcome.gasColor ? 2.8 : 1.1);
            ctx.lineTo(vLeft + 3 + x, liqTop + wave);
          }
          ctx.lineTo(vLeft + vW - 3, vBottom - 3);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Solid pieces / precipitate
        const solids = vesselChemicals.filter((id) => CHEMICAL_STOCK.find((c) => c.id === id)?.state === 'solid');
        solids.forEach((sid, idx) => {
          const item = CHEMICAL_STOCK.find((c) => c.id === sid);
          if (!item) return;
          const skitter = sid === 'Na' && vesselChemicals.includes('H2O') ? Math.sin(t * 16) * 28 : 0;
          const sy = sid === 'Na' && vesselChemicals.includes('H2O') && liqH > 0 ? liqTop + 3 : vBottom - 12;
          ctx.fillStyle = item.colorHex;
          ctx.beginPath();
          ctx.arc(vx - 20 + idx * 18 + skitter, sy, 6.5, 0, Math.PI * 2);
          ctx.fill();
        });

        if (outcome.precipitateColor) {
          const countP = perfMode === 'ultra' ? 38 : 22;
          for (let i = 0; i < countP; i++) {
            const px = vLeft + 12 + ((i * 29) % (vW - 24));
            const py = vBottom - 10 - ((i * 13 + Math.sin(t * 2 + i) * 3) % 24);
            ctx.fillStyle = outcome.precipitateColor;
            ctx.beginPath();
            ctx.arc(px, py, 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Bubbles if gas or boiling
        if (outcome.gasColor || (burnerOn && liqH > 0)) {
          const bCol = outcome.gasColor || '#e2e8f0';
          const rate = outcome.gasColor ? 1.4 : 0.7;
          for (let i = 0; i < 18; i++) {
            const bx = vLeft + 14 + ((i * 23) % (vW - 28));
            const span = Math.max(30, liqH + 20);
            const by = vBottom - 8 - ((t * 58 * rate + i * 19) % span);
            ctx.fillStyle = bCol;
            ctx.globalAlpha = 0.78;
            ctx.beginPath();
            ctx.arc(bx, by, 2.5 + (i % 3), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }

        // Electrolysis electrodes
        if (tool === 'electrolysis') {
          ctx.fillStyle = '#334155';
          ctx.fillRect(vx - 46, vTop - 16, 12, vH - 12);
          ctx.fillRect(vx + 34, vTop - 16, 12, vH - 12);
          ctx.fillStyle = electrolysisOn ? '#22d3ee' : '#94a3b8';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('(-)', vx - 48, vTop - 22);
          ctx.fillText('(+)', vx + 32, vTop - 22);
        }

        // Litmus strip
        if (litmusDipped) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(vLeft + vW - 24, vTop - 12, 10, 44);
          ctx.fillStyle = outcome.litmusColor;
          ctx.fillRect(vLeft + vW - 24, vTop + 32, 10, 48);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(vLeft + vW - 24, vTop - 12, 10, 92);
        }

        // Vessel Glass Outline
        ctx.strokeStyle = dragOver ? '#10b981' : '#e2e8f0';
        ctx.lineWidth = dragOver ? 3.5 : 2.5;
        ctx.beginPath();
        ctx.moveTo(vLeft, vTop);
        ctx.lineTo(vLeft, vBottom);
        ctx.lineTo(vLeft + vW, vBottom);
        ctx.lineTo(vLeft + vW, vTop);
        ctx.stroke();

        // Top HUD readouts
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`T = ${outcome.effectiveTempC}°C  |  pH = ${outcome.ph.toFixed(2)}  |  C = ${concM.toFixed(1)} M`, 16, 24);
        if (outcome.gasLabel) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`Khí: ${outcome.gasLabel}`, 16, 44);
        }
        if (outcome.precipitateLabel) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(`Kết tủa: ${outcome.precipitateLabel}`, 16, outcome.gasLabel ? 62 : 44);
        }

        ctx.restore();
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [vesselChemicals, tool, pressureAtm, concM, burnerOn, litmusDipped, electrolysisOn, dragOver, outcome, perfMode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
      {/* Left: Chemical Stock (Solid, Liquid, Gas) + Tools */}
      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/45 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'Open Reagent Stock (Click or Drag)' : 'Kho Hóa Chất Tự Do (Nhấn / Kéo thả)'}</span>
            </span>
          </div>

          <div className="flex gap-1 bg-slate-200/70 dark:bg-slate-900 p-1 rounded-lg">
            {(
              [
                { id: 'all', label: 'Tất cả' },
                { id: 'solid', label: 'Rắn' },
                { id: 'liquid', label: 'Lỏng / dd' },
                { id: 'gas', label: 'Khí' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStateFilter(f.id)}
                className={`flex-1 py-1 rounded-md font-bold cursor-pointer whitespace-nowrap ${
                  stateFilter === f.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[250px] overflow-y-auto pr-1">
            {visibleStock.map((chem) => {
              const active = vesselChemicals.includes(chem.id);
              return (
                <button
                  key={chem.id}
                  type="button"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', chem.id)}
                  onClick={() => addChemical(chem.id)}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-extrabold text-[11px]">{chem.formula}</span>
                    <span className="w-2.5 h-2.5 rounded-sm border border-slate-400/50 shrink-0" style={{ backgroundColor: chem.colorHex }} />
                  </div>
                  <div className={`text-[10px] truncate mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {isEn ? chem.nameEn : chem.nameVi}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Apparatus & Conditions */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/45 p-4 space-y-3">
          <div className="font-bold text-slate-800 dark:text-slate-100">Dụng cụ &amp; Thông số môi trường</div>

          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'tube', label: 'Ống nghiệm' },
                { id: 'beaker', label: 'Cốc thủy tinh' },
                { id: 'electrolysis', label: 'Máy điện phân' },
              ] as const
            ).map((tItem) => (
              <button
                key={tItem.id}
                type="button"
                onClick={() => {
                  setTool(tItem.id);
                  if (tItem.id === 'electrolysis') setElectrolysisOn(true);
                }}
                className={`py-1.5 px-2 rounded-lg border font-bold cursor-pointer whitespace-nowrap ${
                  tool === tItem.id
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                {tItem.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setBurnerOn((b) => !b)}
              className={`py-1.5 px-2 rounded-lg border font-bold inline-flex items-center justify-center gap-1 cursor-pointer ${
                burnerOn
                  ? 'bg-orange-600 text-white border-orange-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Đèn cồn</span>
            </button>
            <button
              type="button"
              onClick={() => setLitmusDipped((l) => !l)}
              className={`py-1.5 px-2 rounded-lg border font-bold inline-flex items-center justify-center gap-1 cursor-pointer ${
                litmusDipped
                  ? 'bg-violet-600 text-white border-violet-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Giấy quỳ</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTool('electrolysis');
                setElectrolysisOn((e) => !e);
              }}
              className={`py-1.5 px-2 rounded-lg border font-bold inline-flex items-center justify-center gap-1 cursor-pointer ${
                electrolysisOn && tool === 'electrolysis'
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Điện áp DC</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-orange-500" /> Nhiệt độ môi trường</span>
                <span className="font-mono tabular-nums text-orange-600 dark:text-orange-400">{tempC} °C</span>
              </div>
              <input type="range" min={0} max={350} step={5} value={tempC} onChange={(e) => setTempC(Number(e.target.value))} className="w-full accent-orange-500" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-sky-500" /> Áp suất hệ kín</span>
                <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400">{pressureAtm.toFixed(1)} atm</span>
              </div>
              <input type="range" min={0.5} max={8.0} step={0.5} value={pressureAtm} onChange={(e) => setPressureAtm(Number(e.target.value))} className="w-full accent-sky-500" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="inline-flex items-center gap-1"><Beaker className="w-3.5 h-3.5 text-emerald-500" /> Nồng độ dung dịch</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{concM.toFixed(1)} M</span>
              </div>
              <input type="range" min={0.2} max={6.0} step={0.2} value={concM} onChange={(e) => setConcM(Number(e.target.value))} className="w-full accent-emerald-500" />
            </label>
          </div>
        </div>
      </div>

      {/* Right: Interactive Vessel Canvas + Readouts */}
      <div className="lg:col-span-7 space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const id = e.dataTransfer.getData('text/plain');
            if (id) addChemical(id);
          }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden relative"
        >
          <canvas ref={canvasRef} className="w-full h-[320px] sm:h-[360px] block" />
          <div className="px-3.5 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Trong bình ({vesselChemicals.length}/6):</span>
              {vesselChemicals.length === 0 ? (
                <span className="text-slate-500 italic">Trống — chọn hoặc kéo thả chất vào bình</span>
              ) : (
                vesselChemicals.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setVesselChemicals((prev) => prev.filter((x) => x !== id))}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-100 font-mono font-bold hover:border-rose-400 cursor-pointer"
                  >
                    <span>{CHEMICAL_STOCK.find((c) => c.id === id)?.formula || id}</span>
                    <span className="text-rose-400">×</span>
                  </button>
                ))
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setVesselChemicals(['CuSO4', 'NaOH']);
                  setBurnerOn(false);
                  setElectrolysisOn(false);
                  setTempC(25);
                  setPressureAtm(1.0);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mẫu</span>
              </button>
              <button
                type="button"
                onClick={() => setVesselChemicals([])}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/70 border border-rose-500/40 text-rose-200 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Rửa bình</span>
              </button>
            </div>
          </div>
        </div>

        {outcome.hazard && (
          <div className="rounded-xl border border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/50 p-3.5 text-rose-900 dark:text-rose-100 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold">{outcome.hazard.title}</div>
              <div className="mt-0.5 text-rose-700 dark:text-rose-200">{outcome.hazard.detail}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono tabular-nums">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Chỉ số pH</div>
            <div className="text-lg font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">{outcome.ph.toFixed(2)}</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Nhiệt độ thực tế</div>
            <div className="text-lg font-extrabold text-orange-600 dark:text-orange-400 mt-0.5">{outcome.effectiveTempC} °C</div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Biến thiên ΔH</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {outcome.enthalpyKJ === 0 ? '0 kJ' : `${outcome.enthalpyKJ.toFixed(0)} kJ`}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
            <div className="text-slate-500 font-sans">Giấy quỳ tím</div>
            <div className="font-sans font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm shrink-0 border border-slate-400" style={{ backgroundColor: outcome.litmusColor }} />
              <span className="truncate text-[11px]">{outcome.litmusStatus}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/45 p-4 space-y-2.5">
          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Hiện tượng &amp; Phương trình hóa học ghi nhận</span>
            <button
              type="button"
              onClick={() => setVesselChemicals(['Fe', 'CuSO4'])}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Thử Fe + CuSO₄
            </button>
          </div>
          {outcome.equations.length > 0 && (
            <div className="space-y-1">
              {outcome.equations.map((eq, i) => (
                <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-300 font-mono font-bold">
                  {eq}
                </div>
              ))}
            </div>
          )}
          <ul className="space-y-1 text-slate-700 dark:text-slate-200">
            {outcome.observations.map((obs, idx) => (
              <li key={idx}>• {obs}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
