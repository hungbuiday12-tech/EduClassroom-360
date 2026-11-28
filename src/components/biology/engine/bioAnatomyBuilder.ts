import * as THREE from 'three';
import { BioMaterialVault } from './bioMaterials';
import { resolvePartVisibilityState } from './bioCameraFocus';

export type AnatomySystemKey =
  | 'skeletal'
  | 'muscular'
  | 'circulatory'
  | 'respiratory'
  | 'digestive'
  | 'nervous'
  | 'urinary'
  | 'endocrine'
  | 'lymphatic'
  | 'reproductive'
  | 'sensory';

export const ANATOMY_SYSTEM_KEYS: AnatomySystemKey[] = [
  'skeletal',
  'muscular',
  'circulatory',
  'respiratory',
  'digestive',
  'nervous',
  'urinary',
  'endocrine',
  'lymphatic',
  'reproductive',
  'sensory'
];

export interface AnatomyVisibilityConfig {
  enabledSystems: Record<AnatomySystemKey, boolean>;
  skinOpacity: number; // 0..1
  muscleOpacity: number; // 0..1
  boneOpacity: number; // 0..1
  explode: number; // 0..1
  xray: boolean;
  hiddenPartIds: ReadonlySet<string>;
  isolatedPartId: string | null;
}

export interface AnatomyLabelAnchor {
  organId: string;
  systemKey: AnatomySystemKey;
  text: string;
  color: number;
  anchorPos: [number, number, number];
  labelPos: [number, number, number];
}

export const HUMAN_ANATOMY_LABEL_ANCHORS: AnatomyLabelAnchor[] = [
  { organId: 'brain_nervous', systemKey: 'nervous', text: 'Não bộ & Tủy sống', color: 0xfacc15, anchorPos: [0, 1.48, 0.05], labelPos: [-1.18, 1.66, 0.1] },
  { organId: 'sensory_organs', systemKey: 'sensory', text: 'Mắt & Tai trong', color: 0x38bdf8, anchorPos: [0.06, 1.44, 0.17], labelPos: [1.18, 1.56, 0.14] },
  { organId: 'endocrine_glands', systemKey: 'endocrine', text: 'Tuyến Giáp & Nội tiết', color: 0xf59e0b, anchorPos: [0.02, 0.99, 0.07], labelPos: [1.18, 1.14, 0.1] },
  { organId: 'lymphatic_immune', systemKey: 'lymphatic', text: 'Miễn dịch (Tuyến ức · Lách)', color: 0x34d399, anchorPos: [0.18, 0.3, 0.03], labelPos: [1.22, 0.42, 0.12] },
  { organId: 'lungs_respiratory', systemKey: 'respiratory', text: 'Phổi & Khí quản', color: 0x38bdf8, anchorPos: [0.22, 0.68, 0.08], labelPos: [1.22, 0.78, 0.1] },
  { organId: 'heart_circulatory', systemKey: 'circulatory', text: 'Tim 4 ngăn & Hệ mạch', color: 0xfb7185, anchorPos: [0.06, 0.58, 0.16], labelPos: [-1.22, 0.74, 0.18] },
  { organId: 'liver_gallbladder', systemKey: 'digestive', text: 'Gan & Túi mật', color: 0xf87171, anchorPos: [-0.14, 0.25, 0.14], labelPos: [-1.22, 0.28, 0.15] },
  { organId: 'stomach_intestines', systemKey: 'digestive', text: 'Dạ dày & Hệ Ruột', color: 0xfb923c, anchorPos: [0.08, 0.02, 0.12], labelPos: [1.22, -0.02, 0.15] },
  { organId: 'kidneys_urinary', systemKey: 'urinary', text: 'Thận & Tiết niệu', color: 0xf472b6, anchorPos: [0.14, 0.14, -0.04], labelPos: [-1.2, -0.22, -0.06] },
  { organId: 'reproductive_pelvic', systemKey: 'reproductive', text: 'Hệ Sinh sản', color: 0xe879f9, anchorPos: [0.0, -0.16, 0.02], labelPos: [1.18, -0.36, 0.08] },
  { organId: 'skeletal_frame', systemKey: 'skeletal', text: 'Hệ Xương & Lồng ngực', color: 0xe2e8f0, anchorPos: [-0.34, 0.54, 0.12], labelPos: [1.2, -0.72, 0.08] },
  { organId: 'muscular_system', systemKey: 'muscular', text: 'Hệ Cơ Vân', color: 0xfda4af, anchorPos: [-0.24, -0.52, 0.12], labelPos: [-1.18, -0.78, 0.12] }
];

export interface AnatomyBuildResult {
  root: THREE.Group;
  interactables: THREE.Object3D[];
  systemGroups: Record<AnatomySystemKey, THREE.Group>;
  skinGroup: THREE.Group;
  organGroups: Map<string, THREE.Group>;
  replaceOrganWithGltf: (organId: string, gltfGroup: THREE.Group) => boolean;
  restoreProceduralOrgan: (organId: string) => boolean;
  hasGltfOverride: (organId: string) => boolean;
  applyState: (cfg: AnatomyVisibilityConfig, simTime: number, bpm?: number) => void;
}

function tagOrgan(
  obj: THREE.Object3D,
  organId: string,
  partLabel: string,
  system: AnatomySystemKey | 'skin'
) {
  obj.userData.organId = organId;
  obj.userData.partId = organId;
  obj.userData.partLabel = partLabel;
  obj.userData.systemKey = system;
  obj.traverse((child) => {
    child.userData.organId = organId;
    child.userData.partId = organId;
    child.userData.partLabel = partLabel;
    child.userData.systemKey = system;
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}

/**
 * Applies smooth organic harmonic displacement to a SphereGeometry to create realistic lobes, sulci, or visceral curvature.
 */
function buildSculptedLobeGeometry(
  rx: number,
  ry: number,
  rz: number,
  segmentsW: number,
  segmentsH: number,
  deformFn: (v: THREE.Vector3, n: THREE.Vector3) => void
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, segmentsW, segmentsH);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.copy(v).normalize();
    v.set(v.x * rx, v.y * ry, v.z * rz);
    deformFn(v, n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildLatheLimb(
  profile: Array<[number, number]>,
  radialSegs = 20,
  scaleX = 1,
  scaleZ = 1
): THREE.BufferGeometry {
  const pts = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(pts, radialSegs);
  if (scaleX !== 1 || scaleZ !== 1) {
    geo.scale(scaleX, 1, scaleZ);
    geo.computeVertexNormals();
  }
  return geo;
}

function buildTube(
  points: Array<[number, number, number]>,
  radius: number,
  tubularSegs = 24,
  radialSegs = 12,
  taper?: (t: number) => number
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const geo = new THREE.TubeGeometry(curve, tubularSegs, radius, radialSegs, false);
  if (taper) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const ringIdx = Math.floor(i / (radialSegs + 1));
      const t = Math.min(1, ringIdx / tubularSegs);
      const center = curve.getPointAt(t);
      const scale = taper(t);
      v.fromBufferAttribute(pos, i).sub(center).multiplyScalar(scale).add(center);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  }
  return geo;
}

/**
 * Constructs a high-detail anatomically proportioned Human Anatomy Explorer 3D assembly
 * with 8 independent organ systems, sculpted visceral organs, skeletal ribs/spine/pelvis,
 * striated muscle groups, and adjustable skin/muscle/bone outer translucency.
 */
export function buildHumanAnatomyExplorer(
  vault: BioMaterialVault,
  isLowEnd = false
): AnatomyBuildResult {
  const root = new THREE.Group();
  root.name = 'human_anatomy_explorer_root';

  const segHi = isLowEnd ? 18 : 28;
  const segMed = isLowEnd ? 12 : 18;

  const skinGroup = new THREE.Group();
  skinGroup.name = 'layer_skin';

  const systemGroups: Record<AnatomySystemKey, THREE.Group> = {
    skeletal: new THREE.Group(),
    muscular: new THREE.Group(),
    circulatory: new THREE.Group(),
    respiratory: new THREE.Group(),
    digestive: new THREE.Group(),
    nervous: new THREE.Group(),
    urinary: new THREE.Group(),
    endocrine: new THREE.Group(),
    lymphatic: new THREE.Group(),
    reproductive: new THREE.Group(),
    sensory: new THREE.Group()
  };

  Object.entries(systemGroups).forEach(([k, g]) => {
    g.name = `layer_${k}`;
    root.add(g);
  });
  root.add(skinGroup);

  const organGroups = new Map<string, THREE.Group>();
  const interactables: THREE.Object3D[] = [];

  // Materials (unique per translucency-controlled layer so opacity sliders work independently)
  const skinMat = vault.createUniqueMaterial('skin_shell', {
    opacity: 0.24,
    transparent: true,
    side: THREE.FrontSide,
    roughness: 0.56
  });
  const boneMat = vault.createUniqueMaterial('compact_bone', {
    opacity: 0.92,
    transparent: true
  });
  const cartilageMat = vault.createUniqueMaterial('cartilage', {
    opacity: 0.85,
    transparent: true
  });
  const muscleMat = vault.createUniqueMaterial('skeletal_muscle', {
    opacity: 0.58,
    transparent: true
  });
  const cardiacMat = vault.createUniqueMaterial('cardiac_muscle');
  const arteryMat = vault.createUniqueMaterial('arterial_vessel');
  const veinMat = vault.createUniqueMaterial('venous_vessel');
  const lungMat = vault.createUniqueMaterial('lung_parenchyma', {
    opacity: 0.94,
    transparent: true
  });
  const liverMat = vault.createUniqueMaterial('liver_parenchyma');
  const stomachMat = vault.createUniqueMaterial('gastric_mucosa');
  const intestineMat = vault.createUniqueMaterial('gastric_mucosa', {
    color: 0xd99b84
  });
  const colonMat = vault.createUniqueMaterial('gastric_mucosa', {
    color: 0xb87663
  });
  const gallMat = vault.createUniqueMaterial('chloroplast_membrane', {
    color: 0x16a34a
  });
  const brainMat = vault.createUniqueMaterial('brain_cortex');
  const nerveMat = vault.createUniqueMaterial('nerve_myelin');
  const kidneyMat = vault.createUniqueMaterial('renal_cortex');
  const bladderMat = vault.createUniqueMaterial('gastric_mucosa', {
    color: 0xd98e73
  });
  const endocrineMat = vault.createUniqueMaterial('endocrine_gland');

  // =========================================================
  // 0. SCIENTIFIC PEDESTAL BASE (keeps whole figure grounded cleanly)
  // =========================================================
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.18, 0.09, 36),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.25 })
  );
  pedestal.position.y = -1.78;
  pedestal.receiveShadow = true;
  root.add(pedestal);

  const ringAccent = new THREE.Mesh(
    new THREE.TorusGeometry(1.04, 0.016, 10, 48),
    new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.35, metalness: 0.4 })
  );
  ringAccent.rotation.x = Math.PI / 2;
  ringAccent.position.y = -1.735;
  root.add(ringAccent);

  // =========================================================
  // 1. OUTER BODY SHELL (Anatomically proportioned Lathe torso + sculpted limbs)
  // =========================================================
  const torsoSkinGeo = buildLatheLimb(
    [
      [0.01, -0.32],
      [0.24, -0.25],
      [0.37, -0.05], // pelvis
      [0.31, 0.22], // waist
      [0.39, 0.56], // ribcage
      [0.45, 0.78], // shoulders
      [0.14, 0.94], // neck base
      [0.125, 1.12], // upper neck
      [0.22, 1.24], // jaw
      [0.25, 1.44], // head mid
      [0.21, 1.62],
      [0.02, 1.71]
    ],
    segHi,
    1.18,
    0.76
  );
  const torsoSkin = new THREE.Mesh(torsoSkinGeo, skinMat);
  skinGroup.add(torsoSkin);

  for (const side of [-1, 1]) {
    // Upper arm + forearm contoured silhouette
    const armGeo = buildLatheLimb(
      [
        [0.04, -0.68],
        [0.055, -0.42],
        [0.075, -0.2],
        [0.092, 0.0],
        [0.105, 0.14],
        [0.06, 0.22]
      ],
      16,
      0.92,
      0.92
    );
    const arm = new THREE.Mesh(armGeo, skinMat);
    arm.position.set(side * 0.57, 0.55, 0);
    arm.rotation.z = side * 0.16;
    skinGroup.add(arm);

    // Thigh + calf + ankle contoured leg silhouette
    const legGeo = buildLatheLimb(
      [
        [0.06, -1.48],
        [0.085, -1.18],
        [0.105, -0.92], // calf swell
        [0.09, -0.68], // knee
        [0.135, -0.36],
        [0.165, -0.05], // upper thigh
        [0.11, 0.08]
      ],
      18,
      0.96,
      1.0
    );
    const leg = new THREE.Mesh(legGeo, skinMat);
    leg.position.set(side * 0.23, -0.22, 0.01);
    leg.rotation.z = side * -0.03;
    skinGroup.add(leg);
  }

  // =========================================================
  // 2. SKELETAL SYSTEM (Cranium, Spine, 10-pair Ribcage, Pelvis, Limbs)
  // =========================================================
  const skeletalGroup = new THREE.Group();
  systemGroups.skeletal.add(skeletalGroup);
  organGroups.set('skeletal_frame', skeletalGroup);

  // Cranium + mandible
  const cranium = new THREE.Mesh(
    buildSculptedLobeGeometry(0.21, 0.24, 0.24, segMed, segMed, (v) => {
      if (v.y < -0.05 && v.z > 0.04) {
        v.z *= 0.88;
        v.x *= 0.78;
      }
      if (v.y > 0.04 && v.z < 0) v.z *= 1.06;
    }),
    boneMat
  );
  cranium.position.set(0, 1.44, -0.01);
  skeletalGroup.add(cranium);

  const mandible = new THREE.Mesh(
    buildTube(
      [
        [-0.12, 1.32, -0.02],
        [-0.1, 1.22, 0.09],
        [0, 1.19, 0.14],
        [0.1, 1.22, 0.09],
        [0.12, 1.32, -0.02]
      ],
      0.026,
      18,
      8
    ),
    boneMat
  );
  skeletalGroup.add(mandible);

  // Vertebral column (21 sculpted vertebral bodies + posterior spinous processes + intervertebral cartilage discs)
  const vertebraBodyGeo = buildSculptedLobeGeometry(0.052, 0.024, 0.046, 12, 8, (v) => {
    // Concave posterior spinal canal notch & anterior cylindrical waist
    if (v.z < -0.015) v.x *= 0.65;
  });
  const spinousGeo = buildSculptedLobeGeometry(0.014, 0.018, 0.036, 8, 6, (v) => {
    if (v.z < 0) v.y -= 0.01;
  });
  const discGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.014, 14);
  for (let i = 0; i < 21; i++) {
    const t = i / 20;
    const y = -0.14 + t * 1.24;
    const zCurve = Math.sin(t * Math.PI * 2) * 0.04 - 0.13;
    const vert = new THREE.Mesh(vertebraBodyGeo, boneMat);
    vert.position.set(0, y, zCurve);
    const spinous = new THREE.Mesh(spinousGeo, boneMat);
    spinous.position.set(0, y - 0.004, zCurve - 0.046);
    skeletalGroup.add(vert, spinous);
    if (i < 20) {
      const disc = new THREE.Mesh(discGeo, cartilageMat);
      disc.position.set(0, y + 0.03, zCurve);
      skeletalGroup.add(disc);
    }
  }

  // Sculpted anatomical sternum (Manubrium + Body + Xiphoid process)
  const manubrium = new THREE.Mesh(
    buildSculptedLobeGeometry(0.056, 0.068, 0.02, 12, 10, (v) => {
      if (v.y > 0) v.x *= 1.15;
      if (v.y < 0) v.x *= 0.68;
    }),
    boneMat
  );
  manubrium.position.set(0, 0.77, 0.22);
  manubrium.rotation.x = -0.14;

  const sternumBody = new THREE.Mesh(
    buildSculptedLobeGeometry(0.036, 0.165, 0.018, 12, 10, (v) => {
      if (v.y < -0.1) v.x *= 0.65;
    }),
    boneMat
  );
  sternumBody.position.set(0, 0.56, 0.242);
  sternumBody.rotation.x = -0.09;

  const xiphoid = new THREE.Mesh(
    buildSculptedLobeGeometry(0.018, 0.042, 0.012, 10, 8, (v) => {
      if (v.y < 0) {
        v.x *= 0.35;
        v.z *= 0.45;
      }
    }),
    cartilageMat
  );
  xiphoid.position.set(0, 0.37, 0.252);
  skeletalGroup.add(manubrium, sternumBody, xiphoid);

  for (let r = 0; r < 9; r++) {
    const frac = r / 8;
    const yRear = 0.85 - frac * 0.56;
    const yFront = yRear - 0.09;
    const width = 0.26 + Math.sin(frac * Math.PI * 0.85) * 0.14;
    const depth = 0.21 + Math.sin(frac * Math.PI * 0.9) * 0.07;

    for (const side of [-1, 1]) {
      const ribPts: Array<[number, number, number]> = [
        [side * 0.04, yRear, -0.13],
        [side * (width * 0.72), yRear - 0.02, -0.06],
        [side * width, (yRear + yFront) * 0.5, 0.06],
        [side * (width * 0.55), yFront, depth],
        [side * (r < 6 ? 0.04 : 0.12), yFront + 0.02, depth - 0.01]
      ];
      const ribMesh = new THREE.Mesh(
        buildTube(ribPts, 0.015, 18, 8),
        r >= 6 ? cartilageMat : boneMat
      );
      skeletalGroup.add(ribMesh);
    }
  }

  // Clavicles + Pelvis iliac wings + Limb bones
  for (const side of [-1, 1]) {
    const clavicle = new THREE.Mesh(
      buildTube(
        [
          [side * 0.04, 0.82, 0.22],
          [side * 0.22, 0.86, 0.15],
          [side * 0.42, 0.84, 0.02]
        ],
        0.019,
        14,
        8
      ),
      boneMat
    );
    skeletalGroup.add(clavicle);

    const ilium = new THREE.Mesh(
      buildSculptedLobeGeometry(0.14, 0.16, 0.1, 14, 12, (v) => {
        if (v.y < 0) v.x *= 0.7;
      }),
      boneMat
    );
    ilium.position.set(side * 0.21, -0.12, -0.02);
    ilium.rotation.z = side * -0.35;
    skeletalGroup.add(ilium);

    // Pubic & ischial arch closing the anterior pelvic ring
    const pubicRamus = new THREE.Mesh(
      buildTube(
        [
          [side * 0.19, -0.2, 0.02],
          [side * 0.11, -0.27, 0.1],
          [0, -0.25, 0.12]
        ],
        0.022,
        10,
        8
      ),
      boneMat
    );
    skeletalGroup.add(pubicRamus);

    const humerus = new THREE.Mesh(
      buildTube(
        [
          [side * 0.46, 0.78, 0],
          [side * 0.55, 0.48, -0.02],
          [side * 0.62, 0.24, 0.01]
        ],
        0.026,
        12,
        8
      ),
      boneMat
    );
    const radiusUlna = new THREE.Mesh(
      buildTube(
        [
          [side * 0.62, 0.22, 0.01],
          [side * 0.67, -0.02, 0.03]
        ],
        0.02,
        10,
        8
      ),
      boneMat
    );
    const femur = new THREE.Mesh(
      buildTube(
        [
          [side * 0.23, -0.22, 0],
          [side * 0.22, -0.62, 0.02],
          [side * 0.21, -0.88, 0.01]
        ],
        0.036,
        12,
        8
      ),
      boneMat
    );
    const tibia = new THREE.Mesh(
      buildTube(
        [
          [side * 0.21, -0.92, 0.01],
          [side * 0.21, -1.48, 0.0]
        ],
        0.028,
        12,
        8
      ),
      boneMat
    );
    skeletalGroup.add(humerus, radiusUlna, femur, tibia);
  }
  tagOrgan(skeletalGroup, 'skeletal_frame', 'Hệ Xương (Sọ · Lồng ngực · Cột sống)', 'skeletal');
  interactables.push(skeletalGroup);

  // =========================================================
  // 3. MUSCULAR SYSTEM (Sculpted Pectorals, Deltoids, Abs, Biceps, Quads)
  // =========================================================
  const muscularGroup = new THREE.Group();
  systemGroups.muscular.add(muscularGroup);
  organGroups.set('muscular_system', muscularGroup);

  for (const side of [-1, 1]) {
    const pec = new THREE.Mesh(
      buildSculptedLobeGeometry(0.18, 0.14, 0.08, 16, 12, (v) => {
        if (v.x * side < 0) v.z *= 0.85;
      }),
      muscleMat
    );
    pec.position.set(side * 0.18, 0.67, 0.22);
    pec.rotation.y = side * -0.22;
    muscularGroup.add(pec);

    const deltoid = new THREE.Mesh(
      buildSculptedLobeGeometry(0.11, 0.15, 0.11, 14, 12, (v) => {
        if (v.y < 0) {
          v.x *= 0.65;
          v.z *= 0.65;
        }
      }),
      muscleMat
    );
    deltoid.position.set(side * 0.48, 0.72, 0.0);
    deltoid.rotation.z = side * 0.22;
    muscularGroup.add(deltoid);

    const bicep = new THREE.Mesh(
      buildSculptedLobeGeometry(0.072, 0.18, 0.072, 12, 10, () => {}),
      muscleMat
    );
    bicep.position.set(side * 0.56, 0.44, 0.02);
    bicep.rotation.z = side * 0.18;
    muscularGroup.add(bicep);

    const quad = new THREE.Mesh(
      buildSculptedLobeGeometry(0.115, 0.34, 0.125, 14, 12, (v) => {
        if (v.y < 0) v.x *= 0.78;
      }),
      muscleMat
    );
    quad.position.set(side * 0.23, -0.52, 0.04);
    muscularGroup.add(quad);

    // 3 pairs of rectus abdominis segments
    for (let row = 0; row < 3; row++) {
      const ab = new THREE.Mesh(
        buildSculptedLobeGeometry(0.095, 0.07, 0.055, 10, 8, () => {}),
        muscleMat
      );
      ab.position.set(side * 0.1, 0.36 - row * 0.145, 0.21);
      muscularGroup.add(ab);
    }
  }
  tagOrgan(muscularGroup, 'muscular_system', 'Hệ Cơ Vân (Ngực · Vai · Bụng · Đùi)', 'muscular');
  interactables.push(muscularGroup);

  // =========================================================
  // 4. NERVOUS SYSTEM (Gyri Brain + Cerebellum + Spinal Cord + Nerve Roots)
  // =========================================================
  const brainGroup = new THREE.Group();
  systemGroups.nervous.add(brainGroup);
  organGroups.set('brain_nervous', brainGroup);

  const brainCoreGroup = new THREE.Group();
  brainCoreGroup.userData.focusAnchorFor = 'brain_nervous';
  brainGroup.add(brainCoreGroup);

  for (const side of [-1, 1]) {
    const hemiGeo = buildSculptedLobeGeometry(0.105, 0.145, 0.185, segHi, segMed, (v, n) => {
      // Flatten medial fissure face & sculpt cortical gyri convolutions
      if (v.x * side < 0) v.x *= 0.16;
      const gyri = Math.sin(n.y * 14 + n.z * 11) * Math.cos(n.x * 13 - n.z * 9) * 0.008;
      v.addScaledVector(n, gyri);
      // Temporal lobe bulge
      if (v.y < -0.02 && Math.abs(v.z) < 0.08) v.x += side * 0.018;
    });
    const hemi = new THREE.Mesh(hemiGeo, brainMat);
    hemi.position.set(side * 0.052, 1.48, -0.01);
    brainCoreGroup.add(hemi);
  }

  const cerebellum = new THREE.Mesh(
    buildSculptedLobeGeometry(0.125, 0.072, 0.085, 20, 14, (v, n) => {
      const folia = Math.sin(n.y * 28) * 0.004;
      v.addScaledVector(n, folia);
    }),
    vault.getMaterial('brain_cortex', { color: 0xcf8e86 })
  );
  cerebellum.position.set(0, 1.33, -0.11);
  brainCoreGroup.add(cerebellum);

  const spinalCord = new THREE.Mesh(
    buildTube(
      [
        [0, 1.35, -0.06],
        [0, 1.12, -0.11],
        [0, 0.72, -0.14],
        [0, 0.25, -0.11],
        [0, -0.12, -0.13]
      ],
      0.018,
      28,
      10
    ),
    nerveMat
  );
  brainGroup.add(spinalCord);

  // Sciatic & brachial peripheral nerve branches
  for (const side of [-1, 1]) {
    const brachial = new THREE.Mesh(
      buildTube(
        [
          [0, 0.85, -0.12],
          [side * 0.25, 0.78, -0.05],
          [side * 0.5, 0.58, 0],
          [side * 0.62, 0.2, 0.02]
        ],
        0.009,
        16,
        6
      ),
      nerveMat
    );
    const sciatic = new THREE.Mesh(
      buildTube(
        [
          [0, -0.08, -0.12],
          [side * 0.18, -0.24, -0.04],
          [side * 0.21, -0.82, -0.02],
          [side * 0.21, -1.35, -0.01]
        ],
        0.01,
        16,
        6
      ),
      nerveMat
    );
    brainGroup.add(brachial, sciatic);
  }
  tagOrgan(brainGroup, 'brain_nervous', 'Não bộ & Hệ Thần kinh', 'nervous');
  interactables.push(brainGroup);

  // =========================================================
  // 5. CIRCULATORY SYSTEM (Sculpted 4-Chamber Heart + Aorta + Vena Cava + Vessels)
  // =========================================================
  const heartGroup = new THREE.Group();
  systemGroups.circulatory.add(heartGroup);
  organGroups.set('heart_circulatory', heartGroup);

  const heartCluster = new THREE.Group();
  heartCluster.userData.focusAnchorFor = 'heart_circulatory';
  heartCluster.position.set(0.055, 0.58, 0.085); // anatomically slightly left of midline (+x = anatomical left)
  heartGroup.add(heartCluster);

  const ventricularCone = new THREE.Mesh(
    buildSculptedLobeGeometry(0.115, 0.145, 0.105, segHi, segMed, (v) => {
      // Taper downward toward cardiac apex pointing left/anterior
      if (v.y < 0) {
        const t = Math.abs(v.y) / 0.145;
        v.x = v.x * (1 - t * 0.55) + t * 0.042;
        v.z = v.z * (1 - t * 0.55) + t * 0.025;
      }
      // Subtle interventricular sulcus indentation
      v.z -= Math.exp(-Math.pow(v.x * 12, 2)) * 0.012;
    }),
    cardiacMat
  );
  heartCluster.add(ventricularCone);

  const rightAtrium = new THREE.Mesh(
    buildSculptedLobeGeometry(0.062, 0.068, 0.06, 14, 12, () => {}),
    veinMat
  );
  rightAtrium.position.set(-0.075, 0.085, 0.01);
  const leftAtrium = new THREE.Mesh(
    buildSculptedLobeGeometry(0.062, 0.062, 0.06, 14, 12, () => {}),
    cardiacMat
  );
  leftAtrium.position.set(0.055, 0.095, -0.02);
  heartCluster.add(rightAtrium, leftAtrium);

  // Aortic arch + descending thoracic/abdominal aorta + iliac bifurcation
  const aorta = new THREE.Mesh(
    buildTube(
      [
        [0.04, 0.65, 0.08],
        [0.03, 0.81, 0.06],
        [0.08, 0.86, 0.0],
        [0.05, 0.72, -0.07],
        [0.02, 0.3, -0.06],
        [0.02, -0.05, -0.04]
      ],
      0.026,
      28,
      10
    ),
    arteryMat
  );
  const venaCava = new THREE.Mesh(
    buildTube(
      [
        [-0.06, 0.88, 0.04],
        [-0.05, 0.68, 0.06],
        [-0.04, 0.25, -0.04],
        [-0.03, -0.05, -0.03]
      ],
      0.024,
      22,
      10
    ),
    veinMat
  );
  const pulmTrunk = new THREE.Mesh(
    buildTube(
      [
        [0.01, 0.66, 0.12],
        [0.03, 0.76, 0.06],
        [-0.14, 0.74, 0.02]
      ],
      0.019,
      16,
      8
    ),
    veinMat
  );
  heartGroup.add(aorta, venaCava, pulmTrunk);

  // Carotid & Femoral systemic vessels
  for (const side of [-1, 1]) {
    const carotid = new THREE.Mesh(
      buildTube(
        [
          [0.04, 0.82, 0.03],
          [side * 0.06, 1.05, 0.01],
          [side * 0.06, 1.32, 0.0]
        ],
        0.011,
        14,
        8
      ),
      arteryMat
    );
    const femoralArt = new THREE.Mesh(
      buildTube(
        [
          [0.02, -0.05, -0.04],
          [side * 0.14, -0.22, 0.02],
          [side * 0.19, -0.82, 0.03],
          [side * 0.2, -1.35, 0.02]
        ],
        0.012,
        18,
        8
      ),
      arteryMat
    );
    const femoralVein = new THREE.Mesh(
      buildTube(
        [
          [-0.03, -0.05, -0.03],
          [side * 0.17, -0.24, 0.01],
          [side * 0.22, -0.82, 0.01],
          [side * 0.22, -1.35, 0.0]
        ],
        0.011,
        18,
        8
      ),
      veinMat
    );
    heartGroup.add(carotid, femoralArt, femoralVein);
  }
  tagOrgan(heartGroup, 'heart_circulatory', 'Tim 4 ngăn & Hệ Tuần hoàn', 'circulatory');
  interactables.push(heartGroup);

  // =========================================================
  // 6. RESPIRATORY SYSTEM (Larynx, C-ring Trachea, 3-Lobe/2-Lobe Lungs, Diaphragm)
  // =========================================================
  const respGroup = new THREE.Group();
  systemGroups.respiratory.add(respGroup);
  organGroups.set('lungs_respiratory', respGroup);

  const trachea = new THREE.Mesh(
    buildTube(
      [
        [0, 1.12, 0.04],
        [0, 0.92, 0.04],
        [0, 0.77, 0.03]
      ],
      0.026,
      16,
      12
    ),
    cartilageMat
  );
  respGroup.add(trachea);

  for (let i = 0; i < 9; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.029, 0.005, 8, 16), boneMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.8 + i * 0.034, 0.038);
    respGroup.add(ring);
  }

  for (const side of [-1, 1]) {
    const bronchus = new THREE.Mesh(
      buildTube(
        [
          [0, 0.78, 0.03],
          [side * 0.13, 0.69, 0.02],
          [side * 0.21, 0.62, 0.01]
        ],
        0.017,
        12,
        8
      ),
      cartilageMat
    );
    respGroup.add(bronchus);

    // Anatomical lung silhouette: tapered apex, broad concave diaphragmatic base, medial cardiac notch on left (+x)
    const lungGeo = buildSculptedLobeGeometry(0.165, 0.27, 0.175, segHi, segMed, (v) => {
      if (v.y > 0) {
        const apexT = v.y / 0.27;
        v.x *= 1 - apexT * 0.42;
        v.z *= 1 - apexT * 0.35;
      }
      // Concave base resting on diaphragm
      if (v.y < -0.14) v.y += 0.05 * (1 - Math.hypot(v.x, v.z) * 2.2);
      // Cardiac notch indentation on left lung medial face
      if (side === 1 && v.x < -0.02 && v.y < 0.04 && v.z > -0.02) {
        v.x += 0.055;
      }
    });
    const lungMesh = new THREE.Mesh(lungGeo, lungMat);
    lungMesh.position.set(side * 0.205, 0.61, 0.01);
    respGroup.add(lungMesh);
  }

  const diaphragm = new THREE.Mesh(
    buildSculptedLobeGeometry(0.32, 0.065, 0.19, 20, 12, (v) => {
      if (v.y < 0) v.y *= 0.25;
    }),
    muscleMat
  );
  diaphragm.position.set(0, 0.34, 0.02);
  respGroup.add(diaphragm);
  tagOrgan(respGroup, 'lungs_respiratory', 'Phổi & Khí quản (Hệ Hô hấp)', 'respiratory');
  interactables.push(respGroup);

  // =========================================================
  // 7. DIGESTIVE SYSTEM (Liver + Gallbladder, J-Stomach, Intestines)
  // =========================================================
  const liverGroup = new THREE.Group();
  systemGroups.digestive.add(liverGroup);
  organGroups.set('liver_gallbladder', liverGroup);

  // Liver resides on anatomical right (-x in viewer facing forward)
  const liverMesh = new THREE.Mesh(
    buildSculptedLobeGeometry(0.22, 0.125, 0.15, segHi, segMed, (v) => {
      // Wedge taper toward anatomical left (+x)
      if (v.x > 0) {
        const t = v.x / 0.22;
        v.y *= 1 - t * 0.55;
        v.z *= 1 - t * 0.35;
      }
      if (v.y < 0) v.y *= 0.65;
    }),
    liverMat
  );
  liverMesh.position.set(-0.11, 0.26, 0.075);
  liverMesh.rotation.z = 0.14;
  liverGroup.add(liverMesh);

  const gallbladder = new THREE.Mesh(
    buildSculptedLobeGeometry(0.032, 0.055, 0.032, 12, 10, (v) => {
      if (v.y > 0) {
        v.x *= 0.55;
        v.z *= 0.55;
      }
    }),
    gallMat
  );
  gallbladder.position.set(-0.14, 0.16, 0.13);
  gallbladder.rotation.z = -0.35;
  liverGroup.add(gallbladder);

  tagOrgan(liverGroup, 'liver_gallbladder', 'Gan & Túi mật', 'digestive');
  interactables.push(liverGroup);

  const giGroup = new THREE.Group();
  systemGroups.digestive.add(giGroup);
  organGroups.set('stomach_intestines', giGroup);

  const esophagus = new THREE.Mesh(
    buildTube(
      [
        [0, 1.05, -0.02],
        [0, 0.65, -0.03],
        [0.05, 0.36, 0.01]
      ],
      0.018,
      16,
      8
    ),
    stomachMat
  );
  const stomach = new THREE.Mesh(
    buildTube(
      [
        [0.05, 0.34, 0.03],
        [0.16, 0.29, 0.09],
        [0.14, 0.18, 0.12],
        [0.02, 0.15, 0.09],
        [-0.04, 0.19, 0.05]
      ],
      0.068,
      20,
      14,
      (t) => 0.45 + Math.sin(t * Math.PI) * 0.72
    ),
    stomachMat
  );

  // Coiled small intestine loops in central umbilical region
  const siPts: Array<[number, number, number]> = [];
  for (let k = 0; k <= 24; k++) {
    const t = k / 24;
    const x = Math.sin(t * Math.PI * 6) * 0.11;
    const y = 0.08 - t * 0.22;
    const z = 0.06 + Math.cos(t * Math.PI * 5) * 0.038;
    siPts.push([x, y, z]);
  }
  const smallIntestine = new THREE.Mesh(buildTube(siPts, 0.028, 48, 10), intestineMat);

  // Large intestine framing ascending, transverse, descending & sigmoid colon
  const largeIntestine = new THREE.Mesh(
    buildTube(
      [
        [-0.17, -0.14, 0.05],
        [-0.18, 0.07, 0.06],
        [0.0, 0.1, 0.1],
        [0.18, 0.08, 0.06],
        [0.17, -0.15, 0.03],
        [0.04, -0.22, 0.0]
      ],
      0.042,
      32,
      12
    ),
    colonMat
  );
  giGroup.add(esophagus, stomach, smallIntestine, largeIntestine);
  tagOrgan(giGroup, 'stomach_intestines', 'Dạ dày, Ruột non & Ruột già', 'digestive');
  interactables.push(giGroup);

  // =========================================================
  // 8. URINARY SYSTEM (Bilateral Kidneys, Ureters, Bladder)
  // =========================================================
  const urinaryGroup = new THREE.Group();
  systemGroups.urinary.add(urinaryGroup);
  organGroups.set('kidneys_urinary', urinaryGroup);

  for (const side of [-1, 1]) {
    const kidneyGeo = buildSculptedLobeGeometry(0.062, 0.095, 0.05, 16, 14, (v) => {
      // Concave renal hilum facing midline
      if (v.x * side < 0 && Math.abs(v.y) < 0.045) {
        v.x += side * 0.025;
      }
    });
    const kidney = new THREE.Mesh(kidneyGeo, kidneyMat);
    const ky = side === -1 ? 0.12 : 0.15; // Right kidney slightly lower due to liver
    kidney.position.set(side * 0.135, ky, -0.055);
    kidney.rotation.z = side * -0.18;
    urinaryGroup.add(kidney);

    const ureter = new THREE.Mesh(
      buildTube(
        [
          [side * 0.105, ky - 0.02, -0.045],
          [side * 0.085, -0.06, -0.03],
          [side * 0.035, -0.2, 0.04]
        ],
        0.009,
        16,
        8
      ),
      cartilageMat
    );
    urinaryGroup.add(ureter);
  }

  const bladder = new THREE.Mesh(
    buildSculptedLobeGeometry(0.068, 0.062, 0.062, 14, 12, () => {}),
    bladderMat
  );
  bladder.position.set(0, -0.22, 0.065);
  urinaryGroup.add(bladder);
  tagOrgan(urinaryGroup, 'kidneys_urinary', 'Hệ Tiết niệu (Thận · Niệu quản · Bàng quang)', 'urinary');
  interactables.push(urinaryGroup);

  // =========================================================
  // 9. ENDOCRINE SYSTEM (Thyroid, Adrenals, Pancreas)
  // =========================================================
  const endocrineGroup = new THREE.Group();
  systemGroups.endocrine.add(endocrineGroup);
  organGroups.set('endocrine_glands', endocrineGroup);

  // Sacrum closing the posterior pelvic girdle
  const sacrum = new THREE.Mesh(
    buildSculptedLobeGeometry(0.095, 0.13, 0.048, 12, 10, (v) => {
      if (v.y < 0) {
        const t = Math.abs(v.y) / 0.13;
        v.x *= 1 - t * 0.68;
      }
      v.z -= 0.015;
    }),
    boneMat
  );
  sacrum.position.set(0, -0.18, -0.13);
  skeletalGroup.add(sacrum);

  // Butterfly-shaped Thyroid hugging upper trachea + sculpted crescent Adrenals
  for (const side of [-1, 1]) {
    const lobe = new THREE.Mesh(
      buildSculptedLobeGeometry(0.026, 0.044, 0.024, 12, 10, () => {}),
      endocrineMat
    );
    lobe.position.set(side * 0.032, 0.99, 0.052);
    endocrineGroup.add(lobe);

    // Sculpted pyramidal-crescent adrenal glands capping both kidneys
    const adrenal = new THREE.Mesh(
      buildSculptedLobeGeometry(0.034, 0.024, 0.026, 12, 10, (v) => {
        if (v.y < 0) v.y *= 0.35;
        if (v.y > 0) {
          v.x *= 0.65;
          v.z *= 0.65;
        }
      }),
      endocrineMat
    );
    adrenal.position.set(side * 0.13, side === -1 ? 0.215 : 0.24, -0.055);
    endocrineGroup.add(adrenal);
  }
  const thyroidIsthmus = new THREE.Mesh(
    buildTube(
      [
        [-0.03, 0.985, 0.058],
        [0, 0.985, 0.068],
        [0.03, 0.985, 0.058]
      ],
      0.012,
      10,
      8
    ),
    endocrineMat
  );
  endocrineGroup.add(thyroidIsthmus);

  // Leaf-shaped Pancreas tucked behind stomach
  const pancreas = new THREE.Mesh(
    buildTube(
      [
        [-0.04, 0.18, 0.03],
        [0.04, 0.21, 0.02],
        [0.15, 0.23, -0.01]
      ],
      0.032,
      14,
      10,
      (t) => 1.15 - t * 0.55
    ),
    endocrineMat
  );
  endocrineGroup.add(pancreas);
  tagOrgan(endocrineGroup, 'endocrine_glands', 'Tuyến Nội tiết (Giáp · Thượng thận · Tụy)', 'endocrine');
  interactables.push(endocrineGroup);

  // =========================================================
  // 10. LYMPHATIC & IMMUNE SYSTEM (Thymus, Spleen, Lymph Nodes & Thoracic Duct)
  // =========================================================
  const lymphaticGroup = new THREE.Group();
  systemGroups.lymphatic.add(lymphaticGroup);
  organGroups.set('lymphatic_immune', lymphaticGroup);

  const lymphVesselMat = vault.getMaterial('bacterial_capsule', { color: 0x34d399, roughness: 0.32 });
  const spleenMat = vault.getMaterial('liver_parenchyma', { color: 0x6d1b3b, roughness: 0.34 });
  const thymusMat = vault.getMaterial('endocrine_gland', { color: 0xfbbf77, roughness: 0.44 });

  // Bilobed Thymus in superior anterior mediastinum
  for (const side of [-1, 1]) {
    const thymusLobe = new THREE.Mesh(
      buildSculptedLobeGeometry(0.028, 0.055, 0.022, 12, 10, (v) => {
        if (v.y > 0) v.x *= 0.65;
      }),
      thymusMat
    );
    thymusLobe.position.set(side * 0.024, 0.74, 0.135);
    thymusLobe.rotation.z = side * -0.18;
    lymphaticGroup.add(thymusLobe);
  }

  // Crescentic Spleen tucked in left hypochondrium (+x = anatomical left)
  const spleen = new THREE.Mesh(
    buildSculptedLobeGeometry(0.058, 0.088, 0.048, 16, 12, (v) => {
      if (v.x < 0) v.x *= 0.48;
      v.z -= Math.sin((v.y / 0.088) * Math.PI) * 0.012;
    }),
    spleenMat
  );
  spleen.position.set(0.195, 0.28, -0.015);
  spleen.rotation.set(0.12, -0.25, -0.28);
  lymphaticGroup.add(spleen);

  // Thoracic duct ascending along vertebral midline + regional lymph nodes (cervical, axillary, inguinal)
  const thoracicDuct = new THREE.Mesh(
    buildTube(
      [
        [0.01, 0.06, -0.05],
        [0.015, 0.45, -0.06],
        [0.025, 0.78, -0.03],
        [-0.035, 0.89, 0.02]
      ],
      0.0085,
      18,
      8
    ),
    lymphVesselMat
  );
  lymphaticGroup.add(thoracicDuct);

  const nodeGeo = buildSculptedLobeGeometry(0.016, 0.021, 0.014, 10, 8, () => {});
  for (const side of [-1, 1]) {
    // Cervical chain, axillary cluster, and inguinal lymph nodes
    const chains: Array<[number, number, number]> = [
      [side * 0.075, 1.09, 0.035],
      [side * 0.085, 1.02, 0.03],
      [side * 0.31, 0.72, 0.03],
      [side * 0.35, 0.67, 0.02],
      [side * 0.135, -0.19, 0.075],
      [side * 0.155, -0.24, 0.07]
    ];
    for (const [nx, ny, nz] of chains) {
      const node = new THREE.Mesh(nodeGeo, lymphVesselMat);
      node.position.set(nx, ny, nz);
      lymphaticGroup.add(node);
    }
    const axVessel = new THREE.Mesh(
      buildTube(
        [
          [0.01, 0.84, 0.02],
          [side * 0.18, 0.78, 0.03],
          [side * 0.34, 0.68, 0.02]
        ],
        0.006,
        12,
        6
      ),
      lymphVesselMat
    );
    const ingVessel = new THREE.Mesh(
      buildTube(
        [
          [0.01, 0.05, -0.04],
          [side * 0.09, -0.1, 0.03],
          [side * 0.15, -0.25, 0.07]
        ],
        0.0065,
        12,
        6
      ),
      lymphVesselMat
    );
    lymphaticGroup.add(axVessel, ingVessel);
  }
  tagOrgan(lymphaticGroup, 'lymphatic_immune', 'Hệ Miễn dịch (Tuyến ức · Lách · Hạch bạch huyết)', 'lymphatic');
  interactables.push(lymphaticGroup);

  // =========================================================
  // 11. REPRODUCTIVE SYSTEM (Educational Pelvic Anatomy: Uterus, Tubes & Ovaries)
  // =========================================================
  const reproductiveGroup = new THREE.Group();
  systemGroups.reproductive.add(reproductiveGroup);
  organGroups.set('reproductive_pelvic', reproductiveGroup);

  const reproMat = vault.getMaterial('gastric_mucosa', { color: 0xd9468f, roughness: 0.36 });
  const ovaryMat = vault.getMaterial('endocrine_gland', { color: 0xf4a261, roughness: 0.4 });

  // Anteverted pear-shaped uterus positioned behind bladder inside pelvic ring
  const uterus = new THREE.Mesh(
    buildSculptedLobeGeometry(0.056, 0.072, 0.044, 14, 12, (v) => {
      if (v.y < 0) {
        const t = Math.abs(v.y) / 0.072;
        v.x *= 1 - t * 0.45;
        v.z *= 1 - t * 0.35;
      }
    }),
    reproMat
  );
  uterus.position.set(0, -0.175, 0.015);
  uterus.rotation.x = 0.42;
  reproductiveGroup.add(uterus);

  for (const side of [-1, 1]) {
    const tube = new THREE.Mesh(
      buildTube(
        [
          [side * 0.038, -0.13, 0.03],
          [side * 0.09, -0.115, 0.01],
          [side * 0.125, -0.145, -0.015]
        ],
        0.009,
        14,
        8,
        (t) => 0.8 + t * 0.45
      ),
      reproMat
    );
    const ovary = new THREE.Mesh(
      buildSculptedLobeGeometry(0.024, 0.018, 0.016, 12, 10, () => {}),
      ovaryMat
    );
    ovary.position.set(side * 0.115, -0.16, -0.012);
    reproductiveGroup.add(tube, ovary);
  }
  tagOrgan(reproductiveGroup, 'reproductive_pelvic', 'Hệ Sinh sản (Tử cung · Ống dẫn · Buồng trứng)', 'reproductive');
  interactables.push(reproductiveGroup);

  // =========================================================
  // 12. SENSORY ORGANS (Bilateral Eyes, Optic Tracts & Inner Ear Cochlea)
  // =========================================================
  const sensoryGroup = new THREE.Group();
  systemGroups.sensory.add(sensoryGroup);
  organGroups.set('sensory_organs', sensoryGroup);

  const scleraMat = vault.getMaterial('compact_bone', { color: 0xf8fafc, roughness: 0.2 });
  const irisMat = vault.getMaterial('lipid_membrane', { color: 0x0284c7, roughness: 0.18 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.15 });
  const cochleaMat = vault.getMaterial('cartilage', { color: 0x7dd3fc, roughness: 0.25 });

  for (const side of [-1, 1]) {
    const eyeGrp = new THREE.Group();
    eyeGrp.position.set(side * 0.058, 1.435, 0.155);

    const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 14), scleraMat);
    const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.008, 16), irisMat);
    iris.rotation.x = Math.PI / 2;
    iris.position.z = 0.029;
    const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.01, 14), pupilMat);
    pupil.rotation.x = Math.PI / 2;
    pupil.position.z = 0.03;
    eyeGrp.add(sclera, iris, pupil);

    const opticNerve = new THREE.Mesh(
      buildTube(
        [
          [side * 0.058, 1.435, 0.125],
          [side * 0.03, 1.43, 0.06],
          [0, 1.425, 0.025]
        ],
        0.0075,
        10,
        8
      ),
      nerveMat
    );

    // Spiral cochlea + semicircular labyrinth inside temporal bone
    const cochleaPts: Array<[number, number, number]> = [];
    for (let k = 0; k <= 18; k++) {
      const t = k / 18;
      const ang = t * Math.PI * 4;
      const r = 0.022 * (1 - t * 0.72);
      cochleaPts.push([
        side * (0.175 + t * 0.018),
        1.41 + Math.sin(ang) * r,
        -0.015 + Math.cos(ang) * r
      ]);
    }
    const cochlea = new THREE.Mesh(buildTube(cochleaPts, 0.005, 18, 6), cochleaMat);
    const semiLoop = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0035, 8, 16), cochleaMat);
    semiLoop.position.set(side * 0.17, 1.435, -0.028);
    semiLoop.rotation.y = Math.PI / 2;

    const vestibNerve = new THREE.Mesh(
      buildTube(
        [
          [side * 0.165, 1.415, -0.02],
          [side * 0.09, 1.4, -0.035],
          [side * 0.02, 1.385, -0.045]
        ],
        0.0055,
        8,
        6
      ),
      nerveMat
    );

    sensoryGroup.add(eyeGrp, opticNerve, cochlea, semiLoop, vestibNerve);
  }
  tagOrgan(sensoryGroup, 'sensory_organs', 'Cơ quan Giác quan (Mắt · Dây thị giác · Ốc tai)', 'sensory');
  interactables.push(sensoryGroup);

  // =========================================================
  // DYNAMIC VISIBILITY, EXPLODE, & PHYSIOLOGICAL ANIMATION
  // =========================================================
  const allOrganIds = Array.from(organGroups.keys());

  const applyState = (cfg: AnatomyVisibilityConfig, simTime: number, bpm = 72) => {
    const exp = cfg.explode;

    // Layer enables + transparency sliders + X-Ray mode
    const sOpacity = cfg.xray ? Math.min(0.14, cfg.skinOpacity) : cfg.skinOpacity;
    skinGroup.visible = sOpacity > 0.02 && (!cfg.isolatedPartId);
    skinMat.opacity = sOpacity;
    skinMat.transparent = true;
    skinMat.depthWrite = sOpacity > 0.72;

    const mOpacity = cfg.xray ? Math.min(0.16, cfg.muscleOpacity) : cfg.muscleOpacity;
    muscleMat.opacity = mOpacity;
    muscleMat.transparent = mOpacity < 0.99;
    muscleMat.depthWrite = mOpacity > 0.72;

    const bOpacity = cfg.xray ? Math.min(0.28, cfg.boneOpacity) : cfg.boneOpacity;
    boneMat.opacity = bOpacity;
    boneMat.transparent = bOpacity < 0.99;
    boneMat.depthWrite = bOpacity > 0.72;

    // Lung gentle breath + transparency so heart/bronchi show subtly
    const breathPhase = Math.sin(simTime * 1.45);
    respGroup.scale.set(1 + breathPhase * 0.022, 1 + breathPhase * 0.015, 1 + breathPhase * 0.022);
    lungMat.opacity = cfg.xray ? 0.35 : 0.88;

    // Heart systolic-diastolic beat synced to BPM
    const beatCycle = (simTime * (bpm / 60)) % 1;
    const systole = Math.exp(-Math.pow((beatCycle - 0.22) * 11, 2)) * 0.075;
    heartCluster.scale.setScalar(1 + systole);

    // Smooth layer explosion offsets along anatomical axes for inspection
    systemGroups.muscular.position.set(0, 0, exp * 0.42);
    systemGroups.skeletal.position.set(0, 0, -exp * 0.26);
    systemGroups.respiratory.position.set(0, exp * 0.16, exp * 0.22);
    systemGroups.circulatory.position.set(exp * 0.28, exp * 0.06, exp * 0.24);
    liverGroup.position.set(-exp * 0.34, 0, exp * 0.22);
    giGroup.position.set(exp * 0.16, -exp * 0.14, exp * 0.28);
    systemGroups.urinary.position.set(0, -exp * 0.18, -exp * 0.28);
    systemGroups.nervous.position.set(0, exp * 0.32, -exp * 0.18);
    systemGroups.endocrine.position.set(-exp * 0.22, 0.02 * exp, exp * 0.12);
    systemGroups.lymphatic.position.set(exp * 0.24, exp * 0.04, exp * 0.18);
    systemGroups.reproductive.position.set(0, -exp * 0.26, exp * 0.22);
    systemGroups.sensory.position.set(0, exp * 0.24, exp * 0.26);

    // Apply system enables + per-organ Hide/Show & Isolate decisions
    const visInput = {
      allPartIds: allOrganIds,
      hiddenPartIds: cfg.hiddenPartIds,
      isolatedPartId: cfg.isolatedPartId
    };

    for (const [orgId, grp] of organGroups.entries()) {
      const sysKey = grp.userData.systemKey as AnatomySystemKey;
      const sysOn = cfg.enabledSystems[sysKey];
      const decision = resolvePartVisibilityState(orgId, visInput);

      grp.visible = Boolean(sysOn && decision.visible);
      if (sysKey === 'muscular' && mOpacity <= 0.02 && cfg.isolatedPartId !== orgId) {
        grp.visible = false;
      }
      if (sysKey === 'skeletal' && bOpacity <= 0.02 && cfg.isolatedPartId !== orgId) {
        grp.visible = false;
      }

      // Dim non-isolated siblings cleanly when Isolate mode is active, and restore when cleared
      grp.traverse((child) => {
        const m = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
        if (!m || !('opacity' in m)) return;
        if (m.userData.__origOpacity === undefined) {
          m.userData.__origOpacity = m.opacity;
          m.userData.__origTransparent = m.transparent;
        }
        // Muscle, bone, and lungs manage their own dynamic opacity above; handle other visceral organs safely
        const isManagedLayerMat = m === muscleMat || m === boneMat || m === lungMat;
        if (decision.dimmed) {
          m.transparent = true;
          m.opacity = Math.min(m.opacity, 0.14);
          m.depthWrite = false;
        } else if (!isManagedLayerMat) {
          m.transparent = Boolean(m.userData.__origTransparent);
          m.opacity = Number(m.userData.__origOpacity ?? 1);
          m.depthWrite = !m.transparent || m.opacity > 0.72;
        }
      });
    }
  };

  const proceduralChildrenBackup = new Map<string, THREE.Object3D[]>();
  const gltfOverrides = new Map<string, THREE.Group>();

  const replaceOrganWithGltf = (organId: string, gltfGroup: THREE.Group): boolean => {
    const targetGrp = organGroups.get(organId);
    if (!targetGrp) return false;

    if (!proceduralChildrenBackup.has(organId)) {
      proceduralChildrenBackup.set(organId, [...targetGrp.children]);
    }
    const existingGltf = gltfOverrides.get(organId);
    if (existingGltf) {
      targetGrp.remove(existingGltf);
    }
    for (const ch of proceduralChildrenBackup.get(organId) || []) {
      ch.visible = false;
    }

    const sysKey = (targetGrp.userData.systemKey as AnatomySystemKey) || 'circulatory';
    const label = String(targetGrp.userData.partLabel || organId);
    tagOrgan(gltfGroup, organId, label, sysKey);
    gltfGroup.userData.focusAnchorFor = organId;
    gltfGroup.userData.isGltfOverride = true;
    targetGrp.add(gltfGroup);
    gltfOverrides.set(organId, gltfGroup);
    return true;
  };

  const restoreProceduralOrgan = (organId: string): boolean => {
    const targetGrp = organGroups.get(organId);
    const existingGltf = gltfOverrides.get(organId);
    if (!targetGrp || !existingGltf) return false;
    targetGrp.remove(existingGltf);
    gltfOverrides.delete(organId);
    for (const ch of proceduralChildrenBackup.get(organId) || []) {
      ch.visible = true;
    }
    return true;
  };

  const hasGltfOverride = (organId: string): boolean => gltfOverrides.has(organId);

  return {
    root,
    interactables,
    systemGroups,
    skinGroup,
    organGroups,
    replaceOrganWithGltf,
    restoreProceduralOrgan,
    hasGltfOverride,
    applyState
  };
}
