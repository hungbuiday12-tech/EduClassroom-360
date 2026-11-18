import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Box,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Crosshair,
  Gauge,
  Maximize2,
  Minimize2,
  Orbit,
  Rocket,
  Smartphone,
  Sparkles,
  Wand2,
  Waves
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  BACKGROUND_STYLE_OPTIONS,
  CREATURE_THEME_OPTIONS,
  useBackgroundTheme
} from '../../context/BackgroundContext';
import { FutureLabTabId, SubjectType } from '../../types';
import { SynapseV2Studio } from '../synapsev2/SynapseV2Studio';
import { NeuralGalaxyTwin3D } from './NeuralGalaxyTwin3D';
import { TextToSimStudio } from './TextToSimStudio';
import { PaperToSimPanel } from './PaperToSimPanel';
import { AudioFFT3DLab } from './AudioFFT3DLab';
import { SiliconNeuralPlayground } from './SiliconNeuralPlayground';
import { PhoneSensorPhysicsLab } from './PhoneSensorPhysicsLab';
import { DualHandGPUParticleLab } from './DualHandGPUParticleLab';
import { CannonBallistics3DLab } from './CannonBallistics3DLab';
import { RocketLaunch3DLab } from './RocketLaunch3DLab';
import { JetPropulsion3DLab } from './JetPropulsion3DLab';
import { FourDLecture3DLab } from './FourDLecture3DLab';
import { RoboticsIK3DLab } from './RoboticsIK3DLab';
import { PreStudioDiagramPreview } from './PreStudioDiagramPreview';

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
  accentHex: string;
  secondaryHex: string;
  accentTextClass: string;
  iconBgClass: string;
  btnGradientClass: string;
  icon: React.FC<{ className?: string }>;
}

const PRE_STUDIOS: PreStudioItem[] = [
  {
    id: 'rocket_launch_3d',
    indexLabel: '01',
    titleVi: 'Phóng Tên Lửa Đa Tầng & Quỹ Đạo 3D',
    titleEn: 'Multi-Stage Rocket Launch & Orbit 3D',
    metaVi: 'Động lực học Khối lượng Biến thiên 3D · Tách Tầng & Đưa Vệ tinh lên Quỹ đạo',
    metaEn: '3D Variable-Mass Propulsion · Max-Q, MECO & Fairing Jettison',
    descVi:
      'Vận hành quy trình phóng tên lửa 2 tầng theo phương trình Tsiolkovsky: đánh lửa, vượt Max-Q, tắt động cơ tầng 1 (MECO), tách tầng đẩy, bung chóp bảo vệ và triển khai vệ tinh quỹ đạo với mặt cắt thùng nhiên liệu LOX/RP-1 trực quan.',
    descEn:
      'Command a two-stage orbital launch following Tsiolkovsky rocket dynamics: liftoff, Max-Q, MECO stage separation, fairing jettison, and satellite deployment with cutaway LOX/RP-1 propellant tanks.',
    specsVi: 'Mặt cắt bình nhiên liệu 3D · 4 Góc Camera · Sơ đồ Đếm ngược T+',
    specsEn: 'Cutaway Tank Telemetry · 4 Chase Cameras · T+ Mission Sequence',
    accentHex: '#f97316',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-orange-600 dark:text-orange-300',
    iconBgClass: 'bg-orange-500/15 border-orange-500/40 text-orange-600 dark:text-orange-300',
    btnGradientClass: 'from-orange-500 via-amber-500 to-sky-500 text-slate-950',
    icon: Rocket
  },
  {
    id: 'jet_engine_3d',
    indexLabel: '02',
    titleVi: 'Động Cơ Phản Lực Tua-bin 3D (Brayton)',
    titleEn: '3D Turbofan Jet Propulsion & Brayton Cycle',
    metaVi: 'Mô hình 3D Exploded View · Quạt Nạp, Máy Nén, Buồng Đốt & Mach Shock',
    metaEn: '3D Exploded Cutaway · Fan, Compressor, Combustor & Afterburner',
    descVi:
      'Khám phá nguyên lí vận hành động cơ phản lực hai luồng với chế độ tách lớp trục 0–100%, luồng hạt khí động học phân màu theo nhiệt độ, kim cương xung kích siêu âm và thanh kiểm tra 5 tầng chu trình nhiệt động Brayton.',
    descEn:
      'Inspect a high-bypass turbofan engine with an interactive 0–100% axial exploded view, thermal airflow particles, supersonic Mach shock diamonds, and a 5-stage Brayton cycle inspector.',
    specsVi: 'Tách lớp Exploded View 3D · Tăng áp Afterburner · WebAudio Tua-bin',
    specsEn: 'Axial Exploded View · Afterburner Mode · Turbine Synth Audio',
    accentHex: '#06b6d4',
    secondaryHex: '#f59e0b',
    accentTextClass: 'text-cyan-600 dark:text-cyan-300',
    iconBgClass: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300',
    btnGradientClass: 'from-cyan-500 via-sky-500 to-amber-400 text-slate-950',
    icon: Gauge
  },
  {
    id: 'four_d_lectures',
    indexLabel: '03',
    titleVi: 'Bài Giảng Không Gian 4D & Tương Đối',
    titleEn: '4D Space, Hypersphere & Spacetime Lectures',
    metaVi: 'Hình học 4D R⁴ → R³ · Tesseract, S³, Nón Ánh Sáng Minkowski & Klein',
    metaEn: '4D-to-3D Stereographic Projection · Tesseract, Hopf S³ & Spacetime',
    descVi:
      'Trực quan hóa toán học và vật lí bậc 4D: xoay khối siêu lập phương Tesseract trên mặt phẳng XW kèm lát cắt siêu phẳng w, quan sát thớ Hopf trên siêu cầu S³, kéo tốc độ tương đối β=v/c làm biến dạng nón ánh sáng Minkowski và dò điểm trên chai Klein.',
    descEn:
      'Master 4D geometry & relativity: rotate a 4D Tesseract in XW space with live w-hyperplane slicing, inspect S³ Hopf fibration rings, tilt Minkowski spacetime worldlines with β=v/c, and trace a 4D Klein bottle.',
    specsVi: '4 Mô-đun Bài giảng 4D · Điều khiển góc XW & β=v/c · Thuyết minh từng bước',
    specsEn: '4 Interactive 4D Modules · XW & Lorentz Controls · Guided Lectures',
    accentHex: '#a855f7',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-purple-600 dark:text-purple-300',
    iconBgClass: 'bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-300',
    btnGradientClass: 'from-purple-500 via-violet-500 to-cyan-400 text-white',
    icon: Box
  },
  {
    id: 'robotics_ik_3d',
    indexLabel: '04',
    titleVi: 'Cánh Tay Robot 6-DOF & Động Học Ngược 3D',
    titleEn: '6-DOF Robot Arm & 3D Inverse Kinematics',
    metaVi: 'Động học Robot 3D · Giải IK Thời gian thực, Vùng Khả dụng & Quỹ đạo Laser',
    metaEn: '3D Robotics Kinematics · Live IK Solver, Workspace Dome & Laser Trail',
    descVi:
      'Điều khiển cánh tay robot công nghiệp 6 bậc tự do bám đuổi mục tiêu trong không gian (X, Y, Z) bằng bộ giải động học ngược thời gian thực. Bật chế độ tuần tra tự động, vòm giới hạn tầm với và kẹp từ tính.',
    descEn:
      'Command a 6-DOF industrial robotic manipulator chasing 3D target coordinates in real time. Toggle Auto Patrol trajectories, spherical reachability dome, magnetic end-effector gripper, and laser path.',
    specsVi: 'Giải IK 6 khớp 60fps · Vòm Workspace 3D · Đo sai số mục tiêu mm',
    specsEn: 'Real-Time 6-Joint IK · 3D Reachability Dome · Precision Telemetry',
    accentHex: '#10b981',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-emerald-600 dark:text-emerald-300',
    iconBgClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300',
    btnGradientClass: 'from-emerald-400 via-teal-400 to-sky-400 text-slate-950',
    icon: Bot
  },
  {
    id: 'cannon_ballistics_3d',
    indexLabel: '05',
    titleVi: 'Quỹ Đạo Đường Bay Bắn Pháo 3D',
    titleEn: '3D Artillery Ballistic Trajectory',
    metaVi: 'Động lực học 3D WebGL · Đạn đạo có Lực cản & Gió ngang',
    metaEn: 'WebGL 3D Ballistics · Drag, Crosswind & Vacuum Comparison',
    descVi:
      'Vận hành khẩu đại bác 3D với hệ thống ngắm góc ngẩng θ, xoay phương vị φ, điều chỉnh sơ tốc đầu nòng v₀, lực cản không khí và gió ngang. Đối chiếu parabol chân không lý tưởng và bắn hạ mục tiêu trên trường thử 3D.',
    descEn:
      'Aim a composite 3D artillery cannon across pitch θ, azimuth yaw φ, muzzle velocity v₀, air drag, and crosswind. Compare live aerodynamic arcs against ideal vacuum parabolas and strike targets.',
    specsVi: 'Pháo 3D giật lùi · So sánh Chân không / Lực cản · Đạn bay 60fps',
    specsEn: 'Recoil Mechanics · Vacuum vs Drag Arcs · Target Scoring',
    accentHex: '#f59e0b',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-amber-600 dark:text-amber-300',
    iconBgClass: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300',
    btnGradientClass: 'from-amber-500 via-orange-500 to-sky-500 text-slate-950',
    icon: Crosshair
  },
  {
    id: 'megastructures',
    indexLabel: '06',
    titleVi: 'Đại công trình tương lai',
    titleEn: 'Futuristic Megastructures',
    metaVi: '30 Mô hình 3D WebGL · Không gian Khám phá Toàn cảnh',
    metaEn: '30 WebGL 3D Models · Fullscreen Observatory Stage',
    descVi:
      'Chiêm ngưỡng và vận hành trực tiếp 30 đại công trình khoa học kỳ vĩ từ Cầu Dyson thu năng lượng sao, Máy gia tốc hạt LHC, Kính thiên văn James Webb đến Trạm quỹ đạo với chế độ tách lớp cơ khí và thông số vật lí sống động.',
    descEn:
      'Explore and pilot 30 large-scale scientific megastructures from Dyson Swarms and Particle Colliders to Orbital Habitats with exploded cutaways and live telemetry.',
    specsVi: 'Khung cảnh 3D 60fps · Tách lớp trực quan · Chỉ dẫn thông số',
    specsEn: '60fps 3D Stage · Exploded Cutaway · Live Telemetry',
    accentHex: '#0ea5e9',
    secondaryHex: '#2dd4bf',
    accentTextClass: 'text-sky-600 dark:text-sky-300',
    iconBgClass: 'bg-sky-500/15 border-sky-500/40 text-sky-600 dark:text-sky-300',
    btnGradientClass: 'from-sky-500 via-cyan-500 to-teal-500 text-slate-950',
    icon: Building2
  },
  {
    id: 'galaxy3d',
    indexLabel: '07',
    titleVi: 'Vũ Trụ Tri Thức 3D',
    titleEn: '3D Neural Galaxy Twin',
    metaVi: 'Bản đồ Tri thức 3D · Hành tinh Trọng tâm & Chòm sao',
    metaEn: '3D Knowledge Twin · Orbiting Mastery Nodes',
    descVi:
      'Quan sát toàn bộ năng lực Toán, Vật lí và Tin học dưới dạng thiên hà 3D tương tác nhiều tầng quỹ đạo. Hệ thống đánh dấu các hành tinh kiến thức vững vàng, phát hiện lỗ hổng cần ôn tập và định hướng lộ trình bứt phá.',
    descEn:
      'Navigate your Math, Physics, and CS mastery as an interactive 3D orbital galaxy that highlights strong foundations, weak constellations, and targeted study paths.',
    specsVi: 'Thiên hà 3 Môn học · Bộ lọc quỹ đạo · Gợi ý ôn tập cá nhân',
    specsEn: '3-Subject Orbitals · Constellation Filter · Smart Revision',
    accentHex: '#6366f1',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-indigo-600 dark:text-indigo-300',
    iconBgClass: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-300',
    btnGradientClass: 'from-indigo-500 via-blue-500 to-cyan-400 text-white',
    icon: Orbit
  },
  {
    id: 'text_to_sim',
    indexLabel: '08',
    titleVi: 'Sinh Mô Phỏng 3D AI',
    titleEn: 'Text → 3D Simulation Studio',
    metaVi: 'Nhập Đề bài · Biên dịch Sân khấu WebGL 3D Tương tác 60fps',
    metaEn: 'Prompt to Engine · Interactive 3D WebGL Physics & Math',
    descVi:
      'Nhập bất kỳ mô tả đề bài Toán học hay Vật lí nào bằng ngôn ngữ tự nhiên để AI biên dịch trực tiếp thành mô hình 3D WebGL có thể xoay góc nhìn, bật khung dây, đổi tốc độ 0.5x/1x/2x và chỉnh tham số theo thời gian thực.',
    descEn:
      'Type any Math or Physics problem statement and watch AI compile it into a live 3D WebGL simulation with orbital camera controls, wireframe inspection, and tunable parameters.',
    specsVi: 'Engine 3D WebGL · Va chạm, Ném xiên, Sóng & Hình khối · Xoay Camera 360°',
    specsEn: '3D WebGL Engine · Wireframe Mode · OrbitControls & Speed',
    accentHex: '#06b6d4',
    secondaryHex: '#10b981',
    accentTextClass: 'text-cyan-600 dark:text-cyan-300',
    iconBgClass: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300',
    btnGradientClass: 'from-cyan-500 via-teal-400 to-emerald-400 text-slate-950',
    icon: Wand2
  },
  {
    id: 'paper_to_sim',
    indexLabel: '09',
    titleVi: 'Giấy Nháp → 3D Sim Vision',
    titleEn: 'Paper → 3D Sim Vision',
    metaVi: 'Chụp Vở viết · Dựng Mô hình WebGL 3D & Chẩn đoán từng bước',
    metaEn: 'Notebook Capture · 3D WebGL Reconstruction & Step Diagnostics',
    descVi:
      'Quét ảnh bài giải viết tay hoặc hình vẽ phác thảo trên giấy nháp để AI dựng ngay thành vật thể và chuyển động 3D WebGL kiểm chứng trên màn hình, đồng thời rà soát từng dòng biến đổi đại số hoặc định luật vật lí.',
    descEn:
      'Scan handwritten homework or notebook diagrams to reconstruct a live 3D WebGL verifying simulation and pinpoint exact algebraic or physical transformation steps.',
    specsVi: 'Vision AI · Dựng mô hình 3D WebGL · Kiểm tra từng bước giải',
    specsEn: 'Handwriting Vision · 3D Reconstruction · Step Check',
    accentHex: '#14b8a6',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-teal-600 dark:text-teal-300',
    iconBgClass: 'bg-teal-500/15 border-teal-500/40 text-teal-600 dark:text-teal-300',
    btnGradientClass: 'from-teal-400 via-emerald-400 to-sky-400 text-slate-950',
    icon: Camera
  },
  {
    id: 'audio_fft',
    indexLabel: '10',
    titleVi: 'Sóng Âm FFT 3D Lab',
    titleEn: 'Audio FFT 3D Lab',
    metaVi: 'Phân tích Phổ WebAudio · Sóng Đứng 3D & Hiệu ứng Doppler',
    metaEn: 'WebAudio 3D FFT · Standing Waves & Doppler Shifts',
    descVi:
      'Thu tín hiệu âm thanh thực từ micro hoặc sử dụng bộ phát tần số chuẩn để quan sát phổ biến đổi Fourier FFT 3D, cộng hưởng sóng dừng trên dây và hiện tượng dịch chuyển tần số Doppler theo thời gian thực.',
    descEn:
      'Capture live microphone input or precision tone synthesizers to inspect 3D Fast Fourier Transform spectra, harmonic standing waves, and Doppler shifts.',
    specsVi: 'Phổ tần 3D trực tiếp · Bộ phát Hz chuẩn · Giao thoa sóng âm',
    specsEn: 'Live Mic FFT · Precision Tone Synth · Acoustic Interference',
    accentHex: '#f59e0b',
    secondaryHex: '#f97316',
    accentTextClass: 'text-amber-600 dark:text-amber-300',
    iconBgClass: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300',
    btnGradientClass: 'from-amber-400 via-orange-400 to-rose-400 text-slate-950',
    icon: Waves
  },
  {
    id: 'silicon_neural',
    indexLabel: '11',
    titleVi: 'Mạch Silicon & Neural 3D',
    titleEn: 'Silicon Die & 3D Neural Manifold',
    metaVi: 'Bề mặt Decision Manifold 3D · Mạch Cộng 4-Bit & SR-Latch trên Đế 3D',
    metaEn: '3D Backprop Heightfield · 3D Silicon ALU & Synapse Graph',
    descVi:
      'Quan sát mặt cong phân loại Neural Network uốn lượn 3D theo từng Epoch cùng đồ thị trọng số synap 3 chiều; chuyển sang chế độ Silicon để kích hoạt bộ cộng 4-bit và Flip-Flop nhớ bit phát sáng ngay trên đế chip PCB 3D.',
    descEn:
      'Watch a 3D neural decision manifold deform live per training epoch alongside a 3D synaptic graph, or toggle into a glowing 3D silicon PCB die simulating 4-bit Ripple Adders and SR-Latches.',
    specsVi: 'Mặt cong 3D Manifold · Đồ thị Synap 3D · Đế Chip ALU 3D',
    specsEn: '3D Decision Surface · 3D Synapse Graph · 3D Silicon Die',
    accentHex: '#8b5cf6',
    secondaryHex: '#38bdf8',
    accentTextClass: 'text-violet-600 dark:text-violet-300',
    iconBgClass: 'bg-violet-500/15 border-violet-500/40 text-violet-600 dark:text-violet-300',
    btnGradientClass: 'from-violet-500 via-indigo-500 to-sky-500 text-white',
    icon: Cpu
  },
  {
    id: 'phone_sensor_lab',
    indexLabel: '12',
    titleVi: 'Cảm Biến Điện Thoại & Bản Sao 3D',
    titleEn: 'Phone Sensor 3D Digital Twin Lab',
    metaVi: 'Bản sao Số 3D Đồng bộ Gyro · WebSocket & Dao động ký Thực nghiệm',
    metaEn: 'Live 3D Smartphone Twin · QR WebSocket & Real-Time Oscilloscope',
    descVi:
      'Quét QR ghép nối điện thoại để xoay mô hình Bản sao Số 3D (Digital Twin) cùng vector gia tốc 3 trục và hệ lò xo/con lắc/mặt nghiêng đồng bộ, đồng thời đối chiếu sai số RMSE trên dao động ký và xuất CSV.',
    descEn:
      'Scan a QR code to drive a live 3D smartphone Digital Twin, 3-axis acceleration vectors, and synchronized 3D physics rigs while fitting theoretical SHM curves and exporting CSV telemetry.',
    specsVi: 'Digital Twin 3D + Vector Gia tốc · Sai số RMSE · Xuất CSV',
    specsEn: '3D Gyro Digital Twin · Live RMSE Fit · CSV Export',
    accentHex: '#10b981',
    secondaryHex: '#06b6d4',
    accentTextClass: 'text-emerald-600 dark:text-emerald-300',
    iconBgClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300',
    btnGradientClass: 'from-emerald-400 via-teal-400 to-cyan-400 text-slate-950',
    icon: Smartphone
  },
  {
    id: 'dual_hand_sandbox',
    indexLabel: '13',
    titleVi: 'Trường Hạt GPU 3D 2 Tay',
    titleEn: 'Dual-Hand 3D 28K GPU Field',
    metaVi: 'Shader 28.000 Hạt 3D · Điều khiển Song Song 2 Bàn tay',
    metaEn: '28K 3D GPU Particle Shader · Dual-Hand Tracking',
    descVi:
      'Sử dụng cả hai bàn tay trước webcam hoặc con trỏ đa cực để điều khiển đồng thời 28.000 hạt trong 4 trường lực vật lí 3D: Hấp dẫn nhị phân, Trường từ Lorentz, Giao thoa sóng và Tán xạ hạt nhân Rutherford.',
    descEn:
      'Sculpt up to 28,000 real-time 3D GPU particles using two hands via webcam or dual magnetic poles across Binary Gravity, Lorentz, Wave Interference & Rutherford modes.',
    specsVi: 'GLSL Shader 60fps · 4 Trường lực vật lí 3D · Webcam & Chuột',
    specsEn: 'GLSL 3D Particle Field · 4 Physics Modes · Dual Pole Control',
    accentHex: '#3b82f6',
    secondaryHex: '#818cf8',
    accentTextClass: 'text-blue-600 dark:text-blue-300',
    iconBgClass: 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-300',
    btnGradientClass: 'from-blue-500 via-indigo-500 to-cyan-400 text-white',
    icon: Sparkles
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
  const { bgStyle, creatureTheme, activePalette, perfMode } = useBackgroundTheme();

  const rawTab = location.futureTab;
  const activeView: 'hub' | FutureLabTabId =
    rawTab && rawTab !== 'infinite_canvas' ? rawTab : 'hub';

  const [isStudioFullscreen, setIsStudioFullscreen] = useState<boolean>(false);
  const studioStageRef = useRef<HTMLDivElement | null>(null);
  const enteredNativeFsRef = useRef<boolean>(false);

  useEffect(() => {
    if (activeView === 'hub' && isStudioFullscreen) {
      setIsStudioFullscreen(false);
      enteredNativeFsRef.current = false;
    }
  }, [activeView, isStudioFullscreen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('pre-fullscreen-active', isStudioFullscreen);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isStudioFullscreen) {
        enteredNativeFsRef.current = false;
        setIsStudioFullscreen(false);
        try {
          if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
        } catch {}
      }
    };
    const onFsChange = () => {
      if (!document.fullscreenElement && enteredNativeFsRef.current) {
        enteredNativeFsRef.current = false;
        setIsStudioFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      document.documentElement.classList.remove('pre-fullscreen-active');
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [isStudioFullscreen]);

  const toggleStudioFullscreen = () => {
    if (!isStudioFullscreen) {
      setIsStudioFullscreen(true);
      try {
        const req = studioStageRef.current?.requestFullscreen?.();
        if (req && typeof req.then === 'function') {
          req.then(() => {
            enteredNativeFsRef.current = true;
          }).catch(() => {});
        }
      } catch {}
    } else {
      enteredNativeFsRef.current = false;
      setIsStudioFullscreen(false);
      try {
        if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      } catch {}
    }
  };

  const isMegastructureStage =
    activeView === 'megastructures' && location.synapseMode === 'stage';

  const bgStyleMeta = BACKGROUND_STYLE_OPTIONS.find((b) => b.id === bgStyle);
  const creatureMeta = CREATURE_THEME_OPTIONS.find((c) => c.id === creatureTheme);

  const glassSurfaceClass =
    perfMode === 'ultra'
      ? 'bg-white/72 dark:bg-slate-950/60 backdrop-blur-xl'
      : 'bg-white/82 dark:bg-slate-950/72';

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

  /* ==================== VIEW 1: SYNAPSE PRE HUB (1 COMPACT SQUARE FRAME PER ROW) ==================== */
  if (activeView === 'hub') {
    return (
      <div className="synapse-pre-scope max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-7 pre-page-enter">
        {/* Compact Adaptive Hero: Text cleanly on top, buttons underneath */}
        <section
          style={{
            borderColor: activePalette.ring,
            boxShadow: `0 16px 45px -18px ${activePalette.ring}`
          }}
          className={`pre-grand-hero sci-frame rounded-xl border ${glassSurfaceClass} p-4 sm:p-5 text-slate-900 dark:text-white`}
        >
          {/* Ambient dynamic gradient wash matching activePalette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-35"
            style={{
              background: `radial-gradient(circle at 12% 18%, ${activePalette.primaryLight}44 0%, transparent 48%), radial-gradient(circle at 88% 80%, ${activePalette.secondary}40 0%, transparent 50%)`
            }}
          />

          <div className="relative z-10 flex flex-col gap-3.5">
            {/* TOP: Metadata, Heading & Concise Subtitle */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
                {onBack && (
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={onBack}
                    className="pre-grand-btn inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300/80 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Back' : 'Quay lại'}</span>
                  </button>
                )}

                <span
                  style={{ color: activePalette.primaryLight }}
                  className="inline-flex items-center gap-1.5 font-mono font-bold tracking-wider uppercase whitespace-nowrap"
                >
                  <Cpu className="w-3.5 h-3.5 icon-anim-cosmos shrink-0" />
                  <span>
                    {isEn
                      ? `Synapse Pre · ${PRE_STUDIOS.length} Studios (3D+)`
                      : `Synapse Pre · ${PRE_STUDIOS.length} Phòng Lab 3D/4D`}
                  </span>
                </span>

                <span className="text-slate-400" aria-hidden="true">·</span>

                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {isEn
                    ? `Theme: ${bgStyleMeta?.shortEn || bgStyle} · ${creatureMeta?.shortEn || creatureTheme}`
                    : `Nền động: ${bgStyleMeta?.shortVi || bgStyle} · ${creatureMeta?.shortVi || creatureTheme}`}
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-accent-gradient hero-blend-shadow leading-snug">
                {isEn
                  ? 'Synapse Pre — 3D/4D Aerospace, Physics & Neural Studios'
                  : 'Synapse Pre — Không Gian 3D/4D, Phản Lực & Tên Lửa Tương Lai'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-4xl">
                {isEn
                  ? 'Interactive 3D+ WebGL laboratories with crisp technical schematic previews, synchronized seamlessly with your live background and color palette.'
                  : 'Toàn bộ phòng thí nghiệm đạt chuẩn 3D/4D WebGL tương tác trực tiếp với sơ đồ kỹ thuật gọn gàng, đồng bộ hoàn toàn với nền động và bảng màu của bạn.'}
              </p>
            </div>

            {/* BOTTOM: Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-slate-200/70 dark:border-slate-800/70">
              <button
                type="button"
                data-ripple="true"
                onClick={() => openModulePage('rocket_launch_3d')}
                className="pre-grand-btn inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap shadow-md"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>{isEn ? 'Launch 3D Rocket' : 'Phóng Tên Lửa 3D'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => openModulePage('cannon_ballistics_3d')}
                className="pre-grand-btn inline-flex items-center gap-2 px-3.5 py-2 border border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-200 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{isEn ? '3D Artillery' : 'Bắn Pháo 3D'}</span>
              </button>

              <button
                type="button"
                data-ripple="true"
                onClick={() => onNavigateSubject('spatial_3d')}
                className="pre-grand-btn inline-flex items-center gap-2 px-3.5 py-2 border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-200 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" />
                <span>{isEn ? 'WebAR & Hand 3D' : 'WebAR & Cảm Giác 3D'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Single-Column Stack: 1 Compact Square Card Per Row (Title -> Compact Schematic Diagram -> Detailed Description) */}
        <div className="flex flex-col items-center gap-8">
          {PRE_STUDIOS.map((studio, index) => {
            const Icon = studio.icon;
            return (
              <div
                key={studio.id}
                style={
                  {
                    '--pre-card-accent': studio.accentHex,
                    '--pre-card-secondary': studio.secondaryHex,
                    animationDelay: `${Math.min(index, 6) * 55}ms`
                  } as React.CSSProperties
                }
                className="pre-grand-frame pre-card-reveal group w-full max-w-[540px] lg:max-w-[580px] mx-auto shadow-[0_20px_55px_-18px_rgba(2,132,199,0.26)]"
              >
                {/* Rotating Conic Plasma Energy Ring */}
                <div aria-hidden="true" className="pre-grand-conic" />

                {/* Corner Illuminated Calipers */}
                <div aria-hidden="true" className="pre-grand-corners" />

                {/* Compact Square-Proportioned Card Surface */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openModulePage(studio.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModulePage(studio.id);
                    }
                  }}
                  className={`relative z-10 w-full min-h-[430px] rounded-[0.78rem] ${glassSurfaceClass} border border-white/60 dark:border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-4 text-slate-900 dark:text-white cursor-pointer overflow-hidden`}
                >
                  {/* Ambient inner accent halo */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-28 transition-opacity duration-500 group-hover:opacity-40"
                    style={{
                      background: `radial-gradient(circle at 18% 12%, ${studio.accentHex}38 0%, transparent 45%), radial-gradient(circle at 86% 88%, ${studio.secondaryHex}30 0%, transparent 45%)`
                    }}
                  />

                  {/* 1. TITLE AT THE TOP */}
                  <header className="relative z-10 flex items-start justify-between gap-3 shrink-0">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className={`font-extrabold ${studio.accentTextClass}`}>
                          {studio.indexLabel}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">
                          {isEn ? studio.metaEn : studio.metaVi}
                        </span>
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors leading-tight">
                        {isEn ? studio.titleEn : studio.titleVi}
                      </h2>
                    </div>

                    <div
                      className={`pre-grand-icon-float w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${studio.iconBgClass}`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </header>

                  {/* 2. COMPACT TECHNICAL SCHEMATIC DIAGRAM IN THE MIDDLE */}
                  <div className="relative z-10 w-full">
                    <PreStudioDiagramPreview
                      id={studio.id}
                      accentHex={studio.accentHex}
                      secondaryHex={studio.secondaryHex}
                      isEn={isEn}
                    />
                  </div>

                  {/* 3. DETAILED DESCRIPTION + GRAND BUTTON AT THE BOTTOM */}
                  <footer className="relative z-10 space-y-3.5 shrink-0">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {isEn ? studio.descEn : studio.descVi}
                    </p>

                    <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800/90 flex flex-wrap items-center justify-between gap-2.5">
                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                        {isEn ? studio.specsEn : studio.specsVi}
                      </span>

                      <button
                        type="button"
                        data-ripple="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModulePage(studio.id);
                        }}
                        className={`pre-grand-btn inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${studio.btnGradientClass} text-xs font-extrabold shadow-lg cursor-pointer whitespace-nowrap`}
                      >
                        <span>{isEn ? 'Launch 3D Studio' : 'Khởi Chạy 3D'}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </footer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ==================== VIEW 2: DEDICATED STANDALONE PAGE ==================== */
  const ActiveIcon = currentStudio?.icon || Cpu;

  return (
    <div
      ref={studioStageRef}
      key={activeView}
      className={
        isStudioFullscreen
          ? 'synapse-pre-scope fixed inset-0 z-[140] w-screen h-screen overflow-y-auto bg-slate-50/98 dark:bg-slate-950/98 px-3 sm:px-5 py-3 space-y-3 pre-page-enter'
          : 'synapse-pre-scope max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5 pre-page-enter'
      }
    >
      {/* Adaptive Standalone Studio Header synced with user theme */}
      <div
        style={{ borderColor: activePalette.ring }}
        className={`pre-grand-hero sci-frame rounded-xl border ${glassSurfaceClass} text-slate-900 dark:text-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_14px_40px_-16px_rgba(14,165,233,0.3)]`}
      >
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <button
              type="button"
              data-ripple="true"
              onClick={() => {
                setIsStudioFullscreen(false);
                try {
                  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
                } catch {}
                backToHub();
              }}
              className="pre-grand-btn inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400" />
              <span>{isEn ? `All ${PRE_STUDIOS.length} Studios` : `${PRE_STUDIOS.length} Không gian Synapse Pre`}</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                  currentStudio?.iconBgClass || 'bg-cyan-500/15 border-cyan-400/40 text-cyan-500 dark:text-cyan-300'
                }`}
              >
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  {currentStudio
                    ? `${currentStudio.indexLabel}. ${isEn ? currentStudio.titleEn : currentStudio.titleVi}`
                    : 'Synapse Pre Studio'}
                </h1>
                {currentStudio && (
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 truncate">
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
              className="pre-grand-btn inline-flex items-center gap-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? prevStudio.titleEn : prevStudio.titleVi}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Prev' : 'Trước'}</span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => openModulePage(nextStudio.id)}
              className="pre-grand-btn inline-flex items-center gap-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap"
              title={isEn ? nextStudio.titleEn : nextStudio.titleVi}
            >
              <span className="hidden sm:inline">{isEn ? 'Next' : 'Tiếp'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={toggleStudioFullscreen}
              className={`pre-grand-btn inline-flex items-center gap-1.5 px-3.5 py-2 border text-xs font-bold cursor-pointer whitespace-nowrap ${
                isStudioFullscreen
                  ? 'border-amber-400/70 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                  : 'border-sky-500/50 bg-sky-500/15 hover:bg-sky-500/25 text-sky-700 dark:text-sky-200'
              }`}
              title={isStudioFullscreen ? (isEn ? 'Exit Fullscreen (Esc)' : 'Thu nhỏ (Esc)') : (isEn ? 'Fullscreen' : 'Toàn màn hình')}
            >
              {isStudioFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span>
                {isStudioFullscreen
                  ? isEn ? 'Exit Fullscreen' : 'Thu nhỏ'
                  : isEn ? 'Fullscreen' : 'Toàn màn hình'}
              </span>
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => {
                setIsStudioFullscreen(false);
                onNavigateSubject('spatial_3d');
              }}
              className="pre-grand-btn inline-flex items-center gap-1.5 px-3.5 py-2 border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-200 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" />
              <span>{isEn ? 'WebAR & Hand 3D' : 'WebAR & Cảm Giác 3D'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Module Content Canvas */}
      <div>
        {activeView === 'rocket_launch_3d' && <RocketLaunch3DLab onEarnXP={onEarnXP} />}
        {activeView === 'jet_engine_3d' && <JetPropulsion3DLab onEarnXP={onEarnXP} />}
        {activeView === 'four_d_lectures' && <FourDLecture3DLab onEarnXP={onEarnXP} />}
        {activeView === 'robotics_ik_3d' && <RoboticsIK3DLab onEarnXP={onEarnXP} />}
        {activeView === 'cannon_ballistics_3d' && <CannonBallistics3DLab onEarnXP={onEarnXP} />}
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

