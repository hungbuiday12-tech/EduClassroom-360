import * as THREE from 'three';

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export interface FocusOptions {
  /** Vertical field of view in degrees (e.g. 42) */
  fovDeg: number;
  /** Viewport aspect ratio width / height */
  aspect: number;
  /** Framing padding multiplier (> 1 leaves clean margin around bounding sphere) */
  padding?: number;
  /** Minimum allowed camera distance from part center */
  minDistance?: number;
  /** Maximum allowed camera distance from part center */
  maxDistance?: number;
  /** Current camera position to preserve viewing direction while focusing */
  currentCameraPos?: THREE.Vector3;
  /** Current OrbitControls target */
  currentTarget?: THREE.Vector3;
  /** Optional fallback direction when current camera is coincident with center */
  preferredDirection?: THREE.Vector3;
}

/**
 * Pure calculation of optimal camera position and target for a world-space Box3.
 * Never defaults to scene origin (0,0,0) — always centers on the exact bounding box center
 * of the selected mesh/group and scales distance to fit its bounding sphere cleanly.
 */
export function computeFocusPoseFromBox3(
  box: THREE.Box3,
  options: FocusOptions
): CameraPose {
  const {
    fovDeg,
    aspect,
    padding = 1.48,
    minDistance = 0.65,
    maxDistance = 14.0,
    currentCameraPos,
    currentTarget,
    preferredDirection
  } = options;

  if (box.isEmpty()) {
    const fallbackTarget = currentTarget ? currentTarget.clone() : new THREE.Vector3(0, 0, 0);
    const fallbackPos = currentCameraPos ? currentCameraPos.clone() : new THREE.Vector3(3.2, 1.8, 4.8);
    return { position: fallbackPos, target: fallbackTarget };
  }

  const center = new THREE.Vector3();
  const sphere = new THREE.Sphere();
  box.getCenter(center);
  box.getBoundingSphere(sphere);

  const safeRadius = Math.max(0.14, sphere.radius);
  const vFovRad = THREE.MathUtils.degToRad(Math.max(15, Math.min(110, fovDeg)));
  const safeAspect = Math.max(0.35, aspect || 1.33);
  const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * safeAspect);
  const limitingHalfFov = Math.min(vFovRad, hFovRad) * 0.5;

  const rawDist = (safeRadius * padding) / Math.max(0.12, Math.sin(limitingHalfFov));
  const dist = THREE.MathUtils.clamp(rawDist, minDistance, maxDistance);

  const dir = new THREE.Vector3();
  if (currentCameraPos && currentTarget) {
    dir.subVectors(currentCameraPos, currentTarget);
  } else if (currentCameraPos) {
    dir.subVectors(currentCameraPos, center);
  } else if (preferredDirection) {
    dir.copy(preferredDirection);
  }

  if (dir.lengthSq() < 1e-6) {
    dir.set(0.45, 0.28, 0.85);
  }
  dir.normalize();

  // Keep slight elevation if camera was nearly top/bottom flat so anatomical depth reads well
  if (Math.abs(dir.y) > 0.985) {
    dir.set(0.25, Math.sign(dir.y) * 0.85, 0.46).normalize();
  }

  const position = center.clone().addScaledVector(dir, dist);
  return {
    position,
    target: center
  };
}

/**
 * Computes exact world-space Box3 for an Object3D (mesh or organ group),
 * updating world matrices before measurement so dynamic/exploded parts frame accurately.
 */
export function resolveObjectWorldBox3(obj: THREE.Object3D): THREE.Box3 {
  obj.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  const meshBox = new THREE.Box3();

  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    if (!mesh.visible) return;
    if (!mesh.geometry.boundingBox) {
      mesh.geometry.computeBoundingBox();
    }
    if (mesh.geometry.boundingBox) {
      meshBox.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
      box.union(meshBox);
    }
  });

  if (box.isEmpty()) {
    box.setFromObject(obj);
  }
  return box;
}

/**
 * Finds the best Object3D matching a part id or label inside a root group and computes its world Box3.
 */
export function resolveFocusBoxForPart(
  root: THREE.Object3D,
  partIdOrLabel: string
): { object: THREE.Object3D; box: THREE.Box3 } | null {
  if (!partIdOrLabel) return null;

  const anchorMatches: THREE.Object3D[] = [];
  const exactMatches: THREE.Object3D[] = [];
  root.traverse((child) => {
    const ud = child.userData || {};
    if (ud.focusAnchorFor === partIdOrLabel) {
      anchorMatches.push(child);
    }
    if (
      ud.organId === partIdOrLabel ||
      ud.partId === partIdOrLabel ||
      ud.partLabel === partIdOrLabel
    ) {
      exactMatches.push(child);
    }
  });

  if (anchorMatches.length > 0) {
    const combinedAnchor = new THREE.Box3();
    for (const obj of anchorMatches) {
      const b = resolveObjectWorldBox3(obj);
      if (!b.isEmpty()) combinedAnchor.union(b);
    }
    if (!combinedAnchor.isEmpty()) {
      return { object: anchorMatches[0], box: combinedAnchor };
    }
  }

  if (exactMatches.length === 0) return null;

  // Prefer a parent group matching the ID if present, otherwise combine all matching meshes
  const groupMatch = exactMatches.find((o) => !(o as THREE.Mesh).isMesh && o.children.length > 0);
  if (groupMatch) {
    const box = resolveObjectWorldBox3(groupMatch);
    if (!box.isEmpty()) return { object: groupMatch, box };
  }

  const combined = new THREE.Box3();
  for (const obj of exactMatches) {
    const b = resolveObjectWorldBox3(obj);
    if (!b.isEmpty()) combined.union(b);
  }
  if (combined.isEmpty()) return null;
  return { object: exactMatches[0], box: combined };
}

/**
 * Computes damped frame-rate-independent camera step toward a target pose.
 * Returns true when transition has settled within epsilon.
 */
export function stepSmoothCameraTransition(
  camera: THREE.PerspectiveCamera,
  controlsTarget: THREE.Vector3,
  desired: CameraPose,
  dt: number,
  lambda = 7.5
): boolean {
  const factor = 1 - Math.exp(-lambda * Math.min(0.18, Math.max(0.001, dt)));
  camera.position.lerp(desired.position, factor);
  controlsTarget.lerp(desired.target, factor);

  const posDone = camera.position.distanceTo(desired.position) < 0.025;
  const targetDone = controlsTarget.distanceTo(desired.target) < 0.015;
  if (posDone && targetDone) {
    camera.position.copy(desired.position);
    controlsTarget.copy(desired.target);
    return true;
  }
  return false;
}

export interface PartVisibilityInput {
  allPartIds: string[];
  hiddenPartIds: ReadonlySet<string>;
  isolatedPartId: string | null;
}

export interface PartVisibilityDecision {
  visible: boolean;
  dimmed: boolean;
  opacityScale: number;
}

/**
 * Pure visibility/isolation resolver for Hide/Show and Isolate Selected Part controls.
 */
export function resolvePartVisibilityState(
  partId: string,
  input: PartVisibilityInput
): PartVisibilityDecision {
  if (input.hiddenPartIds.has(partId)) {
    return { visible: false, dimmed: false, opacityScale: 0 };
  }
  if (input.isolatedPartId && input.isolatedPartId !== partId) {
    return { visible: true, dimmed: true, opacityScale: 0.12 };
  }
  return { visible: true, dimmed: false, opacityScale: 1 };
}

/**
 * Computes zoomed camera position along the camera-to-target vector without drifting target.
 */
export function computeZoomStepPose(
  cameraPos: THREE.Vector3,
  target: THREE.Vector3,
  zoomFactor: number,
  minDistance = 1.1,
  maxDistance = 16.0
): THREE.Vector3 {
  const offset = new THREE.Vector3().subVectors(cameraPos, target);
  const currentDist = Math.max(0.05, offset.length());
  const nextDist = THREE.MathUtils.clamp(currentDist * zoomFactor, minDistance, maxDistance);
  offset.normalize().multiplyScalar(nextDist);
  return target.clone().add(offset);
}
