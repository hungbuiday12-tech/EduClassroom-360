import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface HeadGazeFrame {
  ready: boolean;
  detected: boolean;
  usingFallback: boolean;
  /** Head X offset normalized [-1, +1] (+ right, - left) */
  headX: number;
  /** Head Y offset normalized [-1, +1] (+ up, - down) */
  headY: number;
  /** Head Z depth delta normalized [-1, +1] (+ leaning closer to screen) */
  headZ: number;
  /** Gaze raycast point in Three.js NDC [-1, +1] */
  gazeNdcX: number;
  /** Gaze raycast point in Three.js NDC [-1, +1] */
  gazeNdcY: number;
  /** Gaze screen percentage [0, 100] */
  gazeScreenX: number;
  gazeScreenY: number;
  blinking: boolean;
  blinkJustTriggered: boolean;
}

const DEFAULT_FACE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export class HeadGazeTracker {
  private landmarker: FaceLandmarker | null = null;
  private initPromise: Promise<boolean> | null = null;
  private ready = false;
  private failed = false;
  private lastVideoTime = -1;

  private smoothHeadX = 0;
  private smoothHeadY = 0;
  private smoothHeadZ = 0;
  private smoothGazeX = 0;
  private smoothGazeY = 0;
  private baselineEyeSpan = 0.14;
  private baselineCalibrated = false;

  private wasBlinking = false;
  private blinkStartedAt = 0;
  private lastBlinkTriggerAt = 0;

  async ensureInitialized(): Promise<boolean> {
    if (this.ready && this.landmarker) return true;
    if (this.failed) return false;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const wasmBase = `${import.meta.env.BASE_URL || './'}mediapipe/wasm`;
      try {
        const vision = await FilesetResolver.forVisionTasks(wasmBase);
        this.landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: DEFAULT_FACE_MODEL_URL,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: false
        });
        this.ready = true;
        return true;
      } catch {
        try {
          const vision = await FilesetResolver.forVisionTasks(wasmBase);
          this.landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: DEFAULT_FACE_MODEL_URL,
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true
          });
          this.ready = true;
          return true;
        } catch {
          this.failed = true;
          return false;
        }
      }
    })();

    return this.initPromise;
  }

  hasFailed(): boolean {
    return this.failed;
  }

  processVideo(video: HTMLVideoElement, mirror: boolean): HeadGazeFrame {
    const now = performance.now();
    if (!this.ready || !this.landmarker || video.readyState < 2 || video.videoWidth <= 0) {
      return {
        ready: this.ready,
        detected: false,
        usingFallback: this.failed,
        headX: this.smoothHeadX,
        headY: this.smoothHeadY,
        headZ: this.smoothHeadZ,
        gazeNdcX: this.smoothGazeX,
        gazeNdcY: this.smoothGazeY,
        gazeScreenX: (this.smoothGazeX * 0.5 + 0.5) * 100,
        gazeScreenY: (-this.smoothGazeY * 0.5 + 0.5) * 100,
        blinking: false,
        blinkJustTriggered: false
      };
    }

    if (video.currentTime === this.lastVideoTime) {
      return {
        ready: true,
        detected: true,
        usingFallback: false,
        headX: this.smoothHeadX,
        headY: this.smoothHeadY,
        headZ: this.smoothHeadZ,
        gazeNdcX: this.smoothGazeX,
        gazeNdcY: this.smoothGazeY,
        gazeScreenX: (this.smoothGazeX * 0.5 + 0.5) * 100,
        gazeScreenY: (-this.smoothGazeY * 0.5 + 0.5) * 100,
        blinking: this.wasBlinking,
        blinkJustTriggered: false
      };
    }
    this.lastVideoTime = video.currentTime;

    let result;
    try {
      result = this.landmarker.detectForVideo(video, now);
    } catch {
      return this.buildFallbackSnapshot();
    }

    const face = result.faceLandmarks?.[0];
    if (!face || face.length < 400) {
      this.smoothHeadX = lerp(this.smoothHeadX, 0, 0.08);
      this.smoothHeadY = lerp(this.smoothHeadY, 0, 0.08);
      this.smoothHeadZ = lerp(this.smoothHeadZ, 0, 0.08);
      return {
        ready: true,
        detected: false,
        usingFallback: false,
        headX: this.smoothHeadX,
        headY: this.smoothHeadY,
        headZ: this.smoothHeadZ,
        gazeNdcX: this.smoothGazeX,
        gazeNdcY: this.smoothGazeY,
        gazeScreenX: (this.smoothGazeX * 0.5 + 0.5) * 100,
        gazeScreenY: (-this.smoothGazeY * 0.5 + 0.5) * 100,
        blinking: false,
        blinkJustTriggered: false
      };
    }

    // Landmark 168 = nose bridge, 33 = left eye outer, 263 = right eye outer
    const nose = face[168] || face[1];
    const leftEyeOuter = face[33];
    const rightEyeOuter = face[263];

    const eyeSpan = Math.hypot(rightEyeOuter.x - leftEyeOuter.x, rightEyeOuter.y - leftEyeOuter.y);
    if (!this.baselineCalibrated && eyeSpan > 0.04 && eyeSpan < 0.55) {
      this.baselineEyeSpan = eyeSpan;
      this.baselineCalibrated = true;
    }

    const rawCenterX = (nose.x - 0.5) * (mirror ? -2 : 2);
    const rawCenterY = -(nose.y - 0.45) * 2;
    const rawDepthZ = clamp((eyeSpan - this.baselineEyeSpan) / Math.max(0.05, this.baselineEyeSpan) * 2.2, -0.8, 1.1);

    // Iris + head-yaw gaze approximation
    let irisShiftX = 0;
    let irisShiftY = 0;
    if (face.length >= 478) {
      const lInner = face[133];
      const lIris = face[468];
      const lMidX = (leftEyeOuter.x + lInner.x) * 0.5;
      const lSpanX = Math.max(0.01, Math.abs(lInner.x - leftEyeOuter.x));
      irisShiftX = clamp(((lIris.x - lMidX) / lSpanX) * (mirror ? -2.8 : 2.8), -0.65, 0.65);

      const lTop = face[159];
      const lBot = face[145];
      const lMidY = (lTop.y + lBot.y) * 0.5;
      const lSpanY = Math.max(0.005, Math.abs(lBot.y - lTop.y));
      irisShiftY = clamp(-((lIris.y - lMidY) / lSpanY) * 1.4, -0.5, 0.5);
    }

    const targetHeadX = clamp(rawCenterX * 1.55, -1, 1);
    const targetHeadY = clamp(rawCenterY * 1.45, -1, 1);
    const targetGazeX = clamp(targetHeadX * 0.72 + irisShiftX * 0.7, -0.95, 0.95);
    const targetGazeY = clamp(targetHeadY * 0.68 + irisShiftY * 0.65, -0.9, 0.9);

    this.smoothHeadX = lerp(this.smoothHeadX, targetHeadX, 0.22);
    this.smoothHeadY = lerp(this.smoothHeadY, targetHeadY, 0.22);
    this.smoothHeadZ = lerp(this.smoothHeadZ, rawDepthZ, 0.16);
    this.smoothGazeX = lerp(this.smoothGazeX, targetGazeX, 0.26);
    this.smoothGazeY = lerp(this.smoothGazeY, targetGazeY, 0.26);

    // Blink detection from blendshapes
    let blinkScore = 0;
    const cats = result.faceBlendshapes?.[0]?.categories;
    if (cats && cats.length > 0) {
      let lBlink = 0;
      let rBlink = 0;
      for (const c of cats) {
        if (c.categoryName === 'eyeBlinkLeft') lBlink = c.score;
        else if (c.categoryName === 'eyeBlinkRight') rBlink = c.score;
      }
      blinkScore = (lBlink + rBlink) * 0.5;
    }

    const isBlinking = blinkScore > 0.52;
    let blinkJustTriggered = false;
    if (isBlinking && !this.wasBlinking) {
      this.blinkStartedAt = now;
    } else if (!isBlinking && this.wasBlinking) {
      const held = now - this.blinkStartedAt;
      // Intentional blink: 110ms..750ms, cooldown 950ms
      if (held >= 90 && held <= 800 && now - this.lastBlinkTriggerAt > 950) {
        blinkJustTriggered = true;
        this.lastBlinkTriggerAt = now;
      }
    }
    this.wasBlinking = isBlinking;

    return {
      ready: true,
      detected: true,
      usingFallback: false,
      headX: this.smoothHeadX,
      headY: this.smoothHeadY,
      headZ: this.smoothHeadZ,
      gazeNdcX: this.smoothGazeX,
      gazeNdcY: this.smoothGazeY,
      gazeScreenX: (this.smoothGazeX * 0.5 + 0.5) * 100,
      gazeScreenY: (-this.smoothGazeY * 0.5 + 0.5) * 100,
      blinking: isBlinking,
      blinkJustTriggered
    };
  }

  /** Smooth pointer-driven Hologram Parallax fallback when Webcam isn't active or Face model blocked */
  processMouseFallback(ndcX: number, ndcY: number): HeadGazeFrame {
    const clampedX = clamp(ndcX, -0.98, 0.98);
    const clampedY = clamp(ndcY, -0.95, 0.95);
    this.smoothHeadX = lerp(this.smoothHeadX, clampedX * 0.85, 0.2);
    this.smoothHeadY = lerp(this.smoothHeadY, clampedY * 0.75, 0.2);
    this.smoothHeadZ = lerp(this.smoothHeadZ, 0.15, 0.12);
    this.smoothGazeX = lerp(this.smoothGazeX, clampedX, 0.35);
    this.smoothGazeY = lerp(this.smoothGazeY, clampedY, 0.35);

    return {
      ready: true,
      detected: true,
      usingFallback: true,
      headX: this.smoothHeadX,
      headY: this.smoothHeadY,
      headZ: this.smoothHeadZ,
      gazeNdcX: this.smoothGazeX,
      gazeNdcY: this.smoothGazeY,
      gazeScreenX: (this.smoothGazeX * 0.5 + 0.5) * 100,
      gazeScreenY: (-this.smoothGazeY * 0.5 + 0.5) * 100,
      blinking: false,
      blinkJustTriggered: false
    };
  }

  private buildFallbackSnapshot(): HeadGazeFrame {
    return {
      ready: this.ready,
      detected: false,
      usingFallback: this.failed,
      headX: this.smoothHeadX,
      headY: this.smoothHeadY,
      headZ: this.smoothHeadZ,
      gazeNdcX: this.smoothGazeX,
      gazeNdcY: this.smoothGazeY,
      gazeScreenX: (this.smoothGazeX * 0.5 + 0.5) * 100,
      gazeScreenY: (-this.smoothGazeY * 0.5 + 0.5) * 100,
      blinking: false,
      blinkJustTriggered: false
    };
  }

  dispose(): void {
    try {
      this.landmarker?.close();
    } catch {}
    this.landmarker = null;
    this.ready = false;
    this.initPromise = null;
  }
}
