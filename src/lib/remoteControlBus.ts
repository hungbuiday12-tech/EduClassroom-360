import * as THREE from 'three';

export type RemoteControlCommand =
  | {
      type: 'orbit';
      yawDelta: number;
      pitchDelta: number;
      zoomDelta: number;
    }
  | {
      type: 'explode_set';
      value: number; // 0..1
    }
  | {
      type: 'explode_toggle';
    }
  | {
      type: 'reset_view';
    }
  | {
      type: 'toggle_play';
    }
  | {
      type: 'slide_prev';
    }
  | {
      type: 'slide_next';
    }
  | {
      type: 'laser';
      x: number; // 0..1
      y: number; // 0..1
      active: boolean;
    }
  | {
      type: 'navigate';
      subject: string;
    };

export const REMOTE_CONTROL_EVENT = 'synapse:remote-control';

export function dispatchRemoteCommand(command: RemoteControlCommand): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<RemoteControlCommand>(REMOTE_CONTROL_EVENT, { detail: command }));
}

export function subscribeRemoteCommand(
  handler: (cmd: RemoteControlCommand) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (ev: Event) => {
    const custom = ev as CustomEvent<RemoteControlCommand>;
    if (custom?.detail) {
      handler(custom.detail);
    }
  };
  window.addEventListener(REMOTE_CONTROL_EVENT, listener);
  return () => window.removeEventListener(REMOTE_CONTROL_EVENT, listener);
}

/**
 * Reusable spherical OrbitControls helper so remote phone drag / gyroscope
 * smoothly orbits any Three.js perspective camera without gimbal lock.
 */
export function applySphericalOrbitDelta(
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  yawDelta: number,
  pitchDelta: number,
  zoomDelta = 0,
  minDistance = 2,
  maxDistance = 40
): void {
  const offset = camera.position.clone().sub(target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta -= yawDelta;
  spherical.phi = Math.max(0.14, Math.min(Math.PI - 0.14, spherical.phi - pitchDelta));
  if (zoomDelta !== 0) {
    spherical.radius = Math.max(
      minDistance,
      Math.min(maxDistance, spherical.radius * (1 + zoomDelta))
    );
  }
  offset.setFromSpherical(spherical);
  camera.position.copy(target).add(offset);
  camera.lookAt(target);
}
