import React, { useMemo, useState } from 'react';
import { Dna, Play, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { getMorphCreatureSprite, spriteSpecToSvgRects } from '../pixelSpriteEngine';

type Base = 'A' | 'T' | 'G' | 'C';
type EnvId = 'ice_age' | 'desert_heat' | 'dark_forest' | 'storm_island';

interface CreatureVariant {
  id: number;
  furBases: Base[];
  wingBases: Base[];
  thermoBases: Base[];
  count: number;
}

const COMPLEMENT: Record<Base, Base> = { A: 'T', T: 'A', G: 'C', C: 'G' };
const MRNA_COMP: Record<Base, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };

const CODON_AA: Record<string, string> = {
  AUG: 'Met', UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
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
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
  AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
  AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile',
};

function decodeGene(bases: Base[]) {
  const mRna = bases.map((b) => MRNA_COMP[b]).join('');
  const codons = [mRna.slice(0, 3), mRna.slice(3, 6), mRna.slice(6, 9)];
  const aas = codons.map((c) => CODON_AA[c] || 'Xaa');
  return { mRna, codons, aas };
}

function evaluateTraits(fur: Base[], wing: Base[], thermo: Base[]) {
  const gcFur = fur.filter((b) => b === 'G' || b === 'C').length;
  const furType: 'white' | 'sand' | 'green' | 'dark' =
    gcFur <= 2 ? 'white' : gcFur <= 4 ? 'sand' : gcFur <= 6 ? 'green' : 'dark';
  const furLabel =
    furType === 'white'
      ? 'Lông Trắng Tuyết'
      : furType === 'sand'
      ? 'Vảy Vàng Cát'
      : furType === 'green'
      ? 'Sắc Tố Xanh Rêu'
      : 'Lông Đen Than';
  const furHex =
    furType === 'white'
      ? '#f1f5f9'
      : furType === 'sand'
      ? '#fbbf24'
      : furType === 'green'
      ? '#22c55e'
      : '#1e293b';

  const aWing = wing.filter((b) => b === 'A' || b === 'G').length;
  const wingType: 'large' | 'agile' | 'compact' = aWing >= 6 ? 'large' : aWing >= 3 ? 'agile' : 'compact';
  const wingLabel =
    wingType === 'large'
      ? 'Cánh lớn lướt gió'
      : wingType === 'agile'
      ? 'Cơ chi linh hoạt'
      : 'Thân gọn bám đất';

  const tThermo = thermo.filter((b) => b === 'T' || b === 'A').length;
  const thermoType: 'cold' | 'neutral' | 'heat' = tThermo >= 6 ? 'cold' : tThermo >= 3 ? 'neutral' : 'heat';
  const thermoLabel =
    thermoType === 'cold'
      ? 'Mỡ dày chịu lạnh (-20°C)'
      : thermoType === 'neutral'
      ? 'Cân bằng ôn đới'
      : 'Chịu nóng sa mạc (48°C)';

  return { furType, furLabel, furHex, wingType, wingLabel, thermoType, thermoLabel };
}

const ENVIRONMENTS: { id: EnvId; nameVi: string; ruleVi: string; score: (t: ReturnType<typeof evaluateTraits>) => number }[] = [
  {
    id: 'ice_age',
    nameVi: 'Kỷ Băng Hà (-20°C)',
    ruleVi: 'Ưu tiên Lông Trắng Tuyết ngụy trang + Gen Chịu Lạnh.',
    score: (t) => (t.furType === 'white' ? 45 : 10) + (t.thermoType === 'cold' ? 45 : t.thermoType === 'neutral' ? 20 : 0) + (t.wingType === 'compact' ? 15 : 8),
  },
  {
    id: 'desert_heat',
    nameVi: 'Sa mạc Thiêu đốt (45°C)',
    ruleVi: 'Ưu tiên Vảy Vàng Cát + Gen Chịu Nóng.',
    score: (t) => (t.furType === 'sand' ? 45 : 10) + (t.thermoType === 'heat' ? 45 : t.thermoType === 'neutral' ? 18 : 0) + (t.wingType === 'agile' ? 15 : 8),
  },
  {
    id: 'dark_forest',
    nameVi: 'Rừng Đêm nhiều thú săn mồi',
    ruleVi: 'Ưu tiên Lông Đen / Xanh Rêu ngụy trang + Cơ chi linh hoạt.',
    score: (t) => (t.furType === 'dark' || t.furType === 'green' ? 45 : 8) + (t.wingType === 'agile' || t.wingType === 'large' ? 35 : 10) + 15,
  },
  {
    id: 'storm_island',
    nameVi: 'Đảo Gió Bão khắc nghiệt',
    ruleVi: 'Ưu tiên Thân gọn bám đất (tránh bị gió quật) + Sắc tố xanh/cát.',
    score: (t) => (t.wingType === 'compact' ? 50 : t.wingType === 'agile' ? 25 : 5) + (t.thermoType === 'neutral' ? 25 : 15) + 15,
  },
];

const ALL_BASES: Base[] = ['A', 'T', 'G', 'C'];
const BASE_COLOR: Record<Base, string> = {
  A: 'bg-emerald-600 text-white',
  T: 'bg-rose-600 text-white',
  G: 'bg-amber-500 text-slate-950',
  C: 'bg-sky-600 text-white',
};

export const DnaEvolutionSandbox: React.FC<{ isEn?: boolean }> = () => {
  const [furBases, setFurBases] = useState<Base[]>(['A', 'T', 'A', 'A', 'T', 'C', 'T', 'A', 'A']);
  const [wingBases, setWingBases] = useState<Base[]>(['G', 'A', 'A', 'A', 'G', 'A', 'C', 'T', 'G']);
  const [thermoBases, setThermoBases] = useState<Base[]>(['T', 'A', 'T', 'A', 'A', 'T', 'G', 'C', 'A']);

  const [envId, setEnvId] = useState<EnvId>('ice_age');
  const [generation, setGeneration] = useState<number>(0);
  const [population, setPopulation] = useState<CreatureVariant[]>([]);

  const designedTraits = useMemo(
    () => evaluateTraits(furBases, wingBases, thermoBases),
    [furBases, wingBases, thermoBases]
  );

  const cycleBase = (setter: React.Dispatch<React.SetStateAction<Base[]>>, index: number) => {
    setter((prev) =>
      prev.map((b, i) => (i === index ? ALL_BASES[(ALL_BASES.indexOf(b) + 1) % 4] : b))
    );
  };

  const mutateOne = (bases: Base[]): Base[] => {
    const idx = Math.floor(Math.random() * bases.length);
    return bases.map((b, i) => (i === idx ? ALL_BASES[Math.floor(Math.random() * 4)] : b));
  };

  const releasePopulation = () => {
    const cohort: CreatureVariant[] = [
      { id: 1, furBases: [...furBases], wingBases: [...wingBases], thermoBases: [...thermoBases], count: 40 },
      { id: 2, furBases: mutateOne(mutateOne(furBases)), wingBases: [...wingBases], thermoBases: mutateOne(thermoBases), count: 20 },
      { id: 3, furBases: mutateOne(furBases), wingBases: mutateOne(mutateOne(wingBases)), thermoBases: [...thermoBases], count: 20 },
      { id: 4, furBases: ['G', 'C', 'G', 'C', 'G', 'C', 'G', 'C', 'T'], wingBases: ['T', 'C', 'T', 'C', 'T', 'C', 'G', 'C', 'A'], thermoBases: ['G', 'C', 'G', 'G', 'C', 'C', 'G', 'C', 'T'], count: 20 },
    ];
    setGeneration(0);
    setPopulation(cohort);
  };

  const advanceGenerations = (steps = 5) => {
    const activeEnv = ENVIRONMENTS.find((e) => e.id === envId) || ENVIRONMENTS[0];
    setPopulation((prev) => {
      const source: CreatureVariant[] =
        prev.length > 0
          ? prev
          : [
              { id: 1, furBases: [...furBases], wingBases: [...wingBases], thermoBases: [...thermoBases], count: 40 },
              {
                id: 2,
                furBases: ['G', 'C', 'G', 'C', 'G', 'C', 'G', 'C', 'T'],
                wingBases: ['T', 'C', 'T', 'C', 'T', 'C', 'G', 'C', 'A'],
                thermoBases: ['G', 'C', 'G', 'G', 'C', 'C', 'G', 'C', 'T'],
                count: 60,
              },
            ];
      let current = source.map((v) => ({ ...v }));
      for (let s = 0; s < steps; s++) {
        const weighted = current.map((v) => {
          const tr = evaluateTraits(v.furBases, v.wingBases, v.thermoBases);
          const fit = Math.max(4, activeEnv.score(tr));
          return { v, w: v.count * (fit / 50) };
        });
        const totalW = weighted.reduce((acc, item) => acc + item.w, 0) || 1;
        current = weighted.map((item) => ({
          ...item.v,
          count: Math.max(0, Math.round((item.w / totalW) * 100)),
        }));
      }
      return current;
    });
    setGeneration((g) => g + steps);
  };

  const furDecoded = useMemo(() => decodeGene(furBases), [furBases]);
  const wingDecoded = useMemo(() => decodeGene(wingBases), [wingBases]);
  const thermoDecoded = useMemo(() => decodeGene(thermoBases), [thermoBases]);

  const activeEnv = ENVIRONMENTS.find((e) => e.id === envId) || ENVIRONMENTS[0];
  const designedFitness = activeEnv.score(designedTraits);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Nucleotide Sequence Editor */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold flex items-center gap-2 text-slate-900 dark:text-white">
              <Dna className="w-4 h-4 text-teal-600" />
              <span>Biên tập Trình tự Nucleotit (A – T – G – C)</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setFurBases((b) => mutateOne(b));
                setWingBases((b) => mutateOne(b));
                setThermoBases((b) => mutateOne(b));
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đột biến ngẫu nhiên</span>
            </button>
          </div>

          {[
            {
              title: 'Gen 1: Màu sắc & Ngụy trang',
              bases: furBases,
              setter: setFurBases,
              decoded: furDecoded,
              trait: designedTraits.furLabel,
            },
            {
              title: 'Gen 2: Kích thước Cánh & Vận động',
              bases: wingBases,
              setter: setWingBases,
              decoded: wingDecoded,
              trait: designedTraits.wingLabel,
            },
            {
              title: 'Gen 3: Thích nghi Nhiệt độ',
              bases: thermoBases,
              setter: setThermoBases,
              decoded: thermoDecoded,
              trait: designedTraits.thermoLabel,
            },
          ].map((gene) => (
            <div key={gene.title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-100">{gene.title}</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">{gene.trait}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400 w-10">3&apos;–5&apos;</span>
                {gene.bases.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => cycleBase(gene.setter, idx)}
                    className={`w-7 h-7 rounded-md font-mono font-extrabold text-xs cursor-pointer transition-transform active:scale-95 ${BASE_COLOR[b]} ${
                      idx % 3 === 2 ? 'mr-1.5' : ''
                    }`}
                    title="Nhấp để đổi Nucleotit"
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500">
                <span>Bổ sung: {gene.bases.map((b) => COMPLEMENT[b]).join('')}</span>
                <span>mARN: {gene.decoded.mRna}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Chuỗi axit amin: {gene.decoded.aas.join(' – ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Phenotype Preview & Natural Selection Simulator */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 p-4 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-center gap-4">
            {/* Crisp Pixel-Art Creature over High-Res Atmospheric Habitat Backdrop */}
            {(() => {
              const furDark =
                designedTraits.furType === 'white'
                  ? '#94a3b8'
                  : designedTraits.furType === 'sand'
                  ? '#b45309'
                  : designedTraits.furType === 'green'
                  ? '#15803d'
                  : '#090d16';
              const wingCol =
                designedTraits.wingType === 'large'
                  ? '#38bdf8'
                  : designedTraits.wingType === 'agile'
                  ? '#2dd4bf'
                  : null;
              const spec = getMorphCreatureSprite(
                designedTraits.furHex,
                furDark,
                wingCol,
                designedTraits.thermoType === 'cold',
                designedTraits.thermoType === 'heat',
                0
              );
              const rects = spriteSpecToSvgRects(spec);
              const gridW = spec.grid[0]?.length || 14;
              const gridH = spec.grid.length || 8;
              const envBg =
                envId === 'ice_age'
                  ? 'from-sky-900 via-cyan-950 to-slate-950'
                  : envId === 'desert_heat'
                  ? 'from-amber-800 via-orange-950 to-stone-950'
                  : envId === 'dark_forest'
                  ? 'from-emerald-950 via-slate-900 to-slate-950'
                  : 'from-indigo-950 via-slate-900 to-cyan-950';
              const glowCol =
                envId === 'ice_age'
                  ? '#38bdf8'
                  : envId === 'desert_heat'
                  ? '#fbbf24'
                  : envId === 'dark_forest'
                  ? '#34d399'
                  : '#818cf8';
              return (
                <div className={`relative w-32 h-24 shrink-0 rounded-lg bg-gradient-to-b ${envBg} border border-slate-700/80 overflow-hidden flex items-center justify-center`}>
                  <div
                    className="absolute inset-0 opacity-45 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 42%, ${glowCol}44 0%, transparent 68%)`,
                    }}
                  />
                  <svg
                    viewBox={`0 0 ${gridW} ${gridH}`}
                    shapeRendering="crispEdges"
                    className="w-24 h-20 relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)]"
                  >
                    {rects.map((r, i) => (
                      <rect key={i} x={r.x} y={r.y} width={1} height={1} fill={r.fill} />
                    ))}
                  </svg>
                </div>
              );
            })()}

            <div className="space-y-1 text-xs">
              <div className="text-[11px] font-mono text-teal-400 uppercase">Kiểu hình sinh vật thiết kế</div>
              <div className="font-bold text-white">{designedTraits.furLabel}</div>
              <div className="text-slate-300">{designedTraits.wingLabel}</div>
              <div className="text-slate-300">{designedTraits.thermoLabel}</div>
              <div className="text-amber-300 font-mono font-bold pt-1">
                Độ thích nghi tại môi trường chọn: {designedFitness}/100
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">Chọn môi trường Chọn lọc Tự nhiên:</div>
            <div className="grid grid-cols-2 gap-1.5">
              {ENVIRONMENTS.map((env) => (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => setEnvId(env.id)}
                  className={`text-left p-2 rounded-lg border text-xs font-bold cursor-pointer ${
                    envId === env.id
                      ? 'bg-teal-600 text-white border-teal-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {env.nameVi}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{activeEnv.ruleVi}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={releasePopulation}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thả 100 cá thể F₀</span>
            </button>
            <button
              type="button"
              onClick={() => advanceGenerations(5)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Tiến hóa +5 thế hệ</span>
            </button>
            <span className="ml-auto font-mono font-bold text-sm text-amber-300 self-center">
              Thế hệ F{generation}
            </span>
          </div>

          {/* Cohort survival bars */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {population.length === 0 ? (
              <div className="text-xs text-slate-500">Bấm &quot;Thả 100 cá thể F₀&quot; rồi cho tiến hóa qua các thế hệ để quan sát chọn lọc tự nhiên.</div>
            ) : (
              population.map((v, idx) => {
                const tr = evaluateTraits(v.furBases, v.wingBases, v.thermoBases);
                return (
                  <div key={v.id} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-200 truncate">
                        {idx === 0 ? '★ Kiểu gen bạn thiết kế' : `Biến dị #${idx}`} ({tr.furLabel} · {tr.thermoLabel})
                      </span>
                      <span className="font-mono font-bold tabular-nums text-emerald-400">{v.count}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${v.count}%`,
                          backgroundColor: idx === 0 ? '#10b981' : '#38bdf8',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
