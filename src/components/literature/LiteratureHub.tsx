import React, { useState } from 'react';
import { LITERATURE_WORKS } from '../../data/curriculumData';
import { LiteratureWork } from '../../types';
import {
  BookOpen,
  GitBranch,
  Quote,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Feather
} from 'lucide-react';

export const LiteratureHub: React.FC = () => {
  const [selectedWorkId, setSelectedWorkId] = useState<string>('tay-tien');
  const work = LITERATURE_WORKS.find((w) => w.id === selectedWorkId) || LITERATURE_WORKS[0];

  const [activeTab, setActiveTab] = useState<'mindmap' | 'quotes' | 'quiz'>('mindmap');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'tt-1': true,
    'tt-2': true,
    'tt-3': true,
    'song-1': true,
    'song-2': true,
    'song-3': true,
    'vcap-1': true,
    'vcap-2': true,
    'vcap-3': true
  });

  const [quizSelection, setQuizSelection] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Subject Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Feather className="w-5 h-5 text-rose-500" />
            Ngữ văn tương tác & Sơ đồ tư duy (Literature Hub)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sơ đồ tư duy phân tích tác phẩm kinh điển, sổ tay dẫn chứng đắt giá và câu hỏi đọc hiểu
          </p>
        </div>

        {/* Work Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {LITERATURE_WORKS.map((w) => {
            const isSel = w.id === selectedWorkId;
            return (
              <button
                key={w.id}
                onClick={() => setSelectedWorkId(w.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isSel
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {w.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
              <span>Tác giả: {work.author}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-500">{work.genre}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {work.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Thời kỳ: {work.period}
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'mindmap'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-rose-500" />
              Sơ đồ tư duy
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'quotes'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Quote className="w-3.5 h-3.5 text-amber-500" />
              Dẫn chứng vàng
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              Đố vui cảm thụ
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <strong>Tóm tắt tác phẩm:</strong> {work.summary}
        </p>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'mindmap' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-rose-500" />
            Cấu trúc phân tích đa tầng (Interactive Mindmap)
          </h3>

          <div className="space-y-4">
            {work.mindmap.children?.map((branch) => {
              const isExpanded = expandedNodes[branch.id];
              return (
                <div
                  key={branch.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleNode(branch.id)}
                    className="p-4 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {branch.label}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {branch.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {isExpanded && branch.children && (
                    <div className="p-4 bg-white dark:bg-slate-900 space-y-2 border-t border-slate-100 dark:border-slate-800">
                      {branch.children.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-start gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg border border-slate-100 dark:border-slate-800/60"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {sub.label}:
                            </span>{' '}
                            <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {sub.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {work.goldenQuotes.map((q, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start gap-2">
                <Quote className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <p className="font-serif italic text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                  "{q.quote}"
                </p>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Vị trí: {q.context}
              </div>

              <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-lg text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong>Bình luận & Phân tích nghệ thuật:</strong> {q.analysis}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Câu hỏi đọc hiểu & Phân tích tác phẩm
          </h3>

          {work.analysisQuestions.map((q, idx) => {
            const key = `${work.id}-${idx}`;
            const selected = quizSelection[key];
            const checked = quizChecked[key];
            const isCorrect = selected === q.correctIndex;

            return (
              <div
                key={idx}
                className="bg-slate-50/70 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Câu hỏi: {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      disabled={checked}
                      onClick={() => setQuizSelection((prev) => ({ ...prev, [key]: optIdx }))}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                        checked
                          ? optIdx === q.correctIndex
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-medium'
                            : selected === optIdx
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                          : selected === optIdx
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {!checked ? (
                  <button
                    disabled={selected === undefined}
                    onClick={() => setQuizChecked((prev) => ({ ...prev, [key]: true }))}
                    className="px-3 py-1.5 text-xs text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-md transition-colors"
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <span className={isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {isCorrect ? '✓ Đáp án chính xác!' : '✗ Chưa đúng!'}
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {q.guide}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
