import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Code2, Copy, Download, FileCode2, Sparkles, X } from 'lucide-react';
import { Physics3DMode, PhysicsSimType } from '../../types';
import { compileSimToEquationsAndCode } from '../../lib/simToCodeCompiler';
import { MathFormula } from '../common/MathRenderer';
import { useLanguage } from '../../context/LanguageContext';

interface SimToCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  simId: PhysicsSimType | Physics3DMode | string;
  simTitle?: string;
  params: Record<string, number>;
}

export const SimToCodeModal: React.FC<SimToCodeModalProps> = ({
  isOpen,
  onClose,
  simId,
  simTitle,
  params
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [langTab, setLangTab] = useState<'python' | 'cpp'>('python');
  const [copied, setCopied] = useState(false);

  const spec = useMemo(
    () => compileSimToEquationsAndCode(simId, params, simTitle),
    [simId, params, simTitle]
  );

  if (!isOpen || typeof document === 'undefined') return null;

  const activeCode = langTab === 'python' ? spec.pythonCode : spec.cppCode;

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeCode).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  const handleDownload = () => {
    const ext = langTab === 'python' ? 'py' : 'cpp';
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse_${simId}_solver.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[260] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sci-frame w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-slate-950 border border-cyan-500/45 shadow-2xl text-slate-900 dark:text-slate-100"
      >
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode2 className="w-5 h-5 text-cyan-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-mono uppercase font-bold text-cyan-600 dark:text-cyan-400">
                {isEn ? 'SIM-TO-EQUATION & CODE COMPILER' : 'DỊCH NGƯỢC MÔ HÌNH → PHƯƠNG TRÌNH VI PHÂN & CODE RK4'}
              </div>
              <h3 className="font-display text-sm sm:text-base font-extrabold truncate">{spec.title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Differential Equation & Lagrangian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono font-bold uppercase text-sky-600 dark:text-sky-400">
                {isEn ? 'Differential Equation (ODE)' : 'Phương trình Vi phân Động lực học'}
              </div>
              <div className="text-sm overflow-x-auto">
                <MathFormula formula={spec.equationLatex} />
              </div>
            </div>

            <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono font-bold uppercase text-violet-600 dark:text-violet-400">
                {isEn ? 'Lagrangian / Analytical Form' : 'Hàm Lagrange / Dạng Giải tích'}
              </div>
              <div className="text-sm overflow-x-auto">
                <MathFormula formula={spec.lagrangianLatex} />
              </div>
            </div>
          </div>

          {/* Active Parameter Snapshot */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {isEn ? 'Injected Params:' : 'Thông số nạp từ Lab:'}
            </span>
            {spec.variablesSummary.map((v) => (
              <span
                key={v}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                {v}
              </span>
            ))}
          </div>

          {/* Numerical RK4 Sample Table */}
          <div className="rounded border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-1.5 text-left">t (s)</th>
                  <th className="px-3 py-1.5 text-right">{spec.sampleTable[0]?.state1Label}</th>
                  <th className="px-3 py-1.5 text-right">{spec.sampleTable[0]?.state2Label}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {spec.sampleTable.map((row) => (
                  <tr key={row.t}>
                    <td className="px-3 py-1 tabular-nums">{row.t.toFixed(2)}</td>
                    <td className="px-3 py-1 text-right tabular-nums text-sky-600 dark:text-sky-400 font-bold">
                      {row.state1.toFixed(4)}
                    </td>
                    <td className="px-3 py-1 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">
                      {row.state2.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Source Code Output */}
          <div className="rounded border border-slate-300 dark:border-slate-800 overflow-hidden bg-slate-950 text-slate-100">
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <button
                  type="button"
                  onClick={() => setLangTab('python')}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    langTab === 'python' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Python (NumPy · RK4)
                </button>
                <button
                  type="button"
                  onClick={() => setLangTab('cpp')}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                    langTab === 'cpp' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  C++ (RK4 Solver)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isEn ? 'Copied' : 'Đã sao chép') : isEn ? 'Copy' : 'Sao chép'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{langTab === 'python' ? '.py' : '.cpp'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-emerald-200 max-h-72">
              {activeCode}
            </pre>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
