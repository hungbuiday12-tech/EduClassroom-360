import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface SandboxIntroGuideBannerProps {
  subject: 'chem' | 'bio';
  title: string;
  intro: string;
  steps: string[];
  tip?: string;
  isEn?: boolean;
}

export const SandboxIntroGuideBanner: React.FC<SandboxIntroGuideBannerProps> = ({
  subject,
  title,
  intro,
  steps,
  tip,
  isEn = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  const accentText =
    subject === 'chem'
      ? 'text-emerald-700 dark:text-emerald-300'
      : 'text-teal-700 dark:text-teal-300';
  const accentBg =
    subject === 'chem'
      ? 'bg-emerald-500/8 dark:bg-emerald-500/10 border-emerald-500/25'
      : 'bg-teal-500/8 dark:bg-teal-500/10 border-teal-500/25';

  return (
    <section
      aria-label={title}
      className={`rounded-xl border ${accentBg} p-4 sm:p-5 transition-colors`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen className={`w-4 h-4 shrink-0 ${accentText}`} />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {title}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{isEn ? 'Hide guide' : 'Thu gọn hướng dẫn'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>{isEn ? 'Show guide' : 'Xem giới thiệu & hướng dẫn'}</span>
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs sm:text-[13px]">
          <div className="lg:col-span-5 space-y-1.5">
            <div className={`font-bold ${accentText}`}>
              {isEn ? 'Overview' : 'Giới thiệu phòng thực hành'}
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{intro}</p>
            {tip && (
              <p className="text-slate-600 dark:text-slate-400 text-xs pt-0.5 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200">
                  {isEn ? 'Observation tip:' : 'Gợi ý quan sát:'}
                </strong>{' '}
                {tip}
              </p>
            )}
          </div>

          <div className="lg:col-span-7 space-y-1.5">
            <div className={`font-bold flex items-center gap-1.5 ${accentText}`}>
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Quick Guide' : 'Hướng dẫn thao tác nhanh'}</span>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-slate-700 dark:text-slate-300">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className={`font-mono font-bold tabular-nums shrink-0 ${accentText}`}>
                    0{idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
};
