import React from 'react';
import {
  ArrowLeft,
  Camera,
  Cpu,
  Grid3X3,
  Orbit,
  Sparkles,
  Wand2,
  Waves
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { FutureLabTabId, SubjectType } from '../../types';
import { NeuralGalaxyTwin3D } from './NeuralGalaxyTwin3D';
import { TextToSimStudio } from './TextToSimStudio';
import { PaperToSimPanel } from './PaperToSimPanel';
import { InfiniteStemCanvas } from './InfiniteStemCanvas';
import { AudioFFT3DLab } from './AudioFFT3DLab';

interface FutureLabWorkspaceProps {
  onBack?: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
}

const LAB_TABS: {
  id: FutureLabTabId;
  titleVi: string;
  titleEn: string;
  badge: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'galaxy3d',
    titleVi: 'Vũ Trụ Tri Thức 3D',
    titleEn: '3D Neural Galaxy',
    badge: '3D Twin',
    icon: Orbit
  },
  {
    id: 'text_to_sim',
    titleVi: 'Sinh Mô Phỏng AI',
    titleEn: 'Text → Simulation',
    badge: 'AI Sim',
    icon: Wand2
  },
  {
    id: 'paper_to_sim',
    titleVi: 'Giấy Nháp → Sim',
    titleEn: 'Paper → Sim Vision',
    badge: 'Vision',
    icon: Camera
  },
  {
    id: 'infinite_canvas',
    titleVi: 'Bảng Vô Cực STEM',
    titleEn: 'Infinite Canvas',
    badge: 'Spatial',
    icon: Grid3X3
  },
  {
    id: 'audio_fft',
    titleVi: 'Sóng Âm FFT 3D',
    titleEn: 'Audio FFT 3D Lab',
    badge: 'WebAudio',
    icon: Waves
  }
];

export const FutureLabWorkspace: React.FC<FutureLabWorkspaceProps> = ({
  onBack,
  onNavigateSubject
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate } = useNavigation();
  const activeTab: FutureLabTabId = location.futureTab || 'galaxy3d';

  const setActiveTab = (tab: FutureLabTabId) => {
    navigate({ subject: 'future_lab', futureTab: tab, tutorOpen: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header Banner */}
      <div className="rounded-md border border-slate-700/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {isEn ? 'Back' : 'Quay lại'}
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                {isEn ? 'Synapse Future Lab · AI & 3D' : 'Phòng Lab Tương Lai · AI & Không Gian 3D'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isEn
                ? 'Next-Gen Interactive STEM Labs'
                : 'Tổ Hợp Thí Nghiệm Tương Lai · AI & WebGL 3D'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              {isEn
                ? 'Switch seamlessly between your 3D Knowledge Galaxy, Text-to-Sim compiler, Paper-to-Sim vision scanner, Infinite STEM Canvas, and Audio-Reactive FFT 3D Lab.'
                : 'Khám phá Vũ trụ Tri thức 3D cá nhân hóa, biến câu chữ & giấy nháp viết tay thành mô phỏng sống động, vẽ Bảng Vô Cực STEM và thí nghiệm sóng âm FFT 3D.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateSubject('spatial_3d')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-emerald-400/50 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-200 text-xs font-bold transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            {isEn ? 'Launch WebAR & Hand 3D' : 'Mở WebAR & Cảm Giác Tay 3D'}
          </button>
        </div>

        {/* Square Tab Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LAB_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded border text-left transition cursor-pointer ${
                  active
                    ? 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-900/40'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-cyan-400'}`} />
                  <span className="text-xs font-bold truncate">
                    {isEn ? tab.titleEn : tab.titleVi}
                  </span>
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Future Lab View */}
      <div>
        {activeTab === 'galaxy3d' && <NeuralGalaxyTwin3D language={language} />}
        {activeTab === 'text_to_sim' && <TextToSimStudio language={language} />}
        {activeTab === 'paper_to_sim' && <PaperToSimPanel language={language} />}
        {activeTab === 'infinite_canvas' && <InfiniteStemCanvas language={language} />}
        {activeTab === 'audio_fft' && <AudioFFT3DLab language={language} />}
      </div>
    </div>
  );
};
