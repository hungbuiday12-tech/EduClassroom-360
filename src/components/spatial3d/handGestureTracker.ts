import { FilesetResolver, HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

export type HandGestureId =
  | 'none'
  | 'point_1'
  | 'pinch'
  | 'slice_2'
  | 'morph_3'
  | 'palm_5'
  | 'two_hand_10'
  | 'fist_0';

export type HandControlMode = 'auto' | 'right_only' | 'left_only' | 'two_hands_split';
export type PointerSource = 'index' | 'middle' | 'pinch_mid' | 'palm_center';
export type GraphicsQuality = 'light' | 'high';

export type GestureAction3D =
  | 'draw_neon'
  | 'pinch_stamp_scale'
  | 'slice_plane'
  | 'explode_layers'
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
  pinchSensitivity: number; // 0.6 .. 1.6
  fingerExtendSensitivity: number; // 0.6 .. 1.5
  smoothing: number; // 0.1 .. 0.9
  deadzone: number; // 0.000 .. 0.045
  stabilityFrames: number; // 1 .. 8
  trackingFps: 12 | 20 | 30;
  mirrorCamera: boolean;
  invertX: boolean;
  invertY: boolean;
  graphicsQuality: GraphicsQuality;
  gestureActions3D: Record<ActiveGestureKey, GestureAction3D>;
  gestureActions2D: Record<ActiveGestureKey, GestureAction2D>;
}

export const DEFAULT_GESTURE_SETTINGS: GestureSettings = {
  handMode: 'auto',
  pointerSource: 'index',
  sensitivityX: 1.05,
  sensitivityY: 1.05,
  pinchSensitivity: 1.05,
  fingerExtendSensitivity: 1.0,
  smoothing: 0.55,
  deadzone: 0.008,
  stabilityFrames: 4,
  trackingFps: 20,
  mirrorCamera: true,
  invertX: false,
  invertY: false,
  graphicsQuality: 'light',
  gestureActions3D: {
    point_1: 'draw_neon',
    pinch: 'pinch_stamp_scale',
    slice_2: 'slice_plane',
    morph_3: 'explode_layers',
    palm_5: 'orbit_rotate',
    two_hand_10: 'dual_zoom_tilt',
    fist_0: 'freeze_lock'
  },
  gestureActions2D: {
    point_1: 'plot_draw',
    pinch: 'grab_drag',
    slice_2: 'sweep_tangent',
    morph_3: 'cycle_symmetry',
    palm_5: 'rotate_pan',
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
    id: 'smooth_learn',
    labelVi: 'Mượt mà Học tập',
    labelEn: 'Smooth Study',
    descVi: 'Chống rung cao, 20 FPS, nhẹ GPU',
    descEn: 'High anti-jitter, 20 FPS, light GPU',
    patch: {
      sensitivityX: 1.0,
      sensitivityY: 1.0,
      pinchSensitivity: 1.0,
      fingerExtendSensitivity: 1.0,
      smoothing: 0.65,
      deadzone: 0.012,
      stabilityFrames: 5,
      trackingFps: 20,
      graphicsQuality: 'light'
    }
  },
  {
    id: 'fast_creative',
    labelVi: 'Sáng tạo Nhanh',
    labelEn: 'Fast Creative',
    descVi: 'Phản hồi tức thì, nhạy rộng 30 FPS',
    descEn: 'Instant response, wide range 30 FPS',
    patch: {
      sensitivityX: 1.45,
      sensitivityY: 1.45,
      pinchSensitivity: 1.25,
      fingerExtendSensitivity: 1.15,
      smoothing: 0.28,
      deadzone: 0.004,
      stabilityFrames: 2,
      trackingFps: 30,
      graphicsQuality: 'light'
    }
  },
  {
    id: 'precision_measure',
    labelVi: 'Đo đạc Chính xác',
    labelEn: 'Precision Lab',
    descVi: 'Deadzone khóa tâm, kéo đỉnh chuẩn từng mm',
    descEn: 'Locked deadzone, crisp vertex precision',
    patch: {
      sensitivityX: 0.85,
      sensitivityY: 0.85,
      pinchSensitivity: 0.9,
      fingerExtendSensitivity: 0.95,
      smoothing: 0.72,
      deadzone: 0.018,
      stabilityFrames: 6,
      trackingFps: 20
    }
  }
];

export const ACTION_3D_OPTIONS: { id: GestureAction3D; labelVi: string; labelEn: string }[] = [
  { id: 'draw_neon', labelVi: 'Vẽ ống Neon 3D / Dẫn IK', labelEn: 'Sculpt Neon / Drive IK' },
  { id: 'pinch_stamp_scale', labelVi: 'Đặt khối / Chỉnh tỷ lệ & RPM', labelEn: 'Stamp Block / Scale & RPM' },
  { id: 'slice_plane', labelVi: 'Kéo mặt cắt ngang 3D', labelEn: 'Slide 3D Clipping Plane' },
  { id: 'explode_layers', labelVi: 'Mở bung tách lớp mô hình', labelEn: 'Explode Model Layers' },
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
  fingerCount: number; // extended fingers across 1 or 2 hands (0..10)
  trackedTipCount: number; // total visible fingertip sensors (0, 5, or 10)
  cursorX: number; // normalized [0..1]
  cursorY: number; // normalized [0..1]
  pinchRatio: number; // 0..1
  hand1Pinching: boolean;
  hand2Pinching: boolean;
  hand1Index: { x: number; y: number } | null;
  hand2Index: { x: number; y: number } | null;
  handTiltAngle: number; // wrist -> middle MCP roll angle (radians)
  twoHandSpan: number; // normalized distance between two hands when handCount === 2
  twoHandAngle: number; // angle between left & right hands (radians)
  confidence: number; // 0..1
  tips: HandTipPoint[]; // up to 10 fingertip sensors locked to each fingertip
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

export const GESTURE_DEFINITIONS: GestureMeta[] = [
  {
    id: 'point_1',
    fingers: '1',
    labelVi: '1 Ngón · Vẽ & Chạm Điểm',
    labelEn: '1 Finger · Draw & Plot',
    actionVi: '2D: Ghim điểm & vẽ tự do · 3D: Vẽ ống Neon & dẫn tay Robot',
    actionEn: '2D: Plot & freehand draw · 3D: Sculpt Neon tubes & guide Robot Arm',
    accent: '#22d3ee'
  },
  {
    id: 'pinch',
    fingers: '👌',
    labelVi: 'Chụm Ngón · Gắp & Điều Tốc',
    labelEn: 'Pinch · Grab & Modulate',
    actionVi: '2D: Kéo đỉnh đa giác & compa · 3D: Đặt khối kiến tạo & tăng tua/gió',
    actionEn: '2D: Drag vertices & shapes · 3D: Stamp 3D blocks & throttle RPM/speed',
    accent: '#f59e0b'
  },
  {
    id: 'slice_2',
    fingers: '2',
    labelVi: '2 Ngón · Đo Góc & Cắt Lớp',
    labelEn: '2 Fingers · Measure & Slice',
    actionVi: '2D: Quét tiếp tuyến & tia cắt · 3D: Trượt mặt cắt ngang xuyên vật thể',
    actionEn: '2D: Sweep secant/tangent · 3D: Slide cross-section clipping plane',
    accent: '#a855f7'
  },
  {
    id: 'morph_3',
    fingers: '3',
    labelVi: '3 Ngón · Tách Lớp Cấu Trúc',
    labelEn: '3 Fingers · Explode Layers',
    actionVi: '2D: Đổi bậc đối xứng · 3D: Mở bung vỏ máy & tách lớp nội thất',
    actionEn: '2D: Cycle radial symmetry · 3D: Explode engine/hull layers smoothly',
    accent: '#ec4899'
  },
  {
    id: 'palm_5',
    fingers: '5',
    labelVi: '5 Ngón · Xoay Quỹ Đạo 360°',
    labelEn: '5 Fingers · 360° Orbit',
    actionVi: '2D: Xoay & trượt hệ trục · 3D: Xoay 360° toàn bộ mô hình thực tế',
    actionEn: '2D: Rotate & pan canvas · 3D: Smoothly orbit 3D model 360°',
    accent: '#10b981'
  },
  {
    id: 'two_hand_10',
    fingers: '10',
    labelVi: '10 Ngón (2 Tay) · Compa & Thu Phóng',
    labelEn: '10 Fingers (2 Hands) · Dual Control',
    actionVi: '2D: Compa 2 tay, 2 vector u & v · 3D: Thu phóng, nghiêng & vẽ đối xứng kép',
    actionEn: '2D: 2-hand compass & dual vectors · 3D: Zoom, tilt & dual-beam sculpt',
    accent: '#38bdf8'
  },
  {
    id: 'fist_0',
    fingers: '0',
    labelVi: 'Nắm Tay · Khóa Đo Đạc',
    labelEn: 'Fist · Freeze & Inspect',
    actionVi: 'Đóng băng tức thì để đọc thông số, công thức & chụp ảnh nét',
    actionEn: 'Freeze motion instantly to inspect formulas & capture crisp shots',
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
  sensitivity?: number;
  sensitivityX?: number;
  sensitivityY?: number;
  pinchSensitivity?: number;
  fingerExtendSensitivity?: number;
  smoothing: number;
  deadzone?: number;
  stabilityFrames?: number;
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
  private smoothSpan = 0.45;
  private smoothTwoHandAngle = 0;
  private smoothTiltAngle = 0;
  private hasCursorFix = false;

  private candidateGesture: HandGestureId = 'none';
  private candidateStreak = 0;
  private stableGesture: HandGestureId = 'none';
  private missFrames = 0;
  private lastResultFrame: HandTrackingFrame | null = null;

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
    this.stableGesture = 'none';
    this.candidateGesture = 'none';
    this.candidateStreak = 0;
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

    const nowMs = Math.max(this.lastTimestampMs + 1, performance.now());
    this.lastTimestampMs = nowMs;

    const result = this.landmarker.detectForVideo(video, nowMs);
    const hands = result.landmarks || [];

    if (hands.length === 0) {
      this.missFrames++;
      if (this.missFrames > 5) {
        this.smoothedTips.clear();
        this.stableGesture = 'none';
        this.candidateStreak = 0;
        this.hasCursorFix = false;
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
    }

    if (indexedHands.length < 2) {
      for (let id = 6; id <= 10; id++) {
        this.smoothedTips.delete(id);
      }
    }

    const h1ThumbTip = tips.find((t) => t.id === 1) || null;
    const h1IndexTip = tips.find((t) => t.id === 2) || null;
    const h1MiddleTip = tips.find((t) => t.id === 3) || null;
    const h2IndexTip = tips.find((t) => t.id === 7) || null;
    const hand1Index = h1IndexTip ? { x: h1IndexTip.x, y: h1IndexTip.y } : null;
    const hand2Index = h2IndexTip ? { x: h2IndexTip.x, y: h2IndexTip.y } : null;

    let rawGesture: HandGestureId = 'palm_5';
    let twoHandSpan = 0.45;
    let twoHandAngle = this.smoothTwoHandAngle;
    const anyPinch = hand1Pinching || hand2Pinching;

    if (indexedHands.length === 2) {
      if (h1IndexTip && h2IndexTip) {
        twoHandSpan = Math.hypot(h1IndexTip.x - h2IndexTip.x, h1IndexTip.y - h2IndexTip.y);
        twoHandAngle = Math.atan2(h2IndexTip.y - h1IndexTip.y, h2IndexTip.x - h1IndexTip.x);
      }
      if (totalExtended === 0) {
        rawGesture = 'fist_0';
      } else if (hand1Pinching && hand2Pinching) {
        rawGesture = 'pinch';
      } else if (handMode === 'two_hands_split') {
        // In split mode, allow single-hand sub-gestures or two_hand_10 when wide open
        rawGesture = totalExtended >= 7 ? 'two_hand_10' : hand1Pinching || hand2Pinching ? 'pinch' : 'point_1';
      } else if (totalExtended >= 6) {
        rawGesture = 'two_hand_10';
      } else {
        rawGesture = 'two_hand_10';
      }
    } else {
      const indexExt = tips[1]?.extended ?? false;
      const middleExt = tips[2]?.extended ?? false;
      const ringExt = tips[3]?.extended ?? false;
      const pinkyExt = tips[4]?.extended ?? false;

      if (totalExtended === 0 && !anyPinch) {
        rawGesture = 'fist_0';
      } else if (anyPinch && !middleExt && !ringExt && !pinkyExt) {
        rawGesture = 'pinch';
      } else if (totalExtended === 1 || (indexExt && !middleExt && !ringExt && !pinkyExt)) {
        rawGesture = 'point_1';
      } else if (totalExtended === 2) {
        rawGesture = anyPinch ? 'pinch' : 'slice_2';
      } else if (totalExtended === 3) {
        rawGesture = 'morph_3';
      } else {
        rawGesture = 'palm_5';
      }
    }

    if (rawGesture === this.candidateGesture) {
      this.candidateStreak++;
    } else {
      this.candidateGesture = rawGesture;
      this.candidateStreak = 1;
    }

    if (this.candidateStreak >= stabilityFrames) {
      this.stableGesture = rawGesture;
    } else if (this.stableGesture === 'none') {
      this.stableGesture = rawGesture;
    }

    let targetCursorX = 0.5;
    let targetCursorY = 0.5;
    if (indexedHands.length === 2 && handMode !== 'two_hands_split') {
      const h1 = h1IndexTip || tips[0];
      const h2 = h2IndexTip || tips[5];
      if (h1 && h2) {
        targetCursorX = (h1.x + h2.x) * 0.5;
        targetCursorY = (h1.y + h2.y) * 0.5;
      }
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

    if (!this.hasCursorFix) {
      this.smoothCursorX = targetCursorX;
      this.smoothCursorY = targetCursorY;
      this.smoothSpan = twoHandSpan;
      this.smoothTwoHandAngle = twoHandAngle;
      this.smoothTiltAngle = handTiltAngle;
      this.hasCursorFix = true;
    } else {
      const moveDist = Math.hypot(targetCursorX - this.smoothCursorX, targetCursorY - this.smoothCursorY);
      if (moveDist > deadzone) {
        this.smoothCursorX += (targetCursorX - this.smoothCursorX) * tipAlpha;
        this.smoothCursorY += (targetCursorY - this.smoothCursorY) * tipAlpha;
      }
      this.smoothSpan += (twoHandSpan - this.smoothSpan) * 0.35;
      this.smoothTwoHandAngle += (twoHandAngle - this.smoothTwoHandAngle) * 0.3;
      this.smoothTiltAngle += (handTiltAngle - this.smoothTiltAngle) * 0.3;
    }

    const frame: HandTrackingFrame = {
      detected: true,
      ready: true,
      engine: this.engineState,
      handCount: indexedHands.length,
      gesture: this.stableGesture,
      fingerCount: totalExtended,
      trackedTipCount: tips.length,
      cursorX: this.smoothCursorX,
      cursorY: this.smoothCursorY,
      pinchRatio: maxPinchRatio,
      hand1Pinching,
      hand2Pinching,
      hand1Index,
      hand2Index,
      handTiltAngle: this.smoothTiltAngle,
      twoHandSpan: this.smoothSpan,
      twoHandAngle: this.smoothTwoHandAngle,
      confidence: Math.min(0.99, confSum / indexedHands.length),
      tips
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
      fingerCount: 0,
      trackedTipCount: 0,
      cursorX: this.smoothCursorX,
      cursorY: this.smoothCursorY,
      pinchRatio: 0,
      hand1Pinching: false,
      hand2Pinching: false,
      hand1Index: null,
      hand2Index: null,
      handTiltAngle: this.smoothTiltAngle,
      twoHandSpan: this.smoothSpan,
      twoHandAngle: this.smoothTwoHandAngle,
      confidence: 0,
      tips: []
    };
  }
}
