import { FilesetResolver, HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

export type HandGestureId =
  | 'none'
  | 'point_1'
  | 'pinch'
  | 'slice_2'
  | 'morph_3'
  | 'reassemble_4'
  | 'palm_5'
  | 'two_hand_10'
  | 'fist_0';

export type HandControlMode = 'auto' | 'right_only' | 'left_only' | 'two_hands_split';
export type PointerSource = 'index' | 'middle' | 'pinch_mid' | 'palm_center';
export type GraphicsQuality = 'ultra_light' | 'light' | 'high';
export type CameraResolutionId = '320x240' | '480x360' | '640x480';

export type GestureAction3D =
  | 'draw_neon'
  | 'pinch_stamp_scale'
  | 'slice_plane'
  | 'explode_layers'
  | 'reassemble_parts'
  | 'orbit_rotate'
  | 'dual_zoom_tilt'
  | 'freeze_lock'
  | 'auto_spin_toggle'
  | 'none';

export type GestureAction2D =
  | 'plot_draw'
  | 'grab_drag'
  | 'sweep_tangent'
  | 'cycle_symmetry'
  | 'rotate_pan'
  | 'dual_compass'
  | 'freeze_lock'
  | 'none';

export type ActiveGestureKey = Exclude<HandGestureId, 'none'>;

export interface GestureSettings {
  handMode: HandControlMode;
  pointerSource: PointerSource;
  sensitivityX: number; // 0.5 .. 2.0
  sensitivityY: number; // 0.5 .. 2.0
  rotationSensitivity: number; // 1.0 .. 4.0 (high responsiveness for 3D model spin)
  pinchSensitivity: number; // 0.6 .. 1.6
  fingerExtendSensitivity: number; // 0.6 .. 1.5
  smoothing: number; // 0.1 .. 0.9
  deadzone: number; // 0.000 .. 0.045
  stabilityFrames: number; // 1 .. 8
  gestureHoldMs: number; // 0 .. 1000
  trackingFps: 12 | 15 | 20 | 30;
  cameraResolution: CameraResolutionId;
  targetFpsCap: 30 | 60;
  mirrorCamera: boolean;
  invertX: boolean;
  invertY: boolean;
  graphicsQuality: GraphicsQuality;
  renderScale: number; // 0 = auto per graphicsQuality, or 0.5 | 0.65 | 0.85 | 1.0 | 1.5
  gestureActions3D: Record<ActiveGestureKey, GestureAction3D>;
  gestureActions2D: Record<ActiveGestureKey, GestureAction2D>;
}

export const DEFAULT_GESTURE_SETTINGS: GestureSettings = {
  handMode: 'auto',
  pointerSource: 'index',
  sensitivityX: 1.2,
  sensitivityY: 1.15,
  rotationSensitivity: 2.35,
  pinchSensitivity: 1.15,
  fingerExtendSensitivity: 1.0,
  smoothing: 0.4,
  deadzone: 0.005,
  stabilityFrames: 2,
  gestureHoldMs: 120,
  trackingFps: 15,
  cameraResolution: '480x360',
  targetFpsCap: 60,
  mirrorCamera: true,
  invertX: false,
  invertY: false,
  graphicsQuality: 'light',
  renderScale: 0.85,
  gestureActions3D: {
    point_1: 'draw_neon',
    pinch: 'pinch_stamp_scale',
    slice_2: 'slice_plane',
    morph_3: 'explode_layers',
    reassemble_4: 'reassemble_parts',
    palm_5: 'orbit_rotate',
    two_hand_10: 'dual_zoom_tilt',
    fist_0: 'freeze_lock'
  },
  gestureActions2D: {
    point_1: 'plot_draw',
    pinch: 'grab_drag',
    slice_2: 'sweep_tangent',
    morph_3: 'cycle_symmetry',
    reassemble_4: 'none',
    palm_5: 'none',
    two_hand_10: 'dual_compass',
    fist_0: 'freeze_lock'
  }
};

export interface GesturePresetSpec {
  id: string;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  patch: Partial<GestureSettings>;
}

export const GESTURE_PRESETS: GesturePresetSpec[] = [
  {
    id: 'potato_smooth',
    labelVi: 'Siêu nhẹ · Máy yếu',
    labelEn: 'Low-Spec Boost',
    descVi: 'Độ phân giải 0.5x, khóa 30 FPS, Cam 240p @ 12 FPS — hết lag hoàn toàn',
    descEn: '0.5x render resolution, 30 FPS cap, 240p Cam @ 12 FPS — zero lag',
    patch: {
      sensitivityX: 1.2,
      sensitivityY: 1.15,
      pinchSensitivity: 1.2,
      fingerExtendSensitivity: 1.05,
      smoothing: 0.42,
      deadzone: 0.006,
      stabilityFrames: 1,
      gestureHoldMs: 90,
      trackingFps: 12,
      cameraResolution: '320x240',
      targetFpsCap: 30,
      graphicsQuality: 'ultra_light',
      renderScale: 0.5
    }
  },
  {
    id: 'smooth_learn',
    labelVi: 'Mượt mà Cân bằng',
    labelEn: 'Balanced Smooth',
    descVi: 'Độ phân giải 0.85x, Cam 360p @ 15 FPS, chống giật nhẹ nhàng',
    descEn: '0.85x resolution, 360p Cam @ 15 FPS, smooth anti-jitter',
    patch: {
      sensitivityX: 1.2,
      sensitivityY: 1.15,
      pinchSensitivity: 1.15,
      fingerExtendSensitivity: 1.0,
      smoothing: 0.42,
      deadzone: 0.005,
      stabilityFrames: 2,
      gestureHoldMs: 120,
      trackingFps: 15,
      cameraResolution: '480x360',
      targetFpsCap: 60,
      graphicsQuality: 'light',
      renderScale: 0.85
    }
  },
  {
    id: 'fast_creative',
    labelVi: 'Sắc nét · Nhạy cao',
    labelEn: 'Crisp & Fast',
    descVi: 'Độ nét 1.0x HD, Cam 480p @ 30 FPS, phản hồi tức thì',
    descEn: '1.0x HD sharpness, 480p Cam @ 30 FPS, instant response',
    patch: {
      sensitivityX: 1.35,
      sensitivityY: 1.35,
      pinchSensitivity: 1.2,
      fingerExtendSensitivity: 1.1,
      smoothing: 0.28,
      deadzone: 0.004,
      stabilityFrames: 1,
      gestureHoldMs: 80,
      trackingFps: 30,
      cameraResolution: '640x480',
      targetFpsCap: 60,
      graphicsQuality: 'high',
      renderScale: 1.0
    }
  }
];

export const ACTION_3D_OPTIONS: { id: GestureAction3D; labelVi: string; labelEn: string }[] = [
  { id: 'draw_neon', labelVi: 'Vẽ ống Neon 3D / Dẫn IK', labelEn: 'Sculpt Neon / Drive IK' },
  { id: 'pinch_stamp_scale', labelVi: 'Đặt khối / Chỉnh tỷ lệ & RPM', labelEn: 'Stamp Block / Scale & RPM' },
  { id: 'slice_plane', labelVi: 'Kéo mặt cắt ngang 3D', labelEn: 'Slide 3D Clipping Plane' },
  { id: 'explode_layers', labelVi: 'Mở bung tách lớp mô hình', labelEn: 'Explode Model Layers' },
  { id: 'reassemble_parts', labelVi: 'Ghép mô hình về nguyên trạng (4 ngón)', labelEn: 'Reassemble Model (4 Fingers)' },
  { id: 'orbit_rotate', labelVi: 'Xoay 360° & Tách nhẹ', labelEn: '360° Orbit & Soft Explode' },
  { id: 'dual_zoom_tilt', labelVi: 'Thu phóng & Nghiêng 2 tay', labelEn: '2-Hand Zoom & Tilt' },
  { id: 'freeze_lock', labelVi: 'Khóa / Đóng băng thông số', labelEn: 'Freeze & Inspect' },
  { id: 'auto_spin_toggle', labelVi: 'Bật / Tắt Tự xoay', labelEn: 'Toggle Auto-Spin' },
  { id: 'none', labelVi: 'Không gán thao tác', labelEn: 'Disabled' }
];

export const ACTION_2D_OPTIONS: { id: GestureAction2D; labelVi: string; labelEn: string }[] = [
  { id: 'plot_draw', labelVi: 'Vẽ nét tự do / Kính vạn hoa', labelEn: 'Freehand / Kaleido Draw' },
  { id: 'grab_drag', labelVi: 'Gắp & Kéo đỉnh / Mảnh Tangram', labelEn: 'Grab & Drag Vertices / Tiles' },
  { id: 'sweep_tangent', labelVi: 'Quét góc / Cắt tuyến', labelEn: 'Sweep Angle / Secant' },
  { id: 'cycle_symmetry', labelVi: 'Đổi bậc đối xứng (4/6/8/12)', labelEn: 'Cycle Symmetry Order' },
  { id: 'rotate_pan', labelVi: 'Xoay bảng trục Oxy', labelEn: 'Rotate Oxy Canvas' },
  { id: 'dual_compass', labelVi: 'Compa 2 tay & 2 Vector u, v', labelEn: '2-Hand Compass & Dual Vectors' },
  { id: 'freeze_lock', labelVi: 'Khóa / Đóng băng hình', labelEn: 'Freeze Canvas' },
  { id: 'none', labelVi: 'Không gán thao tác', labelEn: 'Disabled' }
];

export const HAND_SKELETON_CONNECTIONS: readonly [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [0, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [0, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [5, 9],
  [9, 13],
  [13, 17]
];

export interface HandSkeletonData {
  handIndex: 0 | 1;
  handedness: string;
  pinching: boolean;
  landmarks: [number, number, number][]; // 21 quantized [x, y, z] normalized coords
}

export interface HandTipPoint {
  id: number; // 1..10 fixed finger slot
  handIndex: 0 | 1;
  fingerName: 'Cái' | 'Trỏ' | 'Giữa' | 'Áp út' | 'Út';
  x: number; // normalized [0..1], mirrored & mapped with sensitivity/invert
  y: number; // normalized [0..1]
  z: number; // relative depth from wrist
  extended: boolean;
}

export interface HandTrackingFrame {
  detected: boolean;
  ready: boolean;
  engine: 'mediapipe' | 'initializing' | 'error';
  errorMessage?: string;
  handCount: number;
  gesture: HandGestureId;
  candidateGesture: HandGestureId;
  gestureHoldProgress: number; // 0..1 fill toward 0.5s finger-settle delay
  gestureSettled: boolean;
  fingerCount: number; // extended fingers across 1 or 2 hands (0..10)
  trackedTipCount: number; // total visible fingertip sensors (0, 5, or 10)
  cursorX: number; // normalized [0..1]
  cursorY: number; // normalized [0..1]
  cursorDX: number; // frame-to-frame delta X
  cursorDY: number; // frame-to-frame delta Y
  hand1VelX: number; // normalized units/sec
  hand1VelY: number; // normalized units/sec
  pinchRatio: number; // 0..1
  hand1Pinching: boolean;
  hand2Pinching: boolean;
  hand1Index: { x: number; y: number } | null;
  hand2Index: { x: number; y: number } | null;
  handTiltAngle: number; // wrist -> middle MCP roll angle (radians)
  twoHandSpan: number; // normalized distance between two hands when handCount === 2
  twoHandSpanDelta: number; // frame-to-frame change in span (+ apart, - closer)
  twoHandOppositeSpread: boolean; // 2 hands pulling left & right in opposite directions
  twoHandMovingCloser: boolean; // 2 hands moving from far apart closer together
  twoHandAngle: number; // angle between left & right hands (radians)
  swipeEvent: 'left' | 'right' | null; // edge-triggered horizontal swipe
  thumbUp: boolean; // true when hand shows clean solo thumbs-up 👍 selection pose
  confidence: number; // 0..1
  tips: HandTipPoint[]; // up to 10 fingertip sensors locked to each fingertip
  skeletons: HandSkeletonData[]; // full 21-landmark skeletons for 3D Co-op rendering
}

export interface GestureMeta {
  id: ActiveGestureKey;
  fingers: string;
  labelVi: string;
  labelEn: string;
  actionVi: string;
  actionEn: string;
  accent: string;
}

export const REAL_GRAB_GESTURES: GestureMeta[] = [
  {
    id: 'palm_5',
    fingers: '🖐️',
    labelVi: 'Mở Tay · Di Chuyển Ngắm',
    labelEn: 'Open Hand · Move & Aim',
    actionVi: 'Di chuyển bàn tay mở qua linh kiện trên hàng ngang (hoặc mô hình) để ngắm chuẩn mà không làm xoay loạn.',
    actionEn: 'Glide your open hand over any component in the fixed horizontal row or model to aim steadily.',
    accent: '#22d3ee'
  },
  {
    id: 'point_1',
    fingers: '👍',
    labelVi: '1 Ngón Cái · Chọn Linh Kiện',
    labelEn: '1 Thumb Up · Select Part',
    actionVi: 'Di tay tới linh kiện muốn xem rồi giơ 1 ngón cái 👍 để chọn cố định & đọc chi tiết cấu tạo, chức năng.',
    actionEn: 'Move hand over a component and raise 1 thumb 👍 to select it and inspect its structure & function.',
    accent: '#f59e0b'
  },
  {
    id: 'slice_2',
    fingers: '✌️',
    labelVi: '2 Ngón V · Tách Hàng Ngang / Lắp',
    labelEn: '2 Fingers · Horizontal Row / Snap',
    actionVi: 'Giơ 2 ngón chữ V để xếp tất cả linh kiện thành 1 hàng ngang cố định; giơ lại 2 ngón để lắp khít về mô hình.',
    actionEn: 'Show V-sign (2 fingers) to line up all parts in 1 fixed horizontal row; repeat to snap back.',
    accent: '#a855f7'
  },
  {
    id: 'fist_0',
    fingers: '✊',
    labelVi: 'Nắm Đấm · Xoay Mô Hình (Khi Ghép)',
    labelEn: 'Fist · Rotate Model (Assembled)',
    actionVi: 'Khi mô hình đang ghép nguyên khối, nắm tay để xoay 360°; khi đã tách hàng ngang, vị trí linh kiện luôn cố định.',
    actionEn: 'When assembled, close fist to rotate 360°; while separated in a row, all parts stay locked in place.',
    accent: '#10b981'
  },
  {
    id: 'two_hand_10',
    fingers: '👐',
    labelVi: '2 Tay · Phóng To / Thu Nhỏ',
    labelEn: '2 Hands · Zoom In / Out',
    actionVi: 'Tách 2 bàn tay ra xa để Phóng To · Khép 2 bàn tay lại gần để Thu Nhỏ mượt mà.',
    actionEn: 'Spread both hands apart to Zoom In · Bring them closer to Zoom Out smoothly.',
    accent: '#38bdf8'
  }
];

export const SIMPLE_2D_GESTURES: GestureMeta[] = [
  {
    id: 'palm_5',
    fingers: '🖐️',
    labelVi: 'Mở 5 Ngón · Di Chuyển Ngắm (Không Vẽ)',
    labelEn: 'Open Hand · Aim & Hover Safely',
    actionVi: 'Di chuyển con trỏ trên bảng Oxy tự do mà không làm vẽ nhầm hay kéo lệch hình.',
    actionEn: 'Move your cursor freely across the Oxy board without drawing or dragging objects.',
    accent: '#22d3ee'
  },
  {
    id: 'point_1',
    fingers: '☝️',
    labelVi: '1 Ngón Trỏ · Vẽ Nét & Tạo Hình',
    labelEn: '1 Index Finger · Draw & Create',
    actionVi: 'Giơ 1 ngón trỏ (hoặc kéo chuột) để vẽ nét tự do, vẽ hình chuẩn, kẻ Kính vạn hoa & uốn Parabol.',
    actionEn: 'Point 1 index finger (or drag mouse) to draw freehand, shapes, Kaleidoscope & curves.',
    accent: '#34d399'
  },
  {
    id: 'pinch',
    fingers: '🤏',
    labelVi: 'Chụm Ngón · Gắp & Kéo Di Chuyển',
    labelEn: 'Pinch · Grab & Drag Anything',
    actionVi: 'Chụm ngón cái + trỏ để gắp & kéo đỉnh tam giác A/B/C, điểm P tiếp tuyến, hình đã vẽ hoặc mảnh Tangram.',
    actionEn: 'Pinch thumb + index to grab & drag vertices, tangent point P, drawn shapes or Tangram tiles.',
    accent: '#f59e0b'
  },
  {
    id: 'slice_2',
    fingers: '✌️',
    labelVi: '2 Ngón V · Xoay / Đổi Nhanh',
    labelEn: '2 Fingers · Rotate / Cycle Mode',
    actionVi: 'Giơ 2 ngón chữ V để xoay 45° mảnh Tangram, đổi số cánh Kính vạn hoa (4/6/8/12) hoặc quét đường cắt.',
    actionEn: 'Show 2 fingers to rotate Tangram tiles 45°, cycle Kaleidoscope axes, or sweep secant line.',
    accent: '#a855f7'
  },
  {
    id: 'fist_0',
    fingers: '✊',
    labelVi: 'Nắm Đấm · Khóa Bảng Đọc Tọa Độ',
    labelEn: 'Fist · Freeze Board & Inspect',
    actionVi: 'Nắm tay (0 ngón) để đứng yên bảng Oxy tức thì, dễ dàng đọc số đo chu vi, diện tích & phương trình.',
    actionEn: 'Close fist (0 fingers) to freeze the Oxy board instantly to inspect coordinates and metrics.',
    accent: '#64748b'
  }
];

export const GESTURE_DEFINITIONS: GestureMeta[] = [
  {
    id: 'point_1',
    fingers: '1',
    labelVi: '1 Ngón · Kéo Lên Phóng To / Vẽ',
    labelEn: '1 Finger · Pull Up Zoom / Draw',
    actionVi: '2D: Tự do vẽ & ghim điểm · 3D: Kéo 1 tay lên để phóng to mô hình (hoặc vẽ Neon)',
    actionEn: '2D: Freehand draw & plot · 3D: Pull 1 hand upward to zoom in (or sculpt Neon)',
    accent: '#22d3ee'
  },
  {
    id: 'pinch',
    fingers: '👌',
    labelVi: 'Chụm Ngón · Gắp & Điều Tốc',
    labelEn: 'Pinch · Grab & Modulate',
    actionVi: '2D: Gắp kéo hình & đỉnh · 3D: Đặt khối kiến tạo & tăng tua/tốc độ',
    actionEn: '2D: Grab & drag shapes · 3D: Stamp 3D blocks & throttle RPM/speed',
    accent: '#f59e0b'
  },
  {
    id: 'slice_2',
    fingers: '2',
    labelVi: '2 Ngón · Chọn Bộ Phận / Cắt',
    labelEn: '2 Fingers · Select Part / Slice',
    actionVi: '2D: Quét tiếp tuyến · 3D: Sau khi tách cấu trúc, giơ 2 ngón để chọn & xem riêng bộ phận',
    actionEn: '2D: Sweep secant · 3D: After exploding, show 2 fingers to isolate & inspect a part',
    accent: '#a855f7'
  },
  {
    id: 'morph_3',
    fingers: '3',
    labelVi: '3 Ngón · Chế Độ Bổ Trợ',
    labelEn: '3 Fingers · Auxiliary Mode',
    actionVi: '2D: Đổi bậc đối xứng · 3D: Vuốt trái/phải đổi bộ phận khi đang tách',
    actionEn: '2D: Cycle radial symmetry · 3D: Swipe left/right to cycle separated parts',
    accent: '#ec4899'
  },
  {
    id: 'reassemble_4',
    fingers: '4',
    labelVi: '4 Ngón · Ghép Mô Hình Về Lại',
    labelEn: '4 Fingers · Reassemble Model',
    actionVi: 'Sau khi tách cấu trúc hoặc đang xem riêng bộ phận, giơ 4 ngón (đợi 0.5s) để ghép về nguyên trạng',
    actionEn: 'After exploding or inspecting a part, raise 4 fingers (hold 0.5s) to reassemble the model',
    accent: '#f97316'
  },
  {
    id: 'palm_5',
    fingers: '5',
    labelVi: '5 Ngón · Xoay Nhạy Cao 360°',
    labelEn: '5 Fingers · High-Sens 360° Orbit',
    actionVi: '2D: Xoay bảng · 3D: Xoay mô hình hoặc bộ phận đang chọn 360° cực nhạy',
    actionEn: '2D: Rotate canvas · 3D: High-sensitivity 360° rotation of model or isolated part',
    accent: '#10b981'
  },
  {
    id: 'two_hand_10',
    fingers: '2 Tay',
    labelVi: '2 Tay · Kéo Ngang Tách · Khép Thu Nhỏ',
    labelEn: '2 Hands · Pull Apart Explode / Close Shrink',
    actionVi: 'Kéo 2 tay trái–phải ngược nhau để Tách xa cấu trúc · Đưa 2 tay lại gần để Thu nhỏ',
    actionEn: 'Pull 2 hands oppositely L/R to explode structure · Bring 2 hands closer to zoom out',
    accent: '#38bdf8'
  },
  {
    id: 'fist_0',
    fingers: '0',
    labelVi: 'Nắm Tay · Khóa Đọc Thông Tin',
    labelEn: 'Fist · Freeze & Read Info',
    actionVi: 'Đóng băng tức thì để đọc giới thiệu bộ phận, công thức & chụp ảnh nét',
    actionEn: 'Freeze motion instantly to read part details, formulas & capture crisp shots',
    accent: '#64748b'
  }
];

const FINGERTIP_INDICES = [4, 8, 12, 16, 20] as const;
const FINGER_PIP_INDICES = [3, 6, 10, 14, 18] as const;
const FINGER_MCP_INDICES = [2, 5, 9, 13, 17] as const;
const FINGER_NAMES: ('Cái' | 'Trỏ' | 'Giữa' | 'Áp út' | 'Út')[] = [
  'Cái',
  'Trỏ',
  'Giữa',
  'Áp út',
  'Út'
];

function dist2D(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp01(v: number): number {
  return Math.max(0.01, Math.min(0.99, v));
}

function isFingerExtended(
  hand: NormalizedLandmark[],
  fingerSlot: number,
  extendSensitivity = 1.0
): boolean {
  const wrist = hand[0];
  const mcp = hand[FINGER_MCP_INDICES[fingerSlot]];
  const pip = hand[FINGER_PIP_INDICES[fingerSlot]];
  const tip = hand[FINGERTIP_INDICES[fingerSlot]];
  if (!wrist || !mcp || !pip || !tip) return false;

  // Higher extendSensitivity (up to 1.5) lowers required extension ratio cleanly
  const ratioScale = Math.max(0.84, Math.min(1.16, 1.0 - (extendSensitivity - 1.0) * 0.22));

  if (fingerSlot === 0) {
    const pinkyMcp = hand[17];
    if (!pinkyMcp) return false;
    return dist2D(tip, pinkyMcp) > dist2D(pip, pinkyMcp) * (1.18 * ratioScale);
  }

  const dTipWrist = dist2D(tip, wrist);
  const dPipWrist = dist2D(pip, wrist);
  const dMcpWrist = dist2D(mcp, wrist);
  return dTipWrist > dPipWrist * (1.07 * ratioScale) && dTipWrist > dMcpWrist * (1.25 * ratioScale);
}

export interface TrackerProcessOptions {
  mirror: boolean;
  minimalControlMode?: boolean;
  sensitivity?: number;
  sensitivityX?: number;
  sensitivityY?: number;
  pinchSensitivity?: number;
  fingerExtendSensitivity?: number;
  smoothing: number;
  deadzone?: number;
  stabilityFrames?: number;
  gestureHoldMs?: number;
  handMode?: HandControlMode;
  pointerSource?: PointerSource;
  invertX?: boolean;
  invertY?: boolean;
}

export class HandGestureTracker {
  private landmarker: HandLandmarker | null = null;
  private initPromise: Promise<void> | null = null;
  private engineState: 'mediapipe' | 'initializing' | 'error' = 'initializing';
  private errorMessage: string | undefined;

  private lastVideoTime = -1;
  private lastTimestampMs = 0;

  // Per-tip smoothed coordinates for 10 finger slots (1..10)
  private smoothedTips: Map<number, { x: number; y: number; z: number }> = new Map();
  private smoothCursorX = 0.5;
  private smoothCursorY = 0.5;
  private prevCursorX = 0.5;
  private prevCursorY = 0.5;
  private prevH1X: number | null = null;
  private prevH2X: number | null = null;
  private prevProcessMs = 0;
  private lastSwipeAtMs = 0;
  private smoothSpan = 0.45;
  private prevSmoothSpan = 0.45;
  private smoothTwoHandAngle = 0;
  private smoothTiltAngle = 0;
  private hasCursorFix = false;

  private candidateGesture: HandGestureId = 'none';
  private candidateStreak = 0;
  private candidateSinceMs = 0;
  private stableGesture: HandGestureId = 'none';
  private missFrames = 0;
  private lastResultFrame: HandTrackingFrame | null = null;
  private skipUntilMs = 0;

  public async ensureInitialized(): Promise<boolean> {
    if (this.landmarker) {
      this.engineState = 'mediapipe';
      return true;
    }
    if (this.initPromise) {
      await this.initPromise;
      return Boolean(this.landmarker);
    }

    this.engineState = 'initializing';
    this.initPromise = (async () => {
      const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
      const normalizedBase = base.endsWith('/') ? base : `${base}/`;
      const localWasmPath = `${normalizedBase}mediapipe/wasm`;
      const localModelPath = `${normalizedBase}mediapipe/hand_landmarker.task`;

      const createLandmarker = async (wasmPath: string, modelPath: string, delegate: 'GPU' | 'CPU') => {
        const vision = await FilesetResolver.forVisionTasks(wasmPath);
        return HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: modelPath,
            delegate
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.55,
          minTrackingConfidence: 0.55
        });
      };

      try {
        try {
          this.landmarker = await createLandmarker(localWasmPath, localModelPath, 'GPU');
        } catch {
          this.landmarker = await createLandmarker(localWasmPath, localModelPath, 'CPU');
        }
        this.engineState = 'mediapipe';
        this.errorMessage = undefined;
      } catch (localErr) {
        try {
          const cdnWasm = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';
          const cdnModel =
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
          this.landmarker = await createLandmarker(cdnWasm, cdnModel, 'CPU');
          this.engineState = 'mediapipe';
          this.errorMessage = undefined;
        } catch (cdnErr) {
          this.engineState = 'error';
          this.errorMessage =
            cdnErr instanceof Error
              ? cdnErr.message
              : localErr instanceof Error
              ? localErr.message
              : 'Failed to load HandLandmarker';
        }
      }
    })();

    await this.initPromise;
    return Boolean(this.landmarker);
  }

  public resetSmoothing(): void {
    this.smoothedTips.clear();
    this.hasCursorFix = false;
    this.prevH1X = null;
    this.prevH2X = null;
    this.stableGesture = 'none';
    this.candidateGesture = 'none';
    this.candidateStreak = 0;
    this.candidateSinceMs = 0;
    this.lastResultFrame = null;
  }

  public process(video: HTMLVideoElement, options: TrackerProcessOptions): HandTrackingFrame {
    if (!this.landmarker) {
      if (!this.initPromise) {
        void this.ensureInitialized();
      }
      return this.emptyFrame();
    }

    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return this.lastResultFrame || this.emptyFrame();
    }

    if (video.currentTime === this.lastVideoTime && this.lastResultFrame) {
      return this.lastResultFrame;
    }
    this.lastVideoTime = video.currentTime;

    const wallNow = performance.now();
    if (wallNow < this.skipUntilMs && this.lastResultFrame) {
      return this.lastResultFrame;
    }

    const nowMs = Math.max(this.lastTimestampMs + 1, wallNow);
    const dtSec = this.prevProcessMs > 0 ? Math.max(0.016, Math.min(0.2, (nowMs - this.prevProcessMs) / 1000)) : 0.05;
    this.prevProcessMs = nowMs;
    this.lastTimestampMs = nowMs;

    const inferStart = performance.now();
    const result = this.landmarker.detectForVideo(video, nowMs);
    const inferElapsed = performance.now() - inferStart;
    if (inferElapsed > 34) {
      // Back off gently on slower CPUs so main-thread UI & 3D rendering stay fluid
      this.skipUntilMs = wallNow + Math.min(140, inferElapsed * 1.4);
    }
    const hands = result.landmarks || [];

    if (hands.length === 0) {
      this.missFrames++;
      if (this.missFrames > 5) {
        this.smoothedTips.clear();
        this.stableGesture = 'none';
        this.candidateGesture = 'none';
        this.candidateStreak = 0;
        this.candidateSinceMs = 0;
        this.hasCursorFix = false;
        this.prevH1X = null;
        this.prevH2X = null;
      }
      const empty = this.emptyFrame();
      this.lastResultFrame = empty;
      return empty;
    }

    this.missFrames = 0;
    const mirror = options.mirror;
    const sensX = options.sensitivityX ?? options.sensitivity ?? 1.05;
    const sensY = options.sensitivityY ?? options.sensitivity ?? 1.05;
    const pinchSens = options.pinchSensitivity ?? options.sensitivity ?? 1.05;
    const extendSens = options.fingerExtendSensitivity ?? 1.0;
    const smoothing = options.smoothing;
    const deadzone = options.deadzone ?? 0.008;
    const stabilityFrames = Math.max(1, Math.min(8, Math.round(options.stabilityFrames ?? 4)));
    const gestureHoldMs = Math.max(0, Math.min(1200, options.gestureHoldMs ?? 500));
    const handMode: HandControlMode = options.handMode ?? 'auto';
    const pointerSource: PointerSource = options.pointerSource ?? 'index';
    const invertX = options.invertX ?? false;
    const invertY = options.invertY ?? false;

    const tipAlpha = Math.max(0.22, Math.min(0.92, 1.0 - smoothing * 0.62));

    let indexedHands = hands.slice(0, 2).map((lmList, rawIdx) => {
      const wristX = mirror ? 1 - lmList[0].x : lmList[0].x;
      const handednessInfo = result.handedness?.[rawIdx]?.[0];
      const score = handednessInfo?.score ?? 0.9;
      const category = handednessInfo?.categoryName ?? '';
      return { lmList, wristX, score, category };
    });
    indexedHands.sort((a, b) => a.wristX - b.wristX);

    if (handMode === 'right_only' && indexedHands.length > 0) {
      if (indexedHands.length === 2) {
        indexedHands = [indexedHands[1]];
      } else {
        const only = indexedHands[0];
        const isRightScreen = only.wristX >= 0.32 || (mirror ? only.category === 'Left' : only.category === 'Right');
        if (!isRightScreen) indexedHands = [];
      }
    } else if (handMode === 'left_only' && indexedHands.length > 0) {
      if (indexedHands.length === 2) {
        indexedHands = [indexedHands[0]];
      } else {
        const only = indexedHands[0];
        const isLeftScreen = only.wristX <= 0.68 || (mirror ? only.category === 'Right' : only.category === 'Left');
        if (!isLeftScreen) indexedHands = [];
      }
    }

    if (indexedHands.length === 0) {
      const empty = this.emptyFrame();
      this.lastResultFrame = empty;
      return empty;
    }

    const mapCoord = (nx: number, ny: number): { x: number; y: number } => {
      let mx = clamp01(0.5 + (nx - 0.5) * sensX);
      let my = clamp01(0.5 + (ny - 0.5) * sensY);
      if (invertX) mx = 1 - mx;
      if (invertY) my = 1 - my;
      return { x: mx, y: my };
    };

    const tips: HandTipPoint[] = [];
    const skeletons: HandSkeletonData[] = [];
    let totalExtended = 0;
    let confSum = 0;
    let hand1Pinching = false;
    let hand2Pinching = false;
    let maxPinchRatio = 0;
    let handTiltAngle = this.smoothTiltAngle;
    let palmCenterH1: { x: number; y: number } | null = null;

    const pinchThreshold = 0.048 + (pinchSens - 1) * 0.022;
    const normPinchThreshold = 0.34 * (0.85 + pinchSens * 0.15);

    for (let hIdx = 0; hIdx < indexedHands.length; hIdx++) {
      const hEntry = indexedHands[hIdx];
      const handIdx = (hIdx === 0 ? 0 : 1) as 0 | 1;
      const lms = hEntry.lmList;
      confSum += hEntry.score;

      if (hIdx === 0 && lms[0] && lms[9]) {
        const wx = mirror ? 1 - lms[0].x : lms[0].x;
        const wy = lms[0].y;
        const mx = mirror ? 1 - lms[9].x : lms[9].x;
        const my = lms[9].y;
        handTiltAngle = Math.atan2(mx - wx, wy - my);
        palmCenterH1 = mapCoord((wx + mx) * 0.5, (wy + my) * 0.5);
      }

      const thumbTip = lms[4];
      const indexTip = lms[8];
      const thumbIndexDist = dist2D(thumbTip, indexTip);
      const handScaleRef = Math.max(0.08, dist2D(lms[0], lms[9]));
      const normPinchDist = thumbIndexDist / handScaleRef;
      const pinchRatio = Math.max(0, Math.min(1, 1 - normPinchDist * 1.45));
      if (pinchRatio > maxPinchRatio) maxPinchRatio = pinchRatio;
      const isPinch = thumbIndexDist < pinchThreshold || normPinchDist < normPinchThreshold;
      if (isPinch) {
        if (handIdx === 0) hand1Pinching = true;
        else hand2Pinching = true;
      }

      for (let f = 0; f < 5; f++) {
        const lm = lms[FINGERTIP_INDICES[f]];
        if (!lm) continue;

        const baseX = mirror ? 1 - lm.x : lm.x;
        const baseY = lm.y;
        const mapped = mapCoord(baseX, baseY);
        const rawZ = lm.z ?? 0;

        const slotId = handIdx * 5 + f + 1;
        const prev = this.smoothedTips.get(slotId);
        const sx = prev ? prev.x + (mapped.x - prev.x) * tipAlpha : mapped.x;
        const sy = prev ? prev.y + (mapped.y - prev.y) * tipAlpha : mapped.y;
        const sz = prev ? prev.z + (rawZ - prev.z) * tipAlpha : rawZ;
        this.smoothedTips.set(slotId, { x: sx, y: sy, z: sz });

        const ext = isFingerExtended(lms, f, extendSens);
        if (ext) totalExtended++;

        tips.push({
          id: slotId,
          handIndex: handIdx,
          fingerName: FINGER_NAMES[f],
          x: sx,
          y: sy,
          z: sz,
          extended: ext
        });
      }

      const skLandmarks: [number, number, number][] = [];
      for (let lmIdx = 0; lmIdx < 21; lmIdx++) {
        const rawLm = lms[lmIdx];
        if (!rawLm) {
          skLandmarks.push([0.5, 0.5, 0]);
          continue;
        }
        const bx = mirror ? 1 - rawLm.x : rawLm.x;
        const mappedLm = mapCoord(bx, rawLm.y);
        skLandmarks.push([
          Math.round(mappedLm.x * 1000) / 1000,
          Math.round(mappedLm.y * 1000) / 1000,
          Math.round((rawLm.z ?? 0) * 1000) / 1000
        ]);
      }
      skeletons.push({
        handIndex: handIdx,
        handedness: hEntry.category || (handIdx === 0 ? 'Right' : 'Left'),
        pinching: isPinch,
        landmarks: skLandmarks
      });
    }

    if (indexedHands.length < 2) {
      for (let id = 6; id <= 10; id++) {
        this.smoothedTips.delete(id);
      }
    }

    let h1ThumbTip: HandTipPoint | null = null;
    let h1IndexTip: HandTipPoint | null = null;
    let h1MiddleTip: HandTipPoint | null = null;
    let h2IndexTip: HandTipPoint | null = null;
    for (let i = 0; i < tips.length; i++) {
      const tp = tips[i];
      if (tp.id === 1) h1ThumbTip = tp;
      else if (tp.id === 2) h1IndexTip = tp;
      else if (tp.id === 3) h1MiddleTip = tp;
      else if (tp.id === 7) h2IndexTip = tp;
    }
    const hand1Index = h1IndexTip ? { x: h1IndexTip.x, y: h1IndexTip.y } : null;
    const hand2Index = h2IndexTip ? { x: h2IndexTip.x, y: h2IndexTip.y } : null;

    let rawGesture: HandGestureId = 'palm_5';
    let twoHandSpan = 0.45;
    let twoHandAngle = this.smoothTwoHandAngle;
    const anyPinch = hand1Pinching || hand2Pinching;
    const minimalControl = options.minimalControlMode ?? false;
    let isThumbUpPose = false;

    if (indexedHands.length === 2) {
      if (h1IndexTip && h2IndexTip) {
        twoHandSpan = Math.hypot(h1IndexTip.x - h2IndexTip.x, h1IndexTip.y - h2IndexTip.y);
        twoHandAngle = Math.atan2(h2IndexTip.y - h1IndexTip.y, h2IndexTip.x - h1IndexTip.x);
      }
      if (totalExtended === 0 && !anyPinch) {
        rawGesture = 'fist_0';
      } else if (hand1Pinching && hand2Pinching) {
        rawGesture = 'pinch';
      } else if (handMode === 'two_hands_split' && !minimalControl) {
        // In split mode, allow single-hand sub-gestures or two_hand_10 when wide open
        rawGesture = totalExtended >= 7 ? 'two_hand_10' : hand1Pinching || hand2Pinching ? 'pinch' : 'point_1';
      } else {
        rawGesture = 'two_hand_10';
      }
    } else {
      const thumbExt = tips[0]?.extended ?? false;
      const indexExt = tips[1]?.extended ?? false;
      const middleExt = tips[2]?.extended ?? false;
      const ringExt = tips[3]?.extended ?? false;
      const pinkyExt = tips[4]?.extended ?? false;

      // Robust solo 1-Thumb-Up 👍 detector: 4 fingers curled + thumb extended cleanly away from knuckles
      const h0Lms = indexedHands[0].lmList;
      if (h0Lms[0] && h0Lms[2] && h0Lms[3] && h0Lms[4] && h0Lms[5] && h0Lms[9] && h0Lms[10]) {
        const scaleRef = Math.max(0.08, dist2D(h0Lms[0], h0Lms[9]));
        const thumbOutIndex = dist2D(h0Lms[4], h0Lms[5]) / scaleRef;
        const thumbOutMid = dist2D(h0Lms[4], h0Lms[10]) / scaleRef;
        const thumbStraight = dist2D(h0Lms[4], h0Lms[2]) > dist2D(h0Lms[3], h0Lms[2]) * 1.12;
        isThumbUpPose =
          !hand1Pinching &&
          !indexExt &&
          !middleExt &&
          !ringExt &&
          !pinkyExt &&
          thumbExt &&
          thumbStraight &&
          thumbOutIndex > 0.5 &&
          thumbOutMid > 0.46;
      }

      if (minimalControl) {
        // Crystal-clear minimal 3D poses:
        // 👍 1 Thumb Up (select part), ✊ Fist (rotate when assembled), ✌️ 2 Fingers (toggle horizontal row), 🖐️ Open Hand (aim cleanly)
        if (isThumbUpPose) {
          rawGesture = 'point_1';
        } else if (!indexExt && !middleExt && !ringExt && !pinkyExt && !anyPinch) {
          rawGesture = 'fist_0';
        } else if (anyPinch && !middleExt && !ringExt && !pinkyExt) {
          rawGesture = 'pinch';
        } else if (indexExt && middleExt && !ringExt && !pinkyExt && !anyPinch) {
          rawGesture = 'slice_2';
        } else if (
          totalExtended >= 4 ||
          (indexExt && middleExt && ringExt && pinkyExt)
        ) {
          rawGesture = 'palm_5';
        } else {
          // Transitional 1- or 3-finger pose between open hand and fist: keep current aim/hold state steady
          rawGesture =
            this.stableGesture === 'fist_0' ||
            this.stableGesture === 'pinch' ||
            this.stableGesture === 'palm_5' ||
            this.stableGesture === 'point_1'
              ? this.stableGesture
              : 'palm_5';
        }
      } else {
        if (totalExtended === 0 && !anyPinch) {
          rawGesture = 'fist_0';
        } else if (anyPinch && !middleExt && !ringExt && !pinkyExt) {
          rawGesture = 'pinch';
        } else if (totalExtended === 1 || (indexExt && !middleExt && !ringExt && !pinkyExt) || isThumbUpPose) {
          rawGesture = 'point_1';
        } else if (totalExtended === 2) {
          rawGesture = anyPinch ? 'pinch' : 'slice_2';
        } else if (totalExtended === 3) {
          rawGesture = 'morph_3';
        } else if (totalExtended === 4 || (indexExt && middleExt && ringExt && pinkyExt && !thumbExt)) {
          rawGesture = 'reassemble_4';
        } else {
          rawGesture = 'palm_5';
        }
      }
    }

    if (rawGesture === this.candidateGesture) {
      this.candidateStreak++;
    } else {
      this.candidateGesture = rawGesture;
      this.candidateStreak = 1;
      this.candidateSinceMs = nowMs;
    }

    const holdElapsedMs = Math.max(0, nowMs - this.candidateSinceMs);
    const isDirectGrabState =
      rawGesture === 'fist_0' || rawGesture === 'palm_5' || rawGesture === 'pinch' || rawGesture === 'two_hand_10';
    const isMinimalThumbSelect = minimalControl && rawGesture === 'point_1';
    const effectiveHoldMs = minimalControl
      ? isDirectGrabState
        ? Math.min(gestureHoldMs, 45)
        : isMinimalThumbSelect
        ? Math.min(gestureHoldMs, 85)
        : Math.max(gestureHoldMs, 220)
      : isDirectGrabState
      ? Math.min(gestureHoldMs, 90)
      : Math.max(gestureHoldMs, 240);
    const effectiveStability = minimalControl
      ? isDirectGrabState
        ? 1
        : isMinimalThumbSelect
        ? 2
        : Math.max(2, stabilityFrames)
      : isDirectGrabState
      ? Math.min(stabilityFrames, 2)
      : stabilityFrames;
    const timeSettled = holdElapsedMs >= effectiveHoldMs;
    const gestureHoldProgress =
      this.stableGesture === rawGesture
        ? 1
        : effectiveHoldMs > 0
        ? Math.min(1, holdElapsedMs / effectiveHoldMs)
        : 1;

    if (this.candidateStreak >= effectiveStability && timeSettled) {
      this.stableGesture = rawGesture;
    }
    const gestureSettled = this.stableGesture !== 'none' && this.stableGesture === rawGesture;

    let targetCursorX = 0.5;
    let targetCursorY = 0.5;
    if (indexedHands.length === 2 && handMode !== 'two_hands_split') {
      const h1 = h1IndexTip || tips[0];
      const h2 = h2IndexTip || tips[5];
      if (h1 && h2) {
        targetCursorX = (h1.x + h2.x) * 0.5;
        targetCursorY = (h1.y + h2.y) * 0.5;
      }
    } else if (minimalControl && palmCenterH1) {
      // Keep aim cursor anchored on palm center so curling fingers into 👍 1-Thumb never jerks aim off-target!
      targetCursorX = palmCenterH1.x;
      targetCursorY = clamp01(palmCenterH1.y - 0.035);
    } else if (pointerSource === 'middle' && h1MiddleTip) {
      targetCursorX = h1MiddleTip.x;
      targetCursorY = h1MiddleTip.y;
    } else if (pointerSource === 'pinch_mid' && h1ThumbTip && h1IndexTip) {
      targetCursorX = (h1ThumbTip.x + h1IndexTip.x) * 0.5;
      targetCursorY = (h1ThumbTip.y + h1IndexTip.y) * 0.5;
    } else if (pointerSource === 'palm_center' && palmCenterH1) {
      targetCursorX = palmCenterH1.x;
      targetCursorY = palmCenterH1.y;
    } else if (this.stableGesture === 'pinch' && h1ThumbTip && h1IndexTip) {
      targetCursorX = (h1ThumbTip.x + h1IndexTip.x) * 0.5;
      targetCursorY = (h1ThumbTip.y + h1IndexTip.y) * 0.5;
    } else if (h1IndexTip) {
      targetCursorX = h1IndexTip.x;
      targetCursorY = h1IndexTip.y;
    } else if (tips.length > 0) {
      let sx = 0;
      let sy = 0;
      for (const t of tips) {
        sx += t.x;
        sy += t.y;
      }
      targetCursorX = sx / tips.length;
      targetCursorY = sy / tips.length;
    }

    let cursorDX = 0;
    let cursorDY = 0;
    let twoHandSpanDelta = 0;

    if (!this.hasCursorFix) {
      this.smoothCursorX = targetCursorX;
      this.smoothCursorY = targetCursorY;
      this.prevCursorX = targetCursorX;
      this.prevCursorY = targetCursorY;
      this.smoothSpan = twoHandSpan;
      this.prevSmoothSpan = twoHandSpan;
      this.smoothTwoHandAngle = twoHandAngle;
      this.smoothTiltAngle = handTiltAngle;
      this.hasCursorFix = true;
    } else {
      this.prevCursorX = this.smoothCursorX;
      this.prevCursorY = this.smoothCursorY;
      this.prevSmoothSpan = this.smoothSpan;
      const moveDist = Math.hypot(targetCursorX - this.smoothCursorX, targetCursorY - this.smoothCursorY);
      if (moveDist > deadzone) {
        this.smoothCursorX += (targetCursorX - this.smoothCursorX) * tipAlpha;
        this.smoothCursorY += (targetCursorY - this.smoothCursorY) * tipAlpha;
      }
      cursorDX = this.smoothCursorX - this.prevCursorX;
      cursorDY = this.smoothCursorY - this.prevCursorY;
      this.smoothSpan += (twoHandSpan - this.smoothSpan) * 0.4;
      twoHandSpanDelta = this.smoothSpan - this.prevSmoothSpan;
      this.smoothTwoHandAngle += (twoHandAngle - this.smoothTwoHandAngle) * 0.3;
      this.smoothTiltAngle += (handTiltAngle - this.smoothTiltAngle) * 0.3;
    }

    const hand1VelX = cursorDX / dtSec;
    const hand1VelY = cursorDY / dtSec;

    // Detect 2-hand opposite horizontal pulling (left hand pulls left, right hand pulls right)
    let twoHandOppositeSpread = false;
    let twoHandMovingCloser = false;
    if (indexedHands.length === 2 && hand1Index && hand2Index) {
      const h1x = Math.min(hand1Index.x, hand2Index.x);
      const h2x = Math.max(hand1Index.x, hand2Index.x);
      if (this.prevH1X !== null && this.prevH2X !== null) {
        const dH1 = h1x - this.prevH1X;
        const dH2 = h2x - this.prevH2X;
        // Left hand moving left (< -0.0025) AND right hand moving right (> +0.0025) OR strong horizontal span expand
        if ((dH1 < -0.0025 && dH2 > 0.0025) || (twoHandSpanDelta > 0.007 && Math.abs(h2x - h1x) > 0.16)) {
          twoHandOppositeSpread = true;
        }
        // Moving from far apart closer together
        if (twoHandSpanDelta < -0.0045 || (dH1 > 0.0025 && dH2 < -0.0025)) {
          twoHandMovingCloser = true;
        }
      }
      this.prevH1X = h1x;
      this.prevH2X = h2x;
    } else {
      this.prevH1X = null;
      this.prevH2X = null;
    }

    // Detect crisp single-hand horizontal swipe (left or right) with cooldown (after fingers settle)
    let swipeEvent: 'left' | 'right' | null = null;
    if (
      indexedHands.length === 1 &&
      this.stableGesture !== 'none' &&
      this.stableGesture !== 'fist_0' &&
      nowMs - this.lastSwipeAtMs > 620 &&
      Math.abs(hand1VelX) > 0.85 &&
      Math.abs(hand1VelX) > Math.abs(hand1VelY) * 1.45
    ) {
      swipeEvent = hand1VelX > 0 ? 'right' : 'left';
      this.lastSwipeAtMs = nowMs;
    }

    const frame: HandTrackingFrame = {
      detected: true,
      ready: true,
      engine: this.engineState,
      handCount: indexedHands.length,
      gesture: this.stableGesture,
      candidateGesture: this.candidateGesture,
      gestureHoldProgress,
      gestureSettled,
      fingerCount: totalExtended,
      trackedTipCount: tips.length,
      cursorX: this.smoothCursorX,
      cursorY: this.smoothCursorY,
      cursorDX,
      cursorDY,
      hand1VelX,
      hand1VelY,
      pinchRatio: maxPinchRatio,
      hand1Pinching,
      hand2Pinching,
      hand1Index,
      hand2Index,
      handTiltAngle: this.smoothTiltAngle,
      twoHandSpan: this.smoothSpan,
      twoHandSpanDelta,
      twoHandOppositeSpread,
      twoHandMovingCloser,
      twoHandAngle: this.smoothTwoHandAngle,
      swipeEvent,
      thumbUp: minimalControl ? this.stableGesture === 'point_1' : isThumbUpPose,
      confidence: Math.min(0.99, confSum / indexedHands.length),
      tips,
      skeletons
    };

    this.lastResultFrame = frame;
    return frame;
  }

  public drawOverlay(
    overlayCanvas: HTMLCanvasElement,
    frame: HandTrackingFrame,
    activeColor: string
  ): void {
    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;
    const cw = overlayCanvas.width;
    const ch = overlayCanvas.height;
    ctx.clearRect(0, 0, cw, ch);

    if (!frame.detected) {
      return;
    }

    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const tip of frame.tips) {
      const tx = tip.x * cw;
      const ty = tip.y * ch;
      const ringColor = tip.handIndex === 0 ? activeColor : '#34d399';

      if (tip.extended) {
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tx, ty, 7.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.72)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(tx, ty, 5.2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = ringColor;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = tip.extended ? '#ffffff' : 'rgba(203, 213, 225, 0.85)';
      ctx.fillText(String(tip.id), tx, Math.max(8, ty - 12));
    }
  }

  private emptyFrame(): HandTrackingFrame {
    return {
      detected: false,
      ready: Boolean(this.landmarker),
      engine: this.engineState,
      errorMessage: this.errorMessage,
      handCount: 0,
      gesture: 'none',
      candidateGesture: 'none',
      gestureHoldProgress: 0,
      gestureSettled: false,
      fingerCount: 0,
      trackedTipCount: 0,
      cursorX: this.smoothCursorX,
      cursorY: this.smoothCursorY,
      cursorDX: 0,
      cursorDY: 0,
      hand1VelX: 0,
      hand1VelY: 0,
      pinchRatio: 0,
      hand1Pinching: false,
      hand2Pinching: false,
      hand1Index: null,
      hand2Index: null,
      handTiltAngle: this.smoothTiltAngle,
      twoHandSpan: this.smoothSpan,
      twoHandSpanDelta: 0,
      twoHandOppositeSpread: false,
      twoHandMovingCloser: false,
      twoHandAngle: this.smoothTwoHandAngle,
      swipeEvent: null,
      thumbUp: false,
      confidence: 0,
      tips: [],
      skeletons: []
    };
  }
}
