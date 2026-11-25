import React, { useMemo, useState } from 'react';
import { Activity, Calculator, Dna, FlaskConical, Microscope } from 'lucide-react';

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

export const BiologySandboxes: React.FC<{ isEn?: boolean }> = ({ isEn = false }) => {
  const [tab, setTab] = useState<'codon' | 'hardy' | 'enzyme' | 'eco'>('codon');

  // 1. DNA -> mRNA -> Protein Codon Sandbox
  const [dnaTemplate, setDnaTemplate] = useState('TACAAAGCGCCTATT');
  const dnaTranslated = useMemo(() => {
    const clean = dnaTemplate.toUpperCase().replace(/[^ATGC]/g, '').slice(0, 36);
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
    return { clean, codingDna, mrna, codons, hBonds };
  }, [dnaTemplate]);

  // 2. Hardy-Weinberg & Punnett Sandbox
  const [pFreq, setPFreq] = useState(0.6);
  const [selfingGen, setSelfingGen] = useState(0);
  const qFreq = Math.max(0, 1 - pFreq);
  const hwGenotypes = useMemo(() => {
    const baseAa = 2 * pFreq * qFreq;
    const curAa = baseAa * Math.pow(0.5, selfingGen);
    const curAA = pFreq * pFreq + (baseAa - curAa) / 2;
    const curaa = qFreq * qFreq + (baseAa - curAa) / 2;
    return { curAA, curAa, curaa };
  }, [pFreq, qFreq, selfingGen]);

  // 3. Enzyme Kinetics Calculator
  const [vMax, setVMax] = useState(100);
  const [kmVal, setKmVal] = useState(15);
  const [subS, setSubS] = useState(30);
  const [inhibRatio, setInhibRatio] = useState(0);
  const enzCompRate = (vMax * subS) / (kmVal * (1 + inhibRatio) + subS);
  const enzNonCompRate = ((vMax / (1 + inhibRatio)) * subS) / (kmVal + subS);

  // 4. Ecosystem Energy Pyramid Sandbox
  const [ePrimary, setEPrimary] = useState(12000);
  const [ecoEff, setEcoEff] = useState(10);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {isEn ? 'Interactive Biology Sandbox Workbench (4 Labs)' : 'Sandbox Sinh Học Tương Tác (4 Phòng Thực Hành)'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dịch mã DNA → mRNA → Axit amin, Cân bằng Quần thể Hardy–Weinberg, Động học Ức chế Enzyme và Tháp Năng lượng 10%.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(
            [
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
                onClick={() => setTab(tItem.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  tab === tItem.id
                    ? 'bg-emerald-600 text-white'
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

      {tab === 'codon' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Nhập trình tự mạch khuôn DNA (3’ → 5’, chỉ gồm A, T, G, C):
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
                onClick={() => setDnaTemplate('TACAAAGCGCCTATT')}
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Mẫu chuẩn (Mở đầu + 3aa + Stop)
              </button>
              <button
                type="button"
                onClick={() => setDnaTemplate('TACAAAGCGCATATT')}
                className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold cursor-pointer"
              >
                Thử Đột biến điểm (C→A)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <div className="text-slate-500">Mạch bổ sung DNA (5’→3’)</div>
              <div className="font-bold text-sky-600 dark:text-sky-400 mt-1 break-all">{dnaTranslated.codingDna}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <div className="text-slate-500">mRNA phiên mã (5’→3’)</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 break-all">{dnaTranslated.mrna}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
              <div className="text-slate-500">Số LK Hydro của đoạn gen</div>
              <div className="font-bold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
                {dnaTranslated.hBonds} LK ({dnaTranslated.clean.length} cặp nu)
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
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono tabular-nums">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
              <div className="text-slate-500">AA (Đồng hợp trội)</div>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">{(hwGenotypes.curAA * 100).toFixed(2)}%</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
              <div className="text-slate-500">Aa (Dị hợp)</div>
              <div className="text-xl font-extrabold text-sky-600 mt-1">{(hwGenotypes.curAa * 100).toFixed(2)}%</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
              <div className="text-slate-500">aa (Đồng hợp lặn)</div>
              <div className="text-xl font-extrabold text-amber-600 mt-1">{(hwGenotypes.curaa * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'enzyme' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
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
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
              <div className="text-slate-500">Ức chế Cạnh tranh (tăng Km biểu kiến, giữ nguyên Vmax)</div>
              <div className="text-2xl font-mono font-extrabold text-sky-600 mt-1 tabular-nums">{enzCompRate.toFixed(2)} μM/s</div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
              <div className="text-slate-500">Ức chế Không cạnh tranh (giảm Vmax, giữ nguyên Km)</div>
              <div className="text-2xl font-mono font-extrabold text-rose-600 mt-1 tabular-nums">{enzNonCompRate.toFixed(2)} μM/s</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'eco' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center text-xs">
          <div className="space-y-3">
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Năng lượng Sinh vật Sản xuất</span><span className="font-mono tabular-nums">{ePrimary} kcal</span></div>
              <input type="range" min={5000} max={50000} step={1000} value={ePrimary} onChange={(e) => setEPrimary(Number(e.target.value))} className="w-full accent-emerald-600" />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between font-semibold"><span>Hiệu suất sinh thái truyền bậc</span><span className="font-mono tabular-nums">{ecoEff}%</span></div>
              <input type="range" min={5} max={20} step={1} value={ecoEff} onChange={(e) => setEcoEff(Number(e.target.value))} className="w-full accent-amber-600" />
            </label>
          </div>
          <div className="space-y-2 flex flex-col items-center">
            {[
              { name: 'SV Tiêu thụ bậc 3 (Đại bàng)', lv: 3, w: '40%' },
              { name: 'SV Tiêu thụ bậc 2 (Rắn)', lv: 2, w: '58%' },
              { name: 'SV Tiêu thụ bậc 1 (Châu chấu)', lv: 1, w: '78%' },
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
      )}
    </div>
  );
};
