import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface ThreeFloorDragOptions {
  domElement: HTMLElement;
  camera: THREE.Camera;
  controls: OrbitControls;
  scene: THREE.Scene;
  modelGroup: THREE.Object3D;
  apparatusGroup?: THREE.Object3D | null;
  floorY: number;
  maxRadius: number;
  accentColor?: number;
  onPartClick?: (hitObject: THREE.Object3D) => void;
  onApparatusMoved?: (uid: string, localX: number, localZ: number) => void;
  onDragStatusChange?: (status: { dragging: boolean; label: string | null; moved: boolean }) => void;
}

export interface ThreeFloorDragHandle {
  resetPosition: () => void;
  dispose: () => void;
}

/**
 * Enables direct mouse/touch drag-and-drop of 3D simulation models and placed 3D bench instruments
 * along the XZ workbench plane, automatically pausing OrbitControls during active drags.
 */
export function attachThreeFloorDrag(opts: ThreeFloorDragOptions): ThreeFloorDragHandle {
  const {
    domElement,
    camera,
    controls,
    scene,
    modelGroup,
    apparatusGroup,
    floorY,
    maxRadius,
    accentColor = 0x38bdf8,
    onPartClick,
    onApparatusMoved,
    onDragStatusChange
  } = opts;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -floorY);
  const hitPoint = new THREE.Vector3();
  const dragOffset = new THREE.Vector3();
  const homePos = modelGroup.position.clone();

  // Sleek floor alignment reticle visible while dragging on the 3D bench
  const reticleGroup = new THREE.Group();
  reticleGroup.visible = false;
  const ringGeo = new THREE.RingGeometry(0.95, 1.12, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: accentColor,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.78,
    depthWrite: false
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  reticleGroup.add(ringMesh);

  const innerGeo = new THREE.RingGeometry(0.18, 0.24, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  innerMesh.rotation.x = -Math.PI / 2;
  reticleGroup.add(innerMesh);
  reticleGroup.position.set(0, floorY + 0.018, 0);
  scene.add(reticleGroup);

  let activeTarget: THREE.Object3D | null = null;
  let activeApparatusUid: string | null = null;
  let activeLabel: string | null = null;
  let activePointerId: number | null = null;
  let downX = 0;
  let downY = 0;
  let didDragMove = false;
  let prevControlsEnabled = controls.enabled;

  const updatePointerNdc = (clientX: number, clientY: number) => {
    const rect = domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    return true;
  };

  const findApparatusRoot = (obj: THREE.Object3D): { root: THREE.Object3D; uid: string } | null => {
    if (!apparatusGroup) return null;
    let cur: THREE.Object3D | null = obj;
    while (cur && cur.parent && cur.parent !== apparatusGroup) {
      cur = cur.parent;
    }
    if (cur && cur.parent === apparatusGroup) {
      return { root: cur, uid: (cur.userData?.apparatusUid as string) || '' };
    }
    return null;
  };

  const pickTarget = (
    clientX: number,
    clientY: number
  ): { target: THREE.Object3D; hitObj: THREE.Object3D; apparatusUid: string | null; label: string } | null => {
    if (!updatePointerNdc(clientX, clientY)) return null;
    raycaster.setFromCamera(pointer, camera);

    if (apparatusGroup && apparatusGroup.children.length > 0) {
      const appHits = raycaster.intersectObjects(apparatusGroup.children, true);
      if (appHits.length > 0) {
        const found = findApparatusRoot(appHits[0].object);
        if (found) {
          return {
            target: found.root,
            hitObj: appHits[0].object,
            apparatusUid: found.uid,
            label: (found.root.userData?.partLabel as string) || 'Dụng cụ đo 3D'
          };
        }
      }
    }

    const modelHits = raycaster.intersectObjects(modelGroup.children, true);
    if (modelHits.length > 0) {
      let cur: THREE.Object3D | null = modelHits[0].object;
      let label = '';
      while (cur && !label) {
        if (cur.userData?.partLabel) label = String(cur.userData.partLabel);
        cur = cur.parent;
      }
      return {
        target: modelGroup,
        hitObj: modelHits[0].object,
        apparatusUid: null,
        label: label || 'Mô hình thí nghiệm 3D'
      };
    }

    return null;
  };

  const onPointerDown = (ev: PointerEvent) => {
    if (ev.button !== 0 && ev.pointerType === 'mouse') return;
    if (ev.shiftKey || ev.altKey) return;

    const picked = pickTarget(ev.clientX, ev.clientY);
    if (!picked) return;

    if (!raycaster.ray.intersectPlane(dragPlane, hitPoint)) return;

    activeTarget = picked.target;
    activeApparatusUid = picked.apparatusUid;
    activeLabel = picked.label;
    activePointerId = ev.pointerId;
    downX = ev.clientX;
    downY = ev.clientY;
    didDragMove = false;

    const isWorldChild = activeTarget.parent === apparatusGroup;
    const basePos = activeTarget.position;
    const parentOffsetX = isWorldChild && apparatusGroup ? apparatusGroup.position.x : 0;
    const parentOffsetZ = isWorldChild && apparatusGroup ? apparatusGroup.position.z : 0;
    dragOffset.set(basePos.x + parentOffsetX - hitPoint.x, 0, basePos.z + parentOffsetZ - hitPoint.z);

    prevControlsEnabled = controls.enabled;
    controls.enabled = false;
    domElement.style.cursor = 'grabbing';
    reticleGroup.visible = true;
    reticleGroup.position.set(basePos.x + parentOffsetX, floorY + 0.018, basePos.z + parentOffsetZ);
    onDragStatusChange?.({ dragging: true, label: activeLabel, moved: modelGroup.position.distanceTo(homePos) > 0.02 });

    try {
      domElement.setPointerCapture(ev.pointerId);
    } catch {
      // ignore synthetic events
    }

    if (onPartClick && Math.hypot(ev.clientX - downX, ev.clientY - downY) === 0) {
      // Delay click callback until pointerup if user didn't drag
      activeTarget.userData.__pendingHitObj = picked.hitObj;
    }
  };

  const onPointerMove = (ev: PointerEvent) => {
    if (!activeTarget || activePointerId !== ev.pointerId) {
      // Passive hover cursor feedback
      if (ev.buttons === 0) {
        const hovered = pickTarget(ev.clientX, ev.clientY);
        domElement.style.cursor = hovered ? 'grab' : '';
      }
      return;
    }

    if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 4) {
      didDragMove = true;
    }

    if (!updatePointerNdc(ev.clientX, ev.clientY)) return;
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(dragPlane, hitPoint)) return;

    const isWorldChild = activeTarget.parent === apparatusGroup;
    const parentOffsetX = isWorldChild && apparatusGroup ? apparatusGroup.position.x : 0;
    const parentOffsetZ = isWorldChild && apparatusGroup ? apparatusGroup.position.z : 0;

    let nx = hitPoint.x + dragOffset.x - parentOffsetX;
    let nz = hitPoint.z + dragOffset.z - parentOffsetZ;

    const dist = Math.hypot(nx, nz);
    if (dist > maxRadius) {
      const k = maxRadius / dist;
      nx *= k;
      nz *= k;
    }

    activeTarget.position.x = nx;
    activeTarget.position.z = nz;
    reticleGroup.position.set(nx + parentOffsetX, floorY + 0.018, nz + parentOffsetZ);

    if (activeApparatusUid && onApparatusMoved) {
      onApparatusMoved(activeApparatusUid, nx, nz);
    }
  };

  const endDrag = (ev: PointerEvent) => {
    if (!activeTarget || activePointerId !== ev.pointerId) return;
    const hitObj = activeTarget.userData?.__pendingHitObj as THREE.Object3D | undefined;
    delete activeTarget.userData.__pendingHitObj;

    if (!didDragMove && hitObj && onPartClick) {
      onPartClick(hitObj);
    }

    activeTarget = null;
    activeApparatusUid = null;
    activePointerId = null;
    controls.enabled = prevControlsEnabled;
    reticleGroup.visible = false;
    domElement.style.cursor = 'grab';

    const moved = modelGroup.position.distanceTo(homePos) > 0.04;
    onDragStatusChange?.({ dragging: false, label: null, moved });

    try {
      if (domElement.hasPointerCapture(ev.pointerId)) {
        domElement.releasePointerCapture(ev.pointerId);
      }
    } catch {
      // ignore
    }
  };

  const resetPosition = () => {
    modelGroup.position.copy(homePos);
    onDragStatusChange?.({ dragging: false, label: null, moved: false });
  };

  const onDblClick = () => {
    resetPosition();
  };

  domElement.addEventListener('pointerdown', onPointerDown, true);
  domElement.addEventListener('pointermove', onPointerMove);
  domElement.addEventListener('pointerup', endDrag);
  domElement.addEventListener('pointercancel', endDrag);
  domElement.addEventListener('dblclick', onDblClick);

  return {
    resetPosition,
    dispose: () => {
      domElement.removeEventListener('pointerdown', onPointerDown, true);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', endDrag);
      domElement.removeEventListener('pointercancel', endDrag);
      domElement.removeEventListener('dblclick', onDblClick);
      domElement.style.cursor = '';
      scene.remove(reticleGroup);
      ringGeo.dispose();
      ringMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    }
  };
}
