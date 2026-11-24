import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type HologramDisplayMode = 'normal' | 'head_cam' | 'head_mouse' | 'anaglyph' | 'vr_stereo';

export interface HeadOffset {
  x: number; // -1 .. +1
  y: number; // -1 .. +1
  z: number; // 0.7 .. 1.45 (distance multiplier)
}

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _desiredWorldOffset = new THREE.Vector3();

/**
 * Restores camera position & symmetric perspective frustum after off-axis Hologram pass.
 */
export function resetOffAxisProjection(
  camera: THREE.PerspectiveCamera,
  appliedWorldOffset?: THREE.Vector3
) {
  if (appliedWorldOffset && appliedWorldOffset.lengthSq() > 0) {
    camera.position.sub(appliedWorldOffset);
    appliedWorldOffset.set(0, 0, 0);
  }
  camera.updateProjectionMatrix();
}

/**
 * Applies true Off-Axis Asymmetric Frustum + reversible camera-plane translation
 * anchored at the OrbitControls target so the screen plane stays locked while 3D depth pops in/out.
 */
export function applyOffAxisProjection(
  camera: THREE.PerspectiveCamera,
  head: HeadOffset,
  baseTargetDist = 12,
  screenHalfHeight = 3.8,
  target?: THREE.Vector3,
  appliedWorldOffset?: THREE.Vector3,
  smoothLerp = 0.28
) {
  // Always remove any previously applied parallax before computing base vectors
  if (appliedWorldOffset && appliedWorldOffset.lengthSq() > 0) {
    camera.position.sub(appliedWorldOffset);
  }

  const dist = target
    ? Math.max(2.5, camera.position.distanceTo(target))
    : Math.max(2.5, baseTargetDist);

  const aspect = Math.max(0.4, camera.aspect || 1.6);
  const halfH = target
    ? dist * Math.tan(THREE.MathUtils.degToRad((camera.fov || 45) * 0.5))
    : screenHalfHeight;
  const halfW = halfH * aspect;

  const clampedX = THREE.MathUtils.clamp(head.x, -1, 1);
  const clampedY = THREE.MathUtils.clamp(head.y, -1, 1);
  const clampedZ = THREE.MathUtils.clamp(head.z || 1, 0.72, 1.45);

  const eyeX = clampedX * Math.min(halfW * 0.42, dist * 0.28);
  const eyeY = clampedY * Math.min(halfH * 0.42, dist * 0.22);
  const eyeZ = dist * clampedZ;

  // Translate camera laterally in its local screen plane (without re-aiming quaternion)
  if (appliedWorldOffset) {
    camera.updateMatrixWorld();
    camera.matrixWorld.extractBasis(_right, _up, _fwd);
    // camera looks down -Z, so _fwd points backward from target -> camera; forward toward target is -_fwd
    _desiredWorldOffset
      .set(0, 0, 0)
      .addScaledVector(_right, eyeX)
      .addScaledVector(_up, eyeY)
      .addScaledVector(_fwd, eyeZ - dist);

    appliedWorldOffset.lerp(_desiredWorldOffset, smoothLerp);
    camera.position.add(appliedWorldOffset);
    camera.updateMatrixWorld();
  }

  const near = camera.near || 0.1;
  const far = camera.far || 120;
  const scale = near / Math.max(1.8, eyeZ);

  // Use actual damped camera offset for exact frustum-position correspondence
  const effX = appliedWorldOffset ? appliedWorldOffset.dot(_right) : eyeX;
  const effY = appliedWorldOffset ? appliedWorldOffset.dot(_up) : eyeY;

  const left = (-halfW - effX) * scale;
  const right = (halfW - effX) * scale;
  const bottom = (-halfH - effY) * scale;
  const top = (halfH - effY) * scale;

  camera.projectionMatrix.makePerspective(left, right, top, bottom, near, far);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}

/**
 * Webcam head-position tracker (native FaceDetector when available + center-weighted skin-tone
 * centroid fallback) and smooth pointer-parallax mode for Hologram window illusion.
 */
export function useHeadTrackedHologram(mode: HologramDisplayMode) {
  const headOffsetRef = useRef<HeadOffset>({ x: 0, y: 0, z: 1 });
  const targetOffsetRef = useRef<HeadOffset>({ x: 0, y: 0, z: 1 });
  const [camStatus, setCamStatus] = useState<'idle' | 'requesting' | 'active' | 'denied'>('idle');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetHead = useCallback(() => {
    headOffsetRef.current = { x: 0, y: 0, z: 1 };
    targetOffsetRef.current = { x: 0, y: 0, z: 1 };
  }, []);

  // Smooth damping + gentle idle breathing parallax in head_mouse when pointer hasn't moved
  useEffect(() => {
    if (mode !== 'head_mouse') return;
    let rafId = 0;
    let pointerActive = false;
    let lastMoveAt = 0;

    const onMove = (e: PointerEvent) => {
      pointerActive = true;
      lastMoveAt = performance.now();
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      targetOffsetRef.current.x = THREE.MathUtils.clamp(nx * 0.9, -1, 1);
      targetOffsetRef.current.y = THREE.MathUtils.clamp(ny * 0.85, -1, 1);
      targetOffsetRef.current.z = 1.0 - Math.abs(nx) * 0.04;
    };

    const onLeave = () => {
      pointerActive = false;
    };

    const tick = () => {
      const now = performance.now();
      if (!pointerActive || now - lastMoveAt > 3500) {
        const t = now * 0.0012;
        targetOffsetRef.current.x = Math.sin(t) * 0.24;
        targetOffsetRef.current.y = Math.cos(t * 0.8) * 0.16;
        targetOffsetRef.current.z = 1.0;
      }
      headOffsetRef.current.x += (targetOffsetRef.current.x - headOffsetRef.current.x) * 0.16;
      headOffsetRef.current.y += (targetOffsetRef.current.y - headOffsetRef.current.y) * 0.16;
      headOffsetRef.current.z += (targetOffsetRef.current.z - headOffsetRef.current.z) * 0.12;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== 'head_cam') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCamStatus('idle');
      if (mode === 'normal' || mode === 'anaglyph' || mode === 'vr_stereo') {
        headOffsetRef.current = { x: 0, y: 0, z: 1 };
        targetOffsetRef.current = { x: 0, y: 0, z: 1 };
      }
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let pointerFallbackCleanup: (() => void) | null = null;
    const workCanvas = document.createElement('canvas');
    workCanvas.width = 80;
    workCanvas.height = 60;
    const wctx = workCanvas.getContext('2d', { willReadFrequently: true });

    const enablePointerBackup = () => {
      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
        const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
        headOffsetRef.current.x += (nx * 0.8 - headOffsetRef.current.x) * 0.16;
        headOffsetRef.current.y += (ny * 0.75 - headOffsetRef.current.y) * 0.16;
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      pointerFallbackCleanup = () => window.removeEventListener('pointermove', onMove);
    };

    const startCam = async () => {
      try {
        setCamStatus('requesting');
        if (!navigator.mediaDevices?.getUserMedia) {
          setCamStatus('denied');
          enablePointerBackup();
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320, max: 640 },
            height: { ideal: 240, max: 480 },
            frameRate: { ideal: 30, max: 60 },
            facingMode: 'user'
          },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const vid = document.createElement('video');
        vid.playsInline = true;
        vid.muted = true;
        vid.srcObject = stream;
        await vid.play();
        videoRef.current = vid;
        setCamStatus('active');

        const FaceDetCtor = (window as unknown as {
          FaceDetector?: new (opts?: { fastMode?: boolean; maxDetectedFaces?: number }) => {
            detect: (img: CanvasImageSource) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
          };
        }).FaceDetector;
        const faceDetector = FaceDetCtor ? new FaceDetCtor({ fastMode: true, maxDetectedFaces: 1 }) : null;
        let baselineBoxW = 0;
        let detectingAsync = false;

        const loop = () => {
          if (cancelled) return;
          rafId = requestAnimationFrame(loop);
          if (!wctx || vid.readyState < 2) return;

          if (faceDetector && !detectingAsync) {
            detectingAsync = true;
            faceDetector
              .detect(vid)
              .then((faces) => {
                detectingAsync = false;
                if (cancelled || !faces?.length || !vid.videoWidth || !vid.videoHeight) return;
                const box = faces[0].boundingBox;
                const cxNorm = 1 - (box.x + box.width * 0.5) / vid.videoWidth; // mirrored
                const cyNorm = (box.y + box.height * 0.5) / vid.videoHeight;
                if (baselineBoxW === 0) baselineBoxW = box.width;
                const depthRatio = baselineBoxW > 0 ? baselineBoxW / Math.max(20, box.width) : 1;
                const clampedX = THREE.MathUtils.clamp((cxNorm * 2 - 1) * 1.8, -1, 1);
                const clampedY = THREE.MathUtils.clamp(-((cyNorm * 2 - 1) * 1.8), -1, 1);
                const clampedZ = THREE.MathUtils.clamp(depthRatio, 0.78, 1.32);
                headOffsetRef.current.x += (clampedX - headOffsetRef.current.x) * 0.24;
                headOffsetRef.current.y += (clampedY - headOffsetRef.current.y) * 0.24;
                headOffsetRef.current.z += (clampedZ - headOffsetRef.current.z) * 0.14;
              })
              .catch(() => {
                detectingAsync = false;
              });
            return;
          }

          // Center-weighted skin-tone centroid fallback (avoids wall lamps/bright windows in outer corners)
          wctx.drawImage(vid, 0, 0, 80, 60);
          const data = wctx.getImageData(0, 0, 80, 60).data;

          let sumW = 0;
          let sumX = 0;
          let sumY = 0;
          for (let y = 8; y < 52; y++) {
            const dy = (y - 30) / 22;
            for (let x = 10; x < 70; x++) {
              const dx = (x - 40) / 30;
              const centerBias = Math.max(0.15, 1 - 0.55 * (dx * dx + dy * dy));
              const i = (y * 80 + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const luma = (r + g + b) / 3;
              // YCbCr-inspired skin check + avoid blown-out white walls (>240)
              const isSkinLike = r > 75 && r > g && g > b * 0.85 && r - b > 16 && luma < 235;
              if (!isSkinLike) continue;
              const w = centerBias * (1 + Math.min(2, (r - b) / 40));
              sumW += w;
              sumX += (1 - x / 80) * w;
              sumY += (y / 60) * w;
            }
          }
          if (sumW > 18) {
            const cx = (sumX / sumW) * 2 - 1;
            const cy = -((sumY / sumW) * 2 - 1);
            const clampedX = THREE.MathUtils.clamp(cx * 2.1, -1, 1);
            const clampedY = THREE.MathUtils.clamp(cy * 1.9, -1, 1);
            headOffsetRef.current.x += (clampedX - headOffsetRef.current.x) * 0.18;
            headOffsetRef.current.y += (clampedY - headOffsetRef.current.y) * 0.18;
          }
        };
        rafId = requestAnimationFrame(loop);
      } catch {
        if (!cancelled) {
          setCamStatus('denied');
          enablePointerBackup();
        }
      }
    };

    startCam();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      pointerFallbackCleanup?.();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      videoRef.current = null;
    };
  }, [mode]);

  return { headOffsetRef, camStatus, resetHead };
}
