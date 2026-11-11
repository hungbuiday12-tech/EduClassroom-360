import React, { useState } from 'react';
import { MathLecture } from '../../types';
import { MATH_LECTURES } from '../../data/curriculumData';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface MathLecturesProps {
  onSelectGraphExample?: (config: any) => void;
}

export const MathLectures: React.FC<MathLecturesProps> = ({ onSelectGraphExample }) => {
  const [activeLectureId, setActiveLectureId] = useState<string>(MATH_LECTURES[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const activeLecture = MATH_LECTURES.find((l) => l.id === activeLectureId) || MATH_LECTURES[0];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [`${activeLecture.id}-${qIdx}`]: optIdx
    }));
  };

  const handleCheckAnswer = (qIdx: number) => {
    setShowExplanations((prev) => ({
      ...prev,
      [`${activeLecture.id}-${qIdx}`]: true
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Lecture List */}
      <div className="lg:col-span-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Chuyên đề bài giảng Toán học
        </h3>
        {MATH_LECTURES.map((lec) => {
          const isSelected = lec.id === activeLectureId;
          return (
            <div
              key={lec.id}
              onClick={() => setActiveLectureId(lec.id)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                {lec.grade}
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                {lec.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">
                {lec.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Lecture Content */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {activeLecture.grade}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {activeLecture.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {activeLecture.description}
            </p>
          </div>

          {/* Theory Points */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Tóm tắt lý thuyết trọng tâm
            </h3>
            <ul className="space-y-2.5">
              {activeLecture.theory.map((item, idx) => (
                <li key={idx} className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Formulas */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Công thức cốt lõi cần nhớ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeLecture.keyFormulas.map((f, i) => (
                <div key={i} className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-xs font-mono font-medium text-indigo-900 dark:text-indigo-200 text-center">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Practice Quiz */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Câu hỏi trắc nghiệm rèn luyện
            </h3>

            {activeLecture.sampleProblems.map((prob, qIdx) => {
              const qKey = `${activeLecture.id}-${qIdx}`;
              const selectedOpt = selectedAnswers[qKey];
              const isChecked = showExplanations[qKey];
              const isCorrect = selectedOpt === prob.correctIndex;

              return (
                <div key={qIdx} className="bg-slate-50/70 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Câu {qIdx + 1}: {prob.question}
                  </p>

                  <div className="space-y-2 mb-3">
                    {prob.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';
                      if (isChecked) {
                        if (optIdx === prob.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium';
                        } else if (isOptionSelected) {
                          btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isChecked}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left px-3.5 py-2 rounded-lg border text-xs transition-colors ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!isChecked ? (
                    <button
                      disabled={selectedOpt === undefined}
                      onClick={() => handleCheckAnswer(qIdx)}
                      className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      Kiểm tra đáp án
                    </button>
                  ) : (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 mt-2 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold mb-1">
                        {isCorrect ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Chính xác! (+20 XP)
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Chưa chính xác!
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        {prob.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
