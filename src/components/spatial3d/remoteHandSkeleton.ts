import * as THREE from 'three';
import { HAND_SKELETON_CONNECTIONS } from './handGestureTracker';
import type { CoopHandSkeleton, CoopPeerHandPose } from './coopTypes';

// Pre-allocated scratch math objects (zero allocations inside tick loop)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _vMid = new THREE.Vector3();
const _vDir = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _rayStart = new THREE.Vector3();
const _rayEnd = new THREE.Vector3();

function mapNormalizedToWorld(nx: number, ny: number, nz: number, out: THREE.Vector3): THREE.Vector3 {
  const x = (nx - 0.5) * 6.4;
  const y = THREE.MathUtils.clamp((1 - ny) * 3.85 + 0.15, 0.2, 4.15);
  const z = Math.sin((nx - 0.5) * Math.PI) * 1.35 - nz * 2.1 + 0.75;
  return out.set(x, y, z);
}

function createPeerLabelSprite(name: string, colorHex: string): {
  sprite: THREE.Sprite;
  texture: THREE.CanvasTexture;
  material: THREE.SpriteMaterial;
  canvas: HTMLCanvasElement;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(4, 10, 24, 0.88)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(6, 8, 244, 48, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(28, 32, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 21px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    const label = name.length > 15 ? `${name.slice(0, 14)}…` : name;
    ctx.fillText(label, 46, 33);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.15, 0.29, 1);
  sprite.renderOrder = 30;
  return { sprite, texture, material, canvas };
}

interface SingleHandRig {
  group: THREE.Group;
  joints: THREE.Mesh[];
  bones: THREE.Mesh[];
  laserLine: THREE.Line;
  laserGeo: THREE.BufferGeometry;
  targetPoints: THREE.Vector3[];
  currentPoints: THREE.Vector3[];
  initialized: boolean;
  lastActiveAt: number;
}

interface PeerRig {
  peerId: string;
  name: string;
  colorHex: string;
  root: THREE.Group;
  jointMat: THREE.MeshStandardMaterial;
  tipMat: THREE.MeshStandardMaterial;
  boneMat: THREE.MeshStandardMaterial;
  laserMat: THREE.LineBasicMaterial;
  hands: [SingleHandRig, SingleHandRig];
  labelSprite: THREE.Sprite;
  labelTexture: THREE.CanvasTexture;
  labelMaterial: THREE.SpriteMaterial;
  lastSeenAt: number;
}

export class RemoteHandRigManager {
  public readonly container = new THREE.Group();
  private readonly sphereGeo = new THREE.SphereGeometry(0.052, 12, 12);
  private readonly tipGeo = new THREE.SphereGeometry(0.068, 14, 14);
  private readonly boneGeo = new THREE.CylinderGeometry(0.022, 0.022, 1, 8);
  private readonly rigs = new Map<string, PeerRig>();
  private disposed = false;

  private createSingleHandRig(
    jointMat: THREE.MeshStandardMaterial,
    tipMat: THREE.MeshStandardMaterial,
    boneMat: THREE.MeshStandardMaterial,
    laserMat: THREE.LineBasicMaterial
  ): SingleHandRig {
    const group = new THREE.Group();
    group.visible = false;

    const tipSet = new Set([4, 8, 12, 16, 20]);
    const joints: THREE.Mesh[] = [];
    const targetPoints: THREE.Vector3[] = [];
    const currentPoints: THREE.Vector3[] = [];

    for (let i = 0; i < 21; i++) {
      const isTip = tipSet.has(i);
      const isWrist = i === 0;
      const m = new THREE.Mesh(isTip ? this.tipGeo : this.sphereGeo, isTip ? tipMat : jointMat);
      if (isWrist) m.scale.setScalar(1.35);
      group.add(m);
      joints.push(m);
      targetPoints.push(new THREE.Vector3(0, 1.5, 0.8));
      currentPoints.push(new THREE.Vector3(0, 1.5, 0.8));
    }

    const bones: THREE.Mesh[] = [];
    for (let b = 0; b < HAND_SKELETON_CONNECTIONS.length; b++) {
      const bm = new THREE.Mesh(this.boneGeo, boneMat);
      group.add(bm);
      bones.push(bm);
    }

    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.5, 0.8),
      new THREE.Vector3(0, 1.5, 0)
    ]);
    const laserLine = new THREE.Line(laserGeo, laserMat);
    laserLine.visible = false;
    group.add(laserLine);

    return {
      group,
      joints,
      bones,
      laserLine,
      laserGeo,
      targetPoints,
      currentPoints,
      initialized: false,
      lastActiveAt: 0
    };
  }

  private getOrCreatePeerRig(peerId: string, name: string, colorHex: string): PeerRig {
    const existing = this.rigs.get(peerId);
    if (existing) {
      return existing;
    }

    const colNum = new THREE.Color(colorHex).getHex();
    const root = new THREE.Group();
    const jointMat = new THREE.MeshStandardMaterial({
      color: colNum,
      emissive: colNum,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.4
    });
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: colNum,
      emissiveIntensity: 0.95,
      roughness: 0.15,
      metalness: 0.3
    });
    const boneMat = new THREE.MeshStandardMaterial({
      color: colNum,
      emissive: colNum,
      emissiveIntensity: 0.28,
      transparent: true,
      opacity: 0.88,
      roughness: 0.3,
      metalness: 0.45
    });
    const laserMat = new THREE.LineBasicMaterial({
      color: colNum,
      transparent: true,
      opacity: 0.8
    });

    const hand0 = this.createSingleHandRig(jointMat, tipMat, boneMat, laserMat);
    const hand1 = this.createSingleHandRig(jointMat, tipMat, boneMat, laserMat);
    root.add(hand0.group, hand1.group);

    const badge = createPeerLabelSprite(name, colorHex);
    badge.sprite.visible = false;
    root.add(badge.sprite);

    this.container.add(root);

    const rig: PeerRig = {
      peerId,
      name,
      colorHex,
      root,
      jointMat,
      tipMat,
      boneMat,
      laserMat,
      hands: [hand0, hand1],
      labelSprite: badge.sprite,
      labelTexture: badge.texture,
      labelMaterial: badge.material,
      lastSeenAt: performance.now()
    };
    this.rigs.set(peerId, rig);
    return rig;
  }

  public applyPeerPose(pose: CoopPeerHandPose): void {
    if (this.disposed) return;
    const now = performance.now();
    const rig = this.getOrCreatePeerRig(pose.peerId, pose.name, pose.colorHex);
    rig.lastSeenAt = now;

    const seenHandIndices = new Set<number>();
    for (const sk of pose.skeletons) {
      if (!Array.isArray(sk.landmarks) || sk.landmarks.length < 21) continue;
      const idx = sk.handIndex === 1 ? 1 : 0;
      seenHandIndices.add(idx);
      const handRig = rig.hands[idx];
      handRig.lastActiveAt = now;
      handRig.group.visible = true;

      for (let i = 0; i < 21; i++) {
        const pt = sk.landmarks[i];
        mapNormalizedToWorld(pt[0], pt[1], pt[2], handRig.targetPoints[i]);
        if (!handRig.initialized) {
          handRig.currentPoints[i].copy(handRig.targetPoints[i]);
        }
      }
      handRig.initialized = true;
      handRig.laserLine.visible = sk.gesture === 'point_1';
    }

    for (let h = 0; h < 2; h++) {
      if (!seenHandIndices.has(h)) {
        rig.hands[h].group.visible = false;
        rig.hands[h].laserLine.visible = false;
      }
    }
  }

  public removePeer(peerId: string): void {
    const rig = this.rigs.get(peerId);
    if (!rig) return;
    this.container.remove(rig.root);
    rig.jointMat.dispose();
    rig.tipMat.dispose();
    rig.boneMat.dispose();
    rig.laserMat.dispose();
    rig.labelTexture.dispose();
    rig.labelMaterial.dispose();
    rig.hands[0].laserGeo.dispose();
    rig.hands[1].laserGeo.dispose();
    this.rigs.delete(peerId);
  }

  public syncRoster(activePeerIds: Set<string>): void {
    for (const id of Array.from(this.rigs.keys())) {
      if (!activePeerIds.has(id)) {
        this.removePeer(id);
      }
    }
  }

  public update(dt: number): void {
    if (this.disposed) return;
    const now = performance.now();
    const smoothAlpha = 1 - Math.exp(-22 * dt);

    for (const rig of this.rigs.values()) {
      let anyHandVisible = false;
      let labelAnchorHand: SingleHandRig | null = null;

      for (let h = 0; h < 2; h++) {
        const hand = rig.hands[h];
        if (!hand.group.visible) continue;
        if (now - hand.lastActiveAt > 1800) {
          hand.group.visible = false;
          hand.laserLine.visible = false;
          continue;
        }
        anyHandVisible = true;
        if (!labelAnchorHand) labelAnchorHand = hand;

        for (let i = 0; i < 21; i++) {
          hand.currentPoints[i].lerp(hand.targetPoints[i], smoothAlpha);
          hand.joints[i].position.copy(hand.currentPoints[i]);
        }

        for (let b = 0; b < HAND_SKELETON_CONNECTIONS.length; b++) {
          const [ia, ib] = HAND_SKELETON_CONNECTIONS[b];
          _vA.copy(hand.currentPoints[ia]);
          _vB.copy(hand.currentPoints[ib]);
          _vMid.addVectors(_vA, _vB).multiplyScalar(0.5);
          _vDir.subVectors(_vB, _vA);
          const len = _vDir.length();
          const bone = hand.bones[b];
          if (len > 0.001) {
            bone.visible = true;
            bone.position.copy(_vMid);
            _vDir.divideScalar(len);
            _quat.setFromUnitVectors(_upAxis, _vDir);
            bone.quaternion.copy(_quat);
            bone.scale.set(1, len, 1);
          } else {
            bone.visible = false;
          }
        }

        if (hand.laserLine.visible) {
          _rayStart.copy(hand.currentPoints[8]);
          _vDir.subVectors(hand.currentPoints[8], hand.currentPoints[6]);
          if (_vDir.lengthSq() > 0.0001) {
            _vDir.normalize();
          } else {
            _vDir.set(0, 0, -1);
          }
          _rayEnd.copy(_rayStart).addScaledVector(_vDir, 2.4);
          const posAttr = hand.laserGeo.attributes.position as THREE.BufferAttribute;
          posAttr.setXYZ(0, _rayStart.x, _rayStart.y, _rayStart.z);
          posAttr.setXYZ(1, _rayEnd.x, _rayEnd.y, _rayEnd.z);
          posAttr.needsUpdate = true;
        }
      }

      if (anyHandVisible && labelAnchorHand) {
        rig.labelSprite.visible = true;
        const wrist = labelAnchorHand.currentPoints[0];
        const midMcp = labelAnchorHand.currentPoints[9];
        rig.labelSprite.position.set(
          (wrist.x + midMcp.x) * 0.5,
          Math.max(wrist.y, midMcp.y) + 0.55,
          (wrist.z + midMcp.z) * 0.5
        );
      } else {
        rig.labelSprite.visible = false;
      }
    }
  }

  public clearAll(): void {
    for (const id of Array.from(this.rigs.keys())) {
      this.removePeer(id);
    }
  }

  public dispose(): void {
    this.disposed = true;
    this.clearAll();
    this.sphereGeo.dispose();
    this.tipGeo.dispose();
    this.boneGeo.dispose();
  }
}

// Helper to synthesize a realistic pointing 21-landmark skeleton when a peer uses mouse/touch pad without webcam
export function synthesizePointerSkeleton(
  cursorX: number,
  cursorY: number,
  gesture: CoopHandSkeleton['gesture']
): CoopHandSkeleton {
  const cx = THREE.MathUtils.clamp(cursorX, 0.05, 0.95);
  const cy = THREE.MathUtils.clamp(cursorY, 0.08, 0.92);
  const q = (v: number) => Math.round(v * 1000) / 1000;
  // Build anatomical upright hand centered beneath (cx, cy) index tip
  const offsets: [number, number, number][] = [
    [0.01, 0.17, 0.02], // 0 wrist
    [-0.045, 0.145, 0.01], // 1 thumb cmc
    [-0.075, 0.115, 0], // 2 thumb mcp
    [-0.095, 0.085, -0.01], // 3 thumb ip
    [-0.105, 0.055, -0.02], // 4 thumb tip
    [-0.015, 0.09, 0], // 5 index mcp
    [-0.01, 0.055, -0.015], // 6 index pip
    [-0.004, 0.025, -0.025], // 7 index dip
    [0, 0, -0.035], // 8 index tip
    [0.015, 0.088, 0.005], // 9 middle mcp
    [0.018, 0.045, -0.01], // 10 middle pip
    [0.02, 0.015, -0.02], // 11 middle dip
    [0.022, -0.012, -0.025], // 12 middle tip
    [0.042, 0.095, 0.01], // 13 ring mcp
    [0.048, 0.058, -0.005], // 14 ring pip
    [0.052, 0.028, -0.015], // 15 ring dip
    [0.055, 0.005, -0.02], // 16 ring tip
    [0.068, 0.108, 0.015], // 17 pinky mcp
    [0.076, 0.078, 0.005], // 18 pinky pip
    [0.082, 0.052, -0.005], // 19 pinky dip
    [0.086, 0.03, -0.01] // 20 pinky tip
  ];

  const isClosed = gesture === 'fist_0';
  const landmarks: [number, number, number][] = offsets.map(([dx, dy, dz], idx) => {
    const curl = isClosed && idx > 4 ? 0.45 : 1;
    return [q(cx + dx), q(cy + dy * curl), q(dz)];
  });

  return {
    handIndex: 0,
    handedness: 'Right',
    pinching: gesture === 'pinch',
    gesture,
    landmarks
  };
}
