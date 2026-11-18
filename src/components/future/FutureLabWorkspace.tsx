import React from 'react';
import {
  ArrowLeft,
  Building2,
  Camera,
  Cpu,
  Orbit,
  PenTool,
  Sparkles,
  Wand2,
  Waves
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { FutureLabTabId, SubjectType } from '../../types';
import { SynapseV2Studio } from '../synapsev2/SynapseV2Studio';
import { NeuralGalaxyTwin3D } from './NeuralGalaxyTwin3D';
import { TextToSimStudio } from './TextToSimStudio';
import { PaperToSimPanel } from './PaperToSimPanel';
import { AudioFFT3DLab } from './AudioFFT3DLab';

interface FutureLabWorkspaceProps {
  onBack?: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
}

const PRE_TABS: {
  id: FutureLabTabId;
  titleVi: string;
  titleEn: string;
  badge: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'megastructures',
    titleVi: 'Đại công trình tương lai',
    titleEn: 'Futuristic Megastructures',
    badge: '30 3D',
    icon: Building2
  },
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
    id: 'audio_fft',
    titleVi: 'Sóng Âm FFT 3D',
    titleEn: 'Audio FFT 3D Lab',
    badge: 'WebAudio',
    icon: Waves
  }
];

export const FutureLabWorkspace: React.FC<FutureLabWorkspaceProps> = ({
  onBack,
  onNavigateSubject,
  onEarnXP
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate } = useNavigation();
  const rawTab = location.futureTab;
  const activeTab: FutureLabTabId =
    rawTab && rawTab !== 'infinite_canvas' ? rawTab : 'megastructures';

  const isMegastructureStage =
    activeTab === 'megastructures' && location.synapseMode === 'stage';

  const setActiveTab = (tab: FutureLabTabId) => {
    navigate({
      subject: 'synapse_v2',
      futureTab: tab,
      synapseMode: 'catalog',
      tutorOpen: false
    });
  };

  const openMiniScratchpad = () => {
    window.dispatchEvent(new CustomEvent('synapse:open-scratchpad-mini'));
  };

  return (
    <div
      className={
        isMegastructureStage
          ? 'w-full'
          : 'max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5'
      }
    >
      {/* Unified Synapse Pre Header & 5 Crisp Square Tabs (hidden when immersed in full 3D megastructure stage) */}
      {!isMegastructureStage && (
        <div className="sci-frame relative overflow-hidden rounded-md border border-cyan-500/45 bg-gradient-to-br from-slate-950 via-[#0a1632] to-indigo-950 text-white p-5 shadow-[0_20px_60px_-18px_rgba(14,165,233,0.35)]">
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
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-400/45 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5" />
                  {isEn ? 'SYNAPSE PRE · AI & 3D STUDIO' : 'SYNAPSE PRE · ĐẠI CÔNG TRÌNH & PHÒNG LAB AI'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isEn
                  ? 'Synapse Pre — Megastructures & Next-Gen AI 3D Labs'
                  : 'Synapse Pre — Đại Công Trình Tương Lai & Phòng Lab AI 3D'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                {isEn
                  ? 'Explore 30 real-time 3D Futuristic Megastructures, 3D Neural Knowledge Galaxy, Text-to-Sim AI, Paper-to-Sim Vision, and Audio FFT 3D Wave Lab in one unified studio.'
                  : 'Hợp nhất 30 Đại Công Trình Tương Lai WebGL 3D, Vũ trụ Tri thức 3D cá nhân hóa, Sinh Mô Phỏng AI, Quét Giấy Nháp → Sim và Thí nghiệm Sóng Âm FFT 3D trong một không gian thống nhất.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openMiniScratchpad}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded border border-amber-400/50 bg-amber-500/15 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-amber-300" />
                {isEn ? 'Mini Scratchpad' : 'Bảng Nháp Mini'}
              </button>

              <button
                type="button"
                onClick={() => onNavigateSubject('spatial_3d')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-emerald-400/50 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-200 text-xs font-bold transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                {isEn ? 'WebAR & Hand 3D' : 'WebAR & Cảm Giác 3D'}
              </button>
            </div>
          </div>

          {/* 5 Crisp Square Mode Switchers */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {PRE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-ripple="true"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded border text-left transition cursor-pointer ${
                    active
                      ? 'bg-sky-600 border-sky-300 text-white shadow-md shadow-sky-900/45'
                      : 'bg-slate-900/85 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-cyan-400/60'
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
      )}

      {/* Active Synapse Pre Workspace Module */}
      <div>
        {activeTab === 'megastructures' && (
          <SynapseV2Studio
            embeddedInPre
            onBack={onBack}
            onNavigate={onNavigateSubject}
            onEarnXP={onEarnXP}
          />
        )}
        {activeTab === 'galaxy3d' && <NeuralGalaxyTwin3D language={language} />}
        {activeTab === 'text_to_sim' && <TextToSimStudio language={language} />}
        {activeTab === 'paper_to_sim' && <PaperToSimPanel language={language} />}
        {activeTab === 'audio_fft' && <AudioFFT3DLab language={language} />}
      </div>
    </div>
  );
};
