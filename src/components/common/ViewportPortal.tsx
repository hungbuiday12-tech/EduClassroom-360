import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ViewportPortalProps {
  active: boolean;
  children: React.ReactNode;
  lockScroll?: boolean;
}

/**
 * Renders fullscreen workspaces and modals directly inside document.body when active,
 * bypassing ancestor CSS transforms, backdrop-filter, z-index stacking contexts, or overflow clipping.
 */
export const ViewportPortal: React.FC<ViewportPortalProps> = ({
  active,
  children,
  lockScroll = true
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active || !lockScroll || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [active, lockScroll]);

  if (!active || !mounted || typeof document === 'undefined') {
    return <>{children}</>;
  }

  return createPortal(children, document.body);
};
