import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type HologramDisplayMode = 'normal' | 'head_cam' | 'head_mouse' | 'anaglyph' | 'vr_stereo';

export interface HeadOffset {
  x: number; // -1 .. +1
  y: number; // -1 .. +1
  z: number; // 0.6 .. 1.6 (distance scale)
}

/**
 * Applies true Off-Axis Asymmetric Frustum projection (Johnny Chung Lee style)
 * so moving your head shifts the perspective window realistically without rotating orbit target.
 */
export function applyOffAxisProjection(
  camera: THREE.PerspectiveCamera,
  head: HeadOffset,
  baseTargetDist = 12,
  screenHalfHeight = 3.8
) {
  const aspect = Math.max(0.4, camera.aspect || 1.6);
  const screenHalfWidth = screenHalfHeight * aspect;
  const eyeX = head.x * 3.4;
  const eyeY = head.y * 2.3;
  const eyeZ = baseTargetDist * head.z;

  const near = camera.near || 0.1;
  const far = camera.far || 120;
  const scale = near / Math.max(2.0, eyeZ);

  const left = (-screenHalfWidth - eyeX) * scale;
  const right = (screenHalfWidth - eyeX) * scale;
  const bottom = (-screenHalfHeight - eyeY) * scale;
  const top = (screenHalfHeight - eyeY) * scale;

  camera.projectionMatrix.makePerspective(left, right, top, bottom, near, far);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
}

/**
 * Lightweight webcam face/head centroid tracker (zero external WASM latency)
 * with smooth exponential filtering & pointer-parallax mode fallback.
 */
export function useHeadTrackedHologram(mode: HologramDisplayMode) {
  const headOffsetRef = useRef<HeadOffset>({ x: 0, y: 0, z: 1 });
  const [camStatus, setCamStatus] = useState<'idle' | 'active' | 'denied'>('idle');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetHead = useCallback(() => {
    headOffsetRef.current = { x: 0, y: 0, z: 1 };
  }, []);

  useEffect(() => {
    if (mode !== 'head_mouse') return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      headOffsetRef.current.x += (nx - headOffsetRef.current.x) * 0.25;
      headOffsetRef.current.y += (ny - headOffsetRef.current.y) * 0.25;
      headOffsetRef.current.z = 1.0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'head_cam') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCamStatus('idle');
      if (mode === 'normal') {
        headOffsetRef.current = { x: 0, y: 0, z: 1 };
      }
      return;
    }

    let cancelled = false;
    let rafId = 0;
    const workCanvas = document.createElement('canvas');
    workCanvas.width = 64;
    workCanvas.height = 48;
    const wctx = workCanvas.getContext('2d', { willReadFrequently: true });

    const startCam = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCamStatus('denied');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 160, height: 120, facingMode: 'user' },
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

        const loop = () => {
          if (cancelled) return;
          rafId = requestAnimationFrame(loop);
          if (!wctx || vid.readyState < 2) return;

          wctx.drawImage(vid, 0, 0, 64, 48);
          const data = wctx.getImageData(0, 0, 64, 48).data;

          // Weighted luminance + warm skin-tone face region centroid in mirrored selfie view
          let sumW = 0;
          let sumX = 0;
          let sumY = 0;
          for (let y = 4; y < 44; y++) {
            for (let x = 4; x < 60; x++) {
              const i = (y * 64 + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const luma = (r + g + b) / 3;
              // Emphasize illuminated face/skin pixels over darker background
              const isSkinLike = r > g && r > b && r - b > 14 && luma > 65;
              const w = isSkinLike ? 3.5 : luma > 135 ? 1.0 : 0.05;
              sumW += w;
              sumX += (1 - x / 64) * w; // mirrored X
              sumY += (y / 48) * w;
            }
          }
          if (sumW > 12) {
            const cx = (sumX / sumW) * 2 - 1;
            const cy = -((sumY / sumW) * 2 - 1);
            const clampedX = Math.max(-1, Math.min(1, cx * 2.2));
            const clampedY = Math.max(-1, Math.min(1, cy * 2.0));
            headOffsetRef.current.x += (clampedX - headOffsetRef.current.x) * 0.18;
            headOffsetRef.current.y += (clampedY - headOffsetRef.current.y) * 0.18;
          }
        };
        rafId = requestAnimationFrame(loop);
      } catch {
        if (!cancelled) setCamStatus('denied');
      }
    };

    startCam();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      videoRef.current = null;
    };
  }, [mode]);

  return { headOffsetRef, camStatus, resetHead };
}
