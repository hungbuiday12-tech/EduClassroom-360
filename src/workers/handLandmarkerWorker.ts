import { FilesetResolver, HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface WorkerInitMessage {
  type: 'init';
  baseUrl: string;
}

export interface WorkerFrameMessage {
  type: 'frame';
  seq: number;
  timestampMs: number;
  bitmap: ImageBitmap;
}

export interface WorkerDisposeMessage {
  type: 'dispose';
}

export type HandWorkerInMessage = WorkerInitMessage | WorkerFrameMessage | WorkerDisposeMessage;

export interface HandWorkerOutInit {
  type: 'init_result';
  ok: boolean;
  delegate?: 'GPU' | 'CPU';
  error?: string;
}

export interface HandWorkerOutResult {
  type: 'result';
  seq: number;
  inferMs: number;
  landmarks: NormalizedLandmark[][];
  handedness: { score: number; categoryName: string }[][];
}

export type HandWorkerOutMessage = HandWorkerOutInit | HandWorkerOutResult;

let landmarker: HandLandmarker | null = null;
let offscreenCanvas: OffscreenCanvas | null = null;
let offscreenCtx: OffscreenCanvasRenderingContext2D | null = null;
let delegateUsed: 'GPU' | 'CPU' = 'GPU';
let lastTs = 0;

async function createHandLandmarker(
  wasmPath: string,
  modelPath: string,
  delegate: 'GPU' | 'CPU'
): Promise<HandLandmarker> {
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
}

async function handleInit(baseUrl: string): Promise<void> {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const originPrefix =
    normalizedBase.startsWith('http://') || normalizedBase.startsWith('https://')
      ? normalizedBase
      : `${self.location.origin}${normalizedBase.startsWith('/') ? '' : '/'}${normalizedBase}`;
  const localWasmPath = `${originPrefix}mediapipe/wasm`;
  const localModelPath = `${originPrefix}mediapipe/hand_landmarker.task`;

  try {
    try {
      landmarker = await createHandLandmarker(localWasmPath, localModelPath, 'GPU');
      delegateUsed = 'GPU';
    } catch {
      landmarker = await createHandLandmarker(localWasmPath, localModelPath, 'CPU');
      delegateUsed = 'CPU';
    }
    self.postMessage({ type: 'init_result', ok: true, delegate: delegateUsed } satisfies HandWorkerOutInit);
    return;
  } catch (localErr) {
    const cdnWasm = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm';
    const cdnModel =
      'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
    try {
      try {
        landmarker = await createHandLandmarker(cdnWasm, cdnModel, 'GPU');
        delegateUsed = 'GPU';
      } catch {
        landmarker = await createHandLandmarker(cdnWasm, cdnModel, 'CPU');
        delegateUsed = 'CPU';
      }
      self.postMessage({ type: 'init_result', ok: true, delegate: delegateUsed } satisfies HandWorkerOutInit);
    } catch (cdnErr) {
      const msg =
        cdnErr instanceof Error
          ? cdnErr.message
          : localErr instanceof Error
          ? localErr.message
          : 'Failed to initialize HandLandmarker worker';
      self.postMessage({ type: 'init_result', ok: false, error: msg } satisfies HandWorkerOutInit);
    }
  }
}

function handleFrame(msg: WorkerFrameMessage): void {
  const { bitmap, seq, timestampMs } = msg;
  if (!landmarker) {
    bitmap.close();
    return;
  }

  try {
    const w = bitmap.width || 480;
    const h = bitmap.height || 360;
    if (!offscreenCanvas || offscreenCanvas.width !== w || offscreenCanvas.height !== h) {
      offscreenCanvas = new OffscreenCanvas(w, h);
      offscreenCtx = offscreenCanvas.getContext('2d', { desynchronized: true });
    }
    if (!offscreenCtx || !offscreenCanvas) {
      bitmap.close();
      return;
    }

    offscreenCtx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const safeTs = Math.max(lastTs + 1, timestampMs);
    lastTs = safeTs;

    const t0 = performance.now();
    const res = landmarker.detectForVideo(offscreenCanvas as unknown as TexImageSource, safeTs);
    const inferMs = performance.now() - t0;

    const handedness = (res.handedness || []).map((cats) =>
      cats.map((c) => ({ score: c.score ?? 0.9, categoryName: c.categoryName ?? '' }))
    );

    self.postMessage({
      type: 'result',
      seq,
      inferMs,
      landmarks: res.landmarks || [],
      handedness
    } satisfies HandWorkerOutResult);
  } catch {
    try {
      bitmap.close();
    } catch {}
    self.postMessage({
      type: 'result',
      seq,
      inferMs: 0,
      landmarks: [],
      handedness: []
    } satisfies HandWorkerOutResult);
  }
}

self.onmessage = (event: MessageEvent<HandWorkerInMessage>) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'init') {
    void handleInit(data.baseUrl);
  } else if (data.type === 'frame') {
    handleFrame(data);
  } else if (data.type === 'dispose') {
    try {
      landmarker?.close();
    } catch {}
    landmarker = null;
    offscreenCanvas = null;
    offscreenCtx = null;
  }
};
