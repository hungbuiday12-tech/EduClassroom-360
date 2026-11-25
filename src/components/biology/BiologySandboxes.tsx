import React, { useMemo, useState } from 'react';
import { Activity, Calculator, Dna, Download, FlaskConical } from 'lucide-react';

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
  const [tab, setTab] = useState<'codon' | 'hardy' | 'enzyme' | 'eco'>('codon');

  // 1. DNA -> mRNA -> Protein Codon Sandbox
  const [dnaTemplate, setDnaTemplate] = useState('TACAAAGCGCCTATT');
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

  // 2. Hardy-Weinberg & Punnett Sandbox
  const [pFreq, setPFreq] = useState(0.6);
  const [selfingGen, setSelfingGen] = useState(0);
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

  // 3. Enzyme Kinetics Calculator
  const [vMax, setVMax] = useState(100);
  const [kmVal, setKmVal] = useState(15);
  const [subS, setSubS] = useState(30);
  const [inhibRatio, setInhibRatio] = useState(0);
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

  // 4. Ecosystem Energy Pyramid Sandbox
  const [ePrimary, setEPrimary] = useState(12000);
  const [ecoEff, setEcoEff] = useState(10);

  return (
    <div className="bio-zone-frame sci-frame rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-6 relative overflow-hidden">
      <span className="bio-helix-sweep" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Dna className="w-5 h-5 text-teal-600 icon-anim-dna shrink-0" />
            <span>{isEn ? 'Interactive Biology Sandbox Workbench (4 Labs)' : 'Sandbox Sinh Học Tương Tác (4 Phòng Thực Hành)'}</span>
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

      {tab === 'codon' && (
        <div className="space-y-4">
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

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 p-3">
            <div className="text-[11px] font-mono text-slate-300 mb-1">
              Diễn biến giảm Dị hợp Aa (Xanh dương) &amp; tăng Đồng hợp AA (Xanh ngọc) / aa (Vàng) qua 6 thế hệ tự thụ
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

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Đồ thị Michaelis–Menten: Không ức chế (Ngọc) · Cạnh tranh (Lam) · Không cạnh tranh (Hồng)</span>
            </div>
            <svg viewBox="0 0 420 190" className="w-full h-44">
              <line x1="32" y1="168" x2="400" y2="168" stroke="#334155" />
              <line x1="32" y1="14" x2="32" y2="168" stroke="#334155" />
              <path
                d={enzCurves.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${32 + (pt.s / 120) * 362} ${168 - (pt.base / 210) * 148}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
              />
              <path
                d={enzCurves.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${32 + (pt.s / 120) * 362} ${168 - (pt.comp / 210) * 148}`).join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <path
                d={enzCurves.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${32 + (pt.s / 120) * 362} ${168 - (pt.nonComp / 210) * 148}`).join(' ')}
                fill="none"
                stroke="#fb7185"
                strokeWidth="2"
              />
              <circle
                cx={32 + (subS / 120) * 362}
                cy={168 - (enzCompRate / 210) * 148}
                r="4.5"
                fill="#38bdf8"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </svg>
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
