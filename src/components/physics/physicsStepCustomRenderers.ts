import { PhysicsParamBound } from '../../data/physicsDomainsData';
import {
  Physics2DFlags,
  Physics2DOverlayState,
  Physics2DTelemetry
} from './physics2DEngine';

export type CustomStepSimId =
  | 'average_velocity_stages'
  | 'work_power_joule'
  | 'joule_lenz_heat'
  | 'vector_addition_2d'
  | 'distance_displacement_rel'
  | 'hooke_spring_stat'
  | 'phase_change_heating'
  | 'measurement_error_lab'
  | 'bohr_energy_levels'
  | 'em_wave_3axis';

export interface CustomStepSimSpec {
  id: CustomStepSimId;
  title: string;
  formula: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, PhysicsParamBound>;
  presets: {
    label: string;
    description: string;
    params: Record<string, number>;
  }[];
}

export const CUSTOM_STEP_SIM_SPECS: Record<CustomStepSimId, CustomStepSimSpec> = {
  average_velocity_stages: {
    id: 'average_velocity_stages',
    title: 'Vận Tốc Trung Bình Chia Chặng & Đồ Thị s(t)',
    formula: 'v_tb = (s₁ + s₂) / (t₁ + t₂) · Nửa đường bằng: 2v₁v₂/(v₁+v₂)',
    defaultParams: { v1: 40, v2: 60, splitRatio: 50, totalDist: 120 },
    paramBounds: {
      v1: { min: 10, max: 120, step: 5, unit: 'km/h', label: 'Tốc độ chặng 1 (v₁)' },
      v2: { min: 10, max: 120, step: 5, unit: 'km/h', label: 'Tốc độ chặng 2 (v₂)' },
      splitRatio: { min: 20, max: 80, step: 5, unit: '%', label: 'Tỉ lệ chặng 1 (s₁/S)' }
    },
    presets: [
      {
        label: 'Bẫy 40 & 60 (s₁ = s₂)',
        description: 'Nửa đầu 40 km/h, nửa sau 60 km/h → v_tb = 48 km/h',
        params: { v1: 40, v2: 60, splitRatio: 50, totalDist: 120 }
      },
      {
        label: 'Xe đạp (12 & 20 km/h)',
        description: 'v_tb = 15.0 km/h (< 16 km/h)',
        params: { v1: 12, v2: 20, splitRatio: 50, totalDist: 60 }
      },
      {
        label: 'Chặng đầu dài (70%)',
        description: 's₁ = 70% tổng đường ở tốc độ 30 km/h',
        params: { v1: 30, v2: 90, splitRatio: 70, totalDist: 100 }
      }
    ]
  },
  work_power_joule: {
    id: 'work_power_joule',
    title: 'Công Cơ Học (A = F·s·cosα), Công Suất & Hiệu Suất',
    formula: 'A = F·s·cosα · P = A/t = F·v · H = A_ích / A_tp',
    defaultParams: { force: 80, angle: 0, mass: 10, mu: 0.15 },
    paramBounds: {
      force: { min: 20, max: 200, step: 10, unit: 'N', label: 'Lực kéo F' },
      angle: { min: 0, max: 75, step: 5, unit: '°', label: 'Góc kéo α' },
      mu: { min: 0, max: 0.5, step: 0.05, unit: '', label: 'Hệ số ma sát μ' }
    },
    presets: [
      {
        label: 'Kéo ngang (α = 0°)',
        description: 'Toàn bộ lực sinh công tối đa cos0° = 1',
        params: { force: 80, angle: 0, mass: 10, mu: 0.15 }
      },
      {
        label: 'Kéo chếch 35°',
        description: 'Phân tích Fx = Fcosα, Fy = Fsinα giảm áp lực N',
        params: { force: 90, angle: 35, mass: 10, mu: 0.2 }
      },
      {
        label: 'Không ma sát (μ = 0)',
        description: 'Hiệu suất đạt 100% — toàn bộ công chuyển thành Wđ',
        params: { force: 70, angle: 15, mass: 10, mu: 0 }
      }
    ]
  },
  joule_lenz_heat: {
    id: 'joule_lenz_heat',
    title: 'Công Suất Điện (P = UI) & Định Luật Jun – Len-xơ',
    formula: 'P = U·I = I²R · Q = I²·R·t = m·c·ΔT',
    defaultParams: { voltage: 12, resistance: 6, waterMass: 0.5 },
    paramBounds: {
      voltage: { min: 3, max: 36, step: 3, unit: 'V', label: 'Hiệu điện thế U' },
      resistance: { min: 2, max: 30, step: 2, unit: 'Ω', label: 'Điện trở dây đốt R' },
      waterMass: { min: 0.2, max: 2.0, step: 0.2, unit: 'kg', label: 'Khối lượng nước m' }
    },
    presets: [
      {
        label: 'Đun chuẩn (12V · 6Ω)',
        description: 'I = 2A, P = 24W làm nước ấm dần',
        params: { voltage: 12, resistance: 6, waterMass: 0.5 }
      },
      {
        label: 'Tăng áp gấp đôi (24V)',
        description: 'U tăng 2 → P = U²/R tăng 4 lần!',
        params: { voltage: 24, resistance: 6, waterMass: 0.5 }
      },
      {
        label: 'Dây đốt R nhỏ (2Ω)',
        description: 'Cùng U nhưng R giảm → dòng lớn tỏa nhiệt cực nhanh',
        params: { voltage: 12, resistance: 2, waterMass: 0.4 }
      }
    ]
  },
  vector_addition_2d: {
    id: 'vector_addition_2d',
    title: 'Tổng Hợp Vectơ, Quy Tắc Hình Bình Hành & Lượng Giác Oxy',
    formula: 'R² = F₁² + F₂² + 2F₁F₂cosα · Fx = F·cosα · Fy = F·sinα',
    defaultParams: { f1: 40, f2: 30, angleDeg: 60 },
    paramBounds: {
      f1: { min: 10, max: 90, step: 5, unit: 'N', label: 'Độ lớn F₁' },
      f2: { min: 10, max: 90, step: 5, unit: 'N', label: 'Độ lớn F₂' },
      angleDeg: { min: 0, max: 180, step: 5, unit: '°', label: 'Góc xen giữa α' }
    },
    presets: [
      {
        label: 'Vuông góc (α = 90°)',
        description: 'Tam giác vuông Pitago: 30–40–50 N',
        params: { f1: 40, f2: 30, angleDeg: 90 }
      },
      {
        label: 'Góc nhọn 60°',
        description: 'Hợp lực theo đường chéo hình bình hành',
        params: { f1: 40, f2: 30, angleDeg: 60 }
      },
      {
        label: 'Cùng phương ngược chiều (180°)',
        description: 'Hợp lực cực tiểu R = |F₁ - F₂|',
        params: { f1: 50, f2: 30, angleDeg: 180 }
      }
    ]
  },
  distance_displacement_rel: {
    id: 'distance_displacement_rel',
    title: 'Quãng Đường (s), Độ Dịch Chuyển (d) & Cộng Vận Tốc',
    formula: 's = Σ|Δx| ≥ |d| · v₁₃ = v₁₂ + v₂₃ (Vectơ qua sông)',
    defaultParams: { v1: 4.0, vStream: 3.0, riverWidth: 40 },
    paramBounds: {
      v1: { min: 1.5, max: 10, step: 0.5, unit: 'm/s', label: 'Vận tốc ca nô v₁₂' },
      vStream: { min: 0, max: 8, step: 0.5, unit: 'm/s', label: 'Vận tốc dòng nước v₂₃' },
      riverWidth: { min: 20, max: 80, step: 5, unit: 'm', label: 'Chiều rộng sông L' }
    },
    presets: [
      {
        label: 'Tam giác vuông 3–4–5',
        description: 'v₁₂ = 4 m/s ⊥ v₂₃ = 3 m/s → v₁₃ = 5 m/s',
        params: { v1: 4.0, vStream: 3.0, riverWidth: 40 }
      },
      {
        label: 'Nước chảy xiết (6 m/s)',
        description: 'Độ trôi hạ lưu rất lớn so với độ rộng L',
        params: { v1: 3.0, vStream: 6.0, riverWidth: 45 }
      },
      {
        label: 'Nước đứng yên (v₂₃ = 0)',
        description: 'Quãng đường đi thẳng bằng đúng độ dịch chuyển',
        params: { v1: 5.0, vStream: 0.0, riverWidth: 40 }
      }
    ]
  },
  hooke_spring_stat: {
    id: 'hooke_spring_stat',
    title: 'Biến Dạng Lò Xo & Định Luật Hooke (F_đh = k·|Δl|)',
    formula: 'F_đh = k · |l - l₀| = m·g (khi treo cân bằng)',
    defaultParams: { k: 50, mass: 1.5, l0: 20 },
    paramBounds: {
      k: { min: 20, max: 160, step: 10, unit: 'N/m', label: 'Độ cứng k' },
      mass: { min: 0.2, max: 5.0, step: 0.2, unit: 'kg', label: 'Vật nặng treo m' },
      l0: { min: 10, max: 35, step: 5, unit: 'cm', label: 'Chiều dài tự nhiên l₀' }
    },
    presets: [
      {
        label: 'Treo chuẩn (1.5 kg)',
        description: 'P = 14.7 N → dãn Δl = 29.4 cm',
        params: { k: 50, mass: 1.5, l0: 20 }
      },
      {
        label: 'Lò xo rất cứng (150 N/m)',
        description: 'Cùng vật nặng nhưng độ dãn giảm 3 lần',
        params: { k: 150, mass: 1.5, l0: 20 }
      },
      {
        label: 'Vật nặng vượt ngưỡng (4.6 kg)',
        description: 'Kiểm tra giới hạn đàn hồi khi lực kéo quá lớn',
        params: { k: 40, mass: 4.6, l0: 20 }
      }
    ]
  },
  phase_change_heating: {
    id: 'phase_change_heating',
    title: 'Đồ Thị Chuyển Thể T(t), Nhiệt Nóng Chảy (λ) & Hóa Hơi (L)',
    formula: 'Q = m·c·ΔT (Tăng nhiệt) · Q = λ·m (0°C) · Q = L·m (100°C)',
    defaultParams: { power: 1200, mass: 0.5, tStart: -20 },
    paramBounds: {
      power: { min: 400, max: 2400, step: 200, unit: 'W', label: 'Công suất bếp P' },
      mass: { min: 0.2, max: 1.5, step: 0.1, unit: 'kg', label: 'Khối lượng nước đá m' },
      tStart: { min: -40, max: 0, step: 5, unit: '°C', label: 'Nhiệt độ ban đầu' }
    },
    presets: [
      {
        label: 'Đun chuẩn từ -20°C',
        description: 'Quan sát rõ cả hai đoạn nằm ngang 0°C và 100°C',
        params: { power: 1200, mass: 0.5, tStart: -20 }
      },
      {
        label: 'Bếp công suất cao (2200W)',
        description: 'Độ dốc tăng nhiệt lớn, rút ngắn thời gian chuyển thể',
        params: { power: 2200, mass: 0.5, tStart: -20 }
      },
      {
        label: 'Khối lượng lớn (1.2 kg)',
        description: 'Cần lượng nhiệt Q = λm và Lm rất dài tại 0°C và 100°C',
        params: { power: 1200, mass: 1.2, tStart: -10 }
      }
    ]
  },
  measurement_error_lab: {
    id: 'measurement_error_lab',
    title: 'Sai Số Hệ Thống, Sai Số Ngẫu Nhiên & Phép Đo Trực Tiếp',
    formula: 'x̄ = Σxᵢ/n · Δx̄ = Σ|x̄ - xᵢ|/n · δ = (Δx / x̄) × 100%',
    defaultParams: { trueVal: 2.0, randomJitter: 0.06, sysBias: 0.04 },
    paramBounds: {
      trueVal: { min: 1.0, max: 5.0, step: 0.2, unit: 's', label: 'Giá trị thực x₀' },
      randomJitter: { min: 0.01, max: 0.2, step: 0.01, unit: 's', label: 'Phân tán ngẫu nhiên' },
      sysBias: { min: -0.15, max: 0.15, step: 0.01, unit: 's', label: 'Lệch điểm 0 (hệ thống)' }
    },
    presets: [
      {
        label: 'Đo chuẩn lớp 10',
        description: 'Phân tán vừa phải, lệch 0 nhẹ +0.04 s',
        params: { trueVal: 2.0, randomJitter: 0.06, sysBias: 0.04 }
      },
      {
        label: 'Lệch điểm 0 lớn (+0.14s)',
        description: 'Mọi điểm đo chụm lại nhưng lệch xa giá trị thực (sai số hệ thống)',
        params: { trueVal: 2.0, randomJitter: 0.02, sysBias: 0.14 }
      },
      {
        label: 'Bấm tay phân tán cao',
        description: 'Không lệch hệ thống nhưng sai số ngẫu nhiên lớn',
        params: { trueVal: 2.0, randomJitter: 0.18, sysBias: 0 }
      }
    ]
  },
  bohr_energy_levels: {
    id: 'bohr_energy_levels',
    title: 'Mẫu Nguyên Tử Bohr & Quang Phổ Vạch Hyđrô (E_n = -13.6/n²)',
    formula: 'ε = h·f = h·c/λ = E_cao - E_thấp · r_n = n²·r₀',
    defaultParams: { nHigh: 3, nLow: 2 },
    paramBounds: {
      nHigh: { min: 2, max: 6, step: 1, unit: '', label: 'Quỹ đạo đầu (n)' },
      nLow: { min: 1, max: 5, step: 1, unit: '', label: 'Quỹ đạo cuối (m)' }
    },
    presets: [
      {
        label: 'Vạch Đỏ Hα (3 → 2)',
        description: 'Bức xạ ánh sáng đỏ Balmer λ ≈ 656 nm',
        params: { nHigh: 3, nLow: 2 }
      },
      {
        label: 'Vạch Lam Hβ (4 → 2)',
        description: 'Bức xạ màu lam lục Balmer λ ≈ 486 nm',
        params: { nHigh: 4, nLow: 2 }
      },
      {
        label: 'Dãy Tử Ngoại Lyman (2 → 1)',
        description: 'Bước nhảy năng lượng lớn 10.2 eV (λ = 121.6 nm)',
        params: { nHigh: 2, nLow: 1 }
      }
    ]
  },
  em_wave_3axis: {
    id: 'em_wave_3axis',
    title: 'Sóng Điện Từ Ngang (E ⊥ B ⊥ v) & Điều Chế Sóng Vô Tuyến',
    formula: 'c = λ · f ≈ 3×10⁸ m/s · E, B dao động cùng pha, vuông góc',
    defaultParams: { freqScale: 120, ampE: 65, modDepth: 50 },
    paramBounds: {
      freqScale: { min: 30, max: 300, step: 15, unit: 'MHz', label: 'Tần số sóng f' },
      ampE: { min: 25, max: 100, step: 5, unit: 'V/m', label: 'Biên độ điện trường E₀' },
      modDepth: { min: 0, max: 85, step: 5, unit: '%', label: 'Độ sâu điều chế AM' }
    },
    presets: [
      {
        label: 'Sóng FM (120 MHz)',
        description: 'Sóng mang ngang E ⊥ B thuần túy không điều chế biên độ',
        params: { freqScale: 120, ampE: 65, modDepth: 0 }
      },
      {
        label: 'Sóng Điều chế AM (60%)',
        description: 'Đường bao tín hiệu âm tần điều chế biên độ sóng cao tần',
        params: { freqScale: 180, ampE: 65, modDepth: 60 }
      },
      {
        label: 'Tần số cao bước sóng ngắn',
        description: 'λ = c/f giảm tỉ lệ nghịch khi tăng tần số f',
        params: { freqScale: 270, ampE: 75, modDepth: 0 }
      }
    ]
  }
};

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, isDark: boolean) {
  ctx.save();
  ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)';
  ctx.lineWidth = 1;
  const step = 32;
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.1)' : 'rgba(2,132,199,0.08)';
  ctx.beginPath();
  for (let x = step * 4; x < w; x += step * 4) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = step * 4; y < h; y += step * 4) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 2.5,
  headSize = 8.5
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  const ang = Math.atan2(dy, dx);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headSize * Math.cos(ang - 0.42), y2 - headSize * Math.sin(ang - 0.42));
  ctx.lineTo(x2 - headSize * Math.cos(ang + 0.42), y2 - headSize * Math.sin(ang + 0.42));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function renderCustomStepPhysicsSim({
  ctx,
  w,
  h,
  t,
  isDark,
  simId,
  params,
  flags,
  overlays,
  pushTelemetry
}: {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
  isDark: boolean;
  simId: CustomStepSimId;
  params: Record<string, number>;
  flags: Physics2DFlags;
  overlays: Physics2DOverlayState;
  pushTelemetry: (next: Physics2DTelemetry) => void;
}) {
  ctx.clearRect(0, 0, w, h);
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 24, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
  if (isDark) {
    bgGrad.addColorStop(0, '#10182b');
    bgGrad.addColorStop(1, '#080d19');
  } else {
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(1, '#f1f5f9');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (overlays.showRulerGrid) drawGrid(ctx, w, h, isDark);

  const fg = isDark ? '#e2e8f0' : '#0f172a';
  const muted = isDark ? '#94a3b8' : '#475569';

  switch (simId) {
    // ------------------------------------------------------------------------
    // 1. AVERAGE VELOCITY MULTI-STAGE + PIECEWISE s(t) GRAPH
    // ------------------------------------------------------------------------
    case 'average_velocity_stages': {
      const v1 = Math.max(5, params.v1 ?? 40);
      const v2 = Math.max(5, params.v2 ?? 60);
      const splitPct = Math.min(85, Math.max(15, params.splitRatio ?? 50));
      const S = Math.max(20, params.totalDist ?? 120);
      const equalTime = Boolean(flags.airDrag); // reused contextual flag for equal-time vs equal-dist

      let s1: number;
      let s2: number;
      let t1: number;
      let t2: number;
      let tTotal: number;
      let vTb: number;

      if (equalTime) {
        // Equal time t1 = t2 = T/2
        const tHalf = 1.0;
        t1 = tHalf;
        t2 = tHalf;
        tTotal = 2.0;
        s1 = v1 * t1;
        s2 = v2 * t2;
        vTb = (v1 + v2) / 2;
      } else {
        s1 = (S * splitPct) / 100;
        s2 = S - s1;
        t1 = s1 / v1;
        t2 = s2 / v2;
        tTotal = t1 + t2;
        vTb = S / tTotal;
      }
      const sumS = s1 + s2;
      const vArith = (v1 + v2) / 2;

      pushTelemetry({
        metric1Label: 'Chặng 1 & Chặng 2',
        metric1Val: `${t1.toFixed(2)}h + ${t2.toFixed(2)}h`,
        metric2Label: 'Vận tốc TB thật (v_tb)',
        metric2Val: `${vTb.toFixed(2)} km/h`,
        metric3Label: 'TB cộng (v₁+v₂)/2',
        metric3Val: `${vArith.toFixed(1)} km/h`,
        note: equalTime
          ? `Khi thời gian 2 chặng bằng nhau (t₁ = t₂), v_tb = (${v1}+${v2})/2 = ${vTb.toFixed(1)} km/h.`
          : `Cùng chia chặng (${splitPct}% | ${100 - splitPct}%): xe đi chậm ở v₁ tốn ${t1.toFixed(2)}h nên v_tb = ${sumS.toFixed(0)}/${tTotal.toFixed(2)} = ${vTb.toFixed(1)} km/h ${vTb < vArith ? '(< ' + vArith.toFixed(1) + ')' : ''}.`
      });

      const cycle = 5.5;
      const tau = (t % cycle) / cycle; // 0..1 normalized total time
      const tSim = tau * tTotal;
      const fracStage1 = t1 / tTotal;
      const curDist = tSim <= t1 ? v1 * tSim : s1 + v2 * (tSim - t1);
      const curDistAvg = vTb * tSim;

      // Left Panel: Dual-Lane Track
      const leftW = Math.min(w * 0.56, w - 210);
      const trackX0 = 26;
      const trackX1 = Math.max(trackX0 + 160, leftW - 18);
      const trackLen = trackX1 - trackX0;
      const splitX = trackX0 + (s1 / sumS) * trackLen;

      // Lane 1: Real segmented car
      const lane1Y = h * 0.31;
      const lane2Y = h * 0.62;

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = fg;
      ctx.textAlign = 'left';
      ctx.fillText('Xe thực (đổi tốc độ theo chặng):', trackX0, lane1Y - 26);

      // Stage 1 bar & Stage 2 bar
      ctx.fillStyle = isDark ? 'rgba(56,189,248,0.22)' : 'rgba(2,132,199,0.14)';
      ctx.fillRect(trackX0, lane1Y - 12, splitX - trackX0, 24);
      ctx.fillStyle = isDark ? 'rgba(245,158,11,0.22)' : 'rgba(245,158,11,0.18)';
      ctx.fillRect(splitX, lane1Y - 12, trackX1 - splitX, 24);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(trackX0, lane1Y - 12, trackLen, 24);

      // Divider at splitX
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(splitX, lane1Y - 18);
      ctx.lineTo(splitX, lane2Y + 18);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText(`s₁=${s1.toFixed(0)}km · ${v1}km/h`, (trackX0 + splitX) / 2, lane1Y + 25);
      ctx.fillStyle = '#d97706';
      ctx.fillText(`s₂=${s2.toFixed(0)}km · ${v2}km/h`, (splitX + trackX1) / 2, lane1Y + 25);

      const carX = trackX0 + (curDist / sumS) * trackLen;
      ctx.fillStyle = tSim <= t1 ? '#0ea5e9' : '#f59e0b';
      ctx.fillRect(carX - 12, lane1Y - 10, 24, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(tSim <= t1 ? `${v1}` : `${v2}`, carX, lane1Y + 3);

      // Lane 2: Equivalent constant v_tb car
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.textAlign = 'left';
      ctx.fillText(`Xe đều với v_tb = ${vTb.toFixed(1)} km/h (về đích cùng lúc):`, trackX0, lane2Y - 19);
      ctx.fillStyle = isDark ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.13)';
      ctx.fillRect(trackX0, lane2Y - 10, trackLen, 20);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(trackX0, lane2Y - 10, trackLen, 20);

      const carAvgX = trackX0 + (curDistAvg / sumS) * trackLen;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(carAvgX - 12, lane2Y - 8, 24, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('v_tb', carAvgX, lane2Y + 3);

      // Compare v_tb vs arithmetic average badge
      ctx.fillStyle = isDark ? 'rgba(15,23,42,0.85)' : '#ffffff';
      ctx.fillRect(trackX0, h - 42, trackLen, 28);
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.strokeRect(trackX0, h - 42, trackLen, 28);
      ctx.fillStyle = fg;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `t = ${tSim.toFixed(2)}/${tTotal.toFixed(2)}h  |  v_tb = ${vTb.toFixed(1)}  vs  (v₁+v₂)/2 = ${vArith.toFixed(1)} km/h`,
        trackX0 + 8,
        h - 24,
        trackLen - 16
      );

      // Right Panel: Piecewise s(t) Graph
      const gx0 = leftW + 28;
      const gx1 = w - 24;
      const gy0 = 36;
      const gy1 = h - 32;
      const gw = Math.max(90, gx1 - gx0);
      const gh = Math.max(90, gy1 - gy0);

      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx0, gy1);
      ctx.lineTo(gx1, gy1);
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Đồ thị s(t)', gx0 + 6, gy0 + 10);
      ctx.font = '10px monospace';
      ctx.fillStyle = muted;
      ctx.textAlign = 'right';
      ctx.fillText('t (h)', gx1, gy1 + 14);
      ctx.fillText('s', gx0 - 5, gy0 + 10);

      const midGx = gx0 + fracStage1 * gw;
      const midGy = gy1 - (s1 / sumS) * gh;

      // Chord line (average velocity slope)
      ctx.strokeStyle = '#10b981';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(gx0, gy1);
      ctx.lineTo(gx1, gy0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stage 1 slope
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(gx0, gy1);
      ctx.lineTo(midGx, midGy);
      ctx.stroke();

      // Stage 2 slope
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(midGx, midGy);
      ctx.lineTo(gx1, gy0);
      ctx.stroke();

      // Current live point on graph
      const curGx = gx0 + tau * gw;
      const curGy = gy1 - (curDist / sumS) * gh;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(curGx, curGy, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ------------------------------------------------------------------------
    // 2. MECHANICAL WORK, POWER & EFFICIENCY
    // ------------------------------------------------------------------------
    case 'work_power_joule': {
      const F = params.force ?? 80;
      const deg = params.angle ?? 0;
      const rad = (deg * Math.PI) / 180;
      const m = Math.max(1, params.mass ?? 10);
      const mu = Math.max(0, params.mu ?? 0.15);
      const g = 9.8;

      const Fx = F * Math.cos(rad);
      const Fy = F * Math.sin(rad);
      const N = Math.max(0, m * g - Fy);
      const Fms = mu * N;
      const Fnet = Fx - Fms;
      const a = Fnet / m;

      const sTrack = 10; // 10 meters track
      const tMax = a > 0.05 ? Math.sqrt((2 * sTrack) / a) : 4.0;
      const tCur = t % (tMax + 1.0);
      const moving = a > 0.05 && tCur <= tMax;
      const sCur = moving ? Math.min(sTrack, 0.5 * a * tCur * tCur) : a > 0.05 ? sTrack : 0;
      const vCur = moving ? a * tCur : a > 0.05 ? a * tMax : 0;

      const workTotal = Fx * sCur;
      const workFriction = Fms * sCur;
      const eff = workTotal > 0.01 ? Math.max(0, Math.min(100, ((workTotal - workFriction) / workTotal) * 100)) : 0;
      const instPower = Fx * vCur;

      pushTelemetry({
        metric1Label: 'Công lực kéo (A = F·s·cosα)',
        metric1Val: `${workTotal.toFixed(0)} J`,
        metric2Label: 'Công suất tức thời (P = Fx·v)',
        metric2Val: `${instPower.toFixed(0)} W`,
        metric3Label: 'Hiệu suất cơ học (H)',
        metric3Val: `${eff.toFixed(1)}%`,
        note:
          a <= 0.05
            ? `Lực kéo theo phương ngang Fx = ${Fx.toFixed(1)} N chưa thắng được ma sát cực đại ${Fms.toFixed(1)} N — vật đứng yên (A = 0).`
            : `Lực kéo Fx = ${Fx.toFixed(1)} N, ma sát Fms = ${Fms.toFixed(1)} N → gia tốc a = ${a.toFixed(2)} m/s² sinh công ${workTotal.toFixed(0)} J.`
      });

      const floorY = h - 54;
      const xStart = 64;
      const xEnd = w - 145;
      ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
      ctx.fillRect(0, floorY, w, 54);

      // Distance ruler
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.2;
      for (let mMark = 0; mMark <= 10; mMark += 2) {
        const mx = xStart + (mMark / 10) * (xEnd - xStart);
        ctx.beginPath();
        ctx.moveTo(mx, floorY);
        ctx.lineTo(mx, floorY + 8);
        ctx.stroke();
        ctx.fillStyle = muted;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${mMark}m`, mx, floorY + 22);
      }

      const bx = xStart + (sCur / sTrack) * (xEnd - xStart);
      const bw = 54;
      const bh = 38;
      const by = floorY - bh;

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(bx - bw / 2, by, bw, bh);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx - bw / 2, by, bw, bh);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${m}kg`, bx, by + 23);

      // Force vectors
      if (overlays.showVectors) {
        const vecLen = Math.min(72, Math.max(28, F * 0.42));
        const fxEnd = bx + vecLen * Math.cos(rad);
        const fyEnd = by + bh / 2 - vecLen * Math.sin(rad);
        const fScale = 0.55;
        drawArrow(ctx, bx, by + bh / 2, fxEnd, fyEnd, '#f59e0b', 3);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`F=${F}N (${deg}°)`, fxEnd + 4, fyEnd + 3);

        if (deg > 0) {
          ctx.strokeStyle = 'rgba(245,158,11,0.5)';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(fxEnd, fyEnd);
          ctx.lineTo(fxEnd, by + bh / 2);
          ctx.stroke();
          ctx.setLineDash([]);
          drawArrow(ctx, bx, by + bh / 2, fxEnd, by + bh / 2, '#10b981', 2);
        }
        if (Fms > 0.5) {
          drawArrow(ctx, bx - bw / 2, floorY - 6, bx - bw / 2 - Fms * fScale, floorY - 6, '#ef4444', 2.4);
          ctx.fillStyle = '#ef4444';
          ctx.textAlign = 'right';
          ctx.fillText(`Fms`, bx - bw / 2 - Fms * fScale - 4, floorY - 10);
        }
      }

      // Live Work / Power Bar top-right
      const barW = 190;
      const barX = w - barW - 22;
      const barY = 26;
      ctx.fillStyle = isDark ? 'rgba(15,23,42,0.8)' : '#ffffff';
      ctx.fillRect(barX, barY, barW, 56);
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.strokeRect(barX, barY, barW, 56);
      ctx.fillStyle = fg;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Công A = ${workTotal.toFixed(0)} J  |  s = ${sCur.toFixed(1)} m`, barX + 10, barY + 20);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(barX + 10, barY + 32, barW - 20, 12);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(barX + 10, barY + 32, ((barW - 20) * Math.min(1, sCur / sTrack)) * (eff / 100), 12);
      break;
    }

    // ------------------------------------------------------------------------
    // 3. JOULE-LENZ HEATING & ELECTRIC POWER
    // ------------------------------------------------------------------------
    case 'joule_lenz_heat': {
      const rawU = Number.isFinite(params.voltage) ? params.voltage : 12;
      const effReverse = rawU < 0 ? !flags.reversePolarity : flags.reversePolarity;
      const U = Math.abs(rawU);
      const R = Math.max(0.05, Number.isFinite(params.resistance) ? params.resistance : 6);
      const mWater = Math.max(0.05, Number.isFinite(params.waterMass) ? params.waterMass : 0.5);
      const isOpen = flags.circuitOpen;
      const I = isOpen ? 0 : U / R;
      const P = U * I;
      const tSim = isOpen || I <= 0.005 ? 0 : t % 30;
      const Q = P * tSim;
      const cWater = 4200;
      const dT = Math.min(75, Q / (mWater * cWater));
      const tempCur = 25 + dT;

      // Quy ước I: (+) -> mạch ngoài -> (-).
      // !effReverse: (+) ở TRÊN, (-) ở DƯỚI => I chạy THUẬN chiều kim đồng hồ (+1), e- chạy NGƯỢC (-1).
      // effReverse: (-) ở TRÊN, (+) ở DƯỚI => I chạy NGƯỢC chiều kim đồng hồ (-1), e- chạy THUẬN (+1).
      const conventionalDir: 1 | -1 = effReverse ? -1 : 1;
      const electronDir: 1 | -1 = conventionalDir === 1 ? -1 : 1;

      pushTelemetry({
        metric1Label: 'Cường độ dòng (I = U/R)',
        metric1Val: isOpen ? '0.00 A (Mở K)' : `${I.toFixed(2)} A`,
        metric2Label: 'Công suất tỏa nhiệt (P = I²R)',
        metric2Val: `${P.toFixed(1)} W`,
        metric3Label: 'Nhiệt lượng Q (tăng ΔT)',
        metric3Val: `${Q.toFixed(0)} J (${tempCur.toFixed(1)}°C)`,
        note: isOpen
          ? 'Khóa K đang MỞ: Mạch hở nên I = 0 A, dây điện trở không tỏa nhiệt.'
          : `Chiều I (${effReverse ? 'Ngược KĐH: (+) dưới → (−) trên' : 'Thuận KĐH: (+) trên → (−) dưới'}) · Dòng ${I.toFixed(2)} A qua R = ${R} Ω tỏa nhiệt ${P.toFixed(1)} J/s.`
      });

      const cx0 = Math.max(44, Math.round(w * 0.12));
      const cyTop = 42;
      const cyBot = h - 42;
      const beakerX = Math.max(cx0 + 120, Math.round(w * 0.42));
      const beakerW = Math.min(136, Math.round(w * 0.28));
      const beakerY = 44;
      const beakerH = Math.max(120, h - 94);
      const coilY = beakerY + beakerH * 0.58;
      const coilLeftX = beakerX + 30;
      const coilRightX = beakerX + beakerW - 30;
      const swX1 = cx0 + Math.max(24, (coilLeftX - cx0) * 0.3);
      const swX2 = swX1 + Math.min(34, (coilLeftX - cx0) * 0.24);

      const wireColor = isOpen ? '#64748b' : '#38bdf8';

      // Closed Circuit Loop Wires (single clean loop through heating coil)
      ctx.strokeStyle = wireColor;
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx0, cyTop);
      ctx.lineTo(swX1, cyTop);
      if (!isOpen) {
        ctx.lineTo(coilLeftX, cyTop);
      } else {
        ctx.moveTo(swX2, cyTop);
        ctx.lineTo(coilLeftX, cyTop);
      }
      ctx.lineTo(coilLeftX, coilY);
      ctx.moveTo(coilRightX, coilY);
      ctx.lineTo(coilRightX, cyBot);
      ctx.lineTo(cx0, cyBot);
      ctx.lineTo(cx0, cyTop);
      ctx.stroke();

      // Switch K on top wire
      ctx.strokeStyle = isOpen ? '#ef4444' : '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(swX1, cyTop);
      ctx.lineTo(isOpen ? swX2 - 4 : swX2, isOpen ? cyTop - 16 : cyTop);
      ctx.stroke();
      ctx.fillStyle = muted;
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isOpen ? 'K (Mở)' : 'K (Đóng)', (swX1 + swX2) / 2, cyTop + 14);

      // Battery symbol at left vertical wire (cx0, midY)
      const midY = (cyTop + cyBot) / 2;
      ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
      ctx.fillRect(cx0 - 18, midY - 22, 36, 44);

      const posY = effReverse ? midY + 7 : midY - 7;
      const negY = effReverse ? midY - 7 : midY + 7;

      // Long plate (+)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx0 - 15, posY);
      ctx.lineTo(cx0 + 15, posY);
      ctx.stroke();

      // Short plate (-)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx0 - 9, negY);
      ctx.lineTo(cx0 + 9, negY);
      ctx.stroke();

      // Explicit (+) and (-) marks
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('+', cx0 + 18, posY + 4);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText('−', cx0 + 18, negY + 4);

      ctx.fillStyle = fg;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`U=${Number.isInteger(U) ? U : U.toFixed(1)}V`, cx0 + 18, midY + (effReverse ? -20 : 26));

      // Current flow animation: ALWAYS out from (+) -> outer circuit -> coil -> into (-)
      if (!isOpen && I > 0.005) {
        const showElectrons = Boolean(flags.showElectrons);
        const loopPtsCW: [number, number][] = [
          [cx0, posY],
          [cx0, cyTop],
          [coilLeftX, cyTop],
          [coilLeftX, coilY],
          [coilRightX, coilY],
          [coilRightX, cyBot],
          [cx0, cyBot],
          [cx0, negY]
        ];
        const loopPtsI: [number, number][] = !effReverse
          ? loopPtsCW
          : [
              [cx0, posY],
              [cx0, cyBot],
              [coilRightX, cyBot],
              [coilRightX, coilY],
              [coilLeftX, coilY],
              [coilLeftX, cyTop],
              [cx0, cyTop],
              [cx0, negY]
            ];

        const samplePath = (pts: [number, number][], fracRaw: number) => {
          const frac = ((fracRaw % 1) + 1) % 1;
          let totalLen = 0;
          const segLens: number[] = [];
          for (let k = 0; k < pts.length - 1; k++) {
            const dLen = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]);
            segLens.push(dLen);
            totalLen += dLen;
          }
          let d = frac * totalLen;
          for (let s = 0; s < segLens.length; s++) {
            if (d <= segLens[s] || s === segLens.length - 1) {
              const f = segLens[s] > 0 ? d / segLens[s] : 0;
              const dx = pts[s + 1][0] - pts[s][0];
              const dy = pts[s + 1][1] - pts[s][1];
              return {
                x: pts[s][0] + dx * f,
                y: pts[s][1] + dy * f,
                ang: Math.atan2(dy, dx)
              };
            }
            d -= segLens[s];
          }
          return { x: pts[0][0], y: pts[0][1], ang: 0 };
        };

        const speedNorm = Math.min(0.45, Math.max(0.06, I * 0.055));
        const pulseCount = 10;
        for (let i = 0; i < pulseCount; i++) {
          const pt = samplePath(loopPtsI, t * speedNorm + i / pulseCount);
          if (Math.abs(pt.x - cx0) < 4 && Math.abs(pt.y - midY) < 20) continue;
          if (Math.abs(pt.y - coilY) < 4 && pt.x >= coilLeftX && pt.x <= coilRightX) continue;
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(pt.ang);
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.moveTo(6.5, 0);
          ctx.lineTo(-5, -4);
          ctx.lineTo(-2.5, 0);
          ctx.lineTo(-5, 4);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        if (showElectrons) {
          const electronPath = [...loopPtsI].reverse();
          const eCount = 12;
          for (let i = 0; i < eCount; i++) {
            const pt = samplePath(electronPath, t * speedNorm + i / eCount);
            if (Math.abs(pt.x - cx0) < 4 && Math.abs(pt.y - midY) < 20) continue;
            if (Math.abs(pt.y - coilY) < 4 && pt.x >= coilLeftX && pt.x <= coilRightX) continue;
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Conventional Current (I) labels & reference arrows
        const topArrowX = (swX2 + coilLeftX) / 2;
        const botArrowX = (cx0 + coilRightX) / 2;
        if (topArrowX > swX2 + 12) {
          drawArrow(
            ctx,
            topArrowX - 12 * conventionalDir,
            cyTop - 10,
            topArrowX + 12 * conventionalDir,
            cyTop - 10,
            '#10b981',
            2.4,
            7
          );
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 10.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Chiều I', topArrowX, cyTop - 16);
        }
        drawArrow(
          ctx,
          botArrowX + 14 * conventionalDir,
          cyBot + 10,
          botArrowX - 14 * conventionalDir,
          cyBot + 10,
          '#10b981',
          2.4,
          7
        );
      }

      // Water Calorimeter Beaker
      const heatAlpha = isOpen || I <= 0.005 ? 0.05 : Math.min(0.65, 0.12 + P / 250);
      ctx.fillStyle = `rgba(249, 115, 22, ${heatAlpha * 0.45})`;
      ctx.fillRect(beakerX + 4, beakerY + 28, beakerW - 8, beakerH - 32);
      ctx.fillStyle = isDark ? 'rgba(56,189,248,0.2)' : 'rgba(56,189,248,0.28)';
      ctx.fillRect(beakerX + 4, beakerY + 28, beakerW - 8, beakerH - 32);
      ctx.strokeStyle = muted;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(beakerX, beakerY, beakerW, beakerH);

      // Glowing Heating Coil inside water
      const glow = isOpen || I <= 0.005 ? 0 : Math.min(1, P / 150);
      ctx.strokeStyle = isOpen || I <= 0.005 ? '#64748b' : glow > 0.4 ? '#f97316' : '#fb923c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(coilLeftX, coilY);
      for (let z = 0; z < 6; z++) {
        const zx = coilLeftX + ((z + 0.5) / 6) * (coilRightX - coilLeftX);
        const zy = coilY + (z % 2 === 0 ? -12 : 12);
        ctx.lineTo(zx, zy);
      }
      ctx.lineTo(coilRightX, coilY);
      ctx.stroke();

      // Rising convection bubbles proportional to power
      if (!isOpen && P > 0.2) {
        const bubbleCount = Math.min(14, Math.max(2, Math.round(P / 12)));
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        for (let b = 0; b < bubbleCount; b++) {
          const byProg = (t * 0.6 + b * 0.23) % 1;
          const bx = beakerX + 24 + ((b * 19) % Math.max(20, beakerW - 48));
          const by = coilY - byProg * Math.max(20, coilY - beakerY - 32);
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Thermometer on right side
      const thermX = beakerX + beakerW + 26;
      const thermY = beakerY + 8;
      const thermH = beakerH - 16;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2;
      ctx.strokeRect(thermX, thermY, 16, thermH);
      const fillRatio = Math.min(1, (tempCur - 20) / 80);
      const mercH = fillRatio * (thermH - 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(thermX + 3, thermY + thermH - 3 - mercH, 10, mercH);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${tempCur.toFixed(1)}°C`, thermX + 22, thermY + thermH - mercH + 4);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = muted;
      ctx.fillText(`Q = ${Q.toFixed(0)} J`, thermX + 22, beakerY + 20);

      // Legend at bottom
      ctx.font = 'bold 10.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = muted;
      ctx.fillText(
        flags.showElectrons
          ? 'Dòng I (mũi tên xanh): Ra (+) → Vào (−)  |  Electron e⁻ (hạt vàng): (−) → (+)'
          : 'Chiều dòng điện quy ước I (mũi tên xanh): Ra từ cực dương (+) → Vào cực âm (−)',
        w / 2,
        h - 10
      );
      break;
    }

    // ------------------------------------------------------------------------
    // 4. VECTOR ADDITION PARALLELOGRAM & TRIGONOMETRY PROJECTIONS
    // ------------------------------------------------------------------------
    case 'vector_addition_2d': {
      const f1 = params.f1 ?? 40;
      const f2 = params.f2 ?? 30;
      const deg = params.angleDeg ?? 60;
      const rad = (deg * Math.PI) / 180;
      const rx = f1 + f2 * Math.cos(rad);
      const ry = f2 * Math.sin(rad);
      const R = Math.hypot(rx, ry);
      const theta = (Math.atan2(ry, rx) * 180) / Math.PI;

      pushTelemetry({
        metric1Label: 'Hợp lực |R| = √(F₁²+F₂²+2F₁F₂cosα)',
        metric1Val: `${R.toFixed(2)} N`,
        metric2Label: 'Chiếu trục (Rx ; Ry)',
        metric2Val: `(${rx.toFixed(1)} ; ${ry.toFixed(1)}) N`,
        metric3Label: 'Góc hợp lực (θ)',
        metric3Val: `${theta.toFixed(1)}°`,
        note: `Quy tắc hình bình hành: F₁ = ${f1} N, F₂ = ${f2} N hợp góc ${deg}° cho hợp lực R = ${R.toFixed(2)} N.`
      });

      const ox = w * 0.34;
      const oy = h * 0.72;
      const scale = Math.min(w, h) / 165;

      // Axes
      drawArrow(ctx, ox - 60, oy, w - 30, oy, muted, 1.4, 6);
      drawArrow(ctx, ox, oy + 36, ox, 24, muted, 1.4, 6);
      ctx.fillStyle = muted;
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Ox', w - 26, oy + 14);
      ctx.fillText('Oy', ox - 20, 32);

      const p1x = ox + f1 * scale;
      const p1y = oy;
      const p2x = ox + f2 * Math.cos(rad) * scale;
      const p2y = oy - f2 * Math.sin(rad) * scale;
      const prx = ox + rx * scale;
      const pry = oy - ry * scale;

      // Parallelogram dashed guide
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.45)' : 'rgba(100,116,139,0.5)';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(prx, pry);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      // Orthogonal projections of R onto axes
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(prx, pry);
      ctx.lineTo(prx, oy);
      ctx.moveTo(prx, pry);
      ctx.lineTo(ox, pry);
      ctx.stroke();
      ctx.setLineDash([]);

      drawArrow(ctx, ox, oy, p1x, p1y, '#0ea5e9', 3.2, 9);
      drawArrow(ctx, ox, oy, p2x, p2y, '#f59e0b', 3.2, 9);
      drawArrow(ctx, ox, oy, prx, pry, '#10b981', 3.8, 10);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#0ea5e9';
      ctx.fillText(`F₁=${f1}N`, (ox + p1x) / 2 - 14, p1y + 18);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`F₂=${f2}N`, p2x + 6, p2y - 6);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`R=${R.toFixed(1)}N`, prx + 8, pry - 4);
      break;
    }

    // ------------------------------------------------------------------------
    // 5. DISTANCE vs DISPLACEMENT & RELATIVE RIVER VELOCITY
    // ------------------------------------------------------------------------
    case 'distance_displacement_rel': {
      const v1 = params.v1 ?? 4.0;
      const vStream = params.vStream ?? 3.0;
      const L = params.riverWidth ?? 40;
      const turnMode = Boolean(flags.airDrag);

      if (turnMode) {
        // 1D forward then turn back
        const t1 = 3.0;
        const t2 = 2.0;
        const tTot = t1 + t2;
        const tc = t % (tTot + 1.0);
        const forward = v1 * Math.min(tc, t1);
        const back = tc > t1 ? vStream * Math.min(tc - t1, t2) : 0;
        const pos = forward - back;
        const sTravel = forward + back;
        pushTelemetry({
          metric1Label: 'Quãng đường đi (s)',
          metric1Val: `${sTravel.toFixed(1)} m`,
          metric2Label: 'Độ dịch chuyển (d)',
          metric2Val: `${pos.toFixed(1)} m`,
          metric3Label: 'Độ chênh s − |d|',
          metric3Val: `${(sTravel - Math.abs(pos)).toFixed(1)} m`,
          note: `Vật đi xuôi rồi quay đầu: quãng đường cộng dồn s = ${sTravel.toFixed(1)} m luôn ≥ |d| = ${Math.abs(pos).toFixed(1)} m.`
        });

        const yLine = h * 0.55;
        const x0 = 60;
        const pxPerM = (w - 130) / Math.max(15, v1 * t1 + 4);
        ctx.strokeStyle = muted;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, yLine);
        ctx.lineTo(w - 50, yLine);
        ctx.stroke();

        const xMax = x0 + forward * pxPerM;
        const xCur = x0 + pos * pxPerM;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x0, yLine - 14);
        ctx.lineTo(xMax, yLine - 14);
        if (back > 0) ctx.lineTo(xCur, yLine - 24);
        ctx.stroke();

        drawArrow(ctx, x0, yLine + 16, xCur, yLine + 16, '#0ea5e9', 3.2);
        ctx.fillStyle = '#0ea5e9';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`d = ${pos.toFixed(1)} m`, (x0 + xCur) / 2, yLine + 36);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(xCur, yLine, 8, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      const tCross = L / v1;
      const vNet = Math.hypot(v1, vStream);
      const drift = vStream * tCross;
      const tc = (t % (tCross + 1.2));
      const frac = Math.min(1, tc / tCross);

      pushTelemetry({
        metric1Label: 'Vận tốc thực (v₁₃ = √(v₁²+v₂²))',
        metric1Val: `${vNet.toFixed(2)} m/s`,
        metric2Label: 'Thời gian qua sông',
        metric2Val: `${tCross.toFixed(1)} s`,
        metric3Label: 'Độ dạt hạ lưu (Δx)',
        metric3Val: `${drift.toFixed(1)} m`,
        note: `Ca nô hướng mũi vuông góc bờ (v₁₂=${v1} m/s), nước đẩy xuôi (v₂₃=${vStream} m/s) tạo quỹ đạo tổng hợp lệch hạ lưu ${drift.toFixed(1)} m.`
      });

      const bankTop = 38;
      const bankBot = h - 38;
      ctx.fillStyle = isDark ? 'rgba(14,165,233,0.16)' : 'rgba(14,165,233,0.12)';
      ctx.fillRect(0, bankTop, w, bankBot - bankTop);
      ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.fillRect(0, 0, w, bankTop);
      ctx.fillRect(0, bankBot, w, h - bankBot);

      const x0 = w * 0.25;
      const dxMax = Math.min(w * 0.55, drift * ((bankBot - bankTop) / L));
      const bx = x0 + frac * dxMax;
      const by = bankBot - frac * (bankBot - bankTop);

      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, bankBot);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);

      if (overlays.showVectors) {
        drawArrow(ctx, bx, by, bx, by - v1 * 9, '#0ea5e9', 2.6);
        drawArrow(ctx, bx, by, bx + vStream * 9, by, '#f59e0b', 2.6);
        drawArrow(ctx, bx, by, bx + vStream * 9, by - v1 * 9, '#10b981', 3);
      }
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ------------------------------------------------------------------------
    // 6. HOOKE'S LAW SPRING DEFORMATION
    // ------------------------------------------------------------------------
    case 'hooke_spring_stat': {
      const k = Math.max(10, params.k ?? 50);
      const m = Math.max(0.1, params.mass ?? 1.5);
      const l0 = params.l0 ?? 20;
      const g = 9.8;
      const F = m * g;
      const dlMeters = F / k;
      const dlCm = dlMeters * 100;
      const lCur = l0 + dlCm;

      pushTelemetry({
        metric1Label: 'Độ dãn Δl = P / k',
        metric1Val: `${dlCm.toFixed(1)} cm`,
        metric2Label: 'Chiều dài tổng (l)',
        metric2Val: `${lCur.toFixed(1)} cm`,
        metric3Label: 'Lực đàn hồi (F_đh)',
        metric3Val: `${F.toFixed(1)} N`,
        note: `Với độ cứng k = ${k} N/m và vật m = ${m} kg (P = ${F.toFixed(1)} N), lò xo dãn Δl = ${dlCm.toFixed(1)} cm.`
      });

      const anchorX = w * 0.28;
      const anchorY = 26;
      const scalePxPerCm = 2.8;
      const springLenPx = Math.min(h - 90, lCur * scalePxPerCm);
      const coils = 10;

      ctx.fillStyle = muted;
      ctx.fillRect(anchorX - 36, anchorY - 6, 72, 8);

      // Coiled spring
      ctx.strokeStyle = dlCm > 50 ? '#ef4444' : '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(anchorX, anchorY);
      for (let i = 1; i <= coils; i++) {
        const yy = anchorY + (i / coils) * springLenPx;
        const xx = anchorX + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(xx, yy);
      }
      ctx.lineTo(anchorX, anchorY + springLenPx);
      ctx.stroke();

      // Mass block
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(anchorX - 18, anchorY + springLenPx, 36, 28);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${m}kg`, anchorX, anchorY + springLenPx + 18);

      // l0 reference line
      const y0 = anchorY + l0 * scalePxPerCm;
      ctx.strokeStyle = '#10b981';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(anchorX - 50, y0);
      ctx.lineTo(anchorX + 55, y0);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`l₀=${l0}cm`, anchorX + 26, y0 - 4);

      if (overlays.showVectors) {
        drawArrow(ctx, anchorX + 28, anchorY + springLenPx + 14, anchorX + 28, anchorY + springLenPx - 28, '#10b981', 2.5);
        drawArrow(ctx, anchorX - 28, anchorY + springLenPx + 14, anchorX - 28, anchorY + springLenPx + 56, '#ef4444', 2.5);
      }

      // Hooke linear graph F(Δl) on right
      const gx0 = w * 0.56;
      const gx1 = w - 26;
      const gy0 = 36;
      const gy1 = h - 34;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx0, gy1);
      ctx.lineTo(gx1, gy1);
      ctx.stroke();

      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(gx0, gy1);
      const maxF = 55;
      const endX = gx0 + Math.min(gx1 - gx0, ((maxF / k) * 100 / 80) * (gx1 - gx0));
      const endY = gy1 - (maxF / 60) * (gy1 - gy0);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const ptX = gx0 + Math.min(1, dlCm / 80) * (gx1 - gx0);
      const ptY = gy1 - Math.min(1, F / 60) * (gy1 - gy0);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(ptX, ptY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Đồ thị F_đh (Δl)', gx0 + 8, gy0 + 12);
      break;
    }

    // ------------------------------------------------------------------------
    // 7. PHASE CHANGE HEATING CURVE T(t)
    // ------------------------------------------------------------------------
    case 'phase_change_heating': {
      const P = Math.max(200, params.power ?? 1200);
      const m = Math.max(0.1, params.mass ?? 0.5);
      const tStart = params.tStart ?? -20;
      const cIce = 2100;
      const lam = 334000;
      const cWater = 4200;
      const Lvap = 2260000;

      const Q1 = m * cIce * (0 - tStart);
      const Q2 = m * lam;
      const Q3 = m * cWater * 100;
      const Q4 = m * Lvap * 0.25; // partial vaporization window so graph scales nicely
      const Qtotal = Q1 + Q2 + Q3 + Q4;

      const tau = (t % 9) / 9;
      const qCur = tau * Qtotal;
      let tempCur = 0;
      let phaseLabel = 'Đá đang nóng lên';
      if (qCur <= Q1) {
        tempCur = tStart + qCur / (m * cIce);
        phaseLabel = 'Pha Rắn (Nước đá tăng nhiệt)';
      } else if (qCur <= Q1 + Q2) {
        tempCur = 0;
        phaseLabel = 'Nóng chảy tại 0°C (Nhiệt độ không đổi!)';
      } else if (qCur <= Q1 + Q2 + Q3) {
        tempCur = ((qCur - Q1 - Q2) / (m * cWater));
        phaseLabel = 'Pha Lỏng (Nước đang đun nóng)';
      } else {
        tempCur = 100;
        phaseLabel = 'Sôi hóa hơi tại 100°C (Nhiệt độ dừng ở 100°C)';
      }

      pushTelemetry({
        metric1Label: 'Nhiệt độ hiện tại',
        metric1Val: `${tempCur.toFixed(1)} °C`,
        metric2Label: 'Nhiệt lượng đã cấp (Q = P·t)',
        metric2Val: `${(qCur / 1000).toFixed(1)} kJ`,
        metric3Label: 'Trạng thái chuyển thể',
        metric3Val: tempCur === 0 ? 'Nóng chảy (0°C)' : tempCur === 100 ? 'Hóa hơi (100°C)' : tempCur < 0 ? 'Rắn' : 'Lỏng',
        note: phaseLabel
      });

      // Left beaker illustration
      const bx = 36;
      const bw = 115;
      const by = 48;
      const bh = h - 96;
      ctx.fillStyle = tempCur <= 0 ? 'rgba(125,211,252,0.4)' : 'rgba(14,165,233,0.3)';
      ctx.fillRect(bx + 4, by + 30, bw - 8, bh - 34);
      ctx.strokeStyle = muted;
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);
      // Burner glow below
      ctx.fillStyle = '#f97316';
      ctx.fillRect(bx + 18, by + bh + 6, bw - 36, 8);

      // Right T(Q) heating curve
      const gx0 = 195;
      const gx1 = w - 26;
      const gy0 = 36;
      const gy1 = h - 34;
      const gw = Math.max(120, gx1 - gx0);
      const gh = Math.max(90, gy1 - gy0);

      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx0, gy1);
      ctx.lineTo(gx1, gy1);
      ctx.stroke();

      const mapX = (q: number) => gx0 + (q / Qtotal) * gw;
      const mapY = (temp: number) => gy1 - ((temp - (-45)) / 155) * gh;

      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mapX(0), mapY(tStart));
      ctx.lineTo(mapX(Q1), mapY(0));
      ctx.lineTo(mapX(Q1 + Q2), mapY(0));
      ctx.lineTo(mapX(Q1 + Q2 + Q3), mapY(100));
      ctx.lineTo(mapX(Qtotal), mapY(100));
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(mapX(qCur), mapY(tempCur), 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Đồ thị T(t) chuyển thể', gx0 + 10, gy0 + 12);
      ctx.font = '10px monospace';
      ctx.fillStyle = muted;
      ctx.fillText('0°C (λm)', mapX(Q1 + Q2 * 0.2), mapY(0) - 8);
      ctx.fillText('100°C (Lm)', mapX(Q1 + Q2 + Q3 + Q4 * 0.1), mapY(100) - 8);
      break;
    }

    // ------------------------------------------------------------------------
    // 8. MEASUREMENT ERRORS LAB
    // ------------------------------------------------------------------------
    case 'measurement_error_lab': {
      const x0 = params.trueVal ?? 2.0;
      const jitter = params.randomJitter ?? 0.06;
      const bias = params.sysBias ?? 0.04;
      const offsets = [-1.1, 0.8, -0.4, 1.2, -0.7, 0.2];
      const samples = offsets.map((o) => x0 + bias + o * jitter);
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const meanAbsErr = samples.reduce((s, v) => s + Math.abs(mean - v), 0) / samples.length;
      const sysAbs = Math.abs(bias);
      const totalErr = meanAbsErr + sysAbs;
      const relPct = (totalErr / mean) * 100;

      pushTelemetry({
        metric1Label: 'Giá trị trung bình (x̄)',
        metric1Val: `${mean.toFixed(3)} s`,
        metric2Label: 'Sai số ngẫu nhiên (Δx̄)',
        metric2Val: `± ${meanAbsErr.toFixed(3)} s`,
        metric3Label: 'Sai số tỉ đối (δ)',
        metric3Val: `${relPct.toFixed(2)}%`,
        note: `Kết quả đo: x = ${mean.toFixed(2)} ± ${totalErr.toFixed(2)} s (lệch hệ thống ${bias >= 0 ? '+' : ''}${bias.toFixed(2)}s).`
      });

      const lineY = h * 0.56;
      const xMin = x0 - 0.5;
      const xMax = x0 + 0.5;
      const toX = (v: number) => 56 + ((v - xMin) / (xMax - xMin)) * (w - 112);

      ctx.strokeStyle = muted;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(46, lineY);
      ctx.lineTo(w - 46, lineY);
      ctx.stroke();

      // True value line
      const tx = toX(x0);
      ctx.strokeStyle = '#10b981';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(tx, 46);
      ctx.lineTo(tx, lineY + 34);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Thực: ${x0.toFixed(2)}s`, tx, 38);

      // Mean value marker
      const mx = toX(mean);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(mx - 2, lineY - 45, 4, 90);
      ctx.fillText(`x̄=${mean.toFixed(2)}s`, mx, lineY + 62);

      // Animated dropping sample dots
      const visibleCount = Math.min(samples.length, Math.max(1, Math.floor((t % 6) + 1.5)));
      for (let i = 0; i < visibleCount; i++) {
        const sx = toX(samples[i]);
        const sy = lineY - 16 - (i % 3) * 14;
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 9. BOHR ATOM ENERGY LEVELS & PHOTON EMISSION
    // ------------------------------------------------------------------------
    case 'bohr_energy_levels': {
      const nHi = Math.max(2, Math.min(6, Math.round(params.nHigh ?? 3)));
      const nLo = Math.max(1, Math.min(nHi - 1, Math.round(params.nLow ?? 2)));
      const eHi = -13.6 / (nHi * nHi);
      const eLo = -13.6 / (nLo * nLo);
      const dE = eHi - eLo;
      const lambdaNm = (1240 / dE);

      const photonColor =
        lambdaNm < 380 ? '#a855f7' : lambdaNm < 495 ? '#3b82f6' : lambdaNm < 570 ? '#10b981' : lambdaNm < 750 ? '#ef4444' : '#f97316';

      pushTelemetry({
        metric1Label: `Bước nhảy (${nHi} → ${nLo})`,
        metric1Val: `ΔE = ${dE.toFixed(2)} eV`,
        metric2Label: 'Bước sóng phát xạ (λ)',
        metric2Val: `${lambdaNm.toFixed(1)} nm`,
        metric3Label: 'Vùng quang phổ',
        metric3Val: lambdaNm < 380 ? 'Tử ngoại' : lambdaNm <= 750 ? 'Khả kiến' : 'Hồng ngoại',
        note: `Electron chuyển từ E_${nHi} (${eHi.toFixed(2)} eV) xuống E_${nLo} (${eLo.toFixed(2)} eV) phát photon λ = ${lambdaNm.toFixed(1)} nm.`
      });

      // Left: Concentric Bohr Orbits
      const cx = w * 0.3;
      const cy = h * 0.5;
      for (let n = 1; n <= 5; n++) {
        const r = 16 + n * 16;
        ctx.strokeStyle = n === nHi || n === nLo ? photonColor : (isDark ? 'rgba(148,163,184,0.28)' : 'rgba(100,116,139,0.3)');
        ctx.lineWidth = n === nHi || n === nLo ? 2 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();

      const phase = t % 3;
      const curN = phase < 1.5 ? nHi : nLo;
      const eRad = 16 + Math.min(5, curN) * 16;
      const ang = t * 2.4;
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * eRad, cy + Math.sin(ang) * eRad, 5, 0, Math.PI * 2);
      ctx.fill();

      // Emitted photon wave packet moving right after transition
      if (phase >= 1.5) {
        const pxStart = cx + 70 + (phase - 1.5) * 65;
        ctx.strokeStyle = photonColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let dx = 0; dx < 46; dx += 2) {
          const py = cy + Math.sin(dx * 0.45) * 8;
          if (dx === 0) ctx.moveTo(pxStart + dx, py);
          else ctx.lineTo(pxStart + dx, py);
        }
        ctx.stroke();
      }

      // Right: Energy level ladder
      const lx0 = w * 0.62;
      const lx1 = w - 28;
      for (let n = 1; n <= 5; n++) {
        const En = -13.6 / (n * n);
        const ly = h - 30 - ((En + 13.6) / 13.6) * (h - 68);
        ctx.strokeStyle = n === nHi || n === nLo ? photonColor : muted;
        ctx.lineWidth = n === nHi || n === nLo ? 2.5 : 1.2;
        ctx.beginPath();
        ctx.moveTo(lx0, ly);
        ctx.lineTo(lx1 - 48, ly);
        ctx.stroke();
        ctx.fillStyle = fg;
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`n=${n} (${En.toFixed(1)}eV)`, lx1 - 44, ly + 4);
      }
      const yHi = h - 30 - ((eHi + 13.6) / 13.6) * (h - 68);
      const yLo = h - 30 - ((eLo + 13.6) / 13.6) * (h - 68);
      drawArrow(ctx, (lx0 + lx1 - 48) / 2, yHi, (lx0 + lx1 - 48) / 2, yLo, photonColor, 3);
      break;
    }

    // ------------------------------------------------------------------------
    // 10. TRANSVERSE ELECTROMAGNETIC WAVE (E ⊥ B ⊥ v) + AM MODULATION
    // ------------------------------------------------------------------------
    case 'em_wave_3axis': {
      const fMHz = Math.max(10, params.freqScale ?? 120);
      const ampE = params.ampE ?? 65;
      const modPct = Boolean(flags.airDrag) ? Math.max(45, params.modDepth ?? 55) : (params.modDepth ?? 0);
      const lambdaM = 300 / fMHz;

      pushTelemetry({
        metric1Label: 'Tần số sóng mang (f)',
        metric1Val: `${fMHz} MHz`,
        metric2Label: 'Bước sóng (λ = c / f)',
        metric2Val: `${lambdaM.toFixed(2)} m`,
        metric3Label: 'Đặc tính ngang (E ⊥ B)',
        metric3Val: modPct > 0 ? `AM (${modPct}%)` : 'Sóng chuẩn',
        note: `Tại mọi điểm, véctơ E (xanh dương) và véctơ B (vàng cam) luôn dao động CÙNG PHA trên hai mặt phẳng vuông góc nhau.`
      });

      const axY = h * 0.52;
      const x0 = 36;
      const x1 = w - 30;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x0, axY);
      ctx.lineTo(x1, axY);
      ctx.stroke();
      ctx.fillStyle = fg;
      ctx.font = 'bold 11px monospace';
      ctx.fillText('Truyền sóng c →', x1 - 95, axY + 18);

      const k = 0.028 * (fMHz / 120);
      const wOmega = 3.2;

      // E-field vertical wave
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let px = x0; px <= x1; px += 4) {
        const dx = px - x0;
        const env = 1 + (modPct / 100) * 0.55 * Math.sin(dx * 0.015 - t * 1.1);
        const val = Math.sin(dx * k - t * wOmega) * ampE * env;
        const py = axY - val;
        if (px === x0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        if (dx % 16 === 0 && overlays.showVectors) {
          ctx.fillStyle = 'rgba(14,165,233,0.45)';
          ctx.fillRect(px, Math.min(axY, py), 1.5, Math.abs(val));
        }
      }
      ctx.stroke();

      // B-field oblique perspective wave (perpendicular plane)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let px = x0; px <= x1; px += 4) {
        const dx = px - x0;
        const env = 1 + (modPct / 100) * 0.55 * Math.sin(dx * 0.015 - t * 1.1);
        const val = Math.sin(dx * k - t * wOmega) * (ampE * 0.65) * env;
        const bx = px + val * 0.55;
        const by = axY + val * 0.42;
        if (px === x0) ctx.moveTo(bx, by);
        else ctx.lineTo(bx, by);
      }
      ctx.stroke();

      ctx.fillStyle = '#0ea5e9';
      ctx.fillText('E (Điện trường ↕)', x0 + 6, 28);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('B (Từ trường ↗↙)', x0 + 140, 28);
      break;
    }
  }
}
