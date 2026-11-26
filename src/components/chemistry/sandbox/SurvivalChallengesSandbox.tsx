import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Flame,
  FlaskConical,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

type ProcessId = 'electrolyze_aq' | 'electrolyze_melt' | 'roast_smelt' | 'burn_air' | 'react_heat' | 'saponify';

interface MaterialDef {
  id: string;
  formula: string;
  nameVi: string;
  nameEn: string;
  category: 'raw' | 'intermediate' | 'target';
  colorHex: string;
}

const MATERIALS: Record<string, MaterialDef> = {
  H2O: { id: 'H2O', formula: 'H₂O', nameVi: 'Nước thô', nameEn: 'Water', category: 'raw', colorHex: '#38bdf8' },
  NaCl: { id: 'NaCl', formula: 'NaCl', nameVi: 'Muối ăn', nameEn: 'Salt', category: 'raw', colorHex: '#f8fafc' },
  Fe2O3: { id: 'Fe2O3', formula: 'Fe₂O₃', nameVi: 'Quặng hematit', nameEn: 'Iron ore', category: 'raw', colorHex: '#b91c1c' },
  C: { id: 'C', formula: 'C', nameVi: 'Than đá / Than cốc', nameEn: 'Coal / Carbon', category: 'raw', colorHex: '#334155' },
  CaCO3: { id: 'CaCO3', formula: 'CaCO₃', nameVi: 'Đá vôi', nameEn: 'Limestone', category: 'raw', colorHex: '#e2e8f0' },
  S: { id: 'S', formula: 'S', nameVi: 'Lưu huỳnh', nameEn: 'Sulfur', category: 'raw', colorHex: '#eab308' },
  N2: { id: 'N2', formula: 'N₂', nameVi: 'Khí Nitơ (không khí)', nameEn: 'Nitrogen', category: 'raw', colorHex: '#818cf8' },
  Oil: { id: 'Oil', formula: '(RCOO)₃C₃H₅', nameVi: 'Dầu thực vật / Mỡ', nameEn: 'Vegetable Oil', category: 'raw', colorHex: '#f59e0b' },

  H2: { id: 'H2', formula: 'H₂', nameVi: 'Khí Hiđro tinh khiết', nameEn: 'Hydrogen gas', category: 'target', colorHex: '#60a5fa' },
  O2: { id: 'O2', formula: 'O₂', nameVi: 'Khí Oxi', nameEn: 'Oxygen gas', category: 'intermediate', colorHex: '#34d399' },
  Cl2: { id: 'Cl2', formula: 'Cl₂', nameVi: 'Khí Clo', nameEn: 'Chlorine gas', category: 'intermediate', colorHex: '#a3e635' },
  NaOH: { id: 'NaOH', formula: 'NaOH', nameVi: 'Xút ăn da (Kiềm)', nameEn: 'Sodium hydroxide', category: 'intermediate', colorHex: '#f472b6' },
  CO: { id: 'CO', formula: 'CO', nameVi: 'Khí Cacbon monooxit', nameEn: 'Carbon monoxide', category: 'intermediate', colorHex: '#94a3b8' },
  CO2: { id: 'CO2', formula: 'CO₂', nameVi: 'Khí Cacbon đioxit', nameEn: 'Carbon dioxide', category: 'intermediate', colorHex: '#cbd5e1' },
  CaO: { id: 'CaO', formula: 'CaO', nameVi: 'Vôi sống', nameEn: 'Quicklime', category: 'intermediate', colorHex: '#f1f5f9' },
  Fe: { id: 'Fe', formula: 'Fe', nameVi: 'Sắt kim loại (Gang/Thép)', nameEn: 'Metallic Iron', category: 'target', colorHex: '#64748b' },
  NH3: { id: 'NH3', formula: 'NH₃', nameVi: 'Khí Amoniac', nameEn: 'Ammonia', category: 'intermediate', colorHex: '#c084fc' },
  SO2: { id: 'SO2', formula: 'SO₂', nameVi: 'Khí Sunfurơ', nameEn: 'Sulfur dioxide', category: 'intermediate', colorHex: '#facc15' },
  SO3: { id: 'SO3', formula: 'SO₃', nameVi: 'Lưu huỳnh trioxit', nameEn: 'Sulfur trioxide', category: 'intermediate', colorHex: '#fb923c' },
  H2SO4: { id: 'H2SO4', formula: 'H₂SO₄', nameVi: 'Axit Sunfuric', nameEn: 'Sulfuric acid', category: 'target', colorHex: '#f43f5e' },
  Fertilizer: { id: 'Fertilizer', formula: '(NH₄)₂SO₄', nameVi: 'Phân đạm Amoni sunfat', nameEn: 'Ammonium Sulfate', category: 'target', colorHex: '#10b981' },
  Soap: { id: 'Soap', formula: 'RCOONa', nameVi: 'Xà phòng nguyên chất', nameEn: 'Soap', category: 'target', colorHex: '#2dd4bf' },
};

interface SynthesisRecipe {
  inputs: string[];
  process: ProcessId;
  outputs: string[];
  equation: string;
  noteVi: string;
}

const RECIPES: SynthesisRecipe[] = [
  {
    inputs: ['H2O'],
    process: 'electrolyze_aq',
    outputs: ['H2', 'O2'],
    equation: '2H₂O —(đp)→ 2H₂↑ + O₂↑',
    noteVi: 'Điện phân nước thu được khí Hiđro (catot) và Oxi (anot).',
  },
  {
    inputs: ['H2O', 'NaCl'],
    process: 'electrolyze_aq',
    outputs: ['NaOH', 'H2', 'Cl2'],
    equation: '2NaCl + 2H₂O —(đpdd, có màng ngăn)→ 2NaOH + H₂↑ + Cl₂↑',
    noteVi: 'Công nghiệp Xút – Clo: tạo ra NaOH kiềm mạnh, H₂ và Cl₂.',
  },
  {
    inputs: ['C', 'Fe2O3'],
    process: 'roast_smelt',
    outputs: ['Fe', 'CO2'],
    equation: '2Fe₂O₃ + 3C —(t° cao)→ 4Fe + 3CO₂↑',
    noteVi: 'Luyện kim bằng than cốc khử quặng sắt oxit thành Sắt nóng chảy.',
  },
  {
    inputs: ['C', 'O2'],
    process: 'burn_air',
    outputs: ['CO'],
    equation: '2C + O₂(thiếu) —(t°)→ 2CO',
    noteVi: 'Đốt than thiếu oxi sinh ra chất khử CO dùng cho lò cao.',
  },
  {
    inputs: ['CO', 'Fe2O3'],
    process: 'roast_smelt',
    outputs: ['Fe', 'CO2'],
    equation: 'Fe₂O₃ + 3CO —(t° lò cao)→ 2Fe + 3CO₂↑',
    noteVi: 'Khí CO khử oxit sắt ở nhiệt độ cao tạo thành Sắt nguyên chất.',
  },
  {
    inputs: ['CaCO3'],
    process: 'roast_smelt',
    outputs: ['CaO', 'CO2'],
    equation: 'CaCO₃ —(900°C)→ CaO + CO₂↑',
    noteVi: 'Nung đá vôi thu được vôi sống CaO và khí CO₂.',
  },
  {
    inputs: ['H2', 'N2'],
    process: 'react_heat',
    outputs: ['NH3'],
    equation: 'N₂ + 3H₂ ⇌ 2NH₃ (450°C, 200 atm, xt Fe)',
    noteVi: 'Tổng hợp Amoniac (quy trình Haber–Bosch) làm tiền chất phân đạm.',
  },
  {
    inputs: ['O2', 'S'],
    process: 'burn_air',
    outputs: ['SO2'],
    equation: 'S + O₂ —(t°)→ SO₂',
    noteVi: 'Đốt cháy lưu huỳnh trong oxi tạo khí SO₂.',
  },
  {
    inputs: ['O2', 'SO2'],
    process: 'react_heat',
    outputs: ['SO3'],
    equation: '2SO₂ + O₂ ⇌ 2SO₃ (450°C, V₂O₅)',
    noteVi: 'Oxi hóa SO₂ có xúc tác V₂O₅ thu được SO₃.',
  },
  {
    inputs: ['H2O', 'SO3'],
    process: 'react_heat',
    outputs: ['H2SO4'],
    equation: 'SO₃ + H₂O → H₂SO₄',
    noteVi: 'Hấp thụ SO₃ tạo Axit sunfuric đặc – hóa chất nền tảng.',
  },
  {
    inputs: ['H2SO4', 'NH3'],
    process: 'react_heat',
    outputs: ['Fertilizer'],
    equation: '2NH₃ + H₂SO₄ → (NH₄)₂SO₄',
    noteVi: 'Trung hòa amoniac bằng axit sunfuric điều chế phân đạm Amoni sunfat.',
  },
  {
    inputs: ['NaOH', 'Oil'],
    process: 'saponify',
    outputs: ['Soap'],
    equation: '(RCOO)₃C₃H₅ + 3NaOH —(t°)→ 3RCOONa + C₃H₅(OH)₃',
    noteVi: 'Phản ứng xà phòng hóa chất béo bằng kiềm NaOH tạo ra Xà phòng!',
  },
];

interface SurvivalMission {
  id: string;
  title: string;
  targetId: string;
  rawStarter: string[];
  hintVi: string;
}

const MISSIONS: SurvivalMission[] = [
  {
    id: 'm_h2',
    title: 'Nhiệm vụ 1: Điều chế Khí Hiđro (H₂)',
    targetId: 'H2',
    rawStarter: ['H2O', 'NaCl'],
    hintVi: 'Cho Nước (H₂O) vào buồng phản ứng rồi chạy quy trình Điện phân dung dịch.',
  },
  {
    id: 'm_fe',
    title: 'Nhiệm vụ 2: Luyện Sắt (Fe) từ quặng',
    targetId: 'Fe',
    rawStarter: ['Fe2O3', 'C', 'CaCO3'],
    hintVi: 'Kết hợp Quặng Fe₂O₃ + Than đá (C) rồi Nung lò cao nhiệt độ cao.',
  },
  {
    id: 'm_soap',
    title: 'Nhiệm vụ 3: Điều chế Xà phòng (RCOONa)',
    targetId: 'Soap',
    rawStarter: ['H2O', 'NaCl', 'Oil'],
    hintVi: 'Bước 1: Điện phân dung dịch (NaCl + H₂O) để thu NaOH. Bước 2: Đun NaOH + Dầu thực vật để Xà phòng hóa.',
  },
  {
    id: 'm_h2so4',
    title: 'Nhiệm vụ 4: Tổng hợp Axit Sunfuric (H₂SO₄)',
    targetId: 'H2SO4',
    rawStarter: ['H2O', 'S'],
    hintVi: 'Điện phân H₂O lấy O₂ → Đốt S lấy SO₂ → Oxi hóa SO₂ thành SO₃ → Hợp nước tạo H₂SO₄.',
  },
  {
    id: 'm_fert',
    title: 'Nhiệm vụ 5: Sản xuất Phân đạm ((NH₄)₂SO₄)',
    targetId: 'Fertilizer',
    rawStarter: ['H2O', 'S', 'N2'],
    hintVi: 'Tạo H₂ & O₂ từ H₂O → N₂ + H₂ thành NH₃; S + O₂ → SO₂ → SO₃ → H₂SO₄ → ghép NH₃ + H₂SO₄.',
  },
];

const PROCESSES: { id: ProcessId; label: string; icon: React.ReactNode }[] = [
  { id: 'electrolyze_aq', label: 'Điện phân dd', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'roast_smelt', label: 'Nung / Lò cao', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'burn_air', label: 'Đốt cháy', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'react_heat', label: 'Tổng hợp xúc tác', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'saponify', label: 'Xà phòng hóa', icon: <FlaskConical className="w-3.5 h-3.5" /> },
];

export const SurvivalChallengesSandbox: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [missionIdx, setMissionIdx] = useState(0);
  const mission = MISSIONS[missionIdx];

  const [inventory, setInventory] = useState<string[]>(() => [...mission.rawStarter]);
  const [reactor, setReactor] = useState<string[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [log, setLog] = useState<{ eq: string; note: string; ok: boolean }[]>([
    {
      eq: 'Sẵn sàng điều chế',
      note: 'Chọn nguyên liệu thô vào lò phản ứng, sau đó bấm một quy trình hóa học để tổng hợp chất mới.',
      ok: true,
    },
  ]);

  const selectMission = (idx: number) => {
    setMissionIdx(idx);
    const nextM = MISSIONS[idx];
    setInventory([...nextM.rawStarter]);
    setReactor([]);
    setLog([
      {
        eq: nextM.title,
        note: `Nguyên liệu thô ban đầu: ${nextM.rawStarter.map((id) => MATERIALS[id].formula).join(', ')}. Mục tiêu: ${MATERIALS[nextM.targetId].formula}`,
        ok: true,
      },
    ]);
  };

  const addToReactor = (matId: string) => {
    setReactor((prev) => (prev.includes(matId) ? prev : [...prev, matId].slice(0, 3)));
  };

  const runProcess = (procId: ProcessId) => {
    if (reactor.length === 0) {
      setLog((prev) => [
        { eq: 'Lò phản ứng trống', note: 'Hãy nạp ít nhất 1 chất vào buồng phản ứng trước.', ok: false },
        ...prev.slice(0, 5),
      ]);
      return;
    }

    const sortedReactor = [...reactor].sort().join('|');
    const match = RECIPES.find(
      (r) => r.process === procId && [...r.inputs].sort().join('|') === sortedReactor
    );

    if (!match) {
      setLog((prev) => [
        {
          eq: `${reactor.map((id) => MATERIALS[id].formula).join(' + ')} —(${PROCESSES.find((p) => p.id === procId)?.label})→ ?`,
          note: 'Tổ hợp chất hoặc quy trình này chưa tạo ra phản ứng tổng hợp hữu ích. Thử đổi chất hoặc điều kiện khác!',
          ok: false,
        },
        ...prev.slice(0, 5),
      ]);
      return;
    }

    setInventory((prev) => {
      const next = new Set(prev);
      match.outputs.forEach((o) => next.add(o));
      return Array.from(next);
    });
    setReactor([]);

    const hitTarget = match.outputs.includes(mission.targetId);
    if (hitTarget && !completedMissions.includes(mission.id)) {
      setCompletedMissions((prev) => [...prev, mission.id]);
    }

    setLog((prev) => [
      {
        eq: match.equation,
        note: hitTarget
          ? `HOÀN THÀNH MỤC TIÊU! ${match.noteVi}`
          : match.noteVi,
        ok: true,
      },
      ...prev.slice(0, 5),
    ]);
  };

  const isMissionSolved = useMemo(
    () => inventory.includes(mission.targetId) || completedMissions.includes(mission.id),
    [inventory, mission, completedMissions]
  );

  return (
    <div className="space-y-4">
      {/* Mission Selector Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Chế độ Sinh tồn Hóa học — Điều chế từ nguyên liệu thô
            </h3>
          </div>
          <span className="font-mono tabular-nums text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            Đã hoàn thành: {completedMissions.length}/{MISSIONS.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {MISSIONS.map((m, idx) => {
            const active = idx === missionIdx;
            const done = completedMissions.includes(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMission(idx)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : done
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                {done && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span>{m.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Survival Synthesis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Unlocked Inventory (Raw -> Intermediate -> Target) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Kho nguyên liệu hiện có ({inventory.length})
            </span>
            <button
              type="button"
              onClick={() => selectMission(missionIdx)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {inventory.map((matId) => {
              const mat = MATERIALS[matId];
              const inReactor = reactor.includes(matId);
              const isGoal = matId === mission.targetId;
              return (
                <button
                  key={matId}
                  type="button"
                  onClick={() => addToReactor(matId)}
                  className={`text-left p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    isGoal
                      ? 'bg-emerald-600/15 border-emerald-500 ring-1 ring-emerald-500'
                      : inReactor
                      ? 'bg-sky-500/10 border-sky-500'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                      {mat.formula}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {isEn ? mat.nameEn : mat.nameVi}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-800 dark:text-amber-200">
            <span className="font-bold">Gợi ý quy trình: </span>
            {mission.hintVi}
          </div>
        </div>

        {/* Right: Reactor Chamber & Reaction History */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-400">Mục tiêu nhiệm vụ</div>
              <div className="text-base font-extrabold text-emerald-400 flex items-center gap-2">
                <span>{MATERIALS[mission.targetId].formula} — {MATERIALS[mission.targetId].nameVi}</span>
                {isMissionSolved && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReactor([])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              Xả buồng nạp
            </button>
          </div>

          {/* Reactor Slots */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <div className="text-xs font-bold text-slate-400">Buồng phản ứng (nhấp chất bên trái để nạp):</div>
            <div className="flex flex-wrap items-center gap-2 min-h-[52px]">
              {reactor.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Chưa nạp chất nào...</span>
              ) : (
                reactor.map((id, i) => (
                  <React.Fragment key={id}>
                    {i > 0 && <span className="text-slate-400 font-bold">+</span>}
                    <button
                      type="button"
                      onClick={() => setReactor((prev) => prev.filter((x) => x !== id))}
                      className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-rose-500 text-sm font-mono font-bold text-white cursor-pointer"
                      title="Nhấp để bỏ ra"
                    >
                      {MATERIALS[id].formula} ×
                    </button>
                  </React.Fragment>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {PROCESSES.map((proc) => (
                <button
                  key={proc.id}
                  type="button"
                  onClick={() => runProcess(proc.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  {proc.icon}
                  <span>{proc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Synthesis Log */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Nhật ký tổng hợp</div>
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {log.map((entry, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-3 text-xs ${
                    entry.ok
                      ? 'bg-emerald-950/30 border-emerald-500/35 text-slate-100'
                      : 'bg-rose-950/30 border-rose-500/35 text-rose-200'
                  }`}
                >
                  <div className="font-mono font-bold text-emerald-300">{entry.eq}</div>
                  <div className="text-slate-300 mt-1">{entry.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
