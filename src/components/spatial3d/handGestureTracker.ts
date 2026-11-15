export type HandGestureId =
  | 'none'
  | 'point_1'
  | 'pinch'
  | 'slice_2'
  | 'morph_3'
  | 'palm_5'
  | 'fist_0';

export interface HandTipPoint {
  x: number; // normalized [0..1]
  y: number; // normalized [0..1]
  angle: number;
  distRatio: number;
}

export interface HandTrackingFrame {
  detected: boolean;
  gesture: HandGestureId;
  fingerCount: number;
  cursorX: number; // normalized [0..1], mirrored if mirror=true
  cursorY: number; // normalized [0..1]
  pinchRatio: number; // 0..1 (higher = closer pinch / compact)
  spreadScale: number; // 0.35..1.8 based on palm area / span
  confidence: number; // 0..1
  palmRadius: number; // normalized radius
  skinCoverage: number; // 0..1 fraction of ROI matching skin
  tips: HandTipPoint[];
  bbox: { minX: number; minY: number; maxX: number; maxY: number } | null;
}

export interface GestureMeta {
  id: HandGestureId;
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
    labelVi: '1 Ngón · Vẽ Laser Oxyz',
    labelEn: '1 Finger · Oxyz Draw',
    actionVi: 'Di chuyển tia laser & vẽ nét ống 3D trong không gian Oxyz',
    actionEn: 'Move laser cursor & sculpt 3D tubes in Oxyz space',
    accent: '#22d3ee'
  },
  {
    id: 'pinch',
    fingers: '👌',
    labelVi: 'Chụm Ngón · Kéo Dãn Tỷ Lệ',
    labelEn: 'Pinch · Scale & Stretch',
    actionVi: 'Thay đổi tỷ lệ phóng đại & chiều cao/biên độ khối hình theo tay',
    actionEn: 'Stretch 3D scale & height/amplitude with hand motion',
    accent: '#f59e0b'
  },
  {
    id: 'slice_2',
    fingers: '2',
    labelVi: '2 Ngón · Mặt Cắt Thiết Diện',
    labelEn: '2 Fingers · Cross-Section',
    actionVi: 'Kích hoạt & trượt mặt phẳng cắt xuyên khối 3D theo trục Y',
    actionEn: 'Activate & sweep horizontal clipping plane along Y axis',
    accent: '#a855f7'
  },
  {
    id: 'morph_3',
    fingers: '3',
    labelVi: '3 Ngón · Thu Phóng Lõi',
    labelEn: '3 Fingers · Focus Zoom',
    actionVi: 'Thu phóng nhẹ & tách lớp tập trung quan sát lõi mô hình hiện tại',
    actionEn: 'Smoothly zoom and inspect core layers of the current simulation',
    accent: '#ec4899'
  },
  {
    id: 'palm_5',
    fingers: '5',
    labelVi: 'Xòe 5 Ngón · Xoay & Tách Lớp',
    labelEn: 'Open Palm · Orbit & Explode',
    actionVi: 'Xoay mô hình 360° theo chiều ngang & tách lớp cấu trúc theo chiều dọc',
    actionEn: 'Orbit model 360° horizontally & explode structural layers vertically',
    accent: '#10b981'
  },
  {
    id: 'fist_0',
    fingers: '0',
    labelVi: 'Nắm Tay · Khóa Đo Đạc',
    labelEn: 'Fist · Freeze & Inspect',
    actionVi: 'Đóng băng chuyển động để quan sát thông số V, S & góc nhìn cố định',
    actionEn: 'Lock rotation & parameters to inspect volume, area, and geometry',
    accent: '#64748b'
  }
];

interface SkinRange {
  cbMin: number;
  cbMax: number;
  crMin: number;
  crMax: number;
  yMin: number;
}

const DEFAULT_SKIN_RANGE: SkinRange = {
  cbMin: 76,
  cbMax: 132,
  crMin: 132,
  crMax: 178,
  yMin: 36
};

export class HandGestureTracker {
  private readonly width = 160;
  private readonly height = 120;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mask: Uint8Array;
  private smoothMask: Uint8Array;
  private labels: Int32Array;
  private bfsQueue: Int32Array;

  private skinRange: SkinRange = { ...DEFAULT_SKIN_RANGE };
  private smoothX = 0.5;
  private smoothY = 0.5;
  private smoothSpread = 1.0;
  private smoothPinch = 0.2;
  private hasFix = false;

  private candidateGesture: HandGestureId = 'none';
  private candidateStreak = 0;
  private stableGesture: HandGestureId = 'none';
  private missFrames = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const context = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Could not initialize 2D canvas context for HandGestureTracker');
    }
    this.ctx = context;
    this.mask = new Uint8Array(this.width * this.height);
    this.smoothMask = new Uint8Array(this.width * this.height);
    this.labels = new Int32Array(this.width * this.height);
    this.bfsQueue = new Int32Array(this.width * this.height);
  }

  public resetCalibration(): void {
    this.skinRange = { ...DEFAULT_SKIN_RANGE };
    this.stableGesture = 'none';
    this.candidateGesture = 'none';
    this.candidateStreak = 0;
    this.hasFix = false;
  }

  public calibrateCenter(video: HTMLVideoElement, mirror: boolean): boolean {
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return false;
    }

    this.drawVideoFrame(video, mirror);
    const { data } = this.ctx.getImageData(0, 0, this.width, this.height);

    // Sample a central 36x36 calibration box where the user holds their palm
    const x0 = Math.floor(this.width * 0.5 - 18);
    const x1 = Math.floor(this.width * 0.5 + 18);
    const y0 = Math.floor(this.height * 0.5 - 18);
    const y1 = Math.floor(this.height * 0.5 + 18);

    const cbSamples: number[] = [];
    const crSamples: number[] = [];
    const ySamples: number[] = [];

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const idx = (y * this.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luma < 28) continue;
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
        ySamples.push(luma);
        cbSamples.push(cb);
        crSamples.push(cr);
      }
    }

    if (cbSamples.length < 40) return false;

    const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const std = (arr: number[], m: number) =>
      Math.sqrt(arr.reduce((acc, v) => acc + (v - m) * (v - m), 0) / arr.length);

    const cbMean = mean(cbSamples);
    const crMean = mean(crSamples);
    const yMean = mean(ySamples);
    const cbPad = Math.max(15, std(cbSamples, cbMean) * 2.6);
    const crPad = Math.max(15, std(crSamples, crMean) * 2.6);

    this.skinRange = {
      cbMin: Math.max(60, cbMean - cbPad),
      cbMax: Math.min(148, cbMean + cbPad),
      crMin: Math.max(120, crMean - crPad),
      crMax: Math.min(198, crMean + crPad),
      yMin: Math.max(24, yMean * 0.38)
    };
    return true;
  }

  private drawVideoFrame(video: HTMLVideoElement, mirror: boolean): void {
    this.ctx.save();
    if (mirror) {
      this.ctx.translate(this.width, 0);
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(video, 0, 0, this.width, this.height);
    this.ctx.restore();
  }

  public process(
    video: HTMLVideoElement,
    options: { mirror: boolean; sensitivity: number; smoothing: number }
  ): HandTrackingFrame {
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return this.emptyFrame();
    }

    const { mirror, sensitivity, smoothing } = options;
    this.drawVideoFrame(video, mirror);
    const img = this.ctx.getImageData(0, 0, this.width, this.height).data;

    const w = this.width;
    const h = this.height;
    const total = w * h;
    const tol = (1.0 - sensitivity) * -12; // sensitivity 1.5 expands tolerance by +6
    const cbMin = this.skinRange.cbMin - Math.max(-8, tol);
    const cbMax = this.skinRange.cbMax + Math.max(-8, tol);
    const crMin = this.skinRange.crMin - Math.max(-8, tol);
    const crMax = this.skinRange.crMax + Math.max(-8, tol);
    const yMin = Math.max(36, this.skinRange.yMin - (sensitivity - 1) * 12);

    let rawCount = 0;
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      const r = img[p];
      const g = img[p + 1];
      const b = img[p + 2];
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      // Strict skin chrominance check (excludes white/gray walls, lamps, and random non-skin motion)
      const chromaSpread = r - Math.min(g, b);
      const isSkin =
        luma >= yMin &&
        luma <= 242 &&
        cb >= cbMin &&
        cb <= cbMax &&
        cr >= crMin &&
        cr <= crMax &&
        r > g * 0.96 &&
        r > b * 1.05 &&
        chromaSpread >= 10;

      this.mask[i] = isSkin ? 1 : 0;
      if (isSkin) rawCount++;
    }

    // 3x3 majority denoise pass
    this.smoothMask.fill(0);
    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = row + x;
        const neighbors =
          this.mask[idx - w - 1] +
          this.mask[idx - w] +
          this.mask[idx - w + 1] +
          this.mask[idx - 1] +
          this.mask[idx] +
          this.mask[idx + 1] +
          this.mask[idx + w - 1] +
          this.mask[idx + w] +
          this.mask[idx + w + 1];
        this.smoothMask[idx] = neighbors >= 5 ? 1 : 0;
      }
    }

    // Connected-component labeling to isolate ONLY the single hand blob (ignores face/background)
    this.labels.fill(0);
    let currentLabel = 0;
    let bestLabel = 0;
    let bestScore = -1e9;
    let bestArea = 0;
    let bestSumX = 0;
    let bestSumY = 0;
    let bestMinX = w;
    let bestMaxX = 0;
    let bestMinY = h;
    let bestMaxY = 0;

    const anchorX = this.hasFix ? this.smoothX * w : w * 0.5;
    const anchorY = this.hasFix ? this.smoothY * h : h * 0.56;

    for (let y = 1; y < h - 1; y++) {
      const row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const startIdx = row + x;
        if (this.smoothMask[startIdx] !== 1 || this.labels[startIdx] !== 0) continue;

        currentLabel++;
        let head = 0;
        let tail = 0;
        this.bfsQueue[tail++] = startIdx;
        this.labels[startIdx] = currentLabel;

        let area = 0;
        let cSumX = 0;
        let cSumY = 0;
        let cMinX = x;
        let cMaxX = x;
        let cMinY = y;
        let cMaxY = y;

        while (head < tail) {
          const cur = this.bfsQueue[head++];
          const cy = Math.floor(cur / w);
          const cx = cur - cy * w;
          area++;
          cSumX += cx;
          cSumY += cy;
          if (cx < cMinX) cMinX = cx;
          if (cx > cMaxX) cMaxX = cx;
          if (cy < cMinY) cMinY = cy;
          if (cy > cMaxY) cMaxY = cy;

          const nLeft = cur - 1;
          if (cx > 1 && this.smoothMask[nLeft] === 1 && this.labels[nLeft] === 0) {
            this.labels[nLeft] = currentLabel;
            this.bfsQueue[tail++] = nLeft;
          }
          const nRight = cur + 1;
          if (cx < w - 2 && this.smoothMask[nRight] === 1 && this.labels[nRight] === 0) {
            this.labels[nRight] = currentLabel;
            this.bfsQueue[tail++] = nRight;
          }
          const nUp = cur - w;
          if (cy > 1 && this.smoothMask[nUp] === 1 && this.labels[nUp] === 0) {
            this.labels[nUp] = currentLabel;
            this.bfsQueue[tail++] = nUp;
          }
          const nDown = cur + w;
          if (cy < h - 2 && this.smoothMask[nDown] === 1 && this.labels[nDown] === 0) {
            this.labels[nDown] = currentLabel;
            this.bfsQueue[tail++] = nDown;
          }
        }

        // Filter out tiny specks and giant wall/lighting backgrounds
        if (area < 170 || area > total * 0.45) continue;

        const centX = cSumX / area;
        const centY = cSumY / area;
        const distPenalty = Math.hypot(centX - anchorX, centY - anchorY) * 14;
        // Prefer typical foreground hand sizes (400..4500 px) near locked anchor
        const score = Math.min(area, 4200) - distPenalty;

        if (score > bestScore) {
          bestScore = score;
          bestLabel = currentLabel;
          bestArea = area;
          bestSumX = cSumX;
          bestSumY = cSumY;
          bestMinX = cMinX;
          bestMaxX = cMaxX;
          bestMinY = cMinY;
          bestMaxY = cMaxY;
        }
      }
    }

    const cleanCount = bestArea;
    const minX = bestMinX;
    const maxX = bestMaxX;
    const minY = bestMinY;
    const maxY = bestMaxY;

    const skinCoverage = cleanCount / total;
    if (bestLabel === 0 || cleanCount < 170 || rawCount < 140) {
      this.missFrames++;
      if (this.missFrames > 6) {
        this.stableGesture = 'none';
        this.candidateStreak = 0;
        this.hasFix = false;
      }
      return {
        ...this.emptyFrame(),
        skinCoverage,
        cursorX: this.smoothX,
        cursorY: this.smoothY
      };
    }

    this.missFrames = 0;

    // Initial centroid & trimmed core palm center strictly inside selected hand blob
    const cx0 = bestSumX / cleanCount;
    const cy0 = bestSumY / cleanCount;
    const bw = Math.max(12, maxX - minX);
    const bh = Math.max(12, maxY - minY);

    let coreSumX = 0;
    let coreSumY = 0;
    let coreWeight = 0;
    for (let y = minY; y <= maxY; y++) {
      const row = y * w;
      for (let x = minX; x <= maxX; x++) {
        if (this.labels[row + x] !== bestLabel) continue;
        const dyNorm = (y - minY) / bh;
        const weight = dyNorm < 0.72 ? 1.0 : 0.25;
        coreSumX += x * weight;
        coreSumY += y * weight;
        coreWeight += weight;
      }
    }

    const palmCx = coreWeight > 0 ? coreSumX / coreWeight : cx0;
    const palmCy = coreWeight > 0 ? coreSumY / coreWeight : cy0;

    // Estimate palm radius via 48 angular rays strictly from pixels in the selected hand blob
    const numBins = 48;
    const maxRay = new Float32Array(numBins);
    const rayTipX = new Float32Array(numBins);
    const rayTipY = new Float32Array(numBins);

    for (let y = minY; y <= maxY; y++) {
      const row = y * w;
      for (let x = minX; x <= maxX; x++) {
        if (this.labels[row + x] !== bestLabel) continue;
        const dx = x - palmCx;
        const dy = y - palmCy;
        const dist = Math.hypot(dx, dy);
        let angle = Math.atan2(dy, dx); // -PI..PI
        if (angle < 0) angle += Math.PI * 2;
        const bin = Math.min(numBins - 1, Math.floor((angle / (Math.PI * 2)) * numBins));
        if (dist > maxRay[bin]) {
          maxRay[bin] = dist;
          rayTipX[bin] = x;
          rayTipY[bin] = y;
        }
      }
    }

    // Ignore narrow downward wrist arc (angle around +PI/2) so thumb on sides is always tracked
    const upperRays: number[] = [];
    for (let b = 0; b < numBins; b++) {
      const angle = ((b + 0.5) / numBins) * Math.PI * 2;
      const isWrist = angle > Math.PI * 0.39 && angle < Math.PI * 0.61;
      if (!isWrist && maxRay[b] > 2) {
        upperRays.push(maxRay[b]);
      }
    }

    const sortedRays = [...upperRays].sort((a, b) => a - b);
    const medianRay =
      sortedRays.length > 0 ? sortedRays[Math.floor(sortedRays.length * 0.38)] : Math.min(bw, bh) * 0.28;
    const palmRadiusPx = Math.max(8, medianRay);

    // Light 3-tap circular smoothing on radial envelope to suppress pixel noise
    const smoothRay = new Float32Array(numBins);
    for (let b = 0; b < numBins; b++) {
      const p = maxRay[(b - 1 + numBins) % numBins];
      const c = maxRay[b];
      const n = maxRay[(b + 1) % numBins];
      smoothRay[b] = p * 0.2 + c * 0.6 + n * 0.2;
    }

    // Detect up to 5 prominent fingertip peaks
    const candidateBins: { bin: number; score: number }[] = [];
    const peakThreshold = palmRadiusPx * 1.26;

    for (let b = 0; b < numBins; b++) {
      const angle = ((b + 0.5) / numBins) * Math.PI * 2;
      const isWrist = angle > Math.PI * 0.39 && angle < Math.PI * 0.61;
      if (isWrist) continue;

      const prev = smoothRay[(b - 1 + numBins) % numBins];
      const cur = smoothRay[b];
      const next = smoothRay[(b + 1) % numBins];
      if (cur >= peakThreshold && cur >= prev && cur >= next) {
        // Compute local valley depth within +-3 bins to reject flat blobs
        let localMin = cur;
        for (let k = -3; k <= 3; k++) {
          if (k === 0) continue;
          const v = smoothRay[(b + k + numBins) % numBins];
          if (v < localMin) localMin = v;
        }
        const prominence = cur - localMin;
        if (prominence >= palmRadiusPx * 0.13) {
          candidateBins.push({ bin: b, score: maxRay[b] });
        }
      }
    }

    // Non-maximum suppression: merge peaks closer than 3 angular bins (~22.5 deg)
    const peakBins: number[] = [];
    for (const cand of candidateBins) {
      const last = peakBins[peakBins.length - 1];
      if (last !== undefined && Math.abs(cand.bin - last) <= 3) {
        if (maxRay[cand.bin] > maxRay[last]) peakBins[peakBins.length - 1] = cand.bin;
      } else {
        peakBins.push(cand.bin);
      }
    }

    // Wrap-around merge check between last and first bin
    if (peakBins.length > 1 && numBins - peakBins[peakBins.length - 1] + peakBins[0] <= 3) {
      const first = peakBins[0];
      const last = peakBins[peakBins.length - 1];
      if (maxRay[last] > maxRay[first]) peakBins[0] = last;
      peakBins.pop();
    }

    // Keep top 5 strongest fingertip sensors, ordered left-to-right for stable 1..5 IDs
    const topFiveBins = [...peakBins]
      .sort((a, b) => maxRay[b] - maxRay[a])
      .slice(0, 5)
      .sort((a, b) => rayTipX[a] - rayTipX[b]);

    const tips: HandTipPoint[] = topFiveBins.map((b) => ({
      x: rayTipX[b] / w,
      y: rayTipY[b] / h,
      angle: ((b + 0.5) / numBins) * Math.PI * 2,
      distRatio: maxRay[b] / palmRadiusPx
    }));

    const fingerCount = tips.length;
    const aspectRatio = bh / bw;
    const compactness = cleanCount / (bw * bh);

    // Primary 3D control anchor driven directly by active fingertip sensors
    let targetX = palmCx / w;
    let targetY = palmCy / h;
    if (fingerCount > 0) {
      let sx = 0;
      let sy = 0;
      for (const t of tips) {
        sx += t.x;
        sy += t.y;
      }
      targetX = sx / fingerCount;
      targetY = sy / fingerCount;
    }

    // Pinch ratio estimate
    let rawPinch = 0.2;
    if (fingerCount === 0 && compactness > 0.54 && aspectRatio < 1.38) {
      rawPinch = 0.85;
    } else if (fingerCount === 2 && tips.length === 2) {
      const tipDist = Math.hypot(tips[0].x - tips[1].x, tips[0].y - tips[1].y);
      rawPinch = Math.max(0, Math.min(1, 1 - tipDist * 3.1));
    }

    // Classify raw gesture strictly from fingertip count & spacing
    let detectedGesture: HandGestureId = 'palm_5';
    if (fingerCount >= 4) {
      detectedGesture = 'palm_5';
    } else if (fingerCount === 3) {
      detectedGesture = 'morph_3';
    } else if (fingerCount === 2) {
      const tipDist = Math.hypot(tips[0].x - tips[1].x, tips[0].y - tips[1].y);
      detectedGesture = tipDist < 0.11 ? 'pinch' : 'slice_2';
    } else if (fingerCount === 1) {
      const tip = tips[0];
      detectedGesture = tip.distRatio < 1.55 && compactness > 0.62 ? 'pinch' : 'point_1';
    } else {
      detectedGesture = compactness > 0.64 ? 'fist_0' : 'pinch';
    }

    // Stronger temporal hysteresis (6 frames) so fingertip count/gesture never flickers
    if (detectedGesture === this.candidateGesture) {
      this.candidateStreak++;
    } else {
      this.candidateGesture = detectedGesture;
      this.candidateStreak = 1;
    }

    if (this.candidateStreak >= 6) {
      this.stableGesture = detectedGesture;
    } else if (this.stableGesture === 'none') {
      this.stableGesture = detectedGesture;
    }

    // Exponential smoothing
    const alpha = Math.max(0.08, Math.min(0.65, 1.0 - smoothing * 0.78));
    if (!this.hasFix) {
      this.smoothX = targetX;
      this.smoothY = targetY;
      this.smoothPinch = rawPinch;
      this.smoothSpread = Math.max(0.45, Math.min(1.65, (bw / w) * 2.5));
      this.hasFix = true;
    } else {
      this.smoothX += (targetX - this.smoothX) * alpha;
      this.smoothY += (targetY - this.smoothY) * alpha;
      this.smoothPinch += (rawPinch - this.smoothPinch) * 0.25;
      const targetSpread = Math.max(0.45, Math.min(1.75, (Math.max(bw, bh) / w) * 2.4));
      this.smoothSpread += (targetSpread - this.smoothSpread) * 0.2;
    }

    const confidence = Math.min(0.98, Math.max(0.35, cleanCount / 1600 + (fingerCount > 0 ? 0.25 : 0.12)));

    return {
      detected: true,
      gesture: this.stableGesture,
      fingerCount,
      cursorX: Math.max(0.02, Math.min(0.98, this.smoothX)),
      cursorY: Math.max(0.02, Math.min(0.98, this.smoothY)),
      pinchRatio: this.smoothPinch,
      spreadScale: this.smoothSpread,
      confidence,
      palmRadius: palmRadiusPx / w,
      skinCoverage,
      tips,
      bbox: {
        minX: minX / w,
        minY: minY / h,
        maxX: maxX / w,
        maxY: maxY / h
      }
    };
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

    // Show calibration guide only when no hand is currently detected
    if (!frame.detected) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(cw * 0.38, ch * 0.32, cw * 0.24, ch * 0.36);
      ctx.setLineDash([]);
      return;
    }

    // Sensors strictly on the 5 fingertips ONLY (no bounding box, no palm core, no wrist bones)
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    frame.tips.slice(0, 5).forEach((tip, idx) => {
      const tx = tip.x * cw;
      const ty = tip.y * ch;

      // Outer precision sensor halo
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(tx, ty, 7.5, 0, Math.PI * 2);
      ctx.stroke();

      // Inner solid glowing fingertip sensor core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Crisp fingertip sensor number (1..5)
      ctx.fillStyle = activeColor;
      ctx.fillText(String(idx + 1), tx, Math.max(8, ty - 12));
    });
  }

  private emptyFrame(): HandTrackingFrame {
    return {
      detected: false,
      gesture: 'none',
      fingerCount: 0,
      cursorX: 0.5,
      cursorY: 0.5,
      pinchRatio: 0,
      spreadScale: 1,
      confidence: 0,
      palmRadius: 0.1,
      skinCoverage: 0,
      tips: [],
      bbox: null
    };
  }
}
