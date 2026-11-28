import * as THREE from 'three';
import { BioMaterialVault } from './bioMaterials';

export type VertebrateSystemId =
  | 'animal_mammal'
  | 'animal_bird'
  | 'animal_amphibian'
  | 'animal_fish';

export type SandboxRegisterOrganFn = (
  id: string,
  group: THREE.Group,
  animate?: (elapsed: number, rate: number) => void
) => void;

function makeSculptedBlob(
  rx: number,
  ry: number,
  rz: number,
  segW = 22,
  segH = 16,
  deform?: (v: THREE.Vector3, n: THREE.Vector3) => void
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, segW, segH);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.copy(v).normalize();
    v.set(v.x * rx, v.y * ry, v.z * rz);
    if (deform) deform(v, n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function makeTube(
  pts: Array<[number, number, number]>,
  radius: number,
  tubSeg = 24,
  radSeg = 12,
  taper?: (t: number) => number
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const geo = new THREE.TubeGeometry(curve, tubSeg, radius, radSeg, false);
  if (!taper) return geo;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  const stride = radSeg + 1;
  for (let i = 0; i <= tubSeg; i++) {
    const t = i / tubSeg;
    curve.getPointAt(t, c);
    const scale = taper(t);
    for (let j = 0; j < stride; j++) {
      const idx = i * stride + j;
      if (idx >= pos.count) break;
      v.fromBufferAttribute(pos, idx);
      v.sub(c).multiplyScalar(scale).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function makeFinShapeGeometry(points: Array<[number, number]>, thickness = 0.025): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.35,
    bevelSize: thickness * 0.3,
    bevelSegments: 2
  });
  geo.center();
  return geo;
}

/**
 * Builds high-detail comparative vertebrate anatomical models (Mammal, Bird, Amphibian, Fish)
 * using BioMaterialVault procedural PBR tissue materials and sculpted composite geometries.
 */
export function buildVertebrateAnimalScene(
  systemId: VertebrateSystemId,
  shell: THREE.Group,
  vault: BioMaterialVault,
  isLowEnd: boolean,
  registerOrgan: SandboxRegisterOrganFn
): void {
  const seg = isLowEnd ? 16 : 24;

  const xrayShellMat = (hex: number, opacity = 0.14) =>
    vault.createUniqueMaterial('cartilage', {
      color: hex,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      roughness: 0.28
    });

  // =========================================================================
  // 1. MAMMAL (RABBIT — 4-Chamber Heart, Diaphragm Lungs, Skull, Large Cecum)
  // =========================================================================
  if (systemId === 'animal_mammal') {
    const bodyShell = new THREE.Mesh(
      makeSculptedBlob(1.75, 0.85, 0.72, seg, 16, (v) => {
        if (v.x < -0.9) v.y += 0.22 * (-v.x - 0.9);
        if (v.x > 0.6) v.y -= 0.08 * (v.x - 0.6);
      }),
      xrayShellMat(0xf43f5e, 0.12)
    );
    shell.add(bodyShell);

    // Cranium + Brain + Folded Mammal Ears
    const skullG = new THREE.Group();
    const boneMat = vault.getMaterial('compact_bone', { opacity: 0.78, transparent: true });
    const brainMat = vault.getMaterial('brain_cortex');
    const pinnaMat = vault.getMaterial('skin_shell', { color: 0xf4a89c, opacity: 0.76, transparent: true });

    const skullMesh = new THREE.Mesh(
      makeSculptedBlob(0.52, 0.36, 0.31, seg, 14, (v) => {
        // Taper anteriorly (-x) toward rostrum/snout
        if (v.x < -0.1) {
          const t = Math.min(1, (-v.x - 0.1) / 0.42);
          v.y *= 1 - t * 0.48;
          v.z *= 1 - t * 0.52;
        }
      }),
      boneMat
    );
    skullMesh.position.set(-1.32, 0.48, 0);
    const cerebrum = new THREE.Mesh(makeSculptedBlob(0.24, 0.19, 0.21, 18, 12), brainMat);
    cerebrum.position.set(-1.16, 0.56, 0);
    skullG.add(skullMesh, cerebrum);

    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(
        makeSculptedBlob(0.11, 0.52, 0.045, 14, 12, (v) => {
          if (v.z > 0) v.z *= 0.35;
          v.x -= v.y * 0.22;
        }),
        pinnaMat
      );
      ear.position.set(-0.98, 1.05, side * 0.14);
      ear.rotation.z = -0.35;
      skullG.add(ear);
    }
    registerOrgan('mammal_brain_skull', skullG);

    // 4-Chamber Mammal Heart
    const mhG = new THREE.Group();
    const myoMat = vault.getMaterial('cardiac_muscle');
    const artMat = vault.getMaterial('arterial_vessel');
    const veinMat = vault.getMaterial('venous_vessel');

    const mhVent = new THREE.Mesh(
      makeSculptedBlob(0.29, 0.36, 0.26, seg, 14, (v) => {
        if (v.y < 0) {
          const t = Math.abs(v.y) / 0.36;
          v.x *= 1 - t * 0.45;
          v.z *= 1 - t * 0.35;
        }
      }),
      myoMat
    );
    mhVent.position.set(-0.46, -0.22, 0.12);
    mhVent.rotation.z = 0.25;
    const mhRA = new THREE.Mesh(makeSculptedBlob(0.13, 0.12, 0.12, 12, 10), veinMat);
    mhRA.position.set(-0.56, 0.04, 0.02);
    const mhLA = new THREE.Mesh(makeSculptedBlob(0.13, 0.12, 0.12, 12, 10), artMat);
    mhLA.position.set(-0.34, 0.05, 0.18);
    const mhAorta = new THREE.Mesh(
      makeTube(
        [
          [-0.45, -0.02, 0.1],
          [-0.52, 0.26, 0.06],
          [-0.25, 0.34, -0.04],
          [0.35, 0.22, -0.08]
        ],
        0.055,
        18,
        8
      ),
      artMat
    );
    mhG.add(mhVent, mhRA, mhLA, mhAorta);
    registerOrgan('mammal_heart', mhG, (t, bpm) => {
      const b = Math.pow(Math.max(0, Math.sin((t * bpm * Math.PI) / 60)), 6);
      mhVent.scale.setScalar(1 - b * 0.085);
    });

    // Multi-Lobe Lungs + Ringed Trachea + Muscular Diaphragm
    const mlG = new THREE.Group();
    const lungMat = vault.getMaterial('lung_parenchyma', { opacity: 0.9, transparent: true });
    const tracheaMat = vault.getMaterial('cartilage');
    const diaMat = vault.getMaterial('skeletal_muscle', { color: 0xbe2b37 });

    const mTrachea = new THREE.Mesh(
      makeTube(
        [
          [-1.08, 0.44, 0],
          [-0.65, 0.32, 0],
          [-0.36, 0.24, 0]
        ],
        0.055,
        14,
        10
      ),
      tracheaMat
    );
    mlG.add(mTrachea);

    for (const side of [-1, 1]) {
      const lung = new THREE.Mesh(
        makeSculptedBlob(0.46, 0.29, 0.23, seg, 14, (v) => {
          if (v.x < -0.1) v.y *= 0.72;
          if (v.x > 0.25) v.x *= 0.9;
        }),
        lungMat
      );
      lung.position.set(-0.24, 0.15, side * 0.25);
      mlG.add(lung);
    }

    const diaphragm = new THREE.Mesh(
      makeSculptedBlob(0.11, 0.48, 0.44, 18, 12, (v) => {
        if (v.x > 0) v.x *= 0.25;
      }),
      diaMat
    );
    diaphragm.position.set(0.24, 0.02, 0);
    mlG.add(diaphragm);
    registerOrgan('mammal_lungs_diaphragm', mlG, (t, r) => {
      const inh = 1 + 0.055 * Math.sin(t * (r / 20));
      mlG.scale.set(1, inh, inh);
    });

    // Herbivore Stomach + Spiral Large Cecum
    const cecG = new THREE.Group();
    const giMat = vault.getMaterial('gastric_mucosa', { color: 0xe3844f });
    const cecMat = vault.getMaterial('gastric_mucosa', { color: 0xd96b27 });
    const stomach = new THREE.Mesh(
      makeSculptedBlob(0.28, 0.24, 0.21, 16, 12),
      giMat
    );
    stomach.position.set(0.48, 0.16, 0.1);
    const cecumTube = new THREE.Mesh(
      makeTube(
        [
          [0.52, 0.08, 0.12],
          [0.92, 0.12, 0.26],
          [1.32, -0.04, 0.1],
          [1.15, -0.28, -0.22],
          [0.62, -0.34, -0.18],
          [0.45, -0.18, 0.04]
        ],
        0.165,
        36,
        12,
        (t) => 0.72 + Math.sin(t * Math.PI * 10) * 0.16
      ),
      cecMat
    );
    cecG.add(stomach, cecumTube);
    registerOrgan('mammal_cecum', cecG);
  }

  // =========================================================================
  // 2. BIRD (PIGEON — Parabronchial Lungs, 9 Air Sacs, High-BPM Heart, Keel)
  // =========================================================================
  else if (systemId === 'animal_bird') {
    const bodyShell = new THREE.Mesh(
      makeSculptedBlob(1.62, 0.92, 0.76, seg, 16, (v) => {
        if (v.x < -0.9) v.y += 0.35;
        if (v.x > 0.8) {
          v.y *= 0.45;
          v.z *= 0.45;
        }
      }),
      xrayShellMat(0x22d3ee, 0.12)
    );
    const tailFan = new THREE.Mesh(
      makeFinShapeGeometry(
        [
          [0, -0.12],
          [0.85, -0.32],
          [0.92, 0.32],
          [0, 0.12]
        ],
        0.04
      ),
      xrayShellMat(0x38bdf8, 0.18)
    );
    tailFan.rotation.x = Math.PI / 2;
    tailFan.position.set(1.68, 0.08, 0);
    shell.add(bodyShell, tailFan);

    // Rigid Parabronchial Lungs + Syrinx & Trachea
    const bLungG = new THREE.Group();
    const tracheaMat = vault.getMaterial('cartilage');
    const pLungMat = vault.getMaterial('lung_parenchyma', { color: 0xe64865 });
    const bTrachea = new THREE.Mesh(
      makeTube(
        [
          [-1.12, 0.75, 0],
          [-0.72, 0.56, 0],
          [-0.36, 0.42, 0]
        ],
        0.068,
        16,
        10
      ),
      tracheaMat
    );
    bLungG.add(bTrachea);
    for (const side of [-1, 1]) {
      const pLung = new THREE.Mesh(
        makeSculptedBlob(0.38, 0.17, 0.18, seg, 12, (v) => {
          // Dorsal costal rib impressions on avian lung
          v.y -= Math.abs(Math.sin(v.x * 16)) * 0.018;
        }),
        pLungMat
      );
      pLung.position.set(-0.15, 0.44, side * 0.24);
      bLungG.add(pLung);
    }
    registerOrgan('bird_lungs', bLungG);

    // 9 Translucent Pneumatic Air Sacs with Bellows Counter-Phase Animation
    const sacG = new THREE.Group();
    const sacMat = vault.createUniqueMaterial('lipid_membrane', {
      color: 0x38bdf8,
      opacity: 0.54,
      transparent: true,
      roughness: 0.18
    });
    const sacSpecs: Array<[number, number, number, number, number, number]> = [
      [-0.78, 0.22, 0, 0.2, 0.16, 0.16], // Interclavicular
      [-0.58, 0.14, 0.34, 0.18, 0.15, 0.15], // Cervical L
      [-0.58, 0.14, -0.34, 0.18, 0.15, 0.15], // Cervical R
      [0.06, 0.12, 0.32, 0.22, 0.17, 0.17], // Ant thoracic L
      [0.06, 0.12, -0.32, 0.22, 0.17, 0.17], // Ant thoracic R
      [0.48, 0.1, 0.35, 0.26, 0.2, 0.2], // Post thoracic L
      [0.48, 0.1, -0.35, 0.26, 0.2, 0.2], // Post thoracic R
      [0.98, 0.06, 0.28, 0.34, 0.24, 0.22], // Abdominal L
      [0.98, 0.06, -0.28, 0.34, 0.24, 0.22] // Abdominal R
    ];
    const sacMeshes: THREE.Mesh[] = [];
    sacSpecs.forEach(([x, y, z, rx, ry, rz]) => {
      const m = new THREE.Mesh(makeSculptedBlob(rx, ry, rz, 16, 12), sacMat);
      m.position.set(x, y, z);
      sacG.add(m);
      sacMeshes.push(m);
    });
    registerOrgan('bird_air_sacs', sacG, (t, rate) => {
      const phase = Math.sin(t * (rate / 12));
      sacMeshes.forEach((m, idx) => {
        const isPost = idx >= 5;
        m.scale.setScalar(1 + 0.14 * (isPost ? phase : -phase));
      });
    });

    // Large 4-Chamber Avian Heart (Right Aortic Arch)
    const bhG = new THREE.Group();
    const bHeartVent = new THREE.Mesh(
      makeSculptedBlob(0.28, 0.38, 0.26, seg, 14, (v) => {
        if (v.y < 0) v.x *= 0.65 + (v.y + 0.38) * 0.9;
      }),
      vault.getMaterial('cardiac_muscle')
    );
    bHeartVent.position.set(-0.55, -0.15, 0);
    const bAorta = new THREE.Mesh(
      makeTube(
        [
          [-0.54, 0.08, 0],
          [-0.64, 0.32, -0.12],
          [-0.36, 0.36, -0.16]
        ],
        0.055,
        14,
        8
      ),
      vault.getMaterial('arterial_vessel')
    );
    bhG.add(bHeartVent, bAorta);
    registerOrgan('bird_heart', bhG, (t, r) => {
      const b = Math.pow(Math.max(0, Math.sin(t * (r / 8))), 4);
      bHeartVent.scale.setScalar(1 - b * 0.085);
    });

    // Sculpted Keel (Carina Sterni) Bone + Pectoral Anchors
    const keelG = new THREE.Group();
    const keelBlade = new THREE.Mesh(
      makeFinShapeGeometry(
        [
          [-0.72, 0.18],
          [0.65, 0.14],
          [0.45, -0.18],
          [-0.45, -0.34],
          [-0.78, -0.14]
        ],
        0.09
      ),
      vault.getMaterial('compact_bone')
    );
    keelBlade.position.set(-0.1, -0.66, 0);
    const coracoidL = new THREE.Mesh(
      makeTube(
        [
          [-0.68, -0.46, 0.08],
          [-0.78, -0.18, 0.26]
        ],
        0.045,
        10,
        8
      ),
      vault.getMaterial('compact_bone')
    );
    const coracoidR = coracoidL.clone();
    coracoidR.position.z = -0.34;
    keelG.add(keelBlade, coracoidL, coracoidR);
    registerOrgan('bird_keel', keelG);
  }

  // =========================================================================
  // 3. AMPHIBIAN (FROG — Cutaneous Capillary Skin, 3-Chamber Heart, Sac Lungs)
  // =========================================================================
  else if (systemId === 'animal_amphibian') {
    // Moist Vascularized Frog Skin + Hindlimb Silhouette
    const skinG = new THREE.Group();
    const skinMat = vault.createUniqueMaterial('bacterial_capsule', {
      color: 0x10b981,
      opacity: 0.36,
      transparent: true,
      roughness: 0.22
    });
    const frogTorso = new THREE.Mesh(
      makeSculptedBlob(1.48, 0.72, 0.96, seg, 16, (v) => {
        if (v.x < -0.5) v.y *= 0.82;
        if (v.y < 0) v.y *= 0.58;
      }),
      skinMat
    );
    skinG.add(frogTorso);

    // Cutaneous capillary vessels etched over dorsal skin
    const capMat = vault.getMaterial('arterial_vessel', { color: 0xe11d48 });
    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(
        makeSculptedBlob(0.55, 0.25, 0.28, 16, 12),
        skinMat
      );
      leg.position.set(0.85, -0.22, side * 0.78);
      leg.rotation.y = side * 0.35;
      const capBranch = new THREE.Mesh(
        makeTube(
          [
            [-0.75, 0.32, side * 0.28],
            [-0.1, 0.56, side * 0.42],
            [0.65, 0.44, side * 0.35]
          ],
          0.022,
          18,
          8
        ),
        capMat
      );
      skinG.add(leg, capBranch);
    }
    registerOrgan('amph_skin', skinG);

    // 3-Chamber Amphibian Heart (2 Atria + 1 Common Ventricle + Conus Arteriosus)
    const h3G = new THREE.Group();
    const mixedMat = vault.createUniqueMaterial('cardiac_muscle', { color: 0xa855f7 });
    const vent3 = new THREE.Mesh(
      makeSculptedBlob(0.3, 0.34, 0.28, seg, 14, (v) => {
        if (v.y < 0) {
          v.x *= 0.72;
          v.z *= 0.72;
        }
      }),
      mixedMat
    );
    vent3.position.set(-0.2, -0.18, 0.12);
    const atrL = new THREE.Mesh(makeSculptedBlob(0.18, 0.16, 0.16, 14, 10), vault.getMaterial('arterial_vessel'));
    atrL.position.set(-0.36, 0.12, 0.24);
    const atrR = new THREE.Mesh(makeSculptedBlob(0.18, 0.16, 0.16, 14, 10), vault.getMaterial('venous_vessel'));
    atrR.position.set(-0.36, 0.12, -0.02);
    const conus = new THREE.Mesh(
      makeTube(
        [
          [-0.2, 0.04, 0.12],
          [-0.45, 0.28, 0.14],
          [-0.55, 0.38, 0.32]
        ],
        0.045,
        14,
        8
      ),
      mixedMat
    );
    h3G.add(vent3, atrL, atrR, conus);
    registerOrgan('amph_heart_3', h3G, (t, r) => {
      const beat = Math.pow(Math.max(0, Math.sin(t * (r / 12))), 5);
      vent3.scale.setScalar(1 - beat * 0.085);
    });

    // Saccular Lungs + Buccal Trachea
    const plG = new THREE.Group();
    const lungMat = vault.getMaterial('lung_parenchyma', { opacity: 0.84, transparent: true });
    for (const side of [-1, 1]) {
      const sac = new THREE.Mesh(
        makeSculptedBlob(0.45, 0.26, 0.24, seg, 14, (v, n) => {
          v.addScaledVector(n, Math.sin(v.x * 16) * Math.cos(v.y * 16) * 0.012);
        }),
        lungMat
      );
      sac.position.set(0.16, 0.12, side * 0.42);
      plG.add(sac);
    }
    registerOrgan('amph_lungs', plG, (t, r) => {
      plG.scale.setScalar(1 + 0.075 * Math.sin(t * (r / 15)));
    });
  }

  // =========================================================================
  // 4. FISH (TELEOST — 2-Chamber Heart, 4 Pairs Countercurrent Gills, Swim Bladder, Lateral Line)
  // =========================================================================
  else if (systemId === 'animal_fish') {
    const fishBody = new THREE.Mesh(
      makeSculptedBlob(2.15, 0.82, 0.46, seg, 16, (v) => {
        // Streamlined fusiform profile tapering strongly at peduncle (+x)
        if (v.x > 0.4) {
          const t = (v.x - 0.4) / 1.75;
          v.y *= 1 - t * 0.72;
          v.z *= 1 - t * 0.7;
        }
        if (v.x < -1.1) {
          const t = (-v.x - 1.1) / 1.05;
          v.y *= 1 - t * 0.45;
          v.z *= 1 - t * 0.55;
        }
      }),
      xrayShellMat(0x06b6d4, 0.14)
    );
    const dorsalFin = new THREE.Mesh(
      makeFinShapeGeometry(
        [
          [-0.4, 0],
          [0.05, 0.62],
          [0.72, 0.28],
          [0.55, 0]
        ],
        0.028
      ),
      xrayShellMat(0x22d3ee, 0.22)
    );
    dorsalFin.position.set(0.15, 0.92, 0);

    const caudalFin = new THREE.Mesh(
      makeFinShapeGeometry(
        [
          [-0.35, -0.14],
          [0.45, -0.78],
          [0.25, 0],
          [0.45, 0.78],
          [-0.35, 0.14]
        ],
        0.028
      ),
      xrayShellMat(0x22d3ee, 0.24)
    );
    caudalFin.position.set(2.38, 0, 0);
    shell.add(fishBody, dorsalFin, caudalFin);

    // 2-Chamber Heart + Ventral Aorta Feeding Gills
    const fhG = new THREE.Group();
    const veinMat = vault.getMaterial('venous_vessel');
    const ventMat = vault.getMaterial('cardiac_muscle', { color: 0x3b82f6 });
    const fVent = new THREE.Mesh(makeSculptedBlob(0.24, 0.22, 0.21, 18, 12), ventMat);
    fVent.position.set(-1.12, -0.34, 0);
    const fAtrium = new THREE.Mesh(makeSculptedBlob(0.18, 0.17, 0.17, 16, 12), veinMat);
    fAtrium.position.set(-0.86, -0.24, 0);
    const ventralAorta = new THREE.Mesh(
      makeTube(
        [
          [-1.12, -0.26, 0],
          [-1.08, -0.12, 0],
          [-0.95, 0.04, 0]
        ],
        0.045,
        12,
        8
      ),
      veinMat
    );
    fhG.add(fVent, fAtrium, ventralAorta);
    registerOrgan('fish_heart_2', fhG, (t, r) => {
      const b = Math.pow(Math.max(0, Math.sin(t * (r / 14))), 5);
      fhG.scale.setScalar(1 - b * 0.085);
    });

    // 4 Pairs of Countercurrent Gill Arches + Filaments
    const gillG = new THREE.Group();
    const archMat = vault.getMaterial('compact_bone', { color: 0xe2e8f0 });
    const lamellaMat = vault.getMaterial('arterial_vessel', { color: 0xef4444 });
    for (let i = 0; i < 4; i++) {
      for (const side of [-1, 1]) {
        const arc = new THREE.Mesh(
          new THREE.TorusGeometry(0.32 - i * 0.015, 0.022, 8, 18, Math.PI * 0.88),
          archMat
        );
        arc.position.set(-1.08 + i * 0.105, 0.05, side * 0.2);
        arc.rotation.z = -Math.PI * 0.44;
        gillG.add(arc);

        const filamentFringe = new THREE.Mesh(
          new THREE.TorusGeometry(0.345 - i * 0.015, 0.026, 8, 18, Math.PI * 0.85),
          lamellaMat
        );
        filamentFringe.position.set(-1.06 + i * 0.105, 0.05, side * 0.2);
        filamentFringe.rotation.z = -Math.PI * 0.43;
        gillG.add(filamentFringe);
      }
    }
    registerOrgan('fish_gills', gillG, (t, r) => {
      gillG.scale.z = 1 + 0.08 * Math.sin(t * (r / 14));
    });

    // Sculpted 2-Chamber Swim Bladder
    const sbG = new THREE.Group();
    const sbMat = vault.createUniqueMaterial('lipid_membrane', {
      color: 0xe0f2fe,
      opacity: 0.74,
      transparent: true,
      roughness: 0.15
    });
    const sbAnt = new THREE.Mesh(makeSculptedBlob(0.45, 0.22, 0.22, 18, 12), sbMat);
    sbAnt.position.set(-0.08, 0.28, 0);
    const sbPost = new THREE.Mesh(
      makeSculptedBlob(0.55, 0.2, 0.2, 18, 12, (v) => {
        if (v.x > 0.1) v.y *= 1 - (v.x - 0.1) * 0.5;
      }),
      sbMat
    );
    sbPost.position.set(0.62, 0.26, 0);
    sbG.add(sbAnt, sbPost);
    registerOrgan('fish_swim_bladder', sbG, (t, r) => {
      sbG.scale.setScalar(1 + 0.03 * Math.sin(t * (r / 20)));
    });

    // Bilateral Lateral Line Sensory Canals + Neuromast Nodes
    const latG = new THREE.Group();
    const canalMat = vault.getMaterial('nerve_myelin', { color: 0x22d3ee });
    for (const side of [-1, 1]) {
      const canalPts: Array<[number, number, number]> = [
        [-0.85, 0.12, side * 0.3],
        [-0.1, 0.15, side * 0.44],
        [0.8, 0.1, side * 0.35],
        [1.75, 0.03, side * 0.14]
      ];
      latG.add(new THREE.Mesh(makeTube(canalPts, 0.026, 20, 8), canalMat));
      for (const [nx, ny, nz] of canalPts) {
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), canalMat);
        node.position.set(nx, ny, nz);
        latG.add(node);
      }
    }
    registerOrgan('fish_lateral_line', latG);
  }
}
