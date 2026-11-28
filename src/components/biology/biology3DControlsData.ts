import { Biology3DMode } from '../../types';

export interface Bio3DParamSpec {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  accentClass: string;
}

export interface Bio3DPresetSpec {
  label: string;
  description: string;
  params: Record<string, number>;
  flags?: Record<string, boolean | number>;
}

export interface Bio3DActionSpec {
  id: string;
  label: string;
  kind: 'toggle' | 'trigger' | 'reset';
  flagKey?: string;
  accent?: 'emerald' | 'teal' | 'amber' | 'rose' | 'sky';
}

export interface Bio3DReadout {
  equationText: string;
  statusNote: string;
  metricsSummary: string;
}

export interface Bio3DModeConfig {
  mode: Biology3DMode;
  title: string;
  subtitle: string;
  formulaHint: string;
  params: Bio3DParamSpec[];
  presets: Bio3DPresetSpec[];
  actions: Bio3DActionSpec[];
  defaultFlags: Record<string, boolean | number>;
  computeReadout: (
    params: Record<string, number>,
    flags: Record<string, boolean | number>,
    simTime: number
  ) => Bio3DReadout;
}

const makeBioCfg = (
  mode: Biology3DMode,
  title: string,
  subtitle: string,
  formulaHint: string,
  params: Bio3DParamSpec[],
  presets: Bio3DPresetSpec[],
  actions: Bio3DActionSpec[],
  defaultFlags: Record<string, boolean | number>,
  computeReadout: Bio3DModeConfig['computeReadout']
): Bio3DModeConfig => ({
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

export const BIOLOGY_3D_CONFIGS: Record<Biology3DMode, Bio3DModeConfig> = {
  human_anatomy_3d: makeBioCfg(
    'human_anatomy_3d',
    'Giải Phẫu Cơ Thể Người 3D Đa Hệ Cơ Quan (8 Hệ)',
    'Bật/tắt 8 hệ cơ quan (Xương, Cơ, Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh, Tiết niệu, Nội tiết), điều chỉnh độ trong suốt Da/Cơ/Xương và chọn từng cơ quan để phóng to chính xác.',
    '\\text{8 Hệ Cơ Quan} \\leftrightarrow \\text{Tổ chức Cơ thể Thống nhất}',
    [
      { key: 'bpm', label: 'Nhịp tim sinh lí', unit: 'bpm', min: 50, max: 160, step: 5, defaultVal: 72, accentClass: 'accent-rose-500' },
      { key: 'skinOpacity', label: 'Độ mờ lớp Da', unit: '%', min: 0, max: 90, step: 5, defaultVal: 25, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Nội tạng X-Quang', description: 'Da mờ 20% thấy rõ tim, phổi, gan, thận', params: { bpm: 72, skinOpacity: 20 } },
      { label: 'Giải phẫu Toàn thân', description: 'Chế độ khám phá cân bằng đa lớp', params: { bpm: 75, skinOpacity: 35 } }
    ],
    [
      { id: 'reset_bio', label: 'Đặt lại giải phẫu chuẩn', kind: 'reset', accent: 'teal' }
    ],
    {},
    (p) => ({
      equationText: `Nhịp tim ${p.bpm ?? 72} BPM · Da ${p.skinOpacity ?? 25}% · Nhấp trực tiếp lên cơ quan để tập trung camera`,
      statusNote: 'Bạn có thể bật/tắt từng hệ cơ quan, ẩn/hiện hoặc cô lập riêng một bộ phận ở thanh công cụ phía dưới.',
      metricsSummary: `BPM=${p.bpm ?? 72}, Skin=${p.skinOpacity ?? 25}%`
    })
  ),

  mendel_peas_3d: makeBioCfg(
    'mendel_peas_3d',
    'Thí Nghiệm Đậu Hà Lan Menđen (P → F₁ → F₂)',
    'Tự tay thực hiện các bước thụ phấn chéo cây bố mẹ P, thu F₁ rồi mở vỏ quả đậu đếm tỉ lệ hạt F₂.',
    'F_2 \\text{ (2 cặp)}: 9 : 3 : 3 : 1 \\quad | \\quad F_2 \\text{ (1 cặp)}: 3 : 1',
    [
      { key: 'sampleCount', label: 'Số hạt thu hoạch F₂', unit: 'hạt', min: 16, max: 640, step: 16, defaultVal: 160, accentClass: 'accent-emerald-500' },
      { key: 'dominance', label: 'Mức trội hoàn toàn', unit: '%', min: 50, max: 100, step: 10, defaultVal: 100, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Bắt đầu ở P', description: 'Hai cây bố mẹ thuần chủng chưa thụ phấn', params: { sampleCount: 160, dominance: 100 }, flags: { pollinated: false, podOpened: false } },
      { label: 'Lai 2 cặp F₂ (9:3:3:1)', description: 'Thụ phấn xong và mở quả đếm hạt F₂', params: { sampleCount: 320, dominance: 100 }, flags: { pollinated: true, podOpened: true } }
    ],
    [
      { id: 'pollinate', label: 'Thụ phấn chéo P → F₁', kind: 'toggle', flagKey: 'pollinated', accent: 'amber' },
      { id: 'open_pod', label: 'Mở quả đậu đếm hạt F₂', kind: 'toggle', flagKey: 'podOpened', accent: 'emerald' },
      { id: 'reset_bio', label: 'Trồng lại thế hệ P', kind: 'reset', accent: 'rose' }
    ],
    { pollinated: false, podOpened: false },
    (p, f) => {
      const n = Math.round(p.sampleCount ?? 160);
      const poll = Boolean(f.pollinated);
      const pod = Boolean(f.podOpened);
      return {
        equationText: pod
          ? `F₂ (${n} hạt): ~${Math.round(n * 9 / 16)} Vàng trơn : ${Math.round(n * 3 / 16)} Vàng nhăn : ${Math.round(n * 3 / 16)} Xanh trơn : ${Math.round(n / 16)} Xanh nhăn`
          : poll
          ? 'F₁ đồng tính 100% Hoa Tím · Hạt Vàng Trơn (AaBb)'
          : 'Thế hệ P thuần chủng: Cây cao hoa tím × Cây thấp hoa trắng',
        statusNote: !poll
          ? 'Bước 1: Nhấn "Thụ phấn chéo P → F₁" để truyền hạt phấn từ cây P₁ sang nhụy cây P₂.'
          : !pod
          ? 'Bước 2: Đã thu F₁ đồng tính! Nhấn "Mở quả đậu đếm hạt F₂" để kiểm nghiệm tỉ lệ phân li độc lập.'
          : 'Kết quả F₂ minh họa sự phân li độc lập của hai cặp nhân tố di truyền (9 : 3 : 3 : 1).',
        metricsSummary: `Mẫu n=${n}, Thụ phấn=${poll ? 'Có' : 'Chưa'}, Quả F₂=${pod ? 'Mở' : 'Đóng'}`
      };
    }
  ),

  dna_double_helix_3d: makeBioCfg(
    'dna_double_helix_3d',
    'Cấu Trúc Xoắn Kép DNA & Nhân Đôi Nguyên Tắc Bổ Sung',
    'Điều chỉnh số cặp nuclêôtit, kích hoạt enzyme Helicase tháo xoắn để quan sát liên kết A=T và G≡C.',
    'N = 2A + 2G,\\quad L = \\frac{N}{2}\\cdot 3{,}4\\text{ \\AA},\\quad H = 2A + 3G',
    [
      { key: 'pairs', label: 'Số cặp nuclêôtit', unit: 'bp', min: 10, max: 100, step: 5, defaultVal: 20, accentClass: 'accent-sky-500' },
      { key: 'gcPct', label: 'Tỉ lệ cặp G ≡ C', unit: '%', min: 20, max: 80, step: 5, defaultVal: 50, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Đoạn gen 20 bp', description: '2 chu kì xoắn chuẩn B-DNA', params: { pairs: 20, gcPct: 50 }, flags: { unzipped: false } },
      { label: 'Giàu G≡C (Siêu bền)', description: 'Nhiều 3 liên kết Hydro khó tách mạch', params: { pairs: 40, gcPct: 75 }, flags: { unzipped: true } }
    ],
    [
      { id: 'unzip', label: 'Tháo xoắn Helicase (Nhân đôi)', kind: 'toggle', flagKey: 'unzipped', accent: 'amber' },
      { id: 'reset_bio', label: 'Đóng xoắn kép ban đầu', kind: 'reset', accent: 'rose' }
    ],
    { unzipped: false },
    (p, f) => {
      const bp = Math.round(p.pairs ?? 20);
      const gc = Math.round((bp * (p.gcPct ?? 50)) / 100);
      const at = bp - gc;
      const H = 2 * at + 3 * gc;
      const L = bp * 3.4;
      return {
        equationText: `N = ${bp * 2} nu · L = ${L.toFixed(1)} Å · Liên kết H = ${H}`,
        statusNote: f.unzipped
          ? 'Enzyme Helicase đang cắt đứt các liên kết Hydro giữa hai mạch để lộ mạch khuôn 3’→5’.'
          : 'Hai mạch xoắn song song ngược chiều theo nguyên tắc bổ sung A=T (2 H), G≡C (3 H).',
        metricsSummary: `bp=${bp}, %GC=${p.gcPct ?? 50}%, H=${H}`
      };
    }
  ),

  human_heart_3d: makeBioCfg(
    'human_heart_3d',
    'Tim Người & Chu Kì Co Bóp Tuần Hoàn Máu',
    'Điều chỉnh nhịp tim BPM và thể tích tâm thu để quan sát tốc độ bơm máu động mạch chủ & động mạch phổi.',
    'Q_{\\text{tim}} = \\text{BPM} \\times V_{\\text{tâm thu}}',
    [
      { key: 'bpm', label: 'Nhịp tim (BPM)', unit: 'nhịp/p', min: 45, max: 180, step: 5, defaultVal: 72, accentClass: 'accent-rose-500' },
      { key: 'strokeMl', label: 'Thể tích tâm thu', unit: 'mL', min: 50, max: 110, step: 5, defaultVal: 70, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Nghỉ ngơi (72 BPM)', description: 'Chu kì 0,83s · Cung lượng ~5,0 L/phút', params: { bpm: 72, strokeMl: 70 }, flags: { exercise: false } },
      { label: 'Chạy bộ (145 BPM)', description: 'Tăng cung lượng tim gấp đôi cấp O₂ cho cơ', params: { bpm: 145, strokeMl: 95 }, flags: { exercise: true } }
    ],
    [
      { id: 'ex_toggle', label: 'Chế độ Vận động mạnh', kind: 'toggle', flagKey: 'exercise', accent: 'rose' },
      { id: 'reset_bio', label: 'Về nhịp nghỉ 72 BPM', kind: 'reset', accent: 'teal' }
    ],
    { exercise: false },
    (p, f) => {
      const bpm = f.exercise ? Math.max(135, p.bpm ?? 145) : (p.bpm ?? 72);
      const sv = p.strokeMl ?? 70;
      const co = (bpm * sv) / 1000;
      return {
        equationText: `${bpm} BPM · Chu kì T = ${(60 / bpm).toFixed(2)} s · Cung lượng = ${co.toFixed(2)} L/phút`,
        statusNote: 'Tâm thất trái có thành cơ dày nhất để đẩy máu giàu O₂ đi nuôi toàn cơ thể qua động mạch chủ.',
        metricsSummary: `BPM=${bpm}, SV=${sv}mL, CO=${co.toFixed(2)}L/p`
      };
    }
  ),

  neuron_synapse_3d: makeBioCfg(
    'neuron_synapse_3d',
    'Neuron Thần Kinh & Truyền Xung Qua Xináp',
    'Điều chỉnh điện thế kích thích để vượt ngưỡng −55 mV, phóng xung điện thế hoạt động dọc bao Myelin tới chùy xináp.',
    '\\text{Nghỉ } (-70\\text{ mV}) \\xrightarrow{\\text{Ngưỡng }-55\\text{ mV}} \\text{Khử cực } (+30\\text{ mV})',
    [
      { key: 'stimulusMv', label: 'Cường độ kích thích', unit: 'mV', min: 0, max: 40, step: 5, defaultVal: 20, accentClass: 'accent-amber-500' },
      { key: 'myelin', label: 'Độ dày bao Myelin', unit: '%', min: 0, max: 100, step: 20, defaultVal: 80, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Dưới ngưỡng (+5 mV)', description: 'Chưa đủ ngưỡng −55 mV → không có xung', params: { stimulusMv: 5, myelin: 80 }, flags: { fired: false } },
      { label: 'Bùng nổ điện thế (+30mV)', description: 'Truyền nhảy cóc qua eo Ranvier', params: { stimulusMv: 25, myelin: 100 }, flags: { fired: true } }
    ],
    [
      { id: 'fire', label: 'Kích thích phát xung điện (+30mV)', kind: 'toggle', flagKey: 'fired', accent: 'amber' },
      { id: 'reset_bio', label: 'Về điện thế nghỉ (−70 mV)', kind: 'reset', accent: 'rose' }
    ],
    { fired: true },
    (p, f) => {
      const stim = p.stimulusMv ?? 20;
      const active = Boolean(f.fired) && stim >= 15;
      const vConduct = 5 + ((p.myelin ?? 80) / 100) * 95;
      return {
        equationText: active
          ? `Xung hoạt động +30 mV · Tốc độ truyền ≈ ${vConduct.toFixed(0)} m/s`
          : `Trạng thái nghỉ (−70 mV) · Cần kích thích ≥ 15 mV để vượt ngưỡng`,
        statusNote: active
          ? 'Bao Myelin giúp xung nhảy cóc qua các eo Ranvier nhanh gấp ~20 lần sợi không có myelin, kích thích giải phóng Acetylcholine!'
          : 'Kích thích chưa đủ ngưỡng (−55 mV) hoặc xung đang tắt — hãy tăng kích thích hoặc nhấn nút phát xung.',
        metricsSummary: `Stim=${stim}mV, Speed=${vConduct.toFixed(0)}m/s`
      };
    }
  ),

  biotech_pcr_crispr_3d: makeBioCfg(
    'biotech_pcr_crispr_3d',
    'Chu Kì Nhiệt PCR & Chỉnh Sửa Gen CRISPR-Cas9',
    'Điều khiển 3 bước nhiệt độ chu kì PCR (95°C tách mạch → 55°C gắn mồi → 72°C kéo dài) nhân bản 2ⁿ bản sao DNA.',
    'N_{\\text{bản sao}} = N_0 \\cdot 2^{n\\text{ chu kì}}',
    [
      { key: 'tempC', label: 'Nhiệt độ máy luân nhiệt', unit: '°C', min: 50, max: 98, step: 1, defaultVal: 72, accentClass: 'accent-amber-500' },
      { key: 'cycles', label: 'Số chu kì PCR', unit: 'chu kì', min: 1, max: 30, step: 1, defaultVal: 10, accentClass: 'accent-purple-500' }
    ],
    [
      { label: '1. Biến tính (95°C)', description: 'Tách rời 2 mạch DNA khuôn', params: { tempC: 95, cycles: 5 }, flags: { stepPhase: 1 } },
      { label: '2. Bắt cặp mồi (55°C)', description: 'Mồi xuôi/ngược bám đầu 3’', params: { tempC: 55, cycles: 5 }, flags: { stepPhase: 2 } },
      { label: '3. Kéo dài Taq (72°C)', description: 'Taq Polymerase tổng hợp mạch mới', params: { tempC: 72, cycles: 15 }, flags: { stepPhase: 3 } }
    ],
    [
      { id: 'denature', label: 'Bước 1: Biến tính 95°C', kind: 'trigger', accent: 'rose' },
      { id: 'anneal', label: 'Bước 2: Gắn mồi 55°C', kind: 'trigger', accent: 'sky' },
      { id: 'extend', label: 'Bước 3: Kéo dài 72°C', kind: 'trigger', accent: 'emerald' },
      { id: 'reset_bio', label: 'Đặt lại chu kì 1', kind: 'reset', accent: 'amber' }
    ],
    { stepPhase: 3 },
    (p) => {
      const t = p.tempC ?? 72;
      const cyc = Math.round(p.cycles ?? 10);
      const phase = t >= 88 ? 'Biến tính tách mạch kép' : t <= 60 ? 'Bắt cặp đoạn mồi' : 'Taq Polymerase kéo dài mạch mới';
      return {
        equationText: `T = ${t}°C (${phase}) · ${cyc} chu kì → ${Math.pow(2, cyc).toLocaleString()} bản sao`,
        statusNote: 'Enzyme Taq Polymerase chịu nhiệt (tách từ vi khuẩn suối nước nóng) không bị biến tính ở 95°C.',
        metricsSummary: `T=${t}C, Cycles=${cyc}, Copies=2^${cyc}`
      };
    }
  ),

  chloroplast_thylakoid_3d: makeBioCfg(
    'chloroplast_thylakoid_3d',
    'Lục Lạp 3D: Đĩa Thylakoid (Pha Sáng) & Stroma (Chu Trình Calvin)',
    'Điều chỉnh cường độ ánh sáng và nồng độ CO₂ để theo dõi sản lượng O₂, ATP, NADPH và đường Glucose.',
    '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Ánh sáng, Diệp lục}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2\\uparrow',
    [
      { key: 'light', label: 'Cường độ ánh sáng', unit: '%', min: 0, max: 100, step: 10, defaultVal: 70, accentClass: 'accent-amber-500' },
      { key: 'co2', label: 'Nồng độ CO₂', unit: 'ppm', min: 100, max: 1000, step: 50, defaultVal: 400, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Trong tối (0% sáng)', description: 'Pha sáng ngừng, không thải O₂', params: { light: 0, co2: 400 }, flags: { lightOn: false } },
      { label: 'Nắng tối ưu (80%)', description: 'Pha sáng & Calvin hoạt động mạnh', params: { light: 80, co2: 600 }, flags: { lightOn: true } }
    ],
    [
      { id: 'light_toggle', label: 'Bật / Tắt đèn chiếu sáng', kind: 'toggle', flagKey: 'lightOn', accent: 'amber' },
      { id: 'reset_bio', label: 'Đặt lại chuẩn ánh sáng', kind: 'reset', accent: 'rose' }
    ],
    { lightOn: true },
    (p, f) => {
      const l = f.lightOn ? (p.light ?? 70) : 0;
      const co2 = p.co2 ?? 400;
      const rate = Math.min(100, Math.round((l * Math.min(800, co2)) / 650));
      return {
        equationText: `Ánh sáng = ${l}% · CO₂ = ${co2} ppm · Cường độ quang hợp = ${rate}%`,
        statusNote: 'Quang phân li nước xảy ra trên màng Thylakoid giải phóng O₂; chất nền Stroma cố định CO₂ tạo đường.',
        metricsSummary: `Light=${l}%, CO2=${co2}, Rate=${rate}%`
      };
    }
  ),

  mitochondria_atp_3d: makeBioCfg(
    'mitochondria_atp_3d',
    'Ti Thể & Động Cơ Tổng Hợp ATP (Hô Hấp Tế Bào)',
    'Theo dõi chuỗi truyền electron trên mào Cristae bơm H⁺ qua động cơ ATP Synthase tạo ~32 ATP/Glucose.',
    '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\sim 32\\text{ ATP}',
    [
      { key: 'o2Pct', label: 'Nồng độ O₂ cung cấp', unit: '%', min: 0, max: 100, step: 10, defaultVal: 80, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ tế bào', unit: '°C', min: 15, max: 55, step: 1, defaultVal: 37, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Thiếu O₂ (Kị khí)', description: 'Chỉ thu 2 ATP đường phân, tích axit lactic', params: { o2Pct: 0, tempC: 37 }, flags: { aerobic: false } },
      { label: 'Đủ O₂ (Hiếu khí chuẩn)', description: 'Chuỗi truyền e⁻ sinh ~32 ATP', params: { o2Pct: 85, tempC: 37 }, flags: { aerobic: true } }
    ],
    [
      { id: 'aero', label: 'Cấp / Ngắt khí O₂', kind: 'toggle', flagKey: 'aerobic', accent: 'emerald' },
      { id: 'reset_bio', label: 'Về 37°C hiếu khí', kind: 'reset', accent: 'rose' }
    ],
    { aerobic: true },
    (p, f) => {
      const o2 = f.aerobic ? (p.o2Pct ?? 80) : 0;
      const atp = o2 > 15 ? Math.round(2 + (o2 / 100) * 30) : 2;
      return {
        equationText: `O₂ = ${o2}% · Sản lượng ≈ ${atp} ATP / 1 phân tử Glucose`,
        statusNote: 'O₂ đóng vai trò chất nhận electron cuối cùng ở màng trong ti thể để chuỗi truyền electron không bị tắc.',
        metricsSummary: `O2=${o2}%, ATP=${atp}`
      };
    }
  ),

  enzyme_substrate_3d: makeBioCfg(
    'enzyme_substrate_3d',
    'Trung Tâm Hoạt Động Enzyme & Cơ Chế Khớp Cơ Chất',
    'Thay đổi nhiệt độ và pH; thử đưa chất ức chế cạnh tranh vào chặn trung tâm hoạt động của enzyme.',
    'E + S \\rightleftharpoons ES \\to E + P',
    [
      { key: 'tempC', label: 'Nhiệt độ môi trường', unit: '°C', min: 10, max: 75, step: 2, defaultVal: 37, accentClass: 'accent-amber-500' },
      { key: 'ph', label: 'Độ pH dung dịch', unit: 'pH', min: 2, max: 11, step: 0.5, defaultVal: 7.0, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Tối ưu 37°C · pH 7', description: 'Hoạt tính xúc tác cực đại 100%', params: { tempC: 37, ph: 7.0 }, flags: { inhibited: false } },
      { label: 'Quá nóng 68°C (Biến tính)', description: 'Cấu trúc không gian Enzyme bị phá vỡ', params: { tempC: 68, ph: 7.0 }, flags: { inhibited: false } },
      { label: 'Chất ức chế cạnh tranh', description: 'Giành mất trung tâm hoạt động', params: { tempC: 37, ph: 7.0 }, flags: { inhibited: true } }
    ],
    [
      { id: 'inhibit', label: 'Thêm chất ức chế cạnh tranh', kind: 'toggle', flagKey: 'inhibited', accent: 'rose' },
      { id: 'reset_bio', label: 'Khôi phục Enzyme tối ưu', kind: 'reset', accent: 'teal' }
    ],
    { inhibited: false },
    (p, f) => {
      const t = p.tempC ?? 37;
      const ph = p.ph ?? 7;
      const denat = t > 55 ? 0.15 : Math.exp(-Math.pow((t - 37) / 14, 2));
      const phF = Math.exp(-Math.pow((ph - 7) / 2.2, 2));
      const act = Math.round(denat * phF * (f.inhibited ? 0.25 : 1) * 100);
      return {
        equationText: `T = ${t}°C · pH = ${ph.toFixed(1)} · Hoạt tính Enzyme = ${act}%`,
        statusNote: t > 55
          ? 'Cảnh báo: Nhiệt độ cao làm Enzyme bị biến tính mất trung tâm hoạt động!'
          : f.inhibited
          ? 'Chất ức chế có hình dạng giống cơ chất đang chiếm chỗ trung tâm hoạt động.'
          : 'Cơ chất khớp đặc hiệu vào trung tâm hoạt động kiểu "chìa khóa và ổ khóa".',
        metricsSummary: `T=${t}C, pH=${ph.toFixed(1)}, Act=${act}%`
      };
    }
  ),

  phospholipid_bilayer_3d: makeBioCfg(
    'phospholipid_bilayer_3d',
    'Màng Sinh Chất Lớp Kép Phospholipid & Kênh Protein',
    'Điều chỉnh độ chênh lệch nồng độ ngoài/trong để quan sát thẩm thấu nước qua kênh Aquaporin.',
    '\\text{Nhược trương (nhiều } H_2O\\text{)} \\xrightarrow{\\text{Thẩm thấu}} \\text{Ưu trương}',
    [
      { key: 'soluteOut', label: 'Nồng độ chất tan ngoài màng', unit: '%', min: 0, max: 15, step: 0.5, defaultVal: 0.9, accentClass: 'accent-sky-500' },
      { key: 'tempC', label: 'Nhiệt độ màng', unit: '°C', min: 10, max: 50, step: 1, defaultVal: 37, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Đẳng trương (0,9%)', description: 'Lượng nước ra = lượng nước vào', params: { soluteOut: 0.9, tempC: 37 } },
      { label: 'Nhược trương (0%)', description: 'Nước tràn vào tế bào trương phồng', params: { soluteOut: 0, tempC: 37 } },
      { label: 'Ưu trương (10% muối)', description: 'Nước rút ra ngoài gây co nguyên sinh', params: { soluteOut: 10, tempC: 37 } }
    ],
    [
      { id: 'atp_pump', label: 'Bật Bơm chủ động (Tốn ATP)', kind: 'toggle', flagKey: 'activePump', accent: 'amber' },
      { id: 'reset_bio', label: 'Về môi trường đẳng trương', kind: 'reset', accent: 'rose' }
    ],
    { activePump: false },
    (p, f) => {
      const s = p.soluteOut ?? 0.9;
      return {
        equationText: `Nồng độ ngoài = ${s.toFixed(1)}% · ${s < 0.7 ? 'Nhược trương (Hút H₂O)' : s > 1.2 ? 'Ưu trương (Co nguyên sinh)' : 'Đẳng trương (Cân bằng)'}`,
        statusNote: f.activePump
          ? 'Đang vận chuyển chủ động ngược chiều gradient nồng độ bằng năng lượng ATP.'
          : 'Đầu photphat ưa nước quay ra ngoài, đuôi axit béo kị nước quay vào trong tạo hàng rào chọn lọc.',
        metricsSummary: `Out=${s.toFixed(1)}%, Pump=${f.activePump ? 'ON' : 'OFF'}`
      };
    }
  ),

  ribosome_translation_3d: makeBioCfg(
    'ribosome_translation_3d',
    'Ribosome Dịch Mã Tổng Hợp Chuỗi Polipeptit',
    'Theo dõi tiểu phần bé & tiểu phần lớn trượt trên mRNA (5’→3’) đọc từng bộ ba codon lắp ghép axit amin.',
    '\\text{Số axit amin} = \\frac{N_{\\text{mRNA}}}{3} - 1',
    [
      { key: 'codons', label: 'Số bộ ba mã hóa trên mRNA', unit: 'codon', min: 10, max: 300, step: 10, defaultVal: 100, accentClass: 'accent-emerald-500' },
      { key: 'rate', label: 'Tốc độ trượt Ribosome', unit: 'aa/s', min: 5, max: 30, step: 5, defaultVal: 15, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'mRNA ngắn (60 codon)', description: 'Tổng hợp nhanh chuỗi ngắn', params: { codons: 60, rate: 15 } },
      { label: 'Polyribosome (200 codon)', description: 'Tăng hiệu suất tổng hợp protein', params: { codons: 200, rate: 25 } }
    ],
    [
      { id: 'poly', label: 'Bật chế độ Polyribosome', kind: 'toggle', flagKey: 'polysome', accent: 'emerald' },
      { id: 'reset_bio', label: 'Về bộ ba mở đầu AUG', kind: 'reset', accent: 'rose' }
    ],
    { polysome: false },
    (p, f) => {
      const cod = Math.round(p.codons ?? 100);
      return {
        equationText: `${cod} bộ ba → ${Math.max(1, cod - 2)} axit amin hoàn chỉnh · ${f.polysome ? 'Polyribosome (nhiều chuỗi cùng lúc)' : 'Đơn Ribosome'}`,
        statusNote: 'Bộ ba mở đầu AUG (Met) khởi đầu dịch mã; khi gặp bộ ba kết thúc (UAA, UAG, UGA) hai tiểu phần tách nhau.',
        metricsSummary: `Codons=${cod}, aa=${Math.max(1, cod - 2)}`
      };
    }
  ),

  chromosome_mitosis_3d: makeBioCfg(
    'chromosome_mitosis_3d',
    'Nhiễm Sắc Thể Kép & Tâm Động Trong Phân Bào',
    'Quan sát hai nhiễm sắc tử chị em gắn ở tâm động co xoắn cực đại ở kì giữa để thoi phân bào phân li đồng đều.',
    '\\text{Nguyên phân}: 2n \\to 2n + 2n \\quad | \\quad \\text{Giảm phân}: 2n \\to 4 \\times n',
    [
      { key: 'nVal', label: 'Bộ đơn bội n của loài', unit: 'NST', min: 2, max: 24, step: 1, defaultVal: 4, accentClass: 'accent-sky-500' },
      { key: 'cycles', label: 'Số lần nguyên phân k', unit: 'lần', min: 1, max: 6, step: 1, defaultVal: 3, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Ruồi giấm (2n=8)', description: 'Loài mô hình kinh điển di truyền học', params: { nVal: 4, cycles: 3 } },
      { label: 'Người (2n=46)', description: '23 cặp NST tương đồng', params: { nVal: 23, cycles: 2 } }
    ],
    [
      { id: 'pull', label: 'Kéo tách Chromatid về 2 cực (Kì sau)', kind: 'toggle', flagKey: 'anaphase', accent: 'amber' },
      { id: 'reset_bio', label: 'Về Kì giữa xếp mặt phẳng xích đạo', kind: 'reset', accent: 'rose' }
    ],
    { anaphase: false },
    (p, f) => {
      const n = Math.round(p.nVal ?? 4);
      const k = Math.round(p.cycles ?? 3);
      return {
        equationText: `2n = ${2 * n} NST · Sau ${k} lần NP: ${Math.pow(2, k)} tế bào con (${f.anaphase ? 'Kì sau: 4n đơn tách về 2 cực' : 'Kì giữa: 2n kép co xoắn cực đại'})`,
        statusNote: 'Tâm động là vị trí gắn sợi tơ thoi phân bào giúp chia đều chính xác vật chất di truyền.',
        metricsSummary: `2n=${2 * n}, k=${k}, cells=${Math.pow(2, k)}`
      };
    }
  ),

  alveoli_capillary_3d: makeBioCfg(
    'alveoli_capillary_3d',
    'Chùm Phế Nang & Mao Mạch Trao Đổi Khí Phổi',
    'Mô phỏng khuếch tán O₂ từ phế nang vào hồng cầu và CO₂ thải ra theo chênh lệch phân áp khí.',
    '\\text{Khuếch tán thụ động}: P_{\\text{O}_2\\text{ (phế nang)}} > P_{\\text{O}_2\\text{ (máu tĩnh mạch)}}',
    [
      { key: 'breathRate', label: 'Nhịp thở', unit: 'lần/p', min: 10, max: 36, step: 2, defaultVal: 16, accentClass: 'accent-pink-500' },
      { key: 'altitude', label: 'Độ cao (giảm áp suất O₂)', unit: 'km', min: 0, max: 5, step: 0.5, defaultVal: 0, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Mực nước biển (0 km)', description: 'Bão hòa O₂ Hemoglobin ~98%', params: { breathRate: 16, altitude: 0 } },
      { label: 'Núi cao (3,5 km)', description: 'Phân áp O₂ thấp → cơ thể thở nhanh hơn', params: { breathRate: 26, altitude: 3.5 } }
    ],
    [
      { id: 'deep_breath', label: 'Hít sâu tăng thông khí', kind: 'toggle', flagKey: 'deepBreath', accent: 'teal' },
      { id: 'reset_bio', label: 'Về hô hấp bình thường', kind: 'reset', accent: 'rose' }
    ],
    { deepBreath: false },
    (p, f) => {
      const alt = p.altitude ?? 0;
      const spo2 = Math.max(72, Math.min(99, Math.round(98 - alt * 5.2 + (f.deepBreath ? 2 : 0))));
      return {
        equationText: `Nhịp thở = ${p.breathRate ?? 16} lần/phút · Độ cao = ${alt} km · SpO₂ ≈ ${spo2}%`,
        statusNote: 'Thành phế nang và mao mạch đều chỉ dày 1 lớp tế bào biểu mô dẹt giúp O₂ và CO₂ khuếch tán cực nhanh.',
        metricsSummary: `Resp=${p.breathRate ?? 16}, SpO2=${spo2}%`
      };
    }
  ),

  nephron_kidney_3d: makeBioCfg(
    'nephron_kidney_3d',
    'Đơn Vị Thận (Nephron) Siêu Lọc & Tái Hấp Thu Nước',
    'Cân bằng áp lực lọc cầu thận và hormone ADH điều tiết tái hấp thu nước tại ống lượn xa – ống góp.',
    '\\text{Nước tiểu đầu } (~180\\text{ L/ngày}) \\xrightarrow{\\text{Tái hấp thu 99\\%}} \\text{Nước tiểu chính thức } (~1{,}5\\text{ L})',
    [
      { key: 'bp', label: 'Huyết áp động mạch', unit: 'mmHg', min: 70, max: 160, step: 5, defaultVal: 120, accentClass: 'accent-rose-500' },
      { key: 'adh', label: 'Nồng độ hormone ADH', unit: '%', min: 10, max: 100, step: 10, defaultVal: 50, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Bình thường (120 mmHg)', description: 'Lọc và tái hấp thu cân bằng nội môi', params: { bp: 120, adh: 50 } },
      { label: 'Thiếu nước (ADH cao 90%)', description: 'Tái hấp thu tối đa giữ nước lại cho máu', params: { bp: 110, adh: 90 } }
    ],
    [
      { id: 'reabsorb', label: 'Tăng tiết ADH chống mất nước', kind: 'toggle', flagKey: 'highAdh', accent: 'amber' },
      { id: 'reset_bio', label: 'Về cân bằng nước chuẩn', kind: 'reset', accent: 'rose' }
    ],
    { highAdh: false },
    (p, f) => {
      const adh = f.highAdh ? 90 : (p.adh ?? 50);
      const urineL = Math.max(0.5, 2.6 - (adh / 100) * 1.9);
      return {
        equationText: `Huyết áp = ${p.bp ?? 120} mmHg · ADH = ${adh}% → Nước tiểu ≈ ${urineL.toFixed(2)} L/ngày`,
        statusNote: 'Cầu thận lọc mọi chất nhỏ trừ tế bào máu và protein lớn; quai Henle & ống góp thu hồi lại đường, ion cần thiết.',
        metricsSummary: `BP=${p.bp ?? 120}, ADH=${adh}%, Urine=${urineL.toFixed(2)}L`
      };
    }
  ),

  antibody_antigen_3d: makeBioCfg(
    'antibody_antigen_3d',
    'Kháng Thể IgG Hình Chữ Y & Phản Ứng Khóa Kháng Nguyên',
    'So sánh đáp ứng miễn dịch sơ cấp chậm vs đáp ứng thứ phát cực nhanh nhờ tế bào B/T nhớ sau tiêm vaccine.',
    '\\text{Kháng nguyên } + \\text{Kháng thể } (\\text{Fab}) \\to \\text{Phức hợp bất hoạt}',
    [
      { key: 'dose', label: 'Lần tiếp xúc (1:Sơ cấp 2:Nhắc lại)', unit: 'lần', min: 1, max: 2, step: 1, defaultVal: 1, accentClass: 'accent-sky-500' },
      { key: 'load', label: 'Mật độ kháng nguyên', unit: '%', min: 20, max: 100, step: 10, defaultVal: 50, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Tiêm mũi 1 (Sơ cấp)', description: 'Tạo kháng thể chậm (7–14 ngày)', params: { dose: 1, load: 50 }, flags: { memoryBoost: false } },
      { label: 'Tái nhiễm / Mũi 2 (Thứ phát)', description: 'Tế bào nhớ nhân lên tạo lượng Ig gấp 10 lần', params: { dose: 2, load: 50 }, flags: { memoryBoost: true } }
    ],
    [
      { id: 'vaccinate', label: 'Kích hoạt trí nhớ miễn dịch (Mũi nhắc)', kind: 'toggle', flagKey: 'memoryBoost', accent: 'emerald' },
      { id: 'reset_bio', label: 'Về lần gặp đầu tiên', kind: 'reset', accent: 'rose' }
    ],
    { memoryBoost: false },
    (p, f) => {
      const second = Boolean(f.memoryBoost) || (p.dose ?? 1) === 2;
      return {
        equationText: second
          ? 'Đáp ứng Thứ phát: Thời gian tiềm ẩn ~2 ngày · Lượng IgG tăng 10–100×!'
          : 'Đáp ứng Sơ cấp: Thời gian tạo kháng thể ~10 ngày',
        statusNote: 'Hai nhánh Fab của kháng thể khóa chặt vào gai Epitope đặc hiệu để trung hòa virus/vi khuẩn.',
        metricsSummary: `Phase=${second ? 'Secondary' : 'Primary'}, Load=${p.load ?? 50}%`
      };
    }
  ),

  virus_bacteriophage_3d: makeBioCfg(
    'virus_bacteriophage_3d',
    'Virus: Thực Khuẩn Thể T4 & Virus Có Vỏ Bọc Lipid (Gai S)',
    'Kích hoạt bao đuôi co bóp để tiêm vật chất di truyền DNA hoặc chuyển sang chế độ Virus có vỏ ngoài quan sát gai Glycoprotein.',
    '\\text{Hấp phụ} \\to \\text{Xâm nhập} \\to \\text{Sinh tổng hợp} \\to \\text{Lắp ráp} \\to \\text{Phóng thích}',
    [
      { key: 'moi', label: 'Số Phage bám trên 1 tế bào', unit: 'phage', min: 1, max: 10, step: 1, defaultVal: 1, accentClass: 'accent-purple-500' },
      { key: 'tempC', label: 'Nhiệt độ nuôi cấy E. coli', unit: '°C', min: 20, max: 42, step: 2, defaultVal: 37, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Bám thụ thể (Hấp phụ)', description: '6 chân đuôi nhận diện thụ thể vi khuẩn', params: { moi: 1, tempC: 37 }, flags: { injected: false, envelopedMode: false } },
      { label: 'Tiêm DNA (Chu trình tan)', description: 'Bao đuôi co lại bơm DNA vào trong', params: { moi: 3, tempC: 37 }, flags: { injected: true, envelopedMode: false } },
      { label: 'Virus Vỏ Lipid + Gai S', description: 'So sánh cấu trúc virus vỏ ngoài (SARS-CoV-2)', params: { moi: 1, tempC: 37 }, flags: { injected: false, envelopedMode: true } }
    ],
    [
      { id: 'inject', label: 'Co bao đuôi bơm DNA', kind: 'toggle', flagKey: 'injected', accent: 'amber' },
      { id: 'env_mode', label: 'Chế độ Virus vỏ bọc (Gai S)', kind: 'toggle', flagKey: 'envelopedMode', accent: 'sky' },
      { id: 'reset_bio', label: 'Về trạng thái hấp phụ', kind: 'reset', accent: 'rose' }
    ],
    { injected: false, envelopedMode: false },
    (p, f) => ({
      equationText: f.envelopedMode
        ? 'Virus có vỏ bọc: Lớp kép Lipid + Gai Glycoprotein S bám thụ thể ACE2 · Lõi RNA'
        : f.injected
        ? 'Bao đuôi đã co → DNA Phage xâm nhập bắt bộ máy E. coli nhân bản Phage mới!'
        : 'Giai đoạn Hấp phụ: Lông đuôi bám đặc hiệu thụ thể bề mặt vi khuẩn',
      statusNote: 'Virus chỉ mang vỏ protein Capsid + lõi axit nucleic; một số virus động vật có thêm màng bọc lipid.',
      metricsSummary: `Mode=${f.envelopedMode ? 'Enveloped' : 'PhageT4'}, Injected=${f.injected ? 'Yes' : 'No'}`
    })
  ),

  plant_vascular_3d: makeBioCfg(
    'plant_vascular_3d',
    'Bó Mạch Gỗ (Xylem ↑ H₂O) & Mạch Rây (Phloem ↓ Đường)',
    'Điều chỉnh độ mở khí khổng và cường độ thoát hơi nước ở lá để thấy lực kéo cột nước đi lên.',
    '\\text{Mạch gỗ}: \\text{Đẩy rễ} + \\text{Hút lá} \\quad | \\quad \\text{Mạch rây}: \\text{Áp suất thẩm thấu}',
    [
      { key: 'stomata', label: 'Độ mở khí khổng lá', unit: '%', min: 0, max: 100, step: 10, defaultVal: 70, accentClass: 'accent-sky-500' },
      { key: 'humidity', label: 'Độ ẩm không khí', unit: '%', min: 20, max: 95, step: 5, defaultVal: 55, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Ban ngày nắng nhẹ', description: 'Khí khổng mở kéo mạnh nước & khoáng lên', params: { stomata: 80, humidity: 50 } },
      { label: 'Đóng khí khổng tránh héo', description: 'Hạn chế mất nước khi khô hạn', params: { stomata: 10, humidity: 25 } }
    ],
    [
      { id: 'aba', label: 'Tiết ABA đóng khí khổng chống hạn', kind: 'toggle', flagKey: 'abaClosed', accent: 'amber' },
      { id: 'reset_bio', label: 'Mở lại khí khổng bình thường', kind: 'reset', accent: 'rose' }
    ],
    { abaClosed: false },
    (p, f) => {
      const open = f.abaClosed ? 10 : (p.stomata ?? 70);
      const flux = Math.max(0, Math.round((open * (100 - (p.humidity ?? 55))) / 45));
      return {
        equationText: `Khí khổng mở ${open}% · Độ ẩm ${p.humidity ?? 55}% → Tốc độ hút nước ≈ ${flux} đơn vị`,
        statusNote: 'Thoát hơi nước ở lá là động lực đầu trên kéo cột nước liên tục trong mạch gỗ từ rễ lên ngọn cây cao hàng chục mét.',
        metricsSummary: `Stomata=${open}%, Flux=${flux}`
      };
    }
  ),

  ecosystem_biome_3d: makeBioCfg(
    'ecosystem_biome_3d',
    'Tháp Năng Lượng Hệ Sinh Thái & Hiệu Suất Sinh Thái 10%',
    'Điều chỉnh năng lượng sơ cấp đầu vào và tỉ lệ thất thoát nhiệt để thấy vì sao chuỗi thức ăn ít mắt xích.',
    'H = \\frac{E_{\\text{bậc } n+1}}{E_{\\text{bậc } n}} \\times 100\\% \\approx 10\\%',
    [
      { key: 'effPct', label: 'Hiệu suất truyền bậc', unit: '%', min: 5, max: 20, step: 1, defaultVal: 10, accentClass: 'accent-emerald-500' },
      { key: 'baseKcal', label: 'Năng lượng bậc 1 (Thực vật)', unit: 'k kcal', min: 10, max: 100, step: 10, defaultVal: 10, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Tháp chuẩn 10%', description: '10.000 → 1.000 → 100 → 10 kcal', params: { effPct: 10, baseKcal: 10 } },
      { label: 'Hiệu suất cao (15%)', description: 'Hệ sinh thái biển giàu năng lượng hơn', params: { effPct: 15, baseKcal: 40 } }
    ],
    [
      { id: 'heat_loss', label: 'Hiển thị phần ~90% thất thoát hô hấp', kind: 'toggle', flagKey: 'showLoss', accent: 'amber' },
      { id: 'reset_bio', label: 'Về chuẩn tháp 10%', kind: 'reset', accent: 'rose' }
    ],
    { showLoss: true },
    (p) => {
      const h = (p.effPct ?? 10) / 100;
      const e1 = (p.baseKcal ?? 10) * 1000;
      const e4 = Math.round(e1 * h * h * h);
      return {
        equationText: `Bậc 1: ${e1.toLocaleString()} kcal → Bậc 4 (Đỉnh): ${e4.toLocaleString()} kcal (H = ${p.effPct ?? 10}%)`,
        statusNote: 'Khoảng 90% năng lượng mất qua hô hấp, bài tiết và tỏa nhiệt ở mỗi bậc nên tháp năng lượng luôn đáy rộng đỉnh hẹp.',
        metricsSummary: `H=${p.effPct ?? 10}%, Top=${e4}kcal`
      };
    }
  ),

  population_genetics_3d: makeBioCfg(
    'population_genetics_3d',
    'Cân Bằng Di Truyền Quần Thể (Hardy–Weinberg)',
    'Thay đổi tần số alen trội p (và q = 1 − p) để quan sát tỉ lệ kiểu gen p²AA : 2pqAa : q²aa.',
    'p^2\\,AA + 2pq\\,Aa + q^2\\,aa = 1 \\quad (p + q = 1)',
    [
      { key: 'pFreq', label: 'Tần số alen trội p(A)', unit: '', min: 0.05, max: 0.95, step: 0.05, defaultVal: 0.6, accentClass: 'accent-sky-500' },
      { key: 'popSize', label: 'Kích thước quần thể N', unit: 'cá thể', min: 100, max: 5000, step: 100, defaultVal: 1000, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Cân bằng 50/50 (p=0,5)', description: 'Dị hợp tử Aa đạt cực đại 50%', params: { pFreq: 0.5, popSize: 1000 } },
      { label: 'Bệnh lặn hiếm (q=0,1)', description: 'Người mang gen bệnh 2pq = 18%', params: { pFreq: 0.9, popSize: 2000 } }
    ],
    [
      { id: 'inbreed', label: 'Chuyển sang Tự thụ phấn (Giảm Aa)', kind: 'toggle', flagKey: 'inbreeding', accent: 'amber' },
      { id: 'reset_bio', label: 'Về Ngẫu phối cân bằng', kind: 'reset', accent: 'rose' }
    ],
    { inbreeding: false },
    (p, f) => {
      const pf = p.pFreq ?? 0.6;
      const qf = 1 - pf;
      const het = f.inbreeding ? pf * qf : 2 * pf * qf;
      return {
        equationText: `p=${pf.toFixed(2)}, q=${qf.toFixed(2)} → AA=${(pf * pf * 100).toFixed(1)}% · Aa=${(het * 100).toFixed(1)}% · aa=${((1 - pf * pf - het) * 100).toFixed(1)}%`,
        statusNote: f.inbreeding
          ? 'Tự thụ phấn / giao phối cận huyết làm giảm dần tỉ lệ dị hợp Aa và tăng đồng hợp lặn aa qua các thế hệ!'
          : 'Trong quần thể ngẫu phối lớn ổn định, tỉ lệ dị hợp 2pq đạt cực đại (50%) khi p = q = 0,5.',
        metricsSummary: `p=${pf.toFixed(2)}, Aa=${(het * 100).toFixed(1)}%`
      };
    }
  ),

  endocrine_pancreas_3d: makeBioCfg(
    'endocrine_pancreas_3d',
    'Đảo Tụy Điều Hòa Đường Huyết (Insulin ↔ Glucagon)',
    'Thử tăng đường huyết sau bữa ăn để tế bào β tiết Insulin, hoặc nhịn đói để tế bào α tiết Glucagon.',
    '\\text{Đường cao} \\to \\text{Insulin} \\downarrow \\quad | \\quad \\text{Đường thấp} \\to \\text{Glucagon} \\uparrow',
    [
      { key: 'glucoseMg', label: 'Đường huyết hiện tại', unit: 'mg/dL', min: 55, max: 220, step: 5, defaultVal: 95, accentClass: 'accent-sky-500' },
      { key: 'sensitivity', label: 'Độ nhạy thụ thể Insulin', unit: '%', min: 20, max: 100, step: 10, defaultVal: 100, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Bình thường (95 mg/dL)', description: 'Cân bằng nội môi chuẩn trước ăn', params: { glucoseMg: 95, sensitivity: 100 } },
      { label: 'Sau bữa ăn (165 mg/dL)', description: 'Tế bào β tiết mạnh Insulin đưa đường vào gan/cơ', params: { glucoseMg: 165, sensitivity: 100 } },
      { label: 'Hạ đường huyết (65 mg/dL)', description: 'Tế bào α tiết Glucagon phân giải Glycogen', params: { glucoseMg: 65, sensitivity: 100 } }
    ],
    [
      { id: 'meal', label: 'Nạp bữa ăn nhiều tinh bột (+Glucose)', kind: 'trigger', accent: 'amber' },
      { id: 'reset_bio', label: 'Về mức đường huyết chuẩn 95 mg/dL', kind: 'reset', accent: 'rose' }
    ],
    {},
    (p) => {
      const g = p.glucoseMg ?? 95;
      const hormone = g > 120 ? 'Tế bào β tiết INSULIN mạnh (Hạ đường huyết)' : g < 75 ? 'Tế bào α tiết GLUCAGON (Tăng đường huyết)' : 'Cân bằng nội môi ổn định';
      return {
        equationText: `Glucose máu = ${g} mg/dL · ${hormone}`,
        statusNote: 'Insulin mở kênh đưa glucose vào tế bào và tổng hợp glycogen ở gan; Glucagon làm chiều ngược lại.',
        metricsSummary: `Glucose=${g}mg/dL`
      };
    }
  ),

  gene_linkage_3d: makeBioCfg(
    'gene_linkage_3d',
    'Liên Kết Gen & Hoán Vị Gen (Trao Đổi Chéo Chiasma)',
    'Điều chỉnh khoảng cách giữa hai gen trên cùng 1 NST (tính bằng cM) để thấy tần số hoán vị f ≤ 50%.',
    'g_{\\text{hoán vị}} = \\frac{f}{2},\\quad g_{\\text{liên kết}} = \\frac{1-f}{2}\\quad (f \\le 50\\%)',
    [
      { key: 'fPct', label: 'Tần số hoán vị gen f', unit: '%', min: 0, max: 50, step: 2, defaultVal: 20, accentClass: 'accent-amber-500' },
      { key: 'offspring', label: 'Tổng số cá thể đời con', unit: 'con', min: 100, max: 2000, step: 100, defaultVal: 1000, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Liên kết hoàn toàn (f=0%)', description: 'Chỉ cho 2 loại giao tử AB, ab', params: { fPct: 0, offspring: 1000 }, flags: { crossover: false } },
      { label: 'Hoán vị f = 20%', description: 'Giao tử: 0,4 AB : 0,4 ab : 0,1 Ab : 0,1 aB', params: { fPct: 20, offspring: 1000 }, flags: { crossover: true } }
    ],
    [
      { id: 'cross', label: 'Bật Trao đổi chéo (Chiasma)', kind: 'toggle', flagKey: 'crossover', accent: 'amber' },
      { id: 'reset_bio', label: 'Về Liên kết hoàn toàn', kind: 'reset', accent: 'rose' }
    ],
    { crossover: true },
    (p, f) => {
      const fVal = f.crossover ? (p.fPct ?? 20) : 0;
      const gHV = fVal / 2;
      const gLK = (100 - fVal) / 2;
      return {
        equationText: `f = ${fVal}% · Giao tử LK (AB=ab) = ${gLK.toFixed(1)}% · Giao tử HV (Ab=aB) = ${gHV.toFixed(1)}%`,
        statusNote: 'Hai gen càng xa nhau trên NST thì xác suất trao đổi chéo giữa hai cromatit khác nguồn càng cao (nhưng tối đa 50%).',
        metricsSummary: `f=${fVal}%, LK=${gLK.toFixed(1)}%, HV=${gHV.toFixed(1)}%`
      };
    }
  ),

  eukaryotic_cell_3d: makeBioCfg(
    'eukaryotic_cell_3d',
    'Tế Bào Nhân Thực (Nhân · Ti Thể · Lục Lạp · Golgi)',
    'Kéo thanh Tách lớp (Explode) hoặc nhấn X-Quang để quan sát từng bào quan bên trong tế bào.',
    '\\text{Nhân (DNA)} \\to \\text{Lưới nội chất + Ribosome} \\to \\text{Golgi (Tiết protein)}',
    [
      { key: 'activity', label: 'Cường độ trao đổi chất', unit: '%', min: 20, max: 100, step: 10, defaultVal: 70, accentClass: 'accent-emerald-500' },
      { key: 'osmosis', label: 'Áp suất trương tế bào', unit: 'bar', min: 1, max: 6, step: 0.5, defaultVal: 3, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Tế bào động vật (Không lục lạp)', description: 'Màng sinh chất mềm dẻo', params: { activity: 75, osmosis: 2.5 }, flags: { plantMode: false } },
      { label: 'Tế bào thực vật (Có lục lạp)', description: 'Thành xenlulozơ + Lục lạp quang hợp', params: { activity: 85, osmosis: 4.5 }, flags: { plantMode: true } }
    ],
    [
      { id: 'plant_toggle', label: 'Chuyển Thực vật / Động vật', kind: 'toggle', flagKey: 'plantMode', accent: 'emerald' },
      { id: 'reset_bio', label: 'Đặt lại cấu trúc mặc định', kind: 'reset', accent: 'rose' }
    ],
    { plantMode: true },
    (p, f) => ({
      equationText: `${f.plantMode ? 'Tế bào Thực vật (Có thành & Lục lạp)' : 'Tế bào Động vật (Không thành tế bào)'} · Trao đổi chất ${p.activity ?? 70}%`,
      statusNote: 'Nhấn trực tiếp vào bất kì bào quan nào trong cảnh 3D để xem tên và vai trò sinh học của bào quan đó.',
      metricsSummary: `Type=${f.plantMode ? 'Plant' : 'Animal'}, Act=${p.activity ?? 70}%`
    })
  ),

  plant_flower_seed_3d: makeBioCfg(
    'plant_flower_seed_3d',
    'Hoa Lưỡng Tính, Thụ Tinh & Tạo Quả – Hạt 3D',
    'Khám phá Đài, Tràng, Nhị (bao phấn), Nhụy (bầu chứa noãn) và quá trình hạt phấn rơi xuống đầu nhụy tạo quả.',
    '\\text{Hạt phấn} \\xrightarrow{\\text{Thụ phấn}} \\text{Đầu nhụy} \\to \\text{Thụ tinh Noãn} \\implies \\text{Quả & Hạt}',
    [
      { key: 'pollinationPct', label: 'Tiến trình Thụ phấn → Tạo quả', unit: '%', min: 0, max: 100, step: 10, defaultVal: 45, accentClass: 'accent-amber-500' },
      { key: 'moisture', label: 'Độ ẩm & Ánh sáng', unit: '%', min: 20, max: 100, step: 10, defaultVal: 75, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Hoa nở thu hút côn trùng', description: 'Bao phấn bung hạt phấn vàng bay sang đầu nhụy', params: { pollinationPct: 30, moisture: 75 }, flags: { fertilized: false } },
      { label: 'Sau thụ tinh (Bầu thành Quả)', description: 'Cánh hoa rụng bớt, bầu nhụy phình to thành quả chứa hạt', params: { pollinationPct: 95, moisture: 80 }, flags: { fertilized: true } }
    ],
    [
      { id: 'fert_toggle', label: 'Hoàn tất Thụ tinh tạo Quả', kind: 'toggle', flagKey: 'fertilized', accent: 'emerald' },
      { id: 'reset_bio', label: 'Về giai đoạn Hoa nở', kind: 'reset', accent: 'rose' }
    ],
    { fertilized: false },
    (p, f) => ({
      equationText: f.fertilized || (p.pollinationPct ?? 45) >= 80
        ? 'Sau thụ tinh: Bầu nhụy phát triển thành QUẢ, Noãn phát triển thành HẠT!'
        : `Đang thụ phấn (${p.pollinationPct ?? 45}%): Hạt phấn bám đầu nhụy nảy ống phấn xuống noãn`,
      statusNote: 'Hoa có cả nhị (tạo hạt phấn) và nhụy (chứa noãn) gọi là hoa lưỡng tính (như hoa bưởi, hoa phượng, hoa đậu).',
      metricsSummary: `Poll=${p.pollinationPct ?? 45}%, Fert=${Boolean(f.fertilized)}`
    })
  ),

  comparative_hearts_3d: makeBioCfg(
    'comparative_hearts_3d',
    'Tiến Hóa Tim Động Vật Có Xương Sống (2 → 3 → 4 Ngăn) 3D',
    'Đặt cạnh nhau để đối chiếu cấu tạo và nhịp đập của Tim Cá (2 ngăn), Tim Ếch (3 ngăn) và Tim Chim/Thú (4 ngăn).',
    '\\text{Cá (2 ngăn, biến nhiệt)} \\to \\text{Lưỡng cư/Bò sát (3 ngăn)} \\to \\text{Chim & Thú (4 ngăn, hằng nhiệt)}',
    [
      { key: 'animalStage', label: 'Nhóm chọn nổi bật (1:Cá 2:Ếch 3:Thú)', unit: '', min: 1, max: 3, step: 1, defaultVal: 3, accentClass: 'accent-rose-500' },
      { key: 'heartRate', label: 'Nhịp tim sinh học', unit: 'bpm', min: 40, max: 140, step: 10, defaultVal: 75, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: '1. Tim Cá (2 ngăn)', description: '1 tâm nhĩ + 1 tâm thất, 1 vòng tuần hoàn', params: { animalStage: 1, heartRate: 55 }, flags: { showAllThree: true } },
      { label: '2. Tim Ếch (3 ngăn)', description: '2 tâm nhĩ + 1 tâm thất chung (máu pha)', params: { animalStage: 2, heartRate: 65 }, flags: { showAllThree: true } },
      { label: '3. Tim Chim & Thú (4 ngăn)', description: 'Vách ngăn hoàn chỉnh, tách riêng máu giàu O₂ và nghèo O₂', params: { animalStage: 3, heartRate: 80 }, flags: { showAllThree: true } }
    ],
    [
      { id: 'compare_toggle', label: 'Hiện cả 3 tim đối chiếu', kind: 'toggle', flagKey: 'showAllThree', accent: 'sky' },
      { id: 'reset_bio', label: 'Về chế độ Tim 4 ngăn', kind: 'reset', accent: 'rose' }
    ],
    { showAllThree: true },
    (p) => {
      const s = Math.round(p.animalStage ?? 3);
      const label = s === 1 ? 'Cá: Tim 2 ngăn (1 nhĩ + 1 thất) · Máu đi nuôi cơ thể là máu đỏ tươi qua mang'
        : s === 2 ? 'Lưỡng cư (Ếch): Tim 3 ngăn (2 nhĩ + 1 thất) · Máu pha trộn ở tâm thất'
        : 'Chim & Thú: Tim 4 ngăn (2 nhĩ + 2 thất) · Máu không pha trộn → Hằng nhiệt!';
      return {
        equationText: label,
        statusNote: 'Sự xuất hiện vách ngăn tâm thất hoàn chỉnh giúp Chim và Thú cung cấp O₂ hiệu quả cao để giữ thân nhiệt ổn định.',
        metricsSummary: `Stage=${s}, HR=${p.heartRate ?? 75}bpm`
      };
    }
  ),

  digestive_tract_3d: makeBioCfg(
    'digestive_tract_3d',
    'Ống Tiêu Hóa Người (Miệng – Thực Quản – Dạ Dày – Ruột Non) 3D',
    'Quan sát viên thức ăn đi qua khoang miệng (Amylase), dạ dày co bóp tiết Pepsin/HCl và hấp thụ qua lông ruột non.',
    '\\text{Miệng (Amylase)} \\to \\text{Dạ dày (Pepsin + HCl)} \\to \\text{Ruột non (Hấp thụ máu)}',
    [
      { key: 'bolusPos', label: 'Vị trí viên thức ăn (1→3)', unit: '', min: 1, max: 3, step: 0.1, defaultVal: 2.0, accentClass: 'accent-amber-500' },
      { key: 'enzymeAct', label: 'Hoạt độ Enzym tiêu hóa', unit: '%', min: 20, max: 100, step: 10, defaultVal: 80, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Chặng 1: Thực quản xuống Dạ dày', description: 'Nhu động thực quản đẩy thức ăn đã trộn Amylase xuống dạ dày', params: { bolusPos: 1.2, enzymeAct: 85 }, flags: { peristalsis: true } },
      { label: 'Chặng 2: Dạ dày (pH ≈ 2)', description: 'Dạ dày co bóp mạnh, Pepsin phân cắt Protein', params: { bolusPos: 2.0, enzymeAct: 90 }, flags: { peristalsis: true } },
      { label: 'Chặng 3: Ruột non (Vi nhung mao)', description: 'Chất dinh dưỡng ngấm qua thành ruột non vào mạch máu', params: { bolusPos: 2.9, enzymeAct: 95 }, flags: { peristalsis: true } }
    ],
    [
      { id: 'peri_toggle', label: 'Bật/Tạm dừng nhu động co bóp', kind: 'toggle', flagKey: 'peristalsis', accent: 'emerald' },
      { id: 'reset_bio', label: 'Đưa thức ăn về đầu ống', kind: 'reset', accent: 'rose' }
    ],
    { peristalsis: true },
    (p) => {
      const pos = p.bolusPos ?? 2.0;
      const stage = pos < 1.6
        ? 'Thực quản → Đang đưa tinh bột đã cắt dở bởi Amylase xuống dạ dày'
        : pos < 2.4
        ? 'Dạ dày (pH ≈ 2): Acid HCl diệt khuẩn & Enzym Pepsin phân cắt Protein'
        : 'Ruột non (dài 5–6 m): Enzym tụy + dịch mật tiêu hóa hoàn tất & hấp thụ qua lông ruột';
      return {
        equationText: stage,
        statusNote: 'Ruột non có diện tích hấp thụ cực lớn nhờ nếp gấp niêm mạc, lông ruột và vi nhung mao dày đặc.',
        metricsSummary: `Zone=${pos.toFixed(1)}, Enz=${p.enzymeAct ?? 80}%`
      };
    }
  ),

  invertebrate_biodiversity_3d: makeBioCfg(
    'invertebrate_biodiversity_3d',
    'Đa Dạng Động Vật Không Xương Sống (4 Ngành Chủ Lực) 3D',
    'Đối chiếu trực tiếp cấu trúc Thủy tức (Ruột khoang), Giun đất (Giun đốt), Ốc (Thân mềm) và Châu chấu/Tôm (Chân khớp).',
    '\\text{Ruột khoang} \\to \\text{Giun đốt} \\to \\text{Thân mềm} \\to \\text{Chân khớp (Kitin)}',
    [
      { key: 'phylumId', label: 'Ngành chọn (1:Ruột khoang 2:Giun 3:Thân mềm 4:Chân khớp)', unit: '', min: 1, max: 4, step: 1, defaultVal: 4, accentClass: 'accent-emerald-500' },
      { key: 'moisture', label: 'Độ ẩm sinh cảnh', unit: '%', min: 20, max: 100, step: 10, defaultVal: 75, accentClass: 'accent-sky-500' }
    ],
    [
      { label: '1. Ruột khoang (Thủy tức)', description: 'Đối xứng tỏa tròn, sống bám hoặc bơi bằng tua miệng', params: { phylumId: 1, moisture: 95 }, flags: { showAll: true } },
      { label: '2. Giun đất (Giun đốt)', description: 'Cơ thể phân đốt đều, hô hấp qua da ẩm', params: { phylumId: 2, moisture: 85 }, flags: { showAll: true } },
      { label: '4. Chân khớp (Vỏ Kitin)', description: 'Số lượng loài đông đảo nhất nhờ chân khớp linh hoạt', params: { phylumId: 4, moisture: 65 }, flags: { showAll: true } }
    ],
    [
      { id: 'all_toggle', label: 'Hiển thị cả 4 mẫu vật đối chiếu', kind: 'toggle', flagKey: 'showAll', accent: 'teal' },
      { id: 'reset_bio', label: 'Về mặc định Chân khớp', kind: 'reset', accent: 'rose' }
    ],
    { showAll: true },
    (p) => {
      const id = Math.round(p.phylumId ?? 4);
      const names = ['Ruột khoang (Thủy tức, Sứa)', 'Giun đốt (Giun đất, Rươi)', 'Thân mềm (Ốc, Trai, Mực)', 'Chân khớp (Tôm, Nhện, Côn trùng)'];
      return {
        equationText: `Ngành đang nổi bật: ${names[id - 1]}`,
        statusNote: 'Động vật không xương sống đóng vai trò mắt xích thức ăn, thụ phấn và làm tơi xốp đất tự nhiên.',
        metricsSummary: `Phylum=${id}, Moisture=${p.moisture ?? 75}%`
      };
    }
  ),

  plant_tropism_germination_3d: makeBioCfg(
    'plant_tropism_germination_3d',
    'Nảy Mầm, Hướng Sáng (Auxin) & Hướng Trọng Lực 3D',
    'Xoay góc chiếu mặt trời và độ ẩm đất để thấy thân non hướng về ánh sáng dương còn rễ mầm hướng đất dương.',
    '\\text{Auxin tích tụ phía tối} \\implies \\text{Thân uốn về sáng} \\quad|\\quad \\text{Rễ đâm xuống đất}',
    [
      { key: 'lightAngle', label: 'Góc chiếu ánh sáng mặt trời', unit: '°', min: -65, max: 65, step: 5, defaultVal: 40, accentClass: 'accent-amber-500' },
      { key: 'moisture', label: 'Độ ẩm đất', unit: '%', min: 10, max: 100, step: 10, defaultVal: 75, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Chiếu sáng lệch phải (+50°)', description: 'Thân non uốn cong rõ rệt về phía nguồn sáng', params: { lightAngle: 50, moisture: 80 }, flags: { sprouted: true } },
      { label: 'Chiếu sáng lệch trái (−50°)', description: 'Ngọn cây đổi hướng ngược lại', params: { lightAngle: -50, moisture: 80 }, flags: { sprouted: true } },
      { label: 'Đất khô hạn (<30%)', description: 'Thiếu nước làm hạt không thể nảy mầm', params: { lightAngle: 20, moisture: 25 }, flags: { sprouted: false } }
    ],
    [
      { id: 'sprout_toggle', label: 'Kích hoạt / Tạm dừng nảy mầm', kind: 'toggle', flagKey: 'sprouted', accent: 'emerald' },
      { id: 'reset_bio', label: 'Đặt lại cây non chuẩn', kind: 'reset', accent: 'rose' }
    ],
    { sprouted: true },
    (p, f) => {
      const ang = p.lightAngle ?? 40;
      const moist = p.moisture ?? 75;
      return {
        equationText:
          f.sprouted !== false && moist >= 40
            ? `Độ ẩm ${moist}% · Góc sáng ${ang}° → Thân hướng sáng (+) · Rễ hướng đất (+)`
            : 'Thiếu độ ẩm (< 40%) → Hạt đang ở trạng thái ngủ nghỉ',
        statusNote: 'Cảm ứng giúp thực vật hướng tới ánh sáng để quang hợp và rễ tìm nước, muối khoáng trong đất.',
        metricsSummary: `Angle=${ang}°, Moist=${moist}%`
      };
    }
  ),

  skeleton_senses_3d: makeBioCfg(
    'skeleton_senses_3d',
    'Hệ Vận Động (Xương–Cơ Tay) & Điều Tiết Mắt Người 3D',
    'Gấp cẳng tay để xem cơ nhị đầu co phồng, đồng thời thử điều chỉnh tiêu điểm thủy tinh thể về đúng võng mạc vàng.',
    '\\text{Cơ nhị đầu co} \\to \\text{Nâng cẳng tay} \\quad|\\quad \\text{Kính } (-) \\text{ sửa Cận thị}',
    [
      { key: 'muscleFlex', label: 'Mức co cơ nhị đầu gấp tay', unit: '%', min: 0, max: 100, step: 10, defaultVal: 60, accentClass: 'accent-rose-500' },
      { key: 'eyeError', label: 'Độ lệch tật khúc xạ mắt (+Cận / -Viễn)', unit: 'dp', min: -5, max: 5, step: 1, defaultVal: 0, accentClass: 'accent-sky-500' }
    ],
    [
      { label: 'Tay gấp + Mắt chính thị', description: 'Ảnh hội tụ chuẩn xanh trên võng mạc', params: { muscleFlex: 80, eyeError: 0 }, flags: { myopiaLens: false } },
      { label: 'Mắt Cận thị chưa đeo kính', description: 'Tiêu điểm đỏ rơi phía trước võng mạc', params: { muscleFlex: 40, eyeError: 5 }, flags: { myopiaLens: false } },
      { label: 'Đeo kính phân kì sửa Cận', description: 'Đưa tiêu điểm lùi về đúng võng mạc (xanh)', params: { muscleFlex: 40, eyeError: 5 }, flags: { myopiaLens: true } }
    ],
    [
      { id: 'myopia_lens', label: 'Đeo thấu kính phân kì (−) sửa Cận', kind: 'toggle', flagKey: 'myopiaLens', accent: 'sky' },
      { id: 'reset_bio', label: 'Về mắt chính thị & tay thư giãn', kind: 'reset', accent: 'rose' }
    ],
    { myopiaLens: false },
    (p, f) => {
      const flex = p.muscleFlex ?? 60;
      const err = (p.eyeError ?? 0) + (f.myopiaLens ? -5 : 0);
      return {
        equationText: `Co cơ nhị đầu = ${flex}% · Điểm ảnh: ${Math.abs(err) <= 2 ? 'ĐÚNG trên Võng mạc' : err > 2 ? 'TRƯỚC võng mạc (Cận)' : 'SAU võng mạc (Viễn)'}`,
        statusNote: 'Hệ xương là khung nâng đỡ thụ động; hệ cơ co giãn tạo lực kéo quanh khớp động; mắt điều tiết thủy tinh thể.',
        metricsSummary: `Flex=${flex}%, Lens=${f.myopiaLens ? 'Concave' : 'None'}`
      };
    }
  ),

  biomolecules_3d: makeBioCfg(
    'biomolecules_3d',
    'Mạng Liên Kết Hiđrô Nước & 4 Đại Phân Tử Sinh Học 3D',
    'Chọn đại phân tử (Nước H₂O, Vòng Glucose, Xoắn Protein bậc 3, Phospholipid hoặc DNA) và thử tăng nhiệt độ để xem Protein bị biến tính.',
    '\\text{H}_2\\text{O (Liên kết H)} \\quad|\\quad \\text{Protein: Bậc 1} \\to \\text{Bậc 3/4 (Chức năng)}',
    [
      { key: 'molGroup', label: 'Loại (1:Nước H₂O 2:Glucozơ 3:Protein xoắn α 4:Phospholipid)', unit: '', min: 1, max: 4, step: 1, defaultVal: 3, accentClass: 'accent-emerald-500' },
      { key: 'tempC', label: 'Nhiệt độ môi trường', unit: '°C', min: 0, max: 95, step: 5, defaultVal: 37, accentClass: 'accent-rose-500' }
    ],
    [
      { label: 'Mạng tứ diện H₂O & Liên kết Hiđrô', description: 'Nước phân cực O(δ-) – H(δ+) hút tĩnh điện tạo mạng liên kết H', params: { molGroup: 1, tempC: 20 }, flags: { showHBonds: true } },
      { label: 'Protein cuộn xoắn tự nhiên (37°C)', description: 'Cấu trúc không gian bậc 3 ổn định thực hiện chức năng sinh học', params: { molGroup: 3, tempC: 37 }, flags: { showHBonds: true } },
      { label: 'Biến tính Protein ở nhiệt độ cao (80°C)', description: 'Liên kết hiđrô đứt gãy làm chuỗi polipeptit duỗi thẳng mất hoạt tính', params: { molGroup: 3, tempC: 80 }, flags: { showHBonds: false } }
    ],
    [
      { id: 'hbonds', label: 'Hiển thị mạng Liên kết Hiđrô', kind: 'toggle', flagKey: 'showHBonds', accent: 'sky' },
      { id: 'reset_bio', label: 'Đặt lại 37°C chuẩn sinh lí', kind: 'reset', accent: 'emerald' }
    ],
    { showHBonds: true },
    (p, f) => {
      const grp = Math.round(p.molGroup ?? 3);
      const t = p.tempC ?? 37;
      const names = ['Mạng Nước H₂O', 'Đơn phân α-Glucozơ', 'Chuỗi Protein bậc 3', 'Phospholipid lưỡng cực'];
      const denatured = grp === 3 && t > 58;
      return {
        equationText: `${names[grp - 1] || names[2]} · T = ${t}°C · ${denatured ? 'BIẾN TÍNH (Đứt liên kết H bậc 3)' : f.showHBonds ? 'Liên kết Hiđrô ổn định' : 'Ẩn liên kết H'}`,
        statusNote: grp === 3 ? 'Nhiệt độ > 58°C phá vỡ các liên kết yếu bậc 3/4 nhưng giữ nguyên liên kết peptit bậc 1.' : 'Cấu trúc không gian quyết định trực tiếp tính chất lý–hóa và chức năng sinh học.',
        metricsSummary: `Mol=${names[grp - 1] || 'Protein'}, T=${t}°C`
      };
    }
  ),

  human_brain_3d: makeBioCfg(
    'human_brain_3d',
    'Giải Phẫu Não Bộ Người 3D (4 Thùy – Tiểu não – Thân não)',
    'Chạm trực tiếp vào thùy trán, thùy đỉnh/thái dương, thùy chẩm, tiểu não hoặc thân não để phóng to và xem chức năng từng vùng.',
    '\\text{Đại não (Vỏ chất xám)} + \\text{Tiểu não (Thăng bằng)} + \\text{Thân não (Sinh tồn)}',
    [
      { key: 'neuralActivity', label: 'Mức hoạt động vỏ não', unit: '%', min: 20, max: 100, step: 10, defaultVal: 75, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Nghỉ thư giãn (Sóng Alpha)', description: 'Hoạt động ổn định điều hòa tự chủ', params: { neuralActivity: 40 } },
      { label: 'Tư duy tập trung (Sóng Beta)', description: 'Thùy trán xử lí tích cực thông tin', params: { neuralActivity: 90 } }
    ],
    [{ id: 'reset_bio', label: 'Đặt lại góc nhìn chuẩn', kind: 'reset', accent: 'teal' }],
    {},
    (p) => ({
      equationText: `Hoạt động vỏ não = ${p.neuralActivity ?? 75}% · Vỏ não có ~86 tỉ nơron liên kết`,
      statusNote: 'Các nếp gấp hồi não (gyri) và rãnh não (sulci) làm tăng gấp 3 lần diện tích vỏ não chứa thân nơron.',
      metricsSummary: `BrainAct=${p.neuralActivity ?? 75}%`
    })
  ),

  liver_digestive_3d: makeBioCfg(
    'liver_digestive_3d',
    'Gan – Túi Mật – Dạ Dày & Hệ Ruột Người 3D',
    'Khám phá giải phẫu 3D các cơ quan tiêu hóa chính: Gan giải độc & tiết mật, Dạ dày chữ J, Ruột non hấp thụ và Khung đại tràng.',
    '\\text{Gan (Dịch mật)} + \\text{Dạ dày (HCl/Pepsin)} \\to \\text{Ruột non (Hấp thụ)}',
    [
      { key: 'digestionRate', label: 'Tốc độ nhu động tiêu hóa', unit: '%', min: 20, max: 100, step: 10, defaultVal: 70, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Sau ăn 30 phút (Nghiền dạ dày)', description: 'Nhu động dạ dày co bóp mạnh', params: { digestionRate: 90 } },
      { label: 'Giai đoạn hấp thụ ruột non', description: 'Nhung mao hấp thụ axit amin và đường đơn', params: { digestionRate: 60 } }
    ],
    [{ id: 'reset_bio', label: 'Về mặc định', kind: 'reset', accent: 'teal' }],
    {},
    (p) => ({
      equationText: `Tốc độ nhu động = ${p.digestionRate ?? 70}% · Mật nhũ tương hóa lipid tại tá tràng`,
      statusNote: 'Gan nhận máu giàu dinh dưỡng từ tĩnh mạch cửa ruột để lọc độc, tổng hợp protein huyết tương và dự trữ glycogen.',
      metricsSummary: `Digestion=${p.digestionRate ?? 70}%`
    })
  ),

  plant_leaf_transpiration_3d: makeBioCfg(
    'plant_leaf_transpiration_3d',
    'Giải Phẫu Lá, Mô Giậu & Khí Khổng Thoát Hơi Nước 3D',
    'Điều chỉnh độ mở khí khổng hoặc kích hoạt ABA chống hạn để quan sát sự biến dạng của cặp tế bào hạt đậu.',
    '\\text{K}^+ \\text{ vào TB hạt đậu} \\to \\text{Trương nước} \\to \\text{Mở Khí khổng}',
    [
      { key: 'stomataOpen', label: 'Độ mở khí khổng', unit: '%', min: 0, max: 100, step: 10, defaultVal: 75, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'Mở rộng ban ngày (85%)', description: 'CO₂ khuếch tán vào mô giậu, hơi nước thoát ra', params: { stomataOpen: 85 }, flags: { abaClosed: false } },
      { label: 'Đóng chống mất nước (ABA)', description: 'Hoocmôn ABA làm xẹp tế bào hạt đậu', params: { stomataOpen: 10 }, flags: { abaClosed: true } }
    ],
    [
      { id: 'aba', label: 'Đóng khí khổng (ABA)', kind: 'toggle', flagKey: 'abaClosed', accent: 'amber' },
      { id: 'reset_bio', label: 'Mở lại bình thường', kind: 'reset', accent: 'teal' }
    ],
    { abaClosed: false },
    (p, f) => {
      const open = f.abaClosed ? 10 : (p.stomataOpen ?? 75);
      return {
        equationText: `Độ mở khí khổng = ${open}% · ${open > 30 ? 'Đang hấp thụ CO₂ & thoát hơi nước' : 'Hạn chế thoát hơi nước khi khô hạn'}`,
        statusNote: 'Thành trong của tế bào hạt đậu dày hơn thành ngoài nên khi trương nước chúng uốn cong mở khe khí khổng.',
        metricsSummary: `Stomata=${open}%`
      };
    }
  ),

  bacteria_prokaryote_3d: makeBioCfg(
    'bacteria_prokaryote_3d',
    'Vi Khuẩn Nhân Sơ 3D (Vỏ Nhầy – DNA Vòng – Roi Xoắn)',
    'Cắt lớp 3D vi khuẩn hình que: Thành Peptidoglycan, vùng nhân Nucleoid chưa có màng nhân, Plasmid, Ribôxôm 70S và động cơ roi Flagellum.',
    '\\text{Nhân sơ}: \\text{DNA vòng trần} + \\text{Plasmid} + \\text{Peptidoglycan}',
    [
      { key: 'divisionMin', label: 'Chu kì thế hệ g', unit: 'phút', min: 15, max: 60, step: 5, defaultVal: 20, accentClass: 'accent-emerald-500' }
    ],
    [
      { label: 'E. coli bơi tích cực', description: 'Roi xoắn quay đẩy tế bào về nguồn dinh dưỡng', params: { divisionMin: 20 }, flags: { motile: true } },
      { label: 'Trạng thái đứng yên', description: 'Dừng chuyển động roi để quan sát lông Pili', params: { divisionMin: 35 }, flags: { motile: false } }
    ],
    [
      { id: 'motile_toggle', label: 'Bật / Tắt quay roi Flagellum', kind: 'toggle', flagKey: 'motile', accent: 'sky' },
      { id: 'reset_bio', label: 'Đặt lại chuẩn E. coli', kind: 'reset', accent: 'teal' }
    ],
    { motile: true },
    (p, f) => ({
      equationText: `Chu kì thế hệ g = ${p.divisionMin ?? 20} phút · Roi xoắn: ${f.motile !== false ? 'Đang quay' : 'Tạm dừng'}`,
      statusNote: 'Vi khuẩn nhân sơ chưa có màng nhân hay bào quan có màng; plasmid mang gen kháng kháng sinh có thể truyền qua lông pili.',
      metricsSummary: `GenTime=${p.divisionMin ?? 20}m`
    })
  ),

  fungi_microorganisms_3d: makeBioCfg(
    'fungi_microorganisms_3d',
    'Nấm Sợi (Quả Thể – Mycelium) & Vi Sinh Vật Đơn Bào 3D',
    'Khám phá đồng thời cấu trúc quả thể nấm (mũ nấm, vòng phiến, mạng sợi nấm dưới đất) và động vật nguyên sinh Trùng giày Paramecium.',
    '\\text{Nấm (Thành Kitin, Dị dưỡng)} \\quad|\\quad \\text{Trùng giày (Không bào co bóp)}',
    [
      { key: 'humidity', label: 'Độ ẩm môi trường', unit: '%', min: 30, max: 100, step: 5, defaultVal: 80, accentClass: 'accent-amber-500' }
    ],
    [
      { label: 'Rừng ẩm (Nấm phát triển mạnh)', description: 'Hệ sợi nấm phân giải chất mùn', params: { humidity: 85 } },
      { label: 'Môi trường nước ngọt', description: 'Trùng giày co bóp không bào đẩy nước thừa', params: { humidity: 95 } }
    ],
    [{ id: 'reset_bio', label: 'Đặt lại chuẩn', kind: 'reset', accent: 'teal' }],
    {},
    (p) => ({
      equationText: `Độ ẩm ${p.humidity ?? 80}% · Nấm hấp thụ dinh dưỡng qua thành Kitin; Trùng giày bơi bằng lông bơi`,
      statusNote: 'Không bào co bóp hình hoa thị của trùng giày bơm liên tục giúp tế bào không bị vỡ trong nước ngọt nhược trương.',
      metricsSummary: `Humidity=${p.humidity ?? 80}%`
    })
  )
};
