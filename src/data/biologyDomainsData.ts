import { Biology3DMode, BiologyDomainId, BiologySimType } from '../types';

export interface BiologyDomainMeta {
  id: BiologyDomainId;
  code: string;
  name: string;
  shortName: string;
  grades: string;
  tagline: string;
  accentHex: string;
  accentBadgeClass: string;
  borderClass: string;
  bgActiveClass: string;
}

export interface BiologyParamBound {
  min: number;
  max: number;
  step: number;
  unit: string;
  label: string;
}

export interface Biology2DSimSpec {
  id: BiologySimType;
  domainId: BiologyDomainId;
  grades: ('Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12')[];
  title: string;
  subtitle: string;
  formula: string;
  linkedLessonId: string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, BiologyParamBound>;
  presets: {
    label: string;
    description: string;
    params: Record<string, number>;
  }[];
}

export interface Biology3DSimSpec {
  id: Biology3DMode;
  domainId: BiologyDomainId;
  grades: ('Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12')[];
  title: string;
  subtitle: string;
  formula: string;
  linkedLessonId: string;
}

export const BIOLOGY_DOMAINS: BiologyDomainMeta[] = [
  {
    id: 'cell_membrane',
    code: 'CEL · 01',
    name: 'Tế bào học & Vận chuyển qua Màng',
    shortName: 'Tế bào & Màng',
    grades: 'Lớp 10',
    tagline: 'Cấu trúc bào quan nhân thực, khảm lỏng phospholipid, thẩm thấu ưu/nhược/đẳng trương & nguyên phân/giảm phân.',
    accentHex: '#10b981',
    accentBadgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30',
    borderClass: 'border-emerald-300 dark:border-emerald-500/40',
    bgActiveClass: 'bg-emerald-600 text-white border-emerald-600'
  },
  {
    id: 'metabolism_enzyme',
    code: 'MET · 02',
    name: 'Enzyme, Quang hợp & Hô hấp Tế bào',
    shortName: 'Chuyển hóa & ATP',
    grades: 'Lớp 10 – 11',
    tagline: 'Động học Michaelis–Menten, chu trình Calvin C3/C4, hô hấp hiếu khí 32 ATP & lên men kỵ khí.',
    accentHex: '#0ea5e9',
    accentBadgeClass: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/30',
    borderClass: 'border-sky-300 dark:border-sky-500/40',
    bgActiveClass: 'bg-sky-600 text-white border-sky-600'
  },
  {
    id: 'genetics_molecular',
    code: 'GEN · 03',
    name: 'Di truyền Phân tử & Biến dị',
    shortName: 'ADN & Di truyền',
    grades: 'Lớp 9 – 12',
    tagline: 'Tái bản bán bảo toàn DNA, phiên mã–dịch mã mRNA, Operon Lac, chỉnh sửa gen CRISPR, PCR & quy luật Mendel/Morgan.',
    accentHex: '#6366f1',
    accentBadgeClass: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/30',
    borderClass: 'border-indigo-300 dark:border-indigo-500/40',
    bgActiveClass: 'bg-indigo-600 text-white border-indigo-600'
  },
  {
    id: 'evolution_population',
    code: 'EVO · 04',
    name: 'Di truyền Quần thể & Tiến hóa',
    shortName: 'Quần thể & Tiến hóa',
    grades: 'Lớp 12',
    tagline: 'Cân bằng Hardy–Weinberg p²+2pq+q²=1, chọn lọc tự nhiên, phiêu bạt di truyền & thích nghi nhóm máu.',
    accentHex: '#8b5cf6',
    accentBadgeClass: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/15 border-violet-200 dark:border-violet-500/30',
    borderClass: 'border-violet-300 dark:border-violet-500/40',
    bgActiveClass: 'bg-violet-600 text-white border-violet-600'
  },
  {
    id: 'physiology_organism',
    code: 'PHY · 05',
    name: 'Sinh lí Thực vật, Động vật & Miễn dịch',
    shortName: 'Sinh lí & Miễn dịch',
    grades: 'Lớp 11',
    tagline: 'Dòng mạch gỗ/rây, chu kì tim, hiệu ứng Bohr hemoglobin, điện thế hoạt động neuron, thận lọc máu & miễn dịch.',
    accentHex: '#f59e0b',
    accentBadgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30',
    borderClass: 'border-amber-300 dark:border-amber-500/40',
    bgActiveClass: 'bg-amber-600 text-white border-amber-600'
  },
  {
    id: 'ecology_biosphere',
    code: 'ECO · 06',
    name: 'Sinh thái học & Sinh quyển',
    shortName: 'Sinh thái học',
    grades: 'Lớp 9 – 12',
    tagline: 'Chuỗi thức ăn tháp năng lượng 10%, mô hình tăng trưởng logistic K, dao động Lotka–Volterra & chu trình C/N.',
    accentHex: '#14b8a6',
    accentBadgeClass: 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15 border-teal-200 dark:border-teal-500/30',
    borderClass: 'border-teal-300 dark:border-teal-500/40',
    bgActiveClass: 'bg-teal-600 text-white border-teal-600'
  }
];

export const BIOLOGY_2D_SIMS: Biology2DSimSpec[] = [
  {
    id: 'cell_organelles_2d',
    domainId: 'cell_membrane',
    grades: ['Lớp 10'],
    title: 'Bào quan Tế bào Nhân thực (Động vật vs Thực vật)',
    subtitle: 'Tương tác chuỗi bài tiết Nhân → RER → Golgi và năng lượng ti thể – lục lạp',
    formula: '\\text{DNA} \\to \\text{mRNA} \\to \\text{RER} \\to \\text{Golgi} \\to \\text{Xuất bào}',
    linkedLessonId: 'bio-10-2',
    defaultParams: { metabolicRate: 60, isPlantCell: 1, atpDemand: 55 },
    paramBounds: {
      metabolicRate: { min: 10, max: 100, step: 5, unit: '%', label: 'Tốc độ tổng hợp protein' },
      isPlantCell: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Chế độ Thực vật (Thành & Lục lạp)' },
      atpDemand: { min: 20, max: 100, step: 5, unit: '%', label: 'Nhu cầu ATP tế bào' }
    },
    presets: [
      { label: 'Tế bào lá xanh', description: 'Có lục lạp, không bào lớn & thành xenlulôzơ', params: { metabolicRate: 70, isPlantCell: 1, atpDemand: 65 } },
      { label: 'Tế bào tuyến tụy', description: 'Tế bào động vật tiết enzyme mạnh ở RER & Golgi', params: { metabolicRate: 95, isPlantCell: 0, atpDemand: 80 } }
    ]
  },
  {
    id: 'membrane_osmosis_2d',
    domainId: 'cell_membrane',
    grades: ['Lớp 10'],
    title: 'Thẩm thấu qua Màng sinh chất & Áp suất Trương nước',
    subtitle: 'So sánh môi trường ưu trương (co nguyên sinh), đẳng trương và nhược trương',
    formula: '\\Pi = iCRT,\\quad \\Psi_w = \\Psi_s + \\Psi_p',
    linkedLessonId: 'bio-10-3',
    defaultParams: { extConc: 0.3, intConc: 0.3, permeability: 70 },
    paramBounds: {
      extConc: { min: 0.05, max: 0.9, step: 0.05, unit: 'M', label: 'Nồng độ chất tan ngoài màng' },
      intConc: { min: 0.1, max: 0.6, step: 0.05, unit: 'M', label: 'Nồng độ nội bào' },
      permeability: { min: 20, max: 100, step: 5, unit: '%', label: 'Số kênh Aquaporin' }
    },
    presets: [
      { label: 'Đẳng trương (Cân bằng)', description: 'Nước vào = nước ra', params: { extConc: 0.3, intConc: 0.3, permeability: 70 } },
      { label: 'Ưu trương (Co nguyên sinh)', description: 'Nước rút ra ngoài làm tế bào teo lại', params: { extConc: 0.75, intConc: 0.3, permeability: 80 } },
      { label: 'Nhược trương (Trương/Tan)', description: 'Nước ồ ạt vào trong tế bào', params: { extConc: 0.05, intConc: 0.4, permeability: 85 } }
    ]
  },
  {
    id: 'enzyme_kinetics_2d',
    domainId: 'metabolism_enzyme',
    grades: ['Lớp 10'],
    title: 'Động học Enzyme Michaelis–Menten & Nhiệt độ / pH',
    subtitle: 'Ảnh hưởng nồng độ cơ chất [S], nhiệt độ, pH và chất ức chế lên vận tốc V',
    formula: 'V = \\frac{V_{\\max}[S]}{K_m + [S]}',
    linkedLessonId: 'bio-10-4',
    defaultParams: { substrateS: 40, tempC: 37, pH: 7.2, inhibitor: 0 },
    paramBounds: {
      substrateS: { min: 2, max: 120, step: 2, unit: 'mM', label: 'Nồng độ cơ chất [S]' },
      tempC: { min: 10, max: 75, step: 1, unit: '°C', label: 'Nhiệt độ phản ứng' },
      pH: { min: 2, max: 11, step: 0.2, unit: 'pH', label: 'Độ pH dung dịch' },
      inhibitor: { min: 0, max: 80, step: 5, unit: '%', label: 'Chất ức chế cạnh tranh' }
    },
    presets: [
      { label: 'Tối ưu sinh lí (37°C, pH 7,2)', description: 'Enzyme amylase/catalase hoạt động cực đại', params: { substrateS: 80, tempC: 37, pH: 7.2, inhibitor: 0 } },
      { label: 'Biến tính nhiệt (70°C)', description: 'Cấu trúc không gian bậc 3 bị phá vỡ', params: { substrateS: 80, tempC: 70, pH: 7.2, inhibitor: 0 } }
    ]
  },
  {
    id: 'photosynthesis_calvin_2d',
    domainId: 'metabolism_enzyme',
    grades: ['Lớp 10', 'Lớp 11'],
    title: 'Quang hợp: Pha sáng (ATP/NADPH) & Chu trình Calvin',
    subtitle: 'Đường cong bão hòa ánh sáng, điểm bù CO₂ và so sánh thực vật C3 / C4',
    formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{h\\nu,\\ \\text{diệp lục}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
    linkedLessonId: 'bio-11-1',
    defaultParams: { lightLux: 65, co2Ppm: 420, tempC: 28 },
    paramBounds: {
      lightLux: { min: 5, max: 100, step: 5, unit: '%', label: 'Cường độ ánh sáng' },
      co2Ppm: { min: 100, max: 1000, step: 20, unit: 'ppm', label: 'Nồng độ CO₂' },
      tempC: { min: 10, max: 45, step: 1, unit: '°C', label: 'Nhiệt độ lá' }
    },
    presets: [
      { label: 'Ánh sáng mạnh + CO₂ 800 ppm', description: 'Đạt tốc độ cố định CO₂ cao trong nhà kính', params: { lightLux: 90, co2Ppm: 800, tempC: 28 } }
    ]
  },
  {
    id: 'cellular_respiration_2d',
    domainId: 'metabolism_enzyme',
    grades: ['Lớp 10'],
    title: 'Hô hấp tế bào (Đường phân → Krebs → Chuỗi truyền e⁻)',
    subtitle: 'Theo dõi sản lượng NADH, FADH₂, O₂ tiêu thụ và 32 ATP hoặc lên men kỵ khí',
    formula: '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 30\\text{--}32\\,\\text{ATP}',
    linkedLessonId: 'bio-10-5',
    defaultParams: { glucoseM: 5, oxygenPct: 21, uncoupler: 0 },
    paramBounds: {
      glucoseM: { min: 1, max: 10, step: 1, unit: 'mol', label: 'Lượng Glucose đầu vào' },
      oxygenPct: { min: 0, max: 25, step: 1, unit: '%', label: 'Nồng độ O₂ nội bào' },
      uncoupler: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Chất tách cặp H⁺ (Tỏa nhiệt)' }
    },
    presets: [
      { label: 'Hiếu khí chuẩn (21% O₂)', description: '32 ATP/Glucose', params: { glucoseM: 5, oxygenPct: 21, uncoupler: 0 } },
      { label: 'Lên men kỵ khí (0% O₂)', description: 'Chỉ thu 2 ATP/Glucose tại tế bào chất', params: { glucoseM: 5, oxygenPct: 0, uncoupler: 0 } }
    ]
  },
  {
    id: 'mitosis_meiosis_2d',
    domainId: 'cell_membrane',
    grades: ['Lớp 9', 'Lớp 10'],
    title: 'Chu kì tế bào: Nguyên phân & Giảm phân (2n NST)',
    subtitle: 'Biến đổi số lượng NST, số cromatit qua các kì Kì đầu – Giữa – Sau – Cuối',
    formula: '\\text{Nguyên phân}:\\ 2n \\to 2 \\times 2n,\\quad \\text{Giảm phân}:\\ 2n \\to 4 \\times n',
    linkedLessonId: 'bio-10-6',
    defaultParams: { diploid2n: 8, isMeiosis: 0, phaseProgress: 50 },
    paramBounds: {
      diploid2n: { min: 4, max: 16, step: 2, unit: 'NST', label: 'Bộ NST lưỡng bội 2n' },
      isMeiosis: { min: 0, max: 1, step: 1, unit: '0/1', label: '0: Nguyên phân | 1: Giảm phân' },
      phaseProgress: { min: 0, max: 100, step: 5, unit: '%', label: 'Tiến trình phân bào' }
    },
    presets: [
      { label: 'Nguyên phân (2n=8)', description: 'Tạo 2 tế bào con giữ nguyên 2n', params: { diploid2n: 8, isMeiosis: 0, phaseProgress: 50 } },
      { label: 'Giảm phân (2n=8 → n=4)', description: 'Tạo 4 giao tử đơn bội có trao đổi chéo', params: { diploid2n: 8, isMeiosis: 1, phaseProgress: 65 } }
    ]
  },
  {
    id: 'dna_replication_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Tái bản DNA bán bảo toàn & Nguyên tắc bổ sung (A=T, G≡X)',
    subtitle: 'Chạc chữ Y với mạch dẫn 3’→5’ liên tục và đoạn Okazaki tổng hợp gián đoạn',
    formula: 'A = T,\\ G = C,\\quad \\text{Số LK Hydro } H = 2A + 3G,\\quad N_{\\text{mới}} = N_0(2^k - 1)',
    linkedLessonId: 'bio-12-1',
    defaultParams: { lengthPairs: 1200, gcPct: 50, cyclesK: 3 },
    paramBounds: {
      lengthPairs: { min: 300, max: 3000, step: 100, unit: 'bp', label: 'Chiều dài gen (cặp nu)' },
      gcPct: { min: 20, max: 80, step: 5, unit: '%', label: 'Tỉ lệ % (G + C)' },
      cyclesK: { min: 1, max: 6, step: 1, unit: 'lần', label: 'Số lần nhân đôi k' }
    },
    presets: [
      { label: 'Gen chuẩn 1500 bp (3 lần)', description: 'Tạo 8 phân tử DNA con', params: { lengthPairs: 1500, gcPct: 48, cyclesK: 3 } }
    ]
  },
  {
    id: 'transcription_translation_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 12'],
    title: 'Phiên mã mRNA & Dịch mã Ribosome (Polysome)',
    subtitle: 'ARN polymerase tổng hợp mRNA 5’→3’ và tRNA mang axit amin khớp bộ ba đối mã',
    formula: 'n_{\\text{aa chuỗi hoàn chỉnh}} = \\frac{N_{\\text{mRNA}}}{3} - 2 = \\frac{N_{\\text{gen}}}{6} - 2',
    linkedLessonId: 'bio-12-2',
    defaultParams: { codons: 150, ribosomes: 5, ratePct: 75 },
    paramBounds: {
      codons: { min: 30, max: 400, step: 10, unit: 'codon', label: 'Số bộ ba trên mRNA' },
      ribosomes: { min: 1, max: 10, step: 1, unit: 'rbs', label: 'Số Ribosome trên Polysome' },
      ratePct: { min: 20, max: 100, step: 5, unit: '%', label: 'Tốc độ trượt Ribosome' }
    },
    presets: [
      { label: 'Polysome 6 ribosome', description: 'Tạo cùng lúc 6 chuỗi polipeptit cùng trình tự', params: { codons: 150, ribosomes: 6, ratePct: 80 } }
    ]
  },
  {
    id: 'lac_operon_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 12'],
    title: 'Điều hòa Biểu hiện Gen: Mô hình Operon Lac (E. coli)',
    subtitle: 'Bật/Tắt phiên mã Z, Y, A theo nồng độ Lactose (chất cảm ứng) và Glucose',
    formula: '\\text{LacI (P}_R\\text{)} \\to \\text{R} \\dashv \\text{O} \\quad |\\quad \\text{Allolactose} + \\text{R} \\implies \\text{ON}',
    linkedLessonId: 'bio-12-3',
    defaultParams: { lactosePresent: 1, glucosePresent: 0, lacIMutant: 0 },
    paramBounds: {
      lactosePresent: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Môi trường có Lactose' },
      glucosePresent: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Môi trường có Glucose (cAMP thấp)' },
      lacIMutant: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Đột biến hỏng gen điều hòa R (lacI⁻)' }
    },
    presets: [
      { label: 'Bật tối đa (+Lac, -Glu)', description: 'Allolactose bất hoạt protein ức chế, phiên mã cực đại', params: { lactosePresent: 1, glucosePresent: 0, lacIMutant: 0 } },
      { label: 'Tắt (-Lac)', description: 'Protein ức chế bám vùng vận hành O', params: { lactosePresent: 0, glucosePresent: 1, lacIMutant: 0 } }
    ]
  },
  {
    id: 'crispr_editing_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 12'],
    title: 'Công nghệ Gen: Cắt & Chỉnh sửa CRISPR–Cas9 (PAM NGG)',
    subtitle: 'Phức hợp sgRNA–Cas9 nhận diện trình tự PAM và tạo đứt gãy mạch kép DSB / HDR',
    formula: '\\text{sgRNA (20 nt)} + \\text{PAM (5\'-NGG-3\')} \\xrightarrow{\\text{Cas9}} \\text{NHEJ / HDR}',
    linkedLessonId: 'bio-12-4',
    defaultParams: { matchScore: 20, hdrTemplate: 1, cas9Level: 70 },
    paramBounds: {
      matchScore: { min: 10, max: 20, step: 1, unit: 'nt', label: 'Số nu khớp sgRNA (20 nt)' },
      hdrTemplate: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Có DNA khuôn sửa chữa HDR' },
      cas9Level: { min: 10, max: 100, step: 5, unit: '%', label: 'Hoạt độ phức hợp Cas9' }
    },
    presets: [
      { label: 'Sửa đúng đích HDR', description: 'Khớp 20/20 nt + khuôn mẫu HDR', params: { matchScore: 20, hdrTemplate: 1, cas9Level: 80 } }
    ]
  },
  {
    id: 'mendel_punnett_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Quy luật Phân li & Phân li Độc lập Mendel (Khung Punnett)',
    subtitle: 'Phân bố tỉ lệ kiểu gen – kiểu hình 3:1, 9:3:3:1 qua giảm phân tạo giao tử',
    formula: '(A:a)^2 \\times (B:b)^2 = (1:2:1)^2 \\implies 9:3:3:1',
    linkedLessonId: 'bio-12-5',
    defaultParams: { parent1Het: 2, parent2Het: 2, sampleN: 640 },
    paramBounds: {
      parent1Het: { min: 1, max: 2, step: 1, unit: 'cặp', label: 'Số cặp gen dị hợp P1' },
      parent2Het: { min: 1, max: 2, step: 1, unit: 'cặp', label: 'Số cặp gen dị hợp P2' },
      sampleN: { min: 100, max: 2000, step: 50, unit: 'cây', label: 'Kích thước mẫu F1/F2' }
    },
    presets: [
      { label: 'Lai hai cặp AaBb × AaBb', description: 'Tỉ lệ chuẩn 9:3:3:1', params: { parent1Het: 2, parent2Het: 2, sampleN: 800 } }
    ]
  },
  {
    id: 'gene_linkage_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 12'],
    title: 'Liên kết Gen & Hoán vị Gen Morgan (Tần số f %)',
    subtitle: 'Trao đổi chéo giữa hai cromatit khác nguồn trong Kì đầu giảm phân I',
    formula: 'f = \\frac{\\text{Tổng giao tử hoán vị}}{\\text{Tổng số giao tử}} \\times 100\\% \\le 50\\%',
    linkedLessonId: 'bio-12-6',
    defaultParams: { recombFreq: 20, cisConfig: 1, sampleN: 1000 },
    paramBounds: {
      recombFreq: { min: 0, max: 50, step: 2, unit: '%', label: 'Tần số hoán vị gen f' },
      cisConfig: { min: 0, max: 1, step: 1, unit: '0/1', label: '1: Đều AB/ab | 0: Chéo Ab/aB' },
      sampleN: { min: 200, max: 2000, step: 100, unit: 'cá thể', label: 'Tổng số cá thể lai phân tích' }
    },
    presets: [
      { label: 'Liên kết hoàn toàn (f=0%)', description: 'Tỉ lệ lai phân tích 1:1', params: { recombFreq: 0, cisConfig: 1, sampleN: 1000 } },
      { label: 'Hoán vị f = 20% (Đều)', description: '40% AB : 40% ab : 10% Ab : 10% aB', params: { recombFreq: 20, cisConfig: 1, sampleN: 1000 } }
    ]
  },
  {
    id: 'hardy_weinberg_2d',
    domainId: 'evolution_population',
    grades: ['Lớp 12'],
    title: 'Di truyền Quần thể: Cân bằng Hardy–Weinberg',
    subtitle: 'Tần số alen p, q và cấu trúc di truyền p²AA + 2pqAa + q²aa qua các thế hệ',
    formula: 'p + q = 1,\\quad p^2 + 2pq + q^2 = 1',
    linkedLessonId: 'bio-12-7',
    defaultParams: { pFreq: 0.6, inbreedingF: 0, selectionS: 0 },
    paramBounds: {
      pFreq: { min: 0.05, max: 0.95, step: 0.05, unit: '', label: 'Tần số alen trội p(A)' },
      inbreedingF: { min: 0, max: 0.8, step: 0.1, unit: '', label: 'Hệ số giao phối gần F' },
      selectionS: { min: 0, max: 0.8, step: 0.1, unit: '', label: 'Áp lực chọn lọc chống aa' }
    },
    presets: [
      { label: 'Ngẫu phối cân bằng (p=0,6)', description: '0,36 AA : 0,48 Aa : 0,16 aa', params: { pFreq: 0.6, inbreedingF: 0, selectionS: 0 } }
    ]
  },
  {
    id: 'natural_selection_2d',
    domainId: 'evolution_population',
    grades: ['Lớp 12'],
    title: 'Chọn lọc Tự nhiên & Phiêu bạt Di truyền (Genetic Drift)',
    subtitle: 'Biến động tần số alen theo kích thước quần thể Ne và giá trị thích nghi w',
    formula: '\\Delta p = \\frac{p q [p(w_{AA}-w_{Aa}) + q(w_{Aa}-w_{aa})]}{\\bar{w}}',
    linkedLessonId: 'bio-12-8',
    defaultParams: { p0: 0.5, popSizeNe: 200, fitnessAdv: 0.15 },
    paramBounds: {
      p0: { min: 0.1, max: 0.9, step: 0.05, unit: '', label: 'Tần số alen ban đầu p₀' },
      popSizeNe: { min: 20, max: 1000, step: 20, unit: 'cá thể', label: 'Kích thước hiệu quả Ne' },
      fitnessAdv: { min: -0.3, max: 0.4, step: 0.05, unit: '', label: 'Ưu thế thích nghi s' }
    },
    presets: [
      { label: 'Phiêu bạt mạnh (Ne = 20)', description: 'Tần số dao động ngẫu nhiên mạnh dễ cố định/mất alen', params: { p0: 0.5, popSizeNe: 20, fitnessAdv: 0 } },
      { label: 'Chọn lọc định hướng (s = 0,2)', description: 'Alen có lợi tăng nhanh đến p → 1', params: { p0: 0.2, popSizeNe: 500, fitnessAdv: 0.2 } }
    ]
  },
  {
    id: 'plant_transpiration_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Trao đổi Nước ở Thực vật: Mạch gỗ & Khí khổng',
    subtitle: 'Áp suất rễ, lực hút thoát hơi nước qua lá và đóng mở tế bào hình hạt đậu',
    formula: 'T_{\\text{thoát hơi}} \\propto (\\Psi_{\\text{lá}} - \\Psi_{\\text{kk}}) \\cdot g_{\\text{khí khổng}}',
    linkedLessonId: 'bio-11-2',
    defaultParams: { humidityPct: 55, windSpeed: 3, soilWater: 80 },
    paramBounds: {
      humidityPct: { min: 15, max: 95, step: 5, unit: '%', label: 'Độ ẩm không khí' },
      windSpeed: { min: 0, max: 12, step: 1, unit: 'm/s', label: 'Tốc độ gió thổi' },
      soilWater: { min: 10, max: 100, step: 5, unit: '%', label: 'Độ ẩm đất' }
    },
    presets: [
      { label: 'Trời nắng gió nhẹ', description: 'Khí khổng mở rộng, dòng mạch gỗ mạnh', params: { humidityPct: 45, windSpeed: 4, soilWater: 85 } }
    ]
  },
  {
    id: 'phytohormone_tropism_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Hoocmôn Thực vật (Auxin IAA) & Hướng sáng',
    subtitle: 'Sự phân bố lại Auxin về phía tối làm tế bào giãn dài bất đối xứng ở bao lá mầm',
    formula: '\\text{Tỉ lệ Auxin (Tối / Sáng)} \\approx 65\\% : 35\\% \\implies \\text{Cong về sáng}',
    linkedLessonId: 'bio-11-3',
    defaultParams: { lightAngle: 45, auxinLevel: 70, intactTip: 1 },
    paramBounds: {
      lightAngle: { min: -75, max: 75, step: 5, unit: '°', label: 'Góc chiếu ánh sáng' },
      auxinLevel: { min: 10, max: 100, step: 5, unit: '%', label: 'Hàm lượng Auxin (IAA)' },
      intactTip: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Còn bao đỉnh sinh trưởng' }
    },
    presets: [
      { label: 'Ánh sáng chiếu xiên 55°', description: 'Ngọn cây uốn rõ về nguồn sáng', params: { lightAngle: 55, auxinLevel: 80, intactTip: 1 } }
    ]
  },
  {
    id: 'cardiac_cycle_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Chu kì Tim, Huyết áp & Điện tâm đồ ECG',
    subtitle: 'Pha co tâm nhĩ (0,1s) → co tâm thất (0,3s) → giãn chung (0,4s) và lưu lượng tim CO',
    formula: 'CO = HR \\times SV \\quad (\\text{mL/phút})',
    linkedLessonId: 'bio-11-4',
    defaultParams: { heartRate: 75, strokeVol: 70, resistance: 1.0 },
    paramBounds: {
      heartRate: { min: 45, max: 180, step: 5, unit: 'nhịp/p', label: 'Nhịp tim HR' },
      strokeVol: { min: 40, max: 120, step: 5, unit: 'mL', label: 'Thể tích tâm thu SV' },
      resistance: { min: 0.6, max: 1.8, step: 0.1, unit: 'TPR', label: 'Sức cản ngoại vi' }
    },
    presets: [
      { label: 'Nghỉ ngơi chuẩn (75 bpm)', description: 'CO ≈ 5,25 L/phút, huyết áp 120/80 mmHg', params: { heartRate: 75, strokeVol: 70, resistance: 1.0 } },
      { label: 'Vận động mạnh (150 bpm)', description: 'Tăng nhịp tim và thể tích nhát bóp', params: { heartRate: 150, strokeVol: 95, resistance: 0.8 } }
    ]
  },
  {
    id: 'bohr_hemoglobin_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Hiệu ứng Bohr & Đường cong Phân li Oxyhemoglobin',
    subtitle: 'Dịch chuyển đường cong khi thay đổi pH máu, nồng độ CO₂ và nhiệt độ mô',
    formula: 'Y_{O_2} = \\frac{p_{O_2}^n}{P_{50}^n + p_{O_2}^n},\\quad \\text{Hb}(O_2)_4 + H^+ \\rightleftharpoons \\text{HbH}^+ + 4O_2',
    linkedLessonId: 'bio-11-5',
    defaultParams: { pHBlood: 7.4, pCO2: 40, tempC: 37 },
    paramBounds: {
      pHBlood: { min: 6.9, max: 7.6, step: 0.05, unit: 'pH', label: 'Độ pH máu' },
      pCO2: { min: 20, max: 80, step: 5, unit: 'mmHg', label: 'Phân áp CO₂' },
      tempC: { min: 34, max: 41, step: 0.5, unit: '°C', label: 'Nhiệt độ mô' }
    },
    presets: [
      { label: 'Tại phổi (pH 7,42, thấp CO₂)', description: 'Hb gắn chặt O₂ đạt ~98% bão hòa', params: { pHBlood: 7.45, pCO2: 35, tempC: 37 } },
      { label: 'Cơ bắp chạy nước rút (pH 7,1)', description: 'Hiệu ứng Bohr dịch phải giúp nhả nhiều O₂ cho mô', params: { pHBlood: 7.1, pCO2: 65, tempC: 39.5 } }
    ]
  },
  {
    id: 'nephron_filtration_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Đơn vị Thận Nephron: Siêu lọc, Tái hấp thu & Điều hòa ADH',
    subtitle: 'Áp suất lọc cầu thận GFR và tác động của hormone ADH lên ống góp nước',
    formula: 'P_{\\text{lọc}} = P_{\\text{máu}} - (P_{\\text{keo}} + P_{\\text{nang Bowman}})',
    linkedLessonId: 'bio-11-6',
    defaultParams: { arterialP: 55, adhLevel: 60, saltIntake: 50 },
    paramBounds: {
      arterialP: { min: 35, max: 80, step: 2, unit: 'mmHg', label: 'Áp suất thủy tĩnh cầu thận' },
      adhLevel: { min: 0, max: 100, step: 5, unit: '%', label: 'Nồng độ hormone ADH' },
      saltIntake: { min: 10, max: 100, step: 5, unit: '%', label: 'Lượng Na⁺ nạp vào' }
    },
    presets: [
      { label: 'Mất nước (ADH cao 90%)', description: 'Tái hấp thu nước tối đa, nước tiểu cô đặc', params: { arterialP: 50, adhLevel: 90, saltIntake: 60 } }
    ]
  },
  {
    id: 'action_potential_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Điện thế Hoạt động Neuron & Kênh Na⁺ / K⁺ (Hodgkin–Huxley)',
    subtitle: 'Nghỉ (-70 mV) → Khử cực mở kênh Na⁺ (+35 mV) → Tái phân cực K⁺ → Bơm Na⁺/K⁺',
    formula: 'E_{\\text{ion}} = \\frac{RT}{zF}\\ln\\frac{[\\text{Ion}]_{\\text{ngoài}}}{[\\text{Ion}]_{\\text{trong}}}',
    linkedLessonId: 'bio-11-7',
    defaultParams: { stimulusMv: 25, myelin: 1, tempC: 37 },
    paramBounds: {
      stimulusMv: { min: 5, max: 50, step: 5, unit: 'mV', label: 'Cường độ kích thích' },
      myelin: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Bao Myelin (Nhảy cóc Ranvier)' },
      tempC: { min: 20, max: 42, step: 1, unit: '°C', label: 'Nhiệt độ sợi trục' }
    },
    presets: [
      { label: 'Vượt ngưỡng + Myelin', description: 'Xung thần kinh lan truyền nhảy cóc tới 100 m/s', params: { stimulusMv: 30, myelin: 1, tempC: 37 } },
      { label: 'Kích thích dưới ngưỡng', description: 'Không phát sinh điện thế hoạt động (Tất cả hoặc không)', params: { stimulusMv: 10, myelin: 1, tempC: 37 } }
    ]
  },
  {
    id: 'synapse_transmission_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Truyền tin qua Xináp Hóa học (Ca²⁺ & Acetylcholine)',
    subtitle: 'Dòng Ca²⁺ tràn vào chùy xináp làm vỡ bóng chất trung gian gắn thụ thể màng sau',
    formula: '\\text{Xung điện} \\to \\text{Ca}^{2+}_{\\text{vào}} \\to \\text{ACh} \\to \\text{Thụ thể Na}^+\\text{ màng sau}',
    linkedLessonId: 'bio-11-8',
    defaultParams: { frequencyHz: 40, caExt: 80, enzymeBlock: 0 },
    paramBounds: {
      frequencyHz: { min: 10, max: 100, step: 5, unit: 'Hz', label: 'Tần số xung trước xináp' },
      caExt: { min: 10, max: 100, step: 5, unit: '%', label: 'Nồng độ Ca²⁺ dịch kẽ' },
      enzymeBlock: { min: 0, max: 1, step: 1, unit: '0/1', label: 'Ức chế Acetylcholinesterase' }
    },
    presets: [
      { label: 'Xináp hoạt động bình thường', description: 'Truyền một chiều liên tục chính xác', params: { frequencyHz: 45, caExt: 85, enzymeBlock: 0 } }
    ]
  },
  {
    id: 'glucose_insulin_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Cân bằng Nội môi Đường huyết (Insulin – Glucagon)',
    subtitle: 'Phản hồi âm duy trì Glucose máu quanh ~90 mg/dL qua gan và tế bào đảo tụy',
    formula: '\\text{Glucose}\\uparrow \\implies \\beta\\text{-tụy tiết Insulin} \\implies \\text{Glycogen gan}\\uparrow',
    linkedLessonId: 'bio-11-9',
    defaultParams: { mealCarb: 60, insulinSens: 85, exercise: 20 },
    paramBounds: {
      mealCarb: { min: 0, max: 100, step: 5, unit: 'g', label: 'Lượng tinh bột bữa ăn' },
      insulinSens: { min: 20, max: 100, step: 5, unit: '%', label: 'Độ nhạy Insulin tế bào' },
      exercise: { min: 0, max: 100, step: 5, unit: '%', label: 'Mức độ vận động cơ bắp' }
    },
    presets: [
      { label: 'Người khỏe mạnh sau bữa ăn', description: 'Insulin đưa đường huyết về ổn định sau ~2h', params: { mealCarb: 70, insulinSens: 95, exercise: 20 } },
      { label: 'Kháng Insulin (Tiểu đường tuýp 2)', description: 'Đường huyết duy trì cao kéo dài', params: { mealCarb: 70, insulinSens: 25, exercise: 10 } }
    ]
  },
  {
    id: 'immune_antibody_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 11'],
    title: 'Đáp ứng Miễn dịch Nguyên phát – Thứ phát & Tế bào Nhớ',
    subtitle: 'So sánh nồng độ kháng thể IgM/IgG sau mũi tiêm Vắc-xin 1 và mũi nhắc lại',
    formula: '\\text{Lần 2 (Tế bào nhớ B)}: \\quad t_{\\text{đáp ứng}}\\downarrow\\ \\text{và}\\ [\\text{IgG}]\\uparrow\\uparrow',
    linkedLessonId: 'bio-11-10',
    defaultParams: { antigenLoad: 50, boosterDay: 28, memoryEfficiency: 85 },
    paramBounds: {
      antigenLoad: { min: 20, max: 100, step: 10, unit: '%', label: 'Lượng kháng nguyên / vắc-xin' },
      boosterDay: { min: 14, max: 45, step: 1, unit: 'ngày', label: 'Thời điểm tiêm mũi 2' },
      memoryEfficiency: { min: 40, max: 100, step: 5, unit: '%', label: 'Hiệu lực tế bào nhớ B' }
    },
    presets: [
      { label: 'Tiêm nhắc lại ngày 28', description: 'Kháng thể IgG vọt tăng gấp 10–50 lần', params: { antigenLoad: 60, boosterDay: 28, memoryEfficiency: 90 } }
    ]
  },
  {
    id: 'predator_prey_2d',
    domainId: 'ecology_biosphere',
    grades: ['Lớp 12'],
    title: 'Quan hệ Vật ăn thịt – Con mồi (Lotka–Volterra)',
    subtitle: 'Dao động chu kì lệch pha giữa số lượng quần thể Thỏ (N) và Cáo (P)',
    formula: '\\frac{dN}{dt} = rN - aNP,\\quad \\frac{dP}{dt} = baNP - mP',
    linkedLessonId: 'bio-12-9',
    defaultParams: { preyGrowth: 1.0, huntRate: 0.4, predatorDeath: 0.5 },
    paramBounds: {
      preyGrowth: { min: 0.4, max: 2.0, step: 0.1, unit: '', label: 'Tốc độ sinh sản con mồi r' },
      huntRate: { min: 0.1, max: 1.0, step: 0.05, unit: '', label: 'Hiệu suất săn mồi a' },
      predatorDeath: { min: 0.2, max: 1.2, step: 0.1, unit: '', label: 'Tỉ lệ tử vong vật ăn thịt m' }
    },
    presets: [
      { label: 'Chu kì cân bằng sinh thái', description: 'Đỉnh vật ăn thịt đi sau đỉnh con mồi', params: { preyGrowth: 1.1, huntRate: 0.4, predatorDeath: 0.5 } }
    ]
  },
  {
    id: 'logistic_population_2d',
    domainId: 'ecology_biosphere',
    grades: ['Lớp 12'],
    title: 'Tăng trưởng Quần thể: Đường cong J vs Chữ S (Sức chứa K)',
    subtitle: 'Điểm uốn K/2 cho tốc độ tăng kích thước quần thể nhanh nhất trong tự nhiên',
    formula: '\\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)',
    linkedLessonId: 'bio-12-10',
    defaultParams: { rMax: 0.8, capacityK: 800, n0: 40 },
    paramBounds: {
      rMax: { min: 0.2, max: 1.8, step: 0.1, unit: '', label: 'Tỉ lệ tăng tự nhiên r' },
      capacityK: { min: 200, max: 1500, step: 50, unit: 'cá thể', label: 'Sức chứa môi trường K' },
      n0: { min: 10, max: 300, step: 10, unit: 'cá thể', label: 'Kích thước ban đầu N₀' }
    },
    presets: [
      { label: 'Chữ S giới hạn bởi K=800', description: 'Tốc độ dN/dt đạt cực đại tại N = 400', params: { rMax: 0.9, capacityK: 800, n0: 40 } }
    ]
  },
  {
    id: 'trophic_pyramid_2d',
    domainId: 'ecology_biosphere',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Chuỗi – Lưới Thức ăn & Tháp Năng lượng Sinh thái (Quy luật 10%)',
    subtitle: 'Hiệu suất sinh thái truyền năng lượng qua các bậc dinh dưỡng (~10% mỗi bậc)',
    formula: 'E_{n} = E_1 \\cdot H^{n-1} \\quad (H \\approx 10\\%)',
    linkedLessonId: 'bio-12-11',
    defaultParams: { primaryKcal: 10000, efficiencyPct: 10, levels: 4 },
    paramBounds: {
      primaryKcal: { min: 2000, max: 20000, step: 1000, unit: 'kcal', label: 'Sản lượng sinh vật sản xuất' },
      efficiencyPct: { min: 5, max: 20, step: 1, unit: '%', label: 'Hiệu suất sinh thái H' },
      levels: { min: 3, max: 5, step: 1, unit: 'bậc', label: 'Số bậc dinh dưỡng' }
    },
    presets: [
      { label: 'Chuẩn tự nhiên (H = 10%)', description: '10.000 → 1.000 → 100 → 10 kcal', params: { primaryKcal: 10000, efficiencyPct: 10, levels: 4 } }
    ]
  },
  {
    id: 'carbon_nitrogen_cycle_2d',
    domainId: 'ecology_biosphere',
    grades: ['Lớp 12'],
    title: 'Chu trình Sinh địa hóa Cacbon & Nitơ (Cố định Đạm)',
    subtitle: 'Cân bằng quang hợp – hô hấp – đốt nhiên liệu hóa thạch và vi khuẩn Rhizobium',
    formula: '\\text{N}_2 \\xrightarrow{\\text{Nitrogenase}} \\text{NH}_4^+ \\xrightarrow{\\text{Nitrat hóa}} \\text{NO}_3^-',
    linkedLessonId: 'bio-12-12',
    defaultParams: { forestCover: 60, fossilFuel: 45, nFixation: 65 },
    paramBounds: {
      forestCover: { min: 10, max: 100, step: 5, unit: '%', label: 'Độ che phủ rừng hấp thụ CO₂' },
      fossilFuel: { min: 10, max: 100, step: 5, unit: '%', label: 'Phát thải đốt hóa thạch' },
      nFixation: { min: 20, max: 100, step: 5, unit: '%', label: 'Hoạt tính vi khuẩn cố định đạm' }
    },
    presets: [
      { label: 'Cân bằng Xanh (Rừng 85%)', description: 'CO₂ khí quyển ổn định bền vững', params: { forestCover: 85, fossilFuel: 25, nFixation: 75 } }
    ]
  },
  {
    id: 'viral_lytic_cycle_2d',
    domainId: 'cell_membrane',
    grades: ['Lớp 10'],
    title: 'Chu trình Nhân lên của Virus (Sinh tan vs Tiềm tan)',
    subtitle: '5 giai đoạn: Hấp phụ → Xâm nhập → Sinh tổng hợp → Lắp ráp → Phóng thích',
    formula: '\\text{1 Phage} \\xrightarrow{25\\text{ phút}} 100\\text{--}200\\text{ Phage mới}',
    linkedLessonId: 'bio-10-7',
    defaultParams: { isLysogenic: 0, burstSize: 120, tempC: 37 },
    paramBounds: {
      isLysogenic: { min: 0, max: 1, step: 1, unit: '0/1', label: '0: Chu trình tan | 1: Tiềm tan' },
      burstSize: { min: 40, max: 200, step: 10, unit: 'virion', label: 'Số virus phóng thích mỗi chu kì' },
      tempC: { min: 20, max: 42, step: 1, unit: '°C', label: 'Nhiệt độ vật chủ' }
    },
    presets: [
      { label: 'Phage T4 Sinh tan', description: 'Phá vỡ tế bào vi khuẩn E. coli sau ~25 phút', params: { isLysogenic: 0, burstSize: 150, tempC: 37 } }
    ]
  },
  {
    id: 'pcr_electrophoresis_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 12'],
    title: 'Khuếch đại PCR (2ⁿ bản sao) & Điện di Gel Agarose',
    subtitle: '3 bước nhiệt: Biến tính 94°C – Gắn mồi 55°C – Kéo dài Taq 72°C và phân tách theo kích thước bp',
    formula: 'N_{\\text{bản sao}} = N_0 \\cdot 2^n,\\quad \\mu_{\\text{điện di}} \\propto \\frac{1}{\\log_{10}(\\text{bp})}',
    linkedLessonId: 'bio-2006-12-3',
    defaultParams: { pcrCycles: 25, annealTemp: 56, targetBp: 600 },
    paramBounds: {
      pcrCycles: { min: 1, max: 35, step: 1, unit: 'chu kì', label: 'Số chu kì nhiệt n' },
      annealTemp: { min: 45, max: 68, step: 1, unit: '°C', label: 'Nhiệt độ gắn mồi' },
      targetBp: { min: 150, max: 1500, step: 50, unit: 'bp', label: 'Kích thước băng DNA đích' }
    },
    presets: [
      { label: '30 chu kì PCR (>1 tỉ bản sao)', description: 'Khuếch đại rõ nét trên điện di', params: { pcrCycles: 30, annealTemp: 56, targetBp: 500 } }
    ]
  },
  {
    id: 'blood_typing_2d',
    domainId: 'evolution_population',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Hệ Nhóm máu ABO (Đa alen I^A, I^B, i) & Ngưng kết Kháng thể',
    subtitle: 'Kiểm tra phản ứng ngưng kết khi nhỏ huyết thanh Anti-A, Anti-B, Anti-D và truyền máu',
    formula: 'I^A = I^B > i,\\quad p_{I^A} + q_{I^B} + r_i = 1',
    linkedLessonId: 'bio-chuyen-12-2',
    defaultParams: { donorType: 0, recipientType: 3, pA: 0.25 },
    paramBounds: {
      donorType: { min: 0, max: 3, step: 1, unit: '0:O 1:A 2:B 3:AB', label: 'Nhóm máu người cho' },
      recipientType: { min: 0, max: 3, step: 1, unit: '0:O 1:A 2:B 3:AB', label: 'Nhóm máu người nhận' },
      pA: { min: 0.1, max: 0.5, step: 0.05, unit: '', label: 'Tần số alen I^A quần thể' }
    },
    presets: [
      { label: 'Người cho O → Nhận AB (An toàn)', description: 'Hồng cầu O không mang kháng nguyên A, B', params: { donorType: 0, recipientType: 3, pA: 0.25 } }
    ]
  },
  {
    id: 'pedigree_genetics_2d',
    domainId: 'genetics_molecular',
    grades: ['Lớp 9', 'Lớp 12'],
    title: 'Phân Tích Phả Hệ Di Truyền Người & Xác Suất Sinh Con (Bayes)',
    subtitle: 'Sơ đồ phả hệ 3–4 thế hệ phân biệt bệnh gen lặn NST thường, gen trội và gen lặn liên kết NST giới tính X',
    formula: 'P(\\text{bệnh}) = P(\\text{bố mang}) \\times P(\\text{mẹ mang}) \\times \\frac{1}{4}',
    linkedLessonId: 'bio-9-5',
    defaultParams: { inheritanceMode: 1, marriageType: 2, carrierProbPct: 67 },
    paramBounds: {
      inheritanceMode: { min: 1, max: 3, step: 1, unit: '', label: 'Quy luật (1:Lặn NST thường 2:Trội thường 3:Liên kết X)' },
      marriageType: { min: 1, max: 3, step: 1, unit: '', label: 'Cặp hôn nhân III (1:Bình thường×Bình thường 2:Lành×Bệnh 3:Đều mang)' },
      carrierProbPct: { min: 10, max: 100, step: 5, unit: '%', label: 'Xác suất dị hợp trong họ' }
    },
    presets: [
      { label: 'Gen lặn NST thường (Bố mẹ lành sinh con bệnh)', description: 'Dấu hiệu nhận biết kinh điển: bố mẹ bình thường sinh con gái bị bệnh', params: { inheritanceMode: 1, marriageType: 1, carrierProbPct: 67 } },
      { label: 'Bệnh máu khó đông liên kết NST X', description: 'Di truyền chéo từ ông ngoại qua mẹ sang cháu trai', params: { inheritanceMode: 3, marriageType: 2, carrierProbPct: 50 } }
    ]
  },
  {
    id: 'microscope_cell_compare_2d',
    domainId: 'cell_membrane',
    grades: ['Lớp 6', 'Lớp 10'],
    title: 'Kính Hiển Vi Quang Học & So Sánh Tế Bào Nhân Sơ – Thực Vật – Động Vật',
    subtitle: 'Xoay mâm vật kính (4×, 10×, 40×), vặn ốc vi cấp lấy nét mẫu vật và đối chiếu cấu trúc vi khuẩn – tế bào hành tây – tế bào niêm mạc',
    formula: '\\text{Độ phóng đại} = \\text{Thị kính} \\times \\text{Vật kính} \\quad|\\quad \\text{Tế bào} \\to \\text{Mô} \\to \\text{Cơ quan}',
    linkedLessonId: 'bio-6-b1',
    defaultParams: { cellMode: 2, objectiveX: 40, focusOffset: 0 },
    paramBounds: {
      cellMode: { min: 1, max: 3, step: 1, unit: '', label: 'Mẫu soi (1:Vi khuẩn Nhân sơ 2:Tế bào Thực vật 3:Tế bào Động vật)' },
      objectiveX: { min: 10, max: 100, step: 10, unit: '×', label: 'Vật kính (thị kính 10×)' },
      focusOffset: { min: -5, max: 5, step: 1, unit: 'vạch', label: 'Ốc vi cấp chỉnh nét (0 = nét nhất)' }
    },
    presets: [
      { label: 'Soi Tế bào Thực vật 400× (Nét chuẩn)', description: 'Thấy rõ thành xenlulozơ lục giác và lục lạp xanh', params: { cellMode: 2, objectiveX: 40, focusOffset: 0 } },
      { label: 'Vi khuẩn Nhân sơ (Không có nhân thật)', description: 'Chỉ có vùng nhân và thành tế bào đơn giản', params: { cellMode: 1, objectiveX: 100, focusOffset: 0 } }
    ]
  },
  {
    id: 'plant_organs_flowering_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 6', 'Lớp 7'],
    title: 'Cơ Quan Thực Vật (Rễ – Thân – Lá) & Hoa – Thụ Phấn – Kết Quả Tạo Hạt',
    subtitle: 'Quan sát lông hút rễ hút nước, ống mạch gỗ/rây ở thân, quá trình hạt phấn rơi đầu nhụy nảy ống phấn thụ tinh biến bầu nhụy thành quả',
    formula: '\\text{Bầu nhụy} \\xrightarrow{\\text{Thụ tinh}} \\text{Quả} \\quad|\\quad \\text{Noãn} \\xrightarrow{\\text{Thụ tinh}} \\text{Hạt}',
    linkedLessonId: 'bio-2006-6-1',
    defaultParams: { stageId: 1, waterLevel: 70, pollinationPct: 65 },
    paramBounds: {
      stageId: { min: 1, max: 3, step: 1, unit: '', label: 'Cơ quan (1:Rễ-Thân-Lá 2:Hoa thụ phấn-thụ tinh 3:Quả & Hạt nảy mầm)' },
      waterLevel: { min: 10, max: 100, step: 10, unit: '%', label: 'Độ ẩm đất / Nhựa cây' },
      pollinationPct: { min: 0, max: 100, step: 5, unit: '%', label: 'Tiến trình thụ phấn – tạo quả' }
    },
    presets: [
      { label: '1. Lông hút rễ & Mạch dẫn thân cây', description: 'Nước đi lên theo mạch gỗ, đường đi xuống theo mạch rây', params: { stageId: 1, waterLevel: 80, pollinationPct: 40 } },
      { label: '2. Hoa lưỡng tính thụ phấn & Thụ tinh', description: 'Ống phấn mọc dài xuống bầu nhụy gặp noãn', params: { stageId: 2, waterLevel: 70, pollinationPct: 80 } },
      { label: '3. Hình thành Quả thịt & Nảy mầm', description: 'Đủ nước + O₂ + nhiệt độ ấm hạt sẽ nảy mầm', params: { stageId: 3, waterLevel: 85, pollinationPct: 100 } }
    ]
  },
  {
    id: 'vertebrate_taxonomy_2d',
    domainId: 'evolution_population',
    grades: ['Lớp 6', 'Lớp 7'],
    title: 'Phân Loại 5 Giới, Khóa Lưỡng Phân & Tiến Hóa Tim (Cá 2 Ngăn → Ếch 3 Ngăn → Chim/Thú 4 Ngăn)',
    subtitle: 'Đối chiếu 5 lớp Động vật có xương sống và sơ đồ tuần hoàn máu pha vs máu không pha từ Cá đến Thú',
    formula: '\\text{Cá (2 ngăn)} \\to \\text{Lưỡng cư/Bò sát (3 ngăn)} \\to \\text{Chim & Thú (4 ngăn)}',
    linkedLessonId: 'bio-2006-7-1',
    defaultParams: { animalClass: 2, viewMode: 1, oxygenDemand: 60 },
    paramBounds: {
      animalClass: { min: 1, max: 4, step: 1, unit: '', label: 'Nhóm (1:Cá 2:Ếch/Lưỡng cư 3:Thằn lằn/Bò sát 4:Chim & Thú)' },
      viewMode: { min: 1, max: 2, step: 1, unit: '', label: 'Hiển thị (1:Tiến hóa Tim & Tuần hoàn 2:Khóa lưỡng phân 5 Giới)' },
      oxygenDemand: { min: 20, max: 100, step: 10, unit: '%', label: 'Nhịp hoạt động chuyển hóa' }
    },
    presets: [
      { label: 'Cá chép (Tim 2 ngăn · Biến nhiệt)', description: '1 vòng tuần hoàn, máu chảy qua mang nhận O₂', params: { animalClass: 1, viewMode: 1, oxygenDemand: 40 } },
      { label: 'Ếch đồng (Tim 3 ngăn · Máu pha)', description: '2 vòng tuần hoàn, tâm thất chung nên máu bị pha', params: { animalClass: 2, viewMode: 1, oxygenDemand: 55 } },
      { label: 'Chim & Thú (Tim 4 ngăn · Hằng nhiệt)', description: 'Vách ngăn hoàn chỉnh tách riêng máu đỏ tươi & đỏ thẫm', params: { animalClass: 4, viewMode: 1, oxygenDemand: 85 } }
    ]
  },
  {
    id: 'digestion_enzymes_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 8'],
    title: 'Hệ Tiêu Hóa Người & Enzym (Miệng – Dạ Dày – Ruột Non) & Cơ Quan Thụ Cảm',
    subtitle: 'Theo dõi đường đi thức ăn qua ống tiêu hóa: Amylase biến tinh bột thành đường, Pepsin (pH 2) cắt Protein và vi nhung mao ruột hấp thụ',
    formula: '\\text{Tinh bột} \\xrightarrow{\\text{Amylase}} \\text{Đường đôi} \\quad|\\quad \\text{Protein} \\xrightarrow{\\text{Pepsin + HCl}} \\text{Peptit}',
    linkedLessonId: 'bio-8-b1',
    defaultParams: { organZone: 2, mealFat: 45, chewingTime: 65 },
    paramBounds: {
      organZone: { min: 1, max: 3, step: 1, unit: '', label: 'Chặng tiêu hóa (1:Khoang miệng 2:Dạ dày HCl 3:Ruột non hấp thụ)' },
      mealFat: { min: 10, max: 100, step: 10, unit: '%', label: 'Hàm lượng Lipid/Protein bữa ăn' },
      chewingTime: { min: 10, max: 100, step: 10, unit: '%', label: 'Mức nhai kĩ / Hoạt độ Enzym' }
    },
    presets: [
      { label: '1. Khoang miệng (Amylase · pH ≈ 7)', description: 'Nhai kĩ biến tinh bột cơm thành đường maltose vị ngọt', params: { organZone: 1, mealFat: 30, chewingTime: 85 } },
      { label: '2. Dạ dày (Acid HCl pH 2 + Pepsin)', description: 'Co bóp nhào trộn và phân giải sơ bộ chuỗi Protein', params: { organZone: 2, mealFat: 55, chewingTime: 70 } },
      { label: '3. Ruột non (Dịch mật + Tụy · Lông ruột)', description: 'Tiêu hóa triệt để và hấp thụ dinh dưỡng vào máu', params: { organZone: 3, mealFat: 45, chewingTime: 80 } }
    ]
  },
  {
    id: 'kingdoms_invertebrates_2d',
    domainId: 'evolution_population',
    grades: ['Lớp 6', 'Lớp 7'],
    title: '5 Giới Sinh Vật, Khóa Lưỡng Phân & Động Vật Không Xương Sống',
    subtitle: 'So sánh 5 giới Whittaker, thực hành khóa lưỡng phân và giải phẫu hình thái Ruột khoang – Giun – Thân mềm – Chân khớp',
    formula: '\\text{Giới} \\to \\text{Ngành} \\to \\text{Lớp} \\to \\text{Bộ} \\to \\text{Họ} \\to \\text{Chi} \\to \\text{Loài}',
    linkedLessonId: 'bio-6-b3',
    defaultParams: { invertebrateGroup: 4, viewMode: 1, envMoisture: 75 },
    paramBounds: {
      invertebrateGroup: { min: 1, max: 4, step: 1, unit: '', label: 'Ngành (1:Ruột khoang 2:Giun 3:Thân mềm 4:Chân khớp)' },
      viewMode: { min: 1, max: 2, step: 1, unit: '', label: 'Chế độ (1:Hình thái 4 Ngành 2:5 Giới & Khóa Lưỡng phân)' },
      envMoisture: { min: 20, max: 100, step: 10, unit: '%', label: 'Độ ẩm môi trường sống' }
    },
    presets: [
      { label: '5 Giới & Khóa lưỡng phân', description: 'Phân biệt nhanh các ngành theo đặc điểm đối lập', params: { invertebrateGroup: 4, viewMode: 2, envMoisture: 75 } },
      { label: 'Ngành Chân khớp (Kitin)', description: 'Tôm, Nhện, Châu chấu chiếm 80% số loài động vật', params: { invertebrateGroup: 4, viewMode: 1, envMoisture: 70 } },
      { label: 'Ngành Giun đất & Ruột khoang', description: 'Quan sát phân đốt, hô hấp qua da và tế bào gai', params: { invertebrateGroup: 2, viewMode: 1, envMoisture: 90 } }
    ]
  },
  {
    id: 'human_skeleton_senses_2d',
    domainId: 'physiology_organism',
    grades: ['Lớp 8'],
    title: 'Hệ Vận Động (Xương – Khớp – Cơ) & Giác Quan (Mắt – Tai)',
    subtitle: 'Phân tích đòn bẩy cơ nhị đầu/tam đầu ở tay, tật cận thị/viễn thị của thủy tinh thể và đường truyền âm qua màng nhĩ – ốc tai',
    formula: '\\text{Cơ co} \\to \\text{Kéo xương quanh khớp} \\quad|\\quad \\text{Cận thị (Kính }-) \\quad \\text{Viễn thị (Kính }+)',
    linkedLessonId: 'bio-8-b1',
    defaultParams: { organMode: 1, stimulusLevel: 65, lensCorrection: 0 },
    paramBounds: {
      organMode: { min: 1, max: 3, step: 1, unit: '', label: 'Cơ quan (1:Vận động Xương-Cơ 2:Mắt & Tật khúc xạ 3:Tai & Thính giác)' },
      stimulusLevel: { min: 10, max: 100, step: 5, unit: '%', label: 'Cường độ co cơ / Độ khúc xạ / Âm lượng' },
      lensCorrection: { min: -3, max: 3, step: 1, unit: 'dp', label: 'Kính điều chỉnh (- Phân kì | + Hội tụ)' }
    },
    presets: [
      { label: '1. Đòn bẩy Cơ nhị đầu – Tam đầu', description: 'Gấp duỗi cẳng tay quanh khớp khuỷu', params: { organMode: 1, stimulusLevel: 75, lensCorrection: 0 } },
      { label: '2. Tật Cận thị & Đeo kính phân kì', description: 'Sửa ảnh hội tụ trước võng mạc về đúng điểm vàng', params: { organMode: 2, stimulusLevel: 85, lensCorrection: -2 } },
      { label: '3. Màng nhĩ → Chuỗi xương tai → Ốc tai', description: 'Khuếch đại rung động âm thanh vào dịch ốc tai', params: { organMode: 3, stimulusLevel: 60, lensCorrection: 0 } }
    ]
  },
  {
    id: 'biomolecules_2d',
    domainId: 'cell_membrane',
    grades: ['Lớp 10'],
    title: 'Nước & 4 Đại Phân Tử Sinh Học (Carbohydrate – Lipid – Protein – Nucleic Acid)',
    subtitle: 'Khảo sát mạng liên kết hiđrô của H₂O, vòng đường Glucose, Phospholipid lưỡng cực, 4 bậc cấu trúc Protein & biến tính nhiệt',
    formula: '\\text{H}_2\\text{O (Liên kết H)} \\cdot \\text{Protein (Bậc 1} \\to \\text{4)} \\cdot \\text{DNA/RNA}',
    linkedLessonId: 'bio-10-1',
    defaultParams: { moleculeTab: 1, tempC: 37, polymerLen: 5 },
    paramBounds: {
      moleculeTab: { min: 1, max: 5, step: 1, unit: '', label: 'Phân tử (1:Nước H₂O 2:Glucozơ 3:Phospholipid 4:Protein 4 bậc 5:DNA/RNA)' },
      tempC: { min: 0, max: 95, step: 5, unit: '°C', label: 'Nhiệt độ môi trường' },
      polymerLen: { min: 3, max: 8, step: 1, unit: 'đơn phân', label: 'Số đơn phân mạch' }
    },
    presets: [
      { label: '1. Phân tử Nước H₂O & Liên kết Hiđrô', description: 'Đóng băng (0°C) tạo mạng thưa nổi trên nước, đun nóng đứt dần liên kết H', params: { moleculeTab: 1, tempC: 20, polymerLen: 5 } },
      { label: '3. Phospholipid lưỡng cực tạo lớp kép', description: 'Đầu photphat ưa nước hướng ra ngoài, đuôi axit béo kị nước quay vào trong', params: { moleculeTab: 3, tempC: 37, polymerLen: 5 } },
      { label: '4. Protein 4 bậc & Biến tính ở 75°C', description: 'Nhiệt cao phá vỡ liên kết yếu bậc 3/4 làm chuỗi duỗi mất chức năng', params: { moleculeTab: 4, tempC: 75, polymerLen: 6 } }
    ]
  }
];

export const BIOLOGY_3D_SIMS: Biology3DSimSpec[] = [
  { id: 'human_anatomy_3d', domainId: 'physiology_organism', grades: ['Lớp 8', 'Lớp 11'], title: 'Giải Phẫu Cơ Thể Người 3D (8 Hệ Cơ Quan)', subtitle: 'Bật/tắt 8 hệ (Xương, Cơ, Tuần hoàn, Hô hấp, Tiêu hóa, Thần kinh, Tiết niệu, Nội tiết), chỉnh độ mờ da/cơ/xương & chọn cơ quan', formula: '\\text{8 Hệ Cơ Quan} \\leftrightarrow \\text{Cân bằng Nội môi}', linkedLessonId: 'bio-8-b1' },
  { id: 'eukaryotic_cell_3d', domainId: 'cell_membrane', grades: ['Lớp 10'], title: 'Tế bào Nhân thực 3D (Nhân – RER – Golgi – Ti thể)', subtitle: 'Quan sát cấu trúc cắt lớp các bào quan và hệ thống màng nội bào', formula: '\\text{Nhân} \\to \\text{Lưới nội chất} \\to \\text{Golgi}', linkedLessonId: 'bio-10-2' },
  { id: 'mitochondria_atp_3d', domainId: 'metabolism_enzyme', grades: ['Lớp 10'], title: 'Ti thể 3D & Động cơ ATP Synthase', subtitle: 'Mào trong ti thể (Cristae), chu trình Krebs và dòng proton H⁺', formula: '\\text{ADP} + P_i \\xrightarrow{\\text{ATP Synthase}} \\text{ATP}', linkedLessonId: 'bio-10-5' },
  { id: 'chloroplast_thylakoid_3d', domainId: 'metabolism_enzyme', grades: ['Lớp 10', 'Lớp 11'], title: 'Lục lạp 3D & Đĩa Thylakoid (Grana)', subtitle: 'Quang hệ PSII/PSI trên màng thylakoid và chất nền Stroma', formula: '2\\text{H}_2\\text{O} \\to 4\\text{H}^+ + 4e^- + \\text{O}_2', linkedLessonId: 'bio-11-1' },
  { id: 'phospholipid_bilayer_3d', domainId: 'cell_membrane', grades: ['Lớp 10'], title: 'Mô hình Khảm lỏng Màng Sinh chất 3D', subtitle: 'Lớp kép Phospholipid, kênh Protein xuyên màng và Cholesterol', formula: '\\text{Đầu ưa nước} \\mid \\text{Đuôi kị nước}', linkedLessonId: 'bio-10-3' },
  { id: 'dna_double_helix_3d', domainId: 'genetics_molecular', grades: ['Lớp 9', 'Lớp 12'], title: 'Xoắn kép DNA 3D (A–T, G–C) & Phiên mã RNA', subtitle: 'Chu kì xoắn 3,4 nm (10 cặp nu), đường kính 2 nm, rãnh lớn/nhỏ và Helicase', formula: 'L = \\frac{N}{2} \\times 3{,}4\\text{ Å}', linkedLessonId: 'bio-12-1' },
  { id: 'ribosome_translation_3d', domainId: 'genetics_molecular', grades: ['Lớp 12'], title: 'Ribosome 3D đang Dịch mã mRNA', subtitle: 'Tiểu phần lớn/bé kẹp mRNA và tRNA lắp ghép liên kết peptit', formula: '\\text{mRNA } 5\'\\to 3\' \\implies \\text{Polypeptide } N \\to C', linkedLessonId: 'bio-12-2' },
  { id: 'chromosome_mitosis_3d', domainId: 'cell_membrane', grades: ['Lớp 9', 'Lớp 10'], title: 'Nhiễm sắc thể Kép & Thoi Phân bào 3D', subtitle: 'Hai cromatit gắn tâm động, trung thể và sợi tơ vô sắc', formula: '2n\\text{ NST kép} \\xrightarrow{\\text{Kì sau}} 4n\\text{ NST đơn}', linkedLessonId: 'bio-10-6' },
  { id: 'enzyme_substrate_3d', domainId: 'metabolism_enzyme', grades: ['Lớp 10'], title: 'Mô hình Chìa khóa – Ổ khóa & Khớp cảm ứng Enzyme 3D', subtitle: 'Trung tâm hoạt động gắn cơ chất và biến đổi cấu hình không gian', formula: 'E + S \\rightleftharpoons ES \\to E + P', linkedLessonId: 'bio-10-4' },
  { id: 'neuron_synapse_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Neuron & Khe Xináp Thần kinh 3D', subtitle: 'Bao Myelin, eo Ranvier, bóng chứa chất trung gian hóa học', formula: 'v_{\\text{nhảy cóc}} \\gg v_{\\text{không myelin}}', linkedLessonId: 'bio-11-7' },
  { id: 'human_heart_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Tim Người 4 Ngăn & Van Tim 3D', subtitle: 'Vòng tuần hoàn lớn/nhỏ, tâm nhĩ – tâm thất và động mạch chủ', formula: 'CO = HR \\times SV', linkedLessonId: 'bio-11-4' },
  { id: 'human_brain_3d', domainId: 'physiology_organism', grades: ['Lớp 8', 'Lớp 11'], title: 'Giải Phẫu Não Bộ Người 3D (4 Thùy – Tiểu não – Thân não)', subtitle: 'Khám phá hồi não vỏ đại não, tiểu não lá xếp và thân não điều hòa sinh tồn', formula: '\\text{Đại não} + \\text{Tiểu não} + \\text{Thân não}', linkedLessonId: 'bio-11-7' },
  { id: 'liver_digestive_3d', domainId: 'physiology_organism', grades: ['Lớp 8', 'Lớp 11'], title: 'Gan – Túi mật – Dạ dày & Hệ Ruột Người 3D', subtitle: 'Giải phẫu 3D gan hai thùy, dạ dày chữ J, ruột non và khung đại tràng', formula: '\\text{Dịch mật} + \\text{Pepsin/HCl} \\to \\text{Hấp thụ}', linkedLessonId: 'bio-8-b1' },
  { id: 'alveoli_capillary_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Phế nang & Mao mạch Trao đổi Khí 3D', subtitle: 'Khuếch tán O₂ vào hồng cầu và thải CO₂ theo chênh lệch phân áp', formula: 'p_{O_2\\text{ phế nang}} > p_{O_2\\text{ máu}}', linkedLessonId: 'bio-11-5' },
  { id: 'nephron_kidney_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Thận Cắt Lớp & Đơn vị Lọc Nephron 3D', subtitle: 'Thận bổ dọc (vỏ – tháp tủy – bể thận) và cơ chế lọc máu – cô đặc nước tiểu', formula: 'GFR \\approx 125\\text{ mL/phút}', linkedLessonId: 'bio-11-6' },
  { id: 'antibody_antigen_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Kháng thể Chữ Y (IgG) Bắt Kháng nguyên 3D', subtitle: 'Vùng Fab đặc hiệu khóa kháng nguyên và đại thực bào thực bào', formula: '\\text{Ag} + \\text{Ab} \\to \\text{Phức hợp miễn dịch}', linkedLessonId: 'bio-11-10' },
  { id: 'bacteria_prokaryote_3d', domainId: 'cell_membrane', grades: ['Lớp 10'], title: 'Vi khuẩn Nhân sơ 3D (Vỏ nhầy – DNA vòng – Roi xoắn)', subtitle: 'Cắt lớp thành Peptidoglycan, vùng nhân, Plasmid, Ribosome 70S & Pili', formula: '\\text{DNA vòng} + \\text{Plasmid} + 70\\text{S}', linkedLessonId: 'bio-10-2' },
  { id: 'virus_bacteriophage_3d', domainId: 'cell_membrane', grades: ['Lớp 10'], title: 'Virus: Thực khuẩn thể T4 & Virus có Vỏ bọc 3D', subtitle: 'Đầu 20 mặt chứa DNA, bao đuôi co bóp và chế độ đối chiếu Virus gai S', formula: '\\text{Capsid} + \\text{Nucleic acid}', linkedLessonId: 'bio-10-7' },
  { id: 'fungi_microorganisms_3d', domainId: 'evolution_population', grades: ['Lớp 6', 'Lớp 10'], title: 'Nấm Sợi (Quả thể – Mycelium) & Vi sinh vật Đơn bào 3D', subtitle: 'Đối chiếu cấu tạo quả thể nấm đảm, mạng sợi nấm và Trùng giày Paramecium', formula: '\\text{Sợi nấm (Kitin)} \\quad|\\quad \\text{Nguyên sinh vật}', linkedLessonId: 'bio-6-b3' },
  { id: 'plant_vascular_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Rễ – Thân – Lá & Mạch gỗ (Xylem) / Mạch rây (Phloem) 3D', subtitle: 'Dòng đi lên nước–ion khoáng và dòng đi xuống đường saccarôzơ', formula: '\\text{Áp suất rễ} + \\text{Thoát hơi nước} + \\text{Lực liên kết}', linkedLessonId: 'bio-11-2' },
  { id: 'plant_leaf_transpiration_3d', domainId: 'metabolism_enzyme', grades: ['Lớp 11'], title: 'Giải phẫu Lá, Mô giậu & Khí khổng Thoát hơi nước 3D', subtitle: 'Mặt cắt lớp biểu bì – mô giậu – mô khuyết – bó gân lá và cặp tế bào hạt đậu', formula: '\\text{Trương nước} \\to \\text{Mở Khí khổng} \\to \\text{CO}_2\\downarrow\\text{ H}_2\\text{O}\\uparrow', linkedLessonId: 'bio-11-1' },
  { id: 'ecosystem_biome_3d', domainId: 'ecology_biosphere', grades: ['Lớp 12'], title: 'Sa bàn Hệ Sinh thái, Chuỗi–Lưới Thức ăn & Tháp Năng lượng 3D', subtitle: 'Sinh vật sản xuất, tiêu thụ bậc 1–2–3, phân giải và dòng năng lượng 10%', formula: 'E_{n+1} / E_n \\approx 0{,}1', linkedLessonId: 'bio-12-11' },
  { id: 'mendel_peas_3d', domainId: 'genetics_molecular', grades: ['Lớp 9', 'Lớp 12'], title: 'Thí Nghiệm Đậu Hà Lan Mendel & Bảng Phân Li F₂ 3D', subtitle: 'Cây đậu bố mẹ hoa tím/trắng, hạt phấn thụ phấn chéo, quả đậu mở vỏ hạt Vàng-Trơn/Xanh-Nhăn & tỉ lệ 9:3:3:1', formula: 'F_1 (AaBb \\times AaBb) \\implies 9\\text{A\\_B\\_} : 3\\text{A\\_bb} : 3\\text{aaB\\_} : 1\\text{aabb}', linkedLessonId: 'bio-9-1' },
  { id: 'population_genetics_3d', domainId: 'evolution_population', grades: ['Lớp 9', 'Lớp 12'], title: 'Quần Thể Tiến Hóa, Hardy–Weinberg & Chọn Lọc Tự Nhiên 3D', subtitle: 'Đàn sinh vật mang kiểu gen AA/Aa/aa di chuyển dưới áp lực chọn lọc và hiệu ứng thắt cổ chai', formula: 'p^2 + 2pq + q^2 = 1', linkedLessonId: 'bio-12-5' },
  { id: 'endocrine_pancreas_3d', domainId: 'physiology_organism', grades: ['Lớp 11'], title: 'Tuyến Tụy (Đảo Langerhans) – Thụ Thể Insulin & Điều Hòa Đường Huyết 3D', subtitle: 'Tế bào β tụy tiết hạt Insulin gắn thụ thể màng kích hoạt kênh GLUT4 hấp thu Glucose', formula: '\\text{Insulin } \\to \\text{Kênh GLUT4 mở } \\to \\text{Glucose máu}\\downarrow', linkedLessonId: 'bio-11-16' },
  { id: 'biotech_pcr_crispr_3d', domainId: 'genetics_molecular', grades: ['Lớp 9', 'Lớp 12'], title: 'Máy Luân Nhiệt PCR, Điện Di Gel UV & Phức Hợp CRISPR–Cas9 3D', subtitle: 'Khay điện di gel phát quang UV các băng DNA theo kích thước bp và đầu cắt Cas9–sgRNA chỉnh sửa đoạn gen', formula: 'N_n = N_0 \\cdot 2^n \\quad | \\quad \\text{Cas9 + sgRNA} \\to \\text{Cắt DSB tại PAM}', linkedLessonId: 'bio-12-13' },
  { id: 'gene_linkage_3d', domainId: 'genetics_molecular', grades: ['Lớp 12'], title: 'Cặp NST Tương Đồng Tiếp Hợp & Hoán Vị Gen Chiasmata Morgan 3D', subtitle: 'Hai crômatit khác nguồn gốc trao đổi chéo đoạn DNA tại điểm bắt chéo tạo giao tử hoán vị AB, ab, Ab, aB', formula: 'f_{\\text{hoán vị}} = \\frac{\\text{Giao tử tái tổ hợp}}{\\text{Tổng giao tử}} \\le 50\\%', linkedLessonId: 'bio-12-4' },
  { id: 'plant_flower_seed_3d', domainId: 'physiology_organism', grades: ['Lớp 6', 'Lớp 7'], title: 'Cấu Tạo Hoa Lưỡng Tính, Thụ Tinh & Tạo Quả – Hạt 3D', subtitle: 'Tách lớp Đài hoa, Tràng cánh hoa, Nhị (bao phấn) và Nhụy (bầu chứa noãn) cùng hạt phấn nảy ống phấn thụ tinh', formula: '\\text{Bầu nhụy} \\to \\text{Quả} \\quad|\\quad \\text{Noãn} \\to \\text{Hạt}', linkedLessonId: 'bio-2006-6-1' },
  { id: 'comparative_hearts_3d', domainId: 'evolution_population', grades: ['Lớp 7', 'Lớp 8'], title: 'Tiến Hóa Tim Động Vật Có Xương Sống (2 → 3 → 4 Ngăn) 3D', subtitle: 'Đặt cạnh nhau để so sánh Tim Cá 2 ngăn, Tim Lưỡng cư 3 ngăn (máu pha) và Tim Chim/Thú 4 ngăn hoàn chỉnh', formula: '\\text{2 ngăn (Cá)} \\to \\text{3 ngăn (Ếch)} \\to \\text{4 ngăn (Chim, Thú)}', linkedLessonId: 'bio-2006-7-1' },
  { id: 'digestive_tract_3d', domainId: 'physiology_organism', grades: ['Lớp 8'], title: 'Ống Tiêu Hóa Người (Thực Quản – Dạ Dày – Ruột Non & Lông Ruột) 3D', subtitle: 'Quan sát thức ăn đi qua dạ dày co bóp tiết HCl/Pepsin xuống tá tràng nhận dịch mật và hấp thụ ở vi nhung mao ruột non', formula: '\\text{Tinh bột} \\to \\text{Glucozơ} \\quad|\\quad \\text{Protein} \\to \\text{Axit amin}', linkedLessonId: 'bio-8-b1' },
  { id: 'invertebrate_biodiversity_3d', domainId: 'evolution_population', grades: ['Lớp 6', 'Lớp 7'], title: 'Đa Dạng 4 Ngành Động Vật Không Xương Sống 3D', subtitle: 'Đặt cạnh nhau Thủy tức (Ruột khoang), Giun đất (Giun đốt), Ốc (Thân mềm) và Châu chấu/Tôm (Chân khớp kitin)', formula: '\\text{Ruột khoang} \\to \\text{Giun} \\to \\text{Thân mềm} \\to \\text{Chân khớp}', linkedLessonId: 'bio-6-b3' },
  { id: 'plant_tropism_germination_3d', domainId: 'physiology_organism', grades: ['Lớp 7'], title: 'Hạt Đậu Nảy Mầm, Hướng Sáng (Auxin) & Hướng Trọng Lực 3D', subtitle: 'Xoay góc chiếu ánh sáng mặt trời và điều chỉnh độ ẩm đất để thấy thân uốn về phía sáng, rễ đâm xuống đất', formula: '\\text{Thân: Hướng sáng (+)} \\quad|\\quad \\text{Rễ: Hướng đất (+)}', linkedLessonId: 'bio-7-b5' },
  { id: 'skeleton_senses_3d', domainId: 'physiology_organism', grades: ['Lớp 8'], title: 'Đòn Bẩy Xương–Cơ Tay & Điều Tiết Thủy Tinh Thể Mắt 3D', subtitle: 'Mô phỏng đồng thời khớp khuỷu – cơ nhị đầu co rút nâng cẳng tay và mắt người điều chỉnh tiêu điểm về võng mạc', formula: '\\text{Cơ nhị đầu co} \\to \\text{Gấp khuỷu} \\quad|\\quad \\text{Điểm ảnh đúng võng mạc}', linkedLessonId: 'bio-8-b1' },
  { id: 'biomolecules_3d', domainId: 'cell_membrane', grades: ['Lớp 10'], title: 'Mạng Liên Kết Hiđrô Nước & 4 Đại Phân Tử Sinh Học 3D', subtitle: 'Quan sát cấu trúc không gian tứ diện H₂O, vòng α-Glucozơ, chuỗi Protein bậc 3 biến tính nhiệt & đoạn DNA', formula: '\\text{Bậc 1 (Peptit)} \\to \\text{Bậc 3/4 (Chức năng sinh học)}', linkedLessonId: 'bio-10-1' }
];
