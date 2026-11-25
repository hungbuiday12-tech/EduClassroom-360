import React, { useMemo } from 'react';
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { CustomMockQuestionItem, SubjectType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';

export interface QuestionTelemetry {
  questionId: string;
  switches: number;
  firstPickIndex: number | null;
  lastPickAtMs: number | null;
  totalHesitationMs: number;
}

interface CognitiveRadarPanelProps {
  questions: CustomMockQuestionItem[];
  answers: Record<string, number>;
  telemetry: Record<string, QuestionTelemetry>;
  totalDurationSec: number;
}

export const CognitiveRadarPanel: React.FC<CognitiveRadarPanelProps> = ({
  questions,
  answers,
  telemetry,
  totalDurationSec
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { navigate } = useNavigation();

  const metrics = useMemo(() => {
    let confidentCorrect = 0;
    let switchedRightToWrong = 0;
    let switchedWrongToRight = 0;
    let rushedWrong = 0;
    let slowOverload = 0;

    const avgPerQMs = Math.max(4000, (totalDurationSec * 1000) / Math.max(1, questions.length));

    const itemDiag = questions.map((q, idx) => {
      const picked = answers[q.id];
      const isCorrect = picked === q.correctIndex;
      const tel = telemetry[q.id];
      const switches = tel?.switches ?? 0;
      const dwellMs = tel?.totalHesitationMs ?? avgPerQMs * 0.7;

      const rightToWrong =
        !isCorrect && tel?.firstPickIndex === q.correctIndex && switches > 0;

      if (isCorrect && switches === 0) confidentCorrect += 1;
      if (rightToWrong) switchedRightToWrong += 1;
      if (isCorrect && switches > 0 && tel?.firstPickIndex !== q.correctIndex) switchedWrongToRight += 1;
      if (!isCorrect && dwellMs < avgPerQMs * 0.45 && switches === 0) rushedWrong += 1;
      if (dwellMs > avgPerQMs * 1.35) slowOverload += 1;

      return {
        index: idx + 1,
        q,
        isCorrect,
        switches,
        dwellSec: Math.round(dwellMs / 100) / 10,
        rightToWrong
      };
    });

    const n = Math.max(1, questions.length);
    const accuracyScore = Math.round((itemDiag.filter((d) => d.isCorrect).length / n) * 100);
    const stabilityScore = Math.max(
      15,
      Math.round(100 - (switchedRightToWrong * 28 + itemDiag.reduce((s, d) => s + d.switches, 0) * 6))
    );
    const speedScore = Math.max(20, Math.round(100 - (slowOverload / n) * 55));
    const precisionScore = Math.max(15, Math.round(100 - (rushedWrong / n) * 70));
    const enduranceScore = Math.max(25, Math.round(((confidentCorrect + switchedWrongToRight) / n) * 100));

    const weakSubjects = Array.from(
      new Set(itemDiag.filter((d) => !d.isCorrect || d.switches >= 2).map((d) => d.q.subject))
    );

    return {
      itemDiag,
      confidentCorrect,
      switchedRightToWrong,
      rushedWrong,
      slowOverload,
      weakSubjects,
      axes: [
        { label: isEn ? 'Accuracy' : 'Độ chính xác', val: accuracyScore },
        { label: isEn ? 'Stability' : 'Vững tâm lý', val: stabilityScore },
        { label: isEn ? 'Speed' : 'Tốc độ phản xạ', val: speedScore },
        { label: isEn ? 'Carefulness' : 'Chống ẩu', val: precisionScore },
        { label: isEn ? 'Endurance' : 'Độ bền tư duy', val: enduranceScore }
      ]
    };
  }, [questions, answers, telemetry, totalDurationSec, isEn]);

  // SVG Pentagon Radar
  const cx = 110;
  const cy = 105;
  const maxR = 70;
  const axisPts = metrics.axes.map((ax, i) => {
    const ang = -Math.PI / 2 + (i / metrics.axes.length) * Math.PI * 2;
    const r = (ax.val / 100) * maxR;
    return {
      label: ax.label,
      val: ax.val,
      x: cx + Math.cos(ang) * r,
      y: cy + Math.sin(ang) * r,
      lx: cx + Math.cos(ang) * (maxR + 22),
      ly: cy + Math.sin(ang) * (maxR + 18),
      gx: cx + Math.cos(ang) * maxR,
      gy: cy + Math.sin(ang) * maxR
    };
  });

  const polygonStr = axisPts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const openRemedialSim = (subj: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs') => {
    const target: SubjectType =
      subj === 'physics'
        ? 'physics_sims'
        : subj === 'math'
        ? 'math_sims'
        : subj === 'chemistry'
        ? 'chemistry_sims'
        : subj === 'biology'
        ? 'biology_sims'
        : subj;
    navigate({ subject: target, tutorOpen: false });
  };

  return (
    <div className="sci-frame rounded-lg bg-slate-950 text-slate-100 border border-cyan-500/40 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>
            {isEn
              ? 'COGNITIVE HESITATION & BLINDSPOT RADAR'
              : 'RADAR ĐIỂM MÙ TƯ DUY & PHẢN XẠ LÀM BÀI'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {isEn ? 'Auto-tracked hesitation & option switches' : 'Đo tự động theo nhịp bấm & đổi đáp án'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* SVG Multi-Axis Radar */}
        <div className="lg:col-span-5 flex justify-center bg-slate-900/70 rounded border border-slate-800 p-2">
          <svg viewBox="0 0 220 215" className="w-full max-w-[235px]">
            {[0.33, 0.66, 1.0].map((lvl) => (
              <polygon
                key={lvl}
                points={axisPts
                  .map((_, i) => {
                    const ang = -Math.PI / 2 + (i / axisPts.length) * Math.PI * 2;
                    return `${(cx + Math.cos(ang) * maxR * lvl).toFixed(1)},${(
                      cy +
                      Math.sin(ang) * maxR * lvl
                    ).toFixed(1)}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="rgba(148,163,184,0.22)"
                strokeWidth="1"
              />
            ))}
            {axisPts.map((p, idx) => (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={p.gx}
                y2={p.gy}
                stroke="rgba(148,163,184,0.22)"
                strokeWidth="1"
              />
            ))}
            <polygon
              points={polygonStr}
              fill="rgba(6, 182, 212, 0.28)"
              stroke="#22d3ee"
              strokeWidth="2"
            />
            {axisPts.map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="3.2" fill="#38bdf8" />
                <text
                  x={p.lx}
                  y={p.ly}
                  textAnchor="middle"
                  className="fill-slate-300 text-[8.5px] font-mono font-bold"
                >
                  {p.label} ({p.val})
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Behavioral Diagnostics & Remedial Jumps */}
        <div className="lg:col-span-7 space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-700/50">
              <div className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Chuẩn xác
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5 tabular-nums">
                {metrics.confidentCorrect} câu
              </div>
            </div>
            <div className="p-2.5 rounded bg-amber-950/50 border border-amber-700/50">
              <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Đổi Đúng→Sai
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5 tabular-nums">
                {metrics.switchedRightToWrong} câu
              </div>
            </div>
            <div className="p-2.5 rounded bg-rose-950/50 border border-rose-700/50">
              <div className="text-[10px] text-rose-300 font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Bấm vội sai
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5 tabular-nums">
                {metrics.rushedWrong} câu
              </div>
            </div>
            <div className="p-2.5 rounded bg-sky-950/50 border border-sky-700/50">
              <div className="text-[10px] text-sky-300 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> Chững lâu
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5 tabular-nums">
                {metrics.slowOverload} câu
              </div>
            </div>
          </div>

          {/* Per-Question Hesitation Strip */}
          <div className="flex flex-wrap gap-1.5">
            {metrics.itemDiag.map((d) => (
              <span
                key={d.q.id}
                title={`Câu ${d.index}: ${d.dwellSec}s · Đổi ${d.switches} lần`}
                className={`px-2 py-1 rounded border font-mono text-[10px] font-bold ${
                  d.rightToWrong
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : d.isCorrect
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                }`}
              >
                C{d.index} · {d.dwellSec}s{d.switches > 0 ? ` · ↺${d.switches}` : ''}
              </span>
            ))}
          </div>

          {/* Remedial Action Buttons */}
          {metrics.weakSubjects.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-slate-400">
                {isEn ? 'Fix blindspots in Lab:' : 'Vào Lab trị dứt điểm lỗi sai:'}
              </span>
              {metrics.weakSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => openRemedialSim(s)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
                >
                  <span>
                    {s === 'math'
                      ? 'Toán 2D/3D'
                      : s === 'physics'
                      ? 'Mô phỏng Lí 2D/3D'
                      : s === 'chemistry'
                      ? 'Mô phỏng Hóa 2D/3D'
                      : s === 'biology'
                      ? 'Mô phỏng Sinh 2D/3D'
                      : 'IDE Tin học'}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
