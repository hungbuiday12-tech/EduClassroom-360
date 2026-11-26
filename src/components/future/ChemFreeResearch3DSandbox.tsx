import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  AlertTriangle,
  Beaker,
  Camera,
  Download,
  Droplets,
  Flame,
  FlaskConical,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import {
  applyClipPlaneToObject,
  CameraBookmarkPose,
  detectSoftwareGl,
  Pre3DProControlsBar,
  QuickCamPreset,
  scheduleSyncedGlFrame,
  SliceAxis,
  updateClipPlaneFromState,
} from './Pre3DViewportBar';
import {
  createTroikaLabel,
  GPUParticlePool,
  updateBillboardLabels,
} from '../../lib/three3DEnhancements';
import { captureCanvasPng, MiniTelemetryChart } from '../common/SimProToolkit';

type VesselType =
  | 'beaker'
  | 'erlenmeyer'
  | 'titration_burette'
  | 'dual_tubes'
  | 'electrolysis'
  | 'flame_burner';

type ReagentGroup = 'solvent' | 'acid' | 'base' | 'salt' | 'metal' | 'indicator';

interface ReagentDef {
  id: string;
  formula: string;
  nameVi: string;
  group: ReagentGroup;
  colorHex: string;
  phBias: number; // contribution
}

const REAGENTS: ReagentDef[] = [
  { id: 'H2O', formula: 'H₂O', nameVi: 'Nước cất', group: 'solvent', colorHex: '#bae6fd', phBias: 0 },
  { id: 'HCl', formula: 'HCl', nameVi: 'Axit clohiđric', group: 'acid', colorHex: '#e0f2fe', phBias: -3.2 },
  { id: 'H2SO4', formula: 'H₂SO₄', nameVi: 'Axit sunfuric', group: 'acid', colorHex: '#e0f2fe', phBias: -3.6 },
  { id: 'HNO3', formula: 'HNO₃', nameVi: 'Axit nitric', group: 'acid', colorHex: '#fef9c3', phBias: -3.3 },
  { id: 'NaOH', formula: 'NaOH', nameVi: 'Natri hiđroxit', group: 'base', colorHex: '#e0f2fe', phBias: 3.6 },
  { id: 'NH3', formula: 'NH₃', nameVi: 'Dung dịch Amoniac', group: 'base', colorHex: '#e0f2fe', phBias: 2.3 },
  { id: 'Ba(OH)2', formula: 'Ba(OH)₂', nameVi: 'Bari hiđroxit', group: 'base', colorHex: '#e0f2fe', phBias: 3.4 },
  { id: 'CuSO4', formula: 'CuSO₄', nameVi: 'Đồng(II) sunfat', group: 'salt', colorHex: '#0ea5e9', phBias: -0.4 },
  { id: 'FeCl3', formula: 'FeCl₃', nameVi: 'Sắt(III) clorua', group: 'salt', colorHex: '#d97706', phBias: -0.9 },
  { id: 'FeSO4', formula: 'FeSO₄', nameVi: 'Sắt(II) sunfat', group: 'salt', colorHex: '#86efac', phBias: -0.3 },
  { id: 'AgNO3', formula: 'AgNO₃', nameVi: 'Bạc nitrat', group: 'salt', colorHex: '#e2e8f0', phBias: 0 },
  { id: 'BaCl2', formula: 'BaCl₂', nameVi: 'Bari clorua', group: 'salt', colorHex: '#e2e8f0', phBias: 0 },
  { id: 'KMnO4', formula: 'KMnO₄', nameVi: 'Thuốc tím', group: 'salt', colorHex: '#9333ea', phBias: 0 },
  { id: 'KI', formula: 'KI', nameVi: 'Kali iotua', group: 'salt', colorHex: '#f1f5f9', phBias: 0 },
  { id: 'Na2CO3', formula: 'Na₂CO₃', nameVi: 'Natri cacbonat', group: 'salt', colorHex: '#e0f2fe', phBias: 2.0 },
  { id: 'NaCl', formula: 'NaCl', nameVi: 'Natri clorua', group: 'salt', colorHex: '#e0f2fe', phBias: 0 },
  { id: 'KSCN', formula: 'KSCN', nameVi: 'Kali thioxianat', group: 'salt', colorHex: '#e2e8f0', phBias: 0 },
  { id: 'Na', formula: 'Na (r)', nameVi: 'Kim loại Natri', group: 'metal', colorHex: '#cbd5e1', phBias: 3.4 },
  { id: 'Mg', formula: 'Mg (r)', nameVi: 'Dải Magie', group: 'metal', colorHex: '#e2e8f0', phBias: 0.4 },
  { id: 'Zn', formula: 'Zn (r)', nameVi: 'Viên Kẽm', group: 'metal', colorHex: '#94a3b8', phBias: 0.2 },
  { id: 'Fe', formula: 'Fe (r)', nameVi: 'Đinh Sắt', group: 'metal', colorHex: '#64748b', phBias: 0 },
  { id: 'Cu', formula: 'Cu (r)', nameVi: 'Dây Đồng', group: 'metal', colorHex: '#ea580c', phBias: 0 },
  { id: 'Al', formula: 'Al (r)', nameVi: 'Lá Nhôm', group: 'metal', colorHex: '#cbd5e1', phBias: 0.2 },
  { id: 'Phenol', formula: 'Phenolphtalein', nameVi: 'Chỉ thị Phenolphtalein', group: 'indicator', colorHex: '#f472b6', phBias: 0 },
  { id: 'Universal', formula: 'Chỉ thị pH', nameVi: 'Chỉ thị vạn năng', group: 'indicator', colorHex: '#22c55e', phBias: 0 },
];

const VESSELS: { id: VesselType; label: string; sub: string }[] = [
  { id: 'beaker', label: 'Cốc thủy tinh 250mL', sub: 'Pha trộn & quan sát kết tủa' },
  { id: 'erlenmeyer', label: 'Bình tam giác 250mL', sub: 'Phản ứng khí & đun nóng' },
  { id: 'titration_burette', label: 'Buret Chuẩn Độ Axit–Bazơ', sub: 'Nhỏ giọt NaOH 0,1M & đường cong pH' },
  { id: 'dual_tubes', label: 'Giá 2 Ống nghiệm', sub: 'So sánh đối chứng song song' },
  { id: 'electrolysis', label: 'Bình Điện phân DC', sub: 'Điện cực C/Cu + dòng điện' },
  { id: 'flame_burner', label: 'Đèn Bunsen Thử Màu', sub: 'Phổ ngọn lửa kim loại' },
];

interface LabHazardAlert {
  level: 'explosion' | 'warning';
  title: string;
  detail: string;
  protocol: string;
}

interface LabMixtureOutcome {
  liquidHex: number;
  liquidOpacity: number;
  precipitateHex: number | null;
  precipitateAmount: number; // 0..1
  gasHex: number | null;
  gasRate: number; // 0..1
  flameTestHex: number;
  ph: number;
  tempDeltaC: number;
  metalColorHex: number | null;
  sodiumSkitter: boolean;
  hazardAlert: LabHazardAlert | null;
  equations: string[];
  phenomena: string[];
}

function phToUniversalHex(ph: number): number {
  if (ph < 2.5) return 0xef4444;
  if (ph < 4.8) return 0xf97316;
  if (ph < 6.4) return 0xfacc15;
  if (ph < 7.8) return 0x22c55e;
  if (ph < 9.5) return 0x06b6d4;
  if (ph < 11.5) return 0x3b82f6;
  return 0x7c3aed;
}

function evaluateMixture(
  added: string[],
  tempC: number,
  voltageV: number,
  vessel: VesselType,
  buretteMl = 0
): LabMixtureOutcome {
  const has = (id: string) => added.includes(id);
  const count = (id: string) => added.filter((x) => x === id).length;

  const hasAcid = has('HCl') || has('H2SO4') || has('HNO3');
  const hasBase = has('NaOH') || has('NH3') || has('Ba(OH)2');
  const hasWater = has('H2O') || hasAcid || hasBase || has('CuSO4') || has('FeCl3') || has('FeSO4') || has('AgNO3') || has('BaCl2') || has('KMnO4') || has('KI') || has('Na2CO3') || has('NaCl');

  // Compute pH
  let netBias = 0;
  added.forEach((id) => {
    const def = REAGENTS.find((r) => r.id === id);
    if (def) netBias += def.phBias;
  });
  let ph = Math.max(0.6, Math.min(13.8, 7.0 + netBias * 1.15));
  if (added.length === 0) ph = 7.0;

  let liquidHex = 0xdbeafe;
  let liquidOpacity = added.length === 0 ? 0.0 : 0.34;
  let precipitateHex: number | null = null;
  let precipitateAmount = 0;
  let gasHex: number | null = null;
  let gasRate = 0;
  let tempDeltaC = 0;
  let metalColorHex: number | null = null;
  let sodiumSkitter = false;
  let hazardAlert: LabHazardAlert | null = null;
  const equations: string[] = [];
  const phenomena: string[] = [];

  // Titration burette quantitative neutralization override (20 mL HCl 0.1M + NaOH 0.1M from burette)
  if (vessel === 'titration_burette') {
    const vEq = 20.0;
    const diff = buretteMl - vEq;
    if (buretteMl < 18.5) ph = 1.0 + (buretteMl / 18.5) * 1.3;
    else if (buretteMl < 19.9) ph = 2.3 + ((buretteMl - 18.5) / 1.4) * 2.1;
    else if (Math.abs(diff) <= 0.15) ph = 7.0;
    else if (buretteMl <= 21.5) ph = 9.4 + ((buretteMl - 20.0) / 1.5) * 2.2;
    else ph = Math.min(12.8, 11.6 + (buretteMl - 21.5) * 0.06);

    equations.push('HCl + NaOH → NaCl + H₂O (Điểm tương đương tại V_NaOH = 20,0 mL)');
    if (buretteMl < 19.8) {
      liquidHex = 0xe0f2fe;
      liquidOpacity = 0.42;
      phenomena.push(`Đang nhỏ giọt chuẩn độ (${buretteMl.toFixed(1)} mL NaOH 0,1M): Dung dịch vẫn trong suốt (dư H⁺, pH = ${ph.toFixed(2)}).`);
    } else if (Math.abs(diff) <= 0.4) {
      liquidHex = 0xf9a8d4;
      liquidOpacity = 0.62;
      phenomena.push(`Đạt ĐIỂM TƯƠNG ĐƯƠNG (${buretteMl.toFixed(1)} mL): Phenolphtalein phớt hồng bền ~30 giây!`);
    } else {
      liquidHex = 0xec4899;
      liquidOpacity = 0.78;
      phenomena.push(`Dư kiềm NaOH (${buretteMl.toFixed(1)} mL): Dung dịch hóa hồng cánh sen đậm (pH = ${ph.toFixed(2)}).`);
    }
  }

  // Safety hazard checks (explosions / violent exothermic hazards)
  if (has('Na') && hasAcid) {
    hazardAlert = {
      level: 'explosion',
      title: 'NGUY CƠ CHÁY NỔ CỰC ĐỘC: Kim loại Kiềm Na tiếp xúc Axit mạnh!',
      detail: 'Natri phản ứng mãnh liệt tức thời với H⁺ giải phóng lượng lớn nhiệt & khí H₂ gây nổ văng axit ra ngoài bình!',
      protocol: 'Tuyệt đối không cho kim loại kiềm (Na, K) trực tiếp vào axit vô cơ mạnh. Ngắt nguồn nhiệt ngay và dùng bình phủ cát khô.',
    };
    tempDeltaC += 85;
    gasRate = 1.0;
    gasHex = 0xfef08a;
  } else if (has('KMnO4') && has('H2SO4') && tempC >= 55) {
    hazardAlert = {
      level: 'explosion',
      title: 'CẢNH BÁO CHÁY NỔ OXI HÓA MẠNH: KMnO₄ + H₂SO₄ đặc nóng!',
      detail: 'Tạo Mn₂O₇ (đimangan heptaoxit) là chất oxi hóa không bền rất dễ phát nổ khi gia nhiệt hoặc chạm hợp chất hữu cơ!',
      protocol: 'Hạ nhiệt độ ngay dưới 25°C, tuyệt đối không gia nhiệt hỗn hợp KMnO₄ và axit sunfuric đặc.',
    };
    tempDeltaC += 52;
    gasRate = 0.9;
    gasHex = 0xf43f5e;
  } else if (has('H2O') && count('H2SO4') >= 2) {
    const h2oIdx = added.indexOf('H2O');
    const acidIdx = added.indexOf('H2SO4');
    if (h2oIdx > acidIdx && acidIdx !== -1) {
      hazardAlert = {
        level: 'warning',
        title: 'CẢNH BÁO AN TOÀN: Đổ Nước vào Axit H₂SO₄ đậm đặc!',
        detail: 'Quá trình hiđrat hóa H₂SO₄ tỏa nhiệt cực lớn khiến nước sôi bùng tại bề mặt và bắn tia axit nguy hiểm.',
        protocol: 'Nguyên tắc vàng: Rót TỪ TỪ axit theo đũa thủy tinh vào nước lạnh khuấy đều — KHÔNG làm ngược lại.',
      };
      tempDeltaC += 44;
    }
  } else if (has('Na') && has('KMnO4')) {
    hazardAlert = {
      level: 'explosion',
      title: 'NGUY CƠ PHÁT NỔ: Chất khử mạnh Na + Chất oxi hóa KMnO₄!',
      detail: 'Va chạm giữa kim loại kiềm và muối permanganat gây phản ứng tỏa nhiệt cháy sáng đột ngột.',
      protocol: 'Cách ly hoàn toàn kim loại kiềm khỏi các chất oxi hóa mạnh (KMnO₄, KClO₃, HNO₃ đặc).',
    };
    tempDeltaC += 65;
  } else if (has('HNO3') && tempC >= 90 && (has('Cu') || has('Fe'))) {
    hazardAlert = {
      level: 'warning',
      title: 'CẢNH BÁO KHÍ ĐỘC NO₂ ĐẬM ĐẶC Ở NHIỆT ĐỘ CAO!',
      detail: 'Khí NO₂ màu nâu đỏ gây kích ứng phổi nặng đang sinh ra nhanh ở >90°C.',
      protocol: 'Thực hiện phản ứng trong Tủ Hút Khí Độc (Fume Hood) và kiểm soát nhiệt độ vừa phải.',
    };
  }

  // Base ion colors
  if (has('CuSO4')) {
    liquidHex = 0x0ea5e9;
    liquidOpacity = 0.62;
  }
  if (has('FeCl3')) {
    liquidHex = 0xd97706;
    liquidOpacity = 0.65;
  }
  if (has('FeSO4')) {
    liquidHex = 0x86efac;
    liquidOpacity = 0.48;
  }
  if (has('KMnO4')) {
    liquidHex = 0x7e22ce;
    liquidOpacity = 0.78;
  }

  // Metal identification for 3D visual
  if (has('Cu')) metalColorHex = 0xea580c;
  else if (has('Fe')) metalColorHex = 0x64748b;
  else if (has('Zn')) metalColorHex = 0x94a3b8;
  else if (has('Mg') || has('Al')) metalColorHex = 0xe2e8f0;
  else if (has('Na')) metalColorHex = 0xf8fafc;

  // Chemical rules engine
  if (has('Na') && (hasWater || hasAcid)) {
    sodiumSkitter = true;
    gasHex = 0xf8fafc;
    gasRate = 0.95;
    tempDeltaC += 46;
    equations.push('2Na + 2H₂O → 2NaOH + H₂↑ (ΔH < 0)');
    phenomena.push('Mẫu Natri nóng chảy thành giọt tròn, chạy trên mặt nước, sủi bọt H₂ mạnh và tóe tia lửa vàng.');
  }

  if ((has('Mg') || has('Zn') || has('Fe') || has('Al')) && (has('HCl') || has('H2SO4'))) {
    gasHex = 0xe2e8f0;
    gasRate = Math.max(gasRate, has('Mg') ? 0.9 : 0.72);
    tempDeltaC += 18;
    if (has('Mg')) equations.push('Mg + 2HCl → MgCl₂ + H₂↑');
    if (has('Zn')) equations.push('Zn + H₂SO₄ → ZnSO₄ + H₂↑');
    if (has('Fe')) {
      equations.push('Fe + 2HCl → FeCl₂ + H₂↑');
      liquidHex = 0x86efac;
      liquidOpacity = 0.45;
    }
    if (has('Al')) equations.push('2Al + 6HCl → 2AlCl₃ + 3H₂↑');
    phenomena.push('Bọt khí H₂ không màu thoát ra liên tục trên bề mặt kim loại, tỏa nhiệt nhẹ.');
  }

  if (has('Al') && hasBase) {
    gasHex = 0xe2e8f0;
    gasRate = Math.max(gasRate, 0.75);
    equations.push('2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑');
    phenomena.push('Nhôm tan dần trong dung dịch kiềm mạnh kèm sủi bọt khí Hiđro.');
  }

  if (has('Cu') && has('HNO3')) {
    liquidHex = 0x0284c7;
    liquidOpacity = 0.68;
    gasHex = 0xd97706;
    gasRate = 0.85;
    tempDeltaC += 16;
    equations.push('Cu + 4HNO₃(đặc) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O');
    phenomena.push('Dung dịch chuyển xanh lam Cu²⁺, đồng thời sủi khí NO₂ màu nâu đỏ đặc trưng.');
  }

  if (has('Fe') && has('CuSO4')) {
    metalColorHex = 0xd9480f;
    liquidHex = 0x6ee7b7;
    equations.push('Fe + CuSO₄ → FeSO₄ + Cu↓');
    phenomena.push('Kim loại Đồng màu đỏ bám lên bề mặt đinh Sắt; màu xanh lam dung dịch nhạt dần.');
  }

  if (has('CuSO4') && hasBase) {
    if (count('NH3') >= 2 && !has('NaOH')) {
      liquidHex = 0x1d4ed8;
      liquidOpacity = 0.84;
      precipitateHex = null;
      precipitateAmount = 0;
      equations.push('Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂](OH)₂');
      phenomena.push('Kết tủa tan tạo dung dịch phức đồng amin màu xanh lam thẫm tuyệt đẹp!');
    } else if (tempC >= 70) {
      precipitateHex = 0x0f172a;
      precipitateAmount = 0.78;
      equations.push('Cu(OH)₂(r) —(t°)→ CuO↓(đen) + H₂O');
      phenomena.push('Khi đun nóng >70°C, kết tủa Cu(OH)₂ bị nhiệt phân thành CuO màu đen lắng đáy.');
    } else {
      precipitateHex = 0x0284c7;
      precipitateAmount = 0.78;
      equations.push('CuSO₄ + 2NaOH → Cu(OH)₂↓(xanh lam) + Na₂SO₄');
      phenomena.push('Xuất hiện kết tủa keo màu xanh lam Cu(OH)₂ không tan.');
    }
  }

  if (has('FeCl3') && hasBase) {
    precipitateHex = 0x991b1b;
    precipitateAmount = 0.82;
    equations.push('FeCl₃ + 3NaOH → Fe(OH)₃↓(nâu đỏ) + 3NaCl');
    phenomena.push('Tạo kết tủa Fe(OH)₃ màu nâu đỏ đặc trưng lắng xuống đáy bình.');
  }

  if (has('FeCl3') && has('KSCN')) {
    liquidHex = 0x991b1b;
    liquidOpacity = 0.86;
    equations.push('Fe³⁺ + SCN⁻ ⇌ [Fe(SCN)]²⁺ (đỏ máu)');
    phenomena.push('Dung dịch chuyển ngay sang màu đỏ máu rất nhạy của phức sắt(III) thioxianat.');
  }

  if (has('FeSO4') && hasBase) {
    precipitateHex = 0xa7f3d0;
    precipitateAmount = 0.7;
    equations.push('FeSO₄ + 2NaOH → Fe(OH)₂↓(trắng xanh) + Na₂SO₄');
    phenomena.push('Xuất hiện kết tủa Fe(OH)₂ màu trắng xanh (dễ bị oxi không khí hóa nâu đỏ ở bề mặt).');
  }

  if (has('AgNO3') && (has('NaCl') || has('HCl'))) {
    if (count('NH3') >= 1) {
      liquidHex = 0xe2e8f0;
      liquidOpacity = 0.35;
      equations.push('AgCl + 2NH₃ → [Ag(NH₃)₂]Cl');
      phenomena.push('Kết tủa AgCl tan trong dung dịch NH₃ tạo phức bạc amoniac không màu.');
    } else {
      precipitateHex = 0xf8fafc;
      precipitateAmount = 0.76;
      equations.push('Ag⁺ + Cl⁻ → AgCl↓(trắng)');
      phenomena.push('Kết tủa trắng AgCl tách lớp ngay lập tức.');
    }
  } else if (has('AgNO3') && has('KI')) {
    precipitateHex = 0xfacc15;
    precipitateAmount = 0.82;
    equations.push('Ag⁺ + I⁻ → AgI↓(vàng đậm)');
    phenomena.push('Tạo kết tủa AgI màu vàng đậm không tan.');
  }

  if ((has('BaCl2') || has('Ba(OH)2')) && (has('H2SO4') || has('CuSO4') || has('Na2CO3'))) {
    precipitateHex = 0xf8fafc;
    precipitateAmount = 0.85;
    equations.push('Ba²⁺ + SO₄²⁻ → BaSO₄↓(trắng bền axit)');
    phenomena.push('Kết tủa trắng mịn BaSO₄ lắng nặng xuống đáy bình.');
  }

  if (has('Na2CO3') && hasAcid) {
    gasHex = 0xe2e8f0;
    gasRate = Math.max(gasRate, 0.92);
    equations.push('Na₂CO₃ + 2HCl → 2NaCl + CO₂↑ + H₂O');
    phenomena.push('Sủi bọt khí CO₂ mãnh liệt ngay khi axit chạm muối cacbonat.');
  }

  if (has('KMnO4') && has('FeSO4') && hasAcid) {
    liquidHex = 0xfef3c7;
    liquidOpacity = 0.42;
    equations.push('10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 5Fe₂(SO₄)₃ + 2MnSO₄ + K₂SO₄ + 8H₂O');
    phenomena.push('Thuốc tím KMnO₄ mất màu nhanh chóng trong môi trường axit do oxi hóa Fe²⁺ → Fe³⁺.');
  } else if (has('KMnO4') && has('KI')) {
    liquidHex = 0x92400e;
    liquidOpacity = 0.72;
    equations.push('2MnO₄⁻ + 10I⁻ + 16H⁺ → 2Mn²⁺ + 5I₂ + 8H₂O');
    phenomena.push('Dung dịch xuất hiện màu nâu vàng của I₂ giải phóng.');
  }

  if (hasAcid && hasBase && equations.length === 0) {
    tempDeltaC += 12;
    equations.push('H⁺ + OH⁻ → H₂O (Phản ứng trung hòa)');
    phenomena.push('Phản ứng trung hòa tỏa nhiệt nhẹ giữa axit và bazơ.');
  }

  // Electrolysis override
  if (vessel === 'electrolysis' && voltageV >= 2.0) {
    if (has('CuSO4')) {
      gasHex = 0x7dd3fc;
      gasRate = Math.max(gasRate, 0.65);
      equations.push('2CuSO₄ + 2H₂O —(đpdd)→ 2Cu↓(Catôt) + O₂↑(Anôt) + 2H₂SO₄');
      phenomena.push(`Nguồn ${voltageV}V điện phân CuSO₄: Kim loại Đồng đỏ bám Catôt (−), khí O₂ thoát ra ở Anôt (+).`);
    } else if (has('NaCl')) {
      gasHex = 0xa3e635;
      gasRate = Math.max(gasRate, 0.75);
      equations.push('2NaCl + 2H₂O —(đpdd)→ 2NaOH + H₂↑ + Cl₂↑');
      phenomena.push(`Nguồn ${voltageV}V điện phân NaCl: Khí H₂ ở Catôt và khí Cl₂ vàng lục ở Anôt.`);
    } else if (hasWater) {
      gasHex = 0xe0f2fe;
      gasRate = Math.max(gasRate, 0.55);
      equations.push('2H₂O —(đp)→ 2H₂↑ + O₂↑');
      phenomena.push(`Điện phân nước ở ${voltageV}V: Bọt khí H₂ (Catôt) gấp đôi thể tích O₂ (Anôt).`);
    }
  }

  // Indicator color overlays
  if (has('Universal') && added.length > 0) {
    liquidHex = phToUniversalHex(ph);
    liquidOpacity = 0.74;
    phenomena.push(`Chỉ thị vạn năng biểu thị pH ≈ ${ph.toFixed(1)}.`);
  } else if (has('Phenol') && ph >= 8.2 && !has('KMnO4')) {
    liquidHex = 0xec4899;
    liquidOpacity = 0.72;
    phenomena.push('Phenolphtalein chuyển hồng cánh sen do môi trường kiềm (pH ≥ 8,2).');
  }

  // Flame test color
  let flameTestHex = 0x38bdf8; // clean blue Bunsen flame
  if (has('Na') || has('NaOH') || has('NaCl') || has('Na2CO3')) flameTestHex = 0xfacc15;
  else if (has('Cu') || has('CuSO4')) flameTestHex = 0x10b981;
  else if (has('BaCl2') || has('Ba(OH)2')) flameTestHex = 0x84cc16;
  else if (has('KMnO4') || has('KI') || has('KSCN')) flameTestHex = 0xc084fc;
  else if (has('Fe') || has('FeCl3') || has('FeSO4')) flameTestHex = 0xf59e0b;

  if (vessel === 'flame_burner' && added.length > 0) {
    phenomena.unshift('Thử ngọn lửa Bunsen: Electron lớp ngoài cùng bị kích thích nhiệt, bức xạ vạch màu đặc trưng của cation.');
  }

  if (added.length > 0 && phenomena.length === 0) {
    phenomena.push('Hỗn hợp đang hòa tan đồng nhất; thử nhỏ thêm axit, kiềm, muối khác hoặc tăng nhiệt độ để kích hoạt phản ứng.');
  }

  return {
    liquidHex,
    liquidOpacity,
    precipitateHex,
    precipitateAmount,
    gasHex,
    gasRate,
    flameTestHex,
    ph,
    tempDeltaC,
    metalColorHex,
    sodiumSkitter,
    hazardAlert,
    equations,
    phenomena,
  };
}

function makeBeakerGeo(r = 1.05, h = 2.2): THREE.LatheGeometry {
  const pts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(r, 0),
    new THREE.Vector2(r, h),
    new THREE.Vector2(r + 0.08, h + 0.06),
    new THREE.Vector2(r + 0.04, h + 0.09),
    new THREE.Vector2(r - 0.04, h),
    new THREE.Vector2(r - 0.04, 0.06),
    new THREE.Vector2(0, 0.06),
  ];
  return new THREE.LatheGeometry(pts, 36);
}

function makeErlenmeyerGeo(): THREE.LatheGeometry {
  const pts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.02, 0),
    new THREE.Vector2(1.1, 0.18),
    new THREE.Vector2(0.36, 1.55),
    new THREE.Vector2(0.36, 2.15),
    new THREE.Vector2(0.45, 2.25),
    new THREE.Vector2(0.41, 2.28),
    new THREE.Vector2(0.32, 2.13),
    new THREE.Vector2(0.32, 1.55),
    new THREE.Vector2(1.03, 0.2),
    new THREE.Vector2(0.95, 0.06),
    new THREE.Vector2(0, 0.06),
  ];
  return new THREE.LatheGeometry(pts, 36);
}

export const ChemFreeResearch3DSandbox: React.FC<{
  onEarnXP?: (xp: number) => void;
}> = ({ onEarnXP }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraLerpRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const savedBookmarkRef = useRef<CameraBookmarkPose | null>(null);

  const [isSoftwareGl] = useState(() => detectSoftwareGl());
  const [vessel, setVessel] = useState<VesselType>('beaker');
  const [addedReagents, setAddedReagents] = useState<string[]>(['H2O', 'CuSO4']);
  const [tempC, setTempC] = useState<number>(25);
  const [stirSpeed, setStirSpeed] = useState<number>(1); // 0..3
  const [voltageV, setVoltageV] = useState<number>(6); // 0..12
  const [buretteMl, setBuretteMl] = useState<number>(0); // 0..40 mL for titration_burette
  const [isDragOverBench, setIsDragOverBench] = useState(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [reagentCat, setReagentCat] = useState<'all' | ReagentGroup>('all');

  const [sliceEnabled, setSliceEnabled] = useState(false);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>('z');
  const [sliceOffset, setSliceOffset] = useState(0.5);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [hasBookmark, setHasBookmark] = useState(false);
  const [phHistory, setPhHistory] = useState<number[]>([6.6]);
  const [notebookLog, setNotebookLog] = useState<
    { time: string; action: string; summary: string }[]
  >([
    {
      time: '00:00',
      action: 'Khởi tạo mẫu chuẩn CuSO₄ 0,1M',
      summary: 'Dung dịch xanh lam trong suốt; kéo thả hoặc chạm hóa chất để thí nghiệm.',
    },
  ]);

  const outcome = useMemo(
    () => evaluateMixture(addedReagents, tempC, voltageV, vessel, buretteMl),
    [addedReagents, tempC, voltageV, vessel, buretteMl]
  );

  const vesselRef = useRef(vessel);
  vesselRef.current = vessel;
  const outcomeRef = useRef(outcome);
  outcomeRef.current = outcome;
  const tempRef = useRef(tempC);
  tempRef.current = tempC;
  const stirRef = useRef(stirSpeed);
  stirRef.current = stirSpeed;
  const voltageRef = useRef(voltageV);
  voltageRef.current = voltageV;
  const buretteRef = useRef(buretteMl);
  buretteRef.current = buretteMl;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const sliceEnabledRef = useRef(sliceEnabled);
  sliceEnabledRef.current = sliceEnabled;
  const sliceAxisRef = useRef(sliceAxis);
  sliceAxisRef.current = sliceAxis;
  const sliceOffsetRef = useRef(sliceOffset);
  sliceOffsetRef.current = sliceOffset;
  const addedCountRef = useRef(addedReagents.length);
  addedCountRef.current = addedReagents.length;

  const appendNotebook = (action: string, summary: string) => {
    const d = new Date();
    const t = `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    setNotebookLog((prev) => [{ time: t, action, summary }, ...prev].slice(0, 20));
  };

  const handleAddReagent = (reagent: ReagentDef) => {
    const nextList = [...addedReagents, reagent.id];
    setAddedReagents(nextList);
    const nextOutcome = evaluateMixture(nextList, tempC, voltageV, vessel, buretteMl);
    setPhHistory((prev) => [...prev.slice(-29), Number(nextOutcome.ph.toFixed(2))]);
    appendNotebook(
      `+ Thêm ${reagent.formula} (${reagent.nameVi})`,
      nextOutcome.hazardAlert?.title || nextOutcome.equations[0] || nextOutcome.phenomena[0] || `pH = ${nextOutcome.ph.toFixed(1)}`
    );
    onEarnXP?.(5);
  };

  const handleClearVessel = () => {
    setAddedReagents([]);
    setBuretteMl(0);
    setPhHistory([7.0]);
    appendNotebook('Rửa sạch dụng cụ thí nghiệm', 'Bình sạch, sẵn sàng thí nghiệm mới.');
  };

  const applyPresetExperiment = (
    name: string,
    targetVessel: VesselType,
    list: string[],
    t = 25,
    v = 6,
    initBurette = 0
  ) => {
    setVessel(targetVessel);
    setAddedReagents(list);
    setTempC(t);
    setVoltageV(v);
    setBuretteMl(initBurette);
    const out = evaluateMixture(list, t, v, targetVessel, initBurette);
    setPhHistory((prev) => [...prev.slice(-24), Number(out.ph.toFixed(2))]);
    appendNotebook(`Nạp thí nghiệm: ${name}`, out.hazardAlert?.title || out.equations[0] || out.phenomena[0] || '');
    onEarnXP?.(8);
  };

  const exportNotebookMarkdown = () => {
    const lines = [
      `# NHẬT KÝ NGHIÊN CỨU HÓA HỌC 3D TỰ DO — SYNAPSE PRE`,
      `- Dụng cụ: ${VESSELS.find((v) => v.id === vessel)?.label}`,
      `- Hóa chất đã dùng (${addedReagents.length} phần): ${addedReagents.join(', ') || 'Trống'}`,
      `- Nhiệt độ đặt: ${tempC}°C (Thực tế: ${(tempC + outcome.tempDeltaC).toFixed(0)}°C) · pH = ${outcome.ph.toFixed(2)}`,
      '',
      '## Phương trình hóa học phát hiện',
      ...(outcome.equations.length > 0 ? outcome.equations.map((e) => `- ${e}`) : ['- Chưa có phản ứng kết hợp']),
      '',
      '## Hiện tượng quan sát',
      ...outcome.phenomena.map((p) => `- ${p}`),
      '',
      '## Dòng thời gian thao tác',
      ...notebookLog.map((n) => `- [${n.time}] **${n.action}** → ${n.summary}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-chem-research-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth || 840;
    const h = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060d1a);
    scene.fog = new THREE.FogExp2(0x060d1a, 0.02);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(3.9, 2.75, 4.75);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.85));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.localClippingEnabled = true;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    canvasRef.current = renderer.domElement;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    if ('environmentIntensity' in scene) {
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = 0.85;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.2;
    controls.maxDistance = 12;
    controls.target.set(0, 0.35, 0);
    controls.addEventListener('start', () => {
      cameraLerpRef.current = null;
    });
    controlsRef.current = controls;

    // Lights
    scene.add(new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.72));
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.55);
    keyLight.position.set(5, 8, 6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
    }
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);
    const burnerGlowLight = new THREE.PointLight(0xf97316, 0, 7);
    burnerGlowLight.position.set(0, -1.0, 0);
    scene.add(burnerGlowLight);

    // Lab Benchtop & Magnetic Heater Base
    const bench = new THREE.Mesh(
      new THREE.CylinderGeometry(4.8, 5.0, 0.16, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.35 })
    );
    bench.position.y = -1.78;
    bench.receiveShadow = true;
    scene.add(bench);

    const grid = new THREE.GridHelper(9.6, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -1.69;
    scene.add(grid);

    const hotplateBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.34, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.55, roughness: 0.35 })
    );
    hotplateBody.position.set(0, -1.52, 0);
    scene.add(hotplateBody);

    const hotplateCeramicMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: 0xea580c,
      emissiveIntensity: 0,
      roughness: 0.25,
    });
    const hotplateTop = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.06, 36), hotplateCeramicMat);
    hotplateTop.position.set(0, -1.32, 0);
    scene.add(hotplateTop);

    // Root specimen group (for cutaway clip planes)
    const specimenRoot = new THREE.Group();
    scene.add(specimenRoot);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.3,
      roughness: 0.08,
      metalness: 0.04,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Vessel groups
    const beakerGroup = new THREE.Group();
    const beakerGlass = new THREE.Mesh(makeBeakerGeo(1.02, 2.15), glassMat);
    beakerGlass.position.y = -1.28;
    beakerGroup.add(beakerGlass);
    specimenRoot.add(beakerGroup);

    const erlenGroup = new THREE.Group();
    const erlenGlass = new THREE.Mesh(makeErlenmeyerGeo(), glassMat);
    erlenGlass.position.y = -1.28;
    erlenGroup.add(erlenGlass);
    specimenRoot.add(erlenGroup);

    // Acid-Base Titration Burette Stand + Graduated Burette + Falling Drop
    const titrationGroup = new THREE.Group();
    const titrErlen = new THREE.Mesh(makeErlenmeyerGeo(), glassMat);
    titrErlen.position.y = -1.28;
    titrationGroup.add(titrErlen);
    const titrStandRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 3.85, 14),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
    );
    titrStandRod.position.set(-1.18, 0.62, -0.15);
    titrationGroup.add(titrStandRod);
    const titrArm = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.07, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.75, roughness: 0.3 })
    );
    titrArm.position.set(-0.58, 1.92, -0.05);
    titrationGroup.add(titrArm);
    const buretteTube = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.75, 20, 1, true), glassMat);
    buretteTube.position.set(0, 1.98, 0);
    titrationGroup.add(buretteTube);
    const buretteFluidMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });
    const buretteFluid = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 1.6, 16), buretteFluidMat);
    buretteFluid.position.set(0, 1.94, 0);
    titrationGroup.add(buretteFluid);
    const buretteDrop = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 10),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc })
    );
    buretteDrop.position.set(0, 0.9, 0);
    titrationGroup.add(buretteDrop);
    specimenRoot.add(titrationGroup);

    const tubesGroup = new THREE.Group();
    const rackBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.12, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.4 })
    );
    rackBase.position.y = -1.24;
    tubesGroup.add(rackBase);
    [-0.65, 0.65].forEach((tx) => {
      const tMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.1, 24, 1, true), glassMat);
      tMesh.position.set(tx, -0.15, 0);
      tubesGroup.add(tMesh);
    });
    specimenRoot.add(tubesGroup);

    const electroGroup = new THREE.Group();
    const tankMesh = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.85, 1.6), glassMat);
    tankMesh.position.set(0, -0.35, 0);
    electroGroup.add(tankMesh);
    const anode = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 2.0, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 })
    );
    anode.position.set(-0.75, -0.05, 0);
    electroGroup.add(anode);
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.0, 16), cathodeMat);
    cathode.position.set(0.75, -0.05, 0);
    electroGroup.add(cathode);
    specimenRoot.add(electroGroup);

    const burnerGroup = new THREE.Group();
    const bunsenTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 1.35, 20),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.25 })
    );
    bunsenTube.position.set(0, -0.62, 0);
    burnerGroup.add(bunsenTube);
    const ptWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.8, 10),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
    );
    ptWire.rotation.z = Math.PI / 3;
    ptWire.position.set(0.75, 0.55, 0);
    burnerGroup.add(ptWire);
    const ptLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.02, 10, 24),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9 })
    );
    ptLoop.position.set(0, 0.42, 0);
    burnerGroup.add(ptLoop);
    const flameConeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.78,
    });
    const flameCone = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.15, 24), flameConeMat);
    flameCone.position.set(0, 0.62, 0);
    burnerGroup.add(flameCone);
    specimenRoot.add(burnerGroup);

    // Dynamic Liquid + Precipitate + Stir Bar + Submerged Metal Sample
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.55,
      roughness: 0.12,
      clearcoat: 0.9,
      depthWrite: false,
    });
    const liquidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.94, 1.25, 32), liquidMat);
    liquidMesh.position.y = -0.62;
    specimenRoot.add(liquidMesh);

    const pptMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.65 });
    const pptMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.92, 0.36, 28), pptMat);
    pptMesh.position.y = -1.06;
    pptMesh.visible = false;
    specimenRoot.add(pptMesh);

    const stirBar = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.055, 0.42, 8, 12),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    stirBar.rotation.z = Math.PI / 2;
    stirBar.position.y = -1.16;
    specimenRoot.add(stirBar);

    const metalSampleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.28 });
    const metalSample = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.78, 0.08), metalSampleMat);
    metalSample.position.set(0.32, -0.82, 0);
    metalSample.rotation.z = -0.25;
    metalSample.visible = false;
    specimenRoot.add(metalSample);

    // GPU Particles for bubbles / sparks / vapors
    const gpuPool = new GPUParticlePool(220, 0.048, 0xe0f2fe, 0xfacc15);
    scene.add(gpuPool.mesh);

    // Crisp 3D Telemetry Billboard Labels
    const labelGroup = new THREE.Group();
    scene.add(labelGroup);
    const statusLabel = createTroikaLabel({
      text: 'pH 7.0 · 25°C',
      position: [0, 1.65, 0],
      fontSize: 0.27,
      color: 0x7dd3fc,
    });
    labelGroup.add(statusLabel);

    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.5);

    let cancelFrame = () => {};
    let disposed = false;
    let elapsed = 0;
    let last = performance.now();
    let emitAcc = 0;

    const targetLiquidCol = new THREE.Color(0x0ea5e9);
    const targetFlameCol = new THREE.Color(0x38bdf8);

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const v = vesselRef.current;
      const out = outcomeRef.current;
      const tC = tempRef.current + out.tempDeltaC;
      const stir = stirRef.current;
      const volt = voltageRef.current;

      beakerGroup.visible = v === 'beaker';
      erlenGroup.visible = v === 'erlenmeyer';
      titrationGroup.visible = v === 'titration_burette';
      tubesGroup.visible = v === 'dual_tubes';
      electroGroup.visible = v === 'electrolysis';
      burnerGroup.visible = v === 'flame_burner';

      const showFluid = (v !== 'flame_burner' && addedCountRef.current > 0) || v === 'titration_burette';
      liquidMesh.visible = showFluid;
      pptMesh.visible = showFluid && out.precipitateHex !== null && out.precipitateAmount > 0.05;
      stirBar.visible = showFluid && (v === 'beaker' || v === 'erlenmeyer' || v === 'titration_burette');
      metalSample.visible = showFluid && out.metalColorHex !== null;

      if (!pausedRef.current) {
        elapsed += dt;

        // Hazard vibration + warning flash when an explosive mix occurs
        if (out.hazardAlert?.level === 'explosion') {
          specimenRoot.position.x = Math.sin(elapsed * 55) * 0.045;
          specimenRoot.position.z = Math.cos(elapsed * 47) * 0.045;
          burnerGlowLight.color.setHex(0xef4444);
          burnerGlowLight.intensity = 2.6 + Math.sin(elapsed * 18) * 1.1;
        } else {
          specimenRoot.position.x = THREE.MathUtils.damp(specimenRoot.position.x, 0, 12, dt);
          specimenRoot.position.z = THREE.MathUtils.damp(specimenRoot.position.z, 0, 12, dt);
          burnerGlowLight.color.setHex(0xf97316);
        }

        // Liquid fill height & color transition
        const fill =
          v === 'titration_burette'
            ? Math.min(1.25, 0.65 + (buretteRef.current / 40) * 0.55)
            : Math.min(1.42, 0.35 + addedCountRef.current * 0.13);
        liquidMesh.scale.y = THREE.MathUtils.damp(liquidMesh.scale.y, fill / 1.25, 7, dt);
        if (v === 'erlenmeyer' || v === 'titration_burette') {
          liquidMesh.scale.x = 0.72;
          liquidMesh.scale.z = 0.72;
        } else if (v === 'electrolysis') {
          liquidMesh.scale.x = 1.15;
          liquidMesh.scale.z = 0.72;
        } else {
          liquidMesh.scale.x = 0.96;
          liquidMesh.scale.z = 0.96;
        }
        liquidMesh.position.y = -1.22 + (fill * 0.5);

        if (v === 'titration_burette') {
          const remFrac = Math.max(0.08, 1 - buretteRef.current / 42);
          buretteFluid.scale.y = remFrac;
          buretteFluid.position.y = 1.94 - (1 - remFrac) * 0.8;
          const dropPhase = (elapsed * 2.2) % 1;
          buretteDrop.position.y = 1.05 - dropPhase * 1.55;
        }

        targetLiquidCol.setHex(out.liquidHex);
        liquidMat.color.lerp(targetLiquidCol, 0.1);
        liquidMat.opacity = THREE.MathUtils.damp(liquidMat.opacity, out.liquidOpacity, 6, dt);

        if (out.precipitateHex !== null) {
          pptMat.color.setHex(out.precipitateHex);
          pptMesh.scale.y = THREE.MathUtils.damp(pptMesh.scale.y, out.precipitateAmount, 5, dt);
        }
        if (out.metalColorHex !== null) {
          metalSampleMat.color.setHex(out.metalColorHex);
          if (out.sodiumSkitter) {
            metalSample.position.set(Math.sin(elapsed * 6.5) * 0.45, liquidMesh.position.y + fill * 0.45, Math.cos(elapsed * 5.2) * 0.42);
            metalSample.scale.setScalar(0.55);
          } else {
            metalSample.position.set(0.32, -0.85, 0);
            metalSample.scale.setScalar(1.0);
          }
        }

        if (v === 'electrolysis' && volt >= 2 && addedCountRef.current > 0) {
          cathodeMat.color.setHex(out.equations.some((e) => e.includes('Cu↓')) ? 0xea580c : 0x64748b);
        }

        // Stirrer rotation
        if (stir > 0 && stirBar.visible) {
          stirBar.rotation.y += dt * (4 + stir * 5.5);
        }

        // Hotplate glow
        const heatFrac = Math.max(0, (tempRef.current - 25) / 75);
        hotplateCeramicMat.emissiveIntensity = THREE.MathUtils.damp(hotplateCeramicMat.emissiveIntensity, heatFrac * 0.85, 6, dt);
        if (out.hazardAlert?.level !== 'explosion') {
          burnerGlowLight.intensity = v === 'flame_burner' ? 1.8 : heatFrac * 1.4;
        }

        // Flame cone flicker
        if (v === 'flame_burner') {
          targetFlameCol.setHex(out.flameTestHex);
          flameConeMat.color.lerp(targetFlameCol, 0.16);
          flameCone.scale.set(1 + Math.sin(elapsed * 22) * 0.07, 1 + Math.cos(elapsed * 19) * 0.12, 1);
        }

        // Gas bubbles / thermal steam / explosion sparks emission
        emitAcc += dt;
        const rate = out.gasRate > 0 ? out.gasRate : tC > 72 && showFluid ? 0.35 : 0;
        if (rate > 0 && emitAcc > 0.045 / Math.max(0.25, rate)) {
          emitAcc = 0;
          const isExp = out.hazardAlert?.level === 'explosion';
          const spawnY = out.sodiumSkitter || isExp ? liquidMesh.position.y + 0.35 : -1.0;
          const bx = (Math.random() - 0.5) * 0.9;
          const bz = (Math.random() - 0.5) * 0.9;
          gpuPool.spawn(
            bx,
            spawnY,
            bz,
            isExp || out.sodiumSkitter ? (Math.random() - 0.5) * 2.4 : (Math.random() - 0.5) * 0.25,
            isExp ? 2.1 + Math.random() * 1.4 : 1.4 + Math.random() * 1.1,
            isExp || out.sodiumSkitter ? (Math.random() - 0.5) * 2.4 : (Math.random() - 0.5) * 0.25,
            0.9,
            isExp ? 1.35 : 1.0,
            isExp ? (Math.random() > 0.5 ? 0xf97316 : 0xef4444) : out.gasHex ?? 0xe2e8f0
          );
        }

        gpuPool.update(dt, 0);
      }

      // Sync label text cleanly without spamming rebuild
      const nextText =
        v === 'flame_burner'
          ? `Thử Ngọn Lửa · ${tempRef.current}°C`
          : v === 'titration_burette'
          ? `Buret ${buretteRef.current.toFixed(1)} mL · pH ${out.ph.toFixed(2)}`
          : `pH ${out.ph.toFixed(1)} · ${tC.toFixed(0)}°C${out.equations.length > 0 ? ' · Phản ứng' : ''}`;
      if (statusLabel.text !== nextText) {
        statusLabel.text = nextText;
        statusLabel.sync();
      }
      updateBillboardLabels(labelGroup, camera);

      // Cutaway clip plane
      if (sliceEnabledRef.current) {
        updateClipPlaneFromState(clipPlane, sliceAxisRef.current, sliceOffsetRef.current);
        applyClipPlaneToObject(specimenRoot, [clipPlane]);
      } else {
        applyClipPlaneToObject(specimenRoot, null);
      }

      if (cameraLerpRef.current) {
        camera.position.lerp(cameraLerpRef.current.pos, 0.14);
        controls.target.lerp(cameraLerpRef.current.target, 0.14);
        if (camera.position.distanceTo(cameraLerpRef.current.pos) < 0.05) cameraLerpRef.current = null;
      }
      controls.update();
      renderer.render(scene, camera);

      scheduleSyncedGlFrame(renderer, isSoftwareGl, tick, (fn) => {
        cancelFrame = fn;
      });
    };

    scheduleSyncedGlFrame(renderer, isSoftwareGl, tick, (fn) => {
      cancelFrame = fn;
    });

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 840;
      const nh = container.clientHeight || 520;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(container);

    return () => {
      disposed = true;
      cancelFrame();
      ro?.disconnect();
      statusLabel.dispose();
      gpuPool.dispose();
      controls.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [isSoftwareGl]);

  const setCameraPreset = (preset: QuickCamPreset) => {
    if (preset === 'iso') {
      cameraLerpRef.current = { pos: new THREE.Vector3(3.9, 2.75, 4.75), target: new THREE.Vector3(0, 0.35, 0) };
    } else if (preset === 'top') {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 6.6, 0.9), target: new THREE.Vector3(0, 0, 0) };
    } else {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 0.8, 5.4), target: new THREE.Vector3(0, 0.25, 0) };
    }
  };

  const filteredReagents = useMemo(
    () => (reagentCat === 'all' ? REAGENTS : REAGENTS.filter((r) => r.group === reagentCat)),
    [reagentCat]
  );

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="rounded-2xl border border-emerald-500/35 bg-slate-950/95 p-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
              Phòng Thí Nghiệm Hóa Học 3D Tự Do (Chế Độ Nhà Nghiên Cứu)
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Tự do chọn dụng cụ, pha chế 25 hóa chất, điều chỉnh nhiệt độ – khuấy từ – điện phân và ghi nhật ký phản ứng thực tế
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{paused ? 'Tiếp tục' : 'Tạm dừng'}</span>
          </button>
          <button
            type="button"
            onClick={handleClearVessel}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Rửa bình mới</span>
          </button>
          <button
            type="button"
            onClick={() => captureCanvasPng(canvasRef.current, 'synapse-chem-research-3d')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Ảnh PNG</span>
          </button>
          <button
            type="button"
            onClick={exportNotebookMarkdown}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Nhật Ký</span>
          </button>
        </div>
      </div>

      {/* Main Split: 3D Lab Bench + Researcher Reagent Rack */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Left/Center 3D Viewport + Vessel & Instrument Controls */}
        <div className="xl:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
          {/* Vessel Selector Row */}
          <div className="p-2.5 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center gap-1.5">
            {VESSELS.map((vs) => (
              <button
                key={vs.id}
                type="button"
                onClick={() => setVessel(vs.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition-colors ${
                  vessel === vs.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-emerald-400'
                }`}
              >
                {vs.label}
              </button>
            ))}
          </div>

          <Pre3DProControlsBar
            isEn={false}
            sliceEnabled={sliceEnabled}
            onToggleSlice={() => setSliceEnabled((v) => !v)}
            sliceAxis={sliceAxis}
            onChangeSliceAxis={setSliceAxis}
            sliceOffset={sliceOffset}
            onChangeSliceOffset={setSliceOffset}
            showTelemetry={showTelemetry}
            onToggleTelemetry={() => setShowTelemetry((v) => !v)}
            hasBookmark={hasBookmark}
            onSaveBookmark={() => {
              if (cameraRef.current && controlsRef.current) {
                savedBookmarkRef.current = {
                  pos: [cameraRef.current.position.x, cameraRef.current.position.y, cameraRef.current.position.z],
                  target: [controlsRef.current.target.x, controlsRef.current.target.y, controlsRef.current.target.z],
                };
                setHasBookmark(true);
              }
            }}
            onRecallBookmark={() => {
              const bm = savedBookmarkRef.current;
              if (bm) {
                cameraLerpRef.current = {
                  pos: new THREE.Vector3(...bm.pos),
                  target: new THREE.Vector3(...bm.target),
                };
              }
            }}
            onCameraPreset={setCameraPreset}
            onResetCamera={() => setCameraPreset('iso')}
          />

          {/* 3D Canvas with Drag & Drop Reagent Target + Safety Alert Overlay */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverBench(true);
            }}
            onDragLeave={() => setIsDragOverBench(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverBench(false);
              const rid = e.dataTransfer.getData('text/reagent-id');
              const reagent = REAGENTS.find((r) => r.id === rid);
              if (reagent) handleAddReagent(reagent);
            }}
            className={`relative w-full h-[520px] sm:h-[580px] bg-[#060d1a] transition-all ${
              isDragOverBench ? 'ring-4 ring-inset ring-emerald-400/80' : ''
            }`}
          >
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
            {isDragOverBench && (
              <div className="pointer-events-none absolute inset-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-500/10 flex items-center justify-center">
                <span className="px-4 py-2 rounded-xl bg-slate-950/90 border border-emerald-400 text-emerald-300 text-xs font-extrabold">
                  Thả hóa chất vào dụng cụ 3D để pha trộn ngay
                </span>
              </div>
            )}
          </div>

          {/* Safety Explosion / Hazard Banner */}
          {outcome.hazardAlert && (
            <div
              className={`px-4 py-3 border-t flex items-start gap-3 text-xs ${
                outcome.hazardAlert.level === 'explosion'
                  ? 'bg-rose-950/90 border-rose-500/60 text-rose-100'
                  : 'bg-amber-950/90 border-amber-500/60 text-amber-100'
              }`}
            >
              {outcome.hazardAlert.level === 'explosion' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-extrabold">{outcome.hazardAlert.title}</div>
                <p className="text-[11px] opacity-90">{outcome.hazardAlert.detail}</p>
                <p className="text-[11px] font-semibold text-emerald-300">
                  Quy trình an toàn: {outcome.hazardAlert.protocol}
                </p>
              </div>
            </div>
          )}

          {/* Burette Titration Slider Bar when vessel === 'titration_burette' */}
          {vessel === 'titration_burette' && (
            <div className="px-3.5 py-2.5 border-t border-slate-800 bg-slate-900 text-xs text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold text-pink-300">
                <Droplets className="w-4 h-4" />
                <span>Thể tích NaOH 0,1M nhỏ từ Buret vào 20 mL HCl 0,1M:</span>
                <span className="font-mono tabular-nums text-white bg-pink-500/20 border border-pink-400/40 px-2 py-0.5 rounded">
                  {buretteMl.toFixed(1)} mL
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={0.5}
                  value={buretteMl}
                  onChange={(e) => {
                    const nextMl = Number(e.target.value);
                    setBuretteMl(nextMl);
                    const out = evaluateMixture(addedReagents, tempC, voltageV, 'titration_burette', nextMl);
                    setPhHistory((prev) => [...prev.slice(-29), Number(out.ph.toFixed(2))]);
                  }}
                  className="flex-1 accent-pink-500 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextMl = Math.min(40, Number((buretteMl + 0.5).toFixed(1)));
                    setBuretteMl(nextMl);
                    const out = evaluateMixture(addedReagents, tempC, voltageV, 'titration_burette', nextMl);
                    setPhHistory((prev) => [...prev.slice(-29), Number(out.ph.toFixed(2))]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold cursor-pointer whitespace-nowrap"
                >
                  + Nhỏ 0,5 mL
                </button>
              </div>
            </div>
          )}

          {/* Instrument Conditions Bar */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/95 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-white">
            <label className="space-y-1 rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
              <div className="flex justify-between font-bold">
                <span className="inline-flex items-center gap-1 text-orange-300">
                  <Flame className="w-3.5 h-3.5" /> Bếp gia nhiệt
                </span>
                <span className="font-mono tabular-nums text-amber-300">
                  {tempC}°C {outcome.tempDeltaC > 0 ? `(+${outcome.tempDeltaC}°C)` : ''}
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </label>

            <label className="space-y-1 rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
              <div className="flex justify-between font-bold">
                <span className="inline-flex items-center gap-1 text-sky-300">
                  <RotateCcw className="w-3.5 h-3.5" /> Máy khuấy từ
                </span>
                <span className="font-mono tabular-nums text-sky-300">
                  {stirSpeed === 0 ? 'Tắt' : `${stirSpeed * 300} rpm`}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={stirSpeed}
                onChange={(e) => setStirSpeed(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </label>

            <label className="space-y-1 rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
              <div className="flex justify-between font-bold">
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <Zap className="w-3.5 h-3.5" /> Nguồn DC Điện phân
                </span>
                <span className="font-mono tabular-nums text-emerald-300">{voltageV} V</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={voltageV}
                onChange={(e) => setVoltageV(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Right Panel: Reagent Shelf + Presets + Live Lab Notebook */}
        <div className="xl:col-span-4 space-y-4">
          {/* Reagent Shelf */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-white space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Beaker className="w-4 h-4" />
                <span>Tủ Hóa Chất (Kéo thả vào bình / Chạm)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Đã dùng: {addedReagents.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {(
                [
                  { id: 'all', label: 'Tất cả' },
                  { id: 'acid', label: 'Axit' },
                  { id: 'base', label: 'Bazơ' },
                  { id: 'salt', label: 'Muối' },
                  { id: 'metal', label: 'Kim loại' },
                  { id: 'indicator', label: 'Chỉ thị' },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setReagentCat(g.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    reagentCat === g.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5 max-h-[210px] overflow-y-auto pr-1">
              {filteredReagents.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/reagent-id', r.id);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => handleAddReagent(r)}
                  className="rounded-lg border border-slate-800 bg-slate-900/80 hover:border-emerald-400 hover:bg-slate-800 p-2 text-left transition-colors cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{r.formula}</span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: r.colorHex }}
                    />
                  </div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">{r.nameVi}</div>
                </button>
              ))}
            </div>

            {/* Active Mixture Pills */}
            <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-2.5 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Thành phần hiện có trong bình:</div>
              <div className="flex flex-wrap gap-1">
                {addedReagents.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">Bình đang rỗng — hãy chọn hóa chất phía trên</span>
                ) : (
                  addedReagents.map((id, i) => (
                    <span
                      key={`${id}-${i}`}
                      className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 text-[10px] font-mono font-bold"
                    >
                      {REAGENTS.find((r) => r.id === id)?.formula || id}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Suggested Free Experiments */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-white space-y-2">
            <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thí nghiệm Gợi ý Nhanh cho Nhà Nghiên Cứu</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => applyPresetExperiment('Chuẩn độ HCl + NaOH', 'titration_burette', ['HCl', 'Phenol'], 25, 0, 12)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-left cursor-pointer"
              >
                Chuẩn độ Buret 3D
              </button>
              <button
                type="button"
                onClick={() => applyPresetExperiment('Cảnh báo Nổ: Na + HCl', 'beaker', ['Na', 'HCl'], 30)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-[11px] font-semibold text-left cursor-pointer"
              >
                Mô phỏng An toàn: Na + HCl
              </button>
              <button
                type="button"
                onClick={() => applyPresetExperiment('Phức Đồng Xanh Thẫm', 'erlenmeyer', ['CuSO4', 'NH3', 'NH3'])}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-left cursor-pointer"
              >
                CuSO₄ + NH₃ dư
              </button>
              <button
                type="button"
                onClick={() => applyPresetExperiment('Khí Nâu Đỏ Cu + HNO₃', 'erlenmeyer', ['Cu', 'HNO3', 'HNO3'], 45)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-left cursor-pointer"
              >
                Cu + HNO₃ → NO₂↑
              </button>
              <button
                type="button"
                onClick={() => applyPresetExperiment('Điện phân CuSO₄', 'electrolysis', ['H2O', 'CuSO4'], 25, 9)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-left cursor-pointer"
              >
                Điện phân CuSO₄ 9V
              </button>
              <button
                type="button"
                onClick={() => applyPresetExperiment('Phức Đỏ Máu Fe³⁺', 'beaker', ['FeCl3', 'KSCN'])}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-left cursor-pointer"
              >
                FeCl₃ + KSCN
              </button>
            </div>
          </div>

          {/* Live Reactions & Lab Notebook */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-white space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-cyan-300">Sổ Tay &amp; Kết Quả Phản Ứng</span>
              <span className="font-mono font-bold text-emerald-300">pH {outcome.ph.toFixed(2)}</span>
            </div>

            {showTelemetry && (
              <MiniTelemetryChart
                title="Biến thiên pH hỗn hợp"
                series={[
                  {
                    id: 'ph',
                    label: 'pH',
                    color: '#34d399',
                    unit: 'pH',
                    values: phHistory,
                  },
                ]}
              />
            )}

            {outcome.equations.length > 0 && (
              <div className="space-y-1">
                {outcome.equations.map((eq, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-emerald-500/10 border border-emerald-500/35 px-2.5 py-1.5 text-[11px] font-mono font-bold text-emerald-200"
                  >
                    {eq}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1 text-xs text-slate-300">
              {outcome.phenomena.map((p, i) => (
                <p key={i} className="leading-snug">
                  • {p}
                </p>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-2 max-h-[130px] overflow-y-auto space-y-1 text-[10px]">
              {notebookLog.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                  <span className="font-mono text-slate-500 shrink-0">[{entry.time}]</span>
                  <span className="text-slate-200 font-semibold">{entry.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
