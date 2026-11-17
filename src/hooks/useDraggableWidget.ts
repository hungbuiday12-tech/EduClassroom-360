import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface WidgetPosition {
  x: number;
  y: number;
}

interface UseDraggableWidgetOptions {
  storageKey: string;
  dragThresholdPx?: number;
  marginPx?: number;
}

export function useDraggableWidget({
  storageKey,
  dragThresholdPx = 6,
  marginPx = 10
}: UseDraggableWidgetOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<WidgetPosition | null>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<WidgetPosition>;
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number' && Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
        return { x: parsed.x, y: parsed.y };
      }
    } catch {
      // Ignore storage error
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [viewportSize, setViewportSize] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  const didDragRef = useRef(false);
  const dragMetaRef = useRef<{
    active: boolean;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startLeft: number;
    startTop: number;
    boxWidth: number;
    boxHeight: number;
    moved: boolean;
  } | null>(null);

  const clampPos = useCallback(
    (x: number, y: number, boxW: number, boxH: number): WidgetPosition => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      const maxX = Math.max(marginPx, vw - boxW - marginPx);
      const maxY = Math.max(marginPx, vh - boxH - marginPx);
      return {
        x: Math.round(Math.max(marginPx, Math.min(maxX, x))),
        y: Math.round(Math.max(marginPx, Math.min(maxY, y)))
      };
    },
    [marginPx]
  );

  // Re-clamp persisted position whenever window resizes or panel mounts
  useEffect(() => {
    const syncBounds = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
      setPosition((prev) => {
        if (!prev || !containerRef.current) return prev;
        const rect = containerRef.current.getBoundingClientRect();
        const clamped = clampPos(prev.x, prev.y, rect.width || 160, rect.height || 44);
        if (clamped.x === prev.x && clamped.y === prev.y) return prev;
        try {
          localStorage.setItem(storageKey, JSON.stringify(clamped));
        } catch {
          // Ignore storage error
        }
        return clamped;
      });
    };

    syncBounds();
    window.addEventListener('resize', syncBounds);
    return () => window.removeEventListener('resize', syncBounds);
  }, [clampPos, storageKey]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only left mouse button or touch/pen
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      didDragRef.current = false;
      dragMetaRef.current = {
        active: true,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startLeft: rect.left,
        startTop: rect.top,
        boxWidth: rect.width,
        boxHeight: rect.height,
        moved: false
      };
    },
    []
  );

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const meta = dragMetaRef.current;
      if (!meta || !meta.active || e.pointerId !== meta.pointerId) return;

      const dx = e.clientX - meta.startClientX;
      const dy = e.clientY - meta.startClientY;

      if (!meta.moved && Math.hypot(dx, dy) >= dragThresholdPx) {
        meta.moved = true;
        didDragRef.current = true;
        setIsDragging(true);
      }

      if (meta.moved) {
        const el = containerRef.current;
        const curW = el ? el.getBoundingClientRect().width : meta.boxWidth;
        const curH = el ? el.getBoundingClientRect().height : meta.boxHeight;
        const nextPos = clampPos(meta.startLeft + dx, meta.startTop + dy, curW, curH);
        setPosition(nextPos);
      }
    };

    const finishDrag = (e: PointerEvent) => {
      const meta = dragMetaRef.current;
      if (!meta || !meta.active || e.pointerId !== meta.pointerId) return;
      const wasMoved = meta.moved;
      dragMetaRef.current = null;
      setIsDragging(false);

      if (wasMoved) {
        const el = containerRef.current;
        const dx = e.clientX - meta.startClientX;
        const dy = e.clientY - meta.startClientY;
        const curW = el ? el.getBoundingClientRect().width : meta.boxWidth;
        const curH = el ? el.getBoundingClientRect().height : meta.boxHeight;
        const finalPos = clampPos(meta.startLeft + dx, meta.startTop + dy, curW, curH);
        setPosition(finalPos);
        try {
          localStorage.setItem(storageKey, JSON.stringify(finalPos));
        } catch {
          // Ignore storage error
        }
        // Reset didDragRef after the subsequent click event cycle
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 120);
      } else {
        didDragRef.current = false;
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [clampPos, dragThresholdPx, storageKey]);

  const consumeDidDrag = useCallback(() => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return true;
    }
    return false;
  }, []);

  const resetPosition = useCallback(() => {
    setPosition(null);
    didDragRef.current = false;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage error
    }
  }, [storageKey]);

  const isRightHalf = position ? position.x > viewportSize.w * 0.48 : false;
  const isBottomHalf = position ? position.y > viewportSize.h * 0.45 : true;

  return {
    containerRef,
    position,
    isDragging,
    isCustomPositioned: position !== null,
    isRightHalf,
    isBottomHalf,
    handleDragStart,
    consumeDidDrag,
    resetPosition
  };
}
