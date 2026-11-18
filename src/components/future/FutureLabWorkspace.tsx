import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Orbit,
  Smartphone,
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
import { SiliconNeuralPlayground } from './SiliconNeuralPlayground';
import { PhoneSensorPhysicsLab } from './PhoneSensorPhysicsLab';
import { DualHandGPUParticleLab } from './DualHandGPUParticleLab';

interface FutureLabWorkspaceProps {
  onBack?: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onEarnXP?: (xp: number) => void;
}

interface PreStudioItem {
  id: FutureLabTabId;
  indexLabel: string;
  titleVi: string;
  titleEn: string;
  metaVi: string;
  metaEn: string;
  descVi: string;
  descEn: string;
  specsVi: string;
  specsEn: string;
  accentBorder: string;
  accentText: string;
  accentGlow: string;
  iconBg: string;
  icon: React.FC<{ className?: string }>;
}

const PRE_STUDIOS: PreStudioItem[] = [
  {
    id: 'megastructures',
    indexLabel: '01',
    titleVi: 'Đại công trình tương lai',
    titleEn: 'Futuristic Megastructures',
    metaVi: '30 Mô hình 3D WebGL · Khám phá Toàn cảnh',
    metaEn: '30 WebGL 3D Models · Fullscreen Stage',
    descVi:
      'Chiêm ngưỡng và vận hành trực tiếp 30 đại công trình khoa học từ Cầu Dyson, Máy gia tốc hạt đến Trạm quỹ đạo với bảng thông số vật lí sống.',
    descEn:
      'Explore and pilot 30 large-scale scientific megastructures from Dyson Swarms to Particle Colliders with live telemetry.',
    specsVi: 'Khung cảnh 3D 60fps · Góc nhìn tự do · Chỉ dẫn trực quan',
    specsEn: '60fps 3D Stage · Free Orbit · Live Parameters',
    accentBorder: 'border-sky-500/45 hover:border-sky-400',
    accentText: 'text-sky-300',
    accentGlow: 'from-sky-500/20 via-cyan-500/10 to-slate-900',
    iconBg: 'bg-sky-500/15 border-sky-400/40 text-sky-300',
    icon: Building2
  },
  {
    id: 'galaxy3d',
    indexLabel: '02',
    titleVi: 'Vũ Trụ Tri Thức 3D',
    titleEn: '3D Neural Galaxy Twin',
    metaVi: 'Bản đồ Tri thức 3D · Hành tinh Trọng tâm',
    metaEn: '3D Knowledge Twin · Orbiting Mastery Nodes',
    descVi:
      'Quan sát toàn bộ năng lực Toán, Vật lí, Tin học dưới dạng thiên hà 3D tương tác để phát hiện lỗ hổng kiến thức và lộ trình bù đắp.',
    descEn:
      'Navigate your Math, Physics, and CS mastery as an interactive 3D constellation revealing weak nodes and learning vectors.',
    specsVi: 'Chòm sao Tri thức · Bộ lọc Môn học · Gợi ý ôn tập',
    specsEn: 'Mastery Orbitals · Subject Filter · Study Nodes',
    accentBorder: 'border-indigo-500/45 hover:border-indigo-400',
    accentText: 'text-indigo-300',
    accentGlow: 'from-indigo-500/20 via-sky-500/10 to-slate-900',
    iconBg: 'bg-indigo-500/15 border-indigo-400/40 text-indigo-300',
    icon: Orbit
  },
  {
    id: 'text_to_sim',
    indexLabel: '03',
    titleVi: 'Sinh Mô Phỏng AI',
    titleEn: 'Text → Simulation Studio',
    metaVi: 'Nhập Đề bài · Tạo Đồ họa Tương tác 60fps',
    metaEn: 'Prompt to Engine · 60fps Interactive Sim',
    descVi:
      'Nhập văn bản đề bài Toán hoặc Vật lí bất kì để AI biên dịch thành mô phỏng chuyển động thực thời kèm thanh trượt thông số.',
    descEn:
      'Type any Math or Physics scenario and compile it into a real-time interactive simulation with dynamic parameter sliders.',
    specsVi: 'Va chạm 1D · Ném xiên · Quang học · Tiếp tuyến đồ thị',
    specsEn: 'Collisions · Projectiles · Wave Optics · Tangents',
    accentBorder: 'border-cyan-500/45 hover:border-cyan-400',
    accentText: 'text-cyan-300',
    accentGlow: 'from-cyan-500/20 via-teal-500/10 to-slate-900',
    iconBg: 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300',
    icon: Wand2
  },
  {
    id: 'paper_to_sim',
    indexLabel: '04',
    titleVi: 'Giấy Nháp → Sim Vision',
    titleEn: 'Paper → Sim Vision',
    metaVi: 'Chụp Vở viết · Dựng Mô hình & Soi lỗi',
    metaEn: 'Notebook Capture · Formula & Error Check',
    descVi:
      'Quét ảnh bài giải viết tay hoặc hình vẽ phác thảo trên giấy nháp để dựng lại mô phỏng kiểm chứng và chỉ rõ dòng biến đổi sai.',
    descEn:
      'Scan handwritten homework or notebook sketches to reconstruct a verifying simulation and pinpoint calculation steps.',
    specsVi: 'Nhận diện công thức · Dựng hình 2D/3D · Gợi ý sửa bài',
    specsEn: 'Handwriting Scan · Live Rebuild · Step Diagnostics',
    accentBorder: 'border-teal-500/45 hover:border-teal-400',
    accentText: 'text-teal-300',
    accentGlow: 'from-teal-500/20 via-emerald-500/10 to-slate-900',
    iconBg: 'bg-teal-500/15 border-teal-400/40 text-teal-300',
    icon: Camera
  },
  {
    id: 'audio_fft',
    indexLabel: '05',
    titleVi: 'Sóng Âm FFT 3D Lab',
    titleEn: 'Audio FFT 3D Lab',
    metaVi: 'Phân tích Phổ WebAudio · Sóng Đứng & Doppler',
    metaEn: 'WebAudio FFT · Standing Waves & Doppler',
    descVi:
      'Thu âm thanh thực từ Micro hoặc bộ phát chuẩn để quan sát phổ tần số FFT 3D, cộng hưởng sóng dừng và hiệu ứng Doppler theo thời gian thực.',
    descEn:
      'Capture live microphone audio or tone generators to visualize 3D FFT spectra, standing wave harmonics, and Doppler shifts.',
    specsVi: 'Phổ tần 3D trực tiếp · Bộ phát Hz · Giao thoa sóng',
    specsEn: 'Live Mic FFT · Precision Tone Synth · Interference',
    accentBorder: 'border-amber-500/45 hover:border-amber-400',
    accentText: 'text-amber-300',
    accentGlow: 'from-amber-500/20 via-orange-500/10 to-slate-900',
    iconBg: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
    icon: Waves
  },
  {
    id: 'silicon_neural',
    indexLabel: '06',
    titleVi: 'Mạch Logic & Neural Net',
    titleEn: 'Silicon & Neural Playground',
    metaVi: 'Cổng Logic CPU · Mạng Nơ-ron Từng Lớp',
    metaEn: 'Digital Gates · Layer Activation Lab',
    descVi:
      'Lắp ghép các cổng logic số AND/OR/XOR, mạch cộng nhị phân và quan sát trực tiếp dòng truyền trọng số bên trong mạng nơ-ron đa tầng.',
    descEn:
      'Wire digital logic gates, binary adders, and watch live forward-pass activations propagate across neural layers.',
    specsVi: 'Cổng số thời gian thực · Lan truyền Neural · Bảng chân trị',
    specsEn: 'Live Gate Sim · Weight Propagation · Truth Table',
    accentBorder: 'border-violet-500/45 hover:border-violet-400',
    accentText: 'text-violet-300',
    accentGlow: 'from-violet-500/20 via-indigo-500/10 to-slate-900',
    iconBg: 'bg-violet-500/15 border-violet-400/40 text-violet-300',
    icon: Cpu
  },
  {
    id: 'phone_sensor_lab',
    indexLabel: '07',
    titleVi: 'Cảm biến Điện thoại QR',
    titleEn: 'Phone Sensor QR Lab',
    metaVi: 'Ghép nối WebSocket · Dao động ký Thực tế',
    metaEn: 'Live QR WebSocket · Dual-Trace Oscilloscope',
    descVi:
      'Quét mã QR biến điện thoại thành cảm biến gia tốc & con quay hồi chuyển thật, đối chiếu trực tiếp với đường cong SHM lí thuyết và xuất CSV.',
    descEn:
      'Scan a QR code to turn any smartphone into a live accelerometer/gyroscope streaming against theoretical SHM curves.',
    specsVi: 'Gia tốc kế & Con quay · Sai số RMSE · Xuất file CSV',
    specsEn: 'Accelerometer & Gyro · Live RMSE Fit · CSV Export',
    accentBorder: 'border-emerald-500/45 hover:border-emerald-400',
    accentText: 'text-emerald-300',
    accentGlow: 'from-emerald-500/20 via-teal-500/10 to-slate-900',
    iconBg: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
    icon: Smartphone
  },
  {
    id: 'dual_hand_sandbox',
    indexLabel: '08',
    titleVi: 'Trường Hạt GPU 2 Tay',
    titleEn: 'Dual-Hand 28K GPU Field',
    metaVi: 'Shader 28.000 Hạt · Điều khiển 2 Bàn tay',
    metaEn: '28K GPU Particle Shader · Dual-Hand Tracking',
    descVi:
      'Dùng hai bàn tay trước Webcam hoặc chuột điều khiển đồng thời tới 28.000 hạt trong 4 trường vật lí: Hấp dẫn nhị phân, Lorentz, Sóng & Rutherford.',
    descEn:
      'Drive up to 28,000 GPU particles with two hands or mouse poles across Binary Gravity, Lorentz, Wave Interference & Rutherford.',
    specsVi: 'GLSL Shader mượt mà · 4 Trường vật lí · Webcam & Chuột',
    specsEn: 'GLSL Particle Field · 4 Physics Modes · Dual Pole',
    accentBorder: 'border-blue-500/45 hover:border-blue-400',
    accentText: 'text-blue-300',
    accentGlow: 'from-blue-500/20 via-cyan-500/10 to-slate-900',
    iconBg: 'bg-blue-500/15 border-blue-400/40 text-blue-300',
    icon: Sparkles
  }
];

const ModuleAnimatedPreview: React.FC<{ id: FutureLabTabId }> = ({ id }) => {
  switch (id) {
    case 'megastructures':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          <defs>
            <linearGradient id="megaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <g className="animate-orbit-slow" style={{ transformOrigin: '140px 43px' }}>
            <ellipse cx="140" cy="43" rx="68" ry="20" fill="none" stroke="url(#megaGrad)" strokeWidth="1.5" strokeDasharray="6 4" />
            <ellipse cx="140" cy="43" rx="46" ry="30" fill="none" stroke="#818cf8" strokeOpacity="0.55" strokeWidth="1.2" transform="rotate(28 140 43)" />
          </g>
          <polygon points="140,20 160,31 160,55 140,66 120,55 120,31" fill="#0ea5e9" fillOpacity="0.16" stroke="#38bdf8" strokeWidth="1.8" className="pre-float-slow" />
          <line x1="140" y1="20" x2="140" y2="66" stroke="#7dd3fc" strokeOpacity="0.65" strokeWidth="1" />
          <line x1="120" y1="31" x2="160" y2="55" stroke="#7dd3fc" strokeOpacity="0.5" strokeWidth="1" />
          <circle cx="140" cy="43" r="4" fill="#38bdf8" />
        </svg>
      );

    case 'galaxy3d':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          <path
            d="M42 54 L96 24 L148 50 L204 20 L244 46"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.6"
            className="animate-electric-flow"
          />
          <path
            d="M42 54 L108 66 L148 50 L192 66 L244 46"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.55"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          {[
            [42, 54, 4, '#38bdf8'],
            [96, 24, 5.5, '#818cf8'],
            [148, 50, 6.5, '#34d399'],
            [204, 20, 5, '#38bdf8'],
            [108, 66, 3.5, '#a5b4fc'],
            [192, 66, 3.5, '#7dd3fc'],
            [244, 46, 4.5, '#818cf8']
          ].map(([cx, cy, r, fill], idx) => (
            <circle key={idx} cx={Number(cx)} cy={Number(cy)} r={Number(r)} fill={String(fill)} fillOpacity="0.88" className="pre-float-slow" />
          ))}
        </svg>
      );

    case 'text_to_sim':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          <rect x="26" y="18" width="64" height="50" rx="4" fill="#0f172a" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.2" />
          <line x1="36" y1="30" x2="78" y2="30" stroke="#67e8f9" strokeWidth="2" />
          <line x1="36" y1="42" x2="70" y2="42" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="2" />
          <line x1="36" y1="54" x2="62" y2="54" stroke="#2dd4bf" strokeOpacity="0.7" strokeWidth="2" />
          <path d="M98 43 L134 43" stroke="#22d3ee" strokeWidth="1.8" className="animate-electric-flow-fast" />
          <polygon points="134,38 143,43 134,48" fill="#22d3ee" />
          <path
            d="M152 60 Q186 12 222 48 T262 34"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="2.2"
            className="sci-oscilloscope-path"
          />
          <circle cx="192" cy="31" r="4.5" fill="#22d3ee" className="pre-float-slow" />
        </svg>
      );

    case 'paper_to_sim':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          <rect x="44" y="14" width="192" height="58" rx="4" fill="#0f172a" fillOpacity="0.7" stroke="#2dd4bf" strokeOpacity="0.45" strokeWidth="1.2" />
          <path d="M68 56 Q112 20 156 54 T218 28" fill="none" stroke="#5eead4" strokeWidth="1.8" strokeDasharray="5 3" />
          <line x1="56" y1="24" x2="96" y2="24" stroke="#99f6e4" strokeOpacity="0.75" strokeWidth="2" />
          <rect x="44" y="14" width="192" height="3" fill="#2dd4bf" fillOpacity="0.75" className="animate-matrix-sweep" />
          <path d="M44 26 L44 14 L56 14 M224 14 L236 14 L236 26 M44 60 L44 72 L56 72 M224 72 L236 72 L236 60" fill="none" stroke="#14b8a6" strokeWidth="2" />
        </svg>
      );

    case 'audio_fft':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          {[40, 62, 84, 106, 128, 150, 172, 194, 216, 238].map((x, idx) => {
            const heights = [24, 42, 54, 34, 60, 48, 30, 56, 40, 26];
            const cls = idx % 4 === 0 ? 'sci-meter-1' : idx % 4 === 1 ? 'sci-meter-2' : idx % 4 === 2 ? 'sci-meter-3' : 'sci-meter-4';
            const h = heights[idx];
            return (
              <rect
                key={x}
                x={x - 6}
                y={72 - h}
                width="10"
                height={h}
                rx="2"
                fill={idx % 2 === 0 ? '#f59e0b' : '#fbbf24'}
                fillOpacity="0.85"
                className={cls}
              />
            );
          })}
          <line x1="28" y1="72" x2="252" y2="72" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.2" />
        </svg>
      );

    case 'silicon_neural':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          {[24, 44, 64].map((y1, i) =>
            [28, 58].map((y2, j) => (
              <line
                key={`${i}-${j}`}
                x1="72"
                y1={y1}
                x2="146"
                y2={y2}
                stroke="#a78bfa"
                strokeOpacity="0.55"
                strokeWidth="1.4"
                className="animate-electric-flow"
              />
            ))
          )}
          {[28, 58].map((y2, j) => (
            <line
              key={`out-${j}`}
              x1="146"
              y1={y2}
              x2="214"
              y2="43"
              stroke="#38bdf8"
              strokeWidth="1.6"
              className="animate-electric-flow-fast"
            />
          ))}
          {[24, 44, 64].map((y) => (
            <rect key={`in-${y}`} x="60" y={y - 6} width="12" height="12" rx="2" fill="#8b5cf6" fillOpacity="0.85" stroke="#ddd6fe" strokeWidth="1" />
          ))}
          {[28, 58].map((y) => (
            <rect key={`mid-${y}`} x="140" y={y - 7} width="14" height="14" rx="2" fill="#6366f1" fillOpacity="0.85" stroke="#c7d2fe" strokeWidth="1" />
          ))}
          <rect x="208" y="35" width="16" height="16" rx="2" fill="#38bdf8" fillOpacity="0.9" stroke="#e0f2fe" strokeWidth="1.2" />
        </svg>
      );

    case 'phone_sensor_lab':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          <line x1="24" y1="43" x2="256" y2="43" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <path
            d="M24 43 C48 12, 72 12, 96 43 C120 74, 144 74, 168 43 C192 12, 216 12, 240 43 L256 43"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.2"
            className="sci-oscilloscope-path"
          />
          <path
            d="M24 46 C48 22, 72 18, 96 44 C120 68, 144 65, 168 42 C192 19, 216 20, 240 45"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.75"
            strokeWidth="1.6"
            strokeDasharray="5 3"
          />
        </svg>
      );

    case 'dual_hand_sandbox':
      return (
        <svg viewBox="0 0 280 86" className="w-full h-20 opacity-90" aria-hidden="true">
          <g className="animate-orbit-slow" style={{ transformOrigin: '92px 43px' }}>
            <circle cx="92" cy="43" r="24" fill="none" stroke="#38bdf8" strokeOpacity="0.65" strokeWidth="1.3" strokeDasharray="4 4" />
            <circle cx="116" cy="43" r="2.8" fill="#7dd3fc" />
            <circle cx="68" cy="43" r="2.5" fill="#2dd4bf" />
          </g>
          <g className="animate-orbit-slow" style={{ transformOrigin: '188px 43px' }}>
            <circle cx="188" cy="43" r="24" fill="none" stroke="#60a5fa" strokeOpacity="0.65" strokeWidth="1.3" strokeDasharray="4 4" />
            <circle cx="188" cy="19" r="2.8" fill="#93c5fd" />
            <circle cx="188" cy="67" r="2.5" fill="#38bdf8" />
          </g>
          <circle cx="92" cy="43" r="6" fill="#0ea5e9" fillOpacity="0.8" />
          <circle cx="188" cy="43" r="6" fill="#6366f1" fillOpacity="0.8" />
          <path d="M98 43 Q140 24 182 43 Q140 62 98 43" fill="none" stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="1.2" className="animate-electric-flow" />
        </svg>
      );
  }
};

export const FutureLabWorkspace: React.FC<FutureLabWorkspaceProps> = ({
  onBack,
  onNavigateSubject,
  onEarnXP
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate } = useNavigation();

  const rawTab = location.futureTab;
  const activeView: 'hub' | FutureLabTabId =
    rawTab && rawTab !== 'infinite_canvas' ? rawTab : 'hub';

  const isMegastructureStage =
    activeView === 'megastructures' && location.synapseMode === 'stage';

  const openModulePage = (tab: FutureLabTabId) => {
    navigate({
      subject: 'synapse_v2',
      futureTab: tab,
      synapseMode: 'catalog',
      tutorOpen: false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToHub = () => {
    navigate({
      subject: 'synapse_v2',
      futureTab: 'hub',
      synapseMode: 'catalog',
      tutorOpen: false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentStudioIndex = PRE_STUDIOS.findIndex((s) => s.id === activeView);
  const currentStudio = currentStudioIndex >= 0 ? PRE_STUDIOS[currentStudioIndex] : null;
  const prevStudio =
    currentStudioIndex > 0 ? PRE_STUDIOS[currentStudioIndex - 1] : PRE_STUDIOS[PRE_STUDIOS.length - 1];
  const nextStudio =
    currentStudioIndex >= 0 && currentStudioIndex < PRE_STUDIOS.length - 1
      ? PRE_STUDIOS[currentStudioIndex + 1]
      : PRE_STUDIOS[0];

  /* Fullscreen 3D Megastructure stage leaves full canvas unobstructed */
  if (isMegastructureStage) {
    return (
      <div className="w-full">
        <SynapseV2Studio
          embeddedInPre
          onBack={onBack}
          onNavigate={onNavigateSubject}
          onEarnXP={onEarnXP}
        />
      </div>
    );
  }

  /* ==================== VIEW 1: SYNAPSE PRE HUB (2 FRAMES PER ROW) ==================== */
  if (activeView === 'hub') {
    return (
      <div className="synapse-pre-scope max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pre-page-enter">
        {/* Hero Frame (Mini Scratchpad button removed as requested) */}
        <div className="sci-frame pre-scan-beam relative overflow-hidden rounded-md border border-cyan-500/45 bg-gradient-to-br from-slate-950 via-[#0a1632] to-indigo-950 text-white p-5 sm:p-6 shadow-[0_20px_60px_-18px_rgba(14,165,233,0.32)]">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {onBack && (
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={onBack}
                    className="pre-btn-kinetic inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-500 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back' : 'Quay lại'}</span>
                  </button>
                )}
                <span className="inline-flex items-center gap-1.5 text-cyan-300 font-semibold tracking-wide">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {isEn
                      ? 'Synapse Pre · 08 Dedicated AI & 3D Studios'
                      : 'Synapse Pre · 08 Không Gian Độc Lập AI & 3D'}
                  </span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {isEn
                  ? 'Synapse Pre — Megastructures & Next-Gen AI 3D Labs'
                  : 'Synapse Pre — Đại Công Trình Tương Lai & Phòng Lab AI 3D'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isEn
                  ? 'Select any studio card below to launch its dedicated full-page interactive laboratory.'
                  : 'Chọn bất kỳ khung không gian nào bên dưới để mở trang làm việc chuyên sâu riêng biệt với đồ họa thời gian thực.'}
              </p>
            </div>

            <div className="flex items-center shrink-0">
              <button
                type="button"
                data-ripple="true"
                onClick={() => onNavigateSubject('spatial_3d')}
                className="pre-btn-kinetic inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-emerald-400/60 bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-200 text-xs sm:text-sm font-bold cursor-pointer whitespace-nowrap shadow-lg shadow-emerald-950/40"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>{isEn ? 'WebAR & Hand 3D' : 'WebAR & Cảm Giác 3D'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
              </button>
            </div>
          </div>
        </div>

        {/* 2 Square Frames Per Row (4 Balanced Rows x 2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRE_STUDIOS.map((studio, index) => {
            const Icon = studio.icon;
            return (
              <button
                key={studio.id}
                type="button"
                data-ripple="true"
                onClick={() => openModulePage(studio.id)}
                style={{ animationDelay: `${index * 45}ms` }}
                className={`pre-card-shell pre-card-reveal group text-left rounded-md border bg-slate-950/95 dark:bg-slate-950 p-5 sm:p-6 flex flex-col justify-between gap-4 cursor-pointer text-white shadow-lg ${studio.accentBorder}`}
              >
                {/* Live Animated Preview Canvas Strip */}
                <div
                  className={`relative rounded-md border border-slate-800/90 bg-gradient-to-br ${studio.accentGlow} px-4 py-2.5 overflow-hidden`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className={`font-mono font-bold ${studio.accentText}`}>
                      {studio.indexLabel}
                    </span>
                    <span className="truncate ml-2">
                      {isEn ? studio.metaEn : studio.metaVi}
                    </span>
                  </div>
                  <ModuleAnimatedPreview id={studio.id} />
                </div>

                {/* Title, Narrative & Typographic Specs */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${studio.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                        {isEn ? studio.titleEn : studio.titleVi}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1 line-clamp-2">
                        {isEn ? studio.descEn : studio.descVi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Specs + Dynamic Action Trigger */}
                <div className="pt-3 border-t border-slate-800/90 flex items-center justify-between gap-3">
                  <span className="text-[11px] sm:text-xs text-slate-400 truncate">
                    {isEn ? studio.specsEn : studio.specsVi}
                  </span>
                  <span
                    className={`pre-btn-kinetic inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700/90 bg-slate-900 group-hover:bg-sky-600 group-hover:border-sky-400 group-hover:text-white text-xs font-bold shrink-0 transition-colors ${studio.accentText}`}
                  >
                    <span>{isEn ? 'Open Studio' : 'Mở Trang Riêng'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ==================== VIEW 2: DEDICATED STANDALONE PAGE ==================== */
  const ActiveIcon = currentStudio?.icon || Cpu;

  return (
    <div key={activeView} className="synapse-pre-scope max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5 pre-page-enter">
      {/* Dedicated Standalone Module Header (NO Mini Scratchpad button) */}
      <div className="sci-frame pre-scan-beam relative overflow-hidden rounded-md border border-cyan-500/45 bg-gradient-to-r from-slate-950 via-[#0a1632] to-indigo-950 text-white px-4 py-3.5 sm:px-5 sm:py-4 shadow-[0_14px_40px_-16px_rgba(14,165,233,0.35)]">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <button
              type="button"
              data-ripple="true"
              onClick={backToHub}
              className="pre-btn-kinetic inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-cyan-400/60 text-xs font-bold text-slate-100 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEn ? 'All 8 Studios' : '8 Không gian Synapse Pre'}</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 ${
                  currentStudio?.iconBg || 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                }`}
              >
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                  {currentStudio
                    ? `${currentStudio.indexLabel}. ${isEn ? currentStudio.titleEn : currentStudio.titleVi}`
                    : 'Synapse Pre Studio'}
                </h1>
                {currentStudio && (
                  <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                    {isEn ? currentStudio.metaEn : currentStudio.metaVi}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(prevStudio.id)}
              className="pre-btn-kinetic inline-flex items-center gap-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-cyan-400/50 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? prevStudio.titleEn : prevStudio.titleVi}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Prev' : 'Trước'}</span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(nextStudio.id)}
              className="pre-btn-kinetic inline-flex items-center gap-1 px-2.5 py-2 rounded-md border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-cyan-400/50 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? nextStudio.titleEn : nextStudio.titleVi}
            >
              <span className="hidden sm:inline">{isEn ? 'Next' : 'Tiếp'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => onNavigateSubject('spatial_3d')}
              className="pre-btn-kinetic inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-emerald-400/55 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-200 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isEn ? 'WebAR & Hand 3D' : 'WebAR & Cảm Giác 3D'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Module Content Canvas */}
      <div>
        {activeView === 'megastructures' && (
          <SynapseV2Studio
            embeddedInPre
            onBack={backToHub}
            onNavigate={onNavigateSubject}
            onEarnXP={onEarnXP}
          />
        )}
        {activeView === 'galaxy3d' && <NeuralGalaxyTwin3D language={language} />}
        {activeView === 'text_to_sim' && <TextToSimStudio language={language} />}
        {activeView === 'paper_to_sim' && <PaperToSimPanel language={language} />}
        {activeView === 'audio_fft' && <AudioFFT3DLab language={language} />}
        {activeView === 'silicon_neural' && <SiliconNeuralPlayground />}
        {activeView === 'phone_sensor_lab' && (
          <PhoneSensorPhysicsLab initialRoomCode={location.sensorRoomCode} />
        )}
        {activeView === 'dual_hand_sandbox' && <DualHandGPUParticleLab />}
      </div>
    </div>
  );
};
