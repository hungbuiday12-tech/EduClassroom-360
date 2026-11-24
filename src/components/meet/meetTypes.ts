export type Meet3DModelId =
  | 'turbofan'
  | 'solar_system'
  | 'bohr_atom'
  | 'dna_helix'
  | 'oxyz_pyramid'
  | 'sphere_slice'
  | 'robot_arm'
  | 'wind_turbine';

export interface Meet3DModelMeta {
  id: Meet3DModelId;
  titleVi: string;
  titleEn: string;
  subjectVi: string;
  subjectEn: string;
  formula: string;
  accentHex: string;
}

export const MEET_3D_MODELS: Meet3DModelMeta[] = [
  {
    id: 'turbofan',
    titleVi: 'Động cơ Phản lực Turbofan',
    titleEn: 'Turbofan Jet Engine',
    subjectVi: 'Vật lí · Cơ học',
    subjectEn: 'Physics · Mechanics',
    formula: 'F = ṁ(v_e - v_0)',
    accentHex: '#38bdf8'
  },
  {
    id: 'solar_system',
    titleVi: 'Hệ Mặt Trời & Quỹ Đạo',
    titleEn: 'Solar System Orbits',
    subjectVi: 'Vật lí · Thiên văn',
    subjectEn: 'Physics · Astronomy',
    formula: 'T² / a³ = 4π² / (GM)',
    accentHex: '#f59e0b'
  },
  {
    id: 'bohr_atom',
    titleVi: 'Nguyên tử Bohr & Quỹ đạo e⁻',
    titleEn: 'Bohr Atom & Electron Shells',
    subjectVi: 'Vật lí · Lượng tử',
    subjectEn: 'Physics · Quantum',
    formula: 'E_n = -13.6 / n² (eV)',
    accentHex: '#a855f7'
  },
  {
    id: 'dna_helix',
    titleVi: 'Chuỗi Xoắn Kép DNA',
    titleEn: 'DNA Double Helix',
    subjectVi: 'Sinh · Hóa STEM',
    subjectEn: 'STEM · Bio-Chem',
    formula: 'A = T, G = C · 34 Å/vòng',
    accentHex: '#10b981'
  },
  {
    id: 'oxyz_pyramid',
    titleVi: 'Hình Chóp Tứ Giác Đều Oxyz',
    titleEn: 'Regular Oxyz Pyramid',
    subjectVi: 'Toán 12 · Oxyz',
    subjectEn: 'Math · 3D Geometry',
    formula: 'V = (1/3) · S_đáy · h',
    accentHex: '#3b82f6'
  },
  {
    id: 'sphere_slice',
    titleVi: 'Mặt Cầu & Thiết Diện Phẳng',
    titleEn: 'Sphere & Plane Section',
    subjectVi: 'Toán 12 · Mặt cầu',
    subjectEn: 'Math · Sphere',
    formula: 'r² = R² - d²(I, (P))',
    accentHex: '#ec4899'
  },
  {
    id: 'robot_arm',
    titleVi: 'Cánh Tay Robot 4 Bậc Tự Do',
    titleEn: '4-DOF Robotic Arm',
    subjectVi: 'Tin học · Robotics',
    subjectEn: 'CS · Robotics',
    formula: 'T = R_z(θ₁) · R_x(θ₂) · L',
    accentHex: '#f97316'
  },
  {
    id: 'wind_turbine',
    titleVi: 'Tuabin Gió Phát Điện',
    titleEn: 'Wind Power Turbine',
    subjectVi: 'Vật lí · Năng lượng',
    subjectEn: 'Physics · Energy',
    formula: 'P = ½ ρ A v³ C_p',
    accentHex: '#14b8a6'
  }
];

export type MeetStageMode = 'grid' | '3d';
export type MeetGraphicsQuality = 'low' | 'medium' | 'high';
export type MeetCameraPreset = 'perspective' | 'front' | 'top' | 'closeup';

export interface MeetShared3DState {
  modelId: string;
  rotY: number;
  rotX: number;
  zoom: number;
  explode: number;
  autoSpin: boolean;
  wireframe?: boolean;
  cameraPreset?: MeetCameraPreset;
  customModelName?: string;
  uploadedFileUrl?: string;
  uploadedFileExt?: 'glb' | 'gltf' | 'obj';
  selectedPartName?: string;
  updatedBy?: string;
}

export interface MeetPeerInfo {
  peerId: string;
  name: string;
  colorHex: string;
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  handRaised: boolean;
  isHost?: boolean;
  joinedAt: string;
}

export interface MeetChatMessage {
  id: string;
  peerId: string;
  senderName: string;
  colorHex: string;
  text: string;
  createdAt: string;
}

export interface MeetRoomSummary {
  roomId: string;
  title: string;
  hostName: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  stageMode: MeetStageMode;
  modelId: Meet3DModelId;
  createdAt: string;
}

export interface MeetFloatingReaction {
  id: string;
  emoji: string;
  senderName: string;
  xPercent: number;
}
