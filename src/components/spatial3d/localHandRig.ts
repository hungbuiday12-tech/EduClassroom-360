import * as THREE from 'three';
import { HAND_SKELETON_CONNECTIONS, type HandSkeletonData } from './handGestureTracker';

export type LocalGripVisualState = 'idle' | 'hover_part' | 'grab_part' | 'hold_model' | 'two_hand_zoom';

// Landmark partitions (21 joints total = 16 palm/knuckle joints + 5 fingertips)
const PALM_JOINT_INDICES: readonly number[] = [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19];
const TIP_INDICES: readonly number[] = [4, 8, 12, 16, 20];

// Module-scope pre-allocated scratch math (zero GC allocations inside render loop)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vMid = new THREE.Vector3();
const _vDir = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _identQuat = new THREE.Quaternion();
const _scaleVec = new THREE.Vector3(1, 1, 1);
const _wristScaleVec = new THREE.Vector3(1.32, 1.32, 1.32);
const _zeroScaleVec = new THREE.Vector3(0, 0, 0);
const _mat4 = new THREE.Matrix4();
const _camRight = new THREE.Vector3();
const _camUp = new THREE.Vector3();
const _camFwd = new THREE.Vector3();
const _pinchMid = new THREE.Vector3();
const _biasOffset = new THREE.Vector3();
const _handAnchor = new THREE.Vector3();

function mapNormalizedToWorld(nx: number, ny: number, nz: number, out: THREE.Vector3): THREE.Vector3 {
  const x = (nx - 0.5) * 6.4;
  const y = THREE.MathUtils.clamp((1 - ny) * 3.85 + 0.15, 0.2, 4.15);
  const z = Math.sin((nx - 0.5) * Math.PI) * 1.35 - nz * 2.1 + 0.75;
  return out.set(x, y, z);
}

// Anatomical local finger offsets around index/pinch grip target (index tip = origin when open/pinch, palm = origin when fist)
const POINTER_HAND_OFFSETS: readonly [number, number, number][] = [
  [0.02, -0.44, 0.28], // 0 wrist
  [-0.14, -0.35, 0.2], // 1 thumb cmc
  [-0.22, -0.25, 0.14], // 2 thumb mcp
  [-0.24, -0.15, 0.08], // 3 thumb ip
  [-0.19, -0.07, 0.02], // 4 thumb tip
  [-0.05, -0.21, 0.11], // 5 index mcp
  [-0.03, -0.12, 0.05], // 6 index pip
  [-0.01, -0.05, 0.01], // 7 index dip
  [0.0, 0.0, 0.0], // 8 index tip
  [0.05, -0.21, 0.12], // 9 middle mcp
  [0.07, -0.11, 0.06], // 10 middle pip
  [0.08, -0.04, 0.02], // 11 middle dip
  [0.09, 0.03, -0.01], // 12 middle tip
  [0.14, -0.23, 0.15], // 13 ring mcp
  [0.16, -0.14, 0.09], // 14 ring pip
  [0.17, -0.07, 0.05], // 15 ring dip
  [0.18, -0.01, 0.02], // 16 ring tip
  [0.23, -0.26, 0.19], // 17 pinky mcp
  [0.25, -0.19, 0.14], // 18 pinky pip
  [0.26, -0.13, 0.1], // 19 pinky dip
  [0.27, -0.08, 0.07] // 20 pinky tip
];

interface LocalSingleHand {
  group: THREE.Group;
  palmJointsInst: THREE.InstancedMesh;
  tipsInst: THREE.InstancedMesh;
  bonesInst: THREE.InstancedMesh;
  currentPoints: THREE.Vector3[];
  targetPoints: THREE.Vector3[];
  initialized: boolean;
}

export class LocalHandRigManager {
  public readonly container = new THREE.Group();
  private readonly sphereGeo = new THREE.SphereGeometry(0.044, 10, 10);
  private readonly tipGeo = new THREE.SphereGeometry(0.058, 12, 12);
  private readonly boneGeo = new THREE.CylinderGeometry(0.019, 0.019, 1, 8);
  private readonly gripRingGeo = new THREE.TorusGeometry(0.16, 0.018, 10, 28);

  private readonly jointMat: THREE.MeshStandardMaterial;
  private readonly tipMat: THREE.MeshStandardMaterial;
  private readonly boneMat: THREE.MeshStandardMaterial;
  private readonly gripRingMat: THREE.MeshBasicMaterial;
  private readonly spanMat: THREE.LineBasicMaterial;

  private readonly hands: [LocalSingleHand, LocalSingleHand];
  private readonly gripRingMesh: THREE.Mesh;
  private readonly spanGeo: THREE.BufferGeometry;
  private readonly spanLine: THREE.Line;

  private disposed = false;

  constructor() {
    this.jointMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.45
    });
    this.tipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.95,
      roughness: 0.15,
      metalness: 0.35
    });
    this.boneMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.32,
      transparent: true,
      opacity: 0.85,
      roughness: 0.28,
      metalness: 0.5
    });
    this.gripRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.88,
      depthTest: false
    });
    this.spanMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    });

    this.hands = [this.createSingleHand(), this.createSingleHand()];
    this.container.add(this.hands[0].group, this.hands[1].group);

    this.gripRingMesh = new THREE.Mesh(this.gripRingGeo, this.gripRingMat);
    this.gripRingMesh.renderOrder = 26;
    this.gripRingMesh.visible = false;
    this.container.add(this.gripRingMesh);

    this.spanGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1, 1.5, 0),
      new THREE.Vector3(1, 1.5, 0)
    ]);
    this.spanLine = new THREE.Line(this.spanGeo, this.spanMat);
    this.spanLine.renderOrder = 26;
    this.spanLine.visible = false;
    this.container.add(this.spanLine);
  }

  private createSingleHand(): LocalSingleHand {
    const group = new THREE.Group();
    group.visible = false;

    const palmJointsInst = new THREE.InstancedMesh(
      this.sphereGeo,
      this.jointMat,
      PALM_JOINT_INDICES.length
    );
    palmJointsInst.frustumCulled = false;

    const tipsInst = new THREE.InstancedMesh(
      this.tipGeo,
      this.tipMat,
      TIP_INDICES.length
    );
    tipsInst.frustumCulled = false;

    const bonesInst = new THREE.InstancedMesh(
      this.boneGeo,
      this.boneMat,
      HAND_SKELETON_CONNECTIONS.length
    );
    bonesInst.frustumCulled = false;

    group.add(palmJointsInst, tipsInst, bonesInst);

    const targetPoints: THREE.Vector3[] = [];
    const currentPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 21; i++) {
      targetPoints.push(new THREE.Vector3(0, 1.5, 0.8));
      currentPoints.push(new THREE.Vector3(0, 1.5, 0.8));
    }

    return {
      group,
      palmJointsInst,
      tipsInst,
      bonesInst,
      currentPoints,
      targetPoints,
      initialized: false
    };
  }

  private applyPaletteByState(state: LocalGripVisualState): void {
    let hex = 0x22d3ee;
    if (state === 'hover_part') hex = 0xfacc15;
    else if (state === 'grab_part') hex = 0xf59e0b;
    else if (state === 'hold_model' || state === 'two_hand_zoom') hex = 0x34d399;

    this.jointMat.color.setHex(hex);
    this.jointMat.emissive.setHex(hex);
    this.tipMat.emissive.setHex(hex);
    this.boneMat.color.setHex(hex);
    this.boneMat.emissive.setHex(hex);
    this.gripRingMat.color.setHex(hex);
  }

  private syncBonesForHand(hand: LocalSingleHand, dt: number): void {
    const alpha = 1 - Math.exp(-26 * dt);
    for (let i = 0; i < 21; i++) {
      if (!hand.initialized) {
        hand.currentPoints[i].copy(hand.targetPoints[i]);
      } else {
        hand.currentPoints[i].lerp(hand.targetPoints[i], alpha);
      }
    }
    hand.initialized = true;

    for (let j = 0; j < PALM_JOINT_INDICES.length; j++) {
      const lmIdx = PALM_JOINT_INDICES[j];
      _mat4.compose(
        hand.currentPoints[lmIdx],
        _identQuat,
        lmIdx === 0 ? _wristScaleVec : _scaleVec
      );
      hand.palmJointsInst.setMatrixAt(j, _mat4);
    }
    hand.palmJointsInst.instanceMatrix.needsUpdate = true;

    for (let t = 0; t < TIP_INDICES.length; t++) {
      const lmIdx = TIP_INDICES[t];
      _mat4.compose(hand.currentPoints[lmIdx], _identQuat, _scaleVec);
      hand.tipsInst.setMatrixAt(t, _mat4);
    }
    hand.tipsInst.instanceMatrix.needsUpdate = true;

    for (let b = 0; b < HAND_SKELETON_CONNECTIONS.length; b++) {
      const [ia, ib] = HAND_SKELETON_CONNECTIONS[b];
      _vA.copy(hand.currentPoints[ia]);
      _vB.copy(hand.currentPoints[ib]);
      _vMid.addVectors(_vA, _vB).multiplyScalar(0.5);
      _vDir.subVectors(_vB, _vA);
      const len = _vDir.length();
      if (len > 0.001) {
        _vDir.divideScalar(len);
        _quat.setFromUnitVectors(_upAxis, _vDir);
        _scaleVec.set(1, len, 1);
        _mat4.compose(_vMid, _quat, _scaleVec);
      } else {
        _mat4.compose(_vMid, _identQuat, _zeroScaleVec);
      }
      hand.bonesInst.setMatrixAt(b, _mat4);
    }
    _scaleVec.set(1, 1, 1);
    hand.bonesInst.instanceMatrix.needsUpdate = true;
  }

  public hideAll(): void {
    this.hands[0].group.visible = false;
    this.hands[1].group.visible = false;
    this.gripRingMesh.visible = false;
    this.spanLine.visible = false;
  }

  public updateFromCameraSkeletons(
    skeletons: HandSkeletonData[],
    gripState: LocalGripVisualState,
    camera: THREE.Camera,
    dt: number,
    grabAnchorWorld?: THREE.Vector3 | null
  ): void {
    if (this.disposed) return;
    if (!skeletons || skeletons.length === 0) {
      this.hideAll();
      return;
    }

    this.applyPaletteByState(gripState);
    let h0Visible = false;
    let h1Visible = false;

    for (let sIdx = 0; sIdx < Math.min(2, skeletons.length); sIdx++) {
      const sk = skeletons[sIdx];
      if (!sk.landmarks || sk.landmarks.length < 21) continue;
      const slot = sk.handIndex === 1 ? 1 : 0;
      const hand = this.hands[slot];
      hand.group.visible = true;
      if (slot === 0) h0Visible = true;
      else h1Visible = true;

      for (let i = 0; i < 21; i++) {
        const pt = sk.landmarks[i];
        mapNormalizedToWorld(pt[0], pt[1], pt[2], hand.targetPoints[i]);
      }

      // Pull primary virtual hand onto grabbed anchor so fingers physically clasp the detached part or held model
      if (slot === 0 && grabAnchorWorld && (gripState === 'grab_part' || gripState === 'hold_model')) {
        if (gripState === 'grab_part') {
          _pinchMid.addVectors(hand.targetPoints[4], hand.targetPoints[8]).multiplyScalar(0.5);
        } else {
          _pinchMid.copy(hand.targetPoints[9]);
        }
        _biasOffset.subVectors(grabAnchorWorld, _pinchMid);
        for (let i = 0; i < 21; i++) {
          hand.targetPoints[i].add(_biasOffset);
        }
      }

      this.syncBonesForHand(hand, dt);
    }

    if (!h0Visible) this.hands[0].group.visible = false;
    if (!h1Visible) this.hands[1].group.visible = false;

    if (h0Visible) {
      const h0 = this.hands[0];
      if (gripState === 'hold_model') {
        this.gripRingMesh.position.copy(h0.currentPoints[9]);
        this.gripRingMesh.scale.setScalar(1.38);
      } else {
        _pinchMid.addVectors(h0.currentPoints[4], h0.currentPoints[8]).multiplyScalar(0.5);
        this.gripRingMesh.position.copy(_pinchMid);
        const fingerDist = h0.currentPoints[4].distanceTo(h0.currentPoints[8]);
        this.gripRingMesh.scale.setScalar(THREE.MathUtils.clamp(fingerDist * 1.6, 0.55, 1.35));
      }
      this.gripRingMesh.lookAt(camera.position);
      this.gripRingMesh.visible = true;
    } else {
      this.gripRingMesh.visible = false;
    }

    if (h0Visible && h1Visible) {
      const posAttr = this.spanGeo.attributes.position as THREE.BufferAttribute;
      const p0 = this.hands[0].currentPoints[9];
      const p1 = this.hands[1].currentPoints[9];
      posAttr.setXYZ(0, p0.x, p0.y, p0.z);
      posAttr.setXYZ(1, p1.x, p1.y, p1.z);
      posAttr.needsUpdate = true;
      this.spanLine.visible = true;
    } else {
      this.spanLine.visible = false;
    }
  }

  public updateFromPointer(
    worldAnchorPos: THREE.Vector3 | null,
    camera: THREE.Camera,
    gripState: LocalGripVisualState,
    dt: number
  ): void {
    if (this.disposed) return;
    if (!worldAnchorPos || gripState === 'idle') {
      this.hideAll();
      return;
    }

    this.applyPaletteByState(gripState);
    this.hands[1].group.visible = false;
    this.spanLine.visible = false;

    const hand = this.hands[0];
    hand.group.visible = true;

    _camRight.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    _camUp.set(0, 1, 0).applyQuaternion(camera.quaternion).normalize();
    _camFwd.set(0, 0, 1).applyQuaternion(camera.quaternion).normalize();

    const isPinching = gripState === 'grab_part';
    const isFist = gripState === 'hold_model';

    // Pull palm slightly toward camera so fingers wrap naturally in front of object surface
    _handAnchor.copy(worldAnchorPos).addScaledVector(_camFwd, isFist ? 0.52 : 0.14);

    for (let i = 0; i < 21; i++) {
      const [ox, oy, oz] = POINTER_HAND_OFFSETS[i];
      let lx = ox;
      let ly = oy;
      let lz = oz;

      if (isFist) {
        // Curl all fingers tightly into a fist gripping the object
        if (i >= 1 && i <= 4) {
          lx *= 0.45;
          ly = ly * 0.42 + 0.05;
          lz = lz * 0.32 - 0.14;
        } else if (i >= 5) {
          const curl = i % 4 === 0 ? 0.2 : i % 4 === 3 ? 0.4 : 0.68;
          ly *= curl;
          lz = lz - (1 - curl) * 0.21;
        }
      } else if (isPinching) {
        // Thumb tip #4 & Index tip #8 pinch tight at anchor while remaining fingers tuck gently
        if (i === 4) {
          lx = -0.016;
          ly = -0.01;
          lz = 0.008;
        } else if (i === 3) {
          lx = -0.085;
          ly = -0.075;
          lz = 0.055;
        } else if (i === 8) {
          lx = 0.016;
          ly = 0.01;
          lz = 0.008;
        } else if (i >= 11 && i % 4 !== 1) {
          ly *= 0.72;
          lz += 0.06;
        }
      }

      hand.targetPoints[i]
        .copy(_handAnchor)
        .addScaledVector(_camRight, lx)
        .addScaledVector(_camUp, ly)
        .addScaledVector(_camFwd, lz);
    }

    this.syncBonesForHand(hand, dt);

    if (isFist) {
      this.gripRingMesh.position.copy(hand.currentPoints[9]);
      this.gripRingMesh.scale.setScalar(1.34);
    } else {
      _pinchMid.addVectors(hand.currentPoints[4], hand.currentPoints[8]).multiplyScalar(0.5);
      this.gripRingMesh.position.copy(_pinchMid);
      this.gripRingMesh.scale.setScalar(isPinching ? 0.58 : 1.05);
    }
    this.gripRingMesh.lookAt(camera.position);
    this.gripRingMesh.visible = true;
  }

  public dispose(): void {
    this.disposed = true;
    this.hideAll();
    this.hands[0].palmJointsInst.dispose();
    this.hands[0].tipsInst.dispose();
    this.hands[0].bonesInst.dispose();
    this.hands[1].palmJointsInst.dispose();
    this.hands[1].tipsInst.dispose();
    this.hands[1].bonesInst.dispose();
    this.sphereGeo.dispose();
    this.tipGeo.dispose();
    this.boneGeo.dispose();
    this.gripRingGeo.dispose();
    this.spanGeo.dispose();
    this.jointMat.dispose();
    this.tipMat.dispose();
    this.boneMat.dispose();
    this.gripRingMat.dispose();
    this.spanMat.dispose();
  }
}

interface TetherSlot {
  line: THREE.Line;
  geo: THREE.BufferGeometry;
  socketRing: THREE.Mesh;
}

export class SocketTetherManager {
  public readonly container = new THREE.Group();
  private readonly lineMat: THREE.LineDashedMaterial;
  private readonly snapLineMat: THREE.LineDashedMaterial;
  private readonly ringGeo = new THREE.RingGeometry(0.075, 0.125, 24);
  private readonly ringMat: THREE.MeshBasicMaterial;
  private readonly snapRingMat: THREE.MeshBasicMaterial;
  private readonly slots: TetherSlot[] = [];

  constructor(maxSlots = 16) {
    this.lineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.14,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.78,
      depthTest: false
    });
    this.snapLineMat = new THREE.LineDashedMaterial({
      color: 0x34d399,
      dashSize: 0.14,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    });
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthTest: false
    });
    this.snapRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98,
      depthTest: false
    });

    for (let i = 0; i < maxSlots; i++) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(),
        new THREE.Vector3(0, 0.2, 0)
      ]);
      const line = new THREE.Line(geo, this.lineMat);
      line.renderOrder = 22;
      line.visible = false;

      const socketRing = new THREE.Mesh(this.ringGeo, this.ringMat);
      socketRing.renderOrder = 22;
      socketRing.visible = false;

      this.container.add(line, socketRing);
      this.slots.push({ line, geo, socketRing });
    }
  }

  public setSlot(
    idx: number,
    socketWorld: THREE.Vector3,
    partWorld: THREE.Vector3,
    camera: THREE.Camera,
    isNearSnap = false
  ): void {
    const slot = this.slots[idx];
    if (!slot) return;
    const pos = slot.geo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, socketWorld.x, socketWorld.y, socketWorld.z);
    pos.setXYZ(1, partWorld.x, partWorld.y, partWorld.z);
    pos.needsUpdate = true;
    slot.line.computeLineDistances();
    slot.line.material = isNearSnap ? this.snapLineMat : this.lineMat;
    slot.line.visible = true;

    slot.socketRing.position.copy(socketWorld);
    slot.socketRing.lookAt(camera.position);
    slot.socketRing.scale.setScalar(isNearSnap ? 1.35 : 1.0);
    slot.socketRing.material = isNearSnap ? this.snapRingMat : this.ringMat;
    slot.socketRing.visible = true;
  }

  public hideFrom(startIdx: number): void {
    for (let i = startIdx; i < this.slots.length; i++) {
      this.slots[i].line.visible = false;
      this.slots[i].socketRing.visible = false;
    }
  }

  public dispose(): void {
    for (const s of this.slots) {
      s.geo.dispose();
    }
    this.ringGeo.dispose();
    this.lineMat.dispose();
    this.snapLineMat.dispose();
    this.ringMat.dispose();
    this.snapRingMat.dispose();
  }
}

let sharedAudioCtx: AudioContext | null = null;

export function playSpatialSfx(kind: 'grab' | 'detach' | 'snap' | 'hold', enabled = true): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtor();
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume();
    }
    const ctx = sharedAudioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (kind === 'grab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.045);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (kind === 'detach') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.065);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.075);
    } else if (kind === 'snap') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(640, now + 0.025);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.06);
      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch {
    // Ignore autoplay/WebAudio restrictions
  }
}
