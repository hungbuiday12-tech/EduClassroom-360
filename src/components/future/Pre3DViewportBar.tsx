import React from 'react';
import * as THREE from 'three';
import { Activity, Bookmark, BookmarkCheck, Camera, Compass, RotateCcw, Scissors } from 'lucide-react';

export type SliceAxis = 'x' | 'y' | 'z';
export type QuickCamPreset = 'iso' | 'top' | 'front';

export interface CameraBookmarkPose {
  pos: [number, number, number];
  target: [number, number, number];
}

export function detectSoftwareGl(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbg) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return false;
    }
    const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(renderer);
  } catch {
    return true;
  }
}

/**
 * Software WebGL-safe frame pacing helper:
 * On hardware GPU, schedules immediately via requestAnimationFrame.
 * On software WebGL (SwiftShader/llvmpipe), waits for WebGL2 fenceSync + 80ms budget
 * before scheduling the next frame so the main thread stays responsive.
 */
export function scheduleSyncedGlFrame(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
  onNext: (now: number) => void,
  onCleanupHandle: (cancel: () => void) => void
): void {
  if (!isSoftwareGl) {
    const id = requestAnimationFrame(onNext);
    onCleanupHandle(() => cancelAnimationFrame(id));
    return;
  }

  let cancelled = false;
  let timerId = 0;
  let rafId = 0;
  onCleanupHandle(() => {
    cancelled = true;
    if (timerId) window.clearTimeout(timerId);
    if (rafId) cancelAnimationFrame(rafId);
  });

  const gl = renderer.getContext();
  const isGl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  if (isGl2) {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (sync) {
      gl.flush();
      const pollSync = () => {
        if (cancelled) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.clientWaitSync(sync, 0, 0);
        if (status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED || status === gl.WAIT_FAILED) {
          gl.deleteSync(sync);
          timerId = window.setTimeout(() => {
            if (!cancelled) rafId = requestAnimationFrame(onNext);
          }, 80);
        } else {
          timerId = window.setTimeout(pollSync, 16);
        }
      };
      timerId = window.setTimeout(pollSync, 16);
      return;
    }
  }

  timerId = window.setTimeout(() => {
    if (!cancelled) rafId = requestAnimationFrame(onNext);
  }, 80);
}

export function updateClipPlaneFromState(
  plane: THREE.Plane,
  axis: SliceAxis,
  offset: number
): void {
  if (axis === 'x') plane.set(new THREE.Vector3(-1, 0, 0), offset);
  else if (axis === 'y') plane.set(new THREE.Vector3(0, -1, 0), offset);
  else plane.set(new THREE.Vector3(0, 0, -1), offset);
}

export function applyClipPlaneToObject(
  root: THREE.Object3D,
  planes: THREE.Plane[] | null
): void {
  const seen = new Set<THREE.Material>();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.material) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (let i = 0; i < mats.length; i++) {
      const m = mats[i];
      if (!m || seen.has(m)) continue;
      seen.add(m);
      m.clippingPlanes = planes;
      m.clipShadows = Boolean(planes);
      m.needsUpdate = true;
    }
  });
}

interface Pre3DProControlsProps {
  isEn: boolean;
  sliceEnabled: boolean;
  onToggleSlice: () => void;
  sliceAxis: SliceAxis;
  onChangeSliceAxis: (axis: SliceAxis) => void;
  sliceOffset: number;
  onChangeSliceOffset: (val: number) => void;
  sliceMin?: number;
  sliceMax?: number;
  showTelemetry: boolean;
  onToggleTelemetry: () => void;
  hasBookmark: boolean;
  onSaveBookmark: () => void;
  onRecallBookmark: () => void;
  onCameraPreset: (preset: QuickCamPreset) => void;
  onResetCamera: () => void;
}

export const Pre3DProControlsBar: React.FC<Pre3DProControlsProps> = ({
  isEn,
  sliceEnabled,
  onToggleSlice,
  sliceAxis,
  onChangeSliceAxis,
  sliceOffset,
  onChangeSliceOffset,
  sliceMin = -2.8,
  sliceMax = 2.8,
  showTelemetry,
  onToggleTelemetry,
  hasBookmark,
  onSaveBookmark,
  onRecallBookmark,
  onCameraPreset,
  onResetCamera,
}) => {
  return (
    <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/75 flex flex-wrap items-center justify-between gap-2 text-[11px]">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-400 mr-1">
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span>{isEn ? 'Cam' : 'Góc'}</span>
        </span>
        {(['iso', 'top', 'front'] as const).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onCameraPreset(preset)}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold cursor-pointer whitespace-nowrap"
          >
            {preset === 'iso' ? 'Iso' : preset === 'top' ? (isEn ? 'Top' : 'Đỉnh') : isEn ? 'Front' : 'Thẳng'}
          </button>
        ))}
        <button
          type="button"
          onClick={onResetCamera}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold cursor-pointer whitespace-nowrap"
          title={isEn ? 'Reset Camera View' : 'Đặt lại Góc nhìn'}
        >
          <RotateCcw className="w-3 h-3 text-sky-400" />
          <span>{isEn ? 'Reset Cam' : 'Góc gốc'}</span>
        </button>
        <button
          type="button"
          onClick={onSaveBookmark}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold cursor-pointer whitespace-nowrap"
          title={isEn ? 'Bookmark Current Camera Angle' : 'Lưu Góc nhìn Hiện tại'}
        >
          <Bookmark className="w-3 h-3" />
          <span>{isEn ? 'Save View' : 'Lưu Góc'}</span>
        </button>
        {hasBookmark && (
          <button
            type="button"
            onClick={onRecallBookmark}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-200 font-bold cursor-pointer whitespace-nowrap"
            title={isEn ? 'Restore Saved Camera Angle' : 'Mở Góc đã Lưu'}
          >
            <BookmarkCheck className="w-3 h-3" />
            <span>{isEn ? 'Recall' : 'Mở Góc'}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleSlice}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-bold cursor-pointer whitespace-nowrap ${
            sliceEnabled
              ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>{isEn ? 'Cutaway Slice' : 'Mặt Cắt 3D'}</span>
        </button>

        {sliceEnabled && (
          <div className="flex items-center gap-1.5 rounded-md bg-slate-950/90 border border-slate-700 px-2 py-1">
            {(['x', 'y', 'z'] as const).map((ax) => (
              <button
                key={ax}
                type="button"
                onClick={() => onChangeSliceAxis(ax)}
                className={`px-1.5 py-0.5 rounded font-mono font-bold uppercase cursor-pointer ${
                  sliceAxis === ax
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ax}
              </button>
            ))}
            <input
              type="range"
              min={sliceMin}
              max={sliceMax}
              step={0.1}
              value={sliceOffset}
              onChange={(e) => onChangeSliceOffset(Number(e.target.value))}
              className="w-20 sm:w-24 accent-amber-400 cursor-pointer"
              aria-label={isEn ? 'Cutaway offset' : 'Vị trí mặt cắt'}
            />
            <span className="font-mono text-amber-300 tabular-nums w-9 text-right">
              {sliceOffset.toFixed(1)}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleTelemetry}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-bold cursor-pointer whitespace-nowrap ${
            showTelemetry
              ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isEn ? 'Telemetry' : 'Đồ thị Telemetry'}</span>
        </button>

        <span className="hidden xl:inline-flex items-center gap-1 text-slate-500 font-mono">
          <Compass className="w-3 h-3" />
          360° Orbit
        </span>
      </div>
    </div>
  );
};
