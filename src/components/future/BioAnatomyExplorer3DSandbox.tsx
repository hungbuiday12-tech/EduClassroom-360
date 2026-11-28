import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Activity,
  Bone,
  Brain,
  Camera,
  Crosshair,
  Dna,
  Download,
  Eye,
  EyeOff,
  FolderUp,
  HeartPulse,
  Layers,
  Maximize2,
  Microscope,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Sparkles,
  Tag,
  Wind,
  ZoomIn,
  ZoomOut,
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
import { applySphericalOrbitDelta } from '../../lib/remoteControlBus';
import { BioMaterialVault } from '../biology/engine/bioMaterials';
import {
  AnatomyBuildResult,
  AnatomySystemKey,
  buildHumanAnatomyExplorer,
} from '../biology/engine/bioAnatomyBuilder';
import { buildSculptedHumanSubScene } from '../biology/engine/bioAnatomySubScenes';
import { buildVertebrateAnimalScene } from '../biology/engine/bioVertebrateBuilders';
import {
  AnatomyGltfSlotSpec,
  fetchAnatomyBundledManifest,
  HUMAN_ANATOMY_ASSET_SLOTS,
  loadAnatomyGltfSource,
  normalizeAndBindGltfOrgan,
  resolveSlotAvailability,
  splitCompositeAnatomyGltf,
} from '../biology/engine/bioAnatomyAssetSystem';
import { AnatomyAssetManagerModal } from '../biology/AnatomyAssetManagerModal';
import { disposeObjectTreeFull } from '../biology/engine/bioGltfLoader';
import {
  CameraPose,
  computeFocusPoseFromBox3,
  computeZoomStepPose,
  resolveFocusBoxForPart,
  resolveObjectWorldBox3,
  stepSmoothCameraTransition,
} from '../biology/engine/bioCameraFocus';

type AnatomyRealm = 'human' | 'animal';
type LayerKey = AnatomySystemKey;

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

const ORGAN_TO_DETAILED_SYSTEM: Partial<Record<string, AnatomySystemId>> = {
  heart_circulatory: 'human_heart_circulatory',
  lungs_respiratory: 'human_respiratory',
  brain_nervous: 'human_nervous',
  liver_gallbladder: 'human_digestive_renal',
  stomach_intestines: 'human_digestive_renal',
  kidneys_urinary: 'human_digestive_renal',
};

const ANATOMY_SYSTEMS: SystemSpec[] = [
  {
    id: 'human_full_layered',
    realm: 'human',
    titleVi: 'Bản Đồ Cơ Thể Người 11 Hệ Cơ Quan',
    subtitleVi:
      '11 hệ: Xương · Cơ · Tuần hoàn · Hô hấp · Tiêu hóa · Thần kinh · Tiết niệu · Nội tiết · Miễn dịch · Sinh sản · Giác quan',
    badgeVi: 'GIẢI PHẪU NGƯỜI 3D · 11 HỆ',
    telemetryLabel: 'Nhịp Tim & Xung Thần Kinh Đồng Bộ',
    telemetryUnit: 'mV/mmHg',
    telemetryColor: '#f43f5e',
    telemetryMin: -20,
    telemetryMax: 130,
    defaultRateLabel: 'Nhịp Tim Cơ Bản',
    defaultRateMin: 45,
    defaultRateMax: 150,
    defaultRateVal: 72,
    defaultRateUnit: 'bpm',
    summaryVi:
      'Khám phá mô hình giải phẫu cơ thể người toàn thân với đầy đủ 11 hệ cơ quan chồng lớp theo đúng tỉ lệ giải phẫu. Bật/tắt từng hệ độc lập, điều chỉnh độ trong suốt lớp da–cơ–xương, ẩn/cô lập, tập trung camera chính xác và chuyển nhanh sang mô hình đơn chi tiết.',
    keyFactsVi: [
      'Tim nằm hơi lệch trái trong trung thất giữa, được lồng ngực xương sườn và hai lá phổi ôm sát.',
      'Trung khu hành não điều phối nhịp tim, nhịp thở qua cơ hoành và cân bằng nội môi qua tuyến nội tiết.',
      'Hệ miễn dịch (tuyến ức, lách, hạch bạch huyết), giác quan (mắt, tai trong) và sinh sản vùng chậu được tái hiện đồng bộ.',
    ],
    organs: [
      {
        id: 'brain_nervous',
        layerKey: 'nervous',
        nameVi: 'Não bộ & Tủy sống',
        latinName: 'Encephalon et Medulla spinalis',
        colorHex: '#facc15',
        roleVi: 'Trung tâm xử lí nhận thức, cảm giác, vận động và điều hòa phản xạ tự động toàn thân.',
        histologyVi: 'Chất xám vỏ đại não gấp nếp hồi não và bó sợi trắng myelin dẫn truyền tới 120 m/s.',
        evolutionNoteVi: 'Vỏ não mới (neocortex) và thùy trán phát triển vượt trội ở người.',
        explodeDir: [0, 0.32, -0.2],
        anchorPos: [0, 1.48, 0.05],
        labelPos: [-1.24, 1.66, 0.1],
      },
      {
        id: 'sensory_organs',
        layerKey: 'sensory',
        nameVi: 'Giác quan (Mắt & Tai trong)',
        latinName: 'Organa sensuum',
        colorHex: '#38bdf8',
        roleVi: 'Thu nhận ánh sáng hội tụ lên võng mạc và sóng âm – thăng bằng tại ốc tai, ống bán khuyên.',
        histologyVi: 'Tế bào nón/que ở hoàng điểm và tế bào lông cảm giác trên màng cơ sở ốc tai.',
        evolutionNoteVi: 'Thị giác hai mắt chồng trường nhìn giúp nhận thức chiều sâu 3D chính xác.',
        explodeDir: [0.16, 0.24, 0.28],
        anchorPos: [0.06, 1.44, 0.17],
        labelPos: [1.24, 1.56, 0.14],
      },
      {
        id: 'heart_circulatory',
        layerKey: 'circulatory',
        nameVi: 'Tim 4 ngăn & Hệ mạch lớn',
        latinName: 'Cor et Vasa sanguinea',
        colorHex: '#fb7185',
        roleVi: 'Co bóp bơm máu giàu O₂ qua động mạch chủ đi nuôi toàn thân và máu tĩnh mạch lên phổi.',
        histologyVi: 'Cơ tim phân nhánh nối đĩa xen kẽ giàu ti thể, nút xoang nhĩ (SA node) tự phát nhịp.',
        evolutionNoteVi: 'Hệ tuần hoàn kép 4 ngăn tách biệt hoàn toàn máu động mạch và tĩnh mạch.',
        explodeDir: [0.3, 0.08, 0.25],
        anchorPos: [0.06, 0.58, 0.16],
        labelPos: [-1.26, 0.74, 0.18],
      },
      {
        id: 'lungs_respiratory',
        layerKey: 'respiratory',
        nameVi: 'Phổi 3 thùy/2 thùy & Khí quản',
        latinName: 'Pulmones, Trachea et Diaphragma',
        colorHex: '#38bdf8',
        roleVi: 'Nhận O₂ và thải CO₂ qua hàng trăm triệu phế nang nhờ chuyển động cơ hoành.',
        histologyVi: 'Phổi phải 3 thùy, phổi trái 2 thùy có khuyết tim; màng hô hấp mỏng 0,5 µm.',
        evolutionNoteVi: 'Diện tích trao đổi khí đạt ~80 m² nhờ cấu trúc phân nhánh 23 thế hệ.',
        explodeDir: [0, 0.16, 0.24],
        anchorPos: [0.22, 0.68, 0.08],
        labelPos: [1.26, 0.78, 0.1],
      },
      {
        id: 'liver_gallbladder',
        layerKey: 'digestive',
        nameVi: 'Gan & Túi mật',
        latinName: 'Hepar et Vesica biliaris',
        colorHex: '#b91c1c',
        roleVi: 'Giải độc, tổng hợp protein huyết tương, dự trữ glycogen và sản xuất dịch mật.',
        histologyVi: 'Hàng trăm nghìn tiểu thùy gan lục giác bao quanh tĩnh mạch trung tâm.',
        evolutionNoteVi: 'Tuyến tiêu hóa lớn nhất trong khoang bụng động vật có xương sống.',
        explodeDir: [-0.34, 0, 0.22],
        anchorPos: [-0.14, 0.25, 0.14],
        labelPos: [-1.26, 0.28, 0.15],
      },
      {
        id: 'stomach_intestines',
        layerKey: 'digestive',
        nameVi: 'Dạ dày, Ruột non & Ruột già',
        latinName: 'Gaster, Intestinum tenue et crassum',
        colorHex: '#fb923c',
        roleVi: 'Tiêu hóa cơ học – enzyme, hấp thụ dinh dưỡng qua vi nhung mao ruột non và tái hấp thu nước.',
        histologyVi: 'Niêm mạc dạ dày tiết HCl/pepsin; ruột non tăng diện tích hấp thụ gấp ~600 lần.',
        evolutionNoteVi: 'Ống tiêu hóa phân hóa thành từng đoạn chuyên biệt dọc trục cơ thể.',
        explodeDir: [0.16, -0.14, 0.28],
        anchorPos: [0.08, 0.02, 0.12],
        labelPos: [1.26, -0.02, 0.15],
      },
      {
        id: 'kidneys_urinary',
        layerKey: 'urinary',
        nameVi: 'Thận, Niệu quản & Bàng quang',
        latinName: 'Renes, Ureteres et Vesica urinaria',
        colorHex: '#be123c',
        roleVi: 'Siêu lọc huyết tương, cân bằng nước – điện giải – pH máu và đào thải urê.',
        histologyVi: 'Mỗi quả thận chứa ~1 triệu nephron có cầu thận Malpighi và quai Henle.',
        evolutionNoteVi: 'Quai Henle dài giúp động vật có vú cô đặc nước tiểu tiết kiệm nước.',
        explodeDir: [0, -0.18, -0.28],
        anchorPos: [0.14, 0.14, -0.04],
        labelPos: [-1.24, -0.22, -0.06],
      },
      {
        id: 'endocrine_glands',
        layerKey: 'endocrine',
        nameVi: 'Tuyến Nội tiết (Giáp · Thượng thận · Tụy)',
        latinName: 'Systema endocrinum',
        colorHex: '#f59e0b',
        roleVi: 'Tiết hormone (Thyroxine, Adrenaline, Insulin, Glucagon) điều hòa chuyển hóa và nội môi.',
        histologyVi: 'Các nang tuyến nội tiết không có ống dẫn, tiết thẳng hormone vào lưới mao mạch.',
        evolutionNoteVi: 'Điều hòa thể dịch phối hợp chặt chẽ với hệ thần kinh qua trục hạ đồi – tuyến yên.',
        explodeDir: [-0.22, 0.02, 0.12],
        anchorPos: [0.02, 0.99, 0.07],
        labelPos: [1.24, 1.14, 0.1],
      },
      {
        id: 'lymphatic_immune',
        layerKey: 'lymphatic',
        nameVi: 'Hệ Miễn dịch (Tuyến ức · Lách · Hạch)',
        latinName: 'Systema lymphoideum',
        colorHex: '#34d399',
        roleVi: 'Huấn luyện tế bào lympho T, lọc kháng nguyên trong máu/bạch huyết và đáp ứng miễn dịch đặc hiệu.',
        histologyVi: 'Mô bạch huyết giàu đại thực bào, tế bào B sinh kháng thể và tế bào T gây độc.',
        evolutionNoteVi: 'Miễn dịch thích ứng có trí nhớ miễn dịch đặc trưng ở động vật có hàm.',
        explodeDir: [0.28, 0.1, 0.14],
        anchorPos: [0.18, 0.3, 0.03],
        labelPos: [1.28, 0.42, 0.12],
      },
      {
        id: 'reproductive_pelvic',
        layerKey: 'reproductive',
        nameVi: 'Hệ Sinh sản vùng chậu',
        latinName: 'Systema genitale',
        colorHex: '#e879f9',
        roleVi: 'Sản sinh giao tử, tiết hormone sinh dục và bảo vệ – nuôi dưỡng phôi thai trong khung chậu.',
        histologyVi: 'Buồng trứng chứa nang noãn; thành tử cung gồm cơ trơn dày và lớp nội mạc chu kỳ.',
        evolutionNoteVi: 'Thụ tinh trong và nuôi thai trong tử cung ở thú có nhau thai.',
        explodeDir: [0, -0.22, 0.2],
        anchorPos: [0, -0.16, 0.02],
        labelPos: [1.24, -0.36, 0.08],
      },
      {
        id: 'skeletal_frame',
        layerKey: 'skeletal',
        nameVi: 'Hệ Xương (Sọ – Cột sống – Lồng ngực)',
        latinName: 'Systema skeletale',
        colorHex: '#e2e8f0',
        roleVi: 'Tạo khung nâng đỡ cơ thể, bảo vệ nội tạng quan trọng và dự trữ canxi – tủy tạo máu.',
        histologyVi: 'Mô xương đặc gồm các ống Havers đồng tâm kết hợp xương xốp giàu tủy đỏ.',
        evolutionNoteVi: 'Cột sống cong 4 đoạn chữ S giúp con người đi thẳng đứng thăng bằng.',
        explodeDir: [0, 0, -0.26],
        anchorPos: [-0.34, 0.54, 0.12],
        labelPos: [1.24, -0.72, 0.08],
      },
      {
        id: 'muscular_system',
        layerKey: 'muscular',
        nameVi: 'Hệ Cơ Vân (Ngực – Vai – Bụng – Chi)',
        latinName: 'Systema musculare',
        colorHex: '#c8484f',
        roleVi: 'Co rút tạo lực kéo xương quanh khớp giúp vận động, giữ tư thế và sinh nhiệt.',
        histologyVi: 'Sợi cơ vân đa nhân chứa tơ cơ actin và myosin xếp xen kẽ tạo vân ngang.',
        evolutionNoteVi: 'Hệ cơ bám xương phát triển đối kháng đồng vận linh hoạt.',
        explodeDir: [0, 0, 0.42],
        anchorPos: [-0.24, -0.52, 0.12],
        labelPos: [-1.24, -0.78, 0.12],
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
  const [systemId, setSystemId] = useState<AnatomySystemId>('human_full_layered');
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
  const [autoRotate, setAutoRotate] = useState(false);
  const [hiddenOrganIds, setHiddenOrganIds] = useState<string[]>([]);
  const [skinOpacity, setSkinOpacity] = useState(0.24);
  const [muscleOpacity, setMuscleOpacity] = useState(0.58);
  const [boneOpacity, setBoneOpacity] = useState(0.92);
  const [layerVis, setLayerVis] = useState<Record<LayerKey, boolean>>({
    skeletal: true,
    muscular: true,
    circulatory: true,
    respiratory: true,
    digestive: true,
    nervous: true,
    urinary: true,
    endocrine: true,
    lymphatic: true,
    reproductive: true,
    sensory: true,
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
  const cameraLerpRef = useRef<CameraPose | null>(null);
  const savedBookmarkRef = useRef<CameraBookmarkPose | null>(null);

  const specimenRootRef = useRef<THREE.Group | null>(null);
  const shellGroupRef = useRef<THREE.Group | null>(null);
  const labelGroupRef = useRef<THREE.Group | null>(null);
  const entriesRef = useRef<OrganSceneEntry[]>([]);
  const fullAnatomyRef = useRef<AnatomyBuildResult | null>(null);
  const fullAnatomyVaultRef = useRef<BioMaterialVault | null>(null);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [bundledAnatomyFiles, setBundledAnatomyFiles] = useState<string[]>([]);
  const [sessionUploadedSlots, setSessionUploadedSlots] = useState<Map<string, string>>(() => new Map());
  const sessionGltfCacheRef = useRef<Map<string, THREE.Group>>(new Map());
  const anatomyAssetSummary = useMemo(
    () => resolveSlotAvailability(bundledAnatomyFiles, sessionUploadedSlots),
    [bundledAnatomyFiles, sessionUploadedSlots]
  );

  // Live animation refs
  const systemRef = useRef<AnatomySystemId>(systemId);
  const selectedOrganRef = useRef<string>(selectedOrganId);
  const explodeRef = useRef<number>(explodePct);
  const xrayRef = useRef<boolean>(xrayShell);
  const isolateRef = useRef<boolean>(isolateSelected);
  const showLabelsRef = useRef<boolean>(showLabels);
  const pausedRef = useRef<boolean>(paused);
  const autoRotateRef = useRef<boolean>(autoRotate);
  const rateRef = useRef<number>(rateValue);
  const sliceEnabledRef = useRef<boolean>(sliceEnabled);
  const sliceAxisRef = useRef<SliceAxis>(sliceAxis);
  const sliceOffsetRef = useRef<number>(sliceOffset);
  const layerVisRef = useRef<Record<LayerKey, boolean>>(layerVis);
  const hiddenOrganIdsRef = useRef<ReadonlySet<string>>(new Set());
  const skinOpacityRef = useRef<number>(skinOpacity);
  const muscleOpacityRef = useRef<number>(muscleOpacity);
  const boneOpacityRef = useRef<number>(boneOpacity);

  systemRef.current = systemId;
  selectedOrganRef.current = selectedOrganId;
  explodeRef.current = explodePct;
  xrayRef.current = xrayShell;
  isolateRef.current = isolateSelected;
  showLabelsRef.current = showLabels;
  pausedRef.current = paused;
  autoRotateRef.current = autoRotate;
  rateRef.current = rateValue;
  sliceEnabledRef.current = sliceEnabled;
  sliceAxisRef.current = sliceAxis;
  sliceOffsetRef.current = sliceOffset;
  layerVisRef.current = layerVis;
  hiddenOrganIdsRef.current = useMemo(() => new Set(hiddenOrganIds), [hiddenOrganIds]);
  skinOpacityRef.current = skinOpacity;
  muscleOpacityRef.current = muscleOpacity;
  boneOpacityRef.current = boneOpacity;

  const selectedOrgan = useMemo(
    () => activeSystem.organs.find((o) => o.id === selectedOrganId) || activeSystem.organs[0],
    [activeSystem, selectedOrganId]
  );

  const focusOrganById = (organId: string) => {
    const root = specimenRootRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!root || !camera || !controls || !organId) return;
    if (systemRef.current === 'human_full_layered') {
      if (organId === 'skeletal_frame') {
        setBoneOpacity((v) => Math.max(v, 0.92));
      } else if (organId === 'muscular_system') {
        setMuscleOpacity((v) => Math.max(v, 0.72));
      } else {
        setSkinOpacity((v) => Math.min(v, 0.1));
        setMuscleOpacity((v) => Math.min(v, 0.12));
        setBoneOpacity((v) => Math.min(v, 0.25));
      }
    }
    const found = resolveFocusBoxForPart(root, organId);
    if (!found || found.box.isEmpty()) return;
    const pose = computeFocusPoseFromBox3(found.box, {
      fovDeg: camera.fov,
      aspect: camera.aspect,
      padding: 1.68,
      minDistance: systemRef.current === 'human_full_layered' ? 1.65 : 2.15,
      maxDistance: 12,
      currentCameraPos: camera.position,
      currentTarget: controls.target,
    });
    cameraLerpRef.current = pose;
  };

  const handleUploadAnatomyGltf = async (slot: AnatomyGltfSlotSpec, file: File) => {
    const raw = await loadAnatomyGltfSource(file);
    if (slot.organId === 'full_body_atlas') {
      const splitMap = splitCompositeAnatomyGltf(raw);
      if (splitMap.size === 0) {
        throw new Error(
          'Không tìm thấy tên lưới khớp cơ quan (ví dụ: Heart, Brain, Lung, Liver, Stomach, Kidney, Skeleton, Muscle).'
        );
      }
      setSessionUploadedSlots((prev) => {
        const next = new Map(prev);
        next.set(slot.slotId, file.name);
        splitMap.forEach((grp, orgId) => {
          sessionGltfCacheRef.current.set(orgId, grp.clone(true));
          fullAnatomyRef.current?.replaceOrganWithGltf(orgId, grp);
          next.set(orgId, `${file.name} (${orgId})`);
        });
        return next;
      });
      return;
    }

    const bound = normalizeAndBindGltfOrgan(raw, slot);
    sessionGltfCacheRef.current.set(slot.organId, bound.clone(true));
    fullAnatomyRef.current?.replaceOrganWithGltf(slot.organId, bound);
    setSessionUploadedSlots((prev) => {
      const next = new Map(prev);
      next.set(slot.organId, file.name);
      return next;
    });
  };

  const handleRestoreAnatomySlot = (organId: string) => {
    sessionGltfCacheRef.current.delete(organId);
    fullAnatomyRef.current?.restoreProceduralOrgan(organId);
    setSessionUploadedSlots((prev) => {
      const next = new Map(prev);
      next.delete(organId);
      return next;
    });
  };

  const handleZoomStep = (zoomFactor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const nextPos = computeZoomStepPose(
      camera.position,
      controls.target,
      zoomFactor,
      controls.minDistance,
      controls.maxDistance
    );
    cameraLerpRef.current = { position: nextPos, target: controls.target.clone() };
  };

  // Switch system helper
  const handleSelectSystem = (nextId: AnatomySystemId) => {
    const spec = ANATOMY_SYSTEMS.find((s) => s.id === nextId);
    if (!spec) return;
    setRealm(spec.realm);
    setSystemId(nextId);
    setSelectedOrganId(spec.organs[0].id);
    setRateValue(spec.defaultRateVal);
    setIsolateSelected(false);
    setHiddenOrganIds([]);
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
    controls.minDistance = 0.85;
    controls.maxDistance = 14;
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

      const candidateRoots = fullAnatomyRef.current
        ? fullAnatomyRef.current.interactables
        : entriesRef.current.flatMap((e) => e.meshes);
      const visibleCandidates = candidateRoots.filter((o) => {
        let p: THREE.Object3D | null = o;
        while (p) {
          if (!p.visible) return false;
          p = p.parent;
        }
        return true;
      });
      const hits = raycaster.intersectObjects(visibleCandidates, Boolean(fullAnatomyRef.current));
      if (hits.length > 0) {
        let cur: THREE.Object3D | null = hits[0].object;
        let hitOrganId: string | undefined;
        while (cur && !hitOrganId) {
          if (cur.userData?.organId) hitOrganId = String(cur.userData.organId);
          cur = cur.parent;
        }
        if (hitOrganId) {
          setSelectedOrganId(hitOrganId);
          if (systemRef.current === 'human_full_layered') {
            if (hitOrganId === 'skeletal_frame') {
              setBoneOpacity((v) => Math.max(v, 0.92));
            } else if (hitOrganId === 'muscular_system') {
              setMuscleOpacity((v) => Math.max(v, 0.72));
            } else {
              setSkinOpacity((v) => Math.min(v, 0.1));
              setMuscleOpacity((v) => Math.min(v, 0.12));
              setBoneOpacity((v) => Math.min(v, 0.25));
            }
          }
          const found = resolveFocusBoxForPart(specimenRoot, hitOrganId);
          if (found && !found.box.isEmpty()) {
            const pose = computeFocusPoseFromBox3(found.box, {
              fovDeg: camera.fov,
              aspect: camera.aspect,
              padding: 1.52,
              minDistance: 0.9,
              maxDistance: 12,
              currentCameraPos: camera.position,
              currentTarget: controls.target,
            });
            cameraLerpRef.current = pose;
          }
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
      const hiddenSet = hiddenOrganIdsRef.current;

      if (shellGroupRef.current) {
        shellGroupRef.current.visible = xrayRef.current;
      }

      const lv = layerVisRef.current;
      const isLayeredMap = systemRef.current === 'human_full_layered';

      if (isLayeredMap && fullAnatomyRef.current) {
        fullAnatomyRef.current.applyState(
          {
            enabledSystems: lv,
            skinOpacity: skinOpacityRef.current,
            muscleOpacity: muscleOpacityRef.current,
            boneOpacity: boneOpacityRef.current,
            explode: expFrac,
            xray: xrayRef.current,
            hiddenPartIds: hiddenSet,
            isolatedPartId: iso ? selId : null,
          },
          elapsed,
          rateRef.current
        );
        const camDist = camera.position.distanceTo(controls.target);
        const closeZoom = camDist < 2.65;
        const zoomedOrIso = camDist < 3.6 || iso;
        entriesRef.current.forEach((entry) => {
          const organGrp = fullAnatomyRef.current?.organGroups.get(entry.meta.id);
          const orgVis = organGrp ? organGrp.visible : true;
          const hideOnFocus = closeZoom || (zoomedOrIso && Boolean(selId) && entry.meta.id !== selId);
          entry.labelObj.visible = orgVis && lblVisible && !hideOnFocus;
          const [lx, ly, lz] = entry.meta.labelPos;
          const [ax, ay, az] = entry.meta.anchorPos;
          const [ex, ey, ez] = entry.meta.explodeDir;
          entry.labelObj.setEndpoints(
            [lx + ex * expFrac * 0.45, ly + ey * expFrac * 0.45, lz + ez * expFrac * 0.45],
            [ax + ex * expFrac * 0.4, ay + ey * expFrac * 0.4, az + ez * expFrac * 0.4]
          );
        });
      } else {
        entriesRef.current.forEach((entry) => {
          const layerVisible =
            !hiddenSet.has(entry.meta.id) &&
            (!isLayeredMap || !entry.meta.layerKey || lv[entry.meta.layerKey]);
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
            if (mat.userData.__origOpacity === undefined) {
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

          const camDist = camera.position.distanceTo(controls.target);
          entry.labelObj.visible = layerVisible && lblVisible && camDist >= 2.75 && (!iso || isSel);
          const [lx, ly, lz] = entry.meta.labelPos;
          const [ax, ay, az] = entry.meta.anchorPos;
          entry.labelObj.setEndpoints(
            [lx + ex * expFrac * 0.45, ly + ey * expFrac * 0.45, lz + ez * expFrac * 0.45],
            [ax + entry.group.position.x, ay + entry.group.position.y, az + entry.group.position.z]
          );
        });
      }

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
        const settled = stepSmoothCameraTransition(
          camera,
          controls.target,
          cameraLerpRef.current,
          isSoftwareGl ? Math.max(dt * 3, 0.14) : dt,
          isSoftwareGl ? 14 : 7.5
        );
        if (settled) cameraLerpRef.current = null;
      }
      if (autoRotateRef.current) {
        applySphericalOrbitDelta(camera, controls.target, dt * 0.36, 0, 0, controls.minDistance, controls.maxDistance);
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
      if (fullAnatomyRef.current) {
        specimenRoot.remove(fullAnatomyRef.current.root);
        disposeObjectTreeFull(fullAnatomyRef.current.root);
        fullAnatomyRef.current = null;
      }
      fullAnatomyVaultRef.current?.disposeAll();
      fullAnatomyVaultRef.current = null;
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

    // Clear previous organs, full anatomy explorer & shell safely
    if (fullAnatomyRef.current) {
      root.remove(fullAnatomyRef.current.root);
      disposeObjectTreeFull(fullAnatomyRef.current.root);
      fullAnatomyRef.current = null;
    }
    fullAnatomyVaultRef.current?.disposeAll();
    fullAnatomyVaultRef.current = null;

    entriesRef.current.forEach((e) => {
      e.labelObj.dispose();
      lblGroup.remove(e.labelObj);
      root.remove(e.group);
      disposeObjectTreeFull(e.group);
    });
    entriesRef.current = [];

    while (shell.children.length > 0) {
      const ch = shell.children[0];
      shell.remove(ch);
      disposeObjectTreeFull(ch);
    }

    const registerOrgan = (
      id: string,
      group: THREE.Group,
      animate?: (elapsed: number, rate: number) => void
    ) => {
      const meta = activeSystem.organs.find((o) => o.id === id);
      if (!meta) return;
      group.userData.organId = id;
      group.userData.partId = id;
      group.userData.partLabel = meta.nameVi;
      const meshes: THREE.Mesh[] = [];
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.userData.organId = id;
          obj.userData.partId = id;
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
        fontSize: 0.13,
        color: new THREE.Color(meta.colorHex).getHex(),
        dotRadius: 0.016,
        arrowScale: 0,
        trimStart: 0.22,
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

    // ==================== 0. HUMAN FULL 11-SYSTEM ANATOMY EXPLORER ====================
    if (systemId === 'human_full_layered') {
      const vault = new BioMaterialVault(4, isSoftwareGl);
      fullAnatomyVaultRef.current = vault;
      const anatomy = buildHumanAnatomyExplorer(vault, isSoftwareGl);
      fullAnatomyRef.current = anatomy;
      root.add(anatomy.root);

      sessionGltfCacheRef.current.forEach((cachedGrp, orgId) => {
        anatomy.replaceOrganWithGltf(orgId, cachedGrp.clone(true));
      });

      const manifestAbort = new AbortController();
      void fetchAnatomyBundledManifest(manifestAbort.signal).then(async (bundled) => {
        if (manifestAbort.signal.aborted) return;
        setBundledAnatomyFiles(bundled);
        if (bundled.length === 0) return;

        const bundledLower = new Set(bundled.map((b) => b.toLowerCase()));
        if (bundledLower.has('human_anatomy_full.glb')) {
          try {
            const rawFull = await loadAnatomyGltfSource('./assets/anatomy/human_anatomy_full.glb', manifestAbort.signal);
            if (!manifestAbort.signal.aborted) {
              const splitMap = splitCompositeAnatomyGltf(rawFull);
              splitMap.forEach((grp, orgId) => {
                if (!sessionGltfCacheRef.current.has(orgId)) {
                  anatomy.replaceOrganWithGltf(orgId, grp);
                }
              });
            }
          } catch {
            // ignore optional composite load failure
          }
        }
        for (const slot of HUMAN_ANATOMY_ASSET_SLOTS) {
          if (slot.organId === 'full_body_atlas') continue;
          if (!bundledLower.has(slot.expectedFileName.toLowerCase())) continue;
          if (sessionGltfCacheRef.current.has(slot.organId)) continue;
          try {
            const raw = await loadAnatomyGltfSource(slot.expectedPublicPath, manifestAbort.signal);
            if (manifestAbort.signal.aborted) return;
            anatomy.replaceOrganWithGltf(slot.organId, normalizeAndBindGltfOrgan(raw, slot));
          } catch {
            // keep procedural PBR fallback
          }
        }
      });

      activeSystem.organs.forEach((meta) => {
        const labelObj = createLeaderArrowLabel({
          text: meta.nameVi.split('(')[0].trim(),
          labelPos: meta.labelPos,
          anchorPos: meta.anchorPos,
          fontSize: 0.115,
          color: new THREE.Color(meta.colorHex).getHex(),
          dotRadius: 0.016,
          arrowScale: 0,
          trimStart: 0.22,
        });
        lblGroup.add(labelObj);
        const grp = anatomy.organGroups.get(meta.id) || new THREE.Group();
        entriesRef.current.push({
          meta,
          group: grp,
          basePos: grp.position.clone(),
          meshes: [],
          labelObj,
        });
      });
    }

    // ==================== 1–4. SCULPTED HUMAN SUB-SCENES (HEART, RESPIRATORY, NERVOUS, GI/RENAL) ====================
    else if (
      systemId === 'human_heart_circulatory' ||
      systemId === 'human_respiratory' ||
      systemId === 'human_nervous' ||
      systemId === 'human_digestive_renal'
    ) {
      const vault = new BioMaterialVault(4, isSoftwareGl);
      fullAnatomyVaultRef.current = vault;
      buildSculptedHumanSubScene(systemId, shell, vault, isSoftwareGl, registerOrgan);
    }

    // ==================== 5–8. SCULPTED COMPARATIVE VERTEBRATE ANIMALS ====================
    else if (
      systemId === 'animal_mammal' ||
      systemId === 'animal_bird' ||
      systemId === 'animal_amphibian' ||
      systemId === 'animal_fish'
    ) {
      const vault = new BioMaterialVault(4, isSoftwareGl);
      fullAnatomyVaultRef.current = vault;
      buildVertebrateAnimalScene(systemId, shell, vault, isSoftwareGl, registerOrgan);
    }

    // Reset & frame full specimen cleanly whenever switching systems (never inherit previous close-up zoom)
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (cam && ctrl) {
      const specimenBox = resolveObjectWorldBox3(root);
      if (!specimenBox.isEmpty()) {
        const pose = computeFocusPoseFromBox3(specimenBox, {
          fovDeg: cam.fov,
          aspect: cam.aspect,
          padding: 1.5,
          minDistance: systemId === 'human_full_layered' ? 4.35 : 3.6,
          maxDistance: 12,
          preferredDirection: new THREE.Vector3(0.42, 0.2, 0.88),
        });
        cam.position.copy(pose.position);
        ctrl.target.copy(pose.target);
        ctrl.update();
        cameraLerpRef.current = null;
      }
    }
  }, [systemId, activeSystem, isSoftwareGl]);

  const setCameraPreset = (preset: QuickCamPreset) => {
    const root = specimenRootRef.current;
    const camera = cameraRef.current;
    let center = new THREE.Vector3(0, 0.1, 0);
    let radius = 2.4;
    if (root) {
      const box = resolveObjectWorldBox3(root);
      if (!box.isEmpty()) {
        const sp = new THREE.Sphere();
        box.getCenter(center);
        box.getBoundingSphere(sp);
        radius = Math.max(0.8, sp.radius);
      }
    }
    if (preset === 'iso' && camera && root) {
      const pose = computeFocusPoseFromBox3(resolveObjectWorldBox3(root), {
        fovDeg: camera.fov,
        aspect: camera.aspect,
        padding: 1.48,
        minDistance: 2.2,
        maxDistance: 12,
        preferredDirection: new THREE.Vector3(0.45, 0.24, 0.86),
      });
      cameraLerpRef.current = pose;
    } else if (preset === 'top') {
      cameraLerpRef.current = {
        position: center.clone().add(new THREE.Vector3(0, radius * 2.55, radius * 0.32)),
        target: center,
      };
    } else {
      cameraLerpRef.current = {
        position: center.clone().add(new THREE.Vector3(0, radius * 0.08, radius * 2.3)),
        target: center,
      };
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
              Chạm trực tiếp vào cơ quan 3D, tách lớp không gian, bật/tắt 11 hệ cơ quan + Da/Cơ/Xương, cắt mặt phẳng X/Y/Z và đối chiếu tiến hóa
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
            onClick={() => handleZoomStep(0.78)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoomStep(1.26)}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate((r) => !r)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
              autoRotate
                ? 'bg-teal-600 border-teal-400 text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="Xoay 360°"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">360°</span>
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
          {realm === 'human' && (
            <button
              type="button"
              onClick={() => setAssetModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-950/90 hover:bg-teal-900 border border-teal-500/50 text-teal-200 text-xs font-bold cursor-pointer"
              title="Quản lý & nạp mô hình giải phẫu GLB/GLTF"
            >
              <FolderUp className="w-3.5 h-3.5" />
              <span>
                GLB ({anatomyAssetSummary.readyCount}/{anatomyAssetSummary.totalSlots})
              </span>
            </button>
          )}
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
                  ? 'border-teal-400 bg-slate-900 ring-1 ring-teal-400/50 text-white shadow-[0_0_20px_-6px_rgba(20,184,166,0.5)]'
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

      {/* Interactive 11-System Layer Toggle Bar & Skin/Muscle/Bone Opacity for Full Human Map */}
      {systemId === 'human_full_layered' && (
        <div className="rounded-xl border border-teal-500/35 bg-slate-950/95 px-3.5 py-2.5 space-y-2.5 text-xs text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-teal-300 inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              11 Hệ Cơ Quan (Bật/tắt độc lập):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'skeletal', label: 'Hệ Xương', color: 'border-slate-300 bg-slate-200/20 text-slate-100' },
                  { id: 'muscular', label: 'Hệ Cơ', color: 'border-rose-400 bg-rose-500/20 text-rose-200' },
                  { id: 'circulatory', label: 'Tuần Hoàn', color: 'border-red-400 bg-red-500/20 text-red-200' },
                  { id: 'respiratory', label: 'Hô Hấp', color: 'border-sky-400 bg-sky-500/20 text-sky-200' },
                  { id: 'digestive', label: 'Tiêu Hóa', color: 'border-orange-400 bg-orange-500/20 text-orange-200' },
                  { id: 'nervous', label: 'Thần Kinh', color: 'border-amber-400 bg-amber-500/20 text-amber-200' },
                  { id: 'urinary', label: 'Tiết Niệu', color: 'border-pink-400 bg-pink-500/20 text-pink-200' },
                  { id: 'endocrine', label: 'Nội Tiết', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-200' },
                  { id: 'lymphatic', label: 'Miễn Dịch', color: 'border-teal-400 bg-teal-500/20 text-teal-200' },
                  { id: 'reproductive', label: 'Sinh Sản', color: 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-200' },
                  { id: 'sensory', label: 'Giác Quan', color: 'border-cyan-400 bg-cyan-500/20 text-cyan-200' },
                ] as const
              ).map((layer) => {
                const on = layerVis[layer.id];
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setLayerVis((prev) => ({ ...prev, [layer.id]: !prev[layer.id] }))}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-[11px]">
              <span className="font-bold text-amber-300 shrink-0">Độ rõ Da:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={skinOpacity}
                onChange={(e) => setSkinOpacity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="font-mono text-amber-200 w-9 text-right">{Math.round(skinOpacity * 100)}%</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-[11px]">
              <span className="font-bold text-rose-300 shrink-0">Độ rõ Cơ:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muscleOpacity}
                onChange={(e) => setMuscleOpacity(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <span className="font-mono text-rose-200 w-9 text-right">{Math.round(muscleOpacity * 100)}%</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-[11px]">
              <span className="font-bold text-slate-200 shrink-0">Độ rõ Xương:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={boneOpacity}
                onChange={(e) => setBoneOpacity(Number(e.target.value))}
                className="w-full accent-slate-300 cursor-pointer"
              />
              <span className="font-mono text-slate-200 w-9 text-right">{Math.round(boneOpacity * 100)}%</span>
            </label>
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
                  position: new THREE.Vector3(...bm.pos),
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
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                {realm === 'human' ? <Brain className="w-4 h-4" /> : <Wind className="w-4 h-4" />}
                <span>Bộ phận trong Hệ ({activeSystem.organs.length})</span>
              </span>
              <div className="flex items-center gap-2">
                {hiddenOrganIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHiddenOrganIds([])}
                    className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" /> Hiện tất cả ({hiddenOrganIds.length})
                  </button>
                )}
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-1.5">
              {activeSystem.organs.map((org) => {
                const isSel = org.id === selectedOrgan.id;
                const isHid = hiddenOrganIds.includes(org.id);
                return (
                  <div key={org.id} className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrganId(org.id);
                        focusOrganById(org.id);
                      }}
                      className={`flex-1 min-w-0 rounded-xl border px-3 py-2 text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                        isSel
                          ? 'border-teal-400 bg-teal-500/15 text-white'
                          : isHid
                          ? 'border-slate-800 bg-slate-900/40 text-slate-500 line-through'
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
                    <button
                      type="button"
                      onClick={() =>
                        setHiddenOrganIds((prev) =>
                          prev.includes(org.id) ? prev.filter((x) => x !== org.id) : [...prev, org.id]
                        )
                      }
                      className={`p-2 rounded-xl border cursor-pointer shrink-0 ${
                        isHid
                          ? 'border-amber-500/60 bg-amber-500/20 text-amber-200'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                      title={isHid ? 'Hiện bộ phận' : 'Ẩn bộ phận'}
                    >
                      {isHid ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
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
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => focusOrganById(selectedOrgan.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold cursor-pointer"
                  title="Tập trung camera vào bộ phận này"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Tập trung</span>
                </button>
                {systemId === 'human_full_layered' && ORGAN_TO_DETAILED_SYSTEM[selectedOrgan.id] && (
                  <button
                    type="button"
                    data-testid="sandbox-open-detailed-organ"
                    onClick={() => handleSelectSystem(ORGAN_TO_DETAILED_SYSTEM[selectedOrgan.id]!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer"
                    title="Chuyển sang mô hình giải phẫu đơn chi tiết của cơ quan này"
                  >
                    <Microscope className="w-3 h-3" />
                    <span>Mở mô hình đơn chi tiết</span>
                  </button>
                )}
                {(systemId === 'human_heart_circulatory' ||
                  systemId === 'human_respiratory' ||
                  systemId === 'human_nervous' ||
                  systemId === 'human_digestive_renal') && (
                  <button
                    type="button"
                    data-testid="sandbox-back-full-body"
                    onClick={() => handleSelectSystem('human_full_layered')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-teal-500/40 text-teal-200 text-[11px] font-bold cursor-pointer"
                    title="Quay lại bản đồ toàn thân 11 hệ"
                  >
                    <span>← Về Toàn thân 11 Hệ</span>
                  </button>
                )}
              </div>
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
      <AnatomyAssetManagerModal
        open={assetModalOpen}
        onClose={() => setAssetModalOpen(false)}
        bundledFiles={bundledAnatomyFiles}
        sessionUploadedSlots={sessionUploadedSlots}
        onUploadSlotFile={handleUploadAnatomyGltf}
        onRestoreSlot={handleRestoreAnatomySlot}
      />
    </div>
  );
};
