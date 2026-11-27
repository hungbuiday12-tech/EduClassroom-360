import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Studio2DDragState, ZERO_STUDIO_DRAG } from '../components/common/studio2DCanvasKit';

export interface UseCanvasModelDragResult {
  dragRef: RefObject<Studio2DDragState>;
  isMoved: boolean;
  isDragging: boolean;
  resetDrag: () => void;
}

/**
 * Enables direct mouse/touch drag-and-drop of simulation models across the 2D canvas floor.
 * Double-clicking the canvas or calling `resetDrag()` smoothly returns the model to center.
 */
export type CanvasModelDragResetKey =
  | string
  | number
  | { resetKey?: string | number; rebindKey?: string | number };

export function useCanvasModelDrag(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  resetKey?: CanvasModelDragResetKey,
  rebindKey?: string | number
): UseCanvasModelDragResult {
  const dragRef = useRef<Studio2DDragState>({ ...ZERO_STUDIO_DRAG });
  const [isMoved, setIsMoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resolvedResetKey =
    typeof resetKey === 'object' && resetKey !== null ? resetKey.resetKey : resetKey;
  const resolvedRebindKey =
    rebindKey ?? (typeof resetKey === 'object' && resetKey !== null ? resetKey.rebindKey : undefined);

  const resetDrag = useCallback(() => {
    dragRef.current = { ...ZERO_STUDIO_DRAG };
    setIsMoved(false);
    setIsDragging(false);
  }, []);

  useEffect(() => {
    resetDrag();
  }, [resolvedResetKey, resetDrag]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let activePointerId: number | null = null;
    let startClientX = 0;
    let startClientY = 0;
    let startOffsetX = 0;
    let startOffsetY = 0;

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';

    const clampOffset = (nx: number, ny: number) => {
      const rect = canvas.getBoundingClientRect();
      const maxX = Math.max(90, rect.width * 0.36);
      const maxUp = Math.max(55, rect.height * 0.24);
      const maxDown = Math.max(40, rect.height * 0.16);
      return {
        x: Math.max(-maxX, Math.min(maxX, nx)),
        y: Math.max(-maxUp, Math.min(maxDown, ny))
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      activePointerId = e.pointerId;
      startClientX = e.clientX;
      startClientY = e.clientY;
      startOffsetX = dragRef.current.offsetX;
      startOffsetY = dragRef.current.offsetY;
      dragRef.current.isDragging = true;
      setIsDragging(true);
      canvas.style.cursor = 'grabbing';
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // ignore synthetic events
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      const clamped = clampOffset(
        startOffsetX + (e.clientX - startClientX),
        startOffsetY + (e.clientY - startClientY)
      );
      dragRef.current.offsetX = clamped.x;
      dragRef.current.offsetY = clamped.y;
      if (Math.abs(clamped.x) > 2 || Math.abs(clamped.y) > 2) {
        setIsMoved(true);
      }
    };

    const finishDrag = (e: PointerEvent) => {
      if (activePointerId !== e.pointerId) return;
      activePointerId = null;
      dragRef.current.isDragging = false;
      setIsDragging(false);
      canvas.style.cursor = 'grab';
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    };

    const onPointerEnter = () => {
      dragRef.current.isHovering = true;
    };

    const onPointerLeave = () => {
      dragRef.current.isHovering = false;
    };

    const onDblClick = () => {
      resetDrag();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', finishDrag);
    canvas.addEventListener('pointercancel', finishDrag);
    canvas.addEventListener('pointerenter', onPointerEnter);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('dblclick', onDblClick);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', finishDrag);
      canvas.removeEventListener('pointercancel', finishDrag);
      canvas.removeEventListener('pointerenter', onPointerEnter);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('dblclick', onDblClick);
      canvas.style.cursor = '';
      canvas.style.touchAction = '';
    };
  }, [canvasRef, resetDrag, resolvedResetKey, resolvedRebindKey]);

  return { dragRef, isMoved, isDragging, resetDrag };
}
