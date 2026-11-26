import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Activity,
  Bone,
  Brain,
  Camera,
  Dna,
  Download,
  Eye,
  HeartPulse,
  Layers,
  Maximize2,
  Microscope,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Tag,
  Wind,
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
  createLeaderArrowLabel,
  GPUParticlePool,
  LeaderArrowLabel,
  updateBillboardLabels,
} from '../../lib/three3DEnhancements';
import { captureCanvasPng, MiniTelemetryChart } from '../common/SimProToolkit';

type AnatomyRealm = 'human' | 'animal';
type LayerKey = 'circulatory' | 'respiratory' | 'nervous' | 'digestive';

type AnatomySystemId =
  | 'human_full_layered'
  | 'human_heart_circulatory'
  | 'human_respiratory'
  | 'human_nervous'
  | 'human_digestive_renal'
  | 'animal_mammal'
  | 'animal_bird'
  | 'animal_amphibian'
  | 'animal_fish';

interface OrganMeta {
  id: string;
  nameVi: string;
  latinName: string;
  colorHex: string;
  roleVi: string;
  histologyVi: string;
  evolutionNoteVi: string;
  explodeDir: [number, number, number];
  anchorPos: [number, number, number];
  labelPos: [number, number, number];
  layerKey?: LayerKey;
}

interface SystemSpec {
  id: AnatomySystemId;
  realm: AnatomyRealm;
  titleVi: string;
  subtitleVi: string;
  badgeVi: string;
  telemetryLabel: string;
  telemetryUnit: string;
  telemetryColor: string;
  telemetryMin: number;
  telemetryMax: number;
  defaultRateLabel: string;
  defaultRateMin: number;
  defaultRateMax: number;
  defaultRateVal: number;
  defaultRateUnit: string;
  summaryVi: string;
  keyFactsVi: string[];
  organs: OrganMeta[];
}

const ANATOMY_SYSTEMS: SystemSpec[] = [
  {
    id: 'human_full_layered',
    realm: 'human',
    titleVi: 'Bản Đồ Cơ Thể Người Đa Lớp',
    subtitleVi: 'Bật/tắt 4 lớp: Tuần hoàn · Hô hấp · Thần kinh · Tiêu hóa',
    badgeVi: 'BẢN ĐỒ ĐA LỚP · SINH LÍ SỐNG',
    telemetryLabel: 'Nhịp Tim & Xung Thần Kinh Đồng Bộ',
    telemetryUnit: 'mV/mmHg',
    telemetryColor: '#f43f5e',
    telemetryMin: -20,
    telemetryMax: 130,
    defaultRateLabel: 'Nhịp Sinh Lí Chung',
    defaultRateMin: 45,
    defaultRateMax: 150,
    defaultRateVal: 72,
    defaultRateUnit: 'bpm',
    summaryVi:
      'Quan sát toàn bộ 4 hệ cơ quan trọng yếu lồng ghép theo đúng vị trí giải phẫu trong thân người. Bật/tắt từng lớp độc lập để thấy sự phối hợp giữa tim bơm máu, phổi thông khí, tủy sống truyền xung và ống tiêu hóa.',
    keyFactsVi: [
      'Tim nằm hơi lệch trái giữa lồng ngực (khoang trung thất giữa), được hai lá phổi ôm sát hai bên.',
      'Trung tâm hành não điều phối đồng thời nhịp tim (dây X & giao cảm) và nhịp hô hấp qua cơ hoành.',
      'Máu giàu dinh dưỡng hấp thụ từ ruột non qua tĩnh mạch cửa về gan trước khi vào vòng tuần hoàn chung.',
    ],
    organs: [
      {
        id: 'layer_nervous_brain_spine',
        layerKey: 'nervous',
        nameVi: 'Lớp Thần Kinh (Não & Tủy Sống)',
        latinName: 'Systema nervosum centrale',
        colorHex: '#facc15',
        roleVi: 'Phát xung điện thế hoạt động điều khiển nhịp tim, nhịp thở, vận động cơ xương và nhu động tiêu hóa.',
        histologyVi: 'Chất xám vỏ não và bó dẫn truyền myelin dọc tủy sống truyền tín hiệu tới 120 m/s.',
        evolutionNoteVi: 'Ống thần kinh lưng tập trung tạo não bộ lớn ở đầu (cephalization).',
        explodeDir: [0, 0.3, -0.95],
        anchorPos: [0, 1.48, -0.05],
        labelPos: [-2.75, 1.68, 0],
      },
      {
        id: 'layer_respiratory_lungs',
        layerKey: 'respiratory',
        nameVi: 'Lớp Hô Hấp (Khí Quản & Hai Phổi)',
        latinName: 'Systema respiratorium',
        colorHex: '#38bdf8',
        roleVi: 'Nhận O₂ từ khí quyển đưa vào máu tại phế nang và thải CO₂ nhờ nhịp hạ cơ hoành.',
        histologyVi: 'Phổi phải 3 thùy, phổi trái 2 thùy bọc màng phổi mỏng.',
        evolutionNoteVi: 'Phế nang tăng diện tích trao đổi khí lên tới ~80 m².',
        explodeDir: [0.95, 0.2, 0.1],
        anchorPos: [0.58, 0.48, 0.05],
        labelPos: [2.75, 1.25, 0.1],
      },
      {
        id: 'layer_circulatory_heart',
        layerKey: 'circulatory',
        nameVi: 'Lớp Tuần Hoàn (Tim & Động Mạch Chủ)',
        latinName: 'Systema cardiovasculare',
        colorHex: '#fb7185',
        roleVi: 'Tim co bóp đẩy máu qua động mạch chủ đi khắp thân và bơm máu tĩnh mạch lên phổi.',
        histologyVi: 'Cơ tim tự nhịp nút SA node đập liên tục ~100.000 lần mỗi ngày.',
        evolutionNoteVi: 'Hệ tuần hoàn kép tách biệt hoàn toàn máu giàu O₂ và nghèo O₂.',
        explodeDir: [-0.85, 0.15, 0.65],
        anchorPos: [0.06, 0.42, 0.32],
        labelPos: [-2.75, 0.35, 0.25],
      },
      {
        id: 'layer_digestive_gut',
        layerKey: 'digestive',
        nameVi: 'Lớp Tiêu Hóa (Gan, Dạ Dày & Ruột)',
        latinName: 'Systema digestorium',
        colorHex: '#fb923c',
        roleVi: 'Tiêu hóa cơ học & hóa học thức ăn thành glucozơ, axit amin, axit béo hấp thụ vào máu.',
        histologyVi: 'Niêm mạc dạ dày tiết HCl/pepsin; ruột non có hàng triệu nhung mao.',
        evolutionNoteVi: 'Phân hóa tuyến tiêu hóa chuyên biệt gan–tụy nối trực tiếp tá tràng.',
        explodeDir: [0.65, -0.55, 0.4],
        anchorPos: [0.05, -0.68, 0.18],
        labelPos: [2.75, -0.78, 0.2],
      },
    ],
  },
  {
    id: 'human_heart_circulatory',
    realm: 'human',
    titleVi: 'Tim 4 Ngăn & Hệ Mạch Lớn',
    subtitleVi: 'Vòng tuần hoàn kép · Van tim & Động mạch chủ',
    badgeVi: 'CƠ THỂ NGƯỜI · TUẦN HOÀN',
    telemetryLabel: 'Sóng Áp lực Tâm thất (ECG/mmHg)',
    telemetryUnit: 'mmHg',
    telemetryColor: '#fb7185',
    telemetryMin: 0,
    telemetryMax: 140,
    defaultRateLabel: 'Nhịp tim (BPM)',
    defaultRateMin: 45,
    defaultRateMax: 165,
    defaultRateVal: 72,
    defaultRateUnit: 'bpm',
    summaryVi:
      'Tim người có 4 ngăn tách biệt hoàn toàn (2 tâm nhĩ, 2 tâm thất) ngăn không cho máu giàu O₂ bên trái pha trộn với máu giàu CO₂ bên phải, giúp duy trì huyết áp cao nuôi não và cơ thể đẳng nhiệt.',
    keyFactsVi: [
      'Chu kỳ tim chuẩn ở 72 bpm dài 0,83s: Tâm nhĩ co (0,1s) → Tâm thất co (0,3s) → Giãn chung (0,43s).',
      'Thành cơ Tâm thất trái dày gấp ~3 lần Tâm thất phải để đẩy máu vào Cung động mạch chủ tới toàn thân.',
      'Hệ động mạch vành tách trực tiếp từ gốc động mạch chủ để cung cấp O₂ cho chính cơ tim.',
    ],
    organs: [
      {
        id: 'left_ventricle',
        nameVi: 'Tâm thất Trái (LV)',
        latinName: 'Ventriculus sinister',
        colorHex: '#e11d48',
        roleVi: 'Bơm máu giàu O₂ qua van động mạch chủ đi nuôi toàn bộ cơ thể với áp lực tâm thu ~120 mmHg.',
        histologyVi: 'Thành cơ tim dày nhất (10–15 mm), nhiều sợi cơ vân tim phân nhánh nối nhau bằng đĩa xen kẽ giàu ti thể.',
        evolutionNoteVi: 'Động vật có vú và chim đều tiến hóa vách liên thất kín hoàn toàn, tách riêng 2 vòng tuần hoàn.',
        explodeDir: [0.85, -0.55, 0.35],
        anchorPos: [0.35, -0.45, 0.25],
        labelPos: [2.65, -1.15, 0.2],
      },
      {
        id: 'right_ventricle',
        nameVi: 'Tâm thất Phải (RV)',
        latinName: 'Ventriculus dexter',
        colorHex: '#2563eb',
        roleVi: 'Bơm máu tĩnh mạch nghèo O₂ lên Động mạch phổi để trao đổi khí tại phế nang phổi (áp lực ~25 mmHg).',
        histologyVi: 'Thành cơ mỏng hơn tâm thất trái (3–5 mm) vì kháng lực vòng tuần hoàn phổi thấp.',
        evolutionNoteVi: 'Tiến hóa từ tâm thất chung của bò sát; cá chưa có tâm thất phải/trái tách biệt.',
        explodeDir: [-0.85, -0.5, 0.45],
        anchorPos: [-0.36, -0.35, 0.28],
        labelPos: [-2.65, -1.15, 0.2],
      },
      {
        id: 'left_atrium',
        nameVi: 'Tâm nhĩ Trái (LA)',
        latinName: 'Atrium sinistrum',
        colorHex: '#f43f5e',
        roleVi: 'Nhận máu đỏ tươi giàu O₂ từ 4 tĩnh mạch phổi đổ về, đẩy xuống tâm thất trái qua van hai lá.',
        histologyVi: 'Thành cơ mỏng có tiểu nhĩ trái, lớp nội tâm mạc nhẵn giúp dòng máu chảy tầng ít xoáy.',
        evolutionNoteVi: 'Xuất hiện lần đầu ở lưỡng cư khi phổi hình thành tạo vòng tuần hoàn nhỏ.',
        explodeDir: [0.85, 0.4, -0.25],
        anchorPos: [0.56, 0.44, -0.05],
        labelPos: [2.65, 0.52, 0.05],
      },
      {
        id: 'right_atrium',
        nameVi: 'Tâm nhĩ Phải (RA)',
        latinName: 'Atrium dextrum',
        colorHex: '#3b82f6',
        roleVi: 'Thu nhận máu tĩnh mạch từ tĩnh mạch chủ trên & dưới, chứa nút xoang nhĩ (SA node) phát nhịp tự động.',
        histologyVi: 'Chứa tế bào tạo nhịp chuyên biệt ở nút SA có khả năng tự khử cực chu kỳ tạo nhịp tim.',
        evolutionNoteVi: 'Tương đồng với xoang tĩnh mạch hợp nhất ở động vật có xương sống bậc cao.',
        explodeDir: [-0.9, 0.4, -0.2],
        anchorPos: [-0.52, 0.42, 0.05],
        labelPos: [-2.65, 0.35, 0.1],
      },
      {
        id: 'aortic_arch',
        nameVi: 'Cung Động mạch Chủ',
        latinName: 'Arcus aortae',
        colorHex: '#ef4444',
        roleVi: 'Động mạch đàn hồi lớn nhất cơ thể, chia 3 nhánh cấp máu cho đầu, não và hai chi trên trước khi đi xuống bụng.',
        histologyVi: 'Giàu sợi đàn hồi (elastin) giúp dãn ra lúc tâm thu và co lại lúc tâm trương để duy trì dòng máu liên tục.',
        evolutionNoteVi: 'Ở thú chỉ giữ lại cung chủ trái; ở chim giữ cung chủ phải; ở lưỡng cư còn cả đôi cung.',
        explodeDir: [0.2, 1.05, -0.1],
        anchorPos: [0.08, 1.28, 0.0],
        labelPos: [2.45, 1.72, 0.05],
      },
      {
        id: 'pulmonary_trunk',
        nameVi: 'Thân Động mạch Phổi',
        latinName: 'Truncus pulmonalis',
        colorHex: '#6366f1',
        roleVi: 'Đưa máu tĩnh mạch từ tâm thất phải chia hai nhánh sang phổi trái và phổi phải.',
        histologyVi: 'Ống động mạch thành đàn hồi mỏng hơn động mạch chủ, chứa van bán nguyệt ngăn máu trào ngược.',
        evolutionNoteVi: 'Đặc trưng của động vật hô hấp bằng phổi (tứ chi trên cạn và cá phổi).',
        explodeDir: [-0.25, 0.8, 0.65],
        anchorPos: [-0.08, 0.82, 0.25],
        labelPos: [-2.55, 1.15, 0.2],
      },
      {
        id: 'vena_cava',
        nameVi: 'Tĩnh mạch Chủ Trên & Dưới',
        latinName: 'Venae cavae superior et inferior',
        colorHex: '#1d4ed8',
        roleVi: 'Hai ống tĩnh mạch lớn thu hồi toàn bộ máu giàu CO₂ từ nửa trên và nửa dưới cơ thể về tâm nhĩ phải.',
        histologyVi: 'Thành mỏng, khoang rộng ít cơ trơn, hoạt động nhờ chênh lệch áp suất âm lồng ngực khi hít vào.',
        evolutionNoteVi: 'Phát triển từ hệ tĩnh mạch chính trước/sau ở phôi động vật có dây sống.',
        explodeDir: [-1.05, 0.25, -0.5],
        anchorPos: [-0.62, 1.35, -0.15],
        labelPos: [-2.45, 1.92, -0.1],
      },
      {
        id: 'coronary_vessels',
        nameVi: 'Hệ Mạch Vành Nuôi Tim',
        latinName: 'Arteriae coronariae',
        colorHex: '#fb923c',
        roleVi: 'Mạng lưới mao mạch bao quanh rãnh liên thất cung cấp O₂ và glucose liên tục cho cơ tim co bóp suốt đời.',
        histologyVi: 'Động mạch cơ cỡ vừa, lưu lượng tăng mạnh nhất trong kỳ tâm trương khi cơ tim thả lỏng.',
        evolutionNoteVi: 'Cần thiết ở tim thành dày áp suất cao của chim và thú (cá chỉ dùng máu trong buồng tim khuếch tán ở lớp trong).',
        explodeDir: [0.15, -0.25, 0.95],
        anchorPos: [0.02, -0.18, 0.56],
        labelPos: [2.65, -0.32, 0.45],
      },
    ],
  },
  {
    id: 'human_respiratory',
    realm: 'human',
    titleVi: 'Hệ Hô Hấp & Phổi–Phế Nang',
    subtitleVi: 'Đường dẫn khí sụn chữ C · Hai phổi phân thùy · Cơ hoành',
    badgeVi: 'CƠ THỂ NGƯỜI · HÔ HẤP',
    telemetryLabel: 'Dung tích Khí Lưu thông Phổi (mL)',
    telemetryUnit: 'mL',
    telemetryColor: '#38bdf8',
    telemetryMin: 0,
    telemetryMax: 600,
    defaultRateLabel: 'Nhịp thở (/phút)',
    defaultRateMin: 8,
    defaultRateMax: 34,
    defaultRateVal: 16,
    defaultRateUnit: 'lần/p',
    summaryVi:
      'Không khí đi qua thanh quản và khí quản có vòng sụn chống xẹp vào phổi phải (3 thùy) và phổi trái (2 thùy chừa khuyết tim). Khoảng 300 triệu phế nang tạo diện tích trao đổi khí ~70–100 m².',
    keyFactsVi: [
      'Cơ hoành hạ xuống + cơ liên sườn ngoài co tạo áp suất âm khoang màng phổi giúp hít vào thụ động luồng khí O₂.',
      'Phổi phải có 3 thùy (trên, giữa, dưới); phổi trái có 2 thùy và khuyết tim ôm lấy đỉnh tim lệch trái.',
      'Màng hô hấp phế nang–mao mạch chỉ dày ~0,5 µm cho phép O₂ và CO₂ khuếch tán nhanh theo gradient phân áp.',
    ],
    organs: [
      {
        id: 'trachea',
        nameVi: 'Thanh quản & Khí quản (Vòng sụn chữ C)',
        latinName: 'Larynx & Trachea',
        colorHex: '#cbd5e1',
        roleVi: 'Dẫn lọc, làm ấm và làm ẩm luồng khí hít vào; các vòng sụn trong chữ C giúp ống dẫn luôn mở.',
        histologyVi: 'Biểu mô trụ giả tầng có lông chuyển kết hợp tế bào đài tiết nhầy bắt giữ bụi mịn & vi khuẩn.',
        evolutionNoteVi: 'Khí quản phân nhánh phức tạp hơn rõ rệt từ bò sát tới chim và thú.',
        explodeDir: [0, 0.95, 0],
        anchorPos: [0, 1.45, 0.05],
        labelPos: [2.55, 1.68, 0.1],
      },
      {
        id: 'bronchi_tree',
        nameVi: 'Phế quản Gốc & Cây Tiểu phế quản',
        latinName: 'Bronchi principales et bronchioli',
        colorHex: '#94a3b8',
        roleVi: 'Chia đôi tại cựa khí quản (carina) thành phế quản phải–trái và phân nhánh ~23 thế hệ tới tận phế nang.',
        histologyVi: 'Tiểu phế quản tận mất dần vòng sụn và thay bằng vòng cơ trơn điều tiết lưu lượng khí.',
        evolutionNoteVi: 'Phổi thú có phế quản tận cùng ở túi phế nang kín; phổi chim thông suốt thành ống khí 1 chiều.',
        explodeDir: [0, 0.35, 0.4],
        anchorPos: [0, 0.62, 0.05],
        labelPos: [-2.55, 1.38, 0.1],
      },
      {
        id: 'right_lung',
        nameVi: 'Phổi Phải (3 Thùy: Trên · Giữa · Dưới)',
        latinName: 'Pulmo dexter',
        colorHex: '#fb7185',
        roleVi: 'Chiếm ~55% dung tích thông khí, chia 3 thùy bởi khe ngang và khe chếch.',
        histologyVi: 'Nhu mô xốp gồm hàng trăm triệu phế nang bọc mạng mao mạch phổi, có chất hoạt diện (surfactant) giảm sức căng.',
        evolutionNoteVi: 'Tiến hóa từ phổi túi đơn giản ở lưỡng cư thành phổi phân khoang cực mịn ở thú.',
        explodeDir: [-1.05, 0.1, 0],
        anchorPos: [-0.95, 0.05, 0.1],
        labelPos: [-2.75, -0.08, 0.25],
      },
      {
        id: 'left_lung',
        nameVi: 'Phổi Trái (2 Thùy & Khuyết Tim)',
        latinName: 'Pulmo sinister',
        colorHex: '#f472b6',
        roleVi: 'Gồm 2 thùy (trên & dưới), mặt trong lõm tạo khuyết tim nhường chỗ cho mỏm tim.',
        histologyVi: 'Phế bào loại I trao đổi khí siêu mỏng và phế bào loại II tiết surfactant chống xẹp phế nang.',
        evolutionNoteVi: 'Tính bất đối xứng trái–phải bảo tồn qua hàng trăm triệu năm tiến hóa lớp Thú.',
        explodeDir: [1.05, 0.1, 0],
        anchorPos: [0.95, 0.05, 0.1],
        labelPos: [2.75, -0.05, 0.25],
      },
      {
        id: 'diaphragm',
        nameVi: 'Cơ Hoành (Vòm Hô hấp Chính)',
        latinName: 'Diaphragma',
        colorHex: '#dc2626',
        roleVi: 'Ngăn cách khoang ngực và khoang bụng; co hạ xuống làm tăng thể tích lồng ngực đảm nhận ~75% công hít vào.',
        histologyVi: 'Cơ vân hình vòm với trung tâm gân trắng bền, được chi phối bởi dây thần kinh hoành (C3–C5).',
        evolutionNoteVi: 'Cơ hoành hoàn chỉnh là đặc trưng giải phẫu độc đáo của lớp Thú (Mammalia).',
        explodeDir: [0, -1.05, 0],
        anchorPos: [0, -1.18, 0.25],
        labelPos: [2.45, -1.45, 0.3],
      },
    ],
  },
  {
    id: 'human_nervous',
    realm: 'human',
    titleVi: 'Hệ Thần Kinh Trung Ương (Não & Tủy Sống)',
    subtitleVi: 'Đại não 4 thùy · Tiểu não · Thân não · Tủy sống đốt sống',
    badgeVi: 'CƠ THỂ NGƯỜI · THẦN KINH',
    telemetryLabel: 'Điện thế Hoạt động Sợi Trục (mV)',
    telemetryUnit: 'mV',
    telemetryColor: '#facc15',
    telemetryMin: -90,
    telemetryMax: 50,
    defaultRateLabel: 'Tần số Xung (Hz)',
    defaultRateMin: 5,
    defaultRateMax: 60,
    defaultRateVal: 24,
    defaultRateUnit: 'Hz',
    summaryVi:
      'Khoảng 86 tỷ nơron trong não bộ và tủy sống xử lí cảm giác, tư duy bậc cao, giữ thăng bằng và phản xạ tủy với tốc độ dẫn truyền trên sợi có bao myelin lên tới 120 m/s.',
    keyFactsVi: [
      'Vỏ đại não gấp nếp (hồi não và rãnh não) giúp diện tích chất xám đạt ~2.500 cm² gọn trong hộp sọ.',
      'Tiểu não chiếm 10% thể tích nhưng chứa hơn 50% tổng số nơron toàn não để phối hợp vận động tinh.',
      'Xung thần kinh lan truyền nhảy cóc qua eo Ranvier trên sợi có bao myelin nhanh gấp ~20 lần sợi trần.',
    ],
    organs: [
      {
        id: 'frontal_lobe',
        nameVi: 'Thùy Trán Đại Não',
        latinName: 'Lobus frontalis',
        colorHex: '#f59e0b',
        roleVi: 'Trung tâm tư duy logic, lập kế hoạch, ngôn ngữ vận động (Broca) và điều khiển cơ vân có ý thức.',
        histologyVi: 'Chất xám vỏ não 6 lớp tế bào tháp Betz khổng lồ nằm trên nền chất trắng bó sợi liên kết.',
        evolutionNoteVi: 'Thùy trán ở người phát triển vượt trội, chiếm ~33% toàn bộ vỏ não đại não.',
        explodeDir: [0, 0.65, 0.9],
        anchorPos: [0.35, 0.92, 0.65],
        labelPos: [2.55, 1.48, 0.45],
      },
      {
        id: 'parietal_occipital',
        nameVi: 'Thùy Đỉnh, Thái dương & Chẩm',
        latinName: 'Lobi parietalis, temporalis et occipitalis',
        colorHex: '#ec4899',
        roleVi: 'Thùy đỉnh xử lí xúc giác/không gian; Thùy thái dương xử lí thính giác/trí nhớ; Thùy chẩm xử lí thị giác.',
        histologyVi: 'Các vùng vỏ não cảm giác chuyên biệt liên kết chặt chẽ qua thể chai (corpus callosum) nối 2 bán cầu.',
        evolutionNoteVi: 'Sự mở rộng vỏ não mới (neocortex) là dấu ấn tiến hóa đặc sắc của linh trưởng và người.',
        explodeDir: [0, 0.75, -0.75],
        anchorPos: [-0.45, 0.95, -0.45],
        labelPos: [-2.65, 1.38, -0.25],
      },
      {
        id: 'cerebellum',
        nameVi: 'Tiểu Não (Cây Sống Arbor Vitae)',
        latinName: 'Cerebellum',
        colorHex: '#a855f7',
        roleVi: 'Điều hòa thăng bằng tư thế, phối hợp trương lực cơ và đồng bộ hóa các động tác chính xác.',
        histologyVi: 'Lớp tế bào Purkinje có cây đuôi gai tỏa nhánh cực rộng xếp thành hàng thẳng tắp.',
        evolutionNoteVi: 'Đặc biệt phát triển ở chim (bay lượn 3D) và thú (vận động khéo léo).',
        explodeDir: [0, -0.2, -1.05],
        anchorPos: [0.32, 0.16, -0.68],
        labelPos: [-2.55, 0.08, -0.45],
      },
      {
        id: 'brainstem',
        nameVi: 'Thân Não (Cầu não & Hành não)',
        latinName: 'Truncus encephali',
        colorHex: '#38bdf8',
        roleVi: 'Điều khiển chức năng sinh tồn tự động: trung khu hô hấp, nhịp tim, huyết áp và phản xạ nuốt.',
        histologyVi: 'Tập hợp các nhân xám dây thần kinh sọ và hệ lưới hoạt hóa duy trì trạng thái tỉnh táo.',
        evolutionNoteVi: 'Cấu trúc bảo thủ cổ xưa nhất trong não động vật có xương sống.',
        explodeDir: [0, -0.5, 0.4],
        anchorPos: [0.05, 0.02, -0.12],
        labelPos: [2.55, 0.12, 0.15],
      },
      {
        id: 'spinal_cord',
        nameVi: 'Tủy Sống & Cột Sống Bảo Vệ',
        latinName: 'Medulla spinalis',
        colorHex: '#22d3ee',
        roleVi: 'Cầu dẫn truyền tín hiệu hai chiều giữa não và cơ thể, đồng thời thực hiện cung phản xạ không điều kiện nhanh.',
        histologyVi: 'Chất xám hình chữ H nằm ở trung tâm (ngược với đại não), bao ngoài là các bó sợi trắng myelin.',
        evolutionNoteVi: 'Ống thần kinh lưng phát triển từ ngoại bì phôi ở tất cả động vật ngành Dây sống.',
        explodeDir: [0, -1.1, 0],
        anchorPos: [0, -1.15, -0.15],
        labelPos: [-2.45, -1.35, 0.15],
      },
    ],
  },
  {
    id: 'human_digestive_renal',
    realm: 'human',
    titleVi: 'Hệ Tiêu Hóa & Bài Tiết Thận',
    subtitleVi: 'Gan–Mật · Dạ dày chữ J · Ruột non/già · Thận lọc máu',
    badgeVi: 'CƠ THỂ NGƯỜI · TIÊU HÓA & BÀI TIẾT',
    telemetryLabel: 'Lưu lượng Lọc Cầu thận GFR (mL/phút)',
    telemetryUnit: 'mL/p',
    telemetryColor: '#f59e0b',
    telemetryMin: 60,
    telemetryMax: 140,
    defaultRateLabel: 'Cường độ Nhu động',
    defaultRateMin: 20,
    defaultRateMax: 150,
    defaultRateVal: 65,
    defaultRateUnit: '%',
    summaryVi:
      'Ống tiêu hóa biến đổi thức ăn thành phân tử đơn giản để hấp thụ qua nhung mao ruột non, trong khi hai quả thận lọc ~180 lít dịch mỗi ngày qua 2 triệu đơn vị nephron để cân bằng nội môi.',
    keyFactsVi: [
      'Gan đảm nhiệm >500 chức năng chuyển hóa, giải độc và tiết dịch mật nhũ tương hóa lipid tại tá tràng.',
      'Dạ dày duy trì pH 1,5–2,0 nhờ HCl diệt khuẩn và hoạt hóa enzyme pepsin tiêu hóa protein.',
      'Hai thận nhận tới 20–25% tổng cung lượng tim để lọc máu và tái hấp thu 99% nước & chất điện giải.',
    ],
    organs: [
      {
        id: 'liver_gallbladder',
        nameVi: 'Gan (2 Thùy) & Túi Mật',
        latinName: 'Hepar et Vesica biliaris',
        colorHex: '#b91c1c',
        roleVi: 'Tổng hợp protein huyết tương, dự trữ glycogen, khử độc NH₃ thành urê và sản xuất dịch mật.',
        histologyVi: 'Gồm hàng trăm nghìn tiểu thùy gan hình lục giác xoay quanh tĩnh mạch trung tâm.',
        evolutionNoteVi: 'Tuyến tiêu hóa lớn nhất cơ thể động vật có xương sống.',
        explodeDir: [-0.95, 0.55, 0.3],
        anchorPos: [-0.45, 0.72, 0.35],
        labelPos: [-2.65, 1.25, 0.2],
      },
      {
        id: 'stomach',
        nameVi: 'Dạ Dày Chữ J & Thực Quản',
        latinName: 'Gaster (Ventriculus)',
        colorHex: '#f472b6',
        roleVi: 'Nghiền trộn cơ học nhờ 3 lớp cơ trơn và tiêu hóa hóa học protein bằng pepsin trong môi trường axit HCl.',
        histologyVi: 'Niêm mạc gấp nếp (rugae) phủ lớp chất nhầy kiềm bảo vệ thành dạ dày không bị tự tiêu hóa.',
        evolutionNoteVi: 'Biến đổi đa dạng theo tập tính ăn: dạ dày 4 túi ở thú nhai lại, diều/mề ở chim.',
        explodeDir: [0.95, 0.45, 0.35],
        anchorPos: [0.45, 0.65, 0.25],
        labelPos: [2.65, 1.15, 0.2],
      },
      {
        id: 'intestines',
        nameVi: 'Ruột Non & Khung Đại Tràng',
        latinName: 'Intestinum tenue et crassum',
        colorHex: '#fb923c',
        roleVi: 'Ruột non (~6m) hấp thụ hầu hết chất dinh dưỡng qua vi nhung mao; Đại tràng tái hấp thu nước & tổng hợp vitamin K.',
        histologyVi: 'Bề mặt ruột non tăng diện tích hấp thụ gấp ~600 lần nhờ nếp gấp vòng, nhung mao và vi nhung mao.',
        evolutionNoteVi: 'Động vật ăn thực vật có ruột và manh tràng dài hơn nhiều so với động vật ăn thịt.',
        explodeDir: [0, -0.45, 0.85],
        anchorPos: [0.42, -0.62, 0.35],
        labelPos: [2.65, -0.92, 0.25],
      },
      {
        id: 'kidneys_ureters',
        nameVi: 'Hai Quả Thận, Mạch Thận & Niệu Quản',
        latinName: 'Renes et Ureteres',
        colorHex: '#9f1239',
        roleVi: 'Lọc bỏ urê, creatinin và ion dư thừa, điều hòa thể tích máu (ADH, aldosteron) và bài tiết nước tiểu xuống bàng quang.',
        histologyVi: 'Mỗi thận chứa ~1 triệu nephron gồm tiểu cầu thận (lọc) và ống thận chữ U Henle (tái hấp thu).',
        evolutionNoteVi: 'Quai Henle phát triển mạnh ở chim và thú giúp tạo nước tiểu ưu trương tiết kiệm nước trên cạn.',
        explodeDir: [0, 0.05, -0.95],
        anchorPos: [-0.62, -0.05, -0.42],
        labelPos: [-2.65, -0.78, -0.2],
      },
    ],
  },
  {
    id: 'animal_mammal',
    realm: 'animal',
    titleVi: 'Lớp Thú (Động vật Có vú — Thỏ)',
    subtitleVi: 'Tim 4 ngăn tách biệt · Phổi xốp & Cơ hoành · Manh tràng lớn',
    badgeVi: 'ĐỘNG VẬT · LỚP THÚ',
    telemetryLabel: 'Nhiệt độ Đẳng nhiệt & Cung lượng Tim',
    telemetryUnit: '°C',
    telemetryColor: '#f43f5e',
    telemetryMin: 35,
    telemetryMax: 42,
    defaultRateLabel: 'Nhịp sinh lí Thỏ',
    defaultRateMin: 60,
    defaultRateMax: 220,
    defaultRateVal: 135,
    defaultRateUnit: 'bpm',
    summaryVi:
      'Đại diện lớp Thú (Mammalia) sở hữu bộ não phát triển, tim 4 ngăn máu hoàn toàn không pha trộn, cơ hoành phân tách khoang ngực–bụng và ống tiêu hóa với manh tràng lớn tiêu hóa xenlulozơ.',
    keyFactsVi: [
      'Động vật hằng nhiệt (38,5–39,5°C ở thỏ) nhờ máu đỏ tươi tách biệt hoàn toàn với máu tĩnh mạch.',
      'Thỏ có manh tràng rất lớn chứa hệ vi sinh vật cộng sinh phân giải xenlulozơ từ thực vật.',
      'Tai thỏ dài giàu mạch máu vừa định hướng âm thanh 3D vừa đóng vai trò tản nhiệt sinh học.',
    ],
    organs: [
      {
        id: 'mammal_brain_skull',
        nameVi: 'Hộp Sọ & Bộ Não Thú',
        latinName: 'Cranium et Encephalon',
        colorHex: '#fbbf24',
        roleVi: 'Đại não và tiểu não phát triển che phủ phần lớn não giữa, xử lí thị giác–thính giác nhạy bén.',
        histologyVi: 'Vỏ não mới xuất hiện nếp cuộn giúp động vật có vú có tập tính học tập và săn/trốn phức tạp.',
        evolutionNoteVi: 'Khớp hàm dưới chỉ còn 1 xương răng; 3 xương nhỏ chuyển vào tai giữa (búa–đe–bàn đạp).',
        explodeDir: [-0.7, 0.7, 0.2],
        anchorPos: [-1.25, 0.55, 0],
        labelPos: [-2.65, 1.48, 0.1],
      },
      {
        id: 'mammal_heart',
        nameVi: 'Tim 4 Ngăn Hoàn Chỉnh',
        latinName: 'Cor tetrapartitum',
        colorHex: '#e11d48',
        roleVi: 'Đẩy máu đi 2 vòng tuần hoàn kín hoàn toàn; nhịp tim thỏ nhanh (~130–200 bpm) đáp ứng trao đổi chất cao.',
        histologyVi: 'Vách liên nhĩ và vách liên thất kín, cung động mạch chủ uốn sang trái.',
        evolutionNoteVi: 'Đỉnh cao tiến hóa tuần hoàn cùng với lớp Chim.',
        explodeDir: [-0.25, -0.4, 0.8],
        anchorPos: [-0.45, -0.2, 0.15],
        labelPos: [-2.45, -1.18, 0.25],
      },
      {
        id: 'mammal_lungs_diaphragm',
        nameVi: 'Phổi Phế Nang & Cơ Hoành',
        latinName: 'Pulmones et Diaphragma',
        colorHex: '#fb7185',
        roleVi: 'Phổi nằm kín trong lồng ngực, co giãn nhờ cơ liên sườn và vòm cơ hoành.',
        histologyVi: 'Hô hấp hoàn toàn bằng phế nang đàn hồi tăng diện tích tiếp xúc O₂.',
        evolutionNoteVi: 'Cơ hoành là dấu hiệu giải phẫu đặc hữu giúp nhận diện lớp Thú.',
        explodeDir: [0.1, 0.55, -0.75],
        anchorPos: [-0.1, 0.18, 0],
        labelPos: [2.45, 1.38, -0.1],
      },
      {
        id: 'mammal_cecum',
        nameVi: 'Dạ dày & Manh tràng Thú Ăn Cỏ',
        latinName: 'Caecum herbivorum',
        colorHex: '#f97316',
        roleVi: 'Nơi vi khuẩn lên men chất xơ thành axit béo dễ bay hơi và tạo phân mềm giàu vitamin B.',
        histologyVi: 'Thành manh tràng mỏng, diện tích thể tích chiếm tới 40% toàn bộ ống tiêu hóa.',
        evolutionNoteVi: 'Thích nghi hình thái ống tiêu hóa theo nguồn thức ăn thực vật khó tiêu.',
        explodeDir: [0.9, -0.35, 0.35],
        anchorPos: [0.95, -0.15, 0.15],
        labelPos: [2.65, -0.95, 0.2],
      },
    ],
  },
  {
    id: 'animal_bird',
    realm: 'animal',
    titleVi: 'Lớp Chim (Thông Khí 9 Túi Khí 1 Chiều)',
    subtitleVi: 'Hệ phổi cứng + 9 túi khí · Tim 4 ngăn · Xương ức lưỡi hái',
    badgeVi: 'ĐỘNG VẬT · LỚP CHIM',
    telemetryLabel: 'Hiệu suất Hấp thụ O₂ Kép (%)',
    telemetryUnit: '%',
    telemetryColor: '#22d3ee',
    telemetryMin: 20,
    telemetryMax: 100,
    defaultRateLabel: 'Nhịp vỗ cánh / Hô hấp',
    defaultRateMin: 20,
    defaultRateMax: 120,
    defaultRateVal: 55,
    defaultRateUnit: 'chu kỳ/p',
    summaryVi:
      'Chim sở hữu hệ hô hấp hiệu quả nhất trong tất cả động vật có xương sống trên cạn: không khí đi qua các ống khí phổi theo MỘT CHIỀU duy nhất cả khi hít vào lẫn thở ra nhờ hệ 9 túi khí trước và sau.',
    keyFactsVi: [
      'Cả 2 pha hít vào và thở ra đều đẩy dòng khí giàu O₂ mới qua ống khí phổi (cross-current exchange).',
      'Xương ức có lưỡi hái (keel) cực lớn làm điểm tựa cho khối cơ ngực kéo cánh nặng tới 15–20% khối lượng cơ thể.',
      'Xương rỗng xốp có thanh giằng khí nén và không có bóng đái giúp giảm tối đa trọng lượng khi bay.',
    ],
    organs: [
      {
        id: 'bird_lungs',
        nameVi: 'Phổi Ống Khí Cố Định (Parabronchi)',
        latinName: 'Pulmo avium',
        colorHex: '#f43f5e',
        roleVi: 'Phổi chim không nở phồng như phổi thú mà chứa hàng nghìn ống khí song song trao đổi khí liên tục.',
        histologyVi: 'Các mao mạch khí nằm áp sát mao mạch máu theo góc chéo (cross-current) lấy O₂ ngay cả ở độ cao >8.000m.',
        evolutionNoteVi: 'Phát triển từ hệ phổi khủng long chân thú (Theropoda) giúp trao đổi chất cực cao.',
        explodeDir: [0, 0.75, -0.45],
        anchorPos: [-0.25, 0.48, 0],
        labelPos: [-2.55, 1.38, 0.1],
      },
      {
        id: 'bird_air_sacs',
        nameVi: 'Hệ 9 Túi Khí Trước & Sau',
        latinName: 'Sacci pneumatici',
        colorHex: '#38bdf8',
        roleVi: 'Hoạt động như cặp bễ thổi đẩy dòng khí tươi đi một chiều qua phổi và giúp làm mát cơ thể khi bay.',
        histologyVi: 'Thành màng liên kết mỏng đàn hồi, không trực tiếp trao đổi khí mà đóng vai trò bơm thông khí.',
        evolutionNoteVi: 'Độc đáo chỉ có ở Chim và một số nhánh bò sát cổ đại.',
        explodeDir: [0.85, 0.15, 0.55],
        anchorPos: [0.75, 0.12, 0.25],
        labelPos: [2.65, 1.15, 0.2],
      },
      {
        id: 'bird_heart',
        nameVi: 'Tim 4 Ngăn Nhịp Cao & Cung Chủ Phải',
        latinName: 'Cor avium',
        colorHex: '#e11d48',
        roleVi: 'Tim chim lớn hơn tim thú cùng kích thước gấp ~1,5–2 lần để bơm máu cung cấp năng lượng bay liên tục.',
        histologyVi: 'Tần số tim chim sẻ có thể đạt 400–800 nhịp/phút; cung động mạch chủ uốn sang bên PHẢI.',
        evolutionNoteVi: 'Tiến hóa hội tụ tim 4 ngăn độc lập với lớp Thú.',
        explodeDir: [-0.75, -0.3, 0.65],
        anchorPos: [-0.55, -0.15, 0.2],
        labelPos: [-2.55, -0.95, 0.25],
      },
      {
        id: 'bird_keel',
        nameVi: 'Xương Ức Lưỡi Hái (Keel) & Cơ Ngực',
        latinName: 'Carina sterni',
        colorHex: '#e2e8f0',
        roleVi: 'Tấm xương dẹt nhô dọc ngực là nơi bám vững chắc cho cơ ngực lớn (kéo cánh xuống) và cơ trên quạ (nâng cánh).',
        histologyVi: 'Cấu trúc xương khí hóa rỗng vừa nhẹ vừa chịu lực uốn cực lớn.',
        evolutionNoteVi: 'Chim không biết bay (đà điểu) bị tiêu giảm hoàn toàn mào xương ức này.',
        explodeDir: [0, -0.9, 0.5],
        anchorPos: [-0.1, -0.68, 0.15],
        labelPos: [2.45, -1.25, 0.25],
      },
    ],
  },
  {
    id: 'animal_amphibian',
    realm: 'animal',
    titleVi: 'Lớp Lưỡng Cư (Ếch — Tim 3 Ngăn & Da Hô Hấp)',
    subtitleVi: 'Tim 3 ngăn máu pha · Phổi túi đơn giản · Mao mạch dưới da ẩm',
    badgeVi: 'ĐỘNG VẬT · LƯỠNG CƯ',
    telemetryLabel: 'Tỉ lệ Trao đổi Khí qua Da vs Phổi (%)',
    telemetryUnit: '% O₂',
    telemetryColor: '#10b981',
    telemetryMin: 10,
    telemetryMax: 100,
    defaultRateLabel: 'Nhịp Đập Cổ Họng & Tim',
    defaultRateMin: 25,
    defaultRateMax: 110,
    defaultRateVal: 48,
    defaultRateUnit: 'lần/p',
    summaryVi:
      'Lưỡng cư là bước chuyển tiếp từ nước lên cạn: có 2 vòng tuần hoàn nhưng tim mới chỉ có 3 ngăn (2 tâm nhĩ, 1 tâm thất chung), dẫn tới máu đi nuôi cơ thể là máu pha. Phổi túi đơn giản được bù đắp bằng hô hấp qua da ẩm.',
    keyFactsVi: [
      'Tâm nhĩ phải nhận máu nghèo O₂ từ cơ thể; Tâm nhĩ trái nhận máu giàu O₂ từ phổi & da đổ chung xuống 1 tâm thất.',
      'Khi ếch ở dưới nước hoặc ngủ đông, tới 60–80% lượng O₂ và gần 90% lượng CO₂ trao đổi trực tiếp qua lớp da ẩm giàu mao mạch.',
      'Cơ thể biến nhiệt do máu pha và tốc độ trao đổi chất thấp.',
    ],
    organs: [
      {
        id: 'amph_heart_3',
        nameVi: 'Tim 3 Ngăn (2 Tâm Nhĩ · 1 Tâm Thất Chung)',
        latinName: 'Cor tripartitum',
        colorHex: '#a855f7',
        roleVi: 'Tạo 2 vòng tuần hoàn đầu tiên trên cạn, nhưng máu động mạch và tĩnh mạch pha trộn một phần tại tâm thất chung.',
        histologyVi: 'Các bè cơ xốp trong tâm thất cùng van xoắn ở nón động mạch hạn chế phần nào sự pha trộn hoàn toàn.',
        evolutionNoteVi: 'Cầu nối tiến hóa giữa tim 2 ngăn của Cá và tim 4 ngăn hoàn chỉnh của Chim/Thú.',
        explodeDir: [0, -0.25, 0.9],
        anchorPos: [-0.25, -0.1, 0.25],
        labelPos: [-2.55, -1.05, 0.25],
      },
      {
        id: 'amph_lungs',
        nameVi: 'Đôi Phổi Túi Đơn Giản (Ít Vách Ngăn)',
        latinName: 'Pulmones sacculares',
        colorHex: '#f472b6',
        roleVi: 'Hai túi mỏng nhận không khí nhờ động tác nuốt khí từ sàn miệng (chưa có lồng ngực và cơ hoành).',
        histologyVi: 'Diện tích bề mặt hô hấp nhỏ, ít nếp gấp vách so với phổi bò sát hoặc thú.',
        evolutionNoteVi: 'Nòng nọc hô hấp bằng mang; khi biến thái thành ếch mang tiêu biến để phổi túi phát triển.',
        explodeDir: [-0.85, 0.45, 0.25],
        anchorPos: [0.15, 0.15, 0.35],
        labelPos: [2.55, 0.35, 0.25],
      },
      {
        id: 'amph_skin',
        nameVi: 'Mạng Mao Mạch Hô Hấp Qua Da Ẩm',
        latinName: 'Respiratio cutanea',
        colorHex: '#10b981',
        roleVi: 'Bề mặt da trần luôn có tuyến nhầy giữ ẩm cho phép O₂ hòa tan trực tiếp vào mạng mao mạch dày đặc dưới biểu bì.',
        histologyVi: 'Biểu bì cực mỏng không có vảy sừng, mao mạch nằm sát màng đáy.',
        evolutionNoteVi: 'Là lý do lưỡng cư không thể sống xa môi trường nước hoặc nơi khô hạn kéo dài.',
        explodeDir: [0, 0.85, -0.3],
        anchorPos: [0, 0.72, 0],
        labelPos: [-2.45, 1.38, 0.1],
      },
    ],
  },
  {
    id: 'animal_fish',
    realm: 'animal',
    titleVi: 'Lớp Cá (Tuần Hoàn Đơn & Trao Đổi Khí Mang)',
    subtitleVi: 'Tim 2 ngăn bơm máu tĩnh mạch · 4 đôi cung mang ngược dòng · Bong bóng khí',
    badgeVi: 'ĐỘNG VẬT · LỚP CÁ',
    telemetryLabel: 'Hiệu suất Bắt O₂ Ngược Dòng tại Mang (%)',
    telemetryUnit: '% O₂',
    telemetryColor: '#06b6d4',
    telemetryMin: 40,
    telemetryMax: 95,
    defaultRateLabel: 'Tốc độ Bơi & Quạt Mang',
    defaultRateMin: 20,
    defaultRateMax: 120,
    defaultRateVal: 62,
    defaultRateUnit: 'chu kỳ/p',
    summaryVi:
      'Cá xương có hệ tuần hoàn ĐƠN: tim chỉ gồm 2 ngăn (1 tâm nhĩ, 1 tâm thất) bơm toàn bộ máu tĩnh mạch ra thẳng động mạch chủ bụng đi tới 4 đôi cung mang để trao đổi khí theo cơ chế DÒNG CHẢY SONG SONG NGƯỢC CHIỀU.',
    keyFactsVi: [
      'Cơ chế dòng chảy ngược chiều giữa nước qua phiến mang và máu trong mao mạch mang giúp cá lấy tới >80% O₂ hòa tan.',
      'Tim cá luôn chứa 100% máu nghèo O₂; máu qua mang giảm áp lực nên tốc độ tuần hoàn toàn thân chậm hơn thú.',
      'Bong bóng khí điều chỉnh tỉ trọng tương đương nước giúp cá lơ lửng không tốn năng lượng.',
    ],
    organs: [
      {
        id: 'fish_heart_2',
        nameVi: 'Tim 2 Ngăn (1 Tâm Nhĩ · 1 Tâm Thất)',
        latinName: 'Cor bipartitum',
        colorHex: '#3b82f6',
        roleVi: 'Thu máu tĩnh mạch từ xoang tĩnh mạch vào tâm nhĩ rồi bơm thẳng lên cung mang thông qua bầu động mạch.',
        histologyVi: 'Buồng tâm thất dày cơ để tạo lực đẩy máu vượt qua lưới mao mạch mang lẫn mao mạch cơ thể chỉ trong 1 vòng.',
        evolutionNoteVi: 'Cơ sở tiến hóa ban đầu của hệ tuần hoàn kín ở động vật có xương sống.',
        explodeDir: [-0.85, -0.5, 0.45],
        anchorPos: [-1.05, -0.32, 0.08],
        labelPos: [-2.65, -1.15, 0.2],
      },
      {
        id: 'fish_gills',
        nameVi: '4 Đôi Cung Mang & Phiến Mang Ngược Dòng',
        latinName: 'Branchiae',
        colorHex: '#ef4444',
        roleVi: 'Trao đổi khí O₂ hòa tan từ dòng nước một chiều qua miệng–nắp mang theo nguyên tắc dòng chảy ngược chiều.',
        histologyVi: 'Hàng nghìn tơ mang và phiến mang thứ cấp giàu mao mạch cực mỏng sắc đỏ tươi.',
        evolutionNoteVi: 'Tổ tiên lưỡng cư chuyển cung mang thành xương hàm, xương móng và vòng cung động mạch phổi.',
        explodeDir: [-0.55, 0.45, 0.7],
        anchorPos: [-0.85, 0.08, 0.22],
        labelPos: [-2.55, 1.38, 0.15],
      },
      {
        id: 'fish_swim_bladder',
        nameVi: 'Bong Bóng Khí (Cơ Quan Thủy Tĩnh)',
        latinName: 'Vesica natatoria',
        colorHex: '#e0f2fe',
        roleVi: 'Túi chứa khí O₂/N₂ điều tiết thể tích giúp cá giữ thăng bằng ở mọi độ sâu mà không phải bơi liên tục.',
        histologyVi: 'Thành bóng dai gồm sợi collagen và tinh thể guanin phản xạ ngăn khuếch tán khí thất thoát.',
        evolutionNoteVi: 'Tương đồng phát sinh phôi với phổi ở cá phổi và động vật bốn chân trên cạn!',
        explodeDir: [0.35, 0.75, 0],
        anchorPos: [0.25, 0.32, 0],
        labelPos: [2.55, 1.25, 0.1],
      },
      {
        id: 'fish_lateral_line',
        nameVi: 'Đường Bên Cảm Nhận Áp Lực Sóng Nước',
        latinName: 'Linea lateralis',
        colorHex: '#22d3ee',
        roleVi: 'Dãy cơ quan thụ cảm cơ học dọc thân phát hiện rung động nước, dòng chảy và vật cản trong bóng tối.',
        histologyVi: 'Chứa các tế bào lông cảm giác (neuromast) nằm trong rãnh ống dưới vảy da.',
        evolutionNoteVi: 'Có quan hệ tiến hóa trực tiếp với cơ quan tiền đình–ốc tai ở động vật trên cạn.',
        explodeDir: [0.75, 0.1, 0.6],
        anchorPos: [0.85, 0.08, 0.36],
        labelPos: [2.65, -0.88, 0.2],
      },
    ],
  },
];

interface OrganSceneEntry {
  meta: OrganMeta;
  group: THREE.Group;
  basePos: THREE.Vector3;
  meshes: THREE.Mesh[];
  labelObj: LeaderArrowLabel;
  animate?: (elapsed: number, rate: number) => void;
}

export const BioAnatomyExplorer3DSandbox: React.FC<{ onEarnXP?: (xp: number) => void }> = ({
  onEarnXP,
}) => {
  const isSoftwareGl = useMemo(() => detectSoftwareGl(), []);

  const [realm, setRealm] = useState<AnatomyRealm>('human');
  const [systemId, setSystemId] = useState<AnatomySystemId>('human_heart_circulatory');
  const activeSystem = useMemo(
    () => ANATOMY_SYSTEMS.find((s) => s.id === systemId) || ANATOMY_SYSTEMS[0],
    [systemId]
  );

  const [selectedOrganId, setSelectedOrganId] = useState<string>(activeSystem.organs[0].id);
  const [explodePct, setExplodePct] = useState<number>(0);
  const [xrayShell, setXrayShell] = useState<boolean>(true);
  const [isolateSelected, setIsolateSelected] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [rateValue, setRateValue] = useState<number>(activeSystem.defaultRateVal);
  const [telemetryHistory, setTelemetryHistory] = useState<number[]>([72, 95, 118, 86, 65, 74, 112, 82]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layerVis, setLayerVis] = useState<Record<LayerKey, boolean>>({
    circulatory: true,
    respiratory: true,
    nervous: true,
    digestive: true,
  });

  // Pro Viewport Controls
  const [sliceEnabled, setSliceEnabled] = useState(false);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>('z');
  const [sliceOffset, setSliceOffset] = useState(0.45);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [hasBookmark, setHasBookmark] = useState(false);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraLerpRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const savedBookmarkRef = useRef<CameraBookmarkPose | null>(null);

  const specimenRootRef = useRef<THREE.Group | null>(null);
  const shellGroupRef = useRef<THREE.Group | null>(null);
  const labelGroupRef = useRef<THREE.Group | null>(null);
  const entriesRef = useRef<OrganSceneEntry[]>([]);

  // Live animation refs
  const systemRef = useRef<AnatomySystemId>(systemId);
  const selectedOrganRef = useRef<string>(selectedOrganId);
  const explodeRef = useRef<number>(explodePct);
  const xrayRef = useRef<boolean>(xrayShell);
  const isolateRef = useRef<boolean>(isolateSelected);
  const showLabelsRef = useRef<boolean>(showLabels);
  const pausedRef = useRef<boolean>(paused);
  const rateRef = useRef<number>(rateValue);
  const sliceEnabledRef = useRef<boolean>(sliceEnabled);
  const sliceAxisRef = useRef<SliceAxis>(sliceAxis);
  const sliceOffsetRef = useRef<number>(sliceOffset);
  const layerVisRef = useRef<Record<LayerKey, boolean>>(layerVis);

  systemRef.current = systemId;
  selectedOrganRef.current = selectedOrganId;
  explodeRef.current = explodePct;
  xrayRef.current = xrayShell;
  isolateRef.current = isolateSelected;
  showLabelsRef.current = showLabels;
  pausedRef.current = paused;
  rateRef.current = rateValue;
  sliceEnabledRef.current = sliceEnabled;
  sliceAxisRef.current = sliceAxis;
  sliceOffsetRef.current = sliceOffset;
  layerVisRef.current = layerVis;

  const selectedOrgan = useMemo(
    () => activeSystem.organs.find((o) => o.id === selectedOrganId) || activeSystem.organs[0],
    [activeSystem, selectedOrganId]
  );

  // Switch system helper
  const handleSelectSystem = (nextId: AnatomySystemId) => {
    const spec = ANATOMY_SYSTEMS.find((s) => s.id === nextId);
    if (!spec) return;
    setRealm(spec.realm);
    setSystemId(nextId);
    setSelectedOrganId(spec.organs[0].id);
    setRateValue(spec.defaultRateVal);
    setIsolateSelected(false);
    onEarnXP?.(4);
  };

  // Telemetry waveform sampler
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const t = performance.now() / 1000;
      const freq = Math.max(0.5, rateValue / 50);
      let val = 80;
      if (systemId === 'human_heart_circulatory' || systemId === 'animal_mammal' || systemId === 'human_full_layered') {
        const phase = (t * freq) % 1;
        const pWave = Math.exp(-Math.pow((phase - 0.14) / 0.04, 2)) * 18;
        const systole = Math.exp(-Math.pow((phase - 0.36) / 0.09, 2)) * 75;
        val = 45 + pWave + systole;
      } else if (systemId === 'human_respiratory' || systemId === 'animal_bird') {
        val = 50 + 40 * (0.5 + 0.5 * Math.sin(t * freq * 1.4));
        if (systemId === 'human_respiratory') val *= 5.2;
      } else if (systemId === 'human_nervous') {
        const spike = (t * freq * 1.2) % 1;
        val = spike < 0.14 ? 42 * Math.sin((spike / 0.14) * Math.PI) : -70 + Math.sin(t * 4) * 3;
      } else {
        val =
          (activeSystem.telemetryMin + activeSystem.telemetryMax) * 0.52 +
          (activeSystem.telemetryMax - activeSystem.telemetryMin) * 0.18 * Math.sin(t * freq);
      }
      setTelemetryHistory((prev) => [...prev.slice(-26), Number(val.toFixed(1))]);
    }, 240);
    return () => window.clearInterval(timer);
  }, [paused, rateValue, systemId, activeSystem.telemetryMin, activeSystem.telemetryMax]);

  // Persistent WebGLRenderer & Scene setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth || 860;
    const h = container.clientHeight || 620;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040914);
    scene.fog = new THREE.FogExp2(0x040914, 0.015);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(2.9, 1.35, 5.25);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
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
      (scene as THREE.Scene & { environmentIntensity: number }).environmentIntensity = 0.88;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.0;
    controls.maxDistance = 12;
    controls.target.set(0, 0.1, 0);
    controls.addEventListener('start', () => {
      cameraLerpRef.current = null;
    });
    controlsRef.current = controls;

    // Anatomical Studio Lighting (3-point key, rim & soft medical fill)
    scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 0.78));
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.65);
    keyLight.position.set(4.5, 7.5, 6.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
    }
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);
    const warmFill = new THREE.PointLight(0xfb7185, 0.55, 11);
    warmFill.position.set(2.5, -1.5, 3.5);
    scene.add(warmFill);

    // Subtle Pedestal & Medical Grid
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.85, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x0b1528, roughness: 0.4, metalness: 0.55 })
    );
    pedestal.position.y = -2.15;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const grid = new THREE.GridHelper(10, 20, 0x164e63, 0x0c192d);
    grid.position.y = -2.08;
    scene.add(grid);

    const specimenRoot = new THREE.Group();
    scene.add(specimenRoot);
    specimenRootRef.current = specimenRoot;

    const shellGroup = new THREE.Group();
    specimenRoot.add(shellGroup);
    shellGroupRef.current = shellGroup;

    const labelGroup = new THREE.Group();
    scene.add(labelGroup);
    labelGroupRef.current = labelGroup;

    // GPU particle pool for blood flow, O2/CO2 gas exchange, neural sparks
    const gpuPool = new GPUParticlePool(180, 0.042, 0xf43f5e, 0x38bdf8);
    scene.add(gpuPool.mesh);

    // Raycast click to select organ
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPt = { x: 0, y: 0 };

    const onPointerDown = (ev: PointerEvent) => {
      downPt = { x: ev.clientX, y: ev.clientY };
    };
    const onPointerUp = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - downPt.x, ev.clientY - downPt.y);
      if (dist > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const candidateMeshes = entriesRef.current.flatMap((e) => e.meshes);
      const hits = raycaster.intersectObjects(candidateMeshes, false);
      if (hits.length > 0) {
        const hitOrganId = hits[0].object.userData?.organId as string | undefined;
        if (hitOrganId) {
          setSelectedOrganId(hitOrganId);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.45);
    let cancelFrame = () => {};
    let disposed = false;
    let elapsed = 0;
    let last = performance.now();
    let emitAcc = 0;

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!pausedRef.current) {
        elapsed += dt;
      }

      const expFrac = explodeRef.current / 100;
      const selId = selectedOrganRef.current;
      const iso = isolateRef.current;
      const lblVisible = showLabelsRef.current;

      if (shellGroupRef.current) {
        shellGroupRef.current.visible = xrayRef.current;
      }

      // Update each organ position, layer visibility, highlight/isolation, leader arrow label & animation
      const lv = layerVisRef.current;
      const isLayeredMap = systemRef.current === 'human_full_layered';

      entriesRef.current.forEach((entry) => {
        const layerVisible = !isLayeredMap || !entry.meta.layerKey || lv[entry.meta.layerKey];
        entry.group.visible = layerVisible;

        const [ex, ey, ez] = entry.meta.explodeDir;
        const tx = entry.basePos.x + ex * expFrac * 1.15;
        const ty = entry.basePos.y + ey * expFrac * 1.15;
        const tz = entry.basePos.z + ez * expFrac * 1.15;
        entry.group.position.lerp(new THREE.Vector3(tx, ty, tz), 0.16);

        if (layerVisible && !pausedRef.current && entry.animate) {
          entry.animate(elapsed, rateRef.current);
        }

        const isSel = entry.meta.id === selId;
        entry.meshes.forEach((m) => {
          const mat = m.material as THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial;
          if (!mat) return;
          if (!mat.userData.__origOpacity) {
            mat.userData.__origOpacity = mat.opacity;
            mat.userData.__origTransparent = mat.transparent;
          }
          if (iso && !isSel) {
            mat.transparent = true;
            mat.opacity = 0.13;
            mat.depthWrite = false;
          } else {
            mat.transparent = Boolean(mat.userData.__origTransparent);
            mat.opacity = Number(mat.userData.__origOpacity ?? 1);
            mat.depthWrite = !mat.transparent;
          }
          if ('emissiveIntensity' in mat) {
            const baseEmissive = Number(mat.userData.__baseEmissive ?? 0.06);
            mat.emissiveIntensity = isSel ? baseEmissive + 0.28 + 0.1 * Math.sin(elapsed * 5) : baseEmissive;
          }
        });

        entry.labelObj.visible = layerVisible && lblVisible && (!iso || isSel);
        const [lx, ly, lz] = entry.meta.labelPos;
        const [ax, ay, az] = entry.meta.anchorPos;
        entry.labelObj.setEndpoints(
          [lx + ex * expFrac * 0.45, ly + ey * expFrac * 0.45, lz + ez * expFrac * 0.45],
          [ax + entry.group.position.x, ay + entry.group.position.y, az + entry.group.position.z]
        );
      });

      // Biological flow particles (blood/air/neural impulses)
      if (!pausedRef.current) {
        emitAcc += dt;
        const sys = systemRef.current;
        if (emitAcc > 0.055) {
          emitAcc = 0;
          if (sys === 'human_full_layered') {
            if (lv.circulatory) {
              gpuPool.spawn(
                0.05,
                0.35,
                0.28,
                (Math.random() - 0.5) * 0.25,
                1.35,
                (Math.random() - 0.5) * 0.2,
                0.85,
                1.05,
                0xf43f5e
              );
            }
            if (lv.nervous) {
              gpuPool.spawn(
                (Math.random() - 0.5) * 0.08,
                1.25,
                -0.18,
                0,
                -2.2,
                0,
                1.05,
                1.15,
                0xfef08a
              );
            }
            if (lv.respiratory) {
              gpuPool.spawn(
                (Math.random() - 0.5) * 0.16,
                1.08,
                0.15,
                (Math.random() - 0.5) * 0.75,
                -1.0,
                0,
                0.75,
                0.9,
                0x38bdf8
              );
            }
          } else if (sys === 'human_heart_circulatory' || sys === 'animal_mammal') {
            const oxy = Math.random() > 0.48;
            gpuPool.spawn(
              oxy ? 0.25 : -0.35,
              oxy ? -0.45 : 0.75,
              (Math.random() - 0.5) * 0.2,
              oxy ? (Math.random() - 0.5) * 0.2 : 0.12,
              oxy ? 1.45 : -1.25,
              (Math.random() - 0.5) * 0.2,
              1.1,
              1.0,
              oxy ? 0xf43f5e : 0x3b82f6
            );
          } else if (sys === 'human_respiratory' || sys === 'animal_bird') {
            const o2 = Math.random() > 0.45;
            gpuPool.spawn(
              (Math.random() - 0.5) * 0.18,
              o2 ? 1.45 : -0.25,
              0.08,
              (Math.random() - 0.5) * 0.65,
              o2 ? -1.4 : 1.35,
              (Math.random() - 0.5) * 0.25,
              0.95,
              1.0,
              o2 ? 0x38bdf8 : 0xfbbf24
            );
          } else if (sys === 'human_nervous') {
            gpuPool.spawn(
              (Math.random() - 0.5) * 0.35,
              1.15,
              (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 0.1,
              -2.1,
              0,
              1.1,
              1.0,
              0xfef08a
            );
          } else if (sys === 'animal_fish') {
            // Water O2 flow past gills left-to-right
            gpuPool.spawn(
              -1.45,
              (Math.random() - 0.5) * 0.45,
              (Math.random() - 0.5) * 0.25,
              1.75,
              (Math.random() - 0.5) * 0.15,
              0,
              1.2,
              1.0,
              0x22d3ee
            );
          } else {
            gpuPool.spawn(
              (Math.random() - 0.5) * 0.9,
              -0.8,
              (Math.random() - 0.5) * 0.4,
              0,
              1.1,
              0,
              1.0,
              1.0,
              0x34d399
            );
          }
        }
        gpuPool.update(dt, 0);
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
        if (camera.position.distanceTo(cameraLerpRef.current.pos) < 0.04) cameraLerpRef.current = null;
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
      const nw = container.clientWidth || 860;
      const nh = container.clientHeight || 540;
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
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      entriesRef.current.forEach((e) => e.labelObj.dispose());
      gpuPool.dispose();
      controls.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [isSoftwareGl]);

  // Build / swap detailed composite 3D anatomical models whenever systemId changes
  useEffect(() => {
    const root = specimenRootRef.current;
    const shell = shellGroupRef.current;
    const lblGroup = labelGroupRef.current;
    if (!root || !shell || !lblGroup) return;

    // Clear previous organs & shell safely
    entriesRef.current.forEach((e) => {
      e.labelObj.dispose();
      lblGroup.remove(e.labelObj);
      root.remove(e.group);
      e.group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
    });
    entriesRef.current = [];

    while (shell.children.length > 0) {
      const ch = shell.children[0];
      shell.remove(ch);
      ch.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
    }

    const makeTissueMat = (hex: number, roughness = 0.34, clearcoat = 0.62, opacity = 1) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: hex,
        emissive: hex,
        emissiveIntensity: 0.06,
        roughness,
        metalness: 0.04,
        clearcoat,
        clearcoatRoughness: 0.25,
        transparent: opacity < 1,
        opacity,
      });
      mat.userData.__baseEmissive = 0.06;
      return mat;
    };

    const makeXrayMat = (hex = 0x38bdf8, opacity = 0.12) =>
      new THREE.MeshPhysicalMaterial({
        color: hex,
        transparent: true,
        opacity,
        roughness: 0.25,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

    const registerOrgan = (
      id: string,
      group: THREE.Group,
      animate?: (elapsed: number, rate: number) => void
    ) => {
      const meta = activeSystem.organs.find((o) => o.id === id);
      if (!meta) return;
      const meshes: THREE.Mesh[] = [];
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.userData.organId = id;
          obj.castShadow = !isSoftwareGl;
          obj.receiveShadow = true;
          meshes.push(obj);
        }
      });
      root.add(group);
      const labelObj = createLeaderArrowLabel({
        text: meta.nameVi.split('(')[0].trim(),
        labelPos: meta.labelPos,
        anchorPos: meta.anchorPos,
        fontSize: 0.205,
        color: new THREE.Color(meta.colorHex).getHex(),
      });
      lblGroup.add(labelObj);
      entriesRef.current.push({
        meta,
        group,
        basePos: group.position.clone(),
        meshes,
        labelObj,
        animate,
      });
    };

    const makeTube = (pts: [number, number, number][], radius: number, mat: THREE.Material, segs = 36) => {
      const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
      return new THREE.Mesh(new THREE.TubeGeometry(curve, segs, radius, 16, false), mat);
    };

    // ==================== 0. HUMAN FULL LAYERED PHYSIOLOGY MAP ====================
    if (systemId === 'human_full_layered') {
      // Translucent human head + torso X-ray silhouette
      const headShell = new THREE.Mesh(new THREE.SphereGeometry(0.62, 26, 20), makeXrayMat(0x38bdf8, 0.09));
      headShell.position.set(0, 1.52, 0);
      headShell.scale.set(0.88, 1.05, 0.98);
      const torsoShell = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 0.88, 2.35, 28, 1, true), makeXrayMat(0x38bdf8, 0.08));
      torsoShell.position.set(0, -0.05, 0);
      shell.add(headShell, torsoShell);

      // Layer 1: Nervous (Brain + Spinal Cord)
      const nervG = new THREE.Group();
      const brainMesh = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 18), makeTissueMat(0xfacc15, 0.36, 0.55));
      brainMesh.scale.set(0.95, 0.82, 1.05);
      brainMesh.position.set(0, 1.56, -0.04);
      const spineMesh = makeTube([[0, 1.25, -0.18], [0, -1.1, -0.22]], 0.085, makeTissueMat(0xfef08a, 0.28, 0.72));
      nervG.add(brainMesh, spineMesh);
      registerOrgan('layer_nervous_brain_spine', nervG, (t, bpm) => {
        const pulse = 0.06 + 0.16 * Math.abs(Math.sin((t * bpm) / 22));
        (spineMesh.material as THREE.MeshPhysicalMaterial).emissiveIntensity = pulse;
      });

      // Layer 2: Respiratory (Trachea + 2 Translucent Lungs)
      const respG = new THREE.Group();
      respG.add(makeTube([[0, 1.12, 0.08], [0, 0.56, 0.08]], 0.09, makeTissueMat(0xcbd5e1, 0.3, 0.5)));
      const rLung = new THREE.Mesh(new THREE.SphereGeometry(0.46, 24, 18), makeTissueMat(0x38bdf8, 0.32, 0.6, 0.62));
      rLung.scale.set(0.75, 1.25, 0.68);
      rLung.position.set(-0.56, 0.42, 0.05);
      const lLung = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 18), makeTissueMat(0x38bdf8, 0.32, 0.6, 0.62));
      lLung.scale.set(0.74, 1.2, 0.68);
      lLung.position.set(0.56, 0.42, 0.05);
      respG.add(rLung, lLung);
      registerOrgan('layer_respiratory_lungs', respG, (t, bpm) => {
        const inhale = 1 + 0.08 * Math.sin((t * bpm * Math.PI) / 140);
        rLung.scale.set(0.75 * inhale, 1.25 * inhale, 0.68 * inhale);
        lLung.scale.set(0.74 * inhale, 1.2 * inhale, 0.68 * inhale);
      });

      // Layer 3: Circulatory (Beating Heart + Aorta + Vessels)
      const circG = new THREE.Group();
      const heartCore = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 18), makeTissueMat(0xe11d48, 0.25, 0.8));
      heartCore.scale.set(0.9, 1.18, 0.85);
      heartCore.position.set(0.08, 0.36, 0.22);
      circG.add(heartCore);
      circG.add(makeTube([[0.08, 0.42, 0.22], [0.05, 0.92, 0.14], [-0.08, 0.85, -0.05], [-0.08, -0.95, -0.08]], 0.075, makeTissueMat(0xef4444)));
      circG.add(makeTube([[-0.18, 1.1, 0.02], [-0.15, -0.95, 0.02]], 0.06, makeTissueMat(0x3b82f6)));
      registerOrgan('layer_circulatory_heart', circG, (t, bpm) => {
        const beat = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
        heartCore.scale.set(0.9 * (1 - beat * 0.11), 1.18 * (1 - beat * 0.11), 0.85 * (1 - beat * 0.11));
      });

      // Layer 4: Digestive (Liver + J-Stomach + Intestines)
      const digG = new THREE.Group();
      const liverM = new THREE.Mesh(new THREE.SphereGeometry(0.38, 22, 16), makeTissueMat(0xb91c1c, 0.3, 0.68));
      liverM.scale.set(1.25, 0.68, 0.72);
      liverM.position.set(-0.34, -0.22, 0.18);
      const stomM = makeTube([[0.04, 0.15, 0.06], [0.38, -0.26, 0.2], [0.1, -0.44, 0.16]], 0.14, makeTissueMat(0xf472b6, 0.34, 0.55));
      const gutPts: [number, number, number][] = [];
      for (let i = 0; i <= 20; i++) {
        const u = i / 20;
        gutPts.push([Math.sin(u * Math.PI * 4.5) * 0.42, -0.52 - u * 0.55, 0.15 + Math.cos(u * Math.PI * 4.5) * 0.1]);
      }
      const gutM = makeTube(gutPts, 0.08, makeTissueMat(0xfb923c, 0.38, 0.5), 48);
      digG.add(liverM, stomM, gutM);
      registerOrgan('layer_digestive_gut', digG, (t, bpm) => {
        const wave = 1 + 0.03 * Math.sin(t * (bpm / 36));
        gutM.scale.set(wave, 1, wave);
      });
    }

    // ==================== 1. HUMAN HEART & CIRCULATORY ====================
    else if (systemId === 'human_heart_circulatory') {
      // Translucent pericardium shell
      const peri = new THREE.Mesh(new THREE.SphereGeometry(1.42, 32, 24), makeXrayMat(0xf43f5e, 0.1));
      peri.scale.set(0.95, 1.15, 0.82);
      shell.add(peri);

      const lvG = new THREE.Group();
      const lvMesh = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), makeTissueMat(0xe11d48, 0.3, 0.72));
      lvMesh.scale.set(0.85, 1.32, 0.85);
      lvMesh.position.set(0.28, -0.42, 0.05);
      lvMesh.rotation.z = 0.25;
      lvG.add(lvMesh);
      registerOrgan('left_ventricle', lvG, (t, bpm) => {
        const beat = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
        lvG.scale.setScalar(1 - beat * 0.085);
      });

      const rvG = new THREE.Group();
      const rvMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 24), makeTissueMat(0x2563eb, 0.32, 0.68));
      rvMesh.scale.set(0.9, 1.2, 0.82);
      rvMesh.position.set(-0.34, -0.34, 0.14);
      rvMesh.rotation.z = 0.2;
      rvG.add(rvMesh);
      registerOrgan('right_ventricle', rvG, (t, bpm) => {
        const beat = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
        rvG.scale.setScalar(1 - beat * 0.075);
      });

      const laG = new THREE.Group();
      const laMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 28, 22), makeTissueMat(0xf43f5e, 0.32, 0.65));
      laMesh.position.set(0.46, 0.42, -0.08);
      laG.add(laMesh);
      [-0.12, 0.12].forEach((dy) => {
        laG.add(makeTube([[0.46, 0.42 + dy, -0.08], [1.05, 0.48 + dy * 1.4, -0.2]], 0.09, makeTissueMat(0xfb7185)));
      });
      registerOrgan('left_atrium', laG, (t, bpm) => {
        const atrial = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60 + 0.9)), 6);
        laG.scale.setScalar(1 - atrial * 0.06);
      });

      const raG = new THREE.Group();
      const raMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 22), makeTissueMat(0x3b82f6, 0.34, 0.62));
      raMesh.position.set(-0.48, 0.4, 0.02);
      raG.add(raMesh);
      registerOrgan('right_atrium', raG, (t, bpm) => {
        const atrial = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60 + 0.9)), 6);
        raG.scale.setScalar(1 - atrial * 0.06);
      });

      const aortaG = new THREE.Group();
      const aortaMat = makeTissueMat(0xef4444, 0.28, 0.72);
      aortaG.add(makeTube([[0.15, 0.2, 0], [0.22, 1.05, 0.05], [-0.15, 1.32, -0.15], [-0.3, 0.75, -0.45], [-0.25, -1.25, -0.4]], 0.17, aortaMat));
      // 3 superior branches
      aortaG.add(makeTube([[0.15, 1.18, 0.02], [0.24, 1.7, 0.04]], 0.065, aortaMat));
      aortaG.add(makeTube([[-0.02, 1.3, -0.06], [-0.02, 1.75, -0.05]], 0.058, aortaMat));
      aortaG.add(makeTube([[-0.18, 1.24, -0.16], [-0.28, 1.68, -0.18]], 0.06, aortaMat));
      registerOrgan('aortic_arch', aortaG, (t, bpm) => {
        const pulse = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60 - 0.3)), 6);
        aortaG.scale.setScalar(1 + pulse * 0.035);
      });

      const pulmG = new THREE.Group();
      const pulmMat = makeTissueMat(0x6366f1, 0.32, 0.6);
      pulmG.add(makeTube([[-0.22, 0.05, 0.35], [-0.08, 0.75, 0.38], [0.02, 0.92, 0.12]], 0.14, pulmMat));
      pulmG.add(makeTube([[0.02, 0.92, 0.12], [0.85, 0.98, -0.05]], 0.1, pulmMat));
      pulmG.add(makeTube([[0.02, 0.92, 0.12], [-0.85, 0.98, -0.05]], 0.1, pulmMat));
      registerOrgan('pulmonary_trunk', pulmG);

      const vcG = new THREE.Group();
      const vcMat = makeTissueMat(0x1d4ed8, 0.35, 0.55);
      vcG.add(makeTube([[-0.65, 1.65, -0.15], [-0.58, 0.55, -0.12]], 0.14, vcMat));
      vcG.add(makeTube([[-0.56, 0.25, -0.18], [-0.54, -1.25, -0.22]], 0.15, vcMat));
      registerOrgan('vena_cava', vcG);

      const corG = new THREE.Group();
      const corMat = makeTissueMat(0xfb923c, 0.28, 0.78);
      corG.add(makeTube([[0.08, 0.28, 0.45], [-0.02, -0.15, 0.58], [0.12, -0.78, 0.52]], 0.042, corMat));
      corG.add(makeTube([[-0.02, -0.15, 0.58], [0.46, -0.35, 0.46]], 0.034, corMat));
      corG.add(makeTube([[-0.18, 0.16, 0.5], [-0.45, -0.32, 0.48]], 0.035, corMat));
      registerOrgan('coronary_vessels', corG);
    }

    // ==================== 2. HUMAN RESPIRATORY ====================
    else if (systemId === 'human_respiratory') {
      const ribCage = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.42, 2.75, 28, 1, true), makeXrayMat(0x38bdf8, 0.1));
      shell.add(ribCage);

      const tracG = new THREE.Group();
      const cartilageMat = makeTissueMat(0xe2e8f0, 0.32, 0.55);
      tracG.add(makeTube([[0, 1.75, 0], [0, 0.62, 0]], 0.15, makeTissueMat(0xfda4af, 0.4, 0.45)));
      // Larynx shield & C-shaped rings
      const larynx = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.34, 20), cartilageMat);
      larynx.position.set(0, 1.58, 0.04);
      tracG.add(larynx);
      for (let i = 0; i < 9; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.026, 10, 24, Math.PI * 1.55), cartilageMat);
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = -Math.PI * 0.27;
        ring.position.set(0, 0.68 + i * 0.09, 0);
        tracG.add(ring);
      }
      registerOrgan('trachea', tracG);

      const bronG = new THREE.Group();
      const bMat = makeTissueMat(0x94a3b8, 0.35, 0.5);
      bronG.add(makeTube([[0, 0.65, 0], [-0.62, 0.25, 0]], 0.105, bMat));
      bronG.add(makeTube([[0, 0.65, 0], [0.64, 0.22, 0]], 0.105, bMat));
      bronG.add(makeTube([[-0.62, 0.25, 0], [-0.95, 0.55, 0.1]], 0.055, bMat));
      bronG.add(makeTube([[-0.62, 0.25, 0], [-1.05, -0.35, 0.1]], 0.055, bMat));
      bronG.add(makeTube([[0.64, 0.22, 0], [0.98, 0.52, 0.1]], 0.055, bMat));
      bronG.add(makeTube([[0.64, 0.22, 0], [1.02, -0.38, 0.1]], 0.055, bMat));
      registerOrgan('bronchi_tree', bronG);

      const rlG = new THREE.Group();
      const rlMat = makeTissueMat(0xfb7185, 0.42, 0.48, 0.88);
      const rSup = new THREE.Mesh(new THREE.SphereGeometry(0.56, 26, 20), rlMat);
      rSup.scale.set(0.88, 1.05, 0.85);
      rSup.position.set(-0.88, 0.52, 0);
      const rMid = new THREE.Mesh(new THREE.SphereGeometry(0.54, 26, 20), rlMat);
      rMid.scale.set(0.92, 0.72, 0.88);
      rMid.position.set(-0.92, -0.05, 0.12);
      const rInf = new THREE.Mesh(new THREE.SphereGeometry(0.62, 26, 20), rlMat);
      rInf.scale.set(0.98, 0.9, 0.92);
      rInf.position.set(-0.92, -0.58, -0.05);
      rlG.add(rSup, rMid, rInf);
      registerOrgan('right_lung', rlG, (t, resp) => {
        const inhale = 1 + 0.075 * (0.5 + 0.5 * Math.sin((t * resp * Math.PI) / 30));
        rlG.scale.set(inhale, 0.96 + (inhale - 1) * 0.9, inhale);
      });

      const llG = new THREE.Group();
      const llMat = makeTissueMat(0xf472b6, 0.42, 0.48, 0.88);
      const lSup = new THREE.Mesh(new THREE.SphereGeometry(0.56, 26, 20), llMat);
      lSup.scale.set(0.88, 1.12, 0.85);
      lSup.position.set(0.88, 0.44, 0);
      const lInf = new THREE.Mesh(new THREE.SphereGeometry(0.6, 26, 20), llMat);
      lInf.scale.set(0.94, 0.95, 0.92);
      lInf.position.set(0.94, -0.45, -0.04);
      llG.add(lSup, lInf);
      registerOrgan('left_lung', llG, (t, resp) => {
        const inhale = 1 + 0.075 * (0.5 + 0.5 * Math.sin((t * resp * Math.PI) / 30));
        llG.scale.set(inhale, 0.96 + (inhale - 1) * 0.9, inhale);
      });

      const diaG = new THREE.Group();
      const diaGeo = new THREE.SphereGeometry(1.48, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.46);
      const diaMesh = new THREE.Mesh(diaGeo, makeTissueMat(0xdc2626, 0.38, 0.45));
      diaMesh.scale.set(1.05, 0.48, 0.78);
      diaMesh.position.set(0, -1.32, 0);
      diaG.add(diaMesh);
      registerOrgan('diaphragm', diaG, (t, resp) => {
        const drop = -0.18 * (0.5 + 0.5 * Math.sin((t * resp * Math.PI) / 30));
        diaMesh.position.y = -1.24 + drop;
      });
    }

    // ==================== 3. HUMAN NERVOUS SYSTEM ====================
    else if (systemId === 'human_nervous') {
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(1.38, 32, 24), makeXrayMat(0xfacc15, 0.08));
      cranium.position.set(0, 0.72, 0);
      cranium.scale.set(0.95, 0.88, 1.15);
      shell.add(cranium);

      const frontG = new THREE.Group();
      const fMat = makeTissueMat(0xf59e0b, 0.45, 0.42);
      [-0.36, 0.36].forEach((hx) => {
        const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.56, 26, 22), fMat);
        lobe.scale.set(0.82, 0.88, 1.08);
        lobe.position.set(hx, 0.85, 0.48);
        frontG.add(lobe);
      });
      registerOrgan('frontal_lobe', frontG);

      const parG = new THREE.Group();
      const pMat = makeTissueMat(0xec4899, 0.45, 0.42);
      [-0.4, 0.4].forEach((hx) => {
        const par = new THREE.Mesh(new THREE.SphereGeometry(0.62, 26, 22), pMat);
        par.scale.set(0.84, 0.85, 1.1);
        par.position.set(hx, 0.82, -0.36);
        parG.add(par);
        const temp = new THREE.Mesh(new THREE.SphereGeometry(0.38, 22, 18), pMat);
        temp.scale.set(0.75, 0.68, 1.25);
        temp.position.set(hx * 1.35, 0.42, 0.04);
        parG.add(temp);
      });
      registerOrgan('parietal_occipital', parG);

      const cerG = new THREE.Group();
      const cerMat = makeTissueMat(0xa855f7, 0.48, 0.38);
      [-0.32, 0.32].forEach((cx) => {
        const c = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 18), cerMat);
        c.scale.set(1.0, 0.78, 0.9);
        c.position.set(cx, 0.16, -0.62);
        cerG.add(c);
      });
      registerOrgan('cerebellum', cerG);

      const bsG = new THREE.Group();
      bsG.add(makeTube([[0, 0.48, -0.05], [0, 0.1, -0.14], [0, -0.35, -0.2]], 0.18, makeTissueMat(0x38bdf8, 0.35, 0.55)));
      registerOrgan('brainstem', bsG);

      const scG = new THREE.Group();
      const scMat = makeTissueMat(0x22d3ee, 0.3, 0.68);
      scG.add(makeTube([[0, -0.32, -0.2], [0, -1.85, -0.15]], 0.1, scMat));
      const vertMat = makeTissueMat(0xe2e8f0, 0.38, 0.4, 0.36);
      for (let i = 0; i < 7; i++) {
        const v = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.15, 16), vertMat);
        v.position.set(0, -0.48 - i * 0.21, -0.18);
        scG.add(v);
      }
      registerOrgan('spinal_cord', scG, (t, hz) => {
        scMat.emissiveIntensity = 0.08 + 0.14 * (0.5 + 0.5 * Math.sin(t * (hz / 4)));
      });
    }

    // ==================== 4. HUMAN DIGESTIVE & RENAL ====================
    else if (systemId === 'human_digestive_renal') {
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.38, 3.0, 28, 1, true), makeXrayMat(0xf59e0b, 0.08));
      shell.add(torso);

      const livG = new THREE.Group();
      const livMat = makeTissueMat(0xb91c1c, 0.28, 0.72);
      const rLobe = new THREE.Mesh(new THREE.SphereGeometry(0.62, 26, 20), livMat);
      rLobe.scale.set(1.15, 0.78, 0.88);
      rLobe.position.set(-0.48, 0.72, 0.2);
      const lLobe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 18), livMat);
      lLobe.scale.set(1.1, 0.65, 0.75);
      lLobe.position.set(0.14, 0.78, 0.22);
      const gall = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 14), makeTissueMat(0x10b981, 0.25, 0.8));
      gall.scale.set(0.75, 1.3, 0.75);
      gall.position.set(-0.34, 0.35, 0.45);
      livG.add(rLobe, lLobe, gall);
      registerOrgan('liver_gallbladder', livG);

      const stomG = new THREE.Group();
      const sMat = makeTissueMat(0xf472b6, 0.35, 0.62);
      stomG.add(makeTube([[0.05, 1.55, 0.05], [0.12, 0.92, 0.12], [0.58, 0.58, 0.24], [0.46, 0.18, 0.28], [0.08, 0.15, 0.18]], 0.22, sMat));
      registerOrgan('stomach', stomG, (t, p) => {
        const wave = 1 + 0.035 * Math.sin(t * (p / 24));
        stomG.scale.set(wave, 1, wave);
      });

      const intG = new THREE.Group();
      const colonMat = makeTissueMat(0xd97706, 0.4, 0.48);
      intG.add(
        makeTube(
          [
            [-0.78, -1.1, 0.22],
            [-0.82, -0.05, 0.2],
            [0.0, 0.05, 0.32],
            [0.82, -0.02, 0.2],
            [0.78, -1.05, 0.18],
            [0.15, -1.35, 0.08],
          ],
          0.17,
          colonMat
        )
      );
      const smallPts: [number, number, number][] = [];
      for (let i = 0; i <= 24; i++) {
        const u = i / 24;
        smallPts.push([
          Math.sin(u * Math.PI * 5) * 0.46,
          -0.25 - u * 0.85,
          0.26 + Math.cos(u * Math.PI * 5) * 0.12,
        ]);
      }
      intG.add(makeTube(smallPts, 0.095, makeTissueMat(0xfb923c, 0.36, 0.55), 60));
      registerOrgan('intestines', intG);

      const kidG = new THREE.Group();
      const kMat = makeTissueMat(0x9f1239, 0.28, 0.72);
      const urMat = makeTissueMat(0xfacc15, 0.35, 0.5);
      [-0.65, 0.65].forEach((kx) => {
        const kid = new THREE.Mesh(new THREE.SphereGeometry(0.32, 22, 18), kMat);
        kid.scale.set(0.76, 1.32, 0.65);
        kid.position.set(kx, 0.05, -0.45);
        kidG.add(kid);
        kidG.add(makeTube([[kx * 0.88, -0.1, -0.42], [kx * 0.42, -1.25, -0.18]], 0.04, urMat));
      });
      const blad = new THREE.Mesh(new THREE.SphereGeometry(0.28, 22, 16), makeTissueMat(0xfbbf24, 0.32, 0.6));
      blad.position.set(0, -1.32, -0.12);
      kidG.add(blad);
      registerOrgan('kidneys_ureters', kidG);
    }

    // ==================== 5. ANIMAL: MAMMAL (RABBIT) ====================
    else if (systemId === 'animal_mammal') {
      const bodyShell = new THREE.Mesh(new THREE.SphereGeometry(1.4, 28, 22), makeXrayMat(0xf43f5e, 0.1));
      bodyShell.scale.set(1.45, 0.78, 0.68);
      shell.add(bodyShell);

      const skullG = new THREE.Group();
      const skull = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 18), makeTissueMat(0xfbbf24, 0.35, 0.45));
      skull.scale.set(1.25, 0.88, 0.78);
      skull.position.set(-1.32, 0.42, 0);
      skullG.add(skull);
      [-0.14, 0.14].forEach((ez) => {
        const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.75, 6, 12), makeTissueMat(0xfda4af, 0.4, 0.3, 0.55));
        ear.position.set(-1.05, 1.05, ez);
        ear.rotation.z = -0.35;
        skullG.add(ear);
      });
      registerOrgan('mammal_brain_skull', skullG);

      const mhG = new THREE.Group();
      const mh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 22, 18), makeTissueMat(0xe11d48, 0.28, 0.75));
      mh.scale.set(1.1, 0.95, 0.9);
      mh.position.set(-0.45, -0.2, 0.12);
      mhG.add(mh);
      registerOrgan('mammal_heart', mhG, (t, bpm) => {
        const b = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
        mhG.scale.setScalar(1 - b * 0.08);
      });

      const mlG = new THREE.Group();
      [-0.25, 0.25].forEach((lz) => {
        const lung = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 18), makeTissueMat(0xfb7185, 0.4, 0.5, 0.88));
        lung.scale.set(1.35, 0.82, 0.68);
        lung.position.set(-0.25, 0.12, lz);
        mlG.add(lung);
      });
      const dia = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 24), makeTissueMat(0xdc2626, 0.4, 0.4));
      dia.rotation.z = Math.PI / 2;
      dia.position.set(0.22, -0.02, 0);
      mlG.add(dia);
      registerOrgan('mammal_lungs_diaphragm', mlG, (t, r) => {
        const inh = 1 + 0.06 * Math.sin(t * (r / 20));
        mlG.scale.set(1, inh, inh);
      });

      const cecG = new THREE.Group();
      cecG.add(
        makeTube(
          [
            [0.38, 0.15, 0],
            [0.95, -0.05, 0.25],
            [1.25, -0.25, -0.15],
            [0.62, -0.4, -0.25],
          ],
          0.22,
          makeTissueMat(0xf97316, 0.36, 0.5)
        )
      );
      registerOrgan('mammal_cecum', cecG);
    }

    // ==================== 6. ANIMAL: BIRD (9 AIR SACS) ====================
    else if (systemId === 'animal_bird') {
      const birdShell = new THREE.Mesh(new THREE.SphereGeometry(1.32, 28, 20), makeXrayMat(0x22d3ee, 0.1));
      birdShell.scale.set(1.45, 0.85, 0.72);
      shell.add(birdShell);

      const bLungG = new THREE.Group();
      [-0.25, 0.25].forEach((lz) => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 0.28), makeTissueMat(0xf43f5e, 0.38, 0.5));
        l.position.set(-0.15, 0.42, lz);
        bLungG.add(l);
      });
      bLungG.add(makeTube([[-1.1, 0.65, 0], [-0.45, 0.42, 0]], 0.075, makeTissueMat(0xcbd5e1)));
      registerOrgan('bird_lungs', bLungG);

      const sacG = new THREE.Group();
      const sacMat = makeTissueMat(0x38bdf8, 0.18, 0.85, 0.62);
      const sacCoords: [number, number, number, number][] = [
        [-0.75, 0.15, 0, 0.22],
        [-0.55, 0.05, 0.35, 0.2],
        [-0.55, 0.05, -0.35, 0.2],
        [0.42, 0.12, 0.34, 0.26],
        [0.42, 0.12, -0.34, 0.26],
        [0.95, 0.05, 0.28, 0.3],
        [0.95, 0.05, -0.28, 0.3],
        [1.18, 0.2, 0, 0.24],
        [0.1, 0.1, 0, 0.22],
      ];
      const sacMeshes: THREE.Mesh[] = [];
      sacCoords.forEach(([x, y, z, r]) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), sacMat);
        m.position.set(x, y, z);
        sacG.add(m);
        sacMeshes.push(m);
      });
      registerOrgan('bird_air_sacs', sacG, (t, rate) => {
        const phase = Math.sin(t * (rate / 12));
        sacMeshes.forEach((m, idx) => {
          const isPost = idx >= 3;
          const s = 1 + 0.14 * (isPost ? phase : -phase);
          m.scale.setScalar(s);
        });
      });

      const bhG = new THREE.Group();
      const bh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 22, 18), makeTissueMat(0xe11d48, 0.26, 0.78));
      bh.scale.set(1.05, 1.2, 0.9);
      bh.position.set(-0.55, -0.15, 0);
      bhG.add(bh);
      registerOrgan('bird_heart', bhG, (t, r) => {
        const b = Math.pow(Math.max(0, Math.sin(t * (r / 8))), 4);
        bhG.scale.setScalar(1 - b * 0.08);
      });

      const keelG = new THREE.Group();
      const keel = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.45, 4), makeTissueMat(0xe2e8f0, 0.38, 0.45));
      keel.rotation.z = -Math.PI / 2;
      keel.scale.set(0.65, 1, 0.35);
      keel.position.set(-0.1, -0.68, 0);
      keelG.add(keel);
      registerOrgan('bird_keel', keelG);
    }

    // ==================== 7. ANIMAL: AMPHIBIAN (FROG) ====================
    else if (systemId === 'animal_amphibian') {
      const skinG = new THREE.Group();
      const skinMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.38, 30, 22),
        makeTissueMat(0x10b981, 0.22, 0.85, 0.34)
      );
      skinMesh.scale.set(1.42, 0.72, 0.92);
      skinG.add(skinMesh);
      registerOrgan('amph_skin', skinG);

      const h3G = new THREE.Group();
      const vCommon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 22, 18), makeTissueMat(0xa855f7, 0.28, 0.72));
      vCommon.position.set(-0.2, -0.18, 0.12);
      const aL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 14), makeTissueMat(0xf43f5e, 0.3, 0.65));
      aL.position.set(-0.36, 0.12, 0.24);
      const aR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 14), makeTissueMat(0x3b82f6, 0.3, 0.65));
      aR.position.set(-0.36, 0.12, -0.02);
      h3G.add(vCommon, aL, aR);
      registerOrgan('amph_heart_3', h3G, (t, r) => {
        const beat = Math.pow(Math.max(0, Math.sin(t * (r / 12))), 5);
        h3G.scale.setScalar(1 - beat * 0.08);
      });

      const plG = new THREE.Group();
      [-0.42, 0.42].forEach((pz) => {
        const sac = new THREE.Mesh(new THREE.SphereGeometry(0.36, 22, 18), makeTissueMat(0xf472b6, 0.36, 0.55, 0.78));
        sac.scale.set(1.25, 0.75, 0.68);
        sac.position.set(0.15, 0.12, pz);
        plG.add(sac);
      });
      registerOrgan('amph_lungs', plG, (t, r) => {
        plG.scale.setScalar(1 + 0.08 * Math.sin(t * (r / 15)));
      });
    }

    // ==================== 8. ANIMAL: FISH (2-CHAMBER & GILLS) ====================
    else if (systemId === 'animal_fish') {
      const fishShell = new THREE.Mesh(new THREE.SphereGeometry(1.42, 30, 20), makeXrayMat(0x06b6d4, 0.11));
      fishShell.scale.set(1.72, 0.72, 0.46);
      shell.add(fishShell);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.85, 4), makeXrayMat(0x06b6d4, 0.16));
      tail.rotation.z = Math.PI / 2;
      tail.scale.set(1, 1, 0.18);
      tail.position.set(2.35, 0, 0);
      shell.add(tail);

      const fhG = new THREE.Group();
      const fhMat = makeTissueMat(0x3b82f6, 0.28, 0.72);
      const fV = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16), fhMat);
      fV.position.set(-1.1, -0.35, 0);
      const fA = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 14), makeTissueMat(0x1d4ed8, 0.3, 0.65));
      fA.position.set(-0.85, -0.25, 0);
      fhG.add(fV, fA);
      registerOrgan('fish_heart_2', fhG, (t, r) => {
        const b = Math.pow(Math.max(0, Math.sin(t * (r / 14))), 5);
        fhG.scale.setScalar(1 - b * 0.085);
      });

      const gillG = new THREE.Group();
      const gMat = makeTissueMat(0xef4444, 0.32, 0.65);
      for (let i = 0; i < 4; i++) {
        [-0.22, 0.22].forEach((gz) => {
          const arc = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.045, 10, 20, Math.PI * 0.9), gMat);
          arc.position.set(-1.05 + i * 0.11, 0.05, gz);
          arc.rotation.z = -Math.PI * 0.45;
          gillG.add(arc);
        });
      }
      registerOrgan('fish_gills', gillG, (t, r) => {
        gillG.scale.z = 1 + 0.08 * Math.sin(t * (r / 14));
      });

      const sbG = new THREE.Group();
      const sb = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.05, 8, 16), makeTissueMat(0xe0f2fe, 0.12, 0.9, 0.72));
      sb.rotation.z = Math.PI / 2;
      sb.position.set(0.25, 0.28, 0);
      sbG.add(sb);
      registerOrgan('fish_swim_bladder', sbG, (t, r) => {
        sbG.scale.setScalar(1 + 0.03 * Math.sin(t * (r / 20)));
      });

      const latG = new THREE.Group();
      const lMat = makeTissueMat(0x22d3ee, 0.25, 0.8);
      [-0.46, 0.46].forEach((lz) => {
        latG.add(makeTube([[-0.85, 0.1, lz * 0.6], [0.2, 0.12, lz], [1.65, 0.04, lz * 0.45]], 0.03, lMat));
      });
      registerOrgan('fish_lateral_line', latG);
    }
  }, [systemId, activeSystem, isSoftwareGl]);

  const setCameraPreset = (preset: QuickCamPreset) => {
    if (preset === 'iso') {
      cameraLerpRef.current = { pos: new THREE.Vector3(2.9, 1.35, 5.25), target: new THREE.Vector3(0, 0.1, 0) };
    } else if (preset === 'top') {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 6.2, 0.8), target: new THREE.Vector3(0, 0, 0) };
    } else {
      cameraLerpRef.current = { pos: new THREE.Vector3(0, 0.2, 5.4), target: new THREE.Vector3(0, 0.1, 0) };
    }
  };

  const exportAnatomyMarkdown = () => {
    const lines = [
      `# HỒ SƠ GIẢI PHẪU 3D CHUYÊN SÂU — ${activeSystem.titleVi.toUpperCase()}`,
      `- Phân hệ: ${activeSystem.badgeVi}`,
      `- Tổng quan: ${activeSystem.summaryVi}`,
      '',
      '## Kiến thức trọng tâm',
      ...activeSystem.keyFactsVi.map((f) => `- ${f}`),
      '',
      `## Chi tiết Cơ quan đang khảo sát: ${selectedOrgan.nameVi} (${selectedOrgan.latinName})`,
      `- Chức năng sinh lí: ${selectedOrgan.roleVi}`,
      `- Cấu tạo mô học: ${selectedOrgan.histologyVi}`,
      `- So sánh tiến hóa: ${selectedOrgan.evolutionNoteVi}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-bio-anatomy-${systemId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const realmSystems = useMemo(
    () => ANATOMY_SYSTEMS.filter((s) => s.realm === realm),
    [realm]
  );

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[100] bg-slate-950 p-3 sm:p-4 overflow-y-auto space-y-4'
          : 'space-y-4'
      }
    >
      {/* Header & Realm Switch */}
      <div className="rounded-2xl border border-teal-500/35 bg-slate-950/95 p-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shrink-0">
            <Microscope className="w-5 h-5 text-teal-300" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
              Phòng Giải Phẫu 3D Cơ Thể Người &amp; Động Vật Chuyên Sâu
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              Chạm trực tiếp vào cơ quan 3D, tách lớp không gian, bật/tắt 4 lớp cơ quan, cắt mặt phẳng X/Y/Z và đối chiếu tiến hóa
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (realm !== 'human') handleSelectSystem('human_full_layered');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-colors ${
              realm === 'human'
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-rose-400'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Cơ thể Người (5 chế độ)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (realm !== 'animal') handleSelectSystem('animal_mammal');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-colors ${
              realm === 'animal'
                ? 'bg-teal-500 text-slate-950 border-teal-400'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-teal-400'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Cơ thể Động vật (4 lớp)</span>
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold cursor-pointer"
          >
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => captureCanvasPng(canvasRef.current, `synapse-anatomy-${systemId}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>
          <button
            type="button"
            onClick={exportAnatomyMarkdown}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Hồ sơ .MD</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((f) => !f)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold cursor-pointer text-teal-300"
            title={isFullscreen ? 'Thu gọn' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* System Selector Tabs */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${realm === 'human' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-2`}>
        {realmSystems.map((sys) => {
          const active = sys.id === systemId;
          return (
            <button
              key={sys.id}
              type="button"
              onClick={() => handleSelectSystem(sys.id)}
              className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                active
                  ? 'border-teal-400 bg-teal-500/15 text-white shadow-[0_0_20px_-6px_rgba(20,184,166,0.5)]'
                  : 'border-slate-800 bg-slate-950/90 text-slate-300 hover:border-teal-500/50'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 truncate">
                {sys.badgeVi}
              </div>
              <div className="text-xs sm:text-sm font-extrabold mt-0.5 truncate">{sys.titleVi}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{sys.subtitleVi}</div>
            </button>
          );
        })}
      </div>

      {/* Interactive Layer Toggle Bar for Full Human Map */}
      {systemId === 'human_full_layered' && (
        <div className="rounded-xl border border-rose-500/35 bg-slate-950/90 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
          <span className="font-bold text-rose-300 inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Bật / Tắt từng Lớp Cơ Quan (Giữ đồng thời để đối chiếu vị trí &amp; nhịp sinh lí):
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'circulatory', label: 'Hệ Tuần Hoàn (Tim đập)', color: 'border-rose-400 bg-rose-500/20 text-rose-200' },
                { id: 'respiratory', label: 'Hệ Hô Hấp (Phổi thở)', color: 'border-sky-400 bg-sky-500/20 text-sky-200' },
                { id: 'nervous', label: 'Hệ Thần Kinh (Xung não–tủy)', color: 'border-amber-400 bg-amber-500/20 text-amber-200' },
                { id: 'digestive', label: 'Hệ Tiêu Hóa (Nhu động)', color: 'border-orange-400 bg-orange-500/20 text-orange-200' },
              ] as const
            ).map((layer) => {
              const on = layerVis[layer.id];
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setLayerVis((prev) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
                    on ? layer.color : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {on ? '✓ ' : '○ '}
                  {layer.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Split: 3D Dissection Stage + Anatomical Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-8 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
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

          <div
            className={`relative w-full bg-[#040914] ${
              isFullscreen ? 'h-[620px] sm:h-[74vh]' : 'h-[560px] sm:h-[650px]'
            }`}
          >
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
          </div>

          {/* Interactive Dissection Controls */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/95 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-white">
            <label className="space-y-1 rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
              <div className="flex justify-between font-bold">
                <span className="inline-flex items-center gap-1 text-teal-300">
                  <Layers className="w-3.5 h-3.5" /> Tách lớp Giải phẫu
                </span>
                <span className="font-mono tabular-nums text-teal-300">{explodePct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={explodePct}
                onChange={(e) => setExplodePct(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </label>

            <label className="space-y-1 rounded-xl bg-slate-950/80 border border-slate-800 p-2.5">
              <div className="flex justify-between font-bold">
                <span className="inline-flex items-center gap-1 text-rose-300">
                  <Activity className="w-3.5 h-3.5" /> {activeSystem.defaultRateLabel}
                </span>
                <span className="font-mono tabular-nums text-rose-300">
                  {rateValue} {activeSystem.defaultRateUnit}
                </span>
              </div>
              <input
                type="range"
                min={activeSystem.defaultRateMin}
                max={activeSystem.defaultRateMax}
                step={2}
                value={rateValue}
                onChange={(e) => setRateValue(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </label>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-2.5 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setXrayShell((v) => !v)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer inline-flex items-center justify-center gap-1 ${
                  xrayShell
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Bone className="w-3.5 h-3.5" /> Vỏ X-Ray
              </button>
              <button
                type="button"
                onClick={() => setIsolateSelected((v) => !v)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer inline-flex items-center justify-center gap-1 ${
                  isolateSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Cô lập
              </button>
              <button
                type="button"
                onClick={() => setShowLabels((v) => !v)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer inline-flex items-center justify-center gap-1 ${
                  showLabels
                    ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <Tag className="w-3.5 h-3.5" /> Nhãn 3D
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Organ Selector + Deep Histology & Evolution Inspector */}
        <div className="xl:col-span-4 space-y-4">
          {/* Organ Chips */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                {realm === 'human' ? <Brain className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
                <span>Bộ phận trong Hệ ({activeSystem.organs.length})</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setExplodePct(0);
                  setIsolateSelected(false);
                }}
                className="text-[10px] font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Hợp nhất
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-1.5">
              {activeSystem.organs.map((org) => {
                const isSel = org.id === selectedOrgan.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => setSelectedOrganId(org.id)}
                    className={`rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                      isSel
                        ? 'border-teal-400 bg-teal-500/15 text-white'
                        : 'border-slate-800 bg-slate-900/75 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: org.colorHex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{org.nameVi}</div>
                      <div className="text-[10px] italic text-slate-400 truncate">{org.latinName}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Organ Detail Card */}
          <div className="rounded-2xl border border-teal-500/35 bg-slate-950 p-4 text-white space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400">
                  Hồ sơ Bộ phận Đang Chọn
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">{selectedOrgan.nameVi}</h3>
                <div className="text-xs italic text-slate-400">{selectedOrgan.latinName}</div>
              </div>
              <span
                className="w-4 h-4 rounded-md border border-white/25 shrink-0 mt-1"
                style={{ backgroundColor: selectedOrgan.colorHex }}
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5">
                <div className="text-[10px] font-bold uppercase text-rose-300 mb-0.5">
                  Chức năng Sinh lí
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedOrgan.roleVi}</p>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5">
                <div className="text-[10px] font-bold uppercase text-sky-300 mb-0.5">
                  Cấu tạo Mô học &amp; Vi thể
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedOrgan.histologyVi}</p>
              </div>
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5">
                <div className="text-[10px] font-bold uppercase text-amber-300 mb-0.5">
                  So sánh Tiến hóa Động vật
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedOrgan.evolutionNoteVi}</p>
              </div>
            </div>

            {showTelemetry && (
              <MiniTelemetryChart
                title={activeSystem.telemetryLabel}
                series={[
                  {
                    id: systemId,
                    label: activeSystem.defaultRateLabel,
                    color: activeSystem.telemetryColor,
                    unit: activeSystem.telemetryUnit,
                    values: telemetryHistory,
                  },
                ]}
              />
            )}

            <div className="rounded-xl bg-teal-500/10 border border-teal-500/30 p-3 space-y-1.5">
              <div className="text-[11px] font-extrabold text-teal-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tổng hợp Giải phẫu Hệ</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{activeSystem.summaryVi}</p>
              <ul className="space-y-1 pt-1">
                {activeSystem.keyFactsVi.map((f, idx) => (
                  <li key={idx} className="text-[11px] text-slate-300 leading-snug">
                    • {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
