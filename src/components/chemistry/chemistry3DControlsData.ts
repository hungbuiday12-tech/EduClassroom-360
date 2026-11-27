import { Chemistry3DMode } from '../../types';

export interface Chem3DParamSpec {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  accentClass: string;
}

export interface Chem3DPresetSpec {
  label: string;
  description: string;
  params: Record<string, number>;
  flags?: Record<string, boolean | number>;
}

export interface Chem3DActionSpec {
  id: string;
  label: string;
  kind: 'toggle' | 'trigger' | 'reset';
  flagKey?: string;
  accent?: 'emerald' | 'sky' | 'amber' | 'rose';
}

export interface Chem3DReadout {
  equationText: string;
  statusNote: string;
  probeParams: Record<string, number>;
}

export interface Chem3DModeConfig {
  mode: Chemistry3DMode;
  title: string;
  subtitle: string;
  formulaHint: string;
  params: Chem3DParamSpec[];
  presets: Chem3DPresetSpec[];
  actions: Chem3DActionSpec[];
  defaultFlags: Record<string, boolean | number>;
  computeReadout: (
    params: Record<string, number>,
    flags: Record<string, boolean | number>,
    simTime: number
  ) => Chem3DReadout;
}

const makeDefaultModeConfig = (
  mode: Chemistry3DMode,
  title: string,
  subtitle: string,
  formulaHint: string,
  params: Chem3DParamSpec[],
  presets: Chem3DPresetSpec[],
  actions: Chem3DActionSpec[],
  defaultFlags: Record<string, boolean | number>,
  computeReadout: Chem3DModeConfig['computeReadout']
): Chem3DModeConfig => ({
  mode,
  title,
  subtitle,
  formulaHint,
  params,
  presets,
  actions,
  defaultFlags,
  computeReadout
});

export const CHEMISTRY_3D_CONFIGS: Record<Chemistry3DMode, Chem3DModeConfig> = {
  titration_bench_3d: makeDefaultModeConfig(
    'titration_bench_3d',
    'Chuẩn độ Acid – Base với Buret & Bình Tam Giác',
    'Bình ban đầu chứa 25 mL HCl 0,1M + chỉ thị không màu; tự mở khóa buret nhỏ từng giọt NaOH 0,1M.',
    'n_{\\text{H}^+} = n_{\\text{OH}^-} \\Rightarrow C_a V_a = C_b V_b',
    [
      { key: 'vBase', label: 'Thể tích NaOH đã nhỏ', unit: 'mL', min: 0, max: 40, step: 0.5, defaultVal: 0, accentClass: 'accent-pink-500' },
      { key: 'concAcid', label: 'Nồng độ HCl ban đầu', unit: 'M', min: 0.05, max: 0.16, step: 0.01, defaultVal: 0.1, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ phòng', unit: '°C', min: 15, max: 45, step: 1, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Chưa nhỏ giọt', description: 'Trạng thái ban đầu chưa mở khóa buret', params: { vBase: 0, concAcid: 0.1 }, flags: { indicatorAdded: true, valveOpen: false, stirring: false } },
      { label: 'Gần tương đương', description: 'Thêm 24 mL NaOH (gần đổi màu)', params: { vBase: 24, concAcid: 0.1 }, flags: { indicatorAdded: true, valveOpen: true, stirring: true } },
      { label: 'Điểm tương đương', description: 'Hồng cánh sen bền (pH ≈ 8,2)', params: { vBase: 25.5, concAcid: 0.1 }, flags: { indicatorAdded: true, valveOpen: false, stirring: true } }
    ],
    [
      { id: 'indicator', label: 'Nhỏ Phenolphthalein', kind: 'toggle', flagKey: 'indicatorAdded', accent: 'amber' },
      { id: 'drip_2ml', label: 'Mở khóa nhỏ +2 mL NaOH', kind: 'trigger', accent: 'sky' },
      { id: 'valve', label: 'Mở/Đóng khóa Buret', kind: 'toggle', flagKey: 'valveOpen', accent: 'emerald' },
      { id: 'stir', label: 'Bật khuấy từ', kind: 'toggle', flagKey: 'stirring', accent: 'amber' },
      { id: 'reset_exp', label: 'Rửa bình & Làm lại', kind: 'reset', accent: 'rose' }
    ],
    { indicatorAdded: false, valveOpen: false, stirring: false },
    (p, f) => {
      const vAcid = 25;
      const eqVol = (vAcid * (p.concAcid ?? 0.1)) / 0.1;
      const vBase = p.vBase ?? 0;
      const ratio = vBase / Math.max(1, eqVol);
      const ph = Math.max(0.9, Math.min(13.1, 1.3 + 11.4 / (1 + Math.exp(-(ratio - 1) * 8.5))));
      const hasInd = Boolean(f.indicatorAdded);
      const isPink = hasInd && ph >= 8.2;
      return {
        equationText: `V_NaOH = ${vBase.toFixed(1)} mL · V_tđ = ${eqVol.toFixed(1)} mL · pH = ${ph.toFixed(2)}`,
        statusNote: !hasInd
          ? 'Bước 1: Bình mới chỉ có HCl trong suốt. Hãy nhấn "Nhỏ Phenolphthalein" rồi mở khóa Buret!'
          : isPink
          ? 'Đạt/vượt điểm tương đương (pH ≥ 8,2): dung dịch chuyển hồng cánh sen bền!'
          : `Đang chuẩn độ (${vBase.toFixed(1)}/${eqVol.toFixed(1)} mL): dung dịch vẫn trong suốt, tiếp tục nhỏ giọt NaOH.`,
        probeParams: { tempC: p.tempC ?? 25, conc: p.concAcid ?? 0.1, vBase, vAcid, ph }
      };
    }
  ),

  galvanic_cell_3d: makeDefaultModeConfig(
    'galvanic_cell_3d',
    'Pin Điện Hóa Galvani (Zn | Zn²⁺ || Cu²⁺ | Cu)',
    'Hai cốc bán pin ban đầu hở mạch; tự nhúng cầu muối KCl và đóng công tắc để electron chạy.',
    'E^\\circ_{\\text{pin}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}',
    [
      { key: 'concCu', label: 'Nồng độ Cu²⁺', unit: 'M', min: 0.1, max: 2.0, step: 0.1, defaultVal: 1.0, accentClass: 'accent-sky-500' },
      { key: 'concZn', label: 'Nồng độ Zn²⁺', unit: 'M', min: 0.1, max: 2.0, step: 0.1, defaultVal: 1.0, accentClass: 'accent-emerald-500' },
      { key: 'tempC', label: 'Nhiệt độ T', unit: '°C', min: 10, max: 60, step: 1, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Mạch hở ban đầu', description: 'Chưa đóng công tắc, chưa đo được dòng', params: { concCu: 1.0, concZn: 1.0, tempC: 25 }, flags: { saltBridgeIn: false, circuitClosed: false } },
      { label: 'Điều kiện chuẩn 1M', description: 'Pin Daniell chuẩn E° = +1,10 V', params: { concCu: 1.0, concZn: 1.0, tempC: 25 }, flags: { saltBridgeIn: true, circuitClosed: true } },
      { label: 'Tăng nồng độ Cu²⁺', description: 'Tăng thế điện cực theo phương trình Nernst', params: { concCu: 2.0, concZn: 0.2, tempC: 35 }, flags: { saltBridgeIn: true, circuitClosed: true } }
    ],
    [
      { id: 'bridge', label: 'Nhúng Cầu muối KCl', kind: 'toggle', flagKey: 'saltBridgeIn', accent: 'sky' },
      { id: 'circuit', label: 'Đóng công tắc mạch ngoài', kind: 'toggle', flagKey: 'circuitClosed', accent: 'emerald' },
      { id: 'reset_exp', label: 'Ngắt mạch & Rửa điện cực', kind: 'reset', accent: 'rose' }
    ],
    { saltBridgeIn: false, circuitClosed: false },
    (p, f) => {
      const tK = (p.tempC ?? 25) + 273.15;
      const q = (p.concZn ?? 1) / Math.max(0.05, p.concCu ?? 1);
      const eNernst = 1.1 - ((8.314 * tK) / (2 * 96500)) * Math.log(q);
      const active = Boolean(f.saltBridgeIn) && Boolean(f.circuitClosed);
      return {
        equationText: active
          ? `E_pin = +${eNernst.toFixed(3)} V · Zn → Zn²⁺ + 2e⁻ | Cu²⁺ + 2e⁻ → Cu`
          : `Mạch hở (V = 0,00 V) · Cần đủ Cầu muối + Công tắc đóng`,
        statusNote: !f.saltBridgeIn
          ? 'Bước 1: Chưa có cầu muối KCl để trung hòa điện tích hai bán pin. Hãy nhấn "Nhúng Cầu muối KCl".'
          : !f.circuitClosed
          ? 'Bước 2: Cầu muối đã nhúng! Hãy đóng công tắc mạch ngoài để dòng electron từ Zn → Cu chạy qua Vôn kế.'
          : `Pin đang phát điện E = +${eNernst.toFixed(3)} V: thanh Zn mòn dần, đồng đỏ bám lên thanh Cu.`,
        probeParams: { tempC: p.tempC ?? 25, conc: p.concCu ?? 1, eCell: active ? eNernst : 0 }
      };
    }
  ),

  electrolysis_cell_3d: makeDefaultModeConfig(
    'electrolysis_cell_3d',
    'Bình Điện Phân Dung Dịch CuSO₄ / NaCl',
    'Bình ban đầu tắt nguồn DC; bật nguồn và điều chỉnh cường độ dòng điện I để quan sát Cu bám Cathode & bọt khí Anode.',
    'm = \\frac{A \\cdot I \\cdot t}{n \\cdot F} \\quad (F = 96\\,500\\text{ C/mol})',
    [
      { key: 'currentA', label: 'Cường độ dòng I', unit: 'A', min: 0.5, max: 10, step: 0.5, defaultVal: 2.5, accentClass: 'accent-amber-500' },
      { key: 'conc', label: 'Nồng độ CuSO₄', unit: 'M', min: 0.1, max: 1.5, step: 0.1, defaultVal: 0.5, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ bình', unit: '°C', min: 20, max: 60, step: 1, defaultVal: 25, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Chưa cấp điện', description: 'Tắt nguồn DC ban đầu', params: { currentA: 2.5, conc: 0.5, tempC: 25 }, flags: { powerOn: false } },
      { label: 'Mạ đồng vừa (2,5 A)', description: 'Cu²⁺ khử êm ở Cathode (−)', params: { currentA: 2.5, conc: 0.8, tempC: 25 }, flags: { powerOn: true } },
      { label: 'Dòng mạnh (8,0 A)', description: 'Sủi mạnh khí O₂/Cl₂ ở Anode (+)', params: { currentA: 8.0, conc: 1.0, tempC: 35 }, flags: { powerOn: true } }
    ],
    [
      { id: 'power', label: 'Bật / Tắt nguồn DC', kind: 'toggle', flagKey: 'powerOn', accent: 'emerald' },
      { id: 'reset_exp', label: 'Ngắt nguồn & Làm sạch cực', kind: 'reset', accent: 'rose' }
    ],
    { powerOn: false },
    (p, f, simTime) => {
      const on = Boolean(f.powerOn);
      const cur = p.currentA ?? 2.5;
      const mCu = on ? (64 * cur * Math.min(3600, simTime * 40)) / (2 * 96500) : 0;
      return {
        equationText: on
          ? `I = ${cur.toFixed(1)} A · m_Cu bám ≈ ${mCu.toFixed(3)} g · Cathode: Cu²⁺+2e→Cu`
          : `Nguồn DC ĐANG TẮT (I = 0 A) · Chưa điện phân`,
        statusNote: on
          ? 'Đang điện phân: Cu đỏ bám dần lên Cathode (−) và khí O₂ sủi bọt ở Anode (+).'
          : 'Nhấn "Bật nguồn DC" để cấp điện một chiều vào hai điện cực.',
        probeParams: { tempC: p.tempC ?? 25, conc: p.conc ?? 0.5, eCell: on ? 3.5 + cur * 0.25 : 0 }
      };
    }
  ),

  halogen_ion_bench_3d: makeDefaultModeConfig(
    'halogen_ion_bench_3d',
    'Giá 4 Ống Nghiệm Nhận Biết Ion Halide (F⁻, Cl⁻, Br⁻, I⁻)',
    '4 ống ban đầu chỉ chứa dung dịch muối NaF, NaCl, NaBr, NaI trong suốt; tự tay nhỏ AgNO₃ rồi thử hòa tan bằng NH₃.',
    '\\text{Ag}^+ + X^- \\to \\text{Ag}X\\downarrow \\quad (X = \\text{Cl, Br, I})',
    [
      { key: 'conc', label: 'Nồng độ muối NaX', unit: 'M', min: 0.05, max: 0.5, step: 0.05, defaultVal: 0.1, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ phòng', unit: '°C', min: 15, max: 50, step: 1, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: '4 ống chưa thử', description: 'Dung dịch NaF, NaCl, NaBr, NaI ban đầu trong suốt', params: { conc: 0.1, tempC: 25 }, flags: { agno3Added: false, nh3Added: false } },
      { label: 'Sau khi nhỏ AgNO₃', description: 'AgCl trắng, AgBr vàng nhạt, AgI vàng đậm', params: { conc: 0.2, tempC: 25 }, flags: { agno3Added: true, nh3Added: false } },
      { label: 'Thêm NH₃ dư', description: 'Kết tủa AgCl tan tạo phức [Ag(NH₃)₂]⁺', params: { conc: 0.2, tempC: 25 }, flags: { agno3Added: true, nh3Added: true } }
    ],
    [
      { id: 'add_agno3', label: 'Nhỏ dung dịch AgNO₃', kind: 'toggle', flagKey: 'agno3Added', accent: 'amber' },
      { id: 'add_nh3', label: 'Thêm NH₃ dư hòa tan', kind: 'toggle', flagKey: 'nh3Added', accent: 'sky' },
      { id: 'reset_exp', label: 'Rửa 4 ống nghiệm', kind: 'reset', accent: 'rose' }
    ],
    { agno3Added: false, nh3Added: false },
    (p, f) => {
      const ag = Boolean(f.agno3Added);
      const nh3 = Boolean(f.nh3Added);
      return {
        equationText: !ag
          ? '4 ống NaF · NaCl · NaBr · NaI đều trong suốt'
          : nh3
          ? 'AgCl↓ + 2NH₃ → [Ag(NH₃)₂]Cl (tan) | AgBr, AgI không tan'
          : 'NaF: không tủa · NaCl: AgCl↓ trắng · NaBr: AgBr↓ vàng nhạt · NaI: AgI↓ vàng đậm',
        statusNote: !ag
          ? 'Bước 1: Nhấn "Nhỏ dung dịch AgNO₃" vào 4 ống nghiệm để quan sát sự hình thành kết tủa.'
          : !nh3
          ? 'Đã tạo kết tủa! Nhấn "Thêm NH₃ dư" để kiểm tra xem kết tủa trắng AgCl có bị hòa tan không.'
          : 'Kết tủa trắng AgCl tan hết trong NH₃ tạo phức không màu; AgI vàng đậm không tan.',
        probeParams: { tempC: p.tempC ?? 25, conc: p.conc ?? 0.1 }
      };
    }
  ),

  ester_reflux_3d: makeDefaultModeConfig(
    'ester_reflux_3d',
    'Bộ Đun Hồi Lưu & Sinh Hàn Tổng Hợp Este (Etyl Axetat)',
    'Bình cầu ban đầu nguội với hỗn hợp chưa đun; tự cho xúc tác H₂SO₄ đặc, bật đèn đun 78°C và tách lớp Este.',
    '\\text{CH}_3\\text{COOH} + \\text{C}_2\\text{H}_5\\text{OH} \\xrightleftharpoons[t^\\circ]{\\text{H}_2\\text{SO}_4\\text{ đ}} \\text{CH}_3\\text{COOC}_2\\text{H}_5 + \\text{H}_2\\text{O}',
    [
      { key: 'tempC', label: 'Nhiệt độ đun bình cầu', unit: '°C', min: 25, max: 95, step: 1, defaultVal: 25, accentClass: 'accent-amber-500' },
      { key: 'conc', label: 'Tỉ lệ ancol dư', unit: 'mol', min: 0.5, max: 3.0, step: 0.1, defaultVal: 1.0, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Chưa đun (25°C)', description: 'Bình cầu chưa gia nhiệt', params: { tempC: 25, conc: 1.0 }, flags: { catalystAdded: false, burnerOn: false } },
      { label: 'Đun hồi lưu 78°C', description: 'Hơi este bay qua ống sinh hàn ngưng tụ', params: { tempC: 78, conc: 1.5 }, flags: { catalystAdded: true, burnerOn: true } },
      { label: 'Tăng hiệu suất (Ancol dư)', description: 'Cân bằng chuyển dịch sang tạo nhiều este', params: { tempC: 82, conc: 2.5 }, flags: { catalystAdded: true, burnerOn: true } }
    ],
    [
      { id: 'catalyst', label: 'Thêm H₂SO₄ đặc xúc tác', kind: 'toggle', flagKey: 'catalystAdded', accent: 'amber' },
      { id: 'burner', label: 'Bật / Tắt đèn đun bình cầu', kind: 'toggle', flagKey: 'burnerOn', accent: 'emerald' },
      { id: 'reset_exp', label: 'Rửa bình & Làm lại', kind: 'reset', accent: 'rose' }
    ],
    { catalystAdded: false, burnerOn: false },
    (p, f) => {
      const cat = Boolean(f.catalystAdded);
      const heat = Boolean(f.burnerOn);
      const t = heat ? Math.max(65, p.tempC ?? 78) : p.tempC ?? 25;
      const yieldPct = cat && heat ? Math.min(88, Math.round(45 + ((p.conc ?? 1) - 0.5) * 16 + (t - 60) * 0.4)) : 0;
      return {
        equationText: cat && heat
          ? `T = ${t}°C · Xúc tác H₂SO₄ đ · Hiệu suất H ≈ ${yieldPct}%`
          : 'Phản ứng thuận nghịch rất chậm ở nhiệt độ thường',
        statusNote: !cat
          ? 'Bước 1: Thêm vài giọt H₂SO₄ đặc vừa làm xúc tác vừa hút nước.'
          : !heat
          ? 'Bước 2: Nhấn "Bật đèn đun bình cầu" để đun sôi nhẹ hỗn hợp và ngưng tụ este qua ống sinh hàn.'
          : `Đang chưng cất ở ${t}°C: Etyl axetat mùi táo chín nhẹ hơn nước nổi thành lớp trên trong bình hứng!`,
        probeParams: { tempC: t, conc: p.conc ?? 1.0 }
      };
    }
  ),

  carbonyl_alcohol_3d: makeDefaultModeConfig(
    'carbonyl_alcohol_3d',
    'Phân Tử Aldehyde & Ống Nghiệm Tráng Bạc (Tollens)',
    'Ống nghiệm ban đầu sạch chưa có lớp gương Ag; tự nhỏ thuốc thử AgNO₃/NH₃ và đun cách thủy để tráng bạc.',
    '\\text{CH}_3\\text{CHO} + 2[\\text{Ag}(\\text{NH}_3)_2]\\text{OH} \\xrightarrow{t^\\circ} \\text{CH}_3\\text{COONH}_4 + 2\\text{Ag}\\downarrow + 3\\text{NH}_3 + \\text{H}_2\\text{O}',
    [
      { key: 'tempC', label: 'Nhiệt độ đun cách thủy', unit: '°C', min: 25, max: 85, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' },
      { key: 'conc', label: 'Nồng độ CH₃CHO', unit: 'M', min: 0.1, max: 1.0, step: 0.1, defaultVal: 0.4, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Ống nghiệm sạch', description: 'Chưa nhỏ thuốc thử Tollens', params: { tempC: 25, conc: 0.4 }, flags: { tollensAdded: false, warmed: false } },
      { label: 'Đã nhỏ Tollens (nguội)', description: 'Dung dịch trong suốt chưa đun', params: { tempC: 25, conc: 0.5 }, flags: { tollensAdded: true, warmed: false } },
      { label: 'Tráng gương sáng bóng', description: 'Đun 65°C tạo lớp Ag↓ bám thành ống', params: { tempC: 65, conc: 0.8 }, flags: { tollensAdded: true, warmed: true } }
    ],
    [
      { id: 'tollens', label: 'Nhỏ thuốc thử AgNO₃/NH₃', kind: 'toggle', flagKey: 'tollensAdded', accent: 'sky' },
      { id: 'warm', label: 'Đun cách thủy 65°C', kind: 'toggle', flagKey: 'warmed', accent: 'amber' },
      { id: 'reset_exp', label: 'Rửa sạch ống nghiệm', kind: 'reset', accent: 'rose' }
    ],
    { tollensAdded: false, warmed: false },
    (p, f) => {
      const tol = Boolean(f.tollensAdded);
      const warm = Boolean(f.warmed);
      return {
        equationText: tol && warm
          ? '1 mol CH₃CHO → 2 mol Ag↓ sáng bóng bám thành ống thủy tinh'
          : 'Nhóm -CHO (sp² phẳng, góc 120°) chờ phản ứng oxi hóa êm dịu',
        statusNote: !tol
          ? 'Bước 1: Nhỏ thuốc thử Tollens ([Ag(NH₃)₂]OH) vào ống nghiệm chứa anđehit.'
          : !warm
          ? 'Bước 2: Nhấn "Đun cách thủy 65°C" (tránh đun sôi lắc mạnh) để bạc kết tủa bám mịn thành gương.'
          : 'Thành công! Lớp bạc Ag kim loại sáng bóng như gương đã phủ kín thành ống nghiệm.',
        probeParams: { tempC: warm ? Math.max(60, p.tempC ?? 65) : p.tempC ?? 25, conc: p.conc ?? 0.4 }
      };
    }
  ),

  alkene_addition_3d: makeDefaultModeConfig(
    'alkene_addition_3d',
    'Phản Ứng Cộng Nước Brom (C₂H₄ + Br₂ → C₂H₄Br₂)',
    'Ống/mô hình ban đầu ở trạng thái Etilen + Brom nâu đỏ tách rời; tự dẫn khí và kích hoạt phản ứng cộng đứt nối π.',
    '\\text{CH}_2=\\text{CH}_2 + \\text{Br}_2\\text{ (nâu đỏ)} \\to \\text{BrCH}_2-\\text{CH}_2\\text{Br}\\text{ (không màu)}',
    [
      { key: 'conc', label: 'Lượng Etilen sục vào', unit: 'mol', min: 0.1, max: 1.5, step: 0.1, defaultVal: 0.5, accentClass: 'accent-purple-500' },
      { key: 'tempC', label: 'Nhiệt độ phản ứng', unit: '°C', min: 15, max: 60, step: 1, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Chưa sục khí (Nâu đỏ)', description: 'Nước Brom giữ nguyên màu nâu đỏ', params: { conc: 0.5, tempC: 25 }, flags: { bromAdded: true, gasBubbled: false } },
      { label: 'Sục C₂H₄ (Mất màu)', description: 'Cộng ái điện tử AE phá vỡ nối π', params: { conc: 1.0, tempC: 25 }, flags: { bromAdded: true, gasBubbled: true } }
    ],
    [
      { id: 'brom', label: 'Bơm nước Brom (Nâu đỏ)', kind: 'toggle', flagKey: 'bromAdded', accent: 'amber' },
      { id: 'bubble', label: 'Sục khí Etilen C₂H₄', kind: 'toggle', flagKey: 'gasBubbled', accent: 'emerald' },
      { id: 'reset_exp', label: 'Làm sạch hệ', kind: 'reset', accent: 'rose' }
    ],
    { bromAdded: true, gasBubbled: false },
    (p, f) => {
      const done = Boolean(f.bromAdded) && Boolean(f.gasBubbled);
      return {
        equationText: done
          ? 'CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br (Mất màu hoàn toàn)'
          : 'Phân tử Br₂ (nâu đỏ) chưa tiếp xúc nối đôi C=C',
        statusNote: done
          ? 'Liên kết π kém bền đứt ra, hai nguyên tử Br cộng vào hai cacbon làm nước Brom mất màu!'
          : 'Nhấn "Sục khí Etilen C₂H₄" để quan sát Br₂ tấn công đám mây π và làm mất màu dung dịch.',
        probeParams: { tempC: p.tempC ?? 25, conc: p.conc ?? 0.5 }
      };
    }
  ),

  metal_corrosion_3d: makeDefaultModeConfig(
    'metal_corrosion_3d',
    'Ăn Mòn Điện Hóa (Fe–C) & Bảo Vệ Anode Hy Sinh (Zn)',
    'Mẫu sắt–đồng ban đầu khô ráo chưa bị gỉ; tự nhỏ giọt nước muối ẩm để thấy ăn mòn, rồi gắn thanh Zn bảo vệ.',
    '\\text{Fe} \\to \\text{Fe}^{2+} + 2e^- \\quad | \\quad \\text{Gắn Zn}: \\text{Zn} \\to \\text{Zn}^{2+} + 2e^-',
    [
      { key: 'conc', label: 'Độ mặn NaCl (điện li)', unit: '%', min: 0, max: 10, step: 0.5, defaultVal: 3.5, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ môi trường', unit: '°C', min: 15, max: 55, step: 1, defaultVal: 28, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Kim loại khô sạch', description: 'Chưa có chất điện li → chưa gỉ', params: { conc: 0, tempC: 25 }, flags: { electrolyteWet: false, znProtected: false } },
      { label: 'Ngấm nước biển (Gỉ Fe)', description: 'Ăn mòn điện hóa Fe–Cu nhanh chóng', params: { conc: 3.5, tempC: 30 }, flags: { electrolyteWet: true, znProtected: false } },
      { label: 'Gắn thanh Kẽm Zn', description: 'Zn hy sinh bị mòn thay cho sắt Fe', params: { conc: 3.5, tempC: 30 }, flags: { electrolyteWet: true, znProtected: true } }
    ],
    [
      { id: 'wet', label: 'Nhỏ giọt nước muối ẩm', kind: 'toggle', flagKey: 'electrolyteWet', accent: 'sky' },
      { id: 'zn', label: 'Gắn thanh Kẽm (Anode hy sinh)', kind: 'toggle', flagKey: 'znProtected', accent: 'emerald' },
      { id: 'reset_exp', label: 'Đánh sạch gỉ mẫu', kind: 'reset', accent: 'rose' }
    ],
    { electrolyteWet: false, znProtected: false },
    (p, f) => {
      const wet = Boolean(f.electrolyteWet);
      const zn = Boolean(f.znProtected);
      return {
        equationText: !wet
          ? 'Thiếu dung dịch điện li → Pin ăn mòn chưa hoạt động'
          : zn
          ? 'Bảo vệ Catot: Zn (-0,76V) bị oxi hóa thay cho Fe (-0,44V)!'
          : 'Ăn mòn điện hóa: Fe → Fe²⁺ + 2e⁻ → gỉ sắt Fe₂O₃·nH₂O nâu đỏ',
        statusNote: !wet
          ? 'Bước 1: Nhấn "Nhỏ giọt nước muối ẩm" để hoàn thành 3 điều kiện ăn mòn điện hóa.'
          : zn
          ? 'Thành công! Thanh Kẽm hoạt động mạnh hơn đã nhận làm Anode hy sinh, vỏ sắt Fe được bảo vệ nguyên vẹn.'
          : 'Fe đang bị gỉ nhanh! Hãy thử nhấn "Gắn thanh Kẽm" giống cách bảo vệ vỏ tàu biển.',
        probeParams: { tempC: p.tempC ?? 28, conc: p.conc ?? 3.5, eCell: wet ? (zn ? 1.1 : 0.78) : 0 }
      };
    }
  ),

  spectroscopy_prism_3d: makeDefaultModeConfig(
    'spectroscopy_prism_3d',
    'Thử Màu Ngọn Lửa & Quang Phổ Lăng Kính (IA / IIA)',
    'Đèn Bunsen ban đầu tắt; tự bật đèn và đưa mẫu muối Li⁺, Na⁺, K⁺, Ca²⁺, Ba²⁺ vào ngọn lửa để tách vạch phổ.',
    '\\Delta E = h\\nu = \\frac{hc}{\\lambda}',
    [
      { key: 'ionType', label: 'Mẫu muối (1:Na 2:K 3:Ca 4:Ba)', unit: 'ion', min: 1, max: 4, step: 1, defaultVal: 1, accentClass: 'accent-amber-500' },
      { key: 'tempC', label: 'Nhiệt độ ngọn lửa', unit: '°C', min: 400, max: 1400, step: 50, defaultVal: 950, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Chưa bật đèn', description: 'Tắt đèn khí ban đầu', params: { ionType: 1, tempC: 950 }, flags: { burnerOn: false } },
      { label: 'Muối Na⁺ (Vàng 589nm)', description: 'Ngọn lửa vàng rực đặc trưng Natri', params: { ionType: 1, tempC: 950 }, flags: { burnerOn: true } },
      { label: 'Muối K⁺ (Tím) / Ca²⁺ (Đỏ cam)', description: 'Phổ vạch riêng của từng kim loại', params: { ionType: 2, tempC: 1050 }, flags: { burnerOn: true } }
    ],
    [
      { id: 'burner', label: 'Bật / Tắt đèn Bunsen', kind: 'toggle', flagKey: 'burnerOn', accent: 'amber' },
      { id: 'reset_exp', label: 'Tắt đèn & Rửa que cấy', kind: 'reset', accent: 'rose' }
    ],
    { burnerOn: false },
    (p, f) => {
      const names = ['', 'Na⁺ (Vàng tươi 589 nm)', 'K⁺ (Tím hoa cà 766 nm)', 'Ca²⁺ (Đỏ cam 622 nm)', 'Ba²⁺ (Lục vàng 524 nm)'];
      const ion = Math.round(p.ionType ?? 1);
      const on = Boolean(f.burnerOn);
      return {
        equationText: on ? `Vạch phát xạ: ${names[ion] || names[1]} · T = ${p.tempC ?? 950}°C` : 'Đèn khí đang tắt · Chưa kích thích electron phát xạ',
        statusNote: on
          ? `Đang đốt mẫu ${names[ion] || names[1]}: electron nhảy lên mức cao rồi rơi về mức cơ bản phát photon màu đặc trưng.`
          : 'Nhấn "Bật đèn Bunsen" và chọn loại ion muối để quan sát vạch quang phổ qua lăng kính!',
        probeParams: { tempC: on ? (p.tempC ?? 950) : 25, conc: 0.2 }
      };
    }
  ),

  colloid_micelle_3d: makeDefaultModeConfig(
    'colloid_micelle_3d',
    'Cơ Chế Giặt Rửa Hạt Mixen Xà Phòng',
    'Giọt dầu ban đầu bám bẩn tách biệt; thêm xà phòng và khuấy để đuôi kị nước cắm vào dầu kéo trôi vào nước.',
    '\\text{R-COO}^-\\text{Na}^+: \\text{ Đầu ưa nước } (-\\text{COO}^-) + \\text{ Đuôi kị nước } (R)',
    [
      { key: 'soapConc', label: 'Lượng xà phòng thêm', unit: 'g/L', min: 0, max: 10, step: 0.5, defaultVal: 0, accentClass: 'accent-emerald-500' },
      { key: 'tempC', label: 'Nhiệt độ nước giặt', unit: '°C', min: 20, max: 70, step: 2, defaultVal: 30, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Chưa có xà phòng', description: 'Giọt dầu không tan trong nước', params: { soapConc: 0, tempC: 30 }, flags: { stirred: false } },
      { label: 'Hình thành Mixen', description: 'Bao bọc giọt dầu nhũ tương hóa', params: { soapConc: 6, tempC: 45 }, flags: { stirred: true } }
    ],
    [
      { id: 'add_soap', label: 'Thêm +2 g/L Xà phòng', kind: 'trigger', accent: 'emerald' },
      { id: 'stir', label: 'Khuấy đều tạo Mixen', kind: 'toggle', flagKey: 'stirred', accent: 'sky' },
      { id: 'reset_exp', label: 'Rửa sạch & Làm lại', kind: 'reset', accent: 'rose' }
    ],
    { stirred: false },
    (p, f) => {
      const soap = p.soapConc ?? 0;
      const micelleReady = soap >= 2 && Boolean(f.stirred);
      return {
        equationText: `Nồng độ xà phòng = ${soap.toFixed(1)} g/L · T = ${p.tempC ?? 30}°C`,
        statusNote: soap < 2
          ? 'Bước 1: Giọt dầu đứng riêng vì kị nước. Nhấn "Thêm +2 g/L Xà phòng" để cấp các phân tử lưỡng cực.'
          : !f.stirred
          ? 'Bước 2: Nhấn "Khuấy đều tạo Mixen" để các đuôi kị nước cắm vào giọt dầu!'
          : 'Hạt Mixen hoàn chỉnh đã bao bọc giọt dầu và phân tán dễ dàng vào nước rửa trôi.',
        probeParams: { tempC: p.tempC ?? 30, conc: soap * 0.1 }
      };
    }
  ),

  atomic_orbitals_3d: makeDefaultModeConfig(
    'atomic_orbitals_3d',
    'Đám Mây Orbital Nguyên Tử (AO s, p, d)',
    'Khảo sát vùng không gian xác suất ~90% tìm thấy electron và mặt phẳng nút ψ = 0.',
    '\\psi_{n,l,m}(r,\\theta,\\varphi) \\implies |\\psi|^2 \\approx 90\\%',
    [
      { key: 'quantumN', label: 'Lớp năng lượng n', unit: 'lớp', min: 1, max: 4, step: 1, defaultVal: 2, accentClass: 'accent-sky-500' },
      { key: 'cloudDensity', label: 'Mật độ hạt electron', unit: '%', min: 20, max: 100, step: 10, defaultVal: 70, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Orbital 2p_z', description: '2 thùy hình số 8 nổi đối xứng qua nút', params: { quantumN: 2, cloudDensity: 75 } },
      { label: 'Lớp 3d_z²', description: 'Có vòng xuyến mật độ cao quanh nhân', params: { quantumN: 3, cloudDensity: 90 } }
    ],
    [
      { id: 'excite', label: 'Kích thích Electron nhảy mức', kind: 'toggle', flagKey: 'excited', accent: 'amber' },
      { id: 'reset_exp', label: 'Về trạng thái cơ bản', kind: 'reset', accent: 'rose' }
    ],
    { excited: false },
    (p, f) => ({
      equationText: `n = ${Math.round(p.quantumN ?? 2)} · Số e tối đa = ${2 * Math.pow(Math.round(p.quantumN ?? 2), 2)} · ${f.excited ? 'Trạng thái kích thích' : 'Trạng thái cơ bản'}`,
      statusNote: 'Hai thùy +ψ và −ψ biểu diễn pha hàm sóng ngược dấu nhau; mặt phẳng nút có mật độ xác suất bằng 0.',
      probeParams: { tempC: 25, conc: 0.5 }
    })
  ),

  vsepr_geometry_3d: makeDefaultModeConfig(
    'vsepr_geometry_3d',
    'Hình Học Không Gian Phân Tử (VSEPR & Lai Hóa sp³)',
    'Quan sát sự đẩy nhau cực tiểu giữa các cặp electron liên kết tạo góc tứ diện chuẩn 109,5°.',
    '\\text{CH}_4\\ (sp^3): 109{,}5^\\circ > \\text{NH}_3: 107^\\circ > \\text{H}_2\\text{O}: 104{,}5^\\circ',
    [
      { key: 'bondAngle', label: 'Góc liên kết hiệu chỉnh', unit: '°', min: 100, max: 120, step: 0.5, defaultVal: 109.5, accentClass: 'accent-indigo-500' },
      { key: 'lonePairs', label: 'Số cặp e tự do (LP)', unit: 'cặp', min: 0, max: 2, step: 1, defaultVal: 0, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'CH₄ (0 LP · 109,5°)', description: 'Tứ diện đều đối xứng không phân cực', params: { bondAngle: 109.5, lonePairs: 0 } },
      { label: 'NH₃ (1 LP · 107°)', description: 'Chóp tam giác có 1 cặp e tự do đẩy', params: { bondAngle: 107, lonePairs: 1 } },
      { label: 'H₂O (2 LP · 104,5°)', description: 'Chữ V phân cực mạnh', params: { bondAngle: 104.5, lonePairs: 2 } }
    ],
    [
      { id: 'dipole', label: 'Hiện hướng phân cực', kind: 'toggle', flagKey: 'showDipole', accent: 'sky' },
      { id: 'reset_exp', label: 'Về chuẩn Tứ diện CH₄', kind: 'reset', accent: 'rose' }
    ],
    { showDipole: false },
    (p) => ({
      equationText: `Góc liên kết = ${(p.bondAngle ?? 109.5).toFixed(1)}° · Cặp tự do = ${Math.round(p.lonePairs ?? 0)}`,
      statusNote: 'Cặp electron tự do (LP) chiếm không gian lớn hơn cặp liên kết nên ép góc liên kết thu hẹp dần.',
      probeParams: { tempC: 25, conc: 0.5 }
    })
  ),

  crystal_lattice_3d: makeDefaultModeConfig(
    'crystal_lattice_3d',
    'Mạng Tinh Thể Ion Lập Phương Tâm Mặt (NaCl)',
    'Mỗi ion Na⁺ được bao quanh bởi 6 ion Cl⁻ tạo mạng lưới tĩnh điện rất bền, nhiệt độ nóng chảy 801°C.',
    '\\text{Số phối trí NaCl} = 6 : 6 \\quad (T_{\\text{nc}} = 801^\\circ\\text{C})',
    [
      { key: 'tempC', label: 'Nhiệt độ gia nhiệt mẫu', unit: '°C', min: 25, max: 900, step: 25, defaultVal: 25, accentClass: 'accent-amber-500' },
      { key: 'ionScale', label: 'Tỉ lệ bán kính r(Na⁺)/r(Cl⁻)', unit: '×', min: 0.5, max: 1.5, step: 0.1, defaultVal: 1.0, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Tinh thể rắn (25°C)', description: 'Các ion dao động nhẹ quanh nút mạng', params: { tempC: 25, ionScale: 1.0 }, flags: { dissolved: false } },
      { label: 'Nóng chảy (850°C)', description: 'Mạng tinh thể vỡ dẫn điện tốt', params: { tempC: 850, ionScale: 1.0 }, flags: { dissolved: true } }
    ],
    [
      { id: 'dissolve', label: 'Hòa tan vào nước / Nung nóng chảy', kind: 'toggle', flagKey: 'dissolved', accent: 'sky' },
      { id: 'reset_exp', label: 'Kết tinh lại tinh thể', kind: 'reset', accent: 'rose' }
    ],
    { dissolved: false },
    (p, f) => ({
      equationText: `T = ${p.tempC ?? 25}°C · ${f.dissolved || (p.tempC ?? 25) >= 801 ? 'Ion tự do → Dẫn điện mạnh!' : 'Tinh thể rắn → Không dẫn điện'}`,
      statusNote: 'Muối ăn NaCl rắn không dẫn điện vì ion bị khóa chặt ở nút mạng; khi nóng chảy hoặc tan trong nước mới dẫn điện.',
      probeParams: { tempC: p.tempC ?? 25, conc: f.dissolved ? 1.0 : 0.05 }
    })
  ),

  activation_surface_3d: makeDefaultModeConfig(
    'activation_surface_3d',
    'Hàng Rào Năng Lượng Hoạt Hóa Ea & Chất Xúc Tác',
    'So sánh đường phản ứng không xúc tác (Ea cao) với đường có xúc tác (hạ Ea giúp tốc độ tăng mạnh).',
    'k = A \\cdot e^{-E_a / (RT)}',
    [
      { key: 'tempC', label: 'Nhiệt độ T', unit: '°C', min: 20, max: 120, step: 5, defaultVal: 40, accentClass: 'accent-rose-500' },
      { key: 'catDrop', label: 'Mức hạ Ea nhờ xúc tác', unit: '%', min: 0, max: 60, step: 5, defaultVal: 35, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Không có xúc tác', description: 'Vượt rào Ea cao (phản ứng chậm)', params: { tempC: 35, catDrop: 0 }, flags: { catalystOn: false } },
      { label: 'Thêm xúc tác + Đun nóng', description: 'Hạ rào năng lượng → v tăng gấp bội', params: { tempC: 75, catDrop: 45 }, flags: { catalystOn: true } }
    ],
    [
      { id: 'cat', label: 'Thêm / Bỏ chất xúc tác', kind: 'toggle', flagKey: 'catalystOn', accent: 'emerald' },
      { id: 'reset_exp', label: 'Đặt lại mặc định', kind: 'reset', accent: 'rose' }
    ],
    { catalystOn: true },
    (p, f) => ({
      equationText: `T = ${p.tempC ?? 40}°C · ${f.catalystOn ? `Có xúc tác (hạ Ea ${p.catDrop ?? 35}%)` : 'Không xúc tác (Ea cao)'}`,
      statusNote: 'Xúc tác mở lối đi mới có năng lượng hoạt hóa thấp hơn, không bị tiêu hao sau phản ứng.',
      probeParams: { tempC: p.tempC ?? 40, conc: 0.6 }
    })
  ),

  equilibrium_piston_3d: makeDefaultModeConfig(
    'equilibrium_piston_3d',
    'Xi-Lanh Cân Bằng Động N₂O₄ (không màu) ⇌ 2NO₂ (nâu đỏ)',
    'Thay đổi áp suất P (nén/dãn pít-tông) hoặc nhiệt độ T để quan sát chuyển dịch theo nguyên lí Le Chatelier.',
    '\\text{N}_2\\text{O}_4(g) \\rightleftharpoons 2\\text{NO}_2(g) \\quad (\\Delta_r H^\\circ = +57{,}2\\text{ kJ})',
    [
      { key: 'pressureAtm', label: 'Áp suất nén pít-tông', unit: 'atm', min: 0.5, max: 4.0, step: 0.25, defaultVal: 1.0, accentClass: 'accent-amber-500' },
      { key: 'tempC', label: 'Nhiệt độ bình', unit: '°C', min: 0, max: 90, step: 5, defaultVal: 25, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Trạng thái 1 atm, 25°C', description: 'Cân bằng trung gian nâu nhạt', params: { pressureAtm: 1.0, tempC: 25 } },
      { label: 'Nén pít-tông 3 atm', description: 'Chuyển sang N₂O₄ (ít mol khí hơn → nhạt màu)', params: { pressureAtm: 3.0, tempC: 20 } },
      { label: 'Đun nóng 80°C', description: 'Chuyển theo chiều thu nhiệt tạo NO₂ nâu đậm', params: { pressureAtm: 1.0, tempC: 80 } }
    ],
    [
      { id: 'compress', label: 'Nén mạnh Pít-tông', kind: 'toggle', flagKey: 'compressed', accent: 'amber' },
      { id: 'reset_exp', label: 'Về 1 atm · 25°C', kind: 'reset', accent: 'rose' }
    ],
    { compressed: false },
    (p, f) => {
      const pr = f.compressed ? Math.max(2.5, p.pressureAtm ?? 2.5) : p.pressureAtm ?? 1.0;
      const t = p.tempC ?? 25;
      return {
        equationText: `P = ${pr.toFixed(2)} atm · T = ${t}°C · ${pr > 1.8 ? 'Ưu tiên N₂O₄ (giảm số mol khí)' : t > 50 ? 'Ưu tiên NO₂ nâu đậm (thu nhiệt)' : 'Cân bằng động thuận = nghịch'}`,
        statusNote: 'Tăng áp suất làm cân bằng chuyển theo chiều tạo ít phân tử khí hơn (NO₂ → N₂O₄); tăng nhiệt độ làm dịch sang chiều thu nhiệt.',
        probeParams: { tempC: t, conc: pr * 0.4 }
      };
    }
  ),

  benzene_pi_3d: makeDefaultModeConfig(
    'benzene_pi_3d',
    'Vòng Thơm Benzen C₆H₆ & Hệ Liên Hợp 6π',
    '6 nguyên tử C lai hóa sp² nằm đồng phẳng, 6 electron p liên hợp thành 2 vòng mây π phía trên và dưới mặt phẳng vòng.',
    '\\text{C}_6\\text{H}_6 \\text{ bền vững: ưu tiên phản ứng thế } (\\text{Br}_2/\\text{FeBr}_3)',
    [
      { key: 'tempC', label: 'Nhiệt độ phản ứng', unit: '°C', min: 20, max: 100, step: 5, defaultVal: 25, accentClass: 'accent-sky-500' },
      { key: 'conc', label: 'Mức độ liên hợp', unit: '%', min: 50, max: 100, step: 5, defaultVal: 100, accentClass: 'accent-indigo-500' }
    ],
    [
      { label: 'Benzen 25°C', description: 'Không mất màu nước Brom', params: { tempC: 25, conc: 100 }, flags: { feBr3Added: false } },
      { label: 'Thế Br₂ + FeBr₃', description: 'Xúc tác FeBr₃ thế H tạo C₆H₅Br', params: { tempC: 60, conc: 100 }, flags: { feBr3Added: true } }
    ],
    [
      { id: 'febr3', label: 'Thêm xúc tác bột Fe / FeBr₃', kind: 'toggle', flagKey: 'feBr3Added', accent: 'amber' },
      { id: 'reset_exp', label: 'Đặt lại mẫu', kind: 'reset', accent: 'rose' }
    ],
    { feBr3Added: false },
    (p, f) => ({
      equationText: f.feBr3Added ? 'C₆H₆ + Br₂ —(FeBr₃, t°)→ C₆H₅Br + HBr↑' : '6π giải tỏa đều → Không cộng Br₂ ở điều kiện thường',
      statusNote: 'Nhờ hệ 6π giải tỏa vòng kín rất bền, Benzen ưu tiên phản ứng thế (giữ nguyên vòng thơm) hơn phản ứng cộng.',
      probeParams: { tempC: p.tempC ?? 25, conc: 0.5 }
    })
  ),

  polymer_chain_3d: makeDefaultModeConfig(
    'polymer_chain_3d',
    'Mạch Đại Phân Tử Polymer & Lưu Hóa Cao Su',
    'Quan sát các mắt xích nối dài trong phản ứng trùng hợp và khâu mạch bằng cầu lưu huỳnh -S-S-.',
    'n\\,\\text{CH}_2=\\text{CH}X \\xrightarrow{t^\\circ, p, \\text{xt}} (-\\text{CH}_2-\\text{CH}X-)_n',
    [
      { key: 'tempC', label: 'Nhiệt độ trùng hợp', unit: '°C', min: 25, max: 200, step: 5, defaultVal: 120, accentClass: 'accent-sky-500' },
      { key: 'conc', label: 'Hệ số trùng hợp n', unit: '×10³', min: 1, max: 10, step: 0.5, defaultVal: 5, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Nhiệt dẻo mạch thẳng (PE/PVC)', description: 'Có thể nấu chảy tái chế', params: { tempC: 120, conc: 5 }, flags: { vulcanized: false } },
      { label: 'Lưu hóa cầu -S-S-', description: 'Tạo mạng không gian đàn hồi bền nhiệt', params: { tempC: 150, conc: 8 }, flags: { vulcanized: true } }
    ],
    [
      { id: 'vulc', label: 'Thêm Lưu huỳnh lưu hóa (-S-S-)', kind: 'toggle', flagKey: 'vulcanized', accent: 'amber' },
      { id: 'reset_exp', label: 'Về mạch thẳng ban đầu', kind: 'reset', accent: 'rose' }
    ],
    { vulcanized: false },
    (p, f) => ({
      equationText: `Hệ số n ≈ ${((p.conc ?? 5) * 1000).toFixed(0)} · ${f.vulcanized ? 'Mạng không gian (Nhiệt rắn / Cao su lưu hóa)' : 'Mạch thẳng không phân nhánh (Nhiệt dẻo)'}`,
      statusNote: 'Cao su sau khi đun với 2–3% lưu huỳnh hình thành các cầu nối -S-S- giúp tăng độ đàn hồi, chống mài mòn.',
      probeParams: { tempC: p.tempC ?? 120, conc: (p.conc ?? 5) * 0.1 }
    })
  ),

  coordination_complex_3d: makeDefaultModeConfig(
    'coordination_complex_3d',
    'Phức Chất Bát Diện [Cu(H₂O)₆]²⁺ ↔ [Cu(NH₃)₄(H₂O)₂]²⁺',
    'Dung dịch CuSO₄ ban đầu màu xanh lơ; nhỏ NH₃ dư để thay thế phối tử nước thành phức xanh lam thẫm.',
    '[\\text{Cu}(\\text{H}_2\\text{O})_6]^{2+} + 4\\text{NH}_3 \\to [\\text{Cu}(\\text{NH}_3)_4(\\text{H}_2\\text{O})_2]^{2+} + 4\\text{H}_2\\text{O}',
    [
      { key: 'nh3Conc', label: 'Lượng NH₃ thêm vào', unit: 'M', min: 0, max: 2.0, step: 0.1, defaultVal: 0, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ dung dịch', unit: '°C', min: 15, max: 50, step: 1, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Chỉ có H₂O (Xanh lơ)', description: 'Phức aqua bát diện ban đầu', params: { nh3Conc: 0, tempC: 25 }, flags: { nh3Excess: false } },
      { label: 'NH₃ dư (Xanh lam thẫm)', description: 'Phức [Cu(NH₃)₄(H₂O)₂]²⁺ bền', params: { nh3Conc: 1.5, tempC: 25 }, flags: { nh3Excess: true } }
    ],
    [
      { id: 'add_nh3', label: 'Nhỏ dung dịch NH₃ dư', kind: 'toggle', flagKey: 'nh3Excess', accent: 'sky' },
      { id: 'reset_exp', label: 'Rửa về dung dịch CuSO₄ ban đầu', kind: 'reset', accent: 'rose' }
    ],
    { nh3Excess: false },
    (p, f) => {
      const ex = Boolean(f.nh3Excess) || (p.nh3Conc ?? 0) >= 0.8;
      return {
        equationText: ex
          ? 'Số phối trí = 6 · Phức [Cu(NH₃)₄(H₂O)₂]²⁺ màu xanh lam thẫm'
          : 'Số phối trí = 6 · Phức aqua [Cu(H₂O)₆]²⁺ màu xanh nhạt',
        statusNote: ex
          ? '4 phân tử NH₃ đã thay thế phối tử H₂O ở mặt phẳng xích đạo tạo màu xanh lam thẫm đặc trưng!'
          : 'Nhấn "Nhỏ dung dịch NH₃ dư" để quan sát sự thế phối tử quanh cation trung tâm Cu²⁺.',
        probeParams: { tempC: p.tempC ?? 25, conc: Math.max(0.2, p.nh3Conc ?? 0.5) }
      };
    }
  ),

  methane_ethane_3d: makeDefaultModeConfig(
    'methane_ethane_3d',
    'Cấu Trúc Phẳng Etilen (C₂H₄) & Góc Liên Kết 120°',
    'Hai nguyên tử Cacbon lai hóa sp² nối với nhau bằng 1 liên kết σ bền và 1 liên kết π kém bền.',
    '\\text{C}_2\\text{H}_4: \\text{ lai hóa } sp^2 \\text{ phẳng},\\; \\widehat{\\text{HCH}} \\approx 120^\\circ',
    [
      { key: 'tempC', label: 'Nhiệt độ kích thích', unit: '°C', min: 20, max: 300, step: 10, defaultVal: 25, accentClass: 'accent-amber-500' },
      { key: 'conc', label: 'Áp suất khí C₂H₄', unit: 'atm', min: 0.5, max: 5, step: 0.5, defaultVal: 1, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Phân tử C₂H₄ phẳng', description: 'Góc liên kết chuẩn 120°', params: { tempC: 25, conc: 1 } },
      { label: 'Điều kiện trùng hợp PE', description: 'Nhiệt độ và áp suất cao phá nối π', params: { tempC: 200, conc: 4.5 } }
    ],
    [
      { id: 'pi_break', label: 'Kích thích mở nối π (Trùng hợp)', kind: 'toggle', flagKey: 'piOpened', accent: 'amber' },
      { id: 'reset_exp', label: 'Về phân tử C₂H₄ ban đầu', kind: 'reset', accent: 'rose' }
    ],
    { piOpened: false },
    (p, f) => ({
      equationText: f.piOpened ? 'Liên kết π mở ra → n CH₂=CH₂ → (-CH₂-CH₂-)ₙ (Nhựa PE)' : 'Etilen C₂H₄ · Đồng phẳng 6 nguyên tử · 1σ + 1π',
      statusNote: 'Do 1 liên kết π nằm lệch ngoài trục nối C–C nên dễ bị phá vỡ trong phản ứng cộng và trùng hợp.',
      probeParams: { tempC: p.tempC ?? 25, conc: p.conc ?? 1 }
    })
  ),

  periodic_tower_3d: makeDefaultModeConfig(
    'periodic_tower_3d',
    'Tháp Tuần Hoàn 3D Biến Thiên Độ Âm Điện & Bán Kính',
    'So sánh sự biến thiên tuần hoàn theo Chu kì 2–4 và Nhóm IA–VIIIA.',
    '\\text{Chu kì (trái } \\to \\text{ phải)}: \\chi\\uparrow,\\; R\\downarrow',
    [
      { key: 'periodHighlight', label: 'Nhấn mạnh Chu kì', unit: 'CK', min: 2, max: 4, step: 1, defaultVal: 3, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ khảo sát', unit: '°C', min: 25, max: 100, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Chu kì 3 (Na → Ar)', description: 'Từ kim loại mạnh Na tới phi kim mạnh Cl', params: { periodHighlight: 3, tempC: 25 } },
      { label: 'Chu kì 2 (Li → Ne)', description: 'Đỉnh F có độ âm điện cao nhất 3,98', params: { periodHighlight: 2, tempC: 25 } }
    ],
    [
      { id: 'modeRadius', label: 'Đổi chiều Bán kính vs Độ âm điện', kind: 'toggle', flagKey: 'showRadius', accent: 'sky' },
      { id: 'reset_exp', label: 'Đặt lại mặc định', kind: 'reset', accent: 'rose' }
    ],
    { showRadius: false },
    (p, f) => ({
      equationText: f.showRadius
        ? `Chế độ Bán kính nguyên tử R: Giảm dần từ IA → VIIA (Chu kì ${Math.round(p.periodHighlight ?? 3)})`
        : `Chế độ Độ âm điện χ: Tăng dần từ IA → VIIA (Đỉnh tại Halogen)`,
      statusNote: 'Khí hiếm nhóm VIIIA có lớp vỏ bão hòa bền vững nên độ âm điện quy ước rất nhỏ.',
      probeParams: { tempC: p.tempC ?? 25, conc: 0.5 }
    })
  ),

  carbohydrate_ring_3d: makeDefaultModeConfig(
    'carbohydrate_ring_3d',
    'Vòng Pyranose 6 Cạnh α/β-D-Glucozơ (C₆H₁₂O₆)',
    'Quan sát 5 nhóm -OH liền kề (hòa tan Cu(OH)₂ tạo phức xanh lam) và vị trí nhóm -OH anomer tại C1.',
    '\\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{Cu(OH)}_2 \\to \\text{Phức xanh lam}',
    [
      { key: 'tempC', label: 'Nhiệt độ dung dịch', unit: '°C', min: 20, max: 85, step: 5, defaultVal: 25, accentClass: 'accent-emerald-500' },
      { key: 'conc', label: 'Nồng độ Glucose', unit: 'M', min: 0.1, max: 1.5, step: 0.1, defaultVal: 0.5, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Dung dịch nguội (25°C)', description: 'Hòa tan Cu(OH)₂ tạo phức xanh lam', params: { tempC: 25, conc: 0.5 }, flags: { cuoh2Added: true } },
      { label: 'Đun nóng (75°C)', description: 'Nhóm -CHO mở vòng khử Cu²⁺ tạo tủa Cu₂O đỏ gạch', params: { tempC: 75, conc: 0.8 }, flags: { cuoh2Added: true } }
    ],
    [
      { id: 'cuoh2', label: 'Thêm kết tủa Cu(OH)₂', kind: 'toggle', flagKey: 'cuoh2Added', accent: 'sky' },
      { id: 'reset_exp', label: 'Rửa sạch mẫu', kind: 'reset', accent: 'rose' }
    ],
    { cuoh2Added: false },
    (p, f) => {
      const t = p.tempC ?? 25;
      return {
        equationText: !f.cuoh2Added
          ? 'Mạch vòng α/β-D-Glucose (chiếm >99% trong dung dịch)'
          : t >= 65
          ? 'Đun nóng → Tủa đỏ gạch Cu₂O↓ (Nhờ nhóm -CHO dạng mạch hở)'
          : 'Nhiệt độ thường + Cu(OH)₂ → Phức đồng xanh lam thẫm',
        statusNote: 'Glucose có cả tính chất ancol đa chức (nhiều -OH kề) lẫn tính chất anđehit (-CHO ở dạng mạch hở cân bằng).',
        probeParams: { tempC: t, conc: p.conc ?? 0.5 }
      };
    }
  ),

  haber_contact_reactor_3d: makeDefaultModeConfig(
    'haber_contact_reactor_3d',
    'Tháp Tổng Hợp Amoniac (Haber N₂ + 3H₂ ⇌ 2NH₃)',
    'Thay đổi áp suất P và nhiệt độ tầng xúc tác Fe để tối ưu hiệu suất tổng hợp NH₃.',
    '\\text{N}_2(g) + 3\\text{H}_2(g) \\xrightleftharpoons[450^\\circ\\text{C},\\ 200\\text{ bar}]{\\text{Fe}} 2\\text{NH}_3(g) \\quad (\\Delta H = -91{,}8\\text{ kJ})',
    [
      { key: 'tempC', label: 'Nhiệt độ tháp xúc tác', unit: '°C', min: 250, max: 650, step: 25, defaultVal: 450, accentClass: 'accent-orange-500' },
      { key: 'pressureBar', label: 'Áp suất khí nén', unit: 'bar', min: 50, max: 350, step: 25, defaultVal: 200, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Chưa nạp xúc tác', description: 'Khí N₂, H₂ đi qua không phản ứng', params: { tempC: 300, pressureBar: 100 }, flags: { reactorActive: false } },
      { label: 'Chuẩn Haber (450°C · 200 bar)', description: 'Cân bằng tốc độ và hiệu suất công nghiệp', params: { tempC: 450, pressureBar: 200 }, flags: { reactorActive: true } }
    ],
    [
      { id: 'activate', label: 'Khởi động tháp xúc tác Fe', kind: 'toggle', flagKey: 'reactorActive', accent: 'amber' },
      { id: 'reset_exp', label: 'Ngừng nạp khí & Làm nguội', kind: 'reset', accent: 'rose' }
    ],
    { reactorActive: false },
    (p, f) => {
      const t = p.tempC ?? 450;
      const pr = p.pressureBar ?? 200;
      const yieldPct = f.reactorActive ? Math.max(12, Math.min(72, Math.round(28 + (pr - 100) * 0.14 - (t - 400) * 0.08))) : 0;
      return {
        equationText: f.reactorActive
          ? `T = ${t}°C · P = ${pr} bar · Hiệu suất chuyển hóa ≈ ${yieldPct}%`
          : 'Tháp ở chế độ chờ — Khởi động tháp xúc tác để bắt đầu tổng hợp',
        statusNote: 'Áp suất cao giúp cân bằng dịch về phía tạo ít mol khí (2NH₃), nhiệt độ 450°C giúp xúc tác Fe hoạt động tối ưu.',
        probeParams: { tempC: t, conc: pr / 200 }
      };
    }
  ),

  amino_peptide_3d: makeDefaultModeConfig(
    'amino_peptide_3d',
    'Chuỗi Peptide (-CO-NH-) & Phản Ứng Màu Biuret',
    'Quan sát liên kết peptide nối các gốc amino acid và thử nhỏ Cu(OH)₂ kiểm tra màu tím Biuret.',
    '\\text{Peptide (}\\ge 2\\text{ LK peptide)} + \\text{Cu(OH)}_2 \\to \\text{Phức màu tím}',
    [
      { key: 'ph', label: 'Độ pH dung dịch đệm', unit: 'pH', min: 1, max: 13, step: 0.5, defaultVal: 6, accentClass: 'accent-violet-500' },
      { key: 'tempC', label: 'Nhiệt độ phản ứng', unit: '°C', min: 20, max: 90, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Tripeptide trung tính', description: 'Chưa nhỏ thuốc thử Cu(OH)₂', params: { ph: 6, tempC: 25 }, flags: { biuretAdded: false } },
      { label: 'Phản ứng Biuret (Tím)', description: 'Môi trường kiềm + Cu(OH)₂ tạo phức tím', params: { ph: 11, tempC: 25 }, flags: { biuretAdded: true } }
    ],
    [
      { id: 'biuret', label: 'Nhỏ NaOH + Cu(OH)₂ (Thử Biuret)', kind: 'toggle', flagKey: 'biuretAdded', accent: 'amber' },
      { id: 'reset_exp', label: 'Rửa sạch mẫu', kind: 'reset', accent: 'rose' }
    ],
    { biuretAdded: false },
    (p, f) => {
      const ph = p.ph ?? 6;
      return {
        equationText: f.biuretAdded
          ? 'Xuất hiện phức màu TÍM Biuret đặc trưng (≥ 2 liên kết -CO-NH-)'
          : `pH = ${ph.toFixed(1)} · ${ph < 6 ? 'Dạng Cation (về cực âm)' : ph > 6.5 ? 'Dạng Anion (về cực dương)' : 'Ion lưỡng cực'}`,
        statusNote: 'Lưu ý: Đipeptit chỉ có 1 liên kết peptide nên KHÔNG cho phản ứng màu Biuret; từ tripeptit trở lên mới tạo màu tím.',
        probeParams: { tempC: p.tempC ?? 25, conc: 0.4, ph }
      };
    }
  ),

  matter_states_3d: makeDefaultModeConfig(
    'matter_states_3d',
    'Ba Thể Rắn – Lỏng – Khí & Chuyển Thể 3D',
    'Thay đổi nhiệt độ để xem các phân tử rung trong mạng rắn (dưới 0°C), trượt lỏng (0–100°C) hoặc bay tự do khi hóa hơi.',
    '\\text{Rắn } (\\Delta E \\uparrow) \\xrightarrow{\\text{Nóng chảy}} \\text{Lỏng } (\\Delta E \\uparrow) \\xrightarrow{\\text{Bay hơi}} \\text{Khí}',
    [
      { key: 'tempC', label: 'Nhiệt độ bình chất', unit: '°C', min: -25, max: 140, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' },
      { key: 'pressureAtm', label: 'Áp suất nén', unit: 'bar', min: 1, max: 4, step: 0.5, defaultVal: 1, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Thể rắn (−15°C)', description: 'Xếp khít trật tự, chỉ dao động tại chỗ', params: { tempC: -15, pressureAtm: 1 }, flags: { showAirMix: false } },
      { label: 'Thể lỏng (30°C)', description: 'Trượt tự do trong phần đáy bình', params: { tempC: 30, pressureAtm: 1 }, flags: { showAirMix: false } },
      { label: 'Thể khí (125°C)', description: 'Chuyển động nhiệt hỗn loạn chiếm cả bình', params: { tempC: 125, pressureAtm: 1 }, flags: { showAirMix: false } }
    ],
    [
      { id: 'air_mix', label: 'Hiển thị thành phần Không khí (78% N₂ / 21% O₂)', kind: 'toggle', flagKey: 'showAirMix', accent: 'sky' },
      { id: 'reset_exp', label: 'Về 25°C (Thể lỏng)', kind: 'reset', accent: 'rose' }
    ],
    { showAirMix: false },
    (p, f) => {
      const t = p.tempC ?? 25;
      const stateLabel = f.showAirMix
        ? 'Không khí: 78% N₂ (lam) + 21% O₂ (đỏ duy trì cháy) + 1% CO₂/khí hiếm'
        : t < 0
        ? `Thể Rắn (${t}°C): Lực liên kết mạnh giữ nguyên hình dạng`
        : t < 100
        ? `Thể Lỏng (${t}°C): Các hạt trượt lên nhau theo hình dạng bình`
        : `Thể Khí (${t}°C): Các hạt bay tán loạn mọi hướng, dễ nén`;
      return {
        equationText: stateLabel,
        statusNote: 'Đun nóng cung cấp thêm năng lượng giúp các hạt thắng lực hút để chuyển từ Rắn → Lỏng → Khí.',
        probeParams: { tempC: t, conc: 0.5 }
      };
    }
  ),

  separation_lab_3d: makeDefaultModeConfig(
    'separation_lab_3d',
    'Bàn Thí Nghiệm Tách Chất 3D (Lọc – Cô Cạn – Chiết – Nam Châm)',
    'Chọn dụng cụ tách chất phù hợp với từng loại hỗn hợp: phễu giấy lọc cát, bát sứ cô cạn muối, phễu chiết dầu–nước.',
    '\\text{Rắn không tan (Lọc)} \\mid \\text{Rắn tan (Cô cạn)} \\mid \\text{2 lỏng tách lớp (Chiết)}',
    [
      { key: 'methodId', label: 'Dụng cụ (1:Lọc 2:Cô cạn 3:Chiết 4:Nam châm)', unit: '', min: 1, max: 4, step: 1, defaultVal: 1, accentClass: 'accent-emerald-500' },
      { key: 'tempC', label: 'Cường độ nhiệt / Hút từ', unit: '°C', min: 25, max: 120, step: 5, defaultVal: 60, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Phễu lọc (Cát + Nước)', description: 'Cát giữ lại trên giấy lọc, nước chảy qua', params: { methodId: 1, tempC: 25 }, flags: { running: true } },
      { label: 'Cô cạn (Nước muối)', description: 'Đun bay hơi nước thu muối kết tinh', params: { methodId: 2, tempC: 105 }, flags: { running: true } },
      { label: 'Phễu chiết (Dầu + Nước)', description: 'Mở khóa van xả lớp nước dưới ra trước', params: { methodId: 3, tempC: 25 }, flags: { running: true } },
      { label: 'Nam châm hút Fe khỏi S', description: 'Tách bột sắt có từ tính khỏi lưu huỳnh', params: { methodId: 4, tempC: 25 }, flags: { running: true } }
    ],
    [
      { id: 'run_sep', label: 'Bật/Tạm dừng quá trình tách', kind: 'toggle', flagKey: 'running', accent: 'emerald' },
      { id: 'reset_exp', label: 'Đặt lại hỗn hợp ban đầu', kind: 'reset', accent: 'rose' }
    ],
    { running: true },
    (p) => {
      const m = Math.round(p.methodId ?? 1);
      const names = ['Lọc qua giấy lọc (Cát + Nước)', 'Cô cạn bằng đèn cồn (Muối + Nước)', 'Chiết bằng phễu chiết (Dầu ăn + Nước)', 'Nam châm hút sắt (Bột Fe + Bột S)'];
      return {
        equationText: `Phương pháp ${m}: ${names[m - 1] ?? names[0]}`,
        statusNote: 'Muốn tách chất chính xác cần dựa vào sự khác nhau về tính chất vật lí (tính tan, nhiệt độ sôi, khối lượng riêng, từ tính).',
        probeParams: { tempC: p.tempC ?? 60, conc: 0.5 }
      };
    }
  ),

  ionic_covalent_3d: makeDefaultModeConfig(
    'ionic_covalent_3d',
    'Liên Kết Ion (Cho–Nhận NaCl) & Cộng Hóa Trị (Góp Chung H₂O) 3D',
    'Quan sát electron lớp ngoài cùng chuyển từ kim loại sang phi kim (Ion) hoặc quay quanh cả hai hạt nhân (Cộng hóa trị).',
    '\\text{Na} + \\text{Cl} \\to \\text{Na}^+\\text{Cl}^- \\quad|\\quad 2\\text{H} + \\text{O} \\to \\text{H}_2\\text{O}',
    [
      { key: 'bondType', label: 'Loại LK (1:Ion NaCl / 2:CHT H₂O)', unit: '', min: 1, max: 2, step: 1, defaultVal: 1, accentClass: 'accent-sky-500' },
      { key: 'shellZ', label: 'Tốc độ quỹ đạo e', unit: '×', min: 0.5, max: 2.0, step: 0.25, defaultVal: 1.0, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Liên kết Ion (NaCl)', description: 'Na nhường 1e cho Cl trở thành Na⁺ hút Cl⁻', params: { bondType: 1, shellZ: 1.0 }, flags: { bonded: true } },
      { label: 'Liên kết Cộng hóa trị (H₂O)', description: 'Oxy và 2 Hydro góp chung 2 cặp electron', params: { bondType: 2, shellZ: 1.0 }, flags: { bonded: true } }
    ],
    [
      { id: 'bond_toggle', label: 'Kích hoạt / Tách nguyên tử', kind: 'toggle', flagKey: 'bonded', accent: 'sky' },
      { id: 'reset_exp', label: 'Đặt lại trạng thái ban đầu', kind: 'reset', accent: 'rose' }
    ],
    { bonded: true },
    (p, f) => {
      const isIon = Math.round(p.bondType ?? 1) === 1;
      return {
        equationText: isIon
          ? (f.bonded ? 'Ion Na⁺ (10e) hút tĩnh điện Ion Cl⁻ (18e) → Tinh thể NaCl bền vững' : 'Nguyên tử Na (2-8-1) và Cl (2-8-7) chuẩn bị cho–nhận 1e')
          : (f.bonded ? 'Oxy (6e ngoài) góp chung với 2 Hydro → đủ 8e bền vững (H₂O)' : 'Nguyên tử O và 2 H ở trạng thái tách rời'),
        statusNote: 'Kim loại nhường e tạo ion dương, phi kim nhận e tạo ion âm (LK Ion); hai phi kim góp chung cặp e (LK Cộng hóa trị).',
        probeParams: { tempC: 25, conc: 0.5 }
      };
    }
  ),

  indicator_bench_3d: makeDefaultModeConfig(
    'indicator_bench_3d',
    'Giá Ống Nghiệm Acid – Base – Thang pH 0–14 & Thử Quỳ Tím 3D',
    'Điều chỉnh pH dung dịch để quan sát giấy quỳ tím đổi màu Đỏ/Xanh, phenolphthalein hóa Hồng và bọt khí H₂ khi thả kẽm vào Acid.',
    '\\text{pH} < 7 \\text{ (Acid: Quỳ đỏ)} \\mid \\text{pH} = 7 \\text{ (Trung tính)} \\mid \\text{pH} > 7 \\text{ (Base: Quỳ xanh)}',
    [
      { key: 'ph', label: 'Độ pH dung dịch', unit: 'pH', min: 1.0, max: 13.5, step: 0.5, defaultVal: 2.0, accentClass: 'accent-rose-500' },
      { key: 'tempC', label: 'Nhiệt độ dung dịch', unit: '°C', min: 20, max: 70, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Acid HCl (pH = 1.5 · Quỳ ĐỎ)', description: 'Thả viên Zn sủi bọt khí H₂ mạnh', params: { ph: 1.5, tempC: 25 }, flags: { addZn: true } },
      { label: 'Nước cất (pH = 7.0 · Trung tính)', description: 'Giấy quỳ giữ màu tím, không khí thoát ra', params: { ph: 7.0, tempC: 25 }, flags: { addZn: false } },
      { label: 'Kiềm NaOH (pH = 12.5 · Quỳ XANH)', description: 'Giấy quỳ hóa xanh thẫm, chỉ thị chuyển hồng', params: { ph: 12.5, tempC: 25 }, flags: { addZn: false } }
    ],
    [
      { id: 'zn_drop', label: 'Thả viên Kẽm Zn vào cốc', kind: 'toggle', flagKey: 'addZn', accent: 'amber' },
      { id: 'reset_exp', label: 'Rửa cốc về Acid chuẩn', kind: 'reset', accent: 'rose' }
    ],
    { addZn: true },
    (p, f) => {
      const ph = p.ph ?? 2.0;
      const kind = ph < 6.5 ? 'Acid (Quỳ hóa ĐỎ)' : ph > 7.5 ? 'Base / Kiềm (Quỳ hóa XANH · Phenolphthalein HỒNG)' : 'Trung tính (Quỳ TÍM)';
      const gas = ph < 5.5 && f.addZn ? ' · Đang sủi khí H₂↑ (Zn + 2H⁺)' : '';
      return {
        equationText: `pH = ${ph.toFixed(1)} → ${kind}${gas}`,
        statusNote: 'Thang pH chạy từ 0 đến 14: càng nhỏ hơn 7 tính Acid càng mạnh; càng lớn hơn 7 tính Kiềm càng mạnh.',
        probeParams: { tempC: p.tempC ?? 25, conc: 0.5, ph }
      };
    }
  ),

  combustion_reactor_3d: makeDefaultModeConfig(
    'combustion_reactor_3d',
    'Bình Phản Ứng Đốt Cháy Trong Khí Oxygen (O₂) 3D',
    'Thay đổi nồng độ khí O₂ để thấy sự khác biệt giữa cháy chậm trong không khí (21% O₂) và cháy sáng rực trong O₂ tinh khiết.',
    '3\\text{Fe} + 2\\text{O}_2 \\xrightarrow{t^\\circ} \\text{Fe}_3\\text{O}_4',
    [
      { key: 'o2Pct', label: 'Nồng độ khí O₂', unit: '%', min: 15, max: 100, step: 5, defaultVal: 95, accentClass: 'accent-amber-500' },
      { key: 'tempC', label: 'Nhiệt độ phản ứng', unit: '°C', min: 300, max: 900, step: 50, defaultVal: 650, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Trong khí O₂ tinh khiết (95%)', description: 'Tàn đóm bùng cháy, dây sắt bắn tia sáng chói', params: { o2Pct: 95, tempC: 700 }, flags: { ignited: true } },
      { label: 'Trong không khí (21% O₂)', description: 'Cháy êm dịu hơn do có 78% N₂ làm loãng', params: { o2Pct: 21, tempC: 500 }, flags: { ignited: true } }
    ],
    [
      { id: 'ignite_toggle', label: 'Bật / Tắt mồi lửa', kind: 'toggle', flagKey: 'ignited', accent: 'amber' },
      { id: 'reset_exp', label: 'Nạp lại bình khí O₂', kind: 'reset', accent: 'rose' }
    ],
    { ignited: true },
    (p, f) => ({
      equationText: f.ignited !== false ? `Đang cháy trong ${p.o2Pct ?? 95}% O₂ ở ${p.tempC ?? 650}°C` : 'Đã tắt ngọn lửa đốt trong bình',
      statusNote: 'Khí O₂ không tự cháy nhưng là chất duy trì sự cháy và sự sống.',
      probeParams: { tempC: p.tempC ?? 650, conc: (p.o2Pct ?? 95) / 100 }
    })
  ),

  mass_balance_3d: makeDefaultModeConfig(
    'mass_balance_3d',
    'Cân Đòn Kiểm Chứng Định Luật Bảo Toàn Khối Lượng 3D',
    'So sánh bình phản ứng đậy nút kín (cân thăng bằng hoàn toàn) và bình mở nắp để khí thoát ra ngoài.',
    '\\sum m_{\\text{tham gia}} = \\sum m_{\\text{sản phẩm}}',
    [
      { key: 'gasEscape', label: 'Lượng khí thoát (khi mở nút)', unit: '×', min: 0.1, max: 0.6, step: 0.1, defaultVal: 0.25, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ bình phản ứng', unit: '°C', min: 20, max: 60, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Hệ kín (Đậy nút cao su)', description: 'Σm_trước = Σm_sau → Cân thăng bằng tuyệt đối', params: { gasEscape: 0.25, tempC: 25 }, flags: { closedSystem: true } },
      { label: 'Hệ hở (Mở nút thoát khí CO₂)', description: 'Đĩa cân bên phải nhẹ dần do khí bay ra ngoài', params: { gasEscape: 0.4, tempC: 25 }, flags: { closedSystem: false } }
    ],
    [
      { id: 'seal_toggle', label: 'Đậy kín / Mở nút bình', kind: 'toggle', flagKey: 'closedSystem', accent: 'emerald' },
      { id: 'reset_exp', label: 'Cân bằng lại hai đĩa cân', kind: 'reset', accent: 'rose' }
    ],
    { closedSystem: true },
    (p, f) => ({
      equationText: f.closedSystem !== false ? 'Hệ kín: Σm trước PƯ = Σm sau PƯ (Cân thăng bằng!)' : `Hệ hở: Khí thoát ra làm cân lệch về bên đối chứng`,
      statusNote: 'Định luật Bảo toàn Khối lượng nghiệm đúng cho mọi phản ứng khi tính đủ cả chất khí.',
      probeParams: { tempC: p.tempC ?? 25, conc: 0.5 }
    })
  ),

  solution_mixing_3d: makeDefaultModeConfig(
    'solution_mixing_3d',
    'Cốc Khuấy Từ Pha Dung Dịch, Độ Tan & Kết Tinh 3D',
    'Thay đổi lượng chất tan và nhiệt độ để quan sát dung dịch chưa bão hòa và ngưỡng bão hòa kết tinh đáy cốc.',
    'S = \\frac{m_{\\text{ct max}}}{m_{\\text{H}_2\\text{O}}}\\cdot 100 \\quad|\\quad C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}}\\cdot 100\\%',
    [
      { key: 'soluteG', label: 'Lượng chất tan (g/100g H₂O)', unit: 'g', min: 10, max: 90, step: 5, defaultVal: 45, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ nước', unit: '°C', min: 10, max: 95, step: 5, defaultVal: 25, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Dung dịch bão hòa dư tinh thể', description: '45 g ở 25°C (Độ tan S = 36,3 g) → phần dư lắng đáy', params: { soluteG: 45, tempC: 25 }, flags: {} },
      { label: 'Đun nóng lên 70°C hòa tan hết', description: 'Tăng nhiệt độ làm tăng độ tan S lên 65,5 g', params: { soluteG: 45, tempC: 70 }, flags: {} }
    ],
    [
      { id: 'reset_exp', label: 'Đặt lại mẫu chuẩn 25°C', kind: 'reset', accent: 'rose' }
    ],
    {},
    (p) => {
      const t = p.tempC ?? 25;
      const g = p.soluteG ?? 45;
      const sMax = 20 + 0.65 * t;
      return {
        equationText: `T = ${t}°C ⇒ Độ tan S = ${sMax.toFixed(1)} g · Đã cho ${g} g (${g > sMax ? 'BÃO HÒA - Có kết tinh' : 'TAN HẾT'})`,
        statusNote: 'Nhiệt độ tăng thường giúp hòa tan thêm nhiều chất rắn hơn vào cùng một lượng nước.',
        probeParams: { tempC: t, conc: Math.min(1, g / 90) }
      };
    }
  )
};
